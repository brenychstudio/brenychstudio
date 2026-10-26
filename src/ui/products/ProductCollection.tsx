import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { dossierUi, getDossierPath } from "../../data/productDossiers";
import { getPublishedDossierProducts } from "../../data/productCatalog";
import { productCategoryLabels } from "../../data/productDossierModel";
import type { PublicLocale } from "../../data/projectRegistry.types";
import "./productDossier.css";
export default function ProductCollection({locale}:{locale:PublicLocale}) {
  const ui=dossierUi[locale];
  const products=getPublishedDossierProducts();
  const [params]=useSearchParams();
  const navigate=useNavigate();
  const categories=[...new Set(products.map(p=>p.category))];
  const requested=params.get("category");
  const selected=categories.find(category=>category===requested)??"all";
  const visible=products.filter(p=>selected==="all"||p.category===selected);
  const select=(category:string)=>{
    if(category===selected)return;
    const next=new URLSearchParams(params);
    if(category==="all")next.delete("category");else next.set("category",category);
    navigate({search:next.toString(),hash:"#studio-collection"},{preventScrollReset:true,state:{preserveCollectionScroll:true}});
  };
  return <section className="dossier-collection product-system-width" id="studio-collection" tabIndex={-1} aria-labelledby="studio-collection-title">
    <p className="dossier-kicker">{ui.preview}</p><div className="dossier-collection-intro"><h2 id="studio-collection-title">{ui.collection}</h2><p>{ui.collectionBody}</p></div>
    <nav className="dossier-category-nav" aria-label={locale==="es"?"Categorías de productos":"Product categories"}>
      <button type="button" aria-pressed={selected==="all"} onClick={()=>select("all")}>{locale==="es"?"Todos":"All"}<span>{products.length}</span></button>
      {categories.map(category=><button type="button" key={category} aria-pressed={selected===category} onClick={()=>select(category)}>{productCategoryLabels[category][locale]}<span>{products.filter(p=>p.category===category).length}</span></button>)}
    </nav>
    <p className="dossier-collection-count" role="status">{locale==="es"?`${visible.length} productos · ${selected==="all"?"Todas las categorías":productCategoryLabels[selected][locale]}`:`${visible.length} products · ${selected==="all"?"All categories":productCategoryLabels[selected][locale]}`}</p>
    <div className="dossier-collection-grid">{visible.map((p,i)=><Link key={p.id} data-category={p.category} className={`dossier-collection-card dossier-${p.composition}`} to={getDossierPath(p.slug,locale)}>
      <div className="dossier-collection-media"><img src={p.hero.src} srcSet={p.hero.srcSet} sizes="(min-width:900px) 30vw, 94vw" width={p.hero.width} height={p.hero.height} alt={p.hero.alt[locale]} loading="lazy"/></div>
      <div><p className="dossier-kicker">{String(i+1).padStart(2,"0")} / {p.locales[locale].stage}</p><h3>{p.shortName}</h3><p>{p.locales[locale].summary}</p><span className="dossier-collection-link">{ui.view} ↗</span></div>
    </Link>)}</div>
  </section>;
}
