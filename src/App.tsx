import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProjectDrawerV2 from "./ui/ProjectDrawerV2";
import ScrollToTop from "./ui/ScrollToTop";
import PageTransitionOverlay from "./ui/PageTransitionOverlay";
import SoundSignalDock from "./ui/SoundSignalDock";
import SeoMeta, { type SeoMetaProps } from "./ui/SeoMeta";
import { LocaleProvider } from "./store/useLocale";
import { SoundProvider } from "./stage/audio/SoundProvider";

const OfferV2 = lazy(() => import("./pages/OfferV2"));
const CasePageV2 = lazy(() => import("./pages/CasePageV2"));
const ImmersiveV2 = lazy(() => import("./pages/ImmersiveV2"));
const ImmersiveCasePage = lazy(() => import("./pages/ImmersiveCasePage"));
const SpatialProof = lazy(() => import("./pages/SpatialProof"));
const AboutV2 = lazy(() => import("./pages/AboutV2"));
const PrivacyV2 = lazy(() => import("./pages/PrivacyV2"));
const LegalV2 = lazy(() => import("./pages/LegalV2"));
const StudioIndex = lazy(() => import("./pages/StudioIndex"));
const EvidenceAtlas = lazy(() => import("./pages/EvidenceAtlas"));

const routeSeo = {
  home: {
    title: "Brenych Studio - Premium Interface Systems",
    description:
      "Premium web, product surfaces, immersive digital experiences, and interface systems by Rostyslav Brenych.",
    path: "/",
  },
  work: {
    title: "Work - Brenych Studio Interface Systems",
    description:
      "Selected case systems, commercial interfaces, workflow tools, immersive prototypes, and available foundations.",
    path: "/work",
  },
  immersive: {
    title: "Immersive Interface Systems - Brenych Studio",
    description:
      "WebGL, WebXR, spatial proof layers, cinematic archives, and immersive prototype systems by Brenych Studio.",
    path: "/immersive",
  },
  offer: {
    title: "Offer - Brenych Studio",
    description:
      "Premium websites, interactive product surfaces, multilingual systems, immersive prototypes, and creative technology direction.",
    path: "/offer",
  },
  about: {
    title: "About - Brenych Studio",
    description:
      "The practice behind Brenych Studio: front-end engineering, visual direction, motion grammar, image, and interface research.",
    path: "/about",
  },
  privacy: {
    title: "Privacy Policy - Brenych Studio",
    description:
      "How Brenych Studio handles information shared through project inquiries, preferences, and basic website interactions.",
    path: "/privacy",
  },
  legal: {
    title: "Legal Notice - Brenych Studio",
    description:
      "Terms for using the Brenych Studio website, viewing portfolio materials, and contacting the studio about projects.",
    path: "/legal",
  },
} satisfies Record<string, SeoMetaProps>;

function SeoRoute({ meta, children }: { meta: SeoMetaProps; children: ReactNode }) {
  return (
    <>
      <SeoMeta {...meta} />
      {children}
    </>
  );
}

function RoutePendingSurface() {
  return <div aria-hidden="true" className="min-h-screen bg-[#f4f1ea]" />;
}

function RouteNoIndexMeta() {
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.createElement("meta");

    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");

    if (!existing) document.head.appendChild(meta);

    return () => {
      if (existing && previousContent !== null) {
        existing.setAttribute("content", previousContent);
        return;
      }

      if (!existing) meta.remove();
    };
  }, []);

  return null;
}

function HiddenRoute({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteNoIndexMeta />
      {children}
    </>
  );
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openProject = useCallback(() => setDrawerOpen(true), []);
  const closeProject = useCallback(() => setDrawerOpen(false), []);

  return (
    <LocaleProvider>
      <SoundProvider>
        <BrowserRouter>
          <ScrollToTop />

          <Suspense fallback={<RoutePendingSurface />}>
            <Routes>
          <Route
            path="/"
            element={
              <SeoRoute meta={routeSeo.home}>
                <StudioIndex
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/work"
            element={
              <SeoRoute meta={routeSeo.work}>
                <EvidenceAtlas
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/immersive"
            element={
              <SeoRoute meta={routeSeo.immersive}>
                <ImmersiveV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/offer"
            element={
              <SeoRoute meta={routeSeo.offer}>
                <OfferV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/work/:slug"
            element={
              <CasePageV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route
            path="/work-lab/:slug"
            element={
              <HiddenRoute>
                <CasePageV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/immersive/:slug"
            element={
              <ImmersiveCasePage
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route
            path="/about"
            element={
              <SeoRoute meta={routeSeo.about}>
                <AboutV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                  noIndex={false}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/privacy"
            element={
              <SeoRoute meta={routeSeo.privacy}>
                <PrivacyV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/legal"
            element={
              <SeoRoute meta={routeSeo.legal}>
                <LegalV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </SeoRoute>
            }
          />

          <Route
            path="/privacy-v2"
            element={
              <HiddenRoute>
                <PrivacyV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/legal-v2"
            element={
              <HiddenRoute>
                <LegalV2
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/studio-index"
            element={
              <StudioIndex
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/evidence-atlas"
            element={
              <EvidenceAtlas
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/immersive-v2"
            element={
              <ImmersiveV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/offer-v2"
            element={
              <OfferV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/about-v2"
            element={
              <AboutV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex
              />
            }
          />

          <Route
            path="/spatial-proof"
            element={
              <SpatialProof
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          <ProjectDrawerV2 open={drawerOpen} onClose={closeProject} />
          <SoundSignalDock />
          <PageTransitionOverlay />
        </BrowserRouter>
      </SoundProvider>
    </LocaleProvider>
  );
}
