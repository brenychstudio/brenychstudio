// Recorded media per character (AVATARS-02), kept apart from the display registry: what may play depends on the build.
// A default build ships no clip, so every character stays a visual concept. Only a build with
// VITE_AVATARS_MEDIA=private-preview adds the private pilot (served from a git-ignored review folder, never from public/).
// Seven more characters plug in here as data; the stage and the library do not change.
import type { AvatarId, AvatarLocale } from "./avatarProfiles";
import { privatePilotMedia } from "./avatarPilotMedia";
import { privateCastMedia } from "./avatarCastMedia";

export type MediaAvailability = "concept" | "private-pilot" | "approved-demo";
export type RightsStatus = "private-only" | "approved-public";

export type CaptionTrack = { src: string; srcLang: AvatarLocale; label: string };

/** A rendered, probed clip: every number comes from the file itself (ffprobe and SHA-256), never from an estimate. */
export type IdleClip = { src: string; sha256: string; bytes: number; width: number; height: number; durationSec: number; fps?: number; rightsStatus: RightsStatus };

/** A spoken clip in the language of its audio. Captions may exist in other languages (a translation, not dubbed audio). */
export type SpokenClip = IdleClip & { audioLocale: AvatarLocale; transcript: string; captions: Partial<Record<AvatarLocale, CaptionTrack>> };

export type CharacterMedia = {
  avatarId: AvatarId;
  availability: Exclude<MediaAvailability, "concept">;
  idle?: IdleClip;
  spoken?: Partial<Record<AvatarLocale, SpokenClip>>;
};

const privatePreview = import.meta.env.VITE_AVATARS_MEDIA === "private-preview";

function mergePrivateMedia(): Partial<Record<AvatarId, CharacterMedia>> {
  const combined = { ...privatePilotMedia };
  for (const [id, addition] of Object.entries(privateCastMedia) as [AvatarId, CharacterMedia][]) {
    const pilot = combined[id];
    combined[id] = { ...pilot, ...addition, idle: addition.idle ?? pilot?.idle, spoken: { ...pilot?.spoken, ...addition.spoken } };
  }
  return combined;
}

export const avatarMedia: Partial<Record<AvatarId, CharacterMedia>> = privatePreview ? mergePrivateMedia() : {};

export function mediaAvailability(id: AvatarId): MediaAvailability {
  return avatarMedia[id]?.availability ?? "concept";
}

/** A sample is playable only in its actual audio language. Translated captions never create another audio slot. */
export function spokenClipFor(media: CharacterMedia | undefined, locale: AvatarLocale): SpokenClip | undefined {
  const clip = media?.spoken?.[locale];
  return clip?.audioLocale === locale ? clip : undefined;
}
