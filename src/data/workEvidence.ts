import type { Case } from "./cases";

export type EvidenceFilter =
  | "All"
  | "Premium websites"
  | "Product systems"
  | "Multilingual"
  | "Advisory"
  | "Hospitality"
  | "Tools"
  | "Experimental";

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
    proofLabel: "Advisory UX system",
    proofSummary:
      "A bilingual real-estate advisory product reframing property browsing as a curated buyer journey with shortlist logic and district-aware discovery.",
    systemTags: ["Real estate", "Advisory", "Bilingual", "Buyer journey"],
    workType: "Advisory platform",
    filters: ["Premium websites", "Product systems", "Multilingual", "Advisory"],
    capability: "Advisory-first property experience",
    layers: ["Shortlist logic", "District lens", "Private intake"],
    proofPoints: ["Moves away from listing-portal noise", "Frames browsing as guided advisory selection", "Keeps premium buyer context visible"],
    featuredEvidence: true,
  },
  creatorops: {
    proofLabel: "Creator workflow system",
    proofSummary:
      "A workflow interface for packaging selected content into clearer publishing, profile, caption, and export flows.",
    systemTags: ["Workflow UX", "Creator tools", "Product logic", "Mobile publishing"],
    workType: "Workflow tool",
    filters: ["Product systems", "Tools"],
    capability: "Creator workflow product direction",
    layers: ["Smart Mix logic", "Export pipeline", "Bio Builder"],
    proofPoints: ["Turns loose assets into a guided content pack", "Produces practical export output", "Extends into creator-facing tool modules"],
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
    proofPoints: ["Clarifies offer and place without template clutter", "Supports multilingual presentation", "Keeps mobile service discovery direct"],
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
    proofLabel: "Service architecture system",
    proofSummary:
      "A bilingual service-led product surface with typed content architecture, quote flow, and reusable vertical structure.",
    systemTags: ["Service UX", "Bilingual", "Quote flow", "Typed content"],
    workType: "Product system",
    filters: ["Premium websites", "Product systems", "Multilingual"],
    capability: "Service-led product architecture",
    layers: ["Typed sections", "Quote flow", "Reusable verticals"],
    proofPoints: ["Translates service detail into scannable structure", "Supports bilingual business presentation", "Makes quote intent visible early"],
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
