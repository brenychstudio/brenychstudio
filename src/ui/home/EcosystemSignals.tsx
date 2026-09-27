import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getLocalizedPath } from "../../i18n";
import MobileMotionMedia from "../mobile-motion/MobileMotionMedia";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import MobileMotionLedger, { MobileMotionLedgerRow } from "../mobile-motion/MobileMotionLedger";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";

export default function EcosystemSignals({ locale, navigate, onOpenProject }: HomeSectionProps & { onOpenProject?: () => void }) {
  const copy = homeCopy[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const [phase, setPhase] = useState<"research" | "handoff" | "worlds">("research");
  const beamScale = useTransform(scrollYProgress, [0.1, 0.72], [0.08, 1]);
  const worldTerms = locale === "es"
    ? ["Sistema en tiempo real", "Simulación", "Mundo interactivo"]
    : ["Real-time system", "Simulation", "Interactive world"];

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduced) return;
    const next = progress < 0.32 ? "research" : progress < 0.62 ? "handoff" : "worlds";
    setPhase((current) => current === next ? current : next);
  });

  return <>
    <HomeSection id="research" className="eco-transformation">
      <div className="eco-wrap">
        <MobileMotionSection variant="ledger" className="eco-transform-intro">
          <SectionLabel number="06">{copy.research} / {copy.worlds}</SectionLabel>
          <div className="eco-section-heading"><h2 id="research-title">{copy.researchTitle}</h2><p>{copy.researchBody}</p></div>
        </MobileMotionSection>
        <div ref={stageRef} className="eco-transform-scroll" data-phase={reduced ? "all" : phase}>
          <div className="eco-transform-sticky">
            <MobileMotionMedia className="eco-transform-field" delay="soft">
              <div className="eco-transform-field-head" aria-hidden="true">
                <span>R / W</span><span>{locale === "es" ? "Un sistema en evolución" : "One evolving system"}</span>
              </div>
              <MobileMotionLedger className="eco-transform-nodes eco-transform-research" aria-label={copy.research}>
                {copy.researchTerms.map((term, index) => <MobileMotionLedgerRow key={term} className="eco-transform-node">
                  <span>0{index + 1}</span><strong>{term}</strong><i aria-hidden="true" />
                </MobileMotionLedgerRow>)}
              </MobileMotionLedger>
              <div className="eco-transform-transfer" aria-hidden="true">
                <span className="eco-transform-core">b<span>.</span></span>
                <motion.span className="eco-transform-beam" style={{ scaleX: reduced ? 1 : beamScale }} />
                <span className="eco-transform-pulse" />
              </div>
              <MobileMotionLedger className="eco-transform-nodes eco-transform-worlds" aria-label={copy.worlds}>
                {worldTerms.map((term, index) => <MobileMotionLedgerRow key={term} className="eco-transform-node">
                  <span>0{index + 4}</span><strong>{term}</strong><i aria-hidden="true" />
                </MobileMotionLedgerRow>)}
              </MobileMotionLedger>
            </MobileMotionMedia>
            <div className="eco-transform-story">
              <div className="eco-transform-research-copy"><p>{copy.researchBody}</p><span>{copy.researchTerms.join(" / ")}</span></div>
              <div className="eco-transform-world-copy"><span className="eco-label">{copy.worlds}</span><h3 id="worlds-title">{copy.worldsTitle}</h3><p>{copy.worldsBody}</p><span className="eco-transform-world-note">{copy.worldsNote}</span></div>
            </div>
          </div>
          <div id="worlds" className="eco-worlds-anchor" aria-labelledby="worlds-title" />
        </div>
      </div>
    </HomeSection>
    <HomeSection id="collaboration" className="eco-closing eco-wrap">
      <MobileMotionSection variant="closing" delay="soft" className="eco-closing-content">
        <SectionLabel number="07">{copy.closing}</SectionLabel>
        <h2 id="collaboration-title">{copy.closingTitle}</h2>
        <div className="eco-closing-bottom"><p>{copy.closingBody}</p><div className="eco-closing-actions"><button className="eco-button" onClick={onOpenProject}>{copy.start}<Arrow /></button><HomeLink href={getLocalizedPath("/offer", locale)} navigate={navigate} className="eco-text-link">{copy.offer}<Arrow /></HomeLink></div></div>
      </MobileMotionSection>
    </HomeSection>
  </>;
}
