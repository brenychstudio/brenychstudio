import type { BrowserRecognition, RecognitionHandlers } from "./presenceTypes";
import type { LiveAdvisorClient } from "./liveAdvisorClient";
import type { AdvisorLanguageCode } from "./protocol";
// Opt-in microphone input through ElevenLabs Scribe realtime. Capture starts
// only from an explicit visitor action, after the server mints a single-use
// token (the API key never reaches the browser); the microphone stops on the
// first committed transcript, on Stop, after maxSeconds, or when the tab is
// hidden. Audio goes to ElevenLabs for transcription; nothing is stored here.
const workletSource = `
class Pcm16Capture extends AudioWorkletProcessor {
  constructor() { super(); this.step = sampleRate / 16000; this.pos = 0; this.sum = 0; this.count = 0; this.out = []; }
  process(inputs) {
    const input = inputs[0] && inputs[0][0];
    if (input) {
      // Box-filter decimation to 16 kHz: average the input samples of each output step.
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
registerProcessor("pcm16-capture", Pcm16Capture);
`;
function toBase64(samples: Int16Array) {
  const bytes = new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}
export type ScribeRecognition = BrowserRecognition & {
  /** Language reported by Scribe for the last committed transcript, when detected. */
  lastLanguage(): string | null;
};
export function createScribeRecognition(options: { client: LiveAdvisorClient; language: () => AdvisorLanguageCode | null }): ScribeRecognition {
  const supported =
    typeof window !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof AudioWorkletNode !== "undefined" &&
    typeof WebSocket !== "undefined";
  let active: {
    token: number;
    stop: (commit: boolean) => void;
    abort: () => void;
  } | null = null;
  let run = 0;
  let detected: string | null = null;
  return {
    supported,
    lastLanguage: () => detected,
    start(handlers: RecognitionHandlers) {
      active?.abort();
      const token = ++run;
      handlers.onState("starting");
      let stream: MediaStream | null = null;
      let context: AudioContext | null = null;
      let socket: WebSocket | null = null;
      let timer = 0;
      let finished = false;
      let sentFirst = false;
      let previousText = "";
      let partial = "";
      const cleanup = () => {
        window.clearTimeout(timer);
        stream?.getTracks().forEach((track) => track.stop());
        stream = null;
        void context?.close().catch(() => undefined);
        context = null;
        if (socket && socket.readyState <= WebSocket.OPEN) {
          socket.close();
        }
        socket = null;
        document.removeEventListener("visibilitychange", onHidden);
        if (active?.token === token) {
          active = null;
        }
      };
      const end = (state: "idle" | "denied" | "error", detail?: string) => {
        if (finished) {
          return;
        }
        finished = true;
        cleanup();
        handlers.onState(state, detail);
      };
      const onHidden = () => {
        if (document.visibilityState === "hidden") {
          end("idle", "hidden");
        }
      };
      const sendSamples = (samples: Int16Array, commit: boolean) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          return;
        }
        socket.send(
          JSON.stringify({
            message_type: "input_audio_chunk",
            audio_base_64: toBase64(samples),
            commit,
            sample_rate: 16000,
            ...(!sentFirst && previousText ? { previous_text: previousText } : {}),
          }),
        );
        sentFirst = true;
      };
      active = {
        token,
        stop: (commit) => {
          if (finished) {
            return;
          }
          if (commit && socket?.readyState === WebSocket.OPEN) {
            // Stop capturing; ask Scribe to commit what it heard.
            stream?.getTracks().forEach((track) => track.stop());
            sendSamples(new Int16Array(1600), true);
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
              if (partial.trim()) {
                handlers.onFinal(partial.trim());
              }
              end("idle", partial.trim() ? undefined : "no-speech");
            }, 2500);
          } else {
            end("idle");
          }
        },
        abort: () => end("idle", "aborted"),
      };
      document.addEventListener("visibilitychange", onHidden);
      void (async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
          });
        } catch (error) {
          const name = error instanceof DOMException ? error.name : "";
          end(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error", name || "microphone");
          return;
        }
        if (token !== run || finished) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        let grant;
        try {
          grant = await options.client.sttToken(options.language());
        } catch (error) {
          end("error", error instanceof Error && /budget/.test(error.message) ? "budget" : "token");
          return;
        }
        if (token !== run || finished) {
          end("idle");
          return;
        }
        previousText = grant.previousText;
        socket = new WebSocket(grant.wsUrl);
        socket.onmessage = (event) => {
          let message: { message_type?: string; text?: string; language_code?: string | null; error?: string };
          try {
            message = JSON.parse(String(event.data));
          } catch {
            return;
          }
          switch (message.message_type) {
            case "session_started":
              handlers.onState("listening");
              break;
            case "partial_transcript":
              partial = message.text ?? "";
              handlers.onInterim(partial);
              break;
            case "committed_transcript":
            case "committed_transcript_with_timestamps": {
              const text = (message.text ?? "").trim();
              if (message.language_code) {
                detected = message.language_code;
              }
              if (text && !finished) {
                handlers.onFinal(text);
                end("idle");
              }
              break;
            }
            default:
              if (message.message_type && /error|exceeded|limit|throttled|unaccepted|invalid/.test(message.message_type)) {
                end("error", message.message_type);
              }
          }
        };
        socket.onerror = () => end("error", "network");
        socket.onclose = () => {
          if (!finished) {
            end(partial.trim() ? "idle" : "error", partial.trim() ? undefined : "closed");
          }
        };
        socket.onopen = async () => {
          try {
            context = new AudioContext();
            const url = URL.createObjectURL(new Blob([workletSource], { type: "application/javascript" }));
            await context.audioWorklet.addModule(url);
            URL.revokeObjectURL(url);
            const node = new AudioWorkletNode(context, "pcm16-capture");
            node.port.onmessage = (event: MessageEvent<Int16Array>) => sendSamples(event.data, false);
            context.createMediaStreamSource(stream!).connect(node);
            // Hard ceiling per capture (the server budgets each token for it).
            timer = window.setTimeout(() => active?.stop(true), grant.maxSeconds * 1000);
          } catch {
            end("error", "audio");
          }
        };
      })();
    },
    stop() {
      active?.stop(true);
    },
    abort() {
      active?.abort();
    },
  };
}
