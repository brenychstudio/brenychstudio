export const territoryStops = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const pressures = [0, 42, -34, 24, -50, 8];
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

// Alternating authored extrema: zero tangents avoid overshoot. Quintic segments
// also match acceleration at the knots and at both constant end regions.
export function smoothStep(value: number) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function smoothPressure(progress: number) {
  const position = clamp01((progress - 0.4) / 0.5) * 5;
  const index = Math.min(4, Math.floor(position));
  return pressures[index] + (pressures[index + 1] - pressures[index]) * smoothStep(position - index);
}

export function copyPhase(progress: number, index: number) {
  const halfWidth = 0.018;
  const enter = index === 0 ? 1 : smoothStep((progress - (territoryStops[index] - 0.05 - halfWidth)) / (halfWidth * 2));
  const exit = index === 5 ? 0 : smoothStep((progress - (territoryStops[index] + 0.05 - halfWidth)) / (halfWidth * 2));
  return { opacity: enter * (1 - exit), y: 6 * (1 - enter - exit) };
}

// Reserve the taller copy before the overlap, release it after. The single CTA
// therefore never slides over an entering second line or its description.
export function copyStackHeight(progress: number, heights: readonly number[]) {
  if (heights.length !== 6) return 0;
  const position = clamp01((progress - 0.4) / 0.5) * 5;
  const index = Math.min(4, Math.floor(position)), t = position - index;
  const from = heights[index], to = heights[index + 1];
  const change = smoothStep((t - (to >= from ? 0.18 : 0.68)) / 0.14);
  return from + (to - from) * change;
}

export function signalPathFromPressure(lane: number, pressure: number, compact: boolean) {
  const d = lane - 6;
  if (compact) return `M${-100 + d * 9} -60 C${80 + d * 8} ${40 + pressure} ${180 + d * 3} ${168 + d * 5} 300 ${168 + d * 4} C${450 + d * 4} ${168 + d * 4} ${540 + d * 10} ${320 + pressure} ${490 + d * 7} 420 S${210 + d * 10} 600 ${420 + d * 7} 760`;
  return `M-140 ${56 + d * 17} C${80 + d * 10} ${30 + pressure + d * 14} ${85 + d * 8} ${316 + d * 5} 324 ${316 + d * 4} C${520 + d * 8} ${316 + d * 4} ${438 + d * 8} ${568 + pressure + d * 10} 730 ${548 + pressure + d * 9} S1100 ${384 + pressure + d * 13} 1360 ${460 + d * 20}`;
}

type Point = readonly [number, number];
function cubicLength(a: Point, b: Point, c: Point, d: Point) {
  let length = 0;
  let previous = a;
  for (let i = 1; i <= 20; i++) {
    const t = i / 20, u = 1 - t;
    const next: Point = [u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0], u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]];
    length += Math.hypot(next[0] - previous[0], next[1] - previous[1]);
    previous = next;
  }
  return length;
}

// The primary thread shares the field's first two curves. Its final curve turns
// downward and continues in the SAME path. The join's control vectors match.
export function signalThread(progress: number, endY: number) {
  const pressure = smoothPressure(progress);
  const a: Point = [-140, 56], b: Point = [80, 30 + pressure], c: Point = [85, 316], d: Point = [324, 316];
  const e: Point = [520, 316], f: Point = [438, 568 + pressure], g: Point = [730, 548 + pressure];
  const h: Point = [1022, 528 + pressure], i: Point = [1140, 440 + pressure], j: Point = [1130, 650];
  const k: Point = [1120, 860 - pressure], l: Point = [780, endY - 180], m: Point = [760, endY];
  const head = cubicLength(a, b, c, d) + cubicLength(d, e, f, g) + cubicLength(g, h, i, j);
  const fraction = head / (head + cubicLength(j, k, l, m));
  const firstDraw = fraction * (0.03 + 0.91 * Math.min(progress, 0.9) / 0.9);
  const t = clamp01((progress - 0.9) / 0.38);
  const start = fraction * 0.94;
  // Cubic Hermite continues the incoming draw velocity, then settles at the end.
  const drawing = progress <= 0.9 ? firstDraw : (2 * t ** 3 - 3 * t * t + 1) * start + (t ** 3 - 2 * t * t + t) * fraction * (0.91 / 0.9) * 0.38 + (-2 * t ** 3 + 3 * t * t);
  return {
    path: `M${a} C${b} ${c} ${d} C${e} ${f} ${g} C${h} ${i} ${j} C${k} ${l} ${m}`,
    drawing,
    headFraction: fraction,
  };
}
