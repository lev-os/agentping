/**
 * CodeDiffViewer - Studio adapter over @kingly/ui migration exports.
 */

import { useMemo, useState, type ComponentType } from 'react';
import * as KinglyComponents from '@kingly/ui/components';
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

interface MigrationCodeDiffViewerProps {
    before: string;
    after: string;
    title?: string;
    className?: string;
}

const migrationComponents = KinglyComponents as Record<string, unknown>;
const CodeDiffViewerCandidate = migrationComponents.CodeDiffViewerCandidate as ComponentType<MigrationCodeDiffViewerProps> | undefined;
const CodeDiffViewerBase = migrationComponents.CodeDiffViewer as ComponentType<Record<string, unknown>> | undefined;

function toFileName(filePath?: string) {
    return filePath?.split('/').pop() || 'Untitled';
}

function countLineChanges(oldCode: string, newCode: string) {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const maxLength = Math.max(oldLines.length, newLines.length);

    let added = 0;
    let removed = 0;
    for (let index = 0; index < maxLength; index += 1) {
        const before = oldLines[index];
        const after = newLines[index];
        if (before === undefined && after !== undefined) {
            added += 1;
            continue;
        }
        if (before !== undefined && after === undefined) {
            removed += 1;
            continue;
        }
        if (before !== after) {
            added += 1;
            removed += 1;
        }
    }

    return { added, removed };
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

    const fileName = toFileName(filePath);
    const stats = useMemo(() => countLineChanges(oldCode, newCode), [oldCode, newCode]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(newCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const diffBody = CodeDiffViewerCandidate ? (
        <CodeDiffViewerCandidate
            before={oldCode}
            after={newCode}
            title={fileName}
            className="ui-code-diff-candidate"
        />
    ) : CodeDiffViewerBase ? (
        <CodeDiffViewerBase
            {...{
                before: oldCode,
                after: newCode,
                oldCode,
                newCode,
                language,
                filePath,
                mode,
                className: 'ui-code-diff-base',
            }}
        />
    ) : (
        <pre className="diff-content" data-language={language}>
            <code>{newCode}</code>
        </pre>
    );

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

                    <div className="diff-actions" onClick={(event) => event.stopPropagation()}>
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
                    {diffBody}
                </div>
            )}
        </div>
    );
}
