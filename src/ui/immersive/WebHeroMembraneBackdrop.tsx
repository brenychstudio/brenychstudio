import { useEffect, useRef } from "react";

type WebHeroMembraneBackdropProps = {
  className?: string;
};

declare global {
  interface Window {
    Backdrop04Membrane?: {
      mount: (
        element: HTMLElement,
        options?: {
          performanceMode?: "full" | "library";
          pointerReactive?: boolean;
          density?: number;
          glow?: number;
        },
      ) => { destroy?: () => void };
    };
    __webHeroMembraneScriptPromise?: Promise<void>;
  }
}

const membraneScriptId = "webhero-iridescent-membrane-script";
const membraneStylesheetId = "webhero-iridescent-membrane-styles";
const membraneScriptSrc = "/immersive/webhero/iridescent-membrane/backdrop-04-membrane.js";
const membraneStylesheetHref = "/immersive/webhero/iridescent-membrane/backdrop-04-membrane.css";

function ensureStylesheet() {
  if (typeof document === "undefined") return;
  if (document.getElementById(membraneStylesheetId)) return;

  const link = document.createElement("link");
  link.id = membraneStylesheetId;
  link.rel = "stylesheet";
  link.href = membraneStylesheetHref;
  document.head.appendChild(link);
}

function ensureScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Backdrop04Membrane) return Promise.resolve();
  if (window.__webHeroMembraneScriptPromise) return window.__webHeroMembraneScriptPromise;

  window.__webHeroMembraneScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(membraneScriptId) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load membrane script.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = membraneScriptId;
    script.src = membraneScriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load membrane script."));
    document.body.appendChild(script);
  });

  return window.__webHeroMembraneScriptPromise;
}

export default function WebHeroMembraneBackdrop({ className = "" }: WebHeroMembraneBackdropProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    ensureStylesheet();

    let destroyed = false;
    let cleanup: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let shouldRun = false;
    let scriptReady = false;
    let scriptLoading = false;

    const syncToRootSize = () => {
      const element = mountRef.current;
      const root = rootRef.current;
      if (!element || !root) return;

      const rect = root.getBoundingClientRect();
      const nextHeight = Math.max(window.innerHeight, Math.round(rect.height * 1.16));
      const nextWidth = Math.max(window.innerWidth, Math.round(rect.width * 1.16));

      element.style.height = `${nextHeight}px`;
      element.style.minHeight = `${nextHeight}px`;
      element.style.width = `${nextWidth}px`;
      element.style.left = `${Math.round((rect.width - nextWidth) / 2)}px`;
      element.style.top = `${Math.round((rect.height - nextHeight) / 2)}px`;

      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    };

    const destroyBackdrop = () => {
      cleanup?.();
      cleanup = null;
    };

    const mountBackdrop = () => {
      if (destroyed || !mountRef.current || !window.Backdrop04Membrane) return;
      if (!shouldRun || document.hidden) return;
      if (cleanup) return;

      if (typeof (mountRef.current as HTMLDivElement & { __backdrop04Destroy?: () => void }).__backdrop04Destroy === "function") {
        (mountRef.current as HTMLDivElement & { __backdrop04Destroy?: () => void }).__backdrop04Destroy?.();
      }

      syncToRootSize();

      const performanceMode = window.innerWidth < 768 ? "library" : "full";
      const pointerReactive = window.innerWidth >= 1024;
      const instance = window.Backdrop04Membrane.mount(mountRef.current, {
        performanceMode,
        pointerReactive,
        density: performanceMode === "library" ? 0.72 : 0.82,
        glow: 0.82,
      });

      cleanup = instance?.destroy ?? null;
    };

    const requestMount = () => {
      if (destroyed || !shouldRun || document.hidden) return;

      if (scriptReady) {
        mountBackdrop();
        return;
      }

      if (scriptLoading) return;
      scriptLoading = true;
      ensureScript()
        .then(() => {
          scriptReady = true;
          scriptLoading = false;
          mountBackdrop();
        })
        .catch(() => {
          scriptLoading = false;
          cleanup = null;
        });
    };

    const syncRuntimeState = (nextShouldRun = shouldRun) => {
      shouldRun = nextShouldRun;

      if (shouldRun && !document.hidden) {
        requestMount();
        return;
      }

      destroyBackdrop();
    };

    if (rootRef.current) {
      resizeObserver = new ResizeObserver(() => {
        syncToRootSize();
      });
      resizeObserver.observe(rootRef.current);

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          syncRuntimeState(Boolean(entry?.isIntersecting));
        },
        {
          root: null,
          rootMargin: "96px 0px 96px 0px",
          threshold: 0,
        },
      );
      intersectionObserver.observe(rootRef.current);
    }

    const handleVisibilityChange = () => {
      syncRuntimeState();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      destroyBackdrop();
    };
  }, []);

  return (
    <div ref={rootRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div ref={mountRef} className="absolute" />
    </div>
  );
}
