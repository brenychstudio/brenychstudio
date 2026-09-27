import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEcosystemHomeProjects } from "../data/ecosystemHome";
import { useI18n } from "../i18n";
import { useDeferredRouteContent } from "../hooks/useDeferredRouteContent";
import HomeMediaRuntimeProvider from "../media/home/HomeMediaRuntimeProvider";
import { useSound } from "../stage/audio/useSound";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SectionRail, { type SectionRailItem } from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { useSectionRailActive } from "../ui/useSectionRailActive";
import { startSpaPageTransition } from "../ui/pageTransition";
import EcosystemHero from "../ui/home/EcosystemHero";
import EcosystemMap from "../ui/home/EcosystemMap";
import EcosystemProducts from "../ui/home/EcosystemProducts";
import EcosystemEvidence from "../ui/home/EcosystemEvidence";
import EcosystemSpatial from "../ui/home/EcosystemSpatial";
import EcosystemSignals from "../ui/home/EcosystemSignals";
import HomeChapterNavigation from "../ui/home/HomeChapterNavigation";
import "../ui/home/ecosystemHome.css";
import "../ui/home/ecosystemMapStage.css";
import "../ui/home/ecosystemProductsStage.css";
import "../ui/home/ecosystemEvidenceStage.css";
import "../ui/home/ecosystemSpatialStage.css";
import "../ui/home/ecosystemSignalsStage.css";
import "../ui/home/homeChapterNavigation.css";

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
  const [spatialDarkActive, setSpatialDarkActive] = useState(false);
  const railItems = useMemo<SectionRailItem[]>(() => locale === "es" ? [
    { id: "opening", index: "01", label: "Señal" },
    { id: "ecosystem", index: "02", label: "Ecosistema" },
    { id: "products", index: "03", label: "Productos" },
    { id: "evidence", index: "04", label: "Evidencia" },
    { id: "spatial", index: "05", label: "Espacial" },
    { id: "research", index: "06", label: "Investigación / Mundos" },
    { id: "collaboration", index: "07", label: "Colaborar" },
  ] : [
    { id: "opening", index: "01", label: "Signal" },
    { id: "ecosystem", index: "02", label: "Ecosystem" },
    { id: "products", index: "03", label: "Products" },
    { id: "evidence", index: "04", label: "Evidence" },
    { id: "spatial", index: "05", label: "Spatial" },
    { id: "research", index: "06", label: "Research / Worlds" },
    { id: "collaboration", index: "07", label: "Collaborate" },
  ], [locale]);
  const activeId = useSectionRailActive(railItems, "opening");
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
      const rect = document.querySelector<HTMLElement>("[data-studio-whisper-media]")?.getBoundingClientRect();
      const active = Boolean(rect && rect.top <= 76 && rect.bottom >= Math.max(76, window.innerHeight - 150));
      document.documentElement.dataset.studioWhisperChrome = active ? "active" : "inactive";
      setSpatialDarkActive(active);
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
  const selectSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  };
  return <HomeMediaRuntimeProvider>
    {noIndex && <StudioNoIndexMeta />}
    <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} compactAtTablet />
    <PageSurface className="tablet-reader-surface relative min-h-screen overflow-x-clip bg-transparent text-neutral-950">
      <AtmosphericSiteShell preset="living" />
      {ready && <>
        <SectionRail items={railItems} activeId={activeId} onSelect={selectSection}
          label={locale === "es" ? "Secciones de inicio" : "Home chapters"}
          tone={spatialDarkActive ? "dark" : "light"} className="home-section-rail" />
        <HomeChapterNavigation items={railItems} activeId={activeId} onSelect={selectSection}
          tone={spatialDarkActive ? "dark" : "light"}
          label={locale === "es" ? "Secciones de inicio" : "Home chapters"}
          buttonLabel={locale === "es" ? "Elegir capítulo" : "Choose chapter"} />
      </>}
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
