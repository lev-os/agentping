import { describe, expect, it } from "vitest";

import { deriveProofBackedStatus, getExecTraceDebug, type ExecTrace } from "./exec-traces";

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
      audit_refs: [
        ".lev/agentfs/exec/artifacts/exec-monitor-heartbeat/heartbeat/audit.json",
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
      proofRefs: ["gate-monitor-heartbeat"],
      evidenceRefs: [
        ".lev/agentfs/exec/artifacts/exec-monitor-heartbeat/heartbeat/stdout.txt",
      ],
      auditRefs: [
        ".lev/agentfs/exec/artifacts/exec-monitor-heartbeat/heartbeat/audit.json",
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
    expect(deriveProofBackedStatus(proofTrace({
      gate_proof_refs: [{ gate_id: "gate-monitor-heartbeat", verdict: "pass", evidence_refs: ["artifact"] }],
    }), NOW)).toMatchObject({
      status: "blocked",
      reason: "missing-audit-refs",
    });
  });
});


describe("getExecTraceDebug", () => {
  it("narrows 404 into a typed not-found result without throwing", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "trace not found", execId: "missing-run" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    try {
      const result = await getExecTraceDebug("missing-run");
      expect(result).toEqual({
        ok: false,
        status: 404,
        error: "trace not found",
        execId: "missing-run",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("returns ok payload on 200", async () => {
    const payload = {
      type: "AgentPingExecDebug",
      specVersion: "0.1.0",
      execId: "run-1",
      projectRoot: "/repo",
      trace: { events: [] },
      graph: null,
      commands: { trace: "lev", flowmind: "lev" },
      diagnostics: { warnings: [] },
    };
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    try {
      const result = await getExecTraceDebug("run-1");
      expect(result).toEqual({ ok: true, data: payload });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
