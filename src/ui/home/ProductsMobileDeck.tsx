import { useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { AnimatePresence, animate, motion, useIsPresent, useMotionValue, useReducedMotion, useTransform, type MotionValue, type PanInfo } from "framer-motion";
import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import PortfolioImage from "../media/PortfolioImage";
import MobileMotionMedia from "../mobile-motion/MobileMotionMedia";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { mobileMotionDurations, mobileMotionEasing } from "../mobile-motion/motionTokens";
import { Arrow, HomeLink, ProjectSignal, type HomeSectionProps } from "./HomePrimitives";
import { projectPath } from "./homeProjectPresentation";
import "./productsMobileDeck.css";

const SETTLE_SECONDS = mobileMotionDurations.section / 1000;
const SETTLE_EASE = [0.22, 1, 0.36, 1] as const;
const DISTANCE_RATIO = 0.25;
const FLICK_VELOCITY = 550;

type CoverProps = HomeSectionProps & {
  project: ProjectRecord;
  index: number;
  direction: number;
  reducedMotion: boolean;
  ghostDrag: MotionValue<number>;
  suppressOpenUntil: RefObject<number>;
  select: (index: number) => void;
  onInteraction: () => void;
};

function MobileProductCover({ project, index, direction, locale, navigate, reducedMotion, ghostDrag, suppressOpenUntil, select, onInteraction }: CoverProps) {
  const present = useIsPresent();
  const planeRef = useRef<HTMLDivElement>(null);
  const meaningfulDrag = useRef(false);
  const width = useMotionValue(360);
  const x = useMotionValue(0);
  const rotateY = useTransform(() => Math.max(-16, Math.min(16, x.get() / (width.get() * 0.22) * 16)));
  const rotateZ = useTransform(() => Math.max(-1.5, Math.min(1.5, x.get() / (width.get() * 0.22) * 1.5)));
  const scale = useTransform(() => 1 - Math.min(1, Math.abs(x.get()) / (width.get() * 0.22)) * 0.015);
  const backingX = useTransform(() => Math.max(-3, Math.min(3, x.get() / (width.get() * 0.22) * -3)));
  const material = project.id === "print-border-studio";
  const poster = resolveHomeProjectPoster(project, locale);
  const live = project.links.find((link) => link.kind === "live");
  const english = locale === "en";
  const terms = material
    ? english ? ["Print borders", "Export logic", "Artwork inspection"] : ["Bordes de impresión", "Lógica de exportación", "Inspección de obra"]
    : english ? ["Creator content intelligence", "Week Packs", "Human-controlled AI"] : ["Inteligencia de contenido", "Week Packs", "IA bajo control humano"];

  const release = () => {
    suppressOpenUntil.current = meaningfulDrag.current ? Date.now() + 360 : 0;
    animate(ghostDrag, 0, { duration: SETTLE_SECONDS, ease: SETTLE_EASE });
  };
  const finishDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    release();
    if (event.type === "pointercancel" || event.type === "touchcancel") return;
    const distanceAccepted = Math.abs(info.offset.x) >= width.get() * DISTANCE_RATIO;
    // Require a small deliberate movement and matching velocity direction. A
    // release jitter or a slow partial drag cannot masquerade as a quick flick.
    const flickAccepted = Math.abs(info.offset.x) >= 12 && Math.abs(info.velocity.x) >= FLICK_VELOCITY
      && Math.sign(info.velocity.x) === Math.sign(info.offset.x);
    if (distanceAccepted || flickAccepted) select(index + (info.offset.x < 0 ? 1 : -1));
  };

  return <motion.article className="products-mobile-deck__card"
    data-project-id={project.id} data-active={present ? "true" : "false"}
    aria-label={project.publicName} aria-hidden={!present || undefined} inert={!present}
    custom={direction}
    variants={{
      enter: (way: number) => ({ opacity: 0, x: way * (reducedMotion ? 16 : 70) }),
      active: { opacity: 1, x: 0 },
      exit: (way: number) => ({ opacity: 0, x: -way * (reducedMotion ? 16 : 100) }),
    }}
    initial="enter" animate="active" exit="exit"
    transition={{ duration: reducedMotion ? 0.18 : SETTLE_SECONDS, ease: SETTLE_EASE }}
  >
    <div className="products-mobile-deck__identity">
      <h3>{material ? <>Print Border<span>Studio</span></> : project.publicName}</h3>
      <p>{material
        ? english ? <>Print preparation<br />&amp; collector presentation</> : <>Preparación de impresión<br />y presentación para coleccionistas</>
        : english ? <>Creator intelligence<br />&amp; planning system</> : <>Inteligencia creativa<br />y planificación</>}</p>
    </div>
    <MobileMotionMedia as="figure" delay="none" className="products-mobile-deck__media">
      <motion.div ref={planeRef} className="products-mobile-deck__plane"
        drag={present ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} dragMomentum={false}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 30 }}
        style={{ x, rotateY: reducedMotion ? 0 : rotateY, rotateZ: reducedMotion ? 0 : rotateZ, scale: reducedMotion ? 1 : scale, touchAction: "pan-y" }}
        onDragStart={() => {
          width.set(planeRef.current?.offsetWidth ?? 360);
          meaningfulDrag.current = false;
          onInteraction();
        }}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) > 8) {
            meaningfulDrag.current = true;
            suppressOpenUntil.current = Infinity;
          }
          ghostDrag.set(Math.min(1, Math.abs(info.offset.x) / (width.get() * DISTANCE_RATIO)));
        }}
        onDragEnd={finishDrag}
        onPointerCancel={release}
      >
        {material && <motion.div className="products-mobile-deck__backing" aria-hidden="true" style={{ x: reducedMotion ? 0 : backingX }}><span>+</span><span>+</span></motion.div>}
        <div className="products-mobile-deck__surface">
          <div className="products-mobile-deck__plate" aria-hidden="true"><span>{material ? "Edition / 02" : "P / 01"}</span><span>{material ? "Artwork / Border / Export" : "Product / Interface"}</span><span>{material ? "+" : "↗"}</span></div>
          <PortfolioImage src={poster.src} alt={poster.alt} sizes="(min-width: 768px) 78vw, 90vw" loading="lazy" draggable={false}
            containerClassName="products-mobile-deck__image" imageClassName="products-mobile-deck__image-element" />
          <span className="products-mobile-deck__finish" aria-hidden="true" />
        </div>
      </motion.div>
      <figcaption><span>{material ? "Material / Paper" : "Digital / Interface"}</span><span>BS — 0{index + 1}</span></figcaption>
    </MobileMotionMedia>
    <div className="products-mobile-deck__detail">
      <ul role="list">{terms.map((term) => <li key={term}>{term}</li>)}</ul>
      <div className="products-mobile-deck__actions">
        <HomeLink href={projectPath(project, locale, "work")} navigate={navigate} className="products-mobile-deck__case">{english ? "Explore case" : "Explorar caso"}<Arrow /></HomeLink>
        {live && <a href={live.href} target="_blank" rel="noreferrer">{english ? "Live proof" : "Demo pública"}<Arrow /></a>}
      </div>
    </div>
  </motion.article>;
}

export default function ProductsMobileDeck({ projects, locale, navigate }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const [selection, setSelection] = useState({ index: 0, direction: 1 });
  const [interacted, setInteracted] = useState(false);
  const selectionRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const suppressOpenUntil = useRef(0);
  const reducedMotion = Boolean(useReducedMotion());
  const ghostDrag = useMotionValue(0);
  const ghostX = useTransform(ghostDrag, [0, 1], [0, -7]);
  const ghostOpacity = useTransform(ghostDrag, [0, 1], [0.3, 0.46]);
  const ghostScale = useTransform(ghostDrag, [0, 1], [0.94, 0.97]);
  const active = projects[selection.index];
  const next = projects[selection.index === 0 ? 1 : 0];
  const material = active?.id === "print-border-studio";
  const english = locale === "en";

  const select = (index: number) => {
    setInteracted(true);
    if (index < 0 || index >= projects.length || index === selectionRef.current) return;
    const departing = rootRef.current?.querySelector('[data-active="true"]');
    if (departing?.contains(document.activeElement)) {
      rootRef.current?.querySelectorAll<HTMLButtonElement>(".products-mobile-deck__selector button")[index]?.focus({ preventScroll: true });
    }
    const direction = index > selectionRef.current ? 1 : -1;
    selectionRef.current = index;
    setSelection({ index, direction });
    animate(ghostDrag, 0, { duration: SETTLE_SECONDS, ease: SETTLE_EASE });
  };
  const keySelect = (event: KeyboardEvent<HTMLElement>) => {
    const targets: Record<string, number> = { ArrowLeft: selectionRef.current - 1, ArrowRight: selectionRef.current + 1, Home: 0, End: projects.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    select(targets[event.key]);
  };
  if (!active) return null;
  const ghostPoster = next ? resolveHomeProjectPoster(next, locale) : null;

  return <div ref={rootRef} className="products-mobile-deck" data-product-theme={material ? "material" : "graphite"}
    data-active-product={active.id} data-active-index={selection.index} data-interacted={interacted ? "true" : "false"}
    style={{ "--products-mobile-ease": mobileMotionEasing, "--products-mobile-settle": `${mobileMotionDurations.section}ms` } as CSSProperties}
    onClickCapture={(event) => {
      if (Date.now() < suppressOpenUntil.current && (event.target as Element).closest("a")) {
        event.preventDefault();
        event.stopPropagation();
      }
    }}
  >
    <div className="products-mobile-deck__threshold" aria-hidden="true"><span /></div>
    <div className="products-mobile-deck__environment"
      data-active-index={selection.index}
      data-header-scene={material ? "living-threshold" : "living-product"}
      data-home-dark-chrome={!material ? "active" : undefined}
    >
      <MobileMotionSection variant="media" delay="soft" className="products-mobile-deck__composition">
        <div className="products-mobile-deck__edition"><span>0{selection.index + 1}<span> / 0{projects.length}</span></span><ProjectSignal project={active} locale={locale} /></div>
        <div className="products-mobile-deck__stage" onKeyDown={keySelect}>
          {ghostPoster && <motion.div className="products-mobile-deck__ghost" data-ghost-project={next.id} aria-hidden="true" inert
            style={{ x: reducedMotion ? 0 : ghostX, opacity: ghostOpacity, scale: reducedMotion ? 0.94 : ghostScale }}>
            <span>{next.publicName}</span>
            <PortfolioImage src={ghostPoster.src} alt="" sizes="(min-width: 768px) 78vw, 90vw" loading="lazy" draggable={false}
              containerClassName="products-mobile-deck__ghost-image" imageClassName="products-mobile-deck__image-element" />
          </motion.div>}
          <AnimatePresence initial={false} custom={selection.direction} mode="sync">
            <MobileProductCover key={active.id} project={active} index={selection.index} direction={selection.direction}
              locale={locale} navigate={navigate} reducedMotion={reducedMotion} ghostDrag={ghostDrag}
              suppressOpenUntil={suppressOpenUntil} select={select} onInteraction={() => setInteracted(true)} />
          </AnimatePresence>
        </div>
        <nav className="products-mobile-deck__navigation" aria-label={english ? "Choose a studio product" : "Elegir un producto del estudio"} onKeyDown={keySelect}>
          <div className="products-mobile-deck__selector">{projects.map((project, index) => <button key={project.id} type="button"
            aria-pressed={selection.index === index} onClick={() => select(index)}><span>0{index + 1}</span><span>{project.publicName}</span></button>)}</div>
          <div className="products-mobile-deck__navigation-bottom">
            <button type="button" disabled={selection.index === 0} aria-label={english ? "Previous product" : "Producto anterior"} onClick={() => select(selection.index - 1)}>←</button>
            <span className="products-mobile-deck__swipe-cue">{english ? "Swipe / Explore" : "Desliza / Explora"}<span aria-hidden="true">↔</span></span>
            <button type="button" disabled={selection.index === projects.length - 1} aria-label={english ? "Next product" : "Siguiente producto"} onClick={() => select(selection.index + 1)}>→</button>
          </div>
        </nav>
        <p className="products-mobile-deck__announcement" role="status" aria-live="polite" aria-atomic="true">{`0${selection.index + 1} / 0${projects.length} — ${active.publicName}`}</p>
      </MobileMotionSection>
      <div className="products-mobile-deck__exit" aria-hidden="true"><span>03 / {english ? "Studio products" : "Productos del estudio"}</span><span>↓</span></div>
    </div>
  </div>;
}
