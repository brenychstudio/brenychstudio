export const MOBILE_MOTION_BREAKPOINT = 1024;

export const mobileMotionDurations = {
  section: 640,
  media: 780,
  row: 420,
  child: 520,
};

export const mobileMotionEasing = "cubic-bezier(0.22, 1, 0.36, 1)";

export type MobileMotionChild = "label" | "heading" | "copy" | "row" | "media" | "cta";

export type MobileMotionSignature =
  | "hero-lock"
  | "proof-field"
  | "media-orbit"
  | "ledger-scan"
  | "dark-chamber"
  | "closing-signal"
  | "studio-os"
  | "evidence-scan"
  | "route-selector"
  | "method-signal"
  | "chamber-signal"
  | "proof-reader";

export const mobileMotionSignatures: MobileMotionSignature[] = [
  "hero-lock",
  "proof-field",
  "media-orbit",
  "ledger-scan",
  "dark-chamber",
  "closing-signal",
  "studio-os",
  "evidence-scan",
  "route-selector",
  "method-signal",
  "chamber-signal",
  "proof-reader",
];

export const mobileMotionChildren: MobileMotionChild[] = ["label", "heading", "copy", "row", "media", "cta"];

export const mobileMotionObserver = {
  section: {
    rootMargin: "0px 0px 28% 0px",
    threshold: 0.01,
  },
  media: {
    rootMargin: "0px 0px 22% 0px",
    threshold: 0.01,
  },
  ledger: {
    rootMargin: "-24% 0px -34% 0px",
    threshold: 0.01,
  },
} as const;

export const mobileMotionRootMargin = mobileMotionObserver.section.rootMargin;
