import React from 'react';
import './ModelSelector.css';

interface ModelOption {
    id: string;
    name: string;
    provider: string; // e.g., OpenAI, Anthropic
    capabilities: string[]; // e.g., ['vision', 'code']
    cost?: string; // e.g., '$$'
}

interface ModelSelectorProps {
    models: ModelOption[];
    selectedId: string;
    onSelect: (id: string) => void;
    className?: string;
}

export function ModelSelector({
    models,
    selectedId,
    onSelect,
    className = ''
}: ModelSelectorProps) {
    return (
        <div className={`model-selector ${className}`}>
            {models.map(model => {
                const isSelected = model.id === selectedId;
                return (
                    <div
                        key={model.id}
                        className={`model-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => onSelect(model.id)}
                    >
                        <div className="model-header">
                            <span className="model-name">{model.name}</span>
                            <span className="model-provider">{model.provider}</span>
                        </div>
                        <div className="model-tags">
                            {model.capabilities.map(cap => (
                                <span key={cap} className="model-tag">{cap}</span>
                            ))}
                            {model.cost && <span className="model-cost">{model.cost}</span>}
                        </div>
                        {isSelected && <div className="model-check">✓</div>}
                    </div>
                );
            })}
        </div>
    );
}
