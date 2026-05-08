"use client";

import * as React from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Play,
  ShieldCheck,
  TerminalSquare,
  Wifi,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type SafeDispatchState =
  | "ready"
  | "running"
  | "preview"
  | "blocked"
  | "offline";

export interface SafeDispatchWorkstream {
  id: string;
  title: string;
  state: SafeDispatchState;
  activeRuns: number;
  nextAction: string;
  gate?: string;
}

export interface SafeDispatchProvider {
  id: string;
  label: string;
  kind: "acp" | "mcp" | "poly" | "runner" | "tmux" | "daemon";
  state: SafeDispatchState;
  detail: string;
  lease?: "none" | "required" | "active";
}

export interface SafeDispatchSession {
  id: string;
  label: string;
  substrate: "dashboard" | "tmux" | "sdk" | "acp" | "daemon";
  state: SafeDispatchState;
  detail: string;
}

export interface SafeDispatchAction {
  id: string;
  label: string;
  description: string;
  state: Exclude<SafeDispatchState, "running" | "offline">;
  leaseRequired?: boolean;
}

export interface SafeDispatchSummary {
  readyProviders: number;
  runningWorkstreams: number;
  activeRuns: number;
  guardedActions: number;
  blockedActions: number;
}

export interface SafeDispatchCockpitProps {
  workstreams?: SafeDispatchWorkstream[];
  providers?: SafeDispatchProvider[];
  sessions?: SafeDispatchSession[];
  actions?: SafeDispatchAction[];
  lastEvent?: string;
  className?: string;
  onAction?: (action: SafeDispatchAction) => void;
}

export function getSafeDispatchSummary({
  workstreams = [],
  providers = [],
  actions = [],
}: Pick<
  SafeDispatchCockpitProps,
  "workstreams" | "providers" | "actions"
>): SafeDispatchSummary {
  return {
    readyProviders: providers.filter((provider) => provider.state === "ready").length,
    runningWorkstreams: workstreams.filter(
      (workstream) => workstream.state === "running" || workstream.state === "ready",
    ).length,
    activeRuns: workstreams.reduce((sum, workstream) => sum + workstream.activeRuns, 0),
    guardedActions: actions.filter((action) => action.leaseRequired).length,
    blockedActions: actions.filter((action) => action.state === "blocked").length,
  };
}

function stateTone(state: SafeDispatchState): string {
  switch (state) {
    case "ready":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    case "running":
      return "border-cyan-400/30 bg-cyan-500/10 text-cyan-300";
    case "preview":
      return "border-amber-400/30 bg-amber-500/10 text-amber-300";
    case "blocked":
      return "border-red-400/30 bg-red-500/10 text-red-300";
    case "offline":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
  }
}

function stateLabel(state: SafeDispatchState): string {
  return state.replace("-", " ");
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-cyan-500/10 bg-black/30 px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-500/50">
        {label}
      </div>
      <div className="mt-2 font-display text-2xl leading-none text-white">{value}</div>
    </div>
  );
}

function StatusPill({ state }: { state: SafeDispatchState }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
        stateTone(state),
      )}
    >
      {stateLabel(state)}
    </span>
  );
}

export function SafeDispatchCockpit({
  workstreams = [],
  providers = [],
  sessions = [],
  actions = [],
  lastEvent,
  className,
  onAction,
}: SafeDispatchCockpitProps) {
  const summary = getSafeDispatchSummary({ workstreams, providers, actions });

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/40 text-white shadow-[0_0_36px_rgba(16,185,129,0.08)]",
        className,
      )}
    >
      <div className="border-b border-emerald-400/10 bg-emerald-500/[0.04] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-300/70">
              Safe Dispatch Cockpit
            </div>
            <h2 className="mt-2 max-w-full whitespace-normal break-words font-display text-base leading-snug tracking-normal text-white sm:text-xl md:text-2xl">
              AgentPing GenUI command center
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-200">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Preview lease mode
          </div>
        </div>
        {lastEvent ? (
          <div className="mt-3 rounded-lg border border-cyan-400/10 bg-cyan-500/10 px-3 py-2 font-mono text-xs text-cyan-200">
            {lastEvent}
          </div>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Ready providers" value={summary.readyProviders} />
        <Metric label="Runnable lanes" value={summary.runningWorkstreams} />
        <Metric label="Active runs" value={summary.activeRuns} />
        <Metric label="Guarded actions" value={summary.guardedActions} />
      </div>

      <div className="grid min-w-0 gap-4 p-5 pt-0 xl:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0 rounded-xl border border-cyan-400/10 bg-slate-950/40">
          <div className="flex items-center gap-2 border-b border-cyan-400/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">
            <Activity className="h-4 w-4" aria-hidden="true" />
            Workstreams
          </div>
          <div className="divide-y divide-cyan-400/10">
            {workstreams.map((workstream) => (
              <div key={workstream.id} className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 break-words font-medium text-white">{workstream.title}</span>
                    <StatusPill state={workstream.state} />
                  </div>
                  <div className="mt-1 break-words text-sm text-cyan-100/60">{workstream.nextAction}</div>
                </div>
                <div className="text-left md:text-right">
                  <div className="font-mono text-xs text-cyan-200">{workstream.activeRuns} runs</div>
                  {workstream.gate ? (
                    <div className="mt-1 font-mono text-[11px] text-cyan-500/50">
                      {workstream.gate}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-cyan-400/10 bg-slate-950/40">
          <div className="flex items-center gap-2 border-b border-cyan-400/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">
            <Wifi className="h-4 w-4" aria-hidden="true" />
            Provider readiness
          </div>
          <div className="divide-y divide-cyan-400/10">
            {providers.map((provider) => (
              <div key={provider.id} className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 break-words font-medium text-white">{provider.label}</span>
                  <StatusPill state={provider.state} />
                </div>
                <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2 break-words text-sm text-cyan-100/60">
                  <span className="font-mono text-[11px] uppercase text-cyan-500/60">
                    {provider.kind}
                  </span>
                  <span className="min-w-0 break-words">{provider.detail}</span>
                  {provider.lease && provider.lease !== "none" ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase text-amber-200/80">
                      <LockKeyhole className="h-3 w-3" aria-hidden="true" />
                      {provider.lease}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-cyan-400/10 bg-slate-950/40">
          <div className="flex items-center gap-2 border-b border-cyan-400/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">
            <TerminalSquare className="h-4 w-4" aria-hidden="true" />
            Sessions
          </div>
          <div className="divide-y divide-cyan-400/10">
            {sessions.map((session) => (
              <div key={session.id} className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 break-words font-medium text-white">{session.label}</span>
                  <StatusPill state={session.state} />
                </div>
                <div className="mt-1 flex min-w-0 flex-wrap gap-2 break-words text-sm text-cyan-100/60">
                  <span className="font-mono text-[11px] uppercase text-cyan-500/60">
                    {session.substrate}
                  </span>
                  <span className="min-w-0 break-words">{session.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-cyan-400/10 bg-slate-950/40">
          <div className="flex items-center gap-2 border-b border-cyan-400/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">
            <Play className="h-4 w-4" aria-hidden="true" />
            Guarded actions
          </div>
          <div className="space-y-3 p-4">
            {actions.map((action) => {
              const blocked = action.state === "blocked";
              return (
                <button
                  key={action.id}
                  type="button"
                  disabled={blocked}
                  onClick={() => onAction?.(action)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                    blocked
                      ? "cursor-not-allowed border-red-400/20 bg-red-500/5 text-red-200/60"
                      : "border-emerald-400/15 bg-emerald-500/5 text-white hover:border-emerald-300/40 hover:bg-emerald-500/10",
                  )}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0 break-words font-medium">{action.label}</span>
                    {action.leaseRequired ? (
                      <LockKeyhole className="h-4 w-4 text-amber-300" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-1 block min-w-0 break-words text-sm text-cyan-100/60">
                    {action.description}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-300/70">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    {action.state}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
