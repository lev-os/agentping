"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * MultiSelect - Accessible multi-select with WCAG 2.1 AA compliance
 * @source packages/adapters/web-ui/src/components/MultiSelect.tsx
 * @migration-status complete
 *
 * WCAG fixes: aria-multiselectable, Escape key, arrow nav, chip touch targets
 */
export function MultiSelect({ options = [], selected = [], onChange, placeholder = "Select...", className }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [focusIdx, setFocusIdx] = React.useState(-1);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const toggle = (value: string) => {
    const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
    onChange?.(next);
  };

  const close = () => {
    setOpen(false);
    setFocusIdx(-1);
    triggerRef.current?.focus();
  };

  // Focus the active option when focusIdx changes
  React.useEffect(() => {
    if (!open || focusIdx < 0) return;
    const btns = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    btns?.[focusIdx]?.focus();
  }, [open, focusIdx]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      setFocusIdx(0);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, options.length - 1)); break;
      case "ArrowUp": e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); break;
      case "Home": e.preventDefault(); setFocusIdx(0); break;
      case "End": e.preventDefault(); setFocusIdx(options.length - 1); break;
      case "Enter": case " ": e.preventDefault(); if (focusIdx >= 0) toggle(options[focusIdx].value); break;
      case "Escape": e.preventDefault(); close(); break;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        onClick={() => open ? close() : (setOpen(true), setFocusIdx(0))}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-card text-left min-h-[var(--min-touch-target,44px)]"
      >
        {selected.length > 0 ? (
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className="inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs text-foreground min-h-[var(--min-touch-target,44px)]">
                  {opt?.label ?? v}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(v); }}
                    aria-label={`Remove ${opt?.label ?? v}`}
                    className="text-muted-foreground hover:text-foreground min-w-[var(--min-touch-target,44px)] min-h-[var(--min-touch-target,44px)] flex items-center justify-center"
                  >&times;</button>
                </span>
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground flex-1">{placeholder}</span>
        )}
        <span className="text-muted-foreground text-xs shrink-0" aria-hidden="true">{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-multiselectable="true"
          aria-label={placeholder}
          onKeyDown={handleListKeyDown}
          className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {options.map((opt, idx) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={selected.includes(opt.value)}
              tabIndex={idx === focusIdx ? 0 : -1}
              onClick={() => toggle(opt.value)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors text-left min-h-[var(--min-touch-target,44px)]"
            >
              <span className={cn("h-4 w-4 rounded border flex items-center justify-center text-[10px]",
                selected.includes(opt.value) ? "border-primary bg-primary text-primary-foreground" : "border-border"
              )} aria-hidden="true">
                {selected.includes(opt.value) && "\u2713"}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
