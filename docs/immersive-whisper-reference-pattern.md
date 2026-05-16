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
3. Desktop web exhibition proof
4. Quest XR proof
5. Collector continuation
6. Mobile proof
7. Engine ledger / canon statement

## Borrowed Canonical Features

- From Work V2: evidence-led structure, proof-first language, and shared cinematic inspect reveal.
- From Immersive V2: spatial threshold atmosphere, proof-as-room logic, and engine-led framing.
- From Spatial Proof: dedicated Quest / mobile / collector proof surfaces.
- From StudioIndex: WHISPER as the first completed spatial proof, not just a website case.

## Media Rules

- Keep all WHISPER media in `public/immersive/Whisper`.
- Desktop stills should include `whisper-hero.jpg` and `whisper-1.jpg` through `whisper-10.jpg`.
- Quest stills should include `whisper-vr-1.jpg` through `whisper-vr-3.jpg`.
- Mobile stills should include `whisper-mb-1.jpg` through `whisper-mb-6.jpg`.
- Videos should include hero, desktop walkthrough, and Quest capture.
- Screenshot proof cards must use `object-contain` so project UI is not cropped.
- Do not duplicate exact image files in the media inventory.

## Future Immersive Case Guidance

Future Immersive cases should inherit the structure, not the WHISPER art direction. The reusable idea is:

- enter through a spatial threshold;
- explain the system through an atlas;
- separate proof by surface or device;
- make screenshot inspection feel like an immersive mode;
- end with an engine ledger that clarifies what can be reused.

