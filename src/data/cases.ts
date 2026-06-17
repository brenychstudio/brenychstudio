import type { CaseCoverFocus, CaseCoverTone } from "../ui/work/caseCover.types";
import type { CaseStatusKind } from "../ui/status/status.types";
import { spanishCaseRegistryTranslations, type CaseRegistryTranslation } from "./spanishContent";

export type CaseStatus = "live" | "prototype" | "private" | "in_progress";
export type CaseCategory =
  | "Product Interface"
  | "Premium Website"
  | "Interactive Web"
  | "Immersive System"
  | "Creative Tool"
  | "Editorial / Archive"
  | "Commercial Surface";
export type CaseProofType =
  | "Live Website"
  | "Product Prototype"
  | "Case Prototype"
  | "Immersive Proof"
  | "Interface System"
  | "Internal System"
  | "Private Concept";

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

export type CaseSearchContent = {
  type: string;
  audience: string;
  problem: string;
  approach: string;
  outcome: string;
  productionFacts: string[];
  relatedServices: string[];
};

export type CaseRegistryFields = {
  category: CaseCategory;
  proofType: CaseProofType;
  status: CaseStatus;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  previewImage: string;
  ogImage: string;
  alt: string;
  ctaLabel: string;
  relatedServices?: string[];
  relatedCases?: string[];
  clientType?: string;
  stack?: string[];
  searchContent?: CaseSearchContent;
  translations?: {
    es?: CaseRegistryTranslation;
  };
};

export type CaseBase = {
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

export type Case = CaseBase & CaseRegistryFields;

const caseItems: CaseBase[] = [
  {
    slug: "aurel-eon-gt",
    code: "AE-14",
    index: "14",
    title: "AUREL EON GT",
    year: "2026",
    tagline: "Living automotive product experience for a fictional electric grand tourer.",
    roleLabel: "Concept / Creative Direction / Interaction Systems / Front-end",
    stackLabel: "Vite / React / TypeScript / Tailwind v4",
    statusLabel: "Advanced prototype",
    statusKind: "in_progress",
    statusNote:
      "Near-production fictional automotive concept case with the core visual system, interaction logic, responsive experience, media pipeline, and metadata already implemented.",
    completeness: "full",
    archiveCategory: "brands",
    poster: {
      src: "/cases/aurel-eon-gt/aurel-eon-gt-hero.webp",
      alt: "AUREL EON GT cinematic electric grand tourer hero",
    },
    coverTone: "dark",
    coverFocus: "center",
    content: {
      summary:
        "AUREL EON GT is a fictional premium electric grand tourer launch experience built as a living automotive product system. Instead of a standard car landing page, the interface moves through cinematic states: arrival, exterior, light signature, cabin, materiality, drive character, gallery archive, inspect sequence, product view, and private preview.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/aurel-eon-gt/aurel-eon-gt-video.mp4",
        poster: "/cases/aurel-eon-gt/aurel-eon-gt-video-poster.webp",
        alt: "AUREL EON GT full automotive concept walkthrough video",
        caption:
          "Full walkthrough of the fictional electric GT launch experience, moving through presence rail navigation, cinematic product states, inspect flows, gallery archive, and private preview.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-hero.webp",
          alt: "AUREL EON GT arrival hero interface",
          caption:
            "Arrival field presenting the fictional electric grand tourer as a living product surface shaped by silence, signal, and motion.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-exterior-field.webp",
          alt: "AUREL EON GT sculptural exterior field",
          caption:
            "Exterior field treats the body as a sculptural motion state rather than a static specification block.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-rear-light-signature.webp",
          alt: "AUREL EON GT rear light signature product image",
          caption:
            "Rear light signature image showing the vehicle through low-light product photography and quiet signal behavior.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-cabin-quiet.webp",
          alt: "AUREL EON GT protected cabin atmosphere",
          caption:
            "Cabin quiet section frames the interior as a protected atmosphere for distance, comfort, and reduced interface noise.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-materiality.webp",
          alt: "AUREL EON GT materiality study",
          caption:
            "Materiality surface uses overhead composition, graphite depth, and controlled light to make the car feel tactile.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-private-preview.webp",
          alt: "AUREL EON GT private preview interface",
          caption:
            "Private Preview replaces a generic contact form with a calm concierge-style introduction path.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-drive-character-composer.webp",
          alt: "AUREL EON GT drive character composer",
          caption:
            "Drive Character Composer reframes configuration as a ritual of choosing the emotional character of the vehicle.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-product-view-expansion.webp",
          alt: "AUREL EON GT cinematic product view expansion",
          caption:
            "Product View Expansion opens the car imagery into a larger cinematic inspection layer.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-gallery-archive.webp",
          alt: "AUREL EON GT cinematic gallery archive field",
          caption:
            "Gallery Archive Field behaves like a curated visual evidence surface with active image, filmstrip navigation, and product metadata.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-light-signature.webp",
          alt: "AUREL EON GT light signature interface",
          caption:
            "Light signature section turns optics and signal behavior into a cinematic identity layer.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-case-exit.webp",
          alt: "AUREL EON GT case exit and studio credit",
          caption:
            "Case exit layer closes the concept with project framing, fictional brand disclaimer, and studio credit.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-hero.webp",
          alt: "AUREL EON GT mobile arrival hero",
          caption:
            "Mobile arrival keeps the same product signal, section progress, and private preview entry in a focused handheld layout.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-cabin-quiet.webp",
          alt: "AUREL EON GT mobile cabin quiet screen",
          caption:
            "Mobile cabin state keeps material, display, and noise cues readable without compressing the desktop interface.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-inspect-exterior.webp",
          alt: "AUREL EON GT mobile cinematic inspect exterior",
          caption:
            "Mobile inspect mode supports focused product inspection with return behavior and compact metadata.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-drive-character.webp",
          alt: "AUREL EON GT mobile drive character screen",
          caption:
            "Drive character on mobile reads as an emotional mode state: controlled force without racing-interface cliches.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-gallery-archive.webp",
          alt: "AUREL EON GT mobile gallery archive",
          caption:
            "Mobile gallery archive keeps the image family, filmstrip, and visual evidence logic inside a compact app-like frame.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-interface-intelligence.webp",
          alt: "AUREL EON GT mobile interface intelligence inspect screen",
          caption:
            "Interface intelligence screen presents navigation, sensing, and assistance as calm product behavior.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-light-signature.webp",
          alt: "AUREL EON GT mobile light signature",
          caption:
            "Mobile light signature state keeps optical identity, inspect action, and composed drive action close together.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-private-preview.webp",
          alt: "AUREL EON GT mobile private preview",
          caption:
            "Private preview becomes a mobile concierge path with introduction, design brief, and future XR signal routes.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-inspect-drive.webp",
          alt: "AUREL EON GT mobile inspect drive character",
          caption:
            "Mobile inspect drive state keeps motion, range, and electric response framed as product character rather than raw specs.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/aurel-eon-gt/aurel-eon-gt-mobile-case-exit.webp",
          alt: "AUREL EON GT mobile case exit screen",
          caption:
            "Mobile case exit presents the fictional brand disclaimer, studio credit, and return paths without breaking the product tone.",
          width: "window",
        },
      ],
      problem:
        "Most automotive launch websites rely on familiar patterns: hero image, specification blocks, gallery, configurator, and contact form. The goal was to move beyond a generic showroom and make the fictional premium EV feel cinematic, alive, and conceptually distinct while staying usable and responsive.",
      approach:
        "The project was shaped as a state-driven React experience. Presence Rail navigation, Next Signal progression, Cinematic Inspect Sequence Field, Gallery Archive Field, Drive Character Composer, Product View Expansion, and Private Preview turn the website into a sequence of product states rather than a set of static marketing blocks.",
      outcome:
        "The result is an advanced interactive prototype that connects premium automotive art direction, reusable interaction systems, responsive UX, optimized media, and production-aware front-end architecture into one cohesive fictional product experience.",
      clarity:
        "The strongest decision was to treat the vehicle as a presence: revealed through atmosphere, signal, inspection, curated image sequences, and controlled interaction instead of raw specification density.",
      motion:
        "Motion supports section-based mood transitions, active presence tracking, cinematic inspect overlays, wheel and keyboard navigation, ghost-frame depth, gallery browsing, and mobile-specific simplified layouts.",
      build:
        "Built with Vite, React, TypeScript, React Router, Tailwind CSS v4, CSS custom properties, Motion for React, Zustand, custom wheel and keyboard interaction logic, WebP media pipeline, optimized gallery thumbnails, OG/favicons, and isolated future XR/WebGL architecture.",
      notes:
        "Project framing\n- Fictional premium electric grand tourer launch experience.\n- Self-initiated commercial concept for portfolio and experimental product experience purposes.\n- Not affiliated with any real automotive manufacturer.\n- Published as a Work case, not an Immersive case.\n\nCore systems\n- Presence Rail / Chameleon Signal Header.\n- Next Signal navigation.\n- Cinematic Inspect Sequence Field.\n- Cinematic Gallery Archive Field.\n- Drive Character Composer.\n- Private Preview / case exit layer.\n- Product View Expansion.\n- Responsive mobile app experience.\n\nTechnical architecture\n- State-driven React experience with separated data and component layers.\n- Section data, visual assets, mood states, gallery items, and product systems remain structured separately.\n- Future XR / WebGL exploration is intentionally isolated so the main website can stay fast and image-led.\n\nCurrent honest status\n- Advanced prototype / near-production concept.\n- Core experience, interaction systems, responsive layout, metadata, and media pipeline are implemented.\n- Final production QA, live deployment, and final case packaging remain in progress.",
      credits: [
        {
          label: "Role",
          value:
            "Concept / Creative Direction / Visual System / Interaction Design / Front-end Development / Responsive QA / Media Pipeline / Metadata",
        },
        {
          label: "Stack",
          value:
            "Vite / React / TypeScript / React Router / Tailwind CSS v4 / Motion / Zustand",
        },
        { label: "Status", value: "Advanced prototype / in development" },
      ],
      links: [
        {
          label: "Website",
          href: "https://aurel-eon-gt.pages.dev",
        },
      ],
    },
  },
  {
    slug: "oria-house-barcelona",
    code: "OH-13",
    index: "13",
    title: "Oria House Barcelona",
    year: "2026",
    tagline: "Boutique hotel concept website for a quieter Barcelona stay.",
    roleLabel: "Concept / UX / Visual System / Front-end",
    stackLabel: "Astro 5 / TypeScript / Tailwind v4",
    statusLabel: "Concept case",
    statusKind: "shipped",
    statusNote:
      "Portfolio-ready hotel concept website built around stay atmosphere, room comparison, experience paths, booking contact, responsive proof, and Cloudflare-ready media.",
    completeness: "full",
    archiveCategory: "hospitality",
    poster: {
      src: "/cases/oria-house-barcelona/oria-house-hero.webp",
      alt: "Oria House Barcelona boutique hotel hero",
    },
    coverTone: "dark",
    coverFocus: "center",
    content: {
      summary:
        "Oria House Barcelona is a boutique hotel concept website shaped around a quieter, more intimate stay in the city. The interface turns rooms, courtyard atmosphere, spa rituals, rooftop moments, dining, location, and booking contact into one calm hospitality path instead of a generic hotel template.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/oria-house-barcelona/oria-house-video.mp4",
        poster: "/cases/oria-house-barcelona/oria-house-video-poster.webp",
        alt: "Oria House Barcelona walkthrough video",
        caption:
          "Boutique hotel concept walkthrough moving from atmosphere and rooms to experiences, location, and booking contact.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-hero.webp",
          alt: "Oria House Barcelona hero screen",
          caption:
            "Hero surface presenting Oria House as a quiet Barcelona retreat with immediate room and booking actions.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-suite-story.webp",
          alt: "Oria House Barcelona suite story interface",
          caption:
            "Editorial room storytelling pairs warm photography with concise suite context and stay cues.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-arrival-mood.webp",
          alt: "Oria House Barcelona arrival mood section",
          caption:
            "Arrival and courtyard atmosphere turn the hotel concept into a visual field of warmth, quiet, and threshold moments.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-stay-before-city.webp",
          alt: "Oria House Barcelona stay before city section",
          caption:
            "The experience is positioned as a stay before the city: a calmer base for exploring Barcelona.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-room-rhythm.webp",
          alt: "Oria House Barcelona room rhythm interface",
          caption:
            "Rooms are framed by rhythm and mood rather than a flat inventory list.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-room-compare.webp",
          alt: "Oria House Barcelona room comparison surface",
          caption:
            "Room comparison helps guests choose between stay types without leaving the editorial hospitality tone.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-room-grid.webp",
          alt: "Oria House Barcelona room grid",
          caption:
            "A structured room grid balances practical selection with calm hotel imagery.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-deluxe-comfort.webp",
          alt: "Oria House Barcelona deluxe comfort room page",
          caption:
            "Room detail behaves like a stay dossier: image, rate, guest fit, and booking action remain close.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-suite-gallery.webp",
          alt: "Oria House Barcelona suite gallery",
          caption:
            "Gallery review gives the room a tactile, inspectable feeling before inquiry or booking contact.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-room-detail.webp",
          alt: "Oria House Barcelona room detail screen",
          caption:
            "Room details stay practical while preserving the cinematic hotel identity.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-local-rhythm.webp",
          alt: "Oria House Barcelona local rhythm section",
          caption:
            "Local rhythm sections connect the hotel stay with Barcelona without turning the site into a travel guide.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-room-collection.webp",
          alt: "Oria House Barcelona room collection overview",
          caption:
            "The room collection view shows the broader stay system while keeping comparison and selection accessible.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-spa-ritual.webp",
          alt: "Oria House Barcelona spa ritual screen",
          caption:
            "Spa ritual content expands the concept from rooms into restorative guest experiences.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-experience-card.webp",
          alt: "Oria House Barcelona experience card",
          caption:
            "Experience cards introduce stay packages and guest moments without overwhelming the main booking path.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-signature-breakfast.webp",
          alt: "Oria House Barcelona signature breakfast section",
          caption:
            "Signature breakfast adds a soft morning ritual to the guest journey.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-dining-evening.webp",
          alt: "Oria House Barcelona dining evening section",
          caption:
            "Dining evening content deepens the atmospheric hospitality layer.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-location-map.webp",
          alt: "Oria House Barcelona location map",
          caption:
            "Location and map content make the Barcelona context useful while staying visually aligned with the hotel world.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/oria-house-barcelona/oria-house-booking-contact.webp",
          alt: "Oria House Barcelona booking contact screen",
          caption:
            "The final contact surface turns interest into a clear stay inquiry without claiming a live booking engine.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-hero.webp",
          alt: "Oria House Barcelona mobile hero",
          caption:
            "Mobile hero keeps the hotel promise, room action, and booking path close from the first screen.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-courtyard-arrival.webp",
          alt: "Oria House Barcelona mobile courtyard arrival",
          caption:
            "Courtyard arrival translates the atmospheric threshold into a compact mobile sequence.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-room-rhythm.webp",
          alt: "Oria House Barcelona mobile room rhythm",
          caption:
            "Room rhythm stays readable on mobile, turning the room list into a stay-oriented flow.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-room-compare.webp",
          alt: "Oria House Barcelona mobile room comparison",
          caption:
            "Mobile room comparison supports practical choice without losing the hotel atmosphere.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-studio-courtyard.webp",
          alt: "Oria House Barcelona mobile studio courtyard room",
          caption:
            "Studio Courtyard detail keeps room type, rate, and booking action close.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-deluxe-comfort.webp",
          alt: "Oria House Barcelona mobile deluxe comfort room",
          caption:
            "Deluxe Comfort detail becomes a compact room dossier for handheld review.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-deluxe-gallery.webp",
          alt: "Oria House Barcelona mobile deluxe gallery",
          caption:
            "The mobile gallery lets guests inspect room imagery without leaving the booking path.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-terrace-breakfast.webp",
          alt: "Oria House Barcelona mobile terrace breakfast",
          caption:
            "Terrace breakfast content turns the stay into a morning ritual, not just a room booking.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-romance-weekend.webp",
          alt: "Oria House Barcelona mobile romance weekend package",
          caption:
            "Experience package cards add guest intent and occasion-based browsing.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-spa-ritual.webp",
          alt: "Oria House Barcelona mobile spa ritual",
          caption:
            "Spa ritual mobile content extends the hotel concept into restorative stay planning.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-signature-breakfast.webp",
          alt: "Oria House Barcelona mobile signature breakfast",
          caption:
            "Signature breakfast becomes a quick, visual hospitality promise on mobile.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-dining-evening.webp",
          alt: "Oria House Barcelona mobile dining evening",
          caption:
            "Dining evening content carries the darker, slower hospitality rhythm into the handheld path.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/oria-house-barcelona/oria-house-mobile-booking-contact.webp",
          alt: "Oria House Barcelona mobile booking contact",
          caption:
            "Mobile contact gives guests a clear booking inquiry endpoint without pretending to be a live reservation engine.",
          width: "window",
        },
      ],
      problem:
        "Hotel concept sites often collapse into generic room grids, stock-like hospitality language, or booking-first layouts that hide the feeling of the stay. Oria needed to feel atmospheric and practical at the same time.",
      approach:
        "The system was shaped as a boutique hospitality interface: cinematic entry, room comparison, room detail dossiers, courtyard and local rhythm, experience cards, spa and dining rituals, location context, and a clear booking contact path.",
      outcome:
        "The result is a portfolio-ready hotel concept case that shows how a boutique stay can become a complete digital hospitality surface without becoming a generic hotel template or claiming real booking data.",
      clarity:
        "The strongest product decision was to connect atmosphere with decision support: guests can feel the hotel world, compare rooms, inspect details, and reach contact from one calm path.",
      motion:
        "Motion is designed to feel slow, warm, and hotel-like: reveals, gallery rhythm, room transitions, and contact moments support the mood without becoming decorative noise.",
      build:
        "Astro 5 static site generation, TypeScript, Tailwind CSS v4, Astro components, vanilla JavaScript interaction layers, multilingual EN/ES routing, dynamic room, offer, and experience pages, local asset registry for demo photography, and deploy-ready metadata.",
      notes:
        "Project framing\n- Boutique hotel concept website for Barcelona.\n- Published as a Work case, not an Immersive case.\n- Built as a portfolio concept / hospitality interface system, not positioned as a launched hotel booking platform.\n\nCore logic\n- Atmosphere first: the hero, courtyard, rooms, and rituals create the feeling of the stay before pushing conversion.\n- Room decision support: room rhythm, comparison, room grids, detail pages, and gallery review make selection practical.\n- Experience layer: spa ritual, terrace breakfast, romance weekend, dining evening, and local rhythm expand the hotel beyond rooms.\n- Location context: map and Barcelona sections make the concept grounded without becoming a travel portal.\n- Booking contact: inquiry is clear and calm, without claiming live reservation integration.\n\nTechnical architecture\n- Built as a static Astro website with multilingual EN/ES routing and prerendered pages.\n- Uses a stable layout system, dynamic list/detail pages, local demo asset mapping, cinematic UI components, SEO helpers, and deploy-ready metadata.\n- The original Google Sheets to CSV CMS direction was replaced in the final demo by local assets and a controlled local data layer for speed, quality, and presentation consistency.\n\nWhat was implemented\n- Desktop hospitality surfaces across hero, rooms, comparison, details, experiences, location, and contact.\n- Mobile states for hero, courtyard, room rhythm, comparison, room detail, gallery, experience cards, dining, spa, breakfast, and booking contact.\n- Production WebP media pack and compressed MP4 walkthrough under Cloudflare asset limits.\n\nCurrent honest status\n- Portfolio-ready hotel concept case.\n- No real client metrics, live inventory, PMS integration, or production booking engine claimed.",
      credits: [
        {
          label: "Role",
          value:
            "Concept / UX Direction / Visual System / Front-end Implementation / Responsive QA / Media Production",
        },
        {
          label: "Stack",
          value:
            "Astro 5 / TypeScript / Tailwind CSS v4 / Vanilla JS / EN-ES routing",
        },
        { label: "Status", value: "Concept case" },
      ],
      links: [
        {
          label: "Website",
          href: "https://oria-house-barcelona.pages.dev/en/",
        },
      ],
    },
  },
  {
    slug: "sprintcrm",
    code: "SC-12",
    index: "12",
    title: "SprintCRM",
    year: "2026",
    tagline: "A premium internal CRM for focused outreach workflows.",
    roleLabel: "Product Direction / UX / Front-end",
    stackLabel: "React / TypeScript / Vite / Supabase",
    statusLabel: "Portfolio-ready core",
    statusKind: "shipped",
    statusNote:
      "Personal-use internal CRM core with lead imports, daily outreach actions, pipeline tracking, reports, multilingual UI, light/dark themes, Supabase-backed data, and an AI-ready outreach foundation.",
    completeness: "full",
    archiveCategory: "software-product",
    poster: {
      src: "/cases/sprintcrm/desktop/sprintcrm-hero.webp",
      alt: "SprintCRM Signal Gate login poster cover",
    },
    coverTone: "dark",
    coverFocus: "center",
    content: {
      summary:
        "SprintCRM is a premium internal CRM designed to manage the full outbound workflow: importing leads, reviewing contacts, planning next actions, tracking pipeline stages, and keeping daily outreach work under control. The product combines practical CRM logic with a calm operator-facing interface, refined light/dark modes, Supabase-backed data, and a foundation for future AI-assisted outreach without auto-send.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/sprintcrm/video/sprintcrm-video.mp4",
        poster: "/cases/sprintcrm/desktop/sprintcrm-hero.webp",
        alt: "SprintCRM walkthrough video",
        caption:
          "Premium internal CRM walkthrough showing imports, leads, drawer workflow, pipeline, reports, and operator-facing product logic.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-hero.webp",
          alt: "SprintCRM - Signal Gate login",
          caption:
            "Signal Gate entry experience positioning SprintCRM as a calm internal CRM for focused outreach workflows.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-1.webp",
          alt: "SprintCRM - import upload surface",
          caption:
            "Lead import entry surface for uploading spreadsheet-based outreach data into the CRM.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-2.webp",
          alt: "SprintCRM - import mapping workflow",
          caption:
            "Import mapping workflow designed to preview rows, map columns, and reduce mistakes before data enters the CRM.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-3.webp",
          alt: "SprintCRM - dark import workflow",
          caption:
            "Dark-mode import workflow showing the same operational logic inside a premium operator-console interface.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-4.webp",
          alt: "SprintCRM - import report",
          caption:
            "Import report summary giving the operator feedback before and after lead intake.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-5.webp",
          alt: "SprintCRM - dark leads database",
          caption:
            "Dark-mode leads database for reviewing contacts, stages, next actions, dates, niches, and sources.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-6.webp",
          alt: "SprintCRM - light leads database",
          caption:
            "Light-mode leads workspace with filters, smart views, selected rows, and open-lead actions.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-7.webp",
          alt: "SprintCRM - lead drawer workflow",
          caption:
            "Lead drawer as the main working surface: next action planning, contact context, lead details, and timeline structure.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-8.webp",
          alt: "SprintCRM - dark lead drawer workflow",
          caption:
            "Dark-mode lead drawer keeping action planning and CRM context focused without turning into a noisy dashboard.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-9.webp",
          alt: "SprintCRM - pipeline board light mode",
          caption:
            "Pipeline board organizing leads by working stage and giving quick access to active opportunities.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-10.webp",
          alt: "SprintCRM - pipeline board dark mode",
          caption:
            "Dark-mode pipeline view showing stage-based CRM progress in a compact operator-facing layout.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-11.webp",
          alt: "SprintCRM - today queue",
          caption:
            "Today queue turning the CRM into a daily work surface for handling what needs action now.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-12.webp",
          alt: "SprintCRM - lead drawer and action workflow",
          caption:
            "Lead drawer workflow with action planning, status handling, and timeline context for focused outreach work.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-13.webp",
          alt: "SprintCRM - active contacts",
          caption:
            "Active contacts view separating warm opportunities from cold or unprocessed leads.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/sprintcrm/desktop/sprintcrm-14.webp",
          alt: "SprintCRM - reports dashboard",
          caption:
            "Reports view summarizing pipeline health, funnel signals, niches, sources, active leads, and overdue work.",
          width: "window",
        },
      ],
      problem:
        "Outbound work often becomes fragmented across spreadsheets, notes, manual reminders, and disconnected status tracking. Leads are imported manually, follow-ups are easy to miss, context is scattered, and pipeline progress is difficult to review at a glance.",
      approach:
        "SprintCRM was designed as an operator-facing CRM workspace around the core working loop: import leads, review contacts, open the next action, log the result, update the stage, track the pipeline, and review reports. The interface avoids decorative dashboard noise and prioritizes a calm, usable working surface.",
      outcome:
        "The project evolved into a portfolio-ready internal product with a complete CRM flow, spreadsheet import logic, lead management, daily queue, pipeline, reports, multilingual UI, light/dark themes, Supabase-backed data, and a foundation for future AI-assisted outreach.",
      clarity:
        "The strongest product decision was to treat the CRM as a daily operator tool rather than a generic sales dashboard. The interface focuses on what to do next, what happened last, and how the pipeline is moving.",
      motion:
        "Motion is restrained and functional. The premium feeling comes from clear hierarchy, dark/light surfaces, refined cards, drawer rhythm, and controlled interaction states rather than decorative effects.",
      build:
        "Built with React, TypeScript, Vite, Supabase, CSS token architecture, XLSX/CSV import flow, multilingual UI, light/dark theme persistence, lead and activity data types, reporting logic, and AI-ready outreach fields.",
      notes:
        "Project framing\n- Premium internal CRM for focused outreach workflows.\n- Positioned as Product Engineering + Premium Internal Tool UX, not as a regular website.\n\nCore workflow\n- Import leads from XLSX/CSV.\n- Preview rows, map columns, run sanity checks, detect duplicates, and complete import with a report summary.\n- Review leads in a structured database.\n- Open a focused lead drawer.\n- Plan next actions with date and time.\n- Log work results and activity history.\n- Track active contacts, Today queue, pipeline stages, and reports.\n\nVisual direction\n- Quiet Operator Console.\n- Calm, focused, private-command-center interface instead of a generic sales dashboard.\n- Refined light and dark modes, muted borders, compact cards, status badges, tokenized surfaces, and dark-safe contrast.\n\nTechnical architecture\n- React + TypeScript + Vite app architecture.\n- Supabase authentication and data-backed CRM records.\n- XLSX/CSV parsing and import workflow.\n- Lead and activity data model.\n- Pipeline and reports logic.\n- Multilingual UI.\n- CSS variables and theme token system.\n- Light/dark theme persistence.\n\nAI readiness\n- Prepared for future AI Outreach MVP.\n- AI layer is planned for drafting outreach messages, proposals, and follow-ups.\n- No auto-send: AI assists, but the operator remains responsible for review and action.\n\nCurrent honest status\n- Personal-use internal CRM core completed.\n- Visual upgrade completed.\n- Portfolio-ready milestone reached.\n- AI Outreach layer planned as the next product stage.\n\nWhy this case matters\n- Demonstrates product architecture, CRM workflow thinking, data-backed UI, import logic, stateful lead management, reports, multilingual support, polished interface design, and AI-ready product direction.\n- Expands the portfolio beyond marketing websites and visual experiments into practical product engineering.",
      credits: [
        {
          label: "Role",
          value:
            "Product Direction / UX Architecture / Front-end Development / Design System / Workflow Logic / Supabase Integration / Visual Polish",
        },
        {
          label: "Stack",
          value:
            "React / TypeScript / Vite / Supabase / CSS Tokens / XLSX + CSV Import / Multilingual UI / Light + Dark Themes",
        },
        { label: "Status", value: "Personal-use internal CRM core completed" },
        { label: "Direction", value: "Product Engineering + Premium Internal Tool UX" },
      ],
      links: [
        {
          label: "Repository",
          href: "https://github.com/brenychstudio/SprintCRM",
        },
      ],
    },
  },
  {
    slug: "bcn-advisory",
    code: "BA-01",
    index: "01",
    title: "Barcelona Private Advisory",
    year: "2026",
    tagline: "Private property intelligence system.",
    roleLabel: "Product Direction / UX / Front-end",
    stackLabel: "Astro / TypeScript / React Islands",
    statusLabel: "Sales-ready demo",
    statusKind: "shipped",
    statusNote:
      "Client-facing private property intelligence prototype with buyer intent logic, Barcelona Lens, shortlist dossier, advisory inquiry handoff, and Cloudflare deployment.",
    completeness: "full",
    archiveCategory: "advisory-property",
    poster: {
      src: "/cases/bcn-advisory/v2/bcn-advisory-hero.webp",
      alt: "Barcelona Private Advisory private property intelligence hero",
    },
    coverTone: "light",
    coverFocus: "center",
    content: {
      summary:
        "Barcelona Private Advisory reframes real-estate browsing as a private property intelligence system. The experience turns buyer intent, district logic, acquisition signals, shortlist comparison, property inspection, and inquiry handoff into one calm advisory path.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/bcn-advisory/v2/bcn-advisory-video.mp4",
        poster: "/cases/bcn-advisory/v2/bcn-advisory-video-poster.webp",
        alt: "Barcelona Private Advisory walkthrough video",
        caption:
          "Private property intelligence walkthrough moving from lens and search to shortlist dossier, inspection, and advisory handoff.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-hero.webp",
          alt: "Barcelona Private Advisory private property intelligence hero",
          caption:
            "Hero surface positioning the product as a calm private property advisory system with lens, signal, dossier, and action layers.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-intent-lens.webp",
          alt: "Barcelona Private Advisory buyer intent lens",
          caption:
            "Buyer intent becomes the lens before properties compete for attention, shifting the interface from browsing volume to fit.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-barcelona-lens-field.webp",
          alt: "Barcelona Private Advisory Barcelona Lens Field",
          caption:
            "Barcelona Lens Field makes district intelligence visible before the buyer commits to a shortlist.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-shortlist-dossier.webp",
          alt: "Barcelona Private Advisory private shortlist dossier",
          caption:
            "Private Shortlist Dossier turns saved properties into an advisory artifact for comparison, trade-off review, and handoff.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-media-led-acquisition.webp",
          alt: "Barcelona Private Advisory media-led acquisition signal",
          caption:
            "Property cards behave like acquisition signals, pairing imagery with priority, buyer fit, and advisory context.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-visual-proof-send.webp",
          alt: "Barcelona Private Advisory visual proof ready to send",
          caption:
            "Visual proof and shortlist context become ready to send, turning browsing into a prepared advisory conversation.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-lens-expanded.webp",
          alt: "Barcelona Private Advisory expanded district lens",
          caption:
            "The expanded lens keeps map, fast-scan index, district notes, and shortlist context visible in one decision surface.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-advisory-shortlist.webp",
          alt: "Barcelona Private Advisory advisory shortlist logic",
          caption:
            "A buyer brief is translated into advisory shortlist logic, making ranked candidates feel curated rather than generic.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-shortlist-grid.webp",
          alt: "Barcelona Private Advisory ranked property shortlist grid",
          caption:
            "Ranked property cards preserve price, signal, readiness, and fit so buyers compare with context.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-property-detail.webp",
          alt: "Barcelona Private Advisory property detail intelligence screen",
          caption:
            "Property detail is structured as guided evaluation, pairing media, guide price, priority, fit notes, and advisor summary.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-inspection-preview.webp",
          alt: "Barcelona Private Advisory inspection preview",
          caption:
            "Inspection preview keeps imagery, profile fit, and viewing readiness together before the next advisory step.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-gallery-review.webp",
          alt: "Barcelona Private Advisory property gallery review",
          caption:
            "Gallery review supports focused inspection without falling back into a noisy portal lightbox.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-private-advisory-method.webp",
          alt: "Barcelona Private Advisory method page",
          caption:
            "The advisory method explains why private selection beats catalog browsing for high-trust acquisition decisions.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/bcn-advisory/v2/bcn-advisory-inquiry-handoff.webp",
          alt: "Barcelona Private Advisory inquiry handoff",
          caption:
            "The final inquiry handoff turns search, property choice, and dossier context into a copy-ready viewing request.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-hero-lens.webp",
          alt: "Barcelona Private Advisory mobile hero and lens",
          caption:
            "Mobile opens with the same property intelligence signal: district, brief, lens, dossier, and action.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-media-signal.webp",
          alt: "Barcelona Private Advisory mobile media-led acquisition signal",
          caption:
            "Mobile property cards retain acquisition signal, priority, and save actions without becoming a listing feed.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-dossier-ready.webp",
          alt: "Barcelona Private Advisory mobile advisor-ready dossier",
          caption:
            "The mobile dossier frames selected properties as ready to send, with buyer intent still visible.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-menu.webp",
          alt: "Barcelona Private Advisory mobile private advisory menu",
          caption:
            "Navigation stays advisory-led, giving primary path, trust, and request actions a compact structure.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-shortlist-dossier.webp",
          alt: "Barcelona Private Advisory mobile shortlist dossier",
          caption:
            "Shortlisted properties become a mobile dossier for trade-off review, opening, and quote preparation.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-field-card.webp",
          alt: "Barcelona Private Advisory mobile field card",
          caption:
            "Field cards keep the acquisition file compact: image, readiness, guide price, request path, and saved state.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-property-detail.webp",
          alt: "Barcelona Private Advisory mobile property detail",
          caption:
            "Mobile property detail keeps recommendation, acquisition file, guide price, and gallery action in one scan.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-inspection-gallery.webp",
          alt: "Barcelona Private Advisory mobile inspection gallery",
          caption:
            "Private inspection mode gives the buyer a focused image review without leaving the advisory path.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-advisory-method.webp",
          alt: "Barcelona Private Advisory mobile advisory method",
          caption:
            "The mobile method page explains the system as brief, lens, signal, dossier, and action.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-request-brief.webp",
          alt: "Barcelona Private Advisory mobile request brief",
          caption:
            "Request Brief turns the final message into a structured advisory handoff before first contact.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-viewing-path.webp",
          alt: "Barcelona Private Advisory mobile viewing path request",
          caption:
            "The viewing path captures source, next action, timing, and buyer notes without making the form feel generic.",
          width: "window",
        },
      ],
      problem:
        "Premium property search often collapses into catalog browsing: too many options, weak buyer context, and little explanation of why one property fits better than another. That makes advisory value invisible before the first conversation.",
      approach:
        "The project was reframed as a private property intelligence system. Barcelona Lens, intent-first search, acquisition signals, ranked shortlist cards, dossier review, property inspection, and inquiry handoff work together as a guided advisory path.",
      outcome:
        "The result is a deployed sales-ready advisory prototype that makes the logic behind property selection visible before first contact: buyers can scan fit, review options, prepare a dossier, and hand off a clearer viewing request.",
      clarity:
        "The strongest product decision was to make selection logic visible. The interface gives buyers a private advisory rhythm: brief, lens, signal, dossier, inspection, and action.",
      motion:
        "Motion is controlled and minimal, supporting lens reveals, shortlist feedback, inspection review, and inquiry handoff without adding unnecessary interface noise.",
      build:
        "Built with Astro, TypeScript, Tailwind CSS, React islands, Motion, bilingual EN / ES routing, shortlist state, lightbox interaction, SEO foundations, GitHub, and Cloudflare Pages deployment.",
      notes:
        "Project framing\n- Private Property Intelligence System for Barcelona real-estate advisory.\n- Built as a sales-ready prototype / client-facing demo, not as a fully launched inventory-backed production platform.\n- The case moves from listing-portal browsing toward visible selection logic and advisor-ready handoff.\n\nCore logic\n- Brief: buyer intent defines the lens before properties compete for attention.\n- Lens: Barcelona Lens Field makes district intelligence and lifestyle fit visible.\n- Signal: property cards surface acquisition cues instead of acting like generic listings.\n- Dossier: saved properties become a Private Shortlist Dossier for comparison and trade-off review.\n- Inspection: property detail and gallery review support focused evaluation.\n- Action: Advisory Inquiry Handoff turns search context into a copy-ready viewing request.\n\nWhat was implemented\n- Hero surface for the private property intelligence system.\n- Intent-led search and private search surface.\n- Barcelona Lens Field with district-aware decision logic.\n- Media-led acquisition signal cards.\n- Private Shortlist Dossier and ranked shortlist candidates.\n- Property detail, inspection preview, and gallery review.\n- Advisory method page explaining why private selection beats catalog browsing.\n- Inquiry handoff and request viewing path.\n- Responsive mobile states for lens, dossier, field card, property detail, inspection, and request brief.\n- Bilingual-ready EN / ES routing, SEO foundations, GitHub, and Cloudflare Pages deployment.\n\nProduct value\n- The buyer receives a guided advisory path instead of an endless listing stream.\n- The system makes fit, district logic, shortlist priority, and next action visible before first contact.\n- Private handoff helps turn casual interest into a structured advisory request.\n\nTechnical architecture\n- Astro static foundation for speed and SEO stability.\n- React islands where interaction is required: shortlist state, search intake, gallery inspection, and inquiry handoff.\n- Responsive presentation keeps the intelligence model readable across desktop and mobile.\n\nCurrent honest status\n- Sales-ready advisory prototype.\n- Not positioned as a fully launched client production system with live inventory backend.\n- Production contact data, live inventory, CRM connection, and market-specific data would be connected in a real client release.",
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
      src: "/cases/fluid-exhibition/desktop/fluid-hero.webp",
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
        poster: "/cases/fluid-exhibition/desktop/fluid-hero.webp",
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
          src: "/cases/fluid-exhibition/desktop/fluid-hero.webp",
          alt: "FLUID - desktop hero frame",
          caption:
            "Exhibition landing page with fluid visual identity and QR-oriented entry framing.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/fluid-exhibition/desktop/fluid-1.webp",
          alt: "FLUID - desktop frame 01",
          caption:
            "Artist system laid out as a structured exhibition layer instead of a generic event page.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/fluid-exhibition/desktop/fluid-2.webp",
          alt: "FLUID - desktop frame 02",
          caption:
            "Artist profile surface connected to the wider exhibition context.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/fluid-exhibition/desktop/fluid-3.webp",
          alt: "FLUID - desktop frame 03",
          caption:
            "Content-driven information blocks balancing artwork context, artist data, and navigation clarity.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-1.webp",
          alt: "FLUID - mobile frame 01",
          caption:
            "Mobile exhibition entry designed as a calm QR-access landing surface.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-2.webp",
          alt: "FLUID - mobile frame 02",
          caption:
            "Mobile exhibition page carrying the same fluid identity in a compact format.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-3.webp",
          alt: "FLUID - mobile frame 03",
          caption:
            "Artist listing and profile access optimized for quick scan-to-context behavior.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/fluid-exhibition/mobile/fluid-mb-4.webp",
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
      src: "/cases/form-index/desktop/fr-hero.webp",
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
        poster: "/cases/form-index/desktop/fr-hero.webp",
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
          src: "/cases/form-index/desktop/fr-hero.webp",
          alt: "FORM INDEX - desktop hero frame",
          caption:
            "Hero surface that frames the system through editorial restraint, calm hierarchy, and controlled image rhythm.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-1.webp",
          alt: "FORM INDEX - desktop frame 01",
          caption:
            "Sticky-stage layout with controlled reveal timing and quiet visual hierarchy.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-2.webp",
          alt: "FORM INDEX - desktop frame 02",
          caption:
            "Campaign-system surface balancing photography, editorial spacing, and premium pacing.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-3.webp",
          alt: "FORM INDEX - desktop frame 03",
          caption:
            "Scroll-driven transition state expressed through spacing, sequence, and visual calm.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-4.webp",
          alt: "FORM INDEX - desktop frame 04",
          caption:
            "Surface studies presented as part of the editorial rhythm rather than decorative filler.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-5.webp",
          alt: "FORM INDEX - desktop frame 05",
          caption:
            "Premium editorial spacing and quiet visual hierarchy across grouped image content.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-6.webp",
          alt: "FORM INDEX - desktop frame 06",
          caption:
            "Product surface built around object focus, clean spacing, and understated presentation.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-7.webp",
          alt: "FORM INDEX - desktop frame 07",
          caption:
            "Section progress translated into structured product flow and controlled emphasis.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-8.webp",
          alt: "FORM INDEX - desktop frame 08",
          caption:
            "Lookbook volumes treated as a premium content surface with calm typographic support.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/form-index/desktop/fr-9.webp",
          alt: "FORM INDEX - desktop frame 09",
          caption:
            "Selected pieces view showing catalog rhythm, controlled reveal, and clean visual grouping.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-1.webp",
          alt: "FORM INDEX - mobile frame 01",
          caption:
            "Mobile landing surface preserving the same calm editorial hierarchy in a compact format.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-2.webp",
          alt: "FORM INDEX - mobile frame 02",
          caption:
            "Surface studies adapted to mobile without losing clarity, spacing, or pacing.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-3.webp",
          alt: "FORM INDEX - mobile frame 03",
          caption:
            "Lookbook volume presentation translated into a compact phone-first composition.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-4.webp",
          alt: "FORM INDEX - mobile frame 04",
          caption:
            "Selection drawer and product flow showing clean UI behavior on smaller screens.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/form-index/mobile/fr-mob-5.webp",
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
      "Infrastructure interface system for technical installation services.",
    roleLabel: "Creative Developer / Front-end Systems",
    stackLabel: "Astro / TypeScript / React",
    statusLabel: "Shipped",
    statusKind: "shipped",
    statusNote:
      "Deployed concept demo built as an infrastructure-first service system with connected-service logic, quote flow, technical specification, and Cloudflare delivery.",
    completeness: "full",
    archiveCategory: "brands",
    poster: {
      src: "/cases/arcwave-integrations/v2/arcwave-hero.webp",
      alt: "ARCWAVE infrastructure interface hero",
    },
    coverTone: "light",
    coverFocus: "center",
    content: {
      summary:
        "ARCWAVE reframes technical installation services as a calm infrastructure operating surface. The case turns invisible systems like telecom, networks, electricity, security, EV charging, and audio into a readable buyer path: understand the connected layer, choose a service, follow the install logic, and request a clear technical brief.",
      hero: {
        kind: "video",
        device: "desktop",
        aspect: "landscape",
        src: "/cases/arcwave-integrations/v2/arcwave-video.mp4",
        poster: "/cases/arcwave-integrations/v2/arcwave-video-poster.webp",
        alt: "ARCWAVE walkthrough video",
        caption:
          "Infrastructure service walkthrough moving from positioning and connected-service logic to quote request and technical specification.",
        width: "full",
        controls: true,
      },
      frames: [
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-hero.webp",
          alt: "ARCWAVE invisible infrastructure hero screen",
          caption:
            "Hero surface positioning telecom, networks, electricity, smart home, EV charging, security, and audio as one precise infrastructure layer.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-connected-layer.webp",
          alt: "ARCWAVE connected service layer interface",
          caption:
            "Connected services are grouped as one technical layer so buyers can scan the system before choosing a path.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-proof-metrics.webp",
          alt: "ARCWAVE infrastructure proof metrics",
          caption:
            "Proof metrics turn reliability, active scopes, installed systems, and connected services into visible trust signals.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-service-system.webp",
          alt: "ARCWAVE high impact technical service system",
          caption:
            "The offer is broken into service systems, making technical installation paths readable without corporate clutter.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-install-paths.webp",
          alt: "ARCWAVE installation path overview",
          caption:
            "Service paths show how different technical needs move into one structured installation system.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-infrastructure-modules.webp",
          alt: "ARCWAVE infrastructure module grid",
          caption:
            "Infrastructure modules give each service a clear entry point while keeping the whole offer visually connected.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-decision-interface.webp",
          alt: "ARCWAVE decision interface",
          caption:
            "A decision interface moves users from need to service choice before asking for project details.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-networks-wifi.webp",
          alt: "ARCWAVE networks and Wi-Fi service detail",
          caption:
            "Service detail pages keep technical language restrained, scannable, and close to the request path.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-quote-form.webp",
          alt: "ARCWAVE clear quote request form",
          caption:
            "Quote request turns a technical need into structured fields without making the user feel they are filling a procurement spreadsheet.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-install-flow.webp",
          alt: "ARCWAVE signal to installed system flow",
          caption:
            "The install flow explains how a signal, need, or service request becomes a technical result.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-commercial-infrastructure.webp",
          alt: "ARCWAVE commercial infrastructure positioning",
          caption:
            "Commercial infrastructure is framed as connected invisible systems rather than a list of disconnected services.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-engineering-clarity.webp",
          alt: "ARCWAVE engineering clarity section",
          caption:
            "Engineering clarity becomes a sales layer: technical impact, reduced friction, and operational readiness are visible at a glance.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-install-brief.webp",
          alt: "ARCWAVE install brief interface",
          caption:
            "The user journey resolves into an install brief, turning vague project needs into actionable technical context.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/arcwave-integrations/v2/arcwave-technical-spec.webp",
          alt: "ARCWAVE technical specification surface",
          caption:
            "A short technical specification surface shows how the request can become a precise, advisor-ready brief.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-hero.webp",
          alt: "ARCWAVE mobile invisible infrastructure hero",
          caption:
            "Mobile hero keeps the infrastructure promise, request action, and service categories readable above the fold.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-connected-services.webp",
          alt: "ARCWAVE mobile connected services list",
          caption:
            "Connected services stay thumb-friendly and scannable as one technical layer.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-menu.webp",
          alt: "ARCWAVE mobile infrastructure menu",
          caption:
            "Mobile navigation groups home, services, process, about, and contact without breaking the system tone.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-proof-metrics.webp",
          alt: "ARCWAVE mobile proof metrics",
          caption:
            "Mobile proof metrics keep trust signals visible without overloading the handheld surface.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-service-grid.webp",
          alt: "ARCWAVE mobile service grid",
          caption:
            "Service categories become compact cards, giving users a clear way into the infrastructure system.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-process.webp",
          alt: "ARCWAVE mobile process path",
          caption:
            "The process view explains the buyer path from need to connected layer to project brief.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-telecom-detail.webp",
          alt: "ARCWAVE mobile telecom service detail",
          caption:
            "Service detail remains specific enough for technical trust while staying readable on mobile.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-need-card.webp",
          alt: "ARCWAVE mobile need becomes visible card",
          caption:
            "Signal cards make invisible technical needs feel concrete before the user asks for support.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/arcwave-integrations/v2/arcwave-mobile-quote-cta.webp",
          alt: "ARCWAVE mobile quote request call to action",
          caption:
            "The mobile CTA turns service uncertainty into a clear request-a-quote action.",
          width: "window",
        },
      ],
      problem:
        "Technical installation services are often presented as generic contractor websites: disconnected service lists, weak explanation of system value, and quote forms that arrive before the buyer understands what they need. ARCWAVE needed to make invisible infrastructure feel precise, connected, and trustworthy.",
      approach:
        "The project was reframed as an infrastructure interface system. Telecom, networks, electricity, security, EV charging, smart home, and audio are presented as one connected layer, supported by service paths, proof metrics, technical detail, process logic, and a quote flow that turns a need into an install brief.",
      outcome:
        "The final result is a deployed concept demo that works as a reusable foundation for technical installation companies: premium, calm, bilingual-ready, responsive, and built around conversion into a clearer project brief.",
      clarity:
        "The strongest product decision was to make invisible systems visible. The interface gives the buyer a simple rhythm: understand the connected layer, choose a service, see the process, and request a quote with useful context.",
      motion:
        "Motion stays restrained and technical: subtle transitions support trust, service grouping, process rhythm, and quote readiness without turning the experience into a decorative tech demo.",
      build:
        "Astro, TypeScript, React islands, Astro View Transitions, typed content architecture, bilingual route system, Cloudflare Pages deployment, and GitHub-based delivery.",
      notes:
        "Project framing\n- Infrastructure interface system for technical installation services.\n- Built as a deployed concept demo / reusable service foundation, not positioned as a live client success story.\n- The case moves from generic contractor-site language toward visible infrastructure logic and quote-ready project context.\n\nCore logic\n- Connected layer: telecom, networks, electricity, smart home, EV charging, security, and audio behave as one infrastructure system.\n- Service paths: each service has a clear entry point without breaking the whole-system narrative.\n- Proof metrics: reliability, active scopes, installed systems, and connected services become visible trust signals.\n- Decision interface: users move from need to service choice before entering project details.\n- Install flow: the system explains how a signal or need becomes an installed technical result.\n- Quote brief: the final action turns uncertainty into structured project context.\n\nWhat was implemented\n- Infrastructure-first hero and connected-service positioning.\n- Service system architecture across telecom, networks, electricity, security, EV charging, smart home, and audio.\n- Proof metrics, install paths, service modules, and decision surfaces.\n- Service detail page for networks / Wi-Fi and technical service explanation.\n- Quote form and install brief logic.\n- Mobile surfaces for hero, connected services, menu, proof metrics, service grid, process, service detail, signal card, and quote CTA.\n- Typed content architecture, bilingual route foundation, SEO readiness, GitHub, and Cloudflare Pages deployment.\n\nProduct value\n- The buyer understands the infrastructure layer before requesting a quote.\n- The company offer feels precise, trustworthy, and systemized instead of generic.\n- The request path collects better context because the interface teaches the service model first.\n\nCurrent honest status\n- Deployed concept demo / reusable foundation.\n- Not presented as a launched client platform or measured business result.\n- Real client release would connect final contact data, service availability, CRM, and production copy.",
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
      src: "/cases/casa-nube/desktop/casa-hero.webp",
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
        poster: "/cases/casa-nube/desktop/casa-hero.webp",
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
          src: "/cases/casa-nube/desktop/casa-hero.webp",
          alt: "Casa Nube - desktop hero frame",
          caption:
            "Homepage hero presenting the café as a warm digital façade with clear visitor actions.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-1.webp",
          alt: "Casa Nube - desktop frame 01",
          caption:
            "Menu preview and space section designed as an editorial hospitality surface rather than a generic café template.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-2.webp",
          alt: "Casa Nube - desktop frame 02",
          caption:
            "Space and light section using café photography, warm rhythm, and soft editorial grouping.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-3.webp",
          alt: "Casa Nube - desktop frame 03",
          caption:
            "Web-native menu page replacing PDF-first restaurant UX with readable structured content.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-4.webp",
          alt: "Casa Nube - desktop frame 04",
          caption:
            "Visit page focused on opening rhythm, reservation logic, and practical visitor decisions.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/casa-nube/desktop/casa-5.webp",
          alt: "Casa Nube - desktop frame 05",
          caption:
            "Location and planning surface with clear contact paths, directions, and practical notes.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-1.webp",
          alt: "Casa Nube - mobile frame 01",
          caption:
            "Mobile homepage preserving editorial warmth while keeping key café actions close.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-2.webp",
          alt: "Casa Nube - mobile frame 02",
          caption:
            "Mobile menu and hospitality content adapted into a calm, compact flow.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-3.webp",
          alt: "Casa Nube - mobile frame 03",
          caption:
            "Mobile menu page designed as structured web content with clear category rhythm.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-4.webp",
          alt: "Casa Nube - mobile frame 04",
          caption:
            "Mobile visit page giving users quick access to hours, location, and practical planning details.",
          width: "window",
        },
        {
          kind: "image",
          device: "mobile",
          aspect: "phone",
          src: "/cases/casa-nube/mobile/casa-mob-5.webp",
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
      src: "/cases/print-border-studio/desktop/psb-hero.webp",
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
        poster: "/cases/print-border-studio/desktop/psb-hero.webp",
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
          src: "/cases/print-border-studio/desktop/psb-hero.webp",
          alt: "Print Border Studio - desktop hero frame",
          caption:
            "Main product surface combining artwork preview, border controls, queue logic, and export-ready interface structure.",
          width: "full",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-1.webp",
          alt: "Print Border Studio - desktop frame 01",
          caption:
            "Light interface state showing precise artwork placement, margin controls, and print preparation settings.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-2.webp",
          alt: "Print Border Studio - desktop frame 02",
          caption:
            "Dark workspace mode designed for focused print review and controlled visual judgment.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-3.webp",
          alt: "Print Border Studio - desktop frame 03",
          caption:
            "Artwork preparation flow with border settings, visual balance, and export-oriented controls.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-4.webp",
          alt: "Print Border Studio - desktop frame 04",
          caption:
            "Preview and inspection state supporting careful evaluation before final export.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb-5.webp",
          alt: "Print Border Studio - desktop frame 05",
          caption:
            "Museum-style print framing surface focused on proportion, border rhythm, and presentation control.",
          width: "window",
        },
        {
          kind: "image",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/print-border-studio/desktop/psb6.webp",
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
        src: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
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
          poster: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
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
            src: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
            alt: "House of Lune - desktop hero frame",
            caption:
              "Homepage hero presenting the maison through dark cinematic staging, controlled light, and private luxury atmosphere.",
            width: "full",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-1.webp",
            alt: "House of Lune - desktop frame 01",
            caption:
              "Selected signatures section presenting jewelry pieces as rare objects rather than catalog inventory.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-2.webp",
            alt: "House of Lune - desktop frame 02",
            caption:
              "Maison storytelling surface using dark restraint, object imagery, and editorial hierarchy.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-3.webp",
            alt: "House of Lune - desktop frame 03",
            caption:
              "Collection presentation designed as a private salon system rather than a dense product grid.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-4.webp",
            alt: "House of Lune - desktop frame 04",
            caption:
              "Craftsmanship page framing atelier process, material culture, and premium editorial rhythm.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-5.webp",
            alt: "House of Lune - desktop frame 05",
            caption:
              "Private inquiry moment built around appointment language and restrained conversion cues.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-6.webp",
            alt: "House of Lune - desktop frame 06",
            caption:
              "Journal-style editorial layer positioning the maison as a living brand world rather than a static store.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/house-of-lune/desktop/house-of-lune-7.webp",
            alt: "House of Lune - desktop frame 07",
            caption:
              "Contact and private inquiry flow with calm form structure, material notes, and salon-like framing.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-1.webp",
            alt: "House of Lune - mobile frame 01",
            caption:
              "Mobile collection surface preserving dark luxury, object focus, and restrained interface rhythm.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-2.webp",
            alt: "House of Lune - mobile frame 02",
            caption:
              "Mobile navigation translated into a compact private-maison menu structure.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-3.webp",
            alt: "House of Lune - mobile frame 03",
            caption:
              "Mobile journal surface extending the brand through campaigns, notes, and editorial storytelling.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-4.webp",
            alt: "House of Lune - mobile frame 04",
            caption:
              "Mobile maison page presenting brand philosophy, intimacy, and material atmosphere.",
            width: "window",
          },
          {
            kind: "image",
            device: "mobile",
            aspect: "phone",
            src: "/cases/house-of-lune/mobile/house-of-lune-mb-5.webp",
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
      tagline: "Creator workflow interface system.",
      roleLabel: "Workflow Tool / Creator Publishing System",
      stackLabel: "React / TypeScript / Vite / Tailwind",
      statusLabel: "Beta-ready prototype",
      statusKind: "in_progress",
      statusNote:
        "Beta-ready export-first workspace with Library, Smart Mix, Planner, Captions, Export, Client Review, Profile Handoff / Bio Builder, and Media Converter layers.",
      completeness: "full",
      archiveCategory: "software-product",
      poster: {
        src: "/cases/creatorops/v2/creatorops-hero.webp",
        alt: "CreatorOps workflow interface hero screen",
      },
      coverTone: "dark",
      coverFocus: "center",
      content: {
        summary:
          "CreatorOps is an export-first workspace for turning scattered creator assets into a ready-to-publish Week Pack. The system helps creators and small teams select, rank, plan, caption, review, export, and hand off visual content without turning the product into dashboard noise.",
        hero: {
          kind: "video",
          device: "desktop",
          aspect: "landscape",
          src: "/cases/creatorops/v2/creatorops-video.mp4",
          poster: "/cases/creatorops/v2/creatorops-video-poster.webp",
          alt: "CreatorOps walkthrough video",
          caption:
            "CreatorOps walkthrough showing an export-first creator workflow, review layer, profile handoff, and utility tools inside one product interface.",
          width: "full",
          controls: true,
        },
        frames: [
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-hero.webp",
            alt: "CreatorOps workflow interface hero screen",
            caption:
              "Hero surface positioning CreatorOps as a calm workflow interface system for creator publishing.",
            width: "full",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-workflow-overview.webp",
            alt: "CreatorOps workflow overview screen",
            caption:
              "Workflow overview framing CreatorOps as an export-first workspace for turning scattered creator assets into a ready-to-publish Week Pack.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-week-focus.webp",
            alt: "CreatorOps weekly focus planning screen",
            caption:
              "Weekly focus surface keeping campaign rhythm visible without making the product feel calendar-heavy.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-pricing-plans.webp",
            alt: "CreatorOps pricing plans screen",
            caption:
              "Pricing and plan surface framing the prototype as a serious creator workflow product direction.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-roadmap.webp",
            alt: "CreatorOps roadmap screen",
            caption:
              "Roadmap surface showing how the workflow can expand through review, tools, automation, and publishing support.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-waitlist.webp",
            alt: "CreatorOps waitlist screen",
            caption:
              "Waitlist and intake surface turning product interest into a restrained beta entry point.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-library-grid.webp",
            alt: "CreatorOps content library grid",
            caption:
              "Content library grid where raw visual assets enter the workflow as selectable publishing candidates.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-library-expanded.webp",
            alt: "CreatorOps expanded content library screen",
            caption:
              "Expanded library view making selection, ranking, and content context readable inside the darker product environment.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-publishing-flow.webp",
            alt: "CreatorOps publishing flow screen",
            caption:
              "Publishing flow screen where selected visuals, captions, and timing cues move toward export-ready output.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-artwork-detail.webp",
            alt: "CreatorOps artwork detail screen",
            caption:
              "Artwork detail state supporting inspection, content context, and handoff decisions without leaving the workflow.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-client-feedback.webp",
            alt: "CreatorOps client feedback screen",
            caption:
              "Client feedback layer turning collaboration into a calm review surface rather than a scattered comment thread.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-client-review.webp",
            alt: "CreatorOps client review screen",
            caption:
              "Client review screen where collaborators can approve, comment, and refine content direction inside the product.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-profile-handoff.webp",
            alt: "CreatorOps profile handoff screen",
            caption:
              "Profile handoff surface connecting the publishing pack with profile context, bio direction, and creator-facing output.",
            width: "window",
          },
          {
            kind: "image",
            device: "desktop",
            aspect: "landscape",
            src: "/cases/creatorops/v2/creatorops-media-converter.webp",
            alt: "CreatorOps media converter interface",
            caption:
              "Media Converter keeps utility work inside the same premium product environment instead of breaking into a separate tool.",
            width: "window",
          },
        ],
        problem:
          "Creators and small teams often have enough visual material, but the work is scattered across folders, chats, captions, feedback, exports, and utility tools. The decision process becomes noisy before the content can become a clear publishing outcome.",
        approach:
          "CreatorOps structures that material into a guided flow: Library, Smart Mix, Planner, Captions, Export, Client Review, Profile Handoff / Bio Builder, and Media Converter. Each layer narrows the decision field while keeping the interface operational, calm, and visually premium.",
        outcome:
          "The result is a beta-ready product-interface prototype that demonstrates real workflow states: selection, ranking, planning, caption preparation, export, profile handoff, client review, media conversion, and ready-to-publish Week Pack delivery.",
        clarity:
          "CreatorOps proves that creator tools do not need to look like overloaded admin panels. Visual material becomes a readable export-first operating system for planning, review, export, and handoff.",
        motion:
          "Motion stays restrained and product-focused: route transitions, modular states, review surfaces, and utility layers support orientation without turning the workflow into visual noise.",
        build:
          "Built with React, TypeScript, Vite, Tailwind CSS, product UI patterns, workflow logic, responsive interface structure, browser-side state, export-oriented flows, Cloudflare Pages deployment, and GitHub-based delivery.",
        notes:
          "Project framing\n- Workflow Tool / Creator Publishing System.\n- Beta-ready content workflow prototype for creators and small content teams.\n- Built as a product-interface prototype, not a launched SaaS claim.\n- Framed as an export-first workspace for turning scattered creator assets into a ready-to-publish Week Pack.\n\nCore workflow\n- Library -> Smart Mix -> Planner -> Captions -> Export -> Client Review -> Profile Handoff / Bio Builder -> Media Converter.\n- Raw visual assets enter the system as selectable publishing candidates.\n- Smart Mix ranks combinations and avoids repetition before the content enters planning.\n- Planner and Captions turn selected material into a structured Week Pack instead of isolated files.\n- Export turns selected material into usable output: images, captions, CSV, and handoff material.\n- Client Review gives collaborators a calm layer for approval, comments, and refinement.\n- Profile Handoff / Bio Builder extends the pack into profile context and creator-facing delivery.\n- Media Converter keeps utility tools inside the product environment without breaking the premium interface tone.\n\nProduct value\n- CreatorOps turns scattered visual assets into a calm publishing pipeline.\n- The system helps creators and small teams select, rank, plan, caption, review, export, and hand off visual content.\n- The darker product environment, modular workflow states, clear review layers, and export-ready structures keep the interface operational and premium.\n\nTechnical architecture\n- React / TypeScript / Vite / Tailwind.\n- Product UI and workflow logic.\n- Responsive interface structure.\n- Browser-side state and export-oriented flows.\n- Cloudflare Pages deployment and GitHub-based delivery.\n\nCurrent limitations\n- Beta-ready prototype, not a full production SaaS.\n- No commercial SaaS metrics claimed.\n- Future production layers such as backend accounts, cloud storage, real AI integration, scheduling, analytics, billing, and production database would need separate implementation.",
        credits: [
          {
            label: "Role",
            value:
              "Product Strategy / UX Architecture / Product UI / Front-end Implementation / Workflow Logic / Review + Handoff System",
          },
          {
            label: "Stack",
            value:
              "React / TypeScript / Vite / Tailwind / Product UI / Workflow Logic / Responsive Interface",
          },
          { label: "Status", value: "Beta-ready prototype" },
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

type CaseRegistryEntry = Omit<
  CaseRegistryFields,
  "previewImage" | "ogImage" | "alt" | "stack" | "liveUrl" | "repoUrl"
> &
  Partial<Pick<CaseRegistryFields, "previewImage" | "ogImage" | "alt" | "stack" | "liveUrl" | "repoUrl">>;

const sharedServicePaths = {
  premiumLanding: "Premium landing page",
  productDemo: "Product demo landing",
  interactiveSystems: "Interactive web systems",
};

const caseRegistryBySlug: Record<string, CaseRegistryEntry> = {
  "aurel-eon-gt": {
    category: "Interactive Web",
    proofType: "Case Prototype",
    status: "prototype",
    shortDescription:
      "A cinematic product presentation prototype for a fictional electric grand tourer, built around product states, gallery inspection, drive character and private preview.",
    longDescription:
      "AUREL EON GT proves how a premium product launch can behave as an interface system: atmosphere, product evidence, motion, inspection and inquiry are organized into one cinematic front-end surface without claiming a live automotive product.",
    tags: ["Automotive concept", "Premium product", "Cinematic UX", "Interaction system"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.premiumLanding, sharedServicePaths.productDemo, sharedServicePaths.interactiveSystems],
    relatedCases: ["house-of-lune", "arcwave-integrations"],
    clientType: "Luxury product / mobility concept",
  },
  "oria-house-barcelona": {
    category: "Premium Website",
    proofType: "Case Prototype",
    status: "prototype",
    shortDescription:
      "A boutique hotel website concept that turns rooms, stay rituals, location context and booking contact into a calm guest journey.",
    longDescription:
      "Oria House Barcelona demonstrates a hospitality website foundation where atmosphere, room comparison, guest decision support and inquiry logic stay readable across desktop and mobile without claiming a live reservation engine.",
    tags: ["Hospitality", "Boutique hotel", "Room comparison", "Booking inquiry"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.premiumLanding, sharedServicePaths.interactiveSystems],
    relatedCases: ["casa-nube", "barcelona-private-advisory"],
    clientType: "Boutique hospitality",
  },
  sprintcrm: {
    category: "Product Interface",
    proofType: "Internal System",
    status: "prototype",
    shortDescription:
      "A premium internal CRM prototype for focused outreach workflows, lead import, pipeline control and operator-facing reporting.",
    longDescription:
      "SprintCRM proves product-interface thinking for internal operations: data states, daily workflow, reporting and operator trust are shaped into a focused CRM surface rather than a generic admin dashboard.",
    tags: ["CRM", "Internal system", "Workflow UX", "Operator console"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.productDemo, sharedServicePaths.interactiveSystems],
    relatedCases: ["creatorops", "print-border-studio"],
    clientType: "Internal operations / sales teams",
  },
  "bcn-advisory": {
    category: "Premium Website",
    proofType: "Case Prototype",
    status: "prototype",
    shortDescription:
      "A high-trust advisory website concept for private real estate, curated buyer journeys and premium inquiry flows.",
    longDescription:
      "Barcelona Private Advisory proves how real-estate and private advisory websites can move beyond listing-heavy presentation into buyer intent, district intelligence, shortlist dossiers, property inspection and structured inquiry handoff.",
    tags: ["Real estate advisory", "Barcelona Lens", "Shortlist dossier", "Private inquiry"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.premiumLanding, sharedServicePaths.productDemo],
    relatedCases: ["oria-house-barcelona", "casa-nube"],
    clientType: "Private advisory / real estate consultants",
    searchContent: {
      type: "Premium advisory / real estate presentation website.",
      audience:
        "Private advisory, real estate consultants, relocation consultants, boutique property services and high-trust local businesses.",
      problem:
        "Advisory and real-estate websites often become listing-heavy, impersonal and difficult to trust.",
      approach:
        "The system creates a curated route through buyer context, selected opportunities, private inquiry, location intelligence and trust-oriented navigation.",
      outcome:
        "The case demonstrates how a service business can move from generic presentation to a clearer premium advisory interface.",
      productionFacts: [
        "Responsive front-end",
        "Inquiry-oriented architecture",
        "Multilingual-ready direction",
        "Location and service framing",
        "SEO-ready content structure",
      ],
      relatedServices: [sharedServicePaths.premiumLanding, sharedServicePaths.productDemo],
    },
    translations: {
      es: spanishCaseRegistryTranslations["bcn-advisory"],
    },
  },
  "fluid-exhibition": {
    category: "Interactive Web",
    proofType: "Immersive Proof",
    status: "live",
    shortDescription:
      "A cinematic web exhibition surface where image rhythm, motion and scroll structure behave as one editorial presentation system.",
    longDescription:
      "FLUID proves that exhibition and culture-facing web experiences can stay atmospheric while remaining structured, readable and production-ready across media, motion and responsive presentation.",
    tags: ["Web exhibition", "Editorial surface", "Scroll interaction", "Cinematic media"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.interactiveSystems, sharedServicePaths.premiumLanding],
    relatedCases: ["form-index", "print-border-studio"],
    clientType: "Culture / exhibition / editorial projects",
  },
  "form-index": {
    category: "Editorial / Archive",
    proofType: "Interface System",
    status: "live",
    shortDescription:
      "A premium interactive editorial system proving reusable case architecture, multilingual presentation and precise motion grammar.",
    longDescription:
      "FORM INDEX shows how a presentation website can become a repeatable content system: sticky stage logic, motion pacing, editorial hierarchy and responsive translation work together without becoming effect-driven.",
    tags: ["Editorial system", "Multilingual", "Motion UI", "Presentation architecture"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.interactiveSystems, sharedServicePaths.premiumLanding],
    relatedCases: ["fluid-exhibition", "arcwave-integrations"],
    clientType: "Editorial / cultural / product presentation",
  },
  "arcwave-integrations": {
    category: "Commercial Surface",
    proofType: "Case Prototype",
    status: "prototype",
    shortDescription:
      "A technical installation service system that turns telecom, networks, electricity, security, EV charging, smart home and audio into one readable infrastructure path.",
    longDescription:
      "ARCWAVE proves how technical services can be presented as a calm infrastructure interface: connected services, proof metrics, service paths, install flow and quote brief create a clearer first buyer conversation.",
    tags: ["Infrastructure UX", "Technical services", "Install brief", "Quote flow"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.premiumLanding, sharedServicePaths.productDemo],
    relatedCases: ["form-index", "creatorops"],
    clientType: "Technical services / installation companies",
  },
  "casa-nube": {
    category: "Premium Website",
    proofType: "Live Website",
    status: "live",
    shortDescription:
      "A premium multilingual hospitality surface with editorial structure, mobile-first service flow and clear local business presentation.",
    longDescription:
      "Casa Nube proves how a small hospitality business can use language-aware content, menu structure, visitor utility and local rhythm to feel premium without becoming visually heavy.",
    tags: ["Hospitality", "Multilingual", "Mobile-first", "Local business"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.premiumLanding],
    relatedCases: ["oria-house-barcelona", "barcelona-private-advisory"],
    clientType: "Hospitality / local business",
  },
  "print-border-studio": {
    category: "Creative Tool",
    proofType: "Product Prototype",
    status: "prototype",
    shortDescription:
      "A creative production tool for print borders, export logic, artwork inspection and collector-facing presentation.",
    longDescription:
      "Print Border Studio proves how a specialist creative utility can combine precise production controls, artwork preview, queue logic and presentation value in one focused product interface.",
    tags: ["Creative tool", "Print production", "Canvas UI", "Export workflow"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.productDemo, sharedServicePaths.interactiveSystems],
    relatedCases: ["creatorops", "fluid-exhibition"],
    clientType: "Artists / studios / print workflows",
  },
  "house-of-lune": {
    category: "Premium Website",
    proofType: "Live Website",
    status: "live",
    shortDescription:
      "A premium product-world presentation surface for luxury objects, private inquiry and visual storytelling.",
    longDescription:
      "House of Lune proves how luxury objects, jewelry, fashion or collectible products can move beyond generic ecommerce grids into a controlled product world with editorial pacing, private inquiry, multilingual structure and stronger trust.",
    tags: ["Luxury product", "Private inquiry", "Product presentation", "Multilingual"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.premiumLanding, sharedServicePaths.interactiveSystems],
    relatedCases: ["creatorops", "barcelona-private-advisory"],
    clientType: "Luxury objects / founder-led product worlds",
    searchContent: {
      type: "Premium product presentation website.",
      audience:
        "Luxury objects, jewelry, fashion, collectible products, private commerce and founder-led product worlds.",
      problem:
        "Premium products often lose perceived value when shown through generic ecommerce grids or template pages.",
      approach:
        "The interface treats the product as a visual world through controlled typography, editorial pacing, product proof, inquiry logic and refined media surfaces.",
      outcome:
        "The case demonstrates how a small product collection can become a premium digital surface with stronger trust, atmosphere and conversion intent.",
      productionFacts: [
        "Responsive front-end",
        "Product media system",
        "Inquiry path",
        "Premium visual hierarchy",
        "Metadata-ready structure",
      ],
      relatedServices: [sharedServicePaths.premiumLanding, sharedServicePaths.interactiveSystems],
    },
    translations: {
      es: spanishCaseRegistryTranslations["house-of-lune"],
    },
  },
  creatorops: {
    category: "Product Interface",
    proofType: "Product Prototype",
    status: "in_progress",
    shortDescription:
      "CreatorOps is an export-first creator workflow system that turns scattered visual assets into a ready-to-publish Week Pack: Library, Smart Mix, planning, captions, ZIP export, client review and profile handoff.",
    longDescription:
      "CreatorOps proves how creator tooling can become a calm export-first operating system instead of another noisy scheduler dashboard. It is positioned as a prototype direction, not a production SaaS with live billing, accounts, backend storage or direct Instagram publishing.",
    tags: ["Creator workflow", "Product interface", "Smart Mix", "Export workflow"],
    ctaLabel: "View case",
    relatedServices: [sharedServicePaths.productDemo, sharedServicePaths.interactiveSystems, sharedServicePaths.premiumLanding],
    relatedCases: ["print-border-studio", "house-of-lune"],
    clientType: "Creators / small brands / content teams",
    searchContent: {
      type: "Creator workflow product interface / beta-ready prototype.",
      audience:
        "Creators, small brands, content managers and creative studios preparing weekly content packs.",
      problem:
        "Creator workflows often start with scattered visual assets, unclear sequencing and disconnected caption and export tasks.",
      approach:
        "CreatorOps structures the work into Library, Smart Mix, Sequence, Planner, Captions, Export, Client Review, Profile Handoff and Media Converter layers.",
      outcome:
        "The project demonstrates how a creator tool can become a calm export-first operating system instead of another noisy scheduler dashboard.",
      productionFacts: [
        "React",
        "TypeScript",
        "Vite",
        "Responsive product UI",
        "Local-first prototype logic",
        "ZIP and export-ready workflow direction",
      ],
      relatedServices: [sharedServicePaths.productDemo, sharedServicePaths.interactiveSystems, sharedServicePaths.premiumLanding],
    },
    translations: {
      es: spanishCaseRegistryTranslations.creatorops,
    },
  },
};

function getCaseLink(item: CaseBase, pattern: RegExp) {
  return item.content?.links?.find((link) => pattern.test(link.label))?.href;
}

function toStackList(stackLabel: string) {
  return stackLabel
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean);
}

function enrichCase(item: CaseBase): Case {
  const registry = caseRegistryBySlug[item.slug];

  if (!registry) {
    throw new Error(`Missing case registry metadata for ${item.slug}`);
  }

  return {
    ...item,
    ...registry,
    liveUrl: registry.liveUrl ?? getCaseLink(item, /live/i),
    repoUrl: registry.repoUrl ?? getCaseLink(item, /repo/i),
    previewImage: registry.previewImage ?? item.poster.src,
    ogImage: registry.ogImage ?? registry.previewImage ?? item.poster.src,
    alt: registry.alt ?? item.poster.alt,
    stack: registry.stack ?? toStackList(item.stackLabel),
  };
}

export const cases: Case[] = caseItems.map(enrichCase);

export const publicCaseSlugs = cases.map((item) => item.slug);

export function getCaseCanonicalSlug(slug: string) {
  return slug === "bcn-advisory" ? "barcelona-private-advisory" : slug;
}

export function getCasePath(slug: string) {
  return `/work/${getCaseCanonicalSlug(slug)}`;
}

export function getCaseBySlug(slug: string | undefined) {
  if (!slug) return null;
  const canonicalSlug = slug === "barcelona-private-advisory" ? "bcn-advisory" : slug;
  return cases.find((item) => item.slug === canonicalSlug) ?? null;
}
