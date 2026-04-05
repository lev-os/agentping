#!/usr/bin/env npx tsx
/**
 * intent-webmcp.ts — Intent-driven multi-page WebMCP generator
 *
 * Instead of scraping a single page and guessing tools, this:
 *   1. Takes a site + list of desired intents (or auto-discovers from homepage)
 *   2. Maps each intent to the correct page URL
 *   3. Navigates to each page via stealth CDP (chrome.scripting, no debugger)
 *   4. Scrapes each page's authenticated DOM
 *   5. Generates per-intent tools from THAT page's selectors
 *   6. Merges into a unified .webmcp.yaml
 *
 * Usage:
 *   # Auto-discover intents from homepage:
 *   npx tsx tools/intent-webmcp.ts https://substack.com
 *
 *   # Provide explicit intents:
 *   npx tsx tools/intent-webmcp.ts https://substack.com \
 *     --intent "write_post=/publish/post" \
 *     --intent "post_note=/notes" \
 *     --intent "manage_inbox=/inbox" \
 *     --intent "read_feed=/home"
 *
 *   # Discovery-only mode (just show what intents are available):
 *   npx tsx tools/intent-webmcp.ts https://substack.com --discover
 *
 *   # Use Claude for intent planning (richer output):
 *   npx tsx tools/intent-webmcp.ts https://substack.com --claude
 */

import { spawnSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

// ============================================================================
// Types
// ============================================================================

interface Intent {
  name: string;
  description?: string;
  /** URL path relative to origin (e.g., /publish/post) */
  page: string;
  /** Full URL (resolved at runtime) */
  url?: string;
  /** Tools generated for this intent */
  tools?: IntentTool[];
}

interface IntentTool {
  name: string;
  description: string;
  parameters?: Record<string, ToolParam>;
  actions: ToolAction[];
  result?: ToolResult;
}

interface ToolParam {
  type: string;
  required?: boolean;
  description: string;
}

interface ToolAction {
  type: 'click' | 'fill' | 'select' | 'wait' | 'navigate' | 'extract' | 'scroll';
  selector?: string;
  value?: string;
  url?: string;
  timeout?: number;
}

interface ToolResult {
  type: 'text' | 'html' | 'json' | 'boolean' | 'list';
  selector?: string;
  extract?: string;
}

interface PageScrape {
  url: string;
  title: string;
  elements: ScrapedElement[];
  forms: ScrapedForm[];
  navLinks: NavLink[];
  diagnostics: {
    totalElements: number;
    interactiveCount: number;
    formsCount: number;
    hasDataTestIds: boolean;
    hasAriaLabels: boolean;
  };
}

interface ScrapedElement {
  tag: string;
  type?: string;
  role?: string;
  name?: string;
  ariaLabel?: string;
  placeholder?: string;
  testId?: string;
  id?: string;
  href?: string;
  text?: string;
  classes?: string;
  selector: string;
  stability: number;
}

interface ScrapedForm {
  action: string;
  method: string;
  selector: string;
  fields: Array<{
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
    selector: string;
  }>;
}

interface NavLink {
  text: string;
  href: string;
  /** Inferred intent category */
  category: string;
}

interface CLIArgs {
  url: string;
  intents: Array<{ name: string; page: string }>;
  discover: boolean;
  useClaude: boolean;
  output?: string;
  cdpPort: number;
  waitMs: number;
}

// ============================================================================
// CDP WebSocket helper (reused from generate-webmcp.ts)
// ============================================================================

async function cdpWS(
  port: number,
  method: string,
  params?: Record<string, unknown>,
  timeoutMs = 15000,
): Promise<unknown> {
  const WebSocket = (await import('ws')).default;
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${port}/devtools/browser`);
    const id = Math.floor(Math.random() * 1_000_000);
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error(`CDP ${method} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    ws.on('open', () => {
      ws.send(JSON.stringify({ id, method, params }));
    });
    ws.on('message', (data: Buffer) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        clearTimeout(timeout);
        ws.close();
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
    ws.on('error', (err: Error) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ============================================================================
// Phase 1: DISCOVER — Identify intents from homepage navigation
// ============================================================================

/** Common intent patterns mapped from link text / URL path heuristics */
const INTENT_PATTERNS: Array<{
  pattern: RegExp;
  category: string;
  intentName: string;
  description: string;
}> = [
  // Content creation
  { pattern: /\b(write|compose|create|new\s*post|publish|draft)\b/i, category: 'create', intentName: 'write_post', description: 'Create and publish content' },
  { pattern: /\b(note|short|quick\s*post|status)\b/i, category: 'create', intentName: 'post_note', description: 'Post a short note or status update' },
  { pattern: /\b(upload|media|photo|video|image)\b/i, category: 'create', intentName: 'upload_media', description: 'Upload media content' },

  // Communication
  { pattern: /\b(inbox|messages?|mail|dm|direct)\b/i, category: 'communication', intentName: 'manage_inbox', description: 'Read and respond to messages' },
  { pattern: /\b(chat|conversation|thread)\b/i, category: 'communication', intentName: 'manage_chats', description: 'Manage chat conversations' },
  { pattern: /\b(notification|alert|bell)\b/i, category: 'communication', intentName: 'check_notifications', description: 'View and manage notifications' },

  // Consumption
  { pattern: /\b(feed|home|timeline|stream|for\s*you)\b/i, category: 'consumption', intentName: 'read_feed', description: 'Browse content feed' },
  { pattern: /\b(explore|discover|trending|popular|search)\b/i, category: 'consumption', intentName: 'discover_content', description: 'Explore and discover content' },
  { pattern: /\b(bookmark|saved?|reading\s*list|later)\b/i, category: 'consumption', intentName: 'manage_saved', description: 'Manage saved/bookmarked content' },

  // Account / Settings
  { pattern: /\b(settings?|preferences?|account|profile)\b/i, category: 'account', intentName: 'manage_settings', description: 'Manage account settings' },
  { pattern: /\b(subscriber|follower|following|audience)\b/i, category: 'account', intentName: 'manage_audience', description: 'Manage subscribers and followers' },
  { pattern: /\b(analytics?|stats?|dashboard|insights?)\b/i, category: 'account', intentName: 'view_analytics', description: 'View analytics and statistics' },

  // Commerce
  { pattern: /\b(cart|checkout|order|purchase|buy)\b/i, category: 'commerce', intentName: 'manage_cart', description: 'Manage shopping cart and checkout' },
  { pattern: /\b(billing|payment|subscription|plan)\b/i, category: 'commerce', intentName: 'manage_billing', description: 'Manage billing and subscriptions' },
];

async function discoverIntents(
  origin: string,
  cdpPort: number,
  waitMs: number,
): Promise<{ intents: Intent[]; scrape: PageScrape }> {
  console.log(`\n  Navigating to ${origin}...`);
  console.log(`  (If prompted, grant the lease in the AgentPing extension)`);
  // First CDP command may trigger lease request — give 60s for human approval
  await cdpWS(cdpPort, 'Page.navigate', { url: origin }, 60000);
  await sleep(waitMs);

  // Get page title
  const titleResult = (await cdpWS(cdpPort, 'Runtime.evaluate', {
    expression: 'document.title',
    returnByValue: true,
  })) as any;
  const title = titleResult?.result?.value || '';

  // Extract nav links + interactive elements via chrome.scripting (stealth path)
  const extractResult = (await cdpWS(cdpPort, 'Runtime.evaluate', {
    expression: DISCOVERY_SCRIPT,
    returnByValue: true,
    awaitPromise: false,
  })) as any;

  let parsed: any;
  try {
    parsed = typeof extractResult?.result?.value === 'string'
      ? JSON.parse(extractResult.result.value)
      : extractResult?.result?.value;
  } catch {
    parsed = { navLinks: [], elements: [], forms: [] };
  }

  const navLinks: NavLink[] = (parsed.navLinks || []).map((link: any) => ({
    text: link.text || '',
    href: link.href || '',
    category: categorizeLink(link),
  }));

  // Match nav links to intent patterns
  const intents: Intent[] = [];
  const seen = new Set<string>();

  for (const link of navLinks) {
    for (const pattern of INTENT_PATTERNS) {
      const matchesText = pattern.pattern.test(link.text);
      const matchesHref = pattern.pattern.test(link.href);
      if ((matchesText || matchesHref) && !seen.has(pattern.intentName)) {
        seen.add(pattern.intentName);
        const page = link.href.startsWith('http')
          ? new URL(link.href).pathname
          : link.href;
        intents.push({
          name: pattern.intentName,
          description: pattern.description,
          page,
        });
      }
    }
  }

  const scrape: PageScrape = {
    url: origin,
    title,
    elements: parsed.elements || [],
    forms: parsed.forms || [],
    navLinks,
    diagnostics: parsed.diagnostics || {
      totalElements: 0,
      interactiveCount: 0,
      formsCount: 0,
      hasDataTestIds: false,
      hasAriaLabels: false,
    },
  };

  return { intents, scrape };
}

function categorizeLink(link: { text?: string; href?: string }): string {
  const combined = `${link.text || ''} ${link.href || ''}`.toLowerCase();
  for (const p of INTENT_PATTERNS) {
    if (p.pattern.test(combined)) return p.category;
  }
  return 'other';
}

/** JS injected into the page to extract nav structure + interactive elements */
const DISCOVERY_SCRIPT = `
(function() {
  // Extract all navigation-like links
  var navSels = 'nav a, header a, [role="navigation"] a, aside a, .sidebar a, [class*="nav"] a, [class*="menu"] a, [class*="sidebar"] a';
  var navEls = Array.from(document.querySelectorAll(navSels));

  // Also grab links from common app shell patterns
  var appLinks = Array.from(document.querySelectorAll('a[href^="/"]'));
  var allLinks = [...new Set([...navEls, ...appLinks])];

  var navLinks = allLinks
    .filter(function(el) {
      var href = el.getAttribute('href') || '';
      // Skip anchors, external, auth, and trivial links
      if (!href || href === '#' || href === '/' || href.startsWith('javascript:')) return false;
      if (/\\.(css|js|png|jpg|svg|ico|woff)/.test(href)) return false;
      return true;
    })
    .map(function(el) {
      return {
        text: (el.textContent || '').trim().slice(0, 80),
        href: el.getAttribute('href'),
        ariaLabel: el.getAttribute('aria-label') || '',
      };
    })
    .filter(function(l, i, arr) {
      // Dedupe by href
      return arr.findIndex(function(x) { return x.href === l.href; }) === i;
    })
    .slice(0, 100);

  // Extract interactive elements — expanded to catch SPA editors
  var sels = 'a,button,input,select,textarea,[role=button],[role=textbox],[data-testid],form,[contenteditable=true],[contenteditable=""],.ProseMirror,.tiptap,.ql-editor,[class*=editor],[class*=compose]';
  var els = Array.from(document.querySelectorAll(sels)).slice(0, 150);
  var elements = els.map(function(el) {
    var tid = el.getAttribute('data-testid') || '';
    var al = el.getAttribute('aria-label') || '';
    var id = el.id || '';
    var name = el.getAttribute('name') || '';
    var sel = tid ? '[data-testid="'+tid+'"]' : id ? '#'+id : al ? '[aria-label="'+al+'"]' : name ? el.tagName.toLowerCase()+'[name="'+name+'"]' : el.tagName.toLowerCase();
    var stab = tid ? 1.0 : id ? 0.9 : al ? 0.8 : name ? 0.7 : 0.3;
    return {
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      role: el.getAttribute('role') || '',
      name: name,
      ariaLabel: al,
      placeholder: el.getAttribute('placeholder') || '',
      testId: tid,
      id: id,
      href: el.getAttribute('href') || '',
      text: (el.textContent || '').trim().slice(0, 80),
      classes: el.className ? String(el.className).slice(0, 120) : '',
      selector: sel,
      stability: stab
    };
  });

  // Extract forms
  var forms = Array.from(document.querySelectorAll('form')).slice(0, 10).map(function(form) {
    var fields = Array.from(form.querySelectorAll('input,select,textarea')).map(function(inp) {
      return {
        name: inp.getAttribute('name') || '',
        type: inp.getAttribute('type') || 'text',
        placeholder: inp.getAttribute('placeholder') || '',
        required: inp.hasAttribute('required'),
        selector: inp.id ? '#'+inp.id : inp.getAttribute('name') ? inp.tagName.toLowerCase()+'[name="'+inp.getAttribute('name')+'"]' : inp.tagName.toLowerCase()
      };
    });
    return {
      action: form.getAttribute('action') || '',
      method: form.getAttribute('method') || 'GET',
      selector: form.id ? '#'+form.id : 'form',
      fields: fields
    };
  });

  return JSON.stringify({
    navLinks: navLinks,
    elements: elements,
    forms: forms,
    diagnostics: {
      totalElements: document.querySelectorAll('*').length,
      interactiveCount: elements.length,
      formsCount: forms.length,
      hasDataTestIds: !!document.querySelector('[data-testid]'),
      hasAriaLabels: !!document.querySelector('[aria-label]'),
    }
  });
})()
`;

// ============================================================================
// Phase 1b: DISCOVER via Claude (richer intent mapping)
// ============================================================================

async function discoverIntentsWithClaude(
  origin: string,
  homepageScrape: PageScrape,
): Promise<Intent[]> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic();

  const navSummary = homepageScrape.navLinks
    .map((l) => `  ${l.href} — "${l.text}"`)
    .join('\n');

  const formSummary = homepageScrape.forms
    .map(
      (f) =>
        `  ${f.selector} action=${f.action} method=${f.method} fields=[${f.fields.map((fl) => fl.name || fl.type).join(', ')}]`,
    )
    .join('\n');

  const prompt = `You are analyzing ${origin} to identify what a user can DO on this site.

Navigation links found:
${navSummary || '(none)'}

Forms found:
${formSummary || '(none)'}

Page title: ${homepageScrape.title}
Interactive elements: ${homepageScrape.diagnostics.interactiveCount}

Based on these navigation links and forms, identify the 3-8 most valuable USER INTENTS — things a real user would want to automate via an AI agent. For each intent, provide:
- name: snake_case action name (e.g., write_post, manage_inbox)
- page: the URL path to navigate to for this intent
- description: one-line description of what this intent does

Output ONLY valid JSON array, no explanation:
[{"name": "...", "page": "/...", "description": "..."}]`;

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
    .map((b) => b.text)
    .join('');

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Claude did not return valid JSON intent list');

  const intents: Intent[] = JSON.parse(jsonMatch[0]);
  return intents;
}

// ============================================================================
// Phase 2: SCRAPE — Navigate to each intent page and extract DOM
// ============================================================================

async function scrapeIntentPage(
  origin: string,
  intent: Intent,
  cdpPort: number,
  waitMs: number,
): Promise<PageScrape> {
  const url = intent.page.startsWith('http')
    ? intent.page
    : `${origin}${intent.page.startsWith('/') ? '' : '/'}${intent.page}`;

  console.log(`    → ${intent.name}: navigating to ${url}`);
  await cdpWS(cdpPort, 'Page.navigate', { url }, 30000);
  await sleep(waitMs);

  // Wait for the page to settle (SPA transitions)
  try {
    await cdpWS(
      cdpPort,
      'Runtime.evaluate',
      {
        expression: `new Promise(r => { if (document.readyState === 'complete') r(true); else window.addEventListener('load', () => r(true)); })`,
        awaitPromise: true,
        returnByValue: true,
      },
      10000,
    );
  } catch {
    // Timeout is fine — page might be SPA with no load event
  }

  // Extract page title
  const titleResult = (await cdpWS(cdpPort, 'Runtime.evaluate', {
    expression: 'document.title',
    returnByValue: true,
  })) as any;

  // Extract interactive elements from THIS page
  const extractResult = (await cdpWS(cdpPort, 'Runtime.evaluate', {
    expression: DISCOVERY_SCRIPT,
    returnByValue: true,
  })) as any;

  let parsed: any;
  try {
    parsed =
      typeof extractResult?.result?.value === 'string'
        ? JSON.parse(extractResult.result.value)
        : extractResult?.result?.value;
  } catch {
    parsed = { navLinks: [], elements: [], forms: [] };
  }

  console.log(
    `      ${parsed.elements?.length || 0} elements, ${parsed.forms?.length || 0} forms`,
  );

  return {
    url,
    title: titleResult?.result?.value || '',
    elements: parsed.elements || [],
    forms: parsed.forms || [],
    navLinks: parsed.navLinks || [],
    diagnostics: parsed.diagnostics || {
      totalElements: 0,
      interactiveCount: 0,
      formsCount: 0,
      hasDataTestIds: false,
      hasAriaLabels: false,
    },
  };
}

// ============================================================================
// Phase 3: GENERATE — Per-intent tools from page selectors
// ============================================================================

function generateToolsHeuristic(intent: Intent, scrape: PageScrape): IntentTool[] {
  const tools: IntentTool[] = [];

  // 1. Generate tools from forms
  for (const form of scrape.forms) {
    const formName = form.action
      ? form.action.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '_') || 'submit_form'
      : 'submit_form';

    const params: Record<string, ToolParam> = {};
    const actions: ToolAction[] = [];

    for (const field of form.fields) {
      if (field.type === 'hidden' || field.type === 'submit') continue;
      const paramName =
        field.name || field.placeholder?.toLowerCase().replace(/\s+/g, '_') || `field_${field.type}`;
      params[paramName] = {
        type: field.type === 'number' ? 'number' : 'string',
        required: field.required,
        description: field.placeholder || `${field.type} field`,
      };
      actions.push({ type: 'fill', selector: field.selector, value: `{{${paramName}}}` });
    }

    // Add submit action
    const submitBtn =
      scrape.elements.find(
        (el) =>
          el.type === 'submit' ||
          (el.tag === 'button' &&
            /submit|save|send|post|publish/i.test(el.text || '')),
      );
    if (submitBtn) {
      actions.push({ type: 'click', selector: submitBtn.selector });
    }

    if (actions.length > 0) {
      tools.push({
        name: `${intent.name}_${formName}`,
        description: `Submit ${formName} form on ${intent.name} page`,
        parameters: params,
        actions,
        result: { type: 'boolean' },
      });
    }
  }

  // 2. Generate tools from buttons/CTAs on this page
  const buttons = scrape.elements.filter(
    (el) =>
      (el.tag === 'button' || el.role === 'button') &&
      el.stability >= 0.5 &&
      el.text &&
      el.text.length > 1 &&
      el.text.length < 50,
  );

  for (const btn of buttons.slice(0, 8)) {
    const actionName = (btn.text || btn.ariaLabel || 'action')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 30);

    if (!actionName || actionName.length < 2) continue;

    tools.push({
      name: `${intent.name}_${actionName}`,
      description: `Click "${btn.text}" on ${intent.name} page`,
      actions: [{ type: 'click', selector: btn.selector }],
      result: { type: 'boolean' },
    });
  }

  // 3. Generate text input tools for contenteditable / textareas / editors
  const editors = scrape.elements.filter(
    (el) =>
      el.tag === 'textarea' ||
      el.role === 'textbox' ||
      (el.classes && /editor|compose|content|tiptap|prosemirror|ql-editor|ProseMirror|draft-editor/i.test(el.classes)) ||
      (el.ariaLabel && /write|compose|body|content|text|title|heading/i.test(el.ariaLabel)),
  );

  for (const editor of editors.slice(0, 3)) {
    const editorName = editor.placeholder || editor.ariaLabel || editor.name || 'content';
    const paramKey = editorName.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    tools.push({
      name: `${intent.name}_set_${paramKey}`,
      description: `Set ${editorName} text on ${intent.name} page`,
      parameters: {
        text: {
          type: 'string',
          required: true,
          description: `Text content for ${editorName}`,
        },
      },
      actions: [{ type: 'fill', selector: editor.selector, value: '{{text}}' }],
      result: { type: 'boolean' },
    });
  }

  // 4. Generate a page-level "get content" tool
  tools.push({
    name: `${intent.name}_get_page`,
    description: `Extract visible content from the ${intent.name} page`,
    actions: [{ type: 'extract', selector: 'main, [role="main"], article, .content, body' }],
    result: { type: 'text', selector: 'main, [role="main"], article, .content, body', extract: 'textContent' },
  });

  return tools;
}

async function generateToolsWithClaude(
  intent: Intent,
  scrape: PageScrape,
): Promise<IntentTool[]> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic();

  const elementSummary = scrape.elements
    .filter((e) => e.stability >= 0.5)
    .map(
      (e) =>
        `  ${e.selector} — ${e.tag}${e.type ? `[${e.type}]` : ''} "${e.ariaLabel || e.placeholder || e.text || ''}"`,
    )
    .join('\n');

  const formSummary = scrape.forms
    .map(
      (f) =>
        `  ${f.selector} → ${f.fields.map((fl) => `${fl.name}:${fl.type}`).join(', ')}`,
    )
    .join('\n');

  const prompt = `You are generating WebMCP tool definitions for the "${intent.name}" intent on ${scrape.url}.

Intent: ${intent.name} — ${intent.description || 'user action'}
Page title: ${scrape.title}

Interactive elements on this page:
${elementSummary || '(none with stable selectors)'}

Forms on this page:
${formSummary || '(none)'}

Generate 2-6 tools that let an AI agent perform the "${intent.name}" intent. Each tool should:
1. Use REAL selectors from the elements above (don't invent selectors)
2. Have clear parameter names and descriptions
3. Include the correct action sequence (fill, click, wait, extract)

Output ONLY valid JSON array of tools:
[{
  "name": "tool_name",
  "description": "What this tool does",
  "parameters": {"param": {"type": "string", "required": true, "description": "..."}},
  "actions": [{"type": "fill|click|wait|extract|navigate", "selector": "...", "value": "{{param}}"}],
  "result": {"type": "text|boolean|json|list", "selector": "...", "extract": "textContent|innerHTML"}
}]`;

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return generateToolsHeuristic(intent, scrape);

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return generateToolsHeuristic(intent, scrape);
  }
}

// ============================================================================
// Phase 4: MERGE — Combine into .webmcp.yaml
// ============================================================================

function generateYaml(
  siteName: string,
  siteUrl: string,
  intents: Intent[],
): string {
  const hostname = new URL(siteUrl).hostname.replace(/^www\./, '');
  const lines: string[] = [];

  lines.push(`# WebMCP shim for ${hostname}`);
  lines.push(`# Generated by intent-webmcp.ts on ${new Date().toISOString().split('T')[0]}`);
  lines.push(`# ${intents.length} intents, ${intents.reduce((s, i) => s + (i.tools?.length || 0), 0)} tools`);
  lines.push('');
  lines.push(`name: ${siteName}`);
  lines.push(`version: "0.1.0"`);
  lines.push(`origin: ${siteUrl}`);
  lines.push(`auth: browser_session`);
  lines.push('');
  lines.push('intents:');

  for (const intent of intents) {
    lines.push(`  ${intent.name}:`);
    lines.push(`    description: "${intent.description || intent.name}"`);
    lines.push(`    page: "${intent.page}"`);

    if (intent.tools && intent.tools.length > 0) {
      lines.push('    tools:');

      for (const tool of intent.tools) {
        lines.push(`      - name: ${tool.name}`);
        lines.push(`        description: "${escapeYaml(tool.description)}"`);

        if (tool.parameters && Object.keys(tool.parameters).length > 0) {
          lines.push('        parameters:');
          for (const [pname, param] of Object.entries(tool.parameters)) {
            lines.push(`          ${pname}:`);
            lines.push(`            type: ${param.type}`);
            if (param.required) lines.push('            required: true');
            lines.push(`            description: "${escapeYaml(param.description)}"`);
          }
        }

        if (tool.actions && tool.actions.length > 0) {
          lines.push('        actions:');
          for (const action of tool.actions) {
            let actionLine = `          - type: ${action.type}`;
            if (action.selector) actionLine += `\n            selector: "${escapeYaml(action.selector)}"`;
            if (action.value) actionLine += `\n            value: "${escapeYaml(action.value)}"`;
            if (action.url) actionLine += `\n            url: "${action.url}"`;
            if (action.timeout) actionLine += `\n            timeout: ${action.timeout}`;
            lines.push(actionLine);
          }
        }

        if (tool.result) {
          lines.push(`        result:`);
          lines.push(`          type: ${tool.result.type}`);
          if (tool.result.selector) lines.push(`          selector: "${escapeYaml(tool.result.selector)}"`);
          if (tool.result.extract) lines.push(`          extract: ${tool.result.extract}`);
        }
      }
    }

    lines.push('');
  }

  return lines.join('\n');
}

function escapeYaml(s: string): string {
  return s.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

/** Find selectors that appear across ALL scraped pages (global nav/shell) */
function findGlobalSelectors(scrapes: Map<string, PageScrape>): Set<string> {
  if (scrapes.size < 2) return new Set();

  const selectorCounts = new Map<string, number>();
  for (const [, scrape] of scrapes) {
    const pageSelectors = new Set(scrape.elements.map((el) => el.selector));
    for (const sel of pageSelectors) {
      selectorCounts.set(sel, (selectorCounts.get(sel) || 0) + 1);
    }
  }

  const global = new Set<string>();
  const threshold = Math.max(2, Math.ceil(scrapes.size * 0.5));
  for (const [sel, count] of selectorCounts) {
    // If a selector appears on 2+ pages (or 50%+), it's likely global nav
    if (count >= threshold) global.add(sel);
  }
  return global;
}

/** Common app shell / nav button text to filter out of per-intent tools */
const NAV_BUTTON_TEXT = new Set([
  'home', 'subscriptions', 'chat', 'activity', 'explore', 'discover',
  'dashboard', 'profile', 'settings', 'notifications', 'search', 'menu',
  'back', 'close', 'cancel', 'sign in', 'sign up', 'log in', 'log out',
  'create', 'new', 'more', 'help', 'about',
]);

/** Check if an element is a nav/shell button (not page-specific content) */
function isNavElement(el: ScrapedElement): boolean {
  const text = (el.text || '').toLowerCase().trim();
  // Exact match on common nav labels
  if (NAV_BUTTON_TEXT.has(text)) return true;
  // Numbered badges like "1Chat", "4Activity"
  if (/^\d+[a-z]/i.test(text) && NAV_BUTTON_TEXT.has(text.replace(/^\d+/, '').toLowerCase())) return true;
  // Links to other pages (not the current intent)
  if (el.tag === 'a' && el.href?.startsWith('/') && !el.href.includes('?')) {
    const path = el.href.split('/')[1]?.toLowerCase();
    if (NAV_BUTTON_TEXT.has(path || '')) return true;
  }
  return false;
}

/** Detect unstable selectors (React-generated IDs, random hashes, etc.) */
function isUnstableSelector(selector: string): boolean {
  // Radix UI generated IDs: #radix-:r3:, #radix-:r5:, etc.
  if (/radix-:r\w+:/.test(selector)) return true;
  // React generated IDs with random chars
  if (/#[a-z]-[a-z0-9]{6,}/i.test(selector)) return true;
  // Generic tag-only selectors (no specificity)
  if (/^(div|span|a|button|input|form|ul|li)$/.test(selector)) return true;
  return false;
}

/** Deduplicate tools by name, keeping the one with more actions */
function deduplicateTools(tools: IntentTool[]): IntentTool[] {
  const byName = new Map<string, IntentTool>();
  for (const tool of tools) {
    const existing = byName.get(tool.name);
    if (!existing || (tool.actions?.length || 0) > (existing.actions?.length || 0)) {
      byName.set(tool.name, tool);
    }
  }
  return Array.from(byName.values());
}

// ============================================================================
// Also get raw HTML via Scrapling for richer selector data
// ============================================================================

async function enrichWithScrapling(
  scrape: PageScrape,
): Promise<ScrapedElement[]> {
  // Check if scrapling is available
  const check = spawnSync('python3', ['-c', 'import scrapling'], {
    stdio: 'pipe',
  });
  if (check.status !== 0) return scrape.elements;

  // Get HTML from current page via CDP
  // (already navigated, just need to grab DOM)
  // Actually this is called per-page, so we already have the elements.
  // Scrapling enrichment is a future enhancement.
  return scrape.elements;
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const flags: CLIArgs = {
    url: '',
    intents: [],
    discover: false,
    useClaude: false,
    cdpPort: 7891,
    waitMs: 3000,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--intent' || arg === '-i') {
      const val = args[++i];
      const [name, page] = val.split('=');
      if (name && page) flags.intents.push({ name, page });
      continue;
    }
    if (arg === '--discover' || arg === '-d') { flags.discover = true; continue; }
    if (arg === '--claude' || arg === '-c') { flags.useClaude = true; continue; }
    if (arg === '-o' || arg === '--output') { flags.output = args[++i]; continue; }
    if (arg === '--cdp-port') { flags.cdpPort = parseInt(args[++i], 10); continue; }
    if (arg === '--wait') { flags.waitMs = parseInt(args[++i], 10); continue; }
    if (!arg.startsWith('-')) { flags.url = arg; continue; }
  }

  if (!flags.url) {
    console.error(`Usage: intent-webmcp.ts <url> [--intent "name=/path"] [--discover] [--claude]

Examples:
  # Auto-discover intents from nav:
  npx tsx tools/intent-webmcp.ts https://substack.com

  # Explicit intents:
  npx tsx tools/intent-webmcp.ts https://substack.com \\
    --intent "write_post=/publish/post" \\
    --intent "read_feed=/home"

  # Discovery only (show available intents):
  npx tsx tools/intent-webmcp.ts https://substack.com --discover

  # Use Claude for richer intent mapping + tool generation:
  npx tsx tools/intent-webmcp.ts https://substack.com --claude`);
    process.exit(1);
  }

  if (!flags.url.startsWith('http')) flags.url = `https://${flags.url}`;
  return flags;
}

async function main() {
  const args = parseArgs();
  const origin = new URL(args.url).origin;
  const hostname = new URL(args.url).hostname.replace(/^www\./, '');
  const siteName = hostname.split('.')[0];

  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║   Intent-Driven WebMCP Generator         ║`);
  console.log(`╚══════════════════════════════════════════╝`);
  console.log(`Target: ${origin}`);
  console.log(`CDP:    ws://localhost:${args.cdpPort}`);

  // ── Phase 1: Discover intents ──────────────────────────────────
  console.log(`\n── Phase 1: ${args.intents.length > 0 ? 'Using provided intents' : 'Discovering intents'} ──`);

  let intents: Intent[];
  let homepageScrape: PageScrape;

  if (args.intents.length > 0) {
    // User provided explicit intents
    intents = args.intents.map((i) => ({
      name: i.name,
      page: i.page,
      description: `User-defined intent: ${i.name}`,
    }));
    // Still scrape homepage for context
    const discovery = await discoverIntents(origin, args.cdpPort, args.waitMs);
    homepageScrape = discovery.scrape;

    console.log(`  ${intents.length} intents provided by user`);
  } else {
    // Auto-discover
    const discovery = await discoverIntents(origin, args.cdpPort, args.waitMs);
    homepageScrape = discovery.scrape;

    if (args.useClaude && discovery.intents.length > 0) {
      console.log(`  Heuristic found ${discovery.intents.length} intents, refining with Claude...`);
      intents = await discoverIntentsWithClaude(origin, homepageScrape);
    } else {
      intents = discovery.intents;
    }

    console.log(`  Discovered ${intents.length} intents:`);
    for (const intent of intents) {
      console.log(`    ${intent.name.padEnd(25)} → ${intent.page}`);
    }
  }

  // Discovery-only mode
  if (args.discover) {
    console.log(`\n── Discovery Complete ──`);
    console.log(`\nNav links found: ${homepageScrape.navLinks.length}`);
    for (const link of homepageScrape.navLinks) {
      const cat = link.category !== 'other' ? ` [${link.category}]` : '';
      console.log(`  ${link.href.padEnd(40)} "${link.text}"${cat}`);
    }
    console.log(`\nTo generate with these intents:`);
    const intentArgs = intents
      .map((i) => `--intent "${i.name}=${i.page}"`)
      .join(' \\\n    ');
    console.log(`  npx tsx tools/intent-webmcp.ts ${args.url} \\\n    ${intentArgs}`);
    return;
  }

  if (intents.length === 0) {
    console.log(`\n  No intents discovered. Try --discover to see nav links, or provide --intent flags.`);
    process.exit(1);
  }

  // ── Phase 2: Scrape each intent page ──────────────────────────
  console.log(`\n── Phase 2: Scraping ${intents.length} intent pages ──`);

  const pageScrapes = new Map<string, PageScrape>();

  for (const intent of intents) {
    try {
      const scrape = await scrapeIntentPage(origin, intent, args.cdpPort, args.waitMs);
      pageScrapes.set(intent.name, scrape);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`    ✗ ${intent.name}: ${msg}`);
    }
  }

  // ── Phase 2b: Identify global elements (nav shell) ───────────
  // Elements that appear on EVERY page are nav shell — exclude them from per-intent tools
  const globalSelectors = findGlobalSelectors(pageScrapes);
  if (globalSelectors.size > 0) {
    console.log(`  Filtered ${globalSelectors.size} global nav selectors`);
  }

  // ── Phase 3: Generate per-intent tools ─────────────────────────
  console.log(`\n── Phase 3: Generating tools per intent ──`);

  for (const intent of intents) {
    const scrape = pageScrapes.get(intent.name);
    if (!scrape) continue;

    // Filter out global nav elements, unstable selectors, and nav buttons
    const filtered: PageScrape = {
      ...scrape,
      elements: scrape.elements.filter(
        (el) =>
          !globalSelectors.has(el.selector) &&
          !isUnstableSelector(el.selector) &&
          !isNavElement(el),
      ),
      forms: scrape.forms.filter(
        (f) => !globalSelectors.has(f.selector) && !isUnstableSelector(f.selector),
      ),
    };

    if (args.useClaude) {
      console.log(`  ${intent.name}: generating with Claude...`);
      intent.tools = await generateToolsWithClaude(intent, filtered);
    } else {
      intent.tools = generateToolsHeuristic(intent, filtered);
    }

    // Deduplicate tool names
    intent.tools = deduplicateTools(intent.tools);

    console.log(`  ${intent.name}: ${intent.tools.length} tools`);
    for (const tool of intent.tools) {
      console.log(`    - ${tool.name}`);
    }
  }

  // ── Phase 4: Generate YAML ──────────────────────────────────────
  console.log(`\n── Phase 4: Generating .webmcp.yaml ──`);

  const yaml = generateYaml(siteName, origin, intents);
  const outputPath =
    args.output || `webmcp/marketplace/${hostname.replace(/\./g, '-')}.webmcp.yaml`;
  const dir = dirname(outputPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(outputPath, yaml);

  const toolCount = intents.reduce((s, i) => s + (i.tools?.length || 0), 0);
  console.log(`\n✓ ${outputPath}`);
  console.log(`  ${intents.length} intents, ${toolCount} tools`);
  console.log(`  Edit the YAML to refine selectors and add semantic descriptions.`);
}

main().catch((err) => {
  console.error(`\nFatal: ${err.message}`);
  process.exit(1);
});
