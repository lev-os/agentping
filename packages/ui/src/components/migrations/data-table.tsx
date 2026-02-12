"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField?: keyof T & string;
  onRowClick?: (row: T) => void;
  className?: string;
}

/**
 * DataTable - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DataTable.tsx
 * @migration-status candidate
 */
export function DataTable<T extends Record<string, unknown>>({
  columns, data, keyField, onRowClick, className
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [data, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    if (sortKey === key) { setSortAsc(!sortAsc); } else { setSortKey(key); setSortAsc(true); }
  };

  return (
    <div className={cn("border border-border rounded-md overflow-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-3 py-2 text-left font-medium text-muted-foreground", col.sortable && "cursor-pointer hover:text-foreground")}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.header}
                {sortKey === col.key && <span className="ml-1">{sortAsc ? "\u25B2" : "\u25BC"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, ri) => (
            <tr
              key={keyField ? String(row[keyField]) : ri}
              className={cn("border-b border-border last:border-0 hover:bg-muted/30", onRowClick && "cursor-pointer")}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 text-foreground">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
