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
  completeness?: CaseCompleteness;
  archiveCategory: ArchiveCategoryKey;
  poster: { src: string; alt: string };
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
    completeness: "preview",
    archiveCategory: "software-product",
    poster: { src: "/cases/whisper/poster.jpg", alt: "Whisper poster" },
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
    completeness: "preview",
    archiveCategory: "creators-culture",
    poster: { src: "/cases/gallery/poster.jpg", alt: "Gallery poster" },
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
    completeness: "in-progress",
    archiveCategory: "creators-culture",
    poster: { src: "/cases/musician/poster.jpg", alt: "Musician poster" },
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
    completeness: "full",
    archiveCategory: "advisory-property",
    poster: {
      src: "/cases/bcn-advisory/desktop/bcn-advisory-1.jpg",
      alt: "Barcelona Private Advisory poster",
    },
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
];
