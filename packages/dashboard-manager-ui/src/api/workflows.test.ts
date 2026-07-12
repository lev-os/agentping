import { afterEach, describe, expect, it, vi } from "vitest";

import { getWorkflowEntries } from "./workflows";

const LIFECYCLE_RAW = [
  "name: Lifecycle",
  "entry: router",
  "nodes:",
  "  router:",
  "    branches:",
  "      research: research",
  "  research:",
  "    next: design",
  "  design:",
  "    next: implement",
  "  implement:",
  "    next: verify",
  "  verify:",
  "    next: close",
  "  close:",
  "    terminal: true",
].join("\n");

const DASHBOARD_BUILD_RAW = [
  "name: Dashboard Build",
  "steps:",
  "  - id: build",
  "    command: lev dashboard build",
  "  - id: done",
  "    terminal: true",
].join("\n");

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });
}

describe("workflow registry snapshot", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("includes lifecycle and dashboard build flows with parsed topology", async () => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "/api/workflows") {
        return jsonResponse({
          hostAvailable: true,
          workflows: [
            {
              id: "system-lifecycle",
              path: "core/flowmind/system/lifecycle.flow.yaml",
              category: "system",
              name: "Lifecycle",
            },
            {
              id: "plugin-dashboard-flows-build",
              path: "plugins/dashboard/flows/build.flow.yaml",
              category: "plugin",
              name: "Dashboard Build",
            },
          ],
        });
      }
      if (url === "/api/workflows/system-lifecycle") {
        return jsonResponse({
          hostAvailable: true,
          workflow: {
            id: "system-lifecycle",
            path: "core/flowmind/system/lifecycle.flow.yaml",
            category: "system",
            name: "Lifecycle",
            raw: LIFECYCLE_RAW,
          },
        });
      }
      if (url === "/api/workflows/plugin-dashboard-flows-build") {
        return jsonResponse({
          hostAvailable: true,
          workflow: {
            id: "plugin-dashboard-flows-build",
            path: "plugins/dashboard/flows/build.flow.yaml",
            category: "plugin",
            name: "Dashboard Build",
            raw: DASHBOARD_BUILD_RAW,
          },
        });
      }
      return new Response("not found", { status: 404, statusText: "Not Found" });
    });

    const entries = await getWorkflowEntries();

    const lifecycle = entries.find((entry) => entry.slug === "system-lifecycle");
    expect(lifecycle).toBeDefined();
    expect(lifecycle?.group).toBe("system");
    expect(lifecycle?.entryNodeId).toBe("router");
    expect(lifecycle?.nodeCount).toBeGreaterThan(5);
    expect(lifecycle?.edges.some((edge) => edge.target === "research")).toBe(true);

    const dashboardBuild = entries.find(
      (entry) => entry.slug === "plugin-dashboard-flows-build",
    );
    expect(dashboardBuild).toBeDefined();
    expect(dashboardBuild?.group).toBe("plugin");
    expect(dashboardBuild?.nodeCount).toBe(2);
    expect(dashboardBuild?.edges).toHaveLength(1);
  });
});
