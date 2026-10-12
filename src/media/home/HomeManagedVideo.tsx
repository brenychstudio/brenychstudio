import { useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type ReactElement, type Ref } from "react";
import { getHomeActiveThreshold, shouldAttachHomeVideoSource, shouldPlayHomeVideo } from "./homeMediaPolicy";
import { useHomeMediaRuntime, type HomeMediaObservation } from "./useHomeMediaRuntime";

export type HomeManagedVideoStatus = "far" | "warm" | "preparing" | "active" | "paused" | "ended" | "failed" | "blocked" | "reduced";
export type HomeManagedVideoHandle = { play(): void; pause(): void; replay(): void };
export type HomeManagedVideoProps = {
  src: string; poster: string; className?: string; style?: CSSProperties; objectPosition?: string;
  sourceEligible?: boolean; sceneEligible?: boolean; revealEligible?: boolean;
  playbackGroup?: string; playbackId?: string; startTime?: number; loop?: boolean;
  autoplay?: boolean; revealDurationMs?: number;
  onStatusChange?: (status: HomeManagedVideoStatus) => void;
  controlRef?: Ref<HomeManagedVideoHandle>;
};
type Intent = "auto" | "play" | "pause" | "ended" | "blocked";
const createState = () => ({ attached: false, prepared: false, seekNeeded: true, frameReady: false, needsPlayingFrame: true, hasPlayed: false, failed: false, intent: "auto" as Intent });
const INITIAL_OBSERVATION: HomeMediaObservation = { isWarm: false, visibleRatio: 0 };

// Shared Home observation and policy remain authoritative. Optional scene controls
// extend this boundary; ungrouped Products retain their existing defaults.
export default function HomeManagedVideo({ src, poster, className = "", style, objectPosition,
  sourceEligible = true, sceneEligible = true, revealEligible = true, playbackGroup, playbackId = src,
  startTime = 0, loop = true, autoplay = true, revealDurationMs = 150, onStatusChange, controlRef,
}: HomeManagedVideoProps): ReactElement {
  const { mode, pageVisible, observeTarget, claimPlaybackGroup } = useHomeMediaRuntime();
  const targetRef = useRef<HTMLDivElement>(null), videoRef = useRef<HTMLVideoElement>(null);
  const state = useRef(createState());
  const currentPlayAllowed = useRef(false);
  const [observation, setObservation] = useState(INITIAL_OBSERVATION);
  const [revision, setRevision] = useState(0);
  const [view, setView] = useState<{ status: HomeManagedVideoStatus; visible: boolean }>({ status: "far", visible: false });
  const isActive = observation.visibleRatio > 0 && observation.visibleRatio >= getHomeActiveThreshold(typeof window === "undefined" ? 0 : window.innerWidth);
  useImperativeHandle(controlRef, () => ({
    play() { if (state.current.failed) return; state.current.intent = "play"; setRevision(value => value + 1); },
    pause() { state.current.intent = "pause"; currentPlayAllowed.current = false; videoRef.current?.pause(); setRevision(value => value + 1); },
    replay() { if (state.current.failed) return; Object.assign(state.current, { intent: "play", prepared: false, seekNeeded: true, frameReady: false }); setRevision(value => value + 1); },
  }), []);
  useEffect(() => { onStatusChange?.(view.status); }, [view.status, onStatusChange]);
  useEffect(() => { const node = targetRef.current; if (node) return observeTarget(node, setObservation); }, [observeTarget]);
  // Only source replacement/unmount releases the decoder. Inactivity retains source/time.
  useEffect(() => {
    const video = videoRef.current;
    state.current = createState();
    return () => { currentPlayAllowed.current = false; if (video) { video.pause(); video.removeAttribute("src"); video.load(); } };
  }, [src]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const media = state.current;
    let cancelled = false, pendingPlay = false, playingConfirmed = false, frame: number | undefined, release: (() => void) | undefined;
    const explicitOnly = !autoplay || Boolean(playbackGroup && mode !== "normal");
    const eligible = shouldPlayHomeVideo({ mode, isActive, pageVisible, failed: media.failed }) && sceneEligible && sourceEligible;
    if (!eligible && explicitOnly && media.intent === "play") media.intent = "pause";
    const wantsPlay = eligible && (media.intent === "play" || (media.intent === "auto" && !explicitOnly));
    if (playbackGroup && !eligible) media.needsPlayingFrame = true;
    if (wantsPlay && media.needsPlayingFrame) { media.frameReady = false; media.needsPlayingFrame = false; }
    currentPlayAllowed.current = wantsPlay;
    const canPlay = () => !cancelled && wantsPlay && currentPlayAllowed.current && !media.failed && (media.intent === "auto" || media.intent === "play");
    const mayAttach = mode !== "reducedMotion" && sourceEligible && (explicitOnly
      ? isActive && media.intent === "play" && pageVisible
      : shouldAttachHomeVideoSource({ mode, isWarm: observation.isWarm, isActive, wasAttached: media.attached }));
    const publish = (status: HomeManagedVideoStatus) => {
      if (cancelled) return;
      const visible = media.frameReady && !media.failed && mode !== "reducedMotion" && revealEligible &&
        (!playbackGroup || (eligible && (canPlay() || media.intent === "pause" || media.intent === "ended")));
      setView(previous => previous.status === status && previous.visible === visible ? previous : { status, visible });
    };
    const pause = () => { video.pause(); release?.(); release = undefined; };
    const blocked = () => {
      if (cancelled) return;
      currentPlayAllowed.current = false; pause();
      // Products historically retry only when eligibility changes. The gesture-only
      // blocked state belongs to controlled scenes, whose sibling control can retry.
      if (playbackGroup) { media.intent = "blocked"; media.frameReady = false; publish("blocked"); }
      else publish("active");
    };
    const fail = () => { if (cancelled) return; media.failed = true; media.frameReady = false; currentPlayAllowed.current = false; pause(); publish("failed"); };
    const decoded = (mediaTime: number) => {
      if (!canPlay() || !playingConfirmed || !media.prepared || video.seeking || video.paused || mediaTime + .01 < startTime) return;
      media.frameReady = true; publish("active");
    };
    const confirmFrame = () => {
      if (!canPlay() || !playingConfirmed || video.paused || !media.prepared) return;
      media.hasPlayed = true;
      if (typeof video.requestVideoFrameCallback === "function") {
        if (frame !== undefined) video.cancelVideoFrameCallback(frame);
        frame = video.requestVideoFrameCallback((_time, metadata) => { frame = undefined; decoded(metadata.mediaTime); });
      } else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) decoded(video.currentTime);
      publish("active");
    };
    const handlePlaying = () => { if (canPlay()) { playingConfirmed = true; confirmFrame(); } };
    const play = () => {
      if (!canPlay() || !media.prepared || pendingPlay) return;
      if (playbackGroup) release = claimPlaybackGroup(playbackGroup, playbackId, () => {
        media.intent = "pause"; currentPlayAllowed.current = false; pause(); publish("paused");
      });
      pendingPlay = true; video.muted = true;
      video.play().then(() => {
        if (cancelled) { if (!currentPlayAllowed.current) video.pause(); return; }
        if (!canPlay()) { pause(); return; }
        handlePlaying();
      }).catch(() => { if (!cancelled) blocked(); });
    };
    const prepare = () => {
      if (cancelled || video.readyState < HTMLMediaElement.HAVE_METADATA || media.failed) return;
      if (media.seekNeeded) {
        media.seekNeeded = false;
        if (startTime > 0 || video.currentTime !== 0) { video.currentTime = startTime; return; }
      }
      if (video.seeking) return;
      media.prepared = true; play();
      if (!canPlay()) publish(mode === "reducedMotion" ? "reduced" : media.intent === "ended" ? "ended" : media.intent === "blocked" ? "blocked" : media.hasPlayed || media.intent === "pause" ? "paused" : "warm");
    };
    const ended = () => { if (cancelled) return; media.intent = "ended"; currentPlayAllowed.current = false; release?.(); release = undefined; publish("ended"); };
    video.addEventListener("loadedmetadata", prepare); video.addEventListener("seeked", prepare);
    video.addEventListener("playing", handlePlaying); video.addEventListener("loadeddata", confirmFrame);
    video.addEventListener("error", fail); video.addEventListener("ended", ended);
    if (mayAttach && !media.attached) { media.attached = true; video.preload = "metadata"; video.src = src; video.load(); }
    if (mode === "reducedMotion") publish("reduced");
    else if (media.failed) publish("failed");
    else if (media.intent === "blocked") publish("blocked");
    else if (media.intent === "ended") publish("ended");
    else if (!media.attached) publish("far");
    else if (wantsPlay) { publish("preparing"); prepare(); }
    else { pause(); publish(media.hasPlayed || media.intent === "pause" ? "paused" : "warm"); prepare(); }
    return () => {
      cancelled = true; currentPlayAllowed.current = false;
      if (frame !== undefined) video.cancelVideoFrameCallback(frame);
      pause();
      video.removeEventListener("loadedmetadata", prepare); video.removeEventListener("seeked", prepare);
      video.removeEventListener("playing", handlePlaying); video.removeEventListener("loadeddata", confirmFrame);
      video.removeEventListener("error", fail); video.removeEventListener("ended", ended);
    };
  }, [src, sourceEligible, sceneEligible, revealEligible, playbackGroup, playbackId, startTime, autoplay, mode, pageVisible, isActive, observation.isWarm, revision, claimPlaybackGroup]);
  const resolvedStyle = objectPosition !== undefined ? { ...style, objectPosition } : style;
  return <div ref={targetRef} className="relative h-full w-full" data-home-managed-video="true" data-home-media-source={src} data-home-media-phase={view.status} data-home-media-decoded={view.visible}>
    <div className="absolute inset-0"><video ref={videoRef} className={className} muted loop={loop} playsInline preload="none" style={resolvedStyle} aria-hidden="true" /></div>
    <div className="pointer-events-none absolute inset-0 transition-opacity ease-out motion-reduce:transition-none" style={{ opacity: view.visible ? 0 : 1, transitionDuration: `${revealDurationMs}ms` }}>
      <img src={poster} alt="" aria-hidden="true" className={className} style={resolvedStyle} />
    </div>
  </div>;
}
