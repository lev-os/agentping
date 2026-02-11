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

export function CreateDialog() {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    config,
    refresh,
  } = useCrudContext()

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (config.onCreate) {
      await config.onCreate(data)
      await refresh()
      setIsCreateDialogOpen(false)
    }
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create {config.entity.name}</DialogTitle>
          <DialogDescription>
            Add a new {config.entity.name.toLowerCase()} to your workspace.
          </DialogDescription>
        </DialogHeader>

        <EntityForm
          onSubmit={handleSubmit}
          onCancel={() => setIsCreateDialogOpen(false)}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
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
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
