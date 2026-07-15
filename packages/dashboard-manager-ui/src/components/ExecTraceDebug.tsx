import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GraphView } from "@kingly/ui/components";

import {
  deriveProofBackedStatus,
  getExecTraceDebug,
  type AgentPingExecDebugPayload,
  type ExecTrace,
} from "../api/exec-traces";
import { FlowMindDebugGraph } from "./FlowMindDebugGraph";
import { INITIAL_POLLING_STATE, pollingFsmReducer } from "./pollingFsm";

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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

function renderRefs(label: string, refs: string[]) {
  return (
    <div className="exec-debug-proof-chain__group">
      <div className="command-center-status-card__label">{label}</div>
      {refs.length > 0 ? (
        <ul className="exec-debug-warning-list">
          {refs.map((ref) => <li key={ref}><code>{ref}</code></li>)}
        </ul>
      ) : (
        <p className="command-center-section__meta">missing</p>
      )}
    </div>
  );
}

export function ExecTraceDebug() {
  const { execId } = useParams<{ execId: string }>();
  const navigate = useNavigate();
  const [fsmState, dispatch] = useReducer(pollingFsmReducer, INITIAL_POLLING_STATE);
  const { payload, error, notFound, autoRefresh, refreshPaused } = fsmState;
  const [loading, setLoading] = useState(true);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const fetchInFlightRef = useRef(false);

  useEffect(() => {
    dispatch({ type: "execid_changed" });
    setLoading(true);
  }, [execId]);

  useEffect(() => {
    if (!execId || notFound) return;
    const resolvedExecId = execId;
    let cancelled = false;
    const shouldPoll = autoRefresh && !refreshPaused;

    async function load() {
      if (fetchInFlightRef.current) return;
      fetchInFlightRef.current = true;
      try {
        const result = await getExecTraceDebug(resolvedExecId);
        if (cancelled) return;

        if (result.ok) {
          dispatch({ type: "fetched_ok", data: result.data });
          return;
        }

        if (result.status === 404) {
          dispatch({ type: "fetched_404" });
          return;
        }

        dispatch({ type: "fetched_error", error: result.error });
      } catch (caught) {
        if (cancelled) return;
        dispatch({
          type: "fetched_error",
          error: caught instanceof Error ? caught.message : "Failed to load exec trace",
        });
      } finally {
        fetchInFlightRef.current = false;
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    if (!shouldPoll) {
      return () => {
        cancelled = true;
      };
    }

    const interval = window.setInterval(() => void load(), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [autoRefresh, execId, notFound, refreshNonce, refreshPaused]);

  const summary = useMemo(() => {
    if (!payload) return null;
    const proofStatus = deriveProofBackedStatus(payload.trace);
    return {
      status: proofStatus.status,
      proofStatus,
      eventCount: traceEventCount(payload.trace),
      exitCode: traceExitCode(payload.trace),
      flowPath: graphFlowPath(payload),
      receipt: proofStatus.receiptRef ?? traceReceipt(payload.trace),
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

  if (notFound) {
    return (
      <div className="command-center-page">
        <div className="workflow-empty">
          <h1>Trace not found</h1>
          <p>
            No exec trace exists for <code>{execId}</code>.
          </p>
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
              className={`command-center-button${autoRefresh && !refreshPaused ? " command-center-button--primary" : ""}`}
              type="button"
              onClick={() => {
                if (refreshPaused) {
                  dispatch({ type: "resume" });
                  setLoading(true);
                  setRefreshNonce((value) => value + 1);
                  return;
                }
                dispatch({ type: "toggle_refresh" });
              }}
            >
              {refreshPaused
                ? "paused after repeated errors — Resume"
                : autoRefresh
                  ? "Live refresh on"
                  : "Live refresh off"}
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
            {refreshPaused ? (
              <p className="command-center-section__meta">
                Auto-refresh paused after repeated errors.
              </p>
            ) : null}
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
                  <div className="command-center-status-card__label">Proof Status</div>
                  <div className="command-center-status-card__value">{summary.status}</div>
                  <div className="command-center-section__meta">{summary.proofStatus.reason}</div>
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

              <div className="exec-debug-proof-chain">
                {renderRefs("GateProof", summary.proofStatus.proofRefs)}
                {renderRefs("Trace", summary.proofStatus.traceRef ? [summary.proofStatus.traceRef] : [])}
                {renderRefs("Evidence", summary.proofStatus.evidenceRefs)}
                {renderRefs("Audit", summary.proofStatus.auditRefs)}
              </div>
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
