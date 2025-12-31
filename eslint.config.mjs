import { defineConfig } from 'eslint/config'
import { base, typescript, prettier, astro, react } from 'eslint-config-mytools'

export default defineConfig([
  { ignores: ['**/.idea', '**/.astro', '**/dist'] },
  ...base,
  ...typescript,
  ...prettier,
  ...astro,
  ...react,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
])
