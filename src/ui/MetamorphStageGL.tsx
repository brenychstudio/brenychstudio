import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import OrbitMechanismStage from "./OrbitMechanismStage";

type Props = {
  title?: string;
  intensity?: number;
  blend?: number;
  embedded?: boolean;
  compact?: boolean;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function MetamorphStageGL({
  title = "Capabilities",
  intensity = 1,
  blend = 0,
  embedded = false,
  compact = false,
}: Props) {
  const safeIntensity = Number.isFinite(intensity) ? clamp01(intensity) : 1;
  const safeBlend = Number.isFinite(blend) ? clamp01(blend) : 0;

  const orbitFade = THREE.MathUtils.smoothstep(safeBlend, 0.1, 0.72);
  const metaballFade = 1 - THREE.MathUtils.smoothstep(safeBlend, 0.34, 0.92);

  const stageName =
    orbitFade > 0.42 ? "Orbit Mechanism" : safeBlend > 0.06 ? "Metamorph" : "Metamorph";
  const modeName =
    orbitFade > 0.42
      ? "Functional radial system"
      : safeBlend > 0.06
        ? "Transition"
        : "Black glass";
  const materialName =
    orbitFade > 0.42
      ? "Monochrome structure"
      : safeBlend > 0.06
        ? "Glass -> mechanism"
        : "Black Glass";

  return (
    <motion.div
      className={embedded ? "h-full min-w-0" : "sticky top-24 h-[calc(100vh-6rem)] min-w-0"}
      initial={embedded ? false : { opacity: 0, y: 10, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={embedded ? undefined : { opacity: 0, y: -8, filter: "blur(12px)" }}
      transition={embedded ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      <div className="h-full flex flex-col min-w-0">
        <div
          className={[
            "relative flex-1 rounded-2xl border border-neutral-100 overflow-hidden bg-white min-w-0",
            compact ? "grid place-items-center" : "",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.022),transparent_55%),radial-gradient(circle_at_70%_85%,rgba(0,0,0,0.018),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 border border-white/40" />

          <div
            className={[
              "absolute inset-0",
              compact ? "flex items-center justify-center" : "",
            ].join(" ")}
            style={{
              opacity: metaballFade,
              transform: compact
                ? "translate3d(0, 0, 0) scale(1)"
                : `translate3d(0, ${safeBlend * -10}px, 0) scale(${1 - safeBlend * 0.016})`,
              filter: `blur(${orbitFade * 2.2}px)`,
              pointerEvents: "none",
              willChange: "opacity, transform, filter",
            }}
          >
            <Canvas
              className="absolute inset-0"
              dpr={[1, 1.55]}
              camera={{ position: [0, 0, 4.45], fov: 36, near: 0.1, far: 60 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.setClearColor(0xffffff, 0);
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.06;
                gl.outputColorSpace = THREE.SRGBColorSpace;
              }}
            >
              <MetaballsScene intensity={safeIntensity} fade={metaballFade} />
            </Canvas>
          </div>

          <div
            className={[
              "absolute inset-0",
              compact ? "flex items-center justify-center" : "",
            ].join(" ")}
            style={{
              opacity: orbitFade * 0.96,
              transform: compact
                ? "translate3d(0, 0, 0) scale(1)"
                : `translate3d(0, ${(1 - orbitFade) * 14}px, 0) scale(${0.984 + orbitFade * 0.016})`,
              filter: `blur(${(1 - orbitFade) * 4}px)`,
              pointerEvents: orbitFade > 0.08 ? "auto" : "none",
              willChange: "opacity, transform, filter",
            }}
          >
            <OrbitMechanismStage embedded panelTone="white" showMetaBar={false} />
          </div>

          {!compact && (
            <>
              <div className="absolute left-6 md:left-8 bottom-5 text-[11px] tracking-[0.28em] uppercase text-neutral-500">
                {title.toUpperCase()}
              </div>

              <div className="absolute right-6 md:right-8 bottom-5 flex items-center gap-3">
                <div className="h-[1px] w-10 bg-neutral-300/70" />
                <div className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  META / GL 100
                </div>
              </div>
            </>
          )}
        </div>

        {!compact && (
          <div className="mt-4 rounded-2xl border border-neutral-100 p-4 min-w-0">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-[160px]">
                <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-500">Stage</div>
                <div className="mt-1 text-lg tracking-tight">{stageName}</div>
                <div className="text-xs text-neutral-500">
                  {safeBlend > 0.22 ? "Metaballs -> Orbit mechanism" : "Metaballs / Glass"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-[11px] tracking-[0.22em] uppercase text-neutral-500">
                <div>
                  <div>Mode</div>
                  <div className="mt-1 tracking-normal text-xs text-neutral-700">{modeName}</div>
                </div>
                <div>
                  <div>Material</div>
                  <div className="mt-1 tracking-normal text-xs text-neutral-700">{materialName}</div>
                </div>
                <div>
                  <div>Status</div>
                  <div className="mt-1 tracking-normal text-xs text-neutral-700">Live</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MetaballsScene({ intensity, fade }: { intensity: number; fade: number }) {
  const mcRef = useRef<MarchingCubes | null>(null);

  const metaballMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0a0b10"),
        roughness: 0.18,
        metalness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transmission: 0.22,
        thickness: 0.7,
        ior: 1.42,
        specularIntensity: 1,
        envMapIntensity: 0.65,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  const mcObject = useMemo(() => {
    const mc = new MarchingCubes(80, metaballMaterial, true, true, 15000);
    mc.enableUvs = false;
    mc.enableColors = false;
    mc.isolation = 96;
    mc.scale.set(1.25, 1.65, 1.25);
    mc.position.set(0, -0.05, 0);
    return mc;
  }, [metaballMaterial]);

  useFrame((state) => {
    const mc = mcRef.current;
    if (!mc) return;

    const t = state.clock.getElapsedTime();
    const k = 0.45 + intensity * 0.85;

    mc.reset();
    mc.addBall(
      0.5 + 0.18 * Math.sin(t * (0.55 + 0.12 * k)),
      0.5 + 0.14 * Math.cos(t * (0.62 + 0.1 * k)),
      0.5 + 0.16 * Math.sin(t * 0.48),
      0.78 * k,
      10
    );
    mc.addBall(
      0.5 + 0.2 * Math.cos(t * (0.5 + 0.12 * k) + 1.2),
      0.5 + 0.16 * Math.sin(t * (0.58 + 0.1 * k) + 0.7),
      0.5 + 0.16 * Math.cos(t * 0.52 + 0.3),
      0.7 * k,
      10
    );
    mc.addBall(
      0.5 + 0.14 * Math.sin(t * (0.72 + 0.1 * k) + 2.0),
      0.5 + 0.22 * Math.cos(t * (0.46 + 0.13 * k) + 0.9),
      0.5 + 0.14 * Math.sin(t * 0.6 + 1.1),
      0.74 * k,
      10
    );
    mc.addBall(
      0.5 + 0.22 * Math.cos(t * (0.66 + 0.08 * k) + 2.6),
      0.5 + 0.12 * Math.sin(t * (0.74 + 0.09 * k) + 1.7),
      0.5 + 0.18 * Math.cos(t * 0.44 + 2.0),
      0.66 * k,
      10
    );

    const cut = 0.58 * k;
    mc.addBall(
      0.5 + 0.12 * Math.sin(t * 0.9 + 0.6),
      0.5 + 0.15 * Math.cos(t * 0.7 + 1.1),
      0.5 + 0.12 * Math.sin(t * 0.8 + 2.2),
      -cut,
      12
    );
    mc.addBall(
      0.5 + 0.14 * Math.cos(t * 0.85 + 2.4),
      0.5 + 0.1 * Math.sin(t * 0.95 + 0.4),
      0.5 + 0.14 * Math.cos(t * 0.75 + 1.6),
      -(cut * 0.9),
      12
    );

    mc.isolation = 88 + intensity * 18;
    mc.rotation.y = Math.sin(t * 0.22) * 0.18;
    mc.rotation.x = Math.cos(t * 0.18) * 0.1;
    mc.scale.set(1.25, 1.65, 1.25);
    mc.position.set(0, -0.05, 0);

    const mcMaterial = mc.material as THREE.MeshPhysicalMaterial;
    mcMaterial.opacity = fade;
    mcMaterial.transmission = 0.22 * fade;
    mc.visible = fade > 0.02;
    mc.update();
  });

  return (
    <>
      <ambientLight intensity={0.74} />
      <hemisphereLight args={["#f6f8ff", "#d7d9de", 0.7]} />
      <directionalLight position={[3.2, 3.0, 3.4]} intensity={1.2} color="#f5f7ff" />
      <directionalLight position={[-3.0, -2.1, 2.8]} intensity={0.42} color="#d7dbe3" />
      <pointLight position={[0.0, 0.8, 3.8]} intensity={0.48} color="#f7f8ff" />
      <pointLight position={[-1.6, 1.1, 2.4]} intensity={0.18} color="#dfe6ff" />

      <primitive
        object={mcObject}
        ref={(o: THREE.Object3D | null) => {
          mcRef.current = o as unknown as MarchingCubes | null;
        }}
      />

      <fog attach="fog" args={["#ffffff", 3.9, 10.8]} />
    </>
  );
}
