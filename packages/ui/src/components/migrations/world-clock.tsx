"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TimezoneEntry {
  zone: string;
  label: string;
}

export interface WorldClockProps {
  timezones: TimezoneEntry[];
  className?: string;
}

function getTimeInZone(zone: string): { hours: number; minutes: number; seconds: number; offset: string } {
  try {
    const now = new Date();
    const str = now.toLocaleString("en-US", { timeZone: zone, hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const [h, m, s] = str.split(":").map(Number);
    const offsetStr = now.toLocaleString("en-US", { timeZone: zone, timeZoneName: "shortOffset" });
    const match = offsetStr.match(/GMT([+-]\d+(?::\d+)?)/);
    return { hours: h, minutes: m, seconds: s, offset: match ? `UTC${match[1]}` : zone };
  } catch {
    return { hours: 0, minutes: 0, seconds: 0, offset: zone };
  }
}

function ClockFace({ hours, minutes, seconds, size = 80 }: { hours: number; minutes: number; seconds: number; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90;
  const minAngle = (minutes + seconds / 60) * 6 - 90;
  const secAngle = seconds * 6 - 90;

  const hand = (angle: number, len: number, width: number, color: string) => {
    const rad = (angle * Math.PI) / 180;
    return (
      <line
        x1={cx}
        y1={cy}
        x2={cx + Math.cos(rad) * len}
        y2={cy + Math.sin(rad) * len}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#06b6d4" strokeWidth={1.5} opacity={0.3} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        const inner = r - 4;
        const outer = r - (i % 3 === 0 ? 8 : 6);
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * outer}
            y1={cy + Math.sin(a) * outer}
            x2={cx + Math.cos(a) * inner}
            y2={cy + Math.sin(a) * inner}
            stroke="#67e8f9"
            strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
            opacity={0.4}
          />
        );
      })}
      {hand(hourAngle, r * 0.5, 2.5, "#67e8f9")}
      {hand(minAngle, r * 0.7, 1.5, "#a5f3fc")}
      {hand(secAngle, r * 0.75, 0.8, "#06b6d4")}
      <circle cx={cx} cy={cy} r={2} fill="#06b6d4" />
    </svg>
  );
}

/**
 * WorldClock - Multiple timezone clocks
 * @source packages/adapters/web-ui/src/components/WorldClock.tsx
 * @migration-status implemented
 */
export function WorldClock({ timezones, className }: WorldClockProps) {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">World Clock</div>
      <div className="flex flex-wrap gap-6 justify-center">
        {timezones.map((tz) => {
          const t = getTimeInZone(tz.zone);
          return (
            <div key={tz.zone} className="flex flex-col items-center gap-2">
              <ClockFace hours={t.hours} minutes={t.minutes} seconds={t.seconds} />
              <div className="text-xs font-mono text-gray-200">
                {String(t.hours).padStart(2, "0")}:{String(t.minutes).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 font-semibold">{tz.label}</div>
              <div className="text-[9px] font-mono text-cyan-500/40">{t.offset}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
