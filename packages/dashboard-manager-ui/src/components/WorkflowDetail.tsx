import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GraphView } from "@kingly/ui/components";

import { getWorkflowEntries, type WorkflowEntry } from "../api/workflows";
import { WorkflowGraph } from "./WorkflowGraph";

function labelForGroup(group: WorkflowEntry["group"]): string {
  switch (group) {
    case "system":
      return "System";
    case "plugin":
      return "Plugin";
    case "example":
      return "Example";
    case "project":
      return "Project";
  }
}

export function WorkflowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<WorkflowEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const entry = useMemo(
    () => entries.find((candidate) => candidate.slug === (id ?? "").toLowerCase()),
    [entries, id],
  );

  useEffect(() => {
    let active = true;
    getWorkflowEntries()
      .then((workflowEntries) => {
        if (!active) return;
        setEntries(workflowEntries);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setEntries([]);
        setLoadError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="command-center-page">
        <div className="workflow-empty">
          <h1>Loading workflow</h1>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="command-center-page">
        <div className="workflow-empty">
          <h1>Workflow not found</h1>
          <p>
            {loadError ?? (
              <>
                No workflow entry matches <code>{id}</code>.
              </>
            )}
          </p>
          <button className="command-center-button" onClick={() => navigate("/")}>
            ← Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="command-center-page">
      <div className="command-center-detail">
        <button className="command-center-button" onClick={() => navigate("/")}>
          ← Back
        </button>

        <section className="workflow-hero">
          <div>
            <div className="command-center-hero__eyebrow">
              {labelForGroup(entry.group)} Workflow
            </div>
            <h1 className="command-center-hero__title">{entry.title}</h1>
            <p className="command-center-hero__description">
              {entry.description ?? "YAML-backed workflow topology rendered from the live repo."}
            </p>
          </div>

          <div className="workflow-hero__meta">
            <div className="command-center-status-card">
              <div className="command-center-status-card__label">Entry</div>
              <div className="command-center-status-card__value">
                {entry.entryNodeId ?? "—"}
              </div>
            </div>
            <div className="command-center-status-card">
              <div className="command-center-status-card__label">Nodes</div>
              <div className="command-center-status-card__value">{entry.nodeCount}</div>
            </div>
            <div className="command-center-status-card">
              <div className="command-center-status-card__label">Edges</div>
              <div className="command-center-status-card__value">{entry.edgeCount}</div>
            </div>
            <div className="command-center-status-card">
              <div className="command-center-status-card__label">Source</div>
              <div className="workflow-hero__path">{entry.sourcePath}</div>
            </div>
          </div>
        </section>

        <GraphView
          id={entry.id}
          title={`${entry.title} topology`}
          description={entry.sourcePath}
          nodes={entry.nodes.map((node) => ({
            id: node.id,
            label: node.label,
            type: node.type,
          }))}
          edges={entry.edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
            type: edge.kind,
          }))}
          size="lg"
          autoHeight
          interactive={false}
          showConnections
        >
          <div className="workflow-detail__hint">
            Scroll horizontally to inspect every lane in the workflow.
          </div>
          <WorkflowGraph nodes={entry.nodes} edges={entry.edges} />
        </GraphView>

        <section className="command-center-frame">
          <div className="command-center-section__header">
            <div>
              <h2 className="command-center-section__title">Node Catalog</h2>
              <p className="command-center-section__meta">
                {entry.nodeCount} nodes across {entry.maxLevel + 1} lane{entry.maxLevel === 0 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="workflow-table-wrap">
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Label</th>
                  <th>Type</th>
                  <th>Lane</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {entry.nodes.map((node) => (
                  <tr key={node.id}>
                    <td>{node.id}</td>
                    <td>{node.label}</td>
                    <td>{node.type}</td>
                    <td>L{node.level}</td>
                    <td>{node.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
