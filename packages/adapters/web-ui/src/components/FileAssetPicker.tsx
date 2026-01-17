/**
 * FileAssetPicker - Grid/list view to select files or assets
 */

import { useState } from 'react';
import './FileAssetPicker.css';

export interface FileAsset {
    id: string;
    name: string;
    type: 'file' | 'folder' | 'image' | 'document' | 'code';
    size?: string;
    preview?: string;
    path?: string;
}

interface FileAssetPickerProps {
    files: FileAsset[];
    selectedIds: string[];
    onSelect: (ids: string[]) => void;
    allowMultiple?: boolean;
    viewMode?: 'grid' | 'list';
    className?: string;
}

export function FileAssetPicker({
    files,
    selectedIds,
    onSelect,
    allowMultiple = true,
    viewMode = 'grid',
    className,
}: FileAssetPickerProps) {
    const [view, setView] = useState(viewMode);

    const getFileIcon = (type: FileAsset['type']) => {
        switch (type) {
            case 'folder': return '📁';
            case 'image': return '🖼️';
            case 'document': return '📄';
            case 'code': return '📝';
            default: return '📎';
        }
    };

    const handleSelect = (id: string) => {
        if (allowMultiple) {
            if (selectedIds.includes(id)) {
                onSelect(selectedIds.filter(i => i !== id));
            } else {
                onSelect([...selectedIds, id]);
            }
        } else {
            onSelect([id]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(id);
        }
    };

    return (
        <div className={`file-asset-picker file-picker-${view} ${className || ''}`}>
            <div className="file-picker-toolbar">
                <span className="file-picker-count">
                    {selectedIds.length} selected
                </span>
                <div className="file-picker-view-toggle">
                    <button
                        className={view === 'grid' ? 'active' : ''}
                        onClick={() => setView('grid')}
                        title="Grid View"
                    >
                        ⊞
                    </button>
                    <button
                        className={view === 'list' ? 'active' : ''}
                        onClick={() => setView('list')}
                        title="List View"
                    >
                        ☰
                    </button>
                </div>
            </div>

            <div className="file-picker-items" role="listbox" aria-multiselectable={allowMultiple}>
                {files.map((file) => {
                    const isSelected = selectedIds.includes(file.id);
                    return (
                        <div
                            key={file.id}
                            className={`file-item ${isSelected ? 'file-selected' : ''}`}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={0}
                            onClick={() => handleSelect(file.id)}
                            onKeyDown={(e) => handleKeyDown(e, file.id)}
                            style={{ position: 'relative' }}
                        >
                            {file.preview && view === 'grid' ? (
                                <img src={file.preview} alt={file.name} className="file-preview" />
                            ) : (
                                <span className="file-icon">{getFileIcon(file.type)}</span>
                            )}
                            <div className="file-info">
                                <span className="file-name">{file.name}</span>
                                {file.size && <span className="file-size">{file.size}</span>}
                            </div>
                            {isSelected && <span className="file-check">✓</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
