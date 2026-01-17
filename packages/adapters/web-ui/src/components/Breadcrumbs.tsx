import React from 'react';
import './Breadcrumbs.css';

interface BreadcrumbsProps {
    path: Array<{ label: string; id: string }>;
    onNavigate: (id: string) => void;
}

export function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
                {path.map((item, index) => (
                    <li key={item.id} className="breadcrumb-li">
                        <div
                            className={`breadcrumb-item ${index === path.length - 1 ? 'active' : ''}`}
                            onClick={() => index < path.length - 1 && onNavigate(item.id)}
                            role={index < path.length - 1 ? 'button' : undefined}
                            tabIndex={index < path.length - 1 ? 0 : undefined}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && index < path.length - 1) {
                                    onNavigate(item.id);
                                }
                            }}
                            aria-current={index === path.length - 1 ? 'page' : undefined}
                        >
                            {item.label}
                        </div>
                        {index < path.length - 1 && (
                            <span className="breadcrumb-separator" aria-hidden="true">›</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
