export type HomeSpatialLayoutProfile = "full-cinematic" | "compact-cinematic" | "reader";
export type HomeSpatialLayoutInput = {
  viewportWidth: number; viewportHeight: number;
  reducedMotion: boolean; explicitReader: boolean; proofCount: number; contentFits: boolean;
};

/** CSS viewport and accessible content determine mode; proof dimensions never do. */
export function resolveHomeSpatialLayoutProfile(input: HomeSpatialLayoutInput): HomeSpatialLayoutProfile {
  if (input.reducedMotion || input.explicitReader || input.proofCount !== 2 ||
      input.viewportWidth < 1024 || input.viewportHeight < 640 || !input.contentFits) return "reader";
  return input.viewportHeight < 760 ? "compact-cinematic" : "full-cinematic";
}

export type HomeSpatialSceneState = {
  phase: "scan" | "whisper-open" | "whisper-hold" | "webhero-secondary" | "takeover" | "webhero-dominant" | "release";
  activeIndex: 0 | 1;
  scan: number; open: number; secondary: number; takeover: number; complete: number; release: number;
  whisperOpacity: number; whisperShade: number; webheroOpacity: number; scanOpacity: number; scanScale: number;
  whisperCaptionOpacity: number; webheroCaptionOpacity: number; archiveOpacity: number;
  whisperSourceEligible: boolean; whisperPlaybackEligible: boolean;
  webheroSourceEligible: boolean; webheroPlaybackEligible: boolean; webheroRevealEligible: boolean;
};
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const phase = (p: number, a: number, b: number) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };

/** Poster-only WEBHERO preparation (metadata + 4s seek) during the large WHISPER hold. */
export const HOME_SPATIAL_WEBHERO_PREWARM = .30;

/** Authored roles on one reversible clock; geometry is resolved separately in pixels. */
export function resolveHomeSpatialScene(progress: number): HomeSpatialSceneState {
  const p = clamp(Number.isNaN(progress) ? 0 : progress);
  const scan = phase(p, 0, .08), open = phase(p, .08, .28), secondary = phase(p, .42, .56);
  const takeover = phase(p, .56, .72), complete = phase(p, .72, .84), release = phase(p, .96, 1);
  return {
    phase: p < .08 ? "scan" : p < .28 ? "whisper-open" : p < .42 ? "whisper-hold" : p < .56 ? "webhero-secondary" : p < .84 ? "takeover" : p < .96 ? "webhero-dominant" : "release",
    activeIndex: p < .74 ? 0 : 1,
    scan, open, secondary, takeover, complete, release,
    whisperOpacity: p >= .84 ? 0 : 1 - .38 * takeover - .62 * complete,
    whisperShade: .08 * phase(p, .50, .56) + .32 * takeover + .30 * complete,
    webheroOpacity: secondary,
    scanOpacity: 1 - phase(p, .16, .28), scanScale: .08 + .92 * scan,
    whisperCaptionOpacity: phase(p, .16, .28) * (1 - phase(p, .68, .735)),
    webheroCaptionOpacity: phase(p, .745, .80), archiveOpacity: phase(p, .90, .96),
    whisperSourceEligible: p >= .08, whisperPlaybackEligible: p >= .16 && p < .56,
    // Owner ordering: dominance → seek4 → decoded playing frame → reveal. Source preparation may
    // start earlier under the poster; playback and reveal never start before the takeover lands.
    webheroSourceEligible: p >= HOME_SPATIAL_WEBHERO_PREWARM, webheroPlaybackEligible: p >= .84, webheroRevealEligible: p >= .84,
  };
}

export type SpatialRect = { x: number; y: number; width: number; height: number };
/** Viewport units, the environment under the fixed header, and the safe sticky stage (all CSS px). */
export type HomeSpatialBounds = {
  viewportWidth: number; viewportHeight: number;
  envTop: number; envWidth: number; envHeight: number;
  stageLeft: number; stageTop: number; stageWidth: number; stageHeight: number;
};
export type HomeSpatialPlane = { clip: SpatialRect; content: SpatialRect; opacity: number; shade: number; feather: number };
export type HomeSpatialFrame = { whisper: HomeSpatialPlane; webhero: HomeSpatialPlane; scanY: number; fill: number };
export type HomeSpatialMediaKey = "whisper" | "webhero";

const VIDEO_RATIO = 16 / 9;
// The WHISPER clip records its own site bar in the top 3%; its subject spans 40–87% of the height.
const WHISPER_MIN_TOP_CROP = .045, WHISPER_TOP_BIAS = .68;
// WEBHERO records its own site nav in the top 8.9% (copy only scrolls beneath it there); like WHISPER's bar it is
// cropped so the Section 05 top row stays the only navigation row. Its lowest interface copy sits at 94.3% and
// its left 14.9% is empty margin.
const WEBHERO_NAV_CROP = .09, WEBHERO_UI_BOTTOM = .945, WEBHERO_MAX_LEFT_CROP = .13;

/** Media box for a full-environment hold, in environment px (16:9; it may overflow the environment). */
export function resolveHomeSpatialMediaFit(key: HomeSpatialMediaKey, envWidth: number, envHeight: number): SpatialRect {
  if (key === "whisper") {
    const height = Math.max(envWidth / VIDEO_RATIO, envHeight / (1 - WHISPER_MIN_TOP_CROP));
    const top = Math.max(WHISPER_TOP_BIAS * (height - envHeight), WHISPER_MIN_TOP_CROP * height);
    return { x: (envWidth - height * VIDEO_RATIO) / 2, y: -top, width: height * VIDEO_RATIO, height };
  }
  // Bounded cover below the cropped nav: the lowest interface line may reach the environment's bottom edge but never
  // pass it, and horizontal excess comes from the empty left margin. Short-wide environments centre the frame over a
  // matching dark extension.
  const height = Math.min(Math.max(envWidth / VIDEO_RATIO, envHeight / (1 - WEBHERO_NAV_CROP)),
    envHeight / (WEBHERO_UI_BOTTOM - WEBHERO_NAV_CROP), envWidth / VIDEO_RATIO / (1 - WEBHERO_MAX_LEFT_CROP));
  const width = height * VIDEO_RATIO;
  return { x: width > envWidth ? envWidth - width : (envWidth - width) / 2, y: -WEBHERO_NAV_CROP * height, width, height };
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixRect = (a: SpatialRect, b: SpatialRect, t: number): SpatialRect =>
  ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), width: mix(a.width, b.width, t), height: mix(a.height, b.height, t) });
const PERSPECTIVE = 1600;

/** Pure pixel choreography in environment coordinates (origin: left edge, header bottom). */
export function resolveHomeSpatialFrame(scene: HomeSpatialSceneState, bounds: HomeSpatialBounds,
  profile: Exclude<HomeSpatialLayoutProfile, "reader"> = "full-cinematic"): HomeSpatialFrame {
  const vw = bounds.viewportWidth / 100, vh = bounds.viewportHeight / 100;
  const envW = Math.max(1, bounds.envWidth), envH = Math.max(1, bounds.envHeight), cx = envW / 2, cy = envH / 2;
  const env: SpatialRect = { x: 0, y: 0, width: envW, height: envH };

  // WHISPER: the scan line opens an aperture onto the full environment, then the plane recedes left.
  const whisperFit = resolveHomeSpatialMediaFit("whisper", envW, envH);
  const lineW = (18 + 18 * scene.scan) * vw, lineH = 10 * scene.scan * vh + 2 * (1 - scene.scan);
  const recede = 1 - .40 * scene.takeover - .30 * scene.complete;
  const whisperCx = cx - (12.6 * scene.takeover + 10.7 * scene.complete) * vw;
  const whisperW = mix(lineW, envW, scene.open) * recede, whisperH = mix(lineH, envH, scene.open) * recede;
  const whisper: HomeSpatialPlane = {
    clip: { x: whisperCx - whisperW / 2, y: cy - whisperH / 2, width: whisperW, height: whisperH },
    content: { x: whisperCx + (whisperFit.x - cx) * recede, y: cy + (whisperFit.y - cy) * recede, width: whisperFit.width * recede, height: whisperFit.height * recede },
    opacity: scene.whisperOpacity, shade: scene.whisperShade, feather: 0,
  };

  // WEBHERO card: the approved right-anchored secondary that grows and travels left (FIX1/FIX2
  // geometry, perspective folded into scale), then it expands into the full environment.
  const compact = profile === "compact-cinematic";
  const mediaH = bounds.stageHeight - (compact ? 48 : 72);
  const windowCx = bounds.stageLeft + bounds.stageWidth / 2, windowCy = bounds.stageTop - bounds.envTop + (compact ? 40 : 48) + mediaH / 2;
  const t = scene.takeover, s = scene.secondary, anchor = 1 - t;
  const heroW = Math.max(0, Math.min((34 + 24 * t) * vw - Math.max(0, 34 * vw - 620) * anchor, bounds.stageWidth, mediaH * VIDEO_RATIO));
  const heroH = heroW / VIDEO_RATIO;
  const x = (bounds.stageWidth - heroW) / 2 * anchor + (12 * (1 - s) + 10 * t) * vw;
  const y = (-(mediaH - heroH) / 2 + mediaH * .10) * anchor + (9 - 3 * s - 4 * t) * vh;
  const depth = PERSPECTIVE / (PERSPECTIVE + 120 - 80 * t), cardScale = (.88 + .12 * s) * depth;
  const card: SpatialRect = { x: windowCx + x * depth - heroW * cardScale / 2, y: windowCy + y * depth - heroH * cardScale / 2, width: heroW * cardScale, height: heroH * cardScale };
  // The final settle dims the field slightly; the environment never shrinks back into a card.
  const webhero: HomeSpatialPlane = {
    clip: mixRect(card, env, scene.complete),
    content: mixRect(card, resolveHomeSpatialMediaFit("webhero", envW, envH), scene.complete),
    opacity: scene.webheroOpacity, shade: .16 * scene.release, feather: scene.complete,
  };
  const fill = (plane: HomeSpatialPlane) => plane.opacity * phase(Math.min(plane.clip.width / envW, plane.clip.height / envH), .85, 1);
  return { whisper, webhero, scanY: cy, fill: Math.max(fill(whisper), fill(webhero)) };
}

/** One smoothed visual clock following native scroll: critically damped, no overshoot, no reverse drag. */
export const HOME_SPATIAL_MOTION = { omega: 8, maxStepSeconds: .05, settleDistance: 1e-4, settleVelocity: 2e-3 } as const;

/** Cinematic dwell for the same clock: it runs slower through WHISPER's aperture and WEBHERO's arrival/takeover so a wheel
 * burst plays as a camera move, and regains its normal rate when it falls far behind the scroll target. */
export const HOME_SPATIAL_DWELL = {
  windows: [[.05, .31, 2.4], [.45, .87, 3]] as const, edge: .03, catchUp: [.30, .55] as const,
} as const;
export function resolveHomeSpatialMotionRate(value: number, target: number): number {
  const base = HOME_SPATIAL_MOTION.omega, { windows, edge, catchUp } = HOME_SPATIAL_DWELL;
  let rate = base;
  for (const [from, to, omega] of windows) rate += (omega - rate) * phase(value, from - edge, from + edge) * (1 - phase(value, to - edge, to + edge));
  return base + (rate - base) * (1 - phase(Math.abs(target - value), catchUp[0], catchUp[1]));
}
export type HomeSpatialMotionState = { value: number; velocity: number };
export function stepHomeSpatialMotion(state: HomeSpatialMotionState, target: number, dtSeconds: number,
  omega: number = HOME_SPATIAL_MOTION.omega): HomeSpatialMotionState {
  const goal = clamp(Number.isNaN(target) ? 0 : target);
  const dt = Math.min(Math.max(0, dtSeconds), HOME_SPATIAL_MOTION.maxStepSeconds);
  const e0 = state.value - goal;
  // Momentum pointing away from a new target (a reversal) is dropped, never carried on.
  const v0 = state.velocity * e0 > 0 ? 0 : state.velocity;
  const c = v0 + omega * e0, decay = Math.exp(-omega * dt);
  let e1 = (e0 + c * dt) * decay, v1 = (v0 - omega * c * dt) * decay;
  if (e0 !== 0 && Math.sign(e1) === -Math.sign(e0)) { e1 = 0; v1 = 0; }
  if (Math.abs(e1) < HOME_SPATIAL_MOTION.settleDistance && Math.abs(v1) < HOME_SPATIAL_MOTION.settleVelocity) return { value: goal, velocity: 0 };
  return { value: goal + e1, velocity: v1 };
}
