/**
 * Component Registry Routes
 *
 * Serves the UI component manifest (_manifest.json) for the
 * Component Registry dashboard page.
 */

import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
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

function resolveManifestPath(): string {
  // CWD when launched is community/agentping/
  // The manifest is at packages/ui/src/components/migrations/_manifest.json
  return path.resolve(
    process.cwd(),
    'packages', 'ui', 'src', 'components', 'migrations', '_manifest.json',
  );
}

async function loadManifest(): Promise<Manifest> {
  const filePath = resolveManifestPath();
  if (!existsSync(filePath)) {
    throw new Error(`Manifest not found at ${filePath}`);
  }
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content) as Manifest;
}

export function createComponentsRoutes() {
  const app = new Hono();

  // GET /api/components — full manifest
  app.get('/', async (c) => {
    try {
      const manifest = await loadManifest();
      return c.json(manifest);
    } catch (error) {
      console.error('[components] error:', error);
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // GET /api/components/conflicts — unresolved conflict components
  app.get('/conflicts', async (c) => {
    try {
      const manifest = await loadManifest();
      const conflicts = manifest.components.filter(
        (comp) => comp.id.includes('conflict') && !comp.reviewStatus,
      );
      return c.json({ count: conflicts.length, components: conflicts });
    } catch (error) {
      console.error('[components/conflicts] error:', error);
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // GET /api/components/stats — aggregated stats
  app.get('/stats', async (c) => {
    try {
      const manifest = await loadManifest();

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
      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  return app;
}
