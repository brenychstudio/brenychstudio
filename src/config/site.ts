export const SITE_URL = "https://brenychstudio.com";
export const SITE_NAME = "Brenych Studio";
export const DEFAULT_OG_IMAGE = "/og-default.png";
export const STUDIO_CITY = "Barcelona";
export const STUDIO_COUNTRY = "Spain";
export const STUDIO_LOCATION = "Barcelona, Spain";
export const STUDIO_LOCATION_ES = "Barcelona, España";
export const STUDIO_REGION = "Europe";

export function toAbsoluteSiteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.startsWith("/") ? value : `/${value}`, SITE_URL).toString();
}
