import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type {
  DashboardHealthFailedEvent,
  DashboardLogLine,
  DashboardPortChangedEvent,
  DashboardStatusEvent,
} from '../types/dashboard'

interface WebSocketEvents {
  'dashboard:status': (data: DashboardStatusEvent) => void
  'dashboard:log-line': (data: DashboardLogLine) => void
  'dashboard:health-failed': (data: DashboardHealthFailedEvent) => void
  'dashboard:port-changed': (data: DashboardPortChangedEvent) => void
}

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    console.log('[useWebSocket] Initializing Socket.io client to http://localhost:3030');

    const socket = io('http://localhost:3030', {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('[useWebSocket] Connected!', socket.id);
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[useWebSocket] Disconnected');
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('[useWebSocket] Connection error:', error);
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
    return () => {
      socketRef.current?.off(event, handler as any)
    }
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
