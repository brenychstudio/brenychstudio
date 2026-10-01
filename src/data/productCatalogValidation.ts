import type { PublicProductCatalogEntry } from "./productCatalog";
import type { ProjectRecord, PublicLocale } from "./projectRegistry.types";

export type ProductCatalogValidationIssue = {
  code: string;
  projectId?: string;
  slug?: string;
  message: string;
};

const publicLocales: Record<PublicLocale, true> = { en: true, es: true };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Generic public-safety sentinels, never source locations or undisclosed identities.
const privateSentinels = [
  "C:\\Users\\", "C:/Users/", "C:\\PROJECTS\\", "C:/PROJECTS/",
  "AppData\\Local\\BrenychStudio\\Private", "AppData/Local/BrenychStudio/Private",
  "PRODUCT_PROOF_MATRIX_V1", "SOURCE_LOG_V1", "EcosystemTruth",
];

function normalizeSeparators(value: string): string {
  return value.replace(/\\+/g, "/").toLowerCase();
}

function containsPrivateReference(value: unknown): boolean {
  const serialized = normalizeSeparators(JSON.stringify(value));
  return privateSentinels.some(sentinel => serialized.includes(normalizeSeparators(sentinel)));
}

/** Pure, deterministic metadata validation. Does not read assets or coerce registry facts. */
export function validateProductCatalog(
  catalog: readonly PublicProductCatalogEntry[],
  registry: readonly ProjectRecord[],
): readonly ProductCatalogValidationIssue[] {
  const issues: ProductCatalogValidationIssue[] = [];
  const projectIds = new Set<string>();
  const slugs = new Set<string>();

  for (const entry of catalog) {
    function report(code: string, message: string) {
      issues.push({ code, projectId: entry.projectId, slug: entry.slug, message });
    }
    if (projectIds.has(entry.projectId)) {
      report("PRODUCT_CATALOG_DUPLICATE_PROJECT_ID", "Catalog project identity must be unique.");
    }
    projectIds.add(entry.projectId);
    if (slugs.has(entry.slug)) {
      report("PRODUCT_CATALOG_DUPLICATE_SLUG", "Catalog slug must be unique.");
    }
    slugs.add(entry.slug);
    if (!slugPattern.test(entry.slug) || entry.slug.trim() !== entry.slug) {
      report("PRODUCT_CATALOG_INVALID_SLUG", "Catalog slug must use lowercase alphanumeric segments separated by single hyphens.");
    }
    for (const locale of entry.locales) {
      if (!Object.hasOwn(publicLocales, locale)) {
        report("PRODUCT_CATALOG_INVALID_LOCALE", "Catalog locale must be a supported public locale.");
      }
    }

    const project = registry.find(project => project.id === entry.projectId);
    if (containsPrivateReference(entry) || (project && containsPrivateReference(project))) {
      report("PRODUCT_CATALOG_PRIVATE_REFERENCE", "Catalog composition and referenced public records must contain only public-safe metadata.");
    }
    if (!project) {
      report("PRODUCT_CATALOG_PROJECT_MISSING", "Catalog project must exist in the canonical public registry.");
      continue;
    }
    if (project.vertical !== "product") {
      report("PRODUCT_CATALOG_NOT_PRODUCT", "Catalog project must have the product vertical.");
    }
    if (project.visibility !== "public-listed") {
      report("PRODUCT_CATALOG_NOT_PUBLIC_LISTED", "Catalog project must be explicitly public-listed.");
    }

    const posters = project.media.filter(media => media.purpose === "poster");
    if (entry.featured === true && posters.length === 0) {
      report("PRODUCT_CATALOG_FEATURED_POSTER_MISSING", "Featured product must have poster metadata.");
    }
    for (const locale of entry.locales) {
      if (!Object.hasOwn(publicLocales, locale)) continue;
      if (!project.copy.oneLiner[locale]?.trim()) {
        report("PRODUCT_CATALOG_LOCALE_COPY_MISSING", `Published ${locale} locale requires non-empty canonical one-liner text.`);
      }
      if (entry.featured === true && posters.length > 0 && !posters.some(poster =>
        (!poster.locale || poster.locale === locale) && poster.alt[locale]?.trim(),
      )) {
        report("PRODUCT_CATALOG_FEATURED_ALT_MISSING", `Featured product requires non-empty ${locale} poster alt text.`);
      }
    }
  }
  return issues;
}
