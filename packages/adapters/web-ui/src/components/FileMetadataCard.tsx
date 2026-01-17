import React from 'react';
import './FileMetadataCard.css';

interface FileMetadata {
    name: string;
    path: string;
    size: string;
    created: string;
    modified: string;
    type: string;
    permissions: string;
    mime: string;
}

interface FileMetadataCardProps {
    file: FileMetadata;
    className?: string;
}

export function FileMetadataCard({ file, className }: FileMetadataCardProps) {
    const getIcon = (type: string) => {
        if (type.includes('image')) return '🖼️';
        if (type.includes('code')) return '📝';
        if (type.includes('pdf')) return '📄';
        return '📎';
    };

    return (
        <div className={`file-metadata-card ${className || ''}`}>
            <div className="fm-header">
                <span className="fm-icon">{getIcon(file.type)}</span>
                <div className="fm-title">
                    <span className="fm-name">{file.name}</span>
                    <span className="fm-path">{file.path}</span>
                </div>
            </div>

            <div className="fm-grid">
                <div className="fm-item">
                    <span className="fm-label">Size</span>
                    <span className="fm-value">{file.size}</span>
                </div>
                <div className="fm-item">
                    <span className="fm-label">Type</span>
                    <span className="fm-value">{file.type}</span>
                </div>
                <div className="fm-item">
                    <span className="fm-label">MIME</span>
                    <span className="fm-value">{file.mime}</span>
                </div>
                <div className="fm-item">
                    <span className="fm-label">Permissions</span>
                    <span className="fm-value mono">{file.permissions}</span>
                </div>
                <div className="fm-item full">
                    <span className="fm-label">Modified</span>
                    <span className="fm-value">{file.modified}</span>
                </div>
                <div className="fm-item full">
                    <span className="fm-label">Created</span>
                    <span className="fm-value">{file.created}</span>
                </div>
            </div>

            <div className="fm-actions">
                <button>Open</button>
                <button>Download</button>
                <button className="danger">Delete</button>
            </div>
        </div>
    );
}
