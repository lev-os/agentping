"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ScheduleEvent {
  day: number;
  startHour: number;
  endHour: number;
  title: string;
  color?: string;
}

export interface WeeklyScheduleProps {
  events: ScheduleEvent[];
  onSlotClick?: (day: number, hour: number) => void;
  startHour?: number;
  endHour?: number;
  className?: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

/**
 * WeeklySchedule - 7-day calendar with time slots
 * @source packages/adapters/web-ui/src/components/WeeklySchedule.tsx
 * @catalog-status implemented
 */
export function WeeklySchedule({
  events,
  onSlotClick,
  startHour = 8,
  endHour = 18,
  className,
}: WeeklyScheduleProps) {
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const rowH = 32;

  const getEventsForSlot = (day: number, hour: number) =>
    events.filter((e) => e.day === day && hour >= e.startHour && hour < e.endHour);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
        Weekly Schedule
      </div>
      <div className="overflow-x-auto">
        <div className="grid font-mono" style={{ gridTemplateColumns: `48px repeat(7, 1fr)` }}>
          <div className="h-8" />
          {DAYS.map((d) => (
            <div key={d} className="h-8 flex items-center justify-center text-xs text-cyan-300 font-semibold border-b border-cyan-500/10">
              {d}
            </div>
          ))}

          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="flex items-center justify-end pr-2 text-[10px] text-cyan-500/50" style={{ height: rowH }}>
                {hour.toString().padStart(2, "0")}:00
              </div>
              {Array.from({ length: 7 }, (_, day) => {
                const slotEvents = getEventsForSlot(day, hour);
                const ev = slotEvents[0];
                const isStart = ev && ev.startHour === hour;
                return (
                  <div
                    key={day}
                    className={cn(
                      "border-b border-r border-cyan-500/5 relative cursor-pointer hover:bg-cyan-500/5 transition-colors",
                      !ev && "bg-transparent"
                    )}
                    style={{ height: rowH }}
                    onClick={() => onSlotClick?.(day, hour)}
                  >
                    {ev && isStart && (
                      <div
                        className="absolute inset-x-0.5 rounded text-[10px] px-1 py-0.5 truncate text-black font-medium z-10"
                        style={{
                          top: 1,
                          height: (ev.endHour - ev.startHour) * rowH - 2,
                          backgroundColor: ev.color || DEFAULT_COLORS[day % DEFAULT_COLORS.length],
                          opacity: 0.85,
                        }}
                      >
                        {ev.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
