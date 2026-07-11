import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createParityRoutes } from './parity';

const NOW = new Date('2026-07-11T15:00:00.000Z');
const fixtures: string[] = [];

afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(fixtures.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function makeCacheHome(): Promise<string> {
  const cacheHome = await mkdtemp(join(tmpdir(), 'parity-scorecard-cache-'));
  fixtures.push(cacheHome);
  return cacheHome;
}

async function writeScorecard(cacheHome: string, generatedAt: string): Promise<void> {
  const dashboardCache = join(cacheHome, 'lev', 'dashboard');
  await mkdir(dashboardCache, { recursive: true });
  await writeFile(
    join(dashboardCache, 'parity-scorecard.json'),
    JSON.stringify({
      schema_version: 1,
      generated_at: generatedAt,
      generator: 'test',
      targets: [
        {
          target: 'graphnosis',
          verdict: 'extract',
          features: [],
        },
      ],
    }),
  );
}

describe('createParityRoutes', () => {
  it('returns 503 with a hint when the XDG cache scorecard is missing', async () => {
    const cacheHome = await makeCacheHome();
    vi.stubEnv('XDG_CACHE_HOME', cacheHome);
    const app = createParityRoutes({ now: () => NOW });

    const response = await app.request('/scorecard');
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      error: 'Parity scorecard not found',
      hint: join(cacheHome, 'lev', 'dashboard', 'parity-scorecard.json'),
    });
  });

  it('returns the scorecard from XDG_CACHE_HOME with freshness metadata', async () => {
    const cacheHome = await makeCacheHome();
    await writeScorecard(cacheHome, '2026-07-11T14:30:00.000Z');
    vi.stubEnv('XDG_CACHE_HOME', cacheHome);
    const app = createParityRoutes({ now: () => NOW });

    const response = await app.request('/scorecard');
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.schema_version).toBe(1);
    expect(payload.generated_at).toBe('2026-07-11T14:30:00.000Z');
    expect(payload.stale).toBe(false);
    expect(payload.targets[0].target).toBe('graphnosis');
  });

  it('marks the scorecard stale when generated_at is older than 24 hours', async () => {
    const cacheHome = await makeCacheHome();
    await writeScorecard(cacheHome, '2026-07-10T14:59:59.999Z');
    vi.stubEnv('XDG_CACHE_HOME', cacheHome);
    const app = createParityRoutes({ now: () => NOW });

    const response = await app.request('/scorecard');
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.stale).toBe(true);
  });
});
