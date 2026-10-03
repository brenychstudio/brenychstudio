import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PublicLocale } from "../../data/projectRegistry.types";
import type { ProductIndexItem } from "./productIndexModel";
import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import PortfolioImage from "../media/PortfolioImage";
import ProductManagedVideo from "./ProductManagedVideo";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";

export default function ProductLivingSurface({ item, locale, number, actions }: {
  item: ProductIndexItem;
  locale: PublicLocale;
  number: string | undefined;
  actions: ReactNode;
}) {
  const visual = item.presentation.visual;
  const material = visual.treatment === "material";
  const { reducedMotion: reduced } = useMobileMotion({ enabled: false });
  const stage = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: material ? 45 : 80, damping: 25 });
  const y = useSpring(pointerY, { stiffness: material ? 45 : 80, damping: 25 });
  const rotateX = useTransform(y, [-1, 1], [material ? 2.6 : 1.6, material ? -2.6 : -1.6]);
  const rotateY = useTransform(x, [-1, 1], [material ? -3.2 : -2, material ? 3.2 : 2]);
  const translateX = useTransform(x, value => material ? value * 10 : 0);
  const translateY = useTransform(y, value => material ? value * 7 : 0);
  const proofX = useSpring(pointerX, { stiffness: 32, damping: 24 });
  const proofY = useSpring(pointerY, { stiffness: 32, damping: 24 });
  const secondaryX = useTransform(proofX, value => material ? value * -4.5 : 0);
  const secondaryY = useTransform(proofY, value => material ? value * -3 : 0);
  const secondaryRotate = useTransform(proofX, value => 2 - (material ? value * .7 : 0));
  const lightX = useTransform(x, [-1, 1], ["20%", "80%"]);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = stage.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(((event.clientX - bounds.left) / bounds.width - .5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - .5) * 2);
  };
  const reset = () => { pointerX.set(0); pointerY.set(0); };
  const ui = locale === "es" ? {
    selected: "Selección pública destacada", digital: "Entorno digital", material: "Superficie material",
    state: "Madurez", access: "Disponibilidad", surface: "Superficie de producto", proof: "Plano de prueba",
    transition: "Del sistema digital a la producción material", physical: "Papel / Imagen / Producción",
  } : {
    selected: "Featured public selection", digital: "Digital environment", material: "Material surface",
    state: "Maturity", access: "Availability", surface: "Product surface", proof: "Proof plane",
    transition: "From digital system to material production", physical: "Paper / Image / Production",
  };

  const dialect = visual.treatment === "generic" ? ui.surface : material ? ui.material : ui.digital;
  return (
    <MobileMotionSection as="section" variant={material ? "media" : "dark"} id={`products-${item.project.id}`} tabIndex={-1}
      className={`product-system-feature product-living-surface product-living-${visual.treatment}`}
      data-product-id={item.project.id} data-product-preset={item.entry.preset}
      data-header-scene={`products-surface-${item.project.id}`} data-surface-tone={visual.tone} aria-labelledby={`featured-${item.project.id}`}>
      {material ? <div className="product-material-transition" aria-hidden="true"><span>{ui.transition}</span><i /><span>↘</span></div> : null}
      <div className="product-system-width product-living-inner">
        <div className="product-system-section-label"><span data-section-number>{number}</span><p>{ui.selected}</p><span className="product-living-dialect">{dialect}</span></div>
        <div className="product-living-heading">
          <div className="product-system-feature-name"><h2 id={`featured-${item.project.id}`}>{visual.titleLines ? visual.titleLines.map(line => <span key={line}>{line}</span>) : item.project.publicName}</h2>
            {material ? <p className="product-living-material-note">{ui.physical}</p> : <div className="product-living-signal" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>}
          </div>
          <div className="product-system-feature-copy"><p>{item.project.copy.oneLiner[locale]}</p>
            <dl className="product-system-metadata">
              <div><dt>{ui.state}</dt><dd><i className="product-living-state-dot" />{item.presentation.stateLabel}</dd></div>
              <div><dt>{ui.access}</dt><dd>{item.presentation.availabilityLabel}</dd></div>
            </dl>
          </div>
        </div>
        {item.presentation.poster ? <div ref={stage} className="product-living-stage" onPointerMove={move} onPointerLeave={reset}>
          {visual.secondary ? <motion.div className="product-living-secondary" aria-hidden="true" style={material ? { x: reduced ? 0 : secondaryX, y: reduced ? 0 : secondaryY, rotate: reduced ? 2 : secondaryRotate } : undefined}>
            <PortfolioImage src={visual.secondary.src} alt="" loading="lazy" sizes="(min-width: 1280px) 700px, 70vw"
              containerClassName="product-living-secondary-image" imageClassName="product-system-poster-bitmap" />
            <span>{ui.proof} / {item.project.publicName}</span>
          </motion.div> : <div className="product-living-grid" aria-hidden="true" />}
          <motion.figure className="product-living-plane" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, ...(material ? {x: reduced ? 0 : translateX, y: reduced ? 0 : translateY} : {}) }}>
            <div className="product-living-plane-edge"><span>{ui.surface}</span><span>{item.project.publicName}</span><span aria-hidden="true">{material ? "+" : "○"}</span></div>
            {visual.walkthrough ? <ProductManagedVideo asset={visual.walkthrough}
              poster={item.presentation.poster.src} alt={item.presentation.poster.alt} locale={locale} /> :
              <PortfolioImage src={item.presentation.poster.src} alt={item.presentation.poster.alt} sizes="(min-width: 1280px) 80vw, 94vw" containerClassName="product-system-poster-image" imageClassName="product-system-poster-bitmap" />}
            <motion.div className="product-living-incident" aria-hidden="true" style={{ backgroundPositionX: lightX }} />
            {material ? <><i className="product-registration product-registration-a" aria-hidden="true" /><i className="product-registration product-registration-b" aria-hidden="true" /></> : null}
          </motion.figure>
        </div> : null}
        <div className="product-system-feature-actions product-living-actions">{actions}<span className="product-living-footnote">{material ? ui.physical : dialect}<span aria-hidden="true">↗</span></span></div>
      </div>
    </MobileMotionSection>
  );
}
