"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LandingPageProps {
  className?: string;
  children?: React.ReactNode;
  onGetStarted?: () => void;
}

/**
 * LandingPage - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LandingPage.tsx
 * @migration-status candidate
 * @needs-review Complex page component with hardcoded agent data. Shell wrapper only.
 */
export function LandingPage({ className, children, onGetStarted }: LandingPageProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children ?? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">AgentPing</h1>
            <p className="text-lg text-muted-foreground mb-6">Human-in-the-Loop for Agentic Workflows</p>
            {onGetStarted && (
              <button
                onClick={onGetStarted}
                className="px-6 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition-colors font-medium"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
