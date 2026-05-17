"use client";

/**
 * ComponentGallery — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/ComponentGallery.tsx
 * @catalog-status needs-review — runtime coupled (drag-drop to canvas)
 * @category root
 */

import React, { useState } from "react";
import {
  Search,
  Square,
  Circle,
  Type,
  Image,
  Layout,
  ToggleLeft,
  ListOrdered,
  Table,
  FormInput,
  Package,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ComponentPrimitive {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description?: string;
}

export interface ComponentGalleryProps {
  /** Handler when a component is added */
  onAddComponent?: (component: ComponentPrimitive) => void;
  /** Override default primitives */
  primitives?: ComponentPrimitive[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Default primitives                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_PRIMITIVES: ComponentPrimitive[] = [
  { id: "rectangle", name: "Rectangle", icon: <Square size={16} />, category: "Shapes", description: "Basic rectangle shape" },
  { id: "ellipse", name: "Ellipse", icon: <Circle size={16} />, category: "Shapes", description: "Ellipse / circle shape" },
  { id: "text", name: "Text", icon: <Type size={16} />, category: "Shapes", description: "Text element" },
  { id: "image", name: "Image", icon: <Image size={16} />, category: "Shapes", description: "Image placeholder" },
  { id: "frame", name: "Frame", icon: <Layout size={16} />, category: "Layout", description: "Auto-layout frame" },
  { id: "button", name: "Button", icon: <ToggleLeft size={16} />, category: "UI", description: "Button component" },
  { id: "input", name: "Input", icon: <FormInput size={16} />, category: "UI", description: "Text input field" },
  { id: "list", name: "List", icon: <ListOrdered size={16} />, category: "UI", description: "List component" },
  { id: "table", name: "Table", icon: <Table size={16} />, category: "UI", description: "Data table" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ComponentGallery({
  onAddComponent,
  primitives = DEFAULT_PRIMITIVES,
  className,
}: ComponentGalleryProps) {
  const [search, setSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const filtered = search
    ? primitives.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      )
    : primitives;

  // Group by category
  const categories = Array.from(new Set(filtered.map((p) => p.category)));

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <Package size={14} className="text-cyan-500" />
          <span className="text-xs font-medium text-zinc-300">Components</span>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className={cn(
              "w-full pl-7 pr-2 py-1.5 rounded-md text-xs",
              "bg-zinc-800/50 border border-zinc-700/50 text-zinc-200",
              "placeholder-zinc-500 outline-none",
              "focus:border-cyan-500/30",
            )}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto py-1">
        {categories.map((category) => {
          const isCollapsed = collapsedCategories.has(category);
          const items = filtered.filter((p) => p.category === category);

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className={cn(
                  "w-full flex items-center gap-1.5 px-3 py-1.5",
                  "text-xs font-medium text-zinc-500 hover:text-zinc-300",
                  "transition-colors",
                )}
              >
                {isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                {category}
                <span className="text-[10px] text-zinc-600 ml-auto">{items.length}</span>
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onAddComponent?.(item)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("component/id", item.id);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-lg",
                        "bg-zinc-800/30 border border-zinc-700/20",
                        "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                        "hover:border-zinc-600/30 transition-all duration-150",
                        "cursor-grab active:cursor-grabbing",
                      )}
                      title={item.description}
                    >
                      {item.icon}
                      <span className="text-[10px]">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
