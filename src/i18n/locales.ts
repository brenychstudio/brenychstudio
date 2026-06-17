export type LocaleCode = "en" | "es" | "uk" | "ru";

export type LocaleConfig = {
  code: LocaleCode;
  label: string;
  name: string;
  pathPrefix: string;
  hreflang: string;
  enabled: boolean;
};

export const DEFAULT_LOCALE: LocaleCode = "en";

export const LOCALES: LocaleConfig[] = [
  {
    code: "en",
    label: "en",
    name: "English",
    pathPrefix: "",
    hreflang: "en",
    enabled: true,
  },
  {
    code: "es",
    label: "es",
    name: "Español",
    pathPrefix: "/es",
    hreflang: "es",
    enabled: false,
  },
  {
    code: "uk",
    label: "ua",
    name: "Українська",
    pathPrefix: "/uk",
    hreflang: "uk",
    enabled: false,
  },
  {
    code: "ru",
    label: "ru",
    name: "Русский",
    pathPrefix: "/ru",
    hreflang: "ru",
    enabled: false,
  },
];

export const enabledLocales = LOCALES.filter((locale) => locale.enabled);

export function isLocaleCode(value: string): value is LocaleCode {
  return value === "en" || value === "es" || value === "uk" || value === "ru";
}

export function getLocaleConfig(code: LocaleCode) {
  return LOCALES.find((locale) => locale.code === code) ?? LOCALES[0];
}
