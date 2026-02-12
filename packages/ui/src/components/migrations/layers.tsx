"use client";

/**
 * Layers — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/Layers.tsx
 * @migration-status needs-review — runtime coupled (canvas state, drag-drop reordering)
 * @category root
 */

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
  Square,
  Circle,
  Type,
  Image,
  Layers as LayersIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type LayerType = "rectangle" | "ellipse" | "text" | "image" | "group" | "frame";

export interface LayerItem {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  children?: LayerItem[];
}

export interface LayersProps {
  /** Canvas layer objects */
  canvasObjects: LayerItem[];
  /** Currently selected layer id */
  selectedLayerId?: string | null;
  /** Layer select handler */
  onSelectLayer?: (id: string) => void;
  /** Toggle layer visibility */
  onToggleVisibility?: (id: string) => void;
  /** Toggle layer lock */
  onToggleLock?: (id: string) => void;
  /** Delete a layer */
  onDeleteLayer?: (id: string) => void;
  /** Reorder layers */
  onReorderLayers?: (fromIndex: number, toIndex: number) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Icon map                                                            */
/* ------------------------------------------------------------------ */

const TYPE_ICONS: Record<LayerType, React.ReactNode> = {
  rectangle: <Square size={12} />,
  ellipse: <Circle size={12} />,
  text: <Type size={12} />,
  image: <Image size={12} />,
  group: <LayersIcon size={12} />,
  frame: <Square size={12} />,
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Layers({
  canvasObjects,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  onReorderLayers,
  className,
}: LayersProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const renderLayer = (layer: LayerItem, index: number, depth = 0) => {
    const isSelected = layer.id === selectedLayerId;

    return (
      <div key={layer.id}>
        <div
          className={cn(
            "group flex items-center gap-1.5 px-2 py-1",
            "cursor-pointer transition-colors duration-100",
            isSelected
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200",
            !layer.visible && "opacity-40",
          )}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => onSelectLayer?.(layer.id)}
          draggable={!!onReorderLayers}
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== index) {
              onReorderLayers?.(dragIndex, index);
            }
            setDragIndex(null);
          }}
        >
          {/* Drag handle */}
          {onReorderLayers && (
            <GripVertical
              size={10}
              className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
            />
          )}

          {/* Type icon */}
          <span className="flex-shrink-0">{TYPE_ICONS[layer.type]}</span>

          {/* Name */}
          <span className="flex-1 text-xs truncate">{layer.name}</span>

          {/* Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onToggleVisibility && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className="p-0.5 hover:text-zinc-200 transition-colors"
                aria-label={layer.visible ? "Hide layer" : "Show layer"}
              >
                {layer.visible ? <Eye size={10} /> : <EyeOff size={10} />}
              </button>
            )}
            {onToggleLock && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(layer.id);
                }}
                className="p-0.5 hover:text-zinc-200 transition-colors"
                aria-label={layer.locked ? "Unlock layer" : "Lock layer"}
              >
                {layer.locked ? <Lock size={10} /> : <Unlock size={10} />}
              </button>
            )}
            {onDeleteLayer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayer(layer.id);
                }}
                className="p-0.5 hover:text-red-400 transition-colors"
                aria-label="Delete layer"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        </div>

        {/* Children */}
        {layer.children?.map((child, ci) => renderLayer(child, ci, depth + 1))}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800">
        <LayersIcon size={14} className="text-cyan-500" />
        <span className="text-xs font-medium text-zinc-300">Layers</span>
        <span className="text-[10px] text-zinc-600 ml-auto">
          {canvasObjects.length}
        </span>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto py-1">
        {canvasObjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-zinc-600">
            <LayersIcon size={20} className="mb-2" />
            <span className="text-xs">No layers</span>
          </div>
        ) : (
          canvasObjects.map((layer, i) => renderLayer(layer, i))
        )}
      </div>
    </div>
  );
}
