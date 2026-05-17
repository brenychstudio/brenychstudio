import { useEffect, useMemo, useRef, useState } from "react";

import type { SectionRailItem } from "./SectionRail";

function getSectionTop(id: string) {
  const section = document.getElementById(id);
  if (!section) return null;

  return Math.max(0, section.getBoundingClientRect().top + window.scrollY - 76);
}

export function useSectionRailActive(items: SectionRailItem[], fallbackId?: string) {
  const initialId = fallbackId ?? items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(initialId);
  const activeRef = useRef(initialId);
  const idsKey = useMemo(() => items.map((item) => item.id).join("|"), [items]);

  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;

      const viewportAnchor = window.innerHeight * 0.46;
      let nextId = ids[0] ?? "";
      let bestScore = Number.NEGATIVE_INFINITY;

      ids.forEach((id, order) => {
        const section = document.getElementById(id);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const containsAnchor = rect.top <= viewportAnchor && rect.bottom >= viewportAnchor;
        const distance = Math.min(
          Math.abs(rect.top - viewportAnchor),
          Math.abs(rect.bottom - viewportAnchor),
        );
        const score = containsAnchor
          ? 10000 - rect.height / 34 - Math.abs(rect.top - viewportAnchor) / 46 + order / 1000
          : -distance + order / 1000;

        if (score > bestScore) {
          bestScore = score;
          nextId = id;
        }
      });

      if (nextId && activeRef.current !== nextId) {
        activeRef.current = nextId;
        setActiveId(nextId);
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [items, idsKey]);

  return activeId;
}

export function scrollToRailSection(id: string) {
  const top = getSectionTop(id);
  if (top == null) return;

  window.scrollTo({ top, behavior: "smooth" });
}
