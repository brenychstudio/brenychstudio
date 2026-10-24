// Behavior checks for exact audio locale selection and honest incomplete slots.
// No browser or network listener: Vite loads the actual TS/TSX modules in middleware mode.
// Run: node --experimental-strip-types scripts/validate-avatars03-player.mts
import { strictEqual, ok } from "node:assert/strict";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { CharacterMedia, SpokenClip } from "../src/data/avatarMedia.ts";

// A new ES-only delivery must augment, rather than replace, Aria's immutable pilot idle/English clips.
const castFixture = { "avatar-02": { avatarId: "avatar-02", availability: "private-pilot", spoken: { es: {
  src: "/avatars-private/avatar-02/intro-es.mp4", audioLocale: "es", transcript: "Una muestra de IA pregrabada.",
  sha256: "2".repeat(64), bytes: 100, width: 1254, height: 1254, durationSec: 12, rightsStatus: "private-only", captions: {},
} } } };
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] }, define: { "import.meta.env.VITE_AVATARS_MEDIA": JSON.stringify("private-preview") },
  plugins: [{ name: "cast-delivery-fixture", enforce: "pre", load(id) {
    if (id.replaceAll("\\", "/").endsWith("/src/data/avatarCastMedia.ts")) return `export const privateCastMedia = ${JSON.stringify(castFixture)};`;
  } }],
});
const failures: string[] = [];
let count = 0;
function check(name: string, run: () => void) {
  count++;
  try { run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push(name); console.error(`FAIL ${name}: ${error instanceof Error ? error.message : error}`); }
}
try {
  const { avatarMedia, spokenClipFor } = await server.ssrLoadModule("/src/data/avatarMedia.ts");
  const { default: StagePresence } = await server.ssrLoadModule("/src/ui/avatars/StagePresence.tsx");
  const { SoundProvider } = await server.ssrLoadModule("/src/stage/audio/SoundProvider.tsx");
  const { avatarProfiles } = await server.ssrLoadModule("/src/data/avatarProfiles.ts");
  const { avatarsCopy } = await server.ssrLoadModule("/src/data/avatarsCopy.ts");
  check("adding Spanish delivery retains the original Aria idle and English pilot", () => {
    strictEqual(avatarMedia["avatar-02"]?.idle?.src, "/avatars-private/avatar-02/idle.mp4");
    strictEqual(avatarMedia["avatar-02"]?.spoken?.en?.src, "/avatars-private/avatar-02/answer-en.mp4");
    strictEqual(avatarMedia["avatar-02"]?.spoken?.es?.src, "/avatars-private/avatar-02/intro-es.mp4");
  });
  const english: SpokenClip = { src: "/avatars-private/avatar-02/intro-en.mp4", sha256: "1".repeat(64), bytes: 100,
    width: 1254, height: 1254, durationSec: 12, rightsStatus: "private-only", audioLocale: "en",
    transcript: "This is a pre-recorded AI sample.", captions: { en: { src: "/avatars-private/avatar-02/intro-en.vtt", srcLang: "en", label: "English" } } };
  const spanish: SpokenClip = { ...english, src: "/avatars-private/avatar-02/intro-es.mp4", audioLocale: "es", transcript: "Es una muestra de IA pregrabada.",
    captions: { es: { src: "/avatars-private/avatar-02/intro-es.vtt", srcLang: "es", label: "Español" } } };
  const englishOnly: CharacterMedia = { avatarId: "avatar-02", availability: "private-pilot", idle: english, spoken: { en: english } };
  check("missing ES audio never selects an English sample", () => strictEqual(spokenClipFor(englishOnly, "es"), undefined));
  check("an audioLocale mismatch is unavailable rather than relabelled", () => strictEqual(spokenClipFor({ ...englishOnly, spoken: { es: english } }, "es"), undefined));
  check("each requested locale selects its own real clip", () => {
    const complete = { ...englishOnly, spoken: { en: english, es: spanish } };
    strictEqual(spokenClipFor(complete, "en"), english);
    strictEqual(spokenClipFor(complete, "es"), spanish);
    strictEqual(spokenClipFor(undefined, "en"), undefined);
  });
  const stageHtml = (media: CharacterMedia | undefined, lang: "en" | "es") => renderToStaticMarkup(createElement(SoundProvider, null,
    createElement(StagePresence, { profile: avatarProfiles[1], media, lang, copy: avatarsCopy[lang].presence, stage: { current: null } }, createElement("img", { alt: "Aria" }))));
  check("a Spanish page with only EN media has no Play control and explains missing audio", () => {
    const html = stageHtml(englishOnly, "es");
    ok(!html.includes('class="av-presence__play"'), "English Play must not appear on ES");
    ok(html.includes("Audio no disponible en este idioma"), "missing-language status must be visible");
  });
  check("a pure concept retains its honest concept status", () => {
    const html = stageHtml(undefined, "en");
    ok(html.includes(avatarsCopy.en.presence.concept));
    ok(!html.includes('class="av-presence__play"'));
  });
  check("available speech exposes its complete accessible transcript", () => {
    const html = stageHtml(englishOnly, "en");
    ok(html.includes(english.transcript), "the complete transcript must be in the accessibility tree");
    ok(html.includes('class="av-presence__play"'));
  });
} finally {
  await server.close();
}
console.log(`AVATARS-03 player: ${count - failures.length}/${count} passed`);
if (failures.length) process.exitCode = 1;
