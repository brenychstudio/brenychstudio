# Living Atlas release pages

Pre-release trust surface for the Living Atlas iOS app, hosted on the studio
domain. This is not a Living Atlas marketing site; it is the minimum public web
surface an App Store submission needs.

## Routes

- `/living-atlas` — product release page
- `/living-atlas/privacy` — Living Atlas Privacy Policy (App Store Privacy Policy URL)
- `/living-atlas/support` — Living Atlas Support (App Store Support URL)

`/es/living-atlas`, `/es/living-atlas/privacy` and `/es/living-atlas/support`
redirect to the English route. No Spanish copy exists for these pages yet.

## Pre-release policy

- Reachable by direct URL, no login, no gate.
- `noindex, nofollow` in both the static route HTML and the client meta.
- Not listed in `public/sitemap.xml`; not blocked by `public/robots.txt`.
- Not in the global header navigation. The pages link to each other and to `/`.
- The website Privacy Policy (`/privacy`) and Legal Notice (`/legal`) are
  unchanged; they describe the website, not the app.

## Source of truth

- `src/ui/living-atlas/livingAtlasRelease.ts` — release status, App Store URL
  (`null` until live), support email, policy date, route map.
- `src/App.tsx` — routes, route meta (`routeSeo.livingAtlas*`), JSON-LD identity.
- `src/seo/staticMetadata.ts` — static HTML metadata (`livingAtlasMetadata`).
- `src/pages/LivingAtlasPage.tsx`, `LivingAtlasPrivacy.tsx`, `LivingAtlasSupport.tsx`.

The privacy copy must stay consistent with the App Store privacy disclosure:
purchase history only, purposes App Functionality + Analytics, not linked to
identity, not used for tracking. Change both together.

## Public launch checklist (owner decision)

1. Set `LIVING_ATLAS_APP_STORE_URL` to the real App Store URL. The product page
   swaps the "release in preparation" line for a real App Store link.
2. Remove `noIndex: true` from the three `routeSeo` entries in `src/App.tsx`
   and from `livingAtlasMetadata` in `src/seo/staticMetadata.ts`.
3. Add `/living-atlas` to `public/sitemap.xml` if it should be indexed. Privacy
   and support stay outside acquisition sitemap entries, like `/privacy` and
   `/legal`.
4. Keep the privacy and support URLs stable. App Store Connect references them.
