"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ErrorBoundary.tsx
 * @migration-status candidate
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className={cn("border border-destructive/50 bg-destructive/10 rounded-md p-4", this.props.className)}>
          <div className="text-sm font-medium text-destructive">Something went wrong</div>
          <div className="text-xs text-muted-foreground mt-1">{this.state.error?.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
