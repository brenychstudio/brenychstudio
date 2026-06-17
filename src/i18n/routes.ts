import { DEFAULT_LOCALE, getLocaleConfig, isLocaleCode, type LocaleCode } from "./locales";

export function getLocaleFromPathname(pathname: string): LocaleCode {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (firstSegment && isLocaleCode(firstSegment)) {
    return firstSegment;
  }

  return DEFAULT_LOCALE;
}

export function stripLocaleFromPathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] && isLocaleCode(parts[0])) {
    const stripped = `/${parts.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped;
  }

  return pathname || "/";
}

export function getLocalizedPath(pathname: string, locale: LocaleCode): string {
  const config = getLocaleConfig(locale);
  const cleanPath = stripLocaleFromPathname(pathname);

  if (locale === DEFAULT_LOCALE) {
    return cleanPath;
  }

  return `${config.pathPrefix}${cleanPath === "/" ? "" : cleanPath}`;
}
