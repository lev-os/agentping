/**
 * FileViewer Component
 * 
 * Displays file contents with syntax highlighting and preview mode for web files.
 */

import { useState, useEffect } from 'react';
import { Code, Eye, X, FileText, Clock, HardDrive, Copy, Check, ExternalLink } from 'lucide-react';
import './FileViewer.css';

interface FileViewerProps {
    filePath: string | null;
    onClose: () => void;
    revision?: number;
}

interface FileData {
    content: string;
    fileName: string;
    extension: string;
    size: number;
    modifiedAt: string;
}

// Map file extensions to language names for syntax display
const EXTENSION_LABELS: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript React',
    js: 'JavaScript',
    jsx: 'JavaScript React',
    py: 'Python',
    css: 'CSS',
    scss: 'SCSS',
    html: 'HTML',
    json: 'JSON',
    md: 'Markdown',
    yaml: 'YAML',
    yml: 'YAML',
    sh: 'Shell',
    bash: 'Bash',
    sql: 'SQL',
    graphql: 'GraphQL',
    rs: 'Rust',
    go: 'Go',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    swift: 'Swift',
    rb: 'Ruby',
    php: 'PHP',
    vue: 'Vue',
    svelte: 'Svelte',
};

// Extensions that can be previewed in an iframe
const PREVIEWABLE_EXTENSIONS = ['html', 'htm'];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function FileViewer({ filePath, onClose, revision = 0 }: FileViewerProps) {
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!filePath) {
            setFileData(null);
            return;
        }

        let isMounted = true;
        const loadFile = async () => {
            if (!window.fileSystem) {
                setError('File system not available');
                return;
            }

            // Only show loading spinner on initial load to avoid flicker during agent typing
            if (revision === 0) setIsLoading(true);
            setError(null);

            const result = await window.fileSystem.readFile(filePath);

            if (!isMounted) return;

            if (!result.success || !result.content) {
                setError(result.error || 'Failed to read file');
                setIsLoading(false);
                return;
            }

            // Only update data if content actually changed to avoid unnecessary re-renders
            if (!fileData || fileData.content !== result.content) {
                setFileData({
                    content: result.content,
                    fileName: result.fileName || filePath.split('/').pop() || 'Unknown',
                    extension: result.extension || '',
                    size: result.size || 0,
                    modifiedAt: result.modifiedAt || new Date().toISOString()
                });

                // Auto-switch to preview for HTML files only on first load
                if (revision === 0 && PREVIEWABLE_EXTENSIONS.includes(result.extension || '')) {
                    setViewMode('preview');
                }
            }

            setIsLoading(false);
        };

        // If it's a revision update (agent editing), wait a bit to aggregate changes
        const timer = setTimeout(loadFile, revision === 0 ? 0 : 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [filePath, revision]);

    const handleCopy = async () => {
        if (!fileData) return;
        await navigator.clipboard.writeText(fileData.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!filePath) {
        return (
            <div className="file-viewer file-viewer-empty">
                <div className="empty-state">
                    <FileText size={48} strokeWidth={1} />
                    <h3>No File Selected</h3>
                    <p>Click a file in the explorer to view its contents</p>
                </div>
            </div>
        );
    }

    const canPreview = fileData && PREVIEWABLE_EXTENSIONS.includes(fileData.extension);
    const languageLabel = fileData ? (EXTENSION_LABELS[fileData.extension] || fileData.extension.toUpperCase()) : '';

    return (
        <div className="file-viewer">
            {/* Header */}
            <div className="file-viewer-header">
                <div className="file-info">
                    <FileText size={16} className="file-icon" />
                    <span className="file-name">{fileData?.fileName || 'Loading...'}</span>
                    {fileData && (
                        <span className="file-badge">{languageLabel}</span>
                    )}
                </div>

                <div className="file-actions">
                    {/* View Mode Toggle */}
                    {canPreview && (
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`}
                                onClick={() => setViewMode('code')}
                                title="View Code"
                            >
                                <Code size={14} />
                                <span>Code</span>
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                                onClick={() => setViewMode('preview')}
                                title="Preview"
                            >
                                <Eye size={14} />
                                <span>Preview</span>
                            </button>
                        </div>
                    )}

                    <button className="action-btn" onClick={handleCopy} title="Copy to clipboard">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>

                    <button className="action-btn close-btn" onClick={onClose} title="Close">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* File Metadata Bar */}
            {fileData && (
                <div className="file-meta">
                    <span className="meta-item">
                        <HardDrive size={10} />
                        {formatFileSize(fileData.size)}
                    </span>
                    <span className="meta-item">
                        <Clock size={10} />
                        {formatDate(fileData.modifiedAt)}
                    </span>
                    <span className="meta-item file-path" title={filePath}>
                        {filePath}
                    </span>
                </div>
            )}

            {/* Content Area */}
            <div className="file-viewer-content">
                {isLoading && (
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <span>Loading file...</span>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <span className="error-icon">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {fileData && !isLoading && !error && (
                    viewMode === 'code' ? (
                        <div className="code-container custom-scrollbar">
                            <pre className="code-block">
                                <code className={`language-${fileData.extension}`}>
                                    {fileData.content.split('\n').map((line, i) => (
                                        <div key={i} className="code-line">
                                            <span className="line-number">{i + 1}</span>
                                            <span className="line-content">{line || ' '}</span>
                                        </div>
                                    ))}
                                </code>
                            </pre>
                        </div>
                    ) : (
                        <div className="preview-container">
                            <iframe
                                srcDoc={fileData.content}
                                title="File Preview"
                                sandbox="allow-scripts"
                                className="preview-frame"
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
