import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PortfolioImage from "../media/PortfolioImage";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";
import { projectStudioDomains, resolveProductTarget, type ProductIndexModel, type StudioDomain } from "./productIndexModel";

export default function ProductSystemTopology({model,onNavigate,onSurface}:{model:ProductIndexModel;onNavigate:(event:MouseEvent<HTMLAnchorElement>)=>void;onSurface:(event:MouseEvent<HTMLAnchorElement>)=>void}) {
  const domains=projectStudioDomains(model);
  const [selectedDomain,setSelectedDomain]=useState<StudioDomain["id"]>("products");
  const [hoveredDomain,setHoveredDomain]=useState<StudioDomain["id"]|null>(null);
  const [signal,setSignal]=useState(0);
  const { reducedMotion }=useMobileMotion({enabled:false});
  const [paths,setPaths]=useState<string[]>([]);
  const [visible,setVisible]=useState(false);
  const [documentVisible,setDocumentVisible]=useState(true);
  const field=useRef<HTMLDivElement>(null);
  const domain=domains.find(item=>item.id===selectedDomain)!;
  const es=model.locale==="es";
  useLayoutEffect(()=>{
    const element=field.current;if(!element)return;
    const measure=()=>{
      const bounds=element.getBoundingClientRect();
      const origin=element.querySelector<HTMLElement>("[data-origin-terminal]")!.getBoundingClientRect();
      const x=origin.left+origin.width/2-bounds.left,y=origin.top+origin.height/2-bounds.top;
      const mobile=window.matchMedia("(max-width:679px)").matches;
      const nearTerminal=element.querySelector<HTMLElement>('[data-domain-button="products"] [data-domain-terminal]')!.getBoundingClientRect();
      // Route through the empty gutter, never through the origin or node typography.
      const corridor=x+(nearTerminal.left+nearTerminal.width/2-bounds.left-x)*.4;
      setPaths(Array.from(element.querySelectorAll<HTMLElement>("[data-domain-terminal]")).map(terminal=>{
        const rect=terminal.getBoundingClientRect(),tx=rect.left+rect.width/2-bounds.left,ty=rect.top+rect.height/2-bounds.top;
        if (mobile) return `M ${x} ${y} V ${ty} H ${tx}`;
        const far = terminal.closest("[data-domain-button]")?.getAttribute("data-domain-button");
        const lane = ty < y ? 12 : Math.max(y+80,ty+72);
        return far==="research" || far==="worlds"
          ? `M ${x} ${y} C ${corridor} ${y}, ${corridor} ${lane}, ${corridor+36} ${lane} L ${tx-60} ${lane} C ${tx-24} ${lane}, ${tx-24} ${ty}, ${tx} ${ty}`
          : `M ${x} ${y} C ${(x+tx)/2} ${y}, ${(x+tx)/2} ${ty}, ${tx} ${ty}`;
      }));
    };
    const observer=new ResizeObserver(measure);observer.observe(element);
    element.querySelectorAll("button,.product-topology-origin").forEach(node=>observer.observe(node));
    measure();return()=>observer.disconnect();
  },[model.locale,selectedDomain]);
  useEffect(()=>{
    const element=field.current;if(!element)return;
    const observer=new IntersectionObserver(entries=>setVisible(entries[0]?.isIntersecting??false),{threshold:.1});
    const update=()=>setDocumentVisible(document.visibilityState==="visible");
    observer.observe(element);document.addEventListener("visibilitychange",update);update();
    return()=>{observer.disconnect();document.removeEventListener("visibilitychange",update);};
  },[]);
  return <div className="product-topology-composition">
    <div ref={field} className="product-system-topology" data-explored-domain={selectedDomain} data-selected-domain={selectedDomain} data-current-domain="products">
      <svg className="product-topology-connections" aria-hidden="true">{paths.map((path,index)=><path key={index} d={path} data-selected={domains[index].id===selectedDomain} data-highlighted={domains[index].id===hoveredDomain}/>)}
        {signal>0 && !reducedMotion?<path key={signal} className="product-topology-active-trace" data-signal={signal} style={{animationPlayState:visible&&documentVisible?"running":"paused"}} d={paths[domains.findIndex(item=>item.id===selectedDomain)]} pathLength="1"/>:null}
      </svg>
      <div className="product-topology-origin"><span className="product-topology-mark" aria-hidden="true"><i/><i/><i/></span><p>Brenych<br/> Studio</p><span className="product-system-micro">{es?"Fundamentos compartidos":"Shared foundation"}</span><i data-origin-terminal aria-hidden="true"/></div>
      {domains.map((item,index)=><button type="button" key={item.id} className={`product-topology-node product-topology-node-${item.id}`} style={{order:index*2+2}} data-domain-button={item.id} data-highlighted={hoveredDomain===item.id} aria-pressed={selectedDomain===item.id} aria-controls="product-topology-detail"
        onPointerEnter={event=>{if(event.pointerType==="mouse")setHoveredDomain(item.id);}} onPointerLeave={()=>setHoveredDomain(null)} onFocus={()=>setHoveredDomain(item.id)} onBlur={()=>setHoveredDomain(null)}
        onClick={()=>{if(selectedDomain!==item.id){setSelectedDomain(item.id);setSignal(value=>value+1);}}}>
        <i data-domain-terminal aria-hidden="true"/><span className="product-topology-node-index">0{index+1}</span><span className="product-topology-node-name">{item.label}</span>
        {item.id==="products"?<span className="product-topology-current"><i/>{es?"Superficie actual":"Current public surface"}</span>:null}
      </button>)}
    <div id="product-topology-detail" className="product-topology-detail" style={{order:domains.findIndex(item=>item.id===selectedDomain)*2+3}} aria-live="polite" aria-atomic="true">
      <motion.div key={selectedDomain} className="product-topology-detail-content" initial={{opacity:reducedMotion?1:0,y:reducedMotion?0:8}} animate={{opacity:1,y:0}} transition={{duration:reducedMotion?0:.26}}>
      <div><p className="product-system-micro">{domain.label}</p><p className="product-topology-description">{domain.description}</p></div>
      <div className="product-topology-proof">
        {selectedDomain==="products"?<><div className="product-topology-products">{model.items.slice(0,3).map(item=><a key={item.project.id} href={`#${resolveProductTarget(item.project.id,model)!.id}`} onClick={onSurface}>{item.project.publicName}<span aria-hidden="true">↗</span></a>)}
          <a href="#products-index" onClick={onSurface}>{model.items.length>3?`+${model.items.length-3} · `:""}{es?"Ver todos los productos":"View all products"}<span aria-hidden="true">↓</span></a></div>
          {model.items[0]?.presentation.poster?<PortfolioImage src={model.items[0].presentation.poster.src} alt="" sizes="180px" containerClassName="product-topology-preview" imageClassName="product-system-poster-bitmap"/>:null}</>:null}
        {domain.href?<Link className="product-system-action" to={domain.href} onClick={onNavigate}>{es?"Explorar Immersive":"Explore Immersive"}<span aria-hidden="true">↗</span></Link>:null}
      </div>
      </motion.div>
    </div>
    </div>
  </div>;
}
