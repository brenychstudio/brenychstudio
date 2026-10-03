import { deepStrictEqual, strictEqual, throws } from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import type { ProjectRecord, PublicLocale } from "../src/data/projectRegistry.types.ts";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL) {
      const lastSegment = specifier.split("/").pop() ?? "";
      if (!/\.[a-z]+$/i.test(lastSegment)) {
        const base = new URL(specifier, context.parentURL);
        for (const extension of [".ts", ".tsx"]) {
          if (existsSync(fileURLToPath(`${base.href}${extension}`))) {
            return nextResolve(`${specifier}${extension}`, context);
          }
        }
      }
    }
    return nextResolve(specifier, context);
  },
});

const { getRouteModuleKey } = await import("../src/routing/routeModules.ts");
const { hasSpanishPublicEquivalent } = await import("../src/i18n/routes.ts");
const { productCatalog, getProductCatalogItems } = await import("../src/data/productCatalog.ts");
const { homeProjectIds } = await import("../src/data/ecosystemHome.ts");
const { getStaticRouteMetadata } = await import("../src/seo/staticMetadata.ts");
const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const modules = readFileSync(new URL("../src/routing/routeModules.ts", import.meta.url), "utf8");
const approvedIds = ["weekfield", "print-border-studio"];
const failures: string[] = [];
let caseCount = 0;

function check(name: string, expected: string, run: () => void) {
  caseCount++;
  try {
    run();
    console.log(`${String(caseCount).padStart(2, "0")} ${name}=${expected}`);
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

check("PRODUCTS_EN_MODULE", "products", () => strictEqual(getRouteModuleKey("/products"), "products"));
check("PRODUCTS_ES_MODULE", "products", () => strictEqual(getRouteModuleKey("/es/products"), "products"));
check("PRODUCTS_TRAILING_SLASH_NORMALIZED", "products", () => {
  for (const path of ["/products/", "/es/products///"]) strictEqual(getRouteModuleKey(path), "products");
});
check("PRODUCTS_QUERY_NORMALIZED", "products", () => {
  for (const path of ["/products?review=1", "/es/products/?review=1#ledger", "/products#ledger"]) {
    strictEqual(getRouteModuleKey(path), "products");
  }
});
check("PRODUCT_PROFILE_EN_NOT_PUBLISHED", "null", () => strictEqual(getRouteModuleKey("/products/weekfield"), null));
check("PRODUCT_PROFILE_ES_NOT_PUBLISHED", "null", () => strictEqual(getRouteModuleKey("/es/products/weekfield"), null));
check("SPANISH_PRODUCTS_PUBLIC", "true", () => strictEqual(hasSpanishPublicEquivalent("/products"), true));
check("SPANISH_PRODUCT_PROFILE_PUBLIC", "false", () => strictEqual(hasSpanishPublicEquivalent("/products/weekfield"), false));
check("CATALOG_COUNT", "2", () => {
  strictEqual(productCatalog.length, 2);
  deepStrictEqual(productCatalog.map(entry => entry.projectId), approvedIds);
});
check("DEVELOPMENT_FIELD_EMPTY", "true", () => strictEqual(productCatalog.some(entry => entry.depth === "development"), false));
check("HOME_MEMBERSHIP_STILL_2", "true", () => deepStrictEqual(homeProjectIds.products, approvedIds));
check("APP_INDEX_ROUTES", "PASS", () => {
  for (const path of ["/products", "/es/products"]) strictEqual(app.includes(`path="${path}"`), true);
  strictEqual(app.includes("lazy(routeModules.products)"), true);
  strictEqual(modules.includes('import("../pages/ProductIndex")'), true);
});
check("NO_PRODUCT_PROFILE_MATCHER", "PASS", () => {
  strictEqual(/path\s*=\s*["'][^"']*products\/(?:[:*]|weekfield|print-border-studio)/.test(app), false);
  // An exact Products matcher is the only product-family matcher allowed in this phase.
  const productMatchers = modules.split("\n").filter(line => line.includes("path:") && line.includes("products"));
  strictEqual(productMatchers.length, 1);
  strictEqual(productMatchers[0]?.includes('path: "/products", key: "products", spanish: true'), true);
  for (const slug of ["weekfield", "print-border-studio", "unknown", "weekfield/extra"]) {
    for (const prefix of ["", "/es"]) strictEqual(getRouteModuleKey(`${prefix}/products/${slug}`), null);
  }
});
check("STATIC_INDEX_SEO_ONLY", "PASS", () => {
  strictEqual(getStaticRouteMetadata("/products")?.title, "Products — Studio-built Software & Creative Technology | Brenych Studio");
  strictEqual(getStaticRouteMetadata("/es/products")?.title, "Productos — Software y tecnología creativa del estudio | Brenych Studio");
  strictEqual(getStaticRouteMetadata("/products/weekfield"), undefined);
  strictEqual(getStaticRouteMetadata("/es/products/weekfield"), undefined);
});

if (process.argv.includes("--self-test")) {
  const presentationUrl = new URL("../src/data/productPresentation.ts", import.meta.url);
  check("PRESENTATION_HELPER_EXISTS", "true", () => strictEqual(existsSync(presentationUrl), true));
  if (existsSync(presentationUrl)) {
    const { getPublicProductPresentation } = await import("../src/data/productPresentation.ts");
    const items = getProductCatalogItems("en");
    const clone = (): ProjectRecord => structuredClone(items[0].project);
    const entry = items[0].entry;
    check("CANONICAL_PROOF_AND_LIVE", "PASS", () => {
      for (const locale of ["en", "es"] as PublicLocale[]) {
        const prefix = locale === "es" ? "/es" : "";
        const presentations = getProductCatalogItems(locale).map(item => getPublicProductPresentation(item.project, item.entry, locale));
        deepStrictEqual(presentations.map(item => item.proofPath), [`${prefix}/work/creatorops`, `${prefix}/work/print-border-studio`]);
        deepStrictEqual(presentations.map(item => item.liveHref), items.map(item => item.project.links.find(link => link.kind === "live")?.href ?? null));
        strictEqual(presentations.every(item => Boolean(item.poster?.src && item.poster.alt)), true);
      }
    });
    check("INDEPENDENT_STATE_AND_AVAILABILITY", "PASS", () => {
      const states = {
        concept: ["Concept", "Concepto"], prototype: ["Prototype", "Prototipo"], beta: ["Beta", "Beta"],
        "pre-release": ["Pre-release", "Pre-lanzamiento"], released: ["Released", "Lanzado"], archived: ["Archived", "Archivado"],
      } as const;
      const availability = {
        "not-offered": ["Not offered", "No disponible"], "adaptation-available": ["Adaptation available", "Adaptación disponible"],
        "reference-only": ["Reference only", "Solo referencia"], "controlled-access": ["Controlled access", "Acceso controlado"],
        "public-access": ["Public access", "Acceso público"],
      } as const;
      for (const [maturity, labels] of Object.entries(states)) {
        for (const [commercialAvailability, access] of Object.entries(availability)) {
          const project = { ...clone(), maturity, commercialAvailability } as ProjectRecord;
          for (const [index, locale] of (["en", "es"] as const).entries()) {
            const result = getPublicProductPresentation(project, entry, locale);
            strictEqual(result.stateLabel, labels[index]);
            strictEqual(result.availabilityLabel, access[index]);
          }
        }
      }
    });
    check("LOCALIZED_SUMMARY_NO_FALLBACK", "PASS", () => {
      const project = clone();
      project.copy.summary = { en: "English summary", es: "Resumen español" };
      strictEqual(getPublicProductPresentation(project, entry, "es").summary, "Resumen español");
      delete project.copy.summary.es;
      strictEqual(getPublicProductPresentation(project, entry, "es").summary, project.copy.oneLiner.es);
      delete project.copy.oneLiner.es;
      throws(() => getPublicProductPresentation(project, entry, "es"), /Missing localized/);
    });
    check("APPROVED_POSTERS_ONLY", "PASS", () => {
      const project = clone();
      project.media[0].purpose = "hero";
      strictEqual(getPublicProductPresentation(project, entry, "en").poster, null);
      project.media[0].purpose = "poster";
      project.media[0].asset = { kind: "image", src: "/synthetic-poster.webp" };
      strictEqual(getPublicProductPresentation(project, entry, "en").poster?.src, "/synthetic-poster.webp");
      project.media[0].asset = { kind: "video", videoAssetId: "weekfield.case.walkthrough", poster: "/synthetic-video-poster.webp" };
      strictEqual(getPublicProductPresentation(project, entry, "en").poster?.src, "/synthetic-video-poster.webp");
      delete project.media[0].asset.poster;
      strictEqual(getPublicProductPresentation(project, entry, "en").poster, null);
      project.media[0].asset = { kind: "immersive-poster", immersiveSlug: "whisper" };
      strictEqual(Boolean(getPublicProductPresentation(project, entry, "en").poster?.src), true);
      project.media[0].asset = { kind: "case-poster", caseSlug: "missing-synthetic-case" };
      strictEqual(getPublicProductPresentation(project, entry, "en").poster, null);
    });
    check("MISSING_ALT_AND_UNPUBLISHED_LOCALE_THROW", "PASS", () => {
      const project = clone();
      delete project.media[0].alt.es;
      throws(() => getPublicProductPresentation(project, entry, "es"), /Missing localized/);
      throws(() => getPublicProductPresentation(clone(), { ...entry, locales: ["en"] }, "es"), /not published/);
    });
    check("NO_INVENTED_PROOF_OR_LIVE", "PASS", () => {
      const project = clone();
      project.routes = [{ surface: "product", path: "/products/synthetic", locales: ["en", "es"] }];
      project.links = project.links.filter(link => link.kind !== "live");
      const presentation = getPublicProductPresentation(project, entry, "en");
      strictEqual(presentation.proofPath, null);
      strictEqual(presentation.liveHref, null);
    });
  }
}

for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(`ROUTE_SELF_TEST_CASES=${caseCount}`);
console.log(`PRODUCT_ROUTES_${process.argv.includes("--self-test") ? "SELF_TEST" : "VALIDATION"}=${failures.length ? "FAIL" : "PASS"}`);
if (failures.length) process.exitCode = 1;
