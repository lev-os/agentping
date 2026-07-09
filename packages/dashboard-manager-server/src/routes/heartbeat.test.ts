import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __resetHeartbeatCache,
  createHeartbeatRoutes,
  type HeartbeatExec,
} from './heartbeat';

const FIXED_NOW = new Date('2026-07-09T12:00:00.000Z');

async function makeLevFixture(prefix = 'hb-'): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), prefix));
  await mkdir(join(root, '.lev', 'pm', 'handoffs'), { recursive: true });
  await mkdir(join(root, '.lev', 'pm', 'journal'), { recursive: true });
  await mkdir(join(root, '.lev', 'pm', 'tasks', 'task-alpha'), { recursive: true });
  await mkdir(join(root, 'docs', '_inbox'), { recursive: true });
  await mkdir(join(root, 'plugins', 'dashboard', 'data'), { recursive: true });
  await mkdir(join(root, 'plugins', 'timetravel', 'src'), { recursive: true });
  await mkdir(join(root, 'plugins', 'alpha'), { recursive: true });
  return root;
}

async function writeHappyFixture(root: string): Promise<void> {
  await writeFile(
    join(root, 'plugins', 'dashboard', 'data', 'state.json'),
    JSON.stringify({
      timestamp: '2026-07-07T00:12:09.896Z',
      tick: 42,
      git: { changedFiles: 99, recentCommits: [] },
      beads: {
        total: 10,
        open: 4,
        closed: 6,
        ready: 2,
        inProgress: 1,
        blocked: 1,
        readyItems: [
          { status: '○', id: 'lev-a', priority: 'P0', title: 'Ready A' },
        ],
        inProgressItems: [
          { status: '◐', id: 'lev-b', priority: 'P1', title: 'WIP B' },
        ],
      },
    }),
  );

  await writeFile(join(root, '.lev', 'pm', 'handoffs', '20260709-z.md'), '# z');
  await writeFile(join(root, '.lev', 'pm', 'handoffs', '20260708-y.md'), '# y');
  await writeFile(join(root, '.lev', 'pm', 'handoffs', '_skip.md'), '# skip');
  await writeFile(join(root, '.lev', 'pm', 'journal', '20260709.md'), '# j');
  await writeFile(join(root, '.lev', 'pm', 'journal', '20260701.md'), '# j0');
  await writeFile(join(root, 'docs', '_inbox', 'cdo-r2.md'), '# r2');
  await writeFile(join(root, 'docs', '_inbox', 'cdo-r1.md'), '# r1');
  await writeFile(join(root, 'docs', '_inbox', 'other.md'), '# other');
  await writeFile(
    join(root, '.lev', 'pm', 'tasks', 'task-alpha', 'dna.yaml'),
    'title: Alpha Task\npriority: P0\n',
  );
  await writeFile(
    join(root, 'plugins', 'alpha', 'package.json'),
    JSON.stringify({ name: '@lev/alpha', version: '1.2.3' }),
  );
}

function fakeGitExec(): HeartbeatExec {
  return async (file, args) => {
    if (file === 'git' && args[0] === 'status') {
      return ' M a.ts\n?? b.ts\n';
    }
    if (file === 'git' && args[0] === 'log') {
      return 'abc1234 First commit\ndef5678 Second commit\n';
    }
    throw new Error(`unexpected exec: ${file} ${args.join(' ')}`);
  };
}

describe('createHeartbeatRoutes', () => {
  const fixtures: string[] = [];

  beforeEach(() => {
    __resetHeartbeatCache();
  });

  afterEach(async () => {
    __resetHeartbeatCache();
    await Promise.all(fixtures.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it('GET / returns full heartbeat shape from fixture + fake git', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);
    await writeHappyFixture(root);

    const app = createHeartbeatRoutes({
      levRoot: root,
      exec: fakeGitExec(),
      now: () => FIXED_NOW,
    });

    const response = await app.request('/');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      generatedAt: FIXED_NOW.toISOString(),
      snapshot: { tick: 42, timestamp: '2026-07-07T00:12:09.896Z' },
      pulse: {
        ready: 2,
        inProgress: 1,
        closed: 6,
        open: 4,
        total: 10,
        blocked: 1,
        gitChanges: 2,
      },
      workQueue: {
        readyItems: [{ status: '○', id: 'lev-a', priority: 'P0', title: 'Ready A' }],
        inProgressItems: [{ status: '◐', id: 'lev-b', priority: 'P1', title: 'WIP B' }],
      },
      git: {
        changedFiles: 2,
        recentCommits: [
          { hash: 'abc1234', message: 'First commit' },
          { hash: 'def5678', message: 'Second commit' },
        ],
      },
      handoffs: ['20260709-z.md', '20260708-y.md'],
      journal: ['20260709.md', '20260701.md'],
      cdoRounds: ['cdo-r1.md', 'cdo-r2.md'],
      briefs: [{ id: 'task-alpha', title: 'Alpha Task' }],
    });
  });

  it('GET / degrades when state.json missing and git fails', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);
    // minimal lev root markers only — no state.json
    await writeFile(join(root, 'plugins', 'alpha', 'package.json'), '{}');

    const app = createHeartbeatRoutes({
      levRoot: root,
      exec: async () => {
        throw new Error('git boom');
      },
      now: () => FIXED_NOW,
    });

    const response = await app.request('/');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.snapshot).toEqual({ tick: null, timestamp: null });
    expect(body.pulse).toEqual({
      ready: 0,
      inProgress: 0,
      closed: 0,
      open: 0,
      total: 0,
      blocked: 0,
      gitChanges: 0,
    });
    expect(body.workQueue).toEqual({ readyItems: [], inProgressItems: [] });
    expect(body.git).toEqual({ error: 'git boom' });
  });

  it('GET /timeline skips malformed JSONL lines', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);
    await writeFile(
      join(root, 'plugins', 'dashboard', 'data', 'timeline.jsonl'),
      [
        '{"tick":0,"timestamp":"t0","beads_ready":1}',
        'NOT_JSON',
        '{"tick":1,"timestamp":"t1","beads_ready":2}',
        '',
      ].join('\n'),
    );
    await writeFile(
      join(root, 'plugins', 'dashboard', 'data', 'evolution-log.jsonl'),
      ['{"tick":0,"type":"ok"}', '{bad', '{"tick":1,"type":"also"}'].join('\n'),
    );

    const app = createHeartbeatRoutes({
      levRoot: root,
      exec: fakeGitExec(),
      now: () => FIXED_NOW,
    });

    const response = await app.request('/timeline');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ticks).toEqual([
      { tick: 0, timestamp: 't0', beads_ready: 1 },
      { tick: 1, timestamp: 't1', beads_ready: 2 },
    ]);
    expect(body.evolution).toEqual([
      { tick: 0, type: 'ok' },
      { tick: 1, type: 'also' },
    ]);
  });

  it('GET /plugins caches research adapters for 60s then refreshes', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);
    await writeFile(
      join(root, 'plugins', 'alpha', 'package.json'),
      JSON.stringify({ name: '@lev/alpha', version: '1.0.0' }),
    );

    let clock = FIXED_NOW.getTime();
    const exec = vi.fn<HeartbeatExec>(async (file, args) => {
      if (file === 'bun') {
        return JSON.stringify([
          { name: 'exa', available: true, capabilities: ['search'] },
          { name: 'broken', available: false, degradedReason: 'offline' },
        ]);
      }
      throw new Error(`unexpected: ${file} ${args.join(' ')}`);
    });

    const app = createHeartbeatRoutes({
      levRoot: root,
      exec,
      now: () => new Date(clock),
    });

    const first = await app.request('/plugins');
    const firstBody = await first.json();
    expect(first.status).toBe(200);
    expect(firstBody.research).toEqual({
      adapters: [
        { name: 'exa', available: true, capabilities: ['search'] },
        { name: 'broken', available: false, degradedReason: 'offline' },
      ],
      counts: { available: 1, total: 2 },
    });
    expect(firstBody.plugins).toEqual([
      { name: '@lev/alpha', version: '1.0.0', dir: 'alpha' },
    ]);
    expect(exec).toHaveBeenCalledTimes(1);

    clock += 30_000;
    await app.request('/plugins');
    expect(exec).toHaveBeenCalledTimes(1);

    clock += 31_000;
    await app.request('/plugins');
    expect(exec).toHaveBeenCalledTimes(2);
  });

  it('GET /plugins returns research.error when exec rejects but still lists plugins', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);
    await writeFile(
      join(root, 'plugins', 'alpha', 'package.json'),
      JSON.stringify({ name: '@lev/alpha', version: '9.9.9' }),
    );

    const app = createHeartbeatRoutes({
      levRoot: root,
      exec: async () => {
        throw new Error('cli down');
      },
      now: () => FIXED_NOW,
    });

    const response = await app.request('/plugins');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.research).toEqual({ error: 'cli down' });
    expect(body.plugins).toEqual([{ name: '@lev/alpha', version: '9.9.9', dir: 'alpha' }]);
  });

  it('returns 503 on all three endpoints when levRoot is invalid', async () => {
    const empty = await mkdtemp(join(tmpdir(), 'hb-empty-'));
    fixtures.push(empty);

    const app = createHeartbeatRoutes({
      levRoot: empty,
      exec: fakeGitExec(),
      now: () => FIXED_NOW,
    });

    for (const path of ['/', '/timeline', '/plugins']) {
      const response = await app.request(path);
      const body = await response.json();
      expect(response.status).toBe(503);
      expect(body).toEqual({ error: 'leviathan root not found' });
    }
  });

  it('FIX1: LEV_ROOT env set to empty dir returns 503 — does NOT fall through to cwd walk', async () => {
    const empty = await mkdtemp(join(tmpdir(), 'hb-env-empty-'));
    fixtures.push(empty);

    const saved = process.env.LEV_ROOT;
    process.env.LEV_ROOT = empty;
    try {
      // No config.levRoot — relies on env
      const app = createHeartbeatRoutes({ exec: fakeGitExec(), now: () => FIXED_NOW });

      for (const path of ['/', '/timeline', '/plugins']) {
        const response = await app.request(path);
        const body = await response.json();
        expect(response.status).toBe(503);
        expect(body).toEqual({ error: 'leviathan root not found' });
      }
    } finally {
      if (saved === undefined) {
        delete process.env.LEV_ROOT;
      } else {
        process.env.LEV_ROOT = saved;
      }
    }
  });

  it('FIX2: git failure falls back to state.json git.changedFiles for pulse.gitChanges', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);
    await writeHappyFixture(root); // state.json has git.changedFiles = 99

    const app = createHeartbeatRoutes({
      levRoot: root,
      exec: async () => {
        throw new Error('git unavailable');
      },
      now: () => FIXED_NOW,
    });

    const response = await app.request('/');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.git).toEqual({ error: 'git unavailable' });
    expect(body.pulse.gitChanges).toBe(99);
  });

  it('FIX3: /timeline bounded tail read returns LAST entries from a large file', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);

    // Build a file where early lines are outside the byte window
    const earlyLines = Array.from({ length: 20 }, (_, i) =>
      JSON.stringify({ tick: i, keep: false, pad: 'x'.repeat(20) }),
    );
    const lastLines = [
      JSON.stringify({ tick: 100, keep: true }),
      JSON.stringify({ tick: 101, keep: true }),
    ];
    const content = [...earlyLines, ...lastLines].join('\n') + '\n';

    await writeFile(
      join(root, 'plugins', 'dashboard', 'data', 'timeline.jsonl'),
      content,
    );
    await writeFile(
      join(root, 'plugins', 'dashboard', 'data', 'evolution-log.jsonl'),
      content,
    );

    // Use a small byte window so only the last lines fit
    const app = createHeartbeatRoutes({
      levRoot: root,
      exec: fakeGitExec(),
      now: () => FIXED_NOW,
      timelineByteWindow: 80, // smaller than the early section
    });

    const response = await app.request('/timeline');
    const body = await response.json();

    expect(response.status).toBe(200);
    // All returned ticks must be from the tail
    const ticks = body.ticks as Array<{ tick: number; keep: boolean }>;
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks.every((t) => t.keep === true)).toBe(true);
    expect(ticks.map((t) => t.tick)).toEqual(expect.arrayContaining([100, 101]));
  });
});
