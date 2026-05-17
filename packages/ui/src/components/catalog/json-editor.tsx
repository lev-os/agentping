"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface JsonEditorProps {
  value: unknown;
  onChange?: (value: unknown) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * JsonEditor - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/JsonEditor.tsx
 * @catalog-status candidate
 */
export function JsonEditor({ value, onChange, readOnly = false, className }: JsonEditorProps) {
  const [text, setText] = React.useState(JSON.stringify(value, null, 2));
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (raw: string) => {
    setText(raw);
    try {
      const parsed = JSON.parse(raw);
      setError(null);
      onChange?.(parsed);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={readOnly}
        aria-label="JSON editor"
        className={cn(
          "font-mono text-xs p-3 rounded-md border bg-card text-foreground min-h-[120px] resize-y outline-none",
          error ? "border-destructive" : "border-border focus:border-primary"
        )}
      />
      {error && <span className="text-[10px] text-destructive">{error}</span>}
    </div>
  );
}
