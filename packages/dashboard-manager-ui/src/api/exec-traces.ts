const API_BASE = "/api";

export type WorkflowGraphNodeStatus =
  | "idle"
  | "ready"
  | "running"
  | "succeeded"
  | "failed"
  | "waiting"
  | "skipped";

export type WorkflowGraphLane = string;

export type WorkflowGraphEdgeStyle =
  | "primary"
  | "branch"
  | "parallel"
  | "boundary"
  | "secondary";

export interface WorkflowGraphNodeView {
  id: string;
  label: string;
  kind: string;
  lane: WorkflowGraphLane;
  wave: number;
  depth: number;
  status: WorkflowGraphNodeStatus;
  summary: string;
  detail?: string;
  hiddenChildrenCount: number;
  backreferenceCount: number;
  metadata?: Record<string, unknown>;
}

export interface WorkflowGraphEdgeView {
  id: string;
  source: string;
  target: string;
  label?: string;
  style: WorkflowGraphEdgeStyle;
  hidden?: boolean;
}

export interface WorkflowGraphFrame {
  index: number;
  ts: string;
  eventType: string;
  activeNodeId?: string;
  activeLane?: WorkflowGraphLane;
  activeWave?: number;
  summary: string;
  nodeStatuses: Record<string, WorkflowGraphNodeStatus>;
  log: string[];
}

export interface FlowMindGraph {
  title: string;
  entry: string;
  laneOrder: WorkflowGraphLane[];
  slicePolicy: {
    maxDepth: number;
    headCount: number;
    middleCount: number;
    tailCount: number;
  };
  nodes: WorkflowGraphNodeView[];
  edges: WorkflowGraphEdgeView[];
  frames: WorkflowGraphFrame[];
  metadata?: Record<string, unknown>;
}

export interface WorkflowGraphWidget {
  type: "WorkflowGraph";
  graph: FlowMindGraph;
  cursor?: number;
  focusNodeId?: string;
  debugMeta?: {
    traceSource?: string;
    execId?: string;
    flowPath?: string;
    runPath?: string;
    review?: string;
    shareState?: Record<string, unknown>;
  };
}

export type ExecTrace = Record<string, unknown> & {
  status?: string;
  eventCount?: number;
  event_count?: number;
  exitCode?: number | null;
  exit_code?: number | null;
  flowPath?: string;
  flow_path?: string;
  graphFlowPath?: string;
  receipt?: unknown;
  receiptPath?: string;
  receipt_id?: string;
  monitor_id?: string;
  observed_at?: string;
  freshness_ms?: number;
  gate_proof_refs?: unknown[];
  gateProofRefs?: unknown[];
  trace_ref?: unknown;
  traceRef?: unknown;
  claim_verdicts?: unknown[];
  claimVerdicts?: unknown[];
  events?: unknown[];
};

export interface ProofBackedStatus {
  status: "healthy" | "degraded" | "blocked";
  reason: string;
  monitorId?: string;
  receiptRef?: string;
  traceRef?: string;
  proofRefs: string[];
  evidenceRefs: string[];
  auditRefs: string[];
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function firstString(values: unknown[]): string | undefined {
  for (const value of values) {
    const candidate = asString(value);
    if (candidate) return candidate;
  }
  return undefined;
}

function receiptRef(trace: ExecTrace): string | undefined {
  const receipt = asRecord(trace.receipt);
  return firstString([
    trace.receipt_id,
    trace.receiptPath,
    receipt.id,
    receipt.receipt_id,
  ]);
}

function traceRef(trace: ExecTrace): string | undefined {
  const traceRefRecord = asRecord(trace.trace_ref ?? trace.traceRef);
  return firstString([
    traceRefRecord.ref,
    traceRefRecord.events_path,
    traceRefRecord.eventsPath,
    trace.flowPath,
    trace.flow_path,
  ]);
}

function gateProofs(trace: ExecTrace): Record<string, unknown>[] {
  return [
    ...asArray(trace.gate_proof_refs),
    ...asArray(trace.gateProofRefs),
  ].map(asRecord);
}

function proofEvidenceRefs(proofs: Record<string, unknown>[]): string[] {
  return Array.from(new Set(proofs.flatMap((proof) =>
    asArray(proof.evidence_refs ?? proof.evidenceRefs)
      .flatMap((item) => asString(item) ?? []),
  )));
}

function proofRefs(proofs: Record<string, unknown>[]): string[] {
  return Array.from(new Set(proofs.flatMap((proof) =>
    firstString([proof.gate_proof_ref, proof.gateProofRef, proof.gate_id, proof.gateId, proof.id, proof.ref]) ?? [],
  )));
}

function proofAuditRefs(proofs: Record<string, unknown>[]): string[] {
  return Array.from(new Set(proofs.flatMap((proof) =>
    asArray(proof.audit_refs ?? proof.auditRefs)
      .flatMap((item) => asString(item) ?? []),
  )));
}

function isFresh(trace: ExecTrace, now: Date): boolean | null {
  const observedAt = asString(trace.observed_at);
  const freshnessMs = asNumber(trace.freshness_ms);
  if (!observedAt || freshnessMs === null) return null;
  const observedMs = Date.parse(observedAt);
  if (!Number.isFinite(observedMs)) return false;
  return now.getTime() - observedMs <= freshnessMs;
}

export function deriveProofBackedStatus(trace: ExecTrace, now: Date = new Date()): ProofBackedStatus {
  const proofs = gateProofs(trace);
  const evidenceRefs = proofEvidenceRefs(proofs);
  const gateProofRefs = proofRefs(proofs);
  const auditRefs = proofAuditRefs(proofs);
  const receipt = receiptRef(trace);
  const tracePath = traceRef(trace);
  const freshness = isFresh(trace, now);
  const hasPassingGateProof = proofs.some((proof) => asString(proof.verdict) === "pass");
  const hasFailingGateProof = proofs.some((proof) => asString(proof.verdict) === "fail");

  const base = {
    monitorId: asString(trace.monitor_id) ?? undefined,
    receiptRef: receipt,
    traceRef: tracePath,
    proofRefs: gateProofRefs,
    evidenceRefs,
    auditRefs,
  };

  if (hasFailingGateProof) {
    return { ...base, status: "blocked", reason: "gate-proof-failed" };
  }
  if (!hasPassingGateProof) {
    return { ...base, status: "blocked", reason: "missing-gate-proof" };
  }
  if (!receipt) {
    return { ...base, status: "blocked", reason: "missing-receipt" };
  }
  if (!tracePath && !trace.eventCount && !trace.event_count && !Array.isArray(trace.events)) {
    return { ...base, status: "blocked", reason: "missing-trace" };
  }
  if (evidenceRefs.length === 0) {
    return { ...base, status: "blocked", reason: "missing-evidence-refs" };
  }
  if (auditRefs.length === 0) {
    return { ...base, status: "blocked", reason: "missing-audit-refs" };
  }
  if (freshness === false) {
    return { ...base, status: "degraded", reason: "stale-proof" };
  }
  if (freshness === null) {
    return { ...base, status: "blocked", reason: "missing-freshness" };
  }
  return { ...base, status: "healthy", reason: "proof-backed-fresh" };
}

export interface AgentPingExecDebugPayload {
  type: "AgentPingExecDebug";
  specVersion: "0.1.0";
  execId: string;
  projectRoot: string;
  trace: ExecTrace;
  graph: { widget: WorkflowGraphWidget } | null;
  commands: { trace: string; flowmind: string };
  diagnostics: { warnings: string[] };
}

export type ExecTraceDebugResult =
  | { ok: true; data: AgentPingExecDebugPayload }
  | { ok: false; status: 404; error: string; execId: string }
  | { ok: false; status: number; error: string };

export async function getExecTraceDebug(execId: string): Promise<ExecTraceDebugResult> {
  const response = await fetch(`${API_BASE}/exec-traces/${encodeURIComponent(execId)}`);
  if (response.status === 404) {
    let error = "trace not found";
    try {
      const body = await response.json() as { error?: string; execId?: string };
      if (typeof body.error === "string" && body.error.trim()) error = body.error;
    } catch {
      // keep default
    }
    return { ok: false, status: 404, error, execId };
  }
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: `Failed to get exec trace: ${response.status} ${response.statusText}`,
    };
  }
  const data = await response.json() as AgentPingExecDebugPayload;
  return { ok: true, data };
}
