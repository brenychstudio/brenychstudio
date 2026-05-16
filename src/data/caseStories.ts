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

export type CaseStoryMedia = {
  id: string;
  kind?: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  label: string;
  caption: string;
  role: CaseMediaRole;
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
    subheadline: "Luxury product interface system.",
    summary:
      "A cinematic product surface for jewelry, fashion, collector objects, and premium commerce, built as a multilingual inquiry-ready interface.",
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
          "Homepage, collection, product detail, craftsmanship, philosophy, journal, and contact surfaces are organized as one maison journey.",
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
          "A Next.js App Router foundation with structured content, reusable editorial components, metadata, and Cloudflare Workers deployment.",
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
    label: "CASE SYSTEM / ADVISORY FOUNDATION / PROPERTY SURFACE",
    headline: "Barcelona Private Advisory",
    subheadline: "Mediterranean advisory interface system.",
    summary:
      "A calm bilingual advisory surface for Barcelona property discovery, built around shortlist logic, district fit, private intake, and premium buyer pacing.",
    proofClaim:
      "Private advisory becomes a system when buyer intent, location intelligence, curated search, shortlist logic, and private inquiry move as one guided path.",
    evidencePoints: [
      "The interface starts from acquisition context instead of listing noise.",
      "Properties are framed as a guided shortlist, not an endless portal.",
      "The next step is advisory contact, not generic browsing.",
    ],
    systemTags: [
      "Advisory surface",
      "District lens",
      "Shortlist logic",
      "Private intake",
      "Bilingual",
      "Available foundation",
    ],
    systemLayers: [
      {
        title: "Visual direction",
        text:
          "Mediterranean calm, warm light, restrained interface density, and buyer-first editorial framing replace portal noise.",
      },
      {
        title: "Search architecture",
        text:
          "Search is shaped around curated discovery, buyer fit, and practical narrowing instead of a high-volume listing grid.",
      },
      {
        title: "District / location lens",
        text:
          "Neighborhood context becomes part of the property decision, connecting place, lifestyle, and acquisition intent.",
      },
      {
        title: "Shortlist logic",
        text:
          "Saved selections become an advisory artifact, helping buyers move from browsing to a structured private conversation.",
      },
      {
        title: "Inquiry flow",
        text:
          "Bilingual access, WhatsApp, email, and copy-brief actions turn interest into a calmer private intake moment.",
      },
      {
        title: "Responsive structure",
        text:
          "Mobile keeps the buyer journey light: property cards, shortlist review, and focused gallery inspection stay easy to scan.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        kind: "video",
        src: "/cases/bcn-advisory/video/bcn-advisory-video.mp4",
        poster: "/cases/bcn-advisory/desktop/bcn-advisory-hero.webp",
        alt: "Barcelona Private Advisory walkthrough video",
        label: "Advisory walkthrough",
        caption:
          "The full surface reframes property browsing into a curated Barcelona-first buyer journey.",
        role: "hero",
      },
      {
        id: "threshold",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-hero.webp",
        alt: "Barcelona Private Advisory desktop hero",
        label: "Advisory threshold",
        caption:
          "The hero positions Spain Costas through a calmer, more selective advisory-first property experience.",
        role: "hero",
      },
      {
        id: "collection",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-1.webp",
        alt: "Barcelona Private Advisory search surface",
        label: "Curated search",
        caption:
          "Search becomes an advisory filter system rather than a listing dump.",
        role: "proof",
      },
      {
        id: "craft",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-2.webp",
        alt: "Barcelona Private Advisory district lens",
        label: "District lens",
        caption:
          "Location intelligence connects property decisions with neighborhood rhythm, lifestyle fit, and Barcelona context.",
        role: "detail",
      },
      {
        id: "desktop-3",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-3.webp",
        alt: "Barcelona Private Advisory property detail surface",
        label: "Property review",
        caption:
          "Property detail is framed as guided evaluation, pairing imagery, context, and decision support.",
        role: "proof",
      },
      {
        id: "inquiry",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-4.webp",
        alt: "Barcelona Private Advisory shortlist drawer",
        label: "Shortlist intake",
        caption:
          "Saved properties turn into a structured advisory selection before private contact.",
        role: "flow",
      },
      {
        id: "desktop-5",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-5.webp",
        alt: "Barcelona Private Advisory contact and intake surface",
        label: "Private contact",
        caption:
          "Contact is shaped as a buyer-intake moment with direct channels and a calmer advisory frame.",
        role: "flow",
      },
      {
        id: "desktop-6",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-6.webp",
        alt: "Barcelona Private Advisory bilingual advisory content",
        label: "Bilingual context",
        caption:
          "The system can stretch into bilingual and territory-aware content without losing the premium buyer rhythm.",
        role: "detail",
      },
      {
        id: "mobile",
        src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-1.webp",
        alt: "Barcelona Private Advisory mobile homepage",
        label: "Mobile advisory",
        caption: "Mobile preserves the advisory-first message and premium property framing.",
        role: "mobile",
      },
      {
        id: "mobile-nav",
        src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-2.webp",
        alt: "Barcelona Private Advisory mobile property cards",
        label: "Mobile cards",
        caption:
          "Mobile property cards keep browsing calm, selective, and shortlist-oriented.",
        role: "mobile",
      },
      {
        id: "mobile-inquiry",
        src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-3.webp",
        alt: "Barcelona Private Advisory mobile shortlist",
        label: "Mobile shortlist",
        caption:
          "Saved apartments become a compact private advisory selection on mobile.",
        role: "mobile",
      },
      {
        id: "mobile-gallery",
        src: "/cases/bcn-advisory/mobile/bcn-advisory-mb-4.webp",
        alt: "Barcelona Private Advisory mobile property gallery",
        label: "Mobile gallery",
        caption:
          "Gallery inspection keeps the property decision visual and compact inside the mobile buyer path.",
        role: "mobile",
      },
    ],
    interactionLogic:
      "Motion supports buyer confidence: calm reveals, shortlist feedback, gallery review, and private intake stay restrained so the advisory value remains clear.",
    commercialLogic:
      "Barcelona Private Advisory shifts real-estate browsing away from portal volume and toward curated selection: fit first, district proof second, private intake when the buyer is ready.",
    technicalFoundation: [
      "Astro / React islands / TypeScript",
      "Multilingual-ready structure",
      "Search and shortlist UI logic",
      "Responsive buyer journey",
      "Metadata / Open Graph preparation",
      "Deployment-ready front-end",
    ],
    availability: {
      status: "available",
      label: "Available as an advisory foundation.",
      summary:
        "Barcelona Private Advisory can be adapted into a commissioned real-estate, hospitality, destination, or private-service advisory surface.",
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
    label: "CASE SYSTEM / WORKFLOW FOUNDATION / CREATOR OPS",
    headline: "CreatorOps",
    subheadline: "Creator workflow interface system.",
    summary:
      "A beta-ready content workflow prototype for creators and small content teams, built around Library, Smart Mix, Sequence, Planner, Captions, Export, and Bio Builder.",
    proofClaim:
      "Creator workflow becomes a system when scattered assets, decision logic, publishing rhythm, export files, and profile tools move as one guided pipeline.",
    evidencePoints: [
      "Smart Mix narrows scattered visual assets into ranked content candidates.",
      "Export produces a real downloadable publishing pack instead of a static dashboard preview.",
      "Bio Builder extends the pack into a profile-ready creator tool layer.",
    ],
    systemTags: [
      "Creator workflow",
      "Smart Mix",
      "Export pack",
      "Bio Builder",
      "React prototype",
      "Available foundation",
    ],
    systemLayers: [
      {
        title: "Workflow architecture",
        text:
          "Library, Smart Mix, Sequence, Planner, Captions, Export, and Bio Builder are shaped as one route-driven product loop.",
      },
      {
        title: "Decision layer",
        text:
          "Smart Mix ranks 3x3 candidates, avoids repetition, supports variety guardrails, and explains why a mix works.",
      },
      {
        title: "Output logic",
        text:
          "Export turns selected assets, captions, hashtags, CSV, manifest, README, and structured text into a practical downloadable pack.",
      },
      {
        title: "Tools extension",
        text:
          "Bio Builder acts as the first standalone tool, connecting exported content with profile positioning and downloadable profile briefs.",
      },
      {
        title: "Interface density",
        text:
          "The UI keeps workflow controls, preview cards, state feedback, and machine readouts visible without turning the product into clutter.",
      },
      {
        title: "Production-shaped front-end",
        text:
          "A Vite, React, TypeScript, Tailwind, Router, Motion, JSZip, and Cloudflare Pages foundation supports a usable live beta.",
      },
    ],
    mediaSequence: [
      {
        id: "walkthrough",
        kind: "video",
        src: "/cases/creatorops/video/creatorops-video.mp4",
        poster: "/cases/creatorops/desktop/creatorops-hero.webp",
        alt: "CreatorOps walkthrough video",
        label: "System walkthrough",
        caption:
          "The full product loop shows content intake, Smart Mix, planning, export, and Bio Builder as one creator workflow.",
        role: "hero",
      },
      {
        id: "threshold",
        src: "/cases/creatorops/desktop/creatorops-hero.webp",
        alt: "CreatorOps desktop hero",
        label: "Workflow threshold",
        caption:
          "The hero frames CreatorOps as a calm operating system for turning content chaos into a publishing pipeline.",
        role: "hero",
      },
      {
        id: "collection",
        src: "/cases/creatorops/desktop/creatorops-6.webp",
        alt: "CreatorOps library and Smart Mix workspace",
        label: "Library intake",
        caption:
          "The workspace turns visual assets into selected candidates with machine readouts and workflow controls.",
        role: "proof",
      },
      {
        id: "desktop-1",
        src: "/cases/creatorops/desktop/creatorops-1.webp",
        alt: "CreatorOps desktop landing surface",
        label: "Product promise",
        caption:
          "The landing surface presents the product promise, creator outcome, and premium SaaS direction.",
        role: "detail",
      },
      {
        id: "desktop-2",
        src: "/cases/creatorops/desktop/creatorops-2.webp",
        alt: "CreatorOps system logic section",
        label: "System logic",
        caption:
          "The system logic section explains the calm guardrails behind content planning and publishing decisions.",
        role: "detail",
      },
      {
        id: "desktop-3",
        src: "/cases/creatorops/desktop/creatorops-3.webp",
        alt: "CreatorOps creator output narrative",
        label: "Creator outcome",
        caption:
          "The creator-facing promise is translated into a clear mobile-output and publishing-pack narrative.",
        role: "detail",
      },
      {
        id: "desktop-5",
        src: "/cases/creatorops/desktop/creatorops-5.webp",
        alt: "CreatorOps roadmap and monetization surface",
        label: "Roadmap surface",
        caption:
          "Roadmap and monetization content shows how the prototype can expand into a larger creator workflow product.",
        role: "flow",
      },
      {
        id: "craft",
        src: "/cases/creatorops/desktop/creatorops-9.webp",
        alt: "CreatorOps Smart Mix output",
        label: "Smart Mix logic",
        caption:
          "Smart Mix converts selected assets into ranked 3x3 content directions with practical decision support.",
        role: "detail",
      },
      {
        id: "desktop-7",
        src: "/cases/creatorops/desktop/creatorops-7.webp",
        alt: "CreatorOps dark asset selection workspace",
        label: "Asset workspace",
        caption:
          "The dark prototype workspace shows asset selection, state-driven layout, and product-like interface density.",
        role: "proof",
      },
      {
        id: "desktop-8",
        src: "/cases/creatorops/desktop/creatorops-8.webp",
        alt: "CreatorOps light workspace variation",
        label: "Review mode",
        caption:
          "A light workspace variation demonstrates the product system across visual modes and review contexts.",
        role: "proof",
      },
      {
        id: "desktop-10",
        src: "/cases/creatorops/desktop/creatorops-10.webp",
        alt: "CreatorOps captions and planning workspace",
        label: "Caption planner",
        caption:
          "Captions and planning connect content selection with publishing rhythm and output structure.",
        role: "flow",
      },
      {
        id: "desktop-11",
        src: "/cases/creatorops/desktop/creatorops-11.webp",
        alt: "CreatorOps export and tools state",
        label: "Export state",
        caption:
          "The export and tools state shows how the workflow continues beyond visual selection.",
        role: "flow",
      },
      {
        id: "inquiry",
        src: "/cases/creatorops/desktop/creatorops-12.webp",
        alt: "CreatorOps Bio Builder workspace",
        label: "Tools handoff",
        caption:
          "Bio Builder extends the export pack into profile direction, generated variants, and downloadable profile context.",
        role: "flow",
      },
      {
        id: "desktop-13",
        src: "/cases/creatorops/desktop/creatorops-13.webp",
        alt: "CreatorOps connected profile-building flow",
        label: "Profile layer",
        caption:
          "The connected profile-building flow extends the content pack into an Instagram-style bio and identity layer.",
        role: "flow",
      },
      {
        id: "mobile",
        src: "/cases/creatorops/mobile/creatorops-mb-1.webp",
        alt: "CreatorOps mobile library grid",
        label: "Mobile library",
        caption:
          "Mobile keeps the visual asset library readable while preserving the creator workflow rhythm.",
        role: "mobile",
      },
      {
        id: "mobile-nav",
        src: "/cases/creatorops/mobile/creatorops-mb-2.webp",
        alt: "CreatorOps mobile Smart Mix",
        label: "Mobile Smart Mix",
        caption:
          "The handheld Smart Mix step keeps selected assets, generated candidates, and continuation flow compact.",
        role: "mobile",
      },
      {
        id: "mobile-sequence",
        src: "/cases/creatorops/mobile/creatorops-mb-3.webp",
        alt: "CreatorOps mobile sequence state",
        label: "Mobile sequence",
        caption:
          "The selected mix becomes an ordered publishing direction inside the mobile sequence state.",
        role: "mobile",
      },
      {
        id: "mobile-planner",
        src: "/cases/creatorops/mobile/creatorops-mb-4.webp",
        alt: "CreatorOps mobile planner state",
        label: "Mobile planner",
        caption:
          "The planner links pack selection, rhythm, and next-step product flow on a compact screen.",
        role: "mobile",
      },
      {
        id: "mobile-export",
        src: "/cases/creatorops/mobile/creatorops-mb-5.webp",
        alt: "CreatorOps mobile export",
        label: "Mobile export",
        caption:
          "Mobile export keeps the practical publishing-pack outcome visible inside the handheld product flow.",
        role: "mobile",
      },
      {
        id: "mobile-bio-form",
        src: "/cases/creatorops/mobile/creatorops-mb-6.webp",
        alt: "CreatorOps mobile Bio Builder form",
        label: "Mobile bio form",
        caption:
          "Bio Builder shapes handle, audience, offer, CTA, and profile direction from the phone flow.",
        role: "mobile",
      },
      {
        id: "mobile-profile-preview",
        src: "/cases/creatorops/mobile/creatorops-mb-7.webp",
        alt: "CreatorOps mobile profile preview",
        label: "Mobile profile",
        caption:
          "The Instagram-style profile preview adapts the content pack into a creator-facing public identity.",
        role: "mobile",
      },
      {
        id: "mobile-tools",
        src: "/cases/creatorops/mobile/creatorops-mb-8.webp",
        alt: "CreatorOps mobile Bio Builder handoff",
        label: "Mobile tools",
        caption:
          "The mobile handoff shows how CreatorOps can expand from workflow into standalone creator tools.",
        role: "mobile",
      },
    ],
    interactionLogic:
      "Motion supports product calm: route transitions, card rhythm, state feedback, and workspace changes help the user understand progress without burying the workflow.",
    commercialLogic:
      "CreatorOps shifts creator tooling from scattered assets and generic dashboards toward practical output: select assets, generate direction, prepare captions, export a pack, and shape the profile layer.",
    technicalFoundation: [
      "Vite + React + TypeScript",
      "React Router workflow architecture",
      "Tailwind CSS interface system",
      "Motion transitions",
      "JSZip export pack generation",
      "Browser-side file handling",
      "Local / session state",
      "Cloudflare Pages deployment",
    ],
    availability: {
      status: "available",
      label: "Available as a workflow foundation.",
      summary:
        "CreatorOps can be adapted into a commissioned creator tool, content operations system, internal publishing workflow, or AI-ready product prototype.",
      bestFor: ["Creator tools", "Content teams", "Publishing workflows", "AI-ready SaaS"],
      adaptationIncludes: [
        "Workflow and route adaptation",
        "Content model and state logic",
        "Export pack customization",
        "Tools layer extension",
        "Deployment-ready front-end",
      ],
      licensingNote:
        "Final ownership, workflow specificity, AI/API integrations, content model, and product terms are defined per commission.",
      exclusivityAvailable: true,
      ctaLabel: "Adapt this workflow",
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
    label: "CASE SYSTEM / SERVICE ARCHITECTURE / BILINGUAL B2B",
    subheadline: "Bilingual service architecture system.",
    proofClaim:
      "Service websites become systems when offer structure, technical trust, bilingual content, quote flow, and deployment discipline move together.",
    systemLayers: [
      {
        title: "Service architecture",
        text:
          "The offer is broken into typed service pages and scannable sections instead of a generic company brochure.",
      },
      {
        title: "Bilingual parity",
        text:
          "English and Spanish content layers keep technical information consistent across routes and user contexts.",
      },
      {
        title: "Technical trust",
        text:
          "Process, documentation, handover, and service detail are framed as evidence for a high-trust engineering buyer.",
      },
      {
        title: "Quote flow",
        text:
          "Inquiry is shaped through service-specific selection and field hierarchy so commercial intent is clear early.",
      },
      {
        title: "Reusable vertical",
        text:
          "The structure can be adapted for B2B services, integration companies, technical firms, and quote-led offers.",
      },
      {
        title: "Production polish",
        text:
          "Redirect-safe routing, view transitions, deployment setup, and responsive QA make the concept feel operational.",
      },
    ],
    interactionLogic:
      "Transitions and page states stay restrained so the technical offer reads clearly, with motion supporting hierarchy rather than personality-first effects.",
    commercialLogic:
      "ARCWAVE translates a technical service business into a premium buyer path: understand the offer, trust the process, then request a quote.",
    technicalFoundation: [
      "Astro + TypeScript",
      "React islands",
      "Bilingual route system",
      "Typed content architecture",
      "Astro View Transitions",
      "Cloudflare Pages deployment",
    ],
    mediaLabels: {
      "arc-hero": "Service threshold",
      "arc-1": "Service architecture",
      "arc-2": "Process clarity",
      "arc-3": "Service detail",
      "arc-4": "Handover surface",
      "arc-5": "Quote flow",
      "arc-mb-1": "Mobile landing",
      "arc-mb-2": "Mobile services",
      "arc-mb-3": "Mobile handover",
      "arc-mb-4": "Mobile quote",
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

function getThresholdFrame(source: Case) {
  const frames = source.content?.frames?.filter((frame) => frame.kind !== "video") ?? [];
  return (
    frames.find((frame) => frame.src === source.poster.src || frame.src === source.content?.hero?.poster) ?? {
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
    });
  }

  sequence.push({
    id: "threshold",
    src: threshold.src,
    alt: threshold.alt ?? `${source.title} case threshold`,
    label: config.mediaLabels?.[getMediaStem(threshold.src)] ?? "Threshold",
    caption: threshold.caption ?? source.content?.summary ?? source.tagline,
    role: "hero",
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
    });
  });

  return sequence;
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

export const caseStories: CaseStory[] = [...authoredCaseStories, ...generatedCaseStories];

const caseStorySlugAliases: Record<string, string> = {
  "bcn-advisory": "barcelona-private-advisory",
};

export function getCaseStory(slug: string | undefined) {
  const canonicalSlug = slug ? caseStorySlugAliases[slug] ?? slug : undefined;
  return caseStories.find((story) => story.slug === canonicalSlug) ?? null;
}
