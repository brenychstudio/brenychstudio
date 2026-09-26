/**
 * Living Atlas release surface.
 *
 * Canonical, owner-supplied facts shared by the three pre-release trust routes
 * (/living-atlas, /living-atlas/privacy, /living-atlas/support). Nothing here
 * should describe behaviour that does not ship in the V1 App Store release.
 */

export const LIVING_ATLAS_NAME = "Living Atlas";
export const LIVING_ATLAS_PLATFORM = "Living Atlas · iOS";
export const LIVING_ATLAS_RELEASE_STATUS = "App Store release in preparation";
export const LIVING_ATLAS_POLICY_UPDATED = "26 September 2026";

/**
 * Public App Store URL.
 *
 * Keep `null` until the app is actually live. Once a real public URL exists,
 * setting it here swaps the release-status line on the product page for a real
 * App Store link with no other change.
 */
export const LIVING_ATLAS_APP_STORE_URL: string | null = null;

export const LIVING_ATLAS_SUPPORT_EMAIL = "rostyslav@brenychstudio.com";

export const livingAtlasRoutes = {
  product: "/living-atlas",
  privacy: "/living-atlas/privacy",
  support: "/living-atlas/support",
  studio: "/",
} as const;

export type LivingAtlasRouteId = keyof typeof livingAtlasRoutes;

export function livingAtlasMailto(subject: string) {
  return `mailto:${LIVING_ATLAS_SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
