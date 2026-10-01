import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import { immersiveItems } from "../../data/immersive";
import { getLocalizedPath } from "../../i18n";
import HomeManagedVideo from "../../media/home/HomeManagedVideo";
import { getPortfolioImageCandidate } from "../../media/portfolio/portfolioImage";
import PortfolioImage from "../media/PortfolioImage";
import MobileMotionMedia from "../mobile-motion/MobileMotionMedia";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";

function usePinnedSpatialStage() {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px) and (min-height: 681px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 681px)");
    const update = () => setMatches(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return matches;
}

export default function EcosystemSpatial({ locale, navigate, projects }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const copy = homeCopy[locale];
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const pinnedViewport = usePinnedSpatialStage();
  const staged = pinnedViewport && !reducedMotion;
  const [orbitReady, setOrbitReady] = useState(false);
  const [stageWarm, setStageWarm] = useState(false);
  const [whisperRevealOpen, setWhisperRevealOpen] = useState(false);
  const [whisperVideoEverEligible, setWhisperVideoEverEligible] = useState(false);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 145, damping: 34, mass: 0.3 });

  const whisperWidth = useTransform(progress, [0, 0.07, 0.28, 0.52, 0.82], ["18vw", "36vw", "84vw", "84vw", "60vw"]);
  const whisperHeight = useTransform(progress, [0, 0.07, 0.28, 0.52, 0.82], ["2px", "10vh", "72vh", "72vh", "62vh"]);
  const whisperX = useTransform(progress, [0, 0.28, 0.52, 0.82], ["0vw", "0vw", "0vw", "-16vw"]);
  const whisperShade = useTransform(progress, [0.48, 0.82], [0, 0.56]);
  const whisperCaption = useTransform(progress, [0.12, 0.25, 0.5, 0.71], [0, 1, 1, 0]);
  const orbitOpacity = useTransform(progress, [0.47, 0.66], [0, 1]);
  const orbitX = useTransform(progress, [0.47, 0.76], ["11vw", "0vw"]);
  const orbitY = useTransform(progress, [0.47, 0.76], ["9vh", "0vh"]);
  const orbitScale = useTransform(progress, [0.47, 0.76], [0.89, 1]);
  const scanScale = useTransform(progress, [0, 0.2, 0.43], [0.08, 1, 0.1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!staged) return;
    const nextOrbit = value >= 0.5;
    setOrbitReady((current) => current === nextOrbit ? current : nextOrbit);
  });

  useMotionValueEvent(progress, "change", (value) => {
    if (!staged) return;
    const open = value >= 0.18;
    setWhisperRevealOpen((current) => current === open ? current : open);
    if (open) setWhisperVideoEverEligible(true);
  });

  useEffect(() => {
    if (!staged) return;
    const frame = window.requestAnimationFrame(() => {
      const revealOpen = progress.get() >= 0.18;
      setOrbitReady(scrollYProgress.get() >= 0.5);
      setWhisperRevealOpen(revealOpen);
      if (revealOpen) setWhisperVideoEverEligible(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [staged, scrollYProgress, progress]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setStageWarm(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setStageWarm(true);
      observer.disconnect();
    }, { rootMargin: "75% 0px 75% 0px", threshold: 0 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const mountWhisperVideo = stageWarm && (!staged || whisperVideoEverEligible);
  const showWhisperVideo = !staged || whisperRevealOpen;

  return <HomeSection id="spatial" className="eco-spatial" scene="living-systems">
    <div className="eco-wrap eco-spatial-intro">
      <SectionLabel number="05">{copy.spatial}</SectionLabel>
      <div className="eco-section-heading"><h2 id="spatial-title">{copy.spatialTitle}</h2><p>{copy.spatialIntro}</p></div>
    </div>

    <div className="eco-spatial-threshold" aria-hidden="true"><span /></div>

    <div ref={stageRef} className="eco-spatial-stage" data-staged={staged ? "true" : "false"}>
      <div className="eco-spatial-field" data-header-scene="living-whisper" data-studio-whisper-media="true">
        <motion.div className="eco-spatial-scan" aria-hidden="true" style={staged ? { scaleX: scanScale } : undefined} />
        {projects.map((project, index) => {
        const poster = resolveHomeProjectPoster(project, locale);
        const reference = project.media.find((media) => media.asset.kind === "immersive-poster");
        const asset = reference?.asset;
        const video = asset?.kind === "immersive-poster" ? immersiveItems.find((item) => item.slug === asset.immersiveSlug)?.previewVideo : undefined;
        const posterTargetWidth = typeof window === "undefined" ? 960 : window.innerWidth < 768 ? 640 : window.innerWidth < 1024 ? 960 : 1600;
        const videoPoster = getPortfolioImageCandidate(poster.src, posterTargetWidth);
        const motionStyle = staged
          ? index === 0
            ? { width: whisperWidth, height: whisperHeight, x: whisperX }
            : { opacity: orbitOpacity, x: orbitX, y: orbitY, scale: orbitScale }
          : undefined;

        return <motion.div
          key={project.id}
          className={`eco-spatial-plane eco-spatial-plane-${index + 1}`}
          style={motionStyle}
          data-active={index === 0 || !staged || orbitReady ? "true" : "false"}
        >
          <MobileMotionSection
            as="article"
            variant="media"
            delay={index === 0 ? "soft" : "staged"}
            className={`eco-spatial-project eco-spatial-project-${index + 1}`}
            data-project-id={project.id}
          >
            <MobileMotionMedia className="eco-spatial-media-shell" delay="soft">
              <HomeLink href={projectPath(project, locale, "immersive")} navigate={navigate} className="eco-spatial-media">
                {index === 0 && video ? <>
                  {stageWarm && <PortfolioImage src={poster.src} alt=""
                    sizes="(min-width: 1024px) 84vw, (min-width: 768px) 55vw, calc(100vw - 40px)"
                    loading="lazy" containerClassName="absolute inset-0" imageClassName="eco-spatial-video" />}
                  {mountWhisperVideo && <div className="eco-spatial-managed-video" data-reveal-open={showWhisperVideo ? "true" : "false"} aria-hidden="true">
                    <HomeManagedVideo src={video} poster={videoPoster} className="eco-spatial-video" />
                  </div>}
                  <span className="sr-only">{poster.alt}</span>
                </> : <PortfolioImage
                  src={poster.src}
                  alt={poster.alt}
                  sizes="(min-width: 1024px) 37vw, (min-width: 768px) 48vw, calc(100vw - 40px)"
                  loading="lazy"
                  containerClassName="absolute inset-0"
                  imageClassName="eco-spatial-orbit-image"
                />}
                {index === 0 && <motion.span className="eco-spatial-handoff-shade" aria-hidden="true" style={staged ? { opacity: whisperShade } : undefined} />}
                <span className="eco-spatial-enter" aria-hidden="true"><Arrow /></span>
              </HomeLink>
            </MobileMotionMedia>
            <motion.div
              className="eco-spatial-caption"
              style={staged ? { opacity: index === 0 ? whisperCaption : orbitOpacity } : undefined}
            >
              <span className="eco-spatial-index" aria-hidden="true">05 / 0{index + 1}</span>
              <h3>{project.publicName}</h3>
              <ProjectSignal project={project} locale={locale} />
              <p>{projectText(project.copy.oneLiner, locale)}</p>
              <HomeLink href={projectPath(project, locale, "immersive")} navigate={navigate} className="eco-text-link">{copy.case}<Arrow /></HomeLink>
            </motion.div>
          </MobileMotionSection>
        </motion.div>;
      })}
        <div className="eco-spatial-stage-index" aria-hidden="true"><span>05</span><span>{orbitReady ? "02 / 02" : "01 / 02"}</span></div>
      </div>
      <div className="eco-spatial-outro eco-wrap">
        <HomeLink href={getLocalizedPath("/immersive", locale)} navigate={navigate} className="eco-text-link eco-spatial-archive">{copy.immersive}<Arrow /></HomeLink>
      </div>
    </div>
  </HomeSection>;
}
