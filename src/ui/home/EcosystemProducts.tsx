import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "framer-motion";
import type { ProjectRecord } from "../../data/projectRegistry.types";
import { resolveHomeProjectPoster } from "../../data/ecosystemHome";
import PortfolioImage from "../media/PortfolioImage";
import MobileMotionMedia from "../mobile-motion/MobileMotionMedia";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, ProjectSignal, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { projectPath, projectText } from "./homeProjectPresentation";
import WeekfieldLivingCover from "./WeekfieldLivingCover";
import PrintBorderLivingCover from "./PrintBorderLivingCover";
import ProductsMobileDeck from "./ProductsMobileDeck";

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
  const activeIndexRef = useRef(0);
  const [interactionIndex, setInteractionIndex] = useState<number | null>(0);
  const interactionIndexRef = useRef<number | null>(0);
  const desktop = useDesktopStage();
  const reducedMotion = useReducedMotion();
  const staged = desktop && !reducedMotion && projects.length > 1;
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start start", "end end"] });
  // Native scroll remains the document truth. Only the two continuous covers
  // follow this strongly damped playhead; no input interception or scene queue.
  const visualProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.8, restDelta: 0.001, restSpeed: 0.01 });
  const weekfieldOpacity = useTransform(visualProgress, [0.44, 0.49, 0.53], [1, 0.1, 0]);
  const printBorderOpacity = useTransform(visualProgress, [0.42, 0.5, 0.6], [0, 0.1, 1]);
  // A separately painted field carries the material change while the outgoing
  // content recedes, so two full-contrast interfaces never dissolve together.
  const handoffColor = useTransform(visualProgress, [0.4, 0.47, 0.54, 0.62], ["#0d0f0e", "#393b36", "#a39989", "#f3f0e8"]);
  const sceneStyle = staged ? {
    "--weekfield-scene-opacity": weekfieldOpacity,
    "--print-border-scene-opacity": printBorderOpacity,
  } as MotionStyle : undefined;

  useMotionValueEvent(visualProgress, "change", (progress) => {
    if (!staged) return;
    const current = activeIndexRef.current;
    const nextIndex = progress >= 0.56 ? 1 : progress <= 0.44 ? 0 : current;
    const nextInteraction = progress <= 0.49 ? 0 : progress >= 0.58 ? 1 : null;

    // Content eligibility follows visibility, independently of chrome/nav
    // hysteresis. The neutral material interval has no focusable ghost actions.
    // Move any departing focus to the persistent selector before applying inert;
    // a clicked link must never pin the scene or move the document scroll.
    if (nextInteraction !== interactionIndexRef.current) {
      const timeline = timelineRef.current;
      const departing = interactionIndexRef.current === null ? null
        : timeline?.querySelector(`[data-product-index="${interactionIndexRef.current}"]`);
      if (departing?.contains(document.activeElement)) {
        timeline?.querySelectorAll<HTMLButtonElement>(".eco-products-stage__navigation-item")[nextInteraction ?? nextIndex]?.focus({ preventScroll: true });
      }
      interactionIndexRef.current = nextInteraction;
      setInteractionIndex(nextInteraction);
    }

    if (nextIndex === current) return;
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  });

  const scrollToProduct = (index: number) => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const top = timeline.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(0, timeline.offsetHeight - window.innerHeight);
    const targetProgress = index === 0 ? 0.24 : 0.77;
    window.scrollTo({ top: top + travel * targetProgress, behavior: "smooth" });
  };

  return <HomeSection id="products" className="eco-products eco-wrap eco-products-stage">
    <SectionLabel number="03">{copy.products}</SectionLabel>
    <div className="eco-section-heading"><h2 id="products-title">{copy.productsTitle}</h2><p>{copy.productsIntro}</p></div>
    {desktop && projects[0]?.id === "weekfield" && <div className="eco-products-threshold" aria-hidden="true" />}
    <div ref={timelineRef} className="eco-products-stage__timeline" data-staged={staged ? "true" : "false"} data-weekfield-active={desktop && projects[activeIndex]?.id === "weekfield" ? "true" : "false"} data-print-border-active={desktop && projects[activeIndex]?.id === "print-border-studio" ? "true" : "false"}>
      {!desktop ? <ProductsMobileDeck projects={projects} locale={locale} navigate={navigate} /> : <div className="eco-products-stage__sticky">
        {staged && <nav className="eco-products-stage__navigation" aria-label={copy.products}>
          <span className="eco-products-stage__navigation-line" aria-hidden="true" />
          {projects.map((project, index) => <button
            key={project.id}
            type="button"
            onClick={() => scrollToProduct(index)}
            aria-pressed={activeIndex === index}
            className="eco-products-stage__navigation-item"
          ><span>0{index + 1}</span><span>{project.publicName}</span></button>)}
        </nav>}
        <motion.div className="eco-products-stage__scenes" style={sceneStyle}>
          {staged && projects.some((project) => project.id === "print-border-studio") && <motion.div className="eco-products-stage__material-handoff" aria-hidden="true" style={{ backgroundColor: handoffColor }} />}
          {projects.map((project, index) => {
            const poster = resolveHomeProjectPoster(project, locale);
            const live = project.links.find((link) => link.kind === "live");
            const active = !staged || activeIndex === index;
            const interactive = !staged || interactionIndex === index;
            const casePath = projectPath(project, locale, "work");

            return <MobileMotionSection
              as="article"
              key={project.id}
              variant="media"
              delay={index === 0 ? "soft" : "staged"}
              className={`eco-products-stage__project${desktop && project.id === "weekfield" ? " eco-products-stage__project--weekfield" : ""}${desktop && project.id === "print-border-studio" ? " eco-products-stage__project--print-border" : ""}`}
              data-product-index={index}
              data-product-active={active ? "true" : "false"}
              data-product-interactive={interactive ? "true" : "false"}
              data-project-id={project.id}
              inert={staged && !interactive}
              aria-hidden={staged && !interactive ? true : undefined}
            >
              {desktop && project.id === "weekfield" ? <WeekfieldLivingCover
                project={project}
                locale={locale}
                navigate={navigate}
                progress={visualProgress}
                staged={staged}
                active={active}
                total={projects.length}
              /> : desktop && project.id === "print-border-studio" ? <PrintBorderLivingCover
                project={project}
                locale={locale}
                navigate={navigate}
                progress={visualProgress}
                staged={staged}
                active={active}
                total={projects.length}
              /> : <><div className="eco-products-stage__heading">
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
              </div></>}
            </MobileMotionSection>;
          })}
        </motion.div>
      </div>}
    </div>
  </HomeSection>;
}
