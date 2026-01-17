
import './MetricChart.css';

interface MetricPoint {
    label: string;
    value: number;
}

interface MetricChartProps {
    title: string;
    data: MetricPoint[];
    color?: string;
    height?: number;
}

export function MetricChart({ title, data, color = 'var(--accent-primary)', height = 150 }: MetricChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="metric-chart" aria-label={`Chart for ${title}`} role="img" style={{ height }}>
                <div className="chart-title">{title}</div>
                <div className="chart-empty">No data available</div>
            </div>
        );
    }

    const maxValue = Math.max(1, ...data.map(d => d.value));
    // SVG coordinate space
    const width = 100;
    const ViewHeight = 100;

    // Generate path
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = ViewHeight - ((d.value / maxValue) * ViewHeight);
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `M0,${ViewHeight} ${points} L${width},${ViewHeight} Z`;
    const strokePath = `M${points.split(' ')[0]} ${points}`; // Don't close stroke loop

    const chartId = `chart-${title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className="metric-chart" aria-label={`Chart for ${title}`} role="img" style={{ height }}>
            <div className="chart-title">{title}</div>
            <div className="chart-svg-container">
                <svg viewBox={`0 0 ${width} ${ViewHeight}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={`${chartId}-gradient`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                    <path
                        d={fillPath}
                        fill={`url(#${chartId}-gradient)`}
                        className="chart-area"
                    />
                    <path
                        d={strokePath}
                        className="chart-line"
                        stroke={color}
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>
        </div>
    );
}
