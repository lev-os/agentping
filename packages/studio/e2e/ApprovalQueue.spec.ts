import { test, expect } from '@playwright/test';

test.describe('ApprovalQueue Component', () => {
  test.describe('Empty State', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--empty');
    });

    test('should not render when queue is empty', async ({ page }) => {
      const queue = page.locator('.approval-queue');
      await expect(queue).not.toBeVisible();
    });
  });

  test.describe('Queue Header', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--multiple-approvals');
      await page.waitForSelector('.approval-queue');
    });

    test('should render header with count badge', async ({ page }) => {
      const header = page.locator('.queue-header');
      await expect(header).toBeVisible();

      const count = header.locator('.queue-count');
      await expect(count).toBeVisible();
      await expect(count).toContainText('4'); // Based on mock data
    });

    test('should show plural "Pending Approvals" for multiple items', async ({ page }) => {
      const header = page.locator('.queue-header');
      await expect(header).toContainText('Pending Approvals');
    });

    test('should show singular "Pending Approval" for single item', async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--single-write');

      const header = page.locator('.queue-header');
      await expect(header).toContainText('Pending Approval');
    });

    test('should render batch action buttons', async ({ page }) => {
      const acceptAll = page.locator('.batch-approve-btn');
      await expect(acceptAll).toBeVisible();
      await expect(acceptAll).toContainText('Accept All');

      const rejectAll = page.locator('.batch-deny-btn');
      await expect(rejectAll).toBeVisible();
      await expect(rejectAll).toContainText('Reject All');
    });

    test('should toggle expansion when header is clicked', async ({ page }) => {
      const header = page.locator('.queue-header');
      const items = page.locator('.queue-items');

      // Should be expanded initially
      await expect(items).toBeVisible();

      // Collapse
      await header.click();
      await expect(items).not.toBeVisible();

      // Expand
      await header.click();
      await expect(items).toBeVisible();
    });

    test('should animate count badge', async ({ page }) => {
      const count = page.locator('.queue-count');

      const animationName = await count.evaluate(el =>
        window.getComputedStyle(el).animationName
      );

      expect(animationName).toContain('pulse-count');
    });
  });

  test.describe('Queue Items', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--multiple-approvals');
      await page.waitForSelector('.queue-items');
    });

    test('should render all queue items', async ({ page }) => {
      const items = page.locator('.queue-item');
      await expect(items).toHaveCount(4); // Based on mock data
    });

    test('should show item icon, label, and path', async ({ page }) => {
      const firstItem = page.locator('.queue-item').first();

      await expect(firstItem.locator('.item-icon')).toBeVisible();
      await expect(firstItem.locator('.item-label')).toBeVisible();
      await expect(firstItem.locator('.item-path')).toBeVisible();
    });

    test('should show approve and deny buttons for each item', async ({ page }) => {
      const firstItem = page.locator('.queue-item').first();

      const approveBtn = firstItem.locator('.item-approve');
      await expect(approveBtn).toBeVisible();

      const denyBtn = firstItem.locator('.item-deny');
      await expect(denyBtn).toBeVisible();
    });

    test('should expand/collapse item on click', async ({ page }) => {
      const firstItem = page.locator('.queue-item').first();
      const header = firstItem.locator('.queue-item-header');

      // Should be expanded by default (first item)
      await expect(firstItem).toHaveClass(/expanded/);

      // Collapse
      await header.click();
      await expect(firstItem).not.toHaveClass(/expanded/);

      // Expand
      await header.click();
      await expect(firstItem).toHaveClass(/expanded/);
    });
  });

  test.describe('Write Tool Approval', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--single-write');
    });

    test('should display Write label and file icon', async ({ page }) => {
      const item = page.locator('.queue-item');
      await expect(item.locator('.item-label')).toContainText('Write');
      await expect(item.locator('.item-icon.write')).toBeVisible();
    });

    test('should show filename in path', async ({ page }) => {
      const item = page.locator('.queue-item');
      const path = item.locator('.item-path');
      await expect(path).toBeVisible();
      // Should show just filename, not full path
      const text = await path.textContent();
      expect(text).not.toContain('/');
    });

    test('should show diff viewer when expanded', async ({ page }) => {
      const item = page.locator('.queue-item');
      const diffViewer = item.locator('.queue-item-diff');
      await expect(diffViewer).toBeVisible();
    });
  });

  test.describe('Edit Tool Approval', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--single-edit');
    });

    test('should display Edit label', async ({ page }) => {
      const item = page.locator('.queue-item');
      await expect(item.locator('.item-label')).toContainText('Edit');
    });

    test('should show code diff when expanded', async ({ page }) => {
      const item = page.locator('.queue-item');
      const diff = item.locator('.queue-item-diff');
      await expect(diff).toBeVisible();

      // Should contain CodeDiffViewer component
      // (Implementation depends on CodeDiffViewer structure)
    });
  });

  test.describe('Bash Tool Approval', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--single-bash');
    });

    test('should display Bash label and terminal icon', async ({ page }) => {
      const item = page.locator('.queue-item');
      await expect(item.locator('.item-label')).toContainText('Bash');
      await expect(item.locator('.item-icon.bash')).toBeVisible();
    });

    test('should show command when expanded', async ({ page }) => {
      const item = page.locator('.queue-item');
      const command = item.locator('.queue-item-command');
      await expect(command).toBeVisible();

      const code = command.locator('code');
      await expect(code).toContainText('$');
    });

    test('should truncate long commands in header', async ({ page }) => {
      const path = page.locator('.item-path');
      const text = await path.textContent();

      // Should truncate if longer than 50 chars
      if (text && text.length >= 50) {
        expect(text).toContain('...');
      }
    });
  });

  test.describe('New File Creation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--new-file');
    });

    test('should show "Create" label for new files', async ({ page }) => {
      const item = page.locator('.queue-item');
      await expect(item.locator('.item-label')).toContainText('Create');
    });

    test('should show file plus icon', async ({ page }) => {
      const item = page.locator('.queue-item');
      // Icon check would depend on lucide-react rendering
      await expect(item.locator('.item-icon')).toBeVisible();
    });
  });

  test.describe('Batch Actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--interactive');
      await page.waitForSelector('.approval-queue');
    });

    test('should accept all approvals when Accept All is clicked', async ({ page }) => {
      const acceptAll = page.locator('.batch-approve-btn');
      const initialCount = await page.locator('.queue-item').count();

      await acceptAll.click();

      // Queue should be empty or reduced
      await page.waitForTimeout(500);
      const newCount = await page.locator('.queue-item').count();
      expect(newCount).toBeLessThan(initialCount);
    });

    test('should reject all approvals when Reject All is clicked', async ({ page }) => {
      const rejectAll = page.locator('.batch-deny-btn');
      const initialCount = await page.locator('.queue-item').count();

      await rejectAll.click();

      // Queue should be empty or reduced
      await page.waitForTimeout(500);
      const newCount = await page.locator('.queue-item').count();
      expect(newCount).toBeLessThan(initialCount);
    });

    test('should hover highlight batch buttons', async ({ page }) => {
      const acceptAll = page.locator('.batch-approve-btn');

      const initialBg = await acceptAll.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      await acceptAll.hover();
      await page.waitForTimeout(200);

      const hoverBg = await acceptAll.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(hoverBg).not.toBe(initialBg);
    });
  });

  test.describe('Individual Actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--interactive');
      await page.waitForSelector('.queue-items');
    });

    test('should approve individual item', async ({ page }) => {
      const firstItem = page.locator('.queue-item').first();
      const approveBtn = firstItem.locator('.item-approve');

      const initialCount = await page.locator('.queue-item').count();

      await approveBtn.click();

      // Wait for item to be removed
      await page.waitForTimeout(500);
      const newCount = await page.locator('.queue-item').count();
      expect(newCount).toBe(initialCount - 1);
    });

    test('should deny individual item', async ({ page }) => {
      const firstItem = page.locator('.queue-item').first();
      const denyBtn = firstItem.locator('.item-deny');

      const initialCount = await page.locator('.queue-item').count();

      await denyBtn.click();

      // Wait for item to be removed
      await page.waitForTimeout(500);
      const newCount = await page.locator('.queue-item').count();
      expect(newCount).toBe(initialCount - 1);
    });

    test('should scale button on hover', async ({ page }) => {
      const approveBtn = page.locator('.item-approve').first();

      const initialTransform = await approveBtn.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      await approveBtn.hover();
      await page.waitForTimeout(200);

      const hoverTransform = await approveBtn.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(hoverTransform).not.toBe(initialTransform);
    });
  });

  test.describe('Large Diff Handling', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--large-diff');
    });

    test('should limit diff height with scroll', async ({ page }) => {
      const diff = page.locator('.queue-item-diff');
      await expect(diff).toBeVisible();

      // Should have max height and scroll
      const maxHeight = await diff.evaluate(el =>
        parseInt(window.getComputedStyle(el).maxHeight)
      );

      expect(maxHeight).toBeLessThanOrEqual(300); // As per component CSS
    });

    test('should allow scrolling within diff viewer', async ({ page }) => {
      const diff = page.locator('.queue-item-diff');

      // Check if scrollable
      const hasScroll = await diff.evaluate(el =>
        el.scrollHeight > el.clientHeight
      );

      expect(hasScroll).toBe(true);

      // Should be able to scroll
      await diff.evaluate(el => el.scrollTop = 100);
      const scrollTop = await diff.evaluate(el => el.scrollTop);
      expect(scrollTop).toBeGreaterThan(0);
    });
  });

  test.describe('Scrolling Behavior', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--many-approvals');
    });

    test('should scroll queue items when many approvals', async ({ page }) => {
      const queueItems = page.locator('.queue-items');

      const hasScroll = await queueItems.evaluate(el =>
        el.scrollHeight > el.clientHeight
      );

      expect(hasScroll).toBe(true);
    });

    test('should have custom scrollbar styling', async ({ page }) => {
      const queueItems = page.locator('.queue-items');

      // Check scrollbar width
      const scrollbarWidth = await queueItems.evaluate(el => {
        const style = window.getComputedStyle(el, '::-webkit-scrollbar');
        return style.width;
      });

      expect(scrollbarWidth).toBe('6px');
    });
  });

  test.describe('Responsive Positioning', () => {
    test('should maintain fixed position at different viewport sizes', async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--multiple-approvals');

      // Desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      const queue = page.locator('.approval-queue');
      const position1 = await queue.evaluate(el => window.getComputedStyle(el).position);
      expect(position1).toBe('fixed');

      // Tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      const position2 = await queue.evaluate(el => window.getComputedStyle(el).position);
      expect(position2).toBe('fixed');
    });
  });

  test.describe('Visual Polish', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-approvalqueue--multiple-approvals');
    });

    test('should have backdrop blur effect', async ({ page }) => {
      const queue = page.locator('.approval-queue');

      const backdropFilter = await queue.evaluate(el =>
        window.getComputedStyle(el).backdropFilter
      );

      expect(backdropFilter).toContain('blur');
    });

    test('should have shadow and border', async ({ page }) => {
      const queue = page.locator('.approval-queue');

      const boxShadow = await queue.evaluate(el =>
        window.getComputedStyle(el).boxShadow
      );

      const border = await queue.evaluate(el =>
        window.getComputedStyle(el).border
      );

      expect(boxShadow).not.toBe('none');
      expect(border).toContain('1px');
    });
  });
});
