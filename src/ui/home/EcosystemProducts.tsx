import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import PortfolioImage from "../media/PortfolioImage";
import MobileMotionMedia from "../mobile-motion/MobileMotionMedia";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";

function useDesktopStage() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktop;
}

export default function EcosystemProducts({ locale, navigate, projects }: HomeSectionProps & { projects: readonly ProjectRecord[] }) {
  const copy = homeCopy[locale];
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const desktop = useDesktopStage();
  const reducedMotion = useReducedMotion();
  const staged = desktop && !reducedMotion && projects.length > 1;
  const visibleIndex = focusIndex ?? activeIndex;
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!staged) return;
    const nextIndex = Math.min(projects.length - 1, Math.floor(progress * projects.length));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  const scrollToProduct = (index: number) => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const top = timeline.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(0, timeline.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + travel * ((index + 0.74) / projects.length), behavior: "smooth" });
  };

  return <HomeSection id="products" className="eco-products eco-wrap eco-products-stage">
    <SectionLabel number="03">{copy.products}</SectionLabel>
    <div className="eco-section-heading"><h2 id="products-title">{copy.productsTitle}</h2><p>{copy.productsIntro}</p></div>
    <div ref={timelineRef} className="eco-products-stage__timeline" data-staged={staged ? "true" : "false"}>
      <div className="eco-products-stage__sticky">
        {staged && <nav className="eco-products-stage__navigation" aria-label={copy.products}>
          <span className="eco-products-stage__navigation-line" aria-hidden="true" />
          {projects.map((project, index) => <button
            key={project.id}
            type="button"
            onClick={() => scrollToProduct(index)}
            aria-pressed={visibleIndex === index}
            className="eco-products-stage__navigation-item"
          ><span>0{index + 1}</span><span>{project.publicName}</span></button>)}
        </nav>}
        <div className="eco-products-stage__scenes">
          {projects.map((project, index) => {
            const poster = resolveHomeProjectPoster(project, locale);
            const live = project.links.find((link) => link.kind === "live");
            const active = !staged || visibleIndex === index;
            const casePath = projectPath(project, locale, "work");

            return <MobileMotionSection
              as="article"
              key={project.id}
              variant="media"
              delay={index === 0 ? "soft" : "staged"}
              className="eco-products-stage__project"
              data-product-index={index}
              data-product-active={active ? "true" : "false"}
              data-project-id={project.id}
              onFocusCapture={() => {
                if (staged) setFocusIndex(index);
              }}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusIndex(null);
              }}
            >
              <div className="eco-products-stage__heading">
                <span className="eco-products-stage__index" aria-hidden="true">P / 0{index + 1}</span>
                <ProjectSignal project={project} locale={locale} />
                <h3>{project.publicName}</h3>
              </div>
              <MobileMotionMedia as="figure" delay="soft" className="eco-products-stage__media">
                <HomeLink href={casePath} navigate={navigate} className="eco-products-stage__poster-link">
                  <div className="eco-products-stage__poster">
                    <PortfolioImage
                      src={poster.src}
                      alt={poster.alt}
                      sizes="(min-width: 1024px) 52vw, (min-width: 768px) 50vw, 88vw"
                      loading="lazy"
                      containerClassName="eco-products-stage__image"
                      imageClassName="eco-products-stage__image-element"
                    />
                    <span className="eco-products-stage__poster-index" aria-hidden="true">0{index + 1} / 0{projects.length}</span>
                  </div>
                </HomeLink>
                <figcaption className="eco-products-stage__media-caption"><span>{copy.products}</span><span>{project.publicName}</span></figcaption>
              </MobileMotionMedia>
              <div className="eco-products-stage__detail">
                <p className="eco-project-description">{projectText(project.copy.oneLiner, locale)}</p>
                <div className="eco-project-actions">
                  <HomeLink href={casePath} navigate={navigate} className="eco-text-link">{copy.case}<Arrow /></HomeLink>
                  {live && <a href={live.href} target="_blank" rel="noreferrer" className="eco-text-link eco-secondary-link">{copy.proof}<Arrow /></a>}
                </div>
              </div>
            </MobileMotionSection>;
          })}
        </div>
      </div>
    </div>
  </HomeSection>;
}
