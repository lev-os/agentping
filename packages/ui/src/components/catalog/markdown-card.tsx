"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MarkdownCardProps {
  content?: string;
  title?: string;
  onRespond?: (data: Record<string, unknown>) => void;
  className?: string;
}

/**
 * MarkdownCard - Catalog component from canvas package
 * @source packages/canvas/src/components/MarkdownCard.tsx
 * @catalog-status candidate
 * @needs-review Original uses react-markdown; catalog version uses pre-formatted text
 */
export function MarkdownCard({ content, title, className }: MarkdownCardProps) {
  return (
    <div className={cn("bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4", className)}>
      {title && (
        <h2 className="font-mono text-sm text-cyan-400 mb-3">{title}</h2>
      )}
      {content ? (
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gray-200 prose-headings:font-mono prose-code:text-cyan-400 prose-code:bg-gray-800/60 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-li:text-gray-300 prose-p:text-gray-300">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-600 font-mono">No content</p>
      )}
    </div>
  );
}
