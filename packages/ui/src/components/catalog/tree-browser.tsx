"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  type?: "file" | "folder";
}

export interface TreeBrowserProps {
  nodes?: TreeNode[];
  className?: string;
}

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = React.useState(false);
  const isFolder = node.type === "folder" || (node.children && node.children.length > 0);
  const icon = isFolder ? (open ? "\u25BE" : "\u25B8") : " ";
  const fileIcon = isFolder ? "\uD83D\uDCC1" : "\uD83D\uDCC4";

  return (
    <div>
      <button
        type="button"
        onClick={() => isFolder && setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 w-full text-left px-2 py-1 hover:bg-cyan-500/5 transition-colors text-sm",
          isFolder ? "cursor-pointer" : "cursor-default"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="w-3 text-cyan-500/40 text-xs">{icon}</span>
        <span className="text-xs">{fileIcon}</span>
        <span className="text-cyan-100 truncate">{node.label}</span>
      </button>
      {open && node.children?.map((child) => (
        <TreeItem key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function TreeBrowser({ nodes = [], className }: TreeBrowserProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg py-1 font-mono max-h-72 overflow-y-auto",
        className
      )}
    >
      {nodes.length === 0 && (
        <div className="px-4 py-3 text-xs text-cyan-500/30">No nodes</div>
      )}
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} />
      ))}
    </div>
  );
}
