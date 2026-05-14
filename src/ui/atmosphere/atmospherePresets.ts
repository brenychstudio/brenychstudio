export type AtmospherePreset = "living" | "immersive" | "evidence" | "practice" | "case" | "classic";

export type AtmospherePresetConfig = {
  base: string;
  washA: string;
  washB: string;
  washC: string;
  gridOpacity: number;
  gridSize: number;
  lineOpacity: number;
  ringOpacity: number;
  noiseOpacity: number;
  lineSpeed: number;
};

export const atmospherePresets: Record<AtmospherePreset, AtmospherePresetConfig> = {
  living: {
    base: "#f2efe8",
    washA: "rgba(18, 22, 24, 0.105)",
    washB: "rgba(255, 255, 255, 0.92)",
    washC: "rgba(120, 126, 130, 0.12)",
    gridOpacity: 0.05,
    gridSize: 92,
    lineOpacity: 0.16,
    ringOpacity: 0.06,
    noiseOpacity: 0.045,
    lineSpeed: 24,
  },
  immersive: {
    base: "#f1eee7",
    washA: "rgba(10, 18, 18, 0.13)",
    washB: "rgba(255, 255, 255, 0.88)",
    washC: "rgba(76, 82, 88, 0.13)",
    gridOpacity: 0.046,
    gridSize: 88,
    lineOpacity: 0.17,
    ringOpacity: 0.064,
    noiseOpacity: 0.048,
    lineSpeed: 28,
  },
  evidence: {
    base: "#f3f1ec",
    washA: "rgba(32, 36, 38, 0.092)",
    washB: "rgba(255, 255, 255, 0.9)",
    washC: "rgba(104, 112, 118, 0.105)",
    gridOpacity: 0.042,
    gridSize: 84,
    lineOpacity: 0.115,
    ringOpacity: 0.05,
    noiseOpacity: 0.035,
    lineSpeed: 34,
  },
  practice: {
    base: "#f3f0e9",
    washA: "rgba(28, 31, 32, 0.084)",
    washB: "rgba(255, 255, 255, 0.94)",
    washC: "rgba(118, 120, 118, 0.09)",
    gridOpacity: 0.04,
    gridSize: 86,
    lineOpacity: 0.125,
    ringOpacity: 0.052,
    noiseOpacity: 0.036,
    lineSpeed: 36,
  },
  case: {
    base: "#f6f4ef",
    washA: "rgba(28, 30, 32, 0.05)",
    washB: "rgba(255, 255, 255, 0.96)",
    washC: "rgba(120, 120, 114, 0.06)",
    gridOpacity: 0.026,
    gridSize: 90,
    lineOpacity: 0.07,
    ringOpacity: 0.032,
    noiseOpacity: 0.026,
    lineSpeed: 42,
  },
  classic: {
    base: "#f5f3ee",
    washA: "rgba(28, 30, 32, 0.045)",
    washB: "rgba(255, 255, 255, 0.92)",
    washC: "rgba(130, 126, 116, 0.065)",
    gridOpacity: 0.024,
    gridSize: 92,
    lineOpacity: 0.06,
    ringOpacity: 0.028,
    noiseOpacity: 0.02,
    lineSpeed: 44,
  },
};
