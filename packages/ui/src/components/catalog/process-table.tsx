"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: "running" | "sleeping" | "stopped" | "zombie";
  user?: string;
}

export interface ProcessTableProps {
  processes?: ProcessInfo[];
  onKill?: (pid: number) => void;
  className?: string;
}

/**
 * ProcessTable - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/ProcessTable.tsx
 * @catalog-status candidate
 */
export function ProcessTable({ processes = [], onKill, className }: ProcessTableProps) {
  const statusColors: Record<string, string> = {
    running: "text-green-400",
    sleeping: "text-cyan-400/60",
    stopped: "text-yellow-400",
    zombie: "text-red-400",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">PROCESS TABLE</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              <th className="text-left px-3 py-2 text-cyan-400/80">PID</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">NAME</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">CPU</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">MEM</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">STATUS</th>
              {onKill && <th className="text-left px-3 py-2 text-cyan-400/80"></th>}
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.pid} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                <td className="px-3 py-1 text-cyan-500/60">{p.pid}</td>
                <td className="px-3 py-1 text-cyan-300">{p.name}</td>
                <td className="px-3 py-1 text-cyan-300/80">{p.cpu.toFixed(1)}%</td>
                <td className="px-3 py-1 text-cyan-300/80">{p.memory.toFixed(1)}%</td>
                <td className={cn("px-3 py-1 uppercase", statusColors[p.status])}>{p.status}</td>
                {onKill && (
                  <td className="px-3 py-1">
                    <button onClick={() => onKill(p.pid)} className="text-red-400/60 hover:text-red-400">KILL</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
