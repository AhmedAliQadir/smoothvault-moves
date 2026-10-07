import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The Three.js scene (~600 kB, ~150 kB gzipped) is its own lazily loaded chunk, so it doesn't block first paint.
    chunkSizeWarningLimit: 700,
  },
})
