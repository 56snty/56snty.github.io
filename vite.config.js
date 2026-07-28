import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, existsSync } from 'fs';

// package.json sets "type": "module", so __dirname is not defined
const __dirname = dirname(fileURLToPath(import.meta.url));

/* The site is six separate HTML entry points, not a single-page app.
   That keeps every URL directly shareable (units.html?user=… is a link
   people were already given) and means a visitor only downloads the
   page they opened. */
export default defineConfig({
  plugins: [
    react(),
    {
      // CNAME must survive into dist/ or the custom domain drops on deploy
      name: 'copy-cname',
      closeBundle() {
        if (existsSync('CNAME')) copyFileSync('CNAME', 'dist/CNAME');
      },
    },
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index:      resolve(__dirname, 'index.html'),
        units:      resolve(__dirname, 'units.html'),
        reis:       resolve(__dirname, 'reis.html'),
        gastenboek: resolve(__dirname, 'gastenboek.html'),
        admin:      resolve(__dirname, 'admin.html'),
        medicijnen: resolve(__dirname, 'medicijnen.html'),
      },
      output: {
        // one shared vendor chunk so React is cached across pages
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
