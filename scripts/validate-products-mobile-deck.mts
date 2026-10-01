import { deepStrictEqual, strictEqual, ok } from "node:assert/strict";
import { existsSync } from "node:fs";
import type { ProjectRecord } from "../src/data/projectRegistry.types.ts";

ok(existsSync(new URL("../src/ui/home/productsMobileDeckModel.ts", import.meta.url)), "Pure mobile deck model must exist");
const model = await import("../src/ui/home/productsMobileDeckModel.ts");

// Synthetic only: these records never enter Home membership, routes or media.
function fixture(id: string): ProjectRecord {
  return {
    id, publicName: `Fixture ${id}`, aliases: [], vertical: "product", origin: "studio-product",
    maturity: "prototype", deployment: "none", commercialAvailability: "not-offered", visibility: "public-listed",
    copy: { oneLiner: { en: `Canonical ${id}`, es: `Canónico ${id}` } },
    limitations: [], evidence: [], links: [], routes: [], media: [],
    review: { lastReviewed: "2026-10-01", owner: "studio-owner" },
  };
}
type Model = typeof model;
function validate(subject: Model) {
  let checks = 0;
  const failures: string[] = [];
  function test(name: string, run: () => void) {
    checks++;
    try { run(); } catch (error) { failures.push(`${name}: ${String(error)}`); }
  }
  // Hand-authored table: columns are resting / left swipe / right swipe.
  const ghosts = [[1, 1, null], [2, 2, 0], [3, 3, 1], [2, null, 2]];
  for (let i = 0; i < 4; i++) {
    for (const [column, direction] of ([0, 1, -1] as const).entries()) {
      test(`N4 ghost ${i}/${direction}`, () => strictEqual(subject.adjacentGhostIndex(i, 4, direction), ghosts[i][column]));
    }
  }
  for (const [offset, want] of [[-90, 1], [-9, 1], [-8, 0], [0, 0], [8, 0], [9, -1], [90, -1]] as const) {
    test(`drag direction ${offset}`, () => strictEqual(subject.ghostDirectionFromOffset(offset), want));
  }
  for (const length of [0, 1, 2, 3, 4]) {
    test(`N${length} safe selection and traversal`, () => {
      let active = subject.selectMobileProduct(0, 0, length);
      strictEqual(active, length ? 0 : null);
      for (let i = 0; i < length; i++) {
        active = subject.selectMobileProduct(active ?? 0, i, length);
        strictEqual(active, i);
        strictEqual(subject.selectMobileProduct(i, -1, length), i);
        strictEqual(subject.selectMobileProduct(i, length, length), i);
        strictEqual(subject.selectMobileProduct(i, NaN, length), i);
        strictEqual(subject.selectMobileProduct(i, 0.5, length), i);
        strictEqual(subject.mobileProductKeyTarget("Home", i, length), 0);
        strictEqual(subject.mobileProductKeyTarget("End", i, length), length - 1);
        strictEqual(subject.mobileProductKeyTarget("ArrowLeft", i, length), Math.max(0, i - 1));
        strictEqual(subject.mobileProductKeyTarget("ArrowRight", i, length), Math.min(length - 1, i + 1));
      }
    });
  }
  test("empty and single ghost never exists", () => {
    for (const direction of [-1, 0, 1] as const) {
      strictEqual(subject.adjacentGhostIndex(0, 0, direction), null);
      strictEqual(subject.adjacentGhostIndex(0, 1, direction), null);
    }
    strictEqual(subject.mobileProductKeyTarget("End", 0, 0), null);
  });
  test("invalid ghost input cannot produce phantom adjacent plane", () => {
    for (const index of [-1, 4, NaN, 1.5]) strictEqual(subject.adjacentGhostIndex(index, 4, 0), null);
  });
  test("shrinking list repairs stale selection", () => strictEqual(subject.selectMobileProduct(3, 3, 1), 0));
  test("unhandled key stays unhandled", () => strictEqual(subject.mobileProductKeyTarget("Tab", 0, 4), undefined));
  for (const [id, preset] of [["weekfield", "weekfield"], ["print-border-studio", "print-border"], ["A", "generic"]] as const) {
    test(`explicit preset ${id}`, () => strictEqual(subject.resolveMobileProductPreset(fixture(id)), preset));
  }
  for (const [n, want] of [[1, "01"], [2, "02"], [9, "09"], [10, "10"], [17, "17"]] as const) {
    test(`ordinal ${n}`, () => strictEqual(subject.formatMobileProductOrdinal(n), want));
  }
  test("generic copy uses only canonical localized one-liner and has no invented terms", () => {
    const project = fixture("A");
    const en = subject.mobileProductPresentation(project, "en");
    const es = subject.mobileProductPresentation(project, "es");
    deepStrictEqual(en.descriptor, ["Canonical A"]);
    deepStrictEqual(es.descriptor, ["Canónico A"]);
    deepStrictEqual(en.terms, []);
    strictEqual(en.theme, "neutral");
    project.copy.oneLiner.es = undefined;
    deepStrictEqual(subject.mobileProductPresentation(project, "es").descriptor, ["Canonical A"]);
  });
  test("known presets retain approved descriptors and terms in both locales", () => {
    for (const [id, locale, descriptor, terms, theme] of [
      ["weekfield", "en", ["Creator intelligence", "& planning system"], ["Creator content intelligence", "Week Packs", "Human-controlled AI"], "graphite"],
      ["weekfield", "es", ["Inteligencia creativa", "y planificación"], ["Inteligencia de contenido", "Week Packs", "IA bajo control humano"], "graphite"],
      ["print-border-studio", "en", ["Print preparation", "& collector presentation"], ["Print borders", "Export logic", "Artwork inspection"], "material"],
      ["print-border-studio", "es", ["Preparación de impresión", "y presentación para coleccionistas"], ["Bordes de impresión", "Lógica de exportación", "Inspección de obra"], "material"],
    ] as const) {
      const result = subject.mobileProductPresentation(fixture(id), locale);
      deepStrictEqual(result.descriptor, descriptor); deepStrictEqual(result.terms, terms); strictEqual(result.theme, theme);
    }
  });
  test("case eligibility never fabricates a route or another locale", () => {
    const project = fixture("A");
    strictEqual(subject.mobileProductCaseRoute(project, "en"), undefined);
    project.routes = [{ surface: "trust", path: "/trust/fixture", locales: ["en"] }];
    strictEqual(subject.mobileProductCaseRoute(project, "en"), undefined);
    project.routes = [{ surface: "product", path: "/fixture-product", locales: ["en"] }];
    strictEqual(subject.mobileProductCaseRoute(project, "en")?.path, "/fixture-product");
    strictEqual(subject.mobileProductCaseRoute(project, "es"), undefined);
    project.routes.push({ surface: "work", path: "/work/fixture", locales: ["en"] });
    strictEqual(subject.mobileProductCaseRoute(project, "en")?.path, "/work/fixture");
  });
  const proof: object[] = [];
  test("A B C D forward and reverse use actual adjacent products", () => {
    const fixtureIds = ["A", "B", "C", "D"];
    let active = 0;
    for (const [direction, targets] of [[1, [1, 2, 3]], [-1, [2, 1, 0]]] as const) {
      for (const target of targets) {
        const ghost = subject.adjacentGhostIndex(active, 4, direction);
        strictEqual(ghost, target);
        const next = subject.selectMobileProduct(active, active + direction, 4);
        strictEqual(next, target);
        proof.push({ from: fixtureIds[active], to: fixtureIds[target], activeIndex: active, ghostIndex: ghost, direction: direction === 1 ? "LEFT" : "RIGHT", boundaryBefore: { previousDisabled: active === 0, nextDisabled: active === 3 }, activeIndexAfter: next, boundaryAfter: { previousDisabled: next === 0, nextDisabled: next === 3 } });
        active = next!;
      }
    }
  });
  return { checks, failures, proof };
}

const result = validate(model);
console.log(JSON.stringify(result, null, 2));
if (result.failures.length) process.exit(1);
console.log(`MODEL_VALIDATOR=PASS (${result.checks} checks)`);
if (process.argv.includes("--self-test")) {
  const mutations: [string, Partial<Model>][] = [
    ["two-product toggle", { adjacentGhostIndex: (i) => i === 0 ? 1 : 0 }],
    ["fixed next ghost", { adjacentGhostIndex: (i, n) => i + 1 < n ? i + 1 : null }],
    ["unknown becomes Weekfield", { resolveMobileProductPreset: () => "weekfield" }],
    ["unbounded selection", { selectMobileProduct: (_i, target) => target }],
    ["bad ordinal prefix", { formatMobileProductOrdinal: (n) => `0${n}` }],
  ];
  for (const [name, mutation] of mutations) ok(validate({ ...model, ...mutation }).failures.length > 0, `Validator must reject: ${name}`);
  console.log(`MODEL_SELF_TEST=PASS (${mutations.length} deliberate regressions rejected)`);
}
