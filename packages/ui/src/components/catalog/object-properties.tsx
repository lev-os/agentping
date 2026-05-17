"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ObjectProperty {
  name: string;
  value: string | number | boolean;
  type?: string;
  editable?: boolean;
}

export interface ObjectPropertiesProps {
  properties?: ObjectProperty[];
  title?: string;
  onChange?: (name: string, value: string) => void;
  className?: string;
}

/**
 * ObjectProperties - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/ObjectProperties.tsx
 * @catalog-status candidate
 */
export function ObjectProperties({ properties = [], title, onChange, className }: ObjectPropertiesProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="px-4 py-2 border-b border-cyan-500/10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title}</span>
        </div>
      )}
      <div className="divide-y divide-cyan-500/5">
        {properties.map((prop) => (
          <div key={prop.name} className="flex items-center gap-3 px-4 py-1.5">
            <span className="text-xs font-mono text-cyan-500/60 w-28 truncate">{prop.name}</span>
            {prop.editable && onChange ? (
              <input
                defaultValue={String(prop.value)}
                onBlur={(e) => onChange(prop.name, e.target.value)}
                className="flex-1 bg-transparent border-b border-cyan-500/20 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-400"
              />
            ) : (
              <span className="text-xs font-mono text-cyan-300/80 flex-1">{String(prop.value)}</span>
            )}
            {prop.type && <span className="text-[10px] font-mono text-cyan-500/30">{prop.type}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
