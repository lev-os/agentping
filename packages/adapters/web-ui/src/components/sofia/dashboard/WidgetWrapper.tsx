'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'

export type WidgetVariant = 'compact' | 'standard' | 'expanded'

interface WidgetWrapperProps {
  widgetId: string
  children: (context: {
    variant: WidgetVariant
    containerWidth: number
    containerHeight: number
  }) => ReactNode
  className?: string
}

function getVariant(width: number): WidgetVariant {
  if (width < 300) return 'compact'
  if (width < 500) return 'standard'
  return 'expanded'
}

/**
 * WidgetWrapper - Provides responsive variant detection via ResizeObserver
 *
 * Uses ResizeObserver to detect container width and provide variant context.
 * CSS container queries handle layout; this sets data-variant for React logic.
 *
 * Variants:
 * - compact: <300px width (mobile, sidebar widgets)
 * - standard: 300-500px width (medium cards)
 * - expanded: >500px width (full-size panels)
 */
export function WidgetWrapper({ widgetId, children, className }: WidgetWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 })

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const variant = getVariant(dimensions.width)

  return (
    <div
      ref={containerRef}
      data-widget-id={widgetId}
      data-variant={variant}
      className={className ?? 'h-full w-full'}
      style={{ containerType: 'inline-size' }}
    >
      {children({
        variant,
        containerWidth: dimensions.width,
        containerHeight: dimensions.height
      })}
    </div>
  )
}

export type { WidgetWrapperProps }
