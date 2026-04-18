import type { CaseStatusKind } from "../ui/status/status.types";

export type ImmersiveTone = "horizon" | "signal" | "nocturne";

export type ImmersiveCaseKey =
  | "atlasArc"
  | "signalRoomAr"
  | "nocturneInterface"
  | "echoDriftXr"
  | "thresholdMemory";

export type ImmersiveStatus =
  | "Flagship concept"
  | "Direction build"
  | "Production-ready prototype";

export type ImmersiveItem = {
  key: ImmersiveCaseKey;
  slug: string;
  title: string;
  tagline: string;
  year: string;
  medium: string;
  mode: string;
  stack: string;
  description: string;
  status: ImmersiveStatus;
  statusKind: CaseStatusKind;
  statusNote?: string;
  tone: ImmersiveTone;
  previewVideo?: string;
  previewPoster?: string;
  featured?: boolean;
  supportLabel?: string;
  ctaLabel?: string;
};

export const immersiveItems: ImmersiveItem[] = [
  {
    key: "atlasArc",
    slug: "atlas-arc",
    title: "Atlas Arc",
    tagline: "Cinematic WebXR property narrative with guided spatial transitions.",
    year: "2026",
    medium: "WebXR / spatial web narrative",
    mode: "Concept-led showcase",
    stack: "React, Three.js, WebXR, motion systems",
    description:
      "A directed immersive journey where editorial storytelling and spatial depth work as one authored sales surface.",
    status: "Flagship concept",
    statusKind: "rnd",
    statusNote: "Flagship immersive direction in active concept development.",
    tone: "horizon",
    previewVideo: "/immersive/four-walls.mp4",
    featured: true,
    supportLabel: "Flagship stage",
    ctaLabel: "View immersive direction",
  },
  {
    key: "signalRoomAr",
    slug: "signal-room-ar",
    title: "Signal Room AR",
    tagline: "AR-assisted product framing with cinematic pacing and ambient motion.",
    year: "2026",
    medium: "AR / cinematic product storytelling",
    mode: "Interactive proof module",
    stack: "React, TypeScript, shader layers, camera choreography",
    description:
      "Designed for premium product launches where atmosphere, context, and interaction reveal are core to perceived value.",
    status: "Direction build",
    statusKind: "in_progress",
    statusNote:
      "AR direction build with working interaction framing and further production refinement in progress.",
    tone: "signal",
    previewVideo: "/immersive/friends-im-not-see.mp4",
    supportLabel: "Support study",
    ctaLabel: "Explore immersive layer",
  },
  {
    key: "nocturneInterface",
    slug: "nocturne-interface",
    title: "Nocturne Interface",
    tagline: "Future-facing spatial interface studies for premium interactive briefs.",
    year: "2025",
    medium: "Future interfaces / spatial concepts",
    mode: "Prototype sequence",
    stack: "React, Vite, interaction systems, production QA",
    description:
      "A modular immersive interface study focused on clear navigation grammar, cinematic rhythm, and launch-aware execution.",
    status: "Production-ready prototype",
    statusKind: "preview",
    statusNote:
      "Stable prototype-level surface ready for presentation, with further expansion still possible.",
    tone: "nocturne",
    previewVideo: "/immersive/fluid.mp4",
    supportLabel: "Support study",
    ctaLabel: "Open immersive page",
  },
  {
    key: "echoDriftXr",
    slug: "echo-drift-xr",
    title: "Echo Drift XR",
    tagline: "Directed XR scene studies built around pace, gaze, and atmospheric cueing.",
    year: "2026",
    medium: "XR / scene logic study",
    mode: "Direction build",
    stack: "React, R3F, shader passes, pacing systems",
    description:
      "A concept study for premium immersive briefs where motion grammar, transitions, and spatial staging need to feel authored rather than generic.",
    status: "Direction build",
    statusKind: "in_progress",
    statusNote:
      "XR scene logic and pacing direction are established; broader system build is ongoing.",
    tone: "signal",
    previewVideo: "/immersive/four-walls.mp4",
    supportLabel: "Support study",
    ctaLabel: "Open immersive case",
  },
  {
    key: "thresholdMemory",
    slug: "threshold-memory",
    title: "Threshold Memory",
    tagline: "Spatial interface experiments with darker atmosphere and controlled reveal.",
    year: "2025",
    medium: "Immersive narrative / layered interface",
    mode: "Production-ready prototype",
    stack: "React, TypeScript, motion layers, visual systems",
    description:
      "A premium study around transition logic, layered media surfaces, and immersive interface framing for future-facing storytelling work.",
    status: "Production-ready prototype",
    statusKind: "preview",
    statusNote:
      "Prototype surface is stable and presentable, with future expansion planned.",
    tone: "nocturne",
    previewVideo: "/immersive/fluid.mp4",
    supportLabel: "Support study",
    ctaLabel: "Open immersive case",
  },
];
