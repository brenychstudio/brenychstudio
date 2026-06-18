import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { getAvailableSystem, isAvailableSystem, type AvailableSystem } from "../data/availableSystems";
import { cases, getCasePath } from "../data/cases";
import { localizeCase } from "../data/localization";
import { spanishCorePageContent, spanishWorkEvidenceTranslations } from "../data/spanishContent";
import {
  evidenceFilters,
  fallbackEvidence,
  workEvidenceBySlug,
  type EvidenceCase,
  type EvidenceFilter,
} from "../data/workEvidence";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import MobileMotionSection from "../ui/mobile-motion/MobileMotionSection";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { startSpaPageTransition } from "../ui/pageTransition";
import { scrollToRailSection, useSectionRailActive } from "../ui/useSectionRailActive";
import { useSound } from "../stage/audio/useSound";
import { useDeferredRouteContent } from "../hooks/useDeferredRouteContent";
import { getLocalizedPath, useI18n, type LocaleCode } from "../i18n";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

type AvailabilityView = {
  label: string;
  shortLabel: string;
  tone: string;
  primaryCta: string;
};

type ArchiveViewMode = "field" | "index";

const ease = [0.22, 1, 0.36, 1] as const;

const featuredSystemSlugs = [
  "creatorops",
  "bcn-advisory",
  "arcwave-integrations",
  "sprintcrm",
  "oria-house-barcelona",
  "casa-nube",
  "aurel-eon-gt",
  "house-of-lune",
  "print-border-studio",
  "form-index",
  "fluid-exhibition",
] as const;

const featuredInitialCaseCount = 8;
const mobileFieldSystemSlugs = ["bcn-advisory", "arcwave-integrations", "sprintcrm"] as const;

const capabilityLayer = [
  {
    label: "Commercial surfaces",
    summary: "Premium websites and product-facing pages that make the offer clear before the user has to search.",
  },
  {
    label: "Workflow products",
    summary: "Tools with real states, imports, exports, selection logic, and operator-facing structure.",
  },
  {
    label: "Multilingual systems",
    summary: "Language-aware presentation for property, hospitality, service, and product environments.",
  },
  {
    label: "Cinematic proof",
    summary: "Visual systems where motion, scroll, imagery, and case structure support the commercial argument.",
  },
  {
    label: "Available foundations",
    summary: "Authored interface systems that can be adapted into commissioned client work.",
  },
  {
    label: "Interactive systems",
    summary: "Presentation surfaces, product flows, and experimental interfaces that carry real interaction logic.",
  },
];

const capabilityProofMatrix = [
  {
    index: "01",
    label: "Commercial proof",
    summary: "Commercial surfaces / Multilingual systems",
  },
  {
    index: "02",
    label: "Product proof",
    summary: "Workflow products / Interactive systems",
  },
  {
    index: "03",
    label: "System proof",
    summary: "Cinematic proof / Available foundations",
  },
];

const mobileEvidenceFilters: EvidenceFilter[] = ["All", "Premium websites", "Product systems", "Advisory", "Tools"];

const evidenceRailItems: SectionRailItem[] = [
  { index: "01", label: "Atlas", id: "evidence-threshold" },
  { index: "02", label: "Featured", id: "evidence-featured" },
  { index: "03", label: "Capability", id: "evidence-capability" },
];

function EvidenceAtlasMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Living Case Atlas - Brenych Studio";

    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.createElement("meta");

    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");

    if (!existing) document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;

      if (existing && previousContent !== null) {
        existing.setAttribute("content", previousContent);
        return;
      }

      if (!existing) meta.remove();
    };
  }, []);

  return null;
}

function getEvidenceCases(locale: LocaleCode): EvidenceCase[] {
  return cases.map((item) => {
    const localizedItem = localizeCase(item, locale);
    const evidence = workEvidenceBySlug[item.slug] ?? fallbackEvidence;
    const translatedEvidence = locale === "es" ? spanishWorkEvidenceTranslations[item.slug] : undefined;

    return {
      ...localizedItem,
      evidence: translatedEvidence ? { ...evidence, ...translatedEvidence } : evidence,
    };
  });
}

function getEvidenceUi(locale: LocaleCode) {
  const isSpanish = locale === "es";

  return {
    viewCase: isSpanish ? "Ver caso ->" : "View case ->",
    adapt: isSpanish ? "Adaptar ->" : "Adapt ->",
    open: isSpanish ? "Abrir ->" : "Open ->",
    openVisualCase: isSpanish ? "Abrir caso visual ->" : "Open visual case ->",
    evidenceIndex: isSpanish ? "Indice de prueba / escaneo compacto" : "Evidence index / compact scan",
    proof: isSpanish ? "Prueba:" : "Proof:",
    transformedIndex: isSpanish ? "Indice transformado / escaneo visual" : "Transformed index / visual scan",
    systems: isSpanish ? "sistemas" : "systems",
    stack: isSpanish ? "Stack" : "Stack",
    systemLayers: isSpanish ? "Capas del sistema" : "System layers",
    signals: isSpanish ? "Senales" : "Signals",
    field: isSpanish ? "Campo" : "Field",
    spatial: isSpanish ? "Espacial" : "Spatial",
    index: isSpanish ? "Indice" : "Index",
    scan: isSpanish ? "Scan" : "Scan",
    activeFilterLabel: (filter: EvidenceFilter) =>
      isSpanish
        ? ({
            All: "Todo",
            "Premium websites": "Webs premium",
            "Product systems": "Sistemas producto",
            Multilingual: "Multilingue",
            Advisory: "Asesoria",
            Hospitality: "Hospitality",
            Tools: "Herramientas",
            Experimental: "Experimental",
            "Available Systems": "Sistemas disponibles",
          }[filter] ?? filter)
        : filter,
  };
}

function getAvailabilityView(system: AvailableSystem): AvailabilityView {
  if (system.status === "available") {
    return {
      label: "Available System",
      shortLabel: "Ready to adapt",
      tone: "text-neutral-950",
      primaryCta: "Adapt this system",
    };
  }

  if (system.status === "custom-only") {
    return {
      label: "Custom Direction",
      shortLabel: "Custom only",
      tone: "text-neutral-600",
      primaryCta: "Discuss similar direction",
    };
  }

  if (system.status === "concept-reference") {
    return {
      label: "Concept Reference",
      shortLabel: "Direction available",
      tone: "text-neutral-600",
      primaryCta: "Discuss similar direction",
    };
  }

  return {
    label: "Case only",
    shortLabel: "Case only",
    tone: "text-neutral-400",
    primaryCta: "Open case",
  };
}

function getAvailabilityStatusLabel(system: AvailableSystem) {
  if (system.status === "available") return "Ready to adapt";
  if (system.status === "custom-only" || system.status === "concept-reference") return "Direction available";
  return "Case only";
}

function getPreviewFrame(item: EvidenceCase) {
  return item.poster.src ?? item.content?.hero?.poster ?? item.content?.hero?.src;
}

function getCoverImageTreatment(item: EvidenceCase, emphasis: "standard" | "hero" = "standard") {
  if (item.coverTone === "dark") {
    return emphasis === "hero" ? "brightness-[1.02] saturate-[1.03]" : "saturate-[1.02]";
  }

  if (item.coverTone === "mixed") {
    return emphasis === "hero"
      ? "brightness-[1.04] saturate-[1.03]"
      : "brightness-[1.02] saturate-[1.02]";
  }

  return emphasis === "hero"
    ? "brightness-[1.03] saturate-[1.03]"
    : "brightness-[1.02] saturate-[1.02]";
}

function getVisualFrames(item: EvidenceCase) {
  const frames = item.content?.frames?.filter((frame) => frame.kind !== "video").map((frame) => frame.src) ?? [];
  return [getPreviewFrame(item), ...frames].filter(Boolean).slice(0, 4);
}

function getCaseCode(item: EvidenceCase, index: number) {
  return item.code || `WK-${String(index + 1).padStart(2, "0")}`;
}

function getEvidenceAtmosphere(item: EvidenceCase) {
  const filters = item.evidence.filters;

  if (filters.includes("Advisory") || item.slug.includes("barcelona")) {
    return {
      label: "shore advisory",
      wash: "rgba(214, 190, 160, 0.18)",
      glow: "rgba(160, 184, 190, 0.2)",
      accent: "rgba(96, 83, 67, 0.34)",
      shadow: "rgba(85, 70, 54, 0.16)",
    };
  }

  if (filters.includes("Tools") || filters.includes("Product systems")) {
    return {
      label: "product signal",
      wash: "rgba(174, 184, 188, 0.16)",
      glow: "rgba(128, 152, 168, 0.18)",
      accent: "rgba(62, 74, 82, 0.32)",
      shadow: "rgba(42, 48, 54, 0.14)",
    };
  }

  if (filters.includes("Experimental")) {
    return {
      label: "cinematic field",
      wash: "rgba(128, 118, 150, 0.16)",
      glow: "rgba(90, 96, 125, 0.2)",
      accent: "rgba(70, 66, 96, 0.3)",
      shadow: "rgba(35, 34, 44, 0.14)",
    };
  }

  if (filters.includes("Hospitality")) {
    return {
      label: "warm archive",
      wash: "rgba(196, 174, 138, 0.16)",
      glow: "rgba(210, 184, 132, 0.18)",
      accent: "rgba(118, 94, 58, 0.32)",
      shadow: "rgba(84, 68, 45, 0.13)",
    };
  }

  return {
    label: "editorial system",
    wash: "rgba(190, 186, 176, 0.14)",
    glow: "rgba(210, 208, 198, 0.18)",
    accent: "rgba(86, 82, 74, 0.28)",
    shadow: "rgba(48, 45, 39, 0.12)",
  };
}

function getFeaturedCases(evidenceCases: EvidenceCase[]) {
  const bySlug = new Map(evidenceCases.map((item) => [item.slug, item]));
  const selected = featuredSystemSlugs.map((slug) => bySlug.get(slug)).filter((item): item is EvidenceCase => Boolean(item));
  const fallback = evidenceCases.filter((item) => item.evidence.featuredEvidence && !selected.some((selectedItem) => selectedItem.slug === item.slug));
  return [...selected, ...fallback].slice(0, featuredSystemSlugs.length);
}

function SectionIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">{label}</div>
      <h2 className="mt-5 max-w-[11ch] text-[46px] font-normal leading-[0.94] tracking-[-0.04em] text-neutral-950 sm:text-[76px] sm:leading-[0.9] sm:tracking-[-0.055em]">
        {title}
      </h2>
      {description ? <p className="mt-6 max-w-[34rem] text-[14px] leading-6 text-neutral-600 sm:mt-7 sm:text-[15px] sm:leading-7">{description}</p> : null}
    </div>
  );
}

function FilterButton({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`group relative grid min-h-9 shrink-0 grid-cols-[1fr_auto] items-center gap-3 overflow-hidden border px-3 text-left font-mono text-[9px] uppercase tracking-[0.13em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:min-h-11 sm:gap-4 sm:px-3.5 sm:text-[10px] sm:tracking-[0.14em] ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_18px_48px_var(--evidence-shadow)]"
          : "border-neutral-950/10 bg-white/30 text-neutral-500 hover:border-neutral-950/28 hover:bg-white/64 hover:text-neutral-950"
      }`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
    >
      {active && <motion.span layoutId="evidence-filter-active" className="absolute inset-0 bg-neutral-950" transition={{ duration: 0.38, ease }} />}
      <span className="relative flex min-w-0 items-center gap-2.5">
        <span className={`relative h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-white" : "bg-neutral-950/18 group-hover:bg-neutral-950/42"}`}>
          {active && <span className="absolute inset-0 animate-ping rounded-full bg-white/38" />}
        </span>
        <span className="truncate">{label}</span>
      </span>
      <span className={`relative border-l pl-3 tabular-nums transition ${active ? "border-white/18 text-white/56" : "border-neutral-950/10 text-neutral-300 group-hover:text-neutral-500"}`}>
        {String(count).padStart(2, "0")}
      </span>
    </motion.button>
  );
}

function FeaturedFlowItem({
  item,
  index,
  variant = "paired",
  onOpenCase,
  onRequestSystem,
  locale,
}: {
  item: EvidenceCase;
  index: number;
  variant?: "selected" | "paired";
  onOpenCase: (item: EvidenceCase) => void;
  onRequestSystem: () => void;
  locale: LocaleCode;
}) {
  const chapterRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const visuals = getVisualFrames(item);
  const availability = getAvailableSystem(item.slug);
  const availabilityView = getAvailabilityView(availability);
  const availabilityStatusLabel = getAvailabilityStatusLabel(availability);
  const canRequest =
    availability.status === "available" ||
    availability.status === "custom-only" ||
    availability.status === "concept-reference";
  const direction = index % 2 === 0 ? 1 : -1;
  const depth = (index % 3) + 1;
  const alignRight = index % 2 === 1;
  const selected = variant === "selected";
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start 92%", "end 8%"],
  });
  const imageX = useTransform(scrollYProgress, [0, 0.5, 1], [24 * direction, 0, -24 * direction]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [46, 0, -42]);
  const imageScale = useTransform(scrollYProgress, [0, 0.48, 1], [0.97, 1.022, 0.99]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [direction * -1.2, 0, direction * 1]);
  const copyX = useTransform(scrollYProgress, [0, 0.5, 1], [-12 * direction, 0, 12 * direction]);
  const copyY = useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -18]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.32, 0.12]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.72, 1, 0.8]);
  const supportingVisuals = visuals.length > 1 ? visuals.slice(1, 4) : visuals.slice(0, 1);
  const fragmentMotion = [
    {
      x: useTransform(scrollYProgress, [0, 0.5, 1], [-16 * direction, 0, 14 * direction]),
      y: useTransform(scrollYProgress, [0, 0.5, 1], [26, 0, -24]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.025, 0.97]),
    },
    {
      x: useTransform(scrollYProgress, [0, 0.5, 1], [-24 * direction, 0, 22 * direction]),
      y: useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -28]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1.02, 0.97]),
    },
    {
      x: useTransform(scrollYProgress, [0, 0.5, 1], [-32 * direction, 0, 30 * direction]),
      y: useTransform(scrollYProgress, [0, 0.5, 1], [34, 0, -30]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.016, 0.965]),
    },
  ];
  const fragmentPositions = alignRight
    ? [
        "left-[2%] top-[19%] h-[18%] w-[24%] sm:left-[2%] sm:top-[16%] sm:h-[24%] sm:w-[25%] xl:h-[28%] xl:w-[28%]",
        "right-[6%] top-[37%] h-[19%] w-[25%] sm:left-[18%] sm:right-auto sm:top-auto sm:bottom-[18%] sm:h-[22%] sm:w-[23%] xl:h-[24%] xl:w-[24%]",
        "right-[4%] top-[8%] h-[15%] w-[22%] sm:right-[4%] sm:top-[4%] sm:h-[18%] sm:w-[24%]",
      ]
    : [
        "right-[2%] top-[19%] h-[18%] w-[24%] sm:right-[2%] sm:top-[16%] sm:h-[24%] sm:w-[25%] xl:h-[28%] xl:w-[28%]",
        "left-[6%] top-[37%] h-[19%] w-[25%] sm:right-[18%] sm:left-auto sm:top-auto sm:bottom-[18%] sm:h-[22%] sm:w-[23%] xl:h-[24%] xl:w-[24%]",
        "left-[4%] top-[8%] h-[15%] w-[22%] sm:left-[4%] sm:top-[4%] sm:h-[18%] sm:w-[24%]",
      ];
  const fragmentRotations = alignRight ? [2.4, -1.8, 1.2] : [-2.4, 1.8, -1.2];
  const ui = getEvidenceUi(locale);

  return (
    <motion.article
      ref={chapterRef}
      data-archive-flow-chapter
      data-archive-depth={depth}
      className={`group relative overflow-hidden border-neutral-950/12 ${
        selected
          ? "min-h-[min(72svh,610px)] border-y py-4 sm:min-h-[680px] sm:py-7 md:min-h-[720px] xl:min-h-[840px] xl:py-9"
          : "min-h-[min(66svh,560px)] border-t py-4 sm:min-h-[640px] sm:py-7 md:min-h-[690px] xl:min-h-[790px] xl:py-10"
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className={`relative overflow-hidden text-left ${selected ? "min-h-[min(68svh,580px)] sm:min-h-[620px] md:min-h-[660px] xl:min-h-[780px]" : "min-h-[min(62svh,530px)] sm:min-h-[590px] md:min-h-[630px] xl:min-h-[710px]"}`}>
        <div className="absolute inset-x-3 top-3 z-40 flex flex-wrap items-center gap-2 sm:inset-x-5 sm:top-5">
          <span className="border-y border-neutral-950/14 bg-[#f8f6f0]/76 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 backdrop-blur-sm xl:hidden">
            {availabilityStatusLabel}
          </span>
          <span className="hidden border-y border-neutral-950/14 bg-[#f8f6f0]/76 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 backdrop-blur-sm xl:inline-flex">
            {selected ? "Selected system" : availabilityView.shortLabel}
          </span>
          <span className="border-y border-neutral-950/12 bg-[#f8f6f0]/66 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400 backdrop-blur-sm">
            {item.evidence.workType}
          </span>
          <span className="border-y border-neutral-950/12 bg-[#f8f6f0]/66 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400 backdrop-blur-sm">
            depth {depth}
          </span>
        </div>

        <div className="absolute bottom-5 left-3 right-3 z-50 flex items-center justify-end gap-2 sm:bottom-9 sm:left-5 sm:right-5 xl:bottom-5 xl:justify-start xl:flex-wrap" data-sound-safe-area>
          <button type="button" onClick={() => onOpenCase(item)} className="inline-flex min-h-10 max-w-full items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-4 text-[10px] uppercase tracking-[0.13em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 sm:px-5 sm:text-[11px] sm:tracking-[0.14em]">
            {ui.viewCase}
          </button>
          {canRequest ? (
            <button type="button" onClick={onRequestSystem} className="hidden min-h-10 max-w-full items-center justify-center rounded-full border border-neutral-300 bg-white/72 px-4 text-[10px] uppercase tracking-[0.13em] text-neutral-700 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white sm:px-5 sm:text-[11px] sm:tracking-[0.14em] xl:inline-flex">
              {availabilityView.primaryCta} -&gt;
            </button>
          ) : null}
        </div>

        <button type="button" onClick={() => onOpenCase(item)} className="absolute inset-0 text-left" aria-label={`Open ${item.title}`}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-45" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 3 64 C 24 22, 54 82, 94 28" fill="none" stroke="rgba(15,15,15,0.13)" strokeWidth="0.11" strokeDasharray="1.1 1.8" />
            <path d="M 10 22 C 34 48, 56 34, 88 74" fill="none" stroke="rgba(15,15,15,0.08)" strokeWidth="0.1" strokeDasharray="0.8 2.3" />
          </svg>

          <motion.span
            aria-hidden="true"
            className={`absolute ${alignRight ? "right-[11%]" : "left-[11%]"} bottom-[15%] h-[18%] w-[58%] rounded-[50%] bg-neutral-950/30 blur-3xl`}
            style={reducedMotion ? undefined : { opacity: shadowOpacity, scale: shadowScale }}
          />

          <motion.span
            className={`absolute overflow-hidden border border-neutral-950/10 bg-neutral-950 shadow-[0_42px_120px_rgba(10,10,10,0.2)] ${
              selected
                ? `top-[5.1rem] h-[42%] w-[88%] sm:top-[5.5rem] sm:h-[48%] sm:w-[82%] md:top-[5.7rem] md:aspect-[16/10] md:h-auto md:w-[70%] xl:top-[10%] xl:h-[66%] xl:w-[76%] ${alignRight ? "right-[4%] xl:right-[6%]" : "left-[4%] xl:left-[6%]"}`
                : `top-[5.1rem] h-[40%] w-[86%] sm:top-[5.5rem] sm:h-[46%] sm:w-[80%] md:top-[5.7rem] md:aspect-[16/10] md:h-auto md:w-[68%] xl:top-[13%] xl:h-[60%] xl:w-[68%] ${alignRight ? "right-[4%] xl:right-[8%]" : "left-[4%] xl:left-[8%]"}`
            }`}
            style={reducedMotion ? undefined : { x: imageX, y: imageY, scale: imageScale, rotate: imageRotate }}
          >
            <img src={visuals[0]} alt="" className={`absolute inset-0 h-full w-full object-cover object-center opacity-100 transition duration-700 group-hover:scale-[1.025] ${getCoverImageTreatment(item, "hero")}`} />
            <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.035),rgba(0,0,0,0)_46%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.26))]" />
            <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/66">{getCaseCode(item, index)}</span>
            <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/58">
              image layer / depth {depth}
            </span>
          </motion.span>

          {supportingVisuals.map((visual, visualIndex) => {
            const motionStyle = fragmentMotion[visualIndex] ?? fragmentMotion[0];

            return (
              <motion.span
                key={`${item.slug}-${visual}-${visualIndex}`}
                className={`absolute ${visualIndex === 2 ? "hidden sm:block" : ""} ${fragmentPositions[visualIndex] ?? fragmentPositions[0]} md:aspect-[4/3] md:h-auto overflow-hidden border border-white/40 bg-white/18 shadow-[0_20px_54px_rgba(10,10,10,0.14)] backdrop-blur-sm`}
                style={reducedMotion ? undefined : { x: motionStyle.x, y: motionStyle.y, scale: motionStyle.scale, rotate: fragmentRotations[visualIndex] ?? 0 }}
              >
                <img src={visual} alt="" className={`absolute inset-0 h-full w-full object-cover object-center opacity-100 ${getCoverImageTreatment(item)}`} />
                <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.12em] text-white/70">signal {visualIndex + 1}</span>
              </motion.span>
            );
          })}

          <motion.span
            className={`absolute bottom-[5.75rem] left-[4%] right-[4%] z-30 max-w-[calc(100%-2rem)] text-left sm:bottom-[6.9rem] md:bottom-[5.9rem] ${
              alignRight
                ? "xl:left-[4%] xl:right-auto xl:text-left"
                : "xl:left-auto xl:right-[4%] xl:text-right"
            } ${selected ? "xl:bottom-[7%] xl:max-w-[38rem]" : "xl:bottom-[8%] xl:max-w-[27rem]"}`}
            style={reducedMotion ? undefined : { x: copyX, y: copyY }}
          >
            <span aria-hidden="true" className="absolute -inset-x-4 -inset-y-3 -z-10 bg-[radial-gradient(circle_at_center,rgba(248,246,240,0.9),rgba(248,246,240,0.58)_44%,transparent_72%)] blur-sm" />
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">{item.evidence.workType}</span>
            <span className={`mt-2 block font-normal leading-[0.9] tracking-[-0.04em] text-neutral-950 sm:mt-3 sm:tracking-[-0.055em] ${selected ? "text-[50px] sm:text-[62px] xl:text-[98px]" : "text-[42px] sm:text-[54px] xl:text-[64px]"}`}>
              {item.title}
            </span>
            <span className="mt-3 block max-h-10 max-w-[27rem] overflow-hidden text-[12px] leading-5 text-neutral-500 sm:mt-4 sm:max-h-none sm:text-[13px] sm:leading-6">
              {item.evidence.proofLabel}
            </span>
          </motion.span>

          <span className={`absolute ${alignRight ? "left-4" : "right-4"} top-[4.75rem] hidden max-w-[17rem] border-y border-neutral-950/12 bg-[#f8f6f0]/70 px-3 py-2 font-mono text-[9px] uppercase leading-4 tracking-[0.16em] text-neutral-500 backdrop-blur-sm sm:block`}>
            {availability.bestFor.slice(0, 3).join(" / ")}
          </span>
        </button>
      </div>
    </motion.article>
  );
}

function ArchiveViewToggle({
  mode,
  onChange,
  locale,
}: {
  mode: ArchiveViewMode;
  onChange: (mode: ArchiveViewMode) => void;
  locale: LocaleCode;
}) {
  const ui = getEvidenceUi(locale);
  const options: Array<{ value: ArchiveViewMode; label: string; caption: string }> = [
    { value: "field", label: ui.field, caption: ui.spatial },
    { value: "index", label: ui.index, caption: ui.scan },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-full border border-neutral-950/10 bg-white/44 p-1 backdrop-blur-sm">
      {options.map((option) => {
        const active = mode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative min-h-8 overflow-hidden rounded-full px-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
              active ? "text-white" : "text-neutral-400 hover:text-neutral-950"
            }`}
            aria-pressed={active}
          >
            {active ? (
              <motion.span
                layoutId="archive-view-mode-active"
                className="absolute inset-0 rounded-full bg-neutral-950"
                transition={{ duration: 0.42, ease }}
              />
            ) : null}
            <span className="relative grid grid-cols-[auto_1fr] items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-neutral-950/18"}`} />
              <span className="grid">
                <span className="font-mono text-[9px] uppercase leading-none tracking-[0.16em]">{option.label}</span>
                <span className={`mt-1 hidden font-mono text-[8px] uppercase leading-none tracking-[0.13em] sm:block ${active ? "text-white/48" : "text-neutral-300"}`}>
                  {option.caption}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function WorkIndexTransformList({
  items,
  onOpenCase,
  onRequestSystem,
  onFocusCase,
  locale,
}: {
  items: EvidenceCase[];
  onOpenCase: (item: EvidenceCase) => void;
  onRequestSystem: () => void;
  onFocusCase: (slug: string) => void;
  locale: LocaleCode;
}) {
  const ui = getEvidenceUi(locale);

  return (
    <>
      <motion.div
        key="work-index-compact-list"
        className="relative overflow-hidden border-y border-neutral-950/14 bg-white/20 pb-3 backdrop-blur-sm xl:hidden"
        data-sound-safe-area
        initial={{ opacity: 0, y: 24, filter: "blur(8px)", clipPath: "inset(0 0 100% 0)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
        exit={{ opacity: 0, y: -18, filter: "blur(7px)", clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.62, ease }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative grid min-h-10 grid-cols-[1fr_auto] items-center gap-3 border-b border-neutral-950/10 px-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">{ui.evidenceIndex}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-300">{String(items.length).padStart(2, "0")}</div>
        </div>

        <div className="relative">
          {items.map((item, index) => {
            const availability = getAvailableSystem(item.slug);
            const availabilityView = getAvailabilityView(availability);

            return (
              <motion.article
                key={item.slug}
                data-work-index-row
                className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-neutral-950/10 px-3 py-3 last:border-b-0"
                initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.44, delay: index * 0.035, ease }}
                onMouseEnter={() => onFocusCase(item.slug)}
                onFocus={() => onFocusCase(item.slug)}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-300">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  onClick={() => onOpenCase(item)}
                  className="min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8px] uppercase tracking-[0.13em] text-neutral-400">
                    <span className="truncate">{item.evidence.workType}</span>
                    <span className="text-neutral-300">/</span>
                    <span className={availabilityView.tone}>{availabilityView.shortLabel}</span>
                  </div>
                  <div className="mt-1 truncate text-[24px] font-normal leading-none tracking-[-0.04em] text-neutral-950 sm:text-[30px]">
                    {item.title}
                  </div>
                  <p className="mt-1 truncate text-[12px] leading-5 text-neutral-500 sm:text-[13px]">
                    {ui.proof} {item.evidence.proofLabel}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCase(item)}
                  className="inline-flex min-h-9 items-center rounded-full border border-neutral-950 bg-neutral-950 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white transition group-hover:-translate-y-0.5 group-hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                  aria-label={`Open ${item.title}`}
                >
                  {ui.open}
                </button>
              </motion.article>
            );
          })}
        </div>
      </motion.div>

    <motion.div
      key="work-index-transform-list"
      className="relative hidden overflow-hidden border-y border-neutral-950/14 bg-white/18 backdrop-blur-sm xl:block"
      initial={{ opacity: 0, y: 34, filter: "blur(10px)", clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, y: -24, filter: "blur(8px)", clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.72, ease }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative grid min-h-11 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/10 px-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">{ui.transformedIndex}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{String(items.length).padStart(2, "0")} {ui.systems}</div>
      </div>

      <div className="relative">
        {items.map((item, index) => {
          const availability = getAvailableSystem(item.slug);
          const availabilityView = getAvailabilityView(availability);
          const canRequest =
            availability.status === "available" ||
            availability.status === "custom-only" ||
            availability.status === "concept-reference";
          const stackItems = item.stackLabel.split("/").map((part) => part.trim()).filter(Boolean).slice(0, 4);
          const layerItems = item.evidence.layers.slice(0, 3);
          const tagItems = item.evidence.systemTags.slice(0, 4);

          return (
            <motion.article
              key={item.slug}
              className="group relative grid gap-4 border-b border-neutral-950/10 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(13rem,0.28fr)_minmax(0,1fr)] md:items-stretch md:px-5 lg:grid-cols-[minmax(16rem,0.3fr)_minmax(0,1fr)]"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.56, delay: index * 0.045, ease }}
              onMouseEnter={() => onFocusCase(item.slug)}
              onFocus={() => onFocusCase(item.slug)}
            >
              <button
                type="button"
                onClick={() => onOpenCase(item)}
                className="relative min-h-[170px] overflow-hidden border border-neutral-950/10 bg-[#f8f6f0]/82 text-left shadow-[0_20px_58px_rgba(10,10,10,0.08)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_28px_76px_rgba(10,10,10,0.13)] sm:min-h-[190px] md:min-h-[205px]"
                aria-label={`Open ${item.title}`}
              >
                <span className="absolute inset-2 border border-neutral-950/6 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.55),transparent_38%),rgba(246,244,238,0.62)]" />
                <img src={getPreviewFrame(item)} alt="" className={`absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] object-contain object-center opacity-100 transition duration-700 group-hover:scale-[1.015] ${getCoverImageTreatment(item, "hero")}`} />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0)_64%,rgba(0,0,0,0.08))]" />
                <span className="absolute left-4 top-4 bg-neutral-950/28 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/78 backdrop-blur-sm">
                  {getCaseCode(item, index)} / {item.evidence.workType}
                </span>
                <span className="absolute bottom-4 left-4 bg-neutral-950/24 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/76 backdrop-blur-sm">
                  {ui.openVisualCase}
                </span>
              </button>

              <div className="grid min-h-full gap-4 border-y border-neutral-950/10 bg-[#f8f6f0]/42 px-4 py-4 backdrop-blur-sm sm:px-5 md:grid-cols-[minmax(0,1fr)_13rem] md:items-end">
                <div className="self-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="border-y border-neutral-950/12 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-400">
                      {availabilityView.shortLabel}
                    </span>
                    <span className="border-y border-neutral-950/12 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-400">
                      {item.evidence.capability}
                    </span>
                  </div>
                  <button type="button" onClick={() => onOpenCase(item)} className="mt-5 block max-w-[13ch] text-left text-[40px] font-normal leading-[0.9] tracking-[-0.055em] text-neutral-950 transition group-hover:translate-x-1 sm:text-[54px] lg:text-[62px]">
                    {item.title}
                  </button>
                  <p className="mt-4 max-w-[42rem] text-[14px] leading-6 text-neutral-600">{item.evidence.proofLabel}</p>
                  <div className="mt-5 grid gap-0 border-y border-neutral-950/10 lg:grid-cols-3">
                    <div className="border-b border-neutral-950/10 py-2.5 lg:border-b-0 lg:border-r lg:pr-4">
                      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-300">{ui.stack}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {stackItems.map((stackItem) => (
                          <span key={stackItem} className="border border-neutral-950/10 bg-white/38 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-500">
                            {stackItem}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-b border-neutral-950/10 py-2.5 lg:border-b-0 lg:border-r lg:px-4">
                      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-300">{ui.systemLayers}</div>
                      <div className="mt-2 font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-neutral-500">
                        {layerItems.join(" / ")}
                      </div>
                    </div>
                    <div className="py-2.5 lg:pl-4">
                      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-300">{ui.signals}</div>
                      <div className="mt-2 font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-neutral-500">
                        {tagItems.join(" / ")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:justify-items-end md:text-right">
                  <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-neutral-400">
                    {availability.bestFor.slice(0, 3).join(" / ")}
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <button type="button" onClick={() => onOpenCase(item)} className="inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800">
                      {ui.viewCase}
                    </button>
                    {canRequest ? (
                      <button type="button" onClick={onRequestSystem} className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/72 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white">
                        {ui.adapt}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
    </>
  );
}

export default function EvidenceAtlas({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const { playRole, setScene, stopAmbient } = useSound();
  const routeContentReady = useDeferredRouteContent();
  const copy = locale === "es" ? spanishCorePageContent.work : null;
  const ui = getEvidenceUi(locale);
  const evidenceCases = useMemo(() => getEvidenceCases(locale), [locale]);
  const featuredCases = useMemo(() => getFeaturedCases(evidenceCases), [evidenceCases]);
  const initialFeaturedCases = useMemo(() => featuredCases.slice(0, featuredInitialCaseCount), [featuredCases]);
  const selectedFeaturedCase = initialFeaturedCases[0];
  const supportingFeaturedCases = useMemo(() => initialFeaturedCases.slice(1), [initialFeaturedCases]);
  const expandedArchiveRef = useRef<HTMLDivElement | null>(null);
  const expandedArchiveSeenRef = useRef(false);
  const expandedFeaturedCases = useMemo(
    () => evidenceCases.filter((item) => !initialFeaturedCases.some((featuredItem) => featuredItem.slug === item.slug)),
    [evidenceCases, initialFeaturedCases],
  );
  const [activeSlug, setActiveSlug] = useState(featuredCases[0]?.slug ?? evidenceCases[0]?.slug ?? "");
  const [activeFilter, setActiveFilter] = useState<EvidenceFilter>("All");
  const [archiveViewMode, setArchiveViewMode] = useState<ArchiveViewMode>("field");
  const [archiveExpanded, setArchiveExpanded] = useState(false);
  const [focusedHeroSlug, setFocusedHeroSlug] = useState<string | null>(null);
  const activeSectionId = useSectionRailActive(evidenceRailItems);

  useEffect(() => {
    setScene("evidence");
    stopAmbient();
  }, [setScene, stopAmbient]);

  const filteredCases = useMemo(() => {
    if (activeFilter === "All") return evidenceCases;
    if (activeFilter === "Available Systems") return evidenceCases.filter((item) => isAvailableSystem(item.slug));
    return evidenceCases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, evidenceCases]);

  const archiveVisibleCases = useMemo(
    () => filteredCases.filter((item) => item.slug !== selectedFeaturedCase?.slug),
    [filteredCases, selectedFeaturedCase?.slug],
  );
  const mobileSupportingFeaturedCases = useMemo(() => {
    const priority = new Map<string, number>(mobileFieldSystemSlugs.map((slug, index) => [slug, index]));
    return supportingFeaturedCases
      .filter((item) => priority.has(item.slug))
      .sort((a, b) => (priority.get(a.slug) ?? 0) - (priority.get(b.slug) ?? 0));
  }, [supportingFeaturedCases]);

  const filteredSupportingFeaturedCases = useMemo(() => {
    const cases = supportingFeaturedCases.filter((item) => item.slug !== selectedFeaturedCase?.slug);
    if (activeFilter === "All") return cases;
    if (activeFilter === "Available Systems") return cases.filter((item) => isAvailableSystem(item.slug));
    return cases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, selectedFeaturedCase?.slug, supportingFeaturedCases]);
  const filteredMobileSupportingFeaturedCases = useMemo(() => {
    if (activeFilter === "All") return mobileSupportingFeaturedCases;
    if (activeFilter === "Available Systems") return mobileSupportingFeaturedCases.filter((item) => isAvailableSystem(item.slug));
    return mobileSupportingFeaturedCases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, mobileSupportingFeaturedCases]);
  const fieldVisibleCount = (selectedFeaturedCase ? 1 : 0) + filteredSupportingFeaturedCases.length;

  const filteredExpandedCases = useMemo(() => {
    if (activeFilter === "All") return expandedFeaturedCases;
    if (activeFilter === "Available Systems") return expandedFeaturedCases.filter((item) => isAvailableSystem(item.slug));
    return expandedFeaturedCases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, expandedFeaturedCases]);
  const filteredMobileExtendedCases = useMemo(() => {
    const visibleSlugs = new Set([
      selectedFeaturedCase?.slug,
      ...filteredMobileSupportingFeaturedCases.map((item) => item.slug),
    ].filter(Boolean));
    const remainingFeatured = filteredSupportingFeaturedCases.filter((item) => !visibleSlugs.has(item.slug));
    return [...remainingFeatured, ...filteredExpandedCases];
  }, [filteredExpandedCases, filteredMobileSupportingFeaturedCases, filteredSupportingFeaturedCases, selectedFeaturedCase?.slug]);

  const filteredSupportingFeaturedColumns = useMemo(
    () => ({
      left: filteredSupportingFeaturedCases.filter((_, index) => index % 2 === 0),
      right: filteredSupportingFeaturedCases.filter((_, index) => index % 2 === 1),
    }),
    [filteredSupportingFeaturedCases],
  );

  const expandedFeaturedColumns = useMemo(
    () => ({
      left: filteredExpandedCases.filter((_, index) => index % 2 === 0),
      right: filteredExpandedCases.filter((_, index) => index % 2 === 1),
    }),
    [filteredExpandedCases],
  );

  const activeCase =
    filteredCases.find((item) => item.slug === activeSlug) ??
    evidenceCases.find((item) => item.slug === activeSlug) ??
    filteredCases[0] ??
    evidenceCases[0];
  const atmosphere = getEvidenceAtmosphere(activeCase);
  const surfaceStyle = {
    "--evidence-wash": atmosphere.wash,
    "--evidence-glow": atmosphere.glow,
    "--evidence-accent": atmosphere.accent,
    "--evidence-shadow": atmosphere.shadow,
  } as CSSProperties;

  const filterCount = (filter: EvidenceFilter) =>
    filter === "All"
      ? evidenceCases.length
      : filter === "Available Systems"
        ? evidenceCases.filter((item) => isAvailableSystem(item.slug)).length
        : evidenceCases.filter((item) => item.evidence.filters.includes(filter)).length;

  const chooseFilter = (filter: EvidenceFilter) => {
    playRole("select");
    setActiveFilter(filter);
    const firstMatch =
      filter === "All"
        ? evidenceCases[0]
        : filter === "Available Systems"
          ? evidenceCases.find((item) => isAvailableSystem(item.slug))
          : evidenceCases.find((item) => item.evidence.filters.includes(filter));
    if (firstMatch) {
      setActiveSlug(firstMatch.slug);
    }
  };

  const openCase = (item: EvidenceCase) => {
    playRole("select");
    startSpaPageTransition(navigate, getLocalizedPath(getCasePath(item.slug), locale), onCloseProject);
  };

  const requestSystem = () => {
    playRole("open");
    onOpenProject?.();
  };

  const selectCase = (slug: string) => {
    if (slug !== activeSlug) playRole("hover");
    setActiveSlug(slug);
  };

  const changeArchiveViewMode = (mode: ArchiveViewMode) => {
    if (mode === archiveViewMode) return;
    playRole("transition");
    setArchiveViewMode(mode);
  };

  useEffect(() => {
    if (!archiveExpanded) return;

    const collapseWhenReturning = () => {
      const expandedElement = expandedArchiveRef.current;
      if (!expandedElement) return;
      const expandedTop = expandedElement.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= expandedTop - window.innerHeight * 0.35) {
        expandedArchiveSeenRef.current = true;
      }
      if (expandedArchiveSeenRef.current && window.scrollY < expandedTop - window.innerHeight * 0.72) {
        setArchiveExpanded(false);
      }
    };

    window.addEventListener("scroll", collapseWhenReturning, { passive: true });
    return () => window.removeEventListener("scroll", collapseWhenReturning);
  }, [archiveExpanded]);

  useEffect(() => {
    if (!archiveExpanded) return;

    const scrollToExpandedArchive = () => {
      const expandedElement = expandedArchiveRef.current;
      if (!expandedElement) return;

      const headerOffset = window.matchMedia("(max-width: 1279px)").matches ? 18 : 108;
      const top = expandedElement.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
    };

    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToExpandedArchive);
    });
    const afterLayout = window.setTimeout(scrollToExpandedArchive, 360);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(afterLayout);
    };
  }, [archiveExpanded]);

  const expandArchive = () => {
    playRole("transition");
    expandedArchiveSeenRef.current = false;
    setArchiveExpanded(true);
  };

  const heroFragments = featuredCases.slice(0, 6);
  const focusedHeroCase = heroFragments.find((item) => item.slug === focusedHeroSlug) ?? null;
  const activeHeroCase = heroFragments.find((item) => item.slug === activeCase.slug) ?? heroFragments[0] ?? activeCase;
  const activeHeroIndex = Math.max(0, heroFragments.findIndex((item) => item.slug === activeHeroCase.slug));

  const focusHeroCase = (item: EvidenceCase) => {
    playRole("transition");
    selectCase(item.slug);
    setFocusedHeroSlug(item.slug);
  };

  const moveFocusedHero = (direction: 1 | -1) => {
    if (!focusedHeroCase) return;

    const currentIndex = heroFragments.findIndex((item) => item.slug === focusedHeroCase.slug);
    const nextIndex = (currentIndex + direction + heroFragments.length) % heroFragments.length;
    const nextCase = heroFragments[nextIndex];

    if (nextCase) focusHeroCase(nextCase);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      {noIndex ? <EvidenceAtlasMeta /> : null}
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="tablet-reader-surface relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="evidence" />
        <SectionRail items={evidenceRailItems} activeId={activeSectionId} onSelect={scrollToRailSection} label="Living Case Atlas sections" />

        <main className="relative pt-24" style={surfaceStyle}>
          <MobileMotionSection as="section" variant="threshold" id="evidence-threshold" data-header-scene="evidence-threshold" data-sound-safe-area className="relative z-10 mx-auto w-[min(94vw,1640px)] py-7 pb-9 lg:min-h-[calc(100vh-6rem)] lg:py-12">
            <div className="grid gap-8 border-y border-neutral-950/14 py-7 sm:gap-10 sm:py-10 lg:min-h-[calc(100vh-10rem)] xl:grid-cols-[0.54fr_0.46fr] xl:items-center">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">{copy?.eyebrow ?? "Work Archive / Living Case Atlas"}</div>
                <h1 className="mt-6 max-w-[10.5ch] text-[50px] font-normal leading-[0.92] tracking-[-0.045em] text-neutral-950 [overflow-wrap:anywhere] sm:text-[92px] sm:leading-[0.9] sm:tracking-[-0.06em] xl:text-[124px]">
                  {copy ? copy.title : (
                    <>
                      <span className="block sm:inline">Selected work, </span>
                      <span className="block sm:inline">built as </span>
                      <span className="block sm:inline">interface </span>
                      <span className="block sm:inline">systems.</span>
                    </>
                  )}
                </h1>
                <p className="mt-7 max-w-[44rem] text-[15px] leading-7 text-neutral-600 sm:mt-8 sm:text-[17px] sm:leading-8">
                  {copy?.body ??
                    "A curated atlas of premium websites, product systems, tools, multilingual surfaces, and immersive interface experiments, presented as visual systems, available foundations, and proof layers."}
                </p>
                <div className="mt-8 flex flex-wrap gap-3 sm:mt-10" data-sound-safe-area>
                  <a className="inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800" href="#evidence-featured">
                    {copy?.labels?.selectedSystem ?? "Explore featured systems"} -&gt;
                  </a>
                  <a className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/60 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white" href="#work-lens">
                    {copy?.labels?.archiveLens ?? "View archive lens"} -&gt;
                  </a>
                  <a className="hidden min-h-10 items-center rounded-full border border-neutral-300 bg-white/60 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white sm:inline-flex" href="#work-lens">
                    Switch archive view -&gt;
                  </a>
                </div>
              </div>

              <div className="relative min-h-[420px] overflow-hidden border border-neutral-950/10 bg-[#f8f6f0]/52 shadow-[0_24px_90px_rgba(10,10,10,0.08)] backdrop-blur-sm sm:min-h-[560px] xl:-ml-14 xl:mr-8 xl:min-h-[660px] xl:w-[calc(100%+3.5rem)] 2xl:-ml-20 2xl:mr-0 2xl:w-[calc(100%+5rem)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,var(--evidence-glow),transparent_38%),linear-gradient(135deg,var(--evidence-wash),transparent_58%)] opacity-70" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="relative grid min-h-12 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/12 px-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Living case field</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{String(heroFragments.length).padStart(2, "0")} systems</div>
                </div>

                <div className="relative min-h-[430px] sm:min-h-[520px] xl:h-[calc(100%-3rem)] xl:min-h-[610px]">
                  <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-45" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 7 70 C 28 28, 55 74, 92 22" fill="none" stroke="rgba(15,15,15,0.18)" strokeWidth="0.12" strokeDasharray="1.2 1.8" />
                    <path d="M 16 20 C 33 46, 58 34, 86 72" fill="none" stroke="rgba(15,15,15,0.12)" strokeWidth="0.1" strokeDasharray="0.8 2.2" />
                  </svg>

                  {heroFragments.map((item, index) => {
                    const active = item.slug === activeCase.slug;
                    const positions = [
                      "left-[3%] top-[8%] h-[42%] w-[58%]",
                      "right-[3%] top-[17%] h-[31%] w-[42%]",
                      "left-[8%] bottom-[11%] h-[31%] w-[40%]",
                      "right-[7%] bottom-[7%] h-[37%] w-[48%]",
                      "left-[37%] top-[45%] h-[27%] w-[35%]",
                      "right-[26%] top-[4%] h-[20%] w-[29%]",
                    ];

                    return (
                      <motion.button
                        key={item.slug}
                        type="button"
                        onMouseEnter={() => selectCase(item.slug)}
                        onFocus={() => selectCase(item.slug)}
                        onClick={() => focusHeroCase(item)}
                        onDoubleClick={() => openCase(item)}
                        className={`group absolute ${positions[index] ?? positions[0]} overflow-hidden border bg-neutral-950 text-left shadow-[0_24px_70px_rgba(10,10,10,0.14)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
                          active ? "z-30 border-neutral-950" : "z-10 border-white/28 hover:z-40 hover:border-neutral-950/60"
                        }`}
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: active ? 1 : 0.9, y: 0, scale: active ? 1.02 : 1 }}
                        transition={{ duration: 0.58, delay: index * 0.05, ease }}
                        aria-label={`Open ${item.title}`}
                      >
                        <img src={getPreviewFrame(item)} alt="" className={`absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04] ${getCoverImageTreatment(item, "hero")}`} />
                        <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(0,0,0,0.01),rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.28))] xl:block" />
                        <div className="absolute left-2 top-2 border-y border-neutral-950/10 bg-[#f8f6f0]/78 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-600 backdrop-blur-sm xl:hidden">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="absolute inset-x-3 bottom-3 hidden xl:block">
                          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/62">{String(index + 1).padStart(2, "0")} / {getAvailableSystem(item.slug).shortLabel}</div>
                          <div className="mt-1 truncate text-[20px] leading-none tracking-[-0.04em] text-white sm:text-[28px]">{item.title}</div>
                        </div>
                      </motion.button>
                    );
                  })}

                  <AnimatePresence>
                    {focusedHeroCase ? (
                      <motion.div
                        className="absolute inset-0 z-50 overflow-hidden bg-[#f8f6f0]/42 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.38, ease }}
                      >
                        <button
                          type="button"
                          aria-label="Close focused work preview"
                          className="absolute inset-0 cursor-default"
                          onClick={() => {
                            playRole("close");
                            setFocusedHeroSlug(null);
                          }}
                        />

                        <div
                          className="absolute inset-0 z-10 grid grid-rows-[minmax(0,1fr)_auto] gap-3 p-4 xl:hidden"
                          onClick={() => {
                            playRole("close");
                            setFocusedHeroSlug(null);
                          }}
                        >
                          <button
                            type="button"
                            aria-label="Close focused work preview"
                            className="absolute right-4 top-4 z-20 rounded-full border border-neutral-950/10 bg-[#f8f6f0]/90 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-600 shadow-[0_12px_34px_rgba(10,10,10,0.1)] backdrop-blur-md transition hover:border-neutral-950 hover:text-neutral-950"
                            onClick={(event) => {
                              event.stopPropagation();
                              playRole("close");
                              setFocusedHeroSlug(null);
                            }}
                          >
                            Close -&gt;
                          </button>
                          <motion.button
                            type="button"
                            onClick={(event) => event.stopPropagation()}
                            onDoubleClick={() => openCase(focusedHeroCase)}
                            className="relative min-h-0 overflow-hidden border border-neutral-950/18 bg-neutral-950 text-left shadow-[0_36px_110px_rgba(10,10,10,0.22)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                            initial={{ opacity: 0, scale: 0.84, y: 22, filter: "blur(8px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.92, y: 14, filter: "blur(7px)" }}
                            transition={{ duration: 0.62, ease }}
                          >
                            <img src={getPreviewFrame(focusedHeroCase)} alt="" className={`absolute inset-0 h-full w-full object-contain object-center opacity-100 ${getCoverImageTreatment(focusedHeroCase, "hero")}`} />
                          </motion.button>

                          <motion.div
                            className="relative border-y border-neutral-950/12 bg-[#f8f6f0]/90 px-4 py-3 backdrop-blur-md"
                            onClick={(event) => event.stopPropagation()}
                            initial={{ opacity: 0, y: 16, clipPath: "inset(0 100% 0 0)" }}
                            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
                            exit={{ opacity: 0, y: 10, clipPath: "inset(0 100% 0 0)" }}
                            transition={{ duration: 0.62, delay: 0.14, ease }}
                          >
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">Terminal signal</div>
                            <div className="mt-2 text-[24px] leading-none tracking-[-0.04em] text-neutral-950">
                              {focusedHeroCase.title}
                            </div>
                            <p className="mt-2 max-h-10 overflow-hidden font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-neutral-600">
                              {focusedHeroCase.evidence.proofLabel} / {focusedHeroCase.evidence.capability}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button type="button" onClick={() => moveFocusedHero(-1)} className="border-y border-neutral-950/14 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950">
                                Prev
                              </button>
                              <button type="button" onClick={() => moveFocusedHero(1)} className="border-y border-neutral-950/14 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950">
                                Next
                              </button>
                              <button type="button" onClick={() => openCase(focusedHeroCase)} className="rounded-full border border-neutral-950 bg-neutral-950 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800">
                                Open case -&gt;
                              </button>
                            </div>
                          </motion.div>
                        </div>

                        <motion.button
                          type="button"
                          onClick={(event) => event.stopPropagation()}
                          onDoubleClick={() => openCase(focusedHeroCase)}
                          className="absolute left-1/2 top-[43%] hidden h-[52%] w-[76%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-neutral-950/18 bg-neutral-950 text-left shadow-[0_52px_150px_rgba(10,10,10,0.24)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 xl:block"
                          initial={{ opacity: 0, scale: 0.74, y: 58, rotate: -1.8, filter: "blur(8px)" }}
                          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 0.86, y: 24, rotate: 1.2, filter: "blur(7px)" }}
                          transition={{ duration: 0.72, ease }}
                        >
                          <img src={getPreviewFrame(focusedHeroCase)} alt="" className={`absolute inset-0 h-full w-full object-cover object-center opacity-100 ${getCoverImageTreatment(focusedHeroCase, "hero")}`} />
                          <span className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(0,0,0,0.01),rgba(0,0,0,0.1)_62%,rgba(0,0,0,0.3))] xl:block" />
                          <span className="absolute left-5 top-5 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/62 xl:block">
                            Focused system / double click enters
                          </span>
                          <span className="absolute bottom-5 left-5 hidden max-w-[13ch] text-[42px] leading-[0.88] tracking-[-0.055em] text-white drop-shadow-[0_8px_34px_rgba(0,0,0,0.42)] sm:text-[64px] xl:block">
                            {focusedHeroCase.title}
                          </span>
                        </motion.button>

                        <motion.div
                          className="absolute bottom-4 left-4 right-4 z-10 hidden border-y border-neutral-950/12 bg-[#f8f6f0]/88 px-4 py-3 backdrop-blur-md xl:block"
                          initial={{ opacity: 0, y: 18, clipPath: "inset(0 100% 0 0)" }}
                          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
                          exit={{ opacity: 0, y: 10, clipPath: "inset(0 100% 0 0)" }}
                          transition={{ duration: 0.68, delay: 0.18, ease }}
                        >
                          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                            <div>
                              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">Terminal signal</div>
                              <div className="mt-2 text-[24px] leading-none tracking-[-0.04em] text-neutral-950 xl:hidden">
                                {focusedHeroCase.title}
                              </div>
                              <p className="mt-2 max-w-[42rem] font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-neutral-600">
                                {focusedHeroCase.evidence.proofLabel} / {focusedHeroCase.evidence.capability}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => moveFocusedHero(-1)} className="border-y border-neutral-950/14 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950">
                                Prev
                              </button>
                              <button type="button" onClick={() => moveFocusedHero(1)} className="border-y border-neutral-950/14 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950">
                                Next
                              </button>
                              <button type="button" onClick={() => openCase(focusedHeroCase)} className="rounded-full border border-neutral-950 bg-neutral-950 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800">
                                Open case -&gt;
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="absolute left-4 top-16 z-40 hidden max-w-[15rem] border-y border-neutral-950/12 bg-[#f8f6f0]/72 px-3 py-2 font-mono text-[9px] uppercase leading-4 tracking-[0.16em] text-neutral-500 backdrop-blur-sm sm:block">
                    Desire / systems / availability / proof
                  </div>
                </div>
                {!focusedHeroCase ? (
                  <div className="relative border-t border-neutral-950/10 bg-[#f8f6f0]/70 px-4 py-3 xl:hidden">
                    <div className="font-mono text-[8px] uppercase leading-4 tracking-[0.16em] text-neutral-400">
                      Selected signal / {String(activeHeroIndex + 1).padStart(2, "0")} / {getAvailableSystem(activeHeroCase.slug).shortLabel}
                    </div>
                    <div className="mt-1 truncate text-[24px] leading-none tracking-[-0.04em] text-neutral-950">
                      {activeHeroCase.title}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </MobileMotionSection>

          {routeContentReady ? (
            <>
          <MobileMotionSection as="section" variant="media" delay="soft" id="evidence-featured" data-header-scene="evidence-featured" data-sound-safe-area className="relative z-10 mx-auto w-[min(94vw,1640px)] py-16 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(260px,410px)_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionIntro
                  label="Featured Systems"
                  title="Systems moving through a living scroll field."
                  description="A controlled spatial reading surface: each case behaves like an authored object with image, caption, depth, proof, and adaptation signals moving as one system."
                />
                <div className="mt-8 hidden border-y border-neutral-950/12 py-4 font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-neutral-400 lg:block">
                  Motion serves spatial reading / captions remain signals / proof stays inspectable.
                </div>
              </div>

              <div className="relative">
                {selectedFeaturedCase ? (
                  <div className="relative overflow-hidden bg-white/16 backdrop-blur-sm">
                    <FeaturedFlowItem
                      item={selectedFeaturedCase}
                      index={0}
                      variant="selected"
                      onOpenCase={openCase}
                      onRequestSystem={requestSystem}
                      locale={locale}
                    />
                  </div>
                ) : null}

                <div id="work-lens" className="mt-5 overflow-hidden border-y border-neutral-950/12 bg-white/22 backdrop-blur-sm sm:mt-6">
                  <div className="grid gap-2 border-b border-neutral-950/10 px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Archive lens / compact filters</div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-300">
                        {archiveViewMode === "field"
                          ? `${String(fieldVisibleCount).padStart(2, "0")} featured systems / visual field`
                          : `${String(archiveVisibleCases.length).padStart(2, "0")} archive rows / visual index`}
                      </div>
                    </div>
                    <ArchiveViewToggle mode={archiveViewMode} onChange={changeArchiveViewMode} locale={locale} />
                  </div>
                  <div className="grid gap-2 p-2 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-stretch">
                    <div className="grid grid-flow-col auto-cols-[minmax(8rem,auto)] gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid-flow-row sm:grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] sm:pb-0 xl:hidden [&::-webkit-scrollbar]:hidden">
                      {mobileEvidenceFilters.map((filter) => (
                        <FilterButton key={filter} label={ui.activeFilterLabel(filter)} active={filter === activeFilter} count={filterCount(filter)} onClick={() => chooseFilter(filter)} />
                      ))}
                    </div>
                    <div className="hidden gap-2 xl:grid xl:grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))]">
                      {evidenceFilters.map((filter) => (
                        <FilterButton key={filter} label={ui.activeFilterLabel(filter)} active={filter === activeFilter} count={filterCount(filter)} onClick={() => chooseFilter(filter)} />
                      ))}
                    </div>
                    <div className="border-y border-neutral-950/10 bg-[#f8f6f0]/62 px-3 py-2 font-mono text-[8px] uppercase leading-4 tracking-[0.13em] text-neutral-400 sm:py-3 sm:text-[9px] sm:leading-5 sm:tracking-[0.15em]">
                      Availability and adaptation details live inside each case.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                {archiveViewMode === "index" ? (
                  <WorkIndexTransformList
                    key={`archive-index-${activeFilter}`}
                    items={archiveVisibleCases}
                    onOpenCase={openCase}
                    onRequestSystem={requestSystem}
                    onFocusCase={selectCase}
                    locale={locale}
                  />
                ) : (
                  <motion.div
                    key="archive-field"
                    initial={{ opacity: 0, y: 34, filter: "blur(10px)", clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0, y: -24, filter: "blur(8px)", clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 0.72, ease }}
                  >
              <div className="relative overflow-hidden border-y border-neutral-950/14 bg-white/16 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />
                <div className="relative mx-auto grid max-w-[1480px] gap-10 xl:hidden">
                  {filteredMobileSupportingFeaturedCases.map((item, index) => (
                    <div key={item.slug} className="relative">
                      <FeaturedFlowItem
                        item={item}
                        index={index + 1}
                        onOpenCase={openCase}
                        onRequestSystem={requestSystem}
                        locale={locale}
                      />
                    </div>
                  ))}
                </div>

                <div className="relative mx-auto hidden max-w-[1480px] gap-16 lg:gap-x-32 xl:grid xl:max-w-none xl:grid-cols-2">
                  <div className="grid gap-16 lg:gap-44">
                    {filteredSupportingFeaturedColumns.left.map((item, index) => (
                      <div key={item.slug} className="relative">
                        <FeaturedFlowItem
                          item={item}
                          index={index * 2 + 1}
                          onOpenCase={openCase}
                          onRequestSystem={requestSystem}
                          locale={locale}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-16 lg:gap-44 lg:pt-56">
                    {filteredSupportingFeaturedColumns.right.map((item, index) => (
                      <div key={item.slug} className="relative">
                        <FeaturedFlowItem
                          item={item}
                          index={index * 2 + 2}
                          onOpenCase={openCase}
                          onRequestSystem={requestSystem}
                          locale={locale}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mx-auto grid max-w-[1480px] gap-4 border-t border-neutral-950/10 px-4 py-6 sm:py-8 lg:grid-cols-2 lg:py-10 xl:max-w-none">
                  <div className="hidden lg:block" />
                  <div className="max-w-[28rem] lg:justify-self-end" data-sound-safe-area>
                    <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-neutral-400">
                      <span className="xl:hidden">More cases / {String(filteredMobileExtendedCases.length).padStart(2, "0")} objects</span>
                      <span className="hidden xl:inline">Extended field / {String(filteredExpandedCases.length).padStart(2, "0")} more case objects</span>
                    </div>
                    <p className="mt-3 hidden text-[14px] leading-7 text-neutral-600 xl:block">
                      When the archive grows, this surface can unfold more systems without turning the page into a heavy
                      catalogue.
                    </p>
                    <button
                      type="button"
                      onClick={expandArchive}
                      disabled={filteredMobileExtendedCases.length === 0 && filteredExpandedCases.length === 0}
                      className="mt-4 inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:pointer-events-none disabled:border-neutral-300 disabled:bg-white/50 disabled:text-neutral-300 xl:mt-5"
                    >
                      <span className="xl:hidden">More cases -&gt;</span>
                      <span className="hidden xl:inline">{copy?.labels?.openExtendedField ?? "Open extended field"} -&gt;</span>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {archiveExpanded ? (
                    <motion.div
                      ref={expandedArchiveRef}
                      id="extended-case-field"
                      className="relative border-t border-neutral-950/10 bg-white/12 px-0 py-10"
                      initial={{ opacity: 0, height: 0, y: 28 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 18 }}
                      transition={{ duration: 0.72, ease }}
                    >
                      <div className="mx-auto mb-10 grid max-w-[1480px] gap-3 px-4 lg:grid-cols-[1fr_auto] lg:items-center xl:max-w-none">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                          Expanded archive field / filtered by {activeFilter}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playRole("close");
                            setArchiveExpanded(false);
                          }}
                          className="justify-self-start border-y border-neutral-950/14 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950 lg:justify-self-end"
                        >
                          <span className="xl:hidden">Close -&gt;</span>
                          <span className="hidden xl:inline">Close field -&gt;</span>
                        </button>
                      </div>

                      <div className="relative mx-auto grid max-w-[1480px] gap-10 xl:hidden">
                        {filteredMobileExtendedCases.map((item, index) => (
                          <FeaturedFlowItem
                            key={item.slug}
                            item={item}
                            index={initialFeaturedCases.length + index}
                            onOpenCase={openCase}
                            onRequestSystem={requestSystem}
                            locale={locale}
                          />
                        ))}
                      </div>

                      <div className="relative mx-auto hidden max-w-[1480px] gap-16 lg:grid-cols-2 lg:gap-x-32 xl:grid xl:max-w-none">
                        <div className="grid gap-16 lg:gap-44">
                          {expandedFeaturedColumns.left.map((item, index) => (
                            <FeaturedFlowItem
                              key={item.slug}
                              item={item}
                              index={initialFeaturedCases.length + index * 2}
                              onOpenCase={openCase}
                              onRequestSystem={requestSystem}
                              locale={locale}
                            />
                          ))}
                        </div>

                        <div className="grid gap-16 lg:gap-44 lg:pt-48">
                          {expandedFeaturedColumns.right.map((item, index) => (
                            <FeaturedFlowItem
                              key={item.slug}
                              item={item}
                              index={initialFeaturedCases.length + index * 2 + 1}
                              onOpenCase={openCase}
                              onRequestSystem={requestSystem}
                              locale={locale}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </MobileMotionSection>

          <MobileMotionSection as="section" variant="ledger" delay="soft" id="evidence-capability" data-header-scene="evidence-capability" data-sound-safe-area className="relative z-10 mx-auto grid w-[min(94vw,1640px)] gap-10 py-16 lg:py-24 xl:grid-cols-[0.34fr_0.66fr]">
            <SectionIntro label="Capability Layer" title="What the archive proves." />
            <div className="border-y border-neutral-950/14 bg-white/16 backdrop-blur-sm xl:hidden">
              {capabilityProofMatrix.map((capability) => (
                <div key={capability.index} data-capability-proof-row className="grid grid-cols-[2.6rem_minmax(0,1fr)] gap-3 border-b border-neutral-950/10 px-3 py-5 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:px-5 sm:py-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{capability.index}</div>
                  <div>
                    <div className="text-[26px] font-normal leading-none tracking-[-0.04em] text-neutral-950 sm:text-[34px]">
                      {capability.label}
                    </div>
                    <p className="mt-3 font-mono text-[9px] uppercase leading-5 tracking-[0.13em] text-neutral-500 sm:text-[10px] sm:leading-6 sm:tracking-[0.15em]">
                      {capability.summary}
                    </p>
                  </div>
                </div>
              ))}
              <p className="border-t border-neutral-950/10 px-3 py-4 text-[13px] leading-6 text-neutral-600 sm:px-5 sm:text-[14px] sm:leading-7">
                The archive shows how visual systems become commercial surfaces, tools, multilingual products, and adaptable foundations.
              </p>
            </div>
            <div className="hidden gap-0 border-y border-neutral-950/14 xl:grid xl:grid-cols-3">
              {capabilityLayer.map((capability, index) => (
                <div key={capability.label} className="border-b border-neutral-950/10 p-6 md:border-r md:even:border-r-0 xl:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(even)]:border-r">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{String(index + 1).padStart(2, "0")}</div>
                  <div className="mt-5 text-[30px] leading-none tracking-[-0.04em] text-neutral-950">{capability.label}</div>
                  <p className="mt-5 max-w-[32rem] text-[14px] leading-7 text-neutral-600">{capability.summary}</p>
                </div>
              ))}
            </div>
          </MobileMotionSection>
            </>
          ) : (
            <div aria-hidden="true" className="min-h-[260vh]" />
          )}

        </main>

        {routeContentReady ? <SiteFooterV2 onOpenProject={onOpenProject} variant="evidence" /> : null}
      </PageSurface>
    </div>
  );
}
