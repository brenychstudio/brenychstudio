import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
