import { KanbanBoard } from './KanbanBoard';
import { TodoList } from './TodoList';
import { MarkdownCard } from './MarkdownCard';
import {
  asKanbanCards,
  asTodoItems,
  toCanvasEnvelope,
  type CanvasInputPayload,
} from './envelope';

interface CanvasRendererProps {
  payload: CanvasInputPayload;
  onRespond: (data: Record<string, unknown>) => void;
}

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export function CanvasRenderer({ payload, onRespond }: CanvasRendererProps) {
  const envelope = toCanvasEnvelope(payload);

  if (envelope.kind === 'selection') {
    return (
      <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4 space-y-3">
        <p className="font-mono text-sm text-[var(--warning)]">Canvas selection requested.</p>
        <p className="text-sm text-gray-300">
          {envelope.instruction}
        </p>
        <button
          type="button"
          className="rounded-md border border-[var(--primary)]/40 px-3 py-1.5 text-xs font-mono text-[var(--primary)] hover:bg-[var(--primary)]/10"
          onClick={() =>
            onRespond({
              action: 'selection_acknowledged',
              selectionType: envelope.selectionType,
            })
          }
        >
          Acknowledge
        </button>
      </div>
    );
  }

  if (envelope.kind === 'error') {
    return (
      <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4">
        <p className="font-mono text-sm text-[var(--warning)] mb-2">
          {envelope.message}
        </p>
        <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap break-all">
          {JSON.stringify(envelope.details, null, 2)}
        </pre>
      </div>
    );
  }

  const data = asRecord(envelope.data);

  if (envelope.surface === 'kanban') {
    return (
      <KanbanBoard
        columns={Array.isArray(data.columns) ? data.columns.filter((item): item is string => typeof item === 'string') : undefined}
        cards={asKanbanCards(data.cards)}
        onRespond={onRespond}
      />
    );
  }

  if (envelope.surface === 'todo') {
    return (
      <TodoList
        title={envelope.title ?? asString(data.title)}
        items={asTodoItems(data.items)}
        onRespond={onRespond}
      />
    );
  }

  if (envelope.surface === 'markdown') {
    return (
      <MarkdownCard
        title={envelope.title ?? asString(data.title)}
        content={asString(data.content)}
        onRespond={onRespond}
      />
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4">
      <p className="font-mono text-sm text-[var(--accent)] mb-2">
        Surface: {envelope.meta.widgetId ?? envelope.meta.componentName ?? envelope.surface}
      </p>
      <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap break-all">
        {JSON.stringify(
          {
            surface: envelope.surface,
            title: envelope.title,
            meta: envelope.meta,
            data,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
