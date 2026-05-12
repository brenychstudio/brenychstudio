import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Offer from "./pages/Offer";
import CasePage from "./pages/CasePage";
import WorkArchive from "./pages/WorkArchive";
import Immersive from "./pages/Immersive";
import ImmersiveV2 from "./pages/ImmersiveV2";
import ImmersiveCasePage from "./pages/ImmersiveCasePage";
import SpatialProof from "./pages/SpatialProof";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Legal from "./pages/Legal";
import StudioIndex from "./pages/StudioIndex";
import EvidenceAtlas from "./pages/EvidenceAtlas";

import ProjectDrawer from "./ui/ProjectDrawer";
import ScrollToTop from "./ui/ScrollToTop";
import PageTransitionOverlay from "./ui/PageTransitionOverlay";
import { LocaleProvider } from "./store/useLocale";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openProject = useCallback(() => setDrawerOpen(true), []);
  const closeProject = useCallback(() => setDrawerOpen(false), []);

  return (
    <LocaleProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/offer" element={<Offer drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/studio-index" element={<StudioIndex drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/evidence-atlas" element={<EvidenceAtlas drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/spatial-proof" element={<SpatialProof drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/immersive-v2" element={<ImmersiveV2 drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/immersive" element={<Immersive drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/immersive/:slug" element={<ImmersiveCasePage drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/about" element={<About drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/work" element={<WorkArchive drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/work/:slug" element={<CasePage drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/privacy" element={<Privacy drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/legal" element={<Legal drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ProjectDrawer open={drawerOpen} onClose={closeProject} />
        <PageTransitionOverlay />
      </BrowserRouter>
    </LocaleProvider>
  );
}
