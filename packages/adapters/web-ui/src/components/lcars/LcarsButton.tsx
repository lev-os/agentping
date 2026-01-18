/**
 * LcarsButton - LCARS-styled button with rounded end caps
 *
 * LCARS buttons are distinctive pill-shaped elements with rounded ends
 * and uppercase text. They come in various colors from the LCARS palette.
 */

import { ButtonHTMLAttributes, ReactNode } from 'react'
import './LcarsButton.css'

export type LcarsButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success'
export type LcarsButtonSize = 'sm' | 'md' | 'lg'
export type LcarsButtonColor = 'blue' | 'orange' | 'tan' | 'purple' | 'violet' | 'pink' | 'red' | 'green'

export interface LcarsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: LcarsButtonVariant
  /** Size */
  size?: LcarsButtonSize
  /** Explicit color override */
  color?: LcarsButtonColor
  /** Show pulsing animation (for attention) */
  pulse?: boolean
  /** Show scanning animation (for loading) */
  scanning?: boolean
  /** Rounded end cap style */
  endCap?: 'both' | 'left' | 'right' | 'none'
  /** Children */
  children: ReactNode
}

export function LcarsButton({
  variant = 'primary',
  size = 'md',
  color,
  pulse = false,
  scanning = false,
  endCap = 'both',
  children,
  className = '',
  disabled,
  ...props
}: LcarsButtonProps) {
  const colorClass = color ? `lcars-button--${color}` : ''
  const pulseClass = pulse ? 'lcars-animate-pulse' : ''
  const scanClass = scanning ? 'lcars-animate-scan' : ''

  return (
    <button
      className={`lcars-button lcars-button--${variant} lcars-button--${size} lcars-button--cap-${endCap} ${colorClass} ${pulseClass} ${scanClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="lcars-button__text">{children}</span>
    </button>
  )
}

export default LcarsButton
