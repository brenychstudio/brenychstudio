# Legacy Archive

Date: 2026-05-18

## Status

The classic site routes have been detached from the production router. The legacy source files are intentionally retained as a reference archive for future comparison, extraction, or cleanup.

The canonical public system is now the V2 site:

- `/`
- `/work`
- `/immersive`
- `/offer`
- `/about`
- `/privacy`
- `/legal`
- `/work/:slug`
- `/immersive/whisper`

## Detached Classic Routes

These routes no longer resolve as active pages in `src/App.tsx`:

- `/home-classic`
- `/work-classic`
- `/work-classic/:slug`
- `/immersive-classic`
- `/offer-classic`
- `/about-classic`
- `/privacy-classic`
- `/legal-classic`

They should now fall through to the app fallback instead of loading classic pages.

## Retained Reference Files

The following legacy page files remain in the repository on purpose:

- `src/pages/Home.tsx`
- `src/pages/WorkArchive.tsx`
- `src/pages/CasePage.tsx`
- `src/pages/Immersive.tsx`
- `src/pages/Offer.tsx`
- `src/pages/About.tsx`
- `src/pages/Privacy.tsx`
- `src/pages/Legal.tsx`

Legacy/reference support files also remain for now:

- `src/data/*CaseI18n.ts`
- `src/ui/HomeStageBridge.tsx`
- `src/ui/MetamorphStageGL.tsx`
- `src/ui/StickySignalStage.tsx`
- `src/ui/RightCircuitStage.tsx`
- `src/ui/work/CaseMotionProof.tsx`
- `src/ui/work/CaseMobileShowcase.tsx`

## Archive Checkpoint

A local Git branch was created before detaching the classic routes:

- `archive/legacy-site-before-cleanup`

This branch points to the launch-ready state where the hidden classic routes still existed.

## Next Cleanup Pass

Physical deletion is deferred to a later `LEGACY-CLEANUP-02` pass after the live V2 site has remained stable.

That later pass should:

- confirm no public or reference route imports the classic files,
- remove only files that are definitely unused,
- rerun lint, build, and route smoke checks,
- update this document and the README with the final cleanup result.
