import { useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import PortfolioImage from "../media/PortfolioImage";
import { filterProductItems, resolveProductTarget, type ProductIndexModel } from "./productIndexModel";
import ProductRegisterPreviewDock from "./ProductRegisterPreviewDock";

export default function ProductRegister({model,revealProductId,revealKey,onSurface,onNavigate}:{model:ProductIndexModel;revealProductId:string|null;revealKey:string;onSurface:(event:MouseEvent<HTMLAnchorElement>)=>void;onNavigate:(event:MouseEvent<HTMLAnchorElement>)=>void}) {
  const [filter,setFilter]=useState("all");
  const [pinned,setPinned]=useState<string|null>(null);
  const [preview,setPreview]=useState<string|null>(null);
  const [previousReveal,setPreviousReveal]=useState("");
  const root=useRef<HTMLOListElement>(null);
  const es=model.locale==="es";
  const items=filterProductItems(model,filter);
  const selected=items.find(item=>item.project.id===(preview??pinned))??items[0];
  if (previousReveal !== revealKey) {
    setPreviousReveal(revealKey);
    if (revealProductId && model.items.some(item=>item.project.id===revealProductId)) {
      setFilter("all");setPinned(revealProductId);setPreview(null);
    }
  }
  const changeFilter=(value:string)=>{setFilter(value);setPinned(null);setPreview(null);};
  const peek=(id:string)=>{if(window.matchMedia("(min-width:1100px)").matches)setPreview(id);};
  return <>
    {model.showFilters?<div className="product-register-filters" aria-label={es?"Filtrar productos":"Filter products"}>
      <button type="button" aria-pressed={filter==="all"} onClick={()=>changeFilter("all")}>{es?"Todos":"All"} <span>{model.items.length}</span></button>
      {model.groups.map(group=><button key={group.id} type="button" aria-pressed={filter===group.id} onClick={()=>changeFilter(group.id)}>{group.label} <span>{group.count}</span></button>)}
      <p role="status">{items.length} {es?"resultados":"results"}</p>
    </div>:null}
    {!items.length?<div className="product-register-empty"><p>{es?"No hay productos en esta selección.":"No products in this selection."}</p>{filter!=="all"?<button type="button" onClick={()=>changeFilter("all")}>{es?"Restablecer filtros":"Reset filters"}</button>:null}</div>:null}
    <div className="product-register-layout">
    <ol className="product-system-ledger" ref={root} onPointerLeave={()=>{if(!root.current?.contains(document.activeElement))setPreview(null);}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setPreview(null);}}>
      {items.map(item=>{
        const id=item.project.id;const target=resolveProductTarget(id,model)!;const expanded=pinned===id;
        return <li key={id} id={target.kind==="register"?target.id:`register-${id}`} tabIndex={-1} className="product-system-ledger-row" data-index-product={id} data-preview={selected?.project.id===id} data-expanded={expanded} onPointerEnter={event=>{if(event.pointerType==="mouse")peek(id);}} onFocus={()=>peek(id)}>
          <span className="product-system-micro product-system-ledger-ordinal">{String(model.items.indexOf(item)+1).padStart(2,"0")}</span>
          <div className="product-system-ledger-copy"><h3>{item.project.publicName}</h3><button className="product-register-toggle" type="button" aria-expanded={expanded} aria-controls={`product-detail-${id}`} onClick={()=>{setPinned(expanded?null:id);setPreview(null);}}>{expanded?(es?"Cerrar detalles":"Close details"):(es?"Ver detalles":"View details")} <span aria-hidden="true">{expanded?"−":"+"}</span></button></div>
          <dl className="product-system-metadata"><div><dt>{es?"Madurez":"Maturity"}</dt><dd>{item.presentation.stateLabel}</dd></div><div><dt>{es?"Disponibilidad":"Availability"}</dt><dd>{item.presentation.availabilityLabel}</dd></div></dl>
          <div className="product-register-actions">
            {item.presentation.proofPath?<Link className="product-system-action" to={item.presentation.proofPath} onClick={onNavigate}>{es?"Ver evidencia":"View evidence"}<span aria-hidden="true">↗</span></Link>:null}
            {item.presentation.liveHref?<a className="product-system-action" href={item.presentation.liveHref} target="_blank" rel="noopener noreferrer">{es?"Demo pública":"Live proof"}<span aria-hidden="true">↗</span></a>:null}
          </div>
          <div id={`product-detail-${id}`} className="product-register-detail" data-register-panel={expanded?"open":"closed"} hidden={!expanded}>
            {expanded && item.presentation.poster?<PortfolioImage src={item.presentation.poster.src} alt={item.presentation.poster.alt} sizes="(min-width: 680px) 250px, 85vw" containerClassName="product-register-poster" imageClassName="product-system-poster-bitmap"/>:null}
            <div><p>{item.presentation.summary}</p>{expanded && target.kind==="featured"?<a className="product-system-action" href={`#${target.id}`} onClick={onSurface}>{es?"Explorar producto destacado":"Explore featured product"}<span aria-hidden="true">↑</span></a>:null}</div>
          </div>
        </li>;
      })}
    </ol>
    <ProductRegisterPreviewDock item={selected} es={es}/>
    </div>
  </>;
}
