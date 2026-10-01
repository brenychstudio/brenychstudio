import { deepStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import type { ProjectRecord } from "../src/data/projectRegistry.types.ts";

// Match the registry validators' extension-completion loader on Node 22.
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

const { getEcosystemHomeProjects, resolveHomeProjectPoster, selectHomeProjects } = await import("../src/data/ecosystemHome.ts");
const { projects } = await import("../src/data/projects.ts");
const { cases } = await import("../src/data/cases.ts");
const { immersiveItems } = await import("../src/data/immersive.ts");

let caseCount = 0;
const failures: string[] = [];
function test(name: string, check: () => void) {
  caseCount += 1;
  try { check(); } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function canonical(id: string): ProjectRecord {
  const project = projects.find(item => item.id === id);
  ok(project, `Test setup requires canonical project ${id}`);
  return project;
}

function fixture(id: string, visibility: ProjectRecord["visibility"] = "public-listed"): ProjectRecord {
  return { ...structuredClone(canonical("weekfield")), id, publicName: "Synthetic fixture", visibility };
}

function freezeDeep(value: object) {
  Object.freeze(value);
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") freezeDeep(child);
  }
}

test("Home resolves the approved, restrained groups in presentation order", () => {
  const home = getEcosystemHomeProjects();
  deepStrictEqual(home.products.map(project => project.id), ["weekfield", "print-border-studio"]);
  deepStrictEqual(home.evidence.map(project => project.id), ["aurel-eon-gt", "oria-house-barcelona", "sprintcrm"]);
  deepStrictEqual(home.spatial.map(project => project.id), ["whisper", "orbit-lens"]);
  for (const project of Object.values(home).flat()) {
    strictEqual(project, canonical(project.id));
    strictEqual(project.visibility, "public-listed");
  }
  for (const project of home.products) {
    strictEqual(project.vertical, "product");
    strictEqual(project.origin, "studio-product");
  }
});

test("An explicitly requested Living Atlas remains outside public discovery", () => {
  const selected = selectHomeProjects(["weekfield", "living-atlas", "print-border-studio"]);
  deepStrictEqual(selected.map(project => project.id), ["weekfield", "print-border-studio"]);
  strictEqual(canonical("living-atlas").visibility, "public-unlisted");
});

test("All composed Home groups apply changed disclosure policy at read time", () => {
  const registry: ProjectRecord[] = structuredClone([...projects]);
  for (const project of registry) {
    if (["weekfield", "whisper"].includes(project.id)) project.visibility = "public-unlisted";
    if (project.id === "aurel-eon-gt") project.visibility = "private-named";
  }
  const home = getEcosystemHomeProjects(registry);
  deepStrictEqual(home.products.map(project => project.id), ["print-border-studio"]);
  deepStrictEqual(home.evidence.map(project => project.id), ["oria-house-barcelona", "sprintcrm"]);
  deepStrictEqual(home.spatial.map(project => project.id), ["orbit-lens"]);
});

for (const change of [{ origin: "internal-system" }, { vertical: "web-systems" }] as const) {
  test(`Flagship selection rejects a project reclassified by ${Object.keys(change)[0]}`, () => {
    const registry: ProjectRecord[] = structuredClone([...projects]);
    const project = registry.find(item => item.id === "weekfield");
    ok(project);
    Object.assign(project, change);
    throws(() => getEcosystemHomeProjects(registry), /weekfield/);
  });
}

test("Missing configured project fails in composed groups", () => {
  const registry = projects.filter(project => project.id !== "whisper");
  throws(() => getEcosystemHomeProjects(registry), /whisper/);
});

test("Disclosure is a visibility allowlist, independent of approved-looking product facts", () => {
  const records = [fixture("first"), fixture("unlisted", "public-unlisted"), fixture("private", "private-named"), fixture("last")];
  const selected = selectHomeProjects(["last", "private", "unlisted", "first"], records);
  deepStrictEqual(selected.map(project => project.id), ["last", "first"]);
  strictEqual(selected[0], records[3]);
  strictEqual(selected[1], records[0]);
});

test("Disclosure fails closed for an unrecognized runtime visibility", () => {
  const record = fixture("future-visibility");
  Object.assign(record, { visibility: "future-policy" });
  deepStrictEqual(selectHomeProjects([record.id], [record]), []);
});

test("A missing configured canonical ID fails even after a hidden record", () => {
  throws(() => selectHomeProjects(["living-atlas", "missing-home-project"]), /missing-home-project/);
});

test("Selection preserves exact records and leaves frozen input and canonical facts untouched", () => {
  const records = [fixture("first"), fixture("hidden", "public-unlisted"), fixture("last")];
  const ids = ["last", "hidden", "first"];
  const before = structuredClone({ records, ids });
  const canonicalBefore = structuredClone(projects);
  freezeDeep(records);
  Object.freeze(ids);
  const selected = selectHomeProjects(ids, records);
  strictEqual(selected[0], records[2]);
  strictEqual(selected[1], records[0]);
  deepStrictEqual({ records, ids }, before);
  deepStrictEqual(projects, canonicalBefore);
});

test("An empty presentation group has no implicit fallback projects", () => {
  deepStrictEqual(selectHomeProjects([]), []);
});

test("Weekfield resolves its historical CreatorOps poster reference", () => {
  const authority = cases.find(item => item.slug === "creatorops");
  ok(authority);
  strictEqual(resolveHomeProjectPoster(canonical("weekfield"), "en").src, authority.poster.src);
});

test("Spatial projects resolve approved immersive previews", () => {
  for (const id of ["whisper", "orbit-lens"]) {
    const authority = immersiveItems.find(item => item.slug === id);
    ok(authority?.previewPoster);
    strictEqual(resolveHomeProjectPoster(canonical(id), "en").src, authority.previewPoster);
  }
});

test("Every rendered Home poster has its canonical EN and ES alt text", () => {
  for (const project of Object.values(getEcosystemHomeProjects()).flat()) {
    const media = project.media.find(item => item.purpose === "poster");
    ok(media?.alt.en);
    ok(media.alt.es);
    for (const locale of ["en", "es"] as const) {
      const poster = resolveHomeProjectPoster(project, locale);
      ok(poster.src.trim());
      strictEqual(poster.alt, media.alt[locale]);
    }
  }
});

test("Poster resolution follows media purpose and canonical alt, not project name or first media", () => {
  const project = fixture("different-project-id");
  project.media.unshift({ id: "hero", purpose: "hero", asset: { kind: "image", src: "/synthetic-hero.webp" }, alt: { en: "Hero" } });
  project.media[1].alt = { en: "Canonical English caption", es: "Texto alternativo canónico" };
  const authority = cases.find(item => item.slug === "creatorops");
  ok(authority);
  deepStrictEqual(resolveHomeProjectPoster(project, "es"), { src: authority.poster.src, alt: "Texto alternativo canónico" });
});

test("Missing poster metadata fails with project context", () => {
  const project = fixture("missing-poster");
  project.media = [];
  throws(() => resolveHomeProjectPoster(project, "en"), /missing-poster/);
});

test("A broken Work poster reference fails loudly", () => {
  const project = fixture("broken-work-poster");
  project.media[0].asset = { kind: "case-poster", caseSlug: "missing-case" };
  throws(() => resolveHomeProjectPoster(project, "en"), /broken-work-poster/);
});

test("A broken immersive poster reference fails loudly", () => {
  const project = fixture("broken-spatial-poster");
  project.media[0].asset = { kind: "immersive-poster", immersiveSlug: "missing-immersive" };
  throws(() => resolveHomeProjectPoster(project, "en"), /broken-spatial-poster/);
});

test("Missing Spanish alt text fails instead of silently publishing English", () => {
  const project = fixture("missing-es-alt");
  project.media[0].alt = { en: "English only" };
  throws(() => resolveHomeProjectPoster(project, "es"), /missing-es-alt/);
});

test("Canonical direct image and video-poster references resolve without inferred paths", () => {
  const project = fixture("direct-poster");
  project.media[0].asset = { kind: "image", src: "/synthetic-image.webp" };
  strictEqual(resolveHomeProjectPoster(project, "en").src, "/synthetic-image.webp");
  project.media[0].asset = { kind: "video", videoAssetId: "weekfield.case.walkthrough", poster: "/synthetic-video-poster.webp" };
  strictEqual(resolveHomeProjectPoster(project, "en").src, "/synthetic-video-poster.webp");
  delete project.media[0].asset.poster;
  throws(() => resolveHomeProjectPoster(project, "en"), /direct-poster/);
});

console.log(`HOME_SELECTOR_TEST_CASES=${caseCount}`);
console.log(`HOME_SELECTOR_TEST_FAILURES=${failures.length}`);
for (const failure of failures) console.error(`✗ ${failure}`);
console.log(`ECOSYSTEM_HOME_VALIDATE=${failures.length ? "FAIL" : "PASS"}`);
if (failures.length) process.exitCode = 1;
