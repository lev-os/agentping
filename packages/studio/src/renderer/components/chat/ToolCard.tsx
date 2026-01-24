/**
 * Tool Card Component
 *
 * Displays tool use, results, and approval UI for Claude's tool operations.
 * Enhanced with diff preview for Write/Edit tools.
 */

import { useState } from 'react';
import { FolderOpen, Plus, Sparkles, Terminal, CheckCircle, AlertTriangle, X, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { CopyButton, CodeDiffViewer } from '../ui';

export interface ToolInfo {
    type: string;
    name: string;
    input?: {
        path?: string;
        command?: string;
        pattern?: string;
        content?: string;
        file_path?: string;
    };
    content?: string;
    status?: 'pending_approval' | 'approved' | 'denied' | 'error' | 'success';
    id?: string;
    // NEW: For diff preview in approval UI
    originalContent?: string;
    proposedContent?: string;
    filePath?: string;
}

export interface ToolCardProps {
    tool: ToolInfo;
    onResolve?: (toolId: string, approved: boolean) => void;
}

const TOOL_INFO: Record<string, { icon: JSX.Element; label: string; color: string }> = {
    Read: { icon: <FolderOpen size={14} />, label: 'Reading file', color: 'var(--accent-primary)' },
    Write: { icon: <Plus size={14} />, label: 'Creating file', color: 'var(--status-success)' },
    Edit: { icon: <Sparkles size={14} />, label: 'Applying changes', color: 'var(--accent-secondary)' },
    Bash: { icon: <Terminal size={14} />, label: 'Running command', color: 'var(--text-primary)' },
    Glob: { icon: <Sparkles size={14} />, label: 'Searching project', color: 'var(--accent-primary)' },
    Grep: { icon: <Sparkles size={14} />, label: 'Searching project', color: 'var(--accent-primary)' },
};

function getToolInfo(name: string) {
    return TOOL_INFO[name] || {
        icon: <Terminal size={14} />,
        label: 'Executing tool',
        color: 'var(--text-tertiary)'
    };
}

function isHighRisk(name: string): boolean {
    return ['Bash', 'Write', 'Edit'].includes(name);
}

export function ToolCard({ tool, onResolve }: ToolCardProps) {
    const [showDiff, setShowDiff] = useState(true);
    const isResult = tool.type === 'tool_result';
    const isPending = tool.status === 'pending_approval';
    const { name, input } = tool;
    const info = getToolInfo(name);

    // Check if this tool has diff data for preview
    const hasFileChange = (name === 'Write' || name === 'Edit') &&
        tool.proposedContent !== undefined;

    // Tool result display
    if (isResult) {
        const isError = tool.status === 'error';
        return (
            <div className={`tool-card tool-result animate-in ${isError ? 'error' : 'success'}`}>
                <div className="tool-card-header">
                    <span
                        className="tool-icon"
                        style={{ color: isError ? 'var(--status-error)' : 'var(--status-success)' }}
                    >
                        {isError ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                    </span>
                    <span className="tool-label">
                        {isError ? 'Tool Failed' : 'Action Complete'}
                    </span>
                    {tool.content && (
                        <CopyButton text={tool.content} className="tool-copy-btn" />
                    )}
                </div>
                {tool.content && typeof tool.content === 'string' && (
                    <div className="tool-result-content">
                        <code>{tool.content.length > 300 ? `${tool.content.slice(0, 300)}...` : tool.content}</code>
                    </div>
                )}
            </div>
        );
    }

    // Tool call display
    const displayPath = input?.path || input?.file_path;
    const displayCommand = input?.command;
    const displayPattern = input?.pattern;

    return (
        <div className={`tool-card tool-call animate-in ${isPending ? 'pending' : ''}`}>
            <div className="tool-card-header">
                <span className="tool-icon" style={{ color: info.color }}>
                    {info.icon}
                </span>
                <span className="tool-label">
                    {isPending ? `Confirm ${name}` : info.label}
                </span>
                <div className="tool-card-meta">
                    <span className="tool-name">{name}</span>
                    <span className={`risk-tag risk-${isHighRisk(name) ? 'high' : 'low'}`}>
                        {isHighRisk(name) ? 'High Risk' : 'Standard'}
                    </span>
                </div>
            </div>

            {input && (
                <div className="tool-input-details">
                    {displayPath && (
                        <div className="detail-row">
                            <strong>Path:</strong>
                            <code>{displayPath}</code>
                            <CopyButton text={displayPath} size={12} />
                        </div>
                    )}
                    {displayCommand && (
                        <div className="detail-row">
                            <strong>Run:</strong>
                            <code>{displayCommand}</code>
                            <CopyButton text={displayCommand} size={12} />
                        </div>
                    )}
                    {displayPattern && (
                        <div className="detail-row">
                            <strong>Pattern:</strong>
                            <code>{displayPattern}</code>
                        </div>
                    )}
                </div>
            )}

            {/* Diff preview for Write/Edit tools when pending */}
            {isPending && hasFileChange && (
                <div className="tool-diff-section">
                    <button
                        className="diff-toggle-btn"
                        onClick={() => setShowDiff(!showDiff)}
                    >
                        {showDiff ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        <span>{showDiff ? 'Hide Changes' : 'Show Changes'}</span>
                    </button>
                    {showDiff && (
                        <div className="tool-diff-preview">
                            <CodeDiffViewer
                                oldCode={tool.originalContent || ''}
                                newCode={tool.proposedContent || ''}
                                filePath={tool.filePath}
                                maxHeight={250}
                                showHeader={false}
                            />
                        </div>
                    )}
                </div>
            )}

            {isPending && onResolve && tool.id && (
                <div className="tool-approval-actions">
                    <button
                        className="approve-btn"
                        onClick={() => onResolve(tool.id!, true)}
                        aria-label="Approve this action"
                    >
                        <CheckCircle size={14} />
                        <span>Approve</span>
                    </button>
                    <button
                        className="deny-btn"
                        onClick={() => onResolve(tool.id!, false)}
                        aria-label="Deny this action"
                    >
                        <X size={14} />
                        <span>Deny</span>
                    </button>
                </div>
            )}

            {tool.status === 'approved' && (
                <div className="tool-status approved">
                    <CheckCircle size={12} />
                    <span>Approved</span>
                </div>
            )}

            {tool.status === 'denied' && (
                <div className="tool-status denied">
                    <X size={12} />
                    <span>Denied</span>
                </div>
            )}
        </div>
    );
}
