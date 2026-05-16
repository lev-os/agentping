import type {
  LevNowElementCoverageEntry,
  LevNowElementMapEntry,
} from "./types";

export const CANONICAL_LEV_NOW_ELEMENT_COVERAGE: readonly LevNowElementCoverageEntry[] = [
  { type: "hero", component: "Hero", hasAdapter: true },
  { type: "card", component: "Card / StatusCard", hasAdapter: true },
  {
    type: "data-table",
    aliases: ["table"],
    component: "DataTable",
    hasAdapter: true,
  },
  {
    type: "code-block",
    aliases: ["code"],
    component: "Terminal",
    hasAdapter: true,
  },
  { type: "timeline", component: "EventTimeline", hasAdapter: true },
  {
    type: "text",
    aliases: ["markdown"],
    component: "InlineMarkdown",
    hasAdapter: true,
  },
  { type: "feedback", component: "ApprovalQueue", hasAdapter: true },
  {
    type: "inline",
    variants: ["status-badge", "badge", "divider"],
    component: "Badge / <hr>",
    hasAdapter: true,
  },
  { type: "section", component: "(layout wrapper)", hasAdapter: true },
  { type: "chart", component: "InlineChart (SVG)", hasAdapter: true },
  {
    type: "diagram",
    component: "MermaidDiagram (<pre> fallback)",
    hasAdapter: true,
  },
  {
    type: "custom-html",
    component: "CustomHtmlInertPreview (escaped text)",
    hasAdapter: true,
  },
];

export const LEV_NOW_ELEMENT_MAP: Record<string, LevNowElementMapEntry> =
  Object.fromEntries(
    CANONICAL_LEV_NOW_ELEMENT_COVERAGE.map(
      ({ type, component, hasAdapter }) => [
        type,
        { component, hasAdapter },
      ],
    ),
  );
