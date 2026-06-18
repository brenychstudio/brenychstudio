# Project Brief Current Status

Last updated: 2026-06-18

## Current Production State

- Live production domain: `https://brenychstudio.com`
- English remains the default version.
- Spanish is now prepared for public production launch under `/es`.
- Ukrainian and Russian remain disabled placeholders.
- Browser-language redirects were not added.
- Query params, hash routes, cookies and localStorage are not used for language selection.

## Completed Multilingual Work

- `MULTILINGUAL-00` - i18n architecture foundation.
- `MULTILINGUAL-01A` - Spanish glossary and content matrix.
- `MULTILINGUAL-01B / 01C` - reviewed Spanish content layer.
- `MULTILINGUAL-02A` - Spanish preview routing behind `VITE_ENABLE_SPANISH_PREVIEW=true`.
- `MULTILINGUAL-02B` - public Spanish launch with SEO, self-canonicals, hreflang and sitemap entries.

## Public Spanish Scope

Spanish public routes:

```txt
/es
/es/work
/es/offer
/es/about
/es/immersive
/es/services/premium-landing-page
/es/services/product-demo-landing
/es/services/interactive-web-systems
/es/work/creatorops
/es/work/house-of-lune
/es/work/barcelona-private-advisory
/es/immersive/whisper
```

Only Spanish-ready P0 case detail pages are public. Non-P0 Spanish case or immersive detail routes redirect back to the relevant Spanish index instead of rendering mixed English fallback content.

## SEO State

- English pages keep their existing canonical URLs.
- Spanish public pages use self-canonical `/es` URLs.
- Public EN/ES route pairs expose bidirectional `hreflang` alternates for `en`, `es` and `x-default`.
- Spanish public pages are indexable.
- `public/sitemap.xml` includes only Spanish P0 public URLs.
- `public/sitemap.xml` does not include `/uk` or `/ru`.
- `public/robots.txt` does not block `/es` and keeps the production sitemap reference.

## Locale State

- `en`: enabled.
- `es`: enabled.
- `uk`: disabled.
- `ru`: disabled.

The preview flag can remain in the codebase for future internal staging work, but public Spanish no longer depends on it.

## QA Baseline

Latest local checks:

```bash
npm run lint
npm run build
```

Results:

- `npm run lint` passed with 0 errors and the existing 7 unrelated warnings.
- `npm run build` passed with the existing Vite large chunk warning.

## Next Deployment Checklist

After pushing the launch commit and Cloudflare deployment:

1. Check `https://brenychstudio.com/`.
2. Check the priority Spanish pages under `/es`.
3. Check `https://brenychstudio.com/sitemap.xml`.
4. Check `https://brenychstudio.com/robots.txt`.
5. Resubmit `sitemap.xml` in Google Search Console.
6. Request indexing for the priority Spanish URLs only.
