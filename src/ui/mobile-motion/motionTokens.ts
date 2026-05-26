export const MOBILE_MOTION_BREAKPOINT = 1024;

export const mobileMotionDurations = {
  section: 560,
  media: 740,
  row: 360,
  child: 420,
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
    rootMargin: "0px 0px 22% 0px",
    threshold: 0.04,
  },
  media: {
    rootMargin: "0px 0px 18% 0px",
    threshold: 0.06,
  },
  ledger: {
    rootMargin: "-24% 0px -34% 0px",
    threshold: 0.01,
  },
} as const;

export const mobileMotionRootMargin = mobileMotionObserver.section.rootMargin;
