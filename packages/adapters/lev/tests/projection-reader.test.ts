import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createFsProjectionReader } from '../src/projection-reader.js';

const fixtureProjection = {
  type: 'AgentPingLevProjection',
  schema: 'lev.agentping.observability_projection.v0',
  kind: 'runs',
  id: 'run-1',
  source_authority: 'graph_api_projection',
  projection_only: true,
  operational_truth: false,
  status: 'healthy',
  evidence: {
    receipt_refs: ['rcpt-run-1'],
    gate_proof_refs: ['gate-proof-run-1'],
    trace_refs: ['trace-run-1'],
    evidence_refs: ['evidence-run-1'],
  },
  freshness: { generated_at: '2026-06-01T20:00:00.000Z' },
  diagnostics: [],
};

async function withTempLevRoot(run: (levRoot: string) => Promise<void>): Promise<void> {
  const levRoot = await mkdtemp(join(tmpdir(), 'agentping-lev-reader-'));
  try {
    await run(levRoot);
  } finally {
    await rm(levRoot, { recursive: true, force: true });
  }
}

async function writeProjection(levRoot: string, content: string): Promise<void> {
  const directory = join(levRoot, '.lev', 'observability', 'projections', 'runs');
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'run-1.json'), content, 'utf8');
}

describe('createFsProjectionReader', () => {
  it('reads a matching projection document from the Lev observability directory', async () => {
    await withTempLevRoot(async (levRoot) => {
      // Given: a matching projection fixture in the established Lev location.
      await writeProjection(levRoot, JSON.stringify(fixtureProjection));
      const reader = createFsProjectionReader({ levRoot });

      // When: the run projection is requested.
      const result = await reader({ kind: 'runs', id: 'run-1' });

      // Then: the projection is returned unchanged for route normalization.
      expect(result).toEqual({ ok: true, projection: fixtureProjection });
    });
  });

  it('returns a not-found diagnostic when the projection file does not exist', async () => {
    await withTempLevRoot(async (levRoot) => {
      // Given: a Lev root without the requested projection file.
      const reader = createFsProjectionReader({ levRoot });

      // When: the run projection is requested.
      const result = await reader({ kind: 'runs', id: 'run-1' });

      // Then: the reader returns the filesystem not-found contract.
      expect(result).toMatchObject({
        ok: false,
        status: 404,
        diagnostics: [expect.objectContaining({ level: 'error', code: 'LEV_PROJECTION_NOT_FOUND' })],
      });
    });
  });

  it('returns an invalid diagnostic when projection JSON cannot be parsed', async () => {
    await withTempLevRoot(async (levRoot) => {
      // Given: a projection file containing malformed JSON.
      await writeProjection(levRoot, '{not-json');
      const reader = createFsProjectionReader({ levRoot });

      // When: the run projection is requested.
      const result = await reader({ kind: 'runs', id: 'run-1' });

      // Then: malformed disk input is rejected before it reaches the route.
      expect(result).toMatchObject({
        ok: false,
        status: 422,
        diagnostics: [expect.objectContaining({ level: 'error', code: 'LEV_PROJECTION_INVALID' })],
      });
    });
  });

  it('rejects traversal identifiers before constructing a projection path', async () => {
    await withTempLevRoot(async (levRoot) => {
      // Given: a filesystem-backed reader.
      const reader = createFsProjectionReader({ levRoot });

      // When: a traversal-shaped projection identifier is requested.
      const result = await reader({ kind: 'runs', id: '../outside' });

      // Then: the adapter rejects the request without reading outside the Lev root.
      expect(result).toMatchObject({
        ok: false,
        status: 422,
        diagnostics: [expect.objectContaining({ level: 'error', code: 'LEV_PROJECTION_ID_INVALID' })],
      });
    });
  });
});
