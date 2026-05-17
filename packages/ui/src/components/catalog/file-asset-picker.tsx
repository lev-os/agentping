"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface FileAsset {
  id: string;
  name: string;
  type: string;
  size: string;
  preview?: string;
}

export interface FileAssetPickerProps {
  assets: FileAsset[];
  onSelect?: (asset: FileAsset) => void;
  selected?: string;
  className?: string;
}

/**
 * FileAssetPicker - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/FileAssetPicker.tsx
 * @catalog-status candidate
 */
export function FileAssetPicker({ assets = [], onSelect, selected, className }: FileAssetPickerProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {assets.map((asset) => (
        <button
          key={asset.id}
          onClick={() => onSelect?.(asset)}
          aria-label={`Select ${asset.name}`}
          aria-pressed={selected === asset.id}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-md border transition-colors text-center",
            selected === asset.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
          )}
        >
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
            {asset.preview ? <img src={asset.preview} alt={asset.name} className="h-full w-full object-cover rounded" /> : asset.type.toUpperCase().slice(0, 3)}
          </div>
          <span className="text-xs text-foreground truncate w-full">{asset.name}</span>
          <span className="text-[10px] text-muted-foreground">{asset.size}</span>
        </button>
      ))}
    </div>
  );
}
