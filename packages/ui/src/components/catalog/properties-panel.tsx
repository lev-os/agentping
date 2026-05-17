"use client";

/**
 * PropertiesPanel — Catalog component from Studio
 *
 * Element properties inspector with Layout/Style/Advanced tabs.
 *
 * @source packages/studio/src/renderer/components/PropertiesPanel.tsx
 * @catalog-status needs-review — runtime coupled (canvas object model)
 * @category root
 */

import React, { useState } from "react";
import {
  Layout,
  Paintbrush,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface PropertyField {
  key: string;
  label: string;
  value: string | number | boolean;
  type: "text" | "number" | "color" | "select" | "toggle";
  options?: string[];
}

export interface PropertySection {
  id: string;
  label: string;
  fields: PropertyField[];
}

export interface PropertiesPanelProps {
  /** Currently selected element name */
  selectedElementName?: string;
  /** Property sections organized by tab */
  layoutProperties?: PropertySection[];
  styleProperties?: PropertySection[];
  advancedProperties?: PropertySection[];
  /** Property change handler */
  onPropertyChange?: (key: string, value: unknown) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Section component                                                   */
/* ------------------------------------------------------------------ */

function PropertySectionView({
  section,
  onPropertyChange,
}: {
  section: PropertySection;
  onPropertyChange?: (key: string, value: unknown) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border-b border-zinc-800/50">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
        {section.label}
      </button>

      {!collapsed && (
        <div className="px-3 pb-2 space-y-2">
          {section.fields.map((field) => (
            <div key={field.key} className="flex items-center justify-between gap-2">
              <label className="text-[10px] text-zinc-500 flex-shrink-0 w-20">
                {field.label}
              </label>
              {field.type === "text" || field.type === "number" ? (
                <input
                  type={field.type}
                  value={String(field.value)}
                  onChange={(e) => onPropertyChange?.(field.key, e.target.value)}
                  className={cn(
                    "flex-1 px-2 py-1 rounded text-xs",
                    "bg-zinc-800/50 border border-zinc-700/30 text-zinc-200",
                    "outline-none focus:border-cyan-500/30",
                  )}
                />
              ) : field.type === "color" ? (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded border border-zinc-700/50"
                    style={{ backgroundColor: String(field.value) }}
                  />
                  <input
                    value={String(field.value)}
                    onChange={(e) => onPropertyChange?.(field.key, e.target.value)}
                    className="w-20 px-2 py-1 rounded text-xs bg-zinc-800/50 border border-zinc-700/30 text-zinc-200 outline-none font-mono"
                  />
                </div>
              ) : field.type === "select" ? (
                <select
                  value={String(field.value)}
                  onChange={(e) => onPropertyChange?.(field.key, e.target.value)}
                  className="flex-1 px-2 py-1 rounded text-xs bg-zinc-800/50 border border-zinc-700/30 text-zinc-200 outline-none"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "toggle" ? (
                <button
                  onClick={() => onPropertyChange?.(field.key, !field.value)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    field.value ? "bg-cyan-600" : "bg-zinc-700",
                  )}
                >
                  <span
                    className={cn(
                      "block w-3 h-3 rounded-full bg-white shadow transition-transform",
                      field.value ? "translate-x-4" : "translate-x-0.5",
                    )}
                  />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type PropsTab = "layout" | "style" | "advanced";

const TABS: { id: PropsTab; icon: typeof Layout; label: string }[] = [
  { id: "layout", icon: Layout, label: "Layout" },
  { id: "style", icon: Paintbrush, label: "Style" },
  { id: "advanced", icon: Settings, label: "Advanced" },
];

export function PropertiesPanel({
  selectedElementName,
  layoutProperties = [],
  styleProperties = [],
  advancedProperties = [],
  onPropertyChange,
  className,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<PropsTab>("layout");

  const sections =
    activeTab === "layout"
      ? layoutProperties
      : activeTab === "style"
        ? styleProperties
        : advancedProperties;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-800">
        <span className="text-xs font-medium text-zinc-300">
          {selectedElementName ?? "Properties"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-[11px]",
              "border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
            )}
          >
            <tab.icon size={10} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-xs text-zinc-600">
            {selectedElementName
              ? "No properties for this tab"
              : "Select an element to see properties"}
          </div>
        ) : (
          sections.map((section) => (
            <PropertySectionView
              key={section.id}
              section={section}
              onPropertyChange={onPropertyChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
