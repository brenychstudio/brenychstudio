import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

import { getLocalizedPath } from "../../i18n";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";

const destinations = ["#products", "#research", "#worlds", "/work", "/immersive", "/offer"] as const;
const territoryPoints = [
  [240, 80], [760, 80], [240, 250], [760, 250], [240, 420], [760, 420],
] as const;

export default function EcosystemMap({ locale, navigate }: HomeSectionProps) {
  const copy = homeCopy[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const activeIndex = focusIndex ?? scrollIndex;
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (typeof window === "undefined" || !window.matchMedia("(min-width: 1024px)").matches) return;
    setScrollIndex(Math.min(destinations.length - 1, Math.floor(progress * destinations.length)));
  });

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const query = window.matchMedia("(max-width: 1023px)");
    const territories = Array.from(field.querySelectorAll<HTMLElement>(".eco-map-territory"));
    let observer: IntersectionObserver | null = null;

    const selectTerritory = () => {
      const focusLine = window.innerHeight * 0.44;
      const visible = territories
        .map((territory, index) => ({ index, rect: territory.getBoundingClientRect() }))
        .filter(({ rect }) => rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.28)
        .sort((a, b) =>
          Math.abs((a.rect.top + a.rect.bottom) / 2 - focusLine) -
          Math.abs((b.rect.top + b.rect.bottom) / 2 - focusLine),
        );
      if (visible[0]) setScrollIndex(visible[0].index);
    };

    const observeMobile = () => {
      observer?.disconnect();
      observer = null;
      if (!query.matches) return;
      observer = new IntersectionObserver(selectTerritory, {
        rootMargin: "-28% 0px -28% 0px",
        threshold: [0, 0.25, 0.6],
      });
      territories.forEach((territory) => observer?.observe(territory));
      selectTerritory();
    };

    observeMobile();
    query.addEventListener("change", observeMobile);
    return () => {
      observer?.disconnect();
      query.removeEventListener("change", observeMobile);
    };
  }, []);

  return (
    <HomeSection id="ecosystem" className="eco-map eco-wrap">
      <SectionLabel number="02">{copy.index}</SectionLabel>
      <div className="eco-section-heading">
        <h2 id="ecosystem-title">{copy.mapTitle}</h2>
        <p>{copy.mapIntro}</p>
      </div>

      <div ref={stageRef} className="eco-map-stage">
        <nav ref={fieldRef} className="eco-map-field" aria-label={copy.chamberHint}>
          <svg className="eco-map-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
            <ellipse className="eco-map-orbit eco-map-orbit-outer" cx="500" cy="250" rx="185" ry="210" />
            <ellipse className="eco-map-orbit eco-map-orbit-inner" cx="500" cy="250" rx="125" ry="145" />
            {territoryPoints.map(([x, y], index) => {
              const state = index === activeIndex ? "active" : index < activeIndex ? "visited" : "idle";
              return (
                <g key={index} data-line-state={state}>
                  <path d={`M500 250L${x} ${y}`} pathLength="1" />
                  <circle cx={x} cy={y} r="4" />
                </g>
              );
            })}
          </svg>

          <div className="eco-map-center" aria-hidden="true">
            <span className="eco-map-core">b.</span>
            <span className="eco-map-center-caption">{copy.center}</span>
            <div className="eco-map-current" key={`${locale}-${activeIndex}`}>
              <span className="eco-map-current-index">0{activeIndex + 1} / 06</span>
              <span className="eco-map-current-title">{copy.chambers[activeIndex][0]}</span>
            </div>
          </div>

          {copy.chambers.map(([title, description], index) => {
            const destination = destinations[index];
            const state = index === activeIndex ? "active" : index < activeIndex ? "visited" : "idle";
            const content = <>
              <span className="eco-chamber-number">0{index + 1}</span>
              <span className="eco-chamber-copy"><strong>{title}</strong><span>{description}</span></span>
              <Arrow />
            </>;

            return (
              <MobileMotionSection
                key={destination}
                className={`eco-map-territory eco-map-territory-${index + 1}`}
                variant="media"
                delay="soft"
                index={index}
                data-territory-state={state}
                onFocus={() => setFocusIndex(index)}
                onBlur={() => setFocusIndex(null)}
              >
                {destination.startsWith("#") ? (
                  <a href={destination} className={`eco-chamber eco-chamber-${index + 1}`}>{content}</a>
                ) : (
                  <HomeLink href={getLocalizedPath(destination, locale)} navigate={navigate} className={`eco-chamber eco-chamber-${index + 1}`}>
                    {content}
                  </HomeLink>
                )}
              </MobileMotionSection>
            );
          })}
        </nav>
      </div>
    </HomeSection>
  );
}
