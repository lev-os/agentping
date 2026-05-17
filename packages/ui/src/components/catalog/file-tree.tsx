"use client";

/**
 * FileTree — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/FileTree.tsx
 * @catalog-status needs-review — runtime coupled (window.fileSystem lazy loading)
 * @category root
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Image,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type FileNodeType = "file" | "directory";

export interface FileNode {
  name: string;
  path: string;
  type: FileNodeType;
  children?: FileNode[];
  extension?: string;
  size?: number;
  modified?: boolean;
}

export interface FileTreeProps {
  /** Root file tree items */
  items: FileNode[];
  /** File click handler */
  onFileClick?: (path: string) => void;
  /** File paths with modifications */
  modifiedPaths?: Set<string>;
  /** Currently selected file path */
  selectedPath?: string;
  /** Current depth (internal, for recursion) */
  depth?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Icon helpers                                                        */
/* ------------------------------------------------------------------ */

function getFileIcon(name: string, ext?: string) {
  if (ext === "ts" || ext === "tsx" || ext === "js" || ext === "jsx")
    return <FileCode size={14} className="text-blue-400" />;
  if (ext === "md" || ext === "txt")
    return <FileText size={14} className="text-zinc-400" />;
  if (ext === "png" || ext === "jpg" || ext === "svg")
    return <Image size={14} className="text-purple-400" />;
  return <File size={14} className="text-zinc-500" />;
}

/* ------------------------------------------------------------------ */
/* FileTree Item                                                       */
/* ------------------------------------------------------------------ */

function FileTreeItem({
  node,
  depth,
  onFileClick,
  modifiedPaths,
  selectedPath,
}: {
  node: FileNode;
  depth: number;
  onFileClick?: (path: string) => void;
  modifiedPaths?: Set<string>;
  selectedPath?: string;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isDir = node.type === "directory";
  const isSelected = node.path === selectedPath;
  const isModified = modifiedPaths?.has(node.path);

  return (
    <div>
      <button
        onClick={() => {
          if (isDir) setExpanded(!expanded);
          else onFileClick?.(node.path);
        }}
        role="treeitem"
        aria-expanded={isDir ? expanded : undefined}
        aria-selected={isSelected}
        aria-label={node.name}
        className={cn(
          "w-full flex items-center gap-1.5 py-1 px-2 text-left",
          "text-xs transition-colors duration-100 rounded-sm",
          isSelected
            ? "bg-cyan-500/10 text-cyan-400"
            : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200",
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {isDir ? (
          expanded ? (
            <ChevronDown size={12} className="flex-shrink-0 text-zinc-500" />
          ) : (
            <ChevronRight size={12} className="flex-shrink-0 text-zinc-500" />
          )
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}

        {isDir ? (
          expanded ? (
            <FolderOpen size={14} className="flex-shrink-0 text-cyan-500" />
          ) : (
            <Folder size={14} className="flex-shrink-0 text-zinc-500" />
          )
        ) : (
          getFileIcon(node.name, node.extension)
        )}

        <span className="truncate">{node.name}</span>

        {isModified && (
          <span className="ml-auto text-amber-400 text-[10px] flex-shrink-0">M</span>
        )}
      </button>

      {isDir && expanded && node.children && (
        <div role="group">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              modifiedPaths={modifiedPaths}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function FileTree({
  items,
  onFileClick,
  modifiedPaths,
  selectedPath,
  depth = 0,
  className,
}: FileTreeProps) {
  return (
    <div className={cn("text-xs", className)} role="tree">
      {items.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          depth={depth}
          onFileClick={onFileClick}
          modifiedPaths={modifiedPaths}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}
