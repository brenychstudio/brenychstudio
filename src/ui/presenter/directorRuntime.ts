import type { PublicLocale } from "../../data/projectRegistry.types";
import { getLocalizedPath } from "../../i18n";
import type { DirectorAction, DirectorReceiptStatus, OfferSystem } from "./directorContract";

// Same event as homeResearchModel's PROGRAMMATIC_SCROLL_EVENT (kept literal so the App shell does not load HOME code):
// HOME scenes show a navigation destination instead of replaying everything they pass.
const HOME_PROGRAMMATIC_SCROLL = "home:programmatic-scroll";
// HOME's Spatial track starts under the 84px chrome; reader layouts use the same offset for proofs.
const CHROME_OFFSET = 84;
const NAVIGATION_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

export type DirectorRuntime = {
  locale: PublicLocale;
  signal: AbortSignal;
  // Opens a page through the site's own page transition.
  openPage: (to: string) => void;
  // Changes the hash of the open page without a transition (Games world selection).
  replaceHash: (to: string) => void;
};

const abortError = () => new DOMException("Director run cancelled", "AbortError");

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { window.clearTimeout(timer); reject(abortError()); }, { once: true });
  });
}

// Polls until the page reports the expected state: success is only ever claimed from what the DOM confirms.
async function confirm(check: () => boolean, signal: AbortSignal, timeout = 2500) {
  const end = performance.now() + timeout;
  for (;;) {
    if (signal.aborted) throw abortError();
    if (check()) return true;
    if (performance.now() > end) return false;
    await sleep(80, signal);
  }
}

async function find<T extends Element>(selector: string, signal: AbortSignal, timeout = 2500) {
  let found: T | null = null;
  await confirm(() => Boolean(found = document.querySelector<T>(selector)), signal, timeout);
  return found as T | null;
}

/** Eased, cancellable page glide. Any wheel, touch or scroll key hands control back to the visitor ("user"). */
export function glideTo(top: number, signal: AbortSignal): Promise<"done" | "user"> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(abortError()); return; }
    const from = window.scrollY;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const to = Math.max(0, Math.min(max, Math.round(top)));
    const distance = to - from;
    if (Math.abs(distance) < 2) { resolve("done"); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: to, behavior: "instant" });
      resolve("done");
      return;
    }
    const duration = Math.min(2600, Math.max(900, Math.abs(distance) * .32));
    let frame = 0;
    let started = 0;
    const cleanup = () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("touchstart", takeOver);
      window.removeEventListener("keydown", onKey);
      signal.removeEventListener("abort", onAbort);
    };
    const takeOver = () => { cleanup(); resolve("user"); };
    const onKey = (event: KeyboardEvent) => { if (NAVIGATION_KEYS.has(event.key)) takeOver(); };
    const onAbort = () => { cleanup(); reject(abortError()); };
    const tick = (now: number) => {
      if (!started) started = now;
      const t = Math.min(1, (now - started) / duration);
      const eased = t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      window.scrollTo({ top: from + distance * eased, behavior: "instant" });
      if (t < 1) frame = window.requestAnimationFrame(tick);
      else { cleanup(); resolve("done"); }
    };
    window.addEventListener("wheel", takeOver, { passive: true });
    window.addEventListener("touchstart", takeOver, { passive: true });
    window.addEventListener("keydown", onKey);
    signal.addEventListener("abort", onAbort, { once: true });
    frame = window.requestAnimationFrame(tick);
  });
}

const topOf = (element: Element) => element.getBoundingClientRect().top + window.scrollY;
const resting = (element: Element) => {
  const top = element.getBoundingClientRect().top;
  return top > -48 && top < window.innerHeight * .36;
};
const announce = () => window.dispatchEvent(new CustomEvent(HOME_PROGRAMMATIC_SCROLL));
const currentPath = () => window.location.pathname.replace(/\/+$/, "") || "/";

async function glide(top: number, runtime: DirectorRuntime) {
  announce();
  return glideTo(top, runtime.signal);
}

/** Back: the page glides to where the visitor chose the question. */
export function glideBack(top: number) {
  announce();
  return glideTo(top, new AbortController().signal);
}

async function showAnchor(id: string, runtime: DirectorRuntime): Promise<DirectorReceiptStatus> {
  const element = await find<HTMLElement>(`#${id}`, runtime.signal);
  if (!element) return "failed";
  const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  if (await glide(topOf(element) - margin, runtime) === "user") return "interrupted";
  return await confirm(() => resting(element), runtime.signal, 1500) ? "done" : "failed";
}

async function showProduct(projectId: string, runtime: DirectorRuntime): Promise<DirectorReceiptStatus> {
  const timeline = await find<HTMLElement>(".eco-products-stage__timeline", runtime.signal);
  if (!timeline) return "failed";
  const index = projectId === "weekfield" ? 0 : 1;
  const deck = timeline.querySelector<HTMLElement>(".products-mobile-deck");
  if (deck) {
    // Phones and tablets: bring the deck into view, then use its own selector exactly as a visitor would.
    if (await glide(topOf(deck) - 72, runtime) === "user") return "interrupted";
    deck.querySelectorAll<HTMLButtonElement>(".products-mobile-deck__selector button")[index]?.click();
    return await confirm(() => deck.dataset.activeProduct === projectId, runtime.signal, 1800) ? "done" : "failed";
  }
  if (timeline.dataset.staged === "true") {
    // The scene's own holds (EcosystemProducts scrollToProduct): 24% of the travel for Weekfield, 77% for Print Border.
    const travel = Math.max(0, timeline.offsetHeight - window.innerHeight);
    if (await glide(topOf(timeline) + travel * (index === 0 ? .24 : .77), runtime) === "user") return "interrupted";
    const flag = index === 0 ? "weekfieldActive" : "printBorderActive";
    // The damped scene can settle slowly on a frame-starved device. Keep the real
    // DOM confirmation and cancellation, with a bounded settling budget.
    return await confirm(() => timeline.dataset[flag] === "true", runtime.signal, 10000) ? "done" : "failed";
  }
  const article = timeline.querySelector<HTMLElement>(`[data-project-id="${projectId}"]`);
  if (!article) return "failed";
  if (await glide(topOf(article) - CHROME_OFFSET, runtime) === "user") return "interrupted";
  return await confirm(() => resting(article), runtime.signal, 1500) ? "done" : "failed";
}

async function showSpatial(proof: string, runtime: DirectorRuntime): Promise<DirectorReceiptStatus> {
  const stage = await find<HTMLElement>(".eco-spatial-stage", runtime.signal);
  const track = stage?.closest<HTMLElement>(".eco-spatial-track");
  if (!stage || !track) return "failed";
  const index = proof === "whisper" ? 0 : 1;
  if (track.dataset.mode === "cinematic") {
    // The scene's own hold positions (EcosystemSpatial restore): progress .35 holds WHISPER, .96 holds WEBHERO.
    const progress = index === 0 ? .35 : .96;
    const top = topOf(track) - CHROME_OFFSET + progress * (track.offsetHeight - stage.offsetHeight);
    if (await glide(top, runtime) === "user") return "interrupted";
    return await confirm(() => stage.dataset.activeIndex === String(index), runtime.signal, 3200) ? "done" : "failed";
  }
  const article = stage.querySelector<HTMLElement>(`[data-spatial-proof="${proof}"]`);
  if (!article) return "failed";
  if (await glide(topOf(article) - CHROME_OFFSET, runtime) === "user") return "interrupted";
  return await confirm(() => resting(article), runtime.signal, 1500) ? "done" : "failed";
}

const gameSelected = (slug: string) => document.getElementById(`games-tab-${slug}`)?.getAttribute("aria-selected") === "true";
// What proves each director page is really mounted, not just that the URL changed.
const PAGE_READY: Record<string, string> = { "/games": "#games-panel", "/offer": "#offer-systems" };

async function openRoute(path: string, game: string | undefined, runtime: DirectorRuntime): Promise<DirectorReceiptStatus> {
  const localized = getLocalizedPath(path, runtime.locale);
  const target = game ? `${localized}#${game}` : localized;
  if (currentPath() !== localized) runtime.openPage(target);
  else if (game) runtime.replaceHash(target);
  if (!await confirm(() => currentPath() === localized, runtime.signal, 5000)) return "failed";
  if (!await find(PAGE_READY[path], runtime.signal, 4000)) return "failed";
  return !game || await confirm(() => gameSelected(game), runtime.signal, 3000) ? "done" : "failed";
}

async function selectGame(slug: string, runtime: DirectorRuntime): Promise<DirectorReceiptStatus> {
  const games = getLocalizedPath("/games", runtime.locale);
  if (currentPath() !== games) return "failed";
  runtime.replaceHash(`${games}#${slug}`);
  return await confirm(() => gameSelected(slug), runtime.signal, 2500) ? "done" : "failed";
}

// Offer build-system titles as the page renders them (OfferV2 buildSystems).
const OFFER_SYSTEM_TITLES: Record<OfferSystem, Record<PublicLocale, string>> = {
  "ai-agent-systems": { en: "AI & Agent Systems", es: "IA y Sistemas de Agentes" },
};

async function selectOfferSystem(system: OfferSystem, runtime: DirectorRuntime): Promise<DirectorReceiptStatus> {
  // OfferV2 renders its phone layout below 1024px, which has no build-system selector: nothing to show, nothing claimed.
  if (!window.matchMedia("(min-width: 1024px)").matches) return "skipped";
  const section = await find<HTMLElement>("#offer-systems", runtime.signal, 4000);
  if (!section) return "failed";
  const title = OFFER_SYSTEM_TITLES[system][runtime.locale];
  const button = Array.from(section.querySelectorAll<HTMLButtonElement>("button[aria-pressed]")).find((item) => item.textContent?.includes(title));
  if (!button) return "failed";
  const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || CHROME_OFFSET;
  if (await glide(topOf(section) - margin, runtime) === "user") return "interrupted";
  // The page's own selector, exactly as a visitor would use it.
  button.click();
  return await confirm(() => button.getAttribute("aria-pressed") === "true", runtime.signal, 1500) ? "done" : "failed";
}

/** Performs one approved action and reports what the page confirms: done, failed or interrupted by the visitor. */
export function runDirectorAction(action: DirectorAction, runtime: DirectorRuntime): Promise<DirectorReceiptStatus> {
  switch (action.kind) {
    case "anchor": return showAnchor(action.id, runtime);
    case "product": return showProduct(action.projectId, runtime);
    case "spatial": return showSpatial(action.proof, runtime);
    case "route": return openRoute(action.path, action.game, runtime);
    case "game": return selectGame(action.slug, runtime);
    case "offer-system": return selectOfferSystem(action.system, runtime);
  }
}
