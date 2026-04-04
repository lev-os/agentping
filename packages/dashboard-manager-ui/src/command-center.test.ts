import { describe, expect, it } from "vitest";

import type { Dashboard } from "./types/dashboard";
import {
  getPrimaryDashboard,
  groupDashboardsByLane,
  shouldEmbedDashboard,
} from "./lib/command-center";

const dashboards: Dashboard[] = [
  {
    id: "system-dashboard",
    config: {
      id: "system-dashboard",
      name: "System Dashboard",
      port: 5185,
      command: "pnpm run preview:runner -- --port {port}",
      cwd: "/tmp/system-dashboard",
      port_range: [5185, 5189],
      health_check: {
        type: "http",
        path: "/",
        expected_status: 200,
        interval_ms: 10000,
      },
      restart_policy: {
        enabled: true,
        max_retries: 5,
        backoff_ms: [1000, 2000, 4000],
      },
      metadata: {
        lane: "ops",
        openMode: "embed",
        description: "Primary ops surface",
        primary: true,
      },
    },
    status: {
      status: "online",
      port: 5185,
      pid: 111,
      startedAt: "2026-04-02T12:00:00.000Z",
      restartAttempts: 0,
      healthy: true,
    },
  },
  {
    id: "canvas",
    config: {
      id: "canvas",
      name: "Canvas",
      port: 5174,
      command: "pnpm exec vite --port {port}",
      cwd: "/tmp/canvas",
      port_range: [5174, 5179],
      health_check: {
        type: "http",
        path: "/",
        expected_status: 200,
        interval_ms: 10000,
      },
      restart_policy: {
        enabled: true,
        max_retries: 5,
        backoff_ms: [1000, 2000, 4000],
      },
      metadata: {
        lane: "interaction",
        openMode: "external",
        description: "Canvas surface",
      },
    },
    status: {
      status: "online",
      port: 5174,
      pid: 222,
      startedAt: "2026-04-02T12:00:00.000Z",
      restartAttempts: 0,
      healthy: true,
    },
  },
  {
    id: "studio",
    config: {
      id: "studio",
      name: "Studio",
      port: 5180,
      command: "pnpm exec vite --port {port}",
      cwd: "/tmp/studio",
      port_range: [5180, 5184],
      health_check: {
        type: "http",
        path: "/",
        expected_status: 200,
        interval_ms: 10000,
      },
      restart_policy: {
        enabled: true,
        max_retries: 5,
        backoff_ms: [1000, 2000, 4000],
      },
      metadata: {
        lane: "development",
        openMode: "external",
        description: "Studio shell",
      },
    },
    status: {
      status: "stopped",
      restartAttempts: 0,
      healthy: false,
    },
  },
];

describe("command-center helpers", () => {
  it("selects the primary ops dashboard", () => {
    expect(getPrimaryDashboard(dashboards)?.id).toBe("system-dashboard");
  });

  it("groups dashboards by lane", () => {
    expect(groupDashboardsByLane(dashboards)).toEqual({
      ops: [dashboards[0]],
      interaction: [dashboards[1]],
      development: [dashboards[2]],
    });
  });

  it("embeds dashboards only when metadata and runtime state allow it", () => {
    expect(shouldEmbedDashboard(dashboards[0])).toBe(true);
    expect(shouldEmbedDashboard(dashboards[1])).toBe(false);
    expect(shouldEmbedDashboard(dashboards[2])).toBe(false);
  });
});
