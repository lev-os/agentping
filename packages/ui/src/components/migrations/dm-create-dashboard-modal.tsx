"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "../../lib/utils";

export interface DashboardFormData {
  id: string;
  name: string;
  command: string;
  cwd: string;
  port_range: [number, number];
}

export interface DmCreateDashboardModalProps {
  onClose: () => void;
  onSubmit: (data: DashboardFormData) => Promise<void> | void;
  className?: string;
}

/**
 * DmCreateDashboardModal - Migrated from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/CreateDashboardModal.tsx
 * @migration-status candidate
 * @needs-review Original uses dashboardAPI.createDashboard; migration exposes onSubmit prop
 */
export function DmCreateDashboardModal({ onClose, onSubmit, className }: DmCreateDashboardModalProps) {
  const [formData, setFormData] = useState<DashboardFormData>({
    id: "",
    name: "",
    command: "",
    cwd: "",
    port_range: [3000, 3100],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Create Dashboard">
      <div
        className={cn("bg-gray-950 border border-cyan-500/20 rounded-xl p-6 w-full max-w-md", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Create Dashboard</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors" aria-label="Close dialog">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="dm-id" className="text-xs font-mono text-white/60">ID *</label>
            <input id="dm-id" type="text" required value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="grafana"
              className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-2 text-sm font-mono text-cyan-300 placeholder:text-cyan-500/30 outline-none focus:border-cyan-500/50" />
            <span className="text-[10px] text-white/30">Unique identifier (alphanumeric + hyphens)</span>
          </div>

          <div className="space-y-1">
            <label htmlFor="dm-name" className="text-xs font-mono text-white/60">Name *</label>
            <input id="dm-name" type="text" required value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Grafana Dashboard"
              className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-2 text-sm font-mono text-cyan-300 placeholder:text-cyan-500/30 outline-none focus:border-cyan-500/50" />
          </div>

          <div className="space-y-1">
            <label htmlFor="dm-cmd" className="text-xs font-mono text-white/60">Command *</label>
            <input id="dm-cmd" type="text" required value={formData.command}
              onChange={(e) => setFormData({ ...formData, command: e.target.value })}
              placeholder="npm start"
              className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-2 text-sm font-mono text-cyan-300 placeholder:text-cyan-500/30 outline-none focus:border-cyan-500/50" />
          </div>

          <div className="space-y-1">
            <label htmlFor="dm-cwd" className="text-xs font-mono text-white/60">Working Directory *</label>
            <input id="dm-cwd" type="text" required value={formData.cwd}
              onChange={(e) => setFormData({ ...formData, cwd: e.target.value })}
              placeholder="/path/to/dashboard"
              className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-2 text-sm font-mono text-cyan-300 placeholder:text-cyan-500/30 outline-none focus:border-cyan-500/50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="dm-pmin" className="text-xs font-mono text-white/60">Port Min *</label>
              <input id="dm-pmin" type="number" required min={1024} max={65535}
                value={formData.port_range[0]}
                onChange={(e) => setFormData({ ...formData, port_range: [parseInt(e.target.value), formData.port_range[1]] })}
                className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-2 text-sm font-mono text-cyan-300 outline-none focus:border-cyan-500/50" />
            </div>
            <div className="space-y-1">
              <label htmlFor="dm-pmax" className="text-xs font-mono text-white/60">Port Max *</label>
              <input id="dm-pmax" type="number" required min={1024} max={65535}
                value={formData.port_range[1]}
                onChange={(e) => setFormData({ ...formData, port_range: [formData.port_range[0], parseInt(e.target.value)] })}
                className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-2 text-sm font-mono text-cyan-300 outline-none focus:border-cyan-500/50" />
            </div>
          </div>

          {error && <div className="text-xs text-red-400 font-mono">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="px-4 py-2 text-sm font-mono text-white/60 hover:text-white/80 transition-colors disabled:opacity-40">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-4 py-2 text-sm font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/30 transition-colors disabled:opacity-40">
              {isSubmitting ? "Creating..." : "Create Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
