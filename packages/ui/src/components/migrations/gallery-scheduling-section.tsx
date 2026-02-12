"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { WeeklySchedule } from "./weekly-schedule";
import { DailyAgenda } from "./daily-agenda";
import { TimeSlotPicker } from "./time-slot-picker";
import { RecurringEventEditor } from "./recurring-event-editor";
import { WorldClock } from "./world-clock";
import { TimezoneSlider } from "./timezone-slider";
import { YearHeatmap } from "./year-heatmap";

export interface GallerySchedulingSectionProps { className?: string; }

export function GallerySchedulingSection({ className }: GallerySchedulingSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Scheduling Components</div>
      <div className="grid grid-cols-3 gap-3">
        <GalleryCard name="WeeklySchedule" shell>
          <WeeklySchedule events={[]} />
        </GalleryCard>
        <GalleryCard name="DailyAgenda">
          <DailyAgenda
            date="2026-02-12"
            items={[
              { id: "1", time: "09:00", title: "Standup", type: "meeting" },
              { id: "2", time: "11:00", title: "Code review", type: "task" },
              { id: "3", time: "14:00", title: "Deploy v2.4", type: "event" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="TimeSlotPicker" shell>
          <TimeSlotPicker slots={[]} />
        </GalleryCard>
        <GalleryCard name="RecurringEventEditor" shell>
          <RecurringEventEditor />
        </GalleryCard>
        <GalleryCard name="WorldClock" shell>
          <WorldClock timezones={[]} />
        </GalleryCard>
        <GalleryCard name="TimezoneSlider" shell>
          <TimezoneSlider timezones={[]} />
        </GalleryCard>
        <GalleryCard name="YearHeatmap" shell>
          <YearHeatmap data={[]} year={2026} />
        </GalleryCard>
      </div>
    </div>
  );
}
