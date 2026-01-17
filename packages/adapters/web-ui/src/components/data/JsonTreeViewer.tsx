
import React, { useState } from 'react';
import './JsonTreeViewer.css';

interface JsonTreeViewerProps {
    data: any;
    title?: string;
    initialExpanded?: boolean;
}

const JsonNode: React.FC<{
    name: string | null;
    value: any;
    isLast: boolean;
    depth: number;
    initialExpanded: boolean;
}> = ({ name, value, isLast, depth, initialExpanded }) => {
    const [expanded, setExpanded] = useState(initialExpanded);
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);
    const isEmpty = isObject && Object.keys(value).length === 0;

    const toggleExpand = () => {
        if (!isEmpty) setExpanded(!expanded);
    };

    const renderValue = (val: any) => {
        if (val === null) return <span className="json-null">null</span>;
        if (typeof val === 'string') return <span className="json-string">"{val}"</span>;
        if (typeof val === 'number') return <span className="json-number">{val}</span>;
        if (typeof val === 'boolean') return <span className="json-boolean">{String(val)}</span>;
        return null;
    };

    return (
        <div className="json-node" style={{ paddingLeft: depth * 12 }}>
            <div className="json-line">
                {name && <span className="json-key">{name}: </span>}

                {!isObject ? (
                    <>
                        {renderValue(value)}
                        {!isLast && <span className="json-comma">,</span>}
                    </>
                ) : (
                    <>
                        <span
                            className={`json-bracket-toggle ${isEmpty ? 'empty' : ''}`}
                            onClick={toggleExpand}
                        >
                            {isArray ? '[' : '{'}
                            {!expanded && !isEmpty && <span className="json-collapsed">...</span>}
                        </span>

                        {(!expanded || isEmpty) && (
                            <>
                                <span className="json-bracket">{isArray ? ']' : '}'}</span>
                                {!isLast && <span className="json-comma">,</span>}
                            </>
                        )}
                    </>
                )}
            </div>

            {isObject && expanded && !isEmpty && (
                <div className="json-children">
                    {Object.entries(value).map(([key, val], index, arr) => (
                        <JsonNode
                            key={key}
                            name={isArray ? null : key}
                            value={val}
                            isLast={index === arr.length - 1}
                            depth={depth + 1}
                            initialExpanded={initialExpanded}
                        />
                    ))}
                    <div className="json-line" style={{ paddingLeft: depth * 12 }}>
                        <span className="json-bracket">{isArray ? ']' : '}'}</span>
                        {!isLast && <span className="json-comma">,</span>}
                    </div>
                </div>
            )}
        </div>
    );
};

export const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({ data, title, initialExpanded = true }) => {
    return (
        <div className="json-tree-viewer">
            {title && <div className="json-header">{title}</div>}
            <div className="json-content">
                <JsonNode
                    name={null}
                    value={data}
                    isLast={true}
                    depth={0}
                    initialExpanded={initialExpanded}
                />
            </div>
        </div>
    );
};
