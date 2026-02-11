import { useState, useEffect } from 'react'
import { useAgentPing } from './hooks/useAgentPing'
import { CanvasRenderer } from './components/CanvasRenderer'
import { ConnectionStatus } from './components/ConnectionStatus'
import { PolymorphPlayground } from './components/PolymorphPlayground'

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const statusStyles: Record<string, string> = {
  pending: 'text-[var(--primary)] border-[var(--primary)]/50',
  responded: 'text-[var(--success)] border-[var(--success)]/50',
  expired: 'text-[var(--warning)] border-[var(--warning)]/50',
  dismissed: 'text-[var(--text-muted)] border-[var(--text-muted)]/40',
  cancelled: 'text-[var(--danger)] border-[var(--danger)]/50',
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  useEffect(() => {
    const handler = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (route === '#playground') return <PolymorphPlayground />

  const { pings, connected, respond } = useAgentPing()

  const sorted = [...pings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-[var(--primary)] text-lg font-semibold">
          Lev Canvas
        </span>
        <a href="#playground" className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Playground</a>
        <ConnectionStatus connected={connected} />
      </header>

      {/* Main */}
      <main className="pt-16 px-6 py-6 max-w-7xl mx-auto space-y-6">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-[var(--text-muted)] font-mono text-sm animate-pulse-glow">
              Waiting for canvas interactions...
            </p>
          </div>
        ) : (
          sorted.map((ping) => (
            <div
              key={ping.id}
              className="glass-panel rounded-[var(--radius-lg)] p-5 space-y-4"
            >
              {/** Header */}
              {/* Card header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    {ping.payload.action === 'render'
                      ? ping.payload.componentName ?? ping.payload.props.widgetId ?? 'Sofia Widget'
                      : 'Canvas Selection'}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {ping.payload.instruction ??
                      ping.parsedInteraction?.fallbackText ??
                      `${ping.agentName} · ${ping.sessionId}`}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {ping.agentName} ({ping.agentId}) · {ping.id}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${statusStyles[ping.status] ?? statusStyles.pending}`}>
                    {ping.status}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {timeAgo(ping.createdAt)}
                  </span>
                </div>
              </div>

              {/* Canvas render area */}
              <CanvasRenderer
                payload={ping.payload}
                onRespond={(data) => respond(ping.id, data)}
              />
            </div>
          ))
        )}
      </main>
    </div>
  )
}
