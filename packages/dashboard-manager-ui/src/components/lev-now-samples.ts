/**
 * lev-now-samples — Canonical sample RenderSpecs for every LevNowElement adapter.
 *
 * Single source of truth shared by:
 *   - PreviewGallery        (renders ALL samples as a 12-card grid)
 *   - ComponentDetail       (renders ONE sample scoped to the current component's
 *                            `levNowElement` field)
 *
 * Realistic prop shapes mirror examples in `plugins/now/examples/*.json` and the
 * canonical schema at `plugins/now/src/contracts/schema.ts`.
 *
 * Keys:
 *   hero, card, card-kpi, data-table, code-block, timeline, text, feedback,
 *   inline, section, chart, diagram, custom-html
 *
 * The `card-kpi` entry is treated as a `card` with `variant: "kpi"` — included
 * as a separate key for the gallery, but the underlying type is still `card`.
 */

export interface LevNowSample {
  label: string;
  type: string;
  variant?: string;
  props: Record<string, unknown>;
}

export const LEV_NOW_SAMPLES: Record<string, LevNowSample> = {
  hero: {
    label: "hero",
    type: "hero",
    variant: "centered",
    props: {
      category: "OPERATIONS",
      title: "Sprint 14 Dashboard",
      subtitle: "lev.now MVP — Week 2 of 2",
      meta: "Last updated: 2026-04-03 08:00 UTC",
    },
  },
  card: {
    label: "card (default)",
    type: "card",
    variant: "default",
    props: {
      label: "Key Architecture Decisions",
      title: "Flat element map",
      content:
        "Streaming renders the element map incrementally. No nested tree — every element is keyed by unique ID in a flat Record.",
    },
  },
  "card-kpi": {
    label: "card (kpi variant)",
    type: "card",
    variant: "kpi",
    props: {
      value: "42",
      label: "Story Points",
      trend: { direction: "up", value: "+8 vs S13" },
      sparkline: [28, 31, 35, 38, 40, 42],
    },
  },
  "data-table": {
    label: "data-table",
    type: "data-table",
    props: {
      columns: [
        { key: "renderer", label: "Renderer" },
        { key: "status", label: "Status" },
        { key: "loc", label: "LOC", numeric: true },
      ],
      rows: [
        { renderer: "hero", status: "complete", loc: 48 },
        { renderer: "card", status: "complete", loc: 112 },
        { renderer: "data-table", status: "complete", loc: 87 },
        { renderer: "timeline", status: "complete", loc: 64 },
      ],
      caption: "Renderer coverage for Sprint 14",
      stickyHeader: true,
    },
  },
  "code-block": {
    label: "code-block",
    type: "code-block",
    props: {
      content:
        "pipeline:\n  concurrency: 32\n  timeout_ms: 5000\n  max_elements: 500\n  streaming:\n    enabled: true\n    protocol: jsonl",
      language: "yaml",
      filename: "render-pipeline.yaml",
      showLineNumbers: true,
    },
  },
  timeline: {
    label: "timeline",
    type: "timeline",
    props: {
      items: [
        {
          date: "2026-03-31",
          title: "CDO Deliberation",
          description:
            "3-turn, 8-agent architecture decision. BUILD verdict at 0.88 confidence.",
          status: "completed",
        },
        {
          date: "2026-04-01",
          title: "Zod Schemas + Scaffold",
          description: "735-line schema, 8+1 renderers defined.",
          status: "completed",
        },
        {
          date: "2026-04-03",
          title: "Visual Polish Loop",
          description: "7 ticks of CSS refinement. Gold standard achieved.",
          status: "in-progress",
        },
        {
          date: "2026-04-07",
          title: "Hono API",
          description: "POST /api/v1/renders on Cloudflare Workers.",
          status: "upcoming",
        },
      ],
    },
  },
  text: {
    label: "text (prose)",
    type: "text",
    variant: "prose",
    props: {
      content:
        "**GenUI absorption** renders `lev-now` specs as _real React components_ instead of static HTML. Specs stream as JSONL and mount incrementally.",
      maxWidth: "65ch",
    },
  },
  feedback: {
    label: "feedback",
    type: "feedback",
    props: {
      pageId: "registry-preview-gallery",
      title: "Pending Reviews",
      items: [
        {
          id: "r1",
          title: "Badge conflict resolution",
          insight: "WebUI and Studio variants differ in padding by 2px.",
          options: [
            { label: "Adopt WebUI padding" },
            { label: "Adopt Studio padding" },
            { label: "Reconcile both at 10px", recommended: true },
          ],
        },
        {
          id: "r2",
          title: "Button disabled-state token",
          insight: "Opacity 0.4 vs 0.5 drift across consumers.",
          options: [{ label: "Canonical: 0.4" }, { label: "Canonical: 0.5" }],
        },
      ],
    },
  },
  inline: {
    label: "inline (status-badge)",
    type: "inline",
    variant: "status-badge",
    props: { label: "MATCH", variant: "match" },
  },
  section: {
    label: "section",
    type: "section",
    variant: "default",
    props: {
      label: "PREVIEW",
      title: "Section Wrapper",
      subtitle: "Layout container with title/subtitle header.",
      id: "preview-section",
    },
  },
  chart: {
    label: "chart (bar)",
    type: "chart",
    props: {
      chartType: "bar",
      title: "RENDERER COVERAGE",
      labels: ["hero", "card", "table", "timeline", "text", "code"],
      datasets: [
        {
          label: "Lines of code",
          data: [48, 112, 87, 64, 32, 58],
          backgroundColor: [
            "#6366f1",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#06b6d4",
          ],
          borderRadius: 3,
        },
      ],
      height: 200,
    },
  },
  diagram: {
    label: "diagram (mermaid)",
    type: "diagram",
    props: {
      engine: "mermaid",
      content:
        "graph TD\n  Client -->|POST /renders| Workers[CF Workers]\n  Workers -->|sync| Handler[Poly Handler]\n  Workers -->|async| Queue[CF Queues]\n  Queue --> Renderer[Bun Renderer]\n  Handler --> Engine[Template Engine]",
      caption: "Render pipeline: Workers → Handler → Engine",
    },
  },
  "custom-html": {
    label: "custom-html",
    type: "custom-html",
    props: {
      html: '<div class="ch-box"><strong>Custom HTML escape hatch.</strong> Rendered via scoped dangerouslySetInnerHTML.</div>',
      css: ".ch-box { padding: 12px 16px; border: 1px dashed rgba(34,211,238,0.5); border-radius: 6px; color: #22d3ee; font-family: var(--font-mono); font-size: 12px; }",
    },
  },
};
