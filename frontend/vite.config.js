import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api' : "http://localhost:8000"
      '/api' : "https://video-tube-eight.vercel.app"
    //   '/api': {
    //     target: 'https://video-tube-eight.vercel.app', // Your backend server URL
    //     changeOrigin: true, // Changes the origin of the host header to the target URL
    //     rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrite path
    // }
  }
}
}
)