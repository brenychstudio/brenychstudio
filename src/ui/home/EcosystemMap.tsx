import { getLocalizedPath } from "../../i18n";
import { homeCopy } from "./homeCopy";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";

const destinations = ["#products", "#research", "#worlds", "/work", "/immersive", "/offer"] as const;

export default function EcosystemMap({ locale, navigate }: HomeSectionProps) {
  const copy = homeCopy[locale];
  return <HomeSection id="ecosystem" className="eco-map eco-wrap">
    <SectionLabel number="01">{copy.index}</SectionLabel>
    <div className="eco-section-heading"><h2 id="ecosystem-title">{copy.mapTitle}</h2><p>{copy.mapIntro}</p></div>
    <nav className="eco-map-field" aria-label={copy.chamberHint}>
      <svg className="eco-map-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
        <path d="M500 250L240 80M500 250L240 250M500 250L240 420M500 250L760 80M500 250L760 250M500 250L760 420" />
        <ellipse cx="500" cy="250" rx="185" ry="210" /><ellipse cx="500" cy="250" rx="125" ry="145" />
      </svg>
      <div className="eco-map-center" aria-hidden="true"><span className="eco-map-core">b.</span><span>{copy.center}</span></div>
      {copy.chambers.map(([title, description], index) => {
        const destination = destinations[index];
        const content = <><span className="eco-chamber-number">0{index + 1}</span><span className="eco-chamber-copy"><strong>{title}</strong><span>{description}</span></span><Arrow /></>;
        return destination.startsWith("#")
          ? <a key={destination} href={destination} className={`eco-chamber eco-chamber-${index + 1}`}>{content}</a>
          : <HomeLink key={destination} href={getLocalizedPath(destination, locale)} navigate={navigate} className={`eco-chamber eco-chamber-${index + 1}`}>{content}</HomeLink>;
      })}
    </nav>
  </HomeSection>;
}
