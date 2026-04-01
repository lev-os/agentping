#!/usr/bin/env npx tsx
/**
 * benchmark-webmcp.ts — Compare generated .webmcp.yaml against a reference
 *
 * Checks:
 * 1. Tool coverage: does the generated file have the same tools as reference?
 * 2. Selector quality: does generated use data-testid/aria-label (stable) vs classes (fragile)?
 * 3. Action completeness: do generated tools have all necessary actions?
 * 4. Parameter alignment: do parameter schemas match?
 *
 * Usage:
 *   npx tsx tools/benchmark-webmcp.ts webmcp/chatgpt.webmcp.yaml generated/chatgpt.webmcp.yaml
 *   npx tsx tools/benchmark-webmcp.ts --reference webmcp/chatgpt.webmcp.yaml --generated /tmp/crawled.yaml
 */

import { readFileSync } from 'fs';
import { parse } from 'yaml';

interface WebMCPTool {
  name: string;
  description?: string;
  parameters?: Record<string, any> | any[];
  actions?: Array<{ type: string; selector?: string; value?: string; script?: string }>;
  result?: { type: string; selector?: string; extract?: string; timeout?: number };
}

interface WebMCPDef {
  name: string;
  version?: string;
  match?: string[];
  tools: WebMCPTool[];
}

interface BenchmarkResult {
  toolCoverage: { matched: string[]; missingInGenerated: string[]; extraInGenerated: string[]; score: number };
  selectorQuality: { stable: number; fragile: number; score: number; details: Array<{ tool: string; selector: string; quality: 'stable' | 'fragile' }> };
  actionCompleteness: { matched: number; missing: number; extra: number; score: number };
  parameterAlignment: { matched: number; mismatched: number; score: number; details: Array<{ tool: string; issue: string }> };
  overall: number;
}

// ============================================================================
// Selector Quality
// ============================================================================

function selectorQuality(selector: string): 'stable' | 'fragile' {
  // Stable: data-testid, aria-label, role, #id, tag[attr]
  if (/\[data-testid/.test(selector)) return 'stable';
  if (/\[aria-label/.test(selector)) return 'stable';
  if (/\[role=/.test(selector)) return 'stable';
  if (/^#[\w-]+$/.test(selector)) return 'stable';
  if (/^(nav|main|header|footer|article|section)\b/.test(selector)) return 'stable';
  // Fragile: class-only selectors, deeply nested
  return 'fragile';
}

// ============================================================================
// Benchmark
// ============================================================================

function benchmark(reference: WebMCPDef, generated: WebMCPDef): BenchmarkResult {
  const refTools = new Map(reference.tools.map((t) => [t.name, t]));
  const genTools = new Map(generated.tools.map((t) => [t.name, t]));

  // 1. Tool coverage
  const matched = [...refTools.keys()].filter((n) => genTools.has(n));
  const missingInGenerated = [...refTools.keys()].filter((n) => !genTools.has(n));
  const extraInGenerated = [...genTools.keys()].filter((n) => !refTools.has(n));
  const coverageScore = refTools.size > 0 ? matched.length / refTools.size : 0;

  // 2. Selector quality (on generated file)
  const selectorDetails: BenchmarkResult['selectorQuality']['details'] = [];
  let stableCount = 0;
  let fragileCount = 0;
  for (const [name, tool] of genTools) {
    for (const action of tool.actions || []) {
      if (action.selector) {
        const q = selectorQuality(action.selector);
        selectorDetails.push({ tool: name, selector: action.selector, quality: q });
        if (q === 'stable') stableCount++;
        else fragileCount++;
      }
    }
    if (tool.result?.selector) {
      const q = selectorQuality(tool.result.selector);
      selectorDetails.push({ tool: name, selector: tool.result.selector, quality: q });
      if (q === 'stable') stableCount++;
      else fragileCount++;
    }
  }
  const totalSelectors = stableCount + fragileCount;
  const selectorScore = totalSelectors > 0 ? stableCount / totalSelectors : 0;

  // 3. Action completeness (for matched tools)
  let actionsMatched = 0;
  let actionsMissing = 0;
  let actionsExtra = 0;
  for (const name of matched) {
    const refActions = refTools.get(name)!.actions || [];
    const genActions = genTools.get(name)!.actions || [];
    const refTypes = refActions.map((a) => a.type);
    const genTypes = genActions.map((a) => a.type);

    for (const t of refTypes) {
      if (genTypes.includes(t)) actionsMatched++;
      else actionsMissing++;
    }
    for (const t of genTypes) {
      if (!refTypes.includes(t)) actionsExtra++;
    }
  }
  const totalRefActions = actionsMatched + actionsMissing;
  const actionScore = totalRefActions > 0 ? actionsMatched / totalRefActions : 0;

  // 4. Parameter alignment
  const paramDetails: BenchmarkResult['parameterAlignment']['details'] = [];
  let paramsMatched = 0;
  let paramsMismatched = 0;
  for (const name of matched) {
    const refParams = refTools.get(name)!.parameters || {};
    const genParams = genTools.get(name)!.parameters || {};

    const refKeys = Object.keys(refParams);
    const genKeys = Array.isArray(genParams)
      ? genParams.map((p: any) => p.name)
      : Object.keys(genParams);

    for (const key of refKeys) {
      if (genKeys.includes(key)) {
        paramsMatched++;
      } else {
        paramsMismatched++;
        paramDetails.push({ tool: name, issue: `Missing param: ${key}` });
      }
    }
    for (const key of genKeys) {
      if (!refKeys.includes(key)) {
        paramDetails.push({ tool: name, issue: `Extra param: ${key}` });
      }
    }
  }
  const totalRefParams = paramsMatched + paramsMismatched;
  const paramScore = totalRefParams > 0 ? paramsMatched / totalRefParams : 1;

  // Overall: weighted average
  const overall = coverageScore * 0.4 + selectorScore * 0.25 + actionScore * 0.2 + paramScore * 0.15;

  return {
    toolCoverage: { matched, missingInGenerated, extraInGenerated, score: coverageScore },
    selectorQuality: { stable: stableCount, fragile: fragileCount, score: selectorScore, details: selectorDetails },
    actionCompleteness: { matched: actionsMatched, missing: actionsMissing, extra: actionsExtra, score: actionScore },
    parameterAlignment: { matched: paramsMatched, mismatched: paramsMismatched, score: paramScore, details: paramDetails },
    overall,
  };
}

// ============================================================================
// CLI
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  let refPath = '';
  let genPath = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--reference' || args[i] === '-r') { refPath = args[++i]; continue; }
    if (args[i] === '--generated' || args[i] === '-g') { genPath = args[++i]; continue; }
    if (!refPath) { refPath = args[i]; continue; }
    if (!genPath) { genPath = args[i]; continue; }
  }

  if (!refPath || !genPath) {
    console.error('Usage: benchmark-webmcp.ts <reference.yaml> <generated.yaml>');
    process.exit(1);
  }

  const reference: WebMCPDef = parse(readFileSync(refPath, 'utf-8'));
  const generated: WebMCPDef = parse(readFileSync(genPath, 'utf-8'));

  console.log(`\n--- WebMCP Benchmark ---`);
  console.log(`Reference: ${refPath} (${reference.tools.length} tools)`);
  console.log(`Generated: ${genPath} (${generated.tools.length} tools)\n`);

  const result = benchmark(reference, generated);

  // Tool Coverage
  console.log(`1. Tool Coverage: ${(result.toolCoverage.score * 100).toFixed(0)}%`);
  if (result.toolCoverage.matched.length) console.log(`   Matched: ${result.toolCoverage.matched.join(', ')}`);
  if (result.toolCoverage.missingInGenerated.length) console.log(`   Missing: ${result.toolCoverage.missingInGenerated.join(', ')}`);
  if (result.toolCoverage.extraInGenerated.length) console.log(`   Extra:   ${result.toolCoverage.extraInGenerated.join(', ')}`);

  // Selector Quality
  console.log(`\n2. Selector Quality: ${(result.selectorQuality.score * 100).toFixed(0)}%`);
  console.log(`   Stable: ${result.selectorQuality.stable}, Fragile: ${result.selectorQuality.fragile}`);
  for (const d of result.selectorQuality.details.filter((x) => x.quality === 'fragile')) {
    console.log(`   ! ${d.tool}: ${d.selector}`);
  }

  // Action Completeness
  console.log(`\n3. Action Completeness: ${(result.actionCompleteness.score * 100).toFixed(0)}%`);
  console.log(`   Matched: ${result.actionCompleteness.matched}, Missing: ${result.actionCompleteness.missing}, Extra: ${result.actionCompleteness.extra}`);

  // Parameter Alignment
  console.log(`\n4. Parameter Alignment: ${(result.parameterAlignment.score * 100).toFixed(0)}%`);
  for (const d of result.parameterAlignment.details) {
    console.log(`   ! ${d.tool}: ${d.issue}`);
  }

  // Overall
  console.log(`\n--- Overall Score: ${(result.overall * 100).toFixed(0)}% ---\n`);

  // Exit with non-zero if below threshold
  if (result.overall < 0.5) process.exit(1);
}

main();
