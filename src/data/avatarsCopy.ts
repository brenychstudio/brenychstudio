import type { AvatarLocale } from "./avatarProfiles";

// AI Digital Humans page copy (AVATARS-01, owner copy contract ROUTES-COPY-AND-METADATA). Every capability is labelled by
// its real state: current visual concepts, a private studio prototype, R&D, or coming soon. No live-agent, pricing,
// date or client claims.

type Level = { index: string; name: string; state: string; body: string; points?: readonly string[]; note?: string };
type Role = { name: string; body: string };

export type AvatarsCopy = {
  eyebrow: string;
  title: string;
  supporting: string;
  body: string;
  exploreCast: string;
  discuss: string;
  disclaimer: string;
  releaseDisclaimer: string;
  cast: {
    label: string;
    heading: string;
    caption: string;
    tablist: string;
    viewIdentity: string;
    next: string;
    previous: string;
    status: string;
    /** Status of a character whose recorded introduction exists in this build (private pilot). */
    statusPilot: string;
    statusRecorded: string;
    statusPartial: string;
    nowPresenting: string;
    nameLabel: string;
    /** Marks a stage name that is a proposal awaiting the owner's choice. */
    provisional: string;
    roleLabel: string;
    scenarioLabel: string;
    statusLabel: string;
    disclosure: string;
    portraitAlt: string;
    action: string;
  };
  /** The stage's recorded-introduction controls (AVATARS-02). Shown only where a real clip exists. */
  presence: {
    groupLabel: string;
    play: string;
    replay: string;
    pause: string;
    resume: string;
    stop: string;
    mute: string;
    unmute: string;
    loading: string;
    recorded: string;
    unavailable: string;
    concept: string;
    error: string;
    retry: string;
  };
  /** The cast library (AVATARS-02): editorial discovery of the eight identities. */
  library: { label: string; heading: string; lede: string; note: string; onStage: string; show: string; statusConcept: string; statusPilot: string; statusRecorded: string; statusUnavailable: string };
  ledger: { label: string; heading: string; lede: string; levels: readonly Level[]; horizonLink: string };
  performance: { label: string; heading: string; body: string; facts: readonly {label:string;value:string}[]; note: string; castLink: string; currentNote: string };
  roles: { label: string; heading: string; note: string; items: readonly Role[] };
  horizon: {
    label: string;
    heading: string;
    line: string;
    body: string;
    flag: string;
    frontier: string;
    technology: string;
    figureNote: string;
    figureLabel: string;
  };
  closing: { label: string; heading: string; body: string; cta: string };
};

export const avatarsCopy: Record<AvatarLocale, AvatarsCopy> = {
  en: {
    eyebrow: "Brenych Studio / Digital Presence",
    title: "AI Digital Humans.",
    supporting: "A human presence for your digital business.",
    body: "We design expressive digital representatives that can introduce your work, guide visitors and turn a website into a more personal experience.",
    exploreCast: "Explore the cast",
    discuss: "Discuss a project",
    disclaimer: "Digital character concepts. Interactive speaking demos are in development.",
    releaseDisclaimer: "AI-generated characters. Play their recorded introductions in English or Spanish. Not a live conversation.",
    cast: {
      label: "01 / Cinematic Presence",
      heading: "Eight identities. One adaptable presence system.",
      caption: "Choose a character to explore a visual identity and its potential role. The selection below is an interactive presentation—not a live conversation.",
      tablist: "Cast of digital characters",
      viewIdentity: "View identity",
      next: "Next character",
      previous: "Previous character",
      status: "Character concept · Motion preview in development",
      statusPilot: "Private pilot · Recorded AI sample",
      statusRecorded: "Recorded AI introduction · EN / ES",
      statusPartial: "Private motion preview · Audio unavailable in this language",
      nowPresenting: "Now presenting",
      nameLabel: "Name",
      provisional: "working name",
      roleLabel: "Working role",
      scenarioLabel: "Possible application",
      statusLabel: "Status",
      disclosure: "Digitally generated presenter concept. Not a live agent.",
      portraitAlt: "Digitally generated presenter concept",
      action: "Discuss a project like this",
    },
    presence: {
      groupLabel: "Recorded AI introduction",
      play: "Play introduction",
      replay: "Replay",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      mute: "Mute",
      unmute: "Unmute",
      loading: "Loading…",
      recorded: "Recorded AI",
      unavailable: "Audio sample not available in this language",
      concept: "Character concept · Motion preview in development",
      error: "The recording could not be played.",
      retry: "Try again",
    },
    library: {
      label: "Cast index",
      heading: "The Cast.",
      lede: "Eight identities. Different roles. One direction: meaningful digital presence.",
      note: "Every character is AI-generated. Names are working proposals and may change.",
      onStage: "On stage",
      show: "Show on stage",
      statusConcept: "Character concept",
      statusPilot: "Provisional AI sample",
      statusRecorded: "Recorded introduction · EN / ES",
      statusUnavailable: "Audio unavailable in this language",
    },
    ledger: {
      label: "Technology",
      heading: "Beyond the portrait.",
      lede: "A presence is more than a face: what it says is prepared, and what it does on the site can be checked.",
      levels: [
        {
          index: "01",
          name: "Cinematic Presence",
          state: "Current technology",
          body: "Portrait-led presenters with prepared answers that guide a visitor through a website.",
          points: ["Curated answers", "Website guidance", "Verified actions"],
          note: "Explore the scripted text tour on our homepage. Recorded speaking demos remain in private review; these character concepts are not live agents.",
        },
        {
          index: "—",
          name: "Conversational Presence",
          state: "R&D · selective pilot",
          body: "Grounded questions and voice, explored in private studio labs. Not offered as a live service.",
        },
        {
          index: "02",
          name: "Spatial Digital Humans",
          state: "Coming soon · in development",
          body: "Fully 3D characters built with Unreal Engine and MetaHuman technology.",
        },
      ],
      horizonLink: "What comes next",
    },
    performance: {
      label: "In performance / Aria",
      heading: "A voice. An expression. A presence.",
      body: "Watch a complete introduction with its own voice, facial movement and captions. Switch the site language to hear the same character speak Spanish.",
      facts: [{label:"Cast",value:"8 distinct identities"},{label:"Languages",value:"English / Español"},{label:"Format",value:"Recorded performance"}],
      note: "This is a recorded introduction. Conversational AI is a separate private studio pilot.",
      castLink: "Meet",
      currentNote: "Explore the recorded introductions on this page. Each language has its own speaking performance and captions.",
    },
    roles: {
      label: "Applications",
      heading: "Designed around a real role.",
      note: "Possible applications. Illustrative, not client projects.",
      items: [
        { name: "Hospitality", body: "A host that introduces rooms, services and the places around them." },
        { name: "Real Estate", body: "A guide that walks buyers through a property and its surroundings." },
        { name: "Premium Services", body: "A consistent, personal introduction to a high-value service." },
        { name: "Product Experiences", body: "A presenter that demonstrates a product and points to the right next step." },
      ],
    },
    horizon: {
      label: "02 / Next Generation",
      heading: "Spatial Digital Humans.",
      line: "Full 3D experiences, built with Unreal Engine and MetaHuman technology.",
      body: "The next step brings a character into a scene: a body, a sense of scale and a response to the space around them. This work is still in development.",
      flag: "Coming soon · In development",
      frontier: "Research direction: embodied characters, spatial interaction and scene-aware presentation.",
      technology: "Unreal Engine · MetaHuman development in progress",
      figureNote: "An abstract diagram, not a render. There is no public 3D demonstrator yet.",
      figureLabel: "Abstract diagram: projection lines and depth planes around a head outline",
    },
    closing: {
      label: "Next step",
      heading: "Give your brand a presence of its own.",
      body: "Who should your character help, in which languages, and what should they do? Let’s define a role and a first demonstration worth seeing.",
      cta: "Discuss your avatar project",
    },
  },
  es: {
    eyebrow: "Brenych Studio / Presencia digital",
    title: "Humanos digitales con IA.",
    supporting: "Una presencia humana para tu negocio digital.",
    body: "Diseñamos representantes digitales que presentan proyectos, orientan a los visitantes y convierten una web en una experiencia más personal.",
    exploreCast: "Explorar personajes",
    discuss: "Hablemos de un proyecto",
    disclaimer: "Conceptos de personajes digitales. Las demos de conversación animada están en desarrollo.",
    releaseDisclaimer: "Personajes generados con IA. Reproduce sus presentaciones grabadas en inglés o español. No es una conversación en directo.",
    cast: {
      label: "01 / Presencia cinematográfica",
      heading: "Ocho identidades. Un sistema de presencia adaptable.",
      caption: "Elige un personaje para conocer su identidad visual y una posible aplicación. Es una presentación interactiva, no una conversación en directo.",
      tablist: "Reparto de personajes digitales",
      viewIdentity: "Ver identidad",
      next: "Siguiente personaje",
      previous: "Personaje anterior",
      status: "Concepto de personaje · Vista en movimiento en desarrollo",
      statusPilot: "Piloto privado · Muestra de IA pregrabada",
      statusRecorded: "Presentación de IA grabada · EN / ES",
      statusPartial: "Vista de movimiento privada · Audio no disponible en este idioma",
      nowPresenting: "En escena",
      nameLabel: "Nombre",
      provisional: "nombre provisional",
      roleLabel: "Rol provisional",
      scenarioLabel: "Posible aplicación",
      statusLabel: "Estado",
      disclosure: "Concepto de presentador generado digitalmente. No es un agente en directo.",
      portraitAlt: "Concepto de presentador generado digitalmente",
      action: "Hablemos de un proyecto así",
    },
    presence: {
      groupLabel: "Presentación de IA pregrabada",
      play: "Reproducir presentación",
      replay: "Repetir",
      pause: "Pausa",
      resume: "Continuar",
      stop: "Detener",
      mute: "Silenciar",
      unmute: "Activar sonido",
      loading: "Cargando…",
      recorded: "IA pregrabada",
      unavailable: "Audio no disponible en este idioma",
      concept: "Concepto de personaje · Vista en movimiento en desarrollo",
      error: "No se pudo reproducir la grabación.",
      retry: "Reintentar",
    },
    library: {
      label: "Índice del elenco",
      heading: "El elenco.",
      lede: "Ocho identidades. Roles distintos. Una dirección: una presencia digital con sentido.",
      note: "Todos los personajes están generados con IA. Los nombres son propuestas de trabajo y pueden cambiar.",
      onStage: "En escena",
      show: "Ver en escena",
      statusConcept: "Concepto de personaje",
      statusPilot: "Muestra de IA provisional",
      statusRecorded: "Presentación grabada · EN / ES",
      statusUnavailable: "Audio no disponible en este idioma",
    },
    ledger: {
      label: "Tecnología",
      heading: "Más allá del retrato.",
      lede: "Una presencia es más que un rostro: lo que dice está preparado y lo que hace en la web se puede comprobar.",
      levels: [
        {
          index: "01",
          name: "Presencia cinematográfica",
          state: "Tecnología actual",
          body: "Presentadores basados en retratos, con respuestas preparadas, que guían al visitante por una web.",
          points: ["Respuestas preparadas", "Navegación guiada", "Acciones verificadas"],
          note: "Explora el recorrido de texto predefinido en nuestra página de inicio. Las muestras de voz grabada siguen en revisión privada; estos conceptos de personaje no son agentes en directo.",
        },
        {
          index: "—",
          name: "Presencia conversacional",
          state: "I+D · piloto selectivo",
          body: "Preguntas fundamentadas y voz, exploradas en laboratorios privados del estudio. No se ofrece como servicio en directo.",
        },
        {
          index: "02",
          name: "Humanos digitales espaciales",
          state: "Próximamente · en desarrollo",
          body: "Personajes totalmente 3D creados con Unreal Engine y tecnología MetaHuman.",
        },
      ],
      horizonLink: "Lo que viene",
    },
    performance: {
      label: "En escena / Aria",
      heading: "Una voz. Un gesto. Una presencia.",
      body: "Mira una presentación completa con voz propia, movimiento facial y subtítulos. Cambia el idioma de la web para escuchar al mismo personaje en inglés.",
      facts: [{label:"Reparto",value:"8 identidades distintas"},{label:"Idiomas",value:"English / Español"},{label:"Formato",value:"Interpretación grabada"}],
      note: "Es una presentación grabada. La IA conversacional es un piloto privado independiente del estudio.",
      castLink: "Conoce a",
      currentNote: "Explora las presentaciones grabadas de esta página. Cada idioma tiene su propia interpretación y subtítulos.",
    },
    roles: {
      label: "Aplicaciones",
      heading: "Diseñados para una función real.",
      note: "Posibles aplicaciones. Ilustrativas, no son proyectos de clientes.",
      items: [
        { name: "Hostelería", body: "Una bienvenida que presenta habitaciones, servicios y el entorno." },
        { name: "Inmobiliaria", body: "Una guía que acompaña a quien compra por una propiedad y su entorno." },
        { name: "Servicios premium", body: "Una presentación coherente y personal de un servicio de alto valor." },
        { name: "Experiencias de producto", body: "Una presentación que muestra un producto y señala el siguiente paso adecuado." },
      ],
    },
    horizon: {
      label: "02 / Próxima generación",
      heading: "Humanos digitales espaciales.",
      line: "Experiencias totalmente 3D con Unreal Engine y tecnología MetaHuman.",
      body: "El siguiente paso sitúa al personaje en una escena: un cuerpo, una escala y una respuesta al espacio que lo rodea. Este trabajo sigue en desarrollo.",
      flag: "Próximamente · En desarrollo",
      frontier: "Línea de investigación: personajes con cuerpo, interacción espacial y presentaciones que responden al entorno.",
      technology: "Desarrollo con Unreal Engine · MetaHuman en curso",
      figureNote: "Un diagrama abstracto, no un render. Aún no hay un demostrador 3D público.",
      figureLabel: "Diagrama abstracto: líneas de proyección y planos de profundidad alrededor del contorno de una cabeza",
    },
    closing: {
      label: "Siguiente paso",
      heading: "Da a tu marca una presencia propia.",
      body: "¿A quién debe ayudar tu personaje, en qué idiomas y qué debería hacer? Definamos su función y una primera demostración que merezca verse.",
      cta: "Hablemos de tu avatar",
    },
  },
};
