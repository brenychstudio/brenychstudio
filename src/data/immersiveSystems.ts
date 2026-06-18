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

type SpanishImmersiveSystemCopy = Partial<Pick<
  ImmersiveSystemItem,
  "room" | "title" | "shortTitle" | "statusLabel" | "role" | "summary" | "proofLine" | "ctaLabel" | "tags" | "chamberSignal"
>>;

const spanishImmersiveSystemCopy: Record<ImmersiveChamberId, SpanishImmersiveSystemCopy> = {
  whisper: {
    room: "Sala 01",
    statusLabel: "Prueba espacial completada",
    role: "Exposicion cinematografica web / XR",
    summary:
      "Una prueba espacial completada que conecta sitio publico, mobile, prints, preview AR y experiencia Quest.",
    proofLine:
      "La primera camara terminada: fotografia como superficie publica, sistema collector y prueba room-scale.",
    ctaLabel: "Entrar en WHISPER",
    tags: ["Exposicion web", "Mobile", "Print", "AR", "Quest"],
    chamberSignal: "Primera prueba completada",
  },
  webhero: {
    room: "Sala 02",
    statusLabel: "Sistema R&D avanzado",
    role: "Plataforma de sistemas visuales vivos",
    summary:
      "Sistema visual web-first para stages cinematicos, Living Images, obras Gaussian Splat, Art Room y futuros adaptadores XR.",
    proofLine:
      "Imagenes, escenas WebGL y assets espaciales se convierten en experiencias web vivas, no en media estatica.",
    ctaLabel: "Entrar en WEBHERO",
    tags: ["WebGL", "Living Images", "3DGS", "Art Room", "XR"],
    chamberSignal: "Sistema visual vivo",
  },
  "kool-berk": {
    room: "Sala 03",
    statusLabel: "Prototipo sonoro avanzado",
    role: "Artist OS audiovisual",
    summary:
      "Un Sonic Object OS donde releases, tracks, EPK y escucha se convierten en sala WebGL audio-reactiva.",
    proofLine:
      "El sitio de artista deja de ser link hub y pasa a ser archivo de releases, EPK y entorno inmersivo.",
    ctaLabel: "Entrar en Kool Berk",
    tags: ["R3F", "Web Audio", "GLSL", "EPK", "Sonic Room"],
    chamberSignal: "Musica como objeto",
  },
  "presence-os-memory-atlas": {
    room: "Sala 04",
    statusLabel: "Prototipo MVP funcional",
    role: "Interfaz de memoria espacial basada en presencia",
    summary:
      "Interfaz privada donde fragmentos de archivo personal se revelan por quietud, retorno y atencion.",
    proofLine:
      "Un archivo local-first se convierte en campo de memoria vivo, inspect cinematico, sala XR y artefactos exportables.",
    ctaLabel: "Entrar en Presence OS",
    tags: ["Local-first", "Presence OS", "WebXR", "Memory Reel", "VR"],
    chamberSignal: "El archivo responde a presencia",
  },
  "orbit-lens": {
    room: "Sala 05",
    statusLabel: "Prototipo web-first funcional",
    role: "Product OS ficticio para gafas AI espaciales",
    summary:
      "Concepto premium de gafas AI espaciales donde la web se comporta como la interfaz del dispositivo.",
    proofLine:
      "Campos de inteligencia contextual, Inspect Optics, Reference Orbit y WebXR reemplazan una landing de hardware estandar.",
    ctaLabel: "Entrar en Orbit Lens",
    tags: ["AI eyewear", "WebXR", "Inspect Optics", "Reference Orbit", "GLSL"],
    chamberSignal: "Web como Product OS",
  },
  "collective-presence-interface": {
    room: "Sala 06",
    title: "Collective Signal Interface",
    shortTitle: "Collective Signal",
    statusLabel: "Senal preparada / experimento 01",
    role: "Interfaz de presencia anonima",
    summary:
      "Una web formada por presencia anonima, donde la identidad no se recoge y el campo actua como contrato colectivo.",
    proofLine:
      "La superficie recuerda pausas, retornos, movimiento y silencio sin guardar a la persona detras.",
    tags: ["presencia anonima", "campo colectivo", "clima de memoria"],
    chamberSignal: "Presencia como contrato",
  },
  "presence-archive": {
    room: "Sala 07",
    title: "Presence Archive",
    shortTitle: "Presence Archive",
    statusLabel: "Camara de investigacion",
    role: "Logica de archivo basada en presencia",
    summary:
      "Archivos como campos vivos donde atencion, memoria, notas y fragmentos media se comportan espacialmente.",
    proofLine:
      "El click da acceso; la presencia anade profundidad, memoria, senal y contexto.",
    tags: ["archivo campo", "capa memoria", "presencia editorial"],
    chamberSignal: "La presencia da profundidad",
  },
  "collector-continuation": {
    room: "Sala 08",
    title: "Collector Continuation",
    shortTitle: "Collector",
    statusLabel: "AR / print / logica de edicion",
    role: "Continuacion orientada a coleccionista",
    summary:
      "Capa donde print, datos de edicion, previews y contexto AR permanecen conectados.",
    proofLine:
      "La superficie digital continua hacia objeto: print, preview, edicion y contexto collector.",
    tags: ["print", "preview AR", "edicion"],
    chamberSignal: "Pantalla a objeto",
  },
  "installation-field": {
    room: "Sala 09",
    title: "Installation Field",
    shortTitle: "Installation",
    statusLabel: "Modo expositivo futuro",
    role: "Capa web lista para instalacion",
    summary:
      "Modo futuro donde interfaces nacidas en web pasan a proyeccion, kiosk y presentacion room-scale.",
    proofLine:
      "La interfaz se convierte en entorno: proyectado, espacial y preparado para instalacion.",
    tags: ["proyeccion", "instalacion", "room-scale"],
    chamberSignal: "Sala nacida en web",
  },
};

const spanishImmersiveEngineCopy: Record<string, Partial<ImmersiveEngineItem>> = {
  "webgl-stage": {
    role: "Motor de escena",
    summary: "Convierte hero, producto, archivo y prueba en stages visuales dirigidos.",
    signal: "logica de stage",
  },
  "living-atmosphere": {
    role: "Motor de clima",
    summary: "Resuelve ruta, seccion, scroll e identidad de camara en atmosfera controlada.",
    signal: "atmosfera",
  },
  "cinematic-frame-field": {
    role: "Campo media",
    summary: "Mantiene material visual vivo como planos cinematicos, no como cards estaticas.",
    signal: "frame field",
  },
  "living-editorial-surface": {
    role: "Canvas de scroll",
    summary: "Permite que media, captions y scroll funcionen como un campo editorial.",
    signal: "canvas vivo",
  },
  "cinematic-inspect": {
    role: "Modo profundo",
    summary: "Convierte inspeccion en transicion espacial en vez de modal comun.",
    signal: "inspect",
  },
  "spatial-reference-orbit": {
    role: "Logica de orbita",
    summary: "Soporta navegacion espacial controlada entre media, camaras y prueba.",
    signal: "orbita",
  },
  "presence-os": {
    role: "Motor de comportamiento",
    summary: "Anade profundidad por hover, quietud, retorno, memoria y atencion.",
    signal: "presencia",
  },
  "sonic-object-os": {
    role: "Motor de objeto sonoro",
    summary: "Convierte releases en objetos inspeccionables y escucha en sala WebGL audio-reactiva.",
    signal: "objeto sonoro",
  },
  "ar-collector": {
    role: "Continuacion de objeto",
    summary: "Extiende superficies digitales hacia print, edicion, preview y logica collector.",
    signal: "collector",
  },
};

export const spanishImmersiveApplicationLayer = [
  "microsites expositivos",
  "universos de producto premium",
  "sistemas collector / print / AR",
  "archivos interactivos",
  "pitch pages espaciales",
  "capas web listas para instalacion",
  "prototipos WebXR",
];

export function localizeImmersiveSystemItem(item: ImmersiveSystemItem, locale: "en" | "es" = "en"): ImmersiveSystemItem {
  if (locale !== "es") return item;
  const copy = spanishImmersiveSystemCopy[item.id];
  return copy ? { ...item, ...copy } : item;
}

export function localizeImmersiveEngineItem(item: ImmersiveEngineItem, locale: "en" | "es" = "en"): ImmersiveEngineItem {
  if (locale !== "es") return item;
  const copy = spanishImmersiveEngineCopy[item.id];
  return copy ? { ...item, ...copy } : item;
}

export function getLocalizedImmersiveChambers(locale: "en" | "es" = "en") {
  return immersiveChambers.map((item) => localizeImmersiveSystemItem(item, locale));
}

export function getLocalizedImmersiveEngineStack(locale: "en" | "es" = "en") {
  return immersiveEngineStack.map((item) => localizeImmersiveEngineItem(item, locale));
}

export function getLocalizedImmersiveApplicationLayer(locale: "en" | "es" = "en") {
  return locale === "es" ? spanishImmersiveApplicationLayer : immersiveApplicationLayer;
}

export function getImmersiveChamber(id: ImmersiveChamberId, locale: "en" | "es" = "en") {
  const source = immersiveChambers.find((item) => item.id === id) ?? immersiveChambers[0];
  return localizeImmersiveSystemItem(source, locale);
}

export function getChamberEngines(id: ImmersiveChamberId, locale: "en" | "es" = "en") {
  return immersiveEngineStack
    .filter((engine) => engine.chamberIds.includes(id))
    .map((engine) => localizeImmersiveEngineItem(engine, locale));
}
