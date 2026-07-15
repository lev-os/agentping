import { describe, expect, it } from "vitest";

import type { AgentPingExecDebugPayload } from "../api/exec-traces";
import {
  INITIAL_POLLING_STATE,
  MAX_CONSECUTIVE_FAILURES,
  pollingFsmReducer,
  type PollingFsmState,
} from "./pollingFsm";

const DUMMY_PAYLOAD: AgentPingExecDebugPayload = {
  type: "AgentPingExecDebug",
  specVersion: "0.1.0",
  execId: "run-1",
  projectRoot: "/repo",
  trace: { events: [] },
  graph: null,
  commands: { trace: "lev", flowmind: "lev" },
  diagnostics: { warnings: [] },
};

describe("pollingFsmReducer", () => {
  it("404 → polling stops, notFound=true, autoRefresh=false", () => {
    const state = pollingFsmReducer(INITIAL_POLLING_STATE, { type: "fetched_404" });
    expect(state.notFound).toBe(true);
    expect(state.autoRefresh).toBe(false);
    expect(state.refreshPaused).toBe(false);
    expect(state.consecutiveFailures).toBe(0);
  });

  it("3 consecutive non-404 errors → refreshPaused=true, autoRefresh=false", () => {
    let state: PollingFsmState = INITIAL_POLLING_STATE;
    for (let i = 0; i < MAX_CONSECUTIVE_FAILURES - 1; i++) {
      state = pollingFsmReducer(state, { type: "fetched_error", error: "oops" });
      expect(state.refreshPaused).toBe(false);
      expect(state.autoRefresh).toBe(true);
    }
    state = pollingFsmReducer(state, { type: "fetched_error", error: "oops" });
    expect(state.consecutiveFailures).toBe(MAX_CONSECUTIVE_FAILURES);
    expect(state.refreshPaused).toBe(true);
    expect(state.autoRefresh).toBe(false);
  });

  it("resume → resets failure counter, restores autoRefresh=true, clears error", () => {
    let state: PollingFsmState = INITIAL_POLLING_STATE;
    for (let i = 0; i < MAX_CONSECUTIVE_FAILURES; i++) {
      state = pollingFsmReducer(state, { type: "fetched_error", error: "err" });
    }
    expect(state.refreshPaused).toBe(true);

    state = pollingFsmReducer(state, { type: "resume" });
    expect(state.autoRefresh).toBe(true);
    expect(state.refreshPaused).toBe(false);
    expect(state.consecutiveFailures).toBe(0);
    expect(state.error).toBeNull();
  });

  it("execid_changed → restores full initial state including autoRefresh=true", () => {
    let state: PollingFsmState = INITIAL_POLLING_STATE;
    // Simulate a 404 leaving autoRefresh off
    state = pollingFsmReducer(state, { type: "fetched_404" });
    expect(state.autoRefresh).toBe(false);
    expect(state.notFound).toBe(true);

    // execId change must restore live polling
    state = pollingFsmReducer(state, { type: "execid_changed" });
    expect(state.autoRefresh).toBe(true);
    expect(state.notFound).toBe(false);
    expect(state.error).toBeNull();
    expect(state.consecutiveFailures).toBe(0);
    expect(state.refreshPaused).toBe(false);
  });

  it("fetched_ok clears error and resets failure counter", () => {
    let state: PollingFsmState = pollingFsmReducer(
      INITIAL_POLLING_STATE,
      { type: "fetched_error", error: "transient" },
    );
    expect(state.consecutiveFailures).toBe(1);

    state = pollingFsmReducer(state, { type: "fetched_ok", data: DUMMY_PAYLOAD });
    expect(state.error).toBeNull();
    expect(state.consecutiveFailures).toBe(0);
    expect(state.payload).toBe(DUMMY_PAYLOAD);
  });
});
