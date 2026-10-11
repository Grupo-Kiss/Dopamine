import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  publicDir: 'content',
  test: {
    environment: 'jsdom',
    setupFiles: './src/testing/setup.ts',
  },
})
