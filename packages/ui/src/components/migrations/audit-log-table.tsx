"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "failure" | "warning";
}

export interface AuditLogTableProps {
  entries?: AuditEntry[];
  title?: string;
  className?: string;
}

/**
 * AuditLogTable - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/AuditLogTable.tsx
 * @migration-status candidate
 */
export function AuditLogTable({ entries = [], title, className }: AuditLogTableProps) {
  const statusColors: Record<string, string> = {
    success: "text-green-400",
    failure: "text-red-400",
    warning: "text-yellow-400",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "AUDIT LOG"}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              <th className="text-left px-3 py-2 text-cyan-400/80">TIME</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">USER</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">ACTION</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">RESOURCE</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                <td className="px-3 py-1 text-cyan-500/60">{e.timestamp}</td>
                <td className="px-3 py-1 text-cyan-300">{e.user}</td>
                <td className="px-3 py-1 text-cyan-300/80">{e.action}</td>
                <td className="px-3 py-1 text-cyan-300/60">{e.resource}</td>
                <td className={cn("px-3 py-1 uppercase", statusColors[e.status])}>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
