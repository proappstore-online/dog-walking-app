import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'release-identity',
      transformIndexHtml() {
        return [{
          tag: 'meta',
          attrs: { name: 'build-commit', content: process.env.VITE_COMMIT_SHA || 'development' },
          injectTo: 'head',
        }];
      },
    },
  ],
});
