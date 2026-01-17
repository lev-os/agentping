import React, { useState } from 'react';
import './DraggableList.css';

interface DraggableItem {
    id: string;
    content: React.ReactNode;
}

interface DraggableListProps {
    items: DraggableItem[];
    onReorder: (items: DraggableItem[]) => void;
}

export function DraggableList({ items: initialItems, onReorder }: DraggableListProps) {
    const [items, setItems] = useState(initialItems);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedItem(id);
        e.dataTransfer.effectAllowed = 'move';
        // Transparent drag image hack if needed, or default
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetId) return;

        const draggedIdx = items.findIndex(i => i.id === draggedItem);
        const targetIdx = items.findIndex(i => i.id === targetId);

        if (draggedIdx === -1 || targetIdx === -1) return;

        const newItems = [...items];
        const [removed] = newItems.splice(draggedIdx, 1);
        newItems.splice(targetIdx, 0, removed);

        setItems(newItems);
        onReorder(newItems);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    return (
        <div className="draggable-list">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`draggable-item ${draggedItem === item.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDragEnd={handleDragEnd}
                >
                    <div className="drag-handle" aria-hidden="true">
                        ⋮⋮
                    </div>
                    {item.content}
                </div>
            ))}
        </div>
    );
}
