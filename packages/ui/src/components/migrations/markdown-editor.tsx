"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * MarkdownEditor - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/MarkdownEditor.tsx
 * @migration-status candidate
 */
export function MarkdownEditor({ initialValue = "", onChange, className }: MarkdownEditorProps) {
  const [value, setValue] = React.useState(initialValue);
  const [preview, setPreview] = React.useState(false);

  const handleChange = (v: string) => { setValue(v); onChange?.(v); };

  return (
    <div className={cn("border border-border rounded-md overflow-hidden", className)}>
      <div className="flex border-b border-border bg-muted/50">
        <button onClick={() => setPreview(false)} className={cn("px-3 py-1.5 text-xs", !preview ? "text-foreground font-medium" : "text-muted-foreground")}>Edit</button>
        <button onClick={() => setPreview(true)} className={cn("px-3 py-1.5 text-xs", preview ? "text-foreground font-medium" : "text-muted-foreground")}>Preview</button>
      </div>
      {preview ? (
        <div className="p-3 text-sm text-foreground prose prose-sm prose-invert max-w-none min-h-[120px]">
          {/* TODO: Integrate markdown renderer */}
          <pre className="whitespace-pre-wrap">{value}</pre>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full p-3 text-sm bg-transparent text-foreground outline-none resize-y min-h-[120px] font-mono"
        />
      )}
    </div>
  );
}
