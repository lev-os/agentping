import { useCallback, useEffect, useRef, useState } from 'react'
import { z } from 'zod'

const CanvasInteractionPayloadSchema = z.object({
  type: z.literal('canvas_interaction'),
  action: z.enum(['render', 'selection']),
  componentType: z.string().optional(),
  componentName: z.string().optional(),
  props: z.record(z.string(), z.unknown()).optional(),
  instruction: z.string().optional(),
  selectionType: z.string().optional(),
})

type CanvasInteractionPayload = z.infer<typeof CanvasInteractionPayloadSchema>

interface ParsedInteraction {
  fallbackText?: string
}

export interface CanvasPing {
  id: string
  agentId: string
  agentName: string
  sessionId: string
  type: string
  status: 'pending' | 'responded' | 'expired' | 'dismissed' | 'cancelled'
  payload: CanvasInteractionPayload
  parsedInteraction?: ParsedInteraction | null
  createdAt: string
  respondedAt?: string | null
  expiresAt?: string | null
}

type PingEvent =
  | 'ping:created'
  | 'ping:responded'
  | 'ping:expired'
  | 'ping:dismissed'
  | 'ping:cancelled'

interface WsMessage {
  type: PingEvent | 'connected'
  data?: unknown
}

const STATUS_FROM_EVENT: Record<PingEvent, CanvasPing['status']> = {
  'ping:created': 'pending',
  'ping:responded': 'responded',
  'ping:expired': 'expired',
  'ping:dismissed': 'dismissed',
  'ping:cancelled': 'cancelled',
}

const WS_URL =
  import.meta.env.VITE_AGENTPING_WS_URL ?? 'ws://localhost:7890/api/v1/ws'
const API_BASE = '/api/v1/pings'
const INITIAL_BACKOFF_MS = 1_000
const MAX_BACKOFF_MS = 30_000

const isCanvasPing = (value: unknown): value is CanvasPing => {
  if (!value || typeof value !== 'object') return false
  const payload = (value as { payload?: unknown }).payload
  return CanvasInteractionPayloadSchema.safeParse(payload).success
}

const upsertPing = (current: CanvasPing[], ping: CanvasPing): CanvasPing[] => {
  const next = current.filter((item) => item.id !== ping.id)
  next.unshift(ping)
  return next.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function useAgentPing() {
  const [pings, setPings] = useState<CanvasPing[]>([])
  const [connected, setConnected] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const backoff = useRef(INITIAL_BACKOFF_MS)
  const unmounted = useRef(false)

  const fetchPending = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}?status=pending`)
      if (!res.ok) return

      const json = (await res.json()) as { pings?: unknown[] }
      const next = (json.pings ?? []).filter(isCanvasPing)
      setPings(next.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    } catch {
      // noop
    }
  }, [])

  const respond = useCallback(
    async (pingId: string, data: Record<string, unknown>): Promise<void> => {
      const res = await fetch(`${API_BASE}/${pingId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'custom',
          data,
          respondedVia: 'canvas-ui',
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Respond failed (${res.status}): ${text}`)
      }
    },
    [],
  )

  const scheduleReconnect = useCallback(() => {
    if (unmounted.current) return

    reconnectTimer.current = setTimeout(() => {
      if (unmounted.current) return
      connect()
    }, backoff.current)

    backoff.current = Math.min(backoff.current * 2, MAX_BACKOFF_MS)
  }, [])

  const connect = useCallback(() => {
    if (unmounted.current) return

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      if (unmounted.current) return
      setConnected(true)
      backoff.current = INITIAL_BACKOFF_MS
      void fetchPending()
    }

    ws.onclose = () => {
      if (unmounted.current) return
      setConnected(false)
      scheduleReconnect()
    }

    ws.onerror = () => {
      ws.close()
    }

    ws.onmessage = (event: MessageEvent) => {
      if (unmounted.current) return

      let message: WsMessage
      try {
        message = JSON.parse(event.data as string) as WsMessage
      } catch {
        return
      }

      if (message.type === 'connected') return

      if (message.type === 'ping:created') {
        const createdPing = message.data
        if (!isCanvasPing(createdPing)) return
        setPings((current) => upsertPing(current, createdPing))
        return
      }

      if (message.type === 'ping:responded') {
        const data = message.data as
          | { ping?: unknown; response?: unknown }
          | undefined
        const ping = data?.ping
        if (!isCanvasPing(ping)) return

        setPings((current) =>
          current.map((item) =>
            item.id === ping.id
              ? { ...item, status: 'responded', respondedAt: new Date().toISOString() }
              : item,
          ),
        )
        return
      }

      const status = STATUS_FROM_EVENT[message.type]
      if (!status) return

      const ping = message.data
      if (!isCanvasPing(ping)) return

      setPings((current) =>
        current.map((item) =>
          item.id === ping.id ? { ...item, status } : item,
        ),
      )
    }
  }, [fetchPending, scheduleReconnect])

  useEffect(() => {
    unmounted.current = false
    connect()

    return () => {
      unmounted.current = true
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  return { pings, connected, respond, fetchPending } as const
}
