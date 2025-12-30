import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/vitest.setup.ts',
    exclude: [...configDefaults.exclude, 'test/e2e/*'],
    deps: {
      inline: ['next-intl'],
    },
    server: {
      deps: {
        inline: ['next-intl'],
      },
    },
  },
})
