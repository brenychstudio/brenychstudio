import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ProjectRecord, PublicLocale } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import { getLocalizedPath } from "../../i18n";
import MobileMotionMedia from "../mobile-motion/MobileMotionMedia";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import PortfolioImage from "../media/PortfolioImage";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";

function useDesktopEvidenceMotion() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop && !reducedMotion;
}

function EvidenceChapter({
  project,
  index,
  total,
  locale,
  navigate,
  desktopMotion,
}: {
  project: ProjectRecord;
  index: number;
  total: number;
  locale: PublicLocale;
  navigate: (path: string) => void;
  desktopMotion: boolean;
}) {
  const chapterRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: chapterRef, offset: ["start end", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 0.4, 1], [56, 0, -42]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.965, 1, 1.025]);
  const captionY = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, -18]);
  const poster = resolveHomeProjectPoster(project, locale);
  const position = String(index + 1).padStart(2, "0");

  return <div ref={chapterRef} className={`eco-evidence-chapter-shell eco-evidence-chapter-shell-${index + 1}`}>
    <MobileMotionSection as="article" variant="media" index={index + 1} delay={index === 0 ? "soft" : "staged"}
      className="eco-evidence-chapter" data-project-id={project.id}>
      <HomeLink href={projectPath(project, locale, "work")} navigate={navigate} className="eco-evidence-link">
        <MobileMotionMedia as="figure" className="eco-evidence-media" delay="soft">
          <motion.div className="eco-evidence-image" style={desktopMotion ? { y: mediaY, scale: mediaScale } : undefined}>
            <PortfolioImage src={poster.src} alt={poster.alt}
              sizes="(min-width: 1800px) 1250px, (min-width: 1024px) 70vw, (min-width: 768px) 72vw, calc(100vw - 40px)"
              loading="lazy" containerClassName="eco-evidence-poster" imageClassName="eco-evidence-poster-img" />
          </motion.div>
          <span className="eco-evidence-frame-index" aria-hidden="true">{position}</span>
        </MobileMotionMedia>
        <motion.div className="eco-evidence-caption" style={desktopMotion ? { y: captionY } : undefined}>
          <span className="eco-evidence-count" aria-hidden="true">{position} / {String(total).padStart(2, "0")}</span>
          <h3>{project.publicName}<Arrow /></h3>
          <ProjectSignal project={project} locale={locale} />
          <p className="eco-project-description">{projectText(project.copy.oneLiner, locale)}</p>
        </motion.div>
      </HomeLink>
    </MobileMotionSection>
  </div>;
}

export default function EcosystemEvidence({ locale, navigate, projects }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const copy = homeCopy[locale];
  const desktopMotion = useDesktopEvidenceMotion();

  return <HomeSection id="evidence" className="eco-evidence eco-wrap">
    <SectionLabel number="04">{copy.evidence}</SectionLabel>
    <div className="eco-section-heading"><h2 id="evidence-title">{copy.evidenceTitle}</h2><HomeLink href={getLocalizedPath("/work", locale)} navigate={navigate} className="eco-text-link">{copy.archive}<Arrow /></HomeLink></div>
    <div className="eco-evidence-stage">{projects.map((project, index) =>
      <EvidenceChapter key={project.id} project={project} index={index} total={projects.length}
        locale={locale} navigate={navigate} desktopMotion={desktopMotion} />,
    )}</div>
  </HomeSection>;
}
