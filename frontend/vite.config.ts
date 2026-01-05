import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "/product": path.resolve(__dirname, "../product"),
      "/prisma": path.resolve(__dirname, "../prisma"),
      "/lib": path.resolve(__dirname, "../lib"),
    },
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      // Allow serving files from parent directory
      allow: [
        path.resolve(__dirname, ".."),
      ],
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
