import type { NavigateFunction } from "react-router-dom";
import { flushSync } from "react-dom";

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
  onBeforeNavigate?: () => void
) {
  if (typeof window === "undefined") return;
  if (!acquireLock()) return;

  onBeforeNavigate?.();

  window.dispatchEvent(
    new CustomEvent("app:page-transition-start", {
      detail: { mode: "spa", to },
    })
  );

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const viewTransition = document.startViewTransition;

  window.setTimeout(() => {
    if (!prefersReducedMotion && typeof viewTransition === "function") {
      try {
        viewTransition.call(document, () => {
          flushSync(() => {
            navigate(to);
          });
        });
        return;
      } catch {
        releasePageTransitionLock();
        navigate(to);
        return;
      }
    }

    window.requestAnimationFrame(() => {
      try {
        flushSync(() => {
          navigate(to);
        });
      } catch {
        releasePageTransitionLock();
        navigate(to);
      }
    });
  }, EXIT_MS);
}
