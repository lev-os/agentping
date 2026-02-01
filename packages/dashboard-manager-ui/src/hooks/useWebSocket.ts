import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { DashboardStatus, DashboardLogLine } from '../types/dashboard'

interface WebSocketEvents {
  'dashboard:status': (data: { dashboardId: string } & DashboardStatus) => void
  'dashboard:log-line': (data: DashboardLogLine) => void
  'dashboard:health-failed': (data: { dashboardId: string; reason: string; timestamp: string }) => void
  'dashboard:port-changed': (data: { dashboardId: string; oldPort: number; newPort: number; reason: string }) => void
}

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socketRef.current = socket

    return () => {
      socket.close()
    }
  }, [])

  const subscribe = (dashboardId: string) => {
    socketRef.current?.emit('dashboard:subscribe', { dashboardId })
  }

  const unsubscribe = (dashboardId: string) => {
    socketRef.current?.emit('dashboard:unsubscribe', { dashboardId })
  }

  const on = <K extends keyof WebSocketEvents>(event: K, handler: WebSocketEvents[K]) => {
    socketRef.current?.on(event, handler as any)
  }

  const off = <K extends keyof WebSocketEvents>(event: K, handler: WebSocketEvents[K]) => {
    socketRef.current?.off(event, handler as any)
  }

  return {
    isConnected,
    subscribe,
    unsubscribe,
    on,
    off
  }
}
