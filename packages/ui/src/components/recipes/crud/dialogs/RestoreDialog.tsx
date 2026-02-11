"use client"

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../ui/dialog'
import { Button } from '../../../ui/button'
import { useCrudContext } from '../context'

export function RestoreDialog() {
  const {
    isRestoreDialogOpen,
    setIsRestoreDialogOpen,
    restoringItem,
    config,
    refresh,
  } = useCrudContext()

  const [isRestoring, setIsRestoring] = React.useState(false)

  const handleRestore = async () => {
    if (!config.onRestore || !restoringItem) return

    setIsRestoring(true)
    try {
      const id = restoringItem[config.primaryKey] as string
      await config.onRestore(id)
      await refresh()
      setIsRestoreDialogOpen(false)
    } catch (error) {
      console.error('Failed to restore:', error)
    } finally {
      setIsRestoring(false)
    }
  }

  if (!restoringItem) return null

  // Get display label for the item
  const labelField = config.archive?.labelField || config.columns[0]?.key || config.primaryKey
  const itemLabel = restoringItem[labelField] ? String(restoringItem[labelField]) : String(restoringItem[config.primaryKey])

  return (
    <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restore {config.entity.name}</DialogTitle>
          <DialogDescription>
            This will restore the {config.entity.name.toLowerCase()} from the archive.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="p-3 bg-muted/30 border border-border rounded">
            <p className="text-sm font-mono text-foreground">
              {itemLabel}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            The item will be restored to the main list.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsRestoreDialogOpen(false)}
            disabled={isRestoring}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? 'Restoring...' : 'Restore'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



