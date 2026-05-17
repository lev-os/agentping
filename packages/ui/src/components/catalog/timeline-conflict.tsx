import * as React from "react";

type TimelineStatus = "done" | "active" | "queued";

export interface TimelineItem {
  id: string;
  title: string;
  detail?: string;
  time?: string;
  status?: TimelineStatus;
}

export interface TimelineConflictProps {
  items: TimelineItem[];
  className?: string;
}

function dotClass(status: TimelineStatus | undefined) {
  switch (status) {
    case "done":
      return "bg-emerald-400";
    case "active":
      return "bg-cyan-400";
    default:
      return "bg-slate-500";
  }
}

export function TimelineStudioRaw({ items, className }: TimelineConflictProps) {
  return (
    <div className={["w-full border border-slate-700 bg-slate-950 p-3", className].filter(Boolean).join(" ")}>
      <ol className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="relative pl-6">
            <span className={`absolute left-0 top-1.5 h-2.5 w-2.5 ${dotClass(item.status)}`} />
            <span className="absolute left-[4px] top-4 h-full w-px bg-slate-700" />
            <p className="text-xs font-mono uppercase tracking-[0.08em] text-slate-100">
              {item.title}
            </p>
            {item.detail ? <p className="mt-1 text-xs text-slate-400">{item.detail}</p> : null}
            {item.time ? <p className="mt-1 text-[11px] text-slate-500">{item.time}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TimelineWebUiRaw({ items, className }: TimelineConflictProps) {
  return (
    <div
      className={[
        "w-full rounded-md border border-zinc-700 bg-zinc-900 p-3 text-zinc-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ol className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded border border-zinc-800 bg-zinc-950/70 p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium">{item.title}</span>
              {item.time ? <span className="text-[11px] text-zinc-500">{item.time}</span> : null}
            </div>
            {item.detail ? <p className="mt-1 text-[11px] text-zinc-400">{item.detail}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TimelineCandidate(props: TimelineConflictProps) {
  return <TimelineStudioRaw {...props} />;
}
