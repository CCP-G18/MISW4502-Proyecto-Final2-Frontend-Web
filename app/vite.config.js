import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/tests/', 'vite.config.js', 'eslint.config.js', 'src/App.jsx', 'src/main.jsx', 'src/api'],
    },
  },
  server: {
    port: 8080,
    host: "0.0.0.0"
  },
})
