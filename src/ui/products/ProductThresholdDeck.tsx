import { useEffect, useState, type MouseEvent, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import PortfolioImage from "../media/PortfolioImage";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";
import { getHeroWindow, resolveProductTarget, type ProductIndexModel, type HeroSlot } from "./productIndexModel";

const poses = {
  active: { x: "24%", y: "36%", z: 40, scale: 1, rotateY: -7, rotateZ: 6 },
  "supporting-first": { x: "0%", y: "0%", z: 15, scale: .89, rotateY: 8, rotateZ: -7 },
  "supporting-second": { x: "48%", y: "-30%", z: 1, scale: .72, rotateY: -3, rotateZ: 12 },
};
const depthOrder = { active: 3, "supporting-first": 2, "supporting-second": 1 };

function ProductPlane({ item, role, pointerX, pointerY, reduced, introduced, es, select }: HeroSlot & {
  pointerX: MotionValue<number>; pointerY: MotionValue<number>; reduced: boolean; introduced: boolean; es: boolean; select: (id: string) => void;
}) {
  const [depth,setDepth] = useState(()=>introduced&&!reduced?1:depthOrder[role]);
  useEffect(()=>{
    // z-index is discrete in Motion. Delay it explicitly, canceling stale swaps
    // when input changes, so the complete cover crosses after motion has begun.
    const timer=window.setTimeout(()=>setDepth(depthOrder[role]),reduced?0:340);
    return()=>window.clearTimeout(timer);
  },[role,reduced]);
  const amplitude = role === "active" ? 1 : role === "supporting-first" ? -.45 : .35;
  const x = useSpring(useTransform(pointerX, value => value * 12 * amplitude), { stiffness: 160, damping: 26 });
  const y = useSpring(useTransform(pointerY, value => value * 9 * amplitude), { stiffness: 160, damping: 26 });
  const rotateX = useSpring(useTransform(pointerY, value => -value * 3 * amplitude), { stiffness: 160, damping: 26 });
  const rotateY = useSpring(useTransform(pointerX, value => value * 5 * amplitude), { stiffness: 160, damping: 26 });
  const dialect = es ? { digital: "Digital / Sistema", material: "Material / Producción", generic: "Superficie de producto" } : { digital: "Digital / System", material: "Material / Production", generic: "Product surface" };
  return <motion.div className="product-deck-plane" data-plane-role={role} style={{zIndex:depth}}
    initial={introduced&&!reduced?poses["supporting-second"]:false} animate={poses[role]} transition={{ duration: reduced ? 0 : .76, ease: [.22, .8, .22, 1] }}>
    <motion.button type="button" data-hero-product={item.project.id} data-slot={role}
      className={`product-system-field-node product-system-field-node-${item.presentation.visual.treatment}`} aria-pressed={role === "active"}
      style={{ x: reduced ? 0 : x, y: reduced ? 0 : y, rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}
      aria-label={`${es ? "Seleccionar" : "Select"} ${item.project.publicName}`} onClick={() => select(item.project.id)}>
      <span className="product-system-field-node-label"><span>{item.project.publicName}</span><span aria-hidden="true">{role === "active" ? "●" : "+"}</span></span>
      {item.presentation.poster ? <PortfolioImage src={item.presentation.poster.src} alt="" loading="eager" sizes="(min-width: 1280px) 420px, 65vw" containerClassName="product-system-field-image" imageClassName="product-system-poster-bitmap" /> : null}
      <span className="product-system-field-node-caption product-system-micro">{dialect[item.presentation.visual.treatment]}<span>{role === "active" ? (es ? "Seleccionado" : "Selected") : (es ? "Seleccionar" : "Select")}</span></span>
    </motion.button>
  </motion.div>;
}

export default function ProductThresholdDeck({model,onSurface}:{model:ProductIndexModel;onSurface:(event:MouseEvent<HTMLAnchorElement>)=>void}) {
  const [order,setOrder]=useState<string[]>(()=>getHeroWindow(model.items,null).map(slot=>slot.item.project.id));
  const [hasSelected,setHasSelected]=useState(false);
  const { reducedMotion: reduced } = useMobileMotion({ enabled: false });
  const pointerX = useMotionValue(0), pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 95, damping: 24 });
  const y = useSpring(pointerY, { stiffness: 95, damping: 24 });
  const ids = [...new Set([...order, ...model.items.map(item=>item.project.id)])].filter(id=>model.items.some(item=>item.project.id===id)).slice(0,3);
  const roles: HeroSlot["role"][] = ["active","supporting-first","supporting-second"];
  const slots = ids.map((id,index)=>({item:model.items.find(item=>item.project.id===id)!,role:roles[index]}));
  const active=slots[0]?.item;
  const es=model.locale==="es";
  const index=model.items.findIndex(item=>item.project.id===active?.project.id);
  const select=(id:string)=>{setHasSelected(true);setOrder(previous=>[id,...previous.filter(value=>value!==id)].slice(0,3));};
  const move=(step:number)=>{setHasSelected(true);setOrder(previous=>{
    const current=Math.max(0,model.items.findIndex(item=>item.project.id===previous[0]));
    const id=model.items[(current+step+model.items.length)%model.items.length].project.id;
    return [id,...previous.filter(value=>value!==id)].slice(0,3);
  });};
  const parallax=(event:PointerEvent<HTMLDivElement>)=>{
    if(reduced || event.pointerType!=="mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;
    const bounds=event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1)));
    pointerY.set(Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1)));
  };
  return <div className="product-threshold-deck">
    <div className="product-system-living-field" role="group" aria-label={es?"Selección pública de productos":"Public product selection"}
      onPointerMove={parallax} onPointerLeave={()=>{pointerX.set(0);pointerY.set(0);}}>
      <div className="product-system-field-axis" aria-hidden="true"><span/><i/><span/></div>
      <p className="product-system-field-signal product-system-micro"><span/>{es?"Señal del estudio":"Studio signal"}</p>
      {slots.slice().sort((a,b)=>a.item.project.id.localeCompare(b.item.project.id)).map(slot=><ProductPlane key={slot.item.project.id} {...slot} pointerX={x} pointerY={y} reduced={reduced} introduced={hasSelected} es={es} select={select}/>)}
      {!active?<p className="product-deck-empty">{es?"La selección pública no contiene productos en este idioma.":"No products are currently listed in this language."}</p>:null}
    </div>
    {active?<div className="product-deck-controls">
      <div className="product-deck-stepper"><button type="button" aria-label={es?"Producto anterior":"Previous product"} onClick={()=>move(-1)} disabled={model.items.length<2}>←</button>
        <p aria-live="polite" aria-atomic="true"><span>{String(index+1).padStart(2,"0")} / {String(model.items.length).padStart(2,"0")}</span><small>{es?"Selección pública":"Public selection"}</small></p>
        <button type="button" aria-label={es?"Producto siguiente":"Next product"} onClick={()=>move(1)} disabled={model.items.length<2}>→</button></div>
      <a className="product-system-action product-deck-enter" href={`#${resolveProductTarget(active.project.id,model)!.id}`} onClick={onSurface}>{es?"Explorar":"Explore"} {active.project.publicName}<span aria-hidden="true">↓</span></a>
    </div>:null}
  </div>;
}
