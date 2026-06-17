# Spanish Translation Layout Review

## Scope

This review covers the P0 Spanish localization layer prepared before public `/es` launch:

- shared UI dictionary;
- Home, Work, Offer, About and Immersive draft content;
- three service page translations;
- CreatorOps, House of Lune, Barcelona Private Advisory and WHISPER;
- Spanish SEO draft fields for P0 pages.

Spanish remains disabled. This review does not add public `/es` routes, hreflang, sitemap entries or canonical changes.

## Copy Review Outcome

The Spanish layer follows the glossary direction: premium, Spain-facing, restrained and editorial. Generic agency phrases were searched and were not found in `src`.

The main cleanup area was accidental Spanglish. Product and brand terms remain unchanged where they are part of the case system:

- CreatorOps
- Week Pack
- Smart Mix
- Client Review
- Profile Handoff
- Media Converter
- WHISPER
- WEBHERO

Generic English terms were reduced where Spanish reads better:

- `workflow` became `flujo de trabajo` or `flujo`;
- `workspace` became `espacio de trabajo`;
- `handoff` became `entrega`;
- `metadata` became `metadatos`;
- `deploy` became `despliegue`;
- `desktop` and `mobile` became `escritorio` and `móvil` in visible copy;
- `assets` became `recursos`;
- `screenshots` became `capturas`;
- `output` became `salida` or `resultado`;
- `custom` became `a medida`;
- `browsing` became `exploración`;
- `readiness` became `preparación`;
- `buyer-fit` became `encaje del comprador`.

## Longest Strings And Risk Areas

These strings are strong but should be visually checked once a Spanish preview route exists:

| Area | Spanish string | Risk |
| --- | --- | --- |
| Home hero | `Sistemas front-end premium para superficies web, producto e interfaz inmersiva.` | Long hero line on 390px / 430px. |
| Offer body | `Landing pages premium, demos de producto y sistemas web interactivos...` | Medium risk in narrow copy column. |
| Interactive service hero | `Sistemas web interactivos para experiencias digitales espaciales.` | Heading wrap should be checked on mobile. |
| Product demo body | `Sistemas de presentación para productos SaaS, herramientas AI, prototipos...` | Long body with several nouns; may need one shorter sentence. |
| CreatorOps proof claim | `El flujo de trabajo de creadores se convierte en sistema...` | High-density case proof text. |
| Barcelona proof claim | `La asesoría privada se convierte en sistema cuando intención de comprador...` | Longest P0 claim; likely needs visual inspection in case detail layout. |
| WHISPER status note | `El sitio público, la experiencia WebXR, la navegación con manos en Quest...` | Long technical status note. |
| Drawer subtitle | `Envía el contexto del proyecto, el calendario y los materiales disponibles.` | Low risk, but check button and drawer width. |

## Shortened Or Refined

- Replaced literal or heavy commercial wording with glossary-aligned terms.
- Kept `landing page` instead of `página de aterrizaje`.
- Kept `Servicios` for Spanish nav copy instead of `Oferta`.
- Reduced repeated English in service deliverables and proof text.
- Preserved technical terms where Spanish audiences expect them: `front-end`, `WebGL`, `WebXR`, `Quest VR`, `Open Graph`, `React`, `Vite`, `Tailwind CSS`.

## Layout Risk Notes

Spanish text is naturally longer than English. The most likely layout risks are:

- mobile hero headings on Home, Offer, About and Immersive;
- service page method rows and deliverable lists;
- case proof claims in CreatorOps and Barcelona Private Advisory;
- case media captions with technical labels;
- header nav if Spanish is shown together with all disabled locales;
- drawer title/subtitle and primary CTA at 390px.

No layout CSS changes were made in this task. English production output should remain unchanged.

## Local Preview Decision

Local `/es` preview routes were not implemented in this task.

Reason: the Spanish data layer exists, but the production page render path still outputs English and does not yet consume localized page/case/service data. Adding `/es` now would require route and render plumbing that belongs to the launch/staging phase, not this review pass.

Recommended next approach:

- keep `es.enabled = false`;
- add an environment-guarded preview in the Spanish route launch branch;
- only expose local preview with `import.meta.env.DEV && VITE_ENABLE_SPANISH_PREVIEW === "true"`;
- do not add sitemap, hreflang or canonical changes until public launch is approved.

## Required Visual QA Later

When Spanish rendering is connected, check:

- 390px
- 430px
- 768px
- 1024px
- 1366px

Focus on:

- no horizontal overflow;
- nav labels and CTA buttons fit;
- hero headings remain readable;
- service page rows do not become visually heavy;
- case media captions do not collide with surrounding content;
- drawer and footer remain clean.

## Status

- Spanish content reviewed: yes.
- Generic agency phrases avoided: yes.
- Long strings documented: yes.
- Spanish enabled: no.
- Public `/es` routes created: no.
- Hreflang added: no.
- Sitemap changed: no.
- Canonicals changed: no.
