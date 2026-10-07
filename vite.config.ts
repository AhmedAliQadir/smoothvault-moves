import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const page = (path: string) => resolve(import.meta.dirname, path)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The Three.js scene (~600 kB, ~150 kB gzipped) is its own lazily loaded chunk, so it doesn't block first paint.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      input: {
        main: page('index.html'),
        privacy: page('privacy/index.html'),
        terms: page('terms/index.html'),
        review: page('review/index.html'),
        notFound: page('404.html'),
      },
    },
  },
})
