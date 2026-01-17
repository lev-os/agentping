import React, { useState, useRef, useEffect } from 'react';
import './SplitView.css';

interface SplitViewProps {
    left: React.ReactNode;
    right: React.ReactNode;
    initialSplit?: number; // percentage
}

export function SplitView({ left, right, initialSplit = 50 }: SplitViewProps) {
    const [split, setSplit] = useState(initialSplit);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.min(90, Math.max(10, (x / rect.width) * 100));
            setSplit(percent);
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <div className="split-view" ref={containerRef}>
            <div className="split-pane" style={{ width: `${split}%` }}>
                {left}
            </div>
            <div
                className={`split-divider ${dragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                role="separator"
                aria-valuenow={split}
                aria-valuemin={10}
                aria-valuemax={90}
            />
            <div className="split-pane" style={{ flex: 1 }}>
                {right}
            </div>
        </div>
    );
}
