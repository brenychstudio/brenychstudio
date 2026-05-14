import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

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
];

const evidenceRailItems: SectionRailItem[] = [
  { index: "01", label: "Threshold", id: "evidence-threshold" },
  { index: "02", label: "Reader", id: "proof-reader" },
  { index: "03", label: "Dossiers", id: "evidence-featured" },
  { index: "04", label: "Capability", id: "evidence-capability" },
  { index: "05", label: "Index", id: "compact-archive" },
];

function EvidenceAtlasMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Evidence Atlas - Rostyslav Brenych";

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

function getPreviewFrame(item: EvidenceCase) {
  return item.content?.hero?.poster ?? item.content?.hero?.src ?? item.poster.src;
}

function getVisualFrames(item: EvidenceCase) {
  const frames = item.content?.frames?.filter((frame) => frame.kind !== "video").map((frame) => frame.src) ?? [];
  return [getPreviewFrame(item), ...frames].filter(Boolean).slice(0, 3);
}

function getCaseCode(item: EvidenceCase, index: number) {
  return item.code || `EV-${String(index + 1).padStart(2, "0")}`;
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
    label: "editorial proof",
    wash: "rgba(190, 186, 176, 0.14)",
    glow: "rgba(210, 208, 198, 0.18)",
    accent: "rgba(86, 82, 74, 0.28)",
    shadow: "rgba(48, 45, 39, 0.12)",
  };
}

function EvidenceTag({ children }: { children: string }) {
  return (
    <span className="inline-flex min-h-8 shrink-0 items-center rounded-full border border-neutral-950/12 bg-white/58 px-3 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
      {children}
    </span>
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
      {active && (
        <motion.span
          layoutId="proof-filter-active"
          className="absolute inset-0 bg-neutral-950"
          transition={{ duration: 0.38, ease }}
        />
      )}

      <span
        className={`pointer-events-none absolute inset-x-0 top-0 h-px transition ${
          active ? "bg-white/26" : "bg-neutral-950/0 group-hover:bg-neutral-950/14"
        }`}
      />

      <span className="relative flex min-w-0 items-center gap-2.5">
        <span
          className={`relative h-1.5 w-1.5 shrink-0 rounded-full ${
            active ? "bg-white" : "bg-neutral-950/18 group-hover:bg-neutral-950/42"
          }`}
        >
          {active && <span className="absolute inset-0 animate-ping rounded-full bg-white/38" />}
        </span>

        <span className="truncate">{filter}</span>
      </span>

      <span
        className={`relative border-l pl-3 tabular-nums transition ${
          active ? "border-white/18 text-white/56" : "border-neutral-950/10 text-neutral-300 group-hover:text-neutral-500"
        }`}
      >
        {String(count).padStart(2, "0")}
      </span>
    </motion.button>
  );
}

function DossierRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-3 border-t border-neutral-950/10 py-4 sm:grid-cols-[9rem_1fr]">
      <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">{label}</div>
      <div className="text-[14px] leading-6 text-neutral-700">{value}</div>
    </div>
  );
}

export default function EvidenceAtlas({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const navigate = useNavigate();
  const evidenceCases = useMemo(() => getEvidenceCases(), []);
  const featuredCases = useMemo(
    () => evidenceCases.filter((item) => item.evidence.featuredEvidence).slice(0, 4),
    [evidenceCases]
  );
  const [activeSlug, setActiveSlug] = useState(featuredCases[0]?.slug ?? evidenceCases[0]?.slug ?? "");
  const [activeFilter, setActiveFilter] = useState<EvidenceFilter>("All");
  const [inspectOpen, setInspectOpen] = useState(false);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [proofSignalText, setProofSignalText] = useState("");
  const activeSectionId = useSectionRailActive(evidenceRailItems);

  const filteredCases = useMemo(() => {
    if (activeFilter === "All") return evidenceCases;
    return evidenceCases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, evidenceCases]);

  const activeCase =
    filteredCases.find((item) => item.slug === activeSlug) ??
    evidenceCases.find((item) => item.slug === activeSlug) ??
    filteredCases[0] ??
    evidenceCases[0];
  const activeCaseIndex = Math.max(0, evidenceCases.findIndex((item) => item.slug === activeCase.slug));
  const activeVisuals = getVisualFrames(activeCase);
  const activeFrame = activeVisuals[activeFrameIndex] ?? getPreviewFrame(activeCase);
  const atmosphere = getEvidenceAtmosphere(activeCase);
  const surfaceStyle = {
    "--evidence-wash": atmosphere.wash,
    "--evidence-glow": atmosphere.glow,
    "--evidence-accent": atmosphere.accent,
    "--evidence-shadow": atmosphere.shadow,
  } as CSSProperties;

  const filterCount = (filter: EvidenceFilter) =>
    filter === "All" ? evidenceCases.length : evidenceCases.filter((item) => item.evidence.filters.includes(filter)).length;

  const chooseFilter = (filter: EvidenceFilter) => {
    setActiveFilter(filter);
    const firstMatch =
      filter === "All" ? evidenceCases[0] : evidenceCases.find((item) => item.evidence.filters.includes(filter));
    if (firstMatch) {
      setActiveSlug(firstMatch.slug);
      setActiveFrameIndex(0);
    }
  };

  const openCase = (item: EvidenceCase) => {
    startSpaPageTransition(navigate, `/work/${item.slug}`, onCloseProject);
  };

  const selectCase = (slug: string) => {
    setActiveSlug(slug);
    setActiveFrameIndex(0);
  };

  useEffect(() => {
    if (!inspectOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInspectOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [inspectOpen]);

  useEffect(() => {
    const fullText = activeCase.evidence.proofSummary;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let interval: number | undefined;

    const startTimer = window.setTimeout(() => {
      if (prefersReducedMotion) {
        setProofSignalText(fullText);
        return;
      }

      setProofSignalText("");
      let index = 0;
      interval = window.setInterval(() => {
        index += 2;
        setProofSignalText(fullText.slice(0, index));
        if (index >= fullText.length && interval !== undefined) window.clearInterval(interval);
      }, 18);
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [activeCase.evidence.proofSummary]);

  const mediaTraces = featuredCases.slice(0, 4);
  const heroMetrics = [
    { label: "verified cases", value: evidenceCases.length },
    { label: "premium websites", value: filterCount("Premium websites") },
    { label: "product systems", value: filterCount("Product systems") },
    { label: "multilingual surfaces", value: filterCount("Multilingual") },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      {noIndex ? <EvidenceAtlasMeta /> : null}
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="evidence" />
        <SectionRail
          items={evidenceRailItems}
          activeId={activeSectionId}
          onSelect={scrollToRailSection}
          label="Evidence Atlas sections"
        />
        <main className="relative pt-24" style={surfaceStyle}>
          <section id="evidence-threshold" data-header-scene="evidence-threshold" className="relative z-10 mx-auto min-h-[calc(100vh-6rem)] w-[min(94vw,1720px)] py-10 lg:py-12">
            <div className="grid min-h-[calc(100vh-10rem)] gap-10 border-y border-neutral-950/14 py-10 xl:grid-cols-[0.58fr_0.42fr] xl:items-center">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  Work Archive / Evidence Atlas
                </div>
                <h1 className="mt-6 max-w-[8.5ch] text-[52px] font-normal leading-[0.9] text-neutral-950 sm:max-w-[12ch] sm:text-[96px] xl:text-[132px]">
                  Selected work, structured as proof.
                </h1>
                <p className="mt-8 max-w-[21rem] break-words text-[17px] leading-8 text-neutral-600 sm:max-w-[44rem]">
                  A curated archive of premium websites, product systems, tools, multilingual surfaces, and interface
                  environments, organized by what each project proves.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="#proof-reader"
                    className="inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                  >
                    Open proof reader -&gt;
                  </a>
                  <a
                    href="#compact-archive"
                    className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/60 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    View archive -&gt;
                  </a>
                  <button
                    type="button"
                    onClick={onOpenProject}
                    className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/60 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    Start a project -&gt;
                  </button>
                </div>
              </div>

              <div className="relative xl:pl-8">
                <div className="pointer-events-none absolute -left-8 top-9 hidden h-44 w-44 border-l border-t border-neutral-950/10 xl:block" />
                <div className="relative overflow-hidden border border-neutral-950/14 bg-[#f8f6f0]/78 shadow-[0_38px_140px_var(--evidence-shadow)] backdrop-blur-sm">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,var(--evidence-glow),transparent_42%),linear-gradient(135deg,var(--evidence-wash),transparent_52%)]" />
                  <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:58px_58px]" />

                  <div className="relative grid min-h-12 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/12 px-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Evidence instrument</div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                      {getCaseCode(activeCase, activeCaseIndex)}
                    </div>
                  </div>

                  <div className="relative grid border-b border-neutral-950/12 sm:grid-cols-[0.44fr_0.56fr]">
                    <div className="grid grid-cols-2 border-b border-neutral-950/12 sm:border-b-0 sm:border-r">
                      {heroMetrics.map((metric) => (
                        <div key={metric.label} className="min-h-[7.25rem] border-b border-r border-neutral-950/10 p-4 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                          <div className="text-[42px] leading-none tracking-[-0.04em] text-neutral-950">
                            {String(metric.value).padStart(2, "0")}
                          </div>
                          <div className="mt-3 max-w-[7rem] font-mono text-[9px] uppercase leading-4 tracking-[0.16em] text-neutral-400">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectOpen(true)}
                      className="group relative min-h-[18rem] overflow-hidden p-5 text-left sm:min-h-[20rem]"
                      aria-label={`Inspect proof signal for ${activeCase.title}`}
                    >
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={`hero-signal-fill-${activeCase.slug}`}
                          src={activeFrame}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full scale-[1.05] object-cover object-center opacity-[0.13] saturate-[0.72]"
                          initial={{ opacity: 0, scale: 1.09, filter: "blur(16px)" }}
                          animate={{ opacity: 0.13, scale: 1.05, filter: "blur(9px)" }}
                          exit={{ opacity: 0, scale: 1.07, filter: "blur(14px)" }}
                          transition={{ duration: 0.78, ease }}
                        />
                      </AnimatePresence>
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,240,0.38),rgba(248,246,240,0.88)_82%)]" />
                      <motion.div
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-neutral-950/22"
                        animate={{ y: [0, 268, 0] }}
                        transition={{ duration: 7.2, ease: "linear", repeat: Infinity }}
                      />

                      <div className="relative flex h-full min-h-[16rem] flex-col justify-between">
                        <div className="flex items-start justify-between gap-5">
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                            Live proof signal / {atmosphere.label}
                          </div>
                          <span className="h-2 w-2 rounded-full bg-neutral-950 shadow-[0_0_0_5px_rgba(10,10,10,0.06)]" />
                        </div>

                        <div className="pt-12">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`hero-signal-copy-${activeCase.slug}`}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.48, ease }}
                            >
                              <div className="text-[42px] leading-[0.92] tracking-[-0.045em] text-neutral-950 sm:text-[50px]">
                                {activeCase.title}
                              </div>
                              <div className="mt-4 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                                {activeCase.evidence.proofLabel}
                              </div>
                              <p className="mt-5 max-w-[24rem] text-[14px] leading-6 text-neutral-600">
                                {activeCase.evidence.proofSummary}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        <div className="mt-8 flex items-end justify-between gap-4 border-t border-neutral-950/12 pt-4">
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                            01 active proof
                          </div>
                          <span className="whitespace-nowrap border-y border-neutral-950/20 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-600 transition group-hover:border-neutral-950/50 group-hover:text-neutral-950">
                            Inspect -&gt;
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="relative p-3">
                    <div className="mb-3 flex items-center justify-between gap-4 px-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Material traces</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                        {String(mediaTraces.length).padStart(2, "0")} featured
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {mediaTraces.map((item, index) => {
                        const active = item.slug === activeCase.slug;

                        return (
                          <button
                            key={item.slug}
                            type="button"
                            onMouseEnter={() => selectCase(item.slug)}
                            onFocus={() => selectCase(item.slug)}
                            onClick={() => selectCase(item.slug)}
                            className={`group relative h-24 overflow-hidden border bg-[#f8f6f0] text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:h-28 ${
                              active ? "border-neutral-950" : "border-neutral-950/10 hover:border-neutral-950/40"
                            }`}
                            aria-label={`Select proof signal ${item.title}`}
                          >
                            <img
                              src={getPreviewFrame(item)}
                              alt=""
                              className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] ${
                                active ? "opacity-90" : "opacity-[0.38]"
                              }`}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,240,0.08),rgba(10,10,10,0.2))]" />
                            <div className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/76">
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <div className={`absolute right-2 top-2 h-2 w-2 rounded-full border ${active ? "border-white bg-white" : "border-white/45 bg-white/10"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="proof-reader" data-header-scene="evidence-reader" className="relative z-10 mx-auto w-[min(94vw,1720px)] pb-16 pt-28 lg:pb-20 lg:pt-32">
            <div className="border-y border-neutral-950/14 py-8">
              <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    Active Case Evidence Panel
                  </div>
                  <h2 className="mt-5 max-w-[9ch] text-[54px] font-normal leading-[0.9] text-neutral-950 sm:text-[82px]">
                    Proof reader.
                  </h2>
                </div>

                <div>
                  <p className="max-w-[54rem] text-[15px] leading-7 text-neutral-600">
                    Move through the ledger, compare proof claims, and open the full case when the evidence needs a deeper read.
                  </p>

                  <div className="mt-7 overflow-hidden border-y border-neutral-950/10 bg-white/22 backdrop-blur-sm">
                    <div className="grid min-h-10 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/10 px-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                        Proof lens / live signal
                      </div>

                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                        {String(filteredCases.length).padStart(2, "0")} visible
                      </div>
                    </div>

                    <div className="relative p-2">
                      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px)] [background-size:42px_42px]" />

                      <div className="relative grid grid-flow-col auto-cols-[minmax(9.5rem,auto)] gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid-flow-row sm:grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] sm:pb-0 [&::-webkit-scrollbar]:hidden">
                        {evidenceFilters.map((filter) => (
                          <FilterButton
                            key={filter}
                            filter={filter}
                            active={filter === activeFilter}
                            count={filterCount(filter)}
                            onClick={() => chooseFilter(filter)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-9 overflow-hidden border-y border-neutral-950/14 bg-[#f8f6f0]/74 shadow-[0_44px_150px_var(--evidence-shadow)] backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_26%,var(--evidence-glow),transparent_40%),linear-gradient(125deg,var(--evidence-wash),transparent_48%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:78px_78px]" />

              <div className="relative grid min-h-12 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/10 px-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                  Active evidence sheet / {atmosphere.label}
                </div>

                <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                  {getCaseCode(activeCase, activeCaseIndex)} / {String(activeCaseIndex + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="relative grid xl:grid-cols-[minmax(0,1fr)_24rem]">
                <button
                  type="button"
                  onClick={() => setInspectOpen(true)}
                  className="group relative h-[620px] overflow-hidden border-b border-neutral-950/10 bg-[#eeeae1] text-left sm:h-[660px] lg:h-[690px] xl:h-[720px] xl:border-b-0 xl:border-r"
                  aria-label={`Inspect proof for ${activeCase.title}`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8f6f0,var(--evidence-wash))]" />

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`field-fill-${activeCase.slug}-${activeFrameIndex}`}
                      src={activeFrame}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center opacity-[0.13] saturate-[0.88]"
                      initial={{ opacity: 0, scale: 1.12, filter: "blur(18px)" }}
                      animate={{ opacity: 0.13, scale: 1.08, filter: "blur(11px)" }}
                      exit={{ opacity: 0, scale: 1.09, filter: "blur(16px)" }}
                      transition={{ duration: 0.72, ease }}
                    />
                  </AnimatePresence>

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(248,246,240,0.38),transparent_14%,transparent_86%,rgba(248,246,240,0.34)),radial-gradient(circle_at_50%_42%,transparent_0,transparent_66%,rgba(10,10,10,0.06)_100%)]" />

                  <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between gap-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                      Visual evidence / active frame
                    </div>

                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                      F{String(activeFrameIndex + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`field-${activeCase.slug}-${activeFrameIndex}`}
                      src={activeFrame}
                      alt=""
                      className="absolute inset-x-[5%] top-[10%] h-[68%] w-[90%] object-contain object-center drop-shadow-[0_32px_85px_rgba(18,18,18,0.16)]"
                      initial={{ opacity: 0, x: 28, scale: 1.018, filter: "blur(10px)" }}
                      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -22, scale: 1.01, filter: "blur(8px)" }}
                      transition={{ duration: 0.72, ease }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-x-4 bottom-4 overflow-hidden border border-white/18 bg-neutral-950/70 px-4 py-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-md sm:inset-x-6 sm:px-5">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.1),transparent_36%,rgba(255,255,255,0.035))]" />

                    <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/58">
                          What this proves
                        </div>

                        <p className="mt-2 min-h-[3.4rem] max-w-[56rem] text-[16px] leading-7 text-white/88 sm:text-[17px]">
                          {proofSignalText}
                          <span className="ml-1 inline-block h-4 w-[1px] translate-y-0.5 animate-pulse bg-white/72" />
                        </p>
                      </div>

                      <span className="whitespace-nowrap justify-self-start border-y border-white/24 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-white/64 transition group-hover:border-white/44 group-hover:text-white lg:justify-self-end">
                        Inspect proof -&gt;
                      </span>
                    </div>
                  </div>
                </button>

                <aside className="relative h-auto overflow-hidden border-l border-neutral-950/10 bg-white/32 p-5 backdrop-blur-md sm:p-7 xl:h-[720px]">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.66),rgba(255,255,255,0.22)_44%,transparent)]" />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                        Signal readout
                      </div>

                      <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                        {String(filteredCases.length).padStart(2, "0")} in lens
                      </div>
                    </div>

                    <div className="mt-7 border-y border-neutral-950/10 py-5">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                        {activeCase.evidence.proofLabel}
                      </div>

                      <p className="mt-4 text-[28px] leading-[1.12] tracking-[-0.04em] text-neutral-950">
                        {activeCase.evidence.capability}
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                        Evidence points
                      </div>

                      <div className="grid gap-0 border-y border-neutral-950/10">
                        {activeCase.evidence.proofPoints.map((point, index) => (
                          <div
                            key={point}
                            className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-neutral-950/10 py-3.5 last:border-b-0"
                          >
                            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <p className="text-[13px] leading-5 text-neutral-700">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                          Frame signal
                        </div>

                        <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                          F{String(activeFrameIndex + 1).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {activeVisuals.slice(0, 3).map((_, index) => {
                          const frameActive = index === activeFrameIndex;

                          return (
                            <button
                              key={`${activeCase.slug}-signal-${index}`}
                              type="button"
                              onClick={() => setActiveFrameIndex(index)}
                              className={`h-2.5 flex-1 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
                                frameActive ? "bg-neutral-950" : "bg-neutral-950/12 hover:bg-neutral-950/28"
                              }`}
                              aria-label={`Show frame ${index + 1} for ${activeCase.title}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6">
                      <DossierRow label="System layers" value={activeCase.evidence.layers.join(" / ")} />
                    </div>

                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {activeCase.evidence.systemTags.slice(0, 4).map((tag) => (
                        <EvidenceTag key={tag}>{tag}</EvidenceTag>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-3 pt-7">
                      <button
                        type="button"
                        onClick={() => setInspectOpen(true)}
                        className="inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                      >
                        Inspect proof -&gt;
                      </button>

                      <button
                        type="button"
                        onClick={() => openCase(activeCase)}
                        className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/58 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        Open full case -&gt;
                      </button>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="relative border-t border-neutral-950/10 bg-[#fbfaf6]/74 p-3">
                <div className="mb-4 flex items-center justify-between gap-5 px-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                    Evidence rail
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                    Hover / focus to read, inspect for detail
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {filteredCases.map((item) => {
                    const index = evidenceCases.findIndex((caseItem) => caseItem.slug === item.slug);
                    const active = item.slug === activeCase.slug;

                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onMouseEnter={() => selectCase(item.slug)}
                        onFocus={() => selectCase(item.slug)}
                        onClick={() => selectCase(item.slug)}
                        className={`group grid w-[17rem] shrink-0 grid-cols-[6rem_1fr] overflow-hidden border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
                          active
                            ? "border-neutral-950 bg-[#f8f6f0] text-neutral-950 shadow-[0_18px_44px_var(--evidence-shadow)]"
                            : "border-neutral-950/10 bg-white/36 text-neutral-500 hover:border-neutral-950/30 hover:bg-white/72 hover:text-neutral-950"
                        }`}
                        aria-label={`Select ${item.title}`}
                      >
                        <span className="relative min-h-[6rem] overflow-hidden bg-neutral-950">
                          <img
                            src={getPreviewFrame(item)}
                            alt=""
                            className={`absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04] ${
                              active ? "opacity-95 saturate-[1.02] contrast-[1.03]" : "opacity-50 saturate-[0.82]"
                            }`}
                          />

                          <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/72">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </span>

                        <span className="p-3">
                          <span className="block text-[18px] leading-none tracking-[-0.03em]">{item.title}</span>

                          <span
                            className={`mt-3 block text-[10px] uppercase tracking-[0.14em] ${
                              active ? "text-neutral-500" : "text-neutral-300"
                            }`}
                          >
                            {item.evidence.proofLabel}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <AnimatePresence>
            {inspectOpen && (
              <motion.div
                className="fixed inset-0 z-[80] flex items-center justify-center bg-[#f3f1ec]/88 px-4 py-5 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-label={`Inspect proof for ${activeCase.title}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease }}
              >
                <button
                  type="button"
                  aria-label="Close proof inspect"
                  className="absolute inset-0 cursor-default"
                  onClick={() => setInspectOpen(false)}
                />
                <motion.div
                  className="relative grid max-h-[92svh] w-[min(92rem,calc(100vw-2rem))] overflow-y-auto border border-neutral-950/14 bg-[#f8f6f0] shadow-[0_44px_180px_rgba(0,0,0,0.18)] lg:grid-cols-[minmax(0,1fr)_25rem]"
                  initial={{ opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.99 }}
                  transition={{ duration: 0.56, ease }}
                >
                  <div className="relative min-h-[420px] overflow-hidden bg-neutral-950 lg:min-h-[720px]">
                    <img src={activeFrame} alt="" className="absolute inset-0 h-full w-full object-contain object-center" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.16)_54%,rgba(0,0,0,0.62))]" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/58">
                        Inspect shell / {getCaseCode(activeCase, activeCaseIndex)}
                      </div>
                      <div className="mt-4 max-w-[12ch] text-[48px] leading-[0.92] tracking-[-0.055em] sm:text-[76px]">
                        {activeCase.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                          {activeCase.evidence.workType}
                        </div>
                        <div className="mt-4 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                          {activeCase.evidence.proofLabel}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInspectOpen(false)}
                        className="rounded-full border border-neutral-950/12 bg-white/58 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-950/30 hover:text-neutral-950"
                      >
                        Close
                      </button>
                    </div>

                    <p className="mt-8 text-[26px] leading-9 tracking-[-0.03em] text-neutral-950">
                      {activeCase.evidence.proofSummary}
                    </p>

                    <div className="mt-8 grid gap-0 border-y border-neutral-950/10">
                      {activeCase.evidence.proofPoints.map((point, index) => (
                        <div key={point} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-neutral-950/10 py-4 last:border-b-0">
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <p className="text-[14px] leading-6 text-neutral-700">{point}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <DossierRow label="Capability" value={activeCase.evidence.capability} />
                      <DossierRow label="System layers" value={activeCase.evidence.layers.join(" / ")} />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {activeCase.evidence.systemTags.map((tag) => (
                        <EvidenceTag key={tag}>{tag}</EvidenceTag>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openCase(activeCase)}
                      className="mt-8 inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                    >
                      Open full case -&gt;
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <section id="evidence-featured" data-header-scene="evidence-featured" className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(260px,400px)_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Featured Evidence</div>
                <h2 className="mt-5 max-w-[9ch] text-[54px] font-normal leading-[0.9] text-neutral-950 sm:text-[78px]">
                  Featured proof dossiers.
                </h2>
                <p className="mt-7 max-w-[28rem] text-[15px] leading-7 text-neutral-600">
                  A smaller set of evidence surfaces for the cases that best show the commercial and system-level range.
                </p>
              </div>

              <div className="grid gap-8">
                {featuredCases.map((item, index) => {
                  const visuals = getVisualFrames(item);

                  return (
                    <motion.article
                      key={item.slug}
                      className="group grid overflow-hidden border-y border-neutral-950/14 bg-white/26 backdrop-blur-sm xl:grid-cols-[3fr_2fr]"
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.24 }}
                      transition={{ duration: 0.66, delay: index * 0.04, ease }}
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setActiveSlug(item.slug)}
                        onFocus={() => setActiveSlug(item.slug)}
                        onClick={() => openCase(item)}
                        className="grid min-h-[460px] grid-rows-[1fr_7rem] gap-2 bg-neutral-950 p-2 text-left"
                      >
                        <div className="relative overflow-hidden">
                          <img src={visuals[0]} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/54 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/66">
                            {getCaseCode(item, index)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {visuals.slice(1, 3).map((visual) => (
                            <div key={visual} className="relative overflow-hidden bg-white/8">
                              <img src={visual} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.88] transition duration-700 group-hover:scale-[1.04]" />
                            </div>
                          ))}
                        </div>
                      </button>

                      <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between gap-5">
                          <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">{item.evidence.workType}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">0{index + 1}</div>
                        </div>
                        <h3 className="mt-8 max-w-[13ch] text-[44px] font-normal leading-[0.94] text-neutral-950 sm:text-[62px]">
                          {item.title}
                        </h3>
                        <div className="mt-7 text-[11px] uppercase tracking-[0.14em] text-neutral-500">{item.evidence.proofLabel}</div>
                        <p className="mt-4 max-w-[40rem] text-[14px] leading-7 text-neutral-600">{item.evidence.proofSummary}</p>

                        <div className="mt-7">
                          <DossierRow label="Proves" value={item.evidence.proofPoints[0]} />
                          <DossierRow label="Capability" value={item.evidence.capability} />
                          <DossierRow label="System layers" value={item.evidence.layers.join(" / ")} />
                        </div>

                        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
                          {item.evidence.systemTags.slice(0, 4).map((tag) => (
                            <EvidenceTag key={tag}>{tag}</EvidenceTag>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => openCase(item)}
                          className="mt-8 border-y border-neutral-950/18 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950"
                        >
                          Open case -&gt;
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="evidence-capability" data-header-scene="evidence-capability" className="relative z-10 mx-auto grid w-[min(94vw,1720px)] gap-10 py-16 lg:py-20 xl:grid-cols-[0.34fr_0.66fr]">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Capability Layer</div>
              <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.9] text-neutral-950 sm:text-[76px]">
                What the archive proves.
              </h2>
            </div>
            <div className="grid gap-0 border-y border-neutral-950/14 md:grid-cols-2">
              {capabilityLayer.map((capability, index) => (
                <div key={capability.label} className="border-b border-neutral-950/10 p-6 md:border-r md:even:border-r-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">0{index + 1}</div>
                  <div className="mt-5 text-[32px] leading-none text-neutral-950">{capability.label}</div>
                  <p className="mt-5 max-w-[32rem] text-[14px] leading-7 text-neutral-600">{capability.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="compact-archive" data-header-scene="evidence-index" className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-20">
            <div className="mb-9 grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Compact Archive</div>
                <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.9] text-neutral-950 sm:text-[76px]">
                  Fast proof index.
                </h2>
              </div>
              <div className="self-end text-[15px] leading-7 text-neutral-600">
                A dense scan layer for people who already understand the direction and want to compare cases quickly.
              </div>
            </div>

            <div className="border-y border-neutral-950/14">
              {evidenceCases.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  onMouseEnter={() => setActiveSlug(item.slug)}
                  onFocus={() => setActiveSlug(item.slug)}
                  onClick={() => openCase(item)}
                  className="grid w-full gap-4 border-b border-neutral-950/10 py-5 text-left transition last:border-b-0 hover:bg-white/42 md:grid-cols-[4rem_0.24fr_0.2fr_1fr_7rem]"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[22px] leading-none text-neutral-950">{item.title}</span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">{item.evidence.workType}</span>
                  <span className="text-[13px] leading-6 text-neutral-600">{item.evidence.proofLabel}</span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">Open -&gt;</span>
                </button>
              ))}
            </div>
          </section>

        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="evidence" />
      </PageSurface>
    </div>
  );
}
