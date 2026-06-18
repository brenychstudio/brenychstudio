import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type WheelEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { getCaseStory, type CaseStory, type CaseStoryMedia } from "../data/caseStories";
import { getCaseBySlug } from "../data/cases";
import { localizeCase, localizeCaseStory } from "../data/localization";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import { MobileMotionLedgerRow } from "../ui/mobile-motion/MobileMotionLedger";
import MobileMotionSection from "../ui/mobile-motion/MobileMotionSection";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import StructuredData from "../ui/StructuredData";
import CinematicInspectReveal from "../ui/work/CinematicInspectReveal";
import { startSpaPageTransition } from "../ui/pageTransition";
import { scrollToRailSection, useSectionRailActive } from "../ui/useSectionRailActive";
import { useSound } from "../stage/audio/useSound";
import type { SectionRailItem } from "../ui/SectionRail";
import SeoMeta from "../ui/SeoMeta";
import { SITE_NAME, toAbsoluteSiteUrl } from "../config/site";
import { getLocalizedPath, isSpanishPublicCaseStorySlug, useI18n, type LocaleCode } from "../i18n";
import { getSeoAlternates } from "../seo/alternates";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
  noIndex?: boolean;
};

type ProofLedgerItem = {
  label: string;
  text: string;
};

type EvidenceViewMode = "sequence" | "atlas";
type MobileReaderStepKey = "Threshold" | "Watch" | "Frames" | "Proof" | "Mobile" | "Adapt";

const ease = [0.22, 1, 0.36, 1] as const;
const INITIAL_EVIDENCE_FRAME_COUNT = 5;

const caseSpineItems: SectionRailItem[] = [
  { index: "01", label: "Threshold", id: "case-threshold" },
  { index: "02", label: "Walkthrough", id: "case-walkthrough" },
  { index: "03", label: "Screens", id: "case-media" },
  { index: "04", label: "Proof", id: "case-proof-system" },
  { index: "05", label: "Available", id: "case-available" },
  { index: "06", label: "Next", id: "case-closing" },
];

const heroFragmentFrames = [
  "right-[3%] top-[9%] h-[31%] w-[31%]",
  "left-[5%] bottom-[11%] h-[25%] w-[28%]",
  "right-[16%] bottom-[5%] h-[20%] w-[24%]",
];

const alignedHeroFragmentFrames = [
  "right-[2%] top-[8%] aspect-video w-[36%]",
  "left-[3%] bottom-[11%] aspect-video w-[32%]",
  "right-[12%] bottom-[7%] aspect-video w-[27%]",
];

const heroFragmentShapes = [
  "polygon(5% 0, 100% 8%, 93% 100%, 0 88%)",
  "polygon(0 10%, 92% 0, 100% 86%, 8% 100%)",
  "polygon(8% 0, 100% 0, 92% 100%, 0 90%)",
];

const proofLedger: ProofLedgerItem[] = [
  {
    label: "Product focus",
    text: "Products are presented as rare objects, not catalogue inventory.",
  },
  {
    label: "Private inquiry",
    text: "Conversion becomes appointment-led and private, replacing checkout pressure with trust.",
  },
  {
    label: "Commercial trust",
    text: "Routing, dynamic product pages, editorial content, and deployment-ready engineering work together.",
  },
];

const technicalLedger = [
  "Next.js App Router + TypeScript",
  "Multilingual routing",
  "Dynamic product pages",
  "Reusable editorial components",
  "Metadata / Open Graph preparation",
  "Cloudflare Workers deployment",
];

const MOBILE_SWIPE_DISTANCE = 42;
const MOBILE_SWIPE_VELOCITY = 360;

function getCaseNarrative(story: CaseStory) {
  const isSpanishPreviewStory = story.translations?.es?.headline === story.headline;

  if (isSpanishPreviewStory && story.slug === "creatorops") {
    return {
      heroMeta: "Library / planificación / exportación / entrega",
      heroReadiness: "01 / prototipo beta-ready",
      heroMediaTitle: "Espacio de trabajo orientado a la exportación",
      walkthroughTitle: ["El workspace", "convierte assets", "en Week Packs."],
      walkthroughIntro:
        "CreatorOps mueve recursos visuales dispersos a través de Library, Smart Mix, Planner, Captions, Export, Client Review, Profile Handoff / Bio Builder y Media Converter sin convertir el producto en un dashboard pesado.",
      walkthroughSignals: [
        { label: "Library", text: "Los recursos visuales entran como candidatos seleccionables para publicación." },
        { label: "Export", text: "El material elegido se convierte en un Week Pack listo para publicar." },
        { label: "Handoff", text: "La revisión para cliente, la entrega de perfil y las utilidades viven en un entorno calmado." },
      ],
      mobileTitle: "Ritmo creator en formato compacto.",
      mobileIntro:
        "CreatorOps V2 usa el campo de evidencia desktop como prueba completa; las pantallas móviles pueden sumarse cuando esa superficie esté lista.",
      screensTitle: ["Workflow", "como sistema."],
      screensReadout:
        "Cada frame prueba una capa funcional: posicionamiento, library intake, planificación, captions, exportación, revisión para cliente, profile handoff y conversión de medios.",
      screenSignals: ["Workflow export-first", "Client Review", "Profile Handoff"],
      proofLabels: ["Exportación lista", "Capa de revisión", "Entrega útil"],
      availableStatement:
        "Usar esta dirección de flujo creator como referencia para una herramienta de publishing, operaciones de contenido o prototipo de interfaz de producto.",
      availableBlueprint:
        "Interfaz de workflow con estados de planificación, reglas de exportación, lógica de revisión y utilidades de entrega.",
    };
  }

  if (isSpanishPreviewStory && story.slug === "barcelona-private-advisory") {
    return {
      heroMeta: "Brief / lente / dossier / handoff",
      heroReadiness: "01 / prototipo sales-ready",
      heroMediaTitle: "Inteligencia inmobiliaria privada",
      walkthroughTitle: ["La asesoría", "convierte intención", "en dossier."],
      walkthroughIntro:
        "Barcelona Private Advisory convierte la intención del comprador en un recorrido guiado: brief, Barcelona Lens, señal de adquisición, dossier de shortlist, inspección de propiedad y handoff de consulta.",
      walkthroughSignals: [
        { label: "Brief", text: "La intención del comprador define la búsqueda antes de que compitan las propiedades." },
        { label: "Lens", text: "Barcelona Lens hace visible la lógica de distrito, estilo de vida y localización." },
        { label: "Dossier", text: "La shortlist y el handoff preparan una primera conversación de asesoría más clara." },
      ],
      mobileTitle: "Inteligencia advisory en móvil.",
      mobileIntro:
        "La prueba móvil mantiene lens, dossier, detalle de propiedad, inspección y request brief como un único recorrido compacto.",
      screensTitle: ["Selección", "como inteligencia."],
      screensReadout:
        "Cada frame prueba una capa de decisión: intención, Barcelona Lens, señal de adquisición, shortlist, inspección, método y handoff.",
      screenSignals: ["Intent lens", "Shortlist dossier", "Inquiry handoff"],
      proofLabels: ["Intención del comprador", "Lógica de distrito", "Output listo para asesoría"],
      availableStatement:
        "Adaptar esta dirección de inteligencia inmobiliaria privada a una superficie real-estate, destination o advisory.",
      availableBlueprint:
        "Interfaz advisory con lente de mercado, lógica de shortlist, estructura de dossier y ruta de consulta.",
    };
  }

  if (isSpanishPreviewStory && story.slug === "house-of-lune") {
    return {
      heroMeta: "Objeto / consulta / maison / prueba",
      heroReadiness: "01 / available foundation",
      heroMediaTitle: "Superficie premium de producto",
      walkthroughTitle: ["El objeto", "se convierte", "en maison digital."],
      walkthroughIntro:
        "House of Lune convierte objetos de lujo en una superficie editorial con atmósfera, enfoque de producto, consulta privada y storytelling visual.",
      walkthroughSignals: [
        { label: "Atmósfera", text: "La primera superficie posiciona el producto como objeto raro, no como inventario." },
        { label: "Producto", text: "La lectura visual mantiene foco, materialidad y deseo antes de pedir acción." },
        { label: "Consulta", text: "La conversión funciona como ruta privada, no como checkout genérico." },
      ],
      mobileTitle: "Ritmo maison en móvil.",
      mobileIntro:
        "La secuencia móvil conserva la sensación premium mientras hace legibles producto, detalle, historia y consulta privada.",
      screensTitle: ["Producto", "como sistema."],
      screensReadout:
        "Cada frame prueba una capa comercial: atmósfera, producto, detalle editorial, confianza y consulta privada.",
      screenSignals: ["Objeto premium", "Storytelling visual", "Consulta privada"],
      proofLabels: ["Enfoque de producto", "Consulta privada", "Confianza comercial"],
      availableStatement:
        "Adaptar esta lógica maison a una superficie de producto premium, luxury, fashion, jewellery o collectible.",
      availableBlueprint:
        "Superficie de producto con dirección visual, estructura editorial, consulta privada y ruta de adaptación.",
    };
  }

  if (story.slug === "creatorops") {
    return {
      heroMeta: "Library / planner / export / handoff",
      heroReadiness: "01 / beta-ready prototype",
      heroMediaTitle: "Export-first creator workspace",
      walkthroughTitle: ["The workspace", "turns assets", "into week packs."],
      walkthroughIntro:
        "CreatorOps moves scattered visual assets through Library, Smart Mix, Planner, Captions, Export, Client Review, Profile Handoff / Bio Builder, and Media Converter without turning the product into dashboard clutter.",
      walkthroughSignals: [
        { label: "Library", text: "Raw visual assets enter as selectable publishing candidates." },
        { label: "Export", text: "Selected material is shaped into a ready-to-publish Week Pack instead of staying scattered." },
        { label: "Handoff", text: "Client review, profile handoff, and utility tools stay inside one calm product environment." },
      ],
      mobileTitle: "Handheld creator rhythm.",
      mobileIntro:
        "CreatorOps V2 currently uses the desktop evidence field as its complete case proof; mobile-specific screenshots can be added later when that surface is ready.",
      screensTitle: ["Workflow", "as system."],
      screensReadout:
        "Each frame proves a working product layer: positioning, library intake, planning, captions, export readiness, client review, profile handoff, and media conversion.",
      screenSignals: ["Export-first workflow", "Client review", "Profile handoff"],
      proofLabels: ["Export readiness", "Review layer", "Utility handoff"],
      availableStatement:
        "Use this creator workflow direction as reference for a commissioned publishing, content operations, or product-interface prototype.",
      availableBlueprint:
        "Commissioned workflow interface with its own planning states, export rules, review logic, and handoff utilities.",
    };
  }

  if (story.slug === "barcelona-private-advisory") {
    return {
      heroMeta: "Brief / lens / dossier / handoff",
      heroReadiness: "01 / sales-ready prototype",
      heroMediaTitle: "Private property intelligence",
      walkthroughTitle: ["The advisory", "turns intent", "into a dossier."],
      walkthroughIntro:
        "Barcelona Private Advisory turns buyer intent into a guided path: brief, Barcelona Lens, acquisition signal, shortlist dossier, property inspection, and inquiry handoff.",
      walkthroughSignals: [
        { label: "Brief", text: "Buyer intent defines the search before properties compete for attention." },
        { label: "Lens", text: "Barcelona Lens makes district intelligence, lifestyle fit, and location logic visible." },
        { label: "Dossier", text: "Shortlist and inquiry handoff prepare a clearer first advisory conversation." },
      ],
      mobileTitle: "Mobile advisory intelligence.",
      mobileIntro:
        "The mobile proof keeps lens, dossier, property detail, inspection, and request brief readable as one compact buyer path.",
      screensTitle: ["Selection", "as intelligence."],
      screensReadout:
        "Each frame proves a decision layer: intent, Barcelona Lens, acquisition signal, shortlist dossier, inspection, method, and inquiry handoff.",
      screenSignals: ["Intent lens", "Shortlist dossier", "Inquiry handoff"],
      proofLabels: ["Buyer intent", "District logic", "Advisor-ready output"],
      availableStatement:
        "Adapt this private property intelligence direction into a commissioned real-estate, destination, or advisory surface.",
      availableBlueprint:
        "Commissioned advisory interface with its own market lens, shortlist logic, dossier structure, and inquiry path.",
    };
  }

  if (story.slug === "arcwave-integrations") {
    return {
      heroMeta: "Infrastructure / services / quote / brief",
      heroReadiness: "01 / deployed concept demo",
      heroMediaTitle: "Infrastructure interface system",
      walkthroughTitle: ["The system", "makes infrastructure", "visible."],
      walkthroughIntro:
        "ARCWAVE turns telecom, networks, electricity, smart home, EV charging, security, and audio into one readable installation path: connected layer, service choice, process logic, quote request, and technical brief.",
      walkthroughSignals: [
        { label: "Layer", text: "Invisible technical systems are presented as one connected infrastructure surface." },
        { label: "Service", text: "Users can move from need to service path without falling into contractor-site clutter." },
        { label: "Brief", text: "Quote flow turns uncertainty into structured install context for the first conversation." },
      ],
      mobileTitle: "Mobile install clarity.",
      mobileIntro:
        "The mobile sequence keeps the infrastructure promise, service cards, process path, proof metrics, and quote CTA readable as one compact technical journey.",
      screensTitle: ["Infrastructure", "as interface."],
      screensReadout:
        "Each frame proves a service layer: connected infrastructure, proof metrics, service modules, decision interface, install flow, quote form, and technical specification.",
      screenSignals: ["Connected layer", "Install flow", "Quote brief"],
      proofLabels: ["Infrastructure clarity", "Service path", "Install brief"],
      availableStatement:
        "Adapt this infrastructure interface foundation into a commissioned technical service, integration, field-service, or quote-led commercial surface.",
      availableBlueprint:
        "Commissioned infrastructure website with its own service system, install logic, technical content, quote path, and deployment route.",
    };
  }

  if (story.slug === "oria-house-barcelona") {
    return {
      heroMeta: "Rooms / rituals / location / contact",
      heroReadiness: "01 / concept case",
      heroMediaTitle: "Boutique hotel hospitality system",
      walkthroughTitle: ["The stay", "becomes", "a guest path."],
      walkthroughIntro:
        "Oria House Barcelona turns a boutique hotel concept into a complete hospitality path: atmospheric entry, room comparison, room detail, experience rituals, location context, and booking contact.",
      walkthroughSignals: [
        { label: "Atmosphere", text: "The first surfaces establish a quiet Barcelona retreat before asking for action." },
        { label: "Rooms", text: "Comparison, room grids, detail pages, and galleries support practical guest choice." },
        { label: "Contact", text: "The final path turns interest into a clear booking inquiry without claiming a live reservation engine." },
      ],
      mobileTitle: "Mobile guest rhythm.",
      mobileIntro:
        "The mobile sequence keeps room choice, room detail, stay rituals, dining, spa, and contact close for guests arriving from search, social, or maps.",
      screensTitle: ["Hotel concept", "as system."],
      screensReadout:
        "Each frame proves a hospitality layer: atmosphere, room rhythm, comparison, room detail, gallery, experiences, location, and booking contact.",
      screenSignals: ["Room comparison", "Stay rituals", "Booking contact"],
      proofLabels: ["Stay atmosphere", "Room decision", "Guest contact"],
      availableStatement:
        "Adapt this boutique hotel foundation into a commissioned hotel, guest house, retreat, serviced apartment, or stay-led destination surface.",
      availableBlueprint:
        "Commissioned hospitality website with its own rooms, experience layers, location content, inquiry path, and deployment route.",
    };
  }

  if (story.slug === "aurel-eon-gt") {
    return {
      heroMeta: "Signal / motion / product states / proof",
      heroReadiness: "01 / advanced prototype",
      heroMediaTitle: "Living automotive product system",
      walkthroughTitle: ["The car", "becomes", "a product field."],
      walkthroughIntro:
        "AUREL EON GT turns a fictional premium electric grand tourer launch into a state-driven product experience: arrival, exterior, light signature, cabin, materiality, drive character, gallery archive, inspect sequence, product view, and private preview.",
      walkthroughSignals: [
        { label: "Signal", text: "Presence Rail and Next Signal navigation make progression feel like part of the vehicle identity." },
        { label: "Inspect", text: "Cinematic inspect, gallery archive, and product-view expansion keep the car readable through image-led product states." },
        { label: "Preview", text: "Private Preview closes the experience as a concierge-style route instead of a generic contact form." },
      ],
      mobileTitle: "Mobile product presence.",
      mobileIntro:
        "The mobile sequence becomes a focused app-like automotive surface: arrival, cabin, inspect, drive character, gallery archive, intelligence, light signature, preview, and case exit.",
      screensTitle: ["Automotive", "as system."],
      screensReadout:
        "Each frame proves a product layer: arrival, exterior, signal, cabin, materiality, drive character, gallery, inspect, private preview, and responsive mobile states.",
      screenSignals: ["Presence Rail", "Inspect sequence", "Drive composer"],
      proofLabels: ["Product states", "Inspect logic", "Future-ready honesty"],
      availableStatement:
        "Use this case as a reference for commissioned premium automotive, mobility, luxury product, or cinematic interface direction.",
      availableBlueprint:
        "Advanced fictional concept with its own visual system, interaction logic, responsive surface, media pipeline, and future XR-ready architecture.",
    };
  }

  if (story.caseType === "workflow-tool" || story.caseType === "tool") {
    return {
      heroMeta: "Workflow / states / output / proof",
      heroReadiness: "01 / working system",
      heroMediaTitle: "Operational product surface",
      walkthroughTitle: ["The product", "turns work", "into flow."],
      walkthroughIntro:
        "The walkthrough follows a real workflow surface: intake, state changes, focused review, output, and operator trust stay visible as one product system.",
      walkthroughSignals: [
        { label: "Intake", text: "Raw work enters through a controlled interface instead of scattered manual handling." },
        { label: "State", text: "The product exposes progress, selections, and next actions without turning into dashboard noise." },
        { label: "Output", text: "The interface ends in practical operational value: export, reporting, review, or repeatable production." },
      ],
      mobileTitle: "Compact workflow rhythm.",
      mobileIntro:
        "Mobile frames appear when the product has a handheld surface; desktop-first tools keep their evidence in the full inspection field.",
      screensTitle: ["Workflow", "as evidence."],
      screensReadout:
        "Each frame proves a product layer: intake, working state, review surface, output logic, and trust-building structure.",
      screenSignals: ["Working surface", "State logic", "Output proof"],
      proofLabels: ["Workflow clarity", "Operational state", "Practical output"],
      availableStatement:
        "Adapt the product logic into a commissioned tool, internal system, or creator-facing workflow.",
      availableBlueprint:
        "Commissioned product surface with its own workflow, state model, output logic, and deployment route.",
    };
  }

  if (story.caseType === "advisory") {
    return {
      heroMeta: "District / shortlist / private intake / proof",
      heroReadiness: "01 / ready to advise",
      heroMediaTitle: "Curated advisory surface",
      walkthroughTitle: ["The advisory", "moves through", "buyer fit."],
      walkthroughIntro:
        "The interface guides the visitor from location signal to curated search, shortlist logic, and private inquiry without falling into listing-portal noise.",
      walkthroughSignals: [
        { label: "Position", text: "Coastal advisory framing establishes trust before listings." },
        { label: "Shortlist", text: "Curated selections narrow the decision field before private intake." },
        { label: "Advisory", text: "District lens, bilingual access, and property showpieces stay in one flow." },
      ],
      mobileTitle: "Handheld buyer rhythm.",
      mobileIntro:
        "A circular mobile rail for inspecting the advisory journey without flattening it into a generic phone row.",
      screensTitle: ["Buyer journey", "as evidence."],
      screensReadout:
        "Each frame proves a decision layer: location signal, curated search, district fit, shortlist logic, and private inquiry.",
      screenSignals: ["Advisory threshold", "Curated search", "District lens"],
      proofLabels: ["Buyer intent", "Curated search", "Private inquiry"],
      availableStatement:
        "Adapt the advisory logic into a commissioned property, hospitality, or private-service surface.",
      availableBlueprint:
        "Commissioned advisory surface with its own territory, content, and inquiry rhythm.",
    };
  }

  if (story.caseType === "hospitality") {
    return {
      heroMeta: "Atmosphere / menu / visit / mobile utility",
      heroReadiness: "01 / ready to host",
      heroMediaTitle: "Hospitality web surface",
      walkthroughTitle: ["The visit", "starts before", "arrival."],
      walkthroughIntro:
        "The interface moves from atmosphere to menu clarity, location utility, reservation intent, and mobile action without becoming a generic restaurant template.",
      walkthroughSignals: [
        { label: "Atmosphere", text: "The first surface gives the place a clear digital mood and commercial position." },
        { label: "Utility", text: "Menu, visit details, location, and contact remain close to the visitor's actual decision path." },
        { label: "Mobile", text: "The handheld version keeps local actions immediate for visitors arriving from search, maps, or social." },
      ],
      mobileTitle: "Handheld visitor rhythm.",
      mobileIntro:
        "A mobile rail for inspecting menu, visit, maps, and action states as the practical hospitality path.",
      screensTitle: ["Visitor path", "as evidence."],
      screensReadout:
        "Each frame proves a hospitality layer: atmosphere, menu, location, visit utility, and mobile conversion.",
      screenSignals: ["Atmosphere", "Menu clarity", "Visit utility"],
      proofLabels: ["Place signal", "Visitor utility", "Mobile action"],
      availableStatement:
        "Adapt the hospitality logic into a commissioned cafe, restaurant, boutique space, or local service surface.",
      availableBlueprint:
        "Commissioned hospitality foundation with its own place, menu structure, visit flow, and multilingual needs.",
    };
  }

  if (story.caseType === "premium-website") {
    return {
      heroMeta: "Offer / trust / structure / inquiry",
      heroReadiness: "01 / ready to convert",
      heroMediaTitle: "Premium service surface",
      walkthroughTitle: ["The offer", "becomes", "architecture."],
      walkthroughIntro:
        "The walkthrough shows how a service offer becomes structured: positioning, service detail, trust layers, and inquiry flow stay aligned.",
      walkthroughSignals: [
        { label: "Offer", text: "The first surface clarifies what the business does and why it should be trusted." },
        { label: "Detail", text: "Service pages and content sections make technical information readable without flattening it." },
        { label: "Inquiry", text: "The contact or quote path appears as part of the product architecture, not an afterthought." },
      ],
      mobileTitle: "Handheld service rhythm.",
      mobileIntro:
        "A mobile rail for inspecting service structure, trust content, and inquiry flow inside the compact route.",
      screensTitle: ["Service proof", "as evidence."],
      screensReadout:
        "Each frame proves a commercial layer: offer clarity, technical trust, service detail, and quote readiness.",
      screenSignals: ["Offer clarity", "Trust layers", "Inquiry flow"],
      proofLabels: ["Service clarity", "Technical trust", "Conversion path"],
      availableStatement:
        "Adapt the service architecture into a commissioned B2B, technical, or quote-led commercial surface.",
      availableBlueprint:
        "Commissioned service foundation with its own offer model, content structure, and inquiry logic.",
    };
  }

  if (story.caseType === "presentation-system" || story.caseType === "experimental") {
    return {
      heroMeta: "Motion / content / rhythm / proof",
      heroReadiness: "01 / presentation system",
      heroMediaTitle: "Cinematic editorial surface",
      walkthroughTitle: ["The story", "moves through", "structure."],
      walkthroughIntro:
        "The walkthrough shows how motion, image rhythm, typography, and content architecture become one readable presentation system.",
      walkthroughSignals: [
        { label: "Rhythm", text: "Motion establishes pacing and focus without hiding the information architecture." },
        { label: "Content", text: "Images, text, and sections remain readable as the visual system becomes more cinematic." },
        { label: "System", text: "The result is reusable presentation logic rather than a one-off visual flourish." },
      ],
      mobileTitle: "Handheld editorial rhythm.",
      mobileIntro:
        "A mobile rail for inspecting how the presentation surface translates into a compact reading path.",
      screensTitle: ["Motion proof", "as evidence."],
      screensReadout:
        "Each frame proves a presentation layer: threshold, content rhythm, transition logic, mobile translation, and visual restraint.",
      screenSignals: ["Motion rhythm", "Content clarity", "System surface"],
      proofLabels: ["Presentation logic", "Motion control", "Reusable structure"],
      availableStatement:
        "Adapt the presentation logic into a commissioned campaign, exhibition, archive, or editorial product surface.",
      availableBlueprint:
        "Commissioned presentation foundation with its own content model, media rhythm, and motion direction.",
    };
  }

  return {
    heroMeta: "Desire / systems / availability / proof",
    heroReadiness: "01 / ready to adapt",
    heroMediaTitle: "Cinematic product theatre",
    walkthroughTitle: ["The interface", "moves like", "product theatre."],
    walkthroughIntro:
      "A luxury product interface should not behave like inventory. The walkthrough keeps desire, product focus, editorial pacing, and private inquiry in one moving surface.",
    walkthroughSignals: [
      { label: "Reveal", text: "Slow product focus before catalogue noise." },
      { label: "Inquiry", text: "A private request path appears when desire is already formed." },
      { label: "Surface", text: "Editorial rhythm, multilingual access, and commerce logic stay in one field." },
    ],
    mobileTitle: "Handheld maison rhythm.",
    mobileIntro:
      "A circular mobile rail for inspecting the handheld surface without flattening it into a static phone row.",
    screensTitle: ["Screens", "as evidence."],
    screensReadout:
      "Complete frames stay readable. Motion adds depth; it does not hide the interface.",
    screenSignals: ["Full surfaces", "Motion behind detail", "Desktop + mobile"],
    proofLabels: ["Product focus", "Private inquiry", "Commercial trust"],
    availableStatement:
      "Adapt the maison logic into a commissioned product surface, not a template resale.",
    availableBlueprint:
      "Commissioned adaptation with its own brand, content, and inquiry rhythm.",
  };
}

function CaseMeta({
  story,
  noIndex = false,
  locale,
}: {
  story: CaseStory | null;
  noIndex?: boolean;
  locale: LocaleCode;
}) {
  const sourceRegistryCase = getCaseBySlug(story?.slug);
  const registryCase = sourceRegistryCase ? localizeCase(sourceRegistryCase, locale) : null;
  const fallbackMedia =
    story?.mediaSequence.find((item) => item.kind !== "video" && item.role === "hero") ??
    story?.mediaSequence.find((item) => item.kind !== "video") ??
    null;
  const caseTitle = registryCase?.seoTitle ?? (registryCase
    ? `${registryCase.title} - ${registryCase.category} | Brenych Studio`
    : story
      ? `${story.headline} - Case System | Brenych Studio`
      : "Case System | Brenych Studio");
  const caseDescription =
    registryCase?.seoDescription ??
    registryCase?.shortDescription ??
    story?.summary ??
    "Case system story from Brenych Studio: premium interface, proof-led media, and production-ready front-end structure.";
  const casePath = getLocalizedPath(story ? `/work/${story.slug}` : "/work", locale);
  const caseImage = registryCase?.ogImage ?? fallbackMedia?.src;
  const structuredData =
    story && registryCase
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: registryCase.title,
          headline: caseTitle,
          description: caseDescription,
          url: toAbsoluteSiteUrl(casePath),
          image: toAbsoluteSiteUrl(caseImage ?? registryCase.previewImage),
          dateCreated: registryCase.year,
          creator: {
            "@type": "Organization",
            name: SITE_NAME,
            url: toAbsoluteSiteUrl("/"),
          },
          keywords: registryCase.tags.join(", "),
          genre: registryCase.category,
          workExample: registryCase.liveUrl,
        }
      : null;

  return (
    <>
      <SeoMeta
        title={caseTitle}
        description={caseDescription}
        path={casePath}
        image={caseImage}
        imageAlt={registryCase?.alt ?? fallbackMedia?.alt ?? story?.headline}
        type="article"
        noIndex={noIndex}
        alternates={getSeoAlternates(casePath)}
      />
      {structuredData ? <StructuredData id={`structured-data-case-${registryCase?.slug ?? "unknown"}`} data={structuredData} /> : null}
    </>
  );
}

function mediaRoleLabel(role: CaseStoryMedia["role"]) {
  return role.replace("-", " ");
}

function getTitleLines(title: string) {
  if (title === "CreatorOps") return ["Creator", "Ops"];
  if (title === "House of Lune") return ["House of", "Lune"];

  const words = title.split(" ");
  if (words.length === 3 && title.length > 18) return [words.slice(0, 2).join(" "), words[2] ?? ""];
  if (words.length <= 3) return words;

  return [words.slice(0, -1).join(" "), words.at(-1) ?? ""];
}

function findMedia(story: CaseStory, id: string) {
  return story.mediaSequence.find((media) => media.id === id) ?? null;
}

function getWalkthroughMedia(story: CaseStory) {
  return findMedia(story, "walkthrough") ?? story.mediaSequence[0];
}

function getThresholdMedia(story: CaseStory) {
  return (
    findMedia(story, "threshold") ??
    story.mediaSequence.find((media) => media.kind !== "video") ??
    story.mediaSequence[0]
  );
}

function getHeroFragments(story: CaseStory) {
  return ["collection", "craft", "inquiry"]
    .map((id) => findMedia(story, id))
    .filter((media): media is CaseStoryMedia => Boolean(media));
}

function getEvidenceFrames(story: CaseStory) {
  const nonMobileFrames = story.mediaSequence.filter(
    (media) => media.kind !== "video" && media.role !== "mobile",
  );
  const orderBySlug: Record<string, string[]> = {
    creatorops: [
      "threshold",
      "desktop-1",
      "desktop-2",
      "desktop-3",
      "desktop-4",
      "desktop-5",
      "collection",
      "desktop-7",
      "craft",
      "desktop-10",
      "desktop-11",
      "inquiry",
      "desktop-13",
      "desktop-14",
    ],
  };
  const customOrder = orderBySlug[story.slug];

  if (customOrder) {
    const ordered = customOrder
      .map((id) => findMedia(story, id))
      .filter((media): media is CaseStoryMedia => Boolean(media));
    const orderedIds = new Set(ordered.map((media) => media.id));
    return [...ordered, ...nonMobileFrames.filter((media) => !orderedIds.has(media.id))];
  }

  return nonMobileFrames;
}

function getMobileFrames(story: CaseStory) {
  return story.mediaSequence.filter((media) => media.role === "mobile");
}

function getAvailabilitySignal(story: CaseStory) {
  if (isSpanishCaseStory(story)) {
    if (!story.availability) return "Dirección a medida";
    if (story.availability.status === "available") return "Base disponible";
    if (story.availability.status === "custom-only") return "Solo a medida";
    if (story.availability.status === "concept-reference") return "Referencia";
    return "Caso de referencia";
  }

  if (!story.availability) return "Custom direction";
  if (story.availability.status === "available") return "Available foundation";
  if (story.availability.status === "custom-only") return "Custom only";
  if (story.availability.status === "concept-reference") return "Concept reference";
  return "Case reference";
}

function isSpanishCaseStory(story: CaseStory) {
  return story.translations?.es?.headline === story.headline;
}

function getCaseTypeLabel(story: CaseStory) {
  if (!isSpanishCaseStory(story)) return story.caseType.replace("-", " ");

  const labels: Record<CaseStory["caseType"], string> = {
    advisory: "sistema advisory",
    experimental: "sistema experimental",
    hospitality: "sistema hospitality",
    "luxury-product": "producto premium",
    "premium-website": "web premium",
    "presentation-system": "presentación",
    "product-system": "sistema de producto",
    "workflow-tool": "herramienta workflow",
    tool: "herramienta",
  };

  return labels[story.caseType] ?? story.caseType.replace("-", " ");
}

function getClosingMove(story: CaseStory) {
  if (story.slug === "aurel-eon-gt") {
    return {
      headline: "Commission a premium product experience with this level of control.",
      prompt: "The automotive concept proves the direction. Choose product world, interaction depth, media system, and launch scope.",
      steps: ["World", "Motion", "Launch"],
    };
  }

  if (story.slug === "oria-house-barcelona") {
    return {
      headline: "Use this hotel foundation — or commission a sharper guest path.",
      prompt: "The stay model is mapped. Choose rooms, rituals, booking logic, and launch scope.",
      steps: ["Rooms", "Rituals", "Contact"],
    };
  }

  if (story.slug === "arcwave-integrations") {
    return {
      headline: "Use this infrastructure foundation — or commission a sharper quote path.",
      prompt: "The service model is mapped. Choose technical vertical, install logic, content depth, and launch scope.",
      steps: ["Vertical", "Services", "Brief"],
    };
  }

  if (story.slug === "barcelona-private-advisory") {
    return {
      headline: "Use this intelligence foundation — or commission a sharper buyer path.",
      prompt: "The advisory model is mapped. Choose market, buyer lens, dossier logic, and launch scope.",
      steps: ["Market", "Lens", "Handoff"],
    };
  }

  if (story.caseType === "advisory") {
    return {
      headline: "Use this advisory foundation — or commission a sharper buyer path.",
      prompt: "The decision journey is mapped. Choose territory, intake logic, and launch scope.",
      steps: ["Territory", "Fit", "Launch"],
    };
  }

  if (story.caseType === "workflow-tool" || story.caseType === "tool") {
    return {
      headline: "Turn this workflow logic into a commissioned product.",
      prompt: "The operating model is visible. Choose users, states, and output rules.",
      steps: ["Users", "States", "Output"],
    };
  }

  if (story.caseType === "hospitality") {
    return {
      headline: "Shape the next visitor path with this rhythm.",
      prompt: "The place journey is clear. Choose language, actions, and local conversion flow.",
      steps: ["Place", "Action", "Launch"],
    };
  }

  if (story.caseType === "presentation-system" || story.caseType === "experimental") {
    return {
      headline: "Turn the visual grammar into a new authored route.",
      prompt: "The motion model is proven. Choose content, pacing, and release surface.",
      steps: ["Content", "Rhythm", "Release"],
    };
  }

  return {
    headline: "Use this foundation — or commission one with the same clarity.",
    prompt: "The direction is structured. Choose brand fit, content depth, and launch rhythm.",
    steps: ["Fit", "Scope", "Build"],
  };
}

function getDirectMailHref(story: CaseStory) {
  const subject = `${story.headline} project inquiry`;
  const body = `Hi Rostyslav,\n\nI would like to discuss a commissioned direction related to ${story.headline}.\n\nProject:\nTimeline:\nBudget:\nLinks:\n\nThanks,`;

  return `mailto:info@brenych.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getSecondaryClosingLink(story: CaseStory, links: NonNullable<CaseStory["links"]>) {
  const liveLink = links.find((link) => !/repository|github/i.test(link.label));
  if (liveLink) return { label: isSpanishCaseStory(story) ? "Ver caso" : "View live case", href: liveLink.href };

  return { label: isSpanishCaseStory(story) ? "Email directo" : "Email directly", href: getDirectMailHref(story) };
}

function getMobileReaderSteps(story: CaseStory) {
  const stepKeys: MobileReaderStepKey[] = ["Threshold", "Watch", "Frames", "Proof"];

  if (getMobileFrames(story).length > 0) stepKeys.push("Mobile");
  if (story.availability) stepKeys.push("Adapt");

  return stepKeys.map((key, index) => ({
    index: String(index + 1).padStart(2, "0"),
    key,
    label: getMobileStepLabel(story, key),
  }));
}

function getMobileStepLabel(story: CaseStory, key: MobileReaderStepKey) {
  if (!isSpanishCaseStory(story)) return key;

  const labels: Record<MobileReaderStepKey, string> = {
    Threshold: "Entrada",
    Watch: "Recorrido",
    Frames: "Pantallas",
    Proof: "Prueba",
    Mobile: "Móvil",
    Adapt: "Adaptar",
  };

  return labels[key];
}

function getMobileSectionEyebrow(story: CaseStory, key: MobileReaderStepKey) {
  const step = getMobileReaderSteps(story).find((item) => item.key === key);

  return `${step?.index ?? "00"} / ${getMobileStepLabel(story, key)}`;
}

function getMobileHeroSummary(story: CaseStory) {
  if (story.translations?.es?.headline === story.headline) {
    return story.summary;
  }

  if (story.slug === "oria-house-barcelona") {
    return "Atmosphere, room comparison, room detail, stay rituals, location context, and booking contact become one boutique hotel path.";
  }

  if (story.slug === "arcwave-integrations") {
    return "Connected services, proof metrics, install logic, quote flow, and technical brief turn invisible infrastructure into a clear buyer path.";
  }

  if (story.slug === "barcelona-private-advisory") {
    return "Buyer intent, Barcelona Lens, acquisition signals, shortlist dossier, inspection, and inquiry handoff replace listing-portal noise.";
  }

  if (story.caseType === "product-system") {
    return "Controlled light, editorial pacing, multilingual product pages, and private inquiry replace checkout-first commerce.";
  }

  if (story.caseType === "advisory") {
    return "Curated search, district fit, shortlist logic, and private intake replace listing-portal noise.";
  }

  if (story.caseType === "workflow-tool" || story.caseType === "tool") {
    return "Intake, working states, review, output, and trust stay inside one focused product surface.";
  }

  if (story.caseType === "hospitality") {
    return "Atmosphere, menu clarity, visit utility, multilingual content, and mobile action stay close to the visitor path.";
  }

  if (story.caseType === "premium-website") {
    return "Offer clarity, technical trust, content structure, and inquiry flow become one premium service surface.";
  }

  if (story.caseType === "presentation-system" || story.caseType === "experimental") {
    return "Motion, image rhythm, typography, and content architecture become one reusable presentation surface.";
  }

  return story.summary;
}

function getMobileWalkthroughLine(story: CaseStory) {
  if (isSpanishCaseStory(story)) {
    return getCaseNarrative(story).walkthroughIntro;
  }

  if (story.slug === "oria-house-barcelona") {
    return "Watch the hotel concept move from atmosphere to rooms, experiences, location context, and booking contact.";
  }

  if (story.slug === "arcwave-integrations") {
    return "Watch the technical path move from connected infrastructure to service choice, install flow, quote request, and brief.";
  }

  if (story.slug === "barcelona-private-advisory") {
    return "Watch the advisory path move from buyer brief to Barcelona Lens, shortlist dossier, property inspection, and inquiry handoff.";
  }

  if (story.caseType === "product-system") {
    return "Watch the maison move from cinematic entry to product focus, editorial proof, and private inquiry.";
  }

  if (story.caseType === "workflow-tool" || story.caseType === "tool") {
    return "Watch the workflow move through intake, state, review, and output as one working surface.";
  }

  if (story.caseType === "advisory") {
    return "Watch the advisory path move from position to shortlist, district fit, and private intake.";
  }

  if (story.caseType === "hospitality") {
    return "Watch the visitor path move from atmosphere to menu clarity, visit utility, and mobile action.";
  }

  if (story.caseType === "premium-website") {
    return "Watch the service surface move from offer clarity to trust, detail, and inquiry.";
  }

  if (story.caseType === "presentation-system" || story.caseType === "experimental") {
    return "Watch the presentation system move through rhythm, content, motion, and reusable structure.";
  }

  return "Watch the system move through its main proof before the still frames slow it down.";
}

function getMobileEvidenceReadout(story: CaseStory) {
  if (isSpanishCaseStory(story)) {
    return getCaseNarrative(story).screensReadout;
  }

  if (story.slug === "oria-house-barcelona") {
    return "Room comparison, detail pages, gallery review, stay rituals, location, and booking contact frames hold the proof after motion.";
  }

  if (story.slug === "arcwave-integrations") {
    return "Connected layer, proof metrics, service modules, process path, quote CTA, and technical spec frames hold the proof after motion.";
  }

  if (story.slug === "barcelona-private-advisory") {
    return "Intent lens, district intelligence, shortlist dossier, property inspection, and request brief frames hold the proof after motion.";
  }

  if (story.caseType === "product-system") {
    return "Collection, inquiry, and editorial surfaces hold the proof after the motion pass.";
  }

  if (story.caseType === "advisory") {
    return "Curated search, district, shortlist, and showpiece frames hold the proof after motion.";
  }

  if (story.caseType === "workflow-tool" || story.caseType === "tool") {
    return "Working states, focused review, reports, and output surfaces become inspectable proof.";
  }

  if (story.caseType === "hospitality") {
    return "Atmosphere, menu, visit utility, and mobile action frames make the visitor path visible.";
  }

  if (story.caseType === "premium-website") {
    return "Offer, trust, service detail, and inquiry frames make the commercial structure visible.";
  }

  if (story.caseType === "presentation-system" || story.caseType === "experimental") {
    return "Threshold, rhythm, content, and mobile translation frames slow the motion into proof.";
  }

  return "The still frames slow down the proof into readable interface moments.";
}

function getMobileEvidenceFrames(story: CaseStory) {
  const frames = getEvidenceFrames(story);
  const preferredIds = ["threshold", "collection", "inquiry", "craft", "desktop-2", "desktop-3"];
  const preferredFrames = preferredIds
    .map((id) => frames.find((frame) => frame.id === id))
    .filter((frame): frame is CaseStoryMedia => Boolean(frame));
  const preferredSet = new Set(preferredFrames.map((frame) => frame.id));

  return [...preferredFrames, ...frames.filter((frame) => !preferredSet.has(frame.id))];
}

function getMobileEvidenceInitialIndex(frames: CaseStoryMedia[]) {
  const priorityIndex = frames.findIndex((frame) => frame.id === "collection" || frame.id === "inquiry");
  if (priorityIndex >= 0) return priorityIndex;

  const preferredIndex = frames.findIndex((frame) => frame.role !== "hero" && frame.id !== "threshold");

  return Math.max(0, preferredIndex);
}

function getMobileAvailableStatement(story: CaseStory, fallback: string) {
  if (isSpanishCaseStory(story)) {
    return fallback;
  }

  if (story.caseType === "product-system") {
    return "Adapt the maison logic into a commissioned luxury product surface.";
  }

  return fallback;
}

function getMobileSwipeDelta(info: PanInfo) {
  if (info.offset.x <= -MOBILE_SWIPE_DISTANCE || info.velocity.x <= -MOBILE_SWIPE_VELOCITY) return 1;
  if (info.offset.x >= MOBILE_SWIPE_DISTANCE || info.velocity.x >= MOBILE_SWIPE_VELOCITY) return -1;
  return 0;
}

function ScrollSyncedCaseVideo({
  media,
  frameClass,
  priority,
  ambient,
}: {
  media: CaseStoryMedia;
  frameClass: string;
  priority: boolean;
  ambient: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [manualUntil, setManualUntil] = useState(0);
  const wasInViewRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || prefersReducedMotion) return;

    let frame = 0;

    const updatePlaybackGate = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibleRatio = Math.max(0, Math.min(visibleHeight / Math.max(rect.height, 1), 1));
      const topInFocus = rect.top <= viewportHeight * 0.5;
      const stillInFocus = rect.bottom >= viewportHeight * 0.42;

      setInView(topInFocus && stillInFocus && visibleRatio >= 0.46);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updatePlaybackGate);
    };

    updatePlaybackGate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      video?.pause();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    if (inView) {
      window.requestAnimationFrame(() => {
        if (!wasInViewRef.current && Date.now() >= manualUntil) {
          try {
            video.currentTime = 0;
          } catch {
            // Some browsers reject early seeks until metadata is ready.
          }
        }
        wasInViewRef.current = true;
        video.muted = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            // Autoplay can be blocked until the browser has enough media data.
          });
        }
      });
      return;
    }

    wasInViewRef.current = false;
    video.pause();
  }, [inView, manualUntil, prefersReducedMotion]);

  const holdManualControl = () => setManualUntil(Date.now() + 2500);

  return (
    <div ref={containerRef} className="h-full w-full">
      <video
        ref={videoRef}
        className={frameClass}
        src={media.src}
        poster={media.poster}
        controls={!ambient}
        autoPlay={false}
        loop
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        onPointerDown={holdManualControl}
        onLoadedMetadata={(event) => {
          if (Date.now() < manualUntil) return;
          try {
            event.currentTarget.currentTime = 0;
          } catch {
            // Some browsers reject early seeks while metadata is settling.
          }
        }}
      />
    </div>
  );
}

function CaseMediaView({
  media,
  priority = false,
  ambient = false,
  fit,
  objectPosition,
  scrollPlayback = false,
  className = "",
}: {
  media: CaseStoryMedia;
  priority?: boolean;
  ambient?: boolean;
  fit?: "cover" | "contain";
  objectPosition?: "top" | "center" | "bottom";
  scrollPlayback?: boolean;
  className?: string;
}) {
  const resolvedFit = fit ?? media.fit ?? "contain";
  const resolvedObjectPosition = objectPosition ?? media.objectPosition;
  const positionClass =
    resolvedObjectPosition === "top"
      ? "object-top"
      : resolvedObjectPosition === "bottom"
        ? "object-bottom"
        : media.role === "mobile"
          ? "object-top"
          : "object-center";
  const frameClass = [
    "h-full w-full",
    resolvedFit === "cover" ? "object-cover" : "object-contain",
    positionClass,
    className,
  ].join(" ");

  if (media.kind === "video") {
    if (scrollPlayback) {
      return (
        <ScrollSyncedCaseVideo
          media={media}
          frameClass={frameClass}
          priority={priority}
          ambient={ambient}
        />
      );
    }

    return (
      <video
        className={frameClass}
        src={media.src}
        poster={media.poster}
        controls={!ambient}
        autoPlay={ambient}
        loop={ambient}
        muted
        playsInline
        preload={priority ? "metadata" : "none"}
      />
    );
  }

  return (
    <img
      className={frameClass}
      src={media.src}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function SignalButton({
  children,
  onClick,
  href,
  variant = "primary",
}: {
  children: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "quiet";
}) {
  const className = [
    "inline-flex min-h-10 items-center justify-center rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.16em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
    variant === "primary"
      ? "border border-neutral-950 bg-neutral-950 text-white shadow-[0_14px_40px_rgba(15,15,15,0.14)] hover:-translate-y-0.5 hover:bg-neutral-800"
      : variant === "secondary"
        ? "border border-neutral-950/14 bg-white/58 text-neutral-800 backdrop-blur-sm hover:-translate-y-0.5 hover:border-neutral-950/26 hover:bg-white"
        : "border border-transparent text-neutral-500 hover:text-neutral-950",
  ].join(" ");

  if (href) {
    const external = /^https?:\/\//i.test(href);

    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function SectionSignal({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase leading-4 tracking-[0.22em] text-neutral-500">
      <span className="h-px w-10 bg-neutral-950/22" />
      <span>{index}</span>
      <span className="min-w-0 break-words">{label}</span>
    </div>
  );
}

function CaseSystemSpine({
  items,
  activeId,
  onSelect,
}: {
  items: SectionRailItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [nearDocumentEnd, setNearDocumentEnd] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateNearDocumentEnd = () => {
      frame = 0;
      setNearDocumentEnd(
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - Math.min(window.innerHeight * 0.9, 900),
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateNearDocumentEnd);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  if (!items.length || activeId.includes("closing") || nearDocumentEnd) return null;

  return (
    <nav
      aria-label="Case system spine"
      className="pointer-events-none fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 xl:block 2xl:right-5"
    >
      <div className="pointer-events-auto grid gap-2 border-r border-neutral-950/12 bg-[#f4f1ea]/18 py-2 pr-2 text-right backdrop-blur-sm 2xl:pr-3">
        {items.map((item) => {
          const active = activeId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={active ? "true" : undefined}
              className={[
                "group grid grid-cols-[1.45rem] items-center justify-end gap-2 py-1 text-[9px] uppercase tracking-[0.16em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 2xl:grid-cols-[1fr_1.45rem]",
                active ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-800",
              ].join(" ")}
            >
              <span className="hidden truncate 2xl:block">{item.label}</span>
              <span
                className={[
                  "grid h-5 w-5 place-items-center rounded-full border font-mono text-[8px] transition",
                  active
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-950/12 bg-white/24 text-neutral-400 group-hover:border-neutral-950/28",
                ].join(" ")}
              >
                {item.index}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SystemWalkthroughTheatre({ story }: { story: CaseStory }) {
  const walkthrough = getWalkthroughMedia(story);
  const narrative = getCaseNarrative(story);
  const isAdvisory = story.caseType === "advisory";

  return (
    <section
      id="case-walkthrough"
      className="relative mx-auto w-[min(94vw,1640px)] overflow-hidden border-y border-neutral-950/12 py-14 md:py-16"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:82px_82px]" />
      <div className="pointer-events-none absolute right-[4%] top-[10%] h-[52%] w-[54%] rounded-[50%] bg-neutral-950/10 blur-3xl" />

      <div className="relative mx-auto grid w-full gap-5">
        <div className="relative overflow-hidden border-y border-neutral-950/12 py-8 md:py-9">
          <div className="pointer-events-none absolute inset-y-0 left-[53%] hidden w-px bg-neutral-950/10 lg:block" />
          <div className="pointer-events-none absolute right-[10%] top-1/2 hidden h-[22rem] w-[22rem] -translate-y-1/2 rounded-full border border-neutral-950/5 lg:block" />
          <div className="grid gap-8 lg:grid-cols-[0.56fr_0.18fr_0.52fr] lg:items-end">
            <div>
              <SectionSignal index="02" label="System walkthrough" />
              <h2 className="max-w-[12ch] text-[clamp(3rem,4.9vw,5.65rem)] font-semibold leading-[0.9] tracking-normal text-neutral-950">
                {narrative.walkthroughTitle.map((line, index) => (
                  <span key={line} className={index === 1 ? "block pl-[14%]" : "block"}>
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <div className="hidden self-stretch border-l border-neutral-950/12 pl-4 font-mono text-[9px] uppercase leading-6 tracking-[0.18em] text-neutral-400 lg:grid">
              <span>Motion grammar</span>
              <span>Private request path</span>
              <span>Full system proof</span>
            </div>
            <div className="grid gap-5 lg:pb-2">
              <p className="max-w-[32rem] text-lg leading-[1.38] text-neutral-700 md:text-[1.18rem]">
                {narrative.walkthroughIntro}
              </p>
              <div className="border-y border-neutral-950/14">
                {narrative.walkthroughSignals.map((signal, index) => (
                  <div
                    key={signal.label}
                    className="grid gap-3 border-b border-neutral-950/10 py-3.5 last:border-b-0 md:grid-cols-[5.5rem_1fr]"
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                      {String(index + 1).padStart(2, "0")} / {signal.label}
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
                      {signal.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className={[
              "relative mx-auto w-full overflow-hidden p-3 lg:w-[82%] md:p-5",
              isAdvisory
                ? "border border-neutral-950/10 bg-[#f7f3ea]/90 shadow-[0_34px_110px_rgba(122,101,72,0.14)]"
                : "bg-neutral-950 shadow-[0_42px_130px_rgba(10,10,10,0.22)]",
            ].join(" ")}
          >
            <div
              className={[
                "mb-3 flex flex-wrap items-center justify-between gap-3 border-y px-3 py-2 font-mono text-[8px] uppercase tracking-[0.18em]",
                isAdvisory ? "border-neutral-950/12 text-neutral-500" : "border-white/12 text-white/52",
              ].join(" ")}
            >
              <span>Walkthrough / full system motion</span>
              <span>Sound optional / native controls</span>
            </div>
            <div
              className={[
                "relative aspect-video overflow-hidden border",
                isAdvisory ? "border-neutral-950/10 bg-white" : "border-white/10 bg-[#050505]",
              ].join(" ")}
            >
              <CaseMediaView media={walkthrough} priority fit="contain" scrollPlayback />
            </div>
            <div
              className={[
                "mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.18em]",
                isAdvisory ? "text-neutral-500" : "text-white/54",
              ].join(" ")}
            >
              <span>Motion grammar / private request path / case surface proof</span>
              <span>Proof / not a static mockup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseMediaChapter({
  media,
  index,
  reducedMotion,
  onInspect,
}: {
  media: CaseStoryMedia;
  index: number;
  reducedMotion: boolean;
  onInspect: (id: string) => void;
}) {
  const chapterRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start 92%", "end 8%"],
  });
  const direction = index % 2 === 0 ? 1 : -1;
  const imageX = useTransform(scrollYProgress, [0, 0.5, 1], [28 * direction, 0, -24 * direction]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [54, 0, -48]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.965, 1.012, 0.98]);
  const copyY = useTransform(scrollYProgress, [0, 0.5, 1], [26, 0, -24]);
  const alignRight = index % 2 === 1;
  const layout = [
    {
      article: "min-h-[760px] sm:min-h-[840px] lg:min-h-[900px]",
      image: "top-[9%] w-[min(86vw,58rem)]",
      copy: "bottom-[9%]",
      title: "text-5xl md:text-7xl",
      caption: "max-w-lg",
    },
    {
      article: "min-h-[620px] sm:min-h-[690px] lg:min-h-[730px]",
      image: "top-[11%] w-[min(82vw,45rem)]",
      copy: "bottom-[10%]",
      title: "text-4xl md:text-6xl",
      caption: "max-w-md",
    },
    {
      article: "min-h-[700px] sm:min-h-[770px] lg:min-h-[820px]",
      image: "top-[8%] w-[min(86vw,52rem)]",
      copy: "bottom-[8%]",
      title: "text-5xl md:text-[4.25rem]",
      caption: "max-w-lg",
    },
    {
      article: "min-h-[590px] sm:min-h-[650px] lg:min-h-[690px]",
      image: "top-[12%] w-[min(78vw,41rem)]",
      copy: "bottom-[10%]",
      title: "text-4xl md:text-5xl",
      caption: "max-w-md",
    },
  ][index % 4];

  return (
    <motion.article
      ref={chapterRef}
      layout
      className={["relative overflow-hidden border-t border-neutral-950/12 py-8 sm:py-10", layout.article].join(" ")}
      initial={{ opacity: 0.72 }}
      whileInView={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 18 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />
      <motion.div
        className={[
          "absolute aspect-video overflow-hidden border border-neutral-950/12 bg-[#f4f1ea]/64 shadow-[0_34px_100px_rgba(10,10,10,0.13)]",
          alignRight ? "right-[5%]" : "left-[5%]",
          layout.image,
        ].join(" ")}
        style={reducedMotion ? undefined : { x: imageX, y: imageY, scale: imageScale }}
      >
        <button
          type="button"
          onClick={() => onInspect(media.id)}
          className="group relative h-full w-full overflow-hidden bg-transparent text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
          aria-label={`Inspect ${media.label}`}
        >
          <CaseMediaView media={media} priority={index < 2} fit="contain" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(0,0,0,0.28))] opacity-0 transition duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute right-4 top-4 border-y border-white/18 bg-black/32 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/62 opacity-0 backdrop-blur-md transition duration-500 group-hover:opacity-100">
            Inspect surface
          </div>
        </button>
      </motion.div>

      <motion.div
        className={[
          "absolute z-10 max-w-xl border-l border-neutral-950/14 bg-[#f4f1ea]/78 py-5 pl-6 pr-4 backdrop-blur-sm",
          alignRight ? "left-[5%]" : "right-[5%]",
          layout.copy,
        ].join(" ")}
        style={reducedMotion ? undefined : { y: copyY }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
          Frame {String(index + 1).padStart(2, "0")} / {mediaRoleLabel(media.role)}
        </div>
        <h3 className={["mt-3 font-semibold leading-none tracking-normal text-neutral-950", layout.title].join(" ")}>
          {media.label}
        </h3>
        <p className={["mt-4 text-base leading-8 text-neutral-600", layout.caption].join(" ")}>{media.caption}</p>
      </motion.div>
    </motion.article>
  );
}

function MobileSurfaceRail({
  story,
  frames,
  onInspect,
}: {
  story: CaseStory;
  frames: CaseStoryMedia[];
  onInspect: (id: string) => void;
}) {
  const narrative = getCaseNarrative(story);
  const isAdvisoryCase = story.caseType === "advisory";
  const isCreatorOpsCase = story.slug === "creatorops";
  const isHospitalityCase = story.caseType === "hospitality";
  const usesTallPhoneFrames = isAdvisoryCase || isCreatorOpsCase;
  const phoneAspectClass = isCreatorOpsCase
    ? "aspect-[1080/2340] bg-neutral-950"
    : "aspect-[1080/2340] bg-transparent";
  const phoneShellClass = isCreatorOpsCase
    ? "border-neutral-950/10 bg-neutral-950/82 p-1"
    : isAdvisoryCase
      ? "border-black/[0.045] bg-white/78 p-1"
      : isHospitalityCase
        ? "border-black/[0.045] bg-[#f5f0e7]/78 p-1"
        : "border-black/[0.045] bg-[#f4f1ea]/72 p-1";
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const railRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(0);
  const wheelLockRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  if (!frames.length) return null;

  const wrapIndex = (index: number) => (index + frames.length) % frames.length;
  const clampIndex = (index: number) => Math.min(Math.max(index, 0), frames.length - 1);
  const setActive = (index: number, wrap = true) => {
    const nextIndex = wrap ? wrapIndex(index) : clampIndex(index);
    if (nextIndex === activeIndexRef.current) return;
    sound.playRole("transition");
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };
  const moveCarousel = (direction: 1 | -1) => setActive(activeIndex + direction);
  const handleCarouselWheel = (event: WheelEvent<HTMLElement>) => {
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
    const now = window.performance.now();

    if (horizontalIntent) {
      if (now - wheelLockRef.current < 520) return;

      event.preventDefault();
      wheelLockRef.current = now;
      moveCarousel(event.deltaX + event.deltaY > 0 ? 1 : -1);
      return;
    }

    const verticalIntent = Math.abs(event.deltaY) > 12;
    if (!verticalIntent || reduceMotion || frames.length < 2) return;
    if (window.innerWidth < 900 || window.matchMedia("(pointer: coarse)").matches) return;

    const section = railRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const inCaptureZone = rect.top < viewportHeight * 0.46 && rect.bottom > viewportHeight * 0.54;
    if (!inCaptureZone) return;

    const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;
    const currentIndex = activeIndexRef.current;
    const atBoundary =
      (direction > 0 && currentIndex >= frames.length - 1) ||
      (direction < 0 && currentIndex <= 0);

    if (atBoundary) return;
    if (now - wheelLockRef.current < 620) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    wheelLockRef.current = now;
    setActive(currentIndex + direction, false);
  };
  const circularOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = frames.length / 2;
    if (offset > half) offset -= frames.length;
    if (offset < -half) offset += frames.length;
    return offset;
  };

  return (
    <section
      ref={railRef}
      data-sound-safe-area
      className="mx-auto w-[min(94vw,1640px)] pb-20"
      onWheel={handleCarouselWheel}
    >
      <div className="grid gap-6 border-t border-neutral-950/12 pt-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(18rem,0.38fr)] lg:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
            Mobile surface carousel
          </div>
          <h3 className="mt-3 text-4xl font-semibold leading-none tracking-normal text-neutral-950 md:text-6xl">
            {narrative.mobileTitle}
          </h3>
        </div>
        <div className="grid gap-4 lg:justify-items-end lg:text-right">
          <p className="max-w-md text-sm leading-7 text-neutral-500">
            {narrative.mobileIntro}
          </p>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-neutral-950/12 bg-white/46 font-mono text-[13px] text-neutral-600 backdrop-blur-sm transition hover:-translate-x-0.5 hover:border-neutral-950/24 hover:bg-white hover:text-neutral-950"
              aria-label="Previous mobile frame"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => moveCarousel(1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-neutral-950/12 bg-white/46 font-mono text-[13px] text-neutral-600 backdrop-blur-sm transition hover:translate-x-0.5 hover:border-neutral-950/24 hover:bg-white hover:text-neutral-950"
              aria-label="Next mobile frame"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden border-y border-neutral-950/12 bg-white/16 py-8 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-950/6" />

        <motion.div
          className="relative h-[40rem] touch-pan-y select-none overflow-hidden sm:h-[43rem]"
          drag={frames.length > 1 && !reduceMotion ? "x" : false}
          dragElastic={0.12}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={(_, info) => setDragStart(info.point.x)}
          onDragEnd={(_, info) => {
            const start = dragStart ?? info.point.x;
            const delta = info.point.x - start;
            setDragStart(null);
            if (Math.abs(delta) < 44) return;
            moveCarousel(delta < 0 ? 1 : -1);
          }}
        >
          {frames.map((media, index) => {
            const offset = circularOffset(index);
            const depth = Math.abs(offset);
            const visible = depth <= 1 || frames.length <= 3;
            const active = index === activeIndex;
            const xOffset = offset * 250;
            const rotate = offset * -9;
            const scale = active ? 1 : 0.78;

            return (
              <motion.button
                key={media.id}
                type="button"
                onClick={() => (active ? onInspect(media.id) : setActive(index))}
                onMouseEnter={() => sound.playRole("hover")}
                onFocus={() => sound.playRole("hover")}
                className={[
                  "group absolute left-1/2 top-5 cursor-zoom-in text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
                  isCreatorOpsCase
                    ? "w-[min(52vw,16.5rem)] sm:w-[16rem]"
                    : isAdvisoryCase
                      ? "w-[min(58vw,18.5rem)] sm:w-[18rem]"
                      : "w-[min(64vw,21rem)] sm:w-[20rem]",
                ].join(" ")}
                style={{ pointerEvents: visible ? "auto" : "none" }}
                initial={reduceMotion ? false : { opacity: 0, y: 32, filter: "blur(10px)" }}
                animate={{
                  x: `calc(-50% + ${reduceMotion ? 0 : xOffset}px)`,
                  y: reduceMotion ? 0 : active ? 0 : 28,
                  scale: reduceMotion ? 1 : scale,
                  rotate: reduceMotion ? 0 : rotate,
                  opacity: reduceMotion ? (active ? 1 : 0) : visible ? (active ? 1 : 0.48) : 0,
                  filter: visible ? "blur(0px)" : "blur(10px)",
                  zIndex: 20 - depth,
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: active ? -10 : 16,
                        scale: active ? 1.035 : 0.82,
                        opacity: visible ? 1 : 0,
                      }
                }
                transition={reduceMotion ? { duration: 0.01 } : { duration: 0.72, ease }}
                aria-label={active ? `Inspect ${media.label}` : `Focus ${media.label}`}
              >
                <span
                  className={[
                    "block border shadow-[0_24px_78px_rgba(15,15,15,0.1)] backdrop-blur-sm",
                    phoneShellClass,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "relative block overflow-hidden shadow-[0_18px_64px_rgba(15,15,15,0.12)]",
                      phoneAspectClass,
                    ].join(" ")}
                  >
                    <CaseMediaView media={media} fit="contain" priority={active} />
                    <span
                      className={[
                        "pointer-events-none absolute inset-0",
                        usesTallPhoneFrames
                          ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%,rgba(0,0,0,0.06))]"
                          : "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_20%,rgba(0,0,0,0.18))]",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "pointer-events-none absolute bottom-3 right-3 border-y px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] opacity-0 backdrop-blur-md transition duration-500 group-hover:opacity-100",
                        isAdvisoryCase
                          ? "border-neutral-950/12 bg-white/72 text-neutral-600"
                          : "border-white/18 bg-black/36 text-white/62",
                      ].join(" ")}
                    >
                      {active ? "Inspect" : "Focus"}
                    </span>
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="relative mt-6 flex items-center justify-center gap-2">
          {frames.map((media, index) => (
            <button
              key={`${media.id}-dot`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2 rounded-full border transition ${
                index === activeIndex
                  ? "w-8 border-neutral-950 bg-neutral-950"
                  : "w-2 border-neutral-950/18 bg-white/50 hover:border-neutral-950/40"
              }`}
              aria-label={`Open mobile frame ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {frames.map((media, index) => (
          <button
            key={media.id}
            type="button"
            onClick={() => setActive(index)}
            className={`w-28 shrink-0 snap-center border p-1 transition ${
              index === activeIndex ? "border-neutral-950 bg-neutral-950" : "border-neutral-950/10 bg-white/50"
            }`}
            aria-label={`Focus ${media.label}`}
          >
            <span
              className={[
                "block overflow-hidden",
                phoneAspectClass,
              ].join(" ")}
            >
              <CaseMediaView media={media} fit="contain" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function EvidenceViewToggle({
  mode,
  onChange,
}: {
  mode: EvidenceViewMode;
  onChange: (mode: EvidenceViewMode) => void;
}) {
  const options: Array<{ value: EvidenceViewMode; label: string; caption: string }> = [
    { value: "sequence", label: "Flow", caption: "Cinematic" },
    { value: "atlas", label: "Atlas", caption: "Grid scan" },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-full border border-neutral-950/10 bg-white/48 p-1 backdrop-blur-sm">
      {options.map((option) => {
        const active = mode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "relative min-h-9 overflow-hidden rounded-full px-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
              active ? "text-white" : "text-neutral-400 hover:text-neutral-950",
            ].join(" ")}
            aria-pressed={active}
          >
            {active ? (
              <motion.span
                layoutId="case-evidence-view-active"
                className="absolute inset-0 rounded-full bg-neutral-950"
                transition={{ duration: 0.42, ease }}
              />
            ) : null}
            <span className="relative grid grid-cols-[auto_1fr] items-center gap-2">
              <span className={["h-1.5 w-1.5 rounded-full", active ? "bg-white" : "bg-neutral-950/18"].join(" ")} />
              <span className="grid">
                <span className="font-mono text-[9px] uppercase leading-none tracking-[0.16em]">{option.label}</span>
                <span className={["mt-1 hidden font-mono text-[8px] uppercase leading-none tracking-[0.13em] sm:block", active ? "text-white/48" : "text-neutral-300"].join(" ")}>
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

function EvidenceAtlasGrid({
  frames,
  totalFrames,
  expanded,
  reducedMotion,
  onInspect,
}: {
  frames: CaseStoryMedia[];
  totalFrames: number;
  expanded: boolean;
  reducedMotion: boolean;
  onInspect: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      className="relative overflow-hidden border-y border-neutral-950/12 bg-white/14 px-3 py-5 backdrop-blur-sm sm:px-5 md:px-6 md:py-7"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute right-[9%] top-6 h-[22rem] w-[30rem] rounded-[50%] border border-neutral-950/[0.045]" />
      <div className="relative mb-5 grid gap-3 border-b border-neutral-950/10 pb-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            Evidence atlas / {expanded ? "full field" : "first signal set"}
          </div>
          <p className="mt-2 max-w-[31rem] text-sm leading-6 text-neutral-600">
            Compact scan of the case surfaces, kept inside the same inspection system as the cinematic sequence.
          </p>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400 md:text-right">
          {String(frames.length).padStart(2, "0")} / {String(totalFrames).padStart(2, "0")} visible
        </div>
      </div>

      <motion.div layout className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {frames.map((media, index) => (
          <motion.button
            key={media.id}
            type="button"
            layout
            initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 14, scale: 0.985 }}
            transition={reducedMotion ? { duration: 0.01 } : { duration: 0.48, delay: Math.min(index, 8) * 0.035, ease }}
            onClick={() => onInspect(media.id)}
            className="group relative min-h-[16rem] overflow-hidden border border-neutral-950/10 bg-[#f4f1ea]/72 p-2 text-left shadow-[0_18px_52px_rgba(15,15,15,0.08)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 hover:-translate-y-1 hover:border-neutral-950/22 hover:shadow-[0_28px_74px_rgba(15,15,15,0.12)]"
            aria-label={`Inspect ${media.label}`}
          >
            <span className="relative block aspect-video overflow-hidden border border-neutral-950/10 bg-white/70">
              <CaseMediaView media={media} priority={index < INITIAL_EVIDENCE_FRAME_COUNT} />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_46%,rgba(0,0,0,0.08))]" />
            </span>
            <span className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-950/10 pt-3 font-mono text-[8px] uppercase tracking-[0.15em] text-neutral-400">
              <span>{String(index + 1).padStart(2, "0")} / {mediaRoleLabel(media.role)}</span>
              <span className="text-neutral-300 transition group-hover:text-neutral-700">Inspect</span>
            </span>
            <span className="mt-2 block text-lg font-semibold leading-tight tracking-normal text-neutral-950">
              {media.label}
            </span>
            <span className="mt-2 line-clamp-3 block text-[12px] leading-5 text-neutral-500">
              {media.caption}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

function ScreensAsEvidence({
  story,
  reducedMotion,
  onInspect,
}: {
  story: CaseStory;
  reducedMotion: boolean;
  onInspect: (id: string) => void;
}) {
  const frames = getEvidenceFrames(story);
  const mobileFrames = getMobileFrames(story);
  const narrative = getCaseNarrative(story);
  const evidenceSignals = narrative.screenSignals;
  const sound = useSound();
  const [viewMode, setViewMode] = useState<EvidenceViewMode>("sequence");
  const [expanded, setExpanded] = useState(false);
  const visibleFrames = expanded ? frames : frames.slice(0, INITIAL_EVIDENCE_FRAME_COUNT);
  const hasHiddenFrames = frames.length > INITIAL_EVIDENCE_FRAME_COUNT;
  const hiddenFrameCount = Math.max(0, frames.length - INITIAL_EVIDENCE_FRAME_COUNT);
  const fieldSummary = expanded
    ? `Full field / ${String(frames.length).padStart(2, "0")} visible`
    : `Compressed field / ${String(Math.min(frames.length, INITIAL_EVIDENCE_FRAME_COUNT)).padStart(2, "0")} visible / ${String(hiddenFrameCount).padStart(2, "0")} hidden`;
  const changeViewMode = (nextMode: EvidenceViewMode) => {
    if (nextMode === viewMode) return;
    sound.playRole("transition");
    setViewMode(nextMode);
  };
  const toggleExpanded = () => {
    sound.playRole(expanded ? "close" : "open");
    setExpanded((current) => !current);
  };

  return (
    <section id="case-media" data-sound-safe-area className="relative mx-auto w-[min(94vw,1640px)] py-10">
      <div className="mx-auto w-full">
        <div className="relative overflow-hidden border-y border-neutral-950/12 py-10 md:py-12">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-neutral-950/8" />
          <div className="pointer-events-none absolute right-[8%] top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border border-neutral-950/5" />
          <div className="grid gap-8 lg:grid-cols-[0.5fr_0.22fr_0.55fr] lg:items-end">
            <div>
              <SectionSignal index="03" label="Screens as evidence" />
              <h2 className="max-w-[10ch] text-[clamp(3.8rem,7vw,7.2rem)] font-semibold leading-[0.86] tracking-normal text-neutral-950">
                {narrative.screensTitle.map((line, index) => (
                  <span key={line} className={index === 1 ? "block pl-[18%]" : "block"}>
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <div className="hidden self-stretch border-l border-neutral-950/12 pl-4 font-mono text-[9px] uppercase leading-6 tracking-[0.18em] text-neutral-400 lg:grid">
              <span>Readable surfaces</span>
              <span>No crop theatre</span>
              <span>Proof sequence</span>
            </div>
            <div className="relative lg:pb-3">
              <div className="relative max-w-[42rem] border-y border-neutral-950/12 py-6">
                <div className="pointer-events-none absolute -left-12 top-1/2 hidden h-px w-12 bg-neutral-950/18 lg:block" />
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  Inspection readout
                </div>
                <p className="mt-4 max-w-[34rem] text-xl leading-[1.22] text-neutral-800 md:text-2xl">
                  {narrative.screensReadout}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-neutral-950/10 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">
                  {evidenceSignals.map((signal, index) => (
                    <span key={signal}>
                      {String(index + 1).padStart(2, "0")} / {signal}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-4 border-t border-neutral-950/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <EvidenceViewToggle mode={viewMode} onChange={changeViewMode} />
                  <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-neutral-400 sm:max-w-[16rem] sm:text-right">
                    {fieldSummary}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {viewMode === "sequence" ? (
            <motion.div
              key="sequence"
              layout
              className="border-y border-neutral-950/12"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={reducedMotion ? { duration: 0.01 } : { duration: 0.5, ease }}
            >
              <AnimatePresence initial={false}>
                {visibleFrames.map((media, index) => (
                  <CaseMediaChapter
                    key={media.id}
                    media={media}
                    index={index}
                    reducedMotion={reducedMotion}
                    onInspect={onInspect}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EvidenceAtlasGrid
              key="atlas"
              frames={visibleFrames}
              totalFrames={frames.length}
              expanded={expanded}
              reducedMotion={reducedMotion}
              onInspect={onInspect}
            />
          )}
        </AnimatePresence>
      </div>

      {hasHiddenFrames ? (
        <div className="relative mx-auto grid w-full gap-6 border-b border-neutral-950/12 px-0 py-8 md:grid-cols-2 md:py-10">
          <div className="hidden md:block" />
          <motion.div layout className="max-w-[30rem] md:justify-self-end">
            <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-neutral-400">
              {expanded
                ? `Full evidence field / ${String(frames.length).padStart(2, "0")} case surfaces`
                : `Extended evidence field / ${String(hiddenFrameCount).padStart(2, "0")} more surfaces`}
            </div>
            <p className="mt-3 text-[14px] leading-7 text-neutral-600">
              {expanded
                ? "The full surface is open. Collapse it back into the focused five-frame readout when the story needs more air."
                : "The case keeps its cinematic pace first, then unfolds the rest of the proof when the viewer asks for it."}
            </p>
            <button
              type="button"
              onClick={toggleExpanded}
              className="mt-5 inline-flex min-h-10 items-center rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
              aria-expanded={expanded}
            >
              {expanded ? "Close evidence field ->" : "Open full evidence field ->"}
            </button>
          </motion.div>
        </div>
      ) : null}
      <MobileSurfaceRail story={story} frames={mobileFrames} onInspect={onInspect} />
    </section>
  );
}

function ProofBecomesSystem({ story }: { story: CaseStory }) {
  const narrative = getCaseNarrative(story);
  const proofNodes = proofLedger.map((item, index) => ({
    ...item,
    label: narrative.proofLabels[index] ?? item.label,
    text: story.evidencePoints[index] ?? item.text,
  }));
  const systemSpine = story.systemLayers.slice(0, 6);
  const compactClaim = story.proofClaim;

  return (
    <section
      id="case-proof-system"
      className="relative mx-auto w-[min(94vw,1640px)] overflow-hidden py-8 md:py-10"
    >
      <div className="relative overflow-hidden border-y border-neutral-950/12 bg-white/10 px-4 py-9 backdrop-blur-sm sm:px-6 md:px-8 md:py-11">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="pointer-events-none absolute left-[12%] top-[12%] h-[28rem] w-[44rem] rounded-[50%] border border-neutral-950/[0.045]" />
        <div className="pointer-events-none absolute bottom-[22%] left-[24%] h-px w-[52vw] rotate-[-5deg] bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />

        <div className="relative grid gap-9 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <div className="relative z-10">
            <SectionSignal index="04" label="Proof becomes system" />
            <h2 className="max-w-[10ch] text-[clamp(3.3rem,6.8vw,6.4rem)] font-semibold leading-[0.84] tracking-normal text-neutral-950">
              Proof becomes system.
            </h2>

            <div className="mt-7 max-w-[25rem] border-y border-neutral-950/12 py-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                Proof map key
              </div>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                A short synthesis layer: what the previous screens prove before the case turns into an available foundation.
              </p>
              <div className="mt-4 grid grid-cols-3 border-y border-neutral-950/10 py-3 font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-500">
                <span>Evidence</span>
                <span>Logic</span>
                <span>System</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-5 lg:ml-auto lg:w-[min(100%,52rem)]">
            <div className="relative overflow-hidden border-y border-neutral-950/12 px-0 py-5 md:py-6">
              <div className="pointer-events-none absolute right-[4%] top-[7%] hidden h-[15rem] w-[28rem] rounded-[50%] border border-neutral-950/[0.045] lg:block" />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden h-full w-full text-neutral-950/14 lg:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M 4 48 C 28 36, 56 65, 96 34" fill="none" stroke="currentColor" strokeWidth="0.14" strokeDasharray="1 1.8" />
                <path d="M 8 75 C 34 50, 60 58, 94 62" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="0.8 2" />
              </svg>

              <div className="relative max-w-[39rem]">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  System claim
                </div>
                <p className="mt-3 max-w-[38rem] text-[clamp(1.8rem,2.75vw,2.85rem)] leading-[1.02] text-neutral-950">
                  {compactClaim}
                </p>
              </div>

              <div className="relative mt-6 border-t border-neutral-950/12">
                {proofNodes.map((item, index) => (
                  <div
                    key={item.label}
                    className="grid gap-3 border-b border-neutral-950/10 py-3.5 md:grid-cols-[3.5rem_minmax(8rem,0.3fr)_1fr] md:items-baseline md:gap-4"
                  >
                    <div className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="text-xl font-semibold leading-tight tracking-normal text-neutral-950">
                      {item.label}
                    </h3>
                    <p className="max-w-[29rem] text-[13px] leading-6 text-neutral-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:ml-auto lg:w-[82%]">
              <div className="relative grid gap-4">
                <div className="relative border-y border-neutral-950/12 py-3.5">
                  <div className="grid gap-y-3 font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-500 sm:grid-cols-[7rem_1fr] sm:gap-x-5">
                    <span className="text-neutral-400">System spine</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {systemSpine.map((layer, index) => (
                        <span key={layer.title} className="grid grid-cols-[1.55rem_1fr] gap-2">
                          <span className="text-neutral-300">{String(index + 1).padStart(2, "0")}</span>
                          <span>{layer.title}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AvailableFoundation({ story, onOpenProject }: { story: CaseStory; onOpenProject?: () => void }) {
  if (!story.availability) return null;

  const narrative = getCaseNarrative(story);
  const blueprintMedia =
    story.slug === "aurel-eon-gt"
      ? findMedia(story, "desktop-6") ?? findMedia(story, "collection") ?? story.mediaSequence[0]
      : findMedia(story, "collection") ?? findMedia(story, "threshold") ?? story.mediaSequence[0];
  const technicalRows = story.technicalFoundation.length > 0 ? story.technicalFoundation : technicalLedger;
  const terms = [
    "Commissioned adaptation",
    story.availability.exclusivityAvailable ? "Exclusivity discussed" : "Shared direction",
    "Not a template",
  ];
  const adaptationValue =
    story.slug === "barcelona-private-advisory"
      ? "Market lens, shortlist dossier, inquiry handoff."
      : story.slug === "aurel-eon-gt"
        ? "Product states, inspect flow, private preview."
      : story.caseType === "advisory"
      ? "Market structure, shortlist flow, private intake."
      : story.caseType === "workflow-tool" || story.caseType === "tool"
        ? "Workflow steps, state model, output logic."
        : story.slug === "oria-house-barcelona"
          ? "Rooms, stay rituals, booking contact."
      : story.caseType === "hospitality"
        ? "Place identity, menu structure, visitor flow."
        : story.slug === "arcwave-integrations"
          ? "Service system, install logic, quote brief."
        : story.caseType === "premium-website"
          ? "Offer model, content architecture, inquiry flow."
            : story.caseType === "presentation-system" || story.caseType === "experimental"
              ? "Content model, media rhythm, motion direction."
              : "Brand, product structure, inquiry flow.";
  const blueprintChips =
    story.slug === "barcelona-private-advisory"
      ? ["Market lens", "Dossier handoff"]
      : story.slug === "aurel-eon-gt"
        ? ["Product states", "Private preview"]
      : story.caseType === "advisory"
      ? ["Private intake", "Deployable front-end"]
      : story.caseType === "workflow-tool" || story.caseType === "tool"
        ? ["Workflow logic", "Deployable product"]
        : story.slug === "oria-house-barcelona"
          ? ["Room system", "Booking contact"]
        : story.caseType === "hospitality"
          ? ["Visitor utility", "Deployable front-end"]
      : story.slug === "arcwave-integrations"
        ? ["Install logic", "Quote-ready surface"]
      : story.caseType === "premium-website"
        ? ["Service architecture", "Quote-ready surface"]
            : story.caseType === "presentation-system" || story.caseType === "experimental"
              ? ["Media rhythm", "Deployable surface"]
              : ["Private commerce", "Deployable front-end"];
  const passportRows = [
    {
      label: "Fit",
      value: story.availability.bestFor?.slice(0, 3).join(" / ") ?? "Jewelry / Fashion / Collector objects",
    },
    {
      label: "Adaptation",
      value: adaptationValue,
    },
    {
      label: "Terms",
      value: terms.slice(0, 2).join(" / "),
    },
  ];

  return (
    <section
      id="case-available"
      className="relative mx-auto w-[min(94vw,1640px)] overflow-hidden py-8 md:py-10"
    >
      <div className="relative mx-auto overflow-hidden border-y border-neutral-950/12 bg-white/10">
        <div className="pointer-events-none absolute inset-y-8 right-[4%] w-[40%] rounded-[50%] bg-neutral-950/6 blur-3xl" />
        <div className="pointer-events-none absolute left-[8%] top-4 h-[38rem] w-[58rem] rotate-[-8deg] rounded-[50%] border border-neutral-950/[0.055]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid w-full gap-8 px-4 py-10 sm:px-6 md:px-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.43fr_0.57fr] lg:items-end">
            <div>
              <SectionSignal index="05" label="Available / trust" />
              <h2 className="max-w-[11ch] text-[clamp(4.2rem,8.6vw,8rem)] font-semibold leading-[0.84] tracking-normal text-neutral-950">
                Available foundation.
              </h2>
            </div>
            <div className="border-y border-neutral-950/12 py-5 lg:mb-4 lg:ml-0 lg:w-[34rem] lg:max-w-none xl:ml-4 xl:w-[36rem]">
              <p className="max-w-none text-2xl leading-[1.04] text-neutral-800 md:text-[2rem] xl:text-[2.08rem]">
                {narrative.availableStatement}
              </p>
              <p className="mt-4 max-w-[33rem] text-sm leading-7 text-neutral-500 xl:max-w-[35rem]">
                {story.availability.summary}
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
            <div
              className="relative min-h-[28rem] overflow-hidden bg-neutral-950 p-6 text-white shadow-[0_30px_110px_rgba(15,15,15,0.2)] md:p-7"
              style={{ clipPath: "polygon(0 0, 100% 0, 94% 100%, 0 92%)" }}
            >
              <div className="absolute inset-0 opacity-34">
                <CaseMediaView media={blueprintMedia} fit="cover" />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_66%_28%,rgba(255,255,255,0.13),transparent_24%),linear-gradient(90deg,rgba(3,3,3,0.96),rgba(10,10,10,0.82)_58%,rgba(3,3,3,0.94))]" />
              <div className="pointer-events-none absolute left-[18%] top-[16%] h-[76%] w-[72%] rounded-[50%] border border-white/12" />
              <div className="pointer-events-none absolute left-6 right-6 top-[43%] h-px bg-gradient-to-r from-white/34 via-white/10 to-transparent" />
              <div className="pointer-events-none absolute bottom-24 left-6 h-px w-[58%] rotate-[-8deg] bg-white/16" />
              <div className="relative flex h-full min-h-[23rem] flex-col justify-between">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/46">
                    Commission blueprint
                  </div>
                  <p className="mt-10 max-w-[23rem] text-3xl leading-[1.02] text-white md:text-4xl">
                    {narrative.availableBlueprint}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/12 pt-4 font-mono text-[8px] uppercase tracking-[0.16em] text-white/54">
                  {blueprintChips.map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
            <div className="grid gap-3 md:grid-cols-3">
              {passportRows.map((row, index) => (
                <div key={row.label} className="border-y border-neutral-950/12 py-4 md:min-h-36">
                  <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400">
                    {String(index + 1).padStart(2, "0")} / {row.label}
                  </div>
                  <div className="mt-5 text-lg leading-7 text-neutral-800 md:text-[1.35rem]">{row.value}</div>
                </div>
              ))}
            </div>

            <div className="border-y border-neutral-950/12 py-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                Deployable surface
              </div>
              <div className="mt-3 grid gap-y-2 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 sm:grid-cols-2 sm:gap-x-5">
                {technicalRows.slice(0, 6).map((item, index) => (
                  <span key={item} className="grid grid-cols-[1.6rem_1fr] gap-2 border-t border-neutral-950/8 pt-2 first:border-t-0 sm:first:border-t">
                    <span className="text-neutral-300">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.replace("Next.js App Router + TypeScript", "Next.js + TypeScript").replace("Metadata / Open Graph preparation", "Metadata / Open Graph").replace(/\.$/, "")}</span>
                  </span>
                ))}
              </div>
            </div>
            </div>
          </div>

          <div className="grid gap-5 border-y border-neutral-950/12 px-4 py-5 md:grid-cols-[1fr_auto] md:items-center">
            <p className="max-w-4xl text-sm leading-7 text-neutral-500">
              Final ownership, content, visual reuse, and adaptation terms are defined per project.
            </p>
            <SignalButton onClick={onOpenProject}>{story.availability.ctaLabel}</SignalButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileReaderSection({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <MobileMotionSection
      as="section"
      variant="media"
      delay="soft"
      data-sound-safe-area
      className={["relative overflow-hidden border-t border-neutral-950/12 px-4 py-7 md:px-10 md:py-10", className].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:58px_58px]" />
      <div className="pointer-events-none absolute right-[10%] top-8 h-56 w-56 rounded-full border border-neutral-950/[0.045]" />
      <div className="relative md:mx-auto md:w-[min(100%,46rem)]">
        <div className="mb-4 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          <span className="h-px w-10 bg-neutral-950/18" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="max-w-[10ch] text-[clamp(2.25rem,11vw,3.45rem)] font-semibold leading-[0.92] tracking-normal text-neutral-950 md:max-w-[12ch] md:text-[clamp(3.25rem,8vw,4.75rem)]">
          {title}
        </h2>
        {children}
      </div>
    </MobileMotionSection>
  );
}

function MobileProofSpine({ story }: { story: CaseStory }) {
  const steps = getMobileReaderSteps(story);

  return (
    <div className="mt-7 border-y border-neutral-950/12 py-3 md:mt-8 md:py-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400">
        {isSpanishCaseStory(story) ? "Secuencia de prueba" : "Case proof spine"}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2 md:grid-cols-6 md:gap-x-4">
        {steps.map((step) => (
          <div key={step.index} className="border-t border-neutral-950/10 pt-2">
            <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-300">
              {step.index}
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-600">
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileCaseHero({
  story,
  liveLink,
}: {
  story: CaseStory;
  liveLink?: { label: string; href: string };
}) {
  const titleLines = getTitleLines(story.headline);

  return (
    <MobileMotionSection as="section" variant="threshold" className="relative overflow-hidden px-4 pb-5 pt-24 md:px-10 md:pb-8 md:pt-28" data-sound-safe-area>
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:58px_58px]" />
      <div className="pointer-events-none absolute left-[8%] top-[8rem] h-[34rem] w-[32rem] rounded-[50%] border border-neutral-950/[0.055]" />
      <div className="relative md:mx-auto md:w-[min(100%,46rem)]">
        <div className="flex max-w-[20rem] flex-wrap gap-2 sm:max-w-none md:max-w-[44rem]">
          {[
            isSpanishCaseStory(story) ? "Sistema de caso" : "Case system",
            getAvailabilitySignal(story),
            getCaseTypeLabel(story),
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-neutral-950/10 bg-white/48 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-500 backdrop-blur-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <h1 className="mt-8 text-[clamp(3.75rem,18vw,5.5rem)] font-semibold leading-[0.84] tracking-normal text-neutral-950 md:text-[clamp(5.25rem,11.2vw,6.45rem)]">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-7 max-w-[13ch] text-[clamp(1.85rem,7.5vw,2.65rem)] leading-[1.04] text-neutral-800 md:max-w-[18ch] md:text-[clamp(2.55rem,5.8vw,3.2rem)]">
          {story.subheadline}
        </p>
        <p className="mt-5 max-w-[36ch] text-[14px] leading-7 text-neutral-600 md:max-w-[52ch] md:text-[15px] md:leading-8">
          {getMobileHeroSummary(story)}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {liveLink ? <SignalButton href={liveLink.href}>{liveLink.label}</SignalButton> : null}
          <span className="inline-flex min-h-10 items-center rounded-full border border-neutral-950/10 bg-white/54 px-4 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500 backdrop-blur-sm">
            {getAvailabilitySignal(story)}
          </span>
        </div>

        <MobileProofSpine story={story} />
      </div>
    </MobileMotionSection>
  );
}

function MobileWalkthroughProof({ story }: { story: CaseStory }) {
  const walkthrough = getWalkthroughMedia(story);

  return (
    <MobileReaderSection
      eyebrow={getMobileSectionEyebrow(story, "Watch")}
      title={isSpanishCaseStory(story) ? "Recorrido del sistema." : "System walkthrough."}
    >
      <p className="mt-4 max-w-[36ch] text-[14px] leading-7 text-neutral-600 md:max-w-[52ch] md:text-[15px] md:leading-8">
        {getMobileWalkthroughLine(story)}
      </p>
      <div data-sound-safe-area className="-mx-4 mt-5 overflow-hidden bg-neutral-950 shadow-[0_18px_54px_rgba(15,15,15,0.14)] md:mx-0 md:mt-7">
        <div className="aspect-video overflow-hidden bg-black">
          <CaseMediaView media={walkthrough} priority fit="contain" scrollPlayback />
        </div>
      </div>
    </MobileReaderSection>
  );
}

function MobileEvidenceReader({
  story,
  onInspect,
}: {
  story: CaseStory;
  onInspect: (id: string) => void;
}) {
  const frames = useMemo(
    () => getMobileEvidenceFrames(story).slice(0, INITIAL_EVIDENCE_FRAME_COUNT),
    [story],
  );
  const initialFrameIndex = useMemo(() => getMobileEvidenceInitialIndex(frames), [frames]);

  if (!frames.length) return null;

  return <MobileEvidenceDeck story={story} frames={frames} initialIndex={initialFrameIndex} onInspect={onInspect} />;
}

function MobileEvidenceDeck({
  story,
  frames,
  initialIndex,
  onInspect,
}: {
  story: CaseStory;
  frames: CaseStoryMedia[];
  initialIndex: number;
  onInspect: (id: string) => void;
}) {
  const sound = useSound();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const dragConsumedRef = useRef(false);
  const activeFrame = frames[activeIndex] ?? frames[initialIndex] ?? frames[0];

  const setActive = (index: number) => {
    const nextIndex = (index + frames.length) % frames.length;
    if (nextIndex === activeIndex) return;
    sound.playRole("transition");
    setActiveIndex(nextIndex);
  };

  const handleDragEnd = (info: PanInfo) => {
    const delta = getMobileSwipeDelta(info);
    dragConsumedRef.current = Math.abs(info.offset.x) > 8;

    if (delta !== 0) setActive(activeIndex + delta);

    window.setTimeout(() => {
      dragConsumedRef.current = false;
    }, 0);
  };

  return (
    <MobileReaderSection
      eyebrow={getMobileSectionEyebrow(story, "Frames")}
      title={isSpanishCaseStory(story) ? "Pantallas como evidencia." : "Screens as evidence."}
    >
      <p className="mt-4 max-w-[36ch] text-[14px] leading-7 text-neutral-600 md:max-w-[52ch] md:text-[15px] md:leading-8">
        {getMobileEvidenceReadout(story)}
      </p>

      <div
        className="relative mx-[-1.75rem] mt-5 min-h-[19.75rem] touch-pan-y overflow-hidden sm:min-h-[23.5rem] md:mx-0 md:mt-7 md:min-h-[27rem]"
        style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        data-sound-safe-area
      >
        <div className="pointer-events-none absolute left-[7%] top-[5%] h-[88%] w-[86%] rounded-[50%] border border-neutral-950/[0.055]" />
        <div className="pointer-events-none absolute left-[-6%] top-[49%] h-px w-[112%] rotate-[-6deg] bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />

        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={(_event, info) => handleDragEnd(info)}
          style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
        >
          {frames.map((frame, index) => {
            let offset = index - activeIndex;
            while (offset > frames.length / 2) offset -= frames.length;
            while (offset < -frames.length / 2) offset += frames.length;

            if (Math.abs(offset) > 1.8) return null;

            const activePlane = offset === 0;
            const x = activePlane ? 0 : offset * 76;
            const y = activePlane ? 0 : offset < 0 ? 14 : 10;
            const rotateZ = activePlane ? 0 : offset < 0 ? -5 : 5;
            const rotateY = activePlane ? 0 : offset < 0 ? 14 : -14;
            const scale = activePlane ? 1 : 0.72;
            const opacity = activePlane ? 1 : 0.24;

            return (
              <motion.button
                key={frame.id}
                type="button"
                aria-label={`Inspect ${frame.label}`}
                aria-pressed={activePlane}
                onClick={() => {
                  if (!activePlane) {
                    setActive(index);
                    return;
                  }

                  if (dragConsumedRef.current) return;
                  onInspect(frame.id);
                }}
                className={[
                  "absolute left-1/2 top-1/2 w-[calc(100%+0.75rem)] max-w-[44rem] overflow-hidden bg-transparent p-0 text-left shadow-none outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/35",
                ].join(" ")}
                style={{
                  zIndex: 30 - Math.abs(offset) * 5,
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                  opacity,
                  x: `calc(-50% + ${x}%)`,
                  y: `calc(-50% + ${y}px)`,
                  rotateZ,
                  rotateY,
                  scale,
                  filter: `blur(${activePlane ? 0 : 0.6}px)`,
                }}
                transition={{ duration: 0.58, ease }}
              >
                <span className="relative block aspect-video overflow-hidden bg-transparent">
                  <CaseMediaView media={frame} priority={activePlane || index < 2} fit="contain" className="p-0" />
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-4 border-y border-neutral-950/12 py-3">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
          {isSpanishCaseStory(story) ? "Pantalla" : "Frame"} {String(activeIndex + 1).padStart(2, "0")} / {mediaRoleLabel(activeFrame.role)}
        </div>
        <h3 className="mt-2 text-[1.55rem] font-semibold leading-tight tracking-normal text-neutral-950">
          {activeFrame.label}
        </h3>
        <p className="mt-2 max-w-[36ch] text-[14px] leading-6 text-neutral-600 md:max-w-[52ch] md:text-[15px] md:leading-7">
          {activeFrame.caption}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {frames.map((frame, index) => (
            <button
              key={`${frame.id}-desktop-evidence-dot`}
              type="button"
              onClick={() => setActive(index)}
              className={[
                "h-2 rounded-full border transition",
                index === activeIndex
                  ? "w-8 border-neutral-950 bg-neutral-950"
                  : "w-2 border-neutral-950/18 bg-white/60",
              ].join(" ")}
              aria-label={`Open evidence frame ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setActive(activeIndex - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-neutral-950/12 bg-white/54 font-mono text-[13px] text-neutral-600"
            aria-label="Previous evidence frame"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => setActive(activeIndex + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-neutral-950/12 bg-white/54 font-mono text-[13px] text-neutral-600"
            aria-label="Next evidence frame"
          >
            &gt;
          </button>
        </div>
      </div>
    </MobileReaderSection>
  );
}

function MobileProofSummary({ story }: { story: CaseStory }) {
  const narrative = getCaseNarrative(story);
  const proofNodes = proofLedger.map((item, index) => ({
    ...item,
    label: narrative.proofLabels[index] ?? item.label,
    text: story.evidencePoints[index] ?? item.text,
  }));
  const systemSpine = story.systemLayers.slice(0, 6);

  return (
    <MobileReaderSection
      eyebrow={getMobileSectionEyebrow(story, "Proof")}
      title={isSpanishCaseStory(story) ? "La prueba se vuelve sistema." : "Proof becomes system."}
    >
      <p className="mt-4 max-w-[19ch] text-[clamp(1.35rem,5.8vw,1.9rem)] leading-[1.08] text-neutral-950 md:max-w-[29ch] md:text-[clamp(2rem,4.7vw,2.55rem)] md:leading-[1.05]">
        {story.proofClaim}
      </p>
      <div className="mt-6 border-y border-neutral-950/12 md:mt-8">
        {proofNodes.map((item, index) => (
          <MobileMotionLedgerRow key={item.label} className="border-b border-neutral-950/10 py-3.5 last:border-b-0 md:grid md:grid-cols-[3rem_minmax(12rem,0.42fr)_1fr] md:items-baseline md:gap-4 md:py-5">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-2 text-[1.55rem] font-semibold leading-tight tracking-normal text-neutral-950 md:mt-0 md:text-[1.65rem]">
              {item.label}
            </h3>
            <p className="mt-2 max-w-[36ch] text-[14px] leading-6 text-neutral-600 md:mt-0 md:max-w-[34rem] md:text-[15px] md:leading-7">{item.text}</p>
          </MobileMotionLedgerRow>
        ))}
      </div>
      <div className="mt-5 border-y border-neutral-950/12 py-3">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          {isSpanishCaseStory(story) ? "Estructura del sistema" : "System spine"}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-3">
          {systemSpine.map((layer, index) => (
            <span
              key={layer.title}
              className="grid grid-cols-[1.35rem_1fr] gap-2 border-t border-neutral-950/8 py-2 font-mono text-[8px] uppercase leading-4 tracking-[0.13em] text-neutral-500"
            >
              <span className="text-neutral-300">{String(index + 1).padStart(2, "0")}</span>
              <span>{layer.title}</span>
            </span>
          ))}
        </div>
      </div>
    </MobileReaderSection>
  );
}

function MobileFoundationSection({
  story,
  liveLink,
  onOpenProject,
  onBackToWork,
}: {
  story: CaseStory;
  liveLink?: { label: string; href: string };
  onOpenProject?: () => void;
  onBackToWork: () => void;
}) {
  if (!story.availability) return null;

  const narrative = getCaseNarrative(story);
  const ctaLabel = story.availability.ctaLabel;
  const technicalRows = story.technicalFoundation.length > 0 ? story.technicalFoundation : technicalLedger;
  const adaptationValue =
    isSpanishCaseStory(story) && story.slug === "barcelona-private-advisory"
      ? "Lente de mercado, dossier de shortlist, handoff de consulta."
      : isSpanishCaseStory(story) && story.slug === "creatorops"
        ? "Pasos de workflow, estados, lógica de salida."
      : isSpanishCaseStory(story) && story.slug === "house-of-lune"
        ? "Marca, estructura de producto, ruta de consulta."
      : story.slug === "barcelona-private-advisory"
      ? "Market lens, shortlist dossier, inquiry handoff."
      : story.slug === "aurel-eon-gt"
        ? "Product states, inspect flow, private preview."
      : story.caseType === "advisory"
      ? "Market structure, shortlist flow, private intake."
      : story.caseType === "workflow-tool" || story.caseType === "tool"
        ? "Workflow steps, state model, output logic."
        : story.slug === "oria-house-barcelona"
          ? "Rooms, stay rituals, booking contact."
      : story.caseType === "hospitality"
        ? "Place identity, menu structure, visitor flow."
        : story.slug === "arcwave-integrations"
          ? "Service system, install logic, quote brief."
        : story.caseType === "premium-website"
          ? "Offer model, content architecture, inquiry flow."
            : story.caseType === "presentation-system" || story.caseType === "experimental"
              ? "Content model, media rhythm, motion direction."
        : "Brand, product structure, inquiry flow.";
  const deployableHighlights = technicalRows.slice(0, 3).map((item) =>
    item
      .replace("Next.js App Router + TypeScript", "Next.js + TypeScript")
      .replace("Metadata / Open Graph preparation", "Metadata / Open Graph")
      .replace("Dynamic product detail pages through structured product data", "Structured product data")
      .replace(/\.$/, ""),
  );
  const passportRows = [
    {
      label: isSpanishCaseStory(story) ? "Encaje" : "Fit",
      value: story.availability.bestFor?.slice(0, 3).join(" / ") ?? "Jewelry / Fashion / Collector objects",
    },
    {
      label: isSpanishCaseStory(story) ? "Adaptación" : "Adaptation",
      value: adaptationValue,
    },
    {
      label: isSpanishCaseStory(story) ? "Condiciones" : "Terms",
      value: story.availability.exclusivityAvailable
        ? isSpanishCaseStory(story)
          ? "Adaptación por encargo / Exclusividad a definir"
          : "Commissioned adaptation / Exclusivity discussed"
        : isSpanishCaseStory(story)
          ? "Adaptación por encargo / Dirección compartida"
          : "Commissioned adaptation / Shared direction",
    },
  ];

  return (
    <MobileMotionSection
      as="section"
      variant="closing"
      delay="soft"
      data-footer-rail-state="closing"
      data-sound-safe-area
      className="relative overflow-hidden border-t border-neutral-950/12 px-4 pb-24 pt-7 md:px-10 md:pt-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:58px_58px]" />
      <div className="pointer-events-none absolute right-[-18%] top-12 h-72 w-72 rounded-full border border-neutral-950/[0.045]" />
      <div className="relative md:mx-auto md:w-[min(100%,46rem)]">
        <div className="mb-4 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          <span className="h-px w-10 bg-neutral-950/18" />
          <span>{getMobileSectionEyebrow(story, "Adapt")}</span>
        </div>

        <div className="border-y border-neutral-950/12 py-4">
          <h2 className="max-w-[11ch] text-[clamp(2rem,9vw,2.9rem)] font-semibold leading-[0.94] tracking-normal text-neutral-950 md:max-w-[14ch] md:text-[clamp(3rem,7.2vw,4.25rem)]">
            {isSpanishCaseStory(story) ? "Base disponible." : "Available foundation."}
          </h2>
          <p className="mt-3 max-w-[30ch] text-[15px] leading-6 text-neutral-700 md:max-w-[52ch] md:leading-7">
            {getMobileAvailableStatement(story, narrative.availableStatement)}
          </p>
        </div>

        <div className="border-b border-neutral-950/12">
          {passportRows.map((row, index) => (
            <MobileMotionLedgerRow key={row.label} className="grid grid-cols-[4.6rem_1fr] gap-3 border-b border-neutral-950/10 py-3 last:border-b-0 md:grid-cols-[7rem_1fr] md:gap-5 md:py-4">
              <div className="font-mono text-[8px] uppercase leading-4 tracking-[0.18em] text-neutral-400">
                {String(index + 1).padStart(2, "0")} / {row.label}
              </div>
              <div className="text-[0.98rem] leading-6 text-neutral-900">{row.value}</div>
            </MobileMotionLedgerRow>
          ))}
        </div>

        <div className="mt-4 border-y border-neutral-950/12 py-3">
          <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400">
            {isSpanishCaseStory(story) ? "Superficie desplegable" : "Deployable surface"}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {deployableHighlights.map((item) => (
              <span key={item} className="border border-neutral-950/10 bg-white/45 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.13em] text-neutral-500">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-neutral-950/12 pt-5">
          <p className="max-w-[25ch] text-[1.28rem] font-semibold leading-[1.08] tracking-normal text-neutral-950 md:max-w-[34ch] md:text-[1.65rem]">
            {isSpanishCaseStory(story)
              ? "Usar esta base cuando el encaje sea claro, o encargar una con la misma claridad."
              : "Use this foundation when the fit is right, or commission one with the same clarity."}
          </p>
          <div data-sound-safe-area className="mt-5 grid gap-3 md:grid-cols-[repeat(3,minmax(0,auto))] md:justify-start">
            <SignalButton onClick={onOpenProject}>{ctaLabel}</SignalButton>
            {liveLink ? (
              <SignalButton variant="secondary" href={liveLink.href}>
                {liveLink.label}
              </SignalButton>
            ) : null}
            <SignalButton variant="quiet" onClick={onBackToWork}>
              {isSpanishCaseStory(story) ? "Volver a proyectos" : "Back to Work"}
            </SignalButton>
          </div>
        </div>
      </div>
    </MobileMotionSection>
  );
}

function MobilePhoneCarousel({
  story,
  onInspect,
}: {
  story: CaseStory;
  onInspect: (id: string) => void;
}) {
  const frames = getMobileFrames(story);
  const narrative = getCaseNarrative(story);
  const sound = useSound();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const dragConsumedRef = useRef(false);
  if (!frames.length) return null;

  const activeFrame = frames[activeIndex] ?? frames[0];
  const setActive = (index: number) => {
    const nextIndex = (index + frames.length) % frames.length;
    if (nextIndex === activeIndex) return;
    sound.playRole("transition");
    setActiveIndex(nextIndex);
  };
  const handleDragEnd = (info: PanInfo) => {
    const delta = getMobileSwipeDelta(info);
    dragConsumedRef.current = Math.abs(info.offset.x) > 8;

    if (delta !== 0) {
      setActive(activeIndex + delta);
    }

    window.setTimeout(() => {
      dragConsumedRef.current = false;
    }, 0);
  };

  return (
    <MobileReaderSection eyebrow={getMobileSectionEyebrow(story, "Mobile")} title={narrative.mobileTitle}>
      <p className="mt-4 max-w-[36ch] text-[14px] leading-7 text-neutral-600 md:max-w-[52ch] md:text-[15px] md:leading-8">
        {narrative.mobileIntro}
      </p>

      <div
        className="relative mx-[-1.75rem] mt-9 min-h-[31rem] touch-pan-y overflow-visible sm:min-h-[36rem] md:mx-0 md:min-h-[38rem]"
        style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        data-sound-safe-area
      >
        <div className="pointer-events-none absolute left-[8%] top-[4%] h-[92%] w-[84%] rounded-[50%] border border-neutral-950/[0.05]" />
        <div className="pointer-events-none absolute left-[-8%] top-[52%] h-px w-[116%] rotate-[-5deg] bg-gradient-to-r from-transparent via-neutral-950/12 to-transparent" />
        <div className="pointer-events-none absolute bottom-[11%] left-[8%] h-20 w-[84%] bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.1),transparent_68%)] blur-xl" />

        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={prefersReducedMotion ? 0 : 0.12}
          dragMomentum={false}
          onDragEnd={(_event, info) => handleDragEnd(info)}
          style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
        >
          {frames.map((frame, index) => {
            let offset = index - activeIndex;
            while (offset > frames.length / 2) offset -= frames.length;
            while (offset < -frames.length / 2) offset += frames.length;

            if (Math.abs(offset) > 1.8) return null;

            const activePlane = offset === 0;
            const x = activePlane ? 0 : offset * 54;
            const y = activePlane ? 0 : offset < 0 ? 18 : 12;
            const rotateZ = activePlane ? 0 : offset < 0 ? -5.5 : 5.5;
            const rotateY = activePlane ? 0 : offset < 0 ? 18 : -18;
            const scale = activePlane ? 1 : 0.78;
            const opacity = activePlane ? 1 : 0.3;

            return (
              <motion.button
                key={frame.id}
                type="button"
                aria-label={`Inspect ${frame.label}`}
                aria-pressed={activePlane}
                onClick={() => {
                  if (!activePlane) {
                    setActive(index);
                    return;
                  }

                  if (dragConsumedRef.current) return;
                  onInspect(frame.id);
                }}
                className="absolute left-1/2 top-1/2 w-[min(74vw,18.25rem)] overflow-visible bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/35"
                style={{
                  zIndex: 30 - Math.abs(offset) * 5,
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                  opacity,
                  x: `calc(-50% + ${x}%)`,
                  y: `calc(-50% + ${y}px)`,
                  rotateZ,
                  rotateY,
                  scale,
                  filter: `blur(${activePlane ? 0 : 0.7}px)`,
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease }}
              >
                <span
                  className={[
                    "relative block aspect-[9/16] overflow-hidden bg-neutral-950",
                    activePlane
                      ? "shadow-[0_28px_80px_rgba(15,15,15,0.16)]"
                      : "shadow-[0_18px_54px_rgba(15,15,15,0.12)]",
                  ].join(" ")}
                >
                  <CaseMediaView media={frame} fit="contain" priority={activePlane || index < 2} />
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-950/12 pt-4">
        <div className="flex gap-2">
          {frames.map((frame, index) => (
            <button
              key={`${frame.id}-mobile-orbit-dot`}
              type="button"
              onClick={() => setActive(index)}
              className={[
                "h-2 rounded-full border transition",
                index === activeIndex
                  ? "w-8 border-neutral-950 bg-neutral-950"
                  : "w-2 border-neutral-950/18 bg-white/60",
              ].join(" ")}
              aria-label={`Open mobile frame ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActive(activeIndex - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-neutral-950/12 bg-white/54 font-mono text-[13px] text-neutral-600"
            aria-label="Previous mobile frame"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => setActive(activeIndex + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-neutral-950/12 bg-white/54 font-mono text-[13px] text-neutral-600"
            aria-label="Next mobile frame"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="mt-4 border-b border-neutral-950/12 pb-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeFrame.id}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease }}
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              Mobile {String(activeIndex + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
            </div>
            <h3 className="mt-2 text-[1.55rem] font-semibold leading-tight tracking-normal text-neutral-950">
              {activeFrame.label}
            </h3>
            <p className="mt-2 max-w-[36ch] text-[14px] leading-6 text-neutral-600">{activeFrame.caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </MobileReaderSection>
  );
}

function MobileCaseReader({
  story,
  liveLink,
  onInspect,
  onOpenProject,
  onBackToWork,
}: {
  story: CaseStory;
  liveLink?: { label: string; href: string };
  onInspect: (id: string) => void;
  onOpenProject?: () => void;
  onBackToWork: () => void;
}) {
  return (
    <div className="lg:hidden">
      <MobileCaseHero story={story} liveLink={liveLink} />
      <MobileWalkthroughProof story={story} />
      <MobileEvidenceReader key={`${story.slug}-mobile-evidence`} story={story} onInspect={onInspect} />
      <MobileProofSummary story={story} />
      <MobilePhoneCarousel story={story} onInspect={onInspect} />
      <MobileFoundationSection
        story={story}
        liveLink={liveLink}
        onOpenProject={onOpenProject}
        onBackToWork={onBackToWork}
      />
    </div>
  );
}

function LabFallback({
  drawerOpen,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  const navigate = useNavigate();

  const goBack = () => startSpaPageTransition(navigate, "/work", onCloseProject);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-neutral-950">
      <AtmosphericSiteShell preset="case" />
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />
      <PageSurface className="tablet-reader-surface relative z-10 mx-auto flex min-h-screen w-[min(92vw,1180px)] items-center pt-28">
        <div className="max-w-2xl border-y border-neutral-950/12 py-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
            Work lab / missing story
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-normal text-neutral-950 md:text-7xl">
            This case is not in the V2 lab yet.
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            The public work archive is still available. The lab route only opens cases that
            already have a Case System Story data record.
          </p>
          <SignalButton onClick={goBack}>Back to Work</SignalButton>
        </div>
      </PageSurface>
    </div>
  );
}

export default function CasePageV2({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
  noIndex = false,
}: PageProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { locale } = useI18n();
  const sound = useSound();
  const reduceMotion = useReducedMotion();
  const sourceStory = useMemo(() => getCaseStory(slug), [slug]);
  const isUnavailableSpanishStory =
    locale === "es" && (!isSpanishPublicCaseStorySlug(slug) || !sourceStory?.translations?.es);
  const story = useMemo(
    () => (sourceStory ? localizeCaseStory(sourceStory, locale) : null),
    [locale, sourceStory],
  );
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);

  const spineItems = useMemo(
    () => caseSpineItems.filter((item) => story?.availability || item.id !== "case-available"),
    [story],
  );
  const activeSpineId = useSectionRailActive(spineItems, spineItems[0]?.id);
  const inspectFrames = useMemo(
    () => story?.mediaSequence.filter((media) => media.kind !== "video") ?? [],
    [story],
  );
  const openInspect = useCallback(
    (mediaId: string) => {
      const nextIndex = inspectFrames.findIndex((media) => media.id === mediaId);
      if (nextIndex < 0) return;
      sound.playRole("open");
      setInspectIndex(nextIndex);
    },
    [inspectFrames, sound],
  );

  if (isUnavailableSpanishStory) {
    return <Navigate to={getLocalizedPath("/work", locale)} replace />;
  }

  if (!story) {
    return (
      <>
        <CaseMeta story={story} noIndex={noIndex} locale={locale} />
        <LabFallback
          drawerOpen={drawerOpen}
          onOpenProject={onOpenProject}
          onCloseProject={onCloseProject}
        />
      </>
    );
  }

  const thresholdMedia = getThresholdMedia(story);
  const heroFragments = getHeroFragments(story);
  const visibleLinks = story.links ?? [];
  const titleLines = getTitleLines(story.headline);
  const narrative = getCaseNarrative(story);
  const closingMove = getClosingMove(story);
  const secondaryClosingLink = getSecondaryClosingLink(story, visibleLinks);
  const primaryLiveLink = visibleLinks[0]
    ? {
        ...visibleLinks[0],
        label: isSpanishCaseStory(story) ? "Ver caso" : visibleLinks[0].label,
      }
    : secondaryClosingLink;
  const isAdvisoryCase = story.caseType === "advisory";
  const isCreatorOpsCase = story.slug === "creatorops";
  const isFormIndexCase = story.slug === "form-index";
  const isHospitalityCase = story.caseType === "hospitality";
  const isPremiumWebsiteCase = story.caseType === "premium-website";
  const isPresentationCase =
    story.caseType === "presentation-system" || story.caseType === "experimental";
  const isLuxuryHeroCase =
    story.caseType === "luxury-product" || story.caseType === "product-system";
  const hasAlignedHeroCards = true;
  const heroPrimaryShellClass = isAdvisoryCase
    ? "border border-neutral-950/10 bg-white/92 p-2 shadow-[0_38px_116px_rgba(30,30,30,0.12)] hover:shadow-[0_48px_132px_rgba(30,30,30,0.16)] md:p-3"
    : isCreatorOpsCase
      ? "border border-neutral-950/10 bg-white/84 p-2 shadow-[0_34px_104px_rgba(15,15,15,0.16)] hover:shadow-[0_44px_124px_rgba(15,15,15,0.22)] md:p-3"
      : isFormIndexCase
        ? "border border-neutral-950/8 bg-white/34 p-1.5 shadow-[0_30px_94px_rgba(24,24,24,0.1)] hover:shadow-[0_42px_118px_rgba(24,24,24,0.16)] md:p-2"
      : isHospitalityCase
        ? "border border-[#d7cec0]/95 bg-[#faf5ed]/94 p-2 shadow-[0_34px_102px_rgba(76,60,32,0.12)] hover:shadow-[0_44px_122px_rgba(76,60,32,0.16)] md:p-3"
        : isPremiumWebsiteCase
          ? "border border-[#d6dfeb]/92 bg-[#fbfdff]/92 p-2 shadow-[0_34px_102px_rgba(34,64,110,0.12)] hover:shadow-[0_44px_122px_rgba(34,64,110,0.16)] md:p-3"
          : isPresentationCase
            ? "border border-white/14 bg-[#10131a]/95 p-2 shadow-[0_34px_106px_rgba(8,10,18,0.22)] hover:shadow-[0_46px_128px_rgba(8,10,18,0.3)] md:p-3"
            : isLuxuryHeroCase
              ? "border border-[#4b4439]/42 bg-[#0e0d0b]/95 p-2 shadow-[0_34px_104px_rgba(14,12,10,0.22)] hover:shadow-[0_46px_126px_rgba(14,12,10,0.3)] md:p-3"
              : "border border-white/16 bg-[#111317]/95 p-2 shadow-[0_34px_104px_rgba(12,12,12,0.22)] hover:shadow-[0_46px_126px_rgba(12,12,12,0.3)] md:p-3";
  const heroPrimaryMediaClass = isAdvisoryCase
    ? "saturate-[1.02]"
    : isCreatorOpsCase
      ? "brightness-[1.03] saturate-[1.04]"
      : isFormIndexCase
        ? "brightness-[1.04] saturate-[1.01] contrast-[1.01]"
      : isHospitalityCase
        ? "brightness-[1.01] saturate-[0.98]"
        : isPremiumWebsiteCase
          ? "brightness-[1.02] saturate-[0.98]"
          : "brightness-[1.02] saturate-[1.03]";
  const heroPrimaryOverlayClass = isAdvisoryCase
    ? "bg-[radial-gradient(circle_at_58%_36%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.1),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.18))]"
    : isCreatorOpsCase
      ? "bg-[radial-gradient(circle_at_58%_36%,rgba(255,255,255,0.11),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.04),transparent_54%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.035))]"
      : isFormIndexCase
        ? "bg-transparent"
      : isHospitalityCase
        ? "bg-[radial-gradient(circle_at_60%_34%,rgba(255,250,240,0.18),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.08),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(112,92,62,0.08))]"
        : isPremiumWebsiteCase
          ? "bg-[radial-gradient(circle_at_60%_34%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.08),transparent_54%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(45,86,138,0.08))]"
          : isPresentationCase
            ? "bg-[radial-gradient(circle_at_58%_36%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.03),transparent_54%),linear-gradient(180deg,rgba(255,255,255,0.01),rgba(0,0,0,0.18))]"
            : "bg-[radial-gradient(circle_at_58%_36%,rgba(255,255,255,0.07),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.03),transparent_54%),linear-gradient(180deg,rgba(255,255,255,0.01),rgba(0,0,0,0.16))]";
  const heroPrimaryMetaClass =
    isAdvisoryCase || isFormIndexCase || isHospitalityCase || isPremiumWebsiteCase ? "text-neutral-600" : "text-white/62";
  const heroPrimaryReadinessClass =
    isAdvisoryCase || isFormIndexCase || isHospitalityCase || isPremiumWebsiteCase ? "text-neutral-500" : "text-white/52";
  const heroPrimaryTitleClass =
    isAdvisoryCase || isFormIndexCase || isHospitalityCase || isPremiumWebsiteCase ? "text-neutral-950" : "text-white";
  const heroFragmentShellClass = isAdvisoryCase
    ? "border-neutral-950/10 bg-white/90 shadow-[0_16px_54px_rgba(30,30,30,0.1)] hover:shadow-[0_24px_72px_rgba(30,30,30,0.14)]"
    : isCreatorOpsCase
      ? "border-neutral-950/10 bg-white/88 shadow-[0_18px_58px_rgba(15,15,15,0.13)] hover:shadow-[0_28px_78px_rgba(15,15,15,0.2)]"
      : isFormIndexCase
        ? "border-neutral-950/8 bg-white/42 shadow-[0_14px_46px_rgba(24,24,24,0.1)] hover:shadow-[0_22px_66px_rgba(24,24,24,0.15)]"
      : isHospitalityCase
        ? "border-[#d7cec0]/90 bg-[#fbf6ee]/90 shadow-[0_16px_52px_rgba(76,60,32,0.1)] hover:shadow-[0_24px_72px_rgba(76,60,32,0.14)]"
        : isPremiumWebsiteCase
          ? "border-[#d6dfeb]/88 bg-[#fbfdff]/88 shadow-[0_16px_52px_rgba(34,64,110,0.1)] hover:shadow-[0_24px_72px_rgba(34,64,110,0.14)]"
          : isPresentationCase
            ? "border-white/14 bg-[#11141a]/92 shadow-[0_18px_56px_rgba(8,10,18,0.18)] hover:shadow-[0_26px_76px_rgba(8,10,18,0.24)]"
            : isLuxuryHeroCase
              ? "border-[#4b4439]/40 bg-[#0e0d0b]/92 shadow-[0_18px_56px_rgba(14,12,10,0.18)] hover:shadow-[0_26px_76px_rgba(14,12,10,0.24)]"
              : "border-white/16 bg-[#111317]/92 shadow-[0_18px_56px_rgba(12,12,12,0.18)] hover:shadow-[0_26px_76px_rgba(12,12,12,0.24)]";
  const heroFragmentMediaClass = isAdvisoryCase
    ? "opacity-100 saturate-[1.02]"
    : isCreatorOpsCase
      ? "opacity-100 saturate-[1.04] brightness-[1.03]"
      : isFormIndexCase
        ? "opacity-100 brightness-[1.04] saturate-[1.01] contrast-[1.01]"
      : isHospitalityCase
        ? "opacity-[0.98] saturate-[0.98] brightness-[1.01]"
        : isPremiumWebsiteCase
          ? "opacity-[0.98] saturate-[0.98] brightness-[1.02]"
          : "opacity-[0.94] saturate-[1.03] brightness-[1.02]";
  const heroFragmentOverlayClass = isAdvisoryCase
    ? "bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0.1))]"
    : isCreatorOpsCase
      ? "bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.07),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.055))]"
      : isFormIndexCase
        ? "bg-transparent"
      : isHospitalityCase
        ? "bg-[radial-gradient(circle_at_50%_40%,rgba(255,250,240,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(112,92,62,0.08))]"
        : isPremiumWebsiteCase
          ? "bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(45,86,138,0.08))]"
          : "bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.01),rgba(0,0,0,0.24))]";
  const heroFragmentMetaClass =
    isAdvisoryCase || isFormIndexCase || isHospitalityCase || isPremiumWebsiteCase ? "text-neutral-600" : "text-white/72";
  const goToWork = () => startSpaPageTransition(navigate, getLocalizedPath("/work", locale), onCloseProject);
  const openProject = () => onOpenProject?.();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f1ea] text-neutral-950">
      <CaseMeta story={story} noIndex={noIndex} locale={locale} />
      <AtmosphericSiteShell preset="case" />
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />
      <CaseSystemSpine
        items={spineItems}
        activeId={activeSpineId}
        onSelect={scrollToRailSection}
      />

      <PageSurface className="tablet-reader-surface relative z-10">
        <main>
          <MobileCaseReader
            story={story}
            liveLink={primaryLiveLink}
            onInspect={openInspect}
            onOpenProject={openProject}
            onBackToWork={goToWork}
          />

          <div className="hidden lg:block">
          <section
            id="case-threshold"
            className="relative mx-auto min-h-screen w-[min(94vw,1640px)] overflow-hidden pb-12 pt-28 lg:min-h-[930px]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-neutral-950/14" />
            <div className="pointer-events-none absolute left-[7%] top-[12%] h-[78%] w-[76%] rounded-[50%] border border-neutral-950/6" />
            <div className="pointer-events-none absolute right-[2%] top-[20%] h-[54%] w-[44%] rounded-[50%] bg-neutral-950/7 blur-3xl" />

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="relative z-20 max-w-[52rem] lg:max-w-[43%] xl:max-w-[45%]"
            >
              <div className="flex flex-wrap items-center gap-2">
                {["Case system", getAvailabilitySignal(story), story.caseType.replace("-", " ")].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-neutral-950/10 bg-white/42 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500 backdrop-blur-sm"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>

              <h1 className="mt-10 text-[clamp(5.1rem,11.2vw,10.4rem)] font-semibold leading-[0.82] tracking-normal text-neutral-950">
                {titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <div className="mt-8 max-w-[35rem]">
                <p className="text-3xl leading-[1.08] text-neutral-800 md:text-5xl">
                  {story.subheadline}
                </p>
                <p className="mt-6 text-[15px] leading-8 text-neutral-600 md:text-base">
                  {story.summary}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {visibleLinks[0] ? (
                    <SignalButton href={visibleLinks[0].href}>{visibleLinks[0].label}</SignalButton>
                  ) : null}
                  <SignalButton variant="secondary" onClick={openProject}>
                    {story.availability?.ctaLabel ?? "Start a project"}
                  </SignalButton>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 42, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.08, ease }}
              className="relative z-10 mt-14 min-h-[520px] lg:absolute lg:bottom-16 lg:right-2 lg:mt-0 lg:h-[650px] lg:w-[52%] xl:right-8 xl:h-[690px]"
            >
              <div className="absolute inset-0 border border-neutral-950/10 bg-white/18 backdrop-blur-[1px]" />
              <motion.button
                type="button"
                onClick={() => openInspect(thresholdMedia.id)}
                onMouseEnter={() => sound.playRole("hover")}
                onFocus={() => sound.playRole("hover")}
                whileHover={reduceMotion ? undefined : { y: -12, scale: 1.022, rotate: -1.2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.992 }}
                animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, -0.35, 0.25, 0] }}
                transition={reduceMotion ? undefined : { duration: 7.5, repeat: Infinity, repeatType: "mirror", ease }}
                className={[
                  "absolute left-[6%] top-[9%] h-[64%] w-[76%] cursor-zoom-in overflow-hidden text-left transition-shadow duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
                  heroPrimaryShellClass,
                ].join(" ")}
                style={
                  hasAlignedHeroCards
                    ? undefined
                    : { clipPath: "polygon(0 5%, 96% 0, 100% 86%, 7% 100%)" }
                }
              >
                <CaseMediaView
                  media={thresholdMedia}
                  priority
                  ambient
                  className={heroPrimaryMediaClass}
                />
                <div className={["absolute inset-0", heroPrimaryOverlayClass].join(" ")} />
                <div className={["absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.18em]", heroPrimaryMetaClass].join(" ")}>
                  {narrative.heroMeta}
                </div>
                <div className="absolute bottom-14 left-5 right-5">
                  <div className={["font-mono text-[10px] uppercase tracking-[0.18em]", heroPrimaryReadinessClass].join(" ")}>
                    {narrative.heroReadiness}
                  </div>
                  <div className={["mt-2 max-w-md text-2xl font-semibold leading-tight tracking-normal md:text-3xl", heroPrimaryTitleClass].join(" ")}>
                    {narrative.heroMediaTitle}
                  </div>
                </div>
              </motion.button>

              {heroFragments.map((media, index) => (
                <motion.button
                  key={media.id}
                  type="button"
                  onClick={() => openInspect(media.id)}
                  onMouseEnter={() => sound.playRole("hover")}
                  onFocus={() => sound.playRole("hover")}
                  className={[
                    `absolute ${
                      hasAlignedHeroCards
                        ? (alignedHeroFragmentFrames[index] ?? alignedHeroFragmentFrames[0])
                        : (heroFragmentFrames[index] ?? heroFragmentFrames[0])
                    } cursor-zoom-in overflow-hidden border p-1.5 text-left backdrop-blur-sm transition-shadow duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300`,
                    heroFragmentShellClass,
                  ].join(" ")}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 1,
                          y: [0, -7 - index * 2, 0],
                          rotate: index % 2 === 0 ? [0, 0.55, -0.35, 0] : [0, -0.55, 0.35, 0],
                        }
                  }
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -14 - index * 2,
                          scale: 1.055,
                          rotate: index % 2 === 0 ? 2.2 : -2.2,
                          zIndex: 35,
                        }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: { duration: 0.62, delay: 0.22 + index * 0.08, ease },
                          y: { duration: 5.8 + index * 0.9, repeat: Infinity, repeatType: "mirror", ease },
                          rotate: { duration: 6.4 + index * 0.8, repeat: Infinity, repeatType: "mirror", ease },
                          scale: { duration: 0.42, ease },
                        }
                  }
                  style={
                    hasAlignedHeroCards
                      ? undefined
                      : { clipPath: heroFragmentShapes[index] ?? heroFragmentShapes[0] }
                  }
                >
                  <span
                    className={["block h-full w-full", heroFragmentMediaClass].join(" ")}
                  >
                    <CaseMediaView media={media} />
                  </span>
                  <div className={["absolute inset-0", heroFragmentOverlayClass].join(" ")} />
                  <div className={["absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-[0.14em]", heroFragmentMetaClass].join(" ")}>
                    signal {index + 1} / {mediaRoleLabel(media.role)}
                  </div>
                </motion.button>
              ))}

              <div className="absolute bottom-4 right-4 grid max-w-[23rem] gap-px border border-neutral-950/10 bg-[#f4f1ea]/72 text-[9px] uppercase tracking-[0.16em] text-neutral-600 backdrop-blur-md sm:grid-cols-2">
                {story.systemTags.slice(0, 4).map((tag) => (
                  <span key={tag} className="border-neutral-950/8 px-3 py-2 sm:border-r sm:odd:border-r">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>

          <SystemWalkthroughTheatre story={story} />
          <ScreensAsEvidence
            story={story}
            reducedMotion={Boolean(reduceMotion)}
            onInspect={openInspect}
          />
          <ProofBecomesSystem story={story} />
          <AvailableFoundation story={story} onOpenProject={openProject} />

          <section
            id="case-closing"
            className="mx-auto w-[min(94vw,1640px)] pb-10 pt-5"
            data-footer-rail-state="closing"
            data-sound-safe-area
          >
            <div className="relative overflow-hidden border-y border-neutral-950/12 bg-white/8 px-4 py-10 backdrop-blur-sm sm:px-6 md:px-8 md:py-12">
              <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] [background-size:72px_72px]" />
              <div className="pointer-events-none absolute right-[4%] top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full border border-neutral-950/[0.055]" />
              <div className="pointer-events-none absolute right-[20%] top-[12%] h-[19rem] w-[31rem] rotate-[-15deg] rounded-[50%] border border-neutral-950/[0.045]" />
              <div className="relative grid min-h-[29rem] gap-8 lg:grid-cols-[0.62fr_0.38fr] lg:items-end">
                <div className="relative z-10">
                  <SectionSignal index="06" label="Final conversion" />
                  <p className="max-w-[12ch] text-[clamp(3.3rem,7.1vw,7.2rem)] font-semibold leading-[0.86] tracking-normal text-neutral-950">
                    {closingMove.headline}
                  </p>
                </div>

                <div className="relative z-10 grid gap-5 border-y border-neutral-950/12 py-5 lg:mb-5">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                      Next move
                    </div>
                    <p className="mt-4 max-w-[28rem] text-2xl leading-[1.12] text-neutral-800 md:text-[1.7rem]">
                      {closingMove.prompt}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 border-y border-neutral-950/12 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500">
                    {closingMove.steps.map((step) => (
                      <span key={step}>{step}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <SignalButton onClick={openProject}>
                      {story.availability?.ctaLabel ?? "Start a project"}
                    </SignalButton>
                    <SignalButton variant="secondary" href={secondaryClosingLink.href}>
                      {secondaryClosingLink.label}
                    </SignalButton>
                    <SignalButton variant="quiet" onClick={goToWork}>
                      Back to Work
                    </SignalButton>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
        </main>

        <SiteFooterV2 variant="case" />
      </PageSurface>
      <CinematicInspectReveal
        frames={inspectFrames}
        index={inspectIndex}
        onClose={() => setInspectIndex(null)}
        onSelect={setInspectIndex}
      />
    </div>
  );
}
