import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextConfig from 'eslint-config-next'

export default defineConfig([
  globalIgnores(['.next', 'dist']),
  ...nextConfig,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Existing components intentionally keep plain <img> tags (custom onError
      // fallback logic that would need rework for next/image) — see migration
      // plan §9 "Image handling decision".
      '@next/next/no-img-element': 'off',
      // eslint-config-next enables a stricter rule set than the project's old
      // Vite eslint config (which only had js/typescript-eslint/react-hooks
      // "recommended"). These rules fire across pre-existing, untouched
      // business logic — downgraded to warnings rather than mass-editing
      // working code as an unrelated side effect of the Next.js migration.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
])
