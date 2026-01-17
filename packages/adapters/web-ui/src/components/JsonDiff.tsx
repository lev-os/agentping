import React from 'react';
import './JsonDiff.css';

interface JsonDiffProps {
    oldJson: object;
    newJson: object;
    className?: string;
}

export function JsonDiff({ oldJson, newJson, className }: JsonDiffProps) {
    // Simply flattening implies small objects for this demo.
    // Real JSON diff is complex; this is a simplified visualizer logic.
    const keys = Array.from(new Set([...Object.keys(oldJson), ...Object.keys(newJson)])).sort();

    return (
        <div className={`json-diff-viewer ${className || ''}`}>
            <div className="json-diff-tree">
                {keys.map(key => {
                    const oldVal = (oldJson as any)[key];
                    const newVal = (newJson as any)[key];

                    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) {
                        return (
                            <div key={key} className="json-row unchanged">
                                <span className="json-key">{key}:</span>
                                <span className="json-val">{JSON.stringify(newVal)}</span>
                            </div>
                        );
                    }

                    return (
                        <React.Fragment key={key}>
                            {oldVal !== undefined && (
                                <div className="json-row removed">
                                    <span className="diff-marker">-</span>
                                    <span className="json-key">{key}:</span>
                                    <span className="json-val">{JSON.stringify(oldVal)}</span>
                                </div>
                            )}
                            {newVal !== undefined && (
                                <div className="json-row added">
                                    <span className="diff-marker">+</span>
                                    <span className="json-key">{key}:</span>
                                    <span className="json-val">{JSON.stringify(newVal)}</span>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
