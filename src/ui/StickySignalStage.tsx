import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./StickySignalStage.module.css";

export type StickySignalStageProps = {
  /** Sticky top offset in pixels. */
  stickyTop?: number;
  /** Stage height in pixels. */
  height?: number;
  /** Additional class for the outer sticky wrapper. */
  className?: string;
  /** Additional class for the frameless stage area. */
  stageClassName?: string;
  /** Whether sticky positioning should be enabled. */
  sticky?: boolean;
  /** Reduced-density variant for tighter layouts. */
  compact?: boolean;
  /** Internal zoom of the graph itself. */
  zoom?: number;
  /** Internal horizontal shift of the graph itself. */
  shiftX?: number;
  /** Internal vertical shift of the graph itself. */
  shiftY?: number;
};

type NodeSeed = {
  id: number;
  baseX: number;
  baseY: number;
  radius: number;
  ampX: number;
  ampY: number;
  freq: number;
  phase: number;
};

type LiveNode = {
  id: number;
  x: number;
  y: number;
  radius: number;
};

type Link = {
  a: LiveNode;
  b: LiveNode;
  opacity: number;
};

function rng(seed = 2048) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function makeSeeds(compact = false): NodeSeed[] {
  const random = rng(compact ? 1024 : 2048);
  const nodes: NodeSeed[] = [];
  const count = compact ? 22 : 26;

  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2;
    const ring = i < count * 0.3 ? 58 + random() * 30 : i < count * 0.72 ? 120 + random() * 56 : 170 + random() * 70;
    const x = 240 + Math.cos(angle) * ring;
    const y = 240 + Math.sin(angle) * ring * (0.84 + random() * 0.16);
    const major = i % 6 === 0 || i % 7 === 0;

    nodes.push({
      id: i,
      baseX: x,
      baseY: y,
      radius: major ? 10 + random() * 6 : 2.6 + random() * 4.8,
      ampX: major ? 10 + random() * 18 : 8 + random() * 14,
      ampY: major ? 8 + random() * 16 : 6 + random() * 12,
      freq: 0.3 + random() * 0.42,
      phase: random() * Math.PI * 2,
    });
  }

  return nodes;
}

function buildGraph(seeds: NodeSeed[], time: number, pointer: { x: number; y: number }) {
  const nodes: LiveNode[] = seeds.map((seed, index) => {
    const waveA = Math.sin(time * seed.freq + seed.phase);
    const waveB = Math.cos(time * (seed.freq * 0.74 + 0.08) + seed.phase * 1.6);
    const x = seed.baseX + waveA * seed.ampX + waveB * seed.ampX * 0.32 + pointer.x * (index % 5 === 0 ? 18 : 8);
    const y = seed.baseY + waveB * seed.ampY + waveA * seed.ampY * 0.26 + pointer.y * (index % 4 === 0 ? 14 : 6);

    return {
      id: seed.id,
      x,
      y,
      radius: seed.radius * (0.96 + (Math.sin(time * 1.2 + index) + 1) * 0.045),
    };
  });

  const links: Link[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 158) {
        links.push({
          a,
          b,
          opacity: Math.max(0.08, 0.36 - dist / 520),
        });
      }
    }
  }

  return { nodes, links };
}

function SignalStageGraphic({
  compact = false,
  zoom = 1,
  shiftX = 0,
  shiftY = 0,
}: {
  compact?: boolean;
  zoom?: number;
  shiftX?: number;
  shiftY?: number;
}) {
  const [time, setTime] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const seeds = useMemo(() => makeSeeds(compact), [compact]);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;

    const update = () => {
      reducedMotionRef.current = media.matches;
    };

    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    let mounted = true;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;

      targetRef.current.x += (0 - targetRef.current.x) * 0.0018;
      targetRef.current.y += (0 - targetRef.current.y) * 0.0018;

      if (reducedMotionRef.current) {
        setPointer({ x: 0, y: 0 });
        setTime(0);
      } else {
        setPointer((prev) => ({
          x: prev.x + (targetRef.current.x - prev.x) * 0.04,
          y: prev.y + (targetRef.current.y - prev.y) * 0.04,
        }));
        setTime((prev) => prev + dt * 0.0011);
      }

      if (mounted) rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const { nodes, links } = useMemo(() => buildGraph(seeds, time, pointer), [seeds, time, pointer]);

  return (
    <div
      className={styles.graphic}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        targetRef.current = {
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * 18,
        };
      }}
      onMouseLeave={() => {
        targetRef.current = { x: 0, y: 0 };
      }}
      aria-hidden="true"
    >
      <div
        className={styles.shadowGlow}
        style={{
          transform: `translate(${pointer.x * 1.5}px, ${pointer.y * 1.2}px) scale(${1.02 + Math.sin(time * 0.8) * 0.02})`,
          opacity: 0.84 + Math.sin(time * 0.92) * 0.05,
        }}
      />

      <div
        className={styles.centerGlow}
        style={{
          transform: `translate(${pointer.x * 1.2}px, ${pointer.y * 1}px) scale(${1.015 + Math.sin(time * 0.72) * 0.014})`,
          opacity: 0.72 + Math.sin(time * 0.86) * 0.04,
        }}
      />

      <svg
        viewBox="0 0 480 480"
        className={styles.svg}
        style={{
          transform: `translate(${shiftX}px, ${shiftY}px) scale(${zoom})`,
          transformOrigin: "50% 50%",
        }}
      >
        <defs>
          <linearGradient id="sticky-stage-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="14%" stopColor="white" stopOpacity="1" />
            <stop offset="86%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="sticky-stage-mask">
            <rect width="480" height="480" fill="url(#sticky-stage-fade)" />
          </mask>
        </defs>

        <g mask="url(#sticky-stage-mask)">
          {links.map((link, index) => (
            <line
              key={`link-${index}`}
              x1={link.a.x}
              y1={link.a.y}
              x2={link.b.x}
              y2={link.b.y}
              stroke="#d9d9d9"
              strokeWidth="0.8"
              opacity="0.2"
            />
          ))}

          {nodes.map((node) => (
            <g key={node.id}>
              <circle cx={node.x + 6} cy={node.y + 12} r={node.radius * 1.04} fill="#111111" opacity={0.07} />
              <circle
                cx={node.x - node.radius * 0.18}
                cy={node.y - node.radius * 0.22}
                r={node.radius * 0.42}
                fill="rgba(255,255,255,0.16)"
              />
              <circle cx={node.x} cy={node.y} r={node.radius * (0.98 + Math.sin(time * 1.4 + node.id * 0.32) * 0.03)} fill="#111111" />
            </g>
          ))}

          {nodes
            .filter((_, index) => index % 3 === 0)
            .map((node) => (
              <circle
                key={`micro-${node.id}`}
                cx={node.x + ((node.id % 3) - 1) * 16}
                cy={node.y + ((node.id % 4) - 1.5) * 12}
                r={Math.max(1.4, node.radius * 0.16)}
                fill="#111111"
                opacity={0.22 + Math.sin(time * 1.15 + node.id * 0.4) * 0.08}
              />
            ))}
        </g>
      </svg>
    </div>
  );
}

export default function StickySignalStage({
  stickyTop = 48,
  height = 620,
  className,
  stageClassName,
  sticky = true,
  compact = false,
  zoom = 1,
  shiftX = 0,
  shiftY = 0,
}: StickySignalStageProps) {
  return (
    <div
      className={clsx(styles.wrapper, sticky && styles.wrapperSticky, className)}
      style={sticky ? { top: `${stickyTop}px` } : undefined}
    >
      <div className={clsx(styles.stage, stageClassName)} style={{ height: `${height}px` }}>
        <SignalStageGraphic
          compact={compact}
          zoom={zoom}
          shiftX={shiftX}
          shiftY={shiftY}
        />
      </div>
    </div>
  );
}
