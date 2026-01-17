/**
 * InlineTutorialTooltip - Contextual help bubbles anchored to elements
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './InlineTutorialTooltip.css';

interface InlineTutorialTooltipProps {
    targetSelector?: string;
    targetRef?: React.RefObject<HTMLElement>;
    content: string;
    title?: string;
    onDismiss: () => void;
    onNeverShow?: () => void;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export function InlineTutorialTooltip({
    targetSelector,
    targetRef,
    content,
    title,
    onDismiss,
    onNeverShow,
    position = 'bottom',
    className,
}: InlineTutorialTooltipProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [visible, setVisible] = useState(false);

    const updatePosition = useCallback(() => {
        const target = targetRef?.current || (targetSelector ? document.querySelector(targetSelector) : null);
        if (!target || !tooltipRef.current) return;

        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const padding = 12; // Increased padding
        const arrowSize = 6;

        let top = 0;
        let left = 0;

        // Add scroll offsets since we are rendering into body with position: absolute
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Effective target center
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - padding + scrollY;
                left = targetCenterX - tooltipRect.width / 2 + scrollX;
                break;
            case 'bottom':
                top = rect.bottom + padding + scrollY;
                left = targetCenterX - tooltipRect.width / 2 + scrollX;
                break;
            case 'left':
                top = targetCenterY - tooltipRect.height / 2 + scrollY;
                left = rect.left - tooltipRect.width - padding + scrollX;
                break;
            case 'right':
                top = targetCenterY - tooltipRect.height / 2 + scrollY;
                left = rect.right + padding + scrollX;
                break;
        }

        // Prevent overflow (Simple clamping, ideal would be pivoting)
        // We only clamp horizontal for now to keep it simple
        const docWidth = document.documentElement.scrollWidth;
        left = Math.max(8, Math.min(left, docWidth - tooltipRect.width - 8));

        setCoords({ top, left });
        setVisible(true);
    }, [targetSelector, targetRef, position]);

    useEffect(() => {
        // Initial measurement needs a slight delay for render
        const timeout = setTimeout(updatePosition, 0);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [updatePosition]);

    const tooltip = (
        <div
            ref={tooltipRef}
            className={`tutorial-tooltip tooltip-${position} ${visible ? 'tooltip-visible' : ''} ${className || ''}`}
            style={{ top: coords.top, left: coords.left }}
            role="tooltip"
        >
            <div className={`tooltip-arrow arrow-${position}`} aria-hidden="true" />
            {title && <div className="tooltip-title">{title}</div>}
            <div className="tooltip-content">{content}</div>
            <div className="tooltip-actions">
                <button className="btn-ghost-sm" onClick={onDismiss} aria-label="Dismiss tutorial">Got it</button>
                {onNeverShow && (
                    <button className="btn-ghost-sm tooltip-never" onClick={onNeverShow}>
                        Don't show again
                    </button>
                )}
            </div>
        </div>
    );

    return createPortal(tooltip, document.body);
}
