import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEcosystemHomeProjects } from "../data/ecosystemHome";
import { useI18n } from "../i18n";
import { useDeferredRouteContent } from "../hooks/useDeferredRouteContent";
import HomeMediaRuntimeProvider from "../media/home/HomeMediaRuntimeProvider";
import { useSound } from "../stage/audio/useSound";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { startSpaPageTransition } from "../ui/pageTransition";
import EcosystemHero from "../ui/home/EcosystemHero";
import EcosystemMap from "../ui/home/EcosystemMap";
import EcosystemProducts from "../ui/home/EcosystemProducts";
import EcosystemEvidence from "../ui/home/EcosystemEvidence";
import EcosystemSpatial from "../ui/home/EcosystemSpatial";
import EcosystemSignals from "../ui/home/EcosystemSignals";
import "../ui/home/ecosystemHome.css";

type PageProps = { drawerOpen?: boolean; onOpenProject?: () => void; onCloseProject?: () => void; noIndex?: boolean };

function StudioNoIndexMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Studio Index — Rostyslav Brenych";
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    if (!existing) document.head.appendChild(meta);
    return () => {
      document.title = previousTitle;
      if (existing && previousContent !== null) existing.setAttribute("content", previousContent);
      if (!existing) meta.remove();
    };
  }, []);
  return null;
}

export default function StudioIndex({ drawerOpen = false, onOpenProject, onCloseProject, noIndex = false }: PageProps) {
  const routerNavigate = useNavigate();
  const { locale: currentLocale } = useI18n();
  const locale = currentLocale === "es" ? "es" : "en";
  const ready = useDeferredRouteContent();
  const { playRole, setScene, stopAmbient } = useSound();
  const groups = getEcosystemHomeProjects();
  useEffect(() => { setScene("portfolio"); stopAmbient(); }, [setScene, stopAmbient]);

  // Cold fragment URLs must wait for the deferred Home sections to exist.
  useEffect(() => {
    if (!ready || !window.location.hash) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ready]);

  // Preserve Home's adaptive header/dock chrome over the dark spatial surface.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = document.getElementById("spatial")?.getBoundingClientRect();
      const active = Boolean(rect && rect.top <= 76 && rect.bottom >= Math.max(76, window.innerHeight - 150));
      document.documentElement.dataset.studioWhisperChrome = active ? "active" : "inactive";
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      delete document.documentElement.dataset.studioWhisperChrome;
    };
  }, [ready]);

  const navigate = (path: string) => {
    playRole(path.includes("/immersive") ? "open" : "select");
    startSpaPageTransition(routerNavigate, path, () => onCloseProject?.());
  };
  return <HomeMediaRuntimeProvider>
    {noIndex && <StudioNoIndexMeta />}
    <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} />
    <PageSurface className="tablet-reader-surface relative min-h-screen overflow-x-hidden bg-transparent text-neutral-950">
      <AtmosphericSiteShell preset="living" />
      <main className="ecosystem-home relative z-10" lang={locale}>
        <EcosystemHero locale={locale} onOpenProject={onOpenProject} />
        {ready ? <>
          <EcosystemMap locale={locale} navigate={navigate} />
          <EcosystemProducts locale={locale} navigate={navigate} projects={groups.products} />
          <EcosystemEvidence locale={locale} navigate={navigate} projects={groups.evidence} />
          <EcosystemSpatial locale={locale} navigate={navigate} projects={groups.spatial} />
          <EcosystemSignals locale={locale} navigate={navigate} onOpenProject={onOpenProject} />
        </> : <div aria-hidden="true" className="min-h-[420vh]" />}
      </main>
      {ready && <SiteFooterV2 onOpenProject={onOpenProject} variant="living" />}
    </PageSurface>
  </HomeMediaRuntimeProvider>;
}
