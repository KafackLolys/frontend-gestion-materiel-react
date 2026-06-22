import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Ton port front-end
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Ton serveur Laravel
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Nettoie le chemin
      },
    },
    host: true, // Permet d'accéder au serveur depuis n'importe quel appareil sur le réseau
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
