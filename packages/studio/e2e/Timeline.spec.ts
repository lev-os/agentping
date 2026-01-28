import { test, expect } from '@playwright/test';

test.describe('Timeline Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook story
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--default');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });
  });

  test('renders timeline with events', async ({ page }) => {
    // Check if timeline is visible
    await expect(page.locator('.timeline-container')).toBeVisible();

    // Check if timeline track is visible
    await expect(page.locator('.timeline-track')).toBeVisible();

    // Check if events are present
    const events = page.locator('.timeline-event');
    await expect(events).not.toHaveCount(0);
  });

  test('displays event markers with icons', async ({ page }) => {
    // Check first event marker
    const firstMarker = page.locator('.timeline-marker').first();
    await expect(firstMarker).toBeVisible();

    // Should have an icon inside
    await expect(firstMarker.locator('svg')).toBeVisible();
  });

  test('displays event content correctly', async ({ page }) => {
    const firstEvent = page.locator('.timeline-event').first();

    // Check title
    await expect(firstEvent.locator('.timeline-title')).toBeVisible();

    // Check timestamp
    await expect(firstEvent.locator('.timeline-timestamp')).toBeVisible();

    // Check description
    await expect(firstEvent.locator('.timeline-description')).toBeVisible();
  });

  test('displays different event types with correct styling', async ({ page }) => {
    // Success event
    const successMarker = page.locator('.timeline-marker.success').first();
    await expect(successMarker).toBeVisible();

    // Error event
    const errorMarker = page.locator('.timeline-marker.error').first();
    await expect(errorMarker).toBeVisible();

    // Warning event
    const warningMarker = page.locator('.timeline-marker.warning').first();
    await expect(warningMarker).toBeVisible();

    // Info event
    const infoMarker = page.locator('.timeline-marker.info').first();
    await expect(infoMarker).toBeVisible();
  });

  test('displays metadata when present', async ({ page }) => {
    // Find event with metadata
    const eventWithMetadata = page.locator('.timeline-event').first();
    const metadata = eventWithMetadata.locator('.timeline-metadata');

    await expect(metadata).toBeVisible();

    // Check metadata items
    const metadataItems = metadata.locator('.metadata-item');
    await expect(metadataItems).not.toHaveCount(0);

    // Check key-value structure
    await expect(metadataItems.first().locator('.metadata-key')).toBeVisible();
    await expect(metadataItems.first().locator('.metadata-value')).toBeVisible();
  });

  test('displays loading state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--loading');
    await page.waitForSelector('.timeline-container.loading', { timeout: 5000 });

    await expect(page.locator('.timeline-loading')).toBeVisible();
    await expect(page.locator('.spinner')).toBeVisible();
    await expect(page.locator('.timeline-loading')).toContainText('Loading timeline');
  });

  test('displays empty state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--empty');
    await page.waitForSelector('.timeline-container.empty', { timeout: 5000 });

    await expect(page.locator('.timeline-empty')).toBeVisible();
    await expect(page.locator('.timeline-empty')).toContainText('No events to display');
  });

  test('success events only display correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--success-only');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    // All markers should be success type
    const successMarkers = page.locator('.timeline-marker.success');
    const allMarkers = page.locator('.timeline-marker');

    const successCount = await successMarkers.count();
    const totalCount = await allMarkers.count();
    expect(successCount).toBe(totalCount);
  });

  test('error events only display correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--errors-only');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    // All markers should be error type
    const errorMarkers = page.locator('.timeline-marker.error');
    const allMarkers = page.locator('.timeline-marker');

    const errorCount = await errorMarkers.count();
    const totalCount = await allMarkers.count();
    expect(errorCount).toBe(totalCount);
  });

  test('custom icons display correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--custom-icons');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    // All events should have icons
    const markers = page.locator('.timeline-marker');
    const markersWithIcons = page.locator('.timeline-marker svg');

    const markerCount = await markers.count();
    const iconCount = await markersWithIcons.count();
    expect(iconCount).toBe(markerCount);
  });

  test('event click callback works', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--clickable');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    // Check if events are clickable
    const firstEvent = page.locator('.timeline-event.clickable').first();
    await expect(firstEvent).toBeVisible();

    // Hover should show interaction
    await firstEvent.hover();

    // Click should work without errors
    await firstEvent.click();
  });

  test('displays timestamps with time when enabled', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--default');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    const timestamp = page.locator('.timeline-timestamp').first();
    const text = await timestamp.textContent();

    // Should contain time format (e.g., "5:30 PM" or "17:30")
    expect(text).toMatch(/\d{1,2}:\d{2}/);
  });

  test('displays timestamps without time when disabled', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--without-time');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    const timestamp = page.locator('.timeline-timestamp').first();
    const text = await timestamp.textContent();

    // Should NOT contain time format
    expect(text).not.toMatch(/\d{1,2}:\d{2}/);
  });

  test('long timeline scrolls correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--long-timeline');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    const events = page.locator('.timeline-event');
    const eventCount = await events.count();

    // Should have many events
    expect(eventCount).toBeGreaterThan(10);

    // Should be able to scroll to last event
    const lastEvent = events.last();
    await lastEvent.scrollIntoViewIfNeeded();
    await expect(lastEvent).toBeVisible();
  });

  test('minimal events without description render correctly', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-timeline--minimal-events');
    await page.waitForSelector('.timeline-container', { timeout: 10000 });

    const firstEvent = page.locator('.timeline-event').first();

    // Should have title and timestamp
    await expect(firstEvent.locator('.timeline-title')).toBeVisible();
    await expect(firstEvent.locator('.timeline-timestamp')).toBeVisible();

    // Should not have description or metadata
    await expect(firstEvent.locator('.timeline-description')).not.toBeVisible();
    await expect(firstEvent.locator('.timeline-metadata')).not.toBeVisible();
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Timeline should still be visible and readable
    await expect(page.locator('.timeline-container')).toBeVisible();
    await expect(page.locator('.timeline-track')).toBeVisible();

    const firstEvent = page.locator('.timeline-event').first();
    await expect(firstEvent.locator('.timeline-title')).toBeVisible();
  });

  test('screenshot matches visual baseline', async ({ page }) => {
    await expect(page.locator('.timeline-container')).toHaveScreenshot('timeline-default.png', {
      maxDiffPixels: 100,
    });
  });
});
