import { Fragment, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { AnimatePresence, animate, motion, useIsPresent, useMotionValue, useReducedMotion, useTransform, type MotionValue, type PanInfo } from "framer-motion";
import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import PortfolioImage from "../media/PortfolioImage";
import MobileMotionMedia from "../mobile-motion/MobileMotionMedia";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { mobileMotionDurations, mobileMotionEasing } from "../mobile-motion/motionTokens";
import { Arrow, HomeLink, ProjectSignal, type HomeSectionProps } from "./HomePrimitives";
import { projectPath } from "./homeProjectPresentation";
import { getLocalizedPath } from "../../i18n";
import { adjacentGhostIndex, formatMobileProductOrdinal, ghostDirectionFromOffset, mobileProductCaseRoute, mobileProductKeyTarget, mobileProductPresentation, resolveMobileProductPreset, selectMobileProduct, type GhostDirection } from "./productsMobileDeckModel";
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
  onGhostOffset: (offset: number) => void;
};

function MobileProductCover({ project, index, direction, locale, navigate, reducedMotion, ghostDrag, suppressOpenUntil, select, onInteraction, onGhostOffset }: CoverProps) {
  const present = useIsPresent();
  const planeRef = useRef<HTMLDivElement>(null);
  const meaningfulDrag = useRef(false);
  const width = useMotionValue(360);
  const x = useMotionValue(0);
  const rotateY = useTransform(() => Math.max(-16, Math.min(16, x.get() / (width.get() * 0.22) * 16)));
  const rotateZ = useTransform(() => Math.max(-1.5, Math.min(1.5, x.get() / (width.get() * 0.22) * 1.5)));
  const scale = useTransform(() => 1 - Math.min(1, Math.abs(x.get()) / (width.get() * 0.22)) * 0.015);
  const backingX = useTransform(() => Math.max(-3, Math.min(3, x.get() / (width.get() * 0.22) * -3)));
  const presentation = mobileProductPresentation(project, locale);
  const material = presentation.preset === "print-border";
  const poster = resolveHomeProjectPoster(project, locale);
  const live = project.links.find((link) => link.kind === "live");
  const english = locale === "en";
  const route = mobileProductCaseRoute(project, locale);
  const casePath = route ? route.surface === "work" ? projectPath(project, locale, "work") : getLocalizedPath(route.path, locale) : undefined;

  const release = () => {
    onGhostOffset(0);
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
    data-project-id={project.id} data-preset={presentation.preset} data-active={present ? "true" : "false"}
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
      <p>{presentation.descriptor.map((line, lineIndex) => <Fragment key={lineIndex}>{lineIndex > 0 && <br />}{line}</Fragment>)}</p>
    </div>
    <MobileMotionMedia as="figure" delay="none" className="products-mobile-deck__media">
      <motion.div ref={planeRef} className="products-mobile-deck__plane"
        drag={present ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} dragMomentum={false}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 30 }}
        style={{ x, rotateY: reducedMotion ? 0 : rotateY, rotateZ: reducedMotion ? 0 : rotateZ, scale: reducedMotion ? 1 : scale, touchAction: "pan-y" }}
        onDragStart={() => {
          width.set(planeRef.current?.offsetWidth ?? 360);
          meaningfulDrag.current = false;
          onGhostOffset(0);
          onInteraction();
        }}
        onDrag={(_, info) => {
          onGhostOffset(info.offset.x);
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
          <div className="products-mobile-deck__plate" aria-hidden="true"><span>{material ? "Edition" : "P"} / {formatMobileProductOrdinal(index + 1)}</span><span>{presentation.plate}</span><span>{material ? "+" : "↗"}</span></div>
          <PortfolioImage src={poster.src} alt={poster.alt} sizes="(min-width: 768px) 78vw, 90vw" loading="lazy" draggable={false}
            containerClassName="products-mobile-deck__image" imageClassName="products-mobile-deck__image-element" />
          <span className="products-mobile-deck__finish" aria-hidden="true" />
        </div>
      </motion.div>
      <figcaption><span>{presentation.caption}</span><span>BS — {formatMobileProductOrdinal(index + 1)}</span></figcaption>
    </MobileMotionMedia>
    <div className="products-mobile-deck__detail">
      {presentation.terms.length > 0 && <ul role="list">{presentation.terms.map((term) => <li key={term}>{term}</li>)}</ul>}
      <div className="products-mobile-deck__actions">
        {casePath && <HomeLink href={casePath} navigate={navigate} className="products-mobile-deck__case">{english ? "Explore case" : "Explorar caso"}<Arrow /></HomeLink>}
        {live && <a href={live.href} target="_blank" rel="noreferrer">{english ? "Live proof" : "Demo pública"}<Arrow /></a>}
      </div>
    </div>
  </motion.article>;
}

export default function ProductsMobileDeck({ projects, locale, navigate }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const [selection, setSelection] = useState({ index: 0, direction: 1 });
  const [interacted, setInteracted] = useState(false);
  const [ghostDirection, setGhostDirection] = useState<GhostDirection>(0);
  const ghostDirectionRef = useRef<GhostDirection>(0);
  const selectionRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const suppressOpenUntil = useRef(0);
  const reducedMotion = Boolean(useReducedMotion());
  const ghostDrag = useMotionValue(0);
  const ghostX = useTransform(ghostDrag, [0, 1], [0, -7]);
  const ghostOpacity = useTransform(ghostDrag, [0, 1], [0.3, 0.46]);
  const ghostScale = useTransform(ghostDrag, [0, 1], [0.94, 0.97]);
  const activeIndex = selectMobileProduct(selection.index, selection.index, projects.length);
  const active = activeIndex === null ? undefined : projects[activeIndex];
  const ghostIndex = activeIndex === null ? null : adjacentGhostIndex(activeIndex, projects.length, ghostDirection);
  const ghost = ghostIndex === null ? undefined : projects[ghostIndex];
  const presentation = active ? mobileProductPresentation(active, locale) : null;
  const english = locale === "en";

  // React only updates when the discrete direction changes, never per drag frame.
  const onGhostOffset = (offset: number) => {
    const nextDirection = ghostDirectionFromOffset(offset);
    if (nextDirection !== ghostDirectionRef.current) {
      ghostDirectionRef.current = nextDirection;
      setGhostDirection(nextDirection);
    }
  };
  const select = (target: number) => {
    setInteracted(true);
    onGhostOffset(0);
    const current = selectMobileProduct(selectionRef.current, selectionRef.current, projects.length);
    const index = selectMobileProduct(current ?? 0, target, projects.length);
    if (index === null || index === current) return;
    const departing = rootRef.current?.querySelector('[data-active="true"]');
    if (departing?.contains(document.activeElement)) {
      rootRef.current?.querySelectorAll<HTMLButtonElement>(".products-mobile-deck__selector button")[index]?.focus({ preventScroll: true });
    }
    const direction = index > (current ?? 0) ? 1 : -1;
    selectionRef.current = index;
    setSelection({ index, direction });
    animate(ghostDrag, 0, { duration: SETTLE_SECONDS, ease: SETTLE_EASE });
  };
  const keySelect = (event: KeyboardEvent<HTMLElement>) => {
    const current = selectMobileProduct(selectionRef.current, selectionRef.current, projects.length) ?? 0;
    const target = mobileProductKeyTarget(event.key, current, projects.length);
    if (target === undefined || target === null) return;
    event.preventDefault();
    select(target);
  };
  if (!active || activeIndex === null || !presentation) return null;
  const ghostPoster = ghost ? resolveHomeProjectPoster(ghost, locale) : null;

  return <div ref={rootRef} className="products-mobile-deck" data-product-theme={presentation.theme}
    data-active-product={active.id} data-active-index={activeIndex} data-interacted={interacted ? "true" : "false"}
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
      data-active-index={activeIndex}
      data-header-scene={presentation.theme === "graphite" ? "living-product" : "living-threshold"}
      data-home-dark-chrome={presentation.theme === "graphite" ? "active" : undefined}
    >
      <MobileMotionSection variant="media" delay="soft" className="products-mobile-deck__composition">
        <div className="products-mobile-deck__edition"><span>{formatMobileProductOrdinal(activeIndex + 1)}<span> / {formatMobileProductOrdinal(projects.length)}</span></span><ProjectSignal project={active} locale={locale} /></div>
        <div className="products-mobile-deck__stage" onKeyDown={keySelect}>
          {ghost && ghostPoster && <motion.div className="products-mobile-deck__ghost" data-ghost-project={ghost.id} aria-hidden="true" inert
            style={{ x: reducedMotion ? 0 : ghostX, opacity: ghostOpacity, scale: reducedMotion ? 0.94 : ghostScale }}>
            <span>{ghost.publicName}</span>
            <PortfolioImage src={ghostPoster.src} alt="" sizes="(min-width: 768px) 78vw, 90vw" loading="lazy" draggable={false}
              containerClassName="products-mobile-deck__ghost-image" imageClassName="products-mobile-deck__image-element" />
          </motion.div>}
          <AnimatePresence initial={false} custom={selection.direction} mode="sync">
            <MobileProductCover key={active.id} project={active} index={activeIndex} direction={selection.direction}
              locale={locale} navigate={navigate} reducedMotion={reducedMotion} ghostDrag={ghostDrag}
              suppressOpenUntil={suppressOpenUntil} select={select} onInteraction={() => setInteracted(true)} onGhostOffset={onGhostOffset} />
          </AnimatePresence>
        </div>
        <nav className="products-mobile-deck__navigation" aria-label={english ? "Choose a studio product" : "Elegir un producto del estudio"} onKeyDown={keySelect}>
          <div className="products-mobile-deck__selector">{projects.map((project, index) => <button key={project.id} type="button" data-preset={resolveMobileProductPreset(project)}
            aria-pressed={activeIndex === index} onClick={() => select(index)}><span>{formatMobileProductOrdinal(index + 1)}</span><span>{project.publicName}</span></button>)}</div>
          <div className="products-mobile-deck__navigation-bottom">
            <button type="button" disabled={activeIndex === 0} aria-label={english ? "Previous product" : "Producto anterior"} onClick={() => select(activeIndex - 1)}>←</button>
            <span className="products-mobile-deck__swipe-cue">{english ? "Swipe / Explore" : "Desliza / Explora"}<span aria-hidden="true">↔</span></span>
            <button type="button" disabled={activeIndex === projects.length - 1} aria-label={english ? "Next product" : "Siguiente producto"} onClick={() => select(activeIndex + 1)}>→</button>
          </div>
        </nav>
        <p className="products-mobile-deck__announcement" role="status" aria-live="polite" aria-atomic="true">{`${formatMobileProductOrdinal(activeIndex + 1)} / ${formatMobileProductOrdinal(projects.length)} — ${active.publicName}`}</p>
      </MobileMotionSection>
      <div className="products-mobile-deck__exit" aria-hidden="true"><span>03 / {english ? "Studio products" : "Productos del estudio"}</span><span>↓</span></div>
    </div>
  </div>;
}
