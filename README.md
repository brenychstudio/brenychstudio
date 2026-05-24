# Rostyslav Brenych

Creative Developer focused on premium front-end systems, multilingual websites, product prototypes, interactive storytelling, and selected WebGL/XR experiences.

I build digital products and premium web systems across hospitality, real estate, clinics, cultural platforms, internal tools, and founder-led concepts — combining visual restraint, product thinking, and production-minded implementation.

## What I build

- Premium multilingual websites
- Reusable vertical web systems
- Product demos and internal tools
- Editorial / storytelling interfaces
- Selected WebGL / XR / interactive experiences

## Core stack

- React
- TypeScript
- Astro
- Next.js
- Vite
- Tailwind CSS
- React Router
- Motion
- Three.js / React Three Fiber
- Cloudflare Pages
- Google Sheets / CSV CMS patterns

## Selected work

### SprintCRM
Internal outreach CRM with import/dedup, Today workflow, pipeline, and KPI reporting.

### Barcelona Private Advisory
Premium bilingual advisory demo for Barcelona property discovery with shortlist-first decision support.

### CreatorOps
Export-first content planning prototype with Smart Mix, planner flow, captions, and ZIP export.

### FLUID
Multilingual exhibition microsite with QR-driven artist pages and a unified digital identity for a real art event.

### FORM INDEX
Interactive fashion concept with scroll-driven stage logic, synchronized progress, and motion-heavy interface design.

### WHISPER
Premium web + XR exhibition prototype combining digital storytelling, collector flow, and immersive runtime logic.

## Working style

I use an AI-augmented workflow built around Codex and GPT to accelerate prototyping, implementation, documentation, and polish — while keeping architecture, art direction, product logic, and final validation under direct manual control.

## Focus

Currently focused on:
- premium vertical systems
- product prototype development
- portfolio-grade digital experiences
- reusable front-end foundations

## Current project brief

### 2026-05-24 mobile interface and drawer handoff

Current active branch status:

- Branch: `main`
- Remote: `origin/main`
- Latest pushed commit: `978e0df Refine project drawer intake`
- Previous mobile system commit: `f79f68c Add mobile interface system`
- Working tree was clean after the latest push.

#### Mobile Interface System

The mobile adaptation is now treated as a separate interface system, not as a responsive shrink of desktop.

Current mobile direction:

- Desktop remains the spatial studio site.
- Mobile should feel like a compact premium interface app.
- Desktop layout and route structure should not be redesigned while continuing mobile work.
- Page-by-page mobile work should preserve the Brenych Studio spatial/conceptual language instead of converting everything into generic cards.

Shared mobile foundation already completed:

- compact mobile header and menu behavior;
- mobile-safe typography scale and section rhythm;
- right rail/sound dock collision mitigation;
- `ProjectDrawerV2` mobile sheet foundation;
- global overflow prevention and safer mobile media behavior;
- reusable mobile chapter logic prepared for long public pages.

Validation status:

- `npm run lint` passes with 0 errors and the same 8 known non-blocking warnings.
- `npm run build` passes.
- Vite still reports the expected large chunk warning for the main/Three.js runtime.

#### Home mobile status

Home mobile was reconstructed as a compact chapter flow while preserving the authored spatial identity.

Current mobile chapter order:

1. Opening / Studio Signal
2. Proof Surfaces
3. Systems Index
4. WHISPER Preview
5. Interface Grammar / Core Formula
6. Reusable Grammar / Visual Language
7. Practice Model / Offer Bridge
8. Closing Signal

Important decisions:

- The first reverted pass made mobile clearer but too generic; the current pass restores spatial stage language.
- Proof visuals should remain controlled spatial stages, not square portfolio cards.
- Systems Index should read as a systems spine, not a portfolio grid.
- Formula blocks should use compact terminal/ledger-style wording where possible.
- Sound-aware development is no longer highlighted as a Home/Systems selling point for now.
- WHISPER preview and Reusable Grammar badges now switch active visuals.
- Mobile menu overlay was fixed so it no longer looks transparent over page content.

Current Home mobile quality note:

- Hero, WHISPER preview, Practice bridge, and Closing are in a strong state.
- Proof Surfaces, Systems Index, Core Formula, and Reusable Grammar are improved but should still get one final taste pass on a real phone.
- Watch for overly large spatial screenshots, section-to-section spacing, and text hierarchy at 390px and 430px.

#### Project drawer status

`src/ui/ProjectDrawerV2.tsx` is now the active drawer surface for both mobile and desktop.

Mobile drawer changes:

- Rebuilt as a compact bottom sheet.
- Removed the redundant top `Direction` / `Need` summary badges.
- Direction is selected through compact cards.
- Current need is selected through short chips.
- Name, email, note, send, email-direct, and copy-email actions are always easier to reach.
- Drawer open, close, option select, hover, submit success/blocked, email-direct, and copy-email sounds are wired through `playRole`.
- Sound still respects the global sound preference; if the dock is `OFF`, drawer interaction is intentionally silent.

Desktop drawer changes:

- Rebuilt from a long ledger-like intake into a shorter premium intake flow.
- Direction selection now uses compact desktop tiles instead of a long full-width list.
- Current need now uses compact chips instead of another long list.
- Large `Selected signal` readout was replaced by a short `Route preview`.
- Name/email/note inputs now match the simpler mobile intake pattern.
- Sticky action footer remains, but with softer rounded premium controls.

Important drawer follow-up:

- Do a manual open/close/select/send pass with sound enabled.
- Check desktop drawer at common widths around 1024, 1366, and wide desktop.
- Check mobile drawer on 360, 390, and 430 widths with the virtual keyboard open.
- If needed, reduce desktop direction tile copy further, but do not return to the long list pattern.

#### Next recommended development pass

Recommended order for tomorrow:

1. Real-phone QA for Home mobile at 390/430 and actual browser chrome.
2. Drawer QA with keyboard, sound enabled, and copy/email actions.
3. Start page-by-page mobile adaptation after Home: `Work + Case pages`, then `Offer + About`.
4. Keep desktop as stable unless a drawer-specific issue appears.

Do not do next:

- Do not simplify spatial stages into generic cards.
- Do not reintroduce sound-aware interface as a main offer unless the product direction changes.
- Do not make Home a full Offer duplicate.
- Do not touch SEO/meta/routes for mobile-only layout polish.

### 2026-05-21 handoff brief

Current active pass focused on two public surfaces: Offer section 03 and Immersive section Proof.

#### Offer / Engagement Model

- `src/pages/OfferV2.tsx`
- `src/ui/OfferDeliveryModelEngine.tsx`

Section `03 / Engagement Model` was moved away from the earlier right-side stage-control panel. The delivery engine now works as a wider page-level animation: users switch stages by interacting with the black stage nodes directly, while the only persistent action remains the open-interface control.

The opened interface uses the same node-based interaction logic. Its bottom controls were rebuilt from primitive blocks into a more conceptual stage rail with numbered nodes, live/locked/passed states, and a quieter system readout. The engine render was also tuned for higher visual quality, smoother transitions, more stable stage switching, clearer node hit areas, and less random-looking motion.

Current Offer interaction rules:

- stage selection happens through animation nodes, not a separate right-side list;
- stage information cards appear only after a concrete node click;
- card positions are mapped per stage so they avoid nearby nodes and preserve composition;
- the full interface keeps the same stage-card placement logic;
- mobile and reduced-motion behavior remain supported by the existing component structure.

#### Immersive / WHISPER Proof

- `src/pages/ImmersiveV2.tsx`

The WHISPER proof section was rebuilt into a Surface Relay Stage instead of a small screenshot slider. The current structure keeps the light spatial shell and the headline `The first completed spatial proof.`, but the right side now carries the visual weight with a large proof surface and a surface-specific state layout.

Proof states now behave as distinct surfaces:

- `01 Web` uses a large cinematic web surface.
- `02 Mobile` uses a vertical phone surface with quiet ghost traces.
- `03 Print` uses an edition-sheet / collector-object layout.
- `04 AR` uses a placement preview with calibration geometry.
- `05 Room` uses a deep spatial room surface.

The relay navigation is now a proof-chain rail (`One archive` to `Five surfaces`) rather than generic boxed tabs. State switching remains keyboard accessible through focusable controls, and the main surface can advance to the next proof.

Latest tone calibration:

- stage backing is more neutral smoke/off-white and less cream/yellow;
- active media is full-strength and readable;
- ghost traces are muted separately with lower opacity and occasional grayscale;
- Print has clearer material boundaries, cooler paper tone, and stronger but still subtle shadow;
- AR has less gray veil and stronger preview readability;
- Room remains deep inside the stage without turning the full section back into a dark dashboard.

#### Validation

- `npm run build` passes.
- `npm run lint` passes with 8 known non-blocking warnings in existing files:
  `SoundProvider.tsx`, `OfferDeliveryModelEngine.tsx`, `StudioHeroField.tsx`,
  `ExternalProfileLinks.tsx`, `LiveBuildSignal.tsx`, and `CaseMobileShowcase.tsx`.
- Vite still reports the known large chunk warning for the primary runtime and Three.js vendor chunk.

Active work is focused on the new canonical Work case system:

- Main route pattern: `/work-lab/:slug`
- Main renderer: `src/pages/CasePageV2.tsx`
- Story data source: `src/data/caseStories.ts`
- Shared inspect viewer: `src/ui/work/CinematicInspectReveal.tsx`
- Canonical reference doc: `docs/casepage-v2-reference-pattern.md`

### CasePageV2 status

`CasePageV2` is now the canonical non-immersive Work case page foundation. It should be reused for future Work cases instead of duplicating page templates.

### 2026-05-19 navigation polish status

Main-route navigation was stabilized after the legacy detach checkpoint.

- Header navigation now uses SPA transitions consistently instead of hard reload behavior from the home route.
- Main public routes are kept in the primary runtime path to avoid lazy fallback flashes during top-level navigation.
- SPA transitions use the browser View Transition API when available, with a direct `requestAnimationFrame` fallback.
- `PageSurface` no longer fades every route in from full transparency; this removes the page-refresh feeling between sections.
- Home, Work, and Immersive defer below-the-fold heavy route content until after the first transition frame through `useDeferredRouteContent`.
- `PageTransitionOverlay` remains available for hard transitions, but normal top-level SPA navigation no longer uses a fullscreen white/dark flash.

Validation notes:

- `npm run lint` passes with the known non-blocking warnings.
- `npm run build` passes; current expected warning is the large `vendor-three-core` chunk plus the larger primary runtime chunk caused by keeping launch-critical public routes ready for smoother navigation.
- Manual result: flashes are practically removed; Offer/About are the smoothest routes, and Home/Work/Immersive are improved by deferred below-the-fold mounting.

Canonical page order:

1. Threshold / Hero
2. System walkthrough
3. Screens as Evidence
4. Proof becomes system
5. Available foundation
6. Final conversion
7. Case footer

Validated V2 cases:

- House of Lune - luxury product reference
- Barcelona Private Advisory - light advisory / real estate validation
- CreatorOps - workflow / product system validation
- SprintCRM - internal CRM / operator workflow validation
- FLUID - cultural exhibition / QR artist-page validation
- FORM INDEX - editorial motion / presentation-system validation
- ARCWAVE - bilingual service architecture validation
- Casa Nube - hospitality / multilingual local-service validation
- Print Border Studio - production tool / print workflow validation

Current public status:

- `/work/:slug` now renders the canonical `CasePageV2` for non-immersive Work cases.
- Classic work case detail pages are detached from the production router and retained only as source reference.
- `/work-lab/:slug` remains available as a hidden V2 lab/reference route.
- Immersive / WHISPER remains outside the Work V2 pattern and now uses its own spatial flagship case logic.

### Immersive / WHISPER current state

WHISPER is now the canonical flagship Immersive case:

- Public route: `/immersive/whisper`
- Main renderer: `src/ui/immersive/WhisperCaseLayout.tsx`
- Route shell: `src/pages/ImmersiveCasePage.tsx`
- Data source: `src/data/immersive.ts`
- Immersive engine data: `src/data/immersiveSystems.ts`
- Reference doc: `docs/immersive-whisper-reference-pattern.md`

Canonical Immersive page order:

1. Spatial threshold / flagship hero
2. Spatial atlas
3. Desktop web walkthrough video
4. Spatial evidence field
5. Quest XR proof
6. Collector continuation
7. Mobile proof
8. Engine ledger / canon statement

WHISPER deliberately does not reuse `CasePageV2`. It combines the strongest existing systems instead: spatial threshold language from Immersive, evidence-led proof from Work V2, a draggable spatial evidence field, the shared cinematic inspect reveal, complete desktop / Quest / mobile media coverage, and an engine ledger for future Immersive cases.

Current refinement pass:

- Hero collage was cleaned into a clearer primary website plane with quieter Quest, mobile, and signal overlays.
- Spatial Atlas now behaves as a living spatial map instead of a flat table of proof rows.
- Collector continuation now uses an object / print / AR chamber treatment.
- Mobile proof now uses a darker cinematic phone field instead of the lighter generic mobile showcase.
- Engine ledger final CTA now stays inside the immersive system language instead of switching to a cream marketing block.

Canonical Immersive interaction notes:

- `SpatialEvidenceField` turns screenshot proof into a controlled horizontal spatial field.
- Drag, wheel, dots, and next controls all snap toward one active proof frame.
- Clicking a frame centers/focuses it; focused frames can open the shared inspect reveal.
- `SpatialAtlasMap` is the canonical way to summarize connected Immersive surfaces without making the atlas feel like a static table.
- Collector and mobile proof sections should feel like chambers inside the same room: object handoff, AR preview, and handheld route remain atmospheric but still inspectable.
- Atmospheric color wash transitions are now a reference device for Immersive pages: the next section should feel like it enters the current room, not like a hard page break.

### 2026-05-17 refinement log

Сьогоднішній прохід був сфокусований на тому, щоб прибрати шаблонну блоковість, вирівняти сторінки під єдину канонічну систему сайту і довести WHISPER до більш цілісного flagship-рівня.

#### Offer V2 / hero signal

- Великий чорний hero-блок справа був прибраний, бо надто сильно відволікав від сторінки.
- Замість нього реалізовано легший концептуальний `Live offer signal` з terminal-like друком тексту.
- Hero тепер читається ближче до головної сторінки: більше повітря, менше важкої рамковості, більше відчуття живої системи.
- Права частина hero працює як інформаційний signal-field, а не як окремий чорний інтерфейсний екран.

#### WHISPER / section 02 Spatial Atlas

- Чорний суцільний блок у секції `02 Spatial Atlas` прибрано.
- Зображення залишені як самостійні просторові поверхні, без важкого контейнера.
- Тексти адаптовані під легшу, концептуальнішу композицію.
- Додано/вирівняно канонічну праву навігаційну панель для сторінки.
- Header chameleon було доведено до однакової логіки з іншими сторінками.

#### WHISPER / section 03 Desktop Web Walkthrough

- Відеоплеєр переосмислено як cinematic capture surface замість шаблонного embed-блоку.
- Відео має відтворюватись одразу на сторінці, а не тільки після відкриття терміналу.
- Відкриття відео перенесено у cinematic terminal environment для повноекранного перегляду.
- Прибрано надмірну сітку поверх відео та зайві бокові блоки.
- Підпис під відео перенесено вліво, щоб нижня інформаційна зона виглядала структурніше.
- У відео-консолі `Signal Source` опущено нижче, щоб він не прилипав до верхнього краю.

#### WHISPER / section 03.1 Spatial Evidence Field

- Виправлено drag-перемикання скріншотів.
- Виправлено перемикання кліком по фото.
- Центральна активна картинка більше не виглядає випадково затемненою.
- Клік по центральному фото відкриває shared inspect reveal.
- Hover-controls з'являються при наведенні на активну площину і зникають після відведення курсора.
- Перемикання фото зроблено циклічним: після останнього кадру навігація повертається до першого.
- Для вкладеної секції `03.1` додано окрему header-scene `whisper-evidence`, щоб header, sound dock і правий section rail коректно адаптувались до темної секції.

#### WHISPER / section 04 Quest XR Proof

- Quest video surface повернуто ближче до початкового масштабу, без зайвого зменшення.
- Відео відкривається у тому самому cinematic terminal pattern, що і desktop walkthrough.
- Прибрано зайву блоковість навколо відео, щоб секція залишалась частиною immersive-середовища.

#### WHISPER / section 05 Collector Continuation

- Примітивний чорний інтерфейсний блок замінено на світліший object / print / AR handoff field.
- Зображення тепер працюють як накладені просторові докази, а не як screenshot всередині важкого чорного UI.
- Текстова логіка була спрощена: дублюючі нижні labels прибрано, основний зміст повернено в змістовний блок справа.
- Виправлено проблему відкриття зображень у console/inspect середовищі.
- Sound control у нижньому правому куті приведено до компактнішого канонічного вигляду.

#### Shared site systems

- `useActiveHeaderScene` оновлено так, щоб вкладені секції могли перемагати parent-section при визначенні активної chameleon-теми.
- `useSectionRailActive` оновлено для коректного визначення вкладених/коротших секцій на сторінці.
- `SectionRail`, `SoundSignalDock` і header theme tokens тепер краще підтримують WHISPER dark/light transitions.
- На WHISPER додано канонічний immersive footer через `SiteFooterV2`.
- Підготовлено/оновлено documentation workflow для універсальних розробок сайту через `scripts/generate-development-playbooks.mjs`.

### Canonical evidence pattern

The `Screens as Evidence` section now uses the canonical `Flow / Atlas` system:

- `Flow` is the default cinematic large-frame reading path.
- `Atlas` is the compact grid-scan mode.
- Only the first 5 evidence frames are shown by default.
- Long cases reveal the rest through `Open full evidence field ->`.
- Cases with 5 or fewer evidence frames do not show the expansion CTA.
- Every evidence card opens the shared inspect modal.

This pattern is the standard way to scale screenshot-heavy case pages without turning them into heavy catalogues.

### Canonical inspect reveal

`CinematicInspectReveal` is shared across V2 cases and must keep the bottom thumbnail rail synchronized with the active frame.

Rules:

- The active frame can change through wheel, arrow keys, swipe, next/prev buttons, or thumbnail click.
- The bottom thumbnail rail must scroll with the active frame.
- The active thumbnail should stay visible and centered when possible.
- This behavior is canonical for all V2 cases.

### CreatorOps current state

CreatorOps has been upgraded into a full V2 case:

- Added as `slug: "creatorops"` in `src/data/caseStories.ts`.
- Uses the workflow-tool narrative variant in `CasePageV2`.
- Hero title splits as `Creator / Ops`.
- Hero media uses aligned rectangular cards like Barcelona Private Advisory and House of Lune.
- Hero overlays were lightened so the dark product screenshots stay readable.
- Mobile rail uses tall phone screenshots and priority-loads the active frame.
- Full desktop evidence set is included except the removed `Dark staging` frame.
- Full mobile set is included.
- `creatorops-4.webp` / `desktop-4` / `Dark staging` was intentionally removed from the V2 evidence flow.

### Remaining Work archive current state

The remaining non-immersive Work cases have been moved into the canonical V2 data flow:

- SprintCRM
- FLUID
- FORM INDEX
- ARCWAVE
- Casa Nube
- Print Border Studio

They reuse `CasePageV2` through generated story records backed by the legacy `src/data/cases.ts` media inventory, with case-specific story metadata in `src/data/caseStories.ts`.

Renderer updates:

- Evidence frames now scale generically from every non-video, non-mobile case frame.
- CreatorOps keeps its custom evidence order.
- Mobile frames remain in the dedicated mobile surface rail.
- Narrative copy now adapts by case type: workflow/tool, advisory, hospitality, service website, presentation/experimental, and luxury product.
- Available Foundation copy now adapts by case type instead of assuming luxury commerce language.

### Barcelona Private Advisory current state

Barcelona Private Advisory has been visually audited:

- Hero collage uses clean rectangular cards instead of awkward clipped/cropped cards.
- Cream-heavy treatment was reduced.
- Phone screenshot framing was cleaned up.
- Black phone screenshot border issue was fixed.
- Advisory-specific phone aspect and object positioning were added.

### House of Lune current state

House of Lune is still the primary luxury-product reference case:

- Hero card geometry was aligned with Barcelona Private Advisory.
- The case remains the reference for the V2 narrative engine, not a visual style to copy literally.

### Implementation notes

- Do not duplicate `CasePageV2` per case.
- Add future cases through `src/data/caseStories.ts`.
- Keep visual variants case-aware through story metadata, slug checks, or case type checks.
- Keep the `Flow / Atlas` evidence behavior and synchronized inspect thumbnail rail as canonical.
- Preserve the site language: restrained, technical, cinematic, premium, and evidence-led.

### Prelaunch system audit / 2026-05-18

The site is coherent enough to move into final launch polish. The canonical public structure is stable, production build passes, representative desktop and mobile browser smoke checks pass, and the main navigation / project drawer flow works.

Canonical public routes:

- `/` - new Studio Index home experience.
- `/work` - Evidence Atlas / Work overview.
- `/immersive` - Immersive overview.
- `/offer` - Offer V2.
- `/about` - About V2.
- `/privacy` and `/legal` - public policy routes.
- `/work/:slug` - canonical `CasePageV2` renderer for non-immersive Work cases.
- `/immersive/whisper` - canonical Immersive flagship case.

Validated Work case slugs:

- `house-of-lune`
- `barcelona-private-advisory`
- `bcn-advisory` alias
- `creatorops`
- `sprintcrm`
- `fluid-exhibition`
- `form-index`
- `arcwave-integrations`
- `casa-nube`
- `print-border-studio`

Hidden V2 / reference routes remain available with noindex behavior:

- `/studio-index`
- `/evidence-atlas`
- `/immersive-v2`
- `/offer-v2`
- `/about-v2`
- `/spatial-proof`

Legacy archive status:

- Classic routes are detached from the production router.
- Legacy files are retained as a reference archive, not as public routes.
- Sitemap now contains only canonical public URLs.
- Archive note: `docs/legacy-archive.md`.

Priority implementation pass / 2026-05-18:

- Public route-level SEO is now handled by `src/ui/SeoMeta.tsx` and wired through `src/App.tsx`.
- Public canonical routes now set title, description, canonical URL, robots, Open Graph, and Twitter metadata.
- Case detail pages now generate case-specific metadata through `CasePageV2` and keep `/work-lab/:slug` noindex.
- `/immersive/whisper` now has its own public case metadata in `ImmersiveCasePage`.
- `CinematicInspectReveal` now behaves as an accessible modal dialog with `role="dialog"`, `aria-modal`, labelled title, description, Escape close, focus trap, focus restore, and inert background.
- Heavy page routes are lazy-loaded with `React.lazy` / `Suspense`.
- Vite manual chunks now separate React, Framer Motion, Three.js, R3F, Drei, Three examples, and Tone audio.
- Case media crop behavior is now data-driven through `CaseStoryMedia.fit` and `CaseStoryMedia.objectPosition` instead of renderer-level case-type assumptions.
- Mobile sound dock collision handling now hides the dock when marked dense surfaces overlap its safe zone.
- Final case CTA copy now varies by case type and avoids duplicate `Start a project` actions.

Verification results:

- `npm run build` passes.
- `npm run lint` exits successfully with 0 errors and 8 existing non-blocking warnings.
- `exports/` is ignored by lint because it contains generated reusable extracts and smoke artifacts, not source application code.
- Desktop browser route audit passed for the public routes, hidden V2/reference routes, legacy noindex routes, all listed Work cases, and `/immersive/whisper`.
- Production preview smoke passed for `/`, `/work`, `/immersive`, `/offer`, `/about`, `/privacy`, `/legal`, `/work/house-of-lune`, `/work/barcelona-private-advisory`, `/work/creatorops`, `/immersive/whisper`, and `/work-lab/house-of-lune`.
- SEO smoke verified status 200, title, canonical, robots, description, Open Graph URL/title, and Twitter card for the checked routes.
- Inspect modal smoke verified dialog semantics, inert background, focus trap, Escape close, and focus/background restoration.
- Mobile sound dock smoke verified that the dock is visible in the case header zone and hidden over the dense evidence safe area.
- Smoke report artifact: `exports/launch-polish-smoke-2026-05-18/smoke-report.json`.
- Header navigation was previously click-tested across Home, Work, Immersive, Offer, About, and back to Home.
- `START A PROJECT` opens the project drawer in production preview without runtime errors.
- Public PDF links exist in `public/docs`: `price-pack-2026.pdf`, `website-management-2026.pdf`, and `cv-2026.pdf`.

Cleanup completed:

- Removed ignored root-level Vite/Codex/dev log files.
- Removed temporary `.tmp` audit artifacts.
- Removed the empty root-level `↗` artifact.
- Kept `dist/`, `exports/`, `logs/`, and `node_modules/` intact because they are ignored build/export/runtime folders, not source routes.

Current non-blocking warnings:

- Vite still reports one large chunk warning, now isolated to `vendor-three-core` after route and vendor splitting. This is expected while Three.js remains part of the public runtime.
- ESLint still reports non-blocking warnings around animation-driven `setState` in effects and Fast Refresh export shape in existing component/utility files.
- Dev-server console can report React/R3F `key` spread warnings on Offer, but production preview is clean.

### LAUNCH-FINAL-QA-01 / 2026-05-18

Final viewport, WHISPER, and copy QA is complete.

Polish completed:

- Sound dock safe areas were tightened for dense CTA/proof surfaces on About, Immersive, Offer, Work evidence, WHISPER threshold/web/XR/collector/mobile/engine, and footer/closing sections.
- Right rail behavior was stabilized for closing/footer zones so final CTAs and footer links are not covered at desktop or wide desktop widths.
- WHISPER mobile threshold spacing keeps the back/status controls below the fixed header, and dense proof sections now reserve enough right-side space for the canonical rail.
- Offer and WHISPER wide proof/control surfaces now keep a cleaner right gutter around the fixed rail.
- Copy sanity pass found no launch-blocking CTA/shop/template residue. Remaining "template" references are intentional explanatory wording such as "not a template".

Final QA coverage:

- Viewport checks covered 390, 430, 768, 1024, 1366, and wide desktop widths across the canonical public routes.
- WHISPER was manually and browser-smoke checked across threshold, atlas, web proof, spatial field, XR proof, collector, mobile proof, and engine sections.
- Production hard-refresh smoke passed for `/`, `/work`, `/offer`, `/about`, `/privacy`, `/legal`, `/work/house-of-lune`, `/work/barcelona-private-advisory`, and `/immersive/whisper`.
- Project drawer open/close passed on mobile and desktop production preview.
- Internal PDF links verified: `price-pack-2026.pdf`, `website-management-2026.pdf`, and `cv-2026.pdf`.

Final verification artifacts:

- `exports/launch-final-qa-01/launch-final-qa-01-targeted-report.json`
- `exports/launch-final-qa-01/launch-final-qa-01-production-smoke.json`
- `exports/launch-final-qa-01/creatorops-wide-bottom-rail-final.json`

Current launch readiness:

- The priority audit tasks from the PDF research pass are implemented and verified.
- The public route structure, deep links, case routes, SEO metadata, inspect modal, media presentation rules, mobile dock behavior, WHISPER rhythm, and final CTA/rail spacing are stable enough for deploy / active sharing.
- Remaining work is optional: final human visual taste pass in a real browser and zero-warning lint cleanup only if a future CI gate requires it.

Optional polish after launch readiness:

1. Decide whether the isolated `vendor-three-core` chunk warning is acceptable for first release or should be handled by deferring more 3D surfaces.
2. Resolve the 8 remaining ESLint warnings only if a zero-warning CI gate is required.
3. Do one final subjective visual pass before publishing the live URL broadly.
