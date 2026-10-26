import type { PublicLocale } from "../../data/projectRegistry.types";
import type { PresenterAnswerId } from "./presenterContent";
// Explicit extension: the presenter validator loads this module in Node.
import { presenterPilotMedia } from "./presenterPilotMedia.ts";
import { presenterReleaseMedia } from "./presenterReleaseMedia.ts";

// Pre-recorded H.264 clip rendered offline from the approved master (rest frame = the idle loop's first frame).
export type PresenterClip = {
  src: string;
  sha256: string;
  durationMs: number;
  // Only answer clips carry a voice; idle loops are always silent.
  hasAudio: boolean;
  // Cue start times on the clip's own clock (ms), from the voice's character alignment.
  cueStartsMs?: readonly number[];
  // SHA-256 of the cues joined with single spaces: the clip may only play for exactly that transcript.
  transcriptSha256?: string;
};

export type PresenterStill = { src: string; srcSet: string; width: number; height: number };

export type PresenterMediaLibrary = {
  id: string;
  rights: "LOCAL_REVIEW_ONLY" | "PENDING_PUBLIC_REVIEW";
  poster: PresenterStill;
  idle: PresenterClip;
  answers: Record<PublicLocale, Partial<Record<PresenterAnswerId, PresenterClip>>>;
};

// The private pilot is only compiled into an explicit local review build (VITE_STUDIO_AVATAR_MEDIA=private-preview);
// a default build has no clip URLs and shows the still with "animated clip pending". The guard keeps the module
// importable from Node, where import.meta.env does not exist.
const PRIVATE_PREVIEW = import.meta.env?.VITE_STUDIO_AVATAR_MEDIA === "private-preview";
const RELEASE_CANDIDATE = import.meta.env?.VITE_STUDIO_AVATAR_MEDIA === "release-candidate";

export const presenterMediaLibrary: PresenterMediaLibrary | null = RELEASE_CANDIDATE ? presenterReleaseMedia : PRIVATE_PREVIEW ? presenterPilotMedia : null;

const publicRestFrame: PresenterStill = {
  src: "/studio-avatar/rest-480.webp",
  srcSet: "/studio-avatar/rest-480.webp 480w, /studio-avatar/rest-960.webp 960w",
  width: 480,
  height: 600,
};

// With media, the still is the idle loop's own first frame, so poster, idle, answer and fallback match exactly.
export const presenterRestFrame: PresenterStill = presenterMediaLibrary?.poster ?? publicRestFrame;

// Profile-photo framing: whole head and shoulders, centred.
export const presenterSeal = "/studio-avatar/seal-192.webp";

export const presenterIdleClip: PresenterClip | null = presenterMediaLibrary?.idle ?? null;

export const presenterAnswerClips: Record<PublicLocale, Partial<Record<PresenterAnswerId, PresenterClip>>> =
  presenterMediaLibrary?.answers ?? { en: {}, es: {} };
