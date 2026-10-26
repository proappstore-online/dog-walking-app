import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  retries: 1,
  timeout: 30_000,
  reporter: [['list'], ['json', { outputFile: 'results.json' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
