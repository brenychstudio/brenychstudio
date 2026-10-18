import { getLocalizedPath } from "../../i18n";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";

export default function EcosystemSignals({ locale, navigate, onOpenProject }: HomeSectionProps & { onOpenProject?: () => void }) {
  const copy = homeCopy[locale];

  return <>
    <HomeSection id="collaboration" className="eco-closing eco-wrap">
      <MobileMotionSection variant="closing" delay="soft" className="eco-closing-content">
        <SectionLabel number="07">{copy.closing}</SectionLabel>
        <h2 id="collaboration-title">{copy.closingTitle}</h2>
        <div className="eco-closing-bottom"><p>{copy.closingBody}</p><div className="eco-closing-actions"><button className="eco-button" onClick={onOpenProject}>{copy.start}<Arrow /></button><HomeLink href={getLocalizedPath("/offer", locale)} navigate={navigate} className="eco-text-link">{copy.offer}<Arrow /></HomeLink></div></div>
      </MobileMotionSection>
    </HomeSection>
  </>;
}
