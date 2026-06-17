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
    title: "Sistemas front-end premium para superficies web, producto e interfaz inmersiva.",
    body:
      "Brenych Studio crea sistemas de interfaz para sitios premium, lanzamientos de producto, superficies comerciales, archivos espaciales y experiencias digitales que necesitan claridad, presencia y prueba real.",
    ctas: ["Ver proyectos", "Explorar inmersivo", "Iniciar un proyecto"],
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
    title: "Sistemas que se mueven dentro de un campo de scroll vivo.",
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
    title: "Tres rutas para convertir una idea en superficie de interfaz.",
    body:
      "Landing pages premium, demos de producto y sistemas web interactivos para proyectos que necesitan estructura comercial, prueba visual y front-end listo para producción.",
    ctas: ["Iniciar un proyecto", "Ver proyectos relacionados"],
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
    ctas: ["Ver proyectos", "Explorar inmersivo", "Iniciar un proyecto"],
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
    heroTitle: "Landing pages premium para lanzamientos concretos.",
    heroBody:
      "Páginas comerciales independientes para una oferta, producto, servicio, consulta, evento, lista de espera o campaña — construidas como un sistema de interfaz claro, no como una plantilla genérica.",
    primaryCta: "Iniciar un proyecto",
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
    heroTitle: "Landing pages de producto para fundadores y equipos.",
    heroBody:
      "Sistemas de presentación para productos SaaS, herramientas AI, prototipos, demos para fundadores, conversaciones con inversores, listas de espera y validación temprana.",
    primaryCta: "Iniciar un proyecto",
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
    heroTitle: "Sistemas web interactivos para experiencias digitales espaciales.",
    heroBody:
      "Sitios cinematográficos, interfaces atmosféricas, sistemas preparados para WebGL, archivos espaciales y capas de presentación inmersiva para proyectos que necesitan más que una página estática.",
    primaryCta: "Iniciar un proyecto inmersivo",
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

export const spanishCaseStoryTranslations: Record<string, CaseStoryTranslation> = {
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
};
