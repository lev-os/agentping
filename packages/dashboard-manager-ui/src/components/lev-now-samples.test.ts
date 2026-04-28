import { describe, expect, it } from "vitest";
import { LEV_NOW_SAMPLES } from "./lev-now-samples";
import type { LevNowSample } from "./lev-now-samples";

/**
 * Tests for LEV_NOW_SAMPLES — the canonical sample RenderSpecs
 * for every LevNowElement adapter.
 */

const CANONICAL_KEYS = [
  "hero",
  "card",
  "card-kpi",
  "data-table",
  "code-block",
  "timeline",
  "text",
  "feedback",
  "inline",
  "section",
  "chart",
  "diagram",
  "custom-html",
] as const;

describe("LEV_NOW_SAMPLES", () => {
  it("exports exactly 13 entries (12 element types + card-kpi variant)", () => {
    expect(Object.keys(LEV_NOW_SAMPLES)).toHaveLength(13);
  });

  it("contains all 13 canonical keys", () => {
    for (const key of CANONICAL_KEYS) {
      expect(LEV_NOW_SAMPLES).toHaveProperty(key);
    }
  });

  it("has no unexpected keys beyond the canonical set", () => {
    const actualKeys = new Set(Object.keys(LEV_NOW_SAMPLES));
    const expectedKeys = new Set<string>(CANONICAL_KEYS);
    for (const key of actualKeys) {
      expect(expectedKeys.has(key)).toBe(true);
    }
  });

  describe.each(CANONICAL_KEYS)("sample '%s'", (key) => {
    let sample: LevNowSample;

    // Safe to assert existence — covered by the "contains all canonical keys" test
    // but we need the value for per-key tests.
    it("exists in the map", () => {
      sample = LEV_NOW_SAMPLES[key]!;
      expect(sample).toBeDefined();
    });

    it("has a non-empty 'label' string", () => {
      sample = LEV_NOW_SAMPLES[key]!;
      expect(typeof sample.label).toBe("string");
      expect(sample.label.length).toBeGreaterThan(0);
    });

    it("has a non-empty 'type' string", () => {
      sample = LEV_NOW_SAMPLES[key]!;
      expect(typeof sample.type).toBe("string");
      expect(sample.type.length).toBeGreaterThan(0);
    });

    it("has a 'props' object with at least one property", () => {
      sample = LEV_NOW_SAMPLES[key]!;
      expect(typeof sample.props).toBe("object");
      expect(sample.props).not.toBeNull();
      expect(Object.keys(sample.props).length).toBeGreaterThan(0);
    });
  });

  describe("type field correctness", () => {
    it("card-kpi has type 'card' (variant, not a separate element type)", () => {
      expect(LEV_NOW_SAMPLES["card-kpi"]!.type).toBe("card");
    });

    it("card-kpi has variant 'kpi'", () => {
      expect(LEV_NOW_SAMPLES["card-kpi"]!.variant).toBe("kpi");
    });

    it("each non-variant key has a type matching its key", () => {
      const variantKeys = new Set(["card-kpi"]);
      for (const key of CANONICAL_KEYS) {
        if (variantKeys.has(key)) continue;
        expect(LEV_NOW_SAMPLES[key]!.type).toBe(key);
      }
    });
  });

  describe("data-table sample props", () => {
    it("has columns array with objects containing key and label", () => {
      const { columns } = LEV_NOW_SAMPLES["data-table"]!.props as {
        columns: Array<{ key: string; label: string }>;
      };
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
      for (const col of columns) {
        expect(typeof col.key).toBe("string");
        expect(typeof col.label).toBe("string");
      }
    });

    it("has rows array", () => {
      const { rows } = LEV_NOW_SAMPLES["data-table"]!.props as {
        rows: unknown[];
      };
      expect(Array.isArray(rows)).toBe(true);
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe("timeline sample props", () => {
    it("has items array with date, title, and status fields", () => {
      const { items } = LEV_NOW_SAMPLES["timeline"]!.props as {
        items: Array<{ date: string; title: string; status: string }>;
      };
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(typeof item.date).toBe("string");
        expect(typeof item.title).toBe("string");
        expect(typeof item.status).toBe("string");
      }
    });
  });

  describe("chart sample props", () => {
    it("has chartType, labels, and datasets", () => {
      const props = LEV_NOW_SAMPLES["chart"]!.props as {
        chartType: string;
        labels: string[];
        datasets: unknown[];
      };
      expect(typeof props.chartType).toBe("string");
      expect(Array.isArray(props.labels)).toBe(true);
      expect(Array.isArray(props.datasets)).toBe(true);
      expect(props.datasets.length).toBeGreaterThan(0);
    });
  });

  describe("feedback sample props", () => {
    it("has items array with id and title", () => {
      const { items } = LEV_NOW_SAMPLES["feedback"]!.props as {
        items: Array<{ id: string; title: string }>;
      };
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(typeof item.id).toBe("string");
        expect(typeof item.title).toBe("string");
      }
    });
  });
});
