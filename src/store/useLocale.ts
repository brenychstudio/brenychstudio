import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultLocale, translations, type Locale } from "../i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
  t: (typeof translations)[Locale];
};

const LOCALE_STORAGE_KEY = "premium-portfolio:locale";

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  if (!value) return false;
  return value in translations;
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(storedLocale) ? storedLocale : defaultLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale === "ua" ? "uk" : locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translations[locale],
    }),
    [locale]
  );

  return createElement(LocaleContext.Provider, { value }, children);
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return context;
}
