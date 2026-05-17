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
        <GalleryCard name="WeeklySchedule">
          <WeeklySchedule
            events={[
              { day: 0, startHour: 9, endHour: 10, title: "Standup" },
              { day: 2, startHour: 14, endHour: 16, title: "Sprint Review" },
              { day: 4, startHour: 11, endHour: 12, title: "1:1" },
            ]}
            startHour={8}
            endHour={17}
          />
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
        <GalleryCard name="TimeSlotPicker">
          <TimeSlotPicker
            slots={[
              { time: "09:00", available: true },
              { time: "10:00", available: true },
              { time: "11:00", available: false },
              { time: "12:00", available: true },
              { time: "13:00", available: true },
              { time: "14:00", available: false },
              { time: "15:00", available: true },
              { time: "16:00", available: true },
            ]}
            selected={["10:00", "15:00"]}
            columns={4}
          />
        </GalleryCard>
        <GalleryCard name="RecurringEventEditor">
          <RecurringEventEditor frequency="weekly" interval={2} />
        </GalleryCard>
        <GalleryCard name="WorldClock">
          <WorldClock
            timezones={[
              { zone: "America/New_York", label: "New York" },
              { zone: "Europe/London", label: "London" },
              { zone: "Asia/Tokyo", label: "Tokyo" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="TimezoneSlider">
          <TimezoneSlider
            timezones={["America/Los_Angeles", "America/New_York", "Europe/London", "Asia/Tokyo"]}
          />
        </GalleryCard>
        <GalleryCard name="YearHeatmap">
          <YearHeatmap
            data={[
              { date: "2026-01-15", value: 5 },
              { date: "2026-02-01", value: 8 },
              { date: "2026-02-10", value: 12 },
              { date: "2026-03-20", value: 3 },
              { date: "2026-06-15", value: 7 },
              { date: "2026-09-01", value: 10 },
            ]}
            year={2026}
          />
        </GalleryCard>
      </div>
    </div>
  );
}
