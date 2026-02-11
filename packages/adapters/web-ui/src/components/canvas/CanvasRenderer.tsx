import { KanbanBoard } from './KanbanBoard';
import { TodoList } from './TodoList';
import { MarkdownCard } from './MarkdownCard';

interface SofiaWidgetProps {
  provider: 'sofia';
  widgetId: string;
  variant?: string;
  data?: Record<string, unknown>;
}

type CanvasInteractionPayload =
  | {
      type: 'canvas_interaction';
      action: 'render';
      componentType: 'sofia-widget';
      componentName?: string;
      props: SofiaWidgetProps;
      instruction?: string;
    }
  | {
      type: 'canvas_interaction';
      action: 'selection';
      instruction?: string;
      selectionType?: string;
    };

interface CanvasRendererProps {
  payload: CanvasInteractionPayload;
  onRespond: (data: Record<string, unknown>) => void;
}

interface KanbanCard {
  id: string;
  title: string;
  column: string;
  priority?: 'P0' | 'P1' | 'P2' | 'P3';
  type?: string;
  blockedBy?: string[];
  blocks?: string[];
  description?: string;
  owner?: string;
}

interface TodoItem {
  id: string;
  text: string;
  checked?: boolean;
  priority?: string;
}

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const asStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === 'string');
};

const asKanbanCards = (value: unknown): KanbanCard[] => {
  const cards: KanbanCard[] = [];
  if (!Array.isArray(value)) return cards;

  for (const entry of value) {
    const item = asRecord(entry);
    const id = asString(item.id);
    const title = asString(item.title);
    const column = asString(item.column);
    if (!id || !title || !column) continue;

    const card: KanbanCard = { id, title, column };
    const priority = asString(item.priority);
    if (priority === 'P0' || priority === 'P1' || priority === 'P2' || priority === 'P3') {
      card.priority = priority;
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
};

const asTodoItems = (value: unknown): TodoItem[] => {
  const items: TodoItem[] = [];
  if (!Array.isArray(value)) return items;

  for (const entry of value) {
    const item = asRecord(entry);
    const id = asString(item.id);
    const text = asString(item.text);
    if (!id || !text) continue;

    const todo: TodoItem = { id, text };
    if (typeof item.checked === 'boolean') todo.checked = item.checked;
    const priority = asString(item.priority);
    if (priority) todo.priority = priority;
    items.push(todo);
  }

  return items;
};

const resolveWidgetKind = (widget: SofiaWidgetProps): string => {
  const variant = widget.variant?.toLowerCase();
  const widgetId = widget.widgetId.toLowerCase();
  return variant ?? widgetId;
};

export function CanvasRenderer({ payload, onRespond }: CanvasRendererProps) {
  if (payload.action === 'selection') {
    return (
      <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4 space-y-3">
        <p className="font-mono text-sm text-[var(--warning)]">Canvas selection requested.</p>
        <p className="text-sm text-gray-300">
          {payload.instruction ?? 'Select an object on the canvas.'}
        </p>
        <button
          type="button"
          className="rounded-md border border-[var(--primary)]/40 px-3 py-1.5 text-xs font-mono text-[var(--primary)] hover:bg-[var(--primary)]/10"
          onClick={() =>
            onRespond({
              action: 'selection_acknowledged',
              selectionType: payload.selectionType ?? 'object',
            })
          }
        >
          Acknowledge
        </button>
      </div>
    );
  }

  const { componentType, props } = payload;
  if (componentType !== 'sofia-widget' || props.provider !== 'sofia') {
    return (
      <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4">
        <p className="font-mono text-sm text-[var(--warning)] mb-2">
          Invalid Sofia payload contract.
        </p>
        <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap break-all">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    );
  }

  const kind = resolveWidgetKind(props);
  const data = asRecord(props.data);

  if (kind === 'kanban' || kind === 'bd-dashboard') {
    return (
      <KanbanBoard
        columns={asStringArray(data.columns)}
        cards={asKanbanCards(data.cards)}
        onRespond={onRespond}
      />
    );
  }

  if (kind === 'todo' || kind === 'todo-list' || kind === 'todolist') {
    return (
      <TodoList
        title={asString(data.title)}
        items={asTodoItems(data.items)}
        onRespond={onRespond}
      />
    );
  }

  if (kind === 'markdown' || kind === 'markdown-card') {
    return (
      <MarkdownCard
        title={asString(data.title)}
        content={asString(data.content)}
        onRespond={onRespond}
      />
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4">
      <p className="font-mono text-sm text-[var(--accent)] mb-2">
        Sofia widget: {props.widgetId}
      </p>
      <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap break-all">
        {JSON.stringify(props.data ?? {}, null, 2)}
      </pre>
    </div>
  );
}
