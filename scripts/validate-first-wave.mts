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
const approved = ['ai-language-tutor','brenych-asset-forge','distribution-desk','villa-atlas','qualor','storyform','abe'];
const held = ['spatial-product-platform','knowledge-desk','native-networking-companion','living-atlas','live-intent-graph','native-site-control','brenych-presence-engine'];
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
console.log('FIRST_WAVE=PASS: 14 public routes, seven knowledge records, held routes excluded, legacy catalog preserved');
