"use client";

/**
 * SettingsModal — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/SettingsModal.tsx
 * @migration-status needs-review — runtime coupled (Claude Code settings)
 * @category root
 */

import React, { useState, useEffect } from "react";
import { Save, RotateCw } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface StudioSettings {
  model?: string;
  maxTurns?: number;
  autoApprove?: boolean;
  temperature?: number;
  systemPrompt?: string;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onSave: (settings: StudioSettings) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  className,
}: SettingsModalProps) {
  const [draft, setDraft] = useState<StudioSettings>(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          "relative w-full max-w-lg mx-4",
          "bg-zinc-900 border border-zinc-700/50 rounded-xl",
          "shadow-2xl shadow-black/40",
          "animate-in fade-in zoom-in-95 duration-200",
          className,
        )}
      >
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">Settings</h2>
          <p className="text-xs text-zinc-500 mt-1">Configure AI assistant behavior</p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Model</label>
            <select
              value={draft.model ?? ""}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm",
                "bg-zinc-800/50 border border-zinc-700/50 text-zinc-200",
                "focus:outline-none focus:ring-1 focus:ring-cyan-500/50",
              )}
            >
              <option value="claude-sonnet-4-5-20250929">Claude Sonnet 4.5</option>
              <option value="claude-opus-4-6">Claude Opus 4.6</option>
              <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
            </select>
          </div>

          {/* Max Turns */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Max Turns</label>
            <input
              type="number"
              value={draft.maxTurns ?? 25}
              onChange={(e) => setDraft({ ...draft, maxTurns: Number(e.target.value) })}
              min={1}
              max={100}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm",
                "bg-zinc-800/50 border border-zinc-700/50 text-zinc-200",
                "focus:outline-none focus:ring-1 focus:ring-cyan-500/50",
              )}
            />
          </div>

          {/* Auto Approve */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-medium text-zinc-400">Auto Approve</label>
              <p className="text-[10px] text-zinc-600">Automatically approve tool use</p>
            </div>
            <button
              onClick={() => setDraft({ ...draft, autoApprove: !draft.autoApprove })}
              className={cn(
                "w-10 h-5 rounded-full transition-colors duration-200",
                draft.autoApprove ? "bg-cyan-600" : "bg-zinc-700",
              )}
            >
              <span
                className={cn(
                  "block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                  draft.autoApprove ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>

          {/* System Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">System Prompt</label>
            <textarea
              value={draft.systemPrompt ?? ""}
              onChange={(e) => setDraft({ ...draft, systemPrompt: e.target.value })}
              rows={3}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm resize-none",
                "bg-zinc-800/50 border border-zinc-700/50 text-zinc-200",
                "focus:outline-none focus:ring-1 focus:ring-cyan-500/50",
              )}
              placeholder="Optional system prompt override..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={handleReset}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm",
              "text-zinc-400 hover:text-zinc-200 hover:bg-white/5",
              "transition-colors",
            )}
          >
            <RotateCw size={14} />
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium",
              "bg-cyan-600 text-white hover:bg-cyan-500",
              "transition-colors",
            )}
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
