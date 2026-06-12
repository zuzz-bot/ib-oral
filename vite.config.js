import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Deployed under https://zuzz-bot.github.io/ib-oral/ → base must match the repo name.
export default defineConfig({
  base: "/ib-oral/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/apple-touch-icon.png"],
      manifest: {
        name: "IB Oral — English B SL",
        short_name: "IB Oral",
        description:
          "Study tool for the IB English B SL Individual Oral — 5 themes, 12 topics, UK / USA / India.",
        theme_color: "#080808",
        background_color: "#080808",
        display: "standalone",
        orientation: "portrait",
        start_url: "/ib-oral/",
        scope: "/ib-oral/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://images.unsplash.com" ||
              url.origin === "https://flagcdn.com",
            handler: "CacheFirst",
            options: {
              cacheName: "remote-images",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
