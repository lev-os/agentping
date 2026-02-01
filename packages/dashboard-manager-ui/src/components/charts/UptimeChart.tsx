import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface UptimeChartProps {
  uptimeMs: number
}

export function UptimeChart({ uptimeMs }: UptimeChartProps) {
  const uptimeHours = uptimeMs / (1000 * 60 * 60)

  const data = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    uptime: Math.min(uptimeHours, i + 1)
  }))

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
        Uptime: {formatUptime(uptimeMs)}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="hour"
            stroke="rgba(255,255,255,0.2)"
            fontSize={12}
            tickFormatter={v => `${v}h`}
          />
          <YAxis
            stroke="rgba(255,255,255,0.2)"
            fontSize={12}
            tickFormatter={v => `${v}h`}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '0.25rem'
            }}
          />
          <Area
            type="monotone"
            dataKey="uptime"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#uptimeGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}
