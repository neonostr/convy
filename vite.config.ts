import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createRequire } from "module";

// Load lovable-tagger via createRequire so CI builds work whether or not the
// dependency is present, while local Lovable dev keeps the tagger enabled.
const require = createRequire(import.meta.url);
let componentTagger: (() => PluginOption) | undefined;
try {
  componentTagger = require("lovable-tagger").componentTagger;
} catch {
  componentTagger = undefined;
}

// Unique per build: a UTC timestamp like 20261119T094800Z, shown via the settings Easter egg.
const BUILD_ID =
  process.env["VITE_BUILD_ID"] ?? new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
