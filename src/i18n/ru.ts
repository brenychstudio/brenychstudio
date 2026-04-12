import type { TranslationDictionary } from "./en";

export const ru: TranslationDictionary = {
  nav: {
    work: "Работы",
    immersive: "Иммерсив",
    offer: "Услуги",
    about: "Обо мне",
    start: "Начать проект",
    startShort: "Начать",
  },
  home: {
    hero: {
      label: "Практика",
      titleMain:
        "Премиальные front-end системы для бренда, продукта и экспериментального веба.",
      titleSub:
        "Иммерсивное направление и продакшен-уровень реализации.",
    },
    immersive: {
      label: "Иммерсивное направление",
      cta: "Смотреть immersive",
    },
    work: {
      label: "Избранные работы",
      archive: "Открыть архив",
      view: "Смотреть кейс",
    },
    skills: {
      title: "Навыки",
      description:
        "Премиальные веб-опыты: редакционный дизайн, контролируемое движение и точная реализация.",
      items: [
        {
          title: "Editorial UI",
          text: "Типографика, композиция и премиальные layout-системы.",
        },
        {
          title: "Motion",
          text: "Скролл-поведение, ритм взаимодействия, кинематографичные переходы.",
        },
        {
          title: "Front-end",
          text: "React, TypeScript, Astro, Next.js и продакшен-архитектура.",
        },
        {
          title: "Системы",
          text: "Мультиязычность, reusable-подходы, структура контента.",
        },
        {
          title: "Продукты",
          text: "Инструменты, конверсия, QA и готовность к запуску.",
        },
      ],
    },
    services: {
      title: "Услуги",
      description:
        "Три чётких пакета для премиального результата.",
      items: [
        {
          title: "Signature Website",
          text: "Премиальный сайт бренда с продуманным ритмом и motion.",
        },
        {
          title: "Case Study",
          text: "Страница кейса с историей, структурой и доверием.",
        },
        {
          title: "Interactive",
          text: "Интерактивный концепт с глубокой системной логикой.",
        },
      ],
    },
    about: {
      title: "Креативный разработчик с системным подходом.",
      text:
        "Создаю премиальные front-end системы для брендов и продуктов.",
    },
    contact: {
      label: "Контакт",
      title: "Начать проект.",
      text: "Отправьте бриф — предложу лучший подход.",
      email: "Email",
      copy: "Скопировать",
    },
  },
  work: {
    hero: {
      label: "ПРОЕКТЫ",
      title: "Избранные работы и кейсы.",
      description:
        "Подборка проектов в области бренда, продукта и экспериментального веба.",
    },
    selected: {
      label: "Избранные работы",
      openArchive: "Открыть архив",
    },
    archive: {
      label: "АРХИВ",
      cta: "Смотреть все проекты",
      backToSelected: "Назад к избранному",
      backToHome: "Назад на главную",
      closeLabel: "ВЫХОД ИЗ АРХИВА",
      closeDescription:
        "Вернуться к избранному обзору или перейти к полному кейсу.",
      categories: {
        all: "Все",
        softwareProduct: "Софт / Продукт",
        creatorsCulture: "Креаторы / Культура",
        advisoryProperty: "Консалтинг / Недвижимость",
        brands: "Бренды",
        hospitality: "Гостеприимство",
      },
    },
    case: {
      view: "Смотреть кейс",
      countSingular: "кейс",
      countPlural: "кейсов",
      role: "Роль",
      stack: "Стек",
      status: "Статус",
      completeness: {
        full: "Полный кейс",
        inProgress: "В процессе",
        preview: "Превью",
      },
    },
    controls: {
      cards: "Карточки",
      list: "Список",
      sort: "Сортировка",
      newest: "Новые",
      oldest: "Старые",
    },
  },
  about: {
    hero: {
      label: "Обо мне",
      title: "Премиальная front-end практика, где авторство, структура и реализация работают как единая система.",
      description:
        "Это не generic front-end production. Работа объединяет авторскую визуальную режиссуру, строгий структурный подход и production-minded реализацию, чтобы премиальная подача оставалась цельной от концепта до запуска.",
      meta: [
        "Сооснователь, Concept2048 с 2021",
        "Режиссёрский подход вырос из image, video и rhythm",
        "Реализация с production discipline",
      ],
    },
    roots: {
      label: "Авторская основа",
      title: "Эта практика выросла из авторства ещё до интерфейсов.",
      description:
        "Визуальная режиссура, image-making, pacing и production discipline сформировали базовый слой. Именно поэтому структура и реализация здесь воспринимаются как творческие решения, а не только как техническое исполнение.",
    },
    pillars: {
      visualDirection: {
        label: "Визуальная режиссура",
        text: "Композиция и тон, которые формируют восприятие продукта ещё до начала взаимодействия.",
      },
      imageRhythm: {
        label: "Изображение и ритм",
        text: "Логика photo, video и sound-aware pacing, переведённая в web narrative и motion behavior.",
      },
      productionDiscipline: {
        label: "Production discipline",
        text: "Ясность delivery, спокойная итерация и launch-aware execution, которые сохраняют авторское качество.",
      },
    },
    practiceLines: {
      label: "Линии практики",
      line1: {
        label: "Линия 01",
        title: "Коммерческие системы для премиального web delivery.",
        description:
          "Сайты для бренда и продукта, построенные как ясные системы: структурированные, editable и надёжные, без потери premium surface quality.",
        tags: ["Премиальные сайты", "Системная архитектура", "Надёжность production"],
      },
      line2: {
        label: "Линия 02",
        title: "Иммерсивная режиссура для WebXR и cinematic interfaces.",
        description:
          "Пространственные и нарративные расширения того же авторского подхода — от AR framing до interaction-led immersive concepts.",
        tags: ["WebXR", "AR режиссура", "Кинематографические интерфейсы"],
      },
    },
    method: {
      label: "Метод работы",
      title: "Концепт.\nСтруктура.\nРеализация.",
      items: [
        {
          index: "01",
          title: "Концепт",
          text: "Сначала определяется narrative intent, positioning и visual tone, а уже потом принимаются layout и implementation decisions.",
        },
        {
          index: "02",
          title: "Структура",
          text: "Концепт переводится в архитектуру: масштабируемые секции, reusable components и ясную content system.",
        },
        {
          index: "03",
          title: "Реализация",
          text: "Запуск с production discipline, стабильным collaboration flow и release-aware execution.",
        },
      ],
    },
    inventory: {
      label: "Инвентарь практики",
      title: "Delivery surfaces, сгруппированные по намерению.",
      description:
        "Компактная capability-рамка, сфокусированная на том, что реально ship-ится, а не на длинном техническом списке.",
      coreSurfacesLabel: "Core surfaces",
      coreSurfaces: [
        "Премиальные сайты",
        "Case-driven systems",
        "Мультиязычная архитектура",
        "Editable content layers",
      ],
      extendedPracticeLabel: "Extended practice",
      extendedPractice: [
        "Interaction systems",
        "Motion-led behavior",
        "Selected immersive direction",
      ],
    },
    cta: {
      label: "Следующий шаг",
      title: "Если брифу нужны авторское качество и надёжная реализация — давай обсудим.",
      description:
        "Можно сразу начать проект или посмотреть selected work, чтобы увидеть эту практику в shipped form.",
      primary: "Начать проект",
      secondary: "Смотреть работы",
    },
  },
  immersive: {
    hero: {
      label: "ИММЕРСИВ",
      title: "Интерактивные визуальные системы и экспериментальные веб-опыты.",
      description:
        "Отобранные проекты, исследующие движение, атмосферу и авторское взаимодействие за пределами классического веба.",
    },
    intro: {
      practiceLineLabel: "Линия практики",
      practiceLineText:
        "Immersive рассматривается как отдельное режиссёрское направление, а не как вариация обычного архива работ.",
      focusLabel: "Фокус",
      focusTags: ["WebXR", "AR", "Кинематографичный веб", "Пространственные интерфейсы"],
    },
    featured: {
      directionBadge: "Флагманское направление",
    },
    secondary: {
      label: "Дополнительные исследования",
    },
    closing: {
      practiceFramingLabel: "Рамка практики",
      title: "Immersive остаётся отдельной линией практики, а не стилевой надстройкой.",
      description:
        "Фокус здесь на авторском темпе, логике пространственного взаимодействия и production-aware реализации, где нарративная ясность так же важна, как визуальная атмосфера.",
      nextStepLabel: "Следующий шаг",
      nextStepDescription:
        "Если брифу нужно immersive-направление, поделитесь контекстом, и мы определим самый чистый путь реализации.",
      primary: "Начать проект",
      secondary: "Смотреть избранные работы",
    },
    cases: {
      atlasArc: {
        title: "Atlas Arc",
        tagline: "Кинематографичный WebXR-нарратив для property с направляемыми пространственными переходами.",
        medium: "WebXR / пространственный веб-нарратив",
        mode: "Концептуальный showcase",
        stack: "React, Three.js, WebXR, motion-системы",
        description:
          "Направляемое immersive-путешествие, где editorial storytelling и пространственная глубина работают как единая авторская sales-поверхность.",
        supportLabel: "Флагманская сцена",
        ctaLabel: "Смотреть immersive-направление",
        status: "Флагманский концепт",
      },
      signalRoomAr: {
        title: "Signal Room AR",
        tagline: "AR-фрейминг продукта с кинематографичным темпом и атмосферным движением.",
        medium: "AR / кинематографичный продуктовый сторителлинг",
        mode: "Интерактивный proof-модуль",
        stack: "React, TypeScript, shader-слои, хореография камеры",
        description:
          "Создано для premium-запусков продукта, где атмосфера, контекст и reveal через взаимодействие формируют воспринимаемую ценность.",
        supportLabel: "Поддерживающее исследование",
        ctaLabel: "Открыть immersive-слой",
        status: "Direction build",
      },
      nocturneInterface: {
        title: "Nocturne Interface",
        tagline: "Пространственные интерфейсные исследования будущего для premium interactive briefs.",
        medium: "Интерфейсы будущего / пространственные концепты",
        mode: "Прототипная последовательность",
        stack: "React, Vite, interaction-системы, production QA",
        description:
          "Модульное immersive-исследование интерфейса, сфокусированное на ясной навигационной грамматике, кинематографичном ритме и готовности к запуску.",
        supportLabel: "Поддерживающее исследование",
        ctaLabel: "Открыть immersive-страницу",
        status: "Готовый к продакшену прототип",
      },
      echoDriftXr: {
        title: "Echo Drift XR",
        tagline: "Направляемые XR-сцены, построенные вокруг темпа, взгляда и атмосферных подсказок.",
        medium: "XR / исследование логики сцены",
        mode: "Direction build",
        stack: "React, R3F, shader-passes, pacing-системы",
        description:
          "Концептуальное исследование для premium immersive briefs, где motion-грамматика, переходы и пространственный стейджинг должны ощущаться авторскими, а не шаблонными.",
        supportLabel: "Поддерживающее исследование",
        ctaLabel: "Открыть immersive-кейс",
        status: "Direction build",
      },
      thresholdMemory: {
        title: "Threshold Memory",
        tagline: "Эксперименты с пространственным интерфейсом, более тёмной атмосферой и контролируемым reveal.",
        medium: "Immersive-нарратив / многослойный интерфейс",
        mode: "Готовый к продакшену прототип",
        stack: "React, TypeScript, motion-слои, визуальные системы",
        description:
          "Premium-исследование логики переходов, многослойных медиаповерхностей и immersive-фрейминга интерфейса для storytelling-работ, ориентированных в будущее.",
        supportLabel: "Поддерживающее исследование",
        ctaLabel: "Открыть immersive-кейс",
        status: "Готовый к продакшену прототип",
      },
    },
  },
  offer: {
    hero: {
      label: "Услуги",
      title: "Премиальные front-end системы для бренда, продукта и экспериментального веба.",
      description:
        "Достаточная глубина для запуска, а не только для концепции. Сайты, интерактивные case presentations, editable systems и production-ready delivery.",
    },
    materials: {
      label: "Отобранные материалы",
      pricePack: "PRICE PACK PDF",
      management: "WEBSITE MANAGEMENT PDF",
    },
    spectrum: {
      label: "Спектр практики",
      cards: [
        {
          index: "01",
          label: "Бренд / Коммерция",
          title: "Бренд / Коммерция",
          description:
            "Мультиязычные коммерческие сайты и премиальные service-facing systems, где структура, framing и cleaner decision-making важны не меньше визуального финиша.",
        },
        {
          index: "02",
          label: "Концепт / Интерактив",
          title: "Концепт / Интерактив",
          description:
            "Интерактивные presentation systems и premium digital surfaces, которые выходят за пределы brochure logic и превращаются в directed experience.",
        },
        {
          index: "03",
          label: "Редактируемое / Операционное",
          title: "Редактируемое / Операционное",
          description:
            "Schema-driven content models, editable site architecture, admin-ready systems, internal tools и launch-minded implementation.",
        },
      ],
    },
    selectedDirection: {
      label: "Выбранное направление",
      brandCommercial: {
        title: "Бренд / Коммерция",
        description:
          "Мультиязычные коммерческие сайты и премиальные service-facing systems, где структура, framing и cleaner decision-making важны не меньше, чем визуальный финиш.",
        provenInLabel: "Проверено в",
        provenIn: ["Tersat", "Atlas", "Barcelona Private Advisory"],
        summary:
          "Логика delivery остаётся стабильной: minimal-diff development, staged polish, production-aware build discipline и финальный human review перед сдачей.",
        focusLabel: "Фокус",
        focus: ["Trust-first framing", "Мультиязычная структура", "Премиальный service UX"],
        stackLabel: "Stack",
        stack: ["Astro", "TypeScript", "Tailwind", "Scalable content systems"],
      },
      conceptInteractive: {
        title: "Концепт / Интерактив",
        description:
          "Интерактивные presentation systems и premium digital surfaces, где motion, reveal и interface rhythm работают как часть авторского замысла.",
        provenInLabel: "Проверено в",
        provenIn: ["Whisper", "Signal Room AR", "Nocturne Interface"],
        summary:
          "Концепт подаётся не как эффект ради эффекта, а как контролируемый интерфейсный слой с продуманной иерархией и production-aware поведением.",
        focusLabel: "Фокус",
        focus: ["Narrative pacing", "Motion hierarchy", "Interactive depth"],
        stackLabel: "Stack",
        stack: ["React", "TypeScript", "Motion", "Interaction systems"],
      },
      editableOperational: {
        title: "Редактируемое / Операционное",
        description:
          "Schema-driven content models, editable site architecture, admin-ready systems, internal tools и launch-minded delivery, где сайт должен работать как operating surface, а не только как презентация.",
        provenInLabel: "Проверено в",
        provenIn: ["CreatorOps", "StudioOps", "Editable delivery systems"],
        summary:
          "Delivery logic stays consistent: minimal-diff development, staged polish, production-aware build discipline и финальный human review перед сдачей.",
        focusLabel: "Фокус",
        focus: ["CMS logic", "Workflow tooling", "Launch readiness"],
        stackLabel: "Stack",
        stack: ["React", "Vite", "TypeScript", "Structured content pipelines"],
      },
    },
    engagementModel: {
      label: "Модель сотрудничества",
      plans: [
        { key: "base", name: "BASE", subtitle: "Базовый вход", price: "€1,290" },
        { key: "pro", name: "PRO", subtitle: "Основной коммерческий пакет", price: "€2,490" },
        { key: "studio", name: "STUDIO", subtitle: "Более широкая системная реализация", price: "€4,490" },
        { key: "signature", name: "SIGNATURE", subtitle: "Индивидуальная концепт-реализация", price: "€6,900" },
      ],
      active: {
        name: "PRO",
        subtitle: "Основной коммерческий пакет",
        price: "€2,490",
        description:
          "Серьёзные коммерческие сайты с premium presentation needs.",
        tags: ["Более сильная homepage и IA", "Consult / inquiry flow", "Премиальная визуальная система"],
        bestForLabel: "Лучше всего для",
        bestFor:
          "Серьёзных коммерческих сайтов с premium presentation needs.",
        fitLabel: "Fit",
        fit:
          "Лучшее решение для большинства premium service, advisory и brand-facing сайтов.",
        cta: "ОТКРЫТЬ ПОЛНЫЙ PRICING PDF",
      },
    },
    websiteManagement: {
      label: "Управление сайтом",
      tabs: {
        managed: "Сайт на сопровождении",
        editable: "Редактируемый сайт",
        custom: "Custom CMS / Admin",
      },
      managed: {
        title: "Сайт на сопровождении",
        subtitle: "Studio-managed",
        price: "from €1,200",
        description:
          "Studio-managed updates, без client editing panel, более чистый workflow, ниже overhead и лучше quality control после запуска.",
        tags: ["Обновления через студию", "Без client editing panel", "Ниже операционный overhead"],
        bestForLabel: "Лучше всего для",
        bestFor:
          "Клиентов, которым нужны обновления под сопровождением, с минимальным friction и стабильным качеством подачи.",
        modelLabel: "Операционная модель",
        model:
          "Контентные изменения проходят через студию. Подходит, когда сайт меняется нечасто, а контроль важнее автономии.",
        note:
          "Базовый путь: начать с managed, при необходимости добавить lightweight editor, а custom CMS рассматривать только когда проекту действительно нужен более глубокий операционный контроль.",
        cta: "ОТКРЫТЬ MANAGEMENT PDF",
      },
      editable: {
        title: "Редактируемый сайт",
        subtitle: "Selective editing",
        price: "from €1,500",
        description:
          "Лёгкий editor для selected fields: тексты, изображения, контакты, базового SEO, FAQ, services, testimonials и простых entries.",
        tags: ["Selected editable fields", "Protected core structure", "Lighter client-side autonomy"],
        bestForLabel: "Лучше всего для",
        bestFor:
          "Команд, которым нужна ограниченная свобода редактирования без сложности полноценной admin system.",
        modelLabel: "Операционная модель",
        model:
          "Редактируемыми становятся только selected surfaces, тогда как структура, layout logic и higher-risk layers остаются защищёнными.",
        note:
          "Базовый путь: начать с managed, при необходимости добавить lightweight editor, а custom CMS рассматривать только когда проекту действительно нужен более глубокий операционный контроль.",
        cta: "ОТКРЫТЬ MANAGEMENT PDF",
      },
      custom: {
        title: "Custom CMS / Admin",
        subtitle: "Deeper operational control",
        price: "from €3,200",
        description:
          "Custom CMS / admin layer для проектов, где нужен более широкий operational control, более сложные content flows или внутренняя editorial autonomy.",
        tags: ["Более глубокий операционный контроль", "Custom content model", "Более широкая editorial autonomy"],
        bestForLabel: "Лучше всего для",
        bestFor:
          "Команд, где сайт работает как более длинная operational surface и требует более независимого внутреннего управления.",
        modelLabel: "Операционная модель",
        model:
          "CMS проектируется под конкретный content model и workflow, а не добавляется как generic panel по умолчанию.",
        note:
          "Custom CMS имеет смысл только тогда, когда более простой managed или selective editing layer уже не покрывает реальные операционные потребности.",
        cta: "ОТКРЫТЬ MANAGEMENT PDF",
      },
    },
    finalCta: {
      label: "Материалы / Контакт",
      text:
        "Нужны сначала полные материалы, или уже готовы обсуждать проект? Воспользуйся файлами или открой inquiry drawer напрямую.",
      profile: "Профиль",
      primary: "Начать проект",
    },
  },


  drawer: {
    title: "Начать проект",
    description:
      "Премиальные сайты, интерактивные презентационные поверхности и более широкие системные сборки. Выберите направление пакета — и мы вместе уточним объём.",
    close: "Закрыть",
    packagesLabel: "Пакеты",
    packages: [
      {
        name: "Base",
        price: "От €1,290",
        features: [
          "Лёгкий premium-сайт brochure-типа",
          "Чистая главная + ключевые страницы",
          "Структура, готовая для mobile",
          "Быстрая и понятная стартовая точка",
        ],
      },
      {
        name: "Pro",
        price: "От €2,490",
        features: [
          "Более сильная главная + более продуманная IA",
          "Consult / inquiry flow",
          "Премиальная визуальная подача",
          "Лучше всего подходит для большинства premium service-сайтов",
        ],
      },
      {
        name: "Studio",
        price: "От €4,490",
        features: [
          "Более широкая системная разработка",
          "Мультиязычная структура",
          "Более сильный SEO + более глубокий контент",
          "Выборочный motion и polish",
        ],
      },
      {
        name: "Signature",
        price: "От €6,900",
        features: [
          "Bespoke premium build на основе концепта",
          "Работа, чувствительная к подаче и art direction",
          "Интерактивные premium-поверхности",
          "Авторский motion и интерфейсная ценность",
        ],
      },
    ],
    faqLabel: "FAQ",
    faq: [
      {
        question: "Что входит в стоимость?",
        answer:
          "Выбранный пакет покрывает согласованный объём сайта, дизайн/системную реализацию и передачу готового build. Хостинг, домен, платные сторонние сервисы и более глубокие кастомные интеграции при необходимости оцениваются отдельно.",
      },
      {
        question: "Сколько это занимает времени?",
        answer:
          "Большинство проектов укладываются в диапазон 2–5 недель в зависимости от уровня пакета, готовности контента и скорости обратной связи. Более широкие системные сборки или signature-работы могут занять больше времени.",
      },
      {
        question: "Можно ли начать с малого и расширить позже?",
        answer:
          "Да. Часто это лучший путь. Мы можем запустить чёткую первую версию, а затем расширить её новыми страницами, более сильным motion, мультиязычной структурой или более глубокими системными слоями.",
      },
    ],
    faqTip: "Подсказка: нажмите ESC, чтобы закрыть.",
    inquiry: {
      label: "Запрос",
      responseTime: "Ответ в течение 24–48 ч",
      fields: {
        name: "Имя",
        email: "Email",
        projectType: "Тип проекта",
        budget: "Бюджет",
        timeline: "Срок",
        links: "Ссылки",
        message: "Сообщение",
      },
      placeholders: {
        name: "Ваше имя",
        email: "you@domain.com",
        links: "Сайт / Figma / референсы",
        message:
          "Коротко расскажите, что вы создаёте, какой пакет ближе всего и какой результат вам нужен.",
      },
      options: {
        projectType: [
          { value: "premiumWebsite", label: "Премиальный сайт" },
          { value: "interactivePresentation", label: "Интерактивная презентация" },
          { value: "broaderSystemBuild", label: "Более широкая системная разработка" },
          { value: "signatureBespoke", label: "Signature / bespoke" },
          { value: "other", label: "Другое" },
        ],
        budget: [
          { value: "1-2k", label: "€1–2k" },
          { value: "2-5k", label: "€2–5k" },
          { value: "5-8k", label: "€5–8k" },
          { value: "8k-plus", label: "€8k+" },
        ],
        timeline: [
          { value: "asap", label: "ASAP" },
          { value: "2-4-weeks", label: "2–4 недели" },
          { value: "1-2-months", label: "1–2 месяца" },
          { value: "flexible", label: "Гибко" },
        ],
      },
    },
    directEmail: {
      label: "Прямой email",
      hint: "Лучше всего для брифов и референсов.",
      send: "Отправить запрос",
      preparing: "Подготовка…",
      copy: "Скопировать email",
      copied: "Скопировано",
      open: "Открыть в почте",
      draftReady: "Черновик подготовлен. Если почтовое приложение не открылось, используйте «Открыть в почте».",
      responseNote: "Ответ: 24–48 ч. Если срочно — добавьте «URGENT» в тему письма.",
    },
    mail: {
      subjectBase: "Запрос по проекту",
      labels: {
        name: "Имя",
        email: "Email",
        projectType: "Тип проекта",
        budget: "Бюджет",
        timeline: "Срок",
        links: "Ссылки",
        message: "Сообщение",
      },
      sentFrom: "Отправлено из формы запроса на сайте",
      empty: "-",
    },
  },
};
