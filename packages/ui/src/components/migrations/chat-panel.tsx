"use client";

/**
 * ChatPanel — Migration candidate from Studio
 *
 * Main chat interface composing ChatHeader, SessionTabs, ChatMessage,
 * ChatInput, ChatSearch, WelcomeScreen, and ApprovalQueue.
 *
 * @source packages/studio/src/renderer/components/ChatPanel.tsx
 * @migration-status needs-review — runtime coupled (forwardRef imperative handle, bridge state)
 * @category root
 */

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types (simplified from the ~740-line original)                      */
/* ------------------------------------------------------------------ */

export interface ChatPanelMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
}

export interface ChatPanelProps {
  /** Chat messages */
  messages?: ChatPanelMessage[];
  /** Whether connected to backend */
  isConnected?: boolean;
  /** Current workspace path */
  workspacePath?: string;
  /** Send message handler */
  onSendMessage?: (content: string) => void;
  /** Whether assistant is responding */
  isResponding?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component (visual shell)                                            */
/* ------------------------------------------------------------------ */

export function ChatPanel({
  messages = [],
  isConnected = false,
  workspacePath,
  onSendMessage,
  isResponding = false,
  className,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!inputValue.trim() || isResponding) return;
    onSendMessage?.(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className={cn("flex flex-col h-full bg-zinc-950", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-emerald-400" : "bg-zinc-600",
            )}
          />
          <span className="text-xs font-medium text-zinc-300">Chat</span>
        </div>
        {workspacePath && (
          <span className="text-[10px] text-zinc-600 truncate max-w-[150px]">
            {workspacePath.split("/").pop()}
          </span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8 py-12">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-lg">AI</span>
            </div>
            <p className="text-sm text-zinc-300 mb-1">AgentPing Studio</p>
            <p className="text-xs text-zinc-500">Type a message to get started</p>
          </div>
        ) : (
          <div className="py-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 px-4 py-3",
                  "hover:bg-white/[0.01] transition-colors",
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === "user"
                      ? "bg-zinc-700"
                      : "bg-cyan-900/50 border border-cyan-500/20",
                  )}
                >
                  <span className={cn("text-[10px] font-medium", msg.role === "user" ? "text-zinc-300" : "text-cyan-400")}>
                    {msg.role === "user" ? "U" : "AI"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-zinc-400">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </span>
                    {msg.timestamp && (
                      <span className="text-[10px] text-zinc-600">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-flex gap-1 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-800">
        <div
          className={cn(
            "flex items-end gap-2 p-2",
            "bg-zinc-800/50 border border-zinc-700/50 rounded-xl",
            "focus-within:border-cyan-500/30 transition-colors",
          )}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className={cn(
              "flex-1 bg-transparent resize-none",
              "text-sm text-zinc-200 placeholder-zinc-500",
              "outline-none min-h-[36px] max-h-[120px] py-2",
            )}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isResponding}
            className={cn(
              "p-2 rounded-lg transition-all",
              inputValue.trim() && !isResponding
                ? "bg-cyan-600 text-white hover:bg-cyan-500"
                : "bg-zinc-700/50 text-zinc-500 cursor-not-allowed",
            )}
          >
            {isResponding ? (
              <div className="w-4 h-4 border-2 border-zinc-500 border-t-cyan-400 rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
