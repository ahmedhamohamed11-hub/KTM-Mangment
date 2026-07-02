import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// PORT/BASE_PATH sind auf Replit gesetzt, existieren aber z.B. auf Vercel nicht -
// deshalb hier mit sinnvollen Defaults statt hartem Fehler.
const port = Number(process.env.PORT) || 5173;
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: false,
    host: "0.0.0.0",
  },
  preview: {
    port,
    host: "0.0.0.0",
  },
});
