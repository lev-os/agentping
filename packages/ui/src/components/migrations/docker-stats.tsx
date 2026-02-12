"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ContainerStats {
  id: string;
  name: string;
  status: "running" | "stopped" | "paused";
  cpu: number;
  memory: number;
  memoryLimit: string;
  network?: string;
}

export interface DockerStatsProps {
  containers?: ContainerStats[];
  className?: string;
}

/**
 * DockerStats - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/DockerStats.tsx
 * @migration-status candidate
 */
export function DockerStats({ containers = [], className }: DockerStatsProps) {
  const statusColors: Record<string, string> = {
    running: "bg-green-500",
    stopped: "bg-red-500",
    paused: "bg-yellow-500",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">DOCKER STATS</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              <th className="text-left px-3 py-2 text-cyan-400/80">CONTAINER</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">STATUS</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">CPU</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">MEM</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.id} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                <td className="px-3 py-1.5 text-cyan-300">{c.name}</td>
                <td className="px-3 py-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", statusColors[c.status])} />
                    <span className="text-cyan-300/80">{c.status}</span>
                  </span>
                </td>
                <td className="px-3 py-1.5 text-cyan-300/80">{c.cpu.toFixed(1)}%</td>
                <td className="px-3 py-1.5 text-cyan-300/80">{c.memory.toFixed(0)}MB / {c.memoryLimit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
