import type { SeoDraft } from "../i18n/types";

export type ServicePageTranslation = {
  title: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  heroTitle: string;
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  routeTitle: string;
  routeDefinition: string;
  routeLedger: Array<{
    title: string;
    text: string;
  }>;
  methodTitle: string;
  bestFor: string[];
  method: Array<{
    title: string;
    text: string;
  }>;
  proof: Array<{
    label: string;
    role: string;
    claim: string;
  }>;
  proofStatement: string;
  deliverables: string[];
  closingTitle: string;
  closingBody: string;
  schemaName: string;
};

export type CaseRegistryTranslation = {
  shortDescription: string;
  longDescription: string;
  tags: string[];
  ctaLabel: string;
  alt: string;
  clientType?: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  searchContent?: {
    type: string;
    audience: string;
    problem: string;
    approach: string;
    outcome: string;
    productionFacts: string[];
    relatedServices: string[];
  };
};

export type CaseStoryTranslation = {
  label: string;
  headline: string;
  subheadline: string;
  summary: string;
  proofClaim: string;
  evidencePoints: string[];
  systemTags: string[];
  systemLayers: Array<{
    title: string;
    text: string;
  }>;
  mediaSequence: Array<{
    id: string;
    alt: string;
    label: string;
    caption: string;
  }>;
  interactionLogic: string;
  commercialLogic: string;
  technicalFoundation: string[];
  availability?: {
    label: string;
    summary: string;
    bestFor?: string[];
    adaptationIncludes?: string[];
    licensingNote?: string;
    ctaLabel: string;
  };
  links?: Array<{
    label: string;
    href: string;
  }>;
  seo: SeoDraft;
};

export type ImmersiveTranslation = {
  tagline: string;
  medium: string;
  mode: string;
  stack: string;
  description: string;
  status: string;
  statusNote?: string;
  supportLabel?: string;
  ctaLabel?: string;
  searchContent: {
    shortDescription: string;
    longDescription: string;
    tags: string[];
    type: string;
    audience: string;
    problem: string;
    approach: string;
    outcome: string;
    productionFacts: string[];
    relatedServices: string[];
  };
  videos?: Array<{
    index: number;
    alt: string;
    label: string;
    caption: string;
  }>;
  frames?: Array<{
    index: number;
    alt: string;
    label: string;
    caption: string;
  }>;
  seo: SeoDraft;
};

export type CorePageTranslation = {
  route: string;
  title: string;
  eyebrow?: string;
  body: string;
  ctas?: string[];
  labels?: Record<string, string>;
  notes?: string[];
  seo: SeoDraft;
};

export type WorkEvidenceTranslation = {
  proofLabel: string;
  proofSummary: string;
  systemTags: string[];
  workType: string;
  capability: string;
  layers: string[];
  proofPoints: string[];
};

export const spanishPageSeoDrafts: Record<string, SeoDraft> = {
  "/": {
    title: "Brenych Studio - sistemas front-end premium",
    description:
      "Sistemas front-end premium, sitios web de producto e interfaces inmersivas para proyectos que necesitan claridad, presencia y prueba real.",
    ogTitle: "Brenych Studio - sistemas front-end premium",
    ogDescription:
      "Sistemas de interfaz, superficies de producto y experiencias web inmersivas construidas con dirección editorial y front-end listo para producción.",
  },
  "/work": {
    title: "Proyectos seleccionados - Brenych Studio",
    description:
      "Archivo de proyectos con casos reales: sistemas de producto, sitios premium, herramientas de flujo de trabajo e interfaces web interactivas.",
    ogTitle: "Proyectos seleccionados - Brenych Studio",
    ogDescription:
      "Casos reales y pruebas de sistemas front-end premium, desde CreatorOps hasta House of Lune y Barcelona Private Advisory.",
  },
  "/offer": {
    title: "Servicios de interfaz premium - Brenych Studio",
    description:
      "Landing pages premium, demos de producto y sistemas web interactivos para ofertas, productos y experiencias digitales con prueba visual.",
    ogTitle: "Servicios de interfaz premium - Brenych Studio",
    ogDescription:
      "Tres rutas de entrada comercial: landing pages premium, landing pages de producto y sistemas web interactivos.",
  },
  "/about": {
    title: "Estudio - Brenych Studio",
    description:
      "Brenych Studio trabaja entre ingeniería front-end, dirección visual, fotografía, medios cinematográficos e investigación de interfaz.",
    ogTitle: "Estudio - Brenych Studio",
    ogDescription:
      "Una práctica independiente para sistemas front-end premium, superficies de producto y experiencias digitales precisas.",
  },
  "/immersive": {
    title: "Sistemas de interfaz inmersiva - Brenych Studio",
    description:
      "Hub de sistemas inmersivos: archivos espaciales, pruebas WebGL, presentaciones cinematográficas y capas web / XR para proyectos premium.",
    ogTitle: "Sistemas de interfaz inmersiva",
    ogDescription:
      "WHISPER, WEBHERO y futuros chambers como pruebas de interfaz espacial, archivo vivo y presentación inmersiva.",
  },
};

export const spanishCorePageContent: Record<"home" | "work" | "offer" | "about" | "immersive", CorePageTranslation> = {
  home: {
    route: "/",
    eyebrow: "Studio signal",
    title: "Sistemas de interfaz vivos.",
    body:
      "Brenych Studio crea sistemas de interfaz para sitios premium, lanzamientos de producto, superficies comerciales, archivos espaciales y experiencias digitales que necesitan claridad, presencia y prueba real.",
    ctas: ["Ver proyectos", "Explorar inmersivo", "Iniciar proyecto"],
    labels: {
      liveSignal: "Señal activa",
      selectedWork: "Proyectos seleccionados",
      interfaceSystems: "Sistemas de interfaz",
      productionSurface: "Superficie de producción",
    },
    notes: [
      "Mantener el tono editorial y preciso.",
      "No convertir la home en una promesa genérica de agencia.",
    ],
    seo: spanishPageSeoDrafts["/"],
  },
  work: {
    route: "/work",
    eyebrow: "Archivo de proyectos",
    title: "Sistemas en movimiento.",
    body:
      "Un archivo de proyectos donde cada caso funciona como objeto con imagen, caption, profundidad, prueba y señales de adaptación.",
    ctas: ["Ver caso", "Adaptar este sistema", "Abrir campo extendido"],
    labels: {
      archiveLens: "Lente de archivo",
      compactFilters: "Filtros compactos",
      selectedSystem: "Sistema seleccionado",
      openExtendedField: "Abrir campo extendido",
      fieldSpatial: "Campo espacial",
      indexScan: "Escaneo de índice",
      capabilityLayer: "Capa de capacidad",
    },
    notes: [
      "Usar proyectos, no trabajos, para Work.",
      "Mantener los nombres de casos sin traducir.",
    ],
    seo: spanishPageSeoDrafts["/work"],
  },
  offer: {
    route: "/offer",
    eyebrow: "Modelo de servicios",
    title: "Tres rutas de interfaz.",
    body:
      "Landing pages premium, demos de producto y sistemas web interactivos para proyectos que necesitan estructura comercial, prueba visual y front-end listo para producción.",
    ctas: ["Iniciar proyecto", "Ver proyectos relacionados"],
    labels: {
      premiumLandingPages: "Landing pages premium",
      productDemoLanding: "Landing pages de producto",
      interactiveWebSystems: "Sistemas web interactivos",
      deliveryModel: "Modelo de entrega",
      serviceRoutes: "Rutas de servicio",
    },
    notes: [
      "En navegación usar Servicios, no Oferta.",
      "Evitar lenguaje de paquete o descuento.",
    ],
    seo: spanishPageSeoDrafts["/offer"],
  },
  about: {
    route: "/about",
    eyebrow: "Posición del estudio",
    title: "Una práctica entre ingeniería, imagen e investigación de interfaz.",
    body:
      "Brenych Studio trabaja entre ingeniería front-end, dirección visual, fotografía, medios cinematográficos e investigación de interfaz para construir superficies precisas, atmosféricas y usables.",
    ctas: ["Ver proyectos", "Explorar inmersivo", "Iniciar proyecto"],
    labels: {
      practiceLayers: "Capas de práctica",
      methodGrammar: "Gramática de método",
      technicalFoundation: "Base técnica",
      authorialNote: "Nota autoral",
      principleField: "Campo de principios",
    },
    notes: [
      "Mantener voz autoral calmada.",
      "No sobrelocalizar ni hacer claims locales falsos.",
    ],
    seo: spanishPageSeoDrafts["/about"],
  },
  immersive: {
    route: "/immersive",
    eyebrow: "Mapa de práctica espacial",
    title: "Sistemas de interfaz inmersiva.",
    body:
      "Un hub para archivos espaciales, pruebas WebGL, chambers cinematográficos y capas Web / XR que convierten producto, archivo o obra en una experiencia navegable.",
    ctas: ["Abrir WHISPER", "Iniciar un proyecto inmersivo"],
    labels: {
      chamberAtlas: "Atlas de chambers",
      activeChamberSystem: "Sistema chamber activo",
      completedProof: "Prueba completada",
      engineStack: "Stack de motores",
      futureChambers: "Chambers futuras",
      applicationLayer: "Capa de aplicación",
    },
    notes: [
      "WHISPER es P0; WEBHERO, Kool Berk y Presence OS quedan como P1.",
      "Mantener WebGL, WebXR, Quest VR y nombres de chambers como términos técnicos.",
    ],
    seo: spanishPageSeoDrafts["/immersive"],
  },
};

export const spanishServicePageTranslations: Record<string, ServicePageTranslation> = {
  "premium-landing-page": {
    title: "Landing pages premium",
    seoTitle: "Landing pages premium para lanzamientos concretos | Brenych Studio",
    metaDescription:
      "Landing pages premium para ofertas, productos, servicios, consultas, eventos, listas de espera y campañas con una ruta comercial clara.",
    ogTitle: "Landing pages premium para lanzamientos concretos",
    ogDescription:
      "Páginas comerciales independientes construidas como sistemas de interfaz claros, no como plantillas genéricas.",
    heroTitle: "Landing pages premium enfocadas.",
    heroBody:
      "Páginas comerciales independientes para una oferta, producto, servicio, consulta, evento, lista de espera o campaña — construidas como un sistema de interfaz claro, no como una plantilla genérica.",
    primaryCta: "Iniciar proyecto",
    secondaryCta: "Ver proyectos relacionados",
    routeTitle: "Una superficie comercial enfocada.",
    routeDefinition:
      "Un sistema de landing page para una acción comercial clara: consulta, reserva, lista de espera, lanzamiento de producto, registro de evento o validación de oferta.",
    routeLedger: [
      {
        title: "Claridad de oferta",
        text: "Una acción, una audiencia y una ruta premium en lugar de una sección diluida dentro de una web más grande.",
      },
      {
        title: "Confianza visual",
        text: "Prueba, media, jerarquía y lógica de consulta aparecen antes de pedir compromiso.",
      },
      {
        title: "Superficie de lanzamiento",
        text: "Front-end responsive, metadatos y entrega quedan preparados para despliegue.",
      },
    ],
    methodTitle: "Construida como una secuencia comercial contenida.",
    bestFor: [
      "Lanzamiento de producto o servicio",
      "Consulta / reserva",
      "Evento, curso o lista de espera",
      "Oferta premium local o internacional",
      "Campaña separada del sitio principal",
    ],
    method: [
      {
        title: "Dirección",
        text: "Oferta, audiencia, jerarquía de prueba y lógica de CTA.",
      },
      {
        title: "Arquitectura de interfaz",
        text: "Secciones, flujo de decisión, orden de contenido y claridad de ruta.",
      },
      {
        title: "Sistema visual",
        text: "Tipografía, ritmo de media, lenguaje de motion y presentación premium.",
      },
      {
        title: "Construcción",
        text: "Front-end responsive, QA y estructura lista para despliegue.",
      },
      {
        title: "Lanzamiento",
        text: "Entrega, notas de soporte y claridad del siguiente paso.",
      },
    ],
    proof: [
      {
        label: "Prueba hospitality",
        role: "Oferta local premium",
        claim:
          "Una superficie premium para hostelería, preparada para varios idiomas, con estructura editorial, flujo orientado a móvil y presentación local clara.",
      },
      {
        label: "Concepto de lanzamiento",
        role: "Superficie de presentación de producto",
        claim:
          "Una presentación automotriz premium con atmósfera controlada, ritmo de producto y lógica de preview privada.",
      },
      {
        label: "Prueba de universo de producto",
        role: "Presentación premium",
        claim:
          "Una superficie premium de presentación de producto para objetos de lujo, consulta privada y storytelling visual.",
      },
    ],
    proofStatement:
      "Una landing page premium debe mostrar valor antes de explicarlo: atmósfera de producto, confianza de asesoría y una ruta de acción clara en la primera mitad del recorrido.",
    deliverables: [
      "Front-end listo para producción",
      "Contenido estructurado y lógica de secciones",
      "Sistema responsive móvil / escritorio",
      "Estados de motion e interacción",
      "Metadatos básicos y entrega de lanzamiento",
      "Notas de soporte para despliegue",
    ],
    closingTitle: "Empieza con una superficie enfocada.",
    closingBody:
      "Usa una ruta para probar la oferta, lanzar con claridad y darle al proyecto una superficie comercial premium antes de añadir más arquitectura.",
    schemaName: "Landing page premium",
  },
  "product-demo-landing": {
    title: "Landing pages de producto",
    seoTitle: "Landing pages de producto para fundadores y equipos | Brenych Studio",
    metaDescription:
      "Sistemas de presentación para productos SaaS, herramientas AI, prototipos, demos para fundadores, listas de espera y validación temprana.",
    ogTitle: "Landing pages de producto para fundadores y equipos",
    ogDescription:
      "Rutas de demostración que convierten producto, flujo de trabajo y prueba de interfaz en una presentación clara.",
    heroTitle: "Landing pages de producto.",
    heroBody:
      "Sistemas de presentación para productos SaaS, herramientas AI, prototipos, demos para fundadores, conversaciones con inversores, listas de espera y validación temprana.",
    primaryCta: "Iniciar proyecto",
    secondaryCta: "Ver casos de producto",
    routeTitle: "Una historia de producto clara.",
    routeDefinition:
      "Una ruta de landing page de producto que convierte una idea, flujo de trabajo, herramienta o prototipo en una narrativa visual clara: qué es, cómo funciona, a quién ayuda y por qué importa.",
    routeLedger: [
      {
        title: "Tesis de producto",
        text: "La promesa, el problema y el flujo de trabajo se vuelven visibles antes de la primera llamada comercial.",
      },
      {
        title: "Prueba de interfaz",
        text: "Pantallas, estados y módulos sostienen la narrativa en lugar de claims abstractos.",
      },
      {
        title: "Recorrido de demo",
        text: "La ruta conduce hacia una demo, beta, revisión de inversores o conversación de producto.",
      },
    ],
    methodTitle: "Construida con lógica de producto y prueba.",
    bestFor: [
      "Prototipos SaaS / AI",
      "Lanzamientos founder-led",
      "Listas de espera y páginas beta",
      "Demos para inversores",
      "Flujos de trabajo y herramientas internas",
    ],
    method: [
      {
        title: "Tesis de producto",
        text: "Aclarar la promesa, el problema de usuario y el flujo de trabajo central.",
      },
      {
        title: "Arquitectura de demo",
        text: "Estructurar la página alrededor de lógica de producto, prueba y conversión.",
      },
      {
        title: "Prueba de interfaz",
        text: "Usar capturas, módulos, flujos y estados como evidencia.",
      },
      {
        title: "Ruta de conversión",
        text: "Construir un camino hacia demo, waitlist, consulta o acceso beta.",
      },
      {
        title: "Superficie lista para lanzar",
        text: "Entregar una presentación front-end pulida y responsive.",
      },
    ],
    proof: [
      {
        label: "Flujo de trabajo de creadores",
        role: "Prototipo orientado a exportación",
        claim:
          "Un prototipo de producto para creadores que convierte recursos dispersos en un sistema operativo Week Pack.",
      },
      {
        label: "Superficie operativa",
        role: "Demo de producto interno",
        claim:
          "Un prototipo CRM interno que hace visibles la importación de leads, el estado de pipeline y el flujo del operador.",
      },
      {
        label: "Sistema de asesoría",
        role: "Workflow guiado para comprador",
        claim:
          "Una demo de asesoría con forma de producto que convierte contexto de comprador en una ruta de entrega estructurada.",
      },
    ],
    proofStatement:
      "La página de producto debe sentirse como una superficie de demo funcional: tesis clara, flujo visible, pantallas de prueba y una ruta directa hacia la siguiente conversación.",
    deliverables: [
      "Narrativa de producto",
      "Estructura de flujo demo",
      "Sistema de capturas de interfaz",
      "Landing page responsive",
      "Ruta CTA / waitlist / consulta",
      "Metadatos y entrega de lanzamiento",
    ],
    closingTitle: "Convierte el producto en una superficie demo clara.",
    closingBody:
      "Haz que el producto se entienda antes de la primera llamada: promesa, flujo, prueba y siguiente acción en una ruta enfocada.",
    schemaName: "Landing page de producto",
  },
  "interactive-web-systems": {
    title: "Sistemas web interactivos",
    seoTitle: "Sistemas web interactivos e interfaces inmersivas | Brenych Studio",
    metaDescription:
      "Sistemas web interactivos, interfaces cinematográficas, WebGL, archivos espaciales y presentaciones inmersivas para marcas, artistas y productos premium.",
    ogTitle: "Sistemas web interactivos e interfaces inmersivas",
    ogDescription:
      "Sitios cinematográficos, interfaces atmosféricas y capas de presentación inmersiva para proyectos que necesitan más que una página estática.",
    heroTitle: "Interfaces web espaciales.",
    heroBody:
      "Sitios cinematográficos, interfaces atmosféricas, sistemas preparados para WebGL, archivos espaciales y capas de presentación inmersiva para proyectos que necesitan más que una página estática.",
    primaryCta: "Proyecto inmersivo",
    secondaryCta: "Ver prueba inmersiva",
    routeTitle: "Un campo de interfaz vivo.",
    routeDefinition:
      "Una ruta de sistema interactivo para proyectos que necesitan atmósfera, movimiento, medios, estructura espacial, presentación experimental o prueba inmersiva sin perder usabilidad.",
    routeLedger: [
      {
        title: "Concepto espacial",
        text: "El mundo, archivo, chamber o campo de producto se define antes de empezar con efectos visuales.",
      },
      {
        title: "Prueba cinematográfica",
        text: "El trabajo existente ancla la experiencia para que la atmósfera siga conectada a evidencia real.",
      },
      {
        title: "Campo usable",
        text: "Movimiento, medios y ritmo espacial sostienen la ruta en lugar de ocultar el mensaje.",
      },
    ],
    methodTitle: "Construido como una secuencia espacial con bordes usables.",
    bestFor: [
      "Exposiciones digitales inmersivas",
      "Archivos de artistas y colecciones visuales",
      "Universos de producto premium",
      "Sistemas WebGL / atmosféricos",
      "Páginas pitch espaciales y prototipos experimentales",
    ],
    method: [
      {
        title: "Concepto espacial",
        text: "Definir el mundo, chamber, capa de prueba o lógica de experiencia.",
      },
      {
        title: "Estructura de interfaz",
        text: "Construir la ruta, navegación, campo de medios y modelo de interacción.",
      },
      {
        title: "Sistema atmosférico",
        text: "Dar forma a movimiento, fondo escénico, presencia, reveal y ritmo visual.",
      },
      {
        title: "Front-end técnico",
        text: "Implementar comportamiento responsive y consciente de producción.",
      },
      {
        title: "Entrega",
        text: "Preparar el sistema para lanzamiento, iteración o desarrollo WebXR más profundo.",
      },
    ],
    proof: [
      {
        label: "Sistema de archivo",
        role: "Prueba cinematográfica Web / XR",
        claim:
          "Un sistema de exposición cinematográfica Web / XR donde un archivo se convierte en múltiples superficies.",
      },
      {
        label: "Prueba preparada para WebGL",
        role: "Sistema visual vivo",
        claim:
          "Una plataforma de sistemas visuales vivos para stages WebGL, obras espaciales y presentación Art Room.",
      },
      {
        label: "Campo de memoria",
        role: "Prototipo de archivo espacial",
        claim:
          "Un memory atlas local-first donde entrada de archivo, inspección cinematográfica, exportación de artefacto y lógica de XR room forman un sistema espacial.",
      },
      {
        label: "Objeto sonoro",
        role: "Prototipo musical inmersivo",
        claim:
          "Un prototipo de objeto sonoro espacial donde música, inspección de artefacto y presentación atmosférica se vuelven un campo interactivo.",
      },
    ],
    proofStatement:
      "El trabajo interactivo necesita prueba desde el principio: no decoración, sino un sistema visible de atmósfera, medios, lógica espacial y ruta usable.",
    deliverables: [
      "Superficie front-end interactiva",
      "Sistema de movimiento y atmósfera",
      "Composición de medios / prueba",
      "Experiencia responsive móvil / escritorio",
      "Dirección WebGL / AR / espacial opcional",
      "QA y entrega de lanzamiento",
    ],
    closingTitle: "Construye la próxima interfaz como un campo vivo.",
    closingBody:
      "Usa interacción, medios y atmósfera como parte de la lógica del sistema, no como decoración añadida después de construir la página.",
    schemaName: "Sistemas web interactivos",
  },
};

export const spanishCaseRegistryTranslations: Record<string, CaseRegistryTranslation> = {
  "aurel-eon-gt": {
    shortDescription:
      "Una experiencia de lanzamiento para un gran turismo electrico ficticio, con estados cinematograficos, inspeccion visual y preview privada.",
    longDescription:
      "AUREL EON GT demuestra como un lanzamiento automotriz premium puede funcionar como sistema de producto: presencia, senal, galeria, inspeccion, caracter de conduccion y preview privada conectados en una experiencia front-end controlada.",
    tags: ["Concepto automotriz", "UX cinematografica", "Sistema de producto", "Storytelling interactivo"],
    ctaLabel: "Ver caso",
    alt: "Experiencia premium de producto AUREL EON GT",
    clientType: "Concepto automotriz / producto premium",
    seoTitle: "AUREL EON GT - experiencia premium de producto automotriz",
    seoDescription:
      "Caso de lanzamiento automotriz ficticio con estados cinematicos, inspeccion visual, galeria, drive character y preview privada.",
    ogTitle: "AUREL EON GT - lanzamiento automotriz como sistema",
    ogDescription:
      "Un concepto GT electrico convertido en experiencia de producto viva, con motion, inspeccion y narrativa premium.",
    searchContent: {
      type: "Experiencia premium de producto automotriz.",
      audience: "Marcas de producto, conceptos automotrices, lanzamientos premium y demos visuales de alto control.",
      problem:
        "Un lanzamiento premium puede perder fuerza si se reduce a una pagina estatica o a renders sin logica de experiencia.",
      approach:
        "La interfaz organiza llegada, exterior, firma luminica, cabina, materialidad, galeria, inspeccion y preview privada como estados de producto.",
      outcome:
        "El caso demuestra una direccion de producto cinematografica, interactiva y honesta como prototipo avanzado.",
      productionFacts: ["React", "TypeScript", "Vite", "Motion", "Sistema responsive", "Pipeline WebP"],
      relatedServices: ["Landing page premium", "Sistemas web interactivos"],
    },
  },
  "oria-house-barcelona": {
    shortDescription:
      "Un sistema hospitality para hotel boutique en Barcelona, con atmosfera, comparacion de habitaciones, experiencias y contacto de reserva.",
    longDescription:
      "Oria House Barcelona demuestra como una web de hotel boutique puede equilibrar deseo y utilidad: atmosfera de estancia, ritmo de habitaciones, decision asistida, experiencias, contexto local y contacto claro.",
    tags: ["Hospitality", "Hotel boutique", "Comparacion de habitaciones", "Contacto de reserva"],
    ctaLabel: "Ver caso",
    alt: "Sistema hospitality Oria House Barcelona",
    clientType: "Hospitality boutique",
    seoTitle: "Oria House Barcelona - sistema web para hotel boutique",
    seoDescription:
      "Caso hospitality para hotel boutique con atmosfera, habitaciones, experiencias, contexto local y contacto de reserva.",
    ogTitle: "Oria House Barcelona - hospitality como sistema",
    ogDescription:
      "Una superficie hotelera donde atmosfera, decision de habitacion y contacto avanzan como una ruta calmada.",
    searchContent: {
      type: "Sitio web premium para hotel boutique.",
      audience: "Hoteles boutique, guest houses, retreats, serviced apartments y marcas hospitality.",
      problem:
        "Las webs hoteleras suelen caer en plantillas frias o en conversion directa antes de construir deseo y confianza.",
      approach:
        "La experiencia conecta atmosfera, habitaciones, comparacion, detalle, experiencias, localizacion y contacto.",
      outcome:
        "El caso muestra una ruta guest-first donde el visitante siente la estancia y puede actuar sin friccion.",
      productionFacts: ["Astro", "TypeScript", "Tailwind CSS", "Rutas EN/ES", "Media WebP", "Despliegue Cloudflare"],
      relatedServices: ["Landing page premium", "Sistemas web interactivos"],
    },
  },
  sprintcrm: {
    shortDescription:
      "Un CRM interno premium para outreach, importacion de leads, pipeline, accion diaria y reporting orientado al operador.",
    longDescription:
      "SprintCRM demuestra pensamiento de producto para operaciones internas: estados de datos, importacion, seguimiento diario, pipeline y reportes se convierten en una superficie de trabajo enfocada.",
    tags: ["CRM", "Sistema interno", "Workflow UX", "Consola de operador"],
    ctaLabel: "Ver caso",
    alt: "Interfaz SprintCRM para workflow de operador",
    clientType: "Operaciones internas / equipos comerciales",
    seoTitle: "SprintCRM - CRM interno y workflow de operador",
    seoDescription:
      "Caso de producto interno con importacion XLSX/CSV, pipeline, acciones diarias, reporting y superficie de operador.",
    ogTitle: "SprintCRM - workflow operativo como sistema",
    ogDescription:
      "Un CRM interno que convierte importacion, seguimiento, pipeline y reportes en una interfaz calmada.",
    searchContent: {
      type: "Interfaz de producto CRM interno.",
      audience: "Equipos comerciales, operadores internos, founders y procesos de outreach.",
      problem:
        "El outreach se fragmenta entre hojas de calculo, notas, recordatorios manuales y estados dispersos.",
      approach:
        "La interfaz estructura importacion, revision de leads, drawer de detalle, acciones, pipeline y reportes.",
      outcome:
        "El caso muestra una herramienta seria de producto interno, no solo una maqueta visual.",
      productionFacts: ["React", "TypeScript", "Vite", "Supabase", "Import XLSX/CSV", "UI multilingue"],
      relatedServices: ["Landing page de producto", "Sistemas web interactivos"],
    },
  },
  "fluid-exhibition": {
    shortDescription:
      "Una superficie web expositiva donde identidad, paginas de artista, QR, motion y contenido multilingue funcionan como sistema cultural.",
    longDescription:
      "FLUID demuestra como una exposicion fisica puede ganar una capa digital coherente: acceso QR, paginas de artista, contexto de evento, ritmo visual y despliegue ligero bajo restricciones reales.",
    tags: ["Exposicion", "Superficie editorial", "QR", "Motion cultural"],
    ctaLabel: "Ver caso",
    alt: "Superficie de exposicion digital FLUID",
    clientType: "Cultura / exposiciones / proyectos editoriales",
    seoTitle: "FLUID - sistema web para exposicion cultural",
    seoDescription:
      "Caso de microsite expositivo con paginas de artista, acceso QR, contexto multilingue y motion atmosferico.",
    ogTitle: "FLUID - exposicion digital como sistema",
    ogDescription:
      "Una capa web cultural donde artistas, evento, QR y motion se conectan en una identidad reutilizable.",
    searchContent: {
      type: "Microsite cultural y sistema de exposicion.",
      audience: "Exposiciones, artistas, espacios culturales, eventos editoriales y proyectos curatoriales.",
      problem:
        "Las paginas de evento suelen ser desechables y no dan contexto directo a visitantes ni artistas.",
      approach:
        "El sistema usa paginas de artista, acceso QR, contenido multilingue y motion contenido como identidad.",
      outcome:
        "La exposicion obtiene una capa digital legible, atmosferica y util para visitantes.",
      productionFacts: ["Astro", "React islands", "TypeScript", "Tailwind CSS", "Paginas QR", "Cloudflare Pages"],
      relatedServices: ["Sistemas web interactivos", "Landing page premium"],
    },
  },
  "form-index": {
    shortDescription:
      "Un sistema editorial interactivo que prueba arquitectura reusable, presentacion multilingue y motion preciso.",
    longDescription:
      "FORM INDEX muestra como una web de presentacion puede convertirse en un sistema repetible: sticky stage, ritmo de imagen, jerarquia editorial, motion contenido y traduccion responsive.",
    tags: ["Sistema editorial", "Multilingue", "Motion UI", "Arquitectura de presentacion"],
    ctaLabel: "Ver caso",
    alt: "Sistema editorial interactivo FORM INDEX",
    clientType: "Editorial / cultura / presentacion de producto",
    seoTitle: "FORM INDEX - sistema editorial interactivo",
    seoDescription:
      "Caso de presentacion premium con sticky stage, motion preciso, arquitectura reusable y superficie responsive.",
    ogTitle: "FORM INDEX - presentacion editorial como sistema",
    ogDescription:
      "Una base de presentacion para archivos, lookbooks, producto y lanzamientos editoriales.",
    searchContent: {
      type: "Sistema editorial interactivo.",
      audience: "Estudios, archivos, marcas de producto, lookbooks y lanzamientos editoriales.",
      problem:
        "Las presentaciones visuales pueden sentirse decorativas si el motion no tiene estructura ni jerarquia.",
      approach:
        "La experiencia usa progreso de seccion, sticky composition, imagen, texto y reveal como una misma gramatica.",
      outcome:
        "El caso prueba una base reusable para presentaciones premium y sistemas de contenido.",
      productionFacts: ["Vite", "React", "TypeScript", "Tailwind CSS", "Motion", "Sistema responsive"],
      relatedServices: ["Sistemas web interactivos", "Landing page premium"],
    },
  },
  "arcwave-integrations": {
    shortDescription:
      "Un sistema de servicios tecnicos que convierte telecom, redes, electricidad, seguridad, EV charging, smart home y audio en una ruta legible.",
    longDescription:
      "ARCWAVE demuestra como los servicios tecnicos pueden presentarse como una interfaz de infraestructura calmada: capa conectada, rutas de servicio, metricas de prueba, proceso de instalacion y brief de presupuesto.",
    tags: ["Infraestructura UX", "Servicios tecnicos", "Brief de instalacion", "Quote flow"],
    ctaLabel: "Ver caso",
    alt: "Interfaz de infraestructura ARCWAVE",
    clientType: "Servicios tecnicos / empresas de instalacion",
    seoTitle: "ARCWAVE - sistema web para servicios tecnicos",
    seoDescription:
      "Caso de interfaz para servicios de instalacion tecnica, infraestructura conectada, proceso y brief de presupuesto.",
    ogTitle: "ARCWAVE - infraestructura tecnica como sistema",
    ogDescription:
      "Una ruta comercial que vuelve visibles servicios invisibles, confianza tecnica y contexto de instalacion.",
    searchContent: {
      type: "Sitio web premium para servicios tecnicos.",
      audience: "Empresas de instalacion, telecom, redes, seguridad, EV charging, smart home y audio.",
      problem:
        "Los servicios tecnicos suelen presentarse como listas desconectadas y formularios frios.",
      approach:
        "La interfaz organiza servicios conectados, metricas, proceso, decision interface y quote brief.",
      outcome:
        "El comprador entiende la capa de infraestructura antes de pedir presupuesto.",
      productionFacts: ["Astro", "TypeScript", "React islands", "Rutas bilingues", "View transitions", "Cloudflare Pages"],
      relatedServices: ["Landing page premium", "Landing page de producto"],
    },
  },
  "casa-nube": {
    shortDescription:
      "Una superficie hospitality multilingue con estructura editorial, flujo mobile-first y presentacion clara para negocio local.",
    longDescription:
      "Casa Nube demuestra como un pequeno negocio hospitality puede usar contenido por idioma, menu web, utilidad de visita y ritmo local para sentirse premium sin volverse pesado.",
    tags: ["Hospitality", "Multilingue", "Mobile-first", "Negocio local"],
    ctaLabel: "Ver caso",
    alt: "Sitio hospitality Casa Nube",
    clientType: "Hospitality / negocio local",
    seoTitle: "Casa Nube - sitio hospitality multilingue",
    seoDescription:
      "Caso de sitio hospitality con menu web, utilidad de visita, contenido multilingue y accion mobile-first.",
    ogTitle: "Casa Nube - hospitality local como sistema",
    ogDescription:
      "Una superficie para cafe o restaurante donde atmosfera, menu y visita permanecen cerca.",
    searchContent: {
      type: "Sitio web premium para hospitality local.",
      audience: "Cafes, brunch, restaurantes, panaderias boutique y marcas locales hospitality.",
      problem:
        "Muchos negocios locales esconden menu, horarios y contacto detras de PDFs o redes sociales dispersas.",
      approach:
        "La web acerca menu, reserva, mapa, horarios, WhatsApp, Instagram y contenido por idioma.",
      outcome:
        "El visitante puede entender el lugar, revisar el menu y actuar desde mobile sin friccion.",
      productionFacts: ["Next.js", "TypeScript", "next-intl", "Static export", "Responsive QA", "Cloudflare Pages"],
      relatedServices: ["Landing page premium"],
    },
  },
  "print-border-studio": {
    shortDescription:
      "Una herramienta creativa para bordes de impresion, preview de obra, cola de trabajo, inspeccion y preparacion de export.",
    longDescription:
      "Print Border Studio demuestra como una utilidad creativa especializada puede combinar precision de produccion, preview de artwork, logica de cola y valor de presentacion en una interfaz enfocada.",
    tags: ["Herramienta creativa", "Produccion print", "Canvas UI", "Export workflow"],
    ctaLabel: "Ver caso",
    alt: "Herramienta Print Border Studio para preparacion de impresion",
    clientType: "Artistas / estudios / workflows print",
    seoTitle: "Print Border Studio - herramienta de preparacion print",
    seoDescription:
      "Caso de herramienta creativa desktop-first para bordes, preview, inspeccion, cola y preparacion de export.",
    ogTitle: "Print Border Studio - produccion creativa como sistema",
    ogDescription:
      "Una utilidad premium para preparar impresiones fine-art con control visual y flujo repetible.",
    searchContent: {
      type: "Herramienta creativa de produccion print.",
      audience: "Artistas, fotografos, estudios print, archivos visuales y workflows de produccion.",
      problem:
        "La preparacion de bordes e impresiones suele ser manual, fragmentada y dificil de repetir con precision.",
      approach:
        "La interfaz centra la obra, controla margenes, modos, inspeccion, cola y preparacion de salida.",
      outcome:
        "El caso muestra una utilidad practica que tambien funciona como superficie de producto premium.",
      productionFacts: ["React", "TypeScript", "Canvas preview", "Estado local", "Export preparation", "Cloudflare Pages"],
      relatedServices: ["Landing page de producto", "Sistemas web interactivos"],
    },
  },
  "house-of-lune": {
    shortDescription:
      "Una superficie premium de presentación de producto para objetos de lujo, consulta privada y storytelling visual.",
    longDescription:
      "House of Lune demuestra cómo objetos de lujo, joyería, moda o productos coleccionables pueden ir más allá de grids ecommerce genéricos y convertirse en un universo de producto controlado, con ritmo editorial, consulta privada, estructura preparada para varios idiomas y mayor confianza.",
    tags: ["Producto de lujo", "Consulta privada", "Presentación de producto", "Varios idiomas"],
    ctaLabel: "Ver caso",
    alt: "Superficie premium de producto House of Lune",
    clientType: "Objetos de lujo / universos de producto founder-led",
    seoTitle: "House of Lune - superficie premium de producto",
    seoDescription:
      "Caso de sitio web premium para objetos de lujo, consulta privada y storytelling visual con estructura preparada para varios idiomas.",
    ogTitle: "House of Lune - producto premium como sistema",
    ogDescription:
      "Una presentación de producto donde atmósfera, foco, confianza y consulta privada funcionan como una sola superficie.",
    searchContent: {
      type: "Sitio web premium de presentación de producto.",
      audience:
        "Objetos de lujo, joyería, moda, productos coleccionables, comercio privado y universos de producto founder-led.",
      problem:
        "Los productos premium pierden valor percibido cuando se muestran en grids ecommerce genéricos o páginas de plantilla.",
      approach:
        "La interfaz trata el producto como un universo visual mediante tipografía contenida, ritmo editorial, prueba de producto, lógica de consulta y superficies de media refinadas.",
      outcome:
        "El caso muestra cómo una colección pequeña puede convertirse en una superficie digital premium con más confianza, atmósfera e intención comercial.",
      productionFacts: [
        "Front-end responsive",
        "Sistema de media de producto",
        "Ruta de consulta",
        "Jerarquía visual premium",
        "Estructura preparada para metadatos",
      ],
      relatedServices: ["Landing page premium", "Sistemas web interactivos"],
    },
  },
  "bcn-advisory": {
    shortDescription:
      "Un concepto de sitio web de alta confianza para asesoría privada, recorridos de compra curados e interfaces premium de consulta.",
    longDescription:
      "Barcelona Private Advisory demuestra cómo una web de asesoría inmobiliaria privada puede ir más allá de una presentación basada en listados y convertirse en una ruta guiada: intención de comprador, inteligencia de distrito, shortlist dossier, inspección de propiedad y entrega de consulta.",
    tags: ["Asesoría inmobiliaria", "Barcelona Lens", "Shortlist dossier", "Consulta privada"],
    ctaLabel: "Ver caso",
    alt: "Interfaz de asesoría privada Barcelona Private Advisory",
    clientType: "Asesoría privada / consultores inmobiliarios",
    seoTitle: "Barcelona Private Advisory - interfaz de asesoría privada",
    seoDescription:
      "Caso de sitio web para asesoría inmobiliaria privada, recorridos de compra curados y consulta premium en Barcelona.",
    ogTitle: "Barcelona Private Advisory - asesoría privada como sistema",
    ogDescription:
      "Una interfaz de alta confianza para convertir intención de comprador, shortlist y consulta en una ruta guiada.",
    searchContent: {
      type: "Sitio web premium para asesoría inmobiliaria privada.",
      audience:
        "Asesoría privada, consultores inmobiliarios, consultores de relocation, servicios boutique de propiedad y negocios locales de alta confianza.",
      problem:
        "Las webs de asesoría y real estate suelen volverse impersonales, llenas de listados y difíciles de evaluar.",
      approach:
        "El sistema crea una ruta curada a través de contexto de comprador, oportunidades seleccionadas, consulta privada, inteligencia local y navegación orientada a confianza.",
      outcome:
        "El caso demuestra cómo un servicio puede pasar de presentación genérica a una interfaz premium de asesoría.",
      productionFacts: [
        "Front-end responsive",
        "Arquitectura orientada a consulta",
        "Dirección preparada para varios idiomas",
        "Framing de localización y servicio",
        "Estructura de contenido legible para búsqueda",
      ],
      relatedServices: ["Landing page premium", "Landing page de producto"],
    },
  },
  creatorops: {
    shortDescription:
      "CreatorOps es un sistema de flujo de trabajo para creadores orientado a la exportación que convierte recursos visuales dispersos en un Week Pack listo para publicar.",
    longDescription:
      "CreatorOps demuestra cómo una herramienta para creadores puede convertirse en un sistema operativo calmado y orientado a exportación, no en otro dashboard de planificación ruidoso. Es una dirección de prototipo, no una promesa de SaaS en producción con facturación, cuentas, almacenamiento backend o publicación directa en Instagram.",
    tags: ["Flujo de trabajo para creadores", "Interfaz de producto", "Smart Mix", "Flujo de exportación"],
    ctaLabel: "Ver caso",
    alt: "Interfaz de producto CreatorOps para flujo de trabajo de creadores",
    clientType: "Creadores / marcas pequeñas / equipos de contenido",
    seoTitle: "CreatorOps - sistema de flujo de trabajo para creadores",
    seoDescription:
      "Caso de producto CreatorOps: un espacio de trabajo orientado a exportación para convertir recursos visuales dispersos en un Week Pack listo para publicar.",
    ogTitle: "CreatorOps - flujo de trabajo de creadores como sistema",
    ogDescription:
      "Library, Smart Mix, planificación, captions, exportación ZIP, revisión para cliente y entrega de perfil en una sola superficie.",
    searchContent: {
      type: "Interfaz de producto para flujo de trabajo de creadores / prototipo listo para beta.",
      audience:
        "Creadores, marcas pequeñas, content managers y estudios creativos que preparan packs semanales de contenido.",
      problem:
        "Los flujos de trabajo de creadores suelen empezar con recursos visuales dispersos, secuencias poco claras y tareas de captions/export desconectadas.",
      approach:
        "CreatorOps organiza el trabajo en Library, Smart Mix, Sequence, Planner, Captions, Export, Client Review, Profile Handoff y Media Converter.",
      outcome:
        "El proyecto demuestra cómo una herramienta para creadores puede convertirse en un sistema operativo calmado y orientado a exportación.",
      productionFacts: [
        "React",
        "TypeScript",
        "Vite",
        "Interfaz de producto responsive",
        "Lógica de prototipo local-first",
        "Dirección de flujo preparada para ZIP/export",
      ],
      relatedServices: ["Landing page de producto", "Sistemas web interactivos", "Landing page premium"],
    },
  },
};

export const spanishWorkEvidenceTranslations: Record<string, WorkEvidenceTranslation> = {
  "aurel-eon-gt": {
    proofLabel: "Sistema vivo de producto automotriz",
    proofSummary:
      "Un lanzamiento ficticio de gran turismo electrico que convierte llegada, exterior, firma luminica, cabina, galeria, inspeccion y preview privada en un sistema cinematografico.",
    systemTags: ["Concepto automotriz", "UX cinematografica", "Estados de producto", "Interaccion"],
    workType: "Experiencia premium de producto automotriz",
    capability: "Direccion interactiva para producto premium",
    layers: ["Presence Rail", "Inspeccion cinematografica", "Drive character"],
    proofPoints: [
      "Replantea el lanzamiento como sistema vivo de producto",
      "Conecta imagen cinematografica con logica reusable",
      "Mantiene el concepto ficticio como prototipo honesto",
    ],
  },
  "oria-house-barcelona": {
    proofLabel: "Sistema hospitality para hotel boutique",
    proofSummary:
      "Un concepto hotelero que conecta atmosfera, comparacion de habitaciones, experiencias, contexto local y contacto en una ruta calmada.",
    systemTags: ["Hotel boutique", "Hospitality UX", "Comparacion", "Contacto"],
    workType: "Web hospitality",
    capability: "Interfaz para hotel boutique",
    layers: ["Entrada atmosferica", "Decision de habitacion", "Contacto de reserva"],
    proofPoints: [
      "Une atmosfera con seleccion practica",
      "Convierte habitaciones y experiencias en una ruta",
      "Mantiene contacto claro sin prometer motor de reservas",
    ],
  },
  "house-of-lune": {
    proofLabel: "Arquitectura de producto de lujo",
    proofSummary:
      "Una superficie cinematografica de producto con rutas multilingues, consulta privada, paginas dinamicas y framing premium.",
    systemTags: ["Producto de lujo", "Multilingue", "Consulta privada", "Commerce editorial"],
    workType: "Web premium",
    capability: "Sistema luxury con arquitectura de producto",
    layers: ["Rutas multilingues", "Paginas de producto", "Consulta privada"],
    proofPoints: [
      "Convierte browsing en seleccion tipo maison",
      "Sostiene logica editorial y comercial",
      "Se entrega como despliegue orientado a produccion",
    ],
  },
  "bcn-advisory": {
    proofLabel: "Inteligencia privada de propiedad",
    proofSummary:
      "Un prototipo de asesoria inmobiliaria que convierte intencion, distritos, shortlist, dossier e inquiry en una ruta guiada.",
    systemTags: ["Real estate", "Barcelona Lens", "Shortlist", "Consulta"],
    workType: "Sistema privado de asesoria",
    capability: "Interfaz de asesoria inmobiliaria privada",
    layers: ["Buyer intent", "Barcelona Lens", "Dossier"],
    proofPoints: [
      "Hace visible la logica de seleccion",
      "Convierte guardados en dossier privado",
      "Transforma contexto en solicitud estructurada",
    ],
  },
  creatorops: {
    proofLabel: "Workflow de publicacion para creadores",
    proofSummary:
      "Un espacio export-first para transformar assets dispersos en un Week Pack listo para publicar con revision, handoff y utilidad.",
    systemTags: ["Workflow UX", "Herramientas creator", "Client Review", "Media Converter"],
    workType: "Sistema de publicacion creator",
    capability: "Interfaz de workflow para creadores",
    layers: ["Library y Smart Mix", "Export y revision", "Media Converter"],
    proofPoints: [
      "Convierte assets sueltos en candidatos seleccionables",
      "Avanza hacia un Week Pack listo para publicar",
      "Mantiene herramientas utiles dentro del producto",
    ],
  },
  "print-border-studio": {
    proofLabel: "Herramienta de produccion y superficie collector",
    proofSummary:
      "Una herramienta tipo museo para bordes de impresion, logica de export, revision e inspeccion visual.",
    systemTags: ["Print", "Produccion UX", "Canvas", "Collector logic"],
    workType: "Herramienta de produccion",
    capability: "Interfaz de produccion con logica collector",
    layers: ["Motor de bordes", "Inspeccion", "Estados de export"],
    proofPoints: [
      "Une utilidad creativa con presentacion premium",
      "Hace inspeccionables las decisiones de produccion",
      "Conecta precision y superficie comercial",
    ],
  },
  "casa-nube": {
    proofLabel: "Sistema hospitality local",
    proofSummary:
      "Una superficie hospitality multilingue con estructura editorial, flujo mobile-first y presentacion clara para negocio local.",
    systemTags: ["Hospitality", "Multilingue", "Mobile-first", "Editorial UX"],
    workType: "Web hospitality",
    capability: "Arquitectura web para hospitality",
    layers: ["Narrativa de servicio", "Ruta mobile", "Estructura local"],
    proofPoints: [
      "Aclara lugar y oferta sin clutter generico",
      "Sostiene presentacion multilingue",
      "Mantiene la accion mobile directa",
    ],
  },
  "form-index": {
    proofLabel: "Sistema de presentacion reusable",
    proofSummary:
      "Un sistema interactivo y multilingue que prueba arquitectura reusable, jerarquia editorial y motion preciso.",
    systemTags: ["Multilingue", "Presentacion interactiva", "Arquitectura"],
    workType: "Sistema de presentacion",
    capability: "Arquitectura reusable de contenido",
    layers: ["Estructura interactiva", "Sistema de idioma", "Modelo repetible"],
    proofPoints: [
      "Muestra una arquitectura repetible de caso",
      "Equilibra claridad editorial e interaccion",
      "Escala el sistema visual a varias piezas",
    ],
  },
  "fluid-exhibition": {
    proofLabel: "Superficie editorial de exposicion",
    proofSummary:
      "Una prueba de exposicion web donde ritmo de imagen, motion, paginas QR y estructura de scroll funcionan como sistema.",
    systemTags: ["Exposicion", "Superficie cinematica", "QR", "Scroll"],
    workType: "Presentacion experimental",
    capability: "Experiencia editorial cinematografica",
    layers: ["Ritmo de imagen", "Motion", "Composicion de scroll"],
    proofPoints: [
      "Construye atmosfera mediante interaccion",
      "Mantiene legible el contenido expositivo",
      "Convierte el scroll en estructura de presentacion",
    ],
  },
  "arcwave-integrations": {
    proofLabel: "Sistema de interfaz de infraestructura",
    proofSummary:
      "Un sistema de servicios tecnicos que vuelve legibles telecom, redes, electricidad, seguridad, EV charging, smart home y audio.",
    systemTags: ["Infraestructura UX", "Brief de instalacion", "Quote flow", "Servicios tecnicos"],
    workType: "Sistema de servicios",
    capability: "Interfaz para infraestructura tecnica",
    layers: ["Servicios conectados", "Proceso de instalacion", "Quote brief"],
    proofPoints: [
      "Vuelve visible infraestructura invisible",
      "Convierte servicios tecnicos en rutas claras",
      "Lleva la intencion a un brief estructurado",
    ],
  },
  sprintcrm: {
    proofLabel: "Producto de workflow para operador",
    proofSummary:
      "Un CRM interno premium que prueba importacion, pipeline, reporting y claridad de producto para trabajo diario.",
    systemTags: ["CRM", "Workflow UX", "Supabase", "Consola de operador"],
    workType: "Producto de software",
    capability: "UX de producto interno y workflow con datos",
    layers: ["Importacion de leads", "Pipeline", "Reportes"],
    proofPoints: [
      "Prueba logica real de producto",
      "Mantiene el trabajo del operador calmado",
      "Conecta estados de datos con acciones diarias",
    ],
  },
};

function generatedStoryTranslation(
  slug: string,
  headline: string,
  subheadline: string,
  label: string,
  layers: CaseStoryTranslation["systemLayers"],
): CaseStoryTranslation {
  const registry = spanishCaseRegistryTranslations[slug];
  const search = registry.searchContent;

  return {
    label,
    headline,
    subheadline,
    summary: registry.longDescription,
    proofClaim: search?.outcome ?? registry.longDescription,
    evidencePoints: [search?.problem, search?.approach, search?.outcome].filter(Boolean) as string[],
    systemTags: registry.tags,
    systemLayers: layers,
    mediaSequence: [],
    interactionLogic: search?.approach ?? registry.longDescription,
    commercialLogic: search?.outcome ?? registry.shortDescription,
    technicalFoundation: search?.productionFacts ?? [],
    seo: {
      title: registry.seoTitle,
      description: registry.seoDescription,
      ogTitle: registry.ogTitle,
      ogDescription: registry.ogDescription,
      alt: registry.alt,
    },
  };
}

const generatedSpanishCaseStoryTranslations: Record<string, CaseStoryTranslation> = {
  "aurel-eon-gt": generatedStoryTranslation(
    "aurel-eon-gt",
    "AUREL EON GT",
    "Experiencia viva de producto automotriz.",
    "CASE SYSTEM / CONCEPTO AUTOMOTRIZ / EXPERIENCIA DE PRODUCTO",
    [
      {
        title: "Campo de llegada",
        text:
          "El hero presenta el gran turismo electrico como presencia de silencio, senal, movimiento y contencion cinematografica.",
      },
      {
        title: "Inspeccion cinematografica",
        text:
          "La secuencia visual permite leer exterior, cabina, materialidad, galeria y firma luminica como estados de producto.",
      },
      {
        title: "Preview privada",
        text:
          "El cierre evita un formulario generico y transforma la conversion en una entrada de concierge para producto premium.",
      },
    ],
  ),
  "oria-house-barcelona": generatedStoryTranslation(
    "oria-house-barcelona",
    "Oria House Barcelona",
    "Sistema hospitality para hotel boutique.",
    "CASE SYSTEM / HOTEL BOUTIQUE / INTERFAZ HOSPITALITY",
    [
      {
        title: "Entrada atmosferica",
        text:
          "La superficie presenta la estancia como retiro tranquilo antes de empujar la decision comercial.",
      },
      {
        title: "Decision de habitacion",
        text:
          "Comparacion, detalle, galerias y ritmo de habitaciones ayudan a elegir sin convertir el hotel en inventario frio.",
      },
      {
        title: "Ruta de contacto",
        text:
          "Experiencias, contexto local y contacto de reserva avanzan como una misma ruta de invitado.",
      },
    ],
  ),
  sprintcrm: generatedStoryTranslation(
    "sprintcrm",
    "SprintCRM",
    "Sistema CRM para workflow de operador.",
    "CASE SYSTEM / WORKFLOW OPERATIVO / CRM INTERNO",
    [
      {
        title: "Arquitectura de importacion",
        text:
          "XLSX, CSV, mapeo, preview de filas y reporte de importacion convierten listas dispersas en entrada controlada.",
      },
      {
        title: "Espacio de operador",
        text:
          "Leads, filtros, drawer de detalle, acciones diarias y pipeline mantienen el foco en el siguiente movimiento util.",
      },
      {
        title: "Superficie de reporting",
        text:
          "Los reportes devuelven salud de funnel, fuentes, nichos, tareas vencidas y leads activos como feedback operativo.",
      },
    ],
  ),
  "fluid-exhibition": generatedStoryTranslation(
    "fluid-exhibition",
    "FLUID",
    "Sistema de interfaz para exposicion y acceso QR.",
    "CASE SYSTEM / SUPERFICIE CULTURAL / IDENTIDAD EXPOSITIVA",
    [
      {
        title: "Entrada expositiva",
        text:
          "La landing convierte el evento en una capa digital coherente, no en una pagina de anuncio desechable.",
      },
      {
        title: "Arquitectura de artistas",
        text:
          "Cada pagina de artista funciona como destino QR directo sin perder la identidad comun de la exposicion.",
      },
      {
        title: "Contexto multilingue",
        text:
          "Contenido por idioma, motion contenido y ruta mobile sostienen la visita fisica desde una superficie ligera.",
      },
    ],
  ),
  "form-index": generatedStoryTranslation(
    "form-index",
    "FORM INDEX",
    "Sistema editorial interactivo.",
    "CASE SYSTEM / MOTION EDITORIAL / MOTOR DE PRESENTACION",
    [
      {
        title: "Escenario sticky",
        text:
          "Las secciones se leen como un escenario dirigido, con progreso y foco en lugar de bloques estaticos.",
      },
      {
        title: "Gramatica de motion",
        text:
          "Opacidad, escala, blur, imagen y texto trabajan como estructura de lectura, no como efecto decorativo.",
      },
      {
        title: "Base reusable",
        text:
          "La arquitectura puede adaptarse a archivo, lookbook, lanzamiento de producto o presentacion multilingue.",
      },
    ],
  ),
  "arcwave-integrations": generatedStoryTranslation(
    "arcwave-integrations",
    "ARCWAVE",
    "Sistema de interfaz para infraestructura tecnica.",
    "CASE SYSTEM / INTERFAZ DE INFRAESTRUCTURA",
    [
      {
        title: "Capa conectada",
        text:
          "Telecom, redes, electricidad, seguridad, EV charging, smart home y audio se presentan como un sistema tecnico.",
      },
      {
        title: "Rutas de servicio",
        text:
          "Cada servicio tiene entrada propia, pero la interfaz mantiene al comprador dentro de una misma logica de instalacion.",
      },
      {
        title: "Brief de presupuesto",
        text:
          "La solicitud convierte incertidumbre tecnica en un brief de instalacion mas claro antes del primer contacto.",
      },
    ],
  ),
  "casa-nube": generatedStoryTranslation(
    "casa-nube",
    "Casa Nube",
    "Sistema hospitality multilingue.",
    "CASE SYSTEM / HOSPITALITY FOUNDATION / NEGOCIO LOCAL",
    [
      {
        title: "Entrada calida",
        text:
          "La homepage funciona como fachada digital y mantiene acciones practicas cerca desde el primer scroll.",
      },
      {
        title: "Menu web",
        text:
          "El menu se estructura como interfaz legible, sin depender de un PDF o de redes sociales dispersas.",
      },
      {
        title: "Accion mobile-first",
        text:
          "Horario, mapa, reserva, WhatsApp e Instagram quedan disponibles para la decision real del visitante.",
      },
    ],
  ),
  "print-border-studio": generatedStoryTranslation(
    "print-border-studio",
    "Print Border Studio",
    "Sistema de preparacion print fine-art.",
    "CASE SYSTEM / HERRAMIENTA DE PRODUCCION / WORKFLOW PRINT",
    [
      {
        title: "Motor de bordes",
        text:
          "Margenes de museo, formatos y equilibrio visual se controlan desde una superficie enfocada de preparacion.",
      },
      {
        title: "Preview e inspeccion",
        text:
          "La obra permanece como objeto principal de decision mientras controles, modos y revision sostienen precision.",
      },
      {
        title: "Salida preparada",
        text:
          "La cola y los estados de exportacion convierten una tarea manual en un workflow repetible para estudio.",
      },
    ],
  ),
};

export const spanishCaseStoryTranslations: Record<string, CaseStoryTranslation> = {
  ...generatedSpanishCaseStoryTranslations,
  "house-of-lune": {
    label: "CASE SYSTEM / BASE DISPONIBLE / SUPERFICIE DE PRODUCTO",
    headline: "House of Lune",
    subheadline: "Una maison cinematográfica para objetos de lujo.",
    summary:
      "Una superficie premium de presentación de producto para objetos de lujo, consulta privada y storytelling visual. El caso muestra cómo joyería, moda y productos coleccionables pueden superar los grids ecommerce genéricos y convertirse en una maison digital controlada.",
    proofClaim:
      "El comercio de lujo se convierte en sistema cuando atmósfera, foco de producto, confianza y consulta privada se mueven como una sola superficie.",
    evidencePoints: [
      "Los productos se presentan como objetos raros, no como inventario de catálogo.",
      "La conversión se vuelve privada y basada en cita, sustituyendo la presión de checkout por confianza.",
      "Rutas, páginas dinámicas de producto, contenido editorial e ingeniería lista para despliegue trabajan juntas.",
    ],
    systemTags: [
      "Producto de lujo",
      "Consulta privada",
      "Varios idiomas",
      "Páginas dinámicas de producto",
      "Movimiento editorial",
      "Base disponible",
    ],
    systemLayers: [
      {
        title: "Dirección visual",
        text:
          "Moonlit Object Theatre: superficies casi negras, tipografía marfil cálida, luz controlada e imagen de producto tratada como evidencia material.",
      },
      {
        title: "Arquitectura de contenido",
        text:
          "Homepage, colección, detalle de producto, craft, filosofía, journal y contacto se organizan como un solo sitio de presentación de producto para comercio privado.",
      },
      {
        title: "Gramática de motion",
        text:
          "Reveals lentos, transiciones suaves, deriva de imagen y tensión en hover marcan foco sin convertir el lujo en ruido.",
      },
      {
        title: "Interacción / consulta",
        text:
          "Private viewing, solicitudes de disponibilidad y lenguaje de cita guían hacia un contacto considerado en lugar de comportamiento buy-now.",
      },
      {
        title: "Estructura responsive",
        text:
          "La versión móvil conserva atmósfera, foco de producto y ritmo editorial dentro de una lógica compacta de maison privada.",
      },
      {
        title: "Front-end de producción",
        text:
          "Base responsive con Next.js App Router, datos de producto estructurados, componentes editoriales reutilizables, rutas preparadas para metadatos, Open Graph y despliegue en Cloudflare Workers.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        alt: "Video walkthrough de House of Lune",
        label: "Recorrido del sistema",
        caption:
          "La superficie completa muestra una ruta maison: entrada cinematográfica, foco de producto, ritmo editorial y conversión privada.",
      },
      {
        id: "threshold",
        alt: "Hero de escritorio de House of Lune",
        label: "Umbral",
        caption:
          "El hero establece deseo antes que utilidad: oscuridad, luz controlada y posicionamiento guiado por el objeto.",
      },
      {
        id: "desktop-1",
        alt: "Composición homepage de House of Lune",
        label: "Entrada maison",
        caption:
          "La superficie inicial presenta el universo maison con ritmo controlado, espacio editorial y atmósfera guiada por el objeto.",
      },
      {
        id: "desktop-2",
        alt: "Sección editorial de producto House of Lune",
        label: "Campo editorial de producto",
        caption:
          "El deseo de producto se sostiene con ritmo editorial antes de pedir una acción comercial.",
      },
      {
        id: "collection",
        alt: "Superficie de colección House of Lune",
        label: "Lógica de colección",
        caption:
          "Las páginas de colección funcionan como un sistema de salón privado, no como un grid denso de producto.",
      },
      {
        id: "craft",
        alt: "Página de craftsmanship House of Lune",
        label: "Narrativa craft",
        caption:
          "El contenido de craftsmanship aporta confianza, contexto material y profundidad editorial al universo de producto.",
      },
      {
        id: "inquiry",
        alt: "Superficie de consulta privada House of Lune",
        label: "Consulta privada",
        caption:
          "La conversión se plantea como cita privada y conversación de disponibilidad, no como checkout genérico.",
      },
      {
        id: "desktop-6",
        alt: "Superficie de filosofía maison House of Lune",
        label: "Filosofía maison",
        caption:
          "La capa de marca da al sistema comercial una posición más silenciosa: valores, contención y contexto de lujo.",
      },
      {
        id: "desktop-7",
        alt: "Superficie editorial y journal House of Lune",
        label: "Capa editorial",
        caption:
          "El contenido tipo journal extiende el sistema de producto hacia una base reutilizable de storytelling.",
      },
      {
        id: "mobile",
        alt: "Superficie móvil de colección House of Lune",
        label: "Superficie móvil",
        caption: "Teatro de producto compacto en móvil, con ritmo de lujo.",
      },
      {
        id: "mobile-nav",
        alt: "Superficie de navegación móvil House of Lune",
        label: "Navegación móvil",
        caption:
          "La navegación compacta traduce el recorrido maison privado a una superficie de mano.",
      },
      {
        id: "mobile-product",
        alt: "Detalle de producto móvil House of Lune",
        label: "Producto móvil",
        caption:
          "El detalle de producto sigue siendo objetual y privado incluso en un frame móvil estrecho.",
      },
      {
        id: "mobile-editorial",
        alt: "Contenido editorial móvil House of Lune",
        label: "Editorial móvil",
        caption:
          "La profundidad editorial se mantiene en la versión de mano sin caer en un catálogo simple.",
      },
      {
        id: "mobile-inquiry",
        alt: "Formulario de consulta privada móvil House of Lune",
        label: "Consulta móvil",
        caption:
          "La solicitud privada sigue siendo calmada y basada en cita también en móvil.",
      },
    ],
    interactionLogic:
      "Aquí el motion no decora. Marca foco de producto, reveal, navegación, consulta y confianza. El ritmo es lo bastante lento para sentirse privado, pero lo bastante estructurado para mantener clara la dirección comercial.",
    commercialLogic:
      "House of Lune desplaza el comercio premium desde la presión de inventario hacia el contacto seleccionado: primero deseo, luego prueba, y consulta cuando el usuario está preparado.",
    technicalFoundation: [
      "Next.js App Router con TypeScript.",
      "Rutas preparadas para inglés, francés y español.",
      "Páginas dinámicas de producto con datos estructurados.",
      "Componentes editoriales reutilizables y primitives de motion.",
      "Metadatos Open Graph y preparación de imágenes.",
      "Despliegue en Cloudflare Workers mediante OpenNext.",
    ],
    availability: {
      label: "Disponible como base de sistema.",
      summary:
        "House of Lune puede adaptarse a un producto de lujo, moda, joyería, objeto coleccionable o sistema de comercio privado por encargo.",
      bestFor: ["Joyería", "Moda", "Objetos coleccionables", "Comercio premium"],
      adaptationIncludes: [
        "Adaptación de marca y contenido",
        "Ajuste de estructura de producto",
        "Personalización de flujo de consulta",
        "Pulido responsive de producción",
        "Front-end listo para despliegue",
      ],
      licensingNote:
        "La exclusividad puede discutirse para encargos seleccionados. Propiedad final, contenido, reutilización visual y términos de adaptación se definen por proyecto.",
      ctaLabel: "Adaptar este sistema",
    },
    links: [
      {
        label: "Ver caso live",
        href: "https://house-of-lune.brenychinfo.workers.dev/en",
      },
      {
        label: "Repositorio",
        href: "https://github.com/brenychstudio/House-of-Lune",
      },
    ],
    seo: {
      title: "House of Lune - superficie premium de producto",
      description:
        "Sitio premium para objetos de lujo, consulta privada y storytelling visual, construido como una maison digital controlada.",
      ogTitle: "House of Lune - producto premium como sistema",
      ogDescription:
        "Una superficie de producto donde atmósfera, confianza y consulta privada trabajan como una sola ruta comercial.",
      alt: "Superficie premium de producto House of Lune",
    },
  },
  "barcelona-private-advisory": {
    label: "CASE SYSTEM / INTELIGENCIA DE PROPIEDAD PRIVADA",
    headline: "Barcelona Private Advisory",
    subheadline: "Sistema de inteligencia para propiedad privada.",
    summary:
      "Un concepto de sitio web de alta confianza para asesoría inmobiliaria privada, recorridos de compra curados e interfaces premium de consulta. El prototipo se organiza alrededor de intención de comprador, Barcelona Lens, señales de adquisición, shortlist dossiers, inspección de propiedad y entrega de asesoría.",
    proofClaim:
      "La asesoría privada se convierte en sistema cuando intención de comprador, inteligencia de distrito, candidatos priorizados, evidencia de shortlist, inspección y entrega de consulta avanzan como una ruta guiada.",
    evidencePoints: [
      "La interfaz empieza por la intención de comprador antes de que las propiedades compitan por atención.",
      "Barcelona Lens hace visible la inteligencia de distrito dentro de la decisión inmobiliaria.",
      "El resultado final es un dossier preparado para asesoría y solicitud de visita, no una exploración genérica.",
    ],
    systemTags: [
      "Inteligencia de propiedad privada",
      "Barcelona Lens",
      "Shortlist dossier",
      "Entrega de consulta",
      "Bilingüe",
      "Base disponible",
    ],
    systemLayers: [
      {
        title: "Capa de intención de comprador",
        text:
          "La experiencia empieza con contexto de adquisición, para que el brief del comprador guíe la búsqueda antes de que los listados dominen.",
      },
      {
        title: "Barcelona Lens Field",
        text:
          "Inteligencia de distrito, encaje de lifestyle y señales de localización se vuelven material visible de decisión.",
      },
      {
        title: "Superficie de búsqueda privada",
        text:
          "Las tarjetas de propiedad se tratan como señales de adquisición con preparación, prioridad y contexto de encaje del comprador.",
      },
      {
        title: "Private Shortlist Dossier",
        text:
          "Las selecciones guardadas se convierten en dossier para comparar, revisar alternativas y preparar una conversación con asesor.",
      },
      {
        title: "Entrega de consulta",
        text:
          "Contexto de búsqueda, propiedades seleccionadas, calendario y notas del comprador se vuelven una solicitud de visita estructurada.",
      },
      {
        title: "Estructura responsive",
        text:
          "La versión móvil mantiene legible el mismo modelo de inteligencia: lens, dossier, field card, inspección, request brief y estados preparados para varios idiomas.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        alt: "Video walkthrough de Barcelona Private Advisory",
        label: "Recorrido de inteligencia",
        caption:
          "El recorrido atraviesa lens, búsqueda privada, shortlist dossier, inspección de propiedad y entrega de asesoría.",
      },
      {
        id: "threshold",
        alt: "Hero de inteligencia de propiedad privada Barcelona Private Advisory",
        label: "Umbral de inteligencia",
        caption:
          "El hero posiciona el proyecto como un sistema de inteligencia de propiedad privada: brief, lens, señal, dossier y acción.",
      },
      {
        id: "collection",
        alt: "Lens de intención de comprador de Barcelona Private Advisory",
        label: "Intent lens",
        caption:
          "La intención de comprador define el lens antes de que las propiedades compitan por atención.",
      },
      {
        id: "craft",
        alt: "Barcelona Lens Field de Barcelona Private Advisory",
        label: "Barcelona Lens",
        caption:
          "La inteligencia de distrito se hace visible, conectando intención de adquisición con ritmo y encaje de barrio.",
      },
      {
        id: "desktop-3",
        alt: "Private shortlist dossier de Barcelona Private Advisory",
        label: "Shortlist dossier",
        caption:
          "Las propiedades guardadas se convierten en un Private Shortlist Dossier para comparación, revisión de alternativas y entrega.",
      },
      {
        id: "inquiry",
        alt: "Señal de adquisición guiada por medios en Barcelona Private Advisory",
        label: "Señal de adquisición",
        caption:
          "Las tarjetas visuales convierten la exploración inmobiliaria en señales de adquisición con prioridad y encaje del comprador.",
      },
      {
        id: "desktop-5",
        alt: "Prueba visual lista para enviar en Barcelona Private Advisory",
        label: "Prueba visual",
        caption:
          "La shortlist se convierte en prueba visual, lista para pasar de la exploración a una conversación preparada.",
      },
      {
        id: "desktop-6",
        alt: "District lens expandido de Barcelona Private Advisory",
        label: "Lens expandido",
        caption:
          "Mapa, notas de distrito, índice de escaneo rápido y propiedades seleccionadas permanecen visibles en una sola superficie.",
      },
      {
        id: "desktop-7",
        alt: "Lógica de shortlist de asesoría Barcelona Private Advisory",
        label: "Shortlist de asesoría",
        caption:
          "Un brief de comprador se traduce en candidatos priorizados, no en otro grid de listados.",
      },
      {
        id: "desktop-8",
        alt: "Grid de candidatos priorizados Barcelona Private Advisory",
        label: "Candidatos priorizados",
        caption:
          "Precio, señal, preparación y encaje se mantienen visibles para que la comparación conserve contexto de asesoría.",
      },
      {
        id: "desktop-9",
        alt: "Pantalla de inteligencia de propiedad Barcelona Private Advisory",
        label: "Inteligencia de propiedad",
        caption:
          "El detalle de propiedad funciona como evaluación guiada con media, prioridad, fit notes y resumen de asesor.",
      },
      {
        id: "desktop-10",
        alt: "Preview de inspección Barcelona Private Advisory",
        label: "Preview de inspección",
        caption:
          "La inspección mantiene imagen, encaje y preparación juntos antes de solicitar una visita.",
      },
      {
        id: "desktop-11",
        alt: "Revisión de galería Barcelona Private Advisory",
        label: "Revisión de galería",
        caption:
          "La galería sostiene una inspección privada enfocada sin convertir la experiencia en un lightbox de portal.",
      },
      {
        id: "desktop-12",
        alt: "Página de método de asesoría privada Barcelona Private Advisory",
        label: "Método de asesoría",
        caption:
          "La página de método explica el sistema: brief, lens, señal, dossier y acción.",
      },
      {
        id: "desktop-13",
        alt: "Entrega de consulta Barcelona Private Advisory",
        label: "Entrega de consulta",
        caption:
          "El resultado final convierte búsqueda, propiedades seleccionadas y calendario en una solicitud de visita lista para copiar.",
      },
      {
        id: "mobile",
        alt: "Hero y lens móvil de Barcelona Private Advisory",
        label: "Lens móvil",
        caption:
          "La versión móvil abre con la misma estructura de brief, lens, señal, dossier y acción.",
      },
      {
        id: "mobile-nav",
        alt: "Señal de adquisición móvil Barcelona Private Advisory",
        label: "Señal móvil",
        caption:
          "Las tarjetas móviles conservan señal de adquisición, prioridad y acciones guardadas sin convertirse en un feed ruidoso.",
      },
      {
        id: "mobile-inquiry",
        alt: "Dossier móvil preparado para asesor Barcelona Private Advisory",
        label: "Dossier móvil",
        caption:
          "Las propiedades seleccionadas se convierten en un dossier para asesor con la intención de comprador todavía visible.",
      },
      {
        id: "mobile-gallery",
        alt: "Menú móvil de asesoría privada Barcelona Private Advisory",
        label: "Menú móvil",
        caption:
          "El menú de asesoría privada mantiene ruta principal, confianza y acciones de consulta en un espacio compacto.",
      },
      {
        id: "mobile-shortlist",
        alt: "Shortlist dossier móvil Barcelona Private Advisory",
        label: "Shortlist móvil",
        caption:
          "Las propiedades guardadas se convierten en un dossier móvil para revisar alternativas y preparar la solicitud.",
      },
      {
        id: "mobile-field",
        alt: "Field card móvil Barcelona Private Advisory",
        label: "Field card móvil",
        caption:
          "Las field cards mantienen preparación, precio guía, ruta de solicitud y estado guardado en un escaneo compacto.",
      },
      {
        id: "mobile-detail",
        alt: "Detalle de propiedad móvil Barcelona Private Advisory",
        label: "Propiedad móvil",
        caption:
          "El detalle mantiene recomendación, archivo de adquisición, precio guía y acción de galería cerca.",
      },
      {
        id: "mobile-inspection",
        alt: "Galería de inspección móvil Barcelona Private Advisory",
        label: "Inspección móvil",
        caption:
          "El modo de inspección privada ofrece una revisión de imagen enfocada sin salir de la ruta de asesoría.",
      },
      {
        id: "mobile-method",
        alt: "Método de asesoría móvil Barcelona Private Advisory",
        label: "Método móvil",
        caption:
          "El método móvil explica por qué la selección privada funciona mejor que la exploración de catálogo.",
      },
      {
        id: "mobile-request",
        alt: "Request brief móvil Barcelona Private Advisory",
        label: "Request brief móvil",
        caption:
          "Request Brief convierte el mensaje final en contexto de asesoría estructurado antes del primer contacto.",
      },
      {
        id: "mobile-viewing",
        alt: "Solicitud de viewing path móvil Barcelona Private Advisory",
        label: "Viewing path móvil",
        caption:
          "Viewing path captura origen, siguiente acción, calendario preferido y notas de comprador sin parecer un formulario genérico.",
      },
    ],
    interactionLogic:
      "El movimiento sostiene la confianza del comprador: reveals calmados, respuesta de shortlist, revisión de inspección y entrega de consulta permanecen contenidos para que el valor de asesoría siga claro.",
    commercialLogic:
      "Barcelona Private Advisory desplaza la exploración inmobiliaria desde volumen de portal hacia inteligencia de propiedad privada: primero brief, luego district lens, después dossier y entrega cuando el comprador está listo.",
    technicalFoundation: [
      "Astro / React islands / TypeScript",
      "Estructura preparada para varios idiomas",
      "Lógica UI de búsqueda, shortlist y dossier",
      "Recorrido de comprador responsive",
      "Preparación de metadatos / Open Graph",
      "Front-end listo para despliegue",
    ],
    availability: {
      label: "Disponible como base de asesoría.",
      summary:
        "Barcelona Private Advisory puede adaptarse a una superficie de real estate, hospitality, destino o servicio privado por encargo.",
      bestFor: ["Asesoría inmobiliaria", "Consultoría privada", "Hospitality", "Servicios curados"],
      adaptationIncludes: [
        "Adaptación de territorio y contenido",
        "Estructura de búsqueda y shortlist",
        "Personalización de entrada privada",
        "Configuración de rutas bilingües",
        "Front-end listo para despliegue",
      ],
      licensingNote:
        "Propiedad final, exclusividad territorial, contenido, reutilización de medios y términos de adaptación se definen por proyecto.",
      ctaLabel: "Adaptar este sistema",
    },
    links: [
      {
        label: "Ver caso live",
        href: "https://barcelona-private-advisory.pages.dev/",
      },
      {
        label: "Repositorio",
        href: "https://github.com/brenychstudio/Barcelona-Private-Advisory",
      },
    ],
    seo: {
      title: "Barcelona Private Advisory - asesoría privada premium",
      description:
        "Sitio de alta confianza para asesoría inmobiliaria privada, recorridos de compra curados y consulta premium en Barcelona.",
      ogTitle: "Barcelona Private Advisory - consulta privada como sistema",
      ogDescription:
        "Intención de comprador, Barcelona Lens, shortlist dossier y entrega de consulta organizados en una ruta premium.",
      alt: "Interfaz de asesoría privada Barcelona Private Advisory",
    },
  },
  creatorops: {
    label: "CASE SYSTEM / WORKFLOW TOOL / CREATOR PUBLISHING",
    headline: "CreatorOps",
    subheadline: "Sistema de interfaz para flujo de trabajo de creadores.",
    summary:
      "CreatorOps es un sistema de flujo de trabajo para creadores orientado a la exportación. Convierte recursos visuales dispersos en un Week Pack listo para publicar: Library, Smart Mix, planificación, captions, exportación ZIP, revisión para cliente y entrega de perfil.",
    proofClaim:
      "El flujo de trabajo de creadores se convierte en sistema cuando recursos dispersos, planificación, captions, exportación, revisión y entrega avanzan hacia un Week Pack listo para publicar.",
    evidencePoints: [
      "Los recursos visuales entran al sistema como candidatos de publicación seleccionables.",
      "Export ensambla un Week Pack listo para publicar en lugar de dejar contenido disperso entre herramientas.",
      "Client Review, Profile Handoff y Media Converter mantienen aprobación y utilidad dentro de un entorno de producto calmado.",
    ],
    systemTags: [
      "Flujo de trabajo de creadores",
      "Smart Mix",
      "Client Review",
      "Media Converter",
      "Prototipo React",
      "Interfaz de producto",
    ],
    systemLayers: [
      {
        title: "Arquitectura de flujo",
        text:
          "Library, Smart Mix, Planner, Captions, Export, Client Review, Profile Handoff / Bio Builder y Media Converter se organizan como un solo flujo guiado de publicación para creadores.",
      },
      {
        title: "Capa de decisión",
        text:
          "Smart Mix prioriza combinaciones, evita repetición y convierte recursos visuales dispersos en candidatos de publicación más claros.",
      },
      {
        title: "Planificación orientada a export",
        text:
          "Planner, Captions y Export transforman visuales seleccionados en un Week Pack estructurado, llevando el flujo hacia una salida usable.",
      },
      {
        title: "Revisión para cliente",
        text:
          "Feedback y aprobación se tratan como una capa de producto, manteniendo la revisión de colaboradores calmada y estructurada.",
      },
      {
        title: "Entrega y utilidad",
        text:
          "Profile Handoff / Bio Builder y Media Converter mantienen entrega y utilidad dentro del entorno de producto sin romper el tono premium.",
      },
      {
        title: "Interfaz de producto responsive",
        text:
          "React, TypeScript, Vite y Tailwind sostienen un prototipo listo para beta con lógica local-first, superficies con estado, interfaz de producto responsive y dirección preparada para exportación.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        alt: "Video walkthrough de CreatorOps",
        label: "Recorrido del sistema",
        caption:
          "El recorrido muestra publicación para creadores, revisión para cliente, Profile Handoff y herramientas de utilidad dentro de un prototipo de interfaz de producto.",
      },
      {
        id: "threshold",
        alt: "Hero de interfaz de flujo CreatorOps",
        label: "Umbral de flujo",
        caption:
          "El hero posiciona CreatorOps como un sistema de interfaz calmado para publicación de creadores.",
      },
      {
        id: "desktop-1",
        alt: "Pantalla de overview de flujo CreatorOps",
        label: "Overview de flujo",
        caption:
          "El producto se plantea como un espacio de trabajo orientado a exportación para convertir recursos dispersos en un Week Pack listo para publicar.",
      },
      {
        id: "desktop-2",
        alt: "Pantalla de planificación weekly focus CreatorOps",
        label: "Week focus",
        caption:
          "La planificación semanal y de campaña permanece visible sin convertirse en un producto pesado de calendario.",
      },
      {
        id: "desktop-3",
        alt: "Pantalla de pricing plans CreatorOps",
        label: "Pricing plans",
        caption:
          "La superficie de planes presenta el prototipo como una dirección seria de producto para flujos de trabajo de creadores.",
      },
      {
        id: "desktop-4",
        alt: "Pantalla roadmap CreatorOps",
        label: "Roadmap",
        caption:
          "Roadmap muestra cómo el flujo puede expandirse con revisión, herramientas, automatización y soporte de publicación.",
      },
      {
        id: "desktop-5",
        alt: "Pantalla waitlist CreatorOps",
        label: "Waitlist",
        caption:
          "Waitlist convierte interés de producto en una entrada beta contenida.",
      },
      {
        id: "collection",
        alt: "Grid de content library CreatorOps",
        label: "Library grid",
        caption:
          "Los recursos visuales entran al sistema como candidatos de publicación seleccionables.",
      },
      {
        id: "desktop-7",
        alt: "Pantalla de library expandida CreatorOps",
        label: "Library expandida",
        caption:
          "Selección, ranking y contexto de contenido siguen legibles dentro del entorno de producto oscuro.",
      },
      {
        id: "craft",
        alt: "Pantalla de publishing flow CreatorOps",
        label: "Publishing flow",
        caption:
          "Visuales seleccionados, captions y señales de calendario se convierten en un flujo preparado para exportación.",
      },
      {
        id: "desktop-10",
        alt: "Pantalla artwork detail CreatorOps",
        label: "Artwork detail",
        caption:
          "Artwork detail permite inspección, contexto de contenido y decisiones de entrega sin salir del flujo.",
      },
      {
        id: "desktop-11",
        alt: "Pantalla de revisión de cliente CreatorOps",
        label: "Revisión de cliente",
        caption:
          "La respuesta del cliente se convierte en una capa de revisión calmada, no en un hilo de comentarios disperso.",
      },
      {
        id: "inquiry",
        alt: "Pantalla Client Review CreatorOps",
        label: "Client Review",
        caption:
          "Colaboradores pueden aprobar, comentar y refinar dirección de contenido dentro del producto.",
      },
      {
        id: "desktop-13",
        alt: "Pantalla Profile Handoff CreatorOps",
        label: "Profile Handoff",
        caption:
          "El pack de publicación continúa hacia contexto de perfil, dirección bio y salida orientada al creador.",
      },
      {
        id: "desktop-14",
        alt: "Interfaz Media Converter CreatorOps",
        label: "Media Converter",
        caption:
          "Las herramientas de utilidad permanecen dentro del entorno de producto sin romper el tono premium.",
      },
    ],
    interactionLogic:
      "El motion sostiene la calma del producto: transiciones de ruta, estados modulares, checkpoints de exportación, superficies de revisión y capas de utilidad ayudan a entender el progreso sin enterrar la interfaz.",
    commercialLogic:
      "CreatorOps desplaza las herramientas de creadores desde recursos dispersos y dashboards genéricos hacia un flujo orientado a exportación: seleccionar, priorizar, planificar, escribir captions, revisar, exportar y entregar contenido visual.",
    technicalFoundation: [
      "React + TypeScript + Vite",
      "Product UI con Tailwind CSS",
      "Lógica de flujo de trabajo y superficies con estado",
      "Estructura responsive de interfaz",
      "Arquitectura de flujo orientada a exportación",
      "Despliegue en Cloudflare Pages",
    ],
    availability: {
      label: "Disponible como dirección de flujo.",
      summary:
        "CreatorOps puede informar una herramienta a medida para creadores, un sistema de operaciones de contenido, un flujo interno de publicación o un prototipo de interfaz orientado a exportación.",
      bestFor: ["Herramientas para creadores", "Equipos de contenido", "Flujos de publicación", "Prototipos de producto"],
      adaptationIncludes: [
        "Modelado de flujo a medida",
        "Dirección de interfaz de producto",
        "Arquitectura de revisión y entrega",
        "Planificación de capas de utilidad",
      ],
      licensingNote:
        "Disponible como referencia para una dirección de producto a medida por encargo, no como reutilización directa del concepto actual.",
      ctaLabel: "Hablar de una dirección similar",
    },
    links: [
      {
        label: "Ver caso live",
        href: "https://creatorops.pages.dev/",
      },
      {
        label: "Repositorio",
        href: "https://github.com/brenychstudio/CreatorOps",
      },
    ],
    seo: {
      title: "CreatorOps - sistema de flujo de trabajo para creadores",
      description:
        "CreatorOps convierte recursos visuales dispersos en un Week Pack listo para publicar con Library, Smart Mix, exportación y revisión.",
      ogTitle: "CreatorOps - flujo de trabajo de creadores como sistema",
      ogDescription:
        "Un prototipo de interfaz de producto orientado a exportación para equipos de contenido y creadores.",
      alt: "Interfaz CreatorOps para flujo de trabajo de creadores",
    },
  },
};

export const spanishImmersiveTranslations: Record<string, ImmersiveTranslation> = {
  whisper: {
    tagline:
      "Una exposición cinematográfica Web / XR donde la fotografía se convierte en una experiencia inmersiva para coleccionistas.",
    medium: "Exposición Web / XR interactiva",
    mode: "V1 avanzada en funcionamiento",
    stack: "React, Vite, Three.js, WebXR, Quest VR, AR preview, Cloudflare Pages",
    description:
      "WHISPER combina fotografía conceptual, un sitio web editorial de arte, WebXR en navegador, navegación con manos en Quest VR, catálogo de prints para coleccionistas, rutas de print compartibles y preview AR para ediciones enmarcadas.",
    status: "V1 avanzada / en progreso",
    statusNote:
      "El sitio público, la experiencia WebXR, la navegación con manos en Quest, el catálogo de prints y el primer flujo de preview AR funcionan. El pulido XR final, recursos AR adicionales y refinamientos móvil/tablet siguen en curso.",
    supportLabel: "Caso inmersivo insignia",
    ctaLabel: "Abrir caso WHISPER",
    searchContent: {
      shortDescription:
        "Un sistema cinematográfico web / XR para archivos fotográficos, storytelling espacial y presentación orientada a coleccionistas.",
      longDescription:
        "WHISPER demuestra cómo un archivo fotográfico puede convertirse en una superficie viva de exposición digital mediante web editorial, WebXR, prueba Quest VR, rutas de print para coleccionistas y dirección AR preview.",
      tags: ["Exposición web interactiva", "WebXR", "Archivo espacial", "Presentación para coleccionistas"],
      type: "Exposición web inmersiva / sistema de archivo espacial.",
      audience:
        "Artistas, galerías, proyectos culturales, coleccionistas y exposiciones digitales experimentales.",
      problem:
        "Los proyectos fotográficos y de archivo suelen volverse galerías estáticas, perdiendo atmósfera, secuencia y presencia espacial.",
      approach:
        "WHISPER expande el archivo hacia una dirección cinematográfica Web / XR con medios atmosféricos, navegación espacial, lógica de coleccionista y capas de prueba inmersiva.",
      outcome:
        "El caso demuestra cómo un archivo de arte puede convertirse en una superficie digital viva, no en un grid pasivo de portfolio.",
      productionFacts: [
        "Front-end interactivo",
        "Presentación de medios cinematográficos",
        "Dirección WebXR",
        "Lógica de archivo",
        "Prueba espacial",
        "Presentación responsive",
      ],
      relatedServices: ["Sistemas web interactivos", "Landing page de producto"],
    },
    videos: [
      {
        index: 0,
        alt: "Video walkthrough del sitio de escritorio WHISPER",
        label: "Recorrido de escritorio del sitio",
        caption:
          "Navegación de escritorio por el sitio editorial, páginas de series, catálogo de prints y flujo orientado a coleccionistas.",
      },
      {
        index: 1,
        alt: "Captura de exposición WHISPER en Meta Quest 3",
        label: "Captura de exposición Meta Quest 3",
        caption:
          "Captura en visor que muestra la exposición espacial, la experiencia Quest VR y la prueba de navegación con manos.",
      },
    ],
    frames: [
      {
        index: 0,
        alt: "Hero de escritorio WHISPER",
        label: "Hero",
        caption:
          "Hero de homepage que establece WHISPER como exposición cinematográfica silenciosa, no como galería convencional.",
      },
      {
        index: 1,
        alt: "Frame de escritorio WHISPER 01",
        label: "Sistema de series",
        caption:
          "Presentación de series que conecta Whisper of the Sea y Whisper of the Forest mediante una interfaz editorial oscura.",
      },
      {
        index: 2,
        alt: "Frame de escritorio WHISPER 02",
        label: "Grid editorial",
        caption:
          "Puesta en escena museística de imagen y video con contraste controlado y ritmo visual lento.",
      },
      {
        index: 3,
        alt: "Frame de escritorio WHISPER 03",
        label: "Ritmo de galería",
        caption:
          "Superficie de galería diseñada alrededor del silencio, fragmentos y ritmo centrado en la obra.",
      },
      {
        index: 4,
        alt: "Frame de escritorio WHISPER 04",
        label: "Serie Sea",
        caption:
          "Puesta en escena de Whisper of the Sea con oscuridad cinematográfica y textura natural controlada.",
      },
      {
        index: 5,
        alt: "Frame de escritorio WHISPER 05",
        label: "Serie Forest",
        caption:
          "Dirección visual de Whisper of the Forest usando presencia, memoria y puesta en escena natural silenciosa.",
      },
      {
        index: 6,
        alt: "Frame de escritorio WHISPER 06",
        label: "Página de serie",
        caption:
          "Composición de página que equilibra atmósfera full-bleed, foco en obra y navegación contenida.",
      },
      {
        index: 7,
        alt: "Frame de escritorio WHISPER 07",
        label: "Catálogo de prints",
        caption:
          "Catálogo de prints y superficie de detalle que conectan la exposición con una continuación para coleccionistas.",
      },
      {
        index: 8,
        alt: "Frame de escritorio WHISPER 08",
        label: "Detalle de print",
        caption:
          "Flujo de detalle con información de edición, materialidad y entrega orientada a compra.",
      },
      {
        index: 9,
        alt: "Frame de escritorio WHISPER 09",
        label: "Preview AR",
        caption:
          "Superficie de preview AR que conecta la lógica de edición enmarcada con una vista previa orientada a cliente.",
      },
      {
        index: 10,
        alt: "Frame de escritorio WHISPER 10",
        label: "Capa de notas",
        caption:
          "Capa de notas y créditos que presenta el proyecto como un sistema conceptual de exposición.",
      },
    ],
    seo: {
      title: "WHISPER - sistema cinematográfico Web / XR",
      description:
        "WHISPER convierte un archivo fotográfico en una exposición cinematográfica Web / XR con Quest VR, prints y preview AR.",
      ogTitle: "WHISPER - archivo espacial y exposición Web / XR",
      ogDescription:
        "Un sistema inmersivo para archivos fotográficos, storytelling espacial y presentación orientada a coleccionistas.",
      alt: "Exposición inmersiva WHISPER Web / XR",
    },
  },
  webhero: {
    tagline:
      "Un sistema visual web-first para modulos cinematicos, Living Images, obras Gaussian Splat, Art Room y futuros adaptadores XR.",
    medium: "Visual web",
    mode: "R&D avanzado",
    stack: "Vite, React, TypeScript, WebGL, GLSL / Canvas, Gaussian Splat viewer, SHARP / 3DGS pipeline",
    description:
      "WEBHERO explora el futuro de las webs premium como entornos vivos. Reune WebGL Stage System, backdrops cinematograficos, Living Images, obras Living Splat, Art Room y una ruta controlada hacia XR.",
    status: "Prototipo avanzado",
    statusNote:
      "Stage System, Backdrops, Living Images, Living Splat y Art Room funcionan como modulos demostrables. Living Art Mixer sigue en investigacion activa.",
    supportLabel: "Sistema R&D",
    ctaLabel: "Abrir caso WEBHERO",
    searchContent: {
      shortDescription:
        "Plataforma R&D para modulos de stage cinematico, imagenes vivas, obras Gaussian Splat, Art Room y futuros adaptadores XR.",
      longDescription:
        "WEBHERO demuestra infraestructura visual reusable para webs premium: stages WebGL, backdrops, living image modules, estudios 3DGS y presentacion Art Room dentro de un mismo sistema.",
      tags: ["WebGL stage system", "Living Images", "Gaussian Splat", "Spatial web"],
      type: "Sistemas visuales vivos / infraestructura spatial web.",
      audience:
        "Marcas premium, proyectos culturales, universos de producto y estudios que necesitan sistemas visuales inmersivos respaldados por fuente.",
      problem:
        "Muchas webs visuales premium dependen de fondos decorativos o bloques media aislados que no escalan como sistema.",
      approach:
        "WEBHERO organiza threshold gates, lenguaje de stage, backdrops, living images, splat studies, Art Room y direccion XR en una plataforma modular.",
      outcome:
        "El caso muestra como la infraestructura visual inmersiva puede sostener webs premium y archivos espaciales sin volverse un truco aislado.",
      productionFacts: ["Vite", "React", "TypeScript", "WebGL", "GLSL / Canvas", "Gaussian Splat", "SHARP / 3DGS"],
      relatedServices: ["Sistemas web interactivos", "Landing page premium"],
    },
    seo: {
      title: "WEBHERO - sistema visual web-first",
      description:
        "WEBHERO explora WebGL stages, Living Images, Gaussian Splat, Art Room y direccion XR para webs premium.",
      ogTitle: "WEBHERO - sistemas visuales vivos",
      ogDescription:
        "Una plataforma R&D para convertir imagenes, WebGL y obras espaciales en experiencias web controladas.",
      alt: "Sistema visual WEBHERO",
    },
  },
  "kool-berk": {
    tagline:
      "Un Sonic Object OS para artista electronico donde releases, tracks, EPK y escucha se convierten en una sala WebGL audio-reactiva.",
    medium: "Artist OS sonoro",
    mode: "Prototipo sonoro",
    stack: "Vite, React, TypeScript, R3F, Web Audio, GLSL, Cloudflare Pages",
    description:
      "Kool Berk replantea el sitio de artista como sistema de objeto sonoro: releases inspeccionables, estudios de senal, EPK, contacto y una sala inmersiva de escucha.",
    status: "MVP art-tech",
    statusNote:
      "La ruta principal, el objeto sonoro, walkthrough, sala WebGL y capas de contacto funcionan como prototipo presentable.",
    supportLabel: "Sala sonora WebGL",
    ctaLabel: "Abrir caso Kool Berk",
    searchContent: {
      shortDescription:
        "Sistema audiovisual para artista electronico con releases como objetos, Web Audio y sala WebGL.",
      longDescription:
        "Kool Berk demuestra como un artist site puede dejar de ser link hub y convertirse en archivo de releases, EPK y entorno inmersivo de escucha.",
      tags: ["R3F", "Web Audio", "GLSL", "EPK", "Sonic Room"],
      type: "Artist OS audiovisual / sistema de objeto sonoro.",
      audience: "Artistas electronicos, music labels, EPK premium y proyectos audio-visuales.",
      problem:
        "Los sitios de artistas suelen reducirse a enlaces, embeds y biografia, perdiendo presencia y estructura de release.",
      approach:
        "La interfaz trata releases como objetos, tracks como estudios de senal y escucha como experiencia WebGL audio-reactiva.",
      outcome:
        "El caso convierte presencia musical, EPK y contacto en una superficie inmersiva con logica de producto.",
      productionFacts: ["React", "TypeScript", "R3F", "Web Audio", "GLSL", "Cloudflare Pages"],
      relatedServices: ["Sistemas web interactivos", "Landing page de producto"],
    },
    seo: {
      title: "Kool Berk - Sonic Object OS",
      description:
        "Caso audiovisual donde un artista electronico se presenta mediante releases objeto, EPK y sala WebGL audio-reactiva.",
      ogTitle: "Kool Berk - musica como objeto sonoro",
      ogDescription:
        "Un artist OS inmersivo para releases, tracks, EPK y escucha WebGL.",
      alt: "Interfaz inmersiva Kool Berk Sonic Object OS",
    },
  },
  "presence-os-memory-atlas": {
    tagline:
      "Una interfaz privada de memoria espacial donde fragmentos de archivo personal se revelan por quietud, retorno y atencion.",
    medium: "Archivo espacial",
    mode: "MVP funcional",
    stack: "Vite, React, TypeScript, WebGL, WebXR direction, local-first archive logic",
    description:
      "Presence OS / Memory Atlas transforma archivo personal en campo de memoria vivo: presencia, stillness, cinematic inspect, sala XR y artefactos exportables.",
    status: "MVP funcional",
    statusNote:
      "La ruta web, campo de memoria, inspeccion y direccion XR funcionan como prueba MVP. La capa XR final continua en desarrollo.",
    supportLabel: "Memoria privada",
    ctaLabel: "Abrir caso Presence OS",
    searchContent: {
      shortDescription:
        "Interfaz de memoria espacial donde archivo personal, presencia y atencion forman un campo vivo.",
      longDescription:
        "Presence OS / Memory Atlas demuestra como un archivo local-first puede convertirse en campo cinematico, sala XR y sistema de artefactos exportables.",
      tags: ["Local-first", "Presence OS", "WebXR", "Memory Reel", "Archivo espacial"],
      type: "Interfaz de memoria espacial / archivo personal.",
      audience: "Archivos personales, memoria cultural, artistas, familias, colecciones privadas y productos de presencia.",
      problem:
        "Los archivos personales suelen quedar como carpetas o galerias, sin presencia, retorno ni contexto emocional.",
      approach:
        "El sistema revela fragmentos mediante quietud, atencion, memoria, inspeccion cinematografica y direccion XR.",
      outcome:
        "El caso prueba una ruta sensible para convertir memoria privada en interfaz viva sin ruido de dashboard.",
      productionFacts: ["React", "TypeScript", "WebGL", "Cinematic inspect", "Local-first logic", "WebXR direction"],
      relatedServices: ["Sistemas web interactivos", "Landing page de producto"],
    },
    seo: {
      title: "Presence OS / Memory Atlas - archivo espacial",
      description:
        "Interfaz local-first donde memoria personal, presencia, inspeccion cinematografica y direccion XR forman un archivo vivo.",
      ogTitle: "Presence OS - memoria privada como campo espacial",
      ogDescription:
        "Un sistema de memoria espacial para archivo personal, stillness, retorno y artefactos exportables.",
      alt: "Interfaz Presence OS Memory Atlas",
    },
  },
  "orbit-lens": {
    tagline:
      "Un concepto premium de gafas AI espaciales donde la web se comporta como la interfaz espacial del propio dispositivo.",
    medium: "Product OS espacial",
    mode: "Web-first funcional",
    stack: "Vite, React, TypeScript, GLSL, WebGL, WebXR proof mode",
    description:
      "Orbit Lens sustituye una landing de hardware estandar por un Product OS: campos de inteligencia contextual, Inspect Optics, Reference Orbit, privacidad y modo WebXR opcional.",
    status: "Prototipo funcional",
    statusNote:
      "La experiencia principal, fields, Inspect Optics, Reference Orbit y prueba WebXR funcionan como prototipo de producto ficticio.",
    supportLabel: "Producto espacial",
    ctaLabel: "Abrir caso Orbit Lens",
    searchContent: {
      shortDescription:
        "Concepto de gafas AI espaciales con campos contextuales, Inspect Optics, Reference Orbit y prueba WebXR.",
      longDescription:
        "Orbit Lens demuestra como una web de producto puede adoptar el lenguaje del dispositivo: contexto espacial, optica, privacidad, orbitas de referencia y prueba XR.",
      tags: ["AI eyewear", "WebXR", "Inspect Optics", "Reference Orbit", "GLSL"],
      type: "Product OS espacial / sistema de producto ficticio.",
      audience: "Productos hardware, AI devices, wearables, demos premium y lanzamientos conceptuales.",
      problem:
        "Las landing pages de hardware suelen explicar features desde fuera, sin hacer sentir la interfaz del producto.",
      approach:
        "La experiencia convierte features en campos contextuales, inspeccion optica, orbitas y una prueba WebXR opcional.",
      outcome:
        "El caso prueba una forma mas inmersiva de presentar producto espacial sin perder claridad comercial.",
      productionFacts: ["React", "TypeScript", "WebGL", "GLSL", "WebXR", "Responsive product interface"],
      relatedServices: ["Landing page de producto", "Sistemas web interactivos"],
    },
    seo: {
      title: "Orbit Lens - Product OS espacial",
      description:
        "Concepto premium de gafas AI espaciales con contextual fields, Inspect Optics, Reference Orbit y prueba WebXR.",
      ogTitle: "Orbit Lens - web como interfaz espacial",
      ogDescription:
        "Una landing de producto ficticio que funciona como sistema espacial del dispositivo.",
      alt: "Interfaz Orbit Lens para producto espacial",
    },
  },
};
