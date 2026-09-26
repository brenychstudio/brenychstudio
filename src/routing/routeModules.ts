// The only place page modules are dynamically imported. App.tsx builds its React.lazy() routes
// from these loaders and SPA transitions preload through them, so both share one module Promise.

function memoizeModuleLoader<T>(loader: () => Promise<T>) {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = loader().catch((error) => {
        // Allow a later navigation or preload to retry after a failed request.
        promise = null;
        throw error;
      });
    }

    return promise;
  };
}

export const routeModules = {
  studio: memoizeModuleLoader(() => import("../pages/StudioIndex")),
  work: memoizeModuleLoader(() => import("../pages/EvidenceAtlas")),
  case: memoizeModuleLoader(() => import("../pages/CasePageV2")),
  immersive: memoizeModuleLoader(() => import("../pages/ImmersiveV2")),
  immersiveCase: memoizeModuleLoader(() => import("../pages/ImmersiveCasePage")),
  offer: memoizeModuleLoader(() => import("../pages/OfferV2")),
  about: memoizeModuleLoader(() => import("../pages/AboutV2")),
  service: memoizeModuleLoader(() => import("../pages/ServicePage")),
  privacy: memoizeModuleLoader(() => import("../pages/PrivacyV2")),
  legal: memoizeModuleLoader(() => import("../pages/LegalV2")),
  spatialProof: memoizeModuleLoader(() => import("../pages/SpatialProof")),
  livingAtlas: memoizeModuleLoader(() => import("../pages/LivingAtlasPage")),
  livingAtlasPrivacy: memoizeModuleLoader(() => import("../pages/LivingAtlasPrivacy")),
  livingAtlasSupport: memoizeModuleLoader(() => import("../pages/LivingAtlasSupport")),
} as const;

export type RouteModuleKey = keyof typeof routeModules;

type RouteMatcher = {
  path: string | RegExp;
  key: RouteModuleKey;
  // Also served under the /es prefix.
  spanish?: boolean;
};

// Mirrors the <Route> table in App.tsx. Exact index routes come before the /:slug routes so
// /work resolves to Work and /work/<slug> to a case. Redirect-only routes (/services and the
// /es/living-atlas aliases) have no module of their own.
const routeMatchers: readonly RouteMatcher[] = [
  { path: "/", key: "studio", spanish: true },
  { path: "/studio-index", key: "studio" },
  { path: "/work", key: "work", spanish: true },
  { path: "/evidence-atlas", key: "work" },
  { path: "/immersive", key: "immersive", spanish: true },
  { path: "/immersive-v2", key: "immersive" },
  { path: "/offer", key: "offer", spanish: true },
  { path: "/offer-v2", key: "offer" },
  { path: "/about", key: "about", spanish: true },
  { path: "/about-v2", key: "about" },
  { path: "/privacy", key: "privacy" },
  { path: "/privacy-v2", key: "privacy" },
  { path: "/legal", key: "legal" },
  { path: "/legal-v2", key: "legal" },
  { path: "/spatial-proof", key: "spatialProof" },
  { path: "/living-atlas", key: "livingAtlas" },
  { path: "/living-atlas/privacy", key: "livingAtlasPrivacy" },
  { path: "/living-atlas/support", key: "livingAtlasSupport" },
  { path: /^\/work\/[^/]+$/, key: "case", spanish: true },
  { path: /^\/work-lab\/[^/]+$/, key: "case" },
  { path: /^\/immersive\/[^/]+$/, key: "immersiveCase", spanish: true },
  { path: /^\/services\/[^/]+$/, key: "service", spanish: true },
];

function normalizePath(to: string) {
  const pathname = to.split(/[?#]/)[0] || "/";
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

export function getRouteModuleKey(pathname: string): RouteModuleKey | null {
  const path = normalizePath(pathname);
  const spanish = path === "/es" || path.startsWith("/es/");
  const target = spanish ? path.slice(3) || "/" : path;

  for (const matcher of routeMatchers) {
    if (spanish && !matcher.spanish) continue;
    const matches = typeof matcher.path === "string" ? matcher.path === target : matcher.path.test(target);
    if (matches) return matcher.key;
  }

  return null;
}

export function preloadRouteModule(to: string) {
  const key = getRouteModuleKey(to);
  if (!key) return;

  void routeModules[key]().catch(() => {
    // Preload is opportunistic; React.lazy remains the navigation-time authority.
  });
}
