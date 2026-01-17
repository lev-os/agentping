import React from 'react';
import './ResourceView.css';

interface Resource {
    id: string;
    name: string;
}

interface ResourceEvent {
    id: string;
    resourceId: string;
    start: number; // Hour 0-24
    end: number; // Hour 0-24
    title: string;
    color?: string;
}

interface ResourceViewProps {
    resources: Resource[];
    events: ResourceEvent[];
    startHour?: number;
    endHour?: number;
    onEventClick?: (id: string) => void;
}

export const ResourceView: React.FC<ResourceViewProps> = ({
    resources,
    events,
    startHour = 8,
    endHour = 18,
    onEventClick
}) => {
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    const hourWidth = 60; // px

    const getEventStyle = (event: ResourceEvent) => {
        const startOffset = event.start - startHour;
        const duration = event.end - event.start;

        return {
            left: `${startOffset * hourWidth}px`,
            width: `${duration * hourWidth}px`,
            backgroundColor: event.color
        };
    };

    return (
        <div className="resource-view">
            <div className="resource-header">
                <div className="resource-label-header">Resource</div>
                <div className="timeline-header" style={{ width: hours.length * hourWidth }}>
                    {hours.map(h => (
                        <div key={h} className="timeline-hour" style={{ width: hourWidth }}>
                            {h}:00
                        </div>
                    ))}
                </div>
            </div>

            <div className="resource-body">
                {resources.map(resource => (
                    <div key={resource.id} className="resource-row">
                        <div className="resource-label">{resource.name}</div>
                        <div className="resource-timeline" style={{ width: hours.length * hourWidth }}>
                            {events
                                .filter(e => e.resourceId === resource.id)
                                .map(e => (
                                    <div
                                        key={e.id}
                                        className="resource-event"
                                        style={getEventStyle(e)}
                                        onClick={() => onEventClick && onEventClick(e.id)}
                                        title={e.title}
                                    >
                                        {e.title}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
