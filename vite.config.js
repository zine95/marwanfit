import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'MarwanFit',
        short_name: 'MarwanFit',
        description: 'Suivi sport, nutrition et progression personnalisé',
        theme_color: '#111827',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://api.anthropic.com',
            handler: 'NetworkOnly'
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://world.openfoodfacts.org',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'openfoodfacts-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ]
});
