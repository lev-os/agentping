
import React from 'react';
import './KeyValueStore.css';

interface KeyValueItem {
    key: string;
    value: string | number | boolean;
    type?: 'string' | 'number' | 'boolean' | 'json';
    ttl?: number;
}

interface KeyValueStoreProps {
    items: KeyValueItem[];
    title?: string;
}

export const KeyValueStore: React.FC<KeyValueStoreProps> = ({ items, title }) => {
    const getTypeColor = (type?: string, value?: any) => {
        if (type) {
            switch (type) {
                case 'string': return '#ce9178';
                case 'number': return '#b5cea8';
                case 'boolean': return '#569cd6';
                case 'json': return '#dcdcaa';
                default: return '#fff';
            }
        }
        switch (typeof value) {
            case 'string': return '#ce9178';
            case 'number': return '#b5cea8';
            case 'boolean': return '#569cd6';
            default: return '#fff';
        }
    };

    return (
        <div className="key-value-store">
            <div className="kv-header">
                <h3 className="kv-title">{title || 'KV STORE'}</h3>
                <span className="kv-count">{items.length} KEYS</span>
            </div>
            <div className="kv-list">
                {items.map((item, index) => (
                    <div key={`${item.key}-${index}`} className="kv-item">
                        <div className="kv-key-section">
                            <span className="kv-key-icon">⚿</span>
                            <span className="kv-key">{item.key}</span>
                        </div>
                        <div className="kv-value-section">
                            <span
                                className="kv-value"
                                style={{ color: getTypeColor(item.type, item.value) }}
                            >
                                {String(item.value)}
                            </span>
                            {item.ttl !== undefined && (
                                <span className="kv-ttl">TTL: {item.ttl}s</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
