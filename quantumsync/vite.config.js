import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'chart.js', 'react-chartjs-2', 'lucide-react'],
  },
})
