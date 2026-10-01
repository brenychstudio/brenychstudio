# BSW-ECOSYSTEM-01A-R1 — Home forensic audit

## Authorities and interpretation

- Technical old Home: `main@86ab8566ecb15b20fc6f56d9b452aecd2f335959`.
- Rejected new Home: PR #14, `6b44e3ba3349b7449b17ce6d1f88883b0f681ef7`.
- Perceptual desktop references: `Home old.mp4` and `Home new.mp4` in the owner's Videos folder. Both are desktop captures; they do not establish mobile or tablet behavior.
- The old source determines motion mechanics. The PR #14 source determines the new information architecture and canonical project selection.

The old video shows a compact section rail, decisive full-bleed spatial transition, asymmetric overlapping media, generous negative space, and repeated scene framing. The new video retains a clearer ecosystem model but presents the map, two products, three evidence cases, spatial work, and Research / Worlds as mostly static equal-weight layouts. Cursor jumps in both recordings mean video timestamps are not reliable scene-duration specifications.

## Old Home motion inventory

| Old element | Source | Desktop behavior | Tablet behavior | Mobile behavior | Scroll dependency | Sticky dependency | Motion primitive | Media dependency | Disposition → R1 target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hero field | `src/pages/StudioIndex.tsx`, `src/ui/StudioHeroField.tsx` | Full-height signal field and oversized type | Separate `svh` type/CTA composition | Separate `svh` type/CTA composition | Pointer and scene entrance | No | WebGL field, type entrance | Old hero mounts two canvases | Keep PR #14 hero; adapt exit → Opening / Ecosystem |
| Section rail | `src/ui/SectionRail.tsx`, `src/ui/useSectionRailActive.ts` | Fixed portal rail, scroll-progress spring, active section, tone and footer behavior | No old rail | No old rail | rAF scroll/resize at 44–46% viewport anchor | No | Spring progress, active-state transition | None | Adapt seven-state desktop rail; add compact touch chapter navigation |
| Systems strand | `src/pages/StudioIndex.tsx`, `src/ui/StudioSystemStrand.tsx` | Sticky formula, scrolling proof rows, drawn connectors | Chapter and proof selector | Chapter, swipe proof stage, ledger | Yes | Desktop left stage | SVG path progress, ledger active state | Multiple proof surfaces | Adapt connection/progression grammar → Ecosystem Field / Research |
| WHISPER scene | `src/pages/StudioIndex.tsx` | 148vh scroll scene; video grows from scanline to full field, typography crossfades into dark | Distinct reader scene | Distinct spatial chapter | Yes | Desktop 100vh | Spring-driven scale/clip/tone | Managed video | Adapt, with one shared video instance → Spatial Chamber |
| Atlas scene | `src/pages/StudioIndex.tsx` | Staggered asymmetric media planes, drift, connectors, kinetic words | Separate chapter patterns | Old Home omitted mobile Atlas content | Yes | No | whileInView, scroll springs, pointer parallax | Multiple images/videos | Adapt asymmetry without omission → Evidence Choreography |
| Mobile proof stage | `src/pages/StudioIndex.tsx` | Not rendered | Touch selector and limited planes | Horizontal swipe with `pan-y`, Prev/Next, active/ghost planes | Local active state | No | Gesture threshold and active state | Ghost planes can attach extra sources | Adapt one-dominant-plane principle → Products / Evidence |
| Grammar and practice | `src/pages/StudioIndex.tsx` | Active rows, moving line, closing resolution | Reader/ledger composition | Chapter/ledger composition | Yes | No | Progress and ledger entry | None | Adapt → Research / Worlds / Collaboration |
| Mobile motion layer | `src/ui/mobile-motion/*`, `src/ui/MobileChapter.tsx`, `src/index.css` | Disabled at ≥1024 | IO entry states and tablet reader layout | IO entry states and phone-specific rhythm | IO, not continuous scroll | No | 520/680/320ms section/media/row timing | Poster-first media wrappers | Reuse directly across new IA |
| Home media runtime | `src/media/home/*` | Cold source, warm/active observers, poster until decoded frame | Same policy | Save-Data/reduced-motion aware; .25 active ratio | Intersection-based | No | Media lifecycle | Managed video | Keep unchanged → Spatial Chamber |

## Mobile and tablet architecture

`MOBILE_MOTION_BREAKPOINT=1024`. `useMobileMotion` disables entry motion for reduced motion and ≥1024, uses `IntersectionObserver`, and tracks active, in-view, and entered states. Section observer: threshold `.08`, root margin `0px 0px 18% 0px`; media: `.1`, `0px 0px 12% 0px`; ledger: `.01`, `-24% 0px -34% 0px`. Section/media are once-entry; ledger tracks current in-view state. CSS uses 520ms section, 680ms media, 320ms row, with 70/120ms staged delays.

The old Home mounted `MobileMotionSection` but did not directly mount `MobileMotionMedia` or `MobileMotionLedger`; those are preserved primitives suited to the new chapters. `PageSurface` supplies `mobile-interface-surface`. The old Home supplied `tablet-reader-surface`. At 768–1023 the old CSS changes reader width, type, chapter spacing, and ledger geometry; below 768 it changes header and `svh` handling, type scale, overflow protection, and media rhythm. PR #14 kept these files byte-identically but stopped mounting the Home nodes they target. Its only Home CSS breakpoints were ≤1100 and ≤600, leaving 601–767 and 768–1023 with compressed desktop geometry.

## R1 design decisions

1. Keep the PR #14 seven-state IA and its canonical project selector. Do not reintroduce old Home content order.
2. Remove generic whole-section fade/transform so pinned descendants remain reliable; each scene owns its motion.
3. Reuse the old rail and mobile motion observers. Add a compact touch chapter control; reserve desktop copy space for the portal rail.
4. Use source-derived responsive poster previews to avoid blank image frames on fast navigation; keep the existing managed video runtime and one Home video instance.
5. Express Research → Worlds as one DOM/SVG/CSS field, with a nonsticky tablet/mobile reading sequence and no second WebGL runtime.
6. Keep the old video's scene density and handoffs as perceptual targets. Do not copy its two-canvas hero, phone Atlas omission, or extra ghost video planes.

## Old / PR #14 / R1 comparison

| Feature | Old Home | PR #14 Home | R1 Home | Rationale |
| --- | --- | --- | --- | --- |
| Hero | Oversized signal/WebGL; two canvas implementation | Strong Products / Systems / Worlds hero | Keeps PR #14 hero, corrects seven-chapter count | Preserve best opening without old runtime cost |
| Section rail | Active desktop rail at ≥1280 | Absent | Seven-state rail ≥1024; compact touch chapters below | Restore place and progress awareness |
| Scroll choreography | Several sticky and progress-linked scenes | Mostly section fades | Field, product, spatial, and transformation stages | Recover authored progression |
| Products | Prior content model | Two parallel showcases | One active pinned desktop product; sequential tablet/phone chapters | Owned studio products, clear priority |
| Evidence | Asymmetric Atlas planes; phone omission | Three equal cards | Three asymmetric beats; complete touch chapters | Preserve WORK = EVIDENCE |
| Spatial | Scanline-to-field WHISPER | Two tiles on a dark block | Light threshold into pinned dark chamber and Orbit handoff | Make the transition an event |
| Research / Worlds | Systems and grammar mechanics | Two placeholder-like diagrams | One transforming field | Explain the system as progression |
| Mobile motion | Dedicated <1024 observer states | Mostly CSS stacking | Preserved section/media/ledger primitives | Reuse developed interaction system |
| Tablet | Dedicated 768–1023 reader classes | Compressed desktop | Reader geometry and controlled media planes | Tablet is its own composition |
| Media policy | Managed, poster-first | Managed, poster-first | Runtime unchanged; responsive still previews | Avoid blank proof and eager video |
| Performance | Two hero canvases and some ghost media | One hero environment | One hero environment, one managed video | Spend complexity on choreography |
| Clarity | Rich direction, older IA | Clearer new IA | New IA with restored direction | Protect the owner-approved conceptual model |

This is an implementation audit, not owner visual approval. Motion recordings and viewport checks remain the owner-review evidence.

## R1 verification

The production build passed the registry, integration, Home selector, and dist integrity checks. Their self-tests, video asset validation, route bundle validation and its self-test, TypeScript, and ESLint also passed; ESLint reported zero errors and 20 existing warnings outside the changed Home files. Scoped lint of the changed Home components reported no warnings.

`scripts/qa-home-r1.py` passed against the built site at 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080, and 1440×650. It checks initial media requests, horizontal safety, touch scroll, chapter and rail navigation, Product keyboard focus, Ecosystem scroll progression under pointer hover, and the Worlds state. Reduced-motion checks passed at 390 and 1440. It observed no application page errors or failed JavaScript/CSS requests.

The production Spatial lifecycle was checked separately: at the 18px scanline the managed video was unmounted with zero media requests; after the reveal reached 648px it attached one source; on return to the scanline it was hidden and paused. Fresh 390 loads requested neither the offscreen WHISPER poster nor its video. The Home media runtime source files were unchanged.

Reviewing the first tablet recording exposed inherited grid columns that compressed both Spatial cases at 768px. The tablet reader now assigns one full-width row to each case; the runtime QA asserts both planes use at least 90% of the field width. The tablet recording and checkpoints were refreshed after that fix.

Owner visual review remains pending. `scripts/capture-home-r1.py` produces repeatable phone, tablet, and desktop motion recordings and six-width screenshot checkpoints for that review.
