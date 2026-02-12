"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy";

export interface WeatherCardProps {
  temperature?: number;
  condition?: WeatherCondition;
  location?: string;
  unit?: "C" | "F";
  className?: string;
}

const weatherIcons: Record<WeatherCondition, string> = {
  sunny: "\u2600\uFE0F",
  cloudy: "\u2601\uFE0F",
  rainy: "\uD83C\uDF27\uFE0F",
  snowy: "\u2744\uFE0F",
  stormy: "\u26A1",
};

const weatherLabels: Record<WeatherCondition, string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  snowy: "Snowy",
  stormy: "Stormy",
};

export function WeatherCard({
  temperature = 22,
  condition = "sunny",
  location = "Unknown",
  unit = "C",
  className,
}: WeatherCardProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-5 w-56 font-mono",
        className,
      )}
    >
      <div className="text-xs text-cyan-500/60 uppercase tracking-wider mb-3">
        {location}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{weatherIcons[condition]}</span>
        <div>
          <div className="text-2xl text-cyan-300 tabular-nums">
            {temperature}&deg;{unit}
          </div>
          <div className="text-xs text-cyan-500/50">{weatherLabels[condition]}</div>
        </div>
      </div>
    </div>
  );
}
