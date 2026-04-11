/**
 * Projects Stats Route
 *
 * Exposes workspace scanner output as aggregated stats for
 * content dashboards and other consumers.
 *
 * Reads .lev/detected-projects.yaml (written by `lev init`) and returns
 * aggregated counts. Falls back to 404 if the file doesn't exist.
 */

import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

interface DashboardEntryMetadata {
  lane?: string;
  runtime?: string;
  framework?: string;
  packageManager?: string;
  lifecycle?: 'detected' | 'ready';
}

interface ScannedEntry {
  id: string;
  name: string;
  cwd: string;
  metadata?: DashboardEntryMetadata;
}

function resolveDetectedProjectsPath(): string {
  // Walk up from this module to find the repo root (.lev/)
  // dashboard-manager-server lives at:
  //   community/agentping/packages/dashboard-manager-server/dist/routes/projects.js
  // Repo root is 5 levels up from there.
  const start = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '..', '..', '..', '..', '..', '..',
  );
  return path.join(start, '.lev', 'detected-projects.yaml');
}

function parseDetectedProjectsYaml(content: string): ScannedEntry[] {
  // Minimal YAML parser for the dashboard entry shape we control.
  // Doesn't handle arbitrary YAML — just the structure lev init writes.
  const entries: ScannedEntry[] = [];
  const lines = content.split('\n');
  let current: Partial<ScannedEntry> & { metadata?: DashboardEntryMetadata } | null = null;
  let inMetadata = false;

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (line.startsWith('#') || line.trim() === '') continue;

    if (line.startsWith('  - name:')) {
      if (current && current.id) entries.push(current as ScannedEntry);
      current = { name: line.slice('  - name:'.length).trim() };
      inMetadata = false;
      continue;
    }
    if (!current) continue;

    if (line.startsWith('    id:')) current.id = line.slice('    id:'.length).trim();
    else if (line.startsWith('    cwd:')) current.cwd = line.slice('    cwd:'.length).trim();
    else if (line.startsWith('    metadata:')) {
      inMetadata = true;
      current.metadata = {};
    } else if (inMetadata && line.startsWith('      ')) {
      const meta = current.metadata!;
      const trimmed = line.trim();
      const colon = trimmed.indexOf(':');
      if (colon === -1) continue;
      const key = trimmed.slice(0, colon).trim();
      const value = trimmed.slice(colon + 1).trim();
      if (key === 'lane') meta.lane = value;
      else if (key === 'runtime') meta.runtime = value;
      else if (key === 'framework') meta.framework = value;
      else if (key === 'packageManager') meta.packageManager = value;
      else if (key === 'lifecycle') meta.lifecycle = value as 'detected' | 'ready';
    } else if (!line.startsWith('      ')) {
      inMetadata = false;
    }
  }
  if (current && current.id) entries.push(current as ScannedEntry);
  return entries;
}

function aggregate(entries: ScannedEntry[]) {
  const runtimes: Record<string, number> = {};
  const frameworks: Record<string, number> = {};
  const packageManagers: Record<string, number> = {};
  const lanes: Record<string, number> = {};
  const lifecycle = { detected: 0, ready: 0, unknown: 0 };
  let internal = 0;
  let external = 0;
  let self = 0;

  const home = os.homedir();
  const repoPrefix = path.join(home, 'digital', 'leviathan');

  for (const entry of entries) {
    const meta = entry.metadata || {};
    if (meta.runtime) runtimes[meta.runtime] = (runtimes[meta.runtime] || 0) + 1;
    if (meta.framework) frameworks[meta.framework] = (frameworks[meta.framework] || 0) + 1;
    if (meta.packageManager) packageManagers[meta.packageManager] = (packageManagers[meta.packageManager] || 0) + 1;
    if (meta.lane) lanes[meta.lane] = (lanes[meta.lane] || 0) + 1;

    if (meta.lifecycle === 'detected') lifecycle.detected++;
    else if (meta.lifecycle === 'ready') lifecycle.ready++;
    else lifecycle.unknown++;

    // Classify internal/external/self by the cwd path
    const resolvedCwd = (entry.cwd || '').replace(/^~/, home);
    if (resolvedCwd === repoPrefix) self++;
    else if (resolvedCwd.startsWith(repoPrefix)) internal++;
    else external++;
  }

  return {
    total_projects: entries.length,
    runtimes,
    frameworks,
    packageManagers,
    lanes,
    lifecycle,
    internal,
    external,
    self,
  };
}

export function createProjectsRoutes() {
  const app = new Hono();

  app.get('/stats', async (c) => {
    try {
      const filePath = resolveDetectedProjectsPath();
      if (!existsSync(filePath)) {
        return c.json({
          error: 'detected-projects.yaml not found',
          hint: 'Run `lev init` to generate it',
          expected_path: filePath,
        }, 404);
      }

      const content = await readFile(filePath, 'utf-8');
      const entries = parseDetectedProjectsYaml(content);
      const stats = aggregate(entries);
      const { mtime } = statSync(filePath);

      return c.json({
        ...stats,
        last_scan: mtime.toISOString(),
        source: filePath,
      });
    } catch (error) {
      console.error('[projects/stats] error:', error);
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  app.get('/raw', async (c) => {
    try {
      const filePath = resolveDetectedProjectsPath();
      if (!existsSync(filePath)) {
        return c.json({ error: 'detected-projects.yaml not found', expected_path: filePath }, 404);
      }
      const content = await readFile(filePath, 'utf-8');
      const entries = parseDetectedProjectsYaml(content);
      return c.json({ count: entries.length, entries });
    } catch (error) {
      return c.json({ error: (error as Error).message }, 500);
    }
  });

  return app;
}
