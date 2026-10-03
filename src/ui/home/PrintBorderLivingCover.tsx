import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionStyle, type MotionValue } from "framer-motion";
import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import HomeManagedVideo from "../../media/home/HomeManagedVideo";
import { useHomeMediaRuntime } from "../../media/home/useHomeMediaRuntime";
import { resolveVideoAsset } from "../../media/video/videoResolver";
import PortfolioImage from "../media/PortfolioImage";
import { Arrow, HomeLink, ProjectSignal, type HomeSectionProps } from "./HomePrimitives";
import { homeCopy } from "./homeCopy";
import { projectPath } from "./homeProjectPresentation";

type PrintBorderLivingCoverProps = HomeSectionProps & {
  project: ProjectRecord;
  progress: MotionValue<number>;
  staged: boolean;
  active: boolean;
  total: number;
};

// A material preset on the existing Products timeline. The paper mount belongs
// to scroll; its heavier pointer springs only move the inner print surface.
export default function PrintBorderLivingCover({ project, locale, navigate, progress, staged, active, total }: PrintBorderLivingCoverProps) {
  const reducedMotion = useReducedMotion();
  const { observeTarget } = useHomeMediaRuntime();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [mediaWarm, setMediaWarm] = useState(false);
  const [materialVisible, setMaterialVisible] = useState(false);
  const pointerAllowed = useRef(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 72, damping: 25, mass: 1.15 };
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);
  const rotateX = useTransform(smoothY, [-1, 1], [1.65, -1.65]);
  const rotateY = useTransform(smoothX, [-1, 1], [-1.65, 1.65]);
  const mediaX = useTransform(smoothX, [-1, 1], [-4, 4]);
  const mediaY = useTransform(smoothY, [-1, 1], [-4, 4]);
  const proofX = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);
  const proofY = useTransform(smoothY, [-1, 1], [-2.5, 2.5]);
  const lightX = useTransform(smoothX, [-1, 1], [24, 76]);
  const lightY = useTransform(smoothY, [-1, 1], [20, 70]);
  const incidentLight = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, rgba(255, 240, 210, 0.085), transparent 72%)`;

  const fieldOpacity = useTransform(progress, [0.43, 0.62], [0, 1]);
  const sheetOpacity = useTransform(progress, [0.48, 0.56, 0.66], [0, 0.65, 1]);
  const sheetY = useTransform(progress, [0.48, 0.66, 0.9, 1], ["3vh", "0vh", "0vh", "0.7vh"]);
  const sheetScale = useTransform(progress, [0.48, 0.66, 0.9, 1], [0.96, 1, 1, 0.99]);
  const sheetRotate = useTransform(progress, [0.48, 0.66, 0.9, 1], [1.5, 0, 0, -0.25]);
  const identityOpacity = useTransform(progress, [0.54, 0.66], [0, 1]);
  const identityY = useTransform(progress, [0.54, 0.66], [12, 0]);
  const proofOpacity = useTransform(progress, [0.56, 0.69], [0, 0.82]);
  const proofSeparation = useTransform(progress, [0.56, 0.69], ["-12%", "0%"]);
  const animateScroll = staged && !reducedMotion;

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    return observeTarget(surface, ({ isWarm, visibleRatio }) => {
      setMediaWarm(isWarm);
      setMaterialVisible(visibleRatio > 0.15);
    });
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

  return <motion.div className="print-border-environment"
    data-header-scene={active ? "living-threshold" : undefined}
    data-material-visible={active && materialVisible ? "true" : undefined}
    style={animateScroll ? { "--print-border-field-opacity": fieldOpacity } as MotionStyle : undefined}
  ><div className="print-border-cover" data-cover-tone="ivory">
    <div className="print-border-cover__edition">
      <span>02 <span className="print-border-cover__muted">/ {String(total).padStart(2, "0")}</span></span>
      <span>{copy.products}</span>
      <ProjectSignal project={project} locale={locale} />
    </div>
    <motion.div className="print-border-cover__identity" style={animateScroll ? { opacity: identityOpacity, y: identityY } : undefined}>
      <h3 aria-label={project.publicName}>Print Border <span>Studio</span></h3>
      <p>{locale === "en" ? "Print preparation & collector presentation" : "Preparación de impresión y presentación para coleccionistas"}</p>
    </motion.div>
    <motion.div className="print-border-cover__production" style={animateScroll ? { opacity: identityOpacity } : undefined}>
      <span className="print-border-cover__production-label">{locale === "en" ? "Production / 02" : "Producción / 02"}</span>
      <ul role="list">
        <li>{locale === "en" ? "Print borders" : "Bordes de impresión"}</li>
        <li>{locale === "en" ? "Export logic" : "Lógica de exportación"}</li>
        <li>{locale === "en" ? "Artwork inspection" : "Inspección de obra"}</li>
      </ul>
      <div className="print-border-cover__actions">
        <HomeLink href={casePath} navigate={navigate} className="print-border-cover__action">{copy.case}<Arrow /></HomeLink>
        {live && <a href={live.href} target="_blank" rel="noreferrer" className="print-border-cover__action">{copy.proof}<Arrow /></a>}
      </div>
    </motion.div>
    <div className="print-border-cover__spatial" onPointerMove={movePointer} onPointerLeave={resetPointer} onPointerCancel={resetPointer}>
      <motion.figure className="print-border-cover__approach" style={animateScroll ? { opacity: sheetOpacity, y: sheetY, scale: sheetScale, rotate: sheetRotate } : undefined}>
        <motion.div className="print-border-cover__proof-approach" aria-hidden="true"
          style={{ opacity: animateScroll ? proofOpacity : 0.82, y: animateScroll ? proofSeparation : "0%", z: -60, scale: 0.97, rotate: -1.1 }}>
          <motion.div className="print-border-cover__proof" style={reducedMotion ? undefined : { x: proofX, y: proofY }}>
            <PortfolioImage src="/cases/print-border-studio/desktop/psb-4.webp" alt="" loading="lazy" sizes="(min-width: 1920px) 58vw, 64vw" containerClassName="print-border-cover__proof-media" imageClassName="print-border-cover__proof-image" />
          </motion.div>
        </motion.div>
        <motion.div className="print-border-cover__sheet" style={reducedMotion ? undefined : { rotateX, rotateY }}>
          <div className="print-border-cover__registration" aria-hidden="true"><span>+</span><span>+</span></div>
          <div ref={surfaceRef} className="print-border-cover__surface" role="img" aria-label={poster.alt}>
            <motion.div className="print-border-cover__pixels" style={reducedMotion ? undefined : { x: mediaX, y: mediaY }}>
              <PortfolioImage src={poster.src} alt="" loading="lazy" sizes="(min-width: 1920px) 58vw, 64vw" containerClassName="print-border-cover__static" imageClassName="print-border-cover__image" />
              {active && mediaWarm && !reducedMotion && <div className="print-border-cover__video"><HomeManagedVideo
                src={resolveVideoAsset("print-border.case.walkthrough")}
                poster={poster.src}
                className="print-border-cover__image"
                objectPosition="50% 50%"
              /></div>}
            </motion.div>
          </div>
          <motion.div className="print-border-cover__light" aria-hidden="true" style={{ background: incidentLight }} />
          <figcaption className="print-border-cover__caption">
            <span>{locale === "en" ? "Artwork / Border / Export" : "Obra / Borde / Exportación"}</span>
            <span>{project.publicName}</span>
          </figcaption>
        </motion.div>
      </motion.figure>
    </div>
  </div></motion.div>;
}
