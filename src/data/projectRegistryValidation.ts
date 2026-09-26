import type {
  CommercialAvailability,
  EvidenceVisibility,
  MilestoneRecord,
  MilestoneStatus,
  MilestoneType,
  ProjectDeployment,
  ProjectLinkKind,
  ProjectMaturity,
  ProjectMediaPurpose,
  ProjectOrigin,
  ProjectRecord,
  ProjectRelationship,
  ProjectRelationshipType,
  ProjectRouteSurface,
  ProjectServiceSlug,
  ProjectVertical,
  ProjectVisibility,
  PublicLocale,
} from "./projectRegistry.types";

/**
 * Deterministic validation for the canonical project registry (BSW-CORE-01).
 *
 * Pure function over explicit inputs: the registries under test and the reference sets they
 * may point at (case slugs, immersive slugs, video asset ids). No filesystem, network, clock
 * or environment access, so the same source tree always yields the same result and self-tests
 * can run against in-memory fixtures without touching production data.
 */

export type ProjectRegistryIssueCode =
  | "PROJECT_ID_INVALID"
  | "PROJECT_ID_DUPLICATE"
  | "PROJECT_NAME_EMPTY"
  | "PROJECT_ALIAS_INVALID"
  | "PROJECT_ALIAS_DUPLICATE"
  | "ENUM_VALUE_INVALID"
  | "TEXT_EN_EMPTY"
  | "TEXT_ES_EMPTY"
  | "TEXT_ES_MISSING"
  | "LINK_ID_INVALID"
  | "LINK_ID_DUPLICATE"
  | "LINK_HREF_INVALID"
  | "MEDIA_ID_INVALID"
  | "MEDIA_ID_DUPLICATE"
  | "MEDIA_KIND_INVALID"
  | "MEDIA_IMAGE_SRC_INVALID"
  | "MEDIA_VIDEO_ASSET_UNKNOWN"
  | "MEDIA_CASE_POSTER_UNKNOWN"
  | "MEDIA_IMMERSIVE_POSTER_UNKNOWN"
  | "ROUTE_PATH_INVALID"
  | "ROUTE_PATH_DUPLICATE"
  | "ROUTE_LOCALES_EMPTY"
  | "ROUTE_LOCALE_INVALID"
  | "ROUTE_LOCALE_DUPLICATE"
  | "EVIDENCE_KIND_INVALID"
  | "EVIDENCE_WORK_CASE_UNKNOWN"
  | "EVIDENCE_IMMERSIVE_CASE_UNKNOWN"
  | "EVIDENCE_LINK_UNKNOWN"
  | "EVIDENCE_MEDIA_UNKNOWN"
  | "EVIDENCE_MILESTONE_UNKNOWN"
  | "EVIDENCE_MILESTONE_FOREIGN"
  | "SERVICE_SLUG_DUPLICATE"
  | "REVIEW_DATE_INVALID"
  | "REVIEW_OWNER_INVALID"
  | "VISIBILITY_LISTED_ROUTE_REQUIRED"
  | "VISIBILITY_LISTED_EVIDENCE_REQUIRED"
  | "VISIBILITY_UNLISTED_ROUTE_INDEXABLE"
  | "VISIBILITY_PRIVATE_ROUTE_FORBIDDEN"
  | "RELATIONSHIP_ID_INVALID"
  | "RELATIONSHIP_ID_DUPLICATE"
  | "RELATIONSHIP_PROJECT_UNKNOWN"
  | "RELATIONSHIP_SELF"
  | "MILESTONE_ID_INVALID"
  | "MILESTONE_ID_DUPLICATE"
  | "MILESTONE_PROJECT_UNKNOWN"
  | "MILESTONE_COUNTERPARTY_EMPTY"
  | "MILESTONE_DATE_KIND_INVALID"
  | "MILESTONE_DATE_INVALID"
  | "MILESTONE_MONTH_INVALID"
  | "MILESTONE_END_BEFORE_START"
  | "MILESTONE_SOURCE_KIND_INVALID"
  | "MILESTONE_SOURCE_HREF_INVALID"
  | "MILESTONE_SOURCE_LINK_UNKNOWN"
  | "MILESTONE_SOURCE_MEDIA_UNKNOWN"
  | "MILESTONE_SOURCES_REQUIRED";

export type ProjectRegistryIssue = {
  code: ProjectRegistryIssueCode;
  path: string;
  message: string;
};

export type ProjectRegistryInput = {
  projects: readonly ProjectRecord[];
  projectRelationships: readonly ProjectRelationship[];
  milestones: readonly MilestoneRecord[];
};

export type ProjectRegistryReferences = {
  caseSlugs: Iterable<string>;
  immersiveSlugs: Iterable<string>;
  videoAssetIds: Iterable<string>;
};

export type ProjectRegistryValidationResult = {
  ok: boolean;
  issues: ProjectRegistryIssue[];
  counts: {
    projects: number;
    relationships: number;
    milestones: number;
  };
};

// ---- Value tables --------------------------------------------------------------------------------
// Record<Enum, true> keeps each table exhaustive and free of extras at type level while giving the
// validator a runtime membership check for fixtures that bypass the type system.

const PROJECT_VERTICALS: Record<ProjectVertical, true> = {
  product: true,
  "agent-infrastructure": true,
  "creative-technology": true,
  "spatial-interactive": true,
  "game-world": true,
  "web-systems": true,
};

const PROJECT_ORIGINS: Record<ProjectOrigin, true> = {
  "studio-product": true,
  "internal-system": true,
  "client-work": true,
  collaboration: true,
  "authored-concept": true,
  research: true,
  "game-ip": true,
};

const PROJECT_MATURITIES: Record<ProjectMaturity, true> = {
  concept: true,
  prototype: true,
  beta: true,
  "pre-release": true,
  released: true,
  archived: true,
};

const PROJECT_DEPLOYMENTS: Record<ProjectDeployment, true> = {
  none: true,
  "private-environment": true,
  "internal-runtime": true,
  "public-demo": true,
  "public-production": true,
  "store-preparation": true,
  "store-released": true,
};

const COMMERCIAL_AVAILABILITIES: Record<CommercialAvailability, true> = {
  "not-offered": true,
  "adaptation-available": true,
  "reference-only": true,
  "controlled-access": true,
  "public-access": true,
};

const PROJECT_VISIBILITIES: Record<ProjectVisibility, true> = {
  "public-listed": true,
  "public-unlisted": true,
  "private-named": true,
};

const EVIDENCE_VISIBILITIES: Record<EvidenceVisibility, true> = {
  public: true,
  unlisted: true,
};

const PUBLIC_LOCALES: Record<PublicLocale, true> = {
  en: true,
  es: true,
};

const LINK_KINDS: Record<ProjectLinkKind, true> = {
  live: true,
  repository: true,
  store: true,
  docs: true,
  support: true,
  privacy: true,
};

const ROUTE_SURFACES: Record<ProjectRouteSurface, true> = {
  work: true,
  immersive: true,
  product: true,
  research: true,
  trust: true,
};

const MEDIA_PURPOSES: Record<ProjectMediaPurpose, true> = {
  poster: true,
  og: true,
  thumbnail: true,
  hero: true,
  walkthrough: true,
};

const SERVICE_SLUGS: Record<ProjectServiceSlug, true> = {
  "premium-landing-page": true,
  "product-demo-landing": true,
  "interactive-web-systems": true,
};

const RELATIONSHIP_TYPES: Record<ProjectRelationshipType, true> = {
  "pipeline-next": true,
  "tooling-for": true,
  "research-for": true,
  related: true,
};

const MILESTONE_TYPES: Record<MilestoneType, true> = {
  "program-participation": true,
  release: true,
  submission: true,
  event: true,
  publication: true,
  award: true,
  partnership: true,
};

const MILESTONE_STATUSES: Record<MilestoneStatus, true> = {
  planned: true,
  submitted: true,
  accepted: true,
  active: true,
  completed: true,
  declined: true,
  withdrawn: true,
  expired: true,
};

/** Statuses that assert a public fact and therefore need at least one source. */
const MILESTONE_STATUSES_REQUIRING_SOURCES: Record<Extract<MilestoneStatus, "accepted" | "active" | "completed">, true> = {
  accepted: true,
  active: true,
  completed: true,
};

const REVIEW_OWNER = "studio-owner";

// ---- Shapes --------------------------------------------------------------------------------------

const KEBAB_CASE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROUTE_PATH_RE = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/;
const ROOT_RELATIVE_RE = /^\/[^\s/][^\s]*$/;
const HREF_RE = /^(?:https?:\/\/[^\s]+|mailto:[^\s]+)$/;
const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_MONTH_RE = /^(\d{4})-(\d{2})$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMember<T extends string>(table: Record<T, true>, value: unknown): value is T {
  return typeof value === "string" && Object.hasOwn(table, value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Real calendar date in YYYY-MM-DD form. Never compared with the current clock. */
export function isCalendarDate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const match = ISO_DATE_RE.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1970 || month < 1 || month > 12 || day < 1) return false;

  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  return day <= daysInMonth;
}

/** Real calendar month in YYYY-MM form. */
export function isCalendarMonth(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const match = ISO_MONTH_RE.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  return year >= 1970 && month >= 1 && month <= 12;
}

function label(id: unknown, index: number) {
  return isNonEmptyString(id) ? id : `#${index}`;
}

// ---- Validator -----------------------------------------------------------------------------------

export function validateProjectRegistry(
  input: ProjectRegistryInput,
  references: ProjectRegistryReferences,
): ProjectRegistryValidationResult {
  const issues: ProjectRegistryIssue[] = [];
  const report = (code: ProjectRegistryIssueCode, path: string, message: string) => {
    issues.push({ code, path, message });
  };

  const caseSlugs = new Set(references.caseSlugs);
  const immersiveSlugs = new Set(references.immersiveSlugs);
  const videoAssetIds = new Set(references.videoAssetIds);

  const { projects, projectRelationships, milestones } = input;

  // Localized text ------------------------------------------------------------------------------

  const checkText = (text: unknown, path: string, requireEs: boolean) => {
    if (!isRecord(text) || !isNonEmptyString(text.en)) {
      report("TEXT_EN_EMPTY", path, "localized text needs non-empty English");
      return;
    }
    if (text.es !== undefined) {
      if (!isNonEmptyString(text.es)) report("TEXT_ES_EMPTY", path, "Spanish copy is present but empty");
      return;
    }
    if (requireEs) report("TEXT_ES_MISSING", path, "public-facing copy requires Spanish");
  };

  const checkOptionalText = (text: unknown, path: string, requireEs: boolean) => {
    if (text !== undefined) checkText(text, path, requireEs);
  };

  const checkTextList = (list: unknown, path: string, requireEs: boolean) => {
    if (!Array.isArray(list)) {
      report("TEXT_EN_EMPTY", path, "expected a list of localized texts");
      return;
    }
    list.forEach((text, index) => checkText(text, `${path}[${index}]`, requireEs));
  };

  const checkEnum = <T extends string>(table: Record<T, true>, value: unknown, path: string) => {
    if (!isMember(table, value)) {
      report("ENUM_VALUE_INVALID", path, `"${String(value)}" is not one of ${Object.keys(table).join(" | ")}`);
    }
  };

  const checkReview = (review: unknown, path: string) => {
    if (!isRecord(review)) {
      report("REVIEW_DATE_INVALID", path, "review block is missing");
      return;
    }
    if (!isCalendarDate(review.lastReviewed)) {
      report("REVIEW_DATE_INVALID", `${path}.lastReviewed`, `"${String(review.lastReviewed)}" is not a real YYYY-MM-DD date`);
    }
    if (review.owner !== REVIEW_OWNER) {
      report("REVIEW_OWNER_INVALID", `${path}.owner`, `review owner must be "${REVIEW_OWNER}"`);
    }
  };

  // Projects ------------------------------------------------------------------------------------

  const projectIds = new Set<string>();
  const projectById = new Map<string, ProjectRecord>();
  const milestoneById = new Map<string, MilestoneRecord>();
  const globalRoutePaths = new Map<string, string>();

  for (const milestone of milestones) {
    if (isNonEmptyString(milestone.id) && !milestoneById.has(milestone.id)) milestoneById.set(milestone.id, milestone);
  }

  projects.forEach((project, index) => {
    const path = `project(${label(project.id, index)})`;

    if (!isNonEmptyString(project.id) || !KEBAB_CASE_RE.test(project.id)) {
      report("PROJECT_ID_INVALID", `${path}.id`, "project id must be kebab-case");
    } else if (projectIds.has(project.id)) {
      report("PROJECT_ID_DUPLICATE", `${path}.id`, `duplicate project id "${project.id}"`);
    } else {
      projectIds.add(project.id);
      projectById.set(project.id, project);
    }

    if (!isNonEmptyString(project.publicName)) {
      report("PROJECT_NAME_EMPTY", `${path}.publicName`, "publicName is required");
    }

    const aliases = Array.isArray(project.aliases) ? project.aliases : [];
    if (!Array.isArray(project.aliases)) report("PROJECT_ALIAS_INVALID", `${path}.aliases`, "aliases must be an array");
    const seenAliases = new Set<string>();
    aliases.forEach((alias, aliasIndex) => {
      const aliasPath = `${path}.aliases[${aliasIndex}]`;
      if (!isNonEmptyString(alias)) {
        report("PROJECT_ALIAS_INVALID", aliasPath, "alias must be a non-empty string");
        return;
      }
      if (alias === project.publicName) report("PROJECT_ALIAS_INVALID", aliasPath, "alias repeats publicName");
      if (seenAliases.has(alias)) report("PROJECT_ALIAS_DUPLICATE", aliasPath, `duplicate alias "${alias}"`);
      seenAliases.add(alias);
    });

    checkEnum(PROJECT_VERTICALS, project.vertical, `${path}.vertical`);
    checkEnum(PROJECT_ORIGINS, project.origin, `${path}.origin`);
    checkEnum(PROJECT_MATURITIES, project.maturity, `${path}.maturity`);
    checkEnum(PROJECT_DEPLOYMENTS, project.deployment, `${path}.deployment`);
    checkEnum(COMMERCIAL_AVAILABILITIES, project.commercialAvailability, `${path}.commercialAvailability`);
    checkEnum(PROJECT_VISIBILITIES, project.visibility, `${path}.visibility`);

    const listed = project.visibility === "public-listed";

    if (!isRecord(project.copy)) {
      report("TEXT_EN_EMPTY", `${path}.copy.oneLiner`, "copy block is missing");
    } else {
      checkText(project.copy.oneLiner, `${path}.copy.oneLiner`, listed);
      checkOptionalText(project.copy.summary, `${path}.copy.summary`, listed);
    }
    checkTextList(project.limitations, `${path}.limitations`, listed);

    // Links
    const linkIds = new Set<string>();
    const links = Array.isArray(project.links) ? project.links : [];
    links.forEach((link, linkIndex) => {
      const linkPath = `${path}.links[${linkIndex}]`;
      if (!isNonEmptyString(link.id) || !KEBAB_CASE_RE.test(link.id)) {
        report("LINK_ID_INVALID", `${linkPath}.id`, "link id must be kebab-case");
      } else if (linkIds.has(link.id)) {
        report("LINK_ID_DUPLICATE", `${linkPath}.id`, `duplicate link id "${link.id}" in project`);
      } else {
        linkIds.add(link.id);
      }
      checkEnum(LINK_KINDS, link.kind, `${linkPath}.kind`);
      if (typeof link.href !== "string" || !HREF_RE.test(link.href)) {
        report("LINK_HREF_INVALID", `${linkPath}.href`, "href must be an absolute http(s) URL or mailto:");
      }
      checkOptionalText(link.label, `${linkPath}.label`, listed);
    });

    // Media
    const mediaIds = new Set<string>();
    const media = Array.isArray(project.media) ? project.media : [];
    media.forEach((item, mediaIndex) => {
      const mediaPath = `${path}.media[${mediaIndex}]`;
      if (!isNonEmptyString(item.id) || !KEBAB_CASE_RE.test(item.id)) {
        report("MEDIA_ID_INVALID", `${mediaPath}.id`, "media id must be kebab-case");
      } else if (mediaIds.has(item.id)) {
        report("MEDIA_ID_DUPLICATE", `${mediaPath}.id`, `duplicate media id "${item.id}" in project`);
      } else {
        mediaIds.add(item.id);
      }
      checkEnum(MEDIA_PURPOSES, item.purpose, `${mediaPath}.purpose`);
      checkText(item.alt, `${mediaPath}.alt`, listed);
      if (item.locale !== undefined) checkEnum(PUBLIC_LOCALES, item.locale, `${mediaPath}.locale`);

      const asset: unknown = item.asset;
      if (!isRecord(asset)) {
        report("MEDIA_KIND_INVALID", `${mediaPath}.asset`, "asset is missing");
        return;
      }
      switch (asset.kind) {
        case "image":
          if (typeof asset.src !== "string" || !ROOT_RELATIVE_RE.test(asset.src)) {
            report("MEDIA_IMAGE_SRC_INVALID", `${mediaPath}.asset.src`, "image src must be a root-relative path");
          }
          break;
        case "video":
          if (typeof asset.videoAssetId !== "string" || !videoAssetIds.has(asset.videoAssetId)) {
            report("MEDIA_VIDEO_ASSET_UNKNOWN", `${mediaPath}.asset.videoAssetId`, `unknown video asset "${String(asset.videoAssetId)}"`);
          }
          if (asset.poster !== undefined && (typeof asset.poster !== "string" || !ROOT_RELATIVE_RE.test(asset.poster))) {
            report("MEDIA_IMAGE_SRC_INVALID", `${mediaPath}.asset.poster`, "video poster must be a root-relative path");
          }
          break;
        case "case-poster":
          if (typeof asset.caseSlug !== "string" || !caseSlugs.has(asset.caseSlug)) {
            report("MEDIA_CASE_POSTER_UNKNOWN", `${mediaPath}.asset.caseSlug`, `unknown case slug "${String(asset.caseSlug)}"`);
          }
          break;
        case "immersive-poster":
          if (typeof asset.immersiveSlug !== "string" || !immersiveSlugs.has(asset.immersiveSlug)) {
            report("MEDIA_IMMERSIVE_POSTER_UNKNOWN", `${mediaPath}.asset.immersiveSlug`, `unknown immersive slug "${String(asset.immersiveSlug)}"`);
          }
          break;
        default:
          report("MEDIA_KIND_INVALID", `${mediaPath}.asset.kind`, `"${String(asset.kind)}" is not a media asset kind`);
      }
    });

    // Routes
    const routes = Array.isArray(project.routes) ? project.routes : [];
    routes.forEach((route, routeIndex) => {
      const routePath = `${path}.routes[${routeIndex}]`;
      checkEnum(ROUTE_SURFACES, route.surface, `${routePath}.surface`);

      if (typeof route.path !== "string" || !ROUTE_PATH_RE.test(route.path)) {
        report("ROUTE_PATH_INVALID", `${routePath}.path`, "route path must be root-relative kebab-case segments");
      } else {
        const owner = globalRoutePaths.get(route.path);
        if (owner) {
          report("ROUTE_PATH_DUPLICATE", `${routePath}.path`, `route "${route.path}" already declared by ${owner}`);
        } else {
          globalRoutePaths.set(route.path, path);
        }
      }

      const locales = Array.isArray(route.locales) ? route.locales : [];
      if (locales.length === 0) report("ROUTE_LOCALES_EMPTY", `${routePath}.locales`, "route needs at least one locale");
      const seenLocales = new Set<string>();
      locales.forEach((locale, localeIndex) => {
        const localePath = `${routePath}.locales[${localeIndex}]`;
        if (!isMember(PUBLIC_LOCALES, locale)) {
          report("ROUTE_LOCALE_INVALID", localePath, `"${String(locale)}" is not a public locale`);
          return;
        }
        if (seenLocales.has(locale)) report("ROUTE_LOCALE_DUPLICATE", localePath, `duplicate locale "${locale}"`);
        seenLocales.add(locale);
      });

      if (project.visibility === "public-unlisted" && route.noIndex !== true) {
        report("VISIBILITY_UNLISTED_ROUTE_INDEXABLE", `${routePath}.noIndex`, "public-unlisted routes must set noIndex: true");
      }
    });

    if (project.visibility === "private-named" && routes.length > 0) {
      report("VISIBILITY_PRIVATE_ROUTE_FORBIDDEN", `${path}.routes`, "private-named records must not declare routes");
    }
    if (listed && routes.length === 0) {
      report("VISIBILITY_LISTED_ROUTE_REQUIRED", `${path}.routes`, "public-listed records need at least one route");
    }

    // Evidence
    const evidence = Array.isArray(project.evidence) ? project.evidence : [];
    if (listed && evidence.length === 0) {
      report("VISIBILITY_LISTED_EVIDENCE_REQUIRED", `${path}.evidence`, "public-listed records need at least one evidence reference");
    }
    evidence.forEach((ref, refIndex) => {
      const refPath = `${path}.evidence[${refIndex}]`;
      checkText(ref.proves, `${refPath}.proves`, listed);
      checkEnum(EVIDENCE_VISIBILITIES, ref.visibility, `${refPath}.visibility`);
      checkOptionalText(ref.limitations, `${refPath}.limitations`, listed);

      switch (ref.kind) {
        case "work-case":
          if (!caseSlugs.has(ref.slug)) report("EVIDENCE_WORK_CASE_UNKNOWN", `${refPath}.slug`, `unknown case slug "${String(ref.slug)}"`);
          break;
        case "immersive-case":
          if (!immersiveSlugs.has(ref.slug)) {
            report("EVIDENCE_IMMERSIVE_CASE_UNKNOWN", `${refPath}.slug`, `unknown immersive slug "${String(ref.slug)}"`);
          }
          break;
        case "project-link":
          if (!linkIds.has(ref.linkId)) report("EVIDENCE_LINK_UNKNOWN", `${refPath}.linkId`, `no link "${String(ref.linkId)}" in this project`);
          break;
        case "media":
          if (!mediaIds.has(ref.mediaId)) report("EVIDENCE_MEDIA_UNKNOWN", `${refPath}.mediaId`, `no media "${String(ref.mediaId)}" in this project`);
          break;
        case "milestone": {
          const milestone = milestoneById.get(ref.milestoneId);
          if (!milestone) {
            report("EVIDENCE_MILESTONE_UNKNOWN", `${refPath}.milestoneId`, `unknown milestone "${String(ref.milestoneId)}"`);
          } else if (milestone.projectId !== project.id) {
            report("EVIDENCE_MILESTONE_FOREIGN", `${refPath}.milestoneId`, `milestone "${milestone.id}" belongs to project "${milestone.projectId}"`);
          }
          break;
        }
        default:
          report("EVIDENCE_KIND_INVALID", `${refPath}.kind`, `"${String((ref as { kind?: unknown }).kind)}" is not an evidence kind`);
      }
    });

    // Services
    if (project.serviceSlugs !== undefined) {
      const seenServices = new Set<string>();
      const serviceSlugs = Array.isArray(project.serviceSlugs) ? project.serviceSlugs : [];
      serviceSlugs.forEach((slug, slugIndex) => {
        const slugPath = `${path}.serviceSlugs[${slugIndex}]`;
        checkEnum(SERVICE_SLUGS, slug, slugPath);
        if (seenServices.has(slug)) report("SERVICE_SLUG_DUPLICATE", slugPath, `duplicate service slug "${slug}"`);
        seenServices.add(slug);
      });
    }

    checkReview(project.review, `${path}.review`);
  });

  // Relationships -------------------------------------------------------------------------------

  const relationshipIds = new Set<string>();
  projectRelationships.forEach((relation, index) => {
    const path = `relationship(${label(relation.id, index)})`;

    if (!isNonEmptyString(relation.id) || !KEBAB_CASE_RE.test(relation.id)) {
      report("RELATIONSHIP_ID_INVALID", `${path}.id`, "relationship id must be kebab-case");
    } else if (relationshipIds.has(relation.id)) {
      report("RELATIONSHIP_ID_DUPLICATE", `${path}.id`, `duplicate relationship id "${relation.id}"`);
    } else {
      relationshipIds.add(relation.id);
    }

    checkEnum(RELATIONSHIP_TYPES, relation.type, `${path}.type`);

    for (const key of ["fromProjectId", "toProjectId"] as const) {
      if (!projectIds.has(relation[key])) {
        report("RELATIONSHIP_PROJECT_UNKNOWN", `${path}.${key}`, `unknown project "${String(relation[key])}"`);
      }
    }
    if (isNonEmptyString(relation.fromProjectId) && relation.fromProjectId === relation.toProjectId) {
      report("RELATIONSHIP_SELF", path, "a project cannot relate to itself");
    }

    checkOptionalText(relation.label, `${path}.label`, false);
  });

  // Milestones ----------------------------------------------------------------------------------

  const milestoneIds = new Set<string>();
  milestones.forEach((milestone, index) => {
    const path = `milestone(${label(milestone.id, index)})`;

    if (!isNonEmptyString(milestone.id) || !KEBAB_CASE_RE.test(milestone.id)) {
      report("MILESTONE_ID_INVALID", `${path}.id`, "milestone id must be kebab-case");
    } else if (milestoneIds.has(milestone.id)) {
      report("MILESTONE_ID_DUPLICATE", `${path}.id`, `duplicate milestone id "${milestone.id}"`);
    } else {
      milestoneIds.add(milestone.id);
    }

    const project = projectById.get(milestone.projectId);
    if (!project) {
      report("MILESTONE_PROJECT_UNKNOWN", `${path}.projectId`, `unknown project "${String(milestone.projectId)}"`);
    }

    checkEnum(MILESTONE_TYPES, milestone.type, `${path}.type`);
    checkEnum(MILESTONE_STATUSES, milestone.status, `${path}.status`);
    checkEnum(EVIDENCE_VISIBILITIES, milestone.visibility, `${path}.visibility`);

    const isPublic = milestone.visibility === "public";
    checkText(milestone.label, `${path}.label`, isPublic);
    checkTextList(milestone.limitations, `${path}.limitations`, isPublic);

    if (milestone.counterparty !== undefined && !isNonEmptyString(milestone.counterparty)) {
      report("MILESTONE_COUNTERPARTY_EMPTY", `${path}.counterparty`, "counterparty must be a non-empty string when present");
    }

    const sortKey = (date: unknown, datePath: string, edge: "start" | "end"): string | null => {
      if (!isRecord(date)) {
        report("MILESTONE_DATE_KIND_INVALID", datePath, "date block is missing");
        return null;
      }
      switch (date.kind) {
        case "date":
          if (!isCalendarDate(date.value)) {
            report("MILESTONE_DATE_INVALID", `${datePath}.value`, `"${String(date.value)}" is not a real YYYY-MM-DD date`);
            return null;
          }
          return date.value as string;
        case "month":
          if (!isCalendarMonth(date.value)) {
            report("MILESTONE_MONTH_INVALID", `${datePath}.value`, `"${String(date.value)}" is not a real YYYY-MM month`);
            return null;
          }
          return `${date.value as string}-${edge === "start" ? "00" : "99"}`;
        case "unknown":
          return null;
        default:
          report("MILESTONE_DATE_KIND_INVALID", `${datePath}.kind`, `"${String(date.kind)}" is not a milestone date kind`);
          return null;
      }
    };

    const start = sortKey(milestone.date, `${path}.date`, "start");
    const end = milestone.endDate === undefined ? null : sortKey(milestone.endDate, `${path}.endDate`, "end");
    if (start !== null && end !== null && end < start) {
      report("MILESTONE_END_BEFORE_START", `${path}.endDate`, "endDate is earlier than date");
    }

    const projectLinkIds = new Set((project?.links ?? []).map((link) => link.id));
    const projectMediaIds = new Set((project?.media ?? []).map((item) => item.id));

    const sources = Array.isArray(milestone.sources) ? milestone.sources : [];
    if (isMember(MILESTONE_STATUSES_REQUIRING_SOURCES, milestone.status) && sources.length === 0) {
      report("MILESTONE_SOURCES_REQUIRED", `${path}.sources`, `status "${milestone.status}" needs at least one source`);
    }
    sources.forEach((source, sourceIndex) => {
      const sourcePath = `${path}.sources[${sourceIndex}]`;
      switch (source.kind) {
        case "url":
        case "repository":
        case "docs":
          if (typeof source.href !== "string" || !HREF_RE.test(source.href)) {
            report("MILESTONE_SOURCE_HREF_INVALID", `${sourcePath}.href`, "href must be an absolute http(s) URL or mailto:");
          }
          checkOptionalText(source.label, `${sourcePath}.label`, isPublic);
          break;
        case "project-link":
          if (!projectLinkIds.has(source.linkId)) {
            report("MILESTONE_SOURCE_LINK_UNKNOWN", `${sourcePath}.linkId`, `no link "${String(source.linkId)}" in project "${String(milestone.projectId)}"`);
          }
          break;
        case "media":
          if (!projectMediaIds.has(source.mediaId)) {
            report("MILESTONE_SOURCE_MEDIA_UNKNOWN", `${sourcePath}.mediaId`, `no media "${String(source.mediaId)}" in project "${String(milestone.projectId)}"`);
          }
          break;
        default:
          report("MILESTONE_SOURCE_KIND_INVALID", `${sourcePath}.kind`, `"${String((source as { kind?: unknown }).kind)}" is not a milestone source kind`);
      }
    });

    checkReview(milestone.review, `${path}.review`);
  });

  return {
    ok: issues.length === 0,
    issues,
    counts: {
      projects: projects.length,
      relationships: projectRelationships.length,
      milestones: milestones.length,
    },
  };
}
