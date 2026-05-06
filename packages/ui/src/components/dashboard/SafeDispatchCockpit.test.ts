import { describe, expect, it } from "vitest";
import { getSafeDispatchSummary } from "./SafeDispatchCockpit";

describe("getSafeDispatchSummary", () => {
  it("summarizes provider, workstream, run, and guarded action counts", () => {
    const summary = getSafeDispatchSummary({
      workstreams: [
        {
          id: "dashboard",
          title: "Dashboard",
          state: "running",
          activeRuns: 2,
          nextAction: "Watch",
        },
        {
          id: "parity",
          title: "Parity",
          state: "preview",
          activeRuns: 0,
          nextAction: "Review",
        },
      ],
      providers: [
        {
          id: "runner",
          label: "Runner",
          kind: "runner",
          state: "ready",
          detail: "Online",
        },
        {
          id: "poly",
          label: "Poly",
          kind: "poly",
          state: "preview",
          detail: "Contract pending",
        },
      ],
      actions: [
        {
          id: "refresh",
          label: "Refresh",
          description: "Reload state",
          state: "ready",
        },
        {
          id: "dispatch",
          label: "Dispatch",
          description: "Requires lease",
          state: "preview",
          leaseRequired: true,
        },
        {
          id: "force",
          label: "Force",
          description: "Blocked until lease",
          state: "blocked",
          leaseRequired: true,
        },
      ],
    });

    expect(summary).toEqual({
      readyProviders: 1,
      runningWorkstreams: 1,
      activeRuns: 2,
      guardedActions: 2,
      blockedActions: 1,
    });
  });
});
