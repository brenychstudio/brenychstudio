import type { NavigateFunction } from "react-router-dom";
import { flushSync } from "react-dom";

import { preloadRouteModule } from "../routing/routeModules";

const HARD_TRANSITION_KEY = "app:page-transition-hard";
const EXIT_MS = 110;
const REVEAL_BUFFER_MS = 240;

let transitionLocked = false;

function acquireLock() {
  if (transitionLocked) return false;
  transitionLocked = true;
  return true;
}

export function releasePageTransitionLock() {
  transitionLocked = false;
}

export function getPageTransitionExitMs() {
  return EXIT_MS;
}

export function getPageTransitionRevealMs() {
  return REVEAL_BUFFER_MS;
}

export function consumePendingHardTransition() {
  try {
    const raw = sessionStorage.getItem(HARD_TRANSITION_KEY);
    if (!raw) return false;
    sessionStorage.removeItem(HARD_TRANSITION_KEY);

    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;

    return Date.now() - ts < 4000;
  } catch {
    return false;
  }
}

export function startHardPageTransition(to: string, onBeforeNavigate?: () => void) {
  if (typeof window === "undefined") return;
  if (!acquireLock()) return;

  onBeforeNavigate?.();

  try {
    sessionStorage.setItem(HARD_TRANSITION_KEY, String(Date.now()));
  } catch {
    // no-op
  }

  window.dispatchEvent(
    new CustomEvent("app:page-transition-start", {
      detail: { mode: "hard", to },
    })
  );

  window.setTimeout(() => {
    window.location.assign(to);
  }, EXIT_MS);
}

export function startSpaPageTransition(
  navigate: NavigateFunction,
  to: string,
  onBeforeNavigate?: () => void,
  signal?: AbortSignal
) {
  if (typeof window === "undefined" || signal?.aborted) return;
  if (!acquireLock()) return;

  let navigated = false;
  let cancelled = false;
  let exitTimer = 0;
  let frame = 0;
  let transition: { skipTransition(): void } | undefined;
  const cancel = () => {
    if (navigated || cancelled) return;
    cancelled = true;
    window.clearTimeout(exitTimer);
    window.cancelAnimationFrame(frame);
    transition?.skipTransition();
    signal?.removeEventListener("abort", cancel);
    releasePageTransitionLock();
    window.dispatchEvent(new CustomEvent("app:page-transition-cancel"));
  };
  const commit = () => {
    if (cancelled || signal?.aborted) { cancel(); return; }
    navigated = true;
    signal?.removeEventListener("abort", cancel);
    navigate(to);
  };
  signal?.addEventListener("abort", cancel, { once: true });

  // Fetch the destination route module during the authored exit; navigation never waits for it.
  preloadRouteModule(to);

  onBeforeNavigate?.();

  window.dispatchEvent(
    new CustomEvent("app:page-transition-start", {
      detail: { mode: "spa", to },
    })
  );

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const viewTransition = document.startViewTransition;

  exitTimer = window.setTimeout(() => {
    if (cancelled || signal?.aborted) { cancel(); return; }
    if (!prefersReducedMotion && typeof viewTransition === "function") {
      try {
        transition = viewTransition.call(document, () => {
          flushSync(() => {
            commit();
          });
        });
        return;
      } catch {
        releasePageTransitionLock();
        commit();
        return;
      }
    }

    frame = window.requestAnimationFrame(() => {
      try {
        flushSync(() => {
          commit();
        });
      } catch {
        releasePageTransitionLock();
        commit();
      }
    });
  }, EXIT_MS);
}
