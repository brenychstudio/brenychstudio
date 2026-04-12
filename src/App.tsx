import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Offer from "./pages/Offer";
import CasePage from "./pages/CasePage";
import WorkArchive from "./pages/WorkArchive";
import Immersive from "./pages/Immersive";
import ImmersiveCasePage from "./pages/ImmersiveCasePage";
import About from "./pages/About";

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
          <Route path="/immersive" element={<Immersive drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/immersive/:slug" element={<ImmersiveCasePage drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/about" element={<About drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/work" element={<WorkArchive drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="/work/:slug" element={<CasePage drawerOpen={drawerOpen} onOpenProject={openProject} onCloseProject={closeProject} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ProjectDrawer open={drawerOpen} onClose={closeProject} />
        <PageTransitionOverlay />
      </BrowserRouter>
    </LocaleProvider>
  );
}
