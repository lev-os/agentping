import * as React from "react";
import { Input } from "../ui/input";

type InputStatus = "default" | "error" | "success";

export interface InputConflictProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  status?: InputStatus;
  onValueChange?: (value: string) => void;
}

function statusClass(status: InputStatus) {
  switch (status) {
    case "error":
      return "border-rose-500/70";
    case "success":
      return "border-emerald-500/70";
    default:
      return "border-slate-600";
  }
}

function handleValueChange(
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined,
  onValueChange: ((value: string) => void) | undefined
) {
  onChange?.(event);
  onValueChange?.(event.target.value);
}

export function InputStudioRaw({
  label,
  hint,
  status = "default",
  onValueChange,
  onChange,
  className,
  id,
  ...props
}: InputConflictProps) {
  const inputId = id || `studio-input-${label?.toLowerCase().replace(/\s+/g, "-") || "field"}`;

  return (
    <label className="block w-full text-xs text-slate-200" htmlFor={inputId}>
      {label ? (
        <span className="mb-1 block font-mono uppercase tracking-[0.08em] text-slate-400">
          {label}
        </span>
      ) : null}
      <input
        id={inputId}
        className={[
          "h-9 w-full border bg-slate-950 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none",
          statusClass(status),
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onChange={(event) => handleValueChange(event, onChange, onValueChange)}
        {...props}
      />
      {hint ? <span className="mt-1 block text-[11px] text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function InputWebUiRaw({
  label,
  hint,
  status = "default",
  onValueChange,
  onChange,
  className,
  id,
  ...props
}: InputConflictProps) {
  const inputId = id || `web-input-${label?.toLowerCase().replace(/\s+/g, "-") || "field"}`;

  return (
    <label className="block w-full text-xs text-zinc-200" htmlFor={inputId}>
      {label ? <span className="mb-1 block font-medium text-zinc-400">{label}</span> : null}
      <input
        id={inputId}
        className={[
          "h-9 w-full rounded-md border bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none",
          statusClass(status).replace("slate", "zinc"),
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onChange={(event) => handleValueChange(event, onChange, onValueChange)}
        {...props}
      />
      {hint ? <span className="mt-1 block text-[11px] text-zinc-500">{hint}</span> : null}
    </label>
  );
}

export function InputCandidate({
  label,
  hint,
  status = "default",
  onValueChange,
  onChange,
  id,
  ...props
}: InputConflictProps) {
  const inputId = id || `candidate-input-${label?.toLowerCase().replace(/\s+/g, "-") || "field"}`;

  return (
    <label className="block w-full text-xs text-zinc-200" htmlFor={inputId}>
      {label ? <span className="mb-1 block font-medium text-zinc-400">{label}</span> : null}
      <Input
        id={inputId}
        error={status === "error"}
        onChange={(event) => handleValueChange(event, onChange, onValueChange)}
        {...props}
      />
      {hint ? <span className="mt-1 block text-[11px] text-zinc-500">{hint}</span> : null}
    </label>
  );
}
