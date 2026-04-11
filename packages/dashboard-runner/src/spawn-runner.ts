/**
 * SpawnRunner — Generalized process spawn with streaming output
 *
 * Powers both build-and-exit dashboards and the detected→ready lifecycle
 * transition. Same pattern: spawn a process, pipe output as StreamOps,
 * check exit code, transition state.
 *
 * Usage:
 *   const runner = new SpawnRunner(logger)
 *   for await (const op of runner.run('pnpm install', '/path/to/project')) {
 *     // op: { type: 'stdout'|'stderr'|'exit', line?: string, code?: number }
 *     websocket.send(JSON.stringify(op))
 *   }
 */

import { spawn } from 'child_process';
import type { DashboardLogger } from './logger.js';

export interface StreamOp {
  type: 'stdout' | 'stderr' | 'exit';
  timestamp: string;
  line?: string;
  code?: number | null;
  signal?: string | null;
}

export interface SpawnResult {
  exitCode: number | null;
  signal: string | null;
  success: boolean;
  ops: StreamOp[];
}

export class SpawnRunner {
  private logger: DashboardLogger;

  constructor(logger: DashboardLogger) {
    this.logger = logger;
  }

  /**
   * Spawn a command and yield StreamOps as they arrive.
   * Resolves when the process exits.
   */
  async *run(
    command: string,
    cwd: string,
    env?: Record<string, string>,
  ): AsyncGenerator<StreamOp> {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
    });

    // Buffer for yielding from event callbacks
    const pending: StreamOp[] = [];
    let resolve: (() => void) | null = null;
    let done = false;

    const push = (op: StreamOp) => {
      pending.push(op);
      if (resolve) {
        const r = resolve;
        resolve = null;
        r();
      }
    };

    child.stdout?.on('data', (data: Buffer) => {
      for (const line of data.toString().split('\n').filter((l: string) => l.trim())) {
        push({ type: 'stdout', timestamp: new Date().toISOString(), line });
      }
    });

    child.stderr?.on('data', (data: Buffer) => {
      for (const line of data.toString().split('\n').filter((l: string) => l.trim())) {
        push({ type: 'stderr', timestamp: new Date().toISOString(), line });
      }
    });

    child.on('exit', (code, signal) => {
      push({
        type: 'exit',
        timestamp: new Date().toISOString(),
        code,
        signal,
      });
      done = true;
    });

    // Yield ops as they arrive
    while (!done || pending.length > 0) {
      if (pending.length > 0) {
        yield pending.shift()!;
      } else {
        await new Promise<void>(r => { resolve = r; });
      }
    }
  }

  /**
   * Spawn and collect all output. Returns a SpawnResult with exit info.
   * Simpler API when you don't need streaming.
   */
  async exec(
    command: string,
    cwd: string,
    env?: Record<string, string>,
  ): Promise<SpawnResult> {
    const ops: StreamOp[] = [];
    let exitCode: number | null = null;
    let signal: string | null = null;

    for await (const op of this.run(command, cwd, env)) {
      ops.push(op);
      if (op.type === 'stdout' || op.type === 'stderr') {
        this.logger.info(op.line || '', { stream: op.type });
      }
      if (op.type === 'exit') {
        exitCode = op.code ?? null;
        signal = op.signal ?? null;
      }
    }

    return {
      exitCode,
      signal,
      success: exitCode === 0 && !signal,
      ops,
    };
  }
}
