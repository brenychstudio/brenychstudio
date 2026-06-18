import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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
import { spanishCorePageContent, type CorePageTranslation } from "../data/spanishContent";
import { getLocalizedPath, useI18n, type LocaleCode } from "../i18n";

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

const focusedEntryRoutes = [
  { label: "Premium landing page", to: "/services/premium-landing-page" },
  { label: "Product demo landing", to: "/services/product-demo-landing" },
  { label: "Interactive web system", to: "/services/interactive-web-systems" },
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

const offerRailItems: SectionRailItem[] = [
  { index: "01", label: "Threshold", id: "offer-threshold" },
  { index: "02", label: "Systems", id: "offer-systems" },
  { index: "03", label: "Architecture", id: "engagement-model" },
  { index: "04", label: "Delivery", id: "offer-delivery" },
  { index: "05", label: "Formats", id: "offer-formats" },
  { index: "06", label: "Output", id: "offer-output" },
];

function getOfferUi(locale: LocaleCode) {
  const isSpanish = locale === "es";

  return {
    railItems: isSpanish
      ? [
          { index: "01", label: "Umbral", id: "offer-threshold" },
          { index: "02", label: "Sistemas", id: "offer-systems" },
          { index: "03", label: "Arquitectura", id: "engagement-model" },
          { index: "04", label: "Entrega", id: "offer-delivery" },
          { index: "05", label: "Formatos", id: "offer-formats" },
          { index: "06", label: "Output", id: "offer-output" },
        ]
      : offerRailItems,
    railLabel: isSpanish ? "Secciones de oferta" : "Offer sections",
    focusedEntryRoutes: isSpanish ? "Rutas de entrada enfocadas" : "Focused entry routes",
    thresholdLabel: isSpanish ? "Umbral comercial / Oferta V2" : "Commercial Threshold / Offer V2",
    liveSignal: isSpanish ? "Senal de oferta en vivo" : "Live offer signal",
    commercialSurface: isSpanish ? "superficie comercial" : "commercial surface",
    activeLayer: isSpanish ? "capa activa" : "active layer",
    activeRoute: isSpanish ? "ruta" : "route",
    exploreSystems: isSpanish ? "Explorar sistemas" : "Explore systems",
    heroSignals: isSpanish
      ? ["Traduccion comercial", "Arquitectura de sistema", "Entrega de produccion"]
      : ["Commercial translation", "System architecture", "Production delivery"],
    whatIBuild: isSpanish ? "01 / Que construyo" : "01 / What I build",
    commercialSystemSurface: isSpanish ? "Superficie de sistema comercial." : "Commercial system surface.",
    commercialSystemBody: isSpanish
      ? "No son servicios genericos. Cada formato es un sistema de interfaz comercial con rol, audiencia y resultado claros."
      : "Not generic services. Each format is a commercial interface system with a clear role, audience, and result.",
    selectedFormat: isSpanish ? "Formato seleccionado" : "Selected format",
    forLabel: isSpanish ? "Para" : "For",
    resultLabel: isSpanish ? "Resultado" : "Result",
    coreLayers: isSpanish ? "Capas core" : "Core layers",
    optionalLayers: isSpanish ? "Capas opcionales" : "Optional layers",
    addWhenUseful: isSpanish ? "Anadir cuando aporta" : "Add when useful",
    serviceArchitecture: isSpanish ? "02 / Arquitectura de servicio" : "02 / Service Architecture",
    notAPage: isSpanish ? "No una pagina. Un sistema." : "Not a page. A system.",
    serviceArchitectureBody: isSpanish
      ? "La superficie comercial se construye desde cinco capas core. Las capas multilingue e inmersiva quedan disponibles cuando el proyecto realmente las necesita."
      : "The commercial surface is built from five core layers. Multilingual and immersive layers stay available when the project genuinely needs them.",
    engagementModel: isSpanish ? "03 / Modelo de trabajo" : "03 / Engagement Model",
    builtThroughStages: isSpanish ? "Construido por etapas claras." : "Built through clear stages.",
    engagementBody: isSpanish
      ? "Cada proyecto pasa del concepto comercial a arquitectura de interfaz, direccion visual, comportamiento de motion y entrega front-end de produccion."
      : "Each project moves from commercial concept into interface architecture, visual direction, motion behavior, and production front-end delivery.",
    openInterface: isSpanish ? "Abrir interfaz ->" : "Open interface ->",
    waysToBegin: isSpanish ? "04 / Formas de empezar" : "04 / Ways to Begin",
    chooseEntry: isSpanish ? "Elige el punto de entrada correcto." : "Choose the right entry point.",
    primaryEntryPoints: isSpanish ? "Entradas principales" : "Primary entry points",
    primaryEntryNote: isSpanish ? "Las formas mas habituales de empezar." : "Most common ways to begin.",
    secondaryDirections: isSpanish ? "Direcciones secundarias" : "Secondary directions",
    secondaryNote: isSpanish ? "Prueba especializada, prototipo o direccion." : "Specialized proof, prototype, or direction work.",
    best: isSpanish ? "Mejor" : "Best",
    output: isSpanish ? "Output" : "Output",
    availabilityNote: isSpanish
      ? "Disponibilidad no significa revender al instante el proyecto existente tal cual. Cada adaptacion se encarga y se personaliza para la marca, contenido, audiencia, mercado y requisitos de despliegue del cliente."
      : "Availability does not mean instant resale of the existing project as-is. Each adaptation is commissioned and customized for the client's brand, content, audience, market, and deployment requirements.",
    whatYouReceive: isSpanish ? "05 / Lo que recibes" : "05 / What You Receive",
    usableSystem: isSpanish ? "Un sistema comercial usable." : "A usable commercial system.",
    includedInEveryRoute: isSpanish ? "Incluido en cada ruta" : "Included in every route",
    items: isSpanish ? "items" : "items",
    routeSelector: isSpanish ? "02 / Selector de ruta" : "02 / Route selector",
    routeSelectorBody: isSpanish
      ? "La mayoria de proyectos empieza desde una de estas rutas. Abre solo la ruta mas cercana a la necesidad."
      : "Most projects start from one of these routes. Open only the route that feels closest to the need.",
    secondaryRoutes: isSpanish ? "Rutas secundarias" : "Secondary routes",
    secondaryCaption: isSpanish ? "Inmersivo / Adaptacion / Direccion" : "Immersive / Adaptation / Direction",
    hideRoutes: isSpanish ? "Ocultar rutas" : "Hide routes",
    show03: isSpanish ? "Mostrar 03 ->" : "Show 03 ->",
    howProjectMoves: isSpanish ? "03 / Como avanza el proyecto" : "03 / How the project moves",
    deliveryBody: isSpanish
      ? "La ruta pasa de direccion comercial a un sistema de interfaz visible, luego a produccion y lanzamiento."
      : "The route moves from commercial direction into a visible interface system, then into production and launch.",
    productionReadyInterface: isSpanish ? "Interfaz comercial lista para produccion." : "Production-ready commercial interface.",
  };
}

function getHeroObjectLayers(locale: LocaleCode) {
  if (locale !== "es") return heroObjectLayers;

  return [
    {
      title: "Tesis comercial",
      signal: "estrategia",
      text: "Forma de oferta, presion de audiencia, claims de prueba e intencion de conversion se vuelven la primera capa estructural.",
    },
    {
      title: "Columna de interfaz",
      signal: "arquitectura",
      text: "La pagina se convierte en una secuencia de rooms: umbral, prueba, modelo de servicio, entrega, formatos y output.",
    },
    {
      title: "Superficie cinematica",
      signal: "visual / motion",
      text: "Tipografia, ritmo de imagen, estados de motion y feedback de interaccion hacen que la oferta se sienta autoral.",
    },
    {
      title: "Ruta de produccion",
      signal: "entrega",
      text: "El concepto aterriza como sistema React responsive con QA, logica de deploy y claridad de handoff.",
    },
  ];
}

function getOfferSignalLine(locale: LocaleCode) {
  return locale === "es" ? "Leyendo senal de oferta: audiencia -> prueba -> ruta." : offerSignalLine;
}

function getOfferSignalFollowUp(locale: LocaleCode) {
  if (locale !== "es") return offerSignalFollowUp;

  return [
    "El servicio expone su logica de trabajo.",
    "Cada proyecto se abre como etapas visibles, claims, estados de motion y ruta de entrega.",
  ];
}

function getBuildSystems(locale: LocaleCode): BuildSystem[] {
  if (locale !== "es") return buildSystems;

  return [
    {
      title: "Websites premium",
      signal: "Superficie publica editorial",
      what: "Sitios editoriales que organizan oferta, prueba, ritmo media y ruta de conversion en una superficie premium clara.",
      forWhom: "Marcas, estudios, founders, hospitality, advisory, cultura y negocios liderados por servicio.",
      result: "Una superficie publica clara que explica la oferta, construye confianza y se siente autoral en vez de generica.",
      focus: ["Jerarquia de oferta", "Ritmo de prueba", "Conversion calmada"],
    },
    {
      title: "Superficies interactivas de producto",
      signal: "Logica de producto visible",
      what: "Demos de producto e interfaces workflow que hacen comprensibles la logica, los estados y las decisiones mediante interaccion.",
      forWhom: "Productos, operadores, herramientas internas, startups, sistemas creator y prototipos comerciales.",
      result: "Una capa de interfaz funcional que convierte logica de producto en estados, flujos y decisiones visibles.",
      focus: ["Estados demo", "Flujos guiados", "Claridad de decision"],
    },
    {
      title: "Sistemas front-end multilingues",
      signal: "Un sistema entre idiomas",
      what: "Sistemas web sensibles al idioma con secciones repetibles, UI segura por locale y estructura de contenido que viaja con claridad.",
      forWhom: "Servicios internacionales, property, hospitality, lanzamientos de producto y sistemas de marca cross-market.",
      result: "Una estructura front-end que soporta mas de un idioma sin perder ritmo ni claridad.",
      focus: ["UI segura por locale", "Secciones repetibles", "Ritmo cross-market"],
    },
    {
      title: "Prototipos inmersivos",
      signal: "Prueba de futuro controlada",
      what: "Prototipos WebGL, espaciales, WebXR o cinematicos contenidos y conectados con un objetivo comercial o cultural real.",
      forWhom: "Marcas, creadores, instituciones, exhibiciones, historias de producto y experiencias digitales de futuro.",
      result: "Un prototipo controlado que muestra la siguiente capa de interfaz sin convertir el proyecto en caos.",
      focus: ["WebGL / espacial", "Objeto cinematico", "Scope prototipo"],
    },
    {
      title: "Direccion creative technology",
      signal: "Mejor build antes de producir",
      what: "Concepto, arquitectura de interfaz, gramatica de motion, direccion de prototipo y guia de produccion antes o durante un build exigente.",
      forWhom: "Equipos que necesitan direccion digital senior antes de construir, durante un redesign o alrededor de un launch principal.",
      result: "Un modelo claro de que construir, por que importa y como debe comportarse el sistema.",
      focus: ["Modelo conceptual", "Gramatica de motion", "Guia de produccion"],
    },
  ];
}

function getCoreSystemLayers(locale: LocaleCode) {
  if (locale !== "es") return coreSystemLayers;

  return [
    ["Estrategia", "Forma de oferta, logica de audiencia, jerarquia de prueba, prioridades del proyecto y claridad comercial."],
    ["Arquitectura de interfaz", "Modelo de pagina, sistema de secciones, journeys, rutas de decision y estados de interaccion."],
    ["Sistema visual", "Tipografia, ritmo de layout, tratamiento media, jerarquia y lenguaje de superficie premium."],
    ["Gramatica de motion", "Transiciones, logica de reveal, estados de feedback y comportamientos firma que explican estructura."],
    ["Entrega front-end", "Build React listo para produccion, implementacion responsive, QA y estructura preparada para deploy."],
  ];
}

function getOptionalSystemLayers(locale: LocaleCode) {
  if (locale !== "es") return optionalSystemLayers;

  return [
    ["Capa multilingue", "Estructura de idioma, contenido preparado para traduccion, UI locale-aware y logica de presentacion internacional."],
    ["Extension inmersiva", "Capa opcional WebGL, prototipo espacial, objeto cinematico o experiencia future-facing."],
  ];
}

function getDeliveryStages(locale: LocaleCode): DeliveryStage[] {
  if (locale !== "es") return deliveryStages;

  return [
    {
      label: "01",
      title: "Concepto",
      text: "Definir tesis comercial, audiencia, claims de prueba, referencias, restricciones y forma de la oferta.",
      output: "Direccion de proyecto y mapa de prioridades",
    },
    {
      label: "02",
      title: "Direccion visual",
      text: "Traducir la oferta a lenguaje de interfaz: jerarquia, ritmo media, tipografia, composicion y tono de motion.",
      output: "Direccion de superficie aprobada",
    },
    {
      label: "03",
      title: "Build front-end",
      text: "Construir la interfaz React responsive con logica de secciones, estados, motion y estructura lista para produccion.",
      output: "Sistema front-end funcional",
    },
    {
      label: "04",
      title: "QA / Launch",
      text: "Revisar responsive, ritmo de contenido, estados de interaccion, metadata base, riesgos de performance y readiness.",
      output: "Entrega lista para launch",
    },
    {
      label: "05",
      title: "Soporte / Handoff",
      text: "Preparar notas de handoff, aclarar mantenimiento, apoyar ajustes de launch y dejar el sistema comprensible.",
      output: "Capa de handoff y soporte",
    },
  ];
}

function getFormats(locale: LocaleCode): Format[] {
  if (locale !== "es") return formats;

  return [
    {
      title: "Adaptacion de sistema disponible",
      description: "Adaptar una direccion existente de Brenych Studio a una web, superficie de producto o sistema de campana listo para produccion.",
      bestFor: "Clientes que ya ven una direccion cercana y quieren avanzar mas rapido.",
      output: "Sistema visual adaptado, contenido del cliente, front-end responsive y build listo para deploy.",
    },
    {
      title: "Landing Sprint",
      description: "Una superficie comercial enfocada para producto, servicio, waitlist, lanzamiento u oferta de alta confianza.",
      bestFor: "Una oferta clara que necesita presentacion premium rapidamente.",
      output: "Sistema landing listo para produccion con pulido responsive y logica de CTA.",
    },
    {
      title: "Micro-site",
      description: "Una superficie compacta multi-seccion o multi-pagina para campana, estudio, servicio o archivo de prueba.",
      bestFor: "Proyectos que necesitan mas estructura que una landing page.",
      output: "Sistema editorial claro con secciones reutilizables y ritmo visual fuerte.",
    },
    {
      title: "Demo producto / founder",
      description: "Un prototipo de interfaz que hace visible la logica de producto, workflow o narrativa founder.",
      bestFor: "Productos tempranos, herramientas internas, investor demos y prueba product-led.",
      output: "Una superficie funcional que explica el producto mediante interaccion, no slides.",
    },
    {
      title: "Prototipo inmersivo",
      description: "Una prueba WebGL, espacial o cinematica contenida y conectada con una marca, producto o archivo real.",
      bestFor: "Equipos que necesitan un momento digital firma o prueba de direccion.",
      output: "Un prototipo inmersivo contenido que puede vivir junto al sistema comercial.",
    },
    {
      title: "Direccion creative technology",
      description: "Un systems pass senior antes de produccion: concepto, arquitectura de interfaz, modelo de motion y direccion de build.",
      bestFor: "Marcas y equipos con ambicion pero forma digital poco clara.",
      output: "Un modelo de direccion practico, no solo inspiracion.",
    },
  ];
}

function getFormatGroups(locale: LocaleCode) {
  const localizedFormats = getFormats(locale);
  const ui = getOfferUi(locale);

  return [
    { label: ui.primaryEntryPoints, note: ui.primaryEntryNote, items: localizedFormats.slice(0, 3) },
    { label: ui.secondaryDirections, note: ui.secondaryNote, items: localizedFormats.slice(3) },
  ];
}

function getMobileThesisPoints(locale: LocaleCode) {
  if (locale !== "es") return mobileThesisPoints;

  return [
    ["01", "Estrategia", "Forma de oferta, presion de audiencia y jerarquia de prueba."],
    ["02", "Arquitectura de interfaz", "Ruta, logica de seccion, decisiones y flujo de CTA."],
    ["03", "Entrega de produccion", "Front-end responsive, estados de motion, QA y handoff."],
  ];
}

function getMobileDeliverySpine(locale: LocaleCode) {
  if (locale !== "es") return mobileDeliverySpine;

  return [
    ["01", "Direccion", "Tesis comercial cerrada."],
    ["02", "Sistema visual", "Lenguaje de interfaz definido."],
    ["03", "Build", "Front-end responsive montado."],
    ["04", "Launch", "QA, handoff y claridad del siguiente paso."],
  ];
}

function getMobileReceiveLedger(locale: LocaleCode) {
  if (locale !== "es") return mobileReceiveLedger;

  return [
    ["01", "Superficie front-end", "Interfaz responsive lista para produccion."],
    ["02", "Estructura de contenido", "Logica de secciones, jerarquia y claridad de ruta."],
    ["03", "Sistema mobile / desktop", "Presentacion responsive en pantallas clave."],
    ["04", "Estados de motion", "Transiciones, reveals, feedback y estados de interaccion."],
    ["05", "Handoff de launch", "QA, metadata base y notas de entrega."],
  ];
}

function getDeliverables(locale: LocaleCode) {
  if (locale !== "es") return deliverables;

  return [
    "Front-end listo para produccion",
    "Contenido estructurado y logica de secciones",
    "Sistema de interfaz responsive",
    "Lenguaje de motion y estados de interaccion",
    "QA, soporte de launch y notas de handoff",
  ];
}

function getMobileRoutes(locale: LocaleCode): MobileRoute[] {
  const localizedFormats = getFormats(locale);
  const routeOrder = [1, 2, 3, 4, 0, 5];

  return routeOrder.map((formatIndex, index) => ({
    ...(localizedFormats[formatIndex] ?? localizedFormats[index] ?? localizedFormats[0]),
    routeIndex: String(index + 1).padStart(2, "0"),
  }));
}

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

function FocusedEntryRoutes({ compact = false }: { compact?: boolean }) {
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const copy = locale === "es" ? spanishCorePageContent.offer : undefined;
  const localizedRoutes = [
    { ...focusedEntryRoutes[0], label: copy?.labels?.premiumLandingPages ?? focusedEntryRoutes[0].label },
    { ...focusedEntryRoutes[1], label: copy?.labels?.productDemoLanding ?? focusedEntryRoutes[1].label },
    { ...focusedEntryRoutes[2], label: copy?.labels?.interactiveWebSystems ?? focusedEntryRoutes[2].label },
  ];

  return (
    <div className={compact ? "mt-7 border-y border-neutral-950/10 py-4" : "mt-8 border-y border-neutral-950/10 py-4"}>
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
        {copy?.labels?.serviceRoutes ?? ui.focusedEntryRoutes}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {localizedRoutes.map((route) => (
          <Link
            key={route.to}
            to={getLocalizedPath(route.to, locale)}
            className="inline-flex min-h-9 items-center rounded-full border border-neutral-300 bg-white/46 px-3 text-[10px] uppercase tracking-[0.13em] text-neutral-600 transition hover:-translate-y-0.5 hover:border-neutral-950/35 hover:bg-white hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
          >
            {route.label} -&gt;
          </Link>
        ))}
      </div>
    </div>
  );
}

function OfferSignalReadout() {
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const prefersReducedMotion = useReducedMotion();
  const [activeLayer, setActiveLayer] = useState(0);
  const [typedLine, setTypedLine] = useState("");
  const sound = useSound();
  const localizedHeroObjectLayers = getHeroObjectLayers(locale);
  const localizedSignalLine = getOfferSignalLine(locale);
  const localizedSignalFollowUp = getOfferSignalFollowUp(locale);
  const active = localizedHeroObjectLayers[activeLayer] ?? localizedHeroObjectLayers[0];
  const visibleTypedLine = prefersReducedMotion ? localizedSignalLine : typedLine;
  const activeProgress = ((activeLayer + 1) / localizedHeroObjectLayers.length) * 100;

  useEffect(() => {
    if (prefersReducedMotion) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTypedLine(localizedSignalLine.slice(0, index));
      if (index >= localizedSignalLine.length) window.clearInterval(timer);
    }, 28);

    return () => window.clearInterval(timer);
  }, [localizedSignalLine, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveLayer((current) => (current + 1) % localizedHeroObjectLayers.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [localizedHeroObjectLayers.length, prefersReducedMotion]);

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
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{ui.liveSignal}</div>
          <div className="mt-2 max-w-[18rem] font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            {active.signal} / {ui.commercialSurface}
          </div>

          <div className="mt-9 max-w-[22rem] font-mono text-[12px] leading-6 text-neutral-600">
            <p>
              {visibleTypedLine}
              {!prefersReducedMotion && visibleTypedLine.length < localizedSignalLine.length ? (
                <span className="ml-1 inline-block h-3 w-px translate-y-0.5 bg-neutral-950/70" />
              ) : null}
            </p>

            {localizedSignalFollowUp.map((line, index) => (
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
              {String(activeLayer + 1).padStart(2, "0")} {ui.activeLayer}
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
          {localizedHeroObjectLayers.map((item, index) => {
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
              <span>{active.signal} {ui.activeRoute}</span>
              <span className="text-neutral-950">
                {String(activeLayer + 1).padStart(2, "0")} / {String(localizedHeroObjectLayers.length).padStart(2, "0")}
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
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const localizedBuildSystems = getBuildSystems(locale);
  const [activeIndex, setActiveIndex] = useState(0);
  const { playRole } = useSound();
  const active = localizedBuildSystems[activeIndex] ?? localizedBuildSystems[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr] xl:gap-8">
      <div className="border-y border-neutral-950/10">
        {localizedBuildSystems.map((item, index) => {
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
                {ui.selectedFormat}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
                {String(activeIndex + 1).padStart(2, "0")} / {String(localizedBuildSystems.length).padStart(2, "0")}
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
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">{ui.forLabel}</div>
                <p className="text-[14px] leading-6 text-neutral-600">{active.forWhom}</p>
              </div>
              <div className="grid gap-3 py-4 sm:grid-cols-[8rem_1fr]">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">{ui.resultLabel}</div>
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
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const layerGroups = [
    { label: ui.coreLayers, layers: getCoreSystemLayers(locale), optional: false },
    { label: ui.optionalLayers, layers: getOptionalSystemLayers(locale), optional: true },
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
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{ui.addWhenUseful}</div>
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
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const localizedDeliveryStages = getDeliveryStages(locale);
  const current = localizedDeliveryStages[activeStage] ?? localizedDeliveryStages[0];
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
              {current.label} {ui.activeLayer}
            </div>
            <button
              type="button"
              onMouseEnter={() => sound.playRole("hover")}
              onClick={onOpenInterface}
              className="inline-flex min-h-10 shrink-0 items-center justify-center border border-neutral-950 bg-neutral-950 px-4 text-[10px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
            >
              {ui.openInterface}
            </button>
          </div>

          <div className="absolute inset-0 pt-14">
            <OfferDeliveryModelEngine
              stages={localizedDeliveryStages}
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
  copy,
  onOpenProject,
  onViewWork,
}: {
  copy?: CorePageTranslation;
  onOpenProject: () => void;
  onViewWork: () => void;
}) {
  const { locale } = useI18n();
  const ui = getOfferUi(locale);

  return (
    <section
      id="offer-threshold"
      data-header-scene="practice-threshold"
      data-sound-safe-area
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-y border-neutral-950/12 px-[var(--mobile-page-x)] pb-9 pt-8"
    >
      <SectionLabel>{ui.thresholdLabel}</SectionLabel>
      <h1 className="mt-7 max-w-[11ch] text-[58px] font-normal leading-[0.9] text-neutral-950">
        {copy?.title ?? "Premium interface systems for real projects."}
      </h1>
      <p className="mt-7 max-w-[21rem] text-[17px] leading-7 text-neutral-600">
        {copy?.body ??
          "Premium websites, product surfaces, multilingual systems, and focused prototypes shaped around strategy, proof, motion, and production-ready front-end delivery."}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onOpenProject}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
        >
          {copy?.ctas?.[0] ?? "Start a project"} -&gt;
        </button>
        <button
          type="button"
          onClick={onViewWork}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white/54 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700"
        >
          {copy?.ctas?.[1] ?? "View work"} -&gt;
        </button>
      </div>
      <FocusedEntryRoutes compact />
    </section>
  );
}

function MobileOfferThesis() {
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const localizedThesisPoints = getMobileThesisPoints(locale);

  return (
    <section
      id="offer-systems"
      data-header-scene="practice-build"
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] py-12"
    >
      <SectionLabel>{ui.whatIBuild}</SectionLabel>
      <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        {ui.commercialSystemSurface}
      </h2>
      <p className="mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        {ui.commercialSystemBody}
      </p>

      <div className="mt-8 border-y border-neutral-950/12">
        {localizedThesisPoints.map(([index, title, text]) => (
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
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const localizedMobileRoutes = getMobileRoutes(locale);
  const mobilePrimaryRoutes = localizedMobileRoutes.slice(0, 3);
  const mobileSecondaryRoutes = localizedMobileRoutes.slice(3);
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
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-300">{ui.best}</div>
                    <p className="max-w-[19rem] text-[13px] leading-5 text-neutral-600">{route.bestFor}</p>
                  </div>
                  <div className="grid grid-cols-[4.1rem_1fr] gap-3">
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-300">{ui.output}</div>
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
      <SectionLabel>{ui.routeSelector}</SectionLabel>
      <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        {ui.chooseEntry}
      </h2>
      <p className="mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        {ui.routeSelectorBody}
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
            <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">{ui.secondaryRoutes}</span>
            <span className="mt-2 block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">
              {ui.secondaryCaption}
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            {secondaryOpen ? ui.hideRoutes : ui.show03}
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
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const localizedMobileDeliverySpine = getMobileDeliverySpine(locale);

  return (
    <section
      id="offer-delivery"
      data-header-scene="practice-delivery"
      className="relative z-10 mx-auto w-[min(100%,44rem)] border-b border-neutral-950/12 px-[var(--mobile-page-x)] py-12"
    >
      <SectionLabel>{ui.howProjectMoves}</SectionLabel>
      <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        {ui.builtThroughStages}
      </h2>
      <p className="mt-6 max-w-[21rem] text-[16px] leading-7 text-neutral-600">
        {ui.deliveryBody}
      </p>

      <div data-sound-safe-area className="mt-8 border-y border-neutral-950/12 pb-2">
        {localizedMobileDeliverySpine.map(([index, title, text], itemIndex) => (
          <MobileMotionLedgerRow key={title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-neutral-950/10 py-4">
            <div className="relative font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">
              <span className="relative z-10 inline-flex h-5 items-center bg-[#f7f5f0]/80 pr-2">{index}</span>
              {itemIndex < localizedMobileDeliverySpine.length - 1 ? (
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
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">{ui.output}</div>
          <div className="max-w-[18rem] text-[15px] leading-6 text-neutral-800">{ui.productionReadyInterface}</div>
        </div>
      </div>
    </section>
  );
}

function MobileOutputLedger() {
  const { locale } = useI18n();
  const ui = getOfferUi(locale);
  const localizedReceiveLedger = getMobileReceiveLedger(locale);

  return (
    <section
      id="offer-output"
      data-header-scene="practice-output"
      className="relative z-10 mx-auto w-[min(100%,44rem)] px-[var(--mobile-page-x)] py-12"
    >
      <SectionLabel>{ui.whatYouReceive}</SectionLabel>
      <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.95] text-neutral-950">
        {ui.usableSystem}
      </h2>

      <div className="mt-8 flex items-center justify-between gap-4 border-y border-neutral-950/12 py-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">{ui.includedInEveryRoute}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300">05 {ui.items}</div>
      </div>

      <div data-sound-safe-area className="border-b border-neutral-950/12 pb-6">
        {localizedReceiveLedger.map(([index, title, text]) => (
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
  copy,
  onOpenProject,
  onViewWork,
}: {
  copy?: CorePageTranslation;
  onOpenProject: () => void;
  onViewWork: () => void;
}) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip lg:hidden">
      <MobileMotionSection variant="threshold">
        <MobileOfferHero copy={copy} onOpenProject={onOpenProject} onViewWork={onViewWork} />
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
  const { locale } = useI18n();
  const copy = locale === "es" ? spanishCorePageContent.offer : undefined;
  const ui = getOfferUi(locale);
  const localizedFormatGroups = getFormatGroups(locale);
  const localizedDeliverables = getDeliverables(locale);
  const { playRole, setScene, stopAmbient } = useSound();
  const systemsRef = useRef<HTMLElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [deliveryInterfaceOpen, setDeliveryInterfaceOpen] = useState(false);
  const activeSectionId = useSectionRailActive(ui.railItems);
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
    startSpaPageTransition(navigate, getLocalizedPath("/work", locale), onCloseProject);
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
          items={ui.railItems}
          activeId={activeSectionId}
          onSelect={scrollToRailSection}
          label={ui.railLabel}
        />
        <main className="relative pt-20 lg:pt-24">
          {desktopLayout ? (
            <>
          <section id="offer-threshold" data-header-scene="practice-threshold" data-sound-safe-area className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-[min(94vw,1640px)] gap-10 border-y border-neutral-950/14 py-10 lg:grid-cols-[0.46fr_0.54fr] lg:items-center lg:py-12 xl:pr-36">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease }}
            >
              <SectionLabel>{ui.thresholdLabel}</SectionLabel>
              <h1 className="mt-6 max-w-[11ch] text-[58px] font-normal leading-[0.88] tracking-[-0.06em] text-neutral-950 sm:text-[88px] lg:text-[112px] xl:text-[128px]">
                {copy?.title ?? "Premium interface systems for real projects."}
              </h1>
              <p className="mt-8 max-w-[43rem] text-[17px] leading-8 text-neutral-600 sm:text-[20px]">
                {copy?.body ??
                  "Premium websites, product surfaces, multilingual systems, and immersive prototypes built with strategy, visual direction, motion grammar, and production-ready front-end delivery."}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
                  onClick={openProjectWithSound}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  {copy?.ctas?.[0] ?? "Start a project"} -&gt;
                </button>
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
                  onClick={viewWork}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-white/54 px-5 text-[11px] uppercase tracking-[0.16em] text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {copy?.ctas?.[1] ?? "View work"} -&gt;
                </button>
                <button
                  type="button"
                  onMouseEnter={() => playRole("hover")}
                  onClick={exploreSystems}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 bg-transparent px-5 text-[11px] uppercase tracking-[0.16em] text-neutral-600 transition hover:-translate-y-0.5 hover:border-neutral-950/40 hover:text-neutral-950"
                >
                  {ui.exploreSystems}
                </button>
              </div>
              <FocusedEntryRoutes />

              <div className="mt-9 grid gap-3 border-y border-neutral-950/10 py-5 sm:grid-cols-3">
                {ui.heroSignals.map((item, index) => (
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

          <section id="offer-systems" ref={systemsRef} data-header-scene="practice-build" className="relative z-10 mx-auto w-[min(94vw,1640px)] py-16 lg:py-20">
            <div className="grid gap-10 border-y border-neutral-950/14 py-9 lg:grid-cols-[0.3fr_0.7fr]">
              <div>
                <SectionLabel>{ui.whatIBuild}</SectionLabel>
                <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                  {ui.commercialSystemSurface}
                </h2>
                <p className="mt-7 max-w-[28rem] text-[15px] leading-7 text-neutral-600">
                  {ui.commercialSystemBody}
                </p>
              </div>

              <BuildSystemsInterface />
            </div>
          </section>

          <section id="engagement-model" data-header-scene="practice-system" className="relative z-10 mx-auto w-[min(94vw,1640px)] scroll-mt-28 pb-16 lg:pb-20">
            <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionLabel>{ui.serviceArchitecture}</SectionLabel>
                <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                  {ui.notAPage}
                </h2>
                <p className="mt-7 max-w-[31rem] text-[15px] leading-7 text-neutral-600">
                  {ui.serviceArchitectureBody}
                </p>
              </div>

              <SystemLayerSpine />
            </div>
          </section>

          <section id="offer-delivery" data-header-scene="practice-delivery" className="relative z-10 mx-auto w-[min(94vw,1640px)] scroll-mt-28 pb-8 lg:pb-10">
            <div className="relative isolate -mx-[3vw] overflow-visible px-[3vw] pb-8 pt-10 lg:pb-10 lg:pt-16">
              <div className="pointer-events-none absolute -inset-x-[4vw] -inset-y-20 -z-10 bg-[radial-gradient(circle_at_38%_20%,rgba(255,255,255,0.58),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(244,241,234,0.36),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0),rgba(246,244,239,0.28)_34%,rgba(246,244,239,0.2)_68%,rgba(255,255,255,0))] opacity-80 [mask-image:linear-gradient(180deg,transparent,black_18%,black_82%,transparent)]" />
              <div className="pointer-events-none absolute -inset-x-[4vw] -inset-y-16 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(180deg,transparent,black_16%,black_84%,transparent)]" />
              <div className="pointer-events-none absolute left-[12%] top-[1rem] -z-10 h-[32rem] w-[32rem] rounded-full border border-neutral-950/[0.018]" />
              <div className="pointer-events-none absolute right-[10%] bottom-[-1rem] -z-10 h-[28rem] w-[28rem] rounded-full border border-neutral-950/[0.016]" />

              <div className="grid gap-10 border-y border-neutral-950/10 py-9 lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
                <div>
                  <SectionLabel>{ui.engagementModel}</SectionLabel>
                  <h2 className="mt-5 max-w-[10ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                    {ui.builtThroughStages}
                  </h2>
                </div>
                <p className="max-w-[46rem] text-[16px] leading-8 text-neutral-600">
                  {ui.engagementBody}
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

          <section id="offer-formats" data-header-scene="practice-formats" className="relative z-10 mx-auto w-[min(94vw,1640px)] pb-16 lg:pb-20">
            <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr]">
              <div>
                <SectionLabel>{ui.waysToBegin}</SectionLabel>
                <h2 className="mt-5 max-w-[9ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[76px]">
                  {ui.chooseEntry}
                </h2>
              </div>

              <div className="grid border-y border-neutral-950/14">
                {localizedFormatGroups.map((group, groupIndex) => {
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
                                <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">{ui.best}</span>
                                {item.bestFor}
                              </p>
                              <p>
                                <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-300">{ui.output}</span>
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
                  {ui.availabilityNote}
                </div>
              </div>
            </div>
          </section>

          <section id="offer-output" data-header-scene="practice-output" className="relative z-10 mx-auto w-[min(94vw,1640px)] pb-16 lg:pb-20">
            <div className="grid gap-10 border-y border-neutral-950/14 py-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
              <div>
                <SectionLabel>{ui.whatYouReceive}</SectionLabel>
                <h2 className="mt-5 max-w-[11ch] text-[52px] font-normal leading-[0.92] tracking-[-0.045em] sm:text-[78px]">
                  {ui.usableSystem}
                </h2>
              </div>

              <div className="grid gap-0 border-y border-neutral-950/10 bg-white/22">
                {localizedDeliverables.map((item, index) => (
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
            <MobileOfferLayout copy={copy} onOpenProject={openProjectWithSound} onViewWork={viewWork} />
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
