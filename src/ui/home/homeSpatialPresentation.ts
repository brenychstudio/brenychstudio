import { projects } from "../../data/projects";
import { immersiveItems, type ImmersiveItem } from "../../data/immersive";
import type { ProjectRecord, PublicLocale } from "../../data/projectRegistry.types";
import { getLocalizedPath, isSpanishPublicImmersiveSlug } from "../../i18n/routes";
import { resolveVideoAsset } from "../../media/video/videoResolver";
import type { VideoAssetId } from "../../media/video/videoAssets";

export type HomeSpatialMembership =
  | { source: "canonical-project"; id: "whisper"; immersiveSlug: "whisper"; videoAssetId: "whisper.immersive.hero" }
  | { source: "public-immersive"; slug: "webhero"; videoAssetId: "webhero.immersive.field" };
export type HomeSpatialProof = {
  key: "whisper" | "webhero";
  source: HomeSpatialMembership["source"];
  sourceId: string;
  title: string;
  summary: string;
  statusLabel: string;
  caseLabel: string;
  posterAlt: string;
  posterSrc: string;
  videoAssetId: VideoAssetId;
  videoSrc: string;
  casePath: string;
};
export const HOME_SPATIAL_MEMBERSHIP = [
  { source: "canonical-project", id: "whisper", immersiveSlug: "whisper", videoAssetId: "whisper.immersive.hero" },
  { source: "public-immersive", slug: "webhero", videoAssetId: "webhero.immersive.field" },
] as const satisfies readonly HomeSpatialMembership[];

const webheroCopy = {
  en: { summary: "A web-first visual system for cinematic stages, living images and spatial presentation.", statusLabel: "R&D · Advanced internal prototype", caseLabel: "Explore the WEBHERO case", posterAlt: "WEBHERO threshold screen with a luminous ring and the WEBHERO title" },
  es: { summary: "Un sistema visual web para stages cinematográficos, imágenes vivas y presentación espacial.", statusLabel: "I+D · Prototipo interno avanzado", caseLabel: "Explorar el caso WEBHERO", posterAlt: "Pantalla de entrada de WEBHERO con un anillo luminoso y el título WEBHERO" },
} as const;

/** Explicit public projection; no raw record, fallback chamber or inferred canonical facts. */
export function selectHomeSpatialProofs(locale: PublicLocale, sources: {
  projects: readonly ProjectRecord[]; immersive: readonly ImmersiveItem[];
}): readonly HomeSpatialProof[] {
  return HOME_SPATIAL_MEMBERSHIP.flatMap((member): HomeSpatialProof[] => {
    const slug = member.source === "canonical-project" ? member.immersiveSlug : member.slug;
    const item = sources.immersive.find(record => record.slug === slug);
    if (!item) throw new Error(`Home Spatial missing public immersive record: ${slug}`);
    if (!item.previewPoster?.trim() || !item.previewVideo?.trim()) throw new Error(`Home Spatial missing poster/video: ${slug}`);
    if (!item.translations?.es || !isSpanishPublicImmersiveSlug(slug)) throw new Error(`Home Spatial missing ES route: ${slug}`);
    const videoSrc = resolveVideoAsset(member.videoAssetId);
    if (item.previewVideo !== videoSrc) throw new Error(`Home Spatial video authority mismatch: ${slug}`);
    const media = { posterSrc: item.previewPoster, videoAssetId: member.videoAssetId, videoSrc };
    if (member.source === "public-immersive") {
      if (item.status !== "R&D") return []; // Unexpected disclosure/fact changes fail closed.
      return [{ key: "webhero", source: member.source, sourceId: slug, title: "WEBHERO", ...webheroCopy[locale], ...media, casePath: getLocalizedPath(`/immersive/${slug}`, locale) }];
    }
    const project = sources.projects.find(record => record.id === member.id);
    if (!project) throw new Error(`Home Spatial missing canonical project: ${member.id}`);
    if (project.visibility !== "public-listed") return [];
    const poster = project.media.find(entry => entry.purpose === "poster");
    const route = project.routes.find(entry => entry.surface === "immersive" && entry.locales.includes("en") && entry.locales.includes("es"));
    const summary = project.copy.oneLiner[locale], posterAlt = poster?.alt[locale];
    if (!route || !summary?.trim() || !posterAlt?.trim() || poster?.asset.kind !== "immersive-poster" || poster.asset.immersiveSlug !== slug) throw new Error(`Home Spatial missing canonical route/copy/poster: ${slug}/${locale}`);
    return [{ key: "whisper", source: member.source, sourceId: project.id, title: project.publicName, summary, posterAlt, ...media, casePath: getLocalizedPath(route.path, locale), statusLabel: locale === "es" ? "Prototipo · Solo referencia" : "Prototype · Reference only", caseLabel: locale === "es" ? "Explorar el caso WHISPER" : "Explore the WHISPER case" }];
  });
}

export function getHomeSpatialProofs(locale: PublicLocale): readonly HomeSpatialProof[] {
  return selectHomeSpatialProofs(locale, { projects, immersive: immersiveItems });
}
