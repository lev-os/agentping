import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * AgentPing Browser Extension Playwright Configuration
 *
 * Configures Playwright for testing the Chrome extension using
 * launchPersistentContext to load the extension from .output/chrome-mv3
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run for
  timeout: 60 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI (extension tests require serial access to context)
  workers: process.env.CI ? 1 : 1, // Serial execution recommended for extension tests

  // Reporter to use
  reporter: 'html',

  // Shared settings for all the projects below
  use: {
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure for debugging extension issues
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Global setup/teardown hooks
  globalSetup: path.join(__dirname, './tests/e2e/global-setup.ts'),
  globalTeardown: path.join(__dirname, './tests/e2e/global-teardown.ts'),
});
