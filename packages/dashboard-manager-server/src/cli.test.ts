import { describe, expect, it } from 'vitest';

import { parseArgs } from './cli';

describe('dashboard-manager-server CLI', () => {
  it('passes --state-dir through parsed runner configuration', () => {
    // Given: a caller that chooses a runner state directory.
    const stateDir = '/tmp/agentping-dashboard-state';

    // When: the CLI arguments are parsed.
    const config = parseArgs(['--state-dir', stateDir]);

    // Then: the chosen path is available for DashboardRunner construction.
    expect(config.stateDir).toBe(stateDir);
  });
});
