import { useLayoutEffect, useRef } from "react";
import type { ManualSignalEvent } from "./ecosystemFlow";
import "./homeSignalSpine.css";

// Home owns the thread. Geometry is measured only on layout changes; scrolling
// changes its reveal and a rigid pin translation, never its control points.
export default function HomeSignalSpine({ locale }: { locale: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  useLayoutEffect(() => {
    const svg = svgRef.current, path = pathRef.current;
    const home = svg?.closest("main");
    const stage = home?.querySelector<HTMLElement>(".eco-system-stage");
    const scene = home?.querySelector<HTMLElement>(".eco-system-scene");
    const composition = home?.querySelector<HTMLElement>(".eco-system-composition");
    const field = home?.querySelector<HTMLElement>(".eco-system-field");
    const products = home?.querySelector<HTMLElement>("#products");
    const timeline = home?.querySelector<HTMLElement>(".eco-products-stage__timeline");
    if (!svg || !path || !home || !stage || !scene || !composition || !field || !products || !timeline) return;
    products.dataset.homeSignalAnchor = "products-entry";
    const media = window.matchMedia("(min-width:1024px) and (min-height:560px) and (prefers-reduced-motion:no-preference)");
    let frame = 0, homeTop = 0, stageTop = 0, stageHeight = 1, pinTop = 80, pinTravel = 0, headLength = 0, length = 1;
    let manual: { from: number; mix: number } | null = null;
    let samples: { y: number; length: number }[] = [];
    const update = () => {
      frame = 0;
      if (!media.matches || !samples.length) return;
      const scroll = window.scrollY;
      const shift = Math.max(0, Math.min(pinTravel, scroll + pinTop - stageTop));
      path.setAttribute("transform", `translate(0 ${shift})`);
      const progress = (scroll + window.innerHeight - stageTop) / stageHeight;
      const local = headLength * Math.max(0, Math.min(1, (progress - 0.2) / 0.7));
      // The continuation uses actual document position, with no scene spring.
      const targetY = scroll + window.innerHeight * 0.94 - homeTop - shift;
      let visible = 0;
      for (let i = 1; i < samples.length; i++) {
        const a = samples[i - 1], b = samples[i];
        if (b.y >= targetY && b.y > a.y) {
          visible = a.length + (b.length - a.length) * Math.max(0, Math.min(1, (targetY - a.y) / (b.y - a.y)));
          break;
        }
        visible = b.length;
      }
      const continuation = Math.max(0, Math.min(1, (progress - 0.85) / 0.05));
      const actual = Math.min(1, Math.max(local, visible * continuation) / length);
      const draw = manual ? manual.from + (actual - manual.from) * manual.mix : actual;
      path.setAttribute("stroke-dasharray", `${draw} 1`);
      svg.dataset.progress = String(draw);
    };
    const measure = () => {
      if (!media.matches) return;
      const mainRect = home.getBoundingClientRect(), s = stage.getBoundingClientRect(), c = scene.getBoundingClientRect();
      const comp = composition.getBoundingClientRect(), product = products.getBoundingClientRect(), t = timeline.getBoundingClientRect();
      homeTop = mainRect.top + window.scrollY;
      stageTop = s.top + window.scrollY;
      stageHeight = s.height;
      pinTop = parseFloat(getComputedStyle(scene).top) || 0;
      pinTravel = Math.max(0, s.height - c.height);
      const x = comp.left - mainRect.left + field.offsetLeft;
      const y = stageTop - homeTop + comp.top - c.top + field.offsetTop;
      const sx = field.offsetWidth / 1200, sy = field.offsetHeight / 640;
      const point = (px: number, py: number) => `${x + px * sx},${y + py * sy}`;
      const gutter = Math.min(mainRect.width - 45, product.right - mainRect.left + 32);
      const exitY = y + 640 * sy;
      const entryY = t.top + window.scrollY - homeTop + window.innerHeight * 0.75 - pinTravel;
      const productEnd = product.bottom + window.scrollY - homeTop - pinTravel;
      const end = mainRect.height - pinTravel;
      // The first two curves retain the approved core composition. The routed
      // third curve releases into the outer reading gutter, clear of Product UI.
      const head = `M${point(-140,56)} C${point(80,30)} ${point(85,316)} ${point(324,316)} C${point(520,316)} ${point(438,568)} ${point(730,548)} C${point(1022,528)} ${gutter + 12},${exitY - 110} ${gutter},${exitY}`;
      const d = `${head} C${gutter - 12},${exitY + 110} ${gutter - 16},${entryY - 260} ${gutter + 8},${entryY} C${gutter + 32},${entryY + 260} ${gutter - 4},${productEnd - 280} ${gutter + 14},${productEnd} C${gutter + 32},${productEnd + 280} ${gutter + 12},${end - 500} ${gutter - 15},${end}`;
      const metric = document.createElementNS("http://www.w3.org/2000/svg", "path");
      metric.setAttribute("d", head);
      headLength = metric.getTotalLength();
      path.setAttribute("d", d);
      length = path.getTotalLength();
      samples = Array.from({ length: 401 }, (_, i) => ({ y: path.getPointAtLength(length * i / 400).y, length: length * i / 400 }));
      svg.setAttribute("viewBox", `0 0 ${mainRect.width} ${mainRect.height}`);
      gradientRef.current?.setAttribute("y1", String(y));
      gradientRef.current?.setAttribute("y2", String(end));
      const stops = gradientRef.current?.querySelectorAll("stop");
      stops?.[1].setAttribute("offset", String(Math.max(0, (entryY - y) / (end - y))));
      stops?.[2].setAttribute("offset", String(Math.max(0, (productEnd - y) / (end - y))));
      update();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onManual = (event: Event) => {
      const { phase, mix } = (event as CustomEvent<ManualSignalEvent>).detail;
      if (phase === "capture") manual = { from: Number(svg.dataset.progress ?? 0), mix: 0 };
      else if (phase === "mix" && manual) manual.mix = mix ?? 0;
      else if (phase === "release") manual = null;
      update();
    };
    const observer = new ResizeObserver(measure);
    [home, stage, scene, composition, products, timeline].forEach((element) => observer.observe(element));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("home-signal-manual", onManual);
    media.addEventListener("change", measure);
    measure();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("home-signal-manual", onManual);
      media.removeEventListener("change", measure);
      delete products.dataset.homeSignalAnchor;
    };
  }, [locale]);
  return <svg ref={svgRef} className="home-signal-spine" aria-hidden="true" focusable="false" fill="none" preserveAspectRatio="none">
    <defs><linearGradient ref={gradientRef} id="home-signal-ink" gradientUnits="userSpaceOnUse" x1="0" x2="0">
      <stop offset="0" stopColor="#151616" stopOpacity=".34" />
      <stop offset=".2" stopColor="#151616" stopOpacity=".25" />
      <stop offset=".4" stopColor="#151616" stopOpacity=".14" />
      <stop offset="1" stopColor="#151616" stopOpacity=".045" />
    </linearGradient></defs>
    <path ref={pathRef} className="home-signal-primary" pathLength="1" strokeDasharray="0 1" stroke="url(#home-signal-ink)" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
  </svg>;
}
