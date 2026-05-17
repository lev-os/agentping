"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HttpRequest {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  status: number;
  duration: number;
  timestamp: string;
  size?: string;
}

export interface HttpInspectorProps {
  requests?: HttpRequest[];
  className?: string;
}

/**
 * HttpInspector - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/HttpInspector.tsx
 * @catalog-status candidate
 */
export function HttpInspector({ requests = [], className }: HttpInspectorProps) {
  const methodColors: Record<string, string> = {
    GET: "text-green-400",
    POST: "text-cyan-400",
    PUT: "text-orange-400",
    DELETE: "text-red-400",
    PATCH: "text-violet-400",
  };

  const statusColor = (s: number) => {
    if (s < 300) return "text-green-400";
    if (s < 400) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">HTTP INSPECTOR</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              <th className="text-left px-3 py-2 text-cyan-400/80">METHOD</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">URL</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">STATUS</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">TIME</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                <td className={cn("px-3 py-1 font-bold", methodColors[r.method])}>{r.method}</td>
                <td className="px-3 py-1 text-cyan-300/80 truncate max-w-[300px]">{r.url}</td>
                <td className={cn("px-3 py-1", statusColor(r.status))}>{r.status}</td>
                <td className="px-3 py-1 text-cyan-500/60">{r.duration}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
