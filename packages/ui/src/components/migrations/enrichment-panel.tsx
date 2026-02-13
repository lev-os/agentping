"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

// ============================================================================
// Local Types (no @agentping/core dependency)
// ============================================================================

export interface Directive {
  type: string;
  value: string;
}

export interface FileAttachment {
  id: string;
  file: File;
  previewUrl?: string;
}

export interface EnrichmentQuickAction {
  id: string;
  label: string;
  style: "primary" | "secondary" | "danger" | "ghost";
  shortcut?: string;
  onClick: () => void;
}

const DIRECTIVE_METADATA: Record<string, { label: string; inputPlaceholder: string }> = {
  focus_on: { label: "Focus", inputPlaceholder: "What should the agent focus on?" },
  skip: { label: "Skip", inputPlaceholder: "What should the agent skip?" },
  constraint: { label: "Constraint", inputPlaceholder: "Enter constraint details..." },
};

function formatDirective(d: Directive): string {
  return `${d.type}: ${d.value}`;
}

// ============================================================================
// Icons
// ============================================================================

const Icons = {
  Plus: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  X: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Paperclip: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>,
  Focus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>,
  Skip: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>,
  AlertOctagon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
};

const ICON_MAP: Record<string, () => React.JSX.Element> = {
  focus_on: Icons.Focus,
  skip: Icons.Skip,
  constraint: Icons.AlertOctagon,
};

// ============================================================================
// QuickActionBar
// ============================================================================

export interface QuickActionBarProps {
  actions: EnrichmentQuickAction[];
}

const STYLE_CLASSES: Record<EnrichmentQuickAction["style"], string> = {
  primary: "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-cyan-500/30",
  secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600/40",
  danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30",
  ghost: "bg-transparent text-zinc-400 hover:bg-zinc-800 border-transparent",
};

export function QuickActionBar({ actions }: QuickActionBarProps) {
  const valid = actions.filter((a) => !!a.label);
  if (valid.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {valid.map((action) => (
        <button
          key={action.id}
          className={cn(
            "px-2.5 py-1 text-xs font-mono rounded border transition-colors",
            STYLE_CLASSES[action.style],
          )}
          onClick={action.onClick}
          title={action.shortcut ? `Press ${action.shortcut}` : undefined}
        >
          {action.label}
          {action.shortcut && (
            <span className="ml-1.5 px-1 py-0.5 text-[10px] bg-black/40 rounded">{action.shortcut}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// EnrichmentPanel
// ============================================================================

export interface EnrichmentPanelProps {
  className?: string;
  children?: React.ReactNode;
  directives?: Directive[];
  notes?: string;
  onAddDirective?: (directive: Directive) => void;
  onRemoveDirective?: (index: number) => void;
  onNotesChange?: (notes: string) => void;
  attachments?: FileAttachment[];
  onAddAttachment?: (file: File) => void;
  onRemoveAttachment?: (id: string) => void;
  suggestedDirectives?: string[];
  actions?: EnrichmentQuickAction[];
}

export function EnrichmentPanel({
  className,
  children,
  directives = [],
  notes = "",
  onAddDirective,
  onRemoveDirective,
  onNotesChange,
  attachments = [],
  onAddAttachment,
  onRemoveAttachment,
  suggestedDirectives,
  actions = [],
}: EnrichmentPanelProps) {
  const [showInput, setShowInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleAddDirective = (type: string) => {
    if (showInput === type && inputValue.trim()) {
      onAddDirective?.({ type, value: inputValue.trim() });
      setInputValue("");
      setShowInput(null);
    } else {
      setShowInput(type);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleAddDirective(showInput!);
    } else if (e.key === "Escape") {
      setShowInput(null);
      setInputValue("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (onAddAttachment && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((f) => onAddAttachment(f));
    }
  };

  const suggestedTypes = suggestedDirectives?.length ? suggestedDirectives : ["focus_on", "skip", "constraint"];

  // Empty-state: no callbacks provided — render shell layout
  const isShell = !onAddDirective && !onNotesChange;
  if (isShell) {
    return (
      <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
        <div className="px-4 py-2 border-b border-cyan-500/10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Enrichment Panel</span>
        </div>
        <div className="p-4">
          {children ?? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Icons.Paperclip />
              <div className="text-xs font-mono text-cyan-500/30 text-center">
                No enrichment data available.<br />
                Select a directive to enrich.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden transition-colors",
        isDragging && "border-cyan-400/60 bg-cyan-500/5",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
            <Icons.Paperclip />
            <span>Drop files to attach</span>
          </div>
        </div>
      )}

      {/* Header / Actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/10">
        <div className="flex items-center gap-2 text-cyan-400">
          <Icons.Paperclip />
          <span className="text-xs font-mono uppercase tracking-wider">Enrichment</span>
        </div>
        <QuickActionBar actions={actions} />
      </div>

      {/* Directive Controls */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {suggestedTypes.map((type) => {
            const isActive = showInput === type;
            const meta = DIRECTIVE_METADATA[type];
            const IconComp = ICON_MAP[type] ?? Icons.Plus;
            return (
              <button
                key={type}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors",
                  isActive
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                    : "bg-zinc-900 border-zinc-700/50 text-zinc-400 hover:border-cyan-500/30 hover:text-cyan-400",
                )}
                onClick={() => handleAddDirective(type)}
              >
                <IconComp />
                {meta?.label ?? type}
              </button>
            );
          })}
        </div>

        {/* Input area */}
        {showInput && (
          <div className="mt-2 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-zinc-950 border border-cyan-500/20 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-cyan-500/50"
              placeholder={DIRECTIVE_METADATA[showInput]?.inputPlaceholder ?? `Enter ${showInput} details...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="text-[10px] font-mono text-zinc-600">&#x21B5;</span>
          </div>
        )}
      </div>

      {/* Active chips */}
      {(directives.length > 0 || attachments.length > 0) && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {directives.map((dir, i) => (
            <div
              key={`dir-${i}`}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs font-mono text-cyan-300"
            >
              <span>{formatDirective(dir)}</span>
              <button
                className="text-cyan-500/50 hover:text-cyan-300 transition-colors"
                onClick={() => onRemoveDirective?.(i)}
              >
                <Icons.X />
              </button>
            </div>
          ))}
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-800 border border-zinc-700/50 rounded text-xs font-mono text-zinc-300"
            >
              <Icons.Paperclip />
              <span>{att.file.name}</span>
              <span className="text-zinc-500">({(att.file.size / 1024).toFixed(1)}KB)</span>
              <button
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                onClick={() => onRemoveAttachment?.(att.id)}
              >
                <Icons.X />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Notes textarea */}
      <div className="px-4 pb-3">
        <textarea
          className="w-full bg-zinc-950 border border-cyan-500/10 rounded px-3 py-2 text-xs font-mono text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-cyan-500/30 resize-none"
          placeholder="Add notes... (Drag & Drop files supported)"
          value={notes}
          onChange={(e) => onNotesChange?.(e.target.value)}
          rows={1}
        />
      </div>
    </div>
  );
}
