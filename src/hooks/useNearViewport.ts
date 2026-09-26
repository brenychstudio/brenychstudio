import { useEffect, useRef, useState } from "react";

type UseNearViewportOptions = {
  rootMargin?: string;
};

// Flips to true once the element comes within rootMargin of the viewport and stays true.
// Without IntersectionObserver the content is simply treated as near.
export function useNearViewport<T extends Element>({
  rootMargin = "800px 0px",
}: UseNearViewportOptions = {}) {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const element = ref.current;
    if (near || !element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return { ref, near };
}
