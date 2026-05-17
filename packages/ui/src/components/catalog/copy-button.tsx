"use client";

/**
 * CopyButton — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/ui/CopyButton.tsx
 * @catalog-status complete
 * @category ui-primitive
 */

import React, { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string;
  /** Icon size in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

export function CopyButton({ text, size = 16, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5",
        "text-zinc-400 hover:text-zinc-200 hover:bg-white/5",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50",
        copied && "text-emerald-400 hover:text-emerald-400",
        className,
      )}
      title={copied ? "Copied!" : "Copy to clipboard"}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? (
        <Check size={size} className="animate-in fade-in duration-200" />
      ) : (
        <Copy size={size} />
      )}
    </button>
  );
}
