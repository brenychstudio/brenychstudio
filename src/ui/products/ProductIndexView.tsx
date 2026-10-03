import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";




import MobileMotionSection from "../mobile-motion/MobileMotionSection";
import { startSpaPageTransition } from "../pageTransition";

import ProductLivingSurface from "./ProductLivingSurface";
import { ProductMediaProvider } from "./ProductManagedVideo";
import ProductSystemTopology from "./ProductSystemTopology";

import type { ProductIndexModel } from "./productIndexModel";
import ProductThresholdDeck from "./ProductThresholdDeck";
import ProductRegister from "./ProductRegister";
import ProductCommercialClosing from "./ProductCommercialClosing";

const copy = {
  en: {
    eyebrow: "PRODUCT SYSTEM / 01",
    title: "Products built inside the studio.",
    intro: "Software, creative tools and controlled systems developed through real studio workflows — presented with their current state, evidence and access boundary intact.",
    location: "Brenych Studio / Barcelona / Product engineering + creative technology",
    featured: "Featured public selection", index: "Public surface register", development: "Development field", studio: "Studio system", commercial: "Commercial route",
    state: "Maturity", access: "Availability", evidence: "View evidence", live: "Live proof", sections: "Product surfaces",
    systemTitle: "One studio, multiple product surfaces.",
    surfaces: ["Products", "Research / Infrastructure", "Spatial / Interactive", "Games / Worlds"],
    systemBody: "Products are one public layer of the studio. Research systems, spatial work and authored worlds remain distinct surfaces, connected by shared technical and visual foundations.",
    commercialTitle: "Use a product. Adapt a system. Build something new.",
    commercialBody: "Some products are public, some are controlled, and some become starting points for commissioned work.",
    start: "Start a project", work: "View work", publicIndex: "Public product surface", poster: "Product surface",
    enter: "Enter surface", field: "Connected by the studio. Distinct by design.", signal: "Studio signal", digital: "Digital / System", material: "Material / Production",
  },
  es: {
    eyebrow: "SISTEMA DE PRODUCTOS / 01",
    title: "Productos desarrollados dentro del estudio.",
    intro: "Software, herramientas creativas y sistemas controlados desarrollados a partir de workflows reales del estudio, presentados con su estado, evidencia y límites de acceso actuales.",
    location: "Brenych Studio / Barcelona / Ingeniería de producto + tecnología creativa",
    featured: "Selección pública destacada", index: "Registro de superficies públicas", development: "Campo de desarrollo", studio: "Sistema del estudio", commercial: "Ruta comercial",
    state: "Madurez", access: "Disponibilidad", evidence: "Ver evidencia", live: "Demo pública", sections: "Superficies de producto",
    systemTitle: "Un estudio, múltiples superficies de producto.",
    surfaces: ["Productos", "Investigación / Infraestructura", "Espacial / Interactivo", "Juegos / Mundos"],
    systemBody: "Los productos son una capa pública del estudio. Los sistemas de investigación, el trabajo espacial y los mundos de autor permanecen como superficies distintas conectadas por fundamentos técnicos y visuales compartidos.",
    commercialTitle: "Usa un producto. Adapta un sistema. Construye algo nuevo.",
    commercialBody: "Algunos productos son públicos, otros tienen acceso controlado y otros pueden convertirse en el punto de partida de un proyecto por encargo.",
    start: "Iniciar un proyecto", work: "Ver trabajo", publicIndex: "Superficie pública de productos", poster: "Superficie de producto",
    enter: "Entrar en la superficie", field: "Conectados por el estudio. Distintos por diseño.", signal: "Señal del estudio", digital: "Digital / Sistema", material: "Material / Producción",
  },
};

export default function ProductIndexView({ model, onSurface, revealProductId, revealKey, onCloseProject }: {
  model: ProductIndexModel;
  onSurface: (event: MouseEvent<HTMLAnchorElement>) => void;
  revealProductId: string | null;
  revealKey: string;
  onCloseProject?: () => void;
}) {
  const { locale, featured } = model;
  const ui = copy[locale];
  const navigate = useNavigate();
  const sectionNumber = (id: string) => model.chapters.find(section => section.id === id)?.index;
  const onNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    startSpaPageTransition(navigate, event.currentTarget.getAttribute("href")!, onCloseProject);
  };
  const proofAction = (item: ProductIndexModel["items"][number]) => item.presentation.proofPath ? (
    <Link className="product-system-action" to={item.presentation.proofPath} onClick={onNavigate}>
      {ui.evidence}<span aria-hidden="true">↗</span>
    </Link>
  ) : null;

  return (
    <main className="product-system-main" lang={locale} data-header-scene="products-threshold">
      <MobileMotionSection as="section" variant="threshold" id="products-threshold" tabIndex={-1}
        aria-labelledby="products-heading" className="product-system-threshold product-system-width" data-header-scene="products-threshold">
        <div className="product-system-threshold-top product-system-micro">
          <p><span data-section-number>{sectionNumber("products-threshold")}</span> / {ui.publicIndex}</p><p>Brenych Studio</p>
        </div>
        <div className="product-system-entry-grid">
          <div className="product-system-entry-copy"><h1 id="products-heading">{ui.title}</h1><p className="product-system-intro">{ui.intro}</p></div>
          <ProductThresholdDeck model={model} onSurface={onSurface} />
        </div>
        <div className="product-system-threshold-bottom">
          <p className="product-system-location product-system-micro">{ui.location}</p>
          <div className="product-threshold-actions"><a href="#products-index" onClick={onSurface}>{locale === "es" ? "Ver todos los productos" : "View all products"}</a>
          <a className="product-system-entry-direction" href={featured.length ? "#products-featured" : "#products-index"} onClick={onSurface} aria-label={locale === "es" ? (featured.length ? "Explorar productos destacados" : "Explorar registro de productos") : (featured.length ? "Explore featured products" : "Explore product register")}><span aria-hidden="true">↓</span></a></div>
        </div>
      </MobileMotionSection>

      <ProductMediaProvider>{featured.length ? <div id="products-featured" tabIndex={-1}>
        <nav className="product-featured-nav product-system-width" aria-label={ui.featured}>{featured.map(item => <a key={item.project.id} href={`#products-${item.project.id}`} onClick={onSurface}>{item.project.publicName}<span aria-hidden="true">↓</span></a>)}<a href="#products-index" onClick={onSurface}>{locale === "es" ? "Ver todos" : "View all"}<span aria-hidden="true">↗</span></a></nav>
        {featured.map(item => <ProductLivingSurface key={item.project.id} item={item} locale={locale}
          number={sectionNumber("products-featured")} actions={<>
            {proofAction(item)}
            {item.presentation.liveHref ? <a className="product-system-action" href={item.presentation.liveHref} target="_blank" rel="noopener noreferrer">
              {ui.live}<span aria-hidden="true">↗</span></a> : null}
          </>} />)}
      </div> : null}</ProductMediaProvider>

      <MobileMotionSection as="section" variant="ledger" id="products-index" tabIndex={-1} aria-labelledby="products-index-heading"
        className="product-system-section product-system-width product-system-register" data-header-scene="products-system">
        <div className="product-system-section-label"><span data-section-number>{sectionNumber("products-index")}</span><h2 id="products-index-heading">{ui.index}</h2></div>
        <ProductRegister model={model} revealProductId={revealProductId} revealKey={revealKey} onSurface={onSurface} onNavigate={onNavigate} />
      </MobileMotionSection>

      <MobileMotionSection as="section" variant="ledger" id="products-studio" tabIndex={-1} aria-labelledby="products-studio-heading"
        className="product-system-section product-system-width product-system-studio" data-header-scene="products-system">
        <div className="product-system-section-label"><span data-section-number>{sectionNumber("products-studio")}</span><p>{ui.studio}</p></div>
        <div className="product-system-studio-grid"><div><h2 id="products-studio-heading">{ui.systemTitle}</h2><p className="product-system-body">{ui.systemBody}</p></div>
        </div>
        <ProductSystemTopology model={model} onNavigate={onNavigate} onSurface={onSurface} />
      </MobileMotionSection>

      <ProductCommercialClosing locale={locale} number={sectionNumber("products-commercial")} ui={ui} onNavigate={onNavigate}/>
    </main>
  );
}
