export type SoundMode = "silent" | "micro" | "micro-ambient";

export type AmbientState = "off" | "loading" | "playing" | "muted" | "failed";

export type AmbientConfig = {
  src: string;
  fallbackSrc?: string;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
};

export type SoundEvent =
  | "hoverSoft"
  | "selectPrecise"
  | "openAir"
  | "closeReverse"
  | "transitionPulse"
  | "surfaceDrift"
  | "atlasOpen"
  | "successQuiet"
  | "blockedSoft";

export type SoundEventRole =
  | "hover"
  | "select"
  | "open"
  | "close"
  | "transition"
  | "surface"
  | "atlasOpen"
  | "success"
  | "blocked";

export type SoundScene = "portfolio" | "immersive" | "evidence" | "practice" | "studio" | "trust";

export type SoundPreference = {
  enabled: boolean;
  muted: boolean;
  mode: SoundMode;
  volume: number;
};
