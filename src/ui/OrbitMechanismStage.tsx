import { useEffect, useMemo, useRef } from "react";
import styles from "./OrbitMechanismStage.module.css";

type ArcSeg = {
  id: string;
  d: string;
  width: number;
  opacity: number;
};

type TickLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
};

type DotNode = {
  id: string;
  x: number;
  y: number;
  r: number;
};

type SquareNode = {
  id: string;
  x: number;
  y: number;
  size: number;
};

type OrbitNode = {
  id: string;
  x: number;
  y: number;
  radius: number;
};

type OrbitMechanismStageProps = {
  className?: string;
  height?: number | string;
  stickyTop?: number | string;
  showMetaBar?: boolean;
  title?: string;
  subtitle?: string;
  onceReducedMotionStatic?: boolean;
  embedded?: boolean;
  panelTone?: "soft" | "white";
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const startPt = polarToCartesian(cx, cy, r, end);
  const endPt = polarToCartesian(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(
    2
  )} 0 ${largeArc} 0 ${endPt.x.toFixed(2)} ${endPt.y.toFixed(2)}`;
}

function makeArcSegments(
  cx: number,
  cy: number,
  r: number,
  parts: Array<[number, number]>,
  width: number,
  opacity: number,
  prefix: string
): ArcSeg[] {
  return parts.map((part, index) => ({
    id: `${prefix}-${index}`,
    d: arcPath(cx, cy, r, part[0], part[1]),
    width,
    opacity,
  }));
}

function makeTicks(
  cx: number,
  cy: number,
  r: number,
  count: number,
  inner: number,
  outer: number,
  prefix: string
): TickLine[] {
  const lines: TickLine[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (360 / count) * i;
    const a = polarToCartesian(cx, cy, r - inner, angle);
    const b = polarToCartesian(cx, cy, r + outer, angle);
    lines.push({
      id: `${prefix}-${i}`,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      opacity: i % 6 === 0 ? 0.46 : 0.22,
    });
  }
  return lines;
}

function makeDots(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
  count: number,
  size = 2.2,
  prefix = "dot"
): DotNode[] {
  const dots: DotNode[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const angle = start + (end - start) * t;
    const p = polarToCartesian(cx, cy, r, angle);
    dots.push({
      id: `${prefix}-${i}`,
      x: p.x,
      y: p.y,
      r: size * (i % 3 === 0 ? 1 : 0.72),
    });
  }
  return dots;
}

function makeSquares(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
  count: number,
  prefix = "sq"
): SquareNode[] {
  const squares: SquareNode[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const angle = start + (end - start) * t;
    const p = polarToCartesian(cx, cy, r, angle);
    squares.push({ id: `${prefix}-${i}`, x: p.x, y: p.y, size: i % 2 === 0 ? 10 : 7 });
  }
  return squares;
}

function makeOrbitNodes(
  cx: number,
  cy: number,
  r: number,
  angles: number[],
  majorEvery = 2,
  prefix = "orbit"
): OrbitNode[] {
  return angles.map((angle, index) => {
    const p = polarToCartesian(cx, cy, r, angle);
    return {
      id: `${prefix}-${index}`,
      x: p.x,
      y: p.y,
      radius: index % majorEvery === 0 ? 15 : 11,
    };
  });
}

function RingNode({
  x,
  y,
  radius,
  thick = false,
  active = false,
  delay = 0,
}: {
  x: number;
  y: number;
  radius: number;
  thick?: boolean;
  active?: boolean;
  delay?: number;
}) {
  const style: React.CSSProperties = { transformOrigin: `${x}px ${y}px` };

  return (
    <g
      className={active ? styles.ringActive : styles.ringIdle}
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      <circle cx={x + 4} cy={y + 7} r={radius} fill="rgba(0,0,0,0.04)" />
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="white"
        stroke="rgba(0,0,0,0.72)"
        strokeWidth={thick ? 5 : 3.6}
      />
      <circle cx={x} cy={y} r={radius * 0.28} fill="rgba(0,0,0,0.76)" />
    </g>
  );
}

export default function OrbitMechanismStage({
  className,
  height = 820,
  stickyTop = 32,
  showMetaBar = true,
  title = "Orbit Mechanism",
  subtitle = "Clockwork logic / premium kinetic stage",
  onceReducedMotionStatic = true,
  embedded = false,
  panelTone = "soft",
}: OrbitMechanismStageProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const outerGroupRef = useRef<SVGGElement | null>(null);
  const secondaryGroupRef = useRef<SVGGElement | null>(null);
  const gearGroupRef = useRef<SVGGElement | null>(null);
  const coreGroupRef = useRef<SVGGElement | null>(null);
  const sweepLineRef = useRef<SVGLineElement | null>(null);
  const armARef = useRef<SVGLineElement | null>(null);
  const armBRef = useRef<SVGLineElement | null>(null);
  const counterRef = useRef<SVGLineElement | null>(null);

  const pointerRef = useRef({ x: 0, y: 0 });
  const currentPointerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  const cx = 360;
  const cy = 360;

  const outerReference = useMemo(
    () =>
      makeArcSegments(
        cx,
        cy,
        252,
        [
          [-16, 58],
          [72, 128],
          [146, 228],
          [244, 308],
        ],
        2.2,
        0.72,
        "outer-ref"
      ),
    []
  );
  const outerSecondary = useMemo(
    () => makeArcSegments(cx, cy, 234, [[-4, 54], [188, 278]], 1.4, 0.56, "outer-secondary"),
    []
  );
  const midPrimary = useMemo(
    () =>
      makeArcSegments(cx, cy, 204, [[-42, 34], [46, 108], [164, 248]], 2.5, 0.8, "mid-primary"),
    []
  );
  const midSecondary = useMemo(
    () =>
      makeArcSegments(cx, cy, 172, [[-24, 82], [112, 170], [196, 274]], 2.3, 0.82, "mid-secondary"),
    []
  );
  const innerPrimary = useMemo(
    () =>
      makeArcSegments(cx, cy, 124, [[-10, 64], [102, 208], [226, 318]], 2.8, 0.84, "inner-primary"),
    []
  );
  const innerFine = useMemo(
    () => makeArcSegments(cx, cy, 92, [[18, 136], [170, 246], [264, 330]], 1.9, 0.86, "inner-fine"),
    []
  );
  const coreBand = useMemo(
    () => makeArcSegments(cx, cy, 52, [[-36, 100], [148, 246]], 5.2, 0.94, "core-band"),
    []
  );
  const ticksOuter = useMemo(() => makeTicks(cx, cy, 160, 64, 8, 6, "tick-outer"), []);
  const ticksInner = useMemo(() => makeTicks(cx, cy, 138, 72, 3, 4, "tick-inner"), []);
  const dotsA = useMemo(() => makeDots(cx, cy, 228, 28, 118, 12, 2.4, "dots-a"), []);
  const dotsB = useMemo(() => makeDots(cx, cy, 230, 198, 286, 14, 2.1, "dots-b"), []);
  const gearSquares = useMemo(() => makeSquares(cx, cy, 170, 118, 248, 9, "gear"), []);
  const outerNodes = useMemo(
    () => makeOrbitNodes(cx, cy, 232, [2, 48, 92, 150, 214, 264, 314], 1, "outer-node"),
    []
  );
  const mediumNodes = useMemo(
    () => makeOrbitNodes(cx, cy, 118, [32, 82, 142, 182, 228, 286, 332], 10, "medium-node"),
    []
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = media.matches;
    };
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (onceReducedMotionStatic && reducedMotionRef.current) return;

    let mounted = true;
    let last = performance.now();
    let t = 0;

    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      t += dt * 0.00098;

      currentPointerRef.current.x += (pointerRef.current.x - currentPointerRef.current.x) * 0.05;
      currentPointerRef.current.y += (pointerRef.current.y - currentPointerRef.current.y) * 0.05;

      const px = currentPointerRef.current.x;
      const py = currentPointerRef.current.y;

      const outerRotation = (t * 360 * 0.018) % 360;
      const secondaryRotation = (-t * 360 * 0.024) % 360;
      const gearRotation = (t * 360 * 0.06) % 360;
      const coreRotation = (-t * 360 * 0.1) % 360;
      const armRotation = (t * 360 * 0.034) % 360;
      const counterArmRotation = (-t * 360 * 0.028) % 360;
      const sweepRotation = (t * 360 * 0.13) % 360;

      const sweepEnd = polarToCartesian(cx, cy, 238, sweepRotation - 90);
      const counterEnd = polarToCartesian(cx, cy, 274, counterArmRotation + 42);
      const armAEnd = polarToCartesian(cx, cy, 310, armRotation - 56);
      const armBEnd = polarToCartesian(cx, cy, 286, armRotation + 124);

      if (outerGroupRef.current) {
        outerGroupRef.current.style.transformOrigin = `${cx}px ${cy}px`;
        outerGroupRef.current.style.transform = `translate(${px * 4}px, ${py * 3}px) rotate(${outerRotation}deg)`;
      }

      if (secondaryGroupRef.current) {
        secondaryGroupRef.current.style.transformOrigin = `${cx}px ${cy}px`;
        secondaryGroupRef.current.style.transform = `translate(${px * 3}px, ${py * 2}px) rotate(${secondaryRotation}deg)`;
      }

      if (gearGroupRef.current) {
        gearGroupRef.current.style.transformOrigin = `${cx}px ${cy}px`;
        gearGroupRef.current.style.transform = `translate(${px * 2}px, ${py * 2}px) rotate(${gearRotation}deg)`;
      }

      if (coreGroupRef.current) {
        coreGroupRef.current.style.transformOrigin = `${cx}px ${cy}px`;
        coreGroupRef.current.style.transform = `translate(${px * 2}px, ${py * 1.5}px) rotate(${coreRotation}deg)`;
      }

      if (sweepLineRef.current) {
        sweepLineRef.current.setAttribute("x1", String(cx));
        sweepLineRef.current.setAttribute("y1", String(cy));
        sweepLineRef.current.setAttribute("x2", String(sweepEnd.x));
        sweepLineRef.current.setAttribute("y2", String(sweepEnd.y));
      }

      if (armARef.current) {
        armARef.current.setAttribute("x1", String(cx));
        armARef.current.setAttribute("y1", String(cy));
        armARef.current.setAttribute("x2", String(armAEnd.x));
        armARef.current.setAttribute("y2", String(armAEnd.y));
      }

      if (armBRef.current) {
        armBRef.current.setAttribute("x1", String(cx));
        armBRef.current.setAttribute("y1", String(cy));
        armBRef.current.setAttribute("x2", String(armBEnd.x));
        armBRef.current.setAttribute("y2", String(armBEnd.y));
      }

      if (counterRef.current) {
        counterRef.current.setAttribute("x1", String(cx));
        counterRef.current.setAttribute("y1", String(cy));
        counterRef.current.setAttribute("x2", String(counterEnd.x));
        counterRef.current.setAttribute("y2", String(counterEnd.y));
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${px * 10}px, ${py * 8}px) scale(${1.01 + Math.sin(t * 0.34) * 0.01})`;
        glowRef.current.style.opacity = String(0.72 + Math.sin(t * 0.48) * 0.03);
      }

      if (mounted) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onceReducedMotionStatic]);

  const containerStyle = embedded
    ? undefined
    : {
        height: typeof height === "number" ? `${height}px` : height,
        top: typeof stickyTop === "number" ? `${stickyTop}px` : stickyTop,
      };

  const rootClassName = [embedded ? styles.embeddedRoot : styles.stageWrap, className]
    .filter(Boolean)
    .join(" ");

  const panelClassName = [
    styles.stagePanel,
    panelTone === "white" ? styles.panelWhite : styles.panelSoft,
    embedded ? styles.panelEmbedded : "",
  ]
    .filter(Boolean)
    .join(" ");

  const bgClassName = [
    styles.panelBg,
    panelTone === "white" ? styles.panelBgWhite : styles.panelBgSoft,
  ].join(" ");

  return (
    <div className={rootClassName} style={containerStyle}>
      <div
        ref={rootRef}
        className={panelClassName}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          pointerRef.current = {
            x: ((e.clientX - rect.left) / rect.width - 0.5) * 1.1,
            y: ((e.clientY - rect.top) / rect.height - 0.5) * 1.1,
          };
        }}
        onMouseLeave={() => {
          pointerRef.current = { x: 0, y: 0 };
        }}
      >
        <div className={bgClassName} />
        <div ref={glowRef} className={styles.glow} />

        <svg viewBox="0 0 720 840" className={styles.svg} aria-hidden="true">
          <g>
            <line ref={armARef} x1={cx} y1={cy} x2={cx} y2={cy} stroke="rgba(0,0,0,0.58)" strokeWidth="1.5" />
            <line ref={armBRef} x1={cx} y1={cy} x2={cx} y2={cy} stroke="rgba(0,0,0,0.56)" strokeWidth="1.35" />
            <line ref={counterRef} x1={cx} y1={cy} x2={cx} y2={cy} stroke="rgba(0,0,0,0.42)" strokeWidth="1.2" />
          </g>

          <g ref={outerGroupRef}>
            {outerReference.map((seg) => (
              <path key={seg.id} d={seg.d} fill="none" stroke="rgba(0,0,0,0.72)" strokeWidth={seg.width} opacity={seg.opacity} strokeLinecap="round" />
            ))}
            {outerSecondary.map((seg) => (
              <path key={seg.id} d={seg.d} fill="none" stroke="rgba(0,0,0,0.56)" strokeWidth={seg.width} opacity={seg.opacity} strokeLinecap="round" />
            ))}
            {outerNodes.map((node, index) => (
              <RingNode key={node.id} x={node.x} y={node.y} radius={node.radius} thick delay={index * 0.08} />
            ))}
          </g>

          <g ref={secondaryGroupRef}>
            {midPrimary.map((seg) => (
              <path key={seg.id} d={seg.d} fill="none" stroke="rgba(0,0,0,0.76)" strokeWidth={seg.width} opacity={seg.opacity} strokeLinecap="round" />
            ))}
            {midSecondary.map((seg) => (
              <path key={seg.id} d={seg.d} fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={seg.width} opacity={seg.opacity} strokeLinecap="round" />
            ))}
            {mediumNodes.map((node, index) => (
              <RingNode key={node.id} x={node.x} y={node.y} radius={node.radius} delay={index * 0.06} />
            ))}
          </g>

          <g>
            {ticksOuter.map((tick, index) => (
              <line key={tick.id} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke="rgba(0,0,0,0.46)" strokeWidth={index % 6 === 0 ? 1.2 : 0.86} opacity={tick.opacity} />
            ))}
            {ticksInner.map((tick) => (
              <line key={tick.id} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke="rgba(0,0,0,0.34)" strokeWidth="0.9" opacity={tick.opacity} />
            ))}
          </g>

          <g ref={gearGroupRef}>
            {gearSquares.map((sq) => (
              <rect
                key={sq.id}
                x={sq.x - sq.size / 2}
                y={sq.y - sq.size / 2}
                width={sq.size}
                height={sq.size}
                fill="rgba(0,0,0,0.76)"
                style={{ transformOrigin: `${sq.x}px ${sq.y}px` }}
              />
            ))}
            {dotsA.map((dot) => (
              <circle key={dot.id} cx={dot.x} cy={dot.y} r={dot.r} fill="rgba(0,0,0,0.74)" />
            ))}
            {dotsB.map((dot) => (
              <circle key={dot.id} cx={dot.x} cy={dot.y} r={dot.r} fill="rgba(0,0,0,0.74)" />
            ))}
          </g>

          <g ref={coreGroupRef}>
            {innerPrimary.map((seg) => (
              <path key={seg.id} d={seg.d} fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth={seg.width} opacity={seg.opacity} strokeLinecap="round" />
            ))}
            {innerFine.map((seg) => (
              <path key={seg.id} d={seg.d} fill="none" stroke="rgba(0,0,0,0.86)" strokeWidth={seg.width} opacity={seg.opacity} strokeLinecap="round" />
            ))}
            {coreBand.map((seg) => (
              <path key={seg.id} d={seg.d} fill="none" stroke="rgba(0,0,0,0.9)" strokeWidth={seg.width} opacity={seg.opacity} strokeLinecap="round" />
            ))}
          </g>

          <line ref={sweepLineRef} x1={cx} y1={cy} x2={cx} y2={cy} stroke="rgba(0,0,0,0.72)" strokeWidth="1.8" />
          <RingNode x={cx} y={cy} radius={22} thick active delay={0.1} />
        </svg>

        {!embedded && showMetaBar && (
          <div className={styles.metaBar}>
            <div className={styles.metaGrid}>
              <div>
                <div className={styles.metaLabel}>Stage</div>
                <div className={styles.metaValue}>{title}</div>
                <div className={styles.metaSub}>{subtitle}</div>
              </div>
              <div>
                <div className={styles.metaLabel}>Mode</div>
                <div className={styles.metaPlain}>Functional radial system</div>
              </div>
              <div>
                <div className={styles.metaLabel}>Material</div>
                <div className={styles.metaPlain}>Monochrome structure</div>
              </div>
              <div>
                <div className={styles.metaLabel}>Status</div>
                <div className={styles.metaPlain}>Live</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
