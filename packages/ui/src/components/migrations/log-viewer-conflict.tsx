import * as React from "react";

type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: string;
}

export interface LogViewerConflictProps {
  entries: LogEntry[];
  maxHeight?: number;
  className?: string;
}

export interface LogViewerCandidateProps {
  reason?: string;
  ticket?: string;
  className?: string;
}

function levelClass(level: LogLevel) {
  switch (level) {
    case "error":
      return "text-rose-300";
    case "warn":
      return "text-amber-300";
    case "debug":
      return "text-sky-300";
    default:
      return "text-emerald-300";
  }
}

export function LogViewerStudioRaw({
  entries,
  maxHeight = 180,
  className,
}: LogViewerConflictProps) {
  return (
    <div
      className={[
        "w-full border border-slate-700 bg-slate-950 font-mono text-[11px] text-slate-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="border-b border-slate-700 px-2 py-1 uppercase tracking-[0.1em] text-slate-400">
        Stream
      </div>
      <div style={{ maxHeight }} className="overflow-auto">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-[70px_45px_1fr] gap-2 px-2 py-1 odd:bg-slate-900/50"
          >
            <span className="text-slate-500">{entry.timestamp}</span>
            <span className={levelClass(entry.level)}>{entry.level.toUpperCase()}</span>
            <span className="truncate">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogViewerWebUiRaw({
  entries,
  maxHeight = 180,
  className,
}: LogViewerConflictProps) {
  return (
    <div
      className={[
        "w-full rounded-md border border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="border-b border-zinc-700 px-2 py-1 text-zinc-400">Recent Logs</div>
      <div style={{ maxHeight }} className="space-y-1 overflow-auto p-2">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded border border-zinc-800 bg-zinc-950/70 p-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-500">{entry.timestamp}</span>
              <span className={levelClass(entry.level)}>{entry.level}</span>
            </div>
            <p className="mt-1 truncate text-zinc-200">{entry.message}</p>
            {entry.source ? <p className="mt-1 text-zinc-500">{entry.source}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogViewerCandidate({
  reason = "Deferred: evaluate virtualization and ANSI rendering parity before merge.",
  ticket = "MIG-LOGVIEWER",
  className,
}: LogViewerCandidateProps) {
  return (
    <div
      data-migration-status="deferred"
      className={[
        "w-full rounded-md border border-dashed border-amber-500/70 bg-amber-500/10 p-3 text-xs text-amber-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="font-semibold uppercase tracking-[0.08em]">Candidate Deferred</p>
      <p className="mt-2">{reason}</p>
      <p className="mt-2 text-[11px] text-amber-300/90">Tracking: {ticket}</p>
    </div>
  );
}
