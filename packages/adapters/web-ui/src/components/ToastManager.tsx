import { useState, useEffect, useCallback } from 'react';
import './ToastManager.css';

export interface Toast {
    id: string;
    title?: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    duration?: number;
}

interface ToastManagerProps {
    // This component usually sits at app root, but we export a helper to manage state
    // For this primitive, we'll demonstrate a controlled component approach or a hook-based one.
    // Given the constraints, we'll make a functional component that accepts toasts to render.
    toasts: Toast[];
    onDismiss: (id: string) => void;
    className?: string;
}

export function ToastManager({ toasts, onDismiss, className = '' }: ToastManagerProps) {
    // Auto-dismiss logic handled by useEffect per toast
    useEffect(() => {
        toasts.forEach(toast => {
            if (toast.duration && toast.duration > 0) {
                const timer = setTimeout(() => {
                    onDismiss(toast.id);
                }, toast.duration);
                return () => clearTimeout(timer);
            }
        });
    }, [toasts, onDismiss]);

    const getIcon = (type: Toast['type']) => {
        switch (type) {
            case 'success': return '✓';
            case 'warning': return '⚠';
            case 'error': return '✗';
            case 'info': return 'ℹ';
        }
    };

    return (
        <div
            className={`toast-container ${className}`}
            role="region"
            aria-label="Notifications"
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast-item toast-${toast.type}`}
                    role="alert"
                    aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
                >
                    <div className="toast-content">
                        {toast.title && <div className="toast-title">{getIcon(toast.type)} {toast.title}</div>}
                        <div className="toast-message">{!toast.title && <span style={{ marginRight: 8 }}>{getIcon(toast.type)}</span>}{toast.message}</div>
                    </div>
                    <button
                        className="toast-close"
                        onClick={() => onDismiss(toast.id)}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
