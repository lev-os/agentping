import { describe, expect, it } from "vitest";
import { isValidElement, type ReactNode } from "react";
import {
  buildInertCustomHtmlPreview,
  CustomHtmlAdapter,
} from "./inline-adapters";
import { LEV_NOW_ELEMENT_MAP } from "./LevNowElement";
import { CANONICAL_LEV_NOW_ELEMENT_COVERAGE } from "./metadata";
import {
  getLevNowRuntimeIntentMetadata,
  LevNowPacketRenderer,
  type LevNowRenderPacket,
} from "./packet";
import { LEV_NOW_RENDER_RECIPES } from "./recipes";
import {
  translateDataTableColumns,
  translateFeedbackItems,
  translateInlineBadgeVariant,
  translateTimelineItems,
} from "./translators";

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

describe("custom-html inert adapter", () => {
  const hostileHtml =
    '<img src=x onerror="globalThis.__levNowExecuted = true"><script>globalThis.__levNowExecuted = true</script>';
  const hostileCss = "body { display: none !important; }";
  const hostileJs = "globalThis.__levNowExecuted = true";

  it("preserves custom-html payloads as explicit escaped preview sections", () => {
    expect(
      buildInertCustomHtmlPreview({
        html: hostileHtml,
        css: hostileCss,
        js: hostileJs,
      }),
    ).toEqual([
      { label: "html", language: "html", content: hostileHtml },
      { label: "css", language: "css", content: hostileCss },
      { label: "js", language: "javascript", content: hostileJs },
    ]);
  });

  it("does not emit dangerous HTML injection props for hostile custom-html", () => {
    const rendered = CustomHtmlAdapter({
      html: hostileHtml,
      css: hostileCss,
      js: hostileJs,
    });

    expect(findDangerousHtmlProps(rendered)).toEqual([]);
  });
});

function findDangerousHtmlProps(node: ReactNode): unknown[] {
  const found: unknown[] = [];

  function visit(value: ReactNode): void {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!isValidElement<{
      children?: ReactNode;
      dangerouslySetInnerHTML?: unknown;
    }>(value)) {
      return;
    }

    if (value.props.dangerouslySetInnerHTML) {
      found.push(value.props.dangerouslySetInnerHTML);
    }
    visit(value.props.children);
  }

  visit(node);
  return found;
}

describe("CANONICAL_LEV_NOW_ELEMENT_COVERAGE", () => {
  it("is the source list for LEV_NOW_ELEMENT_MAP", () => {
    expect(CANONICAL_LEV_NOW_ELEMENT_COVERAGE).toHaveLength(12);
    expect(CANONICAL_LEV_NOW_ELEMENT_COVERAGE.map((entry) => entry.type)).toEqual(
      CANONICAL_ELEMENT_TYPES,
    );
  });

  it("makes table, code, markdown, badge, divider, and custom-html coverage explicit", () => {
    const byType = Object.fromEntries(
      CANONICAL_LEV_NOW_ELEMENT_COVERAGE.map((entry) => [entry.type, entry]),
    );

    expect(byType["data-table"]?.aliases).toContain("table");
    expect(byType["code-block"]?.aliases).toContain("code");
    expect(byType["text"]?.aliases).toContain("markdown");
    expect(byType["inline"]?.variants).toEqual([
      "status-badge",
      "badge",
      "divider",
    ]);
    expect(byType["custom-html"]?.component).toContain("CustomHtml");
  });

  it("has a render recipe for every mapped element type", () => {
    expect(Object.keys(LEV_NOW_RENDER_RECIPES).sort()).toEqual(
      Object.keys(LEV_NOW_ELEMENT_MAP).sort(),
    );
  });
});

describe("renderer-local translators", () => {
  it("translates data-table columns to DataTable headers", () => {
    expect(
      translateDataTableColumns([{ key: "name", label: "Name" }]),
    ).toEqual([{ key: "name", header: "Name" }]);
  });

  it("translates timeline item status to EventTimeline type", () => {
    expect(
      translateTimelineItems([
        { date: "2026-05-16", title: "Done", status: "completed" },
        { date: "2026-05-17", title: "Next", status: "upcoming" },
      ]),
    ).toEqual([
      {
        id: "0",
        timestamp: "2026-05-16",
        title: "Done",
        description: undefined,
        type: "success",
      },
      {
        id: "1",
        timestamp: "2026-05-17",
        title: "Next",
        description: undefined,
        type: "warning",
      },
    ]);
  });

  it("translates feedback items to pending approvals without executing callbacks", () => {
    const approvals = translateFeedbackItems([
      {
        id: "approve-1",
        title: "Review",
        options: [{ label: "Accept" }, { label: "Reject" }],
      },
    ]);

    expect(approvals).toHaveLength(1);
    expect(approvals[0]?.id).toBe("approve-1");
    expect(approvals[0]?.toolName).toBe("Review");
    expect(approvals[0]?.description).toBe("Options: Accept, Reject");
    expect(approvals[0]?.timestamp).toBeInstanceOf(Date);
  });

  it("translates status badge variants to Badge variants", () => {
    expect(translateInlineBadgeVariant("match")).toBe("success");
    expect(translateInlineBadgeVariant("gap")).toBe("destructive");
    expect(translateInlineBadgeVariant("warn")).toBe("warning");
    expect(translateInlineBadgeVariant("unknown")).toBe("default");
  });
});

describe("LevNowPacketRenderer", () => {
  it("renders a Solaris dogfood-shaped RenderSpec packet through root and child ids", () => {
    const { packet } = createSolarisDogfoodPacket();
    const rendered = LevNowPacketRenderer({ packet });
    const renderedProps = rendered.props as Record<string, unknown>;

    expect(renderedProps["data-lev-now-packet-renderer"]).toBe("true");
    expect(renderedProps["data-lev-now-title"]).toBe("Solaris Arena Dogfood");
    expect(renderedProps["data-lev-now-theme"]).toBe("obsidian-monolith");
    expect(flattenText(rendered)).toContain("Repo-native proof surface");
    expect(flattenText(rendered)).toContain("Parity canon");
    expect(flattenText(rendered)).toContain("static path proven");
    expect(flattenText(rendered)).toContain("runtime blocked");
  });

  it("preserves runtime_intent metadata as inert data and never invokes declarations", () => {
    const { packet, wasInvoked } = createSolarisDogfoodPacket();

    expect(getLevNowRuntimeIntentMetadata(packet)).toBe(packet.runtime_intent);
    LevNowPacketRenderer({ packet });
    expect(wasInvoked()).toBe(false);
  });

  it("supports older runtimeIntent metadata as read-only compatibility data", () => {
    const legacyRuntimeIntent = {
      schema: "lev.genui.runtime_intent.v0",
      actions: [{ id: "legacy-action", kind: "callTool" }],
    };
    const packet: LevNowRenderPacket = {
      meta: { title: "Legacy runtimeIntent packet" },
      theme: { preset: "obsidian-monolith", mode: "dark" },
      root: ["hero"],
      elements: {
        hero: {
          type: "hero",
          props: { title: "Legacy runtimeIntent packet" },
        },
      },
      runtimeIntent: legacyRuntimeIntent,
    };

    expect(getLevNowRuntimeIntentMetadata(packet)).toBe(legacyRuntimeIntent);
  });
});

function createSolarisDogfoodPacket(): {
  packet: LevNowRenderPacket;
  wasInvoked: () => boolean;
} {
  let invoked = false;
  const runtimeDeclaration = () => {
    invoked = true;
  };

  return {
    packet: {
      meta: {
        title: "Solaris Arena Dogfood",
        description:
          "A harder proof that OpenLang can author Lev's own GenUI parity evidence.",
        layout: "sidebar-toc",
      },
      theme: {
        preset: "obsidian-monolith",
        mode: "dark",
      },
      root: ["hero", "arena"],
      elements: {
        hero: {
          type: "hero",
          props: {
            title: "Solaris Arena Dogfood",
            subtitle: "OpenLang authors the proof page that proves OpenLang",
            category: "SOLARIS GAUNTLET",
            meta: "Static mode only; runtime stays FlowMind/Poly",
          },
        },
        arena: {
          type: "section",
          variant: "card-grid",
          props: {
            label: "Arena",
            title: "Repo-native proof surface",
            subtitle:
              "The page describes the same parity and Solaris files that cite it.",
            id: "arena",
          },
          children: ["canon", "static-pass", "runtime-blocked", "divider-a"],
        },
        canon: {
          type: "card",
          props: {
            title: "Parity canon",
            label: ".lev/pm/parity/openui-ui-ir.yaml",
            content:
              "The OpenUI row stays source of truth while the spike only shifts compact source and typed AST features to partial.",
          },
        },
        "static-pass": {
          type: "inline",
          variant: "status-badge",
          props: {
            label: "static path proven",
            variant: "match",
          },
        },
        "runtime-blocked": {
          type: "inline",
          variant: "status-badge",
          props: {
            label: "runtime blocked",
            variant: "warn",
          },
        },
        "divider-a": {
          type: "inline",
          variant: "divider",
          props: {},
        },
      },
      runtime_intent: {
        schema: "lev.genui.runtime_intent.v0",
        declarations: [
          {
            id: "blocked-runtime-action",
            kind: "callTool",
            handler: runtimeDeclaration,
          },
        ],
      },
    },
    wasInvoked: () => invoked,
  };
}

function flattenText(node: ReactNode): string {
  const chunks: string[] = [];

  function visit(value: ReactNode): void {
    if (typeof value === "string" || typeof value === "number") {
      chunks.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!isValidElement<{ children?: ReactNode }>(value)) {
      return;
    }

    visit(value.props.children);
  }

  visit(node);
  return chunks.join(" ");
}
