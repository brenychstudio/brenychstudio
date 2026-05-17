import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useSpring } from "framer-motion";

export type SectionRailItem = {
  id: string;
  index: string;
  label: string;
};

export type SectionRailTone = "auto" | "light" | "dark";

export default function SectionRail({
  items,
  activeId,
  onSelect,
  label = "Page sections",
  tone = "auto",
}: {
  items: SectionRailItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  label?: string;
  tone?: SectionRailTone;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 96, damping: 30, mass: 0.42 });
  const [footerVisible, setFooterVisible] = useState(false);
  const autoDarkActive =
    activeId.includes("whisper") ||
    activeId.includes("proof") ||
    activeId.includes("principles");
  const darkActive = tone === "dark" || (tone === "auto" && autoDarkActive);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>("[data-footer-rail-state='closing']");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)),
      {
        root: null,
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.08,
      },
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  const rail = (
    <nav
      className={[
        "pointer-events-none fixed right-5 top-1/2 z-[70] hidden -translate-y-1/2 items-center gap-3 transition duration-500 xl:flex",
        footerVisible ? "translate-x-3 opacity-0" : "opacity-100",
      ].join(" ")}
      aria-label={label}
      data-rail-tone={darkActive ? "dark" : "light"}
    >
      <div
        className={[
          "relative h-[min(46vh,21rem)] w-px overflow-hidden rounded-full transition duration-500",
          darkActive ? "bg-white/18" : "bg-neutral-950/10",
        ].join(" ")}
      >
        <motion.div
          className={`absolute left-0 top-0 h-full w-full origin-top ${darkActive ? "bg-white" : "bg-neutral-950"}`}
          style={{ scaleY: progress }}
        />
      </div>

      <div
        className={[
          "pointer-events-auto flex flex-col items-end gap-2 border-r pr-3 transition duration-500",
          darkActive
            ? "border-white/18 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
            : "border-neutral-950/10 [text-shadow:0_1px_10px_rgba(255,255,255,0.75)]",
        ].join(" ")}
      >
        {items.map((item) => {
          const active = activeId === item.id;
          const buttonClass = active
            ? darkActive
              ? "text-white"
              : "text-neutral-950"
            : darkActive
              ? "text-white/48 hover:text-white/88"
              : "text-neutral-500 hover:text-neutral-900";
          const indexClass = active
            ? darkActive
              ? "border-white bg-white text-neutral-950 shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
              : "border-neutral-950 bg-neutral-950 text-white shadow-[0_8px_24px_rgba(15,15,15,0.12)]"
            : darkActive
              ? "border-white/18 bg-black/12 text-white/48 group-hover:border-white/38 group-hover:text-white/88"
              : "border-neutral-950/14 bg-white/70 text-neutral-500 shadow-[0_8px_22px_rgba(15,15,15,0.08)] group-hover:border-neutral-950/30 group-hover:text-neutral-900";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item.id)}
              aria-current={active ? "true" : undefined}
              className={[
                "group grid grid-cols-[1.45rem_1fr] items-center gap-1.5 py-1 text-left text-[9px] uppercase tracking-[0.14em] transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
                buttonClass,
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-5 w-5 place-items-center rounded-full border font-mono text-[8px] backdrop-blur-sm transition duration-300",
                  indexClass,
                ].join(" ")}
              >
                {item.index}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );

  if (typeof document === "undefined") return rail;

  return createPortal(rail, document.body);
}
