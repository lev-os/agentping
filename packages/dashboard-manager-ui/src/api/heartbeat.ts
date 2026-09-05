const API_BASE = "/api";

export interface HeartbeatSnapshotMeta {
  tick: number | null;
  timestamp: string | null;
}

export interface HeartbeatPulse {
  ready: number;
  inProgress: number;
  closed: number;
  open: number;
  total: number;
  blocked: number;
  gitChanges: number;
}

export interface HeartbeatWorkItem {
  status: string;
  id: string;
  priority: string;
  title: string;
}

export interface HeartbeatWorkQueue {
  readyItems: HeartbeatWorkItem[];
  inProgressItems: HeartbeatWorkItem[];
}

export interface HeartbeatGitOk {
  changedFiles: number;
  recentCommits: Array<{ hash: string; message: string }>;
  error?: undefined;
}

export interface HeartbeatGitError {
  error: string;
  changedFiles?: undefined;
  recentCommits?: undefined;
}

export type HeartbeatGit = HeartbeatGitOk | HeartbeatGitError;

export interface HeartbeatBrief {
  id: string;
  title: string;
}

export interface HeartbeatSnapshot {
  generatedAt: string;
  snapshot: HeartbeatSnapshotMeta;
  pulse: HeartbeatPulse;
  workQueue: HeartbeatWorkQueue;
  git: HeartbeatGit;
  handoffs: string[];
  journal: string[];
  cdoRounds: string[];
  briefs: HeartbeatBrief[];
}

export interface HeartbeatTimelineTick {
  tick: number;
  timestamp: string;
  beads_ready: number;
  beads_in_progress: number;
  beads_closed: number;
  git_changes: number;
  summary: string;
}

export interface HeartbeatTimeline {
  generatedAt: string;
  ticks: HeartbeatTimelineTick[];
  evolution: unknown[];
}

export async function fetchHeartbeat(): Promise<HeartbeatSnapshot> {
  const response = await fetch(`${API_BASE}/heartbeat`);
  if (!response.ok) {
    throw new Error(`Failed to fetch heartbeat: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchHeartbeatTimeline(): Promise<HeartbeatTimeline> {
  const response = await fetch(`${API_BASE}/heartbeat/timeline`);
  if (!response.ok) {
    throw new Error(`Failed to fetch heartbeat timeline: ${response.statusText}`);
  }
  return response.json();
}

export interface ResearchAdapter {
  name: string;
  available: boolean;
  capabilities?: string[];
  degradedReason?: string;
}

export interface ResearchAdaptersOk {
  adapters: ResearchAdapter[];
  counts: { available: number; total: number };
  error?: undefined;
}

export interface ResearchAdaptersError {
  error: string;
  adapters?: undefined;
  counts?: undefined;
}

export type ResearchStatus = ResearchAdaptersOk | ResearchAdaptersError;

export interface PluginInventoryItem {
  name: string;
  version: string | null;
  dir: string;
}

export interface PluginHealth {
  generatedAt: string;
  research: ResearchStatus;
  plugins: PluginInventoryItem[];
}

export async function fetchPluginHealth(): Promise<PluginHealth> {
  const response = await fetch(`${API_BASE}/heartbeat/plugins`);
  if (!response.ok) {
    throw new Error(`Failed to fetch plugin health: ${response.statusText}`);
  }
  return response.json();
}
