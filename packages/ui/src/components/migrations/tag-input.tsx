"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TagInputProps {
  tags?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags = [],
  onChange,
  placeholder = "Add tag...",
  maxTags = 20,
  className,
}: TagInputProps) {
  const [input, setInput] = React.useState("");

  const addTag = () => {
    const value = input.trim();
    if (!value || tags.includes(value) || tags.length >= maxTags) return;
    onChange?.([...tags, value]);
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange?.(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-3 font-mono",
        className
      )}
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-cyan-500/60 hover:text-cyan-300 ml-1"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
        disabled={tags.length >= maxTags}
        className="w-full bg-transparent border-0 border-t border-cyan-500/10 pt-2 text-sm text-cyan-100 placeholder:text-cyan-500/30 focus:outline-none focus:border-cyan-500/40"
      />
    </div>
  );
}
