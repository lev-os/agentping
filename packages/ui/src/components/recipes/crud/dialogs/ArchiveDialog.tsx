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

export function ArchiveDialog() {
  const {
    isArchiveDialogOpen,
    setIsArchiveDialogOpen,
    archivingItem,
    config,
    refresh,
  } = useCrudContext()

  const [isArchiving, setIsArchiving] = React.useState(false)

  const handleArchive = async () => {
    if (!config.onArchive || !archivingItem) return

    setIsArchiving(true)
    try {
      const id = archivingItem[config.primaryKey] as string
      await config.onArchive(id)
      await refresh()
      setIsArchiveDialogOpen(false)
    } catch (error) {
      console.error('Failed to archive:', error)
    } finally {
      setIsArchiving(false)
    }
  }

  if (!archivingItem) return null

  // Get display label for the item
  const labelField = config.archive?.labelField || config.columns[0]?.key || config.primaryKey
  const itemLabel = archivingItem[labelField] ? String(archivingItem[labelField]) : String(archivingItem[config.primaryKey])

  return (
    <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Archive {config.entity.name}</DialogTitle>
          <DialogDescription>
            This will move the {config.entity.name.toLowerCase()} to the archive. You can restore it later.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="p-3 bg-muted/30 border border-border rounded">
            <p className="text-sm font-mono text-foreground">
              {itemLabel}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Archived items can be restored from the archive page.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsArchiveDialogOpen(false)}
            disabled={isArchiving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleArchive}
            disabled={isArchiving}
          >
            {isArchiving ? 'Archiving...' : 'Archive'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


