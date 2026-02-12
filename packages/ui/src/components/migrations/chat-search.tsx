"use client";

/**
 * ChatSearch — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/chat/ChatSearch.tsx
 * @migration-status complete
 * @category chat
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface SearchableMessage {
  id: string;
  content: string;
  role: string;
}

export interface ChatSearchProps {
  /** Messages to search through */
  messages: SearchableMessage[];
  /** Whether the search panel is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Navigate to a specific message by id */
  onNavigateToMessage?: (messageId: string) => void;
  className?: string;
}

interface SearchResult {
  messageId: string;
  matchIndex: number;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChatSearch({
  messages,
  isOpen,
  onClose,
  onNavigateToMessage,
  className,
}: ChatSearchProps) {
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matches: SearchResult[] = [];
    messages.forEach((msg) => {
      const content = msg.content.toLowerCase();
      let idx = content.indexOf(q);
      let matchCount = 0;
      while (idx !== -1) {
        matches.push({ messageId: msg.id, matchIndex: matchCount });
        matchCount++;
        idx = content.indexOf(q, idx + 1);
      }
    });
    return matches;
  }, [query, messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen]);

  // Navigate to current result
  useEffect(() => {
    if (results.length > 0 && results[currentIndex]) {
      onNavigateToMessage?.(results[currentIndex].messageId);
    }
  }, [currentIndex, results, onNavigateToMessage]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < results.length - 1 ? i + 1 : 0));
  }, [results.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : results.length - 1));
  }, [results.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) goPrev();
      else goNext();
    }
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2",
        "bg-zinc-900 border-b border-zinc-800",
        "animate-in slide-in-from-top-1 duration-150",
        className,
      )}
    >
      <Search size={14} className="text-zinc-500 flex-shrink-0" />

      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setCurrentIndex(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search messages..."
        className={cn(
          "flex-1 bg-transparent text-sm text-zinc-200",
          "placeholder-zinc-500 outline-none",
        )}
      />

      {query && (
        <span className="text-xs text-zinc-500 tabular-nums flex-shrink-0">
          {results.length > 0
            ? `${currentIndex + 1}/${results.length}`
            : "No results"}
        </span>
      )}

      <div className="flex items-center gap-0.5">
        <button
          onClick={goPrev}
          disabled={results.length === 0}
          className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-colors"
          aria-label="Previous result"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={goNext}
          disabled={results.length === 0}
          className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-colors"
          aria-label="Next result"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      <button
        onClick={onClose}
        className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
        aria-label="Close search"
      >
        <X size={14} />
      </button>
    </div>
  );
}
