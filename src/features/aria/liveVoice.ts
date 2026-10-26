import type { VoiceTap } from "./BpeLivePresenceAdapter";
import { createBrowserSpeech, type BrowserSpeech, type SpeechCallbacks, type SpeechOutcome, type SpeechVoiceInfo } from "./speechFallback";
import type { LiveAdvisorClient } from "./liveAdvisorClient";
import type { AdvisorLanguageCode, TtsChunk } from "./protocol";
// Advisor voice for live replies: ElevenLabs speech streamed from the local
// server as PCM, scheduled on one WebAudio clock. That clock (not the text
// stream, not wall time) is the playback timeline other features follow:
// narration cues read playbackMs() and the per-character timing returned by
// ElevenLabs.
//
// VA-R2-UX-01: a live reply is voiced sentence by sentence while the model is
// still writing it. Each finished sentence becomes one TTS segment (exactly a
// slice of the reply's clean text, checked by the server); segments play back
// to back on the same clock and their character timing is merged into one
// timeline for the whole reply. Replays of a reply use the audio already
// received (no second synthesis). Replies that were not produced by the live
// advisor, or any failure before audio starts, fall back to the browser voice
// and say so.
export type VoiceSource = "elevenlabs" | "browser-voice";
export type SpokenTimeline = {
  turnId: string;
  text: string;
  /** Start time (ms from the first audio sample) of each character of `text`; NaN when unknown. */
  charStartMs: number[];
  charEndMs: number[];
};
/** Per-reply voice timing (performance.now ms) for the latency report. */
export type VoiceMarks = {
  turnId: string;
  firstSegmentRequestedAt: number | null;
  firstAudioReceivedAt: number | null;
  playbackStartedAt: number | null;
  segments: number;
  characters: number;
  model: string | null;
};
export type LiveVoice = BrowserSpeech & {
  /** Declare a whole live reply so speak(text) voices (or replays) it through ElevenLabs. */
  registerReply(turnId: string, text: string, language: AdvisorLanguageCode): void;
  /** Open a streamed reply; speak(key) plays its sentences as they are written. Returns the key. */
  beginStream(turnId: string): string;
  /** The reply's clean text so far (the whole text, not a delta). */
  streamText(turnId: string, text: string): void;
  setStreamLanguage(turnId: string, language: AdvisorLanguageCode): void;
  /** The reply is complete: voice what is left. */
  endStream(turnId: string, text: string, language: AdvisorLanguageCode): void;
  /** Nothing more will be written (error or stop): finish what was voiced. */
  abandonStream(turnId: string): void;
  /** The model paused (a tool is running): voice what is already written now. */
  flushStream(turnId: string): void;
  /** Milliseconds of audio played for the current utterance (pauses freeze it), or null. */
  playbackMs(): number | null;
  timeline(): SpokenTimeline | null;
  source(): VoiceSource | null;
  /** A reply is playing or about to play (streamed reply still waiting for audio included). */
  isActive(): boolean;
  pause(): void;
  resume(): void;
  isPaused(): boolean;
  subscribe(listener: () => void): () => void;
  lastError(): string | null;
  marks(turnId: string): VoiceMarks | null;
};
type Registered = { turnId: string; language: AdvisorLanguageCode };
type Segment = { offset: number; text: string };
type StreamReply = {
  turnId: string;
  key: string;
  text: string;
  language: AdvisorLanguageCode | null;
  ended: boolean;
  /** Characters of `text` already split into segments. */
  segmented: number;
  segments: Segment[];
  wake: (() => void) | null;
};
/** One received audio chunk, kept for replays: where its text starts in the reply. */
type RecordedChunk = { offset: number; chunk: Extract<TtsChunk, { kind: "audio" }> };
const streamPrefix = "⁣live-stream:";
const abbreviations = /(?:^|\s)(?:St|Dr|Mr|Mrs|Ms|Mt|No|approx|ca|e\.g|i\.e|т\.е|т\.д|т\.п|г|ул|кв|св)\.$/i;
function decodePcm16(base64: string) {
  const binary = atob(base64);
  const samples = new Float32Array(binary.length >> 1);
  for (let index = 0; index < samples.length; index += 1) {
    const low = binary.charCodeAt(index * 2);
    const high = binary.charCodeAt(index * 2 + 1);
    const value = (high << 8) | low;
    samples[index] = (value >= 0x8000 ? value - 0x10000 : value) / 0x8000;
  }
  return samples;
}
/**
 * End index (exclusive) of the next segment to voice from `from`, or null when the
 * text written so far does not hold one yet. A segment ends at a sentence end that
 * is followed by more text (so "9.8" or a sentence still being written never split),
 * groups the sentences already available up to ~240 characters, and never cuts a
 * long sentence without punctuation before ~280 characters.
 */
export function nextSegmentEnd(text: string, from: number, ended: boolean, first: boolean): number | null {
  const sentenceEnd = /[.!?…]+["»”')\]]*(?=\s)|\n+/g;
  sentenceEnd.lastIndex = from;
  let best: number | null = null;
  let match: RegExpExecArray | null;
  const minimum = first ? 8 : 24;
  while ((match = sentenceEnd.exec(text))) {
    const end = match.index + match[0].length;
    const segment = text.slice(from, end).trim();
    if (abbreviations.test(text.slice(Math.max(from, end - 8), end))) {
      continue;
    }
    if (segment.length < minimum) {
      continue;
    }
    if (best !== null && end - from > 240) {
      break;
    }
    best = end;
    if (first) {
      break;
    }
  }
  if (best !== null) {
    return best;
  }
  if (ended) {
    return text.slice(from).trim() ? text.length : null;
  }
  if (text.length - from > 280) {
    const window = text.slice(from, from + 260);
    const cut = Math.max(window.lastIndexOf(", "), window.lastIndexOf("; "), window.lastIndexOf(" — "));
    const space = window.lastIndexOf(" ");
    return from + (cut > 80 ? cut + 1 : space > 0 ? space : 260);
  }
  return null;
}
export function createLiveVoice(options: {
  client: LiveAdvisorClient;
  fallback: BrowserSpeech;
  voiceName: () => string | null;
  /** VA-BPE-LIVE-02 (bpe-lab build only): live neural presence fed from this voice clock. */
  tap?: VoiceTap;
}): LiveVoice {
  const { client, fallback } = options;
  const replies = new Map<string, Registered>();
  const streams = new Map<string, StreamReply>();
  const recorded = new Map<string, RecordedChunk[]>();
  const voiceMarks = new Map<string, VoiceMarks>();
  const listeners = new Set<() => void>();
  let context: AudioContext | null = null;
  let gain: GainNode | null = null;
  let current: {
    token: number;
    abort: AbortController;
    sources: AudioBufferSourceNode[];
    startAt: number | null;
    finish: (outcome: SpeechOutcome) => void;
  } | null = null;
  let run = 0;
  let activeSource: VoiceSource | null = null;
  let spoken: SpokenTimeline | null = null;
  let paused = false;
  let error: string | null = null;
  const notify = () => listeners.forEach((listener) => listener());
  const browserVoices = new Map<string, BrowserSpeech>();
  const browserVoiceFor = (language: AdvisorLanguageCode) => {
    let engine = browserVoices.get(language);
    if (!engine) {
      engine = createBrowserSpeech();
      browserVoices.set(language, engine);
    }
    return engine;
  };
  const markFor = (turnId: string) => {
    let mark = voiceMarks.get(turnId);
    if (!mark) {
      mark = { turnId, firstSegmentRequestedAt: null, firstAudioReceivedAt: null, playbackStartedAt: null, segments: 0, characters: 0, model: null };
      voiceMarks.set(turnId, mark);
      if (voiceMarks.size > 24) {
        voiceMarks.delete(voiceMarks.keys().next().value as string);
      }
    }
    return mark;
  };
  const audio = () => {
    if (!context) {
      const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      context = new Context();
      gain = context.createGain();
      gain.connect(context.destination);
    }
    return { context, gain: gain! };
  };
  const stopSources = (fadeMs = 80) => {
    const playing = current;
    if (!playing || !context || !gain) {
      return;
    }
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
    for (const source of playing.sources) {
      try {
        source.stop(now + fadeMs / 1000 + 0.01);
      } catch {
        // already stopped
      }
    }
  };
  const cancel = () => {
    run += 1;
    fallback.cancel();
    browserVoices.forEach((engine) => engine.cancel());
    if (current) {
      const playing = current;
      stopSources();
      playing.abort.abort();
      current = null;
      playing.finish({ status: "interrupted" });
    }
    if (paused && context) {
      paused = false;
      void context.resume();
    }
    activeSource = null;
    spoken = null;
    notify();
  };
  /**
   * Plays audio chunks on the voice clock. `next()` yields the chunks to play in order with
   * the reply offset of the segment they belong to and whether a new segment starts there;
   * it returns null when there will be no more audio.
   */
  const play = (
    turnId: string,
    textNow: () => string,
    callbacks: SpeechCallbacks,
    token: number,
    source: (abort: AbortSignal, onChunk: (chunk: RecordedChunk, segmentStart: boolean) => boolean) => Promise<"done" | "fallback" | "failed">,
  ) =>
    new Promise<SpeechOutcome | "fallback">((resolve) => {
      const { context: ctx, gain: out } = audio();
      void ctx.resume();
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(1, ctx.currentTime);
      const abort = new AbortController();
      let settled = false;
      let received = 0;
      let streamDone = false;
      let nextAt = 0;
      let tapStart: number | null = null;
      let segmentStartAt = 0;
      let segmentCursor = 0;
      let segmentOffset = 0;
      let segmentAudio = 0;
      let lastEnd = 0;
      const timeline: SpokenTimeline = { turnId, text: textNow(), charStartMs: [], charEndMs: [] };
      const finish = (outcome: SpeechOutcome | "fallback") => {
        if (settled) {
          return;
        }
        settled = true;
        if (Boolean(options.tap) && options.tap && tapStart !== null) {
          const status = outcome === "fallback" ? "failed" : outcome.status;
          options.tap.end(turnId, status === "completed" || status === "interrupted" ? status : "failed", nextAt - tapStart);
        }
        if (current?.token === token) {
          current = null;
        }
        if (outcome !== "fallback") {
          activeSource = null;
          notify();
        }
        resolve(outcome);
      };
      current = { token, abort, sources: [], startAt: null, finish: (outcome) => finish(outcome) };
      spoken = timeline;
      notify();
      const maybeComplete = () => {
        if (streamDone && current?.token === token && current.sources.length === 0) {
          finish({ status: "completed" });
        }
      };
      const onChunk = (item: RecordedChunk, segmentStart: boolean) => {
        const playing = current;
        if (token !== run || !playing || playing.token !== token) {
          return false;
        }
        const samples = decodePcm16(item.chunk.pcm);
        if (!samples.length) {
          return true;
        }
        const buffer = ctx.createBuffer(1, samples.length, item.chunk.sampleRate);
        buffer.copyToChannel(samples, 0);
        const node = ctx.createBufferSource();
        node.buffer = buffer;
        node.connect(out);
        if (playing.startAt === null) {
          // Small lead so the first buffers queue without a gap (longer while a live neural face renders).
          nextAt = ctx.currentTime + (Boolean(options.tap) && options.tap ? options.tap.lead() : 0.08);
          playing.startAt = nextAt;
          if (Boolean(options.tap) && options.tap) {
            tapStart = nextAt;
            options.tap.begin(turnId, ctx, nextAt, item.chunk.sampleRate);
          }
          const mark = markFor(turnId);
          mark.firstAudioReceivedAt ??= performance.now();
          const delay = Math.max(0, (nextAt - ctx.currentTime) * 1000);
          window.setTimeout(() => {
            if (token === run && current?.token === token) {
              activeSource = "elevenlabs";
              markFor(turnId).playbackStartedAt ??= performance.now();
              notify();
              callbacks.onStart?.();
            }
          }, delay);
        } else if (nextAt < ctx.currentTime + (Boolean(options.tap) && options.tap ? options.tap.horizonLead() : 0.03)) {
          // The queue ran dry (the model was still writing): continue after a short lead.
          nextAt = ctx.currentTime + (Boolean(options.tap) && options.tap ? Math.max(0.05, options.tap.lead() - 0.03) : 0.05);
        }
        if (Boolean(options.tap) && options.tap) {
          options.tap.chunk(turnId, nextAt - (tapStart ?? nextAt), item.chunk.pcm, item.chunk.sampleRate);
        }
        if (segmentStart) {
          segmentStartAt = nextAt;
          segmentCursor = 0;
          segmentOffset = item.offset;
          segmentAudio = 0;
          lastEnd = 0;
        }
        node.start(nextAt);
        nextAt += buffer.duration;
        playing.sources.push(node);
        node.onended = () => {
          const index = playing.sources.indexOf(node);
          if (index >= 0) {
            playing.sources.splice(index, 1);
          }
          maybeComplete();
        };
        // Character timing: within one segment, times are relative to that segment's audio;
        // a chunk whose times restart near zero is chunk-relative.
        const alignment = item.chunk.alignment;
        if (alignment && playing.startAt !== null) {
          const base = (segmentStartAt - playing.startAt) * 1000;
          const relative = alignment.startS.length > 0 && segmentAudio > 0.05 && alignment.startS[0] + 0.05 < lastEnd;
          const offset = relative ? segmentAudio : 0;
          timeline.text = textNow();
          for (let index = 0; index < alignment.characters.length; index += 1) {
            const at = segmentOffset + segmentCursor;
            timeline.charStartMs[at] = base + (alignment.startS[index] + offset) * 1000;
            timeline.charEndMs[at] = base + (alignment.endS[index] + offset) * 1000;
            lastEnd = alignment.endS[index] + offset;
            segmentCursor += alignment.characters[index].length;
          }
        }
        segmentAudio += buffer.duration;
        received += 1;
        return true;
      };
      void source(abort.signal, onChunk).then((result) => {
        if (token !== run) {
          return;
        }
        if (result === "fallback" && received === 0) {
          finish("fallback");
          return;
        }
        if (result === "failed") {
          stopSources();
          finish({ status: "failed", error: "stream" });
          return;
        }
        streamDone = true;
        maybeComplete();
      });
    });
  /** Reads one TTS stream (segment or whole reply) into the player. */
  const readTts = async (
    stream: AsyncGenerator<TtsChunk>,
    offset: number,
    record: RecordedChunk[],
    onChunk: (chunk: RecordedChunk, segmentStart: boolean) => boolean,
    mark: VoiceMarks,
  ): Promise<"ok" | "error" | "stopped"> => {
    let first = true;
    for await (const chunk of stream) {
      if (chunk.kind === "error") {
        error = chunk.message;
        return "error";
      }
      if (chunk.kind === "done") {
        mark.model = chunk.model;
        mark.characters += chunk.characters;
        continue;
      }
      const item = { offset, chunk };
      record.push(item);
      if (!onChunk(item, first)) {
        return "stopped";
      }
      first = false;
    }
    return "ok";
  };
  /** Voice a streamed reply: fetch each sentence segment in order as the model writes it. */
  const speakStream = (reply: StreamReply, callbacks: SpeechCallbacks, token: number) =>
    play(reply.turnId, () => reply.text, callbacks, token, async (signal, onChunk) => {
      const record: RecordedChunk[] = [];
      recorded.set(reply.turnId, record);
      if (recorded.size > 6) {
        recorded.delete(recorded.keys().next().value as string);
      }
      const mark = markFor(reply.turnId);
      let index = 0;
      let audioYet = false;
      try {
        while (token === run && !signal.aborted) {
          const segment = reply.segments[index];
          if (!segment) {
            if (reply.ended) {
              return "done";
            }
            await new Promise<void>((resolve) => {
              reply.wake = resolve;
              signal.addEventListener("abort", () => resolve(), { once: true });
            });
            reply.wake = null;
            continue;
          }
          mark.firstSegmentRequestedAt ??= performance.now();
          mark.segments += 1;
          const result = await readTts(
            client.ttsSegment(reply.turnId, segment.offset, segment.text, reply.language ?? undefined, signal),
            segment.offset,
            record,
            onChunk,
            mark,
          );
          if (result === "stopped") {
            return "done";
          }
          if (result === "error") {
            return audioYet ? "failed" : "fallback";
          }
          audioYet = audioYet || record.length > 0;
          index += 1;
        }
        return "done";
      } catch (failure) {
        if (signal.aborted || token !== run) {
          return "done";
        }
        error = failure instanceof Error ? failure.message : "voice stream failed";
        return audioYet ? "failed" : "fallback";
      }
    });
  /** Voice (or replay) a whole registered reply. */
  const speakWhole = (text: string, reply: Registered, callbacks: SpeechCallbacks, token: number) =>
    play(reply.turnId, () => text, callbacks, token, async (signal, onChunk) => {
      const kept = recorded.get(reply.turnId);
      if (kept?.length) {
        // Replay what was already received: same audio, no new synthesis.
        let lastOffset = -1;
        for (const item of kept) {
          if (!onChunk(item, item.offset !== lastOffset)) {
            break;
          }
          lastOffset = item.offset;
        }
        return "done";
      }
      const record: RecordedChunk[] = [];
      try {
        const result = await readTts(client.tts(reply.turnId, text, reply.language, signal), 0, record, onChunk, markFor(reply.turnId));
        if (result === "error") {
          return record.length ? "failed" : "fallback";
        }
        if (record.length) {
          recorded.set(reply.turnId, record);
        }
        return "done";
      } catch (failure) {
        if (signal.aborted || token !== run) {
          return "done";
        }
        error = failure instanceof Error ? failure.message : "voice stream failed";
        return record.length ? "failed" : "fallback";
      }
    });
  const segmentReply = (reply: StreamReply) => {
    let changed = false;
    while (true) {
      const end = nextSegmentEnd(reply.text, reply.segmented, reply.ended, reply.segments.length === 0);
      if (end === null || end <= reply.segmented) {
        break;
      }
      const raw = reply.text.slice(reply.segmented, end);
      const lead = raw.length - raw.trimStart().length;
      const textPart = raw.trim();
      if (textPart) {
        reply.segments.push({ offset: reply.segmented + lead, text: textPart });
        changed = true;
      }
      reply.segmented = end;
    }
    if (changed || reply.ended) {
      reply.wake?.();
    }
  };
  const voice: LiveVoice = {
    get supported() {
      return true;
    },
    ready: () => fallback.ready(),
    voice(): SpeechVoiceInfo | null {
      if (activeSource === "browser-voice") {
        return fallback.voice();
      }
      const name = options.voiceName();
      return { name: name ? `ElevenLabs · ${name}` : "ElevenLabs", lang: "multi", local: false };
    },
    async speak(text, callbacks = {}) {
      if (!window.AudioContext && !(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) {
        error = 'WebAudio is unavailable in this browser';
        return { status: 'failed', error: 'unsupported' };
      }
      cancel();
      const token = run;
      error = null;
      const stream = text.startsWith(streamPrefix) ? streams.get(text) : undefined;
      const reply = stream ? null : replies.get(text);
      if (stream || reply) {
        const outcome = stream ? await speakStream(stream, callbacks, token) : await speakWhole(text, reply!, callbacks, token);
        if (outcome !== "fallback" || token !== run) {
          return outcome === "fallback" ? { status: "interrupted" } : outcome;
        }
      }
      // Not a live reply, or ElevenLabs could not start: browser voice, labelled as such,
      // in the reply's language when the browser has a voice for it.
      let spokenText = text;
      let language = reply?.language ?? null;
      if (stream) {
        if (!stream.ended) {
          await new Promise<void>((resolve) => {
            const check = () => (stream.ended || token !== run ? resolve() : window.setTimeout(check, 120));
            check();
          });
          if (token !== run) {
            return { status: "interrupted" };
          }
        }
        spokenText = stream.text;
        language = stream.language;
      }
      if (!spokenText.trim()) {
        return { status: "completed" };
      }
      activeSource = "browser-voice";
      spoken = null;
      notify();
      const engine = language && language !== "en" ? browserVoiceFor(language) : fallback;
      const outcome = await engine.speak(spokenText, callbacks);
      if (token === run) {
        activeSource = null;
        notify();
      }
      return outcome;
    },
    cancel,
    isSpeaking: () => Boolean(current) || fallback.isSpeaking(),
    dispose() {
      cancel();
      void context?.close();
      context = null;
      gain = null;
    },
    registerReply(turnId, text, language) {
      replies.set(text, { turnId, language });
      if (replies.size > 24) {
        replies.delete(replies.keys().next().value as string);
      }
    },
    beginStream(turnId) {
      const key = `${streamPrefix}${turnId}`;
      streams.set(key, { turnId, key, text: "", language: null, ended: false, segmented: 0, segments: [], wake: null });
      if (streams.size > 8) {
        streams.delete(streams.keys().next().value as string);
      }
      return key;
    },
    streamText(turnId, text) {
      const reply = streams.get(`${streamPrefix}${turnId}`);
      if (reply && !reply.ended) {
        reply.text = text;
        segmentReply(reply);
      }
    },
    setStreamLanguage(turnId, language) {
      const reply = streams.get(`${streamPrefix}${turnId}`);
      if (reply) {
        reply.language = language;
      }
    },
    endStream(turnId, text, language) {
      const reply = streams.get(`${streamPrefix}${turnId}`);
      if (!reply) {
        return;
      }
      // The final text equals the streamed text plus any held-back tail.
      reply.text = text.startsWith(reply.text.slice(0, reply.segmented)) ? text : reply.text;
      reply.language = language;
      reply.ended = true;
      segmentReply(reply);
    },
    flushStream(turnId) {
      const reply = streams.get(`${streamPrefix}${turnId}`);
      if (reply && !reply.ended && reply.text.slice(reply.segmented).trim()) {
        const raw = reply.text.slice(reply.segmented);
        const lead = raw.length - raw.trimStart().length;
        reply.segments.push({ offset: reply.segmented + lead, text: raw.trim() });
        reply.segmented = reply.text.length;
        reply.wake?.();
      }
    },
    abandonStream(turnId) {
      const reply = streams.get(`${streamPrefix}${turnId}`);
      if (reply && !reply.ended) {
        // Voice nothing beyond what was already segmented.
        reply.text = reply.text.slice(0, reply.segmented);
        reply.ended = true;
        reply.wake?.();
      }
    },
    playbackMs() {
      if (!current || current.startAt === null || !context) {
        return null;
      }
      return Math.max(0, (context.currentTime - current.startAt) * 1000);
    },
    timeline: () => spoken,
    source: () => activeSource,
    isActive: () => Boolean(current) || activeSource === "browser-voice",
    pause() {
      if (current && context && !paused) {
        paused = true;
        void context.suspend();
        notify();
      }
    },
    resume() {
      if (context && paused) {
        paused = false;
        void context.resume();
        notify();
      }
    },
    isPaused: () => paused,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    lastError: () => error,
    marks: (turnId) => voiceMarks.get(turnId) ?? null,
  };
  return voice;
}
