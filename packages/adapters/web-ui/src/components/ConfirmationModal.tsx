/**
 * ConfirmationModal - AlertDialog for destructive actions
 * Follows UI-Skills pattern for irreversible actions
 */

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    const confirmRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trap and management
    useEffect(() => {
        if (isOpen && confirmRef.current) {
            confirmRef.current.focus();
        }
    }, [isOpen]);

    // Close on Escape
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel();
        }
        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
            const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }, [onCancel]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const modal = (
        <div className="modal-overlay" onClick={onCancel} role="presentation">
            <div
                ref={modalRef}
                className={`confirmation-modal modal-${variant}`}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-message"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <h2 id="modal-title" className="modal-title">{title}</h2>
                <p id="modal-message" className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button
                        className="btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        className={`btn-${variant}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
