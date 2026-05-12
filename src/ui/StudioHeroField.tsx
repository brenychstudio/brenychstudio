import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type StudioHeroAsset = {
  src: string;
  label: string;
};

type Props = {
  assets: StudioHeroAsset[];
};

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uVelocity;
  varying vec2 vUv;
  varying float vField;

  void main() {
    vUv = uv;
    vec3 pos = position;
    vec2 p = uv - 0.5;
    vec2 m = uMouse - 0.5;
    float dist = length(p - m);
    float edge = 1.0 - smoothstep(0.0, 0.18, min(min(uMouse.x, 1.0 - uMouse.x), min(uMouse.y, 1.0 - uMouse.y)));
    float aggression = smoothstep(0.18, 0.82, uVelocity);
    float radius = mix(0.2, 0.52, aggression);
    float energy = uHover * mix(0.28, 1.42, aggression);
    float force = smoothstep(radius, 0.0, dist) * energy;
    float wave = sin((p.x * 5.8 + p.y * 2.4 + uTime * 0.42) * 3.14159);
    float edgeEnergy = edge * aggression * uHover;
    float ripple = sin(dist * (54.0 + edgeEnergy * 36.0) - uTime * (6.2 + edgeEnergy * 6.4)) * force;

    pos.xy += normalize(p - m + 0.0001) * ripple * (0.026 + aggression * 0.078);
    pos.z += (wave * 0.038 + force * (0.12 + aggression * 0.22) + ripple * (0.07 + edgeEnergy * 0.16));
    vField = force + wave * 0.14 + edgeEnergy * 0.58;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uHover;
  uniform float uVelocity;
  varying vec2 vUv;
  varying float vField;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float line(float value, float width) {
    return smoothstep(width, 0.0, abs(value));
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
    float dist = length(p - m);
    float edge = 1.0 - smoothstep(0.0, 0.18, min(min(uMouse.x, 1.0 - uMouse.x), min(uMouse.y, 1.0 - uMouse.y)));
    float aggression = smoothstep(0.18, 0.82, uVelocity);
    float edgeEnergy = edge * aggression * uHover;
    float radius = mix(0.19, 0.58, aggression);
    float energy = uHover * mix(0.18, 1.48, aggression);
    float cursor = smoothstep(radius, 0.0, dist) * energy;
    float ripple = sin(dist * (74.0 + edgeEnergy * 48.0) - uTime * (7.2 + edgeEnergy * 7.0)) * cursor;
    vec2 dir = normalize(p - m + 0.0001);

    p += dir * ripple * (0.024 + aggression * 0.095);
    p += vec2(
      noise(p * 2.8 + uTime * 0.06),
      noise(p * 2.8 - uTime * 0.05)
    ) * (0.03 + aggression * 0.05 + edgeEnergy * 0.04);

    float flowA = sin((p.x * 1.35 + p.y * 0.42 + sin(p.y * 2.1 + uTime * 0.35) * 0.22) * 5.3);
    float flowB = sin((p.x * -0.34 + p.y * 1.72 + noise(p * 2.0 + uTime * 0.08) * 0.65) * 4.1);
    float contour = line(flowA, 0.026) * 0.56 + line(flowB, 0.021) * 0.34;
    contour += line(flowA + flowB, 0.018) * aggression * 0.44;

    float membrane = smoothstep(0.95, 0.12, abs(flowA * 0.52 + flowB * 0.48));
    float lensCore = smoothstep(mix(0.14, 0.36, aggression), 0.0, dist) * cursor;
    float lensBody = smoothstep(mix(0.28, 0.62, aggression), 0.0, dist) * cursor;
    float ring = line(sin(dist * (32.0 + aggression * 18.0) - uTime * (4.2 + aggression * 4.8)), 0.072) * cursor * aggression;

    float scan = line(p.y + sin(p.x * 1.8 + uTime * 0.22) * 0.085, 0.006);
    float vertical = line(p.x - 0.42 + sin(p.y * 3.0 + uTime * 0.16) * 0.04, 0.004);
    float edgeWave = line(sin((p.x + p.y) * 9.0 + dist * 20.0 - uTime * 5.6), 0.12) * edgeEnergy;
    float node = smoothstep(0.032, 0.0, length(p - vec2(0.4, -0.08)));
    float nodeB = smoothstep(0.026, 0.0, length(p - vec2(-0.18, 0.22)));

    vec3 ink = vec3(0.02, 0.02, 0.018);
    vec3 graphite = vec3(0.09, 0.09, 0.08);
    vec3 spectral = vec3(0.45 + sin(uTime * 0.8) * 0.08, 0.78, 0.92);
    vec3 ember = vec3(0.95, 0.64, 0.32);

    vec3 color = mix(graphite, ink, membrane);
    color += spectral * ring * 0.32;
    color += ember * lensCore * 0.08;
    color += vec3(0.0, 0.12, 0.08) * vField * 0.22;
    color += spectral * edgeWave * 0.22;

    float alpha = contour * (0.3 + aggression * 0.28) + membrane * 0.12 + scan * 0.2 + vertical * 0.16;
    alpha += (node + nodeB) * 0.12;
    alpha += lensCore * (0.18 + aggression * 0.28) + lensBody * (0.08 + aggression * 0.24) + ring * 0.3 + edgeWave * 0.32;
    alpha *= smoothstep(1.25, 0.2, length(p * vec2(0.78, 0.98)));

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.7 + aggression * 0.22));
  }
`;

function SignalMembrane({ reducedMotion }: { reducedMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const hover = useRef(0);
  const targetHover = useRef(0);
  const velocity = useRef(0);
  const targetVelocity = useRef(0);
  const previousPointer = useRef({ x: 0.5, y: 0.5, time: 0 });
  const { gl, size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uHover: { value: 0 },
      uVelocity: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    targetVelocity.current = THREE.MathUtils.damp(targetVelocity.current, 0, reducedMotion ? 10 : 2.2, delta);
    velocity.current = THREE.MathUtils.damp(velocity.current, targetVelocity.current, reducedMotion ? 12 : 6.5, delta);
    hover.current = THREE.MathUtils.damp(hover.current, targetHover.current, reducedMotion ? 10 : 7, delta);
    currentMouse.current.lerp(targetMouse.current, reducedMotion ? 0.45 : 0.16);

    material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.getElapsedTime();
    material.uniforms.uMouse.value.copy(currentMouse.current);
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uHover.value = hover.current;
    material.uniforms.uVelocity.value = velocity.current;
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      const now = performance.now();
      const previous = previousPointer.current;
      const dt = Math.max(now - previous.time, 16);
      const dx = x - previous.x;
      const dy = y - previous.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      const nextVelocity = THREE.MathUtils.clamp(speed * 78, 0, 1);

      targetMouse.current.set(THREE.MathUtils.clamp(x, 0, 1), THREE.MathUtils.clamp(1 - y, 0, 1));
      targetHover.current = inside ? 1 : 0;
      targetVelocity.current = inside ? Math.max(targetVelocity.current, nextVelocity) : 0;
      previousPointer.current = { x, y, time: now };
    };

    const handlePointerLeave = () => {
      targetMouse.current.set(0.5, 0.5);
      targetHover.current = 0;
      targetVelocity.current = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [gl]);

  return (
    <group>
      <mesh scale={[viewport.width * 1.34, viewport.height * 1.22, 1]}>
        <planeGeometry args={[1, 1, 180, 120]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <mesh position={[0.92, 0.1, -0.02]} rotation={[0, 0, -0.16]}>
        <ringGeometry args={[2.22, 2.228, 260]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.042} depthTest={false} />
      </mesh>
      <mesh position={[-0.58, -0.1, -0.02]} rotation={[0, 0, 0.08]}>
        <ringGeometry args={[1.5, 1.508, 220]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.032} depthTest={false} />
      </mesh>
      <mesh position={[0.08, 0.0, -0.01]} rotation={[0, 0, -0.11]}>
        <planeGeometry args={[7.6, 0.007]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.13} depthTest={false} />
      </mesh>
    </group>
  );
}

function HeroSignalCanvas({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.65]}
      camera={{ position: [0, 0, 5.2], fov: 36, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0xffffff, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <SignalMembrane reducedMotion={reducedMotion} />
    </Canvas>
  );
}

export default function StudioHeroField({ assets }: Props) {
  const reducedMotion = Boolean(useReducedMotion());
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [idleTint, setIdleTint] = useState(false);
  const signalLabels = assets.slice(0, 4).map((asset) => asset.label);

  useEffect(() => {
    if (reducedMotion) {
      setIdleTint(false);
      return;
    }

    let idleTimer: number | null = null;

    const clearIdleTimer = () => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const scheduleIdleTint = () => {
      clearIdleTimer();

      idleTimer = window.setTimeout(() => {
        const rect = rootRef.current?.getBoundingClientRect();
        const isVisible = Boolean(rect && rect.bottom > window.innerHeight * 0.24 && rect.top < window.innerHeight * 0.76);
        setIdleTint(isVisible);
      }, 3500);
    };

    const markActive = () => {
      setIdleTint(false);
      scheduleIdleTint();
    };

    window.addEventListener("pointermove", markActive, { passive: true });
    window.addEventListener("pointerdown", markActive, { passive: true });
    window.addEventListener("touchstart", markActive, { passive: true });
    window.addEventListener("keydown", markActive);
    window.addEventListener("scroll", markActive, { passive: true });
    scheduleIdleTint();

    return () => {
      clearIdleTimer();
      window.removeEventListener("pointermove", markActive);
      window.removeEventListener("pointerdown", markActive);
      window.removeEventListener("touchstart", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("scroll", markActive);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="relative h-full min-h-[100vh] overflow-hidden">
      <div className="absolute inset-0">
        <HeroSignalCanvas reducedMotion={reducedMotion} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: idleTint ? 0.82 : 0,
          filter:
            "brightness(0) saturate(100%) invert(48%) sepia(47%) saturate(820%) hue-rotate(156deg) brightness(94%) contrast(92%)",
          transitionDuration: idleTint ? "5200ms" : "850ms",
          transitionTimingFunction: idleTint ? "cubic-bezier(0.46, 0, 0.18, 1)" : "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <HeroSignalCanvas reducedMotion={reducedMotion} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_56%_44%,rgba(255,255,255,0),rgba(242,239,232,0.08)_38%,rgba(242,239,232,0.58)_84%)]" />
      <div className="pointer-events-none absolute right-[18%] top-[22%] hidden rounded-full border border-neutral-950/10 bg-white/42 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur md:block">
        WebGL interface engine
      </div>
      <div className="pointer-events-none absolute bottom-[10%] right-[12%] hidden max-w-[18rem] flex-wrap justify-end gap-1.5 md:flex">
        {signalLabels.map((label) => (
          <span
            key={label}
            className="rounded-full border border-neutral-950/10 bg-white/38 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-neutral-500 backdrop-blur"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
