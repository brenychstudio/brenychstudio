import type { Case } from "./cases";

export type EvidenceFilter =
  | "All"
  | "Premium websites"
  | "Product systems"
  | "Multilingual"
  | "Advisory"
  | "Hospitality"
  | "Tools"
  | "Experimental"
  | "Available Systems";

export type WorkEvidenceMeta = {
  proofLabel: string;
  proofSummary: string;
  systemTags: string[];
  workType: string;
  filters: EvidenceFilter[];
  capability: string;
  layers: string[];
  proofPoints: string[];
  featuredEvidence?: boolean;
};

export type EvidenceCase = Case & {
  evidence: WorkEvidenceMeta;
};

export const evidenceFilters: EvidenceFilter[] = [
  "All",
  "Premium websites",
  "Product systems",
  "Multilingual",
  "Advisory",
  "Hospitality",
  "Tools",
  "Experimental",
  "Available Systems",
];

export const fallbackEvidence: WorkEvidenceMeta = {
  proofLabel: "Interface system proof",
  proofSummary:
    "A selected project proving visual clarity, product logic, responsive structure, and commercial presentation.",
  systemTags: ["Interface UX", "Visual system", "Responsive build"],
  workType: "Selected work",
  filters: ["Premium websites"],
  capability: "Premium interface direction",
  layers: ["Visual hierarchy", "Responsive surface", "Case presentation"],
  proofPoints: ["Clear positioning", "Production-ready structure", "Commercial-facing polish"],
};

export const workEvidenceBySlug: Record<string, WorkEvidenceMeta> = {
  "aurel-eon-gt": {
    proofLabel: "Living automotive product system",
    proofSummary:
      "A fictional premium electric grand tourer launch experience that turns arrival, exterior, light signature, cabin, materiality, drive character, gallery, inspect, product view, and private preview into one cinematic product system.",
    systemTags: ["Automotive concept", "Cinematic UX", "Product states", "Interaction systems"],
    workType: "Premium Automotive Product Experience",
    filters: ["Premium websites", "Product systems", "Experimental"],
    capability: "Premium automotive interaction direction",
    layers: ["Presence Rail navigation", "Cinematic inspect flow", "Drive character composer"],
    proofPoints: [
      "Reframes an automotive launch site as a living product system",
      "Connects cinematic image states with reusable interaction logic",
      "Keeps the fictional concept honest as an advanced prototype",
    ],
    featuredEvidence: true,
  },
  "oria-house-barcelona": {
    proofLabel: "Boutique hotel hospitality system",
    proofSummary:
      "A boutique hotel concept case that connects stay atmosphere, room comparison, room detail, experience layers, location context, and booking contact into one calm guest path.",
    systemTags: ["Hotel concept", "Hospitality UX", "Room comparison", "Booking contact"],
    workType: "Hospitality website",
    filters: ["Premium websites", "Hospitality", "Multilingual"],
    capability: "Boutique hotel interface design",
    layers: ["Atmospheric entry", "Room decision path", "Booking contact"],
    proofPoints: [
      "Connects atmosphere with practical room selection",
      "Turns rooms and experiences into one guest journey",
      "Keeps contact clear without claiming a live booking platform",
    ],
  },
  "house-of-lune": {
    proofLabel: "Luxury product architecture",
    proofSummary:
      "A cinematic product surface with multilingual routing, private inquiry flow, dynamic product pages, and premium commerce framing.",
    systemTags: ["Luxury product", "Multilingual", "Inquiry UX", "Cinematic commerce"],
    workType: "Premium website",
    filters: ["Premium websites", "Product systems", "Multilingual"],
    capability: "Luxury web system with product architecture",
    layers: ["Multilingual routing", "Dynamic product pages", "Private inquiry path"],
    proofPoints: ["Turns product browsing into maison-style selection", "Supports editorial and commerce logic", "Ships as a production-oriented deployment"],
    featuredEvidence: true,
  },
  "bcn-advisory": {
    proofLabel: "Private property intelligence",
    proofSummary:
      "A Barcelona real-estate advisory prototype that turns buyer intent, district intelligence, ranked candidates, shortlist dossier, inspection, and inquiry handoff into one guided path.",
    systemTags: ["Real estate", "Barcelona Lens", "Shortlist dossier", "Inquiry handoff"],
    workType: "Private Property Intelligence System",
    filters: ["Premium websites", "Product systems", "Multilingual", "Advisory"],
    capability: "Private property advisory interface",
    layers: ["Buyer intent lens", "Barcelona Lens Field", "Advisor-ready dossier"],
    proofPoints: ["Makes selection logic visible before first contact", "Frames saved properties as a private dossier", "Turns search context into a structured viewing request"],
    featuredEvidence: true,
  },
  creatorops: {
    proofLabel: "Creator publishing workflow",
    proofSummary:
      "A beta-ready export-first workspace for turning scattered creator assets into a ready-to-publish Week Pack with review, handoff, and media conversion inside one calm workflow.",
    systemTags: ["Workflow UX", "Creator tools", "Client review", "Media converter"],
    workType: "Workflow Tool / Creator Publishing System",
    filters: ["Product systems", "Tools"],
    capability: "Creator publishing workflow interface",
    layers: ["Library and Smart Mix", "Export and review", "Media Converter"],
    proofPoints: ["Turns loose assets into selectable publishing candidates", "Builds toward a ready-to-publish Week Pack", "Keeps utility tools inside the premium product environment"],
    featuredEvidence: true,
  },
  "print-border-studio": {
    proofLabel: "Production tool and collector surface",
    proofSummary:
      "A museum-style production tool for print borders, export logic, AR review, and collector-facing presentation.",
    systemTags: ["Print", "AR review", "Production UX", "Collector logic"],
    workType: "Production tool",
    filters: ["Product systems", "Tools", "Experimental"],
    capability: "Production interface with collector logic",
    layers: ["Border engine", "AR review", "Export states"],
    proofPoints: ["Combines creator tooling with public presentation", "Makes production choices inspectable", "Links utility with a collector-grade surface"],
    featuredEvidence: true,
  },
  "casa-nube": {
    proofLabel: "Hospitality website system",
    proofSummary:
      "A premium multilingual hospitality surface with editorial structure, mobile-first service flow, and clear local business presentation.",
    systemTags: ["Hospitality", "Multilingual", "Mobile-first", "Editorial UX"],
    workType: "Hospitality website",
    filters: ["Premium websites", "Multilingual", "Hospitality"],
    capability: "Hospitality website architecture",
    layers: ["Service narrative", "Mobile booking path", "Local editorial structure"],
    proofPoints: ["Clarifies offer and place without generic clutter", "Supports multilingual presentation", "Keeps mobile service discovery direct"],
  },
  "form-index": {
    proofLabel: "Repeatable presentation system",
    proofSummary:
      "A multilingual and interactive presentation system proving reusable case architecture and flexible visual language.",
    systemTags: ["Multilingual", "Interactive presentation", "System architecture"],
    workType: "Presentation system",
    filters: ["Premium websites", "Product systems", "Multilingual", "Experimental"],
    capability: "Reusable presentation architecture",
    layers: ["Interactive structure", "Language system", "Repeatable content model"],
    proofPoints: ["Shows a repeatable case architecture", "Balances editorial clarity with interaction", "Scales a visual system across content"],
  },
  "fluid-exhibition": {
    proofLabel: "Editorial exhibition surface",
    proofSummary:
      "A cinematic web exhibition proof where image rhythm, motion, and scroll structure behave as one presentation system.",
    systemTags: ["Exhibition", "Cinematic surface", "Scroll logic"],
    workType: "Experimental presentation",
    filters: ["Premium websites", "Experimental"],
    capability: "Cinematic editorial experience",
    layers: ["Image rhythm", "Motion pacing", "Scroll composition"],
    proofPoints: ["Builds atmosphere through interaction", "Keeps exhibition content legible", "Turns scrolling into presentation structure"],
  },
  "arcwave-integrations": {
    proofLabel: "Infrastructure interface system",
    proofSummary:
      "A technical installation service system that turns telecom, networks, electricity, security, EV charging, smart home, and audio into one readable infrastructure path.",
    systemTags: ["Infrastructure UX", "Install brief", "Quote flow", "Technical services"],
    workType: "Product system",
    filters: ["Premium websites", "Product systems", "Multilingual"],
    capability: "Infrastructure service interface",
    layers: ["Connected services", "Install flow", "Quote brief"],
    proofPoints: [
      "Makes invisible infrastructure readable",
      "Turns technical services into clear buyer paths",
      "Moves quote intent into a structured install brief",
    ],
  },
  sprintcrm: {
    proofLabel: "Operator workflow product",
    proofSummary:
      "A premium internal CRM proving import logic, pipeline control, reporting structure, and operator-facing product clarity.",
    systemTags: ["CRM", "Workflow UX", "Supabase", "Operator console"],
    workType: "Software product",
    filters: ["Product systems", "Tools"],
    capability: "Internal product UX and data-backed workflow",
    layers: ["Lead import", "Pipeline control", "Reports surface"],
    proofPoints: ["Proves real product logic, not only a visual shell", "Keeps operator work calm and structured", "Connects data states with daily workflow"],
  },
};
