import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SectionRailItem } from "../SectionRail";

export default function HomeChapterNavigation({
  items,
  activeId,
  onSelect,
  tone,
  label = "Home chapters",
  buttonLabel = "Choose chapter",
}: {
  items: SectionRailItem[];
  activeId: string;
  onSelect: (id: string) => void;
  tone: "light" | "dark";
  label?: string;
  buttonLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex];

  useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setExpanded(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        navRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  if (!active) return null;
  const navigation = <nav ref={navRef} className="home-chapter-nav" aria-label={label} data-tone={tone} data-current-id={activeId} data-expanded={expanded ? "true" : "false"}>
    <button type="button" className="home-chapter-nav__toggle" aria-label={buttonLabel}
      aria-expanded={expanded} aria-controls="home-chapter-list" onClick={() => setExpanded((value) => !value)}>
      <span className="home-chapter-nav__index"><span>{active.index}</span><span> / {String(items.length).padStart(2, "0")}</span></span>
      <span className="home-chapter-nav__current">{active.label}</span>
      <span className="home-chapter-nav__chevron" aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>
    <div className="home-chapter-nav__progress" aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }} /></div>
    <div id="home-chapter-list" className="home-chapter-nav__list" hidden={!expanded}>
      {items.map((item) => <a key={item.id} href={`#${item.id}`} aria-current={activeId === item.id ? "location" : undefined}
        onClick={(event) => {
          event.preventDefault();
          onSelect(item.id);
          document.getElementById(item.id)?.focus({ preventScroll: true });
          setExpanded(false);
        }}>
        <span>{item.index}</span><span>{item.label}</span>
      </a>)}
    </div>
  </nav>;
  return typeof document === "undefined" ? navigation : createPortal(navigation, document.body);
}
