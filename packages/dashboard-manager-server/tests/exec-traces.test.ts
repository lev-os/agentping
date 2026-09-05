import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createExecTraceRoutes,
  type CommandRunResult,
  type ExecTraceCommandRunner,
} from "../src/routes/exec-traces";

const ok = (payload: unknown): CommandRunResult => ({
  ok: true,
  stdout: JSON.stringify(payload),
  stderr: "",
  exitCode: 0,
});

const fail = (stderr: string, exitCode = 1): CommandRunResult => ({
  ok: false,
  stdout: "",
  stderr,
  exitCode,
  error: stderr,
});

const workflowGraph = {
  widget: {
    type: "WorkflowGraph",
    graph: {
      title: "demo",
      nodes: [{ id: "start" }],
      edges: [],
      frames: [],
    },
  },
};

describe("createExecTraceRoutes", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns an AgentPing exec debug payload with trace and graph data", async () => {
    const commandRunner = vi.fn<ExecTraceCommandRunner>(async (_command, args) => {
      if (args[0] === "exec") {
        return ok({ run: "c0343638af93", events: [{ type: "start" }] });
      }
      return ok(workflowGraph);
    });
    const app = createExecTraceRoutes({
      projectRoot: "/repo",
      commandRunner,
    });

    const response = await app.request("/c0343638af93");
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      type: "AgentPingExecDebug",
      specVersion: "0.1.0",
      execId: "c0343638af93",
      projectRoot: "/repo",
      trace: { run: "c0343638af93", events: [{ type: "start" }] },
      graph: workflowGraph,
      commands: {
        trace: "lev exec trace --run=c0343638af93 --json",
        flowmind: "lev flowmind debug --run=c0343638af93 --json",
      },
      diagnostics: {
        warnings: [],
      },
    });
    expect(commandRunner).toHaveBeenNthCalledWith(
      1,
      "lev",
      ["exec", "trace", "--run=c0343638af93", "--json"],
      { cwd: "/repo" },
    );
    expect(commandRunner).toHaveBeenNthCalledWith(
      2,
      "lev",
      ["flowmind", "debug", "--run=c0343638af93", "--json"],
      { cwd: "/repo" },
    );
  });

  it("uses LEV_PROJECT_ROOT when an explicit project root is not configured", async () => {
    vi.stubEnv("LEV_PROJECT_ROOT", "/env/repo");
    const commandRunner = vi.fn<ExecTraceCommandRunner>(async (_command, args) => {
      if (args[0] === "exec") {
        return ok({ events: [] });
      }
      return ok(workflowGraph);
    });
    const app = createExecTraceRoutes({ commandRunner });

    const response = await app.request("/run_123");
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.projectRoot).toBe("/env/repo");
    expect(commandRunner).toHaveBeenCalledWith(
      "lev",
      ["exec", "trace", "--run=run_123", "--json"],
      { cwd: "/env/repo" },
    );
  });

  it("rejects invalid exec ids before running commands", async () => {
    const commandRunner = vi.fn<ExecTraceCommandRunner>();
    const app = createExecTraceRoutes({
      projectRoot: "/repo",
      commandRunner,
    });

    const response = await app.request("/bad%20id");
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ error: "Invalid exec id" });
    expect(commandRunner).not.toHaveBeenCalled();
  });

  it("returns 404 when trace output indicates the run has no trace", async () => {
    const commandRunner = vi.fn<ExecTraceCommandRunner>(async () => fail("no events found for run"));
    const app = createExecTraceRoutes({
      projectRoot: "/repo",
      commandRunner,
    });

    const response = await app.request("/missing-run");
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({ error: "trace not found", execId: "missing-run" });
    expect(commandRunner).toHaveBeenCalledTimes(1);
  });

  it("returns 500 for non-not-found trace command failures", async () => {
    const commandRunner = vi.fn<ExecTraceCommandRunner>(async () => fail("permission denied"));
    const app = createExecTraceRoutes({
      projectRoot: "/repo",
      commandRunner,
    });

    const response = await app.request("/run-123");
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBe("Failed to load exec trace");
    expect(payload.diagnostics).toEqual([
      {
        level: "error",
        code: "TRACE_COMMAND_FAILED",
        message: "permission denied",
      },
    ]);
    expect(commandRunner).toHaveBeenCalledTimes(1);
  });

  it("keeps trace data and adds a warning when FlowMind graph projection fails", async () => {
    const commandRunner = vi.fn<ExecTraceCommandRunner>(async (_command, args) => {
      if (args[0] === "exec") {
        return ok({ events: [{ type: "start" }] });
      }
      return fail("flowmind projection failed");
    });
    const app = createExecTraceRoutes({
      projectRoot: "/repo",
      commandRunner,
    });

    const response = await app.request("/run-123");
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.trace).toEqual({ events: [{ type: "start" }] });
    expect(payload.graph).toBeNull();
    expect(payload.diagnostics).toEqual({
      warnings: ["GRAPH_COMMAND_FAILED: flowmind projection failed"],
    });
    expect(commandRunner).toHaveBeenCalledTimes(2);
  });

  it("keeps trace data and warns when FlowMind graph projection has the wrong contract", async () => {
    const commandRunner = vi.fn<ExecTraceCommandRunner>(async (_command, args) => {
      if (args[0] === "exec") {
        return ok({ events: [{ type: "start" }] });
      }
      return ok({ nodes: [{ id: "start" }], edges: [] });
    });
    const app = createExecTraceRoutes({
      projectRoot: "/repo",
      commandRunner,
    });

    const response = await app.request("/run-123");
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.trace).toEqual({ events: [{ type: "start" }] });
    expect(payload.graph).toBeNull();
    expect(payload.diagnostics).toEqual({
      warnings: ["GRAPH_CONTRACT_INVALID: FlowMind debug output did not include widget.graph"],
    });
  });
});
