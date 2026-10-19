import { deepStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
const { getHomeSpatialProofs, selectHomeSpatialProofs } = await import("../src/ui/home/homeSpatialPresentation.ts");

let caseCount = 0;
const failures: string[] = [];
function test(name: string, check: () => void) {
  caseCount += 1;
  const started = performance.now();
  try { check(); } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (process.env.HOME_VALIDATE_TIMING) console.log(`${(performance.now() - started).toFixed(0).padStart(6)} ms  ${name}`);
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
  strictEqual("spatial" in home, false);
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
  deepStrictEqual(selectHomeSpatialProofs("en", { projects: registry, immersive: immersiveItems }).map(proof => proof.key), ["webhero"]);
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
  const registry = projects.filter(project => project.id !== "weekfield");
  throws(() => getEcosystemHomeProjects(registry), /weekfield/);
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

test("Spatial is the exact public projection, with both locales and no raw fields", () => {
  const keys = ["key", "source", "sourceId", "title", "summary", "statusLabel", "caseLabel", "posterAlt", "posterSrc", "videoAssetId", "videoSrc", "casePath"].sort();
  for (const locale of ["en", "es"] as const) {
    const proofs = getHomeSpatialProofs(locale);
    deepStrictEqual(proofs.map(proof => [proof.key, proof.source]), [["whisper", "canonical-project"], ["webhero", "public-immersive"]]);
    for (const proof of proofs) { deepStrictEqual(Object.keys(proof).sort(), keys); ok(proof.summary && proof.posterAlt); }
    strictEqual(proofs[1].casePath, locale === "en" ? "/immersive/webhero" : "/es/immersive/webhero");
    ok(existsSync(new URL(`../public${proofs[1].posterSrc}`, import.meta.url)));
  }
  ok(!projects.some(project => project.id === "webhero"));
  strictEqual(canonical("orbit-lens").visibility, "public-listed");
  ok(immersiveItems.some(item => item.slug === "orbit-lens"));
});
test("Spatial missing configured media or locale fails without a fallback", () => {
  for (const field of ["previewPoster", "previewVideo", "translations"] as const) {
    const immersive = structuredClone(immersiveItems);
    delete immersive.find(item => item.slug === "webhero")![field];
    throws(() => selectHomeSpatialProofs("en", { projects, immersive }), /webhero/);
  }
  throws(() => selectHomeSpatialProofs("en", { projects, immersive: immersiveItems.filter(item => item.slug !== "webhero") }), /webhero/);
  throws(() => selectHomeSpatialProofs("en", { projects: projects.filter(item => item.id !== "whisper"), immersive: immersiveItems }), /whisper/);
});
test("Spatial policy mismatch fails closed and frozen sources remain intact", () => {
  const registry = structuredClone(projects), immersive = structuredClone(immersiveItems);
  registry.find(item => item.id === "whisper")!.visibility = "public-unlisted";
  immersive.find(item => item.slug === "webhero")!.status = "Flagship concept";
  freezeDeep(registry); freezeDeep(immersive);
  deepStrictEqual(selectHomeSpatialProofs("es", { projects: registry, immersive }), []);
});

// ---------------------------------------------------------------- Section 06 Rule Field: REV1 solver, terrain and copy guards
const R = await import("../src/ui/home/homeResearchModel.ts");
const { homeCopy } = await import("../src/ui/home/homeCopy.ts");
const { createHash } = await import("node:crypto");
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const researchNet = R.buildNetwork();
const lattice = R.constraintLattice();
const step10 = lattice.filter(c => c.x % 10 === 0 && c.y % 10 === 0);
type ResearchRow = { cls: string; fam: string; sig: string; cost: number; reason: string; ev: ReturnType<typeof R.evaluate> };
const researchRows = new Map<string, ResearchRow>();
for (const c of lattice) {
  const ev = R.evaluate(researchNet, c);
  researchRows.set(`${c.x},${c.y}`, { cls: ev.routeClass, fam: R.routeFamily(ev), sig: R.signature(ev.accepted), cost: ev.accepted?.cost ?? NaN, reason: ev.reason, ev });
}
// The REV1 proof's serialization of the result (algorithm-proof.json, hash 841ad4d3…dcf8).
const researchHash = (rows: Map<string, Pick<ResearchRow, "cls" | "fam" | "sig" | "cost" | "reason">>) =>
  sha256(JSON.stringify([...rows.keys()].sort().map(k => { const r = rows.get(k)!; return [k, r.cls, r.fam, r.sig, r.cost.toFixed(9), r.reason]; })));

test("Research network is the REV1 23-node / 46-link graph with stable IDs and configuration", () => {
  strictEqual(researchNet.nodes.length, 23);
  strictEqual(researchNet.edges.length, 46);
  deepStrictEqual(researchNet.nodes.map(n => n.id), ["S", "T", "H", ...[0, 1, 2, 3, 4, 5, 6, 7].map(k => `I${k}`), ...[0, 1, 2, 3, 4, 5, 6, 7].map(k => `O${k}`), "P1", "P2", "P3", "P4"]);
  const groups = Object.fromEntries([...new Set(researchNet.edges.map(e => e.group))].map(g => [g, researchNet.edges.filter(e => e.group === g).length]));
  deepStrictEqual(groups, { spoke: 8, radial: 8, inner: 8, outer: 8, axis: 2, lane: 12 });
  const config = { domain: R.DOMAIN, ring: R.RING, rule: R.RULE, lattice: R.CONSTRAINT, legalEpsilon: R.LEGAL_EPSILON, terrain: R.TERRAIN, nodes: researchNet.nodes, edges: researchNet.edges };
  strictEqual(sha256(JSON.stringify(config)), "32209c69da3e982da94d3f282755b228a85ca06813329632f0d827004434174e");
});

test("Research solver reproduces the REV1 result on all 9,317 supported inputs", () => {
  strictEqual(lattice.length, 9317);
  strictEqual(researchHash(researchRows), "841ad4d3ee867575f7d8dc1aaf673da28c5925b4fa23bf128f50a7ae9002dcf8");
  const tally = (key: "cls" | "fam") => { const t: Record<string, number> = {}; for (const r of researchRows.values()) t[r[key]] = (t[r[key]] ?? 0) + 1; return t; };
  deepStrictEqual(tally("cls"), { direct: 4846, above: 2236, below: 2235 });
  deepStrictEqual(Object.entries(tally("fam")).sort(), Object.entries({ direct: 4846, "rejoin-origin": 1466, "rejoin-destination": 1466, lane: 951, wrap: 476, hop: 112 }).sort());
  strictEqual(new Set([...researchRows.values()].map(r => r.sig)).size, 13);
  let noRunnerUp = 0, minCore = Infinity;
  const ties: string[] = [];
  const nodes = R.nodeMap(researchNet);
  for (const [key, row] of researchRows) {
    const ev = row.ev;
    ok(ev.accepted, `no allowed route at ${key}`);
    for (const id of ev.accepted.edges) minCore = Math.min(minCore, R.distanceToEdge(ev.constraint, researchNet.edges.find(e => e.id === id)!, nodes) - R.RULE.core);
    if (ev.routeClass === "direct") continue;
    if (!ev.runnerUp) noRunnerUp++;
    if (R.isTie(ev)) ties.push(key);
  }
  strictEqual(noRunnerUp, 58);
  deepStrictEqual(ties, ["500,300"]);
  strictEqual(researchRows.get("500,300")!.cls, "above", "the fixed tie rule picks above");
  ok(minCore > R.RULE.clearance, `accepted routes keep more than the clearance from the core (${minCore})`);
});

test("Research solver agrees with Bellman–Ford and is independent of edge order", () => {
  const reversed = { ...researchNet, edges: [...researchNet.edges].reverse() };
  for (const c of step10) {
    const row = researchRows.get(`${c.x},${c.y}`)!, states = R.evaluateEdges(researchNet, c);
    const dist = new Map(researchNet.nodes.map(n => [n.id, Infinity] as [string, number]));
    dist.set(researchNet.source, 0);
    for (let i = 0; i < researchNet.nodes.length - 1; i++) {
      for (const e of researchNet.edges) {
        const s = states.get(e.id)!; if (!s.legal) continue;
        if (dist.get(e.a)! + s.cost < dist.get(e.b)!) dist.set(e.b, dist.get(e.a)! + s.cost);
        if (dist.get(e.b)! + s.cost < dist.get(e.a)!) dist.set(e.a, dist.get(e.b)! + s.cost);
      }
    }
    ok(Math.abs(dist.get(researchNet.target)! - row.cost) < 1e-6, `Bellman–Ford differs at ${c.x},${c.y}`);
    const again = R.evaluate(reversed, c);
    strictEqual(R.signature(again.accepted), row.sig, `edge order changes the route at ${c.x},${c.y}`);
    strictEqual(again.accepted!.cost, row.cost, `edge order changes the cost at ${c.x},${c.y}`);
  }
});

test("Research named states A–E keep their REV1 decisions", () => {
  const at = (x: number, y: number) => researchRows.get(`${x},${y}`)!.ev;
  const r3 = (v: number) => Math.round(v * 1000) / 1000;
  const A = at(500, 335), B = at(250, 295), C = at(620, 170), D = at(435, 375), E = at(200, 225);
  deepStrictEqual([A.routeClass, R.routeFamily(A), R.signature(A.accepted), r3(A.accepted!.cost), R.signature(A.runnerUp), r3(A.runnerUp!.cost), A.blockedOnCandidate],
    ["above", "wrap", "S·O4·I4·I3·I2·I1·I0·O0·T", 1086.867, "S·P3·O6·P4·T", 1114.935, ["h4", "h0"]]);
  deepStrictEqual([B.routeClass, R.routeFamily(B), R.signature(B.accepted), r3(B.accepted!.cost), r3(B.runnerUp!.cost)], ["below", "rejoin-origin", "S·P3·O5·I5·H·I0·O0·T", 1083.937, 1101.497]);
  deepStrictEqual([C.routeClass, r3(C.accepted!.cost)], ["direct", 929.612]);
  deepStrictEqual([D.routeClass, R.routeFamily(D), r3(D.accepted!.cost), r3(D.runnerUp!.cost)], ["above", "lane", 1110.425, 1129.918]);
  deepStrictEqual([E.routeClass, E.runnerUp, r3(E.accepted!.cost)], ["below", null, 1073.241]);
  deepStrictEqual(R.DEFAULT_CONSTRAINT, { x: 500, y: 335 });
});

test("Research decision minimap and F2 terrain union constants match the solver", () => {
  const rows = Array.from({ length: 10 }, (_, j) => Array.from({ length: 16 }, (_, i) => { const cls = researchRows.get(`${200 + i * 40},${110 + j * 40}`)!.cls; return cls === "direct" ? "d" : cls === "above" ? "a" : "b"; }).join(""));
  deepStrictEqual(rows, [...R.DECISION_MINIMAP.rows]);
  strictEqual(sha256(rows.join("|")), "a5fc88f5894869c7216b14eb87a8ce5218355cd4e142cf6e038cafd2133ba266");
  // Constants derived on the 10-unit sub-lattice, rounded outward. Landscape equals the full-lattice union; portrait sits
  // 0.18 u inside its full-lattice y0 (−330.029 vs −329.848, ≈ 0.08 px on a phone), absorbed by the static terrain inset.
  for (const orient of ["landscape", "portrait"] as const) {
    const u = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    for (const c of step10) {
      const pts = R.functionalPoints(researchNet, c);
      for (const v of R.viewpointExtremes(orient)) { const b = R.boxOf(pts, c, v); u.x0 = Math.min(u.x0, b.x0); u.y0 = Math.min(u.y0, b.y0); u.x1 = Math.max(u.x1, b.x1); u.y1 = Math.max(u.y1, b.y1); }
    }
    deepStrictEqual(R.TERRAIN_UNION[orient], { x0: Math.floor(u.x0 * 1000) / 1000, y0: Math.floor(u.y0 * 1000) / 1000, x1: Math.ceil(u.x1 * 1000) / 1000, y1: Math.ceil(u.y1 * 1000) / 1000 });
  }
});

test("Research functional drawing stays inside the art box through the whole morph", () => {
  const extremes = [{ x: 200, y: 110 }, { x: 800, y: 110 }, { x: 200, y: 490 }, { x: 800, y: 490 }, { x: 500, y: 110 }, { x: 500, y: 490 }, { x: 500, y: 300 }, { x: 200, y: 300 }, { x: 800, y: 300 }];
  for (const [vw, vh] of [[1024, 760], [1366, 768], [1920, 1080], [2137, 1270], [2560, 1440], [1536, 720], [1280, 680], [1024, 700]]) {
    const art = R.artBox(vw, vh - 84, vw - 15);
    const flat = R.fit(R.flatBox("landscape"), art, R.LAYOUT.flatFill), terrain = R.fit(R.TERRAIN_UNION.landscape, art, R.LAYOUT.maxFill);
    for (let i = 0; i <= 10; i++) {
      const s = R.smooth(i / 10), { k, ox, oy } = R.blend(flat, terrain, s);
      for (const c of extremes) for (const v of R.viewpointExtremes("landscape")) {
        const b = R.boxOf(R.functionalPoints(researchNet, c), c, { ...v, s, yaw: i === 10 ? v.yaw : 0, pitch: i === 10 ? v.pitch : 0 });
        const over = Math.max(art.x0 - (ox + k * b.x0), ox + k * b.x1 - art.x1, art.y0 - (oy + k * b.y0), oy + k * b.y1 - art.y1);
        ok(over <= 0.5, `functional overflow ${over.toFixed(2)} px at ${vw}x${vh}, s ${s.toFixed(2)}, ${c.x},${c.y}`);
      }
    }
    // A Rail placed beyond the anchor halo never moves the composition; a closer one keeps the halo 24 px clear.
    deepStrictEqual(R.clampArtToRail(art, art.x1 + 300), art);
    const near = R.clampArtToRail(art, art.x1 + 30), f = R.fit(R.flatBox("landscape"), near, R.LAYOUT.flatFill), t = R.fit(R.TERRAIN_UNION.landscape, near, R.LAYOUT.maxFill);
    ok(Math.max(f.ox + f.k * 452, t.ox + t.k * R.TERRAIN_UNION.landscape.x1) + R.ANCHOR_HALO <= art.x1 + 30 - 24 + 0.6, `anchor halo reaches the Rail at ${vw}x${vh}`);
  }
});

test("Research projection helper is the REV1 camera and readouts always separate the two costs", () => {
  const c = { x: 435, y: 375 }, src: number[] = [], z: number[] = [];
  for (let x = 0; x <= 1000; x += 125) for (let y = 0; y <= 600; y += 75) { src.push(x, y); z.push(R.height(x, y, c)); }
  for (const v of [{ s: 0, yaw: 0, pitch: 0 }, { s: 0.37, yaw: 0, pitch: 0 }, { s: 1, yaw: R.TERRAIN.viewYaw, pitch: -R.TERRAIN.viewPitch }, { s: 1, yaw: 0, pitch: 0, orient: "portrait" as const }]) {
    const out = new Float64Array(src.length);
    R.projectPoints(src, z, out, v, { k: 1, ox: 0, oy: 0 });
    for (let i = 0; i < z.length; i++) { const p = R.project(src[2 * i], src[2 * i + 1], z[i], v); strictEqual(out[2 * i], p.x); strictEqual(out[2 * i + 1], p.y); }
  }
  for (const [key, row] of researchRows) {
    const ev = row.ev;
    if (!ev.runnerUp || R.isTie(ev)) continue;
    const d = R.readoutDecimals(ev.accepted!.cost, ev.runnerUp.cost);
    for (const locale of ["en-US", "es-ES"]) {
      const f = new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d });
      ok(f.format(ev.accepted!.cost) !== f.format(ev.runnerUp.cost), `readout shows equal costs at ${key} (${locale})`);
    }
  }
});

test("Research phases follow the REV1 timeline on one reversible clock", () => {
  strictEqual(R.RESEARCH_MOTION.omega, 20);
  strictEqual(R.RESEARCH_MOTION.worldsProgress, 0.86);
  const at = (p: number) => R.resolveResearchPhase(p);
  deepStrictEqual([0, 0.09, 0.1, 0.31, 0.32, 0.47, 0.48, 0.79, 0.8, 1].map(p => at(p).index), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
  strictEqual(at(0.48).s, 0); strictEqual(at(0.8).s, 1); strictEqual(at(0.64).s, 0.5);
  strictEqual(at(0.34).resultShown, true); strictEqual(at(0.3399).resultShown, false);
  ok(at(0.4799).drag && !at(0.48).drag, "drag ends where the morph starts");
  strictEqual(at(R.RESEARCH_MOTION.worldsProgress).title, 1, "#worlds lands on the Worlds title");
  let previous = at(0);
  for (let p = 0.001; p <= 1; p += 0.001) {
    const next = at(p);
    for (const key of ["grid", "rings", "rejected", "reveal", "runnerUp", "s", "title", "note"] as const) ok(next[key] >= previous[key] - 1e-12, `${key} is not monotone at ${p.toFixed(3)}`);
    previous = next;
  }
});

// ---------------------------------------------------------------- Section 06 FIX1 climax (Stage A motion proof): presentation only
test("Research pacing (FIX3) re-allocates one track per beat without moving any state, and the climax starts from the REV1 camera", () => {
  const { trackSvh, beats } = R.RESEARCH_PACING, K = R.RESEARCH_PACE_KNOTS, total = beats.reduce((s, [svh]) => s + svh, 0);
  strictEqual(trackSvh, 550); ok(trackSvh <= 620, "track within the owner's bound");
  strictEqual(total, trackSvh - 100, "beats share the whole travel (track − stage, svh part)");
  const css = readFileSync(new URL("../src/ui/home/ecosystemResearchStage.css", import.meta.url), "utf8");
  ok(css.includes(`.eco-rf-track { position: relative; height: ${trackSvh}svh;`), "CSS track height = RESEARCH_PACING.trackSvh");
  const worlds = Math.round(R.researchTrackAt(R.RESEARCH_MOTION.worldsProgress) * total * 1e6) / 1e6;
  ok(css.includes(`top: calc((${total}svh + 84px) * ${worlds} / ${total})`), `#worlds sits where the story reaches legacy p .86 (${worlds} of ${total} svh)`);
  // Knots: (0, 0) to (1, 2), strictly increasing in both; the map and its inverse agree; the map is monotone and continuous.
  deepStrictEqual(K[0], [0, 0]); deepStrictEqual(K[K.length - 1], [1, 2]);
  for (let i = 1; i < K.length; i++) ok(K[i][0] > K[i - 1][0] && K[i][1] > K[i - 1][1], `knot ${i} not increasing`);
  let last = -1;
  for (let i = 0; i <= 4000; i++) {
    const u = i / 4000, { legacy, climax } = R.paceResearchTrack(u), story = climax > 0 ? 1 + climax : legacy;
    ok(story >= last - 1e-12, `pacing not monotone at ${u}`); ok(i === 0 || story - last < 0.01, `pacing jumps at ${u}`); last = story;
    ok(Math.abs(R.researchTrackAt(story) - u) < 1e-9 || (legacy === 1 && climax === 0), `inverse off at ${u}`);
  }
  // Every knot sits on a beat boundary where all ramps are at rest, so no ramp changes speed mid-way.
  const flat = (s: number) => { const p = R.resolveResearchPhase(Math.min(1, s)), c = R.resolveResearchClimax(Math.max(0, s - 1));
    return [p.grid, ...p.tiers, p.rings, p.rejected, p.reveal, p.runnerUp, p.s, p.title, p.note, c.tilt, c.expand, c.guides, ...c.glyphs, ...c.labels, c.thesis]; };
  for (const [, s] of K.slice(1, -1)) {
    const a = flat(s - 1e-6), b = flat(s + 1e-6);
    a.forEach((v, i) => ok(Math.abs(b[i] - v) < 1e-7, `ramp ${i} moving at knot ${s}`));
  }
  // The owner film (2560×1270): the rushed beats get at least +25 % scroll travel vs the FIX2 track at the same viewport.
  const vh = 1270, travel = (trackSvh - 100) / 100 * vh + 84, legacyOld = 2 * vh + 84, climaxOld = 1.5 * vh;
  const at = (s: number) => R.researchTrackAt(s) * travel;
  for (const [name, s0, s1] of [["emerge", 0, 0.12], ["evaluate", 0.32, 0.48], ["terrain", 0.48, 0.8], ["tilt + ground", 1, 1.62], ["domains", 1.62, 1.91]] as const) {
    const before = s1 <= 1 ? (s1 - s0) * legacyOld : (s1 - s0) * climaxOld, after = at(s1) - at(s0);
    ok(after >= 1.25 * before, `${name}: ${after.toFixed(0)} px vs ${before.toFixed(0)} px before`);
  }
  // The climax view at T = 0 is the REV1 terrain view, point for point.
  const c = { x: 435, y: 375 }, src: number[] = [], z: number[] = [];
  for (let x = 0; x <= 1000; x += 125) for (let y = 0; y <= 600; y += 75) { src.push(x, y); z.push(R.height(x, y, c)); }
  for (const v of R.viewpointExtremes("landscape")) {
    const a = new Float64Array(src.length), b = new Float64Array(src.length);
    R.projectPoints(src, z, a, v, { k: 1, ox: 0, oy: 0 }); R.projectPoints(src, z, b, R.climaxView(v, 0), { k: 1, ox: 0, oy: 0 });
    deepStrictEqual([...b], [...a]);
    const t = R.climaxView(v, 0.37);
    for (let i = 0; i < z.length; i++) { const p = R.project(src[2 * i], src[2 * i + 1], z[i], t), q = new Float64Array(2); R.projectPoints([src[2 * i], src[2 * i + 1]], [z[i]], q, t, { k: 1, ox: 0, oy: 0 }); strictEqual(q[0], p.x); strictEqual(q[1], p.y); }
  }
  // One reversible clock: every climax ramp starts at 0, ends at 1, and never goes backwards.
  deepStrictEqual(R.resolveResearchClimax(0), R.CLIMAX_REST);
  deepStrictEqual(R.resolveResearchClimax(1), { c: 1, tilt: 1, expand: 1, guides: 1, glyphs: [1, 1, 1, 1], labels: [1, 1, 1, 1], thesis: 1 });
  let previous = R.resolveResearchClimax(0);
  for (let p = 0.001; p <= 1; p += 0.001) {
    const next = R.resolveResearchClimax(p);
    for (const key of ["tilt", "expand", "guides", "thesis"] as const) ok(next[key] >= previous[key] - 1e-12, `${key} is not monotone at ${p.toFixed(3)}`);
    for (let i = 0; i < 4; i++) ok(next.glyphs[i] >= previous.glyphs[i] - 1e-12 && next.labels[i] >= previous.labels[i] - 1e-12, `domain ${i} ramp is not monotone at ${p.toFixed(3)}`);
    previous = next;
  }
  const pitch = (R.TERRAIN.pitch + R.RESEARCH_CLIMAX.pitch) * 180 / Math.PI;
  ok(pitch >= 63 - 1e-9 && pitch <= 69 + 1e-9, `deep tilt ${pitch}° outside the approved 63–69° range`);
});

test("Research climax union matches the solver and the climax camera keeps the functional drawing inside the art box", () => {
  const u = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const c of step10) {
    const pts = R.functionalPoints(researchNet, c);
    for (const v of R.viewpointExtremes("landscape")) { const b = R.boxOf(pts, c, R.climaxView(v, 1)); u.x0 = Math.min(u.x0, b.x0); u.y0 = Math.min(u.y0, b.y0); u.x1 = Math.max(u.x1, b.x1); u.y1 = Math.max(u.y1, b.y1); }
  }
  // Outward-rounded to 0.001 u plus a 1-unit margin (integer thousandths), which covers the full 5-unit lattice.
  deepStrictEqual(R.CLIMAX_UNION, { x0: (Math.floor(u.x0 * 1000) - 1000) / 1000, y0: (Math.floor(u.y0 * 1000) - 1000) / 1000, x1: (Math.ceil(u.x1 * 1000) + 1000) / 1000, y1: (Math.ceil(u.y1 * 1000) + 1000) / 1000 });
  const extremes = [{ x: 200, y: 110 }, { x: 800, y: 110 }, { x: 200, y: 490 }, { x: 800, y: 490 }, { x: 500, y: 110 }, { x: 500, y: 490 }, { x: 500, y: 300 }, { x: 200, y: 300 }, { x: 800, y: 300 }];
  for (const [vw, vh] of [[1024, 760], [1366, 768], [1920, 1080], [2137, 1270], [2560, 1440], [1536, 720], [1280, 680], [1024, 700]]) {
    const formula = R.artBox(vw, vh - 84, vw - 15);
    for (const gap of [300, 30]) {
      // The Rail far away or close: the art box is clamped as in the stage, then the climax camera is fitted to it.
      const railLeft = formula.x1 + gap, art = R.clampArtToRail(formula, railLeft);
      const terrain = R.fit(R.TERRAIN_UNION.landscape, art, R.LAYOUT.maxFill), final = R.climaxFit(art, railLeft);
      ok(final.k > 0 && Number.isFinite(final.ox) && Number.isFinite(final.oy), `degenerate climax camera at ${vw}x${vh}`);
      for (let i = 0; i <= 20; i++) {
        const T = i / 20, { k, ox, oy } = R.blend(terrain, final, T);
        for (const c of extremes) for (const v of R.viewpointExtremes("landscape")) {
          const b = R.boxOf(R.functionalPoints(researchNet, c), c, R.climaxView(v, T));
          const over = Math.max(art.x0 - (ox + k * b.x0), ox + k * b.x1 - art.x1, art.y0 - (oy + k * b.y0), oy + k * b.y1 - art.y1);
          ok(over <= 0.5, `climax functional overflow ${over.toFixed(2)} px at ${vw}x${vh}, T ${T}, ${c.x},${c.y}`);
          ok(ox + k * b.x1 + R.ANCHOR_HALO <= railLeft - 24 + 0.6, `climax anchor halo reaches the Rail at ${vw}x${vh}, T ${T}`);
          ok(ox + k * b.x0 - R.ANCHOR_HALO >= 8 - 0.5, `climax anchor halo within 8 px of the screen edge at ${vw}x${vh}, T ${T}`);
        }
      }
    }
  }
  // Ghost anchors are real vertices, off the default accepted route and its runner-up.
  const A = researchRows.get("500,335")!.ev;
  strictEqual(R.RESEARCH_CLIMAX.anchors.length, 4);
  for (const id of R.RESEARCH_CLIMAX.anchors) {
    ok(researchNet.nodes.some(n => n.id === id), `${id} is not a network vertex`);
    ok(!A.accepted!.nodes.includes(id) && !A.runnerUp!.nodes.includes(id), `${id} sits on the default route or runner-up`);
  }
});

test("Research climax keeps the hill's outlines unfolded and only ever draws the route behind the hill it crosses", () => {
  type P = { x: number; y: number };
  const edgeById = new Map(researchNet.edges.map(e => [e.id, e] as const)), nodes = R.nodeMap(researchNet);
  // Late tilts as well as full tilt: the pointer pitch fades with the tilt, so mid-climax views carry more pitch.
  const views = [0.5, 0.75, 0.9, 1].flatMap(T => R.viewpointExtremes("landscape").map(v => R.climaxView(v, T)));
  const ring = (c: P, r: number, n: number) => Array.from({ length: n }, (_, i) => ({ x: c.x + r * Math.cos((i / n) * 2 * Math.PI), y: c.y + r * Math.sin((i / n) * 2 * Math.PI) }));
  const cross = (o: P, a: P, b: P) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const folds = (p: P[]) => {
    for (let i = 0; i < p.length; i++) for (let j = i + 2; j < p.length; j++) {
      if (i === 0 && j === p.length - 1) continue;
      const a = p[i], b = p[i + 1], c = p[j], d = p[(j + 1) % p.length];
      const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
      if (d1 * d2 < 0 && d3 * d4 < 0) return true;
    }
    return false;
  };
  const hull = (pts: P[]) => {
    const s = [...pts].sort((a, b) => a.x - b.x || a.y - b.y), lo: P[] = [], up: P[] = [];
    for (const p of s) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of s.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  };
  const inside = (q: P, poly: P[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a.y > q.y) !== (b.y > q.y) && q.x < ((b.x - a.x) * (q.y - a.y)) / (b.y - a.y) + a.x) c = !c; } return c; };
  let fold = 0, ahead = 0, behind = 0;
  for (const c of step10) {
    const ev = researchRows.get(`${c.x},${c.y}`)!.ev;
    views.forEach((v) => {
      const at = (p: P) => R.project(p.x, p.y, R.height(p.x, p.y, c), v);
      const core = ring(c, R.RULE.core, 72).map(at);
      if (folds(core) || folds(ring(c, R.blockRadius(), 96).map(at))) fold++;
      // The scene's hill silhouette: hull of the core ring, the 18 / 36 / 52 contours and the peak.
      const hill = hull([...core, ...[18, 36, 52].flatMap(r => ring(c, r, 48).map(at)), at(c)]);
      for (const id of ev.accepted!.edges) for (const p of R.sampleEdge(edgeById.get(id)!, nodes, 8)) {
        if (inside(at(p), hill)) { if (p.y < c.y) behind++; else ahead++; }
      }
    });
  }
  strictEqual(fold, 0, "projected core or clearance outline folds at full tilt");
  strictEqual(ahead, 0, "an accepted-route point in front of the constraint falls inside the hill silhouette");
  ok(behind > 0, "the see-through treatment has something to do (sanity)");
  ok(R.RESEARCH_CLIMAX.relief > 0 && R.RESEARCH_CLIMAX.relief <= 1, "relief eases, never exaggerates");
});

// ---------------------------------------------------------------- Section 06 FIX2 Stage B: four studio domains (authored, never solver output)
test("Research domains are the four owner-approved studio disciplines on the four climax anchor vertices, in EN and ES", () => {
  deepStrictEqual(R.RESEARCH_DOMAINS.map(d => [d.id, d.node]), [["products", "P1"], ["research", "O3"], ["spatial", "O1"], ["worlds", "P2"]]);
  deepStrictEqual(R.RESEARCH_DOMAINS.map(d => d.node), [...R.RESEARCH_CLIMAX.anchors]);
  for (const d of R.RESEARCH_DOMAINS) ok(researchNet.nodes.some(n => n.id === d.node), `${d.node} is not a network vertex`);
  const en = homeCopy.en.researchDomains, es = homeCopy.es.researchDomains;
  deepStrictEqual(R.RESEARCH_DOMAINS.map(d => [en[d.id].name, en[d.id].note]),
    [["Product Systems", "Tools · workflows"], ["Research / Infrastructure", "Evaluation · orchestration"], ["Spatial Interfaces", "Presence · interaction"], ["Interactive Worlds", "Simulation · world logic"]]);
  deepStrictEqual(R.RESEARCH_DOMAINS.map(d => [es[d.id].name, es[d.id].note]),
    [["Sistemas de producto", "Herramientas · flujos"], ["Investigación / Infraestructura", "Evaluación · orquestación"], ["Interfaces espaciales", "Presencia · interacción"], ["Mundos interactivos", "Simulación · lógica de mundos"]]);
  deepStrictEqual(homeCopy.en.researchThesis, { lead: "One design practice. Many living systems.", body: "From product tools and controlled infrastructure to spatial interfaces and interactive worlds." });
  deepStrictEqual(homeCopy.es.researchThesis, { lead: "Una misma práctica de diseño. Múltiples sistemas vivos.", body: "De herramientas de producto e infraestructura controlada a interfaces espaciales y mundos interactivos." });
  // Truthful framing: the art description says what the structures are; no domain copy carries a figure, launch, price or status.
  ok(homeCopy.en.researchDomainsDesc.includes("not results of the route calculation") && homeCopy.es.researchDomainsDesc.includes("no resultados del cálculo de la ruta"));
  const text = JSON.stringify([en, es, homeCopy.en.researchThesis, homeCopy.es.researchThesis]);
  for (const claim of [/\d/, /launch/i, /lanza/i, /price/i, /precio/i, /\blive\b/i, /online/i, /[€$]/]) ok(!claim.test(text), `domain copy claims ${claim}`);
  for (const d of R.RESEARCH_DOMAINS) for (const line of R.domainGlyph(d.id)) for (const [u, v, w] of line.pts) {
    ok(Number.isFinite(u + v + w) && Math.hypot(u, v) <= R.DOMAIN_GLYPH.radius + 8 + 1e-9 && Math.abs(w) <= 24, `${d.id} structure leaves its plate`);
  }
});

test("Domain emphasis follows only the drawn route's vertices: the preview while previewing, else the revealed commit", () => {
  const A = researchRows.get("500,335")!.ev, B = researchRows.get("250,295")!.ev, lane = researchRows.get("345,310")!.ev;
  strictEqual(R.drawnRoute(true, lane, A, true), lane.accepted, "a preview draws the live route");
  strictEqual(R.drawnRoute(false, lane, A, true), A.accepted, "otherwise the committed route");
  strictEqual(R.drawnRoute(false, lane, A, false), null, "nothing before the reveal");
  deepStrictEqual(R.domainsOn(null), []);
  deepStrictEqual(R.domainsOn(R.drawnRoute(true, lane, A, true)), ["products", "worlds"], "preview through the outer lane");
  deepStrictEqual(R.domainsOn(R.drawnRoute(false, lane, A, true)), [], "default A passes none");
  deepStrictEqual(R.domainsOn(B.accepted), [], "state B passes none");
  deepStrictEqual(R.domainsOn(researchRows.get("560,370")!.ev.accepted), ["spatial", "worlds"]);
  deepStrictEqual(R.domainsOn(researchRows.get("200,320")!.ev.accepted), ["products", "research"]);
  // Of the 13 route signatures exactly the three through P1 / O3 / O1 / P2 light domains, and only those vertices' domains.
  const lit = new Map<string, string>();
  let on = 0;
  for (const row of researchRows.values()) { const ids = R.domainsOn(row.ev.accepted).join("+"); if (ids) { on++; lit.set(row.sig, ids); } }
  strictEqual(on, 1942, "states whose accepted route passes a domain vertex");
  deepStrictEqual([...lit].sort(), [["S·O4·I4·H·I1·O1·P2·T", "spatial+worlds"], ["S·P1·O2·P2·T", "products+worlds"], ["S·P1·O3·I3·H·I0·O0·T", "products+research"]]);
});

test("Stage B timing: nothing before the approved expansion ends, four labels resolved left to right by .86, statement by .91, calm hold", () => {
  const at = R.resolveResearchClimax;
  for (let p = 0; p <= 0.62 + 1e-9; p += 0.002) { const k = at(p); strictEqual(Math.max(...k.glyphs, ...k.labels, k.thesis), 0, `Stage B visible at climax ${p.toFixed(3)}`); }
  strictEqual(at(0.72).guides, 1, "stems complete");
  deepStrictEqual(at(0.86).labels, [1, 1, 1, 1], "all four names legible by .86");
  for (let p = 0; p <= 1; p += 0.002) { const l = at(p).labels; for (let i = 1; i < 4; i++) ok(l[i] <= l[i - 1] + 1e-12, `label ${i} ahead of ${i - 1} at ${p.toFixed(3)}`); }
  strictEqual(at(0.84).thesis, 0); strictEqual(at(0.87).thesis, 0.5); strictEqual(at(0.91).thesis, 1);
  ok(1 - R.RESEARCH_CLIMAX.thesis[2] >= 0.09 - 1e-12, "a hold of at least .09 of the climax after the statement");
});

{
  // Chrome measurements of the built stage (Windows, system sans fallback): stage size, Rail left, the side column's right
  // edge and the four label sizes. The row's top bound is the stage's: the practice statement's bottom (71.2) + 16.
  const L_EN = [[135, 41], [198, 41], [138, 41], [146, 41]], L_ES = [[173, 41], [238, 41], [169, 41], [191, 41]];
  const C_EN = [[119, 37], [174, 37], [126, 37], [134, 37]], C_ES = [[153, 37], [210, 37], [149, 37], [176, 37]];
  // `labels`: share of views where a label may cover a vertex, the route or the constraint outline (0 = never).
  // `maxFaded`: share of structures (4 per view) that may drop below half visibility: a back vertex lifted by the constraint
  // into crowded space (never at the owner viewport; shorter stages have less room above the network).
  const FIXTURES = [
    { name: "2560x1440 en", vw: 2560, cw: 2545, H: 1356, rail: 2353.5, side: 0, labels: L_EN, tiers: 1, maxLabels: 0, maxFaded: 0 },
    { name: "2137x1270 en", vw: 2137, cw: 2122, H: 1186, rail: 1930.5, side: 0, labels: L_EN, tiers: 1, maxLabels: 0, maxFaded: 0 },
    { name: "2137x1270 es", vw: 2137, cw: 2122, H: 1186, rail: 1900.1, side: 0, labels: L_ES, tiers: 1, maxLabels: 0, maxFaded: 0 },
    { name: "1920x1080 en", vw: 1920, cw: 1905, H: 996, rail: 1713.5, side: 0, labels: L_EN, tiers: 1, maxLabels: 0, maxFaded: 0.01 },
    { name: "1536x720 en", vw: 1536, cw: 1521, H: 636, rail: 1329.5, side: 424.3, labels: C_EN, tiers: 2, maxLabels: 0, maxFaded: 0.03 },
    { name: "1536x720 es", vw: 1536, cw: 1521, H: 636, rail: 1299.1, side: 424.3, labels: C_ES, tiers: 2, maxLabels: 0, maxFaded: 0.03 },
    { name: "1366x700 en", vw: 1366, cw: 1351, H: 616, rail: 1159.5, side: 0, labels: C_EN, tiers: 1, maxLabels: 0, maxFaded: 0.2 },
    // Disclosed limit: Spanish labels at <= 700 px tall cannot always step around a back vertex raised by the constraint.
    { name: "1366x700 es", vw: 1366, cw: 1351, H: 616, rail: 1129.1, side: 0, labels: C_ES, tiers: 1, maxLabels: 0.01, maxFaded: 0.2 },
  ] as const;
  const top = 71.2 + 16, nodesOf = researchNet.nodes, edgeById = new Map(researchNet.edges.map(e => [e.id, e] as const)), N = R.nodeMap(researchNet);
  const glyphPts = R.RESEARCH_DOMAINS.map(d => R.domainGlyph(d.id).flatMap(l => l.pts));
  const lit = (role: string) => (role === "anchor" ? 15 : role === "relay" ? 9 : role === "hub" ? 7.5 : 4.8);
  type Q = { x: number; y: number };
  const sweep = step10.filter(c => c.x % 20 === 0 && c.y % 20 === 0);
  test("Domain labels and structures stay clear of each other, the title row, the Rail and the functional drawing (or the structure fades)", () => {
    for (const f of FIXTURES) {
      const formula = R.artBox(f.vw, f.H, f.cw), box = R.clampArtToRail(formula, f.rail), cam = R.climaxFit(box, f.rail), side = formula.layout === "side";
      strictEqual(side, f.side > 0, `${f.name} layout`);
      const bounds = { top, x0: side ? f.side + 32 + 12 : 16, x1: f.rail - 24 }, size = R.glyphScale(cam.k);
      const P = (x: number, y: number, z: number, v: ReturnType<typeof R.climaxView>): Q => { const q = R.project(x, y, z, v); return { x: cam.ox + cam.k * q.x, y: cam.oy + cam.k * q.y }; };
      const Hn = (v: ReturnType<typeof R.climaxView>) => R.RESEARCH_CLIMAX.anchorHeight / v.relief!;
      const structure = (i: number, c: { x: number; y: number }, v: ReturnType<typeof R.climaxView>, lift: number) => {
        const n = N.get(R.RESEARCH_DOMAINS[i].node)!, z = R.height(n.x, n.y, c) + lift;
        return glyphPts[i].map(([u, w2, w]) => P(n.x + u * size, n.y + w2 * size, z + (w * size) / v.relief!, v));
      };
      const inputsAt = (c: { x: number; y: number }, v: ReturnType<typeof R.climaxView>) => R.RESEARCH_DOMAINS.map((d, i) => {
        const n = N.get(d.node)!, z = R.height(n.x, n.y, c), base = P(n.x, n.y, z, v), stemTop = P(n.x, n.y, z + Hn(v), v);
        let gTop = Infinity, gw = 0;
        for (const q of structure(i, c, v, Hn(v))) { gTop = Math.min(gTop, q.y); gw = Math.max(gw, Math.abs(q.x - stemTop.x)); }
        return { ax: stemTop.x, baseY: base.y, topY: stemTop.y, ext: Math.max(0, stemTop.y - gTop), gw, w: f.labels[i][0], h: f.labels[i][1] };
      });
      const v0 = R.climaxView({ s: 1, yaw: 0, pitch: 0, orient: "landscape" }, 1), tiers = R.chooseDomainTiers(inputsAt(R.DEFAULT_CONSTRAINT, v0), bounds);
      strictEqual(tiers, f.tiers, `${f.name} tiers`);
      let states = 0, labelHits = 0, structures = 0, suppressed = 0, visSum = 0;
      for (const c of sweep) {
        const ev = researchRows.get(`${c.x},${c.y}`)!.ev;
        const route: { x: number; y: number }[] = [], links = ev.accepted!.edges.map(id => ({ e: edgeById.get(id)!, pts: R.sampleEdge(edgeById.get(id)!, N, 8) }));
        ev.accepted!.edges.forEach((id, k) => { let pts = R.sampleEdge(edgeById.get(id)!, N, 8); if (edgeById.get(id)!.a !== ev.accepted!.nodes[k]) pts = pts.reverse(); route.push(...(k ? pts.slice(1) : pts)); });
        for (const yaw of [-1, 0, 1]) {
          const v = R.climaxView({ s: 1, yaw: yaw * R.TERRAIN.viewYaw, pitch: 0, orient: "landscape" }, 1), Z = (p: { x: number; y: number }) => P(p.x, p.y, R.height(p.x, p.y, c), v);
          const nodeQ = nodesOf.map(n => ({ q: Z(n), r: lit(n.role) })), routeQ = route.map(Z), outlines = [R.ring(c, R.RULE.core, 72).map(Z), R.ring(c, R.blockRadius(), 96).map(Z)];
          const blocked = (y0: number, y1: number) => {
            const out: [number, number][] = [];
            for (const { q, r } of nodeQ) if (q.y + r + 4 > y0 && q.y - r - 4 < y1) out.push([q.x - r - 4, q.x + r + 4]);
            for (const pts of [...outlines, routeQ]) {
              let a = Infinity, b = -Infinity, last = -2;
              pts.forEach((q, i) => { if (q.y < y0 || q.y > y1) return; if (i - last > 1 && a <= b) { out.push([a - 6, b + 6]); a = Infinity; b = -Infinity; } a = Math.min(a, q.x); b = Math.max(b, q.x); last = i; });
              if (a <= b) out.push([a - 6, b + 6]);
            }
            return out;
          };
          const placed = R.placeDomainLabels(inputsAt(c, v), bounds, tiers as 1 | 2, blocked);
          ok(placed, `${f.name}: no placement at ${c.x},${c.y}`);
          states++;
          let bad = false;
          const handle = Z(c), packed = (pts: Q[]) => pts.flatMap(q => [q.x, q.y]);
          const marks = { points: [packed(outlines[0]), packed(outlines[1])], ceiling: top - 16, labels: placed! };
          placed!.forEach((b, i) => {
            ok(b.x0 >= bounds.x0 - 1e-6 && b.x1 <= bounds.x1 + 1e-6 && b.y0 >= top - 1e-6, `${f.name}: label ${i} leaves the safe band at ${c.x},${c.y}`);
            for (let j = i + 1; j < 4; j++) { const o = placed![j]; ok(!(b.x0 < o.x1 + 11.9 && o.x0 < b.x1 + 11.9 && b.y0 < o.y1 && o.y0 < b.y1), `${f.name}: labels ${i}/${j} collide at ${c.x},${c.y}`); }
            const inside = (q: Q, m = 0) => q.x > b.x0 - m && q.x < b.x1 + m && q.y > b.y0 - m && q.y < b.y1 + m;
            if (nodeQ.some(({ q, r }) => q.x + r + 3 > b.x0 && q.x - r - 3 < b.x1 && q.y + r + 3 > b.y0 && q.y - r - 3 < b.y1) || routeQ.some(q => inside(q, 3)) || outlines.some(o => o.some(q => inside(q)))) bad = true;
            // The structure at its placed stem (its own vertex and the route's links meeting that vertex are where it stands).
            const pts = structure(i, c, v, Hn(v) * b.stem), sb = { x0: Math.min(...pts.map(q => q.x)), y0: Math.min(...pts.map(q => q.y)), x1: Math.max(...pts.map(q => q.x)), y1: Math.max(...pts.map(q => q.y)) };
            const vid = R.RESEARCH_DOMAINS[i].node, own = nodesOf.findIndex(n => n.id === vid);
            const away = links.filter(l => l.e.a !== vid && l.e.b !== vid).flatMap(l => l.pts.map(Z));
            const discs = [...nodeQ.filter((_, k) => k !== own).map(({ q, r }) => [q.x, q.y, r] as const), [handle.x, handle.y, 16] as const];
            const vis = R.structureVisibility(R.structureClearance(sb, { ...marks, points: [...marks.points, packed(away)], discs }));
            if (vis > 0) {
              // Independent geometry: a structure that is drawn at all has no outline or route point in its box, touches no
              // other vertex and not the handle, stays under the title row and overlaps no label by more than the row gap.
              const inBox = (q: Q) => q.x >= sb.x0 && q.x <= sb.x1 && q.y >= sb.y0 && q.y <= sb.y1;
              ok(![...outlines[0], ...outlines[1], ...away].some(inBox), `${f.name}: structure ${i} drawn over the constraint outline or the route at ${c.x},${c.y}`);
              ok(discs.every(([x, y, r]) => Math.hypot(Math.max(sb.x0 - x, 0, x - sb.x1), Math.max(sb.y0 - y, 0, y - sb.y1)) > r), `${f.name}: structure ${i} drawn over a vertex or the handle at ${c.x},${c.y}`);
              ok(sb.y0 > top - 16, `${f.name}: structure ${i} rises into the title row at ${c.x},${c.y}`);
              for (const o of placed!) { const xo = Math.min(sb.x1, o.x1) - Math.max(sb.x0, o.x0), yo = Math.min(sb.y1, o.y1) - Math.max(sb.y0, o.y0); ok(xo <= 0 || yo <= 0 || Math.min(xo, yo) < 10, `${f.name}: structure ${i} drawn over a label at ${c.x},${c.y}`); }
            }
            structures++; visSum += vis;
            if (vis < 0.5) suppressed++;
          });
          if (bad) labelHits++;
        }
      }
      if (process.env.HOME_VALIDATE_TIMING) console.log(`   ${f.name}: label hits ${labelHits} of ${states} views; structures below half visibility ${suppressed} of ${structures}, mean visibility ${(visSum / structures).toFixed(4)}`);
      ok(labelHits / states <= f.maxLabels, `${f.name}: a label covers a vertex, the route or the constraint outline in ${labelHits} of ${states} views`);
      ok(suppressed / structures <= f.maxFaded, `${f.name}: ${suppressed} of ${structures} structures drop below half visibility (bound ${f.maxFaded})`);
    }
  });
}

test("In the climax, runner-up and preview points drawn in front of the hill never fall inside the blocked core's outline", () => {
  type P = { x: number; y: number };
  const edgeById = new Map(researchNet.edges.map(e => [e.id, e] as const)), nodes = R.nodeMap(researchNet);
  const cross = (o: P, a: P, b: P) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const hullOf = (pts: P[]) => {
    const s = [...pts].sort((a, b) => a.x - b.x || a.y - b.y), lo: P[] = [], up: P[] = [];
    for (const p of s) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of s.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1)).flatMap(p => [p.x, p.y]);
  };
  let front = 0, behind = 0;
  for (const c of step10) {
    const ev = researchRows.get(`${c.x},${c.y}`)!.ev, routes = [ev.accepted!, ...(ev.runnerUp && ev.routeClass !== "direct" ? [ev.runnerUp] : [])];
    for (const T of [0.25, 0.5, 0.75, 1]) for (const yaw of [-1, 0, 1]) {
      const v = R.climaxView({ s: 1, yaw: yaw * R.TERRAIN.viewYaw, pitch: 0, orient: "landscape" }, T), at = (p: P) => R.project(p.x, p.y, R.height(p.x, p.y, c), v);
      const core = R.ring(c, R.RULE.core, 72).map(at), hill = hullOf([...core, ...[18, 36, 52].flatMap(r => R.ring(c, r, 48).map(at)), at(c)]), coreXs = core.flatMap(p => [p.x, p.y]);
      for (const r of routes) for (const id of r.edges) for (const p of R.sampleEdge(edgeById.get(id)!, nodes, 8)) {
        const q = at(p);
        if (p.y < c.y && R.insidePolygon(q.x, q.y, hill)) { behind++; continue; }
        if (R.insidePolygon(q.x, q.y, coreXs)) front++;
      }
    }
  }
  strictEqual(front, 0, "a route point drawn in front of the hill crosses the blocked core");
  ok(behind > 0, "the see-through split has something to do (sanity)");
});

test("Section 06 copy exists in EN and ES with matching shapes and no unsupported claims", () => {
  const shape = (value: unknown): unknown => typeof value === "string" ? "s" : Array.isArray(value) ? value.map(shape) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)])) : typeof value;
  const keys = Object.keys(homeCopy.en).filter(k => k.startsWith("research") && k !== "research");
  ok(keys.length >= 30, "Section 06 keys present");
  for (const key of keys) {
    ok(key in homeCopy.es, `${key} missing in ES`);
    deepStrictEqual(shape(homeCopy.es[key as keyof typeof homeCopy.es]), shape(homeCopy.en[key as keyof typeof homeCopy.en]), `${key} differs in shape`);
  }
  for (const retired of ["researchBody", "researchTerms", "worldsNote"]) ok(!(retired in homeCopy.en) && !(retired in homeCopy.es), `${retired} is retired`);
  strictEqual(homeCopy.en.researchTitle, "What makes\nthe system work."); strictEqual(homeCopy.es.researchTitle, "Lo que sostiene\nal sistema.");
  const text = JSON.stringify(keys.map(k => [homeCopy.en[k as keyof typeof homeCopy.en], homeCopy.es[k as keyof typeof homeCopy.es]]));
  for (const claim of [/\bAI\b/, /\bIA\b/, /agent/i, /backend/i, /benchmark/i, /success rate/i, /\bgame\b/i, /\bjuego\b/i, /machine learning/i, /neural/i]) ok(!claim.test(text), `Section 06 copy claims ${claim}`);
  for (const retired of ["researchIdle", "researchPreview", "researchReadout", "researchReadoutNone", "researchReadoutDirect"]) ok(!(retired in homeCopy.en) && !(retired in homeCopy.es), `${retired} is retired (FIX3)`);
  for (const locale of ["en", "es"] as const) {
    const c = homeCopy[locale];
    for (const slot of ["{cls}", "{links}", "{a}"]) ok(c.researchConsequence.route.includes(slot), `${locale} consequence lacks ${slot}`);
    ok(c.researchConsequence.none.includes("{links}"), `${locale} no-route consequence lacks {links}`);
    for (const t of [c.researchLinks.one, c.researchLinks.other]) ok(t.includes("{n}"), `${locale} link count lacks {n}`);
    for (const slot of ["{family}", "{side}", "{b}"]) ok(c.researchAlternative.route.includes(slot), `${locale} alternative lacks ${slot}`);
    for (const slot of ["{family}", "{side}"]) ok(c.researchAlternative.none.includes(slot), `${locale} no-alternative lacks ${slot}`);
  }
});

test("Section 06 mission (FIX3): the protected zone, its two axes and the solver's decision are stated in EN and ES", () => {
  deepStrictEqual(homeCopy.en.researchMission.title, "Keep the connection open."); deepStrictEqual(homeCopy.es.researchMission.title, "Mantén abierta la conexión.");
  ok(homeCopy.en.researchMission.body.includes("protected zone") && homeCopy.es.researchMission.body.includes("zona protegida"));
  deepStrictEqual(homeCopy.en.researchZone, { along: "Zone position", across: "Zone offset" });
  deepStrictEqual(homeCopy.es.researchZone, { along: "Posición de la zona", across: "Desplazamiento" });
  ok(homeCopy.en.researchDrag.includes("protected zone") && homeCopy.es.researchDrag.includes("zona protegida"), "the drag hint names the zone");
  // The pack's two test states, from the real solver: different side, family, cost and number of excluded links.
  const A = researchRows.get("500,335")!.ev, B = researchRows.get("250,295")!.ev;
  deepStrictEqual([A.routeClass, R.routeFamily(A), A.blockedEdges.length, Math.round(A.accepted!.cost * 1000) / 1000], ["above", "wrap", 15, 1086.867]);
  deepStrictEqual([B.routeClass, R.routeFamily(B), B.blockedEdges.length, Math.round(B.accepted!.cost * 1000) / 1000], ["below", "rejoin-origin", 4, 1083.937]);
  deepStrictEqual(R.DEFAULT_CONSTRAINT, { x: 500, y: 335 }, "the default zone is state A");
  // Every supported state excludes at least one link (so "{n} links excluded" is never empty).
  ok([...researchRows.values()].every(r => r.ev.blockedEdges.length >= 2), "a state excludes fewer than 2 links");
});

// ---------------------------------------------------------------- Section 07 Final Exposure / Spatial Horizon (HOME-COMPLETION-01E, 01E-FIX1)
const F = await import("../src/ui/home/homeCollaborationModel.ts");
test("Section 07 carries the locked Final Exposure copy in EN and ES", () => {
  const en = homeCopy.en, es = homeCopy.es;
  deepStrictEqual([en.closing, en.closingTitle, en.closingBody, en.start, en.offer], ["Commercial / Collaboration", "Bring the ambition.\nLet's give it form.",
    "A product, an interactive system, an immersive experience. We shape the path together.", "Start a conversation", "Explore ways to work together"]);
  deepStrictEqual([es.closing, es.closingTitle, es.closingBody, es.start, es.offer], ["Servicios / Colaboración", "Trae la ambición.\nDémosle forma.",
    "Un producto, un sistema interactivo, una experiencia inmersiva. Damos forma al camino juntos.", "Iniciar una conversación", "Explorar cómo colaborar"]);
  for (const c of [en, es]) strictEqual(c.closingTitle.split("\n").length, 2, "two authored title lines");
});

test("Section 07 choreography: arrive, resolve, hold, emerge (two moves), settle; final from landing", () => {
  deepStrictEqual(F.CLOSING_MOTION, { header: 84, lead: 0.08, maxTarget: 0.86, emerge: { margin: 0.1, shift: 0.08, ramp: 0.3, lead1: 0.45 }, row: { shift: 28, opacity: 0.25 } });
  deepStrictEqual(F.CLOSING_FLOOR, { rays: 6, spread: 1.25, depths: [1.6, 2.5, 3.9, 6.1, 9.5], capRatio: 1.7, capVh: 0.2 });
  ok(F.CLOSING_MOTION.emerge.margin >= F.CLOSING_MOTION.emerge.shift, "a rising line never reaches the horizon (margin ≥ shift)");
  // live layouts measured on the built page (2560×1270, 1536×720; section-local px, Inter metrics), and the same compact
  // layout with the tighter title-to-horizon gap of the system fallback font (glyph box overhang ≈ .17em instead of ≈ .12em)
  const layouts = [
    { viewportHeight: 1270, labelBottom: 129, lines: [{ bottom: 399.5 }, { bottom: 584.5 }], font: 188.825, horizon: 668.3, band: 266.7, rowTop: 973.1 },
    { viewportHeight: 720, labelBottom: 72.6, lines: [{ bottom: 223.6 }, { bottom: 327 }], font: 105.501, horizon: 374.4, band: 91.2, rowTop: 487.2 },
    { viewportHeight: 720, labelBottom: 72.6, lines: [{ bottom: 223.6 }, { bottom: 333 }], font: 105.501, horizon: 368.4, band: 91.2, rowTop: 481.2 },
  ];
  for (const L of layouts) {
    const P = F.closingPlan(L)!, fin = F.closingFinal(L);
    ok(P !== null, "the choreography fits");
    deepStrictEqual(fin, { h: L.horizon, pitch: 0, band: L.band, lines: [1, 1], row: 1 });
    ok(P.emergeAt.every((at, i) => i === 0 || at >= L.lines[i].bottom + F.CLOSING_MOTION.emerge.margin * L.font - 1e-9), "each later line starts a full margin under its glyph box");
    ok(P.target <= F.CLOSING_MOTION.maxTarget * L.viewportHeight + 1e-9 && P.landing >= F.CLOSING_MOTION.header, "settles before the header line, holds inside the viewport");
    ok(P.h0 >= L.lines[0].bottom + F.CLOSING_MOTION.emerge.margin * L.font - 1e-9 && P.h0 < L.lines[1].bottom, "the horizon arrives just under the first line");
    ok(P.emergeAt[1] > P.emergeAt[0] + P.emergeRamp[0] - 1e-9 && P.emergeAt[1] + P.emergeRamp[1] <= L.horizon + 1e-9, "line 1 is in before line 2 starts; line 2 is in before landing");
    const start = F.closingState(P, L.viewportHeight + 50);
    deepStrictEqual([start.h, start.pitch, start.lines, start.row], [P.h0, 1, [0, 0], 0], "arriving state below the viewport");
    let prev = start;
    for (let s = L.viewportHeight + 50; s >= -400; s -= 1) {
      const st = F.closingState(P, s);
      ok(st.h >= prev.h - 1e-9 && st.pitch <= prev.pitch + 1e-9 && st.row >= prev.row - 1e-9 && st.lines.every((v, i) => v >= prev.lines[i] - 1e-9), `not monotone at sectionTop ${s}`);
      if (st.lines[0] > 0) strictEqual(st.pitch, 0, "the horizon is flat before the first line emerges");
      if (st.h > P.h0) strictEqual(st.pitch, 0, "flat while it holds");
      st.lines.forEach((v, i) => { if (v > 0) ok(L.lines[i].bottom + (1 - v) * P.shift < st.h, `line ${i} meets the horizon at sectionTop ${s}`); });
      ok(st.h + st.band <= L.horizon + L.band + 1e-9 && L.horizon + L.band <= L.rowTop, "the floor never reaches the row");
      if (s <= P.landing) deepStrictEqual(st, fin, `not final at sectionTop ${s}`);
      prev = st;
    }
    ok(F.closingState(P, P.landing + 40).lines[1] < 1 || F.closingState(P, P.landing + 40).row < 1 || F.closingState(P, P.landing + 40).h < L.horizon, "something is still moving just before landing");
  }
  // too tall for the viewport, or no room between line 1 and the slot: no choreography, the final state is rendered
  strictEqual(F.closingPlan({ ...layouts[1], viewportHeight: 600, horizon: 600, rowTop: 700 }), null);
  strictEqual(F.closingPlan({ ...layouts[1], horizon: layouts[1].lines[0].bottom + 0.2 * layouts[1].font }), null);
});

test("Section 07 crest is derived from the default Section 06 terrain; horizon and floor stay in bounds", () => {
  const H = F.CLOSING_HORIZON;
  deepStrictEqual(H, { crestShare: 0.3, vanishing: 0.5, shares: [0.4, 0.2, 0.4], startAnglesDeg: [8, 0, -8] });
  // Re-derive: the default hill's rise above its flat footprint per screen column in 06's final camera, fitted with a
  // symmetric flank / crest / flank polyline (each segment ≥ 1/5 of the span) by least squares.
  const c = R.DEFAULT_CONSTRAINT, view = R.climaxView({ s: 1, yaw: 0, pitch: 0, orient: "landscape" as const }, 1), cols = new Map<number, number>();
  let x0 = Infinity, x1 = -Infinity;
  for (let x = c.x - 200; x <= c.x + 200; x += 1) for (let y = c.y - 200; y <= c.y + 200; y += 1) {
    if (Math.hypot(x - c.x, y - c.y) > 200) continue;
    const p = R.project(x, y, R.height(x, y, c), view), g = R.project(x, y, 0, view), k = Math.round(p.x);
    x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); cols.set(k, Math.max(cols.get(k) ?? -Infinity, g.y - p.y));
  }
  const N = 181, lo = Math.ceil(x0) + 4, hi = Math.floor(x1) - 4, X: number[] = [], Y: number[] = [];   // the provenance script's exact sampling
  for (let i = 0; i < N; i++) {
    const at = lo + ((hi - lo) * i) / (N - 1), v = [-1, 0, 1].map((d) => cols.get(Math.round(at) + d)).filter((n): n is number => n !== undefined);
    X.push(at); Y.push(-v.reduce((s, n) => s + n, 0) / v.length);
  }
  const fitRms = (a: number, b: number) => {   // continuous 3-segment least squares on knots [0, a, b, N−1]
    const K = [0, a, b, N - 1], A = [0, 1, 2, 3].map(() => [0, 0, 0, 0]), r = [0, 0, 0, 0];
    for (let s = 0; s < 3; s++) for (let i = s ? K[s] + 1 : K[s]; i <= K[s + 1]; i++) {
      const t = (X[i] - X[K[s]]) / (X[K[s + 1]] - X[K[s]]), w = [0, 0, 0, 0]; w[s] = 1 - t; w[s + 1] = t;
      for (let j = 0; j < 4; j++) { r[j] += w[j] * Y[i]; for (let k = 0; k < 4; k++) A[j][k] += w[j] * w[k]; }
    }
    for (let col = 0; col < 4; col++) for (let row = 0; row < 4; row++) if (row !== col) { const f = A[row][col] / A[col][col]; for (let k = 0; k < 4; k++) A[row][k] -= f * A[col][k]; r[row] -= f * r[col]; }
    const knotsY = r.map((v, j) => v / A[j][j]);
    return { K, knotsY };
  };
  const peak = Y.reduce((m, v, i) => (v < Y[m] ? i : m), 0), MIN = Math.ceil(0.2 * (N - 1));
  ok(Math.abs(peak - (N - 1) / 2) <= 2, "the hill outline peaks at its centre");
  let best: { K: number[]; knotsY: number[]; rms: number } | null = null;
  for (let k = Math.ceil(MIN / 2); peak - k >= MIN && peak + k <= N - 1 - MIN; k++) {
    const f = fitRms(peak - k, peak + k);
    let e = 0;
    for (let s = 0; s < 3; s++) for (let i = f.K[s]; i <= f.K[s + 1]; i++) { const t = (X[i] - X[f.K[s]]) / (X[f.K[s + 1]] - X[f.K[s]]); e += (Y[i] - (f.knotsY[s] * (1 - t) + f.knotsY[s + 1] * t)) ** 2; }
    if (!best || e < best.rms) best = { ...f, rms: e };
  }
  const span = X[N - 1] - X[0], shares = [0, 1, 2].map((s) => (X[best!.K[s + 1]] - X[best!.K[s]]) / span);
  const angles = [0, 1, 2].map((s) => (Math.atan2(-(best!.knotsY[s + 1] - best!.knotsY[s]), X[best!.K[s + 1]] - X[best!.K[s]]) * 180) / Math.PI);
  shares.forEach((v, i) => ok(Math.abs(v - H.shares[i]) < 0.011, `share ${i}: ${v.toFixed(3)} vs ${H.shares[i]}`));
  ok(angles[0] > 10 && Math.abs(angles[1]) < 0.5 && angles[2] < -10 && Math.abs(angles[0] + angles[2]) < 0.5, `flank / crest / flank: ${angles.map((a) => a.toFixed(2))}`);
  // The raw fitted flank (01E preflight/horizon-provenance.json: 18.6°) — pinned so the derivation cannot drift unnoticed.
  ok(Math.abs(angles[0] - 18.6) < 0.05, `raw flank ${angles[0].toFixed(2)}° (provenance 18.6°)`);
  const scaled = angles.map((a) => (a * 8) / Math.max(...angles.map(Math.abs)));
  scaled.forEach((v, i) => ok(Math.abs(v - H.startAnglesDeg[i]) < 0.1, `start angle ${i}: ${v.toFixed(2)}°`));
  // Geometry: one rule across the width with the crest centred on the vanishing point; ≤ 8°; flat at tilt 0; floor in bounds.
  for (const w of [2275, 1271, 701, 350]) {
    const p1 = F.horizonPoints(w, 40, 1), p0 = F.horizonPoints(w, 40, 0);
    strictEqual(p1.length, 6); deepStrictEqual([p1[0], p1[5]], [[0, 40], [w, 40]], "spans the width on the rule");
    ok(Math.abs(p1[4][1] - 40) < 1e-9 && Math.abs((p1[1][0] + p1[4][0]) / 2 - H.vanishing * w) < 1e-9, "crest returns to the rule, centred");
    for (let s = 1; s < 4; s++) { const a = Math.abs(Math.atan2(p1[s + 1][1] - p1[s][1], p1[s + 1][0] - p1[s][0]) * 180 / Math.PI); ok(a <= 8 + 1e-9, `segment ${s} steeper than 8°`); }
    ok(p0.every(([, y]) => y === 40), "flat at tilt 0");
    ok(F.crestRise(w) >= Math.tan((8 * Math.PI) / 180) * 0.4 * H.crestShare * w - 1e-9, "the box holds the crest");
    const segs = F.floorSegments(w, 40, 160);
    strictEqual(segs.length, 2 * F.CLOSING_FLOOR.rays + 1 + F.CLOSING_FLOOR.depths.length);
    ok(segs.every(([a, b, c2, d]) => [a, c2].every((x) => x >= -1e-9 && x <= w + 1e-9) && [b, d].every((y) => y >= 40 - 1e-9 && y <= 200 + 1e-9)), "floor inside the field, below the rule, within the band");
    deepStrictEqual(F.floorSegments(w, 40, 0), [], "no band, no floor");
  }
});

test("Section 07 is unpinned, reuses the existing drawer and localized Offer, and keeps the horizon decorative", () => {
  const tsx = readFileSync(new URL("../src/ui/home/EcosystemCollaboration.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/ui/home/ecosystemCollaborationStage.css", import.meta.url), "utf8");
  const index = readFileSync(new URL("../src/pages/StudioIndex.tsx", import.meta.url), "utf8");
  ok(tsx.includes("onClick={onOpenProject}") && tsx.includes('aria-haspopup="dialog"'), "primary CTA opens the existing project drawer");
  ok(tsx.includes('getLocalizedPath("/offer", locale)') && tsx.includes("<HomeLink"), "secondary action is the localized Offer via HomeLink");
  ok(tsx.includes('id="collaboration"') || tsx.includes('<HomeSection id="collaboration"'), "#collaboration identity kept");
  ok(tsx.includes('id="collaboration-title"'), "section labelled by its title");
  ok(!/setInterval|setTimeout/.test(tsx), "no timers");
  ok(/className="eco-fx-track" aria-hidden="true"/.test(tsx) && /className="eco-fx-horizon" aria-hidden="true"/.test(tsx) && /eco-fx-track \{[^}]*pointer-events:\s*none/.test(css), "horizon is decorative and never a target");
  ok(!/@keyframes|animation\s*:|infinite/.test(css), "no keyframe loop");
  const sticky = css.match(/[^{}]*\{[^}]*position:\s*sticky[^}]*\}/g) ?? [];
  ok(sticky.length === 1 && sticky[0].trim().startsWith(".ecosystem-home .eco-fx-horizon-art {"), "the section is not pinned: only the decorative horizon drawing is sticky");
  ok(/eco-fx-stage \{[^}]*--fx-type: clamp\(56px, min\(8\.3cqw, 19svh\), 280px\)/.test(css) && /eco-fx-inner \{[^}]*container-type: inline-size/.test(css), "title scales with the safe field");
  ok(/eco-fx-title > span \+ span \{ margin-left: 2\.6em; \}/.test(css), "second line offset towards the centre");
  ok(/eco-fx-row \{[^}]*width: 0; min-width: 100%/.test(css), "action column ends at the title's right edge");
  ok(tsx.includes('.home-section-rail') && tsx.includes("rail.offsetLeft") && tsx.includes("railLeft - 24"), "the horizon stops short of the rendered Rail");
  ok(index.includes('import EcosystemCollaboration from "../ui/home/EcosystemCollaboration"') && index.includes("<EcosystemCollaboration ") && !index.includes("EcosystemSignals"), "StudioIndex renders the new closing");
  ok(!existsSync(new URL("../src/ui/home/EcosystemSignals.tsx", import.meta.url)) && !existsSync(new URL("../src/ui/home/ecosystemSignalsStage.css", import.meta.url)), "old closing removed");
});
console.log(`HOME_SELECTOR_SELF_TEST=${process.argv.includes("--self-test") ? (failures.length ? "FAIL" : "PASS") : "included"}`);
console.log(`HOME_SELECTOR_TEST_CASES=${caseCount}`);
console.log(`HOME_SELECTOR_TEST_FAILURES=${failures.length}`);
for (const failure of failures) console.error(`✗ ${failure}`);
console.log(`ECOSYSTEM_HOME_VALIDATE=${failures.length ? "FAIL" : "PASS"}`);
if (failures.length) process.exitCode = 1;
