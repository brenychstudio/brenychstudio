# House of Lune Case Page - Work Summary / 2026-05-16

## Context

Today we continued polishing the first canonical case page: `House of Lune`.

Main goal: bring the case page closer to the quality level of the strongest site surfaces (`Home`, `Work`, `Immersive`) and turn the case layout into a repeatable system that can later scale to other case studies.

Primary files touched:

- `src/pages/CasePageV2.tsx`
- `src/ui/work/CinematicInspectReveal.tsx`
- `src/data/caseStories.ts` was used as the data source/context for House of Lune content and media.

Current route used for review:

- `http://localhost:5173/work-lab/house-of-lune`

## What Was Implemented

### 1. Lower Case Architecture Was Reduced And Rebuilt

The lower part of the page previously felt too long, repetitive, and document-like.

The intended structure is now:

1. `04 - Proof becomes system`
2. `05 - Available foundation / Trust`
3. `06 - Final conversion`
4. calm closing footer

This removed the earlier feeling of:

- proof section
- availability section
- technical trust section
- CTA section
- another footer CTA

The page now has a cleaner narrative:

- proof is synthesized
- system becomes available by commission
- user gets one strong conversion close

### 2. Section 04 Was Rebuilt As A System Map

The biggest issue near the end of the session was that sections 04 and 05 looked too similar:

- both had a huge headline on the left
- both used a large dark image/card
- both felt like variants of the same template

Decision made:

- Section 04 should not be another dark media card section.
- Section 04 should become a light `proof constellation / system map`.
- Section 05 can keep the dark dossier/blueprint role.

Implemented in `ProofBecomesSystem`:

- removed the dominant large dark tilted proof card from 04
- added a lighter system-map composition
- kept the large `Proof becomes system.` headline
- added `System claim`
- kept three proof nodes:
  - Product focus
  - Private inquiry
  - Commercial trust
- added small clickable `evidence stamps` instead of one large image
- preserved a compact `System spine`:
  - Visual direction
  - Content architecture
  - Motion grammar
  - Inquiry flow
  - Responsive structure
  - Production front-end

Result:

- 04 now reads more like synthesis / atlas / investigation map.
- 05 reads more like commission / availability / business trust.
- The two sections no longer repeat the same visual role.

### 3. Section 05 Was Kept As Commission Dossier

Section 05 now works as the darker, more commercial section:

- `Available foundation.`
- adaptation statement
- fit/adaptation/terms rows
- compact technical trust rail
- dark blueprint-like media block
- single `Adapt this system` action

This section should remain the more grounded commercial/passport moment after the abstract proof-map in 04.

### 4. Section 06 Was Simplified Into One Final CTA

The previous duplicate CTA rhythm was reduced.

The closing logic is now:

- one main CTA section:
  - `Adapt this system - or build one with the same clarity.`
- small supporting `Next move` panel
- buttons:
  - Adapt this system
  - Start a project
  - Back to Work
- footer becomes quieter and does not repeat a giant sales headline

### 5. Screens Section Readout Was Simplified

The cheap-looking proof cards in `Screens as evidence` were replaced with a cleaner inspection readout.

Current readout direction:

- less blocky
- fewer repeated boxes
- more like a thin editorial proof note

Current signals:

- Full surfaces
- Motion behind detail
- Desktop + mobile

### 6. Mobile Surface Rail Got Scroll-Captured Carousel Behavior

In the mobile phone screenshot carousel:

- when the user scrolls into the mobile rail section on desktop
- vertical wheel scroll can temporarily move through the phone states
- after the rail reaches the beginning/end, normal page scroll continues
- disabled on mobile/coarse pointer and reduced-motion contexts

This makes the phone screenshots feel more cinematic and less like a static carousel.

### 7. Cinematic Inspect Reveal Got Wheel Navigation

In the full-screen case image inspector:

- mouse wheel / trackpad scroll now changes frames
- scroll down goes next
- scroll up goes previous
- wheel input is throttled to avoid skipping through all frames too quickly
- direction now influences the frame transition motion
- keyboard arrows, buttons, thumbnails, and touch swipe still work

File:

- `src/ui/work/CinematicInspectReveal.tsx`

### 8. Small Bug Fix In Mobile Surface Copy

The mobile surface caption had a line break issue where a word wrapped awkwardly and the caption block pushed into the phone cards.

The caption was shortened so it fits more cleanly in one line/compact rhythm.

## Visual Direction Decisions Made

These should guide tomorrow's work and later case-page scaling:

- Case pages should not become presentation decks.
- Avoid repeating large headline + dark card + ledger in every lower section.
- Each major section needs a distinct role:
  - Hero: cinematic identity / threshold
  - Walkthrough: motion proof
  - Screens: inspection / evidence
  - Proof: synthesis / system map
  - Available: commercial dossier / commission logic
  - Final CTA: decision surface
- Dark media blocks are powerful, but only if they are not used in every section.
- Lower case sections should feel like premium evidence surfaces, not generic content blocks.
- `House of Lune` mood:
  - moonlit object theatre
  - private inquiry
  - restrained luxury
  - editorial darkness
  - desire-first commerce

## Verification Done

Command run successfully:

```bash
npm run build
```

Result:

- TypeScript build passed.
- Vite production build passed.
- Only the existing Vite warning remains: some chunks are larger than 500 kB.

Visual checks:

- Headless screenshot checks were created in `exports/`.
- Latest relevant visual check:
  - `exports/case-proof-system-cdp-2.png`

Observed after the latest 04 rebuild:

- Section 04 no longer looks like a duplicate of section 05.
- The proof-map idea is working better.
- The new evidence-stamps are readable and do not dominate the section.

## What Still Needs Work

### 1. Continue Polishing Section 04

The new direction is correct, but it may still need visual refinement:

- improve spacing between proof nodes and evidence stamps
- tune the orbit/line system so it feels intentional, not decorative
- maybe make the three proof nodes feel more like connected system points
- decide whether the small left `Evidence logic / Proof nodes / System spine` rail is useful enough or too explanatory
- check mobile/tablet layout carefully

Important: do not return to the previous large dark proof-card layout in 04.

### 2. Compare Against Home / Work / Immersive Again

Tomorrow, open:

- Home
- Work
- Immersive
- House of Lune case

Compare specifically:

- density
- atmosphere
- rhythm
- quality of section transitions
- whether 04/05/06 feel canonical enough for future cases

### 3. Review Section 05 After 04 Settles

Now that 04 changed, 05 should be reviewed again in context.

Potential refinements:

- make the dark dossier block feel even more like a commission blueprint
- reduce any remaining spreadsheet/table feeling
- ensure the technical trust rail feels premium and not like a feature checklist

### 4. Check Responsive Behavior

Needed viewports:

- desktop wide
- 1440-ish laptop
- tablet
- mobile

Pay special attention to:

- huge headlines fitting cleanly
- section 04 proof map stacking
- evidence stamps not feeling random on mobile
- section 05 dark blueprint block height
- final CTA readability
- side rail overlap
- sound dock overlap

### 5. Consider Creating A Canonical Case Section Pattern

Once House of Lune feels locked, extract the lessons into reusable section logic or at least a clear internal pattern:

- case hero
- walkthrough proof
- screen inspection
- proof map
- availability dossier
- final conversion

Do not abstract too early, but keep this in mind because the user wants this to scale across future cases.

## Known State / Caution

The worktree already contains many modified and untracked files outside this session. Do not reset or clean the repo casually.

The key case files currently appear as untracked in git:

- `src/pages/CasePageV2.tsx`
- `src/ui/work/CinematicInspectReveal.tsx`
- `src/data/caseStories.ts`

This likely reflects the broader in-progress case-page build. Treat them as active project files and do not revert them.

## Recommended Start Tomorrow

1. Run or open the dev server:

```bash
npm run dev
```

2. Open:

```txt
http://localhost:5173/work-lab/house-of-lune
```

3. Jump to section 04 and inspect it against section 05.

4. Decide whether to polish only spacing/visual grammar, or do one more concept pass on the proof-map.

5. After visual polish, run:

```bash
npm run build
```

