import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { getAvailableSystem, isAvailableSystem, type AvailableSystem } from "../data/availableSystems";
import { cases } from "../data/cases";
import {
  evidenceFilters,
  fallbackEvidence,
  workEvidenceBySlug,
  type EvidenceCase,
  type EvidenceFilter,
} from "../data/workEvidence";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { startSpaPageTransition } from "../ui/pageTransition";
import { scrollToRailSection, useSectionRailActive } from "../ui/useSectionRailActive";
import { useSound } from "../stage/audio/useSound";

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
  "house-of-lune",
  "bcn-advisory",
  "creatorops",
  "print-border-studio",
  "fluid-exhibition",
  "casa-nube",
] as const;

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

function getEvidenceCases(): EvidenceCase[] {
  return cases.map((item) => ({
    ...item,
    evidence: workEvidenceBySlug[item.slug] ?? fallbackEvidence,
  }));
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

function getPreviewFrame(item: EvidenceCase) {
  return item.content?.hero?.poster ?? item.content?.hero?.src ?? item.poster.src;
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
  return [...selected, ...fallback].slice(0, 6);
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
      <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.9] tracking-[-0.055em] text-neutral-950 sm:text-[76px]">
        {title}
      </h2>
      {description ? <p className="mt-7 max-w-[34rem] text-[15px] leading-7 text-neutral-600">{description}</p> : null}
    </div>
  );
}

function FilterButton({
  filter,
  active,
  count,
  onClick,
}: {
  filter: EvidenceFilter;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`group relative grid min-h-11 shrink-0 grid-cols-[1fr_auto] items-center gap-4 overflow-hidden border px-3.5 text-left font-mono text-[10px] uppercase tracking-[0.14em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
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
        <span className="truncate">{filter}</span>
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
}: {
  item: EvidenceCase;
  index: number;
  variant?: "selected" | "paired";
  onOpenCase: (item: EvidenceCase) => void;
  onRequestSystem: () => void;
}) {
  const chapterRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const visuals = getVisualFrames(item);
  const availability = getAvailableSystem(item.slug);
  const availabilityView = getAvailabilityView(availability);
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
  const imageX = useTransform(scrollYProgress, [0, 0.5, 1], [34 * direction, 0, -34 * direction]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [82, 0, -78]);
  const imageScale = useTransform(scrollYProgress, [0, 0.48, 1], [0.955, 1.035, 0.985]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [direction * -1.8, 0, direction * 1.4]);
  const copyX = useTransform(scrollYProgress, [0, 0.5, 1], [-18 * direction, 0, 18 * direction]);
  const copyY = useTransform(scrollYProgress, [0, 0.5, 1], [36, 0, -32]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.32, 0.12]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.72, 1, 0.8]);
  const supportingVisuals = visuals.length > 1 ? visuals.slice(1, 4) : visuals.slice(0, 1);
  const fragmentMotion = [
    {
      x: useTransform(scrollYProgress, [0, 0.5, 1], [-24 * direction, 0, 20 * direction]),
      y: useTransform(scrollYProgress, [0, 0.5, 1], [44, 0, -42]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 0.96]),
    },
    {
      x: useTransform(scrollYProgress, [0, 0.5, 1], [-48 * direction, 0, 40 * direction]),
      y: useTransform(scrollYProgress, [0, 0.5, 1], [56, 0, -52]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.035, 0.955]),
    },
    {
      x: useTransform(scrollYProgress, [0, 0.5, 1], [-72 * direction, 0, 60 * direction]),
      y: useTransform(scrollYProgress, [0, 0.5, 1], [68, 0, -62]),
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.025, 0.95]),
    },
  ];
  const fragmentPositions = alignRight
    ? ["left-[2%] top-[16%] h-[28%] w-[28%]", "left-[18%] bottom-[18%] h-[24%] w-[24%]", "right-[4%] top-[4%] h-[18%] w-[24%]"]
    : ["right-[2%] top-[16%] h-[28%] w-[28%]", "right-[18%] bottom-[18%] h-[24%] w-[24%]", "left-[4%] top-[4%] h-[18%] w-[24%]"];
  const fragmentRotations = alignRight ? [2.4, -1.8, 1.2] : [-2.4, 1.8, -1.2];

  return (
    <motion.article
      ref={chapterRef}
      data-archive-flow-chapter
      data-archive-depth={depth}
      className={`group relative overflow-hidden border-neutral-950/12 ${
        selected
          ? "min-h-[660px] border-y py-7 sm:min-h-[760px] sm:py-9 xl:min-h-[840px]"
          : "min-h-[600px] border-t py-8 sm:min-h-[740px] sm:py-10 xl:min-h-[790px]"
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className={`relative overflow-hidden text-left ${selected ? "min-h-[600px] sm:min-h-[700px] xl:min-h-[780px]" : "min-h-[540px] sm:min-h-[660px] xl:min-h-[710px]"}`}>
        <div className="absolute inset-x-3 top-3 z-40 flex flex-wrap items-center gap-2 sm:inset-x-5 sm:top-5">
          <span className="border-y border-neutral-950/14 bg-[#f8f6f0]/76 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 backdrop-blur-sm">
            {selected ? "Selected system" : availabilityView.shortLabel}
          </span>
          <span className="border-y border-neutral-950/12 bg-[#f8f6f0]/66 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400 backdrop-blur-sm">
            {item.evidence.workType}
          </span>
          <span className="border-y border-neutral-950/12 bg-[#f8f6f0]/66 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400 backdrop-blur-sm">
            depth {depth}
          </span>
        </div>

        <div className="absolute bottom-4 left-3 right-3 z-50 flex flex-wrap gap-2 sm:bottom-5 sm:left-5 sm:right-5">
          <button type="button" onClick={() => onOpenCase(item)} className="inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800">
            View case -&gt;
          </button>
          {canRequest ? (
            <button type="button" onClick={onRequestSystem} className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/72 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white">
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
            className={`absolute top-[7%] overflow-hidden border border-neutral-950/10 bg-neutral-950 shadow-[0_42px_120px_rgba(10,10,10,0.2)] ${
              selected
                ? `h-[62%] w-[88%] sm:top-[10%] sm:h-[66%] sm:w-[76%] ${alignRight ? "right-[5%] sm:right-[6%]" : "left-[5%] sm:left-[6%]"}`
                : `h-[55%] w-[80%] sm:top-[13%] sm:h-[60%] sm:w-[68%] ${alignRight ? "right-[5%] sm:right-[8%]" : "left-[5%] sm:left-[8%]"}`
            }`}
            style={reducedMotion ? undefined : { x: imageX, y: imageY, scale: imageScale, rotate: imageRotate }}
          >
            <img src={visuals[0]} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-100 transition duration-700 group-hover:scale-[1.025]" />
            <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0)_46%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.16)_58%,rgba(0,0,0,0.34))]" />
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
                className={`absolute ${fragmentPositions[visualIndex] ?? fragmentPositions[0]} overflow-hidden border border-white/40 bg-white/18 shadow-[0_20px_54px_rgba(10,10,10,0.14)] backdrop-blur-sm`}
                style={reducedMotion ? undefined : { x: motionStyle.x, y: motionStyle.y, scale: motionStyle.scale, rotate: fragmentRotations[visualIndex] ?? 0 }}
              >
                <img src={visual} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-100" />
                <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.12em] text-white/70">signal {visualIndex + 1}</span>
              </motion.span>
            );
          })}

          <motion.span
            className={`absolute z-30 ${alignRight ? "left-[4%] text-left" : "right-[4%] text-right"} ${selected ? "bottom-[7%] max-w-[38rem]" : "bottom-[8%] max-w-[27rem]"}`}
            style={reducedMotion ? undefined : { x: copyX, y: copyY }}
          >
            <span aria-hidden="true" className="absolute -inset-x-4 -inset-y-3 -z-10 bg-[radial-gradient(circle_at_center,rgba(248,246,240,0.9),rgba(248,246,240,0.58)_44%,transparent_72%)] blur-sm" />
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">{item.evidence.workType}</span>
            <span className={`mt-3 block font-normal leading-[0.88] tracking-[-0.055em] text-neutral-950 ${selected ? "text-[50px] sm:text-[82px] lg:text-[98px]" : "text-[38px] sm:text-[56px] lg:text-[64px]"}`}>
              {item.title}
            </span>
            <span className="mt-4 block max-w-[27rem] text-[13px] leading-6 text-neutral-500">
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
}: {
  mode: ArchiveViewMode;
  onChange: (mode: ArchiveViewMode) => void;
}) {
  const options: Array<{ value: ArchiveViewMode; label: string; caption: string }> = [
    { value: "field", label: "Field", caption: "Spatial" },
    { value: "index", label: "Index", caption: "Scan" },
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
}: {
  items: EvidenceCase[];
  onOpenCase: (item: EvidenceCase) => void;
  onRequestSystem: () => void;
  onFocusCase: (slug: string) => void;
}) {
  return (
    <motion.div
      key="work-index-transform-list"
      className="relative overflow-hidden border-y border-neutral-950/14 bg-white/18 backdrop-blur-sm"
      initial={{ opacity: 0, y: 34, filter: "blur(10px)", clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, y: -24, filter: "blur(8px)", clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.72, ease }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative grid min-h-11 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/10 px-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">Transformed index / visual scan</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{String(items.length).padStart(2, "0")} systems</div>
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
                <img src={getPreviewFrame(item)} alt="" className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] object-contain object-center opacity-100 transition duration-700 group-hover:scale-[1.015]" />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0)_64%,rgba(0,0,0,0.08))]" />
                <span className="absolute left-4 top-4 bg-neutral-950/28 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/78 backdrop-blur-sm">
                  {getCaseCode(item, index)} / {item.evidence.workType}
                </span>
                <span className="absolute bottom-4 left-4 bg-neutral-950/24 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/76 backdrop-blur-sm">
                  Open visual case -&gt;
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
                      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-300">Stack</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {stackItems.map((stackItem) => (
                          <span key={stackItem} className="border border-neutral-950/10 bg-white/38 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-500">
                            {stackItem}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-b border-neutral-950/10 py-2.5 lg:border-b-0 lg:border-r lg:px-4">
                      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-300">System layers</div>
                      <div className="mt-2 font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-neutral-500">
                        {layerItems.join(" / ")}
                      </div>
                    </div>
                    <div className="py-2.5 lg:pl-4">
                      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-300">Signals</div>
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
                      View case -&gt;
                    </button>
                    {canRequest ? (
                      <button type="button" onClick={onRequestSystem} className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/72 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white">
                        Adapt -&gt;
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
  );
}

export default function EvidenceAtlas({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const navigate = useNavigate();
  const { playRole, setScene, stopAmbient } = useSound();
  const evidenceCases = useMemo(() => getEvidenceCases(), []);
  const featuredCases = useMemo(() => getFeaturedCases(evidenceCases), [evidenceCases]);
  const selectedFeaturedCase = featuredCases[0];
  const supportingFeaturedCases = useMemo(() => featuredCases.slice(1), [featuredCases]);
  const expandedArchiveRef = useRef<HTMLDivElement | null>(null);
  const expandedArchiveSeenRef = useRef(false);
  const expandedFeaturedCases = useMemo(
    () => evidenceCases.filter((item) => !featuredCases.some((featuredItem) => featuredItem.slug === item.slug)),
    [evidenceCases, featuredCases],
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

  const filteredSupportingFeaturedCases = useMemo(() => {
    const cases = supportingFeaturedCases.filter((item) => item.slug !== selectedFeaturedCase?.slug);
    if (activeFilter === "All") return cases;
    if (activeFilter === "Available Systems") return cases.filter((item) => isAvailableSystem(item.slug));
    return cases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, selectedFeaturedCase?.slug, supportingFeaturedCases]);

  const filteredExpandedCases = useMemo(() => {
    if (activeFilter === "All") return expandedFeaturedCases;
    if (activeFilter === "Available Systems") return expandedFeaturedCases.filter((item) => isAvailableSystem(item.slug));
    return expandedFeaturedCases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, expandedFeaturedCases]);

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
    startSpaPageTransition(navigate, `/work/${item.slug}`, onCloseProject);
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
      const expandedTop = expandedArchiveRef.current?.offsetTop;
      if (!expandedTop) return;
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

  const expandArchive = () => {
    playRole("transition");
    expandedArchiveSeenRef.current = false;
    setArchiveExpanded(true);
    window.setTimeout(() => {
      expandedArchiveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const heroFragments = featuredCases.slice(0, 6);
  const focusedHeroCase = heroFragments.find((item) => item.slug === focusedHeroSlug) ?? null;

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

      <PageSurface className="relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="evidence" />
        <SectionRail items={evidenceRailItems} activeId={activeSectionId} onSelect={scrollToRailSection} label="Living Case Atlas sections" />

        <main className="relative pt-24" style={surfaceStyle}>
          <section id="evidence-threshold" data-header-scene="evidence-threshold" className="relative z-10 mx-auto min-h-[calc(100vh-6rem)] w-[min(94vw,1720px)] py-10 lg:py-12">
            <div className="grid min-h-[calc(100vh-10rem)] gap-10 border-y border-neutral-950/14 py-10 xl:grid-cols-[0.54fr_0.46fr] xl:items-center">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Work Archive / Living Case Atlas</div>
                <h1 className="mt-6 max-w-[10.5ch] text-[52px] font-normal leading-[0.9] tracking-[-0.06em] text-neutral-950 sm:text-[92px] xl:text-[124px]">
                  Selected work, built as interface systems.
                </h1>
                <p className="mt-8 max-w-[44rem] text-[17px] leading-8 text-neutral-600">
                  A curated atlas of premium websites, product systems, tools, multilingual surfaces, and immersive
                  interface experiments, presented as visual systems, available foundations, and proof layers.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a className="inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800" href="#evidence-featured">
                    Explore featured systems -&gt;
                  </a>
                  <a className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/60 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white" href="#work-lens">
                    View archive lens -&gt;
                  </a>
                  <a className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/60 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white" href="#work-lens">
                    Switch archive view -&gt;
                  </a>
                </div>
              </div>

              <div className="relative min-h-[560px] overflow-hidden border border-neutral-950/10 bg-[#f8f6f0]/52 shadow-[0_24px_90px_rgba(10,10,10,0.08)] backdrop-blur-sm sm:min-h-[660px] xl:-ml-14 xl:mr-8 xl:w-[calc(100%+3.5rem)] 2xl:-ml-20 2xl:mr-0 2xl:w-[calc(100%+5rem)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,var(--evidence-glow),transparent_38%),linear-gradient(135deg,var(--evidence-wash),transparent_58%)] opacity-70" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="relative grid min-h-12 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/12 px-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Living case field</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{String(heroFragments.length).padStart(2, "0")} systems</div>
                </div>

                <div className="relative h-[calc(100%-3rem)] min-h-[510px] sm:min-h-[610px]">
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
                        <img src={getPreviewFrame(item)} alt="" className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04]" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.015),rgba(0,0,0,0.18)_58%,rgba(0,0,0,0.34))]" />
                        <div className="absolute inset-x-3 bottom-3">
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

                        <motion.button
                          type="button"
                          onClick={(event) => event.stopPropagation()}
                          onDoubleClick={() => openCase(focusedHeroCase)}
                          className="absolute left-1/2 top-[43%] h-[52%] w-[82%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-neutral-950/18 bg-neutral-950 text-left shadow-[0_52px_150px_rgba(10,10,10,0.24)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:w-[76%]"
                          initial={{ opacity: 0, scale: 0.74, y: 58, rotate: -1.8, filter: "blur(8px)" }}
                          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 0.86, y: 24, rotate: 1.2, filter: "blur(7px)" }}
                          transition={{ duration: 0.72, ease }}
                        >
                          <img src={getPreviewFrame(focusedHeroCase)} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-95" />
                          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.015),rgba(0,0,0,0.12)_62%,rgba(0,0,0,0.36))]" />
                          <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/62">
                            Focused system / double click enters
                          </span>
                          <span className="absolute bottom-5 left-5 max-w-[13ch] text-[42px] leading-[0.88] tracking-[-0.055em] text-white drop-shadow-[0_8px_34px_rgba(0,0,0,0.42)] sm:text-[64px]">
                            {focusedHeroCase.title}
                          </span>
                        </motion.button>

                        <motion.div
                          className="absolute bottom-4 left-4 right-4 z-10 border-y border-neutral-950/12 bg-[#f8f6f0]/82 px-4 py-3 backdrop-blur-md"
                          initial={{ opacity: 0, y: 18, clipPath: "inset(0 100% 0 0)" }}
                          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
                          exit={{ opacity: 0, y: 10, clipPath: "inset(0 100% 0 0)" }}
                          transition={{ duration: 0.68, delay: 0.18, ease }}
                        >
                          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                            <div>
                              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">Terminal signal</div>
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
              </div>
            </div>
          </section>

          <section id="evidence-featured" data-header-scene="evidence-featured" className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-24">
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

              <div className="relative xl:pr-36 2xl:pr-20">
                {selectedFeaturedCase ? (
                  <div className="relative overflow-hidden bg-white/16 backdrop-blur-sm">
                    <FeaturedFlowItem
                      item={selectedFeaturedCase}
                      index={0}
                      variant="selected"
                      onOpenCase={openCase}
                      onRequestSystem={requestSystem}
                    />
                  </div>
                ) : null}

                <div id="work-lens" className="mt-6 overflow-hidden border-y border-neutral-950/12 bg-white/22 backdrop-blur-sm">
                  <div className="grid gap-3 border-b border-neutral-950/10 px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Archive lens / compact filters</div>
                      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-300">{String(archiveVisibleCases.length).padStart(2, "0")} below flagship / {archiveViewMode === "field" ? "spatial field" : "visual index"}</div>
                    </div>
                    <ArchiveViewToggle mode={archiveViewMode} onChange={changeArchiveViewMode} />
                  </div>
                  <div className="grid gap-3 p-2 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-stretch">
                    <div className="grid grid-flow-col auto-cols-[minmax(9.5rem,auto)] gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid-flow-row sm:grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] sm:pb-0 [&::-webkit-scrollbar]:hidden">
                      {evidenceFilters.map((filter) => (
                        <FilterButton key={filter} filter={filter} active={filter === activeFilter} count={filterCount(filter)} onClick={() => chooseFilter(filter)} />
                      ))}
                    </div>
                    <div className="border-y border-neutral-950/10 bg-[#f8f6f0]/62 px-3 py-3 font-mono text-[9px] uppercase leading-5 tracking-[0.15em] text-neutral-400">
                      Availability lives on the case objects. Adaptation details stay inside each full case.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 xl:pr-36 2xl:pr-20">
              <AnimatePresence mode="wait">
                {archiveViewMode === "index" ? (
                  <WorkIndexTransformList
                    key={`archive-index-${activeFilter}`}
                    items={archiveVisibleCases}
                    onOpenCase={openCase}
                    onRequestSystem={requestSystem}
                    onFocusCase={selectCase}
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
                <div className="relative mx-auto grid max-w-[1480px] gap-16 md:grid-cols-2 md:gap-x-24 lg:gap-x-32">
                  <div className="grid gap-16 md:gap-36 lg:gap-44">
                    {filteredSupportingFeaturedColumns.left.map((item, index) => (
                      <div key={item.slug} className="relative">
                        <FeaturedFlowItem
                          item={item}
                          index={index * 2 + 1}
                          onOpenCase={openCase}
                          onRequestSystem={requestSystem}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-16 md:gap-36 md:pt-44 lg:gap-44 lg:pt-56">
                    {filteredSupportingFeaturedColumns.right.map((item, index) => (
                      <div key={item.slug} className="relative">
                        <FeaturedFlowItem
                          item={item}
                          index={index * 2 + 2}
                          onOpenCase={openCase}
                          onRequestSystem={requestSystem}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mx-auto grid max-w-[1480px] gap-6 border-t border-neutral-950/10 px-4 py-8 md:grid-cols-2 md:py-10">
                  <div className="hidden md:block" />
                  <div className="max-w-[28rem] md:justify-self-end">
                    <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-neutral-400">
                      Extended field / {String(filteredExpandedCases.length).padStart(2, "0")} more case objects
                    </div>
                    <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                      When the archive grows, this surface can unfold more systems without turning the page into a heavy
                      catalogue.
                    </p>
                    <button
                      type="button"
                      onClick={expandArchive}
                      disabled={filteredExpandedCases.length === 0}
                      className="mt-5 inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:pointer-events-none disabled:border-neutral-300 disabled:bg-white/50 disabled:text-neutral-300"
                    >
                      Open extended field -&gt;
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
                      <div className="mx-auto mb-10 grid max-w-[1480px] gap-3 px-4 md:grid-cols-[1fr_auto] md:items-center">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                          Expanded archive field / filtered by {activeFilter}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playRole("close");
                            setArchiveExpanded(false);
                          }}
                          className="justify-self-start border-y border-neutral-950/14 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950 md:justify-self-end"
                        >
                          Close field -&gt;
                        </button>
                      </div>

                      <div className="relative mx-auto grid max-w-[1480px] gap-16 md:grid-cols-2 md:gap-x-24 lg:gap-x-32">
                        <div className="grid gap-16 md:gap-36 lg:gap-44">
                          {expandedFeaturedColumns.left.map((item, index) => (
                            <FeaturedFlowItem
                              key={item.slug}
                              item={item}
                              index={featuredCases.length + index * 2}
                              onOpenCase={openCase}
                              onRequestSystem={requestSystem}
                            />
                          ))}
                        </div>

                        <div className="grid gap-16 md:gap-36 md:pt-36 lg:gap-44 lg:pt-48">
                          {expandedFeaturedColumns.right.map((item, index) => (
                            <FeaturedFlowItem
                              key={item.slug}
                              item={item}
                              index={featuredCases.length + index * 2 + 1}
                              onOpenCase={openCase}
                              onRequestSystem={requestSystem}
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
          </section>

          <section id="evidence-capability" data-header-scene="evidence-capability" className="relative z-10 mx-auto grid w-[min(94vw,1720px)] gap-10 py-16 lg:py-24 xl:grid-cols-[0.34fr_0.66fr]">
            <SectionIntro label="Capability Layer" title="What the archive proves." />
            <div className="grid gap-0 border-y border-neutral-950/14 md:grid-cols-2 xl:grid-cols-3">
              {capabilityLayer.map((capability, index) => (
                <div key={capability.label} className="border-b border-neutral-950/10 p-6 md:border-r md:even:border-r-0 xl:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(even)]:border-r">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{String(index + 1).padStart(2, "0")}</div>
                  <div className="mt-5 text-[30px] leading-none tracking-[-0.04em] text-neutral-950">{capability.label}</div>
                  <p className="mt-5 max-w-[32rem] text-[14px] leading-7 text-neutral-600">{capability.summary}</p>
                </div>
              ))}
            </div>
          </section>

        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="evidence" />
      </PageSurface>
    </div>
  );
}
