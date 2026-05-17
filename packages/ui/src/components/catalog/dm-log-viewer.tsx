"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

export interface DmLogLine {
  dashboardId?: string;
  line: string;
  stream: "stdout" | "stderr";
  timestamp: string;
}

export interface DmLogViewerProps {
  dashboardId: string;
  logs?: DmLogLine[];
  className?: string;
}

/**
 * DmLogViewer - Catalog component from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/LogViewer.tsx
 * @catalog-status candidate
 * @needs-review Original uses useWebSocket hook for live log streaming; catalog version is static
 */
export function DmLogViewer({ dashboardId, logs = [], className }: DmLogViewerProps) {
  const [filter, setFilter] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const filteredLogs = filter
    ? logs.filter((log) => log.line.toLowerCase().includes(filter.toLowerCase()))
    : logs;

  const handleCopy = () => {
    const text = filteredLogs.map((log) => log.line).join("\n");
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    const text = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.stream}] ${log.line}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboardId}-logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/10 bg-black/40">
        <div className="flex items-center gap-2 flex-1">
          <svg className="w-4 h-4 text-cyan-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-xs font-mono text-cyan-300 placeholder:text-cyan-500/30 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs font-mono text-cyan-500/60 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="accent-cyan-500"
            />
            Auto-scroll
          </label>
          <button onClick={handleCopy} className="text-cyan-500/40 hover:text-cyan-400 transition-colors" title="Copy">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button onClick={handleDownload} className="text-cyan-500/40 hover:text-cyan-400 transition-colors" title="Download">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-cyan-500/30 py-8">
            {filter ? "No logs match filter" : "No logs yet"}
          </div>
        ) : (
          <div className="space-y-px">
            {filteredLogs.map((log, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 px-1 py-0.5 rounded hover:bg-cyan-500/5",
                  log.stream === "stderr" && "text-red-400/80",
                )}
              >
                <span className="text-cyan-500/30 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-cyan-500/50 shrink-0">[{log.stream}]</span>
                <span className="text-cyan-300/80 break-all">{log.line}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
