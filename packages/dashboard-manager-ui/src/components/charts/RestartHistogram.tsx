import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface RestartHistogramProps {
  restarts: number
}

export function RestartHistogram({ restarts }: RestartHistogramProps) {
  const data = [
    { name: 'Total Restarts', count: restarts }
  ]

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
        Restart Count
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.2)"
            fontSize={12}
          />
          <YAxis
            stroke="rgba(255,255,255,0.2)"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '0.25rem'
            }}
          />
          <Bar
            dataKey="count"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
