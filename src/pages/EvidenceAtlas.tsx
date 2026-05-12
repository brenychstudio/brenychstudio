import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { cases } from "../data/cases";
import {
  evidenceFilters,
  fallbackEvidence,
  workEvidenceBySlug,
  type EvidenceCase,
  type EvidenceFilter,
} from "../data/workEvidence";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import { startSpaPageTransition } from "../ui/pageTransition";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
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
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-[10px] uppercase tracking-[0.14em] transition ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white"
          : "border-neutral-950/12 bg-white/52 text-neutral-500 hover:border-neutral-950/40 hover:text-neutral-950"
      }`}
    >
      <span>{filter}</span>
      <span className={active ? "text-white/52" : "text-neutral-300"}>{String(count).padStart(2, "0")}</span>
    </button>
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
}: PageProps) {
  const navigate = useNavigate();
  const evidenceCases = useMemo(() => getEvidenceCases(), []);
  const featuredCases = useMemo(
    () => evidenceCases.filter((item) => item.evidence.featuredEvidence).slice(0, 4),
    [evidenceCases]
  );
  const [activeSlug, setActiveSlug] = useState(featuredCases[0]?.slug ?? evidenceCases[0]?.slug ?? "");
  const [activeFilter, setActiveFilter] = useState<EvidenceFilter>("All");

  const filteredCases = useMemo(() => {
    if (activeFilter === "All") return evidenceCases;
    return evidenceCases.filter((item) => item.evidence.filters.includes(activeFilter));
  }, [activeFilter, evidenceCases]);

  const activeCase =
    filteredCases.find((item) => item.slug === activeSlug) ??
    evidenceCases.find((item) => item.slug === activeSlug) ??
    filteredCases[0] ??
    evidenceCases[0];

  const filterCount = (filter: EvidenceFilter) =>
    filter === "All" ? evidenceCases.length : evidenceCases.filter((item) => item.evidence.filters.includes(filter)).length;

  const chooseFilter = (filter: EvidenceFilter) => {
    setActiveFilter(filter);
    const firstMatch =
      filter === "All" ? evidenceCases[0] : evidenceCases.find((item) => item.evidence.filters.includes(filter));
    if (firstMatch) setActiveSlug(firstMatch.slug);
  };

  const openCase = (item: EvidenceCase) => {
    startSpaPageTransition(navigate, `/work/${item.slug}`, onCloseProject);
  };

  const thresholdStats = [
    { label: "cases", value: evidenceCases.length },
    { label: "premium websites", value: filterCount("Premium websites") },
    { label: "product systems", value: filterCount("Product systems") },
    { label: "multilingual surfaces", value: filterCount("Multilingual") },
    { label: "workflow tools", value: filterCount("Tools") },
    { label: "experimental systems", value: filterCount("Experimental") },
  ];

  const mediaTraces = featuredCases.slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <EvidenceAtlasMeta />
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="relative min-h-screen overflow-x-hidden bg-[#f3f1ec] text-neutral-950">
        <main className="relative pt-24">
          <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(10,10,10,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,10,0.07)_1px,transparent_1px)] [background-size:82px_82px]" />
          <div className="pointer-events-none fixed left-[10vw] top-[15vh] z-0 h-[34rem] w-[34rem] rounded-full border border-neutral-950/[0.05]" />
          <div className="pointer-events-none fixed right-[6vw] top-[44vh] z-0 h-[26rem] w-[26rem] rounded-full border border-neutral-950/[0.045]" />

          <section className="relative z-10 mx-auto min-h-[calc(100vh-6rem)] w-[min(94vw,1720px)] py-10 lg:py-12">
            <div className="grid min-h-[calc(100vh-10rem)] gap-10 border-y border-neutral-950/14 py-10 xl:grid-cols-[0.62fr_0.38fr] xl:items-center">
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

              <div className="relative">
                <div className="border-y border-neutral-950/14 py-5">
                  <div className="mb-5 flex items-center justify-between gap-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                      Evidence Atlas
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">Proof index</div>
                  </div>
                  <div className="grid border-t border-neutral-950/10">
                    {thresholdStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="grid grid-cols-[5.5rem_1fr] items-baseline gap-5 border-b border-neutral-950/10 py-4 last:border-b-0"
                      >
                        <div className="text-[46px] leading-none text-neutral-950">{String(stat.value).padStart(2, "0")}</div>
                        <div className="text-[12px] uppercase tracking-[0.16em] text-neutral-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-2">
                  {mediaTraces.map((item, index) => (
                    <button
                      key={item.slug}
                      type="button"
                      onMouseEnter={() => setActiveSlug(item.slug)}
                      onFocus={() => setActiveSlug(item.slug)}
                      onClick={() => openCase(item)}
                      className={`group relative h-24 overflow-hidden bg-neutral-950 text-left transition sm:h-32 ${
                        item.slug === activeCase.slug ? "opacity-100" : "opacity-[0.42] hover:opacity-[0.82]"
                      }`}
                      aria-label={`Open ${item.title}`}
                    >
                      <img
                        src={getPreviewFrame(item)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-black/22" />
                      <div className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="proof-reader" className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-20">
            <div className="border-y border-neutral-950/14 py-7">
              <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Proof Reader</div>
                  <h2 className="mt-5 max-w-[11ch] text-[54px] font-normal leading-[0.9] text-neutral-950 sm:text-[78px]">
                    Read the proof behind each case.
                  </h2>
                </div>
                <div>
                  <p className="max-w-[54rem] text-[15px] leading-7 text-neutral-600">
                    Move through the ledger, compare proof claims, and open the full case when the evidence needs a
                    deeper read.
                  </p>
                  <div className="mt-7">
                    <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Proof lens</div>
                    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
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

            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_31rem]">
              <motion.article
                key={activeCase.slug}
                className="overflow-hidden border-y border-neutral-950/14 bg-white/30 shadow-[0_34px_120px_rgba(0,0,0,0.065)] backdrop-blur-sm"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, ease }}
              >
                <div className="grid min-h-12 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/10 px-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                    Active evidence sheet
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                    {getCaseCode(activeCase, Math.max(0, evidenceCases.findIndex((item) => item.slug === activeCase.slug)))}
                  </div>
                </div>

                <div className="grid xl:grid-cols-[0.58fr_0.42fr]">
                  <button
                    type="button"
                    onClick={() => openCase(activeCase)}
                    className="group relative min-h-[340px] overflow-hidden border-b border-neutral-950/10 bg-white/20 text-left xl:min-h-[620px] xl:border-b-0 xl:border-r"
                    aria-label={`Open ${activeCase.title}`}
                  >
                    <motion.img
                      key={`${activeCase.slug}-sheet`}
                      src={getPreviewFrame(activeCase)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.025 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.66, ease }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(243,241,236,0.02),rgba(243,241,236,0.08)_48%,rgba(0,0,0,0.42))]" />
                    <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:74px_74px]" />
                    <div className="absolute bottom-0 left-0 right-0 border-t border-white/18 bg-neutral-950/38 px-5 py-4 text-white backdrop-blur-sm">
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/58">
                            Visual evidence
                          </div>
                          <div className="mt-2 text-[15px] leading-6 text-white/82">{activeCase.evidence.layers[0]}</div>
                        </div>
                        <span className="border-y border-white/24 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-white/72">
                          Open case -&gt;
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
                    <motion.div
                      key={`${activeCase.slug}-claim`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">{activeCase.evidence.workType}</div>
                        <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                          {String(filteredCases.length).padStart(2, "0")} in lens
                        </div>
                      </div>
                      <h3 className="mt-7 max-w-[12ch] text-[44px] font-normal leading-[0.94] text-neutral-950 sm:text-[62px]">
                        {activeCase.title}
                      </h3>
                      <div className="mt-7 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                        What this proves
                      </div>
                      <p className="mt-4 max-w-[36rem] text-[22px] leading-8 tracking-[-0.02em] text-neutral-900">
                        {activeCase.evidence.proofSummary}
                      </p>
                    </motion.div>

                    <div className="mt-8">
                      <div className="grid gap-0 border-y border-neutral-950/10">
                        {activeCase.evidence.proofPoints.map((point, index) => (
                          <div key={point} className="grid gap-4 border-b border-neutral-950/10 py-4 last:border-b-0 sm:grid-cols-[4rem_1fr]">
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

                      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
                        {activeCase.evidence.systemTags.map((tag) => (
                          <EvidenceTag key={tag}>{tag}</EvidenceTag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>

              <aside className="border-y border-neutral-950/14">
                <div className="flex min-h-12 items-center justify-between gap-4 border-b border-neutral-950/10 px-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Case ledger</div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                    {String(filteredCases.length).padStart(2, "0")} matches
                  </div>
                </div>
                <div>
                  {filteredCases.map((item) => {
                    const index = evidenceCases.findIndex((caseItem) => caseItem.slug === item.slug);
                    const active = item.slug === activeCase.slug;

                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onMouseEnter={() => setActiveSlug(item.slug)}
                        onFocus={() => setActiveSlug(item.slug)}
                        onClick={() => openCase(item)}
                        className={`grid w-full grid-cols-[3.25rem_1fr] gap-4 border-b border-neutral-950/10 px-4 py-5 text-left transition last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-inset ${
                          active ? "bg-white/58 text-neutral-950" : "text-neutral-500 hover:bg-white/34 hover:text-neutral-950"
                        }`}
                      >
                        <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${active ? "text-neutral-950" : "text-neutral-300"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block text-[26px] leading-none tracking-[-0.035em]">{item.title}</span>
                          <span className={`mt-4 block text-[11px] uppercase tracking-[0.14em] ${active ? "text-neutral-500" : "text-neutral-300"}`}>
                            {item.evidence.proofLabel}
                          </span>
                          <span className={`mt-2 block text-[12px] leading-6 ${active ? "text-neutral-600" : "text-neutral-400"}`}>
                            {item.evidence.workType}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          </section>

          <section className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(260px,400px)_minmax(0,1fr)]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Featured Evidence</div>
                <h2 className="mt-5 max-w-[9ch] text-[54px] font-normal leading-[0.9] text-neutral-950 sm:text-[78px]">
                  Commercial proof surfaces.
                </h2>
                <p className="mt-7 max-w-[28rem] text-[15px] leading-7 text-neutral-600">
                  Each dossier pairs the visual result with the proof claim and the system layers behind it.
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

          <section className="relative z-10 mx-auto grid w-[min(94vw,1720px)] gap-10 py-16 lg:py-20 xl:grid-cols-[0.34fr_0.66fr]">
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

          <section id="compact-archive" className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-20">
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

          <section className="relative z-10 mx-auto grid min-h-[62vh] w-[min(94vw,1720px)] items-center gap-12 py-16 lg:py-20 xl:grid-cols-[0.64fr_0.36fr]">
            <h2 className="max-w-[13ch] text-[54px] font-normal leading-[0.9] text-neutral-950 sm:text-[88px] xl:text-[116px]">
              Need a website, product surface, or interface system with this level of clarity?
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenProject}
                className="inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Start a project -&gt;
              </button>
              <button
                type="button"
                onClick={() => startSpaPageTransition(navigate, "/offer", onCloseProject)}
                className="inline-flex min-h-10 items-center rounded-full border border-neutral-300 bg-white/60 px-5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              >
                View offer -&gt;
              </button>
            </div>
          </section>
        </main>
      </PageSurface>
    </div>
  );
}
