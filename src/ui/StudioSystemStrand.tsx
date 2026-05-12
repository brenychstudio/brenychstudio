import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  className?: string;
};

const strandEase = [0.22, 1, 0.36, 1] as const;

const signalPaths = [
  {
    id: "core-pressure",
    d: "M202 -72C170 52 234 176 205 304C188 382 228 440 208 516C176 642 232 728 203 854C166 1018 236 1120 205 1268C182 1380 222 1482 206 1608C199 1684 199 1748 204 1838",
    width: 1.75,
    opacity: 0.92,
  },
  {
    id: "counter-pressure",
    d: "M207 -66C246 66 176 178 206 316C226 408 178 462 200 548C236 690 170 790 208 932C246 1074 176 1202 204 1344C228 1460 184 1580 200 1832",
    width: 1.35,
    opacity: 0.56,
  },
  {
    id: "carrier",
    d: "M198 -52C214 92 196 206 205 326C216 470 194 600 204 738C216 904 190 1038 205 1190C218 1346 194 1490 202 1830",
    width: 1,
    opacity: 0.34,
  },
  {
    id: "outer-left",
    d: "M158 -36C206 126 128 254 164 418C206 604 132 742 170 912C214 1110 138 1248 174 1412C198 1532 160 1652 184 1830",
    width: 0.85,
    opacity: 0.16,
  },
  {
    id: "outer-right",
    d: "M254 -28C218 120 286 268 240 430C190 608 282 766 236 938C190 1116 274 1262 232 1428C204 1548 250 1668 222 1834",
    width: 0.85,
    opacity: 0.14,
  },
] as const;

const signalNodes = [
  { x: 204, y: 146, label: "01" },
  { x: 204, y: 384, label: "02" },
  { x: 204, y: 630, label: "03" },
] as const;

export default function FormulaSignalStrand({ className = "" }: Props) {
  const target = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 74, damping: 31, mass: 0.48 });

  const drawPrimary = useTransform(progress, [0, 0.88], [0.18, 1]);
  const drawSecondary = useTransform(progress, [0.06, 0.94], [0.12, 1]);
  const drawOuter = useTransform(progress, [0.14, 1], [0.04, 1]);
  const yPrimary = useTransform(progress, [0, 1], ["-2.4%", "4.8%"]);
  const ySecondary = useTransform(progress, [0, 1], ["2.6%", "-3.2%"]);
  const fieldOpacity = useTransform(progress, [0, 0.14, 0.86, 1], [0.5, 0.9, 0.78, 0.34]);
  const nodeOne = useTransform(progress, [0.04, 0.2, 0.38], [0.18, 0.7, 0.24]);
  const nodeTwo = useTransform(progress, [0.22, 0.44, 0.64], [0.16, 0.74, 0.22]);
  const nodeThree = useTransform(progress, [0.5, 0.72, 0.94], [0.14, 0.66, 0.2]);
  const nodeOpacity = [nodeOne, nodeTwo, nodeThree];

  const staticPaths = (
    <svg
      className="absolute left-0 top-0 h-[118rem] w-full overflow-visible 2xl:h-[132rem]"
      viewBox="0 0 408 1818"
      fill="none"
    >
      <defs>
        <linearGradient id="formula-signal-static" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="12%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="88%" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {signalPaths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          stroke="url(#formula-signal-static)"
          strokeOpacity={path.opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={path.width}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );

  if (reduceMotion) {
    return (
      <div className={`pointer-events-none text-neutral-950 ${className}`} aria-hidden="true">
        {staticPaths}
      </div>
    );
  }

  return (
    <motion.div
      ref={target}
      className={`pointer-events-none relative text-neutral-950 ${className}`}
      style={{ opacity: fieldOpacity }}
      aria-hidden="true"
    >
      <svg
        className="absolute left-0 top-0 h-[118rem] w-full overflow-visible 2xl:h-[132rem]"
        viewBox="0 0 408 1818"
        fill="none"
      >
        <defs>
          <linearGradient id="formula-signal-line" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="9%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="30%" stopColor="currentColor" stopOpacity="0.58" />
            <stop offset="48%" stopColor="currentColor" stopOpacity="0.42" />
            <stop offset="66%" stopColor="currentColor" stopOpacity="0.54" />
            <stop offset="88%" stopColor="currentColor" stopOpacity="0.24" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {signalPaths.map((path, index) => {
          const draw = index < 2 ? drawPrimary : index === 2 ? drawSecondary : drawOuter;
          const y = index % 2 === 0 ? yPrimary : ySecondary;

          return (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="url(#formula-signal-line)"
              strokeOpacity={path.opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={path.width}
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: draw, y }}
              transition={{ duration: 0.7, ease: strandEase }}
            />
          );
        })}

        {signalNodes.map((node, index) => (
          <motion.g key={node.label} style={{ opacity: nodeOpacity[index] }}>
            <circle cx={node.x} cy={node.y} r="29" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
            <circle cx={node.x} cy={node.y} r="4" fill="currentColor" fillOpacity="0.2" />
            <text
              x={node.x + 16}
              y={node.y + 4}
              fill="currentColor"
              fillOpacity="0.24"
              fontSize="14"
              fontFamily="Arial, sans-serif"
              letterSpacing="3"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>

      <div className="absolute inset-x-[18%] top-0 h-px bg-gradient-to-r from-transparent via-neutral-950/14 to-transparent" />
      <div className="absolute inset-x-[14%] bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-950/10 to-transparent" />
    </motion.div>
  );
}
