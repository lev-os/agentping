import { test, expect } from '@playwright/test';

test.describe('Tabs Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=ui-tabs--basic');
    await page.waitForSelector('.ui-tabs');
  });

  test('renders correctly with default active tab', async ({ page }) => {
    // Check that tabs container exists
    await expect(page.locator('.ui-tabs')).toBeVisible();

    // Check that tab list is present
    await expect(page.locator('[role="tablist"]')).toBeVisible();

    // Check that all tabs are rendered
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3);

    // Check first tab is active by default
    const firstTab = tabs.first();
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    await expect(firstTab).toHaveClass(/ui-tab--active/);
  });

  test('handles tab switching on click', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    const secondTab = tabs.nth(1);
    const thirdTab = tabs.nth(2);

    // Click second tab
    await secondTab.click();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(secondTab).toHaveClass(/ui-tab--active/);

    // Verify first tab is no longer active
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.first()).not.toHaveClass(/ui-tab--active/);

    // Click third tab
    await thirdTab.click();
    await expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    await expect(thirdTab).toHaveClass(/ui-tab--active/);
  });

  test('displays correct tab panel content', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    const panels = page.locator('[role="tabpanel"]');

    // First panel should be visible
    await expect(panels.first()).toBeVisible();
    await expect(panels.first()).not.toHaveAttribute('hidden');
    await expect(panels.first()).toContainText('Content for the first tab');

    // Click second tab
    await tabs.nth(1).click();

    // Second panel should now be visible
    await expect(panels.nth(1)).toBeVisible();
    await expect(panels.nth(1)).not.toHaveAttribute('hidden');
    await expect(panels.nth(1)).toContainText('Content for the second tab');

    // First panel should be hidden
    await expect(panels.first()).toHaveAttribute('hidden');
  });

  test('supports keyboard navigation - Arrow Right', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    const firstTab = tabs.first();

    // Focus first tab
    await firstTab.focus();
    await expect(firstTab).toBeFocused();

    // Press Arrow Right
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();

    // Press Arrow Right again
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();

    // Press Arrow Right again (should wrap to first)
    await page.keyboard.press('ArrowRight');
    await expect(firstTab).toBeFocused();
  });

  test('supports keyboard navigation - Arrow Left', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    const firstTab = tabs.first();

    // Focus first tab
    await firstTab.focus();

    // Press Arrow Left (should wrap to last)
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.nth(2)).toBeFocused();

    // Press Arrow Left again
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.nth(1)).toBeFocused();
  });

  test('supports keyboard navigation - Home and End', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');

    // Focus second tab
    await tabs.nth(1).focus();

    // Press End key
    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();

    // Press Home key
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
  });

  test('renders badges correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-tabs--with-badges');

    const badges = page.locator('.ui-tab-badge');
    await expect(badges).toHaveCount(3);

    // Check badge content
    await expect(badges.first()).toContainText('5');
    await expect(badges.nth(1)).toContainText('12');
    await expect(badges.nth(2)).toContainText('0');
  });

  test('renders warning badges correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-tabs--with-warning-badge');

    const warningBadges = page.locator('.ui-tab-badge--warning');
    await expect(warningBadges).toHaveCount(2);

    // Verify warning badge styling is applied
    const firstWarningBadge = warningBadges.first();
    await expect(firstWarningBadge).toBeVisible();
  });

  test('respects disabled state', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-tabs--with-disabled-tab');

    const tabs = page.locator('[role="tab"]');
    const disabledTab = tabs.nth(1);

    // Check disabled attribute
    await expect(disabledTab).toBeDisabled();

    // Try to click disabled tab
    await disabledTab.click({ force: true });

    // Should still not be active
    await expect(disabledTab).toHaveAttribute('aria-selected', 'false');
  });

  test('is accessible - proper ARIA attributes', async ({ page }) => {
    const tabList = page.locator('[role="tablist"]');
    const tabs = page.locator('[role="tab"]');
    const panels = page.locator('[role="tabpanel"]');

    // TabList has aria-label
    await expect(tabList).toHaveAttribute('aria-label');

    // Each tab has proper ARIA attributes
    for (let i = 0; i < 3; i++) {
      const tab = tabs.nth(i);
      const panel = panels.nth(i);

      // Tab has id and controls panel
      const tabId = await tab.getAttribute('id');
      const panelId = await panel.getAttribute('id');
      expect(tabId).toBeTruthy();
      expect(panelId).toBeTruthy();

      await expect(tab).toHaveAttribute('aria-controls', panelId!);

      // Panel is labeled by tab
      await expect(panel).toHaveAttribute('aria-labelledby', tabId!);
    }

    // Active tab has tabindex 0, others have -1
    await expect(tabs.first()).toHaveAttribute('tabindex', '0');
    await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1');
    await expect(tabs.nth(2)).toHaveAttribute('tabindex', '-1');
  });

  test('handles rich content in panels', async ({ page }) => {
    await page.goto('/iframe.html?id=ui-tabs--rich-content');

    const tabs = page.locator('[role="tab"]');

    // Navigate through tabs with rich content
    await tabs.nth(0).click();
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('User Profile');

    await tabs.nth(1).click();
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('Settings');

    await tabs.nth(2).click();
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('Notifications');

    await tabs.nth(3).click();
    await expect(page.locator('[role="tabpanel"]:visible')).toContainText('Code Snippet');
  });
});
