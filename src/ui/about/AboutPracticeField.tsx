import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type AboutPracticeFieldProps = {
  className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const fieldLabels = [
  { label: "visual direction", className: "left-[8%] top-[16%]" },
  { label: "interface architecture", className: "right-[16%] top-[22%]" },
  { label: "motion grammar", className: "left-[12%] bottom-[30%]" },
  { label: "front-end delivery", className: "right-[18%] bottom-[25%]" },
  { label: "atmosphere", className: "left-[36%] top-[8%]" },
  { label: "memory", className: "right-[35%] bottom-[13%]" },
] as const;

const methodNodes = [
  { label: "01", className: "left-[21%] top-[33%]" },
  { label: "02", className: "right-[23%] top-[34%]" },
  { label: "03", className: "left-[48%] top-[21%]" },
  { label: "04", className: "left-[31%] bottom-[24%]" },
  { label: "05", className: "right-[28%] bottom-[28%]" },
] as const;

const axisItems = [
  "commercial clarity",
  "experimental research",
  "production discipline",
] as const;

export default function AboutPracticeField({ className = "" }: AboutPracticeFieldProps) {
  const reduceMotion = useReducedMotion();
  const boundsRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.35 });
  const fieldX = useTransform(smoothX, [-1, 1], reduceMotion ? ["0%", "0%"] : ["-1.2%", "1.2%"]);
  const fieldY = useTransform(smoothY, [-1, 1], reduceMotion ? ["0%", "0%"] : ["-1%", "1%"]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = boundsRef.current?.getBoundingClientRect();
    if (!rect) return;

    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={boundsRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className={`relative min-h-[430px] overflow-hidden border-y border-neutral-950/10 bg-white/[0.18] md:min-h-[520px] lg:min-h-[640px] ${className}`}
      aria-label="Authorial practice field"
    >
      <motion.div
        className="absolute inset-0"
        style={{ x: fieldX, y: fieldY }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:78px_78px]" />
        <div className="pointer-events-none absolute left-[7%] top-[8%] h-[76%] w-[78%] rounded-[50%] border border-neutral-950/[0.08]" />
        <div className="pointer-events-none absolute left-[19%] top-[18%] h-[58%] w-[63%] rotate-[-14deg] rounded-[50%] border border-neutral-950/[0.065]" />
        <div className="pointer-events-none absolute left-[32%] top-[24%] h-[42%] w-[42%] rotate-[18deg] rounded-[50%] border border-neutral-950/[0.05]" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M 5 64 C 24 48, 36 47, 50 50 S 76 57, 96 31"
            fill="none"
            stroke="rgba(15,15,15,0.17)"
            strokeWidth="0.11"
            strokeDasharray="1 1.6"
            initial={reduceMotion ? undefined : { pathLength: 0.12, opacity: 0.2 }}
            animate={reduceMotion ? undefined : { pathLength: [0.12, 1, 0.12], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 9 20 C 25 35, 38 60, 51 51 S 72 30, 91 75"
            fill="none"
            stroke="rgba(15,15,15,0.13)"
            strokeWidth="0.1"
            strokeDasharray="0.8 2"
            initial={reduceMotion ? undefined : { pathLength: 0.25, opacity: 0.2 }}
            animate={reduceMotion ? undefined : { pathLength: [0.25, 0.92, 0.25], opacity: [0.2, 0.46, 0.2] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 18 82 C 38 68, 46 36, 58 43 S 72 56, 86 16"
            fill="none"
            stroke="rgba(15,15,15,0.1)"
            strokeWidth="0.09"
            strokeDasharray="0.7 2.4"
            initial={reduceMotion ? undefined : { pathLength: 0.18, opacity: 0.16 }}
            animate={reduceMotion ? undefined : { pathLength: [0.18, 0.82, 0.18], opacity: [0.16, 0.36, 0.16] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        <motion.div
          className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-950/16 bg-white/24 backdrop-blur-sm sm:h-72 sm:w-72 lg:h-80 lg:w-80"
          animate={reduceMotion ? undefined : { scale: [1, 1.025, 1], opacity: [0.58, 0.82, 0.58] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-1/2 top-1/2 w-[min(70%,31rem)] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400 sm:text-[10px]">
            Authorial practice field
          </div>
          <div className="mt-5 text-[42px] font-normal leading-[0.88] tracking-[-0.055em] text-neutral-950 sm:text-[64px] lg:text-[78px]">
            direction
            <br />
            becomes
            <br />
            system
          </div>
        </div>

        {methodNodes.map((node, index) => (
          <motion.div
            key={node.label}
            className={`absolute ${node.className} hidden h-8 w-8 items-center justify-center rounded-full border border-neutral-950/16 bg-[#f3f0e9]/84 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500 backdrop-blur sm:flex`}
            animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.58, 0.92, 0.58] }}
            transition={{ duration: 5.8 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
          >
            {node.label}
          </motion.div>
        ))}

        {fieldLabels.map((item, index) => (
          <motion.div
            key={item.label}
            className={`absolute ${item.className} hidden border-y border-neutral-950/12 bg-white/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.17em] text-neutral-500 backdrop-blur md:block`}
            initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.52, delay: index * 0.045, ease }}
          >
            {item.label}
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-x-4 bottom-4 grid gap-2 border-t border-neutral-950/10 pt-4 sm:inset-x-6 sm:grid-cols-3 lg:inset-x-8">
        {axisItems.map((item, index) => (
          <div
            key={item}
            className="grid grid-cols-[2rem_1fr] gap-3 border-t border-neutral-950/10 pt-3 first:border-t-0 sm:first:border-t"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase leading-5 tracking-[0.12em] text-neutral-600 sm:text-[11px]">
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
