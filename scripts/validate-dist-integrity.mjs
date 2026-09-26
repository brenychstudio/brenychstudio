import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Final-dist integrity guard. Scans the real written build output: every asset the runtime or the
// generated HTML can request must exist, and because inlineBuiltCss() inlines all CSS into the
// HTML and deletes the CSS files, no runtime CSS dependency may remain. A missing preload
// dependency makes a lazy route import reject in the browser and leaves a blank page.
//
//   node scripts/validate-dist-integrity.mjs [dist]    (runs after every `npm run build`)
//   node scripts/validate-dist-integrity.mjs --self-test

const MAP_DEPS_RE = /__vite__mapDeps=\(i,m=__vite__mapDeps,d=\(m\.f\|\|\(m\.f=(\[[^\]]*\])/g;
const JS_IMPORT_RE = /(?:\bfrom|\bimport)\s*\(?\s*(["'`])(\.{1,2}\/[^"'`\s]+?\.m?js)\1/g;
const HTML_ASSET_RE = /\b(?:src|href)="\/(assets\/[^"?#]+)[^"]*"/g;
const HTML_STYLESHEET_RE = /<link\b[^>]*\brel="stylesheet"[^>]*>/g;

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

export function scanDist(distDir) {
  const toRel = (file) => path.relative(distDir, file).split(path.sep).join("/");
  const exists = (rel) => fs.existsSync(path.join(distDir, rel));
  const files = listFiles(distDir).map(toRel);
  const jsFiles = files.filter((file) => file.startsWith("assets/") && /\.m?js$/.test(file));
  const htmlFiles = files.filter((file) => file.endsWith(".html"));

  const result = {
    checked: { js: jsFiles.length, html: htmlFiles.length, mapDeps: 0, imports: 0, htmlAssets: 0 },
    missingMapDeps: [],
    missingImports: [],
    missingHtml: [],
    runtimeCss: [],
    builtCss: files.filter((file) => file.startsWith("assets/") && file.endsWith(".css")),
  };

  for (const file of jsFiles) {
    const code = fs.readFileSync(path.join(distDir, file), "utf8");

    for (const match of code.matchAll(MAP_DEPS_RE)) {
      for (const dep of JSON.parse(match[1])) {
        const target = dep.startsWith(".") ? path.posix.join(path.posix.dirname(file), dep) : dep.replace(/^\//, "");
        result.checked.mapDeps += 1;
        if (target.endsWith(".css")) result.runtimeCss.push(`${file} → ${target} (__vite__mapDeps)`);
        if (!exists(target)) result.missingMapDeps.push(`${file} → ${target}`);
      }
    }

    for (const match of code.matchAll(JS_IMPORT_RE)) {
      const target = path.posix.join(path.posix.dirname(file), match[2]);
      result.checked.imports += 1;
      if (!exists(target)) result.missingImports.push(`${file} → ${target}`);
    }
  }

  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(distDir, file), "utf8");

    for (const match of html.matchAll(HTML_ASSET_RE)) {
      result.checked.htmlAssets += 1;
      if (!exists(match[1])) result.missingHtml.push(`${file} → ${match[1]}`);
    }

    for (const [link] of html.matchAll(HTML_STYLESHEET_RE)) {
      const href = link.match(/\bhref="\/(assets\/[^"]+)"/)?.[1];
      if (href) result.runtimeCss.push(`${file} → ${href} (<link rel="stylesheet">)`);
    }
  }

  result.pass =
    !result.missingMapDeps.length &&
    !result.missingImports.length &&
    !result.missingHtml.length &&
    !result.runtimeCss.length &&
    !result.builtCss.length;

  return result;
}

function report(result) {
  const lines = [
    ...result.missingMapDeps.map((entry) => `✗ __vite__mapDeps ${entry} (missing from dist)`),
    ...result.missingImports.map((entry) => `✗ import ${entry} (missing from dist)`),
    ...result.missingHtml.map((entry) => `✗ ${entry} (missing from dist)`),
    ...result.runtimeCss.map((entry) => `✗ runtime CSS dependency not allowed with inlined CSS: ${entry}`),
    ...result.builtCss.map((entry) => `✗ built CSS file left in dist: ${entry}`),
  ];
  for (const line of lines) console.error(line);
  if (lines.length) console.log("");

  const { checked } = result;
  console.log(`CHECKED js=${checked.js} html=${checked.html} mapDeps=${checked.mapDeps} imports=${checked.imports} htmlAssets=${checked.htmlAssets}`);
  console.log(`MISSING_MAPDEPS_REFERENCES=${result.missingMapDeps.length}`);
  console.log(`MISSING_IMPORT_REFERENCES=${result.missingImports.length}`);
  console.log(`MISSING_HTML_REFERENCES=${result.missingHtml.length}`);
  console.log(`RUNTIME_CSS_DEPENDENCIES=${result.runtimeCss.length}`);
  console.log(`BUILT_CSS_FILES=${result.builtCss.length}`);
  console.log(`DIST_INTEGRITY=${result.pass ? "PASS" : "FAIL"}`);
}

// ---- Self-test: synthetic dists that the guard must accept or reject -------------------------

const mapDeps = (deps) => `const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=${JSON.stringify(deps)})))=>i.map(i=>d[i]);\n`;

const CLEAN = {
  "index.html": `<html><head><style data-inline-build-css>body{margin:0}</style><script type="module" crossorigin src="/assets/index-a.js"></script><link rel="modulepreload" crossorigin href="/assets/shared-c.js"></head><body><div id="root"></div></body></html>`,
  "assets/index-a.js": `${mapDeps(["assets/page-b.js", "assets/shared-c.js"])}import{t as e}from"./shared-c.js";const p=()=>e(()=>import(\`./page-b.js\`),__vite__mapDeps([0,1]));export{p};`,
  "assets/page-b.js": `import{t as e}from"./shared-c.js";export default e;`,
  "assets/shared-c.js": `export const t=(f)=>f();`,
};

const SELF_TEST_CASES = [
  { name: "clean build", files: {}, expect: { pass: true } },
  {
    name: "missing __vite__mapDeps asset",
    files: { "assets/index-a.js": CLEAN["assets/index-a.js"].replace('"assets/page-b.js"', '"assets/page-gone.js"') },
    expect: { pass: false, missingMapDeps: 1 },
  },
  {
    name: "missing imported JS",
    files: { "assets/page-b.js": `import{t as e}from"./gone-d.js";export default e;` },
    expect: { pass: false, missingImports: 1 },
  },
  {
    name: "missing HTML asset",
    files: { "work/index.html": CLEAN["index.html"].replace("/assets/index-a.js", "/assets/index-stale.js") },
    expect: { pass: false, missingHtml: 1 },
  },
  {
    name: "runtime CSS dependency deleted by CSS inlining",
    files: { "assets/index-a.js": CLEAN["assets/index-a.js"].replace('"assets/shared-c.js"]', '"assets/shared-c.js","assets/page-b.css"]') },
    expect: { pass: false, missingMapDeps: 1, runtimeCss: 1 },
  },
  {
    name: "runtime CSS dependency still shipped",
    files: {
      "assets/index-a.js": CLEAN["assets/index-a.js"].replace('"assets/shared-c.js"]', '"assets/shared-c.js","assets/page-b.css"]'),
      "assets/page-b.css": "body{color:red}",
    },
    expect: { pass: false, missingMapDeps: 0, runtimeCss: 1, builtCss: 1 },
  },
  {
    name: "stylesheet link in generated HTML",
    files: { "index.html": CLEAN["index.html"].replace("</head>", `<link rel="stylesheet" crossorigin href="/assets/index-a.css"></head>`) },
    expect: { pass: false, missingHtml: 1, runtimeCss: 1 },
  },
];

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dist-integrity-"));
  let failures = 0;

  try {
    SELF_TEST_CASES.forEach((testCase, index) => {
      const dir = path.join(tmp, String(index));
      for (const [rel, content] of Object.entries({ ...CLEAN, ...testCase.files })) {
        fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
        fs.writeFileSync(path.join(dir, rel), content);
      }

      const result = scanDist(dir);
      const actual = {
        pass: result.pass,
        missingMapDeps: result.missingMapDeps.length,
        missingImports: result.missingImports.length,
        missingHtml: result.missingHtml.length,
        runtimeCss: result.runtimeCss.length,
        builtCss: result.builtCss.length,
      };
      const mismatches = Object.entries(testCase.expect).filter(([key, value]) => actual[key] !== value);
      if (mismatches.length) failures += 1;
      console.log(`${mismatches.length ? "✗" : "✓"} ${testCase.name}: ${result.pass ? "PASS" : "FAIL"}${mismatches.length ? ` (expected ${JSON.stringify(testCase.expect)}, got ${JSON.stringify(actual)})` : ""}`);
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  console.log(`DIST_INTEGRITY_SELF_TEST=${failures ? "FAIL" : "PASS"}`);
  process.exit(failures ? 1 : 0);
}

// ---- Main ------------------------------------------------------------------------------------

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const distDir = path.resolve(process.argv[2] ?? "dist");
  if (!fs.existsSync(path.join(distDir, "index.html"))) {
    console.error(`✗ ${distDir} has no index.html; run the Vite build first`);
    console.log("DIST_INTEGRITY=FAIL");
    process.exit(1);
  }

  const result = scanDist(distDir);
  report(result);
  process.exit(result.pass ? 0 : 1);
}
