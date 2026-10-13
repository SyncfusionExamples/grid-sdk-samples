import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/pivot-performance-benchmark/',
  server: {
    open: false,
    port: 5173,
  },
});
