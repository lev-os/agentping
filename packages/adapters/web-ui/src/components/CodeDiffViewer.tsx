/**
 * CodeDiffViewer - Side-by-side or unified diff view for code review
 */

import { useMemo } from 'react';
import './CodeDiffViewer.css';

interface CodeDiffViewerProps {
    oldCode: string;
    newCode: string;
    language?: string;
    filePath?: string;
    mode?: 'unified' | 'split';
    className?: string;
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
}: CodeDiffViewerProps) {
    // Simple line-based diff (real apps would use a proper diff library)
    const diffLines = useMemo(() => {
        const oldLines = oldCode.split('\n');
        const newLines = newCode.split('\n');
        const result: DiffLine[] = [];

        let oldIdx = 0;
        let newIdx = 0;

        // Simple LCS-ish diff
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

    const handleCopy = () => {
        navigator.clipboard.writeText(newCode);
    };

    return (
        <div className={`code-diff-viewer diff-${mode} ${className || ''}`}>
            <div className="diff-header">
                <span className="diff-filepath">{filePath || 'Untitled'}</span>

                <div className="diff-actions">
                    <span className="diff-stats" style={{ marginRight: 16 }}>
                        <span className="diff-added">+{stats.added}</span>
                        <span className="diff-removed">-{stats.removed}</span>
                    </span>
                    <button className="diff-action-btn" onClick={handleCopy} title="Copy New Code">
                        Copy
                    </button>
                    {/* Placeholder for raw view toggle if needed */}
                    <button className="diff-action-btn" title="View Raw">
                        Raw
                    </button>
                </div>
            </div>
            <div className="diff-scroll-container">
                <pre className="diff-content" data-language={language}>
                    <code>
                        {diffLines.map((line, i) => (
                            <div key={i} className={`diff-line diff-line-${line.type}`}>
                                <span className="diff-line-num">
                                    {line.oldLineNum || ' '}
                                </span>
                                <span className="diff-line-num">
                                    {line.newLineNum || ' '}
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
        </div>
    );
}
