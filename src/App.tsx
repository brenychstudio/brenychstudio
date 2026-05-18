import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import OfferV2 from "./pages/OfferV2";
import ImmersiveV2 from "./pages/ImmersiveV2";
import ImmersiveCasePage from "./pages/ImmersiveCasePage";
import AboutV2 from "./pages/AboutV2";
import StudioIndex from "./pages/StudioIndex";
import EvidenceAtlas from "./pages/EvidenceAtlas";
import ProjectDrawerV2 from "./ui/ProjectDrawerV2";
import ScrollToTop from "./ui/ScrollToTop";
import PageTransitionOverlay from "./ui/PageTransitionOverlay";
import SoundSignalDock from "./ui/SoundSignalDock";
import SeoMeta, { type SeoMetaProps } from "./ui/SeoMeta";
import { LocaleProvider } from "./store/useLocale";
import { SoundProvider } from "./stage/audio/SoundProvider";

const CasePageV2 = lazy(() => import("./pages/CasePageV2"));
const SpatialProof = lazy(() => import("./pages/SpatialProof"));
const PrivacyV2 = lazy(() => import("./pages/PrivacyV2"));
const LegalV2 = lazy(() => import("./pages/LegalV2"));

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
  const { pathname } = useLocation();
  const isWorkCase = pathname.startsWith("/work/");
  const isImmersiveCase = pathname.startsWith("/immersive/");
  const isPolicy = pathname === "/privacy" || pathname === "/legal";

  let background = "bg-[#f2efe8]";

  if (pathname === "/work") background = "bg-[#f3f1ec]";
  else if (pathname === "/immersive") background = "bg-[#f1eee7]";
  else if (pathname === "/offer" || pathname === "/about") background = "bg-[#f3f0e9]";
  else if (isPolicy || isWorkCase) background = "bg-[#f6f4ef]";
  else if (isImmersiveCase) background = "bg-[#080807]";

  return (
    <div aria-hidden="true" className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${background}`}>
      {!isImmersiveCase ? (
        <>
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:88px_88px]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,rgba(255,255,255,0.72),transparent_68%)]" />
        </>
      ) : null}
    </div>
  );
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
