import { useEffect, useState } from "react";

type VisibleScene = {
  id: string;
  ratio: number;
  top: number;
};

const sensorTarget = () => Math.min(92, window.innerHeight * 0.12);

export function useActiveHeaderScene(routeKey: string) {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

  useEffect(() => {
    setActiveSceneId(null);

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-header-scene]"),
    );

    if (!elements.length) {
      setActiveSceneId(null);
      return;
    }

    const visibleScenes = new Map<Element, VisibleScene>();

    const chooseActiveScene = () => {
      const candidates = Array.from(visibleScenes.values());

      if (!candidates.length) {
        setActiveSceneId(null);
        return;
      }

      candidates.sort((a, b) => {
        const target = sensorTarget();
        const scoreA = a.ratio * 120 - Math.abs(a.top - target) / 18;
        const scoreB = b.ratio * 120 - Math.abs(b.top - target) / 18;
        return scoreB - scoreA;
      });

      setActiveSceneId((current) => (current === candidates[0].id ? current : candidates[0].id));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sceneId = (entry.target as HTMLElement).dataset.headerScene;

          if (!sceneId) return;

          if (entry.isIntersecting) {
            visibleScenes.set(entry.target, {
              id: sceneId,
              ratio: entry.intersectionRatio,
              top: entry.boundingClientRect.top,
            });
            return;
          }

          visibleScenes.delete(entry.target);
        });

        chooseActiveScene();
      },
      {
        root: null,
        rootMargin: "0px 0px -86% 0px",
        threshold: [0, 0.01, 0.04, 0.08, 0.12],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [routeKey]);

  return activeSceneId;
}
