const API_BASE = "/api";

export type WorkflowGraphNodeStatus =
  | "idle"
  | "ready"
  | "running"
  | "succeeded"
  | "failed"
  | "waiting"
  | "skipped";

export type WorkflowGraphLane = string;

export type WorkflowGraphEdgeStyle =
  | "primary"
  | "branch"
  | "parallel"
  | "boundary"
  | "secondary";

export interface WorkflowGraphNodeView {
  id: string;
  label: string;
  kind: string;
  lane: WorkflowGraphLane;
  wave: number;
  depth: number;
  status: WorkflowGraphNodeStatus;
  summary: string;
  detail?: string;
  hiddenChildrenCount: number;
  backreferenceCount: number;
  metadata?: Record<string, unknown>;
}

export interface WorkflowGraphEdgeView {
  id: string;
  source: string;
  target: string;
  label?: string;
  style: WorkflowGraphEdgeStyle;
  hidden?: boolean;
}

export interface WorkflowGraphFrame {
  execId?: string;
  data?: Record<string, unknown>;
  index: number;
  ts: string;
  eventType: string;
  activeNodeId?: string;
  activeLane?: WorkflowGraphLane;
  activeWave?: number;
  summary: string;
  nodeStatuses: Record<string, WorkflowGraphNodeStatus>;
  log: string[];
}

export interface FlowMindGraph {
  title: string;
  entry: string;
  laneOrder: WorkflowGraphLane[];
  slicePolicy: {
    maxDepth: number;
    headCount: number;
    middleCount: number;
    tailCount: number;
  };
  nodes: WorkflowGraphNodeView[];
  edges: WorkflowGraphEdgeView[];
  frames: WorkflowGraphFrame[];
  metadata?: Record<string, unknown>;
}

export interface WorkflowGraphWidget {
  type: "WorkflowGraph";
  graph: FlowMindGraph;
  cursor?: number;
  focusNodeId?: string;
  debugMeta?: {
    traceSource?: string;
    execId?: string;
    flowPath?: string;
    runPath?: string;
    review?: string;
    shareState?: Record<string, unknown>;
  };
}

export interface ExecTraceRef {
  ref?: string;
  receipt_id?: string;
  [key: string]: unknown;
}

export interface ExecTraceDecisionRef extends ExecTraceRef {
  gate_id?: string;
  verdict?: string;
}

// Owner truth from `lev exec trace --json`: proof from core/eval, evidence from core/exec. Render, never derive.
export type ExecTrace = Record<string, unknown> & {
  status?: string;
  eventCount?: number;
  event_count?: number;
  exitCode?: number | null;
  exit_code?: number | null;
  flowPath?: string;
  flow_path?: string;
  graphFlowPath?: string;
  receipt?: unknown;
  events?: unknown[];
  proof?: {
    ok: boolean;
    status: "passed" | "blocked";
    issues: { code: string; field: string; message: string }[];
  };
  evidence?: {
    receipt_ref?: ExecTraceRef | null;
    trace_ref?: ExecTraceRef | null;
    decision_refs?: ExecTraceDecisionRef[];
    missing?: string[];
    claim_verdicts?: unknown[];
    [key: string]: unknown;
  };
};

export interface AgentPingExecDebugPayload {
  type: "AgentPingExecDebug";
  specVersion: "0.1.0";
  execId: string;
  projectRoot: string;
  trace: ExecTrace;
  graph: { widget: WorkflowGraphWidget } | null;
  commands: { trace: string; flowmind: string };
  diagnostics: { warnings: string[] };
}

export type ExecTraceDebugResult =
  | { ok: true; data: AgentPingExecDebugPayload }
  | { ok: false; status: 404; error: string; execId: string }
  | { ok: false; status: number; error: string };

export async function getExecTraceDebug(execId: string): Promise<ExecTraceDebugResult> {
  const response = await fetch(`${API_BASE}/exec-traces/${encodeURIComponent(execId)}`);
  if (response.status === 404) {
    let error = "trace not found";
    try {
      const body = await response.json() as { error?: string; execId?: string };
      if (typeof body.error === "string" && body.error.trim()) error = body.error;
    } catch {
      // keep default
    }
    return { ok: false, status: 404, error, execId };
  }
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: `Failed to get exec trace: ${response.status} ${response.statusText}`,
    };
  }
  const data = await response.json() as AgentPingExecDebugPayload;
  return { ok: true, data };
}
