/**
 * ApprovalQueue Component
 *
 * Floating panel that displays all pending tool approvals with:
 * - Batch accept/reject all buttons
 * - Individual accept/reject per item
 * - Inline diff preview for Write/Edit tools
 * - Command preview for Bash tools
 */

import { useState, useEffect } from 'react';
import { CheckCircle, X, ChevronDown, ChevronUp, FileText, Terminal, FilePlus } from 'lucide-react';
import { CodeDiffViewer } from './ui/CodeDiffViewer';
import type { ApprovalRequest } from '../global.d';
import './ApprovalQueue.css';

interface ApprovalQueueProps {
    sessionId: string | null;
}

export function ApprovalQueue({ sessionId }: ApprovalQueueProps) {
    const [queue, setQueue] = useState<ApprovalRequest[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    // Sync with backend queue
    useEffect(() => {
        if (!sessionId || !window.claudeCode) return;

        // Initial load
        window.claudeCode.getApprovalQueue(sessionId).then((items) => {
            setQueue(items);
            // Auto-expand first item
            if (items.length > 0) {
                setExpandedItems(new Set([items[0].toolCallId]));
            }
        });

        // Listen for new approvals
        const unsubQueued = window.claudeCode.onApprovalQueued(({ sessionId: sid, request }) => {
            if (sid === sessionId) {
                setQueue(prev => [...prev, request]);
                // Auto-expand new items
                setExpandedItems(prev => new Set([...prev, request.toolCallId]));
            }
        });

        // Listen for resolved approvals
        const unsubResolved = window.claudeCode.onApprovalResolved(({ sessionId: sid, toolId }) => {
            if (sid === sessionId) {
                setQueue(prev => prev.filter(r => r.toolCallId !== toolId));
                setExpandedItems(prev => {
                    const next = new Set(prev);
                    next.delete(toolId);
                    return next;
                });
            }
        });

        return () => {
            unsubQueued();
            unsubResolved();
        };
    }, [sessionId]);

    const handleApprove = async (toolId: string) => {
        if (!sessionId) return;
        await window.claudeCode.resolveApproval(sessionId, toolId, true);
    };

    const handleDeny = async (toolId: string) => {
        if (!sessionId) return;
        await window.claudeCode.resolveApproval(sessionId, toolId, false);
    };

    const handleApproveAll = async () => {
        if (!sessionId) return;
        await window.claudeCode.resolveAllApprovals(sessionId, true);
    };

    const handleDenyAll = async () => {
        if (!sessionId) return;
        await window.claudeCode.resolveAllApprovals(sessionId, false);
    };

    const toggleItem = (toolId: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(toolId)) {
                next.delete(toolId);
            } else {
                next.add(toolId);
            }
            return next;
        });
    };

    // Don't render if no pending approvals
    if (queue.length === 0) return null;

    return (
        <div className="approval-queue">
            <div className="queue-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="queue-title">
                    <span className="queue-count">{queue.length}</span>
                    <span>Pending Approval{queue.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="queue-batch-actions" onClick={e => e.stopPropagation()}>
                    <button
                        className="batch-approve-btn"
                        onClick={handleApproveAll}
                        title="Accept all pending changes"
                    >
                        <CheckCircle size={14} />
                        <span>Accept All</span>
                    </button>
                    <button
                        className="batch-deny-btn"
                        onClick={handleDenyAll}
                        title="Reject all pending changes"
                    >
                        <X size={14} />
                        <span>Reject All</span>
                    </button>
                </div>

                <button className="expand-toggle">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {isExpanded && (
                <div className="queue-items">
                    {queue.map((item) => (
                        <ApprovalQueueItem
                            key={item.toolCallId}
                            item={item}
                            isExpanded={expandedItems.has(item.toolCallId)}
                            onToggle={() => toggleItem(item.toolCallId)}
                            onApprove={() => handleApprove(item.toolCallId)}
                            onDeny={() => handleDeny(item.toolCallId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface ApprovalQueueItemProps {
    item: ApprovalRequest;
    isExpanded: boolean;
    onToggle: () => void;
    onApprove: () => void;
    onDeny: () => void;
}

function ApprovalQueueItem({
    item,
    isExpanded,
    onToggle,
    onApprove,
    onDeny,
}: ApprovalQueueItemProps) {
    const isFileChange = item.name === 'Write' || item.name === 'Edit';
    const isBash = item.name === 'Bash';
    const isNewFile = isFileChange && !item.originalContent;

    const getIcon = () => {
        if (isNewFile) return <FilePlus size={14} />;
        if (isFileChange) return <FileText size={14} />;
        return <Terminal size={14} />;
    };

    const getLabel = () => {
        if (item.name === 'Write') return isNewFile ? 'Create' : 'Write';
        if (item.name === 'Edit') return 'Edit';
        return item.name;
    };

    const getPath = () => {
        if (item.filePath) {
            // Show just filename for brevity
            return item.filePath.split('/').pop() || item.filePath;
        }
        if (item.input?.command) {
            // Truncate long commands
            const cmd = item.input.command;
            return cmd.length > 50 ? cmd.slice(0, 47) + '...' : cmd;
        }
        return 'Unknown';
    };

    return (
        <div className={`queue-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="queue-item-header" onClick={onToggle}>
                <span className={`item-icon ${item.name.toLowerCase()}`}>
                    {getIcon()}
                </span>
                <span className="item-label">{getLabel()}</span>
                <span className="item-path" title={item.filePath || item.input?.command}>
                    {getPath()}
                </span>

                <div className="item-actions" onClick={e => e.stopPropagation()}>
                    <button
                        className="item-approve"
                        onClick={onApprove}
                        title="Accept this change"
                    >
                        <CheckCircle size={14} />
                    </button>
                    <button
                        className="item-deny"
                        onClick={onDeny}
                        title="Reject this change"
                    >
                        <X size={14} />
                    </button>
                </div>

                <span className="item-expand-icon">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
            </div>

            {isExpanded && isFileChange && (
                <div className="queue-item-diff">
                    <CodeDiffViewer
                        oldCode={item.originalContent || ''}
                        newCode={item.proposedContent || ''}
                        filePath={item.filePath}
                        maxHeight={300}
                        showHeader={false}
                    />
                </div>
            )}

            {isExpanded && isBash && (
                <div className="queue-item-command">
                    <pre>
                        <code>$ {item.input?.command}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}
