import type { PublicLocale } from "../../data/projectRegistry.types";
import StudioHeroField from "../StudioHeroField";
import { useSound } from "../../stage/audio/useSound";
import { homeCopy } from "./homeCopy";
import { Arrow } from "./HomePrimitives";

export default function EcosystemHero({ locale, onOpenProject }: {
  locale: PublicLocale; onOpenProject?: () => void;
}) {
  const copy = homeCopy[locale];
  const { playRole } = useSound();
  return <section id="opening" aria-labelledby="opening-title" className="eco-hero" data-header-scene="living-threshold">
    <div className="eco-hero-field" aria-hidden="true"><StudioHeroField assets={[]} /></div>
    <div className="eco-hero-content eco-wrap">
      <p className="eco-label">{copy.eyebrow}</p>
      <h1 id="opening-title">{copy.hero.map((line) => <span key={line}>{line}</span>)}</h1>
      <div className="eco-hero-bottom">
        <p className="eco-hero-intro">{copy.intro}</p>
        <div className="eco-hero-actions">
          <a className="eco-button" href="#ecosystem" onClick={() => playRole("select")}>{copy.explore}<span aria-hidden="true">↓</span></a>
          <button className="eco-text-link" onClick={onOpenProject} onPointerEnter={() => playRole("hover")}>{copy.start}<Arrow /></button>
        </div>
      </div>
      <div className="eco-hero-footnote" aria-hidden="true"><span>Brenych Studio</span><span>01 — 06</span></div>
    </div>
  </section>;
}
