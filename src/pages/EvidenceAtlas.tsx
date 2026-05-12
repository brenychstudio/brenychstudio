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
  const activeIndex = Math.max(0, evidenceCases.findIndex((item) => item.slug === activeCase.slug));
  const heroLedgerCases = filteredCases.slice(0, 5);

  const filterCount = (filter: EvidenceFilter) =>
    filter === "All" ? evidenceCases.length : evidenceCases.filter((item) => item.evidence.filters.includes(filter)).length;

  const chooseFilter = (filter: EvidenceFilter) => {
    setActiveFilter(filter);
    if (filter === "All") return;

    const firstMatch = evidenceCases.find((item) => item.evidence.filters.includes(filter));
    if (firstMatch) setActiveSlug(firstMatch.slug);
  };

  const openCase = (item: EvidenceCase) => {
    startSpaPageTransition(navigate, `/work/${item.slug}`, onCloseProject);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <EvidenceAtlasMeta />
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="relative min-h-screen overflow-x-hidden bg-[#f3f1ec] text-neutral-950">
        <main className="relative pt-24">
          <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(10,10,10,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,10,0.07)_1px,transparent_1px)] [background-size:82px_82px]" />
          <div className="pointer-events-none fixed left-[10vw] top-[15vh] z-0 h-[34rem] w-[34rem] rounded-full border border-neutral-950/[0.05]" />
          <div className="pointer-events-none fixed right-[6vw] top-[44vh] z-0 h-[26rem] w-[26rem] rounded-full border border-neutral-950/[0.045]" />

          <section className="relative z-10 mx-auto w-[min(94vw,1720px)] py-10 lg:py-12">
            <div className="grid gap-8 border-y border-neutral-950/14 py-8 xl:grid-cols-[0.3fr_0.7fr] xl:items-start">
              <div className="flex flex-col gap-10 xl:pt-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Work Archive / Evidence Atlas</div>
                  <h1 className="mt-5 max-w-[9ch] text-[62px] font-normal leading-[0.88] text-neutral-950 sm:text-[88px] xl:text-[104px]">
                    Evidence Atlas.
                  </h1>
                  <p className="mt-7 max-w-[12ch] text-[36px] font-normal leading-[0.94] text-neutral-950 sm:text-[48px] xl:text-[54px]">
                    Selected work, structured as proof.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1fr] xl:grid-cols-1">
                  <div className="border-l border-neutral-950/14 pl-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Archive thesis</div>
                    <p className="mt-4 max-w-[29rem] break-words text-[15px] leading-7 text-neutral-600">
                      Each case is presented by proof claim, capability, system layers, and a path into the full case.
                    </p>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Proof lens</div>
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
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

              <div className="overflow-hidden border border-neutral-950/12 bg-white/36 shadow-[0_44px_150px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                <div className="grid min-h-12 grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-950/10 px-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                    Active evidence / {String(activeIndex + 1).padStart(2, "0")}
                  </div>
                  <div className="hidden text-[10px] uppercase tracking-[0.16em] text-neutral-400 sm:block">
                    {activeCase.evidence.workType}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">{getCaseCode(activeCase, activeIndex)}</div>
                </div>

                <div className="grid lg:grid-cols-[56%_44%]">
                  <button
                    type="button"
                    onClick={() => openCase(activeCase)}
                    className="group relative min-h-[340px] overflow-hidden bg-neutral-950 text-left sm:min-h-[420px] xl:min-h-[460px]"
                  >
                    <motion.img
                      key={activeCase.slug}
                      src={getPreviewFrame(activeCase)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                      initial={{ opacity: 0, scale: 1.035 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.72, ease }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_42%,rgba(0,0,0,0.58))]" />
                    <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px]" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-6 text-white">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/58">Visual proof</div>
                        <div className="mt-2 text-[13px] leading-6 text-white/72">{activeCase.evidence.layers[0]}</div>
                      </div>
                      <span className="hidden border-y border-white/24 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-white/70 sm:inline-flex">
                        Open case -&gt;
                      </span>
                    </div>
                  </button>

                  <div className="flex flex-col justify-between p-5 sm:p-7 xl:p-7">
                    <div>
                      <div className="flex items-start justify-between gap-6">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">{activeCase.evidence.workType}</div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                          {String(filteredCases.length).padStart(2, "0")} cases
                        </div>
                      </div>
                      <h2 className="mt-7 max-w-[12ch] text-[42px] font-normal leading-[0.94] text-neutral-950 sm:text-[56px] xl:text-[60px]">
                        {activeCase.title}
                      </h2>
                      <div className="mt-6 text-[11px] uppercase tracking-[0.14em] text-neutral-500">{activeCase.evidence.proofLabel}</div>
                      <p className="mt-4 max-w-[36rem] break-words text-[14px] leading-7 text-neutral-600">{activeCase.evidence.proofSummary}</p>
                    </div>

                    <div className="mt-8">
                      <DossierRow label="Capability" value={activeCase.evidence.capability} />
                      <DossierRow label="Layers" value={activeCase.evidence.layers.join(" / ")} />
                      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
                        {activeCase.evidence.systemTags.map((tag) => (
                          <EvidenceTag key={tag}>{tag}</EvidenceTag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-950/10">
                  <div className="grid lg:grid-cols-[9rem_1fr]">
                    <div className="border-b border-neutral-950/10 px-4 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 lg:border-b-0 lg:border-r">
                      Proof ledger
                    </div>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-4">
                      {heroLedgerCases.slice(0, 4).map((item) => {
                        const index = evidenceCases.findIndex((caseItem) => caseItem.slug === item.slug);
                        const active = item.slug === activeCase.slug;

                        return (
                          <button
                            key={item.slug}
                            type="button"
                            onMouseEnter={() => setActiveSlug(item.slug)}
                            onFocus={() => setActiveSlug(item.slug)}
                            onClick={() => openCase(item)}
                            className={`border-b border-neutral-950/10 px-4 py-4 text-left transition sm:border-r xl:border-b-0 xl:last:border-r-0 ${
                              active ? "bg-white/64 text-neutral-950" : "text-neutral-500 hover:bg-white/40 hover:text-neutral-950"
                            }`}
                          >
                            <div className={`font-mono text-[10px] uppercase tracking-[0.16em] ${active ? "text-neutral-950" : "text-neutral-300"}`}>
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <div className="mt-3 text-[18px] leading-none">{item.title}</div>
                            <div className="mt-3 text-[10px] uppercase tracking-[0.14em] text-neutral-400">{item.evidence.proofLabel}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
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

          <section id="proof-reader" className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-20">
            <div className="mb-8 grid gap-8 border-y border-neutral-950/14 py-7 lg:grid-cols-[0.35fr_0.65fr] lg:items-end">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Active Case Evidence Panel</div>
                <h2 className="mt-5 max-w-[10ch] text-[54px] font-normal leading-[0.9] text-neutral-950 sm:text-[78px]">
                  Proof reader.
                </h2>
              </div>
              <div>
                <p className="max-w-[52rem] text-[15px] leading-7 text-neutral-600">
                  Filter by capability, move through the ledger, then open the full case when the proof claim needs a
                  deeper read.
                </p>
                <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
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

            <div className="grid gap-8 xl:grid-cols-[0.52fr_0.48fr]">
              <div className="overflow-hidden border-y border-neutral-950/14 bg-white/28 shadow-[0_34px_120px_rgba(0,0,0,0.07)]">
                <div className="relative aspect-[16/10] min-h-[340px] overflow-hidden bg-neutral-950">
                  <motion.img
                    key={`${activeCase.slug}-reader`}
                    src={getPreviewFrame(activeCase)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.035 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.72, ease }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/8 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/58">{activeCase.evidence.proofLabel}</div>
                    <div className="mt-3 max-w-[9ch] break-words text-[36px] leading-[0.92] sm:max-w-[12ch] sm:text-[72px]">
                      {activeCase.title}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3">
                  {activeCase.evidence.proofPoints.map((point, index) => (
                    <div key={point} className="border-t border-neutral-950/10 p-5 md:border-r md:last:border-r-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">Proof 0{index + 1}</div>
                      <p className="mt-4 text-[14px] leading-6 text-neutral-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="border-y border-neutral-950/14">
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
                        className={`grid w-full gap-4 border-b border-neutral-950/10 py-5 text-left transition last:border-b-0 md:grid-cols-[4rem_0.32fr_1fr] ${
                          active ? "text-neutral-950" : "text-neutral-500 hover:bg-white/38 hover:text-neutral-950"
                        }`}
                      >
                        <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${active ? "text-neutral-950" : "text-neutral-300"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[24px] leading-none">{item.title}</span>
                        <span>
                          <span className={`block text-[12px] leading-6 transition ${active ? "text-neutral-600" : "text-neutral-400"}`}>
                            {item.evidence.proofLabel}
                          </span>
                          <span className={`mt-2 block text-[11px] uppercase tracking-[0.14em] transition ${active ? "text-neutral-400" : "text-transparent"}`}>
                            {item.evidence.workType}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
                  {activeCase.evidence.systemTags.map((tag) => (
                    <EvidenceTag key={tag}>{tag}</EvidenceTag>
                  ))}
                </div>
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
