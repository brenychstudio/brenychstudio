import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseFrame } from "../../data/cases";

type CaseMobileShowcaseProps = {
  frames: CaseFrame[];
  onOpenFrame?: (src: string) => void;
};

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

const showcaseEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const showcaseTransition = {
  duration: 0.58,
  ease: showcaseEase,
};

export default function CaseMobileShowcase({
  frames,
  onOpenFrame,
}: CaseMobileShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const node = rootRef.current;
    if (!node || frames.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.4);
      },
      { threshold: [0.2, 0.4, 0.65] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [frames.length]);

  useEffect(() => {
    if (!inView || isHovered || frames.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % frames.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [inView, isHovered, frames.length]);

  useEffect(() => {
    frames.forEach((frame) => {
      const img = new window.Image();
      img.src = frame.src;
    });
  }, [frames]);

  if (!frames.length) return null;

  const total = frames.length;
  const safeActiveIndex = total ? activeIndex % total : 0;
  const activeFrame = frames[safeActiveIndex] ?? frames[0];
  const prevIndex = (safeActiveIndex - 1 + total) % total;
  const nextIndex = (safeActiveIndex + 1) % total;
  const prevFrame = frames[prevIndex] ?? activeFrame;
  const nextFrame = frames[nextIndex] ?? activeFrame;

  return (
    <section
      ref={rootRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="grid gap-12 md:gap-16"
    >
      <div className="max-w-[760px]">
        <div className="text-[10px] tracking-[0.22em] uppercase text-neutral-400">
          Mobile showcase
        </div>
        <div className="mt-2.5 text-[15px] leading-[1.75] text-neutral-700">
          Guided handheld sequence across bilingual entry, district-aware discovery, and shortlist actions.
        </div>
      </div>

      <div className="rounded-[28px] border border-neutral-100 bg-neutral-50/40 p-4 md:p-7">
        <div className="hidden md:grid md:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)_minmax(0,0.82fr)] md:items-end gap-6">
          <button
            type="button"
            onClick={() => setActiveIndex(prevIndex)}
            className="group block"
            aria-label={`Set active mobile frame ${formatIndex(prevIndex + 1)}`}
          >
            <div className="mx-auto flex h-[456px] w-[220px] items-end">
              <div className="relative h-[396px] w-full overflow-hidden rounded-[28px] border border-neutral-100 bg-white/70 opacity-70 transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-90">
                <img
                  src={prevFrame.src}
                  alt={prevFrame.alt ?? ""}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenFrame?.(activeFrame.src)}
            className="group block"
            aria-label={`Open active mobile frame ${formatIndex(activeIndex + 1)}`}
          >
            <div className="mx-auto h-[456px] w-[270px]">
              <div className="relative h-full w-full overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-[0_20px_48px_rgba(0,0,0,0.08)] transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-neutral-300">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={activeFrame.src}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.988, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.992, y: -2 }}
                    transition={showcaseTransition}
                  >
                    <img
                      src={activeFrame.src}
                      alt={activeFrame.alt ?? ""}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveIndex(nextIndex)}
            className="group block"
            aria-label={`Set active mobile frame ${formatIndex(nextIndex + 1)}`}
          >
            <div className="mx-auto flex h-[456px] w-[220px] items-end">
              <div className="relative h-[396px] w-full overflow-hidden rounded-[28px] border border-neutral-100 bg-white/70 opacity-70 transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-90">
                <img
                  src={nextFrame.src}
                  alt={nextFrame.alt ?? ""}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </button>
        </div>

        <div className="md:hidden overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-max">
            {frames.map((frame, index) => {
              const active = index === safeActiveIndex;
              return (
                <button
                  key={`${frame.src}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="w-[216px] shrink-0"
                  aria-label={`Set active mobile frame ${formatIndex(index + 1)}`}
                >
                  <div
                    className={[
                      "rounded-[26px] border overflow-hidden transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active
                        ? "border-neutral-300 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
                        : "border-neutral-100 bg-white/70",
                    ].join(" ")}
                  >
                    <img src={frame.src} alt={frame.alt ?? ""} className="block h-auto w-full" loading="lazy" decoding="async" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 max-w-[820px] grid gap-3 text-neutral-500">
          <div className="h-px w-12 bg-neutral-200" />

          <div className="flex items-center justify-between gap-6 min-h-[22px]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={`mobile-label-${activeIndex}`}
                className="text-[10px] uppercase tracking-[0.22em] text-neutral-400"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={showcaseTransition}
              >
                Mobile frame {formatIndex(activeIndex + 1)} / {formatIndex(total)}
              </motion.div>
            </AnimatePresence>

            {total > 1 ? (
              <div className="flex items-center gap-2 shrink-0">
                {frames.map((frame, index) => (
                  <button
                    key={`${frame.src}-dot-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "h-1.5 rounded-full transition duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      index === safeActiveIndex
                        ? "w-5 bg-neutral-500"
                        : "w-2 bg-neutral-300 hover:bg-neutral-400",
                    ].join(" ")}
                    aria-label={`Go to mobile frame ${formatIndex(index + 1)}`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="min-h-[56px]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={`mobile-caption-${activeFrame.src}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={showcaseTransition}
                className="grid gap-3"
              >
                {activeFrame.caption ? (
                  <div className="text-[15px] leading-[1.75] text-neutral-700">
                    {activeFrame.caption}
                  </div>
                ) : (
                  <div className="text-[15px] leading-[1.75] text-neutral-700 opacity-0">
                    Placeholder caption height lock.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <button
              type="button"
              onClick={() => onOpenFrame?.(activeFrame.src)}
              className="text-[11px] tracking-[0.2em] uppercase text-neutral-600 hover:text-neutral-900 transition"
            >
              Open frame <span className="text-neutral-400">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
