import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: "mobile",
  define: { "import.meta.env.VITE_STATIC_APP": JSON.stringify("true") },
  publicDir: "../public",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { outDir: "../dist-mobile", emptyOutDir: true, target: "es2022" },
  server: { host: "0.0.0.0", port: 4173 },
});
