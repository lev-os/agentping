"use client"

import * as React from 'react'
import type { CrudConfig, ViewMode } from './types'

interface CrudContextValue<T extends Record<string, unknown>> {
  config: CrudConfig<T>
  items: T[]
  filteredItems: T[]
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedIds: Set<T[keyof T]>
  setSelectedIds: (ids: Set<T[keyof T]>) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  editingItem: T | null
  setEditingItem: (item: T | null) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  deletingItem: T | null
  setDeletingItem: (item: T | null) => void
  isArchiveDialogOpen: boolean
  setIsArchiveDialogOpen: (open: boolean) => void
  archivingItem: T | null
  setArchivingItem: (item: T | null) => void
  isRestoreDialogOpen: boolean
  setIsRestoreDialogOpen: (open: boolean) => void
  restoringItem: T | null
  setRestoringItem: (item: T | null) => void
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

const CrudContext = React.createContext<CrudContextValue<Record<string, unknown>> | null>(null)

export function useCrudContext<T extends Record<string, unknown>>(): CrudContextValue<T> {
  const context = React.useContext(CrudContext)
  if (!context) {
    throw new Error('useCrudContext must be used within CrudProvider')
  }
  return context as CrudContextValue<T>
}

interface CrudProviderProps<T extends Record<string, unknown>> {
  config: CrudConfig<T>
  children: React.ReactNode
  initialItems?: T[]
}

export function CrudProvider<T extends Record<string, unknown>>({
  config,
  children,
  initialItems = [],
}: CrudProviderProps<T>) {
  const [items, setItems] = React.useState<T[]>(initialItems)
  const [filteredItems, setFilteredItems] = React.useState<T[]>(initialItems)
  const [viewMode, setViewMode] = React.useState<ViewMode>(
    config.views?.default || 'tiles'
  )
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<Set<T[keyof T]>>(new Set())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<T | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [deletingItem, setDeletingItem] = React.useState<T | null>(null)
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = React.useState(false)
  const [archivingItem, setArchivingItem] = React.useState<T | null>(null)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false)
  const [restoringItem, setRestoringItem] = React.useState<T | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  // Sync with initialItems when they change (e.g., from async hook)
  React.useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems)
      setFilteredItems(initialItems)
    }
  }, [initialItems])

  // Persist view mode preference
  React.useEffect(() => {
    try {
      const storageKey = `crud-view-${config.entity.name.toLowerCase()}`
      localStorage.setItem(storageKey, viewMode)
    } catch {
      // localStorage unavailable (SSR, sandboxed iframe)
    }
  }, [viewMode, config.entity.name])

  // Load view mode preference
  React.useEffect(() => {
    try {
      const storageKey = `crud-view-${config.entity.name.toLowerCase()}`
      const saved = localStorage.getItem(storageKey)
      if (saved && config.views?.available.includes(saved as ViewMode)) {
        setViewMode(saved as ViewMode)
      }
    } catch {
      // localStorage unavailable (SSR, sandboxed iframe)
    }
  }, [config.entity.name, config.views?.available])

  // Filter items based on search query
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = items.filter((item) => {
      // Search across all string fields
      return Object.values(item as Record<string, unknown>).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        if (typeof value === 'number') {
          return value.toString().includes(query)
        }
        return false
      })
    })
    setFilteredItems(filtered)
  }, [items, searchQuery])

  const loadItems = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (config.onLoad) {
        const loaded = await config.onLoad()
        setItems(loaded)
        setFilteredItems(loaded)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load items'))
    } finally {
      setIsLoading(false)
    }
  }, [config])

  // Load items on mount OR when onLoad changes
  React.useEffect(() => {
    loadItems()
  }, [loadItems])

  const refresh = React.useCallback(async () => {
    await loadItems()
  }, [loadItems])

  const value: CrudContextValue<T> = {
    config,
    items,
    filteredItems,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedIds,
    setSelectedIds,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingItem,
    setEditingItem,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingItem,
    setDeletingItem,
    isArchiveDialogOpen,
    setIsArchiveDialogOpen,
    archivingItem,
    setArchivingItem,
    isRestoreDialogOpen,
    setIsRestoreDialogOpen,
    restoringItem,
    setRestoringItem,
    isLoading,
    error,
    refresh,
  }

  return <CrudContext.Provider value={value as CrudContextValue<Record<string, unknown>>}>{children}</CrudContext.Provider>
}
