"use client";

/**
 * LevNowElement — GenUI absorption layer.
 *
 * Bridges lev-now RenderSpec JSON elements to agentping React components.
 * When an agent streams a lev-now spec, the dashboard renders it using
 * real React components instead of static HTML.
 *
 * @module @kingly/ui/genui/LevNowElement
 */

import * as React from "react";

// -- Mapped agentping components ------------------------------------------
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../migrations/card";
import { StatusCard } from "../migrations/status-card";
import { DataTable } from "../migrations/data-table";
import type { DataTableColumn } from "../migrations/data-table";
import { Terminal } from "../migrations/terminal";
import { EventTimeline } from "../migrations/event-timeline";
import type { TimelineEvent } from "../migrations/event-timeline";
import { Hero } from "../migrations/hero";
import { InlineMarkdown } from "../migrations/inline-markdown";
import { ApprovalQueue } from "../migrations/approval-queue";
import type { PendingApproval } from "../migrations/approval-queue";
import { Badge } from "../ui/badge";

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------

export interface LevNowElementProps {
  /** lev-now element type discriminator */
  type: string;
  /** Element variant (e.g. 'kpi' for card, 'status-badge' for inline) */
  variant?: string;
  /** Element-specific props from RenderSpec */
  props: Record<string, unknown>;
  /** Children rendered inside layout wrappers (section, card) */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Placeholder for unmapped types
// ---------------------------------------------------------------------------

function Placeholder({ type }: { type: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{type}</CardTitle>
        <CardDescription>No React adapter yet</CardDescription>
      </CardHeader>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Prop translators
// ---------------------------------------------------------------------------

/**
 * lev-now data-table columns use `{ key, label }`.
 * React DataTable uses `{ key, header }`.
 */
function translateDataTableColumns(
  columns: Array<{ key: string; label: string; [k: string]: unknown }>
): DataTableColumn<Record<string, unknown>>[] {
  return columns.map((col) => ({
    key: col.key,
    header: col.label,
  }));
}

/**
 * lev-now timeline items use `{ date, title, description, status }`.
 * React EventTimeline uses `{ id, timestamp, title, description, type }`.
 */
function translateTimelineItems(
  items: Array<{
    date: string;
    title: string;
    description?: string;
    status?: string;
  }>
): TimelineEvent[] {
  const statusToType: Record<string, TimelineEvent["type"]> = {
    completed: "success",
    "in-progress": "info",
    upcoming: "warning",
  };

  return items.map((item, i) => ({
    id: String(i),
    timestamp: item.date,
    title: item.title,
    description: item.description,
    type: statusToType[item.status ?? ""] ?? "info",
  }));
}

/**
 * lev-now feedback items → ApprovalQueue PendingApproval[].
 * This is a lossy bridge — feedback is richer than approvals.
 * We map each feedback item to a pending approval for basic display.
 */
function translateFeedbackItems(
  items: Array<{
    id: string;
    title: string;
    insight?: string;
    options?: Array<{ label: string }>;
  }>
): PendingApproval[] {
  return items.map((item) => ({
    id: item.id,
    toolName: item.title,
    description:
      item.insight ??
      (item.options
        ? `Options: ${item.options.map((o) => o.label).join(", ")}`
        : undefined),
    timestamp: new Date(),
  }));
}

// ---------------------------------------------------------------------------
// Mapping table (exported for introspection / testing)
// ---------------------------------------------------------------------------

/**
 * Registry of lev-now element types to their React adapter metadata.
 * `null` adapter means the type uses inline rendering logic (section,
 * custom-html) or a placeholder (chart, diagram).
 */
export const LEV_NOW_ELEMENT_MAP: Record<
  string,
  { component: string; hasAdapter: boolean }
> = {
  hero: { component: "Hero", hasAdapter: true },
  card: { component: "Card / StatusCard", hasAdapter: true },
  "data-table": { component: "DataTable", hasAdapter: true },
  "code-block": { component: "Terminal", hasAdapter: true },
  timeline: { component: "EventTimeline", hasAdapter: true },
  text: { component: "InlineMarkdown", hasAdapter: true },
  feedback: { component: "ApprovalQueue", hasAdapter: true },
  inline: { component: "Badge / <hr>", hasAdapter: true },
  section: { component: "(layout wrapper)", hasAdapter: true },
  chart: { component: "InlineChart (SVG)", hasAdapter: true },
  diagram: { component: "MermaidDiagram (<pre> fallback)", hasAdapter: true },
  "custom-html": { component: "CustomHtml (scoped shadow container)", hasAdapter: true },
};

// ---------------------------------------------------------------------------
// Inline adapters: chart, diagram, custom-html
// ---------------------------------------------------------------------------

interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

interface InlineChartProps {
  chartType: "bar" | "doughnut" | "line" | "pie";
  title?: string;
  labels: string[];
  datasets: ChartDataset[];
  height?: number;
  cutout?: string;
}

const CHART_DEFAULT_PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

function resolveColor(
  color: string | string[] | undefined,
  index: number,
  fallbackIndex: number = index,
): string {
  if (Array.isArray(color)) {
    return color[index] ?? CHART_DEFAULT_PALETTE[fallbackIndex % CHART_DEFAULT_PALETTE.length]!;
  }
  if (typeof color === "string") return color;
  return CHART_DEFAULT_PALETTE[fallbackIndex % CHART_DEFAULT_PALETTE.length]!;
}

/**
 * InlineChart — library-free renderer for lev-now chart elements.
 * Renders bar/line as SVG plots, pie/doughnut as SVG arc slices.
 * Deliberately minimal: no axes ticks, no legend interactions.
 */
function InlineChart({
  chartType,
  title,
  labels,
  datasets,
  height = 200,
  cutout,
}: InlineChartProps) {
  const width = 480;
  const padding = 24;

  if (datasets.length === 0) {
    return <Placeholder type="chart (no datasets)" />;
  }

  const renderBars = () => {
    const allValues = datasets.flatMap((d) => d.data);
    const max = Math.max(...allValues, 1);
    const groupCount = labels.length;
    const groupWidth = (width - padding * 2) / Math.max(groupCount, 1);
    const barWidth = groupWidth / datasets.length;
    const plotHeight = height - padding * 2;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={title ?? "bar chart"}
      >
        {datasets.map((ds, dsIdx) =>
          ds.data.map((value, i) => {
            const h = (value / max) * plotHeight;
            const x = padding + i * groupWidth + dsIdx * barWidth;
            const y = height - padding - h;
            return (
              <rect
                key={`${dsIdx}-${i}`}
                x={x}
                y={y}
                width={Math.max(barWidth - 2, 1)}
                height={h}
                rx={ds.borderRadius ?? 2}
                fill={resolveColor(ds.backgroundColor, i, dsIdx)}
                stroke={ds.borderColor}
                strokeWidth={ds.borderWidth}
              >
                <title>{`${labels[i] ?? ""}: ${value}`}</title>
              </rect>
            );
          }),
        )}
        {labels.map((label, i) => (
          <text
            key={`lbl-${i}`}
            x={padding + i * groupWidth + groupWidth / 2}
            y={height - padding / 3}
            fontSize="10"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.6"
          >
            {label}
          </text>
        ))}
      </svg>
    );
  };

  const renderLine = () => {
    const allValues = datasets.flatMap((d) => d.data);
    const max = Math.max(...allValues, 1);
    const min = Math.min(...allValues, 0);
    const range = max - min || 1;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={title ?? "line chart"}
      >
        {datasets.map((ds, dsIdx) => {
          const points = ds.data
            .map((value, i) => {
              const x =
                padding + (i / Math.max(ds.data.length - 1, 1)) * plotWidth;
              const y =
                height - padding - ((value - min) / range) * plotHeight;
              return `${x},${y}`;
            })
            .join(" ");
          const stroke =
            ds.borderColor ??
            resolveColor(ds.backgroundColor, 0, dsIdx);
          return (
            <polyline
              key={dsIdx}
              fill="none"
              stroke={stroke}
              strokeWidth={ds.borderWidth ?? 2}
              points={points}
            />
          );
        })}
      </svg>
    );
  };

  const renderPie = () => {
    const ds = datasets[0]!;
    const total = ds.data.reduce((acc, v) => acc + v, 0) || 1;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(cx, cy) - padding;
    const innerR =
      chartType === "doughnut"
        ? parseDoughnutCutout(cutout, r)
        : 0;

    let startAngle = -Math.PI / 2;
    const paths: React.ReactElement[] = [];

    ds.data.forEach((value, i) => {
      const sweep = (value / total) * Math.PI * 2;
      const endAngle = startAngle + sweep;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = sweep > Math.PI ? 1 : 0;

      let d: string;
      if (innerR > 0) {
        const ix1 = cx + innerR * Math.cos(endAngle);
        const iy1 = cy + innerR * Math.sin(endAngle);
        const ix2 = cx + innerR * Math.cos(startAngle);
        const iy2 = cy + innerR * Math.sin(startAngle);
        d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
      } else {
        d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }

      paths.push(
        <path
          key={i}
          d={d}
          fill={resolveColor(ds.backgroundColor, i, i)}
          stroke={ds.borderColor ?? "var(--background, #fff)"}
          strokeWidth={ds.borderWidth ?? 1}
        >
          <title>{`${labels[i] ?? ""}: ${value}`}</title>
        </path>,
      );

      startAngle = endAngle;
    });

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={title ?? `${chartType} chart`}
      >
        {paths}
      </svg>
    );
  };

  const body =
    chartType === "line"
      ? renderLine()
      : chartType === "pie" || chartType === "doughnut"
        ? renderPie()
        : renderBars();

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-xs font-mono uppercase tracking-wider">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>{body}</CardContent>
    </Card>
  );
}

function parseDoughnutCutout(cutout: string | undefined, r: number): number {
  if (!cutout) return r * 0.55;
  const m = /^([0-9]+(?:\.[0-9]+)?)%?$/.exec(cutout.trim());
  if (!m) return r * 0.55;
  const n = Number(m[1]);
  if (Number.isNaN(n)) return r * 0.55;
  if (cutout.includes("%")) return (n / 100) * r;
  return Math.min(n, r - 2);
}

interface MermaidDiagramProps {
  content: string;
  caption?: string;
}

/**
 * MermaidDiagram — library-free fallback. We do not add mermaid as a
 * runtime dep here; instead we render the source as a code block. Hosts
 * that have mermaid loaded globally can post-process `.language-mermaid`
 * blocks. The RenderSpec only declares engine='mermaid' today.
 */
function MermaidDiagram({ content, caption }: MermaidDiagramProps) {
  return (
    <Card>
      <CardContent>
        <pre className="language-mermaid text-xs font-mono whitespace-pre overflow-x-auto rounded bg-muted/40 p-3">
          <code>{content}</code>
        </pre>
        {caption && (
          <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface CustomHtmlAdapterProps {
  html: string;
  css?: string;
  js?: string;
}

/**
 * CustomHtmlAdapter — escape hatch renderer.
 * Uses dangerouslySetInnerHTML inside a scoped container. We inject
 * any provided CSS in a <style> block above the HTML. JS is intentionally
 * NOT executed — React does not run inline <script> tags injected via
 * innerHTML, and eval'ing arbitrary JS is unsafe. The `js` prop is
 * rendered as a disclosed code block so operators can audit it.
 */
function CustomHtmlAdapter({ html, css, js }: CustomHtmlAdapterProps) {
  const scopedHtml = css ? `<style>${css}</style>${html}` : html;
  return (
    <div className="lev-now-custom-html">
      <div dangerouslySetInnerHTML={{ __html: scopedHtml }} />
      {js && (
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer text-muted-foreground">
            custom-html: inline JS present (not executed)
          </summary>
          <pre className="mt-1 font-mono whitespace-pre overflow-x-auto rounded bg-muted/40 p-2">
            <code>{js}</code>
          </pre>
        </details>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a single lev-now element as a React component.
 *
 * @example
 * ```tsx
 * <LevNowElement
 *   type="data-table"
 *   props={{
 *     columns: [{ key: "name", label: "Name" }],
 *     rows: [{ name: "Alice" }],
 *   }}
 * />
 * ```
 */
export function LevNowElement({
  type,
  variant,
  props,
  children,
}: LevNowElementProps): React.ReactElement {
  switch (type) {
    // ---- hero ----
    case "hero": {
      const { title, subtitle, category, meta } = props as {
        title?: string;
        subtitle?: string;
        category?: string;
        meta?: string;
      };
      return (
        <Hero
          title={title ?? ""}
          subtitle={subtitle}
          version={category}
        >
          {meta && (
            <p className="text-sm text-muted-foreground font-mono">{meta}</p>
          )}
          {children}
        </Hero>
      );
    }

    // ---- card (kpi variant → StatusCard, default → Card) ----
    case "card": {
      if (variant === "kpi") {
        const { value, label, trend } = props as {
          value?: string | number;
          label?: string;
          trend?: { direction: string; value: string };
        };
        return (
          <StatusCard
            title={label}
            value={value != null ? String(value) : undefined}
            description={trend ? `${trend.direction} ${trend.value}` : undefined}
          />
        );
      }

      // Default / elevated / other card variants
      const { label, title, content } = props as {
        label?: string;
        title?: string;
        content?: string;
      };
      return (
        <Card>
          {(label || title) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {label && <CardDescription>{label}</CardDescription>}
            </CardHeader>
          )}
          {(content || children) && (
            <CardContent>
              {content && (
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {content}
                </p>
              )}
              {children}
            </CardContent>
          )}
        </Card>
      );
    }

    // ---- data-table ----
    case "data-table": {
      const { columns, rows } = props as {
        columns?: Array<{ key: string; label: string }>;
        rows?: Record<string, unknown>[];
      };
      if (!columns || !rows) {
        return <Placeholder type="data-table (missing columns/rows)" />;
      }
      return (
        <DataTable
          columns={translateDataTableColumns(columns)}
          data={rows}
        />
      );
    }

    // ---- code-block → Terminal ----
    case "code-block": {
      const { content, filename, language } = props as {
        content?: string;
        filename?: string;
        language?: string;
      };
      const lines = content ? content.split("\n") : [];
      return (
        <Terminal
          tabs={[
            {
              id: "code",
              title: filename ?? language ?? "code",
            },
          ]}
          outputLines={lines}
        />
      );
    }

    // ---- timeline ----
    case "timeline": {
      const { items } = props as {
        items?: Array<{
          date: string;
          title: string;
          description?: string;
          status?: string;
        }>;
      };
      if (!items) {
        return <Placeholder type="timeline (missing items)" />;
      }
      return <EventTimeline events={translateTimelineItems(items)} />;
    }

    // ---- text → InlineMarkdown ----
    case "text": {
      const { content } = props as { content?: string };
      return <InlineMarkdown content={content} />;
    }

    // ---- inline (status-badge | divider) ----
    case "inline": {
      if (variant === "status-badge") {
        const { label, variant: badgeVariant } = props as {
          label?: string;
          variant?: string;
        };
        const variantMap: Record<string, "default" | "success" | "warning" | "destructive"> = {
          match: "success",
          gap: "destructive",
          warn: "warning",
          info: "default",
        };
        return (
          <Badge variant={variantMap[badgeVariant ?? "info"] ?? "default"}>
            {label ?? ""}
          </Badge>
        );
      }

      if (variant === "divider") {
        return <hr className="border-border my-4" />;
      }

      return <Placeholder type={`inline (unknown variant: ${variant})`} />;
    }

    // ---- feedback → ApprovalQueue ----
    case "feedback": {
      const { title, items } = props as {
        title?: string;
        items?: Array<{
          id: string;
          title: string;
          insight?: string;
          options?: Array<{ label: string }>;
        }>;
      };
      if (!items || items.length === 0) {
        return <Placeholder type="feedback (no items)" />;
      }
      return (
        <Card>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>
            <ApprovalQueue approvals={translateFeedbackItems(items)} />
          </CardContent>
        </Card>
      );
    }

    // ---- section (layout wrapper) ----
    case "section": {
      const { label, title, subtitle, id } = props as {
        label?: string;
        title?: string;
        subtitle?: string;
        id?: string;
      };
      return (
        <section id={id} className="space-y-4">
          {(label || title || subtitle) && (
            <div className="space-y-1">
              {label && (
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {label}
                </span>
              )}
              {title && (
                <h2 className="text-lg font-display font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </section>
      );
    }

    // ---- chart (SVG, library-free) ----
    case "chart": {
      const {
        chartType,
        title,
        labels,
        datasets,
        height,
        cutout,
      } = props as {
        chartType?: "bar" | "doughnut" | "line" | "pie";
        title?: string;
        labels?: string[];
        datasets?: ChartDataset[];
        height?: number;
        cutout?: string;
      };
      if (!chartType || !labels || !datasets) {
        return <Placeholder type="chart (missing chartType/labels/datasets)" />;
      }
      return (
        <InlineChart
          chartType={chartType}
          title={title}
          labels={labels}
          datasets={datasets}
          height={height}
          cutout={cutout}
        />
      );
    }

    // ---- diagram (mermaid source, rendered as <pre>) ----
    case "diagram": {
      const { engine, content, caption } = props as {
        engine?: string;
        content?: string;
        caption?: string;
      };
      if (!content) {
        return <Placeholder type="diagram (missing content)" />;
      }
      if (engine && engine !== "mermaid") {
        return (
          <Placeholder type={`diagram (unsupported engine: ${engine})`} />
        );
      }
      return <MermaidDiagram content={content} caption={caption} />;
    }

    // ---- custom-html (scoped dangerouslySetInnerHTML + optional <style>) ----
    case "custom-html": {
      const { html, css, js } = props as {
        html?: string;
        css?: string;
        js?: string;
      };
      if (typeof html !== "string") {
        return <Placeholder type="custom-html (missing html)" />;
      }
      return <CustomHtmlAdapter html={html} css={css} js={js} />;
    }

    // ---- unknown type ----
    default:
      return <Placeholder type={type} />;
  }
}
