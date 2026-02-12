# 00 Handoff - Component Consolidation Baseline

This baseline is generated from filesystem paths (no manual counting) so consolidation tracking stays deterministic.

## Current audited totals
- Total components (filtered): 415
- packages/ui/src/components: 66
- packages/studio/src/renderer/components: 54
- packages/adapters/web-ui/src/components: 281
- packages/canvas/src/components: 6
- packages/dashboard-manager-ui/src/components: 8

## Canonical inventory file
- community/agentping/docs/00-agentping-components.csv

CSV columns:
- source, component_path, component_name
- migrated_path, mode
- migrated, agent_visual_qa, human_qa, swapped
- notes

Status values:
- pending, pass, fail

## Duplicate basename hotspots (top 30)
- LogViewer.tsx (3 roots: dashboard-manager-ui|studio|adapters)
- ArchiveDialog.tsx (2 roots: ui|adapters)
- ArtifactBadge.tsx (2 roots: ui|adapters)
- Badge.tsx (2 roots: adapters|studio)
- Button.tsx (2 roots: studio|adapters)
- CanvasRenderer.tsx (2 roots: canvas|adapters)
- ChartSkeleton.tsx (2 roots: adapters|ui)
- CodeDiffViewer.tsx (2 roots: studio|adapters)
- CollapseButton.tsx (2 roots: ui|adapters)
- ConnectionStatus.tsx (2 roots: canvas|adapters)
- ContextMenu.tsx (2 roots: studio|adapters)
- CreateDialog.tsx (2 roots: adapters|ui)
- CrudArchivePage.tsx (2 roots: ui|adapters)
- CrudDetailPage.tsx (2 roots: adapters|ui)
- CrudListPage.tsx (2 roots: adapters|ui)
- DashboardWidget.tsx (2 roots: ui|adapters)
- DeleteDialog.tsx (2 roots: ui|adapters)
- DocCard.tsx (2 roots: ui|adapters)
- EditDialog.tsx (2 roots: ui|adapters)
- EmptyState.tsx (2 roots: studio|adapters)
- EntityForm.tsx (2 roots: ui|adapters)
- FieldRenderer.tsx (2 roots: adapters|ui)
- FilterBar.tsx (2 roots: adapters|ui)
- GaugeSkeleton.tsx (2 roots: adapters|ui)
- GraphView.tsx (2 roots: adapters|ui)
- GridSkeleton.tsx (2 roots: ui|adapters)
- IconButton.tsx (2 roots: adapters|studio)
- Input.tsx (2 roots: adapters|studio)
- KanbanBoard.tsx (2 roots: canvas|adapters)
- ListView.tsx (2 roots: ui|adapters)

## Process (batch)
1. Pick a batch by source prefix in 00-agentping-components.csv.
2. Migrate into packages/ui/src/components/... and set migrated=pass with migrated_path.
3. Run agent visual QA and set agent_visual_qa.
4. Run human QA and set human_qa.
5. Swap imports in target app and set swapped.

## Notes
- Existing manual tracker remains at community/agentping/docs/progress.txt for in-flight items.
- This file is source-of-truth for full inventory coverage and batch planning.
