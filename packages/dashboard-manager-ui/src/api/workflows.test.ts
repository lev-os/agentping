import { describe, expect, it } from "vitest";

import { getWorkflowEntries } from "./workflows";

describe("workflow registry snapshot", () => {
  it("includes lifecycle and system-dashboard build flows with parsed topology", () => {
    const entries = getWorkflowEntries();

    const lifecycle = entries.find((entry) => entry.slug === "system-lifecycle");
    expect(lifecycle).toBeDefined();
    expect(lifecycle?.group).toBe("system");
    expect(lifecycle?.entryNodeId).toBe("router");
    expect(lifecycle?.nodeCount).toBeGreaterThan(5);
    expect(lifecycle?.edges.some((edge) => edge.target === "research")).toBe(true);

    const dashboardBuild = entries.find(
      (entry) => entry.slug === "plugin-system-dashboard-flows-build",
    );
    expect(dashboardBuild).toBeDefined();
    expect(dashboardBuild?.group).toBe("plugin");
    expect(dashboardBuild?.nodeCount).toBe(2);
    expect(dashboardBuild?.edges).toHaveLength(1);
  });
});
