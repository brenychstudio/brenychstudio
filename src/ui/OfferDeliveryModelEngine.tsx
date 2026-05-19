import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type DeliveryEngineStage = {
  label: string;
  title: string;
  text: string;
  output: string;
};

type Pointer = {
  x: number;
  y: number;
};

type NodeRole = "stage" | "satellite" | "relay";

type NodeSeed = {
  id: number;
  stageIndex: number;
  base: THREE.Vector3;
  radius: number;
  phase: number;
  drift: THREE.Vector3;
  role: NodeRole;
};

type LinkSeed = {
  a: number;
  b: number;
  strength: number;
};

type FlowSeed = {
  id: number;
  lane: number;
  phase: number;
  speed: number;
  scale: number;
};

type TickSeed = {
  id: number;
  stageIndex: number;
  base: THREE.Vector3;
  angle: number;
  length: number;
  phase: number;
};

type RailSeed = {
  id: number;
  stageIndex: number;
  base: THREE.Vector3;
  width: number;
  angle: number;
  phase: number;
};

const stageAnchors = [
  [-1.72, 0.46, 0.04],
  [-0.78, -0.28, -0.12],
  [0.12, 0.32, 0.12],
  [0.98, -0.34, -0.08],
  [1.82, 0.24, 0.08],
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function rng(seed = 2048) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function anchorVector(index: number) {
  const anchor = stageAnchors[clamp(index, 0, stageAnchors.length - 1)] ?? stageAnchors[0];
  return new THREE.Vector3(anchor[0], anchor[1], anchor[2]);
}

function makeCircleGeometry(radius = 1, segments = 360) {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }

  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeArcGeometry(radius = 1, start = 0, length = Math.PI * 1.25, segments = 180) {
  const points: THREE.Vector3[] = [];
  const pairs: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i += 1) {
    const angle = start + (i / segments) * length;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }

  for (let i = 0; i < points.length - 1; i += 1) {
    pairs.push(points[i], points[i + 1]);
  }

  return new THREE.BufferGeometry().setFromPoints(pairs);
}

function makeSegmentedCurveGeometry(points: THREE.Vector3[], segments = 280) {
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.42);
  const sampled = curve.getPoints(segments);
  const pairs: THREE.Vector3[] = [];

  for (let i = 0; i < sampled.length - 1; i += 1) {
    pairs.push(sampled[i], sampled[i + 1]);
  }

  return new THREE.BufferGeometry().setFromPoints(pairs);
}

function makeFieldCurveGeometry(lane = 0, drift = 0, segments = 320) {
  const points = stageAnchors.map((_, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const lateral = Math.sin(index * 1.7 + lane) * 0.08 + drift;
    return anchorVector(index).add(
      new THREE.Vector3(
        Math.sin(index * 0.8 + lane) * 0.04,
        lateral * direction + lane * 0.035,
        (lane - 2) * 0.055
      )
    );
  });

  return makeSegmentedCurveGeometry(points, segments);
}

function makeSpineTube(offsetY = 0, offsetZ = 0, radius = 0.004) {
  const points = stageAnchors.map((_, index) => anchorVector(index).add(new THREE.Vector3(0, offsetY, offsetZ)));
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.42);
  return new THREE.TubeGeometry(curve, 280, radius, 8, false);
}

function makeSegmentTube(index: number, radius = 0.008, lift = 0) {
  const a = anchorVector(index);
  const b = anchorVector(clamp(index + 1, 0, stageAnchors.length - 1));
  const lane = index % 3;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= 24; i += 1) {
    const t = i / 24;
    points.push(curvePoint(a, b, t, lane).add(new THREE.Vector3(0, lift, 0.06)));
  }

  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.36);
  return new THREE.TubeGeometry(curve, 160, radius, 10, false);
}

function makeNodeSeeds(stageCount: number) {
  const random = rng(9117);
  const seeds: NodeSeed[] = [];

  for (let i = 0; i < stageCount; i += 1) {
    seeds.push({
      id: seeds.length,
      stageIndex: i,
      base: anchorVector(i),
      radius: 0.052,
      phase: random() * Math.PI * 2,
      drift: new THREE.Vector3(0.016 + random() * 0.012, 0.018 + random() * 0.012, 0.014 + random() * 0.012),
      role: "stage",
    });
  }

  for (let i = 0; i < 14; i += 1) {
    const stageIndex = i % stageCount;
    const anchor = anchorVector(stageIndex);
    const angle = random() * Math.PI * 2;
    const spread = 0.16 + random() * 0.28;
    const vertical = (random() - 0.5) * 0.22;
    const depth = (random() - 0.5) * 0.18;

    seeds.push({
      id: seeds.length,
      stageIndex,
      base: anchor.add(new THREE.Vector3(Math.cos(angle) * spread, Math.sin(angle) * spread * 0.38 + vertical, depth)),
      radius: i % 7 === 0 ? 0.025 + random() * 0.011 : 0.012 + random() * 0.009,
      phase: random() * Math.PI * 2,
      drift: new THREE.Vector3(0.025 + random() * 0.055, 0.02 + random() * 0.045, 0.018 + random() * 0.035),
      role: "satellite",
    });
  }

  for (let i = 0; i < stageCount - 1; i += 1) {
    const midpoint = anchorVector(i)
      .lerp(anchorVector(i + 1), 0.5)
      .add(new THREE.Vector3(0, i % 2 === 0 ? 0.15 : -0.11, i % 2 === 0 ? 0.14 : -0.12));

    seeds.push({
      id: seeds.length,
      stageIndex: i,
      base: midpoint,
      radius: 0.017,
      phase: random() * Math.PI * 2,
      drift: new THREE.Vector3(0.016, 0.018, 0.014),
      role: "relay",
    });
  }

  return seeds;
}

function makeLinks(nodes: NodeSeed[], stageCount: number) {
  const links: LinkSeed[] = [];

  for (let i = 0; i < stageCount - 1; i += 1) {
    links.push({ a: i, b: i + 1, strength: 1 });
  }

  nodes.forEach((node, index) => {
    if (node.role === "satellite") {
      links.push({ a: index, b: node.stageIndex, strength: 0.42 });
    }

    if (node.role === "relay") {
      links.push({ a: index, b: node.stageIndex, strength: 0.28 });
      links.push({ a: index, b: node.stageIndex + 1, strength: 0.28 });
    }
  });

  for (let i = stageCount; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (nodes[i].stageIndex !== nodes[j].stageIndex) continue;
      if (nodes[i].role === "relay" || nodes[j].role === "relay") continue;
      if (nodes[i].base.distanceTo(nodes[j].base) < 0.42) {
        links.push({ a: i, b: j, strength: 0.12 });
      }
    }
  }

  return links;
}

function curvePoint(a: THREE.Vector3, b: THREE.Vector3, t: number, lane: number) {
  const middle = a.clone().lerp(b, 0.5);
  const lift = lane === 0 ? 0.22 : lane === 1 ? -0.16 : 0.05;
  const depth = lane === 0 ? 0.24 : lane === 1 ? -0.22 : 0.1;
  const control = middle.add(new THREE.Vector3(0, lift, depth));
  const inverse = 1 - t;

  return a
    .clone()
    .multiplyScalar(inverse * inverse)
    .add(control.multiplyScalar(2 * inverse * t))
    .add(b.clone().multiplyScalar(t * t));
}

function makeFlows(count = 24) {
  const random = rng(12231);

  return Array.from({ length: count }, (_, id): FlowSeed => ({
    id,
    lane: Math.floor(random() * 3),
    phase: random(),
    speed: 0.085 + random() * 0.17,
    scale: 0.28 + random() * 0.46,
  }));
}

function makeMicroTicks(stageCount: number) {
  const random = rng(3772);
  const ticks: TickSeed[] = [];

  for (let i = 0; i < 34; i += 1) {
    const segment = Math.floor(random() * Math.max(1, stageCount - 1));
    const lane = Math.floor(random() * 3);
    const t = 0.08 + random() * 0.84;
    const a = anchorVector(segment);
    const b = anchorVector(clamp(segment + 1, 0, stageCount - 1));
    const point = curvePoint(a, b, t, lane).add(
      new THREE.Vector3((random() - 0.5) * 0.08, (random() - 0.5) * 0.12, (random() - 0.5) * 0.08)
    );
    const next = curvePoint(a, b, clamp(t + 0.018, 0, 1), lane);
    const tangent = next.sub(point);

    ticks.push({
      id: i,
      stageIndex: clamp(Math.round(segment + t), 0, stageCount - 1),
      base: point,
      angle: Math.atan2(tangent.y, tangent.x),
      length: 0.06 + random() * 0.13,
      phase: random() * Math.PI * 2,
    });
  }

  return ticks;
}

function makeSignalRails(stageCount: number) {
  const random = rng(88421);
  const rails: RailSeed[] = [];

  for (let stageIndex = 0; stageIndex < stageCount; stageIndex += 1) {
    const anchor = anchorVector(stageIndex);

    for (let i = 0; i < 3; i += 1) {
      const direction = i % 2 === 0 ? 1 : -1;
      rails.push({
        id: rails.length,
        stageIndex,
        base: anchor.clone().add(
          new THREE.Vector3(
            (random() - 0.5) * 0.5,
            -0.2 + random() * 0.38,
            (random() - 0.5) * 0.22
          )
        ),
        width: 0.1 + random() * 0.18,
        angle: -0.34 + direction * (0.18 + random() * 0.32),
        phase: random() * Math.PI * 2,
      });
    }
  }

  return rails;
}

function terminalLine(stage: DeliveryEngineStage) {
  return `${stage.label} // ${stage.output}`;
}

function TerminalStageLabel({
  stage,
  active,
  variant,
}: {
  stage: DeliveryEngineStage;
  active: boolean;
  variant: "panel" | "immersive";
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const fullText = terminalLine(stage);
  const [typed, setTyped] = useState(active || reducedMotion ? fullText : "");

  useEffect(() => {
    if (!active) {
      setTyped("");
      return;
    }

    if (reducedMotion) {
      setTyped(fullText);
      return;
    }

    let index = 0;
    setTyped("");
    const interval = window.setInterval(() => {
      index += 2;
      setTyped(fullText.slice(0, index));
      if (index >= fullText.length) window.clearInterval(interval);
    }, 14);

    return () => window.clearInterval(interval);
  }, [active, fullText, reducedMotion]);

  return (
    <div
      className={`pointer-events-none select-none font-mono uppercase ${
        variant === "immersive" ? "w-[22rem]" : "w-[15.5rem]"
      } ${active ? "opacity-100" : "opacity-70"}`}
    >
      <div
        className={`grid grid-cols-[auto_1fr] items-center gap-2 text-[9px] tracking-[0.18em] ${
          active ? "text-neutral-950" : "text-neutral-400"
        }`}
      >
        <span>{stage.label}</span>
        <span className={`h-px ${active ? "bg-neutral-950/42" : "bg-neutral-950/12"}`} />
      </div>
      <div
        className={`mt-2 border-l px-2 py-1.5 ${
          active
            ? "border-neutral-950/60 bg-white/76 text-neutral-950 shadow-[0_18px_52px_rgba(20,18,14,0.12)]"
            : "border-neutral-950/12 bg-white/28 text-neutral-400"
        }`}
      >
        <div className="mb-2 grid grid-cols-[1fr_auto] items-center gap-3 border-b border-neutral-950/10 pb-1.5">
          <div className={`${variant === "immersive" ? "text-[10px]" : "text-[8px]"} leading-4 tracking-[0.1em]`}>
            {active ? typed : stage.title}
            {active ? <span className="ml-1 inline-block h-3 w-[0.35rem] translate-y-0.5 bg-neutral-950/80" /> : null}
          </div>
          <div className={`${active ? "text-neutral-950" : "text-neutral-400"} text-[8px] tracking-[0.18em]`}>
            {active ? "LIVE" : "IDLE"}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <span
              key={index}
              className={`h-[3px] ${active && index <= Number(stage.label) - 1 ? "bg-neutral-950/70" : "bg-neutral-950/10"}`}
            />
          ))}
        </div>
        <div className={`${variant === "immersive" ? "mt-2 text-[9px]" : "mt-1.5 text-[7px]"} leading-3 tracking-[0.16em] text-neutral-400`}>
          signal lock / stage {stage.label} / output channel
        </div>
        {active ? (
          <div
            className={`mt-2 border-t border-neutral-950/10 pt-2 normal-case ${
              variant === "immersive" ? "text-[11px] leading-5" : "text-[9px] leading-4"
            } tracking-[0] text-neutral-600`}
          >
            {stage.text}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SignalStack({
  stages,
  activeStage,
}: {
  stages: DeliveryEngineStage[];
  activeStage: number;
}) {
  const current = stages[activeStage] ?? stages[0];
  const activeProgress = (activeStage + 1) / Math.max(1, stages.length);
  const signalRows = [
    ["stage lock", current.label],
    ["route channel", `${Math.round(activeProgress * 100)}%`],
    ["motion pulse", activeStage % 2 === 0 ? "high" : "live"],
    ["output sync", "armed"],
  ] as const;

  return (
    <div className="pointer-events-none absolute right-5 top-[7.5rem] z-20 hidden w-[18rem] border-y border-neutral-950/10 py-4 text-right lg:block">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="h-px bg-neutral-950/18" />
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">Signal Stack</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 border-y border-neutral-950/10 py-3"
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            {current.label} / active stage
          </div>
          <div className="mt-2 text-[20px] leading-none tracking-[-0.035em] text-neutral-950">{current.title}</div>
          <div className="mt-3 font-mono text-[9px] uppercase leading-4 tracking-[0.12em] text-neutral-500">
            {current.output}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 grid gap-3">
        {stages.map((stage, index) => {
          const active = index === activeStage;
          const complete = index < activeStage;

          return (
            <div key={stage.title} className="grid grid-cols-[1fr_2.2rem] items-center gap-3">
              <div className="grid gap-1">
                <div className="relative h-px overflow-hidden bg-neutral-950/10">
                  <motion.div
                    className="absolute inset-y-0 right-0 bg-neutral-950"
                    initial={false}
                    animate={{
                      opacity: active ? 0.92 : complete ? 0.34 : 0.12,
                      width: active ? "100%" : complete ? "64%" : "18%",
                    }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <div
                  className={`font-mono text-[8px] uppercase tracking-[0.14em] ${
                    active ? "text-neutral-950" : complete ? "text-neutral-500" : "text-neutral-300"
                  }`}
                >
                  {active ? "live" : complete ? "stored" : "idle"} / {stage.title}
                </div>
              </div>
              <div className={`font-mono text-[9px] uppercase tracking-[0.12em] ${active ? "text-neutral-950" : "text-neutral-300"}`}>
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-2 border-t border-neutral-950/10 pt-4">
        {signalRows.map(([label, value], index) => (
          <div key={label} className="grid grid-cols-[1fr_4.5rem] items-center gap-3">
            <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-400">{label}</div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <motion.div
                className="h-[3px] bg-neutral-950"
                initial={false}
                animate={{
                  opacity: 0.28 + index * 0.13,
                  scaleX: 0.35 + activeProgress * 0.55 + index * 0.03,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "right" }}
              />
              <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-500">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngineScene({
  stages,
  activeStage,
  labelStage = activeStage,
  labelSwitching = false,
  stageCount,
  pointer,
  reducedMotion,
  closing = false,
  variant = "panel",
}: {
  stages: DeliveryEngineStage[];
  activeStage: number;
  labelStage?: number;
  labelSwitching?: boolean;
  stageCount: number;
  pointer: Pointer;
  reducedMotion: boolean;
  closing?: boolean;
  variant?: "panel" | "immersive";
}) {
  const { camera } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const linkRef = useRef<THREE.LineSegments>(null);
  const activeLinkRef = useRef<THREE.LineSegments>(null);
  const pathRefs = useRef<THREE.LineSegments[]>([]);
  const segmentRefs = useRef<THREE.Mesh[]>([]);
  const segmentGlowRefs = useRef<THREE.Mesh[]>([]);
  const tubeRefs = useRef<THREE.Mesh[]>([]);
  const ringRefs = useRef<THREE.LineLoop[]>([]);
  const arcRefs = useRef<THREE.LineSegments[]>([]);
  const lensRefs = useRef<THREE.Mesh[]>([]);
  const scanRefs = useRef<THREE.Mesh[]>([]);
  const tickRefs = useRef<THREE.Mesh[]>([]);
  const railRefs = useRef<THREE.Mesh[]>([]);
  const nodeRefs = useRef<THREE.Group[]>([]);
  const nodeCoreRefs = useRef<THREE.Mesh[]>([]);
  const nodeHaloRefs = useRef<THREE.Mesh[]>([]);
  const flowRefs = useRef<THREE.Mesh[]>([]);
  const flowTrailRefs = useRef<THREE.Mesh[]>([]);
  const activeRef = useRef(activeStage);
  const pointerRef = useRef<Pointer>({ x: 0, y: 0 });
  const currentPositionsRef = useRef<THREE.Vector3[]>([]);
  const nodes = useMemo(() => makeNodeSeeds(stageCount), [stageCount]);
  const links = useMemo(() => makeLinks(nodes, stageCount), [nodes, stageCount]);
  const flows = useMemo(() => makeFlows(), []);
  const ticks = useMemo(() => makeMicroTicks(stageCount), [stageCount]);
  const rails = useMemo(() => makeSignalRails(stageCount), [stageCount]);
  const segmentGeometries = useMemo(
    () =>
      Array.from({ length: stageAnchors.length - 1 }, (_, index) => ({
        core: makeSegmentTube(index, 0.0085, 0),
        glow: makeSegmentTube(index, 0.022, 0),
      })),
    []
  );
  const geometries = useMemo(
    () => ({
      node: new THREE.SphereGeometry(1, 64, 36),
      halo: new THREE.SphereGeometry(1, 64, 32),
      flow: new THREE.SphereGeometry(1, 20, 14),
      flowTrail: new THREE.PlaneGeometry(1, 1),
      tick: new THREE.PlaneGeometry(1, 1),
      rail: new THREE.PlaneGeometry(1, 1),
      scan: new THREE.PlaneGeometry(1, 1),
      lens: new THREE.CircleGeometry(1, 96),
      ringA: makeCircleGeometry(1, 360),
      ringB: makeCircleGeometry(1, 360),
      ringC: makeCircleGeometry(1, 360),
      arcA: makeArcGeometry(1, -0.25, Math.PI * 1.12, 180),
      arcB: makeArcGeometry(1, 1.02, Math.PI * 0.88, 150),
      arcC: makeArcGeometry(1, 2.4, Math.PI * 0.74, 130),
      pathA: makeSegmentedCurveGeometry(stageAnchors.map((_, index) => anchorVector(index)), 360),
      pathActive: makeSegmentedCurveGeometry(stageAnchors.map((_, index) => anchorVector(index).add(new THREE.Vector3(0, -0.008, 0.02))), 360),
      pathB: makeSegmentedCurveGeometry(stageAnchors.map((_, index) => anchorVector(index).add(new THREE.Vector3(0, 0.21, 0.16))), 340),
      pathC: makeSegmentedCurveGeometry(stageAnchors.map((_, index) => anchorVector(index).add(new THREE.Vector3(0, -0.16, -0.13))), 340),
      pathD: makeFieldCurveGeometry(-1, 0.05),
      pathE: makeFieldCurveGeometry(2, -0.03),
      pathF: makeFieldCurveGeometry(4, 0.08),
      tubeA: makeSpineTube(0, 0, 0.006),
      tubeB: makeSpineTube(0.18, 0.13, 0.0026),
      tubeC: makeSpineTube(-0.13, -0.11, 0.0022),
      links: new THREE.BufferGeometry(),
      activeLinks: new THREE.BufferGeometry(),
    }),
    []
  );

  useEffect(() => {
    geometries.links.setAttribute("position", new THREE.BufferAttribute(new Float32Array(links.length * 2 * 3), 3));
    geometries.activeLinks.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nodes.length * 2 * 3), 3));

    return () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
      segmentGeometries.forEach((geometry) => {
        geometry.core.dispose();
        geometry.glow.dispose();
      });
    };
  }, [geometries, links.length, nodes.length, segmentGeometries]);

  useFrame((state, delta) => {
    const immersive = variant === "immersive";
    const targetActive = reducedMotion ? 0 : activeStage;
    activeRef.current = THREE.MathUtils.damp(activeRef.current, targetActive, 4.9, delta);
    pointerRef.current.x = THREE.MathUtils.damp(pointerRef.current.x, pointer.x, 4.2, delta);
    pointerRef.current.y = THREE.MathUtils.damp(pointerRef.current.y, pointer.y, 4.2, delta);

    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    const activeFloat = activeRef.current;
    const activeRounded = clamp(Math.round(activeFloat), 0, stageCount - 1);
    const activeAnchor = anchorVector(activeRounded);
    const pulse = Math.sin(time * 1.55) * 0.5 + 0.5;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      immersive ? 0.02 + pointerRef.current.x * 0.12 : activeAnchor.x * 0.16 + pointerRef.current.x * 0.12,
      3.6,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(camera.position.y, activeAnchor.y * 0.045 - pointerRef.current.y * (immersive ? 0.075 : 0.06), 3.6, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, (immersive ? 5.36 : 5.34) - Math.abs(activeAnchor.x) * 0.035, 3.6, delta);
    camera.lookAt(immersive ? 0.06 : activeAnchor.x * 0.06 - 0.12, activeAnchor.y * 0.04 + 0.04, 0);

    if (rootRef.current) {
      rootRef.current.position.y = (immersive ? -0.04 : 0.16) + (closing ? -0.035 : 0);
      rootRef.current.position.x = immersive ? 0.08 : -0.46;
      rootRef.current.rotation.x = -0.1 + pointerRef.current.y * -0.05 + (closing ? -0.035 : 0);
      rootRef.current.rotation.y = pointerRef.current.x * 0.06 + Math.sin(time * 0.2) * 0.024;
      rootRef.current.rotation.z = Math.sin(time * 0.18) * 0.014 + (closing ? -0.012 : 0);
      const closingScale = closing ? 0.94 : 1;
      if (immersive) {
        rootRef.current.scale.setScalar(1.02 * closingScale);
      } else {
        rootRef.current.scale.set(1.14 * closingScale, 1.06 * closingScale, closingScale);
      }
    }

    const positions = currentPositionsRef.current;

    nodes.forEach((node, index) => {
      const focusRange = node.role === "stage" ? 2.6 : node.role === "relay" ? 1.8 : 1.35;
      const focus = 1 - clamp(Math.abs(activeFloat - node.stageIndex) / focusRange);
      const stageFocus = smoothstep(0.08, 0.92, focus);
      const driftScale = reducedMotion ? 0 : node.role === "stage" ? 0.08 : node.role === "relay" ? 0.42 : 1;
      const orbital = new THREE.Vector3(
        Math.sin(time * (0.5 + node.drift.x) + node.phase) * node.drift.x * driftScale,
        Math.cos(time * (0.44 + node.drift.y) + node.phase * 1.24) * node.drift.y * driftScale,
        Math.sin(time * (0.38 + node.drift.z) + node.phase * 0.8) * node.drift.z * driftScale
      );
      const convergence = anchorVector(node.stageIndex).sub(node.base).multiplyScalar(node.role === "satellite" ? stageFocus * 0.18 : 0);
      const target = node.base.clone().add(orbital).add(convergence);
      const group = nodeRefs.current[index];

      if (!positions[index]) positions[index] = target.clone();
      positions[index].lerp(target, 1 - Math.pow(0.0007, delta));

      if (group) {
        group.position.copy(positions[index]);
        group.scale.setScalar(node.radius * (1 + stageFocus * (node.role === "stage" ? 1.28 : node.role === "relay" ? 0.44 : 0.58)));
      }

      const coreMaterial = nodeCoreRefs.current[index]?.material;
      const haloMaterial = nodeHaloRefs.current[index]?.material;

      if (coreMaterial instanceof THREE.MeshBasicMaterial) {
        const strength = immersive ? 1.16 : 1;
        coreMaterial.opacity = (node.role === "stage" ? 0.28 + stageFocus * 0.5 : node.role === "relay" ? 0.08 + stageFocus * 0.22 : 0.04 + stageFocus * 0.28) * strength;
        coreMaterial.color.set(node.role === "stage" || stageFocus > 0.54 ? "#070707" : "#424242");
      }

      if (haloMaterial instanceof THREE.MeshBasicMaterial) {
        haloMaterial.opacity = (node.role === "stage" ? 0.008 + stageFocus * 0.032 : node.role === "relay" ? 0.006 + stageFocus * 0.018 : 0.003 + stageFocus * 0.016) * (immersive ? 1.18 : 0.9);
      }
    });

    const linkPositions = geometries.links.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (linkPositions) {
      links.forEach((link, index) => {
        const a = positions[link.a] ?? nodes[link.a].base;
        const b = positions[link.b] ?? nodes[link.b].base;
        const focus = 1 - clamp(Math.min(Math.abs(activeFloat - nodes[link.a].stageIndex), Math.abs(activeFloat - nodes[link.b].stageIndex)) / 2.1);
        const bow = Math.sin(time * 0.52 + index) * 0.011 * link.strength * focus;
        const base = index * 2;

        linkPositions.setXYZ(base, a.x, a.y + bow, a.z + bow * 0.5);
        linkPositions.setXYZ(base + 1, b.x, b.y - bow, b.z - bow * 0.5);
      });
      linkPositions.needsUpdate = true;
    }

    const activeLinkPositions = geometries.activeLinks.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (activeLinkPositions) {
      nodes.forEach((node, index) => {
        const position = positions[index] ?? node.base;
        const focus = smoothstep(0.12, 0.96, 1 - clamp(Math.abs(activeFloat - node.stageIndex) / 1.55));
        const lineActive = node.role !== "stage" && focus > 0.05;
        const base = index * 2;
        const start = activeAnchor.clone().lerp(position, lineActive ? 0.08 : 0);
        const end = lineActive ? position.clone().lerp(activeAnchor, 0.12 + (1 - focus) * 0.34) : activeAnchor;

        activeLinkPositions.setXYZ(base, start.x, start.y, start.z);
        activeLinkPositions.setXYZ(base + 1, end.x, end.y, end.z);
      });
      activeLinkPositions.needsUpdate = true;
    }

    const linkMaterial = linkRef.current?.material;
    if (linkMaterial instanceof THREE.LineBasicMaterial) {
      linkMaterial.opacity = (0.042 + pulse * 0.012) * (immersive ? 1.2 : 0.9);
    }

    const activeLinkMaterial = activeLinkRef.current?.material;
    if (activeLinkMaterial instanceof THREE.LineBasicMaterial) {
      activeLinkMaterial.opacity = (0.038 + pulse * 0.02) * (immersive ? 1.35 : 1);
    }

    pathRefs.current.forEach((line, index) => {
      line.position.x = pointerRef.current.x * (0.012 + index * 0.006);
      line.position.y = pointerRef.current.y * (-0.01 + index * 0.004);
      line.rotation.z = Math.sin(time * 0.16 + index * 0.72) * 0.004;

      const material = line.material;
      if (material instanceof THREE.LineBasicMaterial) {
        material.opacity = (index <= 1 ? 0.1 + pulse * 0.024 : 0.012 + pulse * 0.005) * (immersive ? 1.08 : 0.82);
      }
    });

    tubeRefs.current.forEach((tube, index) => {
      tube.rotation.z = Math.sin(time * 0.22 + index) * 0.005;

      const material = tube.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = (index === 0 ? 0.2 + pulse * 0.036 : 0.034 + pulse * 0.014) * (immersive ? 1.12 : 0.9);
      }
    });

    segmentGeometries.forEach((_, index) => {
      const core = segmentRefs.current[index];
      const glow = segmentGlowRefs.current[index];
      const segmentFocus = smoothstep(0.05, 0.92, 1 - clamp(Math.abs(activeFloat - index - 0.42) / 1.12));
      const adjacentFocus = smoothstep(0.05, 0.92, 1 - clamp(Math.abs(activeFloat - index - 1.0) / 1.35));
      const activeSignal = Math.max(segmentFocus, adjacentFocus * 0.62);
      const breathing = Math.sin(time * 1.15 + index * 0.8) * 0.5 + 0.5;

      if (core) {
        core.scale.setScalar(1 + activeSignal * 0.024);
        const material = core.material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = (0.055 + activeSignal * 0.42 + breathing * 0.028 * activeSignal) * (immersive ? 1.26 : 1);
        }
      }

      if (glow) {
        glow.scale.setScalar(1 + activeSignal * 0.036);
        const material = glow.material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = (0.008 + activeSignal * 0.054 + breathing * 0.012 * activeSignal) * (immersive ? 1.18 : 0.9);
        }
      }
    });

    ringRefs.current.forEach((ring, index) => {
      ring.position.copy(activeAnchor);
      ring.rotation.x = 0.86 + index * 0.46 + time * (0.08 + index * 0.012);
      ring.rotation.y = -0.28 + index * 0.32 + time * (0.045 + index * 0.018);
      ring.rotation.z = time * (0.055 + index * 0.012);
      ring.scale.setScalar(0.34 + index * 0.14 + pulse * 0.018);

      const material = ring.material;
      if (material instanceof THREE.LineBasicMaterial) {
        material.opacity = (0.06 - index * 0.012 + pulse * 0.01) * (immersive ? 1.15 : 0.72);
      }
    });

    arcRefs.current.forEach((arc, index) => {
      arc.position.copy(activeAnchor);
      arc.rotation.x = 0.76 + index * 0.34 + time * (0.05 + index * 0.008);
      arc.rotation.y = -0.2 + index * 0.26 + pointerRef.current.x * 0.12;
      arc.rotation.z = time * (0.08 + index * 0.022) + index * 0.7;
      arc.scale.setScalar(0.58 + index * 0.22 + pulse * 0.02);

      const material = arc.material;
      if (material instanceof THREE.LineBasicMaterial) {
        material.opacity = (0.075 - index * 0.018 + pulse * 0.012) * (immersive ? 1.18 : 0.78);
      }
    });

    lensRefs.current.forEach((lens, index) => {
      lens.position.copy(activeAnchor);
      lens.position.z -= 0.18 + index * 0.032;
      lens.rotation.x = 0.22 + index * 0.34;
      lens.rotation.y = -0.16 + pointerRef.current.x * 0.05;
      lens.rotation.z = time * (0.018 + index * 0.01);
      lens.scale.setScalar(0.48 + index * 0.14 + pulse * 0.018);

      const material = lens.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = (0.006 - index * 0.0008 + pulse * 0.002) * (immersive ? 1.35 : 0.9);
      }
    });

    scanRefs.current.forEach((scan, index) => {
      scan.position.copy(activeAnchor);
      scan.position.x += (index - 1) * 0.1;
      scan.position.y += Math.sin(time * 0.34 + index) * 0.035;
      scan.position.z = -0.13 - index * 0.03;
      scan.rotation.z = -0.28 + index * 0.11;
      scan.scale.set(1.0 + index * 0.24 + pulse * 0.05, 0.028, 1);

      const material = scan.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = (0.025 - index * 0.005 + pulse * 0.008) * (immersive ? 1.15 : 0.8);
      }
    });

    ticks.forEach((tick, index) => {
      const mesh = tickRefs.current[index];
      if (!mesh) return;

      const focus = smoothstep(0.1, 0.95, 1 - clamp(Math.abs(activeFloat - tick.stageIndex) / 2));
      const shimmer = Math.sin(time * 1.4 + tick.phase) * 0.5 + 0.5;

      mesh.position.copy(tick.base);
      mesh.position.x += pointerRef.current.x * 0.018 * focus;
      mesh.position.y += Math.sin(time * 0.33 + tick.phase) * 0.012 * focus;
      mesh.rotation.z = tick.angle + Math.sin(time * 0.22 + tick.phase) * 0.018;
      mesh.scale.set(tick.length * (0.7 + focus * 0.82), 0.006 + focus * 0.005, 1);

      const material = mesh.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = (0.008 + focus * 0.032 + shimmer * 0.008 * focus) * (immersive ? 1 : 0.72);
      }
    });

    rails.forEach((rail, index) => {
      const mesh = railRefs.current[index];
      if (!mesh) return;

      const focus = smoothstep(0.08, 0.92, 1 - clamp(Math.abs(activeFloat - rail.stageIndex) / 1.35));
      const breath = Math.sin(time * 0.9 + rail.phase) * 0.5 + 0.5;

      mesh.position.copy(rail.base);
      mesh.position.z -= 0.05;
      mesh.rotation.z = rail.angle + pointerRef.current.x * 0.025;
      mesh.scale.set(rail.width * (0.78 + focus * 0.54), 0.012 + focus * 0.018 + breath * 0.004, 1);

      const material = mesh.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = (0.006 + focus * 0.028 + breath * 0.006 * focus) * (immersive ? 0.95 : 0.62);
      }
    });

    flows.forEach((flow) => {
      const mesh = flowRefs.current[flow.id];
      const trail = flowTrailRefs.current[flow.id];
      if (!mesh || !trail) return;

      const direction = flow.id % 2 === 0 ? 1 : -1;
      const fromIndex = clamp(activeRounded + (direction < 0 ? -1 : 0), 0, stageCount - 1);
      const toIndex = clamp(fromIndex + 1, 0, stageCount - 1);
      const t = reducedMotion ? flow.phase : (flow.phase + time * flow.speed) % 1;
      const point = curvePoint(anchorVector(fromIndex), anchorVector(toIndex), t, flow.lane);
      const next = curvePoint(anchorVector(fromIndex), anchorVector(toIndex), clamp(t + 0.018, 0, 1), flow.lane);
      const tangent = next.sub(point);
      const edgeFade = smoothstep(0, 0.18, t) * (1 - smoothstep(0.78, 1, t));

      mesh.position.copy(point);
      mesh.scale.setScalar(0.011 * flow.scale * (1 + edgeFade * 1.8));
      trail.position.copy(point);
      trail.position.z -= 0.01;
      trail.rotation.z = Math.atan2(tangent.y, tangent.x);
      trail.scale.set(0.11 * flow.scale * (0.7 + edgeFade * 1.2), 0.007 * flow.scale * (1 + edgeFade), 1);

      const material = mesh.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = edgeFade * ((immersive ? 0.12 : 0.1) + (immersive ? 0.2 : 0.16) * (1 - Math.abs(activeFloat - activeRounded)));
      }

      const trailMaterial = trail.material;
      if (trailMaterial instanceof THREE.MeshBasicMaterial) {
        trailMaterial.opacity = edgeFade * (immersive ? 0.13 : 0.09);
      }
    });
  });

  return (
    <>
      <fog attach="fog" args={["#f8f6f0", 5.8, 9.4]} />
      <group ref={rootRef}>
        {segmentGeometries.map((geometry, index) => (
          <group key={`delivery-active-segment-${index}`}>
            <mesh
              ref={(mesh: THREE.Mesh | null) => {
                if (mesh) segmentGlowRefs.current[index] = mesh;
              }}
              geometry={geometry.glow}
            >
              <meshBasicMaterial color="#111111" transparent opacity={0.02} depthWrite={false} />
            </mesh>
            <mesh
              ref={(mesh: THREE.Mesh | null) => {
                if (mesh) segmentRefs.current[index] = mesh;
              }}
              geometry={geometry.core}
            >
              <meshBasicMaterial color="#050505" transparent opacity={0.06} depthWrite={false} />
            </mesh>
          </group>
        ))}

        {[geometries.tubeA, geometries.tubeB, geometries.tubeC].map((geometry, index) => (
          <mesh
            key={`delivery-spine-tube-${index}`}
            ref={(mesh: THREE.Mesh | null) => {
              if (mesh) tubeRefs.current[index] = mesh;
            }}
            geometry={geometry}
          >
            <meshBasicMaterial color="#111111" transparent opacity={index === 0 ? 0.28 : 0.05} depthWrite={false} />
          </mesh>
        ))}

        {[geometries.pathA, geometries.pathActive, geometries.pathB, geometries.pathC, geometries.pathD, geometries.pathE, geometries.pathF].map((geometry, index) => (
          <lineSegments
            key={`delivery-path-${index}`}
            ref={(line: THREE.LineSegments | null) => {
              if (line) pathRefs.current[index] = line;
            }}
            geometry={geometry}
          >
            <lineBasicMaterial color="#111111" transparent opacity={index <= 1 ? 0.2 : 0.04} depthWrite={false} />
          </lineSegments>
        ))}

        <lineSegments ref={linkRef} geometry={geometries.links}>
          <lineBasicMaterial color="#151515" transparent opacity={0.045} depthWrite={false} />
        </lineSegments>

        <lineSegments ref={activeLinkRef} geometry={geometries.activeLinks}>
          <lineBasicMaterial color="#090909" transparent opacity={0.04} depthWrite={false} />
        </lineSegments>

        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={`delivery-lens-${index}`}
            ref={(mesh: THREE.Mesh | null) => {
              if (mesh) lensRefs.current[index] = mesh;
            }}
            geometry={geometries.lens}
          >
            <meshBasicMaterial color="#111111" transparent opacity={0.004} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {[geometries.ringA, geometries.ringB, geometries.ringC].map((geometry, index) => (
          <lineLoop
            key={`delivery-focus-ring-${index}`}
            ref={(ring: THREE.LineLoop | null) => {
              if (ring) ringRefs.current[index] = ring;
            }}
            geometry={geometry}
          >
            <lineBasicMaterial color="#111111" transparent opacity={0.075} depthWrite={false} />
          </lineLoop>
        ))}

        {[geometries.arcA, geometries.arcB, geometries.arcC].map((geometry, index) => (
          <lineSegments
            key={`delivery-focus-arc-${index}`}
            ref={(line: THREE.LineSegments | null) => {
              if (line) arcRefs.current[index] = line;
            }}
            geometry={geometry}
          >
            <lineBasicMaterial color="#070707" transparent opacity={0.07} depthWrite={false} />
          </lineSegments>
        ))}

        {[0, 1, 2].map((index) => (
          <mesh
            key={`delivery-scan-${index}`}
            ref={(mesh: THREE.Mesh | null) => {
              if (mesh) scanRefs.current[index] = mesh;
            }}
            geometry={geometries.scan}
          >
            <meshBasicMaterial color="#111111" transparent opacity={0.032} depthWrite={false} />
          </mesh>
        ))}

        {ticks.map((tick, index) => (
          <mesh
            key={`delivery-tick-${tick.id}`}
            ref={(mesh: THREE.Mesh | null) => {
              if (mesh) tickRefs.current[index] = mesh;
            }}
            geometry={geometries.tick}
          >
            <meshBasicMaterial color="#111111" transparent opacity={0.024} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {rails.map((rail, index) => (
          <mesh
            key={`delivery-rail-${rail.id}`}
            ref={(mesh: THREE.Mesh | null) => {
              if (mesh) railRefs.current[index] = mesh;
            }}
            geometry={geometries.rail}
          >
            <meshBasicMaterial color="#111111" transparent opacity={0.014} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {nodes.map((node, index) => (
          <group
            key={node.id}
            ref={(group: THREE.Group | null) => {
              if (group) nodeRefs.current[index] = group;
            }}
          >
            <mesh
              ref={(mesh: THREE.Mesh | null) => {
                if (mesh) nodeHaloRefs.current[index] = mesh;
              }}
              geometry={geometries.halo}
              scale={node.role === "stage" ? 1.55 : node.role === "relay" ? 1.18 : 1.36}
            >
              <meshBasicMaterial color="#111111" transparent opacity={0.012} depthWrite={false} />
            </mesh>
            <mesh
              ref={(mesh: THREE.Mesh | null) => {
                if (mesh) nodeCoreRefs.current[index] = mesh;
              }}
              geometry={geometries.node}
            >
              <meshBasicMaterial color="#111111" transparent opacity={0.14} depthWrite={false} />
            </mesh>
          </group>
        ))}

        {flows.map((flow) => (
          <group key={flow.id}>
            <mesh
              ref={(mesh: THREE.Mesh | null) => {
                if (mesh) flowTrailRefs.current[flow.id] = mesh;
              }}
              geometry={geometries.flowTrail}
            >
              <meshBasicMaterial color="#111111" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh
              ref={(mesh: THREE.Mesh | null) => {
                if (mesh) flowRefs.current[flow.id] = mesh;
              }}
              geometry={geometries.flow}
            >
              <meshBasicMaterial color="#111111" transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        ))}

        {stages.map((stage, index) => {
          const anchor = anchorVector(index);
          const active = index === labelStage;
          const immersiveLift = index >= 3 ? 0.28 : -0.45;
          const yOffset = variant === "immersive" ? immersiveLift : -0.36;
          const xOffset = index === 0 ? 0.22 : index === stages.length - 1 ? -0.72 : 0;
          const activeVisible = active && !labelSwitching;

          return (
            <Html
              key={`delivery-terminal-label-${stage.title}`}
              position={[anchor.x + xOffset, anchor.y + yOffset, anchor.z + 0.22]}
              center
              distanceFactor={variant === "immersive" ? (index === stages.length - 1 ? 3.55 : 3.85) : 4.45}
              zIndexRange={[18, 0]}
              style={{
                opacity: activeVisible ? 1 : active ? 0.08 : variant === "immersive" ? 0.46 : 0.34,
                filter: active && labelSwitching ? "blur(6px)" : "blur(0px)",
                transform: `translateY(${activeVisible ? 0 : active ? 12 : 8}px) scale(${activeVisible ? 1 : 0.985})`,
                transition: "opacity 560ms cubic-bezier(0.22,1,0.36,1), transform 560ms cubic-bezier(0.22,1,0.36,1), filter 560ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <TerminalStageLabel stage={stage} active={active} variant={variant} />
            </Html>
          );
        })}
      </group>
    </>
  );
}

export default function OfferDeliveryModelEngine({
  stages,
  activeStage,
}: {
  stages: DeliveryEngineStage[];
  activeStage: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 });
  const [readoutStage, setReadoutStage] = useState(activeStage);
  const [labelSwitching, setLabelSwitching] = useState(false);
  const readoutStageRef = useRef(activeStage);
  const switchTimersRef = useRef<number[]>([]);

  const clearSwitchTimers = useCallback(() => {
    switchTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    switchTimersRef.current = [];
  }, []);

  useEffect(() => {
    if (activeStage === readoutStageRef.current) return;

    clearSwitchTimers();
    switchTimersRef.current = [
      window.setTimeout(() => setLabelSwitching(true), reducedMotion ? 0 : 20),
      window.setTimeout(
        () => {
          readoutStageRef.current = activeStage;
          setReadoutStage(activeStage);
          switchTimersRef.current.push(
            window.setTimeout(() => {
              setLabelSwitching(false);
              switchTimersRef.current = [];
            }, reducedMotion ? 0 : 420)
          );
        },
        reducedMotion ? 0 : 240
      ),
    ];
  }, [activeStage, clearSwitchTimers, reducedMotion]);

  useEffect(() => clearSwitchTimers, [clearSwitchTimers]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
        });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_46%_42%,rgba(255,255,255,0.92),rgba(255,255,255,0.64)_31%,rgba(244,241,234,0.24)_66%,rgba(255,255,255,0.18)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/48 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/42 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute inset-x-[3%] top-[16%] h-px bg-neutral-950/[0.055]" />
      <div className="pointer-events-none absolute inset-x-[8%] bottom-[22%] h-px bg-neutral-950/[0.035]" />
      <div className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 h-px bg-neutral-950/[0.045]" />
      <div className="pointer-events-none absolute left-[22%] top-[17%] h-[24rem] w-[24rem] rounded-full border border-neutral-950/[0.025]" />
      <div className="pointer-events-none absolute right-[12%] bottom-[9%] h-[20rem] w-[20rem] rounded-full border border-neutral-950/[0.02]" />

      <Canvas
        camera={{ position: [0, 0, 5.78], fov: 33, near: 0.1, far: 100 }}
        dpr={[1.5, 2.4]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <EngineScene
          stages={stages}
          activeStage={activeStage}
          labelStage={readoutStage}
          labelSwitching={labelSwitching}
          stageCount={stages.length}
          pointer={pointer}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-5 left-4 right-4 z-10 hidden justify-end sm:flex">
        <div className="grid min-w-[18rem] grid-cols-5 gap-2">
          {stages.map((stage, index) => (
            <div key={stage.title} className="grid gap-2">
              <div className={`h-px ${index === readoutStage ? "bg-neutral-950" : "bg-neutral-950/12"}`} />
              <div className={`font-mono text-[9px] uppercase tracking-[0.14em] ${index === readoutStage ? "text-neutral-950" : "text-neutral-300"}`}>
                {stage.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OfferDeliveryInterfaceOverlay({
  stages,
  activeStage,
  setActiveStage,
  onClose,
}: {
  stages: DeliveryEngineStage[];
  activeStage: number;
  setActiveStage: (index: number) => void;
  onClose: () => void;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 });
  const [closing, setClosing] = useState(false);
  const [readoutStage, setReadoutStage] = useState(activeStage);
  const [switching, setSwitching] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const switchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeStage === readoutStage) return;

    if (switchTimerRef.current !== null) window.clearTimeout(switchTimerRef.current);
    setSwitching(true);
    switchTimerRef.current = window.setTimeout(
      () => {
        setReadoutStage(activeStage);
        switchTimerRef.current = window.setTimeout(
          () => {
            setSwitching(false);
            switchTimerRef.current = null;
          },
          reducedMotion ? 0 : 320
        );
      },
      reducedMotion ? 0 : 180
    );
  }, [activeStage, readoutStage, reducedMotion]);

  const requestStage = useCallback(
    (index: number) => {
      if (closing || index === activeStage) return;
      setActiveStage(index);
    },
    [activeStage, closing, setActiveStage]
  );

  const beginClose = useCallback(() => {
    if (closing) return;

    setClosing(true);

    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(
      () => {
        closeTimerRef.current = null;
        onClose();
      },
      reducedMotion ? 0 : 860
    );
  }, [closing, onClose, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") beginClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [beginClose]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (switchTimerRef.current !== null) window.clearTimeout(switchTimerRef.current);
    },
    []
  );

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-[#f2eee6] text-neutral-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0.98 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: closing ? 0.7 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Delivery model interface"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden border border-neutral-950/10 bg-[#f6f2ea]"
        initial={{ clipPath: "inset(46% 8% 46% 8%)", scale: 0.96 }}
        animate={{
          clipPath: closing ? "inset(7% 9% 7% 9%)" : "inset(0% 0% 0% 0%)",
          scale: closing ? 0.982 : 1,
          filter: closing ? "blur(1.2px)" : "blur(0px)",
        }}
        exit={{ clipPath: "inset(46% 8% 46% 8%)", scale: 0.96 }}
        transition={{ duration: closing ? 0.78 : 0.78, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.99),rgba(246,242,234,0.86)_35%,rgba(222,216,206,0.56)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.34),transparent_24%,transparent_72%,rgba(0,0,0,0.035))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="pointer-events-none absolute inset-x-8 top-[18vh] h-px bg-neutral-950/[0.05]" />
        <div className="pointer-events-none absolute inset-x-8 bottom-[27vh] h-px bg-neutral-950/[0.045]" />
        <div className="pointer-events-none absolute left-[calc(50%-1px)] top-20 bottom-24 w-px bg-neutral-950/[0.025]" />
        <div className="pointer-events-none absolute left-[8vw] top-[10vh] h-[36rem] w-[36rem] rounded-full border border-neutral-950/[0.045]" />
        <div className="pointer-events-none absolute right-[8vw] bottom-[8vh] h-[28rem] w-[28rem] rounded-full border border-neutral-950/[0.04]" />
        <div className="pointer-events-none absolute left-[34vw] top-[27vh] h-[22rem] w-[22rem] rounded-full border border-neutral-950/[0.026]" />

        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: closing ? 0.44 : 1,
            scale: closing ? 0.985 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setPointer({
              x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
              y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
            });
          }}
          onPointerLeave={() => setPointer({ x: 0, y: 0 })}
        >
          <Canvas
            camera={{ position: [0, 0, 4.72], fov: 31, near: 0.1, far: 100 }}
            dpr={[1.5, 2.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <EngineScene
              stages={stages}
              activeStage={activeStage}
              labelStage={readoutStage}
              labelSwitching={switching}
              stageCount={stages.length}
              pointer={pointer}
              reducedMotion={reducedMotion}
              closing={closing}
              variant="immersive"
            />
          </Canvas>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          <motion.div
            className="absolute left-8 right-8 top-1/2 h-px bg-neutral-950/28"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: closing ? 1 : 0, opacity: closing ? 1 : 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center" }}
          />
          <motion.div
            className="absolute bottom-8 left-8 right-8 h-px bg-neutral-950/18"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: closing ? 1 : 0, opacity: closing ? 1 : 0 }}
            transition={{ duration: 0.5, delay: closing ? 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "right" }}
          />
          <motion.div
            className="absolute left-8 right-8 top-8 h-px bg-neutral-950/18"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: closing ? 1 : 0, opacity: closing ? 1 : 0 }}
            transition={{ duration: 0.5, delay: closing ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#f4f0e8]/78"
            initial={{ y: "-100%" }}
            animate={{ y: closing ? "0%" : "-100%" }}
            transition={{ duration: 0.72, delay: closing ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#f4f0e8]/78"
            initial={{ y: "100%" }}
            animate={{ y: closing ? "0%" : "100%" }}
            transition={{ duration: 0.72, delay: closing ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute left-1/2 top-8 bottom-8 w-px bg-neutral-950/18"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: closing ? 1 : 0, opacity: closing ? 1 : 0 }}
            transition={{ duration: 0.52, delay: closing ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center" }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex min-h-12 items-center justify-end border-b border-neutral-950/10 pb-3 sm:inset-x-8">
          <button
            type="button"
            onClick={beginClose}
            disabled={closing}
            className="pointer-events-auto inline-flex min-h-10 items-center rounded-full border border-neutral-950/14 bg-white/72 px-4 text-[10px] uppercase tracking-[0.16em] text-neutral-700 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white disabled:cursor-default disabled:border-neutral-950/20 disabled:bg-neutral-950 disabled:text-white"
          >
            {closing ? "Closing" : "Close"}
          </button>
        </div>

        <motion.div
          animate={{ opacity: switching ? 0.72 : 1, y: switching ? 4 : 0 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          <SignalStack stages={stages} activeStage={readoutStage} />
        </motion.div>

        <div className="absolute bottom-5 left-5 right-5 z-20 grid gap-4 border-t border-neutral-950/10 pt-4 sm:left-8 sm:right-8 lg:justify-end">
          <div className="grid gap-2 sm:grid-cols-5 lg:min-w-[46rem]">
            {stages.map((stage, index) => {
              const active = index === readoutStage;

              return (
                <button
                  key={stage.title}
                  type="button"
                  onFocus={() => requestStage(index)}
                  onClick={() => requestStage(index)}
                  className={`pointer-events-auto grid min-h-16 gap-2 border px-3 py-3 text-left transition ${
                    active
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-950/12 bg-white/48 text-neutral-600 hover:border-neutral-950/36 hover:bg-white/78 hover:text-neutral-950"
                  }`}
                >
                  <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${active ? "text-white/50" : "text-neutral-300"}`}>
                    {stage.label}
                  </span>
                  <span className="text-[13px] leading-4">{stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
