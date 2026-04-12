import { en } from "./en";
import { es } from "./es";
import { ua } from "./ua";
import { ru } from "./ru";

export const translations = {
  en,
  es,
  ua,
  ru,
};

export const availableLocales = ["en", "es", "ua", "ru"] as const;

export type Locale = (typeof availableLocales)[number];

export const defaultLocale: Locale = "en";
