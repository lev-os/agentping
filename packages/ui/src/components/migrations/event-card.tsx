"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Attendee {
  name: string;
  avatar?: string;
}

export interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees?: Attendee[];
  className?: string;
}

/**
 * EventCard - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/EventCard.tsx
 * @migration-status candidate
 */
export function EventCard({ title, date, time, location, attendees = [], className }: EventCardProps) {
  return (
    <div className={cn("border border-border rounded-md bg-card p-4", className)}>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <span>{date}</span>
        <span>&bull;</span>
        <span>{time}</span>
        {location && <><span>&bull;</span><span>{location}</span></>}
      </div>
      {attendees.length > 0 && (
        <div className="flex items-center gap-1 mt-3">
          {attendees.slice(0, 5).map((a, i) => (
            <div key={i} className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground border-2 border-background -ml-1 first:ml-0" title={a.name}>
              {a.avatar ? <img src={a.avatar} alt={a.name} className="h-full w-full rounded-full object-cover" /> : a.name[0]}
            </div>
          ))}
          {attendees.length > 5 && <span className="text-xs text-muted-foreground ml-1">+{attendees.length - 5}</span>}
        </div>
      )}
    </div>
  );
}
