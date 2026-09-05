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

export interface LevAdapter {
  readonly projectionReader?: LevProjectionReader;
}
