import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import OfferDeliveryModelEngine, { OfferDeliveryInterfaceOverlay } from "../ui/OfferDeliveryModelEngine";
import OfferScrollArtifactHero from "../ui/OfferScrollArtifactHero";
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

type BuildSystem = {
  title: string;
  what: string;
  forWhom: string;
  result: string;
};

type Format = {
  title: string;
  description: string;
  bestFor: string;
  output: string;
};

type DeliveryStage = {
  label: string;
  title: string;
  text: string;
  output: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const practiceLayers = [
  "strategy",
  "interface architecture",
  "visual system",
  "motion grammar",
  "front-end delivery",
  "multilingual layer",
  "immersive extension",
];

const buildSystems: BuildSystem[] = [
  {
    title: "Premium Websites",
    what: "Editorial commercial websites with strong structure, premium visual direction, responsive polish, and calm conversion paths.",
    forWhom: "Brands, studios, founders, hospitality, advisory, culture, and service-led businesses.",
    result: "A clear public surface that explains the offer, builds trust, and feels authored rather than templated.",
  },
  {
    title: "Interactive Product Surfaces",
    what: "Product demos, workflow interfaces, proof-led presentations, and founder surfaces where interaction makes the system easier to understand.",
    forWhom: "Products, operators, internal tools, startups, creator systems, and commercial prototypes.",
    result: "A working interface layer that turns product logic into visible states, flows, and decisions.",
  },
  {
    title: "Multilingual Front-end Systems",
    what: "Language-aware site structures with repeatable sections, locale-safe interface patterns, and content that can travel cleanly.",
    forWhom: "International services, property, hospitality, product launches, and cross-market brand systems.",
    result: "A front-end structure that can support more than one language without losing rhythm or clarity.",
  },
  {
    title: "Immersive Prototypes",
    what: "WebGL, spatial, WebXR, cinematic object, or experimental presentation layers connected to a real commercial or cultural goal.",
    forWhom: "Brands, creators, institutions, exhibitions, product stories, and future-facing digital experiences.",
    result: "A controlled prototype that shows what the next interface layer could become without turning the project into chaos.",
  },
  {
    title: "Creative Technology Direction",
    what: "Concept, interface architecture, motion grammar, prototype direction, and production guidance for a sharper digital system.",
    forWhom: "Teams that need a senior digital direction before build, during redesign, or around a flagship launch.",
    result: "A clear model for what to build, why it matters, and how the system should behave.",
  },
];

const systemLayers = [
  ["Strategy", "Offer shape, audience logic, proof hierarchy, project priorities, and commercial clarity."],
  ["Interface Architecture", "Page model, section system, user journeys, decision paths, and interaction states."],
  ["Visual System", "Typography, layout rhythm, media treatment, hierarchy, and premium surface language."],
  ["Motion Grammar", "Transitions, reveal logic, feedback states, and signature behaviors that explain structure."],
  ["Front-end Delivery", "Production-ready React build, responsive implementation, QA pass, and deploy-ready structure."],
  ["Multilingual Layer", "Language structure, translation-ready content, locale-aware UI, and international presentation logic."],
  ["Immersive Extension", "Optional WebGL, spatial prototype, cinematic object, or future-facing experience layer."],
];

const deliveryStages: DeliveryStage[] = [
  {
    label: "01",
    title: "Concept",
    text: "Define the commercial thesis, audience, proof claims, references, constraints, and the shape of the offer.",
    output: "Project direction and priority map",
  },
  {
    label: "02",
    title: "Visual Direction",
    text: "Translate the offer into interface language: hierarchy, media rhythm, typography, composition, and motion tone.",
    output: "Approved surface direction",
  },
  {
    label: "03",
    title: "Front-end Build",
    text: "Build the responsive React interface with section logic, states, motion behavior, and production-ready structure.",
    output: "Working front-end system",
  },
  {
    label: "04",
    title: "QA / Launch",
    text: "Check responsive layouts, content rhythm, interaction states, metadata basics, performance risks, and launch readiness.",
    output: "Launch-ready delivery",
  },
  {
    label: "05",
    title: "Support / Handoff",
    text: "Prepare handoff notes, clarify maintenance logic, support launch adjustments, and leave the system understandable.",
    output: "Handoff and support layer",
  },
];

const formats: Format[] = [
  {
    title: "Landing Sprint",
    description: "A focused commercial surface for a product, service, waitlist, launch, or high-trust offer.",
    bestFor: "One clear offer that needs premium presentation quickly.",
    output: "A production-ready landing system with responsive polish and CTA logic.",
  },
  {
    title: "Micro-site",
    description: "A compact multi-section or multi-page surface for a campaign, studio, service, cultural project, or proof archive.",
    bestFor: "Projects that need more structure than a landing page but not a full platform.",
    output: "A clear editorial site system with reusable sections and strong visual rhythm.",
  },
  {
    title: "Product / Founder Demo",
    description: "A sharp interface prototype that makes workflow, product logic, data states, or founder narrative visible.",
    bestFor: "Early products, internal tools, investor demos, and product-led proof.",
    output: "A working surface that explains the product through interaction, not slides.",
  },
  {
    title: "Immersive Prototype",
    description: "A future-facing WebGL, spatial, or cinematic experience connected to a real brand, product, or archive direction.",
    bestFor: "Teams that need a signature digital moment or experimental proof of direction.",
    output: "A contained immersive prototype that can sit beside the commercial system.",
  },
  {
    title: "Creative Technology Direction",
    description: "A senior systems pass for teams that need the right concept, interface architecture, or motion model before production.",
    bestFor: "Brands and teams with ambition but an unclear digital shape.",
    output: "A practical direction model, not just inspiration.",
  },
];

const deliverables = [
  "Production-ready front-end",
  "Structured content and section logic",
  "Responsive interface system",
  "Motion language and interaction states",
  "SEO and metadata basics",
  "QA, launch support, and handoff notes",
];

const offerRailItems: SectionRailItem[] = [
  { index: "01", label: "Threshold", id: "offer-threshold" },
  { index: "02", label: "Systems", id: "offer-systems" },
  { index: "03", label: "Architecture", id: "engagement-model" },
  { index: "04", label: "Delivery", id: "offer-delivery" },
  { index: "05", label: "Formats", id: "offer-formats" },
  { index: "06", label: "Output", id: "offer-output" },
];

function OfferV2Meta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Offer V2 - Rostyslav Brenych";

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

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div className={`font-mono text-[10px] uppercase tracking-[0.18em] ${light ? "text-white/48" : "text-neutral-500"}`}>
      {children}
    </div>
  );
}

function HeroSystemReadout() {
  return (
    <div className="relative min-h-[520px] overflow-hidden border-y border-neutral-950/14 bg-white/24 lg:min-h-[720px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_54%_34%,rgba(255,255,255,0.72),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(224,218,207,0.22))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute right-[-8rem] top-[-4rem] h-[28rem] w-[28rem] rounded-full border border-neutral-950/[0.07]" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[-8rem] h-[34rem] w-[34rem] rounded-full border border-neutral-950/[0.05]" />

      <div className="relative flex min-h-[520px] flex-col justify-between p-4 sm:p-6 lg:min-h-[720px] lg:p-7">
        <div className="grid min-h-11 grid-cols-[1fr_auto] items-center gap-4 border-b border-neutral-950/10">
          <SectionLabel>System Signal</SectionLabel>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">hero follows</div>
        </div>

        <motion.div
          className="grid gap-8 py-8 sm:py-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.72, ease }}
        >
          <div className="max-w-[33rem] text-[34px] font-normal leading-[0.96] tracking-[-0.045em] text-neutral-950 sm:text-[46px] lg:text-[58px]">
            A commercial system first. A cinematic object next.
          </div>
          <p className="max-w-[34rem] text-[15px] leading-7 text-neutral-600">
            The page now moves from offer clarity into a live WebGL practice object: the structure rotates with scroll,
            then breaks apart into its working layers before the service system begins.
          </p>
        </motion.div>

        <div className="grid gap-2 border-t border-neutral-950/10 pt-4 sm:grid-cols-2 xl:grid-cols-4">
          {practiceLayers.map((item, index) => (
            <div key={item} className="grid grid-cols-[2.3rem_1fr] gap-3 border-t border-neutral-950/10 pt-3 first:border-t-0 sm:first:border-t">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="text-[12px] uppercase leading-5 tracking-[0.12em] text-neutral-600">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuildSystemRow({ item, index }: { item: BuildSystem; index: number }) {
  return (
    <motion.article
      className="group grid gap-5 border-t border-neutral-950/12 py-6 first:border-t-0 lg:grid-cols-[4rem_0.8fr_1fr_1fr]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.52, ease, delay: index * 0.035 }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="text-[30px] font-normal leading-[0.96] tracking-[-0.04em] text-neutral-950 sm:text-[38px]">
        {item.title}
      </h3>
      <div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">For</div>
        <p className="text-[14px] leading-6 text-neutral-600">{item.forWhom}</p>
      </div>
      <div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Result</div>
        <p className="text-[14px] leading-6 text-neutral-700">{item.result}</p>
      </div>
      <p className="lg:col-start-2 lg:col-span-3 text-[15px] leading-7 text-neutral-600">{item.what}</p>
    </motion.article>
  );
}

function SystemLayerSpine() {
  return (
    <div className="relative overflow-hidden border-y border-neutral-950/14 bg-white/24">
      <div className="pointer-events-none absolute left-[2.15rem] top-0 h-full w-px bg-neutral-950/12 sm:left-[4.65rem]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px)] [background-size:64px_64px]" />

      {systemLayers.map(([label, text], index) => (
        <motion.div
          key={label}
          className="relative grid gap-4 border-b border-neutral-950/10 px-4 py-5 last:border-b-0 sm:grid-cols-[5rem_1fr] sm:px-6"
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.48, ease, delay: index * 0.04 }}
        >
          <div className="relative flex items-center gap-4">
            <span className="relative z-10 h-3 w-3 rounded-full border border-neutral-950 bg-[#f3f0e9]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[14rem_1fr]">
            <div className="text-[15px] uppercase tracking-[0.11em] text-neutral-950">{label}</div>
            <p className="text-[14px] leading-6 text-neutral-600">{text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DeliveryModelEngine({
  activeStage,
  setActiveStage,
  onOpenInterface,
}: {
  activeStage: number;
  setActiveStage: (index: number) => void;
  onOpenInterface: () => void;
}) {
  const current = deliveryStages[activeStage] ?? deliveryStages[0];

  return (
    <div className="relative overflow-hidden border-y border-neutral-950/14 bg-[#f8f6f0]/72">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_36%,rgba(255,255,255,0.9),transparent_34%),linear-gradient(120deg,rgba(255,255,255,0.82),rgba(222,216,206,0.24))]" />

      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_24rem]">
        <motion.div
          className="relative min-h-[380px] overflow-hidden border-b border-neutral-950/10 lg:min-h-[640px] lg:border-b-0 lg:border-r"
          initial={{ opacity: 0.78 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.72, ease }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex min-h-12 justify-end border-b border-neutral-950/10 px-4">
            <div className="self-center font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{current.label} active</div>
          </div>

          <div className="absolute inset-0 pt-12">
            <OfferDeliveryModelEngine stages={deliveryStages} activeStage={activeStage} />
          </div>
        </motion.div>

        <aside className="relative p-5 sm:p-7">
          <SectionLabel>Stage control</SectionLabel>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.34, ease }}
              className="mt-8 border-y border-neutral-950/10 py-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{current.label}</div>
              <h3 className="mt-4 text-[32px] font-normal leading-[0.94] tracking-[-0.045em] text-neutral-950">
                {current.title}
              </h3>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 grid gap-2">
            {deliveryStages.map((stage, index) => {
              const active = index === activeStage;

              return (
                <button
                  key={stage.title}
                  type="button"
                  onFocus={() => setActiveStage(index)}
                  onClick={() => setActiveStage(index)}
                  className={`grid min-h-12 grid-cols-[3rem_1fr] items-center gap-3 border px-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
                    active
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-950/10 bg-white/34 text-neutral-600 hover:border-neutral-950/28 hover:bg-white/70 hover:text-neutral-950"
                  }`}
                >
                  <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${active ? "text-white/52" : "text-neutral-300"}`}>
                    {stage.label}
                  </span>
                  <span className="text-[14px] leading-5">{stage.title}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenInterface}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center border border-neutral-950 bg-neutral-950 px-4 text-[10px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            Open interface -&gt;
          </button>
        </aside>
      </div>
    </div>
  );
}

export default function OfferV2({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const navigate = useNavigate();
  const systemsRef = useRef<HTMLElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [deliveryInterfaceOpen, setDeliveryInterfaceOpen] = useState(false);
  const activeSectionId = useSectionRailActive(offerRailItems);

  useEffect(() => {
    if (!deliveryInterfaceOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [deliveryInterfaceOpen]);

  const viewWork = () => {
    startSpaPageTransition(navigate, "/work", onCloseProject);
  };

  const exploreSystems = () => {
    systemsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      {noIndex ? <OfferV2Meta /> : null}
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="relative min-h-screen overflow-x-clip bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="practice" />
        <SectionRail
          items={offerRailItems}
          activeId={activeSectionId}
          onSelect={scrollToRailSection}
          label="Offer sections"
        />
        <main className="relative pt-24">
          <section id="offer-threshold" data-header-scene="practice-threshold" className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-[min(94vw,1720px)] gap-10 border-y border-neutral-950/14 py-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease }}
            >
              <SectionLabel>Commercial Threshold / Offer V2</SectionLabel>
              <h1 className="mt-6 max-w-[11ch] text-[58px] font-normal leading-[0.88] tracking-[-0.06em] text-neutral-950 sm:text-[88px] lg:text-[112px] xl:text-[128px]">
                Premium interface systems for real projects.
              </h1>
              <p className="mt-8 max-w-[43rem] text-[17px] leading-8 text-neutral-600 sm:text-[20px]">
                Premium websites, product surfaces, multilingual systems, and immersive prototypes built with strategy,
                visual direction, motion grammar, and production-ready front-end delivery.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenProject}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  Start a project -&gt;
                </button>
                <button
                  type="button"
                  onClick={viewWork}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-white/54 px-5 text-[11px] uppercase tracking-[0.16em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  View work -&gt;
                </button>
                <button
                  type="button"
                  onClick={exploreSystems}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-transparent px-5 text-[11px] uppercase tracking-[0.16em] text-neutral-600 transition hover:-translate-y-0.5 hover:border-neutral-950/40 hover:text-neutral-950"
                >
                  Explore systems
                </button>
              </div>

              <div className="mt-9 grid gap-3 border-y border-neutral-950/10 py-5 sm:grid-cols-3">
                {["Commercial translation", "System architecture", "Production delivery"].map((item, index) => (
                  <div key={item} className="grid gap-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="text-[13px] uppercase leading-5 tracking-[0.12em] text-neutral-600">{item}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <HeroSystemReadout />
          </section>

          <OfferScrollArtifactHero />

          <section id="offer-systems" ref={systemsRef} data-header-scene="practice-build" className="relative z-10 mx-auto w-[min(94vw,1720px)] py-16 lg:py-20">
            <div className="grid gap-10 border-y border-neutral-950/14 py-9 lg:grid-cols-[0.3fr_0.7fr]">
              <div>
                <SectionLabel>01 / What I build</SectionLabel>
                <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                  Commercial system surface.
                </h2>
                <p className="mt-7 max-w-[28rem] text-[15px] leading-7 text-neutral-600">
                  Not generic services. Each format is a commercial interface system with a clear role, audience, and result.
                </p>
              </div>

              <div className="border-y border-neutral-950/10">
                {buildSystems.map((item, index) => (
                  <BuildSystemRow key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section id="engagement-model" data-header-scene="practice-system" className="relative z-10 mx-auto w-[min(94vw,1720px)] scroll-mt-28 pb-16 lg:pb-20">
            <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionLabel>02 / Service Architecture</SectionLabel>
                <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                  Not a page. A system.
                </h2>
                <p className="mt-7 max-w-[31rem] text-[15px] leading-7 text-neutral-600">
                  The commercial surface is built from connected layers: the offer, the interface, the visual language,
                  the motion behavior, the front-end, and the optional future-facing extension.
                </p>
              </div>

              <SystemLayerSpine />
            </div>
          </section>

          <section id="offer-delivery" data-header-scene="practice-delivery" className="relative z-10 mx-auto w-[min(94vw,1720px)] pb-16 lg:pb-20">
            <div className="grid gap-10 border-y border-neutral-950/14 py-9 lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
              <div>
                <SectionLabel>03 / Engagement Model</SectionLabel>
                <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                  Built through clear stages.
                </h2>
              </div>
              <p className="max-w-[46rem] text-[16px] leading-8 text-neutral-600">
                Each project moves from commercial concept into interface architecture, visual direction, motion behavior,
                and production front-end delivery.
              </p>
            </div>

            <div className="mt-9">
              <DeliveryModelEngine
                activeStage={activeStage}
                setActiveStage={setActiveStage}
                onOpenInterface={() => setDeliveryInterfaceOpen(true)}
              />
            </div>
          </section>

          <section id="offer-formats" data-header-scene="practice-formats" className="relative z-10 mx-auto w-[min(94vw,1720px)] pb-16 lg:pb-20">
            <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr]">
              <div>
                <SectionLabel>04 / Ways to Begin</SectionLabel>
                <h2 className="mt-5 max-w-[9ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[76px]">
                  Choose the right entry point.
                </h2>
              </div>

              <div className="grid border-y border-neutral-950/14">
                {formats.map((item, index) => (
                  <article key={item.title} className="grid gap-5 border-b border-neutral-950/10 py-5 last:border-b-0 lg:grid-cols-[3rem_0.72fr_1fr]">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="text-[30px] font-normal leading-none tracking-[-0.04em] text-neutral-950">{item.title}</h3>
                      <p className="mt-4 text-[14px] leading-6 text-neutral-600">{item.description}</p>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Best for</div>
                        <p className="mt-2 text-[14px] leading-6 text-neutral-700">{item.bestFor}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Output</div>
                        <p className="mt-2 text-[14px] leading-6 text-neutral-700">{item.output}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="offer-output" data-header-scene="practice-output" className="relative z-10 mx-auto w-[min(94vw,1720px)] pb-16 lg:pb-20">
            <div className="grid gap-10 border-y border-neutral-950/14 py-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
              <div>
                <SectionLabel>05 / What You Receive</SectionLabel>
                <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                  A usable commercial system.
                </h2>
              </div>

              <div className="grid gap-0 border-y border-neutral-950/10 bg-white/22">
                {deliverables.map((item, index) => (
                  <div key={item} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-neutral-950/10 px-4 py-4 last:border-b-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="text-[16px] leading-6 text-neutral-800">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="practice" />
      </PageSurface>

      <AnimatePresence>
        {deliveryInterfaceOpen ? (
          <OfferDeliveryInterfaceOverlay
            stages={deliveryStages}
            activeStage={activeStage}
            setActiveStage={setActiveStage}
            onClose={() => setDeliveryInterfaceOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
