export type ImmersiveStatus = "completed" | "prototype" | "research" | "upcoming";

export type ImmersiveChamberId =
  | "whisper"
  | "webhero"
  | "kool-berk"
  | "presence-os-memory-atlas"
  | "orbit-lens"
  | "collective-presence-interface"
  | "presence-archive"
  | "collector-continuation"
  | "installation-field";

export type ImmersiveMood =
  | "forest"
  | "spatial"
  | "sonic"
  | "object"
  | "memory"
  | "optic"
  | "collector"
  | "installation";

export type ImmersiveVisualRole = "chamber" | "signal" | "engine" | "continuation";

export type ImmersiveSystemItem = {
  id: ImmersiveChamberId;
  room: string;
  title: string;
  shortTitle: string;
  status: ImmersiveStatus;
  statusLabel: string;
  role: string;
  summary: string;
  proofLine: string;
  visualRole: ImmersiveVisualRole;
  media?: {
    poster?: string;
    video?: string;
    stills?: string[];
  };
  route?: string;
  ctaLabel?: string;
  tags: string[];
  mood: ImmersiveMood;
  chamberSignal: string;
  engineIds: string[];
  position: {
    x: number;
    y: number;
    scale: number;
    rotate: number;
  };
};

export type ImmersiveEngineItem = {
  id: string;
  title: string;
  role: string;
  summary: string;
  chamberIds: ImmersiveChamberId[];
  signal: string;
};

export const defaultImmersiveChamberId: ImmersiveChamberId = "whisper";

export const immersiveChambers: ImmersiveSystemItem[] = [
  {
    id: "whisper",
    room: "Room 01",
    title: "WHISPER",
    shortTitle: "WHISPER",
    status: "completed",
    statusLabel: "Completed spatial proof",
    role: "Cinematic web / XR exhibition",
    summary:
      "A completed spatial proof connecting public website, mobile presentation, print logic, AR preview, and Quest-tested spatial experience.",
    proofLine:
      "The first finished chamber: photography becomes a public surface, collector system, and room-scale proof.",
    visualRole: "chamber",
    media: {
      poster: "/immersive/Whisper/desktop/whisper-hero.jpg",
      video: "/immersive/Whisper/Video/whisper-hero-poster.mp4",
      stills: [
        "/immersive/Whisper/desktop/whisper-8.jpg",
        "/immersive/Whisper/desktop/whisper-vr-1.jpg",
        "/immersive/Whisper/mobile/whisper-mb-3.jpg",
      ],
    },
    route: "/immersive/whisper",
    ctaLabel: "Enter WHISPER",
    tags: ["Web exhibition", "Mobile", "Print", "AR", "Quest"],
    mood: "forest",
    chamberSignal: "First completed proof",
    engineIds: ["cinematic-frame-field", "living-atmosphere", "spatial-reference-orbit", "ar-collector"],
    position: {
      x: 48,
      y: 18,
      scale: 1.16,
      rotate: -4,
    },
  },
  {
    id: "webhero",
    room: "Room 02",
    title: "WEBHERO",
    shortTitle: "WEBHERO",
    status: "prototype",
    statusLabel: "Advanced R&D system",
    role: "Living visual systems platform",
    summary:
      "A web-first visual system for cinematic stage modules, living images, Gaussian Splat spatial works, Art Room presentation and future XR adapters.",
    proofLine:
      "Images, WebGL scenes and spatial assets become controlled living web experiences instead of static portfolio media.",
    visualRole: "chamber",
    media: {
      poster: "/immersive/webhero/desktop/webhero-threshold.webp",
      video: "/immersive/webhero/video/webhero-video-field.mp4",
      stills: [
        "/immersive/webhero/desktop/webhero-art-room-grid.webp",
        "/immersive/webhero/desktop/webhero-splat-study-grid.webp",
        "/immersive/webhero/desktop/webhero-atmosphere-infrastructure.webp",
      ],
    },
    route: "/immersive/webhero",
    ctaLabel: "Enter WEBHERO",
    tags: ["WebGL", "Living Images", "3DGS", "Art Room", "XR path"],
    mood: "spatial",
    chamberSignal: "Living visual system",
    engineIds: [
      "webgl-stage",
      "living-atmosphere",
      "cinematic-frame-field",
      "living-editorial-surface",
      "cinematic-inspect",
      "presence-os",
    ],
    position: {
      x: 69,
      y: 34,
      scale: 1.02,
      rotate: 5,
    },
  },
  {
    id: "kool-berk",
    room: "Room 03",
    title: "Kool Berk",
    shortTitle: "Kool Berk",
    status: "prototype",
    statusLabel: "Advanced sonic prototype",
    role: "Audio-visual artist OS",
    summary:
      "A Sonic Object OS for an experimental electronic artist where releases become objects, tracks become signal studies, and listening opens into an audio-reactive WebGL room.",
    proofLine:
      "The artist site stops behaving like a link hub and becomes a release archive, EPK layer, and immersive listening environment.",
    visualRole: "chamber",
    media: {
      poster: "/immersive/kool-berk/desktop/kool-berk-sonic-object-stage.webp",
      video: "/immersive/kool-berk/video/kool-berk-video.mp4",
      stills: [
        "/immersive/kool-berk/desktop/kool-berk-monah-track-dossier.webp",
        "/immersive/kool-berk/desktop/kool-berk-sonic-room.webp",
        "/immersive/kool-berk/desktop/kool-berk-contact-signal-panel.webp",
      ],
    },
    route: "/immersive/kool-berk",
    ctaLabel: "Enter Kool Berk",
    tags: ["R3F", "Web Audio", "GLSL", "EPK", "Sonic Room"],
    mood: "sonic",
    chamberSignal: "Music as object",
    engineIds: [
      "webgl-stage",
      "living-atmosphere",
      "cinematic-frame-field",
      "cinematic-inspect",
      "presence-os",
      "sonic-object-os",
    ],
    position: {
      x: 38,
      y: 54,
      scale: 1.02,
      rotate: -6,
    },
  },
  {
    id: "presence-os-memory-atlas",
    room: "Room 04",
    title: "Presence OS / Memory Atlas",
    shortTitle: "Presence OS",
    status: "prototype",
    statusLabel: "Functional MVP prototype",
    role: "Presence-based spatial memory interface",
    summary:
      "A private spatial memory interface where personal archive fragments reveal themselves through stillness, return and attention.",
    proofLine:
      "A local-first archive becomes a living memory field, cinematic inspect experience, XR room and exportable artifact system.",
    visualRole: "chamber",
    media: {
      poster: "/immersive/presence-os-memory-atlas/desktop/presence-os-hero.webp",
      video: "/immersive/presence-os-memory-atlas/video/presence-os-memory-atlas-video.mp4",
      stills: [
        "/immersive/presence-os-memory-atlas/desktop/presence-os-memory-field.webp",
        "/immersive/presence-os-memory-atlas/desktop/presence-os-xr-memory-room.webp",
        "/immersive/presence-os-memory-atlas/vr-screenshot/presence-os-vr-hand-presence.webp",
      ],
    },
    route: "/immersive/presence-os-memory-atlas",
    ctaLabel: "Enter Presence OS",
    tags: ["Local-first", "Presence OS", "WebXR", "Memory Reel", "VR trace"],
    mood: "memory",
    chamberSignal: "Archive responds to presence",
    engineIds: [
      "presence-os",
      "webgl-stage",
      "living-atmosphere",
      "cinematic-frame-field",
      "cinematic-inspect",
      "spatial-reference-orbit",
    ],
    position: {
      x: 58,
      y: 70,
      scale: 1,
      rotate: 3,
    },
  },
  {
    id: "orbit-lens",
    room: "Room 05",
    title: "Orbit Lens",
    shortTitle: "Orbit Lens",
    status: "prototype",
    statusLabel: "Functional web-first prototype",
    role: "Fictional AI spatial glasses product OS",
    summary:
      "A premium fictional AI spatial glasses concept where the website behaves like the spatial interface of the device itself.",
    proofLine:
      "Seven contextual intelligence fields, Inspect Optics, Reference Orbit and optional WebXR proof mode replace a standard hardware landing page.",
    visualRole: "chamber",
    media: {
      poster: "/immersive/orbit-lens/desktop/orbit-lens-hero.webp",
      video: "/immersive/orbit-lens/video/orbit-lens-video.mp4",
      stills: [
        "/immersive/orbit-lens/desktop/orbit-lens-reference-orbit.webp",
        "/immersive/orbit-lens/desktop/orbit-lens-inspect-optics.webp",
        "/immersive/orbit-lens/desktop/orbit-lens-privacy-boundary.webp",
      ],
    },
    route: "/immersive/orbit-lens",
    ctaLabel: "Enter Orbit Lens",
    tags: ["AI eyewear", "WebXR", "Inspect Optics", "Reference Orbit", "GLSL"],
    mood: "optic",
    chamberSignal: "Website as product OS",
    engineIds: [
      "webgl-stage",
      "living-atmosphere",
      "cinematic-frame-field",
      "cinematic-inspect",
      "spatial-reference-orbit",
    ],
    position: {
      x: 74,
      y: 58,
      scale: 0.98,
      rotate: -5,
    },
  },
  {
    id: "collective-presence-interface",
    room: "Room 06",
    title: "Collective Signal Interface",
    shortTitle: "Collective Signal",
    status: "prototype",
    statusLabel: "Prepared signal / experiment 01",
    role: "Anonymous presence interface",
    summary:
      "A website shaped by anonymous presence, where identity stays uncollected and the field behaves like a living collective contract.",
    proofLine:
      "The surface remembers pauses, returns, movement, and silence without storing the person behind them.",
    visualRole: "signal",
    media: {
      poster: "/immersive/future/collective-presence-interface/Collective-Presence-Interface-1.png",
      video: "/immersive/future/collective-presence-interface/Collective-Presence-Interface-video.mp4",
      stills: [
        "/immersive/future/collective-presence-interface/Collective-Presence-Interface-1.png",
        "/immersive/future/collective-presence-interface/Collective-Presence-Interface-2.png",
        "/immersive/future/collective-presence-interface/Collective-Presence-Interface-3.png",
      ],
    },
    tags: ["anonymous presence", "collective field", "memory weather"],
    mood: "memory",
    chamberSignal: "Presence as contract",
    engineIds: ["presence-os", "living-editorial-surface", "living-atmosphere"],
    position: {
      x: 70,
      y: 42,
      scale: 0.88,
      rotate: 7,
    },
  },
  {
    id: "presence-archive",
    room: "Room 07",
    title: "Presence Archive",
    shortTitle: "Presence Archive",
    status: "research",
    statusLabel: "Research chamber",
    role: "Presence-based archive logic",
    summary:
      "Archives structured as living fields where attention, memory, annotations, and media fragments behave spatially.",
    proofLine:
      "Click gives access; presence adds depth, memory, signal, and context.",
    visualRole: "signal",
    media: {
      poster: "/immersive/Whisper/desktop/whisper-8.jpg",
      stills: ["/immersive/Whisper/desktop/whisper-5.jpg", "/immersive/Whisper/mobile/whisper-mb-6.jpg"],
    },
    tags: ["Archive field", "Memory layer", "Editorial presence"],
    mood: "memory",
    chamberSignal: "Presence gives depth",
    engineIds: ["presence-os", "living-editorial-surface", "living-atmosphere"],
    position: {
      x: 27,
      y: 53,
      scale: 0.82,
      rotate: -8,
    },
  },
  {
    id: "collector-continuation",
    room: "Room 08",
    title: "Collector Continuation",
    shortTitle: "Collector",
    status: "upcoming",
    statusLabel: "AR / print / edition logic",
    role: "Collector-facing continuation",
    summary:
      "A continuation layer where print, edition data, preview surfaces, and AR context stay connected.",
    proofLine:
      "The digital surface extends into object space: print, preview, edition, and collector context.",
    visualRole: "continuation",
    media: {
      poster: "/immersive/Whisper/desktop/whisper-7.jpg",
      stills: ["/immersive/Whisper/desktop/whisper-9.jpg", "/immersive/Whisper/mobile/whisper-mb-6.jpg"],
    },
    tags: ["Print logic", "AR preview", "Edition system"],
    mood: "collector",
    chamberSignal: "Screen to object",
    engineIds: ["ar-collector", "cinematic-inspect", "living-atmosphere"],
    position: {
      x: 18,
      y: 76,
      scale: 0.76,
      rotate: 6,
    },
  },
  {
    id: "installation-field",
    room: "Room 09",
    title: "Installation Field",
    shortTitle: "Installation",
    status: "upcoming",
    statusLabel: "Future exhibition mode",
    role: "Installation-ready web layer",
    summary:
      "A future mode where web-born interfaces become projection, camera-aware space, kiosk, and connected room-scale presentation.",
    proofLine:
      "The interface becomes an environment: projected, spatial, and installation-ready.",
    visualRole: "chamber",
    media: {
      poster: "/immersive/Whisper/desktop/whisper-vr-1.jpg",
      stills: ["/immersive/Whisper/desktop/whisper-1.jpg", "/immersive/Whisper/desktop/whisper-10.jpg"],
    },
    tags: ["Projection", "Installation", "Room-scale"],
    mood: "installation",
    chamberSignal: "Web-born room",
    engineIds: ["webgl-stage", "presence-os", "spatial-reference-orbit"],
    position: {
      x: 76,
      y: 75,
      scale: 0.78,
      rotate: -10,
    },
  },
];

export const immersiveEngineStack: ImmersiveEngineItem[] = [
  {
    id: "webgl-stage",
    title: "WebGL Stage System",
    role: "Scene engine",
    summary: "Turns hero, product, archive, and proof moments into directed visual stages.",
    chamberIds: ["webhero", "kool-berk", "presence-os-memory-atlas", "orbit-lens", "collective-presence-interface", "installation-field"],
    signal: "stage logic",
  },
  {
    id: "living-atmosphere",
    title: "Living Atmosphere Engine",
    role: "Climate engine",
    summary: "Resolves route, section, scroll, and chamber identity into controlled atmosphere tokens.",
    chamberIds: ["whisper", "webhero", "kool-berk", "presence-os-memory-atlas", "orbit-lens", "collective-presence-interface", "presence-archive", "collector-continuation", "installation-field"],
    signal: "atmosphere",
  },
  {
    id: "cinematic-frame-field",
    title: "Cinematic Frame Field",
    role: "Media field",
    summary: "Keeps visual material alive as cinematic planes instead of static cards or sliders.",
    chamberIds: ["whisper", "webhero", "kool-berk", "presence-os-memory-atlas", "orbit-lens", "presence-archive"],
    signal: "frame field",
  },
  {
    id: "living-editorial-surface",
    title: "Living Editorial Surface",
    role: "Scroll canvas",
    summary: "Lets media, captions, and scroll behave like one editorial field.",
    chamberIds: ["webhero", "presence-os-memory-atlas", "orbit-lens", "presence-archive"],
    signal: "living canvas",
  },
  {
    id: "cinematic-inspect",
    title: "Cinematic Inspect Reveal",
    role: "Deep mode",
    summary: "Transforms inspection into a spatial mode transition instead of a modal popup.",
    chamberIds: ["webhero", "kool-berk", "presence-os-memory-atlas", "orbit-lens", "collective-presence-interface", "collector-continuation"],
    signal: "inspect",
  },
  {
    id: "spatial-reference-orbit",
    title: "Spatial Reference Orbit",
    role: "Orbit logic",
    summary: "Supports controlled spatial navigation between media references, chambers, and proof fragments.",
    chamberIds: ["whisper", "presence-os-memory-atlas", "orbit-lens", "installation-field"],
    signal: "orbit",
  },
  {
    id: "presence-os",
    title: "Presence OS",
    role: "Behavior engine",
    summary: "Adds depth through hover, stillness, return, memory, and attention while preserving click-first access.",
    chamberIds: ["webhero", "kool-berk", "presence-os-memory-atlas", "presence-archive", "installation-field"],
    signal: "presence",
  },
  {
    id: "sonic-object-os",
    title: "Sonic Object OS",
    role: "Audio object engine",
    summary: "Turns releases into inspectable objects, tracks into signal studies, and listening into an audio-reactive WebGL room.",
    chamberIds: ["kool-berk"],
    signal: "sonic object",
  },
  {
    id: "ar-collector",
    title: "AR / Collector Preview",
    role: "Object continuation",
    summary: "Extends digital surfaces into print, edition, preview, and collector-facing object logic.",
    chamberIds: ["whisper", "collector-continuation"],
    signal: "collector",
  },
];

export const immersiveApplicationLayer = [
  "exhibition microsites",
  "premium product worlds",
  "collector / print / AR systems",
  "interactive archives",
  "spatial pitch pages",
  "installation-ready web layers",
  "WebXR prototypes",
];

export function getImmersiveChamber(id: ImmersiveChamberId) {
  return immersiveChambers.find((item) => item.id === id) ?? immersiveChambers[0];
}

export function getChamberEngines(id: ImmersiveChamberId) {
  return immersiveEngineStack.filter((engine) => engine.chamberIds.includes(id));
}
