// Studio Experience Director contract. V1 runs these actions from curated plans; V2 can emit the same actions from
// model tool calls. Every target is an approved public route, HOME section anchor or content id.

export type GameSlug = "black-start" | "project-mars-2158" | "shift-world" | "project-territories";
export type DirectorAnchor = "ecosystem" | "collaboration" | "offer-systems";
export type OfferSystem = "ai-agent-systems";
export type DirectorRoute = "/games" | "/offer" | "/avatars";
export type CtaRoute = "/products" | "/immersive" | "/work";

export type DirectorAction =
  // Glide to a section anchor on the current page (HOME chapters, Offer systems).
  | { kind: "anchor"; id: DirectorAnchor }
  // Bring one product to the front of the HOME Products scene.
  | { kind: "product"; projectId: "weekfield" | "print-border-studio" }
  // Hold one proof in the HOME Spatial scene.
  | { kind: "spatial"; proof: "whisper" | "webhero" }
  // Open a real page, optionally with a selected Games world.
  | { kind: "route"; path: DirectorRoute; game?: GameSlug }
  // Select a world on the open Games page.
  | { kind: "game"; slug: GameSlug }
  // Select one build system on the open Offer page with its own selector.
  | { kind: "offer-system"; system: OfferSystem };

export type DirectorStep = {
  // The step starts when this caption cue starts.
  atCue: number;
  action: DirectorAction;
  // What the visitor sees once the action is confirmed on screen.
  receipt: string;
};

// The answer's single next step. The project drawer only ever opens from this explicit click.
export type PresenterCta =
  | { kind: "route"; path: CtaRoute; label: string }
  | { kind: "project"; label: string }
  // Ends the tour and leaves the visitor on the page the director opened.
  | { kind: "stay"; label: string };

// "skipped": the target does not exist in this layout by design (the Offer page has no build-system selector on phones).
export type DirectorReceiptStatus = "running" | "done" | "failed" | "interrupted" | "cancelled" | "skipped";

export type DirectorReceipt = {
  run: number;
  step: number;
  label: string;
  status: DirectorReceiptStatus;
};

export const DIRECTOR_RECEIPT_EVENT = "studio-director:receipt";
