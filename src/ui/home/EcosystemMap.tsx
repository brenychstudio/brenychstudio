import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue, type PanInfo } from "framer-motion";
import { getLocalizedPath } from "../../i18n";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { copyPhase, copyStackHeight, homeSignalManual, manualCopyHeight, signalPathFromPressure, smoothPressure, territoryStops } from "./ecosystemFlow";

const destinations = ["#products", "#research", "#worlds", "/work", "/immersive", "/offer"] as const;
const settle = { duration: 0.64, ease: [0.22, 1, 0.36, 1] as const };
const wrap = (index: number) => (index + destinations.length) % destinations.length;
// The same clock includes the approach from Hero, the pinned field, and its exit.

function territoryAt(progress: number, current: number) {
  let next = current;
  while (next < 5 && progress > (territoryStops[next] + territoryStops[next + 1]) / 2) next++;
  while (next > 0 && progress < (territoryStops[next - 1] + territoryStops[next]) / 2) next--;
  return next;
}

function SignalPath({ lane, compact, progress, drawing }: {
  lane: number; compact: boolean; progress: MotionValue<number>; drawing: MotionValue<number> | number;
}) {
  const geometry = useTransform(progress, (value) => signalPathFromPressure(lane, smoothPressure(value), compact));
  return <motion.path d={geometry} initial={false}
    style={{ pathLength: drawing }} stroke="currentColor" vectorEffect="non-scaling-stroke"
    strokeWidth={lane === 6 ? 1.2 : 0.65}
    strokeOpacity={lane === 6 ? 0.16 : 0.04 + (6 - Math.abs(lane - 6)) * 0.012} />;
}

function CopyLayer({ title, description, index, active, weights }: {
  title: string; description: string; index: number; active: boolean; weights: MotionValue<number[]>;
}) {
  const opacity = useTransform(weights, (value) => value[index]);
  const detailOpacity = useTransform(opacity, (value) => value * value);
  const y = useTransform(opacity, (value) => 5 * (1 - value));
  return <motion.div className="eco-territory-copy eco-territory-copy-layer" data-copy-index={index}
    aria-hidden={!active} style={{ opacity, y }}>
    <h3><TerritoryTitle title={title} /></h3><motion.p style={{ opacity: detailOpacity }}>{description}</motion.p>
  </motion.div>;
}

function DesktopCopy({ chambers, activeIndex, progress, focusIndex, focusHeight, weights, manualIndex, manualFrom, manualMix }: {
  chambers: readonly (readonly [string, string])[]; activeIndex: number; progress: MotionValue<number>; focusIndex: number | null;
  weights: MotionValue<number[]>; manualIndex: MotionValue<number>; manualFrom: MotionValue<number[]>; manualMix: MotionValue<number>;
  focusHeight: number | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const heights = useMotionValue<number[]>([]);
  // Explicit keyboard focus holds the copy WITH its protected destination. This
  // is an accessibility hold, not another animated clock or a semantic trigger.
  const presentation = useTransform(progress, (value) => focusIndex === null ? value : territoryStops[focusIndex]);
  const height = useTransform(() => focusIndex !== null
    ? Math.max(focusHeight ?? 0, heights.get()[focusIndex] ?? 0)
    : manualIndex.get() < 0 ? copyStackHeight(presentation.get(), heights.get())
      : manualCopyHeight(heights.get(), manualFrom.get(), manualIndex.get(), manualMix.get()));
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
      index={index} active={index === activeIndex} weights={weights} />)}
  </motion.div>;
}

function TerritoryTitle({ title }: { title: string }) {
  const [primary, secondary] = title.split(" / ");
  return <>{primary}{secondary && <span><i>/ </i>{secondary}</span>}</>;
}

export default function EcosystemMap({ locale, navigate }: HomeSectionProps) {
  const copy = homeCopy[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const suppressOpenUntil = useRef(0);
  const selectionIndex = useRef(0);
  const manualTarget = useRef<number | null>(null);
  const manualAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const manualIndex = useMotionValue(-1);
  const manualFrom = useMotionValue([1, 0, 0, 0, 0, 0]);
  const manualMix = useMotionValue(1);
  const [visualMode, setVisualMode] = useState<"scroll" | "manual">("scroll");
  const [selection, setSelection] = useState({ index: 0, direction: 1 });
  const [announcement, setAnnouncement] = useState("");
  const [focusedCopy, setFocusedCopy] = useState<number | null>(null);
  const [focusedHeight, setFocusedHeight] = useState<number | null>(null);
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
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => rangeScale.set((stage.offsetHeight + window.innerHeight) / Math.max(1, stage.offsetHeight));
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [rangeScale]);
  // Overdamped and precise at unit progress scale: no overshoot or early rounding at boundaries.
  const scrollClock = useSpring(boundedProgress, { stiffness: 180, damping: 28, mass: 0.48, restDelta: 0.0001, restSpeed: 0.001 });
  // A persistent scene value follows the scroll clock without another smoothing stage.
  // Manual modes animate this same value from its current position, never a stale clock.
  const progress = useMotionValue(territoryStops[0]);
  useMotionValueEvent(scrollClock, "change", (value) => { if (scrollDriven && manualTarget.current === null) progress.set(value); });
  const weights = useTransform(() => {
    if (focusedCopy !== null) return territoryStops.map((_, i) => Number(i === focusedCopy));
    if (manualIndex.get() >= 0) return manualFrom.get().map((weight, i) => weight * (1 - manualMix.get()) + Number(i === manualIndex.get()) * manualMix.get());
    return territoryStops.map((_, i) => copyPhase(progress.get(), i).opacity);
  });
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
    if (!scrollDriven || !sceneRef.current || manualTarget.current !== null) return;
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

  });

  useMotionValueEvent(manualMix, "change", (mix) => {
    const target = manualTarget.current;
    if (target === null) return;
    homeSignalManual({ phase: "mix", mix });
    const blend = manualFrom.get().map((weight, i) => weight * (1 - mix) + Number(i === target) * mix);
    const next = blend.reduce((winner, weight, i) => weight > blend[winner] ? i : winner, selectionIndex.current);
    if (next === selectionIndex.current) return;
    const direction = next >= selectionIndex.current ? 1 : -1;
    selectionIndex.current = next;
    setSelection({ index: next, direction });
  });
  const cancelManual = useCallback(() => {
    if (manualTarget.current === null) return;
    manualAnimation.current?.stop();
    homeSignalManual({ phase: "release" });
    manualTarget.current = null;
    manualIndex.set(-1);
    setVisualMode("scroll");
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const actual = Math.max(0, Math.min(1.4, (window.innerHeight - rect.top) / rect.height));
    scrollClock.jump(actual);
    progress.set(actual);
    syncSelection(actual);
  }, [manualIndex, progress, scrollClock, syncSelection]);
  useEffect(() => {
    const inNavigation = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest(".eco-territory-navigation"));
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (!event.defaultPrevented && !(inNavigation(event.target) && ["Enter", " ", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))) cancelManual();
    };
    const isCopyLink = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest(".eco-territory-link"));
    const onPointer = (event: PointerEvent) => { if (!inNavigation(event.target) && !isCopyLink(event.target)) cancelManual(); };
    const onTouch = (event: TouchEvent) => { if (!inNavigation(event.target) && !isCopyLink(event.target)) cancelManual(); };
    const onScroll = () => {
      const stage = stageRef.current;
      if (manualTarget.current === null || !stage) return;
      const rect = stage.getBoundingClientRect();
      if (Math.abs((window.innerHeight - rect.top) / rect.height - territoryStops[manualTarget.current]) > 0.002) cancelManual();
    };
    window.addEventListener("wheel", cancelManual, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", cancelManual);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [cancelManual]);
  useEffect(() => () => manualAnimation.current?.stop(), []);

  const scrollToTerritory = useCallback((index: number, behavior: ScrollBehavior) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - window.innerHeight + territoryStops[index] * rect.height, behavior });
  }, []);

  // Reconcile a touch selection with the new timeline when the layout crosses 1024px.
  useLayoutEffect(() => {
    if (scrollDriven) {
      if (manualTarget.current === null) progress.set(scrollClock.get());
      return;
    }
    manualAnimation.current?.stop();
    homeSignalManual({ phase: "release" });
    manualTarget.current = null;
    manualIndex.set(-1);
    setVisualMode("scroll");
    const animation = animate(progress, territoryStops[activeIndex], reducedMotion ? { duration: 0 } : settle);
    return () => animation.stop();
  }, [activeIndex, reducedMotion, scrollDriven, progress, scrollClock, manualIndex]);

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
      // Capture the current blend before changing document position. Only these
      // outgoing weights and the requested destination participate in this take.
      const from = weights.get().slice();
      manualAnimation.current?.stop();
      homeSignalManual({ phase: "capture" });
      manualTarget.current = next;
      manualFrom.set(from);
      manualMix.set(0);
      manualIndex.set(next);
      setVisualMode("manual");
      scrollToTerritory(next, "instant");
      scrollClock.jump(territoryStops[next]);
      progress.set(territoryStops[next]);
      manualAnimation.current = animate(manualMix, 1, {
        duration: 0.78, ease: [0.4, 0, 0.2, 1],
        onComplete: () => {
          if (manualTarget.current !== next) return;
          selectionIndex.current = next;
          setSelection({ index: next, direction: nextDirection });
          manualTarget.current = null;
          homeSignalManual({ phase: "release" });
          manualIndex.set(-1);
          setVisualMode("scroll");
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
      <div ref={sceneRef} className="eco-system-scene" data-active-index={activeIndex} data-visual-mode={visualMode}
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
            <motion.div className="eco-system-origin" data-home-signal-anchor="ecosystem-core" style={reducedMotion ? undefined : { x: depthX, y: depthY }}>
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
                <div className="eco-territory-content" onFocusCapture={(event) => {
                  // Pointer focus must protect the destination that was visible
                  // on pointerdown, before the browser dispatches its click.
                  setFocusedCopy(selectionIndex.current);
                  setFocusedHeight(event.currentTarget.querySelector(".eco-territory-copy-stack")?.getBoundingClientRect().height ?? null);
                  manualAnimation.current?.stop();
                  manualTarget.current = null;
                  manualIndex.set(-1);
                  setVisualMode("scroll");
                  homeSignalManual({ phase: "release" });
                }}
                  onBlur={() => requestAnimationFrame(() => {
                    if (sceneRef.current?.querySelector(".eco-territory-content")?.contains(document.activeElement)) return;
                    setFocusedCopy(null);
                    setFocusedHeight(null);
                    syncSelection(progress.get());
                  })}>
                  {scrollDriven ? <DesktopCopy chambers={copy.chambers} activeIndex={activeIndex} progress={progress} focusIndex={focusedCopy} focusHeight={focusedHeight} weights={weights} manualIndex={manualIndex} manualFrom={manualFrom} manualMix={manualMix} />
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
