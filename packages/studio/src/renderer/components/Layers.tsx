import { useState, useEffect } from 'react';
import { Layers as LayersIcon, Eye, EyeOff, Lock, Unlock, Trash2, GripVertical, Square, Circle, Type, Package } from 'lucide-react';
import './Layers.css';

interface LayerItem {
    id: string;
    name: string;
    type: string;
    visible: boolean;
    locked: boolean;
}

interface LayersProps {
    canvasObjects?: LayerItem[];
    onSelectLayer?: (id: string) => void;
    onToggleVisibility?: (id: string, visible: boolean) => void;
    onToggleLock?: (id: string, locked: boolean) => void;
    onDeleteLayer?: (id: string) => void;
    onReorderLayers?: (layers: LayerItem[]) => void;
    selectedLayerId?: string | null;
}

export function Layers({
    canvasObjects,
    onSelectLayer,
    onToggleVisibility,
    onToggleLock,
    onDeleteLayer,
    onReorderLayers,
    selectedLayerId
}: LayersProps) {
    // Use canvas objects if provided, otherwise show empty state
    const layers = canvasObjects || [];
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        if (draggedId && draggedId !== id) {
            setDragOverId(id);
        }
    };

    const handleDragEnd = () => {
        if (draggedId && dragOverId && draggedId !== dragOverId && onReorderLayers) {
            const newLayers = [...layers];
            const draggedIndex = newLayers.findIndex(l => l.id === draggedId);
            const dropIndex = newLayers.findIndex(l => l.id === dragOverId);

            if (draggedIndex !== -1 && dropIndex !== -1) {
                const [removed] = newLayers.splice(draggedIndex, 1);
                newLayers.splice(dropIndex, 0, removed);
                onReorderLayers(newLayers);
            }
        }
        setDraggedId(null);
        setDragOverId(null);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'rect':
            case 'rectangle':
                return <Square size={12} />;
            case 'ellipse':
            case 'circle':
                return <Circle size={12} />;
            case 'i-text':
            case 'text':
                return <Type size={12} />;
            case 'group':
            case 'component':
                return <Package size={12} />;
            default:
                return <Square size={12} />;
        }
    };

    return (
        <div className="layers-panel">
            <div className="layers-header">
                <div className="header-title">
                    <LayersIcon size={16} className="text-accent-secondary" />
                    <h2>Layers</h2>
                </div>
                <span className="layer-count">{layers.length}</span>
            </div>

            <div className="layers-content">
                {layers.length === 0 ? (
                    <div className="layers-empty">
                        <p>No objects on canvas</p>
                        <span>Use drawing tools or drag components to add layers</span>
                    </div>
                ) : (
                    layers.map(layer => (
                        <div
                            key={layer.id}
                            className={`layer-item ${!layer.visible ? 'hidden' : ''} ${selectedLayerId === layer.id ? 'selected' : ''} ${dragOverId === layer.id ? 'drag-over' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, layer.id)}
                            onDragOver={(e) => handleDragOver(e, layer.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onSelectLayer?.(layer.id)}
                        >
                            <div className="layer-drag-handle">
                                <GripVertical size={12} />
                            </div>
                            <div className="layer-main">
                                <span className="layer-type-icon">
                                    {getTypeIcon(layer.type)}
                                </span>
                                <span className="layer-name" title={layer.name}>
                                    {layer.name || `${layer.type}-${layer.id.slice(0, 4)}`}
                                </span>
                            </div>
                            <div className="layer-actions">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleVisibility?.(layer.id, !layer.visible);
                                    }}
                                    title="Toggle Visibility"
                                    className={layer.visible ? '' : 'inactive'}
                                >
                                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleLock?.(layer.id, !layer.locked);
                                    }}
                                    title="Toggle Lock"
                                    className={layer.locked ? 'active' : ''}
                                >
                                    {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteLayer?.(layer.id);
                                    }}
                                    title="Delete Layer"
                                    className="delete-btn"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
