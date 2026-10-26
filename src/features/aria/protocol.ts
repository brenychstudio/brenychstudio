// VA-R2-LIVE-02: wire protocol between the browser and the local advisor
// server (server/advisor). Shared by both sides; no secrets, no provider SDK
// types. One intelligence (Claude) drives the showroom only through the twelve
// existing showroom commands, executed in the visitor's own tab via
// AdvisorBridge.callTool; the tab returns the real receipt.
export const siteLocales = [{ code: "en" }, { code: "es" }] as const;
export type SiteLocale = "en" | "es";
export function isSiteLocale(value: unknown): value is SiteLocale { return value === "en" || value === "es"; }
export const advisorApiBase = "/api/aria";
/** Conversation languages (owner addenda 2026-10-19; RU added in VA-R2-UX-01). Targets, not certified results. */
export const advisorLanguages = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "ca", label: "Catalan", native: "Català" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "uk", label: "Ukrainian", native: "Українська" },
  { code: "ru", label: "Russian", native: "Русский" },
] as const;
export type AdvisorLanguageCode = (typeof advisorLanguages)[number]["code"];
/** "auto": reply in the language of the visitor's latest message. */
export type AdvisorLanguagePreference = AdvisorLanguageCode | "auto";
export function isAdvisorLanguage(value: unknown): value is AdvisorLanguageCode {
  return typeof value === "string" && advisorLanguages.some((language) => language.code === value);
}
export type AdvisorProviderKind = "anthropic" | "mock";
export type AdvisorHealth = {
  /** A provider is configured, enabled and within budget. */
  live: boolean;
  /** Machine-readable form of `live` + `reason` (VA-RELEASE-01): switched off, no key, or budget used up. */
  state?: "available" | "disabled" | "unconfigured" | "exhausted";
  provider: AdvisorProviderKind | null;
  model: string | null;
  /** Why the live advisor is unavailable (shown to the visitor in plain words). */
  reason: string | null;
  voice: { provider: "elevenlabs"; available: boolean; voiceName: string | null; model: string | null };
  stt: { provider: "elevenlabs"; available: boolean; maxSecondsPerCapture: number };
  budget: {
    claudeRequestsLeft: number;
    claudeUsdLeft: number;
    ttsCharactersLeft: number;
    sttSecondsLeft: number;
  };
};
/** What the visitor currently sees. Informational only: never an authorisation. */
export type VisibleShowroomContext = { route: string; revision: number; siteLocale?: string };
/** Advisor tool outside the showroom contract: switches the site interface language (not the conversation). */
export const siteLanguageTool = {
  name: "set_site_language",
  description:
    "Switch the language of the website interface (navigation, buttons, labels). Use only when the visitor explicitly asks to change the site language. The conversation language does not depend on it.",
  input_schema: {
    type: "object" as const,
    properties: { locale: { type: "string" as const, enum: siteLocales.map((locale) => locale.code) } },
    required: ["locale"],
    additionalProperties: false,
  },
};
export type SessionResponse = {
  sessionId: string;
  /** Required as `x-advisor-session` on every later call of this session. */
  sessionToken: string;
  expiresAt: string;
  health: AdvisorHealth;
};
export type TurnRequest = {
  sessionId: string;
  turnId: string;
  text: string;
  context: VisibleShowroomContext;
  language: AdvisorLanguagePreference;
  /** Set when the text came from speech recognition. */
  spokenLanguage?: string | null;
};
/** A phrase of the final reply bound to an authored visual anchor of the view on screen. */
export type CueProposal = {
  anchorId: string;
  /** Character range in the final (clean) reply text. */
  startChar: number;
  endChar: number;
};
export type TurnUsage = {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  usd: number;
};
export type AdvisorEvent =
  | { kind: "turn.started"; turnId: string; provider: AdvisorProviderKind; model: string }
  | { kind: "text.delta"; turnId: string; text: string }
  /** The reply language, as soon as the model declared it (before most of the text). */
  | { kind: "turn.language"; turnId: string; language: AdvisorLanguageCode }
  /** A visual cue validated while streaming (character range in the clean reply text). */
  | { kind: "cue.proposed"; turnId: string; cue: CueProposal }
  | {
      kind: "tool.request";
      turnId: string;
      toolUseId: string;
      name: string;
      input: unknown;
      seq: number;
      nonce: string;
      expiresAt: number;
      /** The visitor must confirm before the tool runs (reset_showroom). */
      confirm: boolean;
    }
  | {
      kind: "tool.settled";
      turnId: string;
      toolUseId: string;
      name: string;
      outcome: ToolOutcomeKind;
      receiptId: string | null;
      status: string;
      summary: string;
    }
  | {
      kind: "turn.final";
      turnId: string;
      text: string;
      /** Language the reply was written in (declared by the model, validated). */
      language: AdvisorLanguageCode;
      cues: CueProposal[];
      estates: string[];
      stopReason: string;
      usage: TurnUsage;
      requestIds: string[];
      timing?: TurnTiming;
    }
  | { kind: "turn.error"; turnId: string; code: AdvisorErrorCode; message: string; retryable: boolean };
/** Server-side timing of a turn (ms from the turn request). */
export type TurnTiming = {
  firstTokenMs: number | null;
  firstTextMs: number | null;
  /** Each tool call: request emitted -> receipt back. */
  toolRoundTripsMs: number[];
  totalMs: number;
};
export type AdvisorErrorCode =
  | "provider-unavailable"
  | "budget-exhausted"
  | "rate-limited"
  | "timeout"
  | "aborted"
  | "provider-error"
  | "bad-request"
  | "session-expired";
/** Validation outcome on the server, or what the tab did with the request. */
export type ToolOutcomeKind = "executed" | "declined" | "failed" | "invalid" | "timeout" | "stale";
/** The real AdvisorBridge result, as returned by the tab. */
export type ToolReceiptPayload = {
  ok: boolean;
  status: "applied" | "unchanged" | "rejected";
  summary: string;
  changed: string[];
  receiptId: string;
  result?: unknown;
  errors?: Array<{ field: string; message: string }>;
};
export type ToolReceiptRequest = {
  sessionId: string;
  turnId: string;
  toolUseId: string;
  nonce: string;
  outcome:
    | { kind: "executed"; receipt: ToolReceiptPayload }
    | { kind: "declined"; reason: string }
    | { kind: "failed"; error: string };
};
/**
 * Voice for the advisor's own text only. Without `offset`: a whole final reply (or a greeting).
 * With `offset`: one sentence segment of a reply that is still streaming; `text` must be exactly
 * the reply's clean text at [offset, offset + text.length).
 */
export type TtsRequest = { sessionId: string; turnId: string; text: string; language?: AdvisorLanguageCode; offset?: number };
/** Actual seconds of audio streamed for one capture (the server reserved the ceiling at mint). */
export type SttUsageRequest = { sessionId: string; captureId: string; seconds: number };
/** One NDJSON line of the TTS stream. */
export type TtsChunk =
  | {
      kind: "audio";
      /** Base64 PCM16 mono little-endian. */
      pcm: string;
      sampleRate: number;
      alignment: { characters: string[]; startS: number[]; endS: number[] } | null;
    }
  | { kind: "done"; characters: number; voiceName: string; model: string; cached: boolean }
  | { kind: "error"; code: AdvisorErrorCode; message: string };
export type SttTokenResponse = {
  /** Settles this capture in the usage ledger (POST /stt-usage). */
  captureId: string;
  token: string;
  wsUrl: string;
  modelId: string;
  maxSeconds: number;
  sampleRate: number;
  /** Context sent with the first audio chunk (estate and place names). */
  previousText: string;
  /** null: automatic language detection. */
  languageCode: AdvisorLanguageCode | null;
};
/** Sanitised, human-readable form of a receipt result handed back to the model. */
export const maxToolResultChars = 3500;
/** Fixed opening line of a live session, one per site locale (voiced once, cached on the server). */
export const liveGreetings: Record<SiteLocale, { turnId: string; language: AdvisorLanguageCode; text: string }> = {
 en: { turnId: "greeting", language: "en", text: "Hi, I'm Aria, an AI guide to Brenych Studio. Ask me about the studio, or let me show you a product." },
 es: { turnId: "greeting-es", language: "es", text: "Hola, soy Aria, una guía de inteligencia artificial de Brenych Studio. Puedes preguntarme por el estudio o pedirme que te enseñe un producto." },
};
export const liveGreeting = liveGreetings.en;
