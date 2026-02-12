import * as React from "react";
import { Badge, type BadgeProps } from "../ui/badge";

type BadgeTone = "neutral" | "success" | "warning" | "danger";
type CanonicalBadgeVariant = Exclude<BadgeProps["variant"], null | undefined>;

export interface BadgeConflictProps {
  label: string;
  tone?: BadgeTone;
  subtle?: boolean;
  className?: string;
}

const BADGE_VARIANT_MAP: Record<BadgeTone, CanonicalBadgeVariant> = {
  neutral: "default",
  success: "success",
  warning: "warning",
  danger: "destructive",
};

export function BadgeStudioRaw({
  label,
  tone = "neutral",
  subtle = false,
  className,
}: BadgeConflictProps) {
  const toneClass: Record<BadgeTone, string> = {
    neutral: "border-slate-400/60 text-slate-100",
    success: "border-emerald-400/70 text-emerald-300",
    warning: "border-amber-400/70 text-amber-300",
    danger: "border-rose-400/70 text-rose-300",
  };

  return (
    <span
      className={[
        "inline-flex items-center border px-2 py-1 text-[11px] font-mono uppercase tracking-[0.12em]",
        subtle ? "bg-slate-950/40" : "bg-slate-950/70",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}

export function BadgeWebUiRaw({
  label,
  tone = "neutral",
  subtle = false,
  className,
}: BadgeConflictProps) {
  const toneClass: Record<BadgeTone, string> = {
    neutral: "bg-zinc-100 text-zinc-700",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-rose-100 text-rose-800",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        subtle ? "opacity-80" : "opacity-100",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}

export function BadgeCandidate({
  label,
  tone = "neutral",
  subtle = false,
  className,
}: BadgeConflictProps) {
  const variant =
    subtle && tone === "neutral" ? "outline" : BADGE_VARIANT_MAP[tone];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
