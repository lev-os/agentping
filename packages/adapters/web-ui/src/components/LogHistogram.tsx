import React from 'react';
import './LogHistogram.css';

interface LogBucket {
    time: string;
    info: number;
    error: number;
    warn: number;
}

interface LogHistogramProps {
    data: LogBucket[];
    height?: number;
}

export function LogHistogram({ data, height = 200 }: LogHistogramProps) {
    const maxVal = Math.max(...data.map(d => d.info + d.error + d.warn));

    return (
        <div className="log-histogram" style={{ height }}>
            {data.map((bucket, i) => {
                const total = bucket.info + bucket.error + bucket.warn;
                const heightPct = maxVal > 0 ? (total / maxVal) * 100 : 0;

                return (
                    <div key={i} className="hist-column" title={`${bucket.time}: ${total} logs`}>
                        <div className="hist-bar-group" style={{ height: `${heightPct}%` }}>
                            <div className="hist-bar error" style={{ flex: bucket.error }} />
                            <div className="hist-bar warn" style={{ flex: bucket.warn }} />
                            <div className="hist-bar info" style={{ flex: bucket.info }} />
                        </div>
                        <span className="hist-label">{bucket.time}</span>
                    </div>
                );
            })}
        </div>
    );
}
