"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DataGridColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
}

export interface AdvancedDataGridProps {
  columns?: DataGridColumn[];
  data?: Record<string, unknown>[];
  title?: string;
  className?: string;
}

/**
 * AdvancedDataGrid - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/AdvancedDataGrid.tsx
 * @catalog-status candidate
 */
export function AdvancedDataGrid({ columns = [], data = [], title, className }: AdvancedDataGridProps) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [filter, setFilter] = React.useState("");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = React.useMemo(() => {
    const items = [...data];
    if (sortKey) {
      items.sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return items;
  }, [data, sortKey, sortDir]);

  const filtered = sorted.filter((row) =>
    columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "DATA GRID"}</span>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="FILTER..."
          className="bg-black/40 border border-cyan-500/20 rounded px-2 py-0.5 text-xs font-mono text-cyan-300 placeholder:text-cyan-500/30 w-40"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-3 py-2 text-cyan-400/80 uppercase cursor-pointer hover:text-cyan-300"
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && <span className="ml-1">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-1.5 text-cyan-300/80">
                    {String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
