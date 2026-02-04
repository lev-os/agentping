import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Global Setup for Browser Extension Tests
 *
 * Runs once before all tests. Used for:
 * - Verifying the extension is built
 * - Pre-flight checks on the extension structure
 */

const pathToExtension = path.join(__dirname, '../../.output/chrome-mv3');

async function globalSetup(config: FullConfig) {
  console.log('AgentPing Extension E2E Tests - Global Setup');
  console.log(`Extension path: ${pathToExtension}`);

  // Verify the extension exists
  const fs = await import('fs');
  if (!fs.existsSync(pathToExtension)) {
    throw new Error(
      `Extension not found at ${pathToExtension}. Did you run 'pnpm build' in the browser-extension package?`
    );
  }

  // Verify manifest.json exists
  const manifestPath = path.join(pathToExtension, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `manifest.json not found at ${manifestPath}. The extension may not have been built correctly.`
    );
  }

  // Verify background.js exists
  const backgroundPath = path.join(pathToExtension, 'background.js');
  if (!fs.existsSync(backgroundPath)) {
    throw new Error(
      `background.js not found at ${backgroundPath}. The service worker script is missing.`
    );
  }

  console.log('✓ Extension structure verified');
  console.log('✓ manifest.json found');
  console.log('✓ background.js found');

  // Test that we can launch the extension
  console.log('Testing extension launch...');
  const testContext = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-sync',
    ],
  });

  try {
    // Quick smoke test
    const page = await testContext.newPage();
    await page.goto('chrome://extensions/', { waitUntil: 'networkidle' });

    const isVisible = await page
      .locator('text=AgentPing Browser Bridge')
      .isVisible();

    if (!isVisible) {
      throw new Error('Extension failed to load - not visible on chrome://extensions/');
    }

    await page.close();
    console.log('✓ Extension launch test passed');
  } finally {
    await testContext.close();
  }

  console.log('Global setup complete - tests ready to run\n');
}

export default globalSetup;
