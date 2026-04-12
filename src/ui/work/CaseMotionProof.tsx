import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CaseMotionProofProps = {
  src: string;
  poster?: string;
  alt?: string;
  label?: string;
  caption?: string;
  autoplayInView?: boolean;
};

export default function CaseMotionProof({
  src,
  poster,
  alt = "",
  label = "Motion proof",
  caption,
  autoplayInView = false,
}: CaseMotionProofProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!autoplayInView) return;
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0.2, 0.45, 0.7] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [autoplayInView]);

  useEffect(() => {
    if (!autoplayInView) return;
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Keep playback graceful when browser autoplay policies block it.
        });
      }
      return;
    }

    video.pause();
  }, [autoplayInView, inView]);

  const shouldShowPosterShell = !autoplayInView && !isPlaying;

  return (
    <figure className="w-full">
      <motion.div
        ref={rootRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="overflow-hidden rounded-[30px] border border-neutral-100 bg-white shadow-[0_14px_32px_rgba(17,17,17,0.03)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neutral-200 hover:shadow-[0_18px_36px_rgba(17,17,17,0.05)]"
      >
        <motion.div
          animate={{ y: hovered ? -3 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {shouldShowPosterShell ? (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="group relative block w-full text-left"
              aria-label="Play motion proof"
            >
              {poster ? (
                <img src={poster} alt={alt} className="block h-auto w-full" loading="lazy" decoding="async" />
              ) : (
                <div className="aspect-[16/9] w-full bg-neutral-100" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent" />

              <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/74 backdrop-blur-md">
                {label}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex items-center rounded-full border border-white/70 bg-black/35 px-5 py-2 text-[11px] tracking-[0.2em] uppercase text-white transition group-hover:bg-black/50">
                  Play video
                </span>
              </div>
            </button>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="block h-auto w-full bg-black"
                playsInline
                preload="metadata"
                controls={autoplayInView ? isFocused : true}
                autoPlay={autoplayInView ? false : true}
                muted
              />

              {autoplayInView ? (
                <>
                  <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/74 backdrop-blur-md">
                    {label}
                  </div>

                  <div className="absolute right-4 top-4">
                    <button
                      type="button"
                      onClick={() => setIsFocused((prev) => !prev)}
                      className="inline-flex items-center rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/74 backdrop-blur-md transition hover:bg-white/16"
                    >
                      {isFocused ? "Hide controls" : "Focus playback"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </motion.div>
      </motion.div>

      {caption ? (
        <motion.figcaption
          className="mt-3 max-w-[58ch] grid gap-3 text-neutral-500"
          animate={{ y: hovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="h-px w-12 bg-neutral-200" />
          <div className="text-[10px] uppercase tracking-[0.24em] text-neutral-400">{label}</div>
          <div className="mt-2 text-[14px] leading-6 text-neutral-700 md:text-[15px]">{caption}</div>
        </motion.figcaption>
      ) : null}
    </figure>
  );
}
