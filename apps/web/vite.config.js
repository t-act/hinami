import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "hinami",
        short_name: "hinami",
        description: "カップル向けカレンダー",
        theme_color: "#C2684D",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "pwa-64x64.png",              sizes: "64x64",   type: "image/png" },
          { src: "pwa-192x192.png",            sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png",            sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png",  sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // API: オンライン時は最新データ優先、オフライン時はキャッシュ返却
            urlPattern: /^\/api\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // 静的アセット: Stale-While-Revalidate
            urlPattern: /\.(js|css|woff2?)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-cache",
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
});
