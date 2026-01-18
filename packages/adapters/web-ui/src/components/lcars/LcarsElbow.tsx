/**
 * LcarsElbow - The signature LCARS curved corner element
 *
 * LCARS interfaces feature distinctive curved corners (elbows) that connect
 * the sidebar to header/footer panels. This component renders that shape.
 */

import { CSSProperties, ReactNode } from 'react'
import './LcarsElbow.css'

export type ElbowPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type ElbowSize = 'sm' | 'md' | 'lg'

export interface LcarsElbowProps {
  /** Which corner the elbow occupies */
  position: ElbowPosition
  /** Size variant */
  size?: ElbowSize
  /** Background color (LCARS palette) */
  color?: 'blue' | 'orange' | 'tan' | 'purple' | 'violet' | 'pink'
  /** Content to display in the elbow's inner area */
  children?: ReactNode
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: CSSProperties
  /** Whether to show the horizontal bar extension */
  showBar?: boolean
  /** Bar height when showBar is true */
  barHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap: Record<ElbowSize, number> = {
  sm: 24,
  md: 40,
  lg: 60,
}

const barHeightMap: Record<string, string> = {
  xs: 'var(--lcars-stripe-xs)',
  sm: 'var(--lcars-stripe-sm)',
  md: 'var(--lcars-stripe-md)',
  lg: 'var(--lcars-stripe-lg)',
  xl: 'var(--lcars-stripe-xl)',
}

export function LcarsElbow({
  position,
  size = 'md',
  color = 'tan',
  children,
  className = '',
  style,
  showBar = true,
  barHeight = 'md',
}: LcarsElbowProps) {
  const radius = sizeMap[size]

  return (
    <div
      className={`lcars-elbow lcars-elbow--${position} lcars-elbow--${color} ${className}`}
      style={{
        '--elbow-radius': `${radius}px`,
        '--bar-height': barHeightMap[barHeight],
        ...style,
      } as CSSProperties}
    >
      <div className="lcars-elbow__curve" />
      {showBar && <div className="lcars-elbow__bar" />}
      {children && <div className="lcars-elbow__content">{children}</div>}
    </div>
  )
}

export default LcarsElbow
