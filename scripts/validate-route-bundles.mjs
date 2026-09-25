import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { build } from "vite";

// Route bundle regression guard. Runs an in-memory production build of the repository config
// (nothing is written to dist) and checks each route's initial JS closure from actual chunk
// module membership and static imports; hashed file names are never assumed.
//
//   npm run perf:routes

const root = process.cwd();

// 260 KiB Brotli per non-WebGL route; the pre-split build sent ~520,923 B to every route.
const ROUTE_BROTLI_BUDGET = 266240;
const PRE_SPLIT_BROTLI = 520923;

const FAMILIES = {
  three: /\/node_modules\/three\//,
  r3f: /\/node_modules\/@react-three\/fiber\//,
  drei: /\/node_modules\/@react-three\/drei\//,
  tone: /\/node_modules\/(?:tone|standardized-audio-context)\//,
};

const MAJOR_PAGES = [
  "StudioIndex",
  "EvidenceAtlas",
  "CasePageV2",
  "ImmersiveV2",
  "ImmersiveCasePage",
  "OfferV2",
  "AboutV2",
  "ServicePage",
];
const ALL_PAGES = [...MAJOR_PAGES, "PrivacyV2", "LegalV2", "SpatialProof"];

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
};

const failures = [];
const fail = (message) => failures.push(message);

// ---- Source contracts -------------------------------------------------------------------------

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const app = read("src/App.tsx");
for (const page of MAJOR_PAGES) {
  if (new RegExp(`^import\\s+(?!type\\b)[^;]*from\\s+["']\\./pages/${page}["']`, "m").test(app)) {
    fail(`src/App.tsx statically imports ./pages/${page}; route pages must load through routeModules`);
  }
}

const routeModules = read("src/routing/routeModules.ts");
for (const page of ALL_PAGES) {
  if (!new RegExp(`import\\(\\s*["']\\.\\./pages/${page}["']\\s*\\)`).test(routeModules)) {
    fail(`src/routing/routeModules.ts has no dynamic import of ../pages/${page}`);
  }
}

const audioEngine = read("src/stage/audio/audioEngine.ts");
if (!/import\(\s*["']tone["']\s*\)/.test(audioEngine)) fail('src/stage/audio/audioEngine.ts no longer uses import("tone")');
if (/from\s+["']tone["']/.test(audioEngine)) fail("src/stage/audio/audioEngine.ts statically imports tone");

// ---- In-memory production build -------------------------------------------------------------

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
        facadeModuleId: output.facadeModuleId,
        imports: output.imports,
        dynamicImports: output.dynamicImports,
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

const byFile = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
const entries = chunks.filter((chunk) => chunk.isEntry);
if (entries.length !== 1) throw new Error(`expected one entry chunk, found ${entries.length}`);
const entry = entries[0];

function staticClosure(fileName) {
  const seen = new Set();
  const queue = [fileName];
  while (queue.length) {
    const next = queue.pop();
    if (seen.has(next)) continue;
    seen.add(next);
    for (const imported of byFile.get(next)?.imports ?? []) queue.push(imported);
  }
  return seen;
}

function describe(closure) {
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
}

const pageModule = (page) => `/src/pages/${page}.tsx`;
const findPageChunk = (page) => chunks.find((chunk) => chunk.modules.some((id) => id.endsWith(pageModule(page))));
const entryClosure = staticClosure(entry.fileName);
const entryReport = describe(entryClosure);

const routeReports = {};
for (const page of ALL_PAGES) {
  const chunk = findPageChunk(page);
  if (!chunk) {
    fail(`${page}: no output chunk contains ${pageModule(page)}`);
    continue;
  }
  if (entryClosure.has(chunk.fileName)) {
    fail(`${page}: page chunk ${chunk.fileName} is in the entry's static closure (eager page import)`);
  }
  if (!chunk.isDynamicEntry) fail(`${page}: ${chunk.fileName} is not a dynamic entry`);
  routeReports[page] = describe(new Set([...entryClosure, ...staticClosure(chunk.fileName)]));
}

const offenders = (report, family) =>
  report.found[family].slice(0, 3).map(({ chunk, id }) => `${chunk} ← ${id.replace(/^.*\/node_modules\//, "")}`).join(", ");

for (const [label, page] of Object.entries(NON_WEBGL_ROUTES)) {
  const report = routeReports[page];
  if (!report) continue;
  for (const family of Object.keys(FAMILIES)) {
    if (report.found[family].length) {
      fail(`${label} (${page}): initial closure contains ${family} (${report.found[family].length} modules: ${offenders(report, family)})`);
    }
  }
  if (report.brotli > ROUTE_BROTLI_BUDGET) {
    fail(`${label} (${page}): initial JS ${report.brotli} B Brotli exceeds ${ROUTE_BROTLI_BUDGET} B`);
  }
}

const home = routeReports.StudioIndex;
if (home) {
  if (!home.found.three.length) fail("HOME (StudioIndex): Three is missing from the initial closure; the WebGL hero must stay immediate");
  if (!home.found.r3f.length) fail("HOME (StudioIndex): R3F is missing from the initial closure; the WebGL hero must stay immediate");
  if (home.found.drei.length) fail(`HOME (StudioIndex): initial closure contains Drei (${offenders(home, "drei")})`);
  if (home.found.tone.length) fail(`HOME (StudioIndex): initial closure contains Tone (${offenders(home, "tone")})`);
  if (home.brotli >= PRE_SPLIT_BROTLI) fail(`HOME (StudioIndex): initial JS ${home.brotli} B Brotli is not below the pre-split ${PRE_SPLIT_BROTLI} B`);
}

const offer = routeReports.OfferV2;
if (offer) {
  for (const family of Object.keys(FAMILIES)) {
    if (offer.found[family].length) fail(`OFFER (OfferV2): initial closure contains ${family} (${offenders(offer, family)})`);
  }
}

if (entryReport.found.tone.length) fail(`entry closure contains Tone (${offenders(entryReport, "tone")})`);
if (!chunks.some((chunk) => chunk.modules.some((id) => FAMILIES.tone.test(id)))) {
  fail("no chunk contains Tone; the dynamic sound import is gone");
}

// ---- Report -----------------------------------------------------------------------------------

const count = (family, pages) => pages.reduce((total, page) => total + (routeReports[page]?.found[family].length ?? 0), 0);
const nonWebglPages = Object.values(NON_WEBGL_ROUTES);

console.log(`ENTRY_BROTLI=${entryReport.brotli}`);
console.log("");
console.log(`HOME_BROTLI=${home?.brotli ?? "n/a"}`);
console.log(`OFFER_BROTLI=${offer?.brotli ?? "n/a"}`);
console.log("");
for (const [label, page] of Object.entries(NON_WEBGL_ROUTES)) console.log(`${label}_BROTLI=${routeReports[page]?.brotli ?? "n/a"}`);
console.log("");
console.log(`NON_WEBGL_THREE=${count("three", nonWebglPages)}`);
console.log(`NON_WEBGL_R3F=${count("r3f", nonWebglPages)}`);
console.log(`NON_WEBGL_DREI=${count("drei", nonWebglPages)}`);
console.log(`COLD_TONE=${count("tone", ALL_PAGES) + entryReport.found.tone.length}`);

if (failures.length) {
  console.log("");
  for (const message of failures) console.error(`✗ ${message}`);
  console.log("ROUTE_BUNDLE_VALIDATION=FAIL");
  process.exit(1);
}

console.log("ROUTE_BUNDLE_VALIDATION=PASS");
