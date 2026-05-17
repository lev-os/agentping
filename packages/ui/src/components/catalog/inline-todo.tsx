"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface InlineTodoItem {
  id: string;
  text: string;
  checked?: boolean;
  priority?: string;
}

export interface InlineTodoProps {
  title?: string;
  items?: InlineTodoItem[];
  onToggle?: (itemId: string, checked: boolean) => void;
  className?: string;
}

/**
 * InlineTodo - Lightweight checklist component
 * Extracted from CanvasRenderer for standalone use
 */
export function InlineTodo({
  title,
  items = [],
  onToggle,
  className,
}: InlineTodoProps) {
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
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 group">
            <button
              type="button"
              onClick={() => onToggle?.(item.id, !item.checked)}
              className={cn(
                "mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                item.checked
                  ? "bg-cyan-500 border-cyan-500"
                  : "border-gray-600 hover:border-cyan-500/50"
              )}
            >
              {item.checked && (
                <svg
                  className="w-2.5 h-2.5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span
              className={cn(
                "text-sm leading-snug",
                item.checked ? "line-through text-gray-600" : "text-gray-200"
              )}
            >
              {item.text}
            </span>
            {item.priority && (
              <span className="ml-auto text-[10px] font-mono text-gray-500 shrink-0">
                {item.priority}
              </span>
            )}
          </li>
        ))}
      </ul>
      {items.length === 0 && (
        <p className="text-xs text-gray-600 font-mono text-center py-4">
          No items
        </p>
      )}
    </div>
  );
}
