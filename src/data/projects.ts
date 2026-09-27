import type { ProjectRecord, ProjectRelationship } from "./projectRegistry.types";

// Canonical cross-ecosystem project registry (BSW-CORE-01, Architecture B).
// First five records reviewed in BSW-CORE-01C; classifications approved by the controller.
// Work copy / posters / links: cases.ts and spanishCaseRegistryTranslations.
// Work evidence / limitations: workEvidence.ts and spanishWorkEvidenceTranslations.
// Orbit Lens copy / evidence / poster / links: immersive.ts and spanishImmersiveTranslations.
// Route locale coverage: i18n/routes.ts. Existing public text is reused verbatim.
// Every record added here must pass `npm run core:validate`, which runs inside `npm run build`.

export const projects = [
  {
    id: "aurel-eon-gt",
    publicName: "AUREL EON GT",
    aliases: [],
    vertical: "web-systems",
    origin: "authored-concept",
    maturity: "prototype",
    deployment: "public-demo",
    commercialAvailability: "adaptation-available",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "A cinematic product presentation prototype for a fictional electric grand tourer, built around product states, gallery inspection, drive character and private preview.",
        es: "Una experiencia de lanzamiento para un gran turismo electrico ficticio, con estados cinematograficos, inspeccion visual y preview privada."
      }
    },
    limitations: [
      {
        en: "Keeps the fictional concept honest as an advanced prototype",
        es: "Mantiene el concepto ficticio como prototipo honesto"
      }
    ],
    evidence: [
      {
        kind: "work-case",
        slug: "aurel-eon-gt",
        proves: {
          en: "A fictional premium electric grand tourer launch experience that turns arrival, exterior, light signature, cabin, materiality, drive character, gallery, inspect, product view, and private preview into one cinematic product system.",
          es: "Un lanzamiento ficticio de gran turismo electrico que convierte llegada, exterior, firma luminica, cabina, galeria, inspeccion y preview privada en un sistema cinematografico."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "live-demo",
        kind: "live",
        href: "https://aurel-eon-gt.pages.dev"
      }
    ],
    routes: [
      {
        surface: "work",
        path: "/work/aurel-eon-gt",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "case-poster",
          caseSlug: "aurel-eon-gt"
        },
        alt: {
          en: "AUREL EON GT cinematic electric grand tourer hero",
          es: "Experiencia premium de producto AUREL EON GT"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "oria-house-barcelona",
    publicName: "Oria House Barcelona",
    aliases: [],
    vertical: "web-systems",
    origin: "authored-concept",
    maturity: "prototype",
    deployment: "public-demo",
    commercialAvailability: "adaptation-available",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "A boutique hotel website concept that turns rooms, stay rituals, location context and booking contact into a calm guest journey.",
        es: "Un sistema hospitality para hotel boutique en Barcelona, con atmosfera, comparacion de habitaciones, experiencias y contacto de reserva."
      }
    },
    limitations: [
      {
        en: "Keeps contact clear without claiming a live booking platform",
        es: "Mantiene contacto claro sin prometer motor de reservas"
      }
    ],
    evidence: [
      {
        kind: "work-case",
        slug: "oria-house-barcelona",
        proves: {
          en: "A boutique hotel concept case that connects stay atmosphere, room comparison, room detail, experience layers, location context, and booking contact into one calm guest path.",
          es: "Un concepto hotelero que conecta atmosfera, comparacion de habitaciones, experiencias, contexto local y contacto en una ruta calmada."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "live-demo",
        kind: "live",
        href: "https://oria-house-barcelona.pages.dev/en/"
      }
    ],
    routes: [
      {
        surface: "work",
        path: "/work/oria-house-barcelona",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "case-poster",
          caseSlug: "oria-house-barcelona"
        },
        alt: {
          en: "Oria House Barcelona boutique hotel hero",
          es: "Sistema hospitality Oria House Barcelona"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "arcwave-integrations",
    publicName: "ARCWAVE",
    aliases: [],
    vertical: "web-systems",
    origin: "authored-concept",
    maturity: "prototype",
    deployment: "public-demo",
    commercialAvailability: "adaptation-available",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "A technical installation service system that turns telecom, networks, electricity, security, EV charging, smart home and audio into one readable infrastructure path.",
        es: "Un sistema de servicios tecnicos que convierte telecom, redes, electricidad, seguridad, EV charging, smart home y audio en una ruta legible."
      }
    },
    limitations: [],
    evidence: [
      {
        kind: "work-case",
        slug: "arcwave-integrations",
        proves: {
          en: "A technical installation service system that turns telecom, networks, electricity, security, EV charging, smart home, and audio into one readable infrastructure path.",
          es: "Un sistema de servicios tecnicos que vuelve legibles telecom, redes, electricidad, seguridad, EV charging, smart home y audio."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "live-demo",
        kind: "live",
        href: "https://arcwave-integrations.pages.dev/"
      },
      {
        id: "repository",
        kind: "repository",
        href: "https://github.com/brenychstudio/arcwave-integrations"
      }
    ],
    routes: [
      {
        surface: "work",
        path: "/work/arcwave-integrations",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "case-poster",
          caseSlug: "arcwave-integrations"
        },
        alt: {
          en: "ARCWAVE infrastructure interface hero",
          es: "Interfaz de infraestructura ARCWAVE"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "casa-nube",
    publicName: "Casa Nube",
    aliases: [],
    vertical: "web-systems",
    origin: "authored-concept",
    maturity: "released",
    deployment: "public-demo",
    commercialAvailability: "adaptation-available",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "A premium multilingual hospitality surface with editorial structure, mobile-first service flow and clear local business presentation.",
        es: "Una superficie hospitality multilingue con estructura editorial, flujo mobile-first y presentacion clara para negocio local."
      }
    },
    limitations: [],
    evidence: [
      {
        kind: "work-case",
        slug: "casa-nube",
        proves: {
          en: "A premium multilingual hospitality surface with editorial structure, mobile-first service flow, and clear local business presentation.",
          es: "Una superficie hospitality multilingue con estructura editorial, flujo mobile-first y presentacion clara para negocio local."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "live-demo",
        kind: "live",
        href: "https://casa-nube.pages.dev/es/"
      },
      {
        id: "repository",
        kind: "repository",
        href: "https://github.com/brenychstudio/casa-nube"
      }
    ],
    routes: [
      {
        surface: "work",
        path: "/work/casa-nube",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "case-poster",
          caseSlug: "casa-nube"
        },
        alt: {
          en: "Casa Nube poster cover",
          es: "Sitio hospitality Casa Nube"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "orbit-lens",
    publicName: "Orbit Lens",
    aliases: [],
    vertical: "spatial-interactive",
    origin: "authored-concept",
    maturity: "prototype",
    deployment: "public-demo",
    commercialAvailability: "not-offered",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "A fictional AI spatial glasses product-interface prototype where the website behaves like the product OS.",
        es: "Concepto de gafas AI espaciales con campos contextuales, Inspect Optics, Reference Orbit y prueba WebXR."
      }
    },
    limitations: [],
    evidence: [
      {
        kind: "immersive-case",
        slug: "orbit-lens",
        proves: {
          en: "Orbit Lens proves how a premium fictional hardware concept can be presented through contextual fields, cinematic inspection, reference orbit and WebXR spatial proof while staying honest that the hardware and AI processing are conceptual.",
          es: "Orbit Lens demuestra cómo una web de producto puede adoptar el lenguaje del dispositivo: contexto espacial, óptica, privacidad, órbitas de referencia y prueba XR."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "live-demo",
        kind: "live",
        href: "https://orbit-lens-cue.pages.dev/"
      },
      {
        id: "repository",
        kind: "repository",
        href: "https://github.com/brenychstudio/Orbit-Lens"
      }
    ],
    routes: [
      {
        surface: "immersive",
        path: "/immersive/orbit-lens",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "immersive-poster",
          immersiveSlug: "orbit-lens"
        },
        alt: {
          en: "Orbit Lens AI spatial glasses hero interface",
          es: "Orbit Lens visión y claridad espacial"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  // Second batch (BSW-CORE-01F): controller-approved classifications; exact source copy.
  // Weekfield retains CreatorOps evidence. Living Atlas stays EN-only, unlisted and noindex.
  {
    id: "sprintcrm",
    publicName: "SprintCRM",
    aliases: [],
    vertical: "product",
    origin: "internal-system",
    maturity: "prototype",
    deployment: "private-environment",
    commercialAvailability: "not-offered",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "Internal CRM and workflow software for lead operations, pipeline management and AI-ready outreach workflows.",
        es: "Software interno de CRM y workflow para operaciones de leads, gestión de pipeline y flujos de outreach preparados para asistencia de IA."
      }
    },
    limitations: [],
    evidence: [
      {
        kind: "work-case",
        slug: "sprintcrm",
        proves: {
          en: "A premium internal CRM proving import logic, pipeline control, reporting structure, and operator-facing product clarity.",
          es: "Un CRM interno premium que prueba importacion, pipeline, reporting y claridad de producto para trabajo diario."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "repository",
        kind: "repository",
        href: "https://github.com/brenychstudio/SprintCRM"
      }
    ],
    routes: [
      {
        surface: "work",
        path: "/work/sprintcrm",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "case-poster",
          caseSlug: "sprintcrm"
        },
        alt: {
          en: "SprintCRM Signal Gate login poster cover",
          es: "Interfaz SprintCRM para workflow de operador"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "weekfield",
    publicName: "Weekfield",
    aliases: [
      "CreatorOps"
    ],
    vertical: "product",
    origin: "studio-product",
    maturity: "beta",
    deployment: "public-demo",
    commercialAvailability: "controlled-access",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "Creator content intelligence and planning system with structured creative workflows, Week Packs and human-controlled AI-assisted review/apply patterns.",
        es: "Sistema de inteligencia y planificación de contenido para creadores, con workflows creativos estructurados, Week Packs y patrones de revisión y aplicación asistidos por IA bajo control humano."
      }
    },
    limitations: [],
    evidence: [
      {
        kind: "work-case",
        slug: "creatorops",
        proves: {
          en: "A beta-ready export-first workspace for turning scattered creator assets into a ready-to-publish Week Pack with review, handoff, and media conversion inside one calm workflow.",
          es: "Un espacio export-first para transformar assets dispersos en un Week Pack listo para publicar con revision, handoff y utilidad."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "historical-demo",
        kind: "live",
        href: "https://creatorops.pages.dev/"
      },
      {
        id: "repository",
        kind: "repository",
        href: "https://github.com/brenychstudio/CreatorOps"
      }
    ],
    routes: [
      {
        surface: "work",
        path: "/work/creatorops",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "case-poster",
          caseSlug: "creatorops"
        },
        alt: {
          en: "CreatorOps workflow interface hero screen",
          es: "Interfaz de producto CreatorOps para flujo de trabajo de creadores"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "living-atlas",
    publicName: "Living Atlas",
    aliases: [],
    vertical: "product",
    origin: "studio-product",
    maturity: "pre-release",
    deployment: "store-preparation",
    commercialAvailability: "not-offered",
    visibility: "public-unlisted",
    copy: {
      oneLiner: {
        en: "Living Atlas is a local-first photographic memory tool for preserving place, visits and light context around your captures."
      }
    },
    limitations: [
      {
        en: "App Store release in preparation"
      }
    ],
    evidence: [],
    links: [],
    routes: [
      {
        surface: "trust",
        path: "/living-atlas",
        locales: [
          "en"
        ],
        noIndex: true
      },
      {
        surface: "trust",
        path: "/living-atlas/privacy",
        locales: [
          "en"
        ],
        noIndex: true
      },
      {
        surface: "trust",
        path: "/living-atlas/support",
        locales: [
          "en"
        ],
        noIndex: true
      }
    ],
    media: [],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "whisper",
    publicName: "WHISPER",
    aliases: [
      "Whisper XR"
    ],
    vertical: "spatial-interactive",
    origin: "research",
    maturity: "prototype",
    deployment: "public-demo",
    commercialAvailability: "reference-only",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "A cinematic web / XR exhibition system for photographic archives, spatial storytelling and collector-facing presentation.",
        es: "Un sistema cinematográfico web / XR para archivos fotográficos, storytelling espacial y presentación orientada a coleccionistas."
      }
    },
    limitations: [
      {
        en: "Public site, WebXR experience, Quest hand navigation, print catalog, and first AR print preview flow are working. Final XR polish, additional AR assets, and mobile/tablet refinements continue.",
        es: "El sitio público, la experiencia WebXR, la navegación con manos en Quest, el catálogo de prints y el primer flujo de preview AR funcionan. El pulido XR final, recursos AR adicionales y refinamientos móvil/tablet siguen en curso."
      }
    ],
    evidence: [
      {
        kind: "immersive-case",
        slug: "whisper",
        proves: {
          en: "WHISPER proves how a photography archive can become a living digital exhibition surface through editorial web, WebXR, Quest VR proof, collector print paths and AR preview direction.",
          es: "WHISPER demuestra cómo un archivo fotográfico puede convertirse en una superficie viva de exposición digital mediante web editorial, WebXR, prueba Quest VR, rutas de print para coleccionistas y dirección AR preview."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "live-demo",
        kind: "live",
        href: "https://whisper-sg8.pages.dev/"
      },
      {
        id: "repository",
        kind: "repository",
        href: "https://github.com/brenychstudio/Whisper"
      }
    ],
    routes: [
      {
        surface: "immersive",
        path: "/immersive/whisper",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "immersive-poster",
          immersiveSlug: "whisper"
        },
        alt: {
          en: "WHISPER desktop hero",
          es: "Hero de escritorio WHISPER"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  },
  {
    id: "print-border-studio",
    publicName: "Print Border Studio",
    aliases: [],
    vertical: "product",
    origin: "studio-product",
    maturity: "prototype",
    deployment: "public-demo",
    commercialAvailability: "adaptation-available",
    visibility: "public-listed",
    copy: {
      oneLiner: {
        en: "A creative production tool for print borders, export logic, artwork inspection and collector-facing presentation.",
        es: "Una herramienta creativa para bordes de impresion, preview de obra, cola de trabajo, inspeccion y preparacion de export."
      }
    },
    limitations: [],
    evidence: [
      {
        kind: "work-case",
        slug: "print-border-studio",
        proves: {
          en: "Print Border Studio proves how a specialist creative utility can combine precise production controls, artwork preview, queue logic and presentation value in one focused product interface.",
          es: "Print Border Studio demuestra como una utilidad creativa especializada puede combinar precision de produccion, preview de artwork, logica de cola y valor de presentacion en una interfaz enfocada."
        },
        visibility: "public"
      }
    ],
    links: [
      {
        id: "live-demo",
        kind: "live",
        href: "https://print-border-studio.pages.dev/"
      },
      {
        id: "repository",
        kind: "repository",
        href: "https://github.com/brenychstudio/print-border-studio"
      }
    ],
    routes: [
      {
        surface: "work",
        path: "/work/print-border-studio",
        locales: [
          "en",
          "es"
        ]
      }
    ],
    media: [
      {
        id: "poster",
        purpose: "poster",
        asset: {
          kind: "case-poster",
          caseSlug: "print-border-studio"
        },
        alt: {
          en: "Print Border Studio poster cover",
          es: "Herramienta Print Border Studio para preparacion de impresion"
        }
      }
    ],
    review: {
      lastReviewed: "2026-09-27",
      owner: "studio-owner"
    }
  }
] as const satisfies readonly ProjectRecord[];

// Typed relationships between projects (Weekfield → StoryForm, BAF → game production, ...).
// Kept as one global array so no project repeats its own id inside every relation.
export const projectRelationships = [] as const satisfies readonly ProjectRelationship[];
