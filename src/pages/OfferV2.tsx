import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import { MobileMotionLedgerRow } from "../ui/mobile-motion/MobileMotionLedger";
import MobileMotionSection from "../ui/mobile-motion/MobileMotionSection";
import OfferDeliveryModelEngine, { OfferDeliveryInterfaceOverlay } from "../ui/OfferDeliveryModelEngine";
import OfferScrollArtifactHero from "../ui/OfferScrollArtifactHero";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { startSpaPageTransition } from "../ui/pageTransition";
import { useSound } from "../stage/audio/useSound";
import { scrollToRailSection, useSectionRailActive } from "../ui/useSectionRailActive";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

type BuildSystem = {
  title: string;
  signal: string;
  what: string;
  forWhom: string;
  result: string;
  focus: string[];
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

const heroObjectLayers = [
  {
    title: "Commercial thesis",
    signal: "strategy",
    text: "Offer shape, audience pressure, proof claims, and conversion intent become the first structural layer.",
  },
  {
    title: "Interface spine",
    signal: "architecture",
    text: "The page becomes a sequence of rooms: threshold, proof, service model, delivery, formats, and output.",
  },
  {
    title: "Cinematic surface",
    signal: "visual / motion",
    text: "Typography, image rhythm, motion states, and interaction feedback make the offer feel authored.",
  },
  {
    title: "Production route",
    signal: "delivery",
    text: "The concept lands as a responsive React system with QA, deployment logic, and handoff clarity.",
  },
];

const offerSignalLine =
  "Parsing offer signal: audience -> proof -> route.";

const offerSignalFollowUp = [
  "The service exposes its working logic.",
  "Each project opens as visible stages, claims, motion states, and delivery route.",
];

const buildSystems: BuildSystem[] = [
  {
    title: "Premium Websites",
    signal: "Editorial public surface",
    what: "Editorial websites that organize the offer, proof, media rhythm, and conversion route into one clear premium surface.",
    forWhom: "Brands, studios, founders, hospitality, advisory, culture, and service-led businesses.",
    result: "A clear public surface that explains the offer, builds trust, and feels authored rather than generic.",
    focus: ["Offer hierarchy", "Proof rhythm", "Calm conversion"],
  },
  {
    title: "Interactive Product Surfaces",
    signal: "Product logic made visible",
    what: "Product demos and workflow interfaces that make logic, states, and decisions understandable through interaction.",
    forWhom: "Products, operators, internal tools, startups, creator systems, and commercial prototypes.",
    result: "A working interface layer that turns product logic into visible states, flows, and decisions.",
    focus: ["Demo states", "Guided flows", "Decision clarity"],
  },
  {
    title: "Multilingual Front-end Systems",
    signal: "One system across locales",
    what: "Language-aware site systems with repeatable sections, locale-safe UI, and content structure that travels cleanly.",
    forWhom: "International services, property, hospitality, product launches, and cross-market brand systems.",
    result: "A front-end structure that can support more than one language without losing rhythm or clarity.",
    focus: ["Locale-safe UI", "Repeatable sections", "Cross-market rhythm"],
  },
  {
    title: "Immersive Prototypes",
    signal: "Controlled future-facing proof",
    what: "Contained WebGL, spatial, WebXR, or cinematic prototypes tied to a real commercial or cultural goal.",
    forWhom: "Brands, creators, institutions, exhibitions, product stories, and future-facing digital experiences.",
    result: "A controlled prototype that shows what the next interface layer could become without turning the project into chaos.",
    focus: ["WebGL / spatial", "Cinematic object", "Prototype scope"],
  },
  {
    title: "Creative Technology Direction",
    signal: "Sharper build before production",
    what: "Concept, interface architecture, motion grammar, prototype direction, and production guidance before or during a high-stakes build.",
    forWhom: "Teams that need a senior digital direction before build, during redesign, or around a flagship launch.",
    result: "A clear model for what to build, why it matters, and how the system should behave.",
    focus: ["Concept model", "Motion grammar", "Production guidance"],
  },
];

const coreSystemLayers = [
  ["Strategy", "Offer shape, audience logic, proof hierarchy, project priorities, and commercial clarity."],
  ["Interface Architecture", "Page model, section system, user journeys, decision paths, and interaction states."],
  ["Visual System", "Typography, layout rhythm, media treatment, hierarchy, and premium surface language."],
  ["Motion Grammar", "Transitions, reveal logic, feedback states, and signature behaviors that explain structure."],
  ["Front-end Delivery", "Production-ready React build, responsive implementation, QA pass, and deploy-ready structure."],
];

const optionalSystemLayers = [
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
    title: "Available System Adaptation",
    description:
      "Adapt an existing Brenych Studio direction into a production-ready website, product surface, or campaign system.",
    bestFor:
      "Clients who already see a direction they like and want to move faster.",
    output:
      "Adapted visual system, client content, responsive front-end, and deploy-ready build.",
  },
  {
    title: "Landing Sprint",
    description: "A focused commercial surface for a product, service, waitlist, launch, or high-trust offer.",
    bestFor: "One clear offer that needs premium presentation quickly.",
    output: "A production-ready landing system with responsive polish and CTA logic.",
  },
  {
    title: "Micro-site",
    description: "A compact multi-section or multi-page surface for a campaign, studio, service, or proof archive.",
    bestFor: "Projects that need more structure than a landing page.",
    output: "A clear editorial site system with reusable sections and strong visual rhythm.",
  },
  {
    title: "Product / Founder Demo",
    description: "An interface prototype that makes product logic, workflow, or founder narrative visible.",
    bestFor: "Early products, internal tools, investor demos, and product-led proof.",
    output: "A working surface that explains the product through interaction, not slides.",
  },
  {
    title: "Immersive Prototype",
    description: "A contained WebGL, spatial, or cinematic proof tied to a real brand, product, or archive.",
    bestFor: "Teams that need a signature digital moment or proof of direction.",
    output: "A contained immersive prototype that can sit beside the commercial system.",
  },
  {
    title: "Creative Technology Direction",
    description: "A senior systems pass before production: concept, interface architecture, motion model, and build direction.",
    bestFor: "Brands and teams with ambition but an unclear digital shape.",
    output: "A practical direction model, not just inspiration.",
  },
];

const formatGroups = [
  { label: "Primary entry points", note: "Most common ways to begin.", items: formats.slice(0, 3) },
  { label: "Secondary directions", note: "Specialized proof, prototype, or direction work.", items: formats.slice(3) },
];

type MobileRoute = Format & {
  routeIndex: string;
};

const mobileThesisPoints = [
  ["01", "Strategy", "Offer shape, audience pressure, and proof hierarchy."],
  ["02", "Interface architecture", "Route, section logic, decisions, and CTA flow."],
  ["03", "Production delivery", "Responsive front-end, motion states, QA, and handoff."],
];

const mobileDeliverySpine = [
  ["01", "Direction", "Commercial thesis locked."],
  ["02", "Visual system", "Interface language defined."],
  ["03", "Build", "Responsive front-end assembled."],
  ["04", "Launch", "QA, handoff, and next-step clarity."],
];

const mobileReceiveLedger = [
  ["01", "Front-end surface", "Production-ready responsive interface."],
  ["02", "Content structure", "Section logic, hierarchy, and route clarity."],
  ["03", "Mobile / desktop system", "Responsive presentation across key screens."],
  ["04", "Motion states", "Transitions, reveals, feedback, and interaction states."],
  ["05", "Launch handoff", "QA pass, metadata basics, and delivery notes."],
];

const deliverables = [
  "Production-ready front-end",
  "Structured content and section logic",
  "Responsive interface system",
  "Motion language and interaction states",
  "QA, launch support, and handoff notes",
];

const mobileRouteOrder = [
  "Landing Sprint",
  "Micro-site",
  "Product / Founder Demo",
  "Immersive Prototype",
  "Available System Adaptation",
  "Creative Technology Direction",
];

const mobileRoutes: MobileRoute[] = mobileRouteOrder.map((title, index) => ({
  ...(formats.find((item) => item.title === title) ?? formats[index] ?? formats[0]),
  routeIndex: String(index + 1).padStart(2, "0"),
}));

const mobilePrimaryRoutes = mobileRoutes.slice(0, 3);
const mobileSecondaryRoutes = mobileRoutes.slice(3);

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

function OfferSignalReadout() {
  const prefersReducedMotion = useReducedMotion();
  const [activeLayer, setActiveLayer] = useState(0);
  const [typedLine, setTypedLine] = useState("");
  const sound = useSound();
  const active = heroObjectLayers[activeLayer] ?? heroObjectLayers[0];
  const visibleTypedLine = prefersReducedMotion ? offerSignalLine : typedLine;
  const activeProgress = ((activeLayer + 1) / heroObjectLayers.length) * 100;

  useEffect(() => {
    if (prefersReducedMotion) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTypedLine(offerSignalLine.slice(0, index));
      if (index >= offerSignalLine.length) window.clearInterval(timer);
    }, 28);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveLayer((current) => (current + 1) % heroObjectLayers.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <motion.aside
      className="relative mx-auto min-h-[430px] w-full max-w-[44rem] overflow-visible text-neutral-950 sm:min-h-[460px] lg:min-h-[560px]"
      aria-label="Offer signal field"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18, filter: "blur(4px)" }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.72, ease, delay: 0.1 }}
    >
      <div className="pointer-events-none absolute left-[2%] right-[18%] top-[12%] h-px bg-gradient-to-r from-transparent via-neutral-950/16 to-transparent" />
      <div className="pointer-events-none absolute bottom-[13%] left-[8%] right-[18%] h-px bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />
      <div className="pointer-events-none absolute right-[9%] top-[21%] h-[58%] w-px bg-gradient-to-b from-transparent via-neutral-950/14 to-transparent" />
      <div className="pointer-events-none absolute left-[46%] top-[4%] h-[28rem] w-[28rem] rounded-full border border-neutral-950/[0.04]" />
      <div className="pointer-events-none absolute left-[2%] top-[52%] h-px w-[90%] rotate-[-10deg] bg-gradient-to-r from-transparent via-neutral-950/16 to-transparent" />
      <div className="pointer-events-none absolute right-[8%] top-[18%] h-2 w-2 rounded-full bg-neutral-950 shadow-[0_0_28px_rgba(17,17,17,0.18)]" />

      <div className="relative grid min-h-[430px] gap-7 py-7 sm:min-h-[460px] sm:py-8 md:grid-cols-[0.52fr_0.48fr] md:items-center lg:min-h-[560px]">
        <div className="relative z-10 self-start md:self-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Live offer signal</div>
          <div className="mt-2 max-w-[18rem] font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            {active.signal} / commercial surface
          </div>

          <div className="mt-9 max-w-[22rem] font-mono text-[12px] leading-6 text-neutral-600">
            <p>
              {visibleTypedLine}
              {!prefersReducedMotion && visibleTypedLine.length < offerSignalLine.length ? (
                <span className="ml-1 inline-block h-3 w-px translate-y-0.5 bg-neutral-950/70" />
              ) : null}
            </p>

            {offerSignalFollowUp.map((line, index) => (
              <motion.p
                key={line}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease, delay: 1 + index * 0.16 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            key={active.title}
            className="mt-10 max-w-[20rem]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-300">
              {String(activeLayer + 1).padStart(2, "0")} active layer
            </div>
            <h2 className="mt-3 text-[38px] font-normal leading-[0.86] tracking-[-0.055em] text-neutral-950 sm:text-[48px]">
              {active.title}
            </h2>
            <p className="mt-4 text-[14px] leading-6 text-neutral-600">
              {active.text}
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 grid gap-0 self-center">
          {heroObjectLayers.map((item, index) => {
            const isActive = index === activeLayer;

            return (
              <button
                key={item.title}
                type="button"
                onMouseEnter={() => {
                  sound.playRole("hover");
                  setActiveLayer(index);
                }}
                onFocus={() => setActiveLayer(index)}
                onClick={() => {
                  sound.playRole("select");
                  setActiveLayer(index);
                }}
                className={`group relative grid min-h-[4.6rem] grid-cols-[2.8rem_1fr] items-center gap-4 border-t border-neutral-950/10 text-left transition last:border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
                  isActive ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                    isActive ? "text-neutral-950" : "text-neutral-300"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 py-4">
                  <span className={`block text-[15px] uppercase leading-5 tracking-[0.13em] transition ${isActive ? "translate-x-1" : ""}`}>
                    {item.title}
                  </span>
                  <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                    {item.signal}
                  </span>
                </span>
                <span
                  className={`absolute -left-4 bottom-3 top-3 w-px bg-neutral-950 transition ${
                    isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-30"
                  }`}
                />
              </button>
            );
          })}

          <div className="mt-6 grid gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            <div className="flex items-center justify-between gap-4">
              <span>{active.signal} route</span>
              <span className="text-neutral-950">
                {String(activeLayer + 1).padStart(2, "0")} / {String(heroObjectLayers.length).padStart(2, "0")}
              </span>
            </div>
            <div className="h-px w-full bg-neutral-950/12">
              <motion.div
                className="h-px bg-neutral-950"
                initial={false}
                animate={{ width: `${activeProgress}%` }}
                transition={{ duration: 0.42, ease }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function BuildSystemsInterface() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { playRole } = useSound();
  const active = buildSystems[activeIndex] ?? buildSystems[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr] xl:gap-8">
      <div className="border-y border-neutral-950/10">
        {buildSystems.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={item.title}
              type="button"
              aria-pressed={isActive}
              onMouseEnter={() => {
                playRole("hover");
                setActiveIndex(index);
              }}
              onFocus={() => setActiveIndex(index)}
              onClick={() => {
                playRole("select");
                setActiveIndex(index);
              }}
              className={`group relative grid min-h-[6.2rem] w-full grid-cols-[3rem_1fr] gap-4 border-b border-neutral-950/10 py-4 pr-4 text-left transition last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:grid-cols-[4rem_1fr] ${
                isActive
                  ? "bg-white/86 text-neutral-950 shadow-[0_18px_54px_rgba(24,24,22,0.06)]"
                  : "text-neutral-400 opacity-[0.62] hover:bg-white/38 hover:text-neutral-800 hover:opacity-100"
              }`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.44, ease, delay: index * 0.035 }}
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                  isActive ? "text-neutral-950" : "text-neutral-300 group-hover:text-neutral-500"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-[23px] font-normal leading-[0.98] tracking-[-0.04em] sm:text-[28px]">
                  {item.title}
                </span>
                <span
                  className={`mt-3 block font-mono text-[10px] uppercase leading-5 tracking-[0.15em] transition ${
                    isActive ? "text-neutral-500" : "text-neutral-300 group-hover:text-neutral-400"
                  }`}
                >
                  {item.signal}
                </span>
              </span>
              <span
                className={`absolute bottom-4 left-0 top-4 w-px bg-neutral-950 transition ${
                  isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-25"
                }`}
              />
              <span
                className={`absolute right-4 top-4 h-2 w-2 rounded-full border transition ${
                  isActive ? "border-neutral-950 bg-neutral-950" : "border-neutral-950/16 bg-transparent group-hover:border-neutral-950/32"
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.aside
          key={active.title}
          className="relative overflow-hidden border-y border-neutral-950/12 bg-white/[0.34] p-5 sm:p-6 lg:sticky lg:top-28 lg:self-start"
          initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
          transition={{ duration: 0.34, ease }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px)] [background-size:58px_58px]" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-950/10 pb-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                Selected format
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                {String(activeIndex + 1).padStart(2, "0")} / {String(buildSystems.length).padStart(2, "0")}
              </div>
            </div>

            <h3 className="mt-7 max-w-[12ch] text-[42px] font-normal leading-[0.9] tracking-[-0.05em] text-neutral-950 sm:text-[56px]">
              {active.title}
            </h3>
            <p className="mt-5 max-w-[42rem] text-[16px] leading-7 text-neutral-600">
              {active.what}
            </p>

            <div className="mt-7 grid border-y border-neutral-950/10">
              <div className="grid gap-3 border-b border-neutral-950/10 py-4 sm:grid-cols-[8rem_1fr]">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">For</div>
                <p className="text-[14px] leading-6 text-neutral-600">{active.forWhom}</p>
              </div>
              <div className="grid gap-3 py-4 sm:grid-cols-[8rem_1fr]">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Result</div>
                <p className="text-[14px] leading-6 text-neutral-700">{active.result}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {active.focus.map((focus, index) => (
                <div key={focus} className="border-t border-neutral-950/10 pt-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-[13px] uppercase leading-5 tracking-[0.1em] text-neutral-600">
                    {focus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </div>
  );
}

function SystemLayerSpine() {
  const layerGroups = [
    { label: "Core layers", layers: coreSystemLayers, optional: false },
    { label: "Optional layers", layers: optionalSystemLayers, optional: true },
  ];
  let layerIndex = 0;

  return (
    <div className="relative overflow-hidden border-y border-neutral-950/14 bg-white/24">
      <div className="pointer-events-none absolute left-[2.15rem] top-0 h-full w-px bg-neutral-950/12 sm:left-[4.65rem]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#111_1px,transparent_1px)] [background-size:64px_64px]" />

      {layerGroups.map((group) => (
        <div key={group.label} className="relative border-b border-neutral-950/10 last:border-b-0">
          <div className="grid gap-3 border-b border-neutral-950/10 px-4 py-3 sm:grid-cols-[5rem_1fr] sm:px-6">
            <div />
            <div className="flex items-center justify-between gap-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">{group.label}</div>
              {group.optional ? (
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">Add when useful</div>
              ) : null}
            </div>
          </div>

          {group.layers.map(([label, text]) => {
            const index = layerIndex;
            layerIndex += 1;

            return (
              <motion.div
                key={label}
                className={`relative grid gap-4 border-b border-neutral-950/10 px-4 py-5 last:border-b-0 sm:grid-cols-[5rem_1fr] sm:px-6 ${
                  group.optional ? "bg-white/[0.18]" : ""
                }`}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.48, ease, delay: index * 0.04 }}
              >
                <div className="relative flex items-center gap-4">
                  <span
                    className={`relative z-10 h-3 w-3 rounded-full border ${
                      group.optional ? "border-neutral-950/32 bg-white/40" : "border-neutral-950 bg-[#f3f0e9]"
                    }`}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="grid gap-3 lg:grid-cols-[14rem_1fr]">
                  <div className={`text-[15px] uppercase tracking-[0.11em] ${group.optional ? "text-neutral-600" : "text-neutral-950"}`}>{label}</div>
                  <p className={`text-[14px] leading-6 ${group.optional ? "text-neutral-500" : "text-neutral-600"}`}>{text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
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
  const sound = useSound();

  return (
    <div className="relative overflow-hidden border-y border-neutral-950/10 bg-white/[0.18]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_34%,rgba(255,255,255,0.82),transparent_34%),linear-gradient(120deg,rgba(255,255,255,0.58),rgba(226,222,214,0.16)_48%,rgba(255,255,255,0.46))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-white/34 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-white/30 to-transparent" />

      <div className="relative lg:min-h-[760px]">
        <motion.div
          className="relative min-h-[560px] overflow-hidden sm:min-h-[640px] lg:min-h-[760px]"
          initial={{ opacity: 0.78 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.72, ease }}
        >
          <div className="absolute inset-x-0 top-0 z-20 flex min-h-14 items-center justify-between gap-4 border-b border-neutral-950/10 px-4 sm:px-5">
            <div className="pointer-events-none font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              {current.label} active
            </div>
            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={onOpenInterface}
              className="inline-flex min-h-10 shrink-0 items-center justify-center border border-neutral-950 bg-neutral-950 px-4 text-[10px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
            >
              Open interface -&gt;
            </button>
          </div>

          <div className="absolute inset-0 pt-14">
            <OfferDeliveryModelEngine
              stages={deliveryStages}
              activeStage={activeStage}
              onSelectStage={setActiveStage}
              onStageHover={() => sound.playRole("hover")}
              variant="wide"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function useDesktopOfferLayout() {
  const [desktopLayout, setDesktopLayout] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktopLayout(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return desktopLayout;
}

function MobileOfferHero({
  onOpenProject,
  onViewWork,
}: {
  onOpenProject: () => void;
  onViewWork: () => void;
}) {
  return (
    <section
      id="offer-threshold"
      data-header-scene="practice-threshold"
      data-sound-safe-area
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-y border-neutral-950/12 px-[var(--mobile-page-x)] pb-9 pt-8"
    >
      <SectionLabel>Commercial Threshold / Offer V2</SectionLabel>
      <h1 className="mt-7 max-w-[11ch] text-[58px] font-normal leading-[0.9] text-neutral-950">
        Premium interface systems for real projects.
      </h1>
      <p className="mt-7 max-w-[21rem] text-[17px] leading-7 text-neutral-600">
        Premium websites, product surfaces, multilingual systems, and focused prototypes shaped around strategy,
        proof, motion, and production-ready front-end delivery.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onOpenProject}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
        >
          Start a project -&gt;
        </button>
        <button
          type="button"
          onClick={onViewWork}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white/54 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700"
        >
          View work -&gt;
        </button>
      </div>
    </section>
  );
}

function MobileOfferThesis() {
  return (
    <section
      id="offer-systems"
      data-header-scene="practice-build"
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] py-12"
    >
      <SectionLabel>01 / What I build</SectionLabel>
      <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        Commercial system surface.
      </h2>
      <p className="mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        Not generic services. Each format is a commercial interface system with a clear role, audience, and result.
      </p>

      <div className="mt-8 border-y border-neutral-950/12">
        {mobileThesisPoints.map(([index, title, text]) => (
          <MobileMotionLedgerRow key={title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-neutral-950/10 py-4 last:border-b-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{index}</div>
            <div>
              <div className="text-[15px] uppercase tracking-[0.1em] text-neutral-950">{title}</div>
              <p className="mt-2 max-w-[18rem] text-[14px] leading-6 text-neutral-500">{text}</p>
            </div>
          </MobileMotionLedgerRow>
        ))}
      </div>
    </section>
  );
}

function MobileRouteSelector() {
  const { playRole } = useSound();
  const reduceMotion = useReducedMotion();
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  const activateRoute = (index: number) => {
    if (index !== activeRouteIndex) playRole("select");
    setActiveRouteIndex(index);
  };

  const renderRoute = (route: MobileRoute, index: number, secondary = false) => {
    const isActive = index === activeRouteIndex;

    return (
      <article
        key={route.title}
        className={`relative border-b border-neutral-950/10 last:border-b-0 ${secondary ? "text-neutral-700" : "text-neutral-950"}`}
      >
        <button
          type="button"
          aria-expanded={isActive}
          onMouseEnter={() => playRole("hover")}
          onClick={() => activateRoute(index)}
          className={`grid w-full grid-cols-[2.7rem_1fr_auto] items-start gap-3 py-4 text-left transition ${
            isActive ? "text-neutral-950" : "hover:bg-white/24"
          }`}
        >
          <span className={`pt-1 font-mono text-[9px] uppercase tracking-[0.16em] ${isActive ? "text-neutral-500" : "text-neutral-300"}`}>
            {route.routeIndex}
          </span>
          <span className="min-w-0">
            <span className="block text-[22px] font-normal leading-[1.04] text-neutral-950">{route.title}</span>
            <span className="mt-2 block max-w-[18rem] text-[13px] leading-5 text-neutral-500">{route.description}</span>
          </span>
          <span
            className={`mt-1.5 h-2 w-2 rounded-full border transition ${
              isActive ? "border-neutral-950 bg-neutral-950 shadow-[0_0_0_5px_rgba(17,17,17,0.05)]" : "border-neutral-950/24"
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {isActive ? (
            <motion.div
              key={`${route.title}-route-detail`}
              initial={reduceMotion ? false : { height: 0, opacity: 0, y: -6 }}
              animate={reduceMotion ? { height: "auto", opacity: 1, y: 0 } : { height: "auto", opacity: 1, y: 0 }}
              exit={reduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div data-sound-safe-area className="pb-4 pl-[2.7rem] pr-1">
                <div className="h-px w-full bg-gradient-to-r from-neutral-950/16 via-neutral-950/8 to-transparent" />
                <div className="mt-3 grid gap-3">
                  <div className="grid grid-cols-[4.1rem_1fr] gap-3">
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-300">Best</div>
                    <p className="max-w-[19rem] text-[13px] leading-5 text-neutral-600">{route.bestFor}</p>
                  </div>
                  <div className="grid grid-cols-[4.1rem_1fr] gap-3">
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-300">Output</div>
                    <p className="max-w-[19rem] text-[13px] leading-5 text-neutral-800">{route.output}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </article>
    );
  };

  return (
    <section
      id="offer-formats"
      data-header-scene="practice-formats"
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] py-12"
    >
      <SectionLabel>02 / Route selector</SectionLabel>
      <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        Choose the right entry point.
      </h2>
      <p className="mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        Most projects start from one of these routes. Open only the route that feels closest to the need.
      </p>

      <div className="mt-8 border-y border-neutral-950/12">
        {mobilePrimaryRoutes.map((route, index) => renderRoute(route, index))}
      </div>

      <div className="mt-6 border-y border-neutral-950/10">
        <button
          type="button"
          onMouseEnter={() => playRole("hover")}
          onClick={() => {
            playRole("select");
            setSecondaryOpen((current) => {
              const next = !current;
              if (!next && activeRouteIndex > 2) setActiveRouteIndex(0);
              return next;
            });
          }}
          className="grid min-h-12 w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">Secondary routes</span>
            <span className="mt-2 block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">
              Immersive / Adaptation / Direction
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            {secondaryOpen ? "Hide routes" : "Show 03 ->"}
          </span>
        </button>

        {secondaryOpen ? (
          <div className="border-t border-neutral-950/10">
            {mobileSecondaryRoutes.map((route, index) => renderRoute(route, index + mobilePrimaryRoutes.length, true))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MobileDeliverySpine() {
  return (
    <section
      id="offer-delivery"
      data-header-scene="practice-delivery"
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] py-12"
    >
      <SectionLabel>03 / How the project moves</SectionLabel>
      <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        Built through clear stages.
      </h2>
      <p className="mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        The route moves from commercial direction into a visible interface system, then into production and launch.
      </p>

      <div data-sound-safe-area className="mt-8 border-y border-neutral-950/12 pb-2">
        {mobileDeliverySpine.map(([index, title, text], itemIndex) => (
          <MobileMotionLedgerRow key={title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-neutral-950/10 py-4">
            <div className="relative font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              <span className="relative z-10 inline-flex h-5 items-center bg-[#f7f5f0]/80 pr-2">{index}</span>
              {itemIndex < mobileDeliverySpine.length - 1 ? (
                <span className="absolute left-[0.2rem] top-5 h-[calc(100%+1rem)] w-px bg-neutral-950/10" aria-hidden="true" />
              ) : null}
            </div>
            <div className="flex min-w-0 items-baseline justify-between gap-4">
              <div>
                <div className="text-[22px] leading-none text-neutral-950">{title}</div>
              <p className="mt-2 max-w-[18rem] text-[14px] leading-6 text-neutral-500">{text}</p>
              </div>
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full border border-neutral-950/18" aria-hidden="true" />
            </div>
          </MobileMotionLedgerRow>
        ))}

        <div className="grid grid-cols-[3.5rem_1fr] gap-4 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">Output</div>
          <div className="max-w-[18rem] text-[15px] leading-6 text-neutral-800">Production-ready commercial interface.</div>
        </div>
      </div>
    </section>
  );
}

function MobileOutputLedger() {
  return (
    <section
      id="offer-output"
      data-header-scene="practice-output"
      className="relative z-10 mx-auto w-[min(100%,44rem)] px-[var(--mobile-page-x)] py-12"
    >
      <SectionLabel>04 / What you receive</SectionLabel>
      <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        A usable commercial system.
      </h2>

      <div className="mt-8 flex items-center justify-between gap-4 border-y border-neutral-950/12 py-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">Included in every route</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">05 items</div>
      </div>

      <div data-sound-safe-area className="border-b border-neutral-950/12 pb-6">
        {mobileReceiveLedger.map(([index, title, text]) => (
          <MobileMotionLedgerRow key={title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-neutral-950/10 py-4 last:border-b-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{index}</div>
            <div>
              <div className="max-w-[18rem] text-[19px] leading-[1.1] text-neutral-900">{title}</div>
              <p className="mt-2 max-w-[18rem] text-[14px] leading-6 text-neutral-500">{text}</p>
            </div>
          </MobileMotionLedgerRow>
        ))}
      </div>
    </section>
  );
}

function MobileOfferLayout({
  onOpenProject,
  onViewWork,
}: {
  onOpenProject: () => void;
  onViewWork: () => void;
}) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip lg:hidden">
      <MobileMotionSection variant="threshold">
        <MobileOfferHero onOpenProject={onOpenProject} onViewWork={onViewWork} />
      </MobileMotionSection>
      <MobileMotionSection variant="media" delay="soft">
        <div className="py-7">
          <OfferScrollArtifactHero compact />
        </div>
      </MobileMotionSection>
      <MobileMotionSection variant="ledger" delay="soft">
        <MobileOfferThesis />
      </MobileMotionSection>
      <MobileMotionSection variant="ledger" delay="soft">
        <MobileRouteSelector />
      </MobileMotionSection>
      <MobileMotionSection variant="ledger" delay="soft">
        <MobileDeliverySpine />
      </MobileMotionSection>
      <MobileMotionSection variant="closing" delay="soft">
        <MobileOutputLedger />
      </MobileMotionSection>
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
  const { playRole, setScene, stopAmbient } = useSound();
  const systemsRef = useRef<HTMLElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [deliveryInterfaceOpen, setDeliveryInterfaceOpen] = useState(false);
  const activeSectionId = useSectionRailActive(offerRailItems);
  const desktopLayout = useDesktopOfferLayout();

  useEffect(() => {
    setScene("practice");
    stopAmbient();
  }, [setScene, stopAmbient]);

  useEffect(() => {
    if (!deliveryInterfaceOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [deliveryInterfaceOpen]);

  const viewWork = () => {
    playRole("select");
    startSpaPageTransition(navigate, "/work", onCloseProject);
  };

  const exploreSystems = () => {
    playRole("select");
    systemsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openProjectWithSound = () => {
    playRole("open");
    onOpenProject?.();
  };

  const setActiveStageWithSound = (index: number) => {
    if (index !== activeStage) playRole("transition");
    setActiveStage(index);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      {noIndex ? <OfferV2Meta /> : null}
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="tablet-reader-surface relative min-h-screen overflow-x-clip bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="practice" />
        <SectionRail
          items={offerRailItems}
          activeId={activeSectionId}
          onSelect={scrollToRailSection}
          label="Offer sections"
        />
        <main className="relative pt-20 lg:pt-24">
          {desktopLayout ? (
            <>
          <section id="offer-threshold" data-header-scene="practice-threshold" data-sound-safe-area className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-[min(94vw,1720px)] gap-10 border-y border-neutral-950/14 py-10 lg:grid-cols-[0.46fr_0.54fr] lg:items-center lg:py-12 xl:pr-36">
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
                  onMouseEnter={() => playRole("hover")}
                  onClick={openProjectWithSound}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  Start a project -&gt;
                </button>
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
                  onClick={viewWork}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-white/54 px-5 text-[11px] uppercase tracking-[0.16em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  View work -&gt;
                </button>
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
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

            <OfferSignalReadout />
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

              <BuildSystemsInterface />
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
                  The commercial surface is built from five core layers. Multilingual and immersive layers stay available
                  when the project genuinely needs them.
                </p>
              </div>

              <SystemLayerSpine />
            </div>
          </section>

          <section id="offer-delivery" data-header-scene="practice-delivery" className="relative z-10 mx-auto w-[min(94vw,1720px)] scroll-mt-28 pb-8 lg:pb-10">
            <div className="relative isolate -mx-[3vw] overflow-visible px-[3vw] pb-8 pt-10 lg:pb-10 lg:pt-16">
              <div className="pointer-events-none absolute -inset-x-[4vw] -inset-y-20 -z-10 bg-[radial-gradient(circle_at_38%_20%,rgba(255,255,255,0.58),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(244,241,234,0.36),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0),rgba(246,244,239,0.28)_34%,rgba(246,244,239,0.2)_68%,rgba(255,255,255,0))] opacity-80 [mask-image:linear-gradient(180deg,transparent,black_18%,black_82%,transparent)]" />
              <div className="pointer-events-none absolute -inset-x-[4vw] -inset-y-16 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(180deg,transparent,black_16%,black_84%,transparent)]" />
              <div className="pointer-events-none absolute left-[12%] top-[1rem] -z-10 h-[32rem] w-[32rem] rounded-full border border-neutral-950/[0.018]" />
              <div className="pointer-events-none absolute right-[10%] bottom-[-1rem] -z-10 h-[28rem] w-[28rem] rounded-full border border-neutral-950/[0.016]" />

              <div className="grid gap-10 border-y border-neutral-950/10 py-9 lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
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
                  setActiveStage={setActiveStageWithSound}
                  onOpenInterface={() => {
                    playRole("open");
                    setDeliveryInterfaceOpen(true);
                  }}
                />
              </div>
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
                {formatGroups.map((group, groupIndex) => {
                  const startIndex = groupIndex === 0 ? 0 : 3;

                  return (
                    <div key={group.label} className="border-b border-neutral-950/10 last:border-b-0">
                      <div className="grid gap-2 border-b border-neutral-950/10 py-4 lg:grid-cols-[3rem_1fr]">
                        <div className="hidden lg:block" />
                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">{group.label}</div>
                          <div className="max-w-[22rem] text-[12px] leading-5 text-neutral-400">{group.note}</div>
                        </div>
                      </div>

                      {group.items.map((item, index) => {
                        const absoluteIndex = startIndex + index;
                        const primary = groupIndex === 0;

                        return (
                          <article
                            key={item.title}
                            className={`grid gap-4 border-b border-neutral-950/10 py-5 last:border-b-0 lg:grid-cols-[3rem_0.76fr_0.94fr] ${
                              primary ? "" : "text-neutral-600"
                            }`}
                          >
                            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                              {String(absoluteIndex + 1).padStart(2, "0")}
                            </div>
                            <div>
                              <h3 className={`font-normal leading-none tracking-[-0.04em] ${primary ? "text-[30px] text-neutral-950" : "text-[26px] text-neutral-800"}`}>
                                {item.title}
                              </h3>
                              <p className={`mt-3 text-[14px] leading-6 ${primary ? "text-neutral-600" : "text-neutral-500"}`}>{item.description}</p>
                            </div>
                            <div className="grid gap-2 self-start border-t border-neutral-950/8 pt-3 text-[12px] leading-5 text-neutral-500 lg:border-t-0 lg:pt-1">
                              <p>
                                <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">Best</span>
                                {item.bestFor}
                              </p>
                              <p>
                                <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">Output</span>
                                {item.output}
                              </p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  );
                })}
                <div className="border-t border-neutral-950/10 py-4 text-[12px] leading-6 text-neutral-500">
                  Availability does not mean instant resale of the existing project as-is. Each adaptation is
                  commissioned and customized for the client's brand, content, audience, market, and deployment
                  requirements.
                </div>
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
            </>
          ) : (
            <MobileOfferLayout onOpenProject={openProjectWithSound} onViewWork={viewWork} />
          )}
        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="practice" />
      </PageSurface>

      <AnimatePresence>
        {deliveryInterfaceOpen ? (
          <OfferDeliveryInterfaceOverlay
            stages={deliveryStages}
            activeStage={activeStage}
            setActiveStage={setActiveStageWithSound}
            onClose={() => {
              playRole("close");
              setDeliveryInterfaceOpen(false);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
