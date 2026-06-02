export const LEV_OBSERVABILITY_PROJECTION_SCHEMA = 'lev.agentping.observability_projection.v0';

export type LevProjectionKind = 'runs' | 'traces' | 'proofs' | 'sessions';
export type LevProjectionStatus = 'healthy' | 'degraded' | 'blocked';

export interface LevDiagnostic {
  readonly level: 'warning' | 'error';
  readonly code: string;
  readonly message: string;
  readonly field?: string;
}

export interface LevEvidenceRefs {
  readonly receipt_refs: readonly string[];
  readonly gate_proof_refs: readonly string[];
  readonly trace_refs: readonly string[];
  readonly evidence_refs: readonly string[];
  readonly audit_refs?: readonly string[];
  readonly lease_refs?: readonly string[];
}

export interface LevFreshness {
  readonly generated_at: string;
  readonly max_age_ms?: number;
  readonly stale?: boolean;
}

export interface LevProjection {
  readonly type: 'AgentPingLevProjection';
  readonly schema: typeof LEV_OBSERVABILITY_PROJECTION_SCHEMA;
  readonly kind: LevProjectionKind;
  readonly id: string;
  readonly source_authority: 'graph_api_projection' | 'dashboard_local' | 'status_text' | 'provider_self_report';
  readonly projection_only: true;
  readonly operational_truth: false;
  readonly status: LevProjectionStatus;
  readonly evidence: LevEvidenceRefs;
  readonly freshness: LevFreshness;
  readonly result?: unknown;
  readonly diagnostics: readonly LevDiagnostic[];
}

export interface LevProjectionReadRequest {
  readonly kind: LevProjectionKind;
  readonly id: string;
}

export type LevProjectionReadResult =
  | { readonly ok: true; readonly projection: LevProjection }
  | {
      readonly ok: false;
      readonly status?: number;
      readonly error: string;
      readonly diagnostics: readonly LevDiagnostic[];
    };

export type LevProjectionReader = (request: LevProjectionReadRequest) => Promise<LevProjectionReadResult>;

const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const AUTHORITATIVE_SOURCE = 'graph_api_projection';

export const unavailableProjectionReader: LevProjectionReader = async () => ({
  ok: false,
  status: 503,
  error: 'Lev graph/API projection reader is not configured',
  diagnostics: [
    {
      level: 'error',
      code: 'LEV_PROJECTION_READER_UNAVAILABLE',
      message: 'AgentPing server is a projection host and cannot synthesize Lev operational truth locally.',
    },
  ],
});

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

export function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
    : [];
}

export function pushDiagnostic(
  diagnostics: LevDiagnostic[],
  code: string,
  message: string,
  field?: string,
  level: LevDiagnostic['level'] = 'error',
) {
  diagnostics.push({ level, code, message, field });
}

export function validateProjectionId(id: string): readonly LevDiagnostic[] {
  if (IDENTIFIER_PATTERN.test(id)) return [];
  return [
    {
      level: 'error',
      code: 'LEV_PROJECTION_ID_INVALID',
      message: 'Lev projection identifiers must be bounded, non-empty, and URL safe.',
      field: 'id',
    },
  ];
}

export function proofDiagnostics(
  evidence: LevEvidenceRefs,
  freshness: LevFreshness,
  now: Date,
): { readonly status: LevProjectionStatus; readonly diagnostics: readonly LevDiagnostic[] } {
  const diagnostics: LevDiagnostic[] = [];
  const requiredFields: Array<keyof Pick<LevEvidenceRefs, 'receipt_refs' | 'gate_proof_refs' | 'trace_refs' | 'evidence_refs' | 'audit_refs'>> = [
    'receipt_refs',
    'gate_proof_refs',
    'trace_refs',
    'evidence_refs',
    'audit_refs',
  ];

  for (const field of requiredFields) {
    if ((evidence[field] ?? []).length === 0) {
      pushDiagnostic(diagnostics, `LEV_${field.toUpperCase()}_MISSING`, `Lev projection requires ${field}.`, `evidence.${field}`);
    }
  }

  const generatedAt = Date.parse(freshness.generated_at);
  if (!Number.isFinite(generatedAt)) {
    pushDiagnostic(
      diagnostics,
      'LEV_FRESHNESS_GENERATED_AT_INVALID',
      'Lev projection freshness requires a valid generated_at timestamp.',
      'freshness.generated_at',
    );
  }

  if (typeof freshness.max_age_ms === 'number' && (!Number.isFinite(freshness.max_age_ms) || freshness.max_age_ms < 0)) {
    pushDiagnostic(diagnostics, 'LEV_FRESHNESS_MAX_AGE_INVALID', 'Lev projection max_age_ms must be finite and non-negative.', 'freshness.max_age_ms');
  }

  if (freshness.stale) {
    pushDiagnostic(diagnostics, 'LEV_PROOF_STALE', 'Stale proof evidence cannot support a healthy AgentPing projection.', 'freshness.stale', 'warning');
  }

  if (Number.isFinite(generatedAt) && freshness.max_age_ms !== undefined) {
    const ageMs = now.getTime() - generatedAt;
    if (ageMs < 0) {
      pushDiagnostic(diagnostics, 'LEV_FRESHNESS_FROM_FUTURE', 'Lev projection evidence generated_at cannot be later than the verifier clock.', 'freshness.generated_at');
    } else if (ageMs > freshness.max_age_ms) {
      pushDiagnostic(diagnostics, 'LEV_FRESHNESS_WINDOW_EXCEEDED', 'Lev projection evidence exceeds its freshness window.', 'freshness.max_age_ms', 'warning');
    }
  }

  const hasErrors = diagnostics.some((diagnostic) => diagnostic.level === 'error');
  if (hasErrors) return { status: 'blocked', diagnostics };
  if (diagnostics.length > 0) return { status: 'degraded', diagnostics };
  return { status: 'healthy', diagnostics };
}

export function normalizeProjection(projection: LevProjection, now: Date): LevProjection {
  const diagnostics: LevDiagnostic[] = [...projection.diagnostics];
  if (projection.source_authority !== AUTHORITATIVE_SOURCE) {
    pushDiagnostic(
      diagnostics,
      'LEV_PROJECTION_SOURCE_NOT_AUTHORITATIVE',
      'AgentPing Lev routes require graph/API projection authority, not dashboard-local or provider text state.',
      'source_authority',
    );
  }

  const proofState = proofDiagnostics(projection.evidence, projection.freshness, now);
  diagnostics.push(...proofState.diagnostics);
  const status = diagnostics.some((diagnostic) => diagnostic.level === 'error')
    ? 'blocked'
    : proofState.status === 'degraded' || projection.status === 'degraded'
      ? 'degraded'
      : projection.status;

  return {
    ...projection,
    schema: LEV_OBSERVABILITY_PROJECTION_SCHEMA,
    projection_only: true,
    operational_truth: false,
    status,
    diagnostics,
  };
}
