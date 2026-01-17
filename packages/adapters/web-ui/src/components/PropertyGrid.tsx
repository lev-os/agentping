import React, { useState } from 'react';
import './PropertyGrid.css';

interface PropertyGridProps {
    data: Record<string, any>;
    onChange?: (key: string, value: any) => void;
}

export function PropertyGrid({ data, onChange }: PropertyGridProps) {
    return (
        <div className="property-grid" role="table" aria-label="Properties">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="prop-row" role="row">
                    <div className="prop-key" role="rowheader" title={key}>{key}</div>
                    <div className={`prop-value ${onChange ? 'editable' : ''}`} role="cell">
                        {onChange ? (
                            <input
                                className="prop-input"
                                value={value}
                                onChange={(e) => onChange(key, e.target.value)}
                                aria-label={`Value for ${key}`}
                            />
                        ) : (
                            <span>{String(value)}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
