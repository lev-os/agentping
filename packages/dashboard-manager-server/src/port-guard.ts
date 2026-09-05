import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type PortProbeResult =
  | { occupied: false }
  | { occupied: true; healthy: boolean; detail?: string };

export type PortProber = (host: string, port: number) => Promise<PortProbeResult>;
export type PortListenerFinder = (port: number) => Promise<number[]>;
export type ProcessKiller = (pid: number, signal?: NodeJS.Signals) => void;
export type Sleeper = (ms: number) => Promise<void>;

export interface PortGuardDeps {
  probe?: PortProber;
  findListeners?: PortListenerFinder;
  kill?: ProcessKiller;
  sleep?: Sleeper;
  now?: () => number;
}

export interface EnsurePortAvailableOptions {
  host: string;
  port: number;
  takeover?: boolean;
  takeoverWaitMs?: number;
  pollIntervalMs?: number;
}

export type PortGuardDecision =
  | { action: 'bind' }
  | { action: 'exit'; code: 1; message: string }
  | { action: 'takeover'; pids: number[] };

export async function defaultHealthProbe(host: string, port: number): Promise<PortProbeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1000);
  try {
    const response = await fetch(`http://${host}:${port}/health`, {
      signal: controller.signal,
    });
    return {
      occupied: true,
      healthy: response.ok,
      detail: `HTTP ${response.status}`,
    };
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { cause?: unknown; name?: string };
    let code: string | number | undefined = err.code;
    let cursor: unknown = err.cause;
    while (code == null && cursor && typeof cursor === 'object') {
      const record = cursor as { code?: string | number; cause?: unknown; errors?: unknown[] };
      code = record.code;
      if (code == null && Array.isArray(record.errors) && record.errors[0]) {
        cursor = record.errors[0];
        continue;
      }
      cursor = record.cause;
    }
    if (code === 'ECONNREFUSED' || code === 'ENOTFOUND') {
      return { occupied: false };
    }
    if (err.name === 'AbortError') {
      return { occupied: true, healthy: false, detail: 'health probe timed out' };
    }
    return { occupied: true, healthy: false, detail: err.message };
  } finally {
    clearTimeout(timer);
  }
}

export async function defaultFindListeners(port: number): Promise<number[]> {
  try {
    const { stdout } = await execFileAsync('lsof', ['-ti', `tcp:${port}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
    });
    return stdout
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => Number.parseInt(part, 10))
      .filter((pid) => Number.isFinite(pid) && pid > 0);
  } catch (error) {
    const err = error as { code?: number | string };
    // lsof exits 1 when nothing matches
    if (err.code === 1) return [];
    throw error;
  }
}

export function defaultKill(pid: number, signal: NodeJS.Signals = 'SIGTERM'): void {
  process.kill(pid, signal);
}

export function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function decidePortAction(
  options: EnsurePortAvailableOptions,
  deps: PortGuardDeps = {},
): Promise<PortGuardDecision> {
  const probe = deps.probe ?? defaultHealthProbe;
  const result = await probe(options.host, options.port);

  if (!result.occupied) {
    return { action: 'bind' };
  }

  if (!options.takeover) {
    return {
      action: 'exit',
      code: 1,
      message:
        `[CLI] Port ${options.port} is already in use` +
        (result.detail ? ` (${result.detail})` : '') +
        `. An instance appears to be running at http://${options.host}:${options.port}. ` +
        `Stop it first, or re-run with --takeover.`,
    };
  }

  const findListeners = deps.findListeners ?? defaultFindListeners;
  const rawPids = await findListeners(options.port);
  const pids = rawPids.filter((pid) => pid !== process.pid);
  if (pids.length === 0 && rawPids.length > 0) {
    return {
      action: 'exit',
      code: 1,
      message:
        `[CLI] Port ${options.port} is occupied but the only listener is this process (pid ${process.pid}). ` +
        `Cannot self-takeover.`,
    };
  }
  if (pids.length === 0) {
    return {
      action: 'exit',
      code: 1,
      message:
        `[CLI] Port ${options.port} is occupied but no listening PID was found via lsof. ` +
        `Cannot takeover safely.`,
    };
  }

  return { action: 'takeover', pids };
}

export async function ensurePortAvailable(
  options: EnsurePortAvailableOptions,
  deps: PortGuardDeps = {},
): Promise<{ ok: true } | { ok: false; message: string }> {
  const decision = await decidePortAction(options, deps);
  if (decision.action === 'bind') {
    return { ok: true };
  }
  if (decision.action === 'exit') {
    return { ok: false, message: decision.message };
  }

  const kill = deps.kill ?? defaultKill;
  const sleep = deps.sleep ?? defaultSleep;
  const probe = deps.probe ?? defaultHealthProbe;
  const waitMs = options.takeoverWaitMs ?? 5000;
  const pollMs = options.pollIntervalMs ?? 200;
  const now = deps.now ?? Date.now;

  for (const pid of decision.pids) {
    try {
      kill(pid, 'SIGTERM');
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'ESRCH') {
        return {
          ok: false,
          message: `[CLI] Failed to SIGTERM pid ${pid} on port ${options.port}: ${err.message}`,
        };
      }
    }
  }

  const deadline = now() + waitMs;
  while (now() < deadline) {
    const probeResult = await probe(options.host, options.port);
    if (!probeResult.occupied) {
      return { ok: true };
    }
    await sleep(pollMs);
  }

  return {
    ok: false,
    message:
      `[CLI] Port ${options.port} did not free within ${waitMs}ms after SIGTERM ` +
      `(pids: ${decision.pids.join(', ')}).`,
  };
}

export function formatAddressInUseError(host: string, port: number): string {
  return (
    `[CLI] Port ${port} is already in use (EADDRINUSE). ` +
    `An instance appears to be running at http://${host}:${port}. ` +
    `Stop it first, or re-run with --takeover.`
  );
}
