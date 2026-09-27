import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  workers: 4,
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/admin.spec.ts', '**/growth.spec.ts'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'growth',
      testMatch: '**/growth.spec.ts',
      dependencies: ['admin'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'admin',
      testMatch: '**/admin.spec.ts',
      dependencies: ['chromium'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: [
    {
      command: 'pnpm start:api',
      url: 'http://127.0.0.1:4000/health/ready',
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: 'pnpm start:web',
      url: 'http://localhost:3100',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
