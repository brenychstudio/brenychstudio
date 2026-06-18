import { useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { dictionaries } from "./dictionaries";
import { I18nContext } from "./context";
import {
  DEFAULT_LOCALE,
  getRuntimeEnabledLocales,
  getRuntimeLocales,
  isRuntimeLocaleEnabled,
} from "./locales";
import { getLocaleFromPathname } from "./routes";

export function I18nProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const detectedLocale = getLocaleFromPathname(pathname);
  const locale = isRuntimeLocaleEnabled(detectedLocale) ? detectedLocale : DEFAULT_LOCALE;
  const dictionary = dictionaries[locale];
  const runtimeLocales = useMemo(() => getRuntimeLocales(), []);
  const runtimeEnabledLocales = useMemo(() => getRuntimeEnabledLocales(), []);

  const value = useMemo(
    () => ({
      locale,
      dictionary,
      t: dictionary,
      enabledLocales: runtimeEnabledLocales,
      allLocales: runtimeLocales,
    }),
    [dictionary, locale, runtimeEnabledLocales, runtimeLocales],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
