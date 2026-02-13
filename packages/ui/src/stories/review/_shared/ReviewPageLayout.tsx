"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";

interface ReviewPageLayoutProps {
  title: string;
  category: string;
  description?: string;
  children: React.ReactNode;
  componentCount?: number;
}

export function ReviewPageLayout({
  title,
  category,
  description,
  children,
  componentCount,
}: ReviewPageLayoutProps) {
  const [filter, setFilter] = React.useState("");

  return (
    <div className="min-h-screen bg-black/60 p-6">
      {/* Breadcrumb */}
      <nav className="mb-2 flex items-center gap-1 font-mono text-xs text-zinc-500">
        <span className="text-cyan-500/60">Review</span>
        <span>/</span>
        <span className="text-cyan-500/60">{category}</span>
        <span>/</span>
        <span className="text-cyan-300">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-medium text-cyan-300">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
        {componentCount != null && (
          <span className="mt-1 inline-block font-mono text-xs text-zinc-600">
            {componentCount} component{componentCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Search / Filter */}
      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter components..."
          className={cn(
            "w-full max-w-md rounded border border-cyan-500/10 bg-black/40 px-3 py-1.5",
            "font-mono text-sm text-cyan-300 placeholder-zinc-600",
            "outline-none transition-colors focus:border-cyan-500/30",
          )}
        />
      </div>

      {/* Content */}
      <ReviewFilterContext.Provider value={filter}>
        {children}
      </ReviewFilterContext.Provider>
    </div>
  );
}

const ReviewFilterContext = React.createContext("");

export function useReviewFilter() {
  return React.useContext(ReviewFilterContext);
}
