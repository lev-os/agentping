import { ReactNode } from 'react';
import { Kbd } from './Kbd';

export interface TooltipProps {
    text: string;
    shortcut?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    visible?: boolean;
    children?: ReactNode;
}

export function Tooltip({ text, shortcut, position = 'bottom', visible = false }: TooltipProps) {
    const classes = [
        'ui-tooltip',
        `ui-tooltip--${position}`,
        visible && 'ui-tooltip--visible',
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} role="tooltip">
            <span>{text}</span>
            {shortcut && (
                <span className="ui-tooltip-shortcut">
                    <Kbd keys={shortcut} />
                </span>
            )}
        </div>
    );
}
