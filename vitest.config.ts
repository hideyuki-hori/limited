import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['{apps,packages}/*/src/**/*.{test,spec}.{ts,tsx}'],
  },
})
