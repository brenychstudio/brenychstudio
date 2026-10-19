/**
 * Games catalog (SITE-GAMES-01): the studio's four original games in development, owner-fixed set and order.
 * Every statement here is backed by the project's own evidence (inventory and provenance receipts live in the ignored QA
 * folder). Each image is labelled by what it actually is; concept art and AI-generated material are not used as proof.
 * No release dates, platforms, prices, team sizes or public demos are stated unless they exist.
 */

export type GameLocale = "en" | "es";
type Localized = Record<GameLocale, string>;
type LocalizedList = Record<GameLocale, string[]>;

/** What an image actually is. */
export type GameMediaKind = "gameplay-capture" | "prototype-capture" | "realtime-render" | "offline-render" | "concept";

/** The strongest proof that exists for the game today. */
export type GameProofLevel = "public-demo" | "prototype" | "render";

export type GameMedia = {
  id: string;
  /** Base path without the width suffix: `${base}-${width}.webp`. */
  base: string;
  widths: number[];
  width: number;
  height: number;
  kind: GameMediaKind;
  orientation: "landscape" | "portrait";
  caption: Localized;
  alt: Localized;
};

export type GameFact = { label: Localized; value: Localized };

export type GameEntry = {
  slug: "project-territories" | "black-start" | "project-mars-2158" | "shift-world";
  index: string;
  /** Small line above the title (e.g. PROJECT); empty when the title stands alone. */
  titlePrefix: string;
  titleMain: string;
  /** The title as one string, for metadata and accessible names. */
  title: string;
  genre: Localized;
  premise: Localized;
  engine: Localized;
  stage: Localized;
  proof: GameProofLevel;
  facts: GameFact[];
  inBuild: LocalizedList;
  planned: LocalizedList;
  media: GameMedia[];
  demo?: { href: string; label: Localized };
  /** Accent used by the stage light; a quiet hue taken from the hero frame. */
  accent: string;
};

const notAnnounced: GameFact = {
  label: { en: "Release", es: "Lanzamiento" },
  value: { en: "Not announced", es: "Sin anunciar" },
};

const noPublicDemo: GameFact = {
  label: { en: "Public demo", es: "Demo pública" },
  value: { en: "Not available", es: "No disponible" },
};

export const games: readonly GameEntry[] = [
  {
    slug: "black-start",
    index: "01",
    titlePrefix: "",
    titleMain: "BLACK START",
    title: "BLACK START",
    genre: { en: "Near-future action-adventure", es: "Acción y aventura en un futuro cercano" },
    premise: {
      en: "A crew and their shared recovery vehicle bring essential services back to communities after a collapse.",
      es: "Una tripulación y su vehículo de recuperación devuelven servicios esenciales a las comunidades tras un colapso.",
    },
    engine: { en: "Blender production · WebGPU presentation", es: "Producción en Blender · presentación WebGPU" },
    stage: { en: "Pre-production · first environment frozen", es: "Preproducción · primer entorno cerrado" },
    proof: "render",
    facts: [
      { label: { en: "Production", es: "Producción" }, value: { en: "The first 3D environment, the Garage, is frozen by the studio", es: "El primer entorno 3D, el Garaje, está cerrado por el estudio" } },
      { label: { en: "Runtime", es: "Runtime" }, value: { en: "A WebGPU runtime presents the scene from fixed cameras, with no player control", es: "Un runtime WebGPU presenta la escena desde cámaras fijas, sin control del jugador" } },
      { label: { en: "Gameplay", es: "Jugabilidad" }, value: { en: "Not built yet: the first playable proof has not started", es: "Aún no construida: la primera prueba jugable no ha empezado" } },
      noPublicDemo,
      notAnnounced,
    ],
    inBuild: {
      en: ["The Garage, a finished 3D production environment", "The recovery vehicle", "A real-time browser presentation of the scene"],
      es: ["El Garaje, un entorno 3D de producción terminado", "El vehículo de recuperación", "Una presentación de la escena en tiempo real en el navegador"],
    },
    planned: {
      en: ["First- and third-person play", "Crew co-op as a design target", "The first playable proof"],
      es: ["Juego en primera y tercera persona", "Cooperativo de tripulación como objetivo de diseño", "La primera prueba jugable"],
    },
    media: [
      {
        id: "garage-render",
        base: "/games/black-start/garage-render",
        widths: [1200, 2400],
        width: 2400,
        height: 1683,
        kind: "offline-render",
        orientation: "landscape",
        caption: {
          en: "The Garage, rendered offline from the frozen production scene. A render, not gameplay.",
          es: "El Garaje, renderizado offline desde la escena de producción cerrada. Un render, no gameplay.",
        },
        alt: {
          en: "A heavy eight-wheeled recovery truck inside a dark industrial garage, a rainy city skyline beyond the open bay",
          es: "Un pesado camión de recuperación de ocho ruedas en un garaje industrial oscuro, con una ciudad lluviosa tras el portón abierto",
        },
      },
      {
        id: "garage-realtime",
        base: "/games/black-start/garage-realtime",
        widths: [800, 1540],
        width: 1540,
        height: 1080,
        kind: "realtime-render",
        orientation: "landscape",
        caption: {
          en: "The same scene rendered in real time in the browser with WebGPU, from a fixed camera. Not gameplay.",
          es: "La misma escena renderizada en tiempo real en el navegador con WebGPU, desde una cámara fija. No es gameplay.",
        },
        alt: {
          en: "The recovery truck in the garage, rendered in real time in a web browser",
          es: "El camión de recuperación en el garaje, renderizado en tiempo real en un navegador",
        },
      },
    ],
    accent: "#c9a14a",
  },
  {
    slug: "project-mars-2158",
    index: "02",
    titlePrefix: "PROJECT",
    titleMain: "MARS 2158",
    title: "PROJECT MARS 2158",
    genre: { en: "Hard-sci-fi strategy with direct control", es: "Estrategia de ciencia ficción dura con control directo" },
    premise: {
      en: "Mars, 2158: the colonisation of the planet escalates into a war between factions, commanded as real-time strategy with optional first- and third-person control.",
      es: "Marte, 2158: la colonización del planeta deriva en una guerra entre facciones, dirigida como estrategia en tiempo real con control opcional en primera y tercera persona.",
    },
    engine: { en: "Unreal Engine 5.8", es: "Unreal Engine 5.8" },
    stage: { en: "Playable prototype in the editor · private", es: "Prototipo jugable en el editor · privado" },
    proof: "prototype",
    facts: [
      { label: { en: "Engine", es: "Motor" }, value: { en: "Unreal Engine 5.8, C++", es: "Unreal Engine 5.8, C++" } },
      { label: { en: "Build", es: "Build" }, value: { en: "Editor prototype: one map playable in first and third person, with a switch to the strategy view and AI opponents", es: "Prototipo en el editor: un mapa jugable en primera y tercera persona, con paso a la vista estratégica y rivales con IA" } },
      { label: { en: "World art", es: "Arte del mundo" }, value: { en: "In progress: the current environment is not final", es: "En curso: el entorno actual no es definitivo" } },
      noPublicDemo,
      notAnnounced,
    ],
    inBuild: {
      en: ["First- and third-person movement and combat", "Switching to the strategy view and back", "Armed AI opponents in a training sandbox"],
      es: ["Movimiento y combate en primera y tercera persona", "Paso a la vista estratégica y vuelta", "Rivales armados con IA en un entorno de entrenamiento"],
    },
    planned: {
      en: ["Final world and environment art", "Campaign content", "A packaged playable build"],
      es: ["Arte final del mundo y del entorno", "Contenido de campaña", "Una build jugable empaquetada"],
    },
    media: [
      {
        id: "tps-prototype",
        base: "/games/project-mars-2158/tps-prototype",
        widths: [800, 1369],
        width: 1369,
        height: 770,
        kind: "prototype-capture",
        orientation: "landscape",
        caption: {
          en: "Captured from the playable prototype in Unreal Engine 5.8: third person, placeholder character, environment not final.",
          es: "Captura del prototipo jugable en Unreal Engine 5.8: tercera persona, personaje provisional, entorno no definitivo.",
        },
        alt: {
          en: "A character in a white suit on red Martian sand, an industrial base and rock cliffs in the distance",
          es: "Un personaje con traje blanco sobre arena roja marciana, con una base industrial y acantilados al fondo",
        },
      },
      {
        id: "world-engine-still",
        base: "/games/project-mars-2158/world-engine-still",
        widths: [800, 1600],
        width: 1600,
        height: 900,
        kind: "realtime-render",
        orientation: "landscape",
        caption: {
          en: "An in-engine camera still of the world in progress. Not final art.",
          es: "Un fotograma del mundo en desarrollo, tomado con una cámara dentro del motor. No es arte final.",
        },
        alt: {
          en: "A wide Martian canyon with dunes and a grey placeholder base, rendered in Unreal Engine",
          es: "Un amplio cañón marciano con dunas y una base provisional gris, renderizado en Unreal Engine",
        },
      },
    ],
    accent: "#c27a4e",
  },
  {
    slug: "shift-world",
    index: "03",
    titlePrefix: "",
    titleMain: "SHIFT WORLD",
    title: "SHIFT WORLD",
    genre: { en: "Sci-fi exploration and flight", es: "Exploración y vuelo de ciencia ficción" },
    premise: {
      en: "A pilot crosses floating sky ruins as a World Shift transforms the course ahead.",
      es: "Un piloto atraviesa ruinas flotantes en el cielo mientras un World Shift transforma el recorrido.",
    },
    engine: { en: "Unity 6", es: "Unity 6" },
    stage: { en: "Public web demo · vertical slice in development", es: "Demo web pública · vertical slice en desarrollo" },
    proof: "public-demo",
    facts: [
      { label: { en: "Engine", es: "Motor" }, value: { en: "Unity 6 (URP), web build", es: "Unity 6 (URP), build web" } },
      { label: { en: "Public demo", es: "Demo pública" }, value: { en: "A 75-second portrait flight demo, built during a hackathon in Barcelona in 2026", es: "Una demo de vuelo de 75 segundos en formato vertical, creada durante un hackathon en Barcelona en 2026" } },
      { label: { en: "In development", es: "En desarrollo" }, value: { en: "First Signal, a private playable vertical slice of the larger exploration game", es: "First Signal, un vertical slice jugable y privado del juego de exploración" } },
      { label: { en: "Release", es: "Lanzamiento" }, value: { en: "The full game is not announced", es: "El juego completo no está anunciado" } },
    ],
    inBuild: {
      en: ["A public 75-second flight demo that runs in the browser", "First Signal: a private, playable vertical slice", "The World Shift: the course transforms mid-run"],
      es: ["Una demo de vuelo pública de 75 segundos que funciona en el navegador", "First Signal: un vertical slice privado y jugable", "El World Shift: el recorrido se transforma durante la partida"],
    },
    planned: {
      en: ["The hero ship in the game", "Native platforms, proposed", "VR as a future direction"],
      es: ["La nave principal en el juego", "Plataformas nativas, propuestas", "RV como dirección futura"],
    },
    media: [
      {
        id: "first-signal-prototype",
        base: "/games/shift-world/first-signal-prototype",
        widths: [800, 1385],
        width: 1385,
        height: 900,
        kind: "prototype-capture",
        orientation: "landscape",
        caption: {
          en: "First Signal, the vertical slice in development, captured in the Unity editor.",
          es: "First Signal, el vertical slice en desarrollo, capturado en el editor de Unity.",
        },
        alt: {
          en: "A small craft hovering among floating stone ruins with glowing cyan lines, above a sea of clouds",
          es: "Una pequeña nave flotando entre ruinas de piedra con líneas cian luminosas, sobre un mar de nubes",
        },
      },
      {
        id: "web-demo-flight",
        base: "/games/shift-world/web-demo-flight",
        widths: [720],
        width: 720,
        height: 1235,
        kind: "gameplay-capture",
        orientation: "portrait",
        caption: { en: "The public web demo, captured in the browser.", es: "La demo web pública, capturada en el navegador." },
        alt: {
          en: "Portrait view of the craft flying towards a floating stone arch in a pale sky",
          es: "Captura en formato vertical: la nave vuela hacia un arco de piedra flotante en un cielo pálido",
        },
      },
      {
        id: "web-demo-shift",
        base: "/games/shift-world/web-demo-shift",
        widths: [720],
        width: 720,
        height: 1235,
        kind: "gameplay-capture",
        orientation: "portrait",
        caption: { en: "The same run after the World Shift.", es: "La misma partida después del World Shift." },
        alt: {
          en: "Portrait view of the craft between orange stone ruins under a dark eclipsed sun",
          es: "Captura en formato vertical: la nave entre ruinas de piedra naranja bajo un sol eclipsado",
        },
      },
    ],
    demo: {
      href: "https://shift-world-smoke-staging-20261008-r02.netlify.app/",
      label: { en: "Play the web demo", es: "Jugar la demo web" },
    },
    accent: "#5fb3c9",
  },
  {
    slug: "project-territories",
    index: "04",
    titlePrefix: "PROJECT",
    titleMain: "TERRITORIES",
    title: "PROJECT TERRITORIES",
    genre: {
      en: "Combined-arms real-time strategy with direct control",
      es: "Estrategia en tiempo real de armas combinadas con control directo",
    },
    premise: {
      en: "A grounded post-future RTS where territory, infrastructure, information and direct control shape the battlefield.",
      es: "Un RTS post-futuro y realista en el que el territorio, la infraestructura, la información y el control directo dan forma al campo de batalla.",
    },
    engine: { en: "WebGPU in the browser", es: "WebGPU en el navegador" },
    stage: { en: "Playable prototype · private", es: "Prototipo jugable · privado" },
    proof: "prototype",
    facts: [
      { label: { en: "Engine", es: "Motor" }, value: { en: "WebGPU in the browser (Three.js renderer), simulation in a worker", es: "WebGPU en el navegador (renderizador Three.js), simulación en un worker" } },
      { label: { en: "Build", es: "Build" }, value: { en: "Private development build: a first battle loop runs against a bot", es: "Build privada de desarrollo: un primer ciclo de batalla funciona contra un bot" } },
      noPublicDemo,
      notAnnounced,
    ],
    inBuild: {
      en: [
        "A WebGPU runtime in the browser with a fixed-rate simulation",
        "A first battle loop: deployment, advance, contact, firefight, victory or defeat",
        "Switching from the strategic view to first- or third-person control of a unit",
      ],
      es: [
        "Un runtime WebGPU en el navegador con simulación a ritmo fijo",
        "Un primer ciclo de batalla: despliegue, avance, contacto, combate, victoria o derrota",
        "Paso de la vista estratégica al control de una unidad en primera o tercera persona",
      ],
    },
    planned: {
      en: ["Fog of war", "The production interface", "A public playable release"],
      es: ["Niebla de guerra", "La interfaz de producción", "Una versión jugable pública"],
    },
    media: [
      {
        id: "vr6-realtime",
        base: "/games/project-territories/vr6-realtime",
        widths: [800, 1140],
        width: 1140,
        height: 630,
        kind: "realtime-render",
        orientation: "landscape",
        caption: {
          en: "A production vehicle rendered in real time with WebGPU in a showcase scene. Not gameplay.",
          es: "Un vehículo de producción renderizado en tiempo real con WebGPU en una escena de presentación. No es gameplay.",
        },
        alt: {
          en: "An eight-wheeled armoured vehicle with a turret parked among concrete buildings, rendered in real time",
          es: "Un vehículo blindado de ocho ruedas con torreta aparcado entre edificios de hormigón, renderizado en tiempo real",
        },
      },
      {
        id: "battle-prototype",
        base: "/games/project-territories/battle-prototype",
        widths: [800, 1600],
        width: 1600,
        height: 1192,
        kind: "prototype-capture",
        orientation: "landscape",
        caption: {
          en: "The development build in the browser: a battle in progress from the strategic view. Debug panels removed from the frame.",
          es: "La build de desarrollo en el navegador: una batalla en curso desde la vista estratégica. Paneles de depuración fuera del encuadre.",
        },
        alt: {
          en: "Top-down view of residential blocks, roads and vehicles in a real-time strategy battle",
          es: "Vista cenital de bloques residenciales, calles y vehículos en una batalla de estrategia en tiempo real",
        },
      },
    ],
    accent: "#8a9a7c",
  },
];

export const gameMediaKindLabel: Record<GameMediaKind, Localized> = {
  "gameplay-capture": { en: "Gameplay capture", es: "Captura de juego" },
  "prototype-capture": { en: "Prototype capture", es: "Captura de prototipo" },
  "realtime-render": { en: "Real-time render", es: "Render en tiempo real" },
  "offline-render": { en: "Offline render", es: "Render offline" },
  concept: { en: "Concept", es: "Concepto" },
};

export const gameProofLabel: Record<GameProofLevel, Localized> = {
  "public-demo": { en: "Public demo", es: "Demo pública" },
  prototype: { en: "Playable prototype", es: "Prototipo jugable" },
  render: { en: "Production renders", es: "Renders de producción" },
};

export const gamesCopy = {
  en: {
    eyebrow: "Games",
    title: "Four original worlds in development.",
    lede: "Games the studio is building, each shown with what exists today.",
    selector: "Select a game",
    engine: "Engine",
    stage: "Stage",
    shown: "Shown here",
    file: "Production file",
    fileLead: "What is real now, and what is still planned.",
    inBuild: "Exists now",
    planned: "Planned, not built yet",
    media: "Evidence",
    standardEyebrow: "Proof standard",
    standardTitle: "How to read this page.",
    standardBody: "Every image is labelled by what it actually is. Concept art exists for each of these worlds; it is not shown here as proof.",
    standardNote: "No release dates, platforms or prices are listed until they exist.",
    legend: {
      "gameplay-capture": "Captured from a playable build while it runs.",
      "prototype-capture": "Captured from a development build. Interface and art are not final.",
      "realtime-render": "Rendered live by the game's engine or browser runtime. Not gameplay.",
      "offline-render": "Rendered from production 3D assets outside the game. Not gameplay.",
      concept: "Visual direction made before or beside production. Not shown on this page.",
    } satisfies Record<GameMediaKind, string>,
    closingTitle: "Building a world of your own?",
    closingBody: "Game systems, real-time worlds and interactive prototypes are part of the studio's practice.",
    closingCta: "Start a project",
    external: "external site",
  },
  es: {
    eyebrow: "Juegos",
    title: "Cuatro mundos originales en desarrollo.",
    lede: "Juegos que el estudio está construyendo, cada uno con lo que existe hoy.",
    selector: "Selecciona un juego",
    engine: "Motor",
    stage: "Fase",
    shown: "Aquí se muestra",
    file: "Ficha de producción",
    fileLead: "Lo que ya es real y lo que sigue planificado.",
    inBuild: "Ya existe",
    planned: "Planificado, aún no construido",
    media: "Evidencia",
    standardEyebrow: "Estándar de prueba",
    standardTitle: "Cómo leer esta página.",
    standardBody: "Cada imagen indica lo que es en realidad. Existe arte conceptual de cada uno de estos mundos; aquí no se muestra como prueba.",
    standardNote: "No se indican fechas de lanzamiento, plataformas ni precios hasta que existan.",
    legend: {
      "gameplay-capture": "Capturada desde una build jugable mientras se ejecuta.",
      "prototype-capture": "Capturada desde una build de desarrollo. La interfaz y el arte no son definitivos.",
      "realtime-render": "Renderizado en directo por el motor del juego o su runtime web. No es gameplay.",
      "offline-render": "Renderizado desde los assets 3D de producción, fuera del juego. No es gameplay.",
      concept: "Dirección visual creada antes o junto a la producción. No se muestra en esta página.",
    } satisfies Record<GameMediaKind, string>,
    closingTitle: "¿Construyes un mundo propio?",
    closingBody: "Los sistemas de juego, los mundos en tiempo real y los prototipos interactivos forman parte de la práctica del estudio.",
    closingCta: "Iniciar proyecto",
    external: "sitio externo",
  },
} as const;
