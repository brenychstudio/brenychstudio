# Spanish Preview

Spanish is not public yet.

To enable local preview:

1. Create `.env.local`.
2. Add:

```txt
VITE_ENABLE_SPANISH_PREVIEW=true
```

3. Run:

```bash
npm run dev -- --force
```

4. Open:

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

Production rule:

Do not set `VITE_ENABLE_SPANISH_PREVIEW=true` in production until the public Spanish launch is approved.

Current safety rules:

- Spanish remains disabled by default.
- `/es` preview routes are only registered when the preview flag is enabled.
- Spanish preview pages must remain `noindex, nofollow`.
- No Spanish URLs are added to sitemap during preview.
- No `hreflang` is added during preview.
- No browser-language redirects are used.
