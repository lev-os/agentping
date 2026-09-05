import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { Hono } from 'hono';

const SCORECARD_CACHE_PATH = ['lev', 'dashboard', 'parity-scorecard.json'] as const;
const SCORECARD_STALE_MS = 24 * 60 * 60 * 1000;

type FileReader = (filePath: string, encoding: BufferEncoding) => Promise<string>;

export interface ParityRoutesConfig {
  readonly cacheHome?: string;
  readonly fileReader?: FileReader;
  readonly now?: () => Date;
}

type ParityScorecard = Readonly<Record<string, unknown>> & {
  readonly schema_version: number;
  readonly generated_at: string;
};

class ParityScorecardMissingError extends Error {
  readonly path: string;

  constructor(filePath: string) {
    super('Parity scorecard not found');
    this.name = 'ParityScorecardMissingError';
    this.path = filePath;
  }
}

function defaultCacheHome(): string {
  const xdgCacheHome = process.env.XDG_CACHE_HOME;
  return xdgCacheHome && xdgCacheHome.trim() ? xdgCacheHome : join(homedir(), '.cache');
}

function scorecardPath(cacheHome?: string): string {
  return join(cacheHome ?? defaultCacheHome(), ...SCORECARD_CACHE_PATH);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isErrnoCode(error: unknown, code: string): boolean {
  return error instanceof Error && Reflect.get(error, 'code') === code;
}

function isParityScorecard(value: unknown): value is ParityScorecard {
  return (
    isRecord(value) &&
    value.schema_version === 1 &&
    typeof value.generated_at === 'string' &&
    value.generated_at.trim().length > 0
  );
}

async function loadScorecard(filePath: string, fileReader: FileReader): Promise<ParityScorecard> {
  if (!existsSync(filePath)) {
    throw new ParityScorecardMissingError(filePath);
  }

  let content: string;
  try {
    content = await fileReader(filePath, 'utf-8');
  } catch (error) {
    if (isErrnoCode(error, 'ENOENT')) throw new ParityScorecardMissingError(filePath);
    throw error;
  }

  const parsed: unknown = JSON.parse(content);
  if (!isParityScorecard(parsed)) {
    throw new Error('Parity scorecard contract invalid');
  }
  return parsed;
}

function isStale(generatedAt: string, now: Date): boolean {
  const generatedAtMs = Date.parse(generatedAt);
  return !Number.isFinite(generatedAtMs) || now.getTime() - generatedAtMs > SCORECARD_STALE_MS;
}

function missingResponse(c: { json: (body: unknown, status: number) => Response }, error: unknown) {
  if (error instanceof ParityScorecardMissingError) {
    return c.json(
      {
        error: error.message,
        hint: error.path,
      },
      503,
    );
  }
  return null;
}

export function createParityRoutes(config: ParityRoutesConfig = {}) {
  const app = new Hono();
  const fileReader = config.fileReader ?? ((p: string, enc: BufferEncoding) => readFile(p, enc));
  const now = config.now ?? (() => new Date());

  app.get('/scorecard', async (c) => {
    const filePath = scorecardPath(config.cacheHome);
    try {
      const scorecard = await loadScorecard(filePath, fileReader);
      return c.json({
        ...scorecard,
        stale: isStale(scorecard.generated_at, now()),
      });
    } catch (error) {
      console.error('[parity/scorecard] error:', error);
      const missing = missingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: error instanceof Error ? error.message : 'Internal server error' }, 500);
    }
  });

  return app;
}
