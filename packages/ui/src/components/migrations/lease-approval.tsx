"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type LeaseStatus = "pending" | "active" | "expired" | "denied";

export interface LeaseApprovalProps {
  id: string;
  agent: string;
  resource: string;
  status: LeaseStatus;
  requestedAt: string;
  expiresAt?: string;
  onApprove?: () => void;
  onDeny?: () => void;
  className?: string;
}

const statusStyle: Record<LeaseStatus, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  expired: "bg-muted text-muted-foreground border-border",
  denied: "bg-red-500/10 text-red-400 border-red-500/30",
};

/**
 * LeaseApproval - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LeaseApproval.tsx
 * @migration-status candidate
 */
export function LeaseApproval({
  id, agent, resource, status, requestedAt, expiresAt, onApprove, onDeny, className
}: LeaseApprovalProps) {
  return (
    <div className={cn("border rounded-md bg-card p-4", statusStyle[status], className)}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm font-medium text-foreground">{agent}</div>
          <div className="text-xs text-muted-foreground">{resource}</div>
        </div>
        <span className="text-xs font-medium uppercase px-2 py-0.5 rounded">{status}</span>
      </div>
      <div className="text-xs text-muted-foreground mb-3">
        Requested: {requestedAt}{expiresAt && ` \u00B7 Expires: ${expiresAt}`}
      </div>
      {status === "pending" && (
        <div className="flex gap-2">
          <button onClick={onApprove} className="px-3 py-1 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Approve</button>
          <button onClick={onDeny} className="px-3 py-1 text-xs rounded-md border border-border text-foreground hover:bg-muted">Deny</button>
        </div>
      )}
    </div>
  );
}
