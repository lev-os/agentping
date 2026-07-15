import { describe, expect, it, vi } from 'vitest';

import {
  decidePortAction,
  ensurePortAvailable,
  formatAddressInUseError,
  type PortGuardDeps,
} from '../src/port-guard';

describe('port-guard', () => {
  it('allows bind when the probe reports the port free', async () => {
    const decision = await decidePortAction(
      { host: '127.0.0.1', port: 3030 },
      { probe: async () => ({ occupied: false }) },
    );
    expect(decision).toEqual({ action: 'bind' });
  });

  it('fails fast when occupied without --takeover', async () => {
    const decision = await decidePortAction(
      { host: '127.0.0.1', port: 3030 },
      { probe: async () => ({ occupied: true, healthy: true, detail: 'HTTP 200' }) },
    );
    expect(decision.action).toBe('exit');
    if (decision.action === 'exit') {
      expect(decision.code).toBe(1);
      expect(decision.message).toContain('Port 3030 is already in use');
      expect(decision.message).toContain('--takeover');
    }
  });

  it('returns takeover pids when --takeover is set', async () => {
    const decision = await decidePortAction(
      { host: '127.0.0.1', port: 3030, takeover: true },
      {
        probe: async () => ({ occupied: true, healthy: true }),
        findListeners: async () => [4242],
      },
    );
    expect(decision).toEqual({ action: 'takeover', pids: [4242] });
  });

  it('SIGTERMs listeners and waits for the port to free under --takeover', async () => {
    const kill = vi.fn();
    let occupied = true;
    const deps: PortGuardDeps = {
      probe: async () => (occupied ? { occupied: true, healthy: true } : { occupied: false }),
      findListeners: async () => [4242, 4243],
      kill,
      sleep: async () => {
        occupied = false;
      },
      now: (() => {
        let t = 0;
        return () => {
          t += 100;
          return t;
        };
      })(),
    };

    const result = await ensurePortAvailable(
      { host: '127.0.0.1', port: 3030, takeover: true, takeoverWaitMs: 1000, pollIntervalMs: 50 },
      deps,
    );

    expect(result).toEqual({ ok: true });
    expect(kill).toHaveBeenCalledWith(4242, 'SIGTERM');
    expect(kill).toHaveBeenCalledWith(4243, 'SIGTERM');
  });

  it('exits with a clear message when takeover cannot free the port', async () => {
    const result = await ensurePortAvailable(
      { host: '127.0.0.1', port: 3030, takeover: true, takeoverWaitMs: 200, pollIntervalMs: 50 },
      {
        probe: async () => ({ occupied: true, healthy: true }),
        findListeners: async () => [99],
        kill: () => undefined,
        sleep: async () => undefined,
        now: (() => {
          let t = 0;
          return () => {
            const current = t;
            t += 100;
            return current;
          };
        })(),
      },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('did not free');
      expect(result.message).toContain('99');
    }
  });

  it('exits cleanly when the only listener is this process (self-kill guard)', async () => {
    const selfPid = process.pid;
    const decision = await decidePortAction(
      { host: '127.0.0.1', port: 3030, takeover: true },
      {
        probe: async () => ({ occupied: true, healthy: true }),
        findListeners: async () => [selfPid],
      },
    );
    expect(decision.action).toBe('exit');
    if (decision.action === 'exit') {
      expect(decision.message).toContain('self');
    }
  });

  it('exits cleanly when lsof returns empty output under --takeover', async () => {
    const decision = await decidePortAction(
      { host: '127.0.0.1', port: 3030, takeover: true },
      {
        probe: async () => ({ occupied: true, healthy: true }),
        findListeners: async () => [],
      },
    );
    expect(decision.action).toBe('exit');
    if (decision.action === 'exit') {
      expect(decision.message).toContain('no listening PID');
    }
  });

  it('formats EADDRINUSE clearly', () => {
    expect(formatAddressInUseError('127.0.0.1', 3030)).toContain('EADDRINUSE');
    expect(formatAddressInUseError('127.0.0.1', 3030)).toContain('--takeover');
  });
});
