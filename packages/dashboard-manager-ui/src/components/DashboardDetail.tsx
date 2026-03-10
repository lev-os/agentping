import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  DmDashboardDetail,
  type DmDashboardDetailProps,
} from '@kingly/ui/components'

import { dashboardAPI } from '../api/client'
import { useWebSocket } from '../hooks/useWebSocket'
import type { Dashboard, DashboardMetrics } from '../types/dashboard'

export function DashboardDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<Dashboard | undefined>(undefined)
  const [metrics, setMetrics] = useState<DashboardMetrics | undefined>(undefined)
  const { isConnected, subscribe, unsubscribe, on } = useWebSocket()

  useEffect(() => {
    if (!id) return

    const load = async () => {
      const [nextDashboard, nextMetrics] = await Promise.all([
        dashboardAPI.getDashboard(id),
        dashboardAPI.getDashboardMetrics(id).catch(() => undefined),
      ])

      setDashboard(nextDashboard)
      setMetrics(nextMetrics)
    }

    void load()
  }, [id])

  useEffect(() => {
    if (!id || !isConnected) return

    subscribe(id)
    return () => {
      unsubscribe(id)
    }
  }, [id, isConnected, subscribe, unsubscribe])

  useEffect(() => {
    const offStatus = on('dashboard:status', (event) => {
      if (!id || event.dashboardId !== id) return

      setDashboard((current) =>
        current
          ? {
              ...current,
              status: {
                ...current.status,
                ...event,
              },
            }
          : current,
      )
    })

    const offHealthFailed = on('dashboard:health-failed', (event) => {
      if (!id || event.dashboardId !== id) return

      setDashboard((current) =>
        current
          ? {
              ...current,
              status: {
                ...current.status,
                healthy: false,
                reason: event.reason,
                timestamp: event.timestamp,
              },
            }
          : current,
      )
    })

    const offPortChanged = on('dashboard:port-changed', (event) => {
      if (!id || event.dashboardId !== id) return

      setDashboard((current) =>
        current
          ? {
              ...current,
              status: {
                ...current.status,
                port: event.newPort,
                timestamp: event.timestamp,
              },
            }
          : current,
      )
    })

    return () => {
      offStatus?.()
      offHealthFailed?.()
      offPortChanged?.()
    }
  }, [id, on])

  const handleRestart: NonNullable<DmDashboardDetailProps['onRestart']> = async () => {
    if (!id) return

    await dashboardAPI.restartDashboard(id)

    const [nextDashboard, nextMetrics] = await Promise.all([
      dashboardAPI.getDashboard(id),
      dashboardAPI.getDashboardMetrics(id).catch(() => undefined),
    ])

    setDashboard(nextDashboard)
    setMetrics(nextMetrics)
  }

  const handleOpen: NonNullable<DmDashboardDetailProps['onOpen']> = () => {
    if (!dashboard?.status.port) return

    window.open(
      `http://localhost:${dashboard.status.port}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <DmDashboardDetail
      dashboard={dashboard}
      metrics={metrics}
      onBack={() => navigate('/')}
      onRestart={handleRestart}
      onOpen={handleOpen}
    />
  )
}

export type { DmDashboardDetailProps as DashboardDetailProps } from '@kingly/ui/components'
