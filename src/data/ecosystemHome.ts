import { cases } from "./cases";
import { immersiveItems } from "./immersive";
import { projects } from "./projects";
import type { ProjectRecord } from "./projectRegistry.types";

// Only presentation membership and ordering live here; project facts stay canonical.
export const homeProjectIds = {
  products: ["weekfield", "print-border-studio"],
  evidence: ["aurel-eon-gt", "oria-house-barcelona", "sprintcrm"],
  spatial: ["whisper", "orbit-lens"],
} as const;

export function selectHomeProjects(
  ids: readonly string[],
  registry: readonly ProjectRecord[] = projects,
): readonly ProjectRecord[] {
  return ids.map(id => {
    const project = registry.find(item => item.id === id);
    if (!project) throw new Error(`Home project is missing from the canonical registry: ${id}`);
    return project;
  }).filter(project => project.visibility === "public-listed");
}

export function getEcosystemHomeProjects(registry: readonly ProjectRecord[] = projects): {
  products: readonly ProjectRecord[];
  evidence: readonly ProjectRecord[];
  spatial: readonly ProjectRecord[];
} {
  const products = selectHomeProjects(homeProjectIds.products, registry);
  for (const project of products) {
    if (project.vertical !== "product" || project.origin !== "studio-product") {
      throw new Error(`Home flagship must be a studio product: ${project.id}`);
    }
  }
  return {
    products,
    evidence: selectHomeProjects(homeProjectIds.evidence, registry),
    spatial: selectHomeProjects(homeProjectIds.spatial, registry),
  };
}

export function resolveHomeProjectPoster(project: ProjectRecord, locale: "en" | "es"): { src: string; alt: string } {
  const media = project.media.find(item => item.purpose === "poster");
  if (!media) throw new Error(`Home poster metadata is missing: ${project.id}`);
  const { asset } = media;
  let src: string | undefined;
  switch (asset.kind) {
    case "case-poster":
      src = cases.find(item => item.slug === asset.caseSlug)?.poster.src;
      break;
    case "immersive-poster":
      src = immersiveItems.find(item => item.slug === asset.immersiveSlug)?.previewPoster;
      break;
    case "image":
      src = asset.src;
      break;
    case "video":
      src = asset.poster;
      break;
  }
  const alt = media.alt[locale];
  if (!src?.trim() || !alt?.trim()) {
    throw new Error(`Home poster source or ${locale} alt text is missing: ${project.id}`);
  }
  return { src, alt };
}
