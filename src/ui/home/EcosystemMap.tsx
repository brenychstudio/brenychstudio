import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue, type PanInfo } from "framer-motion";
import { getLocalizedPath } from "../../i18n";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { copyPhase, copyStackHeight, signalPathFromPressure, signalThread, smoothPressure, smoothStep, territoryStops } from "./ecosystemFlow";

const destinations = ["#products", "#research", "#worlds", "/work", "/immersive", "/offer"] as const;
const settle = { duration: 0.64, ease: [0.22, 1, 0.36, 1] as const };
const wrap = (index: number) => (index + destinations.length) % destinations.length;
// The same clock includes the approach from Hero, the pinned field, and its exit.
const boundaryDeadband = 0.012;

function territoryAt(progress: number, current: number) {
  let next = current;
  while (next < 5 && progress > (territoryStops[next] + territoryStops[next + 1]) / 2 + boundaryDeadband) next++;
  while (next > 0 && progress < (territoryStops[next - 1] + territoryStops[next]) / 2 - boundaryDeadband) next--;
  return next;
}

function SignalPath({ lane, compact, progress, drawing, primary = false }: {
  lane: number; compact: boolean; progress: MotionValue<number>; drawing: MotionValue<number> | number; primary?: boolean;
}) {
  const geometry = useTransform(progress, (value) => signalPathFromPressure(lane, smoothPressure(value), compact));
  return <motion.path className={primary ? "eco-system-signal" : undefined} d={geometry} initial={false}
    style={{ pathLength: drawing }} stroke="currentColor" vectorEffect="non-scaling-stroke"
    strokeWidth={primary ? 2 : lane === 6 ? 1.6 : 0.65}
    strokeOpacity={primary ? 0.32 : lane === 6 ? 0.5 : 0.07 + (6 - Math.abs(lane - 6)) * 0.019} />;
}

function CopyLayer({ title, description, index, active, progress }: {
  title: string; description: string; index: number; active: boolean; progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (value) => copyPhase(value, index).opacity);
  const detailOpacity = useTransform(opacity, (value) => value * value);
  const y = useTransform(progress, (value) => copyPhase(value, index).y);
  return <motion.div className="eco-territory-copy eco-territory-copy-layer" data-copy-index={index}
    aria-hidden={!active} style={{ opacity, y }}>
    <h3><TerritoryTitle title={title} /></h3><motion.p style={{ opacity: detailOpacity }}>{description}</motion.p>
  </motion.div>;
}

function DesktopCopy({ chambers, activeIndex, progress, focusIndex }: {
  chambers: readonly (readonly [string, string])[]; activeIndex: number; progress: MotionValue<number>; focusIndex: number | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const heights = useMotionValue<number[]>([]);
  // Explicit keyboard focus holds the copy WITH its protected destination. This
  // is an accessibility hold, not another animated clock or a semantic trigger.
  const presentation = useTransform(progress, (value) => focusIndex === null ? value : territoryStops[focusIndex]);
  const height = useTransform(() => copyStackHeight(presentation.get(), heights.get()));
  useLayoutEffect(() => {
    const layers = Array.from(ref.current?.children ?? []) as HTMLElement[];
    const measure = () => heights.set(layers.map((layer) => layer.getBoundingClientRect().height));
    const observer = new ResizeObserver(measure);
    layers.forEach((layer) => observer.observe(layer));
    measure();
    return () => observer.disconnect();
  }, [chambers, heights]);
  return <motion.div ref={ref} className="eco-territory-copy-stack" style={{ height }}>
    {chambers.map(([title, description], index) => <CopyLayer key={index} title={title} description={description}
      index={index} active={index === activeIndex} progress={presentation} />)}
  </motion.div>;
}

function PrimaryThread({ compact, extended, progress, x, endY }: {
  compact: boolean; extended: boolean; progress: MotionValue<number>; x: MotionValue<number>; endY: number;
}) {
  const shape = useTransform(progress, (value) => signalThread(value, endY));
  const geometry = useTransform(() => extended ? shape.get().path : signalPathFromPressure(6, smoothPressure(progress.get()), compact));
  const drawing = useTransform(() => extended ? shape.get().drawing : 1);
  const opacity = useTransform(progress, (value) => extended ? 0.32 * (0.3 + 0.7 * smoothStep(value / 0.3)) : 0.32);
  return <motion.svg className="eco-system-thread" data-extended={extended} data-home-signal-exit="ecosystem"
    viewBox={compact ? "0 0 600 720" : "0 0 1200 640"} preserveAspectRatio="none" fill="none" aria-hidden="true" style={{ x }}>
    <motion.path className="eco-system-signal" d={geometry} initial={false}
      style={{ pathLength: drawing, opacity }} stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    {extended && <g data-home-signal-entry="products" transform={`translate(760 ${endY})`} />}
  </motion.svg>;
}

function TerritoryTitle({ title }: { title: string }) {
  const [primary, secondary] = title.split(" / ");
  return <>{primary}{secondary && <span><i>/ </i>{secondary}</span>}</>;
}

export default function EcosystemMap({ locale, navigate }: HomeSectionProps) {
  const copy = homeCopy[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [threadEndY, setThreadEndY] = useState(1400);
  const suppressOpenUntil = useRef(0);
  const selectionIndex = useRef(0);
  const manualTarget = useRef<number | null>(null);
  const [selection, setSelection] = useState({ index: 0, direction: 1 });
  const [announcement, setAnnouncement] = useState("");
  const [focusedCopy, setFocusedCopy] = useState<number | null>(null);
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
  const { index: activeIndex, direction } = selection;
  const title = copy.chambers[activeIndex][0];
  const destination = destinations[activeIndex];
  // Extend the same measured clock past the sticky release into early Products.
  // Scaling preserves the original canonical territory positions and scroll inverse.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const rangeScale = useMotionValue(1);
  const boundedProgress = useTransform(() => Math.max(0, Math.min(1.4, scrollYProgress.get() * rangeScale.get())));
  useLayoutEffect(() => {
    const stage = stageRef.current, scene = sceneRef.current;
    const field = scene?.querySelector<SVGSVGElement>(".eco-system-thread");
    const products = document.querySelector<HTMLElement>(".eco-products-stage__timeline");
    if (!stage || !scene || !field || !products) return;
    const measure = () => {
      const s = stage.getBoundingClientRect(), c = scene.getBoundingClientRect(), f = field.getBoundingClientRect();
      rangeScale.set((s.height + window.innerHeight) / Math.max(1, s.height));
      // Measure the field at its eventual sticky release, independent of current scroll.
      const releasedTop = s.top + s.height - c.height + (f.top - c.top);
      const destination = products.getBoundingClientRect().top + window.innerHeight * 0.28;
      setThreadEndY(Math.max(1000, (destination - releasedTop) * 640 / Math.max(1, f.height)));
    };
    const observer = new ResizeObserver(measure);
    [stage, scene, field, products].forEach((element) => observer.observe(element));
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [locale, rangeScale, scrollDriven]);
  // Overdamped and precise at unit progress scale: no overshoot or early rounding at boundaries.
  const scrollClock = useSpring(boundedProgress, { stiffness: 180, damping: 28, mass: 0.48, restDelta: 0.0001, restSpeed: 0.001 });
  // A persistent scene value follows the scroll clock without another smoothing stage.
  // Manual modes animate this same value from its current position, never a stale clock.
  const progress = useMotionValue(territoryStops[0]);
  useMotionValueEvent(scrollClock, "change", (value) => { if (scrollDriven) progress.set(value); });
  const carrierDraw = useTransform(progress, [0, 0.32, 0.96, 1], [0.08, 0.42, 1, 1]);
  const coreScale = useTransform(progress, [0, 0.23, 0.3], [0.8, 0.98, 1]);
  const coreOpacity = useTransform(progress, [0, 0.2, 0.3], [0.12, 0.9, 1]);
  const fieldOpacity = useTransform(progress, [0, 0.3, 0.92, 1], [0.1, 1, 1, 0.12]);
  const exitY = useTransform(progress, [0.92, 1], [0, 38]);
  const handoffScale = useTransform(progress, [0.9, 1], [0.08, 1]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const depthX = useSpring(pointerX, { stiffness: 90, damping: 26, mass: 0.6 });
  const depthY = useSpring(pointerY, { stiffness: 90, damping: 26, mass: 0.6 });
  const fieldX = useTransform(depthX, (value) => value * -0.6);
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-160, 0, 160], [-9, 0, 9]);

  const syncSelection = useCallback((value: number) => {
    if (!scrollDriven || !sceneRef.current) return;
    // Keep a keyboard user's destination mounted while it has focus.
    if (sceneRef.current.querySelector(".eco-territory-content")?.contains(document.activeElement)) return;
    const next = territoryAt(value, selectionIndex.current);
    if (next === selectionIndex.current) return;
    const direction = next > selectionIndex.current ? 1 : -1;
    selectionIndex.current = next;
    setSelection({ index: next, direction });
  }, [scrollDriven]);
  useMotionValueEvent(progress, "change", (value) => {
    syncSelection(value);
    if (manualTarget.current !== null && Math.abs(value - territoryStops[manualTarget.current]) < 0.0005) manualTarget.current = null;
  });

  useEffect(() => {
    const cancelRequest = () => { manualTarget.current = null; };
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
  }, []);

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
      } else syncSelection(progress.get());
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollDriven, progress, scrollClock, scrollToTerritory, syncSelection]);

  function select(index: number, nextDirection = index >= activeIndex ? 1 : -1) {
    const next = wrap(index);
    if (scrollDriven) {
      manualTarget.current = next;
      scrollToTerritory(next, "smooth");
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
            <motion.div className="eco-system-field" aria-hidden="true"
              style={reducedMotion ? undefined : { x: fieldX, opacity: scrollDriven ? fieldOpacity : 1, y: scrollDriven ? exitY : 0 }}>
              <svg viewBox={input.phone ? "0 0 600 720" : "0 0 1200 640"} preserveAspectRatio="none" fill="none">
                {Array.from({ length: 13 }, (_, lane) => <SignalPath key={lane} lane={lane} compact={input.phone}
                  progress={progress} drawing={scrollDriven ? carrierDraw : 1} />)}
              </svg>
            </motion.div>
            <PrimaryThread compact={input.phone} extended={scrollDriven} progress={progress} x={fieldX} endY={threadEndY} />
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
                <div className="eco-territory-content" onFocusCapture={() => setFocusedCopy(selectionIndex.current)}
                  onBlur={() => requestAnimationFrame(() => {
                    if (sceneRef.current?.querySelector(".eco-territory-content")?.contains(document.activeElement)) return;
                    setFocusedCopy(null);
                    syncSelection(progress.get());
                  })}>
                  {scrollDriven ? <DesktopCopy chambers={copy.chambers} activeIndex={activeIndex} progress={progress} focusIndex={focusedCopy} />
                    : <motion.div key={`${locale}-${activeIndex}`} className="eco-territory-copy" custom={direction}
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
