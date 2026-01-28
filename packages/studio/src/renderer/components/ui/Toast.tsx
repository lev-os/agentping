import { ReactNode, useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastProps {
    id?: string;
    variant?: ToastVariant;
    title?: string;
    message: string;
    duration?: number;
    onClose?: () => void;
    icon?: ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    closable?: boolean;
}

const VARIANT_STYLES: Record<ToastVariant, { icon: ReactNode; className: string }> = {
    success: {
        icon: <CheckCircle size={20} />,
        className: 'ui-toast--success',
    },
    error: {
        icon: <XCircle size={20} />,
        className: 'ui-toast--error',
    },
    warning: {
        icon: <AlertTriangle size={20} />,
        className: 'ui-toast--warning',
    },
    info: {
        icon: <Info size={20} />,
        className: 'ui-toast--info',
    },
};

export function Toast({
    variant = 'info',
    title,
    message,
    duration = 5000,
    onClose,
    icon,
    action,
    closable = true,
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300); // Match animation duration
    };

    if (!isVisible) return null;

    const variantConfig = VARIANT_STYLES[variant];

    return (
        <div
            className={`ui-toast ${variantConfig.className} ${isExiting ? 'ui-toast--exiting' : ''}`}
            role="alert"
            aria-live="polite"
        >
            <div className="ui-toast-icon">
                {icon || variantConfig.icon}
            </div>
            <div className="ui-toast-content">
                {title && <div className="ui-toast-title">{title}</div>}
                <div className="ui-toast-message">{message}</div>
                {action && (
                    <button
                        className="ui-toast-action"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </button>
                )}
            </div>
            {closable && (
                <button
                    className="ui-toast-close"
                    onClick={handleClose}
                    aria-label="Close notification"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}

export interface ToastContainerProps {
    position?: ToastPosition;
    children: ReactNode;
}

export function ToastContainer({ position = 'top-right', children }: ToastContainerProps) {
    return (
        <div className={`ui-toast-container ui-toast-container--${position}`}>
            {children}
        </div>
    );
}

// Hook for managing toasts (optional - for programmatic usage)
export interface ToastOptions extends Omit<ToastProps, 'id' | 'onClose'> {
    id?: string;
}

let toastIdCounter = 0;

export function createToastId(): string {
    return `toast-${++toastIdCounter}`;
}
