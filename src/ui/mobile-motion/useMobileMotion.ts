import { useEffect, useRef, useState } from "react";

import { MOBILE_MOTION_BREAKPOINT, mobileMotionObserver, mobileMotionRootMargin } from "./motionTokens";

type UseMobileMotionOptions = {
  enabled?: boolean;
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

function queryMatches(query: string) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(query).matches;
}

export function useMobileMotion({
  enabled = true,
  once = true,
  rootMargin = mobileMotionRootMargin,
  threshold = mobileMotionObserver.section.threshold,
}: UseMobileMotionOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(() => queryMatches(`(max-width: ${MOBILE_MOTION_BREAKPOINT - 1}px)`));
  const [reducedMotion, setReducedMotion] = useState(() => queryMatches("(prefers-reduced-motion: reduce)"));
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_MOTION_BREAKPOINT - 1}px)`);
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(reducedQuery.matches);
    };

    update();
    mobileQuery.addEventListener("change", update);
    reducedQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      reducedQuery.removeEventListener("change", update);
    };
  }, []);

  const motionEnabled = enabled && isMobile && !reducedMotion;

  useEffect(() => {
    const node = ref.current;

    if (!node || !motionEnabled) return;

    let settled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (!visible) return;

        setHasEntered(true);

        if (once && !settled) {
          settled = true;
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [motionEnabled, once, rootMargin, threshold]);

  const active = !motionEnabled || (once ? hasEntered : inView);

  return {
    ref,
    active,
    hasEntered: motionEnabled ? hasEntered : true,
    inView: motionEnabled ? inView : true,
    isMobile,
    motionEnabled,
    reducedMotion,
  };
}
