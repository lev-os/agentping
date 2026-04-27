import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getWorkflowEntries,
  type WorkflowEntry,
  type WorkflowGroup,
} from "../api/workflows";

const FILTERS: { label: string; value: WorkflowGroup | "all" }[] = [
  { label: "All", value: "all" },
  { label: "System", value: "system" },
  { label: "Plugins", value: "plugin" },
  { label: "Examples", value: "example" },
  { label: "Project", value: "project" },
];

function prettyGroup(group: WorkflowGroup): string {
  switch (group) {
    case "system":
      return "system";
    case "plugin":
      return "plugin";
    case "example":
      return "example";
    case "project":
      return "project";
  }
}

function shortenPath(path: string): string {
  return path.length > 54 ? `…${path.slice(-54)}` : path;
}

export function WorkflowSection() {
  const entries = useMemo(() => getWorkflowEntries(), []);
  const [filter, setFilter] = useState<WorkflowGroup | "all">("system");

  const filtered = useMemo(
    () => (filter === "all" ? entries : entries.filter((entry) => entry.group === filter)),
    [entries, filter],
  );

  return (
    <section className="command-center-section">
      <div className="command-center-section__header">
        <div>
          <h2 className="command-center-section__title">FlowMind + Workflows</h2>
          <p className="command-center-section__meta">
            {entries.length} flow{entries.length === 1 ? "" : "s"} discovered from live YAML
          </p>
        </div>
      </div>

      <div className="parity-filters">
        {FILTERS.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              className={`parity-filter${active ? " parity-filter--active" : ""}`}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="workflow-grid">
        {filtered.map((entry) => (
          <WorkflowCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function WorkflowCard({ entry }: { entry: WorkflowEntry }) {
  const levels = useMemo(() => {
    const counts = new Map<number, number>();
    for (const node of entry.nodes) {
      counts.set(node.level, (counts.get(node.level) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0] - b[0]);
  }, [entry.nodes]);

  return (
    <Link to={`/workflow/${entry.slug}`} className="workflow-card">
      <div className="workflow-card__head">
        <span className="workflow-card__title" title={entry.title}>
          {entry.title}
        </span>
        <span className="workflow-card__entry">
          {entry.entryNodeId ?? "entry?"}
        </span>
      </div>

      <div className="workflow-card__badges">
        <span className="parity-badge">{prettyGroup(entry.group)}</span>
        <span className="parity-badge parity-badge--verdict">
          {entry.nodeCount}n / {entry.edgeCount}e
        </span>
      </div>

      <div className="workflow-minimap" aria-hidden="true">
        {levels.map(([level, count]) => (
          <div key={level} className="workflow-minimap__column">
            {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
              <span key={`${level}-${index}`} className="workflow-minimap__dot" />
            ))}
            {count > 5 ? (
              <span className="workflow-minimap__more">+{count - 5}</span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="workflow-card__foot">
        <span className="workflow-card__path" title={entry.sourcePath}>
          {shortenPath(entry.sourcePath)}
        </span>
        <span className="workflow-card__levels">
          {entry.maxLevel + 1} lane{entry.maxLevel === 0 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
