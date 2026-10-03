import { useCallback, useEffect, useMemo, useRef, type MouseEvent } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { cubicBezier } from "framer-motion";
import type { ProductIndexModel } from "./productIndexModel";

type ProductSectionMotionProfile = "default" | "rail";
type Options = { replace?: boolean; focus?: boolean; smooth?: boolean; motionProfile?: ProductSectionMotionProfile };
type Intent = Options & { id: string; pathname: string; search: string; cancelled?: boolean };
type Travel = { target: HTMLElement; start: number; end: number; started: number; duration: number; focus: boolean; easing: (progress: number) => number };
const ease = cubicBezier(.22, .75, .18, 1);
const railEase = cubicBezier(.65, 0, .35, 1);
const destination = (target: HTMLElement) => Math.max(0, Math.min(
  target.getBoundingClientRect().top + window.scrollY - 84,
  document.documentElement.scrollHeight - window.innerHeight,
));

/** Owns every Products hash arrival; manual scrolling remains native. */
export function useProductSectionNavigation(model: ProductIndexModel) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const frame = useRef(0);
  const pending = useRef<Intent | null>(null);
  const travel = useRef<Travel | null>(null);
  const validIds = useMemo(() => new Set([
    ...model.chapters.map(chapter => chapter.id), ...model.items.map(item => `products-${item.project.id}`),
  ]), [model]);
  const stopFrame = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    travel.current = null;
  }, []);
  const cancelProductSectionNavigation = useCallback(() => {
    stopFrame();
    if (pending.current) pending.current.cancelled = true;
  }, [stopFrame]);

  useEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab", "Escape"].includes(event.key)) cancelProductSectionNavigation();
    };
    const onResize = () => {
      const active = travel.current;
      if (!active) return;
      const now = performance.now();
      active.duration = Math.max(180, active.duration - (now - active.started));
      active.start = window.scrollY;
      active.end = destination(active.target);
      active.started = now;
    };
    for (const event of ["wheel", "touchstart", "pointerdown"]) window.addEventListener(event, cancelProductSectionNavigation, { passive: true, capture: true });
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onResize);
    return () => {
      cancelProductSectionNavigation();
      pending.current = null;
      history.scrollRestoration = previousRestoration;
      for (const event of ["wheel", "touchstart", "pointerdown"]) window.removeEventListener(event, cancelProductSectionNavigation, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", onResize);
    };
  }, [cancelProductSectionNavigation]);

  useEffect(() => {
    const id = location.hash.slice(1) || "products-threshold";
    const intent = pending.current;
    const explicit = navigationType !== "POP" && intent?.id === id && intent.pathname === location.pathname && intent.search === location.search ? intent : null;
    pending.current = null;
    stopFrame();
    if (!validIds.has(id) || explicit?.cancelled) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const arrive = (target: HTMLElement, focus: boolean) => {
      window.scrollTo({ top: destination(target), behavior: "instant" });
      if (focus) target.focus({ preventScroll: true });
      stopFrame();
    };
    // Register targets can be revealed by this location update; measure after its render.
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;
        const focus = Boolean(location.hash) && explicit?.focus !== false;
        const end = destination(target);
        const distance = Math.abs(end - window.scrollY);
        if (!explicit || explicit.smooth === false || reduced.matches || distance < 1) {
          arrive(target, focus);
          return;
        }
        const rail = explicit.motionProfile === "rail";
        // Chapter Rail travel has a calm departure; content links keep the accepted profile.
        const duration = rail
          ? distance < 240 ? Math.min(650, Math.max(320, distance * 2.7)) : Math.min(1700, Math.max(1000, 950 + distance * .17))
          : distance < 160 ? Math.max(220, distance * 3) : Math.min(950, Math.max(750, 700 + distance * .035));
        travel.current = { target, start: window.scrollY, end, started: performance.now(), duration, focus, easing: rail ? railEase : ease };
        const tick = (now: number) => {
          const active = travel.current;
          if (!active) return;
          const progress = Math.min(1, (now - active.started) / active.duration);
          if (progress === 1 || reduced.matches) {
            arrive(active.target, active.focus);
            return;
          }
          window.scrollTo({ top: active.start + (active.end - active.start) * active.easing(progress), behavior: "instant" });
          frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
      });
    });
    return stopFrame;
  }, [location.hash, location.key, location.pathname, location.search, navigationType, validIds, stopFrame]);

  const navigateToProductSection = useCallback((id: string, options: Options = {}) => {
    if (!validIds.has(id)) return;
    cancelProductSectionNavigation();
    pending.current = { id, pathname: location.pathname, search: location.search, ...options };
    navigate({ pathname: location.pathname, search: location.search, hash: `#${id}` }, { replace: options.replace });
  }, [validIds, cancelProductSectionNavigation, location.pathname, location.search, navigate]);
  const onProductSectionLink = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target === "_blank") return;
    const link = new URL(event.currentTarget.href);
    if (link.origin !== window.location.origin || link.pathname !== location.pathname || link.search !== location.search || !validIds.has(link.hash.slice(1))) return;
    event.preventDefault();
    navigateToProductSection(link.hash.slice(1));
  }, [location.pathname, location.search, validIds, navigateToProductSection]);
  return { navigateToProductSection, onProductSectionLink, cancelProductSectionNavigation };
}
