import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://video-tube-eight.vercel.app',
        changeOrigin: true,  // Ensures correct request origin
        secure: true         // Ensures HTTPS
      }
    }
  }
})
