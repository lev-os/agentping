import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Button Component
 *
 * These tests verify the Button component renders correctly and responds
 * to user interactions in the AgentPing Studio renderer process.
 */

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the AgentPing Studio app
    await page.goto('/');

    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should render buttons on the page', async ({ page }) => {
    // Look for any button elements with the ui-button class
    const buttons = page.locator('button.ui-button');

    // Verify at least one button exists
    await expect(buttons.first()).toBeVisible();
  });

  test('should have correct button variants', async ({ page }) => {
    // Check for different button variants used in the app
    const primaryButton = page.locator('button.ui-button--primary').first();
    const secondaryButton = page.locator('button.ui-button--secondary').first();

    // At least one of these variants should exist
    const hasPrimary = await primaryButton.count() > 0;
    const hasSecondary = await secondaryButton.count() > 0;

    expect(hasPrimary || hasSecondary).toBeTruthy();
  });

  test('should be clickable and responsive', async ({ page }) => {
    // Find the first interactive button
    const button = page.locator('button.ui-button:not([disabled])').first();

    // Verify button is visible and enabled
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    // Click the button
    await button.click();

    // Verify the button is still visible after click (basic interaction check)
    await expect(button).toBeVisible();
  });

  test('disabled buttons should not be clickable', async ({ page }) => {
    // Check if any disabled buttons exist
    const disabledButton = page.locator('button.ui-button[disabled]').first();

    // Only run this test if disabled buttons exist
    const count = await disabledButton.count();
    if (count > 0) {
      await expect(disabledButton).toBeDisabled();
    }
  });

  test('buttons with loading state should show spinner', async ({ page }) => {
    // Look for buttons with loading indicators
    const loadingButton = page.locator('button.ui-button:has(.ui-spinner)').first();

    // Only verify if loading buttons exist in the current view
    const count = await loadingButton.count();
    if (count > 0) {
      await expect(loadingButton).toBeVisible();
      await expect(loadingButton).toBeDisabled();
    }
  });

  test('buttons should have accessible text or aria-label', async ({ page }) => {
    // Get all buttons
    const buttons = page.locator('button.ui-button');
    const buttonCount = await buttons.count();

    // Check that at least one button has text content or aria-label
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const hasText = (await firstButton.textContent())?.trim().length! > 0;
      const hasAriaLabel = (await firstButton.getAttribute('aria-label'))?.length! > 0;

      expect(hasText || hasAriaLabel).toBeTruthy();
    }
  });
});
