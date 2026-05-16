"use client";

import * as React from "react";
import { ApprovalQueue } from "../../components/migrations/approval-queue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/migrations/card";
import { DataTable } from "../../components/migrations/data-table";
import { EventTimeline } from "../../components/migrations/event-timeline";
import { Hero } from "../../components/migrations/hero";
import { InlineMarkdown } from "../../components/migrations/inline-markdown";
import { StatusCard } from "../../components/migrations/status-card";
import { Terminal } from "../../components/migrations/terminal";
import { Badge } from "../../components/ui/badge";
import {
  CustomHtmlAdapter,
  InlineChart,
  MermaidDiagram,
  Placeholder,
} from "./inline-adapters";
import {
  translateDataTableColumns,
  translateFeedbackItems,
  translateInlineBadgeVariant,
  translateTimelineItems,
} from "./translators";
import type {
  ChartDataset,
  LevNowDataTableColumn,
  LevNowElementProps,
  LevNowFeedbackItem,
  LevNowTimelineItem,
} from "./types";

type LevNowRenderRecipe = (
  element: LevNowElementProps,
) => React.ReactElement;

function renderHero({ props, children }: LevNowElementProps) {
  const { title, subtitle, category, meta } = props as {
    title?: string;
    subtitle?: string;
    category?: string;
    meta?: string;
  };
  return (
    <Hero title={title ?? ""} subtitle={subtitle} version={category}>
      {meta && (
        <p className="text-sm text-muted-foreground font-mono">{meta}</p>
      )}
      {children}
    </Hero>
  );
}

function renderCard({ variant, props, children }: LevNowElementProps) {
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

function renderDataTable({ props }: LevNowElementProps) {
  const { columns, rows } = props as {
    columns?: LevNowDataTableColumn[];
    rows?: Record<string, unknown>[];
  };
  if (!columns || !rows) {
    return <Placeholder type="data-table (missing columns/rows)" />;
  }
  return <DataTable columns={translateDataTableColumns(columns)} data={rows} />;
}

function renderCodeBlock({ props }: LevNowElementProps) {
  const { content, filename, language } = props as {
    content?: string;
    filename?: string;
    language?: string;
  };
  return (
    <Terminal
      tabs={[
        {
          id: "code",
          title: filename ?? language ?? "code",
        },
      ]}
      outputLines={content ? content.split("\n") : []}
    />
  );
}

function renderTimeline({ props }: LevNowElementProps) {
  const { items } = props as { items?: LevNowTimelineItem[] };
  if (!items) {
    return <Placeholder type="timeline (missing items)" />;
  }
  return <EventTimeline events={translateTimelineItems(items)} />;
}

function renderText({ props }: LevNowElementProps) {
  const { content } = props as { content?: string };
  return <InlineMarkdown content={content} />;
}

function renderInline({ variant, props }: LevNowElementProps) {
  if (variant === "status-badge" || variant === "badge") {
    const { label, variant: badgeVariant } = props as {
      label?: string;
      variant?: string;
    };
    return (
      <Badge variant={translateInlineBadgeVariant(badgeVariant)}>
        {label ?? ""}
      </Badge>
    );
  }

  if (variant === "divider") {
    return <hr className="border-border my-4" />;
  }

  return <Placeholder type={`inline (unknown variant: ${variant})`} />;
}

function renderFeedback({ props }: LevNowElementProps) {
  const { title, items } = props as {
    title?: string;
    items?: LevNowFeedbackItem[];
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

function renderSection({ props, children }: LevNowElementProps) {
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

function renderChart({ props }: LevNowElementProps) {
  const { chartType, title, labels, datasets, height, cutout } = props as {
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

function renderDiagram({ props }: LevNowElementProps) {
  const { engine, content, caption } = props as {
    engine?: string;
    content?: string;
    caption?: string;
  };
  if (!content) {
    return <Placeholder type="diagram (missing content)" />;
  }
  if (engine && engine !== "mermaid") {
    return <Placeholder type={`diagram (unsupported engine: ${engine})`} />;
  }
  return <MermaidDiagram content={content} caption={caption} />;
}

function renderCustomHtml({ props }: LevNowElementProps) {
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

export const LEV_NOW_RENDER_RECIPES: Record<string, LevNowRenderRecipe> = {
  hero: renderHero,
  card: renderCard,
  "data-table": renderDataTable,
  "code-block": renderCodeBlock,
  timeline: renderTimeline,
  text: renderText,
  feedback: renderFeedback,
  inline: renderInline,
  section: renderSection,
  chart: renderChart,
  diagram: renderDiagram,
  "custom-html": renderCustomHtml,
};
