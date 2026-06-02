import { Hono } from 'hono';
import { buildDecisionReceipt, decisionRouteName } from './lev-hitl-decision.js';
import {
  normalizeProjection,
  unavailableProjectionReader,
  validateProjectionId,
  type LevProjectionKind,
  type LevProjectionReader,
} from './lev-observability-projection.js';

export interface LevObservabilityRoutesConfig {
  readonly projectionReader?: LevProjectionReader;
  readonly now?: () => Date;
}

async function readProjectionRoute(
  c: { json: (value: unknown, status?: number) => Response },
  reader: LevProjectionReader,
  now: Date,
  kind: LevProjectionKind,
  id: string,
) {
  const idDiagnostics = validateProjectionId(id);
  if (idDiagnostics.length > 0) {
    return c.json({ error: 'Invalid Lev projection id', diagnostics: idDiagnostics }, 400);
  }

  const result = await reader({ kind, id });
  if (!result.ok) {
    return c.json({ error: result.error, diagnostics: result.diagnostics }, result.status ?? 503);
  }

  return c.json(normalizeProjection(result.projection, now));
}

export function createLevObservabilityRoutes(config: LevObservabilityRoutesConfig = {}) {
  const app = new Hono();
  const projectionReader = config.projectionReader ?? unavailableProjectionReader;
  const now = () => config.now?.() ?? new Date();

  app.get('/runs/:id', (c) => readProjectionRoute(c, projectionReader, now(), 'runs', c.req.param('id')));
  app.get('/traces/:id', (c) => readProjectionRoute(c, projectionReader, now(), 'traces', c.req.param('id')));
  app.get('/proofs/:id', (c) => readProjectionRoute(c, projectionReader, now(), 'proofs', c.req.param('id')));
  app.get('/sessions/:id', (c) => readProjectionRoute(c, projectionReader, now(), 'sessions', c.req.param('id')));

  for (const decision of ['approved', 'denied'] as const) {
    app.post(`/hitl/:actionId/${decisionRouteName(decision)}`, async (c) => {
      const actionId = c.req.param('actionId');
      const idDiagnostics = validateProjectionId(actionId);
      if (idDiagnostics.length > 0) {
        return c.json({ error: 'Invalid HITL action id', diagnostics: idDiagnostics }, 400);
      }

      const body = await c.req.json().catch(() => ({}));
      const receipt = buildDecisionReceipt(actionId, decision, body, now());
      if (!receipt.ok) {
        return c.json({ error: 'HITL decision blocked', diagnostics: receipt.diagnostics }, 400);
      }

      return c.json(receipt.receipt, 201);
    });
  }

  return app;
}
