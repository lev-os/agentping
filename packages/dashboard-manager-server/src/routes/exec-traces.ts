/**
 * Exec Trace Debug Routes
 *
 * Read-only AgentPing debug API for Lev exec trace and FlowMind graph data.
 */

import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { Hono } from 'hono';

export interface CommandRunOptions {
  cwd: string;
}

export interface CommandRunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  error?: string;
}

export type ExecTraceCommandRunner = (
  command: string,
  args: string[],
  options: CommandRunOptions,
) => Promise<CommandRunResult>;

export interface ExecTraceRoutesConfig {
  projectRoot?: string;
  commandRunner?: ExecTraceCommandRunner;
}

interface CommandDiagnostic {
  level: 'warning' | 'error';
  code: string;
  message: string;
}

const EXEC_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const MAX_BUFFER_BYTES = 10 * 1024 * 1024;

export const defaultCommandRunner: ExecTraceCommandRunner = (command, args, options) => {
  return new Promise((resolveResult) => {
    execFile(
      command,
      args,
      {
        cwd: options.cwd,
        maxBuffer: MAX_BUFFER_BYTES,
      },
      (error, stdout, stderr) => {
        const maybeError = error as (NodeJS.ErrnoException & { code?: number | string }) | null;
        resolveResult({
          ok: !error,
          stdout,
          stderr,
          exitCode: typeof maybeError?.code === 'number' ? maybeError.code : error ? 1 : 0,
          error: error?.message,
        });
      },
    );
  });
};

function discoverProjectRoot(explicitProjectRoot?: string): string {
  if (explicitProjectRoot) {
    return resolve(explicitProjectRoot);
  }

  if (process.env.LEV_PROJECT_ROOT) {
    return resolve(process.env.LEV_PROJECT_ROOT);
  }

  let current = resolve(process.cwd());
  while (true) {
    if (existsSync(join(current, '.lev'))) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return resolve(process.cwd());
    }
    current = parent;
  }
}

function parseCommandJson(result: CommandRunResult): unknown {
  const output = result.stdout.trim();
  if (!output) {
    throw new Error('Command returned empty JSON output');
  }
  return JSON.parse(output);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasWorkflowGraphEnvelope(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.widget)) return false;
  return isRecord(value.widget.graph);
}

function outputText(result: CommandRunResult): string {
  return [result.stdout, result.stderr, result.error].filter(Boolean).join('\n');
}

function isMissingTrace(result: CommandRunResult): boolean {
  const text = outputText(result).toLowerCase();
  return text.includes('no events') || text.includes('no trace') || text.includes('not found');
}

function isMissingTraceTextResult(result: CommandRunResult): boolean {
  const output = result.stdout.trim();
  return !output.startsWith('{') && !output.startsWith('[') && isMissingTrace(result);
}

function errorMessage(result: CommandRunResult): string {
  return result.stderr.trim() || result.error || result.stdout.trim() || 'Command failed';
}

export function createExecTraceRoutes(config: ExecTraceRoutesConfig = {}) {
  const app = new Hono();
  const commandRunner = config.commandRunner ?? defaultCommandRunner;

  app.get('/:execId', async (c) => {
    const execId = c.req.param('execId');
    if (!EXEC_ID_PATTERN.test(execId)) {
      return c.json({ error: 'Invalid exec id' }, 400);
    }

    const projectRoot = discoverProjectRoot(config.projectRoot);
    const diagnostics: CommandDiagnostic[] = [];

    const traceArgs = ['exec', 'trace', `--run=${execId}`, '--json'];
    const traceResult = await commandRunner('lev', traceArgs, { cwd: projectRoot });

    if (!traceResult.ok || isMissingTraceTextResult(traceResult)) {
      if (isMissingTrace(traceResult)) {
        return c.json(
          {
            error: 'trace not found',
            execId,
          },
          404,
        );
      }

      return c.json(
        {
          error: 'Failed to load exec trace',
          diagnostics: [
            {
              level: 'error',
              code: 'TRACE_COMMAND_FAILED',
              message: errorMessage(traceResult),
            },
          ],
        },
        500,
      );
    }

    let trace: unknown;
    try {
      trace = parseCommandJson(traceResult);
    } catch (error) {
      return c.json(
        {
          error: 'Failed to parse exec trace output',
          diagnostics: [
            {
              level: 'error',
              code: 'TRACE_JSON_INVALID',
              message: (error as Error).message,
            },
          ],
        },
        500,
      );
    }

    const graphArgs = ['flowmind', 'debug', `--run=${execId}`, '--json'];
    const graphResult = await commandRunner('lev', graphArgs, { cwd: projectRoot });

    let graph: unknown = null;
    if (graphResult.ok) {
      try {
        const parsedGraph = parseCommandJson(graphResult);
        if (hasWorkflowGraphEnvelope(parsedGraph)) {
          graph = parsedGraph;
        } else {
          diagnostics.push({
            level: 'warning',
            code: 'GRAPH_CONTRACT_INVALID',
            message: 'FlowMind debug output did not include widget.graph',
          });
        }
      } catch (error) {
        diagnostics.push({
          level: 'warning',
          code: 'GRAPH_JSON_INVALID',
          message: (error as Error).message,
        });
      }
    } else {
      diagnostics.push({
        level: 'warning',
        code: 'GRAPH_COMMAND_FAILED',
        message: errorMessage(graphResult),
      });
    }

    return c.json({
      type: 'AgentPingExecDebug',
      specVersion: '0.1.0',
      execId,
      projectRoot,
      trace,
      graph,
      commands: {
        trace: ['lev', ...traceArgs].join(' '),
        flowmind: ['lev', ...graphArgs].join(' '),
      },
      diagnostics: {
        warnings: diagnostics.map((diagnostic) => `${diagnostic.code}: ${diagnostic.message}`),
      },
    });
  });

  return app;
}
