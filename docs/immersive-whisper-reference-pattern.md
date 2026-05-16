# Immersive WHISPER Reference Pattern

WHISPER is the canonical flagship case for future Immersive work. It is not a `CasePageV2` variant; it uses a dedicated spatial case structure because the project has more surfaces, more proof layers, and real XR media.

## Route And Files

- Public route: `/immersive/whisper`
- Route shell: `src/pages/ImmersiveCasePage.tsx`
- Main renderer: `src/ui/immersive/WhisperCaseLayout.tsx`
- Case data: `src/data/immersive.ts`
- Engine data: `src/data/immersiveSystems.ts`
- Shared inspect system: `src/ui/work/CinematicInspectReveal.tsx`

## Canonical Page Order

1. Spatial threshold / flagship hero
2. Spatial atlas
3. Desktop web walkthrough video
4. Spatial evidence field
5. Quest XR proof
6. Collector continuation
7. Mobile proof
8. Engine ledger / canon statement

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
- the map uses room lines, orbit language, and dark atmospheric framing;
- the atlas stays explanatory, but it should feel like a system map rather than documentation.

## Surface Chambers

Collector and mobile proof sections are dedicated chambers, not generic case layouts:

- Collector continuation stages edition detail, AR preview, and notes as one object / print / AR handoff room.
- Mobile proof uses a dark cinematic phone field so handheld screenshots remain part of WHISPER's atmosphere.
- Engine ledger CTAs stay inside the immersive system language and should not become a normal cream conversion card.

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
- end with an engine ledger that clarifies what can be reused.
