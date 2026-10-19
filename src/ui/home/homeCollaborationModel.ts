// Section 07 Final Exposure / Spatial Horizon (HOME-COMPLETION-01E-FIX1): pure, deterministic model. No DOM, no dependencies.
//
// The closing is one warm-paper landscape: a horizon rule across the whole safe field, with a shallow perspective floor that
// fans from a vanishing point at its centre, where the silhouette of Section 06's default hill sits as a low crest. Everything
// is a function of the section's top edge in the viewport (`sectionTop`, unpinned, native scroll) and of the measured layout:
//
//   arrive   the horizon enters with the section just under the first title line, crest and floor at full pitch
//   resolve  it rises with the section to the screen line `target`, crest and floor flattening on the way (pitch 1 → 0)
//   hold     from `target` it stays on that line while the section scrolls under it: the horizon travels down the
//            section from h0 to its slot hf (h = clamp(target − sectionTop, h0, hf): the component realises it with a
//            sticky decorative layer, so the browser holds the line on the compositor; no scroll lock, the section scrolls) …
//   emerge   … line 1 appears above it, then line 2 rises out of it as the horizon passes below it (two moves)
//   settle   the body and actions settle in as they arrive; at `landing` (sectionTop = target − hf ≥ the header line) every
//            value is final, so the hash target and everything after it are static
//
// Ramps use S(t) = 3t² − 2t³. scripts/validate-ecosystem-home.mts re-derives the crest silhouette from homeResearchModel and
// checks the plan below.

export const CLOSING_MOTION = {
  /** Header reservation (01A common coordinates). */
  header: 84,
  /** The horizon's hold line sits this share of the viewport below its final screen position, so the closing settles before
   *  the section reaches the header line; it never goes below `maxTarget` of the viewport. */
  lead: 0.08, maxTarget: 0.86,
  /** Title emergence, in title-font units: the horizon arrives `margin` below line 1's glyph box; line 1 appears over
   *  `lead1` × the travel until line 2 starts (at least `ramp`); each later line starts once the horizon is `margin` below
   *  its glyph box and appears over `ramp` of travel, shortened if needed so it is complete when the horizon lands; a line
   *  rises `shift` as it appears (margin ≥ shift: no visible glyph meets the horizon). */
  emerge: { margin: 0.1, shift: 0.08, ramp: 0.3, lead1: 0.45 },
  /** Body/actions settle from this offset (px) and opacity to rest while they arrive; they stay interactive throughout. */
  row: { shift: 28, opacity: 0.25 },
} as const;

/** The crest on the horizon, derived from Section 06's default terrain (not drawn freehand):
 *  - the default zone's hill as seen in 06's final camera (climaxView at full tilt): per screen column, how far the terrain
 *    rises above its flat footprint, over the hill disc;
 *  - fitted by least squares with three contiguous straight segments, flank / crest / flank, symmetric about the peak and
 *    each at least a fifth of the span. The fit gives shares .4 / .2 / .4 and screen angles +18.6° / 0° / −18.6°;
 *  - the angles are scaled so the steepest is 8° (the 01A horizon angle).
 *  It spans `crestShare` of the horizon, centred on the vanishing point; angles in degrees, positive = rising to the right. */
export const CLOSING_HORIZON = { crestShare: 0.3, vanishing: 0.5, shares: [0.4, 0.2, 0.4], startAnglesDeg: [8, 0, -8] } as const;

/** The floor: `rays` lines per side from the vanishing point to the near edge (spread × half the width at the near edge, cut
 *  at the field's ends) and transversals at the ground depths below (screen offset = band / depth). While pitched, the band
 *  is `capRatio` × the resting band (at least `capVh` of the viewport); it rests at the slot's height. */
export const CLOSING_FLOOR = { rays: 6, spread: 1.25, depths: [1.6, 2.5, 3.9, 6.1, 9.5], capRatio: 1.7, capVh: 0.2 } as const;

const clamp01 = (t: number) => Math.min(1, Math.max(0, Number.isNaN(t) ? 0 : t));
const smooth = (t: number) => { const u = clamp01(t); return u * u * (3 - 2 * u); };

/** Measured layout, section-local px (untransformed). */
export type ClosingLayout = {
  viewportHeight: number;
  labelBottom: number;
  /** Glyph-box bottoms of the authored title lines, top to bottom. */
  lines: { bottom: number }[];
  /** Title font size, px. */
  font: number;
  /** The horizon slot: its top is the horizon's resting line, its height the resting floor band. */
  horizon: number; band: number;
  rowTop: number;
};

export type ClosingPlan = {
  viewportHeight: number; h0: number; hf: number; target: number; landing: number;
  band: number; bandCap: number;
  /** Horizon positions where each line starts to emerge, and over how much travel. */
  emergeAt: number[]; emergeRamp: number[]; shift: number;
  /** Section tops between which the row settles (start > end), or null when it arrives already at rest. */
  row: [number, number] | null;
};

export type ClosingState = {
  /** Horizon line, section-local px. */
  h: number;
  /** Crest and floor pitch, 1 (arriving) … 0 (flat). */
  pitch: number;
  /** Visible floor depth below the horizon, px. */
  band: number;
  /** Per title line: emergence 0 … 1. */
  lines: number[];
  /** Body/actions settle 0 … 1. */
  row: number;
};

/** The quiet final state (reduced motion, compact screens, and every sectionTop ≤ landing). */
export const closingFinal = (L: ClosingLayout): ClosingState => ({ h: L.horizon, pitch: 0, band: L.band, lines: L.lines.map(() => 1), row: 1 });

/** The plan for a layout, or null when the choreography does not fit the viewport (then the final state is rendered). */
export function closingPlan(L: ClosingLayout): ClosingPlan | null {
  const m = CLOSING_MOTION, vh = L.viewportHeight, hf = L.horizon;
  if (!(vh > 0) || L.lines.length === 0) return null;
  const ramp = Math.max(1, m.emerge.ramp * L.font), h0 = Math.max(L.labelBottom + 8, L.lines[0].bottom + m.emerge.margin * L.font);
  const target = Math.min(m.maxTarget * vh, m.header + hf + m.lead * vh);
  if (h0 + ramp > hf || target < m.header + hf) return null;
  const landing = target - hf;
  // every later line starts `margin` under its glyph box and is complete when the horizon reaches its slot at the latest
  const later = L.lines.slice(1).map((line) => Math.min(line.bottom + m.emerge.margin * L.font, hf - 1));
  const laterRamp = later.map((at) => Math.max(1, Math.min(ramp, hf - at)));
  const first = Math.min(hf - h0, Math.max(ramp, m.emerge.lead1 * ((later[0] ?? hf) - h0)));
  const rowStart = vh - L.rowTop;
  return {
    viewportHeight: vh, h0, hf, target, landing, band: L.band, bandCap: Math.max(L.band * CLOSING_FLOOR.capRatio, CLOSING_FLOOR.capVh * vh),
    emergeAt: [h0, ...later], emergeRamp: [first, ...laterRamp], shift: m.emerge.shift * L.font,
    row: rowStart > landing ? [rowStart, landing] : null,
  };
}

export function closingState(P: ClosingPlan, sectionTop: number): ClosingState {
  const h = Math.min(P.hf, Math.max(P.h0, P.target - sectionTop));
  // pitch follows the horizon's rise on screen: 1 at the viewport bottom (and below it), 0 on the hold line
  const pitch = 1 - smooth((P.viewportHeight - sectionTop - P.h0) / (P.viewportHeight - P.target));
  const band = Math.min(P.band + (P.bandCap - P.band) * pitch, P.band + (P.hf - h));   // never below the slot's bottom
  return {
    h, pitch, band,
    lines: P.emergeAt.map((at, i) => smooth((h - at) / P.emergeRamp[i])),
    row: P.row ? smooth((P.row[0] - sectionTop) / (P.row[0] - P.row[1])) : 1,
  };
}

/** Horizon rule across `width` with the crest at `tilt` (1 = 06's silhouette, 0 = one flat rule), on the line y = `base`. */
export function horizonPoints(width: number, base: number, tilt: number): [number, number][] {
  const { crestShare, vanishing, shares, startAnglesDeg } = CLOSING_HORIZON, k = clamp01(tilt), span = crestShare * width;
  let x = vanishing * width - span / 2, y = base;
  const pts: [number, number][] = [[0, base], [x, base]];
  shares.forEach((share, i) => {
    const dx = share * span, a = (startAnglesDeg[i] * k * Math.PI) / 180;
    x += dx; y -= Math.tan(a) * dx;
    pts.push([x, y]);
  });
  pts.push([width, base]);
  return pts;
}

/** Height the crest needs above the rule at a given width (at tilt 1). */
export const crestRise = (width: number) => Math.ceil(Math.max(...horizonPoints(width, 0, 1).map(([, y]) => -y)));

/** Floor segments below the rule y = `base`, `band` px deep, inside x ∈ [0, width]. */
export function floorSegments(width: number, base: number, band: number): [number, number, number, number][] {
  const { rays, spread, depths } = CLOSING_FLOOR, vx = CLOSING_HORIZON.vanishing * width, reach = spread * width / 2;
  const segs: [number, number, number, number][] = [];
  if (!(band > 0.5)) return segs;
  for (let i = -rays; i <= rays; i += 1) {
    const dx = (i / rays) * reach;
    let t = 1;
    if (vx + dx > width) t = (width - vx) / dx; else if (vx + dx < 0) t = -vx / dx;
    segs.push([vx, base, vx + dx * t, base + band * t]);
  }
  for (const z of depths) {
    const y = base + band / z, half = reach / z;
    segs.push([Math.max(0, vx - half), y, Math.min(width, vx + half), y]);
  }
  return segs;
}

/** SVG path text with one decimal (identical states write identical attributes). */
const n = (v: number) => v.toFixed(1);
export const polylinePath = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${n(x)},${n(y)}`).join("");
export const segmentsPath = (segs: [number, number, number, number][]) => segs.map(([x0, y0, x1, y1]) => `M${n(x0)},${n(y0)}L${n(x1)},${n(y1)}`).join("");
