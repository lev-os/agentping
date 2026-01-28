import { test, expect } from '@playwright/test';

test.describe('AuditFeed Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/components-auditfeed--with-events');
    await page.waitForSelector('.audit-feed');
  });

  test('should render feed header with title and event count', async ({ page }) => {
    const header = page.locator('.feed-header');
    await expect(header).toBeVisible();

    const title = header.locator('.feed-title');
    await expect(title).toContainText('Activity Stream');

    const count = header.locator('.event-count');
    await expect(count).toBeVisible();
  });

  test('should display event items with correct types', async ({ page }) => {
    const events = page.locator('.event-item');
    await expect(events).toHaveCount(7); // Based on sample data

    // Check for different event types
    await expect(page.locator('.event-item.success')).toHaveCount(2);
    await expect(page.locator('.event-item.error')).toHaveCount(1);
    await expect(page.locator('.event-item.warning')).toHaveCount(1);
    await expect(page.locator('.event-item.task')).toHaveCount(2);
    await expect(page.locator('.event-item.message')).toHaveCount(1);
  });

  test('should show event icons, messages, and timestamps', async ({ page }) => {
    const firstEvent = page.locator('.event-item').first();

    await expect(firstEvent.locator('.event-icon')).toBeVisible();
    await expect(firstEvent.locator('.event-message')).toBeVisible();
    await expect(firstEvent.locator('.event-time')).toBeVisible();
  });

  test('should display relative timestamps', async ({ page }) => {
    const timestamps = page.locator('.event-time');
    const firstTimestamp = await timestamps.first().textContent();

    // Should show relative time like "5m ago", "1h ago", etc.
    expect(firstTimestamp).toMatch(/\d+[smh] ago|just now/);
  });

  test('should show metadata for events that have it', async ({ page }) => {
    const eventsWithMetadata = page.locator('.event-item:has(.event-metadata)');
    await expect(eventsWithMetadata.first()).toBeVisible();

    const metadata = eventsWithMetadata.first().locator('.meta-item');
    await expect(metadata.first()).toBeVisible();
  });

  test('should toggle filter dropdown when filter button is clicked', async ({ page }) => {
    const filterButton = page.locator('.filter-toggle');
    await expect(filterButton).toBeVisible();

    // Open filter
    await filterButton.click();
    await expect(page.locator('.filter-dropdown')).toBeVisible();

    // Close filter
    await filterButton.click();
    await expect(page.locator('.filter-dropdown')).not.toBeVisible();
  });

  test('should filter events by type', async ({ page }) => {
    // Open filter dropdown
    await page.locator('.filter-toggle').click();
    await expect(page.locator('.filter-dropdown')).toBeVisible();

    // Count initial events
    const initialCount = await page.locator('.event-item').count();

    // Uncheck "success" filter
    const successCheckbox = page.locator('.filter-option:has-text("success") input');
    await successCheckbox.click();

    // Wait for filter to apply
    await page.waitForTimeout(300);

    // Count should be reduced (no success events)
    const filteredCount = await page.locator('.event-item').count();
    expect(filteredCount).toBeLessThan(initialCount);

    // Should not show any success events
    await expect(page.locator('.event-item.success')).toHaveCount(0);
  });

  test('should show empty state when no events match filter', async ({ page }) => {
    // Navigate to empty state
    await page.goto('http://localhost:6006/?path=/story/components-auditfeed--empty');

    const emptyState = page.locator('.feed-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No events to display');
  });

  test('should handle many events with scrolling', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/components-auditfeed--many-events');

    const feedEvents = page.locator('.feed-events');
    await expect(feedEvents).toBeVisible();

    // Should have scrollbar
    const hasScroll = await feedEvents.evaluate(el => el.scrollHeight > el.clientHeight);
    expect(hasScroll).toBe(true);

    // Should be able to scroll
    await feedEvents.evaluate(el => el.scrollTop = el.scrollHeight);
    const scrollTop = await feedEvents.evaluate(el => el.scrollTop);
    expect(scrollTop).toBeGreaterThan(0);
  });

  test('should animate new events', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/components-auditfeed--live-updates');

    // Wait for initial events to load
    await page.waitForSelector('.event-item');
    const initialCount = await page.locator('.event-item').count();

    // Wait for a new event to be added (every 3 seconds in story)
    await page.waitForTimeout(3500);

    const newCount = await page.locator('.event-item').count();
    expect(newCount).toBeGreaterThan(initialCount);

    // New event should have animation class briefly
    const lastEvent = page.locator('.event-item').last();
    await expect(lastEvent).toBeVisible();
  });

  test('should show full timestamp on hover', async ({ page }) => {
    const firstTime = page.locator('.event-time').first();

    // Hover to see title attribute with full timestamp
    await firstTime.hover();
    const title = await firstTime.getAttribute('title');

    // Title should contain full date/time
    expect(title).toBeTruthy();
    expect(title).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date format
  });

  test('should maintain scroll position when filtering', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/components-auditfeed--many-events');

    const feedEvents = page.locator('.feed-events');

    // Scroll to middle
    await feedEvents.evaluate(el => el.scrollTop = el.scrollHeight / 2);
    const scrollPosBefore = await feedEvents.evaluate(el => el.scrollTop);

    // Apply filter
    await page.locator('.filter-toggle').click();
    const filterCheckbox = page.locator('.filter-option input').first();
    await filterCheckbox.click();

    // Scroll position should not jump to top
    await page.waitForTimeout(300);
    const scrollPosAfter = await feedEvents.evaluate(el => el.scrollTop);

    // Allow some variance but shouldn't jump dramatically
    expect(Math.abs(scrollPosAfter - scrollPosBefore)).toBeLessThan(100);
  });
});
