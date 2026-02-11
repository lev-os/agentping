'use client'

import 'react-grid-layout/css/styles.css'
import { WidgetWrapper, type WidgetVariant } from './WidgetWrapper'
import { cn } from '../../lib/utils'
import {
  ResponsiveGridLayout,
  useContainerWidth,
  verticalCompactor,
  type ResponsiveLayouts,
  type Layout,
} from 'react-grid-layout'

// Type aliases for our breakpoints
type Breakpoint = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
type Layouts = ResponsiveLayouts<Breakpoint>

interface Widget {
  id: string
  component: React.ComponentType<{
    variant: WidgetVariant
    containerWidth: number
    containerHeight: number
    widgetId: string
  }>
}

interface ResponsiveDashboardProps {
  widgets: Widget[]
  layouts: Layouts
  onLayoutChange: (layouts: Layouts) => void
  className?: string
  rowHeight?: number
  isDraggable?: boolean
  isResizable?: boolean
}

/**
 * ResponsiveDashboard - Drag-and-drop widget grid using react-grid-layout v2
 *
 * Features:
 * - Responsive breakpoints (lg/md/sm/xs/xxs)
 * - User-customizable layouts persisted to preferences store
 * - Drag handle for repositioning (.drag-handle class)
 * - CSS transforms for smooth animations
 * - Vertical compaction to fill gaps
 *
 * Usage:
 * ```tsx
 * <ResponsiveDashboard
 *   widgets={[
 *     { id: 'metrics', component: MetricsWidget },
 *     { id: 'episodes', component: EpisodesWidget },
 *   ]}
 *   layouts={preferencesStore.layouts}
 *   onLayoutChange={preferencesStore.updateLayouts}
 * />
 * ```
 */
export function ResponsiveDashboard({
  widgets,
  layouts,
  onLayoutChange,
  className,
  rowHeight = 60,
  isDraggable = true,
  isResizable = true,
}: ResponsiveDashboardProps) {
  const { width, containerRef, mounted } = useContainerWidth({ initialWidth: 1200 })

  return (
    <div ref={containerRef} className="w-full">
      {mounted && (
        <ResponsiveGridLayout<Breakpoint>
          width={width}
          className={cn('layout', className)}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={rowHeight}
          onLayoutChange={(_layout: Layout, allLayouts: Layouts) => onLayoutChange(allLayouts)}
          dragConfig={{
            enabled: isDraggable,
            handle: '.drag-handle',
          }}
          resizeConfig={{
            enabled: isResizable,
          }}
          compactor={verticalCompactor}
          margin={[16, 16] as const}
          containerPadding={[0, 0] as const}
        >
          {widgets.map(({ id, component: Component }) => (
            <div key={id} className="overflow-hidden rounded-lg">
              <WidgetWrapper widgetId={id}>
                {({ variant, containerWidth, containerHeight }) => (
                  <Component
                    widgetId={id}
                    variant={variant}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                  />
                )}
              </WidgetWrapper>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  )
}

export type { Widget, ResponsiveDashboardProps, Layouts, Breakpoint }
