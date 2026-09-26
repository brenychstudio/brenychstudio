import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

// Route bundle regression guard. Runs an in-memory production build of the repository config
// (nothing is written to dist) and checks each route's initial JS closure from actual chunk
// module membership and static imports; hashed file names are never assumed.
//
//   npm run perf:routes
//   node scripts/validate-route-bundles.mjs --self-test

// 260 KiB Brotli per non-WebGL route; before route splitting every route loaded 520,648 B.
const ROUTE_BROTLI_BUDGET = 266240;
const PRE_SPLIT_BROTLI = 520648;

const FAMILIES = {
  three: /\/node_modules\/three\//,
  r3f: /\/node_modules\/@react-three\/fiber\//,
  drei: /\/node_modules\/@react-three\/drei\//,
  tone: /\/node_modules\/(?:tone|standardized-audio-context)\//,
};

const PAGES = [
  "StudioIndex",
  "EvidenceAtlas",
  "CasePageV2",
  "ImmersiveV2",
  "ImmersiveCasePage",
  "OfferV2",
  "AboutV2",
  "ServicePage",
  "PrivacyV2",
  "LegalV2",
  "SpatialProof",
  "LivingAtlasPage",
  "LivingAtlasPrivacy",
  "LivingAtlasSupport",
];

// Routes that render no WebGL: their initial closure must stay free of the 3D stack and Tone.
const NON_WEBGL_ROUTES = {
  WORK: "EvidenceAtlas",
  CASE: "CasePageV2",
  IMMERSIVE: "ImmersiveV2",
  IMMERSIVE_CASE: "ImmersiveCasePage",
  ABOUT: "AboutV2",
  SERVICE: "ServicePage",
  PRIVACY: "PrivacyV2",
  LEGAL: "LegalV2",
  LIVING_ATLAS: "LivingAtlasPage",
  LIVING_ATLAS_PRIVACY: "LivingAtlasPrivacy",
  LIVING_ATLAS_SUPPORT: "LivingAtlasSupport",
};

// ---- Source contracts -------------------------------------------------------------------------

export function checkSources({ app, routeModules, audioEngine }) {
  const failures = [];

  for (const page of PAGES) {
    if (new RegExp(`^import\\s+(?!type\\b)[^;]*from\\s+["']\\./pages/${page}["']`, "m").test(app)) {
      failures.push(`src/App.tsx statically imports ./pages/${page}; route pages must load through routeModules`);
    }
    if (!new RegExp(`import\\(\\s*["']\\.\\./pages/${page}["']\\s*\\)`).test(routeModules)) {
      failures.push(`src/routing/routeModules.ts has no dynamic import of ../pages/${page}`);
    }
  }
  if (/import\(\s*["']\.\/pages\//.test(app)) {
    failures.push("src/App.tsx imports a page directly; page modules load only through routeModules");
  }

  if (!/import\(\s*["']tone["']\s*\)/.test(audioEngine)) failures.push('src/stage/audio/audioEngine.ts no longer uses import("tone")');
  if (/from\s+["']tone["']/.test(audioEngine)) failures.push("src/stage/audio/audioEngine.ts statically imports tone");

  return failures;
}

// ---- Chunk graph -----------------------------------------------------------------------------

// chunks: [{ fileName, isEntry, isDynamicEntry, imports, modules, brotli }]
export function checkGraph(chunks) {
  const failures = [];
  const byFile = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
  const entries = chunks.filter((chunk) => chunk.isEntry);
  if (entries.length !== 1) return { failures: [`expected one entry chunk, found ${entries.length}`], reports: {} };

  const staticClosure = (fileName) => {
    const seen = new Set();
    const queue = [fileName];
    while (queue.length) {
      const next = queue.pop();
      if (seen.has(next)) continue;
      seen.add(next);
      for (const imported of byFile.get(next)?.imports ?? []) queue.push(imported);
    }
    return seen;
  };

  const describe = (closure) => {
    const found = Object.fromEntries(Object.keys(FAMILIES).map((family) => [family, []]));
    let brotli = 0;
    for (const fileName of closure) {
      const chunk = byFile.get(fileName);
      brotli += chunk.brotli;
      for (const [family, pattern] of Object.entries(FAMILIES)) {
        for (const id of chunk.modules) if (pattern.test(id)) found[family].push({ chunk: fileName, id });
      }
    }
    return { brotli, found };
  };

  const offenders = (report, family) =>
    report.found[family].slice(0, 3).map(({ chunk, id }) => `${chunk} ← ${id.replace(/^.*\/node_modules\//, "")}`).join(", ");

  const entryClosure = staticClosure(entries[0].fileName);
  const reports = { ENTRY: describe(entryClosure) };

  for (const page of PAGES) {
    const chunk = chunks.find((candidate) => candidate.modules.some((id) => id.endsWith(`/src/pages/${page}.tsx`)));
    if (!chunk) {
      failures.push(`${page}: no output chunk contains /src/pages/${page}.tsx`);
      continue;
    }
    if (entryClosure.has(chunk.fileName)) {
      failures.push(`${page}: page chunk ${chunk.fileName} is in the entry's static closure (eager page import)`);
    }
    if (!chunk.isDynamicEntry) failures.push(`${page}: ${chunk.fileName} is not a dynamic entry`);
    reports[page] = describe(new Set([...entryClosure, ...staticClosure(chunk.fileName)]));
  }

  for (const [label, page] of Object.entries(NON_WEBGL_ROUTES)) {
    const report = reports[page];
    if (!report) continue;
    for (const family of Object.keys(FAMILIES)) {
      if (report.found[family].length) {
        failures.push(`${label} (${page}): initial closure contains ${family} (${report.found[family].length} modules: ${offenders(report, family)})`);
      }
    }
    if (report.brotli > ROUTE_BROTLI_BUDGET) {
      failures.push(`${label} (${page}): initial JS ${report.brotli} B Brotli exceeds ${ROUTE_BROTLI_BUDGET} B`);
    }
  }

  const home = reports.StudioIndex;
  if (home) {
    if (!home.found.three.length) failures.push("HOME (StudioIndex): Three is missing from the initial closure; the WebGL hero must stay immediate");
    if (!home.found.r3f.length) failures.push("HOME (StudioIndex): R3F is missing from the initial closure; the WebGL hero must stay immediate");
    if (home.found.drei.length) failures.push(`HOME (StudioIndex): initial closure contains Drei (${offenders(home, "drei")})`);
    if (home.found.tone.length) failures.push(`HOME (StudioIndex): initial closure contains Tone (${offenders(home, "tone")})`);
    if (home.brotli >= PRE_SPLIT_BROTLI) failures.push(`HOME (StudioIndex): initial JS ${home.brotli} B Brotli is not below the pre-split ${PRE_SPLIT_BROTLI} B`);
  }

  const offer = reports.OfferV2;
  if (offer) {
    for (const family of Object.keys(FAMILIES)) {
      if (offer.found[family].length) failures.push(`OFFER (OfferV2): initial closure contains ${family} (${offenders(offer, family)})`);
    }
  }

  if (reports.ENTRY.found.tone.length) failures.push(`entry closure contains Tone (${offenders(reports.ENTRY, "tone")})`);
  if (!chunks.some((chunk) => chunk.modules.some((id) => FAMILIES.tone.test(id)))) {
    failures.push("no chunk contains Tone; the dynamic sound import is gone");
  }

  return { failures, reports };
}

function printReport(reports) {
  const count = (family, pages) => pages.reduce((total, page) => total + (reports[page]?.found[family].length ?? 0), 0);
  const nonWebglPages = Object.values(NON_WEBGL_ROUTES);

  console.log(`ENTRY_BROTLI=${reports.ENTRY?.brotli ?? "n/a"}`);
  console.log("");
  console.log(`HOME_BROTLI=${reports.StudioIndex?.brotli ?? "n/a"}`);
  console.log(`OFFER_BROTLI=${reports.OfferV2?.brotli ?? "n/a"}`);
  console.log("");
  for (const [label, page] of Object.entries(NON_WEBGL_ROUTES)) console.log(`${label}_BROTLI=${reports[page]?.brotli ?? "n/a"}`);
  console.log("");
  console.log(`NON_WEBGL_THREE=${count("three", nonWebglPages)}`);
  console.log(`NON_WEBGL_R3F=${count("r3f", nonWebglPages)}`);
  console.log(`NON_WEBGL_DREI=${count("drei", nonWebglPages)}`);
  console.log(`COLD_TONE=${count("tone", PAGES) + (reports.ENTRY?.found.tone.length ?? 0)}`);
}

// ---- Self-test: synthetic sources and graphs the guard must accept or reject ------------------

function selfTest() {
  const module = (name) => `/repo/node_modules/${name}/index.js`;
  const page = (name) => `/repo/src/pages/${name}.tsx`;
  const cleanChunks = () => [
    { fileName: "index.js", isEntry: true, isDynamicEntry: false, imports: ["react.js"], modules: ["/repo/src/main.tsx", "/repo/src/stage/audio/audioEngine.ts"], brotli: 140000 },
    { fileName: "react.js", isEntry: false, isDynamicEntry: false, imports: [], modules: [module("react")], brotli: 1000 },
    { fileName: "tone.js", isEntry: false, isDynamicEntry: true, imports: [], modules: [module("tone"), module("standardized-audio-context")], brotli: 70000 },
    { fileName: "fiber.js", isEntry: false, isDynamicEntry: false, imports: [], modules: [module("three"), module("@react-three/fiber")], brotli: 220000 },
    { fileName: "drei.js", isEntry: false, isDynamicEntry: true, imports: ["fiber.js"], modules: [module("@react-three/drei")], brotli: 60000 },
    ...PAGES.map((name) => ({
      fileName: `${name}.js`,
      isEntry: false,
      isDynamicEntry: true,
      imports: name === "StudioIndex" ? ["index.js", "fiber.js"] : ["index.js"],
      modules: [page(name)],
      brotli: 20000,
    })),
  ];
  const cleanSources = () => ({
    app: `import { routeModules } from "./routing/routeModules";\nconst Work = lazy(routeModules.work);\n`,
    routeModules: PAGES.map((name) => `  x: memoize(() => import("../pages/${name}")),`).join("\n"),
    audioEngine: `const tone = await import("tone");\n`,
  });

  const cases = [
    { name: "clean graph and sources", expectPass: true },
    {
      name: "Living Atlas page statically imported in App.tsx",
      sources: (s) => ({ ...s, app: `import LivingAtlasPage from "./pages/LivingAtlasPage";\n${s.app}` }),
    },
    {
      name: "Living Atlas page chunk pulled into the entry closure",
      graph: (c) => c.map((chunk) => (chunk.isEntry ? { ...chunk, imports: [...chunk.imports, "LivingAtlasPage.js"] } : chunk)),
    },
    {
      name: "WebGL dependency leaks into a non-WebGL route",
      graph: (c) => c.map((chunk) => (chunk.fileName === "EvidenceAtlas.js" ? { ...chunk, imports: [...chunk.imports, "fiber.js"] } : chunk)),
    },
    {
      name: "Drei leaks into Offer's initial closure",
      graph: (c) => c.map((chunk) => (chunk.fileName === "OfferV2.js" ? { ...chunk, imports: [...chunk.imports, "drei.js"] } : chunk)),
    },
    {
      name: "Tone cold-loaded from the entry",
      graph: (c) => c.map((chunk) => (chunk.isEntry ? { ...chunk, imports: [...chunk.imports, "tone.js"] } : chunk)),
    },
    {
      name: "Tone statically imported by the audio engine",
      sources: (s) => ({ ...s, audioEngine: `import * as Tone from "tone";\n` }),
    },
    {
      name: "route Brotli budget regression",
      graph: (c) => c.map((chunk) => (chunk.fileName === "PrivacyV2.js" ? { ...chunk, brotli: ROUTE_BROTLI_BUDGET } : chunk)),
    },
    {
      name: "Home loses its immediate WebGL hero",
      graph: (c) => c.map((chunk) => (chunk.fileName === "StudioIndex.js" ? { ...chunk, imports: ["index.js"] } : chunk)),
    },
  ];

  let failures = 0;
  for (const testCase of cases) {
    const sources = (testCase.sources ?? ((s) => s))(cleanSources());
    const graph = (testCase.graph ?? ((c) => c))(cleanChunks());
    const found = [...checkSources(sources), ...checkGraph(graph).failures];
    const pass = found.length === 0;
    const ok = pass === Boolean(testCase.expectPass);
    if (!ok) failures += 1;
    console.log(`${ok ? "✓" : "✗"} ${testCase.name}: ${pass ? "PASS" : `FAIL (${found[0]})`}`);
  }

  console.log(`ROUTE_BUNDLE_SELF_TEST=${failures ? "FAIL" : "PASS"}`);
  process.exit(failures ? 1 : 0);
}

// ---- Main ------------------------------------------------------------------------------------

async function main() {
  const root = process.cwd();
  const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
  const failures = checkSources({
    app: read("src/App.tsx"),
    routeModules: read("src/routing/routeModules.ts"),
    audioEngine: read("src/stage/audio/audioEngine.ts"),
  });

  const { build } = await import("vite");
  const chunks = [];
  const capture = {
    name: "route-bundle-capture",
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk" || !output.fileName.endsWith(".js")) continue;
        chunks.push({
          fileName: output.fileName,
          isEntry: output.isEntry,
          isDynamicEntry: output.isDynamicEntry,
          imports: output.imports,
          modules: Object.keys(output.modules).map((id) => id.replace(/\\/g, "/")),
        });
      }
    },
  };

  const result = await build({
    configFile: path.join(root, "vite.config.ts"),
    root,
    logLevel: "error",
    publicDir: false,
    plugins: [capture],
    build: { write: false, copyPublicDir: false, emptyOutDir: false },
  });

  // Vite still rewrites preload dependencies after plugins see the bundle, so sizes come from the
  // final returned code, which is byte-identical to what a normal build writes.
  const finalCode = new Map(
    (Array.isArray(result) ? result : [result])
      .flatMap((output) => output.output)
      .filter((output) => output.type === "chunk")
      .map((output) => [output.fileName, output.code]),
  );
  for (const chunk of chunks) {
    const code = finalCode.get(chunk.fileName);
    if (code === undefined) throw new Error(`no final output for ${chunk.fileName}`);
    chunk.brotli = zlib.brotliCompressSync(Buffer.from(code), {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length;
  }

  const graph = checkGraph(chunks);
  failures.push(...graph.failures);
  printReport(graph.reports);

  if (failures.length) {
    console.log("");
    for (const message of failures) console.error(`✗ ${message}`);
    console.log("ROUTE_BUNDLE_VALIDATION=FAIL");
    process.exit(1);
  }

  console.log("ROUTE_BUNDLE_VALIDATION=PASS");
}

if (process.argv.includes("--self-test")) selfTest();
else await main();
