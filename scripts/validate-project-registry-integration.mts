import { deepStrictEqual, throws } from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import type { ProjectRecord, ProjectRouteSurface } from "../src/data/projectRegistry.types.ts";
import type { ProjectRegistryIntegrationInput, ProjectRegistryIntegrationIssueCode } from "../src/data/projectRegistryIntegrationValidation.ts";

// Same extension-completion loader as validate-project-registry.mts. Production authorities
// are loaded only in normal mode; --self-test uses synthetic in-memory inputs exclusively.
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

const { validateProjectRegistryIntegration } = await import("../src/data/projectRegistryIntegrationValidation.ts");

// Deliberately small parser for this repo's urlset: scalar <loc> values, not an XML
// dependency or sitemap generator. Reject malformed locations before making a Set,
// otherwise duplicated normalized paths would silently disappear.
function parseSitemapPaths(xml: string): Set<string> {
  const paths = new Set<string>();
  const content = xml.replace(/<!--[\s\S]*?-->/g, "");
  const locPattern = /<loc\s*>([^<]*)<\/loc\s*>/g;
  const residue = content.replace(locPattern, "");
  if (/<\/?loc\b/.test(residue)) throw new Error("SITEMAP_XML_INVALID: malformed <loc> element");
  for (const match of content.matchAll(locPattern)) {
    const location = match[1].trim();
    let url: URL;
    try {
      url = new URL(location);
    } catch {
      throw new Error(`SITEMAP_LOC_INVALID: ${location}`);
    }
    if (url.origin !== "https://brenychstudio.com" || url.username || url.password) continue;
    if (url.search || url.hash || /[\s\\&]/.test(location)) {
      throw new Error(`SITEMAP_LOC_INVALID: canonical URL must be a plain pathname: ${location}`);
    }
    // URL() repairs missing scheme slashes; only the literal canonical authority is input.
    const canonical = location.match(/^https:\/\/brenychstudio\.com(\/.*)?$/);
    if (!canonical) throw new Error(`SITEMAP_LOC_INVALID: malformed canonical URL: ${location}`);
    const rawPath = canonical[1] ?? "/";
    if (rawPath !== url.pathname || /%(?![\da-f]{2})/i.test(rawPath)) {
      throw new Error(`SITEMAP_LOC_INVALID: malformed or implicitly rewritten pathname: ${location}`);
    }
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (paths.has(path)) throw new Error(`SITEMAP_PATH_DUPLICATE: ${path}`);
    paths.add(path);
  }
  return paths;
}

async function runValidation() {
  const [{ projects }, { cases, getCasePath }, { immersiveItems }, { staticRouteMetadata }, routing] = await Promise.all([
    import("../src/data/projects.ts"),
    import("../src/data/cases.ts"),
    import("../src/data/immersive.ts"),
    import("../src/seo/staticMetadata.ts"),
    import("../src/i18n/routes.ts"),
  ]);
  const input: ProjectRegistryIntegrationInput = {
    projects,
    workCasePaths: new Map(cases.map((item) => [item.slug, getCasePath(item.slug)])),
    immersiveCasePaths: new Map(immersiveItems.map((item) => [item.slug, `/immersive/${item.slug}`])),
    staticMetadata: new Map(staticRouteMetadata.map((item) => [item.path, { noIndex: Boolean(item.noIndex) }])),
    sitemapPaths: parseSitemapPaths(readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8")),
    hasSpanishPublicEquivalent: routing.hasSpanishPublicEquivalent,
    isSpanishPublicCaseStorySlug: routing.isSpanishPublicCaseStorySlug,
    isSpanishPublicCaseRegistrySlug: routing.isSpanishPublicCaseRegistrySlug,
    isSpanishPublicImmersiveSlug: routing.isSpanishPublicImmersiveSlug,
  };
  const result = validateProjectRegistryIntegration(input);
  console.log(`PROJECT_INTEGRATION_PROJECTS=${result.counts.projects}`);
  console.log(`PROJECT_INTEGRATION_ROUTES=${result.counts.routes}`);
  console.log(`WORK_ROUTES_CHECKED=${result.counts.workRoutes}`);
  console.log(`IMMERSIVE_ROUTES_CHECKED=${result.counts.immersiveRoutes}`);
  console.log(`STATIC_METADATA_ROUTES_CHECKED=${result.counts.staticMetadataRoutes}`);
  console.log(`SPANISH_ROUTES_CHECKED=${result.counts.spanishRoutes}`);
  console.log(`SITEMAP_ROUTES_CHECKED=${result.counts.sitemapRoutes}`);
  console.log(`PROJECT_INTEGRATION_ISSUES=${result.issues.length}`);
  for (const issue of result.issues) console.error(`✗ ${issue.code} ${issue.path}: ${issue.message}`);
  console.log(`PROJECT_REGISTRY_INTEGRATION=${result.ok ? "PASS" : "FAIL"}`);
  if (!result.ok) process.exitCode = 1;
}

// Fixture slugs intentionally differ from public route basenames. This catches accidental
// /work/${evidence.slug} construction and conflation of registry and story translation sets.
function fixture(surface: ProjectRouteSurface = "work", hidden = false) {
  const path: `/${string}` = surface === "work" ? "/work/public-story" : surface === "immersive" ? "/immersive/spatial-story" : `/${surface}/fixture`;
  const esPath = `/es${path}`;
  const project: ProjectRecord = {
    id: "fixture-project", publicName: "Fixture", aliases: [], vertical: "web-systems",
    origin: "authored-concept", maturity: "prototype", deployment: "public-demo",
    commercialAvailability: "not-offered", visibility: hidden ? "public-unlisted" : "public-listed",
    copy: { oneLiner: { en: "Synthetic", es: "Sintético" } }, limitations: [], links: [],
    evidence: surface === "work" ? [{ kind: "work-case", slug: "registry-key", proves: { en: "Proof", es: "Prueba" }, visibility: "public" }]
      : surface === "immersive" ? [{ kind: "immersive-case", slug: "spatial-key", proves: { en: "Proof", es: "Prueba" }, visibility: "public" }] : [],
    routes: [{ surface, path, locales: ["en", "es"], ...(hidden ? { noIndex: true } : {}) }],
    media: surface === "work" ? [{ id: "poster", purpose: "poster", asset: { kind: "case-poster", caseSlug: "registry-key" }, alt: { en: "Poster", es: "Póster" } }]
      : surface === "immersive" ? [{ id: "poster", purpose: "poster", asset: { kind: "immersive-poster", immersiveSlug: "spatial-key" }, alt: { en: "Poster", es: "Póster" } }] : [],
    review: { lastReviewed: "2026-09-27", owner: "studio-owner" },
  };
  const spanishPaths = new Set<string>([path]);
  const registrySlugs = new Set(["registry-key"]);
  const storySlugs = new Set(["public-story"]);
  const immersiveSlugs = new Set(["spatial-key"]);
  const input = {
    projects: [project],
    workCasePaths: new Map([["registry-key", "/work/public-story"], ["other-case", "/work/other-story"]]),
    immersiveCasePaths: new Map([["spatial-key", "/immersive/spatial-story"], ["other-immersive", "/immersive/other-story"]]),
    staticMetadata: new Map<string, { noIndex?: boolean }>([[path, { noIndex: hidden }], [esPath, { noIndex: hidden }]]),
    sitemapPaths: new Set(hidden ? [] : [path, esPath]),
    hasSpanishPublicEquivalent: (value: string) => spanishPaths.has(value),
    isSpanishPublicCaseRegistrySlug: (value: string) => registrySlugs.has(value),
    isSpanishPublicCaseStorySlug: (value: string) => storySlugs.has(value),
    isSpanishPublicImmersiveSlug: (value: string) => immersiveSlugs.has(value),
  } satisfies ProjectRegistryIntegrationInput;
  return { input, project, path, esPath, spanishPaths, registrySlugs, storySlugs, immersiveSlugs };
}

type Fixture = ReturnType<typeof fixture>;
type Negative = {
  name: string;
  code: ProjectRegistryIntegrationIssueCode;
  surface?: ProjectRouteSurface;
  hidden?: boolean;
  mutate: (f: Fixture) => void;
};

// Each mutation targets one independent contract and must produce exactly its issue code.
const negatives: Negative[] = [
  { name: "Work evidence absent", code: "WORK_ROUTE_EVIDENCE_MISSING", mutate: f => { f.project.evidence = []; f.project.media = []; } },
  { name: "Work authority path differs", code: "WORK_ROUTE_PATH_MISMATCH", mutate: f => { f.input.workCasePaths.set("registry-key", "/work/different"); } },
  { name: "Immersive evidence absent", surface: "immersive", code: "IMMERSIVE_ROUTE_EVIDENCE_MISSING", mutate: f => { f.project.evidence = []; f.project.media = []; } },
  { name: "Immersive authority path differs", surface: "immersive", code: "IMMERSIVE_ROUTE_PATH_MISMATCH", mutate: f => { f.input.immersiveCasePaths.set("spatial-key", "/immersive/different"); } },
  { name: "Case poster borrowed", code: "CASE_POSTER_EVIDENCE_MISMATCH", mutate: f => { f.project.media[0].asset = { kind: "case-poster", caseSlug: "other-case" }; } },
  { name: "Immersive poster borrowed", surface: "immersive", code: "IMMERSIVE_POSTER_EVIDENCE_MISMATCH", mutate: f => { f.project.media[0].asset = { kind: "immersive-poster", immersiveSlug: "other-immersive" }; } },
  { name: "Base metadata absent", code: "STATIC_METADATA_ROUTE_MISSING", mutate: f => { f.input.staticMetadata.delete(f.path); } },
  { name: "ES metadata absent", code: "STATIC_METADATA_ES_ROUTE_MISSING", mutate: f => { f.input.staticMetadata.delete(f.esPath); } },
  { name: "Base noindex differs", code: "STATIC_METADATA_NOINDEX_MISMATCH", mutate: f => { f.input.staticMetadata.set(f.path, { noIndex: true }); } },
  { name: "ES noindex differs", code: "STATIC_METADATA_ES_NOINDEX_MISMATCH", mutate: f => { f.input.staticMetadata.set(f.esPath, { noIndex: true }); } },
  { name: "Declared ES unavailable", code: "SPANISH_ROUTE_DECLARED_BUT_UNAVAILABLE", mutate: f => { f.spanishPaths.clear(); } },
  { name: "Available ES undeclared", code: "SPANISH_ROUTE_AVAILABLE_BUT_UNDECLARED", mutate: f => { f.project.routes[0].locales = ["en"]; f.input.sitemapPaths.delete(f.esPath); } },
  { name: "ES registry translation absent", code: "SPANISH_CASE_REGISTRY_MISSING", mutate: f => { f.registrySlugs.clear(); } },
  { name: "ES story translation absent", code: "SPANISH_CASE_STORY_MISSING", mutate: f => { f.storySlugs.clear(); } },
  { name: "ES immersive translation absent", surface: "immersive", code: "SPANISH_IMMERSIVE_ROUTE_MISSING", mutate: f => { f.immersiveSlugs.clear(); } },
  { name: "Public base missing in sitemap", code: "SITEMAP_PUBLIC_ROUTE_MISSING", mutate: f => { f.input.sitemapPaths.delete(f.path); } },
  { name: "Public ES missing in sitemap", code: "SITEMAP_PUBLIC_ES_ROUTE_MISSING", mutate: f => { f.input.sitemapPaths.delete(f.esPath); } },
  { name: "Hidden base exposed in sitemap", surface: "trust", hidden: true, code: "SITEMAP_NOINDEX_ROUTE_PRESENT", mutate: f => { f.input.sitemapPaths.add(f.path); } },
  { name: "Hidden ES exposed in sitemap", surface: "trust", hidden: true, code: "SITEMAP_NOINDEX_ES_ROUTE_PRESENT", mutate: f => { f.input.sitemapPaths.add(f.esPath); } },
  { name: "Undeclared ES exposed in sitemap", code: "SITEMAP_UNDECLARED_ES_ROUTE_PRESENT", mutate: f => { f.project.routes[0].locales = ["en"]; f.spanishPaths.clear(); } },
  { name: "Listed noindex route exposed", surface: "product", hidden: true, code: "SITEMAP_NOINDEX_ROUTE_PRESENT", mutate: f => { f.project.visibility = "public-listed"; f.input.sitemapPaths.add(f.path); } },
  { name: "Unlisted exclusion independent of noindex", surface: "trust", hidden: true, code: "SITEMAP_NOINDEX_ROUTE_PRESENT", mutate: f => { delete f.project.routes[0].noIndex; f.input.staticMetadata.set(f.path, {}); f.input.staticMetadata.set(f.esPath, {}); f.input.sitemapPaths.add(f.path); } },
  { name: "Hidden metadata indexable", surface: "trust", hidden: true, code: "STATIC_METADATA_NOINDEX_MISMATCH", mutate: f => { f.input.staticMetadata.set(f.path, {}); } },
  { name: "Existing undeclared ES metadata noindex differs", code: "STATIC_METADATA_ES_NOINDEX_MISMATCH", mutate: f => { f.project.routes[0].locales = ["en"]; f.spanishPaths.clear(); f.input.sitemapPaths.delete(f.esPath); f.input.staticMetadata.set(f.esPath, { noIndex: true }); } },
  { name: "Work authority slug removed", code: "WORK_ROUTE_PATH_MISMATCH", mutate: f => { f.input.workCasePaths.delete("registry-key"); } },
  { name: "Immersive authority slug removed", surface: "immersive", code: "IMMERSIVE_ROUTE_PATH_MISMATCH", mutate: f => { f.input.immersiveCasePaths.delete("spatial-key"); } },
];

function runSelfTests() {
  let caseCount = 0;
  const failures: string[] = [];
  function test(name: string, check: () => void) {
    caseCount += 1;
    try { check(); } catch (error) { failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  function passes(input: ProjectRegistryIntegrationInput) {
    const result = validateProjectRegistryIntegration(input);
    deepStrictEqual(result.issues, []);
    deepStrictEqual(result.ok, true);
    return result;
  }

  for (const surface of ["work", "immersive", "product", "research", "trust"] as const) {
    test(`valid ${surface} with independent authority bindings`, () => { passes(fixture(surface).input); });
  }
  test("valid noindex public-unlisted bilingual trust route", () => { passes(fixture("trust", true).input); });
  test("derived counts include base and localized paths", () => {
    deepStrictEqual(passes(fixture().input).counts, { projects: 1, routes: 1, workRoutes: 1, immersiveRoutes: 0, staticMetadataRoutes: 2, spanishRoutes: 1, sitemapRoutes: 2 });
  });
  test("product route may cite historical Work/Immersive evidence without those routes", () => {
    const f = fixture("product");
    f.project.evidence = [...fixture().project.evidence, ...fixture("immersive").project.evidence];
    f.project.media = [...fixture().project.media, ...fixture("immersive").project.media.map(m => ({ ...m, id: "spatial-poster" }))];
    passes(f.input);
  });
  test("matching Work evidence need not be first", () => {
    const f = fixture();
    f.project.evidence.unshift({ kind: "work-case", slug: "other-case", proves: { en: "Earlier proof" }, visibility: "public" });
    passes(f.input);
  });
  test("matching Immersive evidence need not be first", () => {
    const f = fixture("immersive");
    f.project.evidence.unshift({ kind: "immersive-case", slug: "other-immersive", proves: { en: "Earlier proof" }, visibility: "public" });
    passes(f.input);
  });
  test("EN-only route needs no ES metadata or translations", () => {
    const f = fixture(); f.project.routes[0].locales = ["en"]; f.spanishPaths.clear(); f.registrySlugs.clear(); f.storySlugs.clear();
    f.input.staticMetadata.delete(f.esPath); f.input.sitemapPaths.delete(f.esPath); passes(f.input);
  });
  test("omitted metadata noindex equals false", () => {
    const f = fixture(); f.input.staticMetadata.set(f.path, {}); f.input.staticMetadata.set(f.esPath, {}); passes(f.input);
  });
  test("generic image and video refs need no case evidence", () => {
    const f = fixture("product");
    f.project.media = [{ id: "generic", purpose: "poster", asset: { kind: "image", src: "/fixture.webp" }, alt: { en: "Image" } },
      { id: "video", purpose: "walkthrough", asset: { kind: "video", videoAssetId: "fixture.video" as never }, alt: { en: "Video" } }];
    passes(f.input);
  });
  test("empty canonical subset does not require authority bijection", () => {
    const f = fixture(); f.input.projects = []; const result = passes(f.input); deepStrictEqual(result.counts.projects, 0); deepStrictEqual(result.counts.routes, 0);
  });
  test("root Spanish route is /es", () => {
    const f = fixture("product"); f.project.routes[0].path = "/";
    f.spanishPaths.clear(); f.spanishPaths.add("/");
    f.input.staticMetadata = new Map([["/", {}], ["/es", {}]]); f.input.sitemapPaths = new Set(["/", "/es"]); passes(f.input);
  });
  test("input not mutated and project order independent", () => {
    const f = fixture(); const other = fixture("immersive"); other.project.id = "fixture-spatial";
    f.input.projects.push(other.project);
    for (const [key, value] of other.input.staticMetadata) f.input.staticMetadata.set(key, value);
    for (const path of other.input.sitemapPaths) f.input.sitemapPaths.add(path);
    f.spanishPaths.add(other.path);
    const snapshot = structuredClone({ projects: f.input.projects, metadata: f.input.staticMetadata, sitemap: f.input.sitemapPaths, work: f.input.workCasePaths, immersive: f.input.immersiveCasePaths });
    const result = passes(f.input);
    deepStrictEqual({ projects: f.input.projects, metadata: f.input.staticMetadata, sitemap: f.input.sitemapPaths, work: f.input.workCasePaths, immersive: f.input.immersiveCasePaths }, snapshot);
    deepStrictEqual(passes({ ...f.input, projects: [...f.input.projects].reverse() }).counts, result.counts);
  });
  for (const item of negatives) {
    test(item.name, () => {
      const f = fixture(item.surface, item.hidden); item.mutate(f);
      const result = validateProjectRegistryIntegration(f.input);
      deepStrictEqual(result.ok, false);
      deepStrictEqual(result.issues.map(issue => issue.code), [item.code]);
      for (const issue of result.issues) {
        deepStrictEqual(issue.path.startsWith("projects[0]."), true);
        deepStrictEqual(issue.message.length > 0, true);
      }
    });
  }
  test("sitemap parses root, ES and normalized trailing slashes", () => {
    deepStrictEqual([...parseSitemapPaths('<urlset><url><loc>https://brenychstudio.com/</loc></url><url><loc>https://brenychstudio.com/es/work/fixture/</loc></url></urlset>')], ["/", "/es/work/fixture"]);
  });
  test("sitemap excludes foreign origins and protocol lookalikes", () => {
    deepStrictEqual([...parseSitemapPaths('<urlset><loc>https://foreign.example/work/fixture</loc><loc>http://brenychstudio.com/work/fixture</loc><loc>https://brenychstudio.com.evil.example/work/fixture</loc></urlset>')], []);
  });
  test("commented sitemap locations are not published paths", () => {
    deepStrictEqual([...parseSitemapPaths('<urlset><!-- <loc>https://brenychstudio.com/hidden</loc> --><loc>https://brenychstudio.com/</loc></urlset>')], ["/"]);
  });
  for (const [name, xml] of [
    ["duplicate paths", '<urlset><loc>https://brenychstudio.com/work/fixture</loc><loc>https://brenychstudio.com/work/fixture</loc></urlset>'],
    ["duplicate normalized paths", '<urlset><loc>https://brenychstudio.com/es/</loc><loc>https://brenychstudio.com/es</loc></urlset>'],
    ["malformed URL", '<urlset><loc>not-a-url</loc></urlset>'],
    ["unterminated loc", '<urlset><loc>https://brenychstudio.com/</urlset>'],
    ["query on canonical URL", '<urlset><loc>https://brenychstudio.com/work/fixture?x=1</loc></urlset>'],
    ["fragment on canonical URL", '<urlset><loc>https://brenychstudio.com/work/fixture#x</loc></urlset>'],
    ["malformed percent escape", '<urlset><loc>https://brenychstudio.com/work/%ZZ</loc></urlset>'],
    ["dot-segment silently normalized by URL", '<urlset><loc>https://brenychstudio.com/work/../fixture</loc></urlset>'],
    ["missing scheme slashes", '<urlset><loc>https:brenychstudio.com</loc></urlset>'],
    ["single scheme slash", '<urlset><loc>https:/brenychstudio.com</loc></urlset>'],
  ]) test(`sitemap rejects ${name}`, () => { throws(() => parseSitemapPaths(xml)); });

  console.log(`INTEGRATION_SELF_TEST_CASES=${caseCount}`);
  console.log(`INTEGRATION_SELF_TEST_FAILURES=${failures.length}`);
  for (const failure of failures) console.error(`✗ ${failure}`);
  console.log(`PROJECT_REGISTRY_INTEGRATION_SELF_TEST=${failures.length ? "FAIL" : "PASS"}`);
  if (failures.length) process.exitCode = 1;
}

if (process.argv.includes("--self-test")) {
  runSelfTests();
} else {
  try { await runValidation(); } catch (error) {
    console.error(`PROJECT_INTEGRATION_INPUT_ERROR=${error instanceof Error ? error.message : String(error)}`);
    console.log("PROJECT_REGISTRY_INTEGRATION=FAIL");
    process.exitCode = 1;
  }
}
