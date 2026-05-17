import * as React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateConflictProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyStateStudioRaw({
  title,
  description,
  ctaLabel,
  onCtaClick,
  icon,
  className,
}: EmptyStateConflictProps) {
  return (
    <div
      className={[
        "w-full border border-slate-700 bg-slate-950 p-5 text-center text-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border border-cyan-400/60 text-cyan-300">
        {icon ?? <Inbox size={18} />}
      </div>
      <p className="font-mono text-sm uppercase tracking-[0.08em]">{title}</p>
      {description ? (
        <p className="mt-2 text-xs text-slate-400">{description}</p>
      ) : null}
      {ctaLabel ? (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-4 border border-cyan-400/60 bg-cyan-500/20 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-cyan-100"
        >
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyStateWebUiRaw({
  title,
  description,
  ctaLabel,
  onCtaClick,
  icon,
  className,
}: EmptyStateConflictProps) {
  return (
    <div
      className={[
        "w-full rounded-lg border border-zinc-700 bg-zinc-900 p-5 text-center text-zinc-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
        {icon ?? <Inbox size={18} />}
      </div>
      <p className="text-sm font-semibold">{title}</p>
      {description ? (
        <p className="mt-2 text-xs text-zinc-400">{description}</p>
      ) : null}
      {ctaLabel ? (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-4 rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white"
        >
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyStateCandidate(props: EmptyStateConflictProps) {
  return <EmptyStateStudioRaw {...props} />;
}
