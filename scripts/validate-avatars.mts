import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import type { AvatarId, AvatarProfile } from "../src/data/avatarProfiles.ts";
import type { CharacterMedia } from "../src/data/avatarMedia.ts";

// AI Digital Humans guard (AVATARS-01, extended in AVATARS-02). Exactly the eight owner-approved identities in owner order,
// shipped bytes equal to the approved derivatives, neutral public paths, owner-editable stage names, honest status labels and
// no unproven claims, hash deep links, the eighth Header/Footer section, EN/ES routing, the review gate (noindex, absent from
// the sitemap), and the recorded-media gate: only the private pilot, only in a flagged build, with clips that match their files.
//   node --experimental-strip-types scripts/validate-avatars.mts [--self-test]

let count = 0;
const failures: string[] = [];
function check(name: string, run: () => void) {
  count++;
  try { run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push(`${name}: ${error instanceof Error ? error.message : error}`); console.error(`FAIL ${failures.at(-1)}`); }
}

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const { avatarProfiles, avatarIndexFromHash } = await import("../src/data/avatarProfiles.ts");
const { avatarsCopy } = await import("../src/data/avatarsCopy.ts");
const { privatePilotMedia } = await import("../src/data/avatarPilotMedia.ts");
const { privateCastMedia } = await import("../src/data/avatarCastMedia.ts");

// The owner's approved web derivatives in owner order 01–08 (AVATARS-01 pack SHA256_MANIFEST.txt, verified 2026-10-22) and
// the AVATARS-02 cast-library crops of the same masters: [portrait SHA-256, thumbnail SHA-256, card SHA-256, portrait size].
// The hashes are the identity proof; the archive's descriptive folder names stay out of the repository and the bundle. The
// registry may never point at other bytes: replacing a face means a new owner approval and a new entry here.
const APPROVED = [
  ["4312b2e347b91a59944c49ea3bae244d9a75ada087950a47333974c95100166f", "d401e9b71ff784abcc8c709644e613b84be5b094c3c606e9a48312b43e89a08d", "8299a60e6e399e5944b8c848dd1a28101ec02e477645bec1c91f453fc1b1a015", 1536],
  ["a18da6d3ac18d63e2d1300f3795e714fb0f10ade90b7095875b89c8715727bbb", "b63ffc7736737670742f3fb1625d4ee9fd64b99f40ee75f9ce906bd5aa4d70dc", "10a6f8aeb44bcb2f44fdb8548995d9b133a9db207c8f04d5fc4170b025d46e1d", 1254],
  ["be7cbea43636b3cda3ec99fccc5012c8575a9714db805a04bbc1dd990a3e032d", "418ef435f630bbe231f26d1cb1b01ea946b5a5596e0c4dfb4c1996d74580fb17", "40902d5c9d9930a776173337bf72836e32855ddf2aedc45843aaaf940bffccda", 1254],
  ["c28088712095f487b405eda62d16bc3d77a32d6876299a6f27ad45ec85645d43", "7fa89ca2a5bb414eb84d9e3f929925cb22a1119864c5289a39fd1e813766f124", "fc11e186b8f2245a2bf07599ffb1c427d2178524cb12475d166f2f3c30fe5397", 1254],
  ["05ddb2b8329f86697d952965d162ba82cd7d014eac6ea173beb21d126a2a3168", "3a45ce686500919706101132ee6d7d4e82ba9741d9f9805a213ff38657516819", "36bc3edb222ed3b0825d1eeada43c30122d6492e8109e81eeb1a55a66b18bc8c", 1254],
  ["6337ff354dd0b6f69e7e2f14de9479b7c6a5cc2fcb1e5b40853031faecd4be1b", "ff5e044834da79844b74a41f895e1dafc1994ed64d424de7255de0df09b5ab9b", "bcd0306c6f0ff4e5315b14f8e1675da91fb35bc9e6f632aba999ffcb17764fc3", 1254],
  ["d7dca2e0c2a0c51a888b8f8aab7ff04d2b74e59e89aca9ace3029d90dda96bdb", "13bb5bacb51e1e5028b9a5a18c90591f09021ceb6ba953b40b859d1e3a7e0c2d", "3ff0ab904a7fdfda143b3d1c7055d0b344668cb06b0f9d81d2e791cd98959d94", 1254],
  ["809661193fe625f21e196acfb43d0298697835c57356b90be9214160713f968d", "6cf93f0d277af21bfed46795094091fed5c40fb4edbb1a73686abc7b686652bd", "16d07d1877bdd43d48bbd545ff3338bc81c902c088996c16a9828cd1a81fb6e8", 1254],
] as const;

// AVATARS-03 authorizes private samples for the same eight approved identities, never public release.
const PILOT_IDS: readonly AvatarId[] = avatarProfiles.map((profile) => profile.id);

// Claims the page must not make without proof (EN and ES): live, real-time or autonomous agents, lip-sync, finished 3D,
// availability and dates, money, waitlists, clients and deployments. (Currency signs are not word characters, so they sit
// outside the word-boundary group.)
const CLAIM = new RegExp(String.raw`\b(?:24\/7|autonomous|aut[oó]nom[oa]s?|real[- ]?time|tiempo real|lip[- ]?sync\w*|sincroniza\S*\s+labial|` +
  String.raw`live (?:agents?|avatars?|conversations?|ai|chat|demos?|3d|service|humans?)|en (?:directo|vivo)|fully (?:functional|interactive|autonomous)|` +
  String.raw`totalmente funcional\w*|available (?:now|today|from|in|on)|disponible (?:ya|ahora|desde|en)|out now|launch(?:es|ed|ing)? (?:on|in)|release date|` +
  String.raw`fecha de lanzamiento|pric(?:e|es|ing)|precios?|waitlist|lista de espera|pre-?orders?|subscribe|subscription|try (?:it |the )?(?:live|now|demo|3d)|` +
  String.raw`book a (?:demo|call)|trusted by|used by|our clients|clients|nuestros clientes|deployed|desplegad\w*|in production|chat with|chatea con|` +
  String.raw`talk to (?:any|our|her|him|them)|ask (?:her|him|them|it|us) anything|habla con cualquier\w*|pregúnta\S* (?:lo que (?:sea|quieras)|cualquier cosa)|` +
  String.raw`20\d\d|EUR|USD|GBP)\b|[€£$]\s?\d`, "gi");
// A negation excuses a term only when it governs it: in the same clause (after the last conjunction), at most five words
// before it, and not as "no other" / "not just", which assert the claim ("Not a live agent." passes; "No code needed and
// real-time lip-sync included." does not).
const NEGATION = /\b(?:not|no|never|nor|without|ni|sin|nunca|tampoco)\b(?!\s+(?:other|else|just|only|more|less|otro|otra|otros|otras|solo|sólo|más)\b)/i;
const CLAUSE_BREAK = /[.!?;:,·—]|\b(?:and|but|with|plus|while|y|pero|con)\b/i;

/** The first unproven claim in a text, or null. */
export function unprovenClaim(text: string): string | null {
  for (const match of text.matchAll(CLAIM)) {
    const clause = text.slice(0, match.index).split(CLAUSE_BREAK).pop() ?? "";
    if (!NEGATION.test(clause.trim().split(/\s+/).slice(-5).join(" "))) return match[0];
  }
  return null;
}
// Public paths and labels must not carry the archive's descriptive words, nor its folder names ("06_Word_…").
const DESCRIPTORS = /asian|platinum|spanish|redhead|freckles|black|american|cornrows|indian|french|glasses|ukrainian|woman|blue[_ -]?eyes/i;
const ARCHIVE_FOLDER = /\b0\d_[A-Z][A-Za-z]+_/;

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

const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

export function validateRegistry(list: readonly AvatarProfile[], readPublic: (path: string) => Uint8Array | null) {
  const issues: string[] = [];
  if (list.length !== APPROVED.length) issues.push(`exactly ${APPROVED.length} identities are approved, the registry has ${list.length}`);
  const names = list.map((profile) => profile.name);
  list.forEach((profile, index) => {
    const approved = APPROVED[index];
    const n = String(index + 1).padStart(2, "0");
    if (!approved) return;
    const [portraitHash, thumbHash, cardHash, size] = approved;
    if (profile.id !== `avatar-${n}` || profile.displayNumber !== n) issues.push(`${profile.id}: position ${index + 1} must be avatar-${n} / ${n}`);
    if (profile.portraitSha256 !== portraitHash || profile.thumbSha256 !== thumbHash || profile.cardSha256 !== cardHash) issues.push(`${profile.id}: asset hashes differ from the approved derivatives (owner order)`);
    if (profile.portraitSize !== size) issues.push(`${profile.id}: portrait size ${profile.portraitSize}, approved ${size}`);
    const base = `/avatars/avatar-${n}/`;
    if (profile.portraitWebp !== `${base}portrait.webp` || profile.thumbWebp !== `${base}thumb_320.webp` || profile.cardWebp !== `${base}card.webp`) issues.push(`${profile.id}: assets must live under ${base}`);
    for (const [path, hash, w, h] of [[profile.portraitWebp, portraitHash, size, size], [profile.thumbWebp, thumbHash, 320, 320], [profile.cardWebp, cardHash, 800, 1000]] as const) {
      const bytes = readPublic(path);
      if (!bytes) { issues.push(`${profile.id}: missing public${path}`); continue; }
      if (sha256(bytes) !== hash) issues.push(`${profile.id}: public${path} is not the approved file`);
      const dims = webpSize(bytes);
      if (!dims || dims.width !== w || dims.height !== h) issues.push(`${profile.id}: public${path} is not ${w}x${h}`);
    }
    if (profile.status !== "visual-concept") issues.push(`${profile.id}: status ${profile.status} is not proven (visual concepts only)`);
    if (JSON.stringify(profile.allowedActions) !== JSON.stringify(["request-project"])) issues.push(`${profile.id}: only request-project is allowed`);
    if (!/^\d{1,3}% \d{1,3}%$/.test(profile.imageFocalPoint) || profile.stageZoom < 1 || profile.stageZoom > 1.3) issues.push(`${profile.id}: framing out of range`);
    if (!profile.role.en || !profile.role.es || !profile.scenario.en || !profile.scenario.es) issues.push(`${profile.id}: role and scenario are required in EN and ES`);
    // Stage names: a single given-name-style word, unique in the cast; only the founder carries the owner's own name.
    if (!/^[A-Z][a-z]{1,15}$/.test(profile.name)) issues.push(`${profile.id}: stage name "${profile.name}" must be one capitalised word`);
    if (names.indexOf(profile.name) !== index) issues.push(`${profile.id}: stage name "${profile.name}" is used twice`);
    if (profile.nameStatus !== (index === 0 ? "owner" : "provisional")) issues.push(`${profile.id}: name status ${profile.nameStatus}: only the founder carries the owner's name; the others are provisional proposals`);
    for (const text of collectStrings({ role: profile.role, scenario: profile.scenario })) {
      const claim = unprovenClaim(text);
      if (claim) issues.push(`${profile.id}: unproven claim "${claim}" in "${text}"`);
      if (DESCRIPTORS.test(text)) issues.push(`${profile.id}: descriptive archive words in a public label "${text}"`);
      if (names.some((name) => new RegExp(`\\b${name}\\b`).test(text)) || /^(?!Founder\b|Fundador\b)[A-Z][a-z]+ \//.test(text)) issues.push(`${profile.id}: a person's name inside a role or scenario "${text}" (roles stay editorial working labels)`);
    }
    if (DESCRIPTORS.test(profile.portraitWebp + profile.thumbWebp + profile.cardWebp)) issues.push(`${profile.id}: descriptive archive words in a public path`);
    // Every registry string ships in the public bundle (folder names or descriptions in any field would too).
    const leaked = collectStrings(profile).find((text) => DESCRIPTORS.test(text) || ARCHIVE_FOLDER.test(text));
    if (leaked) issues.push(`${profile.id}: descriptive archive words ship in the bundle "${leaked}"`);
    if (/[A-Z]:[\\/]|\/Users\/|PROJECTS|\.png\b|localhost|127\.0\.0\.1/.test(collectStrings(profile).join(" "))) issues.push(`${profile.id}: private path or local reference`);
  });
  return issues;
}

/** The private pilot manifest against the rules and, where the review files are present, against the files themselves. */
export function validatePilotMedia(media: Partial<Record<AvatarId, CharacterMedia>>, readPrivate: (url: string) => Uint8Array | null, requireFiles = false) {
  const issues: string[] = [];
  const sizes = Object.fromEntries(avatarProfiles.map((profile) => [profile.id, profile.portraitSize]));
  for (const [key, entry] of Object.entries(media) as [AvatarId, CharacterMedia][]) {
    if (!PILOT_IDS.includes(key)) issues.push(`${key}: not an approved cast identity`);
    if (entry.avatarId !== key) issues.push(`${key}: entry names ${entry.avatarId}`);
    if (entry.availability !== "private-pilot") issues.push(`${key}: availability ${entry.availability} (only private-pilot until the owner clears publication)`);
    const clips = [["idle", entry.idle] as const, ...Object.entries(entry.spoken ?? {}).map(([locale, clip]) => [`spoken.${locale}`, clip] as const)];
    if (!clips.some(([, clip]) => Boolean(clip))) issues.push(`${key}: an entry without clips`);
    for (const [label, clip] of clips) {
      if (!clip) continue;
      if (!clip.src.startsWith(`/avatars-private/${key}/`)) issues.push(`${key} ${label}: clip outside the private review folder (${clip.src})`);
      if (clip.rightsStatus !== "private-only") issues.push(`${key} ${label}: rights ${clip.rightsStatus} (private-only until cleared)`);
      if (clip.width !== sizes[key] || clip.height !== sizes[key]) issues.push(`${key} ${label}: ${clip.width}x${clip.height} does not match the ${sizes[key]}px portrait frame`);
      if (!/^[0-9a-f]{64}$/.test(clip.sha256) || clip.bytes <= 0) issues.push(`${key} ${label}: missing hash or size`);
      if (clip.fps !== undefined && (!Number.isFinite(clip.fps) || clip.fps <= 0)) issues.push(`${key} ${label}: invalid frame rate`);
      const bytes = readPrivate(clip.src);
      if (!bytes && requireFiles) issues.push(`${key} ${label}: missing private file ${clip.src}`);
      if (bytes && (sha256(bytes) !== clip.sha256 || bytes.length !== clip.bytes)) issues.push(`${key} ${label}: ${clip.src} does not match its recorded hash and size`);
    }
    if (entry.idle && (entry.idle.durationSec < 6 || entry.idle.durationSec > 8.5)) issues.push(`${key} idle: ${entry.idle.durationSec}s (a 6–8 s loop)`);
    for (const [locale, clip] of Object.entries(entry.spoken ?? {})) {
      if (!clip) continue;
      if (clip.durationSec < 10 || clip.durationSec > 18.5) issues.push(`${key} spoken.${locale}: ${clip.durationSec}s (10–18 s)`);
      if (locale !== "en" && locale !== "es") issues.push(`${key} spoken.${locale}: unsupported audio locale`);
      if (clip.audioLocale !== locale) issues.push(`${key} spoken.${locale}: audio is ${clip.audioLocale}`);
      const claim = unprovenClaim(clip.transcript);
      if (claim) issues.push(`${key} spoken.${locale}: unproven claim "${claim}" in the transcript`);
      // AVATARS-03 uses a persistent UI disclosure; native scripts need not repeat boilerplate aloud.
      if (!clip.transcript.trim()) issues.push(`${key} spoken.${locale}: transcript is empty`);
      if (!clip.captions[clip.audioLocale]) issues.push(`${key} spoken.${locale}: captions in the audio language are required`);
      for (const [captionLocale, track] of Object.entries(clip.captions)) {
        if (!track) continue;
        if (captionLocale !== track.srcLang) issues.push(`${key} spoken.${locale}: caption language differs from its slot`);
        if (!track.src.startsWith(`/avatars-private/${key}/`) || !track.src.endsWith(".vtt")) issues.push(`${key} spoken.${locale}: caption track outside the private folder (${track.src})`);
        const vtt = readPrivate(track.src);
        if (!vtt) { if (requireFiles) issues.push(`${key} spoken.${locale}: missing private file ${track.src}`); continue; }
        const text = new TextDecoder().decode(vtt);
        if (!text.startsWith("WEBVTT")) issues.push(`${key} spoken.${locale}: ${track.src} is not WebVTT`);
        if (track.srcLang === clip.audioLocale) {
          const words = (s: string) => s.normalize("NFC").toLowerCase().replace(/’/g, "'").replace(/[^\p{L}\p{N}' ]+/gu, " ").split(/\s+/).filter(Boolean).join(" ");
          const cues = text.split(/\r?\n\r?\n/).slice(1).map((block) => block.split(/\r?\n/).slice(2).join(" ")).join(" ");
          if (words(cues) !== words(clip.transcript)) issues.push(`${key} spoken.${locale}: captions do not match the transcript`);
        }
      }
    }
  }
  return issues;
}

const realPublic = (path: string) => {
  const url = new URL(`../public${path}`, import.meta.url);
  return existsSync(url) ? new Uint8Array(readFileSync(url)) : null;
};
// The private review files live in the git-ignored QA folder; in a clean checkout they are absent and only the rules apply.
const realPrivate = (url: string) => {
  for (const task of ["avatars-03", "avatars-02"]) {
    const file = new URL(`../qa-screenshots/${task}/private-media${url}`, import.meta.url);
    if (existsSync(file)) return new Uint8Array(readFileSync(file));
  }
  return null;
};

check("registry: the eight approved identities in owner order, approved bytes, editable stage names, honest status", () => deepStrictEqual(validateRegistry(avatarProfiles, realPublic), []));

check("assets: only the portrait, thumbnail and cast card per identity ship (no look-dev cutouts, no clips, nothing else)", () => {
  const root = new URL("../public/avatars/", import.meta.url);
  deepStrictEqual(readdirSync(root).sort(), avatarProfiles.map((profile) => profile.id));
  for (const profile of avatarProfiles) deepStrictEqual(readdirSync(new URL(`${profile.id}/`, root)).sort(), ["card.webp", "portrait.webp", "thumb_320.webp"]);
  ok(!existsSync(new URL("../public/avatars-private/", import.meta.url)), "private clips never sit in public/");
});

check("media: approved cast only, private-only rights, exact audio locales, clips and captions matching their files", () => {
  for (const media of [privatePilotMedia, privateCastMedia]) deepStrictEqual(validatePilotMedia(media, realPrivate, process.argv.includes("--require-media-files")), []);
  for (const entry of Object.values(privateCastMedia)) {
    for (const clip of [entry.idle, ...Object.values(entry.spoken ?? {})]) {
      if (clip) ok(Number.isFinite(clip.fps) && clip.fps! > 0, `${entry.avatarId}: new cast files require measured fps`);
    }
  }
  const gate = read("src/data/avatarMedia.ts");
  ok(/const privatePreview = import\.meta\.env\.VITE_AVATARS_MEDIA === "private-preview";/.test(gate), "media gate on the build flag");
  ok(/avatarMedia: Partial<Record<AvatarId, CharacterMedia>> = privatePreview \? mergePrivateMedia\(\) : \{\};/.test(gate), "a default build carries no clip");
  const dist = new URL("../dist/", import.meta.url);
  if (!existsSync(dist)) {
    console.log("NOTE media: no ./dist to scan; run npm run build, then this check also proves the build carries no private clip");
    return;
  }
  const leaks = privateMediaIn(builtTexts(dist));
  deepStrictEqual(leaks, [], "the built dist references no private clip, caption or transcript (rebuild without VITE_AVATARS_MEDIA before release)");
});

check("copy: EN and ES carry the same structure, the truth labels, and no unproven claims", () => {
  const shape = (value: unknown): unknown => Array.isArray(value) ? value.map(shape) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)])) : typeof value;
  deepStrictEqual(shape(avatarsCopy.en), shape(avatarsCopy.es));
  for (const text of collectStrings(avatarsCopy)) { const claim = unprovenClaim(text); ok(!claim, `unproven claim "${claim}" in "${text}"`); }
  ok(/speaking demos are in development/i.test(avatarsCopy.en.disclaimer) && /en desarrollo/i.test(avatarsCopy.es.disclaimer), "concept disclaimer");
  ok(/^Character concept/.test(avatarsCopy.en.cast.status) && /^Concepto de personaje/.test(avatarsCopy.es.cast.status), "per-identity status");
  strictEqual(avatarsCopy.en.cast.status, avatarsCopy.en.presence.concept, "one status wording on the stage and in the facts (EN)");
  strictEqual(avatarsCopy.es.cast.status, avatarsCopy.es.presence.concept, "one status wording on the stage and in the facts (ES)");
  ok(/^Private pilot/.test(avatarsCopy.en.cast.statusPilot) && /^Piloto privado/.test(avatarsCopy.es.cast.statusPilot), "pilot status");
  ok(/not a live agent/i.test(avatarsCopy.en.cast.disclosure) && /no es un agente en directo/i.test(avatarsCopy.es.cast.disclosure), "disclosure");
  ok(/recorded/i.test(avatarsCopy.en.presence.recorded) && /grabada/i.test(avatarsCopy.es.presence.recorded), "the sample is labelled recorded");
  ok(/not available in this language/i.test(avatarsCopy.en.presence.unavailable) && /no disponible en este idioma/i.test(avatarsCopy.es.presence.unavailable), "missing language audio has a localized status");
  ok(/^Character concept/.test(avatarsCopy.en.presence.concept) && /^Concepto de personaje/.test(avatarsCopy.es.presence.concept), "characters without a clip say so");
  ok(/AI-generated/.test(avatarsCopy.en.library.note) && /generados con IA/.test(avatarsCopy.es.library.note) && /working proposals/.test(avatarsCopy.en.library.note), "library note: AI-generated, names are proposals");
  ok(/coming soon/i.test(avatarsCopy.en.horizon.flag) && /próximamente/i.test(avatarsCopy.es.horizon.flag), "3D coming soon flag");
  ok(/not a render/i.test(avatarsCopy.en.horizon.figureNote) && /no un render/i.test(avatarsCopy.es.horizon.figureNote), "the 3D figure is labelled as a diagram");
  ok(/scripted text tour.*homepage/i.test(avatarsCopy.en.ledger.levels[0].note ?? ""), "the HOME text tour is distinguished from speaking media");
  ok(/speaking demos remain in private review/i.test(avatarsCopy.en.ledger.levels[0].note ?? ""), "speaking media remains private");
  ok(/recorrido de texto predefinido.*inicio/i.test(avatarsCopy.es.ledger.levels[0].note ?? "") && /voz grabada.*revisión privada/i.test(avatarsCopy.es.ledger.levels[0].note ?? ""), "Spanish makes the same public text / private speech distinction");
  ok(/not offered as a live service/i.test(avatarsCopy.en.ledger.levels[1].body), "conversational presence is R&D, not a service");
});

check("deep links: #avatar-0N selects, anything else falls back to the first identity", () => {
  strictEqual(avatarIndexFromHash("#avatar-01"), 0);
  strictEqual(avatarIndexFromHash("#avatar-05"), 4);
  strictEqual(avatarIndexFromHash("#avatar-08"), 7);
  strictEqual(avatarIndexFromHash("#AVATAR-03"), 2);
  // Never throws: the page reads the hash during its first render.
  for (const bad of ["", "#", "#avatar-09", "#avatar-5", "#avatars-horizon", "#avatar-05?x", "#%E0%A4%A", "#%"]) strictEqual(avatarIndexFromHash(bad), -1, `${bad} must fall back`);
});

check("page: explicit selection, no autoplaying sound, muted idle only when allowed, no idle loops of its own", () => {
  const page = read("src/pages/AvatarsPage.tsx");
  const css = read("src/ui/avatars/avatarsPage.css");
  const stage = read("src/ui/avatars/StagePresence.tsx");
  const hook = read("src/ui/avatars/useStagePresence.ts");
  const library = read("src/ui/avatars/CastLibrary.tsx");
  ok(!/<video|<audio|autoPlay|autoplay|\.play\(/.test(page + library), "the page and the library render no media of their own");
  // The library scroll uses one frame; idle attachment yields two frames to the poster. Neither callback recurs.
  const handOff = /requestAnimationFrame\(\(\) => \{\s*const target = document\.getElementById\(window\.matchMedia\(DESKTOP\)\.matches \? "avatars-chamber" : "avatars-stage"\);\s*target\?\.scrollIntoView\(\{ behavior: scrollBehavior\(\), block: "start" \}\);\s*\}\);/;
  ok(handOff.test(page), "the library hand-off scrolls once, on the next frame");
  ok(!/setInterval|setTimeout|addEventListener\(["']scroll/.test(page.replace(handOff, "") + stage + hook + library), "no timers or scroll listeners");
  ok(!/requestAnimationFrame/.test(page.replace(handOff, "") + stage + library) && (hook.match(/requestAnimationFrame\(/g) ?? []).length === 2 && /cancelAnimationFrame\(frame\)/.test(hook), "only the cancellable two-frame poster yield attaches media");
  strictEqual((stage.match(/<video/g) ?? []).length, 2, "one idle and one spoken video element");
  ok(!/<audio|autoPlay|autoplay/.test(stage + hook), "nothing autoplays by attribute");
  ok(/muted\s+loop\s+playsInline\s+preload="none"/.test(stage), "the idle loop is muted, inline and not preloaded");
  ok((stage.match(/preload="none"/g) ?? []).length === 2, "neither clip is requested before it is needed");
  ok(/node\.muted = true;\s*node\.play\(\)/.test(hook), "the idle loop plays muted");
  ok(/prefers-reduced-motion: reduce/.test(hook) && /saveData/.test(hook) && /IntersectionObserver/.test(hook) && /visibilitychange/.test(hook), "idle only with motion allowed, without Save-Data, on screen and in a visible tab");
  // Defensive today: the Sound dock keeps the ambient off outside Immersive, so on this route it never runs.
  ok(/stopAmbient\(\)/.test(hook) && /enableAmbient\(\)/.test(hook), "a running site ambient would fade out while speaking and come back");
  ok(/removeAttribute\("src"\)/.test(hook), "leaving an actor releases its files");
  const onPlay = stage.match(/const onPlay = \(\) => \{([^}]*)\};/);
  ok(onPlay !== null && /\bstart\(\)/.test(onPlay[1]) && (stage.match(/\bstart\(\)/g) ?? []).length === 1 && (stage.match(/onClick=\{onPlay\}/g) ?? []).length === 2
    && !/useEffect\([^)]*\bstart\(/.test(hook), "the introduction starts only from a click (Play / Replay, Try again)");
  ok(/role="tablist"/.test(page) && /aria-selected=\{index === active\}/.test(page) && /tabIndex=\{index === active \? 0 : -1\}/.test(page), "roving tablist");
  ok(/avatarIndexFromHash\(location\.hash\)/.test(page) && /history\.replaceState/.test(page), "hash in, replaceState out");
  ok(/@media \(prefers-reduced-motion: reduce\)/.test(css) && !/animation:[^;]*infinite/.test(css), "reduced motion and no infinite animation");
  ok(/onClick=\{onOpenProject\}/.test(page) && !/href="mailto:|fetch\(/.test(page + stage + hook + library), "commercial action through the existing Project Drawer only");
  for (const profile of avatarProfiles) ok(!new RegExp(`["'>]${profile.name}["'<]`).test(page + library + stage), `${profile.name} comes from the registry, not from markup`);
  ok(/onSelect=\{showOnStage\}/.test(page) && /aria-current=\{selected \? "true" : undefined\}/.test(library), "library cards select the identity on stage");
});

// Everything a browser could load from a build: scripts and HTML pages (any depth).
function builtTexts(root: URL): { file: string; text: string }[] {
  const out: { file: string; text: string }[] = [];
  const walk = (dir: URL, rel: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(new URL(`${entry.name}/`, dir), `${rel}${entry.name}/`);
      else if (/\.(m?js|html|css|json|map|txt|vtt)$/.test(entry.name)) out.push({ file: `${rel}${entry.name}`, text: readFileSync(new URL(entry.name, dir), "utf8") });
    }
  };
  walk(root, "");
  return out;
}

// Markers of the private pilot: its URL folder, its spoken clip and caption files, and the start of its transcript.
function privateMediaIn(files: { file: string; text: string }[]) {
  const markers = ["avatars-private", "answer-en.mp4", "answer-en.en.vtt", "answer-en.es.vtt", "intro-en.mp4", "intro-es.mp4", "BRENYCH_WORK", "a pre-recorded demonstration of how a virtual presenter"];
  return files.flatMap(({ file, text }) => markers.filter((marker) => text.includes(marker)).map((marker) => `${file}: ${marker}`));
}

const header = read("src/ui/Header.tsx");
const footer = read("src/ui/SiteFooterV2.tsx");
check("navigation: Avatars is the eighth section, after Products, in Header and Footer", () => {
  const items = [...header.matchAll(/\{ id: "([a-z]+)", to: "([^"]+)" \}/g)].map((match) => match[1]);
  deepStrictEqual(items, ["home", "products", "avatars", "games", "immersive", "work", "offer", "about"]);
  ok(/item\.id === "avatars"\) return locale === "es" \? "Avatares" : "Avatars"/.test(header), "Avatars / Avatares label");
  ok(/cleanPathname === "\/avatars" \|\| cleanPathname\.startsWith\("\/avatars\/"\)\) return "\/avatars"/.test(header), "active state with and without the trailing slash");
  ok(/\^\\\/avatars\\\/\?\$\/\.test\(cleanPathname\) \? window\.location\.hash/.test(header), "locale switch keeps the selected identity, with or without the slash");
  const ports = [...footer.slice(footer.indexOf("const sectionLinks"), footer.indexOf("const serviceLinks")).matchAll(/to: "([^"]+)"/g)].map((match) => match[1]);
  deepStrictEqual(ports, ["/", "/products", "/avatars", "/games", "/immersive", "/work", "/offer", "/about"]);
  ok(/"\/avatars": "Avatares"/.test(footer), "Spanish footer label");
  ok(/repeat\(8, minmax\(0, 1fr\)\)/.test(read("src/ui/footer/studioFooter.css")), "eight-port axis");
  ok(!/\/contact/.test(header + footer), "no Contact route");
  // Measured with eight sections: inline links only from 1400px (the two-line brand met the nav below that, EN and ES).
  ok(/@media \(min-width: 1024px\) and \(max-width: 1399px\) \{\s*\.site-header \.home-compact-header-grid/.test(read("src/styles/header-layout.css")), "compact header (Menu) up to 1399px");
});

check("routes: /avatars and /es/avatars resolve through the shared module loader", () => {
  const app = read("src/App.tsx"); const modules = read("src/routing/routeModules.ts"); const routes = read("src/i18n/routes.ts");
  ok(/avatars: memoizeModuleLoader\(\(\) => import\("\.\.\/pages\/AvatarsPage"\)\)/.test(modules), "lazy AvatarsPage loader");
  ok(/\{ path: "\/avatars", key: "avatars", spanish: true \}/.test(modules), "route matcher with the Spanish prefix");
  ok(/path="\/avatars"/.test(app) && /path="\/es\/avatars"/.test(app), "EN and ES routes");
  ok(/"\/avatars",/.test(routes), "Spanish public equivalent (locale switch and hreflang)");
  const tokens = read("src/ui/header/headerThemeTokens.ts");
  for (const scene of ["avatars-chamber", "avatars-ledger", "avatars-horizon", "avatars-closing"]) ok(tokens.includes(`"${scene}": {`), `header scene ${scene}`);
  ok(/pathname === "\/avatars" \|\| pathname === "\/avatars\/"/.test(tokens), "route mood with and without the trailing slash");
});

// Every other public string about the page: runtime and static SEO (EN and ES) and the Header's section descriptions.
function avatarsSeoStrings() {
  const quoted = (block = "") => [...block.matchAll(/"([^"]{8,})"/g)].map((match) => match[1]);
  const meta = read("src/seo/staticMetadata.ts");
  const start = meta.indexOf("const avatarsMetadata");
  return [
    ...quoted(read("src/App.tsx").match(/avatars: \{[^}]*\}/)?.[0]),
    ...quoted(start < 0 ? "" : meta.slice(start, meta.indexOf("];", start))),
    ...quoted(read("src/data/spanishContent.ts").match(/"\/avatars": \{[^}]*\}/)?.[0]),
    ...[...read("src/ui/Header.tsx").matchAll(/^\s*avatars: "([^"]+)",?$/gm)].map((match) => match[1]),
  ];
}

check("claims: SEO titles and descriptions (EN and ES) and the Header descriptions make no unproven claim", () => {
  const strings = avatarsSeoStrings();
  ok(strings.length >= 12, `expected the avatars SEO and Header strings, found ${strings.length}`);
  for (const text of strings) { const claim = unprovenClaim(text); ok(!claim, `unproven claim "${claim}" in "${text}"`); }
});

check("review gate: noindex in runtime and static HTML for both locales, absent from the sitemap, contract titles", () => {
  const app = read("src/App.tsx"); const meta = read("src/seo/staticMetadata.ts"); const sitemap = read("public/sitemap.xml");
  const spanish = read("src/data/spanishContent.ts");
  ok(/avatars: \{[^}]*path: "\/avatars",[^}]*noIndex: true/.test(app), "runtime SEO noIndex (inside the avatars entry)");
  strictEqual((meta.match(/path: "\/(es\/)?avatars",[\s\S]*?noIndex: true/g) ?? []).length, 2, "static metadata noIndex for /avatars and /es/avatars");
  ok(!/avatars/.test(sitemap), "sitemap must not list Avatars before the owner authorises publication");
  ok(app.includes('title: "AI Digital Humans & Avatars | Brenych Studio"') && meta.includes('title: "AI Digital Humans & Avatars | Brenych Studio"'), "EN title");
  ok(spanish.includes('title: "Avatares y humanos digitales con IA | Brenych Studio"'), "ES title");
});

if (process.argv.includes("--self-test")) {
  // Synthetic registries the guard must reject (tooling only; nothing here reaches production).
  const clone = () => structuredClone(avatarProfiles) as AvatarProfile[];
  const cases: [string, (list: AvatarProfile[]) => void, RegExp][] = [
    ["a reordered cast", (list) => list.reverse(), /position|hashes differ/],
    ["an archive folder name in the bundle", (list) => { (list[1] as AvatarProfile & { sourceFolder?: string }).sourceFolder = "02_Example_Name_Descriptor"; }, /ship in the bundle/],
    ["a ninth identity", (list) => { list.push({ ...list[0], id: "avatar-08" }); }, /exactly 8/],
    ["a missing identity", (list) => { list.pop(); }, /exactly 8/],
    ["a substituted face", (list) => { list[3].portraitSha256 = "0".repeat(64); }, /hashes differ/],
    ["a substituted cast card", (list) => { list[5].cardSha256 = "0".repeat(64); }, /hashes differ/],
    ["a missing file", (list) => { list[2].thumbWebp = "/avatars/avatar-03/missing.webp"; }, /assets must live|missing/],
    ["a live-agent status", (list) => { (list[1] as { status: string }).status = "live-agent"; }, /not proven/],
    ["a 24/7 claim", (list) => { list[5].scenario.en = "A 24/7 concierge."; }, /unproven claim/],
    ["an archive descriptor in a label", (list) => { list[6].role.en = "French Specialist"; }, /descriptive archive words/],
    ["a descriptor as a stage name", (list) => { list[3].name = "Redhead"; }, /descriptive archive words ship/],
    ["an invented biography name in a role", (list) => { list[7].role.en = "Olena / Client Guide"; }, /person's name inside a role/],
    ["a cast name inside a scenario", (list) => { list[4].scenario.en = "Aria's hotel desk"; }, /person's name inside a role/],
    ["a duplicated stage name", (list) => { list[6].name = "Leo"; }, /used twice/],
    ["the owner's name status on a stage character", (list) => { list[3].nameStatus = "owner"; }, /name status/],
    ["a stage name that is not one word", (list) => { list[2].name = "Leo the Advisor"; }, /one capitalised word/],
    ["a private path", (list) => { list[2].scenario.en = "From D:/PROJECTS/x.png"; }, /private path/],
  ];
  for (const [name, mutate, expected] of cases) check(`self-test rejects ${name}`, () => {
    const list = clone(); mutate(list);
    ok(validateRegistry(list, realPublic).some((issue) => expected.test(issue)), `expected an issue matching ${expected}`);
  });
  // Synthetic media manifests the media gate must reject.
  const mediaClone = () => structuredClone(privatePilotMedia) as Partial<Record<AvatarId, CharacterMedia>>;
  const mediaCases: [string, (media: Partial<Record<AvatarId, CharacterMedia>>) => void, RegExp][] = [
    ["a clip for an identity outside the approved cast", (media) => { media["avatar-09" as AvatarId] = { ...structuredClone(media["avatar-02"]!), avatarId: "avatar-09" as AvatarId }; }, /not an approved cast identity/],
    ["public rights on a private clip", (media) => { media["avatar-02"]!.idle!.rightsStatus = "approved-public"; }, /private-only until cleared/],
    ["a clip in public/", (media) => { media["avatar-02"]!.idle!.src = "/avatars/avatar-02/idle.mp4"; }, /outside the private review folder/],
    ["an approved-demo label before clearance", (media) => { media["avatar-02"]!.availability = "approved-demo"; }, /only private-pilot/],
    ["a 3-second idle", (media) => { media["avatar-02"]!.idle!.durationSec = 3; }, /6–8 s loop/],
    ["a speech transcript claiming a live chat", (media) => { media["avatar-02"]!.spoken!.en!.transcript = "Hi, I'm Aria. Chat with me live, 24/7. This is pre-recorded."; }, /unproven claim/],
    ["a spoken clip with an empty transcript", (media) => { media["avatar-02"]!.spoken!.en!.transcript = " "; }, /transcript is empty/],
    ["a clip with invalid measured fps", (media) => { media["avatar-02"]!.idle!.fps = 0; }, /invalid frame rate/],
    ["English speech relabelled as Spanish", (media) => { media["avatar-02"]!.spoken!.es = { ...structuredClone(media["avatar-02"]!.spoken!.en!) }; }, /audio is en/],
    ["a spoken clip without captions in its language", (media) => { delete media["avatar-02"]!.spoken!.en!.captions.en; }, /captions in the audio language/],
    ["a frame size that is not the portrait's", (media) => { media["avatar-02"]!.idle!.width = 1080; }, /does not match the 1254px portrait frame/],
  ];
  for (const [name, mutate, expected] of mediaCases) check(`self-test rejects ${name}`, () => {
    const media = mediaClone(); mutate(media);
    ok(validatePilotMedia(media, realPrivate).some((issue) => expected.test(issue)), `expected an issue matching ${expected}`);
  });
  check("self-test rejects a swapped clip file without requiring private media on disk", () => {
    const media = mediaClone();
    const clip = media["avatar-02"]!.spoken!.en!;
    const bytes = new Uint8Array([1, 2, 3, 4]);
    clip.sha256 = createHash("sha256").update(bytes).digest("hex");
    clip.bytes = bytes.length;
    const fixture = (url: string) => url === clip.src ? bytes : null;
    const hashIssue = /does not match its recorded hash/;
    ok(!validatePilotMedia(media, fixture).some((issue) => hashIssue.test(issue)), "the original fixture hash matches");
    clip.sha256 = "0".repeat(64);
    ok(validatePilotMedia(media, fixture).some((issue) => hashIssue.test(issue)), "swapping the hash must be detected");
  });
  check("self-test: strict local verification rejects absent registered movie and caption bytes", () => {
    ok(validatePilotMedia(mediaClone(), () => null, true).some((issue) => /missing private file/.test(issue)));
  });
  check("self-test: all eight approved identities can have private samples without spoken boilerplate", () => {
    for (const profile of avatarProfiles) {
      const source = structuredClone(privatePilotMedia["avatar-02"]!.spoken!.en!);
      source.src = `/avatars-private/${profile.id}/intro-en.mp4`;
      source.width = profile.portraitSize; source.height = profile.portraitSize;
      source.transcript = "Welcome to Brenych Studio. Explore our work.";
      source.captions = { en: { src: `/avatars-private/${profile.id}/intro-en.vtt`, srcLang: "en", label: "English" } };
      deepStrictEqual(validatePilotMedia({ [profile.id]: { avatarId: profile.id, availability: "private-pilot", spoken: { en: source } } }, () => null), []);
    }
  });
  check("self-test: the dist scan catches a private clip URL, a caption file and the transcript, and passes a clean build", () => {
    deepStrictEqual(privateMediaIn([{ file: "assets/clean.js", text: "const a = '/avatars/avatar-02/portrait.webp';" }]), []);
    strictEqual(privateMediaIn([{ file: "assets/leak.js", text: "src:'/avatars-private/avatar-02/idle.mp4'" }]).length, 1);
    strictEqual(privateMediaIn([{ file: "avatars/index.html", text: "<track src=answer-en.en.vtt>" }]).length, 1);
    strictEqual(privateMediaIn([{ file: "assets/t.js", text: "This is a pre-recorded demonstration of how a virtual presenter can" }]).length, 1);
  });
  check("self-test: the runtime noindex check fails when the avatars entry loses noIndex (other entries keep theirs)", () => {
    const app = read("src/App.tsx");
    const stripped = app.replace(/(avatars: \{[^}]*?)\s*\/\/[^\n]*\n\s*noIndex: true,/, "$1");
    ok(stripped !== app && /noIndex: true/.test(stripped), "fixture keeps the other noIndex entries");
    ok(!/avatars: \{[^}]*path: "\/avatars",[^}]*noIndex: true/.test(stripped), "the check must not match another entry's noIndex");
  });
  // The owner's red lines, phrased the way marketing copy drifts into them, in both languages.
  const redLines = [
    "Each character speaks with real-time lip-sync.", "Live AI agents for your website.", "A live conversation with your brand.",
    "Already deployed for hospitality clients.", "Available from January 2027.", "Launching in Q1 2027.", "Fully functional MetaHuman avatars.",
    "Try the 3D demo.", "Autonomous agents answer 24/7.", "Trusted by leading hotels.", "Book a demo.", "Pricing from 500 EUR.", "From €900 per month",
    "Join the waitlist", "Try it live", "Live demo today", "No setup, real-time conversations.",
    "Never miss a visitor with real-time avatars.", "No code needed and real-time lip-sync included.", "No other studio offers live AI agents.",
    "Not just a portrait but a live AI agent.", "Chat with any of the eight characters.", "Ask her anything.", "Used by leading hotels.",
    "Sin esperas y en tiempo real.", "Habla con cualquiera de los ocho personajes.",
    "Conversa en tiempo real con tus clientes.", "Sincronización labial perfecta.", "Agentes en directo para tu web.", "Ya desplegado en hoteles.",
    "Avatares autónomos para tu marca.", "Precio cerrado", "Lista de espera abierta", "Disponible desde enero.",
  ];
  for (const claim of redLines) check(`self-test: the claim filter rejects "${claim}"`, () => ok(unprovenClaim(claim), claim));
  check("self-test: honest disclaimers pass the claim filter", () => {
    for (const honest of ["Not offered as a live service.", "Coming soon · In development", "Not a live agent.", "Digitally generated presenter concept. Not a live agent.",
      "No es un agente en directo.", "Illustrative, not client projects.", "Interactive speaking demos are in development.", "There is no public 3D demonstrator yet.",
      "The selection below is an interactive presentation—not a live conversation.", "No se ofrece como servicio en directo.",
      "Es una presentación interactiva, no una conversación en directo.", privatePilotMedia["avatar-02"]?.spoken?.en?.transcript ?? "pre-recorded"]) {
      strictEqual(unprovenClaim(honest), null, honest);
    }
  });
  check("self-test: the SEO scan would catch a claim added to the avatars description", () => {
    ok(avatarsSeoStrings().some((text) => /digital character concepts/.test(text)), "the scan reads the real EN description");
    ok(unprovenClaim("Explore eight live AI agents for your website.") !== null, "the same filter rejects a drifted description");
  });
}

console.log(`AVATARS_${process.argv.includes("--self-test") ? "SELF_TEST" : "VALIDATION"}=${failures.length ? "FAIL" : "PASS"} (${count - failures.length}/${count})`);
if (failures.length) process.exit(1);
