import { KanbanBoard } from './KanbanBoard';
import { TodoList } from './TodoList';
import { MarkdownCard } from './MarkdownCard';

interface CanvasRendererProps {
  componentType?: string;
  props?: Record<string, unknown>;
  onRespond: (data: Record<string, unknown>) => void;
}

const COMPONENT_MAP: Record<
  string,
  React.ComponentType<{ onRespond: (data: Record<string, unknown>) => void } & Record<string, unknown>>
> = {
  kanban: KanbanBoard as never,
  todolist: TodoList as never,
  markdown: MarkdownCard as never,
};

export function CanvasRenderer({ componentType, props = {}, onRespond }: CanvasRendererProps) {
  if (!componentType) {
    return (
      <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4 text-gray-500 font-mono text-sm">
        No component type specified.
      </div>
    );
  }

  const Component = COMPONENT_MAP[componentType];

  if (!Component) {
    return (
      <div className="rounded-xl border border-gray-800 backdrop-blur-md p-4">
        <p className="font-mono text-sm text-[var(--warning)] mb-2">
          Unknown component: {componentType}
        </p>
        <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap break-all">
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
    );
  }

  return <Component {...props} onRespond={onRespond} />;
}
