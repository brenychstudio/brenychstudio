// Section 06 Rule Field → Authored Terrain: pure, deterministic model (owner-approved REV1 contract).
// No DOM and no dependencies. Domain units: x right, y down, 1000 × 600.
//
//   legality : a link is allowed iff its exact distance to the constraint centre exceeds R = core + clearance
//   cost     : length + w · ∫ φ(d(s)) ds, φ(d) = clamp(1 − (d − R)/M, 0, 1)²  (bounded proximity cost, C¹)
//   solver   : Dijkstra on allowed links, total order (cost within 1e-9 relative, lexicographic node-order path)
//   explain  : unconstrained pure-length route, best route forced above / below the constraint, blocked links
//   terrain  : the same geometry lifted by h(x, y; constraint) and seen through one camera
//
// The solver, network and terrain are a faithful port of the REV1 prototype; scripts/validate-ecosystem-home.mts
// re-derives every supported input and compares the result fingerprint with the REV1 proof.

export type Pt = { x: number; y: number };
export type NodeRole = "anchor" | "hub" | "inner" | "outer" | "relay";
export type GraphNode = { id: string; x: number; y: number; role: NodeRole; order: number };
export type LineEdge = { id: string; a: string; b: string; kind: "line"; group: string };
export type ArcEdge = { id: string; a: string; b: string; kind: "arc"; group: string; qx: number; qy: number; r: number; a0: number; sweep: number };
export type GraphEdge = LineEdge | ArcEdge;
export type Network = { nodes: GraphNode[]; edges: GraphEdge[]; source: string; target: string };
export type Constraint = { x: number; y: number };

export const DOMAIN = { width: 1000, height: 600 } as const;
export const RING = { qx: 500, qy: 300, inner: 112, outer: 224, count: 8 } as const;
export const CONSTRAINT = {
  xMin: 200, xMax: 800, yMin: 110, yMax: 490, step: 5,
  defaultX: 500, defaultY: 335,
} as const;
/** Legality tolerance: touching (margin within 1e-6 of zero, incl. last-ulp trig differences between JS engines) is blocked. */
export const LEGAL_EPSILON = 1e-6;
export const RULE = { core: 68, clearance: 24, influence: 140, weight: 0.25 } as const;
export const blockRadius = () => RULE.core + RULE.clearance;
const EPS = 1e-9;

// ---------------------------------------------------------------- network (authored, persistent IDs)
export function buildNetwork(): Network {
  const nodes: GraphNode[] = [];
  const add = (id: string, x: number, y: number, role: NodeRole) => nodes.push({ id, x, y, role, order: nodes.length });
  // Point-symmetric about the ring centre Q: every node/edge maps to its 180° partner (S↔T, Ik↔Ik+4, P1↔P4, P3↔P2),
  // so "above" and "below" are equally available; only the constraint breaks the symmetry.
  add("S", 48, 312, "anchor");
  add("T", 952, 288, "anchor");
  add("H", RING.qx, RING.qy, "hub");
  const ang = (k: number) => (k * Math.PI) / 4;
  for (let k = 0; k < RING.count; k++) add(`I${k}`, RING.qx + RING.inner * Math.cos(ang(k)), RING.qy - RING.inner * Math.sin(ang(k)), "inner");
  for (let k = 0; k < RING.count; k++) add(`O${k}`, RING.qx + RING.outer * Math.cos(ang(k)), RING.qy - RING.outer * Math.sin(ang(k)), "outer");
  add("P1", 176, 116, "relay");
  add("P2", 832, 108, "relay");
  add("P3", 168, 492, "relay");
  add("P4", 824, 484, "relay");

  const edges: GraphEdge[] = [];
  const line = (id: string, a: string, b: string, group: string) => edges.push({ id, a, b, kind: "line", group });
  const arc = (id: string, a: string, b: string, group: string, r: number, k: number) =>
    edges.push({ id, a, b, kind: "arc", group, qx: RING.qx, qy: RING.qy, r, a0: ang(k), sweep: Math.PI / 4 });
  for (let k = 0; k < RING.count; k++) line(`h${k}`, "H", `I${k}`, "spoke");
  for (let k = 0; k < RING.count; k++) line(`r${k}`, `I${k}`, `O${k}`, "radial");
  for (let k = 0; k < RING.count; k++) arc(`i${k}`, `I${k}`, `I${(k + 1) % RING.count}`, "inner", RING.inner, k);
  for (let k = 0; k < RING.count; k++) arc(`o${k}`, `O${k}`, `O${(k + 1) % RING.count}`, "outer", RING.outer, k);
  line("sw", "S", "O4", "axis");
  line("te", "O0", "T", "axis");
  line("sp1", "S", "P1", "lane");
  line("sp3", "S", "P3", "lane");
  line("tp2", "P2", "T", "lane");
  line("tp4", "P4", "T", "lane");
  line("p1o3", "P1", "O3", "lane");
  line("p3o5", "P3", "O5", "lane");
  line("p2o1", "O1", "P2", "lane");
  line("p4o7", "O7", "P4", "lane");
  line("p1o2", "P1", "O2", "lane");
  line("p2o2", "O2", "P2", "lane");
  line("p3o6", "P3", "O6", "lane");
  line("p4o6", "O6", "P4", "lane");
  return { nodes, edges, source: "S", target: "T" };
}

// ---------------------------------------------------------------- exact geometry
const TAU = Math.PI * 2;
const mod = (a: number, m: number) => ((a % m) + m) % m;
/** Read-only lookups per network object (built once; the solver's arithmetic is unchanged). */
type NetworkIndex = { nodes: Map<string, GraphNode>; order: Map<string, number>; byOrder: Map<number, string>; edgeById: Map<string, GraphEdge> };
const networkIndex = new WeakMap<Network, NetworkIndex>();
function indexOf(net: Network): NetworkIndex {
  let index = networkIndex.get(net);
  if (!index) {
    index = {
      nodes: new Map(net.nodes.map((n) => [n.id, n] as const)), order: new Map(net.nodes.map((n) => [n.id, n.order] as const)),
      byOrder: new Map(net.nodes.map((n) => [n.order, n.id] as const)), edgeById: new Map(net.edges.map((e) => [e.id, e] as const)),
    };
    networkIndex.set(net, index);
  }
  return index;
}
export function nodeMap(net: Network) { return indexOf(net).nodes; }

export function arcPoint(e: ArcEdge, t: number): Pt {
  const a = e.a0 + e.sweep * t;
  return { x: e.qx + e.r * Math.cos(a), y: e.qy - e.r * Math.sin(a) };
}
export function edgeLength(e: GraphEdge, nodes: Map<string, GraphNode>): number {
  if (e.kind === "arc") return e.r * Math.abs(e.sweep);
  const a = nodes.get(e.a)!, b = nodes.get(e.b)!;
  return Math.hypot(b.x - a.x, b.y - a.y);
}
/** Exact Euclidean distance from p to the edge geometry (segment or circular arc). */
export function distanceToEdge(p: Pt, e: GraphEdge, nodes: Map<string, GraphNode>): number {
  if (e.kind === "line") {
    const a = nodes.get(e.a)!, b = nodes.get(e.b)!;
    const vx = b.x - a.x, vy = b.y - a.y, len2 = vx * vx + vy * vy;
    const t = len2 ? Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2)) : 0;
    return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
  }
  const phi = Math.atan2(-(p.y - e.qy), p.x - e.qx);
  const rel = mod(phi - e.a0, TAU);
  if (rel <= e.sweep) return Math.abs(Math.hypot(p.x - e.qx, p.y - e.qy) - e.r);
  const a = arcPoint(e, 0), b = arcPoint(e, 1);
  return Math.min(Math.hypot(p.x - a.x, p.y - a.y), Math.hypot(p.x - b.x, p.y - b.y));
}
/** Points along the edge from node a to node b at ≤ `step` spacing (inclusive endpoints). */
export function sampleEdge(e: GraphEdge, nodes: Map<string, GraphNode>, step = 10): Pt[] {
  const n = Math.max(1, Math.ceil(edgeLength(e, nodes) / step));
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    if (e.kind === "arc") out.push(arcPoint(e, t));
    else { const a = nodes.get(e.a)!, b = nodes.get(e.b)!; out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }); }
  }
  return out;
}

// ---------------------------------------------------------------- legality and cost
export function proximity(d: number): number {
  const u = 1 - (d - blockRadius()) / RULE.influence;
  return u <= 0 ? 0 : u >= 1 ? 1 : u * u;
}
/** Simpson integral of φ along the edge (even panel count, ≤ 8 units per panel). */
export function proximityIntegral(e: GraphEdge, nodes: Map<string, GraphNode>, c: Constraint): number {
  const L = edgeLength(e, nodes);
  let n = Math.max(2, Math.ceil(L / 8)); if (n % 2) n++;
  let acc = 0;
  const a = nodes.get(e.a)!, b = nodes.get(e.b)!;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // Same expressions as arcPoint() and the segment interpolation, without allocating a point per sample.
    let px: number, py: number;
    if (e.kind === "arc") { const ang = e.a0 + e.sweep * t; px = e.qx + e.r * Math.cos(ang); py = e.qy - e.r * Math.sin(ang); }
    else { px = a.x + (b.x - a.x) * t; py = a.y + (b.y - a.y) * t; }
    const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
    acc += w * proximity(Math.hypot(px - c.x, py - c.y));
  }
  return (acc * L) / (3 * n);
}
export type EdgeState = { id: string; legal: boolean; distance: number; margin: number; length: number; cost: number };
export function evaluateEdges(net: Network, c: Constraint): Map<string, EdgeState> {
  const nodes = nodeMap(net);
  const out = new Map<string, EdgeState>();
  for (const e of net.edges) {
    const distance = distanceToEdge(c, e, nodes);
    const length = edgeLength(e, nodes);
    const R = blockRadius();
    const legal = distance - R > LEGAL_EPSILON;
    out.set(e.id, { id: e.id, legal, distance, margin: distance - R, length, cost: length + RULE.weight * proximityIntegral(e, nodes, c) });
  }
  return out;
}

// ---------------------------------------------------------------- deterministic shortest path
export type Route = { nodes: string[]; edges: string[]; cost: number; length: number };
type Label = { cost: number; path: number[]; edges: string[] };
function lexLess(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return a.length < b.length;
}
function better(a: Label, b: Label | undefined) {
  if (!b) return true;
  if (a.cost < b.cost - EPS * Math.max(1, b.cost)) return true;
  if (a.cost > b.cost + EPS * Math.max(1, b.cost)) return false;
  return lexLess(a.path, b.path);
}
/** Dijkstra with a total order (cost, then lexicographic node-order path). `weight(e)` = Infinity removes an edge. */
export function shortestRoute(net: Network, weight: (e: GraphEdge) => number): Route | null {
  const { nodes, order, byOrder, edgeById } = indexOf(net);
  const adj = new Map<string, { to: string; e: GraphEdge; w: number }[]>();
  for (const n of net.nodes) adj.set(n.id, []);
  for (const e of net.edges) {
    const w = weight(e);
    if (!Number.isFinite(w)) continue;
    adj.get(e.a)!.push({ to: e.b, e, w });
    adj.get(e.b)!.push({ to: e.a, e, w });
  }
  const best = new Map<string, Label>();
  const done = new Set<string>();
  best.set(net.source, { cost: 0, path: [order.get(net.source)!], edges: [] });
  for (;;) {
    let u: string | null = null;
    for (const [id, lab] of best) if (!done.has(id) && (u === null || better(lab, best.get(u)))) u = id;
    if (u === null) return null;
    if (u === net.target) break;
    done.add(u);
    const lu = best.get(u)!;
    for (const { to, e, w } of adj.get(u)!) {
      if (done.has(to)) continue;
      const cand: Label = { cost: lu.cost + w, path: [...lu.path, order.get(to)!], edges: [...lu.edges, e.id] };
      if (better(cand, best.get(to))) best.set(to, cand);
    }
  }
  const lab = best.get(net.target)!;
  return { nodes: lab.path.map((o) => byOrder.get(o)!), edges: lab.edges, cost: lab.cost, length: lab.edges.reduce((s, id) => s + edgeLength(edgeById.get(id)!, nodes), 0) };
}

// ---------------------------------------------------------------- vertical-ray side test (explanation searches)
/** Y values where the edge crosses the vertical line x = xr (empty if none). */
export function crossingsAtX(e: GraphEdge, nodes: Map<string, GraphNode>, xr: number): number[] {
  if (e.kind === "line") {
    const a = nodes.get(e.a)!, b = nodes.get(e.b)!;
    if ((a.x - xr) * (b.x - xr) >= 0) return [];
    return [a.y + ((xr - a.x) * (b.y - a.y)) / (b.x - a.x)];
  }
  const dx = xr - e.qx;
  if (Math.abs(dx) >= e.r) return [];
  const h = Math.sqrt(e.r * e.r - dx * dx);
  const out: number[] = [];
  for (const y of [e.qy - h, e.qy + h]) {
    const rel = mod(Math.atan2(-(y - e.qy), dx) - e.a0, TAU);
    if (rel <= e.sweep) out.push(y);
  }
  return out;
}

// ---------------------------------------------------------------- full evaluation (what the UI shows)
export type RouteClass = "direct" | "above" | "below" | "mixed" | "none";
export type Evaluation = {
  constraint: Constraint;
  accepted: Route | null;
  routeClass: RouteClass;
  reason: "clear" | "blocked" | "margin" | "none";
  unconstrained: Route;
  unconstrainedLegal: boolean;
  blockedOnCandidate: string[];
  blockedEdges: string[];
  bestAbove: Route | null;
  bestBelow: Route | null;
  runnerUp: Route | null;
  detour: number; // accepted length / unconstrained length − 1
  minAcceptedMargin: number; // min (distance − R) over accepted edges
};
let cachedFree: { net: Network; route: Route } | null = null;
export function unconstrainedRoute(net: Network): Route {
  if (cachedFree && cachedFree.net === net) return cachedFree.route;
  const nodes = nodeMap(net);
  const route = shortestRoute(net, (e) => edgeLength(e, nodes))!;
  cachedFree = { net, route };
  return route;
}
export function evaluate(net: Network, c: Constraint): Evaluation {
  const nodes = nodeMap(net);
  const states = evaluateEdges(net, c);
  const free = unconstrainedRoute(net);
  const blockedEdges = net.edges.filter((e) => !states.get(e.id)!.legal).map((e) => e.id);
  const blockedOnCandidate = free.edges.filter((id) => !states.get(id)!.legal);
  const legalWeight = (e: GraphEdge) => (states.get(e.id)!.legal ? states.get(e.id)!.cost : Infinity);
  const accepted = shortestRoute(net, legalWeight);
  const xr = c.x + 1e-6;
  const crossings = new Map(net.edges.map((e) => [e.id, crossingsAtX(e, nodes, xr)] as const));
  const crossesBelow = (e: GraphEdge) => crossings.get(e.id)!.some((y) => y > c.y);
  const crossesAbove = (e: GraphEdge) => crossings.get(e.id)!.some((y) => y < c.y);
  const bestAbove = shortestRoute(net, (e) => (crossesBelow(e) ? Infinity : legalWeight(e)));
  const bestBelow = shortestRoute(net, (e) => (crossesAbove(e) ? Infinity : legalWeight(e)));
  const unconstrainedLegal = blockedOnCandidate.length === 0;
  let routeClass: RouteClass = "none";
  let reason: Evaluation["reason"] = "none";
  if (accepted) {
    const same = accepted.nodes.join() === free.nodes.join();
    if (same) { routeClass = "direct"; reason = "clear"; }
    else {
      const ys = accepted.edges.flatMap((id) => crossings.get(id)!);
      const up = ys.some((y) => y < c.y), down = ys.some((y) => y > c.y);
      routeClass = up && !down ? "above" : down && !up ? "below" : "mixed";
      reason = unconstrainedLegal ? "margin" : "blocked";
    }
  }
  const runnerUp = routeClass === "above" ? bestBelow : routeClass === "below" ? bestAbove : null;
  const minAcceptedMargin = accepted ? Math.min(...accepted.edges.map((id) => states.get(id)!.margin)) : NaN;
  return {
    constraint: c, accepted, routeClass, reason, unconstrained: free, unconstrainedLegal, blockedOnCandidate, blockedEdges,
    bestAbove, bestBelow, runnerUp, detour: accepted ? accepted.length / free.length - 1 : NaN, minAcceptedMargin,
  };
}
export function signature(r: Route | null) { return r ? r.nodes.join("·") : "∅"; }

/** Structural family of an accepted route, derived from its node sequence (used for the short route note). */
export type RouteFamily = "direct" | "wrap" | "lane" | "rejoin-origin" | "rejoin-destination" | "hop" | "none";
export function routeFamily(ev: Evaluation): RouteFamily {
  const r = ev.accepted;
  if (!r) return "none";
  if (ev.routeClass === "direct") return "direct";
  const n = r.nodes;
  const inner = n.filter((id) => id.startsWith("I")).length;
  if (n.some((id) => id.startsWith("P")) && !n.includes("H")) return "lane";
  if (!n.includes("H") && inner >= 4) return "wrap";
  const hubAt = n.indexOf("H");
  const free = ev.unconstrained.nodes;
  // Rejoin: the route leaves the free axis before the hub (origin side) or after it (destination side) through a relay.
  const before = n.slice(0, hubAt).join() !== free.slice(0, free.indexOf("H")).join();
  const after = n.slice(hubAt).join() !== free.slice(free.indexOf("H")).join();
  const viaRelay = n.some((id) => id.startsWith("P"));
  if (viaRelay && before && !after) return "rejoin-origin";
  if (viaRelay && after && !before) return "rejoin-destination";
  return "hop";
}

// ---------------------------------------------------------------- supported input lattice
export function constraintLattice(): Constraint[] {
  const out: Constraint[] = [];
  for (let x = CONSTRAINT.xMin; x <= CONSTRAINT.xMax; x += CONSTRAINT.step)
    for (let y = CONSTRAINT.yMin; y <= CONSTRAINT.yMax; y += CONSTRAINT.step) out.push({ x, y });
  return out;
}
export function quantize(c: Constraint): Constraint {
  const q = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, lo + Math.round((v - lo) / CONSTRAINT.step) * CONSTRAINT.step));
  return { x: q(c.x, CONSTRAINT.xMin, CONSTRAINT.xMax), y: q(c.y, CONSTRAINT.yMin, CONSTRAINT.yMax) };
}
export const DEFAULT_CONSTRAINT: Constraint = { x: CONSTRAINT.defaultX, y: CONSTRAINT.defaultY };
export const sameConstraint = (a: Constraint, b: Constraint) => a.x === b.x && a.y === b.y;

// ---------------------------------------------------------------- terrain: height field + one camera
export const TERRAIN = {
  peak: 128, peakSigma: 60, rim: 30, rimWidth: 34, back: 54, basin: 16, basinWidth: 84,
  pitch: (44 * Math.PI) / 180, distance: 2400, viewYaw: (3 * Math.PI) / 180, viewPitch: (2 * Math.PI) / 180,
} as const;
export function height(x: number, y: number, c: Constraint): number {
  const dc2 = (x - c.x) ** 2 + (y - c.y) ** 2;
  const rho = Math.hypot(x - RING.qx, y - RING.qy);
  const peak = TERRAIN.peak * Math.exp(-dc2 / (2 * TERRAIN.peakSigma ** 2));
  const rim = TERRAIN.rim * Math.exp(-(((rho - RING.outer) / TERRAIN.rimWidth) ** 2));
  const back = TERRAIN.back * ((DOMAIN.height - y) / DOMAIN.height) ** 2 * (0.6 + 0.4 * Math.sin((Math.PI * x) / DOMAIN.width));
  const basin = -TERRAIN.basin * Math.exp(-((rho / TERRAIN.basinWidth) ** 2));
  return peak + rim + back + basin;
}
export type Orientation = "landscape" | "portrait";
/** `tilt` (extra pitch, rad), `distance` and `relief` (vertical scale) exist only past the legacy story (FIX1 climax);
 *  absent, the REV1 camera is unchanged. */
export type View = { s: number; yaw: number; pitch: number; orient?: Orientation; tilt?: number; distance?: number; relief?: number };
export const smooth = (t: number) => { const u = Math.min(1, Math.max(0, t)); return u * u * (3 - 2 * u); };
/** Camera projection: s=0 is the exact flat plan (identity up to scale); s=1 is the terrain. Output in domain-scale units.
 *  Portrait (mobile) is a pure transpose of the same domain (screen x = domain y, screen y = domain x): origin at the top,
 *  destination at the bottom, and increasing "across" (cy) moves the constraint RIGHT, so the slider thumb and the
 *  constraint move the same way. Domain "above" therefore shows on the left in portrait. */
export function project(x: number, y: number, z: number, v: View): Pt {
  const e = v.s; // already eased by the caller
  let X0 = x - DOMAIN.width / 2, Y0 = y - DOMAIN.height / 2;
  if (v.orient === "portrait") [X0, Y0] = [Y0, X0];
  const cy = Math.cos(v.yaw * e), sy = Math.sin(v.yaw * e);
  const X = X0 * cy - Y0 * sy, Y = X0 * sy + Y0 * cy;
  const th = (TERRAIN.pitch + v.pitch) * e + (v.tilt ?? 0), D = v.distance ?? TERRAIN.distance;
  const Z = z * e * (v.relief ?? 1);
  const yc = Y * Math.cos(th) - Z * Math.sin(th);
  const depth = D - Y * Math.sin(th) - Z * Math.cos(th);
  const f = D / depth;
  return { x: X * f, y: yc * f };
}

/** `project()` for many points at once, followed by a camera (k, ox, oy): the same expressions with the trig hoisted.
 *  `src` holds domain pairs [x, y, …]; `z` the matching heights (ignored when s = 0, where the plan is exactly flat). */
export function projectPoints(src: ArrayLike<number>, z: ArrayLike<number> | null, dst: Float64Array, v: View, cam: Camera) {
  const e = v.s, portrait = v.orient === "portrait";
  const cy = Math.cos(v.yaw * e), sy = Math.sin(v.yaw * e);
  const th = (TERRAIN.pitch + v.pitch) * e + (v.tilt ?? 0), cth = Math.cos(th), sth = Math.sin(th);
  const hx = DOMAIN.width / 2, hy = DOMAIN.height / 2, D = v.distance ?? TERRAIN.distance, relief = v.relief ?? 1;
  for (let i = 0, j = 0; i < src.length; i += 2, j++) {
    let X0 = src[i] - hx, Y0 = src[i + 1] - hy;
    if (portrait) { const t = X0; X0 = Y0; Y0 = t; }
    const X = X0 * cy - Y0 * sy, Y = X0 * sy + Y0 * cy;
    const Z = z && e ? z[j] * e * relief : 0;
    const yc = Y * cth - Z * sth;
    const f = D / (D - Y * sth - Z * cth);
    dst[i] = cam.ox + cam.k * (X * f);
    dst[i + 1] = cam.oy + cam.k * (yc * f);
  }
}

// ---------------------------------------------------------------- layout and camera fit (CSS px, stage-local)
export type Box = { x0: number; y0: number; x1: number; y1: number };
export type ArtProfile = "full-cinematic" | "compact-cinematic";
export type ArtBox = { profile: ArtProfile; layout: "band" | "side"; x0: number; x1: number; y0: number; y1: number; cLeft: number; colW: number };
export const LAYOUT = {
  header: 84, topRow: 32, rowGap: 16, band: 128, bandGap: 24, bottom: 24,
  maxFill: 0.85, flatFill: 0.94, padTop: 24, padBottom: 16, nodeMargin: 24,
  /** Gap between the compact side column and the art box: anchor halo rings (≤ 39 px past the art box) keep ≥ 24 px clear. */
  sideGap: 64, edgeFade: 24,
} as const;
/** Dark Spatial → warm paper entrance: one scroll-bound surface gradient (sRGB stops). Height by width class. */
export const THRESHOLD = {
  height: (vw: number) => (vw >= 1024 ? 480 : vw >= 768 ? 320 : 240),
  stops: [[0, "#111b19"], [0.2, "#131d1b"], [0.44, "#27302b"], [0.6, "#a8a697"], [0.76, "#e6e0d1"], [1, "#f6f2e7"]] as const,
  /** Header scene marker (the header paints its own surface 62 px above its sensor) and Rail/capsule probe switch. */
  headerSwitch: 0.89, railSwitch: 0.74,
} as const;
export function railReserve(vw: number) { return vw >= 1280 ? 190 : 96; }
/** Matches Home's `.eco-wrap` left edge: clamp(50px, 3.9vw, 80px) at ≥ 1280, 32 px at 1024–1279. */
export function contentLeft(vw: number) { return vw >= 1280 ? Math.max(50, Math.min(80, 0.039 * vw)) : 32; }

/** Pinned stage art box in stage-local px (y0 from the sticky stage top). `env` is the page width without the scrollbar. */
export function artBox(vw: number, stageHeight: number, env = vw - 15, force?: "band" | "side"): ArtBox {
  const H = stageHeight, rail = railReserve(vw), cLeft = contentLeft(vw);
  const profile: ArtProfile = H + LAYOUT.header >= 760 ? "full-cinematic" : "compact-cinematic";
  const layout = force ?? (profile === "compact-cinematic" && vw >= 1440 ? "side" : "band");
  const colW = Math.max(300, Math.min(380, 0.24 * vw));
  const y0 = LAYOUT.topRow + LAYOUT.rowGap;
  if (layout === "band") return { profile, layout, x0: cLeft, x1: env - rail - 24, y0, y1: H - LAYOUT.bottom - LAYOUT.band - LAYOUT.bandGap, cLeft, colW };
  return { profile, layout, x0: cLeft + colW + LAYOUT.sideGap, x1: env - rail - 24, y0, y1: H - LAYOUT.bottom, cLeft, colW };
}

export type Fit = { k: number; ox: number; oy: number; drawnW: number; drawnH: number; fill: number };
export function fit(box: Box, art: Box, maxFill = 1): Fit {
  const W = art.x1 - art.x0, H = art.y1 - art.y0 - LAYOUT.padTop - LAYOUT.padBottom;
  let k = Math.min(W / (box.x1 - box.x0), H / (box.y1 - box.y0));
  k = Math.min(k, (maxFill * (art.y1 - art.y0)) / (box.y1 - box.y0));
  const ox = art.x0 + (W - k * (box.x1 - box.x0)) / 2 - k * box.x0;
  const oy = art.y0 + LAYOUT.padTop + (H - k * (box.y1 - box.y0)) / 2 - k * box.y0;
  return { k, ox, oy, drawnW: k * (box.x1 - box.x0), drawnH: k * (box.y1 - box.y0), fill: (k * (box.y1 - box.y0)) / (art.y1 - art.y0) };
}
export function flatBox(o: Orientation): Box {
  const w = o === "portrait" ? DOMAIN.height : DOMAIN.width, h = o === "portrait" ? DOMAIN.width : DOMAIN.height;
  return { x0: -w / 2 - LAYOUT.nodeMargin, y0: -h / 2 - LAYOUT.nodeMargin, x1: w / 2 + LAYOUT.nodeMargin, y1: h / 2 + LAYOUT.nodeMargin };
}
export type Camera = { k: number; ox: number; oy: number };
/** Interpolated camera between the flat plan (s=0) and the terrain (s=1); s is already eased. No per-input re-zoom. */
export function blend(a: Camera, b: Camera, s: number): Camera { return { k: a.k + (b.k - a.k) * s, ox: a.ox + (b.ox - a.ox) * s, oy: a.oy + (b.oy - a.oy) * s }; }

/** F2 union camera bounds: the projected functional drawing (every link, the clearance and core rings, the apex) at
 *  s = 1 over all 9,317 supported states × 5 viewpoint extremes (portrait: the 10-unit sub-lattice). Shipped as a
 *  constant (outward-rounded to 0.001 u) and re-derived by home:validate. */
export const TERRAIN_UNION: Record<Orientation, Box> = {
  landscape: { x0: -457.411, y0: -286.374, x1: 455.58, y1: 214.995 },
  portrait: { x0: -334.783, y0: -329.848, x1: 330.323, y1: 378.256 },
};
/** Anchor halo rings reach 39 px past the fitted network (anchor r 15 + 24). They keep ≥ 24 px from the real Rail, whose
 *  width depends on the locale; the art box only narrows when the fitted network would otherwise come that close. */
export const ANCHOR_HALO = 39;
export function clampArtToRail(box: ArtBox, railLeft: number): ArtBox {
  let b = box;
  for (let i = 0; i < 6; i++) {
    const f = fit(flatBox("landscape"), b, LAYOUT.flatFill), t = fit(TERRAIN_UNION.landscape, b, LAYOUT.maxFill);
    const reach = Math.max(f.ox + f.k * (952 - DOMAIN.width / 2), t.ox + t.k * TERRAIN_UNION.landscape.x1) + ANCHOR_HALO;
    const excess = reach - (railLeft - 24);
    if (excess <= 0.5) break;
    b = { ...b, x1: b.x1 - excess };
  }
  return b;
}
export const ring = (c: Constraint, r: number, n = 72): Pt[] => Array.from({ length: n }, (_, i) => ({ x: c.x + r * Math.cos((i / n) * 2 * Math.PI), y: c.y + r * Math.sin((i / n) * 2 * Math.PI) }));
export function functionalPoints(net: Network, c: Constraint): Pt[] {
  const nodes = nodeMap(net);
  return [...net.edges.flatMap((e) => sampleEdge(e, nodes, 10)), ...ring(c, blockRadius()), ...ring(c, RULE.core), { x: c.x, y: c.y }];
}
/** Projected bounds of `pts` (already including any constraint-dependent points) for state c and view v. */
export function boxOf(pts: Pt[], c: Constraint, v: View): Box {
  const b: Box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const p of pts) {
    const q = project(p.x, p.y, height(p.x, p.y, c), v);
    if (q.x < b.x0) b.x0 = q.x;
    if (q.x > b.x1) b.x1 = q.x;
    if (q.y < b.y0) b.y0 = q.y;
    if (q.y > b.y1) b.y1 = q.y;
  }
  return b;
}
export function viewpointExtremes(o: Orientation): View[] {
  return [[0, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]].map(([y, p]) => ({ s: 1, yaw: y * TERRAIN.viewYaw, pitch: p * TERRAIN.viewPitch, orient: o }));
}

// ---------------------------------------------------------------- decision minimap (shipped constant)
/** 16 × 10 accepted-route classes on the 40-unit sub-lattice (d direct · a above · b below), generated by the REV1 proof
 *  (sha256 a5fc88f5…) and regenerated by home:validate. Never computed at runtime. */
export const DECISION_MINIMAP = {
  xFrom: 200, yFrom: 110, step: 40,
  rows: [
    "dddddddddddddddd", "dddddddddddddddd", "dddddddddddddddd", "bbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbb",
    "bbbaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaad", "dddddddddddddddd", "dddddddddddddddd",
  ],
} as const;

// ---------------------------------------------------------------- scroll phases (one visual clock; travel per beat: RESEARCH_PACING)
export const RESEARCH_MOTION = { omega: 20, unknownJump: 0.75, worldsProgress: 0.86 } as const;
/** Navigation code (Rail, chapter capsule, cold hash, history) announces its scrolls just before they happen, so the
 *  Section 06 clock shows the destination instead of replaying the story. Wheel, keys and touch never send it. */
export const PROGRAMMATIC_SCROLL_EVENT = "home:programmatic-scroll";
export type ResearchPhaseName = "emerge" | "control" | "evaluate" | "transform" | "settle";
export const RESEARCH_PHASE_NAMES: readonly ResearchPhaseName[] = ["emerge", "control", "evaluate", "transform", "settle"];
export type ResearchPhase = {
  index: 0 | 1 | 2 | 3 | 4;
  grid: number; tiers: [number, number, number, number]; rings: number;
  /** Default-commit reveal (a user commit is always fully drawn). */
  rejected: number; reveal: number; runnerUp: number; resultShown: boolean;
  s: number; title: number; note: number; viewpoint: boolean; drag: boolean;
};
const ramp = (p: number, a: number, b: number) => smooth((p - a) / (b - a));
export function resolveResearchPhase(progress: number): ResearchPhase {
  const p = Math.min(1, Math.max(0, Number.isNaN(progress) ? 0 : progress));
  return {
    index: p < 0.1 ? 0 : p < 0.32 ? 1 : p < 0.48 ? 2 : p < 0.8 ? 3 : 4,
    grid: ramp(p, 0, 0.06),
    tiers: [ramp(p, 0.02, 0.04), ramp(p, 0.04, 0.06), ramp(p, 0.06, 0.08), ramp(p, 0.08, 0.1)],
    rings: ramp(p, 0.06, 0.12),
    rejected: ramp(p, 0.32, 0.36), reveal: ramp(p, 0.34, 0.46), runnerUp: ramp(p, 0.4, 0.46), resultShown: p >= 0.34,
    s: ramp(p, 0.48, 0.8),
    // Title A out .80–.82, title B in .82–.84: one value 0 → 1 across both halves.
    title: p < 0.82 ? 0.5 * ramp(p, 0.8, 0.82) : 0.5 + 0.5 * ramp(p, 0.82, 0.84),
    note: ramp(p, 0.84, 0.9), viewpoint: p >= 0.84, drag: p < 0.48,
  };
}

// ---------------------------------------------------------------- FIX1 climax: the same world continues past the legacy story
/** HOME-COMPLETION-01D-FIX1 (owner direction 2026-10-14), Stage A motion proof. After the legacy story the same camera
 *  continues: a deeper pitch with a closer camera (tilt), the environment grows to the safe stage (expand), four anchors
 *  rise from real vertices (guides), then a hold. Presentation only: nothing here is a solver input, and the 23 vertices,
 *  46 links, route and constraint stay the REV1 ones. Its scroll distance is set by RESEARCH_PACING. */
export const RESEARCH_CLIMAX = {
  /** Added to the REV1 44° at full tilt (→ 66°), and the camera distance there (REV1: 2400). */
  pitch: (22 * Math.PI) / 180, distance: 1500,
  /** Vertical relief at full tilt. As the camera lowers, the relief eases so the hill keeps about its 44° on-screen height
   *  and its back slopes keep facing the camera: no projected outline folds, and the default route still reads around the
   *  peak. Route parts that do pass behind the hill are drawn see-through by the scene (validated as always behind). */
  relief: 0.65,
  tilt: [0, 0.4], expand: [0.2, 0.62],
  /** FIX2 Stage B, inside the same climax progress: the stems rise (.62–.72), each domain's structure assembles (.66–.74)
   *  and its label resolves (.70–.77), staggered left to right by .025 / .03 (the last label is complete at .86); the settle
   *  note then hands over to the practice statement (.84–.91, one value like the title); .91–1 is the hold. */
  guides: [0.62, 0.72], glyphs: [0.66, 0.74], labels: [0.7, 0.77], stagger: [0.025, 0.03], thesis: [0.84, 0.87, 0.91],
  /** Anchor vertices of the four studio domains (RESEARCH_DOMAINS, same order): the back half's relays and outer diagonals
   *  (mirror pairs P1/P2, O3/O1), off the default route, runner-up, constraint and labels. The near relays P3/P4 were tried
   *  in Stage A: at full tilt their stems cross the accepted route beside S/T and the S/T labels. */
  anchors: ["P1", "O3", "O1", "P2"], anchorHeight: 90,
  /** Ground grid beyond the 1000 × 600 tile (domain units). Heights are clamped to the tile edge, so it joins without a step. */
  field: { far: 1000, near: 250, side: 700, step: 50 },
} as const;
type Four = readonly [number, number, number, number];
/** `glyphs` / `labels`: per domain (RESEARCH_DOMAINS order). `thesis`: the settle note out (0 → .5), the statement in (.5 → 1). */
export type ResearchClimax = { c: number; tilt: number; expand: number; guides: number; glyphs: Four; labels: Four; thesis: number };
export const CLIMAX_REST: ResearchClimax = { c: 0, tilt: 0, expand: 0, guides: 0, glyphs: [0, 0, 0, 0], labels: [0, 0, 0, 0], thesis: 0 };
export function resolveResearchClimax(progress: number): ResearchClimax {
  const c = Math.min(1, Math.max(0, Number.isNaN(progress) ? 0 : progress)), { tilt, expand, guides, glyphs, labels, stagger, thesis } = RESEARCH_CLIMAX;
  const four = (r: readonly [number, number], d: number) => [0, 1, 2, 3].map((i) => ramp(c, r[0] + i * d, r[1] + i * d)) as unknown as Four;
  return {
    c, tilt: ramp(c, tilt[0], tilt[1]), expand: ramp(c, expand[0], expand[1]), guides: ramp(c, guides[0], guides[1]),
    glyphs: four(glyphs, stagger[0]), labels: four(labels, stagger[1]),
    thesis: c < thesis[1] ? 0.5 * ramp(c, thesis[0], thesis[1]) : 0.5 + 0.5 * ramp(c, thesis[1], thesis[2]),
  };
}
/** HOME-COMPLETION-01D-FIX3 pacing. In the owner's film (2560×1270, normal wheel) the 450svh track gave the whole legacy
 *  story 4.4 s and the terrain rise 1.2 s. The track is now 550svh and its travel is authored per beat. The story's states,
 *  ramps and landmarks are unchanged; only the scroll distance each beat takes has moved. Each beat = [svh of travel,
 *  story position reached], with story 0–1 = the legacy phases (p) and 1–2 = the climax (1 + c). Travel is
 *  track − stage = (trackSvh − 100)svh + 84px; the 84 px is spread pro rata. Every knot sits on a beat boundary where all
 *  ramps are at rest, so the piecewise-linear map never changes a ramp's speed mid-way. */
export const RESEARCH_PACING = {
  trackSvh: 550,
  beats: [
    [34, 0.12], // the network emerges: grid, tiers, rings
    [34, 0.32], // the protected zone and its mission (hint window)
    [46, 0.48], // evaluation: blocked marks, the accepted route, the runner-up
    [92, 0.8], // the same geometry rises into the 44° terrain
    [26, 0.9], // Worlds title and settle note
    [16, 1], // 44° hold
    [124, 1.62], // climax: tilt to 66° and the ground grows to the safe stage
    [64, 1.91], // the four studio domains, then the practice statement
    [14, 2], // closing hold
  ],
} as const;
/** Knots [track fraction, story position], from (0, 0) to (1, 2). */
export const RESEARCH_PACE_KNOTS: readonly (readonly [number, number])[] = (() => {
  const total = RESEARCH_PACING.beats.reduce((sum, [svh]) => sum + svh, 0);
  let acc = 0;
  return [[0, 0] as const, ...RESEARCH_PACING.beats.map(([svh, story]) => [(acc += svh) / total, story] as const)];
})();
/** The one track clock (0–1, physical travel) → the legacy story (p) and the climax (c). */
export function paceResearchTrack(track: number): { legacy: number; climax: number } {
  const u = Math.min(1, Math.max(0, Number.isNaN(track) ? 0 : track)), K = RESEARCH_PACE_KNOTS;
  let i = 1;
  while (i < K.length - 1 && u > K[i][0]) i++;
  const [u0, s0] = K[i - 1], [u1, s1] = K[i], s = s0 + ((s1 - s0) * (u - u0)) / (u1 - u0);
  return { legacy: Math.min(1, s), climax: Math.min(1, Math.max(0, s - 1)) };
}
/** Inverse of paceResearchTrack for a story position (0–2): where on the track it happens (anchors, navigation, QA). */
export function researchTrackAt(story: number): number {
  const s = Math.min(2, Math.max(0, story)), K = RESEARCH_PACE_KNOTS;
  let i = 1;
  while (i < K.length - 1 && s > K[i][1]) i++;
  const [u0, s0] = K[i - 1], [u1, s1] = K[i];
  return u0 + ((u1 - u0) * (s - s0)) / (s1 - s0);
}
/** Track fraction where the legacy story ends and the climax begins. */
export const RESEARCH_LEGACY_END = researchTrackAt(1);
/** The climax view at tilt T ∈ [0, 1]; T = 0 is the REV1 terrain view. The pointer's pitch parallax fades out toward the
 *  deepest camera (its yaw stays), so no reachable view tips the hill's back slopes into folded outlines. */
export function climaxView(v: View, T: number): View {
  return { ...v, pitch: v.pitch * (1 - T), tilt: RESEARCH_CLIMAX.pitch * T, distance: TERRAIN.distance + (RESEARCH_CLIMAX.distance - TERRAIN.distance) * T,
    relief: 1 + (RESEARCH_CLIMAX.relief - 1) * T };
}
/** Climax union: the projected functional drawing at full tilt over every supported state on the 10-unit sub-lattice × 5
 *  viewpoint extremes (as F2), outward-rounded to 0.001 u plus a 1-unit margin (the full 5-unit lattice exceeds the
 *  sub-lattice union by < 0.2 u). Shipped as a constant and re-derived by home:validate. */
export const CLIMAX_UNION: Box = { x0: -462.867, y0: -182.827, x1: 457.629, y1: 121.054 };
/** Final climax camera: F2's fit (same pads and max fill) of the climax union, anchor centres inside the art box, their halos
 *  24 px clear of the real Rail and 8 px inside the screen's left edge (the 32 px content margin below 1280 px is narrower
 *  than a halo). The scene blends F2 → this camera on the tilt ramp; home:validate checks that the functional drawing stays
 *  inside the art box for every tilt. */
export function climaxFit(art: Box, railLeft: number): Fit {
  return fit(CLIMAX_UNION, { ...art, x0: Math.max(art.x0, ANCHOR_HALO + 8), x1: Math.min(art.x1, railLeft - 24 - ANCHOR_HALO) }, LAYOUT.maxFill);
}

// ---------------------------------------------------------------- FIX2 Stage B: four studio domains on four real vertices
/** Brenych Studio's disciplines (owner-approved Stage B map), each pinned to one existing vertex. They are an authored map
 *  of the studio's practice, not solver inputs or outputs: a route may bypass any of them and they stay. Only a small
 *  emphasis follows the computed route (`domainsOnRoute`). Order = left to right in the climax camera. */
export type ResearchDomainId = "products" | "research" | "spatial" | "worlds";
export const RESEARCH_DOMAINS: readonly { id: ResearchDomainId; node: string }[] = [
  { id: "products", node: "P1" }, { id: "research", node: "O3" }, { id: "spatial", node: "O1" }, { id: "worlds", node: "P2" },
];
/** The route the stage draws as its primary line: the live preview while previewing, otherwise the committed accepted
 *  route once it is revealed (nothing before). The domain emphasis follows exactly this route. */
export function drawnRoute(preview: boolean, live: Evaluation, committed: Evaluation, revealed: boolean): Route | null {
  return preview ? live.accepted : revealed ? committed.accepted : null;
}
/** Domains whose vertex lies on a route (its node list, nothing else). */
export function domainsOn(route: Route | null): ResearchDomainId[] {
  const on = new Set(route?.nodes ?? []);
  return RESEARCH_DOMAINS.filter((d) => on.has(d.node)).map((d) => d.id);
}

/** Authored structure of each domain, drawn on a small horizontal plate at the top of its stem in the same camera: local
 *  [u, v, w] with u along domain x, v along domain y (depth) and w up (visual height units, i.e. before the climax relief).
 *  Restrained line work only: layered blueprint brackets, a measurement ring with an evaluation lattice, an orbit with
 *  registration ticks, and floating contour lines. */
export type GlyphLine = { pts: readonly (readonly [number, number, number])[]; closed: boolean };
/** `radius` in domain units; on smaller cameras a structure keeps at least `minScreenRadius` px across (scaled about its
 *  vertex, so it stays pinned there). */
export const DOMAIN_GLYPH = { radius: 24, minScreenRadius: 27 } as const;
export const glyphScale = (k: number) => Math.max(1, DOMAIN_GLYPH.minScreenRadius / (DOMAIN_GLYPH.radius * Math.max(1e-6, k)));
export function domainGlyph(id: ResearchDomainId): GlyphLine[] {
  const R = DOMAIN_GLYPH.radius, TAU2 = 2 * Math.PI;
  const loop = (n: number, f: (t: number) => readonly [number, number, number]): GlyphLine => ({ pts: Array.from({ length: n }, (_, i) => f((i / n) * TAU2)), closed: true });
  const seg = (a: readonly [number, number, number], b: readonly [number, number, number]): GlyphLine => ({ pts: [a, b], closed: false });
  if (id === "products") {
    // Three stacked plates (a composable product stack), the top one carrying a smaller inset plate.
    const corners = [[R, 0], [0, R], [-R, 0], [0, -R]] as const;
    return [...[0, 9, 18].map((w) => ({ pts: corners.map(([u, v]) => [u, v, w] as const), closed: true })), { pts: corners.map(([u, v]) => [u * 0.42, v * 0.42, 18] as const), closed: true }];
  }
  if (id === "research") {
    // A measurement ring (24 ticks, every sixth long) around a sparse evaluation lattice (two by two chords).
    const out: GlyphLine[] = [loop(72, (t) => [R * Math.cos(t), R * Math.sin(t), 0])];
    for (let k = 0; k < 24; k++) {
      const t = (k / 24) * TAU2, r2 = R + (k % 6 === 0 ? 7 : 3.5);
      out.push(seg([R * Math.cos(t), R * Math.sin(t), 0], [r2 * Math.cos(t), r2 * Math.sin(t), 0]));
    }
    for (const q of [-0.36, 0.36]) out.push(seg([q * R, -0.66 * R, 0], [q * R, 0.66 * R, 0]), seg([-0.66 * R, q * R, 0], [0.66 * R, q * R, 0]));
    return out;
  }
  if (id === "spatial") {
    // A horizontal orbit and an upright one facing the camera (presence in depth), with four registration ticks.
    const out: GlyphLine[] = [loop(72, (t) => [R * Math.cos(t), R * Math.sin(t), 0]), loop(60, (t) => [0.72 * R * Math.cos(t), 0, 0.72 * R * Math.sin(t)])];
    for (let k = 0; k < 4; k++) {
      const t = (k / 4) * TAU2 + Math.PI / 4;
      out.push(seg([R * Math.cos(t), R * Math.sin(t), 0], [(R + 8) * Math.cos(t), (R + 8) * Math.sin(t), 0]));
    }
    out.push(seg([0, 0, 0.72 * R], [0, 0, 0.72 * R + 6]));
    return out;
  }
  // worlds: three floating contours of an authored landform (a fixed, deterministic outline) and its summit mark.
  const contour = (r0: number, w: number) => loop(60, (t) => {
    const r = r0 * (1 + 0.13 * Math.sin(3 * t + 0.7) + 0.06 * Math.sin(5 * t + 2.1));
    return [r * Math.cos(t), r * Math.sin(t), w];
  });
  return [contour(R, 0), contour(0.64 * R, 7), contour(0.3 * R, 14), seg([0, 0, 14], [0, 0, 21])];
}

/** Label row(s) for the four domains, in stage px. Per domain: the stem axis x and the node centre / nominal stem top y of
 *  its vertex, the structure's extent above its plate centre (`ext`) and the measured label size. Labels are horizontal and
 *  centred over their stems where possible.
 *  - `tiers` 1: one row `gap.y` above the highest structure. 2 (a crown): the outer pair on the lower tier, the inner pair
 *    one label height (+ `gap.y`) above it; returns null if an inner leader would pass through an outer label.
 *  - The rows never rise above `top` (title row plus margin). When they cannot rise further, stems shorten (`stem`, the
 *    fraction of the nominal height, at least STEM_MIN) so every structure stays under the lowest row.
 *  - Horizontally, per row, a least-squares shift (pool-adjacent violators) keeps `gap.x` between labels and every label
 *    inside [x0, x1]; null when a row's labels cannot fit side by side (the caller recomposes statically).
 *  Pure: the same geometry always gives the same placement, whatever the route. */
export const DOMAIN_LABEL_GAP = { x: 24, y: 10 } as const;
export const STEM_MIN = 0.15;
/** `gw`: the structure's half width around its stem. */
export type DomainLabelInput = { ax: number; baseY: number; topY: number; ext: number; gw: number; w: number; h: number };
/** Screen x intervals of functional marks (vertices, constraint outlines, the drawn route) inside the band [y0, y1]. */
export type DomainBlocked = (y0: number, y1: number) => readonly (readonly [number, number])[];
export type DomainLabelPlacement = { x0: number; y0: number; x1: number; y1: number; attach: number; stem: number };
/** 1D least-squares placement of boxes of `widths` wanting left edges `want` (already in left-to-right order). */
function packRow(want: number[], widths: number[], lo: number, hi: number, gap: number): number[] | null {
  const total = widths.reduce((s, w) => s + w, 0) + gap * (widths.length - 1);
  if (total > hi - lo) return null;
  // With y_j = x0_j − (widths and gaps before j) the order constraint becomes y non-decreasing: isotonic regression (PAVA),
  // then the common bounds.
  const offset: number[] = [];
  let acc = 0;
  for (const w of widths) { offset.push(acc); acc += w + gap; }
  const blocks: { sum: number; count: number }[] = [];
  want.forEach((x, j) => {
    blocks.push({ sum: x - offset[j], count: 1 });
    while (blocks.length > 1 && blocks[blocks.length - 2].sum / blocks[blocks.length - 2].count > blocks[blocks.length - 1].sum / blocks[blocks.length - 1].count) {
      const b = blocks.pop()!; blocks[blocks.length - 1].sum += b.sum; blocks[blocks.length - 1].count += b.count;
    }
  });
  const out: number[] = [];
  for (const b of blocks) for (let k = 0; k < b.count; k++) out.push(Math.min(hi - total, Math.max(lo, b.sum / b.count)) + offset[out.length]);
  return out;
}
/** `packRow` around blocked x intervals: the free segments of [lo, hi] take the labels in order (every monotone assignment
 *  is tried; at most a few dozen), each segment packed by least squares; the assignment with the smallest squared offset
 *  from the stems wins. With nothing blocked this is exactly `packRow`. Null when no assignment fits. */
function packAround(want: number[], widths: number[], lo: number, hi: number, gap: number, blocked: readonly (readonly [number, number])[]): number[] | null {
  const cuts = blocked.map(([a, b]) => [Math.max(lo, a - gap / 2), Math.min(hi, b + gap / 2)] as const).filter(([a, b]) => b > a).sort((p, q) => p[0] - q[0]);
  if (!cuts.length) return packRow(want, widths, lo, hi, gap);
  const free: [number, number][] = [];
  let at = lo;
  for (const [a, b] of cuts) { if (a > at) free.push([at, a]); at = Math.max(at, b); }
  if (hi > at) free.push([at, hi]);
  const n = want.length;
  let best: { cost: number; xs: number[] } | null = null;
  const assign = (j: number, seg: number, picks: number[]) => {
    if (j === n) {
      const xs: number[] = new Array(n);
      for (let s = 0; s < free.length; s++) {
        const idx = picks.map((p, k) => (p === s ? k : -1)).filter((k) => k >= 0);
        if (!idx.length) continue;
        const part = packRow(idx.map((k) => want[k]), idx.map((k) => widths[k]), free[s][0], free[s][1], gap);
        if (!part) return;
        idx.forEach((k, m) => { xs[k] = part[m]; });
      }
      const cost = xs.reduce((sum, x, k) => sum + (x - want[k]) ** 2, 0);
      if (!best || cost < best.cost - 1e-9) best = { cost, xs };
      return;
    }
    for (let s = seg; s < free.length; s++) assign(j + 1, s, [...picks, s]);
  };
  assign(0, 0, []);
  return (best as { cost: number; xs: number[] } | null)?.xs ?? null;
}
export function placeDomainLabels(items: readonly DomainLabelInput[], bounds: { x0: number; x1: number; top: number }, tiers: 1 | 2 = 1, blocked?: DomainBlocked,
  gap: { x: number; y: number } = DOMAIN_LABEL_GAP): DomainLabelPlacement[] | null {
  const n = items.length;
  if (!n) return [];
  const H = Math.max(...items.map((d) => d.h)), order = items.map((_, i) => i).sort((a, b) => items[a].ax - items[b].ax);
  const two = tiers === 2 && n === 4, upper = new Set(two ? [order[1], order[2]] : []);
  const lowBottom = Math.max(Math.min(...items.map((d) => d.topY - d.ext)) - gap.y, bounds.top + H + (two ? H + gap.y : 0));
  const stem = items.map((d) => {
    const span = d.baseY - d.topY;
    return span > 1e-6 ? Math.min(1, Math.max(STEM_MIN, (d.baseY - d.ext - gap.y - lowBottom) / span)) : STEM_MIN;
  });
  // What stands in the label band: functional marks (from the caller) first, then structures squeezed onto a raised vertex.
  // If no arrangement clears both, the functional marks keep priority.
  const band = [lowBottom - H - (two ? H + gap.y : 0) - 4, lowBottom + gap.y] as const;
  const marks: (readonly [number, number])[] = blocked ? [...blocked(band[0], band[1])] : [], squeezed: (readonly [number, number])[] = [];
  items.forEach((d, i) => { if (d.baseY - stem[i] * (d.baseY - d.topY) - d.ext < band[1] - 0.5) squeezed.push([d.ax - d.gw - 6, d.ax + d.gw + 6]); });
  const out: DomainLabelPlacement[] = new Array(n), leaders: (readonly [number, number])[] = [];
  // The crown places its inner pair first; their leaders cross the lower tier's band, so the outer pair steps around them
  // too (a crown never falls back to one row).
  for (const row of two ? [order.filter((i) => upper.has(i)), order.filter((i) => !upper.has(i))] : [order]) {
    const top = row.some((i) => upper.has(i)), bottom = top ? lowBottom - H - gap.y : lowBottom, own = top ? marks : [...marks, ...leaders];
    const want = row.map((i) => items[i].ax - items[i].w / 2), widths = row.map((i) => items[i].w);
    const xs = packAround(want, widths, bounds.x0, bounds.x1, gap.x, [...own, ...squeezed]) ?? packAround(want, widths, bounds.x0, bounds.x1, gap.x, own)
      ?? packAround(want, widths, bounds.x0, bounds.x1, gap.x / 2, own) ?? packRow(want, widths, bounds.x0, bounds.x1, gap.x);
    if (!xs) return null;
    row.forEach((i, j) => {
      const d = items[i], x0 = xs[j], inset = Math.min(12, d.w / 2);
      out[i] = { x0, y0: bottom - H, x1: x0 + d.w, y1: bottom - H + d.h, attach: Math.min(x0 + d.w - inset, Math.max(x0 + inset, d.ax)), stem: stem[i] };
      if (top) leaders.push([Math.min(d.ax, out[i].attach) - 8, Math.max(d.ax, out[i].attach) + 8]);
    });
  }
  return out;
}
/** Largest horizontal offset of a label centre from its stem (how far the row had to push labels apart). */
export const labelDisplacement = (items: readonly DomainLabelInput[], placed: readonly DomainLabelPlacement[]) =>
  Math.max(0, ...placed.map((p, i) => Math.abs((p.x0 + p.x1) / 2 - items[i].ax)));
/** Tier rule, decided once per layout by the stage: one row unless it pushes a label more than `push` px off its stem and
 *  the crown keeps every stem at least `stem` of its nominal height. */
export const DOMAIN_TIERS = { push: 20, stem: 0.5 } as const;
export function chooseDomainTiers(items: readonly DomainLabelInput[], bounds: { x0: number; x1: number; top: number }): 1 | 2 {
  const one = placeDomainLabels(items, bounds, 1);
  if (one && labelDisplacement(items, one) <= DOMAIN_TIERS.push) return 1;
  const two = placeDomainLabels(items, bounds, 2);
  return two && two.every((p) => p.stem >= DOMAIN_TIERS.stem) ? 2 : 1;
}

/** A domain structure is fully drawn only while it keeps clear of the functional drawing and the text: the signed clearance
 *  of its screen box to the nearest vertex disc (other than its own vertex, which it stands on), constraint handle, core /
 *  clearance outline, drawn route (but its links meeting that vertex), label or the title row (`ceiling`). A label's gap counts 12 px
 *  more than measured, since the row sits by design only 10 px above the structures. Over the last 20 px the structure fades
 *  out (≥ 22 px: drawn; ≤ 2 px: only its stem and leader remain), so a vertex lifted into crowded space keeps its label and
 *  leader but never paints its structure over the computation (the contract's "reduce ornamental lines first"). */
export const STRUCTURE_FADE = { min: 2, span: 20, label: 12 } as const;
export const structureVisibility = (clear: number) => smooth((clear - STRUCTURE_FADE.min) / STRUCTURE_FADE.span);
export type StructureMarks = { points: readonly ArrayLike<number>[]; discs: readonly (readonly [number, number, number])[]; labels: readonly Box[]; ceiling: number };
/** Signed gap from box `b` to a point (or, with `o`, to a box): positive outside, minus the overlap depth inside. */
function signedGap(b: Box, x0: number, y0: number, x1 = x0, y1 = y0): number {
  const ox = Math.max(b.x0 - x1, x0 - b.x1), oy = Math.max(b.y0 - y1, y0 - b.y1);
  return ox > 0 || oy > 0 ? Math.hypot(Math.max(ox, 0), Math.max(oy, 0)) : Math.max(ox, oy);
}
export function structureClearance(b: Box, marks: StructureMarks): number {
  let d = b.y0 - marks.ceiling;
  for (const xs of marks.points) for (let i = 0; i < xs.length; i += 2) d = Math.min(d, signedGap(b, xs[i], xs[i + 1]));
  for (const [x, y, r] of marks.discs) d = Math.min(d, signedGap(b, x, y) - r);
  for (const o of marks.labels) d = Math.min(d, signedGap(b, o.x0, o.y0, o.x1, o.y1) + STRUCTURE_FADE.label);
  return d;
}

/** Even-odd point-in-polygon test on a packed [x, y, …] outline. */
export function insidePolygon(x: number, y: number, poly: ArrayLike<number>): boolean {
  let c = false;
  for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) {
    const ax = poly[i], ay = poly[i + 1], bx = poly[j], by = poly[j + 1];
    if ((ay > y) !== (by > y) && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) c = !c;
  }
  return c;
}

/** BFS depth tier (0–3) of every link from the origin: links draw in from S in four tiers during Emerge. */
export function edgeTiers(net: Network): Map<string, { tier: number; from: string }> {
  const depth = new Map<string, number>([[net.source, 0]]);
  const queue = [net.source];
  while (queue.length) {
    const u = queue.shift()!;
    for (const e of net.edges) {
      const v = e.a === u ? e.b : e.b === u ? e.a : null;
      if (v && !depth.has(v)) { depth.set(v, depth.get(u)! + 1); queue.push(v); }
    }
  }
  return new Map(net.edges.map((e) => {
    const da = depth.get(e.a)!, db = depth.get(e.b)!;
    return [e.id, { tier: Math.min(3, Math.min(da, db)), from: da <= db ? e.a : e.b }] as const;
  }));
}

// ---------------------------------------------------------------- controls, pointer and readout helpers
export const sliderPercent = (axis: "along" | "across", value: number) =>
  Math.round(axis === "along" ? ((value - CONSTRAINT.xMin) / (CONSTRAINT.xMax - CONSTRAINT.xMin)) * 100 : ((value - CONSTRAINT.yMin) / (CONSTRAINT.yMax - CONSTRAINT.yMin)) * 100);
/** Side of the route axis (y = 300, "across" 50%) for value text. */
export const acrossSide = (cy: number): "above" | "on" | "below" => (cy < RING.qy ? "above" : cy > RING.qy ? "below" : "on");
/** Screen-side word for a domain side: portrait is a transpose, so domain "above" shows on the left. */
export const sideWord = (side: "above" | "below", orient: Orientation) => (orient === "portrait" ? (side === "above" ? "left" : "right") : side);
/** Inverse of the flat fit (s = 0): stage px → quantized constraint. */
export function constraintFromFlat(x: number, y: number, cam: Camera, orient: Orientation): Constraint {
  let dx = (x - cam.ox) / cam.k, dy = (y - cam.oy) / cam.k;
  if (orient === "portrait") [dx, dy] = [dy, dx];
  return quantize({ x: dx + DOMAIN.width / 2, y: dy + DOMAIN.height / 2 });
}
/** Readout precision: integers; one decimal when |a − b| < 1; more only while the shown values would still be equal. */
export function readoutDecimals(a: number, b: number): number {
  if (Math.abs(a - b) >= 1) return 0;
  for (let d = 1; d < 4; d++) if (Math.round(a * 10 ** d) !== Math.round(b * 10 ** d)) return d;
  return 4;
}
/** Exact symmetric tie between the two sides (only (500, 300) on the supported lattice). */
export const isTie = (ev: Evaluation) => Boolean(ev.bestAbove && ev.bestBelow && Math.abs(ev.bestAbove.cost - ev.bestBelow.cost) < 1e-6);
