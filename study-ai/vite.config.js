import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Libraries go in their own files so browsers cache them between app updates.
function vendorChunk(id) {
  if (!id.includes('node_modules')) return undefined
  if (/[\\/]node_modules[\\/]katex[\\/]/.test(id)) return 'katex'
  if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
  return 'vendor'
}

// The build goes into the website, as site/study-ai/ (the Study AI tab shows that page in a frame).
// Relative paths, so it works wherever the site is served: GitHub Pages' /Interview.ai/ or your computer.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../site/study-ai',
    emptyOutDir: true,
    rollupOptions: {
      output: { manualChunks: vendorChunk },
    },
  },
})
