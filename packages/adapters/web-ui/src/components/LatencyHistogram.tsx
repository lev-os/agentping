import React from 'react';
import './LogHistogram.css'; // Reuse styles

interface LatencyBucket {
    range: string;
    count: number;
}

interface LatencyHistogramProps {
    data: LatencyBucket[];
    height?: number;
}

export function LatencyHistogram({ data, height = 200 }: LatencyHistogramProps) {
    const maxVal = Math.max(...data.map(d => d.count));

    return (
        <div className="log-histogram latency-hist" style={{ height }}>
            {data.map((bucket, i) => {
                const heightPct = maxVal > 0 ? (bucket.count / maxVal) * 100 : 0;
                // Color ramp: Green (fast) -> Yellow -> Red (slow)
                const hue = Math.max(0, 120 - (i / (data.length - 1)) * 120);

                return (
                    <div key={i} className="hist-column" title={`${bucket.range}: ${bucket.count} reqs`}>
                        <div className="hist-bar-group" style={{ height: `${heightPct}%` }}>
                            <div
                                className="hist-bar"
                                style={{
                                    flex: 1,
                                    background: `hsl(${hue}, 70%, 50%)`,
                                    opacity: 0.7
                                }}
                            />
                        </div>
                        <span className="hist-label">{bucket.range}</span>
                    </div>
                );
            })}
        </div>
    );
}
