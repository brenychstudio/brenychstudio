import { useEffect, useState } from "react";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function useStageBlend(targetSlug: string) {
  const [blend, setBlend] = useState(0);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(`[data-case="${targetSlug}"]`);
    if (!target) return;

    let ticking = false;

    const update = () => {
      ticking = false;

      const r = target.getBoundingClientRect();
      const vh = window.innerHeight;

      const anchor = r.top + Math.min(r.height * 0.28, vh * 0.26);

      const start = vh * 0.92;
      const end = vh * 0.22;

      const t = (start - anchor) / (start - end);
      setBlend(clamp01(t));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetSlug]);

  return blend;
}
