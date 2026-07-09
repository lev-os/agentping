import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchHeartbeat, fetchHeartbeatTimeline } from "./heartbeat";

const snapshotFixture = {
  generatedAt: "2026-07-09T12:00:00.000Z",
  snapshot: { tick: 147, timestamp: "2026-07-07T00:12:09.905Z" },
  pulse: {
    ready: 142,
    inProgress: 3,
    closed: 292,
    open: 159,
    total: 455,
    blocked: 17,
    gitChanges: 64,
  },
  workQueue: {
    readyItems: [
      { status: "○", id: "lev-ju3i", priority: "P0", title: "Ship heartbeat" },
    ],
    inProgressItems: [],
  },
  git: {
    changedFiles: 64,
    recentCommits: [{ hash: "abc1234", message: "lore: heartbeat" }],
  },
  handoffs: ["tt-research-6-persist.md"],
  journal: ["journal.md"],
  cdoRounds: ["cdo-r1-example"],
  briefs: [{ id: "task-dir", title: "Brief title" }],
};

const timelineFixture = {
  generatedAt: "2026-07-09T12:00:00.000Z",
  ticks: [
    {
      tick: 0,
      timestamp: "2026-07-01T00:00:00.000Z",
      beads_ready: 111,
      beads_in_progress: 5,
      beads_closed: 233,
      git_changes: 10,
      summary: "boot",
    },
  ],
  evolution: [{ timestamp: "2026-07-01T00:00:00.000Z", summary: "boot" }],
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchHeartbeat", () => {
  it("returns the heartbeat snapshot on ok responses", async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify(snapshotFixture), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetcher);

    await expect(fetchHeartbeat()).resolves.toEqual(snapshotFixture);
    expect(fetcher).toHaveBeenCalledWith("/api/heartbeat");
  });

  it("throws when the response is not ok", async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify({ error: "leviathan root not found" }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetcher);

    await expect(fetchHeartbeat()).rejects.toThrow(
      "Failed to fetch heartbeat: Service Unavailable",
    );
  });

  it("propagates a network rejection from fetch", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("Network failure");
    });
    vi.stubGlobal("fetch", fetcher);

    await expect(fetchHeartbeat()).rejects.toThrow("Network failure");
  });
});

describe("fetchHeartbeatTimeline", () => {
  it("returns the timeline payload on ok responses", async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify(timelineFixture), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetcher);

    await expect(fetchHeartbeatTimeline()).resolves.toEqual(timelineFixture);
    expect(fetcher).toHaveBeenCalledWith("/api/heartbeat/timeline");
  });

  it("throws when the response is not ok", async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify({ error: "leviathan root not found" }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetcher);

    await expect(fetchHeartbeatTimeline()).rejects.toThrow(
      "Failed to fetch heartbeat timeline: Service Unavailable",
    );
  });
});
