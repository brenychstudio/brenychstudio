// Canonical video identity and delivery state. Consumers ask for a stable asset ID and never
// hold a storage path, so an asset can move from the Pages build (local) to R2 by changing its
// entry here after the R2 object has been uploaded and verified.
//
// R2 objects are immutable: a replacement is a new `-vNNN` key, never an overwrite. Every
// entry below still delivers its current local file; the `r2` descriptors are the planned
// keys for a future migration and are not used while `delivery` is "local".

export const VIDEO_MEDIA_ORIGIN = "https://media.brenychstudio.com" as const;

export type VideoDeliveryMode = "local" | "r2";

export type VideoCompatibilityStatus =
  | "legacy"
  | "ready"
  | "pending-replacement";

export type VideoAsset = {
  id: string;
  project: string;
  surface: string;
  delivery: VideoDeliveryMode;
  localPath: string;
  r2?: {
    key: string;
    version: number;
  };
  poster?: string;
  compatibility: {
    baseline: "h264";
    status: VideoCompatibilityStatus;
  };
};

export const videoAssets = {
  "whisper.home.hero": {
    id: "whisper.home.hero",
    project: "whisper",
    surface: "home",
    delivery: "local",
    localPath: "/immersive/Whisper/Video/hero-home-video.mp4",
    r2: {
      key: "video/whisper/home/hero-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "whisper.immersive.hero": {
    id: "whisper.immersive.hero",
    project: "whisper",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/Whisper/Video/whisper-hero-poster.mp4",
    r2: {
      key: "video/whisper/immersive/hero-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "whisper.immersive.desktop": {
    id: "whisper.immersive.desktop",
    project: "whisper",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/Whisper/Video/whisper-desktop-video.mp4",
    r2: {
      key: "video/whisper/immersive/desktop-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "whisper.immersive.vr": {
    id: "whisper.immersive.vr",
    project: "whisper",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/Whisper/Video/whisper-vr-video.mp4",
    r2: {
      key: "video/whisper/immersive/vr-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "webhero.immersive.field": {
    id: "webhero.immersive.field",
    project: "webhero",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/webhero/video/webhero-video-field.mp4",
    r2: {
      key: "video/webhero/immersive/field-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "webhero.immersive.backdrops": {
    id: "webhero.immersive.backdrops",
    project: "webhero",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/webhero/video/webhero-video-backdrops.mp4",
    r2: {
      key: "video/webhero/immersive/backdrops-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "webhero.immersive.living-images": {
    id: "webhero.immersive.living-images",
    project: "webhero",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/webhero/video/webhero-video-living-images.mp4",
    r2: {
      key: "video/webhero/immersive/living-images-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "webhero.immersive.art-room": {
    id: "webhero.immersive.art-room",
    project: "webhero",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/webhero/video/webhero-video-art-room.mp4",
    r2: {
      key: "video/webhero/immersive/art-room-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "kool-berk.immersive.walkthrough": {
    id: "kool-berk.immersive.walkthrough",
    project: "kool-berk",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/kool-berk/video/kool-berk-video.mp4",
    r2: {
      key: "video/kool-berk/immersive/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "presence-os.immersive.walkthrough": {
    id: "presence-os.immersive.walkthrough",
    project: "presence-os",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/presence-os-memory-atlas/video/presence-os-memory-atlas-video.mp4",
    r2: {
      key: "video/presence-os/immersive/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "presence-os.immersive.vr": {
    id: "presence-os.immersive.vr",
    project: "presence-os",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/presence-os-memory-atlas/video/presence-os-memory-atlas-vr-video.mp4",
    r2: {
      key: "video/presence-os/immersive/vr-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "orbit-lens.immersive.walkthrough": {
    id: "orbit-lens.immersive.walkthrough",
    project: "orbit-lens",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/orbit-lens/video/orbit-lens-video.mp4",
    r2: {
      key: "video/orbit-lens/immersive/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "orbit-lens.immersive.vr": {
    id: "orbit-lens.immersive.vr",
    project: "orbit-lens",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/orbit-lens/video/orbit-lens-vr-video.mp4",
    r2: {
      key: "video/orbit-lens/immersive/vr-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "collective-presence.immersive.walkthrough": {
    id: "collective-presence.immersive.walkthrough",
    project: "collective-presence",
    surface: "immersive",
    delivery: "local",
    localPath: "/immersive/future/collective-presence-interface/Collective-Presence-Interface-video.mp4",
    r2: {
      key: "video/collective-presence/immersive/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "arcwave.case.walkthrough": {
    id: "arcwave.case.walkthrough",
    project: "arcwave",
    surface: "case",
    delivery: "local",
    localPath: "/cases/arcwave-integrations/v2/arcwave-video.mp4",
    r2: {
      key: "video/arcwave/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "aurel-eon-gt.case.walkthrough": {
    id: "aurel-eon-gt.case.walkthrough",
    project: "aurel-eon-gt",
    surface: "case",
    delivery: "local",
    localPath: "/cases/aurel-eon-gt/aurel-eon-gt-video.mp4",
    r2: {
      key: "video/aurel-eon-gt/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "bcn-advisory.case.walkthrough": {
    id: "bcn-advisory.case.walkthrough",
    project: "bcn-advisory",
    surface: "case",
    delivery: "local",
    localPath: "/cases/bcn-advisory/v2/bcn-advisory-video.mp4",
    r2: {
      key: "video/bcn-advisory/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "casa-nube.case.walkthrough": {
    id: "casa-nube.case.walkthrough",
    project: "casa-nube",
    surface: "case",
    delivery: "local",
    localPath: "/cases/casa-nube/video/casa-video.mp4",
    r2: {
      key: "video/casa-nube/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "fluid-exhibition.case.walkthrough": {
    id: "fluid-exhibition.case.walkthrough",
    project: "fluid-exhibition",
    surface: "case",
    delivery: "local",
    localPath: "/cases/fluid-exhibition/video/fluid-video.mp4",
    r2: {
      key: "video/fluid-exhibition/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "form-index.case.walkthrough": {
    id: "form-index.case.walkthrough",
    project: "form-index",
    surface: "case",
    delivery: "local",
    localPath: "/cases/form-index/video/fr-video.mp4",
    r2: {
      key: "video/form-index/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "house-of-lune.case.walkthrough": {
    id: "house-of-lune.case.walkthrough",
    project: "house-of-lune",
    surface: "case",
    delivery: "local",
    localPath: "/cases/house-of-lune/video/house-of-lune-video.mp4",
    r2: {
      key: "video/house-of-lune/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "oria-house.case.walkthrough": {
    id: "oria-house.case.walkthrough",
    project: "oria-house",
    surface: "case",
    delivery: "local",
    localPath: "/cases/oria-house-barcelona/oria-house-video.mp4",
    r2: {
      key: "video/oria-house/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "print-border.case.walkthrough": {
    id: "print-border.case.walkthrough",
    project: "print-border",
    surface: "case",
    delivery: "local",
    localPath: "/cases/print-border-studio/video/psb-video.mp4",
    r2: {
      key: "video/print-border/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "sprintcrm.case.walkthrough": {
    id: "sprintcrm.case.walkthrough",
    project: "sprintcrm",
    surface: "case",
    delivery: "local",
    localPath: "/cases/sprintcrm/video/sprintcrm-video.mp4",
    r2: {
      key: "video/sprintcrm/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
  "weekfield.case.walkthrough": {
    id: "weekfield.case.walkthrough",
    project: "weekfield",
    surface: "case",
    delivery: "local",
    localPath: "/cases/creatorops/v2/creatorops-video.mp4",
    r2: {
      key: "video/weekfield/case/walkthrough-v001.mp4",
      version: 1,
    },
    compatibility: {
      baseline: "h264",
      status: "pending-replacement",
    },
  },
} as const satisfies Record<string, VideoAsset>;

export type VideoAssetId = keyof typeof videoAssets;
