import { useEffect, useRef } from "react";

type KoolBerkWebGLBackdropProps = {
  className?: string;
};

declare global {
  interface Window {
    KoolBerkWebGLBackground?: {
      mount: (
        target: HTMLElement | string,
        options?: {
          preset?: "identity" | "lo-fi" | "monah" | "nich" | "zmina" | "live" | "contact";
          maxDpr?: number;
          pointer?: boolean;
          reducedMotion?: boolean;
          addHostClass?: boolean;
          manageContainer?: boolean;
          className?: string;
        },
      ) => {
        destroy?: () => void;
        play?: () => void;
        pause?: () => void;
        setReducedMotion?: (reducedMotion: boolean) => void;
      };
    };
    __koolBerkBackgroundScriptPromise?: Promise<void>;
  }
}

const backdropScriptId = "kool-berk-webgl-background-script";
const backdropScriptSrc = "/immersive/kool-berk/backdrop-16/kool-berk-background.js";

function ensureScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.KoolBerkWebGLBackground) return Promise.resolve();
  if (window.__koolBerkBackgroundScriptPromise) return window.__koolBerkBackgroundScriptPromise;

  window.__koolBerkBackgroundScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(backdropScriptId) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Kool Berk backdrop script.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = backdropScriptId;
    script.src = backdropScriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Kool Berk backdrop script."));
    document.body.appendChild(script);
  });

  return window.__koolBerkBackgroundScriptPromise;
}

export default function KoolBerkWebGLBackdrop({ className = "" }: KoolBerkWebGLBackdropProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let destroyed = false;
    let instance:
      | {
          destroy?: () => void;
          play?: () => void;
          pause?: () => void;
          setReducedMotion?: (reducedMotion: boolean) => void;
        }
      | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let shouldRun = false;
    let scriptReady = false;
    let scriptLoading = false;

    const prefersReducedMotion = () =>
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mountBackdrop = () => {
      if (destroyed || !mountRef.current || !window.KoolBerkWebGLBackground) return;
      if (!shouldRun || document.hidden) return;
      if (instance) {
        instance.setReducedMotion?.(prefersReducedMotion() || window.innerWidth < 768);
        instance.play?.();
        return;
      }

      instance = window.KoolBerkWebGLBackground.mount(mountRef.current, {
        preset: "identity",
        maxDpr: window.innerWidth >= 1440 ? 1.5 : window.innerWidth >= 768 ? 1.35 : 1.1,
        pointer: window.innerWidth >= 1024,
        reducedMotion: prefersReducedMotion() || window.innerWidth < 768,
        addHostClass: true,
        manageContainer: false,
      });
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
          instance = null;
        });
    };

    const syncRuntimeState = (nextShouldRun = shouldRun) => {
      shouldRun = nextShouldRun;

      if (shouldRun && !document.hidden) {
        requestMount();
        return;
      }

      instance?.pause?.();
    };

    if (rootRef.current) {
      resizeObserver = new ResizeObserver(() => {
        instance?.setReducedMotion?.(prefersReducedMotion() || window.innerWidth < 768);
      });
      resizeObserver.observe(rootRef.current);

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          syncRuntimeState(Boolean(entry?.isIntersecting));
        },
        {
          root: null,
          rootMargin: "120px 0px 120px 0px",
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
      instance?.destroy?.();
      instance = null;
    };
  }, []);

  return (
    <div ref={rootRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
