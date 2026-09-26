import type { VideoAssetId } from "../media/video/videoAssets";

/**
 * Canonical project registry schema (BSW-CORE-01, Architecture B).
 *
 * This is a thin identity / classification / evidence layer. It references the existing
 * authored content registries (cases.ts, immersive.ts, videoAssets.ts) and never copies
 * their narrative, media sequences or stack. Machine IDs and enum values are never
 * localized; human-readable labels are derived later per locale.
 *
 * Everything stored here lives in a public repository, so every record, evidence
 * reference and milestone must itself be safe to reference publicly. Entities that are
 * not yet disclosed do not exist in this registry at all.
 */

// ---- Common ------------------------------------------------------------------------------------

/** Calendar date written as YYYY-MM-DD. Validated as a real date, never against the clock. */
export type IsoDate = `${number}-${number}-${number}`;

export type PublicLocale = "en" | "es";

export type LocalizedText = {
  en: string;
  es?: string;
};

// ---- Taxonomies --------------------------------------------------------------------------------

export type ProjectVertical =
  | "product"
  | "agent-infrastructure"
  | "creative-technology"
  | "spatial-interactive"
  | "game-world"
  | "web-systems";

export type ProjectOrigin =
  | "studio-product"
  | "internal-system"
  | "client-work"
  | "collaboration"
  | "authored-concept"
  | "research"
  | "game-ip";

/**
 * Level reached, not activity. "Active development", "shipped", "live", "production-ready"
 * and "sales-ready" are labels or prose derived from maturity plus deployment, never
 * machine values.
 */
export type ProjectMaturity =
  | "concept"
  | "prototype"
  | "beta"
  | "pre-release"
  | "released"
  | "archived";

export type ProjectDeployment =
  | "none"
  | "private-environment"
  | "internal-runtime"
  | "public-demo"
  | "public-production"
  | "store-preparation"
  | "store-released";

/** Whether somebody can buy, use or request the thing. Independent of maturity. */
export type CommercialAvailability =
  | "not-offered"
  | "adaptation-available"
  | "reference-only"
  | "controlled-access"
  | "public-access";

/**
 * Publication / disclosure boundary of the record.
 *
 * public-listed   safe for normal public discovery surfaces
 * public-unlisted public / direct-link material intentionally excluded from discovery
 *                 (e.g. the current Living Atlas trust surface)
 * private-named   safe to mention by name and minimal approved facts only; no public
 *                 route implied
 *
 * There is intentionally no "withheld" value: a withheld entity must not exist in this
 * public repository registry at all.
 */
export type ProjectVisibility = "public-listed" | "public-unlisted" | "private-named";

// ---- Links -------------------------------------------------------------------------------------

export type ProjectLinkKind = "live" | "repository" | "store" | "docs" | "support" | "privacy";

/** `id` is stable inside its project; evidence and milestone sources reference it by `linkId`. */
export type ProjectLink = {
  id: string;
  kind: ProjectLinkKind;
  href: string;
  label?: LocalizedText;
};

// ---- Routes ------------------------------------------------------------------------------------

export type ProjectRouteSurface = "work" | "immersive" | "product" | "research" | "trust";

export type ProjectRoute = {
  surface: ProjectRouteSurface;
  path: `/${string}`;
  locales: PublicLocale[];
  noIndex?: boolean;
};

// ---- Approved media references -----------------------------------------------------------------

export type ProjectMediaPurpose = "poster" | "og" | "thumbnail" | "hero" | "walkthrough";

/** References to existing approved assets only. No binaries live in the registry. */
export type ProjectMediaRef = {
  id: string;
  purpose: ProjectMediaPurpose;
  asset:
    | {
        kind: "image";
        src: string;
      }
    | {
        kind: "video";
        videoAssetId: VideoAssetId;
        poster?: string;
      }
    | {
        kind: "case-poster";
        caseSlug: string;
      }
    | {
        kind: "immersive-poster";
        immersiveSlug: string;
      };
  alt: LocalizedText;
  locale?: PublicLocale;
};

// ---- Evidence ----------------------------------------------------------------------------------

/** Evidence stored here is always publicly safe: there is no private evidence visibility. */
export type EvidenceVisibility = "public" | "unlisted";

export type EvidenceBase = {
  proves: LocalizedText;
  visibility: EvidenceVisibility;
  limitations?: LocalizedText;
};

/**
 * A pointer to existing proof. It never copies the proof: `work-case` and `immersive-case`
 * point at registry slugs, `project-link` / `media` point at ids inside the same project,
 * and `milestone` points at a MilestoneRecord. A release is a MilestoneRecord of type
 * "release", referenced through `kind: "milestone"`; there is no separate release kind.
 */
export type ProjectEvidenceRef =
  | ({
      kind: "work-case";
      slug: string;
    } & EvidenceBase)
  | ({
      kind: "immersive-case";
      slug: string;
    } & EvidenceBase)
  | ({
      kind: "project-link";
      linkId: string;
    } & EvidenceBase)
  | ({
      kind: "milestone";
      milestoneId: string;
    } & EvidenceBase)
  | ({
      kind: "media";
      mediaId: string;
    } & EvidenceBase);

// ---- Localized core copy -----------------------------------------------------------------------

/** The brand / product name stays in `ProjectRecord.publicName`; it is a name, not a translation. */
export type LocalizedProjectCopy = {
  oneLiner: LocalizedText;
  summary?: LocalizedText;
};

// ---- Review provenance -------------------------------------------------------------------------

/**
 * Deterministic provenance. `lastReviewed` is authored by hand and bumped only when a truth
 * field changes; it is never generated from a runtime timestamp and never validated against
 * the current clock.
 */
export type ProjectReview = {
  lastReviewed: IsoDate;
  owner: "studio-owner";
  note?: string;
};

// ---- Project record ----------------------------------------------------------------------------

export type ProjectServiceSlug =
  | "premium-landing-page"
  | "product-demo-landing"
  | "interactive-web-systems";

/**
 * One canonical entity of the studio ecosystem. Presentation ordering (featured, home order,
 * section, hero priority, card size, theme) is deliberately absent: it belongs to surface
 * composition, not to canonical truth.
 */
export type ProjectRecord = {
  id: string;
  publicName: string;
  aliases: string[];

  vertical: ProjectVertical;
  origin: ProjectOrigin;
  maturity: ProjectMaturity;
  deployment: ProjectDeployment;
  commercialAvailability: CommercialAvailability;
  visibility: ProjectVisibility;

  copy: LocalizedProjectCopy;
  limitations: LocalizedText[];

  evidence: ProjectEvidenceRef[];
  links: ProjectLink[];
  routes: ProjectRoute[];
  media: ProjectMediaRef[];

  serviceSlugs?: ProjectServiceSlug[];

  review: ProjectReview;
};

// ---- Relationships -----------------------------------------------------------------------------

export type ProjectRelationshipType = "pipeline-next" | "tooling-for" | "research-for" | "related";

/** Stored as one global array, never embedded per project. */
export type ProjectRelationship = {
  id: string;
  type: ProjectRelationshipType;
  fromProjectId: string;
  toProjectId: string;
  label?: LocalizedText;
};

// ---- Milestones --------------------------------------------------------------------------------

export type MilestoneType =
  | "program-participation"
  | "release"
  | "submission"
  | "event"
  | "publication"
  | "award"
  | "partnership";

export type MilestoneStatus =
  | "planned"
  | "submitted"
  | "accepted"
  | "active"
  | "completed"
  | "declined"
  | "withdrawn"
  | "expired";

export type MilestoneDate =
  | {
      kind: "date";
      value: IsoDate;
    }
  | {
      kind: "month";
      value: `${number}-${number}`;
    }
  | {
      kind: "unknown";
    };

/**
 * What backs a milestone claim. Deliberately not ProjectEvidenceRef: evidence may point at a
 * milestone, so milestone sources must not point back at evidence.
 */
export type MilestoneSourceRef =
  | {
      kind: "url";
      href: string;
      label?: LocalizedText;
    }
  | {
      kind: "repository";
      href: string;
      label?: LocalizedText;
    }
  | {
      kind: "docs";
      href: string;
      label?: LocalizedText;
    }
  | {
      kind: "project-link";
      linkId: string;
    }
  | {
      kind: "media";
      mediaId: string;
    };

/**
 * A public-safe program / release / event claim with an exact status. Loose claims such as
 * "partner", "supported by", "selected by" or "released" are only allowed through a record
 * here, with status, date and sources.
 */
export type MilestoneRecord = {
  id: string;
  projectId: string;

  type: MilestoneType;
  label: LocalizedText;
  counterparty?: string;

  status: MilestoneStatus;

  date: MilestoneDate;
  endDate?: MilestoneDate;

  sources: MilestoneSourceRef[];

  visibility: EvidenceVisibility;
  limitations: LocalizedText[];

  review: ProjectReview;
};
