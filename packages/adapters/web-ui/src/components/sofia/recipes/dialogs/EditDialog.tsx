"use client"

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/Dialog'
import { Button } from '../../ui/Button'
import { EntityForm } from '../EntityForm'
import { useCrudContext } from '../context'

export function EditDialog() {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingItem,
    config,
    refresh,
  } = useCrudContext()

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (config.onUpdate && editingItem) {
      const id = editingItem[config.primaryKey] as string
      await config.onUpdate(id, data)
      await refresh()
      setIsEditDialogOpen(false)
    }
  }

  if (!editingItem) return null

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {config.entity.name}</DialogTitle>
          <DialogDescription>
            Update the {config.entity.name.toLowerCase()} details.
          </DialogDescription>
        </DialogHeader>

        <EntityForm
          initialData={editingItem as Record<string, unknown>}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditDialogOpen(false)}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="entity-form"
            onClick={(e) => {
              e.preventDefault()
              const form = document.querySelector('form')
              form?.requestSubmit()
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
