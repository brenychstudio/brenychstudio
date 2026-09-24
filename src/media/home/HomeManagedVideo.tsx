import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";

import {
  getHomeActiveThreshold,
  shouldAttachHomeVideoSource,
  shouldPlayHomeVideo,
} from "./homeMediaPolicy";
import { useHomeMediaRuntime, type HomeMediaObservation } from "./useHomeMediaRuntime";

export type HomeManagedVideoProps = {
  src: string;
  poster: string;
  className?: string;
  style?: CSSProperties;
  objectPosition?: string;
};

const INITIAL_OBSERVATION: HomeMediaObservation = { isWarm: false, visibleRatio: 0 };

// Poster-first Home video. The poster sits above the video and only fades out once a decoded
// frame is confirmed, so authored opacity/filter classes stay on the media elements themselves.
export default function HomeManagedVideo({
  src,
  poster,
  className = "",
  style,
  objectPosition,
}: HomeManagedVideoProps): ReactElement {
  const { mode, pageVisible, observeTarget } = useHomeMediaRuntime();
  const targetRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [observation, setObservation] = useState(INITIAL_OBSERVATION);
  const [attached, setAttached] = useState(false);
  const [failed, setFailed] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const viewportWidth = typeof window === "undefined" ? 0 : window.innerWidth;
  const isActive =
    observation.visibleRatio > 0 && observation.visibleRatio >= getHomeActiveThreshold(viewportWidth);
  const sourceAttached = shouldAttachHomeVideoSource({
    mode,
    isWarm: observation.isWarm,
    isActive,
    wasAttached: attached,
  });
  // Once attached, the source stays attached for this mount.
  if (sourceAttached && !attached) setAttached(true);

  const shouldPlay = sourceAttached && shouldPlayHomeVideo({ mode, isActive, pageVisible, failed });
  const videoVisible = frameReady && !failed && mode !== "reducedMotion";
  const phase = failed
    ? "failed"
    : mode === "reducedMotion"
      ? "reduced"
      : !sourceAttached
        ? "far"
        : shouldPlay
          ? "active"
          : hasPlayed
            ? "paused"
            : "warm";

  const resolvedStyle = objectPosition !== undefined ? { ...style, objectPosition } : style;

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    return observeTarget(element, setObservation);
  }, [observeTarget]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!shouldPlay) {
      video.pause();
      return;
    }

    video.muted = true;
    // A rejected play() (autoplay policy, aborted load) keeps the poster-safe state; no retry loop.
    video.play().catch(() => {});
  }, [shouldPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlay || frameReady || typeof video.requestVideoFrameCallback !== "function") return;

    const handle = video.requestVideoFrameCallback(() => setFrameReady(true));

    return () => video.cancelVideoFrameCallback(handle);
  }, [shouldPlay, frameReady]);

  const markFrameReadyWithoutFrameCallback = () => {
    const video = videoRef.current;
    if (!video || typeof video.requestVideoFrameCallback === "function") return;
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setFrameReady(true);
  };

  return (
    <div
      ref={targetRef}
      className="relative h-full w-full"
      data-home-managed-video="true"
      data-home-media-source={src}
      data-home-media-phase={phase}
    >
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className={className}
          src={sourceAttached ? src : undefined}
          muted
          loop
          playsInline
          preload={sourceAttached ? "metadata" : "none"}
          style={resolvedStyle}
          onLoadedData={markFrameReadyWithoutFrameCallback}
          onCanPlay={markFrameReadyWithoutFrameCallback}
          onPlaying={() => setHasPlayed(true)}
          onError={() => setFailed(true)}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-150 ease-out motion-reduce:transition-none"
        style={{ opacity: videoVisible ? 0 : 1 }}
      >
        <img src={poster} alt="" aria-hidden="true" className={className} style={resolvedStyle} />
      </div>
    </div>
  );
}
