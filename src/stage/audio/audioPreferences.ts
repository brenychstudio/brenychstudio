import type { SoundPreference } from "./audioTypes";

const STORAGE_KEY = "brenychstudio:sound-preference:v1";

export const defaultSoundPreference: SoundPreference = {
  enabled: false,
  muted: false,
  mode: "micro",
  volume: 0.06,
};

export function readSoundPreference(): SoundPreference {
  if (typeof window === "undefined") return defaultSoundPreference;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSoundPreference;
    return { ...defaultSoundPreference, ...JSON.parse(raw) };
  } catch {
    return defaultSoundPreference;
  }
}

export function writeSoundPreference(preference: SoundPreference) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // localStorage can fail in private contexts; sound remains optional.
  }
}
