import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const srcDir = path.join(root, "src");

const textExts = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

async function publicAssetExists(assetPath) {
  const normalized = assetPath.replaceAll("/", path.sep);
  const fullPath = path.join(publicDir, normalized.replace(/^\\|^\//, ""));

  try {
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

const files = (await walk(srcDir)).filter((file) =>
  textExts.has(path.extname(file).toLowerCase())
);

let changedFiles = 0;
let changedRefs = 0;

for (const file of files) {
  let content = await fs.readFile(file, "utf8");
  const original = content;

  const matches = [...content.matchAll(/(["'`])\/cases\/([^"'`]+?)\.(png|jpg|jpeg)\1/gi)];

  for (const match of matches) {
    const quote = match[1];
    const basePath = `/cases/${match[2]}`;
    const webpPath = `${basePath}.webp`;

    if (await publicAssetExists(webpPath)) {
      const oldRef = `${quote}${basePath}.${match[3]}${quote}`;
      const newRef = `${quote}${webpPath}${quote}`;
      content = content.split(oldRef).join(newRef);
      changedRefs += 1;
    }
  }

  if (content !== original) {
    await fs.writeFile(file, content, "utf8");
    changedFiles += 1;
    console.log(`Updated: ${path.relative(root, file)}`);
  }
}

console.log("");
console.log(`Changed files: ${changedFiles}`);
console.log(`Changed references: ${changedRefs}`);
