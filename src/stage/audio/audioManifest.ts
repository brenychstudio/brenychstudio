import type { AmbientConfig, SoundEvent, SoundEventRole, SoundScene } from "./audioTypes";
import type { SoundTokens } from "./soundTokens";

export type AudioSceneConfig = {
  mode: "micro-only" | "micro-ambient";
  defaultVolume: number;
  ambient?: AmbientConfig | null;
  tokens: SoundTokens;
};

export type ImmersiveSoundSceneId =
  | "immersive-threshold"
  | "immersive-map"
  | "immersive-proof"
  | "immersive-engines"
  | "immersive-future"
  | "immersive-layer"
  | "immersive-cta";

export type ImmersiveSoundSceneConfig = {
  material: SoundTokens["material"];
  density: SoundTokens["density"];
  volumeScale: number;
  events: Partial<Record<SoundEventRole, SoundEvent>>;
};

export const immersiveAmbientSceneLevels: Record<ImmersiveSoundSceneId, number> = {
  "immersive-threshold": 0.032,
  "immersive-map": 0.04,
  "immersive-proof": 0.052,
  "immersive-engines": 0.034,
  "immersive-future": 0.038,
  "immersive-layer": 0.036,
  "immersive-cta": 0.028,
};

export const audioManifest: Record<SoundScene, AudioSceneConfig> = {
  portfolio: {
    mode: "micro-only",
    defaultVolume: 0.055,
    ambient: null,
    tokens: {
      material: "glass",
      temperature: "neutral",
      density: "sparse",
      motion: "still",
      emotion: "confirmation",
      space: "near",
    },
  },
  immersive: {
    mode: "micro-ambient",
    defaultVolume: 0.082,
    ambient: {
      src: "/audio/immersive/immersive-room.webm",
      fallbackSrc: "/audio/immersive/immersive-room.mp3",
      volume: 0.056,
      fadeIn: 1.8,
      fadeOut: 0.9,
      loop: true,
    },
    tokens: {
      material: "air",
      temperature: "cold",
      density: "sparse",
      motion: "drift",
      emotion: "discovery",
      space: "room",
    },
  },
  evidence: {
    mode: "micro-only",
    defaultVolume: 0.052,
    ambient: null,
    tokens: {
      material: "signal",
      temperature: "neutral",
      density: "sparse",
      motion: "still",
      emotion: "confirmation",
      space: "near",
    },
  },
  practice: {
    mode: "micro-only",
    defaultVolume: 0.05,
    ambient: null,
    tokens: {
      material: "glass",
      temperature: "warm",
      density: "sparse",
      motion: "pulse",
      emotion: "confidence",
      space: "near",
    },
  },
  studio: {
    mode: "micro-only",
    defaultVolume: 0.048,
    ambient: null,
    tokens: {
      material: "glass",
      temperature: "neutral",
      density: "sparse",
      motion: "pulse",
      emotion: "confidence",
      space: "near",
    },
  },
  trust: {
    mode: "micro-only",
    defaultVolume: 0.034,
    ambient: null,
    tokens: {
      material: "signal",
      temperature: "neutral",
      density: "sparse",
      motion: "still",
      emotion: "confirmation",
      space: "near",
    },
  },
};

export const immersiveSoundScenes: Record<ImmersiveSoundSceneId, ImmersiveSoundSceneConfig> = {
  "immersive-threshold": {
    material: "air",
    density: "sparse",
    volumeScale: 1,
    events: {
      hover: "hoverSoft",
      select: "selectPrecise",
      open: "openAir",
      transition: "transitionPulse",
      surface: "surfaceDrift",
      atlasOpen: "atlasOpen",
      success: "successQuiet",
      blocked: "blockedSoft",
    },
  },
  "immersive-map": {
    material: "signal",
    density: "medium",
    volumeScale: 1.08,
    events: {
      hover: "hoverSoft",
      select: "selectPrecise",
      open: "openAir",
      atlasOpen: "atlasOpen",
      close: "closeReverse",
      transition: "transitionPulse",
      surface: "surfaceDrift",
      blocked: "blockedSoft",
    },
  },
  "immersive-proof": {
    material: "forest",
    density: "sparse",
    volumeScale: 0.92,
    events: {
      hover: "hoverSoft",
      select: "transitionPulse",
      open: "openAir",
      close: "closeReverse",
      transition: "transitionPulse",
      surface: "surfaceDrift",
      atlasOpen: "atlasOpen",
    },
  },
  "immersive-engines": {
    material: "glass",
    density: "sparse",
    volumeScale: 0.96,
    events: {
      hover: "hoverSoft",
      select: "selectPrecise",
      transition: "selectPrecise",
      surface: "surfaceDrift",
      blocked: "blockedSoft",
    },
  },
  "immersive-future": {
    material: "tape",
    density: "sparse",
    volumeScale: 0.82,
    events: {
      hover: "hoverSoft",
      select: "transitionPulse",
      open: "openAir",
      transition: "transitionPulse",
      surface: "surfaceDrift",
      atlasOpen: "atlasOpen",
    },
  },
  "immersive-layer": {
    material: "glass",
    density: "sparse",
    volumeScale: 0.9,
    events: {
      hover: "hoverSoft",
      select: "selectPrecise",
      open: "openAir",
      transition: "selectPrecise",
      surface: "surfaceDrift",
    },
  },
  "immersive-cta": {
    material: "signal",
    density: "sparse",
    volumeScale: 1,
    events: {
      hover: "hoverSoft",
      select: "successQuiet",
      open: "openAir",
      surface: "surfaceDrift",
      atlasOpen: "atlasOpen",
      success: "successQuiet",
    },
  },
};

const defaultRoleEvents: Record<SoundEventRole, SoundEvent> = {
  hover: "hoverSoft",
  select: "selectPrecise",
  open: "openAir",
  close: "closeReverse",
  transition: "transitionPulse",
  surface: "surfaceDrift",
  atlasOpen: "atlasOpen",
  success: "successQuiet",
  blocked: "blockedSoft",
};

export function resolveSoundEvent(
  role: SoundEventRole,
  scene: SoundScene,
  sceneId?: string | null,
) {
  if (scene === "immersive" && sceneId && sceneId in immersiveSoundScenes) {
    return immersiveSoundScenes[sceneId as ImmersiveSoundSceneId].events[role] ?? defaultRoleEvents[role];
  }

  return defaultRoleEvents[role];
}

export function resolveSoundVolume(scene: SoundScene, sceneId?: string | null) {
  const baseVolume = audioManifest[scene].defaultVolume;

  if (scene === "immersive" && sceneId && sceneId in immersiveSoundScenes) {
    return baseVolume * immersiveSoundScenes[sceneId as ImmersiveSoundSceneId].volumeScale;
  }

  return baseVolume;
}

export function resolveAmbientVolume(scene: SoundScene, sceneId?: string | null) {
  const ambient = audioManifest[scene].ambient;
  if (!ambient) return 0;

  if (scene === "immersive" && sceneId && sceneId in immersiveAmbientSceneLevels) {
    return immersiveAmbientSceneLevels[sceneId as ImmersiveSoundSceneId];
  }

  return ambient.volume;
}
