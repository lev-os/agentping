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
  receiptPath?: string;
  receipt_id?: string;
  events?: unknown[];
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

export async function getExecTraceDebug(execId: string): Promise<AgentPingExecDebugPayload> {
  const response = await fetch(`${API_BASE}/exec-traces/${encodeURIComponent(execId)}`);
  if (!response.ok) {
    throw new Error(`Failed to get exec trace: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
