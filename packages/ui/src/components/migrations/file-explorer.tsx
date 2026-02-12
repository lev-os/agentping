"use client";

/**
 * FileExplorer — Migration candidate from Studio
 *
 * File browsing sidebar with search, sort, filter.
 *
 * @source packages/studio/src/renderer/components/FileExplorer.tsx
 * @migration-status needs-review — runtime coupled (window.fileSystem, window.claudeCode)
 * @category root
 */

import React, { useState } from "react";
import {
  FolderTree,
  Search,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { FileTree, type FileNode } from "./file-tree";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SortMode = "name" | "modified" | "type";

export interface FileExplorerProps {
  /** File tree data */
  files: FileNode[];
  /** Current workspace path */
  workspacePath?: string;
  /** File select handler */
  onFileSelect?: (path: string) => void;
  /** Refresh file tree */
  onRefresh?: () => void;
  /** Currently selected path */
  selectedPath?: string;
  /** Modified file paths */
  modifiedPaths?: Set<string>;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function FileExplorer({
  files,
  workspacePath,
  onFileSelect,
  onRefresh,
  selectedPath,
  modifiedPaths,
  className,
}: FileExplorerProps) {
  const [search, setSearch] = useState("");

  const filterNodes = (nodes: FileNode[]): FileNode[] => {
    if (!search) return nodes;
    return nodes.reduce<FileNode[]>((acc, node) => {
      if (node.name.toLowerCase().includes(search.toLowerCase())) {
        acc.push(node);
      } else if (node.children) {
        const filtered = filterNodes(node.children);
        if (filtered.length > 0) {
          acc.push({ ...node, children: filtered });
        }
      }
      return acc;
    }, []);
  };

  const filteredFiles = filterNodes(files);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FolderTree size={14} className="text-cyan-500" />
            <span className="text-xs font-medium text-zinc-300">Files</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Refresh"
              aria-label="Refresh file tree"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>

        {workspacePath && (
          <div className="flex items-center gap-1 mb-2 text-[10px] text-zinc-600 truncate">
            {workspacePath}
          </div>
        )}

        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            aria-label="Search files"
            className={cn(
              "w-full pl-7 pr-2 py-1.5 rounded-md text-xs",
              "bg-zinc-800/50 border border-zinc-700/50 text-zinc-200",
              "placeholder-zinc-500 outline-none focus:border-cyan-500/30",
            )}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-zinc-600">
            <FolderTree size={20} className="mb-2" />
            <span className="text-xs">{search ? "No matching files" : "No files"}</span>
          </div>
        ) : (
          <FileTree
            items={filteredFiles}
            onFileClick={onFileSelect}
            modifiedPaths={modifiedPaths}
            selectedPath={selectedPath}
          />
        )}
      </div>
    </div>
  );
}
