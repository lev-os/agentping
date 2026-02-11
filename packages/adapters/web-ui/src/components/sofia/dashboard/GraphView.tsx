/**
 * @kingly/ui - GraphView Component
 *
 * Interactive graph visualization container for high-connectivity nodes.
 * Used by lev-graph pairing for nodes with >5 edges.
 */

"use client";

	import * as React from "react";
	import { useState } from "react";
	import { motion } from "framer-motion";
	import { Share2, Maximize2, Minimize2, RefreshCw, GitBranch, CircleDot } from "lucide-react";
	import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
	import { Badge } from "../ui/Badge";
	import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface GraphNode {
  id: string;
  label: string;
  type?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type?: string;
}

export interface GraphViewProps {
  /** Unique identifier */
  id: string;
  /** Graph title */
  title: string;
  /** Brief description */
  description?: string;
  /** Graph nodes */
  nodes?: GraphNode[];
  /** Graph edges */
  edges?: GraphEdge[];
  /** Display variant */
  variant?: "default" | "compact" | "detailed";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether graph is interactive */
  interactive?: boolean;
  /** Whether to show connection indicators */
  showConnections?: boolean;
  /** Custom graph renderer */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Node click handler */
  onNodeClick?: (nodeId: string) => void;
}

const sizeClasses = {
  sm: { padding: "p-3", height: "h-48" },
  md: { padding: "p-4", height: "h-64" },
  lg: { padding: "p-5", height: "h-96" },
};

export function GraphView({
  id,
  title,
  description,
  nodes = [],
  edges = [],
  variant = "default",
  size = "md",
  interactive = true,
  showConnections = true,
  children,
  className,
  onRefresh,
  onNodeClick,
}: GraphViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const avgConnections = nodeCount > 0 ? (edgeCount * 2 / nodeCount).toFixed(1) : "0";

  return (
    <Card
      className={cn(
        "cyber-panel overflow-hidden",
        isFullscreen && "fixed inset-4 z-50",
        className
      )}
      data-component="graph-view"
      data-id={id}
    >
      <CardHeader className={cn("pb-2 border-b border-border/30", sizeClasses[size].padding)}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="font-display tracking-wider text-sm">{title}</span>
              {description && variant !== "compact" && (
                <span className="text-xs text-muted-foreground font-normal">
                  {description}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stats badges */}
            {showConnections && variant !== "compact" && (
              <>
                <Badge variant="outline" className="gap-1">
                  <CircleDot className="w-3 h-3" />
                  {nodeCount}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <GitBranch className="w-3 h-3" />
                  {edgeCount}
                </Badge>
              </>
            )}

            {/* Actions */}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={onRefresh}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            )}
            {interactive && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("pt-0", sizeClasses[size].padding)}>
        {/* Graph container */}
        <div
          className={cn(
            "relative rounded-md border border-border/30 bg-muted/20 overflow-hidden",
            isFullscreen ? "h-[calc(100vh-12rem)]" : sizeClasses[size].height
          )}
        >
          {children ? (
            // Custom graph renderer
            children
          ) : (
            // Placeholder visualization
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {/* Animated network visualization placeholder */}
                <div className="w-24 h-24 relative">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-primary/40"
                      style={{
                        left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
                        top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary/60" />
                  </div>
                </div>
              </motion.div>

              <p className="mt-4 text-xs text-muted-foreground text-center">
                {nodeCount > 0 ? (
                  <>
                    {nodeCount} nodes • {edgeCount} edges
                    <br />
                    <span className="opacity-60">avg {avgConnections} connections</span>
                  </>
                ) : (
                  "No graph data available"
                )}
              </p>

              {interactive && onNodeClick && nodeCount > 0 && (
                <div className="mt-4 flex flex-wrap gap-1 justify-center max-w-xs">
                  {nodes.slice(0, 5).map((node) => (
                    <button
                      key={node.id}
                      className="px-2 py-0.5 text-xs bg-primary/10 hover:bg-primary/20 rounded border border-primary/30 transition-colors"
                      onClick={() => onNodeClick(node.id)}
                    >
                      {node.label}
                    </button>
                  ))}
                  {nodes.length > 5 && (
                    <span className="px-2 py-0.5 text-xs text-muted-foreground">
                      +{nodes.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
