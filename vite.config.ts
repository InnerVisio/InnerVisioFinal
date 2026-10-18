import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static assets (images, robots.txt, favicon…) live in public/ and are copied to dist by Vite.
// The SSR build (entry-server.tsx) is only used at build time to prerender index.html.
export default defineConfig(({ isSsrBuild }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  build: {
    copyPublicDir: !isSsrBuild,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            // Long-lived vendor chunk: changes far less often than app code, so it stays cached
            manualChunks(id) {
              if (/node_modules[\\/](react|react-dom|scheduler|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) {
                return 'vendor';
              }
            },
          },
        },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
}));
