import type * as React from "react";

export interface LevNowElementProps {
  /** lev-now element type discriminator */
  type: string;
  /** Element variant (e.g. "kpi" for card, "status-badge" for inline) */
  variant?: string;
  /** Element-specific props from RenderSpec */
  props: Record<string, unknown>;
  /** Children rendered inside layout wrappers (section, card) */
  children?: React.ReactNode;
}

export interface LevNowElementMapEntry {
  component: string;
  hasAdapter: boolean;
}

export interface LevNowElementCoverageEntry extends LevNowElementMapEntry {
  type: string;
  aliases?: readonly string[];
  variants?: readonly string[];
}

export interface LevNowDataTableColumn {
  key: string;
  label: string;
  [key: string]: unknown;
}

export interface LevNowTimelineItem {
  date: string;
  title: string;
  description?: string;
  status?: string;
}

export interface LevNowFeedbackItem {
  id: string;
  title: string;
  insight?: string;
  options?: Array<{ label: string }>;
}

export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export interface InlineChartProps {
  chartType: "bar" | "doughnut" | "line" | "pie";
  title?: string;
  labels: string[];
  datasets: ChartDataset[];
  height?: number;
  cutout?: string;
}

export interface MermaidDiagramProps {
  content: string;
  caption?: string;
}

export interface CustomHtmlAdapterProps {
  html: string;
  css?: string;
  js?: string;
}
