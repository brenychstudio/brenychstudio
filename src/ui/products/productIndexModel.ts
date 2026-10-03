import type { PublicProductCatalogEntry } from "../../data/productCatalog";
import type { PublicProductPresentation } from "../../data/productPresentation";
import type { ProjectRecord, PublicLocale } from "../../data/projectRegistry.types";
import { productGroups, type ProductGroupId } from "../../data/productPresentationConfig";
import { getLocalizedPath, hasSpanishPublicEquivalent } from "../../i18n/routes";
import { getRouteModuleKey } from "../../routing/routeModules";

export const MAX_HERO_PLANES = 3;
export const MAX_FEATURED_PRODUCTS = 3;
export const MAX_OPEN_REGISTER_PREVIEWS = 1;
export type ProductIndexItem = { entry: PublicProductCatalogEntry; project: ProjectRecord; presentation: PublicProductPresentation };
export type ProductChapter = { id: string; index: string; label: string };
export type ProductIndexModel = {
  locale: PublicLocale;
  items: readonly ProductIndexItem[];
  featured: readonly ProductIndexItem[];
  featuredOverflow: number;
  chapters: ProductChapter[];
  groups: { id: ProductGroupId; label: string; count: number }[];
  showFilters: boolean;
};
export type ProductTarget = { id: string; productId: string; kind: "featured" | "register" };
export type HeroSlot = { item: ProductIndexItem; role: "active" | "supporting-first" | "supporting-second" };

export function createProductIndexModel(input: readonly ProductIndexItem[], locale: PublicLocale): ProductIndexModel {
  const ids = new Set<string>(); const slugs = new Set<string>();
  for (const {entry,project} of input) {
    if (ids.has(project.id) || slugs.has(entry.slug)) throw new Error("Duplicate product ID or slug");
    if (entry.projectId !== project.id) throw new Error("Product identity mismatch");
    ids.add(project.id); slugs.add(entry.slug);
  }
  const items = input.filter(item => item.project.visibility === "public-listed" && item.project.vertical === "product" && item.entry.locales.includes(locale));
  const candidates = items.filter(item => item.entry.featured);
  const featured = candidates.slice(0, MAX_FEATURED_PRODUCTS);
  const labels = locale === "es" ? ["Umbral", "Destacados", "Registro", "Estudio", "Iniciar"] : ["Threshold", "Featured", "Register", "Studio", "Start"];
  const chapterIds = ["products-threshold", ...(featured.length ? ["products-featured"] : []), "products-index", "products-studio", "products-commercial"];
  const chapters = chapterIds.map((id,index) => ({ id, index: String(index+1).padStart(2,"0"), label: labels[["products-threshold","products-featured","products-index","products-studio","products-commercial"].indexOf(id)] }));
  const groups = (Object.keys(productGroups) as ProductGroupId[]).map(id => ({id,label:productGroups[id][locale],count:items.filter(item=>item.presentation.group === id).length})).filter(group=>group.count>0);
  return {locale,items,featured,chapters,groups,showFilters:items.length>=4 && groups.length>=2,featuredOverflow:Math.max(0,candidates.length-MAX_FEATURED_PRODUCTS)};
}

export function getHeroWindow(items: readonly ProductIndexItem[], activeProductId: string | null): HeroSlot[] {
  if (!items.length) return [];
  const start = Math.max(0,items.findIndex(item=>item.project.id===activeProductId));
  const roles: HeroSlot["role"][] = ["active","supporting-first","supporting-second"];
  return Array.from({length:Math.min(items.length,MAX_HERO_PLANES)},(_,index)=>({item:items[(start+index)%items.length],role:roles[index]}));
}

export function resolveProductTarget(productId: string, model: ProductIndexModel): ProductTarget | null {
  if (!model.items.some(item=>item.project.id===productId)) return null;
  return {id:`products-${productId}`,productId,kind:model.featured.some(item=>item.project.id===productId)?"featured":"register"};
}

export function filterProductItems(model: ProductIndexModel, group: string): readonly ProductIndexItem[] {
  return group === "all" ? model.items : model.items.filter(item=>item.presentation.group===group);
}

export type StudioDomain = { id: "products" | "research" | "spatial" | "worlds"; label: string; description: string; href: string | null; productIds: string[]; evidence: { name: string; href: string }[] };
export function projectStudioDomains(model: ProductIndexModel, registry: readonly ProjectRecord[] = []): StudioDomain[] {
  const es=model.locale==="es";
  const published = registry.filter(project=>project.visibility==="public-listed");
  const spatial = published.filter(project=>project.vertical==="spatial-interactive").flatMap(project=>{
    const route=project.routes.find(route=>route.surface==="immersive" && !route.noIndex && route.locales.includes(model.locale) && getRouteModuleKey(route.path) && (model.locale!=="es" || hasSpanishPublicEquivalent(route.path)) && project.evidence.some(evidence=>evidence.visibility==="public" && evidence.kind==="immersive-case" && route.path.endsWith(`/${evidence.slug}`)));
    return route?[{name:project.publicName,href:getLocalizedPath(route.path,model.locale)}]:[];
  }).slice(0,2);
  return [
    {id:"products",label:es?"Productos":"Products",description:es?"Herramientas nacidas de workflows reales. Una selección pública con evidencia y acceso claros.":"Tools shaped by real workflows. A public selection with clear evidence and access.",href:null,productIds:model.items.map(item=>item.project.id),evidence:[]},
    {id:"research",label:es?"Investigación / Infraestructura":"Research / Infrastructure",description:es?"Métodos, herramientas y fundamentos técnicos que sostienen el trabajo del estudio.":"Methods, tooling and technical foundations that support the studio’s work.",href:null,productIds:[],evidence:[]},
    {id:"spatial",label:es?"Espacial / Interactivo":"Spatial / Interactive",description:es?"Interfaces que exploran presencia, espacio e interacción. Evidencia publicada en Immersive.":"Interfaces exploring presence, space and interaction. Published evidence in Immersive.",href:getLocalizedPath("/immersive",model.locale),productIds:[],evidence:spatial},
    {id:"worlds",label:es?"Juegos / Mundos":"Games / Worlds",description:es?"Sistemas de juego y mundos de autor: una dirección creativa del estudio.":"Play systems and authored worlds: a creative direction within the studio.",href:null,productIds:[],evidence:[]},
  ];
}
