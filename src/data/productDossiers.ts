import type { PublicLocale } from "./projectRegistry.types";
import type { ProductDossier } from "./productDossierModel";
export type { DossierImage, ProductDossier } from "./productDossierModel";
// Owner-approved first-wave presentation data only; no second-wave imports.
export const productDossiers: readonly ProductDossier[] = [
  {
    "id": "ai-language-tutor",
    "slug": "ai-language-tutor",
    "name": "AI Language Tutor",
    "shortName": "AI Language Tutor",
    "category": "product",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": true,
    "composition": "learning",
    "technology": [
      "Interactive web prototype",
      "Adaptive Studio",
      "Scenario-based learning"
    ],
    "relatedIds": [
      "brenych-asset-forge",
      "distribution-desk"
    ],
    "demoLinks": [],
    "video": {
      "assetId": "ai-language-tutor.product.demonstration",
      "poster": "/product-media/ai-language-tutor/video-poster.webp",
      "duration": "01:23.563"
    },
    "hero": {
      "id": "hero",
      "src": "/product-media/ai-language-tutor/hero-1280.webp",
      "full": "/product-media/ai-language-tutor/hero-1920.webp",
      "srcSet": "/product-media/ai-language-tutor/hero-640.webp 640w, /product-media/ai-language-tutor/hero-1280.webp 1280w, /product-media/ai-language-tutor/hero-1920.webp 1586w",
      "width": 1586,
      "height": 992,
      "alt": {
        "en": "Sofia in the learning studio with a passport and boarding pass",
        "es": "Sofia en el estudio de aprendizaje con un pasaporte y una tarjeta de embarque"
      },
      "caption": {
        "en": "Adaptive Studio · captured from the working web prototype.",
        "es": "Adaptive Studio · captura del prototipo web funcional."
      }
    },
    "gallery": [
      {
        "id": "airport",
        "src": "/product-media/ai-language-tutor/airport-1280.webp",
        "full": "/product-media/ai-language-tutor/airport-1920.webp",
        "srcSet": "/product-media/ai-language-tutor/airport-640.webp 640w, /product-media/ai-language-tutor/airport-1280.webp 1280w, /product-media/ai-language-tutor/airport-1920.webp 1586w",
        "width": 1586,
        "height": 992,
        "alt": {
          "en": "Airport practice with a tutor hint and a typed reply",
          "es": "Práctica en el aeropuerto con una pista de la tutora y una respuesta escrita"
        },
        "caption": {
          "en": "Airport scenario · a guided exchange, with hints when the learner needs them.",
          "es": "Escena del aeropuerto · una conversación guiada, con pistas cuando se necesitan."
        }
      },
      {
        "id": "cafe",
        "src": "/product-media/ai-language-tutor/cafe-1280.webp",
        "full": "/product-media/ai-language-tutor/cafe-1920.webp",
        "srcSet": "/product-media/ai-language-tutor/cafe-640.webp 640w, /product-media/ai-language-tutor/cafe-1280.webp 1280w, /product-media/ai-language-tutor/cafe-1920.webp 1586w",
        "width": 1586,
        "height": 992,
        "alt": {
          "en": "Completed café practice and the exercise summary",
          "es": "Práctica de cafetería completada y resumen del ejercicio"
        },
        "caption": {
          "en": "Café scenario · a complete exercise with a visible outcome.",
          "es": "Escena de cafetería · un ejercicio completo con un resultado visible."
        }
      }
    ],
    "locales": {
      "en": {
        "category": "Learning / Digital products",
        "stage": "Working web prototype",
        "headline": "Learn with a person.\nPractice in a world.",
        "summary": "Practice the conversations that matter before you need them. A visual tutor and guided everyday situations turn vocabulary into purposeful, repeatable exercises.",
        "overviewTitle": "From knowing a phrase\nto using it.",
        "problem": "Knowing vocabulary is different from finding the words at an airport counter or in a café. Practice needs context, a clear purpose and room to make mistakes.",
        "solution": "AI Language Tutor connects an interactive studio with guided everyday scenarios. The current prototype demonstrates visual prompts, tutor hints, typed exchanges and exercise summaries.",
        "audience": "For people preparing to use English or Spanish in everyday life, and educators exploring more contextual practice.",
        "capabilities": [
          {
            "title": "A visual learning studio",
            "body": "Passports, boarding passes and other scene objects give language a concrete reference. The lesson stays grounded in what the learner can see."
          },
          {
            "title": "Practice with a purpose",
            "body": "Airport and café scenarios turn a phrase into a small task: understand the request, choose a response and complete the exchange."
          },
          {
            "title": "Guidance inside the scene",
            "body": "Tutor hints and visible exercise outcomes support the practice loop. Full adaptive teaching and autonomous voice tutoring remain in development."
          }
        ],
        "galleryTitle": "A lesson becomes a place.",
        "status": "An interactive web prototype with Adaptive Studio and test scenarios. Realistic character integration is ongoing; the supplied walkthrough shows the current practice interface.",
        "next": "Full autonomous voice lessons, adaptive pedagogy and a commercial release are future stages.",
        "demoStatus": "Recorded walkthrough available below. No public self-service demo is currently linked.",
        "videoCaption": "Recorded Chrome walkthrough · existing prototype footage, not a live tutoring session.",
        "videoDescription": "The recording moves from the studio to an airport exchange and a café exercise. It shows hints, typed replies and the completion summary. Interface text is preserved in its original language.",
        "seoTitle": "AI Language Tutor — Contextual language practice | Brenych Studio",
        "seoDescription": "Explore Brenych Studio’s language-learning web prototype: a visual studio, guided airport and café scenarios, and contextual practice."
      },
      "es": {
        "category": "Aprendizaje / Productos digitales",
        "stage": "Prototipo web funcional",
        "headline": "Aprende con una persona.\nPractica en un mundo.",
        "summary": "Practica las conversaciones que necesitas antes de vivirlas. Una tutora visual y situaciones cotidianas guiadas convierten el vocabulario en ejercicios concretos y repetibles.",
        "overviewTitle": "De conocer una frase\na utilizarla.",
        "problem": "Saber vocabulario no es lo mismo que encontrar las palabras en un aeropuerto o una cafetería. La práctica necesita contexto, un objetivo claro y espacio para equivocarse.",
        "solution": "AI Language Tutor conecta un estudio interactivo con situaciones cotidianas guiadas. El prototipo actual muestra estímulos visuales, pistas de la tutora, respuestas escritas y resúmenes de ejercicios.",
        "audience": "Para personas que se preparan para usar inglés o español en la vida diaria y docentes que exploran una práctica más contextual.",
        "capabilities": [
          {
            "title": "Un estudio de aprendizaje visual",
            "body": "El pasaporte, la tarjeta de embarque y otros objetos ofrecen una referencia concreta. La lección se apoya en lo que la persona puede ver."
          },
          {
            "title": "Practicar con un objetivo",
            "body": "Las escenas del aeropuerto y la cafetería convierten una frase en una pequeña tarea: comprender, responder y completar el intercambio."
          },
          {
            "title": "Orientación dentro de la escena",
            "body": "Las pistas y los resultados visibles acompañan la práctica. La enseñanza plenamente adaptativa y las clases de voz autónomas siguen en desarrollo."
          }
        ],
        "galleryTitle": "Una lección se convierte en un lugar.",
        "status": "Prototipo web interactivo con Adaptive Studio y escenarios de prueba. La integración de personajes realistas continúa; el recorrido grabado muestra la interfaz actual de práctica.",
        "next": "Las clases de voz autónomas, la pedagogía adaptativa y el lanzamiento comercial son etapas futuras.",
        "demoStatus": "Recorrido grabado disponible a continuación. No se enlaza actualmente una demo pública de acceso libre.",
        "videoCaption": "Recorrido grabado en Chrome · metraje del prototipo, no una clase en directo.",
        "videoDescription": "La grabación pasa del estudio a una conversación en el aeropuerto y un ejercicio en la cafetería. Muestra pistas, respuestas escritas y un resumen final. Los textos de la interfaz conservan su idioma original.",
        "seoTitle": "AI Language Tutor — Práctica de idiomas en contexto | Brenych Studio",
        "seoDescription": "Explora el prototipo de aprendizaje de Brenych Studio: un estudio visual, escenas guiadas de aeropuerto y cafetería y práctica en contexto."
      }
    }
  },
  {
    "id": "brenych-asset-forge",
    "slug": "brenych-asset-forge",
    "name": "BAF — Brenych Asset Forge",
    "shortName": "Brenych Asset Forge",
    "category": "core-technology",
    "stage": "internal-production",
    "publicationStatus": "public",
    "featured": true,
    "composition": "asset",
    "technology": [
      "Blender Python",
      "Houdini",
      "PBR",
      "Cycles"
    ],
    "relatedIds": [
      "ai-language-tutor",
      "distribution-desk"
    ],
    "demoLinks": [],
    "video": {
      "assetId": "brenych-asset-forge.product.demonstration",
      "poster": "/product-media/brenych-asset-forge/video-poster.webp",
      "duration": "01:24.300"
    },
    "hero": {
      "id": "hero",
      "src": "/product-media/brenych-asset-forge/hero-1280.webp",
      "full": "/product-media/brenych-asset-forge/hero-1920.webp",
      "srcSet": "/product-media/brenych-asset-forge/hero-640.webp 640w, /product-media/brenych-asset-forge/hero-1280.webp 1280w, /product-media/brenych-asset-forge/hero-1920.webp 1920w",
      "width": 2896,
      "height": 2172,
      "alt": {
        "en": "SHIP-01 spacecraft in a cinematic studio render",
        "es": "Nave SHIP-01 en un render de estudio cinematográfico"
      },
      "caption": {
        "en": "SHIP-01 · approved art master, rendered offline in Blender Cycles.",
        "es": "SHIP-01 · modelo artístico aprobado, renderizado offline en Blender Cycles."
      }
    },
    "gallery": [
      {
        "id": "canopy",
        "src": "/product-media/brenych-asset-forge/canopy-1280.webp",
        "full": "/product-media/brenych-asset-forge/canopy-1920.webp",
        "srcSet": "/product-media/brenych-asset-forge/canopy-640.webp 640w, /product-media/brenych-asset-forge/canopy-1280.webp 1280w, /product-media/brenych-asset-forge/canopy-1920.webp 1448w",
        "width": 1448,
        "height": 1086,
        "alt": {
          "en": "SHIP-01 with the canopy open and boarding mechanism exposed",
          "es": "SHIP-01 con la cubierta abierta y el mecanismo de acceso visible"
        },
        "caption": {
          "en": "Designed to open · a keyed feasibility pose, not an in-game capture.",
          "es": "Diseñado para abrirse · pose de viabilidad animada, no una captura del juego."
        }
      },
      {
        "id": "cockpit",
        "src": "/product-media/brenych-asset-forge/cockpit-1280.webp",
        "full": "/product-media/brenych-asset-forge/cockpit-1920.webp",
        "srcSet": "/product-media/brenych-asset-forge/cockpit-640.webp 640w, /product-media/brenych-asset-forge/cockpit-1280.webp 1280w, /product-media/brenych-asset-forge/cockpit-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Detailed interior of the SHIP-01 cockpit",
          "es": "Interior detallado de la cabina de SHIP-01"
        },
        "caption": {
          "en": "Inside the asset · cockpit geometry and materials; display graphics remain placeholders.",
          "es": "Dentro del modelo · geometría y materiales de cabina; los gráficos de pantalla son provisionales."
        }
      },
      {
        "id": "stray",
        "src": "/product-media/brenych-asset-forge/stray-1280.webp",
        "full": "/product-media/brenych-asset-forge/stray-1920.webp",
        "srcSet": "/product-media/brenych-asset-forge/stray-640.webp 640w, /product-media/brenych-asset-forge/stray-1280.webp 1280w, /product-media/brenych-asset-forge/stray-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "K9-02 STRAY quadruped robot in the final studio presentation",
          "es": "Robot cuadrúpedo K9-02 STRAY en la presentación final de estudio"
        },
        "caption": {
          "en": "K9-02 STRAY · another asset produced and reviewed within the studio pipeline.",
          "es": "K9-02 STRAY · otro modelo producido y revisado con el proceso del estudio."
        }
      }
    ],
    "locales": {
      "en": {
        "category": "Core technology / 3D production",
        "stage": "Internal production technology",
        "headline": "Complex assets.\nControlled production.",
        "summary": "Give a 3D team a reviewable path from a visual brief to a detailed asset. Geometry, materials and functional mechanisms are developed together, with explicit production checks.",
        "overviewTitle": "The object is only\nhalf the work.",
        "problem": "A convincing 3D asset needs more than an attractive silhouette. Geometry, materials, mechanisms and delivery checks must agree — across many iterations.",
        "solution": "Brenych Asset Forge brings code-driven creation and structured review into the same production process. SHIP-01 and K9-02 STRAY show the detail this internal workflow can produce.",
        "audience": "For game teams, creative studios and product teams exploring controlled, repeatable 3D production.",
        "capabilities": [
          {
            "title": "Reference-led construction",
            "body": "Work develops against an approved visual target, with deliberate geometry and a clear review process for each asset."
          },
          {
            "title": "Details with a function",
            "body": "Cabins, canopies and boarding mechanisms extend the work beyond a static exterior. The supplied renders document these design states."
          },
          {
            "title": "Production knowledge that carries forward",
            "body": "Modular construction and technical checks form a reusable foundation. Universal certification and a commercial self-service platform remain future work."
          }
        ],
        "galleryTitle": "Built beyond the silhouette.",
        "status": "Used in Brenych Studio’s internal asset production. The selected SHIP-01 imagery is offline Cycles output from the approved art master; it is not evidence of engine performance or a shipped game.",
        "next": "Broader certification, multi-project operation and a commercial SaaS edition are still in development.",
        "demoStatus": "A recorded interface demonstration is available. Access to the internal production tools is not offered as a public download.",
        "videoCaption": "Recorded BAF interface demonstration · asset inspection and library views.",
        "videoDescription": "The supplied recording tours the asset viewer, switches between models and opens the library. The separate image studies document SHIP-01 and STRAY; they do not imply universal engine certification.",
        "seoTitle": "Brenych Asset Forge — Controlled 3D production | Brenych Studio",
        "seoDescription": "Discover BAF, Brenych Studio’s internal 3D production technology, through SHIP-01, mechanical detail and reviewed asset studies."
      },
      "es": {
        "category": "Tecnología propia / Producción 3D",
        "stage": "Tecnología de producción interna",
        "headline": "Modelos complejos.\nProducción controlada.",
        "summary": "Ofrece al equipo 3D un proceso revisable desde la referencia visual hasta el modelo detallado. Geometría, materiales y mecanismos se desarrollan juntos, con comprobaciones de producción explícitas.",
        "overviewTitle": "El objeto es solo\nla mitad del trabajo.",
        "problem": "Un modelo 3D convincente necesita algo más que una buena silueta. Geometría, materiales, mecanismos y comprobaciones deben encajar a lo largo de muchas iteraciones.",
        "solution": "Brenych Asset Forge reúne creación mediante código y revisión estructurada en un mismo proceso. SHIP-01 y K9-02 STRAY muestran el detalle que permite este flujo interno.",
        "audience": "Para equipos de videojuegos, estudios creativos y equipos de producto que buscan una producción 3D controlada y repetible.",
        "capabilities": [
          {
            "title": "Construcción guiada por referencias",
            "body": "El trabajo parte de una dirección visual aprobada, con geometría deliberada y un proceso claro de revisión para cada modelo."
          },
          {
            "title": "Detalles que cumplen una función",
            "body": "Cabinas, cubiertas y mecanismos de acceso amplían el trabajo más allá del exterior estático. Los renders muestran estos estados de diseño."
          },
          {
            "title": "Conocimiento que se reutiliza",
            "body": "La construcción modular y las comprobaciones técnicas ofrecen una base reutilizable. La certificación universal y una plataforma comercial de autoservicio siguen pendientes."
          }
        ],
        "galleryTitle": "Más allá de la silueta.",
        "status": "Utilizado en la producción interna de Brenych Studio. Las imágenes de SHIP-01 son renders offline de Cycles del modelo artístico aprobado; no demuestran rendimiento en un motor ni un juego publicado.",
        "next": "La certificación ampliada, la operación multiproyecto y una edición SaaS comercial siguen en desarrollo.",
        "demoStatus": "Hay una demostración grabada de la interfaz. Las herramientas internas no se ofrecen como descarga pública.",
        "videoCaption": "Demostración grabada de BAF · inspección de modelos y biblioteca.",
        "videoDescription": "La grabación recorre el visor, cambia entre modelos y abre la biblioteca. Los estudios de imagen documentan SHIP-01 y STRAY; no implican certificación universal en motores.",
        "seoTitle": "Brenych Asset Forge — Producción 3D controlada | Brenych Studio",
        "seoDescription": "Descubre BAF, la tecnología interna de producción 3D de Brenych Studio, mediante SHIP-01, detalles mecánicos y modelos revisados."
      }
    }
  },
  {
    "id": "distribution-desk",
    "slug": "distribution-desk",
    "name": "Distribution Desk",
    "shortName": "Distribution Desk",
    "category": "product",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": true,
    "composition": "workflow",
    "technology": [
      "Electron",
      "SQLite",
      "Publishing adapters",
      "Approval workflow"
    ],
    "relatedIds": [
      "ai-language-tutor",
      "brenych-asset-forge"
    ],
    "demoLinks": [],
    "video": {
      "assetId": "distribution-desk.product.demonstration",
      "poster": "/product-media/distribution-desk/video-poster.webp",
      "duration": "00:42.600"
    },
    "hero": {
      "id": "hero",
      "src": "/product-media/distribution-desk/hero-1280.webp",
      "full": "/product-media/distribution-desk/hero-1920.webp",
      "srcSet": "/product-media/distribution-desk/hero-640.webp 640w, /product-media/distribution-desk/hero-1280.webp 1280w, /product-media/distribution-desk/hero-1920.webp 1426w",
      "width": 1426,
      "height": 913,
      "alt": {
        "en": "Distribution Desk Command Center showing campaigns in a QA fixture",
        "es": "Command Center de Distribution Desk con campañas de un entorno de prueba"
      },
      "caption": {
        "en": "Actual Electron interface · synthetic QA campaigns and figures, not customer metrics.",
        "es": "Interfaz real de Electron · campañas y cifras de prueba, no métricas de clientes."
      }
    },
    "gallery": [
      {
        "id": "campaign",
        "src": "/product-media/distribution-desk/campaign-1280.webp",
        "full": "/product-media/distribution-desk/campaign-1920.webp",
        "srcSet": "/product-media/distribution-desk/campaign-640.webp 640w, /product-media/distribution-desk/campaign-1280.webp 1280w, /product-media/distribution-desk/campaign-1920.webp 1920w",
        "width": 2048,
        "height": 1113,
        "alt": {
          "en": "Campaign Studio with a platform-specific content draft",
          "es": "Campaign Studio con un borrador adaptado a una plataforma"
        },
        "caption": {
          "en": "Campaign Studio · a reviewable draft, using synthetic demonstration content.",
          "es": "Campaign Studio · borrador revisable con contenido de demostración sintético."
        }
      },
      {
        "id": "readiness",
        "src": "/product-media/distribution-desk/readiness-1280.webp",
        "full": "/product-media/distribution-desk/readiness-1920.webp",
        "srcSet": "/product-media/distribution-desk/readiness-640.webp 640w, /product-media/distribution-desk/readiness-1280.webp 1280w, /product-media/distribution-desk/readiness-1920.webp 1920w",
        "width": 2048,
        "height": 1113,
        "alt": {
          "en": "Publication readiness screen with approval and destination checks",
          "es": "Pantalla de preparación de publicación con comprobaciones de aprobación y destino"
        },
        "caption": {
          "en": "Publication readiness · QA fixture; this is not a live publication receipt.",
          "es": "Preparación de publicación · entorno de prueba, no un recibo de publicación real."
        }
      }
    ],
    "locales": {
      "en": {
        "category": "Content operations / Digital products",
        "stage": "Working local application",
        "headline": "One content source.\nA considered next step.",
        "summary": "Turn one campaign brief into coordinated platform drafts without losing track of versions or approvals. Keep the content, review and publication decision in one workspace.",
        "overviewTitle": "Keep the idea.\nControl the handoff.",
        "problem": "Publishing across channels creates repeated work: rewriting, switching tools, checking versions and tracking what was approved. The risk grows when those decisions are scattered.",
        "solution": "Distribution Desk connects a shared campaign with platform-specific variants and a controlled publishing workflow. Drafts, review and execution remain distinct steps.",
        "audience": "For brands, marketing teams and agencies managing content across several channels.",
        "capabilities": [
          {
            "title": "A shared campaign workspace",
            "body": "Keep the campaign, media and platform variants in context, rather than rebuilding the same brief in separate tools."
          },
          {
            "title": "Adapt, then review",
            "body": "AI-assisted adaptation prepares platform-specific text. People keep control over approval and the decision to publish."
          },
          {
            "title": "Readiness before execution",
            "body": "A publishing queue and visible checks support controlled handoffs. Nine adapters are described in the architecture; that does not mean all nine live-provider pilots are complete."
          }
        ],
        "galleryTitle": "From draft to a deliberate decision.",
        "status": "Working local core with campaign management, AI adaptation and a protected publishing workflow. The supplied screenshots are actual Electron UI on an isolated QA database with synthetic campaigns and simulated history.",
        "next": "Some Instagram, LinkedIn and Threads formats have reported API pilot evidence outside this screenshot kit. Wider live validation and stable multi-client operation remain separate milestones.",
        "demoStatus": "Recorded interface tour available. No public account connection or live publishing session is offered on this page.",
        "videoCaption": "Recorded interface tour · synthetic demo data; not evidence of live account connections.",
        "videoDescription": "The recording shows the newsroom, campaign variants, publication readiness and integration capability cards. The screenshot fixture has zero connected accounts; its figures and receipts are not production results.",
        "seoTitle": "Distribution Desk — Controlled content operations | Brenych Studio",
        "seoDescription": "Explore Distribution Desk’s local application: campaigns, AI-assisted platform variants and a publishing workflow with explicit human approval."
      },
      "es": {
        "category": "Operaciones de contenido / Productos digitales",
        "stage": "Aplicación local funcional",
        "headline": "Un contenido de origen.\nUn siguiente paso consciente.",
        "summary": "Convierte una campaña en borradores coordinados por plataforma, manteniendo visibles las versiones y aprobaciones. Reúne contenido, revisión y decisión de publicar en un mismo espacio.",
        "overviewTitle": "Conserva la idea.\nControla cada entrega.",
        "problem": "Publicar en varios canales multiplica el trabajo: reescribir, cambiar de herramienta, comprobar versiones y recordar qué se aprobó. El riesgo aumenta cuando las decisiones están dispersas.",
        "solution": "Distribution Desk conecta una campaña común con versiones por plataforma y un proceso controlado de publicación. Borrador, revisión y ejecución siguen siendo etapas distintas.",
        "audience": "Para marcas, equipos de marketing y agencias que gestionan contenido en varios canales.",
        "capabilities": [
          {
            "title": "Un espacio común para la campaña",
            "body": "Mantén la campaña, los medios y las variantes en contexto, sin reconstruir el mismo encargo en herramientas separadas."
          },
          {
            "title": "Adaptar y después revisar",
            "body": "La adaptación asistida por IA prepara textos para cada plataforma. Las personas conservan el control de la aprobación y de la decisión de publicar."
          },
          {
            "title": "Comprobar antes de ejecutar",
            "body": "La cola y las comprobaciones visibles permiten entregas controladas. La arquitectura describe nueve adaptadores; eso no significa que los nueve pilotos con proveedores estén completos."
          }
        ],
        "galleryTitle": "Del borrador a una decisión consciente.",
        "status": "Núcleo local funcional con campañas, adaptación mediante IA y publicación protegida. Las capturas muestran la interfaz real de Electron en una base de datos de prueba, con campañas sintéticas e historial simulado.",
        "next": "Se han documentado pilotos API de ciertos formatos de Instagram, LinkedIn y Threads fuera de este paquete visual. La validación ampliada y la operación estable con varios clientes siguen siendo hitos separados.",
        "demoStatus": "Recorrido grabado disponible. Esta página no ofrece conexión de cuentas públicas ni una sesión de publicación en directo.",
        "videoCaption": "Recorrido grabado de la interfaz · datos sintéticos, sin demostrar conexiones de cuentas reales.",
        "videoDescription": "La grabación muestra la redacción, variantes de campaña, comprobaciones previas e integraciones previstas. El entorno de las capturas tiene cero cuentas conectadas; sus cifras y recibos no son resultados de producción.",
        "seoTitle": "Distribution Desk — Operaciones de contenido controladas | Brenych Studio",
        "seoDescription": "Explora la aplicación local de Distribution Desk: campañas, variantes asistidas por IA y publicación con aprobación humana explícita."
      }
    }
  },
  {
    "id": "villa-atlas",
    "slug": "villa-atlas",
    "name": "Villa Atlas",
    "shortName": "Villa Atlas",
    "category": "digital-human",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": false,
    "composition": "advisor",
    "technology": [
      "Conversational interface",
      "Brenych Presence Engine",
      "Controlled navigation"
    ],
    "relatedIds": [
      "qualor"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/villa-atlas/hero-1280.webp",
      "full": "/product-media/villa-atlas/hero-1920.webp",
      "srcSet": "/product-media/villa-atlas/hero-640.webp 640w, /product-media/villa-atlas/hero-1280.webp 1280w, /product-media/villa-atlas/hero-1920.webp 1920w",
      "width": 1920,
      "height": 1080,
      "alt": {
        "en": "Villa Atlas concept-property showroom with its digital advisor",
        "es": "Showroom de propiedades conceptuales de Villa Atlas con su asesora digital"
      },
      "caption": {
        "en": "Concept-property showroom · fictional estates, shown with the Atlas advisor.",
        "es": "Showroom conceptual · propiedades ficticias junto a la asesora Atlas."
      }
    },
    "gallery": [],
    "limitations": {
      "en": [
        "The displayed estates are fictional concept properties, not listings or client results.",
        "A historical private avatar test does not establish a currently available public live service.",
        "This public case includes the approved presentation still. Neural models and private session recordings are not distributed."
      ],
      "es": [
        "Las propiedades mostradas son conceptos ficticios, no anuncios ni resultados de clientes.",
        "Una prueba privada histórica del avatar no demuestra la disponibilidad actual de un servicio público en directo.",
        "Este caso público incluye la imagen de presentación aprobada. No se distribuyen modelos neuronales ni grabaciones de sesiones privadas."
      ]
    },
    "evidence": {
      "en": [
        {
          "title": "A conversation with context",
          "body": "The documented private test connected speech recognition, conversational responses and spoken output to the Atlas advisor. It used a synthetic guest voice; it was not a customer session."
        },
        {
          "title": "A face connected to speech",
          "body": "The historical test report records live facial rendering through the existing presence pipeline. Its status retained an owner-listening gate; this case page does not replay or run that private session."
        },
        {
          "title": "Actions with receipts",
          "body": "The test records applied property-search, comparison and shortlist actions. These connect conversation to useful website navigation, rather than leaving the advisor as a decorative portrait."
        }
      ],
      "es": [
        {
          "title": "Una conversación con contexto",
          "body": "La prueba privada documentada conectó reconocimiento de voz, respuestas conversacionales y voz de salida con Atlas. Utilizó una voz de visitante sintética; no fue una sesión con un cliente."
        },
        {
          "title": "Un rostro conectado a la voz",
          "body": "El informe histórico registra animación facial en directo mediante el pipeline de presencia existente. Conservaba una validación de escucha del propietario; esta página no reproduce ni ejecuta aquella sesión privada."
        },
        {
          "title": "Acciones con confirmación",
          "body": "La prueba registra búsquedas de propiedades, comparaciones y selecciones aplicadas. Así, la conversación conduce a una navegación útil y la asesora aporta algo más que una presencia visual."
        }
      ]
    },
    "locales": {
      "en": {
        "category": "Digital humans / Property experience",
        "stage": "Local prototype · historical private test",
        "headline": "A place to explore.\nAn advisor to guide you.",
        "summary": "Help a prospective buyer move from an attractive property image to a considered shortlist. Villa Atlas brings a cinematic showroom, conversational guidance and controlled website actions into one experience.",
        "overviewTitle": "Give the property\na conversation.",
        "problem": "A gallery can show a residence, but it cannot understand what a particular buyer wants to compare or explore next. A useful digital advisor needs context and a way to act inside the showroom.",
        "solution": "Villa Atlas combines a local property-showroom prototype with the Atlas advisor. A documented private test connected speech, facial animation and property navigation; the supplied image presents the concept-property interface.",
        "audience": "For property teams and experience partners exploring a more guided way to present high-value spaces.",
        "capabilities": [
          {
            "title": "A cinematic showroom",
            "body": "Present architecture, landscape and a selected property collection in a coherent visual setting. The supplied properties are deliberately fictional concepts."
          },
          {
            "title": "A demonstrated advisor pipeline",
            "body": "Historical private test evidence connects conversation, spoken response and facial rendering through the existing presence architecture."
          },
          {
            "title": "Guidance that takes action",
            "body": "Recorded tool receipts cover search, comparison and shortlist navigation. The advisor can be assessed by its applied actions as well as its appearance."
          }
        ],
        "galleryTitle": "The advisor inside the experience.",
        "status": "A functional local showroom prototype, with a separately documented private conversational/avatar demonstration dated 22 October 2026. The public case presents the approved still; the historical session retains its owner-listening condition.",
        "next": "A repeatable public live experience, broader language validation, full-platform voice control and an interactive property map remain further work.",
        "demoStatus": "The supplied presentation pack contains one still and no video. Private historical recordings are excluded. No live session is available here.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "Villa Atlas — Digital advisor and property experience | Brenych Studio",
        "seoDescription": "Explore Villa Atlas: a concept-property showroom and documented private digital-advisor pipeline, with clear limits between historical proof and public availability."
      },
      "es": {
        "category": "Humanos digitales / Experiencia inmobiliaria",
        "stage": "Prototipo local · prueba privada histórica",
        "headline": "Un lugar que explorar.\nUna asesora que te guía.",
        "summary": "Ayuda al comprador a pasar de una imagen atractiva a una selección razonada. Villa Atlas reúne un showroom cinematográfico, orientación conversacional y acciones controladas dentro del sitio.",
        "overviewTitle": "Dale a la propiedad\nuna conversación.",
        "problem": "Una galería muestra una residencia, pero no comprende qué quiere comparar o explorar cada comprador. Una asesora útil necesita contexto y capacidad para actuar dentro del showroom.",
        "solution": "Villa Atlas combina un prototipo local de presentación inmobiliaria con la asesora Atlas. Una prueba privada documentada conectó voz, animación facial y navegación; la imagen aportada muestra propiedades conceptuales.",
        "audience": "Para equipos inmobiliarios y socios que exploran una presentación más guiada de espacios de alto valor.",
        "capabilities": [
          {
            "title": "Un showroom cinematográfico",
            "body": "Presenta arquitectura, paisaje y una selección de propiedades en un entorno visual coherente. Las propiedades aportadas son conceptos ficticios."
          },
          {
            "title": "Un pipeline de asesoría demostrado",
            "body": "La evidencia histórica de una prueba privada conecta conversación, respuesta hablada y animación facial mediante la arquitectura de presencia existente."
          },
          {
            "title": "Orientación que permite actuar",
            "body": "Las confirmaciones registradas cubren búsqueda, comparación y selección de propiedades. La asesora se evalúa también por las acciones aplicadas."
          }
        ],
        "galleryTitle": "La asesora dentro de la experiencia.",
        "status": "Prototipo local funcional de showroom, con una demostración privada de conversación y avatar documentada por separado el 22 de octubre de 2026. El caso público presenta la imagen aprobada; la sesión histórica conserva su condición de escucha por el propietario.",
        "next": "Una experiencia pública repetible, la validación de más idiomas, el control por voz de toda la plataforma y el mapa inmobiliario interactivo requieren trabajo adicional.",
        "demoStatus": "El material de presentación incluye una imagen y ningún vídeo. Se excluyen las grabaciones privadas históricas. Aquí no hay ninguna sesión en directo disponible.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "Villa Atlas — Asesora digital y experiencia inmobiliaria | Brenych Studio",
        "seoDescription": "Conoce Villa Atlas: un showroom conceptual y un pipeline de asesoría digital probado en privado, diferenciando la evidencia histórica de la disponibilidad pública."
      }
    }
  },
  {
    "id": "qualor",
    "slug": "qualor",
    "name": "QUALOR",
    "shortName": "QUALOR",
    "category": "product",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": false,
    "composition": "intelligence",
    "technology": [
      "Conversation system",
      "Context memory",
      "Controlled tools"
    ],
    "relatedIds": [
      "villa-atlas",
      "distribution-desk"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/qualor/hero-1280.webp",
      "full": "/product-media/qualor/hero-1920.webp",
      "srcSet": "/product-media/qualor/hero-640.webp 640w, /product-media/qualor/hero-1280.webp 1280w, /product-media/qualor/hero-1920.webp 1920w",
      "width": 1920,
      "height": 1080,
      "alt": {
        "en": "QUALOR conversation workspace with a visual agent and context panel",
        "es": "Espacio de conversación de QUALOR con agente visual y panel de contexto"
      },
      "caption": {
        "en": "Functional prototype · conversation workspace and visual agent.",
        "es": "Prototipo funcional · espacio conversacional y agente visual."
      }
    },
    "gallery": [
      {
        "id": "conversation",
        "src": "/product-media/qualor/conversation-1280.webp",
        "full": "/product-media/qualor/conversation-1920.webp",
        "srcSet": "/product-media/qualor/conversation-640.webp 640w, /product-media/qualor/conversation-1280.webp 1280w, /product-media/qualor/conversation-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "QUALOR demonstration conversation about a language-learning idea",
          "es": "Conversación de demostración en QUALOR sobre una idea de aprendizaje de idiomas"
        },
        "caption": {
          "en": "An idea becomes a structured conversation · demonstration content.",
          "es": "Una idea se convierte en una conversación estructurada · contenido de demostración."
        }
      },
      {
        "id": "context",
        "src": "/product-media/qualor/context-1280.webp",
        "full": "/product-media/qualor/context-1920.webp",
        "srcSet": "/product-media/qualor/context-640.webp 640w, /product-media/qualor/context-1280.webp 1280w, /product-media/qualor/context-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "QUALOR context memory panel showing stated project information",
          "es": "Panel de contexto de QUALOR con información declarada del proyecto"
        },
        "caption": {
          "en": "Context remains visible beside the conversation.",
          "es": "El contexto permanece visible junto a la conversación."
        }
      },
      {
        "id": "opportunity",
        "src": "/product-media/qualor/opportunity-1280.webp",
        "full": "/product-media/qualor/opportunity-1920.webp",
        "srcSet": "/product-media/qualor/opportunity-640.webp 640w, /product-media/qualor/opportunity-1280.webp 1280w, /product-media/qualor/opportunity-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "QUALOR saved-opportunity review screen with demonstration program cards",
          "es": "Pantalla de oportunidades guardadas de QUALOR con programas de demostración"
        },
        "caption": {
          "en": "Saved-opportunity review · examples are not current funding advice.",
          "es": "Revisión de oportunidades guardadas · los ejemplos no son asesoramiento de financiación vigente."
        }
      }
    ],
    "video": {
      "assetId": "qualor.product.demonstration",
      "poster": "/product-media/qualor/video-poster.webp",
      "duration": "00:32.100"
    },
    "limitations": {
      "en": [
        "Live AI integration, autonomous discovery and production voice are still being developed and tested.",
        "Demonstration opportunities and deadlines are not verified current recommendations.",
        "No funding outcome, eligibility or application success is guaranteed."
      ],
      "es": [
        "La integración de IA en directo, la búsqueda autónoma y la voz de producción siguen en desarrollo y pruebas.",
        "Las oportunidades y fechas de demostración no son recomendaciones vigentes verificadas.",
        "No se garantiza financiación, elegibilidad ni éxito de solicitudes."
      ]
    },
    "locales": {
      "en": {
        "category": "AI systems / Digital products",
        "stage": "Functional prototype",
        "headline": "Start with an idea.\nKeep the next step in view.",
        "summary": "Turn a loosely formed idea into a structured opportunity conversation. QUALOR keeps project context and evidence review together so the next decision can be made with the right information at hand.",
        "overviewTitle": "Context before\nrecommendation.",
        "problem": "Finding support for an idea means explaining the project repeatedly, comparing requirements and keeping evidence in order. A list of links alone does not help someone decide what to do next.",
        "solution": "The current QUALOR foundation brings a conversation interface, stated context, controlled tools and opportunity review into one workspace. Its wider discovery and proactive-agent architecture is being developed in separate stages.",
        "audience": "For founders, researchers, creatives and small teams organizing an idea and exploring relevant support.",
        "capabilities": [
          {
            "title": "An idea-led conversation",
            "body": "Begin with the project and the support being sought. The interface gives the discussion and visual agent a shared, focused workspace."
          },
          {
            "title": "Visible project context",
            "body": "Context memory makes the information being carried forward visible to the user, rather than leaving it implicit in a long thread."
          },
          {
            "title": "A controlled next step",
            "body": "Saved opportunities and evidence review provide structure for follow-up. Autonomous discovery and production integrations are not claimed as complete."
          }
        ],
        "galleryTitle": "An idea, with its context intact.",
        "status": "Functional foundation with a conversation system, controlled tools, context persistence and evidence review. The supplied recording demonstrates the interface and its current workflow.",
        "next": "LIVE AI integration, autonomous discovery, proactive monitoring and production voice require further implementation and validation.",
        "demoStatus": "A recorded prototype walkthrough is available. No live opportunity search or public account access is connected on this page.",
        "videoCaption": "Recorded prototype walkthrough · example opportunities are demonstration content.",
        "videoDescription": "The recording presents the conversation workspace, project context and saved-opportunity interface. It does not verify current program eligibility, deadlines or successful funding.",
        "seoTitle": "QUALOR — Context-led opportunity intelligence | Brenych Studio",
        "seoDescription": "Explore QUALOR’s functional AI-system prototype: conversation, visible project context and controlled opportunity review, with future capabilities clearly separated."
      },
      "es": {
        "category": "Sistemas de IA / Productos digitales",
        "stage": "Prototipo funcional",
        "headline": "Empieza con una idea.\nMantén claro el siguiente paso.",
        "summary": "Convierte una idea inicial en una conversación estructurada sobre oportunidades. QUALOR reúne contexto del proyecto y revisión de evidencias para decidir con la información necesaria a mano.",
        "overviewTitle": "Contexto antes\nde recomendar.",
        "problem": "Buscar apoyo para una idea exige explicar el proyecto, comparar requisitos y ordenar evidencias. Una lista de enlaces no basta para decidir qué hacer después.",
        "solution": "La base actual de QUALOR reúne interfaz conversacional, contexto declarado, herramientas controladas y revisión de oportunidades. La búsqueda y la arquitectura de agente proactivo avanzan en etapas separadas.",
        "audience": "Para emprendedores, investigadores, creadores y equipos pequeños que organizan una idea y exploran apoyo relevante.",
        "capabilities": [
          {
            "title": "Una conversación desde la idea",
            "body": "Empieza por el proyecto y el apoyo que buscas. La interfaz ofrece un espacio compartido y centrado para la conversación y el agente visual."
          },
          {
            "title": "Contexto visible del proyecto",
            "body": "La memoria de contexto muestra qué información se conserva, sin dejarla implícita en un hilo largo."
          },
          {
            "title": "Un siguiente paso controlado",
            "body": "Las oportunidades guardadas y la revisión de evidencias organizan el seguimiento. La búsqueda autónoma y las integraciones de producción no se presentan como terminadas."
          }
        ],
        "galleryTitle": "Una idea con su contexto intacto.",
        "status": "Base funcional con sistema conversacional, herramientas controladas, persistencia del contexto y revisión de evidencias. La grabación muestra la interfaz y su flujo actual.",
        "next": "La integración de IA en directo, la búsqueda autónoma, el seguimiento proactivo y la voz de producción requieren más implementación y validación.",
        "demoStatus": "Hay un recorrido grabado del prototipo. Esta página no conecta búsquedas en directo ni acceso a cuentas públicas.",
        "videoCaption": "Recorrido grabado del prototipo · las oportunidades son contenido de demostración.",
        "videoDescription": "La grabación presenta la conversación, el contexto del proyecto y las oportunidades guardadas. No verifica elegibilidad, plazos vigentes ni financiación obtenida.",
        "seoTitle": "QUALOR — Inteligencia de oportunidades con contexto | Brenych Studio",
        "seoDescription": "Explora el prototipo funcional de QUALOR: conversación, contexto visible y revisión controlada de oportunidades, con las funciones futuras claramente diferenciadas."
      }
    }
  },
  {
    "id": "storyform",
    "slug": "storyform",
    "name": "StoryForm",
    "shortName": "StoryForm",
    "category": "product",
    "stage": "desktop-mvp",
    "publicationStatus": "public",
    "featured": false,
    "composition": "editorial",
    "technology": [
      "Desktop application",
      "Local production engine",
      "Directed output formats"
    ],
    "relatedIds": [
      "distribution-desk",
      "brenych-asset-forge"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/storyform/hero-1280.webp",
      "full": "/product-media/storyform/hero-1920.webp",
      "srcSet": "/product-media/storyform/hero-640.webp 640w, /product-media/storyform/hero-1280.webp 1280w, /product-media/storyform/hero-1920.webp 1920w",
      "width": 1920,
      "height": 1080,
      "alt": {
        "en": "StoryForm Quick Create workspace with source media and a vertical preview",
        "es": "Espacio Quick Create de StoryForm con medios de origen y vista previa vertical"
      },
      "caption": {
        "en": "Quick Create · source organization inside the desktop application.",
        "es": "Quick Create · organización de medios en la aplicación de escritorio."
      }
    },
    "gallery": [
      {
        "id": "audio",
        "src": "/product-media/storyform/audio-1280.webp",
        "full": "/product-media/storyform/audio-1920.webp",
        "srcSet": "/product-media/storyform/audio-640.webp 640w, /product-media/storyform/audio-1280.webp 1280w, /product-media/storyform/audio-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "StoryForm audio-focused timeline and preview workspace",
          "es": "Timeline de StoryForm centrado en audio y vista previa"
        },
        "caption": {
          "en": "Audio Focus · a dedicated view of the production timeline.",
          "es": "Audio Focus · vista dedicada del timeline de producción."
        }
      },
      {
        "id": "director",
        "src": "/product-media/storyform/director-1280.webp",
        "full": "/product-media/storyform/director-1920.webp",
        "srcSet": "/product-media/storyform/director-640.webp 640w, /product-media/storyform/director-1280.webp 1280w, /product-media/storyform/director-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "StoryForm Local Creative Director panel beside the edit",
          "es": "Panel Local Creative Director de StoryForm junto al montaje"
        },
        "caption": {
          "en": "Local Creative Director · direction alongside the material.",
          "es": "Local Creative Director · dirección junto al material."
        }
      },
      {
        "id": "renders",
        "src": "/product-media/storyform/renders-1280.webp",
        "full": "/product-media/storyform/renders-1920.webp",
        "srcSet": "/product-media/storyform/renders-640.webp 640w, /product-media/storyform/renders-1280.webp 1280w, /product-media/storyform/renders-1920.webp 1920w",
        "width": 2604,
        "height": 1508,
        "alt": {
          "en": "Contact sheet of supplied StoryForm render results",
          "es": "Hoja de contacto de resultados de render aportados de StoryForm"
        },
        "caption": {
          "en": "Supplied render contact sheet · still evidence, not an interactive video player.",
          "es": "Hoja de resultados aportada · evidencia en imágenes, no un reproductor de vídeo interactivo."
        }
      }
    ],
    "limitations": {
      "en": [
        "Desktop MVP; commercial beta and artistic standardization are still in development.",
        "No standalone video file was supplied for playback in this presentation pack.",
        "Generative AI and cloud production are not required by the local foundation and are not enabled here."
      ],
      "es": [
        "MVP de escritorio; la beta comercial y la estandarización artística siguen en desarrollo.",
        "El paquete de presentación no incluye un vídeo independiente para reproducir.",
        "La base local no exige IA generativa ni producción en la nube; aquí no están activadas."
      ]
    },
    "locales": {
      "en": {
        "category": "Creative tools / Digital products",
        "stage": "Working desktop MVP",
        "headline": "Bring the material.\nGive the story a form.",
        "summary": "Organize footage, images and renders into a repeatable production workflow. StoryForm brings source preparation, direction, timeline work and output review together for teams making branded visual content.",
        "overviewTitle": "Keep the creative work\nconnected.",
        "problem": "Repeated video production can scatter source selection, editing decisions, audio and delivery checks across separate steps. Maintaining a coherent style becomes harder as the volume grows.",
        "solution": "StoryForm’s local production foundation combines reusable direction profiles with a desktop workspace. Quick Create, Audio Focus and Local Creative Director views make the source material and production decisions visible together.",
        "audience": "For creators, studios and product teams producing recurring presentations, brand stories and social content.",
        "capabilities": [
          {
            "title": "Prepare the source material",
            "body": "Bring footage, photographs, screen recordings and renders into a shared production context. Quick Create gives the workflow a clear starting point."
          },
          {
            "title": "Direction beside the timeline",
            "body": "Dedicated editing and audio views keep creative decisions near the material. The provided UI shows the local production workspace."
          },
          {
            "title": "Outputs with their own framing",
            "body": "The source describes independently directed horizontal and vertical formats, backed by a local production engine and technical checks. Supplied contact sheets document existing render results."
          }
        ],
        "galleryTitle": "From source material to a directed sequence.",
        "status": "Working desktop MVP with a local production engine. Supplied application screenshots and render contact sheets support its current workflow; the description reports three production directions and automated quality checks.",
        "next": "Artistic standardization, further UX refinement and preparation for a commercial beta remain active work. No fully autonomous creative quality or customer outcome is promised.",
        "demoStatus": "Application screenshots and a render contact sheet are available. The supplied pack contains no standalone video; no playback or live editor is simulated.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "StoryForm — Local multimedia production workflow | Brenych Studio",
        "seoDescription": "Explore StoryForm’s desktop MVP: organize multimedia sources, direct the edit and review outputs through a local production workflow."
      },
      "es": {
        "category": "Herramientas creativas / Productos digitales",
        "stage": "MVP de escritorio funcional",
        "headline": "Trae el material.\nDale forma a la historia.",
        "summary": "Organiza vídeo, imágenes y renders en un flujo de producción repetible. StoryForm reúne preparación, dirección, timeline y revisión de resultados para equipos que crean contenido visual de marca.",
        "overviewTitle": "Mantén conectado\nel trabajo creativo.",
        "problem": "La producción repetida puede dispersar selección de medios, decisiones de montaje, audio y comprobaciones de entrega. Conservar un estilo coherente resulta más difícil al aumentar el volumen.",
        "solution": "La base local de StoryForm combina perfiles reutilizables de dirección con un espacio de escritorio. Quick Create, Audio Focus y Local Creative Director muestran juntos el material y las decisiones de producción.",
        "audience": "Para creadores, estudios y equipos que producen presentaciones, historias de marca y contenido social de forma recurrente.",
        "capabilities": [
          {
            "title": "Preparar el material de origen",
            "body": "Reúne vídeo, fotografías, capturas de pantalla y renders en un contexto de producción común. Quick Create ofrece un inicio claro."
          },
          {
            "title": "Dirección junto al timeline",
            "body": "Las vistas de montaje y audio acercan las decisiones creativas al material. La interfaz aportada muestra el espacio local de producción."
          },
          {
            "title": "Formatos con encuadre propio",
            "body": "El origen describe dirección independiente horizontal y vertical mediante un motor local y comprobaciones técnicas. Las hojas de contacto documentan resultados de render existentes."
          }
        ],
        "galleryTitle": "Del material a una secuencia dirigida.",
        "status": "MVP de escritorio funcional con motor local. Las capturas y hojas de resultados respaldan el flujo actual; el documento de origen describe tres líneas de producción y comprobaciones automáticas de calidad.",
        "next": "La estandarización artística, el refinamiento de la experiencia y la preparación de una beta comercial siguen en curso. No se promete calidad creativa plenamente autónoma ni resultados de clientes.",
        "demoStatus": "Hay capturas de la aplicación y una hoja de resultados. El paquete no contiene un vídeo independiente; no se simula reproducción ni un editor en directo.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "StoryForm — Flujo local de producción multimedia | Brenych Studio",
        "seoDescription": "Explora el MVP de escritorio de StoryForm: organiza medios, dirige el montaje y revisa resultados mediante un flujo de producción local."
      }
    }
  },
  {
    "id": "abe",
    "slug": "abe",
    "name": "ABE — Autonomous Business Engine",
    "shortName": "ABE",
    "category": "core-technology",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": false,
    "composition": "operations",
    "technology": [
      "Experiment records",
      "Production integration layer",
      "Review and decision workflow"
    ],
    "relatedIds": [
      "distribution-desk"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/abe/hero-1280.webp",
      "full": "/product-media/abe/hero-1920.webp",
      "srcSet": "/product-media/abe/hero-640.webp 640w, /product-media/abe/hero-1280.webp 1280w, /product-media/abe/hero-1920.webp 1672w",
      "width": 1672,
      "height": 941,
      "alt": {
        "en": "An overview of experiments and review decisions.",
        "es": "Vista de experimentos y decisiones de revisión."
      },
      "caption": {
        "en": "Control Station V1 · synthetic-data UI demonstration. An overview of experiments and review decisions.",
        "es": "Control Station V1 · demostración de interfaz con datos sintéticos. Vista de experimentos y decisiones de revisión."
      },
      "evidenceLabel": {
        "en": "Synthetic UI demonstration",
        "es": "Demostración de interfaz sintética"
      }
    },
    "gallery": [
      {
        "id": "experiments",
        "src": "/product-media/abe/experiments-1280.webp",
        "full": "/product-media/abe/experiments-1920.webp",
        "srcSet": "/product-media/abe/experiments-640.webp 640w, /product-media/abe/experiments-1280.webp 1280w, /product-media/abe/experiments-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Keep each commercial hypothesis visible.",
          "es": "Mantén visible cada hipótesis comercial."
        },
        "caption": {
          "en": "Control Station V1 · synthetic-data UI demonstration. Keep each commercial hypothesis visible.",
          "es": "Control Station V1 · demostración de interfaz con datos sintéticos. Mantén visible cada hipótesis comercial."
        },
        "evidenceLabel": {
          "en": "Synthetic UI demonstration",
          "es": "Demostración de interfaz sintética"
        }
      },
      {
        "id": "publications",
        "src": "/product-media/abe/publications-1280.webp",
        "full": "/product-media/abe/publications-1920.webp",
        "srcSet": "/product-media/abe/publications-640.webp 640w, /product-media/abe/publications-1280.webp 1280w, /product-media/abe/publications-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Review publication records in context.",
          "es": "Revisa los registros de publicación en su contexto."
        },
        "caption": {
          "en": "Control Station V1 · synthetic-data UI demonstration. Review publication records in context.",
          "es": "Control Station V1 · demostración de interfaz con datos sintéticos. Revisa los registros de publicación en su contexto."
        },
        "evidenceLabel": {
          "en": "Synthetic UI demonstration",
          "es": "Demostración de interfaz sintética"
        }
      },
      {
        "id": "decisions",
        "src": "/product-media/abe/decisions-1280.webp",
        "full": "/product-media/abe/decisions-1920.webp",
        "srcSet": "/product-media/abe/decisions-640.webp 640w, /product-media/abe/decisions-1280.webp 1280w, /product-media/abe/decisions-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Stop, iterate or scale: a decision to review.",
          "es": "Detener, iterar o ampliar: una decisión que revisar."
        },
        "caption": {
          "en": "Control Station V1 · synthetic-data UI demonstration. Stop, iterate or scale: a decision to review.",
          "es": "Control Station V1 · demostración de interfaz con datos sintéticos. Detener, iterar o ampliar: una decisión que revisar."
        },
        "evidenceLabel": {
          "en": "Synthetic UI demonstration",
          "es": "Demostración de interfaz sintética"
        }
      }
    ],
    "limitations": {
      "en": [
        "All displayed figures, businesses and transactions belong to a synthetic UI demonstration; they are not commercial traction.",
        "The supplied pack documents an internal core, not an independently verified live production or revenue loop.",
        "Autonomous opportunity discovery, website creation and scaling are future milestones. No live provider connection is offered here."
      ],
      "es": [
        "Todas las cifras, empresas y transacciones mostradas pertenecen a una demostración sintética; no son resultados comerciales.",
        "El paquete documenta un núcleo interno, no un ciclo de producción o ingresos en directo verificado de forma independiente.",
        "La búsqueda autónoma de oportunidades, la creación de sitios y el escalado son hitos futuros. Aquí no se ofrece conexión con proveedores."
      ]
    },
    "locales": {
      "en": {
        "category": "Business systems / Core technology",
        "stage": "Internal core · synthetic UI demonstration",
        "headline": "Test the opportunity.\nKeep the decision visible.",
        "summary": "ABE brings commercial experiments, content operations and outcome records into a shared control system. Its ambition is a repeatable business-building workflow; its current evidence is an internal core and a synthetic Control Station demonstration.",
        "overviewTitle": "An experiment needs\nmore than an output.",
        "problem": "Producing content is only one part of testing a business idea. The hypothesis, publication decision, costs and outcome can easily become disconnected, making the next decision hard to explain.",
        "solution": "ABE organizes those stages around a commercial experiment. The documented core connects production integrations, experiment records and result tracking; Control Station presents the decisions that an operator needs to review.",
        "audience": "For studio operators and small teams exploring repeatable digital-business experiments.",
        "capabilities": [
          {
            "title": "Keep the hypothesis in view",
            "body": "Experiment records connect an idea with the work intended to test it. The supplied Control Station uses synthetic properties and scenarios to illustrate that structure."
          },
          {
            "title": "Review the operational record",
            "body": "Production and publication records sit alongside the experiment. The source describes integration groundwork; these images do not demonstrate currently connected production providers."
          },
          {
            "title": "Make the next decision explicit",
            "body": "STOP / ITERATE / SCALE presents a reviewable decision framework. Displayed financial figures are demonstration data, not verified revenue or automated scaling results."
          }
        ],
        "galleryTitle": "The experiment,\nits record, its next step.",
        "status": "The source describes an implemented internal core, production integrations, commercial experiment tracking and Control Station. The visual pack is a synthetic-data UI demonstration, partly based on visual targets; no fresh live capture or verified paid traction is supplied.",
        "next": "Validate the first commercial experiment and its full evidence trail. Autonomous discovery, website creation and portfolio scaling remain later stages.",
        "demoStatus": "Six synthetic Control Station images were supplied; selected views appear here. No original video or live application session is available in this pack.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "ABE — Commercial experiment systems | Brenych Studio",
        "seoDescription": "Explore ABE’s internal foundation for commercial experiments, production records and reviewable decisions, presented with a clearly labelled synthetic UI demonstration."
      },
      "es": {
        "category": "Sistemas de negocio / Tecnología propia",
        "stage": "Núcleo interno · demostración sintética",
        "headline": "Pon a prueba la oportunidad.\nHaz visible la decisión.",
        "summary": "ABE reúne experimentos comerciales, operaciones de contenido y registros de resultados en un sistema de control común. Aspira a un proceso repetible de creación de negocios; la evidencia actual es un núcleo interno y una demostración sintética de Control Station.",
        "overviewTitle": "Un experimento necesita\nmás que un resultado creativo.",
        "problem": "Producir contenido es solo una parte de probar una idea de negocio. La hipótesis, la decisión de publicar, los costes y el resultado pueden quedar separados, dificultando explicar la siguiente decisión.",
        "solution": "ABE organiza esas etapas alrededor de un experimento comercial. El núcleo documentado conecta integraciones de producción, registros de experimentos y seguimiento de resultados; Control Station muestra las decisiones que debe revisar el operador.",
        "audience": "Para estudios y equipos pequeños que exploran experimentos de negocio digital repetibles.",
        "capabilities": [
          {
            "title": "Conservar la hipótesis",
            "body": "Los registros conectan una idea con el trabajo destinado a comprobarla. Control Station utiliza propiedades y escenarios sintéticos para ilustrar esa estructura."
          },
          {
            "title": "Revisar el registro operativo",
            "body": "Los registros de producción y publicación acompañan al experimento. La documentación describe la base de integración; estas imágenes no demuestran proveedores conectados actualmente."
          },
          {
            "title": "Explicitar la siguiente decisión",
            "body": "STOP / ITERATE / SCALE presenta un marco de decisión revisable. Las cifras financieras son datos de demostración, no ingresos verificados ni resultados de escalado automático."
          }
        ],
        "galleryTitle": "El experimento,\nsu registro y el siguiente paso.",
        "status": "La fuente describe un núcleo interno implementado, integraciones de producción, seguimiento de experimentos y Control Station. El paquete visual es una demostración sintética, parcialmente basada en objetivos visuales; no aporta una captura reciente en directo ni resultados comerciales verificados.",
        "next": "Validar el primer experimento comercial y sus evidencias de principio a fin. La búsqueda autónoma, la creación de sitios y el escalado de la cartera siguen siendo etapas posteriores.",
        "demoStatus": "Se aportaron seis imágenes sintéticas de Control Station; aquí se muestran vistas seleccionadas. El paquete no incluye vídeo original ni una sesión de la aplicación en directo.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "ABE — Sistemas de experimentación comercial | Brenych Studio",
        "seoDescription": "Conoce la base interna de ABE para experimentos comerciales, registros de producción y decisiones revisables mediante una demostración sintética claramente identificada."
      }
    }
  }
];
export function getProductDossier(slug: string | undefined) { return productDossiers.find(item => item.slug === slug); }
export function getDossierPath(slug: string, locale: PublicLocale) { return `${locale === "es" ? "/es" : ""}/products/${slug}`; }
export const dossierUi = {
  "en": {
    "archive": "All products",
    "preview": "Studio collection",
    "overview": "Overview",
    "capabilities": "Capabilities",
    "demonstration": "Visual demonstration",
    "status": "Product status",
    "audience": "Made for",
    "next": "Next stage",
    "foundation": "Technical foundation",
    "recording": "Recorded demonstration",
    "play": "Play recording",
    "watchDemo": "Watch recorded demo",
    "exploreCase": "Explore the case",
    "documented": "Documented private test",
    "demoAvailability": "Available demonstration",
    "enlarge": "Enlarge image",
    "close": "Close image",
    "related": "More from the studio",
    "contact": "Discuss this product",
    "contactTitle": "A conversation starts here.",
    "contactBody": "Explore the product, discuss the technology or talk about a related project.",
    "collection": "Inside the studio",
    "collectionBody": "Explore the studio by discipline. Each product keeps its own purpose, evidence and stage of development.",
    "view": "Explore product",
    "transcript": "What the recording shows",
    "sourceLanguage": "Original interface language preserved"
  },
  "es": {
    "archive": "Todos los productos",
    "preview": "Colección del estudio",
    "overview": "Descripción",
    "capabilities": "Capacidades",
    "demonstration": "Demostración visual",
    "status": "Estado del producto",
    "audience": "Pensado para",
    "next": "Próxima etapa",
    "foundation": "Base tecnológica",
    "recording": "Demostración grabada",
    "play": "Reproducir grabación",
    "watchDemo": "Ver demo grabada",
    "exploreCase": "Explorar el caso",
    "documented": "Prueba privada documentada",
    "demoAvailability": "Demostración disponible",
    "enlarge": "Ampliar imagen",
    "close": "Cerrar imagen",
    "related": "Más del estudio",
    "contact": "Hablemos de este producto",
    "contactTitle": "Todo empieza con una conversación.",
    "contactBody": "Explora el producto, conoce la tecnología o cuéntanos un proyecto relacionado.",
    "collection": "Dentro del estudio",
    "collectionBody": "Explora el estudio por disciplinas. Cada producto conserva su objetivo, evidencias y etapa de desarrollo.",
    "view": "Explorar producto",
    "transcript": "Qué muestra la grabación",
    "sourceLanguage": "Se conserva el idioma original de la interfaz"
  }
} as const;
