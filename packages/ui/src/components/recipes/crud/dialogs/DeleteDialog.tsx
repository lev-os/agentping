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
import { Badge } from '../../../ui/badge'

export function DeleteDialog() {
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingItem,
    config,
    refresh,
  } = useCrudContext()

  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!config.onDelete || !deletingItem) return

    setIsDeleting(true)
    try {
      const id = deletingItem[config.primaryKey] as string
      await config.onDelete(id)
      await refresh()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!deletingItem) return null

  // Get display label for the item
  const labelField = config.archive?.labelField || config.columns[0]?.key || config.primaryKey
  const itemLabel = deletingItem[labelField] ? String(deletingItem[labelField]) : String(deletingItem[config.primaryKey])

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete {config.entity.name}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the {config.entity.name.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 border border-destructive/50 bg-destructive/10">
            <Badge variant="destructive">WARNING</Badge>
            <span className="text-sm text-destructive">This is a permanent deletion</span>
          </div>
          <div className="p-3 bg-muted/30 border border-border rounded">
            <p className="text-sm font-mono text-foreground">
              {itemLabel}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



