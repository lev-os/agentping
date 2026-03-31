/**
 * `ap browse` — agent-browser-style commands over the AgentPing daemon HTTP API.
 *
 * Commands: open, click, fill, snapshot, screenshot, eval, cookies, tabs
 * Each maps to POST /api/v1/cdp with the right CDP method.
 * Auto-requests a lease on first command if no active lease exists.
 */

import type { Command } from 'commander';
import ora from 'ora';
import { writeFileSync } from 'fs';

const API_BASE = process.env.AGENTPING_URL || 'http://localhost:7890';

// Default scopes for auto-lease — broad enough for browse commands
const DEFAULT_SCOPES = ['browser:navigate', 'browser:interact', 'cookies:read', 'storage:read'];

// ============================================================================
// Auto-Lease: ensure an active lease before any CDP command
// ============================================================================

let cachedLeaseToken: string | null = null;

async function ensureLease(agentName = 'ap-browse'): Promise<void> {
  // If we already have a token from env or prior auto-lease, try it
  if (cachedLeaseToken || process.env.AGENTPING_LEASE_TOKEN) {
    return;
  }

  // Probe: try a harmless CDP call. If 403 "No active lease", request one.
  try {
    const probe = await fetch(`${API_BASE}/api/v1/cdp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'Browser.getVersion', params: {} }),
      signal: AbortSignal.timeout(3000),
    });

    if (probe.ok) return; // Lease is already active

    const body = await probe.json().catch(() => ({})) as { error?: string };
    if (!body.error?.includes('No active lease') && !body.error?.includes('not connected')) {
      return; // Some other error, let the actual command handle it
    }
  } catch {
    // Daemon not reachable — let the actual command fail with a clear error
    return;
  }

  // Request a lease with wait=true
  const spinner = ora('Requesting browser lease (approve in extension)...').start();
  try {
    const res = await fetch(`${API_BASE}/api/v1/lease/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentName,
        scopes: DEFAULT_SCOPES,
        wait: true,
        timeoutMs: 60_000,
      }),
      signal: AbortSignal.timeout(65_000),
    });

    if (!res.ok) {
      spinner.fail('Lease request failed');
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error || `Lease request failed: ${res.status}`);
    }

    const data = await res.json() as { status: string; lease?: { token: string; scopes: string[]; expiresAt: number } };

    if (data.status === 'approved' && data.lease) {
      cachedLeaseToken = data.lease.token;
      spinner.succeed(`Lease granted (scopes: ${data.lease.scopes.join(', ')}, expires: ${new Date(data.lease.expiresAt).toISOString()})`);
    } else {
      spinner.fail('Lease denied');
      throw new Error('Lease request was denied by user');
    }
  } catch (err) {
    if ((err as Error).message.includes('denied')) throw err;
    spinner.fail(`Lease request failed: ${(err as Error).message}`);
    throw err;
  }
}

// ============================================================================
// CDP Helper
// ============================================================================

async function cdp(method: string, params: Record<string, unknown> = {}, timeoutMs = 10000): Promise<unknown> {
  await ensureLease();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = cachedLeaseToken || process.env.AGENTPING_LEASE_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/v1/cdp`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ method, params, timeoutMs }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error || `CDP ${method} failed: ${res.status}`);
  }

  const data = await res.json() as { result: unknown };
  return data.result;
}

// ============================================================================
// Register Browse Commands
// ============================================================================

export function registerBrowseCommands(program: Command): void {
  const browse = program
    .command('browse')
    .description('Agent-browser-style commands over AgentPing CDP (auto-lease)');

  // ── open <url> ─────────────────────────────────────────────────────────
  browse
    .command('open <url>')
    .description('Navigate to a URL')
    .option('--json', 'Output as JSON')
    .action(async (url: string, options: { json?: boolean }) => {
      const spinner = ora(`Navigating to ${url}...`).start();
      try {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        const result = await cdp('Page.navigate', { url: fullUrl });
        spinner.succeed(`Navigated to ${fullUrl}`);
        if (options.json) console.log(JSON.stringify(result, null, 2));
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── click <selector> ──────────────────────────────────────────────────
  browse
    .command('click <selector>')
    .description('Click an element by CSS selector')
    .option('--json', 'Output as JSON')
    .action(async (selector: string, options: { json?: boolean }) => {
      const spinner = ora(`Clicking ${selector}...`).start();
      try {
        const expression = `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) throw new Error('Element not found: ${selector.replace(/'/g, "\\'")}');
          el.scrollIntoView({ block: 'center' });
          el.click();
          return { clicked: true, tag: el.tagName, text: el.textContent?.slice(0, 80) };
        })()`;
        const result = await cdp('Runtime.evaluate', {
          expression,
          returnByValue: true,
          awaitPromise: true,
        });
        spinner.succeed(`Clicked ${selector}`);
        if (options.json) console.log(JSON.stringify(result, null, 2));
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── fill <selector> <text> ────────────────────────────────────────────
  browse
    .command('fill <selector> <text>')
    .description('Focus an element and type text into it')
    .option('--clear', 'Clear existing content before typing')
    .option('--submit', 'Press Enter after typing')
    .option('--json', 'Output as JSON')
    .action(async (selector: string, text: string, options: { clear?: boolean; submit?: boolean; json?: boolean }) => {
      const spinner = ora(`Filling ${selector}...`).start();
      try {
        const expression = `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) throw new Error('Element not found: ${selector.replace(/'/g, "\\'")}');
          el.focus();
          ${options.clear ? 'el.value = "";' : ''}
          el.value = ${JSON.stringify(text)};
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          ${options.submit ? `el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));` : ''}
          return { filled: true, selector: ${JSON.stringify(selector)}, length: ${JSON.stringify(text)}.length };
        })()`;
        const result = await cdp('Runtime.evaluate', {
          expression,
          returnByValue: true,
          awaitPromise: true,
        });
        spinner.succeed(`Filled ${selector} with ${text.length} chars`);
        if (options.json) console.log(JSON.stringify(result, null, 2));
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── snapshot ───────────────────────────────────────────────────────────
  browse
    .command('snapshot')
    .description('Capture page as MHTML snapshot')
    .option('-o, --output <path>', 'Save to file')
    .option('--json', 'Output as JSON')
    .action(async (options: { output?: string; json?: boolean }) => {
      const spinner = ora('Capturing snapshot...').start();
      try {
        const result = await cdp('Page.captureSnapshot') as { data?: string };
        spinner.succeed('Snapshot captured');

        if (options.output && result?.data) {
          writeFileSync(options.output, result.data);
          console.log(`Saved to ${options.output}`);
        } else if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          const size = result?.data ? `${(result.data.length / 1024).toFixed(1)}KB` : 'empty';
          console.log(`MHTML snapshot: ${size}`);
        }
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── screenshot ─────────────────────────────────────────────────────────
  browse
    .command('screenshot')
    .description('Capture page screenshot (PNG)')
    .option('-o, --output <path>', 'Save to file (default: screenshot-<timestamp>.png)')
    .option('--full', 'Capture full page (not just viewport)')
    .option('--json', 'Output base64 as JSON')
    .action(async (options: { output?: string; full?: boolean; json?: boolean }) => {
      const spinner = ora('Capturing screenshot...').start();
      try {
        const params: Record<string, unknown> = { format: 'png' };
        if (options.full) {
          params.captureBeyondViewport = true;
        }

        const result = await cdp('Page.captureScreenshot', params) as { data?: string };
        spinner.succeed('Screenshot captured');

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else if (result?.data) {
          const outPath = options.output || `screenshot-${Date.now()}.png`;
          writeFileSync(outPath, Buffer.from(result.data, 'base64'));
          console.log(`Saved to ${outPath}`);
        }
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── eval <expression> ──────────────────────────────────────────────────
  browse
    .command('eval <expression>')
    .description('Execute JavaScript in the page context')
    .option('--json', 'Output as JSON')
    .action(async (expression: string, options: { json?: boolean }) => {
      const spinner = ora('Evaluating...').start();
      try {
        const result = await cdp('Runtime.evaluate', {
          expression,
          returnByValue: true,
          awaitPromise: true,
        });
        spinner.succeed('Evaluated');
        console.log(JSON.stringify(result, null, 2));
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── cookies [--domain <domain>] ────────────────────────────────────────
  browse
    .command('cookies')
    .description('Get cookies for the current page or a specific domain')
    .option('-d, --domain <domain>', 'Filter by domain')
    .option('--json', 'Output as JSON')
    .action(async (options: { domain?: string; json?: boolean }) => {
      const spinner = ora('Fetching cookies...').start();
      try {
        const params: Record<string, unknown> = {};
        if (options.domain) {
          const url = options.domain.startsWith('http') ? options.domain : `https://${options.domain}`;
          params.urls = [url];
        }

        const result = await cdp('Network.getCookies', params) as { cookies?: Array<{ name: string; value: string; domain: string; path: string; expires: number }> };
        const cookies = result?.cookies || [];
        spinner.succeed(`${cookies.length} cookies found`);

        if (options.json) {
          console.log(JSON.stringify(cookies, null, 2));
        } else {
          for (const c of cookies) {
            const exp = c.expires > 0 ? new Date(c.expires * 1000).toISOString() : 'session';
            console.log(`  ${c.name.padEnd(40)} ${c.domain.padEnd(24)} ${exp}`);
          }
        }
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── tabs ────────────────────────────────────────────────────────────────
  browse
    .command('tabs')
    .description('List open browser tabs')
    .option('--json', 'Output as JSON')
    .action(async (options: { json?: boolean }) => {
      const spinner = ora('Listing tabs...').start();
      try {
        // Use Runtime.evaluate to get tab info via chrome.tabs API isn't available via CDP.
        // Instead, get the list of targets from the daemon.
        const result = await cdp('Target.getTargets') as { targetInfos?: Array<{ targetId: string; type: string; title: string; url: string }> };
        const tabs = (result?.targetInfos || []).filter(t => t.type === 'page');
        spinner.succeed(`${tabs.length} tabs`);

        if (options.json) {
          console.log(JSON.stringify(tabs, null, 2));
        } else {
          for (const [i, tab] of tabs.entries()) {
            const title = tab.title?.slice(0, 50) || '(untitled)';
            const url = tab.url?.slice(0, 60) || '';
            console.log(`  ${String(i + 1).padStart(2)}. ${title.padEnd(52)} ${url}`);
          }
        }
      } catch (err) {
        spinner.fail(`Failed: ${(err as Error).message}`);
        process.exit(3);
      }
    });

  // ── lease ──────────────────────────────────────────────────────────────
  browse
    .command('lease')
    .description('Manually request or check the browse lease')
    .option('--revoke', 'Revoke the current lease')
    .option('--json', 'Output as JSON')
    .action(async (options: { revoke?: boolean; json?: boolean }) => {
      if (options.revoke) {
        const spinner = ora('Revoking lease...').start();
        try {
          const res = await fetch(`${API_BASE}/api/v1/lease`, { method: 'DELETE' });
          if (!res.ok) throw new Error(`Revoke failed: ${res.status}`);
          cachedLeaseToken = null;
          spinner.succeed('Lease revoked');
        } catch (err) {
          spinner.fail(`Failed: ${(err as Error).message}`);
          process.exit(3);
        }
      } else {
        try {
          await ensureLease();
          console.log('Lease is active');
        } catch (err) {
          console.error(`No active lease: ${(err as Error).message}`);
          process.exit(1);
        }
      }
    });
}
