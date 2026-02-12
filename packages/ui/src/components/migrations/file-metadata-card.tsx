"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface FileMetadata {
  name: string;
  size: string;
  type: string;
  modified: string;
  path?: string;
}

export interface FileMetadataCardProps {
  file: FileMetadata;
  className?: string;
}

/**
 * FileMetadataCard - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/FileMetadataCard.tsx
 * @migration-status candidate
 */
export function FileMetadataCard({ file = { name: "", size: "", type: "", modified: "" }, className }: FileMetadataCardProps) {
  return (
    <div className={cn("border border-border rounded-md bg-card p-4", className)}>
      <div className="text-sm font-medium text-foreground mb-2">{file.name}</div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Type</dt><dd className="text-foreground">{file.type}</dd>
        <dt className="text-muted-foreground">Size</dt><dd className="text-foreground">{file.size}</dd>
        <dt className="text-muted-foreground">Modified</dt><dd className="text-foreground">{file.modified}</dd>
        {file.path && <><dt className="text-muted-foreground">Path</dt><dd className="text-foreground truncate">{file.path}</dd></>}
      </dl>
    </div>
  );
}
