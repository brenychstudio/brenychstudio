import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import HomeManagedVideo from "../../media/home/HomeManagedVideo";
import { useHomeMediaRuntime } from "../../media/home/useHomeMediaRuntime";
import { resolveVideoAsset } from "../../media/video/videoResolver";
import PortfolioImage from "../media/PortfolioImage";
import { Arrow, HomeLink, ProjectSignal, type HomeSectionProps } from "./HomePrimitives";
import { homeCopy } from "./homeCopy";
import { projectPath } from "./homeProjectPresentation";

type WeekfieldLivingCoverProps = HomeSectionProps & {
  project: ProjectRecord;
  progress: MotionValue<number>;
  staged: boolean;
  active: boolean;
  total: number;
};

// A Products-only plane. Scroll owns the shell; pointer springs own its inner surface.
// Neither motion path updates React state or changes the shared Products timeline.
export default function WeekfieldLivingCover({ project, locale, navigate, progress, staged, active, total }: WeekfieldLivingCoverProps) {
  const reducedMotion = useReducedMotion();
  const { observeTarget } = useHomeMediaRuntime();
  const screenRef = useRef<HTMLDivElement>(null);
  const [mediaWarm, setMediaWarm] = useState(false);
  const pointerAllowed = useRef(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 120, damping: 24, mass: 0.85 };
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);
  const rotateX = useTransform(smoothY, [-1, 1], [2.4, -2.4]);
  const rotateY = useTransform(smoothX, [-1, 1], [-2.4, 2.4]);
  const imageX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const imageY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const lightX = useTransform(smoothX, [-1, 1], [20, 80]);
  const lightY = useTransform(smoothY, [-1, 1], [10, 90]);
  const sheen = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, rgba(224, 233, 239, 0.065), transparent 65%)`;

  const opacity = useTransform(progress, [0, 0.12], [0.35, 1]);
  const scale = useTransform(progress, [0, 0.12, 0.38, 0.48], [0.94, 1, 1, 0.975]);
  const x = useTransform(progress, [0, 0.12, 0.38, 0.48], ["5vw", "0vw", "0vw", "-1.5vw"]);
  const y = useTransform(progress, [0, 0.12], ["3vh", "0vh"]);
  const approachRotate = useTransform(progress, [0, 0.12], [-2, 0]);
  const copyOpacity = useTransform(progress, [0, 0.12], [0.45, 1]);
  const copyY = useTransform(progress, [0, 0.12], [16, 0]);
  const ambientOpacity = useTransform(progress, [0, 0.16, 0.38, 0.48], [0.35, 1, 1, 0.65]);
  const animateScroll = staged && !reducedMotion;

  // Keep the responsive poster lazy until the existing Home runtime warms this
  // screen. HomeManagedVideo still owns source attachment and decoded-frame reveal.
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    return observeTarget(screen, ({ isWarm }) => setMediaWarm(isWarm));
  }, [observeTarget]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const update = () => {
      pointerAllowed.current = query.matches && !reducedMotion && active;
      if (!pointerAllowed.current) {
        pointerX.set(0);
        pointerY.set(0);
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [active, reducedMotion, pointerX, pointerY]);

  const resetPointer = () => { pointerX.set(0); pointerY.set(0); };
  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerAllowed.current || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)));
    pointerY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)));
  };

  const poster = resolveHomeProjectPoster(project, locale);
  const live = project.links.find((link) => link.kind === "live");
  const copy = homeCopy[locale];
  const casePath = projectPath(project, locale, "work");

  return <div className="weekfield-environment"
    data-header-scene={active ? "living-product" : undefined}
    data-home-dark-chrome={active ? "active" : undefined}
  ><div className="weekfield-cover" data-cover-tone="graphite" data-cover-focus="center">
    <motion.div className="weekfield-cover__ambient" aria-hidden="true" style={{ opacity: animateScroll ? ambientOpacity : 1 }} />
    <div className="weekfield-cover__edition">
      <span>01 <span className="weekfield-cover__muted">/ {String(total).padStart(2, "0")}</span></span>
      <span>{copy.products}</span>
      <ProjectSignal project={project} locale={locale} />
    </div>
    <motion.div className="weekfield-cover__identity" style={animateScroll ? { opacity: copyOpacity, y: copyY } : undefined}>
      <h3>{project.publicName}</h3>
      <p className="weekfield-cover__descriptor">{locale === "en" ? <>Creator intelligence<br />&amp; planning system</> : <>Inteligencia creativa<br />y planificación</>}</p>
      <ul className="weekfield-cover__detail" role="list">
        <li>{locale === "en" ? "Creator content intelligence" : "Inteligencia de contenido para creadores"}</li>
        <li>Week Packs</li>
        <li>
          <span className="weekfield-cover__detail-label">{locale === "en" ? "Human-controlled" : "Bajo control humano"}</span>
          <span>{locale === "en" ? "AI-assisted review / apply" : "Revisión y aplicación asistidas por IA"}</span>
        </li>
      </ul>
    </motion.div>
    <div className="weekfield-cover__spatial" onPointerMove={movePointer} onPointerLeave={resetPointer} onPointerCancel={resetPointer}>
      <motion.figure className="weekfield-cover__approach" style={animateScroll ? { opacity, scale, x, y, rotateY: approachRotate } : undefined}>
        <motion.div className="weekfield-cover__plane" style={reducedMotion ? undefined : { rotateX, rotateY }}>
          <div className="weekfield-cover__plate" aria-hidden="true"><span>P / 01</span><span>{project.publicName}</span><span>↗</span></div>
          <div ref={screenRef} className="weekfield-cover__screen" role="img" aria-label={poster.alt}>
            <motion.div className="weekfield-cover__pixels" style={reducedMotion ? undefined : { x: imageX, y: imageY }}>
              <PortfolioImage src={poster.src} alt="" loading="lazy" sizes="70vw" containerClassName="weekfield-cover__static" imageClassName="weekfield-cover__image" />
              {active && mediaWarm && !reducedMotion && <div className="weekfield-cover__video"><HomeManagedVideo
                src={resolveVideoAsset("weekfield.case.walkthrough")}
                poster={poster.src}
                className="weekfield-cover__image"
                objectPosition="50% 50%"
              /></div>}
            </motion.div>
          </div>
          <motion.div className="weekfield-cover__sheen" aria-hidden="true" style={{ background: sheen }} />
          <figcaption className="weekfield-cover__caption">
            <span>{locale === "en" ? "Product / Interface" : "Producto / Interfaz"}</span>
            {live && <a href={live.href} target="_blank" rel="noreferrer" className="weekfield-cover__proof">{copy.proof}<Arrow /></a>}
          </figcaption>
        </motion.div>
      </motion.figure>
    </div>
    <div className="weekfield-cover__actions">
      <HomeLink href={casePath} navigate={navigate} className="weekfield-cover__action">{copy.case}<Arrow /></HomeLink>
    </div>
  </div></div>;
}
