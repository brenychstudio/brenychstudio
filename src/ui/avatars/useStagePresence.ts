import { useCallback, useEffect, useRef, useState, type RefObject, type SyntheticEvent } from "react";
import { spokenClipFor, type CharacterMedia } from "../../data/avatarMedia";
import type { AvatarLocale } from "../../data/avatarProfiles";
import { useSound } from "../../stage/audio/useSound";

/** The stage's media life cycle (AVATARS-02). Every state comes from events of the real media elements. */
export type PresenceState =
  | "poster"
  | "idle-loading"
  | "idle-playing"
  | "speech-loading"
  | "speech-playing"
  | "speech-paused"
  | "speech-complete"
  | "media-error";

type Speech = "none" | "loading" | "playing" | "paused" | "complete" | "error";

function motionAllowed() {
  if (typeof window === "undefined") return false;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  return !saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const interrupted = (error: unknown) => error instanceof DOMException && error.name === "AbortError";

/**
 * One actor's presence on the stage: a muted idle loop while the stage is visible (never with reduced motion or Save-Data,
 * and only once the actor's still has arrived), and a recorded introduction that starts only from a click, with captions
 * and progress read from the clip's own clock. A new actor (the `media` object changes) or leaving the page stops everything
 * and releases the files; a new language releases the introduction only. While the introduction speaks, a running site
 * ambient fades out and comes back afterwards; the visitor's sound settings never change. `onSettle` hears when the
 * introduction ends or fails, so the overlay can keep keyboard focus.
 */
export function useStagePresence({ media, locale, stage, onSettle }: {
  media: CharacterMedia | undefined;
  locale: AvatarLocale;
  stage: RefObject<HTMLElement | null>;
  onSettle?: (outcome: "ended" | "failed") => void;
}) {
  const idleRef = useRef<HTMLVideoElement>(null);
  const speechRef = useRef<HTMLVideoElement>(null);
  const [presented, setPresented] = useState({ media, locale });
  const [speech, setSpeech] = useState<Speech>("none");
  const [idleOn, setIdleOn] = useState(false);
  const [idleFailed, setIdleFailed] = useState(false);
  const [caption, setCaption] = useState("");
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === "undefined" || document.visibilityState === "visible");
  const [motion, setMotion] = useState(motionAllowed);
  const [posterArrived, setPosterArrived] = useState(0);
  const run = useRef(0);
  const speechRun = useRef<{ node: HTMLVideoElement; generation: number } | null>(null);
  const ducked = useRef<ReturnType<typeof useSound> | null>(null);
  const idleHeld = useRef(true); // the idle loop is paused by this hook, not by the browser
  const sound = useSound();
  const soundRef = useRef(sound);
  const settleRef = useRef(onSettle);
  useEffect(() => {
    soundRef.current = sound;
    settleRef.current = onSettle;
  });

  // A new actor starts from its poster. The other language (both locales render this same page instance) stops the
  // introduction, so the next one loads the captions of the page language; the idle loop has no language and goes on
  // (state adjusted during render, as for the hash).
  if (media !== presented.media || locale !== presented.locale) {
    const newActor = media !== presented.media;
    setPresented({ media, locale });
    setSpeech("none");
    if (newActor) {
      setIdleOn(false);
      setIdleFailed(false);
    }
    setCaption("");
    setTime({ current: 0, duration: 0 });
  }

  const idle = media?.idle;
  const spoken = spokenClipFor(media, locale);
  const captionTrack = spoken ? (spoken.captions[locale] ?? spoken.captions[spoken.audioLocale]) : undefined;
  const speaking = speech === "loading" || speech === "playing" || speech === "paused";
  const idleWanted = Boolean(idle) && !idleFailed && motion && visible && pageVisible && !speaking;

  const restoreAmbient = useCallback(() => {
    const before = ducked.current;
    ducked.current = null;
    const current = soundRef.current;
    // A later sound preference or scene change belongs to the visitor; a sample must not undo it.
    if (!before || before.preference !== current.preference || before.scene !== current.scene || before.sceneId !== current.sceneId) return;
    void current.enableAmbient();
  }, []);
  const duckAmbient = useCallback(() => {
    if (ducked.current || !soundRef.current.ambientEnabled) return;
    ducked.current = soundRef.current;
    soundRef.current.stopAmbient();
  }, []);
  const invalidateSpeech = useCallback(() => {
    ++run.current;
    speechRun.current = null;
  }, []);

  // Visibility of the stage and of the page, and the visitor's motion / data preferences.
  useEffect(() => {
    const node = stage.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [stage]);
  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
    const onMotion = () => setMotion(motionAllowed());
    document.addEventListener("visibilitychange", onVisibility);
    query.addEventListener("change", onMotion);
    connection?.addEventListener?.("change", onMotion);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      query.removeEventListener("change", onMotion);
      connection?.removeEventListener?.("change", onMotion);
    };
  }, []);

  // Leaving an actor, a language or the page: stop and release the introduction, bring the ambient back. Late events of
  // the released clip are ignored.
  useEffect(() => {
    ++run.current;
    const speechNode = speechRef.current;
    return () => {
      invalidateSpeech();
      if (speechNode) {
        speechNode.pause();
        for (const track of Array.from(speechNode.textTracks)) track.oncuechange = null;
        speechNode.removeAttribute("src");
        speechNode.load();
      }
      restoreAmbient();
    };
  }, [media, locale, restoreAmbient, invalidateSpeech]);
  // Leaving an actor or the page: release the idle loop too.
  useEffect(() => {
    const idleNode = idleRef.current;
    return () => {
      idleHeld.current = true;
      if (!idleNode) return;
      idleNode.pause();
      idleNode.removeAttribute("src");
      idleNode.load();
    };
  }, [media]);

  // The idle loop is requested only while wanted, once the actor's still has arrived (the still is the page's largest
  // paint), and paused otherwise; a refused or failed play leaves the poster.
  useEffect(() => {
    const node = idleRef.current;
    if (!node || !idle) return;
    if (!idleWanted) {
      idleHeld.current = true;
      node.pause();
      return;
    }
    const still = stage.current?.querySelector<HTMLImageElement>(".av-stage__figure > img.is-active");
    if (still && !still.complete) {
      const arrived = () => setPosterArrived((count) => count + 1);
      still.addEventListener("load", arrived, { once: true });
      still.addEventListener("error", arrived, { once: true });
      return () => {
        still.removeEventListener("load", arrived);
        still.removeEventListener("error", arrived);
      };
    }
    // Give the already-arrived poster a paint before attaching/decoding video. Cancel if the actor or visibility changes.
    let cancelled = false;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (cancelled || node !== idleRef.current) return;
        if (node.getAttribute("src") !== idle.src) {
          node.src = idle.src;
          node.load();
        }
        idleHeld.current = false;
        node.muted = true;
        node.play().catch((error: unknown) => {
          if (cancelled || node !== idleRef.current) return;
          if (error instanceof DOMException && error.name === "NotSupportedError") setIdleFailed(true);
        });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [idle, idleWanted, posterArrived, stage]);

  // A hidden tab pauses the introduction; the visitor resumes it.
  useEffect(() => {
    if (!pageVisible) speechRef.current?.pause();
  }, [pageVisible]);

  const fail = useCallback(() => {
    speechRun.current = null;
    setCaption("");
    setSpeech("error");
    restoreAmbient();
    settleRef.current?.("failed");
  }, [restoreAmbient]);

  const play = useCallback((fromStart: boolean) => {
    const node = speechRef.current;
    if (!node || !spoken) return;
    // The same player can appear in the stage and its performance proof. One audible performance at a time.
    document.querySelectorAll<HTMLMediaElement>('video,audio').forEach(other => {
      if (other !== node && !other.muted && !other.paused) other.pause();
    });
    const generation = ++run.current;
    speechRun.current = { node, generation };
    idleHeld.current = true;
    idleRef.current?.pause();
    duckAmbient();
    // A clip that failed before (network, decode) is fetched again: play() alone would reject without a new request.
    if (node.getAttribute("src") !== spoken.src || node.error) {
      node.src = spoken.src;
      node.load();
    }
    if (fromStart) {
      node.currentTime = 0;
      setCaption("");
    }
    node.muted = muted;
    setSpeech("loading");
    node.play().catch((error: unknown) => {
      // A pause, Stop or a new load during loading interrupts the start; that is not a failure.
      if (run.current !== generation || node !== speechRef.current || interrupted(error)) return;
      fail();
    });
  }, [duckAmbient, fail, muted, spoken]);

  const start = useCallback(() => play(true), [play]);
  const resume = useCallback(() => play(false), [play]);
  const pause = useCallback(() => speechRef.current?.pause(), []);
  const stop = useCallback(() => {
    invalidateSpeech();
    const node = speechRef.current;
    if (node) {
      node.pause();
      // Preserve the verified Stop fix: WebKit can settle an asynchronous seek beyond zero.
      // A later Play reloads the exact selected clip through the existing play() path.
      node.removeAttribute("src");
      node.load();
    }
    if (idleRef.current) idleRef.current.currentTime = 0;
    setCaption("");
    setTime((current) => ({ ...current, current: 0 }));
    setSpeech("none");
    restoreAmbient();
  }, [restoreAmbient, invalidateSpeech]);
  const toggleMute = useCallback(() => {
    const next = !muted;
    if (speechRef.current) speechRef.current.muted = next;
    setMuted(next);
  }, [muted]);

  const currentSpeech = (node: HTMLVideoElement) =>
    node === speechRef.current && speechRun.current?.node === node && speechRun.current.generation === run.current;

  // Only the current requested element may update the UI; queued events of replaced/stopped clips are ignored.
  // Its text track runs in "hidden" mode, so captions follow the clip's own clock.
  const speechEvents = {
    onPlaying: (event: SyntheticEvent<HTMLVideoElement>) => {
      if (currentSpeech(event.currentTarget) && !event.currentTarget.paused) setSpeech("playing");
    },
    onPause: (event: SyntheticEvent<HTMLVideoElement>) => {
      const node = event.currentTarget;
      // Paused while loading (a hidden tab) as well as while playing: the visitor resumes it.
      if (currentSpeech(node) && node.paused && !node.ended) setSpeech((current) => (current === "playing" || current === "loading" ? "paused" : current));
    },
    onEnded: (event: SyntheticEvent<HTMLVideoElement>) => {
      if (!currentSpeech(event.currentTarget) || !event.currentTarget.ended) return;
      speechRun.current = null;
      if (idleRef.current) idleRef.current.currentTime = 0; // the clip ends on the source pose, as the loop starts
      setCaption("");
      setSpeech("complete");
      restoreAmbient();
      settleRef.current?.("ended");
    },
    onError: (event: SyntheticEvent<HTMLVideoElement>) => {
      if (!currentSpeech(event.currentTarget) || !event.currentTarget.getAttribute("src")) return;
      fail();
    },
    onLoadedMetadata: (event: SyntheticEvent<HTMLVideoElement>) => {
      const node = event.currentTarget;
      if (node !== speechRef.current) return;
      // Stop can happen before metadata arrives. Keep the current element's tracks ready for a same-source replay,
      // while only an active request may update time or display cues.
      if (currentSpeech(node)) setTime({ current: node.currentTime, duration: node.duration });
      for (const track of Array.from(node.textTracks)) {
        track.mode = "hidden";
        track.oncuechange = () => {
          if (!currentSpeech(node)) return;
          const cue = track.activeCues?.[0] as VTTCue | undefined;
          setCaption(cue ? cue.text : "");
        };
      }
    },
    onTimeUpdate: (event: SyntheticEvent<HTMLVideoElement>) => {
      const node = event.currentTarget;
      if (currentSpeech(node)) setTime({ current: node.currentTime, duration: node.duration || 0 });
    },
  };
  const idleEvents = {
    onPlaying: (event: SyntheticEvent<HTMLVideoElement>) => {
      if (event.currentTarget === idleRef.current && !idleHeld.current && !event.currentTarget.paused) setIdleOn(true);
    },
    onPause: (event: SyntheticEvent<HTMLVideoElement>) => {
      // Some WebKit builds pause a looping clip at its seam (a pause, then a seek to 0, no ended): a pause this hook did not
      // ask for there simply goes on, without a fade to the still.
      const node = event.currentTarget;
      if (node !== idleRef.current) return;
      if (node && !idleHeld.current && node.getAttribute("src") && (node.ended || node.currentTime < 0.5)) {
        node.play().catch(() => { if (node === idleRef.current) setIdleOn(false); });
        return;
      }
      setIdleOn(false);
    },
    onError: (event: SyntheticEvent<HTMLVideoElement>) => {
      if (event.currentTarget !== idleRef.current || !event.currentTarget.getAttribute("src")) return;
      setIdleOn(false);
      setIdleFailed(true);
    },
  };

  const state: PresenceState =
    speech === "loading" ? "speech-loading"
      : speech === "playing" ? "speech-playing"
        : speech === "paused" ? "speech-paused"
          : speech === "error" ? "media-error"
            : idleOn ? "idle-playing"
              : speech === "complete" ? "speech-complete"
                : idleWanted ? "idle-loading" : "poster";

  return { idleRef, speechRef, state, heard: speech === "complete", caption, time, muted, idle, spoken, captionTrack, start, pause, resume, stop, toggleMute, speechEvents, idleEvents };
}
