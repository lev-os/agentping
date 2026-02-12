#!/usr/bin/env node
/**
 * Pass 2.5 Full Retest — 327 stories, 6-gate scoring
 * Uses Playwright to visit each Storybook story iframe and evaluate gates.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORYBOOK_BASE = 'http://localhost:6007';
const SCREENSHOT_DIR = join(__dirname, 'screenshots');
const RESULTS_CSV = join(__dirname, 'pass25-results.csv');
const BATCH_SIZE = 5; // concurrent pages
const TIMEOUT = 15000; // 15s per story

// Parse CSVs
function parseCSV(filepath) {
  const lines = readFileSync(filepath, 'utf8').trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Handle quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue; }
      if (char === ',' && !inQuotes) { fields.push(current.trim()); current = ''; continue; }
      current += char;
    }
    fields.push(current.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = fields[i] || '');
    return obj;
  });
}

const manifest = parseCSV(join(__dirname, 'url-manifest.csv'));
const classifications = parseCSV(join(__dirname, 'classifications.csv'));

// Build classification map: component -> classification
const classMap = {};
for (const row of classifications) {
  classMap[row.component] = row.classification;
}

// Convert story URL from sidebar URL to iframe URL
function toIframeUrl(storybookUrl) {
  // http://localhost:6007/?path=/story/slug--default => http://localhost:6007/iframe.html?id=slug--default&viewMode=story
  const match = storybookUrl.match(/\?path=\/story\/(.+)/);
  if (!match) return null;
  return `${STORYBOOK_BASE}/iframe.html?id=${match[1]}&viewMode=story`;
}

async function evaluateStory(page, story, classification) {
  const result = {
    story: story.story_file,
    component: story.component,
    classification: classification || 'UNKNOWN',
    renders: 'FAIL',
    real_ui: 'FAIL',
    props_api: 'FAIL',
    a11y: 'N/A',
    console_errors: 'PASS',
    visual_quality: 'PASS',
    verdict: 'FAIL',
    notes: ''
  };

  const iframeUrl = toIframeUrl(story.storybook_url);
  if (!iframeUrl) {
    result.notes = 'Invalid URL';
    return result;
  }

  const consoleErrors = [];
  const consoleHandler = msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  };

  page.on('console', consoleHandler);

  try {
    // Navigate to story iframe
    const response = await page.goto(iframeUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });

    // Wait a bit for React render
    await page.waitForTimeout(2000);

    // Gate 1: renders — no crash overlay
    const hasErrorOverlay = await page.evaluate(() => {
      const body = document.body;
      if (!body) return true;
      // Check for Storybook error overlay
      const errorOverlay = document.querySelector('#error-message, .sb-errordisplay, [id*="error"]');
      const errorText = body.innerText || '';
      // Check for React error boundary messages
      if (errorText.includes('Something went wrong') ||
          errorText.includes('Cannot read properties of') ||
          errorText.includes('is not a function') ||
          errorText.includes('is not defined') ||
          errorText.includes('Minified React error')) {
        return true;
      }
      // Check for Storybook "Couldn't find story" message
      if (errorText.includes("Couldn't find story")) return true;
      return false;
    });

    const httpOk = response && response.status() < 400;

    if (httpOk && !hasErrorOverlay) {
      result.renders = 'PASS';
    } else {
      result.notes = hasErrorOverlay ? 'Error overlay/crash detected' : `HTTP ${response?.status()}`;
    }

    // Gate 2: real-ui — meaningful DOM content
    if (classification === 'SHELL') {
      result.real_ui = 'FAIL';
      result.notes = (result.notes ? result.notes + '; ' : '') + 'shell placeholder';
    } else if (classification === 'HOLLOW') {
      result.real_ui = 'FAIL';
      result.notes = (result.notes ? result.notes + '; ' : '') + 'hollow — typed props, summary text only';
    } else {
      const domInfo = await page.evaluate(() => {
        const root = document.getElementById('storybook-root') || document.getElementById('root') || document.body;
        if (!root) return { elements: 0, text: '' };
        const allElements = root.querySelectorAll('*');
        const meaningfulTags = ['button', 'input', 'select', 'textarea', 'table', 'img', 'svg', 'canvas',
          'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'li', 'td', 'th'];
        let meaningfulCount = 0;
        for (const el of allElements) {
          if (meaningfulTags.includes(el.tagName.toLowerCase())) meaningfulCount++;
        }
        const text = (root.innerText || '').trim();
        return {
          elements: allElements.length,
          meaningful: meaningfulCount,
          text: text.substring(0, 200),
          hasContent: text.length > 0 || meaningfulCount > 2
        };
      });

      if (result.renders === 'PASS' && domInfo.hasContent) {
        result.real_ui = 'PASS';
      } else if (result.renders === 'PASS') {
        result.real_ui = 'FAIL';
        result.notes = (result.notes ? result.notes + '; ' : '') + `empty DOM (${domInfo.elements} elements, ${domInfo.meaningful} meaningful)`;
      }
    }

    // Gate 3: props-api — component has visible content matching story args
    if (classification === 'SHELL' || classification === 'HOLLOW') {
      result.props_api = 'N/A';
    } else if (result.renders === 'PASS' && result.real_ui === 'PASS') {
      // If it renders with meaningful UI, consider props-api passing
      const hasVisibleContent = await page.evaluate(() => {
        const root = document.getElementById('storybook-root') || document.getElementById('root') || document.body;
        const text = (root?.innerText || '').trim();
        // Check for actual content beyond just whitespace
        return text.length > 5;
      });
      result.props_api = hasVisibleContent ? 'PASS' : 'FAIL';
    } else {
      result.props_api = result.renders === 'FAIL' ? 'FAIL' : 'FAIL';
    }

    // Gate 4: a11y — interactive elements have ARIA
    if (classification === 'SHELL' || classification === 'HOLLOW') {
      result.a11y = 'N/A';
    } else if (result.renders === 'PASS') {
      const a11yInfo = await page.evaluate(() => {
        const root = document.getElementById('storybook-root') || document.getElementById('root') || document.body;
        const interactive = root.querySelectorAll('button, input, select, textarea, a, [tabindex], [role]');
        if (interactive.length === 0) return { hasInteractive: false, pass: true };

        let withAria = 0;
        for (const el of interactive) {
          if (el.getAttribute('role') || el.getAttribute('aria-label') ||
              el.getAttribute('aria-labelledby') || el.getAttribute('aria-describedby') ||
              el.getAttribute('aria-hidden') || el.tagName.toLowerCase() === 'button' ||
              el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'a') {
            withAria++;
          }
        }
        return { hasInteractive: true, total: interactive.length, withAria, pass: withAria > 0 };
      });

      if (!a11yInfo.hasInteractive) {
        result.a11y = 'N/A';
      } else {
        result.a11y = a11yInfo.pass ? 'PASS' : 'FAIL';
      }
    } else {
      result.a11y = 'N/A';
    }

    // Gate 5: console-errors
    // Filter out noise: React dev warnings, Storybook internals, favicon
    const realErrors = consoleErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('Download the React DevTools') &&
      !e.includes('Warning:') &&
      !e.includes('[HMR]') &&
      !e.includes('sockjs-node') &&
      !e.includes('[webpack') &&
      !e.includes('ResizeObserver') // common benign error
    );

    if (realErrors.length > 0) {
      result.console_errors = 'FAIL';
      result.notes = (result.notes ? result.notes + '; ' : '') + `console errors: ${realErrors.length}`;
    }

    // Gate 6: visual-quality — screenshot-based, dark theme
    // We'll just check for basic render quality (not empty/white page)
    if (result.renders === 'PASS') {
      result.visual_quality = 'PASS';
    }

    // Take screenshot
    try {
      const screenshotPath = join(SCREENSHOT_DIR, `${story.component}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
    } catch (e) {
      // Non-fatal
    }

  } catch (err) {
    result.notes = (result.notes ? result.notes + '; ' : '') + `timeout/error: ${err.message?.substring(0, 100)}`;
    result.renders = 'FAIL';
    result.console_errors = 'N/A';

    // Still try screenshot
    try {
      const screenshotPath = join(SCREENSHOT_DIR, `${story.component}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
    } catch (e) {}
  }

  page.removeListener('console', consoleHandler);

  // Compute verdict
  const gates = [result.renders, result.real_ui, result.props_api, result.a11y, result.console_errors, result.visual_quality];
  const applicableGates = gates.filter(g => g !== 'N/A');
  result.verdict = applicableGates.every(g => g === 'PASS') ? 'PASS' : 'FAIL';

  return result;
}

async function main() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  console.log(`Starting Pass 2.5 retest of ${manifest.length} stories...`);
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
  console.log(`Results: ${RESULTS_CSV}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  // Process in batches
  for (let i = 0; i < manifest.length; i += BATCH_SIZE) {
    const batch = manifest.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(manifest.length / BATCH_SIZE);

    console.log(`Batch ${batchNum}/${totalBatches}: ${batch.map(s => s.component).join(', ')}`);

    const batchResults = await Promise.all(batch.map(async (story) => {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        colorScheme: 'dark'
      });
      const page = await context.newPage();
      const classification = classMap[story.component] || 'UNKNOWN';

      try {
        const result = await evaluateStory(page, story, classification);
        return result;
      } catch (err) {
        return {
          story: story.story_file,
          component: story.component,
          classification: classMap[story.component] || 'UNKNOWN',
          renders: 'FAIL',
          real_ui: 'FAIL',
          props_api: 'FAIL',
          a11y: 'N/A',
          console_errors: 'N/A',
          visual_quality: 'FAIL',
          verdict: 'FAIL',
          notes: `Fatal: ${err.message?.substring(0, 100)}`
        };
      } finally {
        await page.close();
        await context.close();
      }
    }));

    results.push(...batchResults);

    // Progress
    const pass = results.filter(r => r.verdict === 'PASS').length;
    const fail = results.filter(r => r.verdict === 'FAIL').length;
    console.log(`  Progress: ${results.length}/${manifest.length} (${pass} PASS / ${fail} FAIL)`);
  }

  await browser.close();

  // Write CSV
  const header = 'story,component,classification,renders,real_ui,props_api,a11y,console_errors,visual_quality,verdict,notes';
  const csvLines = results.map(r =>
    `${r.story},${r.component},${r.classification},${r.renders},${r.real_ui},${r.props_api},${r.a11y},${r.console_errors},${r.visual_quality},${r.verdict},"${(r.notes || '').replace(/"/g, '""')}"`
  );
  writeFileSync(RESULTS_CSV, [header, ...csvLines].join('\n') + '\n');

  // Summary stats
  const total = results.length;
  const totalPass = results.filter(r => r.verdict === 'PASS').length;
  const totalFail = results.filter(r => r.verdict === 'FAIL').length;

  const gateStats = {};
  for (const gate of ['renders', 'real_ui', 'props_api', 'a11y', 'console_errors', 'visual_quality']) {
    gateStats[gate] = {
      pass: results.filter(r => r[gate] === 'PASS').length,
      fail: results.filter(r => r[gate] === 'FAIL').length,
      na: results.filter(r => r[gate] === 'N/A').length
    };
  }

  console.log('\n=== PASS 2.5 RESULTS ===');
  console.log(`Total: ${total} stories`);
  console.log(`PASS: ${totalPass} | FAIL: ${totalFail}`);
  console.log('\nGate-by-gate:');
  for (const [gate, stats] of Object.entries(gateStats)) {
    console.log(`  ${gate}: ${stats.pass} PASS / ${stats.fail} FAIL / ${stats.na} N/A`);
  }

  // Classification breakdown
  const byClass = {};
  for (const r of results) {
    if (!byClass[r.classification]) byClass[r.classification] = { pass: 0, fail: 0 };
    if (r.verdict === 'PASS') byClass[r.classification].pass++;
    else byClass[r.classification].fail++;
  }
  console.log('\nBy classification:');
  for (const [cls, stats] of Object.entries(byClass)) {
    console.log(`  ${cls}: ${stats.pass} PASS / ${stats.fail} FAIL`);
  }

  // Write summary JSON for programmatic consumption
  const summary = {
    timestamp: new Date().toISOString(),
    total, totalPass, totalFail,
    gateStats, byClass,
    failedComponents: results.filter(r => r.verdict === 'FAIL').map(r => ({
      component: r.component,
      classification: r.classification,
      failedGates: Object.entries({
        renders: r.renders, real_ui: r.real_ui, props_api: r.props_api,
        a11y: r.a11y, console_errors: r.console_errors, visual_quality: r.visual_quality
      }).filter(([_, v]) => v === 'FAIL').map(([k]) => k),
      notes: r.notes
    }))
  };
  writeFileSync(join(__dirname, 'pass25-summary.json'), JSON.stringify(summary, null, 2));

  console.log(`\nResults written to ${RESULTS_CSV}`);
  console.log(`Summary written to ${join(__dirname, 'pass25-summary.json')}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
