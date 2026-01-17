import { useState } from 'react';
import './TransferList.css';

interface TransferListProps {
    leftTitle?: string;
    rightTitle?: string;
    items: { id: string; label: string }[];
    onChange: (leftIds: string[], rightIds: string[]) => void;
    leftIds: string[];
    rightIds: string[];
}

export function TransferList({
    leftTitle = 'Available',
    rightTitle = 'Selected',
    items,
    onChange,
    leftIds,
    rightIds
}: TransferListProps) {
    const [checkedLeft, setCheckedLeft] = useState<string[]>([]);
    const [checkedRight, setCheckedRight] = useState<string[]>([]);

    const handleToggle = (id: string, side: 'left' | 'right') => {
        if (side === 'left') {
            setCheckedLeft(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        } else {
            setCheckedRight(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        }
    };

    const moveRight = () => {
        const newRight = [...rightIds, ...checkedLeft];
        const newLeft = leftIds.filter(id => !checkedLeft.includes(id));
        onChange(newLeft, newRight);
        setCheckedLeft([]);
    };

    const moveLeft = () => {
        const newLeft = [...leftIds, ...checkedRight];
        const newRight = rightIds.filter(id => !checkedRight.includes(id));
        onChange(newLeft, newRight);
        setCheckedRight([]);
    };

    const moveAllRight = () => {
        onChange([], items.map(i => i.id));
        setCheckedLeft([]);
    };

    const moveAllLeft = () => {
        onChange(items.map(i => i.id), []);
        setCheckedRight([]);
    };

    const renderList = (ids: string[], side: 'left' | 'right') => (
        <div className="transfer-list-box">
            <div className="transfer-list-header">
                {side === 'left' ? leftTitle : rightTitle}
                <span className="transfer-count">{ids.length}</span>
            </div>
            <div className="transfer-list-content">
                {ids.map(id => {
                    const item = items.find(i => i.id === id);
                    if (!item) return null;
                    const isChecked = side === 'left' ? checkedLeft.includes(id) : checkedRight.includes(id);
                    return (
                        <div
                            key={id}
                            className={`transfer-item ${isChecked ? 'checked' : ''}`}
                            onClick={() => handleToggle(id, side)}
                        >
                            <div className="transfer-checkbox">{isChecked && '✓'}</div>
                            {item.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="transfer-list-container">
            {renderList(leftIds, 'left')}
            <div className="transfer-controls">
                <button className="transfer-btn" onClick={moveAllRight} title="Move all right">≫</button>
                <button className="transfer-btn" onClick={moveRight} disabled={checkedLeft.length === 0}>&gt;</button>
                <button className="transfer-btn" onClick={moveLeft} disabled={checkedRight.length === 0}>&lt;</button>
                <button className="transfer-btn" onClick={moveAllLeft} title="Move all left">≪</button>
            </div>
            {renderList(rightIds, 'right')}
        </div>
    );
}
