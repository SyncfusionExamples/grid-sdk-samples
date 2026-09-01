import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/CustomDemos/868499/' : '/',
  server: {
    middlewareMode: false,
    historyApiFallback: true,
  },
}))
