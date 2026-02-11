"use client"

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../ui/button'
import { useCrudContext } from '../context'
import { List, Table2, Grid3x3 } from 'lucide-react'

const viewIcons = {
  list: List,
  table: Table2,
  tiles: Grid3x3,
  custom: Grid3x3,
}

interface ViewSwitcherProps {
  className?: string
}

export function ViewSwitcher({ className }: ViewSwitcherProps) {
  const { viewMode, setViewMode, config } = useCrudContext()
  const availableViews = config.views?.available || ['tiles']

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {availableViews.map((mode) => {
        const Icon = viewIcons[mode]
        const isActive = viewMode === mode
        return (
          <Button
            key={mode}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode(mode)}
            className={cn(
              'h-8 w-8 p-0',
              isActive && 'bg-primary/20 text-primary border-primary/50'
            )}
            aria-label={`Switch to ${mode} view`}
          >
            {Icon && <Icon className="h-4 w-4" />}
          </Button>
        )
      })}
    </div>
  )
}
