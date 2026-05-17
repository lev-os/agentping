"use client";

/**
 * Preview — Catalog component from Studio
 *
 * Live web preview with device simulation, URL navigation, and bookmarks.
 *
 * @source packages/studio/src/renderer/components/Preview.tsx
 * @catalog-status needs-review — runtime coupled (webview/iframe, inspector mode, device presets)
 * @category root
 */

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface DevicePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

export interface PreviewProps {
  /** Initial URL to load */
  initialUrl?: string;
  /** Current loaded URL */
  url?: string;
  /** URL change handler */
  onNavigate?: (url: string) => void;
  /** Element selected in inspector mode */
  onElementSelected?: (selector: string) => void;
  /** Open URL externally */
  onOpenExternal?: (url: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEVICES: DevicePreset[] = [
  { id: "desktop", label: "Desktop", width: 1280, height: 800, icon: <Monitor size={14} /> },
  { id: "tablet", label: "Tablet", width: 768, height: 1024, icon: <Tablet size={14} /> },
  { id: "mobile", label: "Mobile", width: 375, height: 667, icon: <Smartphone size={14} /> },
];

/* ------------------------------------------------------------------ */
/* Component (visual shell)                                            */
/* ------------------------------------------------------------------ */

export function Preview({
  initialUrl = "http://localhost:3000",
  url: controlledUrl,
  onNavigate,
  onElementSelected,
  onOpenExternal,
  className,
}: PreviewProps) {
  const [urlInput, setUrlInput] = useState(controlledUrl ?? initialUrl);
  const [activeDevice, setActiveDevice] = useState("desktop");
  const [reachability, setReachability] = useState<"checking" | "reachable" | "unreachable">("checking");
  const currentUrl = controlledUrl ?? urlInput;
  const device = DEVICES.find((d) => d.id === activeDevice) ?? DEVICES[0];

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const checkTarget = async () => {
      if (!currentUrl.startsWith("http://") && !currentUrl.startsWith("https://")) {
        setReachability("unreachable");
        return;
      }

      setReachability("checking");

      try {
        await fetch(currentUrl, {
          method: "GET",
          mode: "no-cors",
          signal: controller.signal,
        });

        if (!cancelled) {
          setReachability("reachable");
        }
      } catch {
        if (!cancelled) {
          setReachability("unreachable");
        }
      }
    };

    void checkTarget();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [currentUrl]);

  const handleNavigate = () => {
    onNavigate?.(urlInput);
  };

  return (
    <div
      className={cn("flex flex-col h-full bg-zinc-950", className)}
      data-inspector-enabled={onElementSelected ? "true" : undefined}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800">
        {/* Navigation */}
        <div className="flex items-center gap-0.5">
          <button className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft size={14} />
          </button>
          <button className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowRight size={14} />
          </button>
          <button
            onClick={handleNavigate}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* URL bar */}
        <div className="flex-1">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
            className={cn(
              "w-full px-3 py-1 rounded-md text-xs",
              "bg-zinc-800/50 border border-zinc-700/30 text-zinc-300",
              "placeholder-zinc-600 outline-none font-mono",
              "focus:border-cyan-500/30",
            )}
            placeholder="Enter URL..."
          />
        </div>

        {/* Device selector */}
        <div className="flex items-center gap-0.5">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDevice(d.id)}
              className={cn(
                "p-1.5 rounded transition-colors",
                activeDevice === d.id
                  ? "text-cyan-400 bg-white/5"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
              title={`${d.label} (${d.width}x${d.height})`}
            >
              {d.icon}
            </button>
          ))}
        </div>

        {onOpenExternal && (
          <button
            onClick={() => onOpenExternal(currentUrl)}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Open in browser"
          >
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-zinc-900/30 overflow-auto">
        <div
          className="bg-white rounded-lg shadow-2xl shadow-black/40 overflow-hidden"
          style={{
            width: Math.min(device.width, 1200),
            height: Math.min(device.height, 700),
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          {/* Placeholder — real preview uses iframe/webview */}
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-sm">
            <div className="text-center">
              <Monitor size={32} className="mx-auto mb-2 text-zinc-300" />
              <p className="font-medium text-zinc-500">Preview</p>
              <p className="text-xs text-zinc-400 mt-1">{currentUrl}</p>
              <p
                className={cn(
                  "text-[10px] mt-2",
                  reachability === "reachable"
                    ? "text-emerald-500"
                    : reachability === "checking"
                      ? "text-amber-500"
                      : "text-red-500",
                )}
              >
                {reachability === "reachable"
                  ? "Target reachable. Browser-shell embed is still placeholder-only."
                  : reachability === "checking"
                    ? "Checking target availability..."
                    : "Target unreachable. Start the app for this URL or change the preview target."}
              </p>
              <p className="text-[10px] text-zinc-300 mt-2">
                {device.label} ({device.width} x {device.height})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-zinc-800 text-[10px] text-zinc-600">
        <span>{device.label} — {device.width} x {device.height}</span>
        <span>{currentUrl}</span>
      </div>
    </div>
  );
}
