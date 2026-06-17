import { createContext } from "react";
import type { LocaleCode, LocaleConfig } from "./locales";
import type { Dictionary } from "./types";

export type I18nContextValue = {
  locale: LocaleCode;
  dictionary: Dictionary;
  t: Dictionary;
  enabledLocales: LocaleConfig[];
  allLocales: LocaleConfig[];
};

export const I18nContext = createContext<I18nContextValue | null>(null);
