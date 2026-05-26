# Brenych Studio

Premium portfolio and interface system for Rostyslav Brenych, focused on cinematic web surfaces, multilingual product sites, evidence-led case studies, and selected immersive/WebGL experiences.

This repository contains the production front-end for the public Brenych Studio site.

## Canonical Version

Current canonical release: `v1.0.0`

The `v1.0.0` Git tag marks the approved project baseline and can be used as a stable restore point for future work.

```bash
git checkout v1.0.0
```

## Product Direction

Brenych Studio presents premium digital systems rather than generic portfolio cards. The site is built around:

- editorial studio positioning;
- evidence-led Work case studies;
- an Immersive hub with WHISPER as the flagship spatial proof;
- a focused Offer flow for commercial entry points;
- a compact About page centered on method, systems, and craft.

The visual language should remain restrained, cinematic, technical, and premium.

## Public Routes

- `/` - Studio Index home experience
- `/work` - Evidence Atlas / Work overview
- `/immersive` - Immersive interface systems hub
- `/offer` - commercial offer and route selector
- `/about` - method and studio profile
- `/privacy` - privacy policy
- `/legal` - legal information
- `/work/:slug` - canonical Work case pages
- `/immersive/whisper` - canonical Immersive flagship case

## Selected Systems

- `CasePageV2` - canonical non-immersive Work case renderer
- `WhisperCaseLayout` - canonical Immersive case renderer
- `CinematicInspectReveal` - shared proof/media inspect surface
- `ProjectDrawerV2` - project intake drawer
- `MobileMotion*` - lightweight mobile scroll reveal foundation
- `SoundProvider` and signal dock - site sound preference and interface feedback

## Featured Case Directions

### WHISPER

Immersive photographic archive proof across web, mobile, print, AR, and room-scale presence.

### House of Lune

Luxury product reference case with visual proof surfaces and mobile-first evidence framing.

### Barcelona Private Advisory

Advisory and real estate discovery experience focused on trust, shortlist logic, and private inquiry.

### CreatorOps

Workflow/product prototype for content planning, export flows, and operator-facing utility.

### FLUID

Cultural exhibition microsite with QR-driven artist pages and unified digital identity.

## Technical Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Framer Motion
- Three.js / React Three Fiber / Drei
- Tone.js
- ESLint

## Development

Install dependencies:

```bash
npm install
```

Run local development:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Quality Standard

Before publishing meaningful changes, verify:

- `npm run lint`
- `npm run build`
- mobile viewport sanity at 390px, 430px, 768px, and 1024px
- desktop sanity at 1366px and wide desktop
- no horizontal overflow on public mobile routes
- hero content visible immediately on mobile
- media, video, WebGL, and proof surfaces retain their approved visual quality
- reduced-motion users still receive readable, stable content

## Repository Notes

Working briefs, handoff notes, QA exports, logs, build output, and local browser artifacts are intentionally kept out of Git.

The public README should stay presentation-focused. Internal planning and implementation history should live in local-only brief files or ignored artifacts.
