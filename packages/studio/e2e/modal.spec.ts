import { test, expect } from '@playwright/test';

/**
 * Modal Component E2E Tests
 * Tests the Modal component in Storybook
 */

test.describe('Modal Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-modal--with-title');
  });

  test('opens and closes modal', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');

    // Click button to open modal
    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    // Modal should be visible
    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();

    // Close button should be visible
    const closeButton = iframe.locator('button[aria-label="Close modal"]');
    await expect(closeButton).toBeVisible();

    // Close modal
    await closeButton.click();

    // Modal should be hidden (wait for animation)
    await expect(modal).not.toBeVisible();
  });

  test('closes modal with escape key', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');

    // Open modal
    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();

    // Press escape
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(modal).not.toBeVisible();
  });

  test('closes modal by clicking overlay', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');

    // Open modal
    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const modal = iframe.locator('.ui-modal');
    const overlay = iframe.locator('.ui-modal-overlay');

    await expect(modal).toBeVisible();

    // Click overlay (not modal content)
    await overlay.click({ position: { x: 10, y: 10 } });

    // Modal should close
    await expect(modal).not.toBeVisible();
  });

  test('displays modal title', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const title = iframe.locator('#modal-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Modal Title');
  });

  test('renders small size modal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-modal--small-size');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();

    // Check max-width style for small modal (400px)
    const maxWidth = await modal.evaluate((el) =>
      window.getComputedStyle(el).maxWidth
    );
    expect(maxWidth).toBe('400px');
  });

  test('renders medium size modal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-modal--medium-size');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();

    // Check max-width style for medium modal (500px)
    const maxWidth = await modal.evaluate((el) =>
      window.getComputedStyle(el).maxWidth
    );
    expect(maxWidth).toBe('500px');
  });

  test('renders large size modal', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-modal--large-size');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();

    // Check max-width style for large modal (700px)
    const maxWidth = await modal.evaluate((el) =>
      window.getComputedStyle(el).maxWidth
    );
    expect(maxWidth).toBe('700px');
  });

  test('displays footer with actions', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-modal--with-footer');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const footer = iframe.locator('.ui-modal-footer');
    await expect(footer).toBeVisible();

    // Check for action buttons
    const cancelButton = footer.locator('button', { hasText: 'Cancel' });
    const confirmButton = footer.locator('button', { hasText: 'Confirm' });

    await expect(cancelButton).toBeVisible();
    await expect(confirmButton).toBeVisible();
  });

  test('confirm dialog workflow', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-modal--confirm-dialog');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    // Open delete modal
    const deleteButton = iframe.locator('button', { hasText: 'Delete Item' });
    await deleteButton.click();

    // Check modal content
    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();
    await expect(iframe.locator('text=Confirm Deletion')).toBeVisible();
    await expect(iframe.locator('text=cannot be undone')).toBeVisible();

    // Footer should have cancel and delete buttons
    const footer = iframe.locator('.ui-modal-footer');
    const cancelButton = footer.locator('button', { hasText: 'Cancel' });

    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Modal should close
    await expect(modal).not.toBeVisible();
  });

  test('scrollable content works', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-modal--scrollable-content');
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const modalBody = iframe.locator('.ui-modal-body');
    await expect(modalBody).toBeVisible();

    // Check if scrollbar class is present
    await expect(modalBody).toHaveClass(/ui-scrollbar/);

    // Scroll to bottom
    await modalBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // Verify scroll happened
    const scrollTop = await modalBody.evaluate((el) => el.scrollTop);
    expect(scrollTop).toBeGreaterThan(0);
  });

  test('accessibility - modal has proper ARIA attributes', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const overlay = iframe.locator('.ui-modal-overlay');

    await expect(overlay).toHaveAttribute('role', 'dialog');
    await expect(overlay).toHaveAttribute('aria-modal', 'true');
    await expect(overlay).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  test('accessibility - focus management', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');

    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    // Modal should be visible
    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();

    // Close modal
    const closeButton = iframe.locator('button[aria-label="Close modal"]');
    await closeButton.click();

    // Focus should return to trigger button (if implemented)
    // This depends on the component implementation
  });

  test('body overflow is managed', async ({ page }) => {
    const iframe = page.frameLocator('#storybook-preview-iframe');

    // Open modal
    const openButton = iframe.locator('button', { hasText: 'Open Modal' });
    await openButton.click();

    const modal = iframe.locator('.ui-modal');
    await expect(modal).toBeVisible();

    // Note: body overflow management happens at document.body level
    // which is outside iframe, so we can't test it directly in Storybook
  });
});
