#!/usr/bin/env npx tsx
/**
 * heuristic-webmcp.ts — 80% WebMCP generator, zero LLM calls
 *
 * Pure static analysis: fetch HTML → extract interactive elements → score selectors
 * → classify by interaction pattern → generate skeleton .webmcp.yaml.
 *
 * Handles the 80% case (forms, buttons, nav, inputs) without tokens.
 * Remaining 20% (semantic understanding, result extraction) needs Claude cleanup.
 *
 * Usage:
 *   npx tsx tools/heuristic-webmcp.ts https://agentmail.to
 *   npx tsx tools/heuristic-webmcp.ts https://agentmail.to -o webmcp/marketplace/agentmail.webmcp.yaml
 *   npx tsx tools/heuristic-webmcp.ts https://agentmail.to --json  # structured diagnostics
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

// ============================================================================
// Types
// ============================================================================

interface Element {
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
  selector: string;
  stability: number;
}

interface ToolDef {
  name: string;
  description: string;
  parameters: Record<string, { type: string; required: boolean; description: string }>;
  actions: Array<{ type: string; selector?: string; value?: string; url?: string }>;
  result: { type: string; selector?: string; extract?: string; timeout?: number };
}

// ============================================================================
// Interaction Pattern Classifiers
// ============================================================================

function classifyElements(elements: Element[]): Map<string, Element[]> {
  const groups = new Map<string, Element[]>();

  for (const el of elements) {
    let pattern = 'unknown';

    // Search forms
    if (el.tag === 'input' && (el.type === 'search' || el.placeholder?.toLowerCase().includes('search') || el.ariaLabel?.toLowerCase().includes('search'))) {
      pattern = 'search';
    }
    // Text inputs (login, signup, contact forms)
    else if (el.tag === 'input' && ['text', 'email', 'password', 'tel', 'url', ''].includes(el.type || '')) {
      pattern = 'form-input';
    }
    // Submit/action buttons
    else if ((el.tag === 'button' || el.role === 'button') && el.text && el.text.length < 30) {
      const txt = el.text.toLowerCase();
      if (txt.includes('submit') || txt.includes('send') || txt.includes('sign') || txt.includes('log in') || txt.includes('get started') || txt.includes('try') || txt.includes('start')) {
        pattern = 'cta-button';
      } else {
        pattern = 'action-button';
      }
    }
    // Navigation links
    else if (el.tag === 'a' && el.href && !el.href.startsWith('#') && !el.href.startsWith('javascript')) {
      if (el.href.includes('/docs') || el.href.includes('/api') || el.href.includes('/pricing')) {
        pattern = 'nav-key-page';
      } else if (el.href.startsWith('http') && !el.href.includes(new URL(el.href).hostname.split('.').slice(-2).join('.'))) {
        pattern = 'external-link';
      } else {
        pattern = 'nav-link';
      }
    }
    // Textareas
    else if (el.tag === 'textarea') {
      pattern = 'text-input';
    }
    // Select dropdowns
    else if (el.tag === 'select') {
      pattern = 'dropdown';
    }
    // Forms
    else if (el.tag === 'form') {
      pattern = 'form';
    }

    if (!groups.has(pattern)) groups.set(pattern, []);
    groups.get(pattern)!.push(el);
  }

  return groups;
}

// ============================================================================
// Tool Generator (heuristic, no LLM)
// ============================================================================

function generateTools(url: string, groups: Map<string, Element[]>, allElements: Element[]): ToolDef[] {
  const tools: ToolDef[] = [];
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const siteName = hostname.split('.')[0];

  // 1. Search tool (if search input exists)
  const searchEls = groups.get('search') || [];
  if (searchEls.length > 0) {
    const search = searchEls[0];
    // Find nearby submit button
    const submitBtn = (groups.get('cta-button') || []).find(b =>
      b.text?.toLowerCase().includes('search')
    ) || (groups.get('action-button') || [])[0];

    tools.push({
      name: 'search',
      description: `Search ${siteName}`,
      parameters: { query: { type: 'string', required: true, description: 'Search query' } },
      actions: [
        { type: 'focus', selector: search.selector },
        { type: 'type', value: '{{query}}' },
        ...(submitBtn ? [{ type: 'click', selector: submitBtn.selector }] : []),
      ],
      result: { type: 'wait', timeout: 5000 },
    });
  }

  // 2. CTA tool (signup/get-started/try-free)
  const ctaEls = groups.get('cta-button') || [];
  for (const cta of ctaEls.slice(0, 2)) {
    const name = slugify(cta.text || 'click-cta');
    tools.push({
      name,
      description: `Click "${cta.text}" on ${siteName}`,
      parameters: {},
      actions: [{ type: 'click', selector: cta.selector }],
      result: { type: 'wait', timeout: 3000 },
    });
  }

  // 3. Navigate to key pages (docs, pricing, api)
  const keyPages = groups.get('nav-key-page') || [];
  for (const page of keyPages.slice(0, 5)) {
    const pageName = page.text?.trim() || page.href?.split('/').pop() || 'page';
    const name = `go_to_${slugify(pageName)}`;
    tools.push({
      name,
      description: `Navigate to ${pageName} page`,
      parameters: {},
      actions: [{ type: 'click', selector: page.selector }],
      result: { type: 'wait', timeout: 5000 },
    });
  }

  // 4. Form submission (if form inputs exist)
  const formInputs = groups.get('form-input') || [];
  if (formInputs.length > 0) {
    const params: Record<string, { type: string; required: boolean; description: string }> = {};
    const actions: ToolDef['actions'] = [];

    for (const input of formInputs.slice(0, 5)) {
      const paramName = input.name || input.id || input.placeholder?.toLowerCase().replace(/\s+/g, '_') || `field_${actions.length}`;
      params[paramName] = {
        type: 'string',
        required: input.type === 'email' || input.type === 'password',
        description: input.placeholder || input.ariaLabel || `${input.type || 'text'} field`,
      };
      actions.push({ type: 'focus', selector: input.selector });
      actions.push({ type: 'type', value: `{{${paramName}}}` });
    }

    // Find submit button
    const submitBtn = ctaEls[0] || (groups.get('action-button') || [])[0];
    if (submitBtn) {
      actions.push({ type: 'click', selector: submitBtn.selector });
    }

    tools.push({
      name: 'submit_form',
      description: `Fill and submit the form on ${siteName}`,
      parameters: params,
      actions,
      result: { type: 'wait', timeout: 5000 },
    });
  }

  // 5. Get page info (always available)
  tools.push({
    name: 'get_page_title',
    description: `Get the current page title`,
    parameters: {},
    actions: [{ type: 'evaluate', selector: 'document.title' }],
    result: { type: 'immediate' },
  });

  return tools;
}

// ============================================================================
// YAML Serializer
// ============================================================================

function toYaml(url: string, tools: ToolDef[]): string {
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const name = hostname.split('.')[0];
  const lines: string[] = [];

  lines.push(`# Generated by heuristic-webmcp.ts (no LLM — 80% skeleton)`);
  lines.push(`# Review and refine: result selectors, descriptions, parameter validation`);
  lines.push(`name: ${name}`);
  lines.push(`version: "0.1.0"`);
  lines.push(`match:`);
  lines.push(`  - "https://${hostname}/*"`);
  lines.push(`  - "https://www.${hostname}/*"`);
  lines.push(``);
  lines.push(`tools:`);

  for (const tool of tools) {
    lines.push(`  - name: ${tool.name}`);
    lines.push(`    description: "${tool.description}"`);

    if (Object.keys(tool.parameters).length > 0) {
      lines.push(`    parameters:`);
      for (const [pName, pDef] of Object.entries(tool.parameters)) {
        lines.push(`      ${pName}:`);
        lines.push(`        type: ${pDef.type}`);
        lines.push(`        required: ${pDef.required}`);
        lines.push(`        description: "${pDef.description}"`);
      }
    } else {
      lines.push(`    parameters: {}`);
    }

    lines.push(`    actions:`);
    for (const action of tool.actions) {
      if (action.type === 'evaluate') {
        lines.push(`      - type: evaluate`);
        lines.push(`        script: "${action.selector}"`);
      } else {
        lines.push(`      - type: ${action.type}`);
        if (action.selector) lines.push(`        selector: "${action.selector}"`);
        if (action.value) lines.push(`        value: "${action.value}"`);
        if (action.url) lines.push(`        url: "${action.url}"`);
      }
    }

    lines.push(`    result:`);
    lines.push(`      type: ${tool.result.type}`);
    if (tool.result.selector) lines.push(`      selector: "${tool.result.selector}"`);
    if (tool.result.extract) lines.push(`      extract: ${tool.result.extract}`);
    if (tool.result.timeout) lines.push(`      timeout: ${tool.result.timeout}`);

    lines.push(``);
  }

  return lines.join('\n');
}

// ============================================================================
// HTML Fetcher + Element Extractor
// ============================================================================

async function fetchAndExtract(url: string): Promise<{ elements: Element[]; title: string; html: string }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    signal: AbortSignal.timeout(15000),
    redirect: 'follow',
  });
  const html = await res.text();

  const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || '';
  const elements: Element[] = [];
  const seen = new Set<string>();

  // Extract interactive elements via regex
  const interactivePattern = /<(input|button|select|textarea|a|form)\b([^>]*)(?:>([\s\S]*?)<\/\1>|\/?>)/gi;
  const rolePattern = /<[^>]+\brole\s*=\s*["']button["'][^>]*(?:>([\s\S]*?)<\/[^>]+>|\/?>)/gi;

  for (const pattern of [interactivePattern, rolePattern]) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const full = match[0];
      const sig = full.slice(0, 200); // dedup signature
      if (seen.has(sig)) continue;
      seen.add(sig);

      const tag = (match[1] || 'div').toLowerCase();
      const attrs = full;
      const innerText = (match[3] || match[1] || '').replace(/<[^>]*>/g, '').trim().slice(0, 80);

      const testId = attrs.match(/data-testid\s*=\s*["']([^"']+)["']/)?.[1];
      const id = attrs.match(/\bid\s*=\s*["']([^"']+)["']/)?.[1];
      const ariaLabel = attrs.match(/aria-label\s*=\s*["']([^"']+)["']/)?.[1];
      const name = attrs.match(/\bname\s*=\s*["']([^"']+)["']/)?.[1];
      const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/)?.[1];
      const placeholder = attrs.match(/placeholder\s*=\s*["']([^"']+)["']/)?.[1];
      const href = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/)?.[1];
      const role = attrs.match(/\brole\s*=\s*["']([^"']+)["']/)?.[1];

      let selector = tag;
      let stability = 0.3;
      if (testId) { selector = `[data-testid="${testId}"]`; stability = 1.0; }
      else if (id && !id.startsWith('radix-') && !id.startsWith(':')) { selector = `#${id}`; stability = 0.9; }
      else if (ariaLabel) { selector = `[aria-label="${ariaLabel}"]`; stability = 0.8; }
      else if (name) { selector = `${tag}[name="${name}"]`; stability = 0.7; }
      else if (placeholder) { selector = `${tag}[placeholder="${placeholder}"]`; stability = 0.6; }

      elements.push({ tag, type, role, name, ariaLabel, placeholder, testId, id, href, text: innerText, selector, stability });
    }
  }

  return { elements: elements.filter(e => e.stability >= 0.5), title, html };
}

// ============================================================================
// Helpers
// ============================================================================

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 30);
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  let url = '';
  let output = '';
  let jsonMode = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' || args[i] === '--output') { output = args[++i]; continue; }
    if (args[i] === '--json') { jsonMode = true; continue; }
    if (!args[i].startsWith('-')) { url = args[i]; continue; }
  }

  if (!url) {
    console.error('Usage: heuristic-webmcp.ts <url> [-o output.yaml] [--json]');
    process.exit(1);
  }
  if (!url.startsWith('http')) url = `https://${url}`;

  console.log(`\n--- Heuristic WebMCP Generator (no LLM) ---`);
  console.log(`Target: ${url}\n`);

  // 1. Fetch + extract
  console.log('1. Fetching + extracting elements...');
  const { elements, title } = await fetchAndExtract(url);
  console.log(`   Title: ${title}`);
  console.log(`   ${elements.length} stable elements (≥0.5 stability)`);

  // 2. Classify
  console.log('2. Classifying interaction patterns...');
  const groups = classifyElements(elements);
  for (const [pattern, els] of groups) {
    console.log(`   ${pattern}: ${els.length}`);
  }

  // 3. Generate tools
  console.log('3. Generating tool definitions...');
  const tools = generateTools(url, groups, elements);
  console.log(`   ${tools.length} tools generated`);

  if (jsonMode) {
    console.log(JSON.stringify({ url, title, elements: elements.length, groups: Object.fromEntries([...groups].map(([k, v]) => [k, v.length])), tools }, null, 2));
    return;
  }

  // 4. Serialize to YAML
  const yaml = toYaml(url, tools);

  // 5. Write
  const hostname = new URL(url).hostname.replace(/^www\./, '').replace(/\./g, '-');
  const outputPath = output || `webmcp/marketplace/${hostname}.webmcp.yaml`;
  const dir = dirname(outputPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(outputPath, yaml);
  console.log(`\n✓ Written to ${outputPath} (${yaml.split('\n').length} lines, ${tools.length} tools)`);
  console.log(`  Review: result selectors and descriptions may need Claude refinement`);
}

main().catch(err => {
  console.error(`\nFatal: ${err.message}`);
  process.exit(1);
});
