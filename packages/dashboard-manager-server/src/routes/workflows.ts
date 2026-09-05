import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Hono } from 'hono';
import { parse as parseYaml } from 'yaml';
import { resolveLevRoot } from '../host-root.js';

export type WorkflowCategory = 'system' | 'plugin' | 'example' | 'project';

export interface WorkflowRoutesConfig {
  readonly levRoot?: string;
}

export interface WorkflowListItem {
  readonly id: string;
  readonly path: string;
  readonly category: WorkflowCategory;
  readonly name: string;
}

type RawRecord = Record<string, unknown>;

interface ScanRoot {
  readonly basePath: string;
  readonly category: WorkflowCategory;
}

const SCAN_ROOTS: readonly ScanRoot[] = [
  { basePath: 'core/flowmind/system', category: 'system' },
  { basePath: 'core/flowmind/examples', category: 'example' },
  { basePath: 'plugins', category: 'plugin' },
  { basePath: '.lev/flows', category: 'project' },
] as const;

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function humanize(value: string): string {
  return value
    .replace(/\.flow\.ya?ml$/i, '')
    .replace(/[_/]+/g, ' ')
    .replace(/-/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function slugForPath(path: string): string {
  const normalized = path
    .replace(/\.flow\.ya?ml$/i, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (normalized.startsWith('core-flowmind-system-')) {
    return `system-${normalized.replace(/^core-flowmind-system-/, '')}`;
  }
  if (normalized.startsWith('core-flowmind-examples-')) {
    return `example-${normalized.replace(/^core-flowmind-examples-/, '')}`;
  }
  if (normalized.startsWith('plugins-')) {
    return `plugin-${normalized.replace(/^plugins-/, '')}`;
  }
  if (normalized.startsWith('lev-flows-')) {
    return `project-${normalized.replace(/^lev-flows-/, '')}`;
  }
  return normalized;
}

function frontMatterFromYaml(raw: string): RawRecord | null {
  try {
    const parsed: unknown = parseYaml(raw);
    if (!isRecord(parsed)) return null;
    const frontMatter: RawRecord = {};
    const name = asString(parsed.name);
    const description = asString(parsed.description);
    if (name) frontMatter.name = name;
    if (description) frontMatter.description = description;
    if (isRecord(parsed.meta)) frontMatter.meta = parsed.meta;
    return Object.keys(frontMatter).length > 0 ? frontMatter : null;
  } catch {
    return null;
  }
}

function nameFromYaml(path: string, raw: string): string {
  const frontMatter = frontMatterFromYaml(raw);
  return asString(frontMatter?.name) ?? humanize(basename(path));
}

async function listFlowFiles(root: string, relativeDir: string): Promise<string[]> {
  const absoluteDir = join(root, relativeDir);
  let entries;
  try {
    entries = await readdir(absoluteDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    const childPath = `${relativeDir}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...await listFlowFiles(root, childPath));
    } else if (entry.isFile() && /\.flow\.ya?ml$/i.test(entry.name)) {
      files.push(childPath);
    }
  }
  return files;
}

async function listPluginFlowFiles(root: string): Promise<string[]> {
  const pluginsDir = join(root, 'plugins');
  let entries;
  try {
    entries = await readdir(pluginsDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    files.push(...await listFlowFiles(root, `plugins/${entry.name}/flows`));
  }
  return files;
}

async function scanWorkflows(root: string): Promise<WorkflowListItem[]> {
  const workflows: WorkflowListItem[] = [];
  for (const scanRoot of SCAN_ROOTS) {
    const paths =
      scanRoot.basePath === 'plugins'
        ? await listPluginFlowFiles(root)
        : await listFlowFiles(root, scanRoot.basePath);

    for (const path of paths) {
      const raw = await readFile(join(root, path), 'utf8');
      workflows.push({
        id: slugForPath(path),
        path,
        category: scanRoot.category,
        name: nameFromYaml(path, raw),
      });
    }
  }
  return workflows.sort((a, b) => a.path.localeCompare(b.path));
}

export function createWorkflowRoutes(config: WorkflowRoutesConfig = {}) {
  const app = new Hono();

  app.get('/', async (c) => {
    const levRoot = await resolveLevRoot(config.levRoot);
    if (!levRoot) return c.json({ hostAvailable: false, workflows: [] });

    const workflows = await scanWorkflows(levRoot);
    return c.json({ hostAvailable: true, workflows });
  });

  app.get('/:id', async (c) => {
    const levRoot = await resolveLevRoot(config.levRoot);
    if (!levRoot) return c.json({ hostAvailable: false, workflow: null });

    const id = c.req.param('id');
    const workflow = (await scanWorkflows(levRoot)).find((candidate) => candidate.id === id);
    if (!workflow) return c.json({ error: 'workflow not found' }, 404);

    const raw = await readFile(join(levRoot, workflow.path), 'utf8');
    return c.json({
      hostAvailable: true,
      workflow: {
        ...workflow,
        raw,
        frontMatter: frontMatterFromYaml(raw),
      },
    });
  });

  return app;
}
