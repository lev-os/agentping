"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { PinInput } from "./pin-input";
import { RangeSlider } from "./range-slider";
import { Textarea } from "./textarea";
import { RegexTester } from "./regex-tester";
import { DatePicker } from "./date-picker";
import { ColorPicker } from "./color-picker";

export interface GalleryFormsSectionProps { className?: string; }

export function GalleryFormsSection({ className }: GalleryFormsSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Form Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="PinInput">
          <PinInput length={4} label="Enter PIN" />
        </GalleryCard>
        <GalleryCard name="SecretInput" shell />
        <GalleryCard name="TagInput" shell />
        <GalleryCard name="RangeSlider">
          <RangeSlider min={0} max={100} value={65} label="Volume" />
        </GalleryCard>
        <GalleryCard name="Textarea">
          <Textarea placeholder="Type something..." rows={3} />
        </GalleryCard>
        <GalleryCard name="RegexTester">
          <RegexTester pattern="\d+" testString="abc 123 def 456" />
        </GalleryCard>
        <GalleryCard name="DatePicker">
          <DatePicker label="Start Date" placeholder="Select date..." />
        </GalleryCard>
        <GalleryCard name="ColorPicker">
          <ColorPicker value="#00ffff" label="Accent Color" />
        </GalleryCard>
      </div>
    </div>
  );
}
