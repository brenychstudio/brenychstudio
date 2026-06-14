import { getAvailableSystem } from "./availableSystems";
import { cases, type Case, type CaseFrame } from "./cases";
import { workEvidenceBySlug } from "./workEvidence";

export type CaseStoryType =
  | "luxury-product"
  | "premium-website"
  | "product-system"
  | "workflow-tool"
  | "presentation-system"
  | "tool"
  | "hospitality"
  | "advisory"
  | "experimental";

export type CaseMediaRole = "hero" | "detail" | "mobile" | "flow" | "proof";

export type CaseAvailabilityStatus =
  | "available"
  | "custom-only"
  | "concept-reference"
  | "not-available";

export type CaseMediaFit = "cover" | "contain";
export type CaseMediaObjectPosition = "top" | "center" | "bottom";

export type CaseStoryMedia = {
  id: string;
  kind?: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  label: string;
  caption: string;
  role: CaseMediaRole;
  fit?: CaseMediaFit;
  objectPosition?: CaseMediaObjectPosition;
};

export type CaseStory = {
  slug: string;
  caseType: CaseStoryType;
  label: string;
  headline: string;
  subheadline: string;
  summary: string;
  proofClaim: string;
  evidencePoints: string[];
  systemTags: string[];
  systemLayers: {
    title: string;
    text: string;
  }[];
  mediaSequence: CaseStoryMedia[];
  interactionLogic: string;
  commercialLogic: string;
  technicalFoundation: string[];
  availability?: {
    status: CaseAvailabilityStatus;
    label: string;
    summary: string;
    bestFor?: string[];
    adaptationIncludes?: string[];
    licensingNote?: string;
    exclusivityAvailable?: boolean;
    ctaLabel: string;
  };
  links?: {
    label: string;
    href: string;
  }[];
};

const authoredCaseStories: CaseStory[] = [
  {
    slug: "house-of-lune",
    caseType: "product-system",
    label: "CASE SYSTEM / AVAILABLE FOUNDATION / PRODUCT SURFACE",
    headline: "House of Lune",
    subheadline: "A cinematic maison for luxury objects.",
    summary:
      "A premium product-world presentation surface for luxury objects, private inquiry and visual storytelling. The case shows how jewelry, fashion and collectible products can move beyond generic ecommerce grids into a controlled digital maison.",
    proofClaim:
      "Luxury commerce becomes a system when atmosphere, product focus, trust, and private inquiry move as one surface.",
    evidencePoints: [
      "Products are presented as rare objects, not catalogue inventory.",
      "Conversion becomes appointment-led and private, replacing checkout pressure with trust.",
      "Routing, dynamic product pages, editorial content, and deployment-ready engineering work together.",
    ],
    systemTags: [
      "Luxury product",
      "Private inquiry",
      "Multilingual",
      "Dynamic product pages",
      "Editorial motion",
      "Available foundation",
    ],
    systemLayers: [
      {
        title: "Visual direction",
        text:
          "Moonlit Object Theatre: near-black surfaces, warm ivory typography, controlled light, and product imagery staged as material evidence.",
      },
      {
        title: "Content architecture",
        text:
          "Homepage, collection, product detail, craftsmanship, philosophy, journal, and contact surfaces are organized as one product presentation website for private commerce.",
      },
      {
        title: "Motion grammar",
        text:
          "Slow reveals, soft transitions, image drift, and hover tension mark focus without turning luxury into noise.",
      },
      {
        title: "Interaction / inquiry flow",
        text:
          "Private viewing, availability requests, and appointment language guide the user toward considered contact instead of buy-now behavior.",
      },
      {
        title: "Responsive structure",
        text:
          "The mobile system preserves atmosphere, product focus, and editorial rhythm while reducing the interface into compact private-maison logic.",
      },
      {
        title: "Production front-end",
        text:
          "A responsive Next.js App Router foundation with structured product data, reusable editorial components, metadata-ready routes, Open Graph preparation, and Cloudflare Workers deployment.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        kind: "video",
        src: "/cases/house-of-lune/video/house-of-lune-video.mp4",
        poster: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
        alt: "House of Lune walkthrough video",
        label: "System walkthrough",
        caption:
          "The full surface shows a maison journey: cinematic entry, product focus, editorial pacing, and private conversion.",
        role: "hero",
      },
      {
        id: "threshold",
        src: "/cases/house-of-lune/desktop/house-of-lune-hero.webp",
        alt: "House of Lune desktop hero",
        label: "Threshold",
        caption:
          "The hero establishes desire before utility: darkness, controlled light, and object-led positioning carry the first proof.",
        role: "hero",
      },
      {
        id: "desktop-1",
        src: "/cases/house-of-lune/desktop/house-of-lune-1.webp",
        alt: "House of Lune homepage composition",
        label: "Maison entry",
        caption:
          "The opening surface introduces the maison world through controlled pace, editorial spacing, and object-led atmosphere.",
        role: "detail",
      },
      {
        id: "desktop-2",
        src: "/cases/house-of-lune/desktop/house-of-lune-2.webp",
        alt: "House of Lune editorial product section",
        label: "Editorial product field",
        caption:
          "Product desire is supported by editorial rhythm before the interface asks for commercial action.",
        role: "detail",
      },
      {
        id: "collection",
        src: "/cases/house-of-lune/desktop/house-of-lune-3.webp",
        alt: "House of Lune collection surface",
        label: "Collection logic",
        caption:
          "Collection pages behave like a private salon system rather than a dense product grid.",
        role: "proof",
      },
      {
        id: "craft",
        src: "/cases/house-of-lune/desktop/house-of-lune-4.webp",
        alt: "House of Lune craftsmanship page",
        label: "Craft narrative",
        caption:
          "Craftsmanship content gives the product world trust, material context, and editorial depth.",
        role: "detail",
      },
      {
        id: "inquiry",
        src: "/cases/house-of-lune/desktop/house-of-lune-5.webp",
        alt: "House of Lune private inquiry surface",
        label: "Private inquiry",
        caption:
          "Conversion is framed as a private appointment and availability conversation, not a generic checkout event.",
        role: "flow",
      },
      {
        id: "desktop-6",
        src: "/cases/house-of-lune/desktop/house-of-lune-6.webp",
        alt: "House of Lune maison philosophy surface",
        label: "Maison philosophy",
        caption:
          "The brand layer gives the commercial system a quieter position: values, restraint, and luxury context.",
        role: "detail",
      },
      {
        id: "desktop-7",
        src: "/cases/house-of-lune/desktop/house-of-lune-7.webp",
        alt: "House of Lune journal and editorial surface",
        label: "Editorial layer",
        caption:
          "Journal-style content extends the product system into a reusable storytelling foundation.",
        role: "flow",
      },
      {
        id: "mobile",
        src: "/cases/house-of-lune/mobile/house-of-lune-mb-1.webp",
        alt: "House of Lune mobile collection surface",
        label: "Mobile surface",
        caption: "Compact mobile product theatre with luxury rhythm.",
        role: "mobile",
      },
      {
        id: "mobile-nav",
        src: "/cases/house-of-lune/mobile/house-of-lune-mb-2.webp",
        alt: "House of Lune mobile navigation surface",
        label: "Mobile navigation",
        caption:
          "Compact navigation translates the private maison journey into a handheld surface.",
        role: "mobile",
      },
      {
        id: "mobile-product",
        src: "/cases/house-of-lune/mobile/house-of-lune-mb-3.webp",
        alt: "House of Lune mobile product detail",
        label: "Mobile product",
        caption:
          "The product detail remains object-led and private even when reduced to a narrow mobile frame.",
        role: "mobile",
      },
      {
        id: "mobile-editorial",
        src: "/cases/house-of-lune/mobile/house-of-lune-mb-4.webp",
        alt: "House of Lune mobile editorial content",
        label: "Mobile editorial",
        caption:
          "Editorial depth carries through the handheld version without collapsing into a simple catalogue.",
        role: "mobile",
      },
      {
        id: "mobile-inquiry",
        src: "/cases/house-of-lune/mobile/house-of-lune-mb-5.webp",
        alt: "House of Lune mobile private inquiry form",
        label: "Mobile inquiry",
        caption:
          "The private request flow remains calm and appointment-led on mobile.",
        role: "mobile",
      },
    ],
    interactionLogic:
      "Motion is not decoration here. It marks product focus, reveal, navigation, inquiry, and trust. The rhythm is slow enough to feel private, but structured enough to keep commercial movement clear.",
    commercialLogic:
      "House of Lune shifts premium commerce away from inventory pressure and toward selected contact: desire first, proof second, inquiry when the user is ready.",
    technicalFoundation: [
      "Next.js App Router with TypeScript.",
      "Multilingual routes for English, French, and Spanish.",
      "Dynamic product detail pages through structured product data.",
      "Reusable editorial components and motion primitives.",
      "Open Graph metadata and image preparation.",
      "Cloudflare Workers deployment through OpenNext.",
    ],
    availability: {
      status: "available",
      label: "Available as a system foundation.",
      summary:
        "House of Lune can be adapted into a commissioned luxury product, fashion, jewelry, collector object, or private commerce system.",
      bestFor: ["Jewelry", "Fashion", "Collector objects", "Premium commerce"],
      adaptationIncludes: [
        "Brand and content adaptation",
        "Product structure adjustment",
        "Inquiry flow customization",
        "Responsive production polish",
        "Deployment-ready front-end",
      ],
      licensingNote:
        "Exclusivity can be discussed for selected commissions. Final ownership, content, visual reuse, and adaptation terms are defined per project.",
      exclusivityAvailable: true,
      ctaLabel: "Adapt this system",
    },
    links: [
      {
        label: "View live case",
        href: "https://house-of-lune.brenychinfo.workers.dev/en",
      },
      {
        label: "Repository",
        href: "https://github.com/brenychstudio/House-of-Lune",
      },
    ],
  },
  {
    slug: "barcelona-private-advisory",
    caseType: "advisory",
    label: "CASE SYSTEM / PRIVATE PROPERTY INTELLIGENCE",
    headline: "Barcelona Private Advisory",
    subheadline: "Private property intelligence system.",
    summary:
      "A high-trust advisory website concept for private real estate, curated buyer journeys and premium inquiry flows. The prototype is built around buyer intent, Barcelona Lens, acquisition signals, shortlist dossiers, property inspection and advisory handoff.",
    proofClaim:
      "Private advisory becomes a system when buyer intent, district intelligence, ranked candidates, shortlist evidence, inspection, and inquiry handoff move as one guided path.",
    evidencePoints: [
      "The interface starts from buyer intent before properties compete for attention.",
      "Barcelona Lens makes district intelligence visible inside the property decision.",
      "The final output is an advisor-ready dossier and viewing request, not generic browsing.",
    ],
    systemTags: [
      "Private property intelligence",
      "Barcelona Lens",
      "Shortlist dossier",
      "Inquiry handoff",
      "Bilingual",
      "Available foundation",
    ],
    systemLayers: [
      {
        title: "Buyer intent layer",
        text:
          "The experience begins with acquisition context, so the buyer brief shapes the search before listings take over.",
      },
      {
        title: "Barcelona Lens Field",
        text:
          "District intelligence, lifestyle fit, and location signals become visible decision material rather than hidden advisory knowledge.",
      },
      {
        title: "Private search surface",
        text:
          "Property cards are treated as acquisition signals with readiness, priority, and buyer-fit context.",
      },
      {
        title: "Private Shortlist Dossier",
        text:
          "Saved selections become a dossier for comparison, trade-off review, and advisor-ready conversation.",
      },
      {
        title: "Advisory inquiry handoff",
        text:
          "Search context, selected properties, timing, and buyer notes become a structured viewing request for a clearer first advisory conversation.",
      },
      {
        title: "Responsive structure",
        text:
          "Mobile keeps the same intelligence model readable across lens, dossier, field card, inspection, request brief and multilingual-ready advisory states.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        kind: "video",
        src: "/cases/bcn-advisory/v2/bcn-advisory-video.mp4",
        poster: "/cases/bcn-advisory/v2/bcn-advisory-video-poster.webp",
        alt: "Barcelona Private Advisory walkthrough video",
        label: "Intelligence walkthrough",
        caption:
          "The walkthrough moves through lens, private search, shortlist dossier, property inspection, and advisory handoff.",
        role: "hero",
      },
      {
        id: "threshold",
        src: "/cases/bcn-advisory/v2/bcn-advisory-hero.webp",
        alt: "Barcelona Private Advisory private property intelligence hero",
        label: "Intelligence threshold",
        caption:
          "The hero positions the project as a private property intelligence system: brief, lens, signal, dossier, and action.",
        role: "hero",
      },
      {
        id: "collection",
        src: "/cases/bcn-advisory/v2/bcn-advisory-intent-lens.webp",
        alt: "Barcelona Private Advisory buyer intent lens",
        label: "Intent lens",
        caption:
          "Buyer intent defines the lens before properties compete for attention.",
        role: "proof",
      },
      {
        id: "craft",
        src: "/cases/bcn-advisory/v2/bcn-advisory-barcelona-lens-field.webp",
        alt: "Barcelona Private Advisory Barcelona Lens Field",
        label: "Barcelona Lens",
        caption:
          "District intelligence becomes visible, connecting acquisition intent with neighborhood rhythm and fit.",
        role: "detail",
      },
      {
        id: "desktop-3",
        src: "/cases/bcn-advisory/v2/bcn-advisory-shortlist-dossier.webp",
        alt: "Barcelona Private Advisory private shortlist dossier",
        label: "Shortlist dossier",
        caption:
          "Saved properties become a Private Shortlist Dossier for comparison, trade-off review, and advisor-ready handoff.",
        role: "proof",
      },
      {
        id: "inquiry",
        src: "/cases/bcn-advisory/v2/bcn-advisory-media-led-acquisition.webp",
        alt: "Barcelona Private Advisory media-led acquisition signal",
        label: "Acquisition signal",
        caption:
          "Media-led cards turn property browsing into acquisition signals with priority and buyer-fit context.",
        role: "flow",
      },
      {
        id: "desktop-5",
        src: "/cases/bcn-advisory/v2/bcn-advisory-visual-proof-send.webp",
        alt: "Barcelona Private Advisory visual proof ready to send",
        label: "Visual proof",
        caption:
          "The shortlist becomes visual proof, ready to move from browsing into a prepared conversation.",
        role: "flow",
      },
      {
        id: "desktop-6",
        src: "/cases/bcn-advisory/v2/bcn-advisory-lens-expanded.webp",
        alt: "Barcelona Private Advisory expanded district lens",
        label: "Expanded lens",
        caption:
          "Map, district notes, fast-scan index, and selected properties stay visible inside one advisory surface.",
        role: "detail",
      },
      {
        id: "desktop-7",
        src: "/cases/bcn-advisory/v2/bcn-advisory-advisory-shortlist.webp",
        alt: "Barcelona Private Advisory advisory shortlist logic",
        label: "Advisory shortlist",
        caption:
          "A buyer brief is translated into ranked advisory candidates rather than another listing grid.",
        role: "proof",
      },
      {
        id: "desktop-8",
        src: "/cases/bcn-advisory/v2/bcn-advisory-shortlist-grid.webp",
        alt: "Barcelona Private Advisory ranked shortlist grid",
        label: "Ranked candidates",
        caption:
          "Price, signal, readiness, and fit stay visible so comparison keeps its advisory context.",
        role: "proof",
      },
      {
        id: "desktop-9",
        src: "/cases/bcn-advisory/v2/bcn-advisory-property-detail.webp",
        alt: "Barcelona Private Advisory property detail intelligence screen",
        label: "Property intelligence",
        caption:
          "Property detail behaves like guided evaluation with media, priority, fit notes, and advisor summary.",
        role: "detail",
      },
      {
        id: "desktop-10",
        src: "/cases/bcn-advisory/v2/bcn-advisory-inspection-preview.webp",
        alt: "Barcelona Private Advisory inspection preview",
        label: "Inspection preview",
        caption:
          "Inspection preview keeps imagery, fit, and readiness together before the buyer requests a viewing.",
        role: "detail",
      },
      {
        id: "desktop-11",
        src: "/cases/bcn-advisory/v2/bcn-advisory-gallery-review.webp",
        alt: "Barcelona Private Advisory gallery review",
        label: "Gallery review",
        caption:
          "Gallery review supports focused private inspection without flattening the experience into a portal lightbox.",
        role: "detail",
      },
      {
        id: "desktop-12",
        src: "/cases/bcn-advisory/v2/bcn-advisory-private-advisory-method.webp",
        alt: "Barcelona Private Advisory private advisory method page",
        label: "Advisory method",
        caption:
          "The method page explains the system: brief, lens, signal, dossier, and action.",
        role: "flow",
      },
      {
        id: "desktop-13",
        src: "/cases/bcn-advisory/v2/bcn-advisory-inquiry-handoff.webp",
        alt: "Barcelona Private Advisory inquiry handoff",
        label: "Inquiry handoff",
        caption:
          "The final output turns search, selected properties, and timing into a copy-ready viewing request.",
        role: "flow",
      },
      {
        id: "mobile",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-hero-lens.webp",
        alt: "Barcelona Private Advisory mobile hero and lens",
        label: "Mobile lens",
        caption: "Mobile opens with the same brief, lens, signal, dossier, and action structure.",
        role: "mobile",
      },
      {
        id: "mobile-nav",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-media-signal.webp",
        alt: "Barcelona Private Advisory mobile media-led acquisition signal",
        label: "Mobile signal",
        caption:
          "Mobile cards preserve acquisition signal, priority, and save actions without becoming a noisy feed.",
        role: "mobile",
      },
      {
        id: "mobile-inquiry",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-dossier-ready.webp",
        alt: "Barcelona Private Advisory mobile advisor-ready dossier",
        label: "Mobile dossier",
        caption:
          "Selected properties become an advisor-ready dossier with buyer intent still visible.",
        role: "mobile",
      },
      {
        id: "mobile-gallery",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-menu.webp",
        alt: "Barcelona Private Advisory mobile private advisory menu",
        label: "Mobile menu",
        caption:
          "The private advisory menu keeps primary path, trust, and request actions compact.",
        role: "mobile",
      },
      {
        id: "mobile-shortlist",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-shortlist-dossier.webp",
        alt: "Barcelona Private Advisory mobile shortlist dossier",
        label: "Mobile shortlist",
        caption:
          "Shortlisted properties become a mobile dossier for trade-off review and request preparation.",
        role: "mobile",
      },
      {
        id: "mobile-field",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-field-card.webp",
        alt: "Barcelona Private Advisory mobile field card",
        label: "Mobile field card",
        caption:
          "Field cards keep readiness, guide price, request path, and saved state in one compact scan.",
        role: "mobile",
      },
      {
        id: "mobile-detail",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-property-detail.webp",
        alt: "Barcelona Private Advisory mobile property detail",
        label: "Mobile property",
        caption:
          "Property detail keeps recommendation, acquisition file, guide price, and gallery action close together.",
        role: "mobile",
      },
      {
        id: "mobile-inspection",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-inspection-gallery.webp",
        alt: "Barcelona Private Advisory mobile inspection gallery",
        label: "Mobile inspection",
        caption:
          "Private inspection mode gives the buyer a focused image review without leaving the advisory path.",
        role: "mobile",
      },
      {
        id: "mobile-method",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-advisory-method.webp",
        alt: "Barcelona Private Advisory mobile advisory method",
        label: "Mobile method",
        caption:
          "The mobile method explains why private advisory selection works better than catalog browsing.",
        role: "mobile",
      },
      {
        id: "mobile-request",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-request-brief.webp",
        alt: "Barcelona Private Advisory mobile request brief",
        label: "Mobile request brief",
        caption:
          "Request Brief turns the final message into structured advisory context before first contact.",
        role: "mobile",
      },
      {
        id: "mobile-viewing",
        src: "/cases/bcn-advisory/v2/bcn-advisory-mobile-viewing-path.webp",
        alt: "Barcelona Private Advisory mobile viewing path request",
        label: "Mobile viewing path",
        caption:
          "Viewing path captures source, next action, preferred timing, and buyer notes without becoming a generic form.",
        role: "mobile",
      },
    ],
    interactionLogic:
      "Motion supports buyer confidence: calm reveals, shortlist feedback, inspection review, and inquiry handoff stay restrained so the advisory value remains clear.",
    commercialLogic:
      "Barcelona Private Advisory shifts real-estate browsing away from portal volume and toward private property intelligence: brief first, district lens second, dossier third, inquiry handoff when the buyer is ready.",
    technicalFoundation: [
      "Astro / React islands / TypeScript",
      "Multilingual-ready structure",
      "Search, shortlist, and dossier UI logic",
      "Responsive buyer journey",
      "Metadata / Open Graph preparation",
      "Deployment-ready front-end",
    ],
    availability: {
      status: "available",
      label: "Available as an advisory foundation.",
      summary:
        "Barcelona Private Advisory can be adapted into a commissioned real-estate, hospitality, destination, or private-service intelligence surface.",
      bestFor: ["Real estate advisory", "Private consulting", "Hospitality", "Curated services"],
      adaptationIncludes: [
        "Territory and content adaptation",
        "Search and shortlist structure",
        "Private intake customization",
        "Bilingual route setup",
        "Deployment-ready front-end",
      ],
      licensingNote:
        "Final ownership, territory exclusivity, content, media reuse, and adaptation terms are defined per project.",
      exclusivityAvailable: true,
      ctaLabel: "Adapt this system",
    },
    links: [
      {
        label: "View live case",
        href: "https://barcelona-private-advisory.pages.dev/",
      },
      {
        label: "Repository",
        href: "https://github.com/brenychstudio/Barcelona-Private-Advisory",
      },
    ],
  },
  {
    slug: "creatorops",
    caseType: "workflow-tool",
    label: "CASE SYSTEM / WORKFLOW TOOL / CREATOR PUBLISHING",
    headline: "CreatorOps",
    subheadline: "Creator workflow interface system.",
    summary:
      "CreatorOps is an export-first creator workflow system that turns scattered visual assets into a ready-to-publish Week Pack: Library, Smart Mix, planning, captions, ZIP export direction, client review, profile handoff and media conversion.",
    proofClaim:
      "Creator workflow becomes a system when scattered assets, planning, captions, export, review, and handoff move toward one ready-to-publish Week Pack.",
    evidencePoints: [
      "Raw visual assets enter the system as selectable publishing candidates.",
      "Export assembles a ready-to-publish Week Pack instead of leaving content scattered across tools.",
      "Client Review, Profile Handoff, and Media Converter keep approval and utility steps inside one calm product environment.",
    ],
    systemTags: [
      "Creator workflow",
      "Smart Mix",
      "Client Review",
      "Media Converter",
      "React prototype",
      "Product interface",
    ],
    systemLayers: [
      {
        title: "Workflow architecture",
        text:
          "Library, Smart Mix, Planner, Captions, Export, Client Review, Profile Handoff / Bio Builder, and Media Converter are shaped as one guided creator publishing flow.",
      },
      {
        title: "Decision layer",
        text:
          "Smart Mix ranks combinations, avoids repetition, and turns scattered visual assets into clearer publishing candidates before planning begins.",
      },
      {
        title: "Export-first planning",
        text:
          "Planner, Captions and Export turn selected visuals into a structured Week Pack, so the workflow moves toward usable output instead of isolated files.",
      },
      {
        title: "Client review",
        text:
          "Feedback and approval are treated as a product layer, keeping collaborator review calm and structured.",
      },
      {
        title: "Handoff and utility",
        text:
          "Profile Handoff / Bio Builder and Media Converter keep delivery and utility work inside the product environment without breaking the premium interface tone.",
      },
      {
        title: "Responsive product UI",
        text:
          "A React, TypeScript, Vite, and Tailwind foundation supports a beta-ready workflow prototype with local-first logic, stateful surfaces, responsive product UI and export-ready workflow direction.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        kind: "video",
        src: "/cases/creatorops/v2/creatorops-video.mp4",
        poster: "/cases/creatorops/v2/creatorops-video-poster.webp",
        alt: "CreatorOps walkthrough video",
        label: "System walkthrough",
        caption:
          "The walkthrough shows creator publishing, client review, profile handoff, and utility tools moving through one product-interface prototype.",
        role: "hero",
      },
      {
        id: "threshold",
        src: "/cases/creatorops/v2/creatorops-hero.webp",
        alt: "CreatorOps workflow interface hero screen",
        label: "Workflow threshold",
        caption:
          "The hero positions CreatorOps as a calm workflow interface system for creator publishing.",
        role: "hero",
      },
      {
        id: "desktop-1",
        src: "/cases/creatorops/v2/creatorops-workflow-overview.webp",
        alt: "CreatorOps workflow overview screen",
        label: "Workflow overview",
        caption:
          "The product is framed as an export-first workspace for turning scattered creator assets into a ready-to-publish Week Pack.",
        role: "detail",
      },
      {
        id: "desktop-2",
        src: "/cases/creatorops/v2/creatorops-week-focus.webp",
        alt: "CreatorOps weekly focus planning screen",
        label: "Week focus",
        caption:
          "Weekly and campaign planning stay visible without becoming a calendar-heavy product.",
        role: "detail",
      },
      {
        id: "desktop-3",
        src: "/cases/creatorops/v2/creatorops-pricing-plans.webp",
        alt: "CreatorOps pricing plans screen",
        label: "Pricing plans",
        caption:
          "The plan surface frames the prototype as a serious creator workflow product direction.",
        role: "detail",
      },
      {
        id: "desktop-4",
        src: "/cases/creatorops/v2/creatorops-roadmap.webp",
        alt: "CreatorOps roadmap screen",
        label: "Roadmap",
        caption:
          "Roadmap content shows how the workflow can expand through review, tools, automation, and publishing support.",
        role: "detail",
      },
      {
        id: "desktop-5",
        src: "/cases/creatorops/v2/creatorops-waitlist.webp",
        alt: "CreatorOps waitlist screen",
        label: "Waitlist",
        caption:
          "Waitlist intake turns product interest into a restrained beta entry point.",
        role: "flow",
      },
      {
        id: "collection",
        src: "/cases/creatorops/v2/creatorops-library-grid.webp",
        alt: "CreatorOps content library grid",
        label: "Library grid",
        caption:
          "Raw visual assets enter the system as selectable publishing candidates.",
        role: "proof",
      },
      {
        id: "desktop-7",
        src: "/cases/creatorops/v2/creatorops-library-expanded.webp",
        alt: "CreatorOps expanded content library screen",
        label: "Expanded library",
        caption:
          "Selection, ranking, and content context remain readable inside the darker product environment.",
        role: "proof",
      },
      {
        id: "craft",
        src: "/cases/creatorops/v2/creatorops-publishing-flow.webp",
        alt: "CreatorOps publishing flow screen",
        label: "Publishing flow",
        caption:
          "Selected visuals, captions, and timing cues are shaped into an export-ready publishing flow.",
        role: "detail",
      },
      {
        id: "desktop-10",
        src: "/cases/creatorops/v2/creatorops-artwork-detail.webp",
        alt: "CreatorOps artwork detail screen",
        label: "Artwork detail",
        caption:
          "Artwork detail supports inspection, content context, and handoff decisions without leaving the workflow.",
        role: "proof",
      },
      {
        id: "desktop-11",
        src: "/cases/creatorops/v2/creatorops-client-feedback.webp",
        alt: "CreatorOps client feedback screen",
        label: "Client feedback",
        caption:
          "Feedback is shaped as a calm review layer rather than a scattered comment thread.",
        role: "proof",
      },
      {
        id: "inquiry",
        src: "/cases/creatorops/v2/creatorops-client-review.webp",
        alt: "CreatorOps client review screen",
        label: "Client review",
        caption:
          "Collaborators can approve, comment, and refine content direction inside the product.",
        role: "flow",
      },
      {
        id: "desktop-13",
        src: "/cases/creatorops/v2/creatorops-profile-handoff.webp",
        alt: "CreatorOps profile handoff screen",
        label: "Profile handoff",
        caption:
          "The publishing pack continues into profile context, bio direction, and creator-facing output.",
        role: "flow",
      },
      {
        id: "desktop-14",
        src: "/cases/creatorops/v2/creatorops-media-converter.webp",
        alt: "CreatorOps media converter interface",
        label: "Media Converter",
        caption:
          "Utility tools stay inside the product environment without breaking the premium interface tone.",
        role: "flow",
      },
    ],
    interactionLogic:
      "Motion supports product calm: route transitions, modular workflow states, export checkpoints, review surfaces, and utility layers help the user understand progress without burying the interface.",
    commercialLogic:
      "CreatorOps shifts creator tooling away from scattered assets and generic dashboards toward an export-first workflow: select, rank, plan, caption, review, export, and hand off visual content.",
    technicalFoundation: [
      "React + TypeScript + Vite",
      "Tailwind CSS product UI",
      "Workflow logic and stateful surfaces",
      "Responsive interface structure",
      "Export-oriented flow architecture",
      "Cloudflare Pages deployment",
    ],
    availability: {
      status: "concept-reference",
      label: "Available as workflow direction.",
      summary:
        "CreatorOps can inform a custom creator tool, content operations system, internal publishing workflow, or export-first product-interface prototype.",
      bestFor: ["Creator tools", "Content teams", "Publishing workflows", "Product prototypes"],
      adaptationIncludes: [
        "Custom workflow modelling",
        "Product UI direction",
        "Review and handoff architecture",
        "Utility layer planning",
      ],
      licensingNote:
        "Available as reference for a custom commissioned product direction, not as a direct reuse of the current concept.",
      ctaLabel: "Discuss similar direction",
    },
    links: [
      {
        label: "View live case",
        href: "https://creatorops.pages.dev/",
      },
      {
        label: "Repository",
        href: "https://github.com/brenychstudio/CreatorOps",
      },
    ],
  },
];

type V2CaseConfig = {
  caseType: CaseStoryType;
  label: string;
  subheadline: string;
  proofClaim: string;
  systemLayers: CaseStory["systemLayers"];
  interactionLogic: string;
  commercialLogic: string;
  technicalFoundation: string[];
  systemTags?: string[];
  evidencePoints?: string[];
  mediaLabels?: Record<string, string>;
};

const v2CaseConfigs: Record<string, V2CaseConfig> = {
  "aurel-eon-gt": {
    caseType: "luxury-product",
    label: "CASE SYSTEM / AUTOMOTIVE CONCEPT / LIVING PRODUCT EXPERIENCE",
    subheadline: "Living automotive product experience.",
    proofClaim:
      "Premium automotive websites become product systems when the car is revealed through atmosphere, signal, inspection, gallery logic, drive character, and private preview rather than static marketing blocks.",
    systemLayers: [
      {
        title: "Arrival field",
        text:
          "The hero introduces the fictional electric grand tourer as a presence shaped by silence, signal, motion, and cinematic restraint.",
      },
      {
        title: "Presence Rail",
        text:
          "Navigation behaves as a product signal rail, tracking active section, mood state, and progression through the experience.",
      },
      {
        title: "Cinematic inspect",
        text:
          "Inspect mode opens a sequence of product states with wheel, keyboard, and button navigation instead of a single modal.",
      },
      {
        title: "Gallery archive",
        text:
          "The visual archive uses active image, filmstrip navigation, wheel browsing, transitions, and metadata as product evidence.",
      },
      {
        title: "Drive character",
        text:
          "The composer reframes configuration as an emotional choice between Silent Range, Night Signal, and Controlled Force.",
      },
      {
        title: "Private preview",
        text:
          "The final conversion surface avoids generic contact behavior and closes with a concierge-style introduction path.",
      },
    ],
    interactionLogic:
      "Interaction is built around section-based mood transitions, active presence tracking, Next Signal progression, cinematic inspect overlays, ghost-frame depth, gallery wheel browsing, product-view expansion, and simplified mobile app-like states.",
    commercialLogic:
      "AUREL EON GT proves that a fictional automotive launch can feel commercially legible and experimental at the same time: premium art direction, product storytelling, reusable interface systems, and honest prototype framing stay connected.",
    technicalFoundation: [
      "Vite",
      "React",
      "TypeScript",
      "React Router",
      "Tailwind CSS v4",
      "CSS custom properties",
      "Motion for React",
      "Zustand state store",
      "Custom wheel / keyboard interaction logic",
      "WebP media pipeline",
      "Isolated future XR / WebGL architecture",
    ],
    systemTags: ["Automotive concept", "Cinematic UX", "Product system", "Interactive storytelling", "Responsive"],
    evidencePoints: [
      "Moves beyond a generic automotive landing page",
      "Turns the car into a sequence of cinematic product states",
      "Keeps future XR / WebGL exploration isolated from the fast image-led site",
    ],
    mediaLabels: {
      "aurel-eon-gt-hero": "Arrival field",
      "aurel-eon-gt-exterior-field": "Exterior field",
      "aurel-eon-gt-rear-light-signature": "Rear signal",
      "aurel-eon-gt-cabin-quiet": "Cabin quiet",
      "aurel-eon-gt-materiality": "Materiality",
      "aurel-eon-gt-private-preview": "Private preview",
      "aurel-eon-gt-drive-character-composer": "Drive character",
      "aurel-eon-gt-product-view-expansion": "Product view",
      "aurel-eon-gt-gallery-archive": "Gallery archive",
      "aurel-eon-gt-light-signature": "Light signature",
      "aurel-eon-gt-case-exit": "Case exit",
      "aurel-eon-gt-mobile-hero": "Mobile arrival",
      "aurel-eon-gt-mobile-cabin-quiet": "Mobile cabin",
      "aurel-eon-gt-mobile-inspect-exterior": "Mobile inspect",
      "aurel-eon-gt-mobile-drive-character": "Mobile drive",
      "aurel-eon-gt-mobile-gallery-archive": "Mobile gallery",
      "aurel-eon-gt-mobile-interface-intelligence": "Mobile intelligence",
      "aurel-eon-gt-mobile-light-signature": "Mobile signal",
      "aurel-eon-gt-mobile-private-preview": "Mobile preview",
      "aurel-eon-gt-mobile-inspect-drive": "Mobile inspect drive",
      "aurel-eon-gt-mobile-case-exit": "Mobile exit",
    },
  },
  "oria-house-barcelona": {
    caseType: "hospitality",
    label: "CASE SYSTEM / BOUTIQUE HOTEL / HOSPITALITY INTERFACE",
    subheadline: "Boutique hotel hospitality system.",
    proofClaim:
      "Hotel concept websites become systems when atmosphere, room decision support, experience layers, location context, and booking contact move as one calm guest path.",
    systemLayers: [
      {
        title: "Atmospheric entry",
        text:
          "The hero, courtyard, and warm photography establish the stay as a quiet Barcelona retreat before pushing conversion.",
      },
      {
        title: "Room decision support",
        text:
          "Room rhythm, comparison, grids, detail pages, and galleries help guests choose without flattening the hotel into inventory.",
      },
      {
        title: "Experience layer",
        text:
          "Spa ritual, breakfast, dining, terrace, and weekend packages expand the concept beyond rooms.",
      },
      {
        title: "Mobile guest path",
        text:
          "Mobile screens keep hero, room choice, room detail, experiences, and contact readable as one practical handheld journey.",
      },
      {
        title: "Location context",
        text:
          "Barcelona map and local rhythm content ground the concept without turning it into a generic travel guide.",
      },
      {
        title: "Booking contact",
        text:
          "Inquiry remains clear and calm, shaped as contact for a concept hotel rather than a claimed live booking engine.",
      },
    ],
    interactionLogic:
      "Motion and screen rhythm stay warm, slow, and editorial so room selection, gallery inspection, experience browsing, and contact feel like part of the hotel atmosphere.",
    commercialLogic:
      "Oria House proves a hospitality case can balance desire and utility: guests feel the stay, compare rooms, inspect details, and reach contact without a template-hotel pattern.",
    technicalFoundation: [
      "Astro 5",
      "Static site generation",
      "TypeScript",
      "Tailwind CSS v4",
      "Astro components",
      "Vanilla JavaScript interaction layers",
      "Local asset registry for demo photography",
      "Multilingual EN/ES routing",
      "Dynamic room / offer / experience pages",
    ],
    systemTags: ["Hotel concept", "Hospitality UX", "Room comparison", "Booking contact", "Responsive"],
    evidencePoints: [
      "Connects cinematic atmosphere with practical room selection",
      "Turns rooms and experiences into one guest decision path",
      "Keeps booking contact clear without claiming a live reservation platform",
    ],
    mediaLabels: {
      "oria-house-hero": "Hotel threshold",
      "oria-house-suite-story": "Suite story",
      "oria-house-arrival-mood": "Arrival mood",
      "oria-house-stay-before-city": "Stay before city",
      "oria-house-room-rhythm": "Room rhythm",
      "oria-house-room-compare": "Room compare",
      "oria-house-room-grid": "Room grid",
      "oria-house-deluxe-comfort": "Deluxe detail",
      "oria-house-suite-gallery": "Suite gallery",
      "oria-house-room-detail": "Room detail",
      "oria-house-local-rhythm": "Local rhythm",
      "oria-house-room-collection": "Room collection",
      "oria-house-spa-ritual": "Spa ritual",
      "oria-house-experience-card": "Experience card",
      "oria-house-signature-breakfast": "Breakfast ritual",
      "oria-house-dining-evening": "Dining evening",
      "oria-house-location-map": "Location map",
      "oria-house-booking-contact": "Booking contact",
      "oria-house-mobile-hero": "Mobile threshold",
      "oria-house-mobile-courtyard-arrival": "Mobile arrival",
      "oria-house-mobile-room-rhythm": "Mobile rooms",
      "oria-house-mobile-room-compare": "Mobile compare",
      "oria-house-mobile-studio-courtyard": "Mobile studio",
      "oria-house-mobile-deluxe-comfort": "Mobile deluxe",
      "oria-house-mobile-deluxe-gallery": "Mobile gallery",
      "oria-house-mobile-terrace-breakfast": "Mobile terrace",
      "oria-house-mobile-romance-weekend": "Mobile package",
      "oria-house-mobile-spa-ritual": "Mobile spa",
      "oria-house-mobile-signature-breakfast": "Mobile breakfast",
      "oria-house-mobile-dining-evening": "Mobile dining",
      "oria-house-mobile-booking-contact": "Mobile contact",
    },
  },
  sprintcrm: {
    caseType: "workflow-tool",
    label: "CASE SYSTEM / OPERATOR WORKFLOW / INTERNAL CRM",
    subheadline: "Operator CRM workflow system.",
    proofClaim:
      "Internal CRM becomes a system when import, daily action, pipeline, reporting, and operator focus move as one controlled workspace.",
    systemLayers: [
      {
        title: "Import architecture",
        text:
          "XLSX and CSV intake, mapping, row preview, duplicate awareness, and import reporting turn messy lead lists into controlled data entry.",
      },
      {
        title: "Operator workspace",
        text:
          "Lead tables, filters, selected rows, and drawer-based detail review keep outreach work focused on the next useful action.",
      },
      {
        title: "Daily workflow",
        text:
          "Today queue, next-action dates, lead status, and activity history shape the CRM around what the operator needs to do now.",
      },
      {
        title: "Pipeline control",
        text:
          "Stage-based boards and active-contact views keep warm opportunities visible without turning the product into dashboard noise.",
      },
      {
        title: "Reporting surface",
        text:
          "Reports summarize funnel health, sources, niches, overdue work, and active leads as practical operational feedback.",
      },
      {
        title: "AI-ready foundation",
        text:
          "The architecture leaves space for assisted drafting and follow-up intelligence while keeping review and sending under manual control.",
      },
    ],
    interactionLogic:
      "Interaction is designed for repeated daily use: import feedback, drawer focus, status updates, theme switching, and reports all stay compact and operator-led.",
    commercialLogic:
      "SprintCRM proves that a portfolio can carry real internal-product thinking: workflow clarity, data-backed states, and a serious tool surface rather than only marketing pages.",
    technicalFoundation: [
      "React + TypeScript + Vite",
      "Supabase-backed CRM records",
      "XLSX / CSV import flow",
      "Lead and activity data model",
      "Pipeline and reports logic",
      "Multilingual UI and theme persistence",
    ],
    mediaLabels: {
      "sprintcrm-hero": "Signal Gate",
      "sprintcrm-1": "Import upload",
      "sprintcrm-2": "Import mapping",
      "sprintcrm-3": "Dark import",
      "sprintcrm-4": "Import report",
      "sprintcrm-5": "Leads database",
      "sprintcrm-6": "Light leads",
      "sprintcrm-7": "Lead drawer",
      "sprintcrm-8": "Dark drawer",
      "sprintcrm-9": "Pipeline board",
      "sprintcrm-10": "Dark pipeline",
      "sprintcrm-11": "Today queue",
      "sprintcrm-12": "Action workflow",
      "sprintcrm-13": "Active contacts",
      "sprintcrm-14": "Reports dashboard",
    },
  },
  "fluid-exhibition": {
    caseType: "experimental",
    label: "CASE SYSTEM / CULTURAL SURFACE / EXHIBITION IDENTITY",
    subheadline: "QR-driven exhibition interface system.",
    proofClaim:
      "Exhibition identity becomes a system when artist pages, QR access, multilingual content, venue context, and motion atmosphere stay connected.",
    systemLayers: [
      {
        title: "Exhibition entry",
        text:
          "The landing surface frames the event as a coherent digital layer rather than a disposable announcement page.",
      },
      {
        title: "Artist architecture",
        text:
          "Each artist page works as a direct QR destination while still carrying the shared exhibition identity.",
      },
      {
        title: "Multilingual context",
        text:
          "Locale-aware content keeps event information, artist data, and visitor context readable across languages.",
      },
      {
        title: "Motion atmosphere",
        text:
          "Fluid visual motion gives the system a memorable cultural identity without overpowering the content.",
      },
      {
        title: "Mobile visitor path",
        text:
          "The mobile experience supports scan-to-context behavior for visitors moving through a physical exhibition.",
      },
      {
        title: "Deployment surface",
        text:
          "The microsite is shaped as a lightweight cultural platform that can be deployed quickly under event constraints.",
      },
    ],
    interactionLogic:
      "Motion behaves as exhibition atmosphere: reflective, slow enough to read, and structured around artist access instead of decorative spectacle.",
    commercialLogic:
      "FLUID turns a physical event into reusable cultural infrastructure: visitors can enter through QR, artists get dedicated context, and the exhibition gains a coherent digital identity.",
    technicalFoundation: [
      "Astro + React islands",
      "TypeScript + Tailwind CSS",
      "Locale-based content structure",
      "QR-ready artist pages",
      "Responsive exhibition surfaces",
      "Cloudflare Pages deployment",
    ],
    mediaLabels: {
      "fluid-hero": "Exhibition threshold",
      "fluid-1": "Artist system",
      "fluid-2": "Artist profile",
      "fluid-3": "Information blocks",
      "fluid-mb-1": "Mobile entry",
      "fluid-mb-2": "Mobile exhibition",
      "fluid-mb-3": "Mobile artist list",
      "fluid-mb-4": "Mobile artist page",
    },
  },
  "form-index": {
    caseType: "presentation-system",
    label: "CASE SYSTEM / EDITORIAL MOTION / PRESENTATION ENGINE",
    subheadline: "Scroll-driven editorial interface system.",
    proofClaim:
      "Editorial motion becomes a system when sticky composition, section progress, image rhythm, and controlled reveal behave as one authored surface.",
    systemLayers: [
      {
        title: "Sticky stage",
        text:
          "Sections are composed as a directed stage, letting content progress through focus states instead of static blocks.",
      },
      {
        title: "Motion grammar",
        text:
          "Opacity, blur, scale, and progress signals work together to make scrolling feel stable, smooth, and intentional.",
      },
      {
        title: "Editorial hierarchy",
        text:
          "Large spacing, restrained typography, and image-led pacing keep the experience premium without adding noise.",
      },
      {
        title: "Product rhythm",
        text:
          "Lookbook, selected pieces, surfaces, and detail views form a repeatable presentation architecture.",
      },
      {
        title: "Mobile translation",
        text:
          "The mobile system preserves the same quiet hierarchy and image sequencing inside a narrower reading path.",
      },
      {
        title: "Reusable foundation",
        text:
          "The architecture can become a studio archive, product index, editorial launch, or multilingual presentation system.",
      },
    ],
    interactionLogic:
      "The experience is driven by section progress and active-state choreography, giving motion a structural role instead of treating it as an effect layer.",
    commercialLogic:
      "FORM INDEX proves a reusable presentation foundation for premium archives, product systems, lookbooks, and editorial launches where polish is part of trust.",
    technicalFoundation: [
      "Vite + React + TypeScript",
      "Tailwind CSS v4",
      "Motion transitions",
      "Sticky stage architecture",
      "Section progress logic",
      "Responsive presentation system",
    ],
    mediaLabels: {
      "fr-hero": "Editorial threshold",
      "fr-1": "Sticky stage",
      "fr-2": "Campaign surface",
      "fr-3": "Transition state",
      "fr-4": "Surface studies",
      "fr-5": "Editorial grouping",
      "fr-6": "Product focus",
      "fr-7": "Progress flow",
      "fr-8": "Lookbook volumes",
      "fr-9": "Selected pieces",
      "fr-mob-1": "Mobile landing",
      "fr-mob-2": "Mobile surfaces",
      "fr-mob-3": "Mobile lookbook",
      "fr-mob-4": "Mobile selection",
      "fr-mob-5": "Mobile sequence",
    },
  },
  "arcwave-integrations": {
    caseType: "premium-website",
    label: "CASE SYSTEM / INFRASTRUCTURE INTERFACE",
    subheadline: "Infrastructure interface system.",
    proofClaim:
      "Technical service websites become systems when invisible infrastructure, service paths, proof metrics, install logic, quote flow, and deployment discipline move together.",
    systemLayers: [
      {
        title: "Connected infrastructure",
        text:
          "Telecom, networks, electricity, security, EV charging, smart home, and audio are framed as one technical layer.",
      },
      {
        title: "Service path logic",
        text:
          "Each service has a clear entry point, but the interface keeps the buyer inside one connected installation system.",
      },
      {
        title: "Proof metrics",
        text:
          "Reliability, active scopes, installed systems, and connected services become visible evidence before inquiry.",
      },
      {
        title: "Install flow",
        text:
          "Process sections explain how a signal, need, or service request becomes an installed technical result.",
      },
      {
        title: "Quote brief",
        text:
          "The request path turns technical uncertainty into a clearer install brief instead of a cold generic form.",
      },
      {
        title: "Production polish",
        text:
          "Typed content, responsive surfaces, view transitions, deployment setup, and route discipline make the concept feel operational.",
      },
    ],
    interactionLogic:
      "Transitions and page states stay restrained so the infrastructure model reads clearly, with motion supporting service grouping, process rhythm, and quote readiness.",
    commercialLogic:
      "ARCWAVE translates technical installation work into a premium buyer path: understand the connected layer, choose a service, trust the process, then request a clear install brief.",
    technicalFoundation: [
      "Astro + TypeScript",
      "React islands",
      "Bilingual route system",
      "Typed content architecture",
      "Astro View Transitions",
      "Cloudflare Pages deployment",
    ],
    mediaLabels: {
      "arcwave-hero": "Infrastructure threshold",
      "arcwave-connected-layer": "Connected layer",
      "arcwave-proof-metrics": "Proof metrics",
      "arcwave-service-system": "Service system",
      "arcwave-install-paths": "Install paths",
      "arcwave-infrastructure-modules": "Infrastructure modules",
      "arcwave-decision-interface": "Decision interface",
      "arcwave-networks-wifi": "Networks / Wi-Fi",
      "arcwave-quote-form": "Quote form",
      "arcwave-install-flow": "Install flow",
      "arcwave-commercial-infrastructure": "Commercial infrastructure",
      "arcwave-engineering-clarity": "Engineering clarity",
      "arcwave-install-brief": "Install brief",
      "arcwave-technical-spec": "Technical spec",
      "arcwave-mobile-hero": "Mobile threshold",
      "arcwave-mobile-connected-services": "Mobile services",
      "arcwave-mobile-menu": "Mobile menu",
      "arcwave-mobile-proof-metrics": "Mobile proof",
      "arcwave-mobile-service-grid": "Mobile service grid",
      "arcwave-mobile-process": "Mobile process",
      "arcwave-mobile-telecom-detail": "Mobile service detail",
      "arcwave-mobile-need-card": "Mobile need card",
      "arcwave-mobile-quote-cta": "Mobile quote CTA",
    },
  },
  "casa-nube": {
    caseType: "hospitality",
    label: "CASE SYSTEM / HOSPITALITY FOUNDATION / LOCAL SERVICE",
    subheadline: "Multilingual hospitality website system.",
    proofClaim:
      "Hospitality websites become systems when atmosphere, menu clarity, visitor utility, multilingual content, and mobile action stay in one surface.",
    systemLayers: [
      {
        title: "Atmospheric entry",
        text:
          "The homepage presents the cafe as a warm digital facade while keeping practical visitor actions close.",
      },
      {
        title: "Web-native menu",
        text:
          "Menu content is structured as readable web UI instead of being hidden behind a PDF-first restaurant pattern.",
      },
      {
        title: "Visit utility",
        text:
          "Hours, location, maps, reservation signals, WhatsApp, Instagram, and practical notes become the conversion layer.",
      },
      {
        title: "Multilingual foundation",
        text:
          "ES, EN, and CA structure makes the hospitality surface useful for local and visitor audiences.",
      },
      {
        title: "Mobile-first action",
        text:
          "Sticky mobile actions support the real visitor path: menu, reserve, maps, and local decision-making.",
      },
      {
        title: "Reusable vertical",
        text:
          "The foundation can adapt to cafes, brunch places, boutique bakeries, restaurants, and small local service brands.",
      },
    ],
    interactionLogic:
      "Motion is soft and practical: route transitions, reveal rhythm, hover states, and footer movement support hospitality warmth without slowing down visitor decisions.",
    commercialLogic:
      "Casa Nube turns a local hospitality website into a reusable premium vertical: atmosphere first, utility close, contact and visit decisions always reachable.",
    technicalFoundation: [
      "Next.js App Router + TypeScript",
      "Tailwind CSS",
      "next-intl multilingual routing",
      "Static export",
      "Responsive QA",
      "Cloudflare Pages deployment",
    ],
    mediaLabels: {
      "casa-hero": "Hospitality threshold",
      "casa-1": "Menu preview",
      "casa-2": "Space and light",
      "casa-3": "Menu page",
      "casa-4": "Visit utility",
      "casa-5": "Location planning",
      "casa-mob-1": "Mobile home",
      "casa-mob-2": "Mobile menu intro",
      "casa-mob-3": "Mobile menu",
      "casa-mob-4": "Mobile visit",
      "casa-mob-5": "Mobile actions",
    },
  },
  "print-border-studio": {
    caseType: "tool",
    label: "CASE SYSTEM / PRODUCTION TOOL / PRINT WORKFLOW",
    subheadline: "Fine-art print preparation system.",
    proofClaim:
      "Creative production becomes a system when preview accuracy, border logic, queue state, inspection, and export readiness stay inside one focused tool.",
    systemLayers: [
      {
        title: "Border engine",
        text:
          "Museum-style margins, format choices, and visual balance are controlled in a dedicated print-preparation surface.",
      },
      {
        title: "Artwork preview",
        text:
          "The tool centers the image as the primary decision object, keeping controls close without crowding judgment.",
      },
      {
        title: "Workspace modes",
        text:
          "Light and dark surfaces support different review contexts while preserving the same production logic.",
      },
      {
        title: "Inspection flow",
        text:
          "Preview and focused review states let users evaluate proportion and presentation before export.",
      },
      {
        title: "Queue logic",
        text:
          "Multiple artworks can move through a repeatable preparation workflow instead of one-off manual setup.",
      },
      {
        title: "Export readiness",
        text:
          "The interface is shaped around preparing usable output, not simply decorating a gallery-style mockup.",
      },
    ],
    interactionLogic:
      "Controls, preview, inspection, and export states stay functional and calm because print preparation needs precision more than visual flourish.",
    commercialLogic:
      "Print Border Studio shows how a creative utility can become a premium product surface for artists, photographers, print studios, and collector-oriented workflows.",
    technicalFoundation: [
      "React + TypeScript",
      "Canvas-oriented preview logic",
      "Local workflow state",
      "Export preparation",
      "Desktop-first tool layout",
      "Cloudflare Pages deployment",
    ],
    mediaLabels: {
      "psb-hero": "Production surface",
      "psb-1": "Light controls",
      "psb-2": "Dark workspace",
      "psb-3": "Border workflow",
      "psb-4": "Preview inspect",
      "psb-5": "Museum frame",
      psb6: "Gallery mode",
    },
  },
};

const generatedCaseStorySlugs = [
  "aurel-eon-gt",
  "oria-house-barcelona",
  "sprintcrm",
  "fluid-exhibition",
  "form-index",
  "arcwave-integrations",
  "casa-nube",
  "print-border-studio",
] as const;

function getMediaStem(src: string) {
  return src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? src;
}

function toMediaLabel(frame: CaseFrame, config: V2CaseConfig, fallback: string) {
  const stem = getMediaStem(frame.src);
  if (config.mediaLabels?.[stem]) return config.mediaLabels[stem];

  const cleanedAlt = frame.alt
    ?.replace(/^[^-]+-\s*/, "")
    .replace(/frame\s*0?\d+/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleanedAlt || fallback;
}

function toMediaRole(desktopIndex: number): CaseMediaRole {
  if (desktopIndex === 1) return "proof";
  if (desktopIndex === 2) return "detail";
  if (desktopIndex === 3) return "flow";
  return desktopIndex % 3 === 1 ? "proof" : desktopIndex % 3 === 2 ? "detail" : "flow";
}

function toMediaId(desktopIndex: number) {
  if (desktopIndex === 1) return "collection";
  if (desktopIndex === 2) return "craft";
  if (desktopIndex === 3) return "inquiry";
  return `desktop-${desktopIndex}`;
}

function isMobileFrame(frame: CaseFrame) {
  return frame.device === "mobile" || frame.aspect === "phone" || frame.src.includes("/mobile/");
}

function getMediaPresentation(
  frame: Pick<CaseFrame, "aspect" | "src">,
  config: Pick<V2CaseConfig, "caseType">,
): Pick<CaseStoryMedia, "fit" | "objectPosition"> {
  if (frame.aspect === "phone" || frame.src.includes("/mobile/")) {
    return { fit: "contain", objectPosition: "top" };
  }

  if (config.caseType === "advisory" || config.caseType === "workflow-tool" || config.caseType === "tool") {
    return { fit: "cover", objectPosition: "top" };
  }

  return { fit: "contain", objectPosition: "center" };
}

function getThresholdFrame(source: Case) {
  const frames = source.content?.frames?.filter((frame) => frame.kind !== "video") ?? [];
  const posterFrame = frames.find((frame) => frame.src === source.poster.src);
  const heroPosterFrame = frames.find((frame) => frame.src === source.content?.hero?.poster);

  return (
    posterFrame ?? heroPosterFrame ?? {
      src: source.poster.src,
      alt: source.poster.alt,
      caption: source.tagline,
    }
  );
}

function createMediaSequence(source: Case, config: V2CaseConfig): CaseStoryMedia[] {
  const sequence: CaseStoryMedia[] = [];
  const hero = source.content?.hero;
  const threshold = getThresholdFrame(source);

  if (hero?.kind === "video") {
    sequence.push({
      id: "walkthrough",
      kind: "video",
      src: hero.src,
      poster: hero.poster ?? threshold.src,
      alt: hero.alt ?? `${source.title} walkthrough video`,
      label: "System walkthrough",
      caption: hero.caption ?? source.content?.summary ?? source.tagline,
      role: "hero",
      ...getMediaPresentation(hero, config),
    });
  }

  sequence.push({
    id: "threshold",
    src: threshold.src,
    alt: threshold.alt ?? `${source.title} case threshold`,
    label: config.mediaLabels?.[getMediaStem(threshold.src)] ?? "Threshold",
    caption: threshold.caption ?? source.content?.summary ?? source.tagline,
    role: "hero",
    ...getMediaPresentation(threshold, config),
  });

  const frames = source.content?.frames?.filter((frame) => frame.kind !== "video" && frame.src !== threshold.src) ?? [];
  let desktopIndex = 0;
  let mobileIndex = 0;

  frames.forEach((frame) => {
    if (isMobileFrame(frame)) {
      mobileIndex += 1;
      sequence.push({
        id: `mobile-${mobileIndex}`,
        src: frame.src,
        alt: frame.alt ?? `${source.title} mobile frame ${mobileIndex}`,
        label: toMediaLabel(frame, config, `Mobile ${mobileIndex}`),
        caption: frame.caption ?? source.content?.summary ?? source.tagline,
        role: "mobile",
        ...getMediaPresentation(frame, config),
      });
      return;
    }

    desktopIndex += 1;
    sequence.push({
      id: toMediaId(desktopIndex),
      src: frame.src,
      alt: frame.alt ?? `${source.title} desktop frame ${desktopIndex}`,
      label: toMediaLabel(frame, config, `Desktop ${desktopIndex}`),
      caption: frame.caption ?? source.content?.summary ?? source.tagline,
      role: toMediaRole(desktopIndex),
      ...getMediaPresentation(frame, config),
    });
  });

  return sequence;
}

function normalizeStoryMedia(story: CaseStory): CaseStory {
  return {
    ...story,
    mediaSequence: story.mediaSequence.map((media) => {
      if (media.fit) return media;

      if (media.role === "mobile" || media.src.includes("/mobile/")) {
        return { ...media, fit: "contain", objectPosition: media.objectPosition ?? "top" };
      }

      if (story.caseType === "advisory" || story.caseType === "workflow-tool" || story.caseType === "tool") {
        return { ...media, fit: "cover", objectPosition: media.objectPosition ?? "top" };
      }

      return { ...media, fit: "contain", objectPosition: media.objectPosition ?? "center" };
    }),
  };
}

function createAvailability(source: Case): CaseStory["availability"] {
  const availability = getAvailableSystem(source.slug);
  if (availability.status === "not-available") return undefined;

  return {
    status: availability.status,
    label:
      availability.status === "available"
        ? "Available as a system foundation."
        : availability.status === "custom-only"
          ? "Available as a custom direction."
          : "Available as a concept reference.",
    summary: availability.summary,
    bestFor: availability.bestFor,
    adaptationIncludes: availability.adaptationIncludes,
    licensingNote: availability.licensingNote,
    exclusivityAvailable: availability.exclusivityAvailable,
    ctaLabel: availability.ctaLabel,
  };
}

function createGeneratedCaseStory(slug: string): CaseStory {
  const source = cases.find((item) => item.slug === slug);
  const config = v2CaseConfigs[slug];
  const evidence = workEvidenceBySlug[slug];

  if (!source || !config || !evidence) {
    throw new Error(`Missing V2 case story source for ${slug}`);
  }

  return {
    slug: source.slug,
    caseType: config.caseType,
    label: config.label,
    headline: source.title,
    subheadline: config.subheadline,
    summary: source.content?.summary ?? source.tagline,
    proofClaim: config.proofClaim,
    evidencePoints: config.evidencePoints ?? evidence.proofPoints,
    systemTags: config.systemTags ?? evidence.systemTags,
    systemLayers: config.systemLayers,
    mediaSequence: createMediaSequence(source, config),
    interactionLogic: config.interactionLogic,
    commercialLogic: config.commercialLogic,
    technicalFoundation: config.technicalFoundation,
    availability: createAvailability(source),
    links: source.content?.links,
  };
}

const generatedCaseStories = generatedCaseStorySlugs.map((slug) => createGeneratedCaseStory(slug));

export const caseStories: CaseStory[] = [...authoredCaseStories, ...generatedCaseStories].map(normalizeStoryMedia);

const caseStorySlugAliases: Record<string, string> = {
  "bcn-advisory": "barcelona-private-advisory",
};

export function getCaseStory(slug: string | undefined) {
  const canonicalSlug = slug ? caseStorySlugAliases[slug] ?? slug : undefined;
  return caseStories.find((story) => story.slug === canonicalSlug) ?? null;
}
