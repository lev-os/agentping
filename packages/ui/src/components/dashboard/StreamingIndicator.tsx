/**
 * @kingly/ui - Streaming Indicator
 *
 * Badge component showing streaming/connection status
 */

"use client";

import { Radio, Wifi, WifiOff } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import type { StreamingIndicatorProps } from "./types";

export function StreamingIndicator({
  isConnected,
  isTrainingActive = false,
  className,
}: StreamingIndicatorProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "ml-1 gap-1 text-[9px] px-1.5",
        isConnected
          ? isTrainingActive
            ? "border-success/50 text-success animate-pulse"
            : "border-primary/50 text-primary"
          : "border-destructive/50 text-destructive",
        className
      )}
    >
      {isConnected ? (
        isTrainingActive ? (
          <>
            <Radio className="w-2.5 h-2.5" />
            LIVE
          </>
        ) : (
          <Wifi className="w-2.5 h-2.5" />
        )
      ) : (
        <WifiOff className="w-2.5 h-2.5" />
      )}
    </Badge>
  );
}

