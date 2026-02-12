"use client";

/**
 * FileViewer — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/FileViewer.tsx
 * @migration-status needs-review — runtime coupled (window.fileSystem)
 * @category root
 */

import React from "react";
import { X, FileCode, Download, Copy } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface FileViewerProps {
  /** File path being displayed */
  filePath: string;
  /** File content */
  content?: string;
  /** File language for syntax highlighting hint */
  language?: string;
  /** Whether the file is loading */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Close handler */
  onClose?: () => void;
  /** Copy content handler */
  onCopy?: () => void;
  /** Download handler */
  onDownload?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function FileViewer({
  filePath,
  content,
  language,
  loading = false,
  error = null,
  onClose,
  onCopy,
  onDownload,
  className,
}: FileViewerProps) {
  const fileName = filePath.split("/").pop() ?? filePath;
  const lines = content?.split("\n") ?? [];

  return (
    <div className={cn("flex flex-col h-full bg-zinc-950", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode size={14} className="text-cyan-500 flex-shrink-0" />
          <span className="text-xs text-zinc-300 truncate">{fileName}</span>
          {language && (
            <span className="text-[10px] text-zinc-600 bg-zinc-800/50 px-1.5 rounded">
              {language}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onCopy && (
            <button onClick={onCopy} className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors" title="Copy" aria-label="Copy file content">
              <Copy size={12} />
            </button>
          )}
          {onDownload && (
            <button onClick={onDownload} className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors" title="Download" aria-label="Download file">
              <Download size={12} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors" title="Close" aria-label="Close file viewer">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-xs text-zinc-500">
            <div className="w-4 h-4 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin mr-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center text-xs text-red-400">{error}</div>
        ) : (
          <div className="flex font-mono text-[11px] leading-5">
            <div className="flex flex-col items-end px-3 py-2 text-zinc-600 select-none bg-zinc-900/50 border-r border-zinc-800">
              {lines.map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <pre className="flex-1 p-2 text-zinc-300 overflow-x-auto">{content}</pre>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 border-t border-zinc-800 text-[10px] text-zinc-600">
        <span>{lines.length} lines</span>
        <span className="truncate max-w-[200px]">{filePath}</span>
      </div>
    </div>
  );
}
