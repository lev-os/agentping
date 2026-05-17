"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type LeaseStatus = "pending" | "active" | "expired" | "denied";

export interface LeaseApprovalProps {
  id?: string;
  agent?: string;
  resource?: string;
  status: LeaseStatus;
  requestedAt?: string;
  expiresAt?: Date | string;
  onApprove?: () => void;
  onDeny?: () => void;
  agentId?: string;
  agentName?: string;
  scope?: string;
  ttl?: number;
  reason?: string;
  constraints?: Record<string, unknown>;
  className?: string;
}

const statusStyle: Record<LeaseStatus, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  expired: "bg-muted text-muted-foreground border-border",
  denied: "bg-red-500/10 text-red-400 border-red-500/30",
};

/**
 * LeaseApproval - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LeaseApproval.tsx
 * @catalog-status candidate
 */
export function LeaseApproval({
  id: _id, agent, resource, status, requestedAt, expiresAt, onApprove, onDeny,
  agentId: _agentId, agentName, scope, ttl: _ttl, reason, constraints: _constraints,
  className
}: LeaseApprovalProps) {
  const expiresStr = expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt;
  const displayAgent = agent ?? agentName ?? "Unknown agent";
  const displayResource = resource ?? scope ?? "Unknown resource";
  return (
    <div className={cn("border rounded-md bg-card p-4", statusStyle[status], className)}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm font-medium text-foreground">{displayAgent}</div>
          <div className="text-xs text-muted-foreground">{displayResource}</div>
        </div>
        <span className="text-xs font-medium uppercase px-2 py-0.5 rounded">{status}</span>
      </div>
      {reason && <div className="text-xs text-muted-foreground mb-1">Reason: {reason}</div>}
      <div className="text-xs text-muted-foreground mb-3">
        {requestedAt && <>Requested: {requestedAt}</>}{expiresStr && `${requestedAt ? " \u00B7 " : ""}Expires: ${expiresStr}`}
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
