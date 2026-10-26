import type { LiveAdvisorClient } from "./liveAdvisorClient";
import type { AdvisorLanguageCode, SttTokenResponse } from "./protocol";
// VA-R2-UX-01: hands-free conversation with the live advisor. One explicit start
// (after the visitor's informed consent) opens the microphone for the whole
// conversation; it alternates listening -> thinking -> speaking -> listening
// without another click until the visitor ends it, closes the panel, hides the
// tab, stays silent too long or reaches the session limits.
//
// Half-duplex by design: microphone audio is sent to ElevenLabs Scribe only
// while listening. While Atlas thinks or speaks the audio is discarded, so the
// advisor's own voice from the speakers is never transcribed (browser echo
// cancellation is on as a second guard). Each listening phase is one Scribe
// capture with a server-minted single-use token; speech heard while that
// connection opens is buffered, so nothing said right after Atlas finishes is
// lost. The end of a spoken turn is detected by Scribe (VAD commit).
export type ConversationState = "off" | "starting" | "listening" | "hearing" | "thinking" | "speaking" | "paused" | "error";
export type ConversationEndReason = "ended" | "closed" | "hidden" | "idle" | "limit" | "denied" | "error";
export type HeardUtterance = {
  text: string;
  /** Language Scribe detected for this utterance (null when not reported). */
  language: string | null;
  /** performance.now() of the last frame with voice energy before the commit (local estimate). */
  speechEndAt: number | null;
  /** performance.now() when the committed transcript arrived. */
  finalAt: number;
};
export type VoiceConversation = ReturnType<typeof createVoiceConversation>;
const workletSource = `
class Pcm16Capture extends AudioWorkletProcessor {
  constructor() { super(); this.step = sampleRate / 16000; this.pos = 0; this.sum = 0; this.count = 0; this.out = []; }
  process(inputs) {
    const input = inputs[0] && inputs[0][0];
    if (input) {
      for (let i = 0; i < input.length; i += 1) {
        this.sum += input[i];
        this.count += 1;
        this.pos += 1;
        if (this.pos >= this.step) {
          this.pos -= this.step;
          const s = Math.max(-1, Math.min(1, this.sum / this.count));
          this.out.push(s < 0 ? s * 0x8000 : s * 0x7fff);
          this.sum = 0;
          this.count = 0;
        }
      }
      if (this.out.length >= 1600) {
        this.port.postMessage(Int16Array.from(this.out));
        this.out = [];
      }
    }
    return true;
  }
}
registerProcessor("pcm16-conversation", Pcm16Capture);
`;
/** Fillers and noise words a recogniser may commit from silence or breath; never a question. */
const filler = /^(m+h*m+|mm-?hmm+|uh+|um+|hmm+|ah+|oh+|eh+|er+|erm|ok|okay|ага|угу|мм+|эм+|ну|hm+|eee+|yeah)$/i;
export function isFillerUtterance(text: string) {
  const words = text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words.length === 0 || words.every((word) => filler.test(word));
}
function toBase64(samples: Int16Array) {
  const bytes = new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}
export function createVoiceConversation(options: {
  client: LiveAdvisorClient;
  /** Manual language override, or null for automatic detection (default). */
  language: () => AdvisorLanguageCode | null;
  onUtterance: (utterance: HeardUtterance) => void;
  onState: (state: ConversationState, detail?: string) => void;
  onInterim: (text: string) => void;
  /** Silence while listening before the conversation pauses (ms). */
  idleMs?: number;
  maxTurns?: number;
  maxMinutes?: number;
}) {
  const idleMs = options.idleMs ?? 25_000;
  const maxTurns = options.maxTurns ?? 30;
  const maxMinutes = options.maxMinutes ?? 15;
  const supported =
    typeof window !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof AudioWorkletNode !== "undefined" &&
    typeof WebSocket !== "undefined";
  let state: ConversationState = "off";
  let stream: MediaStream | null = null;
  let context: AudioContext | null = null;
  let node: AudioWorkletNode | null = null;
  let startedAt = 0;
  let turns = 0;
  let phase = 0;
  let resumeTimer = 0;
  let microphoneDeadlineTimer = 0;
  // Local voice-activity estimate (for the latency report and the "hearing" state).
  let noiseFloor = 0.004;
  let lastVoiceAt: number | null = null;
  const events: Array<{ at: number; event: string }> = [];
  let capture: {
    phase: number;
    socket: WebSocket | null;
    grant: SttTokenResponse | null;
    buffer: Int16Array[];
    bufferedSamples: number;
    sentSamples: number;
    sentFirst: boolean;
    openedAt: number;
    heardAnything: boolean;
    idleTimer: number;
    ceilingTimer: number;
    shutdownTimer: number;
    acceptingAudio: boolean;
    lastCommitted: string;
    closed: boolean;
  } | null = null;
  const log = (event: string) => {
    events.push({ at: Math.round(performance.now()), event });
    if (events.length > 300) {
      events.shift();
    }
  };
  const setState = (next: ConversationState, detail?: string) => {
    if (next !== state || detail) {
      state = next;
      log(`state:${next}${detail ? `:${detail}` : ""}`);
      options.onState(next, detail);
    }
  };
  const closeCapture = (reason: string) => {
    const current = capture;
    capture = null;
    if (!current || current.closed) {
      return;
    }
    current.closed = true;
    window.clearTimeout(current.idleTimer);
    window.clearTimeout(current.ceilingTimer);
    window.clearTimeout(current.shutdownTimer);
    if (current.socket && current.socket.readyState <= WebSocket.OPEN) {
      current.socket.close();
    }
    const seconds = current.sentSamples / 16000;
    log(`capture:close:${reason}:sent=${seconds.toFixed(1)}s`);
    if (current.grant) {
      void options.client.sttUsage(current.grant.captureId, seconds);
    }
  };
  const releaseMicrophone = () => {
    node?.port.close();
    node = null;
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    void context?.close().catch(() => undefined);
    context = null;
  };
  const end = (reason: ConversationEndReason) => {
    if (state === "off") {
      return;
    }
    phase += 1;
    window.clearTimeout(resumeTimer);
    window.clearTimeout(microphoneDeadlineTimer);
    closeCapture(reason);
    releaseMicrophone();
    document.removeEventListener("visibilitychange", onVisibility);
    log(`end:${reason}`);
    setState("off", reason);
  };
  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      end("hidden");
    }
  };
  const send = (samples: Int16Array, commit = false) => {
    const current = capture;
    if (!current?.socket || current.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    const maximum = Math.floor((current.grant?.maxSeconds ?? 0) * 16000);
    const remaining = Math.max(0, maximum - current.sentSamples);
    if (!remaining) { end("limit"); return; }
    const bounded = samples.subarray(0, remaining);
    current.socket.send(
      JSON.stringify({
        message_type: "input_audio_chunk",
        audio_base_64: toBase64(bounded),
        commit: commit || bounded.length === remaining,
        sample_rate: 16000,
        ...(!current.sentFirst && current.grant?.previousText ? { previous_text: current.grant.previousText } : {}),
      }),
    );
    current.sentFirst = true;
    current.sentSamples += bounded.length;
    if (current.sentSamples >= maximum) end("limit");
  };
  const onFrame = (samples: Int16Array) => {
    // Energy for the local speech-end estimate.
    let sum = 0;
    for (let index = 0; index < samples.length; index += 1) {
      const value = samples[index] / 0x8000;
      sum += value * value;
    }
    const rms = Math.sqrt(sum / Math.max(1, samples.length));
    if (rms < noiseFloor * 3) {
      noiseFloor = noiseFloor * 0.95 + rms * 0.05;
    }
    const voiced = rms > Math.max(0.012, noiseFloor * 4);
    const current = capture;
    if (!current || !current.acceptingAudio || (state !== "listening" && state !== "hearing")) {
      // Not listening: the audio is dropped (never sent, never stored).
      return;
    }
    if (voiced) {
      lastVoiceAt = performance.now();
    }
    if (current.socket?.readyState === WebSocket.OPEN && current.buffer.length === 0) {
      send(samples);
      return;
    }
    // Connection still opening: keep up to 8 s so nothing said right away is lost.
    current.buffer.push(samples);
    current.bufferedSamples += samples.length;
    while (current.bufferedSamples > 16000 * 8 && current.buffer.length) {
      current.bufferedSamples -= current.buffer.shift()!.length;
    }
  };
  const beginCapture = async () => {
    if (state === "off" || !stream) {
      return;
    }
    if (turns >= maxTurns || performance.now() - startedAt > maxMinutes * 60_000) {
      end("limit");
      return;
    }
    closeCapture("restart");
    const myPhase = ++phase;
    const current: NonNullable<typeof capture> = {
      phase: myPhase,
      socket: null,
      grant: null,
      buffer: [],
      bufferedSamples: 0,
      sentSamples: 0,
      sentFirst: false,
      openedAt: performance.now(),
      heardAnything: false,
      idleTimer: 0,
      ceilingTimer: 0,
      shutdownTimer: 0,
      acceptingAudio: true,
      lastCommitted: "",
      closed: false,
    };
    capture = current;
    lastVoiceAt = null;
    setState("listening");
    // Silence for too long: pause the conversation (no unattended capture).
    current.idleTimer = window.setTimeout(() => {
      if (capture === current && !current.heardAnything) {
        closeCapture("idle");
        releaseMicrophone();
        setState("paused", "idle");
      }
    }, idleMs);
    let grant: SttTokenResponse;
    try {
      grant = await options.client.sttToken(options.language());
    } catch (error) {
      if (capture === current) {
        closeCapture("token");
        end(error instanceof Error && /budget/.test(error.message) ? "limit" : "error");
      }
      return;
    }
    if (capture !== current || myPhase !== phase) {
      void options.client.sttUsage(grant.captureId, 0);
      return;
    }
    current.grant = grant;
    if (!Number.isFinite(grant.maxSeconds) || grant.maxSeconds <= 0 || grant.maxSeconds > 30) { end("error"); return; }
    // Audio samples (including buffered/commit data) and elapsed time are both bounded.
    // A missing/filler provider commit cannot extend the reserved capture.
    current.shutdownTimer = window.setTimeout(() => {
      if (capture === current) end("limit");
    }, grant.maxSeconds * 1000);
    current.ceilingTimer = window.setTimeout(() => {
      if (capture !== current) return;
      current.acceptingAudio = false;
      current.buffer = []; current.bufferedSamples = 0;
      if (current.socket?.readyState === WebSocket.OPEN) send(new Int16Array(1600), true);
    }, Math.max(0, grant.maxSeconds - 1) * 1000);
    const socket = new WebSocket(grant.wsUrl);
    current.socket = socket;
    socket.onopen = () => {
      if (capture !== current || !current.acceptingAudio) {
        socket.close();
        return;
      }
      log(`capture:open:${Math.round(performance.now() - current.openedAt)}ms`);
      const buffered = current.buffer;
      current.buffer = [];
      current.bufferedSamples = 0;
      for (const samples of buffered) {
        send(samples);
      }
    };
    socket.onmessage = (event) => {
      if (capture !== current) {
        return;
      }
      let message: { message_type?: string; text?: string; language_code?: string | null };
      try {
        message = JSON.parse(String(event.data));
      } catch {
        return;
      }
      const type = message.message_type ?? "";
      if (type === "partial_transcript") {
        const text = (message.text ?? "").trim();
        if (text) {
          current.heardAnything = true;
          window.clearTimeout(current.idleTimer);
          if (state === "listening") {
            setState("hearing");
          }
          options.onInterim(text);
        }
        return;
      }
      if (type === "committed_transcript" || type === "committed_transcript_with_timestamps") {
        const text = (message.text ?? "").trim();
        // Scribe sends each segment twice (with and without timestamps): take it once.
        if (!text || text === current.lastCommitted) {
          return;
        }
        current.lastCommitted = text;
        if (isFillerUtterance(text)) {
          log(`heard:filler-ignored`);
          options.onInterim("");
          if (state === "hearing") {
            setState("listening");
          }
          return;
        }
        const heard: HeardUtterance = { text, language: message.language_code ?? null, speechEndAt: lastVoiceAt, finalAt: performance.now() };
        turns += 1;
        log(`heard:${text.length}chars:lang=${heard.language ?? "?"}`);
        closeCapture("committed");
        setState("thinking");
        options.onInterim("");
        options.onUtterance(heard);
        return;
      }
      if (/error|exceeded|limit|throttled|unaccepted|invalid/.test(type)) {
        log(`capture:error:${type}`);
        closeCapture("error");
        end("error");
      }
    };
    socket.onerror = () => {
      if (capture === current) {
        log("capture:socket-error");
        closeCapture("socket-error");
        end("error");
      }
    };
    socket.onclose = () => {
      if (capture === current && !current.closed) {
        // Closed by the service mid-listening: open a fresh capture.
        log("capture:closed-by-service");
        closeCapture("service-closed");
        void beginCapture();
      }
    };
  };
  return {
    supported,
    events,
    state: () => state,
    active: () => state !== "off" && state !== "error",
    /** Explicit start (after consent): open the microphone once and listen. */
    async start() {
      if (state !== "off" && state !== "paused" && state !== "error") {
        return;
      }
      const startPhase = ++phase;
      setState("starting");
      document.addEventListener("visibilitychange", onVisibility);
      try {
        if (!stream) {
          const granted = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
          });
          if (phase !== startPhase) {
            granted.getTracks().forEach((track) => track.stop());
            return;
          }
          stream = granted;
        }
        startedAt ||= performance.now();
        const microphoneTimeLeft = maxMinutes * 60_000 - (performance.now() - startedAt);
        if (microphoneTimeLeft <= 0) { end("limit"); return; }
        window.clearTimeout(microphoneDeadlineTimer);
        microphoneDeadlineTimer = window.setTimeout(() => end("limit"), microphoneTimeLeft);
        if (!context) {
          context = new AudioContext();
          const url = URL.createObjectURL(new Blob([workletSource], { type: "application/javascript" }));
          try { await context.audioWorklet.addModule(url); }
          finally { URL.revokeObjectURL(url); }
          if (phase !== startPhase || !context) return;
          node = new AudioWorkletNode(context, "pcm16-conversation");
          node.port.onmessage = (event: MessageEvent<Int16Array>) => onFrame(event.data);
          context.createMediaStreamSource(stream).connect(node);
        }
        await context.resume();
        if (phase !== startPhase) return;
      } catch (error) {
        if (phase !== startPhase) return;
        const name = error instanceof DOMException ? error.name : "";
        releaseMicrophone();
        document.removeEventListener("visibilitychange", onVisibility);
        setState("off", name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
        return;
      }
      await beginCapture();
    },
    /** Atlas is thinking or speaking: stop sending (audio is dropped until listen()). */
    hold(next: "thinking" | "speaking" = "thinking") {
      if (state === "off" || state === "paused") {
        return;
      }
      window.clearTimeout(resumeTimer);
      closeCapture("hold");
      phase += 1;
      setState(next);
    },
    /** Atlas finished: listen again after a short guard (room echo of the last word). */
    listen(guardMs = 300) {
      if (state === "off" || state === "paused" || state === "error") {
        return;
      }
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => void beginCapture(), guardMs);
    },
    end,
  };
}
