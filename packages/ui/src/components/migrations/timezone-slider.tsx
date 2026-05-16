"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TimezoneSliderProps {
  timezones: string[];
  baseTime?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

function formatInZone(date: Date, zone: string): string {
  try {
    return date.toLocaleString("en-US", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "--:--";
  }
}

function getOffsetLabel(zone: string): string {
  try {
    const str = new Date().toLocaleString("en-US", { timeZone: zone, timeZoneName: "shortOffset" });
    const m = str.match(/GMT([+-]\d+(?::\d+)?)/);
    return m ? `UTC${m[1]}` : zone;
  } catch {
    return zone;
  }
}

/**
 * TimezoneSlider - Time slider across zones
 * @source packages/adapters/web-ui/src/components/TimezoneSlider.tsx
 * @migration-status implemented
 */
export function TimezoneSlider({
  timezones,
  baseTime,
  onChange,
  className,
}: TimezoneSliderProps) {
  const base = React.useMemo(() => baseTime ?? new Date(), [baseTime]);
  const [offsetMinutes, setOffsetMinutes] = React.useState(0);

  const adjustedDate = React.useMemo(() => {
    const d = new Date(base.getTime() + offsetMinutes * 60 * 1000);
    return d;
  }, [base, offsetMinutes]);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setOffsetMinutes(val);
    if (onChange) {
      onChange(new Date(base.getTime() + val * 60 * 1000));
    }
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">
        Timezone Slider
      </div>

      <div className="mb-4">
        <input
          type="range"
          min={-720}
          max={720}
          value={offsetMinutes}
          onChange={handleSlider}
          className="w-full h-1.5 bg-cyan-500/20 rounded-full appearance-none cursor-pointer accent-cyan-500
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        />
        <div className="flex justify-between text-[9px] font-mono text-cyan-500/30 mt-1">
          <span>-12h</span>
          <span className="text-cyan-400">
            {offsetMinutes >= 0 ? "+" : ""}{Math.floor(offsetMinutes / 60)}h {Math.abs(offsetMinutes % 60)}m
          </span>
          <span>+12h</span>
        </div>
      </div>

      <div className="space-y-2">
        {timezones.map((zone) => (
          <div key={zone} className="flex items-center justify-between rounded border border-cyan-500/5 bg-black/30 px-3 py-2">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-gray-300">{zone.replace(/_/g, " ").split("/").pop()}</span>
              <span className="text-[9px] font-mono text-cyan-500/40">{getOffsetLabel(zone)}</span>
            </div>
            <div className="text-sm font-mono text-cyan-300 font-bold tabular-nums">
              {formatInZone(adjustedDate, zone)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
