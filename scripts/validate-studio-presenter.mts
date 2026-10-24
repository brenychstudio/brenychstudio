import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { PresenterState } from "../src/ui/presenter/presenterMachine.ts";

// Studio Avatar V1 guard (STUDIO-AVATAR-V1-IMPLEMENTATION-01 + Website Director amendment). Curated questions in both
// locales, studio voice, a bounded director plan per answer with approved targets, one explicit next step, the explicit
// state machine, the DOM hooks the director confirms its actions with, and the shipped media files.
//   node --experimental-strip-types scripts/validate-studio-presenter.mts

let count = 0;
const failures: string[] = [];
function check(name: string, run: () => void) {
  count++;
  try { run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push(`${name}: ${error instanceof Error ? error.message : error}`); console.error(`FAIL ${failures.at(-1)}`); }
}

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const publicFile = (src: string) => new URL(`../public${src}`, import.meta.url);
const { presenterCopy } = await import("../src/ui/presenter/presenterContent.ts");
const { initialPresenterState, presenterReducer } = await import("../src/ui/presenter/presenterMachine.ts");
const { presenterAnswerClips, presenterIdleClip, presenterRestFrame, presenterSeal } = await import("../src/ui/presenter/presenterMedia.ts");
const { presenterPilotMedia } = await import("../src/ui/presenter/presenterPilotMedia.ts");

const IDS = ["studio", "products", "games", "immersive", "ai", "start"];
const QUESTIONS_EN = [
  "What does Brenych Studio do?",
  "Show me your products",
  "Show me your games",
  "Show me your immersive work",
  "Do you build AI-powered applications?",
  "How do we start a project?",
];
const CTA_ROUTES = new Set(["/products", "/immersive", "/work"]);
const DIRECTOR_ROUTES = new Set(["/games", "/offer"]);
const ANCHORS: Record<string, [string, string]> = {
  ecosystem: ["src/pages/StudioIndex.tsx", '{ id: "ecosystem"'],
  collaboration: ["src/pages/StudioIndex.tsx", '{ id: "collaboration"'],
  "offer-systems": ["src/pages/OfferV2.tsx", 'id: "offer-systems"'],
};
// The presenter speaks for the studio and never reads out contact details.
const FIRST_PERSON = { en: /\b(I|I'm|I'll|I've|my|me|mine)\b/, es: /(?<!\p{L})(yo|mi|mis|me|conmigo|mío|mía)(?!\p{L})/iu };
const CONTACT = /@|mailto:|\binfo\b|\+\d{6,}/i;

const games = read("src/data/games.ts");
const homeProducts = read("src/data/ecosystemHome.ts");
const spatial = read("src/ui/home/homeSpatialPresentation.ts");
const offer = read("src/pages/OfferV2.tsx");

check("both locales carry the six curated questions in order", () => {
  deepStrictEqual(presenterCopy.en.answers.map((answer) => answer.id), IDS);
  deepStrictEqual(presenterCopy.es.answers.map((answer) => answer.id), IDS);
  deepStrictEqual(presenterCopy.en.answers.map((answer) => answer.question), QUESTIONS_EN);
});

for (const locale of ["en", "es"] as const) {
  const copy = presenterCopy[locale];
  check(`${locale}: public mode discloses a scripted tour without claiming recorded speech; short trigger`, () => {
    ok(locale === "en" ? /scripted/i.test(copy.disclosure) : /predefinido/i.test(copy.disclosure), copy.disclosure);
    ok(!/pre-recorded|pregrabado/i.test(copy.disclosure), "no recorded-speech claim in public text mode");
    ok(copy.trigger.trim().length > 0 && copy.trigger.length <= 24, "short visible trigger label");
  });
  for (const answer of copy.answers) {
    check(`${locale}/${answer.id}: clean cues, studio voice, no contact details`, () => {
      ok(answer.cues.length > 0 && answer.cues.length <= 4, `${answer.cues.length} cues`);
      for (const cue of answer.cues) {
        strictEqual(cue, cue.trim().replace(/\s{2,}/g, " "), `untidy cue: ${cue}`);
        ok(!FIRST_PERSON[locale].test(cue), `first person singular: ${cue}`);
        ok(!CONTACT.test(cue), `contact detail: ${cue}`);
      }
      ok(answer.cues.join(" ").length <= 300, "answer too long for a short clip");
    });
    check(`${locale}/${answer.id}: bounded director plan on approved targets, synced to cues`, () => {
      ok(answer.plan.length >= 1 && answer.plan.length <= 3, `${answer.plan.length} steps`);
      answer.plan.forEach((step, index) => {
        ok(step.atCue >= 0 && step.atCue < answer.cues.length, `step ${index} cue ${step.atCue}`);
        ok(index === 0 || step.atCue >= answer.plan[index - 1].atCue, "steps follow the captions");
        ok(step.receipt.trim().length > 0, "receipt label");
        const { action } = step;
        if (action.kind === "anchor") {
          const [file, marker] = ANCHORS[action.id] ?? [];
          ok(file && read(file).includes(marker), `anchor ${action.id}`);
        } else if (action.kind === "product") ok(homeProducts.includes(`"${action.projectId}"`), `product ${action.projectId}`);
        else if (action.kind === "spatial") ok(spatial.includes(`"${action.proof}"`), `spatial ${action.proof}`);
        else if (action.kind === "route") {
          ok(DIRECTOR_ROUTES.has(action.path), action.path);
          ok(!action.game || games.includes(`slug: "${action.game}"`), `game ${action.game}`);
        } else if (action.kind === "offer-system") ok(action.system === "ai-agent-systems" && offer.includes('title: "AI & Agent Systems"') && offer.includes('"IA y Sistemas de Agentes"'), `offer system ${action.system}`);
        else ok(games.includes(`slug: "${action.slug}"`), `game ${action.slug}`);
      });
      ok(answer.plan[0].atCue === 0, "the site reacts as soon as the answer starts");
    });
    check(`${locale}/${answer.id}: one explicit next step`, () => {
      const { cta } = answer;
      ok(cta.label.trim().length > 0, "CTA label missing");
      if (cta.kind === "route") ok(CTA_ROUTES.has(cta.path), cta.path);
      // The project drawer only opens from the answer that is about starting a project.
      strictEqual(cta.kind === "project", answer.id === "start", "project drawer CTA belongs to the start answer");
    });
  }
}

check("director hooks still exist in the real components it drives and confirms", () => {
  const app = read("src/App.tsx");
  for (const route of [...CTA_ROUTES, ...DIRECTOR_ROUTES]) ok(app.includes(`path: "${route}"`), `route ${route}`);
  const products = read("src/ui/home/EcosystemProducts.tsx");
  ok(products.includes("data-weekfield-active") && products.includes("data-print-border-active"), "products stage active flags");
  ok(/targetProgress = index === 0 \? 0\.24 : 0\.77/.test(products), "products stage holds (.24/.77)");
  ok(read("src/ui/home/ProductsMobileDeck.tsx").includes("data-active-product"), "mobile deck active product");
  const spatialStage = read("src/ui/home/EcosystemSpatial.tsx");
  ok(spatialStage.includes('className="eco-spatial-stage') && spatialStage.includes("node.dataset.activeIndex"), "spatial stage active index");
  ok(/lastActive\.current === 0 \? \.35 : \.96/.test(spatialStage), "spatial holds (.35/.96)");
  ok(offer.includes("aria-pressed={isActive}") && offer.includes('id: "offer-systems"'), "offer build-system selector");
  const gamesPage = read("src/pages/GamesPage.tsx");
  ok(gamesPage.includes("id={`games-tab-${item.slug}`}") && gamesPage.includes('id="games-panel"'), "games tabs and panel ids");
  ok(read("src/ui/home/homeResearchModel.ts").includes('PROGRAMMATIC_SCROLL_EVENT = "home:programmatic-scroll"')
    && read("src/ui/presenter/directorRuntime.ts").includes('"home:programmatic-scroll"'), "HOME programmatic scroll event");
  ok(app.includes("<StudioPresenterProvider onOpenProject={openProject}>"), "provider wraps the routes with the drawer opener");
  ok(read("src/ui/home/EcosystemHero.tsx").includes("<StudioPresenter />"), "hero mounts the presenter");
});

check("presence: measured layouts, no overlay panel, no simulated life, media-clock director", () => {
  const hero = read("src/ui/presenter/StudioPresenter.tsx");
  ok(hero.includes("function measureField") && hero.includes("function fitStage"), "field geometry is measured from the live hero");
  ok(!hero.includes("createPortal"), "the HOME stage is not a floating panel");
  ok(!/breathe|@keyframes[^{]*scale/.test(read("src/ui/presenter/studioPresenter.css")), "no CSS breathing over the still");
  const provider = read("src/ui/presenter/StudioPresenterProvider.tsx");
  ok(provider.includes("!position.started"), "director steps wait for the answer's own clock to start");
  const playback = read("src/ui/presenter/usePresenterPlayback.ts");
  ok(playback.includes("player.time()") && playback.includes("player.endSpeech(generation)"), "clip cues read the clip clock; each run ends only its own clip");
  const player = read("src/ui/presenter/presenterPlayer.ts");
  ok(player.includes("generation === this.generation") && player.includes('removeAttribute("src")'), "stale clip events ignored; Close releases the media");
});

check("state machine: open, select, stop, replay, complete, back to menu, close", () => {
  const step = (state: PresenterState, ...events: Parameters<typeof presenterReducer>[1][]) => events.reduce(presenterReducer, state);
  const idle = step(initialPresenterState, { type: "open" });
  deepStrictEqual(idle, { phase: "idle_open", run: 0 });
  deepStrictEqual(step(initialPresenterState, { type: "select", answerId: "studio" }), initialPresenterState);
  const playing = step(idle, { type: "select", answerId: "studio" });
  deepStrictEqual(playing, { phase: "playing_answer", answerId: "studio", run: 1 });
  strictEqual(step(playing, { type: "select", answerId: "studio" }), playing);
  deepStrictEqual(step(playing, { type: "select", answerId: "start" }), { phase: "playing_answer", answerId: "start", run: 2 });
  deepStrictEqual(step(playing, { type: "stop" }), { phase: "stopped", answerId: "studio", run: 1 });
  deepStrictEqual(step(playing, { type: "interrupt" }), { phase: "stopped", answerId: "studio", run: 1 });
  deepStrictEqual(step(playing, { type: "ended" }), { phase: "completed", answerId: "studio", run: 1 });
  deepStrictEqual(step(playing, { type: "stop" }, { type: "replay" }), { phase: "playing_answer", answerId: "studio", run: 2 });
  deepStrictEqual(step(playing, { type: "ended" }, { type: "replay" }), { phase: "playing_answer", answerId: "studio", run: 2 });
  deepStrictEqual(step(playing, { type: "stop" }, { type: "ended" }), { phase: "stopped", answerId: "studio", run: 1 });
  // Back to the menu keeps the run counter, so the same answer chosen again starts a fresh run.
  deepStrictEqual(step(playing, { type: "open" }), { phase: "idle_open", run: 1 });
  deepStrictEqual(step(playing, { type: "open" }, { type: "select", answerId: "studio" }), { phase: "playing_answer", answerId: "studio", run: 2 });
  deepStrictEqual(step(idle, { type: "stop" }, { type: "replay" }, { type: "ended" }), idle);
  // Close never resets the run: a later session can never match the clock, media mode or receipts of an earlier one.
  deepStrictEqual(step(playing, { type: "close" }), { phase: "closed", run: 1 });
  deepStrictEqual(step(playing, { type: "close" }, { type: "open" }, { type: "select", answerId: "products" }), { phase: "playing_answer", answerId: "products", run: 2 });
  deepStrictEqual(step(playing, { type: "ended" }, { type: "close" }, { type: "open" }, { type: "select", answerId: "studio" }), { phase: "playing_answer", answerId: "studio", run: 2 });
  deepStrictEqual(step(playing, { type: "close" }, { type: "open" }), { phase: "idle_open", run: 1 });
});

// Optional: --dist <dir> proves a built bundle (a default build) carries no private pilot media.
const distAt = process.argv.indexOf("--dist");
if (distAt > 0) {
  check("build: no private pilot media in the bundle", () => {
    const root = pathToFileURL(`${resolve(process.argv[distAt + 1])}/`);
    const files = [new URL("index.html", root), ...readdirSync(new URL("assets/", root)).map((name) => new URL(`assets/${name}`, root))];
    const leaks = files.filter((file) => /\.(js|css|html)$/.test(file.pathname) && readFileSync(file, "utf8").includes("/studio-avatar-private/"));
    deepStrictEqual(leaks.map((file) => file.pathname), [], "private media referenced by the bundle");
  });
}

check("media: a default build ships the still and avatar only, no clips", () => {
  for (const src of [presenterRestFrame.src, ...presenterRestFrame.srcSet.split(",").map((entry) => entry.trim().split(" ")[0]), presenterSeal]) {
    ok(existsSync(publicFile(src)), `missing ${src}`);
    ok(statSync(publicFile(src)).size < 150_000, `${src} exceeds 150 KB`);
  }
  strictEqual(presenterIdleClip, null, "no idle clip outside the private preview build");
  deepStrictEqual(presenterAnswerClips, { en: {}, es: {} }, "no answer clips outside the private preview build");
  const shipped = readdirSync(new URL("../public/studio-avatar/", import.meta.url));
  ok(shipped.every((name) => name.endsWith(".webp")), `public/studio-avatar holds only stills: ${shipped.join(", ")}`);
  ok(read("src/ui/presenter/presenterMedia.ts").includes('import.meta.env?.VITE_STUDIO_AVATAR_MEDIA === "private-preview"'), "pilot media gated by the private preview flag");
});

check("media: the private pilot is consistent with the approved transcripts", () => {
  strictEqual(presenterPilotMedia.rights, "LOCAL_REVIEW_ONLY");
  const clips = [presenterPilotMedia.idle, ...Object.values(presenterPilotMedia.answers).flatMap((byId) => Object.values(byId))];
  for (const clip of clips) ok(/^\/studio-avatar-private\/[a-z0-9-]+\.mp4$/.test(clip.src), `private clip url ${clip.src}`);
  ok(!presenterPilotMedia.idle.hasAudio, "idle loops stay silent");
  for (const locale of ["en", "es"] as const) {
    for (const [id, clip] of Object.entries(presenterPilotMedia.answers[locale])) {
      const answer = presenterCopy[locale].answers.find((item) => item.id === id);
      ok(answer && clip, `${locale}/${id}: clip without an answer`);
      ok(clip.hasAudio, `${locale}/${id}: answer clip carries its voice`);
      strictEqual(clip.transcriptSha256, createHash("sha256").update(answer.cues.join(" ")).digest("hex"), `${locale}/${id}: transcript changed after the clip was rendered`);
      const starts = clip.cueStartsMs ?? [];
      strictEqual(starts.length, answer.cues.length, `${locale}/${id}: one start per cue`);
      ok(starts.every((start, index) => start >= 0 && start < clip.durationMs && (index === 0 || start > starts[index - 1])), `${locale}/${id}: cue starts inside the clip, in order`);
    }
  }
  // The files live outside the repository (ignored review folder); verify them where they exist.
  const folder = new URL("../qa-screenshots/studio-avatar-v1-fix1/private-media/studio-avatar-private/", import.meta.url);
  if (!existsSync(folder)) { console.log("  (private pilot files not on this machine: hashes not checked)"); return; }
  for (const clip of clips) {
    const file = new URL(clip.src.split("/").pop() ?? "", folder);
    ok(existsSync(file), `missing ${clip.src}`);
    strictEqual(createHash("sha256").update(readFileSync(file)).digest("hex"), clip.sha256, `${clip.src} hash`);
  }
});

console.log(`STUDIO_PRESENTER_VALIDATION=${failures.length ? "FAIL" : "PASS"} (${count - failures.length}/${count})`);
if (failures.length) process.exit(1);
