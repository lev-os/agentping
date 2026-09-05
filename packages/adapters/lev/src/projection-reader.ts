import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  LEV_OBSERVABILITY_PROJECTION_SCHEMA,
  type LevDiagnostic,
  type LevProjection,
  type LevProjectionReadRequest,
  type LevProjectionReadResult,
  type LevProjectionReader,
} from './contract.js';

// The host-side projection writer does not exist yet; this reader defines its filesystem location contract.

function diagnostic(code: string, message: string): LevDiagnostic {
  return { level: 'error', code, message };
}

function failedRead(status: number, error: string, code: string, message: string): LevProjectionReadResult {
  return { ok: false, status, error, diagnostics: [diagnostic(code, message)] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isDiagnostic(value: unknown): value is LevDiagnostic {
  if (!isRecord(value)) return false;
  return (
    (value.level === 'warning' || value.level === 'error')
    && typeof value.code === 'string'
    && typeof value.message === 'string'
    && (value.field === undefined || typeof value.field === 'string')
  );
}

function isEvidence(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isStringArray(value.receipt_refs)
    && isStringArray(value.gate_proof_refs)
    && isStringArray(value.trace_refs)
    && isStringArray(value.evidence_refs)
    && (value.audit_refs === undefined || isStringArray(value.audit_refs))
    && (value.lease_refs === undefined || isStringArray(value.lease_refs))
  );
}

function isFreshness(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.generated_at === 'string'
    && (value.max_age_ms === undefined || typeof value.max_age_ms === 'number')
    && (value.stale === undefined || typeof value.stale === 'boolean')
  );
}

function isSourceAuthority(value: unknown): value is LevProjection['source_authority'] {
  return (
    value === 'graph_api_projection'
    || value === 'dashboard_local'
    || value === 'status_text'
    || value === 'provider_self_report'
  );
}

function isProjectionStatus(value: unknown): value is LevProjection['status'] {
  return value === 'healthy' || value === 'degraded' || value === 'blocked';
}

function isProjectionDocument(value: unknown, request: LevProjectionReadRequest): value is LevProjection {
  if (!isRecord(value)) return false;
  return (
    value.type === 'AgentPingLevProjection'
    && value.schema === LEV_OBSERVABILITY_PROJECTION_SCHEMA
    && value.kind === request.kind
    && value.id === request.id
    && isSourceAuthority(value.source_authority)
    && value.projection_only === true
    && value.operational_truth === false
    && isProjectionStatus(value.status)
    && isEvidence(value.evidence)
    && isFreshness(value.freshness)
    && Array.isArray(value.diagnostics)
    && value.diagnostics.every(isDiagnostic)
  );
}

function isSafeProjectionId(id: string): boolean {
  return id.length > 0 && !id.includes('..') && !id.includes('/') && !id.includes('\\');
}

function errorCode(error: unknown): string | undefined {
  if (error instanceof Error && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return undefined;
}

export function createFsProjectionReader(opts: { readonly levRoot: string }): LevProjectionReader {
  return async (request) => {
    if (!isSafeProjectionId(request.id)) {
      return failedRead(
        422,
        'Lev projection id is invalid',
        'LEV_PROJECTION_ID_INVALID',
        'Lev projection identifiers cannot contain path separators or traversal segments.',
      );
    }

    const projectionPath = join(
      opts.levRoot,
      '.lev',
      'observability',
      'projections',
      request.kind,
      `${request.id}.json`,
    );

    let content: string;
    try {
      content = await readFile(projectionPath, 'utf8');
    } catch (error) {
      if (errorCode(error) === 'ENOENT') {
        return failedRead(
          404,
          `Lev projection ${request.kind}/${request.id} was not found`,
          'LEV_PROJECTION_NOT_FOUND',
          `No Lev ${request.kind} projection exists for ${request.id}.`,
        );
      }
      return failedRead(
        503,
        `Lev projection ${request.kind}/${request.id} could not be read`,
        'LEV_PROJECTION_READ_FAILED',
        `Unable to read the Lev ${request.kind} projection for ${request.id}.`,
      );
    }

    let document: unknown;
    try {
      document = JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return failedRead(
          422,
          `Lev projection ${request.kind}/${request.id} is invalid`,
          'LEV_PROJECTION_INVALID',
          `Lev ${request.kind} projection ${request.id} contains invalid JSON.`,
        );
      }
      throw error;
    }

    if (!isProjectionDocument(document, request)) {
      return failedRead(
        422,
        `Lev projection ${request.kind}/${request.id} is invalid`,
        'LEV_PROJECTION_INVALID',
        `Lev ${request.kind} projection ${request.id} does not match the projection contract.`,
      );
    }

    return { ok: true, projection: document };
  };
}
