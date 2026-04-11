import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { LandingPage } from "../../components/migrations/landing-page";
import { StatsGrid, type StatItem } from "../../components/migrations/stats-grid";
import { ResourceGauge } from "../../components/migrations/resource-gauge";
import { CalendarView, type CalendarEvent } from "../../components/migrations/calendar-view";
import { YearHeatmap, type HeatmapEntry } from "../../components/migrations/year-heatmap";
import { CountdownWidget } from "../../components/migrations/countdown-widget";
import { ProgressTimeline, type ProgressStep } from "../../components/migrations/progress-timeline";
import { DailyAgenda, type AgendaItem } from "../../components/migrations/daily-agenda";
import { WeeklySchedule, type ScheduleEvent } from "../../components/migrations/weekly-schedule";
import { Dashboard, type SystemTelemetry, type QuickOperation } from "../../components/migrations/dashboard";

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const KPI_STATS: StatItem[] = [
  { label: "Active Agents", value: 24, change: 12.5 },
  { label: "Tasks / hr", value: "1,847", change: 8.3 },
  { label: "Avg Latency", value: "142ms", change: -15.2 },
  { label: "Uptime", value: "99.97%", change: 0.02 },
  { label: "Error Rate", value: "0.03%", change: -42.1 },
  { label: "Cost / Task", value: "$0.012", change: -8.7 },
];

const TELEMETRY: SystemTelemetry = {
  cpuUsage: 42,
  memoryUsage: 67,
  activeAgents: 24,
  totalTasks: 1847,
  completedTasks: 1792,
  uptime: "14d 6h 32m",
};

const QUICK_OPS: QuickOperation[] = [
  { id: "qo1", label: "Deploy All", icon: null },
  { id: "qo2", label: "Run Audit", icon: null },
  { id: "qo3", label: "Scale Up", icon: null },
  { id: "qo4", label: "Export Logs", icon: null },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "ce1", title: "Sprint Planning", date: "2026-02-16", color: "#06b6d4" },
  { id: "ce2", title: "Agent Review", date: "2026-02-18", color: "#8b5cf6" },
  { id: "ce3", title: "Deploy v2.4", date: "2026-02-20", color: "#22c55e" },
  { id: "ce4", title: "Security Audit", date: "2026-02-25", color: "#ef4444" },
  { id: "ce5", title: "Board Meeting", date: "2026-02-27", color: "#f59e0b" },
];

const AGENDA_ITEMS: AgendaItem[] = [
  { id: "ag1", time: "09:00", title: "Agent Fleet Standup", description: "Daily health check across all 24 active agents", type: "meeting" },
  { id: "ag2", time: "10:30", title: "Deploy Cipher v3.2", description: "Security patch for lodash.merge CVE", type: "task" },
  { id: "ag3", time: "12:00", title: "Cost Review", description: "Monthly compute spend analysis", type: "meeting" },
  { id: "ag4", time: "14:00", title: "Agent Onboarding — Forge", description: "New builder agent provisioning", type: "event" },
  { id: "ag5", time: "16:00", title: "Backup Window", description: "Automated state snapshot", type: "reminder" },
  { id: "ag6", time: "17:30", title: "Incident Retrospective", description: "Review outage from Feb 10", type: "meeting" },
];

const SCHEDULE_EVENTS: ScheduleEvent[] = [
  { day: 0, startHour: 9, endHour: 10, title: "Standup", color: "#06b6d4" },
  { day: 0, startHour: 14, endHour: 16, title: "Deep Work", color: "#8b5cf6" },
  { day: 1, startHour: 10, endHour: 12, title: "Sprint Planning", color: "#22c55e" },
  { day: 2, startHour: 9, endHour: 10, title: "Standup", color: "#06b6d4" },
  { day: 2, startHour: 13, endHour: 15, title: "Code Review", color: "#f59e0b" },
  { day: 3, startHour: 11, endHour: 12, title: "1:1 with Lead", color: "#ef4444" },
  { day: 3, startHour: 14, endHour: 17, title: "Deep Work", color: "#8b5cf6" },
  { day: 4, startHour: 9, endHour: 10, title: "Standup", color: "#06b6d4" },
  { day: 4, startHour: 15, endHour: 17, title: "Demo / Retro", color: "#22c55e" },
];

const TIMELINE_STEPS: ProgressStep[] = [
  { id: "p1", label: "Infrastructure Provisioned", status: "completed", description: "3 regions, 12 nodes — Feb 1" },
  { id: "p2", label: "Agent Fleet Deployed", status: "completed", description: "24 agents across 6 squads — Feb 5" },
  { id: "p3", label: "UI Migration Complete", status: "completed", description: "416 components, 327 stories — Feb 12" },
  { id: "p4", label: "Security Audit Passing", status: "active", description: "3 CVEs found, 1 patched — In progress" },
  { id: "p5", label: "v2.4 Release", status: "pending", description: "Target: Feb 20" },
  { id: "p6", label: "GA Launch", status: "pending", description: "Target: Mar 1" },
];

// Generate heatmap data for 2026
const HEATMAP_DATA: HeatmapEntry[] = Array.from({ length: 365 }, (_, i) => {
  const d = new Date(2026, 0, 1);
  d.setDate(d.getDate() + i);
  const dateStr = d.toISOString().slice(0, 10);
  // Simulate: weekdays have higher values, some random variation
  const dayOfWeek = d.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const base = isWeekend ? 2 : 8;
  const value = Math.max(0, base + Math.floor(Math.random() * 10) - 3);
  return { date: dateStr, value };
});

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

function ExecutiveSummaryLanding() {
  return (
    <LandingPage className="bg-black/90 text-cyan-100 font-mono">
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg text-cyan-400 uppercase tracking-widest">Executive Dashboard</h1>
            <p className="text-[10px] text-cyan-500/40 mt-0.5">SKYNET Operations Center — Last updated: 14:32 UTC</p>
          </div>
          <CountdownWidget targetDate="2026-03-01T00:00:00" title="GA Launch" />
        </div>

        {/* KPI Row */}
        <StatsGrid stats={KPI_STATS} columns={3} />

        {/* Main grid */}
        <div className="grid grid-cols-[1fr_320px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Mission Control Dashboard */}
            <Dashboard telemetry={TELEMETRY} quickOps={QUICK_OPS} />

            {/* Calendar + Agenda row */}
            <div className="grid grid-cols-2 gap-4">
              <CalendarView events={CALENDAR_EVENTS} />
              <DailyAgenda date="Thursday, Feb 13, 2026" items={AGENDA_ITEMS} />
            </div>

            {/* Weekly schedule */}
            <WeeklySchedule events={SCHEDULE_EVENTS} startHour={8} endHour={18} />

            {/* Year heatmap */}
            <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
              <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Agent Activity — 2026</div>
              <YearHeatmap data={HEATMAP_DATA} year={2026} />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Resource gauges */}
            <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4 space-y-4">
              <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest">System Resources</div>
              <ResourceGauge value={42} label="CPU" variant="bar" />
              <ResourceGauge value={67} label="Memory" variant="bar" />
              <ResourceGauge value={31} label="Disk" variant="bar" />
              <ResourceGauge value={85} label="GPU" variant="circle" />
              <ResourceGauge value={23} label="Network" variant="circle" />
            </div>

            {/* Progress timeline */}
            <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
              <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Release Roadmap</div>
              <ProgressTimeline steps={TIMELINE_STEPS} />
            </div>

            {/* Quick stats */}
            <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
              <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Fleet Summary</div>
              <div className="space-y-2 text-xs">
                {[
                  { label: "Agents Online", value: "24 / 28", color: "text-green-400" },
                  { label: "Tasks Queued", value: "142", color: "text-amber-400" },
                  { label: "Tasks Running", value: "55", color: "text-cyan-400" },
                  { label: "Failed (24h)", value: "3", color: "text-red-400" },
                  { label: "Avg Throughput", value: "30.8 tasks/min", color: "text-cyan-300" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-cyan-500/60">{s.label}</span>
                    <span className={s.color}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingPage>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state variant                                                 */
/* ------------------------------------------------------------------ */

function EmptyDashboard() {
  return (
    <LandingPage className="bg-black/90 text-cyan-100 font-mono">
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-lg text-cyan-400 uppercase tracking-widest">Executive Dashboard</h1>
          <p className="text-[10px] text-cyan-500/40 mt-0.5">No agents deployed — waiting for configuration</p>
        </div>

        <StatsGrid
          stats={[
            { label: "Active Agents", value: 0 },
            { label: "Tasks / hr", value: 0 },
            { label: "Uptime", value: "N/A" },
          ]}
          columns={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <ResourceGauge value={0} label="CPU" variant="bar" />
          <ResourceGauge value={0} label="Memory" variant="bar" />
        </div>

        <ProgressTimeline
          steps={[
            { id: "e1", label: "Deploy first agent", status: "active", description: "Get started by provisioning an agent" },
            { id: "e2", label: "Configure tools", status: "pending" },
            { id: "e3", label: "Run first task", status: "pending" },
          ]}
        />
      </div>
    </LandingPage>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Executive Summary Landing",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <ExecutiveSummaryLanding />,
};

export const Empty: StoryObj = {
  render: () => <EmptyDashboard />,
};
