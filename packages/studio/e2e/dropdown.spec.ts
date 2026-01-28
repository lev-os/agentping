import { test, expect } from '@playwright/test';

/**
 * Dropdown (Select) Component E2E Tests
 * Tests the Dropdown component in Storybook
 */

test.describe('Dropdown Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--default');
  });

  test('renders dropdown with placeholder', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText('Select an option');
  });

  test('opens dropdown menu on click', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await trigger.click();

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toBeVisible();
  });

  test('closes dropdown on option selection', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    // Open dropdown
    await trigger.click();

    // Select an option
    const menu = iframe.locator('.ui-dropdown-menu');
    const option = menu.locator('button[role="option"]').first();
    await option.click();

    // Menu should close
    await expect(menu).not.toBeVisible();
  });

  test('displays selected value', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--with-preselected-value');
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await expect(trigger).toContainText('Option 2');
  });

  test('shows icons with options', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--with-icons');
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    // Trigger should show icon
    await expect(trigger.locator('svg')).toBeVisible();

    // Open menu
    await trigger.click();

    // Menu items should have icons
    const menu = iframe.locator('.ui-dropdown-menu');
    const firstOption = menu.locator('button[role="option"]').first();
    await expect(firstOption.locator('.ui-context-menu-item-icon')).toBeVisible();
  });

  test('respects disabled state on dropdown', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--disabled');
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await expect(trigger).toBeDisabled();

    // Try to click - should not open
    await trigger.click({ force: true });
    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).not.toBeVisible();
  });

  test('respects disabled state on options', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--with-disabled-options');
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await trigger.click();

    const menu = iframe.locator('.ui-dropdown-menu');
    const disabledOption = menu.locator('button:has-text("Disabled (unavailable)")');

    await expect(disabledOption).toBeDisabled();
  });

  test('keyboard navigation with arrow keys', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--keyboard-navigation');
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    // Focus trigger
    await trigger.focus();

    // Open with Enter
    await page.keyboard.press('Enter');

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toBeVisible();

    // Navigate with arrow down
    await page.keyboard.press('ArrowDown');

    // First item should be focused
    const focusedItem = menu.locator('.ui-context-menu-item--focused');
    await expect(focusedItem).toBeVisible();

    // Navigate down again
    await page.keyboard.press('ArrowDown');

    // Second item should be focused
    const allFocused = await menu.locator('.ui-context-menu-item--focused').count();
    expect(allFocused).toBe(1);
  });

  test('keyboard navigation with arrow up', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await trigger.click();

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toBeVisible();

    // Navigate down twice
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Navigate up once
    await page.keyboard.press('ArrowUp');

    // Should be back to first item
    const focusedItem = menu.locator('.ui-context-menu-item--focused');
    await expect(focusedItem).toBeVisible();
  });

  test('selects option with Enter key', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    // Open dropdown
    await trigger.focus();
    await page.keyboard.press('Enter');

    // Navigate to an option
    await page.keyboard.press('ArrowDown');

    // Select with Enter
    await page.keyboard.press('Enter');

    // Menu should close
    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).not.toBeVisible();
  });

  test('closes dropdown with Escape key', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    // Open dropdown
    await trigger.click();

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');

    await expect(menu).not.toBeVisible();
  });

  test('closes dropdown when clicking outside', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    // Open dropdown
    await trigger.click();

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toBeVisible();

    // Click outside
    await iframe.locator('body').click({ position: { x: 10, y: 10 } });

    await expect(menu).not.toBeVisible();
  });

  test('handles long list of options', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--long-list');
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await trigger.click();

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toBeVisible();

    // Should have 20 options
    const optionCount = await menu.locator('button[role="option"]').count();
    expect(optionCount).toBe(20);
  });

  test('opens with Space key', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await trigger.focus();
    await page.keyboard.press('Space');

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toBeVisible();
  });

  test('accessibility - has proper ARIA attributes', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Open dropdown
    await trigger.click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const menu = iframe.locator('.ui-dropdown-menu');
    await expect(menu).toHaveAttribute('role', 'listbox');
  });

  test('accessibility - options have proper roles', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    await trigger.click();

    const menu = iframe.locator('.ui-dropdown-menu');
    const firstOption = menu.locator('button[role="option"]').first();

    await expect(firstOption).toHaveAttribute('role', 'option');
    await expect(firstOption).toHaveAttribute('aria-selected');
  });

  test('priority levels story works correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-dropdown--priority-levels');
    const iframe = page.frameLocator('#storybook-preview-iframe');
    const trigger = iframe.locator('.ui-dropdown-trigger');

    // Should show P2 - Medium as default
    await expect(trigger).toContainText('P2 - Medium');

    await trigger.click();

    // Should have 4 priority options
    const menu = iframe.locator('.ui-dropdown-menu');
    const optionCount = await menu.locator('button[role="option"]').count();
    expect(optionCount).toBe(4);
  });
});
