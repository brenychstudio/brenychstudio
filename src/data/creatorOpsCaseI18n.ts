export const creatorOpsCaseI18n = {
  en: {
    statusLabel: "Live beta",
    creditLabels: {
      role: "Role",
      stack: "Stack",
      status: "Status",
    },
    linkLabels: {
      live: "Live site",
      repo: "Repository",
    },

    tagline: "A beta-ready content workflow system for creators.",

    statusNote:
      "Usable MVP prototype with end-to-end creator workflow, Smart Mix logic, ZIP export, Bio Builder, live deploy, and active product development.",

    summary:
      "CreatorOps is a premium creator workflow prototype that turns scattered visual assets into a calm publishing pipeline. The product guides users through Library, Smart Mix, Sequence, Planner, Captions, Export, and Bio Builder, producing a real downloadable content pack rather than a static dashboard preview.",

    posterAlt: "CreatorOps poster cover",
    videoAlt: "CreatorOps walkthrough video",
    heroCaption:
      "Beta-ready creator workflow prototype with Smart Mix logic, export pipeline, and an extensible Tools layer.",

    problem:
      "Creators often have enough content, but not enough structure. Their media, captions, publishing rhythm, and profile positioning live in separate places, which makes the decision process messy, repetitive, and difficult to turn into a clear publishing outcome.",

    approach:
      "CreatorOps was built as a guided content pipeline where every step narrows the decision field: Library, Smart Mix, Sequence, Planner, Captions, Export, and Bio Builder. The product avoids dashboard clutter and focuses on calm decision support, structured output, and an extensible Tools layer.",

    outcome:
      "The result is a live beta-ready prototype with a functional end-to-end loop: users can select assets, generate Smart Mix candidates, organize a sequence, prepare captions, export a real ZIP publishing pack, then continue into Bio Builder to shape an Instagram-style profile and download a profile brief.",

    clarity:
      "The project turns content chaos into a structured workflow: assets become a mix, the mix becomes a plan, the plan becomes captions and export files, and the final pack becomes profile context.",

    motion:
      "Motion supports product calm rather than visual noise: restrained transitions, card rhythm, workspace feedback, and smooth route flow help the prototype feel premium without obscuring the workflow.",

    build:
      "Built with Vite, React, TypeScript, Tailwind CSS, React Router, Motion, JSZip, browser-side file handling, local/session state, Cloudflare Pages deployment, and GitHub-based delivery.",

    notes:
      "Project framing\n- Beta-ready content workflow prototype for creators and small content teams.\n- Built as a product system, not a landing-page-only concept.\n- Current status: usable MVP demo, live deploy, active product development.\n\nCore workflow\n- Library → Smart Mix → Sequence → Planner → Captions → Export → Bio Builder.\n- The core loop helps users move from scattered visual assets to a clean publishing pack.\n- Export produces a real downloadable ZIP pack with images, captions, hashtags, CSV, manifest, README, and structured text outputs.\n\nSmart Mix\n- Smart Mix acts as the decision layer of the product.\n- It generates 3x3 candidate mixes, ranks options, avoids repetition, supports variety guardrails, and explains why a mix works.\n- This makes the prototype more than a visual dashboard: it includes actual content decision logic.\n\nExport\n- Export is one of the strongest proof points.\n- The workflow ends in a real downloadable outcome instead of a static preview.\n- This gives the product practical value and demonstrates product-engineering thinking.\n\nBio Builder\n- Bio Builder is the first Tools module inside CreatorOps.\n- It works as both a standalone Instagram-style profile simulator and an extension of the Export flow.\n- It supports avatar upload, uploaded grid mode, connected export-pack mode, local generated variants, copy actions, and .txt profile pack download.\n- The current generation layer is local and deterministic, but the data structure is prepared for future OpenAI integration.\n\nTechnical architecture\n- SPA prototype with route-driven architecture.\n- Major steps live as separate routes.\n- Prototype shell manages navigation, tools, and layout.\n- State carries the user across the workflow.\n- Tools are separate from the main flow but can connect to Export.\n- The project is deployed on Cloudflare Pages and versioned through GitHub.\n\nCurrent limitations\n- Not a full production SaaS yet.\n- No backend, user accounts, cloud storage, real OpenAI API integration, Instagram Graph API publishing, scheduling, analytics, billing, production database, or final accessibility pass.\n- Bio Builder is an MVP layer with local/session logic rather than cloud persistence.\n\nWhy this case matters\n- CreatorOps demonstrates product thinking, UX flow design, frontend architecture, state-driven interfaces, upload handling, Smart Mix logic, ZIP export, responsive QA, premium SaaS UI, and live deployment.\n- It is one of the strongest portfolio cases because it proves the ability to build a real multi-step product system with practical output, not just an attractive interface.\n\nProject links\n- Live site available.\n- Repository available.\n- Beta-ready MVP prototype; no commercial SaaS metrics claimed.",

    frames: [
      {
        alt: "CreatorOps - desktop hero frame",
        caption:
          "Product positioning surface framing CreatorOps as a calm operating system for creators and small content teams.",
      },
      {
        alt: "CreatorOps - desktop frame 01",
        caption:
          "Marketing landing surface presenting the product promise, creator outcome, and premium SaaS direction.",
      },
      {
        alt: "CreatorOps - desktop frame 02",
        caption:
          "System logic section explaining the calm guardrails behind content planning and publishing decisions.",
      },
      {
        alt: "CreatorOps - desktop frame 03",
        caption:
          "Creator-facing product promise translated into a clear mobile-output and publishing-pack narrative.",
      },
      {
        alt: "CreatorOps - desktop frame 04",
        caption:
          "Premium landing chapter using dark product staging and restrained visual rhythm.",
      },
      {
        alt: "CreatorOps - desktop frame 05",
        caption:
          "Roadmap and monetization surface showing how the prototype can expand into a larger creator workflow product.",
      },
      {
        alt: "CreatorOps - desktop frame 06",
        caption:
          "Library and Smart Mix workspace where visual assets become structured content candidates.",
      },
      {
        alt: "CreatorOps - desktop frame 07",
        caption:
          "Dark prototype interface showing asset selection, state-driven layout, and product-like workspace density.",
      },
      {
        alt: "CreatorOps - desktop frame 08",
        caption:
          "Light workspace variation demonstrating the product system across visual modes and review contexts.",
      },
      {
        alt: "CreatorOps - desktop frame 09",
        caption:
          "Smart Mix output surface turning selected assets into ranked 3x3 content directions.",
      },
      {
        alt: "CreatorOps - desktop frame 10",
        caption:
          "Captions and planning workspace connecting content selection with publishing rhythm and output structure.",
      },
      {
        alt: "CreatorOps - desktop frame 11",
        caption:
          "Export and tools-oriented state showing how the workflow continues beyond visual selection.",
      },
      {
        alt: "CreatorOps - desktop frame 12",
        caption:
          "Bio Builder workspace combining profile fields, content grid context, generated variants, and live preview.",
      },
      {
        alt: "CreatorOps - desktop frame 13",
        caption:
          "Connected profile-building flow that extends the content pack into an Instagram-style bio and identity layer.",
      },
      {
        alt: "CreatorOps - mobile frame 01",
        caption:
          "Mobile content grid preserving the visual logic of the publishing pack.",
      },
      {
        alt: "CreatorOps - mobile frame 02",
        caption:
          "Mobile Smart Mix step focused on selected assets, generated candidates, and continuation flow.",
      },
      {
        alt: "CreatorOps - mobile frame 03",
        caption:
          "Mobile sequence state showing how the selected mix becomes an ordered publishing direction.",
      },
      {
        alt: "CreatorOps - mobile frame 04",
        caption:
          "Mobile planner state linking pack selection, rhythm, and next-step product flow.",
      },
      {
        alt: "CreatorOps - mobile frame 05",
        caption:
          "Mobile export state with downloadable pack logic and practical output framing.",
      },
      {
        alt: "CreatorOps - mobile frame 06",
        caption:
          "Mobile Bio Builder form for shaping handle, audience, offer, CTA, and profile direction.",
      },
      {
        alt: "CreatorOps - mobile frame 07",
        caption:
          "Instagram-style profile preview adapting the content pack into a creator-facing public identity.",
      },
      {
        alt: "CreatorOps - mobile frame 08",
        caption:
          "Mobile profile and pack handoff showing how CreatorOps can expand into standalone creator tools.",
      },
    ],
  },

  es: {
    statusLabel: "Beta en vivo",
    creditLabels: {
      role: "Rol",
      stack: "Stack",
      status: "Estado",
    },
    linkLabels: {
      live: "Sitio online",
      repo: "Repositorio",
    },

    tagline: "Un sistema beta-ready de workflow de contenido para creadores.",

    statusNote:
      "Prototipo MVP usable con workflow end-to-end para creadores, lógica Smart Mix, exportación ZIP, Bio Builder, live deploy y desarrollo activo del producto.",

    summary:
      "CreatorOps es un prototipo premium de workflow para creadores que convierte assets visuales dispersos en una publishing pipeline calmada. El producto guía al usuario por Library, Smart Mix, Sequence, Planner, Captions, Export y Bio Builder, generando un content pack descargable real en lugar de un simple dashboard estático.",

    posterAlt: "Portada póster de CreatorOps",
    videoAlt: "Vídeo walkthrough de CreatorOps",
    heroCaption:
      "Prototipo beta-ready de workflow para creadores con lógica Smart Mix, export pipeline y una capa Tools extensible.",

    problem:
      "Los creadores suelen tener suficiente contenido, pero poca estructura. Sus media, captions, ritmo de publicación y posicionamiento de perfil viven en lugares separados, lo que vuelve el proceso de decisión desordenado, repetitivo y difícil de convertir en un resultado publicable claro.",

    approach:
      "CreatorOps se construyó como una pipeline guiada de contenido donde cada paso reduce el campo de decisión: Library, Smart Mix, Sequence, Planner, Captions, Export y Bio Builder. El producto evita el clutter de dashboards y se enfoca en soporte calmado de decisiones, output estructurado y una capa Tools extensible.",

    outcome:
      "El resultado es un prototipo beta-ready en vivo con un loop end-to-end funcional: los usuarios pueden seleccionar assets, generar candidatos Smart Mix, organizar una secuencia, preparar captions, exportar un ZIP publishing pack real y continuar hacia Bio Builder para dar forma a un perfil estilo Instagram y descargar un profile brief.",

    clarity:
      "El proyecto convierte el caos de contenido en un workflow estructurado: los assets se convierten en mix, el mix en plan, el plan en captions y archivos de exportación, y el pack final en contexto de perfil.",

    motion:
      "El motion sostiene la calma del producto en lugar de generar ruido visual: transiciones contenidas, ritmo de cards, feedback de workspace y route flow suave hacen que el prototipo se sienta premium sin ocultar el workflow.",

    build:
      "Construido con Vite, React, TypeScript, Tailwind CSS, React Router, Motion, JSZip, browser-side file handling, local/session state, despliegue en Cloudflare Pages y delivery basado en GitHub.",

    notes:
      "Enfoque del proyecto\n- Prototipo beta-ready de workflow de contenido para creadores y pequeños equipos.\n- Construido como sistema de producto, no como concepto solo de landing page.\n- Estado actual: MVP demo usable, live deploy y desarrollo activo.\n\nCore workflow\n- Library → Smart Mix → Sequence → Planner → Captions → Export → Bio Builder.\n- El core loop ayuda a pasar de assets visuales dispersos a un publishing pack limpio.\n- Export genera un ZIP descargable real con imágenes, captions, hashtags, CSV, manifest, README y salidas de texto estructuradas.\n\nSmart Mix\n- Smart Mix actúa como decision layer del producto.\n- Genera candidatos 3x3, rankea opciones, evita repetición, sostiene variety guardrails y explica por qué un mix funciona.\n- Esto convierte el prototipo en algo más que un dashboard visual: incluye lógica real de decisión de contenido.\n\nExport\n- Export es uno de los proof points más fuertes.\n- El workflow termina en un outcome descargable real en lugar de un preview estático.\n- Esto da valor práctico al producto y demuestra pensamiento de product engineering.\n\nBio Builder\n- Bio Builder es el primer módulo Tools dentro de CreatorOps.\n- Funciona como simulador de perfil estilo Instagram standalone y como extensión del Export flow.\n- Soporta avatar upload, uploaded grid mode, connected export-pack mode, variantes generadas localmente, copy actions y descarga de .txt profile pack.\n- La generación actual es local y determinística, pero la estructura de datos está preparada para futura integración OpenAI.\n\nArquitectura técnica\n- Prototipo SPA con arquitectura route-driven.\n- Cada major step vive en una ruta separada.\n- Prototype shell maneja navegación, tools y layout.\n- El estado acompaña al usuario a través del workflow.\n- Tools vive separado del main flow, pero puede conectarse a Export.\n- El proyecto está desplegado en Cloudflare Pages y versionado en GitHub.\n\nLimitaciones actuales\n- Todavía no es un SaaS production completo.\n- Sin backend, cuentas, cloud storage, OpenAI API real, publicación vía Instagram Graph API, scheduling, analytics, billing, production database o final accessibility pass.\n- Bio Builder es una capa MVP con local/session logic, no cloud persistence.\n\nPor qué importa este caso\n- CreatorOps demuestra product thinking, UX flow design, frontend architecture, state-driven interfaces, upload handling, Smart Mix logic, ZIP export, responsive QA, premium SaaS UI y live deployment.\n- Es uno de los casos más fuertes del portfolio porque prueba la capacidad de construir un sistema de producto multi-step con output práctico, no solo una interfaz atractiva.\n\nProject links\n- Sitio online disponible.\n- Repositorio disponible.\n- Prototipo MVP beta-ready; no se reclaman métricas comerciales SaaS.",

    frames: [
      {
        alt: "CreatorOps - hero desktop",
        caption:
          "Superficie de posicionamiento que presenta CreatorOps como un sistema operativo calmado para creadores y pequeños equipos de contenido.",
      },
      {
        alt: "CreatorOps - frame desktop 01",
        caption:
          "Landing de marketing que presenta la promesa del producto, el outcome para creadores y la dirección premium SaaS.",
      },
      {
        alt: "CreatorOps - frame desktop 02",
        caption:
          "Sección de lógica del sistema que explica los guardrails calmados detrás de la planificación y decisiones de publicación.",
      },
      {
        alt: "CreatorOps - frame desktop 03",
        caption:
          "Promesa de producto orientada a creadores traducida en narrativa clara de mobile output y publishing pack.",
      },
      {
        alt: "CreatorOps - frame desktop 04",
        caption:
          "Capítulo landing premium con dark product staging y ritmo visual contenido.",
      },
      {
        alt: "CreatorOps - frame desktop 05",
        caption:
          "Superficie de roadmap y monetización mostrando cómo el prototipo puede crecer hacia un producto creator workflow mayor.",
      },
      {
        alt: "CreatorOps - frame desktop 06",
        caption:
          "Workspace de Library y Smart Mix donde assets visuales se convierten en candidatos de contenido estructurado.",
      },
      {
        alt: "CreatorOps - frame desktop 07",
        caption:
          "Interfaz prototype dark mostrando selección de assets, layout state-driven y densidad de workspace tipo producto.",
      },
      {
        alt: "CreatorOps - frame desktop 08",
        caption:
          "Variación light workspace que demuestra el sistema de producto en distintos modos visuales y contextos de revisión.",
      },
      {
        alt: "CreatorOps - frame desktop 09",
        caption:
          "Superficie Smart Mix que convierte assets seleccionados en direcciones de contenido 3x3 rankeadas.",
      },
      {
        alt: "CreatorOps - frame desktop 10",
        caption:
          "Workspace de captions y planning que conecta selección de contenido con ritmo de publicación y estructura de output.",
      },
      {
        alt: "CreatorOps - frame desktop 11",
        caption:
          "Estado orientado a Export y Tools que muestra cómo el workflow continúa más allá de la selección visual.",
      },
      {
        alt: "CreatorOps - frame desktop 12",
        caption:
          "Workspace Bio Builder combinando campos de perfil, contexto de content grid, variantes generadas y live preview.",
      },
      {
        alt: "CreatorOps - frame desktop 13",
        caption:
          "Flujo conectado de profile-building que extiende el content pack hacia una bio e identity layer estilo Instagram.",
      },
      {
        alt: "CreatorOps - frame mobile 01",
        caption:
          "Grid móvil de contenido que conserva la lógica visual del publishing pack.",
      },
      {
        alt: "CreatorOps - frame mobile 02",
        caption:
          "Paso Smart Mix móvil enfocado en assets seleccionados, candidatos generados y flujo de continuación.",
      },
      {
        alt: "CreatorOps - frame mobile 03",
        caption:
          "Estado Sequence móvil mostrando cómo el mix seleccionado se convierte en una dirección de publicación ordenada.",
      },
      {
        alt: "CreatorOps - frame mobile 04",
        caption:
          "Estado Planner móvil conectando selección del pack, ritmo y siguiente paso de producto.",
      },
      {
        alt: "CreatorOps - frame mobile 05",
        caption:
          "Estado Export móvil con lógica de pack descargable y framing práctico del output.",
      },
      {
        alt: "CreatorOps - frame mobile 06",
        caption:
          "Formulario Bio Builder móvil para definir handle, audiencia, oferta, CTA y dirección de perfil.",
      },
      {
        alt: "CreatorOps - frame mobile 07",
        caption:
          "Preview de perfil estilo Instagram que adapta el content pack a una identidad pública para creadores.",
      },
      {
        alt: "CreatorOps - frame mobile 08",
        caption:
          "Handoff móvil de perfil y pack mostrando cómo CreatorOps puede expandirse hacia herramientas standalone para creadores.",
      },
    ],
  },

  ua: {
    statusLabel: "Live beta",
    creditLabels: {
      role: "Роль",
      stack: "Стек",
      status: "Статус",
    },
    linkLabels: {
      live: "Сайт",
      repo: "Репозиторій",
    },

    tagline: "Beta-ready content workflow system для creators.",

    statusNote:
      "Usable MVP prototype з end-to-end creator workflow, Smart Mix logic, ZIP export, Bio Builder, live deploy і active product development.",

    summary:
      "CreatorOps — це premium creator workflow prototype, який перетворює розрізнені visual assets у calm publishing pipeline. Продукт проводить користувача через Library, Smart Mix, Sequence, Planner, Captions, Export і Bio Builder, створюючи реальний downloadable content pack, а не статичний dashboard preview.",

    posterAlt: "Постер-обкладинка CreatorOps",
    videoAlt: "Walkthrough відео CreatorOps",
    heroCaption:
      "Beta-ready creator workflow prototype зі Smart Mix logic, export pipeline і extensible Tools layer.",

    problem:
      "У creators часто достатньо контенту, але недостатньо структури. Media, captions, publishing rhythm і profile positioning живуть у різних місцях, через що decision process стає хаотичним, повторюваним і складним для перетворення у clear publishing outcome.",

    approach:
      "CreatorOps був побудований як guided content pipeline, де кожен крок звужує поле рішень: Library, Smart Mix, Sequence, Planner, Captions, Export і Bio Builder. Продукт уникає dashboard clutter і фокусується на calm decision support, structured output і extensible Tools layer.",

    outcome:
      "У результаті вийшов live beta-ready prototype з functional end-to-end loop: користувач може select assets, generate Smart Mix candidates, organize sequence, prepare captions, export real ZIP publishing pack, а потім перейти в Bio Builder, сформувати Instagram-style profile і скачати profile brief.",

    clarity:
      "Проєкт перетворює content chaos у structured workflow: assets стають mix, mix стає plan, plan стає captions і export files, а final pack стає profile context.",

    motion:
      "Motion підтримує product calm замість visual noise: restrained transitions, card rhythm, workspace feedback і smooth route flow допомагають прототипу відчуватись premium, не закриваючи сам workflow.",

    build:
      "Побудовано на Vite, React, TypeScript, Tailwind CSS, React Router, Motion, JSZip, browser-side file handling, local/session state, Cloudflare Pages deployment і GitHub-based delivery.",

    notes:
      "Project framing\n- Beta-ready content workflow prototype для creators і small content teams.\n- Побудований як product system, а не landing-page-only concept.\n- Current status: usable MVP demo, live deploy, active product development.\n\nCore workflow\n- Library → Smart Mix → Sequence → Planner → Captions → Export → Bio Builder.\n- Core loop допомагає перейти від scattered visual assets до clean publishing pack.\n- Export створює real downloadable ZIP pack з images, captions, hashtags, CSV, manifest, README і structured text outputs.\n\nSmart Mix\n- Smart Mix працює як decision layer продукту.\n- Він генерує 3x3 candidate mixes, ranks options, avoids repetition, supports variety guardrails і пояснює, чому mix працює.\n- Це робить prototype більше ніж visual dashboard: у ньому є actual content decision logic.\n\nExport\n- Export — один із найсильніших proof points.\n- Workflow завершується real downloadable outcome замість static preview.\n- Це додає продукту practical value і демонструє product-engineering thinking.\n\nBio Builder\n- Bio Builder — перший Tools module всередині CreatorOps.\n- Він працює як standalone Instagram-style profile simulator і як extension of the Export flow.\n- Підтримує avatar upload, uploaded grid mode, connected export-pack mode, local generated variants, copy actions і .txt profile pack download.\n- Поточний generation layer local and deterministic, але data structure підготовлена для future OpenAI integration.\n\nTechnical architecture\n- SPA prototype з route-driven architecture.\n- Major steps живуть як separate routes.\n- Prototype shell керує navigation, tools і layout.\n- State переносить користувача крізь workflow.\n- Tools відділені від main flow, але можуть підключатися до Export.\n- Проєкт deployed on Cloudflare Pages і versioned through GitHub.\n\nCurrent limitations\n- Це ще не full production SaaS.\n- Немає backend, user accounts, cloud storage, real OpenAI API integration, Instagram Graph API publishing, scheduling, analytics, billing, production database або final accessibility pass.\n- Bio Builder — MVP layer з local/session logic, а не cloud persistence.\n\nWhy this case matters\n- CreatorOps демонструє product thinking, UX flow design, frontend architecture, state-driven interfaces, upload handling, Smart Mix logic, ZIP export, responsive QA, premium SaaS UI і live deployment.\n- Це один із найсильніших portfolio cases, бо він доводить здатність будувати real multi-step product system з practical output, а не просто attractive interface.\n\nProject links\n- Live site available.\n- Repository available.\n- Beta-ready MVP prototype; no commercial SaaS metrics claimed.",

    frames: [
      {
        alt: "CreatorOps - desktop hero frame",
        caption:
          "Product positioning surface, яка фреймить CreatorOps як calm operating system для creators і small content teams.",
      },
      {
        alt: "CreatorOps - desktop frame 01",
        caption:
          "Marketing landing surface, що показує product promise, creator outcome і premium SaaS direction.",
      },
      {
        alt: "CreatorOps - desktop frame 02",
        caption:
          "System logic section, яка пояснює calm guardrails за content planning і publishing decisions.",
      },
      {
        alt: "CreatorOps - desktop frame 03",
        caption:
          "Creator-facing product promise, перекладений у clear mobile-output і publishing-pack narrative.",
      },
      {
        alt: "CreatorOps - desktop frame 04",
        caption:
          "Premium landing chapter із dark product staging і restrained visual rhythm.",
      },
      {
        alt: "CreatorOps - desktop frame 05",
        caption:
          "Roadmap and monetization surface, що показує, як prototype може розширитись у більший creator workflow product.",
      },
      {
        alt: "CreatorOps - desktop frame 06",
        caption:
          "Library and Smart Mix workspace, де visual assets стають structured content candidates.",
      },
      {
        alt: "CreatorOps - desktop frame 07",
        caption:
          "Dark prototype interface із asset selection, state-driven layout і product-like workspace density.",
      },
      {
        alt: "CreatorOps - desktop frame 08",
        caption:
          "Light workspace variation, що демонструє product system у різних visual modes і review contexts.",
      },
      {
        alt: "CreatorOps - desktop frame 09",
        caption:
          "Smart Mix output surface, яка перетворює selected assets у ranked 3x3 content directions.",
      },
      {
        alt: "CreatorOps - desktop frame 10",
        caption:
          "Captions and planning workspace, що зʼєднує content selection з publishing rhythm і output structure.",
      },
      {
        alt: "CreatorOps - desktop frame 11",
        caption:
          "Export and tools-oriented state, який показує продовження workflow після visual selection.",
      },
      {
        alt: "CreatorOps - desktop frame 12",
        caption:
          "Bio Builder workspace із profile fields, content grid context, generated variants і live preview.",
      },
      {
        alt: "CreatorOps - desktop frame 13",
        caption:
          "Connected profile-building flow, який розширює content pack у Instagram-style bio and identity layer.",
      },
      {
        alt: "CreatorOps - mobile frame 01",
        caption:
          "Mobile content grid, що зберігає visual logic publishing pack.",
      },
      {
        alt: "CreatorOps - mobile frame 02",
        caption:
          "Mobile Smart Mix step із фокусом на selected assets, generated candidates і continuation flow.",
      },
      {
        alt: "CreatorOps - mobile frame 03",
        caption:
          "Mobile sequence state, який показує, як selected mix стає ordered publishing direction.",
      },
      {
        alt: "CreatorOps - mobile frame 04",
        caption:
          "Mobile planner state, який повʼязує pack selection, rhythm і next-step product flow.",
      },
      {
        alt: "CreatorOps - mobile frame 05",
        caption:
          "Mobile export state з downloadable pack logic і practical output framing.",
      },
      {
        alt: "CreatorOps - mobile frame 06",
        caption:
          "Mobile Bio Builder form для shaping handle, audience, offer, CTA і profile direction.",
      },
      {
        alt: "CreatorOps - mobile frame 07",
        caption:
          "Instagram-style profile preview, який адаптує content pack у creator-facing public identity.",
      },
      {
        alt: "CreatorOps - mobile frame 08",
        caption:
          "Mobile profile and pack handoff, що показує потенціал CreatorOps як standalone creator tools system.",
      },
    ],
  },

  ru: {
    statusLabel: "Live beta",
    creditLabels: {
      role: "Роль",
      stack: "Стек",
      status: "Статус",
    },
    linkLabels: {
      live: "Сайт",
      repo: "Репозиторий",
    },

    tagline: "Beta-ready content workflow system для creators.",

    statusNote:
      "Usable MVP prototype с end-to-end creator workflow, Smart Mix logic, ZIP export, Bio Builder, live deploy и active product development.",

    summary:
      "CreatorOps — это premium creator workflow prototype, который превращает разрозненные visual assets в calm publishing pipeline. Продукт проводит пользователя через Library, Smart Mix, Sequence, Planner, Captions, Export и Bio Builder, создавая реальный downloadable content pack, а не статичный dashboard preview.",

    posterAlt: "Постер-обложка CreatorOps",
    videoAlt: "Walkthrough видео CreatorOps",
    heroCaption:
      "Beta-ready creator workflow prototype со Smart Mix logic, export pipeline и extensible Tools layer.",

    problem:
      "У creators часто достаточно контента, но не хватает структуры. Media, captions, publishing rhythm и profile positioning находятся в разных местах, из-за чего decision process становится хаотичным, повторяющимся и сложным для превращения в clear publishing outcome.",

    approach:
      "CreatorOps был построен как guided content pipeline, где каждый шаг сужает поле решений: Library, Smart Mix, Sequence, Planner, Captions, Export и Bio Builder. Продукт избегает dashboard clutter и фокусируется на calm decision support, structured output и extensible Tools layer.",

    outcome:
      "В результате получился live beta-ready prototype с functional end-to-end loop: пользователь может select assets, generate Smart Mix candidates, organize sequence, prepare captions, export real ZIP publishing pack, а затем перейти в Bio Builder, сформировать Instagram-style profile и скачать profile brief.",

    clarity:
      "Проект превращает content chaos в structured workflow: assets становятся mix, mix становится plan, plan становится captions и export files, а final pack становится profile context.",

    motion:
      "Motion поддерживает product calm вместо visual noise: restrained transitions, card rhythm, workspace feedback и smooth route flow помогают прототипу ощущаться premium, не закрывая сам workflow.",

    build:
      "Построено на Vite, React, TypeScript, Tailwind CSS, React Router, Motion, JSZip, browser-side file handling, local/session state, Cloudflare Pages deployment и GitHub-based delivery.",

    notes:
      "Project framing\n- Beta-ready content workflow prototype для creators и small content teams.\n- Построен как product system, а не landing-page-only concept.\n- Current status: usable MVP demo, live deploy, active product development.\n\nCore workflow\n- Library → Smart Mix → Sequence → Planner → Captions → Export → Bio Builder.\n- Core loop помогает перейти от scattered visual assets к clean publishing pack.\n- Export создаёт real downloadable ZIP pack с images, captions, hashtags, CSV, manifest, README и structured text outputs.\n\nSmart Mix\n- Smart Mix работает как decision layer продукта.\n- Он генерирует 3x3 candidate mixes, ranks options, avoids repetition, supports variety guardrails и объясняет, почему mix работает.\n- Это делает prototype больше чем visual dashboard: в нём есть actual content decision logic.\n\nExport\n- Export — один из самых сильных proof points.\n- Workflow завершается real downloadable outcome вместо static preview.\n- Это добавляет продукту practical value и демонстрирует product-engineering thinking.\n\nBio Builder\n- Bio Builder — первый Tools module внутри CreatorOps.\n- Он работает как standalone Instagram-style profile simulator и как extension of the Export flow.\n- Поддерживает avatar upload, uploaded grid mode, connected export-pack mode, local generated variants, copy actions и .txt profile pack download.\n- Текущий generation layer local and deterministic, но data structure подготовлена для future OpenAI integration.\n\nTechnical architecture\n- SPA prototype с route-driven architecture.\n- Major steps живут как separate routes.\n- Prototype shell управляет navigation, tools и layout.\n- State переносит пользователя через workflow.\n- Tools отделены от main flow, но могут подключаться к Export.\n- Проект deployed on Cloudflare Pages и versioned through GitHub.\n\nCurrent limitations\n- Это ещё не full production SaaS.\n- Нет backend, user accounts, cloud storage, real OpenAI API integration, Instagram Graph API publishing, scheduling, analytics, billing, production database или final accessibility pass.\n- Bio Builder — MVP layer с local/session logic, а не cloud persistence.\n\nWhy this case matters\n- CreatorOps демонстрирует product thinking, UX flow design, frontend architecture, state-driven interfaces, upload handling, Smart Mix logic, ZIP export, responsive QA, premium SaaS UI и live deployment.\n- Это один из самых сильных portfolio cases, потому что он доказывает способность строить real multi-step product system с practical output, а не просто attractive interface.\n\nProject links\n- Live site available.\n- Repository available.\n- Beta-ready MVP prototype; no commercial SaaS metrics claimed.",

    frames: [
      {
        alt: "CreatorOps - desktop hero frame",
        caption:
          "Product positioning surface, которая фреймит CreatorOps как calm operating system для creators и small content teams.",
      },
      {
        alt: "CreatorOps - desktop frame 01",
        caption:
          "Marketing landing surface, показывающая product promise, creator outcome и premium SaaS direction.",
      },
      {
        alt: "CreatorOps - desktop frame 02",
        caption:
          "System logic section, объясняющая calm guardrails за content planning и publishing decisions.",
      },
      {
        alt: "CreatorOps - desktop frame 03",
        caption:
          "Creator-facing product promise, переведенный в clear mobile-output и publishing-pack narrative.",
      },
      {
        alt: "CreatorOps - desktop frame 04",
        caption:
          "Premium landing chapter с dark product staging и restrained visual rhythm.",
      },
      {
        alt: "CreatorOps - desktop frame 05",
        caption:
          "Roadmap and monetization surface, показывающая, как prototype может расшириться в более крупный creator workflow product.",
      },
      {
        alt: "CreatorOps - desktop frame 06",
        caption:
          "Library and Smart Mix workspace, где visual assets становятся structured content candidates.",
      },
      {
        alt: "CreatorOps - desktop frame 07",
        caption:
          "Dark prototype interface с asset selection, state-driven layout и product-like workspace density.",
      },
      {
        alt: "CreatorOps - desktop frame 08",
        caption:
          "Light workspace variation, демонстрирующая product system в разных visual modes и review contexts.",
      },
      {
        alt: "CreatorOps - desktop frame 09",
        caption:
          "Smart Mix output surface, которая превращает selected assets в ranked 3x3 content directions.",
      },
      {
        alt: "CreatorOps - desktop frame 10",
        caption:
          "Captions and planning workspace, соединяющий content selection с publishing rhythm и output structure.",
      },
      {
        alt: "CreatorOps - desktop frame 11",
        caption:
          "Export and tools-oriented state, показывающий продолжение workflow после visual selection.",
      },
      {
        alt: "CreatorOps - desktop frame 12",
        caption:
          "Bio Builder workspace с profile fields, content grid context, generated variants и live preview.",
      },
      {
        alt: "CreatorOps - desktop frame 13",
        caption:
          "Connected profile-building flow, расширяющий content pack в Instagram-style bio and identity layer.",
      },
      {
        alt: "CreatorOps - mobile frame 01",
        caption:
          "Mobile content grid, сохраняющий visual logic publishing pack.",
      },
      {
        alt: "CreatorOps - mobile frame 02",
        caption:
          "Mobile Smart Mix step с фокусом на selected assets, generated candidates и continuation flow.",
      },
      {
        alt: "CreatorOps - mobile frame 03",
        caption:
          "Mobile sequence state, показывающий, как selected mix становится ordered publishing direction.",
      },
      {
        alt: "CreatorOps - mobile frame 04",
        caption:
          "Mobile planner state, связывающий pack selection, rhythm и next-step product flow.",
      },
      {
        alt: "CreatorOps - mobile frame 05",
        caption:
          "Mobile export state с downloadable pack logic и practical output framing.",
      },
      {
        alt: "CreatorOps - mobile frame 06",
        caption:
          "Mobile Bio Builder form для shaping handle, audience, offer, CTA и profile direction.",
      },
      {
        alt: "CreatorOps - mobile frame 07",
        caption:
          "Instagram-style profile preview, адаптирующий content pack в creator-facing public identity.",
      },
      {
        alt: "CreatorOps - mobile frame 08",
        caption:
          "Mobile profile and pack handoff, показывающий потенциал CreatorOps как standalone creator tools system.",
      },
    ],
  },
} as const;
