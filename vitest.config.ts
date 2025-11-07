import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    css: false,
  },
  esbuild: {
    jsx: "automatic",
    loader: "tsx",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
