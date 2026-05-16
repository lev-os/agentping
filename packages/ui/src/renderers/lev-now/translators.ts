import type { PendingApproval } from "../../components/migrations/approval-queue";
import type { DataTableColumn } from "../../components/migrations/data-table";
import type { TimelineEvent } from "../../components/migrations/event-timeline";
import type {
  LevNowDataTableColumn,
  LevNowFeedbackItem,
  LevNowTimelineItem,
} from "./types";

/**
 * lev-now data-table/table columns use `{ key, label }`.
 * React DataTable uses `{ key, header }`.
 */
export function translateDataTableColumns(
  columns: LevNowDataTableColumn[],
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
export function translateTimelineItems(
  items: LevNowTimelineItem[],
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
 * lev-now feedback items -> ApprovalQueue PendingApproval[].
 * This is a lossy bridge because feedback is richer than approvals.
 */
export function translateFeedbackItems(
  items: LevNowFeedbackItem[],
): PendingApproval[] {
  return items.map((item) => ({
    id: item.id,
    toolName: item.title,
    description:
      item.insight ??
      (item.options
        ? `Options: ${item.options.map((option) => option.label).join(", ")}`
        : undefined),
    timestamp: new Date(),
  }));
}

export function translateInlineBadgeVariant(
  variant: string | undefined,
): "default" | "success" | "warning" | "destructive" {
  const variantMap: Record<
    string,
    "default" | "success" | "warning" | "destructive"
  > = {
    match: "success",
    gap: "destructive",
    warn: "warning",
    info: "default",
  };

  return variantMap[variant ?? "info"] ?? "default";
}
