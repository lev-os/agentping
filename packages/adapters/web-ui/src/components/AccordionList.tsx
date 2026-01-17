import React, { useState } from 'react';
import './AccordionList.css';

interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface AccordionListProps {
    items: AccordionItem[];
}

export function AccordionList({ items }: AccordionListProps) {
    const [openId, setOpenId] = useState<string | null>(items[0]?.id);

    return (
        <div className="accordion-list">
            {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                    <div key={item.id} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                        <button
                            className="accordion-header"
                            onClick={() => setOpenId(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                            aria-controls={`accordion-content-${item.id}`}
                            id={`accordion-btn-${item.id}`}
                        >
                            <span className="accordion-title">{item.title}</span>
                            <span className="accordion-icon" aria-hidden="true">▼</span>
                        </button>
                        <div
                            className="accordion-content"
                            id={`accordion-content-${item.id}`}
                            role="region"
                            aria-labelledby={`accordion-btn-${item.id}`}
                            hidden={!isOpen}
                        >
                            {item.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
