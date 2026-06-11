# Case Upload Prep / 2026-06-09

## Purpose

This brief fixes the current project state before the next case-upload session.

Main goal for the next working block:

- add new cases to `Work`;
- add selected new cases to `Immersive`;
- fully refresh the existing live case content for:
  - `Barcelona Private Advisory`
  - `CreatorOps`
  - `arcwave-integrations`

The user already prepared:

- updated desktop screenshots;
- updated mobile screenshots;
- desktop navigation videos for the refreshed cases.

These three cases were significantly upgraded outside this repository and now need their on-site case content rewritten and restructured to match the new quality level.

## What Was Checked

### 1. Repository Status

Checked:

```bash
git status --short --branch
```

State at review time:

- branch: `main`
- sync state: `main...origin/main`
- one untracked file:
  - `public/docs/mobile-carousel-implementation-ua.html`

No other local code changes were present in the worktree.

### 2. Current Project Direction

Reviewed:

- `README.md`
- `docs/casepage-v2-reference-pattern.md`
- `docs/immersive-whisper-reference-pattern.md`
- `docs/legacy-archive.md`
- `docs/work-case-consistency-audit.md`
- `docs/house-of-lune-case-summary-2026-05-16.md`

Key conclusion:

- the live site is the V2 system;
- classic routes/pages are retained only as legacy reference;
- `Work` cases must be updated through the shared V2 case system, not through legacy case pages;
- `WHISPER` remains the canonical reference for Immersive case structure;
- recent project work focused on responsive/tablet/mobile polish, not on new case ingestion yet.

### 3. Recent Git History

Checked:

```bash
git log --oneline --decorate -10
```

Most relevant recent commits:

- `b0485c6 Improve tablet layouts`
- `ce11de7 Polish mobile about and case carousel`

Conclusion:

- the latest completed phase was layout/responsive refinement;
- we are now ready to move into the next major phase: case content expansion and refresh.

### 4. Live Data Entry Points

Confirmed the live site currently runs from these V2 sources:

- `src/data/cases.ts`
- `src/data/caseStories.ts`
- `src/data/workEvidence.ts`
- `src/data/availableSystems.ts`
- `src/data/immersive.ts`
- `src/pages/EvidenceAtlas.tsx`
- `src/pages/CasePageV2.tsx`
- `src/pages/ImmersiveV2.tsx`
- `src/pages/ImmersiveCasePage.tsx`

Important note:

- legacy files such as `src/pages/CasePage.tsx`, `src/pages/WorkArchive.tsx`, and older `*CaseI18n.ts` files are not the canonical live path for the current public V2 case system.

## Current Live Inventory

### Work

Current live `Work` case slugs confirmed in `src/data/cases.ts`:

- `sprintcrm`
- `bcn-advisory`
- `fluid-exhibition`
- `form-index`
- `arcwave-integrations`
- `casa-nube`
- `print-border-studio`
- `house-of-lune`
- `creatorops`

### Immersive

Current full live `Immersive` case content confirmed in `src/data/immersive.ts`:

- `whisper`

The Immersive hub already contains future-direction chamber logic in `src/pages/ImmersiveV2.tsx`, but the currently confirmed complete immersive case is still `WHISPER`.

## Validation Performed

### Lint

Ran:

```bash
npm run lint
```

Result:

- passed with warnings only;
- no blocking lint errors.

Warnings observed:

- `src/stage/audio/SoundProvider.tsx`
- `src/ui/OfferDeliveryModelEngine.tsx`
- `src/ui/StudioHeroField.tsx`
- `src/ui/profile/ExternalProfileLinks.tsx`
- `src/ui/studio-index/LiveBuildSignal.tsx`
- `src/ui/work/CaseMobileShowcase.tsx`

These warnings are pre-existing and not directly related to the case-upload task.

### Build

Ran:

```bash
npm run build
```

Result:

- build passed successfully;
- Vite reported large chunk-size warnings only;
- no blocking TypeScript or production build failures.

## Working Interpretation

The project is in a good pre-upload state:

- live architecture is stable;
- V2 case system is active and documented;
- build works;
- lint has only non-blocking warnings;
- no unfinished local feature branch state is currently blocking content work.

This means the next session can begin directly with case ingestion and case refresh work, without spending time re-discovering architecture or checking whether the repo is healthy.

## Final Update for Today (2026-06-09)

We completed the planned case-update wave and aligned the work to the existing V2 system without redesigning pages, routes, or global styles.

### Completed

- CreatorOps Work case has been reloaded from `public/cases/creatorops/v2` with the new hero and frame set, updated copy, and workflow-accurate language (beta-ready prototype language).
- Barcelona Private Advisory has been fully updated in Work from `public/cases/bcn-advisory/v2` using the provided PDF narrative and refreshed framing.
- ARCWAVE has been fully updated in Work from `public/cases/arcwave-integrations/v2` with the provided updated case copy and structure.
- Oria House Barcelona has been published as a regular Work case from `public/cases/oria-house-barcelona`, using its current concept positioning and media set.
- AUREL EON GT has been published as a regular Work case from `public/cases/aurel-eon-gt`, keeping MP4 in H.264 because H.265 reduced visual quality and exceeded Cloudflare-ready size constraints when re-encoded.
- For AUREL EON GT, the technical stack was integrated into the existing Proof section (desktop + mobile), not added as a new standalone section, to preserve canonical page composition and avoid layout drift.

### Critical decisions

- No new route/component sections were introduced for these refreshes.
- No legacy case pages were used; all updates stay in the V2 shared content architecture (`cases.ts`, `caseStories.ts`, `workEvidence.ts`, `CasePageV2.tsx`, `sitemap.xml`).
- We kept the system language, copy tone, and mobile/desktop rhythm consistent with existing Work-case patterns.

### Sanity checks done this session

- `npm run lint` passed (warnings only in unrelated files, no errors).
- `npm run build` passed successfully.

### Next Session Start

1. Open this brief first.
2. Continue from the same V2 entry points.
3. Add/refresh the next case in sequence from its prepared `/public/cases/<slug>/v2` assets and PDF notes.
4. Validate in `/work` and `/work/<slug>` at desktop + tablet + mobile breakpoints.

## Recommended Starting Point For The Next Session

1. Re-open this brief first.
2. Confirm which new case slugs will be added to `Work`.
3. Confirm which new case slugs will be added to `Immersive`.
4. Collect the final asset filenames and folder structure for:
   - `bcn-advisory`
   - `creatorops`
   - `arcwave-integrations`
5. Update the V2 content layer in this order:
   - `src/data/cases.ts`
   - `src/data/caseStories.ts`
   - `src/data/workEvidence.ts`
   - `src/data/availableSystems.ts` if adaptation status or positioning changes
   - `src/data/immersive.ts` for new immersive case entries
6. Run:

```bash
npm run lint
npm run build
```

7. Review:

- `/work`
- `/work/:slug`
- `/immersive`
- `/immersive/:slug` where applicable

## Session Reminder

The three priority refreshes are not small text tweaks. They should be treated as full case-content upgrades to reflect the new quality level of the underlying projects.
