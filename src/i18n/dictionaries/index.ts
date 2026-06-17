import type { LocaleCode } from "../locales";
import type { Dictionary } from "../types";
import { en } from "./en";
import { es } from "./es";
import { ru } from "./ru";
import { uk } from "./uk";

export const dictionaries: Record<LocaleCode, Dictionary> = {
  en,
  es,
  uk,
  ru,
};
