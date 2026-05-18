import { useEffect, useState } from "react";

export function useImmersiveProofChromeActive(enabled = true) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const proof = document.getElementById("proof");
      if (!proof) {
        setActive(false);
        return;
      }

      const rect = proof.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const railProbe = viewportHeight * 0.5;
      const dockProbe = viewportHeight - 48;
      const coversRail = rect.top <= railProbe && rect.bottom >= railProbe;
      const coversDock = rect.top <= dockProbe && rect.bottom >= dockProbe;

      setActive(coversRail || coversDock);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [enabled]);

  return enabled && active;
}
