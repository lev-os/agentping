"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(s?: string): Date {
  if (!s) return new Date();
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? new Date() : d;
}

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startDow = first.getDay();
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= lastDay; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * DatePicker - Accessible calendar with WCAG 2.1 AA compliance
 * @source packages/adapters/web-ui/src/components/DatePicker.tsx
 * @migration-status complete
 *
 * WCAG fixes: 2.1.1 (arrow nav), 2.1.2 (escape), 2.4.3 (focus trap), 4.1.2 (ARIA grid + expanded)
 */
export function DatePicker({ value, onChange, label, placeholder = "Select date...", className }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const parsed = parseDate(value);
  const [viewYear, setViewYear] = React.useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(parsed.getMonth());
  const [focusDate, setFocusDate] = React.useState(parsed);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const gridRef = React.useRef<HTMLTableElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  const grid = getMonthGrid(viewYear, viewMonth);

  // Sync view when value changes externally
  React.useEffect(() => {
    const d = parseDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setFocusDate(d);
  }, [value]);

  // Focus the active day button when popup opens or focusDate changes
  React.useEffect(() => {
    if (!isOpen) return;
    const btn = gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]');
    btn?.focus();
  }, [isOpen, focusDate]);

  function open() {
    const d = parseDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setFocusDate(d);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function select(d: Date) {
    onChange?.(toDateStr(d));
    close();
  }

  function moveFocus(offset: number) {
    const next = new Date(focusDate);
    next.setDate(next.getDate() + offset);
    setFocusDate(next);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function handleGridKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft": e.preventDefault(); moveFocus(-1); break;
      case "ArrowRight": e.preventDefault(); moveFocus(1); break;
      case "ArrowUp": e.preventDefault(); moveFocus(-7); break;
      case "ArrowDown": e.preventDefault(); moveFocus(7); break;
      case "Home": e.preventDefault(); {
        const first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
        setFocusDate(first);
      } break;
      case "End": e.preventDefault(); {
        const last = new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, 0);
        setFocusDate(last);
      } break;
      case "Enter": case " ": e.preventDefault(); select(focusDate); break;
      case "Escape": e.preventDefault(); close(); break;
    }
  }

  // Focus trap: keep Tab within the popup
  function handlePopupKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab" || !popupRef.current) return;

    const focusable = popupRef.current.querySelectorAll<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  const labelId = React.useId();
  const displayValue = value
    ? parseDate(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : placeholder;

  return (
    <div className={cn("relative flex flex-col gap-1", className)}>
      {label && <label id={labelId} className="text-xs text-muted-foreground">{label}</label>}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-labelledby={label ? labelId : undefined}
        onClick={() => isOpen ? close() : open()}
        className="px-3 py-2 text-sm text-left bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[var(--min-touch-target,44px)] flex items-center"
      >
        {displayValue}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Choose date, ${formatMonthYear(viewYear, viewMonth)}`}
          onKeyDown={handlePopupKeyDown}
          className="absolute top-full left-0 z-50 mt-1 p-3 bg-card border border-border rounded-lg shadow-lg min-w-[280px]"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => { const m = viewMonth - 1; setViewMonth(m < 0 ? 11 : m); if (m < 0) setViewYear(viewYear - 1); }}
              className="p-1 rounded hover:bg-muted min-h-[var(--min-touch-target,44px)] min-w-[var(--min-touch-target,44px)] flex items-center justify-center"
            >
              &larr;
            </button>
            <span className="text-sm font-medium" aria-live="polite">{formatMonthYear(viewYear, viewMonth)}</span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => { const m = viewMonth + 1; setViewMonth(m > 11 ? 0 : m); if (m > 11) setViewYear(viewYear + 1); }}
              className="p-1 rounded hover:bg-muted min-h-[var(--min-touch-target,44px)] min-w-[var(--min-touch-target,44px)] flex items-center justify-center"
            >
              &rarr;
            </button>
          </div>

          {/* Calendar grid */}
          <table ref={gridRef} role="grid" aria-label={formatMonthYear(viewYear, viewMonth)} onKeyDown={handleGridKeyDown}>
            <thead>
              <tr role="row">
                {DAYS.map((d) => (
                  <th key={d} role="columnheader" className="text-xs text-muted-foreground p-1 text-center w-9" abbr={d}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((week, wi) => (
                <tr key={wi} role="row">
                  {week.map((day, di) => {
                    if (!day) return <td key={di} role="gridcell" />;
                    const isSelected = value === toDateStr(day);
                    const isFocused = toDateStr(day) === toDateStr(focusDate);
                    const isToday = toDateStr(day) === toDateStr(new Date());
                    return (
                      <td key={di} role="gridcell">
                        <button
                          type="button"
                          tabIndex={isFocused ? 0 : -1}
                          data-focused={isFocused || undefined}
                          aria-selected={isSelected}
                          aria-label={day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                          aria-current={isToday ? "date" : undefined}
                          onClick={() => select(day)}
                          className={cn(
                            "w-9 h-9 text-sm rounded-md flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-primary",
                            isSelected && "bg-primary text-primary-foreground",
                            !isSelected && "hover:bg-muted",
                            isToday && !isSelected && "border border-primary",
                          )}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Today shortcut */}
          <div className="mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => select(new Date())}
              className="text-xs text-primary hover:underline min-h-[var(--min-touch-target,44px)] flex items-center"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
