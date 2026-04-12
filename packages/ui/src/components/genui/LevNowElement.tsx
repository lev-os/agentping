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
  chart: { component: "(placeholder)", hasAdapter: false },
  diagram: { component: "(placeholder)", hasAdapter: false },
  "custom-html": { component: "(dangerouslySetInnerHTML)", hasAdapter: false },
};

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

    // ---- chart (placeholder) ----
    case "chart":
      return <Placeholder type="chart" />;

    // ---- diagram (placeholder) ----
    case "diagram":
      return <Placeholder type="diagram" />;

    // ---- custom-html (placeholder — dangerouslySetInnerHTML is risky) ----
    case "custom-html":
      return <Placeholder type="custom-html" />;

    // ---- unknown type ----
    default:
      return <Placeholder type={type} />;
  }
}
