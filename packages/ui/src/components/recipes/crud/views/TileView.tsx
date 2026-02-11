'use client'

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { useCrudContext } from '../context'
import { TileCard } from './TileCard'
import type { TileCardConfig } from '../types'

type CrudItem = Record<string, unknown>

interface TileViewProps {
  className?: string
}

export function TileView({ className }: TileViewProps) {
  const { filteredItems, config, isLoading } = useCrudContext<CrudItem>()

  // Use custom tile component if provided
  const CustomTile = config.views?.tileComponent

  // Get tile config (default or from config)
  const tileConfig: TileCardConfig<CrudItem> =
    config.views?.tileConfig ?? {
      title: config.columns[0]?.key || 'id',
      subtitle: config.columns[1]?.key,
      badges: config.columns
        .filter((col) => col.type === 'badge')
        .map((col) => ({ field: col.key, variant: 'outline' as const })),
    }

  const handleAction = (action: string, _item: CrudItem) => {
    if (action === 'edit') {
      // Handle edit
    } else if (action === 'view') {
      // Handle view
    }
  }

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className='h-48 bg-muted/20 border border-border rounded animate-pulse' />
        ))}
      </div>
    )
  }

  if (filteredItems.length === 0) {
    const EmptyState = config.slots?.emptyState
    if (EmptyState) {
      return <EmptyState />
    }
    return (
      <div className={cn('text-center py-12', className)}>
        <p className='text-muted-foreground text-sm'>No {config.entity.plural.toLowerCase()} found</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', className)}>
      {filteredItems.map((item) => {
        const key = String(item[config.primaryKey])
        if (CustomTile) {
          return <CustomTile key={key} item={item} onAction={(action) => handleAction(action, item)} />
        }
        return <TileCard key={key} item={item} config={tileConfig} onAction={handleAction} />
      })}
    </div>
  )
}
