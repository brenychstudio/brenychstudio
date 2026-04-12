import type { TranslationDictionary } from "./en";

export const ua: TranslationDictionary = {
  nav: {
    work: "Роботи",
    immersive: "Імерсив",
    offer: "Пропозиція",
    about: "Про мене",
    start: "Почати проєкт",
    startShort: "Почати",
  },
  home: {
    hero: {
      label: "Практика",
      titleMain:
        "Преміальні front-end системи для бренду, продукту та експериментального вебу.",
      titleSub:
        "Імерсивний напрям і продакшн-рівень реалізації.",
    },
    immersive: {
      label: "Імерсивний напрям",
      cta: "Переглянути immersive",
    },
    work: {
      label: "Вибрані роботи",
      archive: "Відкрити архів",
      view: "Дивитись кейс",
    },
    skills: {
      title: "Навички",
      description:
        "Преміальні веб-досвіди: редакційний дизайн, контрольований рух і точна реалізація.",
      items: [
        {
          title: "Editorial UI",
          text: "Типографіка, композиція та преміальні layout-системи.",
        },
        {
          title: "Motion",
          text: "Скрол-поведінка, ритм взаємодії, кінематографічні переходи.",
        },
        {
          title: "Front-end",
          text: "React, TypeScript, Astro, Next.js та продакшн-архітектура.",
        },
        {
          title: "Системи",
          text: "Мультимовність, reusable підходи, структура контенту.",
        },
        {
          title: "Продукти",
          text: "Інструменти, конверсія, QA і готовність до запуску.",
        },
      ],
    },
    services: {
      title: "Послуги",
      description:
        "Три чіткі пакети для преміального результату.",
      items: [
        {
          title: "Signature Website",
          text: "Преміальний сайт бренду з продуманим ритмом і motion.",
        },
        {
          title: "Case Study",
          text: "Сторінка кейсу з історією, структурою і довірою.",
        },
        {
          title: "Interactive",
          text: "Інтерактивний концепт із глибокою системною логікою.",
        },
      ],
    },
    about: {
      title: "Креативний розробник із системним підходом.",
      text:
        "Створюю преміальні front-end системи для брендів і продуктів.",
    },
    contact: {
      label: "Контакт",
      title: "Почати проєкт.",
      text: "Надішліть бриф — запропоную найкращий підхід.",
      email: "Email",
      copy: "Скопіювати",
    },
  },
  work: {
    hero: {
      label: "ПРОЄКТИ",
      title: "Відібрані роботи та кейс-стаді.",
      description:
        "Добірка проєктів у сфері бренду, продукту та експериментального вебу.",
    },
    selected: {
      label: "Відібрані роботи",
      openArchive: "Відкрити архів",
    },
    archive: {
      label: "АРХІВ",
      cta: "Переглянути всі роботи",
      backToSelected: "Назад до вибраного",
      backToHome: "Назад на головну",
      closeLabel: "ВИХІД З АРХІВУ",
      closeDescription:
        "Повернутися до вибраного огляду або перейти до повного кейсу.",
      categories: {
        all: "Усі",
        softwareProduct: "Софт / Продукт",
        creatorsCulture: "Креатори / Культура",
        advisoryProperty: "Консалтинг / Нерухомість",
        brands: "Бренди",
        hospitality: "Гостинність",
      },
    },
    case: {
      view: "Дивитись кейс",
      countSingular: "кейс",
      countPlural: "кейсів",
      role: "Роль",
      stack: "Стек",
      status: "Статус",
      completeness: {
        full: "Повний кейс",
        inProgress: "У процесі",
        preview: "Прев’ю",
      },
    },
    controls: {
      cards: "Картки",
      list: "Список",
      sort: "Сортування",
      newest: "Новіші",
      oldest: "Старіші",
    },
  },
  about: {
    hero: {
      label: "Про мене",
      title: "Преміальна front-end практика, де авторство, структура та реалізація працюють як єдина система.",
      description:
        "Це не generic front-end production. Робота поєднує авторську візуальну режисуру, строгий структурний підхід і production-minded реалізацію, щоб преміальна подача залишалась цілісною від концепту до запуску.",
      meta: [
        "Співзасновник, Concept2048 з 2021",
        "Режисерський підхід виріс із image, video та rhythm",
        "Реалізація з production discipline",
      ],
    },
    roots: {
      label: "Авторська база",
      title: "Ця практика виросла з авторства ще до інтерфейсів.",
      description:
        "Візуальна режисура, image-making, pacing і production discipline сформували базовий шар. Саме тому структура й реалізація тут сприймаються як творчі рішення, а не лише технічне виконання.",
    },
    pillars: {
      visualDirection: {
        label: "Візуальна режисура",
        text: "Композиція і тон, які формують сприйняття продукту ще до початку взаємодії.",
      },
      imageRhythm: {
        label: "Зображення і ритм",
        text: "Логіка photo, video та sound-aware pacing, перекладена у web narrative та motion behavior.",
      },
      productionDiscipline: {
        label: "Production discipline",
        text: "Чіткість delivery, спокійна ітерація та launch-aware execution, що зберігають авторську якість.",
      },
    },
    practiceLines: {
      label: "Лінії практики",
      line1: {
        label: "Лінія 01",
        title: "Комерційні системи для преміального web delivery.",
        description:
          "Сайти для бренду і продукту, побудовані як чіткі системи: структуровані, editable і надійні, без втрати premium surface quality.",
        tags: ["Преміальні сайти", "Системна архітектура", "Надійність production"],
      },
      line2: {
        label: "Лінія 02",
        title: "Імерсивна режисура для WebXR та cinematic interfaces.",
        description:
          "Просторові та наративні розширення того ж авторського підходу — від AR framing до interaction-led immersive concepts.",
        tags: ["WebXR", "AR режисура", "Кінематографічні інтерфейси"],
      },
    },
    method: {
      label: "Метод роботи",
      title: "Концепт.\nСтруктура.\nРеалізація.",
      items: [
        {
          index: "01",
          title: "Концепт",
          text: "Спочатку визначається narrative intent, positioning і visual tone, а вже потім приймаються layout та implementation decisions.",
        },
        {
          index: "02",
          title: "Структура",
          text: "Концепт перекладається в архітектуру: масштабовані секції, reusable components і чітку content system.",
        },
        {
          index: "03",
          title: "Реалізація",
          text: "Запуск із production discipline, стабільним collaboration flow і release-aware execution.",
        },
      ],
    },
    inventory: {
      label: "Інвентар практики",
      title: "Delivery surfaces, згруповані за наміром.",
      description:
        "Компактна capability-рамка, сфокусована на тому, що реально ship-иться, а не на довгому технічному списку.",
      coreSurfacesLabel: "Core surfaces",
      coreSurfaces: [
        "Преміальні сайти",
        "Case-driven systems",
        "Мультимовна архітектура",
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
      label: "Наступний крок",
      title: "Якщо брифу потрібні авторська якість і надійна реалізація — давай обговоримо.",
      description:
        "Можна одразу почати проєкт або подивитись selected work, щоб побачити цю практику у shipped form.",
      primary: "Почати проєкт",
      secondary: "Переглянути роботи",
    },
  },
  immersive: {
    hero: {
      label: "ІМЕРСИВ",
      title: "Інтерактивні візуальні системи та експериментальні веб-досвіди.",
      description:
        "Відібрані проєкти, що досліджують рух, атмосферу та авторську взаємодію за межами класичного вебу.",
    },
    intro: {
      practiceLineLabel: "Лінія практики",
      practiceLineText:
        "Immersive розглядається як окремий режисерський напрям, а не як варіація звичайного архіву робіт.",
      focusLabel: "Фокус",
      focusTags: ["WebXR", "AR", "Кінематографічний веб", "Просторові інтерфейси"],
    },
    featured: {
      directionBadge: "Флагманський напрям",
    },
    secondary: {
      label: "Додаткові дослідження",
    },
    closing: {
      practiceFramingLabel: "Рамка практики",
      title: "Immersive лишається окремою лінією практики, а не стилістичною надбудовою.",
      description:
        "Фокус тут на авторському темпі, логіці просторової взаємодії та production-aware реалізації, де наративна ясність важлива не менше за візуальну атмосферу.",
      nextStepLabel: "Наступний крок",
      nextStepDescription:
        "Якщо брифу потрібен immersive-напрям, поділись контекстом і ми визначимо найчистіший шлях реалізації.",
      primary: "Почати проєкт",
      secondary: "Переглянути вибрані роботи",
    },
    cases: {
      atlasArc: {
        title: "Atlas Arc",
        tagline: "Кінематографічний WebXR-наратив для property з керованими просторовими переходами.",
        medium: "WebXR / просторовий веб-наратив",
        mode: "Концептний showcase",
        stack: "React, Three.js, WebXR, motion-системи",
        description:
          "Керована immersive-подорож, де editorial storytelling і просторова глибина працюють як єдина авторська sales-поверхня.",
        supportLabel: "Флагманська сцена",
        ctaLabel: "Переглянути immersive-напрям",
        status: "Флагманський концепт",
      },
      signalRoomAr: {
        title: "Signal Room AR",
        tagline: "AR-фреймінг продукту з кінематографічним темпом і атмосферним рухом.",
        medium: "AR / кінематографічний продуктовий сторітелінг",
        mode: "Інтерактивний proof-модуль",
        stack: "React, TypeScript, shader-шари, хореографія камери",
        description:
          "Створено для premium-запусків продуктів, де атмосфера, контекст і reveal через взаємодію формують сприйняту цінність.",
        supportLabel: "Підтримувальне дослідження",
        ctaLabel: "Відкрити immersive-шар",
        status: "Direction build",
      },
      nocturneInterface: {
        title: "Nocturne Interface",
        tagline: "Просторові інтерфейсні дослідження майбутнього для premium interactive briefs.",
        medium: "Майбутні інтерфейси / просторові концепти",
        mode: "Прототипна послідовність",
        stack: "React, Vite, interaction-системи, production QA",
        description:
          "Модульне immersive-дослідження інтерфейсу, сфокусоване на чіткій навігаційній граматиці, кінематографічному ритмі та готовності до запуску.",
        supportLabel: "Підтримувальне дослідження",
        ctaLabel: "Відкрити immersive-сторінку",
        status: "Готовий до продакшену прототип",
      },
      echoDriftXr: {
        title: "Echo Drift XR",
        tagline: "Керовані XR-сцени, побудовані навколо темпу, погляду та атмосферних підказок.",
        medium: "XR / дослідження сценової логіки",
        mode: "Direction build",
        stack: "React, R3F, shader-passes, pacing-системи",
        description:
          "Концептне дослідження для premium immersive briefs, де motion-граматика, переходи та просторовий стейджинг мають відчуватись авторськими, а не шаблонними.",
        supportLabel: "Підтримувальне дослідження",
        ctaLabel: "Відкрити immersive-кейс",
        status: "Direction build",
      },
      thresholdMemory: {
        title: "Threshold Memory",
        tagline: "Експерименти з просторовим інтерфейсом, темнішою атмосферою та контрольованим reveal.",
        medium: "Immersive-наратив / шаровий інтерфейс",
        mode: "Готовий до продакшену прототип",
        stack: "React, TypeScript, motion-шари, візуальні системи",
        description:
          "Premium-дослідження логіки переходів, шарових медіаповерхонь та immersive-фреймінгу інтерфейсу для storytelling-робіт, орієнтованих у майбутнє.",
        supportLabel: "Підтримувальне дослідження",
        ctaLabel: "Відкрити immersive-кейс",
        status: "Готовий до продакшену прототип",
      },
    },
  },
  offer: {
    hero: {
      label: "Пропозиція",
      title: "Преміальні front-end системи для бренду, продукту та експериментального вебу.",
      description:
        "Достатня глибина для запуску, а не лише для концепції. Сайти, інтерактивні case presentations, редаговані системи і production-ready delivery.",
    },
    materials: {
      label: "Відібрані матеріали",
      pricePack: "PRICE PACK PDF",
      management: "WEBSITE MANAGEMENT PDF",
    },
    spectrum: {
      label: "Спектр практики",
      cards: [
        {
          index: "01",
          label: "Бренд / Комерція",
          title: "Бренд / Комерція",
          description:
            "Мультимовні комерційні сайти й преміальні service-facing systems, де структура, framing і cleaner decision-making важливі не менше за візуальний фініш.",
        },
        {
          index: "02",
          label: "Концепт / Інтерактив",
          title: "Концепт / Інтерактив",
          description:
            "Інтерактивні presentation systems і premium digital surfaces, які виходять за межі brochure logic і перетворюються на directed experience.",
        },
        {
          index: "03",
          label: "Редаговане / Операційне",
          title: "Редаговане / Операційне",
          description:
            "Schema-driven content models, editable site architecture, admin-ready systems, internal tools і launch-minded implementation.",
        },
      ],
    },
    selectedDirection: {
      label: "Обраний напрям",
      brandCommercial: {
        title: "Бренд / Комерція",
        description:
          "Мультимовні комерційні сайти й преміальні service-facing systems, де структура, framing і cleaner decision-making важливі не менше, ніж візуальний фініш.",
        provenInLabel: "Підтверджено в",
        provenIn: ["Tersat", "Atlas", "Barcelona Private Advisory"],
        summary:
          "Логіка delivery залишається стабільною: minimal-diff development, staged polish, production-aware build discipline і фінальний human review перед здачею.",
        focusLabel: "Фокус",
        focus: ["Trust-first framing", "Мультимовна структура", "Преміальний service UX"],
        stackLabel: "Stack",
        stack: ["Astro", "TypeScript", "Tailwind", "Scalable content systems"],
      },
      conceptInteractive: {
        title: "Концепт / Інтерактив",
        description:
          "Інтерактивні presentation systems і premium digital surfaces, де motion, reveal і interface rhythm працюють як частина авторського задуму.",
        provenInLabel: "Підтверджено в",
        provenIn: ["Whisper", "Signal Room AR", "Nocturne Interface"],
        summary:
          "Концепт подається не як ефект заради ефекту, а як контрольований інтерфейсний шар із продуманою ієрархією та production-aware поведінкою.",
        focusLabel: "Фокус",
        focus: ["Narrative pacing", "Motion hierarchy", "Interactive depth"],
        stackLabel: "Stack",
        stack: ["React", "TypeScript", "Motion", "Interaction systems"],
      },
      editableOperational: {
        title: "Редаговане / Операційне",
        description:
          "Schema-driven content models, editable site architecture, admin-ready systems, internal tools і launch-minded delivery, де сайт має працювати як operating surface, а не лише як презентація.",
        provenInLabel: "Підтверджено в",
        provenIn: ["CreatorOps", "StudioOps", "Editable delivery systems"],
        summary:
          "Delivery logic stays consistent: minimal-diff development, staged polish, production-aware build discipline і фінальний human review перед здачею.",
        focusLabel: "Фокус",
        focus: ["CMS logic", "Workflow tooling", "Launch readiness"],
        stackLabel: "Stack",
        stack: ["React", "Vite", "TypeScript", "Structured content pipelines"],
      },
    },
    engagementModel: {
      label: "Модель співпраці",
      plans: [
        { key: "base", name: "BASE", subtitle: "Базовий вхід", price: "€1,290" },
        { key: "pro", name: "PRO", subtitle: "Основний комерційний пакет", price: "€2,490" },
        { key: "studio", name: "STUDIO", subtitle: "Ширша системна реалізація", price: "€4,490" },
        { key: "signature", name: "SIGNATURE", subtitle: "Індивідуальна концепт-реалізація", price: "€6,900" },
      ],
      active: {
        name: "PRO",
        subtitle: "Основний комерційний пакет",
        price: "€2,490",
        description:
          "Серйозні комерційні сайти з premium presentation needs.",
        tags: ["Сильніша homepage та IA", "Consult / inquiry flow", "Преміальна візуальна система"],
        bestForLabel: "Найкраще для",
        bestFor:
          "Серйозних комерційних сайтів із premium presentation needs.",
        fitLabel: "Fit",
        fit:
          "Найкращий вибір для більшості premium service, advisory і brand-facing сайтів.",
        cta: "ВІДКРИТИ ПОВНИЙ PRICING PDF",
      },
    },
    websiteManagement: {
      label: "Керування сайтом",
      tabs: {
        managed: "Сайт на супроводі",
        editable: "Редагований сайт",
        custom: "Custom CMS / Admin",
      },
      managed: {
        title: "Сайт на супроводі",
        subtitle: "Studio-managed",
        price: "from €1,200",
        description:
          "Studio-managed updates, без client editing panel, чистіший workflow, нижчий overhead і кращий quality control після запуску.",
        tags: ["Оновлення через студію", "Без client editing panel", "Нижчий операційний overhead"],
        bestForLabel: "Найкраще для",
        bestFor:
          "Клієнтів, яким потрібні оновлення під супроводом, з мінімальним friction і стабільною якістю подачі.",
        modelLabel: "Операційна модель",
        model:
          "Контентні зміни проходять через студію. Підходить тоді, коли сайт змінюється нечасто, а контроль важливіший за автономію.",
        note:
          "Базовий шлях: почати з managed, за потреби додати lightweight editor, а custom CMS розглядати лише коли проєкту справді потрібен глибший операційний контроль.",
        cta: "ВІДКРИТИ MANAGEMENT PDF",
      },
      editable: {
        title: "Редагований сайт",
        subtitle: "Selective editing",
        price: "from €1,500",
        description:
          "Легкий editor для selected fields: тексти, зображення, контакти, базового SEO, FAQ, services, testimonials і простих entries.",
        tags: ["Selected editable fields", "Protected core structure", "Lighter client-side autonomy"],
        bestForLabel: "Найкраще для",
        bestFor:
          "Команд, яким потрібна обмежена свобода редагування без складності повноцінної admin system.",
        modelLabel: "Операційна модель",
        model:
          "Редагованими стають лише selected surfaces, тоді як структура, layout logic і higher-risk layers залишаються захищеними.",
        note:
          "Базовий шлях: почати з managed, за потреби додати lightweight editor, а custom CMS розглядати лише коли проєкту справді потрібен глибший операційний контроль.",
        cta: "ВІДКРИТИ MANAGEMENT PDF",
      },
      custom: {
        title: "Custom CMS / Admin",
        subtitle: "Deeper operational control",
        price: "from €3,200",
        description:
          "Custom CMS / admin layer для проєктів, де потрібен ширший operational control, складніші content flows або внутрішня editorial autonomy.",
        tags: ["Глибший операційний контроль", "Custom content model", "Ширша editorial autonomy"],
        bestForLabel: "Найкраще для",
        bestFor:
          "Команд, де сайт працює як довший operational surface і потребує більш незалежного внутрішнього керування.",
        modelLabel: "Операційна модель",
        model:
          "CMS проєктується під конкретний content model і workflow, а не додається як generic panel за замовчуванням.",
        note:
          "Custom CMS має сенс лише тоді, коли простіший managed або selective editing layer вже не покриває реальні операційні потреби.",
        cta: "ВІДКРИТИ MANAGEMENT PDF",
      },
    },
    finalCta: {
      label: "Матеріали / Контакт",
      text:
        "Потрібні спочатку повні матеріали, чи вже готові обговорювати проєкт? Скористайся файлами або відкрий inquiry drawer напряму.",
      profile: "Профіль",
      primary: "Почати проєкт",
    },
  },


  drawer: {
    title: "Почати проєкт",
    description:
      "Преміальні сайти, інтерактивні презентаційні поверхні та ширші системні розробки. Обери напрям пакета — і ми разом уточнимо обсяг.",
    close: "Закрити",
    packagesLabel: "Пакети",
    packages: [
      {
        name: "Base",
        price: "Від €1,290",
        features: [
          "Легкий premium-сайт brochure-типу",
          "Чиста головна + ключові сторінки",
          "Структура, готова до mobile",
          "Швидка і зрозуміла стартова точка",
        ],
      },
      {
        name: "Pro",
        price: "Від €2,490",
        features: [
          "Сильніша головна + більш продумана IA",
          "Consult / inquiry flow",
          "Преміальна візуальна подача",
          "Найкраще підходить для більшості premium service-сайтів",
        ],
      },
      {
        name: "Studio",
        price: "Від €4,490",
        features: [
          "Ширша системна розробка",
          "Мультимовна структура",
          "Сильніший SEO + глибший контент",
          "Вибірковий motion і polish",
        ],
      },
      {
        name: "Signature",
        price: "Від €6,900",
        features: [
          "Bespoke premium build на основі концепту",
          "Робота, чутлива до подачі й art direction",
          "Інтерактивні premium-поверхні",
          "Авторський motion та інтерфейсна цінність",
        ],
      },
    ],
    faqLabel: "FAQ",
    faq: [
      {
        question: "Що входить у вартість?",
        answer:
          "Обраний пакет покриває погоджений обсяг сайту, дизайн/системну реалізацію та передачу готового build. Хостинг, домен, платні сторонні сервіси та глибші кастомні інтеграції за потреби оцінюються окремо.",
      },
      {
        question: "Скільки це займає часу?",
        answer:
          "Більшість проєктів вкладаються у діапазон 2–5 тижнів залежно від рівня пакета, готовності контенту та швидкості фідбеку. Ширші системні збірки або signature-роботи можуть тривати довше.",
      },
      {
        question: "Чи можна стартувати з малого і розширити пізніше?",
        answer:
          "Так. Часто це найкращий шлях. Ми можемо запустити чітку першу версію, а потім розширити її новими сторінками, сильнішим motion, мультимовною структурою або глибшими системними шарами.",
      },
    ],
    faqTip: "Порада: натисни ESC, щоб закрити.",
    inquiry: {
      label: "Запит",
      responseTime: "Відповідь упродовж 24–48 год",
      fields: {
        name: "Ім’я",
        email: "Email",
        projectType: "Тип проєкту",
        budget: "Бюджет",
        timeline: "Термін",
        links: "Посилання",
        message: "Повідомлення",
      },
      placeholders: {
        name: "Ваше ім’я",
        email: "you@domain.com",
        links: "Сайт / Figma / референси",
        message:
          "Коротко опиши, що ти будуєш, який пакет найближчий і який результат тобі потрібен.",
      },
      options: {
        projectType: [
          { value: "premiumWebsite", label: "Преміальний сайт" },
          { value: "interactivePresentation", label: "Інтерактивна презентація" },
          { value: "broaderSystemBuild", label: "Ширша системна розробка" },
          { value: "signatureBespoke", label: "Signature / bespoke" },
          { value: "other", label: "Інше" },
        ],
        budget: [
          { value: "1-2k", label: "€1–2k" },
          { value: "2-5k", label: "€2–5k" },
          { value: "5-8k", label: "€5–8k" },
          { value: "8k-plus", label: "€8k+" },
        ],
        timeline: [
          { value: "asap", label: "ASAP" },
          { value: "2-4-weeks", label: "2–4 тижні" },
          { value: "1-2-months", label: "1–2 місяці" },
          { value: "flexible", label: "Гнучко" },
        ],
      },
    },
    directEmail: {
      label: "Прямий email",
      hint: "Найкраще для брифів і референсів.",
      send: "Надіслати запит",
      preparing: "Підготовка…",
      copy: "Скопіювати email",
      copied: "Скопійовано",
      open: "Відкрити в пошті",
      draftReady: "Чернетку підготовлено. Якщо поштовий застосунок не відкрився — скористайся «Відкрити в пошті».",
      responseNote: "Відповідь: 24–48 год. Якщо терміново — додай «URGENT» у тему листа.",
    },
    mail: {
      subjectBase: "Запит по проєкту",
      labels: {
        name: "Ім’я",
        email: "Email",
        projectType: "Тип проєкту",
        budget: "Бюджет",
        timeline: "Термін",
        links: "Посилання",
        message: "Повідомлення",
      },
      sentFrom: "Надіслано з форми запиту на сайті",
      empty: "-",
    },
  },
};
