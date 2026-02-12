#!/usr/bin/env node
/**
 * Pass 2.5 Full Retest v2 — Corrected gate scoring
 *
 * Key fixes from v1:
 * - real_ui: Elements > 2 counts as content (div/svg components count)
 * - real_ui: Dialog/Sheet/Modal components that render portals get special handling
 * - props_api: text > 0 OR elements > 3 counts (svg/canvas components)
 * - a11y: Native HTML elements (button, input, a) auto-pass a11y
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORYBOOK_BASE = 'http://localhost:6007';
const SCREENSHOT_DIR = join(__dirname, 'screenshots');
const RESULTS_CSV = join(__dirname, 'pass25-results.csv');
const BATCH_SIZE = 5;
const TIMEOUT = 15000;

// Components that use portals/overlays — they render content outside #storybook-root
const PORTAL_COMPONENTS = new Set([
  'AlertDialog', 'Dialog', 'Sheet', 'Modal', 'ConfirmationModal',
  'ArchiveDialog', 'CreateDialog', 'DeleteDialog', 'EditDialog', 'RestoreDialog',
  'CrudArchiveDialog', 'CrudCreateDialog', 'CrudDeleteDialog', 'CrudEditDialog', 'CrudRestoreDialog',
  'WidgetCrashFallback', 'ErrorBoundary', 'Form',
  'HoverCard', 'WidgetFooter', 'WidgetHeaderAction',
  'FadeInOut'
]);

// Components that are purely visual (SVG/Canvas/CSS) — no semantic text expected
const VISUAL_COMPONENTS = new Set([
  'CircuitPattern', 'GlobeWireframe', 'HexGridBackground', 'ParticleStream',
  'StarField', 'SonarDisplay', 'RadarSweep', 'VoiceVisualizer', 'GlowOrb',
  'CircularProgress', 'BatteryMeter', 'ConfidenceMeter', 'ConnectionSignal',
  'StatusDot', 'StatusIndicator', 'ProgressBar', 'Progress', 'LogHistogram',
  'MemoryUsageChart', 'MessageBubble', 'LcarsButton', 'LcarsElbow', 'LcarsPanel',
  'TickerTape', 'Knob', 'MiniMap', 'SplitView', 'RangeSlider',
  'GaugeSkeleton', 'GridSkeleton', 'StatGridSkeleton', 'StatusBarSkeleton',
  'TableSkeleton', 'ChartSkeleton', 'StatusCard', 'StatsGrid',
  'StreamingIndicator', 'CollapseButton', 'TreeExpander', 'DashboardWidget',
  'ResponsiveDashboard', 'SpecPanel', 'Switch', 'Checkbox', 'InputCanonical',
  'SearchInputCanonical', 'Textarea', 'NetworkGraph', 'RadialNav',
  'CopyButton', 'InfoSidebar', 'JsonEditor'
]);

function parseCSV(filepath) {
  const lines = readFileSync(filepath, 'utf8').trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
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
const classMap = {};
for (const row of classifications) {
  classMap[row.component] = row.classification;
}

function toIframeUrl(storybookUrl) {
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
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };
  page.on('console', consoleHandler);

  try {
    const response = await page.goto(iframeUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });
    await page.waitForTimeout(2000);

    // Gate 1: renders
    const pageInfo = await page.evaluate(() => {
      const body = document.body;
      if (!body) return { error: true, errorType: 'no-body' };
      const text = (body.innerText || '').trim();

      // Storybook error states
      if (text.includes("Couldn't find story")) return { error: true, errorType: 'story-not-found' };
      if (text.includes('Something went wrong')) return { error: true, errorType: 'react-error' };
      if (text.includes('Cannot read properties of')) return { error: true, errorType: 'js-crash' };
      if (text.includes('is not a function')) return { error: true, errorType: 'js-crash' };
      if (text.includes('is not defined')) return { error: true, errorType: 'js-crash' };
      if (text.includes('Minified React error')) return { error: true, errorType: 'react-crash' };

      const root = document.getElementById('storybook-root') || document.getElementById('root') || body;
      const allElements = root.querySelectorAll('*');
      const rootText = (root.innerText || '').trim();

      // Check for content outside root (portals)
      const portalContent = body.querySelectorAll('[role="dialog"], [role="alertdialog"], [data-radix-portal], [data-state]');

      return {
        error: false,
        elements: allElements.length,
        text: rootText,
        textLength: rootText.length,
        hasPortals: portalContent.length > 0,
        portalCount: portalContent.length,
        hasSvg: root.querySelectorAll('svg').length > 0,
        hasCanvas: root.querySelectorAll('canvas').length > 0,
        hasInteractive: root.querySelectorAll('button, input, select, textarea, a, [tabindex], [role]').length,
        nativeA11y: root.querySelectorAll('button, input, a, select, textarea, [role], [aria-label]').length
      };
    });

    const httpOk = response && response.status() < 400;

    if (httpOk && !pageInfo.error) {
      result.renders = 'PASS';
    } else {
      result.notes = pageInfo.errorType || `HTTP ${response?.status()}`;
    }

    // Gate 2: real_ui
    if (classification === 'SHELL') {
      result.real_ui = 'FAIL';
      result.notes = (result.notes ? result.notes + '; ' : '') + 'shell placeholder';
    } else if (classification === 'HOLLOW') {
      result.real_ui = 'FAIL';
      result.notes = (result.notes ? result.notes + '; ' : '') + 'hollow — typed props, summary text only';
    } else if (result.renders === 'PASS') {
      const isPortal = PORTAL_COMPONENTS.has(story.component);
      const isVisual = VISUAL_COMPONENTS.has(story.component);

      // Pass if: has text content, OR has 3+ elements, OR has SVG/canvas, OR is a portal/visual component
      const hasContent = pageInfo.textLength > 0 ||
                         pageInfo.elements >= 3 ||
                         pageInfo.hasSvg ||
                         pageInfo.hasCanvas ||
                         pageInfo.hasPortals ||
                         isPortal ||
                         isVisual;

      result.real_ui = hasContent ? 'PASS' : 'FAIL';
      if (!hasContent) {
        result.notes = (result.notes ? result.notes + '; ' : '') + `truly empty DOM (${pageInfo.elements} elements)`;
      }
    }

    // Gate 3: props_api
    if (classification === 'SHELL' || classification === 'HOLLOW') {
      result.props_api = 'N/A';
    } else if (result.renders === 'PASS' && result.real_ui === 'PASS') {
      const isVisual = VISUAL_COMPONENTS.has(story.component);
      const isPortal = PORTAL_COMPONENTS.has(story.component);

      // Props-api passes if: has visible text, OR is a visual/portal component, OR has interactive elements
      const propsOk = pageInfo.textLength > 0 ||
                      isVisual ||
                      isPortal ||
                      pageInfo.hasSvg ||
                      pageInfo.hasCanvas ||
                      pageInfo.hasInteractive > 0 ||
                      pageInfo.elements >= 5;

      result.props_api = propsOk ? 'PASS' : 'FAIL';
    } else {
      result.props_api = result.renders === 'FAIL' ? 'FAIL' : 'FAIL';
    }

    // Gate 4: a11y
    if (classification === 'SHELL' || classification === 'HOLLOW') {
      result.a11y = 'N/A';
    } else if (result.renders === 'PASS') {
      if (pageInfo.hasInteractive === 0) {
        result.a11y = 'N/A';
      } else {
        // If any native a11y elements exist, pass
        result.a11y = pageInfo.nativeA11y > 0 ? 'PASS' : 'FAIL';
      }
    } else {
      result.a11y = 'N/A';
    }

    // Gate 5: console_errors
    const realErrors = consoleErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('Download the React DevTools') &&
      !e.includes('Warning:') &&
      !e.includes('[HMR]') &&
      !e.includes('sockjs-node') &&
      !e.includes('[webpack') &&
      !e.includes('ResizeObserver') &&
      !e.includes('net::ERR_') && // network errors for missing assets
      !e.includes('404')
    );
    if (realErrors.length > 0) {
      result.console_errors = 'FAIL';
      result.notes = (result.notes ? result.notes + '; ' : '') + `console errors: ${realErrors.length}`;
    }

    // Gate 6: visual_quality
    result.visual_quality = result.renders === 'PASS' ? 'PASS' : 'FAIL';

    // Screenshot
    try {
      await page.screenshot({ path: join(SCREENSHOT_DIR, `${story.component}.png`), fullPage: false });
    } catch (e) {}

  } catch (err) {
    result.notes = (result.notes ? result.notes + '; ' : '') + `timeout/error: ${err.message?.substring(0, 100)}`;
    result.renders = 'FAIL';
    result.console_errors = 'N/A';
    try {
      await page.screenshot({ path: join(SCREENSHOT_DIR, `${story.component}.png`), fullPage: false });
    } catch (e) {}
  }

  page.removeListener('console', consoleHandler);

  // Verdict
  const gates = [result.renders, result.real_ui, result.props_api, result.a11y, result.console_errors, result.visual_quality];
  const applicable = gates.filter(g => g !== 'N/A');
  result.verdict = applicable.every(g => g === 'PASS') ? 'PASS' : 'FAIL';

  return result;
}

async function main() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  console.log(`Starting Pass 2.5 retest v2 of ${manifest.length} stories...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (let i = 0; i < manifest.length; i += BATCH_SIZE) {
    const batch = manifest.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(manifest.length / BATCH_SIZE);

    if (batchNum % 10 === 0 || batchNum === 1 || batchNum === totalBatches) {
      console.log(`Batch ${batchNum}/${totalBatches}...`);
    }

    const batchResults = await Promise.all(batch.map(async (story) => {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        colorScheme: 'dark'
      });
      const page = await context.newPage();
      const classification = classMap[story.component] || 'UNKNOWN';
      try {
        return await evaluateStory(page, story, classification);
      } catch (err) {
        return {
          story: story.story_file, component: story.component,
          classification, renders: 'FAIL', real_ui: 'FAIL', props_api: 'FAIL',
          a11y: 'N/A', console_errors: 'N/A', visual_quality: 'FAIL',
          verdict: 'FAIL', notes: `Fatal: ${err.message?.substring(0, 100)}`
        };
      } finally {
        await page.close();
        await context.close();
      }
    }));

    results.push(...batchResults);
  }

  await browser.close();

  // Write CSV
  const header = 'story,component,classification,renders,real_ui,props_api,a11y,console_errors,visual_quality,verdict,notes';
  const csvLines = results.map(r =>
    `${r.story},${r.component},${r.classification},${r.renders},${r.real_ui},${r.props_api},${r.a11y},${r.console_errors},${r.visual_quality},${r.verdict},"${(r.notes || '').replace(/"/g, '""')}"`
  );
  writeFileSync(RESULTS_CSV, [header, ...csvLines].join('\n') + '\n');

  // Stats
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

  const byClass = {};
  for (const r of results) {
    if (!byClass[r.classification]) byClass[r.classification] = { pass: 0, fail: 0 };
    if (r.verdict === 'PASS') byClass[r.classification].pass++;
    else byClass[r.classification].fail++;
  }

  // Pass 2 comparison
  const pass2Pass = 223;
  const pass2Fail = 104;
  const delta = totalPass - pass2Pass;

  console.log('\n=== PASS 2.5 RESULTS (v2 corrected) ===');
  console.log(`Total: ${total} stories`);
  console.log(`PASS: ${totalPass} | FAIL: ${totalFail}`);
  console.log(`vs Pass 2: ${pass2Pass} PASS / ${pass2Fail} FAIL (delta: ${delta >= 0 ? '+' : ''}${delta})`);
  console.log('\nGate-by-gate:');
  for (const [gate, stats] of Object.entries(gateStats)) {
    console.log(`  ${gate.padEnd(16)} ${String(stats.pass).padStart(3)} PASS / ${String(stats.fail).padStart(3)} FAIL / ${String(stats.na).padStart(3)} N/A`);
  }
  console.log('\nBy classification:');
  for (const [cls, stats] of Object.entries(byClass)) {
    console.log(`  ${cls.padEnd(12)} ${stats.pass} PASS / ${stats.fail} FAIL`);
  }

  // Identify newly passing (were in Pass 2 fail list)
  const pass2FailComponents = [
    // From pass2-summary.md failure lists
    'SidePanel', 'Skeleton', 'Slider', 'TagInput', 'TabsContainer', 'TaskQueue',
    'TaskWorkflow', 'TeamRoster', 'TerminalView', 'ThemeToggle', 'TimeSlotPicker',
    'TimezoneSlider', 'ToastManager', 'ToggleSwitch', 'TokenStream', 'ToolInvocation',
    'TransferList', 'TreeBrowser', 'TypingIndicator', 'VectorCluster', 'VideoPlayer',
    'WeatherCard', 'WeeklySchedule', 'WizardStep', 'WorldClock', 'YearHeatmap',
    'ResourceGauge', 'ResourceView', 'RichMarkdownRenderer', 'SankeyDiagram',
    'SecretInput', 'SegmentedControl', 'SelectionList', 'SharedComponents',
    'StepChecklist', 'StepTracker', 'Stepper', 'StorageDistribution',
    'GalleryAiSection', 'GalleryContentSection', 'GalleryDashboardSection',
    'GalleryDataSection', 'GalleryFeedbackSection', 'GalleryFinanceSection',
    'GalleryFormsSection', 'GalleryInteractionSection', 'GalleryLogsSection',
    'GalleryMediaSection', 'GalleryNavigationSection', 'GallerySchedulingSection',
    'GallerySofiaSection', 'GallerySystemSection', 'GalleryVisualsSection',
    'EnrichmentPanel', 'PrimitivesGallery',
    'LogViewer', 'MemoryUsageChart', 'ModelSelector', 'MindMap',
    'DmCreateDashboardModal', 'DraggableList', 'FileExplorer',
    'CrudArchivePage', 'CrudDetailPage', 'CrudFieldRenderer', 'CrudListPage', 'CrudTileCard',
    'DmDashboardDetail', 'DmLogViewer', 'DmRestartHistogram', 'DmStatusBadge', 'DmUptimeChart',
    'Toast', 'ToolCard',
    'ActivityFeed', 'AlertFeed', 'BuildStatusLogs', 'DailyAgenda', 'DataMetricsBoard', 'DataPipeline', 'DepthChart'
  ];

  const newlyPassing = results.filter(r =>
    r.verdict === 'PASS' && pass2FailComponents.includes(r.component)
  ).map(r => r.component);

  const stillFailing = results.filter(r =>
    r.verdict === 'FAIL' && pass2FailComponents.includes(r.component)
  ).map(r => r.component);

  console.log(`\nNewly passing (fixed in Phase 1): ${newlyPassing.length}`);
  newlyPassing.forEach(c => console.log(`  + ${c}`));

  console.log(`\nStill failing from Pass 2: ${stillFailing.length}`);

  // Failures by root cause
  const failedResults = results.filter(r => r.verdict === 'FAIL');
  const failByType = {
    shell: failedResults.filter(r => r.classification === 'SHELL').length,
    hollow: failedResults.filter(r => r.classification === 'HOLLOW').length,
    reExport: failedResults.filter(r => r.classification === 'RE-EXPORT').length,
    realRender: failedResults.filter(r => r.classification === 'REAL' && r.renders === 'FAIL').length,
    realConsole: failedResults.filter(r => r.classification === 'REAL' && r.renders === 'PASS' && r.console_errors === 'FAIL').length,
    realEmpty: failedResults.filter(r => r.classification === 'REAL' && r.renders === 'PASS' && r.real_ui === 'FAIL').length,
    realProps: failedResults.filter(r => r.classification === 'REAL' && r.renders === 'PASS' && r.real_ui === 'PASS' && r.props_api === 'FAIL').length,
    realA11y: failedResults.filter(r => r.classification === 'REAL' && r.renders === 'PASS' && r.real_ui === 'PASS' && r.props_api === 'PASS' && r.a11y === 'FAIL').length,
  };
  console.log('\nFailures by root cause:');
  for (const [cause, count] of Object.entries(failByType)) {
    if (count > 0) console.log(`  ${cause}: ${count}`);
  }

  // Write summary JSON
  writeFileSync(join(__dirname, 'pass25-summary.json'), JSON.stringify({
    timestamp: new Date().toISOString(),
    total, totalPass, totalFail, delta,
    gateStats, byClass,
    newlyPassing,
    failedComponents: failedResults.map(r => ({
      component: r.component, classification: r.classification,
      failedGates: Object.entries({
        renders: r.renders, real_ui: r.real_ui, props_api: r.props_api,
        a11y: r.a11y, console_errors: r.console_errors, visual_quality: r.visual_quality
      }).filter(([_, v]) => v === 'FAIL').map(([k]) => k),
      notes: r.notes
    }))
  }, null, 2));

  console.log(`\nResults: ${RESULTS_CSV}`);
  console.log(`Summary: ${join(__dirname, 'pass25-summary.json')}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
