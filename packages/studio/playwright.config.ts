import { defineConfig, devices } from '@playwright/test';

/**
 * AgentPing Studio E2E Test Configuration
 *
 * Tests run against Storybook dev server at http://localhost:6006
 * Use `pnpm storybook` to start the server before running tests
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Start Storybook automatically (optional)
  // webServer: {
  //   command: 'pnpm storybook',
  //   url: 'http://localhost:6006',
  //   reuseExistingServer: !process.env.CI,
  // },
});
