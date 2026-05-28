import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 💻 1. DEVELOPMENT PROXY SERVER SETUP
  // Pipes local browser requests directly to your running Express API port
  server: {
    proxy: {
      '/alerts': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/iot': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },

  // 📦 2. PRODUCTION PRODUCTION ASSET COMPILATION LAYOUT
  build: {
    // This points to your backend's dist directory relative to this website folder
    outDir: path.resolve(__dirname, '../backend/dist'), 
    emptyOutDir: true, 
  }
})
