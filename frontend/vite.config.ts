import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,  // Always use 5173, fail if taken
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Required for Capacitor
    emptyOutDir: true,
  },
  // Required for Capacitor
  base: './',
})



