import type { ComponentType } from 'react'

/**
 * CRUD Recipe - Type Definitions
 * 
 * Config-driven CRUD system with multiple view modes, archive functionality,
 * and flexible form rendering.
 */

export type ViewMode = 'list' | 'table' | 'tiles' | 'custom'

export type BadgeVariant = 'default' | 'outline' | 'secondary' | 'destructive' | 'success'

export interface ColumnDef<T> {
  key: keyof T
  label: string
  sortable?: boolean
  type?: 'text' | 'badge' | 'date' | 'number' | 'custom'
  render?: (value: unknown, item: T) => React.ReactNode
  width?: string | number
}

export interface FieldDef<T> {
  key: keyof T
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date' | 'custom'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
  render?: (value: unknown, onChange: (value: unknown) => void) => React.ReactNode
  validation?: (value: unknown) => string | null
}

export interface FilterDef<T> {
  key: keyof T
  label: string
  type: 'text' | 'select' | 'date' | 'boolean'
  options?: Array<{ label: string; value: string | number }>
}

export interface CustomAction<T> {
  id: string
  label: string
  icon?: ComponentType
  variant?: BadgeVariant
  onClick: (item: T) => void | Promise<void>
}

export interface DetailSection<T> {
  id: string
  label: string
  fields?: Array<keyof T>
  component?: ComponentType<{ item: T }>
}

export interface TileCardConfig<T> {
  avatar?: { field: keyof T; type: 'initials' | 'image' }
  title: keyof T
  subtitle?: keyof T | ((item: T) => string)
  badges?: Array<{ field: keyof T; variant: BadgeVariant }>
  stats?: Array<{ field: keyof T; label: string; icon?: ComponentType }>
  primaryAction?: { label: string; action: string }
  expandable?: boolean
}

export interface ArchiveConfig<T> {
  enabled: boolean
  autoArchive?: {
    enabled: boolean
    afterDays?: number
    conditions?: Array<{ field: keyof T; value: unknown }>
  }
  labelField?: keyof T
}

export interface CrudConfig<T> {
  entity: {
    name: string
    plural: string
    icon?: ComponentType
  }
  primaryKey: keyof T

  // Column definitions for table/list views
  columns: ColumnDef<T>[]

  // Form fields for create/edit
  fields?: FieldDef<T>[]

  // Filter definitions
  filters?: FilterDef<T>[]

  // View configuration
  views?: {
    default: ViewMode
    available: ViewMode[]
    // Custom tile renderer (uses existing model card design)
    tileComponent?: ComponentType<{ item: T; onAction: (action: string) => void }>
    // Custom list row renderer
    listComponent?: ComponentType<{ item: T }>
    // Tile card configuration
    tileConfig?: TileCardConfig<T>
  }

  // Archive/trash settings
  archive?: ArchiveConfig<T>

  // Actions available
  actions?: {
    create?: boolean
    edit?: boolean
    delete?: boolean
    view?: boolean
    archive?: boolean // Soft delete to trash
    restore?: boolean // Restore from trash
    move?: boolean // Move to different container
    hide?: boolean // Hide without archiving
    duplicate?: boolean
    custom?: CustomAction<T>[]
  }

  // Detail page config
  detail?: {
    layout?: 'form' | 'sections' | 'tabs' | 'custom'
    sections?: DetailSection<T>[]
    component?: ComponentType<{ item: T }>
  }

  // Slot overrides
  slots?: {
    emptyState?: ComponentType
    loadingState?: ComponentType
    header?: ComponentType
    itemActions?: ComponentType<{ item: T }>
  }

  // Data operations
  onLoad?: () => Promise<T[]>
  onCreate?: (data: Partial<T>) => Promise<T>
  onUpdate?: (id: string, data: Partial<T>) => Promise<T>
  onDelete?: (id: string) => Promise<void>
  onArchive?: (id: string) => Promise<void>
  onRestore?: (id: string) => Promise<void>
}

