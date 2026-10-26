import type { AdvisorToolResult } from "./presenceTypes";
import type { AdvisorUtterance } from "./presenceTypes";
import { AdvisorHttpError, type LiveAdvisorClient } from "./liveAdvisorClient";
import type { LiveVoice } from "./liveVoice";
import {
  liveGreetings,
  siteLanguageTool,
  type AdvisorLanguageCode,
  type AdvisorLanguagePreference,
  type CueProposal,
  type SiteLocale,
  type ToolOutcomeKind,
  type ToolReceiptPayload,
  type TurnTiming,
  type VisibleShowroomContext,
} from "./protocol";
// Live advisor session for the concierge (same shape as the guided session).
// One turn at a time; a new message, Stop or leaving cancels the old turn and
// any of its late events. Tool requests run only if they belong to the turn
// still on screen, through the same AdvisorBridge route as every other
// advisor action, and their real receipt goes back to the server.
//
// VA-R2-UX-01: the reply is voiced while it is written (sentence segments, see
// liveVoice), so the voice of a turn starts with its first sentence instead of
// after the whole answer. A receipt goes back as soon as the showroom store has
// applied the command; the visual transition is not awaited (the store, not the
// animation, is the authority on what changed).
export type LiveToolTrace = {
  name: string;
  status: AdvisorToolResult["status"];
  receiptId: string | null;
  summary: string;
  outcome: ToolOutcomeKind;
};
export type LiveTranscriptEntry = {
  id: string;
  role: "visitor" | "advisor";
  text: string;
  final: boolean;
  estates?: string[];
  tools?: LiveToolTrace[];
  suggestions?: string[];
  source: "live-ai";
  streaming?: boolean;
  failed?: boolean;
  language?: AdvisorLanguageCode;
  cues?: CueProposal[];
  /** Visitor entries: the question was spoken (transcribed by Scribe). */
  spoken?: boolean;
};
export type LiveCue = { turnId: string; text: string; cue: CueProposal };
/** One turn's latency chain (performance.now ms; null when not measured). */
export type TurnLatency = {
  turnId: string;
  spoken: boolean;
  speechEndAt: number | null;
  sttFinalAt: number | null;
  sentAt: number;
  firstEventAt: number | null;
  firstTextAt: number | null;
  tools: Array<{ name: string; requestedAt: number; receiptPostedAt: number | null }>;
  finalAt: number | null;
  server: TurnTiming | null;
  requests: number;
};
type ToolListener = (call: { name: string; input: unknown }) => Promise<unknown>;
type Listener<T> = (value: T) => void;
export type LiveConsultationSession = ReturnType<typeof createLiveConsultation>;
const errorText: Record<string, string> = {
  "provider-unavailable": "The live advisor is not available right now. You can switch to the guided demo.",
  "budget-exhausted": "The approved test budget for the live advisor is used up. The guided demo still works.",
  "rate-limited": "That was a lot of messages at once. Please wait a moment and ask again.",
  timeout: "That answer took too long, so I stopped it. Please ask again.",
  "provider-error": "I couldn't answer just now. Please try again.",
  "session-expired": "The session expired. Please ask again.",
};
export function createLiveConsultation(options: {
  client: LiveAdvisorClient;
  voice: LiveVoice;
  readContext: () => VisibleShowroomContext;
  /** The site-language switch (not a showroom command): returns its own receipt. */
  setSiteLocale: (locale: SiteLocale) => ToolReceiptPayload;
  /** Site locale for the greeting and visible system texts. */
  siteLocale: () => SiteLocale;
  /** Localised system message for an error code (falls back to English). */
  errorMessage?: (code: string) => string | null;
}) {
  const { client, voice } = options;
  const transcriptListeners = new Set<Listener<LiveTranscriptEntry>>();
  const toolListeners = new Set<ToolListener>();
  const utteranceListeners = new Set<Listener<AdvisorUtterance>>();
  const cueListeners = new Set<Listener<LiveCue>>();
  const events: Array<{ at: number; event: string }> = [];
  const latency: TurnLatency[] = [];
  let confirm: (call: { name: string; input: unknown }) => Promise<boolean> = async () => false;
  let language: AdvisorLanguagePreference = "auto";
  let started = false;
  let stopped = false;
  let active: { turnId: string; abort: AbortController } | null = null;
  let counter = 0;
  const log = (event: string) => {
    events.push({ at: Math.round(performance.now()), event });
    if (events.length > 400) {
      events.shift();
    }
  };
  const emit = (entry: LiveTranscriptEntry) => transcriptListeners.forEach((listener) => listener(entry));
  const isCurrent = (turnId: string) => active?.turnId === turnId && !stopped;
  const message = (code: string) => options.errorMessage?.(code) ?? errorText[code] ?? errorText["provider-error"];
  const runTool = async (call: { name: string; input: unknown }) => {
    if (call.name === siteLanguageTool.name) {
      const locale = (call.input as { locale?: SiteLocale } | null)?.locale;
      return options.setSiteLocale(locale === "es" ? "es" : "en");
    }
    let result: unknown;
    for (const listener of toolListeners) {
      result = await listener(call);
    }
    return result as AdvisorToolResult | undefined;
  };
  const cancel = () => {
    const current = active;
    active = null;
    if (current) {
      current.abort.abort();
      void client.cancel(current.turnId);
      log(`turn:cancel:${current.turnId}`);
    }
  };
  const send = async (text: string, meta: { spokenLanguage?: string | null; speechEndAt?: number | null; sttFinalAt?: number | null } = {}) => {
    const input = text.trim().slice(0, 500);
    if (!input || stopped) {
      return;
    }
    cancel();
    voice.cancel();
    counter += 1;
    const turnId = `t-${Date.now().toString(36)}-${counter}`;
    const abort = new AbortController();
    active = { turnId, abort };
    const spoken = meta.sttFinalAt != null;
    emit({ id: `${turnId}-visitor`, role: "visitor", text: input, final: true, source: "live-ai", spoken });
    let entry: LiveTranscriptEntry = { id: turnId, role: "advisor", text: "", final: false, streaming: true, tools: [], source: "live-ai" };
    emit(entry);
    const update = (patch: Partial<LiveTranscriptEntry>) => {
      entry = { ...entry, ...patch };
      emit(entry);
    };
    const record: TurnLatency = {
      turnId,
      spoken,
      speechEndAt: meta.speechEndAt ?? null,
      sttFinalAt: meta.sttFinalAt ?? null,
      sentAt: performance.now(),
      firstEventAt: null,
      firstTextAt: null,
      tools: [],
      finalAt: null,
      server: null,
      requests: 0,
    };
    latency.push(record);
    if (latency.length > 40) {
      latency.shift();
    }
    log(`turn:start:${turnId}`);
    // The voice of this turn starts with its first written sentence.
    const streamKey = voice.beginStream(turnId);
    utteranceListeners.forEach((listener) => listener({ text: streamKey }));
    let finished = false;
    try {
      for await (const event of client.turn(
        { turnId, text: input, context: options.readContext(), language, spokenLanguage: meta.spokenLanguage ?? null },
        abort.signal,
      )) {
        if (!isCurrent(turnId)) {
          log(`turn:late-event-ignored:${turnId}:${event.kind}`);
          break;
        }
        record.firstEventAt ??= performance.now();
        switch (event.kind) {
          case "turn.started":
            log(`turn:provider:${event.provider}:${event.model}`);
            break;
          case "turn.language":
            voice.setStreamLanguage(turnId, event.language);
            update({ language: event.language });
            break;
          case "text.delta":
            record.firstTextAt ??= performance.now();
            update({ text: entry.text + event.text });
            voice.streamText(turnId, entry.text);
            break;
          case "cue.proposed":
            update({ cues: [...(entry.cues ?? []), event.cue] });
            cueListeners.forEach((listener) => listener({ turnId, text: entry.text, cue: event.cue }));
            break;
          case "tool.request": {
            log(`tool:request:${event.name}:${event.toolUseId}`);
            // The model pauses for the tool: its intent sentence is voiced now, not after the tool.
            voice.flushStream(turnId);
            if (Date.now() > event.expiresAt) {
              break;
            }
            const trace = { name: event.name, requestedAt: performance.now(), receiptPostedAt: null as number | null };
            record.tools.push(trace);
            const call = { name: event.name, input: event.input };
            if (event.confirm) {
              const ok = await confirm(call);
              if (!isCurrent(turnId)) {
                break;
              }
              if (!ok) {
                await client.receipt({ turnId, toolUseId: event.toolUseId, nonce: event.nonce, outcome: { kind: "declined", reason: "Visitor kept the current showroom." } });
                break;
              }
            }
            try {
              const result = await runTool(call);
              if (!result || typeof result !== "object" || !("receiptId" in result)) {
                throw new Error("no receipt");
              }
              if (!isCurrent(turnId)) {
                log(`tool:receipt-dropped-stale:${result.receiptId}`);
                break;
              }
              trace.receiptPostedAt = performance.now();
              const response = await client.receipt({ turnId, toolUseId: event.toolUseId, nonce: event.nonce, outcome: { kind: "executed", receipt: result } });
              log(`tool:receipt:${event.name}:${result.status}:${result.receiptId}:${response.ok ? "accepted" : response.error}`);
            } catch (error) {
              await client.receipt({ turnId, toolUseId: event.toolUseId, nonce: event.nonce, outcome: { kind: "failed", error: error instanceof Error ? error.message : "tool failed" } });
            }
            break;
          }
          case "tool.settled":
            update({
              tools: [
                ...(entry.tools ?? []),
                {
                  name: event.name,
                  status: (["applied", "unchanged", "rejected"].includes(event.status) ? event.status : "rejected") as LiveToolTrace["status"],
                  receiptId: event.receiptId,
                  summary: event.summary,
                  outcome: event.outcome,
                },
              ],
            });
            break;
          case "turn.final":
            finished = true;
            record.finalAt = performance.now();
            record.server = event.timing ?? null;
            record.requests = event.usage.requests;
            update({ text: event.text, final: true, streaming: false, language: event.language, cues: event.cues, estates: event.estates });
            log(`turn:final:${turnId}:lang=${event.language}:cues=${event.cues.map((cue) => cue.anchorId).join("+") || "none"}:req=${event.usage.requests}:usd=${event.usage.usd}`);
            voice.endStream(turnId, event.text, event.language);
            if (event.text) {
              voice.registerReply(turnId, event.text, event.language);
            }
            break;
          case "turn.error":
            log(`turn:error:${turnId}:${event.code}`);
            voice.abandonStream(turnId);
            if (event.code !== "aborted") {
              // A partial answer stays visible, marked as cut; otherwise the plain reason.
              const reason = message(event.code);
              update({ text: entry.text ? `${entry.text} … (${reason})` : reason, failed: true, streaming: false, final: true });
            }
            break;
        }
      }
    } catch (error) {
      if (!abort.signal.aborted && isCurrent(turnId)) {
        const code = error instanceof AdvisorHttpError ? error.code : "provider-error";
        if (code === "session-expired") {
          client.reset();
        }
        log(`turn:transport-error:${turnId}:${code}`);
        update({ text: message(code), failed: true, streaming: false, final: true });
      }
    } finally {
      if (!finished) {
        voice.abandonStream(turnId);
      }
      if (entry.streaming && !abort.signal.aborted) {
        update({ streaming: false, final: true });
      } else if (entry.streaming) {
        update({ streaming: false, final: true, text: entry.text ? `${entry.text} …` : "…" });
      }
      if (active?.turnId === turnId) {
        active = null;
      }
    }
  };
  return {
    mode: "live-ai" as const,
    events,
    latency,
    async start() {
      stopped = false;
      if (!started) {
        started = true;
        await client.ensureSession().catch(() => undefined);
        const greeting = liveGreetings[options.siteLocale()] ?? liveGreetings.en;
        emit({
          id: "live-greeting",
          role: "advisor",
          text: greeting.text,
          final: true,
          source: "live-ai",
          language: greeting.language,
        });
        voice.registerReply(greeting.turnId, greeting.text, greeting.language);
        utteranceListeners.forEach((listener) => listener({ text: greeting.text }));
      }
    },
    stop() {
      stopped = true;
      cancel();
    },
    send,
    /** Stop the answer in progress (text, tools and voice). */
    cancel() {
      cancel();
      voice.cancel();
    },
    busy: () => Boolean(active),
    setLanguage(value: AdvisorLanguagePreference) {
      language = value;
    },
    getLanguage: () => language,
    setConfirm(handler: (call: { name: string; input: unknown }) => Promise<boolean>) {
      confirm = handler;
    },
    onTranscript(listener: Listener<LiveTranscriptEntry>) {
      transcriptListeners.add(listener);
      return () => transcriptListeners.delete(listener);
    },
    onToolCall(listener: ToolListener) {
      toolListeners.add(listener);
      return () => toolListeners.delete(listener);
    },
    onUtterance(listener: Listener<AdvisorUtterance>) {
      utteranceListeners.add(listener);
      return () => utteranceListeners.delete(listener);
    },
    onCue(listener: Listener<LiveCue>) {
      cueListeners.add(listener);
      return () => cueListeners.delete(listener);
    },
  };
}
