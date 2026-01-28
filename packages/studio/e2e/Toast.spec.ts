import { test, expect } from '@playwright/test';

test.describe('Toast Component', () => {
  test('renders success toast correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--success');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();

    // Check variant class
    await expect(toast).toHaveClass(/ui-toast--success/);

    // Check content
    await expect(toast.locator('.ui-toast-title')).toContainText('Success');
    await expect(toast.locator('.ui-toast-message')).toContainText('Your changes have been saved successfully');

    // Check icon is present
    await expect(toast.locator('.ui-toast-icon')).toBeVisible();
  });

  test('renders error toast correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--error');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass(/ui-toast--error/);

    await expect(toast.locator('.ui-toast-title')).toContainText('Error');
    await expect(toast.locator('.ui-toast-message')).toContainText('Failed to save changes');
  });

  test('renders warning toast correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--warning');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass(/ui-toast--warning/);

    await expect(toast.locator('.ui-toast-title')).toContainText('Warning');
    await expect(toast.locator('.ui-toast-message')).toContainText('Your session will expire');
  });

  test('renders info toast correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--info');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass(/ui-toast--info/);

    await expect(toast.locator('.ui-toast-title')).toContainText('Info');
    await expect(toast.locator('.ui-toast-message')).toContainText('New updates are available');
  });

  test('renders toast without title', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--no-title');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();

    // Title should not be present
    await expect(toast.locator('.ui-toast-title')).not.toBeVisible();

    // Message should be visible
    await expect(toast.locator('.ui-toast-message')).toContainText('Operation completed successfully');
  });

  test('displays action button and handles click', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--with-action');

    const toast = page.locator('.ui-toast');
    const actionBtn = toast.locator('.ui-toast-action');

    await expect(actionBtn).toBeVisible();
    await expect(actionBtn).toContainText('Update Now');

    // Set up dialog handler before clicking
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Updating');
      await dialog.accept();
    });

    await actionBtn.click();
  });

  test('renders custom icon', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--custom-icon');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();

    // Icon should be present (we can't easily verify it's a specific Lucide icon)
    await expect(toast.locator('.ui-toast-icon')).toBeVisible();
  });

  test('handles close button when closable', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--success');

    const toast = page.locator('.ui-toast');
    const closeBtn = toast.locator('.ui-toast-close');

    // Close button should be visible
    await expect(closeBtn).toBeVisible();
    await expect(closeBtn).toHaveAttribute('aria-label', 'Close notification');

    // Click close button
    await closeBtn.click();

    // Toast should start exiting animation
    await expect(toast).toHaveClass(/ui-toast--exiting/);

    // Wait for exit animation and verify toast is gone
    await page.waitForTimeout(400); // Wait for animation
    await expect(toast).not.toBeVisible();
  });

  test('hides close button when not closable', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--not-closable');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();

    // Close button should not be present
    await expect(toast.locator('.ui-toast-close')).not.toBeVisible();
  });

  test('handles long message text', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--long-message');

    const toast = page.locator('.ui-toast');
    await expect(toast).toBeVisible();

    const message = toast.locator('.ui-toast-message');
    await expect(message).toBeVisible();

    // Check that long text is present
    const text = await message.textContent();
    expect(text?.length).toBeGreaterThan(100);
  });

  test('auto-dismisses after duration', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--auto-dismiss');

    const toast = page.locator('.ui-toast');

    // Toast should be visible initially
    await expect(toast).toBeVisible();

    // Wait for auto-dismiss (3 seconds + animation)
    await page.waitForTimeout(3500);

    // Toast should be gone
    await expect(toast).not.toBeVisible();

    // Show button should be visible
    const showBtn = page.locator('button:has-text("Show Toast Again")');
    await expect(showBtn).toBeVisible();
  });

  test('can show toast again after auto-dismiss', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--auto-dismiss');

    const toast = page.locator('.ui-toast');

    // Wait for auto-dismiss
    await page.waitForTimeout(3500);
    await expect(toast).not.toBeVisible();

    // Click show button
    const showBtn = page.locator('button:has-text("Show Toast Again")');
    await showBtn.click();

    // Toast should be visible again
    await expect(toast).toBeVisible();
  });

  test('renders multiple toasts in container', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--in-container');

    const container = page.locator('.ui-toast-container');
    await expect(container).toBeVisible();

    // Should have position class
    await expect(container).toHaveClass(/ui-toast-container--top-right/);

    // Should have multiple toasts
    const toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(3);

    // Verify different variants
    await expect(toasts.nth(0)).toHaveClass(/ui-toast--success/);
    await expect(toasts.nth(1)).toHaveClass(/ui-toast--info/);
    await expect(toasts.nth(2)).toHaveClass(/ui-toast--warning/);
  });

  test('renders all variants together', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--all-variants');

    const toasts = page.locator('.ui-toast');
    await expect(toasts).toHaveCount(4);

    // Verify all variants are present
    await expect(toasts.nth(0)).toHaveClass(/ui-toast--success/);
    await expect(toasts.nth(1)).toHaveClass(/ui-toast--error/);
    await expect(toasts.nth(2)).toHaveClass(/ui-toast--warning/);
    await expect(toasts.nth(3)).toHaveClass(/ui-toast--info/);
  });

  test('interactive demo - can add different toast types', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--interactive-demo');

    const container = page.locator('.ui-toast-container');

    // Initially no toasts
    let toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(0);

    // Add success toast
    await page.locator('button:has-text("Show Success")').click();
    toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(1);
    await expect(toasts.first()).toHaveClass(/ui-toast--success/);

    // Add error toast
    await page.locator('button:has-text("Show Error")').click();
    toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(2);

    // Add warning toast
    await page.locator('button:has-text("Show Warning")').click();
    toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(3);

    // Add info toast
    await page.locator('button:has-text("Show Info")').click();
    toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(4);
  });

  test('interactive demo - toasts auto-dismiss', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--interactive-demo');

    const container = page.locator('.ui-toast-container');

    // Add a toast
    await page.locator('button:has-text("Show Success")').click();
    let toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(1);

    // Wait for auto-dismiss
    await page.waitForTimeout(3500);
    toasts = container.locator('.ui-toast');
    await expect(toasts).toHaveCount(0);
  });

  test('is accessible - proper ARIA attributes', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-toast--success');

    const toast = page.locator('.ui-toast');

    // Check ARIA attributes
    await expect(toast).toHaveAttribute('role', 'alert');
    await expect(toast).toHaveAttribute('aria-live', 'polite');

    // Close button should have proper label
    const closeBtn = toast.locator('.ui-toast-close');
    await expect(closeBtn).toHaveAttribute('aria-label', 'Close notification');
  });

  test('respects different toast variants styling', async ({ page }) => {
    const variants = [
      { story: 'success', class: 'ui-toast--success' },
      { story: 'error', class: 'ui-toast--error' },
      { story: 'warning', class: 'ui-toast--warning' },
      { story: 'info', class: 'ui-toast--info' },
    ];

    for (const variant of variants) {
      await page.goto(`/iframe.html?id=ui-toast--${variant.story}`);
      const toast = page.locator('.ui-toast');
      await expect(toast).toHaveClass(new RegExp(variant.class));
    }
  });
});
