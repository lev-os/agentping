import { describe, expect, it } from "vitest";
import { LEV_NOW_ELEMENT_MAP } from "./LevNowElement";

/**
 * Tests for LEV_NOW_ELEMENT_MAP — the registry mapping lev-now element
 * types to their React adapter metadata.
 *
 * Pure data-shape tests only (no React rendering) since @testing-library/react
 * is not available in this package.
 */

const CANONICAL_ELEMENT_TYPES = [
  "hero",
  "card",
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

describe("LEV_NOW_ELEMENT_MAP", () => {
  it("exports exactly 12 element type entries", () => {
    expect(Object.keys(LEV_NOW_ELEMENT_MAP)).toHaveLength(12);
  });

  it("contains all 12 canonical element types", () => {
    for (const type of CANONICAL_ELEMENT_TYPES) {
      expect(LEV_NOW_ELEMENT_MAP).toHaveProperty(type);
    }
  });

  it("has no unexpected keys beyond the canonical set", () => {
    const actualKeys = new Set(Object.keys(LEV_NOW_ELEMENT_MAP));
    const expectedKeys = new Set<string>(CANONICAL_ELEMENT_TYPES);
    for (const key of actualKeys) {
      expect(expectedKeys.has(key)).toBe(true);
    }
  });

  describe.each(CANONICAL_ELEMENT_TYPES)("element type '%s'", (type) => {
    it("has hasAdapter set to true", () => {
      const entry = LEV_NOW_ELEMENT_MAP[type];
      expect(entry).toBeDefined();
      expect(entry.hasAdapter).toBe(true);
    });

    it("has a non-empty component string", () => {
      const entry = LEV_NOW_ELEMENT_MAP[type];
      expect(typeof entry.component).toBe("string");
      expect(entry.component.length).toBeGreaterThan(0);
    });
  });

  describe("component name sanity checks", () => {
    it("hero maps to Hero component", () => {
      expect(LEV_NOW_ELEMENT_MAP["hero"].component).toBe("Hero");
    });

    it("data-table maps to DataTable component", () => {
      expect(LEV_NOW_ELEMENT_MAP["data-table"].component).toBe("DataTable");
    });

    it("code-block maps to Terminal component", () => {
      expect(LEV_NOW_ELEMENT_MAP["code-block"].component).toBe("Terminal");
    });

    it("timeline maps to EventTimeline component", () => {
      expect(LEV_NOW_ELEMENT_MAP["timeline"].component).toBe("EventTimeline");
    });

    it("text maps to InlineMarkdown component", () => {
      expect(LEV_NOW_ELEMENT_MAP["text"].component).toBe("InlineMarkdown");
    });

    it("feedback maps to ApprovalQueue component", () => {
      expect(LEV_NOW_ELEMENT_MAP["feedback"].component).toBe("ApprovalQueue");
    });

    it("card includes Card or StatusCard in the component name", () => {
      const component = LEV_NOW_ELEMENT_MAP["card"].component;
      expect(component.includes("Card") || component.includes("StatusCard")).toBe(true);
    });
  });
});
