import { useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { dictionaries } from "./dictionaries";
import { I18nContext } from "./context";
import { DEFAULT_LOCALE, LOCALES, enabledLocales, getLocaleConfig } from "./locales";
import { getLocaleFromPathname } from "./routes";

export function I18nProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const detectedLocale = getLocaleFromPathname(pathname);
  const detectedConfig = getLocaleConfig(detectedLocale);
  const locale = detectedConfig.enabled ? detectedLocale : DEFAULT_LOCALE;
  const dictionary = dictionaries[locale];

  const value = useMemo(
    () => ({
      locale,
      dictionary,
      t: dictionary,
      enabledLocales,
      allLocales: LOCALES,
    }),
    [dictionary, locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
