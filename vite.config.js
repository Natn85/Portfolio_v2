import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js (~540 kB) is a lazy chunk loaded only by the nav coin, not part of the main bundle.
    chunkSizeWarningLimit: 600,
  },
})
