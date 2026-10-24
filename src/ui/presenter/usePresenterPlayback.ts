import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { PresenterAnswer } from "./presenterContent";
import type { PresenterEvent, PresenterState } from "./presenterMachine";
import type { PresenterClip } from "./presenterMedia";
import type { PresenterPlayer, SpeechFailure } from "./presenterPlayer";

export type PresenterTimeline = { durationMs: number; cueStartsMs: readonly number[] };

// How the current answer is presented:
//  "loading"     – the answer clip was requested in the visitor's click and has not produced a frame yet;
//  "speaking"    – the clip plays: captions and director cues follow its own clock;
//  "transcript"  – no clip exists for this answer (yet): still portrait and readable text, labelled as pending;
//  "unavailable" – the clip failed (error, blocked, slow, stalled): the same transcript fallback, labelled as such.
export type PresenterMediaStatus = "loading" | "speaking" | "transcript" | "unavailable";
export type PresenterPosition = {
  run: number;
  second: number;
  cue: number;
  durationMs: number;
  // Director steps wait for this: the clip's first frame, or the transcript's first line.
  started: boolean;
  status: PresenterMediaStatus;
  failure?: SpeechFailure;
};
type Clock = Omit<PresenterPosition, "status" | "failure">;
type Mode = { run: number; status: PresenterMediaStatus; failure?: SpeechFailure; fromCue: number };

const WORDS_PER_SECOND = 2.6;
const CUE_PAUSE_MS = 380;
const LEAD_IN_MS = 450;

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

// Reading pace for the transcript fallback; no voice is implied (the dock labels it as a transcript).
export function estimateTimeline(cues: readonly string[]): PresenterTimeline {
  let at = LEAD_IN_MS;
  const cueStartsMs = cues.map((cue) => {
    const start = at;
    at += (countWords(cue) / WORDS_PER_SECOND) * 1000 + CUE_PAUSE_MS;
    return Math.round(start);
  });
  return { durationMs: Math.round(at), cueStartsMs };
}

export function cueAt(cueStartsMs: readonly number[], elapsedMs: number) {
  let index = 0;
  cueStartsMs.forEach((start, cue) => { if (elapsedMs >= start) index = cue; });
  return index;
}

type Options = {
  state: PresenterState;
  answer: PresenterAnswer | null;
  clip?: PresenterClip;
  player: PresenterPlayer;
  // Receives --presenter-progress (0–1) every frame without re-rendering the dock; only a playing clip shows it.
  progress: RefObject<HTMLElement | null>;
  // Voice plays only after an explicit question click and never from the idle loop.
  audible: boolean;
  // Reduced motion: the clip's voice and captions play, the picture stays on the still.
  showPicture: boolean;
  dispatch: (event: PresenterEvent) => void;
};

export function usePresenterPlayback({ state, answer, clip, player, progress, audible, showPicture, dispatch }: Options): PresenterPosition {
  const [clock, setClock] = useState<Clock>({ run: 0, second: 0, cue: 0, durationMs: 0, started: false });
  const [mode, setMode] = useState<Mode>({ run: 0, status: "transcript", fromCue: 0 });
  const audibleRef = useRef(audible);
  const pictureRef = useRef(showPicture);
  const estimate = useMemo(() => (answer ? estimateTimeline(answer.cues) : null), [answer]);
  const run = state.run;
  const playing = state.phase === "playing_answer";
  const current: Mode = mode.run === run ? mode : { run, status: clip ? "loading" : "transcript", fromCue: 0 };
  const usesClip = current.status === "loading" || current.status === "speaking";
  const fromCue = current.fromCue;

  const paint = useCallback((next: Clock) => setClock((prev) => (
    prev.run === next.run && prev.second === next.second && prev.cue === next.cue && prev.durationMs === next.durationMs && prev.started === next.started
      ? prev : next)), []);

  // Voice on/off applies to the running clip without restarting it; reduced motion applies from the next answer.
  useEffect(() => {
    audibleRef.current = audible;
    player.setMuted(!audible);
  }, [audible, player]);
  useEffect(() => { pictureRef.current = showPicture; }, [showPicture]);

  // The clip starts in the commit of the visitor's click (user activation for the voice). Its events are scoped to
  // this run, so a late play() or "ended" of an earlier answer can never move this one.
  useLayoutEffect(() => {
    if (!answer || !clip || !playing || !usesClip) return;
    let frame = 0;
    const cueStartsMs = clip.cueStartsMs ?? [];
    const tick = () => {
      const elapsed = Math.min(player.time(), clip.durationMs);
      progress.current?.style.setProperty("--presenter-progress", String(elapsed / clip.durationMs));
      paint({ run, second: Math.round(elapsed / 1000), cue: cueAt(cueStartsMs, elapsed), durationMs: clip.durationMs, started: true });
      frame = window.requestAnimationFrame(tick);
    };
    const generation = player.speak(clip, audibleRef.current, pictureRef.current, {
      onPlaying: () => {
        setMode({ run, status: "speaking", fromCue: 0 });
        frame = window.requestAnimationFrame(tick);
      },
      onEnded: () => {
        window.cancelAnimationFrame(frame);
        progress.current?.style.setProperty("--presenter-progress", "1");
        dispatch({ type: "ended" });
      },
      onFailed: (failure, atMs) => {
        window.cancelAnimationFrame(frame);
        progress.current?.style.setProperty("--presenter-progress", "0");
        // The tour continues as a labelled transcript from the line that was on screen.
        setMode({ run, status: "unavailable", failure, fromCue: cueAt(cueStartsMs, atMs) });
      },
      // Paused from outside (media key, system controls): the answer stops like Stop, honestly.
      onInterrupted: () => {
        window.cancelAnimationFrame(frame);
        dispatch({ type: "interrupt" });
      },
    });
    return () => {
      window.cancelAnimationFrame(frame);
      player.endSpeech(generation);
    };
  }, [answer, clip, playing, run, usesClip, player, progress, dispatch, paint]);

  // Transcript fallback: a reading clock that starts at the line the visitor was on.
  useEffect(() => {
    if (!answer || !estimate || !playing || usesClip) return;
    let frame = 0;
    let started = 0;
    const offset = estimate.cueStartsMs[fromCue] ?? 0;
    const tick = (now: number) => {
      if (!started) started = now;
      const elapsed = Math.min(offset + now - started, estimate.durationMs);
      paint({ run, second: Math.round(elapsed / 1000), cue: cueAt(estimate.cueStartsMs, elapsed), durationMs: estimate.durationMs, started: true });
      if (elapsed >= estimate.durationMs) {
        dispatch({ type: "ended" });
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [answer, estimate, playing, run, usesClip, fromCue, dispatch, paint]);

  // Before the first frame of a run, report its start instead of the previous run's last position.
  const base = clock.run === run ? clock : { run, second: 0, cue: fromCue, durationMs: clip?.durationMs ?? estimate?.durationMs ?? 0, started: false };
  return { ...base, status: current.status, failure: current.failure };
}
