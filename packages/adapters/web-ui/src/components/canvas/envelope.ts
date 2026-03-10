export interface SofiaWidgetProps {
  provider: "sofia";
  widgetId: string;
  variant?: string;
  data?: Record<string, unknown>;
}

export type LegacyCanvasInteractionPayload =
  | {
      type: "canvas_interaction";
      action: "render";
      componentType: "sofia-widget";
      componentName?: string;
      props: SofiaWidgetProps;
      instruction?: string;
    }
  | {
      type: "canvas_interaction";
      action: "selection";
      instruction?: string;
      selectionType?: string;
    };

export interface CanvasKanbanCard {
  id: string;
  title: string;
  column: string;
  priority?: "P0" | "P1" | "P2" | "P3";
  type?: string;
  blockedBy?: string[];
  blocks?: string[];
  description?: string;
  owner?: string;
}

export interface CanvasTodoItem {
  id: string;
  text: string;
  checked?: boolean;
  priority?: string;
}

export type CanvasSurfaceKind = "kanban" | "todo" | "markdown" | "unknown";

export interface CanvasSelectionEnvelope {
  kind: "selection";
  instruction: string;
  selectionType: string;
}

export interface CanvasSurfaceEnvelope {
  kind: "surface";
  surface: CanvasSurfaceKind;
  title?: string;
  meta: {
    source: "legacy-sofia-widget" | "local-host-envelope";
    widgetId?: string;
    variant?: string;
    componentName?: string;
  };
  data: Record<string, unknown>;
}

export interface CanvasErrorEnvelope {
  kind: "error";
  message: string;
  details: unknown;
}

export type CanvasEnvelope =
  | CanvasSelectionEnvelope
  | CanvasSurfaceEnvelope
  | CanvasErrorEnvelope;

export type CanvasHostEnvelopePayload =
  | {
      type: "canvas_interaction";
      action: "selection";
      componentType: "host-envelope";
      envelope: CanvasSelectionEnvelope;
    }
  | {
      type: "canvas_interaction";
      action: "render";
      componentType: "host-envelope";
      envelope: CanvasSurfaceEnvelope;
    };

export type CanvasInputPayload =
  | LegacyCanvasInteractionPayload
  | CanvasHostEnvelopePayload;

const PRIORITIES = new Set(["P0", "P1", "P2", "P3"]);

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const asStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string");
};

export function asKanbanCards(value: unknown): CanvasKanbanCard[] {
  const cards: CanvasKanbanCard[] = [];
  if (!Array.isArray(value)) return cards;

  for (const entry of value) {
    const item = asRecord(entry);
    const id = asString(item.id);
    const title = asString(item.title);
    const column = asString(item.column);
    if (!id || !title || !column) continue;

    const card: CanvasKanbanCard = { id, title, column };
    const priority = asString(item.priority);
    if (priority && PRIORITIES.has(priority)) {
      card.priority = priority as CanvasKanbanCard["priority"];
    }

    const type = asString(item.type);
    if (type) card.type = type;

    const blockedBy = asStringArray(item.blockedBy);
    if (blockedBy) card.blockedBy = blockedBy;

    const blocks = asStringArray(item.blocks);
    if (blocks) card.blocks = blocks;

    const description = asString(item.description);
    if (description) card.description = description;

    const owner = asString(item.owner);
    if (owner) card.owner = owner;

    cards.push(card);
  }

  return cards;
}

export function asTodoItems(value: unknown): CanvasTodoItem[] {
  const items: CanvasTodoItem[] = [];
  if (!Array.isArray(value)) return items;

  for (const entry of value) {
    const item = asRecord(entry);
    const id = asString(item.id);
    const text = asString(item.text);
    if (!id || !text) continue;

    const todo: CanvasTodoItem = { id, text };
    if (typeof item.checked === "boolean") todo.checked = item.checked;
    const priority = asString(item.priority);
    if (priority) todo.priority = priority;
    items.push(todo);
  }

  return items;
}

function resolveLegacySurface(widget: SofiaWidgetProps): CanvasSurfaceKind {
  const variant = widget.variant?.toLowerCase();
  const widgetId = widget.widgetId.toLowerCase();
  const kind = variant ?? widgetId;

  if (kind === "kanban" || kind === "bd-dashboard") return "kanban";
  if (kind === "todo" || kind === "todo-list" || kind === "todolist") {
    return "todo";
  }
  if (kind === "markdown" || kind === "markdown-card") return "markdown";
  return "unknown";
}

export function toCanvasEnvelope(payload: CanvasInputPayload): CanvasEnvelope {
  if ("componentType" in payload && payload.componentType === "host-envelope") {
    return payload.envelope;
  }

  if (!("componentType" in payload) && payload.action === "selection") {
    return {
      kind: "selection",
      instruction: payload.instruction ?? "Select an object on the canvas.",
      selectionType: payload.selectionType ?? "object",
    };
  }

  if (!("componentType" in payload)) {
    return {
      kind: "error",
      message: "Invalid canvas interaction payload.",
      details: payload,
    };
  }

  const { componentType, props } = payload;
  if (componentType !== "sofia-widget" || props.provider !== "sofia") {
    return {
      kind: "error",
      message: "Invalid Sofia payload contract.",
      details: payload,
    };
  }

  return {
    kind: "surface",
    surface: resolveLegacySurface(props),
    title: asString(props.data?.title),
    data: asRecord(props.data),
    meta: {
      source: "legacy-sofia-widget",
      widgetId: props.widgetId,
      variant: props.variant,
      componentName: payload.componentName,
    },
  };
}
