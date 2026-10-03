import type { ProjectRecord, PublicLocale, LocalizedText } from "../../data/projectRegistry.types";
import { getLocalizedPath } from "../../i18n";

export function projectText(text: LocalizedText, locale: PublicLocale) {
  const value = text[locale];
  if (!value) throw new Error(`Missing Home project copy for ${locale}`);
  return value;
}

export function projectPath(project: ProjectRecord, locale: PublicLocale, surface: "work" | "immersive") {
  const route = project.routes.find((item) => item.surface === surface && item.locales.includes(locale));
  if (!route) throw new Error(`Missing Home ${surface} route: ${project.id}/${locale}`);
  return getLocalizedPath(route.path, locale);
}
