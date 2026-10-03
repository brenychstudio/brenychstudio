import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AtmosphericSiteShell from "../ui/atmosphere/AtmosphericSiteShell";
import Header from "../ui/Header";
import PageSurface from "../ui/PageSurface";
import SectionRail from "../ui/SectionRail";
import SiteFooterV2 from "../ui/SiteFooterV2";
import { useSectionRailActive } from "../ui/useSectionRailActive";
import ProductIndexView from "../ui/products/ProductIndexView";
import { createProductIndexModel, resolveProductTarget, type ProductIndexModel } from "../ui/products/productIndexModel";
import { getProductCatalogItems } from "../data/productCatalog";
import { getPublicProductPresentation } from "../data/productPresentation";
import { useI18n } from "../i18n";
import { useProductSectionNavigation } from "../ui/products/useProductSectionNavigation";
import "../ui/products/productSystem.css";

type ProductIndexProps={drawerOpen?:boolean;onOpenProject?:()=>void;onCloseProject?:()=>void};

export function ProductIndexPage({model,drawerOpen,onOpenProject,onCloseProject}:ProductIndexProps & {model:ProductIndexModel}) {
  const location=useLocation();
  const {navigateToProductSection,onProductSectionLink}=useProductSectionNavigation(model);
  const activeId=useSectionRailActive(model.chapters);
  const [surfaceTone,setSurfaceTone]=useState<"light"|"dark">("light");
  const productScenes=useMemo(()=>Object.fromEntries(model.featured.map(item=>[`products-surface-${item.project.id}`,{label:item.presentation.visual.headerLabel,treatment:item.presentation.visual.treatment}])),[model]);
  const hashId=location.hash.slice(1);
  const productTarget=useMemo(()=>model.items.map(item=>resolveProductTarget(item.project.id,model)).find(target=>target?.id===hashId),[model,hashId]);
  useEffect(()=>{
    let frame=0;
    const measure=()=>{
      frame=0;const anchor=window.innerHeight*.46;
      const surfaces=Array.from(document.querySelectorAll<HTMLElement>(".product-system-main [data-surface-tone]"));
      const surface=surfaces.find(element=>{const rect=element.getBoundingClientRect();return rect.top<=anchor && rect.bottom>anchor;});
      setSurfaceTone(surface?.dataset.surfaceTone==="dark"?"dark":"light");
    };
    const update=()=>{if(!frame)frame=requestAnimationFrame(measure);};
    update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
  },[model]);
  return <>
    <Header drawerOpen={drawerOpen} onOpenProject={onOpenProject} onCloseProject={onCloseProject} productScenes={productScenes}/>
    <PageSurface className="product-system-surface relative min-h-screen text-neutral-950">
      <AtmosphericSiteShell preset="classic" className="product-system-atmosphere"/>
      <SectionRail items={model.chapters} activeId={activeId} onSelect={id=>navigateToProductSection(id,{motionProfile:"rail"})} tone={surfaceTone} label={model.locale==="es"?"Secciones de productos":"Product sections"} className="product-system-rail"/>
      <ProductIndexView model={model} onSurface={onProductSectionLink} revealProductId={productTarget?.kind==="register"?productTarget.productId:null} revealKey={location.key} onCloseProject={onCloseProject}/>
      <SiteFooterV2 variant="studio" hideClosingSignal onOpenProject={onOpenProject}/>
    </PageSurface>
  </>;
}

export default function ProductIndex(props:ProductIndexProps) {
  const {locale}=useI18n();const publicLocale=locale==="es"?"es":"en";
  const model=useMemo(()=>createProductIndexModel(getProductCatalogItems(publicLocale).map(item=>({...item,presentation:getPublicProductPresentation(item.project,item.entry,publicLocale)})),publicLocale),[publicLocale]);
  return <ProductIndexPage {...props} model={model}/>;
}
