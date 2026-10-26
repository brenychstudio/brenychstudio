import type { PublicLocale } from "./projectRegistry.types";
import type { VideoAssetId } from "../media/video/videoAssets";

// Presentation model for the Owner-approved public product collection.
// No private source paths, investor figures or provider credentials belong in this data.
export type DossierCopy = {
  category: string; stage: string; headline: string; summary: string;
  overviewTitle: string; problem: string; solution: string; audience: string;
  capabilities: { title: string; body: string }[];
  galleryTitle: string; status: string; next: string; demoStatus: string;
  videoCaption: string; videoDescription: string; seoTitle: string; seoDescription: string;
};
export type DossierImage = {
  id: string; src: string; srcSet: string; full: string; width: number; height: number;
  alt: Record<PublicLocale, string>; caption: Record<PublicLocale, string>;
  evidenceLabel?: Record<PublicLocale, string>;
};
export type ProductDossier = {
  id: string; slug: string; name: string; shortName: string;
  category: "product" | "core-technology" | "spatial" | "digital-human";
  stage: "working-prototype" | "internal-production" | "desktop-mvp" | "technology-showcase";
  publicationStatus: "public"; featured: boolean;
  composition: "learning" | "asset" | "workflow" | "advisor" | "intelligence" | "spatial" | "editorial" | "knowledge" | "networking" | "atlas" | "operations" | "intent" | "control";
  technology: string[]; relatedIds: string[];
  demoLinks: { label: Record<PublicLocale,string>; href: string }[];
  locales: Record<PublicLocale, DossierCopy> & Partial<Record<"ua" | "ru", DossierCopy>>;
  hero: DossierImage; gallery: DossierImage[];
  limitations?: Record<PublicLocale, string[]>;
  evidence?: Record<PublicLocale, {title:string;body:string}[]>;
  credits?: {name:string;creator:string;url:string;license:string;licenseUrl:string}[];
  video?: { assetId: VideoAssetId; poster: string; duration: string };
};
export function picture(slug: string, id: string, width: number, height: number, en: string, es: string, enCaption: string, esCaption: string): DossierImage {
  const base = `/product-media/${slug}/${id}`;
  const sizes = [640,1280,1920].filter((n,i,a) => i === 0 || Math.min(n,width) !== Math.min(a[i-1],width));
  return { id, src: `${base}-1280.webp`, full: `${base}-1920.webp`,
    srcSet: sizes.map(n => `${base}-${n}.webp ${Math.min(n,width)}w`).join(", "),
    width, height, alt: {en,es}, caption: {en:enCaption,es:esCaption} };
}

// Presentation only: retain the precise authoring/manifest duration unchanged.
export function formatDemoDuration(duration: string): string {
  const [minutes, seconds] = duration.split(":").map(Number);
  return `${minutes}:${Math.floor(seconds).toString().padStart(2, "0")}`;
}

const spanishTechnology: Record<string,string> = {
  "Experiment records":"Registros de experimentos",
  "Production integration layer":"Capa de integración de producción",
  "Review and decision workflow":"Proceso de revisión y decisión",
  "Intent Core":"Núcleo de intenciones",
  "Acquisition Engine":"Motor de adquisición",
  "Transactional storage":"Almacenamiento transaccional",
  "Notion integration layer":"Capa de integración con Notion",
  "Revision core":"Núcleo de revisiones",
  "Access control":"Control de acceso",
  "Git and Cloudflare adapters":"Adaptadores Git y Cloudflare",
  "AI proposal boundaries":"Límites de propuestas de IA",

  "Windows desktop":"Aplicación de Windows", "Local document library":"Biblioteca local de documentos",
  "Source-linked search":"Búsqueda con fuentes", "WebGL knowledge map":"Mapa de conocimiento WebGL",
  "Android application":"Aplicación Android", "Contact capture and review":"Captura y revisión de contactos",
  "Local demo companion":"Compañero de demostración local", "Mobile spatial interface":"Interfaz espacial móvil",
  "Location and sensor context":"Contexto de ubicación y sensores", "Solar-position planning":"Planificación de posición solar",
  "Local photo storage":"Almacenamiento local de fotografías",
  "Interactive web prototype":"Prototipo web interactivo", "Scenario-based learning":"Aprendizaje por escenarios",
  "Publishing adapters":"Adaptadores de publicación", "Approval workflow":"Proceso de aprobación",
  "Conversational interface":"Interfaz conversacional", "Controlled navigation":"Navegación controlada",
  "Conversation system":"Sistema conversacional", "Context memory":"Memoria de contexto", "Controlled tools":"Herramientas controladas",
  "Browser 3D":"3D en navegador", "Spatial navigation":"Navegación espacial", "Desktop application":"Aplicación de escritorio",
  "Local production engine":"Motor local de producción", "Directed output formats":"Formatos con dirección propia",
};
export function technologyLabel(name:string,locale:PublicLocale):string {
  return locale==="es" ? spanishTechnology[name]??name : name;
}

export const productCategoryLabels: Record<ProductDossier["category"],Record<PublicLocale,string>> = {
  product:{en:"Software & creative tools",es:"Software y herramientas creativas"},
  "core-technology":{en:"Core technologies",es:"Tecnologías propias"},
  spatial:{en:"Spatial experiences",es:"Experiencias espaciales"},
  "digital-human":{en:"Digital humans",es:"Humanos digitales"},
};
