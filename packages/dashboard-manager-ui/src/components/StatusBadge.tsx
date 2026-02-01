import { clsx } from 'clsx'
import './StatusBadge.css'

interface StatusBadgeProps {
  status: 'starting' | 'online' | 'failed' | 'stopped'
  healthy?: boolean
  className?: string
}

export function StatusBadge({ status, healthy, className }: StatusBadgeProps) {
  const displayStatus = status === 'online' && healthy === false ? 'unhealthy' : status

  return (
    <span
      className={clsx('status-badge', `status-badge--${displayStatus}`, className)}
      data-status={displayStatus}
    >
      {displayStatus}
    </span>
  )
}
