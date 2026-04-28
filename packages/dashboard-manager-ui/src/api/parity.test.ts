import { describe, expect, it } from "vitest";

import { getParityEntries } from "./parity";

describe("parity registry snapshot", () => {
  it("includes the Graphnosis entry with the expected shape", () => {
    const entries = getParityEntries();
    const entry = entries.find(
      (candidate) => candidate.target.toLowerCase() === "graphnosis",
    );

    expect(entry).toBeDefined();
    expect(entry?.verdict).toBe("extract");
    expect(entry?.category).toBe("graph-memory-framework");
    expect(entry?.priority).toBe("P1");
    expect(entry?.features).toHaveLength(22);
    expect(entry?.metrics?.some((metric) => metric.name === "longmemeval_official_accuracy")).toBe(true);
  });

  it("includes the WorldSeed entry with the expected shape", () => {
    const entries = getParityEntries();
    const entry = entries.find(
      (candidate) => candidate.target.toLowerCase() === "worldseed",
    );

    expect(entry).toBeDefined();
    expect(entry?.verdict).toBe("extract");
    expect(entry?.category).toBe("world-runtime");
    expect(entry?.priority).toBe("P1");
    expect(entry?.features).toHaveLength(22);
    expect(entry?.metrics?.some((metric) => metric.name === "targeted_runtime_tests_passed")).toBe(true);
  });
});
