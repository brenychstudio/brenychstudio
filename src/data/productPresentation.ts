import { cases } from "./cases";
import { immersiveItems } from "./immersive";
import type { PublicProductCatalogEntry } from "./productCatalog";
import type { CommercialAvailability, ProjectMaturity, ProjectRecord, PublicLocale } from "./projectRegistry.types";
import { getLocalizedPath, hasSpanishPublicEquivalent } from "../i18n/routes";
import { getRouteModuleKey } from "../routing/routeModules";
import { productPresentationConfig, validateProductVisualReferences, type ProductGroupId, type ProductTreatment, type ProductVisualConfig } from "./productPresentationConfig";
import type { VideoAssetId } from "../media/video/videoAssets";

export type PublicProductPresentation = {
  stateLabel: string;
  availabilityLabel: string;
  summary: string;
  poster: { src: string; alt: string } | null;
  proofPath: string | null;
  liveHref: string | null;
  group: ProductGroupId | null;
  visual: {
    treatment: ProductTreatment;
    tone: "dark" | "light";
    headerLabel: string;
    walkthrough: VideoAssetId | null;
    secondary: { src: string; alt: string } | null;
    titleLines: readonly string[] | null;
  };
};

const stateLabels: Record<PublicLocale, Record<ProjectMaturity, string>> = {
  en: { concept: "Concept", prototype: "Prototype", beta: "Beta", "pre-release": "Pre-release", released: "Released", archived: "Archived" },
  es: { concept: "Concepto", prototype: "Prototipo", beta: "Beta", "pre-release": "Pre-lanzamiento", released: "Lanzado", archived: "Archivado" },
};

const availabilityLabels: Record<PublicLocale, Record<CommercialAvailability, string>> = {
  en: { "not-offered": "Not offered", "adaptation-available": "Adaptation available", "reference-only": "Reference only", "controlled-access": "Controlled access", "public-access": "Public access" },
  es: { "not-offered": "No disponible", "adaptation-available": "Adaptación disponible", "reference-only": "Solo referencia", "controlled-access": "Acceso controlado", "public-access": "Acceso público" },
};

function requireLocalized(value: string | undefined, context: string): string {
  if (!value?.trim()) throw new Error(`Missing localized product copy: ${context}`);
  return value;
}

export function getPublicProductPresentation(
  project: ProjectRecord,
  entry: PublicProductCatalogEntry,
  locale: PublicLocale,
  config: ProductVisualConfig | undefined = productPresentationConfig[project.id],
): PublicProductPresentation {
  if (!entry.locales.includes(locale)) throw new Error(`Product catalog locale is not published: ${entry.projectId}/${locale}`);
  const summary = requireLocalized(project.copy.summary?.[locale] ?? project.copy.oneLiner[locale], `${project.id}/summary/${locale}`);
  const media = project.media.find(item => item.purpose === "poster" && (!item.locale || item.locale === locale));
  let poster: PublicProductPresentation["poster"] = null;
  if (media) {
    const asset = media.asset;
    let src: string | undefined;
    switch (asset.kind) {
      case "case-poster": src = cases.find(item => item.slug === asset.caseSlug)?.poster.src; break;
      case "immersive-poster": src = immersiveItems.find(item => item.slug === asset.immersiveSlug)?.previewPoster; break;
      case "image": src = asset.src; break;
      case "video": src = asset.poster; break;
    }
    if (src) poster = { src, alt: requireLocalized(media.alt[locale], `${project.id}/poster-alt/${locale}`) };
  }
  const route = project.routes.find(item =>
    (item.surface === "work" || item.surface === "immersive") && !item.noIndex && item.locales.includes(locale) &&
    getRouteModuleKey(item.path) !== null && (locale !== "es" || hasSpanishPublicEquivalent(item.path)),
  );
  const validVisual = validateProductVisualReferences(project, config, locale).length === 0 ? config : undefined;
  const treatment = validVisual?.treatment ?? "generic";
  return {
    stateLabel: stateLabels[locale][project.maturity],
    availabilityLabel: availabilityLabels[locale][project.commercialAvailability],
    summary,
    poster,
    proofPath: route ? getLocalizedPath(route.path, locale) : null,
    liveHref: project.links.find(link => link.kind === "live")?.href ?? null,
    group: config?.group ?? null,
    visual: {
      treatment, tone: treatment === "digital" ? "dark" : "light", headerLabel: project.publicName,
      walkthrough: validVisual?.walkthrough ?? null,
      secondary: validVisual?.secondary ? { src: validVisual.secondary.src, alt: validVisual.secondary.alt[locale]! } : null,
      titleLines: validVisual?.titleLines ?? null,
    },
  };
}
