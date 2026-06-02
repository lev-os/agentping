import { describe, expect, it, vi } from "vitest";

import {
  buildHITLDecisionRequest,
  deriveProofBackedUptimeRollup,
  deriveHITLActionState,
  deriveLevProjectionStatus,
  submitHITLDecision,
  type HITLActionView,
  type HITLDecisionReceipt,
  type LevProjection,
} from "./lev-observability";

const NOW = new Date("2026-06-01T20:40:00.000Z");

const evidence = {
  receipt_refs: ["rcpt-run-1"],
  gate_proof_refs: ["gate-proof-1"],
  trace_refs: ["trace-run-1"],
  evidence_refs: ["artifact-run-1"],
  audit_refs: ["audit-run-1"],
  lease_refs: ["lease-run-1"],
};

const freshness = {
  generated_at: "2026-06-01T20:39:45.000Z",
  max_age_ms: 60_000,
};

function projection(overrides: Partial<LevProjection> = {}): LevProjection {
  return {
    type: "AgentPingLevProjection",
    schema: "lev.agentping.observability_projection.v0",
    kind: "runs",
    id: "run-1",
    source_authority: "graph_api_projection",
    projection_only: true,
    operational_truth: false,
    status: "healthy",
    evidence,
    freshness,
    diagnostics: [],
    ...overrides,
  };
}

function action(overrides: Partial<HITLActionView> = {}): HITLActionView {
  return {
    action_id: "action-1",
    operation: "observability.session.inject.request",
    resource_ref: "session://run-1",
    policy: {
      confirmation_required: true,
      gate_proof_ref: "gate-proof-1",
      lease_refs: ["lease-run-1"],
    },
    evidence,
    freshness,
    source_authority: "graph_api_projection",
    ...overrides,
  };
}

function receipt(): HITLDecisionReceipt {
  return {
    type: "AgentPingHITLDecisionReceipt",
    schema: "lev.agentping.hitl_decision_receipt.v0",
    decision_receipt_id: "hitl-decision-1",
    decision_receipt_ref: "receipt:hitl-decision-1",
    action_id: "action-1",
    operation: "observability.session.inject.request",
    resource_ref: "session://run-1",
    decision: "approved",
    actor: "jp",
    decided_at: "2026-06-01T20:39:50.000Z",
    source_authority: "receipts_traces_proofs",
    projection_only: true,
    operational_truth: false,
    append_only: true,
    write_performed: false,
    confirmation_token_ref: "sha256:token",
    receipt_refs: ["hitl-decision-1", "rcpt-run-1"],
    proof_refs: ["gate-proof-1"],
    trace_refs: ["trace-run-1"],
    evidence_refs: ["artifact-run-1"],
    audit_refs: ["audit-run-1"],
    lease_refs: ["lease-run-1"],
    diagnostics: [],
  };
}

describe("Lev observability UI action flow", () => {
  it("keeps graph/API proof projections healthy only with fresh proof refs", () => {
    expect(deriveLevProjectionStatus(projection(), NOW)).toMatchObject({
      status: "healthy",
      reason: "proof-backed-fresh",
      receiptRefs: ["rcpt-run-1"],
      proofRefs: ["gate-proof-1"],
      traceRefs: ["trace-run-1"],
      evidenceRefs: ["artifact-run-1"],
    });
  });

  it("blocks dashboard-local projections and missing proof refs", () => {
    const state = deriveLevProjectionStatus(projection({
      source_authority: "dashboard_local",
      evidence: {
        receipt_refs: [],
        gate_proof_refs: [],
        trace_refs: [],
        evidence_refs: [],
      },
    }), NOW);

    expect(state.status).toBe("blocked");
    expect(state.diagnostics.map((entry) => entry.code)).toEqual(expect.arrayContaining([
      "LEV_SOURCE_NOT_AUTHORITATIVE",
      "LEV_RECEIPT_REFS_MISSING",
      "LEV_GATE_PROOF_REFS_MISSING",
      "LEV_TRACE_REFS_MISSING",
      "LEV_EVIDENCE_REFS_MISSING",
    ]));
  });

  it("blocks fake success text and provider self-report without accepting local green", () => {
    const state = deriveLevProjectionStatus(projection({
      source_authority: "status_text",
      status: "healthy",
      result: { status: "SUCCESS", message: "all checks passed" },
    }), NOW);

    expect(state.status).toBe("blocked");
    expect(state.diagnostics.map((entry) => entry.code)).toContain("LEV_SOURCE_NOT_AUTHORITATIVE");
  });

  it("blocks projections that hide audit refs", () => {
    const state = deriveLevProjectionStatus(projection({
      evidence: {
        receipt_refs: ["rcpt-run-1"],
        gate_proof_refs: ["gate-proof-1"],
        trace_refs: ["trace-run-1"],
        evidence_refs: ["artifact-run-1"],
      },
    }), NOW);

    expect(state.status).toBe("blocked");
    expect(state.diagnostics.map((entry) => entry.code)).toContain("LEV_AUDIT_REFS_MISSING");
  });

  it("allows HITL decisions only when lease, GateProof, and fresh evidence are present", () => {
    expect(deriveHITLActionState(action(), NOW)).toMatchObject({
      status: "healthy",
      canApprove: true,
      canDeny: true,
      leaseRefs: ["lease-run-1"],
    });

    const blocked = deriveHITLActionState(action({
      policy: {
        confirmation_required: true,
        lease_refs: [],
      },
    }), NOW);
    expect(blocked.status).toBe("blocked");
    expect(blocked.diagnostics.map((entry) => entry.code)).toEqual(expect.arrayContaining([
      "LEV_HITL_LEASE_REFS_MISSING",
      "LEV_HITL_GATE_PROOF_REF_MISSING",
    ]));
  });

  it("degrades stale HITL action proof and prevents approve or deny affordances", () => {
    const stale = deriveHITLActionState(action({
      freshness: {
        generated_at: "2026-06-01T20:38:00.000Z",
        max_age_ms: 60_000,
      },
    }), NOW);

    expect(stale).toMatchObject({
      status: "degraded",
      canApprove: false,
      canDeny: false,
    });
    expect(stale.diagnostics.map((entry) => entry.code)).toContain("LEV_FRESHNESS_WINDOW_EXCEEDED");
  });

  it("blocks approval payloads without confirmation tokens", () => {
    const request = buildHITLDecisionRequest(action(), {
      actor: "jp",
      decision: "approved",
    }, NOW);

    expect(request.ok).toBe(false);
    if (!request.ok) {
      expect(request.diagnostics.map((entry) => entry.code)).toContain("LEV_HITL_CONFIRMATION_TOKEN_MISSING");
    }
  });

  it("blocks denied decision replay as approval", () => {
    const request = buildHITLDecisionRequest(action({
      decision: {
        decision_receipt_id: "hitl-denied-1",
        action_id: "action-1",
        decision: "denied",
        receipt_refs: ["hitl-denied-1"],
        proof_refs: ["gate-proof-1"],
        trace_refs: ["trace-run-1"],
        evidence_refs: ["artifact-run-1"],
        audit_refs: ["audit-run-1"],
      },
    }), {
      actor: "jp",
      decision: "approved",
      confirmation_token: "confirm",
    }, NOW);

    expect(request.ok).toBe(false);
    if (!request.ok) {
      expect(request.diagnostics.map((entry) => entry.code)).toEqual(expect.arrayContaining([
        "LEV_HITL_ALREADY_DECIDED",
        "LEV_HITL_DECISION_REPLAY_BLOCKED",
      ]));
    }
  });

  it("blocks deferred decision replay as approval", () => {
    const request = buildHITLDecisionRequest(action({
      decision: {
        decision_receipt_id: "hitl-deferred-1",
        action_id: "action-1",
        decision: "deferred",
        receipt_refs: ["hitl-deferred-1"],
        proof_refs: ["gate-proof-1"],
        trace_refs: ["trace-run-1"],
        evidence_refs: ["artifact-run-1"],
        audit_refs: ["audit-run-1"],
      },
    }), {
      actor: "jp",
      decision: "approved",
      confirmation_token: "confirm",
    }, NOW);

    expect(request.ok).toBe(false);
    if (!request.ok) {
      expect(request.diagnostics.map((entry) => entry.code)).toEqual(expect.arrayContaining([
        "LEV_HITL_ALREADY_DECIDED",
        "LEV_HITL_DECISION_REPLAY_BLOCKED",
      ]));
    }
  });

  it("keeps uptime rollups blocked when a proof interval lacks proof", () => {
    const rollup = deriveProofBackedUptimeRollup([
      {
        id: "interval-1",
        status: "healthy",
        source_authority: "graph_api_projection",
        evidence,
        freshness,
      },
      {
        id: "interval-2",
        status: "healthy",
        source_authority: "graph_api_projection",
        evidence: {
          receipt_refs: ["rcpt-run-2"],
          gate_proof_refs: [],
          trace_refs: ["trace-run-2"],
          evidence_refs: ["artifact-run-2"],
          audit_refs: ["audit-run-2"],
        },
        freshness,
      },
    ], NOW);

    expect(rollup).toMatchObject({
      status: "blocked",
      healthyCount: 1,
      blockedCount: 1,
      proofRefs: ["gate-proof-1"],
    });
    expect(rollup.diagnostics.map((entry: { code: string }) => entry.code)).toContain("LEV_GATE_PROOF_REFS_MISSING");
  });

  it("blocks empty uptime rollups instead of rendering green", () => {
    expect(deriveProofBackedUptimeRollup([], NOW)).toMatchObject({
      status: "blocked",
      reason: "uptime-points-missing",
      blockedCount: 0,
    });
  });

  it("posts approved decisions to the server route and returns proof refs for display", async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify(receipt()), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );

    const result = await submitHITLDecision(action(), {
      actor: "jp",
      decision: "approved",
      confirmation_token: "confirm-secret",
    }, fetcher, NOW);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.receipt).toMatchObject({
        decision_receipt_ref: "receipt:hitl-decision-1",
        receipt_refs: ["hitl-decision-1", "rcpt-run-1"],
        proof_refs: ["gate-proof-1"],
        trace_refs: ["trace-run-1"],
        evidence_refs: ["artifact-run-1"],
      });
    }
    expect(fetcher).toHaveBeenCalledWith("/api/lev/hitl/action-1/approve", expect.objectContaining({
      method: "POST",
      headers: { "content-type": "application/json" },
    }));
  });

  it("does not forward malicious display labels as server action text", async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify(receipt()), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );
    const maliciousLabel = "Approve && rm -rf /";

    const result = await submitHITLDecision(action({ label: maliciousLabel }), {
      actor: "jp",
      decision: "approved",
      confirmation_token: "confirm-secret",
    }, fetcher, NOW);

    expect(result.ok).toBe(true);
    const body = JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body));
    expect(JSON.stringify(body)).not.toContain(maliciousLabel);
    expect(JSON.stringify(body)).not.toContain("rm -rf");
    expect(body.action).toEqual({
      action_id: "action-1",
      operation: "observability.session.inject.request",
      resource_ref: "session://run-1",
      policy: {
        confirmation_required: true,
        gate_proof_ref: "gate-proof-1",
        lease_refs: ["lease-run-1"],
      },
    });
  });

  it("posts denied decisions without a confirmation token but keeps proof refs", async () => {
    const deniedReceipt = { ...receipt(), decision: "denied" as const, confirmation_token_ref: undefined };
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify(deniedReceipt), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );

    const result = await submitHITLDecision(action(), {
      actor: "jp",
      decision: "denied",
    }, fetcher, NOW);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.receipt).toMatchObject({
        decision: "denied",
        receipt_refs: ["hitl-decision-1", "rcpt-run-1"],
        proof_refs: ["gate-proof-1"],
        trace_refs: ["trace-run-1"],
        evidence_refs: ["artifact-run-1"],
      });
      expect(result.receipt.confirmation_token_ref).toBeUndefined();
    }
    expect(fetcher).toHaveBeenCalledWith("/api/lev/hitl/action-1/deny", expect.objectContaining({
      method: "POST",
      body: expect.stringContaining("\"decision\":\"denied\""),
    }));
  });

  it("does not call the server when a decision is locally blocked", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 500 }));

    const result = await submitHITLDecision(action(), {
      actor: "jp",
      decision: "approved",
    }, fetcher, NOW);

    expect(result.ok).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
