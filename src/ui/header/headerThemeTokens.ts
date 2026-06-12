export type HeaderMoodId = "living" | "evidence" | "immersive" | "practice" | "studio";

export type HeaderTheme = {
  id: string;
  signalLabel: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  chipSurface: string;
  progress: string;
  actionSurface: string;
  actionForeground: string;
  actionBorder: string;
  activeChipSurface: string;
  activeChipForeground: string;
  blur: number;
  elevation: number;
};

export type HeaderThemeResolverInput = {
  routeTheme: HeaderTheme;
  activeSceneId: string | null;
};

const lightDefault = {
  surface: "rgba(248, 247, 243, 0.72)",
  foreground: "#0f0f0f",
  muted: "rgba(15, 15, 15, 0.48)",
  border: "rgba(15, 15, 15, 0.09)",
  chipSurface: "rgba(255, 255, 255, 0.62)",
  progress: "#0f0f0f",
  actionSurface: "#0f0f0f",
  actionForeground: "#ffffff",
  actionBorder: "#0f0f0f",
  activeChipSurface: "#0f0f0f",
  activeChipForeground: "#ffffff",
  blur: 18,
  elevation: 0.045,
};

const lightDense = {
  surface: "rgba(246, 244, 238, 0.86)",
  foreground: "#0f0f0f",
  muted: "rgba(15, 15, 15, 0.52)",
  border: "rgba(15, 15, 15, 0.12)",
  chipSurface: "rgba(255, 255, 255, 0.68)",
  progress: "#0f0f0f",
  actionSurface: "#0f0f0f",
  actionForeground: "#ffffff",
  actionBorder: "#0f0f0f",
  activeChipSurface: "#0f0f0f",
  activeChipForeground: "#ffffff",
  blur: 20,
  elevation: 0.055,
};

const darkProof = {
  surface: "rgba(8, 8, 8, 0.72)",
  foreground: "#f7f3ea",
  muted: "rgba(247, 243, 234, 0.68)",
  border: "rgba(255, 255, 255, 0.16)",
  chipSurface: "rgba(255, 255, 255, 0.08)",
  progress: "#f7f3ea",
  actionSurface: "#f7f3ea",
  actionForeground: "#070707",
  actionBorder: "rgba(247, 243, 234, 0.86)",
  activeChipSurface: "#f7f3ea",
  activeChipForeground: "#070707",
  blur: 18,
  elevation: 0.18,
};

const actionDark = {
  surface: "rgba(5, 5, 5, 0.78)",
  foreground: "#ffffff",
  muted: "rgba(255, 255, 255, 0.68)",
  border: "rgba(255, 255, 255, 0.18)",
  chipSurface: "rgba(255, 255, 255, 0.09)",
  progress: "#ffffff",
  actionSurface: "#ffffff",
  actionForeground: "#050505",
  actionBorder: "rgba(255, 255, 255, 0.9)",
  activeChipSurface: "#ffffff",
  activeChipForeground: "#050505",
  blur: 18,
  elevation: 0.2,
};

export const headerThemeTokens: Record<HeaderMoodId, HeaderTheme> = {
  living: {
    id: "route-living",
    signalLabel: "LIVING SYSTEMS",
    ...lightDefault,
  },
  evidence: {
    id: "route-evidence",
    signalLabel: "EVIDENCE ATLAS",
    ...lightDense,
  },
  immersive: {
    id: "route-immersive",
    signalLabel: "IMMERSIVE SYSTEMS",
    ...lightDefault,
    surface: "rgba(246, 245, 240, 0.76)",
    border: "rgba(15, 15, 15, 0.1)",
  },
  practice: {
    id: "route-practice",
    signalLabel: "PRACTICE MODEL",
    ...lightDense,
    surface: "rgba(249, 247, 242, 0.84)",
  },
  studio: {
    id: "route-studio",
    signalLabel: "STUDIO POSITION",
    ...lightDefault,
    surface: "rgba(250, 249, 245, 0.78)",
  },
};

export const headerSceneThemes: Record<string, HeaderTheme> = {
  "living-threshold": {
    id: "living-threshold",
    signalLabel: "LIVING SYSTEMS",
    ...lightDefault,
    surface: "rgba(251, 250, 246, 0.62)",
    elevation: 0.025,
  },
  "living-systems": {
    id: "living-systems",
    signalLabel: "SYSTEMS INDEX",
    ...lightDense,
    surface: "rgba(247, 246, 241, 0.82)",
  },
  "living-whisper": {
    id: "living-whisper",
    signalLabel: "SPATIAL PROOF",
    ...darkProof,
    surface: "rgba(8, 8, 7, 0.68)",
  },
  "living-atlas": {
    id: "living-atlas",
    signalLabel: "VISUAL ATLAS",
    ...lightDense,
  },
  "living-grammar": {
    id: "living-grammar",
    signalLabel: "INTERFACE GRAMMAR",
    ...lightDefault,
  },
  "living-practice": {
    id: "living-practice",
    signalLabel: "PRACTICE MODEL",
    ...lightDense,
  },
  "living-closing": {
    id: "living-closing",
    signalLabel: "START SIGNAL",
    ...actionDark,
  },
  "footer-closing": {
    id: "footer-closing",
    signalLabel: "CLOSING SIGNAL",
    ...lightDense,
    surface: "rgba(247, 246, 241, 0.82)",
    elevation: 0.05,
  },
  "policy-privacy": {
    id: "policy-privacy",
    signalLabel: "PRIVACY LAYER",
    ...lightDense,
    surface: "rgba(250, 249, 245, 0.78)",
  },
  "policy-legal": {
    id: "policy-legal",
    signalLabel: "LEGAL LAYER",
    ...lightDense,
    surface: "rgba(250, 249, 245, 0.78)",
  },
  "immersive-threshold": {
    id: "immersive-threshold",
    signalLabel: "IMMERSIVE SYSTEMS",
    ...lightDefault,
    surface: "rgba(246, 245, 240, 0.68)",
  },
  "immersive-map": {
    id: "immersive-map",
    signalLabel: "CHAMBER MAP",
    ...lightDense,
  },
  "immersive-proof": {
    id: "immersive-proof",
    signalLabel: "FIRST PROOF",
    ...lightDefault,
    surface: "rgba(248, 248, 245, 0.72)",
    border: "rgba(15, 15, 15, 0.085)",
    chipSurface: "rgba(255, 255, 255, 0.58)",
    elevation: 0.04,
  },
  "immersive-engines": {
    id: "immersive-engines",
    signalLabel: "ENGINE STACK",
    ...lightDense,
  },
  "immersive-future": {
    id: "immersive-future",
    signalLabel: "FUTURE CHAMBERS",
    ...lightDefault,
  },
  "immersive-layer": {
    id: "immersive-layer",
    signalLabel: "APPLICATION LAYER",
    ...lightDense,
  },
  "immersive-cta": {
    id: "immersive-cta",
    signalLabel: "START ROOM",
    ...actionDark,
  },
  "whisper-threshold": {
    id: "whisper-threshold",
    signalLabel: "WHISPER XR",
    ...darkProof,
    surface: "rgba(5, 5, 5, 0.7)",
    elevation: 0.2,
  },
  "whisper-atlas": {
    id: "whisper-atlas",
    signalLabel: "SPATIAL ATLAS",
    ...lightDense,
    surface: "rgba(246, 243, 236, 0.82)",
  },
  "whisper-web": {
    id: "whisper-web",
    signalLabel: "WEB EXHIBITION",
    ...lightDense,
    surface: "rgba(248, 246, 240, 0.84)",
  },
  "whisper-evidence": {
    id: "whisper-evidence",
    signalLabel: "SPATIAL FIELD",
    ...darkProof,
    surface: "rgba(6, 7, 6, 0.76)",
  },
  "whisper-xr": {
    id: "whisper-xr",
    signalLabel: "QUEST PROOF",
    ...darkProof,
    surface: "rgba(7, 7, 7, 0.74)",
  },
  "whisper-collector": {
    id: "whisper-collector",
    signalLabel: "OBJECT HANDOFF",
    ...lightDense,
    surface: "rgba(247, 244, 237, 0.82)",
  },
  "whisper-mobile": {
    id: "whisper-mobile",
    signalLabel: "MOBILE PROOF",
    ...darkProof,
    surface: "rgba(6, 6, 6, 0.74)",
  },
  "whisper-engine": {
    id: "whisper-engine",
    signalLabel: "ENGINE LEDGER",
    ...actionDark,
    surface: "rgba(5, 5, 5, 0.78)",
  },
  "webhero-threshold": {
    id: "webhero-threshold",
    signalLabel: "WEBHERO R&D",
    ...darkProof,
    surface: "rgba(6, 8, 10, 0.78)",
    elevation: 0.22,
  },
  "webhero-field": {
    id: "webhero-field",
    signalLabel: "LIVING VISUAL SYSTEMS",
    ...darkProof,
    surface: "rgba(7, 9, 12, 0.76)",
    elevation: 0.2,
  },
  "webhero-proof": {
    id: "webhero-proof",
    signalLabel: "SPATIAL PROOF FIELD",
    ...darkProof,
    surface: "rgba(7, 9, 12, 0.74)",
    elevation: 0.2,
  },
  "kool-berk-threshold": {
    id: "kool-berk-threshold",
    signalLabel: "SONIC OBJECT OS",
    ...darkProof,
    surface: "rgba(5, 8, 14, 0.78)",
    elevation: 0.22,
  },
  "kool-berk-object": {
    id: "kool-berk-object",
    signalLabel: "RELEASE OBJECT FIELD",
    ...darkProof,
    surface: "rgba(6, 8, 13, 0.76)",
    elevation: 0.2,
  },
  "kool-berk-room": {
    id: "kool-berk-room",
    signalLabel: "AUDIO REACTIVE ROOM",
    ...darkProof,
    surface: "rgba(8, 5, 7, 0.78)",
    elevation: 0.22,
  },
  "kool-berk-technical": {
    id: "kool-berk-technical",
    signalLabel: "SIGNAL DOSSIER",
    ...darkProof,
    surface: "rgba(6, 7, 10, 0.76)",
    elevation: 0.2,
  },
  "evidence-threshold": {
    id: "evidence-threshold",
    signalLabel: "EVIDENCE ATLAS",
    ...lightDefault,
  },
  "evidence-reader": {
    id: "evidence-reader",
    signalLabel: "EVIDENCE READER",
    ...lightDense,
  },
  "evidence-featured": {
    id: "evidence-featured",
    signalLabel: "FEATURED SYSTEMS",
    ...lightDense,
  },
  "evidence-available": {
    id: "evidence-available",
    signalLabel: "AVAILABLE SYSTEMS",
    ...lightDense,
  },
  "evidence-capability": {
    id: "evidence-capability",
    signalLabel: "CAPABILITY LAYER",
    ...lightDefault,
  },
  "evidence-index": {
    id: "evidence-index",
    signalLabel: "FAST INDEX",
    ...lightDense,
  },
  "evidence-cta": {
    id: "evidence-cta",
    signalLabel: "START PROJECT",
    ...actionDark,
  },
  "practice-threshold": {
    id: "practice-threshold",
    signalLabel: "PRACTICE MODEL",
    ...lightDefault,
  },
  "practice-build": {
    id: "practice-build",
    signalLabel: "COMMERCIAL SYSTEMS",
    ...lightDense,
  },
  "practice-system": {
    id: "practice-system",
    signalLabel: "NOT A PAGE",
    ...lightDense,
  },
  "practice-delivery": {
    id: "practice-delivery",
    signalLabel: "DELIVERY ENGINE",
    ...lightDense,
  },
  "practice-formats": {
    id: "practice-formats",
    signalLabel: "WAYS TO BEGIN",
    ...lightDefault,
  },
  "practice-output": {
    id: "practice-output",
    signalLabel: "RECEIVE",
    ...lightDense,
  },
  "practice-cta": {
    id: "practice-cta",
    signalLabel: "START OFFER",
    ...actionDark,
  },
  "about-threshold": {
    id: "about-threshold",
    signalLabel: "STUDIO POSITION",
    ...lightDefault,
    surface: "rgba(250, 249, 245, 0.7)",
  },
  "about-practice": {
    id: "about-practice",
    signalLabel: "PRACTICE LAYERS",
    ...lightDense,
  },
  "about-method": {
    id: "about-method",
    signalLabel: "METHOD SPINE",
    ...lightDense,
  },
  "about-proof": {
    id: "about-proof",
    signalLabel: "SYSTEM MAP",
    ...lightDefault,
  },
  "about-technical": {
    id: "about-technical",
    signalLabel: "TECHNICAL FOUNDATION",
    ...lightDense,
  },
  "about-principles": {
    id: "about-principles",
    signalLabel: "WORKING PRINCIPLES",
    ...darkProof,
    surface: "rgba(8, 8, 7, 0.68)",
  },
  "about-closing": {
    id: "about-closing",
    signalLabel: "AUTHORIAL NOTE",
    ...lightDense,
  },
};

export function getHeaderMoodForPath(pathname: string) {
  if (
    pathname === "/work" ||
    pathname.startsWith("/work/") ||
    pathname.startsWith("/work-lab/") ||
    pathname === "/evidence-atlas"
  ) {
    return headerThemeTokens.evidence;
  }
  if (
    pathname === "/immersive" ||
    pathname.startsWith("/immersive/") ||
    pathname === "/immersive-v2" ||
    pathname === "/spatial-proof"
  ) {
    return headerThemeTokens.immersive;
  }
  if (pathname === "/offer" || pathname.startsWith("/offer") || pathname === "/offer-v2") {
    return headerThemeTokens.practice;
  }
  if (
    pathname === "/about" ||
    pathname === "/about-v2" ||
    pathname === "/privacy" ||
    pathname === "/privacy-v2" ||
    pathname === "/legal" ||
    pathname === "/legal-v2"
  ) {
    return headerThemeTokens.studio;
  }
  return headerThemeTokens.living;
}

export function resolveHeaderTheme({ routeTheme, activeSceneId }: HeaderThemeResolverInput) {
  if (activeSceneId && headerSceneThemes[activeSceneId]) {
    return headerSceneThemes[activeSceneId];
  }

  return routeTheme;
}
