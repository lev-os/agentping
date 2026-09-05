import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { createWorkflowRoutes } from './workflows';

async function makeDir(prefix: string): Promise<string> {
  return await mkdtemp(join(tmpdir(), prefix));
}

async function makeLevFixture(): Promise<string> {
  const root = await makeDir('workflow-host-');
  await mkdir(join(root, '.lev', 'pm'), { recursive: true });
  await mkdir(join(root, 'plugins', 'demo', 'flows', 'nested'), { recursive: true });
  return root;
}

describe('createWorkflowRoutes', () => {
  const fixtures: string[] = [];

  afterEach(async () => {
    await Promise.all(fixtures.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it('GET / returns empty workflows when host root is unavailable', async () => {
    const root = await makeDir('workflow-headless-');
    fixtures.push(root);

    const app = createWorkflowRoutes({ levRoot: root });
    const response = await app.request('/');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ hostAvailable: false, workflows: [] });
  });

  it('GET / and /:id expose flow files from an injected host root', async () => {
    const root = await makeLevFixture();
    fixtures.push(root);
    await writeFile(
      join(root, 'plugins', 'demo', 'flows', 'nested', 'sample.flow.yaml'),
      [
        'name: Sample Flow',
        'description: Demo workflow',
        'meta:',
        '  lane: ops',
        'steps:',
        '  - id: start',
        '    command: echo ok',
      ].join('\n'),
    );

    const app = createWorkflowRoutes({ levRoot: root });
    const listResponse = await app.request('/');
    const listBody = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(listBody).toEqual({
      hostAvailable: true,
      workflows: [
        {
          id: 'plugin-demo-flows-nested-sample',
          path: 'plugins/demo/flows/nested/sample.flow.yaml',
          category: 'plugin',
          name: 'Sample Flow',
        },
      ],
    });

    const detailResponse = await app.request('/plugin-demo-flows-nested-sample');
    const detailBody = await detailResponse.json();

    expect(detailResponse.status).toBe(200);
    expect(detailBody).toEqual({
      hostAvailable: true,
      workflow: {
        id: 'plugin-demo-flows-nested-sample',
        path: 'plugins/demo/flows/nested/sample.flow.yaml',
        category: 'plugin',
        name: 'Sample Flow',
        raw: [
          'name: Sample Flow',
          'description: Demo workflow',
          'meta:',
          '  lane: ops',
          'steps:',
          '  - id: start',
          '    command: echo ok',
        ].join('\n'),
        frontMatter: {
          name: 'Sample Flow',
          description: 'Demo workflow',
          meta: { lane: 'ops' },
        },
      },
    });
  });
});
