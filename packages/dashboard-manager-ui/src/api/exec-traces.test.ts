import { describe, expect, it } from "vitest";

import { deriveProofBackedStatus, type ExecTrace } from "./exec-traces";

const NOW = new Date("2026-05-22T20:00:00.000Z");

function proofTrace(overrides: Partial<ExecTrace> = {}): ExecTrace {
  return {
    status: "SUCCESS",
    monitor_id: "monitor-api-heartbeat",
    observed_at: "2026-05-22T19:59:30.000Z",
    freshness_ms: 60_000,
    receipt_id: "rcpt-monitor-heartbeat",
    trace_ref: { events_path: ".lev/agentfs/exec/events.jsonl" },
    gate_proof_refs: [{
      gate_id: "gate-monitor-heartbeat",
      verdict: "pass",
      evidence_refs: [
        ".lev/agentfs/exec/artifacts/exec-monitor-heartbeat/heartbeat/stdout.txt",
      ],
    }],
    claim_verdicts: [{
      claim_id: "monitor-run-evidence-queryable",
      verdict: "pass",
      evidence_ref: ".lev/agentfs/exec/artifacts/exec-monitor-heartbeat/heartbeat/claim.json",
    }],
    ...overrides,
  };
}

describe("proof-backed exec trace status", () => {
  it("marks monitor status healthy only from fresh GateProof, receipt, trace, and evidence refs", () => {
    expect(deriveProofBackedStatus(proofTrace(), NOW)).toEqual({
      status: "healthy",
      reason: "proof-backed-fresh",
      monitorId: "monitor-api-heartbeat",
      receiptRef: "rcpt-monitor-heartbeat",
      traceRef: ".lev/agentfs/exec/events.jsonl",
      evidenceRefs: [
        ".lev/agentfs/exec/artifacts/exec-monitor-heartbeat/heartbeat/stdout.txt",
      ],
    });
  });

  it("blocks success-looking traces when GateProof is missing", () => {
    expect(deriveProofBackedStatus(proofTrace({ gate_proof_refs: [] }), NOW)).toMatchObject({
      status: "blocked",
      reason: "missing-gate-proof",
    });
  });

  it("degrades stale proof instead of rendering green", () => {
    expect(deriveProofBackedStatus(proofTrace({ observed_at: "2026-05-22T19:58:59.999Z" }), NOW)).toMatchObject({
      status: "degraded",
      reason: "stale-proof",
    });
  });

  it("blocks proof chains without audit linkage", () => {
    expect(deriveProofBackedStatus(proofTrace({ receipt_id: undefined }), NOW)).toMatchObject({
      status: "blocked",
      reason: "missing-receipt",
    });
    expect(deriveProofBackedStatus(proofTrace({ trace_ref: undefined }), NOW)).toMatchObject({
      status: "blocked",
      reason: "missing-trace",
    });
    expect(deriveProofBackedStatus(proofTrace({ gate_proof_refs: [{ verdict: "pass", evidence_refs: [] }] }), NOW)).toMatchObject({
      status: "blocked",
      reason: "missing-evidence-refs",
    });
  });
});
