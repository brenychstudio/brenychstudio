import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

type Props = {
  className?: string;
};

type Plane = "xy" | "yz" | "xz";

function makeCirclePoints(
  radius: number,
  segments = 96,
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

export default function OfferArtifact({ className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 7.05);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0xffffff, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.scale.setScalar(1.02);
    scene.add(root);

    const shellGroup = new THREE.Group();
    const cagePrimaryGroup = new THREE.Group();
    const cageSecondaryGroup = new THREE.Group();
    const coreGroup = new THREE.Group();

    root.add(shellGroup);
    root.add(cagePrimaryGroup);
    root.add(cageSecondaryGroup);
    root.add(coreGroup);

    const materials = {
      shellStrong: new THREE.LineBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.11,
      }),
      shellSoft: new THREE.LineBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.035,
      }),
      cagePrimary: new THREE.LineBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.27,
      }),
      cageSecondary: new THREE.LineBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.085,
      }),
      core: new THREE.LineBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.05,
      }),
    };

    const geometries: THREE.BufferGeometry[] = [];

    const addLoop = (
      parent: THREE.Object3D,
      points: THREE.Vector3[],
      material: THREE.LineBasicMaterial,
      configure?: (line: THREE.LineLoop) => void
    ) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometries.push(geometry);
      const line = new THREE.LineLoop(geometry, material);
      configure?.(line);
      parent.add(line);
    };

    const R = 1.94;

    // Latitudes
    [-1.42, -1.0, -0.55, 0, 0.55, 1.0, 1.42].forEach((y, i) => {
      const r = Math.sqrt(Math.max(R * R - y * y, 0.001));
      const points = makeCirclePoints(r, 120, "xz").map(
        (p) => new THREE.Vector3(p.x, y, p.z)
      );

      addLoop(
        shellGroup,
        points,
        i >= 2 && i <= 4 ? materials.shellStrong : materials.shellSoft
      );
    });

    // Meridians / great circles
    [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].forEach((deg, i) => {
      addLoop(
        shellGroup,
        makeCirclePoints(R, 120, "yz"),
        i % 2 === 0 ? materials.shellStrong : materials.shellSoft,
        (line) => {
          line.rotation.y = THREE.MathUtils.degToRad(deg);
        }
      );
    });

    // Main outer polyhedral cage
    const icoOuterEdges = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(1.52, 0),
      1
    );
    geometries.push(icoOuterEdges);
    const icoOuter = new THREE.LineSegments(icoOuterEdges, materials.cagePrimary);
    cagePrimaryGroup.add(icoOuter);

    // Secondary calmer cage
    const dodecaInnerEdges = new THREE.EdgesGeometry(
      new THREE.DodecahedronGeometry(1.1, 0),
      1
    );
    geometries.push(dodecaInnerEdges);
    const dodecaInner = new THREE.LineSegments(
      dodecaInnerEdges,
      materials.cageSecondary
    );
    cageSecondaryGroup.add(dodecaInner);

    // Minimal inner core
    const octaCoreEdges = new THREE.EdgesGeometry(
      new THREE.OctahedronGeometry(0.64, 0),
      1
    );
    geometries.push(octaCoreEdges);
    const octaCore = new THREE.LineSegments(octaCoreEdges, materials.core);
    coreGroup.add(octaCore);

    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = window.requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      pointerX += (targetX - pointerX) * 0.04;
      pointerY += (targetY - pointerY) * 0.04;

      const targetRootX =
        0.34 + Math.sin(t * 0.33) * 0.06 - pointerY * 0.16;
      const targetRootZ =
        -0.18 + Math.cos(t * 0.24) * 0.05 + pointerX * 0.12;

      root.rotation.x += (targetRootX - root.rotation.x) * 0.045;
      root.rotation.z += (targetRootZ - root.rotation.z) * 0.045;

      if (!reducedMotion) {
        // Shell reads as the calm planetary envelope
        shellGroup.rotation.y += 0.0036;
        shellGroup.rotation.z += 0.00045;

        // Main cage: main readable structure
        cagePrimaryGroup.rotation.y += 0.0054;
        cagePrimaryGroup.rotation.x += 0.0008;

        // Secondary cage: softer counter motion
        cageSecondaryGroup.rotation.y -= 0.0029;
        cageSecondaryGroup.rotation.z += 0.0017;

        // Inner core: very quiet
        coreGroup.rotation.x -= 0.0018;
        coreGroup.rotation.y += 0.0038;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();

      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);

      geometries.forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());

      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className={`relative mx-auto aspect-square w-full max-w-[620px] ${className}`}
    />
  );
}
