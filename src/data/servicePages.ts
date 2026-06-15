export type ServicePageSlug =
  | "premium-landing-page"
  | "product-demo-landing"
  | "interactive-web-systems";

export type ServiceProofRef = {
  slug: string;
  source: "work" | "immersive";
  claim: string;
  label: string;
  role: string;
};

export type ServiceMethodStep = {
  title: string;
  text: string;
};

export type ServicePageData = {
  slug: ServicePageSlug;
  path: `/services/${ServicePageSlug}`;
  visualTone: "premium" | "product" | "immersive";
  heroProofLayout: "editorial-stack" | "product-stack" | "spatial-stack";
  seoTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref: string;
  routeTitle: string;
  routeDefinition: string;
  routeLedger: Array<{
    title: string;
    text: string;
  }>;
  methodTitle: string;
  bestFor: string[];
  method: ServiceMethodStep[];
  proof: ServiceProofRef[];
  proofStatement: string;
  deliverables: string[];
  closingTitle: string;
  closingBody: string;
  schemaName: string;
};

export const servicePages: ServicePageData[] = [
  {
    slug: "premium-landing-page",
    path: "/services/premium-landing-page",
    visualTone: "premium",
    heroProofLayout: "editorial-stack",
    seoTitle: "Premium Landing Pages for Focused Launches | Brenych Studio",
    metaDescription:
      "Premium standalone landing pages for product launches, services, consultations, campaigns, booking flows and focused commercial offers.",
    heroTitle: "Premium landing pages for focused launches.",
    heroBody:
      "Standalone commercial pages for one offer, product, service, consultation, event, waitlist or campaign - built as a clear interface system, not a generic template.",
    primaryCta: "Start a project",
    secondaryCta: "View relevant work",
    secondaryHref: "/work",
    routeTitle: "One focused commercial surface.",
    routeDefinition:
      "A focused landing system for one clear commercial action: inquiry, booking, waitlist, consultation, product launch, event registration or offer validation.",
    routeLedger: [
      {
        title: "Offer clarity",
        text: "One action, one audience, one premium route instead of a diluted site section.",
      },
      {
        title: "Visual trust",
        text: "Proof, media, hierarchy and inquiry logic appear before the page asks for commitment.",
      },
      {
        title: "Launch surface",
        text: "Responsive front-end, metadata and handoff stay ready for deployment.",
      },
    ],
    methodTitle: "Built as a restrained commercial sequence.",
    bestFor: [
      "Product or service launch",
      "Consultation / booking offer",
      "Event, course or waitlist",
      "Premium local or international offer",
      "Campaign separate from the main website",
    ],
    method: [
      {
        title: "Direction",
        text: "Offer, audience, proof hierarchy and CTA logic.",
      },
      {
        title: "Interface architecture",
        text: "Sections, decision flow, content order and route clarity.",
      },
      {
        title: "Visual system",
        text: "Typography, media rhythm, motion language and premium presentation.",
      },
      {
        title: "Build",
        text: "Responsive front-end, QA and deployment-ready structure.",
      },
      {
        title: "Launch",
        text: "Handoff, support notes and next-step clarity.",
      },
    ],
    proof: [
      {
        slug: "casa-nube",
        source: "work",
        label: "Hospitality proof",
        role: "Premium local offer",
        claim: "A premium multilingual hospitality surface with editorial structure, mobile-first service flow and clear local business presentation.",
      },
      {
        slug: "aurel-eon-gt",
        source: "work",
        label: "Launch concept",
        role: "Product reveal surface",
        claim: "A premium automotive concept presentation with controlled atmosphere, product rhythm and private preview logic.",
      },
      {
        slug: "house-of-lune",
        source: "work",
        label: "Product-world proof",
        role: "Premium presentation",
        claim: "A premium product presentation surface for luxury objects, private inquiry and visual storytelling.",
      },
    ],
    proofStatement:
      "A premium landing page should show value before it explains value: product atmosphere, advisory trust and a clear action path in the first half of the route.",
    deliverables: [
      "Production-ready front-end",
      "Structured content and section logic",
      "Responsive mobile / desktop system",
      "Motion states and interaction details",
      "Basic metadata and launch handoff",
      "Deployment support notes",
    ],
    closingTitle: "Start with one focused surface.",
    closingBody:
      "Use one route to test the offer, launch clearly, and give the project a premium commercial surface before adding more architecture.",
    schemaName: "Premium landing page",
  },
  {
    slug: "product-demo-landing",
    path: "/services/product-demo-landing",
    visualTone: "product",
    heroProofLayout: "product-stack",
    seoTitle: "Product Demo Landing Pages for Founders and Product Teams | Brenych Studio",
    metaDescription:
      "Product demo landing pages and founder-led presentation systems for SaaS prototypes, AI tools, internal products, waitlists and investor-facing product narratives.",
    heroTitle: "Product demo pages for founder-led products.",
    heroBody:
      "Focused product presentation systems for SaaS concepts, AI tools, workflow products, founder demos, investor conversations, waitlists and early product validation.",
    primaryCta: "Start a project",
    secondaryCta: "View product cases",
    secondaryHref: "/work",
    routeTitle: "One clear product story.",
    routeDefinition:
      "A product demo landing route that turns a product idea, workflow, tool or prototype into a clear visual narrative: what it is, how it works, who it helps and why it matters.",
    routeLedger: [
      {
        title: "Product thesis",
        text: "The promise, problem and workflow become visible before the first sales call.",
      },
      {
        title: "Interface proof",
        text: "Screens, states and modules carry the narrative instead of abstract claims.",
      },
      {
        title: "Demo path",
        text: "The route leads toward a demo request, beta list, investor review or product conversation.",
      },
    ],
    methodTitle: "Built through product logic and proof.",
    bestFor: [
      "SaaS / AI tool prototypes",
      "Founder-led product launches",
      "Waitlist and beta pages",
      "Investor-facing demos",
      "Workflow and internal tool presentations",
    ],
    method: [
      {
        title: "Product thesis",
        text: "Clarify the product promise, user problem and core workflow.",
      },
      {
        title: "Demo architecture",
        text: "Structure the page around product logic, proof and conversion.",
      },
      {
        title: "Interface proof",
        text: "Use screenshots, modules, flows and states as evidence.",
      },
      {
        title: "Conversion route",
        text: "Build a path toward demo request, waitlist, inquiry or beta access.",
      },
      {
        title: "Launch-ready surface",
        text: "Deliver a polished, responsive front-end presentation.",
      },
    ],
    proof: [
      {
        slug: "creatorops",
        source: "work",
        label: "Creator workflow",
        role: "Export-first product prototype",
        claim: "A creator workflow product prototype that turns scattered assets into a Week Pack operating system.",
      },
      {
        slug: "sprintcrm",
        source: "work",
        label: "Operator surface",
        role: "Internal product demo",
        claim: "An internal CRM prototype that makes lead import, pipeline state and operator workflow visible.",
      },
      {
        slug: "barcelona-private-advisory",
        source: "work",
        label: "Advisory system",
        role: "Guided buyer workflow",
        claim: "A product-shaped advisory demo that turns buyer context into a structured handoff path.",
      },
    ],
    proofStatement:
      "The product page should feel like a working demo surface: clear thesis, visible workflow, proof screens and a direct route toward the next conversation.",
    deliverables: [
      "Product narrative",
      "Demo flow structure",
      "Interface screenshot system",
      "Responsive landing page",
      "CTA / waitlist / inquiry path",
      "Metadata and launch handoff",
    ],
    closingTitle: "Turn the product into a clear demo surface.",
    closingBody:
      "Make the product understandable before the first call: promise, workflow, proof and next action in one focused route.",
    schemaName: "Product demo landing page",
  },
  {
    slug: "interactive-web-systems",
    path: "/services/interactive-web-systems",
    visualTone: "immersive",
    heroProofLayout: "spatial-stack",
    seoTitle: "Interactive Web Systems and Immersive Interfaces | Brenych Studio",
    metaDescription:
      "Interactive web systems, cinematic interfaces, WebGL experiences, spatial archives and immersive digital presentations for premium brands, artists and product worlds.",
    heroTitle: "Interactive web systems for spatial interfaces.",
    heroBody:
      "Cinematic websites, atmospheric interfaces, WebGL-ready systems, spatial archives and immersive presentation layers built for projects that need more than a static page.",
    primaryCta: "Start immersive project",
    secondaryCta: "View immersive proof",
    secondaryHref: "/immersive",
    routeTitle: "One living interface field.",
    routeDefinition:
      "An interactive system route for projects that need atmosphere, motion, media, spatial structure, experimental presentation or immersive proof without losing usability.",
    routeLedger: [
      {
        title: "Spatial concept",
        text: "The world, archive, chamber or product field is defined before visual effects begin.",
      },
      {
        title: "Cinematic proof",
        text: "Existing work anchors the experience so atmosphere remains tied to evidence.",
      },
      {
        title: "Usable field",
        text: "Motion, media and spatial rhythm support the route instead of hiding the message.",
      },
    ],
    methodTitle: "Built as a spatial sequence with usable edges.",
    bestFor: [
      "Immersive digital exhibitions",
      "Artist archives and visual collections",
      "Premium product worlds",
      "WebGL / atmospheric presentation systems",
      "Spatial pitch pages and experimental prototypes",
    ],
    method: [
      {
        title: "Spatial concept",
        text: "Define the world, chamber, proof layer or experience logic.",
      },
      {
        title: "Interface structure",
        text: "Build the route, navigation, media field and interaction model.",
      },
      {
        title: "Atmospheric system",
        text: "Shape motion, backdrop, presence, reveal and visual rhythm.",
      },
      {
        title: "Technical front-end",
        text: "Implement responsive, production-aware interface behavior.",
      },
      {
        title: "Handoff",
        text: "Prepare the system for launch, iteration or deeper WebXR development.",
      },
    ],
    proof: [
      {
        slug: "whisper",
        source: "immersive",
        label: "Archive system",
        role: "Cinematic Web / XR proof",
        claim: "A cinematic Web / XR exhibition system where one archive becomes multiple surfaces.",
      },
      {
        slug: "webhero",
        source: "immersive",
        label: "WebGL-ready proof",
        role: "Living visual system",
        claim: "A living visual systems platform for WebGL stages, spatial works and Art Room presentation.",
      },
      {
        slug: "presence-os-memory-atlas",
        source: "immersive",
        label: "Memory field",
        role: "Spatial archive prototype",
        claim: "A local-first memory atlas where archive intake, cinematic inspection, artifact export and XR room logic become one spatial system.",
      },
      {
        slug: "kool-berk",
        source: "immersive",
        label: "Sonic object",
        role: "Immersive music prototype",
        claim: "A spatial sonic-object prototype where music, artifact inspection and atmospheric presentation become one interactive field.",
      },
    ],
    proofStatement:
      "Interactive work needs proof early: not decoration, but a visible system of atmosphere, media, spatial logic and a usable path through the experience.",
    deliverables: [
      "Interactive front-end surface",
      "Motion and atmosphere system",
      "Media / proof composition",
      "Responsive mobile / desktop experience",
      "Optional WebGL / AR / spatial direction",
      "QA and launch handoff",
    ],
    closingTitle: "Build the next interface as a living field.",
    closingBody:
      "Use interaction, media and atmosphere as part of the system logic, not as decoration added after the page is built.",
    schemaName: "Interactive web systems",
  },
];

export function getServicePage(slug: string | undefined) {
  return servicePages.find((page) => page.slug === slug) ?? null;
}
