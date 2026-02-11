"use client"

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { useCrudContext } from '../context'
import { Checkbox } from '../../../ui/checkbox'
import { Button } from '../../../ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { ColumnDef } from '../types'

type SortDirection = 'asc' | 'desc' | null
type CrudItem = Record<string, unknown>

interface TableViewProps {
  className?: string
}

export function TableView({ className }: TableViewProps) {
  const {
    filteredItems,
    config,
    selectedIds,
    setSelectedIds,
    isLoading,
    setEditingItem,
    setIsEditDialogOpen,
  } = useCrudContext<CrudItem>()
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  // Sort items
  const sortedItems = React.useMemo(() => {
    if (!sortColumn || !sortDirection || filteredItems.length === 0) return filteredItems

    return [...filteredItems].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal === bVal) return 0

      const comparison =
        typeof aVal === 'string' && typeof bVal === 'string'
          ? aVal.localeCompare(bVal)
          : (aVal as number) < (bVal as number)
            ? -1
            : 1

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredItems, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Cycle: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedItems.length) {
      setSelectedIds(new Set())
    } else {
      const ids = sortedItems.map((item) => item[config.primaryKey])
      setSelectedIds(new Set(ids))
    }
  }

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
      // Navigate to detail page or open view dialog
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
            className="h-12 bg-muted/20 border border-border rounded animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (sortedItems.length === 0) {
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

  const allSelected = sortedItems.length > 0 && selectedIds.size === sortedItems.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < sortedItems.length

  return (
    <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {/* Select all checkbox */}
              <th className="w-12 p-3 text-left">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  className={someSelected ? 'data-[state=unchecked]:bg-primary/30' : ''}
                  aria-label="Select all"
                />
              </th>
              {config.columns.map((column) => {
                const isSorted = sortColumn === column.key
                const canSort = column.sortable !== false

                return (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'p-3 text-left font-display text-xs uppercase tracking-wider text-muted-foreground',
                      canSort && 'cursor-pointer hover:bg-muted/50 transition-colors',
                      column.width && `w-[${column.width}]`
                    )}
                    onClick={() => canSort && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {canSort && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              'h-3 w-3',
                              isSorted && sortDirection === 'asc'
                                ? 'text-primary'
                                : 'text-muted-foreground/30'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'h-3 w-3 -mt-1',
                              isSorted && sortDirection === 'desc'
                                ? 'text-primary'
                                : 'text-muted-foreground/30'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                )
              })}
              {/* Actions column */}
              {config.actions && (
                <th className="w-24 p-3 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const itemId = item[config.primaryKey]
              const isSelected = selectedIds.has(itemId)
              const hasRowClick = config.actions?.view

              return (
                <tr
                  key={String(itemId)}
                  className={cn(
                    'border-b border-border transition-colors',
                    isSelected && 'bg-primary/5',
                    hasRowClick && 'cursor-pointer hover:bg-muted/20'
                  )}
                  onClick={() => hasRowClick && handleRowClick(item)}
                >
                  {/* Select checkbox */}
                  <td className="p-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelectItem(itemId)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${String(itemId)}`}
                    />
                  </td>
                  {/* Data cells */}
                  {config.columns.map((column) => (
                    <td key={String(column.key)} className="p-3">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {/* Actions cell */}
                  {config.actions && (
                    <td
                      className="p-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {config.slots?.itemActions ? (
                        <config.slots.itemActions item={item} />
                      ) : (
                        <div className="flex justify-end gap-2">
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
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderCell<T>(
  item: T,
  column: ColumnDef<T>
): React.ReactNode {
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
