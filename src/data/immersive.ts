import type { CaseStatusKind } from "../ui/status/status.types";

export type ImmersiveTone = "horizon" | "signal" | "nocturne";

export type ImmersiveCaseKey =
  | "whisper"
  | "atlasArc"
  | "signalRoomAr"
  | "nocturneInterface"
  | "echoDriftXr"
  | "thresholdMemory";

export type ImmersiveStatus =
  | "Advanced V1 / In progress"
  | "Flagship concept"
  | "Direction build"
  | "Production-ready prototype";

export type ImmersiveMedia = {
  src: string;
  poster?: string;
  alt: string;
  caption: string;
  label?: string;
  device?: "desktop" | "mobile" | "vr";
};

export type ImmersiveLink = {
  label: string;
  href: string;
};

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
  links?: ImmersiveLink[];
  videos?: ImmersiveMedia[];
  frames?: ImmersiveMedia[];
  highlights?: string[];
};

export const immersiveItems: ImmersiveItem[] = [
  {
    key: "whisper",
    slug: "whisper",
    title: "WHISPER",
    tagline:
      "A cinematic Web / XR exhibition where photography becomes an immersive collector experience.",
    year: "2026",
    medium: "Interactive Web / XR Exhibition",
    mode: "Advanced working V1",
    stack: "React, Vite, Three.js, WebXR, Quest VR, AR preview, Cloudflare Pages",
    description:
      "WHISPER combines conceptual photography, an editorial art website, browser-based WebXR, Quest VR hand-navigation, a collector print catalog, shareable print paths, and AR preview for framed editions.",
    status: "Advanced V1 / In progress",
    statusKind: "in_progress",
    statusNote:
      "Public site, WebXR experience, Quest hand navigation, print catalog, and first AR print preview flow are working. Final XR polish, additional AR assets, and mobile/tablet refinements continue.",
    tone: "nocturne",
    previewVideo: "/immersive/Whisper/Video/whisper-hero-poster.mp4",
    previewPoster: "/immersive/Whisper/desktop/whisper-hero.jpg",
    featured: true,
    supportLabel: "Flagship immersive case",
    ctaLabel: "Open WHISPER case",
    links: [
      {
        label: "Live site",
        href: "https://whisper-sg8.pages.dev/",
      },
      {
        label: "Repository",
        href: "https://github.com/brenychstudio/Whisper",
      },
    ],
    videos: [
      {
        src: "/immersive/Whisper/Video/whisper-desktop-video.mp4",
        poster: "/immersive/Whisper/desktop/whisper-8.jpg",
        alt: "WHISPER desktop website walkthrough video",
        label: "Desktop website walkthrough",
        caption:
          "Desktop navigation through the editorial website, series pages, print catalog, and collector-facing flow.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/Video/whisper-vr-video.mp4",
        poster: "/immersive/Whisper/desktop/whisper-vr-1.jpg",
        alt: "WHISPER Meta Quest 3 VR exhibition capture",
        label: "Meta Quest 3 exhibition capture",
        caption:
          "Headset capture showing the spatial exhibition, Quest VR experience, and hand-navigation proof.",
        device: "vr",
      },
    ],
    frames: [
      {
        src: "/immersive/Whisper/desktop/whisper-hero.jpg",
        alt: "WHISPER desktop hero",
        label: "Hero",
        caption:
          "Homepage hero establishing WHISPER as a quiet cinematic exhibition rather than a conventional gallery.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-1.jpg",
        alt: "WHISPER desktop frame 01",
        label: "Series system",
        caption:
          "Series presentation connecting Whisper of the Sea and Whisper of the Forest through a dark editorial interface.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-2.jpg",
        alt: "WHISPER desktop frame 02",
        label: "Editorial grid",
        caption:
          "Museum-like image and video staging with controlled contrast and slow visual rhythm.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-3.jpg",
        alt: "WHISPER desktop frame 03",
        label: "Gallery rhythm",
        caption:
          "Gallery surface designed around silence, fragments, and artwork-first pacing.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-4.jpg",
        alt: "WHISPER desktop frame 04",
        label: "Sea series",
        caption:
          "Whisper of the Sea image staging with cinematic darkness and controlled natural texture.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-5.jpg",
        alt: "WHISPER desktop frame 05",
        label: "Forest series",
        caption:
          "Whisper of the Forest visual direction using presence, memory, and quiet natural staging.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-6.jpg",
        alt: "WHISPER desktop frame 06",
        label: "Series page",
        caption:
          "Series page composition balancing full-bleed atmosphere, artwork focus, and restrained navigation.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-7.jpg",
        alt: "WHISPER desktop frame 07",
        label: "Print catalog",
        caption:
          "Print catalog and work-detail surface connecting the exhibition to collector-oriented continuation.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-8.jpg",
        alt: "WHISPER desktop frame 08",
        label: "Print detail",
        caption:
          "Print detail flow with edition information, material framing, and purchase-oriented handoff.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-9.jpg",
        alt: "WHISPER desktop frame 09",
        label: "AR preview",
        caption:
          "AR print preview surface binding framed edition logic to a customer-facing preview flow.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-10.jpg",
        alt: "WHISPER desktop frame 10",
        label: "Notes layer",
        caption:
          "Notes and credits layer presenting the project as a conceptual exhibition system.",
        device: "desktop",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-vr-1.jpg",
        alt: "WHISPER Quest VR frame 01",
        label: "Quest VR 01",
        caption:
          "Quest VR exhibition view showing spatial image staging inside the immersive environment.",
        device: "vr",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-vr-2.jpg",
        alt: "WHISPER Quest VR frame 02",
        label: "Quest VR 02",
        caption:
          "Spatial gallery moment where Sea and Forest materials become navigable exhibition fragments.",
        device: "vr",
      },
      {
        src: "/immersive/Whisper/desktop/whisper-vr-3.jpg",
        alt: "WHISPER Quest VR frame 03",
        label: "Quest VR 03",
        caption:
          "VR navigation proof with controlled spatial layout, teleport marker logic, and calm immersive pacing.",
        device: "vr",
      },
      {
        src: "/immersive/Whisper/mobile/whisper-mb-1.jpg",
        alt: "WHISPER mobile frame 01",
        label: "Mobile 01",
        caption:
          "Mobile landing surface preserving the cinematic art direction and exhibition-first framing.",
        device: "mobile",
      },
      {
        src: "/immersive/Whisper/mobile/whisper-mb-2.jpg",
        alt: "WHISPER mobile frame 02",
        label: "Mobile 02",
        caption:
          "Mobile series entry combining Sea and Forest materials in a compact editorial flow.",
        device: "mobile",
      },
      {
        src: "/immersive/Whisper/mobile/whisper-mb-3.jpg",
        alt: "WHISPER mobile frame 03",
        label: "Mobile 03",
        caption:
          "Mobile series index translated into a quiet, artwork-first browsing structure.",
        device: "mobile",
      },
      {
        src: "/immersive/Whisper/mobile/whisper-mb-4.jpg",
        alt: "WHISPER mobile frame 04",
        label: "Mobile 04",
        caption:
          "Premium mobile drawer designed to avoid covering the artwork while keeping navigation close.",
        device: "mobile",
      },
      {
        src: "/immersive/Whisper/mobile/whisper-mb-5.jpg",
        alt: "WHISPER mobile frame 05",
        label: "Mobile 05",
        caption:
          "Mobile work-detail surface connecting artwork, edition information, and collector continuation.",
        device: "mobile",
      },
      {
        src: "/immersive/Whisper/mobile/whisper-mb-6.jpg",
        alt: "WHISPER mobile frame 06",
        label: "Mobile 06",
        caption:
          "Mobile print detail flow with edition data, AR preview entry, and collector-facing actions.",
        device: "mobile",
      },
    ],
    highlights: [
      "Premium editorial art website",
      "WebXR / Quest VR exhibition",
      "Real hand tracking and teleport navigation",
      "Fine-art print catalog",
      "AR framed print preview",
      "Reusable XRCore foundation",
    ],
  },
];
