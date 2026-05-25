# Immersive WHISPER Reference Pattern

WHISPER is the canonical V1 flagship case for future Immersive work. It is not a `CasePageV2` variant; it uses a dedicated spatial case structure because the project has more surfaces, more proof layers, real XR media, and a mobile-specific proof route.

As of 2026-05-26, `/immersive/whisper` is the reference page for mobile adaptation of Immersive cases. Future Immersive cases should inherit the structure, interaction grammar, and mobile section logic from WHISPER, not its exact artwork or copy.

## Route And Files

- Public route: `/immersive/whisper`
- Route shell: `src/pages/ImmersiveCasePage.tsx`
- Main renderer: `src/ui/immersive/WhisperCaseLayout.tsx`
- Case data: `src/data/immersive.ts`
- Engine data: `src/data/immersiveSystems.ts`
- Shared inspect system: `src/ui/work/CinematicInspectReveal.tsx`

## Canonical Page Order

1. Spatial threshold / flagship hero
2. Spatial atlas / connected surfaces
3. Desktop web exhibition proof
4. Spatial evidence field
5. Quest XR proof
6. Collector handoff
7. Mobile proof
8. Engine ledger / canon statement
9. Compact Immersive case footer

## Mobile V1 Canon

The mobile version is not a reduced desktop page. It is the canonical compact Immersive case structure:

- each section should have one clear job and one primary visual idea;
- long explanatory copy is reduced to a short proof statement;
- badges and chips are kept only when they clarify the current surface or proof state;
- horizontal swipe/orbit systems replace long vertical screenshot stacks;
- video proof can bleed to viewport width when it helps the section feel cinematic;
- mobile screenshots should use a phone-body stage when the device itself is part of the proof;
- side previews may enter the scene, but the active media must stay visually dominant;
- dense technical details collapse into ledger rows instead of large repeated cards;
- footer content must become a compact closing signal, not a second full landing page.

The current mobile section pattern is:

- `01 Threshold`: compact flagship hero with a strong media plane and supporting Quest/mobile proof traces.
- `02 Atlas`: swipe atlas for Web / Quest / Collector / Mobile surfaces.
- `03 Web`: full-width mobile video proof and short live-capture caption.
- `03.1 Evidence`: mobile proof orbit instead of a classic screenshot carousel.
- `04 XR`: viewport-width Quest video plus swipe orbit for headset stills.
- `05 Collector`: short object-handoff chamber with layered print / AR visuals.
- `06 Mobile`: phone-body swipe orbit for six handheld states.
- `07 Engine`: compact canon ledger with primitives, operating rules, and one milestone CTA.
- Footer: mobile-only compact closing signal with one CTA and minimal navigation.

## Borrowed Canonical Features

- From Work V2: evidence-led structure, proof-first language, and shared cinematic inspect reveal.
- From Immersive V2: spatial threshold atmosphere, proof-as-room logic, and engine-led framing.
- From Spatial Proof: dedicated Quest / mobile / collector proof surfaces.
- From StudioIndex: WHISPER as the first completed spatial proof, not just a website case.

## Spatial Evidence Field

The web screenshot section should not behave like a normal archive grid. WHISPER uses a spatial evidence field:

- screenshot planes sit in one controlled horizontal field;
- drag, wheel, dots, and next controls all move the same active frame state;
- the field snaps toward the closest proof frame instead of free-floating endlessly;
- clicking a frame centers and focuses it;
- a focused frame can open the shared cinematic inspect reveal;
- closing focus returns the user to field exploration without leaving the section.

This is the canonical Immersive replacement for a flat screenshot grid.

## Spatial Atlas Map

The atlas should not be a table of rows. WHISPER now treats the atlas as a living spatial map:

- web, Quest, collector, and mobile surfaces appear as active media planes;
- selecting a surface changes the active proof narrative without leaving the section;
- mobile uses a swipe atlas with one dominant media surface and side previews;
- the map uses room lines, orbit language, and controlled atmospheric framing;
- the atlas stays explanatory, but it should feel like a system map rather than documentation.

## Surface Chambers

Collector and mobile proof sections are dedicated chambers, not generic case layouts:

- Collector handoff stages edition detail, AR preview, and notes as one object / print / AR handoff room.
- Mobile proof uses a dark cinematic phone orbit so handheld screenshots swipe sideways instead of extending the page vertically.
- Quest and evidence stills use swipe/orbit behavior on mobile to avoid long stacked proof lists.
- Engine ledger CTAs stay inside the immersive system language and should not become a normal marketing card.

## Footer Rule

Immersive case footers must be short on mobile. The footer should close the page with:

- one concise closing statement;
- one project CTA;
- brand signal;
- route links;
- only essential external/legal links.

Do not repeat the full case argument in the footer. The Engine ledger already carries the final proof logic.

## Atmospheric Color Wash

Immersive pages can shift tone between sections through a wash-like section transition. The goal is not decorative color blocking; the next section should feel like it enters the current room and changes the atmosphere gradually.

## Media Rules

- Keep all WHISPER media in `public/immersive/Whisper`.
- Desktop stills should include `whisper-hero.jpg` and `whisper-1.jpg` through `whisper-10.jpg`.
- Quest stills should include `whisper-vr-1.jpg` through `whisper-vr-3.jpg`.
- Mobile stills should include `whisper-mb-1.jpg` through `whisper-mb-6.jpg`.
- Videos should include hero, desktop walkthrough, and Quest capture.
- Screenshot proof cards must use `object-contain` so project UI is not cropped.
- Do not duplicate exact image files in the media inventory.
- Spatial evidence frames should stay inspectable through `CinematicInspectReveal`.

## Future Immersive Case Guidance

Future Immersive cases should inherit the structure, not the WHISPER art direction. The reusable idea is:

- enter through a spatial threshold;
- explain the system through a living spatial atlas map;
- separate proof by surface or device;
- treat collector and mobile proof as atmospheric chambers;
- turn large screenshot sets into a spatial evidence field;
- make screenshot inspection feel like an immersive mode;
- end with an engine ledger that clarifies what can be reused;
- keep the mobile footer compact and action-oriented.

## Validation Baseline

Before treating an Immersive case as aligned with this pattern:

- `npm run build` must pass;
- mobile viewport should not have horizontal overflow;
- active media must not blur after swipe/scroll animations settle;
- mobile screenshots should not stack into a long vertical archive;
- section copy should remain compact and surface-specific;
- footer should not dominate the end of the mobile page.
