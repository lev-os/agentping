/**
 * Catalog Barrel - All 416-component catalog entries
 * Auto-generated during Phase 2 catalog import wave (2026-02-12)
 *
 * Conflict families use named exports to avoid collisions.
 * Canonical aliases and new catalog entries use export *.
 * Duplicate CRUD aliases (crud-*) excluded to avoid re-export collisions.
 */

// =============================================================================
// CONFLICT FAMILIES (named exports to preserve dual-raw + candidate pattern)
// =============================================================================

export { StatusGrid, type StatusGridProps, type StatusCard, type StatusType } from "./status-grid";
export { HolographicCard, type HolographicCardProps } from "./holographic-card";
export {
  BadgeStudioRaw,
  BadgeWebUiRaw,
  BadgeCandidate,
  type BadgeConflictProps,
} from "./badge-conflict";
export {
  ButtonStudioRaw,
  ButtonWebUiRaw,
  ButtonCandidate,
  type ButtonConflictProps,
} from "./button-conflict";
export {
  CodeDiffViewerStudioRaw,
  CodeDiffViewerWebUiRaw,
  CodeDiffViewerCandidate,
  type CodeDiffViewerConflictProps,
} from "./code-diff-viewer-conflict";
export {
  ContextMenuStudioRaw,
  ContextMenuWebUiRaw,
  ContextMenuCandidate,
  type ContextMenuAction,
  type ContextMenuConflictProps,
} from "./context-menu-conflict";
export {
  EmptyStateStudioRaw,
  EmptyStateWebUiRaw,
  EmptyStateCandidate,
  type EmptyStateConflictProps,
} from "./empty-state-conflict";
export {
  IconButtonStudioRaw,
  IconButtonWebUiRaw,
  IconButtonCandidate,
  type IconButtonConflictProps,
} from "./icon-button-conflict";
export {
  InputStudioRaw,
  InputWebUiRaw,
  InputCandidate,
  type InputConflictProps,
} from "./input-conflict";
export {
  SearchInputStudioRaw,
  SearchInputWebUiRaw,
  SearchInputCandidate,
  type SearchInputConflictProps,
} from "./search-input-conflict";
export {
  SpinnerStudioRaw,
  SpinnerWebUiRaw,
  SpinnerCandidate,
  type SpinnerConflictProps,
} from "./spinner-conflict";
export {
  TimelineStudioRaw,
  TimelineWebUiRaw,
  TimelineCandidate,
  type TimelineItem,
  type TimelineConflictProps,
} from "./timeline-conflict";
export {
  LogViewerStudioRaw,
  LogViewerWebUiRaw,
  LogViewerCandidate,
  type LogEntry,
  type LogViewerConflictProps,
  type LogViewerCandidateProps,
} from "./log-viewer-conflict";

// =============================================================================
// NEW MIGRATION CANDIDATES + CANONICAL ALIASES (export *)
// Excludes: conflict families (above), crud-* duplicates (collision avoidance)
// =============================================================================

export * from "./access-pad";
export * from "./accordion-list";
export * from "./active-sessions";
export * from "./activity-feed";
export * from "./advanced-data-grid";
export * from "./agent-avatar";
export * from "./agent-dropdown";
export * from "./agent-status-overlay";
export * from "./alert-banner";
export * from "./alert-dialog";
export * from "./alert-feed";
export * from "./animations";
export * from "./approval-queue";
export * from "./archive-dialog";
export * from "./artifact-badge";
export * from "./asset-card";
export * from "./audio-player";
export * from "./audit-feed";
export * from "./audit-log-table";
export { AuditLogViewer, type AuditLogViewerProps } from "./audit-log-viewer";
export * from "./badge-canonical";
export * from "./battery-meter";
export * from "./brain-activity";
export * from "./breadcrumbs";
export * from "./build-status-logs";
export * from "./button-canonical";
export * from "./calendar-view";
export * from "./candlestick-chart";
export * from "./canvas-renderer";
export * from "./card";
export * from "./chart-skeleton";
export * from "./chat-header";
export * from "./chat-input";
export * from "./chat-message";
export * from "./chat-panel";
export * from "./chat-search";
export * from "./checkbox";
export * from "./circuit-pattern";
export * from "./circular-progress";
export * from "./collapse-button";
export * from "./color-picker";
export * from "./command-palette";
export * from "./component-gallery";
export * from "./confidence-meter";
export * from "./confirmation-modal";
export * from "./conflict-resolver";
export * from "./connection-signal";
export * from "./connection-status";
export * from "./context-usage";
export * from "./copy-button";
export * from "./countdown-widget";
export * from "./create-dialog";
export * from "./csv-preview";
export * from "./csv-viewer";
export * from "./daily-agenda";
export * from "./dashboard-detail-view";
export * from "./dashboard-widget";
export * from "./dashboard";
export * from "./data-metrics-board";
export * from "./data-pipeline";
export * from "./data-table";
export * from "./date-picker-pro";
export * from "./date-picker";
export * from "./delete-dialog";
export * from "./dependency-graph";
export * from "./depth-chart";
export * from "./diagnostic-panel";
export * from "./dialog";
export * from "./diff-stat-summary";
export * from "./distributed-trace";
export * from "./dm-analytics-panel";
export * from "./dm-create-dashboard-modal";
export * from "./dm-dashboard-detail";
export * from "./dm-dashboard-list";
export * from "./dm-log-viewer";
export * from "./dm-restart-histogram";
export * from "./dm-status-badge";
export * from "./dm-uptime-chart";
export * from "./doc-card";
export * from "./dock-menu";
export * from "./docker-stats";
export * from "./draggable-list";
export * from "./dropdown";
export * from "./edit-dialog";
export * from "./editable-text";
export * from "./encryption-status";
export * from "./enrichment-panel";
export * from "./entity-form";
export * from "./error-boundary";
export * from "./error-cluster";
export * from "./event-card";
export * from "./event-timeline";
export * from "./exchange-status";
export * from "./field-renderer";
export * from "./file-asset-picker";
export * from "./file-explorer";
export * from "./file-metadata-card";
export * from "./file-tree";
export * from "./file-viewer";
export * from "./filter-bar";
export * from "./filtered-dropdown";
export * from "./firewall-rules";
export * from "./footer-panel";
export * from "./forecasting-line";
export * from "./form";
export * from "./gallery-ai-section";
export * from "./gallery-content-section";
export * from "./gallery-dashboard-section";
export * from "./gallery-data-section";
export * from "./gallery-feedback-section";
export * from "./gallery-finance-section";
export * from "./gallery-forms-section";
export * from "./gallery-interaction-section";
export * from "./gallery-logs-section";
export * from "./gallery-media-section";
export * from "./gallery-navigation-section";
export * from "./gallery-scheduling-section";
export * from "./gallery-sofia-section";
export * from "./gallery-system-section";
export * from "./gallery-visuals-section";
export * from "./gauge-skeleton";
export * from "./geo-map";
export * from "./geo-request-map";
export * from "./globe-wireframe";
export * from "./glow-orb";
export * from "./graph-view";
export * from "./grid-skeleton";
export * from "./header-status-dropdown";
export * from "./heatmap-grid";
export * from "./hero";
export * from "./hex-dump-view";
export * from "./hex-grid-background";
export * from "./hex-inspector";
export * from "./history-view";
export * from "./hover-card";
export * from "./http-inspector";
export * from "./icon-button-canonical";
export * from "./image-compare";
export * from "./image-diff";
export * from "./info-sidebar";
export * from "./inline-kanban";
export * from "./inline-markdown";
export * from "./inline-todo";
export * from "./inline-tutorial-tooltip";
export * from "./input-canonical";
export * from "./json-diff";
export * from "./json-editor";
export * from "./json-tree-viewer";
export * from "./kanban-board";
export * from "./kbd";
export * from "./key-value-store";
export * from "./knob";
export * from "./label";
export * from "./landing-page";
export * from "./latency-histogram";
export * from "./layers";
export * from "./lcars-button";
export * from "./lcars-elbow";
export * from "./lcars-panel";
export * from "./lease-approval";
export * from "./list-view";
export * from "./live-badge";
export * from "./live-log-stream";
export * from "./loading-progress";
export * from "./loading-state-provider";
export * from "./log-histogram";
export * from "./log-search-query";
export * from "./log-stream";
export * from "./log-viewer";
export * from "./markdown-card";
export * from "./markdown-editor";
export * from "./market-heatmap";
export * from "./memory-usage-chart";
export * from "./menu-list";
export * from "./message-bubble";
export * from "./metric-chart";
export * from "./mind-map";
export * from "./mini-map";
export * from "./modal";
export * from "./model-selector";
export * from "./multi-select";
export * from "./navigator-with-dashboards";
export * from "./navigator";
export * from "./network-graph";
export * from "./network-topology";
export * from "./object-properties";
export * from "./order-book";
export * from "./org-chart";
export * from "./overlay-footer";
export * from "./packet-inspector";
export * from "./pagination";
export * from "./particle-stream";
export * from "./pdf-preview";
export * from "./pin-input";
export * from "./ping-card";
export * from "./polymorph-playground";
export * from "./portfolio-pie";
export * from "./preview";
export * from "./primitives-gallery";
export * from "./process-table";
export * from "./progress-bar";
export * from "./progress-timeline";
export * from "./progress";
export * from "./prompt-editor";
export * from "./properties-panel";
export * from "./property-grid";
export * from "./quick-actions";
export * from "./radar-chart";
export * from "./radar-sweep";
export * from "./radial-nav";
export * from "./range-slider";
export * from "./rating";
export * from "./recurring-event-editor";
export * from "./regex-tester";
export * from "./resource-gauge";
export * from "./resource-view";
export * from "./responsive-dashboard";
export * from "./restart-histogram";
export * from "./restore-dialog";
export * from "./rich-markdown-renderer";
export * from "./sankey-diagram";
export * from "./schema-graph";
export * from "./search-input-canonical";
export * from "./secret-input";
export * from "./segmented-control";
export * from "./selection-list";
export * from "./server-rack-status";
export * from "./session-tabs";
export * from "./settings-modal";
export * from "./shared-components";
export * from "./sheet";
export * from "./shimmer-text";
export * from "./side-panel";
export * from "./signal-monitor";
export * from "./skeleton";
export * from "./slider";
export * from "./smart-action-result";
export * from "./sonar-display";
export * from "./spec-panel";
export * from "./split-view";
export * from "./sql-result-table";
export * from "./stack-trace-profiler";
export * from "./star-field";
export * from "./stat-grid-skeleton";
export * from "./stats-grid";
export * from "./status-bar-skeleton";
export * from "./status-card";
export * from "./status-dot";
export * from "./status-indicator";
export * from "./status-pie-chart";
export * from "./step-checklist";
export * from "./step-tracker";
export * from "./stepper";
export * from "./storage-distribution";
export * from "./streaming-indicator";
export * from "./switch";
export * from "./system-health-gauge";
export * from "./system-network-graph";
export * from "./tab-bar";
export * from "./table-skeleton";
export * from "./table-view";
export * from "./table";
export * from "./tabs-container";
export * from "./tabs";
export * from "./tag-input";
export * from "./task-checklist";
export * from "./task-queue";
export * from "./task-workflow";
export * from "./team-roster";
export * from "./terminal-console";
export * from "./terminal-link-popup";
export * from "./terminal-view";
export * from "./terminal";
export * from "./text-area";
export * from "./textarea";
export * from "./theme-toggle";
export * from "./ticker-tape";
export * from "./tile-card";
export * from "./tile-view";
export * from "./time-slot-picker";
export * from "./timezone-slider";
export * from "./toast-manager";
export * from "./toast";
export * from "./todo-list";
export * from "./toggle-switch";
export * from "./token-stream";
export * from "./tool-card";
export * from "./tool-invocation";
export * from "./toolbar";
export * from "./tooltip";
export * from "./trade-history";
export * from "./transfer-list";
export * from "./tree-browser";
export * from "./tree-expander";
export * from "./typing-indicator";
export * from "./uptime-chart";
export * from "./vector-cluster";
export * from "./video-player";
export * from "./view-switcher";
export * from "./voice-console";
export * from "./voice-visualizer";
export * from "./weather-card";
export * from "./weekly-schedule";
export { WelcomeScreen, type WelcomeScreenProps } from "./welcome-screen";
export * from "./widget-crash-fallback";
export * from "./widget-empty";
export * from "./widget-error";
export * from "./widget-footer";
export * from "./widget-header-action";
export * from "./widget-wrapper";
export * from "./wizard-step";
export * from "./world-clock";
export * from "./year-heatmap";
