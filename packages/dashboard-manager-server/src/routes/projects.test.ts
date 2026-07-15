import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { createProjectsRoutes } from './projects';

async function makeDir(prefix: string): Promise<string> {
  return await mkdtemp(join(tmpdir(), prefix));
}

async function makeLevFixture(): Promise<string> {
  const root = await makeDir('projects-host-');
  await mkdir(join(root, '.lev', 'pm'), { recursive: true });
  await mkdir(join(root, 'plugins'), { recursive: true });
  return root;
}

describe('createProjectsRoutes', () => {
  const fixtures: string[] = [];

  afterEach(async () => {
    await Promise.all(fixtures.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it('GET / returns no projects when the Lev host root is unavailable', async () => {
    // Given: an explicit path that is not a Lev host root.
    const root = await makeDir('projects-headless-');
    fixtures.push(root);
    const app = createProjectsRoutes({ levRoot: root });

    // When: a caller requests the project list.
    const response = await app.request('/');

    // Then: the route remains available without a host workspace.
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ hostAvailable: false, projects: [] });
  });

  it('GET / reads detected projects from an injected Lev host root', async () => {
    // Given: a host root with a detected-projects file.
    const root = await makeLevFixture();
    fixtures.push(root);
    await writeFile(
      join(root, '.lev', 'detected-projects.yaml'),
      [
        'projects:',
        '  - name: Demo App',
        '    id: demo-app',
        '    cwd: /tmp/demo-app',
        '    metadata:',
        '      runtime: node',
      ].join('\n'),
    );
    const app = createProjectsRoutes({ levRoot: root });

    // When: a caller requests the project list.
    const response = await app.request('/');

    // Then: entries come from the configured host rather than a package-relative path.
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      hostAvailable: true,
      projects: [
        {
          name: 'Demo App',
          id: 'demo-app',
          cwd: '/tmp/demo-app',
          metadata: { runtime: 'node' },
        },
      ],
    });
  });
});
