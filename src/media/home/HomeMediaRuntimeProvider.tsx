import { useEffect, useMemo, useState, type ReactNode } from "react";

import { resolveHomeMediaMode } from "./homeMediaPolicy";
import {
  HomeMediaRuntimeContext,
  type HomeMediaListener,
  type HomeMediaObservation,
  type HomeMediaRuntimeValue,
} from "./useHomeMediaRuntime";

const WARM_ROOT_MARGIN = "75% 0px 75% 0px";
const WARM_FALLBACK_VIEWPORT_MARGIN = 0.75;
const ACTIVE_THRESHOLDS = [0, 0.25, 0.3, 1];
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type NetworkConnectionLike = {
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

type Registration = {
  listener: HomeMediaListener;
  state: HomeMediaObservation;
};

type HomeMediaObserverStore = {
  observeTarget: HomeMediaRuntimeValue["observeTarget"];
  dispose: () => void;
};

function getConnection(): NetworkConnectionLike | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: NetworkConnectionLike }).connection;
}

function readReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(REDUCED_MOTION_QUERY).matches
    : false;
}

function readSaveData() {
  return getConnection()?.saveData === true;
}

function readPageVisible() {
  return typeof document === "undefined" || !document.hidden;
}

function measureWithoutObserver(element: Element): HomeMediaObservation {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const warmMargin = viewportHeight * WARM_FALLBACK_VIEWPORT_MARGIN;
  const hasBox = rect.width > 0 && rect.height > 0;
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));

  return {
    isWarm: hasBox && rect.bottom >= -warmMargin && rect.top <= viewportHeight + warmMargin,
    visibleRatio: hasBox ? visibleHeight / rect.height : 0,
  };
}

// One shared observation store per Home mount: two IntersectionObservers for every managed
// target, or a single throttled scroll/resize loop when IntersectionObserver is unavailable.
function createHomeMediaObserverStore(): HomeMediaObserverStore {
  const registrations = new Map<Element, Registration>();
  let warmObserver: IntersectionObserver | null = null;
  let activeObserver: IntersectionObserver | null = null;
  let removeFallback: (() => void) | null = null;

  const notify = (element: Element, patch: Partial<HomeMediaObservation>) => {
    const registration = registrations.get(element);
    if (!registration) return;
    registration.state = { ...registration.state, ...patch };
    registration.listener(registration.state);
  };

  const ensureObservers = () => {
    warmObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) notify(entry.target, { isWarm: entry.isIntersecting });
      },
      { rootMargin: WARM_ROOT_MARGIN, threshold: 0 },
    );
    activeObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          notify(entry.target, { visibleRatio: entry.isIntersecting ? entry.intersectionRatio : 0 });
        }
      },
      { rootMargin: "0px", threshold: ACTIVE_THRESHOLDS },
    );
    return { warm: warmObserver, active: activeObserver };
  };

  const ensureFallback = () => {
    if (removeFallback) return;

    let frame = 0;
    const measureAll = () => {
      frame = 0;
      for (const element of registrations.keys()) notify(element, measureWithoutObserver(element));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measureAll);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    removeFallback = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      removeFallback = null;
    };
    schedule();
  };

  const observeTarget: HomeMediaRuntimeValue["observeTarget"] = (element, listener) => {
    registrations.set(element, { listener, state: { isWarm: false, visibleRatio: 0 } });

    if (typeof IntersectionObserver !== "undefined") {
      const { warm, active } = ensureObservers();
      warm.observe(element);
      active.observe(element);

      return () => {
        registrations.delete(element);
        warm.unobserve(element);
        active.unobserve(element);
      };
    }

    ensureFallback();
    window.requestAnimationFrame(() => notify(element, measureWithoutObserver(element)));

    return () => {
      registrations.delete(element);
    };
  };

  const dispose = () => {
    warmObserver?.disconnect();
    activeObserver?.disconnect();
    warmObserver = null;
    activeObserver = null;
    removeFallback?.();
  };

  return { observeTarget, dispose };
}

export default function HomeMediaRuntimeProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createHomeMediaObserverStore);
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion);
  const [saveData, setSaveData] = useState(readSaveData);
  const [pageVisible, setPageVisible] = useState(readPageVisible);

  useEffect(() => () => store.dispose(), [store]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const connection = getConnection();
    if (!connection?.addEventListener) return;

    const update = () => setSaveData(connection.saveData === true);
    connection.addEventListener("change", update);

    return () => connection.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);

    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const mode = resolveHomeMediaMode(reducedMotion, saveData);
  const value = useMemo<HomeMediaRuntimeValue>(
    () => ({ mode, pageVisible, observeTarget: store.observeTarget }),
    [mode, pageVisible, store],
  );

  return <HomeMediaRuntimeContext.Provider value={value}>{children}</HomeMediaRuntimeContext.Provider>;
}
