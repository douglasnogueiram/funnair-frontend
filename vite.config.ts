import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    headers: {
      'Content-Security-Policy':
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' ws: wss:; worker-src blob:;",
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        headers: {
          Authorization: 'Basic dXNlcjp1c2VyMTIz',
        },
      },
      '/agent': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agent/, ''),
      },
      '/rag': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rag/, '/api'),
      },
    },
  },
})
