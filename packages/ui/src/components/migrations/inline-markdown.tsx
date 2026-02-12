"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface InlineMarkdownProps {
  title?: string;
  content?: string;
  className?: string;
}

/**
 * InlineMarkdown - Lightweight markdown card display
 * Extracted from CanvasRenderer for standalone use
 */
export function InlineMarkdown({
  title,
  content,
  className,
}: InlineMarkdownProps) {
  return (
    <div
      className={cn(
        "bg-black/40 backdrop-blur-md rounded-xl border border-cyan-500/10 p-4",
        className
      )}
    >
      {title && (
        <h2 className="font-mono text-sm text-cyan-400 mb-3">{title}</h2>
      )}
      {content ? (
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gray-200 prose-headings:font-mono prose-code:text-cyan-400 prose-p:text-gray-300">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-600 font-mono">No content</p>
      )}
    </div>
  );
}
