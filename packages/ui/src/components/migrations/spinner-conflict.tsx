import * as React from "react";

type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerConflictProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

function spinnerSizeClass(size: SpinnerSize) {
  switch (size) {
    case "sm":
      return "h-4 w-4";
    case "lg":
      return "h-8 w-8";
    default:
      return "h-6 w-6";
  }
}

export function SpinnerStudioRaw({
  size = "md",
  label = "Loading",
  className,
}: SpinnerConflictProps) {
  return (
    <div className={["inline-flex items-center gap-2 text-slate-200", className].filter(Boolean).join(" ")}>
      <div
        className={[
          "animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400",
          spinnerSizeClass(size),
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden
      />
      <span className="text-xs font-mono uppercase tracking-[0.08em]">{label}</span>
    </div>
  );
}

export function SpinnerWebUiRaw({
  size = "md",
  label = "Loading",
  className,
}: SpinnerConflictProps) {
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-3 w-3" : "h-2 w-2";

  return (
    <div className={["inline-flex items-center gap-2 text-zinc-200", className].filter(Boolean).join(" ")}>
      <div className="inline-flex items-center gap-1" aria-hidden>
        <span className={`${dotSize} animate-pulse rounded-full bg-zinc-300`} />
        <span className={`${dotSize} animate-pulse rounded-full bg-zinc-400 [animation-delay:120ms]`} />
        <span className={`${dotSize} animate-pulse rounded-full bg-zinc-500 [animation-delay:240ms]`} />
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
}

export function SpinnerCandidate(props: SpinnerConflictProps) {
  return <SpinnerWebUiRaw {...props} />;
}
