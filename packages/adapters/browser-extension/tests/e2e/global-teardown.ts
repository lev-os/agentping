import { FullConfig } from '@playwright/test';

/**
 * Global Teardown for Browser Extension Tests
 *
 * Runs once after all tests complete. Used for:
 * - Cleanup operations
 * - Final logging/reporting
 */

async function globalTeardown(config: FullConfig) {
  console.log('\nAgentPing Extension E2E Tests - Global Teardown');
  console.log('All tests completed');
  console.log('Cleaning up resources...');

  // No specific cleanup needed for extension tests
  // Playwright handles context cleanup automatically

  console.log('Teardown complete\n');
}

export default globalTeardown;
