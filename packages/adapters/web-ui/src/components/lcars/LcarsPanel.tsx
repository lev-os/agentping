/**
 * LcarsPanel - Container panel with LCARS styling
 *
 * Panels are the main content areas in LCARS interfaces.
 * They have characteristic borders and can include header bars.
 */

import { CSSProperties, ReactNode } from 'react'
import './LcarsPanel.css'

export type LcarsPanelVariant = 'default' | 'outlined' | 'filled'

export interface LcarsPanelProps {
  /** Panel variant */
  variant?: LcarsPanelVariant
  /** Panel title (shown in header bar) */
  title?: string
  /** Header bar color */
  headerColor?: 'blue' | 'orange' | 'tan' | 'purple'
  /** Show header bar */
  showHeader?: boolean
  /** Border color */
  borderColor?: 'blue' | 'orange' | 'tan' | 'none'
  /** Content */
  children: ReactNode
  /** Additional class */
  className?: string
  /** Inline styles */
  style?: CSSProperties
  /** Footer content */
  footer?: ReactNode
}

export function LcarsPanel({
  variant = 'default',
  title,
  headerColor = 'tan',
  showHeader = true,
  borderColor = 'blue',
  children,
  className = '',
  style,
  footer,
}: LcarsPanelProps) {
  return (
    <div
      className={`lcars-panel lcars-panel--${variant} lcars-panel--border-${borderColor} ${className}`}
      style={style}
    >
      {showHeader && (
        <div className={`lcars-panel__header lcars-panel__header--${headerColor}`}>
          {title && <span className="lcars-panel__title">{title}</span>}
          <div className="lcars-panel__header-bar" />
        </div>
      )}
      <div className="lcars-panel__content">
        {children}
      </div>
      {footer && (
        <div className="lcars-panel__footer">
          {footer}
        </div>
      )}
    </div>
  )
}

export default LcarsPanel
