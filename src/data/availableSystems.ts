export type AvailabilityStatus =
  | "available"
  | "custom-only"
  | "concept-reference"
  | "not-available";

export type AvailableSystem = {
  slug: string;
  status: AvailabilityStatus;
  label: string;
  shortLabel: string;
  summary: string;
  bestFor: string[];
  adaptationIncludes: string[];
  licensingNote: string;
  exclusivityAvailable?: boolean;
  ctaLabel: string;
};

export const availableSystems: AvailableSystem[] = [
  {
    slug: "house-of-lune",
    status: "available",
    label: "Available System",
    shortLabel: "Ready to adapt",
    summary:
      "A luxury product interface foundation that can be adapted for jewelry, fashion, collector objects, premium commerce, or private collections.",
    bestFor: ["Jewelry", "Fashion", "Premium product", "Private collection"],
    adaptationIncludes: [
      "Brand and content adaptation",
      "Product structure adjustment",
      "Inquiry flow customization",
      "Responsive production polish",
      "Deployment-ready front-end",
    ],
    licensingNote:
      "Available as a commissioned adaptation. Final ownership, exclusivity, visual reuse, and content terms are defined per project.",
    exclusivityAvailable: true,
    ctaLabel: "Adapt this system",
  },
  {
    slug: "bcn-advisory",
    status: "available",
    label: "Available System",
    shortLabel: "Ready to adapt",
    summary:
      "An advisory UX foundation for real estate, consulting, private services, curated discovery, and high-trust buyer journeys.",
    bestFor: ["Real estate", "Advisory", "Private consulting", "Curated services"],
    adaptationIncludes: [
      "Market-specific content structure",
      "Inquiry / shortlist flow adaptation",
      "Bilingual or multilingual setup",
      "Visual direction adjustment",
      "Deployment-ready front-end",
    ],
    licensingNote:
      "Available as a commissioned adaptation. Data, imagery, branding, and market-specific content are customized per client.",
    exclusivityAvailable: true,
    ctaLabel: "Adapt this system",
  },
  {
    slug: "casa-nube",
    status: "available",
    label: "Available System",
    shortLabel: "Ready to adapt",
    summary:
      "A hospitality website foundation for cafes, restaurants, boutique spaces, local service brands, and reservation-first experiences.",
    bestFor: ["Restaurant", "Cafe", "Hospitality", "Local service"],
    adaptationIncludes: [
      "Menu / service content adaptation",
      "Reservation or inquiry flow",
      "Multilingual content structure",
      "Mobile-first layout polish",
      "Deployment-ready front-end",
    ],
    licensingNote:
      "Available as a commissioned adaptation for selected hospitality projects.",
    exclusivityAvailable: false,
    ctaLabel: "Adapt this system",
  },
  {
    slug: "print-border-studio",
    status: "available",
    label: "Available System",
    shortLabel: "Ready to adapt",
    summary:
      "A production and collector surface foundation for print studios, editions, object catalogues, and inspection-led presentation systems.",
    bestFor: ["Print studio", "Editioned objects", "Collector surface", "Creative tool"],
    adaptationIncludes: [
      "Brand and collection structure",
      "Inspection / preview flow adaptation",
      "Production state customization",
      "Responsive production polish",
      "Deployment-ready front-end",
    ],
    licensingNote:
      "Available as a commissioned adaptation. Tool logic, imagery, object data, and reuse terms are defined per project.",
    exclusivityAvailable: true,
    ctaLabel: "Adapt this system",
  },
  {
    slug: "form-index",
    status: "available",
    label: "Available System",
    shortLabel: "Ready to adapt",
    summary:
      "A repeatable presentation foundation for studios, practices, product archives, and multilingual editorial systems.",
    bestFor: ["Studio archive", "Practice site", "Product index", "Editorial system"],
    adaptationIncludes: [
      "Content model adaptation",
      "Visual direction adjustment",
      "Multilingual structure",
      "Reusable section polish",
      "Deployment-ready front-end",
    ],
    licensingNote:
      "Available as a commissioned adaptation. Content, language scope, and ownership terms are defined per project.",
    exclusivityAvailable: true,
    ctaLabel: "Adapt this system",
  },
  {
    slug: "fluid-exhibition",
    status: "available",
    label: "Available System",
    shortLabel: "Ready to adapt",
    summary:
      "A cinematic editorial foundation for launch stories, image-led campaigns, exhibitions, and atmospheric presentation systems.",
    bestFor: ["Campaign", "Exhibition", "Editorial launch", "Image-led brand"],
    adaptationIncludes: [
      "Narrative and media adaptation",
      "Scroll rhythm adjustment",
      "Responsive production polish",
      "Motion behavior refinement",
      "Deployment-ready front-end",
    ],
    licensingNote:
      "Available as a commissioned adaptation for selected projects where the visual direction can be made client-specific.",
    exclusivityAvailable: false,
    ctaLabel: "Adapt this system",
  },
  {
    slug: "arcwave-integrations",
    status: "available",
    label: "Available System",
    shortLabel: "Ready to adapt",
    summary:
      "A service architecture foundation for B2B products, integration companies, technical services, and quote-led commercial sites.",
    bestFor: ["B2B service", "Integration company", "Technical offer", "Quote-led site"],
    adaptationIncludes: [
      "Service vertical adaptation",
      "Quote / inquiry flow customization",
      "Bilingual or multilingual setup",
      "Content hierarchy polish",
      "Deployment-ready front-end",
    ],
    licensingNote:
      "Available as a commissioned adaptation. Service logic, content, integrations, and ownership terms are defined per project.",
    exclusivityAvailable: true,
    ctaLabel: "Adapt this system",
  },
  {
    slug: "creatorops",
    status: "concept-reference",
    label: "Concept Reference",
    shortLabel: "Direction available",
    summary:
      "A creator workflow direction that can inform a custom product system, but is not offered as a direct foundation.",
    bestFor: ["Creator product", "Workflow tool", "Publishing system"],
    adaptationIncludes: ["Custom product direction", "Workflow modelling", "Interface architecture"],
    licensingNote:
      "Available as reference for a custom commissioned product direction, not as a direct reuse of the current concept.",
    ctaLabel: "Discuss similar direction",
  },
  {
    slug: "whisper",
    status: "custom-only",
    label: "Custom Direction",
    shortLabel: "Available as reference",
    summary:
      "A spatial and cinematic direction that can inform a custom immersive project, but the existing system is not available as-is.",
    bestFor: ["Spatial interface", "Exhibition", "Art presentation"],
    adaptationIncludes: ["Custom direction", "Spatial prototype strategy", "Interface architecture"],
    licensingNote:
      "Available as reference for a custom commissioned direction. The existing project is not available for direct adaptation.",
    ctaLabel: "Discuss similar direction",
  },
];

export const defaultAvailability: AvailableSystem = {
  slug: "default",
  status: "not-available",
  label: "Case only",
  shortLabel: "Not available for adaptation",
  summary:
    "This case is part of the evidence archive and can inform a custom direction, but it is not offered as an adaptable system foundation.",
  bestFor: ["Custom direction"],
  adaptationIncludes: ["Custom concept", "Interface architecture", "Production direction"],
  licensingNote:
    "Availability does not mean instant resale of an existing project as-is. Each adaptation is commissioned and customized.",
  ctaLabel: "Discuss similar direction",
};

export function getAvailableSystem(slug: string) {
  return availableSystems.find((system) => system.slug === slug) ?? defaultAvailability;
}

export function isAvailableSystem(slug: string) {
  return getAvailableSystem(slug).status === "available";
}
