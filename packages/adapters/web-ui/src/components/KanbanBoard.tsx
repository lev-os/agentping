import React, { useState } from 'react';
import './KanbanBoard.css';

interface KanbanItem {
    id: string;
    title: string;
    tags?: string[];
}

interface KanbanColumn {
    id: string;
    title: string;
    items: KanbanItem[];
}

interface KanbanBoardProps {
    columns: KanbanColumn[];
    onDragEnd?: (itemId: string, sourceCol: string, destCol: string) => void;
}

export function KanbanBoard({ columns: initialColumns, onDragEnd }: KanbanBoardProps) {
    const [columns] = useState(initialColumns);

    return (
        <div className="kanban-board" role="region" aria-label="Kanban Board">
            {columns.map(col => (
                <div key={col.id} className="kanban-column">
                    <div className="kanban-column-header">
                        <h3>{col.title}</h3>
                        <span className="kanban-column-count">{col.items.length}</span>
                    </div>
                    <div className="kanban-items" role="list" aria-label={`${col.title} items`}>
                        {col.items.map(item => (
                            <div
                                key={item.id}
                                className="kanban-card"
                                role="listitem"
                                draggable
                                aria-label={item.title}
                            >
                                <div className="kanban-card-title">{item.title}</div>
                                {item.tags && (
                                    <div className="kanban-card-tags">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="kanban-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
