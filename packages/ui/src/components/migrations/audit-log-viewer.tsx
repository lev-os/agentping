"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  details?: string;
}

export interface AuditLogViewerProps {
  logs: AuditEntry[];
  className?: string;
}

/**
 * AuditLogViewer - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/AuditLogViewer.tsx
 * @migration-status candidate
 */
export function AuditLogViewer({ logs = [], className }: AuditLogViewerProps) {
  return (
    <div className={cn("border border-border rounded-md overflow-hidden", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Time</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Actor</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Action</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Resource</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((entry) => (
            <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{entry.timestamp}</td>
              <td className="px-3 py-2 text-foreground">{entry.actor}</td>
              <td className="px-3 py-2 text-foreground">{entry.action}</td>
              <td className="px-3 py-2 text-foreground">{entry.resource}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
