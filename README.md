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

Active work is focused on the new canonical Work case system:

- Main route pattern: `/work-lab/:slug`
- Main renderer: `src/pages/CasePageV2.tsx`
- Story data source: `src/data/caseStories.ts`
- Shared inspect viewer: `src/ui/work/CinematicInspectReveal.tsx`
- Canonical reference doc: `docs/casepage-v2-reference-pattern.md`

### CasePageV2 status

`CasePageV2` is now the canonical non-immersive Work case page foundation. It should be reused for future Work cases instead of duplicating page templates.

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
- Legacy work case detail pages are hidden under `/work-classic/:slug` with noindex behavior.
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

### Current project status / 2026-05-17

The project is now in an advanced visual-system refinement stage.

Stable foundations:

- `CasePageV2` remains the canonical foundation for non-immersive Work cases.
- `/immersive/whisper` remains the canonical flagship Immersive case and does not reuse `CasePageV2`.
- `CinematicInspectReveal` is the shared inspect environment for case proof, image evidence, and cinematic review.
- `SectionRail` is the canonical right-side page navigation pattern.
- `useActiveHeaderScene` and `headerThemeTokens` drive the chameleon header / sound dock behavior across light and dark sections.
- `SiteFooterV2` is the canonical footer system and is now attached to WHISPER as well.

Active refinement areas:

- Offer V2 is visually much lighter and closer to the living-signal language, but still needs a final responsive QA pass.
- WHISPER has reached a much stronger flagship direction, especially in sections 02, 03, 03.1, 04, and 05.
- Video surfaces now share a cinematic terminal pattern, but final browser-level media QA is still important.
- Chameleon behavior is improved for nested WHISPER sections, including `03.1 Spatial Evidence Field`.
- Documentation/export tooling exists, but the universal development playbooks should be regenerated and reviewed whenever the interaction patterns stabilize.

### Next priority actions

1. Run a full visual QA pass across WHISPER on desktop, laptop, tablet, and mobile widths.
2. Re-check video playback on desktop walkthrough and Quest proof: autoplay, terminal opening, controls, sound state, and fallback behavior.
3. Audit header chameleon, right rail, left/header navigation, and sound dock across every WHISPER section after a fresh dev-server restart.
4. Resolve the remaining `rawFrames` hook dependency warnings in `WhisperCaseLayout.tsx`.
5. Review performance and bundle size; Vite still reports the standard large chunk warning.
6. Do a focused mobile pass for WHISPER sections 03, 03.1, 04, and 05, because these have the densest interaction layouts.
7. Re-run and polish the six Ukrainian development playbooks so they include final mechanics, examples, and reusable implementation notes.
8. Package reusable extracts only after the related source patterns are stable: WebGL home animation, cinematic terminal video viewer, spatial evidence field, phone screenshot carousel, and right-side section rail.
9. Prepare final copy polish for EN / UA / ES / RU where routes or case content still feel draft-like.

### Verification notes

Recent visual checks were made through local screenshots and browser inspection.

`npm run build` passes after the latest WHISPER and Offer updates, with only the standard Vite large chunk warning.

Targeted ESLint checks pass for the touched files with no errors. The only current warnings are the existing `rawFrames` dependency warnings in `src/ui/immersive/WhisperCaseLayout.tsx`.
