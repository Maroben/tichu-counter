import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.ico', 'favicon-32.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Tichu Counter',
        short_name: 'Tichu',
        description: 'Count Tichu games with friends.',
        theme_color: '#176b4d',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'],
        navigateFallback: '/index.html',
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: { tsconfigPaths: true },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/@firebase/firestore') || id.includes('/firebase/firestore')) return 'firebase-firestore';
          if (id.includes('/@firebase/auth') || id.includes('/firebase/auth')) return 'firebase-auth';
          if (id.includes('/@firebase/app-check') || id.includes('/firebase/app-check')) return 'firebase-app-check';
          if (id.includes('/@firebase/') || id.includes('/firebase/')) return 'firebase-core';
          if (id.includes('/@mui/') || id.includes('/@emotion/')) return 'mui';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router')) return 'react';
          if (id.includes('/@tanstack/')) return 'query';
          return 'vendor';
        },
      },
    },
  },
  server: { port: 4200, host: 'localhost' },
  preview: { port: 4300, host: 'localhost' },
});
