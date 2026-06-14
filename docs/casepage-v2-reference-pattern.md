# CasePageV2 Reference Pattern

Status: canonical Work case pattern.

Reference route:

```txt
/work/house-of-lune
```

House of Lune is the original reference pattern for non-immersive Work case pages. It defines the narrative engine, not a visual style to copy literally.

Public route:

```txt
/work/:slug
```

Hidden lab route:

```txt
/work-lab/:slug
```

## Canonical Order

```txt
01 Threshold / Hero
02 Walkthrough
03 Screens as Evidence
04 Proof becomes system
05 Available foundation
06 Final CTA
07 SiteFooterV2 variant="case"
```

## Scaling Principle

```txt
One CasePageV2 system.
Different case stories.
Different visual variants.
One quality bar.
```

New cases should be added through `src/data/caseStories.ts` and rendered through the same `/work/:slug` route. Do not duplicate `CasePageV2` per case.

## Current Validation Set

```txt
01 House of Lune - luxury product reference
02 Barcelona Private Advisory - light advisory / real estate validation
03 CreatorOps - workflow / product system validation
04 SprintCRM - internal CRM / operator workflow validation
05 FLUID - cultural exhibition / QR artist-page validation
06 FORM INDEX - editorial motion / presentation-system validation
07 ARCWAVE - bilingual service architecture validation
08 Casa Nube - hospitality / multilingual local-service validation
09 Print Border Studio - production tool validation
```

Public `/work/:slug` now renders `CasePageV2` for non-immersive Work cases. The previous detail renderer was removed during the final legacy cleanup; historical source remains available from the `archive/legacy-site-before-cleanup` git branch.

## Canonical Evidence Mode

`Screens as Evidence` uses the canonical inspection pattern for V2 cases:

```txt
Default mode: Flow
Secondary mode: Atlas
Initial visible frames: 5
Expanded state: Open full evidence field
```

Rules:

```txt
Flow keeps the cinematic large-frame reading path.
Atlas gives a compact grid scan without becoming a list.
Cases with more than 5 evidence frames show only the first 5 by default.
The remaining frames are revealed through Open full evidence field.
Cases with 5 or fewer evidence frames do not show the expansion CTA.
Every evidence card must still open the shared inspect modal.
```

This is now the canonical way to scale long case pages without turning them into a heavy screenshot catalogue.

## Canonical Inspect Reveal

The shared `CinematicInspectReveal` is the canonical image viewer for V2 cases.

Rules:

```txt
The active frame can change through wheel, arrow keys, swipe, next/prev buttons, or thumbnail click.
The bottom thumbnail rail must always follow the active frame.
When the active frame moves beyond the visible thumbnail window, the rail scrolls to keep it visible.
The active thumbnail should be centered when possible.
This behavior applies to every V2 case because the viewer is shared.
```

## Case Requirements

Each V2 case should provide:

```txt
1 hero media
1 walkthrough video or strong motion sequence
3-5 primary screens as evidence
optional extended evidence frames through the canonical Flow / Atlas field
1 mobile frame or mobile carousel when mobile evidence exists
proof claim
3 evidence points
system spine
available foundation status
technical trust rows
CTA copy
```

Immersive / WHISPER does not use this pattern. It needs a separate Spatial Proof Case Page.
