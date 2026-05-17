"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface FirewallRule {
  id: string;
  name: string;
  action: "allow" | "deny" | "log";
  source: string;
  destination: string;
  port: string;
  protocol: string;
  enabled: boolean;
}

export interface FirewallRulesProps {
  rules?: FirewallRule[];
  className?: string;
}

/**
 * FirewallRules - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/FirewallRules.tsx
 * @catalog-status candidate
 */
export function FirewallRules({ rules = [], className }: FirewallRulesProps) {
  const actionColors: Record<string, string> = {
    allow: "text-green-400 bg-green-500/10",
    deny: "text-red-400 bg-red-500/10",
    log: "text-cyan-400 bg-cyan-500/10",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">FIREWALL RULES</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              <th className="text-left px-3 py-2 text-cyan-400/80">RULE</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">ACTION</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">SRC</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">DST</th>
              <th className="text-left px-3 py-2 text-cyan-400/80">PORT</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className={cn("border-b border-cyan-500/5 hover:bg-cyan-500/5", !r.enabled && "opacity-30")}>
                <td className="px-3 py-1 text-cyan-300">{r.name}</td>
                <td className="px-3 py-1">
                  <span className={cn("px-1.5 py-0.5 rounded uppercase text-[10px]", actionColors[r.action])}>{r.action}</span>
                </td>
                <td className="px-3 py-1 text-cyan-300/60">{r.source}</td>
                <td className="px-3 py-1 text-cyan-300/60">{r.destination}</td>
                <td className="px-3 py-1 text-cyan-300/60">{r.port}/{r.protocol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
