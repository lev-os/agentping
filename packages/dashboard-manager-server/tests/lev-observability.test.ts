import { describe, expect, it, vi } from 'vitest';
import { fileURLToPath } from 'node:url';
import { DashboardRunner } from '@lev-os/dashboard-runner';

import { createServer } from '../src/index';
import { createLevObservabilityRoutes } from '../src/routes/lev-observability';
import type { LevProjection, LevProjectionReader } from '../src/routes/lev-observability-projection';

const NOW = new Date('2026-06-01T20:30:00.000Z');
const DASHBOARD_CONFIG_PATH = fileURLToPath(new URL('../../dashboard-runner/config/dashboards.yaml', import.meta.url));

const evidence = {
  receipt_refs: ['rcpt-run-1'],
  gate_proof_refs: ['gate-proof-1'],
  trace_refs: ['trace-run-1'],
  evidence_refs: ['artifact-run-1'],
  audit_refs: ['audit-run-1'],
  lease_refs: ['lease-run-1'],
};

function projection(overrides: Partial<LevProjection> = {}): LevProjection {
  return {
    type: 'AgentPingLevProjection',
    schema: 'lev.agentping.observability_projection.v0',
    kind: 'runs',
    id: 'run-1',
    source_authority: 'graph_api_projection',
    projection_only: true,
    operational_truth: false,
    status: 'healthy',
    evidence,
    freshness: {
      generated_at: '2026-06-01T20:29:50.000Z',
      max_age_ms: 60_000,
    },
    result: { run_id: 'run-1' },
    diagnostics: [],
    ...overrides,
  };
}

function decisionBody(overrides: Record<string, unknown> = {}) {
  return {
    actor: 'jp',
    decision: 'approved',
    confirmation_token: 'confirm-secret',
    action: {
      action_id: 'action-1',
      operation: 'observability.session.inject.request',
      resource_ref: 'session://run-1',
      policy: {
        confirmation_required: true,
        gate_proof_ref: 'gate-proof-1',
        lease_refs: ['lease-run-1'],
      },
    },
    evidence,
    freshness: {
      generated_at: '2026-06-01T20:29:50.000Z',
      max_age_ms: 60_000,
    },
    ...overrides,
  };
}

describe('createLevObservabilityRoutes', () => {
  it('serves an injected Lev adapter projection through the server API', async () => {
    // Given: a server with a proof-backed Lev projection adapter.
    const projectionReader = vi.fn<LevProjectionReader>(async () => ({
      ok: true,
      projection: projection(),
    }));
    const server = createServer({
      runner: new DashboardRunner({ configPath: DASHBOARD_CONFIG_PATH }),
      enableLogger: false,
      enableWebSocket: false,
      levAdapter: { projectionReader },
    });

    // When: a consumer reads a run projection through the server mount.
    const response = await server.app.request('/api/lev/runs/run-1');
    const payload = await response.json();

    // Then: the server delegates to the injected adapter reader.
    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ id: 'run-1', kind: 'runs' });
    expect(projectionReader).toHaveBeenCalledWith({ kind: 'runs', id: 'run-1' });
  });

  it('keeps the server Lev API unavailable when no adapter is configured', async () => {
    // Given: a headless server with no Lev adapter.
    const server = createServer({
      runner: new DashboardRunner({ configPath: DASHBOARD_CONFIG_PATH }),
      enableLogger: false,
      enableWebSocket: false,
    });

    // When: a consumer reads a run projection through the server mount.
    const response = await server.app.request('/api/lev/runs/run-1');
    const payload = await response.json();

    // Then: the existing unavailable-reader response remains intact.
    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      error: 'Lev graph/API projection reader is not configured',
      diagnostics: [expect.objectContaining({ code: 'LEV_PROJECTION_READER_UNAVAILABLE' })],
    });
  });

  it('returns proof-backed graph/API projections without becoming truth', async () => {
    const projectionReader = vi.fn<LevProjectionReader>(async () => ({
      ok: true,
      projection: projection(),
    }));
    const app = createLevObservabilityRoutes({ projectionReader, now: () => NOW });

    const response = await app.request('/runs/run-1');
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      type: 'AgentPingLevProjection',
      schema: 'lev.agentping.observability_projection.v0',
      source_authority: 'graph_api_projection',
      projection_only: true,
      operational_truth: false,
      status: 'healthy',
      evidence,
      result: { run_id: 'run-1' },
      diagnostics: [],
    });
    expect(projectionReader).toHaveBeenCalledWith({ kind: 'runs', id: 'run-1' });
  });

  it('blocks dashboard-local or proofless projections', async () => {
    const projectionReader = vi.fn<LevProjectionReader>(async () => ({
      ok: true,
      projection: projection({
        source_authority: 'dashboard_local',
        evidence: {
          receipt_refs: [],
          gate_proof_refs: [],
          trace_refs: [],
          evidence_refs: [],
        },
      }),
    }));
    const app = createLevObservabilityRoutes({ projectionReader, now: () => NOW });

    const response = await app.request('/proofs/rcpt-run-1');
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.status).toBe('blocked');
    expect(payload.diagnostics.map((diagnostic: { code: string }) => diagnostic.code)).toEqual(
      expect.arrayContaining([
        'LEV_PROJECTION_SOURCE_NOT_AUTHORITATIVE',
        'LEV_RECEIPT_REFS_MISSING',
        'LEV_GATE_PROOF_REFS_MISSING',
        'LEV_TRACE_REFS_MISSING',
        'LEV_EVIDENCE_REFS_MISSING',
      ]),
    );
  });

  it('blocks projection status when audit refs are missing', async () => {
    const projectionReader = vi.fn<LevProjectionReader>(async () => ({
      ok: true,
      projection: projection({
        evidence: {
          receipt_refs: ['rcpt-run-1'],
          gate_proof_refs: ['gate-proof-1'],
          trace_refs: ['trace-run-1'],
          evidence_refs: ['artifact-run-1'],
        },
      }),
    }));
    const app = createLevObservabilityRoutes({ projectionReader, now: () => NOW });

    const response = await app.request('/runs/run-1');
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.status).toBe('blocked');
    expect(payload.diagnostics.map((diagnostic: { code: string }) => diagnostic.code)).toContain(
      'LEV_AUDIT_REFS_MISSING',
    );
  });

  it('fails closed when no Lev graph/API projection reader is configured', async () => {
    const app = createLevObservabilityRoutes({ now: () => NOW });

    const response = await app.request('/runs/run-1');
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toBe('Lev graph/API projection reader is not configured');
    expect(payload.diagnostics[0].code).toBe('LEV_PROJECTION_READER_UNAVAILABLE');
  });

  it('emits an append-only approved HITL decision receipt without echoing the token', async () => {
    const app = createLevObservabilityRoutes({ now: () => NOW });
    const maliciousLabel = 'Approve && rm -rf /';

    const response = await app.request('/hitl/action-1/approve', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(decisionBody({
        action: {
          action_id: 'action-1',
          operation: 'observability.session.inject.request',
          resource_ref: 'session://run-1',
          label: maliciousLabel,
          policy: {
            confirmation_required: true,
            gate_proof_ref: 'gate-proof-1',
            lease_refs: ['lease-run-1'],
          },
        },
      })),
    });
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toMatchObject({
      type: 'AgentPingHITLDecisionReceipt',
      schema: 'lev.agentping.hitl_decision_receipt.v0',
      action_id: 'action-1',
      decision: 'approved',
      actor: 'jp',
      source_authority: 'receipts_traces_proofs',
      projection_only: true,
      operational_truth: false,
      append_only: true,
      write_performed: false,
      proof_refs: ['gate-proof-1'],
      trace_refs: ['trace-run-1'],
      evidence_refs: ['artifact-run-1'],
      audit_refs: ['audit-run-1'],
      lease_refs: ['lease-run-1'],
    });
    expect(payload.confirmation_token_ref).toMatch(/^sha256:/);
    expect(JSON.stringify(payload)).not.toContain('confirm-secret');
    expect(JSON.stringify(payload)).not.toContain(maliciousLabel);
    expect(JSON.stringify(payload)).not.toContain('rm -rf');
  });

  it('blocks approved decisions without confirmation tokens', async () => {
    const app = createLevObservabilityRoutes({ now: () => NOW });

    const response = await app.request('/hitl/action-1/approve', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(decisionBody({ confirmation_token: undefined })),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.diagnostics.map((diagnostic: { code: string }) => diagnostic.code)).toContain(
      'LEV_HITL_CONFIRMATION_TOKEN_MISSING',
    );
  });

  it('blocks stale proof decisions', async () => {
    const app = createLevObservabilityRoutes({ now: () => NOW });

    const response = await app.request('/hitl/action-1/approve', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(decisionBody({
        freshness: {
          generated_at: '2026-06-01T20:00:00.000Z',
          max_age_ms: 60_000,
        },
      })),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.diagnostics.map((diagnostic: { code: string }) => diagnostic.code)).toEqual(
      expect.arrayContaining(['LEV_FRESHNESS_WINDOW_EXCEEDED', 'LEV_HITL_PROOF_NOT_FRESH']),
    );
  });

  it('blocks HITL decisions without audit refs', async () => {
    const app = createLevObservabilityRoutes({ now: () => NOW });

    const response = await app.request('/hitl/action-1/approve', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(decisionBody({
        evidence: {
          receipt_refs: ['rcpt-run-1'],
          gate_proof_refs: ['gate-proof-1'],
          trace_refs: ['trace-run-1'],
          evidence_refs: ['artifact-run-1'],
          lease_refs: ['lease-run-1'],
        },
      })),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.diagnostics.map((diagnostic: { code: string }) => diagnostic.code)).toContain(
      'LEV_HITL_AUDIT_REFS_MISSING',
    );
  });

  it('blocks denied decision replay as approval', async () => {
    const app = createLevObservabilityRoutes({ now: () => NOW });

    const response = await app.request('/hitl/action-1/deny', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(decisionBody({ decision: 'approved', confirmation_token: undefined })),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.diagnostics.map((diagnostic: { code: string }) => diagnostic.code)).toContain(
      'LEV_HITL_DECISION_MISMATCH',
    );
  });
});
