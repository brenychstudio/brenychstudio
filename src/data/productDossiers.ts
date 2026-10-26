import type { PublicLocale } from "./projectRegistry.types";
import type { ProductDossier } from "./productDossierModel";
export type { DossierImage, ProductDossier } from "./productDossierModel";
// Owner-approved public dossiers only; products on hold are excluded.
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
  },
  {
    "id": "spatial-product-platform",
    "slug": "spatial-product-platform",
    "name": "Spatial Product Platform",
    "shortName": "Spatial Product Platform",
    "category": "spatial",
    "stage": "technology-showcase",
    "publicationStatus": "public",
    "featured": false,
    "composition": "spatial",
    "technology": [
      "WebGPU",
      "Browser 3D",
      "Spatial navigation"
    ],
    "relatedIds": [
      "brenych-asset-forge",
      "villa-atlas"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/spatial-product-platform/hero-1280.webp",
      "full": "/product-media/spatial-product-platform/hero-1920.webp",
      "srcSet": "/product-media/spatial-product-platform/hero-640.webp 640w, /product-media/spatial-product-platform/hero-1280.webp 1280w, /product-media/spatial-product-platform/hero-1920.webp 1920w",
      "width": 1920,
      "height": 1080,
      "alt": {
        "en": "Perfume bottle in the warm architectural world of Spatial Product Platform",
        "es": "Frasco de perfume en el entorno arquitectónico cálido de Spatial Product Platform"
      },
      "caption": {
        "en": "Perfume world · captured from the real browser runtime.",
        "es": "Mundo de perfume · captura del runtime real en el navegador."
      }
    },
    "gallery": [
      {
        "id": "glass",
        "src": "/product-media/spatial-product-platform/glass-1280.webp",
        "full": "/product-media/spatial-product-platform/glass-1920.webp",
        "srcSet": "/product-media/spatial-product-platform/glass-640.webp 640w, /product-media/spatial-product-platform/glass-1280.webp 1280w, /product-media/spatial-product-platform/glass-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "Glass perfume vessel with material detail and architectural light",
          "es": "Frasco de perfume de vidrio con detalle material e iluminación arquitectónica"
        },
        "caption": {
          "en": "Material inspection · glass, light and a considered viewpoint.",
          "es": "Inspección del material · vidrio, luz y un punto de vista cuidado."
        }
      },
      {
        "id": "jewelry",
        "src": "/product-media/spatial-product-platform/jewelry-1280.webp",
        "full": "/product-media/spatial-product-platform/jewelry-1920.webp",
        "srcSet": "/product-media/spatial-product-platform/jewelry-640.webp 640w, /product-media/spatial-product-platform/jewelry-1280.webp 1280w, /product-media/spatial-product-platform/jewelry-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "Jewelry world with rings on a sculpted display plinth",
          "es": "Mundo de joyería con anillos sobre una base escultórica"
        },
        "caption": {
          "en": "Jewelry world · a distinct atmosphere within the same showcase.",
          "es": "Mundo de joyería · una atmósfera distinta dentro de la misma demostración."
        }
      },
      {
        "id": "ring",
        "src": "/product-media/spatial-product-platform/ring-1280.webp",
        "full": "/product-media/spatial-product-platform/ring-1920.webp",
        "srcSet": "/product-media/spatial-product-platform/ring-640.webp 640w, /product-media/spatial-product-platform/ring-1280.webp 1280w, /product-media/spatial-product-platform/ring-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "Close view of a ring in the jewelry scene",
          "es": "Vista cercana de un anillo en la escena de joyería"
        },
        "caption": {
          "en": "Detail at the centre of the experience.",
          "es": "El detalle en el centro de la experiencia."
        }
      },
      {
        "id": "transition",
        "src": "/product-media/spatial-product-platform/transition-1280.webp",
        "full": "/product-media/spatial-product-platform/transition-1920.webp",
        "srcSet": "/product-media/spatial-product-platform/transition-640.webp 640w, /product-media/spatial-product-platform/transition-1280.webp 1280w, /product-media/spatial-product-platform/transition-1920.webp 1920w",
        "width": 1920,
        "height": 1080,
        "alt": {
          "en": "Architectural transition through the perfume environment",
          "es": "Transición arquitectónica por el entorno de perfume"
        },
        "caption": {
          "en": "Spatial transitions connect the product worlds.",
          "es": "Las transiciones espaciales conectan los mundos del producto."
        }
      }
    ],
    "video": {
      "assetId": "spatial-product-platform.product.demonstration",
      "poster": "/product-media/spatial-product-platform/video-poster.webp",
      "duration": "01:00.000"
    },
    "credits": [
      {
        "name": "rose-vessel",
        "creator": "Michaela Blanchfield",
        "url": "https://sketchfab.com/3d-models/perfume-bottle-7fb074117e104c5280e7360bce962267",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
      },
      {
        "name": "ornate-flask",
        "creator": "jonas_hilschmann",
        "url": "https://sketchfab.com/3d-models/perfume-bottle-realistic-pbr-asset-1e7490574bbf4a399485196d41fba29b",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
      },
      {
        "name": "trio-ring",
        "creator": "Bladeblend / Blend3drender",
        "url": "https://sketchfab.com/3d-models/gold-ring-d94897485aac4f09b7aab26353f97986",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
      },
      {
        "name": "jewel-composition",
        "creator": "iagoberdie / 3DbyL1ndo",
        "url": "https://sketchfab.com/3d-models/9747776bbc194f5a921d508cb02d19d8",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
      }
    ],
    "limitations": {
      "en": [
        "The reviewed slice covers Perfume and Jewelry; it is not an active public marketplace.",
        "The presentation video is edited and is not a real-time performance benchmark.",
        "Third-party model attribution is retained below. This page presents the reviewed Perfume and Jewelry slice."
      ],
      "es": [
        "La parte revisada incluye Perfume y Joyería; no es un marketplace público activo.",
        "El vídeo es un montaje de presentación, no una prueba de rendimiento en tiempo real.",
        "La atribución de los modelos se conserva abajo. Esta página presenta la parte revisada de Perfume y Joyería."
      ]
    },
    "locales": {
      "en": {
        "category": "Spatial / Product experience",
        "stage": "Working technology showcase",
        "headline": "The product becomes\na place to explore.",
        "summary": "Give a product’s material, scale and detail room to be understood. Spatial Product Platform turns a browser presentation into a directed 3D environment that a visitor can inspect and move through.",
        "overviewTitle": "More than an image.\nA point of view.",
        "problem": "A flat product image cannot show every relationship between material, light and form. Premium products benefit from a presentation that lets the viewer choose where to look next.",
        "solution": "The reviewed Perfume and Jewelry worlds combine browser WebGPU rendering, product inspection and spatial transitions. Each environment has its own atmosphere, built on a shared technical foundation.",
        "audience": "For brands, creative directors and product teams exploring immersive presentations of physical objects.",
        "capabilities": [
          {
            "title": "A world around the object",
            "body": "Architecture, lighting and atmosphere establish a coherent setting for the product instead of placing it in an isolated generic viewer."
          },
          {
            "title": "Inspection with intention",
            "body": "Move between wider compositions and material details. The supplied captures show the actual Perfume and Jewelry runtime."
          },
          {
            "title": "A connected spatial journey",
            "body": "Directed transitions make the movement between product worlds part of the experience. The current showcase establishes a foundation for future categories."
          }
        ],
        "galleryTitle": "Light, material and a sense of place.",
        "status": "A working browser technology showcase with a reviewed Perfume and Jewelry slice. Supplied images are runtime captures, and the presentation edit uses those real scenes.",
        "next": "Additional product categories, reusable commercial packaging and immersive WebXR/VR work remain later stages. No broad device-performance or conversion claim is made.",
        "demoStatus": "An original presentation recording is available. This page does not launch an embedded 3D runtime or a shopping checkout.",
        "videoCaption": "Edited presentation of real WebGPU scenes · not an uncut performance benchmark.",
        "videoDescription": "The presentation moves through the Perfume and Jewelry environments, material details and spatial transitions. It is a paced edit, preserving the supplied soundtrack and original video bytes.",
        "seoTitle": "Spatial Product Platform — Product experiences in space | Brenych Studio",
        "seoDescription": "Explore Brenych Studio’s browser WebGPU showcase: Perfume and Jewelry worlds, material inspection and cinematic spatial transitions."
      },
      "es": {
        "category": "Espacial / Experiencia de producto",
        "stage": "Demostración tecnológica funcional",
        "headline": "El producto se convierte\nen un lugar que explorar.",
        "summary": "Da espacio para comprender el material, la escala y los detalles de un producto. Spatial Product Platform transforma la presentación en navegador en un entorno 3D dirigido que el visitante puede recorrer e inspeccionar.",
        "overviewTitle": "Más que una imagen.\nUn punto de vista.",
        "problem": "Una imagen plana no muestra todas las relaciones entre material, luz y forma. Una presentación de producto puede permitir que el visitante elija dónde mirar después.",
        "solution": "Los mundos revisados de Perfume y Joyería combinan renderizado WebGPU en navegador, inspección y transiciones espaciales. Cada entorno tiene su atmósfera sobre una base técnica común.",
        "audience": "Para marcas, directores creativos y equipos que exploran presentaciones inmersivas de objetos físicos.",
        "capabilities": [
          {
            "title": "Un mundo alrededor del objeto",
            "body": "Arquitectura, iluminación y atmósfera crean un contexto coherente para el producto, más allá de un visor genérico aislado."
          },
          {
            "title": "Inspección con intención",
            "body": "Pasa de las composiciones amplias a los detalles del material. Las capturas aportadas muestran el runtime real de Perfume y Joyería."
          },
          {
            "title": "Un recorrido espacial conectado",
            "body": "Las transiciones dirigidas forman parte de la experiencia. La demostración actual ofrece una base para futuras categorías."
          }
        ],
        "galleryTitle": "Luz, material y sentido del espacio.",
        "status": "Demostración tecnológica en navegador con una parte revisada de Perfume y Joyería. Las imágenes son capturas del runtime y el montaje utiliza esas escenas reales.",
        "next": "Más categorías, la preparación comercial reutilizable y el trabajo inmersivo WebXR/VR corresponden a etapas posteriores. No se afirman métricas generales de rendimiento ni de conversión.",
        "demoStatus": "Hay una grabación original de presentación. Esta página no inicia un runtime 3D integrado ni un proceso de compra.",
        "videoCaption": "Montaje de presentación de escenas WebGPU reales · no es una prueba continua de rendimiento.",
        "videoDescription": "La presentación recorre los entornos de Perfume y Joyería, detalles materiales y transiciones espaciales. Es un montaje dirigido que conserva el sonido y los bytes del vídeo original.",
        "seoTitle": "Spatial Product Platform — Experiencias de producto espaciales | Brenych Studio",
        "seoDescription": "Descubre la demostración WebGPU de Brenych Studio: mundos de Perfume y Joyería, inspección de materiales y transiciones espaciales cinematográficas."
      }
    }
  },
  {
    "id": "knowledge-desk",
    "slug": "knowledge-desk",
    "name": "Knowledge Desk",
    "shortName": "Knowledge Desk",
    "category": "product",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": false,
    "composition": "knowledge",
    "technology": [
      "Windows desktop",
      "Local document library",
      "Source-linked search",
      "WebGL knowledge map"
    ],
    "relatedIds": [
      "qualor",
      "distribution-desk"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/knowledge-desk/hero-1280.webp",
      "full": "/product-media/knowledge-desk/hero-1920.webp",
      "srcSet": "/product-media/knowledge-desk/hero-640.webp 640w, /product-media/knowledge-desk/hero-1280.webp 1280w, /product-media/knowledge-desk/hero-1920.webp 1920w",
      "width": 2560,
      "height": 1440,
      "alt": {
        "en": "Knowledge Desk assistant and source-linked results in a synthetic library",
        "es": "Asistente de Knowledge Desk y resultados con fuentes en una biblioteca sintética"
      },
      "caption": {
        "en": "Windows alpha · real application UI with synthetic library content.",
        "es": "Alfa de Windows · interfaz real con contenido de biblioteca sintético."
      }
    },
    "gallery": [
      {
        "id": "map",
        "src": "/product-media/knowledge-desk/map-1280.webp",
        "full": "/product-media/knowledge-desk/map-1920.webp",
        "srcSet": "/product-media/knowledge-desk/map-640.webp 640w, /product-media/knowledge-desk/map-1280.webp 1280w, /product-media/knowledge-desk/map-1920.webp 1920w",
        "width": 2560,
        "height": 1440,
        "alt": {
          "en": "Knowledge map linking demonstration projects and technologies",
          "es": "Mapa de conocimiento que conecta proyectos y tecnologías de demostración"
        },
        "caption": {
          "en": "Explore relationships · map demonstrated on a synthetic library.",
          "es": "Explora relaciones · mapa demostrado con una biblioteca sintética."
        }
      },
      {
        "id": "library",
        "src": "/product-media/knowledge-desk/library-1280.webp",
        "full": "/product-media/knowledge-desk/library-1920.webp",
        "srcSet": "/product-media/knowledge-desk/library-640.webp 640w, /product-media/knowledge-desk/library-1280.webp 1280w, /product-media/knowledge-desk/library-1920.webp 1920w",
        "width": 2560,
        "height": 1440,
        "alt": {
          "en": "Document library with the Knowledge Desk assistant alongside it",
          "es": "Biblioteca de documentos con el asistente de Knowledge Desk"
        },
        "caption": {
          "en": "A library and its assistant, in one workspace.",
          "es": "Biblioteca y asistente en un mismo espacio."
        }
      },
      {
        "id": "source",
        "src": "/product-media/knowledge-desk/source-1280.webp",
        "full": "/product-media/knowledge-desk/source-1920.webp",
        "srcSet": "/product-media/knowledge-desk/source-640.webp 640w, /product-media/knowledge-desk/source-1280.webp 1280w, /product-media/knowledge-desk/source-1920.webp 1920w",
        "width": 2560,
        "height": 1440,
        "alt": {
          "en": "A source document opened beside a Knowledge Desk result",
          "es": "Documento de origen abierto junto a un resultado de Knowledge Desk"
        },
        "caption": {
          "en": "Return to the source behind a result.",
          "es": "Vuelve a la fuente que respalda un resultado."
        }
      }
    ],
    "video": {
      "assetId": "knowledge-desk.product.demonstration",
      "poster": "/product-media/knowledge-desk/video-poster.webp",
      "duration": "00:56.667"
    },
    "limitations": {
      "en": [
        "The supplied demonstration uses a synthetic library, local search and simulated voice interaction.",
        "The knowledge map and limited Memory Bridge pilot do not establish operation on a production library.",
        "Live provider answers, natural conversational voice and commercial availability remain further milestones."
      ],
      "es": [
        "La demostración utiliza una biblioteca sintética, búsqueda local e interacción de voz simulada.",
        "El mapa y el piloto limitado de Memory Bridge no demuestran funcionamiento con una biblioteca de producción.",
        "Las respuestas de proveedores en directo, la voz conversacional natural y la disponibilidad comercial siguen pendientes."
      ]
    },
    "locales": {
      "en": {
        "category": "Knowledge systems / Digital products",
        "stage": "Working Windows alpha",
        "headline": "Keep the source.\nSee the connections.",
        "summary": "Bring documents, revisions and project context into a local workspace. Knowledge Desk makes information easier to find, connects it visually and keeps the source within reach.",
        "overviewTitle": "A library you can\nfind your way through.",
        "problem": "Project knowledge accumulates in folders, downloads and long conversations. Finding the current document — and the reason behind a decision — becomes a project in itself.",
        "solution": "Knowledge Desk brings verified document copies, revision tracking and source-linked search into a Windows application. A spatial map and assistant interface make relationships easier to explore without hiding the underlying documents.",
        "audience": "For researchers, creators and small teams who need to return to complex projects with their context intact.",
        "capabilities": [
          {
            "title": "Keep reliable copies",
            "body": "Safe intake preserves originals while organizing verified local copies. Duplicate detection, revisions and backup/restore support a library that can be reviewed."
          },
          {
            "title": "Follow a result to its source",
            "body": "Search and the Ask Knowledge interface keep document references close to the answer. The supplied demonstration uses local retrieval on synthetic material."
          },
          {
            "title": "Explore the relationships",
            "body": "The knowledge map connects projects, technologies and documents. An animated orb gives the assistant a visible presence within the same workspace."
          }
        ],
        "galleryTitle": "From a question\nto its context.",
        "status": "Working Windows alpha, documented as 0.4.0-alpha. Local library, search, revisions and backup/restore are implemented. The supplied map and assistant demonstration use synthetic data; a separate Memory Bridge pilot was similarly limited.",
        "next": "Connect the map to a working library, validate live provider answers and natural voice, then test the workflow with design partners and real document collections.",
        "demoStatus": "An original recorded application walkthrough is available. Voice interaction in this demonstration is simulated; this page does not start a live assistant.",
        "videoCaption": "Recorded Windows alpha · synthetic library, local search and simulated voice.",
        "videoDescription": "The recording moves between the assistant, source-linked results, document library and knowledge map. It demonstrates the interface and local retrieval, not a live generative conversation.",
        "seoTitle": "Knowledge Desk — Local knowledge workspace | Brenych Studio",
        "seoDescription": "Explore Knowledge Desk: a Windows alpha for local documents, revisions, source-linked search and visual knowledge relationships."
      },
      "es": {
        "category": "Sistemas de conocimiento / Productos digitales",
        "stage": "Alfa funcional de Windows",
        "headline": "Conserva la fuente.\nDescubre las conexiones.",
        "summary": "Reúne documentos, revisiones y contexto de proyectos en un espacio local. Knowledge Desk facilita la búsqueda, muestra relaciones y mantiene las fuentes al alcance.",
        "overviewTitle": "Una biblioteca en la que\npuedes orientarte.",
        "problem": "El conocimiento de un proyecto se acumula en carpetas, descargas y conversaciones largas. Encontrar el documento vigente y el motivo de una decisión acaba siendo un trabajo aparte.",
        "solution": "Knowledge Desk reúne copias verificadas, seguimiento de revisiones y búsqueda con fuentes en una aplicación de Windows. Un mapa espacial y la interfaz del asistente permiten explorar relaciones sin ocultar los documentos originales.",
        "audience": "Para investigadores, creadores y equipos pequeños que necesitan retomar proyectos complejos conservando su contexto.",
        "capabilities": [
          {
            "title": "Conservar copias fiables",
            "body": "La importación conserva los originales y organiza copias locales verificadas. Duplicados, revisiones y copias de seguridad permiten revisar la biblioteca."
          },
          {
            "title": "Llegar hasta la fuente",
            "body": "La búsqueda y la interfaz Ask Knowledge acercan las referencias a la respuesta. La demostración utiliza recuperación local sobre material sintético."
          },
          {
            "title": "Explorar las relaciones",
            "body": "El mapa conecta proyectos, tecnologías y documentos. Una esfera animada da presencia visual al asistente dentro del mismo espacio."
          }
        ],
        "galleryTitle": "De una pregunta\na su contexto.",
        "status": "Alfa funcional de Windows, documentada como 0.4.0-alpha. Biblioteca local, búsqueda, revisiones y restauración están implementadas. La demostración del mapa y del asistente usa datos sintéticos; el piloto separado de Memory Bridge tuvo un alcance igualmente limitado.",
        "next": "Conectar el mapa a una biblioteca de trabajo, validar respuestas de proveedores y voz natural, y probar el flujo con colaboradores y documentos reales.",
        "demoStatus": "Hay un recorrido original grabado de la aplicación. La interacción de voz es simulada; esta página no inicia un asistente en directo.",
        "videoCaption": "Alfa de Windows grabada · biblioteca sintética, búsqueda local y voz simulada.",
        "videoDescription": "La grabación recorre asistente, resultados con fuentes, biblioteca y mapa de conocimiento. Demuestra la interfaz y la recuperación local, no una conversación generativa en directo.",
        "seoTitle": "Knowledge Desk — Espacio local de conocimiento | Brenych Studio",
        "seoDescription": "Conoce Knowledge Desk: alfa de Windows para documentos locales, revisiones, búsqueda con fuentes y relaciones visuales de conocimiento."
      }
    }
  },
  {
    "id": "live-intent-graph",
    "slug": "live-intent-graph",
    "name": "Live Intent Graph",
    "shortName": "Live Intent Graph",
    "category": "core-technology",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": false,
    "composition": "intent",
    "technology": [
      "Intent Core",
      "Acquisition Engine",
      "Transactional storage",
      "Notion integration layer"
    ],
    "relatedIds": [
      "abe"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/live-intent-graph/hero-1280.webp",
      "full": "/product-media/live-intent-graph/hero-1920.webp",
      "srcSet": "/product-media/live-intent-graph/hero-640.webp 640w, /product-media/live-intent-graph/hero-1280.webp 1280w, /product-media/live-intent-graph/hero-1920.webp 1672w",
      "width": 1672,
      "height": 941,
      "alt": {
        "en": "Interface concept: Discover opportunities through expressed needs.",
        "es": "Concepto de interfaz: Descubre oportunidades a partir de necesidades expresadas."
      },
      "caption": {
        "en": "Interface concept · not a running product capture. Discover opportunities through expressed needs.",
        "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Descubre oportunidades a partir de necesidades expresadas."
      },
      "evidenceLabel": {
        "en": "Interface concept",
        "es": "Concepto de interfaz"
      }
    },
    "gallery": [
      {
        "id": "map",
        "src": "/product-media/live-intent-graph/map-1280.webp",
        "full": "/product-media/live-intent-graph/map-1920.webp",
        "srcSet": "/product-media/live-intent-graph/map-640.webp 640w, /product-media/live-intent-graph/map-1280.webp 1280w, /product-media/live-intent-graph/map-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Interface concept: A geographic view of intended signal discovery.",
          "es": "Concepto de interfaz: Vista geográfica del descubrimiento de señales propuesto."
        },
        "caption": {
          "en": "Interface concept · not a running product capture. A geographic view of intended signal discovery.",
          "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Vista geográfica del descubrimiento de señales propuesto."
        },
        "evidenceLabel": {
          "en": "Interface concept",
          "es": "Concepto de interfaz"
        }
      },
      {
        "id": "intents",
        "src": "/product-media/live-intent-graph/intents-1280.webp",
        "full": "/product-media/live-intent-graph/intents-1920.webp",
        "srcSet": "/product-media/live-intent-graph/intents-640.webp 640w, /product-media/live-intent-graph/intents-1280.webp 1280w, /product-media/live-intent-graph/intents-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Interface concept: Describe the intent you want to explore.",
          "es": "Concepto de interfaz: Describe el propósito que quieres explorar."
        },
        "caption": {
          "en": "Interface concept · not a running product capture. Describe the intent you want to explore.",
          "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Describe el propósito que quieres explorar."
        },
        "evidenceLabel": {
          "en": "Interface concept",
          "es": "Concepto de interfaz"
        }
      },
      {
        "id": "pipeline",
        "src": "/product-media/live-intent-graph/pipeline-1280.webp",
        "full": "/product-media/live-intent-graph/pipeline-1920.webp",
        "srcSet": "/product-media/live-intent-graph/pipeline-640.webp 640w, /product-media/live-intent-graph/pipeline-1280.webp 1280w, /product-media/live-intent-graph/pipeline-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Interface concept: A proposed workspace for reviewing client opportunities.",
          "es": "Concepto de interfaz: Espacio propuesto para revisar oportunidades de clientes."
        },
        "caption": {
          "en": "Interface concept · not a running product capture. A proposed workspace for reviewing client opportunities.",
          "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Espacio propuesto para revisar oportunidades de clientes."
        },
        "evidenceLabel": {
          "en": "Interface concept",
          "es": "Concepto de interfaz"
        }
      }
    ],
    "limitations": {
      "en": [
        "All displayed interfaces are presentation concepts, not screenshots of a deployed Live Intent Graph product.",
        "Profiles, signal counts and opportunities in these concepts are illustrative, not verified people or current demand.",
        "Live source certification and demand validation remain pending. The broader Clients / Social / Work / Collaborations experience is a product vision."
      ],
      "es": [
        "Todas las interfaces mostradas son conceptos de presentación, no capturas de un producto Live Intent Graph desplegado.",
        "Los perfiles, recuentos de señales y oportunidades son ilustrativos, no personas verificadas ni demanda actual confirmada.",
        "La certificación de fuentes en directo y la validación de demanda siguen pendientes. La experiencia Clients / Social / Work / Collaborations es una visión de producto."
      ]
    },
    "locales": {
      "en": {
        "category": "Intent systems / Core technology",
        "stage": "Tested core reported · interface concepts",
        "headline": "Start with the need.\nFind the relevant connection.",
        "summary": "Live Intent Graph explores search around what someone needs, where and when. A documented intent and acquisition core underpins a wider product vision, illustrated here through interface concepts.",
        "overviewTitle": "A profile tells you who.\nAn intent asks what comes next.",
        "problem": "A directory can identify a person or business without explaining what they need now. Useful signals are scattered, difficult to compare and often separated from their source and timing.",
        "solution": "The proposed experience organizes opportunities around explicit intent and supporting context. The current foundation is an Intent Core, acquisition architecture and transactional store; live sources and the complete user experience remain to be validated.",
        "audience": "For teams researching client needs, professional opportunities and potential collaborations.",
        "capabilities": [
          {
            "title": "Structure an intent",
            "body": "The documented Intent Core provides the foundation for representing needs. Natural-language discovery and My Intents are illustrated as interface concepts, not a live search offered on this page."
          },
          {
            "title": "Organize incoming signals",
            "body": "The source reports an acquisition layer and transactional storage. Connecting certified real-world sources is the next validation step; the concept map does not show a verified live feed."
          },
          {
            "title": "Prepare a review workflow",
            "body": "A Notion integration layer is described in the implemented foundation. The proposed client pipeline illustrates how opportunities could be reviewed once the source and demand checks are complete."
          }
        ],
        "galleryTitle": "A direction for\nintent-led discovery.",
        "status": "The supplied description reports a tested core architecture, acquisition layer, transactional store and Notion integration. This portfolio audit did not rerun those product tests. All supplied product visuals are concepts; the complete user-facing product remains in development.",
        "next": "Certify integrations against permitted real sources, validate demand and build the user-facing discovery workflow. No current live search or commercial availability is claimed.",
        "demoStatus": "Selected presentation concepts are available to enlarge. No original product video was supplied. An unrelated operator analytics reference was excluded.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "Live Intent Graph — Intent-led discovery | Brenych Studio",
        "seoDescription": "Explore Live Intent Graph’s documented core and interface direction for discovery around expressed needs, with live-source validation clearly separated from the concept."
      },
      "es": {
        "category": "Sistemas de intención / Tecnología propia",
        "stage": "Núcleo probado según la fuente · conceptos",
        "headline": "Parte de la necesidad.\nEncuentra la conexión relevante.",
        "summary": "Live Intent Graph explora la búsqueda a partir de lo que alguien necesita, dónde y cuándo. Un núcleo documentado de intención y adquisición sustenta una visión más amplia, ilustrada aquí mediante conceptos de interfaz.",
        "overviewTitle": "El perfil dice quién.\nLa intención plantea qué sigue.",
        "problem": "Un directorio puede identificar una persona o empresa sin explicar qué necesita ahora. Las señales útiles están dispersas, son difíciles de comparar y a menudo pierden su fuente y contexto temporal.",
        "solution": "La experiencia propuesta organiza oportunidades alrededor de intenciones explícitas y contexto. La base actual comprende Intent Core, arquitectura de adquisición y almacenamiento transaccional; las fuentes en directo y la experiencia completa siguen pendientes de validación.",
        "audience": "Para equipos que investigan necesidades de clientes, oportunidades profesionales y posibles colaboraciones.",
        "capabilities": [
          {
            "title": "Estructurar una intención",
            "body": "Intent Core aporta la base documentada para representar necesidades. La búsqueda en lenguaje natural y My Intents se ilustran como conceptos, no como un buscador activo en esta página."
          },
          {
            "title": "Organizar las señales entrantes",
            "body": "La fuente documenta una capa de adquisición y almacenamiento transaccional. Conectar fuentes reales certificadas es el siguiente paso; el mapa conceptual no muestra un flujo en directo verificado."
          },
          {
            "title": "Preparar la revisión",
            "body": "La base implementada incluye una capa de integración con Notion según la documentación. La propuesta de cartera de clientes ilustra cómo revisar oportunidades tras validar fuentes y demanda."
          }
        ],
        "galleryTitle": "Una dirección para\ndescubrir intenciones.",
        "status": "La descripción aportada informa de una arquitectura central probada, adquisición, almacenamiento transaccional e integración con Notion. Esta revisión de portfolio no repitió las pruebas del producto. Todas las imágenes son conceptos; el producto completo para usuarios continúa en desarrollo.",
        "next": "Certificar integraciones con fuentes reales permitidas, validar la demanda y construir la experiencia de búsqueda. No se afirma disponibilidad comercial ni búsqueda en directo actual.",
        "demoStatus": "Los conceptos seleccionados pueden ampliarse. No se aportó un vídeo original del producto. Se excluyó una referencia analítica de otro sistema.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "Live Intent Graph — Descubrimiento por intención | Brenych Studio",
        "seoDescription": "Descubre la base documentada y la dirección visual de Live Intent Graph para buscar necesidades expresadas, distinguiendo el concepto de la validación de fuentes reales."
      }
    }
  },
  {
    "id": "native-site-control",
    "slug": "native-site-control",
    "name": "Native Site Control",
    "shortName": "Native Site Control",
    "category": "core-technology",
    "stage": "working-prototype",
    "publicationStatus": "public",
    "featured": false,
    "composition": "control",
    "technology": [
      "Revision core",
      "Access control",
      "Git and Cloudflare adapters",
      "AI proposal boundaries"
    ],
    "relatedIds": [
      "distribution-desk",
      "abe"
    ],
    "demoLinks": [],
    "hero": {
      "id": "hero",
      "src": "/product-media/native-site-control/hero-1280.webp",
      "full": "/product-media/native-site-control/hero-1920.webp",
      "srcSet": "/product-media/native-site-control/hero-640.webp 640w, /product-media/native-site-control/hero-1280.webp 1280w, /product-media/native-site-control/hero-1920.webp 1672w",
      "width": 1672,
      "height": 941,
      "alt": {
        "en": "Interface concept: A control center for an existing website.",
        "es": "Concepto de interfaz: Un centro de control para un sitio existente."
      },
      "caption": {
        "en": "Interface concept · not a running product capture. A control center for an existing website.",
        "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Un centro de control para un sitio existente."
      },
      "evidenceLabel": {
        "en": "Interface concept",
        "es": "Concepto de interfaz"
      }
    },
    "gallery": [
      {
        "id": "editing",
        "src": "/product-media/native-site-control/editing-1280.webp",
        "full": "/product-media/native-site-control/editing-1920.webp",
        "srcSet": "/product-media/native-site-control/editing-640.webp 640w, /product-media/native-site-control/editing-1280.webp 1280w, /product-media/native-site-control/editing-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Interface concept: Prepare a content change in the proposed editor.",
          "es": "Concepto de interfaz: Prepara un cambio de contenido en el editor propuesto."
        },
        "caption": {
          "en": "Interface concept · not a running product capture. Prepare a content change in the proposed editor.",
          "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Prepara un cambio de contenido en el editor propuesto."
        },
        "evidenceLabel": {
          "en": "Interface concept",
          "es": "Concepto de interfaz"
        }
      },
      {
        "id": "review",
        "src": "/product-media/native-site-control/review-1280.webp",
        "full": "/product-media/native-site-control/review-1920.webp",
        "srcSet": "/product-media/native-site-control/review-640.webp 640w, /product-media/native-site-control/review-1280.webp 1280w, /product-media/native-site-control/review-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Interface concept: Review a revision before deciding to apply it.",
          "es": "Concepto de interfaz: Revisa una modificación antes de decidir si aplicarla."
        },
        "caption": {
          "en": "Interface concept · not a running product capture. Review a revision before deciding to apply it.",
          "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Revisa una modificación antes de decidir si aplicarla."
        },
        "evidenceLabel": {
          "en": "Interface concept",
          "es": "Concepto de interfaz"
        }
      },
      {
        "id": "revisions",
        "src": "/product-media/native-site-control/revisions-1280.webp",
        "full": "/product-media/native-site-control/revisions-1920.webp",
        "srcSet": "/product-media/native-site-control/revisions-640.webp 640w, /product-media/native-site-control/revisions-1280.webp 1280w, /product-media/native-site-control/revisions-1920.webp 1672w",
        "width": 1672,
        "height": 941,
        "alt": {
          "en": "Interface concept: Keep a visible history of changes.",
          "es": "Concepto de interfaz: Conserva un historial visible de cambios."
        },
        "caption": {
          "en": "Interface concept · not a running product capture. Keep a visible history of changes.",
          "es": "Concepto de interfaz · no es una captura del producto en funcionamiento. Conserva un historial visible de cambios."
        },
        "evidenceLabel": {
          "en": "Interface concept",
          "es": "Concepto de interfaz"
        }
      }
    ],
    "limitations": {
      "en": [
        "These are NSC presentation concepts, not captures of the current offline demonstration fixture.",
        "Deployment, approval and verified-live labels inside the concepts are visual proposals, not production receipts.",
        "Production connections and broader framework support remain future work. Native Site Control is separate from NATIVE Networking Companion."
      ],
      "es": [
        "Estas imágenes son conceptos de presentación de NSC, no capturas del entorno actual de demostración sin conexión.",
        "Las etiquetas de despliegue, aprobación y verificación en directo son propuestas visuales, no comprobantes de producción.",
        "Las conexiones de producción y el soporte de más frameworks siguen pendientes. Native Site Control es un producto distinto de NATIVE Networking Companion."
      ]
    },
    "locales": {
      "en": {
        "category": "Website operations / Core technology",
        "stage": "Implemented core · presentation concepts",
        "headline": "Keep the website.\nTake control of its changes.",
        "summary": "Native Site Control explores a control layer for existing websites: content proposals, revisions and human decisions without replacing the site's frontend. Its implemented core and controlled integration are documented; the images show a proposed interface direction.",
        "overviewTitle": "A content change should\nbe a reviewable decision.",
        "problem": "Custom websites often need a developer for routine content changes. Moving to another CMS can mean rebuilding, while unrestricted automated edits can make it difficult to understand what will change.",
        "solution": "NSC separates a proposed edit from the decision to apply it. A revision core, access controls and integration adapters provide the documented foundation for managing an existing website while keeping its architecture.",
        "audience": "For web studios, agencies and owners of custom sites who want a controlled editing workflow.",
        "capabilities": [
          {
            "title": "Prepare changes as revisions",
            "body": "The documented core and administration workflow organize edits into revisions. The proposed content editor illustrates that workflow; it is not a capture of the current offline fixture."
          },
          {
            "title": "Keep authority with the owner",
            "body": "Access control and AI Bridge boundaries separate proposals from consequential actions. Human review remains part of the intended change process."
          },
          {
            "title": "Connect through adapters",
            "body": "The source reports Git and Cloudflare adapters and a controlled React + Vite integration. Broader framework support and production connections still require validation."
          }
        ],
        "galleryTitle": "From proposed edit\nto an informed decision.",
        "status": "The source documents an implemented core, administration, revisions, access control and adapters, with a controlled React + Vite site integration. The current demonstration is an offline fixture; supplied imagery is a presentation concept pack, not evidence of production deployment.",
        "next": "Validate production connections and their verification workflow, then broaden framework support. A universal multi-site service is an ambition, not a completed deployment claim.",
        "demoStatus": "Selected interface concepts can be enlarged. No original application video was supplied. This page neither connects a website nor applies changes.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "Native Site Control — Reviewable website changes | Brenych Studio",
        "seoDescription": "Explore Native Site Control: an implemented foundation for revisions, access control and website adapters, shown through clearly labelled interface concepts."
      },
      "es": {
        "category": "Operaciones web / Tecnología propia",
        "stage": "Núcleo implementado · conceptos visuales",
        "headline": "Conserva tu sitio.\nControla cada cambio.",
        "summary": "Native Site Control explora una capa de control para sitios existentes: propuestas de contenido, revisiones y decisiones humanas sin sustituir el frontend. Su núcleo e integración controlada están documentados; las imágenes muestran una dirección visual propuesta.",
        "overviewTitle": "Un cambio de contenido\ndebe poder revisarse.",
        "problem": "Los sitios a medida suelen depender de un desarrollador para cambios cotidianos. Migrar a otra CMS puede exigir reconstruirlos, mientras que las ediciones automáticas sin límites dificultan saber qué va a cambiar.",
        "solution": "NSC separa la propuesta de edición de la decisión de aplicarla. Un núcleo de revisiones, controles de acceso y adaptadores constituyen la base documentada para gestionar un sitio conservando su arquitectura.",
        "audience": "Para estudios web, agencias y propietarios de sitios a medida que necesitan un proceso de edición controlado.",
        "capabilities": [
          {
            "title": "Preparar cambios como revisiones",
            "body": "El núcleo y la administración documentados organizan las ediciones en revisiones. El editor propuesto ilustra ese flujo; no es una captura del entorno actual sin conexión."
          },
          {
            "title": "Conservar la autoridad del propietario",
            "body": "El control de acceso y los límites de AI Bridge separan propuestas y acciones relevantes. La revisión humana forma parte del proceso previsto."
          },
          {
            "title": "Conectar mediante adaptadores",
            "body": "La fuente documenta adaptadores Git y Cloudflare y una integración controlada con React + Vite. El soporte de más frameworks y las conexiones de producción aún requieren validación."
          }
        ],
        "galleryTitle": "De la propuesta\na una decisión informada.",
        "status": "La fuente documenta núcleo, administración, revisiones, control de acceso y adaptadores, con integración controlada en un sitio React + Vite. La demostración actual es un entorno sin conexión; las imágenes son conceptos de presentación, no evidencia de despliegue en producción.",
        "next": "Validar conexiones de producción y su verificación, y ampliar el soporte de frameworks. Un servicio universal para múltiples sitios es una ambición, no un despliegue completado.",
        "demoStatus": "Los conceptos seleccionados pueden ampliarse. No se aportó vídeo original de la aplicación. Esta página no conecta sitios ni aplica cambios.",
        "videoCaption": "",
        "videoDescription": "",
        "seoTitle": "Native Site Control — Cambios web revisables | Brenych Studio",
        "seoDescription": "Conoce Native Site Control: una base implementada de revisiones, acceso y adaptadores web presentada mediante conceptos de interfaz claramente identificados."
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
    "sourceLanguage": "Original interface language preserved",
    "credits": "Source assets and attribution",
    "creditContext": "Source assets credited by the supplied review pack. Scene arrangement, lighting and direction by Brenych Studio; screenshots resized proportionally for this page.",
    "environmentCredits": "Environment references/assets: Poly Haven (CC0). Sound studies generated with ElevenLabs; direction and mix by Brenych Studio."
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
    "sourceLanguage": "Se conserva el idioma original de la interfaz",
    "credits": "Fuentes y atribución",
    "creditContext": "Modelos atribuidos en el paquete de origen. Composición, iluminación y dirección de Brenych Studio; capturas redimensionadas proporcionalmente para esta página.",
    "environmentCredits": "Referencias y recursos del entorno: Poly Haven (CC0). Estudios sonoros generados con ElevenLabs; dirección y mezcla de Brenych Studio."
  }
} as const;
