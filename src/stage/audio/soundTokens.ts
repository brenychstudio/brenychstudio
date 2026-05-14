export type SoundMaterial = "glass" | "air" | "signal" | "forest" | "tape" | "stone";

export type SoundTokens = {
  material: SoundMaterial;
  temperature: "cold" | "neutral" | "warm";
  density: "sparse" | "medium" | "dense";
  motion: "still" | "pulse" | "drift" | "rupture" | "reveal";
  emotion: "calm" | "memory" | "confirmation" | "discovery" | "tension" | "confidence";
  space: "near" | "room" | "distant" | "spatial";
};
