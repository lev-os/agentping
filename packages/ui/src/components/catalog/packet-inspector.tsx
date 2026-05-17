"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Packet {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  flags?: string[];
}

export interface PacketInspectorProps {
  packets?: Packet[];
  className?: string;
}

/**
 * PacketInspector - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/PacketInspector.tsx
 * @catalog-status candidate
 */
export function PacketInspector({ packets = [], className }: PacketInspectorProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">PACKET INSPECTOR</span>
      </div>
      <div className="overflow-x-auto max-h-60">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10 sticky top-0 bg-black/80">
              <th className="text-left px-3 py-1.5 text-cyan-400/80">TIME</th>
              <th className="text-left px-3 py-1.5 text-cyan-400/80">SRC</th>
              <th className="text-left px-3 py-1.5 text-cyan-400/80">DST</th>
              <th className="text-left px-3 py-1.5 text-cyan-400/80">PROTO</th>
              <th className="text-left px-3 py-1.5 text-cyan-400/80">SIZE</th>
            </tr>
          </thead>
          <tbody>
            {packets.map((p) => (
              <tr key={p.id} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                <td className="px-3 py-1 text-cyan-500/40">{p.timestamp}</td>
                <td className="px-3 py-1 text-cyan-300/80">{p.source}</td>
                <td className="px-3 py-1 text-cyan-300/80">{p.destination}</td>
                <td className="px-3 py-1 text-cyan-400">{p.protocol}</td>
                <td className="px-3 py-1 text-cyan-300/60">{p.size}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
