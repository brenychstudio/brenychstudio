import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

// Deterministic responsive derivatives for portfolio presentation images.
// Originals under public/cases and public/immersive are read-only inputs; everything this
// script writes lives under public/media/portfolio plus the typed runtime manifest.
//
//   npm run media:portfolio                          generate derivatives + manifests
//   node scripts/generate-portfolio-media.mjs --check  validate without writing anything

const root = process.cwd();
const publicDir = path.join(root, "public");
const outputPublicPath = "/media/portfolio";
const outputDir = path.join(publicDir, "media", "portfolio");
const qaManifestPath = path.join(outputDir, "manifest.json");
const runtimeManifestPath = path.join(root, "src", "media", "portfolio", "generatedPortfolioImages.ts");

const SOURCE_FILES = [
  "src/data/cases.ts",
  "src/data/caseStories.ts",
  "src/data/immersiveSystems.ts",
  "src/pages/CasePageV2.tsx",
  "src/pages/EvidenceAtlas.tsx",
  "src/pages/ImmersiveV2.tsx",
];

const TARGET_WIDTHS = [64, 640, 960, 1600, 2560];
const PLACEHOLDER_WIDTH = 64;
const DISPLAY_WIDTHS = TARGET_WIDTHS.filter((width) => width !== PLACEHOLDER_WIDTH);
// Presentation delivery is capped here; wider originals stay reserved for inspect/fullscreen.
const MAX_PRESENTATION_WIDTH = 2560;

const PLACEHOLDER_WEBP = { quality: 45, effort: 4 };
const DISPLAY_WEBP = { quality: 86, effort: 4 };
// The terminal candidate is what DPR 2 layouts land on, so UI text must hold up at 1:1.
const TERMINAL_WEBP = { quality: 95, effort: 4, smartSubsample: true };

const IMAGE_RE =
  /["'`](\/(?:cases|immersive)\/[^"'`\s)]+\.(?:jpe?g|png|webp))["'`]/gi;

const checkOnly = process.argv.includes("--check");

async function collectReferencedImages() {
  const urls = new Set();

  for (const file of SOURCE_FILES) {
    const text = await fs.readFile(path.join(root, file), "utf8");
    for (const match of text.matchAll(IMAGE_RE)) {
      urls.add(path.posix.normalize(match[1]));
    }
  }

  return [...urls].sort();
}

function toPublicFile(url) {
  return path.join(publicDir, ...url.split("/").filter(Boolean));
}

function derivativeUrl(url, width) {
  const { dir, name } = path.posix.parse(url);
  return `${outputPublicPath}${dir}/${name}-w${width}.webp`;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function toHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

async function encode(sourcePath, width, targetPath, webpOptions) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await sharp(sourcePath)
    .resize({ width, withoutEnlargement: true })
    .webp(webpOptions)
    .toFile(targetPath);
}

// Canonical tiers that fit inside the source, plus a terminal tier at the source's own width
// (capped at MAX_PRESENTATION_WIDTH) so a source between tiers is never delivered below its
// native density. Below the smallest display width the original itself is the display image.
function displayWidthsFor(sourceWidth) {
  const canonical = DISPLAY_WIDTHS.filter((target) => target <= sourceWidth);
  if (!canonical.length) return [];

  const terminal = Math.min(sourceWidth, MAX_PRESENTATION_WIDTH);
  return canonical.includes(terminal) ? canonical : [...canonical, terminal];
}

async function buildEntry(url) {
  const sourcePath = toPublicFile(url);
  const metadata = await sharp(sourcePath).metadata();
  const { dominant } = await sharp(sourcePath).stats();
  const width = metadata.width;
  const height = metadata.height;

  // Never upscale: every emitted width fits inside the source.
  const placeholder = width >= PLACEHOLDER_WIDTH ? derivativeUrl(url, PLACEHOLDER_WIDTH) : null;
  const displayWidths = displayWidthsFor(width);
  const terminalWidth = displayWidths.at(-1);
  const variants = displayWidths.map((target) => ({
    src: derivativeUrl(url, target),
    width: target,
  }));

  if (!checkOnly) {
    if (placeholder) await encode(sourcePath, PLACEHOLDER_WIDTH, toPublicFile(placeholder), PLACEHOLDER_WEBP);
    for (const variant of variants) {
      const options = variant.width === terminalWidth ? TERMINAL_WEBP : DISPLAY_WEBP;
      await encode(sourcePath, variant.width, toPublicFile(variant.src), options);
    }
  }

  return {
    original: url,
    width,
    height,
    placeholder,
    dominantColor: toHex(dominant),
    variants,
  };
}

async function mapWithConcurrency(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await task(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

function renderRuntimeManifest(images) {
  const lines = [
    "// Generated by scripts/generate-portfolio-media.mjs. Do not edit by hand.",
    "",
    "export type GeneratedPortfolioImageVariant = {",
    "  src: string;",
    "  width: number;",
    "};",
    "",
    "export type GeneratedPortfolioImage = {",
    "  original: string;",
    "  width: number;",
    "  height: number;",
    "  placeholder: string | null;",
    "  dominantColor: string;",
    "  variants: GeneratedPortfolioImageVariant[];",
    "};",
    "",
    "export const generatedPortfolioImages: Record<string, GeneratedPortfolioImage> = {",
  ];

  for (const image of images) {
    lines.push(`  ${JSON.stringify(image.original)}: {`);
    lines.push(`    original: ${JSON.stringify(image.original)},`);
    lines.push(`    width: ${image.width},`);
    lines.push(`    height: ${image.height},`);
    lines.push(`    placeholder: ${JSON.stringify(image.placeholder)},`);
    lines.push(`    dominantColor: ${JSON.stringify(image.dominantColor)},`);
    lines.push("    variants: [");
    for (const variant of image.variants) {
      lines.push(`      { src: ${JSON.stringify(variant.src)}, width: ${variant.width} },`);
    }
    lines.push("    ],");
    lines.push("  },");
  }

  lines.push("};", "");
  return lines.join("\n");
}

function renderQaManifest(images) {
  return `${JSON.stringify(
    {
      generator: "scripts/generate-portfolio-media.mjs",
      sourceFiles: SOURCE_FILES,
      targetWidths: TARGET_WIDTHS,
      maxPresentationWidth: MAX_PRESENTATION_WIDTH,
      images: Object.fromEntries(images.map((image) => [image.original, image])),
    },
    null,
    2,
  )}\n`;
}

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name));
}

async function check(urls) {
  const errors = [];
  const fail = (message) => errors.push(message);
  const expectedFiles = new Set();

  for (const url of urls) {
    if (!(await exists(toPublicFile(url)))) fail(`missing source: ${url}`);
  }

  if (!(await exists(qaManifestPath))) fail(`missing manifest: ${path.relative(root, qaManifestPath)}`);
  if (!(await exists(runtimeManifestPath))) fail(`missing runtime manifest: ${path.relative(root, runtimeManifestPath)}`);
  if (errors.length) return errors;

  const qa = JSON.parse(await fs.readFile(qaManifestPath, "utf8"));
  const images = Object.values(qa.images);
  const manifestUrls = Object.keys(qa.images);

  if (JSON.stringify(manifestUrls) !== JSON.stringify(urls)) {
    const missing = urls.filter((url) => !manifestUrls.includes(url));
    const extra = manifestUrls.filter((url) => !urls.includes(url));
    fail(`manifest out of date (missing ${missing.length}, extra ${extra.length}); run npm run media:portfolio`);
  }

  for (const image of images) {
    if (!(await exists(toPublicFile(image.original)))) fail(`manifest entry source missing: ${image.original}`);
    if (image.original.startsWith(`${outputPublicPath}/`)) fail(`original inside ${outputPublicPath}: ${image.original}`);

    const derived = [
      ...(image.placeholder ? [{ src: image.placeholder, width: PLACEHOLDER_WIDTH }] : []),
      ...image.variants,
    ];
    for (const { src, width } of derived) {
      expectedFiles.add(toPublicFile(src));
      if (!src.startsWith(`${outputPublicPath}/`)) fail(`derivative outside ${outputPublicPath}: ${src}`);
      if (!(await exists(toPublicFile(src)))) {
        fail(`missing derivative: ${src}`);
        continue;
      }
      const actual = (await sharp(toPublicFile(src)).metadata()).width;
      if (actual !== width) fail(`derivative is ${actual}px, manifest says ${width}px: ${src}`);
    }

    const widths = image.variants.map((variant) => variant.width);
    widths.forEach((width, index) => {
      if (index > 0 && width <= widths[index - 1]) fail(`variant widths not ascending/unique: ${image.original}`);
      if (width > image.width) fail(`variant wider than source (${width} > ${image.width}): ${image.original}`);
      if (width > MAX_PRESENTATION_WIDTH) fail(`variant wider than ${MAX_PRESENTATION_WIDTH}: ${image.original}`);
    });
    if (JSON.stringify(widths) !== JSON.stringify(displayWidthsFor(image.width))) {
      fail(`variants do not match the tier policy (${widths.join("/")}): ${image.original}`);
    }
  }

  for (const file of await listFiles(outputDir)) {
    if (file !== qaManifestPath && !expectedFiles.has(file)) fail(`orphan derivative: ${path.relative(root, file)}`);
  }

  const runtime = await fs.readFile(runtimeManifestPath, "utf8");
  if (runtime !== renderRuntimeManifest(images)) fail("runtime manifest does not match manifest.json");

  return errors;
}

async function main() {
  const urls = await collectReferencedImages();

  if (checkOnly) {
    const errors = await check(urls);
    if (errors.length) {
      for (const error of errors) console.error(`✗ ${error}`);
      process.exit(1);
    }
    console.log(`✓ ${urls.length} portfolio images validated`);
    return;
  }

  const missing = [];
  for (const url of urls) {
    if (!(await exists(toPublicFile(url)))) missing.push(url);
  }
  if (missing.length) {
    for (const url of missing) console.error(`✗ missing source: ${url}`);
    process.exit(1);
  }

  const images = await mapWithConcurrency(urls, Math.max(1, os.availableParallelism?.() ?? os.cpus().length), buildEntry);

  await fs.mkdir(path.dirname(runtimeManifestPath), { recursive: true });
  await fs.writeFile(qaManifestPath, renderQaManifest(images));
  await fs.writeFile(runtimeManifestPath, renderRuntimeManifest(images));

  const fileCount = images.reduce((sum, image) => sum + image.variants.length + (image.placeholder ? 1 : 0), 0);
  console.log(`✓ ${images.length} portfolio images → ${fileCount} derivatives in ${path.relative(root, outputDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
