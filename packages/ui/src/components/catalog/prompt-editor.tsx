"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PromptEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  variables?: string[];
  placeholder?: string;
  className?: string;
}

/**
 * PromptEditor - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/PromptEditor.tsx
 * @catalog-status candidate
 */
export function PromptEditor({ value = "", onChange, variables = [], placeholder = "Enter prompt...", className }: PromptEditorProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">PROMPT EDITOR</span>
        {variables.length > 0 && (
          <div className="flex gap-1">
            {variables.map((v) => (
              <span key={v} className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">{`{{${v}}}`}</span>
            ))}
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[120px] bg-transparent p-4 text-sm font-mono text-cyan-300 placeholder:text-cyan-500/20 outline-none resize-y"
      />
    </div>
  );
}
