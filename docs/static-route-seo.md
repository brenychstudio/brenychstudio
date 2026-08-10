# Static route metadata

Portfolio metadata is generated at build time so crawlers receive the correct
title, canonical URL and social preview tags before JavaScript runs.

`src/seo/staticMetadata.ts` is the typed manifest used by the build. It derives
case and immersive entries from their existing data registries, with the
WEBHERO social copy kept as an explicit route override.

During `npm run build`, the Vite plugin writes a directory index for every
public route, for example `dist/immersive/webhero/index.html`.

The generated `dist/_redirects` maps each public clean URL to its matching
directory index with status `200`; it does not redirect case URLs to the
homepage. The final fallback remains `/* /index.html 200`, preserving SPA
navigation for non-prerendered routes.

Case and immersive source images are also rendered to `dist/og/<slug>.png` at
1200x630. Generated route HTML always uses their absolute production URL.
