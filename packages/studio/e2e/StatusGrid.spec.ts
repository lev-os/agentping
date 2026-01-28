import { test, expect } from '@playwright/test';

test.describe('StatusGrid Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook story
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--default');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });
  });

  test('renders status grid with cards', async ({ page }) => {
    // Check if grid is visible
    await expect(page.locator('.status-grid-container')).toBeVisible();

    // Check if cards are present
    const cards = page.locator('.status-card');
    await expect(cards).not.toHaveCount(0);
  });

  test('displays card structure correctly', async ({ page }) => {
    const firstCard = page.locator('.status-card').first();

    // Check header elements
    await expect(firstCard.locator('.status-card-header')).toBeVisible();
    await expect(firstCard.locator('.status-icon')).toBeVisible();
    await expect(firstCard.locator('.status-indicator')).toBeVisible();

    // Check body elements
    await expect(firstCard.locator('.status-card-body')).toBeVisible();
    await expect(firstCard.locator('.status-card-title')).toBeVisible();
  });

  test('displays different status types with correct styling', async ({ page }) => {
    // Success card
    const successCard = page.locator('.status-card.success').first();
    await expect(successCard).toBeVisible();
    await expect(successCard.locator('.status-indicator.success')).toContainText('Success');

    // Error card
    const errorCard = page.locator('.status-card.error').first();
    await expect(errorCard).toBeVisible();
    await expect(errorCard.locator('.status-indicator.error')).toContainText('Error');

    // Warning card
    const warningCard = page.locator('.status-card.warning').first();
    await expect(warningCard).toBeVisible();
    await expect(warningCard.locator('.status-indicator.warning')).toContainText('Warning');

    // Pending card
    const pendingCard = page.locator('.status-card.pending').first();
    await expect(pendingCard).toBeVisible();
    await expect(pendingCard.locator('.status-indicator.pending')).toContainText('Pending');

    // Active card
    const activeCard = page.locator('.status-card.active').first();
    await expect(activeCard).toBeVisible();
    await expect(activeCard.locator('.status-indicator.active')).toContainText('Active');
  });

  test('displays card values when present', async ({ page }) => {
    const firstCard = page.locator('.status-card').first();
    const value = firstCard.locator('.status-card-value');

    await expect(value).toBeVisible();
    await expect(value).not.toBeEmpty();
  });

  test('displays card descriptions when present', async ({ page }) => {
    const firstCard = page.locator('.status-card').first();
    const description = firstCard.locator('.status-card-description');

    await expect(description).toBeVisible();
    await expect(description).not.toBeEmpty();
  });

  test('displays metadata when present', async ({ page }) => {
    const cardWithMetadata = page.locator('.status-card').first();
    const metadata = cardWithMetadata.locator('.status-card-metadata');

    await expect(metadata).toBeVisible();

    // Check metadata items
    const metadataItems = metadata.locator('.metadata-item');
    await expect(metadataItems).not.toHaveCount(0);

    // Check key-value structure
    await expect(metadataItems.first().locator('.metadata-key')).toBeVisible();
    await expect(metadataItems.first().locator('.metadata-value')).toBeVisible();
  });

  test('displays icons in status cards', async ({ page }) => {
    const firstCard = page.locator('.status-card').first();
    const icon = firstCard.locator('.status-icon svg');

    await expect(icon).toBeVisible();
  });

  test('displays loading state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--loading');
    await page.waitForSelector('.status-grid-container.loading', { timeout: 5000 });

    await expect(page.locator('.status-grid-loading')).toBeVisible();
    await expect(page.locator('.spinner')).toBeVisible();
    await expect(page.locator('.status-grid-loading')).toContainText('Loading status');
  });

  test('displays empty state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--empty');
    await page.waitForSelector('.status-grid-container.empty', { timeout: 5000 });

    await expect(page.locator('.status-grid-empty')).toBeVisible();
    await expect(page.locator('.status-grid-empty')).toContainText('No status cards available');
  });

  test('two column layout displays correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--two-columns');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    const grid = page.locator('.status-grid.columns-2');
    await expect(grid).toBeVisible();
  });

  test('four column layout displays correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--four-columns');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    const grid = page.locator('.status-grid.columns-4');
    await expect(grid).toBeVisible();
  });

  test('success only cards display correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--success-only');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    // All cards should be success type
    const successCards = page.locator('.status-card.success');
    const allCards = page.locator('.status-card');

    const successCount = await successCards.count();
    const totalCount = await allCards.count();
    expect(successCount).toBe(totalCount);
  });

  test('error states display correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--error-states');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    // All cards should be error type
    const errorCards = page.locator('.status-card.error');
    const allCards = page.locator('.status-card');

    const errorCount = await errorCards.count();
    const totalCount = await allCards.count();
    expect(errorCount).toBe(totalCount);
  });

  test('card click callback works', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--clickable');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    // Check if cards are clickable
    const firstCard = page.locator('.status-card.clickable').first();
    await expect(firstCard).toBeVisible();

    // Hover should show interaction
    await firstCard.hover();
    await page.waitForTimeout(200);

    // Card should have hover effect (transform)
    const transform = await firstCard.evaluate(el =>
      window.getComputedStyle(el).transform
    );
    expect(transform).not.toBe('none');

    // Click should work without errors
    await firstCard.click();
  });

  test('cards without values display correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--without-values');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    const firstCard = page.locator('.status-card').first();

    // Should have title and description
    await expect(firstCard.locator('.status-card-title')).toBeVisible();
    await expect(firstCard.locator('.status-card-description')).toBeVisible();

    // Should not have value
    await expect(firstCard.locator('.status-card-value')).not.toBeVisible();
  });

  test('minimal cards render correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--minimal-cards');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    const firstCard = page.locator('.status-card').first();

    // Should have title and status indicator
    await expect(firstCard.locator('.status-card-title')).toBeVisible();
    await expect(firstCard.locator('.status-indicator')).toBeVisible();

    // Should not have value, description, or metadata
    await expect(firstCard.locator('.status-card-value')).not.toBeVisible();
    await expect(firstCard.locator('.status-card-description')).not.toBeVisible();
    await expect(firstCard.locator('.status-card-metadata')).not.toBeVisible();
  });

  test('large grid displays correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--large-grid');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    const cards = page.locator('.status-card');
    const cardCount = await cards.count();

    // Should have many cards
    expect(cardCount).toBeGreaterThanOrEqual(12);

    // Grid should be 4 columns
    const grid = page.locator('.status-grid.columns-4');
    await expect(grid).toBeVisible();
  });

  test('agent monitoring layout displays correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-statusgrid--agent-monitoring');
    await page.waitForSelector('.status-grid-container', { timeout: 10000 });

    // Should have agent cards with metadata
    const firstCard = page.locator('.status-card').first();
    await expect(firstCard.locator('.status-card-metadata')).toBeVisible();

    // Check for uptime and lastSeen metadata
    const metadata = firstCard.locator('.status-card-metadata');
    await expect(metadata.locator('.metadata-key:has-text("uptime")')).toBeVisible();
    await expect(metadata.locator('.metadata-key:has-text("lastSeen")')).toBeVisible();
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Grid should still be visible
    await expect(page.locator('.status-grid-container')).toBeVisible();

    // Cards should stack on mobile
    const grid = page.locator('.status-grid');
    await expect(grid).toBeVisible();

    // First card should be visible
    await expect(page.locator('.status-card').first()).toBeVisible();
  });

  test('is responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Grid should be visible
    await expect(page.locator('.status-grid-container')).toBeVisible();

    const cards = page.locator('.status-card');
    await expect(cards.first()).toBeVisible();
  });

  test('status bar colors are correct', async ({ page }) => {
    // Check success card top border
    const successCard = page.locator('.status-card.success').first();
    const successBorderColor = await successCard.evaluate(el => {
      const before = window.getComputedStyle(el, '::before');
      return before.getPropertyValue('background');
    });
    expect(successBorderColor).toContain('22c55e');

    // Check error card top border
    const errorCard = page.locator('.status-card.error').first();
    const errorBorderColor = await errorCard.evaluate(el => {
      const before = window.getComputedStyle(el, '::before');
      return before.getPropertyValue('background');
    });
    expect(errorBorderColor).toContain('ef4444');
  });

  test('screenshot matches visual baseline', async ({ page }) => {
    await expect(page.locator('.status-grid-container')).toHaveScreenshot('statusgrid-default.png', {
      maxDiffPixels: 100,
    });
  });
});
