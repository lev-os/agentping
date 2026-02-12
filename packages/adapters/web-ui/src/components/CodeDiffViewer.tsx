/**
 * CodeDiffViewer - Side-by-side or unified diff view for code review
 */

import { useMemo } from 'react';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@kingly/ui/components';

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
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            void navigator.clipboard.writeText(newCode);
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <CardTitle className="text-sm">{filePath || 'Untitled'}</CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {language} • {mode}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="success" className="font-mono">
                            +{stats.added}
                        </Badge>
                        <Badge variant="destructive" className="font-mono">
                            -{stats.removed}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={handleCopy} title="Copy new code">
                            Copy
                        </Button>
                        <Button variant="ghost" size="sm" title="View raw (not implemented)" disabled>
                            Raw
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <pre
                    data-language={language}
                    className="max-h-[360px] overflow-auto rounded-md border bg-background/60 p-3 text-xs"
                >
                    <code>
                        {diffLines.map((line, i) => (
                            <div
                                key={i}
                                className={[
                                    'grid grid-cols-[56px_56px_18px_1fr] gap-2 px-1 py-0.5 font-mono',
                                    line.type === 'add' ? 'bg-emerald-500/10' : '',
                                    line.type === 'remove' ? 'bg-red-500/10' : ''
                                ].join(' ')}
                            >
                                <span className="text-muted-foreground">
                                    {line.oldLineNum || ' '}
                                </span>
                                <span className="text-muted-foreground">
                                    {line.newLineNum || ' '}
                                </span>
                                <span
                                    className={
                                        line.type === 'add'
                                            ? 'text-emerald-500'
                                            : line.type === 'remove'
                                                ? 'text-red-500'
                                                : 'text-muted-foreground'
                                    }
                                >
                                    {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                                </span>
                                <span>{line.content || ' '}</span>
                            </div>
                        ))}
                    </code>
                </pre>
            </CardContent>
        </Card>
    );
}
