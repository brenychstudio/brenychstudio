// Section 06 SVG writer: one stable set of elements per scene, geometry and path strings cached by what moves them
// (camera, constraint, commit), and only changed attributes written. Every functional mark comes from
// homeResearchModel (same network, IDs and route); projection is the model's REV1 camera. No React, no timers.
import {
  CLIMAX_REST, DEFAULT_CONSTRAINT, DOMAIN, RESEARCH_CLIMAX, RESEARCH_DOMAINS, RULE, TERRAIN, blend, blockRadius, buildNetwork, chooseDomainTiers, climaxView, domainGlyph,
  domainsOn, drawnRoute, edgeTiers, glyphScale, height, insidePolygon, nodeMap, placeDomainLabels, projectPoints, sampleEdge, structureClearance, structureVisibility,
  type Box, type Camera, type Constraint, type DomainBlocked, type DomainLabelPlacement, type Evaluation, type GraphEdge, type Orientation, type Pt, type ResearchClimax,
  type ResearchPhase, type Route, type View,
} from "./homeResearchModel";

const NS = "http://www.w3.org/2000/svg";
export const RESEARCH_NETWORK = buildNetwork();
const NODES = nodeMap(RESEARCH_NETWORK);
const NODE_INDEX = new Map(RESEARCH_NETWORK.nodes.map((n, i) => [n.id, i] as const));
const EDGE_BY_ID = new Map(RESEARCH_NETWORK.edges.map((e) => [e.id, e] as const));
const TIERS = edgeTiers(RESEARCH_NETWORK);
/** The direct (unconstrained) candidate and the anchors are present from the first frame; other vertices arrive with
 *  the depth tier of the links that reach them. */
const CANDIDATE_NODES = new Set(["S", "O4", "I4", "H", "I0", "O0", "T"]);
const NODE_TIER = (() => {
  const depth = new Map<string, number>([[RESEARCH_NETWORK.source, 0]]);
  const queue = [RESEARCH_NETWORK.source];
  while (queue.length) {
    const u = queue.shift()!;
    for (const e of RESEARCH_NETWORK.edges) {
      const v = e.a === u ? e.b : e.b === u ? e.a : null;
      if (v && !depth.has(v)) { depth.set(v, depth.get(u)! + 1); queue.push(v); }
    }
  }
  return new Map([...depth].map(([k, d]) => [k, Math.min(3, Math.max(0, d - 1))] as const));
})();

export type SceneKind = "stage" | "flat" | "terrain";
/** `avoid`: stage-px boxes of HTML overlays (the drag hint) that the field annotations keep clear of.
 *  `climax` (pinned stage only): the final climax camera, the safe environment rectangle the ground grows to, and its
 *  edge-fade widths (left, top, right, bottom). `domains`: the measured size of each studio-domain label (HTML, written by
 *  the stage component), the highest their row may sit (`top`) and its horizontal bounds. */
export type SceneLayout = {
  width: number; height: number; art: Box; flat: Camera; terrain: Camera; orient: Orientation; compact: boolean; labels: boolean; avoid?: Box[];
  climax?: {
    camera: Camera; env: Box; fade: readonly [number, number, number, number];
    domains?: { labels: readonly { w: number; h: number }[]; top: number; x0: number; x1: number };
  };
};
/** Stage-px box of one domain label and its reveal (0 = hidden). */
export type DomainLabelOut = { x: number; y: number; opacity: number };
export type SceneCopy = { origin: string; destination: string; costField: string; clearance: string; research: string; worlds: string };
export type SceneState = {
  live: Constraint; liveEval: Evaluation; committed: Evaluation; committedUser: boolean; preview: boolean;
  phase: ResearchPhase; viewYaw: number; viewPitch: number;
  hover: boolean; dragging: boolean; hint: number; signal: number | null; runnerUpLabel: string;
  /** FIX1 climax (pinned stage only; absent or rest = the legacy story). */
  climax?: ResearchClimax;
};
export type ResearchScene = {
  setLayout(layout: SceneLayout): void;
  render(state: SceneState): void;
  /** Stage px of the live constraint centre and its core radius at the current camera. */
  handle(): { x: number; y: number; r: number } | null;
  /** The four domain labels (RESEARCH_DOMAINS order) as last rendered; null outside the climax or without measured labels. */
  domains(): readonly DomainLabelOut[] | null;
  drawableCount(): number;
  destroy(): void;
};

// ---------------------------------------------------------------- geometry containers
type Poly = { src: Float64Array; z: Float64Array; scr: Float64Array; closed: boolean };
const toPoly = (pts: Pt[], closed = false): Poly => {
  const src = new Float64Array(pts.length * 2);
  pts.forEach((p, i) => { src[2 * i] = p.x; src[2 * i + 1] = p.y; });
  return { src, z: new Float64Array(pts.length), scr: new Float64Array(pts.length * 2), closed };
};
const r1 = (v: number) => Math.round(v * 10) / 10;
/** `String(r1(v))` built with integer math: the same characters (checked on 4M values), ~3× faster on morph frames. */
const n1 = (v: number): string => {
  const t = Math.round(v * 10);
  if (!(Math.abs(t) < 2e9)) return String(t / 10);
  const q = (t / 10) | 0, r = t - q * 10;
  return r === 0 ? `${q}` : r > 0 ? `${q}.${r}` : q === 0 ? `-0.${-r}` : `${q}.${-r}`;
};
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
function polyD(xs: Float64Array, closed: boolean, reverse = false): string {
  const n = xs.length / 2;
  if (!n) return "";
  let d = "";
  for (let i = 0; i < n; i++) { const j = reverse ? n - 1 - i : i; d += (i ? "L" : "M") + n1(xs[2 * j]) + "," + n1(xs[2 * j + 1]); }
  return closed ? d + "Z" : d;
}
const circleD = (x: number, y: number, r: number) => `M${n1(x + r)},${n1(y)}a${n1(r)},${n1(r)} 0 1,0 ${n1(-2 * r)},0a${n1(r)},${n1(r)} 0 1,0 ${n1(2 * r)},0`;
/** Convex hull (monotone chain) of screen points given as packed [x, y, …] arrays: the closed path and its packed outline. */
function hull(sets: Float64Array[]): { d: string; pts: Float64Array } {
  const pts: [number, number][] = [];
  for (const s of sets) for (let i = 0; i < s.length; i += 2) pts.push([s[i], s[i + 1]]);
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [], up: [number, number][] = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  const outline = lo.slice(0, -1).concat(up.slice(0, -1));
  return { d: outline.map((p, i) => (i ? "L" : "M") + n1(p[0]) + "," + n1(p[1])).join("") + "Z", pts: Float64Array.from(outline.flat()) };
}
const costRingRadius = (phi: number) => blockRadius() + RULE.influence * (1 - Math.sqrt(phi));
/** Art-box edge fade (left, top, right, bottom) of the legacy story; the climax widens it toward the environment's. */
const FADE_REST = [24, 24, 24, 24] as const;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** Unit circle tables with the model's `ring()` expressions, so a constraint move rewrites coordinates without trig. */
const unitCircle = (n: number) => Array.from({ length: n }, (_, i) => [Math.cos((i / n) * 2 * Math.PI), Math.sin((i / n) * 2 * Math.PI)] as const);
const RING_SPECS = [
  ...[0.25, 0.5, 0.75].map((phi) => ({ r: costRingRadius(phi), table: unitCircle(72) })),
  { r: RULE.core, table: unitCircle(72) }, { r: blockRadius(), table: unitCircle(96) },
  ...[18, 36, 52].map((r) => ({ r, table: unitCircle(48) })),
];

/** The middle of a blocked link's portion inside the clearance zone (where its × sits). */
function insideMid(e: GraphEdge, c: Constraint): Pt {
  const pts = sampleEdge(e, NODES, 1).filter((p) => Math.hypot(p.x - c.x, p.y - c.y) <= blockRadius());
  if (pts.length) return pts[Math.floor(pts.length / 2)];
  let best = { p: { x: 0, y: 0 }, d: Infinity };
  for (const p of sampleEdge(e, NODES, 1)) { const d = Math.hypot(p.x - c.x, p.y - c.y); if (d < best.d) best = { p, d }; }
  return best.p;
}
/** Domain polyline of a route (edges oriented along the route). */
function routeDomain(r: Route): Pt[] {
  const out: Pt[] = [];
  r.edges.forEach((eid, i) => {
    const e = EDGE_BY_ID.get(eid)!;
    let pts = sampleEdge(e, NODES, 8);
    if (e.a !== r.nodes[i]) pts = [...pts].reverse();
    out.push(...(i ? pts.slice(1) : pts));
  });
  return out;
}
const minDistance = (pts: Pt[], p: Pt) => { let m = Infinity; for (const q of pts) { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < m) m = d; } return m; };
const routeKey = (r: Route | null) => (r ? r.nodes.join() : "");

export function createResearchScene(svg: SVGSVGElement, kind: SceneKind, copy: SceneCopy, uid: string): ResearchScene {
  const stage = kind === "stage", terrainOnly = kind === "terrain";
  const written = new WeakMap<Element, Map<string, string>>();
  const set = (el: Element | null, name: string, value: string | number) => {
    if (!el) return;
    const v = typeof value === "number" ? String(Math.round(value * 100) / 100) : value;
    let cache = written.get(el);
    if (!cache) { cache = new Map(); written.set(el, cache); }
    if (cache.get(name) === v) return;
    cache.set(name, v);
    el.setAttribute(name, v);
  };
  const toggle = (el: Element, cls: string, on: boolean) => { if (el.classList.contains(cls) !== on) el.classList.toggle(cls, on); };
  const make = <K extends keyof SVGElementTagNameMap>(tag: K, parent: Element, attrs: Record<string, string | number> = {}) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
    parent.appendChild(node);
    return node;
  };
  const id = (name: string) => `${uid}-${name}`;

  // ---------------------------------------------------------------- elements (bottom → top)
  svg.replaceChildren();
  const defs = make("defs", svg);
  const hatch = make("pattern", defs, { id: id("hatch"), patternUnits: "userSpaceOnUse", width: 7, height: 7, patternTransform: "rotate(38)" });
  make("line", hatch, { x1: 0, y1: 0, x2: 0, y2: 7, class: "rf-hatch-line" });
  const bloom = make("radialGradient", defs, { id: id("bloom") });
  for (const [o, a] of [[0, 0.18], [0.55, 0.055], [1, 0]]) make("stop", bloom, { offset: o, "stop-color": "#123926", "stop-opacity": a });
  // Grid vignette as a radial stroke paint (an SVG mask would be re-rasterised off-screen on every morph frame): an
  // ellipse over the projected landmass, 0.56 of its box padded (4, 40 above, 20 below), placed per camera.
  const vig = make("radialGradient", defs, { id: id("vig"), gradientUnits: "userSpaceOnUse", cx: 0, cy: 0, r: 1 });
  make("stop", vig, { offset: 0, "stop-color": "#1f2a23" });
  const vigMid = make("stop", vig, { offset: 0.62, "stop-color": "#1f2a23" });
  make("stop", vig, { offset: 1, "stop-color": "#1f2a23", "stop-opacity": 0 });
  // Art-box edge fade: the backdrop (landmass, grid, orbits) dissolves into the paper over 24 px. Drawn as a paper frame
  // plus four gradient strips above the backdrop and below every functional layer (no off-screen mask per frame).
  const fadeGradient = (name: string, x1: number, y1: number, x2: number, y2: number) => {
    const g = make("linearGradient", defs, { id: id(name), x1, y1, x2, y2 });
    make("stop", g, { offset: 0, "stop-color": "#f6f2e7" }); make("stop", g, { offset: 1, "stop-color": "#f6f2e7", "stop-opacity": 0 });
  };
  fadeGradient("fl", 0, 0, 1, 0); fadeGradient("fr", 1, 0, 0, 0); fadeGradient("ft", 0, 0, 0, 1); fadeGradient("fb", 0, 1, 0, 0);
  // The accepted route's halo is clipped at the clearance ring: nothing is painted inside the zone (even-odd clip:
  // exact geometry without an off-screen mask).
  const haloClip = make("clipPath", defs, { id: id("halo"), clipPathUnits: "userSpaceOnUse" });
  const haloHole = make("path", haloClip, { "clip-rule": "evenodd" });
  // FIX1 depth (stage only): in the climax the route is split at the hill's projected silhouette; the part behind the hill
  // (home:validate: route points inside it are always behind the constraint) is drawn see-through, never removed.
  const hillShape = stage ? make("path", make("clipPath", defs, { id: id("hill"), clipPathUnits: "userSpaceOnUse" })) : null;
  const openShape = stage ? make("path", make("clipPath", defs, { id: id("open"), clipPathUnits: "userSpaceOnUse" }), { "clip-rule": "evenodd" }) : null;

  // FIX1 climax (stage only): the ground tint the tile dissolves into, and the ground grid beyond the tile. Far rows fade with
  // depth (a vertical stroke paint placed per camera); near rows and side lines share the grid vignette.
  const ground = stage ? make("rect", svg, { class: "rf-ground", x: 0, y: 0 }) : null;
  const land = kind !== "flat" ? make("path", svg, { class: "rf-land" }) : null;
  const haze = stage ? make("linearGradient", defs, { id: id("haze"), gradientUnits: "userSpaceOnUse", x1: 0, x2: 0, y1: 0, y2: 1 }) : null;
  if (haze) for (const [o, a] of [[0, 0], [0.4, 0.12], [0.75, 0.6], [1, 1]]) make("stop", haze, { offset: o, "stop-color": "#1f2a23", "stop-opacity": a });
  const fieldFar = stage ? make("path", svg, { class: "rf-field", stroke: `url(#${id("haze")})` }) : null;
  const fieldNear = stage ? make("path", svg, { class: "rf-field", stroke: `url(#${id("vig")})` }) : null;
  const gridMinor = make("path", svg, { class: "rf-grid rf-grid--minor", stroke: `url(#${id("vig")})` });
  const gridMajor = make("path", svg, { class: "rf-grid rf-grid--major", stroke: `url(#${id("vig")})` });
  const orbitA = make("path", svg, { class: "rf-orbit rf-orbit--a" });
  const orbitB = make("path", svg, { class: "rf-orbit rf-orbit--b" });
  const fadeFrame = make("path", svg, { fill: "#f6f2e7", "fill-rule": "evenodd" });
  const fadeStrips = ["fl", "fr", "ft", "fb"].map((g) => make("rect", svg, { fill: `url(#${id(g)})` }));
  // Full-stage dotted bleed (1 on / 6 off along every 50-unit line of the flat plan): two pattern fills instead of ~12k
  // stroked dashes, so a morph frame re-rasterises one image-shader fill per tile, not the dash geometry.
  const bleedPattern = (name: string) => {
    const pattern = make("pattern", defs, { id: id(name), patternUnits: "userSpaceOnUse" });
    make("rect", pattern, { width: 1, height: 1, class: "rf-bleed-dot" });
    return pattern;
  };
  const bleedV = stage ? bleedPattern("bleed-v") : null, bleedH = stage ? bleedPattern("bleed-h") : null;
  const bleeds = stage ? [make("rect", svg, { class: "rf-bleed", fill: `url(#${id("bleed-v")})` }), make("rect", svg, { class: "rf-bleed", fill: `url(#${id("bleed-h")})` })] : [];
  const ticks = make("path", svg, { class: "rf-ticks" });
  const register = stage ? make("path", svg, { class: "rf-register" }) : null;
  // FIX2 studio domains (stage only), under the functional drawing: stems with their leaders (two paths: off / on the drawn
  // route) and one structure per domain.
  const guides = stage ? make("path", svg, { class: "rf-guide" }) : null;
  const guidesOn = stage ? make("path", svg, { class: "rf-guide is-route" }) : null;
  const glyphEls = stage ? RESEARCH_DOMAINS.map((d) => make("path", svg, { class: "rf-domain", "data-domain": d.id })) : [];
  const tierLegal: SVGPathElement[] = [], tierBlocked: SVGPathElement[] = [];
  for (let t = 0; t < 4; t++) {
    tierLegal.push(make("path", svg, { class: "rf-link" }));
    tierBlocked.push(make("path", svg, { class: "rf-link rf-link--blocked" }));
  }
  const costRings = [0, 1, 2].map((i) => make("path", svg, { class: `rf-cost rf-cost--${i}` }));
  const coreFill = make("path", svg, { class: "rf-core-fill" });
  const core = make("path", svg, { class: "rf-core", fill: `url(#${id("hatch")})` });
  const contours = kind !== "flat" ? [0, 1, 2].map(() => make("path", svg, { class: "rf-contour" })) : [];
  const clearance = make("path", svg, { class: "rf-clearance" });
  const annotCost = terrainOnly ? null : make("text", svg, { class: "rf-annot" });
  const annotClear = terrainOnly ? null : make("text", svg, { class: "rf-annot" });
  if (annotCost) annotCost.textContent = copy.costField.toUpperCase();
  if (annotClear) annotClear.textContent = copy.clearance.toUpperCase();
  const selected = terrainOnly ? null : make("circle", svg, { class: "rf-selected" });
  const handleDisc = make("circle", svg, { class: "rf-handle", r: 7.5 });
  const handleCross = make("path", svg, { class: "rf-handle-cross" });
  const candLegal = make("path", svg, { class: "rf-cand" });
  const candBlocked = make("path", svg, { class: "rf-cand rf-cand--blocked" });
  const rejected = make("path", svg, { class: "rf-rejected" });
  const xmarks = make("path", svg, { class: "rf-xmarks" });
  // FIX2 depth (stage, climax only): the runner-up, the ghost of the committed route and the live preview are split per link
  // where they pass behind the hill; that part is drawn see-through, like the accepted route.
  const runner = make("path", svg, { class: "rf-runner" });
  const runnerBehind = stage ? make("path", svg, { class: "rf-runner" }) : null;
  const runnerLabel = terrainOnly ? null : make("text", svg, { class: "rf-runner-label" });
  const ghost = make("path", svg, { class: "rf-ghost" });
  const ghostBehind = stage ? make("path", svg, { class: "rf-ghost" }) : null;
  const previewRoute = make("path", svg, { class: "rf-preview" });
  const previewBehind = stage ? make("path", svg, { class: "rf-preview" }) : null;
  const haloGroup = make("g", svg, { "clip-path": `url(#${id("halo")})` });
  const routeHalo = make("path", haloGroup, { class: "rf-route-halo", pathLength: 1 });
  const route = make("path", svg, { class: "rf-route", pathLength: 1 });
  const routeHill = stage ? make("path", svg, { class: "rf-route", pathLength: 1, "clip-path": `url(#${id("hill")})`, display: "none" }) : null;
  const signalHalo = make("circle", svg, { class: "rf-signal-halo", r: 13 });
  const signalDot = make("circle", svg, { class: "rf-signal", r: 5 });
  // Every vertex is its own element with a persistent data-node-id through the whole lift.
  const majors = RESEARCH_NETWORK.nodes.filter((n) => n.role === "anchor" || n.role === "relay");
  const blooms = new Map(majors.map((n) => [n.id, make("circle", svg, { class: "rf-bloom", fill: `url(#${id("bloom")})` })] as const));
  const ring1 = make("path", svg, { class: "rf-ring1" });
  const ring2 = make("path", svg, { class: "rf-ring2" });
  const hubRing = make("circle", svg, { class: "rf-hub-ring" });
  const nodeEls = new Map(RESEARCH_NETWORK.nodes.map((n) => [n.id, make("circle", svg, {
    class: n.role === "anchor" ? "rf-anchor" : n.role === "relay" ? "rf-relay" : n.role === "hub" ? "rf-hub" : "rf-node", "data-node-id": n.id,
  })] as const));
  const crosses = make("path", svg, { class: "rf-crosses" });
  const labelPool = terrainOnly ? [] : Array.from({ length: 7 }, () => make("text", svg, { class: "rf-label" }));
  const anchorLabels = terrainOnly ? [] : (["S", "T"] as const).map((nid) => {
    const t = make("text", svg, { class: "rf-anchor-label", "text-anchor": nid === "T" ? "end" : "start" });
    t.textContent = `${nid} · ${nid === "S" ? copy.origin : copy.destination}`.toUpperCase();
    return t;
  });
  const captions = stage ? [copy.research, copy.worlds].map((text, i) => {
    const t = make("text", svg, { class: "rf-caption", "text-anchor": i ? "end" : "start" });
    t.textContent = text.toUpperCase();
    return t;
  }) : [];
  for (const child of Array.from(svg.children)) child.setAttribute("aria-hidden", "true");

  // ---------------------------------------------------------------- domain geometry
  const edgePolys = new Map(RESEARCH_NETWORK.edges.map((e) => [e.id, toPoly(sampleEdge(e, NODES, 8))] as const));
  const gridPolys = (major: boolean) => {
    const out: Poly[] = [], step = major ? 20 : 25;
    for (let x = 0; x <= DOMAIN.width; x += 25) if ((x % 50 === 0) === major) {
      const pts: Pt[] = []; for (let y = 0; y <= DOMAIN.height; y += step) pts.push({ x, y }); out.push(toPoly(pts));
    }
    for (let y = 0; y <= DOMAIN.height; y += 25) if ((y % 50 === 0) === major) {
      const pts: Pt[] = []; for (let x = 0; x <= DOMAIN.width; x += step) pts.push({ x, y }); out.push(toPoly(pts));
    }
    return out;
  };
  const majorPolys = gridPolys(true), minorPolys = gridPolys(false);
  const orbit = (rx: number, ry: number, rot: number) => toPoly(Array.from({ length: 181 }, (_, i) => {
    const t = (i / 180) * 2 * Math.PI, ex = rx * Math.cos(t), ey = ry * Math.sin(t);
    return { x: 500 + ex * Math.cos(rot) - ey * Math.sin(rot), y: 300 + ex * Math.sin(rot) + ey * Math.cos(rot) };
  }));
  const orbitPolys = [orbit(474, 138, -0.04), orbit(338, 268, 0.18)];
  const tickPolys: Poly[] = [];
  for (let a = 0; a < 360; a += 7.5) {
    const ra = a % 45 === 0 ? 212 : 219, rb = a % 45 === 0 ? 238 : 229, t = (a * Math.PI) / 180;
    tickPolys.push(toPoly([{ x: 500 + ra * Math.cos(t), y: 300 - ra * Math.sin(t) }, { x: 500 + rb * Math.cos(t), y: 300 - rb * Math.sin(t) }]));
  }
  const tileEdge: Pt[] = [];
  for (let x = 0; x <= 1000; x += 10) tileEdge.push({ x, y: 0 });
  for (let y = 10; y <= 600; y += 10) tileEdge.push({ x: 1000, y });
  for (let x = 990; x >= 0; x -= 10) tileEdge.push({ x, y: 600 });
  for (let y = 590; y > 0; y -= 10) tileEdge.push({ x: 0, y });
  const landPoly = toPoly(tileEdge, true);
  const FAR_CORNER = 160; // index of (1000, 600) in tileEdge
  const nodePoly = toPoly(RESEARCH_NETWORK.nodes.map((n) => ({ x: n.x, y: n.y })));
  const staticPolys: Poly[] = [...edgePolys.values(), ...majorPolys, ...minorPolys, ...orbitPolys, ...tickPolys, landPoly, nodePoly];
  // Constraint rings (cost ×3, core, clearance, contours ×3) and the centre: allocated once, rewritten in place.
  const ringPolys = RING_SPECS.map((spec) => toPoly(spec.table.map(() => ({ x: 0, y: 0 })), true));
  const centrePoly = toPoly([{ x: 0, y: 0 }]);
  // Ground grid beyond the tile (stage only): every 50-unit line continues past the tile edges and new lines fill the ground
  // around it. Heights are the tile edge's (clamped), so the straight runs need only their two ends.
  const farPolys: Poly[] = [], nearPolys: Poly[] = [];
  if (stage) {
    const { far, near, side, step: fs } = RESEARCH_CLIMAX.field, W = DOMAIN.width, H = DOMAIN.height;
    const across = (y: number) => { const pts: Pt[] = [{ x: -side, y }]; for (let x = 0; x <= W; x += 20) pts.push({ x, y }); pts.push({ x: W + side, y }); return toPoly(pts); };
    for (let x = -side; x <= W + side; x += fs) {
      farPolys.push(toPoly([{ x, y: 0 }, { x, y: -far }]));
      if (x >= 0 && x <= W) nearPolys.push(toPoly([{ x, y: H }, { x, y: H + near }]));
      else { const pts: Pt[] = []; for (let y = 0; y <= H; y += 20) pts.push({ x, y }); pts.push({ x, y: H + near }); nearPolys.push(toPoly(pts)); }
    }
    for (let y = 0; y <= H; y += fs) nearPolys.push(toPoly([{ x: 0, y }, { x: -side, y }]), toPoly([{ x: W, y }, { x: W + side, y }]));
    for (let y = -fs; y >= -far; y -= fs) farPolys.push(across(y));
    for (let y = H + fs; y <= H + near; y += fs) nearPolys.push(across(y));
  }
  const fieldPolys = [...farPolys, ...nearPolys];
  // The haze paint runs from the tile's far edge (opaque) to the far end of the ground (clear), on the centre column.
  const hazePoly = toPoly([{ x: DOMAIN.width / 2, y: 0 }, { x: DOMAIN.width / 2, y: -RESEARCH_CLIMAX.field.far }]);
  // Domain stems: base and nominal top of each stem (heights written per frame from the vertex height).
  const guidePoly = toPoly(RESEARCH_CLIMAX.anchors.flatMap((nid) => { const n = NODES.get(nid)!; return [{ x: n.x, y: n.y }, { x: n.x, y: n.y }]; }));
  // Domain structures: all lines of one domain in one packed outline around its vertex (local offsets, heights per frame),
  // followed by two axis points: the plate centre and the top of the structure's own height.
  type GlyphPoly = Poly & { local: Float64Array; w: Float64Array; lines: { start: number; count: number; closed: boolean }[] };
  const glyphPolys: GlyphPoly[] = stage ? RESEARCH_DOMAINS.map((d) => {
    const pts: (readonly [number, number, number])[] = [], lines: GlyphPoly["lines"] = [];
    for (const line of domainGlyph(d.id)) { lines.push({ start: pts.length, count: line.pts.length, closed: line.closed }); pts.push(...line.pts); }
    pts.push([0, 0, 0], [0, 0, Math.max(...pts.map((p) => p[2]))]);
    const n = NODES.get(d.node)!;
    return { ...toPoly(pts.map(([u, v]) => ({ x: n.x + u, y: n.y + v }))), local: Float64Array.from(pts.flatMap(([u, v]) => [u, v])), w: Float64Array.from(pts.map((p) => p[2])), lines };
  }) : [];
  /** A structure on its plate at height `zPlate` (model units), opened to `scale` of its size (the assembly ramp). */
  const placeGlyph = (gp: GlyphPoly, node: Pt, zPlate: number, scale: number, relief: number) => {
    for (let k = 0; k < gp.w.length; k++) {
      gp.src[2 * k] = node.x + gp.local[2 * k] * scale; gp.src[2 * k + 1] = node.y + gp.local[2 * k + 1] * scale; gp.z[k] = zPlate + (gp.w[k] * scale) / relief;
    }
  };
  const climaxStatic = staticPolys.filter((p) => !minorPolys.includes(p));
  let extras = { marks: [] as Pt[], runnerAt: null as Pt | null, poly: toPoly([]), costScores: [] as number[], clearScores: [] as number[] };

  // ---------------------------------------------------------------- caches
  let layout: SceneLayout | null = null, layoutVersion = 0;
  let constraintKey = "", heightKey = "", staticKey = "", ringKey = "", liveKey = "", committedKey = "", extrasKey = "", haloKey = "";
  let committedExtras = { key: "", marks: [] as Pt[], runnerAt: null as Pt | null };
  let avoidCache = { key: "", pts: [] as Pt[] };
  let lastHandle: { x: number; y: number; r: number } | null = null;
  let routeScr: Float64Array | null = null, routeCum: number[] = [];
  let litAt = new Map<string, number>();
  const annotFits = [true, true];
  const edgeD = new Map<string, { fwd: string; rev: string; len: number }>();
  let fieldHeightKey = "", fieldKey = "", guideKey = "", fadeKey = "", vigE = -1, vigDirty = true, routeSplit = false;
  let vigTile = { cx: 0, cy: 0, rx: 1, ry: 1 };
  // FIX2: the hill outline in the climax (screen), the per-link depth split key, the committed route's domain y per screen
  // point (signal depth), and the domain labels as last placed.
  let hillPts: Float64Array | null = null, depthKey = "", routeDomY: Float64Array | null = null, behindOn = [false, false, false];
  let domainOut: DomainLabelOut[] | null = null, placed: DomainLabelPlacement[] | null = null;
  /** One row or the crown, decided once per layout from the default commit (0 = not yet): slider moves never change it. */
  let tiers: 0 | 1 | 2 = 0, domainPlaceKey = "";
  /** Each structure's visibility at its placement (1 = clear of the drawing). */
  let structVis: number[] = [];

  const fillHeights = (p: Poly, c: Constraint) => { for (let i = 0; i < p.z.length; i++) p.z[i] = height(p.src[2 * i], p.src[2 * i + 1], c); };
  /** Ground beyond the tile carries the tile edge's height (continuous at the edge, flat outward). */
  const fillFieldHeights = (p: Poly, c: Constraint) => {
    for (let i = 0; i < p.z.length; i++) p.z[i] = height(Math.min(DOMAIN.width, Math.max(0, p.src[2 * i])), Math.min(DOMAIN.height, Math.max(0, p.src[2 * i + 1])), c);
  };
  /** Paper frame + four gradient strips around `b` (widths left, top, right, bottom); written only when it changes. */
  const writeFade = (b: Box, f: readonly number[]) => {
    if (!layout) return;
    const W = Math.max(1, b.x1 - b.x0), H = Math.max(1, b.y1 - b.y0);
    const strips = [[b.x0, b.y0, f[0], H], [b.x1 - f[2], b.y0, f[2], H], [b.x0, b.y0, W, f[1]], [b.x0, b.y1 - f[3], W, f[3]]].map((v) => v.map(r1));
    const d = `M-400,-400H${r1(layout.width + 400)}V${r1(layout.height + 400)}H-400Z` + `M${r1(b.x0)},${r1(b.y0)}H${r1(b.x1)}V${r1(b.y1)}H${r1(b.x0)}Z`;
    const key = d + strips.join();
    if (key === fadeKey) return;
    fadeKey = key;
    fadeFrame.setAttribute("d", d);
    strips.forEach(([x, y, w, h], i) => {
      const el = fadeStrips[i];
      el.setAttribute("x", String(x)); el.setAttribute("y", String(y)); el.setAttribute("width", String(w)); el.setAttribute("height", String(h));
    });
  };
  const nodeAt = (nid: string): Pt => { const i = NODE_INDEX.get(nid)!; return { x: nodePoly.scr[2 * i], y: nodePoly.scr[2 * i + 1] }; };
  const extraAt = (i: number): Pt => ({ x: extras.poly.scr[2 * i], y: extras.poly.scr[2 * i + 1] });
  const joinD = (polys: Poly[]) => polys.map((p) => polyD(p.scr, p.closed)).join("");
  /** One link as a subpath drawn from `from` (the reversed string is built only when a layer needs it). */
  const edgeSub = (eid: string, from: string) => {
    const d = edgeD.get(eid)!;
    if (EDGE_BY_ID.get(eid)!.a === from) return d.fwd;
    if (!d.rev) d.rev = polyD(edgePolys.get(eid)!.scr, false, true);
    return d.rev;
  };
  /** A route as joined per-edge subpaths (enough for dashed or dotted layers). */
  const routeSubpaths = (r: Route) => r.edges.map((eid, i) => edgeSub(eid, r.nodes[i])).join("");
  /** A route as one continuous polyline (needed for the pathLength reveal and the signal). */
  const routeScreen = (r: Route): Float64Array => {
    const out: number[] = [];
    r.edges.forEach((eid, i) => {
      const p = edgePolys.get(eid)!.scr, n = p.length / 2, rev = EDGE_BY_ID.get(eid)!.a !== r.nodes[i];
      for (let k = i ? 1 : 0; k < n; k++) { const j = rev ? n - 1 - k : k; out.push(p[2 * j], p[2 * j + 1]); }
    });
    return Float64Array.from(out);
  };
  /** Domain y of every point of `routeScreen(r)`, in the same order (the signal's depth against the hill). */
  const routeDepth = (r: Route): Float64Array => {
    const out: number[] = [];
    r.edges.forEach((eid, i) => {
      const p = edgePolys.get(eid)!.src, n = p.length / 2, rev = EDGE_BY_ID.get(eid)!.a !== r.nodes[i];
      for (let k = i ? 1 : 0; k < n; k++) out.push(p[2 * (rev ? n - 1 - k : k) + 1]);
    });
    return Float64Array.from(out);
  };
  /** A route's links split where they pass behind the hill (inside its outline and farther than the constraint centre `cy`).
   *  A link wholly in front keeps exactly its usual subpath; a mixed link is cut at segment midpoints. */
  const splitByHill = (r: Route, cy: number): { front: string; behind: string } => {
    let front = "", behind = "";
    const hp = hillPts;
    r.edges.forEach((eid, i) => {
      const poly = edgePolys.get(eid)!, n = poly.src.length / 2, rev = EDGE_BY_ID.get(eid)!.a !== r.nodes[i], at = (k: number) => (rev ? n - 1 - k : k);
      const flags = Array.from({ length: n }, (_, k) => { const j = at(k); return hp !== null && poly.src[2 * j + 1] < cy && insidePolygon(poly.scr[2 * j], poly.scr[2 * j + 1], hp); });
      if (!flags.includes(true)) { front += edgeSub(eid, r.nodes[i]); return; }
      if (!flags.includes(false)) { behind += edgeSub(eid, r.nodes[i]); return; }
      const xy = (j: number) => `${n1(poly.scr[2 * j])},${n1(poly.scr[2 * j + 1])}`;
      let run = "M" + xy(at(0)), cur = flags[0];
      for (let k = 1; k < n; k++) {
        if (flags[k] !== cur) {
          const a = at(k - 1), b = at(k), mid = `${n1((poly.scr[2 * a] + poly.scr[2 * b]) / 2)},${n1((poly.scr[2 * a + 1] + poly.scr[2 * b + 1]) / 2)}`;
          if (cur) behind += run + "L" + mid; else front += run + "L" + mid;
          run = "M" + mid; cur = flags[k];
        }
        run += "L" + xy(at(k));
      }
      if (cur) behind += run; else front += run;
    });
    return { front, behind };
  };
  /** Functional marks inside a horizontal band of the stage, as x intervals: vertex discs (lit size), the constraint's core
   *  and clearance outlines and the drawn route (runs of consecutive points). The domain label row keeps clear of them. */
  const bandMarks = (routeXs: Float64Array | null): DomainBlocked => (y0, y1) => {
    const out: [number, number][] = [], sz = layout?.compact ? 0.72 : 1;
    RESEARCH_NETWORK.nodes.forEach((n, i) => {
      const x = nodePoly.scr[2 * i], y = nodePoly.scr[2 * i + 1], r = (n.role === "anchor" ? 15 : n.role === "relay" ? 9 : n.role === "hub" ? 7.5 : 4.8) * sz + 4;
      if (y + r > y0 && y - r < y1) out.push([x - r, x + r]);
    });
    const runs = (xs: Float64Array) => {
      let a = Infinity, b = -Infinity, last = -4;
      for (let i = 0; i < xs.length; i += 2) {
        if (xs[i + 1] < y0 || xs[i + 1] > y1) continue;
        if (i - last > 2 && a <= b) { out.push([a - 6, b + 6]); a = Infinity; b = -Infinity; }
        a = Math.min(a, xs[i]); b = Math.max(b, xs[i]); last = i;
      }
      if (a <= b) out.push([a - 6, b + 6]);
    };
    runs(ringPolys[3].scr); runs(ringPolys[4].scr);
    if (routeXs) runs(routeXs);
    return out;
  };
  const cumulative = (xs: Float64Array) => {
    const out = [0];
    for (let i = 2; i < xs.length; i += 2) out.push(out[out.length - 1] + Math.hypot(xs[i] - xs[i - 2], xs[i + 1] - xs[i - 1]));
    return out;
  };
  const along = (xs: Float64Array, cum: number[], f: number): Pt => {
    const t = clamp01(f) * cum[cum.length - 1];
    for (let i = 1; i < cum.length; i++) if (t <= cum[i]) {
      const u = cum[i] - cum[i - 1] ? (t - cum[i - 1]) / (cum[i] - cum[i - 1]) : 0;
      return { x: xs[2 * i - 2] + (xs[2 * i] - xs[2 * i - 2]) * u, y: xs[2 * i - 1] + (xs[2 * i + 1] - xs[2 * i - 1]) * u };
    }
    return { x: xs[xs.length - 2], y: xs[xs.length - 1] };
  };
  const alongDepth = (ys: Float64Array, cum: number[], f: number): number => {
    const t = clamp01(f) * cum[cum.length - 1];
    for (let i = 1; i < cum.length; i++) if (t <= cum[i]) {
      const u = cum[i] - cum[i - 1] ? (t - cum[i - 1]) / (cum[i] - cum[i - 1]) : 0;
      return ys[i - 1] + (ys[i] - ys[i - 1]) * u;
    }
    return ys[ys.length - 1];
  };

  /** × marks and the runner-up label anchor (per commit) plus the two annotation anchors (per live constraint). */
  const buildExtras = (st: SceneState, avoidRoute: Route) => {
    const ev = st.committed, c = st.live, avoidKey = routeKey(avoidRoute);
    const key = [c.x, c.y, ev.constraint.x, ev.constraint.y, avoidKey].join();
    if (key === extrasKey) return false;
    extrasKey = key;
    if (avoidCache.key !== avoidKey) avoidCache = { key: avoidKey, pts: routeDomain(avoidRoute) };
    const ckey = [ev.constraint.x, ev.constraint.y].join();
    if (committedExtras.key !== ckey) {
      let runnerAt: Pt | null = null;
      if (ev.runnerUp && ev.routeClass !== "direct" && ev.accepted) {
        const accepted = routeDomain(ev.accepted);
        let best = -1;
        for (const p of routeDomain(ev.runnerUp)) { const d = minDistance(accepted, p); if (d > best) { best = d; runnerAt = p; } }
      }
      committedExtras = { key: ckey, marks: ev.blockedOnCandidate.map((eid) => insideMid(EDGE_BY_ID.get(eid)!, ev.constraint)), runnerAt };
    }
    // Annotation candidates on the outer cost ring and the clearance ring, scored by distance from the drawn route;
    // the final choice is made on screen, where it also avoids the anchor and runner-up labels.
    const candidates = (r: number, angles: number[]) => angles.map((a) => ({ x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) }));
    const costPts = candidates(costRingRadius(0.25), [-0.5, -2.64, 0.5, 2.64]), clearPts = candidates(blockRadius(), [0.62, 2.52, -0.62, -2.52]);
    const { marks, runnerAt } = committedExtras;
    const poly = toPoly([...marks, ...(runnerAt ? [runnerAt] : []), ...costPts, ...clearPts]);
    fillHeights(poly, c);
    extras = { marks, runnerAt, poly, costScores: costPts.map((p) => minDistance(avoidCache.pts, p)), clearScores: clearPts.map((p) => minDistance(avoidCache.pts, p)) };
    return true;
  };

  function setLayout(next: SceneLayout) {
    layout = next; layoutVersion++;
    svg.setAttribute("viewBox", `0 0 ${r1(next.width)} ${r1(next.height)}`);
    svg.setAttribute("width", String(r1(next.width)));
    svg.setAttribute("height", String(r1(next.height)));
    fadeKey = ""; writeFade(next.art, FADE_REST);
    if (ground) { ground.setAttribute("width", String(r1(next.width))); ground.setAttribute("height", String(r1(next.height))); }
    fieldKey = ""; guideKey = ""; vigDirty = true; tiers = 0; domainPlaceKey = "";
    if (bleedV && bleedH) {
      // Lines at every 50 units of the flat plan; each dot is the 1 px stroke's first 1 px of every 7 (from the stage edge).
      const b = next.flat, step = 50 * b.k, mod = (v: number) => ((v % step) + step) % step;
      const x0 = mod(b.ox + b.k * (0 - 500)), y0 = mod(b.oy + b.k * (0 - 300));
      for (const [el, attrs] of [[bleedV, { x: r1(x0 - 0.5), y: 0, width: r3(step), height: 7 }], [bleedH, { x: 0, y: r1(y0 - 0.5), width: 7, height: r3(step) }]] as const) {
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      }
      for (const el of bleeds) { el.setAttribute("width", String(r1(next.width))); el.setAttribute("height", String(r1(next.height))); }
    }
    if (register) {
      // The threshold's projection lines continue down to the axis vertices of the flat plan.
      const f = next.flat, top = next.art.y0;
      register.setAttribute("d", ["S", "O4", "I4", "H", "I0", "O0", "T"].map((nid) => {
        const n = NODES.get(nid)!, x = f.ox + f.k * (n.x - 500), y = f.oy + f.k * (n.y - 300);
        return `M${r1(x)},${r1(top)}V${r1(y - (nid === "S" || nid === "T" ? 26 : 9))}`;
      }).join(""));
    }
    staticKey = ""; ringKey = ""; liveKey = ""; committedKey = "";
  }

  function render(st: SceneState) {
    if (!layout) return;
    const L = layout, ph = st.phase, c = st.live, committed = st.committed, preview = st.preview;
    const s = kind === "flat" ? 0 : kind === "terrain" ? 1 : ph.s;
    const revealT = st.committedUser ? 1 : ph.reveal, rejectT = st.committedUser ? 1 : ph.rejected, runnerT = st.committedUser ? 1 : ph.runnerUp;
    const showEval = !preview;

    // 1. live constraint geometry (rings rewritten in place) and evaluation anchors
    const ck = `${c.x},${c.y}`;
    if (ck !== constraintKey) {
      constraintKey = ck;
      RING_SPECS.forEach((spec, k) => { const p = ringPolys[k]; spec.table.forEach(([cos, sin], i) => { p.src[2 * i] = c.x + spec.r * cos; p.src[2 * i + 1] = c.y + spec.r * sin; }); });
      centrePoly.src[0] = c.x; centrePoly.src[1] = c.y;
      heightKey = "";
    }
    const avoidRoute = showEval && committed.accepted && revealT > 0 ? committed.accepted : committed.unconstrained;
    const extrasChanged = buildExtras(st, avoidRoute);
    // 2. heights: only once the plan tilts (s = 0 is the exact flat plan)
    if (s > 0 && heightKey !== ck) {
      heightKey = ck;
      for (const p of [...staticPolys, ...ringPolys, centrePoly]) fillHeights(p, c);
    }
    // 3. one camera blended from the flat fit to the F2 union fit: no per-input re-zoom. Past the legacy story (climax c > 0,
    //    pinned stage only) the same camera continues from F2 to the climax fit on the tilt ramp, with a deeper pitch and a
    //    closer distance; at c = 0 this is exactly the legacy camera.
    const cl = st.climax ?? CLIMAX_REST, cx = stage && cl.c > 0 && L.climax ? L.climax : null;
    const T = cx ? cl.tilt : 0, E = cx ? cl.expand : 0, G = cx ? cl.guides : 0;
    const cam = cx ? blend(L.terrain, cx.camera, T) : blend(L.flat, L.terrain, s);
    const base: View = { s, yaw: st.viewYaw * TERRAIN.viewYaw, pitch: st.viewPitch * TERRAIN.viewPitch, orient: L.orient };
    const view = cx ? climaxView(base, T) : base;
    const camKey = [layoutVersion, s, view.yaw, view.pitch, cx ? T : ""].join("|");
    // The network and backdrop move with the camera, and with the constraint only once heights apply (s > 0).
    // The minor grid has faded out before the climax, so its geometry is left alone there.
    const sKey = `${camKey}|${s > 0 ? ck : "flat"}`, staticMoved = sKey !== staticKey;
    if (staticMoved) { staticKey = sKey; for (const p of cx ? climaxStatic : staticPolys) projectPoints(p.src, s > 0 ? p.z : null, p.scr, view, cam); }
    const rKey = `${camKey}|${ck}`, ringsMoved = rKey !== ringKey;
    if (ringsMoved) { ringKey = rKey; for (const p of [...ringPolys, centrePoly]) projectPoints(p.src, s > 0 ? p.z : null, p.scr, view, cam); }
    if (ringsMoved || extrasChanged) projectPoints(extras.poly.src, s > 0 ? extras.poly.z : null, extras.poly.scr, view, cam);
    const hc = { x: centrePoly.scr[0], y: centrePoly.scr[1] };
    lastHandle = { x: hc.x, y: hc.y, r: cam.k * RULE.core };

    if (staticMoved) {
      // backdrop and network geometry (a flat-plan constraint move never rewrites these)
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < landPoly.scr.length; i += 2) {
        x0 = Math.min(x0, landPoly.scr[i]); x1 = Math.max(x1, landPoly.scr[i]); y0 = Math.min(y0, landPoly.scr[i + 1]); y1 = Math.max(y1, landPoly.scr[i + 1]);
      }
      vigTile = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 - 10, rx: 0.56 * (x1 - x0 + 8), ry: 0.56 * (y1 - y0 + 60) }; vigDirty = true;
      if (land) set(land, "d", polyD(landPoly.scr, true));
      if (!cx) set(gridMinor, "d", joinD(minorPolys));
      set(gridMajor, "d", joinD(majorPolys));
      set(orbitA, "d", polyD(orbitPolys[0].scr, false)); set(orbitB, "d", polyD(orbitPolys[1].scr, false));
      set(ticks, "d", joinD(tickPolys));
      const o2 = nodeAt("O2"), o6 = nodeAt("O6");
      set(crosses, "d", [o2, o6].map((p) => `M${n1(p.x - 15)},${n1(p.y)}h7M${n1(p.x + 8)},${n1(p.y)}h7M${n1(p.x)},${n1(p.y - 15)}v7M${n1(p.x)},${n1(p.y + 8)}v7`).join(""));
      for (const e of RESEARCH_NETWORK.edges) {
        const p = edgePolys.get(e.id)!.scr;
        let len = 0; for (let i = 2; i < p.length; i += 2) len += Math.hypot(p[i] - p[i - 2], p[i + 1] - p[i - 1]);
        edgeD.set(e.id, { fwd: polyD(p, false), rev: "", len });
      }
      const sz = L.compact ? 0.72 : 1;
      for (const n of RESEARCH_NETWORK.nodes) {
        const p = nodeAt(n.id), el = nodeEls.get(n.id)!;
        set(el, "cx", p.x); set(el, "cy", p.y);
        if (n.role === "anchor" || n.role === "relay") {
          const big = (n.role === "anchor" ? 15 : 9) * sz, b = blooms.get(n.id)!;
          set(el, "r", big); set(b, "cx", p.x); set(b, "cy", p.y); set(b, "r", big * 4.4);
        } else if (n.role === "hub") { set(hubRing, "cx", p.x); set(hubRing, "cy", p.y); set(hubRing, "r", 14 * sz); }
      }
    }
    // Climax ground grid: only once the environment grows (heights follow the live constraint, geometry the camera).
    if (cx && E > 0 && fieldFar && fieldNear && haze) {
      if (fieldHeightKey !== ck) { fieldHeightKey = ck; for (const p of fieldPolys) fillFieldHeights(p, c); fillFieldHeights(hazePoly, c); fieldKey = ""; }
      if (fieldKey !== sKey) {
        fieldKey = sKey;
        for (const p of fieldPolys) projectPoints(p.src, p.z, p.scr, view, cam);
        projectPoints(hazePoly.src, hazePoly.z, hazePoly.scr, view, cam);
        set(fieldFar, "d", joinD(farPolys)); set(fieldNear, "d", joinD(nearPolys));
        set(haze, "y1", hazePoly.scr[3]); set(haze, "y2", hazePoly.scr[1]);
      }
    }
    // Grid vignette: an ellipse over the projected tile; the climax widens it past the environment so the ground grid is
    // cut only by the environment's edge fade.
    if (vigDirty || E !== vigE) {
      vigDirty = false; vigE = E;
      let v = vigTile;
      if (cx && E > 0) {
        const env = cx.env, ex = { cx: (env.x0 + env.x1) / 2, cy: (env.y0 + env.y1) / 2, rx: env.x1 - env.x0, ry: env.y1 - env.y0 };
        v = { cx: mix(v.cx, ex.cx, E), cy: mix(v.cy, ex.cy, E), rx: mix(v.rx, ex.rx, E), ry: mix(v.ry, ex.ry, E) };
      }
      set(vig, "gradientTransform", `translate(${n1(v.cx)} ${n1(v.cy)}) scale(${n1(v.rx)} ${n1(v.ry)})`);
    }
    if (stage) {
      // The art-box fade widens to the environment's edges (at E = 0 this is exactly the legacy frame).
      const env = cx ? cx.env : L.art, f = cx ? cx.fade : FADE_REST, a = L.art;
      writeFade({ x0: mix(a.x0, env.x0, E), y0: mix(a.y0, env.y0, E), x1: mix(a.x1, env.x1, E), y1: mix(a.y1, env.y1, E) },
        FADE_REST.map((w, i) => mix(w, f[i], E)));
    }
    if (ringsMoved) {
      // cost field and constraint (live)
      for (let i = 0; i < 3; i++) set(costRings[i], "d", polyD(ringPolys[i].scr, true));
      const coreD = polyD(ringPolys[3].scr, true), clearD = polyD(ringPolys[4].scr, true);
      set(coreFill, "d", coreD); set(core, "d", coreD); set(clearance, "d", clearD);
      contours.forEach((el, i) => set(el, "d", polyD(ringPolys[5 + i].scr, true)));
      set(handleDisc, "cx", hc.x); set(handleDisc, "cy", hc.y);
      set(handleCross, "d", `M${n1(hc.x - 13)},${n1(hc.y)}h7M${n1(hc.x + 6)},${n1(hc.y)}h7M${n1(hc.x)},${n1(hc.y - 13)}v7M${n1(hc.x)},${n1(hc.y + 6)}v7`);
      if (haloKey !== rKey) { haloKey = rKey; set(haloHole, "d", `M-5000,-5000H15000V15000H-5000Z${clearD}`); }
      hillPts = null;
      if (cx && hillShape && openShape) {
        // The hill's projected silhouette: hull of the core ring, its three contours and the peak.
        const hill = hull([ringPolys[3].scr, ringPolys[5].scr, ringPolys[6].scr, ringPolys[7].scr, centrePoly.scr]);
        hillPts = hill.pts;
        set(hillShape, "d", hill.d); set(openShape, "d", `M-5000,-5000H15000V15000H-5000Z${hill.d}`);
      }
    }
    // links by depth tier and live legality, the candidate with live legality, and the live preview route
    const lKey = `${sKey}|${ck}|${preview}`;
    if (lKey !== liveKey) {
      liveKey = lKey;
      const liveBlocked = new Set(st.liveEval.blockedEdges), candidate = new Set(committed.unconstrained.edges);
      const legalD = ["", "", "", ""], blockedD = ["", "", "", ""];
      for (const e of RESEARCH_NETWORK.edges) {
        if (candidate.has(e.id)) continue;
        const tier = TIERS.get(e.id)!, sub = edgeSub(e.id, tier.from);
        if (liveBlocked.has(e.id)) blockedD[tier.tier] += sub; else legalD[tier.tier] += sub;
      }
      for (let t = 0; t < 4; t++) { set(tierLegal[t], "d", legalD[t]); set(tierBlocked[t], "d", blockedD[t]); }
      const cl: string[] = [], cb: string[] = [];
      committed.unconstrained.edges.forEach((eid, i) => (liveBlocked.has(eid) ? cb : cl).push(edgeSub(eid, committed.unconstrained.nodes[i])));
      set(candLegal, "d", cl.join("")); set(candBlocked, "d", cb.join(""));
      if (!cx) set(previewRoute, "d", preview && st.liveEval.accepted ? routeSubpaths(st.liveEval.accepted) : "");
    }
    // the committed evaluation: rejected candidate + ×, runner-up, accepted route and its node order
    const cKey = `${sKey}|${committed.constraint.x},${committed.constraint.y}|${preview}`, committedMoved = cKey !== committedKey;
    if (committedMoved || ringsMoved || extrasChanged) {
      set(xmarks, "d", extras.marks.map((_, i) => {
        const p = extraAt(i); return `M${n1(p.x - 5.5)},${n1(p.y - 5.5)}l11,11M${n1(p.x + 5.5)},${n1(p.y - 5.5)}l-11,11`;
      }).join(""));
      if (runnerLabel && extras.runnerAt) {
        const p = extraAt(extras.marks.length);
        set(runnerLabel, "x", p.x + 10); set(runnerLabel, "y", p.y + (p.y > hc.y ? 18 : -10));
      }
    }
    if (committedMoved) {
      committedKey = cKey;
      set(rejected, "d", committed.unconstrainedLegal ? "" : routeSubpaths(committed.unconstrained));
      if (!cx) set(runner, "d", committed.runnerUp && committed.routeClass !== "direct" ? routeSubpaths(committed.runnerUp) : "");
      routeScr = committed.accepted ? routeScreen(committed.accepted) : null;
      routeCum = routeScr ? cumulative(routeScr) : [];
      routeDomY = stage && committed.accepted ? routeDepth(committed.accepted) : null;
      const routeD = routeScr ? polyD(routeScr, false) : "";
      set(route, "d", routeD); set(routeHalo, "d", routeD);
      if (routeHill) set(routeHill, "d", routeD);
      if (!cx) set(ghost, "d", preview ? routeD : "");
      // route vertices fill as the stroke passes: their arc-length position along the projected route
      litAt = new Map();
      if (routeScr && committed.accepted) {
        const total = routeCum[routeCum.length - 1] || 1;
        for (const nid of committed.accepted.nodes) {
          const p = nodeAt(nid); let best = 0, bd = Infinity;
          for (let i = 0; i < routeCum.length; i++) { const d = Math.hypot(routeScr[2 * i] - p.x, routeScr[2 * i + 1] - p.y); if (d < bd) { bd = d; best = routeCum[i]; } }
          litAt.set(nid, best / total);
        }
      }
    }

    // FIX2 depth in the climax: the runner-up (committed), the ghost of the committed route and the live preview, each split
    // against the live hill. Outside the climax the legacy strings above stand and the see-through copies are empty.
    const dKey = cx ? `${ringKey}|${committedKey}|${liveKey}` : "";
    if (dKey !== depthKey) {
      depthKey = dKey;
      behindOn = [false, false, false];
      if (cx) {
        const none = { front: "", behind: "" }, split = (r: Route | null) => (r ? splitByHill(r, c.y) : none);
        const rs = split(committed.runnerUp && committed.routeClass !== "direct" ? committed.runnerUp : null);
        const gs = split(preview ? committed.accepted : null), ps = split(preview ? st.liveEval.accepted : null);
        set(runner, "d", rs.front); set(runnerBehind, "d", rs.behind);
        set(ghost, "d", gs.front); set(ghostBehind, "d", gs.behind);
        set(previewRoute, "d", ps.front); set(previewBehind, "d", ps.behind);
        behindOn = [rs.behind !== "", gs.behind !== "", ps.behind !== ""];
      } else for (const el of [runnerBehind, ghostBehind, previewBehind]) set(el, "d", "");
    }

    // ---------------------------------------------------------------- per-frame emphasis (opacity and dash only)
    // Layers that have faded out are not drawn at all (nothing to rasterise on a morph frame).
    const shown = (el: Element | null, opacity: number) => { if (el) set(el, "display", opacity > 0.004 ? "inline" : "none"); };
    // The bleed spans the whole stage: its fade moves in 1/16 steps (at most 16 full-stage repaints per pass, ≤ .003 each).
    const bleedLevel = Math.round(16 * (1 - s) * ph.grid);
    for (const el of bleeds) { set(el, "fill-opacity", ((0.05 * bleedLevel) / 16).toFixed(4)); shown(el, bleedLevel); }
    set(vigMid, "offset", r3(0.62 + 0.28 * s));
    if (land && E > 0) {
      // Climax: the tile dissolves into the ground. Its fill compensates the ground tint (inside stays at .6, no seam) and
      // its outline fades, so the card edge disappears while the same surface spreads to the environment's edges.
      set(land, "fill-opacity", (1 - 0.4 / (1 - 0.6 * E)).toFixed(3)); set(land, "stroke-opacity", (0.2 * (1 - E)).toFixed(3)); shown(land, 1 - E);
    } else if (land) { set(land, "fill-opacity", s > 0.02 ? 0.6 * s : 0); set(land, "stroke-opacity", s > 0.02 ? 0.2 * s : 0); shown(land, s > 0.02 ? s : 0); }
    if (ground) { set(ground, "fill-opacity", (0.6 * E).toFixed(3)); shown(ground, E); }
    for (const el of [fieldFar, fieldNear]) if (el) { set(el, "stroke-opacity", (0.17 * E).toFixed(3)); shown(el, E); }
    set(gridMinor, "stroke-opacity", 0.055 * (1 - s) * ph.grid); shown(gridMinor, 0.055 * (1 - s) * ph.grid);
    set(gridMajor, "stroke-opacity", (0.095 + 0.075 * s) * ph.grid); shown(gridMajor, ph.grid);
    for (const el of [orbitA, orbitB, ticks, crosses]) set(el, "opacity", ph.grid);
    if (register) set(register, "opacity", s > 0 ? 0 : 1 - ph.grid);
    if (guides && guidesOn) {
      // FIX2 studio domains, in the same camera as everything else. Stems rise from their vertices (height kept in screen
      // terms while the relief eases), each structure assembles on a plate at its stem top, and a leader reaches the label
      // row placed by the model from the measured labels (the stage writes the HTML labels from `domains()`). A stem and its
      // structure take the route colour only while the drawn route passes through their vertex; the meaning never changes.
      const drawn = drawnRoute(preview, st.liveEval, committed, revealT > 0), onIds = domainsOn(drawn);
      const gl = cl.glyphs, lb = cl.labels, dom = cx?.domains, drawnKey = drawn ? drawn.nodes.join() : "";
      if (cx && G > 0) {
        const key = `${sKey}|${G}|${gl.join()}|${lb.join()}|${drawnKey}`;
        if (key !== guideKey) {
          guideKey = key;
          const relief = view.relief ?? 1, Hn = RESEARCH_CLIMAX.anchorHeight, size = glyphScale(cam.k);
          // 1. Placement moves only with the camera, the constraint and the drawn route (not with the ramps).
          const placeKey = `${sKey}|${drawnKey}`;
          if (placeKey !== domainPlaceKey) {
            domainPlaceKey = placeKey;
            /** Full-height stems and each structure's extent above its plate there (the row's input), for vertex heights `zOf`. */
            const inputsAt = (zOf: (i: number) => number, v: View, k: Camera) => {
              const r = v.relief ?? 1;
              RESEARCH_DOMAINS.forEach((_, i) => { const z = zOf(i); guidePoly.z[2 * i] = z; guidePoly.z[2 * i + 1] = z + Hn / r; });
              projectPoints(guidePoly.src, guidePoly.z, guidePoly.scr, v, k);
              const g = guidePoly.scr;
              return RESEARCH_DOMAINS.map((d, i) => {
                const gp = glyphPolys[i], ax = g[4 * i + 2];
                placeGlyph(gp, NODES.get(d.node)!, guidePoly.z[2 * i + 1], size, r);
                projectPoints(gp.src, gp.z, gp.scr, v, k);
                let top = Infinity, gw = 0;
                for (let q = 0; q < gp.scr.length; q += 2) { top = Math.min(top, gp.scr[q + 1]); gw = Math.max(gw, Math.abs(gp.scr[q] - ax)); }
                return { ax, baseY: g[4 * i + 1], topY: g[4 * i + 3], ext: Math.max(0, g[4 * i + 3] - top), gw, w: dom?.labels[i]?.w ?? 0, h: dom?.labels[i]?.h ?? 0 };
              });
            };
            const full = dom && dom.labels.length === RESEARCH_DOMAINS.length ? dom : null;
            // One row or the crown: decided once per layout, from the default commit seen from the resting pointer.
            if (full && !tiers) {
              tiers = chooseDomainTiers(inputsAt((i) => { const n = NODES.get(RESEARCH_DOMAINS[i].node)!; return height(n.x, n.y, DEFAULT_CONSTRAINT); },
                climaxView({ ...base, yaw: 0, pitch: 0 }, 1), cx.camera), full);
            }
            const inputs = inputsAt((i) => nodePoly.z[NODE_INDEX.get(RESEARCH_DOMAINS[i].node)!], view, cam);
            const routeXs = drawn ? (drawn === committed.accepted ? routeScr : routeScreen(drawn)) : null;
            // The row keeps clear of the vertices, the constraint's outlines and the drawn route wherever they rise into its band.
            placed = full ? placeDomainLabels(inputs, full, tiers || 1, bandMarks(routeXs)) : null;
            // A structure fades out where its finished form would meet a vertex, the handle, the constraint's outlines, the
            // drawn route, a label or the title row; its label, stem and leader stay.
            const sz = L.compact ? 0.72 : 1;
            const marks = {
              points: [ringPolys[3].scr, ringPolys[4].scr], ceiling: full ? full.top - 16 : -Infinity,
              discs: RESEARCH_NETWORK.nodes.map((n, i) => [nodePoly.scr[2 * i], nodePoly.scr[2 * i + 1], (n.role === "anchor" ? 15 : n.role === "relay" ? 9 : n.role === "hub" ? 7.5 : 4.8) * sz] as const),
            };
            structVis = RESEARCH_DOMAINS.map((d, i) => {
              if (!placed) return 1;
              const gp = glyphPolys[i];
              placeGlyph(gp, NODES.get(d.node)!, guidePoly.z[2 * i] + (Hn * placed[i].stem) / relief, size, relief);
              projectPoints(gp.src, gp.z, gp.scr, view, cam);
              const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
              for (let q = 0; q < gp.scr.length; q += 2) { b.x0 = Math.min(b.x0, gp.scr[q]); b.x1 = Math.max(b.x1, gp.scr[q]); b.y0 = Math.min(b.y0, gp.scr[q + 1]); b.y1 = Math.max(b.y1, gp.scr[q + 1]); }
              // Its own vertex is where it stands: that vertex and the drawn route's links meeting it do not count.
              const own = NODE_INDEX.get(d.node)!, away: number[] = [];
              if (drawn) for (const eid of drawn.edges) {
                const e = EDGE_BY_ID.get(eid)!;
                if (e.a !== d.node && e.b !== d.node) away.push(...edgePolys.get(eid)!.scr);
              }
              return structureVisibility(structureClearance(b, {
                ...marks, points: [...marks.points, away], discs: [...marks.discs.filter((_, k) => k !== own), [hc.x, hc.y, 16] as const], labels: placed,
              }));
            });
          }
          // 2. Each structure on its final plate (the stem shortened under the row where needed), opening with its ramp.
          const off: string[] = [], onD: string[] = [];
          domainOut = placed ? [] : null;
          RESEARCH_DOMAINS.forEach((d, i) => {
            const gp = glyphPolys[i], base = nodeAt(d.node), gi = gl[i], stem = placed ? placed[i].stem : 1, vis = structVis[i] ?? 1, on = onIds.includes(d.id);
            placeGlyph(gp, NODES.get(d.node)!, guidePoly.z[2 * i] + (Hn * stem * G - 5 * (1 - gi)) / relief, (0.72 + 0.28 * gi) * size, relief);
            projectPoints(gp.src, gp.z, gp.scr, view, cam);
            const p = gp.scr, m = p.length / 2, axX = p[2 * m - 2], axY = p[2 * m - 1];
            let top = Infinity;
            for (let k = 1; k < p.length - 4; k += 2) top = Math.min(top, p[k]);
            let stemD = `M${n1(base.x)},${n1(base.y)}L${n1(axX)},${n1(axY)}`;
            if (placed && lb[i] > 0) {
              // The leader grows with the label's own ramp: from just above the structure (from the stem top where the
              // structure has faded) to the label's lower edge, or to its near side where the structure sits beside it.
              const q = placed[i], sy = mix(axY, Math.min(top, axY) - 4, vis), beside = sy < q.y1 + 2;
              const ex = beside ? (axX < (q.x0 + q.x1) / 2 ? q.x0 - 5 : q.x1 + 5) : q.attach, ey = beside ? Math.min(q.y1 - 8, Math.max(q.y0 + 8, sy)) : q.y1 + 5;
              stemD += `M${n1(axX)},${n1(sy)}L${n1(axX + (ex - axX) * lb[i])},${n1(sy + (ey - sy) * lb[i])}`;
            }
            (on ? onD : off).push(stemD);
            if (gi > 0) {
              let glyphD = "";
              for (const line of gp.lines) glyphD += polyD(p.subarray(2 * line.start, 2 * (line.start + line.count)), line.closed);
              set(glyphEls[i], "d", glyphD + circleD(p[2 * m - 4], p[2 * m - 3], 2.2));
            }
            toggle(glyphEls[i], "is-route", on);
            if (domainOut && placed) domainOut.push({ x: placed[i].x0, y: placed[i].y0, opacity: lb[i] });
          });
          set(guides, "d", off.join("")); set(guidesOn, "d", onD.join(""));
        }
      } else { guideKey = ""; domainPlaceKey = ""; domainOut = null; }
      for (const el of [guides, guidesOn]) { set(el, "opacity", G.toFixed(3)); shown(el, cx ? G : 0); }
      // The 700 ms signal (Evaluate) briefly strengthens a structure as it passes that vertex on the committed route.
      const f = showEval && st.signal !== null ? st.signal : null;
      glyphEls.forEach((el, i) => {
        const at = litAt.get(RESEARCH_DOMAINS[i].node), bump = f !== null && at !== undefined ? Math.max(0, 1 - Math.abs(f - at) / 0.08) : 0;
        const o = cx && G > 0 ? gl[i] * (structVis[i] ?? 1) : 0;
        set(el, "opacity", o.toFixed(3)); set(el, "stroke-width", (1 + 0.9 * bump).toFixed(2)); shown(el, o);
      });
    }
    for (let t = 0; t < 4; t++) {
      const k = ph.tiers[t];
      if (k < 1) {
        // Chrome restarts a dash pattern on every subpath, so each link draws out of its S-facing vertex.
        let len = 0;
        for (const e of RESEARCH_NETWORK.edges) if (TIERS.get(e.id)!.tier === t) len = Math.max(len, edgeD.get(e.id)?.len ?? 0);
        set(tierLegal[t], "stroke-dasharray", `${n1(len)} ${n1(len)}`); set(tierLegal[t], "stroke-dashoffset", r1(len * (1 - k)));
      } else { set(tierLegal[t], "stroke-dasharray", "none"); set(tierLegal[t], "stroke-dashoffset", 0); }
      set(tierLegal[t], "opacity", k > 0 ? 1 : 0);
      set(tierBlocked[t], "opacity", k);
    }
    const ringsT = ph.rings;
    for (const el of [...costRings, coreFill, core, clearance, handleDisc, handleCross]) set(el, "opacity", ringsT);
    set(core, "stroke-width", st.hover || st.dragging ? 2.25 : 1.25);
    const contourT = 0.42 * clamp01((s - 0.15) / 0.55);
    for (const el of contours) set(el, "stroke-opacity", contourT);
    const labelT = L.labels ? ringsT * (1 - clamp01((s - 0.25) / 0.25)) : 0;
    if (annotCost && annotClear && (ringsMoved || extrasChanged || staticMoved)) {
      // Approximate mono advances (0.6 em + letter-spacing) keep the choice free of layout reads during a drag.
      type Rect = { x0: number; y0: number; x1: number; y1: number };
      const boxAt = (p: Pt, chars: number, size: number, right: boolean, above: boolean): Rect => {
        const w = chars * size * 0.7, x = p.x + (right ? 8 : -8), y = p.y + (above ? -4 : 12);
        return right ? { x0: x, y0: y - size, x1: x + w, y1: y + 3 } : { x0: x - w, y0: y - size, x1: x, y1: y + 3 };
      };
      const overlap = (a: Rect, b: Rect) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) + 8) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) + 8);
      const S = nodeAt("S"), T = nodeAt("T"), portrait = L.orient === "portrait";
      // Anchor labels sit at node + (26, 50) (landscape, T mirrored) or node + (30, 4) (portrait); boxAt adds (±8, 12).
      const taken: Rect[] = [...(L.avoid ?? [])];
      if (anchorLabels.length) taken.push(
        boxAt({ x: S.x + (portrait ? 22 : 18), y: S.y + (portrait ? -8 : 38) }, (anchorLabels[0].textContent ?? "").length, 10.5, true, false),
        portrait ? boxAt({ x: T.x + 22, y: T.y - 8 }, (anchorLabels[1].textContent ?? "").length, 10.5, true, false)
          : boxAt({ x: T.x - 18, y: T.y + 38 }, (anchorLabels[1].textContent ?? "").length, 10.5, false, false),
      );
      if (extras.runnerAt && runnerLabel) { const p = extraAt(extras.marks.length); taken.push(boxAt({ x: p.x + 2, y: p.y + (p.y > hc.y ? 6 : -6) }, st.runnerUpLabel.length, 10.5, true, p.y <= hc.y)); }
      if (committed.accepted) {
        const q = nodeAt("H");
        for (const nid of committed.accepted.nodes) {
          if (nid === "S" || nid === "T") continue;
          const p = nodeAt(nid); let ux = p.x - q.x, uy = p.y - q.y; const len = Math.hypot(ux, uy) || 1; ux /= len; uy /= len;
          const x = p.x + ux * 15, y = p.y + uy * 15 + 3;
          taken.push({ x0: x - 16, y0: y - 10, x1: x + 16, y1: y + 3 });
        }
      }
      const base = extras.marks.length + (extras.runnerAt ? 1 : 0);
      for (const [el, offset, scores, which] of [[annotCost, base, extras.costScores, 0], [annotClear, base + 4, extras.clearScores, 1]] as const) {
        let best = { score: -Infinity, clear: 0, overlapArea: 0, p: extraAt(offset), right: true, above: true, box: null as Rect | null };
        for (let k = 0; k < 4; k++) {
          const p = extraAt(offset + k), right = p.x >= hc.x, above = p.y < hc.y, box = boxAt(p, (el.textContent ?? "").length, 9, right, above);
          const overlapArea = taken.reduce((sum, t) => sum + overlap(box, t), 0), clear = scores[k] * cam.k;
          if (clear - overlapArea > best.score) best = { score: clear - overlapArea, clear, overlapArea, p, right, above, box };
        }
        // Shown only where it fits: no overlap and at least 12 px from the drawn route (the readout states the rule anyway).
        annotFits[which] = best.overlapArea === 0 && best.clear >= 12;
        if (best.box && annotFits[which]) taken.push(best.box);
        set(el, "x", best.p.x + (best.right ? 8 : -8)); set(el, "y", best.p.y + (best.above ? -4 : 12)); set(el, "text-anchor", best.right ? "start" : "end");
      }
    }
    if (annotCost) set(annotCost, "opacity", annotFits[0] ? labelT : 0);
    if (annotClear) set(annotClear, "opacity", annotFits[1] ? labelT : 0);
    if (selected) {
      const on = s < 0.02 ? (st.dragging ? 1 : st.hint) : 0;
      set(selected, "cx", hc.x); set(selected, "cy", hc.y); set(selected, "r", cam.k * (RULE.core + 9)); set(selected, "opacity", on);
    }
    const blockedCandidate = !committed.unconstrainedLegal;
    const candT = preview || !blockedCandidate ? 1 : 1 - rejectT;
    set(candLegal, "opacity", candT); set(candBlocked, "opacity", candT);
    set(rejected, "opacity", showEval && blockedCandidate ? rejectT : 0);
    set(xmarks, "opacity", showEval && blockedCandidate ? rejectT : 0);
    set(runner, "opacity", showEval ? runnerT : 0);
    // Behind the hill the same marks fade with the tilt exactly like the accepted route's part there (see `routeHill`).
    const seeThrough = 1 - 0.62 * T;
    set(runnerBehind, "opacity", ((showEval ? runnerT : 0) * seeThrough).toFixed(3)); shown(runnerBehind, cx && showEval && behindOn[0] ? runnerT : 0);
    [ghostBehind, previewBehind].forEach((el, k) => { set(el, "opacity", (preview ? seeThrough : 0).toFixed(3)); shown(el, cx && preview && behindOn[1 + k] ? 1 : 0); });
    if (runnerLabel) {
      if (runnerLabel.textContent !== st.runnerUpLabel) runnerLabel.textContent = st.runnerUpLabel;
      set(runnerLabel, "opacity", showEval && L.labels && extras.runnerAt ? runnerT : 0);
    }
    set(ghost, "opacity", preview ? 1 : 0); set(previewRoute, "opacity", preview ? 1 : 0);
    const dash = revealT >= 1 ? "none" : `${Math.max(0, revealT).toFixed(4)} 1`;
    for (const el of [route, routeHalo]) { set(el, "stroke-dasharray", dash); set(el, "opacity", showEval && revealT > 0 ? 1 : 0); }
    if (routeHill) {
      // Climax only: the route is clipped outside the hill, and its part behind the hill fades to see-through with the tilt
      // (still drawn and continuous; its vertices stay solid on top).
      if (Boolean(cx) !== routeSplit) { routeSplit = Boolean(cx); if (routeSplit) route.setAttribute("clip-path", `url(#${id("open")})`); else route.removeAttribute("clip-path"); }
      set(routeHill, "stroke-dasharray", dash); set(routeHill, "opacity", ((showEval && revealT > 0 ? 1 : 0) * (1 - 0.62 * T)).toFixed(3)); shown(routeHill, cx ? 1 : 0);
    }
    const sig = showEval && st.signal !== null && routeScr ? along(routeScr, routeCum, st.signal) : null;
    // In the climax the signal is see-through while it runs behind the hill (inside its outline, farther than the constraint).
    const sigBehind = Boolean(sig && cx && hillPts && routeDomY && insidePolygon(sig.x, sig.y, hillPts) && alongDepth(routeDomY, routeCum, st.signal!) < c.y);
    for (const el of [signalHalo, signalDot]) { set(el, "opacity", sig ? (sigBehind ? seeThrough.toFixed(3) : 1) : 0); if (sig) { set(el, "cx", sig.x); set(el, "cy", sig.y); } }

    // vertices: appearance by depth tier, route fill, inside-zone styling; halo rings of the visible majors
    const Rb = blockRadius(), sz = L.compact ? 0.72 : 1, rings1: string[] = [], rings2: string[] = [];
    for (const n of RESEARCH_NETWORK.nodes) {
      const el = nodeEls.get(n.id)!;
      const lit = showEval && revealT > 0 && litAt.has(n.id) && revealT >= litAt.get(n.id)! - 1e-6;
      const appear = CANDIDATE_NODES.has(n.id) ? 1 : ph.tiers[NODE_TIER.get(n.id)!];
      set(el, "opacity", appear);
      toggle(el, "is-route", lit);
      toggle(el, "is-inside", Math.hypot(n.x - c.x, n.y - c.y) <= Rb && n.role !== "anchor" && n.role !== "relay");
      if (n.role === "anchor" || n.role === "relay") {
        set(blooms.get(n.id)!, "opacity", appear);
        if (appear >= 0.5) {
          const p = nodeAt(n.id), big = (n.role === "anchor" ? 15 : 9) * sz;
          rings1.push(circleD(p.x, p.y, big + 10 * sz)); rings2.push(circleD(p.x, p.y, big + 24 * sz));
        }
      } else if (n.role === "hub") { set(el, "r", (lit ? 7.5 : 6.5) * sz); set(hubRing, "opacity", appear); }
      else set(el, "r", (lit ? 4.8 : 3.6) * sz);
    }
    set(ring1, "d", rings1.join("")); set(ring2, "d", rings2.join(""));
    if (labelPool.length) {
      const q = nodeAt("H"), labelled = showEval && committed.accepted ? committed.accepted.nodes.filter((nid) => nid !== "S" && nid !== "T") : [];
      labelPool.forEach((el, i) => {
        const nid = labelled[i];
        if (!nid || !L.labels) { set(el, "opacity", 0); return; }
        const p = nodeAt(nid);
        let ux = p.x - q.x, uy = p.y - q.y; const len = Math.hypot(ux, uy) || 1; ux /= len; uy /= len;
        if (el.textContent !== nid) el.textContent = nid;
        set(el, "x", p.x + ux * 15); set(el, "y", p.y + uy * 15 + 3);
        set(el, "text-anchor", ux > 0.3 ? "start" : ux < -0.3 ? "end" : "middle");
        set(el, "opacity", revealT > 0 && revealT >= (litAt.get(nid) ?? 1) - 1e-6 ? 1 : 0);
      });
      anchorLabels.forEach((el, i) => {
        const p = nodeAt(i ? "T" : "S"), portrait = L.orient === "portrait";
        set(el, "x", portrait ? p.x + 30 : p.x + (i ? -26 : 26)); set(el, "y", portrait ? p.y + 4 : p.y + 50);
        if (portrait) set(el, "text-anchor", "start");
        set(el, "opacity", L.labels ? 1 : 0);
      });
    }
    if (captions.length) {
      const a = { x: landPoly.scr[0], y: landPoly.scr[1] }, b = { x: landPoly.scr[2 * FAR_CORNER], y: landPoly.scr[2 * FAR_CORNER + 1] };
      set(captions[0], "x", Math.max(L.art.x0 + 4, a.x + 4)); set(captions[0], "y", Math.max(L.art.y0 + 12, a.y - 12));
      set(captions[1], "x", Math.min(L.art.x1 - 4, b.x - 4)); set(captions[1], "y", Math.min(L.art.y1 - 6, b.y + 24));
      // The corner captions mark the tile; they leave with its edge when the ground takes over.
      set(captions[0], "opacity", (1 - 0.6 * s) * ph.grid * (1 - E)); set(captions[1], "opacity", Math.max(0.3, s) * ph.grid * (1 - E));
    }
  }

  return {
    setLayout, render,
    handle: () => lastHandle,
    domains: () => domainOut,
    drawableCount: () => svg.querySelectorAll("path,circle,line,rect,text,ellipse,polyline,polygon,use,image").length,
    destroy: () => svg.replaceChildren(),
  };
}

/** Decision minimap writer: the shipped 16 × 10 class constant plus the live input marker. */
export function createMinimap(svg: SVGSVGElement, rows: readonly string[], step: number) {
  const sp = 7.5, circles: string[] = [], filled: string[] = [], squares: string[] = [];
  rows.forEach((row, j) => [...row].forEach((cls, i) => {
    const x = i * sp, y = j * sp;
    if (cls === "d") circles.push(circleD(x, y, 1.7));
    else if (cls === "a") filled.push(circleD(x, y, 2.3));
    else squares.push(`M${r1(x - 2)},${r1(y - 2)}h4v4h-4z`);
  }));
  const w = (rows[0].length - 1) * sp, h = (rows.length - 1) * sp, pad = 10;
  svg.setAttribute("viewBox", `${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}`);
  svg.setAttribute("width", String(w + 2 * pad)); svg.setAttribute("height", String(h + 2 * pad));
  svg.replaceChildren();
  const add = (cls: string, d: string) => { const p = document.createElementNS(NS, "path"); p.setAttribute("class", cls); p.setAttribute("d", d); svg.appendChild(p); return p; };
  add("rf-map-d", circles.join("")); add("rf-map-a", filled.join("")); add("rf-map-b", squares.join(""));
  const marker = add("rf-map-marker", "");
  let key = "";
  return (c: Constraint) => {
    const k = `${c.x},${c.y}`;
    if (k === key) return;
    key = k;
    const x = ((c.x - 200) / step) * sp, y = ((c.y - 110) / step) * sp;
    marker.setAttribute("d", `${circleD(x, y, 6)}M${r1(x - 9)},${r1(y)}h4M${r1(x + 5)},${r1(y)}h4M${r1(x)},${r1(y - 9)}v4M${r1(x)},${r1(y + 5)}v4`);
  };
}
