import { defineConfig } from '@playwright/test'
import base from './playwright.config'

export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: 'http://127.0.0.1:8787' },
  webServer: {
    command: 'npm run cf:dev',
    url: 'http://127.0.0.1:8787',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
