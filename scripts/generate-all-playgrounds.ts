#!/usr/bin/env npx tsx
/**
 * Generate All Playgrounds
 *
 * Produces React JSON and Pencil ops samples for every template.
 * HTML generation removed — React is the live surface, Pencil is the design surface.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

import {
  templates,
  renderToPencil,
  renderToReact,
  resetIds,
  THEMES,
} from '../packages/canvas/src/polymorph/index.js';

const OUT_DIR = join(homedir(), '.agentping', 'playgrounds');
mkdirSync(OUT_DIR, { recursive: true });

const themeNames = Object.keys(THEMES) as Array<keyof typeof THEMES>;
const templateNames = Object.keys(templates);

const generated: string[] = [];

console.log('=== AgentPing Playground Generator ===\n');

// ─────────────────────────────────────────────────────
// React JSON: One per template (skynet theme)
// ─────────────────────────────────────────────────────
console.log('--- React Catalog Entries ---');
for (const tpl of templateNames) {
  resetIds();
  const template = templates[tpl];
  const values = { topic: `${tpl.charAt(0).toUpperCase() + tpl.slice(1)} Explorer` };
  const primitives = template.previewRenderer(values);
  const entries = renderToReact(primitives);
  const filename = `playground-${tpl}-react.json`;
  const filepath = join(OUT_DIR, filename);
  writeFileSync(filepath, JSON.stringify(entries, null, 2), 'utf-8');
  generated.push(filepath);
  console.log(`  + ${filename}`);
}

// ─────────────────────────────────────────────────────
// Pencil Ops: One per template (skynet theme)
// ─────────────────────────────────────────────────────
console.log('\n--- Pencil (.pen) Operations ---');
for (const tpl of templateNames) {
  resetIds();
  const template = templates[tpl];
  const values = { topic: `${tpl.charAt(0).toUpperCase() + tpl.slice(1)} Explorer` };
  const primitives = template.previewRenderer(values);
  const ops = renderToPencil(primitives, '"document"', { theme: 'skynet' });
  const filename = `playground-${tpl}-pencil.ops`;
  const filepath = join(OUT_DIR, filename);
  writeFileSync(filepath, ops.join('\n'), 'utf-8');
  generated.push(filepath);
  console.log(`  + ${filename}`);
}

console.log(`\n=== Done: ${generated.length} files (React + Pencil) ===`);
console.log(`  ${OUT_DIR}`);
