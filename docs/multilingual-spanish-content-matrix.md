# Spanish Content Matrix

## 1. Launch Policy

Spanish must not be enabled publicly until all P0 content is translated, reviewed and visually checked.

Do not publish a partial Spanish version where only header/footer are translated while main content remains English.

English remains the only enabled production language until the Spanish content pass, SEO pass and route launch are explicitly approved.

## 2. P0 - Required For First Spanish Launch

Global UI:

- Header navigation
- Footer
- Language switcher labels
- Project drawer
- CTA labels
- Common buttons / pills / status labels

Core pages:

- Home
- Work archive
- Offer
- About
- Immersive hub

Service pages:

- `/services/premium-landing-page`
- `/services/product-demo-landing`
- `/services/interactive-web-systems`

Priority cases:

- CreatorOps
- House of Lune
- Barcelona Private Advisory
- WHISPER

SEO:

- Spanish title / description for every P0 page
- Spanish OG title / description for every P0 page
- Spanish alt text for key images where rendered from content

## 3. P1 - Recommended After Spanish Launch

Remaining visible public cases and immersive systems should follow after the first Spanish launch:

- SprintCRM
- Print Border Studio
- WEBHERO
- Kool Berk
- Presence OS / Memory Atlas
- Orbit Lens
- Casa Nube
- FLUID
- FORM INDEX
- ARCWAVE
- AUREL EON GT
- Oria House Barcelona
- Any other visible Work / Immersive item

P1 can be translated in batches, but visible cards should not point to English-only detail pages from Spanish archive views once those archive routes are public.

## 4. P2 - Optional / Later

- Hidden/internal routes
- Draft case pages
- Long documentation pages
- Old experiment routes
- Any private/unlisted material

P2 should stay outside the public Spanish launch unless a page becomes visible in navigation, sitemap or case archives.

## 5. Do Not Translate Yet

- GitHub README
- internal docs
- development notes
- old hidden routes
- disabled Ukrainian / Russian content
- untranslated `/uk` or `/ru` content

Spanish should not trigger Ukrainian or Russian preparation beyond the already-disabled locale foundation.

## 6. Page-By-Page Matrix

| Area | Route | Content source | Priority | Translation required | SEO required | Visual QA required | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Global UI | All routes | `src/i18n/dictionaries/en.ts`, `src/ui/Header.tsx`, `src/ui/SiteFooterV2.tsx`, `src/ui/ProjectDrawerV2.tsx` | P0 | Yes | No page SEO | Yes | Header, footer, drawer, nav, CTA labels and disabled language labels. |
| Home | `/` | `src/pages/StudioIndex.tsx`, shared data modules where rendered | P0 | Yes | Yes | Yes | Must keep brand positioning and premium interface systems language. |
| Work archive | `/work` | `src/pages/EvidenceAtlas.tsx`, `src/data/cases.ts`, `src/data/caseStories.ts`, `src/data/workEvidence.ts`, `src/data/availableSystems.ts` | P0 | Yes | Yes | Yes | Translate archive UI, filters, first visible case cards and archive expansion copy. |
| Offer | `/offer` | `src/pages/OfferV2.tsx`, `src/data/servicePages.ts` | P0 | Yes | Yes | Yes | Do not make it sound like a generic service menu. |
| About | `/about` | `src/pages/AboutV2.tsx` | P0 | Yes | Yes | Yes | Spain-facing but still authorial; avoid over-personal translation. |
| Immersive hub | `/immersive` | `src/pages/ImmersiveV2.tsx`, `src/data/immersive.ts`, `src/data/immersiveSystems.ts` | P0 | Yes | Yes | Yes | Translate hub, map labels, WHISPER card and proof language. |
| Premium landing page service | `/services/premium-landing-page` | `src/data/servicePages.ts`, `src/pages/ServicePage.tsx` | P0 | Yes | Yes | Yes | Keep "landing page" terminology. |
| Product demo landing service | `/services/product-demo-landing` | `src/data/servicePages.ts`, `src/pages/ServicePage.tsx` | P0 | Yes | Yes | Yes | Product demo and founder-led product language. |
| Interactive web systems service | `/services/interactive-web-systems` | `src/data/servicePages.ts`, `src/pages/ServicePage.tsx` | P0 | Yes | Yes | Yes | WebGL, spatial archive and immersive system terminology. |
| CreatorOps case | `/work/creatorops` | `src/data/caseStories.ts`, `src/data/cases.ts`, `src/pages/CasePageV2.tsx` | P0 | Yes | Yes | Yes | Preserve product feature names where branded. |
| House of Lune case | `/work/house-of-lune` | `src/data/caseStories.ts`, `src/data/cases.ts`, `src/pages/CasePageV2.tsx` | P0 | Yes | Yes | Yes | Luxury commerce / private inquiry / multilingual readiness. |
| Barcelona Private Advisory case | `/work/barcelona-private-advisory` | `src/data/caseStories.ts`, `src/data/cases.ts`, `src/pages/CasePageV2.tsx` | P0 | Yes | Yes | Yes | Route is mapped from the `bcn-advisory` case id. Keep Barcelona context precise. |
| WHISPER case | `/immersive/whisper` | `src/data/immersive.ts`, `src/data/whisperCaseI18n.ts`, `src/ui/immersive/WhisperCaseLayout.tsx`, `src/pages/ImmersiveCasePage.tsx` | P0 | Yes | Yes | Yes | Existing Spanish-like content must be reviewed before launch, not assumed production-ready. |

## 7. Case Translation Matrix

| Case | Route | Priority | Translate card | Translate detail page | Translate SEO | Translate alt text | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CreatorOps | `/work/creatorops` | P0 | Yes | Yes | Yes | Yes | Creator workflow system; keep Week Pack, Smart Mix and product feature names controlled. |
| House of Lune | `/work/house-of-lune` | P0 | Yes | Yes | Yes | Yes | Premium product / luxury commerce / multilingual-ready website. |
| Barcelona Private Advisory | `/work/barcelona-private-advisory` | P0 | Yes | Yes | Yes | Yes | Private property intelligence; Spain/Barcelona context is strategically relevant. |
| WHISPER | `/immersive/whisper` | P0 | Yes | Yes | Yes | Yes | Cinematic Web/XR exhibition, spatial archive, collector presentation. |
| SprintCRM | `/work/sprintcrm` | P1 | Yes | Yes | Yes | Yes | Operator workflow product. |
| Print Border Studio | `/work/print-border-studio` | P1 | Yes | Yes | Yes | Yes | Editioned objects / collector surface. |
| WEBHERO | `/immersive/webhero` | P1 | Yes | Yes | Yes | Yes | Internal R&D platform, WebGL stage, living visual systems. |
| Kool Berk | `/immersive/kool-berk` | P1 | Yes | Yes | Yes | Yes | Sonic Object OS / artist environment. |
| Presence OS / Memory Atlas | `/immersive/presence-os` | P1 | Yes | Yes | Yes | Yes | Keep system naming stable; translate explanatory copy. |
| Orbit Lens | `/immersive/orbit-lens` | P1 | Yes | Yes | Yes | Yes | Product OS / spatial clarity direction. |
| Casa Nube | `/work/casa-nube` | P1 | Yes | Yes | Yes | Yes | Hospitality website system. |
| FLUID | `/work/fluid` | P1 | Yes | Yes | Yes | Yes | Editorial exhibition surface. |
| FORM INDEX | `/work/form-index` | P1 | Yes | Yes | Yes | Yes | Repeatable presentation system. |
| ARCWAVE | `/work/arcwave` | P1 | Yes | Yes | Yes | Yes | Infrastructure interface system. |
| AUREL EON GT | `/work/aurel-eon-gt` | P1 | Yes | Yes | Yes | Yes | Premium automotive product system. |
| Oria House Barcelona | `/work/oria-house-barcelona` | P1 | Yes | Yes | Yes | Yes | Boutique hotel hospitality system; Barcelona context can be used truthfully. |
| Hidden / draft cases | Internal or unlisted routes | P2 | No | No | No | No | Translate only if they become public. |

## 8. SEO Translation Matrix

Each Spanish page will need:

- Spanish title
- Spanish meta description
- Spanish OG title
- Spanish OG description
- Self-canonical Spanish URL
- Later hreflang `en` / `es` / `x-default`
- Sitemap entry only after the route is public

Important:

- Do not add hreflang in MULTILINGUAL-01A.
- Do not add Spanish sitemap entries in MULTILINGUAL-01A.
- Do not change canonical in MULTILINGUAL-01A.
- Do not enable `/es` until P0 content and Spanish SEO are complete.

| SEO area | P0 requirement | Notes |
| --- | --- | --- |
| Global default metadata | Spanish defaults for public Spanish pages | Must not affect current English output. |
| Home | Spanish title, description, OG title, OG description | Preserve studio positioning. |
| Work archive | Spanish archive metadata | Mention projects / proof, not generic portfolio browsing. |
| Offer | Spanish offer metadata | Avoid agency-service wording. |
| About | Spanish authorial/studio metadata | Spain-facing but not over-localized. |
| Immersive hub | Spanish immersive metadata | Interface systems, WebGL, spatial archive language. |
| Service pages | Spanish service titles and descriptions | One distinct SEO angle per service page. |
| P0 cases | Spanish case titles and descriptions | Case name + system type + proof angle. |
| Alt text | Spanish where rendered from data/content | Describe actual asset or interface state, not decoration. |

## 9. Spanish Launch Checklist

Before enabling `/es`:

- [ ] Spanish dictionary complete for shared UI
- [ ] Header / footer translated
- [ ] Drawer translated
- [ ] Home translated
- [ ] Work archive translated
- [ ] Offer translated
- [ ] About translated
- [ ] Immersive hub translated
- [ ] 3 service pages translated
- [ ] 4 priority cases translated
- [ ] Spanish SEO metadata complete
- [ ] Mobile QA 390 / 430 / 768
- [ ] Desktop QA 1024 / 1366
- [ ] No horizontal overflow
- [ ] Header language switcher updated
- [ ] `/es` routes enabled
- [ ] self-canonical Spanish URLs added
- [ ] hreflang `en` / `es` / `x-default` added
- [ ] sitemap updated with Spanish URLs
- [ ] Search Console inspection for `/es` URLs
