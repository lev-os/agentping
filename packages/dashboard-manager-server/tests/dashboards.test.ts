import { describe, expect, it, vi } from "vitest";

import { createDashboardRoutes } from "../src/routes/dashboards";

const dashboards = [
  {
    id: "system-dashboard",
    name: "System Dashboard",
    port: 5185,
    command: "pnpm run preview:runner -- --port {port}",
    cwd: "/tmp/system-dashboard",
    port_range: [5185, 5189],
    metadata: {
      lane: "ops",
      openMode: "embed",
      description: "Primary ops surface",
      primary: true,
    },
  },
  {
    id: "canvas",
    name: "Canvas",
    port: 5174,
    command: "pnpm exec vite --port {port}",
    cwd: "/tmp/canvas",
    port_range: [5174, 5179],
    metadata: {
      lane: "interaction",
      openMode: "external",
      description: "Canvas runtime",
    },
  },
];

const runner = {
  getAllStatus: vi.fn(() => ({
    "system-dashboard": {
      id: "system-dashboard",
      status: "online",
      port: 5185,
      pid: 123,
      startedAt: new Date("2026-04-02T12:00:00.000Z"),
      restartAttempts: 0,
      healthy: true,
      lastHealthCheck: new Date("2026-04-02T12:01:00.000Z"),
      crashes: 0,
    },
    canvas: {
      id: "canvas",
      status: "online",
      port: 5174,
      pid: 456,
      startedAt: new Date("2026-04-02T12:00:00.000Z"),
      restartAttempts: 1,
      healthy: true,
      lastHealthCheck: new Date("2026-04-02T12:01:00.000Z"),
      crashes: 0,
    },
  })),
  getAllConfigs: vi.fn(() => dashboards),
  getConfig: vi.fn((id: string) => dashboards.find((dashboard) => dashboard.id === id)),
  restart: vi.fn(async () => undefined),
  registerDashboard: vi.fn(async (config: any) => ({
    id: config.id,
    config,
    status: {
      status: "stopped",
      restartAttempts: 0,
      healthy: false,
    },
  })),
};

describe("createDashboardRoutes", () => {
  it("includes dashboard metadata in list responses", async () => {
    const app = createDashboardRoutes({ runner: runner as any });

    const response = await app.request("/");
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "system-dashboard",
          config: expect.objectContaining({
            metadata: {
              lane: "ops",
              openMode: "embed",
              description: "Primary ops surface",
              primary: true,
            },
          }),
        }),
      ]),
    );
  });

  it("includes dashboard metadata in detail responses", async () => {
    const app = createDashboardRoutes({ runner: runner as any });

    const response = await app.request("/system-dashboard");
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.config.metadata).toEqual({
      lane: "ops",
      openMode: "embed",
      description: "Primary ops surface",
      primary: true,
    });
  });

  it("accepts metadata when creating a dashboard", async () => {
    const app = createDashboardRoutes({ runner: runner as any });

    const response = await app.request("/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        config: {
          id: "ops-preview",
          name: "Ops Preview",
          port: 5190,
          command: "pnpm exec vite --port {port}",
          cwd: "/tmp/ops-preview",
          port_range: [5190, 5194],
          health_check: {
            type: "http",
            path: "/",
          },
          restart_policy: {
            enabled: true,
            max_retries: 3,
            backoff_ms: [1000, 2000, 4000],
          },
          metadata: {
            lane: "ops",
            openMode: "embed",
            description: "Secondary ops surface",
          },
        },
      }),
    });

    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.config.metadata).toEqual({
      lane: "ops",
      openMode: "embed",
      description: "Secondary ops surface",
    });
    expect(runner.registerDashboard).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          lane: "ops",
          openMode: "embed",
          description: "Secondary ops surface",
        },
      }),
    );
  });
});
