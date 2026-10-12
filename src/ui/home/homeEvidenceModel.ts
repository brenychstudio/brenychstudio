export type EvidenceMode = "cinematic" | "reader";
type EvidenceIndex = 0 | 1 | 2;
export type EvidencePlaneState = {
  x: number; y: number; scale: number; opacity: number;
  depth: number; rotateY: number; zOrder: number;
};
export type EvidenceIdentityState = { opacity: number; y: number; reveal: number };
export type EvidenceSceneState = {
  activeIndex: EvidenceIndex;
  incomingIndex: EvidenceIndex | null;
  outgoingIndex: EvidenceIndex | null;
  archiveOpacity: number;
  transfer: number;
  planes: readonly EvidencePlaneState[];
  identities: readonly EvidenceIdentityState[];
};
export const EVIDENCE_HOLD_PROGRESS = [.16, .51, .85] as const;
const HANDOFFS = [[.21, .45], [.57, .81]] as const;
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const phase = (p: number, start: number, end: number) => clamp((p - start) / (end - start));
const handoffPhase = (p: number, index: number) => phase(p, HANDOFFS[index][0], HANDOFFS[index][1]);
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoother = (t: number) => t * t * t * (t * (6 * t - 15) + 10);

/** One native-scroll clock; the same targets are traversed in either direction. */
export function resolveEvidenceScene(progress: number): EvidenceSceneState {
  const p = clamp(Number.isNaN(progress) ? 0 : progress);
  const activeIndex: EvidenceIndex = p < .33 ? 0 : p < .69 ? 1 : 2;
  let incomingIndex: EvidenceIndex | null = null;
  let outgoingIndex: EvidenceIndex | null = null;
  HANDOFFS.forEach(([start, end], i) => {
    if (p > start && p < end) { outgoingIndex = i as EvidenceIndex; incomingIndex = (i + 1) as EvidenceIndex; }
  });
  const planes = [0, 1, 2].map(i => {
    const enter = i === 0 ? 1 : handoffPhase(p, i - 1);
    const leave = i < 2 ? handoffPhase(p, i) : 0;
    const arrival = smoother(enter), departure = smoother(leave);
    const settle = i === 0 ? smooth(phase(p, 0, .07)) : 1;
    // Complementary apertures separate the painted pixels at the depth transfer,
    // so this foreground change cannot pop an opaque overlapping surface.
    const opacity = (i === 0 ? 1 : smoother(phase(enter, 0, .25))) * (1 - smoother(phase(leave, .60, 1)));
    return {
      x: .22 * (1 - arrival) - .18 * departure,
      y: 18 * (1 - arrival) + 10 * (1 - settle) - 10 * departure,
      scale: (.86 + .14 * arrival) * (.94 + .06 * settle) * (1 - .32 * departure),
      opacity, depth: -160 * (1 - arrival) - 220 * departure,
      rotateY: 1 - arrival - departure,
      zOrder: enter <= .40 && i > 0 ? 0 : i + 1,
    };
  });
  const identities = [0, 1, 2].map(i => {
    const enter = i === 0 ? 1 : handoffPhase(p, i - 1);
    const leave = i < 2 ? handoffPhase(p, i) : 0;
    return {
      opacity: smoother(phase(enter, 0, .10)) * (1 - smoother(phase(leave, .60, 1))),
      y: 24 * (1 - smoother(enter)) - 18 * smoother(leave),
      reveal: smoother(phase(enter, .10, .50)),
    };
  });
  const transfer = outgoingIndex === null ? 0 : smoother(handoffPhase(p, outgoingIndex));
  return {transfer, activeIndex, incomingIndex, outgoingIndex, planes, identities, archiveOpacity: smooth(phase(p, .94, 1))};
}
