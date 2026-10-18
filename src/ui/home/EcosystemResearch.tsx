import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { useScroll } from "framer-motion";
import { homeCopy } from "./homeCopy";
import { HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";
import { stepHomeSpatialMotion, type HomeSpatialMotionState } from "./homeSpatialModel";
import {
  CLIMAX_REST, CONSTRAINT, DECISION_MINIMAP, DEFAULT_CONSTRAINT, DOMAIN_LABEL_GAP, LAYOUT, PROGRAMMATIC_SCROLL_EVENT, RESEARCH_DOMAINS, RESEARCH_LEGACY_END, RESEARCH_MOTION, RULE,
  TERRAIN_UNION, THRESHOLD, acrossSide, artBox, clampArtToRail, climaxFit, constraintFromFlat, evaluate, fit, flatBox, isTie, paceResearchTrack, quantize, readoutDecimals,
  resolveResearchClimax, resolveResearchPhase, routeFamily, sameConstraint, sideWord, sliderPercent,
  type Camera, type Constraint, type Evaluation, type Orientation, type ResearchClimax, type ResearchPhase,
} from "./homeResearchModel";
import { RESEARCH_NETWORK, createMinimap, createResearchScene, type ResearchScene, type SceneCopy, type SceneState } from "./homeResearchScene";

type Profile = "full" | "compact" | "static";
type Copy = (typeof homeCopy)["en" | "es"];
type Locale = HomeSectionProps["locale"];
/** `default`: the story's own evaluation, revealed by scroll. `user`: Evaluate (drawn at once, one pulse). `reset`: Reset
 *  restores the default zone and its evaluated route at once, without a pulse. */
type Commit = { c: Constraint; by: "default" | "user" | "reset"; n: number };
type Live = { live: Constraint; liveEval: Evaluation; committedEval: Evaluation; commitBy: Commit["by"]; commitN: number; preview: boolean; hintArmed: boolean; runnerUpLabel: string };
type View = { hover: boolean; dragging: boolean; fine: boolean; signalStart: number; pulsed: number; yaw: number; pitch: number; yawTarget: number; pitchTarget: number; progress: number };
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_QUERY = "(hover: hover) and (pointer: fine)";
const AXIS = ["S", "O4", "I4", "H", "I0", "O0", "T"];
/** Static compositions show the default evaluation complete: no reveal, pulse, morph, viewpoint or hint. */
const COMPLETE: ResearchPhase = { ...resolveResearchPhase(0.47), s: 0, title: 0, note: 0, viewpoint: false, drag: true };

const fill = (template: string, values: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(t));
const sceneCopyOf = (copy: Copy): SceneCopy => ({ origin: copy.researchOrigin, destination: copy.researchDestination, costField: copy.researchCostField,
  clearance: copy.researchClearance, research: copy.researchCaptions.research, worlds: copy.researchCaptions.worlds });
function familyText(copy: Copy, ev: Evaluation) {
  const f = routeFamily(ev);
  return f === "rejoin-origin" ? copy.researchFamily.rejoinOrigin : f === "rejoin-destination" ? copy.researchFamily.rejoinDestination
    : f === "none" ? "" : copy.researchFamily[f];
}
const formats = new Map<string, Intl.NumberFormat>();
function numberFormat(locale: Locale, digits: number) {
  const key = `${locale}:${digits}`;
  let format = formats.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    formats.set(key, format);
  }
  return format;
}
const plurals = new Map<string, Intl.PluralRules>();
/** "{n} links excluded": the count of links the zone's clearance closes (every one the solver marks illegal). */
function linksText(copy: Copy, locale: Locale, n: number) {
  let rules = plurals.get(locale);
  if (!rules) { rules = new Intl.PluralRules(locale === "es" ? "es-ES" : "en-US"); plurals.set(locale, rules); }
  return fill(copy.researchLinks[rules.select(n) === "one" ? "one" : "other"], { n });
}
/** FIX3 mission readout for one evaluation, all from the solver: the consequence (route side, excluded links, cost), its
 *  detail (route family and the best route on the other side), the polite announcement and the runner-up label. Locale
 *  numbers, gap-aware decimals. */
function describe(copy: Copy, locale: Locale, ev: Evaluation, orient: Orientation) {
  const nf = (d: number) => numberFormat(locale, d);
  const accepted = ev.accepted, links = linksText(copy, locale, ev.blockedEdges.length);
  if (!accepted) {
    const consequence = fill(copy.researchConsequence.none, { links });
    return { consequence, detail: copy.researchResult.none, live: `${consequence}. ${copy.researchResult.none}`, runnerUpLabel: "" };
  }
  const family = familyText(copy, ev);
  if (ev.routeClass === "direct") {
    const a = nf(0).format(accepted.cost);
    return { consequence: fill(copy.researchConsequence.route, { cls: copy.researchClass.direct, links, a }), detail: copy.researchDirect,
      live: fill(copy.researchLive.direct, { links, a }), runnerUpLabel: "" };
  }
  const cls = copy.researchClass[sideWord(ev.routeClass === "above" ? "above" : "below", orient)], tie = isTie(ev);
  const side = copy.researchSides[sideWord(ev.routeClass === "above" ? "below" : "above", orient)];
  if (!ev.runnerUp) {
    const a = nf(0).format(accepted.cost);
    return { consequence: fill(copy.researchConsequence.route, { cls, links, a }), detail: fill(copy.researchAlternative.none, { family, side }),
      live: fill(copy.researchLive.none, { cls, links, a, side }), runnerUpLabel: "" };
  }
  const d = tie ? 0 : readoutDecimals(accepted.cost, ev.runnerUp.cost), a = nf(d).format(accepted.cost), b = nf(d).format(ev.runnerUp.cost);
  return {
    consequence: fill(copy.researchConsequence.route, { cls, links, a }),
    detail: tie ? (orient === "portrait" ? copy.researchResult.tiePortrait : copy.researchResult.tie) : fill(copy.researchAlternative.route, { family, side, b }),
    live: fill(copy.researchLive.result, { cls, links, a, side, b }), runnerUpLabel: fill(copy.researchRunnerUp, { side, b }).toUpperCase(),
  };
}
function resolveProfile(): Profile {
  if (window.matchMedia(REDUCED_QUERY).matches || innerWidth < 1024 || innerHeight < 640) return "static";
  return innerHeight < 760 ? "compact" : "full";
}
const staticOrientation = (): Orientation => (innerWidth < 768 && innerHeight > innerWidth ? "portrait" : "landscape");
const hintOpacity = (s: Live, v: View) => (s.hintArmed && v.fine ? clamp01((v.progress - 0.1) / 0.03) * (1 - clamp01((v.progress - 0.29) / 0.03)) : 0);
const sceneState = (s: Live, v: View, phase: ResearchPhase, signal: number | null, climax: ResearchClimax = CLIMAX_REST): SceneState => ({
  live: s.live, liveEval: s.liveEval, committed: s.committedEval, committedUser: s.commitBy !== "default", preview: s.preview, phase,
  viewYaw: v.yaw, viewPitch: v.pitch, hover: v.hover, dragging: v.dragging, hint: hintOpacity(s, v), signal, runnerUpLabel: s.runnerUpLabel, climax,
});
/** The 700 ms signal (presentation only, never a computation delay): position along the route, or null once finished. */
function signalAt(v: View, now: number) {
  if (v.signalStart < 0) return null;
  const t = (now - v.signalStart) / 700;
  if (t >= 1) { v.signalStart = -1; return null; }
  return ease(t);
}
/** Projection lines through the dark-to-paper band at the screen x of the axis vertices, interrupted around the intro. */
function drawRegistration(reg: SVGSVGElement, block: HTMLElement, flat: Camera, gradientId: string) {
  const W = block.clientWidth, H = block.clientHeight, band = THRESHOLD.height(innerWidth), top = block.getBoundingClientRect().top;
  const avoid = Array.from(block.querySelectorAll<HTMLElement>(".eco-label, h2, .eco-section-heading > p")).map((el) => {
    const r = el.getBoundingClientRect();
    return { x0: r.left - 24, x1: r.right + 24, y0: r.top - top - 24, y1: r.bottom - top + 24 };
  });
  const xs = AXIS.map((nid) => flat.ox + flat.k * (RESEARCH_NETWORK.nodes.find((n) => n.id === nid)!.x - 500));
  const lines = xs.map((x, i) => {
    let y = i % 2 ? 150 : 90;
    const segments: string[] = [];
    for (const box of avoid.filter((b) => x >= b.x0 && x <= b.x1).sort((a, b) => a.y0 - b.y0)) {
      if (box.y0 > y) segments.push(`M${x.toFixed(1)},${y.toFixed(1)}V${box.y0.toFixed(1)}`);
      y = Math.max(y, box.y1);
    }
    if (y < H) segments.push(`M${x.toFixed(1)},${y.toFixed(1)}V${H}`);
    return `<path d="${segments.join("")}"${i % 3 === 1 ? ' stroke-dasharray="2 6"' : ""}/>`;
  }).join("");
  const crosses = xs.filter((_, i) => i % 3 === 0).map((x) => `M${(x - 6).toFixed(1)},50h12M${x.toFixed(1)},44v12`).join("");
  reg.setAttribute("viewBox", `0 0 ${W} ${H}`); reg.setAttribute("width", String(W)); reg.setAttribute("height", String(H));
  reg.innerHTML = `<defs><linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}">`
    + `<stop offset="0" stop-color="#f4f2eb" stop-opacity="0"/><stop offset="${(140 / H).toFixed(3)}" stop-color="#f4f2eb" stop-opacity=".22"/>`
    + `<stop offset="${((0.55 * band) / H).toFixed(3)}" stop-color="#9a9c90" stop-opacity=".06"/><stop offset="${(band / H).toFixed(3)}" stop-color="#1f2a23" stop-opacity=".16"/>`
    + `<stop offset="1" stop-color="#1f2a23" stop-opacity=".2"/></linearGradient></defs>`
    + `<g fill="none" stroke="url(#${gradientId})" stroke-width="1">${lines}</g><path class="rf-reg-cross" d="${crosses}"/>`;
}

export default function EcosystemResearch({ locale }: Pick<HomeSectionProps, "locale">) {
  const copy = homeCopy[locale];
  const uid = `rf${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [profile, setProfile] = useState<Profile>(resolveProfile);
  const [fits, setFits] = useState(true);
  const [orient, setOrient] = useState<Orientation>(staticOrientation);
  const [failed, setFailed] = useState(false);
  const [live, setLive] = useState<Constraint>(DEFAULT_CONSTRAINT);
  const [commit, setCommit] = useState<Commit>({ c: DEFAULT_CONSTRAINT, by: "default", n: 0 });
  const [announcement, setAnnouncement] = useState("");
  const [hintArmed, setHintArmed] = useState(true);
  const mode: Profile = failed || !fits ? "static" : profile;
  const pinned = mode !== "static";
  const sceneOrient: Orientation = pinned ? "landscape" : orient;
  const liveEval = useMemo(() => evaluate(RESEARCH_NETWORK, live), [live]);
  const committedEval = useMemo(() => evaluate(RESEARCH_NETWORK, commit.c), [commit.c]);
  const preview = !sameConstraint(live, commit.c);
  const committedText = useMemo(() => describe(copy, locale, committedEval, sceneOrient), [copy, locale, committedEval, sceneOrient]);
  const liveText = useMemo(() => describe(copy, locale, liveEval, sceneOrient), [copy, locale, liveEval, sceneOrient]);

  const entrance = useRef<HTMLDivElement>(null), registration = useRef<SVGSVGElement>(null);
  const track = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null), art = useRef<SVGSVGElement>(null);
  const flatArt = useRef<SVGSVGElement>(null), terrainArt = useRef<SVGSVGElement>(null), map = useRef<SVGSVGElement>(null);
  const hint = useRef<HTMLDivElement>(null), titleA = useRef<HTMLSpanElement>(null), titleB = useRef<HTMLSpanElement>(null);
  const note = useRef<HTMLParagraphElement>(null), phaseIndex = useRef<HTMLSpanElement>(null), fitProbe = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLDivElement>(null), alongInput = useRef<HTMLInputElement>(null), acrossInput = useRef<HTMLInputElement>(null);
  const thesis = useRef<HTMLParagraphElement>(null), domainItems = useRef<HTMLLIElement[]>([]), mission = useRef<HTMLParagraphElement>(null);
  // useScroll (framer-motion 12) binds once per target ref and must never see an unattached ref: its deferred start for a
  // pending ref is later stopped by a cleanup that also stops the next binding. While static it gets no target at all, so
  // every pinned mount re-binds it to the track in the layout phase (a static first mount no longer leaves the clock on
  // whole-page progress).
  const { scrollYProgress } = useScroll({ target: pinned ? track : undefined, offset: ["start 84px", "end end"] });

  // Imperative writers read the newest React state through these refs; input never waits for the scroll clock.
  const view = useRef<View>({ hover: false, dragging: false, fine: false, signalStart: -1, pulsed: -1, yaw: 0, pitch: 0, yawTarget: 0, pitchTarget: 0, progress: 0 });
  const latest = useRef<Live>({ live: DEFAULT_CONSTRAINT, liveEval, committedEval, commitBy: "default", commitN: 0, preview: false, hintArmed: true, runnerUpLabel: "" });
  const redraw = useRef<() => void>(() => undefined);
  const flatCamera = useRef<{ cam: Camera; orient: Orientation } | null>(null);
  const dragEnd = useRef<() => void>(() => undefined);

  // Profile, orientation, zoom and reduced-motion changes recompose; the constraint and commit are kept.
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_QUERY), fine = window.matchMedia(FINE_QUERY);
    const update = () => { view.current.fine = fine.matches; setProfile(resolveProfile()); setOrient(staticOrientation()); setFits(true); };
    view.current.fine = fine.matches;
    reduced.addEventListener("change", update); fine.addEventListener("change", update); window.addEventListener("resize", update);
    return () => { reduced.removeEventListener("change", update); fine.removeEventListener("change", update); window.removeEventListener("resize", update); };
  }, []);

  // ---------------------------------------------------------------- commit / evaluate / reset
  const commitNow = useCallback((c: Constraint, by: Commit["by"], announce: string | null) => {
    flushSync(() => {
      setLive(c);
      setCommit((previous) => ({ c, by, n: previous.n + 1 }));
      if (announce !== null) setAnnouncement((previous) => (previous === announce ? `${announce}${String.fromCharCode(160)}` : announce));
    });
    if (by === "user" && !window.matchMedia(REDUCED_QUERY).matches) view.current.signalStart = performance.now();
    if (by !== "user") view.current.signalStart = -1;
    redraw.current();
  }, []);
  const moveLive = useCallback((next: Constraint) => {
    const c = quantize(next);
    if (sameConstraint(c, latest.current.live)) return;
    flushSync(() => { setHintArmed(false); setLive(c); });
  }, []);
  const evaluateNow = () => commitNow(latest.current.live, "user", describe(copy, locale, latest.current.liveEval, sceneOrient).live);
  const resetNow = () => commitNow(DEFAULT_CONSTRAINT, "reset",
    fill(copy.researchLive.reset, { result: describe(copy, locale, evaluate(RESEARCH_NETWORK, DEFAULT_CONSTRAINT), sceneOrient).live }));

  // ---------------------------------------------------------------- one input contract (FIX3): every way of moving the zone
  // (drag, slider by pointer or touch, keys) only previews the solver's live result; Evaluate commits it, Reset restores the
  // default. Nothing commits on release.
  const sliderKeys = (axis: "x" | "y") => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "PageUp" && event.key !== "PageDown") return;
    event.preventDefault();
    const c = latest.current.live, delta = event.key === "PageUp" ? 50 : -50;
    moveLive(axis === "x" ? { x: c.x + delta, y: c.y } : { x: c.x, y: c.y + delta });
  };

  // ---------------------------------------------------------------- pinned stage: one scroll clock (ω = 20), one SVG writer
  useLayoutEffect(() => {
    if (!pinned) return;
    const trackNode = track.current, stageNode = stage.current, svg = art.current, mapSvg = map.current, resultNode = result.current;
    if (!trackNode || !stageNode || !svg || !mapSvg || !resultNode) return;
    const mapNode = mapSvg.parentElement;
    let scene: ResearchScene, placeMarker: (c: Constraint) => void;
    try {
      scene = createResearchScene(svg, "stage", sceneCopyOf(copy), uid);
      placeMarker = createMinimap(mapSvg, DECISION_MINIMAP.rows, DECISION_MINIMAP.step);
    } catch { queueMicrotask(() => setFailed(true)); return; }
    let stopped = false, measured = false, frame = 0, last = 0, snapUntil = 0, lastPhase = -1, lastTitle = -1, lastReveal = 0;
    let motion: HomeSpatialMotionState = { value: 0, velocity: 0 }, target = 0, hintAbove: { w: number; h: number } | null = null;
    // The clock runs on the whole track (legacy story + FIX1 climax); RESEARCH_PACING authors how much of its travel each
    // beat takes (FIX3), after the smoothing, so the clock itself stays one spring on physical scroll.
    const legacyAt = (track: number) => paceResearchTrack(track).legacy;
    // Any later failure (layout, drawing) stops the clock and recomposes as the honest static fallback.
    const fail = () => { if (stopped) return; stopped = true; cancelAnimationFrame(frame); queueMicrotask(() => setFailed(true)); };
    const readTarget = () => {
      const rect = trackNode.getBoundingClientRect();
      return clamp01((84 - rect.top) / Math.max(1, rect.height - stageNode.offsetHeight));
    };
    // FIX3 mission line (one line in the band): the richest wording that fits — eyebrow, mission and explainer; then without
    // the eyebrow; then the short explainer; then the mission alone. Hidden parts stay in the accessibility tree.
    const fitMission = () => {
      const m = mission.current;
      if (!m) return;
      for (const f of ["full", "body", "short", "title"]) { m.dataset.fit = f; if (m.scrollWidth <= m.clientWidth + 1) break; }
    };
    document.fonts?.ready.then(() => { if (!stopped) fitMission(); });
    const measure = () => {
      const H = stageNode.clientHeight, rail = document.querySelector<HTMLElement>(".home-section-rail")?.getBoundingClientRect();
      const formula = artBox(innerWidth, H, document.documentElement.clientWidth);
      const box = rail && rail.width ? clampArtToRail(formula, rail.left) : formula;
      const flat = fit(flatBox("landscape"), box, LAYOUT.flatFill), terrain = fit(TERRAIN_UNION.landscape, box, LAYOUT.maxFill);
      // The hint only shows before any input, i.e. beside the default handle: right of it (board), or centred above the
      // selection ring when it would cover the destination label (box as the scene places it) or leave the art box.
      const hintNode = hint.current, T = RESEARCH_NETWORK.nodes.find((n) => n.id === "T");
      let hintBox: { x0: number; y0: number; x1: number; y1: number } | null = null;
      hintAbove = null;
      if (hintNode && T) {
        const k = flat.k, hx = flat.ox + k * (DEFAULT_CONSTRAINT.x - 500), hy = flat.oy + k * (DEFAULT_CONSTRAINT.y - 300), x0 = hx + k * RULE.core + 22;
        const tx = flat.ox + k * (T.x - 500) - 26, ty = flat.oy + k * (T.y - 300) + 50, tw = `T · ${copy.researchDestination}`.length * 10.5 * 0.7;
        const w = hintNode.offsetWidth, h = hintNode.offsetHeight;
        const coversT = x0 < tx + 8 && x0 + w > tx - tw - 8 && hy - 16 < ty + 11 && hy - 16 + h > ty - 19;
        if (coversT || x0 + w > box.x1) {
          hintAbove = { w, h };
          const top = hy - k * (RULE.core + 9) - 10 - h;
          hintBox = { x0: hx - w / 2, y0: top, x1: hx + w / 2, y1: top + h };
        } else hintBox = { x0, y0: hy - 16, x1: x0 + w, y1: hy - 16 + h };
      }
      stageNode.dataset.layout = box.layout;
      // FIX1 climax: the final camera, and the environment the ground grows to (the safe stage between the top row and the
      // controls, clear of the side column and the Rail; it bleeds to the screen edge only on the open left).
      const sr = stageNode.getBoundingClientRect(), side = box.layout === "side";
      const topRow = stageNode.querySelector(".eco-rf-toprow")?.getBoundingClientRect(), band = stageNode.querySelector(".eco-rf-controls--band")?.getBoundingClientRect();
      const railLeft = rail && rail.width ? rail.left - sr.left : box.x1 + 300, right = Math.min(stageNode.clientWidth, railLeft - 8);
      const top = topRow ? topRow.bottom - sr.top : box.y0;
      const env = side ? { x0: band ? band.right - sr.left + 32 : box.x0, y0: top, x1: right, y1: H }
        : { x0: 0, y0: top, x1: right, y1: band ? band.top - sr.top : box.y1 };
      // FIX2: the practice statement takes the settle note's slot. Where it would run more than a line longer than the note
      // (narrow slots), only its lead sentence shows; the rest stays in the accessibility tree. The four domain labels
      // (measured here, never in the frame loop) keep their row below both, inside the art box, clear of the side column
      // and the Rail.
      const noteNode = note.current, thesisNode = thesis.current;
      let textBottom = top;
      if (noteNode && thesisNode) {
        // The statement only shows at the hold, where the phase index reads its last entry; the note's slot is sized as it
        // is there (the index text is wider or narrower in other phases).
        const index = phaseIndex.current;
        let delta = 0;
        if (index && index.offsetWidth) {
          const text = index.textContent, width = index.offsetWidth;
          index.textContent = `05 / 05 · ${copy.researchPhaseIndex[4]}`; delta = width - index.offsetWidth; index.textContent = text;
        }
        thesisNode.style.left = `${noteNode.offsetLeft}px`; thesisNode.style.top = `${noteNode.offsetTop}px`;
        thesisNode.style.width = `${Math.max(200, Math.min(600, noteNode.offsetWidth + delta))}px`;
        delete thesisNode.dataset.fit;
        if (thesisNode.offsetHeight > noteNode.offsetHeight + 22) thesisNode.dataset.fit = "lead";
        textBottom = Math.max(top, thesisNode.getBoundingClientRect().bottom - sr.top);
      }
      fitMission();
      const labels = domainItems.current.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));
      // Labels sit at their stems; only when the row has to step around a raised vertex may it use the open ground to the
      // screen's left edge (band layout) or up to 24 px before the Rail.
      const domains = { labels, top: textBottom + 16, x0: side ? env.x0 + 12 : 16, x1: railLeft - 24 };
      // Edge fades (left, top, right, bottom): a tall top fade reads as distance haze under the title row.
      const climax = { camera: climaxFit(box, railLeft), env, fade: side ? [40, 120, 64, 24] as const : [0, 120, 64, 48] as const, domains };
      scene.setLayout({ width: stageNode.clientWidth, height: H, art: box, flat, terrain, orient: "landscape", compact: false, labels: true, avoid: hintBox ? [hintBox] : [], climax });
      flatCamera.current = { cam: flat, orient: "landscape" };
      if (registration.current && entrance.current) drawRegistration(registration.current, entrance.current, flat, `${uid}-proj`);
      measured = true;
      // Content fit on the longest string of every slot at full type size, and the four domain labels on one row; overflow
      // recomposes as the static flow.
      const probe = fitProbe.current, row = labels.reduce((sum, l) => sum + l.w, 0) + DOMAIN_LABEL_GAP.x * (labels.length - 1);
      if ((probe && Array.from(probe.children).some((el) => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) || row > domains.x1 - domains.x0) {
        stopped = true; queueMicrotask(() => setFits(false));
      }
    };
    const paint = (now: number) => {
      if (stopped || !measured) return;
      const v = view.current, split = paceResearchTrack(motion.value), p = split.legacy, phase = resolveResearchPhase(p), state = latest.current;
      const climax = resolveResearchClimax(split.climax), aim = paceResearchTrack(target);
      v.progress = p;
      if (!phase.viewpoint) { v.yawTarget = 0; v.pitchTarget = 0; }
      // The default commit pulses once per commit, when its reveal first completes while scrolling forward.
      if (state.commitBy === "default" && !state.preview && v.pulsed !== state.commitN && lastReveal < 1 && phase.reveal >= 1 && target > motion.value - 1e-6
        && !window.matchMedia(REDUCED_QUERY).matches) { v.signalStart = now; v.pulsed = state.commitN; }
      lastReveal = phase.reveal;
      scene.render(sceneState(state, v, phase, signalAt(v, now), climax));
      placeMarker(state.live);
      // data-progress / data-target stay on the legacy story's scale; data-climax / data-climax-target follow the continuation.
      const progressText = p.toFixed(4), targetText = aim.legacy.toFixed(4), revealed = String(phase.resultShown);
      const climaxText = split.climax.toFixed(4), climaxTargetText = aim.climax.toFixed(4);
      if (stageNode.dataset.progress !== progressText) stageNode.dataset.progress = progressText;
      if (stageNode.dataset.target !== targetText) stageNode.dataset.target = targetText;
      if (stageNode.dataset.climax !== climaxText) stageNode.dataset.climax = climaxText;
      if (stageNode.dataset.climaxTarget !== climaxTargetText) stageNode.dataset.climaxTarget = climaxTargetText;
      if (resultNode.dataset.revealed !== revealed) resultNode.dataset.revealed = revealed;
      // The supplementary decision map steps aside while the ground fills the band layout (it stays in the side column).
      const mapOpacity = String(Math.round(phase.grid * (stageNode.dataset.layout === "side" ? 1 : 1 - climax.expand) * 1000) / 1000);
      if (mapNode && mapNode.style.opacity !== mapOpacity) mapNode.style.opacity = mapOpacity;
      if (phase.index !== lastPhase) {
        lastPhase = phase.index;
        stageNode.dataset.phase = String(phase.index);
        if (phaseIndex.current) phaseIndex.current.textContent = `0${phase.index + 1} / 05 · ${copy.researchPhaseIndex[phase.index]}`;
      }
      if (phase.title !== lastTitle && titleA.current && titleB.current) {
        lastTitle = phase.title;
        titleA.current.style.opacity = String(Math.max(0, 1 - 2 * phase.title));
        titleB.current.style.opacity = String(Math.max(0, 2 * phase.title - 1));
        titleA.current.setAttribute("aria-hidden", String(phase.title >= 0.5));
        titleB.current.setAttribute("aria-hidden", String(phase.title < 0.5));
      }
      // At the end of the climax the settle note hands its slot to the practice statement (one value, like the title).
      const noteOpacity = String(Math.round(phase.note * Math.max(0, 1 - 2 * climax.thesis) * 1000) / 1000);
      if (note.current && note.current.style.opacity !== noteOpacity) note.current.style.opacity = noteOpacity;
      const thesisOpacity = String(Math.round(Math.max(0, 2 * climax.thesis - 1) * 1000) / 1000);
      if (thesis.current && thesis.current.style.opacity !== thesisOpacity) thesis.current.style.opacity = thesisOpacity;
      // Each domain label follows its stem (the scene places the row) and resolves with its own ramp, rising 6 px.
      const domainLabels = scene.domains();
      domainItems.current.forEach((el, i) => {
        const d = domainLabels?.[i], o = d ? Math.round(d.opacity * 1000) / 1000 : 0, opacity = String(o);
        if (el.style.opacity !== opacity) el.style.opacity = opacity;
        if (!d || !o) return;
        const transform = `translate(${d.x.toFixed(1)}px, ${(d.y + 6 * (1 - o)).toFixed(1)}px)`;
        if (el.style.transform !== transform) el.style.transform = transform;
      });
      const handle = scene.handle(), h = hint.current;
      if (h && handle) {
        const o = String(Math.round(hintOpacity(state, v) * 1000) / 1000);
        if (h.style.opacity !== o) { h.style.opacity = o; h.style.visibility = o !== "0" ? "visible" : "hidden"; }
        const hx = hintAbove ? handle.x - hintAbove.w / 2 : handle.x + handle.r + 22;
        const hy = hintAbove ? handle.y - (handle.r * (RULE.core + 9)) / RULE.core - 10 - hintAbove.h : handle.y - 16;
        const transform = `translate(${hx.toFixed(1)}px, ${hy.toFixed(1)}px)`;
        if (o !== "0" && h.style.transform !== transform) h.style.transform = transform;
      }
    };
    const draw = (now: number) => { try { paint(now); } catch { fail(); } };
    const busy = () => {
      const v = view.current;
      return motion.velocity !== 0 || motion.value !== target || v.signalStart >= 0 || v.yaw !== v.yawTarget || v.pitch !== v.pitchTarget;
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? (now - last) / 1000 : 1 / 60, v = view.current;
      last = now;
      motion = stepHomeSpatialMotion(motion, target, dt, RESEARCH_MOTION.omega);
      // A drag that reaches the morph ends and releases its pointer capture (the candidate stays a preview).
      if (v.dragging && !resolveResearchPhase(legacyAt(motion.value)).drag) dragEnd.current();
      const k = 1 - Math.exp(-Math.min(dt, 0.05) / 0.04);
      v.yaw += (v.yawTarget - v.yaw) * k; v.pitch += (v.pitchTarget - v.pitch) * k;
      if (Math.abs(v.yawTarget - v.yaw) < 1e-3 && Math.abs(v.pitchTarget - v.pitch) < 1e-3) { v.yaw = v.yawTarget; v.pitch = v.pitchTarget; }
      draw(now);
      if (!stopped && busy()) frame = requestAnimationFrame(tick); else last = 0;
    };
    const wake = () => { if (!frame && !stopped) frame = requestAnimationFrame(tick); };
    const follow = (p: number) => {
      // Flagged navigation and unknown single jumps over .75 of the legacy travel arrive at their destination; wheel, keys and
      // touch are smoothed.
      if (performance.now() < snapUntil || Math.abs(p - target) > RESEARCH_MOTION.unknownJump * RESEARCH_LEGACY_END) {
        target = p; motion = { value: p, velocity: 0 }; lastReveal = resolveResearchPhase(legacyAt(p)).reveal;
        draw(performance.now());
        if (busy()) wake();
        return;
      }
      target = p;
      wake();
    };
    const onProgrammatic = () => { snapUntil = performance.now() + 1500; };
    const endProgrammatic = () => { snapUntil = 0; };
    const relayout = () => {
      try { measure(); } catch { fail(); return; }
      target = readTarget(); motion = { value: target, velocity: 0 }; lastReveal = resolveResearchPhase(legacyAt(target)).reveal; draw(performance.now());
    };
    redraw.current = () => { if (stopped) return; draw(performance.now()); if (busy()) wake(); };
    relayout();
    const unsubscribe = scrollYProgress.on("change", follow);
    const observer = new ResizeObserver(relayout);
    observer.observe(stageNode);
    if (entrance.current) observer.observe(entrance.current);
    window.addEventListener(PROGRAMMATIC_SCROLL_EVENT, onProgrammatic);
    window.addEventListener("scrollend", endProgrammatic);
    window.addEventListener("wheel", endProgrammatic, { passive: true });
    window.addEventListener("touchstart", endProgrammatic, { passive: true });
    window.addEventListener("keydown", endProgrammatic);
    return () => {
      stopped = true; cancelAnimationFrame(frame); unsubscribe(); observer.disconnect();
      window.removeEventListener(PROGRAMMATIC_SCROLL_EVENT, onProgrammatic);
      window.removeEventListener("scrollend", endProgrammatic);
      window.removeEventListener("wheel", endProgrammatic);
      window.removeEventListener("touchstart", endProgrammatic);
      window.removeEventListener("keydown", endProgrammatic);
      redraw.current = () => undefined; flatCamera.current = null;
      scene.destroy();
    };
  }, [pinned, mode, copy, uid, scrollYProgress]);

  // ---------------------------------------------------------------- static flow: flat field + separate terrain, one evaluation
  useLayoutEffect(() => {
    if (pinned) return;
    const flatSvg = flatArt.current, terrainSvg = terrainArt.current, host = flatSvg?.parentElement;
    if (!flatSvg || !terrainSvg || !host) return;
    let flatScene: ResearchScene, terrainScene: ResearchScene;
    try {
      flatScene = createResearchScene(flatSvg, "flat", sceneCopyOf(copy), `${uid}f`);
      terrainScene = createResearchScene(terrainSvg, "terrain", sceneCopyOf(copy), `${uid}t`);
    } catch { flatSvg.replaceChildren(); terrainSvg.replaceChildren(); queueMicrotask(() => setFailed(true)); return; }
    let stopped = false, frame = 0;
    // A failure blanks the art and recomposes without controls or the "recalculated" claim.
    const fail = () => {
      if (stopped) return;
      stopped = true; cancelAnimationFrame(frame); flatSvg.replaceChildren(); terrainSvg.replaceChildren(); queueMicrotask(() => setFailed(true));
    };
    const layout = () => {
      const width = Math.max(240, host.clientWidth), fb = flatBox(orient), u = TERRAIN_UNION[orient], small = innerWidth < 600;
      const cap = orient === "landscape" ? Math.max(300, 0.78 * innerHeight) : Infinity;
      // The union bounds hold vertex centres: inset by the anchor disc and its inner halo so nothing functional is clipped.
      const pad = small ? 20 : 28;
      const kF = Math.min(width / (fb.x1 - fb.x0), cap / (fb.y1 - fb.y0)), kT = Math.min((width - 2 * pad) / (u.x1 - u.x0), cap / (u.y1 - u.y0));
      const fh = kF * (fb.y1 - fb.y0), th = kT * (u.y1 - u.y0) + 2 * pad;
      const flat: Camera = { k: kF, ox: width / 2, oy: -kF * fb.y0 }, terrain: Camera = { k: kT, ox: width / 2 - (kT * (u.x0 + u.x1)) / 2, oy: pad - kT * u.y0 };
      flatScene.setLayout({ width, height: fh, art: { x0: 0, y0: 0, x1: width, y1: fh }, flat, terrain: flat, orient, compact: small, labels: !small });
      terrainScene.setLayout({ width, height: th, art: { x0: 0, y0: 0, x1: width, y1: th }, flat: terrain, terrain, orient, compact: small, labels: false });
      flatCamera.current = { cam: flat, orient };
    };
    const measure = () => { try { layout(); } catch { fail(); } };
    const draw = (now: number) => {
      if (stopped) return;
      const v = view.current, signal = signalAt(v, now);
      try {
        flatScene.render(sceneState(latest.current, v, COMPLETE, signal));
        terrainScene.render(sceneState(latest.current, v, { ...COMPLETE, s: 1 }, signal));
      } catch { fail(); return; }
      if (v.signalStart >= 0 && !frame) frame = requestAnimationFrame((ts) => { frame = 0; draw(ts); });
    };
    measure();
    redraw.current = () => draw(performance.now());
    draw(performance.now());
    const observer = new ResizeObserver(() => { measure(); draw(performance.now()); });
    observer.observe(host);
    return () => {
      stopped = true; cancelAnimationFrame(frame); observer.disconnect();
      redraw.current = () => undefined; flatCamera.current = null;
      flatScene.destroy(); terrainScene.destroy();
    };
  }, [pinned, orient, copy, uid]);

  // Every state change reaches the writers in the same frame as the input that caused it.
  useLayoutEffect(() => {
    latest.current = { live, liveEval, committedEval, commitBy: commit.by, commitN: commit.n, preview, hintArmed, runnerUpLabel: committedText.runnerUpLabel };
    redraw.current();
  });

  // ---------------------------------------------------------------- fine-pointer drag on the flat plan (stage p < .48, or the static field)
  useEffect(() => {
    const svg = pinned ? art.current : flatArt.current;
    if (!svg) return;
    let pointerId = -1;
    const toSvg = (event: PointerEvent) => {
      const m = svg.getScreenCTM();
      return m ? new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse()) : null;
    };
    const canDrag = () => view.current.fine && Boolean(flatCamera.current) && (!pinned || view.current.progress < 0.48);
    const hit = (event: PointerEvent) => {
      const p = toSvg(event), f = flatCamera.current;
      if (!p || !f) return false;
      const c = latest.current.live, portrait = f.orient === "portrait";
      const x = f.cam.ox + f.cam.k * (portrait ? c.y - 300 : c.x - 500), y = f.cam.oy + f.cam.k * (portrait ? c.x - 500 : c.y - 300);
      return Math.hypot(p.x - x, p.y - y) <= Math.max(22, f.cam.k * 68);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0 || !canDrag() || !hit(event)) return;
      event.preventDefault();
      pointerId = event.pointerId;
      svg.setPointerCapture(pointerId);
      view.current.dragging = true;
      svg.style.cursor = "grabbing";
      flushSync(() => setHintArmed(false));
    };
    const onMove = (event: PointerEvent) => {
      if (view.current.dragging && event.pointerId === pointerId) {
        const p = toSvg(event), f = flatCamera.current;
        if (p && f) moveLive(constraintFromFlat(p.x, p.y, f.cam, f.orient));
        return;
      }
      if (event.pointerType === "touch") return;
      const over = canDrag() && hit(event);
      if (over !== view.current.hover) { view.current.hover = over; svg.style.cursor = over ? "grab" : ""; redraw.current(); }
      // Settle: a bounded ±3° / ±2° viewpoint that eases in 120 ms and returns to rest.
      if (pinned && view.current.progress >= 0.84 && view.current.fine) {
        const r = svg.getBoundingClientRect();
        view.current.yawTarget = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1));
        view.current.pitchTarget = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1));
        redraw.current();
      }
    };
    const finish = () => {
      if (!view.current.dragging) return;
      view.current.dragging = false;
      svg.style.cursor = view.current.hover ? "grab" : "";
      if (pointerId >= 0 && svg.hasPointerCapture(pointerId)) svg.releasePointerCapture(pointerId);
      pointerId = -1;
      redraw.current();
    };
    const onLeave = () => {
      view.current.yawTarget = 0; view.current.pitchTarget = 0;
      if (view.current.hover) { view.current.hover = false; svg.style.cursor = ""; }
      redraw.current();
    };
    dragEnd.current = finish;
    svg.addEventListener("pointerdown", onDown);
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerup", finish);
    svg.addEventListener("lostpointercapture", finish);
    svg.addEventListener("pointerleave", onLeave);
    return () => {
      svg.removeEventListener("pointerdown", onDown); svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", finish); svg.removeEventListener("lostpointercapture", finish);
      svg.removeEventListener("pointerleave", onLeave);
      dragEnd.current = () => undefined;
    };
  }, [pinned, moveLive]);

  // ---------------------------------------------------------------- markup
  const resultMode = preview ? "preview" : commit.by !== "default" || !pinned ? "result" : "auto";
  const acrossEnds = sceneOrient === "portrait" ? copy.researchEnds.acrossPortrait : copy.researchEnds.across;
  const side = acrossSide(live.y), acrossKey = side === "on" ? "on" : sceneOrient === "portrait" ? (side === "above" ? "left" : "right") : side;
  const alongPct = sliderPercent("along", live.x), acrossPct = sliderPercent("across", live.y);
  const longest = (values: string[]) => values.reduce((a, b) => (b.length > a.length ? b : a), "");
  // Content-fit probe: the longest status and the longest consequence (every class word, 15 links, a long cost) on one line.
  const worstConsequence = fill(copy.researchConsequence.route, { cls: longest(Object.values(copy.researchClass)), links: fill(copy.researchLinks.other, { n: 15 }), a: "1,111.11" });
  // FIX3 mission: what the zone is for, what moving it does, and what the solver decided, beside the controls that move it.
  const controls = (variant: "band" | "static") => <div className={`eco-rf-controls eco-rf-controls--${variant}`} data-sound-safe-area="">
    <p ref={mission} className="eco-rf-mission">
      <span className="eco-rf-mission-eyebrow">{copy.researchMission.eyebrow}</span>
      <strong className="eco-rf-mission-title">{copy.researchMission.title}</strong>
      <span className="eco-rf-mission-body">{copy.researchMission.body}</span>
      <span className="eco-rf-mission-short" aria-hidden="true">{copy.researchMission.short}</span>
    </p>
    <div className="eco-rf-slider">
      <label htmlFor={`${uid}-along`}><span className="eco-rf-slider-name">{copy.researchZone.along}</span><span className="eco-rf-slider-axis">{copy.researchAlong}</span><b aria-hidden="true">{alongPct}%</b></label>
      <input ref={alongInput} id={`${uid}-along`} type="range" min={CONSTRAINT.xMin} max={CONSTRAINT.xMax} step={CONSTRAINT.step} value={live.x}
        style={{ "--rf-fill": `${alongPct}%` } as CSSProperties} aria-valuetext={fill(copy.researchAlongValue, { n: alongPct })} onKeyDown={sliderKeys("x")}
        onChange={(event) => moveLive({ x: Number(event.currentTarget.value), y: latest.current.live.y })} />
      <span className="eco-rf-ends" aria-hidden="true"><span>{copy.researchEnds.along[0]}</span><span>{copy.researchEnds.along[1]}</span></span>
    </div>
    <div className="eco-rf-slider">
      <label htmlFor={`${uid}-across`}><span className="eco-rf-slider-name">{copy.researchZone.across}</span><span className="eco-rf-slider-axis">{copy.researchAcross}</span>
        <b aria-hidden="true">{acrossPct}% · {copy.researchAcrossSide[acrossKey]}</b></label>
      <input ref={acrossInput} id={`${uid}-across`} type="range" min={CONSTRAINT.yMin} max={CONSTRAINT.yMax} step={CONSTRAINT.step} value={live.y}
        style={{ "--rf-fill": `${acrossPct}%` } as CSSProperties} aria-valuetext={fill(copy.researchAcrossValue[acrossKey], { n: acrossPct })} onKeyDown={sliderKeys("y")}
        onChange={(event) => moveLive({ x: latest.current.live.x, y: Number(event.currentTarget.value) })} />
      <span className="eco-rf-ends" aria-hidden="true"><span>{acrossEnds[0]}</span><span>{acrossEnds[1]}</span></span>
    </div>
    <div className="eco-rf-actions">
      <button type="button" className="eco-rf-evaluate" onClick={evaluateNow} data-pending={preview ? "true" : undefined}>{copy.researchEvaluate}</button>
      <button type="button" className="eco-rf-reset" onClick={resetNow}>{copy.researchReset}</button>
    </div>
    <div ref={variant === "band" || !pinned ? result : undefined} className="eco-rf-result" data-mode={resultMode}>
      <span className="eco-rf-status" data-v="idle">{copy.researchStatus.idle}</span>
      <span className="eco-rf-status" data-v="result">{copy.researchStatus.evaluated}</span>
      <span className="eco-rf-status" data-v="preview">{copy.researchStatus.preview}</span>
      <p className="eco-rf-sentence"><span data-v="idle">{copy.researchRule}</span><span data-v="result">{committedText.consequence}</span><span data-v="preview">{liveText.consequence}</span></p>
      <p className="eco-rf-readout"><span data-v="result">{committedText.detail}</span><span data-v="preview">{liveText.detail}</span></p>
    </div>
  </div>;

  return <HomeSection id="research" className="eco-rf" scene="research-field">
    <div ref={entrance} className="eco-rf-entrance" data-profile={mode}>
      <div className="eco-rf-threshold" aria-hidden="true" data-home-rail-seam-band="">
        <span className="eco-rf-marker eco-rf-marker--header" data-header-scene="research-threshold" />
        <span className="eco-rf-marker eco-rf-marker--rail" data-home-research-dark="" />
      </div>
      {pinned && <svg ref={registration} className="eco-rf-registration" aria-hidden="true" focusable="false" />}
      <div className="eco-rf-intro eco-wrap">
        <SectionLabel number="06">{copy.research} / {copy.worlds}</SectionLabel>
        <div className="eco-section-heading"><h2 id="research-title">{copy.researchTitle}</h2><p>{failed ? copy.researchIntroStatic : copy.researchIntro}</p></div>
      </div>
    </div>
    {pinned ? <div ref={track} className="eco-rf-track" data-profile={mode}>
      <div ref={stage} className="eco-rf-stage" data-sound-safe-area="" data-phase="0">
        <svg ref={art} className="eco-rf-art" role="img" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-desc`} focusable="false" />
        <p id={`${uid}-desc`} className="eco-rf-sr">{copy.researchArtDesc} {copy.researchTerrainDesc} {copy.researchDomainsDesc}</p>
        <div className="eco-rf-toprow">
          <span className="eco-rf-stage-label">06 · {copy.researchStage}</span>
          <h3 id={`${uid}-title`} className="eco-rf-title"><span ref={titleA}>{copy.researchPhaseA}</span><span ref={titleB} aria-hidden="true" style={{ opacity: 0 }}>{copy.researchPhaseB}</span></h3>
          <p ref={note} className="eco-rf-note" style={{ opacity: 0 }}>{copy.researchNote}</p>
          <p ref={thesis} className="eco-rf-thesis" style={{ opacity: 0 }}><strong>{copy.researchThesis.lead}</strong> <span>{copy.researchThesis.body}</span></p>
          <span ref={phaseIndex} className="eco-rf-phase" aria-hidden="true" />
        </div>
        <ul className="eco-rf-domains" aria-label={copy.researchDomainsLabel}>
          {RESEARCH_DOMAINS.map((d, i) => <li key={d.id} ref={(el) => { if (el) domainItems.current[i] = el; }} data-domain={d.id} style={{ opacity: 0 }}>
            <span className="eco-rf-domain-name">{copy.researchDomains[d.id].name}</span><span className="eco-rf-sr">: </span><span className="eco-rf-domain-note">{copy.researchDomains[d.id].note}</span>
          </li>)}
        </ul>
        <div ref={hint} className="eco-rf-hint" aria-hidden="true">{copy.researchDrag}</div>
        <div className="eco-rf-map" aria-hidden="true">
          <p>{copy.researchMap.title}</p>
          <svg ref={map} className="eco-rf-map-art" focusable="false" />
          <p className="eco-rf-map-legend"><span data-k="d">{copy.researchMap.direct}</span><span data-k="a">{copy.researchMap.above}</span><span data-k="b">{copy.researchMap.below}</span></p>
        </div>
        {controls("band")}
        <div ref={fitProbe} className="eco-rf-fit" aria-hidden="true">
          <div className="eco-rf-fit-title"><span>{longest([copy.researchPhaseA, copy.researchPhaseB])}</span></div>
          <div className="eco-rf-fit-result"><span className="eco-rf-status">{longest(Object.values(copy.researchStatus))}</span><p className="eco-rf-sentence">{longest([worstConsequence, copy.researchRule])}</p></div>
        </div>
      </div>
      <span id="worlds" className="eco-rf-worlds-anchor" />
    </div> : <div className="eco-rf-static eco-wrap" data-orient={orient} data-failed={failed ? "true" : "false"}>
      <SectionLabel number="06">{copy.researchStage}</SectionLabel>
      <h3 className="eco-rf-static-title">{copy.researchPhaseA}</h3>
      <div className="eco-rf-static-art"><svg ref={flatArt} className="eco-rf-art" role="img" aria-label={copy.researchPhaseA} aria-describedby={`${uid}-fdesc`} focusable="false" /></div>
      <p id={`${uid}-fdesc`} className="eco-rf-sr">{copy.researchArtDesc}</p>
      {!failed && controls("static")}
      <h3 id="worlds" className="eco-rf-static-title eco-rf-static-title--worlds">{copy.researchPhaseB}</h3>
      <div className="eco-rf-static-art"><svg ref={terrainArt} className="eco-rf-art" role="img" aria-label={copy.researchPhaseB} aria-describedby={`${uid}-tdesc`} focusable="false" /></div>
      <p id={`${uid}-tdesc`} className="eco-rf-sr">{copy.researchTerrainDesc}</p>
      <p className="eco-rf-static-note">{failed ? copy.researchStaticNote : copy.researchNote}</p>
      <div className="eco-rf-static-practice">
        <p className="eco-rf-static-thesis"><strong>{copy.researchThesis.lead}</strong> <span>{copy.researchThesis.body}</span></p>
        <ul className="eco-rf-static-domains" aria-label={copy.researchDomainsLabel}>
          {RESEARCH_DOMAINS.map((d, i) => <li key={d.id} data-domain={d.id}>
            <span className="eco-rf-static-index" aria-hidden="true">0{i + 1}</span><span className="eco-rf-domain-name">{copy.researchDomains[d.id].name}</span>
            <span className="eco-rf-sr">: </span><span className="eco-rf-domain-note">{copy.researchDomains[d.id].note}</span>
          </li>)}
        </ul>
      </div>
    </div>}
    <p className="eco-rf-sr" aria-live="polite" aria-atomic="true">{announcement}</p>
    <div className="eco-rf-tail" aria-hidden="true" />
  </HomeSection>;
}
