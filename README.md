# Brenych Studio

Production portfolio and studio website for **Brenych Studio**: a premium front-end and creative development practice focused on interactive websites, product interfaces, service-entry pages, cinematic case systems, and selected immersive web experiences.

Live site: [https://brenychstudio.com](https://brenychstudio.com)

## Overview

Brenych Studio is built as more than a portfolio grid. The public site operates as:

- a studio positioning surface;
- a case-backed proof archive;
- a commercial offer layer;
- a quiet search-ready acquisition system;
- a front-end demonstration of the studio's own method.

The project combines editorial presentation, data-driven case architecture, route-level SEO, responsive case storytelling, immersive proof routes, and a shared inquiry system in one production React application.

## What Is Live

Primary public routes:

- `/`
- `/work`
- `/immersive`
- `/offer`
- `/about`
- `/privacy`
- `/legal`
- `/work/:slug`
- `/immersive/:slug`
- `/services/:slug`

Service-entry routes currently live:

- `/services/premium-landing-page`
- `/services/product-demo-landing`
- `/services/interactive-web-systems`

The codebase also includes hidden no-index routes used for alternate surfaces, labs, and controlled previews such as `/work-lab/:slug`, `/studio-index`, `/evidence-atlas`, `/offer-v2`, `/about-v2`, and `/spatial-proof`.

## Priority Systems

Current priority Work systems reflected in the live archive:

- `CreatorOps` - creator workflow product prototype with Library, Smart Mix, Planner, Captions, Export, Client Review, Profile Handoff, and Media Converter states.
- `Barcelona Private Advisory` - advisory and property-acquisition proof shaped around buyer intent, Barcelona Lens, shortlist dossier, inspection, and inquiry handoff.
- `ARCWAVE` - service and infrastructure system for telecom, networks, electricity, smart home, EV charging, security, and quote-request logic.
- `AUREL EON GT` - fictional premium automotive launch system built as a state-driven product experience.
- `House of Lune` - premium product-world presentation for luxury objects and private inquiry.
- `Oria House Barcelona`, `Casa Nube`, `SprintCRM`, `Print Border Studio`, `Form Index`, and `Fluid Exhibition` remain part of the featured archive surface.

Flagship Immersive systems currently represented in the project:

- `WHISPER` - cinematic Web / XR exhibition and collector-facing archive system.
- `WEBHERO` - living visual systems and spatial-proof R&D platform.
- `Kool Berk` - sonic object OS for audio-led immersive presentation.
- `Presence OS / Memory Atlas` - presence-driven archive and XR memory interface proof.
- `Orbit Lens` - fictional AI eyewear product interface with spatial reference and XR-aware proof layers.

The Work archive also supports an `Available Systems` layer for authored concepts that can be adapted into commissioned client work.

## Product Structure

The site is organized around a route-driven and data-driven architecture:

- `src/data/cases.ts` stores the core Work registry, including metadata, content structure, related services, links, tags, production facts, and Open Graph assets.
- `src/data/workEvidence.ts` and `src/pages/EvidenceAtlas.tsx` drive the Work archive, featured-system selection, filters, and evidence framing.
- `src/data/immersive.ts` powers immersive case metadata, media inventories, proof labels, links, and search-readable content.
- `src/data/servicePages.ts` defines the service-entry pages as structured commercial routes with shared proof references and delivery logic.
- `src/data/caseStories.ts` and `src/data/availableSystems.ts` extend the archive with deeper storytelling and adaptation-ready system framing.

This keeps content, proof structure, and visual systems separate enough to evolve without turning the site into a hard-coded portfolio.

## Technical Highlights

- React 19 + TypeScript + Vite front-end application
- Route-level SEO metadata and canonical URLs
- Structured data / JSON-LD output for organization, profile, cases, and service routes
- Sitemap and robots configuration in `public/`
- Dedicated service-entry pages that stay outside the main navigation
- Shared project inquiry drawer across major public routes
- Immersive and case-specific media systems for image, video, inspection, and walkthrough proof
- Locale content layer with English, Ukrainian, Spanish, and Russian dictionaries in `src/i18n/`
- Sound preference and interface audio system via `SoundProvider`, `useSound`, and the signal dock
- Cloudflare Pages deployment with pinned Node runtime via `.node-version`

## Stack

- React 19
- TypeScript
- Vite 8
- React Router 7
- Tailwind CSS v4
- Framer Motion
- Three.js
- React Three Fiber
- Drei
- Tone.js
- ESLint
- Sharp

## Repository Layout

```txt
src/
  App.tsx
  config/
  data/
  hooks/
  i18n/
  pages/
  stage/audio/
  store/
  ui/

public/
  cases/
  immersive/
  docs/
  og-default.png
  robots.txt
  sitemap.xml

scripts/
  optimize-case-images-to-webp.mjs
  relink-case-images-to-webp.mjs
  generate-development-playbooks.mjs
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Build production assets:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Node runtime for consistent local and Cloudflare builds is pinned in `.node-version`. The project currently targets:

```txt
^20.19.0 || >=22.12.0
```

## Deployment Notes

The site is deployed on **Cloudflare Pages**.

For production-safe publishing, the important checks are:

- successful `npm ci` and `npm run build`
- healthy public route responses
- correct canonical domain
- valid `sitemap.xml` and `robots.txt`
- working media assets on desktop and mobile
- stable no-overflow layout on public routes

## Canonical Baseline

Current approved baseline tag:

```txt
v1.0.0
```

Use it as a stable restore point when needed:

```bash
git checkout v1.0.0
```

## Profiles

- Website: [https://brenychstudio.com](https://brenychstudio.com)
- LinkedIn: [https://www.linkedin.com/in/brenych/](https://www.linkedin.com/in/brenych/)
- GitHub: [https://github.com/brenychstudio](https://github.com/brenychstudio)
- Instagram: [https://www.instagram.com/koolberk/](https://www.instagram.com/koolberk/)

## Notes

This repository is not a generic starter template. The code, content structure, case framing, brand language, and media direction are part of the Brenych Studio portfolio system and should be treated as authored work rather than reusable theme material.
