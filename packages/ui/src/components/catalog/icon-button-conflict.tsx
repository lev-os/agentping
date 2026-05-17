import * as React from "react";
import { IconButton, type IconButtonProps } from "../ui/icon-button";

type IconButtonTone = "neutral" | "primary" | "danger";
type IconButtonSize = "xs" | "sm" | "md" | "lg";
type CanonicalIconButtonVariant = Exclude<
  IconButtonProps["variant"],
  null | undefined
>;
type CanonicalIconButtonSize = Exclude<IconButtonProps["size"], null | undefined>;

export interface IconButtonConflictProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  icon?: React.ReactNode;
  tone?: IconButtonTone;
  size?: IconButtonSize;
}

const ICON_BUTTON_VARIANT_MAP: Record<
  IconButtonTone,
  CanonicalIconButtonVariant
> = {
  neutral: "ghost",
  primary: "default",
  danger: "destructive",
};

const ICON_BUTTON_SIZE_MAP: Record<IconButtonSize, CanonicalIconButtonSize> = {
  xs: "xs",
  sm: "sm",
  md: "default",
  lg: "lg",
};

const DEFAULT_ICON = <span aria-hidden>◎</span>;

export function IconButtonStudioRaw({
  label,
  icon = DEFAULT_ICON,
  tone = "neutral",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonConflictProps) {
  const toneClass: Record<IconButtonTone, string> = {
    neutral: "border-slate-600 text-slate-200 hover:bg-slate-800",
    primary: "border-cyan-400/70 text-cyan-200 hover:bg-cyan-500/20",
    danger: "border-rose-400/70 text-rose-200 hover:bg-rose-500/20",
  };
  const sizeClass: Record<IconButtonSize, string> = {
    xs: "h-6 w-6 text-xs",
    sm: "h-7 w-7 text-sm",
    md: "h-9 w-9 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={[
        "inline-flex items-center justify-center border transition-colors",
        toneClass[tone],
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
    </button>
  );
}

export function IconButtonWebUiRaw({
  label,
  icon = DEFAULT_ICON,
  tone = "neutral",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonConflictProps) {
  const toneClass: Record<IconButtonTone, string> = {
    neutral: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
  };
  const sizeClass: Record<IconButtonSize, string> = {
    xs: "h-6 w-6 text-xs",
    sm: "h-7 w-7 text-sm",
    md: "h-9 w-9 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={[
        "inline-flex items-center justify-center rounded-md transition-colors",
        toneClass[tone],
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
    </button>
  );
}

export function IconButtonCandidate({
  label,
  icon = DEFAULT_ICON,
  tone = "neutral",
  size = "md",
  className,
  ...props
}: IconButtonConflictProps) {
  return (
    <IconButton
      aria-label={label}
      title={label}
      variant={ICON_BUTTON_VARIANT_MAP[tone]}
      size={ICON_BUTTON_SIZE_MAP[size]}
      className={className}
      {...props}
    >
      {icon}
    </IconButton>
  );
}
