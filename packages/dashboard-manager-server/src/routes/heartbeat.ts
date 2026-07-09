/** Heartbeat routes — read-only Leviathan pulse API. */

import { execFile } from 'node:child_process';
import { open, readdir, readFile, stat as statFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { Hono } from 'hono';
import { parse as parseYaml } from 'yaml';

export type HeartbeatExec = (
  file: string,
  args: string[],
  opts: { cwd: string; timeoutMs: number },
) => Promise<string>;

export interface HeartbeatRoutesConfig {
  readonly levRoot?: string;
  readonly exec?: HeartbeatExec;
  readonly now?: () => Date;
  readonly timelineByteWindow?: number;
}

export interface BeadItem {
  status: string;
  id: string;
  priority: string;
  title: string;
}

interface ResearchAdapter {
  name: string;
  available: boolean;
  capabilities?: string[];
  degradedReason?: string;
}

const researchCache = new Map<string, { adapters: ResearchAdapter[]; cachedAtMs: number }>();
const RESEARCH_CACHE_TTL_MS = 60_000;

export function __resetHeartbeatCache(): void {
  researchCache.clear();
}

const defaultExec: HeartbeatExec = (file, args, opts) =>
  new Promise((resolvePromise, reject) => {
    execFile(
      file,
      args,
      { cwd: opts.cwd, timeout: opts.timeoutMs, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout) => {
        if (error) reject(error);
        else resolvePromise(stdout);
      },
    );
  });

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function str(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function errMsg(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function isLevRoot(root: string): Promise<boolean> {
  try {
    await Promise.all([readdir(join(root, '.lev', 'pm')), readdir(join(root, 'plugins'))]);
    return true;
  } catch {
    return false;
  }
}

async function resolveLevRoot(explicit?: string): Promise<string | null> {
  if (explicit !== undefined) {
    const root = resolve(explicit);
    return (await isLevRoot(root)) ? root : null;
  }
  if (process.env.LEV_ROOT) {
    const root = resolve(process.env.LEV_ROOT);
    return (await isLevRoot(root)) ? root : null;
  }
  let current = resolve(process.cwd());
  while (true) {
    if (await isLevRoot(current)) return current;
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

async function readJson(path: string): Promise<unknown | null> {
  try { return JSON.parse(await readFile(path, 'utf8')) as unknown; } catch { return null; }
}

async function readText(path: string): Promise<string | null> {
  try { return await readFile(path, 'utf8'); } catch { return null; }
}

async function listNames(dir: string): Promise<string[]> {
  try { return await readdir(dir); } catch { return []; }
}

const DEFAULT_TIMELINE_BYTE_WINDOW = 512 * 1024;

async function readJsonlTail(path: string, byteWindow: number): Promise<string | null> {
  try {
    const { size } = await statFile(path);
    if (size <= byteWindow) {
      return await readFile(path, 'utf8');
    }
    const offset = size - byteWindow;
    const handle = await open(path, 'r');
    try {
      const buf = Buffer.allocUnsafe(byteWindow);
      const { bytesRead } = await handle.read(buf, 0, byteWindow, offset);
      const text = buf.subarray(0, bytesRead).toString('utf8');
      const newlineIdx = text.indexOf('\n');
      return newlineIdx >= 0 ? text.slice(newlineIdx + 1) : '';
    } finally {
      await handle.close();
    }
  } catch {
    return null;
  }
}

function parseJsonl(text: string): unknown[] {
  const out: unknown[] = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try {
      out.push(JSON.parse(t));
    } catch {
      /* skip malformed */
    }
  }
  return out;
}

function takeLast<T>(items: T[], n: number): T[] {
  return items.length <= n ? items : items.slice(-n);
}

function asBeadItems(value: unknown): BeadItem[] {
  if (!Array.isArray(value)) return [];
  const items: BeadItem[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    const id = str(entry.id);
    const title = str(entry.title);
    const status = str(entry.status);
    const priority = str(entry.priority);
    if (id && title && status && priority) items.push({ id, title, status, priority });
  }
  return items;
}

async function readLiveGit(levRoot: string, exec: HeartbeatExec) {
  try {
    const [statusOut, logOut] = await Promise.all([
      exec('git', ['status', '--short'], { cwd: levRoot, timeoutMs: 10_000 }),
      exec('git', ['log', '--oneline', '-8'], { cwd: levRoot, timeoutMs: 10_000 }),
    ]);
    const changedFiles = statusOut.split('\n').map((l) => l.trim()).filter(Boolean).length;
    const recentCommits = logOut
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const i = line.indexOf(' ');
        return i <= 0
          ? { hash: line, message: '' }
          : { hash: line.slice(0, i), message: line.slice(i + 1) };
      });
    return { ok: true as const, changedFiles, recentCommits };
  } catch (error) {
    return { ok: false as const, error: errMsg(error) };
  }
}

async function readHandoffs(levRoot: string): Promise<string[]> {
  return (await listNames(join(levRoot, '.lev', 'pm', 'handoffs')))
    .filter((n) => n.endsWith('.md') && !n.startsWith('_'))
    .sort()
    .reverse()
    .slice(0, 5);
}

async function readJournal(levRoot: string): Promise<string[]> {
  return (await listNames(join(levRoot, '.lev', 'pm', 'journal')))
    .filter((n) => n.endsWith('.md'))
    .sort()
    .reverse()
    .slice(0, 5);
}

async function readCdoRounds(levRoot: string): Promise<string[]> {
  return (await listNames(join(levRoot, 'docs', '_inbox')))
    .filter((n) => n.startsWith('cdo-r'))
    .sort();
}

async function readBriefs(levRoot: string): Promise<Array<{ id: string; title: string }>> {
  const tasksDir = join(levRoot, '.lev', 'pm', 'tasks');
  const briefs: Array<{ id: string; title: string }> = [];
  for (const dir of await listNames(tasksDir)) {
    const text = await readText(join(tasksDir, dir, 'dna.yaml'));
    if (text === null) continue;
    try {
      const parsed = parseYaml(text) as unknown;
      let title = dir;
      if (isRecord(parsed)) {
        const c = parsed.title ?? parsed.name ?? parsed.goal;
        if (typeof c === 'string' && c.length > 0) title = c;
      }
      briefs.push({ id: dir, title });
    } catch {
      /* skip unparseable */
    }
  }
  return briefs;
}

async function readPluginInventory(levRoot: string) {
  const pluginsDir = join(levRoot, 'plugins');
  const plugins: Array<{ name: string; version: string | null; dir: string }> = [];
  for (const dir of await listNames(pluginsDir)) {
    const raw = await readJson(join(pluginsDir, dir, 'package.json'));
    if (!isRecord(raw)) continue;
    plugins.push({
      name: typeof raw.name === 'string' ? raw.name : dir,
      version: typeof raw.version === 'string' ? raw.version : null,
      dir,
    });
  }
  return plugins;
}

async function readResearchAdapters(levRoot: string, exec: HeartbeatExec, nowMs: number) {
  const cached = researchCache.get(levRoot);
  if (cached && nowMs - cached.cachedAtMs < RESEARCH_CACHE_TTL_MS) {
    return { adapters: cached.adapters };
  }

  const cliPath = join(levRoot, 'plugins', 'timetravel', 'src', 'cli.ts');
  try {
    const stdout = await exec('bun', [cliPath, 'status', '-f', 'json'], {
      cwd: levRoot,
      timeoutMs: 20_000,
    });
    const parsed = JSON.parse(stdout.trim()) as unknown;
    if (!Array.isArray(parsed)) return { error: 'research status did not return a JSON array' };

    const adapters: ResearchAdapter[] = [];
    for (const entry of parsed) {
      if (!isRecord(entry)) continue;
      const name = str(entry.name);
      if (!name || typeof entry.available !== 'boolean') continue;
      const adapter: ResearchAdapter = { name, available: entry.available };
      if (Array.isArray(entry.capabilities)) {
        adapter.capabilities = entry.capabilities.filter((c): c is string => typeof c === 'string');
      }
      if (typeof entry.degradedReason === 'string') adapter.degradedReason = entry.degradedReason;
      adapters.push(adapter);
    }
    researchCache.set(levRoot, { adapters, cachedAtMs: nowMs });
    return { adapters };
  } catch (error) {
    return { error: errMsg(error) };
  }
}

export async function warmHeartbeatResearchCache(config: HeartbeatRoutesConfig = {}): Promise<void> {
  const levRoot = await resolveLevRoot(config.levRoot);
  if (!levRoot) return;

  const exec = config.exec ?? defaultExec;
  const nowMs = (config.now?.() ?? new Date()).getTime();
  await readResearchAdapters(levRoot, exec, nowMs);
}

export function createHeartbeatRoutes(config: HeartbeatRoutesConfig = {}) {
  const app = new Hono();
  const exec = config.exec ?? defaultExec;
  const now = () => config.now?.() ?? new Date();

  app.get('/', async (c) => {
    const levRoot = await resolveLevRoot(config.levRoot);
    if (!levRoot) return c.json({ error: 'leviathan root not found' }, 503);

    const generatedAt = now().toISOString();
    const state = await readJson(join(levRoot, 'plugins', 'dashboard', 'data', 'state.json'));
    const stateRecord = isRecord(state) ? state : null;
    const beads = stateRecord && isRecord(stateRecord.beads) ? stateRecord.beads : null;
    const stateGit = stateRecord && isRecord(stateRecord.git) ? stateRecord.git : null;

    const liveGit = await readLiveGit(levRoot, exec);
    const [handoffs, journal, cdoRounds, briefs] = await Promise.all([
      readHandoffs(levRoot),
      readJournal(levRoot),
      readCdoRounds(levRoot),
      readBriefs(levRoot),
    ]);

    const fallbackChanged =
      stateGit && typeof stateGit.changedFiles === 'number' ? stateGit.changedFiles : 0;

    return c.json({
      generatedAt,
      snapshot: {
        tick: stateRecord && typeof stateRecord.tick === 'number' ? stateRecord.tick : null,
        timestamp:
          stateRecord && typeof stateRecord.timestamp === 'string' ? stateRecord.timestamp : null,
      },
      pulse: {
        ready: num(beads?.ready),
        inProgress: num(beads?.inProgress),
        closed: num(beads?.closed),
        open: num(beads?.open),
        total: num(beads?.total),
        blocked: num(beads?.blocked),
        gitChanges: liveGit.ok ? liveGit.changedFiles : fallbackChanged,
      },
      workQueue: {
        readyItems: asBeadItems(beads?.readyItems),
        inProgressItems: asBeadItems(beads?.inProgressItems),
      },
      git: liveGit.ok
        ? { changedFiles: liveGit.changedFiles, recentCommits: liveGit.recentCommits }
        : { error: liveGit.error },
      handoffs,
      journal,
      cdoRounds,
      briefs,
    });
  });

  app.get('/timeline', async (c) => {
    const levRoot = await resolveLevRoot(config.levRoot);
    if (!levRoot) return c.json({ error: 'leviathan root not found' }, 503);

    const byteWindow = config.timelineByteWindow ?? DEFAULT_TIMELINE_BYTE_WINDOW;
    const dataDir = join(levRoot, 'plugins', 'dashboard', 'data');
    const [timelineText, evolutionText] = await Promise.all([
      readJsonlTail(join(dataDir, 'timeline.jsonl'), byteWindow),
      readJsonlTail(join(dataDir, 'evolution-log.jsonl'), byteWindow),
    ]);

    return c.json({
      generatedAt: now().toISOString(),
      ticks: takeLast(timelineText ? parseJsonl(timelineText) : [], 200),
      evolution: takeLast(evolutionText ? parseJsonl(evolutionText) : [], 100),
    });
  });

  app.get('/plugins', async (c) => {
    const levRoot = await resolveLevRoot(config.levRoot);
    if (!levRoot) return c.json({ error: 'leviathan root not found' }, 503);

    const nowMs = now().getTime();
    const [researchResult, plugins] = await Promise.all([
      readResearchAdapters(levRoot, exec, nowMs),
      readPluginInventory(levRoot),
    ]);

    const adapters =
      'adapters' in researchResult ? researchResult.adapters : undefined;
    const research = adapters
      ? {
          adapters,
          counts: {
            available: adapters.filter((a) => a.available).length,
            total: adapters.length,
          },
        }
      : { error: 'error' in researchResult ? researchResult.error : 'unknown research error' };

    return c.json({ generatedAt: now().toISOString(), research, plugins });
  });

  return app;
}
