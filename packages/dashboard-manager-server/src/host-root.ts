import { readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

async function isLevRoot(root: string): Promise<boolean> {
  try {
    await Promise.all([readdir(join(root, '.lev', 'pm')), readdir(join(root, 'plugins'))]);
    return true;
  } catch {
    return false;
  }
}

export async function resolveLevRoot(explicit?: string): Promise<string | null> {
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
