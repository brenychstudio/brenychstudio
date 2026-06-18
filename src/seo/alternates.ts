import { toAbsoluteSiteUrl } from "../config/site";
import { getLocalizedPath, hasSpanishPublicEquivalent, stripLocaleFromPathname } from "../i18n/routes";
import type { SeoAlternate, SeoMetaProps } from "../ui/SeoMeta";

export function getSeoAlternates(pathname: string): SeoAlternate[] | undefined {
  const englishPath = stripLocaleFromPathname(pathname);

  if (!hasSpanishPublicEquivalent(englishPath)) return undefined;

  return [
    {
      hreflang: "en",
      href: toAbsoluteSiteUrl(englishPath),
    },
    {
      hreflang: "es",
      href: toAbsoluteSiteUrl(getLocalizedPath(englishPath, "es")),
    },
    {
      hreflang: "x-default",
      href: toAbsoluteSiteUrl(englishPath),
    },
  ];
}

export function withSeoAlternates(meta: SeoMetaProps): SeoMetaProps {
  return {
    ...meta,
    alternates: getSeoAlternates(meta.path),
  };
}
