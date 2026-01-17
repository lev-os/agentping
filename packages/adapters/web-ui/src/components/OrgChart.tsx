import React from 'react';
import './OrgChart.css';

interface OrgNode {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    children?: OrgNode[];
}

interface OrgChartProps {
    data: OrgNode;
}

const OrgTreeNode = ({ node }: { node: OrgNode }) => {
    return (
        <div className="org-tree-node">
            <div className="org-card">
                {node.avatar ? (
                    <img src={node.avatar} alt={node.name} className="org-avatar" />
                ) : (
                    <div className="org-avatar-placeholder">{node.name.charAt(0)}</div>
                )}
                <div className="org-info">
                    <div className="org-name">{node.name}</div>
                    <div className="org-role">{node.role}</div>
                </div>
            </div>
            {node.children && node.children.length > 0 && (
                <div className="org-children">
                    {node.children.map(child => (
                        <OrgTreeNode key={child.id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export function OrgChart({ data }: OrgChartProps) {
    return (
        <div className="org-chart-container">
            <OrgTreeNode node={data} />
        </div>
    );
}
