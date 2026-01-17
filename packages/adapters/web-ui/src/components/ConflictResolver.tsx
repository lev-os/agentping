import React, { useState } from 'react';
import './ConflictResolver.css';

interface ConflictResolverProps {
    base: string;
    current: string;
    incoming: string;
    filename?: string;
}

export function ConflictResolver({ base, current, incoming, filename }: ConflictResolverProps) {
    const [resolution, setResolution] = useState<'current' | 'incoming' | 'both' | null>(null);

    return (
        <div className="conflict-resolver">
            <div className="cr-header">
                <span className="cr-file">{filename || 'Conflict'}</span>
                {resolution ? (
                    <span className="cr-status resolved">Resolved: {resolution.toUpperCase()}</span>
                ) : (
                    <span className="cr-status unresolved">Unresolved Conflict</span>
                )}
            </div>

            <div className="cr-grid">
                {/* Current Change (Left) */}
                <div className="cr-pane current">
                    <div className="cr-pane-header">
                        <span>Current Change</span>
                        <button onClick={() => setResolution('current')}>Accept Current</button>
                    </div>
                    <pre className="cr-code">{current}</pre>
                </div>

                {/* Incoming Change (Right) */}
                <div className="cr-pane incoming">
                    <div className="cr-pane-header">
                        <span>Incoming Change</span>
                        <button onClick={() => setResolution('incoming')}>Accept Incoming</button>
                    </div>
                    <pre className="cr-code">{incoming}</pre>
                </div>
            </div>

            {/* Result / Base */}
            <div className="cr-result">
                <div className="cr-pane-header">
                    <span>Result</span>
                    <button onClick={() => setResolution('both')}>Accept Both</button>
                </div>
                <pre className="cr-code result-code">
                    {resolution === 'current' ? current :
                        resolution === 'incoming' ? incoming :
                            resolution === 'both' ? `${current}\n${incoming}` :
                                base}
                </pre>
            </div>
        </div>
    );
}
