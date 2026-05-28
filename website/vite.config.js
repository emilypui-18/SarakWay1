import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 🌟 Point this to the exact relative path of your backend's dist folder
    // This assumes your frontend and backend folders sit next to each other
    outDir: path.resolve(__dirname, '../backend/dist'), 
    
    // Clean out the old backend/dist folder contents before building the new ones
    emptyOutDir: true, 
  }
})
