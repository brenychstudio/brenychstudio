# R2 video delivery

Large public videos are served from Cloudflare R2 through a custom domain, so a
high-quality video is never limited by the Cloudflare Pages per-asset size. The
application itself still deploys on Cloudflare Pages.

```text
Cloudflare Pages          application code and lightweight assets
Cloudflare R2             large public video objects
media.brenychstudio.com   production media origin (R2 custom domain)
Video Asset Registry      src/media/video/videoAssets.ts
Resolver                  src/media/video/videoResolver.ts → LOCAL or R2 URL
```

## Fixed configuration

```text
Bucket:               brenychstudio-media
Storage class:        Standard
Custom domain:        media.brenychstudio.com
r2.dev:               disabled for production
CORS source:          ops/cloudflare/r2-video-cors.json
Edge caching:         Cloudflare default (.mp4 is default-cacheable)
Cache-Control:        object metadata, authoritative
/video/* Cache Rule:  optional (see "Optional explicit cache rule")
```

Production traffic always uses `https://media.brenychstudio.com`. The origin is
declared once, as `VIDEO_MEDIA_ORIGIN` in `src/media/video/videoAssets.ts`; no
other source file may contain it (`npm run video:validate` enforces this).

## Object keys

```text
video/<project>/<surface>/<asset>-vNNN.<ext>
```

Examples: `video/whisper/home/hero-v001.mp4`,
`video/weekfield/case/walkthrough-v001.mp4`.

- lowercase kebab-case segments under the `video/` namespace;
- stable project, semantic surface, semantic asset name;
- a production object is immutable: never overwrite an existing version;
- a replacement uploads the next version (`v002`, `v003`, …);
- the registry switches to a new key only after it has been verified;
- no secrets or local machine paths in object names.

Every object is uploaded with:

```text
Content-Type:  video/mp4  (or the file's real media type)
Cache-Control: public, max-age=31536000, immutable
```

Because keys are versioned, a normal release never needs a cache purge; purge is
an exception.

## Cache policy

Current canonical video delivery uses versioned `.mp4` objects. Cloudflare caches
`.mp4` through the custom-domain CDN by default. Object metadata remains
authoritative:

```text
Cache-Control: public, max-age=31536000, immutable
```

A dedicated `/video/*` Cache Rule is **optional** for the current MP4-only
contract. It may be added later (see "Optional explicit cache rule") if:

- non-default-cacheable extensions are introduced;
- cache eligibility needs to be forced independently of extension;
- future policy requires explicit path-scoped cache behavior.

The current production foundation has been verified live on the smoke object
(`.bin`, also default-cacheable) with `CF-Cache-Status: MISS → HIT`, `Age: 0 → 11`
and the immutable `Cache-Control` above, without a dedicated rule.

## Registry and resolver

Consumers never hold a storage path. They ask for a stable asset ID:

```ts
import { resolveVideoAsset } from "../media/video/videoResolver";

const src = resolveVideoAsset("weekfield.case.walkthrough");
```

Each registry entry records its delivery mode:

```text
delivery: "local"  → localPath, e.g. /cases/creatorops/v2/creatorops-video.mp4
delivery: "r2"     → https://media.brenychstudio.com/<r2.key>
```

Every current entry also carries its planned `r2.key` (`-v001`), so a future
migration is an upload plus a delivery switch, not a renaming task.

`npm run video:validate` (static, no network) fails on duplicate IDs, IDs that
do not match their key, invalid delivery values, missing or non-MP4 local paths,
missing local files, R2 keys outside `video/`, unversioned keys, version/key
mismatches, duplicate keys, a `/cases/**.mp4` or `/immersive/**.mp4` literal
outside the registry, the media origin outside the registry, and unknown IDs
passed to `resolveVideoAsset`. During BSW-VIDEO-01A it also fails if any asset
is not `local`.

## BSW-VIDEO-01A: current videos stay local

Every current video keeps `delivery: "local"` and its existing file under
`public/cases/**` or `public/immersive/**`.

**Do not upload any current production video to R2 in BSW-VIDEO-01A.** Do not
re-encode, replace or delete current files. The only object in the bucket at
this stage is the technical smoke object below.

## One-time infrastructure setup

Dashboard: Cloudflare → R2 Object Storage.

1. Create bucket `brenychstudio-media`, storage class **Standard**. Do not create
   other buckets.
2. Bucket → Settings → Custom Domains → connect `media.brenychstudio.com`.
   Wait until the status is **Active**; do not continue on Pending or Error.
3. Bucket → Settings → Public Development URL (`r2.dev`): keep it **disabled**.
4. Bucket → Settings → CORS Policy: apply the rule in
   `ops/cloudflare/r2-video-cors.json`. The dashboard editor takes the JSON
   array of rules, i.e. the value of `rules` in that file. Never replace an
   origin with a bare `*`. If the provider rejects part of the rule (for example
   the wildcard Pages-preview origin, `HEAD`, or the `Range` header), record the
   exact error and apply the smallest supported equivalent that still allows
   GET, Range and those origins.
5. Create the smoke object locally (4096 deterministic bytes):

   ```bash
   node -e "const fs=require('fs'); const b=Buffer.alloc(4096); for(let i=0;i<b.length;i++) b[i]=i%251; fs.writeFileSync('/tmp/r2-foundation-smoke-v001.bin',b)"
   ```

6. Upload it as `video/_system/r2-foundation-smoke-v001.bin` with:

   ```text
   Content-Type:  application/octet-stream
   Cache-Control: public, max-age=31536000, immutable
   ```

   The metadata must be set at upload. With an already-authenticated Wrangler,
   run from outside this repository (Wrangler is not a project dependency):

   ```bash
   npx wrangler r2 object put \
     brenychstudio-media/video/_system/r2-foundation-smoke-v001.bin \
     --file=/tmp/r2-foundation-smoke-v001.bin \
     --content-type=application/octet-stream \
     --cache-control="public, max-age=31536000, immutable" \
     --remote
   ```

The smoke object is not production content. It may stay as a health object or
be removed after verification.

No cache rule is part of the required setup; see "Cache policy".

## Optional explicit cache rule

Not required for the current MP4-only contract. Add it only when one of the
conditions in "Cache policy" applies. Zone `brenychstudio.com` → Caching →
Cache Rules → create one rule:

```text
Hostname equals media.brenychstudio.com
AND URI Path starts with /video/
→ Cache eligibility: Eligible
→ Edge TTL: use cache-control header if present (respect origin)
```

Do not add a site-wide cache rule, and do not modify unrelated cache rules.
Creating it needs zone Cache Rules edit permission.

## Verification

```bash
curl -sS -I https://media.brenychstudio.com/video/_system/r2-foundation-smoke-v001.bin
curl -sS -D - -o /dev/null -H "Range: bytes=0-1023" \
  https://media.brenychstudio.com/video/_system/r2-foundation-smoke-v001.bin
node scripts/verify-r2-video-foundation.mjs \
  --preview-origin=https://<branch>.brenychstudio.pages.dev
```

The script requires HEAD and GET `200`, `Content-Type: application/octet-stream`,
`Content-Length` over 1024, the immutable `Cache-Control`, a Range request answering
`206` with `Content-Range: bytes 0-1023/…` and a 1024-byte body, and
`Access-Control-Allow-Origin` echoing both the production and the preview origin.
It prints `R2_FOUNDATION_VERIFY=PASS`.
It also records `Accept-Ranges`, `ETag`, `CF-Cache-Status` and `Age`. A MISS then
HIT is expected across two GETs but not required; when a POP does not show a stable
HIT, confirm the object's `Cache-Control` metadata and, only if the optional
`/video/*` rule has been added, that it is active.

Finally list the bucket: under `video/` only
`video/_system/r2-foundation-smoke-v001.bin` may exist during BSW-VIDEO-01A.

## Future high-quality video workflow (BSW-VIDEO-01B)

1. Select the stable asset ID in the registry.
2. Prepare the high-quality, browser-safe master (codec contract below).
3. Choose the next immutable version for its key.
4. Before uploading, `curl -sS -o /dev/null -w '%{http_code}' -I https://media.brenychstudio.com/<key>`
   must return `404`. If it returns `200`, stop: that version exists and must
   not be overwritten; use the next version.
5. Upload to R2 with `Content-Type: video/mp4` and
   `Cache-Control: public, max-age=31536000, immutable`.
6. HEAD verify: status, Content-Type, Content-Length, Cache-Control.
7. Range verify: `206` and a valid `Content-Range`.
8. Browser preview of the object.
9. Switch the registry entry from `local` to `r2` with the verified key/version.
10. `npm run video:validate`, build, test, deploy.
11. Production playback QA.
12. Keep the local fallback file until the R2 version is accepted.

## Codec contract for new masters

```text
container:            MP4
video codec:          H.264 / AVC
pixel format:         yuv420p
progressive playback: faststart (moov atom first)
audio:                AAC when audio exists
```

HEVC is not the universal baseline. It may only appear later as an optional
secondary format with a safe H.264 fallback.

## Secrets

Never commit Cloudflare API tokens, R2 access-key IDs, R2 secret keys, account
passwords or bearer tokens. The bucket name, public domain, object keys, CORS and
cache templates, registry metadata and these instructions are public.

## Out of scope

No Cloudflare Stream, Workers proxy, HLS/DASH or adaptive bitrate, signed URLs,
private video auth, upload UI, automatic transcoding or automatic deletion of
local videos. No Infrequent Access storage and no bulk duplicate uploads.
