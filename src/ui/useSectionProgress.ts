import { useEffect, useMemo, useRef, useState } from "react";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function computeSectionProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const center = rect.top + rect.height / 2;
  const start = vh * 0.86;
  const end = vh * 0.18;
  return clamp01((start - center) / (start - end));
}

export function useSectionProgressMap(slugs: string[]) {
  const stableSlugs = useMemo(() => slugs.filter(Boolean), [slugs]);
  const zeroMap = useMemo(
    () => Object.fromEntries(stableSlugs.map((slug) => [slug, 0])),
    [stableSlugs]
  );
  const [progressMap, setProgressMap] = useState<Record<string, number>>(zeroMap);

  const elsRef = useRef<Record<string, HTMLElement>>({});
  const targetRef = useRef<Record<string, number>>({});
  const currentRef = useRef<Record<string, number>>({});
  const rafRef = useRef<number>(0);
  const animatingRef = useRef(false);


  useEffect(() => {
    targetRef.current = zeroMap;
    currentRef.current = zeroMap;

    const getEls = () =>
      stableSlugs.reduce<Record<string, HTMLElement>>((acc, slug) => {
        const el = document.querySelector<HTMLElement>(`[data-case="${slug}"]`);
        if (el) acc[slug] = el;
        return acc;
      }, {});

    const updateTargets = () => {
      elsRef.current = getEls();

      const nextTargets = stableSlugs.reduce<Record<string, number>>((acc, slug) => {
        acc[slug] = elsRef.current[slug] ? computeSectionProgress(elsRef.current[slug]) : 0;
        return acc;
      }, {});

      targetRef.current = nextTargets;
    };

    const step = () => {
      const next = { ...currentRef.current };
      let shouldContinue = false;
      let changed = false;

      for (const slug of stableSlugs) {
        const current = next[slug] ?? 0;
        const target = targetRef.current[slug] ?? 0;
        const delta = target - current;

        if (Math.abs(delta) < 0.0008) {
          if (current !== target) {
            next[slug] = target;
            changed = true;
          }
          continue;
        }

        next[slug] = current + delta * 0.14;
        shouldContinue = true;
        changed = true;
      }

      if (changed) {
        currentRef.current = next;
        setProgressMap((prev) => {
          for (const slug of stableSlugs) {
            if (Math.abs((prev[slug] ?? 0) - (next[slug] ?? 0)) > 0.0008) {
              return next;
            }
          }
          return prev;
        });
      }

      if (shouldContinue) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        animatingRef.current = false;
      }
    };

    const ensureAnimation = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;
      rafRef.current = requestAnimationFrame(step);
    };

    const syncNow = () => {
      updateTargets();
      currentRef.current = { ...targetRef.current };
      setProgressMap({ ...targetRef.current });
    };

    const onScrollOrResize = () => {
      updateTargets();
      ensureAnimation();
    };

    syncNow();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      animatingRef.current = false;
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [stableSlugs, zeroMap]);

  return progressMap;
}

export function useSectionProgress(activeSlug: string) {
  const progressMap = useSectionProgressMap([activeSlug]);
  return progressMap[activeSlug] ?? 0;
}
