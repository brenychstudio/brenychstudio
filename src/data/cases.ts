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
    slug: "bcn-advisory",
    code: "BA-01",
    index: "01",
    title: "Barcelona Private Advisory",
    year: "2026",
    tagline: "From listing portal to premium advisory product.",
    roleLabel: "Product Direction / UX / Front-end",
    stackLabel: "Astro / TypeScript / React Islands",
    statusLabel: "Sales-ready demo",
    statusKind: "shipped",
    statusNote:
      "Client-facing premium real-estate advisory prototype with bilingual routing, curated shortlist logic, district lens, private intake, and Cloudflare deployment.",
    completeness: "full",
    archiveCategory: "advisory-property",
    poster: {
      src: "/cases/bcn-advisory/desktop/bcn-advisory-hero.png",
      alt: "Barcelona Private Advisory poster cover",
    },
    coverTone: "light",
    coverFocus: "center",
    content: {
      summary:
        "Barcelona Private Advisory is a premium bilingual real-estate advisory demo built for Spain Costas. Instead of another template-style listing portal, the project reframes the experience around curated shortlist logic, district fit, private intake, property showpieces, and calm editorial presentation.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/bcn-advisory/video/bcn-advisory-video.mp4",
        poster: "/cases/bcn-advisory/desktop/bcn-advisory-hero.png",
        alt: "Barcelona Private Advisory walkthrough video",
        caption:
          "Premium advisory demo reframing real-estate browsing into a curated, Barcelona-first buyer journey.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-hero.png",
          alt: "Barcelona Private Advisory - desktop hero frame",
          caption:
            "Homepage hero positioning Spain Costas through a calmer, more selective advisory-first property experience.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-1.png",
          alt: "Barcelona Private Advisory - desktop frame 01",
          caption:
            "Search surface built around curated property discovery instead of a noisy mass-listing portal pattern.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-2.png",
          alt: "Barcelona Private Advisory - desktop frame 02",
          caption:
            "District lens section connecting property decisions with neighborhood rhythm, lifestyle fit, and Barcelona context.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-3.png",
          alt: "Barcelona Private Advisory - desktop frame 03",
          caption:
            "Curated listing grid using warm editorial pacing and restrained UI density to preserve premium perception.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-4.png",
          alt: "Barcelona Private Advisory - desktop frame 04",
          caption:
            "Shortlist drawer transforming saved properties into a more structured advisory selection flow.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-5.jpg",
          alt: "Barcelona Private Advisory - desktop frame 05",
          caption:
            "Property showpiece page with gallery, descriptions, highlights, and product-style information hierarchy.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/desktop/bcn-advisory-6.jpg",
          alt: "Barcelona Private Advisory - desktop frame 06",
          caption:
            "Lightbox experience designed to make property review feel calmer, more focused, and more premium.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-1.jpg",
          alt: "Barcelona Private Advisory - mobile frame 01",
          caption:
            "Mobile homepage preserving the advisory-first message, curated shortlist promise, and premium property framing.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-2.jpg",
          alt: "Barcelona Private Advisory - mobile frame 02",
          caption:
            "Mobile property card flow focused on saved selections, calm browsing, and shortlist-first decision support.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-3.jpg",
          alt: "Barcelona Private Advisory - mobile frame 03",
          caption:
            "Mobile shortlist drawer turning saved apartments into a more structured advisory selection.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-4.jpg",
          alt: "Barcelona Private Advisory - mobile frame 04",
          caption:
            "Mobile property lightbox designed for focused review, visual confidence, and premium buyer pacing.",
          width: "window",
        },
      ],
      problem:
        "Traditional real-estate websites often look and behave like listing portals: many cards, many filters, heavy visual noise, and little sense of advisory value. This weakens premium perception and makes even a strong service feel like a template catalog.",
      approach:
        "The project was reframed as a Barcelona-first advisory product. Instead of pushing endless browsing, the experience centers on curated shortlist logic, district fit, property showpieces, private intake, bilingual UX, and a calmer decision journey.",
      outcome:
        "The result is a deployed sales-ready premium demo that can work as a client-facing product prototype for Spain Costas: visually elevated, commercially understandable, bilingual, and built on a production-shaped Astro foundation.",
      clarity:
        "The strongest product decision was to move the experience from quantity to fit. The user is guided toward curated selection, neighborhood logic, and private advisory contact rather than generic property browsing.",
      motion:
        "Motion is controlled and minimal, supporting editorial pacing, shortlist interactions, gallery review, and a calmer premium real-estate rhythm without adding unnecessary interface noise.",
      build:
        "Built with Astro, TypeScript, Tailwind CSS, React islands, Motion, bilingual EN / ES routing, shortlist state, lightbox interaction, SEO foundations, GitHub, and Cloudflare Pages deployment.",
      notes:
        "Project framing\n- Premium bilingual real-estate advisory demo for Spain Costas.\n- Built as a sales-ready prototype / client-facing demo, not as a fully launched inventory-backed production platform.\n\nCore logic\n- Reframes real estate from listing portal to premium advisory product.\n- Uses curated shortlist logic instead of mass browsing.\n- Adds district lens / neighborhood fit as part of the decision model.\n- Turns contact into private intake rather than a generic form.\n- Presents property pages as showpieces with gallery, descriptions, highlights, and lightbox review.\n\nWhat was implemented\n- Homepage with premium editorial framing.\n- Search page with advisory-oriented filtering.\n- Property pages with gallery, lightbox, descriptions, and product-style hierarchy.\n- District pages with Barcelona Lens logic.\n- About page rewritten as premium editorial explanation.\n- Contact page transformed into private buyer intake.\n- Shortlist logic and shareable selection flow.\n- Bilingual EN / ES routing.\n- WhatsApp, email, and copy brief actions.\n- SEO and deployment pack.\n- GitHub and Cloudflare Pages deployment.\n\nVisual direction\n- Quiet premium / editorial real-estate language.\n- Light warm palette, restrained typography, calm composition, controlled motion, and low interface noise.\n- The goal is a more expensive feeling of selection, not a heavier catalog experience.\n\nUX / product value\n- User receives a more selective buyer journey instead of an endless listing stream.\n- District logic becomes part of the property decision.\n- Shortlist becomes a real product element, not just a decorative saved button.\n- Private intake helps turn casual interest into a more structured advisory request.\n\nTechnical architecture\n- Astro static foundation for speed and SEO stability.\n- React islands only where interaction is required: shortlist state, search intake, lightbox, private intake actions, and selected mobile interaction logic.\n- This keeps the site lighter while preserving product-level interaction.\n\nCurrent honest status\n- Strong near-final demo / sales-ready advisory prototype.\n- Not positioned as a fully launched client production system with live inventory backend.\n- Some production/client details such as final contact data or inventory backend would need to be connected in a real client release.\n\nWhy this case matters\n- Demonstrates commercial product thinking, bilingual capability, premium real-estate UX, editorial visual polish, Astro architecture, interactive React islands, shortlist logic, SEO readiness, and deploy-ready execution.\n- It shows the ability to reposition a business category from template website to premium advisory experience.\n\nProject links\n- Live site available.\n- Repository available.\n- Sales-ready prototype; no real inventory backend or production business metrics claimed.",
      credits: [
        {
          label: "Role",
          value:
            "Product Direction / UX Architecture / Visual Polish / Front-end Implementation / Advisory Flow Design",
        },
        {
          label: "Stack",
          value:
            "Astro / TypeScript / Tailwind CSS / React Islands / Motion / Cloudflare Pages",
        },
        { label: "Status", value: "Sales-ready demo" },
        { label: "Languages", value: "EN / ES" },
      ],
      links: [
        {
          label: "Live site",
          href: "https://barcelona-private-advisory.pages.dev/",
        },
        {
          label: "Repository",
          href: "https://github.com/brenychstudio/Barcelona-Private-Advisory",
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
    {
      slug: "house-of-lune",
      code: "HL-10",
      index: "10",
      title: "House of Lune",
      year: "2026",
      tagline: "A cinematic digital maison for high jewelry.",
      roleLabel: "Creative Developer / Front-end System Builder",
      stackLabel: "Next.js / TypeScript / Motion",
      statusLabel: "Shipped",
      statusKind: "shipped",
      statusNote:
        "Production-oriented luxury jewelry vertical demo with multilingual routing, dynamic product pages, private inquiry UX, and Cloudflare Workers deployment.",
      completeness: "full",
      archiveCategory: "brands",
      poster: {
        src: "/cases/house-of-lune/desktop/house-of-lune-hero.png",
        alt: "House of Lune poster cover",
      },
      coverTone: "dark",
      coverFocus: "center",
      content: {
        summary:
          "House of Lune is a production-oriented premium jewelry website concept built as a cinematic digital maison rather than a conventional e-commerce storefront. The project combines dark luxury art direction, restrained motion, multilingual routing, dynamic product pages, private inquiry UX, and Cloudflare Workers deployment.",
        hero: {
          kind: "video",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/house-of-lune/video/house-of-lune-video.mp4",
          poster: "/cases/house-of-lune/desktop/house-of-lune-hero.png",
          alt: "House of Lune walkthrough video",
          caption:
            "Cinematic digital maison built around dark luxury, object-led presentation, editorial motion, and private-client conversion.",
          width: "full",
          controls: true,
        },
        frames: [
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-hero.png",
            alt: "House of Lune - desktop hero frame",
            caption:
              "Homepage hero presenting the maison through dark cinematic staging, controlled light, and private luxury atmosphere.",
            width: "full",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-1.png",
            alt: "House of Lune - desktop frame 01",
            caption:
              "Selected signatures section presenting jewelry pieces as rare objects rather than catalog inventory.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-2.png",
            alt: "House of Lune - desktop frame 02",
            caption:
              "Maison storytelling surface using dark restraint, object imagery, and editorial hierarchy.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-3.png",
            alt: "House of Lune - desktop frame 03",
            caption:
              "Collection presentation designed as a private salon system rather than a dense product grid.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-4.png",
            alt: "House of Lune - desktop frame 04",
            caption:
              "Craftsmanship page framing atelier process, material culture, and premium editorial rhythm.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-5.png",
            alt: "House of Lune - desktop frame 05",
            caption:
              "Private inquiry moment built around appointment language and restrained conversion cues.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-6.png",
            alt: "House of Lune - desktop frame 06",
            caption:
              "Journal-style editorial layer positioning the maison as a living brand world rather than a static store.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-7.png",
            alt: "House of Lune - desktop frame 07",
            caption:
              "Contact and private inquiry flow with calm form structure, material notes, and salon-like framing.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-1.jpg",
            alt: "House of Lune - mobile frame 01",
            caption:
              "Mobile collection surface preserving dark luxury, object focus, and restrained interface rhythm.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-2.jpg",
            alt: "House of Lune - mobile frame 02",
            caption:
              "Mobile navigation translated into a compact private-maison menu structure.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-3.jpg",
            alt: "House of Lune - mobile frame 03",
            caption:
              "Mobile journal surface extending the brand through campaigns, notes, and editorial storytelling.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-4.jpg",
            alt: "House of Lune - mobile frame 04",
            caption:
              "Mobile maison page presenting brand philosophy, intimacy, and material atmosphere.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-5.jpg",
            alt: "House of Lune - mobile frame 05",
            caption:
              "Mobile private inquiry form focused on appointment-based luxury conversion instead of checkout-first UX.",
            width: "window",
          },
        ],
        problem:
          "Luxury jewelry websites often fall into two weak patterns: generic e-commerce catalogs or decorative premium templates that feel visually loud but commercially shallow. The challenge was to create a private, cinematic, high-end experience that communicates rarity, materiality, trust, and desire before asking users to convert.",
        approach:
          "House of Lune was built as a digital maison: a multi-page premium system with a cinematic homepage, curated collection structure, object-led product pages, atelier-inspired craftsmanship storytelling, maison philosophy, journal content, and a private inquiry pathway. Motion, typography, light, and object presentation were treated as one restrained luxury language.",
        outcome:
          "The result is a deployed premium vertical demo that demonstrates both creative direction and production engineering: a multilingual Next.js website with dynamic product pages, editorial components, metadata/OG integration, and Cloudflare Workers deployment via OpenNext.",
        clarity:
          "The project moves the experience away from product-grid logic and toward a private maison system where each piece is presented as an object of desire, not a stock item.",
        motion:
          "Motion is slow, restrained, and dramaturgical: controlled reveals, soft page transitions, image drift, hover tension, and sticky editorial rhythm support the luxury atmosphere without becoming decorative noise.",
        build:
          "Built with Next.js App Router, TypeScript, Tailwind CSS, Motion, multilingual routing, dynamic product pages, Open Graph metadata, OpenNext, and Cloudflare Workers deployment.",
        notes:
          "Project framing\n- Premium vertical demo for a fictional high-jewelry maison.\n- Built as a production-oriented website system, not a simple landing page or ecommerce template.\n\nCore logic\n- Cinematic homepage.\n- Curated collection page.\n- Dynamic product detail pages.\n- Craftsmanship narrative.\n- Maison philosophy.\n- Journal-style editorial layer.\n- Private inquiry conversion pathway.\n\nCreative direction\n- Moonlit Object Theatre: a quiet digital stage where jewelry is revealed through darkness, contour, reflection, and deliberate silence.\n- Near-black surfaces, warm ivory typography, subtle platinum accents, thin borders, spacious layout, and controlled light.\n\nThe challenge\n- Create a luxury jewelry website that does not feel like a Shopify catalog, marketplace, or generic premium template.\n- Communicate rarity, silence, materiality, and private-client intimacy through interface, motion, and visual pacing.\n\nUX decisions\n- Products are treated as artifacts, not inventory.\n- CTAs are private and conversational, not aggressive.\n- Product pages support availability requests, private viewing, and appointment-based conversion instead of buy-now logic.\n- The contact page is built around private inquiry pathways rather than a standard form-first layout.\n\nTechnical decisions\n- Next.js App Router architecture.\n- Multilingual routes: /en, /fr, /es.\n- Dynamic product pages via /[lang]/piece/[slug].\n- Content-driven product and page data.\n- Reusable editorial components.\n- Motion primitives and page transition layer.\n- Private inquiry API route foundation.\n- Open Graph image and metadata integration.\n- Cloudflare Workers deployment via OpenNext.\n\nProduction note\n- The original WebGL jewelry hero direction was refined into an image-led cinematic object chamber because the available proxy geometry did not reach the required luxury standard.\n- Premium perception was prioritized over technical demonstration.\n- Cloudflare/OpenNext runtime issues were stabilized by switching the deployment build to Webpack while keeping the Next.js architecture intact.\n\nWhy this case matters\n- It demonstrates premium art direction for luxury web, editorial front-end composition, full multi-page brand architecture, controlled motion, multilingual Next.js routing, dynamic product pages, metadata preparation, and real Cloudflare Workers deployment.\n\nProject links\n- Live site available.\n- Repository available.\n- Fictional luxury maison demo; no real client metrics claimed.",
        credits: [
          {
            label: "Role",
            value:
              "Creative Developer / Front-end System Builder / Motion System / Deployment Debugging",
          },
          {
            label: "Stack",
            value:
              "Next.js / TypeScript / Tailwind CSS / Motion / OpenNext / Cloudflare Workers",
          },
          { label: "Status", value: "Shipped" },
        ],
        links: [
          {
            label: "Live site",
            href: "https://house-of-lune.brenychinfo.workers.dev/en",
          },
          {
            label: "Repository",
            href: "https://github.com/brenychstudio/House-of-Lune",
          },
        ],
      },
    },
    {
      slug: "creatorops",
      code: "CO-11",
      index: "11",
      title: "CreatorOps",
      year: "2026",
      tagline: "A beta-ready content workflow system for creators.",
      roleLabel: "Product Strategy / UX / Front-end",
      stackLabel: "Vite / React / TypeScript",
      statusLabel: "Live beta",
      statusKind: "in_progress",
      statusNote:
        "Usable MVP prototype with end-to-end creator workflow, Smart Mix logic, ZIP export, Bio Builder, live deploy, and active product development.",
      completeness: "full",
      archiveCategory: "software-product",
      poster: {
        src: "/cases/creatorops/desktop/creatorops-hero.png",
        alt: "CreatorOps poster cover",
      },
      coverTone: "dark",
      coverFocus: "center",
      content: {
        summary:
          "CreatorOps is a premium creator workflow prototype that turns scattered visual assets into a calm publishing pipeline. The product guides users through Library, Smart Mix, Sequence, Planner, Captions, Export, and Bio Builder, producing a real downloadable content pack rather than a static dashboard preview.",
        hero: {
          kind: "video",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/creatorops/video/creatorops-video.mp4",
          poster: "/cases/creatorops/desktop/creatorops-hero.png",
          alt: "CreatorOps walkthrough video",
          caption:
            "Beta-ready creator workflow prototype with Smart Mix logic, export pipeline, and an extensible Tools layer.",
          width: "full",
          controls: true,
        },
        frames: [
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-hero.png",
            alt: "CreatorOps - desktop hero frame",
            caption:
              "Product positioning surface framing CreatorOps as a calm operating system for creators and small content teams.",
            width: "full",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-1.png",
            alt: "CreatorOps - desktop frame 01",
            caption:
              "Marketing landing surface presenting the product promise, creator outcome, and premium SaaS direction.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-2.png",
            alt: "CreatorOps - desktop frame 02",
            caption:
              "System logic section explaining the calm guardrails behind content planning and publishing decisions.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-3.png",
            alt: "CreatorOps - desktop frame 03",
            caption:
              "Creator-facing product promise translated into a clear mobile-output and publishing-pack narrative.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-4.png",
            alt: "CreatorOps - desktop frame 04",
            caption:
              "Premium landing chapter using dark product staging and restrained visual rhythm.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-5.png",
            alt: "CreatorOps - desktop frame 05",
            caption:
              "Roadmap and monetization surface showing how the prototype can expand into a larger creator workflow product.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-6.png",
            alt: "CreatorOps - desktop frame 06",
            caption:
              "Library and Smart Mix workspace where visual assets become structured content candidates.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-7.png",
            alt: "CreatorOps - desktop frame 07",
            caption:
              "Dark prototype interface showing asset selection, state-driven layout, and product-like workspace density.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-8.png",
            alt: "CreatorOps - desktop frame 08",
            caption:
              "Light workspace variation demonstrating the product system across visual modes and review contexts.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-9.png",
            alt: "CreatorOps - desktop frame 09",
            caption:
              "Smart Mix output surface turning selected assets into ranked 3x3 content directions.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-10.png",
            alt: "CreatorOps - desktop frame 10",
            caption:
              "Captions and planning workspace connecting content selection with publishing rhythm and output structure.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-11.png",
            alt: "CreatorOps - desktop frame 11",
            caption:
              "Export and tools-oriented state showing how the workflow continues beyond visual selection.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-12.png",
            alt: "CreatorOps - desktop frame 12",
            caption:
              "Bio Builder workspace combining profile fields, content grid context, generated variants, and live preview.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/desktop/creatorops-13.png",
            alt: "CreatorOps - desktop frame 13",
            caption:
              "Connected profile-building flow that extends the content pack into an Instagram-style bio and identity layer.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-1.jpg",
            alt: "CreatorOps - mobile frame 01",
            caption:
              "Mobile content grid preserving the visual logic of the publishing pack.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-2.jpg",
            alt: "CreatorOps - mobile frame 02",
            caption:
              "Mobile Smart Mix step focused on selected assets, generated candidates, and continuation flow.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-3.jpg",
            alt: "CreatorOps - mobile frame 03",
            caption:
              "Mobile sequence state showing how the selected mix becomes an ordered publishing direction.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-4.jpg",
            alt: "CreatorOps - mobile frame 04",
            caption:
              "Mobile planner state linking pack selection, rhythm, and next-step product flow.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-5.jpg",
            alt: "CreatorOps - mobile frame 05",
            caption:
              "Mobile export state with downloadable pack logic and practical output framing.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-6.jpg",
            alt: "CreatorOps - mobile frame 06",
            caption:
              "Mobile Bio Builder form for shaping handle, audience, offer, CTA, and profile direction.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-7.jpg",
            alt: "CreatorOps - mobile frame 07",
            caption:
              "Instagram-style profile preview adapting the content pack into a creator-facing public identity.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/creatorops/mobile/creatorops-mb-8.jpg",
            alt: "CreatorOps - mobile frame 08",
            caption:
              "Mobile profile and pack handoff showing how CreatorOps can expand into standalone creator tools.",
            width: "window",
          },
        ],
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
        credits: [
          {
            label: "Role",
            value:
              "Product Strategy / UX Architecture / Visual System / React + TypeScript Implementation / Export Logic / Bio Builder System",
          },
          {
            label: "Stack",
            value:
              "Vite / React / TypeScript / Tailwind CSS / React Router / Motion / JSZip / Cloudflare Pages",
          },
          { label: "Status", value: "Live beta" },
        ],
        links: [
          {
            label: "Live site",
            href: "https://creatorops.pages.dev/",
          },
          {
            label: "Repository",
            href: "https://github.com/brenychstudio/CreatorOps",
          },
        ],
      },
    },
];
