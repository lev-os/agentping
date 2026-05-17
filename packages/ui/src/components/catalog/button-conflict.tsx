import * as React from "react";
import { Button, type ButtonProps } from "../ui/button";

type ButtonTone = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type CanonicalButtonVariant = Exclude<ButtonProps["variant"], null | undefined>;
type CanonicalButtonSize = Exclude<ButtonProps["size"], null | undefined>;

export interface ButtonConflictProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  tone?: ButtonTone;
  size?: ButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const BUTTON_VARIANT_MAP: Record<ButtonTone, CanonicalButtonVariant> = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  danger: "destructive",
};

const BUTTON_SIZE_MAP: Record<ButtonSize, CanonicalButtonSize> = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

export function ButtonStudioRaw({
  label,
  tone = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  type = "button",
  ...props
}: ButtonConflictProps) {
  const toneClass: Record<ButtonTone, string> = {
    primary:
      "border-cyan-400/60 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-400/30",
    secondary:
      "border-violet-400/40 bg-violet-500/20 text-violet-100 hover:bg-violet-400/30",
    ghost: "border-slate-500/40 bg-transparent text-slate-200 hover:bg-slate-800/60",
    danger: "border-rose-400/60 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30",
  };

  const sizeClass: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
  };

  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 border font-mono uppercase tracking-[0.1em] transition-colors",
        toneClass[tone],
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {leadingIcon}
      <span>{label}</span>
      {trailingIcon}
    </button>
  );
}

export function ButtonWebUiRaw({
  label,
  tone = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  type = "button",
  ...props
}: ButtonConflictProps) {
  const toneClass: Record<ButtonTone, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "bg-zinc-200 text-zinc-800 hover:bg-zinc-300",
    ghost: "bg-transparent text-zinc-300 hover:bg-zinc-800/70",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
  };

  const sizeClass: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
  };

  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        toneClass[tone],
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {leadingIcon}
      <span>{label}</span>
      {trailingIcon}
    </button>
  );
}

export function ButtonCandidate({
  label,
  tone = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  ...props
}: ButtonConflictProps) {
  return (
    <Button
      variant={BUTTON_VARIANT_MAP[tone]}
      size={BUTTON_SIZE_MAP[size]}
      className={className}
      {...props}
    >
      {leadingIcon}
      <span>{label}</span>
      {trailingIcon}
    </Button>
  );
}
