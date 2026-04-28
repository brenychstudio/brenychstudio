import { AnimatePresence, motion } from "framer-motion";
import type { Case } from "../data/cases";

function easeOutCubic(n: number) {
  const x = Math.max(0, Math.min(1, n));
  return 1 - Math.pow(1 - x, 3);
}

export default function StickyStage({
  activeCase,
  activeIndex = 0,
  total = 0,
  progress = 0,
  embedded = false,
}: {
  activeCase: Case;
  activeIndex?: number;
  total?: number;
  progress?: number;
  embedded?: boolean;
}) {
  const hasProgress = total > 0;

  const p = easeOutCubic(Math.max(0, Math.min(1, progress)));
  const pLabel = String(Math.round(p * 100)).padStart(3, "0");

  const travel = 58;
  const y = (1 - p) * travel - 18;
  const scale = 1.062 - p * 0.048;
  const bgY = -(1 - p) * 8;

  return (
    <motion.div
      className={embedded ? "h-full" : "sticky top-24 h-[calc(100vh-6rem)]"}
      initial={embedded ? false : { opacity: 0, y: 12, filter: "blur(14px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={embedded ? undefined : { opacity: 0, y: -10, filter: "blur(12px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      <div className="flex h-full flex-col">
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.035)]">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.04),transparent_45%),radial-gradient(circle_at_70%_85%,rgba(0,0,0,0.03),transparent_55%)]"
            style={{ transform: `translate3d(0, ${bgY}px, 0)` }}
          />
          <div className="pointer-events-none absolute inset-0 border border-white/40" />

          <div className="absolute inset-0 flex items-center justify-center px-6 py-8 md:px-10 md:py-12">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={activeCase.slug}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, filter: "blur(14px)", scale: 1.028 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{
                  opacity: 0,
                  filter: "blur(14px)",
                  scale: 0.988,
                  transition: {
                    opacity: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
                    filter: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                transition={{
                  opacity: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
                  filter: { duration: 0.96, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <div
                  className={[
                    "pointer-events-none max-h-[88%] max-w-[90%] select-none",
                    "rounded-[26px] border border-neutral-200/70 bg-white/88 p-3",
                    "shadow-[0_22px_70px_rgba(15,23,42,0.07)]",
                    "backdrop-blur-[1px]",
                  ].join(" ")}
                  style={{
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    transformOrigin: "50% 50%",
                    willChange: "transform",
                    transition: "transform 180ms linear",
                  }}
                >
                  <img
                    src={activeCase.poster.src}
                    alt={activeCase.poster.alt}
                    className={[
                      "block max-h-[70vh] max-w-full rounded-[18px]",
                      "border border-black/6 object-contain",
                      "shadow-[0_10px_30px_rgba(15,23,42,0.045)]",
                    ].join(" ")}
                    draggable={false}
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      console.warn("Poster failed to load:", el.src);
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {hasProgress ? (
            <div className="absolute bottom-5 left-6 text-[11px] uppercase tracking-[0.28em] text-neutral-500 md:left-8">
              {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>
          ) : null}

          <div className="absolute bottom-5 right-6 flex items-center gap-3 md:right-8">
            <div className="h-[1px] w-10 bg-neutral-300/70" />
            <div className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
              CAT {activeCase.code} · P {pLabel}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-[140px]">
              <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">Active</div>
              <div className="mt-1 text-lg tracking-tight">{activeCase.title}</div>
              <div className="text-xs text-neutral-500">{activeCase.year}</div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-[11px] uppercase tracking-[0.22em] text-neutral-500">
              <div>
                <div>Role</div>
                <div className="mt-1 text-xs tracking-normal text-neutral-700">{activeCase.roleLabel}</div>
              </div>
              <div>
                <div>Stack</div>
                <div className="mt-1 text-xs tracking-normal text-neutral-700">{activeCase.stackLabel}</div>
              </div>
              <div>
                <div>Status</div>
                <div className="mt-1 text-xs tracking-normal text-neutral-700">{activeCase.statusLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
