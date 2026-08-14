import node from '@astrojs/node'
import { defineConfig, envField } from 'astro/config'

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  output: 'server',
  env: {
    schema: {
      GOOGLE_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      GOOGLE_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret' }),
      GOOGLE_REDIRECT_URI: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://localhost:4321/api/auth/callback',
      }),
      SESSION_SECRET: envField.string({ context: 'server', access: 'secret', min: 64 }),
    },
  },
})
