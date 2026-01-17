
import React from 'react';
import './DistributedTrace.css';

interface TraceSpan {
    id: string;
    parentId?: string;
    name: string;
    service: string;
    startTime: number; // offset from trace start
    duration: number;
    status: 'ok' | 'error';
    tags?: { [key: string]: string };
}

interface TraceProps {
    traceId: string;
    spans: TraceSpan[];
    totalDuration?: number;
}

export const DistributedTrace: React.FC<TraceProps> = ({ traceId, spans, totalDuration }) => {
    // Sort spans by start time for waterfall
    const sortedSpans = [...spans].sort((a, b) => a.startTime - b.startTime);
    const duration = totalDuration || Math.max(...sortedSpans.map(s => s.startTime + s.duration));

    return (
        <div className="distributed-trace">
            <div className="trace-header">
                <h3 className="trace-title">TRACE: {traceId}</h3>
                <div className="trace-duration">{duration}ms</div>
            </div>
            <div className="trace-vis">
                <div className="trace-timeline-header">
                    <span className="timeline-scale">0ms</span>
                    <span className="timeline-scale">{(duration / 2).toFixed(0)}ms</span>
                    <span className="timeline-scale">{duration}ms</span>
                </div>
                <div className="trace-spans-container">
                    {sortedSpans.map((span) => (
                        <div key={span.id} className="span-row">
                            <div className="span-info">
                                <span className="span-service">{span.service}</span>
                                <span className="span-name">{span.name}</span>
                            </div>
                            <div className="span-track">
                                <div
                                    className={`span-bar ${span.status}`}
                                    style={{
                                        left: `${(span.startTime / duration) * 100}%`,
                                        width: `${Math.max((span.duration / duration) * 100, 0.5)}%`
                                    }}
                                    title={`${span.service}: ${span.name} (${span.duration}ms)`}
                                >
                                    <span className="span-duration-label">{span.duration}ms</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Grid lines */}
                    <div className="chart-grid">
                        <div className="grid-line" style={{ left: '0%' }}></div>
                        <div className="grid-line" style={{ left: '50%' }}></div>
                        <div className="grid-line" style={{ left: '100%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
