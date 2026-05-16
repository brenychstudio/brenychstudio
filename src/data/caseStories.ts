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

export const caseStories: CaseStory[] = [
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
        id: "inquiry",
        src: "/cases/bcn-advisory/desktop/bcn-advisory-4.webp",
        alt: "Barcelona Private Advisory shortlist drawer",
        label: "Shortlist intake",
        caption:
          "Saved properties turn into a structured advisory selection before private contact.",
        role: "flow",
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

export function getCaseStory(slug: string | undefined) {
  return caseStories.find((story) => story.slug === slug) ?? null;
}
