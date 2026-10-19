import { useId, useLayoutEffect, useRef } from "react";
import { getLocalizedPath } from "../../i18n";
import { homeCopy } from "./homeCopy";
import {
  CLOSING_MOTION, closingFinal, closingPlan, closingState, crestRise, floorSegments, horizonPoints, polylinePath, segmentsPath,
  type ClosingLayout, type ClosingPlan, type ClosingState,
} from "./homeCollaborationModel";
import { Arrow, HomeLink, HomeSection, SectionLabel, type HomeSectionProps } from "./HomePrimitives";

const ANIMATED_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/** Section 07 — Final Exposure / Spatial Horizon (HOME-COMPLETION-01E-FIX1). The end title as a full-field composition on the
 *  warm paper 06 releases into: two authored lines (the second offset towards the centre), one horizon across the safe field
 *  with a shallow floor converging on 06's hill crest, the body in the lower-left editorial zone and the real actions — the
 *  existing project drawer and the localized Offer — in their own right-hand column, usable from first paint. */
export default function EcosystemCollaboration({ locale, navigate, onOpenProject }: HomeSectionProps & { onOpenProject?: () => void }) {
  const copy = homeCopy[locale];
  const [lineA, lineB] = copy.closingTitle.split("\n");
  const sentences = copy.closingBody.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()) ?? [copy.closingBody];
  const gradientId = `eco-fx-floor${useId().replace(/:/g, "")}`;
  const innerRef = useRef<HTMLDivElement>(null), titleRef = useRef<HTMLHeadingElement>(null), sentinelRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLDivElement>(null), rowRef = useRef<HTMLDivElement>(null), trackRef = useRef<HTMLDivElement>(null), svgRef = useRef<SVGSVGElement>(null);
  const ruleRef = useRef<SVGPathElement>(null), floorRef = useRef<SVGPathElement>(null), gradientRef = useRef<SVGLinearGradientElement>(null);

  // One finite writer. Layout is measured once per size (untransformed). The horizon's position needs no writes at all: the
  // drawing sits in a track from its arrival line to its slot and is sticky at the hold line, which is exactly the model's
  // h = clamp(target − sectionTop, h0, hf), held by the browser on the compositor. The writer only reshapes crest and floor
  // and moves the title lines and the row, from the model, and writes nothing unless the (quantized) state changed. Scroll
  // is observed only while the section's top edge is in the moving range — between the viewport bottom and `landing` — via
  // a 1px sentinel on that edge and an IntersectionObserver with the viewport's top `landing` px cut off; past it every
  // value is final, so the hold and the hash target are static.
  useLayoutEffect(() => {
    const inner = innerRef.current, section = inner?.parentElement, title = titleRef.current, sentinel = sentinelRef.current;
    const slot = slotRef.current, row = rowRef.current, track = trackRef.current, svg = svgRef.current, rule = ruleRef.current, floor = floorRef.current, gradient = gradientRef.current;
    const label = inner?.querySelector<HTMLElement>(".eco-label");
    if (!inner || !section || !title || !sentinel || !slot || !row || !track || !svg || !rule || !floor || !gradient || !label) return;
    const lines = [...title.children] as HTMLElement[];
    const animated = window.matchMedia(ANIMATED_QUERY);
    let layout: ClosingLayout | null = null, plan: ClosingPlan | null = null, width = 0, rise = 0, alive = true;
    let frame = 0, measureFrame = 0, last = "", lastShape = "", listening = false, moving = false, io: IntersectionObserver | null = null, margin = "";

    const glyphBox = (el: HTMLElement) => {
      const text = el.firstChild, rect = text?.nodeType === Node.TEXT_NODE ? (() => { const r = document.createRange(); r.selectNodeContents(text); return r.getBoundingClientRect(); })() : el.getBoundingClientRect();
      return rect.height ? rect : el.getBoundingClientRect();
    };
    // Values are quantized once; the change keys and the written styles both come from the quantized values, so a
    // position writes the same DOM whichever direction it is reached from.
    const q = (v: number, step: number) => Math.round(v / step) * step;
    const shape = (s: ClosingState) => {
      const pitch = q(s.pitch, 0.001), band = q(s.band, 0.1), key = `${width}|${pitch.toFixed(3)}|${band.toFixed(1)}`;
      if (key === lastShape) return;
      lastShape = key;
      rule.setAttribute("d", polylinePath(horizonPoints(width, rise, pitch)));
      floor.setAttribute("d", segmentsPath(floorSegments(width, rise, band)));
      gradient.setAttribute("y1", String(rise)); gradient.setAttribute("y2", (rise + Math.max(1, band)).toFixed(1));
    };
    const write = (s: ClosingState) => {
      shape(s);
      const vs = s.lines.map((v) => q(v, 0.001)), rv = q(s.row, 0.001), key = `${vs.map((v) => v.toFixed(3)).join(",")}|${rv.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const shift = plan?.shift ?? 0, r = CLOSING_MOTION.row;
      lines.forEach((el, i) => {
        const v = vs[i] ?? 1;
        el.style.opacity = v < 1 ? v.toFixed(3) : "";
        el.style.transform = v < 1 ? `translateY(${((1 - v) * shift).toFixed(2)}px)` : "";
      });
      row.style.opacity = rv < 1 ? (r.opacity + (1 - r.opacity) * rv).toFixed(3) : "";
      row.style.transform = rv < 1 ? `translateY(${(r.shift * (1 - rv)).toFixed(2)}px)` : "";
    };
    const apply = () => { frame = 0; if (alive && layout) write(plan ? closingState(plan, section.getBoundingClientRect().top) : closingFinal(layout)); };
    const request = () => { if (!frame) frame = requestAnimationFrame(apply); };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) window.addEventListener("scroll", request, { passive: true }); else window.removeEventListener("scroll", request);
    };
    const sync = () => { if (alive) { listen(moving && plan !== null); apply(); } };
    const measure = () => {
      for (const el of lines) { el.style.transform = ""; el.style.opacity = ""; }
      row.style.transform = ""; row.style.opacity = "";
      last = ""; lastShape = "";
      const top = section.getBoundingClientRect().top, box = slot.getBoundingClientRect();
      // the drawing spans the safe field and, like 06's art, stops 24px short of the rendered Rail (wider than its reserve);
      // offsetLeft ignores the Rail's own translate while it fades out near the Footer
      const rail = document.querySelector<HTMLElement>(".home-section-rail");
      const railLeft = rail && rail.offsetWidth ? rail.offsetLeft : Infinity;
      width = Math.floor(Math.min(inner.clientWidth, railLeft - 24 - inner.getBoundingClientRect().left)); rise = crestRise(width) + 2;
      layout = {
        viewportHeight: window.innerHeight, labelBottom: label.getBoundingClientRect().bottom - top,
        lines: lines.map((el) => ({ bottom: glyphBox(el).bottom - top })),
        font: parseFloat(getComputedStyle(title).fontSize) || 0, horizon: box.top - top, band: box.height, rowTop: row.getBoundingClientRect().top - top,
      };
      plan = animated.matches ? closingPlan(layout) : null;
      const height = Math.ceil(rise + (plan ? plan.bandCap : layout.band) + 2);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.setAttribute("width", String(width)); svg.setAttribute("height", String(height));
      // the track runs from the arrival line (h0) to the slot (hf); the sticky drawing puts its rule on `target` meanwhile
      const h0 = plan ? plan.h0 : layout.horizon;
      track.style.top = `${(h0 - rise).toFixed(1)}px`; track.style.width = `${width}px`;
      track.style.height = `${(layout.horizon - h0 + height).toFixed(1)}px`;
      svg.style.top = plan ? `${(plan.target - rise).toFixed(1)}px` : "";
      const next = plan ? `-${Math.max(0, Math.floor(plan.landing))}px 0px 0px 0px` : "";
      if (next !== margin) {
        io?.disconnect(); io = null; margin = next; moving = false;
        if (plan) { io = new IntersectionObserver(([entry]) => { if (!alive) return; moving = entry.isIntersecting; sync(); }, { rootMargin: margin }); io.observe(sentinel); }
      }
    };
    const remeasure = () => { if (alive) { measure(); sync(); } };
    const scheduleMeasure = () => { if (alive && !measureFrame) measureFrame = requestAnimationFrame(() => { measureFrame = 0; remeasure(); }); };
    remeasure();
    // A jump across the whole moving range in one frame (End key, instant navigation, scrollbar drag) never changes the
    // sentinel's state; the section coming within half a viewport of the screen (or leaving it) still does, and this
    // callback lands the right end state — before the section is visible when it is approached by scrolling, one or two
    // frames late after an instant jump straight into view. On entry it also re-measures (the Rail's labels and the
    // title change width with the locale, fonts may swap). It never arms the scroll listener.
    const seen = new IntersectionObserver(([entry]) => { if (!alive) return; apply(); if (entry.isIntersecting) scheduleMeasure(); }, { rootMargin: "50% 0px 50% 0px" });
    seen.observe(section);
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(inner);
    animated.addEventListener("change", scheduleMeasure);
    window.addEventListener("resize", scheduleMeasure);   // the hold line depends on the viewport height
    document.fonts?.ready.then(scheduleMeasure);
    return () => {
      alive = false; cancelAnimationFrame(frame); cancelAnimationFrame(measureFrame); listen(false); io?.disconnect(); seen.disconnect(); ro.disconnect();
      animated.removeEventListener("change", scheduleMeasure); window.removeEventListener("resize", scheduleMeasure);
      row.style.transform = ""; row.style.opacity = "";
      for (const el of lines) { el.style.transform = ""; el.style.opacity = ""; }
    };
  }, []);

  return <HomeSection id="collaboration" className="eco-fx">
    <span ref={sentinelRef} className="eco-fx-sentinel" aria-hidden="true" />
    <div ref={trackRef} className="eco-fx-track" aria-hidden="true">
      <svg ref={svgRef} className="eco-fx-horizon-art" focusable="false">
        <defs>
          <linearGradient ref={gradientRef} id={gradientId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" className="eco-fx-floor-far" /><stop offset="1" className="eco-fx-floor-near" />
          </linearGradient>
        </defs>
        <path ref={floorRef} className="eco-fx-floor" stroke={`url(#${gradientId})`} />
        <path ref={ruleRef} className="eco-fx-rule" />
      </svg>
    </div>
    <div ref={innerRef} className="eco-fx-inner">
      <div className="eco-fx-stage">
        <SectionLabel number="07">{copy.closing}</SectionLabel>
        <h2 ref={titleRef} id="collaboration-title" className="eco-fx-title"><span>{lineA}</span> <span>{lineB}</span></h2>
        <div ref={slotRef} className="eco-fx-horizon" aria-hidden="true" />
        <div ref={rowRef} className="eco-fx-row">
          <p className="eco-fx-body">{sentences.map((s, i) => <span key={i}>{i ? " " : ""}{s}</span>)}</p>
          <div className="eco-fx-actions" data-sound-safe-area="">
            <button type="button" className="eco-button eco-fx-cta" onClick={onOpenProject} aria-haspopup="dialog">{copy.start}<Arrow /></button>
            <HomeLink href={getLocalizedPath("/offer", locale)} navigate={navigate} className="eco-text-link eco-fx-offer">{copy.offer}<Arrow /></HomeLink>
          </div>
        </div>
      </div>
    </div>
  </HomeSection>;
}
