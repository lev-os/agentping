import { createHash } from 'node:crypto';
import {
  proofDiagnostics,
  pushDiagnostic,
  stringArray,
  stringValue,
  isRecord,
  type LevDiagnostic,
  type LevFreshness,
} from './lev-observability-projection.js';

export const LEV_HITL_DECISION_RECEIPT_SCHEMA = 'lev.agentping.hitl_decision_receipt.v0';

export type LevHITLDecision = 'approved' | 'denied';

export interface HITLDecisionReceipt {
  readonly type: 'AgentPingHITLDecisionReceipt';
  readonly schema: typeof LEV_HITL_DECISION_RECEIPT_SCHEMA;
  readonly decision_receipt_id: string;
  readonly decision_receipt_ref: string;
  readonly action_id: string;
  readonly operation?: string;
  readonly resource_ref?: string;
  readonly decision: LevHITLDecision;
  readonly actor: string;
  readonly decided_at: string;
  readonly source_authority: 'receipts_traces_proofs';
  readonly projection_only: true;
  readonly operational_truth: false;
  readonly append_only: true;
  readonly write_performed: false;
  readonly confirmation_token_ref?: string;
  readonly receipt_refs: readonly string[];
  readonly proof_refs: readonly string[];
  readonly trace_refs: readonly string[];
  readonly evidence_refs: readonly string[];
  readonly audit_refs: readonly string[];
  readonly lease_refs: readonly string[];
  readonly diagnostics: readonly LevDiagnostic[];
}

export function decisionRouteName(decision: LevHITLDecision): string {
  return decision === 'approved' ? 'approve' : 'deny';
}

function digest(parts: readonly string[]): string {
  const hash = createHash('sha256');
  for (const part of parts) {
    hash.update(part);
    hash.update('\0');
  }
  return hash.digest('hex');
}

export function buildDecisionReceipt(
  actionId: string,
  routeDecision: LevHITLDecision,
  body: unknown,
  now: Date,
): { readonly ok: true; readonly receipt: HITLDecisionReceipt } | { readonly ok: false; readonly diagnostics: readonly LevDiagnostic[] } {
  const diagnostics: LevDiagnostic[] = [];
  const bodyRecord = isRecord(body) ? body : {};
  const action = isRecord(bodyRecord.action) ? bodyRecord.action : bodyRecord;
  const evidenceRecord = isRecord(bodyRecord.evidence) ? bodyRecord.evidence : {};
  const freshnessRecord = isRecord(bodyRecord.freshness) ? bodyRecord.freshness : {};
  const policy = isRecord(action.policy) ? action.policy : {};
  const bodyDecision = stringValue(bodyRecord.decision);
  const bodyActionId = stringValue(action.action_id) ?? stringValue(bodyRecord.action_id);
  const actor = stringValue(bodyRecord.actor) ?? stringValue(action.actor);
  const receiptRefs = stringArray(evidenceRecord.receipt_refs);
  const proofRefs = stringArray(evidenceRecord.gate_proof_refs);
  const traceRefs = stringArray(evidenceRecord.trace_refs);
  const evidenceRefs = stringArray(evidenceRecord.evidence_refs);
  const auditRefs = stringArray(evidenceRecord.audit_refs);
  const leaseRefs = stringArray(policy.lease_refs).concat(stringArray(evidenceRecord.lease_refs));
  const gateProofRef = stringValue(policy.gate_proof_ref);
  const confirmationToken = stringValue(bodyRecord.confirmation_token);
  const freshness: LevFreshness = {
    generated_at: stringValue(freshnessRecord.generated_at) ?? '',
    max_age_ms: typeof freshnessRecord.max_age_ms === 'number' ? freshnessRecord.max_age_ms : undefined,
    stale: freshnessRecord.stale === true,
  };

  if (!bodyActionId || bodyActionId !== actionId) {
    pushDiagnostic(diagnostics, 'LEV_HITL_ACTION_ID_MISMATCH', 'HITL decision action_id must match the route action id.', 'action.action_id');
  }
  if (!actor) {
    pushDiagnostic(diagnostics, 'LEV_HITL_ACTOR_MISSING', 'HITL decision receipts require an actor.', 'actor');
  }
  if (bodyDecision && bodyDecision !== routeDecision) {
    pushDiagnostic(diagnostics, 'LEV_HITL_DECISION_MISMATCH', `HITL ${decisionRouteName(routeDecision)} route cannot emit a ${bodyDecision} decision.`, 'decision');
  }
  if (bodyDecision && bodyDecision !== 'approved' && bodyDecision !== 'denied') {
    pushDiagnostic(diagnostics, 'LEV_HITL_DECISION_UNSUPPORTED', 'HITL decision must be approved or denied.', 'decision');
  }
  if (receiptRefs.length === 0) {
    pushDiagnostic(diagnostics, 'LEV_HITL_RECEIPT_REFS_MISSING', 'HITL decisions require receipt refs.', 'evidence.receipt_refs');
  }
  if (proofRefs.length === 0 || !gateProofRef) {
    pushDiagnostic(diagnostics, 'LEV_HITL_GATE_PROOF_MISSING', 'HITL decisions require GateProof refs.', 'evidence.gate_proof_refs');
  }
  if (traceRefs.length === 0 || evidenceRefs.length === 0) {
    pushDiagnostic(diagnostics, 'LEV_HITL_EVIDENCE_CHAIN_MISSING', 'HITL decisions require trace and evidence refs.', 'evidence');
  }
  if (auditRefs.length === 0) {
    pushDiagnostic(diagnostics, 'LEV_HITL_AUDIT_REFS_MISSING', 'HITL decisions require audit refs.', 'evidence.audit_refs');
  }
  if (leaseRefs.length === 0) {
    pushDiagnostic(diagnostics, 'LEV_HITL_LEASE_REFS_MISSING', 'HITL decisions require scoped lease refs.', 'policy.lease_refs');
  }
  if (routeDecision === 'approved' && !confirmationToken) {
    pushDiagnostic(diagnostics, 'LEV_HITL_CONFIRMATION_TOKEN_MISSING', 'Approved HITL decisions require a confirmation token.', 'confirmation_token');
  }

  const proofState = proofDiagnostics({
    receipt_refs: receiptRefs,
    gate_proof_refs: proofRefs,
    trace_refs: traceRefs,
    evidence_refs: evidenceRefs,
    audit_refs: auditRefs,
  }, freshness, now);
  diagnostics.push(...proofState.diagnostics);
  if (proofState.status !== 'healthy') {
    pushDiagnostic(diagnostics, 'LEV_HITL_PROOF_NOT_FRESH', 'HITL decisions require fresh proof evidence.', 'freshness');
  }

  if (diagnostics.some((diagnostic) => diagnostic.level === 'error')) {
    return { ok: false, diagnostics };
  }

  const decidedAt = now.toISOString();
  const receiptHash = digest([actionId, routeDecision, actor ?? '', decidedAt, ...receiptRefs, ...auditRefs]);
  const confirmationTokenRef = confirmationToken ? `sha256:${digest([confirmationToken])}` : undefined;
  const decisionReceiptId = `hitl-decision-${receiptHash.slice(0, 20)}`;

  return {
    ok: true,
    receipt: {
      type: 'AgentPingHITLDecisionReceipt',
      schema: LEV_HITL_DECISION_RECEIPT_SCHEMA,
      decision_receipt_id: decisionReceiptId,
      decision_receipt_ref: `receipt:${decisionReceiptId}`,
      action_id: actionId,
      operation: stringValue(action.operation),
      resource_ref: stringValue(action.resource_ref),
      decision: routeDecision,
      actor: actor ?? '',
      decided_at: decidedAt,
      source_authority: 'receipts_traces_proofs',
      projection_only: true,
      operational_truth: false,
      append_only: true,
      write_performed: false,
      confirmation_token_ref: confirmationTokenRef,
      receipt_refs: [decisionReceiptId, ...receiptRefs],
      proof_refs: Array.from(new Set([gateProofRef, ...proofRefs].filter((ref): ref is string => Boolean(ref)))),
      trace_refs: traceRefs,
      evidence_refs: evidenceRefs,
      audit_refs: auditRefs,
      lease_refs: Array.from(new Set(leaseRefs)),
      diagnostics,
    },
  };
}
