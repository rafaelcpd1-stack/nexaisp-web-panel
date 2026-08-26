import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function rewriteProxyLocation(proxy: any) {
  proxy.on('proxyRes', (proxyRes: any) => {
    const location = proxyRes.headers.location

    if (!location || typeof location !== 'string') {
      return
    }

    try {
      const parsed = new URL(location)

      proxyRes.headers.location =
        parsed.pathname +
        parsed.search +
        parsed.hash
    } catch {
      // Mantém Location original quando não for uma URL absoluta.
    }
  })
}

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: false,
        secure: false,
        configure: rewriteProxyLocation,
      },

      '/login': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: false,
        secure: false,
        configure: rewriteProxyLocation,
      },

      '/logout': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: false,
        secure: false,
        configure: rewriteProxyLocation,
      },
    },
  },
})
