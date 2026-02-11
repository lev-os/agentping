"use client"

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { CrudProvider } from '../context'
import { FilterBar } from '../filters'
import { TileView, TableView, ListView } from '../views'
import { CreateDialog, EditDialog, DeleteDialog, ArchiveDialog, RestoreDialog } from '../dialogs'
import { Button } from '../../../ui/button'
import { Plus } from 'lucide-react'
import type { CrudConfig } from '../types'
import { useCrudContext } from '../context'

interface CrudListPageProps<T extends Record<string, unknown>> {
  config: CrudConfig<T>
  initialItems?: T[]
  className?: string
}

export function CrudListPage<T extends Record<string, unknown>>({
  config,
  initialItems = [],
  className,
}: CrudListPageProps<T>) {
  return (
    <CrudProvider config={config} initialItems={initialItems}>
      <div className={cn('flex flex-col h-full', className)}>
        {/* Header with actions */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-display font-semibold uppercase tracking-wider text-primary">
              {config.entity.plural}
            </h1>
            {config.slots?.header && <config.slots.header />}
          </div>
          <CreateButton />
        </div>

        {/* Filter bar */}
        <FilterBar />

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <CrudContent />
        </div>

        {/* Dialogs */}
        <CreateDialog />
        <EditDialog />
        <DeleteDialog />
        <ArchiveDialog />
        <RestoreDialog />
      </div>
    </CrudProvider>
  )
}

function CreateButton() {
  const { setIsCreateDialogOpen, config } = useCrudContext()
  
  if (!config.actions?.create) return null
  
  return (
    <Button
      onClick={() => setIsCreateDialogOpen(true)}
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
      Create {config.entity.name}
    </Button>
  )
}

function CrudContent() {
  const { viewMode, isLoading, config } = useCrudContext()

  if (isLoading) {
    const LoadingState = config.slots?.loadingState
    if (LoadingState) {
      return <LoadingState />
    }
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  switch (viewMode) {
    case 'tiles':
      return <TileView />
    case 'table':
      return <TableView />
    case 'list':
      return <ListView />
    default:
      return <TileView />
  }
}

