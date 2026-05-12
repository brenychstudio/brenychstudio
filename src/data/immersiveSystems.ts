export type ImmersiveStatus = "completed" | "prototype" | "research" | "upcoming";

export type ImmersiveChamberId =
  | "whisper"
  | "product-world"
  | "presence-archive"
  | "collector-continuation"
  | "installation-field";

export type ImmersiveMood =
  | "forest"
  | "spatial"
  | "object"
  | "memory"
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
    id: "product-world",
    room: "Room 02",
    title: "Product World",
    shortTitle: "Product World",
    status: "prototype",
    statusLabel: "Prototype direction",
    role: "Interactive product environment",
    summary:
      "A premium product or service presented as a navigable world with staged proof, cinematic reveal, and interface-led decisions.",
    proofLine:
      "Products stop behaving like catalog entries and start behaving like staged environments.",
    visualRole: "signal",
    media: {
      poster: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
      video: "/cases/house-of-lune/video/house-of-lune-video.mp4",
      stills: ["/cases/house-of-lune/desktop/house-of-lune-3.webp"],
    },
    tags: ["Product surfaces", "Guided proof", "Interactive launch"],
    mood: "object",
    chamberSignal: "Product as world",
    engineIds: ["webgl-stage", "cinematic-inspect", "living-atmosphere"],
    position: {
      x: 70,
      y: 42,
      scale: 0.88,
      rotate: 7,
    },
  },
  {
    id: "presence-archive",
    room: "Room 03",
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
    room: "Room 04",
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
    room: "Room 05",
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
    chamberIds: ["product-world", "installation-field"],
    signal: "stage logic",
  },
  {
    id: "living-atmosphere",
    title: "Living Atmosphere Engine",
    role: "Climate engine",
    summary: "Resolves route, section, scroll, and chamber identity into controlled atmosphere tokens.",
    chamberIds: ["whisper", "product-world", "presence-archive", "collector-continuation", "installation-field"],
    signal: "atmosphere",
  },
  {
    id: "cinematic-frame-field",
    title: "Cinematic Frame Field",
    role: "Media field",
    summary: "Keeps visual material alive as cinematic planes instead of static cards or sliders.",
    chamberIds: ["whisper", "presence-archive"],
    signal: "frame field",
  },
  {
    id: "living-editorial-surface",
    title: "Living Editorial Surface",
    role: "Scroll canvas",
    summary: "Lets media, captions, and scroll behave like one editorial field.",
    chamberIds: ["presence-archive"],
    signal: "living canvas",
  },
  {
    id: "cinematic-inspect",
    title: "Cinematic Inspect Reveal",
    role: "Deep mode",
    summary: "Transforms inspection into a spatial mode transition instead of a modal popup.",
    chamberIds: ["product-world", "collector-continuation"],
    signal: "inspect",
  },
  {
    id: "spatial-reference-orbit",
    title: "Spatial Reference Orbit",
    role: "Orbit logic",
    summary: "Supports controlled spatial navigation between media references, chambers, and proof fragments.",
    chamberIds: ["whisper", "installation-field"],
    signal: "orbit",
  },
  {
    id: "presence-os",
    title: "Presence OS",
    role: "Behavior engine",
    summary: "Adds depth through hover, stillness, return, memory, and attention while preserving click-first access.",
    chamberIds: ["presence-archive", "installation-field"],
    signal: "presence",
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
