import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 ADD THIS LINE HERE

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This points to your backend's dist directory relative to this website folder
    outDir: path.resolve(__dirname, '../backend/dist'), 
    emptyOutDir: true, 
  }
})
