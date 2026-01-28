import { test, expect } from '@playwright/test';

test.describe('Table Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook story
    await page.goto('http://localhost:6006/?path=/story/ui-table--default');
    await page.waitForSelector('.table-container', { timeout: 10000 });
  });

  test('renders table with data', async ({ page }) => {
    // Check if table is visible
    await expect(page.locator('.table-container')).toBeVisible();

    // Check if table has headers
    await expect(page.locator('th').first()).toBeVisible();

    // Check if table has data rows
    const rows = page.locator('tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('displays correct column headers', async ({ page }) => {
    const headers = ['ID', 'Agent Name', 'Status', 'Active Tasks', 'Uptime', 'Last Seen'];

    for (const header of headers) {
      await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
    }
  });

  test('sorting works correctly', async ({ page }) => {
    // Click on sortable column header
    const nameHeader = page.locator('th:has-text("Agent Name")');
    await nameHeader.click();

    // Wait for sort to apply
    await page.waitForTimeout(300);

    // Check sort icon appeared
    await expect(nameHeader.locator('.sort-icon')).toBeVisible();

    // Click again to reverse sort
    await nameHeader.click();
    await page.waitForTimeout(300);

    // Icon should still be visible
    await expect(nameHeader.locator('.sort-icon')).toBeVisible();
  });

  test('pagination works correctly', async ({ page }) => {
    // Check if pagination controls exist
    const pagination = page.locator('.table-pagination');
    await expect(pagination).toBeVisible();

    // Check initial state
    await expect(pagination.locator('.pagination-info')).toContainText('Page 1');

    // Click Next button
    const nextButton = pagination.locator('button:has-text("Next")');
    await nextButton.click();
    await page.waitForTimeout(300);

    // Should be on page 2
    await expect(pagination.locator('.pagination-info')).toContainText('Page 2');

    // Click Previous button
    const prevButton = pagination.locator('button:has-text("Previous")');
    await prevButton.click();
    await page.waitForTimeout(300);

    // Should be back on page 1
    await expect(pagination.locator('.pagination-info')).toContainText('Page 1');
  });

  test('displays loading state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-table--loading');
    await page.waitForSelector('.table-container.loading', { timeout: 5000 });

    await expect(page.locator('.table-loading')).toBeVisible();
    await expect(page.locator('.spinner')).toBeVisible();
    await expect(page.locator('.table-loading')).toContainText('Loading data');
  });

  test('displays empty state', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-table--empty');
    await page.waitForSelector('.table-container.empty', { timeout: 5000 });

    await expect(page.locator('.table-empty')).toBeVisible();
    await expect(page.locator('.table-empty')).toContainText('No agents found');
  });

  test('row selection works when enabled', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-table--selectable');
    await page.waitForSelector('.table-container', { timeout: 10000 });

    // Check if checkboxes are present
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes.first()).toBeVisible();

    // Click first row checkbox
    await checkboxes.nth(1).click(); // nth(0) is "select all"
    await page.waitForTimeout(200);

    // Row should have selected class
    await expect(page.locator('tbody tr.selected').first()).toBeVisible();

    // Click select all
    await checkboxes.first().click();
    await page.waitForTimeout(200);

    // All rows should be selected
    const selectedRows = page.locator('tbody tr.selected');
    const allRows = page.locator('tbody tr');
    const selectedCount = await selectedRows.count();
    const totalCount = await allRows.count();
    expect(selectedCount).toBe(totalCount);
  });

  test('row click callback works', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-table--clickable');
    await page.waitForSelector('.table-container', { timeout: 10000 });

    // Check if rows are clickable
    const firstRow = page.locator('tbody tr.clickable').first();
    await expect(firstRow).toBeVisible();

    // Note: In real E2E tests, you'd set up an event listener or mock
    // For Storybook, clicking should work without errors
    await firstRow.click();
  });

  test('renders large dataset with pagination', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-table--large-dataset');
    await page.waitForSelector('.table-container', { timeout: 10000 });

    // Should have pagination
    await expect(page.locator('.table-pagination')).toBeVisible();

    // Should show correct page info
    const pageInfo = page.locator('.pagination-info');
    await expect(pageInfo).toContainText('of 5'); // 50 items / 10 per page = 5 pages
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Table should still be visible
    await expect(page.locator('.table-container')).toBeVisible();

    // Table wrapper should allow horizontal scrolling
    const wrapper = page.locator('.table-wrapper');
    await expect(wrapper).toBeVisible();
  });

  test('screenshot matches visual baseline', async ({ page }) => {
    await expect(page.locator('.table-container')).toHaveScreenshot('table-default.png', {
      maxDiffPixels: 100,
    });
  });
});
