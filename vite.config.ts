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
      // Sanctum en mode SPA (cookies) : le front et l'API doivent partager la
      // même origine côté navigateur. Le proxy évite CORS et cookies tiers.
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/sanctum': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
