import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '#app': new URL('./app', import.meta.url).pathname,
      '#domain': new URL('./app/domain', import.meta.url).pathname,
      '#shared': new URL('./app/shared', import.meta.url).pathname,
    },
  },
})
