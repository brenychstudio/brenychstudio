import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import { useSound } from "../../stage/audio/useSound";

type AboutPracticeFieldProps = {
  className?: string;
};

type MethodStageId = "signal" | "structure" | "atmosphere" | "interface" | "memory";

type MethodStage = {
  id: MethodStageId;
  index: string;
  label: string;
  shortLabel: string;
  axis: string;
  axisGroup: "commercial clarity" | "experimental research" | "production discipline";
  description: string;
  proof: string;
  nodeClassName: string;
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

const methodStages: MethodStage[] = [
  {
    id: "signal",
    index: "01",
    label: "Signal",
    shortLabel: "what must be understood",
    axis: "commercial clarity",
    axisGroup: "commercial clarity",
    description:
      "Understand what the project needs to communicate before deciding how it should look, move, or behave.",
    proof:
      "The first layer is meaning: offer, audience, context, pressure, and desired response.",
    nodeClassName: "left-[8%] top-[38%]",
  },
  {
    id: "structure",
    index: "02",
    label: "Structure",
    shortLabel: "route, content, data",
    axis: "system architecture",
    axisGroup: "commercial clarity",
    description:
      "Define the route, content hierarchy, data model, and interaction logic that will carry the work.",
    proof: "The page becomes a system before it becomes a surface.",
    nodeClassName: "right-[6%] top-[37%]",
  },
  {
    id: "atmosphere",
    index: "03",
    label: "Atmosphere",
    shortLabel: "visual climate",
    axis: "emotional temperature",
    axisGroup: "experimental research",
    description:
      "Shape the visual climate, motion rhythm, media behavior, and emotional temperature of the interface.",
    proof: "Atmosphere is not decoration. It tells the user how to feel and where to look.",
    nodeClassName: "left-[41%] top-[8%]",
  },
  {
    id: "interface",
    index: "04",
    label: "Interface",
    shortLabel: "production surface",
    axis: "front-end delivery",
    axisGroup: "production discipline",
    description:
      "Turn the system into responsive, accessible, production-ready front-end with clear interaction states.",
    proof: "The final surface must hold up across screens, motion, content, and launch conditions.",
    nodeClassName: "right-[8%] bottom-[31%]",
  },
  {
    id: "memory",
    index: "05",
    label: "Memory",
    shortLabel: "what remains",
    axis: "long-term clarity",
    axisGroup: "experimental research",
    description:
      "Leave reusable logic, documentation, patterns, and interface memory so the project can continue beyond launch.",
    proof: "A good interface does not end at deployment. It becomes a system that can evolve.",
    nodeClassName: "left-[17%] bottom-[31%]",
  },
] as const;

const axisItems = [
  "commercial clarity",
  "experimental research",
  "production discipline",
] as const;

export default function AboutPracticeField({ className = "" }: AboutPracticeFieldProps) {
  const reduceMotion = useReducedMotion();
  const sound = useSound();
  const boundsRef = useRef<HTMLDivElement | null>(null);
  const wheelCaptureCountRef = useRef(0);
  const lastWheelSwitchRef = useRef(0);
  const [selectedId, setSelectedId] = useState<MethodStageId>("atmosphere");
  const [activeId, setActiveId] = useState<MethodStageId>("atmosphere");
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.35 });
  const fieldX = useTransform(smoothX, [-1, 1], reduceMotion ? ["0%", "0%"] : ["-1.2%", "1.2%"]);
  const fieldY = useTransform(smoothY, [-1, 1], reduceMotion ? ["0%", "0%"] : ["-1%", "1%"]);
  const activeStage = methodStages.find((stage) => stage.id === activeId) ?? methodStages[2];

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
    wheelCaptureCountRef.current = 0;
    setActiveId(selectedId);
  };

  const activateStage = useCallback((id: MethodStageId) => {
    if (id !== activeId) sound.playRole("hover");
    setActiveId(id);
  }, [activeId, sound]);

  const selectStage = useCallback((id: MethodStageId) => {
    sound.playRole(id === selectedId ? "hover" : "select");
    setSelectedId(id);
    setActiveId(id);
  }, [selectedId, sound]);

  useEffect(() => {
    const element = boundsRef.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8) return;

      const rect = element.getBoundingClientRect();
      const fieldIsActive =
        rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.18;

      if (!fieldIsActive || wheelCaptureCountRef.current >= 3) return;

      const currentIndex = methodStages.findIndex((stage) => stage.id === selectedId);
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(methodStages.length - 1, Math.max(0, currentIndex + direction));

      if (nextIndex === currentIndex) return;

      const now = window.performance.now();
      if (now - lastWheelSwitchRef.current < 360) return;

      event.preventDefault();

      wheelCaptureCountRef.current += 1;
      lastWheelSwitchRef.current = now;
      selectStage(methodStages[nextIndex].id);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => element.removeEventListener("wheel", handleWheel);
  }, [selectStage, selectedId]);

  return (
    <div
      ref={boundsRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className={`relative min-h-[610px] overflow-hidden border-y border-neutral-950/10 bg-white/[0.18] md:min-h-[560px] lg:min-h-[660px] ${className}`}
      aria-label="Authorial practice field"
    >
      <motion.div
        className="absolute inset-0 pb-44 sm:pb-0"
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
          <motion.path
            key={`active-path-${activeStage.id}`}
            d={
              activeStage.id === "signal"
                ? "M 15 39 C 30 42, 39 49, 50 50"
                : activeStage.id === "structure"
                  ? "M 50 50 C 60 43, 72 38, 83 36"
                  : activeStage.id === "atmosphere"
                    ? "M 49 19 C 49 31, 50 40, 50 50"
                    : activeStage.id === "interface"
                      ? "M 50 50 C 61 58, 70 67, 77 72"
                      : "M 50 50 C 42 61, 36 70, 31 74"
            }
            fill="none"
            stroke="rgba(15,15,15,0.36)"
            strokeWidth="0.18"
            strokeDasharray="1.2 1.6"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0.16 }}
            animate={reduceMotion ? { opacity: 0.36 } : { pathLength: 1, opacity: 0.64 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, ease }}
          />
        </svg>

        <motion.div
          className="absolute left-1/2 top-[31%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-950/16 bg-white/24 backdrop-blur-sm sm:top-[42%] sm:h-80 sm:w-80 lg:h-[23rem] lg:w-[23rem]"
          animate={reduceMotion ? undefined : { scale: [1, 1.025, 1], opacity: [0.58, 0.82, 0.58] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-1/2 top-[31%] w-[min(82vw,21rem)] -translate-x-1/2 -translate-y-1/2 text-center sm:top-[42%] sm:w-[min(78%,23rem)]">
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400 sm:text-[10px]">
            Method atlas / {activeStage.index}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease }}
            >
              <div className="mt-3 text-[34px] font-normal leading-[0.88] tracking-[-0.055em] text-neutral-950 sm:mt-4 sm:text-[48px] lg:text-[54px]">
                {activeStage.label}
              </div>
              <div className="mx-auto mt-2 max-w-[18rem] font-mono text-[8px] uppercase leading-4 tracking-[0.14em] text-neutral-400 sm:text-[9px]">
                {activeStage.shortLabel} / {activeStage.axis}
              </div>
              <p className="mx-auto mt-3 max-w-[30ch] text-[11px] leading-5 text-neutral-600 sm:max-w-[19rem] sm:text-[12px]">
                {activeStage.description}
              </p>
              <p className="mx-auto mt-3 hidden max-w-[18rem] border-t border-neutral-950/10 pt-2 font-mono text-[8px] uppercase leading-4 tracking-[0.12em] text-neutral-400 sm:block">
                {activeStage.proof}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mx-auto mt-3 w-fit border-y border-neutral-950/10 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-400">
            direction becomes system
          </div>
        </div>

        {methodStages.map((stage) => {
          const active = activeStage.id === stage.id;

          return (
          <motion.button
            key={stage.id}
            type="button"
            aria-pressed={selectedId === stage.id}
            onMouseEnter={() => activateStage(stage.id)}
            onFocus={() => activateStage(stage.id)}
            onClick={() => selectStage(stage.id)}
            className={`absolute ${stage.nodeClassName} group hidden min-w-[7.1rem] items-center gap-2 rounded-full border px-2 py-1.5 text-left backdrop-blur transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 sm:flex ${
              active
                ? "z-30 border-neutral-950 bg-neutral-950 text-white shadow-[0_18px_42px_rgba(17,17,17,0.16)]"
                : "z-0 border-neutral-950/12 bg-[#f3f0e9]/56 text-neutral-400 hover:z-30 hover:border-neutral-950/34 hover:bg-[#f3f0e9]/86 hover:text-neutral-950"
            }`}
            animate={
              reduceMotion
                ? undefined
                : active
                  ? { scale: [1, 1.035, 1], opacity: 1 }
                  : { scale: 1, opacity: 0.34 }
            }
            transition={{ duration: active ? 2.8 : 0.28, repeat: active && !reduceMotion ? Infinity : 0, ease: "easeInOut" }}
          >
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[9px] uppercase tracking-[0.12em] transition ${
              active ? "border-white/22 bg-white text-neutral-950" : "border-neutral-950/12 bg-white/34"
            }`}>
              {stage.index}
            </span>
            <span className="grid gap-0.5">
              <span className="text-[11px] uppercase leading-none tracking-[0.13em]">{stage.label}</span>
              <span className={`font-mono text-[8px] uppercase leading-none tracking-[0.12em] transition ${
                active ? "text-white/58" : "text-neutral-400"
              }`}>
                {stage.shortLabel}
              </span>
            </span>
          </motion.button>
          );
        })}

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

      <div className="absolute inset-x-4 bottom-[8.6rem] grid grid-cols-[repeat(5,minmax(0,1fr))] gap-1.5 sm:hidden">
        {methodStages.map((stage) => {
          const active = activeStage.id === stage.id;

          return (
            <button
              key={`mobile-${stage.id}`}
              type="button"
              onClick={() => selectStage(stage.id)}
              className={`grid min-h-10 min-w-0 place-items-center rounded-full border px-1 text-center font-mono uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 ${
                active
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-950/12 bg-white/42 text-neutral-500"
              }`}
            >
              <span className="text-[8px] tracking-[0.12em]">{stage.index}</span>
              <span className="w-full truncate text-[6px] tracking-[0.08em]">{stage.label}</span>
            </button>
          );
        })}
      </div>

      <div className="absolute inset-x-4 bottom-4 grid gap-2 border-t border-neutral-950/10 pt-4 sm:inset-x-6 sm:grid-cols-3 lg:inset-x-8">
        {axisItems.map((item, index) => (
          <div
            key={item}
            className={`grid grid-cols-[2rem_1fr] gap-3 border-t pt-3 transition duration-300 first:border-t-0 sm:first:border-t ${
              activeStage.axisGroup === item
                ? "border-neutral-950/24 text-neutral-950"
                : "border-neutral-950/10 text-neutral-500"
            }`}
          >
            <div className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
              activeStage.axisGroup === item ? "text-neutral-950" : "text-neutral-300"
            }`}>
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase leading-5 tracking-[0.12em] sm:text-[11px]">
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
