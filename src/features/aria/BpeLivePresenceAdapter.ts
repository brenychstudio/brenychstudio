import type { AdvisorPresenceState, AdvisorUtterance } from "./presenceTypes";
import type { ClipPresenceAdapter } from "./presenceTypes";
import type { PortraitPresentation } from "./presenceTypes";
// VA-BPE-LIVE-02: live neural presence (Brenych Presence Engine) for the
// AdvisorPresenceAdapter boundary. Private lab build only (__VA_BPE_LIVE__).
//
// The still tier keeps running underneath (portrait poster, states, voice
// routing) and stays the fallback. On top, a canvas shows Ditto frames rendered
// live on the private GPU from the advisor's own ElevenLabs audio:
//
//   LiveVoice (WebAudio clock) --VoiceTap--> /api/bpe/stream (WebSocket) --relay--> GPU
//   GPU frames (face ROI JPEG + frame index) --> this canvas, drawn by the SAME clock.
//
// One timeline: every PCM chunk is sent with its exact position on the voice
// clock, `horizon` declares which positions are final, and frame i is drawn
// while the audio heard is in [i/25, (i+1)/25) of that utterance. To leave the
// GPU time to render, voice playback starts `lead` seconds after the first
// audio arrives (the same lead re-anchors after a dry queue). Stop cancels
// audio (LiveVoice) and video (here) together.
//
// One identity per page session (P0-A): the stream announces the identity it
// animates (label + sha256 of the source portrait) and tags every frame with
// it. The first identity seen is locked; frames of any other identity are
// dropped and logged (identity-mismatch). Every non-live moment (connecting,
// GPU fallback, transport stall) shows the SAME identity's neutral photo on
// this canvas, crossfaded; the page portrait underneath is only revealed when
// no stream identity arrived at all, and then stream frames are refused for
// the rest of the session. Nothing switches before a decoded image exists.
export type VoiceTap = {
  /** Seconds from receiving the first audio of a run to playing it. */
  lead(): number;
  /** Audio that would play sooner than this counts as a dry queue and is re-anchored at now + lead(). */
  horizonLead(): number;
  begin(turnId: string, context: AudioContext, startAt: number, sampleRate: number): void;
  chunk(turnId: string, at: number, pcmBase64: string, sampleRate: number): void;
  end(turnId: string, outcome: "completed" | "interrupted" | "failed", audioEndS: number): void;
};
export type BpeStatus = "connecting" | "ready" | "fallback" | "off";
type Frame = { index: number; arrivedAt: number; bitmap: ImageBitmap | null; blob: Blob };
type Utt = {
  id: number;
  turnId: string;
  context: AudioContext;
  startAt: number;
  rate: number;
  audioEnd: number;
  horizon: number;
  endSample: number | null;
  cancelled: boolean;
  serverDone: boolean;
  frames: Map<number, Frame>;
  maxFrame: number;
  sent: Array<[number, number]>;
  firstChunkAt: number;
  firstFrameAt: number | null;
  degraded: boolean;
  report: UtteranceReport;
};
export type UtteranceReport = {
  utt: number;
  turnId: string;
  outcome: string | null;
  audioSeconds: number;
  framesReceived: number;
  framesDrawn: number;
  framesLate: number;
  firstFrameMs: number | null;
  /** Arrival of frame i minus the moment the audio completing frame i was sent (ms). */
  audioToFrameMs: number[];
  /** Heard audio time minus the centre of the frame on screen (ms), per drawn frame. */
  syncErrorMs: number[];
  /** Frame due time minus arrival (ms): negative = late. */
  slackMs: number[];
  cancelToIdleMs: number | null;
  /** The reply's video was hidden after a transport stall (voice and still portrait continued). */
  degraded: boolean;
};
const headerBytes = 28;
const fps = 25;
const tailFrames = 10;
const crossfadeMs = 140;
const stallSeconds = 2;
function decodeBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
function heardTime(context: AudioContext) {
  // The context time of the sample reaching the speakers now (output latency included).
  const stamp = context.getOutputTimestamp?.();
  if (stamp && stamp.contextTime !== undefined && stamp.performanceTime !== undefined && stamp.performanceTime > 0) {
    return stamp.contextTime + (performance.now() - stamp.performanceTime) / 1000;
  }
  return context.currentTime - (context.outputLatency || context.baseLatency || 0);
}
export function createBpeLivePresence(options: {
  still: ClipPresenceAdapter;
  expectedPortraitSha256: string;
  url?: string;
  /** Playout lead while the live stream is up (seconds). */
  leadSeconds?: number;
  jpegQuality?: number;
}): ClipPresenceAdapter & { voiceTap: VoiceTap; bpeStatus(): BpeStatus } {
  const inner = options.still;
  // Lab tuning without a rebuild: ?bpeLead=<seconds>&bpeQ=<jpeg quality>.
  const params = new URLSearchParams(location.search);
  const leadS = Number(params.get("bpeLead")) || options.leadSeconds || 1.4;
  const quality = Number(params.get("bpeQ")) || options.jpegQuality || 56;
  let status: BpeStatus = "off";
  let statusDetail = "";
  let socket: WebSocket | null = null;
  let root: HTMLDivElement | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let ctx2d: CanvasRenderingContext2D | null = null;
  let raf = 0;
  let base: { bitmap: ImageBitmap; width: number; height: number } | null = null;
  let roi: [number, number, number, number] = [0, 0, 0, 0];
  const idle: Frame[] = [];
  let idleReady = false;
  let nextUtt = 2;
  let utt: Utt | null = null;
  let finishedUtt: { utt: Utt; at: number } | null = null;
  let lastDrawn: ImageBitmap | null = null;
  let fade: { from: ImageBitmap; started: number } | null = null;
  let horizonTimer = 0;
  let reconnects = 0;
  let reconnectTimer = 0;
  let lastMessageAt = 0;
  let watchdog = 0;
  let disposed = false;
  let presentation: PortraitPresentation = "consultation";
  let geometry = { width: 0, height: 0, scale: 1, ox: 0, oy: 0, dpr: 1 };
  let baseDrawn = false;
  let showingBase = false;
  let identity: { label: string; sha256: string; tag: number } | null = null;
  let loggedLayer = "";
  let currentQuality = quality;
  let qualityChangedAt = 0;
  let ackSentAt = 0;
  let mismatches = 0;
  let coverTimer = 0;
  const reports: UtteranceReport[] = [];
  const events: Array<{ at: number; event: string }> = [];
  let gpuStats: unknown = null;
  const connectMarks: Record<string, number> = {};
  const log = (event: string) => {
    events.push({ at: Math.round(performance.now()), event });
    if (events.length > 200) {
      events.shift();
    }
  };
  const setStatus = (next: BpeStatus, detail = "") => {
    if (status !== next || statusDetail !== detail) {
      status = next;
      statusDetail = detail;
      log(`status:${next}${detail ? `:${detail}` : ""}`);
      if (canvas) {
        canvas.dataset.status = next;
      }
    }
  };
  const send = (data: string | Uint8Array<ArrayBuffer>) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(data);
    }
  };
  const fallback = (detail: string) => {
    if (status === "fallback" || status === "off") {
      return;
    }
    setStatus("fallback", detail);
    log(`fallback:${detail}`);
    if (utt) {
      utt.report.outcome = `fallback:${detail}`;
    }
    socket?.close();
    socket = null;
    if (!disposed && reconnects < 12) {
      reconnects += 1;
      reconnectTimer = window.setTimeout(connect, Math.min(10_000, 2000 * reconnects));
    }
  };
  const onFrame = (data: ArrayBuffer) => {
    const view = new DataView(data);
    const kind = view.getUint8(0);
    const x = view.getUint16(2, true);
    const y = view.getUint16(4, true);
    const w = view.getUint16(6, true);
    const h = view.getUint16(8, true);
    const tag = view.getUint16(10, true);
    const index = view.getUint32(12, true);
    const uttId = view.getUint32(16, true);
    if (!identity || tag !== identity.tag) {
      mismatches += 1;
      if (mismatches === 1 || mismatches % 100 === 0) {
        log(`identity-mismatch:frame-tag:${tag}:locked:${identity?.label ?? "none"}:${mismatches}`);
      }
      return;
    }
    const blob = new Blob([new Uint8Array(data, headerBytes)], { type: "image/jpeg" });
    const arrivedAt = performance.now();
    if (kind === 1) {
      void createImageBitmap(blob).then((bitmap) => {
        const first = base === null;
        base = { bitmap, width: w, height: h };
        baseDrawn = false;
        connectMarks.base = performance.now();
        if (first) {
          window.clearTimeout(coverTimer);
          log(`first-frame:base:${identity?.label}`);
        }
      });
      return;
    }
    roi = [x, y, w, h];
    const frame: Frame = { index, arrivedAt, bitmap: null, blob };
    if (kind === 2) {
      idle[index] = frame;
      return;
    }
    const target = utt && utt.id === uttId ? utt : null;
    if (!target || target.cancelled) {
      return;
    }
    target.frames.set(index, frame);
    target.maxFrame = Math.max(target.maxFrame, index);
    // Flow control: tell the renderer how far the stream got (it bounds the frames in flight).
    if (arrivedAt - ackSentAt > 120) {
      ackSentAt = arrivedAt;
      send(JSON.stringify({ type: "ack", utt: target.id, frame: target.maxFrame }));
    }
    if (target.firstFrameAt === null) {
      target.firstFrameAt = arrivedAt;
      target.report.firstFrameMs = Math.round(arrivedAt - target.firstChunkAt);
      log(`utt:${target.id}:first-frame:${target.report.firstFrameMs}ms`);
    }
    target.report.framesReceived += 1;
    const need = Math.ceil(((index + 1) * target.rate) / fps);
    const sent = target.sent.find(([end]) => end >= need);
    if (sent) {
      target.report.audioToFrameMs.push(Math.round(arrivedAt - sent[1]));
    }
    const slackMs = Math.round((target.startAt + index / fps - target.context.currentTime) * 1000);
    target.report.slackMs.push(slackMs);
    // Adaptive bitrate: frames arriving close to (or after) their due time -> smaller JPEGs;
    // plenty of headroom for a while -> back up towards the configured quality.
    const now = performance.now();
    if (now - qualityChangedAt > 1500) {
      const next = slackMs < 350 ? Math.max(38, currentQuality - 8) : slackMs > 1200 ? Math.min(quality, currentQuality + 4) : currentQuality;
      if (next !== currentQuality) {
        currentQuality = next;
        qualityChangedAt = now;
        send(JSON.stringify({ type: "quality", jpegQuality: next }));
        log(`quality:${next}:slack:${slackMs}ms`);
      }
    }
    void createImageBitmap(blob).then((bitmap) => {
      if (target.frames.get(index) === frame && !target.cancelled) {
        frame.bitmap = bitmap;
      } else {
        bitmap.close();
      }
    });
  };
  const onMessage = (event: MessageEvent) => {
    lastMessageAt = performance.now();
    if (typeof event.data !== "string") {
      onFrame(event.data as ArrayBuffer);
      return;
    }
    const message = JSON.parse(event.data) as Record<string, unknown>;
    switch (message.type) {
      case "ready": {
        connectMarks.ready = performance.now();
        const announced = message.identity as { label?: string; sha256?: string } | undefined;
        const sha = String(announced?.sha256 ?? "");
        const label = String(announced?.label ?? "unknown");
        if (sha !== options.expectedPortraitSha256) {
          mismatches += 1;
          reconnects = Number.POSITIVE_INFINITY;
          fallback("unapproved-portrait-identity");
          break;
        }
        if (!/^[0-9a-f]{64}$/.test(sha)) {
          log("identity-mismatch:stream-without-identity");
          reconnects = Number.POSITIVE_INFINITY;
          fallback("identity-unknown");
          break;
        }
        if (!identity) {
          identity = { label, sha256: sha, tag: parseInt(sha.slice(0, 4), 16) };
          log(`identity:lock:${label}:${sha.slice(0, 12)}`);
        } else if (identity.sha256 !== sha) {
          // A different face than the one this page session already showed: never display it.
          log(`identity-mismatch:stream:${label}:${sha.slice(0, 12)}:locked:${identity.label}`);
          reconnects = Number.POSITIVE_INFINITY;
          fallback("identity-mismatch");
          break;
        }
        log(`ready:${String(message.device)}`);
        // Idle loop: 4 s of silence rendered once per connection (played forwards and back).
        send(JSON.stringify({ type: "utt-start", utt: 1, kind: "idle" }));
        send(JSON.stringify({ type: "utt-end", utt: 1, end: 24000 * 4 }));
        break;
      }
      case "utt-done":
        if (message.utt === 1) {
          const frames = idle.filter(Boolean);
          void Promise.all(frames.map((frame) => createImageBitmap(frame.blob).then((bitmap) => (frame.bitmap = bitmap)))).then(() => {
            idleReady = true;
            connectMarks.idle = performance.now();
            reconnects = 0;
            log("first-frame:idle");
            setStatus("ready");
          });
        } else if (utt && message.utt === utt.id) {
          utt.serverDone = true;
        }
        break;
      case "stats":
        gpuStats = message;
        break;
      case "error":
      case "gpu-closed":
        log(`server:${String(message.code ?? message.message ?? message.reason)}`);
        if (message.reason === "replaced") {
          // Another tab took the one live GPU session: stay on the still portrait, no reconnect
          // (two tabs reconnecting would take it from each other forever). A reload reclaims it.
          reconnects = Number.POSITIVE_INFINITY;
          fallback("replaced-by-another-tab");
          break;
        }
        fallback(String(message.code ?? message.message ?? "gpu"));
        break;
      default:
        log(`msg:${String(message.type)}`);
    }
  };
  function connect() {
    if (disposed) {
      return;
    }
    const url = options.url ?? `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/api/bpe/stream`;
    setStatus("connecting");
    idle.length = 0;
    idleReady = false;
    connectMarks.start = performance.now();
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    socket = ws;
    ws.onopen = () => {
      connectMarks.open = performance.now();
      lastMessageAt = performance.now();
      log("stream-start");
      ws.send(JSON.stringify({ type: "hello", sampleRate: 24000, jpegQuality: quality }));
    };
    // Messages of a socket that was already replaced (after a fallback) must not change the state.
    ws.onmessage = (event) => {
      if (socket === ws) {
        onMessage(event);
      }
    };
    ws.onerror = () => {
      if (socket === ws) {
        fallback("socket-error");
      }
    };
    ws.onclose = () => {
      if (socket === ws) {
        fallback("socket-closed");
      }
    };
  }
  const finishUtt = (current: Utt, outcome: string) => {
    window.clearInterval(horizonTimer);
    current.report.outcome ??= outcome;
    current.report.audioSeconds = Math.round((current.audioEnd / current.rate) * 100) / 100;
    reports.push(current.report);
    if (reports.length > 20) {
      reports.shift();
    }
  };
  const voiceTap: VoiceTap = {
    lead: () => (status === "ready" ? leadS : 0.08),
    horizonLead: () => (status === "ready" ? leadS - 0.15 : 0.03),
    begin(turnId, context, startAt, sampleRate) {
      if (utt && !utt.cancelled && utt.endSample === null) {
        finishUtt(utt, "superseded");
      }
      if (status !== "ready") {
        utt = null;
        return;
      }
      const id = nextUtt++;
      utt = {
        id,
        turnId,
        context,
        startAt,
        rate: sampleRate,
        audioEnd: 0,
        horizon: 0,
        endSample: null,
        cancelled: false,
        serverDone: false,
        frames: new Map(),
        maxFrame: -1,
        sent: [],
        firstChunkAt: performance.now(),
        firstFrameAt: null,
        degraded: false,
        report: {
          utt: id,
          turnId,
          outcome: null,
          audioSeconds: 0,
          framesReceived: 0,
          framesDrawn: 0,
          framesLate: 0,
          firstFrameMs: null,
          audioToFrameMs: [],
          syncErrorMs: [],
          slackMs: [],
          cancelToIdleMs: null,
          degraded: false,
        },
      };
      send(JSON.stringify({ type: "utt-start", utt: id }));
      const current = utt;
      window.clearInterval(horizonTimer);
      horizonTimer = window.setInterval(() => {
        if (current.cancelled || current.endSample !== null || utt !== current) {
          window.clearInterval(horizonTimer);
          return;
        }
        // Nothing can be scheduled before now + horizonLead: those positions are final.
        const upTo = Math.max(current.audioEnd, Math.floor((current.context.currentTime - current.startAt + voiceTap.horizonLead()) * current.rate));
        if (upTo > current.horizon) {
          current.horizon = upTo;
          send(JSON.stringify({ type: "horizon", utt: current.id, upTo }));
        }
      }, 40);
      log(`utt:${id}:begin`);
    },
    chunk(turnId, at, pcmBase64, sampleRate) {
      const current = utt;
      if (!current || current.turnId !== turnId || current.cancelled || sampleRate !== current.rate) {
        return;
      }
      const bytes = decodeBase64(pcmBase64);
      const position = Math.max(Math.round(at * current.rate), current.horizon);
      const message = new Uint8Array(12 + bytes.length);
      const view = new DataView(message.buffer);
      view.setUint8(0, 0x10);
      view.setUint32(4, current.id, true);
      view.setUint32(8, position, true);
      message.set(bytes, 12);
      send(message);
      current.audioEnd = Math.max(current.audioEnd, position + (bytes.length >> 1));
      current.sent.push([current.audioEnd, performance.now()]);
      if (current.audioEnd > current.horizon) {
        current.horizon = current.audioEnd;
        send(JSON.stringify({ type: "horizon", utt: current.id, upTo: current.audioEnd }));
      }
    },
    end(turnId, outcome) {
      const current = utt;
      if (!current || current.turnId !== turnId || current.endSample !== null || current.cancelled) {
        return;
      }
      if (outcome === "interrupted") {
        current.cancelled = true;
        send(JSON.stringify({ type: "cancel", utt: current.id }));
        current.report.cancelToIdleMs = 0;
        finishUtt(current, "interrupted");
        utt = null;
        log(`utt:${current.id}:cancel`);
        return;
      }
      current.endSample = current.audioEnd;
      send(JSON.stringify({ type: "utt-end", utt: current.id, end: current.audioEnd }));
      log(`utt:${current.id}:end:${outcome}`);
    },
  };
  const layout = () => {
    if (!canvas || !root || !base) {
      return;
    }
    const rect = root.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (width === geometry.width && height === geometry.height && geometry.dpr === dpr) {
      return;
    }
    canvas.width = width;
    canvas.height = height;
    // object-fit: cover; object-position: 50% 16% (same framing as the portrait poster).
    const scale = Math.max(width / base.width, height / base.height);
    geometry = { width, height, scale, ox: (width - base.width * scale) * 0.5, oy: (height - base.height * scale) * 0.16, dpr };
    baseDrawn = false;
  };
  const drawRoi = (bitmap: ImageBitmap, alpha = 1) => {
    if (!ctx2d) {
      return;
    }
    const [x, y, w, h] = roi;
    ctx2d.globalAlpha = alpha;
    try {
      ctx2d.drawImage(bitmap, geometry.ox + x * geometry.scale, geometry.oy + y * geometry.scale, w * geometry.scale, h * geometry.scale);
    } catch {
      // A released bitmap: skip this draw.
    }
    ctx2d.globalAlpha = 1;
  };
  const pickIdle = () => {
    const frames = idle.filter((frame) => frame?.bitmap);
    if (!frames.length) {
      return null;
    }
    const period = Math.max(1, frames.length * 2 - 2);
    const step = Math.floor((performance.now() / 1000) * fps) % period;
    return frames[step < frames.length ? step : period - step].bitmap;
  };
  const drawBase = () => {
    if (ctx2d && base) {
      ctx2d.drawImage(base.bitmap, geometry.ox, geometry.oy, base.width * geometry.scale, base.height * geometry.scale);
    }
  };
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!ctx2d || !canvas || !base) {
      return;
    }
    layout();
    if (!baseDrawn) {
      drawBase();
      baseDrawn = true;
      lastDrawn = null;
      showingBase = true;
    }
    const live = status === "ready" && idleReady;
    let bitmap: ImageBitmap | null = null;
    if (utt && !utt.cancelled && utt.endSample !== null) {
      const ending = utt;
      const endFrame = Math.ceil((ending.endSample! / ending.rate) * fps) + tailFrames;
      if ((heardTime(ending.context) - ending.startAt) * fps >= endFrame) {
        finishUtt(ending, ending.degraded ? "completed-degraded" : "completed");
        log(`utt:${ending.id}:ended${ending.degraded ? ":degraded" : ""}`);
        finishedUtt = { utt: ending, at: performance.now() };
        utt = null;
      }
    }
    const current = live ? utt : null;
    if (current && !current.cancelled && !current.degraded) {
      const tau = heardTime(current.context) - current.startAt;
      const lastFrame = current.endSample !== null ? Math.ceil((current.endSample / current.rate) * fps) + tailFrames : Infinity;
      if (tau >= 0 && tau * fps < lastFrame) {
        const due = Math.floor(tau * fps);
        let shown = due;
        while (shown >= 0 && !current.frames.get(shown)?.bitmap) {
          shown -= 1;
        }
        if (shown >= 0) {
          bitmap = current.frames.get(shown)!.bitmap;
          if (bitmap !== lastDrawn) {
            current.report.framesDrawn += 1;
            current.report.syncErrorMs.push(Math.round((tau - (shown + 0.5) / fps) * 1000));
            if (shown < due) {
              current.report.framesLate += 1;
            }
          }
          // Release frames that can no longer be shown.
          for (const [index, frame] of current.frames) {
            if (index < shown - 3 && frame.bitmap !== lastDrawn && frame.bitmap !== fade?.from) {
              frame.bitmap?.close();
              current.frames.delete(index);
            }
          }
        }
        if (tau - (current.maxFrame + 1) / fps > stallSeconds && current.context.state === "running") {
          // Transport stall: hide the video for the rest of this reply (voice + still portrait go on);
          // the next reply shows the live face again. Only a closed or failed socket is a hard fallback.
          current.degraded = true;
          current.report.degraded = true;
          log(`utt:${current.id}:stalled`);
        }
      }
    }
    if (!bitmap && live && !(current && current.degraded)) {
      bitmap = pickIdle();
    }
    if (!bitmap) {
      // Static neutral photo of the same identity (connecting, GPU fallback, stalled reply).
      if (!showingBase) {
        const from = lastDrawn;
        drawBase();
        showingBase = true;
        lastDrawn = null;
        fade = from ? { from, started: performance.now() } : null;
      }
      if (loggedLayer !== "static") {
        loggedLayer = "static";
        log("layer:static");
      }
      if (fade) {
        const t = (performance.now() - fade.started) / crossfadeMs;
        drawBase();
        if (t < 1) {
          drawRoi(fade.from, 1 - t);
        } else {
          fade = null;
        }
      }
      return;
    }
    if (showingBase) {
      showingBase = false;
    }
    if (loggedLayer !== "live") {
      loggedLayer = "live";
      log("layer:live");
    }
    const switching = lastDrawn !== null && bitmap !== lastDrawn && (lastDrawn.width !== bitmap.width || isIdle(lastDrawn) !== isIdle(bitmap));
    if (switching && lastDrawn) {
      fade = { from: lastDrawn, started: performance.now() };
    }
    if (bitmap !== lastDrawn || fade) {
      drawRoi(bitmap);
      if (fade) {
        const t = (performance.now() - fade.started) / crossfadeMs;
        if (t < 1) {
          drawRoi(fade.from, 1 - t);
        } else {
          fade = null;
        }
      }
      lastDrawn = bitmap;
    }
  };
  const isIdle = (bitmap: ImageBitmap) => idle.some((frame) => frame?.bitmap === bitmap);

  const cutToIdle = () => {
    if (lastDrawn) {
      fade = { from: lastDrawn, started: performance.now() };
    }
  };
  const debugState = () => ({
    status,
    statusDetail,
    leadS,
    quality,
    currentQuality,
    identity: identity ? { label: identity.label, sha256: identity.sha256.slice(0, 16), tag: identity.tag } : null,
    identityMismatches: mismatches,
    layer: showingBase ? "static" : "live",
    idleFrames: idle.filter(Boolean).length,
    roi,
    base: base ? [base.width, base.height] : null,
    connectMs: connectMarks.start
      ? {
          open: connectMarks.open ? Math.round(connectMarks.open - connectMarks.start) : null,
          ready: connectMarks.ready ? Math.round(connectMarks.ready - connectMarks.start) : null,
          idle: connectMarks.idle ? Math.round(connectMarks.idle - connectMarks.start) : null,
        }
      : null,
    current: utt ? { utt: utt.id, turnId: utt.turnId, audioEnd: utt.audioEnd, maxFrame: utt.maxFrame } : null,
    lastFinished: finishedUtt ? finishedUtt.utt.id : null,
    reports,
    gpuStats,
    events: events.slice(-60),
  });
  (window as unknown as { __vaBpe?: unknown }).__vaBpe = { state: debugState };
  return {
    ...inner,
    id: "bpe-live",
    voiceTap,
    bpeStatus: () => status,
    async mount(container) {
      disposed = false;
      await inner.mount(container);
      root = document.createElement("div");
      root.className = "va-bpe";
      root.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;";
      canvas = document.createElement("canvas");
      canvas.className = "va-bpe__canvas";
      canvas.setAttribute("aria-hidden", "true");
      // Covers the page portrait from the first paint (one identity per session, never black):
      // warm neutral fill until the stream's own neutral photo is decoded.
      canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;opacity:1;transition:opacity 220ms ease;background:radial-gradient(120% 90% at 50% 30%,#3a2c22 0%,#1c1612 70%);";
      canvas.dataset.status = status;
      root.appendChild(canvas);
      container.appendChild(root);
      ctx2d = canvas.getContext("2d", { alpha: true });
      coverTimer = window.setTimeout(() => {
        if (!base && canvas) {
          // No stream identity at all: this session keeps the page portrait and refuses stream frames.
          identity ??= { label: "page-portrait", sha256: "page-portrait", tag: -1 };
          canvas.style.opacity = "0";
          log("fallback:no-stream-identity:page-portrait");
        }
      }, 8000);
      raf = requestAnimationFrame(tick);
      // Liveness: the renderer reports stats every 2 s. Silence means a dead GPU or a half-open
      // tunnel (an SSM forward can keep the socket open after the far end died): hard fallback.
      watchdog = window.setInterval(() => {
        if (status === "ready" && performance.now() - lastMessageAt > 6000) {
          fallback("gpu-silent");
        }
      }, 1000);
      connect();
    },
    setState(state: AdvisorPresenceState) {
      inner.setState(state);
    },
    async speak(utterance: AdvisorUtterance) {
      await inner.speak(utterance);
    },
    interrupt() {
      inner.interrupt();
      cutToIdle();
    },
    dispose() {
      disposed = true;
      window.clearTimeout(reconnectTimer);
      window.clearInterval(horizonTimer);
      window.clearInterval(watchdog);
      window.clearTimeout(coverTimer);
      cancelAnimationFrame(raf);
      socket?.close();
      socket = null;
      root?.remove();
      root = null;
      canvas = null;
      ctx2d = null;
      setStatus("off");
      inner.dispose();
    },
    setPresentation(next: PortraitPresentation) {
      presentation = next;
      if (canvas) {
        canvas.style.transform = presentation === "compact" ? "scale(1.9)" : "";
        canvas.style.transformOrigin = "50% 26%";
      }
      geometry = { ...geometry, width: 0 };
      inner.setPresentation(next);
    },
    debug: () => ({ ...inner.debug(), bpe: debugState() }),
  };
}
