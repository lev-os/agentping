/**
 * Component Registry Routes
 *
 * Serves the UI component manifest (_manifest.json) for the
 * Component Registry dashboard page.
 */

import { Hono } from 'hono';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as path from 'node:path';

interface ManifestComponent {
  id: string;
  name: string;
  family: string;
  domain: string;
  capabilities: string[];
  classification: 'REAL' | 'ALIAS' | 'SHELL' | 'HOLLOW';
  levNowElement: string | null;
  origin: string;
  migrationStatus: string;
  source: string;
  loc: number;
  imports: number;
  hooks: number;
  propCount: number;
  lanes: string[];
  beadId: string;
  markers: string[];
  reviewStatus?: string;
  humanDecision?: string;
  canonical?: string;
}

interface Manifest {
  version: number;
  generated: string;
  total: number;
  byClassification: Record<string, number>;
  byFamily: Record<string, number>;
  byLevNowElement: Record<string, number>;
  components: ManifestComponent[];
}

export const CATALOG_COMPONENTS_DIR = path.resolve(
  process.cwd(),
  'packages', 'ui', 'src', 'components', 'catalog',
);

export interface ComponentsRoutesConfig {
  catalogDir?: string;
  fileReader?: (filePath: string, encoding: BufferEncoding) => Promise<string>;
}

function catalogPaths(catalogDir: string) {
  return {
    dir: catalogDir,
    manifest: path.join(catalogDir, '_manifest.json'),
    clusters: path.join(catalogDir, 'clusters.json'),
    decisionLog: path.join(catalogDir, 'decision-log.jsonl'),
    sidecar: (componentId: string) => path.join(catalogDir, `${componentId}.manifest.json`),
  };
}

class CatalogFileMissingError extends Error {
  readonly path: string;
  constructor(kind: string, filePath: string) {
    super(`${kind} not found`);
    this.name = 'CatalogFileMissingError';
    this.path = filePath;
  }
}

interface Cluster {
  id: string;
  key: string;
  reason: string;
  levNowElement: string | null;
  family: string | null;
  classification: string | null;
  members: string[];
  count: number;
  origins: Record<string, number>;
}

interface ClustersFile {
  generated: string;
  total_components: number;
  total_clusters: number;
  multi_member_clusters: number;
  singleton_clusters: number;
  clusters: Cluster[];
}

async function loadClusters(paths: ReturnType<typeof catalogPaths>, fileReader: (p: string, enc: BufferEncoding) => Promise<string>): Promise<ClustersFile> {
  const filePath = paths.clusters;
  if (!existsSync(filePath)) {
    throw new CatalogFileMissingError('Clusters file', filePath);
  }
  let content: string;
  try {
    content = await fileReader(filePath, 'utf-8');
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') throw new CatalogFileMissingError('Clusters file', filePath);
    throw err;
  }
  return JSON.parse(content) as ClustersFile;
}

const DECISION_TO_REVIEW_STATUS: Record<string, string> = {
  keep: 'reviewed',
  merge: 'absorbed',
  deprecate: 'deprecated',
};

async function loadManifest(paths: ReturnType<typeof catalogPaths>, fileReader: (p: string, enc: BufferEncoding) => Promise<string>): Promise<Manifest> {
  const filePath = paths.manifest;
  if (!existsSync(filePath)) {
    throw new CatalogFileMissingError('Manifest', filePath);
  }
  let content: string;
  try {
    content = await fileReader(filePath, 'utf-8');
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') throw new CatalogFileMissingError('Manifest', filePath);
    throw err;
  }
  return JSON.parse(content) as Manifest;
}

function catalogMissingResponse(c: { json: (body: unknown, status: number) => Response }, error: unknown) {
  if (error instanceof CatalogFileMissingError) {
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

export function createComponentsRoutes(config: ComponentsRoutesConfig = {}) {
  const app = new Hono();
  const paths = catalogPaths(config.catalogDir ?? CATALOG_COMPONENTS_DIR);
  const fileReader = config.fileReader ?? ((p: string, enc: BufferEncoding) => readFile(p, enc));

  // GET /api/components — full manifest
  app.get('/', async (c) => {
    try {
      const manifest = await loadManifest(paths, fileReader);
      return c.json(manifest);
    } catch (error) {
      console.error('[components] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // GET /api/components/conflicts — unresolved conflict components
  app.get('/conflicts', async (c) => {
    try {
      const manifest = await loadManifest(paths, fileReader);
      const conflicts = manifest.components.filter(
        (comp) => comp.id.includes('conflict') && !comp.reviewStatus,
      );
      return c.json({ count: conflicts.length, components: conflicts });
    } catch (error) {
      console.error('[components/conflicts] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // GET /api/components/stats — aggregated stats
  app.get('/stats', async (c) => {
    try {
      const manifest = await loadManifest(paths, fileReader);

      const byClassification: Record<string, number> = {};
      const byFamily: Record<string, number> = {};
      const byLevNowElement: Record<string, number> = {};
      let conflictTotal = 0;
      let conflictResolved = 0;
      let conflictUnresolved = 0;
      let withLevNowMapping = 0;

      for (const comp of manifest.components) {
        // Classification
        byClassification[comp.classification] =
          (byClassification[comp.classification] || 0) + 1;

        // Family
        byFamily[comp.family] = (byFamily[comp.family] || 0) + 1;

        // lev-now element
        if (comp.levNowElement) {
          byLevNowElement[comp.levNowElement] =
            (byLevNowElement[comp.levNowElement] || 0) + 1;
          withLevNowMapping++;
        }

        // Conflicts
        if (comp.id.includes('conflict')) {
          conflictTotal++;
          if (comp.reviewStatus) {
            conflictResolved++;
          } else {
            conflictUnresolved++;
          }
        }
      }

      return c.json({
        total: manifest.total,
        generated: manifest.generated,
        byClassification,
        byFamily,
        byLevNowElement,
        withLevNowMapping,
        conflicts: {
          total: conflictTotal,
          resolved: conflictResolved,
          unresolved: conflictUnresolved,
        },
      });
    } catch (error) {
      console.error('[components/stats] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // GET /api/components/queue — components awaiting human review
  app.get('/queue', async (c) => {
    try {
      const manifest = await loadManifest(paths, fileReader);
      const pending = manifest.components.filter(
        (comp) => !comp.humanDecision && comp.reviewStatus !== 'reviewed' && comp.reviewStatus !== 'absorbed' && comp.reviewStatus !== 'deprecated',
      );
      return c.json({
        total_pending: pending.length,
        total_components: manifest.total,
        components: pending,
      });
    } catch (error) {
      console.error('[components/queue] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // POST /api/components/:id/decision — record human review decision
  app.post('/:id/decision', async (c) => {
    try {
      const componentId = c.req.param('id');
      const body = await c.req.json<{ decision?: string; notes?: string }>();
      const decision = body.decision;

      if (!decision || !DECISION_TO_REVIEW_STATUS[decision]) {
        return c.json(
          { error: `Invalid decision "${decision}". Must be one of: ${Object.keys(DECISION_TO_REVIEW_STATUS).join(', ')}` },
          400,
        );
      }

      const sidecarPath = paths.sidecar(componentId);
      if (!existsSync(sidecarPath)) {
        return c.json({ error: `Sidecar not found for component "${componentId}" at ${sidecarPath}` }, 404);
      }

      const sidecarRaw = await readFile(sidecarPath, 'utf-8');
      const sidecar = JSON.parse(sidecarRaw) as Record<string, unknown>;

      sidecar.humanDecision = decision;
      sidecar.reviewStatus = DECISION_TO_REVIEW_STATUS[decision];
      sidecar.reviewedAt = new Date().toISOString();
      if (body.notes) sidecar.reviewNotes = body.notes;

      await writeFile(sidecarPath, JSON.stringify(sidecar, null, 2) + '\n', 'utf-8');

      return c.json({
        id: componentId,
        humanDecision: decision,
        reviewStatus: DECISION_TO_REVIEW_STATUS[decision],
        reviewedAt: sidecar.reviewedAt,
        sidecarPath,
      });
    } catch (error) {
      console.error('[components/:id/decision] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // ==========================================================================
  // Cluster routes (stage 3 batch review)
  // ==========================================================================

  // GET /api/components/clusters — full cluster list
  app.get('/clusters', async (c) => {
    try {
      const clusters = await loadClusters(paths, fileReader);
      return c.json(clusters);
    } catch (error) {
      console.error('[components/clusters] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // GET /api/components/clusters/:id — cluster + full manifest entries for each member
  app.get('/clusters/:id', async (c) => {
    try {
      const clusterId = c.req.param('id');
      const [clusters, manifest] = await Promise.all([
        loadClusters(paths, fileReader),
        loadManifest(paths, fileReader),
      ]);
      const cluster = clusters.clusters.find((cl) => cl.id === clusterId);
      if (!cluster) {
        return c.json({ error: `Cluster "${clusterId}" not found` }, 404);
      }

      const memberById = new Map(manifest.components.map((mc) => [mc.id, mc]));
      const memberEntries = cluster.members.map((mid) => {
        const entry = memberById.get(mid);
        return entry ?? { id: mid, _missing: true };
      });

      return c.json({
        cluster,
        members: memberEntries,
      });
    } catch (error) {
      console.error('[components/clusters/:id] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // POST /api/components/clusters/:id/decision — record batch review decision
  app.post('/clusters/:id/decision', async (c) => {
    try {
      const clusterId = c.req.param('id');
      const body = await c.req.json<{
        canonical_id?: string;
        rejected_ids?: string[];
        merge_into?: Record<string, string>;
        reason?: string;
      }>();

      const canonicalId = body.canonical_id;
      const rejectedIds = body.rejected_ids ?? [];
      const mergeInto = body.merge_into ?? {};
      const reason = body.reason ?? '';

      if (!canonicalId || typeof canonicalId !== 'string') {
        return c.json({ error: 'canonical_id is required' }, 400);
      }

      const clusters = await loadClusters(paths, fileReader);
      const cluster = clusters.clusters.find((cl) => cl.id === clusterId);
      if (!cluster) {
        return c.json({ error: `Cluster "${clusterId}" not found` }, 404);
      }

      if (!cluster.members.includes(canonicalId)) {
        return c.json(
          { error: `canonical_id "${canonicalId}" is not a member of cluster "${clusterId}"` },
          400,
        );
      }

      const reviewedAt = new Date().toISOString();
      const updates: Array<{ id: string; sidecarPath: string; decision: string; reviewStatus: string }> = [];

      // Helper: load/update one sidecar
      const updateSidecar = async (
        memberId: string,
        fields: Record<string, unknown>,
      ) => {
        const sidecarPath = paths.sidecar(memberId);
        if (!existsSync(sidecarPath)) {
          console.warn(`[components/clusters/:id/decision] sidecar missing for ${memberId}`);
          return;
        }
        const raw = await readFile(sidecarPath, 'utf-8');
        const sidecar = JSON.parse(raw) as Record<string, unknown>;
        Object.assign(sidecar, fields, { reviewedAt });
        if (reason) sidecar.reviewNotes = reason;
        await writeFile(sidecarPath, JSON.stringify(sidecar, null, 2) + '\n', 'utf-8');
      };

      // Canonical
      await updateSidecar(canonicalId, {
        humanDecision: 'keep',
        reviewStatus: 'reviewed',
        canonical: true,
      });
      updates.push({
        id: canonicalId,
        sidecarPath: paths.sidecar(canonicalId),
        decision: 'keep',
        reviewStatus: 'reviewed',
      });

      // Rejected (not merged_into) → deprecate
      for (const rid of rejectedIds) {
        if (rid === canonicalId) continue;
        if (mergeInto[rid]) continue; // handled separately
        await updateSidecar(rid, {
          humanDecision: 'deprecate',
          reviewStatus: 'deprecated',
        });
        updates.push({
          id: rid,
          sidecarPath: paths.sidecar(rid),
          decision: 'deprecate',
          reviewStatus: 'deprecated',
        });
      }

      // Merged_into map: memberId → target (usually canonicalId)
      for (const [mid, target] of Object.entries(mergeInto)) {
        if (mid === canonicalId) continue;
        await updateSidecar(mid, {
          humanDecision: 'merge',
          reviewStatus: 'absorbed',
          mergedInto: target,
        });
        updates.push({
          id: mid,
          sidecarPath: paths.sidecar(mid),
          decision: 'merge',
          reviewStatus: 'absorbed',
        });
      }

      // Append to decision-log.jsonl
      const logLine = JSON.stringify({
        cluster_id: clusterId,
        cluster_key: cluster.key,
        canonical_id: canonicalId,
        rejected_ids: rejectedIds,
        merge_into: mergeInto,
        reason,
        reviewedAt,
      }) + '\n';
      await appendFile(paths.decisionLog, logLine, 'utf-8');

      return c.json({
        cluster_id: clusterId,
        canonical_id: canonicalId,
        reviewedAt,
        updates,
      });
    } catch (error) {
      console.error('[components/clusters/:id/decision] error:', error);
      const missing = catalogMissingResponse(c, error);
      if (missing) return missing;
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  return app;
}
