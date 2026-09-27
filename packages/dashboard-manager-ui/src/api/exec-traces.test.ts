import { describe, expect, it } from "vitest";

import { getExecTraceDebug } from "./exec-traces";

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

  it("passes owner proof and evidence through untouched", async () => {
    const trace = {
      exitCode: 0,
      proof: {
        ok: false,
        status: "blocked",
        issues: [{ code: "run_evidence_claim_verdict_missing", field: "claim_verdicts", message: "Replay-grade run evidence requires claim verdicts." }],
      },
      evidence: {
        receipt_ref: { ref: "runtime-events.jsonl#receipt:rcpt-1" },
        trace_ref: { ref: "runtime-events.jsonl" },
        decision_refs: [{ ref: "decision.json", gate_id: "code_review", verdict: "pass" }],
        missing: [],
        claim_verdicts: [],
      },
    };
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ execId: "run-1", trace, graph: null, diagnostics: { warnings: [] } }), { status: 200 });

    try {
      const result = await getExecTraceDebug("run-1");
      expect(result.ok && result.data.trace).toEqual(trace);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
