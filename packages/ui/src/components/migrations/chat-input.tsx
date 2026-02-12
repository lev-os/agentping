"use client";

/**
 * ChatInput — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/chat/ChatInput.tsx
 * @migration-status needs-review — runtime coupled (slash commands from bridge)
 * @category chat
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Send, Slash, Paperclip, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface SlashCommand {
  name: string;
  description: string;
}

export interface ChatInputProps {
  /** Current input value (controlled) */
  value?: string;
  /** Input change handler */
  onChange?: (value: string) => void;
  /** Send message handler */
  onSend?: (message: string) => void;
  /** Available slash commands */
  slashCommands?: SlashCommand[];
  /** Whether a message is currently being sent */
  isSending?: boolean;
  /** Input placeholder text */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** File attach handler (optional) */
  onAttach?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChatInput({
  value: controlledValue,
  onChange,
  onSend,
  slashCommands = [],
  isSending = false,
  placeholder = "Type a message...",
  disabled = false,
  onAttach,
  className,
}: ChatInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue ?? internalValue;
  const setValue = (v: string) => {
    if (onChange) onChange(v);
    else setInternalValue(v);
  };

  const filteredCommands = slashCommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(slashFilter.toLowerCase()),
  );

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSend = useCallback(() => {
    if (!value.trim() || isSending || disabled) return;
    onSend?.(value.trim());
    setValue("");
    setShowSlashMenu(false);
  }, [value, isSending, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSlashMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          i < filteredCommands.length - 1 ? i + 1 : 0,
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          i > 0 ? i - 1 : filteredCommands.length - 1,
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const cmd = filteredCommands[highlightedIndex];
        if (cmd) {
          setValue(`/${cmd.name} `);
          setShowSlashMenu(false);
        }
        return;
      }
      if (e.key === "Escape") {
        setShowSlashMenu(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);

    // Detect slash command trigger
    if (v.startsWith("/") && !v.includes(" ")) {
      setSlashFilter(v.slice(1));
      setShowSlashMenu(true);
      setHighlightedIndex(0);
    } else {
      setShowSlashMenu(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Slash command autocomplete */}
      {showSlashMenu && filteredCommands.length > 0 && (
        <div
          className={cn(
            "absolute bottom-full left-0 right-0 mb-1",
            "bg-zinc-900 border border-zinc-700/50 rounded-lg",
            "shadow-xl shadow-black/30 max-h-48 overflow-y-auto",
          )}
        >
          {filteredCommands.map((cmd, i) => (
            <button
              key={cmd.name}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                i === highlightedIndex
                  ? "bg-white/5 text-zinc-100"
                  : "text-zinc-400",
                "hover:bg-white/5 transition-colors",
              )}
              onClick={() => {
                setValue(`/${cmd.name} `);
                setShowSlashMenu(false);
                textareaRef.current?.focus();
              }}
            >
              <Slash size={12} className="text-cyan-500" />
              <span className="font-medium">{cmd.name}</span>
              <span className="text-xs text-zinc-500">{cmd.description}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        className={cn(
          "flex items-end gap-2 p-2",
          "bg-zinc-800/50 border border-zinc-700/50 rounded-xl",
          "focus-within:border-cyan-500/30 transition-colors",
        )}
      >
        {onAttach && (
          <button
            onClick={onAttach}
            disabled={disabled}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Attach file"
          >
            <Paperclip size={16} />
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          rows={1}
          className={cn(
            "flex-1 bg-transparent resize-none",
            "text-sm text-zinc-200 placeholder-zinc-500",
            "outline-none min-h-[36px] max-h-[200px] py-2",
          )}
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || isSending || disabled}
          className={cn(
            "p-2 rounded-lg transition-all duration-150",
            value.trim() && !isSending
              ? "bg-cyan-600 text-white hover:bg-cyan-500"
              : "bg-zinc-700/50 text-zinc-500 cursor-not-allowed",
          )}
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
