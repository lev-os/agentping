"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color?: string;
}

export interface CalendarViewProps {
  events?: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
  className?: string;
}

/**
 * CalendarView - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/CalendarView.tsx
 * @catalog-status candidate
 * @needs-review Complex calendar logic — verify date handling
 */
export function CalendarView({ events = [], onSelectDate, className }: CalendarViewProps) {
  const [current, setCurrent] = React.useState(new Date());
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className={cn("border border-border rounded-md bg-card p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrent(new Date(year, month - 1))} className="text-muted-foreground hover:text-foreground">&lt;</button>
        <span className="text-sm font-medium text-foreground">{monthNames[month]} {year}</span>
        <button onClick={() => setCurrent(new Date(year, month + 1))} className="text-muted-foreground hover:text-foreground">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-muted-foreground py-1">{d}</div>
        ))}
        {blanks.map((b) => <div key={`b-${b}`} />)}
        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEvent = events.some((e) => e.date === dateStr);
          return (
            <button
              key={day}
              onClick={() => onSelectDate?.(new Date(year, month, day))}
              className={cn(
                "py-1 rounded text-sm hover:bg-muted transition-colors",
                hasEvent && "font-bold text-primary"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
