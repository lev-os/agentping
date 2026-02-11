"use client"

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { CrudProvider } from '../../context'
import { FilterBar } from '../../FilterBar'
import { TileView, TableView, ListView } from '../../views'
import { RestoreDialog, DeleteDialog } from '../../dialogs'
import { Button } from '../../../ui/Button'
import { RotateCcw } from 'lucide-react'
import type { CrudConfig } from '../../types'
import { useCrudContext } from '../../context'

interface CrudArchivePageProps<T extends Record<string, unknown>> {
  config: CrudConfig<T>
  initialItems?: T[]
  className?: string
}

export function CrudArchivePage<T extends Record<string, unknown>>({
  config,
  initialItems = [],
  className,
}: CrudArchivePageProps<T>) {
  // Filter to only show archived items
  const archivedItems = React.useMemo(() => {
    // In a real implementation, items would have an `archived` or `archivedAt` field
    // For now, we'll assume the initialItems are already filtered
    return initialItems
  }, [initialItems])

  return (
    <CrudProvider config={config} initialItems={archivedItems}>
      <ArchiveContent className={className} />
    </CrudProvider>
  )
}

function ArchiveContent({ className }: { className?: string }) {
  const {
    viewMode,
    filteredItems,
    isLoading,
    config,
  } = useCrudContext()

  if (isLoading) {
    const LoadingState = config.slots?.loadingState
    if (LoadingState) {
      return <LoadingState />
    }
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <p className="text-muted-foreground">Loading archived items...</p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-display font-semibold uppercase tracking-wider text-primary">
            Archived {config.entity.plural}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredItems.length} archived {config.entity.plural.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar />

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              No archived {config.entity.plural.toLowerCase()} found
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'tiles' && <TileView />}
            {viewMode === 'table' && <TableView />}
            {viewMode === 'list' && <ListView />}
          </>
        )}
      </div>

      {/* Bulk Actions */}
      {filteredItems.length > 0 && (
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Select items to restore or delete permanently
            </p>
            <div className="flex items-center gap-2">
              {config.actions?.restore && (
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore Selected
                </Button>
              )}
              {config.actions?.delete && (
                <Button variant="destructive" size="sm">
                  Delete Selected
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <RestoreDialog />
      <DeleteDialog />
    </div>
  )
}

