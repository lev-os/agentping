"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  className?: string;
}

/**
 * CommandPalette - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/CommandPalette.tsx
 * @migration-status candidate
 */
export function CommandPalette({ isOpen, onClose, commands = [], className }: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  React.useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div className={cn("relative w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl overflow-hidden", className)} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          className="w-full px-4 py-3 bg-transparent border-b border-border text-foreground text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
              onClick={() => { cmd.action(); onClose(); }}
            >
              <span className="flex items-center gap-2">
                {cmd.icon}
                {cmd.label}
              </span>
              {cmd.shortcut && <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{cmd.shortcut}</kbd>}
            </button>
          ))}
          {filtered.length === 0 && <div className="px-4 py-3 text-sm text-muted-foreground">No commands found</div>}
        </div>
      </div>
    </div>
  );
}
