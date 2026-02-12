import * as React from "react";

type DiffStatus = "unchanged" | "added" | "removed" | "modified";

interface DiffRow {
  line: number;
  beforeLine: string;
  afterLine: string;
  status: DiffStatus;
}

export interface CodeDiffViewerConflictProps {
  before: string;
  after: string;
  title?: string;
  className?: string;
}

function buildRows(before: string, after: string): DiffRow[] {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const maxLength = Math.max(beforeLines.length, afterLines.length);
  const rows: DiffRow[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const beforeLine = beforeLines[index] ?? "";
    const afterLine = afterLines[index] ?? "";
    let status: DiffStatus = "unchanged";

    if (!beforeLines[index] && afterLines[index]) {
      status = "added";
    } else if (beforeLines[index] && !afterLines[index]) {
      status = "removed";
    } else if (beforeLine !== afterLine) {
      status = "modified";
    }

    rows.push({
      line: index + 1,
      beforeLine,
      afterLine,
      status,
    });
  }

  return rows;
}

function rowClass(status: DiffStatus) {
  switch (status) {
    case "added":
      return "bg-emerald-500/10";
    case "removed":
      return "bg-rose-500/10";
    case "modified":
      return "bg-amber-500/10";
    default:
      return "";
  }
}

export function CodeDiffViewerStudioRaw({
  before,
  after,
  title = "Patch Preview",
  className,
}: CodeDiffViewerConflictProps) {
  const rows = React.useMemo(() => buildRows(before, after), [before, after]);

  return (
    <div
      className={[
        "overflow-hidden border border-slate-700/80 bg-slate-950 text-[11px] text-slate-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="border-b border-slate-700/80 px-3 py-2 font-mono uppercase tracking-[0.12em] text-slate-300">
        {title}
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r border-slate-700/80">
          {rows.map((row) => (
            <div
              key={`studio-before-${row.line}`}
              className={`grid grid-cols-[32px_1fr] px-2 py-1 font-mono ${rowClass(row.status)}`}
            >
              <span className="text-slate-500">{row.line}</span>
              <span className="truncate">{row.beforeLine || " "}</span>
            </div>
          ))}
        </div>
        <div>
          {rows.map((row) => (
            <div
              key={`studio-after-${row.line}`}
              className={`grid grid-cols-[32px_1fr] px-2 py-1 font-mono ${rowClass(row.status)}`}
            >
              <span className="text-slate-500">{row.line}</span>
              <span className="truncate">{row.afterLine || " "}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CodeDiffViewerWebUiRaw({
  before,
  after,
  title = "Diff",
  className,
}: CodeDiffViewerConflictProps) {
  const rows = React.useMemo(() => buildRows(before, after), [before, after]);

  return (
    <div
      className={[
        "overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 text-[11px] text-zinc-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="border-b border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300">
        {title}
      </div>
      <div className="max-h-52 overflow-auto">
        {rows.map((row) => (
          <div
            key={`web-${row.line}`}
            className={`grid grid-cols-[24px_1fr_1fr] gap-2 px-2 py-1 font-mono ${rowClass(row.status)}`}
          >
            <span className="text-zinc-500">{row.line}</span>
            <span className="truncate">
              {row.status === "added" ? "" : row.beforeLine || " "}
            </span>
            <span className="truncate">
              {row.status === "removed" ? "" : row.afterLine || " "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodeDiffViewerCandidate(props: CodeDiffViewerConflictProps) {
  return <CodeDiffViewerWebUiRaw {...props} />;
}
