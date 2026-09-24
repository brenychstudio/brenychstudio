export type HomeMediaMode =
  | "normal"
  | "dataSaver"
  | "reducedMotion";

export type HomeMediaEligibilityInput = {
  mode: HomeMediaMode;
  isWarm: boolean;
  isActive: boolean;
  wasAttached: boolean;
};

export type HomeMediaPlaybackInput = {
  mode: HomeMediaMode;
  isActive: boolean;
  pageVisible: boolean;
  failed: boolean;
};

// Priority: reduced motion > Save-Data > normal.
export function resolveHomeMediaMode(
  reducedMotion: boolean,
  saveData: boolean,
): HomeMediaMode {
  if (reducedMotion) return "reducedMotion";
  if (saveData) return "dataSaver";
  return "normal";
}

export function getHomeActiveThreshold(
  viewportWidth: number,
): number {
  return viewportWidth < 768 ? 0.25 : 0.3;
}

export function shouldAttachHomeVideoSource({
  mode,
  isWarm,
  isActive,
  wasAttached,
}: HomeMediaEligibilityInput): boolean {
  // Once attached, keep attached in every mode for this mount.
  if (wasAttached) return true;
  // Reduced motion never initiates an MP4 attachment.
  if (mode === "reducedMotion") return false;
  // Save-Data attaches only when the scene is actually ACTIVE.
  if (mode === "dataSaver") return isActive;
  // Normal mode may warm ahead of the viewport.
  return isWarm || isActive;
}

export function shouldPlayHomeVideo({
  mode,
  isActive,
  pageVisible,
  failed,
}: HomeMediaPlaybackInput): boolean {
  return (
    mode !== "reducedMotion" &&
    isActive &&
    pageVisible &&
    !failed
  );
}
