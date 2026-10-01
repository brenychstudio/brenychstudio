import { projects } from "./projects";
import type { ProjectRecord, PublicLocale } from "./projectRegistry.types";

export type ProductProfileDepth = "flagship" | "full" | "development";

export type ProductPresentationPreset =
  | "digital"
  | "material"
  | "spatial"
  | "editorial"
  | "technical"
  | "generic";

// Product-surface composition only; all public facts remain in the canonical registry.
export type PublicProductCatalogEntry = {
  projectId: string;
  slug: string;
  depth: ProductProfileDepth;
  preset: ProductPresentationPreset;
  locales: PublicLocale[];
  featured?: boolean;
};

export const productCatalog: readonly PublicProductCatalogEntry[] = [
  {
    projectId: "weekfield",
    slug: "weekfield",
    depth: "flagship",
    preset: "digital",
    locales: ["en", "es"],
    featured: true,
  },
  {
    projectId: "print-border-studio",
    slug: "print-border-studio",
    depth: "flagship",
    preset: "material",
    locales: ["en", "es"],
    featured: true,
  },
];

export function getProductCatalogEntry(projectId: string): PublicProductCatalogEntry | undefined {
  return productCatalog.find(entry => entry.projectId === projectId);
}

export function getProductCatalogEntryBySlug(
  slug: string,
  locale: PublicLocale,
): PublicProductCatalogEntry | undefined {
  return productCatalog.find(entry => entry.slug === slug && entry.locales.includes(locale));
}

export function getProductCatalogItems(
  locale: PublicLocale,
  registry: readonly ProjectRecord[] = projects,
): readonly { entry: PublicProductCatalogEntry; project: ProjectRecord }[] {
  return productCatalog.filter(entry => entry.locales.includes(locale)).map(entry => {
    const project = registry.find(project => project.id === entry.projectId);
    if (!project) throw new Error(`Product catalog project is missing: ${entry.projectId}`);
    return { entry, project };
  });
}

export function getProductProfilePath(entry: PublicProductCatalogEntry, locale: PublicLocale): string {
  if (!entry.locales.includes(locale)) {
    throw new Error(`Product catalog locale is not published: ${entry.projectId}/${locale}`);
  }
  switch (locale) {
    case "en": return `/products/${entry.slug}`;
    case "es": return `/es/products/${entry.slug}`;
    default: throw new Error(`Unsupported product catalog locale: ${locale}`);
  }
}
