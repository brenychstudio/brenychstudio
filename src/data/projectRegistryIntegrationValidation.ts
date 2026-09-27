import type { ProjectRecord } from "./projectRegistry.types";

/**
 * Cross-registry integration only (BSW-CORE-01D). The intrinsic validator owns schema,
 * enum, reference existence and disclosure checks. This layer binds declared routes to
 * explicit authority snapshots without importing content or accessing external state.
 */
export type ProjectRegistryIntegrationInput = {
  projects: readonly ProjectRecord[];
  workCasePaths: ReadonlyMap<string, string>;
  immersiveCasePaths: ReadonlyMap<string, string>;
  staticMetadata: ReadonlyMap<string, { noIndex?: boolean }>;
  sitemapPaths: ReadonlySet<string>;
  hasSpanishPublicEquivalent: (path: string) => boolean;
  isSpanishPublicCaseStorySlug: (slug: string) => boolean;
  isSpanishPublicCaseRegistrySlug: (slug: string) => boolean;
  isSpanishPublicImmersiveSlug: (slug: string) => boolean;
};

export type ProjectRegistryIntegrationIssueCode =
  | "WORK_ROUTE_EVIDENCE_MISSING"
  | "WORK_ROUTE_PATH_MISMATCH"
  | "IMMERSIVE_ROUTE_EVIDENCE_MISSING"
  | "IMMERSIVE_ROUTE_PATH_MISMATCH"
  | "CASE_POSTER_EVIDENCE_MISMATCH"
  | "IMMERSIVE_POSTER_EVIDENCE_MISMATCH"
  | "STATIC_METADATA_ROUTE_MISSING"
  | "STATIC_METADATA_ES_ROUTE_MISSING"
  | "STATIC_METADATA_NOINDEX_MISMATCH"
  | "STATIC_METADATA_ES_NOINDEX_MISMATCH"
  | "SPANISH_ROUTE_DECLARED_BUT_UNAVAILABLE"
  | "SPANISH_ROUTE_AVAILABLE_BUT_UNDECLARED"
  | "SPANISH_CASE_REGISTRY_MISSING"
  | "SPANISH_CASE_STORY_MISSING"
  | "SPANISH_IMMERSIVE_ROUTE_MISSING"
  | "SITEMAP_PUBLIC_ROUTE_MISSING"
  | "SITEMAP_PUBLIC_ES_ROUTE_MISSING"
  | "SITEMAP_NOINDEX_ROUTE_PRESENT"
  | "SITEMAP_NOINDEX_ES_ROUTE_PRESENT"
  | "SITEMAP_UNDECLARED_ES_ROUTE_PRESENT";

export type ProjectRegistryIntegrationResult = {
  ok: boolean;
  issues: { code: ProjectRegistryIntegrationIssueCode; path: string; message: string }[];
  counts: {
    projects: number;
    routes: number;
    workRoutes: number;
    immersiveRoutes: number;
    staticMetadataRoutes: number;
    spanishRoutes: number;
    sitemapRoutes: number;
  };
};

export function validateProjectRegistryIntegration(
  input: ProjectRegistryIntegrationInput,
): ProjectRegistryIntegrationResult {
  const issues: ProjectRegistryIntegrationResult["issues"] = [];
  const counts: ProjectRegistryIntegrationResult["counts"] = {
    projects: input.projects.length,
    routes: 0,
    workRoutes: 0,
    immersiveRoutes: 0,
    staticMetadataRoutes: 0,
    spanishRoutes: 0,
    sitemapRoutes: 0,
  };
  function report(code: ProjectRegistryIntegrationIssueCode, path: string, message: string) {
    issues.push({ code, path, message });
  }

  input.projects.forEach((project, projectIndex) => {
    const projectPath = `projects[${projectIndex}]`;
    const workEvidence = project.evidence.filter((item) => item.kind === "work-case");
    const immersiveEvidence = project.evidence.filter((item) => item.kind === "immersive-case");

    project.media.forEach((media, mediaIndex) => {
      const asset = media.asset;
      const path = `${projectPath}.media[${mediaIndex}].asset`;
      if (asset.kind === "case-poster" && !workEvidence.some((item) => item.slug === asset.caseSlug)) {
        report("CASE_POSTER_EVIDENCE_MISMATCH", path, `poster ${asset.caseSlug} needs work-case evidence on ${project.id}`);
      }
      if (asset.kind === "immersive-poster" && !immersiveEvidence.some((item) => item.slug === asset.immersiveSlug)) {
        report("IMMERSIVE_POSTER_EVIDENCE_MISMATCH", path, `poster ${asset.immersiveSlug} needs immersive-case evidence on ${project.id}`);
      }
    });

    project.routes.forEach((route, routeIndex) => {
      const path = `${projectPath}.routes[${routeIndex}]`;
      const declaresEs = route.locales.includes("es");
      const esPath = route.path === "/" ? "/es" : `/es${route.path}`;
      counts.routes += 1;

      // Binding is route -> evidence, never evidence -> required route. Independent
      // product/research/trust surfaces may still cite historical Work/Immersive proof.
      if (route.surface === "work") {
        counts.workRoutes += 1;
        const matching = workEvidence.find((item) => input.workCasePaths.get(item.slug) === route.path);
        if (!workEvidence.length) {
          report("WORK_ROUTE_EVIDENCE_MISSING", path, `${route.path} needs work-case evidence on ${project.id}`);
        } else if (!matching) {
          report("WORK_ROUTE_PATH_MISMATCH", `${path}.path`, `${route.path} does not match an authoritative path for this project's Work evidence`);
        } else if (declaresEs) {
          if (!input.isSpanishPublicCaseRegistrySlug(matching.slug)) {
            report("SPANISH_CASE_REGISTRY_MISSING", path, `Work registry slug ${matching.slug} has no public Spanish coverage`);
          }
          // The matched authoritative pathname, not the registry slug, owns story routing.
          const storySlug = input.workCasePaths.get(matching.slug)!.split("/").at(-1)!;
          if (!input.isSpanishPublicCaseStorySlug(storySlug)) {
            report("SPANISH_CASE_STORY_MISSING", path, `Work story slug ${storySlug} has no public Spanish coverage`);
          }
        }
      }
      if (route.surface === "immersive") {
        counts.immersiveRoutes += 1;
        const matching = immersiveEvidence.find((item) => input.immersiveCasePaths.get(item.slug) === route.path);
        if (!immersiveEvidence.length) {
          report("IMMERSIVE_ROUTE_EVIDENCE_MISSING", path, `${route.path} needs immersive-case evidence on ${project.id}`);
        } else if (!matching) {
          report("IMMERSIVE_ROUTE_PATH_MISMATCH", `${path}.path`, `${route.path} does not match an authoritative path for this project's Immersive evidence`);
        } else if (declaresEs && !input.isSpanishPublicImmersiveSlug(matching.slug)) {
          report("SPANISH_IMMERSIVE_ROUTE_MISSING", path, `Immersive slug ${matching.slug} has no public Spanish coverage`);
        }
      }

      const noIndex = Boolean(route.noIndex);
      const metadata = input.staticMetadata.get(route.path);
      counts.staticMetadataRoutes += 1;
      if (!metadata) {
        report("STATIC_METADATA_ROUTE_MISSING", path, `static metadata missing for ${route.path}`);
      } else if (Boolean(metadata.noIndex) !== noIndex) {
        report("STATIC_METADATA_NOINDEX_MISMATCH", `${path}.noIndex`, `noIndex disagrees with static metadata for ${route.path}`);
      }
      const esMetadata = input.staticMetadata.get(esPath);
      if (declaresEs || esMetadata) {
        counts.staticMetadataRoutes += 1;
        if (!esMetadata) {
          report("STATIC_METADATA_ES_ROUTE_MISSING", path, `static metadata missing for ${esPath}`);
        } else if (Boolean(esMetadata.noIndex) !== noIndex) {
          report("STATIC_METADATA_ES_NOINDEX_MISMATCH", `${path}.noIndex`, `noIndex disagrees with static metadata for ${esPath}`);
        }
      }

      // Count every canonical route tested for bidirectional ES alignment, including EN-only.
      counts.spanishRoutes += 1;
      const routerHasEs = input.hasSpanishPublicEquivalent(route.path);
      if (declaresEs && !routerHasEs) {
        report("SPANISH_ROUTE_DECLARED_BUT_UNAVAILABLE", `${path}.locales`, `${route.path} declares ES but public routing does not`);
      } else if (!declaresEs && routerHasEs) {
        report("SPANISH_ROUTE_AVAILABLE_BUT_UNDECLARED", `${path}.locales`, `${route.path} has public ES routing but does not declare it`);
      }

      // Only the canonical subset is checked. ES absence is also a checked sitemap path.
      counts.sitemapRoutes += 2;
      const excluded = noIndex || project.visibility === "public-unlisted";
      if (excluded) {
        if (input.sitemapPaths.has(route.path)) {
          report("SITEMAP_NOINDEX_ROUTE_PRESENT", path, `${route.path} must be absent from sitemap (noindex or public-unlisted)`);
        }
        if (declaresEs && input.sitemapPaths.has(esPath)) {
          report("SITEMAP_NOINDEX_ES_ROUTE_PRESENT", path, `${esPath} must be absent from sitemap (noindex or public-unlisted)`);
        }
      } else if (project.visibility === "public-listed") {
        if (!input.sitemapPaths.has(route.path)) {
          report("SITEMAP_PUBLIC_ROUTE_MISSING", path, `public indexable route ${route.path} missing from sitemap`);
        }
        if (declaresEs && !input.sitemapPaths.has(esPath)) {
          report("SITEMAP_PUBLIC_ES_ROUTE_MISSING", path, `public indexable route ${esPath} missing from sitemap`);
        }
      }
      if (!declaresEs && input.sitemapPaths.has(esPath)) {
        report("SITEMAP_UNDECLARED_ES_ROUTE_PRESENT", path, `${esPath} is in sitemap but ES is not declared`);
      }
    });
  });

  return { ok: issues.length === 0, issues, counts };
}
