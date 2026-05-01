import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const casesDir = path.join(root, "public", "cases");

const inputExts = new Set([".png", ".jpg", ".jpeg"]);

// Portfolio-quality settings.
// PNG screenshots are encoded lossless to preserve UI text and edges.
// JPG/JPEG sources stay high-quality lossy because they are already photographic/compressed.
const jpegWebpQuality = 96;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();

    if (inputExts.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const files = await walk(casesDir);

let totalBefore = 0;
let totalAfter = 0;
let converted = 0;

for (const input of files) {
  const parsed = path.parse(input);
  const ext = parsed.ext.toLowerCase();
  const output = path.join(parsed.dir, `${parsed.name}.webp`);

  const inputStat = await fs.stat(input);
  totalBefore += inputStat.size;

  const pipeline = sharp(input).rotate();

  if (ext === ".png") {
    await pipeline
      .webp({
        lossless: true,
        effort: 6,
      })
      .toFile(output);
  } else {
    await pipeline
      .webp({
        quality: jpegWebpQuality,
        effort: 6,
        smartSubsample: false,
      })
      .toFile(output);
  }

  const outputStat = await fs.stat(output);
  totalAfter += outputStat.size;
  converted += 1;

  console.log(
    `${path.relative(root, input)} -> ${path.relative(root, output)} | ${formatBytes(
      inputStat.size
    )} -> ${formatBytes(outputStat.size)}`
  );
}

console.log("");
console.log(`Converted: ${converted}`);
console.log(`Before: ${formatBytes(totalBefore)}`);
console.log(`After: ${formatBytes(totalAfter)}`);
console.log(`Saved: ${formatBytes(totalBefore - totalAfter)}`);
