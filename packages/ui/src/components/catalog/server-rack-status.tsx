"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RackUnit {
  id: string;
  name: string;
  type: "server" | "network" | "storage" | "empty";
  status: "online" | "offline" | "maintenance";
  load?: number;
}

export interface ServerRackStatusProps {
  units?: RackUnit[];
  rackId?: string;
  className?: string;
}

/**
 * ServerRackStatus - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/ServerRackStatus.tsx
 * @catalog-status candidate
 */
export function ServerRackStatus({ units = [], rackId, className }: ServerRackStatusProps) {
  const statusColors: Record<string, string> = {
    online: "border-green-500/40 bg-green-500/5",
    offline: "border-red-500/40 bg-red-500/5",
    maintenance: "border-yellow-500/40 bg-yellow-500/5",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden w-64", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">RACK STATUS</span>
        {rackId && <span className="text-[10px] font-mono text-cyan-500/40">{rackId}</span>}
      </div>
      <div className="p-2 space-y-1">
        {units.map((unit) => (
          <div key={unit.id} className={cn("rounded border px-3 py-1.5 flex items-center gap-2", statusColors[unit.status])}>
            <span className="text-xs font-mono text-cyan-300 flex-1 truncate">{unit.name}</span>
            <span className="text-[10px] font-mono text-cyan-500/40">{unit.type}</span>
            {unit.load !== undefined && (
              <div className="w-8 h-1 bg-black/40 rounded-full">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${unit.load}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
