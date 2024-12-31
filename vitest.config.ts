import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./playgrounds/**/*.spec.ts'],
    setupFiles: ['./playgrounds/setup.ts'],
  },
})
