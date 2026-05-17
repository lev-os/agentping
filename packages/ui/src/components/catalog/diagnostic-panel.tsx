"use client";

/**
 * DiagnosticPanel — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/DiagnosticPanel.tsx
 * @catalog-status needs-review — runtime coupled (window.claudeCode connectivity tests)
 * @category root
 */

import React from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type TestStatus = "pass" | "fail" | "running" | "pending";

export interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  message?: string;
  latency?: number;
}

export interface DiagnosticPanelProps {
  /** Diagnostic test results */
  tests: TestResult[];
  /** Whether tests are running */
  isRunning?: boolean;
  /** Re-run all tests */
  onRunTests?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Status config                                                       */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  TestStatus,
  { icon: React.ReactNode; color: string }
> = {
  pass: { icon: <CheckCircle size={14} />, color: "text-emerald-400" },
  fail: { icon: <XCircle size={14} />, color: "text-red-400" },
  running: {
    icon: <Loader2 size={14} className="animate-spin" />,
    color: "text-cyan-400",
  },
  pending: {
    icon: <div className="w-3.5 h-3.5 rounded-full border border-zinc-600" />,
    color: "text-zinc-500",
  },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function DiagnosticPanel({
  tests,
  isRunning = false,
  onRunTests,
  className,
}: DiagnosticPanelProps) {
  const passCount = tests.filter((t) => t.status === "pass").length;
  const failCount = tests.filter((t) => t.status === "fail").length;
  const allPassed = failCount === 0 && passCount === tests.length;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {allPassed ? (
            <Wifi size={16} className="text-emerald-400" />
          ) : failCount > 0 ? (
            <WifiOff size={16} className="text-red-400" />
          ) : (
            <Wifi size={16} className="text-zinc-400" />
          )}
          <span className="text-sm font-medium text-zinc-200">Diagnostics</span>
        </div>

        {onRunTests && (
          <button
            onClick={onRunTests}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs",
              "bg-zinc-800/50 border border-zinc-700/50",
              "text-zinc-400 hover:text-zinc-200 transition-colors",
              isRunning && "opacity-50 cursor-not-allowed",
            )}
          >
            <RefreshCw size={12} className={cn(isRunning && "animate-spin")} />
            {isRunning ? "Running..." : "Run Tests"}
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        <span className="text-emerald-400">{passCount} passed</span>
        {failCount > 0 && <span className="text-red-400">{failCount} failed</span>}
        {tests.length - passCount - failCount > 0 && (
          <span className="text-zinc-500">
            {tests.length - passCount - failCount} pending
          </span>
        )}
      </div>

      {/* Test results */}
      <div className="space-y-1">
        {tests.map((test) => {
          const config = STATUS_CONFIG[test.status];
          return (
            <div
              key={test.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg",
                "transition-colors",
                test.status === "fail" && "bg-red-500/5",
              )}
            >
              <span className={cn("flex-shrink-0", config.color)}>
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-zinc-300">{test.name}</span>
                {test.message && (
                  <p className="text-[10px] text-zinc-500 truncate">{test.message}</p>
                )}
              </div>
              {test.latency != null && (
                <span className="text-[10px] text-zinc-600 tabular-nums flex-shrink-0">
                  {test.latency}ms
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
