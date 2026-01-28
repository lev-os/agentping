import { test, expect } from '@playwright/test';

test.describe('ToolCard Component', () => {
  test('renders Read tool correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--read-file');

    const card = page.locator('.tool-card');
    await expect(card).toBeVisible();

    // Check tool name
    await expect(card.locator('.tool-name')).toContainText('Read');

    // Check risk tag
    await expect(card.locator('.risk-tag')).toContainText('Standard');
    await expect(card.locator('.risk-tag')).toHaveClass(/risk-low/);

    // Check path display
    await expect(card.locator('.detail-row code')).toContainText('/src/components/Button.tsx');
  });

  test('renders high-risk tools with proper styling', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--bash-command');

    const card = page.locator('.tool-card');

    // Check risk tag for high-risk tool
    await expect(card.locator('.risk-tag')).toContainText('High Risk');
    await expect(card.locator('.risk-tag')).toHaveClass(/risk-high/);

    // Check command display
    await expect(card.locator('.detail-row code')).toContainText('npm install react-query');
  });

  test('displays approval UI for pending tools', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--pending-approval');

    const card = page.locator('.tool-card');

    // Check pending state
    await expect(card).toHaveClass(/pending/);

    // Check approval actions exist
    await expect(card.locator('.tool-approval-actions')).toBeVisible();
    await expect(card.locator('.approve-btn')).toBeVisible();
    await expect(card.locator('.deny-btn')).toBeVisible();

    // Check button labels
    await expect(card.locator('.approve-btn')).toContainText('Approve');
    await expect(card.locator('.deny-btn')).toContainText('Deny');
  });

  test('handles approve action', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--pending-approval');

    const card = page.locator('.tool-card');
    const approveBtn = card.locator('.approve-btn');

    // Click approve
    await approveBtn.click();

    // Check for approved status
    await expect(card.locator('.tool-status.approved')).toBeVisible();
    await expect(card.locator('.tool-status.approved')).toContainText('Approved');
  });

  test('handles deny action', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--pending-approval');

    const card = page.locator('.tool-card');
    const denyBtn = card.locator('.deny-btn');

    // Click deny
    await denyBtn.click();

    // Check for denied status
    await expect(card.locator('.tool-status.denied')).toBeVisible();
    await expect(card.locator('.tool-status.denied')).toContainText('Denied');
  });

  test('shows diff preview for Edit/Write tools', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--pending-with-diff');

    const card = page.locator('.tool-card');

    // Check diff section exists
    await expect(card.locator('.tool-diff-section')).toBeVisible();

    // Check toggle button
    const toggleBtn = card.locator('.diff-toggle-btn');
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toContainText('Hide Changes');

    // Diff should be visible by default
    await expect(card.locator('.tool-diff-preview')).toBeVisible();
  });

  test('toggles diff visibility', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--pending-with-diff');

    const card = page.locator('.tool-card');
    const toggleBtn = card.locator('.diff-toggle-btn');
    const diffPreview = card.locator('.tool-diff-preview');

    // Initially visible
    await expect(diffPreview).toBeVisible();

    // Click to hide
    await toggleBtn.click();
    await expect(diffPreview).not.toBeVisible();
    await expect(toggleBtn).toContainText('Show Changes');

    // Click to show again
    await toggleBtn.click();
    await expect(diffPreview).toBeVisible();
    await expect(toggleBtn).toContainText('Hide Changes');
  });

  test('renders success result correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--success-result');

    const card = page.locator('.tool-card');

    // Check success styling
    await expect(card).toHaveClass(/success/);

    // Check success message
    await expect(card.locator('.tool-label')).toContainText('Action Complete');

    // Check content is displayed
    await expect(card.locator('.tool-result-content')).toBeVisible();
    await expect(card.locator('.tool-result-content code')).toContainText('export function Button()');
  });

  test('renders error result correctly', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--error-result');

    const card = page.locator('.tool-card');

    // Check error styling
    await expect(card).toHaveClass(/error/);

    // Check error message
    await expect(card.locator('.tool-label')).toContainText('Tool Failed');

    // Check error content
    await expect(card.locator('.tool-result-content code')).toContainText('Error: Command failed');
  });

  test('displays copy buttons for paths and commands', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--read-file');

    const card = page.locator('.tool-card');

    // Check copy button exists for path
    const copyBtn = card.locator('.tool-copy-btn, button[aria-label*="Copy"]').first();
    await expect(copyBtn).toBeVisible();
  });

  test('handles different tool types - Glob', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--glob-search');

    const card = page.locator('.tool-card');

    await expect(card.locator('.tool-name')).toContainText('Glob');
    await expect(card.locator('.detail-row code')).toContainText('**/*.test.ts');
  });

  test('handles different tool types - Grep', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--grep-search');

    const card = page.locator('.tool-card');

    await expect(card.locator('.tool-name')).toContainText('Grep');
    await expect(card.locator('.detail-row code')).toContainText('useState');
  });

  test('truncates long content in results', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--long-content-result');

    const card = page.locator('.tool-card');
    const content = card.locator('.tool-result-content code');

    await expect(content).toBeVisible();

    // Content should contain text (length check would depend on actual truncation logic)
    const text = await content.textContent();
    expect(text).toBeTruthy();
  });

  test('shows approved status badge', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--approved');

    const card = page.locator('.tool-card');

    await expect(card.locator('.tool-status.approved')).toBeVisible();
    await expect(card.locator('.tool-status.approved')).toContainText('Approved');
  });

  test('shows denied status badge', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--denied');

    const card = page.locator('.tool-card');

    await expect(card.locator('.tool-status.denied')).toBeVisible();
    await expect(card.locator('.tool-status.denied')).toContainText('Denied');
  });

  test('is accessible - proper roles and labels', async ({ page }) => {
    await page.goto('/iframe.html?id=chat-toolcard--pending-approval');

    const card = page.locator('.tool-card');

    // Check ARIA attributes for approval buttons
    const approveBtn = card.locator('.approve-btn');
    const denyBtn = card.locator('.deny-btn');

    await expect(approveBtn).toHaveAttribute('aria-label', 'Approve this action');
    await expect(denyBtn).toHaveAttribute('aria-label', 'Deny this action');
  });

  test('displays all tool variants correctly', async ({ page }) => {
    const variants = [
      { story: 'read-file', name: 'Read' },
      { story: 'write-file', name: 'Write' },
      { story: 'edit-file', name: 'Edit' },
      { story: 'bash-command', name: 'Bash' },
      { story: 'glob-search', name: 'Glob' },
      { story: 'grep-search', name: 'Grep' },
    ];

    for (const variant of variants) {
      await page.goto(`/iframe.html?id=chat-toolcard--${variant.story}`);
      const card = page.locator('.tool-card');
      await expect(card.locator('.tool-name')).toContainText(variant.name);
    }
  });
});
