import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue, type PanInfo } from "framer-motion";
import { getLocalizedPath } from "../../i18n";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";

const destinations = ["#products", "#research", "#worlds", "/work", "/immersive", "/offer"] as const;
const settle = { duration: 0.64, ease: [0.22, 1, 0.36, 1] as const };
const wrap = (index: number) => (index + destinations.length) % destinations.length;
// The same clock includes the approach from Hero, the pinned field, and its exit.
const territoryStops = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const boundaryDeadband = 0;
const manualDuration = 0.66;
const signalExitMargin = 80;
const dissolve = (value: number, start: number, end: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

function territoryAt(progress: number, current: number) {
  let next = current;
  while (next < 5 && progress > (territoryStops[next] + territoryStops[next + 1]) / 2 + boundaryDeadband) next++;
  while (next > 0 && progress < (territoryStops[next - 1] + territoryStops[next]) / 2 - boundaryDeadband) next--;
  return next;
}

// Continuous carriers fold through the brand origin; each territory changes their pressure.
function signalPath(lane: number, territory: number, compact: boolean, rightExit = false, terminalUserX = 1460) {
  const d = lane - 6;
  const pressure = [0, 42, -34, 24, -50, 8][territory];
  if (compact) return `M${-100 + d * 9} -60 C${80 + d * 8} ${40 + pressure} ${180 + d * 3} ${168 + d * 5} 300 ${168 + d * 4} C${450 + d * 4} ${168 + d * 4} ${540 + d * 10} ${320 + pressure} ${490 + d * 7} 420 S${210 + d * 10} 600 ${420 + d * 7} 760`;
  const terminal = rightExit ? `S1180 ${430 + d * 13} ${terminalUserX} ${430 + d * 13}` : `S1100 ${384 + pressure + d * 13} 1360 ${460 + d * 20}`;
  return `M-140 ${56 + d * 17} C${80 + d * 10} ${30 + pressure + d * 14} ${85 + d * 8} ${316 + d * 5} 324 ${316 + d * 4} C${520 + d * 8} ${316 + d * 4} ${438 + d * 8} ${568 + pressure + d * 10} 730 ${548 + pressure + d * 9} ${terminal}`;
}

function SignalPath({ lane, compact, progress, drawing, primary = false, fixedGeometry = false, terminalUserX = 1460, primaryStrokeWidth = 2 }: {
  lane: number; compact: boolean; progress: MotionValue<number>; drawing: MotionValue<number> | number; primary?: boolean; fixedGeometry?: boolean; terminalUserX?: number; primaryStrokeWidth?: number;
}) {
  const geometry = useTransform(progress, territoryStops, territoryStops.map((_, index) => signalPath(lane, index, compact)));
  return <motion.path className={primary ? "eco-system-signal" : undefined} d={fixedGeometry ? signalPath(lane, 0, compact, true, terminalUserX) : geometry} initial={false}
    style={{ pathLength: drawing }} stroke="currentColor" vectorEffect={primary && fixedGeometry ? undefined : "non-scaling-stroke"}
    strokeWidth={primary ? primaryStrokeWidth : lane === 6 ? 1.6 : 0.65}
    strokeOpacity={primary ? 0.32 : lane === 6 ? 0.5 : 0.07 + (6 - Math.abs(lane - 6)) * 0.019} />;
}

function TerritoryTitle({ title }: { title: string }) {
  const [primary, secondary] = title.split(" / ");
  return <>{primary}{secondary && <span><i>/ </i>{secondary}</span>}</>;
}

export default function EcosystemMap({ locale, navigate }: HomeSectionProps) {
  const copy = homeCopy[locale];
  const fieldMaskId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [terminalUserX, setTerminalUserX] = useState(1460);
  const [primaryStrokeWidth, setPrimaryStrokeWidth] = useState(2);
  const copyLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const suppressOpenUntil = useRef(0);
  const selectionIndex = useRef(0);
  const manualTarget = useRef<number | null>(null);
  const manualTransition = useRef<{ fromIndex: number; toIndex: number; signalFrom: number; signalTo: number } | null>(null);
  const manualAnimation = useRef<{ stop: () => void } | null>(null);
  const manualMix = useMotionValue(0);
  const [selection, setSelection] = useState({ index: 0, direction: 1 });
  const [announcement, setAnnouncement] = useState("");
  const [input, setInput] = useState(() => ({ phone: window.matchMedia("(max-width: 767px)").matches, touch: window.matchMedia("(pointer: coarse)").matches, short: window.matchMedia("(max-height: 559px)").matches }));
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const touch = window.matchMedia("(pointer: coarse)");
    const short = window.matchMedia("(max-height: 559px)");
    const update = () => setInput({ phone: phone.matches, touch: touch.matches, short: short.matches });
    phone.addEventListener("change", update);
    touch.addEventListener("change", update);
    short.addEventListener("change", update);
    return () => { phone.removeEventListener("change", update); touch.removeEventListener("change", update); short.removeEventListener("change", update); };
  }, []);
  // Reuse the old 1024px boundary and reduced-motion subscription.
  const { isMobile, reducedMotion } = useMobileMotion({ enabled: false });
  const scrollDriven = !isMobile && !reducedMotion && !input.short;
  useLayoutEffect(() => {
    if (!scrollDriven || !fieldRef.current) return;
    const field = fieldRef.current;
    const measure = () => {
      const rect = field.getBoundingClientRect();
      if (!rect.width) return;
      const next = Math.max(1460, Math.ceil(((window.innerWidth + signalExitMargin - rect.left) / rect.width) * 1200));
      setTerminalUserX((current) => current === next ? current : next);
      // Native SVG pathLength follows the scaled path only without the
      // non-scaling stroke effect. Compensate its stroke width at layout time.
      const scale = Math.sqrt((rect.width / 1200) * (rect.height / 640));
      const width = 2 / scale;
      setPrimaryStrokeWidth((current) => Math.abs(current - width) < 0.01 ? current : width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(field);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [scrollDriven]);
  const { index: activeIndex, direction } = selection;
  const title = copy.chambers[activeIndex][0];
  const destination = destinations[activeIndex];
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end end"] });
  const boundedProgress = useTransform(scrollYProgress, (value) => Math.max(0, Math.min(1, value)));
  // Overdamped and precise at unit progress scale: no overshoot or early rounding at boundaries.
  const scrollClock = useSpring(boundedProgress, { stiffness: 180, damping: 28, mass: 0.48, restDelta: 0.0001, restSpeed: 0.001 });
  // A persistent scene value follows the scroll clock without another smoothing stage.
  // Manual modes animate this same value from its current position, never a stale clock.
  const progress = useMotionValue(territoryStops[0]);
  useMotionValueEvent(scrollClock, "change", (value) => { if (scrollDriven) progress.set(value); });
  // Desktop line motion follows document position directly. Preserve the exact
  // authored opening paths; touch retains its existing geometry and clock.
  const desktopSignalProgress = useMotionValue(0);
  useMotionValueEvent(boundedProgress, "change", (value) => {
    if (scrollDriven && !manualTransition.current) desktopSignalProgress.set(value);
  });
  const signalProgress = scrollDriven ? desktopSignalProgress : progress;
  // Pace the visible right exit through the final territory, then complete
  // the tail beyond the viewport. Geometry and normal scroll remain direct.
  const draw = useTransform(signalProgress, [0.08, 0.9, 0.98, 1], [0.03, 0.82, 0.9, 1]);
  const carrierDraw = useTransform(signalProgress, [0, 0.32, 0.96, 1], [0.08, 0.42, 1, 1]);
  const carrierOpacity = useTransform(signalProgress, [0.8, 0.92], [1, 0.1]);
  const coreScale = useTransform(progress, [0, 0.23, 0.3], [0.8, 0.98, 1]);
  const coreOpacity = useTransform(progress, [0, 0.2, 0.3], [0.12, 0.9, 1]);
  const fieldOpacity = useTransform(signalProgress, [0, 0.3], [0.1, 1]);
  const handoffScale = useTransform(progress, [0.9, 1], [0.08, 1]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const depthX = useSpring(pointerX, { stiffness: 90, damping: 26, mass: 0.6 });
  const depthY = useSpring(pointerY, { stiffness: 90, damping: 26, mass: 0.6 });
  const fieldX = useTransform(depthX, (value) => value * -0.6);
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-160, 0, 160], [-9, 0, 9]);

  const updateDesktopCopy = useCallback((value: number) => {
    if (!scrollDriven || manualTransition.current) return;
    if (sceneRef.current?.querySelector(".eco-territory-content")?.contains(document.activeElement)) {
      value = territoryStops[selectionIndex.current];
    }
    // Stagger the adjacent fades so neither title dominates at the midpoint.
    // These windows stay disjoint across the 0.1 territory spans.
    copyLayerRefs.current.forEach((layer, index) => {
      if (!layer) return;
      const enterBoundary = territoryStops[index] - 0.05;
      const exitBoundary = territoryStops[index] + 0.05;
      const enter = index === 0 ? 1 : dissolve(value, enterBoundary - 0.008, enterBoundary + 0.024);
      const exit = index === 5 ? 0 : dissolve(value, exitBoundary - 0.024, exitBoundary + 0.008);
      layer.style.opacity = String(enter * (1 - exit));
      layer.style.transform = `translateY(${4 * (1 - enter) - 4 * exit}px)`;
    });
  }, [scrollDriven]);
  useMotionValueEvent(boundedProgress, "change", updateDesktopCopy);
  useLayoutEffect(() => { updateDesktopCopy(boundedProgress.get()); }, [locale, boundedProgress, updateDesktopCopy]);

  const commitSelection = useCallback((next: number) => {
    if (next === selectionIndex.current) return;
    const direction = next > selectionIndex.current ? 1 : -1;
    selectionIndex.current = next;
    setSelection({ index: next, direction });
  }, []);
  const syncSelection = useCallback((value: number) => {
    if (!scrollDriven || manualTransition.current || !sceneRef.current) return;
    // Keep a keyboard user's destination mounted while it has focus.
    if (sceneRef.current.querySelector(".eco-territory-content")?.contains(document.activeElement)) return;
    const next = territoryAt(value, selectionIndex.current);
    commitSelection(next);
  }, [scrollDriven, commitSelection]);
  useMotionValueEvent(boundedProgress, "change", syncSelection);
  const updateManualVisual = useCallback((mix: number) => {
    const manual = manualTransition.current;
    if (!manual) return;
    const exit = dissolve(mix, 0, 0.65);
    const enter = dissolve(mix, 0.35, 1);
    copyLayerRefs.current.forEach((layer, index) => {
      if (!layer) return;
      const same = manual.fromIndex === manual.toIndex && index === manual.toIndex;
      const source = index === manual.fromIndex;
      const target = index === manual.toIndex;
      layer.style.opacity = String(same ? 1 : source ? 1 - exit : target ? enter : 0);
      layer.style.transform = `translateY(${same ? 0 : source ? -4 * exit : target ? 4 * (1 - enter) : 0}px)`;
    });
    desktopSignalProgress.set(manual.signalFrom + (manual.signalTo - manual.signalFrom) * mix);
    if (mix >= 0.5) commitSelection(manual.toIndex);
  }, [desktopSignalProgress, commitSelection]);
  useMotionValueEvent(manualMix, "change", updateManualVisual);

  const cancelManual = useCallback(() => {
    manualTarget.current = null;
    if (!manualTransition.current) return;
    manualAnimation.current?.stop();
    manualAnimation.current = null;
    manualTransition.current = null;
    const actual = boundedProgress.get();
    desktopSignalProgress.set(actual);
    syncSelection(actual);
    updateDesktopCopy(actual);
  }, [boundedProgress, desktopSignalProgress, syncSelection, updateDesktopCopy]);
  useEffect(() => () => manualAnimation.current?.stop(), []);
  useLayoutEffect(() => {
    manualAnimation.current?.stop();
    manualAnimation.current = null;
    manualTransition.current = null;
    manualTarget.current = null;
    if (scrollDriven) desktopSignalProgress.set(boundedProgress.get());
  }, [scrollDriven, boundedProgress, desktopSignalProgress]);

  useEffect(() => {
    const cancelRequest = cancelManual;
    const inNavigation = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest(".eco-territory-navigation"));
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (!event.defaultPrevented && !(inNavigation(event.target) && (event.key === "Enter" || event.key === " "))) cancelRequest();
    };
    const onPointer = (event: PointerEvent) => { if (!inNavigation(event.target)) cancelRequest(); };
    const onScrollEnd = () => {
      const stage = stageRef.current;
      if (manualTarget.current === null || !stage) return;
      const rect = stage.getBoundingClientRect();
      const actual = (window.innerHeight - rect.top) / rect.height;
      if (Math.abs(actual - territoryStops[manualTarget.current]) > 0.002) cancelRequest();
    };
    window.addEventListener("wheel", cancelRequest, { passive: true });
    window.addEventListener("touchstart", cancelRequest, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      window.removeEventListener("wheel", cancelRequest);
      window.removeEventListener("touchstart", cancelRequest);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [cancelManual]);

  const scrollToTerritory = useCallback((index: number, behavior: ScrollBehavior) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - window.innerHeight + territoryStops[index] * rect.height, behavior });
  }, []);

  // Reconcile a touch selection with the new timeline when the layout crosses 1024px.
  useLayoutEffect(() => {
    if (scrollDriven) {
      progress.set(scrollClock.get());
      return;
    }
    manualTarget.current = null;
    const animation = animate(progress, territoryStops[activeIndex], reducedMotion ? { duration: 0 } : settle);
    return () => animation.stop();
  }, [activeIndex, reducedMotion, scrollDriven, progress, scrollClock]);

  useEffect(() => {
    if (!scrollDriven) return;
    const frame = requestAnimationFrame(() => {
      if (sceneRef.current?.querySelector(".eco-territory-content")?.contains(document.activeElement)) {
        scrollToTerritory(selectionIndex.current, "instant");
        scrollClock.jump(territoryStops[selectionIndex.current]);
      } else syncSelection(boundedProgress.get());
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollDriven, boundedProgress, scrollClock, scrollToTerritory, syncSelection]);

  function select(index: number, nextDirection = index >= activeIndex ? 1 : -1) {
    const next = wrap(index);
    if (scrollDriven) {
      // Read one dominant source even if a scroll dissolve or another click is underway.
      const fromIndex = copyLayerRefs.current.reduce((best, layer, current) =>
        Number(layer?.style.opacity || 0) > Number(copyLayerRefs.current[best]?.style.opacity || 0) ? current : best,
      selectionIndex.current);
      manualAnimation.current?.stop();
      const manual = { fromIndex, toIndex: next, signalFrom: desktopSignalProgress.get(), signalTo: territoryStops[next] };
      manualTransition.current = manual;
      manualTarget.current = next;
      commitSelection(fromIndex);
      // Establish the gate before repositioning, so the raw clock cannot show intermediates.
      manualMix.set(0);
      updateManualVisual(0);
      scrollToTerritory(next, "instant");
      manualAnimation.current = animate(manualMix, 1, {
        duration: manualDuration, ease: "easeInOut",
        onComplete: () => {
          if (manualTransition.current !== manual) return;
          commitSelection(next);
          manualTransition.current = null;
          manualAnimation.current = null;
          manualTarget.current = null;
          const actual = boundedProgress.get();
          desktopSignalProgress.set(actual);
          syncSelection(actual);
          updateDesktopCopy(actual);
        },
      });
    }
    else {
      selectionIndex.current = next;
      setSelection({ index: next, direction: nextDirection });
    }
    setAnnouncement(`${String(next + 1).padStart(2, "0")} / 06 — ${copy.chambers[next][0]}`);
  }
  function step(direction: number) {
    select((manualTarget.current ?? selectionIndex.current) + direction, direction);
  }
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const requested = manualTarget.current ?? selectionIndex.current;
    const keys: Record<string, number> = { ArrowRight: requested + 1, ArrowLeft: requested - 1, Home: 0, End: 5 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], event.key === "ArrowLeft" ? -1 : 1);
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 18);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 12);
  }
  function onDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    suppressOpenUntil.current = Date.now() + 360;
    if (event.type === "pointercancel" || event.type === "touchcancel") return;
    const intent = info.offset.x + info.velocity.x * 0.18;
    if (Math.abs(intent) < 72) return;
    step(intent < 0 ? 1 : -1);
  }
  const transition = reducedMotion ? { duration: 0 } : isMobile ? settle : { ...settle, duration: 0.28 };
  const controls = {
    previous: locale === "es" ? "Territorio anterior" : "Previous territory",
    next: locale === "es" ? "Siguiente territorio" : "Next territory",
    swipe: locale === "es" ? "Desliza para explorar" : "Swipe to explore",
    prevLabel: locale === "es" ? "Anterior" : "Prev",
    nextLabel: locale === "es" ? "Siguiente" : "Next",
  };

  return <HomeSection id="ecosystem" className="eco-system">
    <div ref={stageRef} className="eco-system-stage">
      <div ref={sceneRef} className="eco-system-scene" data-active-index={activeIndex}
        onPointerMove={onPointerMove} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
        <header className="eco-system-heading">
          <SectionLabel number="02">{copy.index}</SectionLabel>
          <div className="eco-system-intro"><h2 id="ecosystem-title">{copy.mapTitle}</h2><p>{copy.mapIntro}</p></div>
        </header>
        <MobileMotionSection className="eco-system-reveal" variant="media" delay="soft">
          <div className="eco-system-composition">
            <motion.div ref={fieldRef} className="eco-system-field" aria-hidden="true" data-scroll-driven={scrollDriven}
              style={reducedMotion ? undefined : { x: fieldX, opacity: scrollDriven ? fieldOpacity : 1, y: 0 }}>
              <svg viewBox={input.phone ? "0 0 600 720" : "0 0 1200 640"} preserveAspectRatio="none" fill="none">
                {scrollDriven && <defs>
                  <linearGradient id={`${fieldMaskId}-fade`} gradientUnits="userSpaceOnUse" x1="0" x2="144" y1="0" y2="0">
                    <stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" />
                  </linearGradient>
                  <mask id={fieldMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={Math.max(1600, terminalUserX + 100)} height="640">
                    <rect width={Math.max(1600, terminalUserX + 100)} height="640" fill={`url(#${fieldMaskId}-fade)`} />
                  </mask>
                </defs>}
                <g mask={scrollDriven ? `url(#${fieldMaskId})` : undefined}>
                <motion.g style={{ opacity: scrollDriven ? carrierOpacity : 1 }}>
                  {Array.from({ length: 13 }, (_, lane) => <SignalPath key={lane} lane={lane} compact={input.phone}
                    progress={signalProgress} fixedGeometry={scrollDriven} terminalUserX={terminalUserX} drawing={scrollDriven ? carrierDraw : 1} />)}
                </motion.g>
                <SignalPath lane={6} primary compact={input.phone} progress={signalProgress} fixedGeometry={scrollDriven} terminalUserX={terminalUserX} primaryStrokeWidth={scrollDriven ? primaryStrokeWidth : 2} drawing={scrollDriven ? draw : 1} />
                </g>
              </svg>
            </motion.div>
            <motion.div className="eco-system-origin" style={reducedMotion ? undefined : { x: depthX, y: depthY }}>
              <motion.div className="eco-system-mark" style={scrollDriven ? { scale: coreScale, opacity: coreOpacity } : undefined}>
                <img src="/brand/brenych-monogram.png" width="404" height="427" alt="Brenych Studio" decoding="async" draggable="false" />
              </motion.div>
              <span className="eco-system-origin-caption">{copy.center}</span>
              <span className="eco-system-origin-coordinate" aria-hidden="true">BS / 00—06</span>
            </motion.div>
            <div className="eco-territory-deck">
              <div className="eco-territory-ghost" aria-hidden="true"><span>0{wrap(activeIndex + 1) + 1}</span><span>{copy.chambers[wrap(activeIndex + 1)][0]}</span></div>
              <motion.div className="eco-territory-plane" drag={isMobile || input.touch ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} dragMomentum={false}
                onDragStart={() => { suppressOpenUntil.current = Infinity; }} onDragEnd={onDragEnd}
                style={{ x: dragX, rotateY: reducedMotion ? 0 : dragRotate, touchAction: "pan-y" }}
                onClickCapture={(event) => { if (Date.now() < suppressOpenUntil.current) { event.preventDefault(); event.stopPropagation(); } }}>
                <div className="eco-territory-meta"><span className="eco-territory-count">0{activeIndex + 1}<span> / 06</span></span><span className="eco-territory-instruction">{isMobile ? controls.swipe : copy.chamberHint}</span></div>
                <div className="eco-territory-content" onBlur={() => requestAnimationFrame(() => {
                  syncSelection(boundedProgress.get());
                  updateDesktopCopy(boundedProgress.get());
                })}>
                  {scrollDriven ? <div className="eco-territory-copy-stack">
                    {copy.chambers.map(([layerTitle, description], index) => <div key={index}
                      ref={(element) => { copyLayerRefs.current[index] = element; }}
                      className="eco-territory-copy eco-territory-copy-layer" data-copy-index={index} aria-hidden={index !== activeIndex}>
                      <h3><TerritoryTitle title={layerTitle} /></h3><p>{description}</p>
                    </div>)}
                  </div> : <motion.div key={`${locale}-${activeIndex}`} className="eco-territory-copy" custom={direction}
                    variants={{
                      enter: (way: number) => ({ opacity: 0, x: reducedMotion ? 0 : way * (isMobile ? 38 : 0), y: reducedMotion || isMobile ? 0 : 8, rotateY: reducedMotion || !isMobile ? 0 : way * 7, rotateZ: reducedMotion || !isMobile ? 0 : way * 1.5 }),
                      active: { opacity: 1, x: 0, y: 0, rotateY: 0, rotateZ: 0 },
                    }} initial="enter" animate="active" transition={transition}>
                    <h3><TerritoryTitle title={title} /></h3><p>{copy.chambers[activeIndex][1]}</p>
                  </motion.div>}
                    {destination.startsWith("#") ? <a href={destination} className="eco-territory-link">{copy.chamberHint}<Arrow /></a>
                      : <HomeLink href={getLocalizedPath(destination, locale)} navigate={navigate} className="eco-territory-link">{copy.chamberHint}<Arrow /></HomeLink>}
                </div>
              </motion.div>
            </div>
          </div>
        </MobileMotionSection>
        <nav className="eco-territory-navigation" aria-label={copy.chamberHint} onKeyDown={onKeyDown}>
          <button type="button" className="eco-territory-step" aria-label={controls.previous} onClick={() => step(-1)}><span aria-hidden="true">←</span><span>{controls.prevLabel}</span></button>
          <div className="eco-territory-pagination">
            {copy.chambers.map(([name], index) => <button type="button" key={name} aria-label={`${String(index + 1).padStart(2, "0")} — ${name}`}
              aria-current={index === activeIndex ? "true" : undefined} onClick={() => select(index)}>
              <span className="eco-territory-tick" aria-hidden="true" /><span className="eco-territory-nav-index" aria-hidden="true">0{index + 1}</span><span className="eco-territory-nav-name" aria-hidden="true">{name.split(" / ")[0]}</span>
            </button>)}
          </div>
          <button type="button" className="eco-territory-step" aria-label={controls.next} onClick={() => step(1)}><span>{controls.nextLabel}</span><span aria-hidden="true">→</span></button>
        </nav>
        <p className="eco-system-announcement" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
        <div className="eco-system-handoff"><motion.span aria-hidden="true" style={{ scaleX: scrollDriven ? handoffScale : 1 }} /><a href="#products"><span>03 / {copy.products}</span><span aria-hidden="true">↓</span></a></div>
      </div>
    </div>
  </HomeSection>;
}
