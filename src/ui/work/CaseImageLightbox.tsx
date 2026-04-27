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

export default function CaseImageLightbox({
  frames,
  index,
  onClose,
  onPrev,
  onNext,
}: CaseImageLightboxProps) {
  const currentFrame = index !== null ? frames[index] ?? null : null;

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
            <div className="flex items-center justify-between px-6 py-5 md:px-10">
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                Image viewer / {String(index + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:border-neutral-400"
                whileTap={{ scale: 0.98 }}
              >
                Close <span className="text-neutral-400">&times;</span>
              </motion.button>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 pb-6 sm:px-6 md:px-10">
              <div
                className="relative w-full max-w-[1400px]"
                onClick={(e) => e.stopPropagation()}
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
                      className="mx-auto max-h-[72vh] w-auto max-w-full rounded-[18px] border border-neutral-200 bg-white object-contain shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:max-h-[78vh] sm:rounded-[24px]"
                    />
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={onPrev}
                  className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white/92 px-4 py-4 text-neutral-700 transition hover:border-neutral-400"
                  whileTap={{ scale: 0.98 }}
                >
                  &larr;
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onNext}
                  className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 md:inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white/92 px-4 py-4 text-neutral-700 transition hover:border-neutral-400"
                  whileTap={{ scale: 0.98 }}
                >
                  &rarr;
                </motion.button>
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
                  <div className="mx-auto max-w-[960px] grid gap-3 text-neutral-500">
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
