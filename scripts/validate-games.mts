import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import type { GameEntry } from "../src/data/games.ts";

// Games surface guard (SITE-GAMES-01). The four owner-fixed games, truthful evidence labels, real image files, the
// seventh Header/Footer section, EN/ES routing and the review gate (noindex, absent from the sitemap).
//   node --experimental-strip-types scripts/validate-games.mts [--self-test]

let count = 0;
const failures: string[] = [];
function check(name: string, run: () => void) {
  count++;
  try { run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push(`${name}: ${error instanceof Error ? error.message : error}`); console.error(`FAIL ${failures.at(-1)}`); }
}

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const { games, gamesCopy } = await import("../src/data/games.ts");

// Owner priority (SITE-GAMES-01-FIX1-R1): BLACK START is first and the default selection.
const FIXED = ["black-start", "project-mars-2158", "shift-world", "project-territories"];
const TITLES = ["BLACK START", "PROJECT MARS 2158", "SHIFT WORLD", "PROJECT TERRITORIES"];
const PROOF_KINDS = new Set(["gameplay-capture", "prototype-capture", "realtime-render", "offline-render"]);
const DEMO_ALLOWLIST = new Set(["https://shift-world-smoke-staging-20261008-r02.netlify.app/"]);
// Claims the page must not make without proof (release, storefronts, scale, money, live AI). "Not announced" is fine.
const FORBIDDEN = /\b(steam|early access|pre-?orders?|wishlist|coming soon|out now|available (now|on)|release date|launch(es|ing)? (in|on)|multiplayer|million|budget|team of|revenue|funding|\bAAA\b|AI-(driven|powered)|powered by AI|lanzamiento (en|el) \d|disponible (ya|en))\b/i;

/** Reads width/height from a WebP header (VP8, VP8L or VP8X). */
export function webpSize(bytes: Uint8Array): { width: number; height: number } | null {
  const text = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (text(0, 4) !== "RIFF" || text(8, 12) !== "WEBP") return null;
  const chunk = text(12, 16);
  if (chunk === "VP8X") return { width: 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)), height: 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) };
  if (chunk === "VP8 ") return { width: (bytes[26] | (bytes[27] << 8)) & 0x3fff, height: (bytes[28] | (bytes[29] << 8)) & 0x3fff };
  if (chunk === "VP8L") {
    const b = bytes.slice(21, 25);
    return { width: 1 + (((b[1] & 0x3f) << 8) | b[0]), height: 1 + (((b[3] & 0xf) << 10) | (b[2] << 2) | ((b[1] & 0xc0) >> 6)) };
  }
  return null;
}

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

export function validateCatalog(list: readonly GameEntry[], fileExists: (path: string) => Uint8Array | null) {
  const issues: string[] = [];
  if (JSON.stringify(list.map((game) => game.slug)) !== JSON.stringify(FIXED)) issues.push(`games must be exactly ${FIXED.join(", ")} in order`);
  list.forEach((game, index) => {
    if (TITLES[index] && game.title !== TITLES[index]) issues.push(`${game.slug}: title ${game.title} is not the owner-fixed ${TITLES[index]}`);
    if (`${game.titlePrefix ? `${game.titlePrefix} ` : ""}${game.titleMain}` !== game.title) issues.push(`${game.slug}: title parts do not compose the title`);
    if (game.index !== String(index + 1).padStart(2, "0")) issues.push(`${game.slug}: index ${game.index}`);
    if (!game.media.length) issues.push(`${game.slug}: no media (use an editorial state with explicit PROOF_PENDING instead)`);
    if (game.media[0] && game.media[0].orientation !== "landscape") issues.push(`${game.slug}: the stage frame needs a landscape hero`);
    for (const media of game.media) {
      if (!PROOF_KINDS.has(media.kind)) issues.push(`${game.slug}/${media.id}: kind ${media.kind} cannot be shown as evidence`);
      if (!media.caption.en || !media.caption.es || !media.alt.en || !media.alt.es) issues.push(`${game.slug}/${media.id}: caption and alt are required in EN and ES`);
      if (/render/.test(media.kind) && !/not gameplay|no es gameplay|not final|no es arte final/i.test(`${media.caption.en} ${media.caption.es}`)) issues.push(`${game.slug}/${media.id}: a render caption must say it is not gameplay or not final`);
      if (!media.base.startsWith(`/games/${game.slug}/`)) issues.push(`${game.slug}/${media.id}: media must live under /games/${game.slug}/`);
      if (Math.max(...media.widths) !== media.width) issues.push(`${game.slug}/${media.id}: width ${media.width} is not the largest rendition`);
      for (const width of media.widths) {
        const bytes = fileExists(`public${media.base}-${width}.webp`);
        if (!bytes) { issues.push(`${game.slug}/${media.id}: missing public${media.base}-${width}.webp`); continue; }
        const size = webpSize(bytes);
        if (!size) issues.push(`${game.slug}/${media.id}-${width}: not a WebP file`);
        else if (size.width !== width) issues.push(`${game.slug}/${media.id}-${width}: file is ${size.width}px wide`);
        else if (width === media.width && size.height !== media.height) issues.push(`${game.slug}/${media.id}: file is ${size.height}px high, catalog says ${media.height}`);
      }
    }
    if (game.demo && !DEMO_ALLOWLIST.has(game.demo.href)) issues.push(`${game.slug}: demo link ${game.demo.href} is not a verified public demo`);
    if (game.proof === "public-demo" && !game.demo) issues.push(`${game.slug}: public-demo proof needs its tested demo link`);
    if (game.proof !== "public-demo" && game.facts.every((fact) => !/not available|no disponible/i.test(fact.value.en + fact.value.es))) issues.push(`${game.slug}: state that no public demo is available`);
    if (!game.facts.some((fact) => /release|lanzamiento/i.test(fact.label.en + fact.label.es))) issues.push(`${game.slug}: state the release status`);
    for (const text of collectStrings(game)) if (FORBIDDEN.test(text)) issues.push(`${game.slug}: unproven claim in "${text}"`);
    for (const text of collectStrings(game)) if (/[A-Z]:[\\/]|\/Users\/|PROJECTS|\.png\b|localhost|127\.0\.0\.1/.test(text)) issues.push(`${game.slug}: private path or local reference in "${text}"`);
  });
  return issues;
}

const realFile = (path: string) => {
  const url = new URL(`../${path}`, import.meta.url);
  return existsSync(url) ? new Uint8Array(readFileSync(url)) : null;
};

check("catalog: four fixed games, labelled evidence, real files, no unproven claims", () => deepStrictEqual(validateCatalog(games, realFile), []));
check("page copy: EN and ES carry the same keys and no unproven claims", () => {
  deepStrictEqual(Object.keys(gamesCopy.en).sort(), Object.keys(gamesCopy.es).sort());
  for (const text of collectStrings(gamesCopy)) ok(!FORBIDDEN.test(text), `unproven claim in "${text}"`);
});

const header = read("src/ui/Header.tsx");
const footer = read("src/ui/SiteFooterV2.tsx");
const navOrder = ["home", "products", "games", "immersive", "work", "offer", "about"];
check("Header: seven sections in the owner order", () => {
  const items = [...header.matchAll(/\{ id: "([a-z]+)", to: "([^"]+)" \}/g)].map((match) => match[1]);
  deepStrictEqual(items, navOrder);
  ok(/item\.id === "games"\) return locale === "es" \? "Juegos" : "Games"/.test(header), "Games / Juegos label");
  ok(/cleanPathname === "\/games"\) return "\/games"/.test(header), "active state for /games");
});
check("Footer: seven ports in the same order, Spanish label Juegos", () => {
  const ports = [...footer.slice(footer.indexOf("const sectionLinks"), footer.indexOf("const serviceLinks")).matchAll(/to: "([^"]+)"/g)].map((match) => match[1]);
  deepStrictEqual(ports, ["/", "/products", "/games", "/immersive", "/work", "/offer", "/about"]);
  ok(/"\/games": "Juegos"/.test(footer), "Spanish footer label");
  ok(/repeat\(7, minmax\(0, 1fr\)\)/.test(read("src/ui/footer/studioFooter.css")), "seven-column axis");
});
check("Routes: /games and /es/games resolve through the shared module loader", () => {
  const app = read("src/App.tsx"); const modules = read("src/routing/routeModules.ts"); const routes = read("src/i18n/routes.ts");
  ok(/games: memoizeModuleLoader\(\(\) => import\("\.\.\/pages\/GamesPage"\)\)/.test(modules), "lazy GamesPage loader");
  ok(/\{ path: "\/games", key: "games", spanish: true \}/.test(modules), "route matcher with Spanish prefix");
  ok(/path="\/games"/.test(app) && /path="\/es\/games"/.test(app), "EN and ES routes");
  ok(/"\/games",/.test(routes), "Spanish public equivalent (locale switch and hreflang)");
});
check("Review gate: noindex in runtime and static HTML, absent from the sitemap", () => {
  const app = read("src/App.tsx"); const meta = read("src/seo/staticMetadata.ts"); const sitemap = read("public/sitemap.xml");
  ok(/games: \{[^}]*path: "\/games",[^}]*noIndex: true/.test(app), "runtime SEO noIndex (inside the games entry)");
  strictEqual((meta.match(/path: "\/(es\/)?games",[\s\S]*?noIndex: true/g) ?? []).length, 2, "static metadata noIndex for /games and /es/games");
  ok(!/\/games</.test(sitemap), "sitemap must not list /games before the owner authorises the public reveal");
});

if (process.argv.includes("--self-test")) {
  // Synthetic catalogs the guard must reject (tooling only; nothing here reaches production).
  const clone = () => structuredClone(games) as GameEntry[];
  // Mutations address games by slug, so they keep targeting the intended record whatever the display order.
  const at = (list: GameEntry[], slug: GameEntry["slug"]) => list.find((game) => game.slug === slug)!;
  const cases: [string, (list: GameEntry[]) => void, RegExp][] = [
    ["reordered games", (list) => list.reverse(), /exactly/],
    ["the previous order (TERRITORIES first)", (list) => { list.unshift(...list.splice(3, 1)); }, /exactly/],
    ["concept shown as evidence", (list) => { at(list, "project-mars-2158").media[0].kind = "concept"; }, /cannot be shown/],
    ["render caption without its limit", (list) => { const m = at(list, "black-start").media[0]; m.caption.en = "The garage."; m.caption.es = "El garaje."; }, /not gameplay/],
    ["missing image file", (list) => { at(list, "black-start").media[0].base = "/games/black-start/missing"; }, /missing/],
    ["wrong catalog height", (list) => { at(list, "black-start").media[0].height = 999; }, /high/],
    ["unverified demo link", (list) => { at(list, "black-start").demo = { href: "https://example.com/", label: { en: "Play", es: "Jugar" } }; }, /not a verified/],
    ["Steam claim", (list) => { at(list, "shift-world").premise.en = "Coming soon to Steam."; }, /unproven claim/],
    ["private path", (list) => { at(list, "project-territories").media[0].caption.en = "From D:/PROJECTS/x.png. Not final."; }, /private path/],
    ["portrait stage hero", (list) => { at(list, "shift-world").media.reverse(); }, /landscape hero/],
    ["stale index after reordering", (list) => { at(list, "project-territories").index = "01"; }, /index 01/],
  ];
  for (const [name, mutate, expected] of cases) check(`self-test rejects ${name}`, () => {
    const list = clone(); mutate(list);
    ok(validateCatalog(list, realFile).some((issue) => expected.test(issue)), `expected an issue matching ${expected}`);
  });
  check("self-test: the runtime noindex check fails when the games entry loses noIndex (other entries keep theirs)", () => {
    const app = read("src/App.tsx");
    const stripped = app.replace(/(games: \{[^}]*?)\s*noIndex: true,/, "$1");
    ok(stripped !== app && /noIndex: true/.test(stripped), "fixture keeps the other noIndex entries");
    ok(!/games: \{[^}]*path: "\/games",[^}]*noIndex: true/.test(stripped), "the check must not match another entry's noIndex");
  });
  check("self-test reads WebP sizes (VP8, VP8L, VP8X)", () => {
    const vp8 = new Uint8Array(30); vp8.set([82, 73, 70, 70], 0); vp8.set([87, 69, 66, 80], 8); vp8.set([86, 80, 56, 32], 12); vp8.set([0x20, 0x03, 0xc2, 0x01], 26);
    deepStrictEqual(webpSize(vp8), { width: 800, height: 450 });
    const vp8x = new Uint8Array(30); vp8x.set([82, 73, 70, 70], 0); vp8x.set([87, 69, 66, 80], 8); vp8x.set([86, 80, 56, 88], 12); vp8x.set([0x7f, 0x07, 0x00, 0x8f, 0x06, 0x00], 24);
    deepStrictEqual(webpSize(vp8x), { width: 1920, height: 1680 });
    const vp8l = new Uint8Array(30); vp8l.set([82, 73, 70, 70], 0); vp8l.set([87, 69, 66, 80], 8); vp8l.set([86, 80, 56, 76], 12); vp8l.set([0x2f, 0x1f, 0x03, 0x34, 0x01], 20);
    deepStrictEqual(webpSize(vp8l), { width: 800, height: 1233 });
  });
}

console.log(`GAMES_${process.argv.includes("--self-test") ? "SELF_TEST" : "VALIDATION"}=${failures.length ? "FAIL" : "PASS"} (${count - failures.length}/${count})`);
if (failures.length) process.exit(1);
