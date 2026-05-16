"use client";

/**
 * VoiceConsole — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/VoiceConsole.tsx
 * @migration-status needs-review — runtime coupled (speech recognition, keyboard shortcuts)
 * @category root
 */

import React from "react";
import { Mic, MicOff, Volume2, X, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface VoicePresetCommand {
  label: string;
  command: string;
}

export interface VoiceConsoleProps {
  /** Whether the console is open */
  isOpen: boolean;
  /** Toggle open/closed */
  onToggle: () => void;
  /** Command handler */
  onCommand?: (command: string) => void;
  /** Preset voice commands */
  presetCommands?: VoicePresetCommand[];
  /** Whether actively listening */
  isListening?: boolean;
  /** Current transcript text */
  transcript?: string;
  /** Last response text */
  response?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_PRESETS: VoicePresetCommand[] = [
  { label: "Run Tests", command: "run tests" },
  { label: "Build Project", command: "build project" },
  { label: "Git Status", command: "git status" },
  { label: "Show Logs", command: "show logs" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function VoiceConsole({
  isOpen,
  onToggle,
  onCommand,
  presetCommands = DEFAULT_PRESETS,
  isListening = false,
  transcript = "",
  response = "",
  className,
}: VoiceConsoleProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-80",
        "bg-zinc-900 border border-zinc-700/50 rounded-xl",
        "shadow-2xl shadow-black/40",
        "animate-in slide-in-from-bottom-2 fade-in duration-200",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-cyan-400" />
          <span className="text-sm font-medium text-zinc-200">Voice Console</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Close voice console"
        >
          <X size={14} />
        </button>
      </div>

      {/* Listening indicator */}
      <div className="flex flex-col items-center py-6 px-4">
        <button
          onClick={() => {
            /* stub: toggle listening state */
          }}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            "transition-all duration-300",
            isListening
              ? "bg-red-500/20 border-2 border-red-500 text-red-400 animate-pulse"
              : "bg-cyan-500/10 border-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20",
          )}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <span className="mt-3 text-xs text-zinc-500">
          {isListening ? "Listening..." : "Click to start"}
        </span>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="px-4 pb-3">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Transcript
          </span>
          <p className="text-sm text-zinc-300 mt-1">{transcript}</p>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="px-4 pb-3">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Response
          </span>
          <p className="text-sm text-zinc-400 mt-1">{response}</p>
        </div>
      )}

      {/* Preset commands */}
      <div className="px-4 pb-4">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
          Quick Commands
        </span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {presetCommands.map((preset) => (
            <button
              key={preset.command}
              onClick={() => onCommand?.(preset.command)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md",
                "text-xs text-zinc-400 bg-zinc-800/50 border border-zinc-700/30",
                "hover:text-zinc-200 hover:bg-zinc-800 transition-colors",
              )}
            >
              <Zap size={10} className="text-cyan-500" />
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
