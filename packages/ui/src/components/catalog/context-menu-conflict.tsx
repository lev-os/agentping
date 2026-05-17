import * as React from "react";

export interface ContextMenuAction {
  id: string;
  label: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface ContextMenuConflictProps {
  title?: string;
  actions: ContextMenuAction[];
  onActionSelect?: (actionId: string) => void;
  className?: string;
}

export function ContextMenuStudioRaw({
  title = "Actions",
  actions,
  onActionSelect,
  className,
}: ContextMenuConflictProps) {
  return (
    <div
      className={[
        "w-full border border-slate-600/80 bg-slate-950 p-1 text-xs text-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="px-2 py-1 font-mono uppercase tracking-[0.1em] text-slate-400">
        {title}
      </div>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.disabled}
          onClick={() => onActionSelect?.(action.id)}
          className={[
            "flex w-full items-center justify-between px-2 py-1.5 text-left transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-40",
            action.danger
              ? "text-rose-300 hover:bg-rose-500/20"
              : "text-slate-200 hover:bg-cyan-500/20",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{action.label}</span>
          {action.shortcut ? (
            <span className="text-[10px] text-slate-500">{action.shortcut}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function ContextMenuWebUiRaw({
  title = "Menu",
  actions,
  onActionSelect,
  className,
}: ContextMenuConflictProps) {
  return (
    <div
      className={[
        "w-full rounded-md border border-zinc-700 bg-zinc-900 p-1 text-xs text-zinc-100 shadow-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400">{title}</div>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.disabled}
          onClick={() => onActionSelect?.(action.id)}
          className={[
            "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-40",
            action.danger
              ? "text-rose-300 hover:bg-rose-500/15"
              : "text-zinc-200 hover:bg-zinc-800",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{action.label}</span>
          {action.shortcut ? (
            <span className="text-[10px] text-zinc-500">{action.shortcut}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function ContextMenuCandidate(props: ContextMenuConflictProps) {
  return <ContextMenuWebUiRaw {...props} />;
}
