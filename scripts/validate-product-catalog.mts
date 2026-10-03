import { deepStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import type { ProjectRecord, PublicLocale } from "../src/data/projectRegistry.types.ts";
import type { PublicProductCatalogEntry } from "../src/data/productCatalog.ts";
import type { ProductCatalogValidationIssue } from "../src/data/productCatalogValidation.ts";

// Complete bundler-style relative imports using repository modules only.
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

const {
  productCatalog, getProductCatalogEntry, getProductCatalogEntryBySlug,
  getProductCatalogItems, getProductProfilePath,
} = await import("../src/data/productCatalog.ts");
const { validateProductCatalog } = await import("../src/data/productCatalogValidation.ts");
const { projects } = await import("../src/data/projects.ts");
const { homeProjectIds, selectHomeProjects } = await import("../src/data/ecosystemHome.ts");

const initialIds = ["weekfield", "print-border-studio"];

// Production membership is a phase gate; the pure model intentionally supports N=0.
function validateProductionCatalog(
  catalog: readonly PublicProductCatalogEntry[],
  registry: readonly ProjectRecord[],
  homeIds: readonly string[],
): readonly ProductCatalogValidationIssue[] {
  const issues = [...validateProductCatalog(catalog, registry)];
  if (catalog.length === 0) {
    issues.push({ code: "PRODUCT_CATALOG_EMPTY", message: "Production catalog must not be empty." });
  }
  if (JSON.stringify(catalog.map(entry => entry.projectId)) !== JSON.stringify(initialIds)) {
    issues.push({ code: "PRODUCT_CATALOG_INITIAL_MEMBERSHIP", message: "Initial catalog membership must remain approved." });
  }
  if (JSON.stringify(homeIds) !== JSON.stringify(initialIds)) {
    issues.push({ code: "PRODUCT_CATALOG_HOME_MEMBERSHIP", message: "Home product membership must remain approved." });
  }
  return issues;
}

// Synthetic records stay in this script and never enter public registries or UI.
function fixture(id = "example-product"): ProjectRecord {
  return {
    id, publicName: "Example product", aliases: ["example-alias"],
    vertical: "product", origin: "collaboration", maturity: "prototype",
    deployment: "none", commercialAvailability: "not-offered", visibility: "public-listed",
    copy: { oneLiner: { en: "Approved example copy", es: "Texto de ejemplo aprobado" } },
    limitations: [], evidence: [], links: [], routes: [],
    media: [{ id: "poster", purpose: "poster", asset: { kind: "image", src: "/example.webp" },
      alt: { en: "Example poster", es: "Cartel de ejemplo" } }],
    review: { lastReviewed: "2026-10-01", owner: "studio-owner" },
  };
}

function entry(projectId = "example-product"): PublicProductCatalogEntry {
  return { projectId, slug: projectId, depth: "flagship", preset: "generic", locales: ["en", "es"], featured: true };
}

function hasCode(issues: readonly ProductCatalogValidationIssue[], code: string) {
  ok(issues.some(issue => issue.code === code), `Expected ${code}; got ${issues.map(issue => issue.code).join(",")}`);
}

function runSelfTests() {
  let caseCount = 0;
  const failures: string[] = [];
  function test(name: string, result: string, check: () => void) {
    caseCount++;
    try {
      check();
      console.log(`${String(caseCount).padStart(2, "0")} ${name}=${result}`);
    } catch (error) {
      failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  function detects(code: string, change: (catalog: PublicProductCatalogEntry[], registry: ProjectRecord[]) => void) {
    const catalog = [entry()];
    const registry = [fixture()];
    change(catalog, registry);
    hasCode(validateProductCatalog(catalog, registry), code);
  }

  test("VALID_BASELINE", "PASS", () => {
    const catalog = [entry()];
    const registry = [fixture()];
    const before = JSON.stringify({ catalog, registry });
    deepStrictEqual(validateProductCatalog(catalog, registry), []);
    registry[0].copy.oneLiner.en = "C:/Users/synthetic/private.txt";
    const first = validateProductCatalog(catalog, registry);
    deepStrictEqual(validateProductCatalog(catalog, registry), first);
    registry[0].copy.oneLiner.en = "Approved example copy";
    strictEqual(JSON.stringify({ catalog, registry }), before);
  });
  test("DUPLICATE_PROJECT_ID", "DETECTED", () => detects("PRODUCT_CATALOG_DUPLICATE_PROJECT_ID", catalog => {
    catalog.push({ ...entry(), slug: "other-slug" });
  }));
  test("DUPLICATE_SLUG", "DETECTED", () => detects("PRODUCT_CATALOG_DUPLICATE_SLUG", (catalog, registry) => {
    catalog.push({ ...entry("other-product"), slug: "example-product" });
    registry.push(fixture("other-product"));
  }));
  test("MISSING_PROJECT", "DETECTED", () => detects("PRODUCT_CATALOG_PROJECT_MISSING", (_catalog, registry) => {
    registry.length = 0;
  }));
  test("NON_PRODUCT_VERTICAL", "DETECTED", () => detects("PRODUCT_CATALOG_NOT_PRODUCT", (_catalog, registry) => {
    registry[0].vertical = "web-systems";
  }));
  test("NON_PUBLIC_LISTED", "DETECTED", () => {
    for (const visibility of ["public-unlisted", "private-named"] as const) {
      detects("PRODUCT_CATALOG_NOT_PUBLIC_LISTED", (_catalog, registry) => { registry[0].visibility = visibility; });
    }
  });
  test("INVALID_SLUG", "DETECTED", () => {
    for (const slug of ["", "Example", "a/b", "a b", "a?b", "a#b", "../example", "-example", "example-", "a--b", "example\n"]) {
      detects("PRODUCT_CATALOG_INVALID_SLUG", catalog => { catalog[0].slug = slug; });
    }
  });
  test("ES_COPY_MISSING", "DETECTED", () => {
    for (const es of [undefined, "", "  "]) {
      detects("PRODUCT_CATALOG_LOCALE_COPY_MISSING", (_catalog, registry) => { registry[0].copy.oneLiner.es = es; });
    }
    const enOnly = { ...entry(), locales: ["en"] as PublicLocale[] };
    const project = fixture();
    delete project.copy.oneLiner.es;
    deepStrictEqual(validateProductCatalog([enOnly], [project]), []);
    detects("PRODUCT_CATALOG_LOCALE_COPY_MISSING", (_catalog, registry) => { registry[0].copy.oneLiner.en = " "; });
    detects("PRODUCT_CATALOG_INVALID_LOCALE", catalog => { catalog[0].locales = ["fr" as PublicLocale]; });
  });
  test("FEATURED_POSTER_MISSING", "DETECTED", () => {
    detects("PRODUCT_CATALOG_FEATURED_POSTER_MISSING", (_catalog, registry) => { registry[0].media[0].purpose = "hero"; });
    const unfeatured = { ...entry(), featured: false };
    const project = fixture();
    project.media = [];
    deepStrictEqual(validateProductCatalog([unfeatured], [project]), []);
  });
  test("FEATURED_ALT_MISSING", "DETECTED", () => {
    for (const locale of ["en", "es"] as const) {
      detects("PRODUCT_CATALOG_FEATURED_ALT_MISSING", (_catalog, registry) => { registry[0].media[0].alt[locale] = " "; });
    }
    detects("PRODUCT_CATALOG_FEATURED_ALT_MISSING", (_catalog, registry) => { delete registry[0].media[0].alt.es; });
  });
  test("PRIVATE_REFERENCE_WINDOWS_USER_PATH", "DETECTED", () => {
    for (const path of ["C:\\Users\\synthetic\\private.txt", "c:/uSeRs/synthetic/private.txt"]) {
      detects("PRODUCT_CATALOG_PRIVATE_REFERENCE", (_catalog, registry) => { registry[0].copy.oneLiner.en = path; });
      detects("PRODUCT_CATALOG_PRIVATE_REFERENCE", catalog => { catalog[0].slug = path; });
    }
  });
  test("PRIVATE_REFERENCE_PROJECTS_PATH", "DETECTED", () => {
    for (const path of ["C:\\PROJECTS\\synthetic", "c:/projects/synthetic"]) {
      detects("PRODUCT_CATALOG_PRIVATE_REFERENCE", (_catalog, registry) => { registry[0].links = [{ id: "fixture", kind: "docs", href: path }]; });
    }
  });
  test("PRIVATE_REFERENCE_AUDIT_MARKER", "DETECTED", () => {
    for (const marker of ["PRODUCT_PROOF_MATRIX_V1", "source_log_v1", "EcosystemTruth", "AppData\\Local\\BrenychStudio\\Private", "appdata/local/brenychstudio/private"]) {
      detects("PRODUCT_CATALOG_PRIVATE_REFERENCE", (_catalog, registry) => { registry[0].review.note = marker; });
    }
    const unrelated = fixture("unrelated-product");
    unrelated.review.note = "SOURCE_LOG_V1";
    deepStrictEqual(validateProductCatalog([entry()], [fixture(), unrelated]), []);
  });
  test("EMPTY_SYNTHETIC_CATALOG", "MODEL_SAFE", () => {
    deepStrictEqual(validateProductCatalog([], [fixture()]), []);
    hasCode(validateProductionCatalog([], [fixture()], initialIds), "PRODUCT_CATALOG_EMPTY");
  });
  test("LOCALE_LOOKUP_NO_FALLBACK", "PASS", () => {
    // Exercise the real lookup with an in-memory EN-only publication, then restore it.
    const published = productCatalog[0];
    const originalLocales = published.locales;
    try {
      published.locales = ["en"];
      strictEqual(getProductCatalogEntryBySlug(published.slug, "en"), published);
      strictEqual(getProductCatalogEntryBySlug(published.slug, "es"), undefined);
      deepStrictEqual(getProductCatalogItems("es").map(item => item.entry.projectId), ["print-border-studio"]);
    } finally { published.locales = originalLocales; }
    strictEqual(getProductCatalogEntryBySlug(published.slug, "fr" as PublicLocale), undefined);
  });
  test("SLUG_LOOKUP_EXACT_ONLY", "PASS", () => {
    strictEqual(getProductCatalogEntryBySlug("weekfield", "en"), productCatalog[0]);
    for (const slug of ["Weekfield", " weekfield", "weekfield ", "week", "creatorops", "/weekfield", "unknown"]) {
      strictEqual(getProductCatalogEntryBySlug(slug, "en"), undefined);
    }
    strictEqual(getProductCatalogEntry("weekfield"), productCatalog[0]);
    for (const id of ["Weekfield", "CreatorOps", "creatorops", "week", "unknown"]) {
      strictEqual(getProductCatalogEntry(id), undefined);
    }
  });
  test("PROFILE_PATH_EN", "/products/example-product", () => strictEqual(getProductProfilePath(entry(), "en"), "/products/example-product"));
  test("PROFILE_PATH_ES", "/es/products/example-product", () => strictEqual(getProductProfilePath(entry(), "es"), "/es/products/example-product"));
  test("PROFILE_PATH_UNPUBLISHED_LOCALE", "THROWS", () => {
    throws(() => getProductProfilePath({ ...entry(), locales: ["en"] }, "es"));
  });
  test("CATALOG_ORDER_PRESERVED", "PASS", () => {
    const registry = [fixture("print-border-studio"), fixture("weekfield")];
    const items = getProductCatalogItems("en", registry);
    deepStrictEqual(items.map(item => item.project.id), ["weekfield", "print-border-studio"]);
    strictEqual(items[0].project, registry[1]);
    strictEqual(items[0].entry, productCatalog[0]);
    registry[1].vertical = "web-systems";
    registry[1].visibility = "public-unlisted";
    strictEqual(getProductCatalogItems("en", registry).length, 2);
  });
  test("MISSING_PROJECT_GET_ITEMS", "THROWS", () => throws(() => getProductCatalogItems("en", [fixture("weekfield")])));
  test("HOME_MEMBERSHIP_INDEPENDENT", "PASS", () => {
    const syntheticCatalog = [entry("weekfield"), entry("print-border-studio"), entry("example-third-product")];
    const syntheticRegistry = syntheticCatalog.map(item => fixture(item.projectId));
    deepStrictEqual(validateProductCatalog(syntheticCatalog, syntheticRegistry), []);
    deepStrictEqual(homeProjectIds.products, ["weekfield", "print-border-studio"]);
    deepStrictEqual(selectHomeProjects(homeProjectIds.products, syntheticRegistry).map(item => item.id), ["weekfield", "print-border-studio"]);
    hasCode(validateProductionCatalog(syntheticCatalog, syntheticRegistry, initialIds), "PRODUCT_CATALOG_INITIAL_MEMBERSHIP");
    hasCode(validateProductionCatalog(productCatalog, projects, [...initialIds, "example-third-product"]), "PRODUCT_CATALOG_HOME_MEMBERSHIP");
  });

  for (const failure of failures) console.error(`FAIL ${failure}`);
  console.log(`SELF_TEST_CASES=${caseCount}`);
  console.log(`SELF_TEST=${failures.length === 0 ? "PASS" : "FAIL"}`);
  if (failures.length) process.exitCode = 1;
}

if (process.argv.includes("--self-test")) {
  runSelfTests();
} else {
  const issues = validateProductionCatalog(productCatalog, projects, homeProjectIds.products);
  console.log(`PUBLIC_CATALOG_COUNT=${productCatalog.length}`);
  console.log(`CATALOG_PROJECT_IDS=${productCatalog.map(entry => entry.projectId).join(",")}`);
  console.log(`CATALOG_SLUGS=${productCatalog.map(entry => entry.slug).join(",")}`);
  console.log(`HOME_MEMBERSHIP=${homeProjectIds.products.join(",")}`);
  for (const issue of issues) console.error(`${issue.code}: ${issue.message}`);
  console.log(`PRODUCT_CATALOG_ISSUES=${issues.length}`);
  console.log(`PRODUCT_CATALOG_VALIDATION=${issues.length === 0 ? "PASS" : "FAIL"}`);
  if (issues.length) process.exitCode = 1;
}
