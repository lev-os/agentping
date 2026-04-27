import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), resolve(repoRoot)],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:3030',
        ws: true,
        changeOrigin: true
      },
      '/storybook-api': {
        target: 'http://localhost:6007',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/storybook-api/, '')
      }
    }
  }
})
