import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useInView } from "framer-motion";
import { getLocalizedPath } from "../../i18n/routes";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";

type SignalGeometry = { width: number; height: number; rails: string[]; axis: string; x: number; from: number; to: number; mobile: boolean };

export default function ProductCommercialClosing({ locale, number, ui, onNavigate }: {
  locale: "en" | "es"; number?: string;
  ui: { commercial: string; commercialTitle: string; commercialBody: string; start: string; work: string };
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);
  const entered = useInView(root, { once: true, amount: .25 });
  const inView = useInView(root, { amount: .01 });
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const [geometry, setGeometry] = useState<SignalGeometry | null>(null);
  const [entrySuppressed, setEntrySuppressed] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const { reducedMotion } = useMobileMotion({ enabled: false });
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const suppress = () => { if (query.matches) setEntrySuppressed(true); };
    query.addEventListener("change", suppress);
    return () => query.removeEventListener("change", suppress);
  }, []);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useLayoutEffect(() => {
    const container = root.current;
    const title = heading.current;
    const action = cta.current;
    if (!container || !title || !action) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const box = container.getBoundingClientRect();
      const actionBox = action.getBoundingClientRect();
      const mobile = window.innerWidth <= 679;
      const sources = Array.from(title.querySelectorAll<HTMLElement>("[data-signal-source]")).map(source => {
        const range = document.createRange();
        range.selectNodeContents(source);
        const rects = Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
        const last = rects[rects.length - 1];
        const baseline = source.querySelector("[data-signal-baseline]")!.getBoundingClientRect();
        return { right: last.right - box.left, furthest: Math.max(...rects.map(rect => rect.right)) - box.left, y: baseline.top - box.top };
      });
      const x = mobile ? actionBox.left - box.left + 16 : Math.min(box.width - 12, Math.max(actionBox.left - box.left + 24, ...sources.map(source => source.furthest + 32)));
      const from = mobile ? title.getBoundingClientRect().bottom - box.top + 14 : sources[sources.length - 1].y;
      const to = actionBox.top - box.top - 18;
      const next = {
        width: box.width, height: box.height, x, from, to, mobile,
        rails: mobile ? [] : sources.map(source => `M ${source.right + 16} ${source.y} H ${x}`),
        axis: `M ${x} ${mobile ? from : sources[0].y} V ${to}`,
      };
      setGeometry(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container); observer.observe(title); observer.observe(action);
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [locale, ui.commercialTitle]);
  return <MobileMotionSection as="section" variant="closing" id="products-commercial" tabIndex={-1} aria-labelledby="products-commercial-heading"
    className="product-system-section product-system-commercial" data-header-scene="products-closing" data-surface-tone="dark">
    <div ref={root} className="product-system-width product-system-closing-inner" data-signal-resolution data-signal-entered={entered} data-signal-running={inView && visible} data-signal-reduced={reducedMotion} data-signal-entry-static={entrySuppressed}>
      <div className="product-system-section-label"><span data-section-number>{number}</span><p>{ui.commercial}</p></div>
      {geometry ? <svg className="product-resolution-signal" viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" data-signal-layout={geometry.mobile ? "vertical" : "three-source"}>
        {geometry.rails.map((path, index) => <path key={index} data-signal-rail d={path} pathLength="1" style={{ "--signal-delay": `${index * 150}ms` } as CSSProperties}/>)}
        <path className="product-resolution-axis" d={geometry.axis} pathLength="1"/>
        <circle className="product-resolution-node" cx={geometry.x} cy={geometry.to} r="2.5"/>
        {!reducedMotion && !entrySuppressed ? <circle className="product-resolution-packet" cx={geometry.x} cy="0" r="2" style={{ "--signal-from": `${geometry.from}px`, "--signal-to": `${geometry.to}px` } as CSSProperties}/> : null}
      </svg> : null}
      <h2 ref={heading} id="products-commercial-heading">{ui.commercialTitle.split(". ").map((phrase,index,phrases)=><span key={phrase}><span data-signal-source>{phrase}{index<phrases.length-1?".":""}<i data-signal-baseline aria-hidden="true"/></span></span>)}</h2>
      <div className="product-system-commercial-bottom"><p className="product-system-body">{ui.commercialBody}</p>
        <div className="product-system-commercial-actions">
          <Link ref={cta} className="product-system-action product-system-action-primary product-resolution-cta" to={getLocalizedPath("/offer",locale)} onClick={onNavigate}>{ui.start}<span className="product-resolution-arrow" aria-hidden="true"><span>↗</span></span></Link>
          <Link className="product-system-action" to={getLocalizedPath("/work",locale)} onClick={onNavigate}>{ui.work}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </div>
  </MobileMotionSection>;
}
