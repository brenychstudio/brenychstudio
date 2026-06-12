import type { CaseStatusKind } from "../ui/status/status.types";

export type ImmersiveTone = "horizon" | "signal" | "nocturne";

export type ImmersiveCaseKey =
  | "whisper"
  | "webhero"
  | "koolBerk"
  | "atlasArc"
  | "signalRoomAr"
  | "nocturneInterface"
  | "echoDriftXr"
  | "thresholdMemory";

export type ImmersiveStatus =
  | "Advanced V1 / In progress"
  | "Advanced internal prototype / active development"
  | "Advanced interactive prototype / premium art-tech MVP"
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
  {
    key: "webhero",
    slug: "webhero",
    title: "WEBHERO",
    tagline:
      "A web-first visual system for cinematic stage modules, living images, Gaussian Splat spatial works, Art Room presentation and future XR adapters.",
    year: "2026",
    medium: "Living Visual Systems / Spatial Web Infrastructure",
    mode: "Advanced internal prototype",
    stack:
      "Vite, React, TypeScript, WebGL, GLSL / Canvas, Gaussian Splat viewer, SHARP / 3DGS generation pipeline",
    description:
      "WEBHERO is an internal Brenych Studio R&D platform exploring the future of premium visual websites as living environments. It combines a WebGL Stage System, cinematic backdrops, Living Images, SHARP/3DGS-based Living Splat works, Art Room presentation and a controlled path toward XR.",
    status: "Advanced internal prototype / active development",
    statusKind: "in_progress",
    statusNote:
      "Stage System, Backdrops, Living Images, Living Splat and Art Room are demonstrated as functional modules. Living Art Mixer remains in active R&D, and mobile-specific screenshots are not part of the current package yet.",
    tone: "signal",
    previewVideo: "/immersive/webhero/video/webhero-video-field.mp4",
    previewPoster: "/immersive/webhero/desktop/webhero-living-environments-hero.webp",
    featured: true,
    supportLabel: "Flagship R&D system",
    ctaLabel: "Open WEBHERO case",
    links: [
      {
        label: "Live site",
        href: "https://webgl-stage-system.pages.dev/",
      },
    ],
    videos: [
      {
        src: "/immersive/webhero/video/webhero-video-field.mp4",
        poster: "/immersive/webhero/video/webhero-video-field-poster.webp",
        alt: "WEBHERO field and stage system walkthrough",
        label: "Field / Stage System",
        caption:
          "The main WEBHERO field showing threshold, stage language, system overview and living visual infrastructure.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/video/webhero-video-backdrops.mp4",
        poster: "/immersive/webhero/video/webhero-video-backdrops-poster.webp",
        alt: "WEBHERO cinematic backdrops module walkthrough",
        label: "Cinematic Backdrops",
        caption:
          "Atmospheric backdrop modules working as site-wide visual infrastructure behind the interface.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/video/webhero-video-living-images.mp4",
        poster: "/immersive/webhero/video/webhero-video-living-images-poster.webp",
        alt: "WEBHERO Living Images and Living Splat walkthrough",
        label: "Living Images / Splat",
        caption:
          "Living Images Classic and Splat Pro proof: source-backed spatial surfaces, depth, posters and controlled viewers.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/video/webhero-video-art-room.mp4",
        poster: "/immersive/webhero/video/webhero-video-art-room-poster.webp",
        alt: "WEBHERO Art Room module walkthrough",
        label: "Art Room",
        caption:
          "The curated presentation layer where works can expose scene, living image, splat and future XR modes.",
        device: "desktop",
      },
    ],
    frames: [
      {
        src: "/immersive/webhero/desktop/webhero-threshold.webp",
        alt: "WEBHERO threshold intro gate",
        label: "Threshold",
        caption:
          "A lightweight intro-gate module registered as part of the Stage System identity layer.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-living-environments-hero.webp",
        alt: "WEBHERO living environments hero",
        label: "Living environments",
        caption:
          "Hero surface positioning images, interface, atmosphere and motion as one living system.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-page-listens-stage.webp",
        alt: "WEBHERO page listens stage screen",
        label: "Stage language",
        caption:
          "Signal, state, atmosphere, reveal and memory become reusable stage vocabulary.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-stage-system-index.webp",
        alt: "WEBHERO stage system index",
        label: "Stage System",
        caption:
          "Reusable WebGL scene language for hero stages, intro gates, signal objects and future XR installations.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-metamorph-bubbles.webp",
        alt: "WEBHERO morphing bubble field proof",
        label: "Signal morph",
        caption:
          "A proof fragment showing how abstract signal objects can behave as part of the stage language rather than decorative motion.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-delivery-graph.webp",
        alt: "WEBHERO delivery graph and system readout",
        label: "Delivery graph",
        caption:
          "System readout framing the platform as deployable visual infrastructure with measurable module logic and controlled outputs.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-atmosphere-infrastructure.webp",
        alt: "WEBHERO atmosphere infrastructure screen",
        label: "Backdrops",
        caption:
          "Cinematic backdrops support pages and transitions without becoming the main content.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-signal-object-backdrop.webp",
        alt: "WEBHERO signal object backdrop module",
        label: "Signal object",
        caption:
          "Backdrop proof where one signal object anchors the page atmosphere without competing with the primary content layer.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-arcwave-signal-backdrop.webp",
        alt: "WEBHERO Arcwave signal backdrop proof",
        label: "Backdrop variant",
        caption:
          "A branded backdrop variant showing how the same atmospheric engine can adapt to different visual worlds and client contexts.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-living-spatial-images.webp",
        alt: "WEBHERO Living Spatial Images page",
        label: "Living Images",
        caption:
          "Single-image spatialization turns source visuals into depth-aware, motion-led web surfaces.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-villa-atlas-grid.webp",
        alt: "WEBHERO villa atlas grid",
        label: "Atlas grid",
        caption:
          "A content atlas view where premium architecture imagery is organized as mode-ready spatial candidates instead of static gallery tiles.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-splat-study-grid.webp",
        alt: "WEBHERO splat study grid",
        label: "Splat studies",
        caption:
          "Poster-first splat candidates keep listing pages lightweight while preserving access to Pro depth modes.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-nascita-splat-study.webp",
        alt: "WEBHERO Nascita di Venere spatial splat study",
        label: "Painting splat",
        caption:
          "Fine art source material becomes a navigable spatial object through the Living Splat proof vertical.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-villa-interior-splat.webp",
        alt: "WEBHERO villa interior spatial splat study",
        label: "Interior splat",
        caption:
          "Interior imagery demonstrates the property and spatial presentation value of the Pro Splat mode.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-art-room-grid.webp",
        alt: "WEBHERO Art Room grid",
        label: "Art Room",
        caption:
          "Art Room curates paintings, generated candidates and splat works into one exhibition layer.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-van-gogh-splat.webp",
        alt: "WEBHERO Van Gogh spatial splat work",
        label: "Van Gogh splat",
        caption:
          "A painting-source splat proof demonstrating how canonical art material can become a navigable spatial work inside the platform.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-matisse-spatial-work.webp",
        alt: "WEBHERO Matisse spatial work",
        label: "Matisse spatial work",
        caption:
          "A second fine-art proof showing that the system can support different source styles while preserving authorial clarity and depth control.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-system-overview.webp",
        alt: "WEBHERO system overview screen",
        label: "System overview",
        caption:
          "The platform is framed as spatial web infrastructure rather than a template or isolated WebGL demo.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-project-proof-matrix.webp",
        alt: "WEBHERO project proof matrix",
        label: "Proof matrix",
        caption:
          "The case defines the commercial value: source fidelity, motion grammar, scalable modules and private visual systems.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-threshold-grid.webp",
        alt: "WEBHERO threshold grid states",
        label: "Threshold grid",
        caption:
          "A compact reading of intro-gate states that shows the threshold layer can scale from one opening signal into a broader scene family.",
        device: "desktop",
      },
      {
        src: "/immersive/webhero/desktop/webhero-fashion-blue-splat.webp",
        alt: "WEBHERO fashion blue spatial splat study",
        label: "Fashion splat",
        caption:
          "A fashion-oriented splat candidate proving the Pro mode can stretch beyond art and architecture into premium editorial and product imagery.",
        device: "desktop",
      },
    ],
    highlights: [
      "WebGL Stage System",
      "Cinematic Backdrops",
      "Living Images Classic",
      "Living Splat / SHARP 3DGS Pro Mode",
      "Mode-aware Art Room",
      "Future XR adapter direction",
    ],
  },
  {
    key: "koolBerk",
    slug: "kool-berk",
    title: "Kool Berk",
    tagline:
      "A Sonic Object OS for an experimental electronic artist: release objects, signal studies, audio-reactive WebGL and immersive listening room.",
    year: "2026",
    medium: "Audio-visual Artist Interface / Immersive Music Environment",
    mode: "Advanced interactive prototype",
    stack:
      "Vite, React, React Router, Three.js, React Three Fiber, Drei, CSS Modules, Web Audio API, custom GLSL shaders",
    description:
      "Kool Berk - Sonic Object OS transforms an artist website into a dark audio-visual environment. Releases behave as digital objects, tracks become signal studies, and listening opens into a WebGL chamber instead of a standard music-link page.",
    status: "Advanced interactive prototype / premium art-tech MVP",
    statusKind: "in_progress",
    statusNote:
      "Sonic Object Stage, R3F album cube, Object Inspect, Album Dossier, Track Detail, Visual Archive, local audio preview, audio-reactive shader/cube response, Sonic Room prototype, EPK layer, deep-link model and mobile survival pass are documented. Contact/Booking layer, final platform links and final public QA remain open before launch.",
    tone: "nocturne",
    previewVideo: "/immersive/kool-berk/video/kool-berk-video.mp4",
    previewPoster: "/immersive/kool-berk/desktop/kool-berk-sonic-object-stage.webp",
    featured: true,
    supportLabel: "Sonic object system",
    ctaLabel: "Open Kool Berk case",
    videos: [
      {
        src: "/immersive/kool-berk/video/kool-berk-video.mp4",
        poster: "/immersive/kool-berk/video/kool-berk-video-poster.webp",
        alt: "Kool Berk Sonic Object OS desktop walkthrough",
        label: "Sonic Object OS walkthrough",
        caption:
          "Desktop walkthrough showing the cube-led artist system, release objects, Album Dossier, Track Detail, Visual Archive, Sonic Room and contact layer.",
        device: "desktop",
      },
    ],
    frames: [
      {
        src: "/immersive/kool-berk/desktop/kool-berk-sonic-object-stage.webp",
        alt: "Kool Berk Sonic Object Stage with central cube interface",
        label: "Sonic Object Stage",
        caption:
          "The artist identity opens as a central sonic cube: navigation object, release archive, visual center and entry point into deeper modes.",
        device: "desktop",
      },
      {
        src: "/immersive/kool-berk/desktop/kool-berk-zmina-object-inspect.webp",
        alt: "Kool Berk ZMINA release object inspect interface",
        label: "Object Inspect",
        caption:
          "ReleaseUnfold presents an album as a fast object inspector with cover, archive metadata, tracklist, preview state and platform handoff.",
        device: "desktop",
      },
      {
        src: "/immersive/kool-berk/desktop/kool-berk-monah-track-dossier.webp",
        alt: "Kool Berk MONAH album dossier track detail interface",
        label: "Track Detail",
        caption:
          "Tracks become signal objects with mood, energy, duration, visual tag, local preview state and Sonic Room readiness.",
        device: "desktop",
      },
      {
        src: "/immersive/kool-berk/desktop/kool-berk-monah-release-inspect.webp",
        alt: "Kool Berk MONAH release inspect with local audio preview",
        label: "MONAH release",
        caption:
          "The MONAH object keeps the local audio preview close to the release note, making listening part of the artifact rather than a separate player.",
        device: "desktop",
      },
      {
        src: "/immersive/kool-berk/desktop/kool-berk-monah-release-object.webp",
        alt: "Kool Berk MONAH red release object cube state",
        label: "Release object",
        caption:
          "The album cover becomes a red-black cube face, preserving the ritual electronic mood while keeping the interface restrained.",
        device: "desktop",
      },
      {
        src: "/immersive/kool-berk/desktop/kool-berk-sonic-room.webp",
        alt: "Kool Berk MONAH Sonic Room immersive listening mode",
        label: "Sonic Room",
        caption:
          "MONAH Room is a fullscreen WebGL listening chamber with minimal HUD, local playback, audio-reactive atmosphere and future WebXR foundation.",
        device: "desktop",
      },
      {
        src: "/immersive/kool-berk/desktop/kool-berk-contact-signal-panel.webp",
        alt: "Kool Berk contact and booking signal panel",
        label: "Contact signal",
        caption:
          "Contact behaves as an internal booking signal layer for dates, formats, collaborations, press and audiovisual projects.",
        device: "desktop",
      },
    ],
    highlights: [
      "Sonic Object Stage",
      "R3F album cube",
      "ReleaseUnfold / Object Inspect",
      "Album Dossier and signal-object tracks",
      "Web Audio API analysis",
      "Audio-reactive Sonic Room",
      "EPK / Press Dossier layer",
      "Future WebXR room foundation",
    ],
  },
];
