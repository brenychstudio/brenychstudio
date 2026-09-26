import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

// Canonical project registry gate (BSW-CORE-01). Validates src/data/projects.ts and
// src/data/milestones.ts against the current case, immersive and video registries, or runs the
// validator against in-memory fixtures. Deterministic: no network, no clock, no Git state, no
// filesystem outside the repository.
//
//   npm run core:validate              (runs inside `npm run build`, after tsc -b)
//   npm run core:validate:self-test

// The data registries import each other without file extensions (bundler resolution). Node's
// ESM loader needs the extension, so relative specifiers are completed with .ts/.tsx when that
// file exists. Everything below is imported dynamically so the hook is active first.
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

const { validateProjectRegistry } = await import("../src/data/projectRegistryValidation.ts");

type RegistryInput = import("../src/data/projectRegistryValidation.ts").ProjectRegistryInput;
type RegistryReferences = import("../src/data/projectRegistryValidation.ts").ProjectRegistryReferences;
type IssueCode = import("../src/data/projectRegistryValidation.ts").ProjectRegistryIssueCode;
type ProjectRecord = RegistryInput["projects"][number];
type MilestoneRecord = RegistryInput["milestones"][number];

const selfTest = process.argv.includes("--self-test");

// ---- Normal mode -------------------------------------------------------------------------------

async function runValidation() {
  const [{ projects, projectRelationships }, { milestones }, { cases }, { immersiveItems }, { videoAssets }] =
    await Promise.all([
      import("../src/data/projects.ts"),
      import("../src/data/milestones.ts"),
      import("../src/data/cases.ts"),
      import("../src/data/immersive.ts"),
      import("../src/media/video/videoAssets.ts"),
    ]);

  const references: RegistryReferences = {
    caseSlugs: cases.map((item) => item.slug),
    immersiveSlugs: immersiveItems.map((item) => item.slug),
    videoAssetIds: Object.keys(videoAssets),
  };

  const result = validateProjectRegistry({ projects, projectRelationships, milestones }, references);

  console.log(`PROJECTS=${result.counts.projects}`);
  console.log(`RELATIONSHIPS=${result.counts.relationships}`);
  console.log(`MILESTONES=${result.counts.milestones}`);
  console.log(`REFERENCE_CASES=${cases.length}`);
  console.log(`REFERENCE_IMMERSIVE=${immersiveItems.length}`);
  console.log(`REFERENCE_VIDEO_ASSETS=${Object.keys(videoAssets).length}`);
  console.log(`PROJECT_REGISTRY_ISSUES=${result.issues.length}`);
  for (const issue of result.issues) console.error(`✗ ${issue.code} ${issue.path}: ${issue.message}`);
  console.log(`PROJECT_REGISTRY_VALIDATION=${result.ok ? "PASS" : "FAIL"}`);

  if (!result.ok) process.exit(1);
}

// ---- Self-test fixtures ------------------------------------------------------------------------
// Synthetic ecosystem only. Nothing here describes a real Brenych Studio project and nothing is
// read from the production registries.

const FIXTURE_VIDEO_ID = "fixture.case.walkthrough";

function fixtureReferences(): RegistryReferences {
  return {
    caseSlugs: ["fixture-case", "fixture-case-two"],
    immersiveSlugs: ["fixture-immersive"],
    videoAssetIds: [FIXTURE_VIDEO_ID],
  };
}

function fixtureRegistry(): RegistryInput {
  const review = { lastReviewed: "2026-09-26", owner: "studio-owner" } as const;

  const listedProduct: ProjectRecord = {
    id: "fixture-product",
    publicName: "Fixture Product",
    aliases: ["Fixture Ops"],
    vertical: "product",
    origin: "studio-product",
    maturity: "beta",
    deployment: "public-demo",
    commercialAvailability: "controlled-access",
    visibility: "public-listed",
    copy: {
      oneLiner: { en: "A synthetic product used only by the validator self-test.", es: "Un producto sintético usado solo por el self-test del validador." },
      summary: { en: "Synthetic summary.", es: "Resumen sintético." },
    },
    limitations: [{ en: "Synthetic limitation.", es: "Limitación sintética." }],
    links: [
      { id: "public-demo", kind: "live", href: "https://fixture-product.example" },
      { id: "source", kind: "repository", href: "https://github.com/example/fixture-product", label: { en: "Repository", es: "Repositorio" } },
    ],
    routes: [{ surface: "work", path: "/work/fixture-case", locales: ["en", "es"] }],
    media: [
      { id: "poster", purpose: "poster", asset: { kind: "case-poster", caseSlug: "fixture-case" }, alt: { en: "Fixture poster", es: "Póster sintético" } },
      {
        id: "walkthrough",
        purpose: "walkthrough",
        asset: { kind: "video", videoAssetId: FIXTURE_VIDEO_ID as never, poster: "/fixtures/walkthrough-poster.webp" },
        alt: { en: "Fixture walkthrough", es: "Recorrido sintético" },
      },
    ],
    evidence: [
      { kind: "work-case", slug: "fixture-case", proves: { en: "Interface proof.", es: "Prueba de interfaz." }, visibility: "public" },
      { kind: "project-link", linkId: "public-demo", proves: { en: "Public demo.", es: "Demo pública." }, visibility: "public" },
      { kind: "media", mediaId: "walkthrough", proves: { en: "Walkthrough.", es: "Recorrido." }, visibility: "unlisted", limitations: { en: "Recorded on desktop.", es: "Grabado en escritorio." } },
      { kind: "milestone", milestoneId: "fixture-product-beta", proves: { en: "Beta is active.", es: "La beta está activa." }, visibility: "public" },
    ],
    serviceSlugs: ["product-demo-landing"],
    review,
  };

  const unlistedLab: ProjectRecord = {
    id: "fixture-lab",
    publicName: "Fixture Lab",
    aliases: [],
    vertical: "spatial-interactive",
    origin: "research",
    maturity: "prototype",
    deployment: "public-demo",
    commercialAvailability: "not-offered",
    visibility: "public-unlisted",
    copy: { oneLiner: { en: "A synthetic unlisted research surface." } },
    limitations: [],
    links: [],
    routes: [{ surface: "trust", path: "/fixture-lab", locales: ["en"], noIndex: true }],
    media: [{ id: "poster", purpose: "poster", asset: { kind: "immersive-poster", immersiveSlug: "fixture-immersive" }, alt: { en: "Lab poster" } }],
    evidence: [{ kind: "immersive-case", slug: "fixture-immersive", proves: { en: "Spatial proof." }, visibility: "unlisted" }],
    review,
  };

  const privateEngine: ProjectRecord = {
    id: "fixture-engine",
    publicName: "Fixture Engine",
    aliases: ["FE"],
    vertical: "agent-infrastructure",
    origin: "internal-system",
    maturity: "prototype",
    deployment: "internal-runtime",
    commercialAvailability: "not-offered",
    visibility: "private-named",
    copy: { oneLiner: { en: "A synthetic internal engine mentioned by name only." } },
    limitations: [{ en: "No public route." }],
    links: [],
    routes: [],
    media: [{ id: "still", purpose: "thumbnail", asset: { kind: "image", src: "/fixtures/engine.webp" }, alt: { en: "Engine still" } }],
    evidence: [],
    review,
  };

  const betaMilestone: MilestoneRecord = {
    id: "fixture-product-beta",
    projectId: "fixture-product",
    type: "release",
    label: { en: "Controlled beta", es: "Beta controlada" },
    status: "active",
    date: { kind: "month", value: "2026-09" },
    sources: [{ kind: "project-link", linkId: "public-demo" }],
    visibility: "public",
    limitations: [{ en: "Invite only.", es: "Solo con invitación." }],
    review,
  };

  const plannedEvent: MilestoneRecord = {
    id: "fixture-lab-showcase",
    projectId: "fixture-lab",
    type: "event",
    label: { en: "Lab showcase" },
    counterparty: "Fixture Gallery",
    status: "planned",
    date: { kind: "unknown" },
    sources: [],
    visibility: "unlisted",
    limitations: [],
    review,
  };

  return {
    projects: [listedProduct, unlistedLab, privateEngine],
    projectRelationships: [
      { id: "engine-powers-product", type: "tooling-for", fromProjectId: "fixture-engine", toProjectId: "fixture-product", label: { en: "Powers", es: "Impulsa" } },
      { id: "product-feeds-lab", type: "pipeline-next", fromProjectId: "fixture-product", toProjectId: "fixture-lab" },
    ],
    milestones: [betaMilestone, plannedEvent],
  };
}

// Mutable view of a fixture so each negative case can break exactly one thing.
type Mutable = { projects: Record<string, any>[]; projectRelationships: Record<string, any>[]; milestones: Record<string, any>[] };

type NegativeCase = { name: string; expect: IssueCode; mutate: (registry: Mutable, references: { caseSlugs: string[]; immersiveSlugs: string[]; videoAssetIds: string[] }) => void };

const NEGATIVE_CASES: NegativeCase[] = [
  { name: "invalid project id", expect: "PROJECT_ID_INVALID", mutate: (r) => { r.projects[0].id = "Fixture_Product"; } },
  { name: "duplicate project id", expect: "PROJECT_ID_DUPLICATE", mutate: (r) => { r.projects[1].id = "fixture-product"; } },
  { name: "duplicate route path", expect: "ROUTE_PATH_DUPLICATE", mutate: (r) => { r.projects[1].routes[0].path = "/work/fixture-case"; } },
  { name: "route path not root-relative", expect: "ROUTE_PATH_INVALID", mutate: (r) => { r.projects[0].routes[0].path = "work/fixture-case"; } },
  { name: "route locale outside en/es", expect: "ROUTE_LOCALE_INVALID", mutate: (r) => { r.projects[0].routes[0].locales = ["en", "uk"]; } },
  { name: "duplicate link id", expect: "LINK_ID_DUPLICATE", mutate: (r) => { r.projects[0].links[1].id = "public-demo"; } },
  { name: "invalid link href", expect: "LINK_HREF_INVALID", mutate: (r) => { r.projects[0].links[0].href = "fixture-product.example"; } },
  { name: "duplicate media id", expect: "MEDIA_ID_DUPLICATE", mutate: (r) => { r.projects[0].media[1].id = "poster"; } },
  { name: "public-listed without ES", expect: "TEXT_ES_MISSING", mutate: (r) => { delete r.projects[0].copy.oneLiner.es; } },
  { name: "public-listed with empty ES", expect: "TEXT_ES_EMPTY", mutate: (r) => { r.projects[0].limitations[0].es = "  "; } },
  { name: "public-listed without route", expect: "VISIBILITY_LISTED_ROUTE_REQUIRED", mutate: (r) => { r.projects[0].routes = []; } },
  { name: "public-listed without evidence", expect: "VISIBILITY_LISTED_EVIDENCE_REQUIRED", mutate: (r) => { r.projects[0].evidence = []; } },
  { name: "public-unlisted route without noIndex", expect: "VISIBILITY_UNLISTED_ROUTE_INDEXABLE", mutate: (r) => { delete r.projects[1].routes[0].noIndex; } },
  { name: "private-named with route", expect: "VISIBILITY_PRIVATE_ROUTE_FORBIDDEN", mutate: (r) => { r.projects[2].routes = [{ surface: "research", path: "/fixture-engine", locales: ["en"] }]; } },
  { name: "invalid enum value", expect: "ENUM_VALUE_INVALID", mutate: (r) => { r.projects[0].maturity = "shipped"; } },
  { name: "dangling work case", expect: "EVIDENCE_WORK_CASE_UNKNOWN", mutate: (r) => { r.projects[0].evidence[0].slug = "missing-case"; } },
  { name: "dangling immersive case", expect: "EVIDENCE_IMMERSIVE_CASE_UNKNOWN", mutate: (r) => { r.projects[1].evidence[0].slug = "missing-immersive"; } },
  { name: "dangling project link", expect: "EVIDENCE_LINK_UNKNOWN", mutate: (r) => { r.projects[0].evidence[1].linkId = "missing-link"; } },
  { name: "dangling project media", expect: "EVIDENCE_MEDIA_UNKNOWN", mutate: (r) => { r.projects[0].evidence[2].mediaId = "missing-media"; } },
  { name: "dangling milestone", expect: "EVIDENCE_MILESTONE_UNKNOWN", mutate: (r) => { r.projects[0].evidence[3].milestoneId = "missing-milestone"; } },
  { name: "milestone evidence from another project", expect: "EVIDENCE_MILESTONE_FOREIGN", mutate: (r) => { r.projects[0].evidence[3].milestoneId = "fixture-lab-showcase"; } },
  { name: "dangling case poster", expect: "MEDIA_CASE_POSTER_UNKNOWN", mutate: (r) => { r.projects[0].media[0].asset.caseSlug = "missing-case"; } },
  { name: "dangling immersive poster", expect: "MEDIA_IMMERSIVE_POSTER_UNKNOWN", mutate: (r) => { r.projects[1].media[0].asset.immersiveSlug = "missing-immersive"; } },
  { name: "invalid video asset id", expect: "MEDIA_VIDEO_ASSET_UNKNOWN", mutate: (r) => { r.projects[0].media[1].asset.videoAssetId = "missing.video"; } },
  { name: "video asset removed from reference layer", expect: "MEDIA_VIDEO_ASSET_UNKNOWN", mutate: (_r, refs) => { refs.videoAssetIds = []; } },
  { name: "image src not root-relative", expect: "MEDIA_IMAGE_SRC_INVALID", mutate: (r) => { r.projects[2].media[0].asset.src = "fixtures/engine.webp"; } },
  { name: "dangling relationship project", expect: "RELATIONSHIP_PROJECT_UNKNOWN", mutate: (r) => { r.projectRelationships[0].toProjectId = "missing-project"; } },
  { name: "self relationship", expect: "RELATIONSHIP_SELF", mutate: (r) => { r.projectRelationships[0].toProjectId = "fixture-engine"; } },
  { name: "duplicate relationship id", expect: "RELATIONSHIP_ID_DUPLICATE", mutate: (r) => { r.projectRelationships[1].id = "engine-powers-product"; } },
  { name: "duplicate milestone id", expect: "MILESTONE_ID_DUPLICATE", mutate: (r) => { r.milestones[1].id = "fixture-product-beta"; } },
  { name: "milestone project unknown", expect: "MILESTONE_PROJECT_UNKNOWN", mutate: (r) => { r.milestones[1].projectId = "missing-project"; } },
  { name: "accepted milestone without source", expect: "MILESTONE_SOURCES_REQUIRED", mutate: (r) => { r.milestones[0].sources = []; } },
  { name: "milestone source link unknown", expect: "MILESTONE_SOURCE_LINK_UNKNOWN", mutate: (r) => { r.milestones[0].sources[0].linkId = "missing-link"; } },
  { name: "milestone source href invalid", expect: "MILESTONE_SOURCE_HREF_INVALID", mutate: (r) => { r.milestones[0].sources = [{ kind: "url", href: "not a url" }]; } },
  { name: "public milestone without ES", expect: "TEXT_ES_MISSING", mutate: (r) => { delete r.milestones[0].label.es; } },
  { name: "invalid calendar date", expect: "REVIEW_DATE_INVALID", mutate: (r) => { r.projects[0].review = { ...r.projects[0].review, lastReviewed: "2026-02-30" }; } },
  { name: "invalid review owner", expect: "REVIEW_OWNER_INVALID", mutate: (r) => { r.projects[0].review = { ...r.projects[0].review, owner: "rb" }; } },
  { name: "invalid milestone month", expect: "MILESTONE_MONTH_INVALID", mutate: (r) => { r.milestones[0].date = { kind: "month", value: "2026-13" }; } },
  { name: "invalid milestone date", expect: "MILESTONE_DATE_INVALID", mutate: (r) => { r.milestones[0].date = { kind: "date", value: "2027-04-31" }; } },
  { name: "milestone end before start", expect: "MILESTONE_END_BEFORE_START", mutate: (r) => { r.milestones[0].endDate = { kind: "date", value: "2026-01-15" }; } },
];

function runSelfTests() {
  const failures: string[] = [];
  let caseCount = 0;

  // Positive: the synthetic ecosystem must pass with zero issues.
  caseCount += 1;
  const valid = validateProjectRegistry(fixtureRegistry(), fixtureReferences());
  if (!valid.ok) {
    failures.push(`valid fixture: expected PASS, got ${valid.issues.map((issue) => `${issue.code}@${issue.path}`).join(", ")}`);
  }
  if (valid.counts.projects !== 3 || valid.counts.relationships !== 2 || valid.counts.milestones !== 2) {
    failures.push(`valid fixture: unexpected counts ${JSON.stringify(valid.counts)}`);
  }

  // Positive: an empty registry (the CORE-01B state) is valid.
  caseCount += 1;
  const empty = validateProjectRegistry({ projects: [], projectRelationships: [], milestones: [] }, fixtureReferences());
  if (!empty.ok) failures.push("empty registry: expected PASS");

  // Positive: the validator must not depend on input order or mutate its input.
  caseCount += 1;
  const registry = fixtureRegistry();
  const snapshot = JSON.stringify(registry);
  const reversed = validateProjectRegistry(
    {
      projects: [...registry.projects].reverse(),
      projectRelationships: [...registry.projectRelationships].reverse(),
      milestones: [...registry.milestones].reverse(),
    },
    fixtureReferences(),
  );
  if (!reversed.ok) failures.push("reversed fixture: expected PASS");
  if (JSON.stringify(registry) !== snapshot) failures.push("validator mutated its input");

  // Negative: each mutation must surface its expected code.
  for (const negative of NEGATIVE_CASES) {
    caseCount += 1;
    const mutable = structuredClone(fixtureRegistry()) as unknown as Mutable;
    const refs = structuredClone(fixtureReferences()) as { caseSlugs: string[]; immersiveSlugs: string[]; videoAssetIds: string[] };
    negative.mutate(mutable, refs);
    const result = validateProjectRegistry(mutable as unknown as RegistryInput, refs);
    const codes = result.issues.map((issue) => issue.code);
    if (result.ok) {
      failures.push(`${negative.name}: expected ${negative.expect}, validator passed`);
    } else if (!codes.includes(negative.expect)) {
      failures.push(`${negative.name}: expected ${negative.expect}, got ${[...new Set(codes)].join(", ")}`);
    }
  }

  console.log(`SELF_TEST_CASES=${caseCount}`);
  console.log(`SELF_TEST_NEGATIVE_CASES=${NEGATIVE_CASES.length}`);
  console.log(`SELF_TEST_FAILURES=${failures.length}`);
  for (const failure of failures) console.error(`✗ ${failure}`);
  console.log(`PROJECT_REGISTRY_SELF_TEST=${failures.length ? "FAIL" : "PASS"}`);

  if (failures.length) process.exit(1);
}

if (selfTest) {
  runSelfTests();
} else {
  await runValidation();
}
