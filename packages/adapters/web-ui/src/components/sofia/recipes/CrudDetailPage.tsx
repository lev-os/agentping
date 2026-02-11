"use client"

import * as React from 'react'
import { cn } from '../../../lib/utils'
import { CrudProvider } from './context'
import { EntityForm } from './EntityForm'
import { Button } from '../ui/Button'
import { Archive, Trash2, Eye, EyeOff, Move, Copy } from 'lucide-react'
import type { CrudConfig } from './types'
import { useCrudContext } from './context'
import { ArchiveDialog, DeleteDialog } from './dialogs'

interface CrudDetailPageProps<T extends Record<string, unknown>> {
  config: CrudConfig<T>
  itemId: T[keyof T]
  initialItem?: T
  className?: string
}

export function CrudDetailPage<T extends Record<string, unknown>>({
  config,
  itemId,
  initialItem,
  className,
}: CrudDetailPageProps<T>) {
  return (
    <CrudProvider config={config} initialItems={initialItem ? [initialItem] : []}>
      <DetailContent itemId={itemId} className={className} />
    </CrudProvider>
  )
}

function DetailContent<T extends Record<string, unknown>>({
  itemId,
  className,
}: {
  itemId: T[keyof T]
  className?: string
}) {
  const {
    items,
    config,
    isLoading,
    setEditingItem,
    setDeletingItem,
    setIsDeleteDialogOpen,
    setArchivingItem,
    setIsArchiveDialogOpen,
    refresh,
  } = useCrudContext<T>()

  const item = React.useMemo(() => {
    return items.find((i) => i[config.primaryKey] === itemId)
  }, [items, itemId, config.primaryKey])

  const [isEditing, setIsEditing] = React.useState(false)

  React.useEffect(() => {
    if (item) {
      setEditingItem(item)
    }
  }, [item, setEditingItem])

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground">
          {config.entity.name} not found
        </p>
      </div>
    )
  }

  const handleSave = async (data: Record<string, unknown>) => {
    if (config.onUpdate) {
      await config.onUpdate(itemId as never, data as Partial<T>)
      await refresh()
      setIsEditing(false)
    }
  }

  // Get display label
  const labelField = config.archive?.labelField || config.columns[0]?.key || config.primaryKey
  const itemLabel = item[labelField] ? String(item[labelField]) : String(item[config.primaryKey])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-display font-semibold uppercase tracking-wider text-primary">
            {itemLabel}
          </h1>
          {config.slots?.header && <config.slots.header />}
        </div>
        <div className="flex items-center gap-2">
          {config.actions?.edit && (
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isEditing ? (
          <EntityForm
            initialData={item as Record<string, unknown>}
            onSubmit={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <DetailView item={item as Record<string, unknown>} />
        )}
      </div>

      {/* Action Bar */}
      <div className="border-t border-border p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.actions?.view && (
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            )}
            {config.actions?.duplicate && (
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
            )}
            {config.actions?.move && (
              <Button variant="outline" size="sm">
                <Move className="h-4 w-4 mr-2" />
                Move
              </Button>
            )}
            {config.actions?.hide && (
              <Button variant="outline" size="sm">
                <EyeOff className="h-4 w-4 mr-2" />
                Hide
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {config.actions?.archive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setArchivingItem(item)
                  setIsArchiveDialogOpen(true)
                }}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            )}
            {config.actions?.delete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeletingItem(item)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ArchiveDialog />
      <DeleteDialog />
    </div>
  )
}

function DetailView<T extends Record<string, unknown>>({ item }: { item: T }) {
  const { config } = useCrudContext<T>()

  // Use custom detail component if provided
  if (config.detail?.component) {
    const DetailComponent = config.detail.component
    return <DetailComponent item={item} />
  }

  // Use sections layout
  if (config.detail?.layout === 'sections' && config.detail.sections) {
    return (
      <div className="space-y-6">
        {config.detail.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h2 className="text-lg font-display font-semibold uppercase tracking-wider text-foreground border-b border-border pb-2">
              {section.label}
            </h2>
            {section.component ? (
              <section.component item={item} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields?.map((field) => {
                  const column = config.columns.find((col) => col.key === field)
                  if (!column) return null
                  const value = item[field]
                  return (
                    <div key={String(field)}>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        {column.label}
                      </label>
                      <div className="mt-1 text-sm font-mono text-foreground">
                        {column.render
                          ? column.render(value, item)
                          : String(value ?? '')}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Default: show all columns
  return (
    <div className="space-y-4">
      {config.columns.map((column) => {
        const value = item[column.key]
        return (
          <div key={String(column.key)}>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {column.label}
            </label>
            <div className="mt-1 text-sm font-mono text-foreground">
              {column.render ? column.render(value, item) : String(value ?? '')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

