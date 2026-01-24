import { ReactNode, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            previousActiveElement.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const widths = { sm: '400px', md: '500px', lg: '700px' };

    return createPortal(
        <div
            ref={overlayRef}
            className="ui-modal-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div className="ui-modal" style={{ maxWidth: widths[size] }}>
                {title && (
                    <div className="ui-modal-header">
                        <h2 id="modal-title" className="ui-modal-title">{title}</h2>
                        <button
                            className="ui-modal-close"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
                <div className="ui-modal-body ui-scrollbar">
                    {children}
                </div>
                {footer && (
                    <div className="ui-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
