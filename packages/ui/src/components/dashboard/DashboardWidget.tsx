/**
 * @kingly/ui - Dashboard Widget Base Component
 *
 * Unified base component for all dashboard widgets
 * Provides loading states, streaming indicators, error handling, and consistent styling
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { StreamingIndicator } from "./StreamingIndicator";
import { WidgetError } from "./WidgetError";
import { WidgetHeaderAction } from "./WidgetHeaderAction";
import { WidgetFooter } from "./WidgetFooter";
import { WidgetEmpty } from "./WidgetEmpty";
import {
  StatGridSkeleton,
  ChartSkeleton,
  TableSkeleton,
  GaugeSkeleton,
  GridSkeleton,
  StatusBarSkeleton,
} from "./skeletons";
import { useLoadingState } from "./LoadingStateProvider";
import type { DashboardWidgetProps, SkeletonType } from "./types";

/**
 * Get skeleton component for skeleton type
 */
function getSkeletonComponent(
  type: SkeletonType,
  props: DashboardWidgetProps["skeletonProps"]
) {
  switch (type) {
    case "stat-grid":
      return <StatGridSkeleton {...props} />;
    case "chart":
      return <ChartSkeleton {...props} />;
    case "table":
      return <TableSkeleton {...props} />;
    case "gauge":
      return <GaugeSkeleton {...props} />;
    case "grid":
      return <GridSkeleton {...props} />;
    case "status-bar":
      return <StatusBarSkeleton {...props} />;
    default:
      return <StatGridSkeleton {...props} />;
  }
}

/**
 * DashboardWidget - Base component for all dashboard widgets
 */
export function DashboardWidget({
  // Identity
  widgetId,
  title,
  subtitle,
  icon: Icon,

  // Data & Loading
  data: _data,
  isLoading = false,
  error = null,

  // Streaming
  isStreaming = false,
  isTrainingActive = false,
  streamingIndicator = true,

  // Skeleton
  skeletonType = "stat-grid",
  skeletonProps,
  customSkeleton,

  // Empty State
  isEmpty = false,
  emptyType = "no-data",
  emptyTitle,
  emptyDescription,
  emptyAction,

  // Header & Footer Actions
  headerActions,
  headerContent,
  footerContent,
  footerActions,

  // Behavior
  refreshable = false,
  onRefresh,
  collapsible = false,
  defaultCollapsed = false,
  isCollapsed: controlledCollapsed,
  onCollapseChange,

  // Styling
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  priority = "medium",
  minHeight,

  // Children
  children,
}: DashboardWidgetProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const { isSimulatedLoading } = useLoadingState();

  // Support controlled and uncontrolled collapse modes
  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const handleCollapseToggle = () => {
    const newValue = !isCollapsed;
    if (isControlled) {
      onCollapseChange?.(newValue);
    } else {
      setInternalCollapsed(newValue);
    }
  };

  // Determine effective loading state (simulated or actual)
  const effectiveIsLoading = isSimulatedLoading || isLoading;

  // Error state
  if (error && !effectiveIsLoading) {
    return (
      <Card className={cn("cyber-panel overflow-hidden", className)} data-widget-id={widgetId}>
        <CardHeader className="border-b border-border/30">
          <CardTitle className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-destructive" />}
            <span className="font-display tracking-wider">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <WidgetError
            error={error}
            widgetId={widgetId}
            onRetry={onRefresh}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn("cyber-panel overflow-hidden", className)}
      data-widget-id={widgetId}
      data-priority={priority}
      style={{ minHeight }}
      aria-busy={effectiveIsLoading}
    >
      <CardHeader className={cn("pb-2 border-b border-border/30", headerClassName)}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <div className="flex flex-col">
              <span className="font-display tracking-wider">{title}</span>
              {subtitle && (
                <span className="text-xs text-muted-foreground font-normal">{subtitle}</span>
              )}
            </div>

            {/* Streaming Indicator */}
            {streamingIndicator && isStreaming && (
              <StreamingIndicator
                isConnected={isStreaming}
                isTrainingActive={isTrainingActive}
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Custom Header Content (takes precedence over headerActions) */}
            {headerContent ? headerContent : (
              /* Header Actions */
              headerActions && headerActions.length > 0 && (
                <WidgetHeaderAction actions={headerActions} />
              )
            )}

            {/* Refresh Button */}
            {refreshable && onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="h-7 w-7 p-0"
                aria-label="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            )}

            {/* Collapse Button */}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCollapseToggle}
                className="h-7 w-7 p-0"
                aria-label={isCollapsed ? "Expand" : "Collapse"}
                aria-expanded={!isCollapsed}
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                </motion.div>
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className={cn("p-4", contentClassName)}>
              {effectiveIsLoading ? (
                // Show skeleton during loading
                customSkeleton ? (
                  customSkeleton
                ) : (
                  getSkeletonComponent(skeletonType, skeletonProps)
                )
              ) : isEmpty ? (
                // Show empty state
                <WidgetEmpty
                  type={emptyType}
                  title={emptyTitle}
                  description={emptyDescription}
                  action={emptyAction}
                />
              ) : (
                // Show actual content
                children
              )}
            </CardContent>

            {/* Footer */}
            {(footerContent || (footerActions && footerActions.length > 0)) && (
              <WidgetFooter
                actions={footerActions}
                className={footerClassName}
              >
                {footerContent}
              </WidgetFooter>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
