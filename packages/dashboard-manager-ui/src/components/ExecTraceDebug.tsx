import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GraphView } from "@kingly/ui/components";

import {
  getExecTraceDebug,
  type AgentPingExecDebugPayload,
  type ExecTrace,
} from "../api/exec-traces";
import { FlowMindDebugGraph } from "./FlowMindDebugGraph";

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function traceStatus(trace: ExecTrace): string {
  return asString(trace.status) ?? "unknown";
}

function traceEventCount(trace: ExecTrace): number {
  return (
    asNumber(trace.eventCount) ??
    asNumber(trace.event_count) ??
    (Array.isArray(trace.events) ? trace.events.length : 0)
  );
}

function traceExitCode(trace: ExecTrace): number | null {
  return asNumber(trace.exitCode) ?? asNumber(trace.exit_code);
}

function traceReceipt(trace: ExecTrace): unknown {
  return trace.receipt ?? trace.receiptPath ?? trace.receipt_id ?? null;
}

function graphFlowPath(payload: AgentPingExecDebugPayload): string {
  const trace = payload.trace;
  const graph = payload.graph?.widget.graph;
  const traceGraph = trace.graph;
  return (
    asString(graph?.metadata?.flowPath) ??
    asString(payload.graph?.widget.debugMeta?.flowPath) ??
    (traceGraph && typeof traceGraph === "object" && !Array.isArray(traceGraph)
      ? asString((traceGraph as Record<string, unknown>).flowPath)
      : null) ??
    asString(trace.graphFlowPath) ??
    asString(trace.flowPath) ??
    asString(trace.flow_path) ??
    "not reported"
  );
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("fail") || normalized.includes("error")) return "is-error";
  if (normalized.includes("complete") || normalized.includes("success")) return "is-success";
  if (normalized.includes("running") || normalized.includes("active")) return "is-active";
  return "is-muted";
}

function renderReceipt(receipt: unknown) {
  if (!receipt) return null;
  if (typeof receipt === "string") return <code>{receipt}</code>;
  return <pre>{JSON.stringify(receipt, null, 2)}</pre>;
}

export function ExecTraceDebug() {
  const { execId } = useParams<{ execId: string }>();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<AgentPingExecDebugPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    if (!execId) return;
    const resolvedExecId = execId;
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const nextPayload = await getExecTraceDebug(resolvedExecId);
        if (!cancelled) setPayload(nextPayload);
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Failed to load exec trace");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    if (!autoRefresh) {
      return () => {
        cancelled = true;
      };
    }

    const interval = window.setInterval(() => void load(), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [autoRefresh, execId, refreshNonce]);

  const summary = useMemo(() => {
    if (!payload) return null;
    const status = traceStatus(payload.trace);
    return {
      status,
      eventCount: traceEventCount(payload.trace),
      exitCode: traceExitCode(payload.trace),
      flowPath: graphFlowPath(payload),
      receipt: traceReceipt(payload.trace),
      latestFrame: payload.graph?.widget.graph.frames[payload.graph.widget.graph.frames.length - 1],
    };
  }, [payload]);

  if (!execId) {
    return (
      <div className="command-center-page">
        <div className="workflow-empty">
          <h1>Exec trace missing</h1>
          <p>The debug route requires an execution id.</p>
          <button className="command-center-button" onClick={() => navigate("/")}>
            Back to dashboard
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

        <section className="workflow-hero exec-debug-hero">
          <div>
            <div className="command-center-hero__eyebrow">AgentPing Exec Debug</div>
            <h1 className="command-center-hero__title">{execId}</h1>
            <p className="command-center-hero__description">
              Live FlowMind/Lev run inspection from the dashboard manager API.
            </p>
          </div>

          <div className="exec-debug-actions">
            <button
              className={`command-center-button${autoRefresh ? " command-center-button--primary" : ""}`}
              type="button"
              onClick={() => setAutoRefresh((value) => !value)}
            >
              {autoRefresh ? "Live refresh on" : "Live refresh off"}
            </button>
            <button
              className="command-center-button"
              type="button"
              onClick={() => {
                setLoading(true);
                setRefreshNonce((value) => value + 1);
              }}
            >
              Refresh
            </button>
          </div>
        </section>

        {loading && !payload ? (
          <section className="command-center-frame">
            <p className="command-center-section__meta">Loading exec trace…</p>
          </section>
        ) : null}

        {error ? (
          <section className="command-center-frame exec-debug-error">
            <h2 className="command-center-section__title">Trace unavailable</h2>
            <p>{error}</p>
          </section>
        ) : null}

        {payload && summary ? (
          <>
            <section className="command-center-frame">
              <div className="command-center-section__header">
                <div>
                  <h2 className="command-center-section__title">Run Summary</h2>
                  <p className="command-center-section__meta">
                    Project root: <code>{payload.projectRoot}</code>
                  </p>
                </div>
              </div>

              <div className="exec-debug-summary-grid">
                <div className={`command-center-status-card exec-debug-status ${statusTone(summary.status)}`}>
                  <div className="command-center-status-card__label">Status</div>
                  <div className="command-center-status-card__value">{summary.status}</div>
                </div>
                <div className="command-center-status-card">
                  <div className="command-center-status-card__label">Events</div>
                  <div className="command-center-status-card__value">{summary.eventCount}</div>
                </div>
                <div className="command-center-status-card">
                  <div className="command-center-status-card__label">Exit Code</div>
                  <div className="command-center-status-card__value">
                    {summary.exitCode ?? "running"}
                  </div>
                </div>
                <div className="command-center-status-card">
                  <div className="command-center-status-card__label">Graph Flow Path</div>
                  <div className="workflow-hero__path">{summary.flowPath}</div>
                </div>
              </div>

              {summary.receipt ? (
                <div className="exec-debug-receipt">
                  <div className="command-center-status-card__label">Receipt</div>
                  {renderReceipt(summary.receipt)}
                </div>
              ) : null}
            </section>

            {payload.graph?.widget.graph ? (
              <GraphView
                id={`debug-${payload.execId}`}
                title={`${payload.graph.widget.graph.title} run graph`}
                description={summary.latestFrame?.summary ?? summary.flowPath}
                nodes={payload.graph.widget.graph.nodes.map((node) => ({
                  id: node.id,
                  label: node.label,
                  type: node.kind,
                }))}
                edges={payload.graph.widget.graph.edges.map((edge) => ({
                  source: edge.source,
                  target: edge.target,
                  type: edge.style,
                }))}
                size="lg"
                autoHeight
                interactive
                showConnections
              >
                <FlowMindDebugGraph graph={payload.graph.widget.graph} />
              </GraphView>
            ) : (
              <section className="command-center-frame">
                <h2 className="command-center-section__title">Graph unavailable</h2>
                <p className="command-center-section__meta">
                  The API response did not include <code>graph.widget.graph</code>.
                </p>
              </section>
            )}

            <section className="exec-debug-lower-grid">
              <div className="command-center-frame">
                <h2 className="command-center-section__title">Latest Frame</h2>
                {summary.latestFrame ? (
                  <div className="exec-debug-kv">
                    <span>Index</span>
                    <strong>{summary.latestFrame.index + 1}</strong>
                    <span>Event</span>
                    <strong>{summary.latestFrame.eventType}</strong>
                    <span>Active node</span>
                    <strong>{summary.latestFrame.activeNodeId ?? "none"}</strong>
                    <span>Summary</span>
                    <strong>{summary.latestFrame.summary}</strong>
                  </div>
                ) : (
                  <p className="command-center-section__meta">No frames reported.</p>
                )}
              </div>

              <div className="command-center-frame">
                <h2 className="command-center-section__title">Commands</h2>
                <div className="exec-debug-command-list">
                  <code>{payload.commands.trace}</code>
                  <code>{payload.commands.flowmind}</code>
                </div>
              </div>
            </section>

            {payload.diagnostics.warnings.length > 0 ? (
              <section className="command-center-frame exec-debug-warnings">
                <h2 className="command-center-section__title">Diagnostics</h2>
                <ul className="exec-debug-warning-list">
                  {payload.diagnostics.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
