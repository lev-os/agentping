"use client";

/**
 * ApprovalQueue — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/ApprovalQueue.tsx
 * @migration-status needs-review — runtime coupled (window.claudeCode, tool approval bridge)
 * @category root
 */

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Shield,
  Terminal,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface PendingApproval {
  id: string;
  toolName: string;
  input?: Record<string, unknown>;
  description?: string;
  timestamp: Date;
  diff?: string;
}

export interface ApprovalQueueProps {
  /** List of pending tool approvals */
  approvals: PendingApproval[];
  /** Approve a tool use */
  onApprove?: (id: string) => void;
  /** Reject a tool use */
  onReject?: (id: string) => void;
  /** Approve all pending */
  onApproveAll?: () => void;
  /** Reject all pending */
  onRejectAll?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Sub-component: Approval item                                        */
/* ------------------------------------------------------------------ */

function ApprovalItem({
  approval,
  onApprove,
  onReject,
}: {
  approval: PendingApproval;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border border-amber-500/20 bg-amber-500/5",
        "overflow-hidden",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-0.5 text-zinc-500 hover:text-zinc-300"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>

        <Terminal size={12} className="text-zinc-500" />
        <span className="font-mono text-xs text-cyan-400 flex-1 truncate">
          {approval.toolName}
        </span>

        <div className="flex items-center gap-1">
          {onApprove && (
            <button
              onClick={() => onApprove(approval.id)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium",
                "bg-emerald-600/20 text-emerald-400",
                "hover:bg-emerald-600/30 transition-colors",
              )}
            >
              Approve
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(approval.id)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium",
                "bg-red-600/20 text-red-400",
                "hover:bg-red-600/30 transition-colors",
              )}
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800 px-3 py-2 space-y-2">
          {approval.description && (
            <p className="text-xs text-zinc-400">{approval.description}</p>
          )}
          {approval.input && (
            <pre className="text-[10px] text-zinc-500 bg-zinc-950/50 rounded p-2 overflow-x-auto">
              {JSON.stringify(approval.input, null, 2)}
            </pre>
          )}
          {approval.diff && (
            <pre className="text-[10px] text-zinc-500 bg-zinc-950/50 rounded p-2 overflow-x-auto max-h-32 font-mono">
              {approval.diff}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ApprovalQueue({
  approvals,
  onApprove,
  onReject,
  onApproveAll,
  onRejectAll,
  className,
}: ApprovalQueueProps) {
  if (approvals.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Header with batch actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-amber-400" />
          <span className="text-xs font-medium text-zinc-300">
            {approvals.length} pending approval{approvals.length !== 1 ? "s" : ""}
          </span>
        </div>

        {approvals.length > 1 && (
          <div className="flex items-center gap-1.5">
            {onApproveAll && (
              <button
                onClick={onApproveAll}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
              >
                <CheckCircle size={10} />
                Approve All
              </button>
            )}
            {onRejectAll && (
              <button
                onClick={onRejectAll}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              >
                <XCircle size={10} />
                Reject All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Approval items */}
      {approvals.map((approval) => (
        <ApprovalItem
          key={approval.id}
          approval={approval}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
