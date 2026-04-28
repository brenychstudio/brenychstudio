import { useRef, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

type LightboxFrame = {
  src: string;
  alt?: string;
  caption?: string;
};

type CaseImageLightboxProps = {
  frames: LightboxFrame[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const lightboxEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const lightboxOverlayTransition = {
  duration: 0.28,
  ease: lightboxEase,
};

const lightboxPanelTransition = {
  duration: 0.26,
  ease: lightboxEase,
};

const lightboxImageTransition = {
  duration: 0.24,
  ease: lightboxEase,
};

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

export default function CaseImageLightbox({
  frames,
  index,
  onClose,
  onPrev,
  onNext,
}: CaseImageLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const currentFrame = index !== null ? frames[index] ?? null : null;

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

    if (deltaX < 0) onNext();
    else onPrev();
  };

  return (
    <AnimatePresence>
      {index !== null && currentFrame ? (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={lightboxOverlayTransition}
        >
          <motion.div
            className="absolute inset-0 bg-white/90 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={lightboxOverlayTransition}
          />

          <motion.div
            className="relative z-[81] flex h-full flex-col"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={lightboxPanelTransition}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-10">
              <div className="min-w-0 text-[10px] uppercase tracking-[0.14em] text-neutral-500 md:text-[11px]">
                Image viewer / {formatIndex(index + 1)} / {formatIndex(frames.length)}
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:border-neutral-400"
                whileTap={{ scale: 0.98 }}
              >
                Close <span className="text-neutral-400">&times;</span>
              </motion.button>
            </div>

            <div
              className="flex flex-1 items-center justify-center px-4 pb-4 sm:px-6 md:px-10"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative w-full max-w-[1400px]"
                onClick={(event) => event.stopPropagation()}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFrame.src}
                    initial={{ opacity: 0, scale: 0.988, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.992, y: -6 }}
                    transition={lightboxImageTransition}
                    className="w-full"
                  >
                    <img
                      src={currentFrame.src}
                      alt={currentFrame.alt ?? ""}
                      className="mx-auto max-h-[66vh] w-auto max-w-full rounded-[18px] border border-neutral-200 bg-white object-contain shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:max-h-[72vh] sm:rounded-[24px] md:max-h-[78vh]"
                    />
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={onPrev}
                  className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/92 px-4 py-4 text-neutral-700 transition hover:border-neutral-400 md:inline-flex"
                  whileTap={{ scale: 0.98 }}
                  aria-label="Previous image"
                >
                  &larr;
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onNext}
                  className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/92 px-4 py-4 text-neutral-700 transition hover:border-neutral-400 md:inline-flex"
                  whileTap={{ scale: 0.98 }}
                  aria-label="Next image"
                >
                  &rarr;
                </motion.button>

                {frames.length > 1 ? (
                  <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
                    <button
                      type="button"
                      onClick={onPrev}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-600"
                      aria-label="Previous image"
                    >
                      Prev
                    </button>

                    <div className="flex items-center gap-2 px-1">
                      {frames.map((frame, frameIndex) => (
                        <span
                          key={`${frame.src}-lightbox-dot-${frameIndex}`}
                          className={[
                            "h-1.5 rounded-full transition duration-300",
                            frameIndex === index
                              ? "w-5 bg-neutral-500"
                              : "w-2 bg-neutral-300",
                          ].join(" ")}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={onNext}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-600"
                      aria-label="Next image"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentFrame.caption ? (
                <motion.div
                  key={`${currentFrame.src}-caption`}
                  className="px-6 pb-8 md:px-10"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={lightboxImageTransition}
                >
                  <div className="mx-auto grid max-w-[960px] gap-3 text-neutral-500">
                    <div className="h-px w-12 bg-neutral-200" />
                    <div className="text-sm leading-7 text-neutral-600">
                      {currentFrame.caption}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
