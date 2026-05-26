import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { OutputAsset, OutputBundle } from "rollup";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function inlineBuiltCss() {
  return {
    name: "inline-built-css",
    apply: "build" as const,
    enforce: "post" as const,
    generateBundle(_options: unknown, bundle: OutputBundle) {
      const htmlAsset = Object.values(bundle).find(
        (asset) => asset.type === "asset" && asset.fileName === "index.html",
      ) as OutputAsset | undefined;
      const cssAssets = Object.values(bundle).filter(
        (asset) => asset.type === "asset" && asset.fileName.endsWith(".css"),
      ) as OutputAsset[];

      if (!htmlAsset || cssAssets.length === 0) return;

      let html = String(htmlAsset.source);
      const css = cssAssets.map((asset) => String(asset.source)).join("\n");

      cssAssets.forEach((asset) => {
        const href = `/${asset.fileName}`;
        html = html.replace(
          new RegExp(`\\s*<link[^>]+href="${escapeRegExp(href)}"[^>]*>`, "g"),
          "",
        );
        delete bundle[asset.fileName];
      });

      htmlAsset.source = html.replace(
        "</head>",
        `    <style data-inline-build-css>${css}</style>\n  </head>`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineBuiltCss()],
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
