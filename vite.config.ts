import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// Compatible con ESM y CJS (tsx en modo servidor)
const _dirname = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(_dirname, "client", "src"),
      "@shared": path.resolve(_dirname, "shared"),
      "@assets": path.resolve(_dirname, "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  envDir: path.resolve(_dirname),
  root: path.resolve(_dirname, "client"),
  publicDir: path.resolve(_dirname, "client", "public"),
  optimizeDeps: {
    include: ["react", "react-dom", "@trpc/react-query", "@tanstack/react-query"],
    exclude: [],
  },
  esbuild: {
    drop: [],
    target: "esnext",
  },
  build: {
    outDir: path.resolve(_dirname, "dist/public"),
    emptyOutDir: true,
    target: "esnext",
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    hmr: {
      overlay: false,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
