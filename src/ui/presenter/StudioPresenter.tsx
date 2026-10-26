import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { usePresenter } from "./presenterContext";
import Disclosure from "./PresenterDisclosure";
import { presenterIdleClip, presenterRestFrame, presenterSeal } from "./presenterMedia";

// Two layouts, both measured from the live hero instead of fixed offsets:
//  "field" – roomy desktops: the presenter lives in the hero's free right field (headline edge → chapter rail,
//            kicker row → hero buttons). Closed it is a small portrait; open, the same plate grows into the stage.
//  "flow"  – phones, tablets, narrow or short desktops: a profile byline in the hero column; open, the stage
//            unfolds in place and the page simply grows (nothing is laid over the hero, rail or sound dock).
const FIELD_QUERY = "(min-width: 1280px) and (min-height: 640px)";
const RAIL_GAP = 24;
const FLOOR_GAP = 32;
const SOUND_GAP = 16;
const HEADER_CLEARANCE = 88;
// SoundSignalDock's fixed wrapper (it has no hook of its own; its z-index is unique on the page).
const SOUND_DOCK = 'div.fixed[class*="z-[72]"]';
const COLUMN_GAP = 40;
const STACK_GAP = 24;
const TEXT_MIN = 150;
const TEXT_MAX = 440;
const PLATE_MIN = 150;
const PLATE_MAX_H = 780;
const COLUMNS_MIN_FIELD = 820;
// Bar, intro and the pending line above the questions in the "columns" text column.
const COLUMN_TEXT_H = 190;
const PLATE_SIZES = "(min-width: 1280px) 640px, 240px";

type Field = { x: number; y: number; w: number; h: number; capsule: number };
type Stage = { variant: "columns" | "stacked"; plateW: number; textW: number };

function measureField(root: HTMLElement | null): Field | null {
  const hero = root?.closest<HTMLElement>(".eco-hero-content");
  if (!hero || !window.matchMedia(FIELD_QUERY).matches) return null;
  const wrap = hero.getBoundingClientRect();
  const range = document.createRange();
  let headline = wrap.left;
  hero.querySelectorAll("h1 > span").forEach((line) => {
    range.selectNodeContents(line);
    headline = Math.max(headline, range.getBoundingClientRect().right);
  });
  const viewport = document.documentElement.clientWidth;
  const rail = document.querySelector<HTMLElement>(".home-section-rail")?.getBoundingClientRect();
  const kicker = hero.querySelector(".eco-label")?.getBoundingClientRect();
  const left = headline + Math.min(96, Math.max(40, viewport * 0.035));
  // Without a rail the field mirrors the page's left margin.
  const right = rail && rail.width > 0 ? rail.left - RAIL_GAP : viewport - (wrap.left);
  let floor = hero.querySelector(".eco-hero-actions")?.getBoundingClientRect().top ?? wrap.bottom;
  // The sound dock (fixed, bottom right) keeps its corner: on short screens the field ends 16px above it, measured in
  // the hero's first-view frame (the dock is fixed, the hero scrolls).
  const sound = document.querySelector<HTMLElement>(SOUND_DOCK)?.getBoundingClientRect();
  if (sound && sound.width > 0 && sound.left < right) floor = Math.min(floor, sound.top - window.scrollY - SOUND_GAP + FLOOR_GAP);
  const top = kicker?.top ?? wrap.top;
  const w = Math.floor(right - left);
  const h = Math.floor(floor - FLOOR_GAP - top);
  if (w < PLATE_MIN + STACK_GAP + TEXT_MIN || h < 420) return null;
  return { x: Math.round(left - wrap.left), y: Math.round(top - wrap.top), w, h, capsule: Math.round(Math.min(128, Math.max(84, w * 0.11))) };
}

// The stage: the plate keeps the capsule's top-right anchor and grows; the text column sits beside it. Questions
// share that column when the field is wide ("columns"), or run under the plate across the field ("stacked").
function fitStage(field: Field, listHeight: number): Stage | null {
  const capH = Math.min(PLATE_MAX_H, window.innerHeight * 0.64);
  if (field.w >= COLUMNS_MIN_FIELD) {
    let plateH = Math.min(field.h, capH);
    if (field.w - COLUMN_GAP - plateH * 0.8 < 280) plateH = (field.w - COLUMN_GAP - 280) * 1.25;
    const plateW = Math.floor(plateH * 0.8);
    // Beside the plate the column holds the bar, the intro and the questions; on a short screen they go under it.
    // The list is measured across the field; in the narrower column its questions wrap more (margin 1.35).
    if (plateH >= listHeight * 1.35 + COLUMN_TEXT_H) return { variant: "columns", plateW, textW: Math.min(TEXT_MAX, field.w - COLUMN_GAP - plateW) };
  }
  const plateH = Math.min(capH, field.h - listHeight - STACK_GAP);
  const plateW = Math.floor(Math.min(plateH * 0.8, field.w - STACK_GAP - TEXT_MIN));
  return plateW >= PLATE_MIN ? { variant: "stacked", plateW, textW: field.w - STACK_GAP - plateW } : null;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** HOME hero presence: a portrait that opens into the presenter stage with the curated questions. */
export default function StudioPresenter() {
  const { state, copy, locale, open, close, select, registerTrigger, registerStagePlate, mountMedia, engage } = usePresenter();
  const [field, setField] = useState<Field | null | undefined>(() => (window.matchMedia(FIELD_QUERY).matches ? undefined : null));
  // The fitted stage for one measured field; null when that field cannot hold a real stage.
  const [stage, setStage] = useState<{ field: Field; fit: Stage | null } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const frozenRef = useRef(false);
  const stageId = useId();
  const isOpen = state.phase === "idle_open";
  const fitted = field && stage?.field === field ? stage.fit : undefined;
  // A field too small for a real stage opens in the hero column instead.
  const layout = field === undefined ? "pending" : field && !(isOpen && fitted === null) ? "field" : "flow";
  const fieldStage = isOpen && layout === "field" && fitted ? fitted : null;

  useEffect(() => {
    registerTrigger(toggleRef.current);
    registerStagePlate(plateRef.current);
    return () => {
      registerTrigger(null);
      registerStagePlate(null);
    };
  }, [registerTrigger, registerStagePlate]);

  // Field geometry follows the live hero: viewport, fonts, locale, and the chapter rail, which mounts after the hero
  // and whose label width changes with the locale. Opening always re-measures. While the stage is open in the column
  // the hero is taller than its own first view (and the sound dock steps aside), so the closed measurement is kept.
  useEffect(() => { frozenRef.current = isOpen && layout === "flow"; });
  useEffect(() => {
    let frame = 0;
    let disposed = false;
    let watched: Element | null = null;
    const resize = new ResizeObserver(() => update());
    const update = () => {
      if (disposed) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (frozenRef.current) return;
        const rail = document.querySelector(".home-section-rail");
        if (rail !== watched) {
          if (watched) resize.unobserve(watched);
          if (rail) resize.observe(rail);
          watched = rail;
        }
        setField((previous) => {
          const next = measureField(rootRef.current);
          return previous && next && Object.keys(next).every((key) => previous[key as keyof Field] === next[key as keyof Field]) ? previous : next;
        });
      });
    };
    // The deferred rail can mount after every initial measurement on a cold route.
    // Its portal is a direct body child; subscribe to its arrival before observing its size.
    const railMount = new MutationObserver(() => {
      if (document.querySelector(".home-section-rail") !== watched) update();
    });
    railMount.observe(document.body, { childList: true });
    update();
    const timers = [250, 900, 2400].map((delay) => window.setTimeout(update, delay));
    document.fonts?.ready.then(update);
    window.addEventListener("resize", update);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      resize.disconnect();
      railMount.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [locale, isOpen]);

  // The stage size needs the rendered question list (its height depends on the locale and the field width).
  useEffect(() => {
    if (!isOpen || !field) return;
    const frame = window.requestAnimationFrame(() => setStage({ field, fit: fitStage(field, listRef.current?.offsetHeight ?? 228) }));
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, field, locale]);

  // Opened in the column, the stage can start under the fold (short screens, long Spanish headline): bring it into
  // view, never further than its own top under the header.
  useEffect(() => {
    if (!isOpen || layout !== "flow") return;
    const frame = window.requestAnimationFrame(() => {
      const box = rootRef.current?.getBoundingClientRect();
      if (!box || box.bottom <= window.innerHeight - 16) return;
      const by = Math.min(box.top - HEADER_CLEARANCE, box.bottom - window.innerHeight + 24);
      if (by > 0) window.scrollBy({ top: by, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, layout]);

  // The open stage carries the idle loop; the dock takes it over while an answer runs.
  useLayoutEffect(() => {
    const plate = plateRef.current;
    return isOpen && plate ? mountMedia(plate) : undefined;
  }, [isOpen, mountMedia, layout]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !isOpen) return;
    event.stopPropagation();
    close(true);
  };

  const vars = layout === "field" && field ? {
    "--field-x": `${field.x}px`, "--field-y": `${field.y}px`, "--field-w": `${field.w}px`, "--field-h": `${field.h}px`,
    "--plate-w": `${fieldStage ? fieldStage.plateW : field.capsule}px`, "--text-w": `${fieldStage ? fieldStage.textW : 0}px`,
  } as CSSProperties : undefined;

  return <div ref={rootRef} className="studio-presence" data-layout={layout} data-open={isOpen ? "" : undefined}
    data-variant={fieldStage?.variant} style={vars} onKeyDown={onKeyDown}>
    <div ref={plateRef} className="studio-presence__plate" aria-hidden="true">
      <img src={presenterRestFrame.src} srcSet={presenterRestFrame.srcSet} sizes={PLATE_SIZES}
        width={presenterRestFrame.width} height={presenterRestFrame.height} alt="" decoding="async" />
    </div>
    <div className="studio-presence__column">
      <div className="studio-presence__bar">
        {isOpen && <p className="studio-presence__disclosure"><Disclosure text={copy.disclosure} /></p>}
        <button ref={toggleRef} type="button" className="studio-presence__toggle" aria-expanded={isOpen}
          aria-controls={isOpen ? stageId : undefined} onClick={() => (isOpen ? close() : open())}
          onPointerEnter={engage} onFocus={engage}>
          {isOpen
            ? <>{copy.close}<span aria-hidden="true" className="studio-presence__x">×</span></>
            : <><span className="studio-presence__seal"><img src={presenterSeal} alt="" width={52} height={52} /></span>
              <span className="studio-presence__trigger-text">
                <span className="studio-presence__trigger-title">{copy.trigger}</span>
                <span className="studio-presence__trigger-meta"><Disclosure text={copy.disclosure} /></span>
              </span></>}
        </button>
      </div>
      {isOpen && <p className="studio-presence__intro">{copy.intro}</p>}
      {isOpen && !presenterIdleClip && <p className="studio-presence__pending">{copy.media.pending.split(" · ")[0]}</p>}
    </div>
    {/* In the column the list can scroll under the fixed sound dock: the site's safe-area contract moves the dock aside. */}
    {isOpen && <ol ref={listRef} id={stageId} className="studio-presence__index" aria-label={copy.questions} lang={locale}
      data-sound-safe-area={layout === "flow" ? "" : undefined}>
      {copy.answers.map((item, index) => <li key={item.id}>
        <button type="button" className="studio-presence__question" onClick={() => select(item.id)}>
          <span aria-hidden="true">{pad(index + 1)}</span><span>{item.question}</span>
        </button>
      </li>)}
    </ol>}
  </div>;
}
