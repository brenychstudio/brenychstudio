import { strictEqual, deepStrictEqual, ok, throws } from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import type { ProjectRecord } from "../src/data/projectRegistry.types.ts";
import type { PublicProductCatalogEntry } from "../src/data/productCatalog.ts";

registerHooks({ resolve(specifier, context, next) {
  if (/^\.{1,2}\//.test(specifier) && context.parentURL && !/\.[a-z]+$/i.test(specifier)) {
    const url = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(url))) return next(`${specifier}.ts`, context);
  }
  return next(specifier, context);
} });

let count = 0;
const failures: string[] = [];
function check(name: string, run: () => void) {
  count++;
  try { run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push(`${name}: ${error instanceof Error ? error.message : error}`); console.error(`FAIL ${failures.at(-1)}`); }
}

const { getProductCatalogItems } = await import("../src/data/productCatalog.ts");
const { getPublicProductPresentation } = await import("../src/data/productPresentation.ts");
const modelUrl = new URL("../src/ui/products/productIndexModel.ts", import.meta.url);
check("bounded model available", () => ok(existsSync(modelUrl), "Missing bounded product index model"));
const configUrl = new URL("../src/data/productPresentationConfig.ts", import.meta.url);
check("product-keyed visual contract available", () => ok(existsSync(configUrl), "Missing product-owned visual configuration"));
if (existsSync(modelUrl) && existsSync(configUrl)) {
  const { createProductIndexModel, getHeroWindow, resolveProductTarget, filterProductItems, projectStudioDomains } = await import("../src/ui/products/productIndexModel.ts");
  const { productPresentationConfig, validateProductVisualReferences } = await import("../src/data/productPresentationConfig.ts");
  const real = getProductCatalogItems("en").map(item => ({ ...item, presentation: getPublicProductPresentation(item.project, item.entry, "en") }));
  for (const locale of ["en", "es"] as const) check(`production ${locale} proof ownership`, () => {
    const items = getProductCatalogItems(locale).map(item => ({ ...item, presentation: getPublicProductPresentation(item.project, item.entry, locale) }));
    deepStrictEqual(items.map(item => item.presentation.visual.walkthrough), ["weekfield.case.walkthrough", "print-border.case.walkthrough"]);
    strictEqual(items[1].presentation.visual.secondary?.src, "/cases/print-border-studio/desktop/psb-4.webp");
    for (const item of items) deepStrictEqual(validateProductVisualReferences(item.project, productPresentationConfig[item.project.id], locale), []);
    const model = createProductIndexModel(items,locale);
    if (model.featuredOverflow) console.warn(`FEATURED_OVER_SELECTION ${locale}: ${model.featuredOverflow} candidates remain Register-only (cap 3).`);
    deepStrictEqual(model.items.map(item => item.project.id), ["weekfield","print-border-studio"]);
  });
  if (process.argv.includes("--self-test")) {
    // Only test tooling creates synthetic identities. No fixture module is imported by production.
    const fixture = (size: number) => Array.from({length:size}, (_,index) => {
      const id = `qa-fixture-${index+1}`;
      const project: ProjectRecord = { ...structuredClone(real[0].project), id, publicName: index === 2 ? "Monolith" : `QA product ${index+1}`, media: [{id:"poster",purpose:"poster",asset:{kind:"image",src:`/qa-only/${id}.webp`},alt:{en:`${id} own poster`,es:`Vista propia ${id}`}}], evidence:[],routes:[],links:[] };
      const entry: PublicProductCatalogEntry = {...real[0].entry,projectId:id,slug:id,featured:true};
      const presentation = getPublicProductPresentation(project,entry,"en");
      presentation.group = index % 2 ? "creative-tools" : "workflow";
      return {project,entry,presentation};
    });
    for (const size of [0,1,2,3,12,17]) check(`bounded ${size} items and all targets`, () => {
      const model = createProductIndexModel(fixture(size),"en");
      strictEqual(model.items.length,size); strictEqual(model.featured.length,Math.min(size,3));
      ok(model.chapters.length <= 5); strictEqual(model.chapters.some(chapter => chapter.id === "products-featured"),size > 0);
      for (const item of model.items) {
        const window = getHeroWindow(model.items,item.project.id);
        strictEqual(window.length,Math.min(size,3)); strictEqual(new Set(window.map(slot => slot.item.project.id)).size,window.length);
        strictEqual(window[0].item.project.id,item.project.id);
        const target = resolveProductTarget(item.project.id,model)!;
        strictEqual(target.kind,model.featured.includes(item)?"featured":"register");
        strictEqual(target.id,`products-${item.project.id}`);
      }
      strictEqual(resolveProductTarget("absent",model),null);
      strictEqual(model.featuredOverflow,Math.max(0,size-3));
      if (model.featuredOverflow) console.log(`FEATURED_OVER_SELECTION fixture-${size}: ${model.featuredOverflow} candidates remain Register-only (cap 3).`);
    });
    check("duplicate identities and slugs fail", () => {
      const items=fixture(2); items[1].project.id=items[0].project.id; items[1].entry.projectId=items[0].project.id;
      throws(()=>createProductIndexModel(items,"en"),/duplicate/i);
      const slugs=fixture(2); slugs[1].entry.slug=slugs[0].entry.slug;
      throws(()=>createProductIndexModel(slugs,"en"),/duplicate/i);
    });
    check("visibility vertical locale exclusions", () => {
      const items=fixture(5); items[0].project.visibility="private-named"; items[1].project.visibility="public-unlisted";
      items[2].project.vertical="game-world"; items[3].entry.locales=["en"];
      deepStrictEqual(createProductIndexModel(items,"es").items.map(item=>item.project.id),["qa-fixture-5"]);
    });
    check("same preset uses own still, never another product video", () => {
      for (const item of fixture(3)) { strictEqual(item.presentation.visual.walkthrough,null); strictEqual(item.presentation.visual.secondary,null); strictEqual(item.presentation.visual.treatment,"generic"); strictEqual(item.presentation.visual.headerLabel,item.project.publicName); ok(item.presentation.poster?.src.includes(item.project.id)); }
    });
    check("invalid or borrowed proof rejected and runtime still safe", () => {
      const item=fixture(1)[0];
      const borrowed={...productPresentationConfig.weekfield};
      ok(validateProductVisualReferences(item.project,borrowed,"en").length > 0);
      strictEqual(getPublicProductPresentation(item.project,item.entry,"en",borrowed).visual.walkthrough,null);
      const invalid={...borrowed,walkthrough:"missing.video" as typeof borrowed.walkthrough};
      ok(validateProductVisualReferences(real[0].project,invalid,"en").length > 0);
      const secondary={...productPresentationConfig["print-border-studio"],secondary:{src:"/wrong.webp",alt:{en:"Wrong",es:"Incorrecto"}}};
      ok(validateProductVisualReferences(real[1].project,secondary,"en").length > 0);
    });
    check("explicit own video allowed for same preset", () => {
      const item=fixture(1)[0]; item.project.media.push({id:"own-walkthrough",purpose:"walkthrough",asset:{kind:"video",videoAssetId:"aurel-eon-gt.case.walkthrough"},alt:{en:"Approved own proof",es:"Prueba propia"}});
      const config={treatment:"digital" as const,walkthrough:"aurel-eon-gt.case.walkthrough" as const};
      deepStrictEqual(validateProductVisualReferences(item.project,config,"en"),[]);
      strictEqual(getPublicProductPresentation(item.project,item.entry,"en",config).visual.walkthrough,"aurel-eon-gt.case.walkthrough");
    });
    check("missing optional visual and missing imagery", () => {
      const item=fixture(1)[0]; item.project.media=[];
      strictEqual(getPublicProductPresentation(item.project,item.entry,"en").poster,null);
      ok(validateProductVisualReferences(item.project,{treatment:"digital"},"en").length > 0);
    });
    check("filter choices stable, absent grouping, no results, reset order", () => {
      const items=fixture(5); items[4].presentation.group=null;
      const model=createProductIndexModel(items,"es");
      deepStrictEqual(model.groups.map(group=>[group.id,group.count]),[["workflow",2],["creative-tools",2]]);
      deepStrictEqual(filterProductItems(model,"workflow").map(item=>item.project.id),["qa-fixture-1","qa-fixture-3"]);
      strictEqual(filterProductItems(model,"unknown").length,0);
      deepStrictEqual(filterProductItems(model,"all"),model.items);
      strictEqual(resolveProductTarget("qa-fixture-4",model)?.kind,"register");
      strictEqual(model.showFilters,true); strictEqual(createProductIndexModel(fixture(3),"en").showFilters,false);
    });
    check("hero reorder and removed selection fallback", () => {
      const items=fixture(3).reverse();
      deepStrictEqual(getHeroWindow(items,"qa-fixture-2").map(slot=>slot.item.project.id),["qa-fixture-2","qa-fixture-1","qa-fixture-3"]);
      strictEqual(getHeroWindow(items,"removed")[0].item.project.id,"qa-fixture-3");
    });
    check("safe studio projection excludes private, unlisted and nonexistent localized routes", () => {
      const projects=fixture(3).map(item=>item.project); projects.forEach(project=>{project.vertical="spatial-interactive";project.routes=[{surface:"immersive",path:"/no-such-route",locales:["en","es"]}];});
      projects[0].visibility="private-named"; projects[1].visibility="public-unlisted";
      const domains=projectStudioDomains(createProductIndexModel(real,"es"),projects);
      strictEqual(domains.find(domain=>domain.id==="spatial")?.evidence.length,0);
      deepStrictEqual(domains.find(domain=>domain.id==="products")?.productIds,["weekfield","print-border-studio"]);
      strictEqual(domains.find(domain=>domain.id==="research")?.href,null);
    });
  }
  check("generic renderers have no product proof identities", () => {
    for (const path of ["ProductLivingSurface.tsx","ProductIndexView.tsx","ProductSystemTopology.tsx"]) {
      const source=readFileSync(new URL(`../src/ui/products/${path}`,import.meta.url),"utf8");
      ok(!/weekfield\.case|print-border\.case|psb-4\.webp|\/ Print Border Studio/.test(source),path);
    }
  });
}
console.log(`PRODUCT_INDEX ${count-failures.length}/${count} PASS`);
if(failures.length) process.exitCode=1;
