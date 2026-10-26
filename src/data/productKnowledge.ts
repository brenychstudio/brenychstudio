import { getPublishedDossierProducts } from "./productCatalog";
import { getDossierPath } from "./productDossiers";
import type { PublicLocale } from "./projectRegistry.types";

export type ProductKnowledgeRecord = {
  id:string;name:string;category:string;publicationStatus:"public";liveSessionAvailable:false;
  routes:Record<PublicLocale,string>;
  locales:Record<PublicLocale,{
    summary:string;problem:string;confirmedCapabilities:{title:string;description:string}[];
    stage:string;limitations:string[];
    demonstration:{kind:"recorded-video"|"image-study";description:string;duration?:string};
  }>;
};

// Data preparation only. No agent/provider import and no active navigation permission.
// Public-safe records are derived from the same catalog copy displayed to visitors.
export const productKnowledge: readonly ProductKnowledgeRecord[] = getPublishedDossierProducts().map(product => ({
  id:product.id,name:product.name,category:product.category,publicationStatus:"public",liveSessionAvailable:false,
  routes:{en:getDossierPath(product.slug,"en"),es:getDossierPath(product.slug,"es")},
  locales:Object.fromEntries((["en","es"] as const).map(locale => {
    const copy=product.locales[locale];
    return [locale,{
      summary:copy.summary,problem:copy.problem,
      confirmedCapabilities:copy.capabilities.map(item=>({title:item.title,description:item.body})),
      stage:copy.stage,limitations:product.limitations?.[locale]??[copy.status,copy.next],
      demonstration:{kind:product.video?"recorded-video":"image-study",description:copy.demoStatus,...(product.video?{duration:product.video.duration}:{})},
    }];
  })) as ProductKnowledgeRecord["locales"],
}));
