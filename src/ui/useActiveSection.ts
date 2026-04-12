import { useLayoutEffect, useRef, useState } from "react";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function getSectionScore(el: HTMLElement, spyLine: number) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const center = rect.top + rect.height / 2;
  const centerDistance = Math.abs(center - spyLine);
  const centerBias = 1 - Math.min(centerDistance / Math.max(rect.height * 0.6, 1), 1);

  const bandHalf = vh * 0.18;
  const bandTop = spyLine - bandHalf;
  const bandBottom = spyLine + bandHalf;
  const overlap = Math.max(0, Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop));
  const overlapRatio = clamp01(overlap / Math.max(bandBottom - bandTop, 1));

  const visibility = clamp01(
    Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / Math.max(rect.height, 1)
  );

  return centerBias * 0.58 + overlapRatio * 0.3 + visibility * 0.12;
}

export function useActiveSection(slugs: string[], spyRatio = 0.54, hysteresis = 0.06) {
  const safeHysteresis = hysteresis > 1 ? 0.06 : hysteresis;
  const [active, setActive] = useState<string>(slugs[0] ?? "");
  const activeRef = useRef(active);

  useLayoutEffect(() => {
    activeRef.current = active;
  }, [active]);

  useLayoutEffect(() => {
    const getEls = () =>
      slugs
        .map((slug) => document.querySelector<HTMLElement>(`[data-case="${slug}"]`))
        .filter(Boolean) as HTMLElement[];

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;

      const els = getEls();
      if (!els.length) return;

      const spyLine = window.innerHeight * spyRatio;
      let bestSlug = activeRef.current || slugs[0] || "";
      let bestScore = -Infinity;

      for (const el of els) {
        const score = getSectionScore(el, spyLine);
        if (score > bestScore) {
          bestScore = score;
          bestSlug = el.dataset.case ?? bestSlug;
        }
      }

      const currentEl = els.find((el) => el.dataset.case === activeRef.current);
      const currentScore = currentEl ? getSectionScore(currentEl, spyLine) : -Infinity;
      const shouldSwitch = bestSlug !== activeRef.current && bestScore > currentScore + safeHysteresis;

      if (shouldSwitch) {
        activeRef.current = bestSlug;
        setActive(bestSlug);
      } else if (!activeRef.current && bestSlug) {
        activeRef.current = bestSlug;
        setActive(bestSlug);
      }
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [slugs, spyRatio, safeHysteresis]);

  return active;
}
