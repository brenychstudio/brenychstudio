import { defineConfig, type Plugin } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sharp from "sharp";

import {
  getStaticRouteSocialImageSource,
  staticRouteMetadata,
  type StaticRouteMetadata,
} from "./src/seo/staticMetadata";

type BundleAsset = {
  type: "asset";
  fileName: string;
  source: string | Uint8Array;
};

type BuildBundle = Record<string, unknown>;

function isBundleAsset(asset: unknown): asset is BundleAsset {
  return Boolean(
    asset &&
      typeof asset === "object" &&
      "type" in asset &&
      (asset as { type?: unknown }).type === "asset" &&
      "fileName" in asset &&
      typeof (asset as { fileName?: unknown }).fileName === "string",
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function inlineBuiltCss(): Plugin {
  return {
    name: "inline-built-css",
    apply: "build" as const,
    enforce: "post" as const,
    generateBundle(_options, bundle) {
      const buildBundle = bundle as BuildBundle;
      const htmlAsset = Object.values(buildBundle).find(
        (asset): asset is BundleAsset =>
          isBundleAsset(asset) && asset.fileName === "index.html",
      );
      const cssAssets = Object.values(buildBundle).filter(
        (asset): asset is BundleAsset =>
          isBundleAsset(asset) && asset.fileName.endsWith(".css"),
      );

      if (!htmlAsset || cssAssets.length === 0) return;

      let html = String(htmlAsset.source);
      const css = cssAssets.map((asset) => String(asset.source)).join("\n");

      cssAssets.forEach((asset) => {
        const href = `/${asset.fileName}`;
        html = html.replace(
          new RegExp(`\\s*<link[^>]+href="${escapeRegExp(href)}"[^>]*>`, "g"),
          "",
        );
        delete buildBundle[asset.fileName];
      });

      htmlAsset.source = html.replace(
        "</head>",
        `    <style data-inline-build-css>${css}</style>\n  </head>`,
      );
    },
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function absoluteUrl(pathname: string) {
  return new URL(pathname, "https://brenychstudio.com").toString();
}

function routeOutputPath(outDir: string, routePath: string) {
  if (routePath === "/") return path.join(outDir, "index.html");
  return path.join(outDir, routePath.replace(/^\//, ""), "index.html");
}

function stripManagedMetadata(html: string) {
  return html
    .replace(/\s*<title>[^<]*<\/title>/gi, "")
    .replace(/\s*<link\b[^>]*\brel="canonical"[^>]*>/gi, "")
    .replace(
      /\s*<meta\b[^>]*\b(?:name|property)="(?:description|robots|twitter:(?:card|title|description|image)|og:(?:type|site_name|title|description|url|image|image:width|image:height|image:alt))"[^>]*>/gi,
      "",
    )
    .replace(/\s*<link\b[^>]*\brel="alternate"[^>]*data-seo-managed="true"[^>]*>/gi, "");
}

function createMetadataTags(metadata: StaticRouteMetadata) {
  const canonical = absoluteUrl(metadata.path);
  const image = absoluteUrl(metadata.image);
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const ogTitle = escapeHtml(metadata.ogTitle ?? metadata.title);
  const ogDescription = escapeHtml(metadata.ogDescription ?? metadata.description);
  const imageAlt = escapeHtml(metadata.imageAlt);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${metadata.type}" />
    <meta property="og:site_name" content="Brenych Studio" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${image}" />`;
}

async function writeSocialImage(outDir: string, metadata: StaticRouteMetadata) {
  if (!metadata.image.startsWith("/og/")) return;

  const source = getStaticRouteSocialImageSource(metadata.path);
  const output = path.join(outDir, metadata.image.replace(/^\//, ""));

  if (!source) {
    throw new Error(`Missing social image source for ${metadata.path}`);
  }

  await mkdir(path.dirname(output), { recursive: true });
  await sharp(path.join(process.cwd(), "public", source.replace(/^\//, "")))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .png()
    .toFile(output);
}

function staticRouteMetadataPlugin(): Plugin {
  return {
    name: "static-route-metadata",
    apply: "build",
    enforce: "post",
    async writeBundle(outputOptions) {
      const outDir = outputOptions.dir ? path.resolve(outputOptions.dir) : path.resolve("dist");
      const rootHtml = await readFile(path.join(outDir, "index.html"), "utf8");

      await Promise.all(
        staticRouteMetadata.filter((metadata) => metadata.path !== "/").map(async (metadata) => {
          const html = stripManagedMetadata(rootHtml)
            .replace(/<html\b[^>]*\blang="[^"]*"/i, `<html lang="${metadata.language ?? "en"}"`)
            .replace(/<head\b[^>]*>/i, (head) => `${head}${createMetadataTags(metadata)}\n`);
          const output = routeOutputPath(outDir, metadata.path);

          await mkdir(path.dirname(output), { recursive: true });
          await Promise.all([writeFile(output, html), writeSocialImage(outDir, metadata)]);
        }),
      );

      const redirects = [
        ...staticRouteMetadata
          .filter((metadata) => metadata.path !== "/")
          .map((metadata) => `${metadata.path} ${metadata.path}/index.html 200`),
        "/* /index.html 200",
      ].join("\n");

      await writeFile(path.join(outDir, "_redirects"), `${redirects}\n`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineBuiltCss(), staticRouteMetadataPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");

          if (!normalizedId.includes("node_modules")) return undefined;

          if (
            normalizedId.includes("react-dom") ||
            normalizedId.includes("react-router-dom") ||
            /node_modules\/react\//.test(normalizedId)
          ) {
            return "vendor-react";
          }

          if (normalizedId.includes("framer-motion")) return "vendor-motion";
          if (normalizedId.includes("@react-three/fiber")) return "vendor-r3f";
          if (normalizedId.includes("@react-three/drei")) return "vendor-drei";
          if (normalizedId.includes("three/examples")) return "vendor-three-examples";
          if (normalizedId.includes("three")) return "vendor-three-core";
          if (normalizedId.includes("tone")) return "vendor-audio";

          return undefined;
        },
      },
    },
  },
});
