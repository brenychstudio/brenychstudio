export const territoryStops = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
export type ManualSignalEvent = { phase: "capture" | "mix" | "release"; mix?: number };
// Explicit navigation shares its bounded mix with the Home-owned thread.
// Ordinary document scrolling never waits for this channel or a scene spring.
export function homeSignalManual(detail: ManualSignalEvent) {
  window.dispatchEvent(new CustomEvent("home-signal-manual", { detail }));
}
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function smoothStep(value: number) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Local carriers breathe gently across the scene, independently of territory stops.
export function smoothPressure(progress: number) {
  return 3 * Math.sin(progress * Math.PI * 1.2);
}

export function copyPhase(progress: number, index: number) {
  const halfWidth = 0.028;
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
  const change = smoothStep((t - (to >= from ? 0.06 : 0.80)) / 0.14);
  return from + (to - from) * change;
}

export function signalPathFromPressure(lane: number, pressure: number, compact: boolean) {
  const d = lane - 6;
  if (compact) return `M${-100 + d * 9} -60 C${80 + d * 8} ${40 + pressure} ${180 + d * 3} ${168 + d * 5} 300 ${168 + d * 4} C${450 + d * 4} ${168 + d * 4} ${540 + d * 10} ${320 + pressure} ${490 + d * 7} 420 S${210 + d * 10} 600 ${420 + d * 7} 760`;
  return `M-140 ${56 + d * 17} C${80 + d * 10} ${30 + pressure + d * 14} ${85 + d * 8} ${316 + d * 5} 324 ${316 + d * 4} C${520 + d * 8} ${316 + d * 4} ${438 + d * 8} ${568 + pressure + d * 10} 730 ${548 + pressure + d * 9} S1100 ${384 + pressure + d * 13} 1360 ${460 + d * 20}`;
}

// Manual takes use only the captured source blend and selected destination.
// Reserve space before the incoming copy becomes dominant, then release it late.
export function manualCopyHeight(heights: readonly number[], from: readonly number[], target: number, mix: number) {
  if (heights.length !== 6) return 0;
  const source = Math.max(...heights.map((height, i) => from[i] > 0.01 ? height : 0));
  const destination = heights[target];
  const phase = destination >= source ? smoothStep(mix / 0.22) : smoothStep((mix - 0.78) / 0.22);
  return source + (destination - source) * phase;
}
