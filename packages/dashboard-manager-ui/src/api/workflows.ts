import { parse } from "yaml";

export type WorkflowGroup = "system" | "plugin" | "example" | "project";

export interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  description?: string;
  terminal: boolean;
  level: number;
  order: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  kind: "next" | "branch" | "then" | "target" | "fallback" | "implicit";
}

export interface WorkflowEntry {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sourcePath: string;
  group: WorkflowGroup;
  entryNodeId?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  nodeCount: number;
  edgeCount: number;
  maxLevel: number;
}

interface NormalizedNode {
  id: string;
  label: string;
  type: string;
  description?: string;
  terminal: boolean;
  order: number;
}

type RawRecord = Record<string, unknown>;

const RAW_WORKFLOW_MODULES = {
  ...import.meta.glob(
    "../../../../../../core/flowmind/system/*.flow.yaml",
    { eager: true, query: "?raw", import: "default" },
  ),
  ...import.meta.glob(
    "../../../../../../core/flowmind/examples/**/*.flow.yaml",
    { eager: true, query: "?raw", import: "default" },
  ),
  ...import.meta.glob(
    "../../../../../../plugins/*/flows/**/*.flow.yaml",
    { eager: true, query: "?raw", import: "default" },
  ),
  ...import.meta.glob(
    "../../../../../../.lev/flows/**/*.flow.yaml",
    { eager: true, query: "?raw", import: "default" },
  ),
} as Record<string, string>;

function isObject(value: unknown): value is RawRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function humanize(value: string): string {
  return value
    .replace(/\.flow\.ya?ml$/i, "")
    .replace(/[_/]+/g, " ")
    .replace(/-/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function inferNodeType(node: RawRecord): string {
  const directType = asString(node.type);
  if (directType) return directType;
  if (node.terminal === true) return "terminal";
  if (node.eval || node.branches) return "gate";
  if (node.prompt) return "agent";
  if (node.op) return "function";
  if (node.flow || node.subgraph_ref) return "subgraph";
  if (node.invoke) return "workflow";
  if (node.command) return "exec";
  return "node";
}

function normalizePath(path: string): string {
  return path.replace(/^(\.\.\/)+/, "");
}

function groupForPath(path: string): WorkflowGroup {
  if (path.startsWith("core/flowmind/system/")) return "system";
  if (path.startsWith("plugins/")) return "plugin";
  if (path.startsWith("core/flowmind/examples/")) return "example";
  return "project";
}

function slugForPath(path: string): string {
  const normalized = normalizePath(path)
    .replace(/\.flow\.ya?ml$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  if (normalized.startsWith("core-flowmind-system-")) {
    return `system-${normalized.replace(/^core-flowmind-system-/, "")}`;
  }
  if (normalized.startsWith("core-flowmind-examples-")) {
    return `example-${normalized.replace(/^core-flowmind-examples-/, "")}`;
  }
  if (normalized.startsWith("plugins-")) {
    return `plugin-${normalized.replace(/^plugins-/, "")}`;
  }
  if (normalized.startsWith("lev-flows-")) {
    return `project-${normalized.replace(/^lev-flows-/, "")}`;
  }
  return normalized;
}

function collectTargets(
  sourceId: string,
  node: RawRecord,
  validIds: Set<string>,
): WorkflowEdge[] {
  const edges: WorkflowEdge[] = [];
  const seen = new Set<string>();

  function pushTarget(target: unknown, kind: WorkflowEdge["kind"], label?: string) {
    if (typeof target !== "string" || !validIds.has(target)) return;
    const key = `${sourceId}:${kind}:${label ?? ""}:${target}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({
      id: key,
      source: sourceId,
      target,
      label,
      kind,
    });
  }

  pushTarget(node.next, "next");
  pushTarget(node.target, "target");
  pushTarget(node.on_failure, "fallback", "failure");
  pushTarget(node.on_timeout, "fallback", "timeout");

  if (Array.isArray(node.targets)) {
    for (const target of node.targets) pushTarget(target, "target");
  }

  if (isObject(node.then)) {
    pushTarget(node.then.ref, "then");
    for (const [label, target] of Object.entries(node.then)) {
      pushTarget(target, "then", label);
    }
  } else {
    pushTarget(node.then, "then");
  }

  if (isObject(node.branches)) {
    for (const [label, target] of Object.entries(node.branches)) {
      pushTarget(target, "branch", label);
    }
  }

  if (isObject(node.routes)) {
    for (const [label, target] of Object.entries(node.routes)) {
      pushTarget(target, "branch", label);
    }
  }

  return edges;
}

function normalizeNode(id: string, node: RawRecord, order: number): NormalizedNode {
  return {
    id,
    label: asString(node.name) ?? humanize(id),
    type: inferNodeType(node),
    description:
      asString(node.description) ??
      asString(node.action) ??
      asString(node.prompt) ??
      asString(node.command),
    terminal: node.terminal === true || asString(node.type) === "terminal",
    order,
  };
}

function parseNodeMap(rawNodes: RawRecord): {
  nodes: NormalizedNode[];
  nodeRecords: Map<string, RawRecord>;
} {
  const nodes: NormalizedNode[] = [];
  const nodeRecords = new Map<string, RawRecord>();

  for (const [id, value] of Object.entries(rawNodes)) {
    if (!isObject(value)) continue;
    nodes.push(normalizeNode(id, value, nodes.length));
    nodeRecords.set(id, value);
  }

  return { nodes, nodeRecords };
}

function parseNodeArray(rawNodes: unknown[]): {
  nodes: NormalizedNode[];
  nodeRecords: Map<string, RawRecord>;
} {
  const nodes: NormalizedNode[] = [];
  const nodeRecords = new Map<string, RawRecord>();

  rawNodes.forEach((value, index) => {
    if (!isObject(value)) return;
    const id = asString(value.id) ?? `node-${index + 1}`;
    nodes.push(normalizeNode(id, value, index));
    nodeRecords.set(id, value);
  });

  return { nodes, nodeRecords };
}

function parseSteps(rawSteps: unknown[]): {
  nodes: NormalizedNode[];
  nodeRecords: Map<string, RawRecord>;
  edges: WorkflowEdge[];
} {
  const nodes: NormalizedNode[] = [];
  const nodeRecords = new Map<string, RawRecord>();
  const edges: WorkflowEdge[] = [];

  rawSteps.forEach((value, index) => {
    if (!isObject(value)) return;
    const id = asString(value.id) ?? `step-${index + 1}`;
    const terminal = value.terminal === true;
    nodes.push({
      id,
      label: asString(value.name) ?? humanize(id),
      type: terminal ? "terminal" : asString(value.op) ?? "step",
      description:
        asString(value.description) ??
        asString(value.command) ??
        asString(value.action),
      terminal,
      order: index,
    });
    nodeRecords.set(id, value);

    if (index > 0) {
      const previous = nodes[index - 1];
      edges.push({
        id: `${previous.id}:implicit:${id}`,
        source: previous.id,
        target: id,
        kind: "implicit",
      });
    }
  });

  return { nodes, nodeRecords, edges };
}

function assignLevels(
  nodes: NormalizedNode[],
  edges: WorkflowEdge[],
  entryNodeId?: string,
): WorkflowNode[] {
  if (nodes.length === 0) return [];

  const ids = new Set(nodes.map((node) => node.id));
  const outgoing = new Map<string, string[]>();
  const levels = new Map<string, number>();

  for (const edge of edges) {
    if (!ids.has(edge.source) || !ids.has(edge.target)) continue;
    const list = outgoing.get(edge.source) ?? [];
    list.push(edge.target);
    outgoing.set(edge.source, list);
  }

  const initialId = entryNodeId && ids.has(entryNodeId) ? entryNodeId : nodes[0].id;
  const queue: string[] = [initialId];
  levels.set(initialId, 0);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels.get(current) ?? 0;
    const targets = outgoing.get(current) ?? [];
    for (const target of targets) {
      const proposed = currentLevel + 1;
      const existing = levels.get(target);
      if (existing === undefined || proposed < existing) {
        levels.set(target, proposed);
        queue.push(target);
      }
    }
  }

  let maxLevel = Math.max(...levels.values(), 0);
  for (const node of [...nodes].sort((a, b) => a.order - b.order)) {
    if (!levels.has(node.id)) {
      maxLevel += 1;
      levels.set(node.id, maxLevel);
    }
  }

  return nodes.map((node) => ({
    ...node,
    level: levels.get(node.id) ?? 0,
  }));
}

function normalizeEntry(path: string, raw: string): WorkflowEntry | null {
  let parsed: unknown;
  try {
    parsed = parse(raw);
  } catch {
    return null;
  }
  if (!isObject(parsed)) return null;

  const normalizedPath = normalizePath(path);
  const group = groupForPath(normalizedPath);
  const meta = isObject(parsed.meta) ? parsed.meta : undefined;

  let nodes: NormalizedNode[] = [];
  let nodeRecords = new Map<string, RawRecord>();
  let edges: WorkflowEdge[] = [];
  let entryNodeId = asString(parsed.entry);

  if (isObject(parsed.nodes)) {
    ({ nodes, nodeRecords } = parseNodeMap(parsed.nodes));
  } else if (Array.isArray(parsed.nodes)) {
    ({ nodes, nodeRecords } = parseNodeArray(parsed.nodes));
  } else if (Array.isArray(parsed.steps)) {
    ({ nodes, nodeRecords, edges } = parseSteps(parsed.steps));
  }

  if (nodes.length === 0) return null;

  const validIds = new Set(nodes.map((node) => node.id));
  for (const node of nodes) {
    const record = nodeRecords.get(node.id);
    if (!record) continue;
    edges.push(...collectTargets(node.id, record, validIds));
  }

  if (edges.length === 0 && nodes.length > 1) {
    for (let index = 1; index < nodes.length; index += 1) {
      const previous = nodes[index - 1];
      const current = nodes[index];
      edges.push({
        id: `${previous.id}:implicit:${current.id}`,
        source: previous.id,
        target: current.id,
        kind: "implicit",
      });
    }
  }

  const workflowNodes = assignLevels(nodes, edges, entryNodeId);
  const maxLevel = Math.max(...workflowNodes.map((node) => node.level), 0);
  const title =
    asString(parsed.name) ??
    asString(meta?.name) ??
    humanize(normalizedPath.split("/").pop() ?? normalizedPath);

  if (!entryNodeId) {
    entryNodeId = workflowNodes.slice().sort((a, b) => a.order - b.order)[0]?.id;
  }

  const slug = slugForPath(normalizedPath);

  return {
    id: slug,
    slug,
    title,
    description: asString(parsed.description) ?? asString(meta?.description),
    sourcePath: normalizedPath,
    group,
    entryNodeId,
    nodes: workflowNodes.sort((a, b) => a.level - b.level || a.order - b.order),
    edges,
    nodeCount: workflowNodes.length,
    edgeCount: edges.length,
    maxLevel,
  };
}

function groupRank(group: WorkflowGroup): number {
  switch (group) {
    case "system":
      return 0;
    case "plugin":
      return 1;
    case "example":
      return 2;
    case "project":
      return 3;
  }
}

export function getWorkflowEntries(): WorkflowEntry[] {
  return Object.entries(RAW_WORKFLOW_MODULES)
    .map(([path, raw]) => normalizeEntry(path, raw))
    .filter((entry): entry is WorkflowEntry => entry !== null)
    .sort((a, b) => {
      const groupDelta = groupRank(a.group) - groupRank(b.group);
      if (groupDelta !== 0) return groupDelta;
      const pathDelta = a.sourcePath.localeCompare(b.sourcePath);
      if (pathDelta !== 0) return pathDelta;
      return a.title.localeCompare(b.title);
    });
}
