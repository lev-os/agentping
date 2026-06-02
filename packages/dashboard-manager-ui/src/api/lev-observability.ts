const API_BASE = "/api";

export type LevProjectionKind = "runs" | "traces" | "proofs" | "sessions";
export type LevProofStatus = "healthy" | "degraded" | "blocked";
export type LevSourceAuthority = "graph_api_projection" | "dashboard_local" | "status_text" | "provider_self_report";
export type HITLEnvelopeDecision = "approved" | "denied";
export type HITLRecordedDecision = HITLEnvelopeDecision | "deferred" | "cancelled" | "expired";

export interface LevDiagnostic {
  level: "warning" | "error";
  code: string;
  message: string;
  field?: string;
}

export interface LevEvidenceRefs {
  receipt_refs: string[];
  gate_proof_refs: string[];
  trace_refs: string[];
  evidence_refs: string[];
  audit_refs?: string[];
  lease_refs?: string[];
}

export interface LevFreshness {
  generated_at: string;
  max_age_ms?: number;
  stale?: boolean;
}

export interface LevProjection {
  type: "AgentPingLevProjection";
  schema: "lev.agentping.observability_projection.v0";
  kind: LevProjectionKind;
  id: string;
  source_authority: LevSourceAuthority;
  projection_only: true;
  operational_truth: false;
  status: LevProofStatus;
  evidence: LevEvidenceRefs;
  freshness: LevFreshness;
  result?: unknown;
  diagnostics: LevDiagnostic[];
}

export interface HITLActionPolicy {
  confirmation_required: boolean;
  gate_proof_ref?: string;
  lease_refs: string[];
}

export interface HITLDecisionView {
  decision_receipt_id: string;
  action_id: string;
  decision: HITLRecordedDecision;
  receipt_refs: string[];
  proof_refs: string[];
  trace_refs: string[];
  evidence_refs: string[];
  audit_refs: string[];
}

export interface HITLActionView {
  action_id: string;
  operation: string;
  resource_ref?: string;
  label?: string;
  policy: HITLActionPolicy;
  evidence: LevEvidenceRefs;
  freshness: LevFreshness;
  source_authority?: LevSourceAuthority;
  decision?: HITLDecisionView;
}

export interface HITLActionState {
  status: LevProofStatus;
  reason: string;
  canApprove: boolean;
  canDeny: boolean;
  receiptRefs: string[];
  proofRefs: string[];
  traceRefs: string[];
  evidenceRefs: string[];
  auditRefs: string[];
  leaseRefs: string[];
  diagnostics: LevDiagnostic[];
}

export interface HITLDecisionReceipt {
  type: "AgentPingHITLDecisionReceipt";
  schema: "lev.agentping.hitl_decision_receipt.v0";
  decision_receipt_id: string;
  decision_receipt_ref: string;
  action_id: string;
  operation?: string;
  resource_ref?: string;
  decision: HITLEnvelopeDecision;
  actor: string;
  decided_at: string;
  source_authority: "receipts_traces_proofs";
  projection_only: true;
  operational_truth: false;
  append_only: true;
  write_performed: false;
  confirmation_token_ref?: string;
  receipt_refs: string[];
  proof_refs: string[];
  trace_refs: string[];
  evidence_refs: string[];
  audit_refs: string[];
  lease_refs: string[];
  diagnostics: LevDiagnostic[];
}

export interface HITLDecisionInput {
  actor: string;
  decision: HITLEnvelopeDecision;
  confirmation_token?: string;
}

export type HITLDecisionSubmitResult =
  | { ok: true; receipt: HITLDecisionReceipt }
  | { ok: false; status: "blocked"; diagnostics: LevDiagnostic[] };

export interface ProofBackedUptimePoint {
  id: string;
  source_authority?: LevSourceAuthority;
  status: LevProofStatus;
  evidence: LevEvidenceRefs;
  freshness: LevFreshness;
  diagnostics?: LevDiagnostic[];
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const AUTHORITATIVE_SOURCE: LevSourceAuthority = "graph_api_projection";

function nonEmptyStrings(values: string[] | undefined): string[] {
  return Array.isArray(values) ? values.filter((value) => value.trim().length > 0) : [];
}

function diagnostic(
  code: string,
  message: string,
  field?: string,
  level: LevDiagnostic["level"] = "error",
): LevDiagnostic {
  return { level, code, message, field };
}

function refs(evidence: LevEvidenceRefs) {
  return {
    receiptRefs: nonEmptyStrings(evidence.receipt_refs),
    proofRefs: nonEmptyStrings(evidence.gate_proof_refs),
    traceRefs: nonEmptyStrings(evidence.trace_refs),
    evidenceRefs: nonEmptyStrings(evidence.evidence_refs),
    auditRefs: nonEmptyStrings(evidence.audit_refs),
    leaseRefs: nonEmptyStrings(evidence.lease_refs),
  };
}

function proofDiagnostics(evidence: LevEvidenceRefs, freshness: LevFreshness, now: Date): LevDiagnostic[] {
  const diagnostics: LevDiagnostic[] = [];
  const currentRefs = refs(evidence);

  if (currentRefs.receiptRefs.length === 0) diagnostics.push(diagnostic("LEV_RECEIPT_REFS_MISSING", "Receipt refs are required.", "evidence.receipt_refs"));
  if (currentRefs.proofRefs.length === 0) diagnostics.push(diagnostic("LEV_GATE_PROOF_REFS_MISSING", "GateProof refs are required.", "evidence.gate_proof_refs"));
  if (currentRefs.traceRefs.length === 0) diagnostics.push(diagnostic("LEV_TRACE_REFS_MISSING", "Trace refs are required.", "evidence.trace_refs"));
  if (currentRefs.evidenceRefs.length === 0) diagnostics.push(diagnostic("LEV_EVIDENCE_REFS_MISSING", "Evidence refs are required.", "evidence.evidence_refs"));
  if (currentRefs.auditRefs.length === 0) diagnostics.push(diagnostic("LEV_AUDIT_REFS_MISSING", "Audit refs are required.", "evidence.audit_refs"));

  const generatedAt = Date.parse(freshness.generated_at);
  if (!Number.isFinite(generatedAt)) {
    diagnostics.push(diagnostic("LEV_FRESHNESS_GENERATED_AT_INVALID", "Freshness requires a valid generated_at timestamp.", "freshness.generated_at"));
  }
  if (typeof freshness.max_age_ms === "number" && (!Number.isFinite(freshness.max_age_ms) || freshness.max_age_ms < 0)) {
    diagnostics.push(diagnostic("LEV_FRESHNESS_MAX_AGE_INVALID", "Freshness max_age_ms must be finite and non-negative.", "freshness.max_age_ms"));
  }
  if (freshness.stale) {
    diagnostics.push(diagnostic("LEV_PROOF_STALE", "Stale proof cannot support approval.", "freshness.stale", "warning"));
  }
  if (Number.isFinite(generatedAt) && freshness.max_age_ms !== undefined) {
    const ageMs = now.getTime() - generatedAt;
    if (ageMs < 0) diagnostics.push(diagnostic("LEV_FRESHNESS_FROM_FUTURE", "Proof freshness is from the future.", "freshness.generated_at"));
    if (ageMs > freshness.max_age_ms) diagnostics.push(diagnostic("LEV_FRESHNESS_WINDOW_EXCEEDED", "Proof freshness window has expired.", "freshness.max_age_ms", "warning"));
  }

  return diagnostics;
}

function statusFromDiagnostics(diagnostics: LevDiagnostic[]): LevProofStatus {
  if (diagnostics.some((entry) => entry.level === "error")) return "blocked";
  if (diagnostics.length > 0) return "degraded";
  return "healthy";
}

function reasonFromDiagnostics(diagnostics: LevDiagnostic[]): string {
  if (diagnostics.length === 0) return "proof-backed-fresh";
  const first = diagnostics[0]?.code ?? "LEV_PROOF_BLOCKED";
  return first.toLowerCase().replace(/^lev_/, "").replace(/_/g, "-");
}

export function deriveLevProjectionStatus(projection: LevProjection, now: Date = new Date()): HITLActionState {
  const diagnostics = [...projection.diagnostics, ...proofDiagnostics(projection.evidence, projection.freshness, now)];
  if (projection.source_authority !== AUTHORITATIVE_SOURCE) {
    diagnostics.push(diagnostic("LEV_SOURCE_NOT_AUTHORITATIVE", "AgentPing must consume graph/API projections, not local status props.", "source_authority"));
  }
  const currentRefs = refs(projection.evidence);
  const status = statusFromDiagnostics(diagnostics);
  return {
    status,
    reason: reasonFromDiagnostics(diagnostics),
    canApprove: false,
    canDeny: false,
    diagnostics,
    ...currentRefs,
  };
}

export function deriveProofBackedUptimeRollup(points: ProofBackedUptimePoint[], now: Date = new Date()) {
  if (points.length === 0) {
    const diagnostics = [diagnostic("LEV_UPTIME_POINTS_MISSING", "Uptime rollups require proof-backed points.", "points")];
    return {
      status: "blocked",
      reason: "uptime-points-missing",
      healthyCount: 0,
      degradedCount: 0,
      blockedCount: 0,
      receiptRefs: [],
      proofRefs: [],
      traceRefs: [],
      evidenceRefs: [],
      auditRefs: [],
      diagnostics,
    };
  }

  const states = points.map((point) => deriveLevProjectionStatus({
    type: "AgentPingLevProjection",
    schema: "lev.agentping.observability_projection.v0",
    kind: "runs",
    id: point.id,
    source_authority: point.source_authority ?? AUTHORITATIVE_SOURCE,
    projection_only: true,
    operational_truth: false,
    status: point.status,
    evidence: point.evidence,
    freshness: point.freshness,
    diagnostics: point.diagnostics ?? [],
  }, now));
  const diagnostics = states.flatMap((state) => state.diagnostics);
  const blockedCount = states.filter((state) => state.status === "blocked").length;
  const degradedCount = states.filter((state) => state.status === "degraded").length;
  const healthyCount = states.filter((state) => state.status === "healthy").length;
  const status: LevProofStatus = blockedCount > 0 ? "blocked" : degradedCount > 0 ? "degraded" : "healthy";

  return {
    status,
    reason: status === "healthy" ? "proof-backed-fresh" : reasonFromDiagnostics(diagnostics),
    healthyCount,
    degradedCount,
    blockedCount,
    receiptRefs: Array.from(new Set(states.flatMap((state) => state.receiptRefs))),
    proofRefs: Array.from(new Set(states.flatMap((state) => state.proofRefs))),
    traceRefs: Array.from(new Set(states.flatMap((state) => state.traceRefs))),
    evidenceRefs: Array.from(new Set(states.flatMap((state) => state.evidenceRefs))),
    auditRefs: Array.from(new Set(states.flatMap((state) => state.auditRefs))),
    diagnostics,
  };
}

export function deriveHITLActionState(action: HITLActionView, now: Date = new Date()): HITLActionState {
  const projection = deriveLevProjectionStatus({
    type: "AgentPingLevProjection",
    schema: "lev.agentping.observability_projection.v0",
    kind: "runs",
    id: action.action_id,
    source_authority: action.source_authority ?? AUTHORITATIVE_SOURCE,
    projection_only: true,
    operational_truth: false,
    status: "healthy",
    evidence: action.evidence,
    freshness: action.freshness,
    diagnostics: [],
  }, now);
  const diagnostics = [...projection.diagnostics];
  const policyLeaseRefs = nonEmptyStrings(action.policy.lease_refs);

  if (policyLeaseRefs.length === 0) diagnostics.push(diagnostic("LEV_HITL_LEASE_REFS_MISSING", "HITL actions require scoped lease refs.", "policy.lease_refs"));
  if (action.policy.confirmation_required && !action.policy.gate_proof_ref) {
    diagnostics.push(diagnostic("LEV_HITL_GATE_PROOF_REF_MISSING", "HITL actions require a GateProof policy ref.", "policy.gate_proof_ref"));
  }
  if (action.decision) {
    diagnostics.push(diagnostic("LEV_HITL_ALREADY_DECIDED", "Existing HITL decisions cannot be replayed as a new decision.", "decision"));
  }

  const status = statusFromDiagnostics(diagnostics);
  return {
    ...projection,
    status,
    reason: reasonFromDiagnostics(diagnostics),
    canApprove: status === "healthy",
    canDeny: status === "healthy",
    leaseRefs: Array.from(new Set([...projection.leaseRefs, ...policyLeaseRefs])),
    diagnostics,
  };
}

export function buildHITLDecisionRequest(action: HITLActionView, input: HITLDecisionInput, now: Date = new Date()): HITLDecisionSubmitResult {
  const state = deriveHITLActionState(action, now);
  const diagnostics = [...state.diagnostics];
  if (!input.actor.trim()) diagnostics.push(diagnostic("LEV_HITL_ACTOR_MISSING", "HITL decisions require an actor.", "actor"));
  if (input.decision === "approved" && action.policy.confirmation_required && !input.confirmation_token?.trim()) {
    diagnostics.push(diagnostic("LEV_HITL_CONFIRMATION_TOKEN_MISSING", "Approved HITL decisions require a confirmation token.", "confirmation_token"));
  }
  if (action.decision && action.decision.decision !== input.decision) {
    diagnostics.push(diagnostic("LEV_HITL_DECISION_REPLAY_BLOCKED", "A prior HITL decision cannot be replayed as a different decision.", "decision"));
  }
  if (statusFromDiagnostics(diagnostics) !== "healthy") {
    return { ok: false, status: "blocked", diagnostics };
  }

  return {
    ok: true,
    receipt: {
      type: "AgentPingHITLDecisionReceipt",
      schema: "lev.agentping.hitl_decision_receipt.v0",
      decision_receipt_id: "",
      decision_receipt_ref: "",
      action_id: action.action_id,
      operation: action.operation,
      resource_ref: action.resource_ref,
      decision: input.decision,
      actor: input.actor,
      decided_at: "",
      source_authority: "receipts_traces_proofs",
      projection_only: true,
      operational_truth: false,
      append_only: true,
      write_performed: false,
      receipt_refs: state.receiptRefs,
      proof_refs: Array.from(new Set([action.policy.gate_proof_ref, ...state.proofRefs].filter((ref): ref is string => Boolean(ref)))),
      trace_refs: state.traceRefs,
      evidence_refs: state.evidenceRefs,
      audit_refs: state.auditRefs,
      lease_refs: state.leaseRefs,
      diagnostics: [],
    },
  };
}

export async function getLevProjection(kind: LevProjectionKind, id: string, fetcher: Fetcher = fetch): Promise<LevProjection> {
  const response = await fetcher(`${API_BASE}/lev/${kind}/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error(`Failed to get Lev ${kind} projection: ${response.status} ${response.statusText}`);
  return response.json();
}

export async function submitHITLDecision(
  action: HITLActionView,
  input: HITLDecisionInput,
  fetcher: Fetcher = fetch,
  now: Date = new Date(),
): Promise<HITLDecisionSubmitResult> {
  const request = buildHITLDecisionRequest(action, input, now);
  if (!request.ok) return request;

  const route = input.decision === "approved" ? "approve" : "deny";
  const response = await fetcher(`${API_BASE}/lev/hitl/${encodeURIComponent(action.action_id)}/${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      actor: input.actor,
      decision: input.decision,
      confirmation_token: input.confirmation_token,
      action: {
        action_id: action.action_id,
        operation: action.operation,
        resource_ref: action.resource_ref,
        policy: action.policy,
      },
      evidence: action.evidence,
      freshness: action.freshness,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ diagnostics: [] }));
    return { ok: false, status: "blocked", diagnostics: Array.isArray(payload.diagnostics) ? payload.diagnostics : [] };
  }

  return { ok: true, receipt: await response.json() };
}
