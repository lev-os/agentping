"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PdfPreviewProps {
  file?: string;
  url?: string;
  pages?: number;
  className?: string;
}

/**
 * PdfPreview - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/PdfPreview.tsx
 * @migration-status candidate
 */
export function PdfPreview({ file = "document.pdf", url, pages = 5, className }: PdfPreviewProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400">{file}</span>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-500/60">
          <button className="hover:text-cyan-400">-</button>
          <span>1 / {pages}</span>
          <button className="hover:text-cyan-400">+</button>
        </div>
      </div>
      <div className="p-8 min-h-[300px] flex items-center justify-center bg-black/40">
        {url ? (
          <iframe src={url} className="w-full h-[400px] border-0" title={file} />
        ) : (
          <div className="text-center text-cyan-500/30 font-mono text-sm">
            <div className="text-3xl mb-2">PDF</div>
            <div>{file}</div>
            <div className="text-[10px] mt-1">{pages} pages</div>
          </div>
        )}
      </div>
    </div>
  );
}
