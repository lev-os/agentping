#!/usr/bin/env npx tsx
/**
 * generate-webmcp.ts — Multi-backend WebMCP definition generator
 *
 * Takes a URL, scrapes it using a pluggable backend, feeds the result to Claude,
 * and generates a validated .webmcp.yaml tool definition.
 *
 * Backends:
 *   - dom (default): agent-browser snapshot -i → pure DOM analysis, no deps
 *   - scrapling: Python Scrapling library (BSD-3, optional pip install)
 *   - crawl4ai: Python crawl4ai library (Apache-2.0, optional pip install)
 *   - raw: direct HTML fetch (no JS rendering, fastest, simplest)
 *
 * The 80% case (forms, buttons, navigation, text) works with just `dom`.
 * Use scrapling/crawl4ai for anti-bot sites or when you need stealth.
 *
 * Usage:
 *   npx tsx tools/generate-webmcp.ts https://united.com
 *   npx tsx tools/generate-webmcp.ts https://united.com --backend scrapling
 *   npx tsx tools/generate-webmcp.ts https://united.com --backend crawl4ai --validate
 *   npx tsx tools/generate-webmcp.ts https://united.com --diagnostics
 */

import { execSync, spawnSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// ============================================================================
// Types
// ============================================================================

interface ScraperResult {
  url: string;
  title: string;
  /** Interactive elements (forms, buttons, links, inputs) */
  interactiveElements: InteractiveElement[];
  /** Full accessibility tree or HTML structure */
  rawSnapshot: string;
  /** Diagnostics about the page */
  diagnostics: PageDiagnostics;
  /** Which backend was used */
  backend: string;
}

interface InteractiveElement {
  tag: string;
  type?: string;
  role?: string;
  name?: string;
  ariaLabel?: string;
  placeholder?: string;
  testId?: string;
  id?: string;
  classes?: string[];
  href?: string;
  text?: string;
  /** Best stable selector for this element */
  selector: string;
  /** Selector stability score 0-1 */
  stability: number;
}

interface PageDiagnostics {
  totalElements: number;
  interactiveCount: number;
  formsCount: number;
  hasDataTestIds: boolean;
  hasAriaLabels: boolean;
  frameworks: string[];
  antiBot: string[];
  jsRequired: boolean;
  loadTimeMs?: number;
}

interface BackendConfig {
  name: string;
  available: () => boolean;
  scrape: (url: string, options: ScrapeOptions) => Promise<ScraperResult>;
}

interface ScrapeOptions {
  timeout?: number;
  waitForSelector?: string;
  cdpPort?: number;
}

interface CLIArgs {
  url: string;
  backend: string;
  output?: string;
  validate: boolean;
  diagnostics: boolean;
  cdpPort: number;
  listBackends: boolean;
}

// ============================================================================
// Backend: DOM (agent-browser via CDP proxy)
// ============================================================================

const domBackend: BackendConfig = {
  name: 'dom',

  available() {
    try {
      execSync('which agent-browser', { stdio: 'pipe' });
      return true;
    } catch { return false; }
  },

  async scrape(url: string, options: ScrapeOptions): Promise<ScraperResult> {
    const port = options.cdpPort || 7891;

    // Navigate
    ab(`open "${url}"`, port);
    await sleep(3000);

    // Get title
    const title = ab('eval "document.title"', port).replace(/^"|"$/g, '');

    // Get interactive accessibility tree
    let rawSnapshot: string;
    try {
      rawSnapshot = ab('snapshot -i', port);
    } catch {
      // Fallback to regular snapshot
      rawSnapshot = ab('eval "document.documentElement.outerHTML.slice(0, 50000)"', port);
    }

    // Extract interactive elements via JS evaluation
    const elementsJson = ab(`eval "${escapeForShell(EXTRACT_ELEMENTS_SCRIPT)}"`, port);
    let interactiveElements: InteractiveElement[] = [];
    let diagnostics: PageDiagnostics = defaultDiagnostics();

    try {
      const parsed = JSON.parse(elementsJson);
      interactiveElements = parsed.elements || [];
      diagnostics = { ...diagnostics, ...parsed.diagnostics };
    } catch {
      // If JSON parsing fails, we still have the raw snapshot
    }

    return { url, title, interactiveElements, rawSnapshot, diagnostics, backend: 'dom' };
  },
};

// ============================================================================
// Backend: Raw HTML (no JS, fastest)
// ============================================================================

const rawBackend: BackendConfig = {
  name: 'raw',
  available: () => true,

  async scrape(url: string): Promise<ScraperResult> {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();

    // Parse interactive elements from raw HTML using regex (fast, no deps)
    const interactiveElements = extractElementsFromHTML(html);
    const diagnostics = analyzeDiagnosticsFromHTML(html);

    return {
      url,
      title: html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || '',
      interactiveElements,
      rawSnapshot: html.slice(0, 50000),
      diagnostics,
      backend: 'raw',
    };
  },
};

// ============================================================================
// Backend: Scrapling (Python, BSD-3, optional)
// ============================================================================

const scraplingBackend: BackendConfig = {
  name: 'scrapling',

  available() {
    const result = spawnSync('python3', ['-c', 'import scrapling'], { stdio: 'pipe' });
    return result.status === 0;
  },

  async scrape(url: string, options: ScrapeOptions): Promise<ScraperResult> {
    // Use Scrapling's Selector (HTML parser) with Fetcher (HTTP, no browser deps).
    // StealthyFetcher requires curl_cffi + browser — only use if available.
    const script = `
import json, sys, urllib.request

def build_selector(el):
    tid = el.attrib.get("data-testid", "")
    if tid: return f'[data-testid="{tid}"]'
    eid = el.attrib.get("id", "")
    if eid: return f'#{eid}'
    al = el.attrib.get("aria-label", "")
    if al: return f'[aria-label="{al}"]'
    nm = el.attrib.get("name", "")
    if nm: return f'{el.tag}[name="{nm}"]'
    return el.tag

def score_selector(el):
    if el.attrib.get("data-testid"): return 1.0
    if el.attrib.get("id"): return 0.9
    if el.attrib.get("aria-label"): return 0.8
    if el.attrib.get("name"): return 0.7
    return 0.3

# Try StealthyFetcher first, fall back to Fetcher, fall back to urllib
page = None
try:
    from scrapling import StealthyFetcher
    page = StealthyFetcher.fetch("${url}", headless=True, network_idle=True)
except ImportError:
    try:
        from scrapling import Fetcher
        page = Fetcher.get("${url}")
    except Exception:
        pass

if page is None:
    from scrapling import Selector
    req = urllib.request.Request("${url}", headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", errors="replace")
    page = Selector(html)

elements = []
for el in page.css('a, button, input, select, textarea, [role="button"], [data-testid], form'):
    elements.append({
        "tag": el.tag,
        "type": el.attrib.get("type", ""),
        "role": el.attrib.get("role", ""),
        "name": el.attrib.get("name", ""),
        "ariaLabel": el.attrib.get("aria-label", ""),
        "placeholder": el.attrib.get("placeholder", ""),
        "testId": el.attrib.get("data-testid", ""),
        "id": el.attrib.get("id", ""),
        "href": el.attrib.get("href", ""),
        "text": (el.text or "").strip()[:80],
        "selector": build_selector(el),
        "stability": score_selector(el),
    })

title_el = page.css_first("title") if hasattr(page, 'css_first') else (page.css("title")[0] if page.css("title") else None)
result = {
    "url": "${url}",
    "title": title_el.text if title_el else "",
    "elements": elements[:100],
    "html_snippet": str(page.body)[:50000] if hasattr(page, 'body') else "",
    "diagnostics": {
        "totalElements": len(page.css("*")),
        "interactiveCount": len(elements),
        "formsCount": len(page.css("form")),
        "hasDataTestIds": bool(page.css("[data-testid]")),
        "hasAriaLabels": bool(page.css("[aria-label]")),
    }
}
print(json.dumps(result))
`;

    const result = spawnSync('python3', ['-c', script], {
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (result.status !== 0) {
      throw new Error(`Scrapling failed: ${result.stderr}`);
    }

    const parsed = JSON.parse(result.stdout);
    return {
      url: parsed.url,
      title: parsed.title,
      interactiveElements: parsed.elements,
      rawSnapshot: parsed.html_snippet,
      diagnostics: { ...defaultDiagnostics(), ...parsed.diagnostics },
      backend: 'scrapling',
    };
  },
};

// ============================================================================
// Backend: crawl4ai (Python, Apache-2.0, optional)
// ============================================================================

const crawl4aiBackend: BackendConfig = {
  name: 'crawl4ai',

  available() {
    const result = spawnSync('python3', ['-c', 'import crawl4ai'], { stdio: 'pipe' });
    return result.status === 0;
  },

  async scrape(url: string): Promise<ScraperResult> {
    const script = `
import json, asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

async def main():
    config = CrawlerRunConfig(
        wait_until="networkidle",
        page_timeout=20000,
    )
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url="${url}", config=config)

        print(json.dumps({
            "url": "${url}",
            "title": result.metadata.get("title", "") if result.metadata else "",
            "markdown": result.markdown[:30000] if result.markdown else "",
            "html_snippet": result.html[:50000] if result.html else "",
            "links": [{"href": l.get("href",""), "text": l.get("text","")} for l in (result.links or {}).get("internal", [])[:50]],
        }))

asyncio.run(main())
`;

    const result = spawnSync('python3', ['-c', script], {
      encoding: 'utf-8',
      timeout: 45000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (result.status !== 0) {
      throw new Error(`crawl4ai failed: ${result.stderr}`);
    }

    const parsed = JSON.parse(result.stdout);
    return {
      url: parsed.url,
      title: parsed.title,
      interactiveElements: extractElementsFromHTML(parsed.html_snippet || ''),
      rawSnapshot: parsed.markdown || parsed.html_snippet || '',
      diagnostics: { ...defaultDiagnostics(), jsRequired: true },
      backend: 'crawl4ai',
    };
  },
};

// ============================================================================
// Backend Registry
// ============================================================================

const BACKENDS = new Map<string, BackendConfig>([
  ['dom', domBackend],
  ['raw', rawBackend],
  ['scrapling', scraplingBackend],
  ['crawl4ai', crawl4aiBackend],
]);

// ============================================================================
// Element Extraction (pure JS, for raw/dom backends)
// ============================================================================

/** JS script injected via agent-browser eval to extract interactive elements */
const EXTRACT_ELEMENTS_SCRIPT = `
(function() {
  var sels = 'a,button,input,select,textarea,[role=button],[data-testid],form,[contenteditable=true]';
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
      selector: sel,
      stability: stab
    };
  });

  var all = document.querySelectorAll('*');
  return JSON.stringify({
    elements: elements,
    diagnostics: {
      totalElements: all.length,
      interactiveCount: elements.length,
      formsCount: document.querySelectorAll('form').length,
      hasDataTestIds: !!document.querySelector('[data-testid]'),
      hasAriaLabels: !!document.querySelector('[aria-label]'),
      frameworks: detectFrameworks(),
      antiBot: detectAntiBot(),
      jsRequired: !!document.querySelector('[data-reactroot],[id=__next],[id=app]')
    }
  });

  function detectFrameworks() {
    var fw = [];
    if (window.__NEXT_DATA__) fw.push('nextjs');
    if (document.querySelector('[data-reactroot]') || window.__REACT_DEVTOOLS_GLOBAL_HOOK__) fw.push('react');
    if (window.__VUE__) fw.push('vue');
    if (window.angular) fw.push('angular');
    if (document.querySelector('[data-svelte-h]')) fw.push('svelte');
    return fw;
  }

  function detectAntiBot() {
    var ab = [];
    if (document.querySelector('#challenge-running,#cf-challenge-running,.cf-browser-verification')) ab.push('cloudflare');
    if (document.querySelector('[data-callback*=recaptcha],.g-recaptcha')) ab.push('recaptcha');
    if (document.querySelector('[data-sitekey]')) ab.push('hcaptcha');
    if (window.__AKAMAI_BOT_MANAGER__) ab.push('akamai');
    return ab;
  }
})()
`;

/** Extract elements from raw HTML via regex (no DOM needed) */
function extractElementsFromHTML(html: string): InteractiveElement[] {
  const elements: InteractiveElement[] = [];
  const patterns = [
    /<(input|button|select|textarea|a)\b([^>]*)>/gi,
    /<[^>]+\brole\s*=\s*["']button["'][^>]*>/gi,
    /<[^>]+\bdata-testid\s*=\s*["'][^"']+["'][^>]*>/gi,
  ];

  const seen = new Set<string>();

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const full = match[0];
      if (seen.has(full)) continue;
      seen.add(full);

      const tag = (match[1] || 'div').toLowerCase();
      const attrs = full;

      const testId = attrs.match(/data-testid\s*=\s*["']([^"']+)["']/)?.[1];
      const id = attrs.match(/\bid\s*=\s*["']([^"']+)["']/)?.[1];
      const ariaLabel = attrs.match(/aria-label\s*=\s*["']([^"']+)["']/)?.[1];
      const name = attrs.match(/\bname\s*=\s*["']([^"']+)["']/)?.[1];
      const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/)?.[1];
      const placeholder = attrs.match(/placeholder\s*=\s*["']([^"']+)["']/)?.[1];
      const href = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/)?.[1];

      let selector = tag;
      let stability = 0.3;

      if (testId) { selector = `[data-testid="${testId}"]`; stability = 1.0; }
      else if (id) { selector = `#${id}`; stability = 0.9; }
      else if (ariaLabel) { selector = `[aria-label="${ariaLabel}"]`; stability = 0.8; }
      else if (name) { selector = `${tag}[name="${name}"]`; stability = 0.7; }

      elements.push({ tag, type, name, ariaLabel, placeholder, testId, id, href, selector, stability });
    }
  }

  return elements.slice(0, 100);
}

function analyzeDiagnosticsFromHTML(html: string): PageDiagnostics {
  return {
    totalElements: (html.match(/<[a-z]/gi) || []).length,
    interactiveCount: (html.match(/<(input|button|select|textarea|a)\b/gi) || []).length,
    formsCount: (html.match(/<form\b/gi) || []).length,
    hasDataTestIds: /data-testid/.test(html),
    hasAriaLabels: /aria-label/.test(html),
    frameworks: detectFrameworksFromHTML(html),
    antiBot: detectAntiBotFromHTML(html),
    jsRequired: /__NEXT_DATA__|data-reactroot|id="app"|id="__next"/.test(html),
  };
}

function detectFrameworksFromHTML(html: string): string[] {
  const fw: string[] = [];
  if (/__NEXT_DATA__/.test(html)) fw.push('nextjs');
  if (/data-reactroot|_reactRootContainer/.test(html)) fw.push('react');
  if (/__VUE__|data-v-[a-f0-9]/.test(html)) fw.push('vue');
  if (/ng-app|ng-controller/.test(html)) fw.push('angular');
  return fw;
}

function detectAntiBotFromHTML(html: string): string[] {
  const ab: string[] = [];
  if (/challenge-running|cf-browser-verification|cloudflare/i.test(html)) ab.push('cloudflare');
  if (/g-recaptcha|recaptcha/i.test(html)) ab.push('recaptcha');
  if (/data-sitekey|hcaptcha/i.test(html)) ab.push('hcaptcha');
  return ab;
}

// ============================================================================
// Claude Generation
// ============================================================================

async function generateWithClaude(result: ScraperResult): Promise<string> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic();

  const promptPath = join(dirname(new URL(import.meta.url).pathname), 'prompts/generate-webmcp.txt');
  let promptTemplate = existsSync(promptPath) ? readFileSync(promptPath, 'utf-8') : FALLBACK_PROMPT;

  // Build element summary for the prompt
  const elementSummary = result.interactiveElements
    .filter(e => e.stability >= 0.5)
    .map(e => `  ${e.selector} — ${e.tag}${e.type ? `[${e.type}]` : ''} ${e.ariaLabel || e.placeholder || e.text || ''}`.trim())
    .join('\n');

  const context = `URL: ${result.url}
Title: ${result.title}
Backend: ${result.backend}

Page Diagnostics:
- ${result.diagnostics.interactiveCount} interactive elements
- ${result.diagnostics.formsCount} forms
- data-testid: ${result.diagnostics.hasDataTestIds ? 'yes' : 'no'}
- aria-labels: ${result.diagnostics.hasAriaLabels ? 'yes' : 'no'}
- Frameworks: ${result.diagnostics.frameworks?.join(', ') || 'unknown'}
- Anti-bot: ${result.diagnostics.antiBot?.length ? result.diagnostics.antiBot.join(', ') : 'none detected'}
- JS required: ${result.diagnostics.jsRequired ? 'yes' : 'no'}

Stable Interactive Elements (selector — tag description):
${elementSummary || '(none extracted — use raw snapshot below)'}

Raw Snapshot (first 20000 chars):
${result.rawSnapshot.slice(0, 20000)}`;

  const prompt = promptTemplate
    .replace('{{url}}', result.url)
    .replace('{{snapshot}}', context);

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
    .map(b => b.text)
    .join('\n');

  const yamlMatch = text.match(/```ya?ml\n([\s\S]*?)```/);
  if (yamlMatch) return yamlMatch[1].trim();

  const yamlStart = text.indexOf('name:');
  if (yamlStart !== -1) return text.slice(yamlStart).trim();

  return text;
}

const FALLBACK_PROMPT = `Given this page analysis from {{url}}:

{{snapshot}}

Generate a .webmcp.yaml tool definition. Focus on the 5-10 most useful user-facing actions.
Use the stable selectors provided. Output ONLY the YAML, no explanation.`;

// ============================================================================
// Helpers
// ============================================================================

function ab(command: string, cdpPort: number): string {
  const result = execSync(`agent-browser --cdp ${cdpPort} ${command}`, {
    encoding: 'utf-8',
    timeout: 30000,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return result.trim();
}

function escapeForShell(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function defaultDiagnostics(): PageDiagnostics {
  return {
    totalElements: 0, interactiveCount: 0, formsCount: 0,
    hasDataTestIds: false, hasAriaLabels: false, frameworks: [], antiBot: [], jsRequired: false,
  };
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const flags: CLIArgs = { url: '', backend: 'dom', validate: false, diagnostics: false, cdpPort: 7891, listBackends: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--backend' || arg === '-b') { flags.backend = args[++i]; continue; }
    if (arg === '-o' || arg === '--output') { flags.output = args[++i]; continue; }
    if (arg === '--validate') { flags.validate = true; continue; }
    if (arg === '--diagnostics' || arg === '--diag') { flags.diagnostics = true; continue; }
    if (arg === '--cdp-port') { flags.cdpPort = parseInt(args[++i], 10); continue; }
    if (arg === '--list-backends' || arg === '--backends') { flags.listBackends = true; continue; }
    if (!arg.startsWith('-')) { flags.url = arg; continue; }
  }

  if (flags.listBackends) return flags;

  if (!flags.url) {
    console.error('Usage: generate-webmcp.ts <url> [--backend dom|raw|scrapling|crawl4ai] [--diagnostics] [--validate]');
    process.exit(1);
  }
  if (!flags.url.startsWith('http')) flags.url = `https://${flags.url}`;

  return flags;
}

async function main() {
  const args = parseArgs();

  // List backends
  if (args.listBackends) {
    console.log('\nAvailable backends:\n');
    for (const [name, backend] of BACKENDS) {
      const avail = backend.available();
      console.log(`  ${avail ? '✓' : '✗'} ${name.padEnd(12)} ${avail ? 'ready' : 'not installed'}`);
    }
    console.log('\nInstall optional backends:');
    console.log('  pip install scrapling     # BSD-3, stealth + adaptive selectors');
    console.log('  pip install crawl4ai      # Apache-2.0, LLM-native crawler\n');
    return;
  }

  const backend = BACKENDS.get(args.backend);
  if (!backend) {
    console.error(`Unknown backend: ${args.backend}. Use --list-backends to see options.`);
    process.exit(1);
  }

  if (!backend.available()) {
    console.error(`Backend '${args.backend}' is not available. Install it first.`);
    if (args.backend === 'scrapling') console.error('  pip install scrapling');
    if (args.backend === 'crawl4ai') console.error('  pip install crawl4ai');
    if (args.backend === 'dom') console.error('  npm install -g agent-browser && start daemon with CDP proxy on port 7891');
    process.exit(1);
  }

  console.log(`\n--- WebMCP Generator ---`);
  console.log(`Target:  ${args.url}`);
  console.log(`Backend: ${args.backend}\n`);

  // 1. Scrape
  console.log('1. Scraping page...');
  const result = await backend.scrape(args.url, { cdpPort: args.cdpPort });
  console.log(`   Title: ${result.title}`);
  console.log(`   ${result.interactiveElements.length} interactive elements found`);

  // 2. Diagnostics
  if (args.diagnostics) {
    console.log('\n--- Page Diagnostics ---');
    const d = result.diagnostics;
    console.log(`   Total elements:  ${d.totalElements}`);
    console.log(`   Interactive:     ${d.interactiveCount}`);
    console.log(`   Forms:           ${d.formsCount}`);
    console.log(`   data-testid:     ${d.hasDataTestIds ? 'yes' : 'no'}`);
    console.log(`   aria-labels:     ${d.hasAriaLabels ? 'yes' : 'no'}`);
    console.log(`   Frameworks:      ${d.frameworks?.join(', ') || 'unknown'}`);
    console.log(`   Anti-bot:        ${d.antiBot?.length ? d.antiBot.join(', ') : 'none'}`);
    console.log(`   JS required:     ${d.jsRequired ? 'yes' : 'no'}`);

    // Show top elements by stability
    console.log('\n   Top stable selectors:');
    const stable = result.interactiveElements
      .sort((a, b) => b.stability - a.stability)
      .slice(0, 15);
    for (const el of stable) {
      const label = el.ariaLabel || el.placeholder || el.text || el.name || '';
      console.log(`     ${el.stability.toFixed(1)} ${el.selector.padEnd(50)} ${label.slice(0, 40)}`);
    }

    if (!args.output) return; // diagnostics-only mode
  }

  // 3. Generate
  console.log('\n2. Generating WebMCP definition via Claude...');
  const yaml = await generateWithClaude(result);
  console.log(`   Generated ${yaml.split('\n').length} lines of YAML`);

  // 4. Write output
  const hostname = new URL(args.url).hostname.replace(/^www\./, '').replace(/\./g, '-');
  const outputPath = args.output || `webmcp/${hostname}.webmcp.yaml`;
  const dir = dirname(outputPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(outputPath, yaml);
  console.log(`\n✓ Written to ${outputPath}`);
}

main().catch(err => {
  console.error(`\nFatal: ${err.message}`);
  process.exit(1);
});
