"use client"

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { Input } from '../../../ui/input'
import { useCrudContext } from '../context'
import { ViewSwitcher } from '../views/ViewSwitcher'
import { Search } from 'lucide-react'

interface FilterBarProps {
  className?: string
}

export function FilterBar({ className }: FilterBarProps) {
  const { searchQuery, setSearchQuery, config } = useCrudContext()

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 bg-muted/20 border-b border-border',
        className
      )}
    >
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Search ${config.entity.plural.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* View Switcher */}
      {config.views && config.views.available.length > 1 && (
        <ViewSwitcher />
      )}
    </div>
  )
}

