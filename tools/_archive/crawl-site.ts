#!/usr/bin/env npx tsx
/**
 * crawl-site.ts — WebMCP tool definition generator
 *
 * Uses agent-browser + CDP proxy to capture an interactive accessibility tree,
 * feeds it to Claude, and generates a validated .webmcp.yaml file.
 *
 * Usage:
 *   npx tsx tools/crawl-site.ts https://chatgpt.com
 *   npx tsx tools/crawl-site.ts https://chatgpt.com -o webmcp/chatgpt.webmcp.yaml
 *   npx tsx tools/crawl-site.ts https://chatgpt.com --validate --cdp-port 7891
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import Anthropic from '@anthropic-ai/sdk';

// ============================================================================
// Config
// ============================================================================

const CDP_PORT = parseInt(process.env.CDP_PORT || '7891', 10);
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const PROMPT_PATH = join(dirname(new URL(import.meta.url).pathname), 'prompts/generate-webmcp.txt');

// ============================================================================
// CLI Arg Parsing
// ============================================================================

interface CLIArgs {
  url: string;
  output?: string;
  validate: boolean;
  cdpPort: number;
  dryRun: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const flags: CLIArgs = { url: '', validate: false, cdpPort: CDP_PORT, dryRun: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-o' || arg === '--output') { flags.output = args[++i]; continue; }
    if (arg === '--validate') { flags.validate = true; continue; }
    if (arg === '--cdp-port') { flags.cdpPort = parseInt(args[++i], 10); continue; }
    if (arg === '--dry-run') { flags.dryRun = true; continue; }
    if (!arg.startsWith('-')) { flags.url = arg; continue; }
  }

  if (!flags.url) {
    console.error('Usage: npx tsx tools/crawl-site.ts <url> [-o output.yaml] [--validate] [--cdp-port 7891]');
    process.exit(1);
  }

  if (!flags.url.startsWith('http')) {
    flags.url = `https://${flags.url}`;
  }

  return flags;
}

// ============================================================================
// Agent Browser Commands
// ============================================================================

function ab(command: string, cdpPort: number): string {
  try {
    const result = execSync(`agent-browser --cdp ${cdpPort} ${command}`, {
      encoding: 'utf-8',
      timeout: 30_000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch (err: any) {
    const stderr = err.stderr?.toString() || '';
    const stdout = err.stdout?.toString() || '';
    throw new Error(`agent-browser ${command} failed: ${stderr || stdout || err.message}`);
  }
}

// ============================================================================
// Claude API
// ============================================================================

async function generateWebMCP(url: string, snapshot: string): Promise<string> {
  const promptTemplate = existsSync(PROMPT_PATH)
    ? readFileSync(PROMPT_PATH, 'utf-8')
    : getFallbackPrompt();

  const prompt = promptTemplate
    .replace('{{url}}', url)
    .replace('{{snapshot}}', snapshot);

  const client = new Anthropic();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  // Extract YAML from response
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  // Find YAML block in response
  const yamlMatch = text.match(/```ya?ml\n([\s\S]*?)```/);
  if (yamlMatch) return yamlMatch[1].trim();

  // If no code block, try to find YAML-like content starting with "name:"
  const yamlStart = text.indexOf('name:');
  if (yamlStart !== -1) return text.slice(yamlStart).trim();

  return text;
}

function getFallbackPrompt(): string {
  return `Given this interactive accessibility tree from {{url}}:

{{snapshot}}

Generate a .webmcp.yaml tool definition with the most useful user-facing actions.
Use stable selectors (data-testid, aria-label, role, id) over fragile class names.
Output ONLY the YAML, no explanation.`;
}

// ============================================================================
// Validator
// ============================================================================

interface ValidationResult {
  tool: string;
  passed: boolean;
  error?: string;
}

async function validateTools(yaml: string, cdpPort: number): Promise<ValidationResult[]> {
  // Quick parse to extract tool names and their first action selectors
  const results: ValidationResult[] = [];
  const toolBlocks = yaml.split(/^  - name: /m).slice(1);

  for (const block of toolBlocks) {
    const nameMatch = block.match(/^(\S+)/);
    const name = nameMatch?.[1] || 'unknown';

    // Find selectors used in actions
    const selectors = [...block.matchAll(/selector:\s*["']?([^"'\n]+)/g)].map((m) => m[1].trim());

    if (selectors.length === 0) {
      results.push({ tool: name, passed: true }); // no selectors to validate
      continue;
    }

    // Validate first selector exists on page
    const selector = selectors[0];
    try {
      const exists = ab(
        `eval "!!document.querySelector(${JSON.stringify(selector).replace(/"/g, '\\"')})"`,
        cdpPort,
      );
      results.push({ tool: name, passed: exists.includes('true') || exists.includes('1'), error: exists.includes('false') ? `Selector not found: ${selector}` : undefined });
    } catch (err: any) {
      results.push({ tool: name, passed: false, error: err.message });
    }
  }

  return results;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = parseArgs();

  console.log(`\n--- WebMCP Crawler ---`);
  console.log(`Target: ${args.url}`);
  console.log(`CDP:    localhost:${args.cdpPort}\n`);

  // 1. Navigate to target
  console.log('1. Navigating...');
  ab(`open ${args.url}`, args.cdpPort);

  // Wait for page load
  await new Promise((r) => setTimeout(r, 3000));

  // 2. Capture interactive snapshot
  console.log('2. Capturing accessibility tree...');
  const snapshot = ab('snapshot -i', args.cdpPort);
  console.log(`   ${snapshot.split('\n').length} lines captured`);

  if (args.dryRun) {
    console.log('\n--- Snapshot (dry run) ---\n');
    console.log(snapshot);
    return;
  }

  // 3. Generate WebMCP via Claude
  console.log('3. Generating WebMCP definition via Claude...');
  const yaml = await generateWebMCP(args.url, snapshot);
  console.log(`   Generated ${yaml.split('\n').length} lines of YAML`);

  // 4. Validate (optional)
  if (args.validate) {
    console.log('4. Validating tool selectors...');
    const results = await validateTools(yaml, args.cdpPort);
    for (const r of results) {
      const icon = r.passed ? '  ✓' : '  ✗';
      console.log(`${icon} ${r.tool}${r.error ? ` — ${r.error}` : ''}`);
    }
    const passed = results.filter((r) => r.passed).length;
    console.log(`\n   ${passed}/${results.length} tools validated`);
  }

  // 5. Write output
  const outputPath = args.output || `webmcp/${new URL(args.url).hostname.replace(/\./g, '-')}.webmcp.yaml`;

  // Ensure output directory exists
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    const { mkdirSync } = await import('fs');
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, yaml);
  console.log(`\n✓ Written to ${outputPath}`);
}

main().catch((err) => {
  console.error(`\nFatal: ${err.message}`);
  process.exit(1);
});
