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

### Verification notes

Recent visual checks were made through local screenshots in `exports/`.

`npm run build` previously passed after the main V2 updates, with only the standard Vite large chunk warning. The latest local build/typecheck attempts later began hanging without diagnostics in the local Node/Vite process, so future sessions should re-run verification after clearing stale Node processes if needed.
