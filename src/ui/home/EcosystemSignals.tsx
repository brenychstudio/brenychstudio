import { getLocalizedPath } from "../../i18n";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";

export default function EcosystemSignals({ locale, navigate, onOpenProject }: HomeSectionProps & { onOpenProject?: () => void }) {
  const copy = homeCopy[locale];
  return <>
    <div className="eco-signals eco-wrap">
      <HomeSection id="research" className="eco-signal">
        <SectionLabel number="05">{copy.research}</SectionLabel>
        <h2 id="research-title">{copy.researchTitle}</h2>
        <div className="eco-research-diagram" aria-hidden="true"><i /><i /><i /><span>↔</span></div>
        <p>{copy.researchBody}</p><div className="eco-research-terms">{copy.researchTerms.map((term) => <span key={term}>{term}</span>)}</div>
      </HomeSection>
      <HomeSection id="worlds" className="eco-signal">
        <SectionLabel number="06">{copy.worlds}</SectionLabel>
        <h2 id="worlds-title">{copy.worldsTitle}</h2>
        <div className="eco-world-diagram" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <p>{copy.worldsBody}</p><p className="eco-world-note">{copy.worldsNote}</p>
      </HomeSection>
    </div>
    <HomeSection id="collaboration" className="eco-closing eco-wrap">
      <SectionLabel number="↗">{copy.closing}</SectionLabel>
      <h2 id="collaboration-title">{copy.closingTitle}</h2>
      <div className="eco-closing-bottom"><p>{copy.closingBody}</p><div className="eco-closing-actions"><button className="eco-button" onClick={onOpenProject}>{copy.start}<Arrow /></button><HomeLink href={getLocalizedPath("/offer", locale)} navigate={navigate} className="eco-text-link">{copy.offer}<Arrow /></HomeLink></div></div>
    </HomeSection>
  </>;
}
