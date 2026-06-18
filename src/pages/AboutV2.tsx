import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import AboutPracticeField from "../ui/about/AboutPracticeField";
import Header from "../ui/Header";
import { MobileMotionLedgerRow } from "../ui/mobile-motion/MobileMotionLedger";
import MobileMotionSection from "../ui/mobile-motion/MobileMotionSection";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { startSpaPageTransition } from "../ui/pageTransition";
import { useSound } from "../stage/audio/useSound";
import { scrollToRailSection, useSectionRailActive } from "../ui/useSectionRailActive";
import { spanishCorePageContent } from "../data/spanishContent";
import { getLocalizedPath, useI18n, type LocaleCode } from "../i18n";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

type MethodItem = {
  id: string;
  index: string;
  title: string;
  text: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const practiceLayers = [
  {
    label: "Commercial Systems",
    text: "Premium websites, product surfaces, multilingual systems, and launch-ready front-end delivery.",
    signals: ["premium web", "product surfaces", "multilingual"],
  },
  {
    label: "Experimental Interface Research",
    text: "Atmospheric systems, WebGL stage modules, spatial proof layers, and future WebXR extensions.",
    signals: ["presence", "WebGL stage", "spatial proof"],
  },
];

const methodItems: MethodItem[] = [
  {
    id: "signal",
    index: "01",
    title: "Signal",
    text: "Understand what the project must communicate before deciding how it should look or move.",
  },
  {
    id: "structure",
    index: "02",
    title: "Structure",
    text: "Define the route, content, data, hierarchy, and interaction logic that will carry the work.",
  },
  {
    id: "atmosphere",
    index: "03",
    title: "Atmosphere",
    text: "Shape visual climate, motion rhythm, media behavior, and tone into one readable field.",
  },
  {
    id: "interface",
    index: "04",
    title: "Interface",
    text: "Turn the system into responsive, accessible, production-ready front-end.",
  },
  {
    id: "memory",
    index: "05",
    title: "Memory",
    text: "Leave reusable logic, documentation, and long-term clarity so the project can keep working.",
  },
];

const technicalLedger = [
  ["Front-end architecture", "Reusable structure that can carry content, motion, routes, and future growth."],
  ["Motion system", "Staged transitions and reveals that mark behavior instead of decorating it."],
  ["Atmospheric / WebGL layer", "Stage logic and media fields added only when presence strengthens the work."],
  ["Responsive + accessibility", "Readable layouts, controls, contrast, and states across real viewports."],
  ["Deployment + QA", "Build checks, responsive passes, metadata, and launch review before release."],
  ["Documentation / handoff", "Clear notes and reusable logic so the system remains understandable."],
];

const mobileMethodLedger = [
  ["01", "Signal", "Define what must be communicated."],
  ["02", "Structure", "Organize route, content, hierarchy, and interaction logic."],
  ["03", "Atmosphere", "Shape visual climate, motion rhythm, media behavior, and tone."],
  ["04", "Interface", "Build the responsive surface with clear interaction states."],
  ["05", "Memory", "Leave proof, continuity, reusable logic, and project trace."],
];

const mobileTechnicalLedger = [
  ["01", "Front-end architecture", "Reusable structure that can carry content, motion, routes, and future growth."],
  ["02", "Motion system", "Staged transitions and reveals that mark behavior instead of decorating it."],
  ["03", "Responsive + accessibility", "Readable layouts, controls, contrast, and states across real viewports."],
  ["04", "Production QA", "Build checks, route sanity, deployment readiness, and handoff clarity."],
];

const principles = [
  "Motion is not decoration. It marks state.",
  "Media is not filler. It acts as proof.",
  "WebGL is not a trick. It becomes a stage.",
  "Clarity matters more than noise.",
  "Production quality matters as much as visual direction.",
];

const aboutRailItems: SectionRailItem[] = [
  { index: "01", label: "Position", id: "about-threshold" },
  { index: "02", label: "Practice", id: "about-practice" },
  { index: "03", label: "Method", id: "about-method" },
  { index: "04", label: "Technical", id: "about-technical" },
  { index: "05", label: "Author", id: "about-authorial" },
  { index: "06", label: "Principles", id: "about-principles" },
];

function getAboutUi(locale: LocaleCode) {
  const isSpanish = locale === "es";

  return {
    railItems: isSpanish
      ? [
          { index: "01", label: "Posicion", id: "about-threshold" },
          { index: "02", label: "Practica", id: "about-practice" },
          { index: "03", label: "Metodo", id: "about-method" },
          { index: "04", label: "Tecnico", id: "about-technical" },
          { index: "05", label: "Autor", id: "about-authorial" },
          { index: "06", label: "Principios", id: "about-principles" },
        ]
      : aboutRailItems,
    railLabel: isSpanish ? "Secciones de estudio" : "About sections",
    studioPosition: isSpanish ? "Posicion del estudio" : "Studio position",
    mobileStudioPosition: isSpanish ? "01 / Posicion del estudio" : "01 / Studio position",
    mobileHeroTitle: isSpanish ? "Construyo sistemas de interfaz premium." : "I build premium interface systems.",
    mobileHeroBody: isSpanish
      ? "Websites, superficies de producto, sistemas multilingues y experiencias digitales inmersivas como una interfaz coherente."
      : "Websites, product surfaces, multilingual systems, and immersive digital experiences shaped as one coherent interface.",
    viewWork: isSpanish ? "Ver proyectos ->" : "View work ->",
    exploreImmersive: isSpanish ? "Explorar inmersivo ->" : "Explore immersive ->",
    startProject: isSpanish ? "Iniciar proyecto" : "Start a project",
    practiceLayersLabel: isSpanish ? "02 / Capas de practica" : "02 / Practice layers",
    practiceLayersTitle: isSpanish
      ? "Entrega comercial e investigacion experimental son una sola practica."
      : "Commercial delivery and experimental research are one practice.",
    practiceLayersBody: isSpanish
      ? "El trabajo experimental no esta separado de la entrega comercial. Define el lenguaje de interfaz que hace mas fuerte el trabajo comercial."
      : "The experimental work is not separate from commercial delivery. It defines the interface language that makes the commercial work stronger.",
    methodLabel: isSpanish ? "03 / Gramatica de metodo" : "03 / Method grammar",
    mobileMethodLabel: isSpanish ? "02 / Metodo" : "02 / Method",
    methodTitle: isSpanish ? "Estructura primero. Atmosfera despues." : "Structure first. Atmosphere after.",
    methodBody: isSpanish
      ? "El metodo de trabajo avanza de senal a estructura, y luego hacia atmosfera, interfaz y memoria de proyecto."
      : "The working method moves from signal to structure, then into atmosphere, interface, and project memory.",
    methodFormula: isSpanish ? "Senal -> estructura -> atmosfera -> interfaz -> memoria." : "Signal -> structure -> atmosphere -> interface -> memory.",
    technicalLabel: isSpanish ? "04 / Base tecnica" : "04 / Technical foundation",
    mobileTechnicalLabel: isSpanish ? "03 / Base tecnica" : "03 / Technical foundation",
    technicalTitle: isSpanish ? "La superficie tiene que sostenerse." : "The surface has to hold up.",
    technicalTitleParts: isSpanish ? ["La superficie", "tiene que", "sostenerse."] : ["The surface", "has to", "hold up."],
    technicalBody: isSpanish
      ? "La misma superficie puede sostener claridad de producto, interaccion, motion, estructura multilingue, stages WebGL y entrega lista para launch solo cuando la arquitectura es fuerte."
      : "The same surface can carry product clarity, interaction, motion, multilingual structure, WebGL stages, and launch-ready delivery only when the architecture is strong.",
    mobileTechnicalBody: isSpanish
      ? "El sistema tiene que sostener claridad, motion, rutas y entrega lista para launch sin colapsar."
      : "The system has to carry clarity, motion, routes, and launch-ready delivery without collapsing.",
    technicalNote: isSpanish
      ? "Las capas multilingues e inmersivas se anaden solo cuando fortalecen el proyecto."
      : "Multilingual and immersive layers are added only when they strengthen the project.",
    authorialLabel: isSpanish ? "05 / Nota autoral" : "05 / Authorial note",
    mobileAuthorialLabel: isSpanish ? "04 / Posicion de practica" : "04 / Practice position",
    authorialTitle: isSpanish
      ? "Una practica entre ingenieria, imagen e investigacion de interfaz."
      : "A practice between engineering, image, and interface research.",
    humanSignal: isSpanish ? "Senal humana / posicion de practica" : "Human signal / practice position",
    authorialBody: isSpanish
      ? "Mi trabajo vive entre ingenieria front-end, direccion visual, fotografia, medios cinematicos e investigacion experimental de interfaz. Me interesan webs precisas, atmosfericas y vivas, pero tambien usables, rapidas y claras."
      : "My work sits between front-end engineering, visual direction, photography, cinematic media, and experimental interface research. I am interested in websites that feel precise, atmospheric, and alive, while remaining usable, fast, and clear.",
    principlesLabel: isSpanish ? "06 / Campo de principios" : "06 / Principle field",
    mobilePrinciplesLabel: isSpanish ? "05 / Principios" : "05 / Principles",
    principlesTitle: isSpanish ? "Reglas calmadas para sistemas expresivos." : "Calm rules for expressive systems.",
    methodSignal: isSpanish ? "Senal de metodo / estable" : "Method signal / stable",
  };
}

function getPracticeLayers(locale: LocaleCode) {
  if (locale !== "es") return practiceLayers;

  return [
    {
      label: "Sistemas comerciales",
      text: "Websites premium, superficies de producto, sistemas multilingues y entrega front-end lista para launch.",
      signals: ["web premium", "superficies producto", "multilingue"],
    },
    {
      label: "Investigacion experimental de interfaz",
      text: "Sistemas atmosfericos, modulos WebGL stage, capas de prueba espacial y futuras extensiones WebXR.",
      signals: ["presencia", "WebGL stage", "prueba espacial"],
    },
  ];
}

function getMethodItems(locale: LocaleCode): MethodItem[] {
  if (locale !== "es") return methodItems;

  return [
    { id: "signal", index: "01", title: "Senal", text: "Entender que debe comunicar el proyecto antes de decidir como debe verse o moverse." },
    { id: "structure", index: "02", title: "Estructura", text: "Definir ruta, contenido, datos, jerarquia y logica de interaccion que sostendran el trabajo." },
    { id: "atmosphere", index: "03", title: "Atmosfera", text: "Convertir clima visual, ritmo de motion, comportamiento media y tono en un campo legible." },
    { id: "interface", index: "04", title: "Interfaz", text: "Llevar el sistema a front-end responsive, accesible y listo para produccion." },
    { id: "memory", index: "05", title: "Memoria", text: "Dejar logica reutilizable, documentacion y claridad a largo plazo para que el proyecto siga funcionando." },
  ];
}

function getTechnicalLedger(locale: LocaleCode) {
  if (locale !== "es") return technicalLedger;

  return [
    ["Arquitectura front-end", "Estructura reutilizable que puede sostener contenido, motion, rutas y crecimiento futuro."],
    ["Sistema de motion", "Transiciones y reveals escenificados que marcan comportamiento en vez de decorarlo."],
    ["Capa atmosferica / WebGL", "Logica stage y campos media anadidos solo cuando la presencia fortalece el trabajo."],
    ["Responsive + accesibilidad", "Layouts, controles, contraste y estados legibles en viewports reales."],
    ["Deploy + QA", "Build checks, pases responsive, metadata y revision de launch antes de publicar."],
    ["Documentacion / handoff", "Notas claras y logica reutilizable para que el sistema siga siendo comprensible."],
  ];
}

function getMobileMethodLedger(locale: LocaleCode) {
  if (locale !== "es") return mobileMethodLedger;

  return [
    ["01", "Senal", "Definir que debe comunicarse."],
    ["02", "Estructura", "Organizar ruta, contenido, jerarquia y logica de interaccion."],
    ["03", "Atmosfera", "Dar forma a clima visual, ritmo de motion, media y tono."],
    ["04", "Interfaz", "Construir la superficie responsive con estados claros."],
    ["05", "Memoria", "Dejar prueba, continuidad, logica reutilizable y huella de proyecto."],
  ];
}

function getMobileTechnicalLedger(locale: LocaleCode) {
  if (locale !== "es") return mobileTechnicalLedger;

  return [
    ["01", "Arquitectura front-end", "Estructura reutilizable para contenido, motion, rutas y crecimiento."],
    ["02", "Sistema de motion", "Transiciones y reveals que marcan comportamiento, no decoracion."],
    ["03", "Responsive + accesibilidad", "Layouts, controles, contraste y estados legibles en viewports reales."],
    ["04", "QA de produccion", "Build checks, rutas, readiness de deploy y claridad de handoff."],
  ];
}

function getPrinciples(locale: LocaleCode) {
  if (locale !== "es") return principles;

  return [
    "El motion no es decoracion. Marca estado.",
    "El media no es relleno. Actua como prueba.",
    "WebGL no es un truco. Se convierte en stage.",
    "La claridad importa mas que el ruido.",
    "La calidad de produccion importa tanto como la direccion visual.",
  ];
}

function AboutV2Meta({ noIndex }: { noIndex: boolean }) {
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.createElement("meta");

    if (noIndex) {
      meta.setAttribute("name", "robots");
      meta.setAttribute("content", "noindex, nofollow");
      if (!existing) document.head.appendChild(meta);
    }

    return () => {
      if (!noIndex) return;

      if (existing && previousContent !== null) {
        existing.setAttribute("content", previousContent);
        return;
      }

      if (!existing) meta.remove();
    };
  }, [noIndex]);

  return null;
}

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${light ? "text-white/48" : "text-neutral-500"}`}>
      {children}
    </div>
  );
}

function useActiveMethodItem() {
  const [activeId, setActiveId] = useState(methodItems[0].id);

  useEffect(() => {
    const elements = methodItems
      .map((item) => document.getElementById(`method-${item.id}`))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const next = visible[0]?.target.getAttribute("data-method-id");
        if (next) setActiveId(next);
      },
      {
        root: null,
        rootMargin: "-30% 0px -48% 0px",
        threshold: [0.12, 0.24, 0.42, 0.62],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return activeId;
}

function MethodSignalSpine() {
  const { locale } = useI18n();
  const ui = getAboutUi(locale);
  const localizedMethodItems = getMethodItems(locale);
  const activeId = useActiveMethodItem();
  const sound = useSound();

  return (
    <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <SectionLabel>{ui.methodLabel}</SectionLabel>
        <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] text-neutral-950 sm:text-[76px]">
          {ui.methodTitle}
        </h2>
        <p className="mt-7 max-w-[30rem] text-[15px] leading-7 text-neutral-600">
          {ui.methodBody}
        </p>

        <div className="mt-9 hidden border-y border-neutral-950/12 py-4 lg:grid">
          {localizedMethodItems.map((item) => {
            const active = activeId === item.id;

            return (
              <div key={item.id} className="grid grid-cols-[3.5rem_1fr] items-center gap-4 py-2">
                <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${active ? "text-neutral-950" : "text-neutral-300"}`}>
                  {item.index}
                </span>
                <span className={`text-[13px] uppercase tracking-[0.13em] transition ${active ? "text-neutral-950" : "text-neutral-400"}`}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden border-y border-neutral-950/14 bg-white/22">
        <div className="pointer-events-none absolute left-[2.1rem] top-0 h-full w-px bg-neutral-950/12 sm:left-[4.6rem]" />
        {localizedMethodItems.map((item, index) => {
          const active = activeId === item.id;

          return (
            <motion.article
              id={`method-${item.id}`}
              data-method-id={item.id}
              key={item.id}
              tabIndex={0}
              onMouseEnter={() => sound.playRole("hover")}
              onFocus={() => sound.playRole("hover")}
              className={`group relative grid gap-4 border-b border-neutral-950/10 px-4 py-8 transition duration-300 last:border-b-0 hover:bg-white/28 focus:bg-white/36 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 sm:grid-cols-[5rem_1fr] sm:px-6 lg:min-h-[220px] lg:items-center ${
                active ? "bg-white/24" : ""
              }`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.52, delay: index * 0.035, ease }}
            >
              <div className="pointer-events-none absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-neutral-950/30 transition duration-500 group-hover:scale-y-100 group-focus:scale-y-100" />
              <div className="relative flex items-center gap-4">
                <motion.span
                  className="relative z-10 h-3 w-3 rounded-full border border-neutral-950 bg-[#f3f0e9] shadow-[0_0_0_0_rgba(17,17,17,0)] group-hover:shadow-[0_0_0_6px_rgba(17,17,17,0.06)]"
                  animate={{ scale: active ? [1.2, 1.42, 1.2] : 1, backgroundColor: active ? "#111111" : "#f3f0e9" }}
                  transition={{ duration: active ? 2.4 : 0.28, repeat: active ? Infinity : 0, ease: "easeInOut" }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{item.index}</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[15rem_1fr] lg:items-start">
                <h3 className="text-[34px] font-normal leading-none tracking-[-0.04em] text-neutral-950 sm:text-[48px]">
                  {item.title}
                </h3>
                <p className="max-w-[42rem] text-[15px] leading-7 text-neutral-600">{item.text}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function useDesktopAboutLayout() {
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

function MobileAboutHero({
  onOpenProject,
  onViewWork,
  onExploreImmersive,
}: {
  onOpenProject: () => void;
  onViewWork: () => void;
  onExploreImmersive: () => void;
}) {
  const { locale } = useI18n();
  const ui = getAboutUi(locale);

  return (
    <section
      id="about-threshold"
      data-header-scene="about-threshold"
      data-sound-safe-area
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-y border-neutral-950/12 px-[var(--mobile-page-x)] pb-9 pt-8"
    >
      <SectionLabel>{ui.mobileStudioPosition}</SectionLabel>
      <h1 className="mt-7 max-w-[10ch] text-[58px] font-normal leading-[0.9] tracking-[-0.055em] text-neutral-950">
        {ui.mobileHeroTitle}
      </h1>
      <p className="mt-7 max-w-[21rem] text-[17px] leading-7 text-neutral-600">
        {ui.mobileHeroBody}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onViewWork}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
        >
          {ui.viewWork}
        </button>
        <button
          type="button"
          onClick={onExploreImmersive}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white/54 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700"
        >
          {ui.exploreImmersive}
        </button>
        <button
          type="button"
          onClick={onOpenProject}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white/24 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700"
        >
          {ui.startProject}
        </button>
      </div>
    </section>
  );
}

function MobileAboutMethod() {
  const { locale } = useI18n();
  const ui = getAboutUi(locale);
  const localizedMobileMethodLedger = getMobileMethodLedger(locale);
  const methodTitleParts = ui.methodTitle.split(". ");

  return (
    <section
      id="about-method"
      data-header-scene="about-method"
      className="mobile-about-method relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] pb-14 pt-12"
    >
      <SectionLabel>{ui.mobileMethodLabel}</SectionLabel>
      <h2 className="mobile-about-method__heading mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.95] tracking-[-0.045em] text-neutral-950">
        <span>{methodTitleParts[0]}.</span>
        <span>{methodTitleParts[1] ?? ""}</span>
      </h2>
      <p className="mobile-about-method__summary mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        {ui.methodFormula}
      </p>

      <div data-sound-safe-area className="mobile-about-method__spine mt-8">
        {localizedMobileMethodLedger.map(([index, title, text], itemIndex) => (
          <MobileMotionLedgerRow
            key={title}
            className="mobile-about-method__row relative grid grid-cols-[3.5rem_1fr] gap-4 py-4"
            style={{ "--method-row-index": itemIndex } as CSSProperties}
          >
            <span aria-hidden="true" className="mobile-about-method__line" />
            <div className="mobile-about-method__index font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              <span aria-hidden="true" className="mobile-about-method__dot" />
              <span>{index}</span>
            </div>
            <div className="mobile-about-method__copy">
              <div className="mobile-about-method__title text-[22px] leading-none text-neutral-950">{title}</div>
              <p className="mobile-about-method__text mt-2 max-w-[18rem] text-[14px] leading-6 text-neutral-500">{text}</p>
            </div>
          </MobileMotionLedgerRow>
        ))}
      </div>
    </section>
  );
}

function MobileAboutTechnical() {
  const { locale } = useI18n();
  const ui = getAboutUi(locale);
  const localizedMobileTechnicalLedger = getMobileTechnicalLedger(locale);

  return (
    <section
      id="about-technical"
      data-header-scene="about-technical"
      className="mobile-about-technical relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] pb-14 pt-12"
    >
      <SectionLabel>{ui.mobileTechnicalLabel}</SectionLabel>
      <h2 className="mobile-about-technical__heading mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.95] tracking-[-0.045em] text-neutral-950">
        {ui.technicalTitleParts.map((part) => <span key={part}>{part}</span>)}
      </h2>
      <p className="mobile-about-technical__summary mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        {ui.mobileTechnicalBody}
      </p>

      <div data-sound-safe-area className="mobile-about-technical__stack mt-8">
        {localizedMobileTechnicalLedger.map(([index, title, text], itemIndex) => (
          <MobileMotionLedgerRow
            key={title}
            className="mobile-about-technical__row relative grid grid-cols-[3.5rem_1fr] gap-4 py-4"
            style={{ "--technical-row-index": itemIndex } as CSSProperties}
          >
            <span aria-hidden="true" className="mobile-about-technical__beam" />
            <div className="mobile-about-technical__index font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              {index}
            </div>
            <div className="mobile-about-technical__copy">
              <div className="mobile-about-technical__title max-w-[18rem] text-[16px] uppercase leading-6 tracking-[0.1em] text-neutral-950">
                {title}
              </div>
              <p className="mobile-about-technical__text mt-2 max-w-[18rem] text-[14px] leading-6 text-neutral-500">{text}</p>
            </div>
            <span aria-hidden="true" className="mobile-about-technical__load" />
          </MobileMotionLedgerRow>
        ))}
      </div>

      <p className="mobile-about-technical__note mt-5 max-w-[21rem] pb-5 text-[14px] leading-6 text-neutral-500">
        {ui.technicalNote}
      </p>
    </section>
  );
}

function MobileAboutPracticePosition() {
  const { locale } = useI18n();
  const ui = getAboutUi(locale);

  return (
    <section
      id="about-authorial"
      data-header-scene="about-closing"
      data-sound-safe-area
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] pb-14 pt-12"
    >
      <SectionLabel>{ui.mobileAuthorialLabel}</SectionLabel>
      <h2 className="mt-5 max-w-[11ch] text-[50px] font-normal leading-[0.95] tracking-[-0.045em] text-neutral-950">
        {ui.authorialTitle}
      </h2>
      <div className="mt-8 border-l border-neutral-950/24 bg-white/24 py-6 pl-5">
        <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
          <span>{ui.humanSignal}</span>
        </div>
        <p className="max-w-[22rem] text-[18px] leading-8 text-neutral-700">
          {ui.authorialBody}
        </p>
      </div>
    </section>
  );
}

function MobileAboutPrinciples() {
  const { locale } = useI18n();
  const ui = getAboutUi(locale);
  const localizedPrinciples = getPrinciples(locale);

  return (
    <section
      id="about-principles"
      data-header-scene="about-principles"
      className="relative z-10 mx-auto w-[min(100%,44rem)] px-[var(--mobile-page-x)] pb-12 pt-12"
    >
      <div
        data-sound-safe-area
        className="relative overflow-hidden bg-[rgb(12,12,12)] px-5 py-7 text-white shadow-[0_36px_120px_rgba(0,0,0,0.2)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="pointer-events-none absolute -right-[36%] top-[4%] h-[28rem] w-[28rem] rounded-full border border-white/[0.07]" />
        <div className="relative">
          <SectionLabel light>{ui.mobilePrinciplesLabel}</SectionLabel>
          <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.9] tracking-[-0.055em]">
            {ui.principlesTitle}
          </h2>

          <div data-sound-safe-area className="mt-7 border-y border-white/14 pb-5">
            {localizedPrinciples.map((principle, index) => (
              <MobileMotionLedgerRow key={principle} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-white/10 py-3.5 last:border-b-0">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/26" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="text-[22px] leading-[1.15] tracking-[-0.025em] text-white/86">{principle}</div>
              </MobileMotionLedgerRow>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileAboutLayout({
  onOpenProject,
  onViewWork,
  onExploreImmersive,
}: {
  onOpenProject: () => void;
  onViewWork: () => void;
  onExploreImmersive: () => void;
}) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip lg:hidden">
      <MobileMotionSection variant="threshold">
        <MobileAboutHero onOpenProject={onOpenProject} onViewWork={onViewWork} onExploreImmersive={onExploreImmersive} />
      </MobileMotionSection>
      <MobileMotionSection variant="ledger" delay="soft">
        <MobileAboutMethod />
      </MobileMotionSection>
      <MobileMotionSection variant="ledger" delay="soft">
        <MobileAboutTechnical />
      </MobileMotionSection>
      <MobileMotionSection variant="media" delay="soft">
        <MobileAboutPracticePosition />
      </MobileMotionSection>
      <MobileMotionSection variant="dark" delay="soft">
        <MobileAboutPrinciples />
      </MobileMotionSection>
    </div>
  );
}

export default function AboutV2({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const copy = locale === "es" ? spanishCorePageContent.about : undefined;
  const ui = getAboutUi(locale);
  const localizedPracticeLayers = getPracticeLayers(locale);
  const localizedTechnicalLedger = getTechnicalLedger(locale);
  const localizedPrinciples = getPrinciples(locale);
  const activeSectionId = useSectionRailActive(ui.railItems);
  const { playRole, setScene, stopAmbient } = useSound();
  const desktopLayout = useDesktopAboutLayout();

  useEffect(() => {
    setScene("studio");
    stopAmbient();
  }, [setScene, stopAmbient]);

  const goTo = (path: string) => {
    playRole(path === "/immersive" ? "open" : "select");
    startSpaPageTransition(navigate, getLocalizedPath(path, locale), () => {
      onCloseProject?.();
    });
  };

  const openProjectWithSound = () => {
    playRole("open");
    onOpenProject?.();
  };

  return (
    <>
      <AboutV2Meta noIndex={noIndex} />
      <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />

      <PageSurface className="tablet-reader-surface relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
        <AtmosphericSiteShell preset="practice" />
        <SectionRail
          items={ui.railItems}
          activeId={activeSectionId}
          onSelect={scrollToRailSection}
          label={ui.railLabel}
        />

        <main className="relative z-10 pt-20 lg:pt-24">
          {desktopLayout ? (
            <>
          <section
            id="about-threshold"
            data-header-scene="about-threshold"
            data-sound-safe-area
            className="mx-auto grid min-h-[calc(100vh-5rem)] w-[min(94vw,1640px)] gap-12 border-y border-neutral-950/14 py-12 md:py-16 lg:grid-cols-[0.48fr_0.52fr] lg:items-center lg:py-14"
          >
            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease }}
            >
              <SectionLabel>{ui.studioPosition}</SectionLabel>
              <h1 className="mt-6 max-w-[10ch] text-[46px] font-normal leading-[0.92] tracking-[-0.055em] text-neutral-950 sm:max-w-[13ch] sm:text-[76px] sm:leading-[0.9] sm:tracking-[-0.06em] lg:text-[74px] xl:text-[78px] 2xl:text-[100px]">
                {copy?.title ?? "I build interface systems for premium web, product surfaces, and immersive digital experiences."}
              </h1>
              <p className="mt-6 max-w-[34ch] text-[16px] leading-7 text-neutral-600 sm:max-w-[43rem] sm:text-[17px]">
                {copy?.body ??
                  "Brenych Studio is an independent creative development practice focused on premium front-end systems, interactive storytelling, multilingual websites, WebGL stages, and spatial interface research."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
                  onClick={() => goTo("/work")}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  {copy?.ctas?.[0] ?? "View work"} -&gt;
                </button>
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
                  onClick={() => goTo("/immersive")}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-white/56 px-5 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {copy?.ctas?.[1] ?? "Explore immersive"} -&gt;
                </button>
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
                  onClick={openProjectWithSound}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-transparent px-5 text-[11px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-950/40 hover:text-neutral-950"
                >
                  {copy?.ctas?.[2] ?? "Start a project"}
                </button>
              </div>
            </motion.div>

            <AboutPracticeField />
          </section>

          <section id="about-practice" data-header-scene="about-practice" className="mx-auto w-[min(94vw,1640px)] py-20 lg:py-28">
            <div className="grid gap-12 border-y border-neutral-950/14 py-10 lg:grid-cols-[0.36fr_0.64fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionLabel>{ui.practiceLayersLabel}</SectionLabel>
                <h2 className="mt-5 max-w-[10ch] text-[50px] font-normal leading-[0.92] tracking-[-0.045em] text-neutral-950 sm:text-[76px]">
                  {ui.practiceLayersTitle}
                </h2>
                <p className="mt-7 max-w-[30rem] text-[15px] leading-7 text-neutral-600">
                  {ui.practiceLayersBody}
                </p>
              </div>

              <div>
                <div className="relative grid gap-0 border-y border-neutral-950/12 lg:grid-cols-2">
                  <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-neutral-950/12 lg:block" />
                  <div className="pointer-events-none absolute left-[8%] top-1/2 hidden h-px w-[84%] bg-gradient-to-r from-transparent via-neutral-950/24 to-transparent lg:block" />
                  {localizedPracticeLayers.map((layer, index) => (
                    <motion.article
                      key={layer.label}
                      onMouseEnter={() => playRole("hover")}
                      className="group relative min-h-[18rem] border-b border-neutral-950/10 p-5 transition duration-300 hover:bg-white/24 last:border-b-0 lg:min-h-[28rem] lg:border-b-0 lg:p-8"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.52, delay: index * 0.06, ease }}
                    >
                      <div className="pointer-events-none absolute inset-x-6 top-6 h-px origin-left scale-x-0 bg-neutral-950/24 transition duration-500 group-hover:scale-x-100" />
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-12 max-w-[10ch] text-[42px] font-normal leading-[0.94] tracking-[-0.045em] text-neutral-950 sm:text-[62px]">
                        {layer.label}
                      </h3>
                      <p className="mt-7 max-w-[30rem] text-[15px] leading-7 text-neutral-600">{layer.text}</p>
                      <div className="mt-7 flex flex-wrap gap-2">
                        {layer.signals.map((signal) => (
                          <span key={signal} className="border-y border-neutral-950/12 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500">
                            {signal}
                          </span>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="about-method" data-header-scene="about-method" className="mx-auto w-[min(94vw,1640px)] pb-20 lg:pb-28">
            <MethodSignalSpine />
          </section>

          <section id="about-technical" data-header-scene="about-technical" className="mx-auto w-[min(94vw,1640px)] pb-24 lg:pb-32">
            <div className="grid gap-12 border-y border-neutral-950/14 py-12 lg:grid-cols-[0.34fr_0.66fr] lg:py-14">
              <div>
                <SectionLabel>{ui.technicalLabel}</SectionLabel>
                <h2 className="mt-5 max-w-[9ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] text-neutral-950 sm:text-[76px]">
                  {ui.technicalTitle}
                </h2>
                <p className="mt-7 max-w-[30rem] text-[15px] leading-7 text-neutral-600">
                  {ui.technicalBody}
                </p>
              </div>

              <div className="relative border-y border-neutral-950/10 py-2">
                <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-neutral-950/12 to-transparent md:block" />
                {localizedTechnicalLedger.map(([label, text], index) => (
                  <motion.div
                    key={label}
                    tabIndex={0}
                    className="group relative grid gap-5 border-b border-neutral-950/[0.075] px-3 py-7 transition duration-300 last:border-b-0 hover:bg-white/28 focus:bg-white/34 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 md:grid-cols-[3.5rem_minmax(12rem,17rem)_1fr] md:items-start md:px-6"
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.46, delay: index * 0.03, ease }}
                  >
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                      <span className="h-2 w-2 rounded-full border border-neutral-950/18 bg-[#f3f0e9] transition duration-300 group-hover:border-neutral-950/42 group-hover:bg-neutral-950" />
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="text-[18px] uppercase leading-6 tracking-[0.09em] text-neutral-950 md:text-[19px]">{label}</div>
                    <p className="max-w-[44rem] text-[16px] leading-8 text-neutral-600">{text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="about-authorial" data-header-scene="about-closing" className="mx-auto w-[min(94vw,1640px)] pb-24 lg:pb-36">
            <div className="relative grid gap-12 overflow-hidden border-y border-neutral-950/14 py-16 lg:grid-cols-[0.38fr_0.62fr] lg:items-center lg:py-20">
              <div className="pointer-events-none absolute right-[8%] top-[10%] h-[32rem] w-[32rem] rounded-full border border-neutral-950/[0.055]" />
              <div className="pointer-events-none absolute right-[18%] top-[22%] h-[20rem] w-[20rem] rounded-full border border-neutral-950/[0.04]" />
              <div className="pointer-events-none absolute left-[28%] bottom-[16%] h-px w-[54%] rotate-[-9deg] bg-gradient-to-r from-transparent via-neutral-950/16 to-transparent" />
              <div>
                <SectionLabel>{ui.authorialLabel}</SectionLabel>
                <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] text-neutral-950 sm:text-[78px]">
                  {ui.authorialTitle}
                </h2>
              </div>

              <div className="relative border-l border-neutral-950/30 bg-white/24 py-9 pl-6 shadow-[0_28px_90px_rgba(20,20,20,0.035)] sm:pl-9 lg:py-14">
                <div className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                  <span>{ui.humanSignal}</span>
                </div>
                <p className="max-w-[54rem] text-[24px] leading-[1.42] tracking-[-0.018em] text-neutral-700 sm:text-[32px]">
                  {ui.authorialBody}
                </p>
              </div>
            </div>
          </section>

          <section id="about-principles" data-header-scene="about-principles" className="mx-auto w-[min(94vw,1640px)] pb-20 lg:pb-32">
            <div className="relative overflow-hidden border border-white/10 bg-[rgb(12,12,12)] p-6 text-white shadow-[0_48px_180px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_20%_84%,rgba(255,255,255,0.075),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.085),transparent_48%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.085] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px]" />
              <div className="pointer-events-none absolute -right-[8%] top-[4%] h-[36rem] w-[36rem] rounded-full border border-white/[0.07]" />
              <div className="pointer-events-none absolute right-[18%] top-[22%] h-[22rem] w-[22rem] rounded-full border border-white/[0.055]" />
              <div className="pointer-events-none absolute left-[10%] bottom-[18%] h-px w-[76%] rotate-[-7deg] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              <div className="pointer-events-none absolute left-[24%] top-[22%] h-px w-[68%] rotate-[5deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
                <div className="flex flex-col justify-between gap-10">
                  <div>
                    <SectionLabel light>{ui.principlesLabel}</SectionLabel>
                  <h2 className="mt-5 max-w-[10ch] text-[54px] font-normal leading-[0.9] tracking-[-0.055em] sm:text-[84px]">
                    {ui.principlesTitle}
                  </h2>
                  </div>
                  <div className="flex w-fit items-center gap-3 border-y border-white/14 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/48">
                    <span className="relative h-2 w-2 rounded-full bg-white">
                      <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
                    </span>
                    <span>{ui.methodSignal}</span>
                  </div>
                </div>

                <div className="border-y border-white/14">
                  {localizedPrinciples.map((principle, index) => (
                    <motion.div
                      key={principle}
                      tabIndex={0}
                      onMouseEnter={() => playRole("hover")}
                      onFocus={() => playRole("hover")}
                      className="group relative grid gap-5 border-b border-white/10 px-3 py-6 transition duration-300 last:border-b-0 hover:bg-white/[0.045] focus:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 md:grid-cols-[4rem_1fr] md:py-7"
                      transition={{ duration: 0.28, delay: index * 0.02, ease }}
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-white/26 transition duration-500 group-hover:scale-x-100 group-focus:scale-x-100" />
                      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/18 transition duration-300 group-hover:bg-white group-focus:bg-white" />
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="text-[29px] font-normal leading-[1.04] tracking-[-0.04em] text-white/86 transition duration-300 group-hover:text-white group-focus:text-white sm:text-[40px]">
                        {principle}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
            </>
          ) : (
            <MobileAboutLayout
              onOpenProject={openProjectWithSound}
              onViewWork={() => goTo("/work")}
              onExploreImmersive={() => goTo("/immersive")}
            />
          )}
        </main>

        <SiteFooterV2 onOpenProject={onOpenProject} variant="studio" />
      </PageSurface>
    </>
  );
}
