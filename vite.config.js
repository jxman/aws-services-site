import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy /data requests to production CloudFront in development
      '/data': {
        target: 'https://aws-services.synepho.com',
        changeOrigin: true,
        secure: true,
      },
      // Proxy /reports requests to production CloudFront in development
      '/reports': {
        target: 'https://aws-services.synepho.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    }
  }
})
