/**
 * CRUD Recipe - Config-driven CRUD system
 * 
 * Provides a complete CRUD interface with multiple view modes,
 * filtering, dialogs, and archive functionality.
 */

// Core
export { CrudProvider, useCrudContext } from './context'
export type { CrudConfig, ViewMode, ColumnDef, FieldDef, FilterDef, TileCardConfig, ArchiveConfig } from './types'

// Views
export { TileView, TileCard, ViewSwitcher, TableView, ListView } from './views'

// Filters
export { FilterBar } from './filters'

// Forms
export { EntityForm, FieldRenderer } from './forms'

// Dialogs
export { CreateDialog, EditDialog } from './dialogs'

// Layouts
export { CrudListPage, CrudDetailPage, CrudArchivePage } from './layouts'

