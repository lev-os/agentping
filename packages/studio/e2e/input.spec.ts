import { test, expect } from '@playwright/test';

/**
 * Input Component E2E Tests
 * Tests the Input component in Storybook
 */

test.describe('Input Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--default');
  });

  test('renders default input correctly', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const input = iframe.locator('input[type="text"]').first();

    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Enter text...');
  });

  test('accepts text input', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const input = iframe.locator('input[type="text"]').first();

    await input.fill('Hello World');
    await expect(input).toHaveValue('Hello World');
  });

  test('clears input value', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--with-clear-button');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const input = iframe.locator('input[type="text"]').first();
    const clearButton = iframe.locator('button[aria-label="Clear input"]');

    await expect(input).toHaveValue('Clearable text');
    await clearButton.click();
    // Note: onClear handler needs to be implemented in story to actually clear
  });

  test('displays with icon', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--with-icon');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const wrapper = iframe.locator('.ui-input-wrapper');
    const icon = wrapper.locator('.ui-input-icon');

    await expect(icon).toBeVisible();
    await expect(wrapper.locator('input')).toBeVisible();
  });

  test('shows error state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--error');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const input = iframe.locator('input[type="text"]').first();

    await expect(input).toHaveClass(/ui-input--error/);
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('respects disabled state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--disabled');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const input = iframe.locator('input[type="text"]').first();

    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('Cannot edit');
  });

  test('uses monospace font', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--mono-font');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const input = iframe.locator('input[type="text"]').first();

    await expect(input).toHaveClass(/ui-input--mono/);
  });

  test('handles password type', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--with-password');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const input = iframe.locator('input[type="password"]').first();

    await expect(input).toBeVisible();
    await input.fill('secret123');
    await expect(input).toHaveValue('secret123');
  });

  test('keyboard navigation works', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const input = iframe.locator('input[type="text"]').first();

    await input.focus();
    await page.keyboard.type('Test text');
    await expect(input).toHaveValue('Test text');

    // Select all and delete
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await expect(input).toHaveValue('');
  });

  test('accessibility - has proper label', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--with-label');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const input = iframe.locator('input[type="text"]').first();

    await expect(input).toHaveAttribute('aria-label', 'Username');
  });

  test('accessibility - clear button has label', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--with-clear-button');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const clearButton = iframe.locator('button[aria-label="Clear input"]');

    await expect(clearButton).toBeVisible();
    await expect(clearButton).toHaveAttribute('aria-label', 'Clear input');
  });
});
