import type { ProjectRecord, PublicLocale } from "../../data/projectRegistry.types";

export type MobileProductPresetId = "weekfield" | "print-border" | "generic";
/** +1 resolves the next item (leftward drag); -1 resolves the previous item. */
export type GhostDirection = -1 | 0 | 1;

function validIndex(index: number, length: number) {
  return Number.isInteger(index) && index >= 0 && index < length;
}

export function adjacentGhostIndex(index: number, length: number, direction: GhostDirection): number | null {
  if (!validIndex(index, length)) return null;
  const candidate = direction === 0 ? (index + 1 < length ? index + 1 : index - 1) : index + direction;
  return validIndex(candidate, length) ? candidate : null;
}

export function ghostDirectionFromOffset(offset: number): GhostDirection {
  return offset < -8 ? 1 : offset > 8 ? -1 : 0;
}

/** Reject out-of-range targets without wrapping; repair a stale index after a list shrinks. */
export function selectMobileProduct(current: number, target: number, length: number): number | null {
  if (length === 0) return null;
  if (validIndex(target, length)) return target;
  return validIndex(current, length) ? current : 0;
}

export function mobileProductKeyTarget(key: string, current: number, length: number): number | null | undefined {
  const targets: Record<string, number> = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: length - 1 };
  return Object.hasOwn(targets, key) ? selectMobileProduct(current, targets[key], length) : undefined;
}

export function formatMobileProductOrdinal(value: number) {
  return String(value).padStart(2, "0");
}

export function resolveMobileProductPreset(project: Pick<ProjectRecord, "id">): MobileProductPresetId {
  switch (project.id) {
    case "weekfield": return "weekfield";
    case "print-border-studio": return "print-border";
    default: return "generic";
  }
}

export function mobileProductPresentation(project: ProjectRecord, locale: PublicLocale) {
  const preset = resolveMobileProductPreset(project);
  const english = locale === "en";
  switch (preset) {
    case "weekfield": return {
      preset, theme: "graphite",
      descriptor: english ? ["Creator intelligence", "& planning system"] : ["Inteligencia creativa", "y planificación"],
      terms: english ? ["Creator content intelligence", "Week Packs", "Human-controlled AI"] : ["Inteligencia de contenido", "Week Packs", "IA bajo control humano"],
      plate: "Product / Interface", caption: "Digital / Interface",
    };
    case "print-border": return {
      preset, theme: "material",
      descriptor: english ? ["Print preparation", "& collector presentation"] : ["Preparación de impresión", "y presentación para coleccionistas"],
      terms: english ? ["Print borders", "Export logic", "Artwork inspection"] : ["Bordes de impresión", "Lógica de exportación", "Inspección de obra"],
      plate: "Artwork / Border / Export", caption: "Material / Paper",
    };
    case "generic": return {
      preset, theme: "neutral",
      descriptor: [project.copy.oneLiner[locale] || project.copy.oneLiner.en],
      terms: [] as string[], plate: project.publicName, caption: project.publicName,
    };
  }
}

/** Only supplied, locale-approved work/product routes can produce a case action. */
export function mobileProductCaseRoute(project: ProjectRecord, locale: PublicLocale) {
  return project.routes.find(route => route.surface === "work" && route.locales.includes(locale))
    ?? project.routes.find(route => route.surface === "product" && route.locales.includes(locale));
}
