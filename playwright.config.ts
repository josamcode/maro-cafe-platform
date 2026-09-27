import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: {
    command: 'pnpm --filter @maro/web dev',
    url: 'http://localhost:3100',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
