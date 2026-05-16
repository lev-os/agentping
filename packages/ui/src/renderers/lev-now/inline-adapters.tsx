"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/migrations/card";
import type {
  CustomHtmlAdapterProps,
  InlineChartProps,
  MermaidDiagramProps,
} from "./types";

export function Placeholder({ type }: { type: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{type}</CardTitle>
        <CardDescription>No React adapter yet</CardDescription>
      </CardHeader>
    </Card>
  );
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
    return (
      color[index] ??
      CHART_DEFAULT_PALETTE[fallbackIndex % CHART_DEFAULT_PALETTE.length]!
    );
  }
  if (typeof color === "string") return color;
  return CHART_DEFAULT_PALETTE[
    fallbackIndex % CHART_DEFAULT_PALETTE.length
  ]!;
}

export function InlineChart({
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
    const allValues = datasets.flatMap((dataset) => dataset.data);
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
        {datasets.map((dataset, datasetIndex) =>
          dataset.data.map((value, index) => {
            const h = (value / max) * plotHeight;
            const x = padding + index * groupWidth + datasetIndex * barWidth;
            const y = height - padding - h;
            return (
              <rect
                key={`${datasetIndex}-${index}`}
                x={x}
                y={y}
                width={Math.max(barWidth - 2, 1)}
                height={h}
                rx={dataset.borderRadius ?? 2}
                fill={resolveColor(dataset.backgroundColor, index, datasetIndex)}
                stroke={dataset.borderColor}
                strokeWidth={dataset.borderWidth}
              >
                <title>{`${labels[index] ?? ""}: ${value}`}</title>
              </rect>
            );
          }),
        )}
        {labels.map((label, index) => (
          <text
            key={`lbl-${index}`}
            x={padding + index * groupWidth + groupWidth / 2}
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
    const allValues = datasets.flatMap((dataset) => dataset.data);
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
        {datasets.map((dataset, datasetIndex) => {
          const points = dataset.data
            .map((value, index) => {
              const x =
                padding +
                (index / Math.max(dataset.data.length - 1, 1)) * plotWidth;
              const y =
                height - padding - ((value - min) / range) * plotHeight;
              return `${x},${y}`;
            })
            .join(" ");
          const stroke =
            dataset.borderColor ??
            resolveColor(dataset.backgroundColor, 0, datasetIndex);
          return (
            <polyline
              key={datasetIndex}
              fill="none"
              stroke={stroke}
              strokeWidth={dataset.borderWidth ?? 2}
              points={points}
            />
          );
        })}
      </svg>
    );
  };

  const renderPie = () => {
    const dataset = datasets[0]!;
    const total = dataset.data.reduce((acc, value) => acc + value, 0) || 1;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(cx, cy) - padding;
    const innerR =
      chartType === "doughnut" ? parseDoughnutCutout(cutout, r) : 0;

    let startAngle = -Math.PI / 2;
    const paths: React.ReactElement[] = [];

    dataset.data.forEach((value, index) => {
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
          key={index}
          d={d}
          fill={resolveColor(dataset.backgroundColor, index, index)}
          stroke={dataset.borderColor ?? "var(--background, #fff)"}
          strokeWidth={dataset.borderWidth ?? 1}
        >
          <title>{`${labels[index] ?? ""}: ${value}`}</title>
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
  const match = /^([0-9]+(?:\.[0-9]+)?)%?$/.exec(cutout.trim());
  if (!match) return r * 0.55;
  const n = Number(match[1]);
  if (Number.isNaN(n)) return r * 0.55;
  if (cutout.includes("%")) return (n / 100) * r;
  return Math.min(n, r - 2);
}

export function MermaidDiagram({ content, caption }: MermaidDiagramProps) {
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

export function CustomHtmlAdapter({
  html,
  css,
  js,
}: CustomHtmlAdapterProps) {
  const previewSections = buildInertCustomHtmlPreview({ html, css, js });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-mono uppercase tracking-wider">
          custom-html
        </CardTitle>
        <CardDescription>
          Inert preview; host isolation required before execution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {previewSections.map((section) => (
          <div key={section.label} className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            <pre
              className="text-xs font-mono whitespace-pre overflow-x-auto rounded bg-muted/40 p-3"
              data-language={section.language}
            >
              <code>{section.content}</code>
            </pre>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export interface CustomHtmlPreviewSection {
  label: "html" | "css" | "js";
  language: string;
  content: string;
}

export function buildInertCustomHtmlPreview({
  html,
  css,
  js,
}: CustomHtmlAdapterProps): CustomHtmlPreviewSection[] {
  return [
    { label: "html", language: "html", content: html },
    ...(css ? [{ label: "css" as const, language: "css", content: css }] : []),
    ...(js
      ? [{ label: "js" as const, language: "javascript", content: js }]
      : []),
  ];
}
