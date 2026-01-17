import React from 'react';
import './ToolInvocation.css';

interface ToolInvocationProps {
    toolName: string;
    args: Record<string, any>;
    status?: 'pending' | 'running' | 'completed' | 'failed';
    result?: string;
    timestamp?: string;
    className?: string;
}

export function ToolInvocation({
    toolName,
    args,
    status = 'pending',
    result,
    timestamp,
    className = ''
}: ToolInvocationProps) {
    return (
        <div className={`tool-invocation status-${status} ${className}`}>
            <div className="tool-header">
                <div className="tool-identity">
                    <span className="tool-icon">⚡</span>
                    <span className="tool-name">{toolName}</span>
                </div>
                <div className="tool-meta">
                    {timestamp && <span className="tool-time">{timestamp}</span>}
                    <span className="tool-status">{status}</span>
                </div>
            </div>

            <div className="tool-body">
                <div className="tool-section">
                    <div className="section-label">Input</div>
                    <pre className="code-block">{JSON.stringify(args, null, 2)}</pre>
                </div>

                {result && (
                    <div className="tool-section">
                        <div className="section-label">Output</div>
                        <pre className="code-block result">{result}</pre>
                    </div>
                )}
            </div>

            {status === 'running' && <div className="tool-loader" />}
        </div>
    );
}
