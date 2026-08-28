import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',

    allowedHosts: [
      'painel.nexaisp.online',
    ],

    proxy: {
      '/api': {
        target: 'https://nexaisp.online',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
        configure(proxy) {
          proxy.on('proxyRes', (proxyRes) => {
            const location = proxyRes.headers.location

            if (!location) {
              return
            }

            try {
              const url = new URL(location, 'https://nexaisp.online')

              if (url.origin === 'https://nexaisp.online') {
                proxyRes.headers.location =
                  `${url.pathname}${url.search}${url.hash}`
              }
            } catch {
              // Mantém o Location original se não for uma URL válida.
            }
          })
        },
      },

      '/backend': {
        target: 'https://nexaisp.online',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
        rewrite: (path) => path.replace(/^\/backend/, ''),
        configure(proxy) {
          proxy.on('proxyRes', (proxyRes) => {
            const location = proxyRes.headers.location

            if (!location) {
              return
            }

            try {
              const url = new URL(location, 'https://nexaisp.online')

              if (url.origin === 'https://nexaisp.online') {
                proxyRes.headers.location =
                  `${url.pathname}${url.search}${url.hash}`
              }
            } catch {
              // Mantém o Location original.
            }
          })
        },
      },
    },
  },
})
