import { useEffect, useRef, useState } from 'react'
import { Search, Download, Copy } from 'lucide-react'
import { useWebSocket } from '../hooks/useWebSocket'
import type { DashboardLogLine } from '../types/dashboard'
import './LogViewer.css'

interface LogViewerProps {
  dashboardId: string
}

export function LogViewer({ dashboardId }: LogViewerProps) {
  const [logs, setLogs] = useState<DashboardLogLine[]>([])
  const [filter, setFilter] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const ws = useWebSocket()

  useEffect(() => {
    if (!ws.isConnected) return

    const handleLogLine = (data: DashboardLogLine) => {
      if (data.dashboardId === dashboardId) {
        setLogs(prev => [...prev.slice(-999), data]) // Keep last 1000 lines
      }
    }

    ws.on('dashboard:log-line', handleLogLine)

    return () => {
      ws.off('dashboard:log-line', handleLogLine)
    }
  }, [dashboardId, ws.isConnected])

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  const filteredLogs = filter
    ? logs.filter(log => log.line.toLowerCase().includes(filter.toLowerCase()))
    : logs


  const handleCopy = () => {
    const text = filteredLogs.map(log => log.line).join('\n')
    navigator.clipboard.writeText(text)
  }

  const handleDownload = () => {
    const text = filteredLogs.map(log =>
      `[${log.timestamp}] [${log.stream}] ${log.line}`
    ).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dashboardId}-logs.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="log-viewer">
      <div className="log-viewer-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <label className="auto-scroll-toggle">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={e => setAutoScroll(e.target.checked)}
            />
            Auto-scroll
          </label>
          <button onClick={handleCopy} title="Copy to clipboard">
            <Copy size={16} />
          </button>
          <button onClick={handleDownload} title="Download logs">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="log-viewer-container" ref={containerRef}>
        {filteredLogs.length === 0 ? (
          <div className="log-viewer-empty">
            {filter ? 'No logs match filter' : 'No logs yet'}
          </div>
        ) : (
          <div className="log-lines">
            {filteredLogs.map((log, i) => {
              const classes = ['log-line', `log-line--${log.stream}`].filter(Boolean).join(' ')

              return (
                <div key={i} className={classes}>
                  <span className="log-timestamp">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="log-stream">[{log.stream}]</span>
                  <span className="log-content">{log.line}</span>
                </div>
              )
            })}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}
