
import React from 'react';
import './ObjectProperties.css';

interface PropertyGroup {
    name: string;
    properties: {
        key: string;
        value: string | number | boolean;
        editable?: boolean;
        description?: string;
    }[];
}

interface ObjectPropertiesProps {
    title?: string;
    groups: PropertyGroup[];
}

export const ObjectProperties: React.FC<ObjectPropertiesProps> = ({ title, groups }) => {
    return (
        <div className="object-properties">
            <div className="props-header">
                <h3 className="props-title">{title || 'PROPERTIES'}</h3>
            </div>
            <div className="props-content">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="props-group">
                        <div className="group-header">{group.name}</div>
                        <div className="group-items">
                            {group.properties.map((prop, propIndex) => (
                                <div key={propIndex} className="prop-row" title={prop.description}>
                                    <div className="prop-key">{prop.key}</div>
                                    <div className={`prop-value ${prop.editable ? 'editable' : ''}`}>
                                        {String(prop.value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
