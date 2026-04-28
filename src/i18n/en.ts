import type { ImmersiveCaseKey } from "../data/immersive";

type AboutPillar = {
  label: string;
  text: string;
};

type AboutPracticeLine = {
  label: string;
  title: string;
  description: string;
  tags: string[];
};

type AboutMethodItem = {
  index: string;
  title: string;
  text: string;
};

type OfferSpectrumCard = {
  index: string;
  label: string;
  title: string;
  description: string;
};

type OfferSelectedDirection = {
  title: string;
  description: string;
  provenInLabel: string;
  provenIn: string[];
  summary: string;
  focusLabel: string;
  focus: string[];
  stackLabel: string;
  stack: string[];
};

type OfferPlan = {
  key: string;
  name: string;
  subtitle: string;
  price: string;
};

type OfferManagementPanel = {
  title: string;
  subtitle: string;
  price: string;
  description: string;
  tags: string[];
  bestForLabel: string;
  bestFor: string;
  modelLabel: string;
  model: string;
  note: string;
  cta: string;
};

type ImmersiveCaseCopy = {
  title: string;
  tagline: string;
  medium: string;
  mode: string;
  stack: string;
  description: string;
  supportLabel: string;
  ctaLabel: string;
  status: string;
};

type HomeFeatureItem = {
  title: string;
  text: string;
};

type DrawerPackage = {
  name: string;
  price: string;
  features: string[];
};

type DrawerFaqItem = {
  question: string;
  answer: string;
};

type DrawerOption = {
  value: string;
  label: string;
};

export type TranslationDictionary = {
  nav: {
    work: string;
    immersive: string;
    offer: string;
    about: string;
    start: string;
    startShort: string;
  };
  home: {
    hero: {
      label: string;
      titleMain: string;
      titleSub: string;
    };
    immersive: {
      label: string;
      cta: string;
    };
    work: {
      label: string;
      archive: string;
      view: string;
    };
    skills: {
      title: string;
      description: string;
      items: HomeFeatureItem[];
    };
    services: {
      title: string;
      description: string;
      items: HomeFeatureItem[];
    };
    about: {
      title: string;
      text: string;
    };
    contact: {
      label: string;
      title: string;
      text: string;
      email: string;
      copy: string;
      linksLabel: string;
    };
  };
  work: {
    hero: {
      label: string;
      title: string;
      description: string;
    };
    selected: {
      label: string;
      openArchive: string;
    };
    archive: {
      label: string;
      cta: string;
      backToSelected: string;
      backToHome: string;
      closeLabel: string;
      closeDescription: string;
      categories: {
        all: string;
        softwareProduct: string;
        creatorsCulture: string;
        advisoryProperty: string;
        brands: string;
        hospitality: string;
      };
    };
    case: {
      view: string;
      countSingular: string;
      countPlural: string;
      role: string;
      stack: string;
      status: string;
      completeness: {
        full: string;
        inProgress: string;
        preview: string;
      };
    };
    controls: {
      cards: string;
      list: string;
      sort: string;
      newest: string;
      oldest: string;
    };
  };
  about: {
    hero: {
      label: string;
      title: string;
      description: string;
      meta: string[];
    };
    roots: {
      label: string;
      title: string;
      description: string;
    };
    pillars: {
      visualDirection: AboutPillar;
      imageRhythm: AboutPillar;
      productionDiscipline: AboutPillar;
    };
    practiceLines: {
      label: string;
      line1: AboutPracticeLine;
      line2: AboutPracticeLine;
    };
    method: {
      label: string;
      title: string;
      items: AboutMethodItem[];
    };
    inventory: {
      label: string;
      title: string;
      description: string;
      coreSurfacesLabel: string;
      coreSurfaces: string[];
      extendedPracticeLabel: string;
      extendedPractice: string[];
    };
    links: {
      label: string;
      title: string;
      description: string;
    };
    cta: {
      label: string;
      title: string;
      description: string;
      primary: string;
      secondary: string;
    };
  };
  immersive: {
    hero: {
      label: string;
      title: string;
      description: string;
    };
    intro: {
      practiceLineLabel: string;
      practiceLineText: string;
      focusLabel: string;
      focusTags: string[];
    };
    featured: {
      directionBadge: string;
    };
    secondary: {
      label: string;
    };
    closing: {
      practiceFramingLabel: string;
      title: string;
      description: string;
      nextStepLabel: string;
      nextStepDescription: string;
      primary: string;
      secondary: string;
    };
    cases: Record<ImmersiveCaseKey, ImmersiveCaseCopy>;
  };
  offer: {
    hero: {
      label: string;
      title: string;
      description: string;
    };
    materials: {
      label: string;
      pricePack: string;
      management: string;
    };
    spectrum: {
      label: string;
      cards: OfferSpectrumCard[];
    };
    selectedDirection: {
      label: string;
      brandCommercial: OfferSelectedDirection;
      conceptInteractive: OfferSelectedDirection;
      editableOperational: OfferSelectedDirection;
    };
    engagementModel: {
      label: string;
      plans: OfferPlan[];
      active: {
        name: string;
        subtitle: string;
        price: string;
        description: string;
        tags: string[];
        bestForLabel: string;
        bestFor: string;
        fitLabel: string;
        fit: string;
        cta: string;
      };
    };
    websiteManagement: {
      label: string;
      tabs: {
        managed: string;
        editable: string;
        custom: string;
      };
      managed: OfferManagementPanel;
      editable: OfferManagementPanel;
      custom: OfferManagementPanel;
    };
    finalCta: {
      label: string;
      text: string;
      profile: string;
      primary: string;
    };
  };
  drawer: {
    title: string;
    description: string;
    close: string;
    packagesLabel: string;
    packages: DrawerPackage[];
    faqLabel: string;
    faq: DrawerFaqItem[];
    faqTip: string;
    inquiry: {
      label: string;
      responseTime: string;
      fields: {
        name: string;
        email: string;
        projectType: string;
        budget: string;
        timeline: string;
        links: string;
        message: string;
      };
      placeholders: {
        name: string;
        email: string;
        links: string;
        message: string;
      };
      options: {
        projectType: DrawerOption[];
        budget: DrawerOption[];
        timeline: DrawerOption[];
      };
    };
    directEmail: {
      label: string;
      hint: string;
      send: string;
      preparing: string;
      copy: string;
      copied: string;
      open: string;
      draftReady: string;
      responseNote: string;
    };
    mail: {
      subjectBase: string;
      labels: {
        name: string;
        email: string;
        projectType: string;
        budget: string;
        timeline: string;
        links: string;
        message: string;
      };
      sentFrom: string;
      empty: string;
    };
  };
};

export const en: TranslationDictionary = {
  nav: {
    work: "Work",
    immersive: "Immersive",
    offer: "Offer",
    about: "About",
    start: "Start a project",
    startShort: "Start",
  },

  home: {
    hero: {
      label: "Practice",
      titleMain:
        "Premium front-end systems for brand, product, and experiential web.",
      titleSub:
        "Immersive direction and production-ready execution.",
    },

    immersive: {
      label: "Immersive direction",
      cta: "View immersive work",
    },

    work: {
      label: "Selected work",
      archive: "Open archive",
      view: "View case",
    },

    skills: {
      title: "Skills",
      description:
        "Concept-first premium web experiences: editorial design, controlled motion, and precise implementation.",
      items: [
        {
          title: "Premium editorial UI",
          text:
            "Responsive layout architecture, typography discipline, and premium presentation systems.",
        },
        {
          title: "Motion-led interfaces",
          text:
            "Scroll choreography, interaction pacing, and narrative-driven motion systems.",
        },
        {
          title: "Front-end / core",
          text:
            "React, TypeScript, Astro, Next.js, and production-ready architecture.",
        },
        {
          title: "Systems / architecture",
          text:
            "Multilingual routing, reusable systems, and structured content pipelines.",
        },
        {
          title: "Product / internal tools",
          text:
            "Conversion flows, internal tools, QA discipline, and launch-ready builds.",
        },
      ],
    },

    services: {
      title: "Services",
      description:
        "Three focused packages for premium outcomes. Minimal surface, strong internal structure.",
      items: [
        {
          title: "Signature Website",
          text:
            "High-end brand site with editorial pacing and refined motion system.",
        },
        {
          title: "Case Study Site",
          text:
            "Narrative-driven case experience built for trust and conversion.",
        },
        {
          title: "Interactive Showcase",
          text:
            "Concept-driven interactive piece with advanced motion and systems.",
        },
      ],
    },

    about: {
      title: "Creative developer with system depth.",
      text:
        "I design and build premium front-end systems for brand, product, and presentation-heavy websites.",
    },

    contact: {
      label: "Contact",
      title: "Start a project.",
      text:
        "Brand site, interactive case, or concept-driven system — send the brief.",
      email: "Email",
      copy: "Copy email",
      linksLabel: "Elsewhere",
    },
  },

  work: {
    hero: {
      label: "WORK",
      title: "Selected work and case studies.",
      description:
        "A curated set of projects across brand, product, and experimental web.",
    },

    selected: {
      label: "Selected work",
      openArchive: "Open archive",
    },

    archive: {
      label: "ARCHIVE",
      cta: "View full archive",
      backToSelected: "Back to selected",
      backToHome: "Back to home",
      closeLabel: "ARCHIVE CLOSE",
      closeDescription:
        "Return to the selected overview or continue into a full case page.",
      categories: {
        all: "All",
        softwareProduct: "Software / Product",
        creatorsCulture: "Creators / Culture",
        advisoryProperty: "Advisory / Property",
        brands: "Brands",
        hospitality: "Hospitality",
      },
    },

    case: {
      view: "View case",
      countSingular: "case",
      countPlural: "cases",
      role: "Role",
      stack: "Stack",
      status: "Status",
      completeness: {
        full: "Full case",
        inProgress: "In progress",
        preview: "Preview",
      },
    },

    controls: {
      cards: "Cards",
      list: "List",
      sort: "Sort",
      newest: "Newest",
      oldest: "Oldest",
    },
  },

  about: {
    hero: {
      label: "About",
      title: "Premium front-end practice where authorship, structure, and delivery move as one system.",
      description:
        "This is not generic front-end production. The work combines authored visual direction, rigorous structural thinking, and production-minded implementation so premium presentation can stay intact from concept through launch.",
      meta: [
        "Co-founder, Concept2048 since 2021",
        "Direction roots in image, video, and rhythm",
        "Shipped with production discipline",
      ],
    },

    roots: {
      label: "Author roots",
      title: "This practice grew from authorship before interfaces.",
      description:
        "Visual direction, image-making, pacing, and production discipline formed the base layer. That artistic foundation is why structure and implementation are treated as creative decisions, not only technical execution.",
    },

    pillars: {
      visualDirection: {
        label: "Visual direction",
        text: "Composition and tone-setting that define how a product is perceived before interaction begins.",
      },
      imageRhythm: {
        label: "Image and rhythm",
        text: "Photo, video, and sound-aware pacing translated into web narrative and motion behavior.",
      },
      productionDiscipline: {
        label: "Production discipline",
        text: "Delivery clarity, calm iteration, and launch-aware execution that protect authored quality.",
      },
    },

    practiceLines: {
      label: "Practice lines",
      line1: {
        label: "Line 01",
        title: "Commercial systems for premium web delivery.",
        description:
          "Brand and product-facing websites built as clear systems: structured, editable, and reliable without losing premium surface quality.",
        tags: ["Premium websites", "System architecture", "Production reliability"],
      },
      line2: {
        label: "Line 02",
        title: "Immersive direction for WebXR and cinematic interfaces.",
        description:
          "Spatial and narrative extensions of the same authored approach, from AR framing to interaction-led immersive concepts.",
        tags: ["WebXR", "AR direction", "Cinematic interfaces"],
      },
    },

    method: {
      label: "Working method",
      title: "Concept. Structure. Delivery.",
      items: [
        {
          index: "01",
          title: "Concept",
          text: "Define narrative intent, positioning, and visual tone before layout and implementation decisions.",
        },
        {
          index: "02",
          title: "Structure",
          text: "Translate concept into architecture: scalable sections, reusable components, and a clear content system.",
        },
        {
          index: "03",
          title: "Delivery",
          text: "Ship with production discipline, stable collaboration flow, and release-aware execution.",
        },
      ],
    },

    inventory: {
      label: "Practice inventory",
      title: "Delivery surfaces, grouped with intent.",
      description:
        "A compact capability frame focused on what gets shipped, not a long technical list.",
      coreSurfacesLabel: "Core surfaces",
      coreSurfaces: [
        "Premium websites",
        "Case-driven systems",
        "Multilingual architecture",
        "Editable content layers",
      ],
      extendedPracticeLabel: "Extended practice",
      extendedPractice: [
        "Interaction systems",
        "Motion-led behavior",
        "Selected immersive direction",
      ],
    },
    links: {
      label: "Profile / Links",
      title: "External profiles, studio hub, and technical archive.",
      description:
        "A quiet layer for the studio hub, professional profile, code archive, and visual channel.",
    },

    cta: {
      label: "Next step",
      title: "If the brief needs authored quality and reliable execution, let's talk.",
      description:
        "Start a project, or review selected work to see this practice in shipped form.",
      primary: "Start a project",
      secondary: "Explore work",
    },
  },

  immersive: {
    hero: {
      label: "IMMERSIVE",
      title: "Interactive visual systems and experimental web experiences.",
      description:
        "Selected works exploring motion, atmosphere, and authored interaction beyond traditional web formats.",
    },

    intro: {
      practiceLineLabel: "Practice line",
      practiceLineText:
        "Immersive is treated as a distinct direction surface, not a variation of the regular work archive.",
      focusLabel: "Focus",
      focusTags: ["WebXR", "AR", "Cinematic web", "Spatial interfaces"],
    },

    featured: {
      directionBadge: "Flagship direction",
    },

    secondary: {
      label: "Secondary studies",
    },

    closing: {
      practiceFramingLabel: "Practice framing",
      title: "Immersive stays a dedicated practice line, not a style overlay.",
      description:
        "The focus is authored pacing, spatial interaction logic, and production-aware implementation where narrative clarity is as important as visual atmosphere.",
      nextStepLabel: "Next step",
      nextStepDescription:
        "If your brief needs immersive direction, share the context and we can scope the cleanest build path.",
      primary: "Start a project",
      secondary: "View selected work",
    },

    cases: {
      whisper: {
        title: "WHISPER",
        tagline:
          "A cinematic Web / XR exhibition where photography becomes an immersive collector experience.",
        medium: "Interactive Web / XR Exhibition",
        mode: "Advanced working V1",
        stack: "React, Vite, Three.js, WebXR, Quest VR, AR preview, Cloudflare Pages",
        description:
          "A flagship in-progress exhibition combining conceptual photography, editorial web presentation, Quest VR hand-navigation, print catalog, AR preview, and a reusable XRCore foundation.",
        supportLabel: "Flagship immersive case",
        ctaLabel: "Open WHISPER case",
        status: "Advanced V1 / In progress",
      },
      atlasArc: {
        title: "Atlas Arc",
        tagline: "Cinematic WebXR property narrative with guided spatial transitions.",
        medium: "WebXR / spatial web narrative",
        mode: "Concept-led showcase",
        stack: "React, Three.js, WebXR, motion systems",
        description:
          "A directed immersive journey where editorial storytelling and spatial depth work as one authored sales surface.",
        supportLabel: "Flagship stage",
        ctaLabel: "View immersive direction",
        status: "Flagship concept",
      },
      signalRoomAr: {
        title: "Signal Room AR",
        tagline: "AR-assisted product framing with cinematic pacing and ambient motion.",
        medium: "AR / cinematic product storytelling",
        mode: "Interactive proof module",
        stack: "React, TypeScript, shader layers, camera choreography",
        description:
          "Designed for premium product launches where atmosphere, context, and interaction reveal are core to perceived value.",
        supportLabel: "Support study",
        ctaLabel: "Explore immersive layer",
        status: "Direction build",
      },
      nocturneInterface: {
        title: "Nocturne Interface",
        tagline: "Future-facing spatial interface studies for premium interactive briefs.",
        medium: "Future interfaces / spatial concepts",
        mode: "Prototype sequence",
        stack: "React, Vite, interaction systems, production QA",
        description:
          "A modular immersive interface study focused on clear navigation grammar, cinematic rhythm, and launch-aware execution.",
        supportLabel: "Support study",
        ctaLabel: "Open immersive page",
        status: "Production-ready prototype",
      },
      echoDriftXr: {
        title: "Echo Drift XR",
        tagline: "Directed XR scene studies built around pace, gaze, and atmospheric cueing.",
        medium: "XR / scene logic study",
        mode: "Direction build",
        stack: "React, R3F, shader passes, pacing systems",
        description:
          "A concept study for premium immersive briefs where motion grammar, transitions, and spatial staging need to feel authored rather than generic.",
        supportLabel: "Support study",
        ctaLabel: "Open immersive case",
        status: "Direction build",
      },
      thresholdMemory: {
        title: "Threshold Memory",
        tagline: "Spatial interface experiments with darker atmosphere and controlled reveal.",
        medium: "Immersive narrative / layered interface",
        mode: "Production-ready prototype",
        stack: "React, TypeScript, motion layers, visual systems",
        description:
          "A premium study around transition logic, layered media surfaces, and immersive interface framing for future-facing storytelling work.",
        supportLabel: "Support study",
        ctaLabel: "Open immersive case",
        status: "Production-ready prototype",
      },
    },
  },

  offer: {
    hero: {
      label: "Offer",
      title: "Premium front-end systems for brand, product, and experiential web.",
      description:
        "Enough depth to ship, not just to concept. Websites, interactive case presentations, editable systems, and production-ready launch delivery.",
    },

    materials: {
      label: "Selected materials",
      pricePack: "Price pack PDF",
      management: "Website management PDF",
    },

    spectrum: {
      label: "Practice spectrum",
      cards: [
        {
          index: "01",
          label: "Brand / Commercial",
          title: "Brand / Commercial",
          description:
            "Premium commercial websites for service, hospitality, advisory, and brand-facing projects where positioning, trust, and conversion clarity matter as much as visual finish.",
        },
        {
          index: "02",
          label: "Concept / Interactive",
          title: "Concept / Interactive",
          description:
            "Interactive case presentations, immersive web surfaces, and motion-led experiences where interface, atmosphere, and narrative pacing become part of the product value.",
        },
        {
          index: "03",
          label: "Product / Operational",
          title: "Product / Operational",
          description:
            "Workflow tools, product prototypes, structured content systems, and launch-ready interfaces where the website or app has to work as a usable operating surface, not only a presentation.",
        },
      ],
    },

    selectedDirection: {
      label: "Selected direction",
      brandCommercial: {
        title: "Brand / Commercial",
        description:
          "Premium commercial websites for service, hospitality, advisory, and brand-facing projects where positioning, trust, and conversion clarity matter as much as visual finish.",
        provenInLabel: "Proven in",
        provenIn: ["Barcelona Private Advisory", "Casa Nube", "FLUID"],
        summary:
          "Best for premium service websites, local business concepts, hospitality, property, and event-facing sites where clarity, credibility, and visual restraint need to work together.",
        focusLabel: "Focus",
        focus: ["Trust-first framing", "Multilingual structure", "Premium service UX"],
        stackLabel: "Stack",
        stack: ["Astro", "Next.js", "TypeScript", "Tailwind", "SEO + i18n"],
      },
      conceptInteractive: {
        title: "Concept / Interactive",
        description:
          "Interactive case presentations, immersive web surfaces, and motion-led experiences where interface, atmosphere, and narrative pacing become part of the product value.",
        provenInLabel: "Proven in",
        provenIn: ["WHISPER", "FORM INDEX", "House of Lune"],
        summary:
          "Best when a site has to feel authored, cinematic, and memorable rather than assembled from generic sections or static brochure patterns.",
        focusLabel: "Focus",
        focus: ["Motion grammar", "Editorial pacing", "Immersive presentation"],
        stackLabel: "Stack",
        stack: ["React", "Vite", "Motion", "Three.js", "WebGL / WebXR"],
      },
      editableOperational: {
        title: "Product / Operational",
        description:
          "Workflow tools, product prototypes, structured content systems, and launch-ready interfaces where the website or app has to work as a usable operating surface, not only a presentation.",
        provenInLabel: "Proven in",
        provenIn: ["CreatorOps", "Print Border Studio", "Barcelona Private Advisory"],
        summary:
          "Best for creator tools, internal workflows, productized service surfaces, shortlist systems, export flows, and interfaces that need real user actions beyond browsing.",
        focusLabel: "Focus",
        focus: ["Workflow logic", "Structured content", "Launch-ready interfaces"],
        stackLabel: "Stack",
        stack: ["React", "Vite", "TypeScript", "Data flows", "Export logic"],
      },
    },

    engagementModel: {
      label: "Engagement model",
      plans: [
        {
          key: "base",
          name: "Base",
          subtitle: "Focused entry",
          price: "€1,290",
        },
        {
          key: "pro",
          name: "Pro",
          subtitle: "Main commercial entry",
          price: "€2,490",
        },
        {
          key: "studio",
          name: "Studio",
          subtitle: "Broader system build",
          price: "€4,490",
        },
        {
          key: "signature",
          name: "Signature",
          subtitle: "Bespoke concept build",
          price: "€6,900",
        },
      ],
      active: {
        name: "Pro",
        subtitle: "Main commercial entry",
        price: "€2,490",
        description:
          "Serious commercial websites with premium presentation needs.",
        tags: ["Stronger homepage and IA", "Consult / inquiry flow", "Premium visual system"],
        bestForLabel: "Best for",
        bestFor:
          "Serious commercial websites with premium presentation needs.",
        fitLabel: "Fit",
        fit:
          "Best fit for most premium service, advisory, and brand-facing sites.",
        cta: "Open full pricing PDF",
      },
    },

    websiteManagement: {
      label: "Website management",
      tabs: {
        managed: "Managed site",
        editable: "Editable site",
        custom: "Custom CMS",
      },
      managed: {
        title: "Managed site",
        subtitle: "Studio-managed",
        price: "€1,290",
        description:
          "Studio-managed updates, no client editing panel, cleaner workflow, lower overhead, and tighter quality control after launch.",
        tags: ["Studio-managed updates", "No client editing panel", "Lower operational overhead"],
        bestForLabel: "Best for",
        bestFor:
          "Clients who want updates handled for them, with minimal friction and consistent presentation quality.",
        modelLabel: "Operational model",
        model:
          "Content changes go through the studio. Best when the site changes occasionally and control matters more than autonomy.",
        note:
          "Default path: start managed, add a lightweight editor when needed, and scope custom CMS only when the project truly requires deeper operational control.",
        cta: "Open management PDF",
      },
      editable: {
        title: "Editable site",
        subtitle: "Selective editing",
        price: "from €1,600",
        description:
          "A lightweight editor for selected fields: text, images, contact details, SEO basics, FAQ, services, testimonials, and simple entries.",
        tags: ["Selected editable fields", "Protected core structure", "Lighter client-side autonomy"],
        bestForLabel: "Best for",
        bestFor:
          "Teams that need limited editing freedom without the complexity of a full admin system.",
        modelLabel: "Operational model",
        model:
          "Selected surfaces become editable, while structure, layout logic, and higher-risk layers stay protected.",
        note:
          "Default path: start managed, add a lightweight editor when needed, and scope custom CMS only when the project truly requires deeper operational control.",
        cta: "Open management PDF",
      },
      custom: {
        title: "Custom CMS",
        subtitle: "Deeper control",
        price: "Custom quote",
        description:
          "A custom content or admin layer designed around operational needs, permissions, workflows, content relationships, and internal publishing logic.",
        tags: ["Deeper operations", "Custom workflows", "Content architecture"],
        bestForLabel: "Best for",
        bestFor:
          "Teams with recurring updates, multi-role workflows, or content operations that go beyond a simple marketing site.",
        modelLabel: "Operational model",
        model:
          "The editing layer is scoped as a product surface: roles, content rules, and operational flows are designed intentionally, not added ad hoc.",
        note:
          "This is a separate scope and only makes sense when the operational layer is a real business need rather than a nice-to-have.",
        cta: "Open management PDF",
      },
    },

    finalCta: {
      label: "Materials / contact",
      text:
        "Need the full materials first, or ready to discuss a project? Use the downloads below or open the inquiry drawer directly.",
      profile: "Profile",
      primary: "Start a project",
    },
  },


  drawer: {
    title: "Start a project",
    description:
      "Premium websites, interactive presentation surfaces, and broader system builds. Choose a package direction and we’ll refine scope together.",
    close: "Close",
    packagesLabel: "Packages",
    packages: [
      {
        name: "Base",
        price: "From €1,290",
        features: [
          "Lean brochure-style premium website",
          "Clean homepage + core pages",
          "Mobile-ready structure",
          "Fast clear starting point",
        ],
      },
      {
        name: "Pro",
        price: "From €2,490",
        features: [
          "Stronger homepage + more intentional IA",
          "Consult / inquiry flow",
          "Premium visual framing",
          "Best fit for most premium service sites",
        ],
      },
      {
        name: "Studio",
        price: "From €4,490",
        features: [
          "Broader system build",
          "Multilingual structure",
          "Stronger SEO + content depth",
          "Selected motion and polish",
        ],
      },
      {
        name: "Signature",
        price: "From €6,900",
        features: [
          "Bespoke concept-led premium build",
          "Presentation-heavy / art-direction-sensitive work",
          "Interactive premium surfaces",
          "Authored motion and interface value",
        ],
      },
    ],
    faqLabel: "FAQ",
    faq: [
      {
        question: "What’s included in the price?",
        answer:
          "The selected package covers the agreed site scope, design/system implementation, and delivery of the build. Hosting, domain, paid third-party services, and deeper custom integrations are scoped separately when needed.",
      },
      {
        question: "How long does it take?",
        answer:
          "Most projects land in a 2–5 week range depending on package level, content readiness, and feedback speed. Broader system builds or signature work can take longer.",
      },
      {
        question: "Can we start small and extend later?",
        answer:
          "Yes. That is often the best route. We can launch a clear first version, then extend with more pages, stronger motion, multilingual structure, or deeper system layers later.",
      },
    ],
    faqTip: "Tip: press ESC to close.",
    inquiry: {
      label: "Inquiry",
      responseTime: "We’ll reply in 24–48h",
      fields: {
        name: "Name",
        email: "Email",
        projectType: "Project type",
        budget: "Budget",
        timeline: "Timeline",
        links: "Links",
        message: "Message",
      },
      placeholders: {
        name: "Your name",
        email: "you@domain.com",
        links: "Website / Figma / references",
        message:
          "Tell me what you’re building, which package feels closest, and what outcome you need.",
      },
      options: {
        projectType: [
          { value: "premiumWebsite", label: "Premium website" },
          { value: "interactivePresentation", label: "Interactive presentation" },
          { value: "broaderSystemBuild", label: "Broader system build" },
          { value: "signatureBespoke", label: "Signature / bespoke" },
          { value: "other", label: "Other" },
        ],
        budget: [
          { value: "1-2k", label: "€1–2k" },
          { value: "2-5k", label: "€2–5k" },
          { value: "5-8k", label: "€5–8k" },
          { value: "8k-plus", label: "€8k+" },
        ],
        timeline: [
          { value: "asap", label: "ASAP" },
          { value: "2-4-weeks", label: "2–4 weeks" },
          { value: "1-2-months", label: "1–2 months" },
          { value: "flexible", label: "Flexible" },
        ],
      },
    },
    directEmail: {
      label: "Direct email",
      hint: "Best for briefs & references.",
      send: "Send inquiry",
      preparing: "Preparing…",
      copy: "Copy email",
      copied: "Copied",
      open: "Open in mail",
      draftReady: "Draft prepared. If your mail app didn’t open, use ‘Open in mail’.",
      responseNote: "Response: 24–48h. If urgent — add ‘URGENT’ in subject.",
    },
    mail: {
      subjectBase: "Project inquiry",
      labels: {
        name: "Name",
        email: "Email",
        projectType: "Project type",
        budget: "Budget",
        timeline: "Timeline",
        links: "Links",
        message: "Message",
      },
      sentFrom: "Sent from the website inquiry form",
      empty: "-",
    },
  },
};
