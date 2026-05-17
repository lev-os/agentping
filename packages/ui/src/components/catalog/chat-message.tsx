"use client";

/**
 * ChatMessage — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/chat/ChatMessage.tsx
 * @catalog-status needs-review — runtime coupled (markdown rendering, syntax highlighting)
 * @category chat
 */

import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ToolUse {
  id: string;
  name: string;
  input?: Record<string, unknown>;
  result?: string;
  status?: "pending" | "running" | "success" | "error";
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date;
  toolUse?: ToolUse[];
  isStreaming?: boolean;
}

export interface ChatMessageProps {
  message: Message;
  /** Custom markdown renderer — defaults to raw text */
  renderContent?: (content: string) => React.ReactNode;
  /** Tool card renderer */
  renderToolCard?: (tool: ToolUse) => React.ReactNode;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function MessageAvatar({ role }: { role: MessageRole }) {
  if (role === "user") {
    return (
      <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
        <User size={14} className="text-zinc-300" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-cyan-900/50 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
      <Bot size={14} className="text-cyan-400" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className="inline-flex gap-1 items-center">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:300ms]" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChatMessage({
  message,
  renderContent,
  renderToolCard,
  className,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className={cn("flex justify-center py-2", className)}>
        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3",
        "hover:bg-white/[0.01] transition-colors",
        className,
      )}
    >
      <MessageAvatar role={message.role} />

      <div className="flex-1 min-w-0">
        {/* Role label + timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-zinc-400">
            {isUser ? "You" : "Assistant"}
          </span>
          {message.timestamp && (
            <span className="text-[10px] text-zinc-600">
              {message.timestamp instanceof Date
                ? message.timestamp.toLocaleTimeString()
                : String(message.timestamp)}
            </span>
          )}
        </div>

        {/* Message body */}
        <div className="text-sm text-zinc-300 leading-relaxed">
          {message.isStreaming && !message.content ? (
            <TypingIndicator />
          ) : renderContent ? (
            renderContent(message.content)
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Tool uses */}
        {message.toolUse && message.toolUse.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.toolUse.map((tool) =>
              renderToolCard ? (
                renderToolCard(tool)
              ) : (
                <div
                  key={tool.id}
                  className={cn(
                    "rounded-lg border border-zinc-800 bg-zinc-900/50 p-3",
                    "text-xs text-zinc-400",
                  )}
                >
                  <span className="font-mono text-cyan-500">{tool.name}</span>
                  {tool.status && (
                    <span
                      className={cn(
                        "ml-2 px-1.5 py-0.5 rounded text-[10px]",
                        tool.status === "success" && "bg-emerald-500/10 text-emerald-400",
                        tool.status === "error" && "bg-red-500/10 text-red-400",
                        tool.status === "running" && "bg-cyan-500/10 text-cyan-400",
                        tool.status === "pending" && "bg-zinc-500/10 text-zinc-500",
                      )}
                    >
                      {tool.status}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
