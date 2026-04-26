import type { CaseCoverFocus, CaseCoverTone } from "../ui/work/caseCover.types";
import type { CaseStatusKind } from "../ui/status/status.types";

export type CaseFrameKind = "image" | "video";
export type CaseFrameDevice = "desktop" | "mobile";
export type CaseFrameAspect = "landscape" | "portrait" | "phone";

export type CaseFrame = {
  kind?: CaseFrameKind;
  device?: CaseFrameDevice;
  aspect?: CaseFrameAspect;
  src: string;
  poster?: string;
  alt?: string;
  caption?: string;
  width?: "full" | "window";
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
};

export type CaseContent = {
  hero?: CaseFrame;
  frames?: CaseFrame[];
  summary?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  clarity?: string;
  motion?: string;
  build?: string;
  notes?: string;
  credits?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; href: string }>;
};

export type CaseCompleteness = "full" | "preview" | "in-progress";

export type ArchiveCategoryKey =
  | "software-product"
  | "creators-culture"
  | "advisory-property"
  | "brands"
  | "hospitality";

export const archiveCategoryLabels: Record<ArchiveCategoryKey, string> = {
  "software-product": "Software / Product",
  "creators-culture": "Creators / Culture",
  "advisory-property": "Advisory / Property",
  brands: "Brands",
  hospitality: "Hospitality",
};

export type Case = {
  slug: string;
  code: string;
  index: string;
  title: string;
  year: string;
  tagline: string;
  roleLabel: string;
  stackLabel: string;
  statusLabel: string;
  statusKind: CaseStatusKind;
  statusNote?: string;
  completeness?: CaseCompleteness;
  archiveCategory: ArchiveCategoryKey;
  poster: { src: string; alt: string };
  coverTone: CaseCoverTone;
  coverFocus?: CaseCoverFocus;
  content?: CaseContent;
};

export const cases: Case[] = [
  {
    slug: "whisper",
    code: "W-01",
    index: "01",
    title: "Whisper",
    year: "2026",
    tagline: "Minimalist experience design with controlled motion.",
    roleLabel: "Design / Dev / Motion",
    stackLabel: "React / Framer / Tailwind",
    statusLabel: "Preview",
    statusKind: "preview",
    statusNote:
      "Strong visual direction is locked; fuller narrative and production metrics are still being finalized.",
    completeness: "preview",
    archiveCategory: "software-product",
    poster: { src: "/cases/whisper/poster.jpg", alt: "Whisper poster" },
    coverTone: "dark",
    content: {
      summary:
        "Exploration of calm motion and editorial pacing for a minimalist product surface.",
      problem:
        "Minimal product concepts often lose clarity when motion becomes decoration instead of structure.",
      approach:
        "Built around restrained pacing, quiet chrome, and a deliberately reduced interaction set that keeps hierarchy doing the work.",
      outcome:
        "Preview direction establishes a calm premium surface with enough system logic to guide future product expansion.",
      clarity:
        "The interface stays readable by using spacing, typography, and timing before adding extra interface noise.",
      motion:
        "Motion is treated as emphasis and sequencing, not spectacle.",
      build:
        "React, Tailwind, and Framer-based front-end study for reusable premium UI patterns.",
      hero: {
        src: "/cases/whisper/poster.jpg",
        alt: "Whisper - hero",
        caption: "Hero surface with restrained motion and strict spacing.",
        width: "full",
      },
      frames: [
        {
          src: "/cases/whisper/frame-01.jpg",
          alt: "Whisper - frame 01",
          caption: "Editorial frame with generous breathing space and hierarchy.",
          width: "window",
        },
        {
          src: "/cases/whisper/frame-02.jpg",
          alt: "Whisper - frame 02",
          caption: "Full-width composition with image-first emphasis.",
          width: "full",
        },
        {
          src: "/cases/whisper/frame-03.jpg",
          alt: "Whisper - frame 03",
          caption: "Interaction pass focused on subtle but readable motion.",
          width: "window",
        },
      ],
      notes:
        "Preview case: selected frames only while narrative and production metrics are being finalized.",
    },
  },
  {
    slug: "gallery",
    code: "G-02",
    index: "02",
    title: "Gallery",
    year: "2026",
    tagline: "High-end art showcase with editorial pacing.",
    roleLabel: "Design / Dev",
    stackLabel: "React / Motion",
    statusLabel: "Preview",
    statusKind: "preview",
    statusNote:
      "Visual system and selected frames are stable; full case narrative is still being completed.",
    completeness: "preview",
    archiveCategory: "creators-culture",
    poster: { src: "/cases/gallery/poster.jpg", alt: "Gallery poster" },
    coverTone: "mixed",
    content: {
      summary:
        "Preview of a gallery-style visual system with quiet chrome and museum-like pacing.",
      problem:
        "Art-heavy showcase websites often collapse into generic grids or over-styled chrome that competes with the work itself.",
      approach:
        "Used museum-like pacing, quiet interface framing, and editorial sequencing so the artwork remains the focal surface.",
      outcome:
        "The preview locks visual direction for browse, pause, and detail states while the fuller case narrative is still being finalized.",
      clarity:
        "Negative space and typographic rhythm carry more of the interface load than added UI treatment.",
      motion:
        "Transitions stay restrained so the gallery reads as a composed viewing surface, not an effects demo.",
      build:
        "React and motion-led interface study focused on premium showcase behavior and scalable editorial structure.",
      hero: {
        src: "/cases/gallery/poster.jpg",
        alt: "Gallery - hero",
        caption: "Gallery rhythm built around negative space and controlled sequencing.",
        width: "full",
      },
      frames: [
        {
          src: "/cases/gallery/frame-01.jpg",
          alt: "Gallery - frame 01",
          caption: "Series index with calm grid logic and strong typography.",
          width: "window",
        },
        {
          src: "/cases/gallery/frame-02.jpg",
          alt: "Gallery - frame 02",
          caption: "Full-width pause moment for emphasis.",
          width: "full",
        },
        {
          src: "/cases/gallery/frame-03.jpg",
          alt: "Gallery - frame 03",
          caption: "Detail view with consistent spacing and premium polish.",
          width: "window",
        },
      ],
      notes:
        "Preview case: visual direction and frame selection are stable; full narrative details are still in progress.",
    },
  },
  {
    slug: "musician",
    code: "M-03",
    index: "03",
    title: "Musician",
    year: "2026",
    tagline: "Cinematic artist site with integrated media.",
    roleLabel: "Design / Dev",
    stackLabel: "React / Audio",
    statusLabel: "In progress",
    statusKind: "in_progress",
    statusNote:
      "Core direction and media logic are established; final modules and polish are still in active production.",
    completeness: "in-progress",
    archiveCategory: "creators-culture",
    poster: { src: "/cases/musician/poster.jpg", alt: "Musician poster" },
    coverTone: "dark",
    content: {
      summary:
        "In-progress artist platform focused on native listening flows and cinematic presentation.",
      problem:
        "Artist websites often push listening into disconnected embeds and link-outs, which breaks immersion and weakens identity.",
      approach:
        "Structured the concept around native listening, cinematic framing, and a calmer release narrative that keeps media inside the main surface.",
      hero: {
        src: "/cases/musician/poster.jpg",
        alt: "Musician - hero",
        caption: "Cinematic direction with a media-first product surface.",
        width: "full",
      },
      frames: [
        {
          src: "/cases/musician/frame-01.jpg",
          alt: "Musician - frame 01",
          caption: "Artist identity with minimal interface framing.",
          width: "window",
        },
        {
          src: "/cases/musician/frame-02.jpg",
          alt: "Musician - frame 02",
          caption: "Integrated media for releases and listening in-page.",
          width: "full",
        },
      ],
      outcome:
        "Foundation is in place; final media modules and motion polish are currently in production.",
      clarity:
        "Artwork, track context, and listening actions are designed to stay in one continuous editorial flow.",
      motion:
        "Motion direction stays soft and atmospheric so the artist identity leads the experience.",
      build:
        "React-based front-end concept for integrated audio surfaces, editorial release sequencing, and future media modules.",
      notes:
        "Goal: keep listening native and reduce link-outs unless they are clearly optional.",
    },
  },
  {
    slug: "bcn-advisory",
    code: "B-04",
    index: "04",
    title: "Barcelona Private Advisory",
    year: "2026",
    tagline:
      "Premium bilingual advisory demo for Barcelona property discovery with shortlist-first decision support.",
    roleLabel: "UX / UI / Front-end",
    stackLabel: "React / TypeScript / Motion",
    statusLabel: "Shipped",
    statusKind: "shipped",
    completeness: "full",
    archiveCategory: "advisory-property",
    poster: {
      src: "/cases/bcn-advisory/desktop/bcn-advisory-1.jpg",
      alt: "Barcelona Private Advisory poster",
    },
    coverTone: "light",
    coverFocus: "center",
    content: {
      summary:
        "Client-facing premium advisory demo for Spain Costas, combining editorial presentation with shortlist logic, district-led browsing, comparison, lightbox viewing, and private intake.",
      hero: {
        kind: "image",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-1.jpg",
        alt: "Barcelona Private Advisory - hero frame",
        caption: "Premium bilingual advisory surface for curated Barcelona property discovery.",
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-2.jpg",
          alt: "Barcelona Private Advisory - desktop frame 01",
          caption: "District-led search tuned for fit over listing volume.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-3.jpg",
          alt: "Barcelona Private Advisory - desktop frame 02",
          caption: "Shortlist-first browse state for faster advisory decisions.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-4.jpg",
          alt: "Barcelona Private Advisory - desktop frame 03",
          caption: "Search composition balancing calm editorial rhythm with practical filtering.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-5.jpg",
          alt: "Barcelona Private Advisory - desktop frame 04",
          caption: "Property detail with narrative context, gallery entry, and next-step cues.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-7.jpg",
          alt: "Barcelona Private Advisory - desktop frame 05",
          caption: "Shortlist and comparison rhythm across curated selections.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-6.jpg",
          alt: "Barcelona Private Advisory - desktop frame 06",
          caption: "Private intake flow linking selected homes to advisor follow-up.",
          width: "full",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-1.jpg",
          alt: "Barcelona Private Advisory - mobile screen 01",
          caption: "Mobile bilingual entry with advisory framing.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-2.jpg",
          alt: "Barcelona Private Advisory - mobile screen 02",
          caption: "District-aware mobile discovery with calm filtering.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-3.jpg",
          alt: "Barcelona Private Advisory - mobile screen 03",
          caption: "Saved shortlist actions on mobile: compare, remove, clear, and share.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-4.jpg",
          alt: "Barcelona Private Advisory - mobile screen 04",
          caption: "Mobile gallery and lightbox for quick visual comparison.",
          width: "window",
        },
        {
          kind: "video",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/video/bcn-advisory-video.mp4",
          poster: "/cases/bcn-advisory/desktop/bcn-advisory-6.jpg",
          alt: "Barcelona Private Advisory - walkthrough video",
          caption: "Motion walkthrough of shortlist, lightbox, and intake navigation flow.",
          width: "full",
          controls: true,
        },
      ],
      problem:
        "Most real-estate websites default to volume, making discovery feel transactional instead of guided.",
      approach:
        "Reframed as an advisory product surface: shortlist-first, district-aware, bilingual EN/ES, and centered on considered private intake.",
      outcome:
        "Near-production bilingual demo spanning home, search, property, district, about, and intake surfaces with shortlist state and deploy-ready front-end structure.",
      clarity:
        "Fewer, better decisions through calmer browsing rhythm and district context.",
      motion:
        "Subtle transitions guide attention without turning the advisory flow into spectacle.",
      build:
        "Astro, TypeScript, Tailwind, React islands, Motion, and Cloudflare Pages, structured to scale toward CMS, CRM, and live inventory.",
      notes:
        "Project framing\n- Premium bilingual real-estate advisory demo for Spain Costas.\n\nWhy advisory instead of catalog\n- Positioned as private advisory product, not a mass listings portal.\n\nCore systems\n- Shortlist-first browsing, district/neighborhood lens, comparison flow, gallery/lightbox, and private intake.\n\nLanguages\n- Bilingual EN/ES structure across navigation and key client surfaces.\n\nExtension path\n- Prepared to scale toward CMS, CRM, and live inventory integration.",
      credits: [
        { label: "Role", value: "UX / UI / Front-end" },
        { label: "Stack", value: "React / TypeScript / Motion" },
        { label: "Status", value: "Shipped" },
      ],
      links: [
        {
          label: "Live site",
          href: "https://barcelona-private-advisory.pages.dev/",
        },
      ],
    },
  },
  {
    slug: "fluid-exhibition",
    code: "F-05",
    index: "05",
    title: "FLUID",
    year: "2025",
    tagline:
      "Premium multilingual exhibition microsite with QR-driven artist pages and a unified digital identity for a real art event.",
    roleLabel: "Creative Dev / Front-end",
    stackLabel: "Astro / React / TypeScript",
    statusLabel: "Shipped",
    statusKind: "shipped",
    statusNote:
      "Public exhibition-ready microsite built for a real collaborative art show, with QR-driven artist access and multilingual structure.",
    completeness: "full",
    archiveCategory: "creators-culture",
    poster: {
      src: "/cases/fluid-exhibition/desktop/fluid-hero.jpg",
      alt: "FLUID exhibition microsite poster",
    },
    coverTone: "dark",
    coverFocus: "center",
    content: {
      summary:
        "Premium multilingual exhibition microsite for a real collaborative art show. Built around QR-driven artist pages, the project combines custom fluid motion, typography-first UI, and a structured digital layer for exhibition navigation and artist storytelling.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/fluid-exhibition/video/fluid-video.mp4",
        poster: "/cases/fluid-exhibition/desktop/fluid-hero.jpg",
        alt: "FLUID - exhibition walkthrough video",
        caption:
          "Walkthrough of the exhibition layer, artist pages, and fluid motion atmosphere.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/fluid-exhibition/desktop/fluid-hero.jpg",
          alt: "FLUID - desktop hero frame",
          caption:
            "Exhibition landing page with fluid visual identity and QR-oriented entry framing.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/fluid-exhibition/desktop/fluid-1.jpg",
          alt: "FLUID - desktop frame 01",
          caption:
            "Artist system laid out as a structured exhibition layer instead of a generic event page.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/fluid-exhibition/desktop/fluid-2.jpg",
          alt: "FLUID - desktop frame 02",
          caption:
            "Artist profile surface connected to the wider exhibition context.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/fluid-exhibition/desktop/fluid-3.jpg",
          alt: "FLUID - desktop frame 03",
          caption:
            "Content-driven information blocks balancing artwork context, artist data, and navigation clarity.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-1.jpg",
          alt: "FLUID - mobile frame 01",
          caption:
            "Mobile exhibition entry designed as a calm QR-access landing surface.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-2.jpg",
          alt: "FLUID - mobile frame 02",
          caption:
            "Mobile exhibition page carrying the same fluid identity in a compact format.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-3.jpg",
          alt: "FLUID - mobile frame 03",
          caption:
            "Artist listing and profile access optimized for quick scan-to-context behavior.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-4.jpg",
          alt: "FLUID - mobile frame 04",
          caption:
            "Individual artist page preserving exhibition identity while exposing artist-specific data.",
          width: "window",
        },
      ],
      problem:
        "The exhibition needed a digital system that could give each artist a direct QR entry point, preserve the context of the event, work across multiple languages, and still feel premium rather than template-like.",
      approach:
        "Built the microsite around artist pages as the main entry surface, then kept the exhibition layer visible through navigation, event framing, venue context, and a shared fluid motion language.",
      outcome:
        "Shipped a public exhibition-ready microsite that connects physical QR access, multilingual artist information, and a unified digital identity for a real cultural event.",
      clarity:
        "The system reduces friction by letting visitors scan directly to the relevant artist while still retaining the larger exhibition context.",
      motion:
        "Custom fluid atmosphere and controlled transitions create a reflective exhibition layer without overwhelming content readability.",
      build:
        "Astro, React islands, TypeScript, Tailwind CSS, locale-based content structure, and Cloudflare Pages deployment.",
      notes:
        "Project framing\n- Premium QR exhibition microsite for a real collaborative art event.\n\nCore logic\n- QR-driven artist-page architecture where each artist gets a direct entry surface.\n\nStructure\n- Exhibition landing page, multilingual CA / ES / EN setup, artist pages, venue/map context, and reusable content blocks.\n\nVisual direction\n- Dark reflective environment, fluid luminous substance, glass-like panels, and typography-first hierarchy.\n\nConstraint set\n- Built under exhibition timing pressure, uneven source materials, multilingual needs, and the requirement to stay light but still atmospherically strong.\n\nWhat this case demonstrates\n- Premium cultural web system thinking, QR-based user flow design, multilingual content structure, motion atmosphere, and deploy-ready front-end implementation.",
      credits: [
        { label: "Role", value: "Creative Developer / Front-end Systems Builder" },
        { label: "Stack", value: "Astro / React / TypeScript / Tailwind" },
        { label: "Status", value: "Shipped" },
      ],
      links: [
        {
          label: "Live site",
          href: "https://fluidqr.pages.dev",
        },
      ],
    },
  },
    {
      slug: "form-index",
    code: "FI-06",
    index: "06",
    title: "FORM INDEX",
    year: "2026",
    tagline:
      "Awards-style editorial web experience with signature scroll choreography.",
    roleLabel: "Creative Developer / Motion UI",
    stackLabel: "Vite / React / TypeScript",
    statusLabel: "Shipped",
    statusKind: "shipped",
    statusNote:
      "Public live front-end case focused on editorial restraint, sticky-stage composition, and signature smoothness.",
    completeness: "full",
    archiveCategory: "creators-culture",
    poster: {
      src: "/cases/form-index/desktop/fr-hero.jpg",
      alt: "FORM INDEX poster cover",
    },
    coverTone: "light",
    coverFocus: "center",
    content: {
      summary:
        "FORM INDEX is a premium interactive web case built around quiet futurism, editorial composition, and ultra-smooth scroll-driven transitions. It treats motion, typography, and layout as one directed front-end system.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/form-index/video/fr-video.mp4",
        poster: "/cases/form-index/desktop/fr-hero.jpg",
        alt: "FORM INDEX walkthrough video",
        caption:
          "Awards-style editorial entry built around quiet futurism, spacing precision, and controlled scroll choreography.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-hero.jpg",
          alt: "FORM INDEX - desktop hero frame",
          caption:
            "Hero surface that frames the system through editorial restraint, calm hierarchy, and controlled image rhythm.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-1.jpg",
          alt: "FORM INDEX - desktop frame 01",
          caption:
            "Sticky-stage layout with controlled reveal timing and quiet visual hierarchy.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-2.jpg",
          alt: "FORM INDEX - desktop frame 02",
          caption:
            "Campaign-system surface balancing photography, editorial spacing, and premium pacing.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-3.jpg",
          alt: "FORM INDEX - desktop frame 03",
          caption:
            "Scroll-driven transition state expressed through spacing, sequence, and visual calm.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-4.jpg",
          alt: "FORM INDEX - desktop frame 04",
          caption:
            "Surface studies presented as part of the editorial rhythm rather than decorative filler.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-5.jpg",
          alt: "FORM INDEX - desktop frame 05",
          caption:
            "Premium editorial spacing and quiet visual hierarchy across grouped image content.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-6.jpg",
          alt: "FORM INDEX - desktop frame 06",
          caption:
            "Product surface built around object focus, clean spacing, and understated presentation.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-7.jpg",
          alt: "FORM INDEX - desktop frame 07",
          caption:
            "Section progress translated into structured product flow and controlled emphasis.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-8.jpg",
          alt: "FORM INDEX - desktop frame 08",
          caption:
            "Lookbook volumes treated as a premium content surface with calm typographic support.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-9.jpg",
          alt: "FORM INDEX - desktop frame 09",
          caption:
            "Selected pieces view showing catalog rhythm, controlled reveal, and clean visual grouping.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-1.jpg",
          alt: "FORM INDEX - mobile frame 01",
          caption:
            "Mobile landing surface preserving the same calm editorial hierarchy in a compact format.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-2.jpg",
          alt: "FORM INDEX - mobile frame 02",
          caption:
            "Surface studies adapted to mobile without losing clarity, spacing, or pacing.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-3.jpg",
          alt: "FORM INDEX - mobile frame 03",
          caption:
            "Lookbook volume presentation translated into a compact phone-first composition.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-4.jpg",
          alt: "FORM INDEX - mobile frame 04",
          caption:
            "Selection drawer and product flow showing clean UI behavior on smaller screens.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-5.jpg",
          alt: "FORM INDEX - mobile frame 05",
          caption:
            "Image-led mobile sequencing that keeps the system quiet, readable, and premium.",
          width: "window",
        },
      ],
      problem:
        "The main challenge was to create a digital experience that feels alive and cinematic, but still restrained. Scrolling had to do more than move content: it needed to gradually reveal structure, emphasis, and progression without turning the interface noisy or effect-driven.",
      approach:
        "FORM INDEX was structured as a scroll-driven stage system with sticky composition, section-aware progress logic, active-state transitions, and carefully tuned motion behavior. Instead of abrupt jumps, opacity, blur, scale, and progression cues work together as one authored rhythm.",
      outcome:
        "The result is a public live front-end case that demonstrates advanced control over motion, pacing, visual hierarchy, and interaction architecture. It functions as a proof-piece for premium digital systems where design direction and engineering are inseparable.",
      clarity:
        "The interface feels expensive through pacing, spacing, typography, and controlled reveal behavior rather than through visual noise.",
      motion:
        "Signature smoothness is achieved through section-based progress logic, sticky-stage behavior, active-state transitions, and requestAnimationFrame-based smoothing that lets motion settle naturally.",
      build:
        "Built with Vite, React, TypeScript, Tailwind CSS v4, and Motion, using section progress logic, sticky stage architecture, and premium motion polish.",
      notes:
        "Project framing\n- Premium interactive editorial web case with awards-style restraint, quiet futurism, and motion precision.\n\nCore logic\n- Scroll-driven stage experience where motion, typography, and layout behave as one directed system.\n\nThe challenge\n- Build a site that feels curated and high-end without becoming noisy, overloaded, or effect-driven.\n- Solve the deeper interaction problem: how sections become active, how progress is communicated, and how transitions stay smooth even when scrolling stops.\n\nTechnical decisions\n- Sticky stage as the core layout engine.\n- Section progress as a real interaction layer.\n- requestAnimationFrame smoothing for signature smoothness.\n- Active-section hysteresis for transition stability.\n- Motion treated as dramaturgy, not decoration.\n\nWhy this case matters\n- It demonstrates a level of creative front-end work where layout, motion, and interaction are treated as one authored system.\n- It shows not only visual taste, but also the engineering discipline required to make premium digital experiences feel stable, smooth, and intentional.\n\nProject links\n- Live site available.\n- Repository available.\n- Business metrics not specified.",
      credits: [
        {
          label: "Role",
          value: "Creative Developer / Front-end System Designer / Motion UI Direction",
        },
        {
          label: "Stack",
          value: "Vite / React / TypeScript / Tailwind CSS v4 / Motion",
        },
        { label: "Status", value: "Shipped" },
      ],
      links: [
        {
          label: "Live site",
          href: "https://form-index.pages.dev/",
        },
        {
          label: "Repository",
          href: "https://github.com/brenychstudio/FORM-INDEX",
        },
      ],
    },
  },
  {
    slug: "arcwave-integrations",
    code: "AW-07",
    index: "07",
    title: "ARCWAVE",
    year: "2026",
    tagline:
      "Premium bilingual website concept for engineering installations.",
    roleLabel: "Creative Developer / Front-end Systems",
    stackLabel: "Astro / TypeScript / React",
    statusLabel: "Shipped",
    statusKind: "shipped",
    statusNote:
      "Deployed concept demo built as a reusable premium vertical for engineering integrators.",
    completeness: "full",
    archiveCategory: "brands",
    poster: {
      src: "/cases/arcwave-integrations/desktop/arc-hero.jpg",
      alt: "ARCWAVE Integrations poster cover",
    },
    coverTone: "light",
    coverFocus: "center",
    content: {
      summary:
        "ARCWAVE is a production-ready concept study for a premium engineering installations website. Built as a service-led bilingual system, it combines typed content architecture, detail pages, quote flow, SEO foundation, and reusable vertical thinking.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/arcwave-integrations/video/arc-video.mp4",
        poster: "/cases/arcwave-integrations/desktop/arc-hero.jpg",
        alt: "ARCWAVE walkthrough video",
        caption:
          "Premium service-site concept focused on clean architecture, bilingual clarity, and deployment-ready polish.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/desktop/arc-hero.jpg",
          alt: "ARCWAVE - desktop hero frame",
          caption:
            "Homepage framing built around service clarity, premium restraint, and a technically credible surface.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/desktop/arc-1.jpg",
          alt: "ARCWAVE - desktop frame 01",
          caption:
            "Service-led homepage architecture presenting engineering offers without corporate clutter.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/desktop/arc-2.jpg",
          alt: "ARCWAVE - desktop frame 02",
          caption:
            "Clean workflow section designed to support trust, process clarity, and conversion readiness.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/desktop/arc-3.jpg",
          alt: "ARCWAVE - desktop frame 03",
          caption:
            "Service detail view combining technical precision, readable structure, and premium spacing.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/desktop/arc-4.jpg",
          alt: "ARCWAVE - desktop frame 04",
          caption:
            "Documentation and handover surface showing how support and delivery are framed as part of the product.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/desktop/arc-5.jpg",
          alt: "ARCWAVE - desktop frame 05",
          caption:
            "Quote flow with clean field hierarchy, service specificity, and production-ready form behavior.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/mobile/arc-mb-1.jpg",
          alt: "ARCWAVE - mobile frame 01",
          caption:
            "Mobile landing surface preserving premium clarity and service-first structure.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/mobile/arc-mb-2.jpg",
          alt: "ARCWAVE - mobile frame 02",
          caption:
            "Mobile service catalog adapted into a clear card system with strong hierarchy.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/mobile/arc-mb-3.jpg",
          alt: "ARCWAVE - mobile frame 03",
          caption:
            "Documentation and handover information translated into a calm, readable mobile layout.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/mobile/arc-mb-4.jpg",
          alt: "ARCWAVE - mobile frame 04",
          caption:
            "Mobile quote form with service-led structure, clean spacing, and practical conversion flow.",
          width: "window",
        },
      ],
      problem:
        "The challenge was to create a premium website for an engineering service business without falling into generic corporate patterns, visual clutter, or inflated claims. The site had to stay bilingual, service-led, technically clean, and deploy-ready.",
      approach:
        "ARCWAVE was built around a typed services architecture, separate EN/ES content layers, reusable page components, redirect-safe restructuring, and a quote form that stays stable across transitions. The design direction focused on restraint, readability, and production discipline.",
      outcome:
        "The final result is a deployed concept demo that works both as a strong portfolio case and as a reusable premium website template for similar engineering integrators.",
      clarity:
        "The project demonstrates how a complex service vertical can be presented through a clean, service-first information architecture instead of a noisy business-site pattern.",
      motion:
        "Interaction stays controlled and subtle, with transitions polished to avoid flash and preserve a premium, technically credible feel.",
      build:
        "Astro, TypeScript, React islands, Astro View Transitions, typed content architecture, bilingual route system, Cloudflare Pages deployment, and GitHub-based delivery.",
      notes:
        "Project framing\n- Premium bilingual concept website for engineering installations.\n- Built as a reusable vertical system and deployed as a portfolio/demo asset.\n\nCore logic\n- Service-led information architecture instead of a generic 'about company' site.\n- Full EN/ES route parity and localized content structure.\n- Quote/contact flow with preselect logic and anti-spam protection.\n- Redirect-safe restructuring after service model changes.\n\nWhy this case matters\n- Shows production-grade service-site delivery, bilingual architecture, quote flow discipline, and reusable vertical thinking.\n- Demonstrates the ability to convert abandoned client work into a polished portfolio/business asset without losing deployment quality.\n\nImportant framing\n- Deployed concept demo.\n- Not presented as a live client success story.\n- No business metrics claimed.",
      credits: [
        {
          label: "Role",
          value: "Creative Developer / Front-end Architect / UI Systems Builder",
        },
        {
          label: "Stack",
          value: "Astro / TypeScript / React / Cloudflare Pages",
        },
        { label: "Status", value: "Shipped" },
      ],
      links: [
        {
          label: "Live site",
          href: "https://arcwave-integrations.pages.dev/",
        },
        {
          label: "Repository",
          href: "https://github.com/brenychstudio/arcwave-integrations",
        },
      ],
    },
  },
  {
    slug: "casa-nube",
    code: "CN-08",
    index: "08",
    title: "Casa Nube",
    year: "2026",
    tagline: "Premium multilingual café website concept for Barcelona.",
    roleLabel: "Concept / UX / Front-end",
    stackLabel: "Next.js / next-intl / Tailwind",
    statusLabel: "Shipped",
    statusKind: "shipped",
    statusNote:
      "Public live hospitality website demo built as a reusable premium café vertical.",
    completeness: "full",
    archiveCategory: "hospitality",
    poster: {
      src: "/cases/casa-nube/desktop/casa-hero.png",
      alt: "Casa Nube poster cover",
    },
    coverTone: "light",
    coverFocus: "center",
    content: {
      summary:
        "Casa Nube is a premium multilingual café website concept for Barcelona. Built as a hospitality vertical demo, it combines editorial atmosphere, web-native menu structure, visit utility, subtle motion, responsive polish, and Cloudflare deployment.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/casa-nube/video/casa-video.mp4",
        poster: "/cases/casa-nube/desktop/casa-hero.png",
        alt: "Casa Nube walkthrough video",
        caption:
          "Premium hospitality website demo combining atmosphere, menu clarity, visit utility, and multilingual structure.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-hero.png",
          alt: "Casa Nube - desktop hero frame",
          caption:
            "Homepage hero presenting the café as a warm digital façade with clear visitor actions.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-1.png",
          alt: "Casa Nube - desktop frame 01",
          caption:
            "Menu preview and space section designed as an editorial hospitality surface rather than a generic café template.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-2.png",
          alt: "Casa Nube - desktop frame 02",
          caption:
            "Space and light section using café photography, warm rhythm, and soft editorial grouping.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-3.png",
          alt: "Casa Nube - desktop frame 03",
          caption:
            "Web-native menu page replacing PDF-first restaurant UX with readable structured content.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-4.png",
          alt: "Casa Nube - desktop frame 04",
          caption:
            "Visit page focused on opening rhythm, reservation logic, and practical visitor decisions.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-5.png",
          alt: "Casa Nube - desktop frame 05",
          caption:
            "Location and planning surface with clear contact paths, directions, and practical notes.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-1.jpg",
          alt: "Casa Nube - mobile frame 01",
          caption:
            "Mobile homepage preserving editorial warmth while keeping key café actions close.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-2.jpg",
          alt: "Casa Nube - mobile frame 02",
          caption:
            "Mobile menu and hospitality content adapted into a calm, compact flow.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-3.jpg",
          alt: "Casa Nube - mobile frame 03",
          caption:
            "Mobile menu page designed as structured web content with clear category rhythm.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-4.jpg",
          alt: "Casa Nube - mobile frame 04",
          caption:
            "Mobile visit page giving users quick access to hours, location, and practical planning details.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-5.jpg",
          alt: "Casa Nube - mobile frame 05",
          caption:
            "Sticky mobile action flow for menu, reservation, and maps-oriented visitor behavior.",
          width: "window",
        },
      ],
      problem:
        "Most café websites are either visually generic or operationally weak. They often rely on PDF menus, unclear opening hours, overloaded food photography, weak mobile navigation, or disconnected booking and contact flows.",
      approach:
        "Casa Nube was designed as an editorial one-page and light multi-page hybrid. The homepage builds atmosphere, while dedicated menu and visit pages provide practical utility without overloading the main experience.",
      outcome:
        "The result is a deployed premium hospitality website demo that works as a polished portfolio case and a reusable vertical framework for cafés, brunch places, boutique bakeries, and small restaurant concepts.",
      clarity:
        "The site gives visitors fast access to menu, reservation, maps, opening rhythm, and location details while preserving a refined hospitality identity.",
      motion:
        "Motion is intentionally soft and practical: route transitions, scroll reveal, hover lift, and footer reveal are tuned to feel premium without becoming decorative noise.",
      build:
        "Next.js App Router, TypeScript, Tailwind CSS, next-intl, static export, Cloudflare Pages deployment, multilingual routing, responsive QA, and custom Open Graph integration.",
      notes:
        "Project framing\n- Premium multilingual café website concept for Barcelona.\n- Built as a reusable hospitality vertical demo for cafés, brunch places, boutique bakeries, and small restaurant concepts.\n\nCore logic\n- Editorial homepage for atmosphere.\n- Web-native menu page instead of PDF-first UX.\n- Dedicated visit page for opening hours, reservation logic, location, maps, WhatsApp, Instagram, and practical visitor notes.\n- Multilingual ES / EN / CA structure from the foundation.\n\nThe challenge\n- Create a café website that feels premium and atmospheric while staying useful, fast, multilingual, and commercially practical.\n- Avoid generic restaurant-template behavior, overloaded food photography, unclear hours, and disconnected contact flows.\n\nUX decisions\n- Mobile-first utility for visitors arriving from Google Maps, Instagram, search, local recommendation, or QR.\n- Sticky mobile action bar for Menu / Reserve / Maps.\n- Menu structured as readable web content rather than a downloadable PDF.\n- Visit page treated as the conversion layer, not just a contact section.\n\nVisual direction\n- Off-white and limestone backgrounds.\n- Warm gray and taupe UI surfaces.\n- Muted espresso and warm charcoal accents.\n- Editorial café photography.\n- Rounded cards, soft shadows, calm page rhythm, and restrained typography.\n\nWhy this case matters\n- It proves the ability to design and implement a complete premium hospitality website from concept to deployment.\n- It demonstrates multilingual architecture, mobile-first conversion UX, responsive QA, visual polish, and productization of a local business vertical.\n\nProject links\n- Live site available.\n- Repository available.\n- No real client metrics, booking integration, or CMS claimed.",
      credits: [
        {
          label: "Role",
          value:
            "Concept / UX Direction / Visual System / Front-end Implementation / Responsive QA / Deployment",
        },
        {
          label: "Stack",
          value:
            "Next.js / TypeScript / Tailwind CSS / next-intl / Cloudflare Pages",
        },
        { label: "Status", value: "Shipped" },
      ],
      links: [
        {
          label: "Live site",
          href: "https://casa-nube.pages.dev/es/",
        },
        {
          label: "Repository",
          href: "https://github.com/brenychstudio/casa-nube",
        },
      ],
    },
  },
  {
    slug: "print-border-studio",
    code: "PB-09",
    index: "09",
    title: "Print Border Studio",
    year: "2026",
    tagline:
      "Desktop-first fine-art print preparation tool with museum-style border control.",
    roleLabel: "Product UX / Front-end / Tooling",
    stackLabel: "React / TypeScript / Canvas",
    statusLabel: "Shipped",
    statusKind: "shipped",
    statusNote:
      "Public live product tool focused on print preparation, border control, preview accuracy, and export workflow.",
    completeness: "full",
    archiveCategory: "software-product",
    poster: {
      src: "/cases/print-border-studio/desktop/psb-hero.png",
      alt: "Print Border Studio poster cover",
    },
    coverTone: "dark",
    coverFocus: "center",
    content: {
      summary:
        "Print Border Studio is a desktop-first web tool for preparing fine-art prints with controlled museum-style borders, precise visual preview, saved presets, artwork queue logic, and export-oriented workflow.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/print-border-studio/video/psb-video.mp4",
        poster: "/cases/print-border-studio/desktop/psb-hero.png",
        alt: "Print Border Studio walkthrough video",
        caption:
          "Desktop-first print preparation interface built around border precision, preview clarity, and export-ready workflow.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-hero.png",
          alt: "Print Border Studio - desktop hero frame",
          caption:
            "Main product surface combining artwork preview, border controls, queue logic, and export-ready interface structure.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-1.png",
          alt: "Print Border Studio - desktop frame 01",
          caption:
            "Light interface state showing precise artwork placement, margin controls, and print preparation settings.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-2.png",
          alt: "Print Border Studio - desktop frame 02",
          caption:
            "Dark workspace mode designed for focused print review and controlled visual judgment.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-3.png",
          alt: "Print Border Studio - desktop frame 03",
          caption:
            "Artwork preparation flow with border settings, visual balance, and export-oriented controls.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-4.png",
          alt: "Print Border Studio - desktop frame 04",
          caption:
            "Preview and inspection state supporting careful evaluation before final export.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-5.png",
          alt: "Print Border Studio - desktop frame 05",
          caption:
            "Museum-style print framing surface focused on proportion, border rhythm, and presentation control.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb6.png",
          alt: "Print Border Studio - desktop frame 06",
          caption:
            "Light-mode production surface showing the same tool logic in a clean, gallery-oriented interface.",
          width: "window",
        },
      ],
      problem:
        "Preparing fine-art prints often requires jumping between design tools, manual margin calculations, inconsistent previews, and export settings that are not designed for artists or photographers. The workflow becomes slow, fragile, and difficult to repeat across multiple artworks.",
      approach:
        "Print Border Studio was designed as a focused desktop-first production tool. The interface centers on artwork preview, museum-style border control, saved preparation logic, queue-based workflow, and export clarity instead of generic image editing.",
      outcome:
        "The result is a live web product that turns print preparation into a dedicated workflow surface: precise, repeatable, visually calm, and easier to use for fine-art print presentation.",
      clarity:
        "The product reduces the print-preparation process to the decisions that matter most: artwork, format, border, preview, queue, and export.",
      motion:
        "Motion is restrained and functional, supporting workspace focus, modal inspection, state changes, and tool feedback without distracting from print judgment.",
      build:
        "Built with React, TypeScript, canvas-oriented preview logic, local workflow state, export preparation, and a desktop-first interface optimized for careful visual work.",
      notes:
        "Project framing\n- Desktop-first web product for fine-art print preparation.\n- Built for artists, photographers, and print-focused workflows where border precision and presentation control matter.\n\nCore logic\n- Museum-style border preparation.\n- Artwork preview and inspection.\n- Queue-based workflow for multiple images.\n- Export-oriented interface structure.\n- Light and dark workspace surfaces.\n\nThe challenge\n- Replace a fragmented manual workflow with a focused tool that feels precise, calm, and repeatable.\n- Keep the interface useful and technical without making it feel like generic production software.\n\nUX decisions\n- Desktop-first layout because print preparation requires space, precision, and visual judgment.\n- Controls stay close to the artwork preview.\n- The interface prioritizes proportions, margin logic, export preparation, and repeatable workflow over decorative UI.\n- No mobile screenshots are shown at this stage because the current product is intentionally desktop-first.\n\nWhy this case matters\n- It demonstrates product thinking beyond marketing websites.\n- It shows the ability to design and build a practical creative tool with real workflow logic, visual precision, and export-focused interaction.\n- It expands the portfolio toward creator tools, production systems, and commercially useful web applications.\n\nProject links\n- Live site available.\n- Repository available.\n- Mobile version not claimed in this case.",
      credits: [
        {
          label: "Role",
          value:
            "Product UX / Front-end Implementation / Interface System / Tool Workflow Design",
        },
        {
          label: "Stack",
          value: "React / TypeScript / Canvas / Cloudflare Pages",
        },
        { label: "Status", value: "Shipped" },
      ],
      links: [
        {
          label: "Live site",
          href: "https://print-border-studio.pages.dev/",
        },
        {
          label: "Repository",
          href: "https://github.com/brenychstudio/print-border-studio",
        },
      ],
    },
  },
];
