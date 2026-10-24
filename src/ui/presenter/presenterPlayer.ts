import type { PresenterClip } from "./presenterMedia";

export type SpeechFailure = "error" | "blocked" | "timeout" | "stalled";
export type SpeechHandlers = {
  onPlaying: () => void;
  onEnded: () => void;
  // atMs: where the clip was when it failed (the transcript fallback continues from that line).
  onFailed: (reason: SpeechFailure, atMs: number) => void;
  // Paused from outside the presenter (media key, system media controls, an OS audio interruption).
  onInterrupted: () => void;
};

// A clip that has not started 8 s after the click, or stops advancing for 8 s, counts as unavailable.
const START_TIMEOUT_MS = 8000;
const STALL_TIMEOUT_MS = 8000;

function makeVideo(className: string) {
  const video = document.createElement("video");
  video.className = `studio-presence__video ${className}`;
  video.muted = true;
  video.playsInline = true;
  video.preload = "none";
  video.disablePictureInPicture = true;
  video.setAttribute("disableremoteplayback", "");
  video.setAttribute("aria-hidden", "true");
  return video;
}

/** The presenter's two pre-recorded media slots: a silent idle loop and the answer clip. They are created once and moved
 *  between the HOME stage plate and the dock plate, so the picture survives route changes. Every answer start opens a
 *  new generation; play() results and media events of an older generation are ignored. Rest frame, idle and answer
 *  clips share one first frame, so idle ↔ answer are hard cuts. */
export class PresenterPlayer {
  private idleVideo: HTMLVideoElement | null = null;
  private speechVideo: HTMLVideoElement | null = null;
  private host: HTMLElement | null = null;
  private generation = 0;
  private idleWanted = false;
  // The generation whose answer may be playing; 0 when none (stopped, ended, failed, released).
  private active = 0;
  // An answer is speaking over the still (reduced motion): the idle loop stays away until it ends.
  private voiceOnly = false;
  private detachSpeech: () => void = () => undefined;

  private get idle() { return (this.idleVideo ??= makeVideo("studio-presence__video--idle")); }
  private get speech() {
    if (!this.speechVideo) {
      const speech = makeVideo("studio-presence__video--speech");
      // A media key or the browser's media controls cannot resume an answer the presenter has ended.
      speech.addEventListener("play", () => { if (!this.active) speech.pause(); });
      this.speechVideo = speech;
    }
    return this.speechVideo;
  }

  /** Moves both slots into a plate; returns the matching detach. */
  mount(host: HTMLElement) {
    this.host = host;
    host.append(this.idle, this.speech);
    this.refreshIdle();
    return () => {
      if (this.host !== host) return;
      this.host = null;
      this.idle.pause();
      this.idle.remove();
      this.speech.remove();
    };
  }

  /** Loads the idle loop once the visitor engages (hover, focus or open); nothing is fetched before. */
  prepareIdle(clip: PresenterClip | null) {
    if (!clip || this.idle.getAttribute("src") === clip.src) return;
    this.idle.loop = true;
    this.idle.preload = "auto";
    this.idle.src = clip.src;
  }

  setIdle(wanted: boolean) {
    this.idleWanted = wanted;
    this.refreshIdle();
  }

  private refreshIdle() {
    const idle = this.idle;
    const show = (visible: boolean) => idle.classList.toggle("is-visible", visible);
    if (!this.idleWanted || !this.host || !idle.getAttribute("src") || this.speaking() || this.voiceOnly) {
      idle.pause();
      show(false);
      return;
    }
    const reveal = () => show(true);
    idle.addEventListener("playing", reveal, { once: true });
    idle.play().catch(() => idle.removeEventListener("playing", reveal));
  }

  private speaking() {
    return this.speech.classList.contains("is-visible");
  }

  /** Starts an answer clip from its first frame; called in the commit of the visitor's click. Returns its generation. */
  speak(clip: PresenterClip, audible: boolean, showPicture: boolean, handlers: SpeechHandlers) {
    this.detachSpeech();
    const generation = ++this.generation;
    this.active = generation;
    const speech = this.speech;
    const current = () => generation === this.generation;
    let lastTime = -1;
    let lastAdvance = performance.now();
    let started = false;

    const fail = (reason: SpeechFailure) => {
      if (!current()) return;
      const atMs = speech.currentTime * 1000;
      this.endSpeech(generation);
      // Nothing more is downloaded for a clip that will not be shown.
      speech.removeAttribute("src");
      speech.load();
      handlers.onFailed(reason, atMs);
    };
    const onPause = () => {
      if (!current() || !started || speech.ended) return;
      this.endSpeech(generation);
      handlers.onInterrupted();
    };
    const onPlaying = () => {
      if (!current()) return;
      if (!started) {
        started = true;
        // Reduced motion: the voice plays over the still; no loop either.
        if (!showPicture) {
          this.voiceOnly = true;
          this.refreshIdle();
        } else {
          // The answer fades in over the idle loop (which may be mid-pose) before the loop is put away.
          speech.classList.add("is-visible");
          window.setTimeout(() => {
            if (!current() || !this.speaking()) return;
            this.idle.pause();
            this.idle.classList.remove("is-visible");
          }, 220);
        }
        handlers.onPlaying();
      }
    };
    const onEnded = () => {
      if (!current()) return;
      this.endSpeech(generation);
      handlers.onEnded();
    };
    const onError = () => fail("error");
    const watchdog = window.setInterval(() => {
      if (!current()) { window.clearInterval(watchdog); return; }
      const now = performance.now();
      if (!started) { if (now - lastAdvance > START_TIMEOUT_MS) fail("timeout"); return; }
      if (speech.paused) return;
      if (speech.currentTime !== lastTime) { lastTime = speech.currentTime; lastAdvance = now; }
      else if (now - lastAdvance > STALL_TIMEOUT_MS) fail("stalled");
    }, 250);

    speech.addEventListener("playing", onPlaying);
    speech.addEventListener("ended", onEnded);
    speech.addEventListener("error", onError);
    speech.addEventListener("pause", onPause);
    this.detachSpeech = () => {
      window.clearInterval(watchdog);
      speech.removeEventListener("playing", onPlaying);
      speech.removeEventListener("ended", onEnded);
      speech.removeEventListener("error", onError);
      speech.removeEventListener("pause", onPause);
    };

    if (speech.getAttribute("src") !== clip.src) speech.src = clip.src;
    speech.preload = "auto";
    speech.muted = !audible;
    try { speech.currentTime = 0; } catch { /* not seekable before metadata; it starts at 0 anyway */ }
    speech.play().catch((error: unknown) => fail(error instanceof DOMException && error.name === "NotAllowedError" ? "blocked" : "error"));
    return generation;
  }

  /** Ends the given answer (Stop, a new answer, Back, Close, unmount). A newer answer is never touched. */
  endSpeech(generation: number) {
    if (generation !== this.generation) return;
    this.generation++;
    this.active = 0;
    this.voiceOnly = false;
    this.detachSpeech();
    this.detachSpeech = () => undefined;
    const speech = this.speech;
    speech.pause();
    if (speech.classList.contains("is-visible")) {
      // Every clip ends on the shared rest frame: the idle loop takes over from its own first frame.
      speech.classList.remove("is-visible");
      this.idle.classList.remove("is-visible");
      if (this.idle.readyState > 0) this.idle.currentTime = 0;
    }
    this.refreshIdle();
  }

  isCurrent(generation: number) { return generation === this.generation; }
  /** The answer clip's own clock (ms). */
  time() { return this.speech.currentTime * 1000; }
  setMuted(muted: boolean) { this.speech.muted = muted; }

  /** Close: stops everything and lets the browser drop both media buffers. */
  release() {
    this.generation++;
    this.active = 0;
    this.voiceOnly = false;
    this.detachSpeech();
    this.detachSpeech = () => undefined;
    this.idleWanted = false;
    for (const video of [this.idleVideo, this.speechVideo]) {
      if (!video) continue;
      video.pause();
      video.classList.remove("is-visible");
      video.removeAttribute("src");
      video.load();
    }
  }
}
