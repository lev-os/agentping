
import React from 'react';
import './SchemaGraph.css';

interface Field {
    name: string;
    type: string;
    isKey?: boolean;
}

interface TableNode {
    id: string;
    title: string;
    fields: Field[];
    x: number;
    y: number;
}

interface Relationship {
    from: string;
    to: string;
    type: '1:1' | '1:N' | 'N:M' | 'N:1';
}

interface SchemaGraphProps {
    tables: TableNode[];
    relationships: Relationship[];
}

export const SchemaGraph: React.FC<SchemaGraphProps> = ({ tables, relationships }) => {
    const getTableCenter = (table: TableNode) => {
        return {
            x: table.x + 100, // Approx width/2
            y: table.y + (20 + table.fields.length * 20) / 2, // Approx height/2
        };
    };

    return (
        <div className="schema-graph">
            <h3 className="schema-title">SCHEMA TOPOLOGY</h3>
            <div className="schema-canvas-wrapper">
                <svg className="schema-svg">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-primary)" />
                        </marker>
                    </defs>
                    {relationships.map((rel, idx) => {
                        const fromTable = tables.find((t) => t.id === rel.from);
                        const toTable = tables.find((t) => t.id === rel.to);
                        if (!fromTable || !toTable) return null;

                        const start = getTableCenter(fromTable);
                        const end = getTableCenter(toTable);

                        return (
                            <path
                                key={idx}
                                d={`M${start.x},${start.y} L${end.x},${end.y}`}
                                stroke="var(--accent-primary)"
                                strokeWidth="2"
                                fill="none"
                                opacity="0.5"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}
                </svg>

                {tables.map((table) => (
                    <div
                        key={table.id}
                        className="schema-node"
                        style={{ left: table.x, top: table.y }}
                    >
                        <div className="schema-node-header">{table.title}</div>
                        <div className="schema-node-body">
                            {table.fields.map((field, idx) => (
                                <div key={idx} className="schema-field">
                                    <span className={`field-name ${field.isKey ? 'key' : ''}`}>
                                        {field.name}
                                    </span>
                                    <span className="field-type">{field.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
