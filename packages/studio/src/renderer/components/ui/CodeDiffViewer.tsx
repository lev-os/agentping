/**
 * CodeDiffViewer - Unified diff view for code review in approval workflow
 *
 * Shows before/after comparison with line-by-line diff highlighting.
 * Supports collapsible mode for inline use in ToolCard.
 */

import { useMemo, useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import './CodeDiffViewer.css';

interface CodeDiffViewerProps {
    oldCode: string;
    newCode: string;
    language?: string;
    filePath?: string;
    mode?: 'unified' | 'split';
    className?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    maxHeight?: number;
    showHeader?: boolean;
}

interface DiffLine {
    type: 'add' | 'remove' | 'unchanged';
    content: string;
    oldLineNum?: number;
    newLineNum?: number;
}

export function CodeDiffViewer({
    oldCode,
    newCode,
    language = 'plaintext',
    filePath,
    mode = 'unified',
    className,
    collapsible = false,
    defaultCollapsed = false,
    maxHeight,
    showHeader = true,
}: CodeDiffViewerProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [copied, setCopied] = useState(false);

    // Simple line-based diff using LCS-ish algorithm
    const diffLines = useMemo(() => {
        const oldLines = oldCode.split('\n');
        const newLines = newCode.split('\n');
        const result: DiffLine[] = [];

        let oldIdx = 0;
        let newIdx = 0;

        while (oldIdx < oldLines.length || newIdx < newLines.length) {
            if (oldIdx >= oldLines.length) {
                result.push({ type: 'add', content: newLines[newIdx], newLineNum: newIdx + 1 });
                newIdx++;
            } else if (newIdx >= newLines.length) {
                result.push({ type: 'remove', content: oldLines[oldIdx], oldLineNum: oldIdx + 1 });
                oldIdx++;
            } else if (oldLines[oldIdx] === newLines[newIdx]) {
                result.push({
                    type: 'unchanged',
                    content: oldLines[oldIdx],
                    oldLineNum: oldIdx + 1,
                    newLineNum: newIdx + 1,
                });
                oldIdx++;
                newIdx++;
            } else {
                // Check if next old line matches current new (insertion)
                if (oldIdx + 1 < oldLines.length && oldLines[oldIdx + 1] === newLines[newIdx]) {
                    result.push({ type: 'remove', content: oldLines[oldIdx], oldLineNum: oldIdx + 1 });
                    oldIdx++;
                }
                // Check if next new line matches current old (deletion)
                else if (newIdx + 1 < newLines.length && oldLines[oldIdx] === newLines[newIdx + 1]) {
                    result.push({ type: 'add', content: newLines[newIdx], newLineNum: newIdx + 1 });
                    newIdx++;
                } else {
                    // Replace
                    result.push({ type: 'remove', content: oldLines[oldIdx], oldLineNum: oldIdx + 1 });
                    result.push({ type: 'add', content: newLines[newIdx], newLineNum: newIdx + 1 });
                    oldIdx++;
                    newIdx++;
                }
            }
        }

        return result;
    }, [oldCode, newCode]);

    const stats = useMemo(() => {
        const added = diffLines.filter(l => l.type === 'add').length;
        const removed = diffLines.filter(l => l.type === 'remove').length;
        return { added, removed };
    }, [diffLines]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(newCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fileName = filePath?.split('/').pop() || 'Untitled';

    return (
        <div className={`code-diff-viewer diff-${mode} ${className || ''}`}>
            {showHeader && (
                <div
                    className={`diff-header ${collapsible ? 'clickable' : ''}`}
                    onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
                >
                    <div className="diff-header-left">
                        {collapsible && (
                            <span className="diff-collapse-icon">
                                {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                            </span>
                        )}
                        <span className="diff-filepath" title={filePath}>
                            {fileName}
                        </span>
                        <span className="diff-stats">
                            <span className="diff-added">+{stats.added}</span>
                            <span className="diff-removed">-{stats.removed}</span>
                        </span>
                    </div>

                    <div className="diff-actions" onClick={e => e.stopPropagation()}>
                        <button
                            className="diff-action-btn"
                            onClick={handleCopy}
                            title="Copy new code"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>
            )}

            {!isCollapsed && (
                <div
                    className="diff-scroll-container"
                    style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
                >
                    <pre className="diff-content" data-language={language}>
                        <code>
                            {diffLines.map((line, i) => (
                                <div key={i} className={`diff-line diff-line-${line.type}`}>
                                    <span className="diff-line-num old">
                                        {line.oldLineNum || ''}
                                    </span>
                                    <span className="diff-line-num new">
                                        {line.newLineNum || ''}
                                    </span>
                                    <span className="diff-line-prefix">
                                        {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                                    </span>
                                    <span className="diff-line-content">{line.content || ' '}</span>
                                </div>
                            ))}
                        </code>
                    </pre>
                </div>
            )}
        </div>
    );
}
