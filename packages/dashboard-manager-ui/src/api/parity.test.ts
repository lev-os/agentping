import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchParityEntries, getParityEntries } from "./parity";

function mockFetchResponse(body: unknown, ok = true, statusText = "OK") {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok,
      statusText,
      json: async () => body,
    })),
  );
}

const scorecard = {
  schema_version: 1,
  targets: [
    {
      target: "beta-target",
      repo: "example/beta",
      category: "graph-memory-framework",
      verdict: "extract",
      measured_at: "2026-07-01",
      priority: "P2",
      features: [
        { name: "Feature A", status: "HAS", lev_equivalent: "core/x", action: "keep" },
        { name: "Feature B", status: "NEEDS", lev_equivalent: "core/y", action: "build" },
      ],
      metrics: [{ name: "accuracy", value: 0.9, unit: "ratio" }],
    },
    {
      target: "alpha-target",
      repo: "example/alpha",
      category: "intake",
      verdict: "monitor",
      measured_at: "2026-07-05",
      features: [],
    },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchParityEntries", () => {
  it("enriches, sorts, and caches entries from a valid scorecard", async () => {
    mockFetchResponse(scorecard);

    const entries = await fetchParityEntries();

    expect(entries).toHaveLength(2);
    // newest measured_at first
    expect(entries[0].target).toBe("alpha-target");

    const beta = entries.find((entry) => entry.target === "beta-target");
    expect(beta).toBeDefined();
    // HAS -> implemented, NEEDS -> missing
    expect(beta?.features.map((feature) => feature.status)).toEqual([
      "implemented",
      "missing",
    ]);
    expect(beta?.implementedPercent).toBe(50);
    expect(beta?.metrics).toHaveLength(1);

    // cache is populated for synchronous readers
    expect(getParityEntries()).toEqual(entries);
  });

  it("rejects a payload that violates the scorecard contract", async () => {
    mockFetchResponse({ targets: [{ notTarget: true }] });

    await expect(fetchParityEntries()).rejects.toThrow(
      "Parity scorecard response contract invalid",
    );
  });

  it("rejects when the server responds non-ok", async () => {
    mockFetchResponse({}, false, "Service Unavailable");

    await expect(fetchParityEntries()).rejects.toThrow(
      "Failed to fetch parity scorecard: Service Unavailable",
    );
  });
});
