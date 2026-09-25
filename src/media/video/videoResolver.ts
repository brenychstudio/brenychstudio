import {
  VIDEO_MEDIA_ORIGIN,
  videoAssets,
  type VideoAsset,
  type VideoAssetId,
} from "./videoAssets";

export function resolveVideoAsset(id: VideoAssetId): string {
  // Widened to VideoAsset so the R2 branch stays type-checked while every entry is local.
  const asset: VideoAsset = videoAssets[id];

  if (asset.delivery === "local") {
    return asset.localPath;
  }

  if (!asset.r2) {
    throw new Error(`R2 video asset ${id} is missing its R2 descriptor`);
  }

  return `${VIDEO_MEDIA_ORIGIN}/${asset.r2.key}`;
}
