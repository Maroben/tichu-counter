import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  plugins: [react()],
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
