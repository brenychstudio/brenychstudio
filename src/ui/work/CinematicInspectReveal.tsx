import { useCallback, useEffect, useRef, useState, type TouchEvent, type WheelEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { CaseStoryMedia } from "../../data/caseStories";
import { useSound } from "../../stage/audio/useSound";

type CinematicInspectRevealProps = {
  frames: CaseStoryMedia[];
  index: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
};

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const closeRevealMs = 760;
const wheelFrameThreshold = 48;
const wheelFrameCooldownMs = 620;
const wheelIntentResetMs = 180;

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

function getRoleLabel(role: CaseStoryMedia["role"]) {
  if (role === "hero") return "threshold";
  if (role === "detail") return "detail";
  if (role === "mobile") return "mobile surface";
  if (role === "flow") return "inquiry flow";
  return "proof";
}

export default function CinematicInspectReveal({
  frames,
  index,
  onClose,
  onSelect,
}: CinematicInspectRevealProps) {
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef(0);
  const wheelLockUntilRef = useRef(0);
  const wheelResetTimerRef = useRef<number | null>(null);
  const thumbnailRailRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [closing, setClosing] = useState(false);
  const [frameDirection, setFrameDirection] = useState<1 | -1>(1);
  const currentFrame = index !== null ? frames[index] ?? null : null;
  const previousFrame = index !== null && frames.length > 1
    ? frames[(index - 1 + frames.length) % frames.length]
    : null;
  const nextFrame = index !== null && frames.length > 1
    ? frames[(index + 1) % frames.length]
    : null;

  const goTo = useCallback((nextIndex: number, direction: 1 | -1 = 1) => {
    if (closing) return;
    if (!frames.length) return;
    const normalizedIndex = (nextIndex + frames.length) % frames.length;
    setFrameDirection(direction);
    sound.playRole("transition");
    onSelect(normalizedIndex);
  }, [closing, frames.length, onSelect, sound]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    goTo(index - 1, -1);
  }, [goTo, index]);

  const goNext = useCallback(() => {
    if (index === null) return;
    goTo(index + 1, 1);
  }, [goTo, index]);

  const close = useCallback(() => {
    if (closing) return;
    sound.playRole("close");
    setClosing(true);

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setClosing(false);
      onClose();
    }, closeRevealMs);
  }, [closing, onClose, sound]);

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

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    if (event.ctrlKey) return;
    if (closing || index === null || frames.length < 2) return;

    const dominantDelta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    if (Math.abs(dominantDelta) < 1) return;

    event.preventDefault();
    event.stopPropagation();

    const now = window.performance.now();
    if (now < wheelLockUntilRef.current) return;

    wheelDeltaRef.current += dominantDelta;

    if (wheelResetTimerRef.current !== null) {
      window.clearTimeout(wheelResetTimerRef.current);
    }

    wheelResetTimerRef.current = window.setTimeout(() => {
      wheelDeltaRef.current = 0;
      wheelResetTimerRef.current = null;
    }, wheelIntentResetMs);

    const threshold = event.deltaMode === 1 ? 5 : wheelFrameThreshold;
    if (Math.abs(wheelDeltaRef.current) < threshold) return;

    const direction = wheelDeltaRef.current > 0 ? 1 : -1;
    wheelDeltaRef.current = 0;
    wheelLockUntilRef.current = now + wheelFrameCooldownMs;

    if (direction > 0) goNext();
    else goPrev();
  }, [closing, frames.length, goNext, goPrev, index]);

  useEffect(() => {
    if (index === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, frames.length, goNext, goPrev, index]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (wheelResetTimerRef.current !== null) window.clearTimeout(wheelResetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    thumbnailButtonRefs.current = thumbnailButtonRefs.current.slice(0, frames.length);
  }, [frames.length]);

  useEffect(() => {
    if (index === null) return;

    const rail = thumbnailRailRef.current;
    const activeThumb = thumbnailButtonRefs.current[index];
    if (!rail || !activeThumb) return;

    const animationFrame = window.requestAnimationFrame(() => {
      const nextLeft = activeThumb.offsetLeft - rail.clientWidth / 2 + activeThumb.clientWidth / 2;
      const maxLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const clampedLeft = Math.min(Math.max(0, nextLeft), maxLeft);

      rail.scrollTo({
        left: clampedLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [frames.length, index, reduceMotion]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {index !== null && currentFrame ? (
        <motion.div
          className={[
            "fixed inset-0 z-[92] overflow-hidden bg-[#050505] text-[#f6f1e8]",
            closing ? "pointer-events-none" : "",
          ].join(" ")}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.018, filter: "blur(4px)" }}
          animate={
            closing && !reduceMotion
              ? { opacity: 0.98, scale: 0.992, filter: "blur(2px)" }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99, filter: "blur(5px)" }}
          transition={{ duration: 0.62, ease: revealEase }}
          onWheel={handleWheel}
        >
          <motion.button
            type="button"
            aria-label="Close inspect reveal"
            className="absolute inset-0 cursor-default bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(244,241,234,0.09),rgba(5,5,5,0.96)_55%)]"
            onClick={close}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.06, filter: "blur(10px)" }}
            animate={
              closing && !reduceMotion
                ? { opacity: 0.78, scale: 0.985, filter: "blur(7px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.76, ease: revealEase }}
          />

          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentFrame.id}-inspect-atmosphere`}
              src={currentFrame.src}
              alt=""
              className="pointer-events-none absolute inset-[-8%] h-[116%] w-[116%] object-cover opacity-24 blur-2xl saturate-[1.06] contrast-[1.08]"
              initial={reduceMotion ? { opacity: 0.18 } : { opacity: 0, scale: 1.08, filter: "blur(34px)" }}
              animate={
                closing && !reduceMotion
                  ? { opacity: 0.08, scale: 0.955, filter: "blur(38px)" }
                  : { opacity: 0.24, scale: 1, filter: "blur(26px)" }
              }
              exit={{ opacity: 0, scale: 0.98, filter: "blur(36px)" }}
              transition={{ duration: 0.86, ease: revealEase }}
            />
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:86px_86px]" />
          <div className="pointer-events-none absolute left-1/2 top-[8%] h-[78vw] max-h-[62rem] w-[78vw] max-w-[62rem] -translate-x-1/2 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute left-[9vw] top-[58vh] h-px w-[84vw] rotate-[7deg] bg-gradient-to-r from-transparent via-white/18 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentFrame.id}-${closing ? "closing" : "opening"}-inspect-signal`}
              className="pointer-events-none fixed inset-0 z-[94]"
              initial={{ opacity: 0 }}
              animate={{ opacity: closing ? [0, 0.2, 0] : [0, 0.18, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: closing ? 0.72 : 1.05, ease: revealEase }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.22),transparent_34%)]" />
              <div className="absolute left-1/2 top-1/2 h-px w-[44vw] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/44 to-transparent" />
              <div className="absolute left-1/2 top-[52%] -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">
                {closing ? "Inspect system releasing" : "Inspect system assembling"}
              </div>
            </motion.div>
          </AnimatePresence>

          {previousFrame ? (
            <motion.div
              key={`${currentFrame.id}-previous-trace`}
              className="pointer-events-none absolute left-[5%] top-[18%] hidden h-[18vh] w-[18vw] overflow-hidden border border-white/12 bg-white/6 opacity-40 shadow-[0_28px_120px_rgba(0,0,0,0.42)] md:block"
              style={{ clipPath: "polygon(6% 0, 100% 10%, 88% 100%, 0 86%)" }}
              initial={reduceMotion ? { opacity: 0.24 } : { opacity: 0, y: 18, rotate: -10, scale: 0.92 }}
              animate={
                closing && !reduceMotion
                  ? { opacity: 0, y: -18, rotate: -13, scale: 0.9 }
                  : { opacity: 0.34, y: 0, rotate: -6, scale: 1 }
              }
              exit={{ opacity: 0, y: -12, rotate: -12, scale: 0.94 }}
              transition={{ duration: 0.78, delay: 0.16, ease: revealEase }}
            >
              <img src={previousFrame.src} alt="" className="h-full w-full object-cover saturate-[1.08] brightness-[1.08]" />
              <div className="absolute inset-0 bg-black/28" />
            </motion.div>
          ) : null}

          {nextFrame ? (
            <motion.div
              key={`${currentFrame.id}-next-trace`}
              className="pointer-events-none absolute right-[6%] top-[64%] hidden h-[16vh] w-[17vw] overflow-hidden border border-white/12 bg-white/6 opacity-40 shadow-[0_28px_120px_rgba(0,0,0,0.42)] lg:block"
              style={{ clipPath: "polygon(0 10%, 94% 0, 100% 86%, 8% 100%)" }}
              initial={reduceMotion ? { opacity: 0.2 } : { opacity: 0, y: -18, rotate: 9, scale: 0.92 }}
              animate={
                closing && !reduceMotion
                  ? { opacity: 0, y: 18, rotate: 13, scale: 0.9 }
                  : { opacity: 0.28, y: 0, rotate: 5, scale: 1 }
              }
              exit={{ opacity: 0, y: 12, rotate: 12, scale: 0.94 }}
              transition={{ duration: 0.78, delay: 0.22, ease: revealEase }}
            >
              <img src={nextFrame.src} alt="" className="h-full w-full object-cover saturate-[1.08] brightness-[1.08]" />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          ) : null}

          <div className="relative z-[93] grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto]">
            <motion.header
              className="grid gap-4 border-b border-white/12 px-4 py-4 backdrop-blur-md md:grid-cols-[1fr_auto] md:px-7"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16, clipPath: "inset(0 100% 0 0)" }}
              animate={
                closing && !reduceMotion
                  ? { opacity: 0, y: -14, clipPath: "inset(0 100% 0 0)" }
                  : { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }
              }
              exit={{ opacity: 0, y: -10, clipPath: "inset(0 100% 0 0)" }}
              transition={{ duration: 0.72, delay: 0.18, ease: revealEase }}
            >
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/42">
                  Cinematic inspect reveal / {formatIndex(index + 1)} / {formatIndex(frames.length)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold leading-none tracking-normal text-white md:text-4xl">
                    {currentFrame.label}
                  </h2>
                  <span className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/48">
                    {getRoleLabel(currentFrame.role)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={goPrev}
                  onMouseEnter={() => sound.playRole("hover")}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-white/6 text-lg text-white/72 transition hover:bg-white hover:text-neutral-950"
                  aria-label="Previous screenshot"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  onMouseEnter={() => sound.playRole("hover")}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-white/6 text-lg text-white/72 transition hover:bg-white hover:text-neutral-950"
                  aria-label="Next screenshot"
                >
                  &rarr;
                </button>
                <button
                  type="button"
                  onClick={close}
                  onMouseEnter={() => sound.playRole("hover")}
                  className="ml-1 rounded-full border border-white/14 bg-white/8 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/72 transition hover:bg-white hover:text-neutral-950"
                >
                  Close
                </button>
              </div>
            </motion.header>

            <main
              className="grid min-h-0 items-center px-3 py-4 md:px-7 md:py-6"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative mx-auto grid h-full w-full max-w-[1660px] place-items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFrame.id}
                    className="relative flex h-full max-h-[calc(100dvh-15.5rem)] w-full items-center justify-center"
                    initial={
                      reduceMotion
                        ? { opacity: 1 }
                        : {
                          opacity: 0,
                          scale: 0.955,
                            y: frameDirection > 0 ? 34 : -34,
                            filter: "blur(8px)",
                            clipPath: "polygon(8% 0, 100% 8%, 92% 92%, 0 100%)",
                          }
                    }
                    animate={
                      closing && !reduceMotion
                        ? {
                            opacity: 0.12,
                            scale: 0.982,
                            y: 30,
                            filter: "blur(9px)",
                            clipPath: "polygon(0 9%, 94% 0, 100% 86%, 8% 100%)",
                          }
                        : {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            filter: "blur(0px)",
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                          }
                    }
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            scale: 0.982,
                            y: frameDirection > 0 ? -28 : 28,
                            filter: "blur(8px)",
                            clipPath: "polygon(0 9%, 94% 0, 100% 86%, 8% 100%)",
                          }
                    }
                    transition={{ duration: 0.86, delay: 0.12, ease: revealEase }}
                  >
                    <motion.img
                      src={currentFrame.src}
                      alt={currentFrame.alt}
                      className="max-h-full max-w-full object-contain shadow-[0_34px_140px_rgba(0,0,0,0.46)]"
                      initial={reduceMotion ? undefined : { scale: 1.025 }}
                      animate={reduceMotion ? undefined : { scale: closing ? 0.985 : 1 }}
                      transition={{ duration: 1.05, ease: revealEase }}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[72rem] px-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentFrame.id}-caption`}
                      className="pointer-events-auto border-y border-white/14 bg-black/42 px-4 py-3 text-white/62 backdrop-blur-md md:grid md:grid-cols-[auto_1fr] md:gap-6 md:px-5"
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, clipPath: "inset(0 100% 0 0)" }}
                      animate={
                        closing && !reduceMotion
                          ? { opacity: 0, y: 12, clipPath: "inset(0 100% 0 0)" }
                          : { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }
                      }
                      exit={{ opacity: 0, y: 8, clipPath: "inset(0 100% 0 0)" }}
                      transition={{ duration: 0.64, delay: 0.28, ease: revealEase }}
                    >
                      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/38">
                        What this frame proves
                      </div>
                      <p className="mt-2 max-w-3xl text-sm leading-6 md:mt-0 md:text-[15px]">
                        {currentFrame.caption}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </main>

            <motion.footer
              className="border-t border-white/12 px-3 py-3 backdrop-blur-md md:px-7"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, clipPath: "inset(0 0 0 100%)" }}
              animate={
                closing && !reduceMotion
                  ? { opacity: 0, y: 14, clipPath: "inset(0 0 0 100%)" }
                  : { opacity: 1, y: 0, clipPath: "inset(0 0 0 0%)" }
              }
              exit={{ opacity: 0, y: 12, clipPath: "inset(0 0 0 100%)" }}
              transition={{ duration: 0.72, delay: 0.32, ease: revealEase }}
            >
              <div
                ref={thumbnailRailRef}
                className="mx-auto flex max-w-[1660px] gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {frames.map((frame, frameIndex) => {
                  const active = frameIndex === index;

                  return (
                    <button
                      key={frame.id}
                      ref={(node) => {
                        thumbnailButtonRefs.current[frameIndex] = node;
                      }}
                      type="button"
                      onClick={() => goTo(frameIndex, index !== null && frameIndex < index ? -1 : 1)}
                      onMouseEnter={() => sound.playRole("hover")}
                      className={[
                        "group relative h-16 w-28 shrink-0 overflow-hidden border bg-white/5 transition md:h-20 md:w-36",
                        active ? "border-white/82" : "border-white/12 hover:border-white/42",
                      ].join(" ")}
                      aria-current={active ? "true" : undefined}
                    >
                      <img
                        src={frame.src}
                        alt=""
                        className="h-full w-full object-cover opacity-70 transition group-hover:opacity-100"
                      />
                      <span className="absolute bottom-1 left-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/70">
                        {formatIndex(frameIndex + 1)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.footer>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
