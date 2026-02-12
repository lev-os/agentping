# CrudProvider Story Fix Manifest

**Date**: 2026-02-12
**Task**: Fix CrudProvider crashes in Storybook stories

## Shared Helper Created

**File**: `packages/ui/src/stories/.storybook-helpers/mock-crud-decorator.tsx`

Exports:
- `mockCrudConfig` — reusable CrudConfig with Agent entity, name/status columns, table+tiles views
- `mockCrudItems` — 3 sample items (Agent Alpha/Beta/Gamma)
- `withCrudProvider` — Storybook decorator function wrapping Story in CrudProvider

## Files Patched (23)

All files are under `packages/ui/src/stories/migrations/`.

### WebUI Migration Stories (10)

| # | File | Component Import |
|---|------|-----------------|
| 1 | ArchiveDialog.migrated.stories.tsx | `../../components/migrations/archive-dialog` |
| 2 | CreateDialog.migrated.stories.tsx | `../../components/migrations/create-dialog` |
| 3 | DeleteDialog.migrated.stories.tsx | `../../components/migrations/delete-dialog` |
| 4 | EditDialog.migrated.stories.tsx | `../../components/migrations/edit-dialog` |
| 5 | EntityForm.migrated.stories.tsx | `../../components/migrations/entity-form` |
| 6 | FilterBar.migrated.stories.tsx | `../../components/migrations/filter-bar` |
| 7 | ListView.migrated.stories.tsx | `../../components/migrations/list-view` |
| 8 | CrudArchivePage.migrated.stories.tsx | `../../components/migrations/crud-archive-page` |
| 9 | CrudDetailPage.migrated.stories.tsx | `../../components/migrations/crud-detail-page` |
| 10 | CrudListPage.migrated.stories.tsx | `../../components/migrations/crud-list-page` |

### Canonical Recipe Stories (13)

| # | File | Component Import |
|---|------|-----------------|
| 11 | CrudArchiveDialog.migrated.stories.tsx | `../../components/recipes/crud/dialogs/ArchiveDialog` |
| 12 | CrudCreateDialog.migrated.stories.tsx | `../../components/recipes/crud/dialogs/CreateDialog` |
| 13 | CrudDeleteDialog.migrated.stories.tsx | `../../components/recipes/crud/dialogs/DeleteDialog` |
| 14 | CrudEditDialog.migrated.stories.tsx | `../../components/recipes/crud/dialogs/EditDialog` |
| 15 | CrudEntityForm.migrated.stories.tsx | `../../components/recipes/crud/forms/EntityForm` |
| 16 | CrudFieldRenderer.migrated.stories.tsx | `../../components/recipes/crud/forms/FieldRenderer` |
| 17 | CrudFilterBar.migrated.stories.tsx | `../../components/recipes/crud/filters/FilterBar` |
| 18 | CrudListView.migrated.stories.tsx | `../../components/recipes/crud/views/ListView` |
| 19 | CrudRestoreDialog.migrated.stories.tsx | `../../components/recipes/crud/dialogs/RestoreDialog` |
| 20 | CrudTableView.migrated.stories.tsx | `../../components/recipes/crud/views/TableView` |
| 21 | CrudTileCard.migrated.stories.tsx | `../../components/recipes/crud/views/TileCard` |
| 22 | CrudTileView.migrated.stories.tsx | `../../components/recipes/crud/views/TileView` |
| 23 | CrudViewSwitcher.migrated.stories.tsx | `../../components/recipes/crud/views/ViewSwitcher` |

## Already Had Decorators (skipped)

- `TableView.migrated.stories.tsx` — reference pattern, already correct
- `RestoreDialog.migrated.stories.tsx` — already had inline CrudProvider decorator
- `TileView.migrated.stories.tsx` — already had inline CrudProvider decorator
- `ViewSwitcher.migrated.stories.tsx` — already had inline CrudProvider decorator

## Not Needing Decorator

- `TileCard.migrated.stories.tsx` — takes `item`/`config` as direct props, no useCrudContext dependency

## Changes Applied Per File

1. Added `import React from "react"`
2. Added `import { CrudProvider } from "../../components/migrations/crud-context"`
3. Added `import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator"`
4. Added `decorators` array to meta wrapping Story in CrudProvider
