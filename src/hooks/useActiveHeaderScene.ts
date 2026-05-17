import { useEffect, useState } from "react";

const sensorTarget = () => Math.min(92, window.innerHeight * 0.12);

export function useActiveHeaderScene(routeKey: string) {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const chooseActiveScene = () => {
      frame = 0;

      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-header-scene]"),
      );

      if (!elements.length) {
        setActiveSceneId(null);
        return;
      }

      const target = sensorTarget();
      let nextId: string | null = null;
      let bestScore = Number.NEGATIVE_INFINITY;

      elements.forEach((element, order) => {
        const sceneId = element.dataset.headerScene;
        if (!sceneId) return;

        const rect = element.getBoundingClientRect();
        const containsTarget = rect.top <= target && rect.bottom >= target;
        const distance = Math.min(
          Math.abs(rect.top - target),
          Math.abs(rect.bottom - target),
        );
        const score = containsTarget
          ? 10000 - rect.height / 24 - Math.abs(rect.top - target) / 30 + order / 1000
          : -distance / 18 + order / 1000;

        if (score > bestScore) {
          bestScore = score;
          nextId = sceneId;
        }
      });

      if (!nextId) {
        delete document.documentElement.dataset.activeHeaderScene;
        setActiveSceneId(null);
        return;
      }

      document.documentElement.dataset.activeHeaderScene = nextId;
      setActiveSceneId((current) => (current === nextId ? current : nextId));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(chooseActiveScene);
    };

    const observer = new MutationObserver(requestUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-header-scene"],
    });

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [routeKey]);

  return activeSceneId;
}
