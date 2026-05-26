export const MOBILE_MOTION_BREAKPOINT = 1024;

export const mobileMotionDurations = {
  section: 520,
  media: 680,
  row: 320,
};

export const mobileMotionEasing = "cubic-bezier(0.22, 1, 0.36, 1)";

export type MobileMotionSignature =
  | "hero-lock"
  | "proof-field"
  | "media-orbit"
  | "ledger-scan"
  | "dark-chamber"
  | "closing-signal";

export const mobileMotionSignatures: MobileMotionSignature[] = [
  "hero-lock",
  "proof-field",
  "media-orbit",
  "ledger-scan",
  "dark-chamber",
  "closing-signal",
];

export const mobileMotionObserver = {
  section: {
    rootMargin: "0px 0px 18% 0px",
    threshold: 0.08,
  },
  media: {
    rootMargin: "0px 0px 12% 0px",
    threshold: 0.1,
  },
  ledger: {
    rootMargin: "-24% 0px -34% 0px",
    threshold: 0.01,
  },
} as const;

export const mobileMotionRootMargin = mobileMotionObserver.section.rootMargin;
