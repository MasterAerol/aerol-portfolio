import { defineConfig } from '@playwright/test'
import base from './playwright.config'

// Run the same complete regression suite against the built static application.
export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})
