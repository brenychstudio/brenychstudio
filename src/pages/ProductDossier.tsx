import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SiteFooterV2 from "../ui/SiteFooterV2";
import SeoMeta from "../ui/SeoMeta";
import { getSeoAlternates } from "../seo/alternates";
import { useI18n } from "../i18n";
import { dossierUi, getDossierPath, type DossierImage, type ProductDossier as Dossier } from "../data/productDossiers";
import { getPublishedDossierProducts } from "../data/productCatalog";
import { formatDemoDuration, technologyLabel } from "../data/productDossierModel";
import type { PublicLocale } from "../data/projectRegistry.types";
import { resolveVideoAsset } from "../media/video/videoResolver";
import "../ui/products/productDossier.css";

type Props = { drawerOpen?: boolean; onOpenProject?: () => void; onCloseProject?: () => void };
function DossierBody({ product, locale, ...props }: Props & {product:Dossier;locale:PublicLocale}) {
  const copy = product.locales[locale], ui = dossierUi[locale];
  const [selected, setSelected] = useState<DossierImage | null>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const previousOverflow = useRef("");
  const ownsScrollLock = useRef(false);
  // Playback follows only an explicit press of Play recording, never the hero anchor.
  useEffect(() => { if (videoStarted) void player.current?.play().catch(() => { /* Native controls remain available. */ }); }, [videoStarted]);
  useEffect(() => () => { if (ownsScrollLock.current) document.body.style.overflow = previousOverflow.current; }, []);
  useEffect(() => {
    const pause = () => { if (document.hidden) player.current?.pause(); };
    document.addEventListener("visibilitychange",pause);
    return () => document.removeEventListener("visibilitychange",pause);
  }, []);
  const openImage = (image:DossierImage, button:HTMLButtonElement) => {
    player.current?.pause(); opener.current = button; setSelected(image);
    previousOverflow.current = document.body.style.overflow;
    ownsScrollLock.current = true; document.body.style.overflow = "hidden"; dialog.current?.showModal();
  };
  const closeImage = () => {
    dialog.current?.close(); setSelected(null);
    document.body.style.overflow = previousOverflow.current; ownsScrollLock.current = false; opener.current?.focus();
  };
  const visual = (image:DossierImage, hero=false) => <figure className={hero?"dossier-hero-image":"dossier-study"} key={image.id}>
    {image.evidenceLabel&&<p className="dossier-evidence-label">{image.evidenceLabel[locale]}</p>}
    <button className="dossier-image-button" onClick={e=>openImage(image,e.currentTarget)} aria-label={`${ui.enlarge}: ${image.alt[locale]}`}>
      <img src={image.src} srcSet={image.srcSet} sizes={hero?"(min-width: 1100px) 62vw, 94vw":"(min-width: 900px) 60vw, 94vw"} width={image.width} height={image.height} alt={image.alt[locale]} loading={hero?"eager":"lazy"} fetchPriority={hero?"high":undefined} decoding="async" />
      <span className="dossier-enlarge" aria-hidden="true">↗</span>
    </button>
    <figcaption>{image.caption[locale]}<span>{ui.enlarge} ↗</span></figcaption>
  </figure>;
  const path = getDossierPath(product.slug,locale);
  return <>
    <SeoMeta title={copy.seoTitle} description={copy.seoDescription} path={path} image={`/product-media/${product.slug}/social.webp`} imageAlt={product.hero.alt[locale]} alternates={getSeoAlternates(path)} type="article" />
    <Header {...props}/>
    <PageSurface className={`dossier-surface dossier-${product.composition}`}>
      <main className="dossier" lang={locale} data-header-scene="products-threshold">
        <div className="dossier-topline"><Link to={`${locale==="es"?"/es":""}/products#studio-collection`}>← {ui.archive}</Link></div>
        <section className="dossier-hero" aria-labelledby="dossier-title">
          <div className="dossier-hero-copy">
            <p className="dossier-kicker">{copy.category}</p>
            <h1 id="dossier-title">{product.shortName}</h1>
            <p className="dossier-headline">{copy.headline}</p>
            <p className="dossier-summary">{copy.summary}</p>
            <a className="dossier-action dossier-demo-cta" href={product.video?"#recorded-demo":"#demonstration"}>{product.video?ui.watchDemo:ui.exploreCase} {product.video&&<span className="dossier-runtime">{formatDemoDuration(product.video.duration)}</span>}<span aria-hidden="true">↓</span></a>
            <p className="dossier-stage"><span aria-hidden="true"/>{copy.stage}</p>
          </div>
          {visual(product.hero,true)}
        </section>
        <nav className="dossier-chapters" aria-label={locale==="es"?"Secciones del producto":"Product sections"}>
          {[['overview',ui.overview],['capabilities',ui.capabilities],['demonstration',ui.demonstration],['status',ui.status]].map(([id,label],i)=><a key={id} href={`#${id}`}><span>0{i+1}</span>{label}</a>)}
        </nav>
        <section id="overview" className="dossier-section dossier-overview">
          <div><p className="dossier-kicker">01 / {ui.overview}</p><h2>{copy.overviewTitle}</h2></div>
          <div className="dossier-prose"><p>{copy.problem}</p><p>{copy.solution}</p><div className="dossier-audience"><h3>{ui.audience}</h3><p>{copy.audience}</p></div></div>
        </section>
        <section id="capabilities" className="dossier-section">
          <p className="dossier-kicker">02 / {ui.capabilities}</p>
          <div className="dossier-capabilities">{copy.capabilities.map((item,i)=><article key={item.title}><span className="dossier-cap-number">0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
        </section>
        <section id="demonstration" className="dossier-section dossier-demonstration">
          <p className="dossier-kicker">03 / {ui.demonstration}</p><h2>{copy.galleryTitle}</h2>
          <div className="dossier-studies">{product.gallery.map(img=>visual(img))}</div>
          {product.evidence&&<div className="dossier-evidence-grid">{product.evidence[locale].map((item,i)=><article key={item.title}><span className="dossier-kicker">0{i+1} / {ui.documented}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>}
          {product.video ? <div className="dossier-recording" id="recorded-demo">
            <div className="dossier-recording-title"><h3>{ui.recording}</h3><span>{formatDemoDuration(product.video.duration)}</span></div>
            {videoStarted ? <video ref={player} controls playsInline preload="metadata" src={resolveVideoAsset(product.video.assetId)} poster={product.video.poster} aria-label={ui.recording} aria-describedby="recording-description" onError={()=>setVideoError(true)} />
              : <button className="dossier-video-launch" onClick={()=>setVideoStarted(true)} aria-label={ui.play}>
                <img src={product.video.poster} alt="" loading="lazy" width="1280" height={product.composition==="learning"?801:720}/><span><span aria-hidden="true">▶</span> {ui.play}</span>
              </button>}
            {videoError && <p role="alert">{locale==="es"?"No se pudo cargar el vídeo. Las imágenes y la descripción siguen disponibles.":"The video could not be loaded. The images and description remain available."}</p>}
            <p className="dossier-evidence-note">{copy.videoCaption}</p>
            <details id="recording-description"><summary>{ui.transcript}</summary><p>{copy.videoDescription}</p></details>
          </div> : <aside className="dossier-demo-availability"><h3>{ui.demoAvailability}</h3><p>{copy.demoStatus}</p></aside>}
        </section>
        <section id="status" className="dossier-section dossier-status">
          <div><p className="dossier-kicker">04 / {ui.status}</p><h2>{copy.stage}</h2><div className="dossier-tech"><h3>{ui.foundation}</h3><ul>{product.technology.map(t=><li key={t}>{technologyLabel(t,locale)}</li>)}</ul></div></div>
          <div className="dossier-prose"><p>{copy.status}</p><h3>{ui.next}</h3><p>{copy.next}</p><p className="dossier-demo-status">{copy.demoStatus}</p></div>
        </section>
        <section className="dossier-related"><p className="dossier-kicker">{ui.related}</p><div>{product.relatedIds.map(id=>getPublishedDossierProducts().find(p=>p.id===id)).filter(p=>!!p).map(p=><Link key={p.id} to={getDossierPath(p.slug,locale)}><span>{p.locales[locale].category}</span><strong>{p.shortName}</strong><span aria-hidden="true">↗</span></Link>)}</div></section>
        <section className="dossier-contact"><p className="dossier-kicker">Brenych Studio / Barcelona</p><h2>{ui.contactTitle}</h2><p>{ui.contactBody}</p><button className="dossier-action" onClick={()=>{player.current?.pause();props.onOpenProject?.();}}>{ui.contact}<span aria-hidden="true">↗</span></button></section>
      </main>
      <SiteFooterV2 variant="studio" hideClosingSignal onOpenProject={props.onOpenProject}/>
    </PageSurface>
    <dialog ref={dialog} className="dossier-dialog" aria-label={ui.enlarge} onCancel={e=>{e.preventDefault();closeImage();}} onClick={e=>{if(e.target===e.currentTarget)closeImage();}}>
      <button className="dossier-dialog-close" autoFocus onClick={closeImage}>{ui.close} ×</button>
      {selected&&<figure>{selected.evidenceLabel&&<p className="dossier-evidence-label">{selected.evidenceLabel[locale]}</p>}<img src={selected.full} width={selected.width} height={selected.height} alt={selected.alt[locale]}/><figcaption>{selected.caption[locale]} {!selected.evidenceLabel&&<a href={selected.full} target="_blank" rel="noopener noreferrer">{ui.enlarge} ↗</a>}</figcaption></figure>}
    </dialog>
  </>;
}
export default function ProductDossier(props:Props & {productSlug?:string}) {
  const params=useParams(); const slug=props.productSlug ?? params.slug; const {locale}=useI18n(); const product=getPublishedDossierProducts().find(p=>p.slug===slug);
  if(!product) return <><SeoMeta title="Product not found | Brenych Studio" description="This product is not available." path="/products" noIndex/><Header {...props}/><main className="dossier-missing"><h1>{locale==="es"?"Producto no disponible":"Product unavailable"}</h1><Link to={locale==="es"?"/es/products":"/products"}>{locale==="es"?"Todos los productos":"All products"}</Link></main></>;
  return <DossierBody key={product.id} product={product} locale={locale==="es"?"es":"en"} {...props}/>;
}
