import fs from "node:fs";
import path from "node:path";

import { VIDEO_MEDIA_ORIGIN, videoAssets } from "../src/media/video/videoAssets.ts";

// Static video registry validation (no network). Registry structure first, then a scan of
// src/**/*.ts(x) so a storage path or media origin written outside the registry fails the gate.
//
//   npm run video:validate

const root = process.cwd();
const REGISTRY_FILE = path.join("src", "media", "video", "videoAssets.ts");
const EXPECTED_ORIGIN = "https://media.brenychstudio.com";
// BSW-VIDEO-01A: every current asset still ships from the Pages build.
const LOCAL_ONLY_PHASE = true;

const R2_KEY_RE = /^video\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+-v\d{3}\.mp4$/;
const MP4_LITERAL_RE = /["'`](\/(?:cases|immersive)\/[^"'`\s)]+\.mp4)["'`]/gi;
const MEDIA_HOST_RE = /media\.brenychstudio\.com/g;
const RESOLVE_CALL_RE = /resolveVideoAsset\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

type Asset = {
  id: string;
  project: string;
  surface: string;
  delivery: string;
  localPath: string;
  r2?: { key: string; version: number };
};

const registryErrors: string[] = [];
const consumerErrors: string[] = [];
const assets = Object.entries(videoAssets as Record<string, Asset>);

if (VIDEO_MEDIA_ORIGIN !== EXPECTED_ORIGIN) {
  registryErrors.push(`VIDEO_MEDIA_ORIGIN is ${VIDEO_MEDIA_ORIGIN}, expected ${EXPECTED_ORIGIN}`);
}

const seenIds = new Set<string>();
const seenLocalPaths = new Map<string, string>();
const seenKeys = new Map<string, string>();

for (const [key, asset] of assets) {
  const fail = (message: string) => registryErrors.push(`${key}: ${message}`);

  if (asset.id !== key) fail(`id "${asset.id}" does not match its registry key`);
  if (seenIds.has(asset.id)) fail(`duplicate id "${asset.id}"`);
  seenIds.add(asset.id);

  if (asset.delivery !== "local" && asset.delivery !== "r2") fail(`invalid delivery "${asset.delivery}"`);
  if (LOCAL_ONLY_PHASE && asset.delivery !== "local") fail("delivery must stay local during BSW-VIDEO-01A");

  if (!asset.localPath) {
    fail("missing localPath");
  } else {
    if (!/^\/(cases|immersive)\//.test(asset.localPath)) fail(`localPath must start with /cases/ or /immersive/: ${asset.localPath}`);
    if (!asset.localPath.endsWith(".mp4")) fail(`localPath must end with .mp4: ${asset.localPath}`);
    if (asset.delivery === "local" && !fs.existsSync(path.join(root, "public", asset.localPath))) {
      fail(`local file missing: public${asset.localPath}`);
    }
    const owner = seenLocalPaths.get(asset.localPath);
    if (owner) fail(`localPath already registered by ${owner}`);
    seenLocalPaths.set(asset.localPath, key);
  }

  if (!asset.r2) {
    fail("missing r2 descriptor");
    continue;
  }
  const { key: r2Key, version } = asset.r2;
  if (!r2Key.startsWith("video/")) fail(`r2 key must start with video/: ${r2Key}`);
  if (!R2_KEY_RE.test(r2Key)) fail(`r2 key is not video/<project>/<surface>/<asset>-vNNN.mp4: ${r2Key}`);
  const keyVersion = Number(/-v(\d{3})\.mp4$/.exec(r2Key)?.[1]);
  if (!Number.isInteger(version) || version < 1 || keyVersion !== version) {
    fail(`r2 version ${version} does not match key suffix in ${r2Key}`);
  }
  const [, keyProject, keySurface] = r2Key.split("/");
  if (keyProject !== asset.project || keySurface !== asset.surface) {
    fail(`r2 key ${r2Key} does not match project/surface ${asset.project}/${asset.surface}`);
  }
  const keyOwner = seenKeys.get(r2Key);
  if (keyOwner) fail(`duplicate r2 key, already used by ${keyOwner}`);
  seenKeys.set(r2Key, key);
}

function listSources(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSources(full);
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

let directLiterals = 0;
let originLiterals = 0;
let resolveCalls = 0;
for (const file of listSources("src").sort()) {
  if (file === REGISTRY_FILE) continue;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    const at = `${file}:${index + 1}`;
    for (const match of line.matchAll(MP4_LITERAL_RE)) {
      directLiterals += 1;
      consumerErrors.push(`${at}: direct video path ${match[1]} (use resolveVideoAsset)`);
    }
    for (const _match of line.matchAll(MEDIA_HOST_RE)) {
      originLiterals += 1;
      consumerErrors.push(`${at}: media.brenychstudio.com outside ${REGISTRY_FILE}`);
    }
    for (const match of line.matchAll(RESOLVE_CALL_RE)) {
      resolveCalls += 1;
      if (!seenIds.has(match[1])) consumerErrors.push(`${at}: unknown video asset id "${match[1]}"`);
    }
  });
}

const local = assets.filter(([, asset]) => asset.delivery === "local").length;
const r2 = assets.filter(([, asset]) => asset.delivery === "r2").length;

console.log(`VIDEO_ASSETS=${assets.length}`);
console.log(`LOCAL_DELIVERY=${local}`);
console.log(`R2_DELIVERY=${r2}`);
console.log(`CURRENT_R2_DELIVERY_COUNT=${r2}`);
console.log(`REGISTRY_STRUCTURE=${registryErrors.length ? "FAIL" : "PASS"}`);
for (const error of registryErrors) console.error(`✗ ${error}`);
console.log(`RESOLVE_CALLS=${resolveCalls}`);
console.log(`DIRECT_MP4_LITERALS_OUTSIDE_REGISTRY=${directLiterals}`);
console.log(`MEDIA_ORIGIN_LITERALS_OUTSIDE_REGISTRY=${originLiterals}`);
console.log(`CONSUMER_REFERENCES=${consumerErrors.length ? "FAIL" : "PASS"}`);
for (const error of consumerErrors) console.error(`✗ ${error}`);

const ok = registryErrors.length === 0 && consumerErrors.length === 0;
console.log(`VIDEO_ASSET_VALIDATION=${ok ? "PASS" : "FAIL"}`);
if (!ok) process.exit(1);
