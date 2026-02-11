/**
 * @kingly/ui - Dashboard Widget Types
 *
 * Shared TypeScript types for dashboard widgets and loading states
 */

import type { ReactNode, ElementType, MouseEventHandler } from "react";

/**
 * Skeleton types matching widget visual patterns
 */
export type SkeletonType =
  | "stat-grid"       // 2x2 or 4x1 stat boxes (Metrics, System)
  | "chart"           // Line/bar charts (ScoreChart, DistributionChart)
  | "table"           // Row-based tables (Episodes, LevelsTable)
  | "gauge"           // Circular gauges (Performance, CurrentLevel)
  | "grid"            // Multi-item grids (LevelGrid, ModelSelector)
  | "header"          // Header bar skeleton
  | "status-bar"      // Status indicator bar
  | "form"            // Form inputs skeleton
  | "custom";         // Use custom skeleton component

/**
 * Widget priority levels (affects loading order and update frequency)
 */
export type WidgetPriority = "critical" | "high" | "medium" | "low";

/**
 * Widget loading states
 */
export type WidgetLoadingState = "idle" | "loading" | "loaded" | "error";

/**
 * Base props for DashboardWidget component
 */
export interface DashboardWidgetProps {
  // Identity
  widgetId: string;                    // Unique ID for persistence
  title: string;                       // Widget title
  subtitle?: string;                   // Optional subtitle below title
  icon?: ElementType;                  // Icon component (lucide-react)

  // Data & Loading
  data?: unknown;                      // Widget data
  isLoading?: boolean;                 // Loading state
  error?: Error | null;                // Error state

  // Streaming (real-time updates)
  isStreaming?: boolean;               // SSE connection active
  isTrainingActive?: boolean;          // Training is running
  streamingIndicator?: boolean;        // Show streaming badge (default: true if isStreaming)

  // Skeleton Configuration
  skeletonType?: SkeletonType;         // Type of loading skeleton
  skeletonProps?: SkeletonProps;       // Custom skeleton props
  customSkeleton?: ReactNode;          // Custom skeleton component

  // Empty State
  isEmpty?: boolean;                   // Widget has no data
  emptyType?: EmptyStateType;          // Type of empty state
  emptyTitle?: string;                 // Custom empty state title
  emptyDescription?: string;           // Custom empty state description
  emptyAction?: {                      // Optional action for empty state
    label: string;
    onClick: () => void;
  };

  // Header & Footer Actions
  headerActions?: WidgetAction[];      // Actions in header right side
  headerContent?: ReactNode;           // Custom header content (replaces headerActions)
  footerContent?: ReactNode;           // Custom footer content
  footerActions?: WidgetAction[];      // Actions in footer

  // Behavior
  refreshable?: boolean;               // Show refresh button
  onRefresh?: () => void;              // Refresh callback
  collapsible?: boolean;               // Can collapse
  defaultCollapsed?: boolean;          // Initial collapse state (uncontrolled)
  isCollapsed?: boolean;               // Controlled collapse state
  onCollapseChange?: (collapsed: boolean) => void; // Controlled collapse callback

  // Styling
  className?: string;                  // Additional CSS classes
  contentClassName?: string;           // Content area classes
  headerClassName?: string;            // Header area classes
  footerClassName?: string;            // Footer area classes
  priority?: WidgetPriority;           // Widget priority
  minHeight?: string;                  // Minimum height (CSS value)

  // Children
  children: ReactNode;                 // Widget content
}

/**
 * Props for skeleton components
 */
export interface SkeletonProps {
  rows?: number;                       // Number of rows (for tables)
  cols?: number;                       // Number of columns (for grids)
  height?: string;                     // Height override
  animated?: boolean;                  // Enable pulse animation (default: true)
  className?: string;                  // Additional classes
}

/**
 * Loading state context value
 */
export interface LoadingStateContextValue {
  // Global state
  isSimulatedLoading: boolean;         // Global loading simulation currently active (temporary)
  toggleSimulatedLoading: () => void;  // Toggle global simulation (triggers 2.5s simulation)
  
  // Per-widget state
  getWidgetLoadingState: (widgetId: string) => WidgetLoadingState;
  setWidgetLoadingState: (widgetId: string, state: WidgetLoadingState) => void;
  
  // Persistence
  persistState: () => void;            // Manually save to localStorage
  clearState: () => void;              // Clear localStorage
}

/**
 * Persisted loading state structure
 */
export interface PersistedLoadingState {
  simulatedLoading: boolean;
  lastToggled: string;                 // ISO timestamp
  widgetStates: Record<string, WidgetLoadingState>;
}

/**
 * Props for widget error boundary
 */
export interface WidgetErrorProps {
  error: Error;
  widgetId: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * Streaming indicator badge props
 */
export interface StreamingIndicatorProps {
  isConnected: boolean;
  isTrainingActive?: boolean;
  className?: string;
}

/**
 * Widget action descriptor for header/footer actions
 * Note: This is distinct from ActionDescriptor in actions/types.ts which includes analytics
 */
export interface WidgetAction {
  id: string;                              // Unique action ID
  label: string;                           // Accessible label
  icon: ElementType;                       // Icon component
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "destructive" | "outline" | "ghost";
  title?: string;                          // Tooltip text
}

/**
 * Empty state types for WidgetEmpty
 */
export type EmptyStateType =
  | "no-data"           // No data available
  | "no-results"        // Search/filter returned nothing
  | "not-configured"    // Needs configuration
  | "disconnected"      // Connection lost
  | "not-started"       // Training/process not started
  | "custom";           // Custom empty state

/**
 * Props for WidgetEmpty component
 */
export interface WidgetEmptyProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Props for WidgetHeaderAction component
 */
export interface WidgetHeaderActionProps {
  actions: WidgetAction[];
  className?: string;
}

/**
 * Props for WidgetFooter component
 */
export interface WidgetFooterProps {
  children?: ReactNode;
  actions?: WidgetAction[];
  className?: string;
}

/**
 * Props for WidgetCrashFallback component
 */
export interface WidgetCrashFallbackProps {
  widgetId: string;
  error?: Error;
  resetError?: () => void;
  className?: string;
}
