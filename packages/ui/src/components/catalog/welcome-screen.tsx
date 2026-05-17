"use client";

/**
 * WelcomeScreen — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/chat/WelcomeScreen.tsx
 * @catalog-status complete
 * @category chat
 */

import React from "react";
import { Bot, Code, FileSearch, MessageSquare, Sparkles, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  prompt?: string;
}

export interface WelcomeScreenProps {
  /** Quick action button handler */
  onStartSession?: (prompt?: string) => void;
  /** Whether the system is loading/connecting */
  isLoading?: boolean;
  /** Override the default quick actions */
  quickActions?: QuickAction[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    icon: <Code size={20} />,
    label: "Write Code",
    description: "Generate, refactor, or debug code",
    prompt: "Help me write code for ",
  },
  {
    icon: <FileSearch size={20} />,
    label: "Explore Codebase",
    description: "Navigate and understand project structure",
    prompt: "Help me explore the codebase and find ",
  },
  {
    icon: <Sparkles size={20} />,
    label: "Design System",
    description: "Create or modify UI components",
    prompt: "Help me design a component for ",
  },
  {
    icon: <Zap size={20} />,
    label: "Quick Task",
    description: "Automate a development task",
    prompt: "Help me automate ",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function WelcomeScreen({
  onStartSession,
  isLoading = false,
  quickActions = DEFAULT_ACTIONS,
  className,
}: WelcomeScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full",
        "px-8 py-12",
        className,
      )}
    >
      {/* Logo + title */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl mb-4",
            "bg-gradient-to-br from-cyan-500/20 to-blue-600/20",
            "border border-cyan-500/20",
            "flex items-center justify-center",
          )}
        >
          <Bot size={32} className="text-cyan-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-1">
          AgentPing Studio
        </h2>
        <p className="text-sm text-zinc-500">
          Your AI-powered development companion
        </p>
      </div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-8">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onStartSession?.(action.prompt)}
            disabled={isLoading}
            className={cn(
              "flex flex-col items-start gap-2 p-4 rounded-xl",
              "bg-zinc-800/30 border border-zinc-700/30",
              "text-left transition-all duration-150",
              "hover:bg-zinc-800/50 hover:border-zinc-600/30",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            <span className="text-cyan-400">{action.icon}</span>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                {action.label}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="flex items-center gap-2 text-xs text-zinc-600">
        <MessageSquare size={12} />
        <span>Type a message below to get started</span>
      </div>
    </div>
  );
}
