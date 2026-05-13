import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Plane = "xy" | "yz" | "xz";

type FragmentKind = "shellStrong" | "shellSoft" | "cagePrimary" | "cageSecondary" | "core";

type Fragment = {
  id: string;
  geometry: THREE.BufferGeometry;
  mode: "loop" | "segments" | "mesh";
  kind: FragmentKind;
  baseOpacity: number;
  basePosition: THREE.Vector3;
  baseRotation: THREE.Euler;
  burst: THREE.Vector3;
  composition: THREE.Vector3;
  spin: THREE.Vector3;
  releaseOnly?: boolean;
};

type Pointer = {
  x: number;
  y: number;
};

const fragmentColors: Record<FragmentKind, string> = {
  shellStrong: "#1f1f1f",
  shellSoft: "#2c2c2c",
  cagePrimary: "#080808",
  cageSecondary: "#181818",
  core: "#111111",
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function releasePhase(kind: FragmentKind, progress: number) {
  if (kind === "shellSoft") return smoothstep(0.36, 0.66, progress);
  if (kind === "shellStrong") return smoothstep(0.42, 0.72, progress);
  if (kind === "cagePrimary") return smoothstep(0.58, 0.88, progress);
  if (kind === "cageSecondary") return smoothstep(0.66, 0.94, progress);
  return smoothstep(0.74, 0.985, progress);
}

function stableFade(kind: FragmentKind, progress: number) {
  if (kind === "cagePrimary") return 1 - smoothstep(0.58, 0.88, progress);
  if (kind === "cageSecondary") return 1 - smoothstep(0.66, 0.94, progress);
  return 1 - smoothstep(0.74, 0.985, progress);
}

function releaseImpulse(kind: FragmentKind, phase: number) {
  const impulse = Math.sin(smoothstep(0.06, 0.62, phase) * Math.PI);

  if (kind === "shellSoft") return impulse * 0.2;
  if (kind === "shellStrong") return impulse * 0.16;
  if (kind === "cagePrimary") return impulse * 0.1;
  if (kind === "cageSecondary") return impulse * 0.07;
  return impulse * 0.04;
}

function releaseScale(kind: FragmentKind, phase: number) {
  const contraction = Math.sin(smoothstep(0, 0.18, phase) * Math.PI) * 0.035;
  const expansion = phase * (kind === "shellSoft" ? 0.2 : kind === "shellStrong" ? 0.12 : 0.04);

  return 1 - contraction + expansion;
}

function makeCirclePoints(
  radius: number,
  segments = 120,
  plane: Plane = "xy"
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const c = Math.cos(t) * radius;
    const s = Math.sin(t) * radius;

    if (plane === "xy") points.push(new THREE.Vector3(c, s, 0));
    if (plane === "yz") points.push(new THREE.Vector3(0, c, s));
    if (plane === "xz") points.push(new THREE.Vector3(c, 0, s));
  }

  return points;
}

function deterministicNoise(index: number, salt: number) {
  return Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453 % 1;
}

function normalizedBurst(vector: THREE.Vector3, fallbackIndex: number) {
  const base = vector.lengthSq() > 0.001 ? vector.clone().normalize() : new THREE.Vector3(
    Math.cos(fallbackIndex * 1.7),
    Math.sin(fallbackIndex * 2.1) * 0.48,
    Math.sin(fallbackIndex * 1.3)
  ).normalize();

  base.x += deterministicNoise(fallbackIndex, 1) * 0.28;
  base.y += deterministicNoise(fallbackIndex, 2) * 0.18;
  base.z += deterministicNoise(fallbackIndex, 3) * 0.4;

  return base.normalize();
}

function compositionVector(kind: FragmentKind, index: number, anchor: THREE.Vector3) {
  if (kind === "shellSoft" || kind === "shellStrong") {
    const zones = [
      new THREE.Vector3(-2.0, 0.86, -0.08),
      new THREE.Vector3(2.1, 0.72, 0.12),
      new THREE.Vector3(-1.65, -0.96, 0.1),
      new THREE.Vector3(1.72, -0.9, -0.1),
    ];
    const zone = zones[index % zones.length].clone();
    return zone.add(anchor.clone().normalize().multiplyScalar(kind === "shellStrong" ? 0.22 : 0.34));
  }

  if (kind === "cagePrimary") {
    const side = anchor.x >= 0 ? 1 : -1;
    const lift = ((index % 5) - 2) * 0.16;
    return new THREE.Vector3(
      side * (0.98 + Math.abs(anchor.x) * 0.32),
      anchor.y * 0.42 + lift,
      anchor.z * 0.2
    );
  }

  if (kind === "cageSecondary") {
    return anchor
      .clone()
      .multiplyScalar(0.46)
      .add(new THREE.Vector3(deterministicNoise(index, 14) * 0.18, deterministicNoise(index, 15) * 0.16, 0));
  }

  return anchor.clone().multiplyScalar(0.18);
}

function edgeFragments(
  sourceGeometry: THREE.BufferGeometry,
  kind: FragmentKind,
  baseOpacity: number,
  idPrefix: string,
  startIndex: number,
  burstScale: number
): Fragment[] {
  const edgeGeometry = new THREE.EdgesGeometry(sourceGeometry, 1);
  const position = edgeGeometry.getAttribute("position");
  const fragments: Fragment[] = [];

  for (let i = 0; i < position.count; i += 2) {
    const a = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i));
    const b = new THREE.Vector3(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1));
    const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
    const midpoint = a.clone().add(b).multiplyScalar(0.5);
    const index = startIndex + fragments.length;
    const burst = normalizedBurst(midpoint, index).multiplyScalar(burstScale);

    fragments.push({
      id: `${idPrefix}-${i}`,
      geometry,
      mode: "segments",
      kind,
      baseOpacity,
      basePosition: new THREE.Vector3(0, 0, 0),
      baseRotation: new THREE.Euler(0, 0, 0),
      burst,
      composition: compositionVector(kind, index, midpoint),
      spin: new THREE.Vector3(
        deterministicNoise(index, 4) * 1.4,
        deterministicNoise(index, 5) * 1.7,
        deterministicNoise(index, 6) * 1.2
      ),
      releaseOnly: true,
    });
  }

  edgeGeometry.dispose();
  sourceGeometry.dispose();

  return fragments;
}

function tubeFragments(
  sourceGeometry: THREE.BufferGeometry,
  kind: FragmentKind,
  baseOpacity: number,
  idPrefix: string,
  startIndex: number,
  burstScale: number,
  radius: number
): Fragment[] {
  const edgeGeometry = new THREE.EdgesGeometry(sourceGeometry, 1);
  const position = edgeGeometry.getAttribute("position");
  const fragments: Fragment[] = [];

  for (let i = 0; i < position.count; i += 2) {
    const a = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i));
    const b = new THREE.Vector3(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1));
    const midpoint = a.clone().add(b).multiplyScalar(0.5);
    const curve = new THREE.LineCurve3(a, b);
    const geometry = new THREE.TubeGeometry(curve, 1, radius, 5, false);
    const index = startIndex + fragments.length;
    const burst = normalizedBurst(midpoint, index).multiplyScalar(burstScale);

    fragments.push({
      id: `${idPrefix}-tube-${i}`,
      geometry,
      mode: "mesh",
      kind,
      baseOpacity,
      basePosition: new THREE.Vector3(0, 0, 0),
      baseRotation: new THREE.Euler(0, 0, 0),
      burst,
      composition: compositionVector(kind, index, midpoint),
      spin: new THREE.Vector3(
        deterministicNoise(index, 7) * 1.1,
        deterministicNoise(index, 8) * 1.35,
        deterministicNoise(index, 9) * 0.9
      ),
      releaseOnly: true,
    });
  }

  edgeGeometry.dispose();
  sourceGeometry.dispose();

  return fragments;
}

function nodeFragments(
  sourceGeometry: THREE.BufferGeometry,
  kind: FragmentKind,
  baseOpacity: number,
  idPrefix: string,
  startIndex: number,
  burstScale: number,
  radius: number
): Fragment[] {
  const position = sourceGeometry.getAttribute("position");
  const vertices = new Map<string, THREE.Vector3>();
  const fragments: Fragment[] = [];

  for (let i = 0; i < position.count; i += 1) {
    const vertex = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i));
    const key = `${vertex.x.toFixed(4)}:${vertex.y.toFixed(4)}:${vertex.z.toFixed(4)}`;
    vertices.set(key, vertex);
  }

  [...vertices.values()].forEach((vertex, localIndex) => {
    const geometry = new THREE.SphereGeometry(radius, 10, 8);
    geometry.translate(vertex.x, vertex.y, vertex.z);
    const index = startIndex + localIndex;

    fragments.push({
      id: `${idPrefix}-node-${localIndex}`,
      geometry,
      mode: "mesh",
      kind,
      baseOpacity,
      basePosition: new THREE.Vector3(0, 0, 0),
      baseRotation: new THREE.Euler(0, 0, 0),
      burst: normalizedBurst(vertex, index).multiplyScalar(burstScale),
      composition: compositionVector(kind, index, vertex),
      spin: new THREE.Vector3(
        deterministicNoise(index, 10) * 0.8,
        deterministicNoise(index, 11) * 1.1,
        deterministicNoise(index, 12) * 0.7
      ),
      releaseOnly: true,
    });
  });

  sourceGeometry.dispose();

  return fragments;
}

function createFragments() {
  const fragments: Fragment[] = [];
  const radius = 1.94;
  const loopSegments = 144;

  [-1.42, -1.0, -0.55, 0, 0.55, 1.0, 1.42].forEach((y, index) => {
    const ringRadius = Math.sqrt(Math.max(radius * radius - y * y, 0.001));
    const points = makeCirclePoints(ringRadius, loopSegments, "xz").map(
      (point) => new THREE.Vector3(point.x, y, point.z)
    );
    const strong = index >= 2 && index <= 4;
    const burst = normalizedBurst(new THREE.Vector3((index - 3) * 0.42, y, 0.48), index).multiplyScalar(1.22);

    fragments.push({
      id: `shell-latitude-${index}`,
      geometry: new THREE.BufferGeometry().setFromPoints(points),
      mode: "loop",
      kind: strong ? "shellStrong" : "shellSoft",
      baseOpacity: strong ? 0.21 : 0.075,
      basePosition: new THREE.Vector3(0, 0, 0),
      baseRotation: new THREE.Euler(0, 0, 0),
      burst,
      composition: compositionVector(strong ? "shellStrong" : "shellSoft", index, new THREE.Vector3((index - 3) * 0.42, y, 0.48)),
      spin: new THREE.Vector3(0.2 + index * 0.04, 0.52, 0.18),
    });
  });

  [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].forEach((deg, index) => {
    const angle = THREE.MathUtils.degToRad(deg);
    const burst = normalizedBurst(
      new THREE.Vector3(Math.cos(angle), (index - 3.5) * 0.06, Math.sin(angle)),
      index + 20
    ).multiplyScalar(1.42);

    fragments.push({
      id: `shell-longitude-${index}`,
      geometry: new THREE.BufferGeometry().setFromPoints(makeCirclePoints(radius, loopSegments, "yz")),
      mode: "loop",
      kind: index % 2 === 0 ? "shellStrong" : "shellSoft",
      baseOpacity: index % 2 === 0 ? 0.19 : 0.065,
      basePosition: new THREE.Vector3(0, 0, 0),
      baseRotation: new THREE.Euler(0, angle, 0),
      burst,
      composition: compositionVector(index % 2 === 0 ? "shellStrong" : "shellSoft", index + 20, new THREE.Vector3(Math.cos(angle), (index - 3.5) * 0.06, Math.sin(angle))),
      spin: new THREE.Vector3(0.36, 0.24 + index * 0.06, 0.38),
    });
  });

  fragments.push(
    ...tubeFragments(
      new THREE.IcosahedronGeometry(1.52, 0),
      "cagePrimary",
      0.18,
      "ico",
      fragments.length + 120,
      2.08,
      0.0038
    ),
    ...nodeFragments(
      new THREE.IcosahedronGeometry(1.52, 0),
      "cagePrimary",
      0.32,
      "ico",
      fragments.length + 180,
      2.02,
      0.018
    ),
    ...tubeFragments(
      new THREE.OctahedronGeometry(0.64, 0),
      "core",
      0.12,
      "core",
      fragments.length + 240,
      1.18,
      0.0032
    ),
    ...nodeFragments(
      new THREE.OctahedronGeometry(0.64, 0),
      "core",
      0.22,
      "core",
      fragments.length + 280,
      1.12,
      0.015
    ),
    ...edgeFragments(
      new THREE.IcosahedronGeometry(1.52, 0),
      "cagePrimary",
      0.52,
      "ico",
      fragments.length,
      2.2
    ),
    ...edgeFragments(
      new THREE.DodecahedronGeometry(1.1, 0),
      "cageSecondary",
      0.19,
      "dodeca",
      fragments.length + 40,
      1.72
    ),
    ...edgeFragments(
      new THREE.OctahedronGeometry(0.64, 0),
      "core",
      0.14,
      "core",
      fragments.length + 90,
      1.2
    )
  );

  return fragments;
}

function ArtifactScene({
  progress,
  pointer,
  reducedMotion,
}: {
  progress: number;
  pointer: Pointer;
  reducedMotion: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const stablePrimaryRef = useRef<THREE.LineSegments>(null);
  const stableSecondaryRef = useRef<THREE.LineSegments>(null);
  const stableCoreRef = useRef<THREE.LineSegments>(null);
  const objectRefs = useRef<THREE.Object3D[]>([]);
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const previousProgressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const fragments = useMemo(() => createFragments(), []);
  const stableGeometries = useMemo(
    () => ({
      primary: new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.52, 0), 1),
      secondary: new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(1.1, 0), 1),
      core: new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.64, 0), 1),
    }),
    []
  );

  useEffect(() => {
    return () => {
      fragments.forEach((fragment) => fragment.geometry.dispose());
      Object.values(stableGeometries).forEach((geometry) => geometry.dispose());
    };
  }, [fragments, stableGeometries]);

  useFrame((_, delta) => {
    const targetProgress = reducedMotion ? 0 : progress;
    const progressDelta = targetProgress - previousProgressRef.current;
    previousProgressRef.current = targetProgress;

    progressRef.current = THREE.MathUtils.damp(progressRef.current, targetProgress, 5.8, delta);
    velocityRef.current = THREE.MathUtils.damp(velocityRef.current, progressDelta / Math.max(delta, 0.016), 5.2, delta);
    pointerRef.current.x = THREE.MathUtils.damp(pointerRef.current.x, pointer.x, 4.8, delta);
    pointerRef.current.y = THREE.MathUtils.damp(pointerRef.current.y, pointer.y, 4.8, delta);

    const p = progressRef.current;
    const disassemble = smoothstep(0.48, 0.96, p);
    const entrance = smoothstep(0.02, 0.18, p);
    const preTension = Math.sin(smoothstep(0.34, 0.54, p) * Math.PI) * 0.058;
    const scrollSpin = velocityRef.current;
    const magneticReturn = scrollSpin < -0.035;

    if (rootRef.current) {
      rootRef.current.rotation.x = 0.3 + pointerRef.current.y * -0.16 + disassemble * 0.22;
      rootRef.current.rotation.y = p * 4.6 + pointerRef.current.x * 0.18 + scrollSpin * 0.09;
      rootRef.current.rotation.z = -0.16 + Math.sin(p * Math.PI * 2) * 0.05 + pointerRef.current.x * 0.08;
      rootRef.current.scale.setScalar(0.58 + entrance * 0.07 - preTension - disassemble * 0.005);
    }

    const stablePrimaryMaterial = stablePrimaryRef.current?.material;
    const stableSecondaryMaterial = stableSecondaryRef.current?.material;
    const stableCoreMaterial = stableCoreRef.current?.material;

    if (stablePrimaryMaterial instanceof THREE.LineBasicMaterial) {
      stablePrimaryMaterial.opacity = (0.34 + smoothstep(0.08, 0.32, p) * 0.1) * stableFade("cagePrimary", p);
    }

    if (stableSecondaryMaterial instanceof THREE.LineBasicMaterial) {
      stableSecondaryMaterial.opacity = 0.13 * (0.16 + stableFade("cageSecondary", p) * 0.84);
    }

    if (stableCoreMaterial instanceof THREE.LineBasicMaterial) {
      stableCoreMaterial.opacity = 0.1 * (0.28 + stableFade("core", p) * 0.72);
    }

    fragments.forEach((fragment, index) => {
      const object = objectRefs.current[index];
      if (!object) return;

      const phase = releasePhase(fragment.kind, p);
      const impulse = releaseImpulse(fragment.kind, phase);
      const releaseTravel = phase + impulse;
      const stagger = smoothstep(0.02, 0.38, phase + index * 0.003);
      const compositionProgress = smoothstep(0.18, 0.88, phase);
      const depthLift = new THREE.Vector3(0, 0, fragment.burst.z * 0.7);
      const depthFocus = clamp(1 - Math.max(0, object.position.z + fragment.burst.z * phase) * 0.08, 0.76, 1);
      const targetPosition = fragment.basePosition
        .clone()
        .add(fragment.burst.clone().multiplyScalar(stagger * (1.52 + impulse * 0.9)))
        .add(fragment.composition.clone().multiplyScalar(compositionProgress))
        .add(depthLift.multiplyScalar(releaseTravel * 0.42));

      object.position.lerp(targetPosition, 1 - Math.pow(magneticReturn ? 0.00005 : 0.0008, delta));
      object.rotation.x = fragment.baseRotation.x + fragment.spin.x * releaseTravel + scrollSpin * 0.025 * phase;
      object.rotation.y = fragment.baseRotation.y + fragment.spin.y * releaseTravel + scrollSpin * 0.04 * phase;
      object.rotation.z = fragment.baseRotation.z + fragment.spin.z * releaseTravel;
      object.scale.setScalar(releaseScale(fragment.kind, phase) * (1 - phase * (fragment.kind === "shellSoft" ? 0.14 : 0.055)));

      const material = (object as THREE.Line | THREE.Mesh).material;
      if (material instanceof THREE.LineBasicMaterial || material instanceof THREE.MeshBasicMaterial) {
        const fade = fragment.kind === "shellSoft" ? 0.2 : fragment.kind === "core" ? 0.02 : 0.1;
        const focusLift = fragment.kind === "cagePrimary" ? smoothstep(0.08, 0.32, p) * 0.07 : 0;
        const releaseVisibility = fragment.releaseOnly ? smoothstep(0.08, 0.3, phase) : 1;
        material.opacity = (fragment.baseOpacity * (1 - phase * fade) + focusLift) * releaseVisibility * depthFocus;
      }
    });
  });

  return (
    <>
      <fog attach="fog" args={["#f5f2eb", 7.4, 10.8]} />
      <group ref={rootRef}>
        <lineSegments ref={stablePrimaryRef} geometry={stableGeometries.primary}>
          <lineBasicMaterial color="#080808" transparent opacity={0.34} depthWrite={false} />
        </lineSegments>
        <lineSegments ref={stableSecondaryRef} geometry={stableGeometries.secondary}>
          <lineBasicMaterial color="#181818" transparent opacity={0.13} depthWrite={false} />
        </lineSegments>
        <lineSegments ref={stableCoreRef} geometry={stableGeometries.core}>
          <lineBasicMaterial color="#111111" transparent opacity={0.1} depthWrite={false} />
        </lineSegments>
        {fragments.map((fragment, index) => {
          const commonProps = {
            key: fragment.id,
            ref: (object: THREE.Object3D | null) => {
              if (object) objectRefs.current[index] = object;
            },
            geometry: fragment.geometry,
            position: fragment.basePosition,
            rotation: fragment.baseRotation,
          };

          const material = (
            <lineBasicMaterial
              color={fragmentColors[fragment.kind]}
              transparent
              opacity={fragment.baseOpacity}
              depthWrite={false}
            />
          );

          if (fragment.mode === "loop") {
            return <lineLoop {...commonProps}>{material}</lineLoop>;
          }

          if (fragment.mode === "mesh") {
            return (
              <mesh {...commonProps}>
                <meshBasicMaterial
                  color={fragmentColors[fragment.kind]}
                  transparent
                  opacity={fragment.baseOpacity}
                  depthWrite={false}
                />
              </mesh>
            );
          }

          return <lineSegments {...commonProps}>{material}</lineSegments>;
        })}
      </group>
    </>
  );
}

function useScrollProgress(sectionRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const scrollable = Math.max(1, rect.height - viewport);
      setProgress(clamp((0 - rect.top) / scrollable));
    };

    const schedule = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sectionRef]);

  return progress;
}

export default function OfferScrollArtifactHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progress = useScrollProgress(sectionRef);
  const reducedMotion = useReducedMotion() ?? false;
  const [pointer, setPointer] = useState<Pointer>({ x: 0, y: 0 });
  const disassemble = smoothstep(0.48, 0.96, progress);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 mx-auto h-[205vh] w-[min(94vw,1720px)] sm:h-[220vh]"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((event.clientY - rect.top) / window.innerHeight) * 2 - 1,
        });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="sticky top-[14.25rem] h-[calc(100vh-14.25rem)] min-h-[620px] overflow-visible sm:top-0 sm:h-screen sm:min-h-[720px]">
        <div className="relative left-1/2 h-full w-screen -translate-x-1/2 overflow-hidden bg-[#f5f2eb]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.82)_28%,rgba(244,241,234,0.9)_58%,rgba(236,232,223,0.88)_100%)]" />
          <div className="pointer-events-none absolute inset-x-[max(1.5rem,5vw)] top-1/2 h-px bg-neutral-950/[0.07]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-950/[0.055] sm:h-[42rem] sm:w-[42rem] lg:h-[54rem] lg:w-[54rem]" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-950/[0.035] opacity-70 sm:h-[52rem] sm:w-[52rem] lg:h-[66rem] lg:w-[66rem]"
            style={{ transform: `translate(-50%, -50%) scale(${1 + disassemble * 0.08})` }}
          />

          <div className="absolute left-[max(1.5rem,5vw)] right-[max(1.5rem,5vw)] top-5 z-20 grid min-h-11 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/10 sm:top-20">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">Open Practice Field</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              {disassemble > 0.62 ? "system released" : "scroll core"}
            </div>
          </div>

          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 8.25], fov: 31, near: 0.1, far: 100 }}
              dpr={[1, 1.55]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
              <ArtifactScene
                progress={progress}
                pointer={pointer}
                reducedMotion={reducedMotion}
              />
            </Canvas>
          </div>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-full w-[min(72rem,86vw)] -translate-x-1/2 -translate-y-1/2 bg-white/24 blur-3xl transition-opacity duration-500"
            style={{ opacity: 0.42 - disassemble * 0.14 }}
          />

          <div className="pointer-events-none absolute bottom-8 left-[max(1.5rem,5vw)] right-[max(1.5rem,5vw)] z-20 hidden min-h-10 items-center justify-between border-t border-neutral-950/10 pt-4 sm:flex">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              {String(Math.round(progress * 100)).padStart(2, "0")} / scroll state
            </div>
            <div className="h-px w-[min(28rem,28vw)] bg-neutral-950/12" />
          </div>
        </div>
      </div>
    </section>
  );
}
