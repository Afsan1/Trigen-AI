import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/hf-api': {
        target: 'https://router.huggingface.co/hf-inference',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf-api/, ''),
      },
      '/google-tts': {
        target: 'https://translate.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-tts/, ''),
      },
      '/zsky-api': {
        target: 'https://api.zsky.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zsky-api/, ''),
      },
    },
  },
})
