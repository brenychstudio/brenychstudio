import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { externalProfiles } from "./profile/ExternalProfileLinks";
import { STUDIO_LOCATION, STUDIO_LOCATION_ES } from "../config/site";
import { getLocalizedPath, useI18n, type LocaleCode } from "../i18n";

type SiteFooterV2Props = {
  onOpenProject?: () => void;
  variant?: FooterVariant;
  hideClosingSignal?: boolean;
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

type FooterExternalLink = {
  label: string;
  href: string;
};

type FooterVariant = "living" | "evidence" | "immersive" | "immersiveCase" | "practice" | "studio" | "case";

type FooterCopy = {
  headline: string;
  signal: string;
  intake: string;
  nextStep: string;
  bottomLine: string;
};

type FooterLocationLabels = {
  base: string;
  scope: string;
  languages: string;
  location: string;
  scopeValue: string;
  languagesValue: string;
  description: string;
};

const routeLinks: FooterLink[] = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Immersive", to: "/immersive" },
  { label: "Offer", to: "/offer" },
  { label: "About", to: "/about" },
];

const systemLinks: FooterLink[] = [
  { label: "Living Systems", to: "/" },
  { label: "Evidence Atlas", to: "/work" },
  { label: "Immersive Interfaces", to: "/immersive" },
  { label: "Practice Model", to: "/offer" },
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

const profileLinks: FooterExternalLink[] = externalProfiles
  .filter(({ label }) => label !== "Brenych.com")
  .map(({ label, href }) => ({
    label,
    href,
  }));

const footerCopyByVariant: Record<FooterVariant, FooterCopy> = {
  living: {
    headline: "Start with the system.",
    signal: "interface systems",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a living interface system.",
  },
  evidence: {
    headline: "Move from proof to project.",
    signal: "evidence layer",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a proof-driven interface system.",
  },
  immersive: {
    headline: "Build the next room as an interface.",
    signal: "spatial systems",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a spatial interface system.",
  },
  immersiveCase: {
    headline: "Build the next room as an interface.",
    signal: "spatial systems",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a spatial interface system.",
  },
  practice: {
    headline: "Translate the system into an offer.",
    signal: "practice route",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as a commercial interface system.",
  },
  studio: {
    headline: "Start with the method.",
    signal: "studio position",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Built as an authorial interface system.",
  },
  case: {
    headline: "Evidence becomes project when the fit is right.",
    signal: "evidence layer",
    intake: "available",
    nextStep: "start a project",
    bottomLine: "Interface systems.",
  },
};

const spanishFooterCopyByVariant: Record<FooterVariant, FooterCopy> = {
  living: {
    headline: "Empieza por el sistema.",
    signal: "sistemas de interfaz",
    intake: "disponible",
    nextStep: "iniciar proyecto",
    bottomLine: "Construido como sistema de interfaz vivo.",
  },
  evidence: {
    headline: "Convierte la prueba en proyecto.",
    signal: "capa de evidencia",
    intake: "disponible",
    nextStep: "iniciar proyecto",
    bottomLine: "Construido como sistema de interfaz basado en prueba.",
  },
  immersive: {
    headline: "Construye el siguiente espacio como interfaz.",
    signal: "sistemas espaciales",
    intake: "disponible",
    nextStep: "iniciar proyecto",
    bottomLine: "Construido como sistema de interfaz espacial.",
  },
  immersiveCase: {
    headline: "Construye el siguiente espacio como interfaz.",
    signal: "sistemas espaciales",
    intake: "disponible",
    nextStep: "iniciar proyecto",
    bottomLine: "Construido como sistema de interfaz espacial.",
  },
  practice: {
    headline: "Convierte el sistema en una oferta.",
    signal: "ruta de practica",
    intake: "disponible",
    nextStep: "iniciar proyecto",
    bottomLine: "Construido como sistema de interfaz comercial.",
  },
  studio: {
    headline: "Empieza por el metodo.",
    signal: "posicion de estudio",
    intake: "disponible",
    nextStep: "iniciar proyecto",
    bottomLine: "Construido como sistema de interfaz autoral.",
  },
  case: {
    headline: "La evidencia se vuelve proyecto cuando el encaje es claro.",
    signal: "capa de evidencia",
    intake: "disponible",
    nextStep: "iniciar proyecto",
    bottomLine: "Sistemas de interfaz.",
  },
};

function getFooterCopy(variant: FooterVariant, locale: LocaleCode) {
  return locale === "es" ? spanishFooterCopyByVariant[variant] : footerCopyByVariant[variant];
}

function localizeFooterLinks(links: FooterLink[], locale: LocaleCode, group: "routes" | "systems" | "services") {
  if (locale !== "es") {
    return links.map((link) => ({ ...link, to: getLocalizedPath(link.to, locale) }));
  }

  const routeLabels: Record<string, string> = {
    "/": "Inicio",
    "/work": "Casos",
    "/immersive": "XR",
    "/offer": "Oferta",
    "/about": "Estudio",
  };
  const systemLabels: Record<string, string> = {
    "/": "Sistemas vivos",
    "/work": "Atlas de evidencia",
    "/immersive": "Interfaces inmersivas",
    "/offer": "Modelo de practica",
  };
  const serviceLabels: Record<string, string> = {
    "/services/premium-landing-page": "Landing pages premium",
    "/services/product-demo-landing": "Landings demo de producto",
    "/services/interactive-web-systems": "Sistemas web interactivos",
  };
  const labelMap = group === "routes" ? routeLabels : group === "systems" ? systemLabels : serviceLabels;

  return links.map((link) => ({
    ...link,
    label: labelMap[link.to] ?? link.label,
    to: getLocalizedPath(link.to, locale),
  }));
}

function FooterLedgerLinks({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="grid gap-2">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">{title}</div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {links.map((link) => (
          <Link
            key={`${title}-${link.to}-${link.label}`}
            to={link.to}
            className="text-[12px] uppercase tracking-[0.12em] text-neutral-600 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function FooterLocationSignal({
  labels,
  tone = "light",
  showDescription = false,
}: {
  labels: FooterLocationLabels;
  tone?: "light" | "immersive";
  showDescription?: boolean;
}) {
  return (
    <div className="mt-4 max-w-[25rem]">
      <div
        className={`grid gap-1.5 border-y py-2.5 font-mono text-[8px] uppercase leading-4 tracking-[0.16em] ${
          tone === "immersive" ? "border-neutral-950/16 text-neutral-700" : "border-neutral-950/10 text-neutral-400"
        }`}
      >
        {[
          [labels.base, labels.location],
          [labels.scope, labels.scopeValue],
          [labels.languages, labels.languagesValue],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
            <span>{label}</span>
            <span className="text-right font-semibold text-neutral-950">{value}</span>
          </div>
        ))}
      </div>
      {showDescription ? (
        <p className={`mt-4 text-[12px] leading-6 ${tone === "immersive" ? "text-neutral-700" : "text-neutral-500"}`}>
          {labels.description}
        </p>
      ) : null}
    </div>
  );
}

export default function SiteFooterV2({
  onOpenProject,
  variant = "living",
  hideClosingSignal = false,
  immersiveCaseContent,
}: SiteFooterV2Props) {
  const reduceMotion = useReducedMotion();
  const { t, locale } = useI18n();
  const isSpanish = locale === "es";
  const copy = getFooterCopy(variant, locale);
  const footerLabels = {
    closingSignal: isSpanish ? "Senal de cierre" : "Closing signal",
    studioSignal: isSpanish ? "Senal de estudio" : "Studio signal",
    projectIntake: isSpanish ? "Entrada de proyecto" : "Project intake",
    nextStep: isSpanish ? "Siguiente paso" : "Next step",
    brandLine: isSpanish ? "Brenych Studio / Sistemas de interfaz" : "Brenych Studio / Interface Systems",
    base: isSpanish ? "Base del estudio" : "Studio base",
    scope: isSpanish ? "Alcance" : "Scope",
    languages: isSpanish ? "Idiomas" : "Languages",
    location: isSpanish ? STUDIO_LOCATION_ES : STUDIO_LOCATION,
    scopeValue: isSpanish ? "Remoto / internacional" : "Remote / international",
    languagesValue: "EN / ES",
    locationDescription: isSpanish
      ? "Estudio de sistemas de interfaz con base en Barcelona para fundadores, marcas, creadores y proyectos culturales en Europa y más allá."
      : "Barcelona-based interface systems studio for founders, brands, creators, and cultural projects across Europe and beyond.",
    spatialHandoff: isSpanish ? "Entrega espacial" : "Spatial handoff",
    caseCanon: isSpanish ? "Canon de caso" : "Case canon",
    signal: isSpanish ? "Senal" : "Signal",
    next: isSpanish ? "Siguiente" : "Next",
    mobileImmersiveHeadline: isSpanish ? "Construir el siguiente espacio." : "Build the next room.",
  };
  const localizedRouteLinks = localizeFooterLinks(routeLinks, locale, "routes");
  const localizedSystemLinks = localizeFooterLinks(systemLinks, locale, "systems");
  const localizedServiceLinks = localizeFooterLinks(serviceLinks, locale, "services");
  const localizedLegalLinks = legalLinks.map((link) => ({
    ...link,
    label: link.to === "/privacy" ? t.footer.privacy : t.footer.legal,
  }));
  const locationLabels: FooterLocationLabels = {
    base: footerLabels.base,
    scope: footerLabels.scope,
    languages: footerLabels.languages,
    location: footerLabels.location,
    scopeValue: footerLabels.scopeValue,
    languagesValue: footerLabels.languagesValue,
    description: footerLabels.locationDescription,
  };
  const isCase = variant === "case";
  const isImmersiveCase = variant === "immersiveCase";
  const immersiveCaseCopy = isImmersiveCase
    ? {
        ...copy,
        headline: immersiveCaseContent?.headline ?? copy.headline,
        signal: immersiveCaseContent?.signal ?? copy.signal,
        intake: immersiveCaseContent?.intake ?? copy.intake,
        nextStep: immersiveCaseContent?.nextStep ?? copy.nextStep,
        bottomLine: immersiveCaseContent?.bottomLine ?? copy.bottomLine,
      }
    : copy;
  const immersiveCaseDescription =
    immersiveCaseContent?.description ??
    (isSpanish
      ? "WHISPER funciona como patron de referencia: prueba espacial, evidencia inspeccionable, reproduccion media y entrada de proyecto dentro de un sistema inmersivo calmado."
      : "WHISPER closes as the reference pattern: spatial proof, inspectable evidence, media playback, and project intake stay inside one calm immersive system.");
  const immersiveCaseCtaLabel = immersiveCaseContent?.ctaLabel ?? t.common.startProject;

  if (isCase) {
    return (
      <motion.footer
        id="site-footer"
        data-header-scene="footer-closing"
        data-footer-rail-state="closing"
        data-sound-safe-area
        className="relative z-10 overflow-hidden border-t border-neutral-950/12 text-neutral-950"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(15,15,15,0.055),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.46),rgba(244,242,236,0.34))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,15,15,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(15,15,15,0.03)_1px,transparent_1px)] bg-[size:76px_76px] opacity-50" />

        <div className="relative mx-auto w-[min(92vw,1640px)] py-10 sm:py-12 lg:w-[min(94vw,1640px)]">
          <div className="grid gap-8 border-b border-neutral-950/[0.08] pb-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                <span>{footerLabels.closingSignal}</span>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-neutral-950"
                  animate={reduceMotion ? undefined : { opacity: [0.34, 1, 0.34], scale: [1, 1.28, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <p className="mt-4 max-w-md text-xl leading-7 text-neutral-700">
                {copy.headline}
              </p>
            </div>

            <div className="border-y border-neutral-950/12 bg-white/18 py-3 backdrop-blur-sm">
              <div className="grid grid-cols-3 divide-x divide-neutral-950/10 font-mono text-[8px] uppercase leading-4 tracking-[0.14em] text-neutral-400">
                <div className="min-w-0 px-2 first:pl-0">
                  <span className="block text-neutral-300">{footerLabels.studioSignal}</span>
                  <span className="mt-1 block text-[8.5px] tracking-[0.12em] text-neutral-950">{copy.signal}</span>
                </div>
                <div className="min-w-0 px-2">
                  <span className="block text-neutral-300">{footerLabels.projectIntake}</span>
                  <span className="mt-1 block text-[8.5px] tracking-[0.12em] text-neutral-950">{copy.intake}</span>
                </div>
                <div className="min-w-0 px-2 last:pr-0">
                  <span className="block text-neutral-300">{footerLabels.nextStep}</span>
                  <span className="mt-1 block text-[8.5px] tracking-[0.12em] text-neutral-950">{copy.nextStep}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-b border-neutral-950/[0.08] py-7 lg:grid-cols-[0.9fr_1.05fr_1.05fr_0.9fr] lg:items-start">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-950">BRENYCH STUDIO</div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                <span>{footerLabels.brandLine}</span>
              </div>
              <FooterLocationSignal labels={locationLabels} />
            </div>

            <FooterLedgerLinks title={t.footer.systems} links={localizedSystemLinks} />
            <FooterLedgerLinks title={t.footer.services} links={localizedServiceLinks} />
            <FooterLedgerLinks title={t.footer.routes} links={localizedRouteLinks} />
          </div>

          <div className="flex flex-col gap-4 pt-6 text-[10px] uppercase tracking-[0.16em] text-neutral-400 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {profileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {localizedLegalLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>&copy; 2026 Brenych Studio</div>
          </div>
        </div>
      </motion.footer>
    );
  }

  if (isImmersiveCase) {
    return (
      <motion.footer
        id="site-footer"
        data-header-scene="footer-closing"
        data-footer-rail-state="closing"
        data-sound-safe-area
        className="relative z-10 overflow-hidden border-t border-white/12 bg-[#a9a8a1] text-neutral-950"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.66),transparent_30%),radial-gradient(circle_at_76%_42%,rgba(10,10,10,0.24),transparent_36%),linear-gradient(108deg,rgba(239,238,232,0.94)_0%,rgba(184,183,176,0.9)_48%,rgba(128,128,123,0.84)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.34),transparent_30%,rgba(0,0,0,0.09)_72%,rgba(255,255,255,0.08)),linear-gradient(rgba(17,17,17,0.036)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.034)_1px,transparent_1px)] bg-[size:100%_100%,72px_72px,72px_72px] opacity-60" />
        <div className="pointer-events-none absolute left-[7vw] top-10 h-[32rem] w-[32rem] rounded-full border border-neutral-950/[0.06]" />
        <div className="pointer-events-none absolute right-[6vw] top-24 h-[26rem] w-[26rem] rounded-full border border-white/18" />
        <div className="pointer-events-none absolute bottom-16 right-[8vw] h-px w-[52vw] -rotate-[6deg] bg-gradient-to-r from-transparent via-neutral-950/24 to-transparent" />

        <div className="relative mx-auto w-[min(92vw,1640px)] py-8 lg:hidden">
          <div className="border-b border-neutral-950/14 pb-7">
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-700">
              <span>{footerLabels.closingSignal}</span>
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-neutral-950"
                animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], scale: [1, 1.24, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <h2 className="mt-5 max-w-[9ch] text-[40px] font-normal leading-[0.9] tracking-normal text-neutral-950">
              {footerLabels.mobileImmersiveHeadline}
            </h2>
            <p className="mt-5 text-[14px] leading-7 text-neutral-700">
              {immersiveCaseDescription}
            </p>

            <div className="mt-6 border border-white/24 bg-neutral-950/[0.035] p-4 backdrop-blur-xl">
              <div className="grid gap-3 font-mono text-[9px] uppercase tracking-[0.18em]">
                <div className="flex items-center justify-between gap-4 border-b border-neutral-950/12 pb-3">
                  <span className="text-neutral-600">{footerLabels.signal}</span>
                  <span className="text-right font-semibold text-neutral-950">{immersiveCaseCopy.signal}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-neutral-950/12 pb-3">
                  <span className="text-neutral-600">{footerLabels.base}</span>
                  <span className="text-right font-semibold text-neutral-950">{footerLabels.location}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-neutral-600">{footerLabels.next}</span>
                  <span className="text-right font-semibold text-neutral-950">{immersiveCaseCopy.nextStep}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenProject?.()}
                className="group mt-5 inline-flex min-h-12 w-full items-center justify-between border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_22px_64px_rgba(17,17,17,0.2)] transition duration-300 hover:bg-[#141414] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
              >
                <span>{immersiveCaseCtaLabel}</span>
                <span className="transition duration-300 group-hover:translate-x-1">-&gt;</span>
              </button>
            </div>
          </div>

          <div className="grid gap-5 py-6">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-950">BRENYCH STUDIO</div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-neutral-700">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                <span>{immersiveCaseCopy.bottomLine}</span>
              </div>
              <FooterLocationSignal labels={locationLabels} tone="immersive" />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[...localizedServiceLinks, ...localizedRouteLinks].map((link) => (
                <Link
                  key={`immersive-case-mobile-route-${link.to}-${link.label}`}
                  to={link.to}
                  className="text-[11px] uppercase tracking-[0.13em] text-neutral-800 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-neutral-950/14 pt-5 text-[9px] uppercase tracking-[0.15em] text-neutral-700">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {profileLinks.slice(0, 3).map((link) => (
                <a
                  key={`immersive-case-mobile-profile-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div>&copy; 2026</div>
          </div>
        </div>

        <div className="relative mx-auto hidden w-[min(92vw,1640px)] py-14 sm:py-16 lg:block lg:w-[min(94vw,1640px)] lg:py-18">
          <div className="grid gap-10 border-b border-neutral-950/14 pb-11 lg:grid-cols-[minmax(0,0.58fr)_minmax(26rem,0.42fr)] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-700">
                <span>{footerLabels.closingSignal}</span>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-neutral-950"
                  animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], scale: [1, 1.24, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <h2 className="mt-6 max-w-[10.5ch] text-[52px] font-normal leading-[0.88] tracking-normal text-neutral-950 sm:text-[76px] lg:text-[104px]">
                {immersiveCaseCopy.headline}
              </h2>
              <p className="mt-7 max-w-[36rem] text-[15px] leading-7 text-neutral-700">
                {immersiveCaseDescription}
              </p>
            </div>

            <div className="relative border border-white/22 bg-neutral-950/[0.035] p-5 shadow-[0_34px_110px_rgba(17,17,17,0.16),inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-xl sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.2),transparent_44%,rgba(0,0,0,0.045))]" />
              <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/86 to-transparent" />
              <div className="pointer-events-none absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-transparent via-neutral-950/16 to-transparent" />
              <div className="relative">
              <div className="flex items-center justify-between gap-4 border-b border-neutral-950/14 pb-4 font-mono text-[9px] uppercase tracking-[0.22em]">
                <span className="text-neutral-500">{footerLabels.spatialHandoff}</span>
                <span className="text-neutral-950">{footerLabels.caseCanon}</span>
              </div>

              <div className="grid gap-0 font-mono text-[10px] uppercase tracking-[0.19em]">
                {[
                  [footerLabels.studioSignal, immersiveCaseCopy.signal],
                  [footerLabels.base, footerLabels.location],
                  [footerLabels.projectIntake, immersiveCaseCopy.intake],
                  [footerLabels.nextStep, immersiveCaseCopy.nextStep],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-neutral-950/12 py-4 last:border-b-0">
                    <span className="text-neutral-600">{label}</span>
                    <span className="text-right font-semibold text-neutral-950">{value}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onOpenProject?.()}
                className="group mt-6 inline-flex min-h-12 w-full items-center justify-between border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_22px_64px_rgba(17,17,17,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#141414] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
              >
                <span>{immersiveCaseCtaLabel}</span>
                <span className="transition duration-300 group-hover:translate-x-1">-&gt;</span>
              </button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 border-b border-neutral-950/14 py-8 lg:grid-cols-[0.9fr_1.05fr_1.05fr_0.9fr] lg:items-start">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-950">BRENYCH STUDIO</div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-700">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                <span>{immersiveCaseCopy.bottomLine}</span>
              </div>
              <FooterLocationSignal labels={locationLabels} tone="immersive" />
            </div>

            <div className="grid gap-2">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600">{t.footer.systems}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {localizedSystemLinks.map((link) => (
                  <Link
                    key={`immersive-case-systems-${link.to}-${link.label}`}
                    to={link.to}
                    className="text-[12px] uppercase tracking-[0.12em] text-neutral-800 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600">{t.footer.services}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {localizedServiceLinks.map((link) => (
                  <Link
                    key={`immersive-case-services-${link.to}-${link.label}`}
                    to={link.to}
                    className="text-[12px] uppercase tracking-[0.12em] text-neutral-800 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600">{t.footer.routes}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {localizedRouteLinks.map((link) => (
                  <Link
                    key={`immersive-case-routes-${link.to}-${link.label}`}
                    to={link.to}
                    className="text-[12px] uppercase tracking-[0.12em] text-neutral-800 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 text-[10px] uppercase tracking-[0.16em] text-neutral-700 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {profileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {localizedLegalLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#a9a8a1]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>&copy; 2026 Brenych Studio</div>
          </div>
        </div>
      </motion.footer>
    );
  }

  return (
    <motion.footer
      id="site-footer"
      data-header-scene="footer-closing"
      data-footer-rail-state="closing"
      data-sound-safe-area
      className="relative z-10 overflow-hidden border-t border-neutral-950/12 text-neutral-950"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.72),transparent_30%),radial-gradient(circle_at_82%_42%,rgba(120,120,120,0.11),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.46),rgba(244,242,236,0.4))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,15,15,0.038)_1px,transparent_1px),linear-gradient(90deg,rgba(15,15,15,0.035)_1px,transparent_1px)] bg-[size:76px_76px] opacity-55" />
      <div className="pointer-events-none absolute left-[8vw] top-8 h-[30rem] w-[30rem] rounded-full border border-neutral-950/[0.05]" />
      <div className="pointer-events-none absolute bottom-12 right-[8vw] h-px w-[46vw] rotate-[-6deg] bg-gradient-to-r from-transparent via-neutral-950/20 to-transparent" />

      <div className="relative mx-auto w-[min(92vw,1640px)] py-10 sm:py-12 lg:w-[min(94vw,1640px)] lg:py-14">
        {!hideClosingSignal ? (
          <div className="grid gap-8 border-b border-neutral-950/[0.08] pb-9 lg:grid-cols-[minmax(0,0.62fr)_minmax(20rem,0.38fr)] lg:items-end">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                <span>{footerLabels.closingSignal}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
              </div>
              <h2 className="mt-5 max-w-[12ch] text-[48px] font-normal leading-[0.9] tracking-[-0.06em] text-neutral-950 sm:text-[72px] lg:text-[92px]">
                {copy.headline}
              </h2>
            </div>

            <div className="border-y border-neutral-950/14 bg-white/20 py-4 backdrop-blur-sm">
              <div className="grid gap-3 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                <div className="flex items-center justify-between gap-5">
                  <span>{footerLabels.studioSignal}</span>
                  <span className="text-neutral-950">{copy.signal}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-neutral-950/40 via-neutral-950/14 to-transparent" />
                <div className="flex items-center justify-between gap-5">
                  <span>{footerLabels.base}</span>
                  <span className="text-neutral-950">{footerLabels.location}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-neutral-950/40 via-neutral-950/14 to-transparent" />
                <div className="flex items-center justify-between gap-5">
                  <span>{footerLabels.projectIntake}</span>
                  <span className="text-neutral-950">{copy.intake}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-neutral-950/40 via-neutral-950/14 to-transparent" />
                <div className="flex items-center justify-between gap-5">
                  <span>{footerLabels.nextStep}</span>
                  <span className="text-neutral-950">{copy.nextStep}</span>
                </div>
              </div>
              <p className="mt-4 border-t border-neutral-950/10 px-1 pt-4 text-[12px] leading-5 text-neutral-500">
                {footerLabels.locationDescription}
              </p>

              <button
                type="button"
                onClick={onOpenProject}
                className="group mt-5 inline-flex min-h-12 w-full items-center justify-between rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_22px_64px_rgba(17,17,17,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
              >
                <span>{t.common.startProject}</span>
                <span className="transition duration-300 group-hover:translate-x-1">-&gt;</span>
              </button>
            </div>
          </div>
        ) : null}

        <div className={`grid gap-6 border-b border-neutral-950/[0.08] lg:grid-cols-[0.9fr_1.05fr_1.05fr_0.9fr] lg:items-start ${hideClosingSignal ? "pb-6" : "py-6"}`}>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-950">BRENYCH STUDIO</div>
            <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-neutral-950"
                animate={reduceMotion ? undefined : { opacity: [0.34, 1, 0.34], scale: [1, 1.28, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <span>{copy.bottomLine}</span>
            </div>
            <FooterLocationSignal labels={locationLabels} />
          </div>

          <FooterLedgerLinks title={t.footer.systems} links={localizedSystemLinks} />
          <FooterLedgerLinks title={t.footer.services} links={localizedServiceLinks} />
          <FooterLedgerLinks title={t.footer.routes} links={localizedRouteLinks} />
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[10px] uppercase tracking-[0.16em] text-neutral-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {profileLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {localizedLegalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div>&copy; 2026 Brenych Studio</div>
        </div>
      </div>
    </motion.footer>
  );
}
