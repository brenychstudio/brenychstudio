import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { resolveVideoAsset } from "../../media/video/videoResolver";
import type { VideoAssetId } from "../../media/video/videoAssets";
import PortfolioImage from "../media/PortfolioImage";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";

type Candidate = { video: HTMLVideoElement; ratio: number; enabled: boolean; failed: () => void };
type MediaRuntime = { register: (candidate: Candidate) => () => void; update: (video: HTMLVideoElement, state: Partial<Pick<Candidate, "ratio" | "enabled">>) => void };
const MediaContext = createContext<MediaRuntime | null>(null);

/** Route-scoped arbitration: pause the previous surface before starting the next one. */
export function ProductMediaProvider({ children }: { children: ReactNode }) {
  const candidates = useRef(new Map<HTMLVideoElement, Candidate>());
  const runtime = useMemo(() => {
    let active: HTMLVideoElement | null = null;
    const reconcile = () => {
      const eligible = document.visibilityState === "visible"
        ? [...candidates.current.values()].filter(item => item.enabled && item.ratio >= .45).sort((a, b) => b.ratio - a.ratio)
        : [];
      const next = eligible[0]?.video ?? null;
      candidates.current.forEach(item => { if (item.video !== next) item.video.pause(); });
      if (next === active) return;
      active = next;
      if (!next) return;
      next.muted = true;
      const candidate = candidates.current.get(next);
      next.play().then(() => {
        // A late play promise can start a detached or superseded element after cleanup paused it.
        if (active !== next || !candidates.current.has(next) || !candidate?.enabled || document.visibilityState !== "visible") next.pause();
      }).catch(error => {
        // Visibility changes can abort a pending play. Real rejection stays poster-safe.
        if (active !== next || (error instanceof DOMException && error.name === "AbortError")) return;
        active = null;
        if (candidate) { candidate.enabled = false; candidate.failed(); }
      });
    };
    return {
      reconcile,
      register(candidate: Candidate) {
        candidates.current.set(candidate.video, candidate);
        reconcile();
        return () => { candidate.video.pause(); candidates.current.delete(candidate.video); reconcile(); };
      },
      update(video: HTMLVideoElement, state: Partial<Pick<Candidate, "ratio" | "enabled">>) {
        const candidate = candidates.current.get(video);
        if (candidate) { Object.assign(candidate, state); reconcile(); }
      },
    };
  }, []);
  useEffect(() => {
    document.addEventListener("visibilitychange", runtime.reconcile);
    return () => document.removeEventListener("visibilitychange", runtime.reconcile);
  }, [runtime]);
  return <MediaContext.Provider value={runtime}>{children}</MediaContext.Provider>;
}

export default function ProductManagedVideo({ asset, poster, alt, locale }: {
  asset: VideoAssetId;
  poster: string;
  alt: string;
  locale: "en" | "es";
}) {
  const runtime = useContext(MediaContext);
  const { reducedMotion: reduceMotion } = useMobileMotion({ enabled: false });
  const targetRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRequest = useRef<number | null>(null);
  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [playing, setPlaying] = useState(false);
  const attached = near && !reduceMotion && !failed;
  const showVideo = frameReady && !failed && !reduceMotion;

  useEffect(() => {
    const target = targetRef.current;
    const video = videoRef.current;
    if (!target || !video || !runtime) return;
    const unregister = runtime.register({ video, ratio: 0, enabled: false, failed: () => setFailed(true) });
    const warmObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNear(true); warmObserver.disconnect(); }
    }, { rootMargin: "800px 0px" });
    const activeObserver = new IntersectionObserver(entries => {
      runtime.update(video, { ratio: entries[0]?.intersectionRatio ?? 0 });
    }, { threshold: [0, .1, .25, .45, .6, .75, .9, 1], rootMargin: "-64px 0px 0px" });
    warmObserver.observe(target);
    activeObserver.observe(target);
    return () => {
      warmObserver.disconnect(); activeObserver.disconnect(); unregister();
      if (frameRequest.current !== null) video.cancelVideoFrameCallback?.(frameRequest.current);
    };
  }, [runtime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !runtime) return;
    runtime.update(video, { enabled: attached && !pausedByUser });
    if (!attached) video.load();
  }, [attached, pausedByUser, runtime]);

  const confirmFrame = () => {
    const video = videoRef.current;
    if (!video || video.paused || frameReady) return;
    if (typeof video.requestVideoFrameCallback === "function") {
      if (frameRequest.current !== null) return;
      frameRequest.current = video.requestVideoFrameCallback(() => { frameRequest.current = null; setFrameReady(true); });
    } else if (video.readyState >= 2 && video.currentTime > 0) setFrameReady(true);
  };
  const labels = locale === "es"
    ? { play: "Activar movimiento", pause: "Pausar movimiento", proof: "Recorrido real", still: "Vista del producto", moving: "En movimiento" }
    : { play: "Play motion", pause: "Pause motion", proof: "Actual walkthrough", still: "Product view", moving: "In motion" };

  return (
    <div ref={targetRef} className="product-managed-video" data-product-video={asset}
      data-video-attached={attached} data-video-frame={showVideo} data-video-failed={failed} data-video-playing={playing}>
      <div className="product-managed-video-picture">
        <video ref={videoRef} src={attached ? resolveVideoAsset(asset) : undefined} muted loop playsInline preload={attached ? "metadata" : "none"}
          aria-label={`${labels.proof}: ${alt}`} tabIndex={-1}
          onPlaying={() => { setPlaying(true); confirmFrame(); }} onTimeUpdate={confirmFrame}
          onEmptied={() => {
            setFrameReady(false); setPlaying(false);
            if (frameRequest.current !== null) videoRef.current?.cancelVideoFrameCallback?.(frameRequest.current);
            frameRequest.current = null;
          }}
          onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
        <div className="product-managed-video-poster" data-video-poster style={{ opacity: showVideo ? 0 : 1 }}>
          <PortfolioImage src={poster} alt={alt} sizes="(min-width: 1920px) 1360px, (min-width: 1280px) 80vw, 94vw"
            containerClassName="product-system-poster-image" imageClassName="product-system-poster-bitmap" />
        </div>
      </div>
      <div className="product-managed-video-caption">
        <span><i data-moving={playing} />{playing ? labels.moving : labels.still}</span>
        {!reduceMotion && !failed ? <button type="button" onClick={() => setPausedByUser(value => !value)} aria-pressed={pausedByUser}>
          <span aria-hidden="true">{pausedByUser ? "▶" : "Ⅱ"}</span>{pausedByUser ? labels.play : labels.pause}
        </button> : <span>{labels.still}</span>}
      </div>
    </div>
  );
}
