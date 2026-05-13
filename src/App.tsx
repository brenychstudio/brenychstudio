import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomeClassic from "./pages/Home";
import OfferClassic from "./pages/Offer";
import OfferV2 from "./pages/OfferV2";
import CasePage from "./pages/CasePage";
import WorkArchiveClassic from "./pages/WorkArchive";
import ImmersiveClassic from "./pages/Immersive";
import ImmersiveV2 from "./pages/ImmersiveV2";
import ImmersiveCasePage from "./pages/ImmersiveCasePage";
import SpatialProof from "./pages/SpatialProof";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Legal from "./pages/Legal";
import StudioIndex from "./pages/StudioIndex";
import EvidenceAtlas from "./pages/EvidenceAtlas";

import ProjectDrawerV2 from "./ui/ProjectDrawerV2";
import ScrollToTop from "./ui/ScrollToTop";
import PageTransitionOverlay from "./ui/PageTransitionOverlay";
import { LocaleProvider } from "./store/useLocale";

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
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route
            path="/"
            element={
              <StudioIndex
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex={false}
              />
            }
          />

          <Route
            path="/work"
            element={
              <EvidenceAtlas
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex={false}
              />
            }
          />

          <Route
            path="/immersive"
            element={
              <ImmersiveV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex={false}
              />
            }
          />

          <Route
            path="/offer"
            element={
              <OfferV2
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
                noIndex={false}
              />
            }
          />

          <Route
            path="/work/:slug"
            element={
              <CasePage
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
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
              <About
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route
            path="/privacy"
            element={
              <Privacy
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route
            path="/legal"
            element={
              <Legal
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
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
            path="/spatial-proof"
            element={
              <SpatialProof
                drawerOpen={drawerOpen}
                onOpenProject={openProject}
                onCloseProject={closeProject}
              />
            }
          />

          <Route
            path="/home-classic"
            element={
              <HiddenRoute>
                <HomeClassic
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/work-classic"
            element={
              <HiddenRoute>
                <WorkArchiveClassic
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/immersive-classic"
            element={
              <HiddenRoute>
                <ImmersiveClassic
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route
            path="/offer-classic"
            element={
              <HiddenRoute>
                <OfferClassic
                  drawerOpen={drawerOpen}
                  onOpenProject={openProject}
                  onCloseProject={closeProject}
                />
              </HiddenRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ProjectDrawerV2 open={drawerOpen} onClose={closeProject} />
        <PageTransitionOverlay />
      </BrowserRouter>
    </LocaleProvider>
  );
}
