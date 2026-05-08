/**
 * @kingly/ui - Dashboard Components
 *
 * Export all dashboard-related components
 */

// Main component
export { DashboardWidget } from "./DashboardWidget";

// Responsive layout components
export { WidgetWrapper, type WidgetVariant, type WidgetWrapperProps } from "./WidgetWrapper";
export { ResponsiveDashboard, type Widget, type ResponsiveDashboardProps, type Layouts, type Breakpoint } from "./ResponsiveDashboard";

// Context & hooks
export { LoadingStateProvider, useLoadingState } from "./LoadingStateProvider";

// Sub-components
export { StreamingIndicator } from "./StreamingIndicator";
export { WidgetError } from "./WidgetError";
export { WidgetHeaderAction } from "./WidgetHeaderAction";
export { WidgetFooter } from "./WidgetFooter";
export { WidgetEmpty } from "./WidgetEmpty";
export { WidgetCrashFallback } from "./WidgetCrashFallback";

// Skeletons
export {
  StatGridSkeleton,
  ChartSkeleton,
  TableSkeleton,
  GaugeSkeleton,
  GridSkeleton,
} from "./skeletons";

// Collapse/Expand components
export { CollapseButton, type CollapseButtonProps } from "./CollapseButton";
export { TreeExpander, type TreeExpanderProps } from "./TreeExpander";

// Graph Dashboard Components (lev-graph pairing)
export { DocCard, type DocCardProps } from "./DocCard";
export { SpecPanel, type SpecPanelProps, type SpecSection } from "./SpecPanel";
export { GraphView, type GraphViewProps, type GraphNode, type GraphEdge } from "./GraphView";
export { ArtifactBadge, type ArtifactBadgeProps } from "./ArtifactBadge";
export {
  SafeDispatchCockpit,
  getSafeDispatchSummary,
  type SafeDispatchAction,
  type SafeDispatchCockpitProps,
  type SafeDispatchProvider,
  type SafeDispatchSession,
  type SafeDispatchState,
  type SafeDispatchSummary,
  type SafeDispatchWorkstream,
} from "./SafeDispatchCockpit";

// Types
export type {
  DashboardWidgetProps,
  SkeletonProps,
  SkeletonType,
  WidgetPriority,
  WidgetLoadingState,
  LoadingStateContextValue,
  PersistedLoadingState,
  WidgetErrorProps,
  StreamingIndicatorProps,
  WidgetAction,
  EmptyStateType,
  WidgetEmptyProps,
  WidgetHeaderActionProps,
  WidgetFooterProps,
  WidgetCrashFallbackProps,
} from "./types";
