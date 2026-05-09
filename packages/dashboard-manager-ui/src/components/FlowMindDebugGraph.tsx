import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import type {
  FlowMindGraph,
  WorkflowGraphEdgeStyle,
  WorkflowGraphFrame,
  WorkflowGraphLane,
  WorkflowGraphNodeStatus,
  WorkflowGraphNodeView,
} from "../api/exec-traces";

interface FlowMindDebugGraphProps {
  graph: FlowMindGraph;
}

interface PositionedNode extends WorkflowGraphNodeView {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PositionedEdge {
  id: string;
  source: string;
  target: string;
  label: string | undefined;
  style: WorkflowGraphEdgeStyle;
  path: string;
}

const DEFAULT_LANES: WorkflowGraphLane[] = [
  "probabilistic",
  "boundary",
  "deterministic",
  "operator",
];

const NODE_WIDTH = 210;
const NODE_HEIGHT = 112;
const WAVE_WIDTH = 270;
const PAD_X = 72;
const PAD_Y = 58;
const FOLLOW_PADDING = 96;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function latestFrame(frames: WorkflowGraphFrame[]): WorkflowGraphFrame | undefined {
  return frames.length > 0 ? frames[frames.length - 1] : undefined;
}

function latestActiveFrame(frames: WorkflowGraphFrame[]): WorkflowGraphFrame | undefined {
  for (let index = frames.length - 1; index >= 0; index -= 1) {
    if (frames[index].activeNodeId) return frames[index];
  }
  return latestFrame(frames);
}

function previousActiveNodeId(
  frames: WorkflowGraphFrame[],
  frame: WorkflowGraphFrame | undefined,
): string | undefined {
  if (!frame) return undefined;
  const frameIndex = frames.findIndex((entry) => entry.index === frame.index);
  const startIndex = frameIndex >= 0 ? frameIndex - 1 : frames.length - 1;

  for (let index = startIndex; index >= 0; index -= 1) {
    if (frames[index].activeNodeId) return frames[index].activeNodeId;
  }
  return undefined;
}

function statusClass(status: WorkflowGraphNodeStatus): string {
  return `flowmind-debug-node--${status}`;
}

function edgeClass(style: WorkflowGraphEdgeStyle): string {
  return `flowmind-debug-edge--${style}`;
}

function nodePath(source: PositionedNode, target: PositionedNode): string {
  const forward = target.x >= source.x;
  const x1 = forward ? source.x + source.width : source.x + source.width / 2;
  const y1 = forward ? source.y + source.height / 2 : source.y + source.height;
  const x2 = forward ? target.x : target.x + target.width / 2;
  const y2 = forward ? target.y + target.height / 2 : target.y;

  if (!forward) {
    const midY = y1 + Math.max(40, (y2 - y1) / 2);
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  }

  const midX = x1 + Math.max(44, (x2 - x1) / 2);
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}

function buildLayout(graph: FlowMindGraph, frame?: WorkflowGraphFrame) {
  const laneOrder = graph.laneOrder?.length ? graph.laneOrder : DEFAULT_LANES;
  const laneIndex = new Map(laneOrder.map((lane, index) => [lane, index]));
  const maxWave = Math.max(0, ...graph.nodes.map((node) => node.wave));
  const stackCounts = new Map<string, number>();
  const laneMaxStack = new Map<WorkflowGraphLane, number>();

  for (const node of graph.nodes) {
    const key = `${node.lane}:${node.wave}`;
    const nextCount = (stackCounts.get(key) ?? 0) + 1;
    stackCounts.set(key, nextCount);
    laneMaxStack.set(node.lane, Math.max(laneMaxStack.get(node.lane) ?? 0, nextCount));
  }

  const laneHeights = laneOrder.map((lane) =>
    Math.max(180, (laneMaxStack.get(lane) ?? 1) * (NODE_HEIGHT + 18) + 58),
  );
  const laneTops = new Map<WorkflowGraphLane, number>();
  let yCursor = PAD_Y;
  laneOrder.forEach((lane, index) => {
    laneTops.set(lane, yCursor);
    yCursor += laneHeights[index];
  });

  const seen = new Map<string, number>();
  const nodes = [...graph.nodes]
    .sort((a, b) => a.wave - b.wave || (laneIndex.get(a.lane) ?? 99) - (laneIndex.get(b.lane) ?? 99) || a.id.localeCompare(b.id))
    .map((node) => {
      const key = `${node.lane}:${node.wave}`;
      const stackIndex = seen.get(key) ?? 0;
      seen.set(key, stackIndex + 1);
      return {
        ...node,
        x: PAD_X + node.wave * WAVE_WIDTH,
        y: (laneTops.get(node.lane) ?? PAD_Y) + 44 + stackIndex * (NODE_HEIGHT + 18),
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      };
    });

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const edges = graph.edges
    .filter((edge) => !edge.hidden)
    .map((edge) => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (!source || !target) return null;
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        style: edge.style,
        path: nodePath(source, target),
      };
    })
    .filter((edge): edge is PositionedEdge => edge !== null);

  const previousActive = previousActiveNodeId(graph.frames, frame);
  const activeNodeId = frame?.activeNodeId;
  const activeEdge =
    edges.find((edge) => previousActive && edge.source === previousActive && edge.target === activeNodeId) ??
    edges.find((edge) => edge.target === activeNodeId) ??
    edges.find((edge) => edge.source === activeNodeId);

  return {
    laneOrder,
    laneTops,
    laneHeights,
    nodes,
    edges,
    activeNodeId,
    activeEdgeId: activeEdge?.id,
    width: PAD_X * 2 + (maxWave + 1) * WAVE_WIDTH + NODE_WIDTH,
    height: yCursor + PAD_Y,
  };
}

export function FlowMindDebugGraph({ graph }: FlowMindDebugGraphProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [autoFollow, setAutoFollow] = useState(true);
  const frame = latestActiveFrame(graph.frames);
  const layout = useMemo(() => buildLayout(graph, frame), [graph, frame]);
  const markerId = useMemo(
    () => `flowmind-debug-arrow-${graph.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
    [graph.title],
  );

  function fitToViewport() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nextZoom = clamp(
      Math.min(
        (viewport.clientWidth - 48) / layout.width,
        (viewport.clientHeight - 48) / layout.height,
      ),
      0.35,
      1.15,
    );
    setZoom(Number(nextZoom.toFixed(2)));
  }

  useEffect(() => {
    fitToViewport();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => fitToViewport());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [layout.width, layout.height]);

  useEffect(() => {
    if (!autoFollow || !layout.activeNodeId) return;
    const viewport = viewportRef.current;
    const node = layout.nodes.find((entry) => entry.id === layout.activeNodeId);
    if (!viewport || !node) return;

    const left = Math.max(0, node.x * zoom - FOLLOW_PADDING);
    const top = Math.max(0, node.y * zoom - FOLLOW_PADDING);
    const right = (node.x + node.width) * zoom + FOLLOW_PADDING;
    const bottom = (node.y + node.height) * zoom + FOLLOW_PADDING;
    const visibleRight = viewport.scrollLeft + viewport.clientWidth;
    const visibleBottom = viewport.scrollTop + viewport.clientHeight;

    const nextLeft =
      left < viewport.scrollLeft
        ? left
        : right > visibleRight
          ? right - viewport.clientWidth
          : viewport.scrollLeft;
    const nextTop =
      top < viewport.scrollTop
        ? top
        : bottom > visibleBottom
          ? bottom - viewport.clientHeight
          : viewport.scrollTop;

    viewport.scrollTo({
      left: Math.max(0, nextLeft),
      top: Math.max(0, nextTop),
      behavior: "smooth",
    });
  }, [autoFollow, layout.activeNodeId, layout.nodes, zoom]);

  const statuses = frame?.nodeStatuses ?? {};

  return (
    <div className="flowmind-debug-graph">
      <div className="flowmind-debug-graph__toolbar">
        <div>
          <div className="flowmind-debug-graph__eyebrow">Inline FlowMind graph</div>
          <div className="flowmind-debug-graph__current">
            Current node: <code>{layout.activeNodeId ?? "none"}</code>
          </div>
        </div>
        <div className="flowmind-debug-graph__controls" aria-label="Graph zoom controls">
          <button type="button" onClick={() => setZoom((value) => clamp(Number((value + 0.12).toFixed(2)), 0.35, 1.8))}>
            +
          </button>
          <button type="button" onClick={() => setZoom((value) => clamp(Number((value - 0.12).toFixed(2)), 0.35, 1.8))}>
            -
          </button>
          <button type="button" onClick={() => setZoom(1)}>100%</button>
          <button type="button" onClick={fitToViewport}>Auto-fit</button>
          <button
            type="button"
            className={autoFollow ? "is-active" : ""}
            onClick={() => setAutoFollow((value) => !value)}
          >
            Follow current
          </button>
        </div>
      </div>

      <div ref={viewportRef} className="flowmind-debug-graph__viewport">
        <div
          className="flowmind-debug-graph__scaled"
          style={{
            width: layout.width * zoom,
            height: layout.height * zoom,
          }}
        >
          <motion.div
            className="flowmind-debug-graph__board"
            style={{
              width: layout.width,
              height: layout.height,
              transform: `scale(${zoom})`,
            }}
          >
            {layout.laneOrder.map((lane, index) => (
              <div
                key={lane}
                className={`flowmind-debug-lane flowmind-debug-lane--${lane}`}
                style={{
                  top: layout.laneTops.get(lane),
                  height: layout.laneHeights[index],
                }}
              >
                <span>{lane}</span>
              </div>
            ))}

            <svg
              className="flowmind-debug-graph__svg"
              width={layout.width}
              height={layout.height}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
            >
              <defs>
                <marker id={markerId} markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L11,4 z" />
                </marker>
              </defs>
              {layout.edges.map((edge) => (
                <motion.path
                  key={edge.id}
                  d={edge.path}
                  markerEnd={`url(#${markerId})`}
                  className={[
                    "flowmind-debug-edge",
                    edgeClass(edge.style),
                    edge.id === layout.activeEdgeId ? "is-active" : "",
                  ].join(" ")}
                  initial={{ pathLength: 0.45, opacity: 0.45 }}
                  animate={{
                    pathLength: edge.id === layout.activeEdgeId ? [0.35, 1, 0.65] : 1,
                    opacity: edge.id === layout.activeEdgeId ? [0.68, 1, 0.78] : 0.72,
                  }}
                  transition={{
                    duration: edge.id === layout.activeEdgeId ? 1.6 : 0.5,
                    repeat: edge.id === layout.activeEdgeId ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>

            <div className="flowmind-debug-graph__nodes">
              {layout.nodes.map((node) => {
                const status = statuses[node.id] ?? node.status;
                const isActive = node.id === layout.activeNodeId;
                return (
                  <motion.div
                    key={node.id}
                    className={[
                      "flowmind-debug-node",
                      statusClass(status),
                      isActive ? "is-current" : "",
                    ].join(" ")}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      minHeight: node.height,
                    }}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isActive ? 1.035 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  >
                    <div className="flowmind-debug-node__topline">
                      <span>{node.kind}</span>
                      <span>W{node.wave}</span>
                    </div>
                    <div className="flowmind-debug-node__label">{node.label}</div>
                    <div className="flowmind-debug-node__summary">{node.summary}</div>
                    <div className="flowmind-debug-node__footer">
                      <span>{node.id}</span>
                      <span>{status}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
