import { createHash } from "node:crypto";
import { strict as assert } from 'node:assert';
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
registerHooks({resolve(specifier, context, next) {
  if (specifier.startsWith('.') && context.parentURL && !/\.[a-z]+$/i.test(specifier.split('/').pop() ?? '')) {
    for (const ext of ['.ts','.tsx']) if (existsSync(fileURLToPath(new URL(specifier+ext, context.parentURL)))) return next(specifier+ext,context);
  }
  return next(specifier,context);
}});
const first = ["ai-language-tutor", "brenych-asset-forge", "distribution-desk", "villa-atlas", "qualor", "storyform", "abe"];
const second = ["spatial-product-platform", "knowledge-desk", "live-intent-graph", "native-site-control"];
const approved = [...first,...second];
const held = ["native-networking-companion", "living-atlas", "brenych-presence-engine"];
const {getRouteModuleKey} = await import('../src/routing/routeModules.ts');
const {getStaticRouteMetadata} = await import('../src/seo/staticMetadata.ts');
// Catches missing public routes, accidental second-wave registration, and noindex left at promotion.
for (const slug of approved) for (const prefix of ['', '/es']) {
  const route = `${prefix}/products/${slug}`;
  assert.equal(getRouteModuleKey(route), 'productDossier', `Approved route missing: ${route}`);
  const meta = getStaticRouteMetadata(route);
  assert.ok(meta, `Static metadata missing: ${route}`);
  assert.notEqual(meta.noIndex, true, `Approved route still noindex: ${route}`);
  assert.equal(meta.alternates?.length, 3);
  assert.equal(getRouteModuleKey(`${route}/extra`), null);
}
for (const slug of held) for (const prefix of ['', '/es']) {
  assert.equal(getRouteModuleKey(`${prefix}/products/${slug}`), null);
  assert.equal(getStaticRouteMetadata(`${prefix}/products/${slug}`), undefined);
}
const {getPublishedDossierProducts, getProductCatalogItems} = await import('../src/data/productCatalog.ts');
const {productKnowledge} = await import('../src/data/productKnowledge.ts');
const products = getPublishedDossierProducts();
assert.deepEqual(products.map(p=>p.slug), approved);
assert.deepEqual(productKnowledge.map(p=>p.id), approved);
assert.deepEqual(getProductCatalogItems('en').map(p=>p.entry.projectId), ['weekfield','print-border-studio']);
for (const p of products) {
  assert.equal(p.publicationStatus, 'public');
  for (const related of p.relatedIds) assert.ok(approved.includes(related));
}
assert.ok(productKnowledge.every(p=>p.liveSessionAvailable === false));
const abe = products.find(p=>p.id==='abe')!;
for (const image of [abe.hero,...abe.gallery]) for (const lang of ['en','es'] as const) assert.ok(image.evidenceLabel?.[lang]);
const spp=products.find(p=>p.id==='spatial-product-platform')!;
assert.equal(spp.credits?.length,4);
assert.ok(spp.credits?.every(c=>c.license==='CC BY 4.0' && c.licenseUrl==='https://creativecommons.org/licenses/by/4.0/'));
console.log('SECOND_WAVE=PASS: '+second.length+' new products; first seven preserved; held products and BPE excluded');

const {dossierUi}=await import("../src/data/productDossiers.ts");
const originalUi=structuredClone(dossierUi) as Record<string,Record<string,string>>;
for(const copy of Object.values(originalUi)) for(const key of ["credits","creditContext","environmentCredits"]) delete copy[key];
assert.equal(createHash("sha256").update(JSON.stringify({products:products.slice(0,7),ui:originalUi})).digest("hex"),"342ce8306c52471e9eef244d2bbda7fe9183965138823f482f5258cddebe0c0a","First seven public dossiers or shared UI wording changed");
