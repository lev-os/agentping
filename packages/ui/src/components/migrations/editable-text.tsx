"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface EditableTextProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  className?: string;
}

/**
 * EditableText - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/EditableText.tsx
 * @migration-status candidate
 */
export function EditableText({ value, onChange, placeholder = "Click to edit...", label, multiline = false, className }: EditableTextProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  const commit = () => { setEditing(false); onChange?.(draft); };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="text-xs text-muted-foreground">{label}</label>}
      {editing ? (
        multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            className="px-2 py-1 text-sm bg-card border border-primary rounded-md text-foreground outline-none resize-y min-h-[60px]"
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="px-2 py-1 text-sm bg-card border border-primary rounded-md text-foreground outline-none"
          />
        )
      ) : (
        <button
          onClick={() => { setDraft(value); setEditing(true); }}
          className="text-left text-sm text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted"
          aria-label={label ? `Edit ${label}` : "Click to edit"}
        >
          {value || <span className="text-muted-foreground">{placeholder}</span>}
        </button>
      )}
    </div>
  );
}
