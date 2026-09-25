// End-to-end check of the R2 video origin through its custom domain, using the technical smoke
// object only. Needs network access; uses no credentials.
//
//   node scripts/verify-r2-video-foundation.mjs [--preview-origin=https://<branch>.brenychstudio.pages.dev]

const MEDIA_ORIGIN = "https://media.brenychstudio.com";
const SMOKE_KEY = "video/_system/r2-foundation-smoke-v001.bin";
const PROD_ORIGIN = "https://brenychstudio.com";
const PREVIEW_ORIGIN =
  process.argv.find((arg) => arg.startsWith("--preview-origin="))
    ?.split("=")[1] ??
  "https://infra-bsw-video-01a-r2-foundation.brenychstudio.pages.dev";

const SMOKE_URL = `${MEDIA_ORIGIN}/${SMOKE_KEY}`;
const SMOKE_CONTENT_TYPE = "application/octet-stream";
const RANGE = { header: "bytes=0-1023", length: 1024, contentRangePrefix: "bytes 0-1023/" };
const OBSERVED_HEADERS = ["accept-ranges", "etag", "cf-cache-status", "age"];

const results = [];
const check = (name, ok, detail) => results.push({ name, ok, detail });

async function request(method, headers = {}) {
  const response = await fetch(SMOKE_URL, { method, headers, redirect: "manual", cache: "no-store" });
  const body = method === "HEAD" ? new Uint8Array() : new Uint8Array(await response.arrayBuffer());
  return { status: response.status, headers: response.headers, body };
}

function checkCacheControl(label, headers) {
  const value = headers.get("cache-control") ?? "";
  check(`${label} Cache-Control contains public`, /(^|,\s*)public(\s*,|$)/.test(value), value);
  check(`${label} Cache-Control contains max-age=31536000`, /max-age=31536000\b/.test(value), value);
  check(`${label} Cache-Control contains immutable`, /(^|,\s*)immutable(\s*,|$)/.test(value), value);
}

function checkCors(label, response, origin) {
  const allowed = response.headers.get("access-control-allow-origin");
  check(`${label} CORS allows ${origin}`, response.status === 200 && allowed === origin, `status ${response.status}, Access-Control-Allow-Origin: ${allowed ?? "(absent)"}`);
}

const observations = {};
function observe(label, headers) {
  observations[label] = Object.fromEntries(OBSERVED_HEADERS.map((name) => [name, headers.get(name) ?? "(absent)"]));
}

try {
  const head = await request("HEAD");
  check("HEAD status 200", head.status === 200, `status ${head.status}`);
  check("HEAD Content-Type", head.headers.get("content-type") === SMOKE_CONTENT_TYPE, head.headers.get("content-type") ?? "(absent)");
  const headLength = Number(head.headers.get("content-length"));
  check("HEAD Content-Length > 1024", headLength > 1024, String(head.headers.get("content-length")));
  checkCacheControl("HEAD", head.headers);
  observe("HEAD", head.headers);

  const get = await request("GET");
  check("GET status 200", get.status === 200, `status ${get.status}`);
  check("GET Content-Type", get.headers.get("content-type") === SMOKE_CONTENT_TYPE, get.headers.get("content-type") ?? "(absent)");
  check("GET Content-Length > 1024", Number(get.headers.get("content-length")) > 1024, String(get.headers.get("content-length")));
  check("GET body length matches HEAD Content-Length", get.body.length === headLength, `${get.body.length} bytes`);
  checkCacheControl("GET", get.headers);
  observe("GET #1", get.headers);

  const range = await request("GET", { Range: RANGE.header });
  const contentRange = range.headers.get("content-range") ?? "";
  check("Range status 206", range.status === 206, `status ${range.status}`);
  check(`Content-Range starts ${RANGE.contentRangePrefix}`, contentRange.startsWith(RANGE.contentRangePrefix), contentRange || "(absent)");
  check(`Range body length ${RANGE.length}`, range.body.length === RANGE.length, `${range.body.length} bytes`);
  check("Range body equals the first bytes of the object", range.body.every((byte, i) => byte === get.body[i]), "byte compare");
  observe("Range", range.headers);

  checkCors("production-origin", await request("GET", { Origin: PROD_ORIGIN }), PROD_ORIGIN);
  checkCors("preview-origin", await request("GET", { Origin: PREVIEW_ORIGIN }), PREVIEW_ORIGIN);

  // Second ordinary GET: cache observability only (a MISS then HIT is expected, not required).
  observe("GET #2", (await request("GET")).headers);
} catch (error) {
  check("network request", false, error instanceof Error ? `${error.name}: ${error.message}${error.cause ? ` (${error.cause})` : ""}` : String(error));
}

console.log(`URL: ${SMOKE_URL}`);
console.log(`Preview origin: ${PREVIEW_ORIGIN}`);
for (const { name, ok, detail } of results) console.log(`${ok ? "PASS" : "FAIL"} ${name} — ${detail}`);
for (const [label, headers] of Object.entries(observations)) {
  console.log(`observed ${label}: ${Object.entries(headers).map(([name, value]) => `${name}=${value}`).join(" ")}`);
}

const failed = results.filter((result) => !result.ok);
if (failed.length) {
  console.log(`R2_FOUNDATION_VERIFY=FAIL (${failed.length} failing check${failed.length === 1 ? "" : "s"}: ${failed.map((result) => result.name).join("; ")})`);
  process.exit(1);
}
console.log("R2_FOUNDATION_VERIFY=PASS");
