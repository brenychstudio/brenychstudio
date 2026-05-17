import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";

import { useActiveHeaderScene } from "../hooks/useActiveHeaderScene";
import { useSound } from "../stage/audio/useSound";
import { getHeaderMoodForPath, resolveHeaderTheme } from "./header/headerThemeTokens";
import type { SoundScene } from "../stage/audio/audioTypes";

type SoundDockStyle = CSSProperties & {
  "--sound-dock-bg": string;
  "--sound-dock-text": string;
  "--sound-dock-muted": string;
  "--sound-dock-border": string;
  "--sound-dock-chip": string;
  "--sound-dock-action-bg": string;
  "--sound-dock-action-text": string;
  "--sound-dock-progress": string;
  "--sound-dock-blur": string;
  "--sound-dock-elevation": string;
};

function getRouteSoundScene(pathname: string): SoundScene {
  if (pathname === "/immersive" || pathname === "/immersive-v2") return "immersive";
  if (pathname === "/work" || pathname.startsWith("/work/") || pathname.startsWith("/work-lab/")) {
    return "evidence";
  }
  if (pathname === "/offer" || pathname.startsWith("/offer")) return "practice";
  if (pathname === "/about" || pathname.startsWith("/about")) return "studio";
  if (pathname === "/privacy" || pathname === "/legal" || pathname.startsWith("/privacy") || pathname.startsWith("/legal")) {
    return "trust";
  }
  return "portfolio";
}

function routeAllowsAmbient(pathname: string) {
  return pathname === "/immersive" || pathname === "/immersive-v2";
}

function CompactSoundSignal({ style, caseMode = false }: { style: SoundDockStyle; caseMode?: boolean }) {
  const sound = useSound();
  const { ambientState, preference, scene } = sound;
  const [expanded, setExpanded] = useState(false);
  const enabled = preference.enabled && !preference.muted;
  const muted = preference.enabled && preference.muted;
  const immersiveAmbient = scene === "immersive" && (ambientState === "playing" || ambientState === "loading");
  const silent = !preference.enabled && preference.mode === "silent";
  const status = enabled ? (immersiveAmbient ? "ambient" : "active") : muted ? "muted" : silent ? "silent" : "available";
  const actionLabel = !preference.enabled ? "Enable" : preference.muted ? "Unmute" : "Mute";
  const action = !preference.enabled ? sound.enable : preference.muted ? sound.unmute : sound.mute;
  const detail = enabled
    ? immersiveAmbient
      ? "Micro + ambient active"
      : "Micro layer active"
    : muted
      ? "Sound layer paused"
      : silent
        ? "Silent route stored"
        : "Micro-sound layer available";

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-2" style={style}>
      <div className={[
        "inline-flex max-w-[calc(100vw-1rem)] items-center overflow-hidden rounded-full border border-[color:var(--sound-dock-border)] bg-[color:var(--sound-dock-bg)] text-[color:var(--sound-dock-text)] opacity-90 shadow-[0_14px_44px_rgba(0,0,0,var(--sound-dock-elevation))] backdrop-blur-[var(--sound-dock-blur)] transition duration-500 hover:opacity-100",
        caseMode ? "scale-[0.92] origin-bottom-right" : "",
      ].join(" ")}>
        <button
          type="button"
          onClick={() => {
            if (!caseMode) setExpanded((value) => !value);
          }}
          className={[
            "flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sound-dock-progress)]",
            caseMode ? "min-h-8 px-2.5" : "min-h-10 px-3.5",
          ].join(" ")}
          aria-expanded={expanded}
        >
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              enabled ? "bg-[color:var(--sound-dock-progress)]" : "bg-[color:var(--sound-dock-muted)] opacity-[0.42]",
            ].join(" ")}
          />
          <span className={[
            "font-mono uppercase text-[color:var(--sound-dock-muted)]",
            caseMode ? "text-[8px] tracking-[0.16em]" : "text-[9px] tracking-[0.18em]",
          ].join(" ")}>
            Sound / {status}
          </span>
        </button>
        <button
          type="button"
          onClick={action}
          onMouseEnter={() => sound.playRole("hover")}
          className={[
            "border-l border-[color:var(--sound-dock-border)] bg-[color:var(--sound-dock-chip)] font-semibold uppercase text-[color:var(--sound-dock-text)] transition hover:bg-[color:var(--sound-dock-action-bg)] hover:text-[color:var(--sound-dock-action-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sound-dock-progress)]",
            caseMode ? "min-h-8 px-3 text-[8px] tracking-[0.14em]" : "min-h-10 px-3.5 text-[9px] tracking-[0.16em]",
          ].join(" ")}
        >
          {actionLabel}
        </button>
      </div>

      {expanded && !caseMode ? (
        <div className="max-w-[18rem] border-y border-[color:var(--sound-dock-border)] bg-[color:var(--sound-dock-bg)] px-3 py-2 text-right text-[10px] uppercase tracking-[0.16em] text-[color:var(--sound-dock-muted)] opacity-[0.92] shadow-[0_16px_48px_rgba(0,0,0,var(--sound-dock-elevation))] backdrop-blur-[var(--sound-dock-blur)]">
          <div className="font-mono text-[9px]">
            {detail}
          </div>
          {scene === "immersive" && enabled ? (
            <button
              type="button"
              onClick={sound.ambientEnabled ? sound.disableAmbient : sound.enableAmbient}
              onMouseEnter={() => sound.playRole("hover")}
              className="mt-2 rounded-full border border-[color:var(--sound-dock-border)] bg-[color:var(--sound-dock-chip)] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[color:var(--sound-dock-text)] transition hover:bg-[color:var(--sound-dock-action-bg)] hover:text-[color:var(--sound-dock-action-text)]"
            >
              {sound.ambientEnabled ? "Ambient off" : "Ambient on"}
            </button>
          ) : null}
          {!preference.enabled ? (
            <button
              type="button"
              onClick={sound.continueSilent}
              className="mt-2 rounded-full border border-[color:var(--sound-dock-border)] bg-[color:var(--sound-dock-chip)] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[color:var(--sound-dock-text)] transition hover:bg-[color:var(--sound-dock-action-bg)] hover:text-[color:var(--sound-dock-action-text)]"
            >
              Continue silent
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function SoundSignalDock() {
  const location = useLocation();
  const { setScene, stopAmbient } = useSound();
  const [footerState, setFooterState] = useState({ pathname: "", visible: false });
  const activeSceneId = useActiveHeaderScene(location.pathname);
  const routeTheme = useMemo(() => getHeaderMoodForPath(location.pathname), [location.pathname]);
  const routeSoundScene = useMemo(() => getRouteSoundScene(location.pathname), [location.pathname]);
  const workCaseMode = location.pathname.startsWith("/work/") || location.pathname.startsWith("/work-lab/");
  const compactMode = workCaseMode || location.pathname.startsWith("/immersive/whisper");
  const footerVisible = footerState.pathname === location.pathname && footerState.visible;
  const soundTheme = useMemo(
    () => resolveHeaderTheme({ routeTheme, activeSceneId }),
    [activeSceneId, routeTheme],
  );
  const soundDockStyle = useMemo<SoundDockStyle>(
    () => ({
      "--sound-dock-bg": soundTheme.surface,
      "--sound-dock-text": soundTheme.foreground,
      "--sound-dock-muted": soundTheme.muted,
      "--sound-dock-border": soundTheme.border,
      "--sound-dock-chip": soundTheme.chipSurface,
      "--sound-dock-action-bg": soundTheme.actionSurface,
      "--sound-dock-action-text": soundTheme.actionForeground,
      "--sound-dock-progress": soundTheme.progress,
      "--sound-dock-blur": `${soundTheme.blur}px`,
      "--sound-dock-elevation": String(Math.min(soundTheme.elevation + 0.035, 0.22)),
    }),
    [soundTheme],
  );

  useEffect(() => {
    if (routeAllowsAmbient(location.pathname)) return;

    setScene(routeSoundScene);
    stopAmbient();
  }, [location.pathname, routeSoundScene, setScene, stopAmbient]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const frame = window.requestAnimationFrame(() => {
      const footer = document.querySelector<HTMLElement>("[data-footer-rail-state='closing']");
      if (!footer) return;

      observer = new IntersectionObserver(
        ([entry]) =>
          setFooterState({
            pathname: location.pathname,
            visible: Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.08),
          }),
        { threshold: [0, 0.08, 0.18], rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(footer);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [location.pathname]);

  if (footerVisible) return null;

  return (
    <div className={["pointer-events-none fixed z-[72]", workCaseMode ? "right-2 top-[4.35rem] sm:right-3 sm:top-[4.75rem]" : "bottom-3 right-3 sm:bottom-4 sm:right-4"].join(" ")}>
      <CompactSoundSignal style={soundDockStyle} caseMode={compactMode} />
    </div>
  );
}
