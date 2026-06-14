import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  consumePendingHardTransition,
  getPageTransitionRevealMs,
  releasePageTransitionLock,
} from "./pageTransition";

type Phase = "hidden" | "cover" | "reveal";

type TransitionStartDetail = {
  mode?: "spa" | "hard";
  to?: string;
};

export default function PageTransitionOverlay() {
  const location = useLocation();
  const [phase, setPhase] = useState<Phase>(() =>
    consumePendingHardTransition() ? "cover" : "hidden"
  );
  const [targetPath, setTargetPath] = useState("");

  const hardPendingRef = useRef(phase === "cover");
  const spaPendingRef = useRef(false);

  useEffect(() => {
    const onStart = (event: Event) => {
      const detail = (event as CustomEvent<TransitionStartDetail>).detail;
      spaPendingRef.current = detail?.mode === "spa";
      setTargetPath(detail?.to ?? "");
      setPhase("cover");
    };

    window.addEventListener("app:page-transition-start", onStart as EventListener);
    return () => {
      window.removeEventListener("app:page-transition-start", onStart as EventListener);
    };
  }, []);

  useEffect(() => {
    const resetOverlay = () => {
      hardPendingRef.current = false;
      spaPendingRef.current = false;
      setTargetPath("");
      setPhase("hidden");
      releasePageTransitionLock();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) resetOverlay();

      const navigationEntry = performance.getEntriesByType?.("navigation")?.[0] as
        | PerformanceNavigationTiming
        | undefined;

      if (navigationEntry?.type === "back_forward") {
        resetOverlay();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", resetOverlay);
    window.addEventListener("popstate", resetOverlay);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", resetOverlay);
      window.removeEventListener("popstate", resetOverlay);
    };
  }, []);

  useEffect(() => {
    if (!hardPendingRef.current) return;

    const revealTimer = window.setTimeout(() => {
      setPhase("reveal");
    }, 18);

    const clearTimer = window.setTimeout(() => {
      hardPendingRef.current = false;
      setPhase("hidden");
      releasePageTransitionLock();
    }, getPageTransitionRevealMs());

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(clearTimer);
    };
  }, []);

  useEffect(() => {
    if (!spaPendingRef.current) return;

    const revealTimer = window.setTimeout(() => {
      setPhase("reveal");
    }, 12);

    const clearTimer = window.setTimeout(() => {
      spaPendingRef.current = false;
      setPhase("hidden");
      releasePageTransitionLock();
    }, getPageTransitionRevealMs());

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(clearTimer);
    };
  }, [location.pathname]);

  const visible = phase !== "hidden";
  const covering = phase === "cover";
  const transitionPath = targetPath || location.pathname;
  const darkTransition =
    transitionPath.startsWith("/immersive/") && transitionPath !== "/immersive";

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none fixed inset-0 z-[1200] transition-opacity duration-[240ms]",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 transition-[opacity,backdrop-filter] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          covering
            ? darkTransition
              ? "bg-neutral-950/82 opacity-100 backdrop-blur-[3px]"
              : "bg-neutral-950/5 opacity-100 backdrop-blur-[2px]"
            : darkTransition
              ? "bg-neutral-950/0 opacity-0 backdrop-blur-0"
              : "bg-neutral-950/0 opacity-0 backdrop-blur-0",
        ].join(" ")}
      />

      <div
        className={[
          "absolute inset-0 transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          covering ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background:
            darkTransition
              ? "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.035) 38%, rgba(255,255,255,0.00) 100%)"
              : "linear-gradient(180deg, rgba(17,17,17,0.035) 0%, rgba(17,17,17,0.012) 38%, rgba(17,17,17,0.00) 100%)",
        }}
      />
    </div>
  );
}
