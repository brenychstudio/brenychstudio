import { Link, useLocation } from "react-router-dom";
import { externalProfiles } from "./profile/ExternalProfileLinks";
import { STUDIO_LOCATION, STUDIO_LOCATION_ES } from "../config/site";
import { getLocalizedPath, useI18n, type LocaleCode } from "../i18n";
import BrandMonogram from "./brand/BrandMonogram";
import "./footer/studioFooter.css";

type SiteFooterV2Props = {
  onOpenProject?: () => void;
  variant?: FooterVariant;
  /** Hide the page's closing line (Home: Section 07 owns the conversion; Products index and service pages). */
  hideClosingSignal?: boolean;
  /** Immersive case closing copy. `headline`, `description` and `ctaLabel` are shown; the remaining fields are accepted for
   *  the existing callers and not rendered (the footer has no status ledger). */
  immersiveCaseContent?: {
    headline?: string;
    description?: string;
    signal?: string;
    intake?: string;
    nextStep?: string;
    bottomLine?: string;
    ctaLabel?: string;
  };
};

type FooterLink = {
  label: string;
  to: string;
};

type FooterVariant = "living" | "evidence" | "immersive" | "immersiveCase" | "practice" | "studio" | "case";

/** The seven real sections, in the Header's order: the ports on the navigation axis. */
const sectionLinks: FooterLink[] = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Games", to: "/games" },
  { label: "Immersive", to: "/immersive" },
  { label: "Work", to: "/work" },
  { label: "Offer", to: "/offer" },
  { label: "About", to: "/about" },
];

const serviceLinks: FooterLink[] = [
  { label: "Premium landing pages", to: "/services/premium-landing-page" },
  { label: "Product demo landings", to: "/services/product-demo-landing" },
  { label: "Interactive web systems", to: "/services/interactive-web-systems" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Legal", to: "/legal" },
];

const profileLinks = externalProfiles
  .filter(({ label }) => label !== "Brenych.com")
  .map(({ label, href }) => ({ label, href }));

/** Each page's closing sentence (shown above the signature unless the page hides its closing signal). */
const closingHeadline: { en: Record<FooterVariant, string>; es: Record<FooterVariant, string> } = {
  en: {
    living: "Start with the system.",
    evidence: "Move from proof to project.",
    immersive: "Build the next room as an interface.",
    immersiveCase: "Build the next room as an interface.",
    practice: "Translate the system into an offer.",
    studio: "Start with the method.",
    case: "Evidence becomes project when the fit is right.",
  },
  es: {
    living: "Empieza por el sistema.",
    evidence: "Convierte la prueba en proyecto.",
    immersive: "Construye el siguiente espacio como interfaz.",
    immersiveCase: "Construye el siguiente espacio como interfaz.",
    practice: "Convierte el sistema en una oferta.",
    studio: "Empieza por el método.",
    case: "La evidencia se vuelve proyecto cuando el encaje es claro.",
  },
};

const spanishLabels: Record<string, string> = {
  "/": "Inicio",
  "/products": "Productos",
  "/work": "Casos",
  "/immersive": "XR",
  "/games": "Juegos",
  "/offer": "Servicios",
  "/about": "Estudio",
  "/services/premium-landing-page": "Landing pages premium",
  "/services/product-demo-landing": "Landings demo de producto",
  "/services/interactive-web-systems": "Sistemas web interactivos",
};

function localizeFooterLinks(links: FooterLink[], locale: LocaleCode) {
  return links.map((link) => ({
    label: locale === "es" ? spanishLabels[link.to] ?? link.label : link.label,
    to: getLocalizedPath(link.to, locale),
  }));
}

const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/** The canonical site footer, a Spatial Signature: identity, one navigation axis of the seven real sections, and a compact
 *  utility line (services, profiles, legal), with an optional closing line per page. One `<footer id="site-footer">`
 *  landmark with the header-scene, Rail and sound-safe hooks. */
export default function SiteFooterV2({
  onOpenProject,
  variant = "living",
  hideClosingSignal = false,
  immersiveCaseContent,
}: SiteFooterV2Props) {
  const { t, locale } = useI18n();
  const { pathname } = useLocation();
  const current = trimSlash(pathname);
  const isSpanish = locale === "es";
  const labels = isSpanish
    ? { nextStep: "Siguiente paso", descriptor: "Ingeniería de producto · Tecnología creativa", sections: "Secciones del sitio", services: t.footer.services,
        elsewhere: "En la red", utility: "Servicios, perfiles y legal", location: STUDIO_LOCATION_ES }
    : { nextStep: "Next step", descriptor: "Product Engineering · Creative Technology", sections: "Site sections", services: t.footer.services,
        elsewhere: "Elsewhere", utility: "Services, profiles and legal", location: STUDIO_LOCATION };
  const isImmersiveCase = variant === "immersiveCase";
  const headline = (isImmersiveCase ? immersiveCaseContent?.headline : undefined) ?? closingHeadline[isSpanish ? "es" : "en"][variant];
  const description = isImmersiveCase
    ? immersiveCaseContent?.description ??
      (isSpanish
        ? "WHISPER funciona como patrón de referencia: prueba espacial, evidencia inspeccionable, reproducción de medios y entrada de proyecto dentro de un sistema inmersivo calmado."
        : "WHISPER closes as the reference pattern: spatial proof, inspectable evidence, media playback, and project intake stay inside one calm immersive system.")
    : undefined;
  const ctaLabel = (isImmersiveCase ? immersiveCaseContent?.ctaLabel : undefined) ?? t.common.startProject;
  const localizedLegalLinks = legalLinks.map((link) => ({ ...link, label: link.to === "/privacy" ? t.footer.privacy : t.footer.legal }));

  return (
    <footer id="site-footer" data-header-scene="footer-closing" data-footer-rail-state="closing" data-sound-safe-area
      className={isImmersiveCase ? "studio-footer studio-footer--solid" : "studio-footer"}>
      <div className="studio-footer__field">
        {!hideClosingSignal ? (
          <div className="studio-footer__closing">
            <p className="studio-footer__label">{labels.nextStep}</p>
            <div className="studio-footer__closing-text">
              <p className="studio-footer__closing-title">{headline}</p>
              {description ? <p className="studio-footer__closing-body">{description}</p> : null}
            </div>
            {onOpenProject ? (
              <button type="button" className="studio-footer__action" onClick={onOpenProject} aria-haspopup="dialog">
                {ctaLabel}<span aria-hidden="true">↗</span>
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="studio-footer__signature">
          <p className="studio-footer__brand"><BrandMonogram className="studio-footer__monogram" />BRENYCH STUDIO</p>
          <p className="studio-footer__descriptor">{labels.descriptor}</p>
          <p className="studio-footer__place">{labels.location}</p>
        </div>

        <nav className="studio-footer__spine" aria-label={labels.sections}>
          <ol className="studio-footer__ports">
            {localizeFooterLinks(sectionLinks, locale).map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="studio-footer__port" aria-current={trimSlash(link.to) === current ? "page" : undefined}>
                  <span className="studio-footer__mark" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="studio-footer__utility" role="group" aria-label={labels.utility}>
          <div className="studio-footer__cluster">
            <p className="studio-footer__label" id="site-footer-services">{labels.services}</p>
            <ul aria-labelledby="site-footer-services">
              {localizeFooterLinks(serviceLinks, locale).map((link) => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>)}
            </ul>
          </div>
          <div className="studio-footer__cluster">
            <p className="studio-footer__label" id="site-footer-elsewhere">{labels.elsewhere}</p>
            <ul aria-labelledby="site-footer-elsewhere">
              {profileLinks.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>)}
            </ul>
          </div>
          <div className="studio-footer__legal">
            <span>&copy; 2026 Brenych Studio</span>
            {localizedLegalLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
