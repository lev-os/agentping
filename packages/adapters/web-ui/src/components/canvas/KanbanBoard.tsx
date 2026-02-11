import { useState, type DragEvent } from 'react';

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

interface KanbanProps {
  columns?: string[];
  cards?: KanbanCard[];
  onRespond: (data: Record<string, unknown>) => void;
}

const DEFAULT_COLUMNS = ['open', 'in_progress', 'blocked', 'closed'];

const PRIORITY_STYLES: Record<string, string> = {
  P0: 'bg-[var(--danger)]/20 text-[var(--danger)] border-[var(--danger)]/40',
  P1: 'bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/40',
  P2: 'bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/40',
  P3: 'bg-gray-700/30 text-gray-400 border-gray-600/40',
};

const TYPE_LABELS: Record<string, string> = {
  epic: 'Epic',
  task: 'Task',
  bug: 'Bug',
};

function columnLabel(col: string): string {
  return col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function KanbanBoard({
  columns = DEFAULT_COLUMNS,
  cards = [],
  onRespond,
}: KanbanProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dragCardId, setDragCardId] = useState<string | null>(null);

  const cardsByColumn = (col: string) => cards.filter((c) => c.column === col);

  const handleDragStart = (e: DragEvent, card: KanbanCard) => {
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
    setDragCardId(card.id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent, toColumn: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.column === toColumn) {
      setDragCardId(null);
      return;
    }
    onRespond({
      action: 'move',
      cardId,
      fromColumn: card.column,
      toColumn,
    });
    setDragCardId(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((col) => {
        const colCards = cardsByColumn(col);

        return (
          <div
            key={col}
            className="bg-[var(--bg-secondary)] rounded-xl p-3 min-h-[200px] flex-1 min-w-[220px] flex flex-col gap-2"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400">
                {columnLabel(col)}
              </h3>
              <span className="bg-gray-800 text-gray-400 text-xs font-mono rounded-full px-2 py-0.5">
                {colCards.length}
              </span>
            </div>

            {/* Cards */}
            {colCards.map((card) => {
              const isExpanded = expandedId === card.id;
              const isDragging = dragCardId === card.id;

              return (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card)}
                  onDragEnd={() => setDragCardId(null)}
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                  className={`
                    bg-[var(--bg-tertiary,#111)] border border-[var(--glass-border,#222)]
                    rounded-lg p-3 cursor-grab active:cursor-grabbing
                    hover:border-[var(--primary)]/30 transition-colors
                    ${isDragging ? 'opacity-40' : ''}
                  `}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-mono text-sm text-cyan-400 shrink-0">
                      {card.id}
                    </span>

                    <div className="flex gap-1 flex-wrap justify-end">
                      {card.priority && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[card.priority] ?? PRIORITY_STYLES.P3}`}
                        >
                          {card.priority}
                        </span>
                      )}
                      {card.type && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800/60 text-gray-400 border border-gray-700/40">
                          {TYPE_LABELS[card.type] ?? card.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <p className="text-sm text-gray-200 leading-snug">{card.title}</p>

                  {/* Blocked-by badge */}
                  {card.blockedBy && card.blockedBy.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[var(--danger)] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)]" />
                      {card.blockedBy.length} blocker{card.blockedBy.length > 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Owner */}
                  {card.owner && (
                    <p className="mt-1 text-[10px] text-gray-500 font-mono truncate">
                      {card.owner}
                    </p>
                  )}

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                      {card.description && (
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {card.description}
                        </p>
                      )}

                      {card.blockedBy && card.blockedBy.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                            Blocked by
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {card.blockedBy.map((id) => (
                              <span
                                key={id}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20"
                              >
                                {id}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {card.blocks && card.blocks.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                            Blocks
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {card.blocks.map((id) => (
                              <span
                                key={id}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20"
                              >
                                {id}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {colCards.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-gray-600 font-mono">Empty</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
