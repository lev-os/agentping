"use client"

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { useCrudContext } from '../context'
import { Checkbox } from '../../ui/Checkbox'
import { Button } from '../../ui/Button'
import type { ColumnDef } from '../types'

type CrudItem = Record<string, unknown>

interface ListViewProps {
  className?: string
}

export function ListView({ className }: ListViewProps) {
  const {
    filteredItems,
    config,
    selectedIds,
	    setSelectedIds,
	    isLoading,
	    setEditingItem,
	    setIsEditDialogOpen,
	  } = useCrudContext<CrudItem>()

	  const toggleSelectItem = (id: unknown) => {
	    const newSelected = new Set(selectedIds)
	    if (newSelected.has(id)) {
	      newSelected.delete(id)
	    } else {
	      newSelected.add(id)
	    }
	    setSelectedIds(newSelected)
	  }

	  const handleRowClick = (item: CrudItem) => {
	    if (config.actions?.view) {
	      setEditingItem(item)
	      setIsEditDialogOpen(true)
	    }
	  }

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-muted/20 border border-border rounded animate-pulse"
          />
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
        <p className="text-muted-foreground text-sm">
          No {config.entity.plural.toLowerCase()} found
        </p>
      </div>
    )
  }

  // Use custom list component if provided
  const CustomListRow = config.views?.listComponent

  return (
    <div className={cn('space-y-2', className)}>
	      {filteredItems.map((item) => {
	        const itemId = item[config.primaryKey]
	        const isSelected = selectedIds.has(itemId)
	        const hasRowClick = config.actions?.view

        if (CustomListRow) {
          return (
            <div
              key={String(itemId)}
              className={cn(
                'border border-border rounded-lg p-4',
                isSelected && 'bg-primary/5 border-primary'
              )}
            >
              <CustomListRow item={item} />
            </div>
          )
        }

        // Default compact row layout
        return (
          <div
            key={String(itemId)}
            className={cn(
              'flex items-center gap-4 p-4 border border-border rounded-lg transition-colors',
              isSelected && 'bg-primary/5 border-primary',
              hasRowClick && 'cursor-pointer hover:bg-muted/20'
            )}
            onClick={() => hasRowClick && handleRowClick(item)}
          >
            {/* Select checkbox */}
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleSelectItem(itemId)}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Select ${String(itemId)}`}
            />

            {/* Main content - first column as title, rest as metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4">
                {/* Primary column (title) */}
                {config.columns[0] && (
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-semibold uppercase tracking-wider text-foreground truncate">
                      {renderCell(item, config.columns[0])}
                    </div>
                    {config.columns[1] && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {renderCell(item, config.columns[1])}
                      </div>
                    )}
                  </div>
                )}

                {/* Additional columns as badges/metadata */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {config.columns.slice(2).map((column) => (
                    <div key={String(column.key)} className="text-xs text-muted-foreground">
                      {column.type === 'badge' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-mono">
                          {renderCell(item, column)}
                        </span>
                      ) : (
                        <div>
                          <span className="font-mono uppercase text-[10px] tracking-wider opacity-60">
                            {column.label}:
                          </span>{' '}
                          <span className="font-medium">{renderCell(item, column)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            {config.actions && (
              <div
                className="flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {config.slots?.itemActions ? (
                  <config.slots.itemActions item={item} />
                ) : (
                  <div className="flex gap-2">
                    {config.actions.edit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function renderCell<T>(item: T, column: ColumnDef<T>): React.ReactNode {
  const value = item[column.key]

  if (column.render) {
    return column.render(value, item)
  }

  switch (column.type) {
    case 'badge':
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-mono">
          {String(value)}
        </span>
      )
    case 'date':
      return value instanceof Date
        ? value.toLocaleDateString()
        : typeof value === 'string'
          ? new Date(value).toLocaleDateString()
          : String(value)
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value)
    case 'custom':
      return String(value)
    default:
      return <span className="text-sm">{String(value ?? '')}</span>
  }
}
