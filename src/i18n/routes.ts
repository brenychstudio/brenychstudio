import { DEFAULT_LOCALE, getLocaleConfig, isLocaleCode, type LocaleCode } from "./locales";

const PUBLIC_SPANISH_BASE_PATHS = new Set([
  "/",
  "/work",
  "/offer",
  "/about",
  "/immersive",
  "/services/premium-landing-page",
  "/services/product-demo-landing",
  "/services/interactive-web-systems",
  "/work/aurel-eon-gt",
  "/work/oria-house-barcelona",
  "/work/sprintcrm",
  "/work/creatorops",
  "/work/house-of-lune",
  "/work/barcelona-private-advisory",
  "/work/fluid-exhibition",
  "/work/form-index",
  "/work/arcwave-integrations",
  "/work/casa-nube",
  "/work/print-border-studio",
  "/immersive/whisper",
  "/immersive/webhero",
  "/immersive/kool-berk",
  "/immersive/presence-os-memory-atlas",
  "/immersive/orbit-lens",
]);

const PUBLIC_SPANISH_CASE_STORY_SLUGS = new Set([
  "aurel-eon-gt",
  "oria-house-barcelona",
  "sprintcrm",
  "creatorops",
  "house-of-lune",
  "barcelona-private-advisory",
  "fluid-exhibition",
  "form-index",
  "arcwave-integrations",
  "casa-nube",
  "print-border-studio",
]);

const PUBLIC_SPANISH_CASE_REGISTRY_SLUGS = new Set([
  "aurel-eon-gt",
  "oria-house-barcelona",
  "sprintcrm",
  "creatorops",
  "house-of-lune",
  "bcn-advisory",
  "fluid-exhibition",
  "form-index",
  "arcwave-integrations",
  "casa-nube",
  "print-border-studio",
]);

const PUBLIC_SPANISH_SERVICE_SLUGS = new Set([
  "premium-landing-page",
  "product-demo-landing",
  "interactive-web-systems",
]);

const PUBLIC_SPANISH_IMMERSIVE_SLUGS = new Set([
  "whisper",
  "webhero",
  "kool-berk",
  "presence-os-memory-atlas",
  "orbit-lens",
]);

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

function normalizePath(pathname: string): string {
  const cleanPath = stripLocaleFromPathname(pathname || "/").replace(/\/+$/, "");
  return cleanPath === "" ? "/" : cleanPath;
}

export function hasSpanishPublicEquivalent(pathname: string) {
  return PUBLIC_SPANISH_BASE_PATHS.has(normalizePath(pathname));
}

export function isSpanishPublicCaseStorySlug(slug: string | undefined) {
  return Boolean(slug && PUBLIC_SPANISH_CASE_STORY_SLUGS.has(slug));
}

export function isSpanishPublicCaseRegistrySlug(slug: string | undefined) {
  return Boolean(slug && PUBLIC_SPANISH_CASE_REGISTRY_SLUGS.has(slug));
}

export function isSpanishPublicServiceSlug(slug: string | undefined) {
  return Boolean(slug && PUBLIC_SPANISH_SERVICE_SLUGS.has(slug));
}

export function isSpanishPublicImmersiveSlug(slug: string | undefined) {
  return Boolean(slug && PUBLIC_SPANISH_IMMERSIVE_SLUGS.has(slug));
}
