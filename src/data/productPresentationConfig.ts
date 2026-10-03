import { cases } from "./cases";
import type { LocalizedText, ProjectRecord, PublicLocale } from "./projectRegistry.types";
import { videoAssets, type VideoAssetId } from "../media/video/videoAssets";
import { resolveVideoAsset } from "../media/video/videoResolver";

export type ProductGroupId = "workflow" | "creative-tools";
export type ProductTreatment = "digital" | "material" | "generic";
export type ProductVisualConfig = {
  treatment: ProductTreatment;
  group?: ProductGroupId;
  walkthrough?: VideoAssetId;
  secondary?: { src: string; alt: LocalizedText };
  titleLines?: readonly string[];
};

// Presentation roles only. Identity, maturity, availability and copy stay in the registry.
export const productPresentationConfig: Readonly<Record<string, ProductVisualConfig>> = {
  weekfield: { treatment: "digital", group: "workflow", walkthrough: "weekfield.case.walkthrough" },
  "print-border-studio": {
    treatment: "material", group: "creative-tools", walkthrough: "print-border.case.walkthrough",
    titleLines: ["Print Border", "Studio"],
    secondary: { src: "/cases/print-border-studio/desktop/psb-4.webp", alt: { en: "Print Border Studio print preparation workspace", es: "Espacio de preparación de impresión de Print Border Studio" } },
  },
};

export const productGroups: Readonly<Record<ProductGroupId, Record<PublicLocale, string>>> = {
  workflow: { en: "Workflow", es: "Flujo de trabajo" },
  "creative-tools": { en: "Creative tools", es: "Herramientas creativas" },
};

/** A valid ID alone is insufficient: proof must be referenced by this project's approved evidence. */
export function validateProductVisualReferences(project: ProjectRecord, config: ProductVisualConfig | undefined, locale: PublicLocale): string[] {
  if (!config) return [];
  const errors: string[] = [];
  const ownMedia = project.media.filter(media => !media.locale || media.locale === locale);
  const ownCases = cases.filter(item => project.evidence.some(evidence => evidence.kind === "work-case" && evidence.visibility === "public" && evidence.slug === item.slug));
  const frames = ownCases.flatMap(item => [...(item.content?.hero ? [item.content.hero] : []), ...(item.content?.frames ?? [])]);
  if (!ownMedia.some(media => media.purpose === "poster" && media.alt[locale]?.trim())) errors.push("Missing own localized poster");
  if (config.walkthrough) {
    if (!Object.hasOwn(videoAssets,config.walkthrough)) errors.push("Invalid walkthrough ID");
    else if (!ownMedia.some(media => media.asset.kind === "video" && media.asset.videoAssetId === config.walkthrough) &&
      !frames.some(frame => frame.kind === "video" && frame.src === resolveVideoAsset(config.walkthrough!))) errors.push("Walkthrough is not owned by this project");
  }
  if (config.secondary) {
    if (!config.secondary.alt[locale]?.trim()) errors.push("Missing localized secondary alt");
    if (!ownMedia.some(media => media.asset.kind === "image" && media.asset.src === config.secondary!.src) &&
      !frames.some(frame => frame.kind !== "video" && frame.src === config.secondary!.src)) errors.push("Secondary proof is not owned by this project");
  }
  if (config.titleLines && config.titleLines.join(" ") !== project.publicName) errors.push("Title lines do not match product identity");
  return errors;
}
