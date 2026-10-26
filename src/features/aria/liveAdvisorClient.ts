import {
  advisorApiBase,
  type AdvisorEvent,
  type AdvisorHealth,
  type AdvisorLanguageCode,
  type SessionResponse,
  type SttTokenResponse,
  type ToolReceiptRequest,
  type TtsChunk,
  type TurnRequest,
} from "./protocol";
// Browser side of the local advisor API. It holds only the ephemeral session
// token issued by the server; provider keys never reach the browser.
const jsonHeaders = (token?: string) => ({
  "content-type": "application/json",
  ...(token ? { "x-advisor-session": token } : {}),
});
export class AdvisorHttpError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string) {
    super(`advisor ${status} ${code}`);
    this.status = status;
    this.code = code;
  }
}
async function postJson<T>(path: string, body: unknown, token?: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${advisorApiBase}${path}`, { method: "POST", headers: jsonHeaders(token), body: JSON.stringify(body), signal });
  if (!response.ok) {
    let code = String(response.status);
    try {
      code = ((await response.json()) as { error?: string }).error ?? code;
    } catch {
      // keep the status
    }
    throw new AdvisorHttpError(response.status, code);
  }
  return (await response.json()) as T;
}
/** Splits a fetch body into lines (NDJSON) or SSE `data:` payloads. */
async function* readLines(body: ReadableStream<Uint8Array>, separator: "\n" | "\n\n"): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      let index = buffer.indexOf(separator);
      while (index !== -1) {
        yield buffer.slice(0, index);
        buffer = buffer.slice(index + separator.length);
        index = buffer.indexOf(separator);
      }
    }
    if (buffer.trim()) {
      yield buffer;
    }
  } finally {
    reader.releaseLock();
  }
}
export type LiveAdvisorClient = ReturnType<typeof createLiveAdvisorClient>;
export function createLiveAdvisorClient() {
  let session: SessionResponse | null = null;
  const ensureSession = async () => {
    session ??= await postJson<SessionResponse>("/session", {});
    return session;
  };
  async function* ttsStream(body: Record<string, unknown>, signal: AbortSignal): AsyncGenerator<TtsChunk> {
    const current = await ensureSession();
    const response = await fetch(`${advisorApiBase}/tts`, {
      method: "POST",
      headers: jsonHeaders(current.sessionToken),
      body: JSON.stringify({ sessionId: current.sessionId, ...body }),
      signal,
    });
    if (!response.ok || !response.body) {
      throw new AdvisorHttpError(response.status, "tts-failed");
    }
    for await (const line of readLines(response.body, "\n")) {
      if (line.trim()) {
        yield JSON.parse(line) as TtsChunk;
      }
    }
  }
  return {
    async health(): Promise<AdvisorHealth | null> {
      try {
        const response = await fetch(`${advisorApiBase}/health`, { headers: { accept: "application/json" } });
        if (!response.ok) {
          return null;
        }
        return (await response.json()) as AdvisorHealth;
      } catch {
        return null;
      }
    },
    ensureSession,
    sessionId: () => session?.sessionId ?? null,
    /** Forget the session (expired on the server); the next call creates a new one. */
    reset() {
      session = null;
    },
    async *turn(request: Omit<TurnRequest, "sessionId">, signal: AbortSignal): AsyncGenerator<AdvisorEvent> {
      const current = await ensureSession();
      const response = await fetch(`${advisorApiBase}/turn`, {
        method: "POST",
        headers: jsonHeaders(current.sessionToken),
        body: JSON.stringify({ ...request, sessionId: current.sessionId }),
        signal,
      });
      if (!response.ok || !response.body) {
        if (response.status === 401) {
          session = null;
        }
        throw new AdvisorHttpError(response.status, response.status === 401 ? "session-expired" : "turn-failed");
      }
      for await (const block of readLines(response.body, "\n\n")) {
        const data = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n");
        if (data) {
          yield JSON.parse(data) as AdvisorEvent;
        }
      }
    },
    async receipt(body: Omit<ToolReceiptRequest, "sessionId">) {
      const current = await ensureSession();
      return postJson<{ ok: boolean; error?: string }>("/receipt", { ...body, sessionId: current.sessionId }, current.sessionToken).catch(
        (error: unknown) => ({ ok: false, error: error instanceof Error ? error.message : "receipt-failed" }),
      );
    },
    async cancel(turnId: string) {
      if (!session) {
        return;
      }
      await postJson("/cancel", { sessionId: session.sessionId, turnId }, session.sessionToken).catch(() => undefined);
    },
    async *tts(turnId: string, text: string, language: AdvisorLanguageCode, signal: AbortSignal): AsyncGenerator<TtsChunk> {
      yield* ttsStream({ turnId, text, language }, signal);
    },
    /** One sentence segment of a reply still being written: `text` is the reply's clean text at `offset`. */
    async *ttsSegment(turnId: string, offset: number, text: string, language: AdvisorLanguageCode | undefined, signal: AbortSignal): AsyncGenerator<TtsChunk> {
      yield* ttsStream({ turnId, text, offset, ...(language ? { language } : {}) }, signal);
    },
    /** Report the seconds a capture really streamed (the server booked its ceiling at mint). */
    async sttUsage(captureId: string, seconds: number) {
      if (!session) {
        return;
      }
      await postJson("/stt-usage", { sessionId: session.sessionId, captureId, seconds }, session.sessionToken).catch(() => undefined);
    },
    async sttToken(language: AdvisorLanguageCode | null) {
      const current = await ensureSession();
      return postJson<SttTokenResponse>("/stt-token", { sessionId: current.sessionId, language }, current.sessionToken);
    },
  };
}
