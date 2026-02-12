"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * Pagination - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/Pagination.tsx
 * @migration-status candidate
 */
export function Pagination({ currentPage = 1, totalPages = 1, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-1", className)} role="navigation" aria-label="Pagination">
      <button
        className="px-2 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10 disabled:opacity-30"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"\u2039"}
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={cn(
            "w-7 h-7 rounded text-xs font-mono border transition-colors",
            page === currentPage ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "border-cyan-500/10 text-cyan-500/60 hover:bg-cyan-500/5"
          )}
          onClick={() => onPageChange?.(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        className="px-2 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10 disabled:opacity-30"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {"\u203A"}
      </button>
    </div>
  );
}
