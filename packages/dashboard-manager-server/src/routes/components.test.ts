import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { createComponentsRoutes } from './components';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function makeCatalog(withManifest: boolean): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'components-catalog-'));
  tempDirs.push(dir);
  if (withManifest) {
    await writeFile(
      join(dir, '_manifest.json'),
      JSON.stringify({
        version: 1,
        generated: '2026-07-09T00:00:00.000Z',
        total: 1,
        byClassification: { REAL: 1 },
        byFamily: { demo: 1 },
        byLevNowElement: {},
        components: [
          {
            id: 'demo-card',
            name: 'Demo Card',
            family: 'demo',
            domain: 'ui',
            capabilities: [],
            classification: 'REAL',
            levNowElement: null,
            origin: 'test',
            migrationStatus: 'done',
            source: 'demo-card.tsx',
            loc: 10,
            imports: 0,
            hooks: 0,
            propCount: 0,
            lanes: [],
            beadId: 'bead-1',
            markers: [],
          },
        ],
      }),
    );
  }
  return dir;
}

describe('createComponentsRoutes catalog paths', () => {
  it('returns the manifest when the catalog fixture exists', async () => {
    const catalogDir = await makeCatalog(true);
    const app = createComponentsRoutes({ catalogDir });

    const response = await app.request('/');
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.total).toBe(1);
    expect(payload.components[0].id).toBe('demo-card');
  });

  it('returns 503 with hint when the manifest is missing', async () => {
    const catalogDir = await makeCatalog(false);
    const app = createComponentsRoutes({ catalogDir });

    const response = await app.request('/');
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toBe('Manifest not found');
    expect(payload.hint).toBe(join(catalogDir, '_manifest.json'));
  });

  it('returns 503 with hint when existsSync passes but readFile throws ENOENT (TOCTOU)', async () => {
    const catalogDir = await makeCatalog(true);
    const manifestPath = join(catalogDir, '_manifest.json');
    const enoentError = Object.assign(new Error('ENOENT: no such file or directory'), { code: 'ENOENT' });

    const app = createComponentsRoutes({
      catalogDir,
      fileReader: async () => { throw enoentError; },
    });

    const response = await app.request('/');
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toBe('Manifest not found');
    expect(payload.hint).toBe(manifestPath);
  });
});
