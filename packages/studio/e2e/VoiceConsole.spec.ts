import { test, expect } from '@playwright/test';

test.describe('VoiceConsole Component', () => {
  test.describe('Trigger Button', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--closed');
    });

    test('should render trigger button when closed', async ({ page }) => {
      const trigger = page.locator('.voice-console-trigger');
      await expect(trigger).toBeVisible();
      await expect(trigger).toContainText(''); // Icon only, no text
    });

    test('should open console when trigger is clicked', async ({ page }) => {
      const trigger = page.locator('.voice-console-trigger');
      await trigger.click();

      const console = page.locator('.voice-console');
      await expect(console).toBeVisible();
    });

    test('should have hover animation', async ({ page }) => {
      const trigger = page.locator('.voice-console-trigger');

      // Get initial transform
      const initialTransform = await trigger.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      // Hover
      await trigger.hover();
      await page.waitForTimeout(300);

      // Should have scale transform
      const hoverTransform = await trigger.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(hoverTransform).not.toBe(initialTransform);
    });
  });

  test.describe('Console Panel', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--open');
      await page.waitForSelector('.voice-console');
    });

    test('should render console header with title and close button', async ({ page }) => {
      const header = page.locator('.console-header');
      await expect(header).toBeVisible();

      const title = header.locator('.console-title');
      await expect(title).toContainText('Voice Console');

      const closeButton = header.locator('.console-close');
      await expect(closeButton).toBeVisible();
    });

    test('should close console when close button is clicked', async ({ page }) => {
      const closeButton = page.locator('.console-close');
      await closeButton.click();

      // Console should be hidden, trigger should appear
      await expect(page.locator('.voice-console')).not.toBeVisible();
      await expect(page.locator('.voice-console-trigger')).toBeVisible();
    });

    test('should display voice indicator in ready state', async ({ page }) => {
      const indicator = page.locator('.voice-indicator');
      await expect(indicator).toBeVisible();
      await expect(indicator).toContainText('Ready');
      await expect(indicator).not.toHaveClass(/listening/);
    });

    test('should display keyboard hint', async ({ page }) => {
      const hint = page.locator('.keyboard-hint');
      await expect(hint).toBeVisible();
      await expect(hint).toContainText('Ctrl');
      await expect(hint).toContainText('Shift');
      await expect(hint).toContainText('V');
    });

    test('should display preset commands', async ({ page }) => {
      const presets = page.locator('.preset-commands');
      await expect(presets).toBeVisible();

      const chips = page.locator('.command-chip');
      await expect(chips).toHaveCount(6); // Default presets
    });

    test('should display text input with submit button', async ({ page }) => {
      const form = page.locator('.text-input-form');
      await expect(form).toBeVisible();

      const input = form.locator('.text-input');
      await expect(input).toBeVisible();
      await expect(input).toHaveAttribute('placeholder', 'Type a command...');

      const submitBtn = form.locator('.submit-btn');
      await expect(submitBtn).toBeVisible();
    });
  });

  test.describe('Listening State', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--listening');
    });

    test('should show listening indicator with animation', async ({ page }) => {
      const indicator = page.locator('.voice-indicator');
      await expect(indicator).toHaveClass(/listening/);
      await expect(indicator).toContainText('Listening...');

      // Should have animation bars
      const pulses = page.locator('.listening-animation .pulse');
      await expect(pulses).toHaveCount(3);
    });

    test('should animate pulse bars', async ({ page }) => {
      const firstPulse = page.locator('.listening-animation .pulse').first();

      // Check animation is running
      const animationName = await firstPulse.evaluate(el =>
        window.getComputedStyle(el).animationName
      );

      expect(animationName).toContain('pulse-bar');
    });
  });

  test.describe('Transcript Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--with-transcript');
    });

    test('should display transcript when available', async ({ page }) => {
      const transcript = page.locator('.transcript-display');
      await expect(transcript).toBeVisible();

      const label = transcript.locator('label');
      await expect(label).toContainText('You said:');

      const content = transcript.locator('p');
      await expect(content).toContainText('Show me the status');
    });
  });

  test.describe('Response Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--with-response');
    });

    test('should display response when available', async ({ page }) => {
      const response = page.locator('.response-display');
      await expect(response).toBeVisible();

      const label = response.locator('label');
      await expect(label).toContainText('Response:');

      const content = response.locator('p');
      await expect(content).toContainText('Found 3 active agents');
    });

    test('should show both transcript and response', async ({ page }) => {
      await expect(page.locator('.transcript-display')).toBeVisible();
      await expect(page.locator('.response-display')).toBeVisible();
    });
  });

  test.describe('Preset Commands', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--open');
    });

    test('should highlight chip on hover', async ({ page }) => {
      const firstChip = page.locator('.command-chip').first();

      const initialBg = await firstChip.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      await firstChip.hover();
      await page.waitForTimeout(200);

      const hoverBg = await firstChip.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(hoverBg).not.toBe(initialBg);
    });

    test('should handle custom preset commands', async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--custom-presets');

      const chips = page.locator('.command-chip');
      await expect(chips).toHaveCount(5);

      await expect(chips.first()).toContainText('Deploy to production');
    });
  });

  test.describe('Text Input', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--open');
    });

    test('should enable submit button when text is entered', async ({ page }) => {
      const input = page.locator('.text-input');
      const submitBtn = page.locator('.submit-btn');

      // Initially disabled
      await expect(submitBtn).toBeDisabled();

      // Type text
      await input.fill('Test command');

      // Should be enabled
      await expect(submitBtn).toBeEnabled();
    });

    test('should disable submit button when input is empty', async ({ page }) => {
      const input = page.locator('.text-input');
      const submitBtn = page.locator('.submit-btn');

      // Enter and clear text
      await input.fill('Test');
      await input.clear();

      // Should be disabled
      await expect(submitBtn).toBeDisabled();
    });

    test('should focus input on click', async ({ page }) => {
      const input = page.locator('.text-input');
      await input.click();

      const isFocused = await input.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    });

    test('should show focus ring on input focus', async ({ page }) => {
      const input = page.locator('.text-input');

      const initialBorder = await input.evaluate(el =>
        window.getComputedStyle(el).borderColor
      );

      await input.focus();
      await page.waitForTimeout(200);

      const focusBorder = await input.evaluate(el =>
        window.getComputedStyle(el).borderColor
      );

      expect(focusBorder).not.toBe(initialBorder);
    });
  });

  test.describe('Interactive Behavior', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--interactive');
    });

    test('should handle command submission', async ({ page }) => {
      // Open console
      await page.locator('.voice-console-trigger').click();

      const input = page.locator('.text-input');
      const submitBtn = page.locator('.submit-btn');

      // Enter command
      await input.fill('Test command');
      await submitBtn.click();

      // Should show transcript
      await expect(page.locator('.transcript-display')).toBeVisible();

      // Should show response (simulated)
      await expect(page.locator('.response-display')).toBeVisible({ timeout: 2000 });
    });

    test('should handle preset command click', async ({ page }) => {
      // Open console
      await page.locator('.voice-console-trigger').click();

      const firstChip = page.locator('.command-chip').first();
      await firstChip.click();

      // Should show transcript
      await expect(page.locator('.transcript-display')).toBeVisible();
    });
  });

  test.describe('Empty States', () => {
    test('should handle no preset commands', async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--no-presets');

      const chips = page.locator('.command-chip');
      await expect(chips).toHaveCount(0);

      // Should still show text input
      await expect(page.locator('.text-input')).toBeVisible();
    });
  });

  test.describe('Animation', () => {
    test('should animate console entrance', async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--closed');

      const trigger = page.locator('.voice-console-trigger');
      await trigger.click();

      const console = page.locator('.voice-console');

      // Check animation is applied
      const animationName = await console.evaluate(el =>
        window.getComputedStyle(el).animationName
      );

      expect(animationName).toContain('console-in');
    });
  });

  test.describe('Responsive Design', () => {
    test('should maintain layout at different viewport sizes', async ({ page }) => {
      await page.goto('http://localhost:6006/?path=/story/components-voiceconsole--open');

      // Desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('.voice-console')).toBeVisible();

      // Tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('.voice-console')).toBeVisible();

      // Mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('.voice-console')).toBeVisible();
    });
  });
});
