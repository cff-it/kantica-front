import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cible du proxy de dev : le back Laravel (nginx exposé sur le port 8008).
  // Dans Docker, elle est surchargée via API_PROXY_TARGET (voir docker-compose.yml).
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.API_PROXY_TARGET || 'http://localhost:8008'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // Sanctum en mode jeton Bearer : plus de cookies, mais l'API reste servie
      // sur l'origine du front, ce qui évite CORS. `/sanctum` n'est plus
      // utilisé, conservé sans effet.
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/sanctum': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
