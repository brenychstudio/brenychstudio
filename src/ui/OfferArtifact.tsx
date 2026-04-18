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

    const phoneMedia = window.matchMedia("(max-width: 767px)");
    const tabletMedia = window.matchMedia(
      "(min-width: 768px) and (max-width: 1279px)"
    );

    const isPhone = phoneMedia.matches;
    const isTablet = tabletMedia.matches;
    const isCompact = isPhone || isTablet;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, isPhone ? 7.22 : isTablet ? 7.0 : 7.05);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isPhone,
      alpha: true,
      powerPreference: isCompact ? "default" : "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isPhone ? 1.18 : isTablet ? 1.35 : 1.5)
    );
    renderer.setClearColor(0xffffff, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.scale.setScalar(isPhone ? 0.96 : isTablet ? 1.0 : 1.02);
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
    const loopSegments = isPhone ? 84 : isTablet ? 96 : 120;

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

    [-1.42, -1.0, -0.55, 0, 0.55, 1.0, 1.42].forEach((y, i) => {
      const r = Math.sqrt(Math.max(R * R - y * y, 0.001));
      const points = makeCirclePoints(r, loopSegments, "xz").map(
        (p) => new THREE.Vector3(p.x, y, p.z)
      );

      addLoop(
        shellGroup,
        points,
        i >= 2 && i <= 4 ? materials.shellStrong : materials.shellSoft
      );
    });

    [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].forEach((deg, i) => {
      addLoop(
        shellGroup,
        makeCirclePoints(R, loopSegments, "yz"),
        i % 2 === 0 ? materials.shellStrong : materials.shellSoft,
        (line) => {
          line.rotation.y = THREE.MathUtils.degToRad(deg);
        }
      );
    });

    const icoOuterEdges = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(1.52, 0),
      1
    );
    geometries.push(icoOuterEdges);
    const icoOuter = new THREE.LineSegments(icoOuterEdges, materials.cagePrimary);
    cagePrimaryGroup.add(icoOuter);

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

    if (!isCompact) {
      mount.addEventListener("pointermove", onPointerMove);
      mount.addEventListener("pointerleave", onPointerLeave);
    }

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
    let running = false;
    let disposed = false;

    const renderFrame = () => {
      if (!running || disposed) return;

      raf = window.requestAnimationFrame(renderFrame);

      const t = clock.getElapsedTime();

      if (!isCompact) {
        pointerX += (targetX - pointerX) * 0.04;
        pointerY += (targetY - pointerY) * 0.04;
      } else {
        pointerX += (0 - pointerX) * 0.08;
        pointerY += (0 - pointerY) * 0.08;
      }

      const targetRootX =
        0.34 + Math.sin(t * (isCompact ? 0.24 : 0.33)) * (isCompact ? 0.04 : 0.06) - pointerY * (isCompact ? 0.08 : 0.16);
      const targetRootZ =
        -0.18 + Math.cos(t * (isCompact ? 0.18 : 0.24)) * (isCompact ? 0.03 : 0.05) + pointerX * (isCompact ? 0.06 : 0.12);

      root.rotation.x += (targetRootX - root.rotation.x) * (isCompact ? 0.03 : 0.045);
      root.rotation.z += (targetRootZ - root.rotation.z) * (isCompact ? 0.03 : 0.045);

      if (!reducedMotion) {
        if (isPhone) {
          shellGroup.rotation.y += 0.0018;
          shellGroup.rotation.z += 0.00022;

          cagePrimaryGroup.rotation.y += 0.0026;
          cagePrimaryGroup.rotation.x += 0.00035;

          cageSecondaryGroup.rotation.y -= 0.0014;
          cageSecondaryGroup.rotation.z += 0.0008;

          coreGroup.rotation.x -= 0.0008;
          coreGroup.rotation.y += 0.0018;
        } else if (isTablet) {
          shellGroup.rotation.y += 0.0026;
          shellGroup.rotation.z += 0.00032;

          cagePrimaryGroup.rotation.y += 0.0038;
          cagePrimaryGroup.rotation.x += 0.00055;

          cageSecondaryGroup.rotation.y -= 0.0021;
          cageSecondaryGroup.rotation.z += 0.00115;

          coreGroup.rotation.x -= 0.00115;
          coreGroup.rotation.y += 0.0026;
        } else {
          shellGroup.rotation.y += 0.0036;
          shellGroup.rotation.z += 0.00045;

          cagePrimaryGroup.rotation.y += 0.0054;
          cagePrimaryGroup.rotation.x += 0.0008;

          cageSecondaryGroup.rotation.y -= 0.0029;
          cageSecondaryGroup.rotation.z += 0.0017;

          coreGroup.rotation.x -= 0.0018;
          coreGroup.rotation.y += 0.0038;
        }
      }

      renderer.render(scene, camera);
    };

    const start = () => {
      if (disposed || running) return;
      running = true;
      clock.getDelta();
      renderFrame();
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      start();
    }

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (!isCompact) {
        mount.removeEventListener("pointermove", onPointerMove);
        mount.removeEventListener("pointerleave", onPointerLeave);
      }

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
