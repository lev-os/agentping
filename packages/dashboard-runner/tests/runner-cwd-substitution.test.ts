import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DashboardRunner } from '../src/runner';
import { registry } from '../src/registry';

type FixturePaths = {
  readonly configPath: string;
  readonly logDir: string;
  readonly projectRoot: string;
  readonly stateDir: string;
};

const originalHostRoot = process.env.AGENTPING_HOST_ROOT;
const tempRoots: string[] = [];

async function createFixture(dashboardsYaml: string): Promise<FixturePaths> {
  const projectRoot = await mkdtemp(join(tmpdir(), 'dashboard-runner-'));
  tempRoots.push(projectRoot);

  await writeFile(join(projectRoot, 'package.json'), '{"private":true}\n');
  await writeFile(join(projectRoot, 'pnpm-workspace.yaml'), 'packages: []\n');

  const configDir = join(projectRoot, 'packages', 'dashboard-runner', 'config');
  const stateDir = join(projectRoot, '.state');
  const logDir = join(projectRoot, '.logs');
  await mkdir(configDir, { recursive: true });

  const configPath = join(configDir, 'dashboards.yaml');
  await writeFile(configPath, `dashboards:\n${dashboardsYaml}`);

  return { configPath, logDir, projectRoot, stateDir };
}

function createRunner(paths: FixturePaths): DashboardRunner {
  return new DashboardRunner({
    configPath: paths.configPath,
    logDir: paths.logDir,
    stateDir: paths.stateDir,
  });
}

function dashboardYaml(id: string, cwd: string, metadata = ''): string {
  return `  - id: ${id}
    name: ${id}
    port: 3000
    port_range: [3000, 3001]
    command: pnpm dev
    cwd: "${cwd}"
    health_check:
      type: process
    restart_policy:
      enabled: false
      max_retries: 0
      backoff_ms: []
    metadata:
      lane: development
      openMode: external
      description: "${id}"
${metadata}`;
}

describe('DashboardRunner cwd substitution', () => {
  beforeEach(() => {
    registry.clear();
    delete process.env.AGENTPING_HOST_ROOT;
  });

  afterEach(async () => {
    registry.clear();
    if (originalHostRoot === undefined) {
      delete process.env.AGENTPING_HOST_ROOT;
    } else {
      process.env.AGENTPING_HOST_ROOT = originalHostRoot;
    }

    await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
  });

  it('resolves {project_root} to an existing absolute path under a temp fixture config', async () => {
    // Given: a workspace-shaped temp fixture with a dashboard under the project root.
    const fixture = await createFixture(dashboardYaml('project-dashboard', '{project_root}/apps/project-dashboard'));
    const dashboardPath = join(fixture.projectRoot, 'apps', 'project-dashboard');
    await mkdir(dashboardPath, { recursive: true });

    // When: the runner loads the dashboard config.
    const runner = createRunner(fixture);

    // Then: the dashboard cwd is the absolute project-root-substituted path.
    expect(runner.getConfig('project-dashboard')?.cwd).toBe(dashboardPath);
  });

  it('skips host_workspace entries with a warning when AGENTPING_HOST_ROOT is unset', async () => {
    // Given: a host-workspace dashboard that depends on {host_root}.
    const fixture = await createFixture(
      dashboardYaml('host-dashboard', '{host_root}/plugins/dashboard', '      host_workspace: true\n'),
    );

    // When: the runner loads the dashboard config without AGENTPING_HOST_ROOT.
    const runner = createRunner(fixture);

    // Then: the dashboard is skipped and the runner log explains how to enable it.
    expect(runner.getConfig('host-dashboard')).toBeUndefined();
    expect(runner.getAllConfigs()).toHaveLength(0);

    const log = await readFile(join(fixture.logDir, 'runner.log'), 'utf-8');
    expect(log).toContain('Skipping host-workspace dashboard host-dashboard: set AGENTPING_HOST_ROOT');
  });

  it('loads host_workspace entries when AGENTPING_HOST_ROOT points at a temp dir containing the target', async () => {
    // Given: a host root containing the host-workspace dashboard target.
    const hostRoot = await mkdtemp(join(tmpdir(), 'dashboard-runner-host-'));
    tempRoots.push(hostRoot);
    const hostDashboardPath = join(hostRoot, 'plugins', 'dashboard');
    await mkdir(hostDashboardPath, { recursive: true });
    process.env.AGENTPING_HOST_ROOT = hostRoot;

    const fixture = await createFixture(
      dashboardYaml('host-dashboard', '{host_root}/plugins/dashboard', '      host_workspace: true\n'),
    );

    // When: the runner loads the dashboard config.
    const runner = createRunner(fixture);

    // Then: the host-workspace dashboard is registered with the substituted cwd.
    expect(runner.getConfig('host-dashboard')?.cwd).toBe(hostDashboardPath);
  });

  it('passes non-substituted absolute cwd values through unchanged', async () => {
    // Given: an absolute dashboard cwd that needs no substitution.
    const absoluteCwd = resolve(tmpdir(), 'dashboard-runner-absolute-cwd');
    const fixture = await createFixture(dashboardYaml('absolute-dashboard', absoluteCwd));

    // When: the runner loads the dashboard config.
    const runner = createRunner(fixture);

    // Then: the absolute cwd is preserved exactly.
    expect(runner.getConfig('absolute-dashboard')?.cwd).toBe(absoluteCwd);
  });
});
