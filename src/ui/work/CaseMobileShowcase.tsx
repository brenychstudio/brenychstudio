import { useEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseFrame } from "../../data/cases";
import type { CaseCoverTone } from "./caseCover.types";

type CaseMobileShowcaseProps = {
  frames: CaseFrame[];
  onOpenFrame?: (src: string) => void;
  eyebrow?: string;
  description?: string;
  tone?: CaseCoverTone;
};

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

const showcaseEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const showcaseTransition = {
  duration: 0.42,
  ease: showcaseEase,
};

const mobileShowcaseToneMap: Record<
  CaseCoverTone,
  {
    stage: string;
    activeShell: string;
    ghostShell: string;
    mobileShell: string;
  }
> = {
  light: {
    stage: "border-neutral-100 bg-[#f6f3ec]/55",
    activeShell:
      "rounded-[28px] border border-black/[0.045] bg-[#f8f5ef]/88 shadow-[0_26px_76px_rgba(15,23,42,0.06)]",
    ghostShell:
      "rounded-[24px] border border-black/[0.04] bg-[#f8f5ef]/66 shadow-[0_18px_52px_rgba(15,23,42,0.045)]",
    mobileShell:
      "rounded-[24px] border border-black/[0.045] bg-[#f8f5ef]/90 shadow-[0_24px_80px_rgba(15,23,42,0.055)] sm:rounded-[28px]",
  },
  dark: {
    stage: "border-neutral-100 bg-neutral-50/40",
    activeShell:
      "rounded-[28px] border border-black/[0.04] bg-white shadow-[0_24px_72px_rgba(15,23,42,0.05)]",
    ghostShell:
      "rounded-[24px] border border-black/[0.04] bg-white/78 shadow-[0_16px_46px_rgba(15,23,42,0.04)]",
    mobileShell:
      "rounded-[24px] border border-black/[0.04] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:rounded-[28px]",
  },
  mixed: {
    stage: "border-neutral-100 bg-[#f5f4f1]/46",
    activeShell:
      "rounded-[28px] border border-black/[0.042] bg-[#f7f5f1]/90 shadow-[0_25px_74px_rgba(15,23,42,0.055)]",
    ghostShell:
      "rounded-[24px] border border-black/[0.04] bg-[#f7f5f1]/70 shadow-[0_17px_48px_rgba(15,23,42,0.042)]",
    mobileShell:
      "rounded-[24px] border border-black/[0.042] bg-[#f7f5f1]/92 shadow-[0_24px_80px_rgba(15,23,42,0.052)] sm:rounded-[28px]",
  },
};

export default function CaseMobileShowcase({
  frames,
  onOpenFrame,
  eyebrow = "Mobile showcase",
  description = "Guided handheld sequence across bilingual entry, district-aware discovery, and shortlist actions.",
  tone = "mixed",
}: CaseMobileShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const toneStyles = mobileShowcaseToneMap[tone];

  useEffect(() => {
    frames.forEach((frame) => {
      const img = new window.Image();
      img.src = frame.src;
    });
  }, [frames]);

  useEffect(() => {
    if (!frames.length) return;
    if (activeIndex > frames.length - 1) setActiveIndex(0);
  }, [activeIndex, frames.length]);

  if (!frames.length) return null;

  const total = frames.length;
  const safeActiveIndex = activeIndex % total;
  const activeFrame = frames[safeActiveIndex] ?? frames[0];
  const prevIndex = (safeActiveIndex - 1 + total) % total;
  const nextIndex = (safeActiveIndex + 1) % total;
  const prevFrame = frames[prevIndex] ?? activeFrame;
  const nextFrame = frames[nextIndex] ?? activeFrame;

  const goPrev = () => setActiveIndex(prevIndex);
  const goNext = () => setActiveIndex(nextIndex);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 42) return;
    if (Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;

    if (deltaX < 0) goNext();
    else goPrev();
  };

  return (
    <section className="grid gap-8 overflow-hidden md:gap-16">
      <div className="max-w-[760px] px-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">
          {eyebrow}
        </div>
        <div className="mt-2.5 text-[14px] leading-[1.75] text-neutral-700 md:text-[15px]">
          {description}
        </div>
      </div>

      <div
        className={[
          "overflow-hidden rounded-[26px] border p-4 md:rounded-[28px] md:p-7",
          toneStyles.stage,
        ].join(" ")}
      >
        <div className="hidden gap-6 md:grid md:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)_minmax(0,0.82fr)] md:items-end">
          <button
            type="button"
            onClick={goPrev}
            className="group block min-w-0"
            aria-label={`Set active mobile frame ${formatIndex(prevIndex + 1)}`}
          >
            <div className="mx-auto flex h-[456px] w-full items-end justify-center">
              <div className="relative h-[396px] w-full opacity-70 transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-90">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={[
                      "inline-flex h-full w-auto max-w-full overflow-hidden",
                      toneStyles.ghostShell,
                    ].join(" ")}
                  >
                    <img
                      src={prevFrame.src}
                      alt={prevFrame.alt ?? ""}
                      className="block h-full w-auto max-w-full object-contain object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenFrame?.(activeFrame.src)}
            className="group block min-w-0"
            aria-label={`Open active mobile frame ${formatIndex(safeActiveIndex + 1)}`}
          >
            <div className="mx-auto flex h-[456px] w-full items-center justify-center">
              <div className="relative h-full w-full transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={activeFrame.src}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.988, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.992, y: -2 }}
                    transition={showcaseTransition}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={[
                          "inline-flex h-full w-auto max-w-full overflow-hidden",
                          toneStyles.activeShell,
                        ].join(" ")}
                      >
                        <img
                          src={activeFrame.src}
                          alt={activeFrame.alt ?? ""}
                          className="block h-full w-auto max-w-full object-contain object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={goNext}
            className="group block min-w-0"
            aria-label={`Set active mobile frame ${formatIndex(nextIndex + 1)}`}
          >
            <div className="mx-auto flex h-[456px] w-full items-end justify-center">
              <div className="relative h-[396px] w-full opacity-70 transition duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-90">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={[
                      "inline-flex h-full w-auto max-w-full overflow-hidden",
                      toneStyles.ghostShell,
                    ].join(" ")}
                  >
                    <img
                      src={nextFrame.src}
                      alt={nextFrame.alt ?? ""}
                      className="block h-full w-auto max-w-full object-contain object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div
          className="md:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative mx-auto flex h-[118vw] min-h-[410px] max-h-[535px] w-full items-center justify-center overflow-hidden">
            <button
              type="button"
              onClick={() => onOpenFrame?.(activeFrame.src)}
              className="relative z-10 flex h-full max-w-full items-center justify-center bg-transparent"
              aria-label={`Open active mobile frame ${formatIndex(safeActiveIndex + 1)}`}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeFrame.src}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.985, x: 12 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.99, x: -10 }}
                  transition={showcaseTransition}
                >
                  <img
                    src={activeFrame.src}
                    alt={activeFrame.alt ?? ""}
                    className={[
                      "block max-h-full max-w-full object-contain object-center",
                      toneStyles.mobileShell,
                    ].join(" ")}
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

          {total > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500"
                aria-label="Previous mobile frame"
              >
                Prev
              </button>

              <div className="flex items-center gap-2 px-1">
                {frames.map((frame, index) => (
                  <button
                    key={`${frame.src}-mobile-dot-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "h-1.5 rounded-full transition duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      index === safeActiveIndex
                        ? "w-5 bg-neutral-500"
                        : "w-2 bg-neutral-300",
                    ].join(" ")}
                    aria-label={`Go to mobile frame ${formatIndex(index + 1)}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500"
                aria-label="Next mobile frame"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid max-w-[820px] gap-3 text-neutral-500">
          <div className="h-px w-12 bg-neutral-200" />

          <div className="flex min-h-[22px] items-center justify-between gap-6">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={`mobile-label-${safeActiveIndex}`}
                className="text-[10px] uppercase tracking-[0.22em] text-neutral-400"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={showcaseTransition}
              >
                Mobile frame {formatIndex(safeActiveIndex + 1)} / {formatIndex(total)}
              </motion.div>
            </AnimatePresence>

            <div className="hidden shrink-0 items-center gap-2 md:flex">
              {frames.map((frame, index) => (
                <button
                  key={`${frame.src}-dot-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "h-1.5 rounded-full transition duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    index === safeActiveIndex
                      ? "w-5 bg-neutral-500"
                      : "w-2 bg-neutral-300 hover:bg-neutral-400",
                  ].join(" ")}
                  aria-label={`Go to mobile frame ${formatIndex(index + 1)}`}
                />
              ))}
            </div>
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
                  <div className="text-[14px] leading-[1.75] text-neutral-700 md:text-[15px]">
                    {activeFrame.caption}
                  </div>
                ) : (
                  <div className="text-[14px] leading-[1.75] text-neutral-700 opacity-0 md:text-[15px]">
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
              className="text-[11px] uppercase tracking-[0.2em] text-neutral-600 transition hover:text-neutral-900"
            >
              Open frame <span className="text-neutral-400">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
